'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { motion, AnimatePresence } from 'framer-motion';

interface IndiaMapProps {
  geojson: any;
  stateData: Map<string, any>;
  selectedState: string | null;
  onStateClick: (stateName: string) => void;
  colorScale?: (value: number) => string;
}

export default function IndiaMap({
  geojson,
  stateData,
  selectedState,
  onStateClick,
  colorScale
}: IndiaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredState, setHoveredState] = useState<{
    name: string;
    score: number;
    rank: number;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !geojson || !containerRef.current) {
      return;
    }

    // Convert TopoJSON to GeoJSON
    let geoData = geojson;
    if (geojson.type === 'Topology') {
      const objectKey = Object.keys(geojson.objects)[0];
      geoData = feature(geojson, geojson.objects[objectKey]);
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = geoMercator().fitSize([width, height], geoData);
    const path = geoPath().projection(projection);

    const g = svg.append('g');

    const purpleScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRgb('#1e1b4b', '#a855f7'));

    // Draw paths
    const paths = g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const stateName = d.properties.name || d.properties.ST_NM || d.properties.state;
        const data = stateData.get(stateName);
        return data ? purpleScale(data.final_score) : '#374151';
      })
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    // Add event handlers
    paths.on('mouseenter', function(event, d: any) {
      const stateName = d.properties.name || d.properties.ST_NM || d.properties.state;
      const data = stateData.get(stateName);
      
      d3.select(this)
        .attr('stroke', '#d946ef')
        .attr('stroke-width', 3);

      if (data) {
        setHoveredState({
          name: stateName,
          score: data.final_score,
          rank: data.rank
        });
      }
    });

    paths.on('mouseleave', function(event, d: any) {
      const stateName = d.properties.name || d.properties.ST_NM || d.properties.state;
      
      if (stateName !== selectedState) {
        d3.select(this)
          .attr('stroke', '#6b7280')
          .attr('stroke-width', 1.5);
      }
      
      setHoveredState(null);
    });

    paths.on('click', (event, d: any) => {
      const stateName = d.properties.name || d.properties.ST_NM || d.properties.state;
      onStateClick(stateName);
    });

  }, [geojson, stateData, selectedState, onStateClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Info Panel */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none">
        <AnimatePresence mode="wait">
          {hoveredState ? (
            <motion.div
              key={hoveredState.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-strong rounded-2xl p-6 shadow-2xl border-2 border-purple-500/50 min-w-[280px]"
            >
              <h3 className="font-black text-3xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {hoveredState.name}
              </h3>
              
              <div className="flex justify-between items-center mb-3 p-3 rounded-xl bg-purple-500/30">
                <span className="text-white text-base font-bold">GreenScore</span>
                <span className="font-black text-3xl text-purple-300">
                  {hoveredState.score.toFixed(1)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl bg-pink-500/30">
                <span className="text-white text-base font-bold">National Rank</span>
                <span className="font-black text-3xl text-pink-300">
                  #{hoveredState.rank}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6 border border-gray-600/30"
            >
              <p className="text-gray-400 text-sm font-medium">
                Hover over a state to see details
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
