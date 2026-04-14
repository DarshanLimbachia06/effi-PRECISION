"""
Slack / Communication Tool — Data Weaver Sensor C (Scanning) - Ambient Collaboration Signals
Real implementation: Slack Events API + OAuth Bot Token with workspace admin approval
Mock implementation: Deterministic per-employee data for demo fidelity

PRIVACY NOTE: No individual message content is ever stored or surfaced.
Only aggregate thread-level participation patterns are derived, per the
effiPrecision Privacy Architecture specification.
"""

SLACK_PROFILES = {
    "aditya@effihr.mock": {
        "source": "Slack",
        "connection_status": "Connected (Mock)",
        "privacy_mode": "aggregate_patterns_only",
        "evidence": {
            "total_messages_sent": 284,
            "thread_replies_authored": 98,
            "peer_mentions_received": 42,
            "peer_mentions_in_help_threads": 36,
            "cross_team_channel_appearances": 14,
            "domain_expert_citations": 12,
            "message_frequency_trend_30d": [8, 9, 10, 9, 10, 11, 10],
            "team_channels_active": ["#engineering", "#api-guild", "#architecture-review", "#prod-incidents"],
            "cross_functional_channels": ["#product-design", "#qa-guild", "#all-hands"],
            "ews_signals": {
                "frequency_drop_pct": 0,
                "collaboration_withdrawal": False,
                "sentiment_proxy_status": "stable"
            }
        },
        "benchmark_comparison": {
            "team_catalyst_score": 94,
            "influence_radius": "cross-org",
            "classification": "Domain Expert / Team Catalyst"
        }
    },
    "riya@effihr.mock": {
        "source": "Slack",
        "connection_status": "Connected (Mock)",
        "privacy_mode": "aggregate_patterns_only",
        "evidence": {
            "total_messages_sent": 78,
            "thread_replies_authored": 14,
            "peer_mentions_received": 4,
            "peer_mentions_in_help_threads": 1,
            "cross_team_channel_appearances": 1,
            "domain_expert_citations": 0,
            "message_frequency_trend_30d": [12, 10, 8, 6, 5, 4, 3],
            "team_channels_active": ["#engineering", "#sprint-board-fe"],
            "cross_functional_channels": [],
            "ews_signals": {
                "frequency_drop_pct": 32,
                "collaboration_withdrawal": True,
                "sentiment_proxy_status": "declining"
            }
        },
        "benchmark_comparison": {
            "team_catalyst_score": 21,
            "influence_radius": "isolated",
            "classification": "EWS: Disengagement Risk"
        }
    },
    "arjun@effihr.mock": {
        "source": "Slack",
        "connection_status": "Connected (Mock)",
        "privacy_mode": "aggregate_patterns_only",
        "evidence": {
            "total_messages_sent": 195,
            "thread_replies_authored": 62,
            "peer_mentions_received": 22,
            "peer_mentions_in_help_threads": 18,
            "cross_team_channel_appearances": 8,
            "domain_expert_citations": 7,
            "message_frequency_trend_30d": [6, 7, 7, 6, 7, 8, 7],
            "team_channels_active": ["#engineering", "#backend-guild", "#api-guild"],
            "cross_functional_channels": ["#product-design", "#qa-guild"],
            "ews_signals": {
                "frequency_drop_pct": 0,
                "collaboration_withdrawal": False,
                "sentiment_proxy_status": "stable"
            }
        },
        "benchmark_comparison": {
            "team_catalyst_score": 71,
            "influence_radius": "cross-team",
            "classification": "Active Collaborator"
        }
    },
    "priya@effihr.mock": {
        "source": "Slack",
        "connection_status": "Connected (Mock)",
        "privacy_mode": "aggregate_patterns_only",
        "evidence": {
            "total_messages_sent": 420,
            "thread_replies_authored": 185,
            "peer_mentions_received": 88,
            "peer_mentions_in_help_threads": 72,
            "cross_team_channel_appearances": 28,
            "domain_expert_citations": 31,
            "message_frequency_trend_30d": [14, 15, 14, 16, 15, 15, 16],
            "team_channels_active": ["#engineering", "#devops", "#sre", "#infra-on-call"],
            "cross_functional_channels": ["#product-design", "#leadership", "#qa-guild", "#all-hands", "#security-review"],
            "ews_signals": {
                "frequency_drop_pct": 0,
                "collaboration_withdrawal": False,
                "sentiment_proxy_status": "peak"
            }
        },
        "benchmark_comparison": {
            "team_catalyst_score": 99,
            "influence_radius": "org-wide",
            "classification": "Org Anchor / Culture Carrier"
        }
    }
}

def fetch_slack_metrics(employee_email: str) -> dict:
    """
    Fetch Slack communication signals for an employee.
    PROD: Replace with —
      from slack_sdk import WebClient
      client = WebClient(token=SLACK_BOT_TOKEN)
      # Use users.lookupByEmail, then conversations.history with member filter
      # Aggregate ONLY thread-level patterns — NO message content, per privacy spec
    """
    return SLACK_PROFILES.get(employee_email, {
        "source": "Slack",
        "connection_status": "Profile not found",
        "privacy_mode": "aggregate_patterns_only",
        "evidence": {"total_messages_sent": 80, "thread_replies_authored": 20,
                     "peer_mentions_received": 5, "peer_mentions_in_help_threads": 3,
                     "cross_team_channel_appearances": 2, "domain_expert_citations": 1,
                     "message_frequency_trend_30d": [4,4,4,4,4,4,4],
                     "team_channels_active": [], "cross_functional_channels": [],
                     "ews_signals": {"frequency_drop_pct": 0, "collaboration_withdrawal": False, "sentiment_proxy_status": "stable"}},
        "benchmark_comparison": {"team_catalyst_score": 40, "influence_radius": "local", "classification": "Standard"}
    })
