'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Wind, Sun, Droplet, Lightbulb, Target, ArrowRight, Brain, RotateCcw, Play, ChevronUp, ChevronDown } from 'lucide-react';
import { runScenario, getAllStates, getStateDetails } from '@/lib/api';
import type { StateScore } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function SimulatorPage() {
  const [states, setStates] = useState<StateScore[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateDetails, setStateDetails] = useState<any>(null);
  const [solarIncrease, setSolarIncrease] = useState(0);
  const [windIncrease, setWindIncrease] = useState(0);
  const [hydroIncrease, setHydroIncrease] = useState(0);
  const [bioIncrease, setBioIncrease] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

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
    const newSuggestions = [];

    for (const rec of recs) {
      const resourceMap: Record<string, any> = {
        'Solar': {
          type: 'solar',
          values: { solar: rec.suggested_increase_pct || 50, wind: 0, hydro: 0, bio: 0 },
          icon: <Sun className="w-5 h-5" />,
          color: 'from-amber-500 to-orange-500',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/20',
          textColor: 'text-amber-400',
        },
        'Wind': {
          type: 'wind',
          values: { solar: 0, wind: rec.suggested_increase_pct || 50, hydro: 0, bio: 0 },
          icon: <Wind className="w-5 h-5" />,
          color: 'from-cyan-500 to-blue-500',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20',
          textColor: 'text-cyan-400',
        },
        'Small Hydro': {
          type: 'hydro',
          values: { solar: 0, wind: 0, hydro: rec.suggested_increase_pct || 50, bio: 0 },
          icon: <Droplet className="w-5 h-5" />,
          color: 'from-blue-500 to-indigo-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          textColor: 'text-blue-400',
        },
        'Bio Power': {
          type: 'bio',
          values: { solar: 0, wind: 0, hydro: 0, bio: rec.suggested_increase_pct || 50 },
          icon: <Zap className="w-5 h-5" />,
          color: 'from-emerald-500 to-green-500',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          textColor: 'text-emerald-400',
        }
      };

      const resourceConfig = resourceMap[rec.resource];
      if (resourceConfig) {
        newSuggestions.push({
          ...resourceConfig,
          title: rec.action || `${rec.resource} Development`,
          description: rec.reason || `Enhance ${rec.resource.toLowerCase()} capacity`,
          priority: rec.priority || 'MEDIUM',
          percentile: rec.current_level,
          impact: rec.priority === 'HIGH' ? '+5-8 pts' : rec.priority === 'MEDIUM' ? '+3-5 pts' : '+2-3 pts',
        });
      }
    }
    setSuggestions(newSuggestions);
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
  };

  const runSuggestionSimulation = async (suggestion: any) => {
    setSolarIncrease(suggestion.values.solar);
    setWindIncrease(suggestion.values.wind);
    setHydroIncrease(suggestion.values.hydro);
    setBioIncrease(suggestion.values.bio);

    setLoading(true);
    try {
      const solarMW = currentState ? (currentState.solar_mw * suggestion.values.solar / 100) : 0;
      const windMW = currentState ? (currentState.wind_mw * suggestion.values.wind / 100) : 0;
      const hydroMW = currentState ? (currentState.small_hydro_mw * suggestion.values.hydro / 100) : 0;
      const bioMW = currentState ? (currentState.bio_power_mw * suggestion.values.bio / 100) : 0;

      const scenarioResult = await runScenario(selectedState, solarMW, windMW, hydroMW, bioMW);
      setResult(scenarioResult);
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
      const solarMW = currentState.solar_mw * solarIncrease / 100;
      const windMW = currentState.wind_mw * windIncrease / 100;
      const hydroMW = currentState.small_hydro_mw * hydroIncrease / 100;
      const bioMW = currentState.bio_power_mw * bioIncrease / 100;

      const scenarioResult = await runScenario(selectedState, solarMW, windMW, hydroMW, bioMW);
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
  };

  const currentState = states.find(s => s.state === selectedState);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-950 via-emerald-950/10 to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] animate-aurora-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] animate-aurora-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px] animate-aurora-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-300 font-medium">Scenario Modeling Engine</span>
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            <span className="gradient-text">GreenScore AI</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Simulate renewable energy investments and see projected score impacts in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Strategic Analysis Panel */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="xl:col-span-1"
            >
              <div className="glass-strong rounded-2xl p-6 shadow-2xl neon-border h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/20">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Strategic Analysis</h2>
                    <p className="text-xs text-gray-500">Optimized for {selectedState}</p>
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`p-5 rounded-xl glass border ${suggestion.borderColor} hover:bg-white/[0.03] transition-all group`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${suggestion.color} flex-shrink-0 shadow-lg`}>
                          {suggestion.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3 className="font-bold text-white text-sm truncate">
                              {suggestion.title}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              suggestion.priority === 'HIGH' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                              suggestion.priority === 'MEDIUM' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                              'bg-green-500/15 text-green-400 border border-green-500/20'
                            }`}>
                              {suggestion.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-2">{suggestion.description}</p>
                          {suggestion.percentile && (
                            <p className="text-[11px] text-gray-500 mb-1.5">
                              Current: <span className={`${suggestion.textColor} font-semibold`}>{suggestion.percentile}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-gray-500">
                            Impact: <span className="text-emerald-400 font-bold">{suggestion.impact}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => runSuggestionSimulation(suggestion)}
                          disabled={loading}
                          className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3 h-3" />
                          {loading ? 'Running...' : 'Simulate'}
                        </button>
                        <button
                          onClick={() => applySuggestion(suggestion)}
                          className="px-3 py-2 rounded-lg glass text-white text-xs font-medium hover:bg-white/[0.06] transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={suggestions.length > 0 ? 'xl:col-span-1' : 'xl:col-span-2'}
          >
            <div className="glass-strong rounded-2xl p-6 lg:p-8 shadow-2xl neon-border">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Configure Scenario</h2>
                  <p className="text-xs text-gray-500">Adjust capacity increases below</p>
                </div>
              </div>

              {/* State Selection */}
              <div className="mb-8">
                <label className="block text-xs font-bold mb-2 text-emerald-400 uppercase tracking-wider">
                  Select State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl glass-strong border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/40 text-white font-medium bg-gray-900/50 text-sm"
                >
                  {states.map((state) => (
                    <option key={state.state} value={state.state} className="bg-gray-900">
                      {state.state} - Rank #{state.rank} ({state.final_score.toFixed(1)} pts)
                    </option>
                  ))}
                </select>
                {currentState && (
                  <div className="mt-3 p-4 rounded-xl glass">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-gray-400">Solar:</span>
                        <span className="text-xs text-amber-400 font-bold">{currentState.solar_mw.toLocaleString()} MW</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-gray-400">Wind:</span>
                        <span className="text-xs text-cyan-400 font-bold">{currentState.wind_mw.toLocaleString()} MW</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                <SliderInput label="Solar Capacity" icon={<Sun className="w-4 h-4" />} value={solarIncrease} onChange={setSolarIncrease} color="amber" />
                <SliderInput label="Wind Capacity" icon={<Wind className="w-4 h-4" />} value={windIncrease} onChange={setWindIncrease} color="cyan" />
                <SliderInput label="Hydro Capacity" icon={<Droplet className="w-4 h-4" />} value={hydroIncrease} onChange={setHydroIncrease} color="blue" />
                <SliderInput label="Bio Capacity" icon={<Zap className="w-4 h-4" />} value={bioIncrease} onChange={setBioIncrease} color="green" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSimulate}
                  disabled={loading || !selectedState}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Run Simulation</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetInputs}
                  className="px-5 py-3.5 rounded-xl glass hover:bg-white/[0.06] text-gray-300 font-bold transition-all text-sm flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="xl:col-span-1"
          >
            <div className="glass-strong rounded-2xl p-6 lg:p-8 shadow-2xl neon-border h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Results</h2>
                  <p className="text-xs text-gray-500">Simulation output</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-gray-500"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center mb-5 border border-white/5">
                      <TrendingUp className="w-9 h-9 opacity-40" />
                    </div>
                    <p className="text-center text-sm leading-relaxed">
                      Configure parameters and run<br />simulation to see projected results
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-5"
                  >
                    {/* Score Comparison */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-5 rounded-xl glass text-center">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Current</p>
                        <p className="text-3xl font-black text-white">
                          {result.base_score.toFixed(1)}
                        </p>
                      </div>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="p-5 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600 text-center relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mb-2 relative z-10">Projected</p>
                        <p className="text-3xl font-black text-white relative z-10">
                          {result.new_score.toFixed(1)}
                        </p>
                      </motion.div>
                    </div>

                    {/* Score Change */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-xl glass-strong"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium text-sm">Score Change</span>
                        <div className="flex items-center gap-1.5">
                          {result.delta_score >= 0 ? (
                            <ChevronUp className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-red-400" />
                          )}
                          <span className={`text-2xl font-black ${
                            result.delta_score >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {result.delta_score >= 0 ? '+' : ''}{result.delta_score.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Rank Change */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 rounded-xl glass-strong"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium text-sm">Rank Movement</span>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-400">#{result.base_rank}</span>
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                            <span className="text-lg font-black text-white">#{result.new_rank}</span>
                          </div>
                          {result.delta_rank !== 0 && (
                            <span className={`text-xs font-bold ${
                              result.delta_rank < 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {result.delta_rank > 0 ? '+' : ''}{result.delta_rank} positions
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Capacity Summary */}
                    {(solarIncrease > 0 || windIncrease > 0 || hydroIncrease > 0 || bioIncrease > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="gradient-divider mb-4" />
                        <h3 className="font-bold text-white text-sm mb-3">Capacity Additions</h3>
                        <div className="space-y-2">
                          {solarIncrease > 0 && <CapacityRow label="Solar" value={solarIncrease} color="amber" icon={<Sun className="w-3.5 h-3.5" />} />}
                          {windIncrease > 0 && <CapacityRow label="Wind" value={windIncrease} color="cyan" icon={<Wind className="w-3.5 h-3.5" />} />}
                          {hydroIncrease > 0 && <CapacityRow label="Hydro" value={hydroIncrease} color="blue" icon={<Droplet className="w-3.5 h-3.5" />} />}
                          {bioIncrease > 0 && <CapacityRow label="Bio" value={bioIncrease} color="green" icon={<Zap className="w-3.5 h-3.5" />} />}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
  color: 'amber' | 'cyan' | 'blue' | 'green';
}) {
  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/15' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15' },
    green: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
  };

  const c = colorMap[color];

  return (
    <div className={`p-4 rounded-xl glass border ${c.border} hover:bg-white/[0.02] transition-colors`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`${c.text}`}>{icon}</div>
          <label className="text-sm font-semibold text-white">{label}</label>
        </div>
        <div className={`px-2.5 py-1 rounded-lg ${c.bg} ${c.text} text-sm font-bold tabular-nums min-w-[60px] text-center`}>
          +{value}%
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="200"
        step="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-gray-600 mt-1.5 px-0.5">
        <span>0%</span>
        <span>100%</span>
        <span>200%</span>
      </div>
    </div>
  );
}

function CapacityRow({ label, value, color, icon }: {
  label: string;
  value: number;
  color: 'amber' | 'cyan' | 'blue' | 'green';
  icon: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    amber: 'from-amber-500 to-orange-500',
    cyan: 'from-cyan-500 to-blue-500',
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-emerald-500 to-green-500',
  };
  const textColorMap: Record<string, string> = {
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    green: 'text-emerald-400',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg glass">
      <div className="flex items-center gap-2">
        <span className={textColorMap[color]}>{icon}</span>
        <span className="text-gray-300 font-medium text-sm">{label}</span>
      </div>
      <span className={`font-bold text-sm bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent`}>
        +{value}%
      </span>
    </div>
  );
}
