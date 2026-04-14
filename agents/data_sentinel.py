import json
from tools.jira_tool import fetch_jira_metrics
from tools.github_tool import fetch_github_metrics
from tools.confluence_tool import fetch_confluence_metrics
from tools.slack_tool import fetch_slack_metrics
from tools.hrms_tool import fetch_hrms_metrics

def gather_evidence(employee_email: str) -> str:
    """
    Data Sentinel — The Intelligence Backbone.
    
    Orchestrates data gathering from ALL 5 integrated sources:
      - HRMS      : Goals, Ratings, Attendance, Past Cycles (System of Record)
      - Jira      : Sensor A (Optical) — Ticket throughput, velocity, P1 count
      - GitHub    : Sensor A (Optical) — Code contributions, PR reviews, commits
      - Confluence: Sensor C (Scanning) — Documentation, knowledge sharing
      - Slack     : Sensor C (Scanning) — Ambient collaboration, EWS signals

    Returns a unified JSON string constituting the employee's Evidence Ledger.
    """
    hrms_data       = fetch_hrms_metrics(employee_email)
    jira_data       = fetch_jira_metrics(employee_email)
    github_data     = fetch_github_metrics(employee_email)
    confluence_data = fetch_confluence_metrics(employee_email)
    slack_data      = fetch_slack_metrics(employee_email)

    # --- Derive Fused Signals ---
    jira_ev    = jira_data.get("evidence", {})
    github_ev  = github_data.get("evidence", {})
    conf_ev    = confluence_data.get("evidence", {})
    slack_ev   = slack_data.get("evidence", {})
    hrms_ev    = hrms_data.get("evidence", {})
    ews_sig    = slack_ev.get("ews_signals", {})
    slack_bench = slack_data.get("benchmark_comparison", {})
    jira_lmc   = jira_data.get("lmc_flags", {})

    # Sensor A score (Jira + GitHub weighted)
    sensor_a_score = min(100, int(
        (jira_ev.get("tickets_completed", 0) / 20 * 50) +
        (github_ev.get("prs_merged", 0) / 15 * 30) +
        (github_ev.get("prs_reviewed", 0) / 30 * 20)
    ))
    
    # Sensor C score (Confluence + Slack weighted)
    sensor_c_score = min(100, int(
        (conf_ev.get("invisible_work_score", 0) * 0.5) +
        (slack_bench.get("team_catalyst_score", 0) * 0.5)
    ))

    # EWS determination
    ews_triggered = (
        ews_sig.get("frequency_drop_pct", 0) > 25 or
        ews_sig.get("collaboration_withdrawal", False) or
        jira_ev.get("reopen_rate_pct", 0) > 12
    )

    # LMC determination
    lmc_active = jira_lmc.get("external_blockers_active", 0) >= 2

    # Bias neutralizer: check manager vs objective signals
    manager_rating = hrms_ev.get("manager_draft_rating", 3)
    # Normalize sensor_a to a 1-5 scale
    ops_from_sensors = round(1 + (sensor_a_score / 100) * 4, 2)
    bias_flag = abs(ops_from_sensors - manager_rating) > 1.2

    # Fusion classification
    if sensor_a_score >= 60 and sensor_c_score >= 60:
        fusion_classification = "Balanced Contributor"
    elif sensor_a_score < 40 and sensor_c_score >= 60:
        fusion_classification = "Team Catalyst"
    elif sensor_a_score >= 60 and sensor_c_score < 40:
        fusion_classification = "Deep Executor"
    elif ews_triggered:
        fusion_classification = "EWS Candidate"
    else:
        fusion_classification = "Standard Contributor"

    evidence = {
        "employee": employee_email,
        "data_sources_active": ["HRMS", "Jira", "GitHub", "Confluence", "Slack"],
        "hrms":      hrms_data,
        "jira":      jira_data,
        "github":    github_data,
        "confluence":confluence_data,
        "slack":     slack_data,
        "fused_signals": {
            "sensor_a_score": sensor_a_score,
            "sensor_c_score": sensor_c_score,
            "ops_objective_score": ops_from_sensors,
            "fusion_classification": fusion_classification,
            "ews_triggered": ews_triggered,
            "lmc_active": lmc_active,
            "bias_neutralizer_flag": bias_flag,
            "invisible_work_detected": conf_ev.get("invisible_work_score", 0) > 70 or
                                       slack_ev.get("peer_mentions_in_help_threads", 0) > 10
        }
    }
    return json.dumps(evidence, indent=2)


if __name__ == "__main__":
    print(gather_evidence("aditya@effihr.mock"))
