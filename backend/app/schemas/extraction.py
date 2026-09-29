from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ExtractionFieldSchema(BaseModel):
    id: Optional[int] = None
    field_name: str
    field_value: str
    confidence_score: float
    is_flagged: bool = False
    flag_reason: Optional[str] = None
    status: str = "Pending"

    class Config:
        from_attributes = True

class ExtractionDocResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    upload_time: datetime
    status: str
    raw_text: Optional[str] = None
    fields: List[ExtractionFieldSchema] = []

    class Config:
        from_attributes = True

class ReviewQueueSchema(BaseModel):
    id: int
    borehole_id: str
    field_name: str
    original_value: str
    extracted_value: str
    edited_value: Optional[str] = None
    confidence_score: float
    anomaly_type: Optional[str] = None
    status: str
    engineer_notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class ReviewActionRequest(BaseModel):
    action: str # Approve, Reject, Edit
    edited_value: Optional[str] = None
    engineer_notes: Optional[str] = None
    engineer_name: str = "Er. Field Engineer"
    user_role: str = "Engineer"
