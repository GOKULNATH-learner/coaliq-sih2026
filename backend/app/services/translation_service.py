from typing import Dict, Any

class TranslationService:
    HINDI_DICTIONARY = {
        "Geological Report": "भूवैज्ञानिक रिपोर्ट",
        "Executive Summary": "कार्यकारी सारांश",
        "Location & Regional Geology": "स्थान एवं क्षेत्रीय भूविज्ञान",
        "Borehole Summary": "बोरोहोल सारांश",
        "Seam Characteristics & Coal Quality": "सीम विशेषताएँ एवं कोयला गुणवत्ता",
        "Reserve Estimation & Grade Classification": "भंडार अनुमान एवं ग्रेड वर्गीकरण",
        "Annexures & Audit Trail": "संलग्नक एवं लेखा परीक्षा निशान",
        "Talcher West Block-A": "तालचेर पश्चिम ब्लॉक-ए",
        "Talcher Central Block": "तालचेर मध्य ब्लॉक",
        "Talcher East Block-B": "तालचेर पूर्व ब्लॉक-बी",
        "Seam III (Top)": "सीम III (ऊपरी)",
        "Seam II (Middle)": "सीम II (मध्य)",
        "Seam I (Bottom)": "सीम I (निचली)",
        "Thickness": "मोटाई",
        "Ash Content": "राख की मात्रा",
        "Gross Calorific Value": "सकल कैलोरी मान",
        "Moisture": "नमी",
        "Proved Mineral Reserve": "प्रमाणित खनिज भंडार",
        "Validated": "सत्यापित",
        "Pending Review": "समीक्षा लंबित",
        "Flagged Anomaly": "ध्वजंकित विसंगति"
    }

    @staticmethod
    def translate_to_hindi(text: str) -> str:
        translated = text
        for eng, hin in TranslationService.HINDI_DICTIONARY.items():
            translated = translated.replace(eng, hin)
        return translated

    @staticmethod
    def get_translated_sections(sections: list, lang: str = "HI") -> list:
        if lang.upper() != "HI":
            return sections

        translated_sections = []
        for s in sections:
            translated_sections.append({
                "section_id": s["section_id"],
                "section_title": TranslationService.translate_to_hindi(s["section_title"]),
                "content": TranslationService.translate_to_hindi(s["content"]),
                "citations": s.get("citations", [])
            })
        return translated_sections
