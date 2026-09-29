from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class UserRoleSchema(BaseModel):
    user_id: str
    name: str
    role: str # Engineer, Mining Planner, Management
    permissions: List[str]

MOCK_USERS = {
    "engineer": {
        "user_id": "usr_01",
        "name": "Er. R. K. Sharma",
        "role": "Engineer",
        "permissions": ["view_dashboard", "ingest_data", "review_queue", "edit_fields", "build_report"]
    },
    "planner": {
        "user_id": "usr_02",
        "name": "Er. Anita Das",
        "role": "Mining Planner",
        "permissions": ["view_dashboard", "view_insights", "reserve_estimation", "build_report"]
    },
    "management": {
        "user_id": "usr_03",
        "name": "Dr. S. N. Pattanaik",
        "role": "Management",
        "permissions": ["view_dashboard", "view_insights", "view_audit_logs", "approve_final_report"]
    }
}

@router.get("/roles")
def get_available_roles():
    return list(MOCK_USERS.values())

@router.get("/current/{role_key}")
def get_current_user(role_key: str):
    return MOCK_USERS.get(role_key.lower(), MOCK_USERS["engineer"])
