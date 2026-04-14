"""
HRMS Tool — Core System of Record signals (Goals, Ratings, Attendance, Past Cycles)
Real implementation: effiHR Internal REST API
Mock implementation: Reads from the enriched employees.json dataset
"""
import json
import os

def load_employees() -> list:
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'employees.json')
    with open(path, 'r') as f:
        return json.load(f)

def fetch_hrms_metrics(employee_email: str) -> dict:
    """
    Fetch HRMS data — goals, ratings, attendance, past cycles.
    PROD: Replace with —
      import requests
      r = requests.get(f"{EFFIHR_API_URL}/api/v1/employee/{email}/profile",
                       headers={"Authorization": f"Bearer {EFFIHR_API_KEY}"})
    """
    employees = load_employees()
    emp = next((e for e in employees if e["email"] == employee_email), None)
    
    if emp is None:
        return {
            "source": "HRMS (effiHR)",
            "connection_status": "Employee not found",
            "evidence": {}
        }
    
    hrms = emp.get("hrms", {})
    goals = hrms.get("goals", [])
    past_cycles = hrms.get("past_cycles", [])
    
    # Compute derived metrics
    weighted_completion = sum(
        g["weight"] * g["completion"] / 100 for g in goals
    ) if goals else 0
    
    at_risk_goals = [g for g in goals if g["status"] == "At Risk"]
    completed_goals = [g for g in goals if g["status"] == "Completed"]
    
    rating_trend = [c["final_rating"] for c in past_cycles]
    rating_avg = round(sum(rating_trend) / len(rating_trend), 2) if rating_trend else 0
    
    return {
        "source": "HRMS (effiHR)",
        "connection_status": "Connected (Mock)",
        "employee_metadata": {
            "name": emp["name"],
            "role": emp["role"],
            "grade": emp.get("grade", "N/A"),
            "department": emp["department"],
            "hire_date": emp.get("hire_date", "N/A"),
            "manager": emp.get("manager", "N/A")
        },
        "evidence": {
            "goal_completion_pct": hrms.get("current_cycle_goal_completion_pct", 0),
            "weighted_goal_score": round(weighted_completion, 1),
            "manager_draft_rating": hrms.get("manager_draft_rating"),
            "self_rating": hrms.get("self_rating"),
            "rating_gap": hrms.get("self_rating", 0) - hrms.get("manager_draft_rating", 0),
            "attendance_pct": hrms.get("attendance_pct", 100),
            "unplanned_leaves": hrms.get("unplanned_leaves", 0),
            "goals_total": len(goals),
            "goals_completed": len(completed_goals),
            "goals_at_risk": len(at_risk_goals),
            "goals_detail": goals,
            "past_cycles_count": len(past_cycles),
            "past_rating_avg": rating_avg,
            "past_cycles": past_cycles
        },
        "benchmark_comparison": {
            "rating_trend": "stable" if not rating_trend else (
                "improving" if rating_trend[-1] >= rating_avg
                else "declining"
            )
        }
    }
