'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Wind, Sun, Droplet, Lightbulb, Target, ArrowRight, Brain } from 'lucide-react';
import { runScenario, getAllStates, getStateDetails } from '@/lib/api';
import type { StateScore } from '@/lib/api';

export default function SimulatorPage() {
  const [states, setStates] = useState<StateScore[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateDetails, setStateDetails] = useState<any>(null);
  const [solarIncrease, setSolarIncrease] = useState(0); // percentage
  const [windIncrease, setWindIncrease] = useState(0); // percentage
  const [hydroIncrease, setHydroIncrease] = useState(0); // percentage
  const [bioIncrease, setBioIncrease] = useState(0); // percentage
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      loadStateDetails();
    }
  }, [selectedState]);

  const loadStateDetails = async () => {
    if (!selectedState) return;
    
    try {
      const details = await getStateDetails(selectedState);
      setStateDetails(details);
      generateRecommendations(details);
    } catch (error) {
      console.error('Error loading state details:', error);
    }
  };

  const generateRecommendations = (details: any) => {
    if (!details || !details.recommendations || !details.recommendations.recommendations) return;

    const recs = details.recommendations.recommendations;
    const suggestions = [];

    // Map backend recommendations to UI suggestions (using percentages)
    for (const rec of recs) {
      const resourceMap: Record<string, any> = {
        'Solar': {
          type: 'solar',
          values: { solar: rec.suggested_increase_pct || 50, wind: 0, hydro: 0, bio: 0 },
          icon: <Sun className="w-5 h-5" />,
          color: 'from-yellow-500 to-orange-500'
        },
        'Wind': {
          type: 'wind',
          values: { solar: 0, wind: rec.suggested_increase_pct || 50, hydro: 0, bio: 0 },
          icon: <Wind className="w-5 h-5" />,
          color: 'from-cyan-500 to-blue-500'
        },
        'Small Hydro': {
          type: 'hydro',
          values: { solar: 0, wind: 0, hydro: rec.suggested_increase_pct || 50, bio: 0 },
          icon: <Droplet className="w-5 h-5" />,
          color: 'from-blue-500 to-cyan-500'
        },
        'Bio Power': {
          type: 'bio',
          values: { solar: 0, wind: 0, hydro: 0, bio: rec.suggested_increase_pct || 50 },
          icon: <Zap className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-500'
        }
      };

      const resourceConfig = resourceMap[rec.resource];
      if (resourceConfig) {
        suggestions.push({
          ...resourceConfig,
          title: rec.action || `${rec.resource} Development`,
          description: rec.reason || `Enhance ${rec.resource.toLowerCase()} capacity`,
          priority: rec.priority || 'MEDIUM',
          percentile: rec.current_level,
          impact: rec.priority === 'HIGH' ? '+5-8 points' : rec.priority === 'MEDIUM' ? '+3-5 points' : '+2-3 points',
        });
      }
    }

    setSuggestions(suggestions);
  };

  const loadStates = async () => {
    try {
      const data = await getAllStates();
      setStates(data);
      if (data.length > 0) {
        setSelectedState(data[0].state);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const applySuggestion = (suggestion: any) => {
    setSolarIncrease(suggestion.values.solar);
    setWindIncrease(suggestion.values.wind);
    setHydroIncrease(suggestion.values.hydro);
    setBioIncrease(suggestion.values.bio);
    // Keep suggestions visible
  };

  const runSuggestionSimulation = async (suggestion: any) => {
    setSolarIncrease(suggestion.values.solar);
    setWindIncrease(suggestion.values.wind);
    setHydroIncrease(suggestion.values.hydro);
    setBioIncrease(suggestion.values.bio);
    
    setLoading(true);
    try {
      // Convert percentages to MW based on current capacity
      const solarMW = currentState ? (currentState.solar_mw * suggestion.values.solar / 100) : 0;
      const windMW = currentState ? (currentState.wind_mw * suggestion.values.wind / 100) : 0;
      const hydroMW = currentState ? (currentState.small_hydro_mw * suggestion.values.hydro / 100) : 0;
      const bioMW = currentState ? (currentState.bio_power_mw * suggestion.values.bio / 100) : 0;
      
      const scenarioResult = await runScenario(
        selectedState,
        solarMW,
        windMW,
        hydroMW,
        bioMW
      );
      setResult(scenarioResult);
      // Don't hide suggestions - keep them visible
    } catch (error) {
      console.error('Error running scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!selectedState || !currentState) return;
    
    setLoading(true);
    try {
      // Convert percentages to MW based on current capacity
      const solarMW = currentState.solar_mw * solarIncrease / 100;
      const windMW = currentState.wind_mw * windIncrease / 100;
      const hydroMW = currentState.small_hydro_mw * hydroIncrease / 100;
      const bioMW = currentState.bio_power_mw * bioIncrease / 100;
      
      const scenarioResult = await runScenario(
        selectedState,
        solarMW,
        windMW,
        hydroMW,
        bioMW
      );
      setResult(scenarioResult);
    } catch (error) {
      console.error('Error running scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetInputs = () => {
    setSolarIncrease(0);
    setWindIncrease(0);
    setHydroIncrease(0);
    setBioIncrease(0);
    setResult(null);
    // Keep suggestions visible
  };

  const currentState = states.find(s => s.state === selectedState);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">GreenScore AI</span>
          </h1>
          <p className="text-base text-gray-300 max-w-3xl mx-auto">
            Renewable Energy Scenario Modeling & Strategic Recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Strategic Analysis Panel - Always visible */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-1"
            >
              <div className="glass-strong rounded-3xl p-6 shadow-2xl neon-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Strategic Analysis</h2>
                    <p className="text-xs text-gray-400">Optimized for {selectedState}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-5 rounded-xl glass-strong border border-accent-500/20 hover:border-accent-500/40 transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${suggestion.color} flex-shrink-0`}>
                          {suggestion.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-white text-base">
                              {suggestion.title}
                            </h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              suggestion.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                              suggestion.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {suggestion.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2 leading-relaxed">{suggestion.description}</p>
                          {suggestion.percentile && (
                            <p className="text-xs text-accent-400 mb-2 font-medium">
                              Current: {suggestion.percentile}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Expected Impact: <span className="text-accent-400 font-bold">{suggestion.impact}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => runSuggestionSimulation(suggestion)}
                          disabled={loading}
                          className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-600 to-accent-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-accent-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Running...' : 'Run Simulation'}
                        </button>
                        <button
                          onClick={() => applySuggestion(suggestion)}
                          className="px-4 py-2 rounded-lg glass text-white text-sm font-medium hover:glass-strong transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={suggestions.length > 0 ? 'xl:col-span-1' : 'xl:col-span-2'}
          >
            <div className="glass-strong rounded-3xl p-8 shadow-2xl neon-border">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Configure Scenario
              </h2>

              {/* State Selection */}
              <div className="mb-8">
                <label className="block text-xs font-bold mb-3 text-purple-300">
                  Select State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    // Keep suggestions visible when changing state
                  }}
                  className="w-full px-4 py-4 rounded-xl glass-strong border border-accent-500/30 focus:outline-none focus:ring-2 focus:ring-accent-500 text-white font-medium bg-gray-900/50"
                >
                  {states.map((state) => (
                    <option key={state.state} value={state.state} className="bg-gray-900">
                      {state.state} - Rank #{state.rank} ({state.final_score.toFixed(1)} pts)
                    </option>
                  ))}
                </select>
                {currentState && (
                  <div className="mt-3 p-3 rounded-lg glass text-sm">
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div>Current Solar: <span className="text-yellow-400 font-bold">{currentState.solar_mw.toLocaleString()} MW</span></div>
                      <div>Current Wind: <span className="text-cyan-400 font-bold">{currentState.wind_mw.toLocaleString()} MW</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                <SliderInput
                  label="Solar Capacity Addition"
                  icon={<Sun className="w-5 h-5" />}
                  value={solarIncrease}
                  onChange={setSolarIncrease}
                  color="yellow"
                />
                <SliderInput
                  label="Wind Capacity Addition"
                  icon={<Wind className="w-5 h-5" />}
                  value={windIncrease}
                  onChange={setWindIncrease}
                  color="cyan"
                />
                <SliderInput
                  label="Hydro Capacity Addition"
                  icon={<Droplet className="w-5 h-5" />}
                  value={hydroIncrease}
                  onChange={setHydroIncrease}
                  color="blue"
                />
                <SliderInput
                  label="Bio Capacity Addition"
                  icon={<Zap className="w-5 h-5" />}
                  value={bioIncrease}
                  onChange={setBioIncrease}
                  color="green"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSimulate}
                  disabled={loading || !selectedState}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Simulating...
                    </span>
                  ) : (
                    'Run Simulation'
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetInputs}
                  className="px-6 py-4 rounded-xl glass-strong hover:bg-gray-800/50 text-white font-bold transition-all"
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={suggestions.length > 0 ? 'xl:col-span-1' : 'xl:col-span-1'}
          >
            <div className="glass-strong rounded-3xl p-8 shadow-2xl neon-border h-full">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Results
              </h2>

              {!result ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                    <TrendingUp className="w-10 h-10 opacity-50" />
                  </div>
                  <p className="text-center text-lg">
                    Configure and run simulation<br />to see projected results
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl glass">
                      <p className="text-xs text-gray-400 mb-2">Current Score</p>
                      <p className="text-3xl font-bold text-white">
                        {result.base_score.toFixed(1)}
                      </p>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 animate-glow">
                      <p className="text-xs text-white/80 mb-2">New Score</p>
                      <p className="text-3xl font-bold text-white">
                        {result.new_score.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  {/* Score Change */}
                  <div className="p-5 rounded-xl glass-strong">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium text-sm">Score Change</span>
                      <span className={`text-2xl font-bold ${
                        result.delta_score >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.delta_score >= 0 ? '+' : ''}{result.delta_score.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Rank Change */}
                  <div className="p-5 rounded-xl glass-strong">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium text-sm">Rank Movement</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          #{result.base_rank} → #{result.new_rank}
                        </div>
                        {result.delta_rank !== 0 && (
                          <span className={`text-xs font-bold ${
                            result.delta_rank < 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            ({result.delta_rank > 0 ? '+' : ''}{result.delta_rank} positions)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Capacity Summary */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-white text-base">Capacity Additions</h3>
                    <div className="space-y-2">
                      {solarIncrease > 0 && <CapacityRow label="Solar" value={solarIncrease} color="yellow" />}
                      {windIncrease > 0 && <CapacityRow label="Wind" value={windIncrease} color="cyan" />}
                      {hydroIncrease > 0 && <CapacityRow label="Hydro" value={hydroIncrease} color="blue" />}
                      {bioIncrease > 0 && <CapacityRow label="Bio" value={bioIncrease} color="green" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function SliderInput({ label, icon, value, onChange, color }: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  color: 'yellow' | 'cyan' | 'blue' | 'green';
}) {
  const colorClasses: Record<string, string> = {
    yellow: 'text-yellow-400',
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
  };

  return (
    <div className="p-4 rounded-xl glass">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={colorClasses[color]}>
            {icon}
          </div>
          <label className="text-xs font-bold text-white">
            {label}
          </label>
        </div>
        <span className={`text-base font-bold ${colorClasses[color]}`}>
          +{value}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="200"
        step="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0%</span>
        <span>200%</span>
      </div>
    </div>
  );
}

function CapacityRow({ label, value, color }: {
  label: string;
  value: number;
  color: 'yellow' | 'cyan' | 'blue' | 'green';
}) {
  const colorClasses: Record<string, string> = {
    yellow: 'from-yellow-500 to-orange-500',
    cyan: 'from-cyan-500 to-blue-500',
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg glass">
      <span className="text-gray-300 font-medium text-sm">{label}</span>
      <span className={`font-bold text-base bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
        +{value}%
      </span>
    </div>
  );
}
