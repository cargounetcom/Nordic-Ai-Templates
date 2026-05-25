/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, X, Check, ArrowRight } from 'lucide-react';
import { TemplateProduct } from '../types';

interface Theme42PreviewProps {
  brandName?: string;
  tagline?: string;
  philosophy?: string;
  accentColor?: string; // hex
  bgColor?: string; // hex
  textColor?: string; // hex
  products?: TemplateProduct[];
  onAddToCart?: (product: TemplateProduct) => void;
  isLoading?: boolean;
  displayFont?: string;
  bodyFont?: string;
  gradientBg?: string;
  paddingScale?: 'p-2' | 'p-4' | 'p-6';
  borderRadiusStyle?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderWeightStyle?: 'border-0' | 'border' | 'border-2' | 'border-4';
}

// Fixed beautiful sample products for Theme 42 homeware demo if AI results aren't loaded yet
const defaultProducts: TemplateProduct[] = [
  {
    id: "scandi-01",
    name: "01. ARCH Lounge Chair",
    category: "Furniture / Sitting",
    price: "€1,280",
    image: "/src/assets/images/scandi_chair_1779707393766.png",
    description: "An iconic silhouette crafted in light solid oak with natural oiled linen webs. Designed to evoke organic sculptural forms of mid-century Scandinavian architecture.",
    badge: "COLLECTION 42"
  },
  {
    id: "scandi-02",
    name: "02. KÄLLA Stoneware Vessel",
    category: "Clay / Homeware",
    price: "€185",
    image: "/src/assets/images/ceramic_vase_1779707431018.png",
    description: "A hand-thrown raw clay jar with rough volcanic sand texture and translucent chalk glaze interior. Made locally in an Oslo suburb studio.",
    badge: "LIMITED EDITION"
  },
  {
    id: "scandi-03",
    name: "03. STAV Tall Plinth",
    category: "Furniture / Plinth",
    price: "€420",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600&h=800",
    description: "Solid lime-washed timber column to elevate sculptures, vessels, or books. Perfect balance of stark architectural presence and warm cozy grain.",
    badge: "NEW CO"
  }
];

export default function Theme42Preview({
  brandName = "STUDIO NORDÖ",
  tagline = "FURNISHING & CLAY OBJECTS",
  philosophy = "Our practice is grounded in silence, material permanence, and organic form. We design things that grow older gracefully in the quiet corners of your living spaces.",
  accentColor = "#c5a880",
  bgColor = "#FAF8F5",
  textColor = "#2C2A27",
  products = defaultProducts,
  onAddToCart,
  isLoading = false,
  displayFont = "Playfair Display",
  bodyFont = "Inter",
  gradientBg = "",
  paddingScale = "p-4",
  borderRadiusStyle = "none",
  borderWeightStyle = "border"
}: Theme42PreviewProps) {
  const [selectedProduct, setSelectedProduct] = useState<TemplateProduct | null>(null);
  const [lovedProducts, setLovedProducts] = useState<Record<string, boolean>>({});
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

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
      className="w-full min-h-screen transition-colors duration-500 overflow-hidden"
      style={{ 
        background: gradientBg || bgColor, 
        color: textColor,
        fontFamily: bodyFont || 'Inter, sans-serif'
      }}
    >
      {/* Toast alert for item added to bag */}
      {addedItemName && (
        <div className="fixed top-6 right-6 z-50 bg-[#2C2A27] text-[#FAF8F5] px-6 py-4 rounded-none shadow-xl flex items-center gap-3 border border-stone-700 animate-slide-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-sans tracking-wide">Added "{addedItemName}" to Bag</span>
        </div>
      )}

      {/* Navigation */}
      <header className="border-b border-stone-200/40 px-6 py-8 md:px-12 flex justify-between items-center bg-transparent backdrop-blur-sm">
        <div className="flex flex-col">
          <span 
            className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase"
            style={{ fontFamily: displayFont || 'Playfair Display, serif' }}
          >
            {brandName}
          </span>
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase opacity-60 mt-1">{tagline}</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-xs font-sans tracking-widest uppercase opacity-70">
          <a href="#about" className="hover:opacity-100 transition-opacity">Archive</a>
          <a href="#catalog" className="hover:opacity-100 transition-opacity">Objects</a>
          <a href="#philosophy" className="hover:opacity-100 transition-opacity">Manifesto</a>
        </nav>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-sans tracking-[0.2em] font-medium px-2 py-1 border border-stone-300 text-stone-500 rounded-sm">THEME 42</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 md:px-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
        <div className="md:col-span-5 space-y-6">
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-stone-500 block">NEW COLLECTION / EST. 2026</span>
          <h1 
            className="text-4xl md:text-6xl font-light leading-tight tracking-tight text-balance"
            style={{ fontFamily: displayFont || 'Playfair Display, serif' }}
          >
            Quiet designs for <br />
            <span className="italic" style={{ color: accentColor }}>living minds.</span>
          </h1>
          <p 
            className="text-sm md:text-base leading-relaxed opacity-80 font-light max-w-md"
            style={{ fontFamily: bodyFont || 'Inter, sans-serif' }}
          >
            {philosophy}
          </p>
          <div className="pt-4">
            <a 
              href="#catalog"
              className="inline-flex items-center gap-2 group text-xs font-sans tracking-widest uppercase pb-1 border-b border-current transition-all hover:gap-3"
            >
              Explore Living Forms <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div 
          className="md:col-span-7 relative h-[350px] md:h-[500px] w-full overflow-hidden bg-stone-100 shadow-sm border border-stone-200/20 group"
          style={{ borderRadius: borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : borderRadiusStyle === 'md' ? '8px' : borderRadiusStyle === 'lg' ? '12px' : '24px' }}
        >
          <img 
            src={products[0]?.image || defaultProducts[0].image}
            alt={products[0]?.name || "Hero furniture piece"}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-white text-left">
            <p className="text-xs uppercase font-sans tracking-widest opacity-80">featured object</p>
            <h3 
              className="text-lg md:text-xl font-light tracking-wide mt-1"
              style={{ fontFamily: displayFont || 'Playfair Display, serif' }}
            >
              {products[0]?.name || "Oak Lounge Chair"}
            </h3>
          </div>
        </div>
      </section>

      {/* Materials / Details banner */}
      <section id="philosophy" className="border-y border-stone-200/40 py-12 bg-white/30 backdrop-blur-sm text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-3">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase opacity-50">MATERIAL INTEGRITY</span>
          <p 
            className="italic font-light text-lg md:text-xl opacity-90"
            style={{ fontFamily: displayFont || 'Playfair Display, serif' }}
          >
            "Warm solid timbers, unglazed Swedish clay, coarse woven linen. Simple materials speak when we cease to over-complicate shapes."
          </p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="catalog" className="px-6 py-16 md:px-12 md:py-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-stone-200/30 pb-4">
          <div>
            <span className="text-xs font-sans tracking-[0.2em] uppercase opacity-50">CURATED EDIT</span>
            <h2 
              className="text-2xl md:text-3xl font-light tracking-wide mt-1"
              style={{ fontFamily: displayFont || 'Playfair Display, serif' }}
            >
              Linen Toned Storefront
            </h2>
          </div>
          <span className="text-xs font-sans tracking-widest opacity-60 italic">{products.length} Items Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div 
              key={product.id}
              className={`group cursor-pointer flex flex-col justify-between transition-all hover:translate-y-[-2px] duration-300 ${paddingScale} ${borderWeightStyle} border-stone-300/30 bg-white/5`}
              style={{ 
                borderRadius: borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : borderRadiusStyle === 'md' ? '8px' : borderRadiusStyle === 'lg' ? '12px' : '24px'
              }}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="space-y-4">
                {/* Product Image Frame */}
                <div 
                  className="relative aspect-[3/4] bg-stone-100 overflow-hidden shadow-xs border border-stone-200/10"
                  style={{ borderRadius: borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '3px' : borderRadiusStyle === 'md' ? '6px' : borderRadiusStyle === 'lg' ? '10px' : '20px' }}
                >
                  <img 
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-white/95 text-stone-800 text-[9px] font-sans font-medium uppercase tracking-widest py-1 px-2 shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  {/* Quick actions hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="p-3 bg-white/95 text-stone-800 rounded-full shadow-md hover:bg-stone-50 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => toggleLove(product.id, e)}
                      className="p-3 bg-white/95 text-stone-800 rounded-full shadow-md hover:bg-stone-50 transition-colors"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${lovedProducts[product.id] ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
                    </button>
                    <button 
                      onClick={(e) => triggerCart(product, e)}
                      className="p-3 bg-[#2C2A27] text-white rounded-full shadow-md hover:bg-stone-800 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="pt-2 flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[11px] font-sans tracking-widest uppercase opacity-40">{product.category}</span>
                    <h3 
                      className="text-base font-light hover:underline"
                      style={{ fontFamily: displayFont || 'Playfair Display, serif' }}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-sm tracking-wide font-sans mt-0.5">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/40 px-6 py-12 md:px-12 md:py-16 bg-white/10 text-xs font-sans tracking-widest uppercase text-center space-y-6 opacity-60 max-w-7xl mx-auto">
        <p className="font-serif italic font-light lowercase text-base tracking-normal">handmade with slow care.</p>
        <div className="flex justify-center space-x-6 text-[10px]">
          <span>© 2026 {brandName}</span>
          <span>•</span>
          <span>Stockholm - Copenhagen - Oslo</span>
          <span>•</span>
          <span>Shipping worldwide</span>
        </div>
      </footer>

      {/* Detail Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4 animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div 
            className="bg-[#FAF8F5] text-[#2C2A27] w-full max-w-2xl rounded-none shadow-2xl overflow-hidden border border-stone-300 md:grid md:grid-cols-2 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-100 border-r border-stone-200/20">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 left-4 bg-white/80 p-2 text-stone-700 hover:bg-white md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-sans tracking-[0.2em] uppercase opacity-50 block mb-1">{selectedProduct.category}</span>
                    <h3 className="text-xl font-light leading-tight">{selectedProduct.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="p-1 rounded-full hover:bg-stone-200/50 transition-colors hidden md:block text-stone-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-lg font-medium font-sans text-stone-700">{selectedProduct.price}</div>
                
                <p className="text-xs leading-relaxed opacity-80 font-sans font-light">
                  {selectedProduct.description}
                </p>

                <div className="border-t border-stone-200 pt-4 text-[11px] font-sans font-light text-stone-500 space-y-1">
                  <div><span className="font-medium">Material:</span> Certified sustainable light oak, natural organic linen fiber weaves</div>
                  <div><span className="font-medium">Origin:</span> Scandinavian design workshop</div>
                  <div><span className="font-medium">Shipping:</span> Dispatched within 48 hours</div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={(e) => {
                    triggerCart(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-[#2C2A27] text-[#FAF8F5] py-3 text-xs tracking-widest font-sans font-medium uppercase hover:bg-stone-800 transition-colors"
                >
                  Add to Bag — {selectedProduct.price}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
