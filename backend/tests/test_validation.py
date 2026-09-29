from app.services.validation_service import ValidationService

def test_depth_continuity_validation():
    sample_data = {
        "total_depth_m": 150.0,
        "seam_summary": [
            {
                "seam_name": "Seam I",
                "top_depth_m": 100.0,
                "bottom_depth_m": 90.0, # Invalid continuity
                "thickness_m": 10.0,
                "ash_percent": 20.0,
                "gcv_kcal_kg": 6000
            }
        ]
    }
    warnings = ValidationService.validate_borehole_data(sample_data)
    assert any(w["type"] == "Depth Continuity Error" for w in warnings)

def test_seam_thickness_outlier_validation():
    sample_data = {
        "total_depth_m": 200.0,
        "seam_summary": [
            {
                "seam_name": "Seam I (Bottom)",
                "top_depth_m": 120.0,
                "bottom_depth_m": 142.5,
                "thickness_m": 22.5, # Exceeds 18m outlier threshold
                "ash_percent": 18.0,
                "gcv_kcal_kg": 6200
            }
        ]
    }
    warnings = ValidationService.validate_borehole_data(sample_data)
    assert any(w["type"] == "Outlier Seam Thickness" for w in warnings)

def test_valid_borehole_data():
    sample_data = {
        "total_depth_m": 180.0,
        "seam_summary": [
            {
                "seam_name": "Seam III",
                "top_depth_m": 40.0,
                "bottom_depth_m": 45.0,
                "thickness_m": 5.0,
                "ash_percent": 24.0,
                "gcv_kcal_kg": 5100
            }
        ]
    }
    warnings = ValidationService.validate_borehole_data(sample_data)
    assert len(warnings) == 0
