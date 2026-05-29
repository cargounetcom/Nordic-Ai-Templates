/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, Heart, Check, Terminal, Shield, ArrowUpRight, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { TemplateProduct } from '../types';

interface Theme46PreviewProps {
  brandName?: string;
  tagline?: string;
  philosophy?: string;
  accentColor?: string; // hex
  bgColor?: string; // hex
  textColor?: string; // hex
  products?: TemplateProduct[];
  onAddToCart?: (product: TemplateProduct) => void;
  onImageUpload?: (index: number, file: File) => void;
  isLoading?: boolean;
  displayFont?: string;
  bodyFont?: string;
  gradientBg?: string;
  paddingScale?: 'p-2' | 'p-4' | 'p-6';
  borderRadiusStyle?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderWeightStyle?: 'border-0' | 'border' | 'border-2' | 'border-4';
  countryName?: string;
  countryCode?: string;
  languageCode?: string;
  currencySymbol?: string;
  showTailwindFavicon?: boolean;
}

// Fixed beautiful sample products for Theme 46 brutalist copenhagen homeware if AI isn't loaded yet
const defaultProducts: TemplateProduct[] = [
  {
    id: "brutal-01",
    name: "CPH_01_RAW_GRID_POSTER",
    category: "WALL_PRINT",
    price: "450 DKK",
    image: "/src/assets/images/brutal_poster_1779707411527.png",
    description: "Industrial screenprint on heavy, unrefined grey compound paper. Features structured coordinate vectors modeling architectural cross-sections from Copenhagen Harbour.",
    badge: "(RECOMMENDED)",
    number: "01"
  },
  {
    id: "brutal-02",
    name: "CPH_02_MONOLITH_PLINTH",
    category: "FURNITURE",
    price: "3,200 DKK",
    image: "/src/assets/images/scandi_chair_1779707393766.png",
    description: "Cast cement plinth polished to an ultra-flat finish. Rigid industrial proportions meant to hold artwork or act as a raw side table. 12.5 kg weight load.",
    badge: "(LAST_STOCK)",
    number: "02"
  },
  {
    id: "brutal-03",
    name: "CPH_03_STONE_CYLINDER",
    category: "CERAMIC",
    price: "680 DKK",
    image: "/src/assets/images/ceramic_vase_1779707431018.png",
    description: "Raw hollowed granite cylinder meant as a pencil holder or miniature flower pot. Left unpolished on the exterior to preserve cutting marks.",
    badge: "(NEW_IN)",
    number: "03"
  }
];

export default function Theme46Preview({
  brandName = "COPENHAGEN_TECHNE",
  tagline = "RAW INDUSTRIELLE DESIGN LAB",
  philosophy = "OBJECT_CATALOG_M.46 // WE REJECT COSY DESIGN. WE EMBRACE ARCHITECTURAL RIGIDITY, HEAVY COMPOUND CEMENT, BULLET-PROOF SPECIFICATIONS, AND BOLD CO Copenhagen GEOMETRIC CONTRASTS.",
  accentColor = "#FF5500", // Bright neon orange accent common in brutalism
  bgColor = "#121212",
  textColor = "#F5F5F5",
  products = defaultProducts,
  onAddToCart,
  onImageUpload,
  isLoading = false,
  displayFont = "Space Grotesk",
  bodyFont = "JetBrains Mono",
  gradientBg = "",
  paddingScale = "p-4",
  borderRadiusStyle = "none",
  borderWeightStyle = "border",
  countryName = "Denmark",
  countryCode = "DK",
  languageCode = "da-DK",
  currencySymbol = "kr.",
  showTailwindFavicon = true
}: Theme46PreviewProps) {
  const [selectedProduct, setSelectedProduct] = useState<TemplateProduct | null>(null);
  const [lovedProducts, setLovedProducts] = useState<Record<string, boolean>>({});
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'GRID' | 'MANIFESTO'>('GRID');
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const formatLocalizedPrice = (priceStr: string) => {
    if (!priceStr) return "";
    const numbers = priceStr.replace(/[^0-9.,]/g, '');
    if (!numbers) return priceStr;
    if (currencySymbol === "kr." || currencySymbol === "kr") {
      return `${numbers} kr`;
    }
    return `${currencySymbol}${numbers}`;
  };

  const toggleLove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLovedProducts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerCart = (product: TemplateProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  return (
    <div 
      className="w-full min-h-screen transition-colors duration-500 text-xs tracking-wider"
      style={{ 
        background: gradientBg || bgColor, 
        color: textColor,
        fontFamily: bodyFont || 'JetBrains Mono, monospace'
      }}
    >
      {/* Mechanical Toast alerts */}
      {addedItemName && (
        <div 
          className="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 border-2" 
          style={{ backgroundColor: textColor, color: bgColor, borderColor: textColor }}
        >
          <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
          <span className="font-bold">SYSTEM // ITEM_ADDED: {addedItemName}</span>
        </div>
      )}

      {/* Top Banner Ticker */}
      <div 
        className="border-b py-2 px-6 flex justify-between items-center text-[10px] tracking-[0.25em]"
        style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}
      >
        <span>(SYS_COMPILER_V3 // LOCALE: {countryCode} / {languageCode.toUpperCase()})</span>
        <span className="animate-pulse font-bold" style={{ color: accentColor }}>● {countryName.toUpperCase()}_DISTRIBUTION_ONLINE_ACTIVE</span>
        <span className="hidden md:inline">({countryName.toUpperCase()} SHIPPING GATEWAY // {languageCode})</span>
      </div>

      {/* Primary Header Group */}
      <header 
        className="border-b px-6 py-10 md:px-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6"
        style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}
      >
        <div className="flex items-start gap-4">
          {showTailwindFavicon && (
            <div className="w-10 h-10 border-2 flex items-center justify-center relative bg-black/5" style={{ borderColor: accentColor }}>
              <Terminal className="w-5 h-5 text-inherit animate-pulse" style={{ color: accentColor }} />
              <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border bg-zinc-950 border-current text-[7px] font-bold flex items-center justify-center" style={{ color: accentColor, borderColor: accentColor }}>
                TW
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono">
              <span className="text-[10px] px-1.5 py-0.5 border font-bold" style={{ borderColor: accentColor, color: accentColor }}>SYS.46 // {countryCode}</span>
              <span className="opacity-40 text-[9px]">/ / EST.2026 / /</span>
            </div>
            <h1 
              className="text-3xl font-extrabold uppercase tracking-tight"
              style={{ fontFamily: displayFont || 'Space Grotesk, sans-serif' }}
            >
              {brandName}
            </h1>
            <p className="opacity-60 max-w-lg leading-relaxed">{tagline}</p>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex border">
          <button 
            onClick={() => setActiveTab('GRID')}
            className={`px-4 py-2 uppercase font-bold transition-colors ${activeTab === 'GRID' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900'}`}
          >
            [01] CATALOGUE
          </button>
          <button 
            onClick={() => setActiveTab('MANIFESTO')}
            className={`px-4 py-2 uppercase font-bold border-l transition-colors ${activeTab === 'MANIFESTO' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900'}`}
            style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}
          >
            [02] MANIFESTO
          </button>
        </div>
      </header>

      {/* Main Panel View */}
      {activeTab === 'MANIFESTO' ? (
        <section className="px-6 py-16 md:px-12 max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="border-l-4 pl-6 py-2 space-y-4" style={{ borderColor: accentColor }}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-400" style={{ fontFamily: displayFont || 'Space Grotesk, sans-serif' }}>--- WE REJECT SILENCE ---</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line opacity-90">
              {philosophy}
            </p>
          </div>

          <table className="w-full border-collapse border text-left" style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>
            <thead>
              <tr className="bg-zinc-900 border-b" style={{ borderBottomColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>
                <th className="p-3 border-r" style={{ borderRightColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>SPECIFICATION</th>
                <th className="p-3">VALUE CODE</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b" style={{ borderBottomColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>
                <td className="p-3 font-bold border-r" style={{ borderRightColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>GRID_LAYOUT</td>
                <td className="p-3">RIGID_CUBICAL_46</td>
              </tr>
              <tr className="border-b" style={{ borderBottomColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>
                <td className="p-3 font-bold border-r" style={{ borderRightColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>ACCENT_RGB</td>
                <td className="p-3 uppercase">{accentColor}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold border-r" style={{ borderRightColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>COMPLIANCE</td>
                <td className="p-3">COPENHAGEN_MINISTERIAL_COMPLIANT</td>
              </tr>
            </tbody>
          </table>
        </section>
      ) : (
        <div className="w-full">
          {/* Main Hero grid layout splits the screen */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b overflow-hidden" style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}>
            
            {/* Visual Column */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
              className="md:col-span-7 bg-zinc-900 border-r relative p-2 aspect-video md:aspect-auto" 
              style={{ 
                borderRightColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)`,
                borderRadius: borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : borderRadiusStyle === 'md' ? '8px' : borderRadiusStyle === 'lg' ? '12px' : '24px'
              }}
            >
              <img 
                src={products[0]?.image || defaultProducts[0].image}
                alt="Brutalist centerpiece catalog photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-none grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-6 right-6 px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest border border-zinc-700 uppercase">
                (HERO_FRAME_OP_ACTIVE)
              </div>
            </motion.div>

            {/* Spec Details Column */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
              className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between gap-8 bg-zinc-950"
            >
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">// ARCHITECTURE_MANIFEST</span>
                <h2 
                  className="text-xl font-black uppercase tracking-tight text-white"
                  style={{ fontFamily: displayFont || 'Space Grotesk, sans-serif' }}
                >
                  STARK OBJECTS // DESIGN SYSTEM 46
                </h2>
                <p className="opacity-70 leading-relaxed text-[11px] text-zinc-300">
                  Each template in compilation M.46 forces absolute vertical grid structures, stark contrasts, and modular layouts. Click individual cells below to review design variables, dimensions, and technical drawings.
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="opacity-50">MANUFACTURING_SOURCE:</span>
                  <span className="font-bold underline text-stone-300">COPENHAGEN_OUTPOST</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="opacity-50">DESIGNER_REFERENCE:</span>
                  <span className="font-bold">THEME_46_BRUTALIST</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Catalog Grid */}
          <section className="p-6 md:p-[5vh] max-w-7xl mx-auto space-y-[4vh]">
            <div className="flex justify-between items-end border-b-2 pb-4 border-zinc-800">
              <span className="font-extrabold uppercase tracking-widest" style={{ fontFamily: displayFont || 'Space Grotesk, sans-serif' }}>[GRID_MODE // ACTIVE]</span>
              <span className="opacity-40">{products.length} OBJECT_NODES RECORDED</span>
            </div>

            {/* Structured Table Cells */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 border bg-black/5" 
              style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}
            >
              {products.map((product, idx) => (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85, damping: 13 } }
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`group relative cursor-pointer flex flex-col justify-between hover:bg-zinc-900/40 transition-colors ${paddingScale} space-y-[3vh] ${borderWeightStyle}`}
                  style={{ 
                    borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` ,
                    borderRadius: borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : borderRadiusStyle === 'md' ? '8px' : borderRadiusStyle === 'lg' ? '12px' : '24px'
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[14px] font-bold text-zinc-500">[{product.number || `0${idx + 1}`}]</span>
                      {product.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 border border-zinc-700 bg-zinc-900" style={{ color: accentColor }}>
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div 
                      className="relative aspect-square bg-zinc-900 overflow-hidden border border-zinc-800"
                      style={{ borderRadius: borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '3px' : borderRadiusStyle === 'md' ? '6px' : borderRadiusStyle === 'lg' ? '10px' : '20px' }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIdx(idx);
                      }}
                      onDragLeave={() => setDragOverIdx(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverIdx(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file && onImageUpload) {
                          onImageUpload(idx, file);
                        }
                      }}
                    >
                      <motion.img 
                        initial={{ scale: 1.04, filter: 'grayscale(100%) opacity(0.6)' }}
                        whileInView={{ scale: 1, filter: 'grayscale(0%) opacity(1)' }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500"
                      />

                      {dragOverIdx === idx && (
                        <div className="absolute inset-0 bg-black/95 text-[#FF5500] flex flex-col items-center justify-center p-4 text-center z-30 animate-fade-in font-mono">
                          <Upload className="w-8 h-8 mb-2 stroke-1 animate-bounce" style={{ color: accentColor }} />
                          <span className="text-[10px] tracking-widest font-extrabold uppercase">[DROP_OBJECT_IMAGE_NODE]</span>
                          <span className="text-[8px] opacity-60 mt-1 max-w-[150px]">Instant replacement pipeline</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] opacity-40 uppercase tracking-widest font-mono">CATCODE: {product.category}</div>
                      <h3 
                        className="text-[13px] font-black tracking-tight uppercase group-hover:underline"
                        style={{ fontFamily: displayFont || 'Space Grotesk, sans-serif' }}
                      >
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-zinc-800/60 pt-4">
                    <span className="font-extrabold text-[14px]" style={{ color: accentColor }}>{formatLocalizedPrice(product.price)}</span>
                    <button 
                      onClick={(e) => triggerCart(product, e)}
                      className="px-3 py-1.5 border border-zinc-700 bg-zinc-950 font-bold hover:bg-white hover:text-black transition-colors"
                    >
                      (BUY_OBJECT_NODE)
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      )}

      {/* Mechanical Footer */}
      <footer 
        className="border-t px-6 py-12 md:px-12 text-[10px] text-stone-500 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ borderColor: `rgba(${textColor === '#F5F5F5' ? '255,255,255' : '0,0,0'}, 0.15)` }}
      >
        <span>(C) COPENHAGEN_TECHNE LAB INDEX 2026</span>
        <span>ALL SPECIFICATIONS ARE SUBJECT TO STRUCTURAL CHANGES</span>
        <span>SYSTEM REQS: MONOSPACE_FONT_DISPLAY_COMPATIBLE</span>
      </footer>

      {/* Brutalist Detail Drawer */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-zinc-950 text-white w-full max-w-xl border-2 border-zinc-700 p-8 shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outline Box Header */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">OBJECT_ID // [0{selectedProduct.number || '1'}]</span>
                <h3 className="text-lg font-black uppercase tracking-widest mt-1 text-zinc-100">{selectedProduct.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="px-2 py-1 border border-zinc-700 hover:bg-white hover:text-black font-bold transition-all"
              >
                [X] SHOWLESS
              </button>
            </div>

            {/* Product description and terminal output */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/3 aspect-square bg-zinc-900 border border-zinc-800 shrink-0">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold block">(DESCRIPTION_STATEMENT)</span>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {/* Technical Drawing Variables list */}
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 space-y-2 text-[10px]">
                <div className="flex items-center gap-2 font-bold mb-1 text-zinc-400 uppercase">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TECHNICAL DRAWING SPECS</span>
                </div>
                <div><span className="text-zinc-500">[DIMENSIONS]:</span> 450mm W × 680mm H × 420mm D</div>
                <div><span className="text-zinc-500">[MATERIAL_TOLERANCE]:</span> High grade concrete resin frame, powder galvanized iron welds (+/- 0.2mm)</div>
                <div><span className="text-zinc-500">[SAFETY_VERIFICATION]:</span> ISO_9001 certified, Nordic Craft Council Code 46</div>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-4">
              <button 
                onClick={(e) => toggleLove(selectedProduct.id, e)}
                className={`px-4 py-3 border font-bold flex items-center justify-center gap-2 transition-colors ${lovedProducts[selectedProduct.id] ? 'bg-zinc-800 text-white' : 'border-zinc-800 hover:bg-zinc-900 border-zinc-700'}`}
              >
                <Heart className={`w-3.5 h-3.5 ${lovedProducts[selectedProduct.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>HEART_ITEM_NODE</span>
              </button>
              
              <button 
                onClick={(e) => {
                  triggerCart(selectedProduct, e);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-3 text-center font-bold uppercase transition-colors text-black hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                (COMMIT_BAG_RESERVATION — {selectedProduct.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
