# FastAPI Backend for Energy Transition Dashboard
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sys
import os

# Add parent directory to path to import existing modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'energy_transition_app'))

from db import bootstrap_db
from scoring import (
    fetch_installed_capacity, fetch_geography,
    compute_baseline_bounds, compute_scores
)
from geo_weights import recommended_weights
from state_matching import align_states_to_geojson
from recommendations import generate_recommendations, get_quick_win_scenario
from ml_analysis import (
    train_comprehensive_ml_models, perform_pca_analysis,
    get_cluster_statistics, get_gmm_confidence, is_outlier, get_model_comparison
)
import json
import pandas as pd

app = FastAPI(
    title="Energy Transition Readiness API",
    description="API for India Energy Transition Readiness Dashboard",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for caching
DB_PATH = "../../energy_transition_app/energy_transition.db"
DATA_DIR = "../../energy_transition_app/data"
cached_data = {}

# Pydantic models
class StateScore(BaseModel):
    state: str
    rank: int
    final_score: float
    solar_mw: float
    wind_mw: float
    small_hydro_mw: float
    bio_power_mw: float
    large_hydro_mw: float
    total_mw: float
    solar_score: float
    wind_score: float
    small_hydro_score: float
    bio_score: float
    cluster: int
    cluster_name: str
    is_outlier: bool

class MLInsights(BaseModel):
    kmeans_cluster: str
    gmm_confidence: str
    gmm_probability: float
    is_outlier: bool
    outlier_score: float
    pca1: float
    pca2: float

class ScenarioRequest(BaseModel):
    state: str
    mode: str  # 'percent' or 'mw'
    delta_solar: float
    delta_wind: float
    delta_hydro: float
    delta_bio: float

class ScenarioResponse(BaseModel):
    base_score: float
    new_score: float
    delta_score: float
    base_rank: int
    new_rank: int
    delta_rank: int

def initialize_data():
    """Initialize and cache all data"""
    global cached_data
    
    if cached_data:
        return cached_data
    
    # Initialize database
    conn = bootstrap_db(DB_PATH, DATA_DIR)
    
    # Load data
    installed = fetch_installed_capacity(conn)
    geography = fetch_geography(conn)
    
    # Merge geography
    df = installed.merge(geography, on="state", how="left")
    for flag in ["coastal", "arid_desert", "mountain_himalayan", "high_agri_biomass"]:
        if flag not in df.columns:
            df[flag] = 0
        df[flag] = df[flag].fillna(0).astype(int)
    df["dominant_geo"] = df.get("dominant_geo", "Mixed").fillna("Mixed").astype(str)
    
    # Compute baseline scores
    bounds = compute_baseline_bounds(installed)
    baseline_scored, weights = compute_scores(installed, bounds, 0.25, 0.25, 0.25, 0.25)
    
    # Train ML models
    ml_results = train_comprehensive_ml_models(baseline_scored, n_clusters=4)
    pca_components, explained_variance, pca_loadings, pca_model, pca_scaler = perform_pca_analysis(baseline_scored)
    cluster_stats = get_cluster_statistics(
        baseline_scored, 
        ml_results['kmeans']['labels'], 
        ml_results['kmeans']['names']
    )
    
    # Add ML info to baseline
    baseline_scored['cluster'] = ml_results['kmeans']['labels']
    baseline_scored['cluster_name'] = baseline_scored['cluster'].map(ml_results['kmeans']['names'])
    baseline_scored['is_outlier'] = ml_results['isolation_forest']['labels'] == -1
    baseline_scored['outlier_score'] = ml_results['isolation_forest']['scores']
    baseline_scored['pca1'] = pca_components[:, 0]
    baseline_scored['pca2'] = pca_components[:, 1]
    
    # Load GeoJSON
    with open(os.path.join(DATA_DIR, "india_states.geojson"), "r", encoding="utf-8") as f:
        geojson = json.load(f)
    
    cached_data = {
        'conn': conn,
        'installed': installed,
        'geography': geography,
        'df': df,
        'bounds': bounds,
        'baseline_scored': baseline_scored,
        'ml_results': ml_results,
        'pca_components': pca_components,
        'explained_variance': explained_variance,
        'pca_loadings': pca_loadings,
        'cluster_stats': cluster_stats,
        'geojson': geojson,
        'weights': weights
    }
    
    return cached_data

@app.on_event("startup")
async def startup_event():
    """Initialize data on startup"""
    initialize_data()

@app.get("/")
async def root():
    return {
        "message": "Energy Transition Readiness API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/states", response_model=List[StateScore])
async def get_all_states():
    """Get all states with scores and rankings"""
    data = initialize_data()
    baseline = data['baseline_scored']
    
    states = []
    for _, row in baseline.iterrows():
        states.append(StateScore(
            state=row['state'],
            rank=int(row['rank']),
            final_score=float(row['final_score']),
            solar_mw=float(row['solar_mw']),
            wind_mw=float(row['wind_mw']),
            small_hydro_mw=float(row['small_hydro_mw']),
            bio_power_mw=float(row['bio_power_mw']),
            large_hydro_mw=float(row['large_hydro_mw']),
            total_mw=float(row['total_mw']),
            solar_score=float(row['solar_score']),
            wind_score=float(row['wind_score']),
            small_hydro_score=float(row['small_hydro_score']),
            bio_score=float(row['bio_score']),
            cluster=int(row['cluster']),
            cluster_name=str(row['cluster_name']),
            is_outlier=bool(row['is_outlier'])
        ))
    
    return states

@app.get("/api/states/{state_name}")
async def get_state_details(state_name: str):
    """Get detailed information for a specific state"""
    data = initialize_data()
    baseline = data['baseline_scored']
    df = data['df']
    ml_results = data['ml_results']
    
    # Find state
    state_data = baseline[baseline['state'] == state_name]
    if state_data.empty:
        raise HTTPException(status_code=404, detail="State not found")
    
    row = state_data.iloc[0]
    state_idx = state_data.index[0]
    
    # Get geography
    geo_data = df[df['state'] == state_name].iloc[0]
    
    # Get ML insights
    gmm_conf = get_gmm_confidence(ml_results['gmm']['probabilities'], state_idx)
    outlier_info = is_outlier(
        ml_results['isolation_forest']['labels'],
        ml_results['isolation_forest']['scores'],
        state_idx
    )
    
    # Get recommendations
    recommendations = generate_recommendations(
        row, data['bounds'], geo_data, int(row['rank']), len(baseline)
    )
    
    return {
        "state": state_name,
        "score": float(row['final_score']),
        "rank": int(row['rank']),
        "capacity": {
            "solar": float(row['solar_mw']),
            "wind": float(row['wind_mw']),
            "small_hydro": float(row['small_hydro_mw']),
            "bio_power": float(row['bio_power_mw']),
            "large_hydro": float(row['large_hydro_mw']),
            "total": float(row['total_mw'])
        },
        "scores": {
            "solar": float(row['solar_score']),
            "wind": float(row['wind_score']),
            "small_hydro": float(row['small_hydro_score']),
            "bio": float(row['bio_score'])
        },
        "geography": {
            "dominant": str(geo_data['dominant_geo']),
            "coastal": bool(geo_data['coastal']),
            "arid_desert": bool(geo_data['arid_desert']),
            "mountain": bool(geo_data['mountain_himalayan']),
            "high_biomass": bool(geo_data['high_agri_biomass'])
        },
        "ml_insights": {
            "cluster": str(row['cluster_name']),
            "cluster_id": int(row['cluster']),
            "gmm_confidence": gmm_conf['confidence'],
            "gmm_probability": float(gmm_conf['probability']),
            "is_outlier": bool(outlier_info['is_outlier']),
            "outlier_score": float(outlier_info['normalized_score']),
            "pca": {
                "pc1": float(row['pca1']),
                "pc2": float(row['pca2'])
            }
        },
        "recommendations": recommendations
    }

@app.get("/api/geojson")
async def get_geojson():
    """Get India states GeoJSON (TopoJSON format)"""
    data = initialize_data()
    return data['geojson']

@app.get("/api/ml/clusters")
async def get_cluster_info():
    """Get ML clustering information"""
    data = initialize_data()
    cluster_stats = data['cluster_stats']
    ml_results = data['ml_results']
    
    comparison, interpretation = get_model_comparison(ml_results['metrics'])
    
    return {
        "clusters": cluster_stats.to_dict('records'),
        "metrics": {
            "kmeans": comparison['kmeans'],
            "gmm": comparison['gmm']
        },
        "interpretation": interpretation,
        "outliers": ml_results['isolation_forest']['outliers']
    }

@app.get("/api/ml/pca")
async def get_pca_data():
    """Get PCA visualization data"""
    data = initialize_data()
    baseline = data['baseline_scored']
    
    pca_data = []
    for _, row in baseline.iterrows():
        pca_data.append({
            "state": row['state'],
            "pc1": float(row['pca1']),
            "pc2": float(row['pca2']),
            "cluster": int(row['cluster']),
            "cluster_name": str(row['cluster_name']),
            "score": float(row['final_score']),
            "is_outlier": bool(row['is_outlier'])
        })
    
    return {
        "data": pca_data,
        "explained_variance": [float(v) for v in data['explained_variance']],
        "loadings": data['pca_loadings'].to_dict()
    }

@app.post("/api/scenario", response_model=ScenarioResponse)
async def run_scenario(request: ScenarioRequest):
    """Run what-if scenario analysis"""
    from scoring import apply_whatif, scenario_delta
    
    data = initialize_data()
    installed = data['installed']
    bounds = data['bounds']
    baseline = data['baseline_scored']
    
    # Apply scenario
    scenario_installed = apply_whatif(
        installed, request.state, request.mode,
        request.delta_solar, request.delta_wind,
        request.delta_hydro, request.delta_bio
    )
    
    # Compute new scores
    scenario_scored, _ = compute_scores(scenario_installed, bounds, 0.25, 0.25, 0.25, 0.25)
    
    # Calculate delta
    delta = scenario_delta(baseline, scenario_scored, request.state)
    
    if not delta:
        raise HTTPException(status_code=400, detail="Could not calculate scenario")
    
    return ScenarioResponse(**delta)

@app.get("/api/stats/summary")
async def get_summary_stats():
    """Get summary statistics"""
    data = initialize_data()
    baseline = data['baseline_scored']
    
    return {
        "total_states": len(baseline),
        "avg_score": float(baseline['final_score'].mean()),
        "total_capacity": {
            "solar": float(baseline['solar_mw'].sum()),
            "wind": float(baseline['wind_mw'].sum()),
            "small_hydro": float(baseline['small_hydro_mw'].sum()),
            "bio_power": float(baseline['bio_power_mw'].sum()),
            "total": float(baseline['total_mw'].sum())
        },
        "top_states": baseline.nsmallest(5, 'rank')[['state', 'final_score', 'rank']].to_dict('records'),
        "bottom_states": baseline.nlargest(5, 'rank')[['state', 'final_score', 'rank']].to_dict('records')
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
