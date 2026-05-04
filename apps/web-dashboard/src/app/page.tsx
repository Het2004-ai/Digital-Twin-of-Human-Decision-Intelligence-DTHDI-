"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Target, 
  MousePointer2, 
  BrainCircuit, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  Fingerprint
} from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [prediction, setPrediction] = useState({ intent: 'Idle', confidence: 0 });
  const [activeSessions, setActiveSessions] = useState(1);

  // Mock real-time data flow
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: Math.random().toString(36),
        type: ['click', 'move', 'scroll', 'key'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toLocaleTimeString(),
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 5));
      setPrediction({
        intent: ['Purchase', 'Explore', 'Exit', 'Compare'][Math.floor(Math.random() * 4)],
        confidence: Math.floor(Math.random() * 40) + 60
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <BrainCircuit className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">DTHDI Central Command</h1>
              <p className="text-slate-500 text-sm">Real-time Digital Twin Behavioral Synchronization</p>
            </div>
          </div>
          <div className="flex gap-4">
            <StatCard icon={<Activity className="w-4 h-4 text-green-400" />} label="Live Ingestion" value="Active" />
            <StatCard icon={<Fingerprint className="w-4 h-4 text-purple-400" />} label="Active Twins" value={activeSessions.toString()} />
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Visualization Area */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-[450px] relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Behavioral Embedding Space
                </h2>
                <div className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-400">
                  Dimensionality: 512D (Projected to 2D)
                </div>
              </div>
              
              {/* Mock Embedding Space Map */}
              <div className="absolute inset-0 flex items-center justify-center p-12 mt-12">
                <div className="w-full h-full border border-white/5 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 to-transparent flex items-center justify-center">
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
                   />
                   <p className="text-xs text-slate-600 uppercase tracking-widest">Neural Manifold Projection</p>
                </div>
              </div>
            </div>

            {/* Event Feed */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Live Telemetry
                </h3>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {events.map((event) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-xl border border-white/5"
                      >
                        <span className="text-slate-300 font-mono">{event.type.toUpperCase()}</span>
                        <span className="text-slate-500">{event.timestamp}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Privacy Layer
                </h3>
                <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-[10px] text-green-400 font-bold uppercase mb-1">Anonymization Engine</p>
                        <p className="text-xs text-slate-400 text-balance">All PII redacted. Behavioral rhythm capture only.</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Encryption</span>
                        <span className="text-green-500">AES-256</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Intent & Prediction */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-8">
              <div className="text-center space-y-2">
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white">Intent Prediction</h2>
                <p className="text-slate-400 text-sm">AI Digital Twin Synchronization</p>
              </div>

              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-center">
                <motion.div 
                  key={prediction.intent}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                >
                  {prediction.intent.toUpperCase()}
                </motion.div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{prediction.confidence}%</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-2"><MousePointer2 className="w-4 h-4" /> Click Propensity</span>
                    <span className="text-white font-mono">0.84</span>
                </li>
                <li className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Speed (BPM)</span>
                    <span className="text-white font-mono">142</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors">
                    Deploy Simulation
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
      {icon}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
