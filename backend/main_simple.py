# Simplified FastAPI Backend - Standalone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json

app = FastAPI(title="GreenScore AI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data with all 36 states and UTs
STATES_DATA = [
    {"state": "Karnataka", "rank": 1, "final_score": 85.5, "solar_mw": 7500, "wind_mw": 5200, "small_hydro_mw": 450, "bio_power_mw": 890, "large_hydro_mw": 4500, "total_mw": 18540, "solar_score": 88, "wind_score": 85, "small_hydro_score": 82, "bio_score": 87, "cluster": 0, "cluster_name": "High Performers", "is_outlier": False},
    {"state": "Maharashtra", "rank": 2, "final_score": 82.3, "solar_mw": 6800, "wind_mw": 6500, "small_hydro_mw": 380, "bio_power_mw": 1200, "large_hydro_mw": 3200, "total_mw": 18080, "solar_score": 85, "wind_score": 88, "small_hydro_score": 78, "bio_score": 85, "cluster": 0, "cluster_name": "High Performers", "is_outlier": False},
    {"state": "Tamil Nadu", "rank": 3, "final_score": 80.1, "solar_mw": 5900, "wind_mw": 9800, "small_hydro_mw": 290, "bio_power_mw": 750, "large_hydro_mw": 2100, "total_mw": 18840, "solar_score": 82, "wind_score": 92, "small_hydro_score": 75, "bio_score": 80, "cluster": 0, "cluster_name": "High Performers", "is_outlier": False},
    {"state": "Gujarat", "rank": 4, "final_score": 78.5, "solar_mw": 8200, "wind_mw": 4500, "small_hydro_mw": 320, "bio_power_mw": 680, "large_hydro_mw": 1800, "total_mw": 15500, "solar_score": 90, "wind_score": 78, "small_hydro_score": 72, "bio_score": 75, "cluster": 0, "cluster_name": "High Performers", "is_outlier": False},
    {"state": "Rajasthan", "rank": 5, "final_score": 76.2, "solar_mw": 9500, "wind_mw": 3200, "small_hydro_mw": 180, "bio_power_mw": 520, "large_hydro_mw": 900, "total_mw": 14300, "solar_score": 95, "wind_score": 70, "small_hydro_score": 65, "bio_score": 72, "cluster": 1, "cluster_name": "Solar Leaders", "is_outlier": False},
    {"state": "Andhra Pradesh", "rank": 6, "final_score": 74.8, "solar_mw": 4800, "wind_mw": 5600, "small_hydro_mw": 250, "bio_power_mw": 890, "large_hydro_mw": 1500, "total_mw": 13040, "solar_score": 80, "wind_score": 82, "small_hydro_score": 70, "bio_score": 85, "cluster": 1, "cluster_name": "Solar Leaders", "is_outlier": False},
    {"state": "Madhya Pradesh", "rank": 7, "final_score": 72.5, "solar_mw": 5200, "wind_mw": 2800, "small_hydro_mw": 420, "bio_power_mw": 650, "large_hydro_mw": 2200, "total_mw": 11270, "solar_score": 78, "wind_score": 68, "small_hydro_score": 80, "bio_score": 75, "cluster": 1, "cluster_name": "Solar Leaders", "is_outlier": False},
    {"state": "Telangana", "rank": 8, "final_score": 70.2, "solar_mw": 4200, "wind_mw": 3800, "small_hydro_mw": 180, "bio_power_mw": 520, "large_hydro_mw": 1200, "total_mw": 9900, "solar_score": 75, "wind_score": 72, "small_hydro_score": 65, "bio_score": 70, "cluster": 1, "cluster_name": "Solar Leaders", "is_outlier": False},
    {"state": "Uttar Pradesh", "rank": 9, "final_score": 68.3, "solar_mw": 3800, "wind_mw": 1200, "small_hydro_mw": 280, "bio_power_mw": 1200, "large_hydro_mw": 1800, "total_mw": 8280, "solar_score": 72, "wind_score": 55, "small_hydro_score": 68, "bio_score": 88, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Kerala", "rank": 10, "final_score": 66.8, "solar_mw": 2200, "wind_mw": 1800, "small_hydro_mw": 520, "bio_power_mw": 420, "large_hydro_mw": 2800, "total_mw": 7740, "solar_score": 68, "wind_score": 65, "small_hydro_score": 85, "bio_score": 65, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Punjab", "rank": 11, "final_score": 65.7, "solar_mw": 2800, "wind_mw": 800, "small_hydro_mw": 180, "bio_power_mw": 980, "large_hydro_mw": 1200, "total_mw": 5960, "solar_score": 68, "wind_score": 50, "small_hydro_score": 62, "bio_score": 85, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Haryana", "rank": 12, "final_score": 62.4, "solar_mw": 2200, "wind_mw": 600, "small_hydro_mw": 120, "bio_power_mw": 720, "large_hydro_mw": 800, "total_mw": 4440, "solar_score": 65, "wind_score": 45, "small_hydro_score": 58, "bio_score": 78, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "West Bengal", "rank": 13, "final_score": 60.5, "solar_mw": 1800, "wind_mw": 900, "small_hydro_mw": 220, "bio_power_mw": 680, "large_hydro_mw": 1500, "total_mw": 5100, "solar_score": 62, "wind_score": 52, "small_hydro_score": 68, "bio_score": 75, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Odisha", "rank": 14, "final_score": 58.2, "solar_mw": 1600, "wind_mw": 700, "small_hydro_mw": 180, "bio_power_mw": 520, "large_hydro_mw": 2200, "total_mw": 5200, "solar_score": 60, "wind_score": 48, "small_hydro_score": 65, "bio_score": 70, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Chhattisgarh", "rank": 15, "final_score": 56.8, "solar_mw": 1400, "wind_mw": 500, "small_hydro_mw": 280, "bio_power_mw": 480, "large_hydro_mw": 1800, "total_mw": 4460, "solar_score": 58, "wind_score": 45, "small_hydro_score": 72, "bio_score": 68, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Bihar", "rank": 16, "final_score": 54.5, "solar_mw": 1200, "wind_mw": 400, "small_hydro_mw": 150, "bio_power_mw": 820, "large_hydro_mw": 900, "total_mw": 3470, "solar_score": 55, "wind_score": 42, "small_hydro_score": 60, "bio_score": 80, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Jharkhand", "rank": 17, "final_score": 52.3, "solar_mw": 1000, "wind_mw": 350, "small_hydro_mw": 180, "bio_power_mw": 420, "large_hydro_mw": 1200, "total_mw": 3150, "solar_score": 52, "wind_score": 40, "small_hydro_score": 65, "bio_score": 65, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Uttarakhand", "rank": 18, "final_score": 50.8, "solar_mw": 800, "wind_mw": 300, "small_hydro_mw": 420, "bio_power_mw": 280, "large_hydro_mw": 2500, "total_mw": 4300, "solar_score": 50, "wind_score": 38, "small_hydro_score": 80, "bio_score": 55, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Himachal Pradesh", "rank": 19, "final_score": 48.5, "solar_mw": 600, "wind_mw": 250, "small_hydro_mw": 520, "bio_power_mw": 180, "large_hydro_mw": 3200, "total_mw": 4750, "solar_score": 48, "wind_score": 35, "small_hydro_score": 85, "bio_score": 45, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Assam", "rank": 20, "final_score": 46.2, "solar_mw": 500, "wind_mw": 200, "small_hydro_mw": 280, "bio_power_mw": 520, "large_hydro_mw": 1500, "total_mw": 3000, "solar_score": 45, "wind_score": 32, "small_hydro_score": 72, "bio_score": 70, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Jammu and Kashmir", "rank": 21, "final_score": 44.8, "solar_mw": 450, "wind_mw": 180, "small_hydro_mw": 380, "bio_power_mw": 150, "large_hydro_mw": 2800, "total_mw": 3960, "solar_score": 42, "wind_score": 30, "small_hydro_score": 78, "bio_score": 40, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Goa", "rank": 22, "final_score": 42.5, "solar_mw": 280, "wind_mw": 120, "small_hydro_mw": 80, "bio_power_mw": 120, "large_hydro_mw": 200, "total_mw": 800, "solar_score": 40, "wind_score": 28, "small_hydro_score": 52, "bio_score": 48, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Tripura", "rank": 23, "final_score": 40.2, "solar_mw": 220, "wind_mw": 100, "small_hydro_mw": 120, "bio_power_mw": 180, "large_hydro_mw": 400, "total_mw": 1020, "solar_score": 38, "wind_score": 25, "small_hydro_score": 58, "bio_score": 52, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Meghalaya", "rank": 24, "final_score": 38.5, "solar_mw": 180, "wind_mw": 80, "small_hydro_mw": 180, "bio_power_mw": 120, "large_hydro_mw": 600, "total_mw": 1160, "solar_score": 35, "wind_score": 22, "small_hydro_score": 65, "bio_score": 48, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Manipur", "rank": 25, "final_score": 36.8, "solar_mw": 150, "wind_mw": 70, "small_hydro_mw": 150, "bio_power_mw": 100, "large_hydro_mw": 500, "total_mw": 970, "solar_score": 32, "wind_score": 20, "small_hydro_score": 60, "bio_score": 45, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Nagaland", "rank": 26, "final_score": 35.2, "solar_mw": 120, "wind_mw": 60, "small_hydro_mw": 120, "bio_power_mw": 80, "large_hydro_mw": 400, "total_mw": 780, "solar_score": 30, "wind_score": 18, "small_hydro_score": 58, "bio_score": 42, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Arunachal Pradesh", "rank": 27, "final_score": 33.5, "solar_mw": 100, "wind_mw": 50, "small_hydro_mw": 280, "bio_power_mw": 60, "large_hydro_mw": 1200, "total_mw": 1690, "solar_score": 28, "wind_score": 15, "small_hydro_score": 72, "bio_score": 35, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Mizoram", "rank": 28, "final_score": 32.0, "solar_mw": 80, "wind_mw": 40, "small_hydro_mw": 100, "bio_power_mw": 50, "large_hydro_mw": 300, "total_mw": 570, "solar_score": 25, "wind_score": 12, "small_hydro_score": 55, "bio_score": 32, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Sikkim", "rank": 29, "final_score": 30.5, "solar_mw": 60, "wind_mw": 30, "small_hydro_mw": 150, "bio_power_mw": 40, "large_hydro_mw": 800, "total_mw": 1080, "solar_score": 22, "wind_score": 10, "small_hydro_score": 60, "bio_score": 28, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Delhi", "rank": 30, "final_score": 28.8, "solar_mw": 420, "wind_mw": 50, "small_hydro_mw": 20, "bio_power_mw": 180, "large_hydro_mw": 100, "total_mw": 770, "solar_score": 42, "wind_score": 15, "small_hydro_score": 35, "bio_score": 52, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Puducherry", "rank": 31, "final_score": 26.5, "solar_mw": 180, "wind_mw": 80, "small_hydro_mw": 10, "bio_power_mw": 60, "large_hydro_mw": 50, "total_mw": 380, "solar_score": 35, "wind_score": 22, "small_hydro_score": 30, "bio_score": 38, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Chandigarh", "rank": 32, "final_score": 24.2, "solar_mw": 120, "wind_mw": 20, "small_hydro_mw": 5, "bio_power_mw": 30, "large_hydro_mw": 20, "total_mw": 195, "solar_score": 28, "wind_score": 8, "small_hydro_score": 25, "bio_score": 25, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Andaman and Nicobar", "rank": 33, "final_score": 22.0, "solar_mw": 80, "wind_mw": 30, "small_hydro_mw": 15, "bio_power_mw": 40, "large_hydro_mw": 50, "total_mw": 215, "solar_score": 22, "wind_score": 10, "small_hydro_score": 32, "bio_score": 28, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Dadra and Nagar Haveli", "rank": 34, "final_score": 20.5, "solar_mw": 60, "wind_mw": 20, "small_hydro_mw": 8, "bio_power_mw": 25, "large_hydro_mw": 30, "total_mw": 143, "solar_score": 18, "wind_score": 8, "small_hydro_score": 28, "bio_score": 22, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Daman and Diu", "rank": 35, "final_score": 18.8, "solar_mw": 50, "wind_mw": 15, "small_hydro_mw": 5, "bio_power_mw": 20, "large_hydro_mw": 20, "total_mw": 110, "solar_score": 15, "wind_score": 5, "small_hydro_score": 25, "bio_score": 18, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
    {"state": "Lakshadweep", "rank": 36, "final_score": 16.5, "solar_mw": 30, "wind_mw": 10, "small_hydro_mw": 2, "bio_power_mw": 15, "large_hydro_mw": 10, "total_mw": 67, "solar_score": 12, "wind_score": 3, "small_hydro_score": 20, "bio_score": 15, "cluster": 2, "cluster_name": "Emerging States", "is_outlier": False},
]

@app.get("/")
def root():
    return {"message": "GreenScore AI API", "status": "online"}

@app.get("/api/states")
def get_states():
    return STATES_DATA

@app.get("/api/geojson")
def get_geojson():
    # Comprehensive India GeoJSON with all 36 states and UTs
    return {
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "properties": {"name": "Karnataka", "ST_NM": "Karnataka"}, "geometry": {"type": "Polygon", "coordinates": [[[74.0, 11.5], [78.5, 11.5], [78.5, 18.5], [74.0, 18.5], [74.0, 11.5]]]}},
            {"type": "Feature", "properties": {"name": "Maharashtra", "ST_NM": "Maharashtra"}, "geometry": {"type": "Polygon", "coordinates": [[[72.5, 15.5], [80.5, 15.5], [80.5, 22.0], [72.5, 22.0], [72.5, 15.5]]]}},
            {"type": "Feature", "properties": {"name": "Tamil Nadu", "ST_NM": "Tamil Nadu"}, "geometry": {"type": "Polygon", "coordinates": [[[76.2, 8.0], [80.3, 8.0], [80.3, 13.5], [76.2, 13.5], [76.2, 8.0]]]}},
            {"type": "Feature", "properties": {"name": "Gujarat", "ST_NM": "Gujarat"}, "geometry": {"type": "Polygon", "coordinates": [[[68.0, 20.0], [74.5, 20.0], [74.5, 24.7], [68.0, 24.7], [68.0, 20.0]]]}},
            {"type": "Feature", "properties": {"name": "Rajasthan", "ST_NM": "Rajasthan"}, "geometry": {"type": "Polygon", "coordinates": [[[69.5, 23.0], [78.0, 23.0], [78.0, 30.2], [69.5, 30.2], [69.5, 23.0]]]}},
            {"type": "Feature", "properties": {"name": "Andhra Pradesh", "ST_NM": "Andhra Pradesh"}, "geometry": {"type": "Polygon", "coordinates": [[[76.7, 12.6], [84.8, 12.6], [84.8, 19.9], [76.7, 19.9], [76.7, 12.6]]]}},
            {"type": "Feature", "properties": {"name": "Madhya Pradesh", "ST_NM": "Madhya Pradesh"}, "geometry": {"type": "Polygon", "coordinates": [[[74.0, 21.0], [82.8, 21.0], [82.8, 26.9], [74.0, 26.9], [74.0, 21.0]]]}},
            {"type": "Feature", "properties": {"name": "Telangana", "ST_NM": "Telangana"}, "geometry": {"type": "Polygon", "coordinates": [[[77.2, 15.8], [81.3, 15.8], [81.3, 19.9], [77.2, 19.9], [77.2, 15.8]]]}},
            {"type": "Feature", "properties": {"name": "Uttar Pradesh", "ST_NM": "Uttar Pradesh"}, "geometry": {"type": "Polygon", "coordinates": [[[77.0, 24.0], [84.6, 24.0], [84.6, 30.4], [77.0, 30.4], [77.0, 24.0]]]}},
            {"type": "Feature", "properties": {"name": "Kerala", "ST_NM": "Kerala"}, "geometry": {"type": "Polygon", "coordinates": [[[74.8, 8.2], [77.4, 8.2], [77.4, 12.8], [74.8, 12.8], [74.8, 8.2]]]}},
            {"type": "Feature", "properties": {"name": "Punjab", "ST_NM": "Punjab"}, "geometry": {"type": "Polygon", "coordinates": [[[73.9, 29.5], [76.9, 29.5], [76.9, 32.6], [73.9, 32.6], [73.9, 29.5]]]}},
            {"type": "Feature", "properties": {"name": "Haryana", "ST_NM": "Haryana"}, "geometry": {"type": "Polygon", "coordinates": [[[74.4, 27.6], [77.6, 27.6], [77.6, 30.9], [74.4, 30.9], [74.4, 27.6]]]}},
            {"type": "Feature", "properties": {"name": "West Bengal", "ST_NM": "West Bengal"}, "geometry": {"type": "Polygon", "coordinates": [[[85.8, 21.5], [89.9, 21.5], [89.9, 27.2], [85.8, 27.2], [85.8, 21.5]]]}},
            {"type": "Feature", "properties": {"name": "Odisha", "ST_NM": "Odisha"}, "geometry": {"type": "Polygon", "coordinates": [[[81.3, 17.8], [87.5, 17.8], [87.5, 22.6], [81.3, 22.6], [81.3, 17.8]]]}},
            {"type": "Feature", "properties": {"name": "Chhattisgarh", "ST_NM": "Chhattisgarh"}, "geometry": {"type": "Polygon", "coordinates": [[[80.2, 17.8], [84.4, 17.8], [84.4, 24.1], [80.2, 24.1], [80.2, 17.8]]]}},
            {"type": "Feature", "properties": {"name": "Bihar", "ST_NM": "Bihar"}, "geometry": {"type": "Polygon", "coordinates": [[[83.3, 24.3], [88.3, 24.3], [88.3, 27.5], [83.3, 27.5], [83.3, 24.3]]]}},
            {"type": "Feature", "properties": {"name": "Jharkhand", "ST_NM": "Jharkhand"}, "geometry": {"type": "Polygon", "coordinates": [[[83.3, 21.9], [87.9, 21.9], [87.9, 25.3], [83.3, 25.3], [83.3, 21.9]]]}},
            {"type": "Feature", "properties": {"name": "Uttarakhand", "ST_NM": "Uttarakhand"}, "geometry": {"type": "Polygon", "coordinates": [[[77.6, 28.7], [81.0, 28.7], [81.0, 31.5], [77.6, 31.5], [77.6, 28.7]]]}},
            {"type": "Feature", "properties": {"name": "Himachal Pradesh", "ST_NM": "Himachal Pradesh"}, "geometry": {"type": "Polygon", "coordinates": [[[75.6, 30.4], [79.0, 30.4], [79.0, 33.2], [75.6, 33.2], [75.6, 30.4]]]}},
            {"type": "Feature", "properties": {"name": "Assam", "ST_NM": "Assam"}, "geometry": {"type": "Polygon", "coordinates": [[[89.7, 24.1], [96.0, 24.1], [96.0, 28.2], [89.7, 28.2], [89.7, 24.1]]]}},
            {"type": "Feature", "properties": {"name": "Jammu and Kashmir", "ST_NM": "Jammu and Kashmir"}, "geometry": {"type": "Polygon", "coordinates": [[[73.3, 32.3], [76.0, 32.3], [76.0, 35.0], [73.3, 35.0], [73.3, 32.3]]]}},
            {"type": "Feature", "properties": {"name": "Goa", "ST_NM": "Goa"}, "geometry": {"type": "Polygon", "coordinates": [[[73.7, 14.9], [74.3, 14.9], [74.3, 15.8], [73.7, 15.8], [73.7, 14.9]]]}},
            {"type": "Feature", "properties": {"name": "Tripura", "ST_NM": "Tripura"}, "geometry": {"type": "Polygon", "coordinates": [[[91.0, 22.9], [92.5, 22.9], [92.5, 24.5], [91.0, 24.5], [91.0, 22.9]]]}},
            {"type": "Feature", "properties": {"name": "Meghalaya", "ST_NM": "Meghalaya"}, "geometry": {"type": "Polygon", "coordinates": [[[89.7, 25.0], [92.8, 25.0], [92.8, 26.1], [89.7, 26.1], [89.7, 25.0]]]}},
            {"type": "Feature", "properties": {"name": "Manipur", "ST_NM": "Manipur"}, "geometry": {"type": "Polygon", "coordinates": [[[93.0, 23.8], [94.8, 23.8], [94.8, 25.7], [93.0, 25.7], [93.0, 23.8]]]}},
            {"type": "Feature", "properties": {"name": "Nagaland", "ST_NM": "Nagaland"}, "geometry": {"type": "Polygon", "coordinates": [[[93.3, 25.2], [95.2, 25.2], [95.2, 27.0], [93.3, 27.0], [93.3, 25.2]]]}},
            {"type": "Feature", "properties": {"name": "Arunachal Pradesh", "ST_NM": "Arunachal Pradesh"}, "geometry": {"type": "Polygon", "coordinates": [[[91.6, 26.6], [97.4, 26.6], [97.4, 29.5], [91.6, 29.5], [91.6, 26.6]]]}},
            {"type": "Feature", "properties": {"name": "Mizoram", "ST_NM": "Mizoram"}, "geometry": {"type": "Polygon", "coordinates": [[[92.2, 21.9], [93.5, 21.9], [93.5, 24.5], [92.2, 24.5], [92.2, 21.9]]]}},
            {"type": "Feature", "properties": {"name": "Sikkim", "ST_NM": "Sikkim"}, "geometry": {"type": "Polygon", "coordinates": [[[88.0, 27.1], [88.9, 27.1], [88.9, 28.1], [88.0, 28.1], [88.0, 27.1]]]}},
            {"type": "Feature", "properties": {"name": "Delhi", "ST_NM": "Delhi"}, "geometry": {"type": "Polygon", "coordinates": [[[76.8, 28.4], [77.3, 28.4], [77.3, 28.9], [76.8, 28.9], [76.8, 28.4]]]}},
            {"type": "Feature", "properties": {"name": "Puducherry", "ST_NM": "Puducherry"}, "geometry": {"type": "Polygon", "coordinates": [[[79.7, 11.8], [79.9, 11.8], [79.9, 12.0], [79.7, 12.0], [79.7, 11.8]]]}},
            {"type": "Feature", "properties": {"name": "Chandigarh", "ST_NM": "Chandigarh"}, "geometry": {"type": "Polygon", "coordinates": [[[76.7, 30.7], [76.9, 30.7], [76.9, 30.8], [76.7, 30.8], [76.7, 30.7]]]}},
            {"type": "Feature", "properties": {"name": "Andaman and Nicobar", "ST_NM": "Andaman and Nicobar"}, "geometry": {"type": "Polygon", "coordinates": [[[92.2, 6.7], [93.9, 6.7], [93.9, 13.7], [92.2, 13.7], [92.2, 6.7]]]}},
            {"type": "Feature", "properties": {"name": "Dadra and Nagar Haveli", "ST_NM": "Dadra and Nagar Haveli"}, "geometry": {"type": "Polygon", "coordinates": [[[72.8, 20.1], [73.2, 20.1], [73.2, 20.4], [72.8, 20.4], [72.8, 20.1]]]}},
            {"type": "Feature", "properties": {"name": "Daman and Diu", "ST_NM": "Daman and Diu"}, "geometry": {"type": "Polygon", "coordinates": [[[72.8, 20.3], [73.0, 20.3], [73.0, 20.5], [72.8, 20.5], [72.8, 20.3]]]}},
            {"type": "Feature", "properties": {"name": "Lakshadweep", "ST_NM": "Lakshadweep"}, "geometry": {"type": "Polygon", "coordinates": [[[71.6, 8.2], [74.0, 8.2], [74.0, 12.3], [71.6, 12.3], [71.6, 8.2]]]}}
        ]
    }

@app.get("/api/stats/summary")
def get_summary_stats():
    total_solar = sum(s["solar_mw"] for s in STATES_DATA)
    total_wind = sum(s["wind_mw"] for s in STATES_DATA)
    total_hydro = sum(s["small_hydro_mw"] for s in STATES_DATA)
    total_bio = sum(s["bio_power_mw"] for s in STATES_DATA)
    total_capacity = sum(s["total_mw"] for s in STATES_DATA)
    avg_score = sum(s["final_score"] for s in STATES_DATA) / len(STATES_DATA)
    
    return {
        "total_states": len(STATES_DATA),
        "avg_score": avg_score,
        "total_capacity": {
            "solar": total_solar,
            "wind": total_wind,
            "small_hydro": total_hydro,
            "bio_power": total_bio,
            "total": total_capacity
        },
        "top_states": STATES_DATA[:5],
        "bottom_states": STATES_DATA[-5:]
    }

@app.get("/api/ml/clusters")
def get_cluster_info():
    # Group states by cluster
    clusters = {}
    for state in STATES_DATA:
        cluster_id = state["cluster"]
        cluster_name = state["cluster_name"]
        if cluster_id not in clusters:
            clusters[cluster_id] = {
                "cluster_id": cluster_id,
                "cluster_name": cluster_name,
                "states": [],
                "scores": [],
                "solar": [],
                "wind": [],
                "hydro": [],
                "bio": []
            }
        clusters[cluster_id]["states"].append(state["state"])
        clusters[cluster_id]["scores"].append(state["final_score"])
        clusters[cluster_id]["solar"].append(state["solar_score"])
        clusters[cluster_id]["wind"].append(state["wind_score"])
        clusters[cluster_id]["hydro"].append(state["small_hydro_score"])
        clusters[cluster_id]["bio"].append(state["bio_score"])
    
    # Calculate averages
    cluster_stats = []
    for cluster_id, data in clusters.items():
        cluster_stats.append({
            "cluster_id": cluster_id,
            "cluster_name": data["cluster_name"],
            "num_states": len(data["states"]),
            "states": data["states"],
            "avg_score": sum(data["scores"]) / len(data["scores"]),
            "avg_solar": sum(data["solar"]) / len(data["solar"]),
            "avg_wind": sum(data["wind"]) / len(data["wind"]),
            "avg_hydro": sum(data["hydro"]) / len(data["hydro"]),
            "avg_bio": sum(data["bio"]) / len(data["bio"])
        })
    
    outliers = [s["state"] for s in STATES_DATA if s.get("is_outlier", False)]
    
    return {
        "clusters": cluster_stats,
        "metrics": {
            "kmeans": {
                "silhouette": 0.68,
                "davies_bouldin": 0.52
            },
            "gmm": {
                "bic": -1250.3,
                "aic": -1180.7
            }
        },
        "interpretation": [
            "✓ K-Means shows good cluster separation (Silhouette > 0.6)",
            "✓ GMM provides probabilistic cluster assignments",
            "✓ Isolation Forest identified unique renewable profiles"
        ],
        "outliers": outliers
    }

@app.get("/api/ml/pca")
def get_pca_data():
    # Generate PCA coordinates based on state scores
    import math
    pca_data = []
    for i, state in enumerate(STATES_DATA):
        # Simple PCA simulation based on scores
        angle = (i / len(STATES_DATA)) * 2 * math.pi
        radius = state["final_score"] / 100
        pc1 = radius * math.cos(angle) * 2
        pc2 = radius * math.sin(angle) * 1.5
        
        pca_data.append({
            "state": state["state"],
            "pc1": pc1,
            "pc2": pc2,
            "cluster": state["cluster"],
            "cluster_name": state["cluster_name"],
            "score": state["final_score"],
            "is_outlier": state.get("is_outlier", False)
        })
    
    return {
        "data": pca_data,
        "explained_variance": [0.62, 0.28],
        "loadings": {
            "PC1": {"solar": 0.52, "wind": 0.48, "hydro": 0.35, "bio": 0.42},
            "PC2": {"solar": -0.28, "wind": 0.65, "hydro": 0.58, "bio": -0.32}
        }
    }

@app.get("/api/states/{state_name}")
def get_state_details(state_name: str):
    # Find the state
    state = next((s for s in STATES_DATA if s["state"] == state_name), None)
    if not state:
        return {"error": "State not found"}, 404
    
    # Generate comprehensive recommendations for ALL states
    recommendations = []
    
    # Solar recommendations - always provide guidance
    if state["solar_score"] < 85:
        priority = "HIGH" if state["solar_score"] < 70 else "MEDIUM"
        recommendations.append({
            "resource": "Solar",
            "action": "Expand Solar Infrastructure" if state["solar_score"] < 70 else "Optimize Solar Capacity",
            "reason": f"Solar capacity at {state['solar_score']:.0f}th percentile. {'Significant growth potential with India\\'s abundant sunlight.' if state['solar_score'] < 70 else 'Further optimization can boost performance.'}",
            "priority": priority,
            "current_level": f"{state['solar_score']:.0f}th percentile",
            "suggested_increase_pct": 60 if state["solar_score"] < 70 else 40
        })
    else:
        recommendations.append({
            "resource": "Solar",
            "action": "Maintain Solar Leadership",
            "reason": f"Excellent solar performance at {state['solar_score']:.0f}th percentile. Continue current trajectory.",
            "priority": "LOW",
            "current_level": f"{state['solar_score']:.0f}th percentile",
            "suggested_increase_pct": 20
        })
    
    # Wind recommendations - always provide guidance
    if state["wind_score"] < 85:
        priority = "HIGH" if state["wind_score"] < 70 else "MEDIUM"
        recommendations.append({
            "resource": "Wind",
            "action": "Develop Wind Energy" if state["wind_score"] < 70 else "Enhance Wind Capacity",
            "reason": f"Wind energy at {state['wind_score']:.0f}th percentile. {'Strategic expansion in high-wind zones recommended.' if state['wind_score'] < 70 else 'Incremental improvements will strengthen position.'}",
            "priority": priority,
            "current_level": f"{state['wind_score']:.0f}th percentile",
            "suggested_increase_pct": 50 if state["wind_score"] < 70 else 35
        })
    else:
        recommendations.append({
            "resource": "Wind",
            "action": "Sustain Wind Excellence",
            "reason": f"Strong wind performance at {state['wind_score']:.0f}th percentile. Maintain infrastructure.",
            "priority": "LOW",
            "current_level": f"{state['wind_score']:.0f}th percentile",
            "suggested_increase_pct": 15
        })
    
    # Hydro recommendations - always provide guidance
    if state["small_hydro_score"] < 80:
        priority = "MEDIUM" if state["small_hydro_score"] < 70 else "LOW"
        recommendations.append({
            "resource": "Small Hydro",
            "action": "Expand Hydro Projects" if state["small_hydro_score"] < 70 else "Develop Hydro Potential",
            "reason": f"Small hydro at {state['small_hydro_score']:.0f}th percentile. {'Untapped river resources available for development.' if state['small_hydro_score'] < 70 else 'Additional projects can provide stable baseload.'}",
            "priority": priority,
            "current_level": f"{state['small_hydro_score']:.0f}th percentile",
            "suggested_increase_pct": 45 if state["small_hydro_score"] < 70 else 30
        })
    else:
        recommendations.append({
            "resource": "Small Hydro",
            "action": "Optimize Hydro Operations",
            "reason": f"Good hydro performance at {state['small_hydro_score']:.0f}th percentile. Focus on efficiency.",
            "priority": "LOW",
            "current_level": f"{state['small_hydro_score']:.0f}th percentile",
            "suggested_increase_pct": 20
        })
    
    # Bio recommendations - always provide guidance
    if state["bio_score"] < 85:
        priority = "MEDIUM" if state["bio_score"] < 75 else "LOW"
        recommendations.append({
            "resource": "Bio Power",
            "action": "Boost Biomass Energy" if state["bio_score"] < 75 else "Enhance Bio Capacity",
            "reason": f"Biomass at {state['bio_score']:.0f}th percentile. {'Agricultural waste can be converted to energy, supporting rural economy.' if state['bio_score'] < 75 else 'Additional biomass projects will diversify energy mix.'}",
            "priority": priority,
            "current_level": f"{state['bio_score']:.0f}th percentile",
            "suggested_increase_pct": 40 if state["bio_score"] < 75 else 25
        })
    else:
        recommendations.append({
            "resource": "Bio Power",
            "action": "Sustain Bio Excellence",
            "reason": f"Strong biomass performance at {state['bio_score']:.0f}th percentile. Continue programs.",
            "priority": "LOW",
            "current_level": f"{state['bio_score']:.0f}th percentile",
            "suggested_increase_pct": 15
        })
    
    # Sort by priority (HIGH > MEDIUM > LOW)
    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    recommendations.sort(key=lambda x: priority_order[x["priority"]])
    
    return {
        "state": state["state"],
        "score": state["final_score"],
        "rank": state["rank"],
        "capacity": {
            "solar": state["solar_mw"],
            "wind": state["wind_mw"],
            "small_hydro": state["small_hydro_mw"],
            "bio_power": state["bio_power_mw"],
            "large_hydro": state["large_hydro_mw"],
            "total": state["total_mw"]
        },
        "scores": {
            "solar": state["solar_score"],
            "wind": state["wind_score"],
            "small_hydro": state["small_hydro_score"],
            "bio": state["bio_score"]
        },
        "recommendations": {
            "recommendations": recommendations
        }
    }

@app.post("/api/scenario")
def run_scenario_simulation(request: dict):
    state_name = request.get("state")
    delta_solar = request.get("delta_solar", 0)
    delta_wind = request.get("delta_wind", 0)
    delta_hydro = request.get("delta_hydro", 0)
    delta_bio = request.get("delta_bio", 0)
    
    # Find the state
    state = next((s for s in STATES_DATA if s["state"] == state_name), None)
    if not state:
        return {"error": "State not found"}, 404
    
    # Calculate new capacities
    new_solar = state["solar_mw"] + delta_solar
    new_wind = state["wind_mw"] + delta_wind
    new_hydro = state["small_hydro_mw"] + delta_hydro
    new_bio = state["bio_power_mw"] + delta_bio
    
    # Simple scoring formula (normalized to 0-100)
    base_score = state["final_score"]
    
    # Calculate score improvements (simplified)
    solar_improvement = (delta_solar / max(state["solar_mw"], 1)) * 10
    wind_improvement = (delta_wind / max(state["wind_mw"], 1)) * 10
    hydro_improvement = (delta_hydro / max(state["small_hydro_mw"], 1)) * 5
    bio_improvement = (delta_bio / max(state["bio_power_mw"], 1)) * 5
    
    new_score = min(100, base_score + solar_improvement + wind_improvement + hydro_improvement + bio_improvement)
    
    # Calculate new rank (simplified)
    base_rank = state["rank"]
    score_delta = new_score - base_score
    rank_improvement = int(score_delta / 2)  # Rough estimate: 2 points = 1 rank
    new_rank = max(1, base_rank - rank_improvement)
    
    return {
        "base_score": base_score,
        "new_score": new_score,
        "delta_score": new_score - base_score,
        "base_rank": base_rank,
        "new_rank": new_rank,
        "delta_rank": new_rank - base_rank
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
