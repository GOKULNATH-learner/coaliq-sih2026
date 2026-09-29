from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.database import get_db
from ..db.models import Borehole, LithologyInterval, SeamData
from ..schemas.borehole import BoreholeResponse

router = APIRouter(prefix="/api/boreholes", tags=["Boreholes"])

@router.get("", response_model=List[BoreholeResponse])
def get_all_boreholes(block: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Borehole)
    if block:
        query = query.filter(Borehole.block_name == block)
    if status:
        query = query.filter(Borehole.status == status)
    return query.all()

@router.get("/summary/kpis")
def get_dashboard_kpis(db: Session = Depends(get_db)):
    total = db.query(Borehole).count()
    validated = db.query(Borehole).filter(Borehole.status == "Validated").count()
    pending = db.query(Borehole).filter(Borehole.status == "Pending Review").count()
    anomalies = db.query(Borehole).filter(Borehole.status == "Flagged Anomaly").count()

    return {
        "total_boreholes": total,
        "reports_generated": 14,
        "avg_time_saved_days": 8.5,
        "pending_reviews": pending,
        "anomalies_flagged": anomalies,
        "validated_ratio_percent": round((validated / total) * 100, 1) if total > 0 else 0
    }

@router.get("/{borehole_id}", response_model=BoreholeResponse)
def get_borehole_by_id(borehole_id: str, db: Session = Depends(get_db)):
    bh = db.query(Borehole).filter(Borehole.borehole_id == borehole_id).first()
    if not bh:
        raise HTTPException(status_code=404, detail=f"Borehole {borehole_id} not found.")
    return bh
