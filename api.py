from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from dotenv import load_dotenv
import os

load_dotenv() # Load environment variables from .env

from graph.council_graph import build_graph
from agents.council_agents import get_mock_response
from tools.hrms_tool import fetch_hrms_metrics
from tools.jira_tool import fetch_jira_metrics
from tools.github_tool import fetch_github_metrics
from tools.confluence_tool import fetch_confluence_metrics
from tools.slack_tool import fetch_slack_metrics
from agents.data_sentinel import gather_evidence

app = FastAPI(title="effiAgent API — Multi-Source Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request Models ────────────────────────────────────────────────────────────

class EvaluationRequest(BaseModel):
    employee_email: str

class ChatRequest(BaseModel):
    message: str
    employee_context: str

# ─── Helpers ──────────────────────────────────────────────────────────────────

def load_employees():
    path = os.path.join(os.path.dirname(__file__), 'data', 'employees.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except:
        return []

# ─── Core Endpoints ───────────────────────────────────────────────────────────

@app.get("/api/employees")
def get_employees():
    """Returns all employees (stripped of internal HRMS details for list view)."""
    employees = load_employees()
    # Return lightweight list for dropdowns
    return {"employees": [
        {"name": e["name"], "email": e["email"], "role": e["role"],
         "department": e.get("department",""), "grade": e.get("grade",""),
         "employee_id": e.get("employee_id",""), "location": e.get("location","")}
        for e in employees
    ]}

@app.post("/api/evaluate")
def evaluate_employee(req: EvaluationRequest):
    """
    Full multi-agent evaluation. Builds and invokes the LangGraph council.
    Returns evidence from all 5 sources + agent deliberation + ops_score.
    """
    graph = build_graph()
    try:
        result = graph.invoke({"employee_email": req.employee_email})
        evidence_json = json.loads(result.get('evidence', '{}'))
        fused = evidence_json.get("fused_signals", {})

        return {
            "status": "success",
            "evidence": evidence_json,
            "final_review": result.get("final_review", ""),
            "transcript": result.get("transcript", ""),
            "ops_score": fused.get("ops_objective_score", 3.5),
            "fusion_classification": fused.get("fusion_classification", "Standard Contributor"),
            "ews_triggered": fused.get("ews_triggered", False),
            "lmc_active": fused.get("lmc_active", False),
            "bias_flag": fused.get("bias_neutralizer_flag", False),
            "invisible_work_detected": fused.get("invisible_work_detected", False),
            "data_sources": evidence_json.get("data_sources_active", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Per-Source Sensor Endpoints ──────────────────────────────────────────────

@app.get("/api/sources/hrms/{employee_email:path}")
def get_hrms_data(employee_email: str):
    """Sensor: HRMS — Goals, ratings, attendance, past cycles."""
    try:
        return fetch_hrms_metrics(employee_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sources/jira/{employee_email:path}")
def get_jira_data(employee_email: str):
    """Sensor A: Jira — Ticket throughput, velocity, P1 resolution."""
    return fetch_jira_metrics(employee_email)

@app.get("/api/sources/github/{employee_email:path}")
def get_github_data(employee_email: str):
    """Sensor A: GitHub — Code contributions, PRs, reviews."""
    return fetch_github_metrics(employee_email)

@app.get("/api/sources/confluence/{employee_email:path}")
def get_confluence_data(employee_email: str):
    """Sensor C: Confluence — Documentation, knowledge sharing."""
    return fetch_confluence_metrics(employee_email)

@app.get("/api/sources/slack/{employee_email:path}")
def get_slack_data(employee_email: str):
    """Sensor C: Slack — Ambient collaboration, EWS signals (aggregate only)."""
    return fetch_slack_metrics(employee_email)

@app.get("/api/sources/all/{employee_email:path}")
def get_all_sources(employee_email: str):
    """Returns all 5 data sources in one call — used by the Data Weaver panel."""
    return {
        "employee_email": employee_email,
        "hrms":       fetch_hrms_metrics(employee_email),
        "jira":       fetch_jira_metrics(employee_email),
        "github":     fetch_github_metrics(employee_email),
        "confluence": fetch_confluence_metrics(employee_email),
        "slack":      fetch_slack_metrics(employee_email),
    }

@app.get("/api/sources/fusion/{employee_email:path}")
def get_fusion_signals(employee_email: str):
    """Returns only the fused multi-sensor signals for quick dashboard loads."""
    try:
        ev = json.loads(gather_evidence(employee_email))
        return ev.get("fused_signals", {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Chat Endpoint ────────────────────────────────────────────────────────────

@app.post("/api/chat")
def chat_assist(req: ChatRequest):
    """Intelligence Assistant — context-aware Q&A about the current employee session."""
    msg = req.message.lower()
    email = req.employee_context
    
    # 1. Gather real evidence for context
    try:
        ev_json = gather_evidence(email)
        ev = json.loads(ev_json)
    except:
        return {"reply": "I am unable to access the metrology ledger for this subject at the moment."}

    name = ev.get("hrms", {}).get("name", email.split('@')[0])
    fused = ev.get("fused_signals", {})
    jira = ev.get("jira", {}).get("evidence", {})
    github = ev.get("github", {}).get("evidence", {})
    slack_bench = ev.get("slack", {}).get("benchmark_comparison", {})
    conf = ev.get("confluence", {}).get("evidence", {})

    # 2. Reasoning Engine (Deterministic Agentic Logic)
    
    if "help" in msg or "who" in msg:
        return {"reply": f"I am the Arbiter Assistant. I hold live context for {name} from all 5 integrated data sources: HRMS, Jira, GitHub, Confluence, and Slack. Ask me about their tickets, PRs, invisible work, or performance calibration."}

    if "jira" in msg or "ticket" in msg or "velocity" in msg:
        tix = jira.get("tickets_completed", 0)
        p1 = jira.get("p1_tickets_resolved", 0)
        return {"reply": f"Inspection of Jira Sensor A for {name} shows {tix} tickets completed this cycle, including {p1} P1-priority items. Historical velocity trend is {jira.get('velocity_trend', 'stable')}."}

    if "github" in msg or "pr" in msg or "code" in msg or "commit" in msg:
        prs = github.get("prs_merged", 0)
        commits = github.get("commits", 0)
        return {"reply": f"GitHub Sensor A data for {name}: {prs} PRs merged and {commits} commits recorded. Code review turnaround is currently {github.get('review_turnaround_hrs', 'nominal')} hours."}

    if "slack" in msg or "collaboration" in msg or "team" in msg:
        score = slack_bench.get("team_catalyst_score", 0)
        classification = slack_bench.get("classification", "Balanced")
        return {"reply": f"Slack Sensor C (Ambient Collaboration) analysis for {name} yields a Team Catalyst score of {score}/100. Subject is classified as a '{classification}' based on cross-channel influence radius."}

    if "confluence" in msg or "doc" in msg or "knowledge" in msg or "invisible" in msg:
        score = conf.get("invisible_work_score", 0)
        refs = conf.get("docs_referenced_by_peers", 0)
        return {"reply": f"Confluence Sensor C indicates {name} has an Invisible Work score of {score}/100. Their documentation has been referenced by peers {refs} times this month, which is highly significant for technical alignment."}

    if "bias" in msg or "rating" in msg or "manager" in msg:
        flag = fused.get("bias_neutralizer_flag", False)
        ops = fused.get("ops_objective_score", 3.5)
        if flag:
            return {"reply": f"Bias Neutralizer has fired for {name}. The manager's draft rating is significantly divergent from the Objective Performance Score of {ops}/5.0. I recommend a calibration session using the provided evidence ledger."}
        return {"reply": f"No significant bias detected for {name}. Manager rating is within the acceptable 1.2σ deviation from the Objective Performance Score ({ops}/5.0)."}

    if "ews" in msg or "warning" in msg or "drop" in msg or "risk" in msg:
        triggered = fused.get("ews_triggered", False)
        if triggered:
            return {"reply": f"Early Warning System (EWS) is ACTIVE for {name}. We've detected a significant drop in Slack collaboration and a downward trend in Jira velocity. A support-driven check-in is advised."}
        return {"reply": f"EWS signals are nominal for {name}. No recent drops in output or collaboration patterns detected."}

    if "performance" in msg or "score" in msg or "overall" in msg:
        ops = fused.get("ops_objective_score", 3.5)
        cls = fused.get("fusion_classification", "Contributor")
        return {"reply": f"Overall assessment for {name}: {cls} with an Objective Performance Score of {ops}/5.0. This score captures both Sensor A (Output) and Sensor C (Ambient Influence) data loops."}

    if "lmc" in msg or "tolerance" in msg or "adjustment" in msg:
        active = fused.get("lmc_active", False)
        return {"reply": f"The LMC (Least Material Condition) protocol is {'ACTIVE' if active else 'READY'}. It automatically widens behavioral tolerance zones for employees suffering from systemic capacity drift (understaffing). This ensures {name} is not penalized for organizational friction."}

    if "spc" in msg or "calibration" in msg or "statistical" in msg:
        return {"reply": "Statistical Process Control (SPC) is being monitored at the organizational level. My Orchestrator node tracks the Cpk index of all reviews to ensure the feedback loop is within a 3-sigma control band, preventing rating inflation or systemic bias."}

    # 3. Fallback to general Metrology Node support
    return {"reply": f"I've analyzed the ledger for {name}. Based on {len(ev.get('data_sources_active', []))} active data sources, {name} demonstrates stable performance. Could you specify which metric (Jira, GitHub, Slack, etc.) you'd like to dive deeper into?"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
