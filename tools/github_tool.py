"""
GitHub / GitLab Tool — Data Weaver Sensor A (Optical) - Code Signals
Real implementation: GitHub App OAuth + REST/GraphQL API
Mock implementation: Deterministic per-employee data for demo fidelity
"""

GITHUB_PROFILES = {
    "aditya@effihr.mock": {
        "source": "GitHub",
        "connection_status": "Connected (Mock)",
        "github_username": "aditya-sharma-dev",
        "evidence": {
            "commits_authored": 47,
            "prs_merged": 12,
            "prs_reviewed": 28,
            "code_comments_made": 81,
            "co_authored_commits": 9,
            "lines_added": 3420,
            "lines_deleted": 1210,
            "repositories_contributed": ["payment-gateway-v2", "infra-libs", "api-commons"],
            "critical_prs_merged": [
                {"pr": "#412", "title": "Fix payment gateway race condition", "priority": "P1", "merged_at": "2026-03-22"},
                {"pr": "#398", "title": "Migrate auth service to JWT RS256", "priority": "P2", "merged_at": "2026-03-10"}
            ],
            "review_turnaround_hrs": 3.2,
            "cross_team_pr_reviews": 14
        },
        "benchmark_comparison": {
            "prs_merged_diff_vs_peer": 5,
            "prs_reviewed_diff_vs_peer": 12,
            "review_comments_quality": "high"
        }
    },
    "riya@effihr.mock": {
        "source": "GitHub",
        "connection_status": "Connected (Mock)",
        "github_username": "riya-desai-fe",
        "evidence": {
            "commits_authored": 11,
            "prs_merged": 3,
            "prs_reviewed": 4,
            "code_comments_made": 12,
            "co_authored_commits": 1,
            "lines_added": 820,
            "lines_deleted": 340,
            "repositories_contributed": ["sprint-board-ui"],
            "critical_prs_merged": [],
            "review_turnaround_hrs": 24.8,
            "cross_team_pr_reviews": 0
        },
        "benchmark_comparison": {
            "prs_merged_diff_vs_peer": -4,
            "prs_reviewed_diff_vs_peer": -10,
            "review_comments_quality": "low"
        }
    },
    "arjun@effihr.mock": {
        "source": "GitHub",
        "connection_status": "Connected (Mock)",
        "github_username": "arjun-k-backend",
        "evidence": {
            "commits_authored": 38,
            "prs_merged": 10,
            "prs_reviewed": 20,
            "code_comments_made": 55,
            "co_authored_commits": 5,
            "lines_added": 2800,
            "lines_deleted": 950,
            "repositories_contributed": ["graphql-gateway", "user-service", "api-commons"],
            "critical_prs_merged": [
                {"pr": "#201", "title": "GraphQL N+1 query fix (DataLoader)", "priority": "P2", "merged_at": "2026-03-18"}
            ],
            "review_turnaround_hrs": 6.5,
            "cross_team_pr_reviews": 6
        },
        "benchmark_comparison": {
            "prs_merged_diff_vs_peer": 3,
            "prs_reviewed_diff_vs_peer": 4,
            "review_comments_quality": "medium-high"
        }
    },
    "priya@effihr.mock": {
        "source": "GitHub",
        "connection_status": "Connected (Mock)",
        "github_username": "priya-singh-devops",
        "evidence": {
            "commits_authored": 58,
            "prs_merged": 20,
            "prs_reviewed": 45,
            "code_comments_made": 130,
            "co_authored_commits": 15,
            "lines_added": 5100,
            "lines_deleted": 2800,
            "repositories_contributed": ["ci-pipelines", "k8s-manifests", "terraform-modules", "infra-libs"],
            "critical_prs_merged": [
                {"pr": "#89", "title": "Zero-downtime blue-green deploy pipeline", "priority": "P1", "merged_at": "2026-03-28"},
                {"pr": "#77", "title": "Migrate Jenkins → GitHub Actions", "priority": "P1", "merged_at": "2026-03-14"}
            ],
            "review_turnaround_hrs": 1.8,
            "cross_team_pr_reviews": 28
        },
        "benchmark_comparison": {
            "prs_merged_diff_vs_peer": 13,
            "prs_reviewed_diff_vs_peer": 29,
            "review_comments_quality": "very-high"
        }
    }
}

def fetch_github_metrics(employee_email: str) -> dict:
    """
    Fetch GitHub metrics for an employee.
    PROD: Replace with —
      from github import Github
      g = Github(GITHUB_TOKEN)
      user = g.get_user(github_username)
      prs = repo.get_pulls(state='closed', ...)
    """
    return GITHUB_PROFILES.get(employee_email, {
        "source": "GitHub",
        "connection_status": "Profile not found",
        "evidence": {"commits_authored": 15, "prs_merged": 5, "prs_reviewed": 10,
                     "code_comments_made": 20, "co_authored_commits": 2,
                     "lines_added": 1000, "lines_deleted": 400,
                     "repositories_contributed": [], "critical_prs_merged": [],
                     "review_turnaround_hrs": 12.0, "cross_team_pr_reviews": 1},
        "benchmark_comparison": {"prs_merged_diff_vs_peer": 0, "prs_reviewed_diff_vs_peer": 0, "review_comments_quality": "medium"}
    })
