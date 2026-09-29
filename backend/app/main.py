from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .db.database import engine, SessionLocal, Base
from .db.seed import seed_database
from .routers import auth, boreholes, ingestion, extraction, insights, review, report, audit

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CoalIQ API",
    description="AI-powered geological, mining, and reporting solution for CMPDI/CIL subsidiaries (SIH26023)",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(boreholes.router)
app.include_router(ingestion.router)
app.include_router(extraction.router)
app.include_router(insights.router)
app.include_router(review.router)
app.include_router(report.router)
app.include_router(audit.router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def root_status():
    return {
        "service": "CoalIQ Backend API",
        "status": "online",
        "hackathon": "Smart India Hackathon 2026 (PS SIH26023)",
        "subsidiary": "CMPDI / CIL",
        "docs_url": "/docs"
    }
