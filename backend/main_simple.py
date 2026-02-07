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

# Sample data
STATES_DATA = [
    {"state": "Karnataka", "rank": 1, "final_score": 85.5, "solar_mw": 7500, "wind_mw": 5200, "small_hydro_mw": 450, "bio_power_mw": 890, "large_hydro_mw": 4500, "total_mw": 18540},
    {"state": "Maharashtra", "rank": 2, "final_score": 82.3, "solar_mw": 6800, "wind_mw": 6500, "small_hydro_mw": 380, "bio_power_mw": 1200, "large_hydro_mw": 3200, "total_mw": 18080},
    {"state": "Tamil Nadu", "rank": 3, "final_score": 80.1, "solar_mw": 5900, "wind_mw": 9800, "small_hydro_mw": 290, "bio_power_mw": 750, "large_hydro_mw": 2100, "total_mw": 18840},
]

@app.get("/")
def root():
    return {"message": "GreenScore AI API", "status": "online"}

@app.get("/api/states")
def get_states():
    return STATES_DATA

@app.get("/api/geojson")
def get_geojson():
    # Simple India GeoJSON
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"name": "Karnataka"},
                "geometry": {"type": "Polygon", "coordinates": [[[75, 12], [78, 12], [78, 18], [75, 18], [75, 12]]]}
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
