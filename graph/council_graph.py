from typing import TypedDict, Optional
from langgraph.graph import StateGraph, START, END
from agents.data_sentinel import gather_evidence
from agents.council_agents import (
    run_equity_guardian,
    run_narrative_architect,
    run_growth_oracle,
    run_alignment_harmonizer
)
import time

class CouncilState(TypedDict):
    employee_email: str
    evidence: Optional[str]
    narrative_draft: Optional[str]
    equity_flags: Optional[str]
    growth_paths: Optional[str]
    alignment_score: Optional[str]
    final_review: Optional[str]
    transcript: Optional[str]

def gather_data_node(state: CouncilState) -> CouncilState:
    email = state["employee_email"]
    evidence = gather_evidence(email)
    return {"evidence": evidence}

def run_parallel_agents_node(state: CouncilState) -> CouncilState:
    evidence = state["evidence"]
    
    # In LangGraph we can just run them synchronously for simplicity here.
    # To truly parallelize, we could use Python threads or asyncio, 
    # but regular sequential execution is fine for the hackathon demo if it's fast.
    # Actually, asyncio would be better, but let's keep it robust and simple.
    
    narrative = run_narrative_architect(evidence)
    equity = run_equity_guardian(evidence)
    growth = run_growth_oracle(evidence)
    alignment = run_alignment_harmonizer(evidence)
    
    return {
        "narrative_draft": narrative,
        "equity_flags": equity,
        "growth_paths": growth,
        "alignment_score": alignment
    }

def conductor_decision_node(state: CouncilState) -> CouncilState:
    import json
    evidence_data = json.loads(state['evidence'])
    jira_tix = evidence_data['jira']['evidence']['tickets_completed']
    github_prs = evidence_data['github']['evidence']['prs_merged']
    data_sentinel_summary = f"Gathered {jira_tix} Jira tickets, {github_prs} GitHub PRs, and cross-referenced with Confluence activity records. Normalised against team benchmark."

    # Aggregates everything into a final draft and a transcript
    transcript = f"""
=== DEBATE TRANSCRIPT ===
1. Data Sentinel:
{data_sentinel_summary}

2. Narrative Architect:
{state['narrative_draft']}

3. Equity Guardian:
{state['equity_flags']}

4. Growth Oracle:
{state['growth_paths']}

5. Alignment Harmonizer:
{state['alignment_score']}
=========================
"""
    
    final_review = f"""
PERFORMANCE REVIEW FOR: {state['employee_email']}

[1] Narrative & Achievements:
{state['narrative_draft']}

[2] Alignment with Goals:
{state['alignment_score']}

[3] Growth & Development:
{state['growth_paths']}

[!!] Internal Fairness Check (Manager Only):
{state['equity_flags']}
"""
    
    return {"final_review": final_review, "transcript": transcript}

def build_graph():
    builder = StateGraph(CouncilState)
    
    builder.add_node("gather_data", gather_data_node)
    builder.add_node("deliberate", run_parallel_agents_node)
    builder.add_node("conductor", conductor_decision_node)
    
    builder.add_edge(START, "gather_data")
    builder.add_edge("gather_data", "deliberate")
    builder.add_edge("deliberate", "conductor")
    builder.add_edge("conductor", END)
    
    graph = builder.compile()
    return graph

# Example usage
if __name__ == "__main__":
    g = build_graph()
    res = g.invoke({"employee_email": "arjun@effihr.mock"})
    print(res["final_review"])
