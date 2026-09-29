from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
import json
from ..db.database import get_db
from ..db.models import Report, Borehole
from ..schemas.report import ReportCreateRequest, ReportResponse, NarrativeSection
from ..services.report_builder_service import ReportBuilderService
from ..services.audit_service import AuditService

router = APIRouter(prefix="/api/reports", tags=["Report Builder"])

@router.post("/generate", response_model=ReportResponse)
def generate_geological_report(req: ReportCreateRequest, db: Session = Depends(get_db)):
    # Fetch boreholes
    query = db.query(Borehole)
    if req.block_name:
        query = query.filter(Borehole.block_name == req.block_name)
    boreholes = query.all()

    bh_dicts = [
        {
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
        } for b in boreholes
    ]

    sections_raw = ReportBuilderService.generate_report_sections(req.block_name, bh_dicts, lang=req.language)

    # Save to database
    report_db = Report(
        report_title=req.report_title,
        report_type=req.report_type,
        block_name=req.block_name,
        language=req.language,
        created_by=req.author_name,
        status="Draft",
        content_json=json.dumps(sections_raw)
    )
    db.add(report_db)
    db.flush()

    # Log audit
    AuditService.log_action(
        db,
        user_name=req.author_name,
        user_role=req.user_role,
        action="REPORT_GENERATE",
        target_entity=f"Report #{report_db.id} ({req.report_title})",
        details=f"Generated {req.report_type} in {req.language} for block '{req.block_name}' grounding {len(boreholes)} boreholes."
    )

    db.commit()

    sections_model = [NarrativeSection(**s) for s in sections_raw]

    return ReportResponse(
        id=report_db.id,
        report_title=report_db.report_title,
        report_type=report_db.report_type,
        block_name=report_db.block_name,
        language=report_db.language,
        created_at=report_db.created_at,
        created_by=report_db.created_by,
        status=report_db.status,
        sections=sections_model
    )

@router.get("/{report_id}/export/pdf")
def export_report_pdf(report_id: int, db: Session = Depends(get_db)):
    rpt = db.query(Report).filter(Report.id == report_id).first()
    if not rpt:
        raise HTTPException(status_code=404, detail="Report not found")

    sections = json.loads(rpt.content_json) if rpt.content_json else []
    pdf_bytes = ReportBuilderService.export_to_pdf(rpt.report_title, rpt.block_name, sections, lang=rpt.language)

    filename = f"CoalIQ_Geological_Report_{rpt.block_name.replace(' ', '_')}_{rpt.language}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{report_id}/export/docx")
def export_report_docx(report_id: int, db: Session = Depends(get_db)):
    rpt = db.query(Report).filter(Report.id == report_id).first()
    if not rpt:
        raise HTTPException(status_code=404, detail="Report not found")

    sections = json.loads(rpt.content_json) if rpt.content_json else []
    docx_bytes = ReportBuilderService.export_to_docx(rpt.report_title, rpt.block_name, sections, lang=rpt.language)

    filename = f"CoalIQ_Geological_Report_{rpt.block_name.replace(' ', '_')}_{rpt.language}.docx"
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
