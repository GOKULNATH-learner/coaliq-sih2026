from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..db.models import AuditLog
from ..schemas.audit import AuditLogSchema

router = APIRouter(prefix="/api/audit", tags=["Audit Log"])

@router.get("/logs", response_model=List[AuditLogSchema])
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs
