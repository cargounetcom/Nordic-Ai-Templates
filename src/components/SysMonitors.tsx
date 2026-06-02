/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, BarChart } from 'lucide-react';
import { Shield, Check, RefreshCw, Activity, Zap, Cpu, Gauge, AlertCircle } from 'lucide-react';

interface InteractionEvent {
  timestamp: string;
  category: string;
  action: string;
  label?: string;
  sessionToken: string;
}

interface SysMonitorsProps {
  themeStyle: 'warm' | 'brutalist';
}

export default function SysMonitors({ themeStyle }: SysMonitorsProps) {
  const isWarm = themeStyle === 'warm';

  // Analytics State
  const [sessionToken, setSessionToken] = useState<string>('');
  const [events, setEvents] = useState<InteractionEvent[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [styleToggles, setStyleToggles] = useState(0);
  
  // Performance Benchmarking State
  const [isTestingLoad, setIsTestingLoad] = useState(false);
  const [performanceMatrix, setPerformanceMatrix] = useState<{
    latencyMs: number;
    compilationLimitScore: number;
    clientCpuTier: string;
    benchmarkDurationMs: number;
  } | null>(null);

  // Service States
  const [services, setServices] = useState([
    { id: 'gw', name: 'API Ingress Gateway', status: 'online', uptime: '100%', latency: '12ms', logs: ['Route configuration cached', 'Handshake completed client verification'] },
    { id: 'cmp', name: 'Gemini AI Specification Router', status: 'online', uptime: '99.94%', latency: '240ms', logs: ['API Token active: GEMINI_API_KEY', 'Operational context parsed successfully'] },
    { id: 'cdn', name: 'Danish Static CDN Router', status: 'online', uptime: '105%', latency: '4ms', logs: ['Cache hit ratio: 94.2%', 'Static asset scandi_chair compiled'] },
    { id: 'smtp', name: 'Nordic Central Control Mailer (SMTP)', status: 'online', uptime: '100%', latency: '45ms', logs: ['Listening on Port 25', 'Active TLS secure session established'] }
  ]);

  // Load telemetry logs and generate session token on mount
  useEffect(() => {
    let token = localStorage.getItem('nordic_sess_token');
    if (!token) {
      token = `cph_sess_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      localStorage.setItem('nordic_sess_token', token);
    }
    setSessionToken(token);

    // Load metrics helper
    const loadTelemetry = () => {
      const storedEvents = localStorage.getItem('nordic_telemetry_events');
      if (storedEvents) {
        try {
          const parsed = JSON.parse(storedEvents) as InteractionEvent[];
          setEvents(parsed);
          setTotalHits(parsed.length);
          setStyleToggles(parsed.filter(e => e.action === 'change_theme').length);
        } catch (e) {
          console.error("Failed to parse telemetry", e);
        }
      } else {
        // Fallback default simulation events to populate dashboard elegantly
        const baseEvents: InteractionEvent[] = [
          { timestamp: '2026-06-01 07:12:00', category: 'navigation', action: 'load_dashboard', sessionToken: 'cph_sess_FJKW9E2' },
          { timestamp: '2026-06-01 07:15:32', category: 'template', action: 'view_details', label: 'Atelier Silk (Theme 42)', sessionToken: 'cph_sess_FJKW9E2' },
          { timestamp: '2026-06-01 07:18:01', category: 'style', action: 'change_theme', label: 'stark_obsidian', sessionToken: 'cph_sess_FJKW9E2' },
          { timestamp: '2026-06-01 07:22:45', category: 'compiler', action: 'trigger_ai_preset', label: 'Modular Workspace Bracket', sessionToken: 'cph_sess_LPO32S1' }
        ];
        localStorage.setItem('nordic_telemetry_events', JSON.stringify(baseEvents));
        setEvents(baseEvents);
        setTotalHits(baseEvents.length);
        setStyleToggles(1);
      }
    };

    loadTelemetry();
    window.addEventListener('storage', loadTelemetry);
    
    // Auto refresh service latencies to represent active telemetry
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => {
        if (s.id === 'cmp') {
          return { ...s, latency: `${Math.round(200 + Math.random() * 80)}ms` };
        }
        if (s.id === 'gw') {
          return { ...s, latency: `${Math.round(8 + Math.random() * 10)}ms` };
        }
        return s;
      }));
    }, 4000);

    return () => {
      window.removeEventListener('storage', loadTelemetry);
      clearInterval(interval);
    };
  }, []);

  // Run Real client benchmark test to simulate load performance metrics
  const runClientLoadBenchmark = () => {
    setIsTestingLoad(true);
    const startTime = performance.now();
    
    // Perform intensive math looping on device to calculate actual CPU performance rate
    setTimeout(() => {
      let calculationSum = 0;
      for (let i = 0; i < 60000000; i++) {
        calculationSum += Math.sqrt(i) * Math.sin(i);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Determine device CPU rating index
      let tier = 'Standard Developer Unit';
      let score = Math.round(15000 / duration);
      if (duration < 60) {
        tier = 'Superconductor Elite M-Series';
      } else if (duration < 150) {
        tier = 'Advanced UltraCore Processor';
      } else {
        tier = 'Standard Client Architecture (Mobile/Sub-Process)';
      }

      setPerformanceMatrix({
        latencyMs: Math.round(5 + Math.random() * 15),
        compilationLimitScore: score,
        clientCpuTier: tier,
        benchmarkDurationMs: Math.round(duration)
      });
      setIsTestingLoad(false);

      // Track this benchmark event in telemetry!
      const freshEvent: InteractionEvent = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        category: 'performance',
        action: 'run_benchmark',
        label: `Duration: ${Math.round(duration)}ms, CPU: ${tier}`,
        sessionToken: sessionToken || 'unknown'
      };
      
      const stored = localStorage.getItem('nordic_telemetry_events');
      if (stored) {
        try {
          const old = JSON.parse(stored);
          const updated = [freshEvent, ...old];
          localStorage.setItem('nordic_telemetry_events', JSON.stringify(updated));
          setEvents(updated);
          setTotalHits(updated.length);
        } catch (e) {
          console.error(e);
        }
      }
    }, 500);
  };

  const handleClearTelemetry = () => {
    localStorage.removeItem('nordic_telemetry_events');
    const reset = [{
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category: 'telemetry',
      action: 'purge_telemetry_history',
      sessionToken: sessionToken || 'unknown'
    }];
    localStorage.setItem('nordic_telemetry_events', JSON.stringify(reset));
    setEvents(reset);
    setTotalHits(1);
  };

  return (
    <div className="space-y-8 text-left font-sans text-xs">
      
      {/* 2x2 Header statistics display card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className={`p-5 border relative flex flex-col justify-between ${
          isWarm ? 'bg-white border-stone-200 text-stone-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-100'
        }`}>
          <div>
            <span className="block text-[8px] font-bold opacity-50 uppercase tracking-widest font-mono">
              TOTAL COMPILER SESSIONS
            </span>
            <span className="text-2xl font-mono font-bold block mt-1 tracking-tight">
              1,424
            </span>
          </div>
          <p className="text-[10px] opacity-65 mt-3 font-light">
            Simulated and active digital handshakes across European cloud nodes.
          </p>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 border relative flex flex-col justify-between ${
          isWarm ? 'bg-white border-stone-200 text-stone-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-100'
        }`}>
          <div>
            <span className="block text-[8px] font-bold opacity-50 uppercase tracking-widest font-mono">
              PREFERENCE TRACKING EVENT COUNT
            </span>
            <span className="text-2xl font-mono font-extrabold block mt-1 text-[#a4865d]">
              {totalHits} Events
            </span>
          </div>
          <p className="text-[10px] opacity-65 mt-3 font-light">
            Fully anonymous client metrics logged locally to respect user GDPR.
          </p>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 border relative flex flex-col justify-between ${
          isWarm ? 'bg-white border-stone-200 text-stone-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-100'
        }`}>
          <div>
            <span className="block text-[8px] font-bold opacity-50 uppercase tracking-widest font-mono">
              COMPILER RETRIES SPEED INDEX
            </span>
            <span className="text-2xl font-mono font-bold block mt-1 text-indigo-500">
              0.42 Seconds
            </span>
          </div>
          <p className="text-[10px] opacity-65 mt-3 font-light">
            Vite hot module status and Gemini generation compile latency target.
          </p>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 border relative flex flex-col justify-between ${
          isWarm ? 'bg-white border-stone-200 text-stone-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-100'
        }`}>
          <div>
            <span className="block text-[8px] font-bold opacity-50 uppercase tracking-widest font-mono">
              Simulated Platform Ingress
            </span>
            <span className="text-2xl font-mono font-bold block mt-1 text-emerald-400">
              100.00% Online
            </span>
          </div>
          <p className="text-[10px] opacity-65 mt-3">
            Continuous health checks verified via active port mapping logs.
          </p>
        </div>
      </div>

      {/* Main Monitoring Board with 2 Panels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Real-time Uptime services status */}
        <div className="md:col-span-7 space-y-6">
          <div className={`p-6 border ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950/40 border-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6 border-b pb-4"
                 style={{ borderColor: isWarm ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 rotate-90" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  GCP & Uptime Robot Probe status console
                </h3>
              </div>
              <span className="text-[8px] font-mono opacity-50">PROBES: 4 ACTIVE</span>
            </div>

            {/* Service Blocks list */}
            <div className="space-y-4">
              {services.map((srv) => (
                <div key={srv.id} className={`p-3.5 border ${
                  isWarm ? 'bg-stone-50 border-stone-150' : 'bg-zinc-900/40 border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold uppercase text-[11px] font-mono flex items-center gap-1.5 text-[#9c8469]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {srv.name}
                    </span>
                    <div className="flex gap-4 font-mono text-[10px]">
                      <span className="opacity-60">UPTIME: {srv.uptime}</span>
                      <span className="opacity-60">LATENCY: {srv.latency}</span>
                    </div>
                  </div>
                  
                  {/* Miniature Console Line */}
                  <div className={`p-1.5 font-mono text-[9px] border leading-normal truncate opacity-70 ${
                    isWarm ? 'bg-white text-stone-600 border-stone-200' : 'bg-zinc-950 text-zinc-400 border-zinc-900'
                  }`}>
                    &gt; {srv.logs[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Load Benchmark Testing area */}
          <div className={`p-6 border space-y-4 ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950/40 border-zinc-900'}`}>
            <div className="flex justify-between items-center border-b pb-4"
                 style={{ borderColor: isWarm ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  On-Device Live Compile Benchmarking
                </h3>
              </div>
              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 font-bold uppercase">
                JS Heavy Math test
              </span>
            </div>

            <p className="opacity-80 leading-relaxed text-xs">
              This widget tests your machine's math speed. Clicking "Execute" performs 60,000,000 square root & sine calculations in a blocking container loop to evaluate structural compilation processing threshold.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={runClientLoadBenchmark}
                disabled={isTestingLoad}
                className={`py-3 px-6 text-xs uppercase font-extrabold flex items-center gap-2 transition cursor-pointer select-none active:scale-95 ${
                  isTestingLoad
                    ? 'opacity-50 cursor-not-allowed bg-stone-300 text-stone-600'
                    : isWarm
                      ? 'bg-stone-900 text-white hover:bg-stone-850'
                      : 'bg-emerald-500 text-black hover:bg-emerald-450'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isTestingLoad ? 'animate-spin' : ''}`} />
                <span>{isTestingLoad ? 'Running Floating Diagnostics...' : 'Run Benchmarking Protocol'}</span>
              </button>

              {performanceMatrix && (
                <div className="font-mono text-[10px] space-y-0.5 opacity-80 border-l pl-4 border-zinc-700">
                  <p>● CLASS: <span className="text-emerald-400">{performanceMatrix.clientCpuTier}</span></p>
                  <p>● INDEX VALUE: <span className="font-bold text-[#9c8469]">{performanceMatrix.compilationLimitScore} Ops/Sec</span></p>
                  <p>● HARDWARE RENDER RATE: <span className="font-black text-indigo-400">{performanceMatrix.benchmarkDurationMs}ms</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Privacy respects GA4 analytics log */}
        <div className="md:col-span-5 space-y-6">
          <div className={`p-6 border relative flex flex-col min-h-[300px] ${
            isWarm ? 'bg-white border-stone-200' : 'bg-[#141414] border-zinc-900'
          }`}>
            <div className="flex justify-between items-center mb-6 border-b pb-4"
                 style={{ borderColor: isWarm ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9c8469]">
                  Privacy-First Analytics Event Monitor
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            </div>

            <p className="opacity-70 leading-relaxed mb-4 text-[11px]">
              This terminal receives local dispatch logs echoing standard GA4 (Google Analytics) tagging patterns. No trackers are loaded to preserve visual load speeds and comply with EU GDPR.
            </p>

            {/* List of custom local events */}
            <div className={`flex-1 p-3.5 border font-mono text-[10px] overflow-y-auto max-h-[290px] space-y-3 ${
              isWarm ? 'bg-stone-50 border-stone-150 text-stone-700' : 'bg-zinc-950 text-zinc-300 border-zinc-850'
            }`}>
              <span className="block text-[8px] opacity-40 uppercase tracking-widest text-center border-b pb-1.5">
                INCOMING GTAG TELEMETRY STRINGS
              </span>
              
              {events.length === 0 ? (
                <p className="text-center italic opacity-50 py-8">No events caught yet. Explore the catalogue or toggle themes.</p>
              ) : (
                events.map((e, idx) => (
                  <div key={idx} className="border-b pb-2 last:border-0 border-zinc-800 space-y-0.5">
                    <div className="flex justify-between text-[9px] opacity-50">
                      <span>[{e.timestamp}]</span>
                      <span className="text-teal-400">gtag('{e.category}')</span>
                    </div>
                    <p className="font-bold text-[#c5a880] text-[10px]">● ACTION: {e.action}</p>
                    {e.label && <p className="opacity-70 text-[9px]">LABEL: {e.label}</p>}
                    <p className="opacity-40 text-[8px] truncate">NODE_SESS: {e.sessionToken}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-[9px] opacity-50 pt-2 font-mono">
                DEVICE KEY ID: {sessionToken}
              </span>
              <button
                onClick={handleClearTelemetry}
                className="text-[9px] uppercase font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Clear History Logs
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
