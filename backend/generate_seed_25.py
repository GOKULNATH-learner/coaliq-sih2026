import json
import random

def generate_25_boreholes():
    base_coords = (20.945, 85.120)
    boreholes = []
    
    blocks = ["Talcher West Block-A", "Talcher Central Block", "Talcher East Block-B", "Kalinga Extension South", "Hingula Block North"]
    contractors = ["CMPDI Regional Institute VII", "MECL Exploration Div", "GSI Coal Wing"]
    
    for i in range(1, 26):
        bh_id = f"BH-TAL-{i:02d}"
        lat = round(base_coords[0] + random.uniform(0.005, 0.050), 4)
        lng = round(base_coords[1] + random.uniform(0.005, 0.080), 4)
        elev = round(random.uniform(105.0, 140.0), 1)
        
        # Depths
        top_s3 = round(random.uniform(32.0, 55.0), 1)
        thick_s3 = round(random.uniform(4.5, 6.5), 1)
        bot_s3 = round(top_s3 + thick_s3, 1)
        
        top_s2 = round(bot_s3 + random.uniform(40.0, 55.0), 1)
        thick_s2 = round(random.uniform(8.0, 11.5), 1)
        bot_s2 = round(top_s2 + thick_s2, 1)
        
        top_s1 = round(bot_s2 + random.uniform(35.0, 50.0), 1)
        thick_s1 = round(random.uniform(11.0, 16.5), 1)
        bot_s1 = round(top_s1 + thick_s1, 1)
        
        total_depth = round(bot_s1 + random.uniform(20.0, 40.0), 1)
        
        # Ash % and GCV
        ash_s3 = round(random.uniform(21.0, 27.0), 1)
        gcv_s3 = int(6800 - ash_s3 * 55)
        
        ash_s2 = round(random.uniform(26.0, 36.0), 1)
        gcv_s2 = int(6700 - ash_s2 * 55)
        
        ash_s1 = round(random.uniform(16.0, 23.0), 1)
        gcv_s1 = int(7200 - ash_s1 * 55)
        
        status = "Validated"
        if i in [4, 9, 14, 19]:
            status = "Pending Review"
        elif i in [5, 12, 22]:
            status = "Flagged Anomaly"
            
        # Introduce intentional anomalies for flagged/pending boreholes
        if bh_id == "BH-TAL-04":
            thick_s1 = 20.5 # Thickness anomaly
            bot_s1 = round(top_s1 + thick_s1, 1)
        elif bh_id == "BH-TAL-05":
            ash_s2 = 42.0 # High ash anomaly
            gcv_s2 = 3200
        elif bh_id == "BH-TAL-09":
            ash_s1 = 5.2 # Abnormally low ash anomaly
            
        bh = {
            "borehole_id": bh_id,
            "block_name": blocks[(i - 1) % len(blocks)],
            "latitude": lat,
            "longitude": lng,
            "elevation_m": elev,
            "total_depth_m": total_depth,
            "drilling_date": f"2024-{random.randint(1,4):02d}-{random.randint(1,28):02d}",
            "driller_contractor": contractors[(i - 1) % len(contractors)],
            "status": status,
            "seam_summary": [
                { "seam_name": "Seam III (Top)", "top_depth_m": top_s3, "bottom_depth_m": bot_s3, "thickness_m": thick_s3, "ash_percent": ash_s3, "gcv_kcal_kg": gcv_s3, "moisture_percent": round(random.uniform(5.0, 6.8), 1), "grade": "G6" if gcv_s3>5500 else "G8" },
                { "seam_name": "Seam II (Middle)", "top_depth_m": top_s2, "bottom_depth_m": bot_s2, "thickness_m": thick_s2, "ash_percent": ash_s2, "gcv_kcal_kg": gcv_s2, "moisture_percent": round(random.uniform(5.5, 7.2), 1), "grade": "G9" if gcv_s2>4700 else "G12" },
                { "seam_name": "Seam I (Bottom)", "top_depth_m": top_s1, "bottom_depth_m": bot_s1, "thickness_m": thick_s1, "ash_percent": ash_s1, "gcv_kcal_kg": gcv_s1, "moisture_percent": round(random.uniform(4.0, 5.5), 1), "grade": "G3" if gcv_s1>6200 else "G5" }
            ],
            "lithology": [
                { "from_m": 0.0, "to_m": round(random.uniform(5.0, 10.0), 1), "lithology_type": "Topsoil & Weathered Alluvium", "color": "#8D6E63", "description": "Weathered surface soil and alluvium clay." },
                { "from_m": round(random.uniform(5.0, 10.0), 1), "to_m": top_s3, "lithology_type": "Coarse Sandstone", "color": "#D7CCC8", "description": "Coarse grained feldspathic sandstone." },
                { "from_m": top_s3, "to_m": bot_s3, "lithology_type": "Coal (Seam III)", "color": "#212121", "description": "Bright to dull banded coal." },
                { "from_m": bot_s3, "to_m": round(bot_s3 + (top_s2 - bot_s3)*0.4, 1), "lithology_type": "Carbonaceous Shale", "color": "#424242", "description": "Dark grey carbonaceous shale." },
                { "from_m": round(bot_s3 + (top_s2 - bot_s3)*0.4, 1), "to_m": top_s2, "lithology_type": "Medium Sandstone", "color": "#CFD8DC", "description": "Grey medium sandstone." },
                { "from_m": top_s2, "to_m": bot_s2, "lithology_type": "Coal (Seam II)", "color": "#1A1A1A", "description": "Dull banded coal seam II." },
                { "from_m": bot_s2, "to_m": top_s1, "lithology_type": "Fine Sandstone & Siltstone", "color": "#B0BEC5", "description": "Interbedded siltstone and sandstone." },
                { "from_m": top_s1, "to_m": bot_s1, "lithology_type": "Coal (Seam I)", "color": "#000000", "description": "High grade thick coal seam I." },
                { "from_m": bot_s1, "to_m": total_depth, "lithology_type": "Basement Metamorphics", "color": "#546E7A", "description": "Granitic basement." }
            ]
        }
        boreholes.append(bh)
        
    with open("sample_data/talcher_boreholes_25.json", "w") as f:
        json.dump(boreholes, f, indent=2)

    print(f"Successfully generated {len(boreholes)} boreholes.")

if __name__ == "__main__":
    generate_25_boreholes()
