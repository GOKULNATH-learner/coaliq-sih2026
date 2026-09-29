# CoalIQ System Architecture & Data Flow

CoalIQ (PS SIH26023) is an AI-powered geological, mining, and reporting solution designed for CMPDI and Coal India Limited (CIL) subsidiaries.

## Architecture Diagram (Mermaid)

```mermaid
graph TD
    subgraph Data Sources
        F1[PDF Field Logs]
        F2[LAS 2.0 Geophysical Logs]
        F3[CSV Survey Sheets]
    end

    subgraph Data Ingestion & Extraction Layer
        OCR[pytesseract / pdfplumber OCR Engine]
        VAL[Geological Range & Unit Validator]
        EXT[Multimodal Field Extractor]
    end

    subgraph Decision & ML Core
        ML[Scikit-Learn Spatial IDW Regressor]
        CONF[Per-Field Confidence Scorer]
        REV[Human Engineer Review Queue]
    end

    subgraph Report Builder & Storage
        REP[CMPDI Geological Report Engine]
        LANG[English / Hindi Translation Module]
        DB[(SQLite / PostGIS Database)]
        AUD[Cryptographic Audit Log]
    end

    subgraph Export Formats
        PDF[PDF Exporter - ReportLab]
        DOCX[DOCX Exporter - python-docx]
    end

    F1 & F2 & F3 --> OCR --> VAL --> EXT
    EXT --> CONF
    CONF -- Confidence < 80% / Outlier --> REV
    CONF -- Validated Fields --> ML
    REV -- Engineer Edits & Approvals --> ML
    ML --> REP
    REP --> LANG
    REP --> DB
    REP --> AUD
    LANG --> PDF & DOCX
```

## System Components

1. **Backend Framework**: Python FastAPI (`/api/boreholes`, `/api/ingestion`, `/api/extraction`, `/api/insights`, `/api/review`, `/api/reports`, `/api/audit`).
2. **Database Engine**: SQLite with SQLAlchemy ORM (Schema configured to be 100% PostgreSQL/PostGIS compatible for production).
3. **ML & Analytics**: `scikit-learn` spatial K-Nearest Neighbors regressor for coal reserve volume calculation and grade (G1-G17) classification.
4. **Report Engine**: Grounded CMPDI template generator with inline citations (`[BH-XX, depth m]`), supporting English and Hindi translations, exporting directly to `.pdf` and `.docx`.
5. **Frontend Application**: React 18 (Vite) + Tailwind CSS + Leaflet GIS map + Recharts.
