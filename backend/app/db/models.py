from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Borehole(Base):
    __tablename__ = "boreholes"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(String, unique=True, index=True, nullable=False)
    block_name = Column(String, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=False)
    total_depth_m = Column(Float, nullable=False)
    drilling_date = Column(String)
    driller_contractor = Column(String)
    status = Column(String, default="Validated") # Validated, Pending Review, Flagged Anomaly

    lithology_intervals = relationship("LithologyInterval", back_populates="borehole", cascade="all, delete-orphan")
    seams = relationship("SeamData", back_populates="borehole", cascade="all, delete-orphan")


class LithologyInterval(Base):
    __tablename__ = "lithology_intervals"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(String, ForeignKey("boreholes.borehole_id"), nullable=False)
    from_m = Column(Float, nullable=False)
    to_m = Column(Float, nullable=False)
    lithology_type = Column(String, nullable=False)
    color = Column(String, default="#888888")
    description = Column(Text)

    borehole = relationship("Borehole", back_populates="lithology_intervals")


class SeamData(Base):
    __tablename__ = "seam_data"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(String, ForeignKey("boreholes.borehole_id"), nullable=False)
    seam_name = Column(String, nullable=False)
    top_depth_m = Column(Float, nullable=False)
    bottom_depth_m = Column(Float, nullable=False)
    thickness_m = Column(Float, nullable=False)
    ash_percent = Column(Float, nullable=False)
    gcv_kcal_kg = Column(Float, nullable=False)
    moisture_percent = Column(Float, default=5.0)
    grade = Column(String, default="G7")

    borehole = relationship("Borehole", back_populates="seams")


class ExtractedDocument(Base):
    __tablename__ = "extracted_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # PDF, LAS, CSV, Image
    upload_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Ingested")
    raw_text = Column(Text, nullable=True)

    fields = relationship("ExtractionField", back_populates="document", cascade="all, delete-orphan")


class ExtractionField(Base):
    __tablename__ = "extraction_fields"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("extracted_documents.id"), nullable=False)
    field_name = Column(String, nullable=False)
    field_value = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=False) # 0.0 to 100.0
    is_flagged = Column(Boolean, default=False)
    flag_reason = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Approved, Edited, Rejected

    document = relationship("ExtractedDocument", back_populates="fields")


class ReviewQueueItem(Base):
    __tablename__ = "review_queue"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(String, nullable=False)
    field_name = Column(String, nullable=False)
    original_value = Column(String, nullable=False)
    extracted_value = Column(String, nullable=False)
    edited_value = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=False)
    anomaly_type = Column(String, nullable=True) # Low Confidence, Outlier Range, Unit Mismatch
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    engineer_notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_title = Column(String, nullable=False)
    report_type = Column(String, default="Geological Report")
    block_name = Column(String, nullable=False)
    language = Column(String, default="EN") # EN or HI
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, default="Chief Geologist")
    status = Column(String, default="Draft") # Draft, Approved
    content_json = Column(Text) # Store narrative structure and citations


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_name = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    target_entity = Column(String, nullable=False)
    details = Column(Text, nullable=True)
