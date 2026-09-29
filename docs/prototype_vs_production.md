# CoalIQ Prototype vs. Production Capabilities

This document clearly demarcates the production-grade functional features versus prototype mocked implementations in CoalIQ (SIH26023).

| Feature Component | Prototype Implementation (Current) | Production Target Architecture |
| :--- | :--- | :--- |
| **Database Engine** | SQLite database (`coaliq.db`) with SQLAlchemy ORM. | PostgreSQL with PostGIS extension for spatial queries. |
| **OCR & Data Extraction** | `pytesseract` and `pdfplumber` with fallback to synthetic extraction parser. | Custom fine-tuned Vision-LLM (LayoutLMv3 / Donut) trained on historical CMPDI logs. |
| **Reserve & Grade Model** | `scikit-learn` spatial IDW-KNN Regressor for grade & tonnage estimation. | 3D Geological Kriging (GemPy / PyVista / Surfer integration). |
| **Grounded Report LLM** | Deterministic CMPDI template synthesis with inline citations and Hindi translation dictionary. | Fine-tuned Llama-3-70B / DeepSeek-R1 with RAG over CMPDI regional archives. |
| **Human Review Feedback Loop**| Logs engineer corrections to active database feedback table with confidence delta tracking. | Active continuous learning ML pipeline triggered on batch approval. |
| **User Authentication** | Lightweight mock role switcher (Engineer, Mining Planner, Management). | Keycloak / OAuth2 with Enterprise CIL Active Directory SSO. |
| **Export Engines** | Native `python-docx` for DOCX and `reportlab` for PDF export. | Production PDF rendering pipeline with digital signature verification. |
