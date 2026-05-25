/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Eye, Code, Layers, Sliders, Check, Copy, ArrowLeft, RefreshCw, 
  Sparkles, ShoppingBag, Terminal, Palette, Type, Grid, Shuffle, Settings 
} from 'lucide-react';
import { DesignTemplate } from '../data/templates';
import { TemplateProduct } from '../types';
import Theme42Preview from './Theme42Preview';
import Theme46Preview from './Theme46Preview';

interface TemplateSimulatorProps {
  template: DesignTemplate;
  onBack: () => void;
  onLaunchAIGenerate: (prompt: string, style: 'warm_scandinavian' | 'brutalist_copenhagen') => void;
}

export default function TemplateSimulator({ template, onBack, onLaunchAIGenerate }: TemplateSimulatorProps) {
  // Live dynamic theme style choice (can switch between Warm Scandinavian and Brutalist Copenhagen layout on the fly!)
  const [previewStyle, setPreviewStyle] = useState<'warm_scandinavian' | 'brutalist_copenhagen'>(template.style);

  // Live custom state keys seeded from the chosen template
  const [brandName, setBrandName] = useState(template.name);
  const [tagline, setTagline] = useState(template.tagline);
  const [philosophy, setPhilosophy] = useState(template.philosophy);
  
  // Custom colors and gradients
  const [bgColor, setBgColor] = useState(template.colors.bg);
  const [textColor, setTextColor] = useState(template.colors.text);
  const [accentColor, setAccentColor] = useState(template.colors.accent);
  
  // Dynamic gradient controls ("gradient bloks")
  const [useGradient, setUseGradient] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientColorStart, setGradientColorStart] = useState(template.colors.bg);
  const [gradientColorEnd, setGradientColorEnd] = useState(template.colors.accent);

  // Dynamic font pairings ("fons" - select display and body fonts)
  const [displayFont, setDisplayFont] = useState(template.style === 'warm_scandinavian' ? 'Playfair Display' : 'Space Grotesk');
  const [bodyFont, setBodyFont] = useState(template.style === 'warm_scandinavian' ? 'Inter' : 'JetBrains Mono');

  // Custom individual layout rules derived to Tailwind classes ("individual style tailwind rules")
  const [paddingScale, setPaddingScale] = useState<'p-2' | 'p-4' | 'p-6'>('p-4');
  const [borderRadiusStyle, setBorderRadiusStyle] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>('none');
  const [borderWeightStyle, setBorderWeightStyle] = useState<'border-0' | 'border' | 'border-2' | 'border-4'>('border');

  // Active customizer tab inside the sidebar
  const [activeCustomizerTab, setActiveCustomizerTab] = useState<'REMIX' | 'BRANDING' | 'COLORS' | 'TYPOGRAPHY' | 'CATALOG'>('REMIX');

  // Active top preview workspace tab
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'SANDBOX' | 'BLUEPRINT' | 'CODE'>('SANDBOX');
  const [copied, setCopied] = useState(false);
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  // Load selected Fonts into DOM dynamically to keep preview rendering 100% accurate
  useEffect(() => {
    // Only load if not standard sans-serif
    const linkId = 'dynamic-google-fonts';
    let linkElement = document.getElementById(linkId) as HTMLLinkElement | null;
    
    const formattedDisplay = displayFont.replace(/ /g, '+');
    const formattedBody = bodyFont.replace(/ /g, '+');
    const hrefUrl = `https://fonts.googleapis.com/css2?family=${formattedDisplay}:wght@305;400;600;700;800&family=${formattedBody}:wght@300;400;500;700&display=swap`;
    
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = linkId;
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
    }
    linkElement.href = hrefUrl;
  }, [displayFont, bodyFont]);

  // Seed initial products lists
  const dynamicProducts: TemplateProduct[] = template.items.map((it, idx) => {
    let imagePlaceholder = "/src/assets/images/scandi_chair_1779707393766.png";
    if (idx === 1) imagePlaceholder = "/src/assets/images/ceramic_vase_1779707431018.png";
    if (idx === 2) imagePlaceholder = "/src/assets/images/brutal_poster_1779707411527.png";

    return {
      id: `${template.id}-item-${idx}`,
      name: `${it.number || '0' + (idx + 1)}. ${it.name}`,
      category: it.category,
      price: it.price,
      image: imagePlaceholder,
      description: it.description,
      badge: idx === 0 ? "CERTIFIED ORIGINAL" : idx === 1 ? "LIMITED PRODUCTION" : undefined,
      number: it.number
    };
  });

  const [products, setProducts] = useState<TemplateProduct[]>(dynamicProducts);

  // Event handlers
  const handleUpdateProductPrice = (idx: number, newPrice: string) => {
    const updated = [...products];
    if (updated[idx]) {
      updated[idx].price = newPrice;
      setProducts(updated);
    }
  };

  const handleUpdateProductName = (idx: number, newName: string) => {
    const updated = [...products];
    if (updated[idx]) {
      updated[idx].name = newName;
      setProducts(updated);
    }
  };

  const handleAddToCartSimulated = (product: TemplateProduct) => {
    setCartNotification(product.name);
    setTimeout(() => setCartNotification(null), 2500);
  };

  // Preset Remixes that instantly modify colors, gradients, fonts, and borders at once
  const handleApplyRemixPreset = (preset: string) => {
    switch (preset) {
      case 'sub_zero':
        setDisplayFont('Outfit');
        setBodyFont('Inter');
        setUseGradient(true);
        setGradientAngle(180);
        setGradientColorStart('#E0F2FE'); // light sky blue
        setGradientColorEnd('#FAFDFE');
        setBgColor('#E0F2FE');
        setTextColor('#0369A1'); // slate blue text
        setAccentColor('#0284C7'); // celestial blue accent
        setBorderRadiusStyle('lg');
        setPaddingScale('p-6');
        setBorderWeightStyle('border-0');
        setPreviewStyle('warm_scandinavian');
        break;
      case 'neon_brutalist':
        setDisplayFont('Syne');
        setBodyFont('JetBrains Mono');
        setUseGradient(true);
        setGradientAngle(135);
        setGradientColorStart('#0B0C0E');
        setGradientColorEnd('#1a1b1e');
        setBgColor('#0B0C0E');
        setTextColor('#F5F5F5');
        setAccentColor('#FF3E00'); // blazing hot orange red
        setBorderRadiusStyle('none');
        setPaddingScale('p-4');
        setBorderWeightStyle('border-2');
        setPreviewStyle('brutalist_copenhagen');
        break;
      case 'tokyo_moss':
        setDisplayFont('Space Grotesk');
        setBodyFont('Fira Code');
        setUseGradient(true);
        setGradientAngle(45);
        setGradientColorStart('#111317');
        setGradientColorEnd('#222630');
        setBgColor('#111317');
        setTextColor('#E6E8EC');
        setAccentColor('#CCFF00'); // glowing radioactive lime-green
        setBorderRadiusStyle('sm');
        setPaddingScale('p-2');
        setBorderWeightStyle('border');
        setPreviewStyle('brutalist_copenhagen');
        break;
      case 'sepia_copper':
        setDisplayFont('Cinzel');
        setBodyFont('DM Sans');
        setUseGradient(true);
        setGradientAngle(135);
        setGradientColorStart('#FAF4EB');
        setGradientColorEnd('#EADCC6');
        setBgColor('#FAF4EB');
        setTextColor('#4A3525');
        setAccentColor('#C87D55'); // smooth aged copper orange
        setBorderRadiusStyle('md');
        setPaddingScale('p-4');
        setBorderWeightStyle('border');
        setPreviewStyle('warm_scandinavian');
        break;
      case 'slow_oak':
      default:
        setDisplayFont('Playfair Display');
        setBodyFont('Inter');
        setUseGradient(false);
        setBgColor('#FAF8F5');
        setTextColor('#2C2A27');
        setAccentColor('#c5a880');
        setBorderRadiusStyle('none');
        setPaddingScale('p-4');
        setBorderWeightStyle('border');
        setPreviewStyle('warm_scandinavian');
        break;
    }
  };

  const getComputedGradientCSS = () => {
    return useGradient ? `linear-gradient(${gradientAngle}deg, ${gradientColorStart}, ${gradientColorEnd})` : "";
  };

  const handleCopyReactCode = () => {
    const componentCodeSnippet = `
// ==========================================
// Compiled Design System / React Tailwind Component
// Custom Presets Remix Applied // Dynamic Fonts & Gradients
// Style Alignment: ${previewStyle === 'warm_scandinavian' ? 'Warm Scandinavian Serif' : 'Brutalist Copenhagen Monospace'}
// ==========================================

import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Check } from 'lucide-react';

export default function CustomRemixedShowroom() {
  const [cartCount, setCartCount] = useState(0);
  const brandName = "${brandName}";
  const tagline = "${tagline}";
  const philosophy = "${philosophy}";
  const bgColor = "${bgColor}";
  const textColor = "${textColor}";
  const accentColor = "${accentColor}";
  const gradientBg = "${getComputedGradientCSS()}";

  const products = ${JSON.stringify(products, null, 2)};

  return (
    <div 
      className="w-full min-h-screen transition-colors duration-500 overflow-hidden"
      style={{ 
        background: gradientBg || bgColor, 
        color: textColor,
        fontFamily: "${bodyFont}, sans-serif" 
      }}
    >
      {/* Dynamic Font Loader Link */}
      <link href="https://fonts.googleapis.com/css2?family=${displayFont.replace(/ /g, '+')}&family=${bodyFont.replace(/ /g, '+')}&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="border-b py-6 flex justify-between items-center bg-transparent max-w-7xl mx-auto px-6">
        <div>
          <span className="text-xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: "${displayFont}" }}>{brandName}</span>
          <span className="text-[10px] block font-sans tracking-[0.3em] uppercase opacity-60 mt-1">{tagline}</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 border text-xs" style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}" }}>
          <ShoppingBag className="w-4 h-4" />
          <span className="font-bold">BAG</span>
        </button>
      </header>

      {/* Philosophy Statement */}
      <section className="max-w-4xl mx-auto py-12 space-y-6 px-6">
        <div className="border p-6 italic font-light text-md text-center bg-white/5" style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}" }}>
          "\${philosophy}"
        </div>

        {/* Dynamic Shop Grid with individual Tailwind spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col justify-between p-4 bg-white/5 border border-stone-200/20"
              style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}" }}
            >
              <div className="space-y-4">
                <div className="relative aspect-[3/4] bg-neutral-900/60 overflow-hidden" style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '3px' : '6px'}" }}>
                  <img src={product.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={product.name} />
                </div>
                <div>
                  <span className="text-[10px] uppercase opacity-40 block">{product.category}</span>
                  <h3 className="text-sm font-bold uppercase mt-1" style={{ fontFamily: "${displayFont}" }}>{product.name}</h3>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-200/10">
                <span className="text-sm font-medium">{product.price}</span>
                <button 
                  onClick={() => setCartCount(prev => prev + 1)}
                  className="px-3 py-1.5 bg-black/8 w-full block text-white bg-[#111] text-xs font-bold uppercase hover:opacity-80 rounded-sm"
                >
                  ADD NODE
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`;
    navigator.clipboard.writeText(componentCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentJSONSpec = {
    blueprint_id: template.id,
    platform_compatibility: template.platform,
    category: template.category,
    active_layout_engine: previewStyle,
    branding: {
      brandName,
      tagline,
      philosophy
    },
    styling_tokens: {
      fonts: {
        display_font: displayFont,
        body_font: bodyFont
      },
      gradient: {
        enabled: useGradient,
        angle: gradientAngle,
        color_start: gradientColorStart,
        color_end: gradientColorEnd
      },
      colors: {
        bg_flat_hex: bgColor,
        text_hex: textColor,
        accent_hex: accentColor
      },
      tailwind_individual_rules: {
        padding_density: paddingScale,
        border_radius: borderRadiusStyle,
        border_thickness: borderWeightStyle
      }
    },
    catalog_nodes: products.map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description
    }))
  };

  return (
    <div className="w-full min-h-screen bg-[#ecebe6] text-stone-900 flex flex-col">
      {/* Top Controller Ribbon */}
      <div className="bg-[#1A1A1A] text-[#F5F5F5] py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-800 select-none">
        
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="text-xs font-mono bg-zinc-800 text-stone-300 hover:text-white px-3 py-2 border border-zinc-700 transition cursor-pointer"
          >
            ← Gallery
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-zinc-800 text-amber-400 px-2.5 py-0.5 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider">
                Remix Sandbox Compiler
              </span>
              <span className="text-xs text-zinc-500 font-mono text-[9px]">ID: {template.id}</span>
            </div>
          </div>
        </div>

        {/* Workspace views tabs */}
        <div className="flex space-x-1 border border-zinc-800 p-0.5 bg-black/30 rounded-xs">
          <button 
            onClick={() => setActiveWorkspaceTab('SANDBOX')}
            className={`px-4 py-1.5 uppercase font-mono text-[10px] tracking-widest transition-all cursor-pointer ${activeWorkspaceTab === 'SANDBOX' ? 'bg-zinc-800 text-amber-300 font-bold' : 'text-zinc-400 hover:text-stone-100'}`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            Interactive iFrame Preview
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('BLUEPRINT')}
            className={`px-4 py-1.5 uppercase font-mono text-[10px] tracking-widest transition-all cursor-pointer ${activeWorkspaceTab === 'BLUEPRINT' ? 'bg-zinc-800 text-amber-300 font-bold' : 'text-zinc-400 hover:text-stone-100'}`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            Theme Blueprint JSON
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('CODE')}
            className={`px-4 py-1.5 uppercase font-mono text-[10px] tracking-widest transition-all cursor-pointer ${activeWorkspaceTab === 'CODE' ? 'bg-zinc-800 text-amber-300 font-bold' : 'text-zinc-400 hover:text-stone-100'}`}
          >
            <Code className="w-3.5 h-3.5 inline mr-1" />
            Export Code
          </button>
        </div>

        {/* Run AI variant button */}
        <button 
          onClick={() => onLaunchAIGenerate(`An elegant variant of template ${template.name}: ${template.tagline} featuring display font ${displayFont} with a dynamic background gradient`, previewStyle)}
          className="bg-amber-400 text-stone-950 hover:bg-amber-300 transition px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Adapt With Gemini AI
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="flex-1 max-w-8xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Live Tweak Controller Panel with Targeted Tabs */}
        <div className="lg:col-span-4 bg-white shadow-xs border border-stone-200 overflow-hidden">
          <div className="bg-stone-50 border-b p-4 flex justify-between items-center">
            <h2 className="text-xs uppercase font-bold tracking-widest text-stone-600 flex items-center gap-1.5 select-none font-mono">
              <Sliders className="w-4 h-4 text-amber-500" />
              BluePrint customizer
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 select-none">({template.style.toUpperCase()})</span>
          </div>

          {/* Secondary Sub tabs inside customizer to divide configuration */}
          <div className="grid grid-cols-5 border-b border-stone-200 text-center select-none bg-stone-50/50">
            <button 
              onClick={() => setActiveCustomizerTab('REMIX')}
              className={`py-2 text-[10px] font-mono uppercase font-bold border-r last:border-r-0 tracking-tighter cursor-pointer ${activeCustomizerTab === 'REMIX' ? 'bg-white text-stone-900 border-b-2 border-b-amber-500' : 'text-stone-400 hover:text-stone-600 bg-stone-50/80'}`}
              title="Click for presets"
            >
              <Shuffle className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Remix
            </button>
            <button 
              onClick={() => setActiveCustomizerTab('BRANDING')}
              className={`py-2 text-[10px] font-mono uppercase font-bold border-r last:border-r-0 tracking-tighter cursor-pointer ${activeCustomizerTab === 'BRANDING' ? 'bg-white text-stone-900 border-b-2 border-b-amber-500' : 'text-stone-400 hover:text-stone-600 bg-stone-50/80'}`}
            >
              <Settings className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Brand
            </button>
            <button 
              onClick={() => setActiveCustomizerTab('COLORS')}
              className={`py-2 text-[10px] font-mono uppercase font-bold border-r last:border-r-0 tracking-tighter cursor-pointer ${activeCustomizerTab === 'COLORS' ? 'bg-white text-stone-900 border-b-2 border-b-amber-500' : 'text-stone-400 hover:text-stone-600 bg-stone-50/80'}`}
            >
              <Palette className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Color
            </button>
            <button 
              onClick={() => setActiveCustomizerTab('TYPOGRAPHY')}
              className={`py-2 text-[10px] font-mono uppercase font-bold border-r last:border-r-0 tracking-tighter cursor-pointer ${activeCustomizerTab === 'TYPOGRAPHY' ? 'bg-white text-stone-900 border-b-2 border-b-amber-500' : 'text-stone-400 hover:text-stone-600 bg-stone-50/80'}`}
            >
              <Type className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Fonts
            </button>
            <button 
              onClick={() => setActiveCustomizerTab('CATALOG')}
              className={`py-2 text-[10px] font-mono uppercase font-bold border-r last:border-r-0 tracking-tighter cursor-pointer ${activeCustomizerTab === 'CATALOG' ? 'bg-white text-stone-900 border-b-2 border-b-amber-500' : 'text-stone-400 hover:text-stone-600 bg-stone-50/80'}`}
            >
              <Grid className="w-3.5 h-3.5 mx-auto mb-0.5" />
              Catalog
            </button>
          </div>

          <div className="p-5 space-y-5 text-stone-800">

            {/* TAB 1: ONE CLICK REMIX DESIGNER */}
            {activeCustomizerTab === 'REMIX' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#9D8470] mb-1 select-none">
                    // Designer Presets
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                    Remaster and blend completely different Scandinavian style schools instantly with single clicks.
                  </p>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => handleApplyRemixPreset('sub_zero')}
                    className="w-full text-left p-3 border border-sky-200 bg-sky-50/80 hover:bg-sky-100 transition rounded-md flex justify-between items-center cursor-pointer text-stone-800"
                  >
                    <div>
                      <span className="block text-xs font-bold text-sky-900">Sub-Zero Helsinki</span>
                      <span className="block text-[10px] text-sky-700 font-light mt-0.5">Soft Sky Gradient / Outfit Serif Style</span>
                    </div>
                    <span className="text-[10px] font-mono bg-sky-200 text-sky-800 py-0.5 px-2 rounded-xs font-bold">REMIX PRESET</span>
                  </button>

                  <button 
                    onClick={() => handleApplyRemixPreset('neon_brutalist')}
                    className="w-full text-left p-3 border border-orange-200 bg-orange-50/80 hover:bg-orange-100 transition flex justify-between items-center cursor-pointer text-stone-850"
                  >
                    <div>
                      <span className="block text-xs font-bold text-orange-950">Space Brutalist</span>
                      <span className="block text-[10px] text-orange-850 font-light mt-0.5">Heavy Outlines / JetBrains Mono</span>
                    </div>
                    <span className="text-[10px] font-mono bg-orange-200 text-orange-900 py-0.5 px-2 rounded-xs font-bold">REMIX PRESET</span>
                  </button>

                  <button 
                    onClick={() => handleApplyRemixPreset('tokyo_moss')}
                    className="w-full text-left p-3 border border-lime-300 bg-lime-50/50 hover:bg-lime-100 transition rounded-md flex justify-between items-center cursor-pointer text-stone-800"
                  >
                    <div>
                      <span className="block text-xs font-bold text-stone-900">Tokyo Electro-Moss</span>
                      <span className="block text-[10px] text-stone-600 font-light mt-0.5">Glow Lime accents / Fira Code</span>
                    </div>
                    <span className="text-[10px] font-mono bg-lime-200 text-lime-900 py-0.5 px-2 rounded-xs font-bold">REMIX PRESET</span>
                  </button>

                  <button 
                    onClick={() => handleApplyRemixPreset('sepia_copper')}
                    className="w-full text-left p-3 border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition rounded-md flex justify-between items-center cursor-pointer text-[#4A3228]"
                  >
                    <div>
                      <span className="block text-xs font-bold text-[#5c3e35]">Sepia Copper Retro</span>
                      <span className="block text-[10px] text-amber-900 font-light mt-0.5">Warm Sand Gradients / Cinzel Style</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-200 text-amber-900 py-0.5 px-2 rounded-xs font-bold">REMIX PRESET</span>
                  </button>

                  <button 
                    onClick={() => handleApplyRemixPreset('slow_oak')}
                    className="w-full text-left p-3 border border-stone-200 bg-stone-50 hover:bg-stone-100 transition rounded-md flex justify-between items-center cursor-pointer text-stone-800"
                  >
                    <div>
                      <span className="block text-xs font-bold text-stone-800">Oslo Slow Oak</span>
                      <span className="block text-[10px] text-stone-500 font-light mt-0.5">Pure Minimalist Linen / Playfair Serif</span>
                    </div>
                    <span className="text-[10px] font-mono bg-stone-200 text-stone-800 py-0.5 px-2 rounded-xs font-bold">REMIX PRESET</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: BRANDING COPY & CONFIGURATION */}
            {activeCustomizerTab === 'BRANDING' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Brand Name Signature</label>
                  <input 
                    type="text" 
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 bg-stone-50 text-stone-800 focus:ring-1 focus:ring-stone-800 font-medium text-xs rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Copenhagen Tagline</label>
                  <input 
                    type="text" 
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 bg-stone-50 text-stone-800 focus:ring-1 focus:ring-stone-800 text-xs rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Philosophy Manifesto Statement</label>
                  <textarea 
                    value={philosophy}
                    onChange={(e) => setPhilosophy(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 border border-stone-300 bg-stone-50 text-stone-800 text-xs leading-relaxed focus:ring-1 focus:ring-stone-800 rounded-sm"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: COLORS & ADVANCED GRADIENT BLOCKS */}
            {activeCustomizerTab === 'COLORS' && (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Gradient Toggle */}
                <div className="pb-3 border-b border-stone-100">
                  <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-sm border">
                    <span className="text-[10px] uppercase font-extrabold text-stone-700 flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-amber-500" />
                      Use Gradient Blocks
                    </span>
                    <input 
                      type="checkbox" 
                      checked={useGradient}
                      onChange={(e) => setUseGradient(e.target.checked)}
                      className="w-4 h-4 text-amber-500 border-zinc-305 focus:ring-stone-800 rounded-xs cursor-pointer"
                    />
                  </div>
                </div>

                {/* If standard solid bg is selected */}
                {!useGradient ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500">Solid canvas Background</span>
                      <div className="flex items-center border p-1 rounded-sm border-stone-300 gap-1.5 bg-stone-50">
                        <input 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-5 h-5 rounded-sm p-0 cursor-pointer border-0 bg-transparent" 
                        />
                        <input 
                          type="text" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full text-[10px] text-center p-0 font-mono tracking-wider focus:outline-hidden uppercase text-stone-705" 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Gradient Block Options
                  <div className="space-y-4 bg-stone-50 p-3 rounded-md border border-stone-200">
                    <span className="block text-[10px] uppercase font-bold text-[#9D8470] border-b pb-1 select-none">// Linear Gradient builder</span>
                    
                    {/* Color Start */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-stone-500 uppercase font-bold">Gradient Color Start</span>
                      <div className="flex items-center border p-1 rounded-sm border-stone-300 bg-white gap-1.5">
                        <input 
                          type="color" 
                          value={gradientColorStart} 
                          onChange={(e) => setGradientColorStart(e.target.value)}
                          className="w-5 h-5 rounded-xs p-0 cursor-pointer border-0 bg-transparent" 
                        />
                        <input 
                          type="text" 
                          value={gradientColorStart} 
                          onChange={(e) => setGradientColorStart(e.target.value)}
                          className="w-full text-[9px] text-center p-0 font-mono focus:outline-hidden uppercase text-stone-705" 
                        />
                      </div>
                    </div>

                    {/* Color End */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-stone-500 uppercase font-bold font-mono">Gradient Color End</span>
                      <div className="flex items-center border p-1 rounded-sm border-stone-300 bg-white gap-1.5">
                        <input 
                          type="color" 
                          value={gradientColorEnd} 
                          onChange={(e) => setGradientColorEnd(e.target.value)}
                          className="w-5 h-5 rounded-xs p-0 cursor-pointer border-0 bg-transparent" 
                        />
                        <input 
                          type="text" 
                          value={gradientColorEnd} 
                          onChange={(e) => setGradientColorEnd(e.target.value)}
                          className="w-full text-[9px] text-center p-0 font-mono focus:outline-hidden uppercase text-stone-705" 
                        />
                      </div>
                    </div>

                    {/* Angle slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] uppercase font-bold text-stone-500">
                        <span>Gradient Direction</span>
                        <span>{gradientAngle}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="360" 
                        value={gradientAngle}
                        onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                        className="w-full text-stone-850 accent-amber-500 cursor-pointer bg-stone-205 h-1"
                      />
                    </div>
                  </div>
                )}

                {/* Always show Ink text color and Accent Color */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="space-y-1">
                    <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500">Ink Text Tint</span>
                    <div className="flex items-center border p-1 rounded-sm border-stone-300 gap-1.5 bg-stone-50">
                      <input 
                        type="color" 
                        value={textColor} 
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-5 h-5 rounded-sm p-0 cursor-pointer border-0 bg-transparent" 
                      />
                      <input 
                        type="text" 
                        value={textColor} 
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full text-[10px] text-center p-0 font-mono focus:outline-hidden uppercase text-stone-705" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 font-mono">Accent Paint</span>
                    <div className="flex items-center border p-1 rounded-sm border-stone-300 gap-1.5 bg-stone-50">
                      <input 
                        type="color" 
                        value={accentColor} 
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-5 h-5 rounded-sm p-0 cursor-pointer border-0 bg-transparent" 
                      />
                      <input 
                        type="text" 
                        value={accentColor} 
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-full text-[10px] text-center p-0 font-mono focus:outline-hidden uppercase text-stone-705" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TYPOGRAPHY (FONTS) SELECTION */}
            {activeCustomizerTab === 'TYPOGRAPHY' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold text-stone-500 mb-2 select-none">// Dynamic Font selectors</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
                    These web fonts are dynamically requested and rendered live inside the preview frame.
                  </p>
                </div>

                {/* Display Font */}
                <div className="space-y-1.5">
                  <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 block">Display Headings Font</span>
                  <select 
                    value={displayFont}
                    onChange={(e) => setDisplayFont(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-stone-50 text-stone-800 text-xs rounded-sm focus:ring-1 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech Geometric)</option>
                    <option value="Syne">Syne (Artistic Display Black)</option>
                    <option value="Cinzel">Cinzel (Aethel Classic)</option>
                    <option value="Outfit">Outfit (Clean Sans-Serif)</option>
                    <option value="Cardo">Cardo (Classic Editorial Serif)</option>
                  </select>
                </div>

                {/* Body Font */}
                <div className="space-y-1.5">
                  <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 block">Body Copy Paragraph Font</span>
                  <select 
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full p-2 border border-stone-300 bg-stone-50 text-stone-800 text-xs rounded-sm focus:ring-1 focus:outline-hidden font-mono cursor-pointer"
                  >
                    <option value="Inter">Inter (Swiss Modern Sans)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Sleek Tech Code)</option>
                    <option value="Fira Code">Fira Code (Geometric Code)</option>
                    <option value="DM Sans">DM Sans (Compact Sans-Serif)</option>
                    <option value="Heebo">Heebo (Tall Minimalist Sans)</option>
                  </select>
                </div>

                {/* Card preview font demo block */}
                <div className="p-3 bg-stone-50 border border-stone-200 text-stone-705 space-y-1 select-none rounded-sm">
                  <span className="text-[9px] uppercase font-bold tracking-widest block opacity-50 mb-1 select-none">Live Font Pairing demo</span>
                  <span className="block text-sm font-bold" style={{ fontFamily: displayFont }}>{brandName}</span>
                  <span className="block text-xs leading-relaxed opacity-75 animate-pulse" style={{ fontFamily: bodyFont }}>{tagline.substring(0, 48)}...</span>
                </div>
              </div>
            )}

            {/* TAB 5: LIVE CATALOG CHANGER */}
            {activeCustomizerTab === 'CATALOG' && (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 animate-fade-in">
                <span className="text-[10px] uppercase font-extrabold text-stone-500 block select-none mb-2">// Live Catalog Editor</span>
                {products.map((p, pIdx) => (
                  <div key={p.id} className="p-3 bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-bold select-none font-mono">
                      <span>NODE {pIdx + 1} ({p.category.toUpperCase()})</span>
                      <span>[{p.number || '0' + (pIdx + 1)}]</span>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={p.name}
                        onChange={(e) => handleUpdateProductName(pIdx, e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={p.price}
                        onChange={(e) => handleUpdateProductPrice(pIdx, e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Panel Custom Styles Overrides (Always shown) */}
            <div className="border-t border-stone-200/80 pt-4 space-y-4">
              <span className="text-[10px] uppercase font-extrabold text-stone-500 block tracking-widest">// Layout & Outlines Customizer</span>
              
              {/* layout engine switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setPreviewStyle('warm_scandinavian')}
                  className={`py-2 text-[10px] font-mono border text-center font-bold transition-all cursor-pointer ${previewStyle === 'warm_scandinavian' ? 'bg-[#2C2A27] text-white border-[#2C2A27]' : 'bg-transparent text-stone-500 border-stone-200 hover:text-stone-700'}`}
                >
                  Theme 42 (Warm)
                </button>
                <button 
                  onClick={() => setPreviewStyle('brutalist_copenhagen')}
                  className={`py-2 text-[10px] font-mono border text-center font-bold transition-all cursor-pointer ${previewStyle === 'brutalist_copenhagen' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-transparent text-stone-500 border-stone-200 hover:text-stone-700'}`}
                >
                  Theme 46 (Brutal)
                </button>
              </div>

              {/* Grid corners style */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 block">Border Corner Radius</span>
                <select 
                  value={borderRadiusStyle}
                  onChange={(e) => setBorderRadiusStyle(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 bg-stone-50 text-stone-800 text-xs rounded-sm focus:outline-hidden cursor-pointer"
                >
                  <option value="none">Square (0px)</option>
                  <option value="sm">Subtle (4px)</option>
                  <option value="md">Rounded (8px)</option>
                  <option value="lg">Spacious (12px)</option>
                  <option value="full">Pill / Circular</option>
                </select>
              </div>

              {/* Grid outline weights */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 block">Card Border Weight</span>
                <select 
                  value={borderWeightStyle}
                  onChange={(e) => setBorderWeightStyle(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 bg-stone-50 text-stone-800 text-xs rounded-sm focus:outline-hidden cursor-pointer"
                >
                  <option value="border-0">No Border (0px)</option>
                  <option value="border">Thin (1px)</option>
                  <option value="border-2">Thick (2px)</option>
                  <option value="border-4">Heavy (4px)</option>
                </select>
              </div>

              {/* Spacing / Padding Scales */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 block">Padding Density</span>
                <select 
                  value={paddingScale}
                  onChange={(e) => setPaddingScale(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 bg-stone-50 text-stone-800 text-xs rounded-sm focus:outline-hidden cursor-pointer"
                >
                  <option value="p-2">Dense / Compact (8px)</option>
                  <option value="p-4">Standard / Balanced (16px)</option>
                  <option value="p-6">Generous / Loose (24px)</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Tabbed Dynamic Canvas Area */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px] border border-stone-300 bg-white shadow-xs">
          
          {/* Workspace Content Display */}
          <div className="flex-1 overflow-auto bg-stone-50 relative">
            
            {activeWorkspaceTab === 'SANDBOX' && (
              <div className="h-full">
                {/* Dynamic toast notification */}
                {cartNotification && (
                  <div className="absolute top-4 right-4 z-50 bg-[#1A1A1A] text-amber-300 px-5 py-3 border border-amber-400 font-mono text-[10px] flex items-center gap-2 animate-slide-in">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>SYSTEM // RESERVED CODE NODE ADDED: {cartNotification}</span>
                  </div>
                )}

                {/* iFrame mock identifier header */}
                <div className="bg-stone-100 py-2.5 border-b px-4 text-[9px] text-stone-500 flex justify-between select-none">
                  <span className="flex items-center gap-1.5 font-sans font-bold text-stone-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    LIVE COMPILE PREVIEW FRAME [{template.platform.toUpperCase()}]
                  </span>
                  <span className="font-mono text-stone-400 text-[8px] tracking-widest">(55.6761° N // HEIGHT RESPONSIVE)</span>
                </div>

                {/* Inject Custom Style definitions for custom font sizing & animation overrides */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .font-custom-display {
                    font-family: "${displayFont}", sans-serif !important;
                  }
                  .font-custom-body {
                    font-family: "${bodyFont}", sans-serif !important;
                  }
                `}} />

                {previewStyle === 'warm_scandinavian' ? (
                  <Theme42Preview 
                    brandName={brandName}
                    tagline={tagline}
                    philosophy={philosophy}
                    bgColor={bgColor}
                    textColor={textColor}
                    accentColor={accentColor}
                    products={products}
                    onAddToCart={handleAddToCartSimulated}
                    displayFont={displayFont}
                    bodyFont={bodyFont}
                    gradientBg={getComputedGradientCSS()}
                    paddingScale={paddingScale}
                    borderRadiusStyle={borderRadiusStyle}
                    borderWeightStyle={borderWeightStyle}
                  />
                ) : (
                  <Theme46Preview 
                    brandName={brandName}
                    tagline={tagline}
                    philosophy={philosophy}
                    bgColor={bgColor}
                    textColor={textColor}
                    accentColor={accentColor}
                    products={products}
                    onAddToCart={handleAddToCartSimulated}
                    displayFont={displayFont}
                    bodyFont={bodyFont}
                    gradientBg={getComputedGradientCSS()}
                    paddingScale={paddingScale}
                    borderRadiusStyle={borderRadiusStyle}
                    borderWeightStyle={borderWeightStyle}
                  />
                )}
              </div>
            )}

            {activeWorkspaceTab === 'BLUEPRINT' && (
              <div className="p-6 md:p-8 bg-zinc-950 text-[#8BC34A] font-mono text-[11px] leading-relaxed select-text h-full overflow-auto">
                <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-zinc-500 select-none">
                  <span>DESIGN_TOKEN_MARKUP_VARIABLES_BLUEPRINT</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(currentJSONSpec, null, 2));
                      alert("Theme Blueprint tags saved to clipboard!");
                    }}
                    className="text-[9px] bg-zinc-850 text-white border border-zinc-700 px-3 py-1 hover:bg-zinc-700 transition cursor-pointer"
                  >
                    [COPY BLUEPRINT JSON]
                  </button>
                </div>
                <pre>{JSON.stringify(currentJSONSpec, null, 2)}</pre>
              </div>
            )}

            {activeWorkspaceTab === 'CODE' && (
              <div className="p-6 md:p-8 bg-zinc-950 text-emerald-400 font-mono text-[11px] leading-relaxed select-text h-full overflow-auto">
                <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-zinc-500 select-none">
                  <span>COPENHAGEN_SOURCE_COMPILER (REACT + TAILWIND CSS)</span>
                  <button 
                    onClick={handleCopyReactCode}
                    className="text-[9px] bg-zinc-850 text-white border border-zinc-700 px-3 py-1.5 hover:bg-zinc-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-305" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED SUCCESSFULLY' : '[COPY CODE MODULE]'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap">{`import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Check } from 'lucide-react';

export default function Storefront() {
  const [cartCount, setCartCount] = useState(0);
  const brandName = "${brandName}";
  const tagline = "${tagline}";
  const philosophy = "${philosophy}";
  const bgColor = "${bgColor}";
  const textColor = "${textColor}";
  const accentColor = "${accentColor}";
  const gradientBg = "${getComputedGradientCSS()}";

  const products = ${JSON.stringify(products, null, 2)};

  return (
    <div 
      className="w-full min-h-screen p-8 text-neutral-800 space-y-12 transition-all duration-300" 
      style={{ 
        background: gradientBg || bgColor, 
        color: textColor,
        fontFamily: "${bodyFont}, sans-serif"
      }}
    >
      <header className="border-b border-stone-200/50 pb-6 mb-12 flex justify-between items-center bg-transparent">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-inherit" style={{ fontFamily: "${displayFont}" }}>{brandName}</h1>
          <p className="text-[10px] tracking-widest opacity-60 uppercase mt-1">{tagline}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        <div className="border border-stone-200/50 p-6 italic font-light text-md opacity-90 max-w-2xl">
          "\${philosophy}"
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="border border-stone-200/20 p-4 flex flex-col justify-between h-96 bg-white/5"
              style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}" }}
            >
              <div className="aspect-square bg-neutral-205" style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '3px' : '6px'}" }}>
                <img src={p.image} className="w-full h-full object-cover" />
              </div>
              <div className="pt-4">
                <h3 className="font-bold uppercase tracking-wider text-xs" style={{ fontFamily: "${displayFont}" }}>{p.name}</h3>
                <p className="text-[11px] opacity-70 mt-2 line-clamp-3">{p.description}</p>
              </div>
              <div className="flex justify-between items-center border-t pt-3 mt-3">
                <span className="font-bold">{p.price}</span>
                <button 
                  onClick={() => setCartCount(prev => prev + 1)}
                  className="px-3 py-1 font-bold border hover:bg-black hover:text-white transition-colors text-[10px] tracking-[0.1em]"
                >
                  BUY NODE
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}`}</pre>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
