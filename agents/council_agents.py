import os
import json
from langchain_core.prompts import PromptTemplate
from utils.llm import get_llm

def load_prompt(filename: str) -> str:
    path = os.path.join(os.path.dirname(__file__), '..', 'prompts', filename)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def get_mock_response(agent_type: str, email: str) -> str:
    """Returns a highly unique, specific mock response based on the agent and the employee name."""
    name = email.split('@')[0].capitalize()
    
    # Mocking behaviors as strictly prescribed by the AIC 2026 Documentation
    mock_data = {
        "aditya": {
            "equity_guardian": "Bias Neutralizer Flag: OPS is 4.2. Current draft 3/5 is 1.2σ below historical mean. Cited Evidence: Resolved 3 P1 tickets, reviewed 12 PRs, cited in 8 Slack threads. Recommend Review.",
            "narrative_architect": "Aditya resolved a critical payment gateway bug (P1) ahead of schedule. Peer reviews indicate high cross-functional domain recognition.",
            "growth_oracle": "High Invisible Work (Confluence docs flagged 9 times). Suggest transitioning Aditya to architecture mentorship programs.",
            "alignment_harmonizer": "effiPrecision: Out-of-Tolerance (OOT) prevented. Volume was lower, but LMC proxy fired (understaffed team). Nominal dimension normalized."
        },
        "riya": {
            "equity_guardian": "No bias found. All language is objective.",
            "narrative_architect": "Riya has struggled completing assigned frontend components compared to her previous quarter's historic baseline.",
            "growth_oracle": "Early Warning System (EWS) Triggered: 32% output drop observed over 18 days. Collaboration metrics also reduced. A supportive check-in is recommended.",
            "alignment_harmonizer": "effiPrecision: Cpk dropping < 1.0 (Non-capable process). No external Measurement System Uncertainty (MSU) factors present."
        }
    }
    
    # Default mock
    emp_map = mock_data.get(name.lower(), {
        "equity_guardian": "No bias detected. Manager ratings align with output capability (Cpk > 1.33).",
        "narrative_architect": "Consistently delivered robust solutions. High alignment with quarterly metrics.",
        "growth_oracle": "Ready for cross-functional leadership training.",
        "alignment_harmonizer": "effiPrecision: Validated acceptable deviation band. Process capable."
    })
    
    return emp_map.get(agent_type, "Generated valid evidence-based insight.")

def run_agent(agent_prompt_file: str, evidence: str, agent_type: str) -> str:
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key or api_key == "your_api_key_here":
        try:
            evidence_json = json.loads(evidence)
            email = evidence_json.get("employee", "aditya@effihr.mock")
        except:
            email = "aditya"
        return get_mock_response(agent_type, email)
        
    llm = get_llm()
    prompt_text = load_prompt(agent_prompt_file)
    prompt = PromptTemplate.from_template(prompt_text)
    chain = prompt | llm
    
    response = chain.invoke({"evidence": evidence})
    return response.content if hasattr(response, 'content') else str(response)

def run_equity_guardian(evidence: str) -> str:
    return run_agent("equity_guardian.txt", evidence, "equity_guardian")

def run_narrative_architect(evidence: str) -> str:
    return run_agent("narrative_architect.txt", evidence, "narrative_architect")

def run_growth_oracle(evidence: str) -> str:
    return run_agent("growth_oracle.txt", evidence, "growth_oracle")

def run_alignment_harmonizer(evidence: str) -> str:
    return run_agent("alignment_harmonizer.txt", evidence, "alignment_harmonizer")
