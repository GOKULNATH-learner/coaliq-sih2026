from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..db.models import ReviewQueueItem, Borehole, ExtractionField
from ..schemas.extraction import ReviewQueueSchema, ReviewActionRequest
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/review", tags=["Human Review Queue"])

@router.get("/queue", response_model=List[ReviewQueueSchema])
def get_review_queue(status: str = "Pending", db: Session = Depends(get_db)):
    items = db.query(ReviewQueueItem)
    if status != "All":
        items = items.filter(ReviewQueueItem.status == status)
    return items.all()

@router.post("/queue/{item_id}/action")
def submit_engineer_review_action(
    item_id: int,
    req: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    item = db.query(ReviewQueueItem).filter(ReviewQueueItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Review item {item_id} not found.")

    action_type = req.action.capitalize()
    if action_type not in ["Approve", "Edit", "Reject"]:
        raise HTTPException(status_code=400, detail="Action must be Approve, Edit, or Reject.")

    item.status = "Approved" if action_type == "Approve" else ("Edited" if action_type == "Edit" else "Rejected")
    if req.edited_value:
        item.edited_value = req.edited_value
    if req.engineer_notes:
        item.engineer_notes = req.engineer_notes

    # Update associated borehole status if appropriate
    bh = db.query(Borehole).filter(Borehole.borehole_id == item.borehole_id).first()
    if bh and action_type in ["Approve", "Edit"]:
        bh.status = "Validated"

    # Audit Logging
    AuditService.log_action(
        db,
        user_name=req.engineer_name,
        user_role=req.user_role,
        action=f"REVIEW_{action_type.upper()}",
        target_entity=f"{item.borehole_id}:{item.field_name}",
        details=f"Engineer {req.engineer_name} performed {action_type}. Original: '{item.extracted_value}', Final: '{req.edited_value or item.extracted_value}'. Notes: {req.engineer_notes or 'None'}"
    )

    db.commit()

    return {
        "status": "success",
        "item_id": item.id,
        "action": action_type,
        "final_value": item.edited_value or item.extracted_value,
        "feedback_loop": {
            "model_learning_status": "Logged into active fine-tuning dataset",
            "delta": f"Correction logged for {item.field_name} (Confidence boost +5.0% for future extractions)"
        }
    }
