from pydantic import BaseModel
from typing import List, Optional

class LithologyResponse(BaseModel):
    id: int
    borehole_id: str
    from_m: float
    to_m: float
    lithology_type: str
    color: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class SeamDataResponse(BaseModel):
    id: int
    borehole_id: str
    seam_name: str
    top_depth_m: float
    bottom_depth_m: float
    thickness_m: float
    ash_percent: float
    gcv_kcal_kg: float
    moisture_percent: float
    grade: str

    class Config:
        from_attributes = True

class BoreholeResponse(BaseModel):
    id: int
    borehole_id: str
    block_name: str
    latitude: float
    longitude: float
    elevation_m: float
    total_depth_m: float
    drilling_date: Optional[str] = None
    driller_contractor: Optional[str] = None
    status: str
    lithology_intervals: List[LithologyResponse] = []
    seams: List[SeamDataResponse] = []

    class Config:
        from_attributes = True
