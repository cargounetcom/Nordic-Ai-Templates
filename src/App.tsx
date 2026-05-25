/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Eye, Check, Clock, Search, Filter, Compass, ChevronRight, Shield } from 'lucide-react';
import Theme42Preview from './components/Theme42Preview';
import Theme46Preview from './components/Theme46Preview';
import AIGenerator from './components/AIGenerator';
import TemplateSimulator from './components/TemplateSimulator';
import RoleWorkspace from './components/RoleWorkspace';
import { FiftyNordicTemplates, DesignTemplate } from './data/templates';

type ActiveView = 'market' | 'simulator' | 'theme42_live' | 'theme46_live' | 'ai_spec_compiler' | 'role_workspace';

export default function App() {
  const [view, setView] = useState<ActiveView>('market');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>(FiftyNordicTemplates[0]);
  const [marketTheme, setMarketTheme] = useState<'warm' | 'brutalist'>('warm');
  const [cphTime, setCphTime] = useState('');
  const [mockCartCount, setMockCartCount] = useState(0);
  const [checkoutActive, setCheckoutActive] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePlatform, setActivePlatform] = useState<string>('All');
  const [activeStyle, setActiveStyle] = useState<string>('All');

  // AI seed variables forwarded from design templates
  const [aiPresetPrompt, setAiPresetPrompt] = useState('');
  const [aiPresetStyle, setAiPresetStyle] = useState<'warm_scandinavian' | 'brutalist_copenhagen'>('warm_scandinavian');

  // Set up local Stockholm/Copenhagen digital time updates
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Copenhagen',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCphTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerCheckout = () => {
    setCheckoutActive(true);
    setTimeout(() => {
      setCheckoutActive(false);
      setMockCartCount(0);
    }, 3000);
  };

  const handleLaunchSimulator = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setView('simulator');
  };

  const handleTriggerAIPreset = (promptText: string, styleVal: 'warm_scandinavian' | 'brutalist_copenhagen') => {
    setAiPresetPrompt(promptText);
    setAiPresetStyle(styleVal);
    setView('ai_spec_compiler');
  };

  // Categories extracted dynamically for accuracy
  const categoriesList = ['All', 'Furniture', 'Jewelry', 'Luxury', 'Apothecary', 'Fashion', 'Ceramics', 'Design Space'];
  const platformsList = ['All', 'WooCommerce', 'Shopify', 'Webflow', 'Next.js'];
  const stylesList = [
    { value: 'All', label: 'All Styles' },
    { value: 'warm_scandinavian', label: 'Warm Scandinavian (Serif)' },
    { value: 'brutalist_copenhagen', label: 'Brutalist Copenhagen (Mono)' }
  ];

  // Filtering Logic of the 50 templates
  const filteredTemplates = FiftyNordicTemplates.filter((tpl) => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.philosophy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tpl.category === activeCategory;
    const matchesPlatform = activePlatform === 'All' || tpl.platform === activePlatform;
    const matchesStyle = activeStyle === 'All' || tpl.style === activeStyle;

    return matchesSearch && matchesCategory && matchesPlatform && matchesStyle;
  });

  // Full screen view routing
  if (view === 'simulator') {
    return (
      <TemplateSimulator 
        template={selectedTemplate}
        onBack={() => setView('market')}
        onLaunchAIGenerate={handleTriggerAIPreset}
      />
    );
  }

  if (view === 'theme42_live') {
    return (
      <div className="relative">
        <div className="fixed top-24 left-6 z-50 bg-[#1A1A1A]/85 text-white text-[10px] uppercase font-sans tracking-widest py-2.5 px-4 rounded-none shadow-md flex items-center gap-2 select-none pointer-events-auto hover:bg-[#2C2A27]">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span>Active Simulation: Theme 42 Showcase</span>
          <button 
            onClick={() => setView('market')} 
            className="ml-3 border-l pl-3 text-stone-300 hover:text-white font-bold"
          >
            [Exit Simulator]
          </button>
        </div>
        <Theme42Preview 
          onAddToCart={() => setMockCartCount(prev => prev + 1)}
        />
      </div>
    );
  }

  if (view === 'theme46_live') {
    return (
      <div className="relative">
        <div className="fixed top-24 left-6 z-50 bg-[#F5F5F5]/90 text-black text-[10px] uppercase font-mono tracking-widest py-2.5 px-4 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black flex items-center gap-2 select-none">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          <span>SIM.RUNNING: THEME_46 Showcase</span>
          <button 
            onClick={() => setView('market')} 
            className="ml-3 border-l-2 border-black pl-3 text-zinc-700 hover:text-black font-black"
          >
            (EXIT_SIMULATE)
          </button>
        </div>
        <Theme46Preview 
          onAddToCart={() => setMockCartCount(prev => prev + 1)}
        />
      </div>
    );
  }

  if (view === 'ai_spec_compiler') {
    return (
      <AIGenerator 
        initialPrompt={aiPresetPrompt || undefined}
        initialStyle={aiPresetStyle || undefined}
        onBackToCatalogue={() => {
          setView('market');
          setAiPresetPrompt('');
        }}
      />
    );
  }

  if (view === 'role_workspace') {
    return (
      <RoleWorkspace 
        themeStyle={marketTheme}
        onBack={() => setView('market')}
        onLaunchTemplate={handleLaunchSimulator}
      />
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 ${
        marketTheme === 'warm' 
          ? 'bg-[#FAF8F5] text-[#2C2A27] font-serif' 
          : 'bg-[#121212] text-[#F5F5F5] font-mono border-zinc-800'
      }`}
    >
      
      {/* Absolute Checkout success toast */}
      {checkoutActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white text-stone-900 border border-stone-200 p-8 max-w-sm text-center shadow-2xl rounded-none space-y-4 animate-scale-up">
            <Check className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-sans font-bold uppercase tracking-wider">License Provision Completed</h3>
            <p className="text-xs text-stone-500 font-sans">
              Dynamic purchase of Scandi Commerce specs processed. Your custom catalog templates have successfully compiled.
            </p>
          </div>
        </div>
      )}

      {/* Global Lab Mini Header Ticker */}
      <div 
        className="px-6 py-2.5 border-b flex justify-between items-center text-[10px] tracking-widest select-none uppercase"
        style={{ borderColor: marketTheme === 'warm' ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>COPENHAGEN/STOCKHOLM DOCK TIME: <span className="font-bold">{cphTime || '11:20:00'}</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-stone-500">DIGITAL_LICENSE_OP: AUTHENTICATED</span>
          <span>•</span>
          <span className="text-stone-400">DESIGN_DB SIZE: 50 NODES</span>
        </div>
      </div>

      {/* Primary Brand Utility Navigation */}
      <header 
        className="border-b px-6 py-8 md:px-12 flex justify-between items-center bg-transparent backdrop-blur-xs select-none"
        style={{ borderColor: marketTheme === 'warm' ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase font-display">NORDIC // Themes Shop</span>
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase opacity-60 mt-1">50 PREMIUM WooCommerce, Shopify & Webflow Blueprint Matrices</span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-6">
          {/* Style toggler overlay for the lab */}
          <div className="flex border rounded-xs select-none p-0.5 bg-stone-100/50">
            <button 
              onClick={() => setMarketTheme('warm')}
              className={`px-3 py-1.5 text-[10px] uppercase font-sans tracking-wider transition-all cursor-pointer ${marketTheme === 'warm' ? 'bg-white text-[#2C2A27] font-bold shadow-xs' : 'text-stone-400'}`}
            >
              Linen Minimalist
            </button>
            <button 
              onClick={() => setMarketTheme('brutalist')}
              className={`px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${marketTheme === 'brutalist' ? 'bg-zinc-800 text-white font-bold' : 'text-stone-500'}`}
            >
              Stark Obsidian
            </button>
          </div>

          {/* Checkout Bag Counter */}
          <div 
            onClick={mockCartCount > 0 ? handleTriggerCheckout : undefined}
            className={`flex items-center gap-2 px-3 py-1.5 border select-none transition-all cursor-pointer ${mockCartCount > 0 ? 'bg-emerald-500 text-white border-emerald-500 animate-pulse' : 'opacity-40'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-sans font-bold">({mockCartCount}) BAG</span>
          </div>

          {/* Subscriptions & Workspaces Portal */}
          <button 
            onClick={() => setView('role_workspace')}
            className={`flex items-center gap-2 px-3 py-1.5 border select-none transition-all cursor-pointer hover:bg-neutral-800 hover:text-white ${
              marketTheme === 'warm' ? 'border-stone-800 text-stone-800' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-sans font-bold uppercase">Roles & Portals</span>
          </button>
        </div>
      </header>

      {/* Hero Intro Banner Section */}
      <section className="px-6 py-12 md:px-12 md:py-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60">
            <Compass className="w-4 h-4" />
            <span>NORDIC SUITE — 50 GOLD BLUEPRINTS EXPANSION</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight uppercase font-display">
            A Curated Directory Of <br />
            <span className="italic font-serif text-[#c5a880]">50 Danish Blueprints.</span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed opacity-85 max-w-2xl font-sans font-light">
            Search, filter, and compile fifty premium Scandinavian design templates tailored for high-contrast commerce. Open the dynamic sandbox workspace of any template to live-adjust colors, test responsive catalogs, copy clean code, or expand variables with Gemini AI.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setView('ai_spec_compiler')}
              className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-xs uppercase tracking-widest font-semibold px-6 py-4 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Open AI Shop Spec Compiler
            </button>
            <button 
              onClick={() => setView('role_workspace')}
              className={`border text-xs uppercase tracking-widest font-semibold px-6 py-4 flex items-center gap-2 shadow-xs cursor-pointer transition-colors ${
                marketTheme === 'warm' ? 'border-[#2C2A27] text-[#2C2A27] hover:bg-[#2C2A27] hover:text-white' : 'border-[#F5F5F5] text-[#F5F5F5] hover:bg-white hover:text-black'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-500 animate-pulse" />
              Subscriptions & Roles Portal
            </button>
          </div>
        </div>

        {/* Beautiful display mockup illustration of Scandinavian/Brutalist posters */}
        <div className="md:col-span-5 relative bg-stone-100 p-4 border border-stone-200 shadow-sm overflow-hidden aspect-[4/3] group">
          <img 
            src="/src/assets/images/scandi_chair_1779707393766.png" 
            alt="Lounge chair banner" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 transition-all duration-1000 animate-fade-in"
          />
          <div className="absolute inset-0 bg-stone-900/10 pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-white text-left font-serif p-4 bg-black/40 backdrop-blur-xs border border-white/20">
            <p className="text-[9px] uppercase font-sans tracking-widest">Premium Atelier</p>
            <h3 className="text-sm font-light mt-0.5">EST. 2026 Nordic Homeware Showcase</h3>
          </div>
        </div>
      </section>

      {/* Filtration Workspace Layout */}
      <section className="px-6 py-6 md:px-12 max-w-7xl mx-auto space-y-6">
        <div className="bg-white/40 backdrop-blur-xs border border-stone-200/50 p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96 flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input 
                type="text"
                placeholder="Search templates (e.g. Amber, Gold, CPH, Chair)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-600 font-sans text-xs"
              />
            </div>

            {/* Statistics */}
            <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
              Showing <span className="font-bold text-stone-950 font-sans">{filteredTemplates.length}</span> of 50 blueprints
            </div>
          </div>

          {/* Filters Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
            {/* Category selection */}
            <div className="space-y-1.5ClassName">
              <span className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#9c8469]">Niche Category</span>
              <div className="flex flex-wrap gap-1.5">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 font-sans text-[10px] tracking-wider uppercase border transition-all ${activeCategory === cat ? 'bg-stone-800 text-white border-stone-800' : 'bg-white hover:bg-stone-50 border-stone-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform selection */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#9c8469]">Integration Platform</span>
              <div className="flex flex-wrap gap-1.5">
                {platformsList.map((plt) => (
                  <button
                    key={plt}
                    onClick={() => setActivePlatform(plt)}
                    className={`px-3 py-1 font-sans text-[10px] tracking-wider uppercase border transition-all ${activePlatform === plt ? 'bg-stone-800 text-white border-stone-800' : 'bg-white hover:bg-stone-50 border-stone-200'}`}
                  >
                    {plt}
                  </button>
                ))}
              </div>
            </div>

            {/* Style preference selection */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-sans font-bold uppercase tracking-widest text-[#9c8469]">Aesthetic Canvas</span>
              <div className="flex flex-wrap gap-1.5">
                {stylesList.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setActiveStyle(style.value)}
                    className={`px-3 py-1 font-sans text-[10px] tracking-wider uppercase border transition-all ${activeStyle === style.value ? 'bg-stone-800 text-white border-stone-800' : 'bg-white hover:bg-stone-50 border-stone-200'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Curated Marketplace Catalog Grid (50 Templates) */}
      <section className="px-6 py-6 md:px-12 max-w-7xl mx-auto">
        {filteredTemplates.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-stone-300 max-w-3xl mx-auto space-y-4">
            <span className="text-stone-400 font-mono text-xs block">[NO_MATCHES_FOUND]</span>
            <p className="text-sm font-sans font-light">No blueprints match your current filter combination. Clear your terms or try a different key.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setActivePlatform('All');
                setActiveStyle('All');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs uppercase scale-95 transition hover:scale-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const isWarm = template.style === 'warm_scandinavian';
              
              return (
                <div 
                  key={template.id} 
                  className={`border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md ${
                    isWarm 
                      ? 'bg-white border-stone-200' 
                      : 'bg-zinc-950 text-white border-zinc-800'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    {/* Header tags info */}
                    <div className="flex justify-between items-start text-[10px] font-sans">
                      <span className="opacity-40 font-bold font-mono">SPEC_ID: {template.id}</span>
                      <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-sm font-sans font-semibold uppercase text-[9px]">
                          {template.platform}
                        </span>
                        <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-sm ${
                          isWarm ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-950/40 border-rose-800 text-rose-400'
                        }`}>
                          {template.category}
                        </span>
                      </div>
                    </div>

                    {/* Logo title */}
                    <div>
                      <h3 className={`text-lg uppercase tracking-wide leading-none ${isWarm ? 'text-[#2C2A27] font-serif' : 'text-white font-mono font-bold'}`}>
                        {template.name}
                      </h3>
                      <p className="text-[11px] opacity-75 italic font-sans font-light mt-1.5">{template.tagline}</p>
                    </div>

                    {/* Design parameters & Swatches */}
                    <div className={`p-3 text-[10px] space-y-1.5 rounded-none font-sans ${isWarm ? 'bg-stone-50 text-stone-600 border border-stone-100' : 'bg-zinc-900/60 text-zinc-400 border border-zinc-900'}`}>
                      <div className="flex justify-between">
                        <span className="opacity-60">Typography:</span>
                        <span className="font-semibold">{template.fonts.display}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-60">Dominant Paint Swatch:</span>
                        <div className="flex gap-1">
                          <span className="w-2.5 h-2.5 border border-stone-300" style={{ backgroundColor: template.colors.bg }} title="Background" />
                          <span className="w-2.5 h-2.5 border border-stone-300" style={{ backgroundColor: template.colors.text }} title="Text" />
                          <span className="w-2.5 h-2.5 border border-stone-300" style={{ backgroundColor: template.colors.accent }} title="Accent" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">Included Node Items:</span>
                        <span className="font-mono">{template.items.length} units</span>
                      </div>
                    </div>

                    {/* Philosophy text */}
                    <p className="text-[11.5px] leading-relaxed opacity-80 font-sans font-light line-clamp-3">
                      {template.philosophy}
                    </p>
                  </div>

                  {/* Operational triggers */}
                  <div className={`border-t p-4 flex gap-2 select-none ${isWarm ? 'border-stone-100 bg-stone-50/50' : 'border-zinc-900 bg-zinc-900/25'}`}>
                    <button 
                      onClick={() => handleLaunchSimulator(template)}
                      className={`flex-1 py-2 text-[10px] uppercase font-sans tracking-wider font-semibold border transition text-center hover:bg-stone-100 cursor-pointer ${
                        isWarm ? 'bg-white text-stone-800 border-stone-300' : 'bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      Sandbox Customizer
                    </button>
                    <button 
                      onClick={() => setMockCartCount(prev => prev + 1)}
                      className={`py-2 px-3 text-[10px] uppercase font-sans tracking-wide font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        isWarm ? 'bg-[#2C2A27] text-white hover:bg-stone-800' : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      }`}
                    >
                      Add Spec
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature section detail: AI Integration statement */}
      <section 
        className="px-6 py-12 md:px-12 md:py-16 max-w-7xl mx-auto border-t text-center space-y-6"
        style={{ borderColor: marketTheme === 'warm' ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-sans tracking-[0.25em] uppercase opacity-50 block select-none">// SYSTEM COMPILER</span>
          <h3 className="text-2xl font-light uppercase tracking-wide">Dynamic Code Synthesis</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
            Need an organic blend or high-contrast jewelry template that is not in the default catalogue? Boot up the Google Gemini AI Spec workspace to draft customized layouts from simple text prompts.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setView('ai_spec_compiler')}
              className="px-6 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors uppercase text-xs tracking-widest font-semibold flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Launch Creative AI Sandbox
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="border-t px-6 py-12 md:px-12 text-xs font-sans tracking-widest uppercase text-center space-y-6 opacity-60 max-w-7xl mx-auto"
        style={{ borderColor: marketTheme === 'warm' ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}
      >
        <p className="font-serif italic font-light lowercase text-base tracking-normal">design, code and art in synergy.</p>
        <p className="text-[10px]">© 2026 NORDIC Theme Lab Studio. Powered by AI Studio & Gemini Multi-Model Suite.</p>
      </footer>

    </div>
  );
}
