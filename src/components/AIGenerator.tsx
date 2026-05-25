/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Sliders, Layout, Code, Eye, Layers, Settings, ChevronRight, CornerDownRight } from 'lucide-react';
import { GeneratedShopConfig, TemplateProduct } from '../types';
import Theme42Preview from './Theme42Preview';
import Theme46Preview from './Theme46Preview';

interface AIGeneratorProps {
  onBackToCatalogue?: () => void;
  initialPrompt?: string;
  initialStyle?: 'warm_scandinavian' | 'brutalist_copenhagen';
}

// Rotation of poetic load messages to enrich the generation phase
const loadingMessages = [
  "Formulating organic geometry...",
  "Calibrating Danish linen and raw chalk pigment codes...",
  "Drafting custom Oslo clay vessels catalog...",
  "Applying C.46 horizontal monospace coordinate vector rules...",
  "Weaving unwashed Scandinavian hemp and solid oak textures...",
  "Engraving serial index markers on technical drawing plinths..."
];

export default function AIGenerator({ onBackToCatalogue, initialPrompt, initialStyle }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt || 'An organic bakery & slow cafe in Gothenburg');
  const [stylePreference, setStylePreference] = useState<'warm_scandinavian' | 'brutalist_copenhagen'>(initialStyle || 'warm_scandinavian');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Custom sandboxed generated configuration
  const [generatedConfig, setGeneratedConfig] = useState<GeneratedShopConfig | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'SPEC_BLUEPRINT' | 'CODE_EXPORT'>('PREVIEW');
  const [cartCount, setCartCount] = useState(0);

  // Rotation interval for loading states
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingMsgIdx(0);

    try {
      const selectedStyleString = stylePreference === 'warm_scandinavian' 
        ? "Warm Scandinavian Serif (Theme 42)" 
        : "Brutalist Copenhagen Monospace (Theme 46)";

      const response = await fetch("/api/generate-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          stylePreference: selectedStyleString
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate your shop spec.");
      }

      const data: GeneratedShopConfig = await response.json();
      
      // Inject real generated image assets dynamically based on category/index to look incredibly polished!
      if (data.products && data.products.length > 0) {
        data.products[0].image = "/src/assets/images/scandi_chair_1779707393766.png";
        if (data.products[1]) data.products[1].image = "/src/assets/images/ceramic_vase_1779707431018.png";
        if (data.products[2]) data.products[2].image = "/src/assets/images/brutal_poster_1779707411527.png";
      }

      setGeneratedConfig(data);
      setActiveTab('PREVIEW');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during Gemini compilation. Please verify your Secrets config or retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedConfig) return;
    const codeString = `
// Generated React Storefront Code
// Nordic Template Suite [Compiled via Gemini 3.5]
// Brand: ${generatedConfig.brandName}

import React from 'react';

export default function ShopPreview() {
  const brandName = "${generatedConfig.brandName}"; 
  const accentColor = "${generatedConfig.accentColor}";
  const bgColor = "${generatedConfig.bgColor}";
  const textColor = "${generatedConfig.textColor}";
  
  return (
    <div className="w-full min-h-screen p-8 font-${generatedConfig.fontStyle}" style={{ backgroundColor: bgColor, color: textColor }}>
      <header className="border-b border-light pb-6 mb-12">
        <h1 className="text-3xl tracking-widest uppercase">${generatedConfig.brandName}</h1>
        <p className="text-xs opacity-60 font-sans tracking-wide mt-1">${generatedConfig.tagline}</p>
      </header>
      
      <main className="max-w-6xl mx-auto space-y-12">
        <div className="border p-6 max-w-2xl">
          <span className="text-[10px] uppercase tracking-widest text-[#95a5a6]">Philosophy Manifesto</span>
          <p className="mt-2 text-sm italic font-light">${generatedConfig.philosophy}</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${(generatedConfig.products || []).map((p, idx) => `
          <div key="${p.id}" className="border p-4 space-y-3">
            <span className="text-[14px] font-bold text-zinc-500">[0${idx + 1}]</span>
            <div className="aspect-square bg-neutral-200"></div>
            <h3 className="text-sm font-bold uppercase">${p.name}</h3>
            <p className="text-xs opacity-70">${p.description}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="font-extrabold text-[#7f8c8d]">${p.price}</span>
              <button className="px-3 py-1 font-bold border text-xs hover:bg-neutral-800 hover:text-white">ADD</button>
            </div>
          </div>
          `).join('')}
        </section>
      </main>
    </div>
  );
}
    `;
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Allow live editing of layout specs within the sandbox
  const handleUpdateConfigField = (field: keyof GeneratedShopConfig, value: any) => {
    if (!generatedConfig) return;
    setGeneratedConfig({
      ...generatedConfig,
      [field]: value
    });
  };

  // Allow editing of a single product's variable
  const handleUpdateProductField = (prodId: string, field: keyof TemplateProduct, value: string) => {
    if (!generatedConfig) return;
    const updatedProducts = (generatedConfig.products || []).map(p => {
      if (p.id === prodId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setGeneratedConfig({
      ...generatedConfig,
      products: updatedProducts
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#ecebe6] text-stone-900 pb-16">
      
      {/* Upper Utility Control Header */}
      <div className="bg-[#1A1A1A] text-[#F5F5F5] py-4 px-6 md:px-12 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="font-display text-sm font-medium tracking-[0.15em] uppercase">AI STUDIO // NORDIC COMPILE LAB</span>
        </div>
        {onBackToCatalogue && (
          <button 
            onClick={onBackToCatalogue}
            className="text-xs bg-zinc-800 px-4 py-2 hover:bg-zinc-700 transition-colors uppercase font-mono tracking-widest text-[#FAF8F5]"
          >
            ← Back to Store catalog
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: AI prompt, style preference select and parameters slider knobs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Prompt Console Card */}
          <div className="bg-white p-6 md:p-8 shadow-xs border border-stone-200">
            <h2 className="text-base font-display font-medium tracking-wide uppercase border-b pb-3 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-600" />
              Storefront Spec Engine
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
                  What are you designing?
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full text-sm p-3 border border-stone-300 bg-stone-50 rounded-xs h-24 focus:ring-1 focus:ring-stone-600 focus:outline-hidden"
                  placeholder="E.g. A minimalist wool-knitwear apparel atelier based in Bergen..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
                  Aesthetic Motif
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setStylePreference('warm_scandinavian')}
                    className={`p-3 text-left border rounded-xs transition-all flex flex-col justify-between ${stylePreference === 'warm_scandinavian' ? 'border-stone-800 bg-stone-50 ring-1 ring-stone-800' : 'border-stone-300 hover:border-stone-400'}`}
                  >
                    <span className="text-xs font-bold block mb-1">Theme 42</span>
                    <span className="text-[10px] text-stone-500 font-serif italic font-light">Warm Scandinavian (Serif editorial, linen cards)</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setStylePreference('brutalist_copenhagen')}
                    className={`p-3 text-left border rounded-xs transition-all flex flex-col justify-between ${stylePreference === 'brutalist_copenhagen' ? 'border-stone-800 bg-stone-50 ring-1 ring-stone-800' : 'border-stone-300 hover:border-stone-400'}`}
                  >
                    <span className="text-xs font-bold block mb-1">Theme 46</span>
                    <span className="text-[10px] text-stone-500 font-mono">Brutalist Copenhagon (Monospace, raw coordinates)</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Node Spec...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Theme Compiler</span>
                  </>
                )}
              </button>
            </form>

            {errorMsg && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mt-4 text-xs text-rose-800">
                <p className="font-semibold">Generation Failed</p>
                <p className="mt-1 opacity-90">{errorMsg}</p>
              </div>
            )}
          </div>

          {/* Sandbox Live Customizer sliders & parameters (loaded only once we have a config) */}
          {generatedConfig && (
            <div className="bg-white p-6 shadow-xs border border-stone-200 space-y-6">
              <h2 className="text-xs font-display font-bold uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2 text-stone-700">
                <Sliders className="w-4 h-4 text-stone-500" />
                Live Design Sandbox
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Interactive Brand Name</label>
                  <input 
                    type="text" 
                    value={generatedConfig.brandName}
                    onChange={(e) => handleUpdateConfigField('brandName', e.target.value)}
                    className="w-full p-2 border border-stone-300 text-xs bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Poetic Tagline</label>
                  <input 
                    type="text" 
                    value={generatedConfig.tagline}
                    onChange={(e) => handleUpdateConfigField('tagline', e.target.value)}
                    className="w-full p-2 border border-stone-300 text-xs bg-stone-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Canvas Bg</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={generatedConfig.bgColor}
                        onChange={(e) => handleUpdateConfigField('bgColor', e.target.value)}
                        className="w-8 h-8 p-0.5 border border-stone-300 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={generatedConfig.bgColor}
                        onChange={(e) => handleUpdateConfigField('bgColor', e.target.value)}
                        className="w-full text-[10px] p-1 border uppercase text-stone-700 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Accent Paint</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={generatedConfig.accentColor}
                        onChange={(e) => handleUpdateConfigField('accentColor', e.target.value)}
                        className="w-8 h-8 p-0.5 border border-stone-300 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={generatedConfig.accentColor}
                        onChange={(e) => handleUpdateConfigField('accentColor', e.target.value)}
                        className="w-full text-[10px] p-1 border uppercase text-stone-700 text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">// Inline Catalog Editor</span>
                  
                  {(generatedConfig.products || []).map((prod, idx) => (
                    <div key={prod.id} className="p-3 bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Product #{idx+1} [0{prod.number || idx+1}]</span>
                        <span className="text-[10px] text-zinc-400">{prod.category}</span>
                      </div>
                      <input 
                        type="text" 
                        value={prod.name}
                        onChange={(e) => handleUpdateProductField(prod.id, 'name', e.target.value)}
                        className="w-full p-1.5 text-[11px] border border-stone-300 bg-white"
                        placeholder="Product Name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={prod.price}
                          onChange={(e) => handleUpdateProductField(prod.id, 'price', e.target.value)}
                          className="w-full p-1 text-[11px] border border-stone-300 bg-white"
                          placeholder="Price"
                        />
                        <input 
                          type="text" 
                          value={prod.badge || ''}
                          onChange={(e) => handleUpdateProductField(prod.id, 'badge', e.target.value)}
                          className="w-full p-1 text-[11px] border border-stone-300 bg-white placeholder-stone-300"
                          placeholder="Badge label"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Main Interactive Live Browser Frame Workspace */}
        <div className="lg:col-span-8 flex flex-col">
          
          {isLoading ? (
            /* Immersive Scandinavian loading phase */
            <div className="w-full aspect-video min-h-[500px] bg-[#FAF8F5] border border-stone-300 flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-stone-200 border-t-stone-800 animate-spin" />
                <Sparkles className="w-5 h-5 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-md">
                <p className="text-xs uppercase tracking-[0.2em] font-medium text-stone-500">Querying Gemini Space Compiler</p>
                <h3 className="text-lg font-light italic font-serif text-stone-800 animate-pulse">
                  "{loadingMessages[loadingMsgIdx]}"
                </h3>
              </div>
              <div className="w-32 h-px bg-stone-300 pt-px animate-pulse" />
            </div>
          ) : generatedConfig ? (
            /* Completed Sandbox Storefront Workspace Frame */
            <div className="flex flex-col h-full bg-white border border-stone-300 shadow-sm overflow-hidden">
              
              {/* Workspace internal tabs */}
              <div className="bg-[#1e1e1e] border-b border-zinc-800 px-4 py-2 flex justify-between items-center text-xs">
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setActiveTab('PREVIEW')}
                    className={`px-4 py-1.5 uppercase font-mono text-[10px] tracking-widest transition-colors flex items-center gap-1.5 ${activeTab === 'PREVIEW' ? 'bg-[#2d2d2d] text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Interactive Sandbox
                  </button>
                  <button 
                    onClick={() => setActiveTab('SPEC_BLUEPRINT')}
                    className={`px-4 py-1.5 uppercase font-mono text-[10px] tracking-widest transition-colors flex items-center gap-1.5 ${activeTab === 'SPEC_BLUEPRINT' ? 'bg-[#2d2d2d] text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Spec Blueprint JSON
                  </button>
                  <button 
                    onClick={() => setActiveTab('CODE_EXPORT')}
                    className={`px-4 py-1.5 uppercase font-mono text-[10px] tracking-widest transition-colors flex items-center gap-1.5 ${activeTab === 'CODE_EXPORT' ? 'bg-[#2d2d2d] text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    React Code Export
                  </button>
                </div>
                <div className="text-zinc-500 text-[9px] font-mono select-none">
                  (ACTIVE_DRAFT: {generatedConfig.brandName.replace(/\s+/g, '_').toUpperCase()})
                </div>
              </div>

              {/* Panel workspaces contents */}
              <div className="flex-1 overflow-auto max-h-[800px]">
                {activeTab === 'PREVIEW' && (
                  <div className="relative border-4 border-stone-100">
                    {/* Live mock status bar inside preview frame */}
                    <div className="bg-stone-100 border-b border-stone-200 py-1.5 px-4 text-[9px] font-sans text-stone-500 flex justify-between select-none">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span>Interactive iFrame Frame Preview</span>
                      </div>
                      <span className="font-serif italic font-light lowercase">Compiled perfectly in 2.4s</span>
                    </div>

                    {/* Conditional render of Theme previews based on configuration layout directive */}
                    {generatedConfig.layoutStyle === 'brutalist' ? (
                      <Theme46Preview 
                        brandName={generatedConfig.brandName}
                        tagline={generatedConfig.tagline}
                        philosophy={generatedConfig.philosophy}
                        accentColor={generatedConfig.accentColor}
                        bgColor={generatedConfig.bgColor}
                        textColor={generatedConfig.textColor}
                        products={generatedConfig.products}
                        onAddToCart={(prod) => setCartCount(prev => prev + 1)}
                      />
                    ) : (
                      <Theme42Preview 
                        brandName={generatedConfig.brandName}
                        tagline={generatedConfig.tagline}
                        philosophy={generatedConfig.philosophy}
                        accentColor={generatedConfig.accentColor}
                        bgColor={generatedConfig.bgColor}
                        textColor={generatedConfig.textColor}
                        products={generatedConfig.products}
                        onAddToCart={(prod) => setCartCount(prev => prev + 1)}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'SPEC_BLUEPRINT' && (
                  <div className="p-6 md:p-8 bg-zinc-950 text-[#8BC34A] font-mono text-[11px] leading-relaxed select-text overflow-auto">
                    <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-zinc-400">
                      <span>NORDIC_SPEC_MARKUP // SOURCE_VARIABLES</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(generatedConfig, null, 2));
                          alert("Blueprint JSON copied successfully!");
                        }}
                        className="text-[9px] bg-zinc-800 px-2 py-1 text-white hover:bg-zinc-700"
                      >
                        [COPY JSON SOURCE]
                      </button>
                    </div>
                    <pre>{JSON.stringify(generatedConfig, null, 2)}</pre>
                  </div>
                )}

                {activeTab === 'CODE_EXPORT' && (
                  <div className="bg-zinc-950 p-6 font-mono text-xs text-zinc-300 relative">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4 select-none">
                      <span className="text-zinc-500 uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        Component Source Code (Tailwind v4)
                      </span>
                      <button 
                        onClick={handleCopyCode}
                        className="bg-zinc-800 hover:bg-zinc-700 font-mono text-[10px] text-white py-1 px-3 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCode ? 'Copied' : 'Copy React Component'}
                      </button>
                    </div>

                    <pre className="text-emerald-400 overflow-auto select-text font-mono max-h-[600px] text-[11px] leading-relaxed">
{`import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, X, Check } from 'lucide-react';

export default function GeneratedAtelier() {
  const [cart, setCart] = useState([]);
  
  // Design system configurations
  const brandName = "${generatedConfig.brandName}";
  const tagline = "${generatedConfig.tagline}";
  const philosophy = "${generatedConfig.philosophy}";
  const bgColor = "${generatedConfig.bgColor}";
  const textColor = "${generatedConfig.textColor}";
  const accentColor = "${generatedConfig.accentColor}";

  const products = ${JSON.stringify(generatedConfig.products, null, 4)};

  return (
    <div className="w-full min-h-screen p-8 text-neutral-800" style={{ backgroundColor: bgColor, color: textColor }}>
      <header className="border-b pb-6 flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest">{brandName}</h1>
          <p className="text-[10px] tracking-widest opacity-60 uppercase mt-1">{tagline}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-12 space-y-12">
        <div className="border border-stone-200/50 p-6 italic font-light text-md opacity-90 max-w-2xl">
          "{philosophy}"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="border p-4 flex flex-col justify-between h-96">
              <div className="aspect-square bg-neutral-200"></div>
              <div className="pt-4">
                <h3 className="font-bold uppercase tracking-wider text-xs">{p.name}</h3>
                <p className="text-[11px] opacity-70 mt-2 line-clamp-3">{p.description}</p>
              </div>
              <div className="flex justify-between items-center border-t pt-3 mt-3">
                <span className="font-bold">{p.price}</span>
                <button className="px-3 py-1 font-bold border hover:bg-black hover:text-white transition-colors text-[10px] tracking-[0.1em]">
                  ({p.badge || 'BUY'})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Splash instruction state details */
            <div className="w-full aspect-video min-h-[500px] bg-white border border-stone-300 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <Layout className="w-12 h-12 text-stone-300" />
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-display tracking-wide uppercase font-semibold">Live Sandbox Workspace</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
                  Input a business concept on the left panel (e.g. "Oslo candle store", "Stark art bookshop") and compile with Gemini to see an instant bespoke design system, products, and tailored digital store template.
                </p>
              </div>
              <div className="flex items-center gap-2 text-stone-400 font-mono text-[10px]">
                <span>SELECT STYLE</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>COMPILE SPECS</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>SANDBOX PREVIEW</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
