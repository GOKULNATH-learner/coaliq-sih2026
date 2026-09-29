from app.services.report_builder_service import ReportBuilderService

def test_generate_report_sections_english():
    boreholes_mock = [
        {
            "borehole_id": "BH-TAL-01",
            "latitude": 20.9452,
            "longitude": 85.1234,
            "elevation_m": 122.5,
            "total_depth_m": 180.0,
            "seam_summary": [
                {"seam_name": "Seam I", "top_depth_m": 145.0, "bottom_depth_m": 158.2, "thickness_m": 13.2, "ash_percent": 19.8, "gcv_kcal_kg": 6150, "grade": "G4"}
            ]
        }
    ]
    sections = ReportBuilderService.generate_report_sections("Talcher Central Block", boreholes_mock, lang="EN")
    assert len(sections) == 6
    assert "Executive Summary" in sections[0]["section_title"]
    assert "[BH-TAL-01" in sections[0]["content"]

def test_export_docx_and_pdf():
    sections = [
        {"section_id": "sec_1", "section_title": "1. Executive Summary", "content": "Test executive summary narrative.", "citations": ["[BH-01]"]}
    ]
    docx_bytes = ReportBuilderService.export_to_docx("Geological Report", "Talcher Central Block", sections, lang="EN")
    assert isinstance(docx_bytes, bytes) and len(docx_bytes) > 0

    pdf_bytes = ReportBuilderService.export_to_pdf("Geological Report", "Talcher Central Block", sections, lang="EN")
    assert isinstance(pdf_bytes, bytes) and len(pdf_bytes) > 0
