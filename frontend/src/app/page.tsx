'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Brain, Sliders, Trophy, ArrowRight, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getSummaryStats } from '@/lib/api';

function AnimatedCounter({ end, duration = 2000, suffix = '', decimals = 0 }: {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [animate]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

function FeatureCard({ icon, title, description, href, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  delay: number;
}) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={href}>
        <div className="glass rounded-2xl p-7 card-hover shine-sweep aurora-particles group cursor-pointer h-full">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">{description}</p>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
            Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getSummaryStats()
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Aurora Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-aurora-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-aurora-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[120px] animate-aurora-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-300 font-medium">AI-Powered Energy Analytics</span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="aurora-text">GreenScore</span>
            <br />
            <span className="text-white">AI</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Comprehensive renewable energy readiness assessment for Indian States & Union Territories
            with machine learning insights and scenario modeling
          </motion.p>

          {/* Animated Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-14 max-w-3xl mx-auto"
            >
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 text-center card-hover">
                <p className="text-3xl md:text-4xl font-black text-emerald-400 mb-1">
                  <AnimatedCounter end={stats.total_states} />
                </p>
                <p className="text-xs text-gray-500 font-medium">States Analyzed</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 text-center card-hover">
                <p className="text-3xl md:text-4xl font-black text-cyan-400 mb-1">
                  <AnimatedCounter end={stats.avg_score} decimals={1} />
                </p>
                <p className="text-xs text-gray-500 font-medium">Avg Score</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 text-center card-hover">
                <p className="text-3xl md:text-4xl font-black text-violet-400 mb-1">
                  <AnimatedCounter end={stats.total_capacity.solar / 1000} decimals={1} suffix=" GW" />
                </p>
                <p className="text-xs text-gray-500 font-medium">Solar Capacity</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 text-center card-hover">
                <p className="text-3xl md:text-4xl font-black text-emerald-300 mb-1">
                  <AnimatedCounter end={stats.total_capacity.total / 1000} decimals={1} suffix=" GW" />
                </p>
                <p className="text-xs text-gray-500 font-medium">Total Capacity</p>
              </motion.div>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link href="/dashboard">
              <button className="aurora-glow-button text-white text-base sm:text-lg px-10 py-4 rounded-xl inline-flex items-center gap-3 group">
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Explore the Platform</h2>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
              Powerful tools for analyzing India&apos;s renewable energy landscape
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <FeatureCard
              icon={<MapIcon className="w-7 h-7" />}
              title="Interactive Map"
              description="Explore state-wise renewable energy readiness with an interactive choropleth map of India."
              href="/dashboard"
              delay={0.1}
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7" />}
              title="ML Insights"
              description="K-Means clustering, Gaussian Mixture Models, and Isolation Forest anomaly detection."
              href="/ml-insights"
              delay={0.2}
            />
            <FeatureCard
              icon={<Sliders className="w-7 h-7" />}
              title="Simulator"
              description="Model renewable energy scenarios and see projected score changes in real-time."
              href="/simulator"
              delay={0.3}
            />
            <FeatureCard
              icon={<Trophy className="w-7 h-7" />}
              title="Rankings"
              description="Complete state rankings by GreenScore, solar capacity, wind capacity, and more."
              href="/rankings"
              delay={0.4}
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
