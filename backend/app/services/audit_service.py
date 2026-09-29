from sqlalchemy.orm import Session
from datetime import datetime
from ..db.models import AuditLog

class AuditService:
    @staticmethod
    def log_action(db: Session, user_name: str, user_role: str, action: str, target_entity: str, details: str = None):
        log_entry = AuditLog(
            timestamp=datetime.utcnow(),
            user_name=user_name,
            user_role=user_role,
            action=action,
            target_entity=target_entity,
            details=details
        )
        db.add(log_entry)
        db.commit()
        return log_entry
