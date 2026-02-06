// API client for backend communication
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface StateScore {
  state: string;
  rank: number;
  final_score: number;
  solar_mw: number;
  wind_mw: number;
  small_hydro_mw: number;
  bio_power_mw: number;
  large_hydro_mw: number;
  total_mw: number;
  solar_score: number;
  wind_score: number;
  small_hydro_score: number;
  bio_score: number;
  cluster: number;
  cluster_name: string;
  is_outlier: boolean;
}

export interface StateDetails {
  state: string;
  score: number;
  rank: number;
  capacity: {
    solar: number;
    wind: number;
    small_hydro: number;
    bio_power: number;
    large_hydro: number;
    total: number;
  };
  scores: {
    solar: number;
    wind: number;
    small_hydro: number;
    bio: number;
  };
  geography: {
    dominant: string;
    coastal: boolean;
    arid_desert: boolean;
    mountain: boolean;
    high_biomass: boolean;
  };
  ml_insights: {
    cluster: string;
    cluster_id: number;
    gmm_confidence: string;
    gmm_probability: number;
    is_outlier: boolean;
    outlier_score: number;
    pca: {
      pc1: number;
      pc2: number;
    };
  };
  recommendations: any;
}

export interface ScenarioRequest {
  state: string;
  mode: 'percent' | 'mw';
  delta_solar: number;
  delta_wind: number;
  delta_hydro: number;
  delta_bio: number;
}

export interface ScenarioResponse {
  base_score: number;
  new_score: number;
  delta_score: number;
  base_rank: number;
  new_rank: number;
  delta_rank: number;
}

// API functions
export const getAllStates = async (): Promise<StateScore[]> => {
  const response = await api.get('/api/states');
  return response.data;
};

export const getStateDetails = async (stateName: string): Promise<StateDetails> => {
  const response = await api.get(`/api/states/${encodeURIComponent(stateName)}`);
  return response.data;
};

export const getGeoJSON = async () => {
  const response = await api.get('/api/geojson');
  return response.data;
};

export const getClusterInfo = async () => {
  const response = await api.get('/api/ml/clusters');
  return response.data;
};

export const getPCAData = async () => {
  const response = await api.get('/api/ml/pca');
  return response.data;
};

export const runScenario = async (
  state: string,
  solarIncrease: number,
  windIncrease: number,
  hydroIncrease: number,
  bioIncrease: number
): Promise<any> => {
  const request = {
    state,
    mode: 'mw' as const,
    delta_solar: solarIncrease,
    delta_wind: windIncrease,
    delta_hydro: hydroIncrease,
    delta_bio: bioIncrease,
  };
  const response = await api.post('/api/scenario', request);
  return response.data;
};

export const getSummaryStats = async () => {
  const response = await api.get('/api/stats/summary');
  return response.data;
};
