from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ReportCreateRequest(BaseModel):
    report_title: str
    report_type: str = "Geological Report"
    block_name: str
    language: str = "EN" # EN or HI
    selected_boreholes: List[str] = []
    author_name: str = "Senior Geologist, CMPDI"
    user_role: str = "Engineer"

class NarrativeSection(BaseModel):
    section_id: str
    section_title: str
    content: str
    citations: List[str] = []

class ReportResponse(BaseModel):
    id: int
    report_title: str
    report_type: str
    block_name: str
    language: str
    created_at: datetime
    created_by: str
    status: str
    sections: List[NarrativeSection] = []

    class Config:
        from_attributes = True
