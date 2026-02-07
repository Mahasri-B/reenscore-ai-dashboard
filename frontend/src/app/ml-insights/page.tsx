'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, TrendingUp, AlertCircle, Sparkles, ChevronDown, BarChart3, Activity } from 'lucide-react';
import { getClusterInfo, getPCAData } from '@/lib/api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function MLInsightsPage() {
  const [clusterData, setClusterData] = useState<any>(null);
  const [pcaData, setPcaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCluster, setActiveCluster] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clusters, pca] = await Promise.all([
        getClusterInfo(),
        getPCAData()
      ]);
      setClusterData(clusters);
      setPcaData(pca);
      setLoading(false);
    } catch (error) {
      console.error('Error loading ML data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400 text-sm animate-pulse">Loading ML models...</p>
        </div>
      </div>
    );
  }

  const clusterColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950/10 to-gray-900 pt-20">
      {/* Subtle background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] animate-aurora-pulse" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[120px] animate-aurora-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-gray-300 font-medium">Unsupervised Learning Models</span>
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            <span className="gradient-text">Machine Learning</span>
            <br />
            <span className="text-white">Insights & Analysis</span>
          </h1>

          <p className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover hidden patterns using K-Means, GMM, and Isolation Forest algorithms
            applied to India&apos;s renewable energy landscape
          </p>
        </motion.div>

        {/* ML Model Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
        >
          {/* K-Means Card */}
          <motion.div variants={itemVariants} className="group">
            <div className="glass rounded-2xl p-7 card-hover shine-sweep h-full">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                  <Target className="w-7 h-7" />
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-xs font-semibold text-cyan-400">Clustering</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">K-Means Clustering</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Hard clustering that groups states into 4 distinct performance tiers based on renewable capacity
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.03]">
                  <span className="text-gray-400">Silhouette Score</span>
                  <span className="font-bold text-cyan-400 text-base">{clusterData?.metrics.kmeans.silhouette}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.03]">
                  <span className="text-gray-400">Davies-Bouldin</span>
                  <span className="font-bold text-cyan-400 text-base">{clusterData?.metrics.kmeans.davies_bouldin}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GMM Card */}
          <motion.div variants={itemVariants} className="group">
            <div className="glass rounded-2xl p-7 card-hover shine-sweep h-full">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs font-semibold text-emerald-400">Probabilistic</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gaussian Mixture Model</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Probabilistic clustering with confidence scores for soft assignment boundaries
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.03]">
                  <span className="text-gray-400">BIC Score</span>
                  <span className="font-bold text-emerald-400 text-base">{clusterData?.metrics.gmm.bic}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.03]">
                  <span className="text-gray-400">AIC Score</span>
                  <span className="font-bold text-emerald-400 text-base">{clusterData?.metrics.gmm.aic}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Isolation Forest Card */}
          <motion.div variants={itemVariants} className="group">
            <div className="glass rounded-2xl p-7 card-hover shine-sweep h-full">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                  <span className="text-xs font-semibold text-violet-400">Anomaly</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Isolation Forest</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Detects states with unique and unusual renewable energy profiles
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/[0.03]">
                  <span className="text-gray-400">Outliers Detected</span>
                  <span className="font-bold text-violet-400 text-base">{clusterData?.outliers.length || 0}</span>
                </div>
                {clusterData?.outliers.length > 0 && (
                  <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <p className="text-xs text-orange-400/80 font-medium mb-1">Outlier States:</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {clusterData.outliers.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Model Performance */}
        {clusterData?.interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-2xl p-6 lg:p-8 mb-14 aurora-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Model Performance Assessment</h2>
            </div>
            <div className="space-y-3">
              {clusterData.interpretation.map((interp: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                    interp.includes('✓')
                      ? 'bg-emerald-500/5 border border-emerald-500/15 hover:bg-emerald-500/10'
                      : 'bg-yellow-500/5 border border-yellow-500/15 hover:bg-yellow-500/10'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                    interp.includes('✓')
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {interp.includes('✓') ? '✓' : '⚠'}
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed pt-1">
                    {interp.replace('✓', '').replace('⚠', '').trim()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PCA Visualization */}
        {pcaData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-2xl p-6 lg:p-8 mb-14 aurora-border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">PCA State Distribution</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Principal Component Analysis</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="px-3 py-1.5 rounded-lg glass text-xs font-medium text-emerald-400">
                  PC1: {(pcaData.explained_variance[0] * 100).toFixed(1)}% variance
                </div>
                <div className="px-3 py-1.5 rounded-lg glass text-xs font-medium text-cyan-400">
                  PC2: {(pcaData.explained_variance[1] * 100).toFixed(1)}% variance
                </div>
              </div>
            </div>

            <p className="text-gray-400 mb-8 text-sm leading-relaxed max-w-3xl">
              Reduces the 4-dimensional renewable energy profile to 2D. Each point represents a state,
              colored by cluster assignment. Outliers are highlighted in amber.
            </p>

            <div className="bg-gray-950/40 rounded-xl p-2 sm:p-4">
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.08} stroke="#334155" />
                  <XAxis
                    type="number"
                    dataKey="pc1"
                    name="PC1"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    label={{ value: `PC1 (${(pcaData.explained_variance[0] * 100).toFixed(1)}%)`, position: 'bottom', offset: 15, style: { fill: '#64748b', fontSize: 13 } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="pc2"
                    name="PC2"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    label={{ value: `PC2 (${(pcaData.explained_variance[1] * 100).toFixed(1)}%)`, angle: -90, position: 'left', offset: 10, style: { fill: '#64748b', fontSize: 13 } }}
                  />
                  <ZAxis type="number" dataKey="score" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#475569' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="glass-strong rounded-xl p-4 shadow-2xl border border-white/10">
                            <p className="font-bold text-emerald-400 mb-2 text-base">{data.state}</p>
                            <div className="space-y-1.5">
                              <div className="flex justify-between gap-6 text-sm">
                                <span className="text-gray-400">Score</span>
                                <span className="text-white font-semibold">{data.score.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between gap-6 text-sm">
                                <span className="text-gray-400">Cluster</span>
                                <span className="text-white font-semibold">{data.cluster_name}</span>
                              </div>
                              <div className="flex justify-between gap-6 text-sm">
                                <span className="text-gray-400">PC1</span>
                                <span className="text-white font-semibold">{data.pc1.toFixed(3)}</span>
                              </div>
                              <div className="flex justify-between gap-6 text-sm">
                                <span className="text-gray-400">PC2</span>
                                <span className="text-white font-semibold">{data.pc2.toFixed(3)}</span>
                              </div>
                            </div>
                            {data.is_outlier && (
                              <div className="mt-2 pt-2 border-t border-orange-500/20">
                                <span className="text-sm text-orange-400 font-bold">Anomaly Detected</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="States" data={pcaData.data}>
                    {pcaData.data.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.is_outlier ? '#f59e0b' : clusterColors[entry.cluster % clusterColors.length]}
                        opacity={entry.is_outlier ? 0.9 : 0.7}
                        stroke={entry.is_outlier ? '#f59e0b' : clusterColors[entry.cluster % clusterColors.length]}
                        strokeWidth={entry.is_outlier ? 2 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-8 pt-6 border-t border-white/5">
              {clusterData?.clusters.map((cluster: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveCluster(activeCluster === index ? null : index)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-lg transition-all ${
                    activeCluster === index
                      ? 'glass-strong neon-border scale-105'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-white/10"
                    style={{ backgroundColor: clusterColors[index % clusterColors.length] }}
                  />
                  <span className="text-sm text-gray-300 font-medium">
                    {cluster.cluster_name}
                    <span className="text-gray-500 ml-1">({cluster.num_states})</span>
                  </span>
                </button>
              ))}
              <div className="flex items-center gap-2.5 px-4 py-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
                <span className="text-sm text-gray-300 font-medium">Outliers</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cluster Details */}
        {clusterData?.clusters && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {clusterData.clusters.map((cluster: any, index: number) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="glass-strong rounded-2xl p-6 lg:p-7 card-hover shine-sweep h-full">
                  {/* Cluster Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: clusterColors[index % clusterColors.length],
                          boxShadow: `0 0 0 4px ${clusterColors[index % clusterColors.length]}33`
                        }}
                      />
                      <h3 className="text-lg font-bold text-white">{cluster.cluster_name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-400">{cluster.avg_score.toFixed(1)}</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Avg Score</p>
                    </div>
                  </div>

                  {/* States Count */}
                  <div className="px-4 py-3 rounded-xl bg-white/[0.03] mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">States in cluster</span>
                      <span className="text-lg font-bold text-white">{cluster.num_states}</span>
                    </div>
                  </div>

                  {/* Capacity Breakdown */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <MetricBar label="Solar" value={cluster.avg_solar} max={100} color="#f59e0b" />
                    <MetricBar label="Wind" value={cluster.avg_wind} max={100} color="#06b6d4" />
                    <MetricBar label="Hydro" value={cluster.avg_hydro} max={100} color="#3b82f6" />
                    <MetricBar label="Bio" value={cluster.avg_bio} max={100} color="#10b981" />
                  </div>

                  {/* Expandable States List */}
                  <details className="group">
                    <summary className="cursor-pointer flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <span className="text-sm text-emerald-400 font-semibold">
                        View States ({cluster.states.length})
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="mt-3 px-1">
                      <div className="flex flex-wrap gap-2">
                        {cluster.states.map((state: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg glass text-xs text-gray-300 font-medium">
                            {state}
                          </span>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="p-3 rounded-lg bg-white/[0.02]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-800/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
