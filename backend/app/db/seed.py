import json
import os
from sqlalchemy.orm import Session
from .database import Base, engine, SessionLocal
from .models import Borehole, LithologyInterval, SeamData, ExtractedDocument, ExtractionField, ReviewQueueItem, Report, AuditLog

def seed_database(db: Session):
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)

    # Check if already seeded
    if db.query(Borehole).first():
        print("Database already seeded.")
        return

    print("Seeding database with sample Talcher coalfield data...")
    json_path = os.path.join("sample_data", "talcher_boreholes_25.json")
    if not os.path.exists(json_path):
        json_path = os.path.join("..", "sample_data", "talcher_boreholes_25.json")
        
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        for item in data:
            bh = Borehole(
                borehole_id=item["borehole_id"],
                block_name=item["block_name"],
                latitude=item["latitude"],
                longitude=item["longitude"],
                elevation_m=item["elevation_m"],
                total_depth_m=item["total_depth_m"],
                drilling_date=item["drilling_date"],
                driller_contractor=item["driller_contractor"],
                status=item["status"]
            )
            db.add(bh)
            db.flush()

            for lith in item.get("lithology", []):
                li = LithologyInterval(
                    borehole_id=bh.borehole_id,
                    from_m=lith["from_m"],
                    to_m=lith["to_m"],
                    lithology_type=lith["lithology_type"],
                    color=lith["color"],
                    description=lith["description"]
                )
                db.add(li)

            for seam in item.get("seam_summary", []):
                sd = SeamData(
                    borehole_id=bh.borehole_id,
                    seam_name=seam["seam_name"],
                    top_depth_m=seam["top_depth_m"],
                    bottom_depth_m=seam["bottom_depth_m"],
                    thickness_m=seam["thickness_m"],
                    ash_percent=seam["ash_percent"],
                    gcv_kcal_kg=seam["gcv_kcal_kg"],
                    moisture_percent=seam["moisture_percent"],
                    grade=seam["grade"]
                )
                db.add(sd)

    # Populate sample Review Items
    review_items = [
        {
            "borehole_id": "BH-TAL-04",
            "field_name": "Seam I Thickness",
            "original_value": "20.5 m",
            "extracted_value": "20.5 m",
            "confidence_score": 72.4,
            "anomaly_type": "Outlier Thickness (>18m)",
            "status": "Pending",
            "engineer_notes": "Thickness exceeds 3-sigma regional mean for Seam I."
        },
        {
            "borehole_id": "BH-TAL-05",
            "field_name": "Seam II Ash %",
            "original_value": "42.0 %",
            "extracted_value": "42.0 %",
            "confidence_score": 68.1,
            "anomaly_type": "High Ash Anomaly (>40%)",
            "status": "Pending",
            "engineer_notes": "Possible carbonaceous shale inclusion mistaken for coal seam."
        },
        {
            "borehole_id": "BH-TAL-09",
            "field_name": "Seam I Ash %",
            "original_value": "5.2 %",
            "extracted_value": "5.2 %",
            "confidence_score": 64.0,
            "anomaly_type": "Low Confidence OCR",
            "status": "Pending",
            "engineer_notes": "Scanned text smudged; verify against physical lab report."
        }
    ]
    
    for ri in review_items:
        rq = ReviewQueueItem(
            borehole_id=ri["borehole_id"],
            field_name=ri["field_name"],
            original_value=ri["original_value"],
            extracted_value=ri["extracted_value"],
            confidence_score=ri["confidence_score"],
            anomaly_type=ri["anomaly_type"],
            status=ri["status"],
            engineer_notes=ri["engineer_notes"]
        )
        db.add(rq)

    # Populate Sample Audit Logs
    logs = [
        ("System", "System Admin", "DB_INIT", "Database", "Initial seed data loaded for 25 Talcher boreholes."),
        ("Er. R. K. Sharma", "Senior Geologist", "DATA_INGEST", "BH-TAL-04", "Ingested PDF field scan log sample_scan_log_1.pdf."),
        ("Dr. S. N. Pattanaik", "Chief Geologist", "ANOMALY_FLAG", "BH-TAL-05", "Flagged Seam II Ash % anomaly for technical review.")
    ]
    for user_name, role, act, target, det in logs:
        al = AuditLog(
            user_name=user_name,
            user_role=role,
            action=act,
            target_entity=target,
            details=det
        )
        db.add(al)

    db.commit()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    db = SessionLocal()
    seed_database(db)
    db.close()
