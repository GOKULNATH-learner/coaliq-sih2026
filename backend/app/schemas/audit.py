from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogSchema(BaseModel):
    id: int
    timestamp: datetime
    user_name: str
    user_role: str
    action: str
    target_entity: str
    details: Optional[str] = None

    class Config:
        from_attributes = True

class AuditLogCreate(BaseModel):
    user_name: str
    user_role: str
    action: str
    target_entity: str
    details: Optional[str] = None
