"""
Jira / Ticketing Tool — Data Weaver Sensor A (Optical)
Real implementation: OAuth2 + Jira REST API v3
Mock implementation: Deterministic per-employee data for demo fidelity
"""

JIRA_PROFILES = {
    "aditya@effihr.mock": {
        "source": "Jira",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "tickets_completed": 19,
            "story_points_completed": 72,
            "average_cycle_time_days": 1.8,
            "bug_fix_count": 3,
            "p1_tickets_resolved": 3,
            "p2_tickets_resolved": 7,
            "sprint_velocity_trend": [14, 16, 18, 19],
            "tickets_owned_cross_team": 4,
            "reopen_rate_pct": 2.1
        },
        "benchmark_comparison": {
            "tickets_completed_diff_vs_peer": 7,
            "cycle_time_diff_vs_peer": -1.2,
            "velocity_trend": "improving"
        },
        "lmc_flags": {
            "external_blockers_active": 0,
            "sprint_debt_tickets": 1
        }
    },
    "riya@effihr.mock": {
        "source": "Jira",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "tickets_completed": 5,
            "story_points_completed": 18,
            "average_cycle_time_days": 5.4,
            "bug_fix_count": 1,
            "p1_tickets_resolved": 0,
            "p2_tickets_resolved": 2,
            "sprint_velocity_trend": [14, 8, 6, 5],
            "tickets_owned_cross_team": 0,
            "reopen_rate_pct": 18.0
        },
        "benchmark_comparison": {
            "tickets_completed_diff_vs_peer": -7,
            "cycle_time_diff_vs_peer": 3.6,
            "velocity_trend": "declining"
        },
        "lmc_flags": {
            "external_blockers_active": 2,
            "sprint_debt_tickets": 5
        }
    },
    "arjun@effihr.mock": {
        "source": "Jira",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "tickets_completed": 14,
            "story_points_completed": 55,
            "average_cycle_time_days": 2.6,
            "bug_fix_count": 4,
            "p1_tickets_resolved": 1,
            "p2_tickets_resolved": 5,
            "sprint_velocity_trend": [12, 13, 14, 14],
            "tickets_owned_cross_team": 2,
            "reopen_rate_pct": 4.2
        },
        "benchmark_comparison": {
            "tickets_completed_diff_vs_peer": 2,
            "cycle_time_diff_vs_peer": -0.2,
            "velocity_trend": "stable"
        },
        "lmc_flags": {
            "external_blockers_active": 1,
            "sprint_debt_tickets": 2
        }
    },
    "priya@effihr.mock": {
        "source": "Jira",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "tickets_completed": 22,
            "story_points_completed": 88,
            "average_cycle_time_days": 1.2,
            "bug_fix_count": 8,
            "p1_tickets_resolved": 5,
            "p2_tickets_resolved": 10,
            "sprint_velocity_trend": [20, 21, 22, 22],
            "tickets_owned_cross_team": 8,
            "reopen_rate_pct": 0.8
        },
        "benchmark_comparison": {
            "tickets_completed_diff_vs_peer": 10,
            "cycle_time_diff_vs_peer": -2.4,
            "velocity_trend": "peak"
        },
        "lmc_flags": {
            "external_blockers_active": 0,
            "sprint_debt_tickets": 0
        }
    }
}

def fetch_jira_metrics(employee_email: str) -> dict:
    """
    Fetch Jira metrics for an employee.
    PROD: Replace with — 
      import requests
      headers = {"Authorization": f"Bearer {JIRA_API_TOKEN}"}
      r = requests.get(f"{JIRA_BASE_URL}/rest/api/3/search?jql=assignee={email}...", headers=headers)
    """
    return JIRA_PROFILES.get(employee_email, {
        "source": "Jira",
        "connection_status": "Profile not found",
        "evidence": {"tickets_completed": 10, "story_points_completed": 35,
                     "average_cycle_time_days": 3.0, "bug_fix_count": 2,
                     "p1_tickets_resolved": 0, "p2_tickets_resolved": 2,
                     "sprint_velocity_trend": [10, 10, 10, 10],
                     "tickets_owned_cross_team": 0, "reopen_rate_pct": 5.0},
        "benchmark_comparison": {"tickets_completed_diff_vs_peer": 0, "cycle_time_diff_vs_peer": 0, "velocity_trend": "stable"},
        "lmc_flags": {"external_blockers_active": 0, "sprint_debt_tickets": 0}
    })
