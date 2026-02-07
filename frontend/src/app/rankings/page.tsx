'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap, Medal, Crown, Award, Sun, Wind } from 'lucide-react';
import { getAllStates } from '@/lib/api';
import type { StateScore } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function RankingsPage() {
  const [states, setStates] = useState<StateScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'solar' | 'wind'>('rank');

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const data = await getAllStates();
      setStates(data);
    } catch (error) {
      console.error('Error loading states:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedStates = [...states].sort((a, b) => {
    switch (sortBy) {
      case 'rank': return a.rank - b.rank;
      case 'score': return b.final_score - a.final_score;
      case 'solar': return b.solar_mw - a.solar_mw;
      case 'wind': return b.wind_mw - a.wind_mw;
      default: return a.rank - b.rank;
    }
  });

  const maxScore = states.length > 0 ? Math.max(...states.map(s => s.final_score)) : 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400 text-sm animate-pulse">Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] animate-aurora-pulse" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] animate-aurora-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
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
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-300 font-medium">Renewable Energy Leaderboard</span>
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            <span className="gradient-text">State Rankings</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Comprehensive ranking by renewable energy readiness and capacity
          </p>
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          <SortButton active={sortBy === 'rank'} onClick={() => setSortBy('rank')} icon={<Trophy className="w-4 h-4" />} label="By Rank" />
          <SortButton active={sortBy === 'score'} onClick={() => setSortBy('score')} icon={<TrendingUp className="w-4 h-4" />} label="By Score" />
          <SortButton active={sortBy === 'solar'} onClick={() => setSortBy('solar')} icon={<Sun className="w-4 h-4" />} label="By Solar" />
          <SortButton active={sortBy === 'wind'} onClick={() => setSortBy('wind')} icon={<Wind className="w-4 h-4" />} label="By Wind" />
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto"
        >
          {sortedStates.slice(0, 3).map((state, index) => (
            <motion.div key={state.state} variants={itemVariants}>
              <PodiumCard state={state} position={index} maxScore={maxScore} />
            </motion.div>
          ))}
        </motion.div>

        {/* Complete Rankings Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-2xl p-6 lg:p-8 aurora-border"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Medal className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-black text-white">Complete Rankings</h2>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Rank</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">State</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Score</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Solar (MW)</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Wind (MW)</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Total (MW)</th>
                </tr>
              </thead>
              <tbody>
                {sortedStates.map((state, index) => (
                  <motion.tr
                    key={state.state}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                    className="border-b border-white/[0.04] row-hover-glow group"
                  >
                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold ${
                        state.rank <= 3
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                          : state.rank <= 10
                          ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/[0.04] text-gray-400'
                      }`}>
                        {state.rank}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                        {state.state}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base gradient-text min-w-[50px]">
                          {state.final_score.toFixed(1)}
                        </span>
                        <div className="flex-1 max-w-[100px] hidden sm:block">
                          <div className="h-1.5 rounded-full bg-gray-800/60 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(state.final_score / maxScore) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-gray-300 font-medium text-sm tabular-nums">{state.solar_mw.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-gray-300 font-medium text-sm tabular-nums">{state.wind_mw.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-white font-bold text-sm tabular-nums">{state.total_mw.toLocaleString()}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function SortButton({ active, onClick, icon, label }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
        active
          ? 'neon-button text-white shadow-lg'
          : 'glass hover:bg-white/[0.06] text-gray-400 hover:text-gray-200'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function PodiumCard({ state, position, maxScore }: { state: StateScore; position: number; maxScore: number }) {
  const orders = ['md:order-2', 'md:order-1', 'md:order-3'];
  const gradients = [
    'from-amber-400 via-yellow-500 to-amber-600',
    'from-slate-300 via-gray-400 to-slate-500',
    'from-orange-400 via-amber-500 to-orange-600'
  ];
  const borderColors = ['neon-border-emerald', 'neon-border-violet', 'neon-border-cyan'];
  const icons = [
    <Crown key="crown" className="w-6 h-6 text-amber-400" />,
    <Award key="award" className="w-6 h-6 text-slate-300" />,
    <Medal key="medal" className="w-6 h-6 text-orange-400" />
  ];
  const scales = ['md:scale-105', 'md:scale-100', 'md:scale-100'];
  const heights = ['md:mt-0', 'md:mt-8', 'md:mt-12'];

  return (
    <div className={`${orders[position]} ${heights[position]}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={`glass-strong rounded-2xl p-6 lg:p-7 ${borderColors[position]} h-full flex flex-col ${scales[position]} transition-transform`}
      >
        {/* Rank Badge + Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + position * 0.15, type: 'spring', stiffness: 200 }}
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[position]} flex items-center justify-center shadow-2xl`}
            >
              <span className="text-2xl font-black text-white">#{state.rank}</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + position * 0.15, type: 'spring' }}
              className="absolute -top-2 -right-2 p-1 rounded-full glass-strong"
            >
              {icons[position]}
            </motion.div>
          </div>
        </div>

        {/* State Name */}
        <h3 className="text-xl font-black text-white text-center mb-2">
          {state.state}
        </h3>

        {/* Score */}
        <div className="text-center mb-2">
          <span className="text-4xl font-black gradient-text">{state.final_score.toFixed(1)}</span>
        </div>

        {/* Score Bar */}
        <div className="h-1.5 rounded-full bg-gray-800/60 overflow-hidden mb-6 mx-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(state.final_score / maxScore) * 100}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500"
          />
        </div>

        {/* Stats */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm text-gray-400">Solar</span>
            </div>
            <span className="text-sm font-bold text-white tabular-nums">{state.solar_mw.toLocaleString()} MW</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm text-gray-400">Wind</span>
            </div>
            <span className="text-sm font-bold text-white tabular-nums">{state.wind_mw.toLocaleString()} MW</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <span className="text-sm font-bold text-white tabular-nums">{state.total_mw.toLocaleString()} MW</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
