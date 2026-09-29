from typing import List, Dict, Any

class ValidationService:
    @staticmethod
    def validate_borehole_data(borehole_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        warnings = []

        # 1. Total depth check
        total_depth = borehole_data.get("total_depth_m", 0)
        if total_depth <= 0 or total_depth > 1200:
            warnings.append({
                "type": "Depth Out of Bounds",
                "field": "total_depth_m",
                "value": total_depth,
                "message": f"Total depth {total_depth}m is outside valid geological range (10m - 1200m)."
            })

        # 2. Seam thickness & depth validation
        seams = borehole_data.get("seam_summary", [])
        for seam in seams:
            top = seam.get("top_depth_m", 0)
            bot = seam.get("bottom_depth_m", 0)
            thick = seam.get("thickness_m", 0)
            ash = seam.get("ash_percent", 0)
            gcv = seam.get("gcv_kcal_kg", 0)
            seam_name = seam.get("seam_name", "Unknown Seam")

            # Continuity
            if bot <= top:
                warnings.append({
                    "type": "Depth Continuity Error",
                    "field": f"{seam_name}.bottom_depth_m",
                    "value": f"{top} -> {bot}",
                    "message": f"Bottom depth {bot}m must be greater than top depth {top}m."
                })

            # Thickness mismatch
            calculated_thick = round(bot - top, 2)
            if abs(calculated_thick - thick) > 0.2:
                warnings.append({
                    "type": "Thickness Calculation Mismatch",
                    "field": f"{seam_name}.thickness_m",
                    "value": f"Stated {thick}m vs Calc {calculated_thick}m",
                    "message": f"Stated thickness {thick}m does not equal bottom - top ({calculated_thick}m)."
                })

            # Thickness outlier
            if thick > 18.0:
                warnings.append({
                    "type": "Outlier Seam Thickness",
                    "field": f"{seam_name}.thickness_m",
                    "value": thick,
                    "message": f"Seam thickness {thick}m exceeds 3-sigma regional mean for Talcher Coalfield."
                })

            # Ash Range
            if ash < 2.0 or ash > 65.0:
                warnings.append({
                    "type": "Ash Content Out of Bounds",
                    "field": f"{seam_name}.ash_percent",
                    "value": ash,
                    "message": f"Ash content {ash}% is outside expected range (2% - 65%)."
                })

            # GCV Range
            if gcv < 1000 or gcv > 8000:
                warnings.append({
                    "type": "GCV Value Out of Bounds",
                    "field": f"{seam_name}.gcv_kcal_kg",
                    "value": gcv,
                    "message": f"Gross Calorific Value {gcv} kcal/kg is outside normal range."
                })

            # GCV vs Ash Ratio Validation
            # Empirical relation for Indian coal: GCV roughly ~ 7500 - (100 * Ash%)
            expected_gcv_approx = 7500 - (100 * ash)
            if abs(gcv - expected_gcv_approx) > 1800:
                warnings.append({
                    "type": "GCV vs Ash Ratio Anomaly",
                    "field": f"{seam_name}.gcv_kcal_kg",
                    "value": f"GCV:{gcv}, Ash:{ash}%",
                    "message": f"GCV ({gcv} kcal/kg) deviates significantly from empirical ash correlation."
                })

        return warnings
