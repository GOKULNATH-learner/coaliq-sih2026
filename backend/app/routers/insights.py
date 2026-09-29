from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.database import get_db
from ..db.models import Borehole
from ..services.ml_insights_service import MLInsightsService

router = APIRouter(prefix="/api/insights", tags=["Insights & ML"])

@router.get("/reserve-estimation")
def get_reserve_estimation(block_name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Borehole)
    if block_name:
        query = query.filter(Borehole.block_name == block_name)
    boreholes = query.all()

    # Format borehole dicts for ML service
    bh_dicts = []
    for b in boreholes:
        bh_dicts.append({
            "borehole_id": b.borehole_id,
            "latitude": b.latitude,
            "longitude": b.longitude,
            "elevation_m": b.elevation_m,
            "total_depth_m": b.total_depth_m,
            "seam_summary": [
                {
                    "seam_name": s.seam_name,
                    "top_depth_m": s.top_depth_m,
                    "bottom_depth_m": s.bottom_depth_m,
                    "thickness_m": s.thickness_m,
                    "ash_percent": s.ash_percent,
                    "gcv_kcal_kg": s.gcv_kcal_kg,
                    "grade": s.grade
                } for s in b.seams
            ]
        })

    return MLInsightsService.calculate_reserve_and_grade(bh_dicts)

@router.get("/seam-correlation")
def get_seam_correlation(borehole_ids: Optional[str] = Query("BH-TAL-01,BH-TAL-02,BH-TAL-03,BH-TAL-04", description="Comma separated borehole IDs"), db: Session = Depends(get_db)):
    id_list = [i.strip() for i in borehole_ids.split(",") if i.strip()]
    boreholes = db.query(Borehole).filter(Borehole.borehole_id.in_(id_list)).all()

    bh_dicts = []
    for b in boreholes:
        bh_dicts.append({
            "borehole_id": b.borehole_id,
            "elevation_m": b.elevation_m,
            "total_depth_m": b.total_depth_m,
            "seam_summary": [
                {
                    "seam_name": s.seam_name,
                    "top_depth_m": s.top_depth_m,
                    "bottom_depth_m": s.bottom_depth_m,
                    "thickness_m": s.thickness_m,
                    "ash_percent": s.ash_percent,
                    "gcv_kcal_kg": s.gcv_kcal_kg
                } for s in b.seams
            ]
        })

    return MLInsightsService.correlate_seams(bh_dicts)
