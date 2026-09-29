import os
import csv
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_sample_files():
    sample_dir = "sample_data"
    os.makedirs(sample_dir, exist_ok=True)
    
    # 1. Survey Sheet CSV
    csv_path = os.path.join(sample_dir, "sample_survey_sheet.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Borehole_ID", "Latitude", "Longitude", "Elevation_m", "Total_Depth_m", "Seam_I_Thick_m", "Ash_Percent", "GCV_kcal_kg", "Status"])
        writer.writerow(["BH-TAL-01", "20.9452", "85.1234", "122.5", "180.0", "13.2", "19.8", "6150", "Validated"])
        writer.writerow(["BH-TAL-04", "20.9575", "85.1445", "115.2", "175.0", "20.5", "17.5", "6450", "Pending Review"])
        writer.writerow(["BH-TAL-05", "20.9630", "85.1550", "130.0", "225.0", "12.2", "42.0", "3200", "Flagged Anomaly"])
        writer.writerow(["BH-TAL-26", "20.9680", "85.1620", "128.0", "190.0", "14.1", "21.2", "5980", "New Upload"])
    print(f"Created {csv_path}")

    # 2. LAS File (Log ASCII Standard)
    las_path = os.path.join(sample_dir, "sample_las_log_BH14.las")
    las_content = """~VERSION INFORMATION
 VERS.                  2.0 : CWLS LOG ASCII STANDARD - VERSION 2.0
 WRAP.                   NO : ONE LINE PER DEPTH STEP
~WELL INFORMATION
#MNEM.UNIT       DATA                           DESCRIPTION
#----.----       ------------------------------ -------------------
 STRT.M          0.0000                         : START DEPTH
 STOP.M          185.0000                       : STOP DEPTH
 STEP.M          0.1000                         : STEP
 NULL.           -999.2500                      : NULL VALUE
 WELL.           BH-TAL-14                      : WELL NAME
 FLD .           TALCHER COALFIELD              : FIELD NAME
 CNTY.           ANGUL                          : COUNTY / DISTRICT
 STAT.           ODISHA                         : STATE
 CTRY.           INDIA                          : COUNTRY
 SRVC.           CMPDI RI-VII                   : SERVICE COMPANY
 DATE.           2024-04-12                     : LOG DATE
~CURVE INFORMATION
#MNEM.UNIT       API CODE                       CURVE DESCRIPTION
#----.----       ------------------------------ -------------------
 DEPT.M                                         : DEPTH
 GR  .GAPI                                      : GAMMA RAY
 RES .OHMM                                      : RESISTIVITY
 DEN .G/CC                                      : DENSITY (COAL < 1.6 g/cc)
~LOG DATA
 0.00   45.2   12.5   2.45
 0.10   46.1   12.8   2.46
 42.00  110.2  45.0   1.42
 42.10  112.5  48.2   1.38
 42.20  108.4  46.1   1.39
 145.00 125.0  62.0   1.32
 145.10 128.1  64.5   1.30
 145.20 126.3  63.2   1.31
 185.00 55.0   18.0   2.65
"""
    with open(las_path, "w", encoding="utf-8") as f:
        f.write(las_content)
    print(f"Created {las_path}")

    # 3. PDF Sample Document (CMPDI Scanned Log Sheet)
    pdf_path = os.path.join(sample_dir, "sample_scan_log_1.pdf")
    c = canvas.Canvas(pdf_path, pagesize=letter)
    
    # Title & Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(150, 750, "CENTRAL MINE PLANNING & DESIGN INSTITUTE")
    c.setFont("Helvetica", 12)
    c.drawString(210, 730, "GEOLOGICAL BOREHOLE FIELD LOG")
    c.line(50, 720, 550, 720)
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 690, "Borehole ID:")
    c.setFont("Helvetica", 10)
    c.drawString(130, 690, "BH-TAL-04")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(300, 690, "Block:")
    c.setFont("Helvetica", 10)
    c.drawString(350, 690, "Talcher Central Block")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 670, "Latitude:")
    c.setFont("Helvetica", 10)
    c.drawString(130, 670, "20.9575 N")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(300, 670, "Longitude:")
    c.setFont("Helvetica", 10)
    c.drawString(370, 670, "85.1445 E")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 650, "Elevation:")
    c.setFont("Helvetica", 10)
    c.drawString(130, 650, "115.2 m RL")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(300, 650, "Total Depth:")
    c.setFont("Helvetica", 10)
    c.drawString(370, 650, "175.0 m")

    c.line(50, 635, 550, 635)
    
    # Table Header
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 615, "Seam Name")
    c.drawString(160, 615, "From (m)")
    c.drawString(240, 615, "To (m)")
    c.drawString(310, 615, "Thick (m)")
    c.drawString(380, 615, "Ash (%)")
    c.drawString(450, 615, "GCV (kcal/kg)")
    c.line(50, 605, 550, 605)
    
    # Rows
    rows = [
        ("Seam III (Top)", "36.50", "42.10", "5.60", "22.8", "5600"),
        ("Seam II (Middle)", "88.00", "97.50", "9.50", "34.2", "4150"),
        ("Seam I (Bottom)", "132.00", "152.50", "20.50", "17.5", "6450")
    ]
    
    y = 585
    c.setFont("Helvetica", 10)
    for r in rows:
        c.drawString(50, y, r[0])
        c.drawString(160, y, r[1])
        c.drawString(240, y, r[2])
        c.drawString(310, y, r[3])
        c.drawString(380, y, r[4])
        c.drawString(450, y, r[5])
        y -= 20
        
    c.line(50, y+10, 550, y+10)
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y-20, "Remarks / Field Anomalies:")
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, y-40, "* Seam I displays unusual thickness (20.50m) due to localized synclinal axial thickening.")
    c.drawString(50, y-55, "* Core recovery 94.2%. High vitrain content in Seam I base.")
    
    c.setFont("Helvetica", 9)
    c.drawString(50, 100, "Logged by: Er. R. K. Sharma (Senior Geologist, CMPDI)")
    c.drawString(350, 100, "Verified by: Dr. S. N. Pattanaik (HOD Geology)")
    
    c.save()
    print(f"Created {pdf_path}")

if __name__ == "__main__":
    create_sample_files()
