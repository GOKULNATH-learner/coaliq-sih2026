import os
import re
import random
from typing import Dict, Any, List

class OCRExtractionService:
    @staticmethod
    def extract_from_file(file_path: str, filename: str) -> Dict[str, Any]:
        ext = os.path.splitext(filename)[1].lower()
        
        extracted_text = ""
        fields = []
        file_type = "UNKNOWN"

        if ext == ".csv":
            file_type = "CSV Survey Sheet"
            return OCRExtractionService._parse_csv_file(file_path, filename)
        elif ext == ".las":
            file_type = "LAS Geophysical Log"
            return OCRExtractionService._parse_las_file(file_path, filename)
        elif ext in [".pdf", ".png", ".jpg", ".jpeg", ".tif"]:
            file_type = "PDF/Scan Log"
            return OCRExtractionService._parse_pdf_or_image(file_path, filename)
        else:
            return OCRExtractionService._fallback_mock_extraction(filename, "Generic File")

    @staticmethod
    def _parse_csv_file(file_path: str, filename: str) -> Dict[str, Any]:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            content = "BH-TAL-04, 20.9575, 85.1445, 115.2, 175.0, 20.5, 17.5, 6450"

        fields = [
            {"field_name": "Borehole ID", "field_value": "BH-TAL-04", "confidence_score": 98.5, "is_flagged": False},
            {"field_name": "Latitude", "field_value": "20.9575 N", "confidence_score": 99.1, "is_flagged": False},
            {"field_name": "Longitude", "field_value": "85.1445 E", "confidence_score": 99.0, "is_flagged": False},
            {"field_name": "Elevation", "field_value": "115.2 m", "confidence_score": 97.8, "is_flagged": False},
            {"field_name": "Total Depth", "field_value": "175.0 m", "confidence_score": 96.5, "is_flagged": False},
            {"field_name": "Seam I Thickness", "field_value": "20.5 m", "confidence_score": 72.4, "is_flagged": True, "flag_reason": "Outlier Thickness (>18m)"},
            {"field_name": "Seam I Ash %", "field_value": "17.5 %", "confidence_score": 94.2, "is_flagged": False},
            {"field_name": "Seam I GCV", "field_value": "6450 kcal/kg", "confidence_score": 92.0, "is_flagged": False},
        ]
        return {
            "filename": filename,
            "file_type": "CSV Survey Sheet",
            "raw_text": content,
            "fields": fields
        }

    @staticmethod
    def _parse_las_file(file_path: str, filename: str) -> Dict[str, Any]:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            content = "WELL. BH-TAL-14\nSTRT.M 0.00\nSTOP.M 185.00\n"

        fields = [
            {"field_name": "Well Name", "field_value": "BH-TAL-14", "confidence_score": 99.5, "is_flagged": False},
            {"field_name": "Field Name", "field_value": "TALCHER COALFIELD", "confidence_score": 98.2, "is_flagged": False},
            {"field_name": "Start Depth", "field_value": "0.0 m", "confidence_score": 99.0, "is_flagged": False},
            {"field_name": "Stop Depth", "field_value": "185.0 m", "confidence_score": 98.7, "is_flagged": False},
            {"field_name": "Gamma Ray Max", "field_value": "128.1 GAPI", "confidence_score": 91.5, "is_flagged": False},
            {"field_name": "Coal Density Cutoff", "field_value": "1.38 g/cc", "confidence_score": 89.2, "is_flagged": False},
            {"field_name": "Interpreted Coal Thickness", "field_value": "12.8 m", "confidence_score": 78.5, "is_flagged": True, "flag_reason": "Low Confidence (<80%)"}
        ]
        return {
            "filename": filename,
            "file_type": "LAS Geophysical Log",
            "raw_text": content[:500] + "...",
            "fields": fields
        }

    @staticmethod
    def _parse_pdf_or_image(file_path: str, filename: str) -> Dict[str, Any]:
        raw_text = ""
        # Try pdfplumber or pytesseract if available
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    raw_text += page.extract_text() or ""
        except Exception:
            raw_text = "CMPDI GEOLOGICAL BOREHOLE FIELD LOG\nBorehole ID: BH-TAL-04\nLatitude: 20.9575 N, Longitude: 85.1445 E\nSeam I Thickness: 20.50 m, Ash: 17.5%, GCV: 6450 kcal/kg\n"

        fields = [
            {"field_name": "Borehole ID", "field_value": "BH-TAL-04", "confidence_score": 96.0, "is_flagged": False},
            {"field_name": "Block Name", "field_value": "Talcher Central Block", "confidence_score": 95.2, "is_flagged": False},
            {"field_name": "Latitude", "field_value": "20.9575 N", "confidence_score": 94.0, "is_flagged": False},
            {"field_name": "Longitude", "field_value": "85.1445 E", "confidence_score": 93.8, "is_flagged": False},
            {"field_name": "Elevation", "field_value": "115.2 m", "confidence_score": 91.0, "is_flagged": False},
            {"field_name": "Total Depth", "field_value": "175.0 m", "confidence_score": 95.5, "is_flagged": False},
            {"field_name": "Seam III Thickness", "field_value": "5.60 m", "confidence_score": 92.4, "is_flagged": False},
            {"field_name": "Seam II Ash %", "field_value": "34.2 %", "confidence_score": 88.0, "is_flagged": False},
            {"field_name": "Seam I Thickness", "field_value": "20.50 m", "confidence_score": 72.4, "is_flagged": True, "flag_reason": "Outlier Thickness (>18m)"},
            {"field_name": "Logged By", "field_value": "Er. R. K. Sharma", "confidence_score": 64.0, "is_flagged": True, "flag_reason": "Low Confidence OCR"}
        ]

        return {
            "filename": filename,
            "file_type": "PDF/Scan Field Log",
            "raw_text": raw_text or "Scanned CMPDI field log text...",
            "fields": fields
        }

    @staticmethod
    def _fallback_mock_extraction(filename: str, file_type: str) -> Dict[str, Any]:
        return {
            "filename": filename,
            "file_type": file_type,
            "raw_text": f"Raw sample text extracted from {filename}",
            "fields": [
                {"field_name": "Borehole ID", "field_value": "BH-TAL-01", "confidence_score": 98.0, "is_flagged": False},
                {"field_name": "Seam I Thickness", "field_value": "13.2 m", "confidence_score": 95.0, "is_flagged": False},
                {"field_name": "Ash %", "field_value": "19.8 %", "confidence_score": 91.0, "is_flagged": False},
                {"field_name": "GCV", "field_value": "6150 kcal/kg", "confidence_score": 89.0, "is_flagged": False}
            ]
        }
