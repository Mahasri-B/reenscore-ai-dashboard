'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { getAllStates } from '@/lib/api';
import type { StateScore } from '@/lib/api';
import Link from 'next/link';

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
      case 'rank':
        return a.rank - b.rank;
      case 'score':
        return b.final_score - a.final_score;
      case 'solar':
        return b.solar_mw - a.solar_mw;
      case 'wind':
        return b.wind_mw - a.wind_mw;
      default:
        return a.rank - b.rank;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black mb-3">
            <span className="gradient-text">State Rankings</span>
          </h1>
          <p className="text-base text-gray-300">
            Comprehensive ranking by renewable energy readiness
          </p>
        </motion.div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <SortButton
            active={sortBy === 'rank'}
            onClick={() => setSortBy('rank')}
            icon={<Trophy className="w-4 h-4" />}
            label="By Rank"
          />
          <SortButton
            active={sortBy === 'score'}
            onClick={() => setSortBy('score')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="By Score"
          />
          <SortButton
            active={sortBy === 'solar'}
            onClick={() => setSortBy('solar')}
            icon={<Zap className="w-4 h-4" />}
            label="By Solar"
          />
          <SortButton
            active={sortBy === 'wind'}
            onClick={() => setSortBy('wind')}
            icon={<Zap className="w-4 h-4" />}
            label="By Wind"
          />
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {sortedStates.slice(0, 3).map((state, index) => (
            <PodiumCard key={state.state} state={state} position={index} />
          ))}
        </div>

        {/* Complete Rankings Table */}
        <div className="glass-strong rounded-3xl p-8 neon-border-blue">
          <h2 className="text-2xl font-black mb-8 text-white">
            Complete Rankings
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-bold text-gray-300">Rank</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-300">State</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-300">Score</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-300">Solar (MW)</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-300">Wind (MW)</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-300">Total (MW)</th>
                </tr>
              </thead>
              <tbody>
                {sortedStates.map((state, index) => (
                  <motion.tr
                    key={state.state}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-white font-bold">
                        {state.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-white text-base">
                        {state.state}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-xl gradient-text">
                        {state.final_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300 font-medium">
                      {state.solar_mw.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300 font-medium">
                      {state.wind_mw.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300 font-medium">
                      {state.total_mw.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function SortButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        active
          ? 'neon-button text-white'
          : 'glass-strong hover:neon-border-purple text-gray-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PodiumCard({ state, position }: { state: StateScore; position: number }) {
  const orders = ['md:order-2', 'md:order-1', 'md:order-3'];
  const colors = [
    'from-yellow-400 to-yellow-600',
    'from-gray-300 to-gray-500',
    'from-orange-400 to-orange-600'
  ];
  const borderColors = [
    'neon-border-pink',
    'neon-border-purple',
    'neon-border-blue'
  ];

  return (
    <div className={orders[position]}>
      <div className={`glass-strong rounded-2xl p-6 ${borderColors[position]} card-hover h-full flex flex-col`}>
        {/* Rank Badge */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[position]} flex items-center justify-center shadow-2xl`}>
            <span className="text-2xl font-black text-white">#{state.rank}</span>
          </div>
        </div>
        
        {/* State Name */}
        <h3 className="text-xl font-black text-white text-center mb-3">
          {state.state}
        </h3>
        
        {/* Score */}
        <div className="text-4xl font-black gradient-text text-center mb-6">
          {state.final_score.toFixed(1)}
        </div>
        
        {/* Stats */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5">
            <span className="text-sm text-gray-400">Solar</span>
            <span className="text-sm font-bold text-white">{state.solar_mw.toLocaleString()} MW</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5">
            <span className="text-sm text-gray-400">Wind</span>
            <span className="text-sm font-bold text-white">{state.wind_mw.toLocaleString()} MW</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5">
            <span className="text-sm text-gray-400">Total</span>
            <span className="text-sm font-bold text-white">{state.total_mw.toLocaleString()} MW</span>
          </div>
        </div>
      </div>
    </div>
  );
}
