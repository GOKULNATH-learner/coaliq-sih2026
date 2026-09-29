from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..db.models import ExtractedDocument, ExtractionField
from ..schemas.extraction import ExtractionDocResponse

router = APIRouter(prefix="/api/extraction", tags=["Extraction"])

@router.get("/documents", response_model=List[ExtractionDocResponse])
def get_all_extracted_documents(db: Session = Depends(get_db)):
    docs = db.query(ExtractedDocument).all()
    if not docs:
        # If no uploaded doc yet, return a synthetic response
        return [
            ExtractionDocResponse(
                id=1,
                filename="sample_scan_log_1.pdf",
                file_type="PDF/Scan Field Log",
                upload_time="2024-04-15T10:30:00",
                status="Extracted",
                raw_text="CMPDI GEOLOGICAL BOREHOLE FIELD LOG\nBorehole ID: BH-TAL-04\nLatitude: 20.9575 N, Longitude: 85.1445 E\nSeam I Thickness: 20.50 m, Ash: 17.5%, GCV: 6450 kcal/kg\n",
                fields=[
                    {"id": 1, "field_name": "Borehole ID", "field_value": "BH-TAL-04", "confidence_score": 96.0, "is_flagged": False, "status": "Approved"},
                    {"id": 2, "field_name": "Block Name", "field_value": "Talcher Central Block", "confidence_score": 95.2, "is_flagged": False, "status": "Approved"},
                    {"id": 3, "field_name": "Latitude", "field_value": "20.9575 N", "confidence_score": 94.0, "is_flagged": False, "status": "Approved"},
                    {"id": 4, "field_name": "Longitude", "field_value": "85.1445 E", "confidence_score": 93.8, "is_flagged": False, "status": "Approved"},
                    {"id": 5, "field_name": "Elevation", "field_value": "115.2 m", "confidence_score": 91.0, "is_flagged": False, "status": "Approved"},
                    {"id": 6, "field_name": "Total Depth", "field_value": "175.0 m", "confidence_score": 95.5, "is_flagged": False, "status": "Approved"},
                    {"id": 7, "field_name": "Seam III Thickness", "field_value": "5.60 m", "confidence_score": 92.4, "is_flagged": False, "status": "Approved"},
                    {"id": 8, "field_name": "Seam II Ash %", "field_value": "34.2 %", "confidence_score": 88.0, "is_flagged": False, "status": "Approved"},
                    {"id": 9, "field_name": "Seam I Thickness", "field_value": "20.50 m", "confidence_score": 72.4, "is_flagged": True, "flag_reason": "Outlier Thickness (>18m)", "status": "Pending"},
                    {"id": 10, "field_name": "Logged By", "field_value": "Er. R. K. Sharma", "confidence_score": 64.0, "is_flagged": True, "flag_reason": "Low Confidence OCR", "status": "Pending"}
                ]
            )
        ]
    return docs

@router.get("/documents/{doc_id}", response_model=ExtractionDocResponse)
def get_extracted_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(ExtractedDocument).filter(ExtractedDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {doc_id} not found.")
    return doc
