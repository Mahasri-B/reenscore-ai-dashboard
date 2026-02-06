'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { getClusterInfo, getPCAData } from '@/lib/api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';

export default function MLInsightsPage() {
  const [clusterData, setClusterData] = useState<any>(null);
  const [pcaData, setPcaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="w-16 h-16 border-4 border-energy-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clusterColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-energy-50 via-white to-energy-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Machine Learning</span>
            <br />
            <span className="text-white">Insights & Analysis</span>
          </h1>
          
          <p className="text-base text-gray-300 max-w-3xl mx-auto">
            Discover patterns and insights using K-Means, GMM, and Isolation Forest algorithms
          </p>
        </motion.div>

        {/* ML Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">K-Means Clustering</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Hard clustering that groups states into 4 distinct performance tiers
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Silhouette Score:</span>
                <span className="font-bold">{clusterData?.metrics.kmeans.silhouette}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Davies-Bouldin:</span>
                <span className="font-bold">{clusterData?.metrics.kmeans.davies_bouldin}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Gaussian Mixture Model</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Probabilistic clustering with confidence scores for each assignment
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">BIC Score:</span>
                <span className="font-bold">{clusterData?.metrics.gmm.bic}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">AIC Score:</span>
                <span className="font-bold">{clusterData?.metrics.gmm.aic}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Isolation Forest</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Detects states with unique renewable energy profiles
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Outliers Detected:</span>
                <span className="font-bold">{clusterData?.outliers.length || 0}</span>
              </div>
              {clusterData?.outliers.length > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {clusterData.outliers.join(', ')}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Model Performance */}
        {clusterData?.interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6 mb-12"
          >
            <h2 className="text-xl font-bold mb-4">Model Performance Assessment</h2>
            <div className="space-y-2">
              {clusterData.interpretation.map((interp: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    interp.includes('✓') 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-500/20' 
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500/20'
                  }`}
                >
                  <span className="text-2xl">{interp.includes('✓') ? '✓' : '⚠'}</span>
                  <span className="text-gray-700 dark:text-gray-300">{interp.replace('✓', '').replace('⚠', '').trim()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PCA Visualization */}
        {pcaData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6 mb-12"
          >
            <h2 className="text-xl font-bold mb-6">PCA State Distribution</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Principal Component Analysis reduces the 4-dimensional renewable energy profile to 2D visualization.
              <br />
              <strong>Explained Variance:</strong> PC1 = {(pcaData.explained_variance[0] * 100).toFixed(1)}%, 
              PC2 = {(pcaData.explained_variance[1] * 100).toFixed(1)}%
            </p>
            
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  type="number" 
                  dataKey="pc1" 
                  name="PC1" 
                  label={{ value: `PC1 (${(pcaData.explained_variance[0] * 100).toFixed(1)}% variance)`, position: 'bottom' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="pc2" 
                  name="PC2"
                  label={{ value: `PC2 (${(pcaData.explained_variance[1] * 100).toFixed(1)}% variance)`, angle: -90, position: 'left' }}
                />
                <ZAxis type="number" dataKey="score" range={[50, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass rounded-lg p-4 shadow-xl">
                          <p className="font-bold text-energy-600 mb-2">{data.state}</p>
                          <p className="text-sm">Score: {data.score.toFixed(1)}</p>
                          <p className="text-sm">Cluster: {data.cluster_name}</p>
                          <p className="text-sm">PC1: {data.pc1.toFixed(2)}</p>
                          <p className="text-sm">PC2: {data.pc2.toFixed(2)}</p>
                          {data.is_outlier && (
                            <p className="text-sm text-orange-600 font-bold mt-1">⚠ Outlier</p>
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
                      opacity={entry.is_outlier ? 0.8 : 0.6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              {clusterData?.clusters.map((cluster: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: clusterColors[index % clusterColors.length] }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {cluster.cluster_name} ({cluster.num_states} states)
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Outliers</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cluster Details */}
        {clusterData?.clusters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {clusterData.clusters.map((cluster: any, index: number) => (
              <div key={index} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: clusterColors[index % clusterColors.length] }}
                  />
                  <h3 className="text-lg font-bold">{cluster.cluster_name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">States</p>
                    <p className="text-xl font-bold">{cluster.num_states}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Score</p>
                    <p className="text-xl font-bold text-energy-600">{cluster.avg_score.toFixed(1)}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Solar:</span>
                    <span className="font-semibold">{cluster.avg_solar.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Wind:</span>
                    <span className="font-semibold">{cluster.avg_wind.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hydro:</span>
                    <span className="font-semibold">{cluster.avg_hydro.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Bio:</span>
                    <span className="font-semibold">{cluster.avg_bio.toFixed(1)}</span>
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer text-energy-600 hover:text-energy-700 font-medium">
                    View States ({cluster.states.length})
                  </summary>
                  <div className="mt-2 text-gray-600 dark:text-gray-400">
                    {cluster.states.join(', ')}
                  </div>
                </details>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
