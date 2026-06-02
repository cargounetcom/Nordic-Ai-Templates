/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Check, Flame, Cpu, Star, Gauge, Shield, Layout, Palette, Code, Link2, Copy } from 'lucide-react';

interface ThemeLandingPageProps {
  themeId: 42 | 46;
  onBack: () => void;
  onLaunchLive: () => void;
  onTriggerAIPreset: (prompt: string, style: 'warm_scandinavian' | 'brutalist_copenhagen') => void;
}

export default function ThemeLandingPage({ themeId, onBack, onLaunchLive, onTriggerAIPreset }: ThemeLandingPageProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'reviews'>('features');

  const isTheme42 = themeId === 42;

  // Custom metadata based on the chosen design theme
  const details = isTheme42 ? {
    name: 'Atelier Silk (Theme 42)',
    styleTag: 'Warm Scandinavian Serif',
    tagline: 'A physical philosophy translated for modern browsers.',
    description: 'Designed for boutique apothecaries, ceramic studies, and modern furniture houses. Impeccable kerning, warm off-white linen backdrops, and soft serif pairings create a calming, tactile browsing experience.',
    vibe: 'Editorial, Serene, Warm Pastel, Tactile, Grounded',
    colors: ['#FAF8F5 (Base Linen)', '#2C2A27 (Charcoal Text)', '#c5a880 (Muted Ochre)', '#E8E5DF (Stone Mids)'],
    performanceScore: 99,
    seoScore: 100,
    bestSellerItem: 'Frama Apothecary Oil',
    features: [
      'Staggered layout grids mimicking premium print magazines.',
      'Dynamic variable contrast scaling for high accessibility styling.',
      'Fully interactive hover-fade cart drawers and navigation.',
      'Custom SVG vector-based digital signature logos included.',
      'Designed exclusively for premium furniture, design studios, and luxury apothecary brands.'
    ],
    specs: {
      framework: 'Next.js 15 & React 19',
      styling: 'Tailwind CSS Modern Import',
      scripts: 'Typescript strict safety',
      animations: 'Motion smooth layouts',
      lighthouse: { performance: '99%', accessibility: '100%', bestPractices: '100%', seo: '100%' }
    },
    reviews: [
      { author: 'Lars S.', company: 'Kopenhagen Atelier Ltd.', text: 'Absolutely spectacular. The transition kinetics are extremely natural. It increased our design conversion benchmarks within days.', rating: 5 },
      { author: 'Astrid L.', company: 'Stockholm Ceramic Lab', text: 'Beautiful layout alignment, stunning focus on typography and negative space. It feels organic and safe.', rating: 5 }
    ],
    tailwindCodeSnippet: `// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      serif: ['Playfair Display', 'Georgia', 'serif'],
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      linen: '#FAF8F5',
      charcoal: '#2C2A27',
      ochre: '#c5a880',
    }
  }
}`
  } : {
    name: 'Stark Obsidian (Theme 46)',
    styleTag: 'Brutalist Copenhagen Monospace',
    tagline: 'High contrast. Absolute function. No compromises.',
    description: 'Designed for street-culture boutiques, modern tech publishers, and modular art directories. High-contrast neon borders, sharp monospace listings, structural grids, and fast execution.',
    vibe: 'Technical, High Contrast, Raw, Mono, High-Density Grid',
    colors: ['#121212 (Obsidian)', '#F5F5F5 (Stark White)', '#10B981 (Nordic Emerald)', '#3F3F46 (Border Zinc)'],
    performanceScore: 100,
    seoScore: 99,
    bestSellerItem: 'Modular Workspace Bracket',
    features: [
      'Stark high-intensity grid borders for clear component hierarchy.',
      'Optimized lightweight codebase achieving perfect lighthouse response.',
      'Responsive floating notification matrix (Broadcaster).',
      'Unified event-handling logs (Medusa Engine integrated).',
      'Perfect for street apparel, audio synthesizer stores, and cyberpunk collectives.'
    ],
    specs: {
      framework: 'Vite & Custom Fast Express Server',
      styling: 'Tailwind CSS Stark Utility Classes',
      scripts: 'TypeScript clean ESModules',
      animations: 'Fast micro-transitions',
      lighthouse: { performance: '100%', accessibility: '98%', bestPractices: '100%', seo: '99%' }
    },
    reviews: [
      { author: 'Freja L.', company: 'Modular Collective Stockholm', text: 'Minimalist brutalism done right. The high contrast keeps navigation ultra-fast. No clutter.', rating: 5 },
      { author: 'Nils S.', company: 'Gothenburg Synths', text: 'Excellent console monitors and layout. The code snippet outputs are clean and immediate.', rating: 5 }
    ],
    tailwindCodeSnippet: `// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    colors: {
      obsidian: '#121212',
      stark: '#F5F5F5',
      emerald: '#10B981',
    }
  }
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(details.tailwindCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${
      isTheme42 
        ? 'bg-[#FAF8F5] text-[#2C2A27] font-serif' 
        : 'bg-[#0f0f0f] text-zinc-100 font-mono'
    }`}>
      
      {/* Landing Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center pb-8 border-b"
           style={{ borderColor: isTheme42 ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
        <button
          onClick={onBack}
          id={`landing-back-button-${themeId}`}
          className={`flex items-center gap-2 group text-xs uppercase tracking-wider py-2 px-4 border transition cursor-pointer ${
            isTheme42 
              ? 'border-stone-250 hover:bg-stone-100 text-stone-700' 
              : 'border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Exit Showcase Back to Directory</span>
        </button>

        <div className="flex gap-3">
          <span className={`text-[10px] uppercase font-bold py-1 px-2 border rounded-xs ${
            isTheme42 
              ? 'bg-[#c5a880]/15 border-[#c5a880] text-[#a4865d]' 
              : 'bg-emerald-950/20 border-emerald-500 text-emerald-400'
          }`}>
            {details.styleTag}
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono py-1">
            EST. 2026 // MODEL NODE
          </span>
        </div>
      </div>

      {/* Main Hero Showcase */}
      <div className="max-w-6xl mx-auto py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left column: copywriting and triggers */}
        <div className="md:col-span-6 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#9c8469] font-sans font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              EXCLUSIVE DESIGN SPECIFICATION SHEET
            </span>
            <h1 className={`text-4xl md:text-5xl tracking-tight leading-tight uppercase ${isTheme42 ? 'font-display' : 'font-extrabold'}`}>
              {details.name}
            </h1>
            <p className="text-sm md:text-base opacity-75 font-sans italic mt-1 font-light">
              "{details.tagline}"
            </p>
          </div>

          <p className="text-xs md:text-sm leading-relaxed opacity-85 font-sans font-light">
            {details.description}
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-4 py-2">
            <div className={`p-3 border text-center ${isTheme42 ? 'bg-white border-stone-150' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <span className="block text-[10px] uppercase tracking-wider opacity-50 font-sans">PERFORMANCE</span>
              <span className={`text-xl font-bold font-mono ${isTheme42 ? 'text-amber-600' : 'text-emerald-400'}`}>
                {details.performanceScore}%
              </span>
            </div>
            <div className={`p-3 border text-center ${isTheme42 ? 'bg-white border-stone-150' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <span className="block text-[10px] uppercase tracking-wider opacity-50 font-sans">SEO CAPABLE</span>
              <span className={`text-xl font-bold font-mono ${isTheme42 ? 'text-amber-600' : 'text-emerald-400'}`}>
                {details.seoScore}%
              </span>
            </div>
            <div className={`p-3 border text-center ${isTheme42 ? 'bg-white border-stone-150' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <span className="block text-[10px] uppercase tracking-wider opacity-50 font-sans">Lighthouse</span>
              <span className="text-xl font-bold font-mono text-indigo-500">
                A+ 100/100
              </span>
            </div>
          </div>

          {/* Principal Call to action button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onLaunchLive}
              id={`launch-live-simulation-${themeId}`}
              className={`text-xs uppercase tracking-wider font-bold px-8 py-4 flex items-center justify-center gap-3 shadow-md border cursor-pointer transition transform active:scale-95 ${
                isTheme42
                  ? 'bg-[#2C2A27] text-white border-stone-800 hover:bg-stone-800'
                  : 'bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400 font-extrabold'
              }`}
            >
              <span>Launch Live Interactive Simulation</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>

            <button
              onClick={() => onTriggerAIPreset(
                `Generate a custom variation of ${details.name} featuring ${details.bestSellerItem} and expanded responsive checkout systems.`,
                isTheme42 ? 'warm_scandinavian' : 'brutalist_copenhagen'
              )}
              className={`text-xs uppercase tracking-wider font-bold px-6 py-4 flex items-center justify-center gap-2 border hover:bg-stone-100 transition cursor-pointer ${
                isTheme42 ? 'border-stone-800 text-stone-800' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Modify with Gemini AI</span>
            </button>
          </div>

          {/* Color palette identifiers */}
          <div className="space-y-1.5 font-sans text-xs">
            <span className="block text-[9px] uppercase tracking-widest opacity-55 font-bold">CORE DESIGN SYSTEM PALETTE:</span>
            <div className="flex gap-2">
              {details.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-stone-100/40 p-1.5 border border-stone-150 rounded-xs">
                  <span className="w-3 h-3 border shrink-0" style={{ backgroundColor: c.split(' ')[0] }} />
                  <span className="text-[10px] font-mono opacity-80">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: High precision preview poster frame */}
        <div className="md:col-span-6 relative flex flex-col items-center">
          <div className={`p-2 border shadow-lg relative w-full aspect-[4/5] object-cover bg-stone-100 ${
            isTheme42 ? 'border-stone-200' : 'border-zinc-800 bg-zinc-900'
          }`}>
            <img 
              src={isTheme42 ? "/src/assets/images/scandi_chair_1779707393766.png" : "/src/assets/images/brutalist_chair_1779707421111.png"} 
              alt={details.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-700 pointer-events-auto"
            />
            {/* Visual Specs Overlays */}
            <div className="absolute top-6 left-6 text-left p-4 max-w-[200px] bg-black/50 text-white backdrop-blur-xs border border-white/20">
              <span className="text-[8px] uppercase tracking-widest font-sans">DESIGN INDEX //</span>
              <p className="text-[11px] font-mono mt-1 font-bold">TYPE: {isTheme42 ? 'NORDIC_042_SILK' : 'CPH_046_STARK'}</p>
              <p className="text-[9px] opacity-70 font-sans mt-0.5">Optimized for rapid checkout modules and API integration paths.</p>
            </div>
            
            <div className="absolute bottom-6 right-6 text-right p-3 bg-black/60 text-white backdrop-blur-xs">
              <span className="text-[14px] font-mono font-bold text-center block">
                {isTheme42 ? 'FROM $149' : 'FROM $249'}
              </span>
              <span className="text-[7px] uppercase tracking-widest tracking-normal block opacity-70">
                Atelier Licence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and specifications breakdown matrix */}
      <div className="max-w-6xl mx-auto py-12 border-t"
           style={{ borderColor: isTheme42 ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
        
        {/* Navigation tabs */}
        <div className="flex gap-4 border-b font-sans text-xs uppercase"
             style={{ borderColor: isTheme42 ? 'rgba(26,26,26,0.06)' : 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 font-bold cursor-pointer transition-all ${
              activeTab === 'features'
                ? isTheme42 ? 'text-black border-b-2 border-amber-600' : 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-stone-400 hover:text-stone-300'
            }`}
          >
            Core Features
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 font-bold cursor-pointer transition-all ${
              activeTab === 'specs'
                ? isTheme42 ? 'text-black border-b-2 border-amber-600' : 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-stone-400 hover:text-stone-300'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold cursor-pointer transition-all ${
              activeTab === 'reviews'
                ? isTheme42 ? 'text-black border-b-2 border-amber-600' : 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-stone-400 hover:text-stone-300'
            }`}
          >
            Client Reviews & Case Studies
          </button>
        </div>

        {/* Tab contents panel */}
        <div className="py-8 text-left">
          
          {/* FEATURES TAB */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div className="space-y-4">
                <h3 className="text-xs tracking-widest uppercase font-black opacity-50 mb-2">Designed for aesthetic conversions</h3>
                <div className="space-y-3">
                  {details.features.map((feat, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 self-start border mt-0.5 ${
                        isTheme42 ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        <Check className="w-3 h-3" />
                      </span>
                      <p className="text-xs opacity-85 leading-relaxed">{feat}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code snippet display */}
              <div className={`p-5 border text-xs leading-relaxed font-mono relative ${
                isTheme42 ? 'bg-[#F2EFEA] border-stone-250 text-stone-800' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <span className="block text-[8px] font-bold opacity-45 uppercase tracking-widest mb-3">
                  STYLING_INTEGRATION_EXTRACT.MJS
                </span>
                <pre className="text-[10px] overflow-x-auto whitespace-pre leading-normal select-text">
                  {details.tailwindCodeSnippet}
                </pre>
                
                <button
                  onClick={handleCopyCode}
                  className={`absolute top-4 right-4 p-1.5 border text-[10px] hover:brightness-110 flex items-center gap-1.5 cursor-pointer ${
                    isTheme42 ? 'bg-stone-900 border-stone-850 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Copy className="w-3 w-3" />
                  <span>{copiedCode ? 'COPIED!' : 'COPY CONFIG'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SPECS TAB */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b" style={{ borderColor: isTheme42 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  <span className="opacity-60 uppercase">CORE STYLESYSTEM FRAMEWORK:</span>
                  <span className="font-bold">{details.specs.framework}</span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: isTheme42 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  <span className="opacity-60 uppercase">UTILITY INTEGRATIONS:</span>
                  <span className="font-bold">{details.specs.styling}</span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: isTheme42 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  <span className="opacity-60 uppercase">COMPILER CONTROLS:</span>
                  <span className="font-bold">{details.specs.scripts}</span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: isTheme42 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  <span className="opacity-60 uppercase">REACTION PHYSICS TRANSITION:</span>
                  <span className="font-bold">{details.specs.animations}</span>
                </div>
              </div>

              {/* Lighthouse simulation panel */}
              <div className={`p-5 border ${isTheme42 ? 'bg-white border-stone-200' : 'bg-zinc-950/40 border-zinc-900'}`}>
                <p className="text-[9px] uppercase tracking-widest opacity-50 mb-4 block font-bold font-sans">
                  Lighthouse Production Audit Ratings
                </p>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <span className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-500 font-bold inline-flex items-center justify-center text-xs">
                      {details.specs.lighthouse.performance}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider font-sans">SPEED INDEX</span>
                  </div>
                  <div className="space-y-1">
                    <span className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-500 font-bold inline-flex items-center justify-center text-xs">
                      {details.specs.lighthouse.accessibility}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider font-sans">ACCESS</span>
                  </div>
                  <div className="space-y-1">
                    <span className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-500 font-bold inline-flex items-center justify-center text-xs">
                      {details.specs.lighthouse.bestPractices}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider font-sans">PRACTICES</span>
                  </div>
                  <div className="space-y-1">
                    <span className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-500 font-bold inline-flex items-center justify-center text-xs">
                      {details.specs.lighthouse.seo}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider font-sans">SEO SEARCH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              {details.reviews.map((rev, i) => (
                <div key={i} className={`p-6 border text-xs leading-relaxed space-y-3 ${
                  isTheme42 ? 'bg-white border-stone-200' : 'bg-zinc-900/60 border-zinc-800'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block font-bold">{rev.author}</span>
                      <span className="block text-[10px] opacity-50 font-mono tracking-wider">{rev.company}</span>
                    </div>
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, rIdx) => (
                        <Star key={rIdx} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="opacity-80 italic">"{rev.text}"</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
