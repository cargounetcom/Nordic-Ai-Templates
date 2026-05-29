/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Eye, Code, Layers, Sliders, Check, Copy, ArrowLeft, RefreshCw, 
  Sparkles, ShoppingBag, Terminal, Palette, Type, Grid, Shuffle, Settings, Download, Upload
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

// Countries metadata block for premium localization setups
const COUNTRIES_METADATA = [
  { name: "UK", code: "UK", lang: "en-GB", symbol: "£" },
  { name: "USA", code: "US", lang: "en-US", symbol: "$" },
  { name: "Germany", code: "DE", lang: "de-DE", symbol: "€" },
  { name: "France", code: "FR", lang: "fr-FR", symbol: "€" },
  { name: "Sweden", code: "SE", lang: "sv-SE", symbol: "kr" },
  { name: "Netherlands", code: "NL", lang: "nl-NL", symbol: "€" },
  { name: "Denmark", code: "DK", lang: "da-DK", symbol: "kr" },
  { name: "Norway", code: "NO", lang: "nb-NO", symbol: "kr" },
  { name: "Canada", code: "CA", lang: "en-CA", symbol: "CA$" },
  { name: "Australia", code: "AU", lang: "en-AU", symbol: "A$" }
];

export default function TemplateSimulator({ template, onBack, onLaunchAIGenerate }: TemplateSimulatorProps) {
  // Synchronous localStorage retriever for clean, flicker-free rendering on session restore
  const getSavedValue = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(`studio_nordic_remixes_v1_${template.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[key] !== undefined) {
          return parsed[key] as T;
        }
      }
    } catch (e) {
      console.error("Local storage seed error:", e);
    }
    return defaultValue;
  };

  // Live dynamic theme style choice (can switch between Warm Scandinavian and Brutalist Copenhagen layout on the fly!)
  const [previewStyle, setPreviewStyle] = useState<'warm_scandinavian' | 'brutalist_copenhagen'>(() => 
    getSavedValue('previewStyle', template.style)
  );

  // Live custom state keys seeded from the chosen template
  const [brandName, setBrandName] = useState(() => getSavedValue('brandName', template.name));
  const [tagline, setTagline] = useState(() => getSavedValue('tagline', template.tagline));
  const [philosophy, setPhilosophy] = useState(() => getSavedValue('philosophy', template.philosophy));
  
  // Custom country and favicon indicators
  const [selectedCountryName, setSelectedCountryName] = useState(() => getSavedValue('selectedCountryName', 'Denmark'));
  const [showTailwindFavicon, setShowTailwindFavicon] = useState(() => getSavedValue('showTailwindFavicon', true));
  
  // Custom colors and gradients
  const [bgColor, setBgColor] = useState(() => getSavedValue('bgColor', template.colors.bg));
  const [textColor, setTextColor] = useState(() => getSavedValue('textColor', template.colors.text));
  const [accentColor, setAccentColor] = useState(() => getSavedValue('accentColor', template.colors.accent));
  
  // Dynamic gradient controls ("gradient bloks")
  const [useGradient, setUseGradient] = useState(() => getSavedValue('useGradient', false));
  const [gradientAngle, setGradientAngle] = useState(() => getSavedValue('gradientAngle', 135));
  const [gradientColorStart, setGradientColorStart] = useState(() => getSavedValue('gradientColorStart', template.colors.bg));
  const [gradientColorEnd, setGradientColorEnd] = useState(() => getSavedValue('gradientColorEnd', template.colors.accent));

  // Dynamic font pairings ("fons" - select display and body fonts)
  const [displayFont, setDisplayFont] = useState(() => 
    getSavedValue('displayFont', template.style === 'warm_scandinavian' ? 'Playfair Display' : 'Space Grotesk')
  );
  const [bodyFont, setBodyFont] = useState(() => 
    getSavedValue('bodyFont', template.style === 'warm_scandinavian' ? 'Inter' : 'JetBrains Mono')
  );

  // Custom individual layout rules derived to Tailwind classes ("individual style tailwind rules")
  const [paddingScale, setPaddingScale] = useState<'p-2' | 'p-4' | 'p-6'>(() => 
    getSavedValue('paddingScale', 'p-4')
  );
  const [borderRadiusStyle, setBorderRadiusStyle] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>(() => 
    getSavedValue('borderRadiusStyle', 'none')
  );
  const [borderWeightStyle, setBorderWeightStyle] = useState<'border-0' | 'border' | 'border-2' | 'border-4'>(() => 
    getSavedValue('borderWeightStyle', 'border')
  );

  // Active customizer tab inside the sidebar
  const [activeCustomizerTab, setActiveCustomizerTab] = useState<'REMIX' | 'BRANDING' | 'COLORS' | 'TYPOGRAPHY' | 'CATALOG'>('REMIX');

  // Active top preview workspace tab
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'SANDBOX' | 'BLUEPRINT' | 'CODE'>('SANDBOX');
  const [exportFormat, setExportFormat] = useState<'html' | 'react'>('html');
  const [copied, setCopied] = useState(false);
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  // Workspace real filesystem generation states
  const [saveWorkspaceStatus, setSaveWorkspaceStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveWorkspaceMsg, setSaveWorkspaceMsg] = useState<string>('');

  // Database Proxy Synchronization states
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

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

  // Seed initial products lists with a localStorage fallback if it exists
  const [products, setProducts] = useState<TemplateProduct[]>(() => {
    try {
      const saved = localStorage.getItem(`studio_nordic_remixes_v1_${template.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
          return parsed.products;
        }
      }
    } catch (e) {
      console.error("Local storage load products error:", e);
    }
    
    // Default fallback
    return template.items.map((it, idx) => {
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
  });

  // 1. Session state swap/restore listener when parent template id changes
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem(`studio_nordic_remixes_v1_${template.id}`);
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.previewStyle) setPreviewStyle(saved.previewStyle);
        if (saved.brandName) setBrandName(saved.brandName);
        if (saved.tagline !== undefined) setTagline(saved.tagline);
        if (saved.philosophy !== undefined) setPhilosophy(saved.philosophy);
        if (saved.selectedCountryName) setSelectedCountryName(saved.selectedCountryName);
        if (saved.showTailwindFavicon !== undefined) setShowTailwindFavicon(saved.showTailwindFavicon);
        if (saved.bgColor) setBgColor(saved.bgColor);
        if (saved.textColor) setTextColor(saved.textColor);
        if (saved.accentColor) setAccentColor(saved.accentColor);
        if (saved.useGradient !== undefined) setUseGradient(saved.useGradient);
        if (saved.gradientAngle !== undefined) setGradientAngle(saved.gradientAngle);
        if (saved.gradientColorStart) setGradientColorStart(saved.gradientColorStart);
        if (saved.gradientColorEnd) setGradientColorEnd(saved.gradientColorEnd);
        if (saved.displayFont) setDisplayFont(saved.displayFont);
        if (saved.bodyFont) setBodyFont(saved.bodyFont);
        if (saved.paddingScale) setPaddingScale(saved.paddingScale);
        if (saved.borderRadiusStyle) setBorderRadiusStyle(saved.borderRadiusStyle);
        if (saved.borderWeightStyle) setBorderWeightStyle(saved.borderWeightStyle);
        if (saved.products) setProducts(saved.products);
      } else {
        // Fallback reset to raw template variables if not previously customized
        setPreviewStyle(template.style);
        setBrandName(template.name);
        setTagline(template.tagline);
        setPhilosophy(template.philosophy);
        setSelectedCountryName('Denmark');
        setShowTailwindFavicon(true);
        setBgColor(template.colors.bg);
        setTextColor(template.colors.text);
        setAccentColor(template.colors.accent);
        setUseGradient(false);
        setGradientAngle(135);
        setGradientColorStart(template.colors.bg);
        setGradientColorEnd(template.colors.accent);
        setDisplayFont(template.style === 'warm_scandinavian' ? 'Playfair Display' : 'Space Grotesk');
        setBodyFont(template.style === 'warm_scandinavian' ? 'Inter' : 'JetBrains Mono');
        setPaddingScale('p-4');
        setBorderRadiusStyle('none');
        setBorderWeightStyle('border');
        
        // Default items state fallback
        const defaults = template.items.map((it, idx) => {
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
        setProducts(defaults);
      }
    } catch (e) {
      console.error("Failed to restore session states for template selection:", e);
    }
  }, [template.id]);

  // 2. Debounced state auto-saving sync mapping to local storage for real-time grounding
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const payload = {
          previewStyle,
          brandName,
          tagline,
          philosophy,
          selectedCountryName,
          showTailwindFavicon,
          bgColor,
          textColor,
          accentColor,
          useGradient,
          gradientAngle,
          gradientColorStart,
          gradientColorEnd,
          displayFont,
          bodyFont,
          paddingScale,
          borderRadiusStyle,
          borderWeightStyle,
          products
        };
        localStorage.setItem(`studio_nordic_remixes_v1_${template.id}`, JSON.stringify(payload));
      } catch (e) {
        console.error("Auto tracking sync write failed:", e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    template.id,
    previewStyle,
    brandName,
    tagline,
    philosophy,
    selectedCountryName,
    showTailwindFavicon,
    bgColor,
    textColor,
    accentColor,
    useGradient,
    gradientAngle,
    gradientColorStart,
    gradientColorEnd,
    displayFont,
    bodyFont,
    paddingScale,
    borderRadiusStyle,
    borderWeightStyle,
    products
  ]);

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

  const handleImageUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...products];
      if (updated[idx]) {
        updated[idx].image = reader.result as string;
        setProducts(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSyncToBackendDB = async () => {
    setSyncStatus('syncing');
    try {
      const response = await fetch('/api/sync-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: template.id,
          brandName,
          tagline,
          philosophy,
          bgColor,
          textColor,
          accentColor,
          displayFont,
          bodyFont,
          style: previewStyle,
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            description: p.description,
            badge: p.badge,
            number: p.number,
            image: p.image
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Database Sync error');
      }

      const result = await response.json();
      if (result.success) {
        setSyncStatus('success');
        setLastSyncedTime(new Date().toLocaleTimeString());
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    } catch (err) {
      console.error("Database sync failed:", err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
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

  const generateReactTemplateCode = (): string => {
    const formattedDisplay = displayFont;
    const formattedBody = bodyFont;
    return `// ========================================================================
// Produced by NORDIC PREMIUM THEME COMPILER - EST. 2026
// Custom Template: ${brandName} (Based on code from template ID: ${template.id})
// Selected Style Paradigm: ${previewStyle === 'warm_scandinavian' ? 'Warm Scandinavian Serif' : 'Brutalist Copenhagen Monospace'}
// ========================================================================

import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Check } from 'lucide-react';

export interface ProductNode {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
  number?: string;
}

export default function CustomNordicShowroom() {
  const [cartCount, setCartCount] = useState(0);
  const [loved, setLoved] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const brandName = "${brandName}";
  const tagline = "${tagline}";
  const philosophy = "${philosophy}";
  const bgColor = "${bgColor}";
  const textColor = "${textColor}";
  const accentColor = "${accentColor}";
  const gradientBg = "${getComputedGradientCSS()}";

  const products: ProductNode[] = ${JSON.stringify(products, null, 2)};

  const handleAddToCart = (name: string) => {
    setCartCount(prev => prev + 1);
    setNotification(name);
    setTimeout(() => setNotification(null), 2500);
  };

  const toggleLove = (id: string) => {
    setLoved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div 
      className="w-full min-h-screen transition-all duration-350 overflow-hidden text-xs tracking-wider"
      style={{ 
        background: gradientBg || bgColor, 
        color: textColor,
        fontFamily: "${formattedBody}, sans-serif" 
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=${formattedDisplay.replace(/ /g, '+')}&family=${formattedBody.replace(/ /g, '+')}&display=swap" rel="stylesheet" />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-6 py-4 border-2 flex items-center gap-3 shadow-lg" style={{ backgroundColor: textColor, color: bgColor, borderColor: textColor }}>
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="font-bold uppercase tracking-widest text-[10px]">ITEM ADDED: {notification}</span>
        </div>
      )}

      <header className="border-b py-8 flex justify-between items-center bg-transparent max-w-7xl mx-auto px-6" style={{ borderColor: 'rgba(128,128,128,0.15)' }}>
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest text-inherit" style={{ fontFamily: "${formattedDisplay}" }}>{brandName}</h1>
          <p className="text-[10px] tracking-widest opacity-60 uppercase mt-2">{tagline}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border text-xs bg-white/5 font-bold" style={{ borderColor: 'rgba(128,128,128,0.15)', borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}" }}>
          <ShoppingBag className="w-4 h-4" />
          <span>BAG ({cartCount})</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto py-16 space-y-16 px-6">
        <div className="border p-8 italic font-light text-md text-center bg-white/5" style={{ borderColor: 'rgba(128,128,128,0.15)', borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}" }}>
          "\\\${philosophy}"
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="group flex flex-col justify-between p-6 bg-white/5 border transition-all duration-300"
              style={{ 
                borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '4px' : '8px'}",
                borderColor: 'rgba(128,128,128,0.15)'
              }}
            >
              <div className="space-y-4">
                <div className="relative aspect-square bg-[#1A1A1A]/5 backdrop-blur-xs flex items-center justify-center overflow-hidden" style={{ borderRadius: "${borderRadiusStyle === 'none' ? '0px' : borderRadiusStyle === 'sm' ? '3px' : '6px'}" }}>
                  <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={p.name} referrerPolicy="no-referrer" />
                  <span className="absolute top-4 left-4 text-[10px] font-mono opacity-50">[{p.number || '01'}]</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase opacity-40 block">{p.category}</span>
                  <h3 className="text-sm font-bold uppercase mt-1" style={{ fontFamily: "${formattedDisplay}" }}>{p.name}</h3>
                  <p className="text-xs opacity-75 mt-2 line-clamp-3">{p.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
                <span className="text-sm font-bold">{p.price}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleLove(p.id)} 
                    className="p-2 border" 
                    style={{ borderColor: 'rgba(128,128,128,0.15)' }}
                  >
                    <Heart className={\`w-4 h-4 \\\${loved[p.id] ? 'fill-rose-500 text-rose-500' : 'opacity-60'}\`} />
                  </button>
                  <button 
                    onClick={() => handleAddToCart(p.name)}
                    className="px-4 py-2 text-xs font-bold uppercase hover:opacity-95"
                    style={{ 
                      backgroundColor: "${accentColor}", 
                      color: "${textColor === '#FFFFFF' || textColor === '#F5F5F5' ? '#000000' : '#FFFFFF'}"
                    }}
                  >
                    ADD NODE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t py-12 text-center text-[10px] opacity-55" style={{ borderColor: 'rgba(128,128,128,0.15)' }}>
        <p>© 2026 NORDIC Theme Lab Studio. Hand-tailored Spec sheet compiled code.</p>
      </footer>
    </div>
  );
}
`;
  };

  const handleCopyReactCode = () => {
    navigator.clipboard.writeText(generateReactTemplateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReactFile = () => {
    const code = generateReactTemplateCode();
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_showroom.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Triggers creation of the actual physical file inside the project workspace! No simulation.
  const handleDeployToWorkspace = async () => {
    setSaveWorkspaceStatus('saving');
    try {
      const ext = exportFormat === 'react' ? '.tsx' : '.html';
      const fileName = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_showroom${ext}`;
      const content = exportFormat === 'react' ? generateReactTemplateCode() : generateHTMLTemplateCode();

      const response = await fetch('/api/write-workspace-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName, content })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate workspace file.");
      }

      const resData = await response.json();
      setSaveWorkspaceStatus('success');
      setSaveWorkspaceMsg(`Successfully compiled & deployed real storefront file: "${resData.filePath}"!`);
    } catch (err: any) {
      setSaveWorkspaceStatus('error');
      setSaveWorkspaceMsg(err.message || "Failed to compile/write workspace file.");
    }
  };

  const handleDownloadBlueprintJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentJSONSpec, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `nordic_blueprint_${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateHTMLTemplateCode = () => {
    const formattedDisplay = displayFont;
    const formattedBody = bodyFont;
    const activeCountryMeta = COUNTRIES_METADATA.find(c => c.name === selectedCountryName) || COUNTRIES_METADATA[6];
    const formattedProducts = JSON.stringify(products);
    
    // Evaluate layout structures beforehand to avoid any nested backtick compile friction
    const isBrutalist = previewStyle === 'brutalist_copenhagen';
    const tcContrastRGB = textColor === '#F5F5F5' || textColor === '#ffffff' ? '255,255,255' : '0,0,0';
    
    const borderStyleClass = borderRadiusStyle === 'none' ? 'rounded-none' : borderRadiusStyle === 'sm' ? 'rounded-sm' : borderRadiusStyle === 'md' ? 'rounded-md' : borderRadiusStyle === 'lg' ? 'rounded-lg' : 'rounded-2xl';
    const itemPadding = paddingScale === 'p-2' ? 'p-2' : paddingScale === 'p-4' ? 'p-4' : 'p-6';
    const borderWeight = borderWeightStyle === 'border-0' ? 'border-0' : borderWeightStyle === 'border' ? 'border' : borderWeightStyle === 'border-2' ? 'border-2' : 'border-4';

    const statusBarHtml = isBrutalist ? `
  <div class="border-b py-2.5 px-6 flex justify-between items-center text-[9px] tracking-[0.25em] font-mono bg-black/10" style="border-color: rgba(${tcContrastRGB}, 0.15)">
    <span>(STANDALONE_STORE_EXPORT // LOCALE: ${activeCountryMeta.code} / ${activeCountryMeta.lang.toUpperCase()})</span>
    <span class="animate-pulse font-bold text-brandAccent">● STATIC_PRODUCTION_HOST_LIVE</span>
    <span class="hidden md:inline">(NORDIC_COMPRESSION // COMPILED SUCCESSFULLY)</span>
  </div>` : '';

    const productsHtmlGrid = products.map((p) => {
      const rawPrice = p.price ? p.price.replace(/[^0-9.,]/g, '') : "0";
      const currencySymbol = activeCountryMeta.symbol;
      const displayPrice = currencySymbol === 'kr.' || currencySymbol === 'kr' ? rawPrice + " kr" : currencySymbol + rawPrice;
      const badgeElem = p.badge ? `<span class="absolute top-4 left-4 bg-white text-stone-900 text-[8px] font-mono font-bold uppercase tracking-widest py-1 px-2.5 shadow-xs border border-stone-200/10">${p.badge}</span>` : '';
      
      return `
          <div class="group relative flex flex-col justify-between hover:bg-white/[0.03] transition-all p-4 ${borderStyleClass} ${itemPadding} ${borderWeight}" style="border-color: rgba(${tcContrastRGB}, 0.1)">
            <div>
              <!-- Physical Mock Image -->
              <div class="relative aspect-[3/4] bg-neutral-900/40 overflow-hidden shadow-xs border border-neutral-700/10 ${borderStyleClass}">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-102" loading="lazy">
                ${badgeElem}
              </div>

              <!-- Interactive Loving Pin -->
              <button onclick="toggleLove(event, '${p.id}')" id="heart-${p.id}" class="absolute top-8 right-8 w-8 h-8 rounded-full bg-white text-stone-700 flex items-center justify-center hover:text-red-500 shadow-sm transition-colors border">
                <svg xmlns="http://www.w3.org/2500/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <div class="mt-4 flex justify-between items-start gap-2">
                <div>
                  <span class="text-[9px] font-mono tracking-widest uppercase opacity-40 block">${p.category || 'OBJECT'}</span>
                  <h3 class="text-sm font-title font-light uppercase tracking-wider text-inherit mt-0.5 group-hover:underline">${p.name}</h3>
                </div>
                <span class="text-sm tracking-wide font-sans font-semibold shrink-0 mt-0.5">${displayPrice}</span>
              </div>
              <p class="text-[11px] opacity-65 mt-2 line-clamp-3 leading-relaxed font-sans">${p.description || ''}</p>
            </div>

            <!-- Action buttons footer -->
            <div class="mt-6 pt-3 border-t flex items-center justify-between gap-3 text-xs" style="border-color: rgba(${tcContrastRGB}, 0.08)">
              <button onclick="openQuickView(event, '${p.id}')" class="text-[10px] font-mono tracking-wider opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer">
                <span>[QUICK_VIEW]</span>
              </button>
              <button onclick="addToCart(event, '${p.id}')" class="px-3.5 py-1.5 font-bold uppercase tracking-widest text-[9px] transition-all cursor-pointer font-sans" style="background-color: ${accentColor}; color: ${textColor === '#F5F5F5' || textColor === '#ffffff' ? '#000000' : '#ffffff'}">
                ADD TO BASKET
              </button>
            </div>
          </div>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${tagline}</title>
  
  <!-- Standalone Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Premium Google Fonts pairing -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${formattedDisplay.replace(/ /g, '+')}:wght@300;400;600;700&family=${formattedBody.replace(/ /g, '+')}:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  
  <!-- Custom Tailwind config setup -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ["${formattedDisplay}", "serif"],
            sans: ["${formattedBody}", "sans-serif"],
            mono: ["JetBrains Mono", "monospace"]
          },
          colors: {
            brandBg: "${bgColor}",
            brandText: "${textColor}",
            brandAccent: "${accentColor}"
          }
        }
      }
    }
  </script>

  <style>
    /* Custom fluid transitions & visual refinements */
    body {
      background-color: ${bgColor};
      color: ${textColor};
      font-family: "${formattedBody}", sans-serif;
      transition: all 0.5s ease;
    }
    
    .font-title {
      font-family: "${formattedDisplay}", serif;
    }

    /* Elegant custom scrollbar */
    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.02);
    }
    ::-webkit-scrollbar-thumb {
      background: ${accentColor};
      border-radius: 2px;
    }

    /* Staggered load animation */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-brandAccent/30 relative">

  <!-- Status Bar rendered statically -->
  ${statusBarHtml}

  <!-- Header Section -->
  <header class="border-b px-6 py-8 md:px-12 flex justify-between items-center bg-transparent backdrop-blur-sm" style="border-color: rgba(${tcContrastRGB}, 0.15)">
    <div class="flex items-center gap-3">
      ${showTailwindFavicon ? `
      <div class="w-8 h-8 rounded-sm flex items-center justify-center border relative" style="border-color: ${accentColor}">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 12l10 10 10-10L12 2z" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 6l6 6-6 6-6-6 6-6z" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
        </svg>
      </div>
      ` : ''}
      <div class="flex flex-col">
        <span class="text-xl md:text-2xl font-light tracking-[0.2em] uppercase font-title leading-tight">${brandName}</span>
        <span class="text-[10px] font-sans tracking-[0.3em] uppercase opacity-60 mt-0.5">${tagline}</span>
      </div>
    </div>
    
    <nav class="hidden md:flex space-x-8 text-xs font-sans tracking-widest uppercase opacity-70">
      <a href="#about" class="hover:opacity-100 transition-opacity">Archive</a>
      <a href="#catalog" class="hover:opacity-100 transition-opacity">Showroom</a>
      <a href="#about" class="hover:opacity-100 transition-opacity">Manifesto</a>
    </nav>

    <div class="flex items-center space-x-6">
      <button onclick="toggleCartSidebar()" class="relative p-2 flex items-center gap-1.5 focus:outline-none cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span id="cart-counter-pill" class="bg-brandAccent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full absolute -top-1 -right-1">0</span>
      </button>
      <span class="text-[10px] font-sans tracking-[0.15em] font-medium px-2 py-1 border rounded-sm" style="border-color: rgba(${tcContrastRGB}, 0.2)">
        ${activeCountryMeta.code}-${activeCountryMeta.lang.split('-')[0].toUpperCase()}
      </span>
    </div>
  </header>

  <main class="flex-grow">
    <!-- Hero / Manifesto section -->
    <section id="philosophy" class="border-b py-20 bg-white/[0.02] text-center" style="border-color: rgba(${tcContrastRGB}, 0.15)">
      <div class="max-w-2xl mx-auto px-6 space-y-4">
        <span class="text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">MATERIAL INTEGRITY // PHILOSOPHY</span>
        <p class="text-xl md:text-2xl font-light font-title leading-relaxed">
          "${philosophy}"
        </p>
        <div class="pt-4">
          <a href="#catalog" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono border-b pb-1 hover:opacity-75 transition-opacity" style="border-color: ${accentColor}">
            <span>EXPLORE OBJECTS SHOWROOM</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section id="catalog" class="px-6 py-16 md:px-12 md:py-24 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b pb-4" style="border-color: rgba(${tcContrastRGB}, 0.15)">
        <div class="mb-4 md:mb-0">
          <span class="text-xs font-sans tracking-[0.2em] uppercase opacity-50 block font-mono">// CURATED ARCHIVE EDI</span>
          <h2 class="text-2xl md:text-3xl font-light uppercase tracking-wider font-title mt-1">PRODUCT SHOWCASE</h2>
        </div>
        <div class="text-[10px] font-mono opacity-60">
          LOCAL MARKET: ${activeCountryMeta.name.toUpperCase()} HUB (${activeCountryMeta.symbol})
        </div>
      </div>

      <!-- Live Catalog list -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        ${productsHtmlGrid}
      </div>
    </section>
  </main>

  <!-- Interactive Footer -->
  <footer id="about" class="border-t py-16 text-center text-[10px] font-mono tracking-widest opacity-50 bg-black/5" style="border-color: rgba(${tcContrastRGB}, 0.15)">
    <div class="max-w-4xl mx-auto px-6 space-y-4">
      <p class="uppercase font-bold tracking-[0.25em]">© 2026 ${brandName} — ALL LOGISTIC NODES PROTECTED.</p>
      <p class="opacity-60">DISTRIBUTED VIA PREMIUM COLD-STORAGE STATIC HTML ENGINE // EXPORTED USING NORDIC STUDIO</p>
    </div>
  </footer>

  <!-- DYNAMIC LIVE INTERACTION SLIDEOVER (CART) -->
  <div id="cart-sidebar" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-brandBg h-full z-50 border-l shadow-2xl translate-x-full transition-transform duration-300 ease-out flex flex-col justify-between" style="border-color: rgba(${tcContrastRGB}, 0.2)">
    <div class="p-6 border-b flex justify-between items-center" style="border-color: rgba(${tcContrastRGB}, 0.12)">
      <h3 class="font-title uppercase text-sm font-semibold tracking-wider">YOUR SELECTION BAG</h3>
      <button onclick="toggleCartSidebar()" class="p-2 text-inherit opacity-60 hover:opacity-100 font-mono text-[10px] cursor-pointer">[CLOSE]</button>
    </div>
    
    <!-- Cart Items Block -->
    <div id="cart-items-container" class="flex-grow p-6 overflow-y-auto space-y-4 font-sans">
      <div class="text-center py-10 opacity-40 font-mono text-[11px]">[YOUR SELECTION IS EMPTY]</div>
    </div>

    <!-- Cart Footer Summary -->
    <div class="p-6 border-t font-sans" style="border-color: rgba(${tcContrastRGB}, 0.12)">
      <div class="flex justify-between items-center font-semibold mb-6 text-xs tracking-widest">
        <span>ESTIMATED TOTAL:</span>
        <span id="cart-total-value">${activeCountryMeta.symbol}0.00</span>
      </div>
      <button onclick="triggerCheckout()" class="w-full py-3.5 text-center uppercase tracking-widest text-[10px] font-bold transition-all text-white bg-black hover:opacity-90 cursor-pointer" style="background-color: ${accentColor}; color: ${textColor === '#F5F5F5' || textColor === '#ffffff' ? '#000000' : '#ffffff'}">
        PROCEED TO EXPORT GATEWAY
      </button>
    </div>
  </div>
  
  <div id="cart-backdrop" onclick="toggleCartSidebar()" class="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 hidden transition-opacity"></div>

  <!-- QUICK VIEW DETAIL OVERLAY MODAL -->
  <div id="quickview-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 hidden">
    <div onclick="closeQuickViewModal()" class="fixed inset-0 bg-black/75 backdrop-blur-sm"></div>
    <div class="bg-brandBg border w-full max-w-2xl overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl" style="background-color: ${bgColor}; border-color: rgba(${tcContrastRGB}, 0.2)">
      <button onclick="closeQuickViewModal()" class="absolute top-4 right-4 z-20 p-2 font-mono text-[10px] opacity-60 hover:opacity-100 bg-black/10 text-white rounded-full h-8 w-8 flex items-center justify-center border cursor-pointer">[X]</button>
      
      <div class="w-full md:w-1/2 aspect-[3/4] bg-white/[0.05]">
        <img id="modal-image" src="" alt="" class="w-full h-full object-cover">
      </div>
      
      <div class="w-full md:w-1/2 p-6 flex flex-col justify-between">
        <div class="space-y-4 font-sans">
          <div>
            <span id="modal-badge" class="inline-block bg-brandAccent text-white text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase mb-2">NEW</span>
            <span id="modal-category" class="text-[9px] font-mono block uppercase opacity-50 tracking-widest">OBJ_NOD</span>
            <h2 id="modal-title" class="text-xl font-title uppercase tracking-wider font-light mt-1">PRODUCT NAME</h2>
          </div>
          <p id="modal-price" class="text-lg font-semibold tracking-wide"></p>
          <p id="modal-desc" class="text-xs opacity-75 leading-relaxed"></p>
        </div>
        
        <div class="mt-8">
          <button id="modal-add-btn" class="w-full py-3.5 text-center uppercase tracking-widest text-[10px] font-bold transition-all text-white cursor-pointer" style="background-color: ${accentColor}; color: ${textColor === '#F5F5F5' || textColor === '#ffffff' ? '#000000' : '#ffffff'}">
            ADD TO BASKET
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- LIVE TOAST FEEDBACK PANEL -->
  <div id="toast" class="fixed bottom-6 left-6 z-50 bg-neutral-900 text-white font-mono text-[10px] px-4 py-3 border border-zinc-850 tracking-widest uppercase translate-y-20 opacity-0 transition-all duration-300">
    <span class="text-brandAccent">🛒 ITEM REGISTERED:</span> <span id="toast-message">NORDIC_DESIGN</span>
  </div>

  <!-- INTERACTION ENGINE (VANILLA JS) -->
  <script>
    // Live template products state parsed from active sandbox configuration
    const staticProducts = ${formattedProducts};
    
    // Live basket state
    let basket = [];
    let lovedIds = {};
    
    // Toggle Basket drawer view
    function toggleCartSidebar() {
      const sidebar = document.getElementById('cart-sidebar');
      const backdrop = document.getElementById('cart-backdrop');
      sidebar.classList.toggle('translate-x-full');
      backdrop.classList.toggle('hidden');
    }
    
    // Toggle active favorite badge
    function toggleLove(e, id) {
      e.stopPropagation();
      lovedIds[id] = !lovedIds[id];
      const button = document.getElementById('heart-' + id);
      if (lovedIds[id]) {
        button.style.backgroundColor = '${accentColor}';
        button.style.color = '#FFFFFF';
      } else {
        button.style.backgroundColor = 'rgba(255,255,255,0.9)';
        button.style.color = '#4B5563';
      }
    }
    
    // Quick View product popup opening
    let currentModalProductId = null;
    function openQuickView(e, id) {
      if (e) e.stopPropagation();
      const product = staticProducts.find(p => p.id === id);
      if (!product) return;
      
      currentModalProductId = id;
      document.getElementById('modal-title').innerText = product.name;
      document.getElementById('modal-image').src = product.image;
      document.getElementById('modal-desc').innerText = product.description || "Designed with absolute material integrity, blending function & form elegantly.";
      document.getElementById('modal-category').innerText = product.category || 'OBJECT';
      
      const badge = document.getElementById('modal-badge');
      if (product.badge) {
        badge.innerText = product.badge;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
      
      // Localized price formulation
      const rawPrice = product.price ? product.price.replace(/[^0-9.,]/g, '') : "0";
      const displayPrice = "${activeCountryMeta.symbol}" === "kr." || "${activeCountryMeta.symbol}" === "kr" ? rawPrice + " kr" : "${activeCountryMeta.symbol}" + rawPrice;
      document.getElementById('modal-price').innerText = displayPrice;
      
      const addButton = document.getElementById('modal-add-btn');
      addButton.setAttribute('onclick', "addToCart(null, '" + id + "'); closeQuickViewModal();");
      
      const modal = document.getElementById('quickview-modal');
      modal.classList.remove('hidden');
    }
    
    function closeQuickViewModal() {
      document.getElementById('quickview-modal').classList.add('hidden');
    }
    
    // Push new item node to basket array with notification feedback
    function addToCart(e, id) {
      if (e) e.stopPropagation();
      const product = staticProducts.find(p => p.id === id);
      if (!product) return;
      
      basket.push(product);
      updateBasketDOM();
      
      // Toast notification
      const toast = document.getElementById('toast');
      document.getElementById('toast-message').innerText = product.name;
      toast.classList.remove('translate-y-20', 'opacity-0');
      
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 2500);
    }
    
    // Pop item node from active selection index
    function removeCartItem(idx) {
      basket.splice(idx, 1);
      updateBasketDOM();
    }
    
    // Compute total sum & refresh DOM layout components
    function updateBasketDOM() {
      const pill = document.getElementById('cart-counter-pill');
      if (pill) {
        pill.innerText = basket.length;
      }
      
      const container = document.getElementById('cart-items-container');
      if (basket.length === 0) {
        container.innerHTML = '<div class="text-center py-10 opacity-40 font-mono text-[11px]">[YOUR SELECTION IS EMPTY]</div>';
        document.getElementById('cart-total-value').innerText = "${activeCountryMeta.symbol}0.00";
        return;
      }
      
      let totalAmount = 0;
      let html = '';
      
      basket.forEach((item, idx) => {
        const rawNum = item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0;
        totalAmount += isNaN(rawNum) ? 0 : rawNum;
        
        const priceLabel = "${activeCountryMeta.symbol}" === "kr." || "${activeCountryMeta.symbol}" === "kr" ? item.price.replace(/[^0-9.,]/g, '') + " kr" : "${activeCountryMeta.symbol}" + item.price.replace(/[^0-9.,]/g, '');
        
        html += \`
          <div class="flex items-center justify-between border-b pb-3" style="border-color: rgba(${tcContrastRGB}, 0.08)">
            <div class="flex items-center gap-3">
              <img src="\\\${item.image}" alt="" class="w-10 h-10 object-cover bg-white/10 rounded-xs">
              <div>
                <span class="text-[11px] font-semibold uppercase font-title leading-tight block text-inherit">\\\${item.name}</span>
                <span class="text-[10px] opacity-65 font-mono mt-0.5 block">\\\${priceLabel}</span>
              </div>
            </div>
            <button onclick="removeCartItem(\\\${idx})" class="text-red-500 hover:text-red-700 font-mono text-[9px] font-bold uppercase shrink-0 p-1 cursor-pointer">[REMOVE]</button>
          </div>
        \`;
      });
      
      container.innerHTML = html;
      
      const formattedTotal = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('cart-total-value').innerText = "${activeCountryMeta.symbol}" === "kr." || "${activeCountryMeta.symbol}" === "kr" ? formattedTotal + " kr" : "${activeCountryMeta.symbol}" + formattedTotal;
    }
    
    // Simulates an API checkout flow
    function triggerCheckout() {
      if (basket.length === 0) {
        alert("Selection bag is empty. Please register digital items!");
        return;
      }
      alert("Checkout Simulation triggered for " + basket.length + " objects of total value: " + document.getElementById('cart-total-value').innerText + " to shipping hub: ${activeCountryMeta.name}!");
      basket = [];
      updateBasketDOM();
      toggleCartSidebar();
    }
  </script>
</body>
</html>`;
  };

  const handleCopyHTMLCode = () => {
    navigator.clipboard.writeText(generateHTMLTemplateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHTMLFile = () => {
    const htmlSnippet = generateHTMLTemplateCode();
    const blob = new Blob([htmlSnippet], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_showroom_template.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentJSONSpec = {
    blueprint_id: template.id,
    platform_compatibility: template.platform,
    category: template.category,
    active_layout_engine: previewStyle,
    global_distribution_market: {
      selected_country: selectedCountryName,
      country_code: COUNTRIES_METADATA.find(c => c.name === selectedCountryName)?.code || "DK",
      language_code: COUNTRIES_METADATA.find(c => c.name === selectedCountryName)?.lang || "da-DK",
      currency_symbol: COUNTRIES_METADATA.find(c => c.name === selectedCountryName)?.symbol || "kr"
    },
    favicon_enabled: showTailwindFavicon,
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

                <div className="pt-3 border-t border-stone-200 mt-2">
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                    Store Country Localization (10 Markets)
                  </label>
                  <p className="text-[10px] text-stone-400 mb-2 leading-tight">
                    Select active global distribution. Automatically localizes product prices, currency symbols, flags, and shipping hub telemetry.
                  </p>
                  <select
                    value={selectedCountryName}
                    onChange={(e) => setSelectedCountryName(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-stone-800 rounded-sm font-medium"
                  >
                    {COUNTRIES_METADATA.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name} ({country.code} • {country.symbol} • {country.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-sm border border-stone-200 mt-1">
                    <span className="text-[10px] uppercase font-bold text-stone-600 flex flex-col">
                      <span>Integrate Tailwind Favicon</span>
                      <span className="text-[8px] text-stone-400 normal-case font-light leading-none mt-1">Add vector brand logo trademark to active header views.</span>
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showTailwindFavicon}
                      onChange={(e) => setShowTailwindFavicon(e.target.checked)}
                      className="w-4 h-4 text-amber-500 border-stone-300 focus:ring-stone-800 rounded-xs cursor-pointer"
                    />
                  </div>
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
                    
                    {/* Drag-and-drop + Click mockup area */}
                    <div className="pt-1.5 space-y-1">
                      <span className="block text-[8px] uppercase tracking-wider font-extrabold opacity-60">Custom Mockup / Photo</span>
                      <div className="flex gap-2 items-center">
                        <img 
                          src={p.image} 
                          alt="mockup thumb" 
                          className="w-8 h-8 object-cover border border-stone-300 bg-stone-100" 
                        />
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleImageUpload(pIdx, file);
                          }}
                          className="flex-1 border border-dashed border-stone-300 p-2 text-center text-[9px] text-stone-500 hover:border-[#c5a880] hover:text-stone-700 cursor-pointer transition flex items-center justify-center gap-1 bg-white"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleImageUpload(pIdx, file);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="w-3 h-3 text-stone-400" />
                          <span>Drag or Click to upload</span>
                        </div>
                      </div>
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

              {/* Continuous Backend Database Sync Section */}
              <div className="pt-4 border-t border-stone-200 mt-2 space-y-2">
                <span className="text-[9px] opacity-60 uppercase font-bold text-stone-500 block">CONTINUOUS BACKEND DB SYNC</span>
                <button 
                  onClick={handleSyncToBackendDB}
                  disabled={syncStatus === 'syncing'}
                  className={`w-full py-2.5 text-[10px] uppercase tracking-wider font-mono font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                    syncStatus === 'syncing' 
                      ? 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'
                      : syncStatus === 'success'
                      ? 'bg-emerald-500 text-stone-900 border-emerald-500 font-extrabold'
                      : syncStatus === 'error'
                      ? 'bg-rose-500 text-white border-rose-500 font-bold'
                      : 'bg-zinc-950 text-amber-350 border-zinc-950 hover:bg-zinc-900'
                  }`}
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>SYNCING TO DB PROXY...</span>
                    </>
                  ) : syncStatus === 'success' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>SYNC_COMPLETE_OK</span>
                    </>
                  ) : syncStatus === 'error' ? (
                    <span>SYNC_FAILED_RETRY_SYS</span>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>SYNC SPECS TO BACKEND</span>
                    </>
                  )}
                </button>
                {lastSyncedTime && (
                  <div className="flex justify-between items-center text-[8px] font-mono text-stone-500 bg-stone-100 p-1.5">
                    <span>STATUS: RECENT_UPSERT_OK</span>
                    <span>TIMESTAMP: {lastSyncedTime}</span>
                  </div>
                )}
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

                {(() => {
                  const activeCountryMeta = COUNTRIES_METADATA.find(c => c.name === selectedCountryName) || COUNTRIES_METADATA[6];
                  
                  return previewStyle === 'warm_scandinavian' ? (
                    <Theme42Preview 
                      brandName={brandName}
                      tagline={tagline}
                      philosophy={philosophy}
                      bgColor={bgColor}
                      textColor={textColor}
                      accentColor={accentColor}
                      products={products}
                      onAddToCart={handleAddToCartSimulated}
                      onImageUpload={handleImageUpload}
                      displayFont={displayFont}
                      bodyFont={bodyFont}
                      gradientBg={getComputedGradientCSS()}
                      paddingScale={paddingScale}
                      borderRadiusStyle={borderRadiusStyle}
                      borderWeightStyle={borderWeightStyle}
                      countryName={activeCountryMeta.name}
                      countryCode={activeCountryMeta.code}
                      languageCode={activeCountryMeta.lang}
                      currencySymbol={activeCountryMeta.symbol}
                      showTailwindFavicon={showTailwindFavicon}
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
                      onImageUpload={handleImageUpload}
                      displayFont={displayFont}
                      bodyFont={bodyFont}
                      gradientBg={getComputedGradientCSS()}
                      paddingScale={paddingScale}
                      borderRadiusStyle={borderRadiusStyle}
                      borderWeightStyle={borderWeightStyle}
                      countryName={activeCountryMeta.name}
                      countryCode={activeCountryMeta.code}
                      languageCode={activeCountryMeta.lang}
                      currencySymbol={activeCountryMeta.symbol}
                      showTailwindFavicon={showTailwindFavicon}
                    />
                  );
                })()}
              </div>
            )}

            {activeWorkspaceTab === 'BLUEPRINT' && (
              <div className="p-6 md:p-8 bg-zinc-950 text-[#8BC34A] font-mono text-[11px] leading-relaxed select-text h-full overflow-auto">
                <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-zinc-500 select-none">
                  <span>DESIGN_TOKEN_MARKUP_VARIABLES_BLUEPRINT</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(currentJSONSpec, null, 2));
                        alert("Theme Blueprint JSON saved to clipboard!");
                      }}
                      className="text-[9px] bg-zinc-850 text-white border border-zinc-700 px-3 py-1 hover:bg-zinc-700 transition cursor-pointer"
                    >
                      [COPY BLUEPRINT JSON]
                    </button>
                    <button 
                      onClick={handleDownloadBlueprintJSON}
                      className="text-[9px] bg-emerald-500 text-black font-bold px-3 py-1 hover:bg-emerald-400 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-black" />
                      <span>[DOWNLOAD .JSON SPECS]</span>
                    </button>
                  </div>
                </div>
                <pre>{JSON.stringify(currentJSONSpec, null, 2)}</pre>
              </div>
            )}

            {activeWorkspaceTab === 'CODE' && (
              <div className="p-6 md:p-8 bg-zinc-950 text-emerald-400 font-mono text-[11px] leading-relaxed select-text h-full overflow-auto flex flex-col">
                {/* Segment toggle */}
                <div className="flex border-b border-zinc-850 pb-4 mb-4 items-center justify-between gap-4 select-none">
                  <div className="flex gap-2 p-0.5 bg-zinc-900 border border-zinc-800 rounded-sm">
                    <button
                      type="button"
                      onClick={() => setExportFormat('html')}
                      className={`px-4 py-1.5 uppercase tracking-widest text-[9px] font-bold transition-all cursor-pointer ${
                        exportFormat === 'html'
                          ? 'bg-amber-400 text-stone-900'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      [1] STYLED HTML TEMPLATE
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat('react')}
                      className={`px-4 py-1.5 uppercase tracking-widest text-[9px] font-bold transition-all cursor-pointer ${
                        exportFormat === 'react'
                          ? 'bg-amber-400 text-stone-900'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      [2] REACT COMPONENT SOURCE
                    </button>
                  </div>
                  
                  <div className="text-[10px] text-zinc-500 hidden md:block">
                    {exportFormat === 'html' ? '// STANDALONE SINGLE-FILE STATIC SITE ENGINE' : '// SINGLE-FILE REACT MODULE'}
                  </div>
                </div>

                {/* Save Workspace feedback banner */}
                {saveWorkspaceStatus !== 'idle' && (
                  <div className={`p-4 text-xs mb-6 border font-mono flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    saveWorkspaceStatus === 'saving' 
                      ? 'bg-zinc-950/80 border-amber-600/40 text-amber-300 animate-pulse' 
                      : saveWorkspaceStatus === 'success' 
                        ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' 
                        : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {saveWorkspaceStatus === 'saving' ? (
                        <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      ) : saveWorkspaceStatus === 'success' ? (
                        <Check className="w-4.5 h-4.5 text-emerald-400" />
                      ) : (
                        <span className="text-rose-400 font-bold">⚠</span>
                      )}
                      <div>
                        <span className="font-extrabold block text-[10px] tracking-widest text-zinc-500 uppercase">
                          WORKSPACE FILEWRITER COMPILER
                        </span>
                        <p className="text-xs uppercase mt-0.5 font-sans font-medium tracking-wide">
                          {saveWorkspaceStatus === 'saving' ? 'Compiling system modules and executing files write...' : saveWorkspaceMsg}
                        </p>
                      </div>
                    </div>
                    {saveWorkspaceStatus !== 'saving' && (
                      <button 
                        onClick={() => setSaveWorkspaceStatus('idle')}
                        className="text-[9px] uppercase font-bold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2.5 py-1 tracking-widest cursor-pointer self-start md:self-auto"
                      >
                        [DISMISS]
                      </button>
                    )}
                  </div>
                )}

                {exportFormat === 'html' ? (
                  <>
                    <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-zinc-500 select-none">
                      <span>COPENHAGEN_STATIC_SITE_ENGINE (STANDALONE HTML + TAILWIND PLAY CDN)</span>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={handleCopyHTMLCode}
                          className="text-[9px] bg-zinc-850 text-white border border-zinc-700 px-3 py-1.5 hover:bg-zinc-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-350" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'COPIED SUCCESSFULLY' : '[COPY STATIC HTML CODE]'}</span>
                        </button>
                        <button 
                          onClick={handleDownloadHTMLFile}
                          className="text-[9px] bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 hover:bg-zinc-700 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>[DOWNLOAD LOCAL INDEX.HTML]</span>
                        </button>
                        <button 
                          onClick={handleDeployToWorkspace}
                          disabled={saveWorkspaceStatus === 'saving'}
                          className="text-[9px] bg-emerald-500 text-black font-extrabold px-3 py-1.5 hover:bg-emerald-400 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>[WRITE REAL HTML FILE TO WORKSPACE]</span>
                        </button>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap text-emerald-300 font-sans leading-relaxed select-all bg-zinc-900/60 p-4 border border-zinc-900">{generateHTMLTemplateCode()}</pre>
                  </>
                ) : (
                  <>
                    <div className="border-b border-zinc-800 pb-3 mb-4 flex justify-between items-center text-zinc-500 select-none">
                      <span>COPENHAGEN_SOURCE_COMPILER (REACT + TAILWIND CSS)</span>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={handleCopyReactCode}
                          className="text-[9px] bg-zinc-850 text-white border border-zinc-700 px-3 py-1.5 hover:bg-zinc-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-350" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'COPIED SUCCESSFULLY' : '[COPY CODE MODULE]'}</span>
                        </button>
                        <button 
                          onClick={handleDownloadReactFile}
                          className="text-[9px] bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 hover:bg-zinc-700 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>[DOWNLOAD LOCAL TSX FILE]</span>
                        </button>
                        <button 
                          onClick={handleDeployToWorkspace}
                          disabled={saveWorkspaceStatus === 'saving'}
                          className="text-[9px] bg-amber-400 text-stone-950 font-extrabold px-3 py-1.5 hover:bg-amber-300 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                          <span>[WRITE REAL TSX FILE TO WORKSPACE]</span>
                        </button>
                      </div>
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
                  </>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
