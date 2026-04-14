"""
Confluence / Notion Tool — Data Weaver Sensor C (Scanning) - Knowledge Signals
Real implementation: Atlassian OAuth + Confluence REST API
Mock implementation: Deterministic per-employee data for demo fidelity
"""

CONFLUENCE_PROFILES = {
    "aditya@effihr.mock": {
        "source": "Confluence",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "pages_created": 8,
            "pages_edited": 24,
            "page_views_generated": 1842,
            "docs_referenced_by_peers": 9,
            "spaces_contributed": ["API-Docs", "Onboarding", "Architecture"],
            "knowledge_articles": [
                {"title": "Payment Gateway v2 Migration Guide", "views": 620, "referenced_by": 9},
                {"title": "On-call Runbook for Auth Service", "views": 340, "referenced_by": 5}
            ],
            "invisible_work_score": 94,
            "classification": "Top 10% Knowledge Contributor"
        },
        "benchmark_comparison": {
            "pages_created_diff_vs_peer": 5,
            "knowledge_visibility_rank": "top_10_pct"
        }
    },
    "riya@effihr.mock": {
        "source": "Confluence",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "pages_created": 1,
            "pages_edited": 3,
            "page_views_generated": 88,
            "docs_referenced_by_peers": 0,
            "spaces_contributed": ["Sprint-Board-UI"],
            "knowledge_articles": [
                {"title": "Sprint Board UI Component List", "views": 88, "referenced_by": 0}
            ],
            "invisible_work_score": 18,
            "classification": "Below Baseline"
        },
        "benchmark_comparison": {
            "pages_created_diff_vs_peer": -2,
            "knowledge_visibility_rank": "bottom_25_pct"
        }
    },
    "arjun@effihr.mock": {
        "source": "Confluence",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "pages_created": 5,
            "pages_edited": 18,
            "page_views_generated": 920,
            "docs_referenced_by_peers": 6,
            "spaces_contributed": ["API-Docs", "Backend-Services"],
            "knowledge_articles": [
                {"title": "GraphQL Gateway Architecture", "views": 510, "referenced_by": 6},
                {"title": "DataLoader Pattern for N+1", "views": 280, "referenced_by": 4}
            ],
            "invisible_work_score": 72,
            "classification": "Active Contributor"
        },
        "benchmark_comparison": {
            "pages_created_diff_vs_peer": 2,
            "knowledge_visibility_rank": "top_30_pct"
        }
    },
    "priya@effihr.mock": {
        "source": "Confluence",
        "connection_status": "Connected (Mock)",
        "evidence": {
            "pages_created": 14,
            "pages_edited": 45,
            "page_views_generated": 3200,
            "docs_referenced_by_peers": 20,
            "spaces_contributed": ["DevOps", "Runbooks", "Incident-Response", "Architecture"],
            "knowledge_articles": [
                {"title": "CI/CD Pipeline Design (GitHub Actions)", "views": 1200, "referenced_by": 18},
                {"title": "K8s Cluster Upgrade Runbook", "views": 980, "referenced_by": 14}
            ],
            "invisible_work_score": 99,
            "classification": "Org-wide Knowledge Leader"
        },
        "benchmark_comparison": {
            "pages_created_diff_vs_peer": 11,
            "knowledge_visibility_rank": "top_1_pct"
        }
    }
}

def fetch_confluence_metrics(employee_email: str) -> dict:
    """
    Fetch Confluence/Notion documentation metrics.
    PROD: Replace with —
      import requests
      headers = {"Authorization": f"Bearer {CONFLUENCE_TOKEN}"}
      r = requests.get(f"{CONFLUENCE_BASE_URL}/wiki/rest/api/content?contributor={username}", headers=headers)
    """
    return CONFLUENCE_PROFILES.get(employee_email, {
        "source": "Confluence",
        "connection_status": "Profile not found",
        "evidence": {"pages_created": 2, "pages_edited": 5, "page_views_generated": 200,
                     "docs_referenced_by_peers": 1, "spaces_contributed": [],
                     "knowledge_articles": [], "invisible_work_score": 30,
                     "classification": "Standard"},
        "benchmark_comparison": {"pages_created_diff_vs_peer": 0, "knowledge_visibility_rank": "average"}
    })
