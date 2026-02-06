'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Map as MapIcon, BarChart3, Sparkles } from 'lucide-react';
import IndiaMap from '@/components/IndiaMap';
import { getAllStates, getGeoJSON, getSummaryStats } from '@/lib/api';
import type { StateScore } from '@/lib/api';

export default function Home() {
  const [states, setStates] = useState<StateScore[]>([]);
  const [geojson, setGeojson] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statesData, geoData, statsData] = await Promise.all([
        getAllStates(),
        getGeoJSON(),
        getSummaryStats()
      ]);
      
      setStates(statesData);
      setGeojson(geoData);
      setSummaryStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const stateDataMap = new Map(
    states.map(state => [state.state, state])
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-energy-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-energy-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold gradient-text">Loading Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-energy-500/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyber-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-3">
              <span className="gradient-text">GreenScore AI</span>
              <br />
              <span className="text-white text-3xl">Readiness Dashboard</span>
            </h1>
            
            <p className="text-base text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Renewable energy readiness assessment for Indian States & Union Territories
              with real-time insights and interactive visualizations
            </p>
          </motion.div>

          {/* Stats Cards */}
          {summaryStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <StatsCard
                icon={<MapIcon className="w-6 h-6" />}
                label="Total States"
                value={summaryStats.total_states}
                color="energy"
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Avg Score"
                value={summaryStats.avg_score.toFixed(1)}
                suffix="/100"
                color="blue"
              />
              <StatsCard
                icon={<Zap className="w-6 h-6" />}
                label="Total Solar"
                value={(summaryStats.total_capacity.solar / 1000).toFixed(1)}
                suffix=" GW"
                color="yellow"
              />
              <StatsCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Total Capacity"
                value={(summaryStats.total_capacity.total / 1000).toFixed(1)}
                suffix=" GW"
                color="green"
              />
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Interactive Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-2xl neon-border">
          <h2 className="text-2xl font-bold text-white mb-6">
            Interactive Readiness Map
          </h2>
          
          <div className="h-[600px] rounded-2xl overflow-hidden bg-gray-900/50">
            {geojson && (
              <IndiaMap
                geojson={geojson}
                stateData={stateDataMap}
                selectedState={selectedState}
                onStateClick={setSelectedState}
              />
            )}
          </div>
        </div>
      </motion.section>

      {/* Top States Section */}
      {summaryStats && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="container mx-auto px-6 py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="text-lg font-bold mb-4 text-energy-700 dark:text-energy-400">
                🏆 Top Performers
              </h3>
              <div className="space-y-3">
                {summaryStats.top_states.map((state: any, index: number) => (
                  <motion.div
                    key={state.state}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-energy-50 dark:hover:bg-energy-900/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedState(state.state)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-energy-600">#{state.rank}</span>
                      <span className="font-medium text-sm text-gray-800 dark:text-white">{state.state}</span>
                    </div>
                    <span className="text-base font-bold text-energy-700 dark:text-energy-400">
                      {state.final_score.toFixed(1)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Emerging States */}
            <div className="glass rounded-2xl p-6 card-hover">
              <h3 className="text-lg font-bold mb-4 text-orange-600 dark:text-orange-400">
                🌱 Emerging States
              </h3>
              <div className="space-y-3">
                {summaryStats.bottom_states.map((state: any, index: number) => (
                  <motion.div
                    key={state.state}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedState(state.state)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-orange-600">#{state.rank}</span>
                      <span className="font-medium text-sm text-gray-800 dark:text-white">{state.state}</span>
                    </div>
                    <span className="text-base font-bold text-orange-700 dark:text-orange-400">
                      {state.final_score.toFixed(1)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </main>
  );
}

function StatsCard({ icon, label, value, suffix = '', color = 'energy' }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  color?: 'energy' | 'blue' | 'yellow' | 'green';
}) {
  const colorClasses = {
    energy: 'from-energy-500 to-energy-600',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass rounded-2xl p-6 card-hover"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white mb-4`}>
        {icon}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}{suffix}
      </p>
    </motion.div>
  );
}
