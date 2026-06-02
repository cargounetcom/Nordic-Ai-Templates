/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Briefcase, 
  Award, 
  CheckCircle, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Layers, 
  ArrowRight, 
  Sliders, 
  Search, 
  Sparkles, 
  Download, 
  Settings, 
  RefreshCw,
  Database,
  Globe,
  Link2,
  Activity,
  ExternalLink,
  Lock,
  Unlock,
  Cpu,
  Send,
  Check,
  CheckSquare,
  Info,
  Mail,
  GitBranch,
  Terminal,
  Cloud,
  Key,
  Github
} from 'lucide-react';
import { DesignTemplate, FiftyNordicTemplates } from '../data/templates';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'studio' | 'admin';
  plan: 'free' | 'pro' | 'max';
  registeredAt: string;
  mrr: number; // calculated simulated monthly payment
}

export interface SimulatedEmail {
  id: string;
  timestamp: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'registration' | 'upgrade' | 'downgrade';
  previousPlan?: string;
  newPlan?: string;
  bodyHtml: string;
}

interface RoleWorkspaceProps {
  onBack: () => void;
  onLaunchTemplate: (template: DesignTemplate) => void;
  themeStyle: 'warm' | 'brutalist';
}

// Initial mockup list for full-fidelity demonstration 
const INITIAL_USERS: UserAccount[] = [
  { id: 'usr-101', name: 'Nils Sjöberg', email: 'nils@gothenburg.se', role: 'user', plan: 'free', registeredAt: '2026-01-12', mrr: 20 },
  { id: 'usr-102', name: 'Astrid Lind', email: 'astrid@copenhagen.dk', role: 'studio', plan: 'pro', registeredAt: '2026-02-28', mrr: 199 },
  { id: 'usr-103', name: 'Kopenhagen Atelier Ltd.', email: 'lars@cph-design.dk', role: 'studio', plan: 'max', registeredAt: '2026-03-15', mrr: 499 },
  { id: 'usr-104', name: 'Freja Larsson', email: 'freja@stockholm.se', role: 'user', plan: 'pro', registeredAt: '2026-04-05', mrr: 199 },
  { id: 'usr-105', name: 'Elena Rosengren (You)', email: 'ellanovachenko@gmail.com', role: 'admin', plan: 'max', registeredAt: '2025-12-01', mrr: 499 },
];

export default function RoleWorkspace({ onBack, onLaunchTemplate, themeStyle }: RoleWorkspaceProps) {
  // Global Workspace State
  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('nordic_tenant_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current active login state (default is our user "Elena Rosengren (You)", who is Admin)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    return usersList.find(u => u.email === 'ellanovachenko@gmail.com') || usersList[4];
  });

  // UI State of Workspace
  const [activeTab, setActiveTab] = useState<'profiler' | 'studio' | 'admin' | 'register' | 'deploy' | 'integrations'>('profiler');

  // Sanity States
  const [sanityProjectId, setSanityProjectId] = useState('cph_scandi_lake_8829');
  const [sanityDataset, setSanityDataset] = useState('production');
  const [sanityToken, setSanityToken] = useState('sh_san_live_************************');
  const [isSyncingSanity, setIsSyncingSanity] = useState(false);
  const [sanitySyncStatus, setSanitySyncStatus] = useState<'idle' | 'linking' | 'connected' | 'failed'>('idle');
  const [sanityLog, setSanityLog] = useState<string[]>([
    'SYSTEM: Initialize Sanity client session',
    'INFO: Ready to request schema compilation...'
  ]);

  // Medusa States
  const [medusaUrl, setMedusaUrl] = useState('http://localhost:9000');
  const [medusaKey, setMedusaKey] = useState('pk_med_live_************************');
  const [isSyncingMedusa, setIsSyncingMedusa] = useState(false);
  const [medusaSyncStatus, setMedusaSyncStatus] = useState<'idle' | 'linking' | 'connected' | 'failed'>('idle');
  const [medusaLog, setMedusaLog] = useState<string[]>([
    'SYSTEM: Initialize Medusa Headless Engine',
    'INFO: Listening on API URL: http://localhost:9000...'
  ]);

  // Stripe States
  const [stripeAccountId, setStripeAccountId] = useState('acct_1HqpScSc992KiZ');
  const [stripeApiKey, setStripeApiKey] = useState('sk_live_************************');
  const [stripeCurrency, setStripeCurrency] = useState('DKK');
  const [isAuthorizingStripe, setIsAuthorizingStripe] = useState(false);
  const [stripeAuthStatus, setStripeAuthStatus] = useState<'idle' | 'authorizing' | 'active' | 'revoked'>('active');
  const [stripeActiveTab, setStripeActiveTab] = useState<'checkout' | 'backend' | 'metadata'>('checkout');
  
  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'studio' | 'admin'>('user');
  const [regPlan, setRegPlan] = useState<'free' | 'pro' | 'max'>('free');

  // Studio Clients/Projects list
  const [studioProjects, setStudioProjects] = useState<{ id: string; client: string; templateName: string; status: string }[]>([
    { id: 'proj-01', client: 'Gothenburg Coffee Lab', templateName: 'STUDIO NORDÖ', status: 'Active Draft' },
    { id: 'proj-02', client: 'Arvid & Sons Ceramics', templateName: 'ÖLAND ATELIER', status: 'Bespoke Production' }
  ]);
  const [newClientName, setNewClientName] = useState('');
  const [selectedSpecName, setSelectedSpecName] = useState(FiftyNordicTemplates[0]?.name || 'STUDIO NORDÖ');
  const [specCustomTagline, setSpecCustomTagline] = useState('Bespoke Handcrafted Design Matrix');
  const [specCustomNotes, setSpecCustomNotes] = useState('Primary web presence with custom platform integration. Emphasize organic textures and extreme linen spacing.');
  const [specPrimarySwatch, setSpecPrimarySwatch] = useState('#FAF8F5');
  const [specAccentSwatch, setSpecAccentSwatch] = useState('#c5a880');

  // Admin user directory search & filter
  const [searchVal, setSearchVal] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Interactive Subscription billing slider calculation state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<'DKK' | 'EUR' | 'USD'>('DKK');

  // Custom code export compilation simulator states
  const [isCompilingForDownload, setIsCompilingForDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStepMsg, setDownloadStepMsg] = useState('');
  const [deployFramework, setDeployFramework] = useState<'vite' | 'nextjs'>('nextjs');

  // Additional Integration copy indicators & logs
  const [copiedStripeClient, setCopiedStripeClient] = useState(false);
  const [copiedStripeServer, setCopiedStripeServer] = useState(false);
  const [copiedSanitySchema, setCopiedSanitySchema] = useState(false);
  const [activeWebhookEvent, setActiveWebhookEvent] = useState('checkout.session.completed');
  const [webhookLog, setWebhookLog] = useState<string[]>([
    'SYSTEM: Initialized Webhook Listening service on /api/webhooks/stripe',
    'INFO: Awaiting event emissions from Stripe...'
  ]);
  const [isBroadcastingWebhook, setIsBroadcastingWebhook] = useState(false);

  // Google Auth & Registration States
  const [googleUserEmail, setGoogleUserEmail] = useState('ellanovachenko@gmail.com');
  const [googleUserName, setGoogleUserName] = useState('Elena Rosengren');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleClientRegistered, setGoogleClientRegistered] = useState(false);

  // Git Repository Integration States
  const [gitRepoUrl, setGitRepoUrl] = useState('github.com/ellanovachenko/nordic-premium-studio');
  const [gitBranch, setGitBranch] = useState('main');
  const [gitAuthToken, setGitAuthToken] = useState('ghp_************************************');
  const [isGitLinking, setIsGitLinking] = useState(false);
  const [gitLinkStatus, setGitLinkStatus] = useState<'idle' | 'linked' | 'failed'>('idle');
  const [gitTerminalLogs, setGitTerminalLogs] = useState<string[]>([
    '[SYSTEM] Local git environment workspace initialized',
    'INFO: Run git connectors to sync remote branches...',
    'INFO: Detected AI Studio project ID: 57017176'
  ]);

  // Cloudflare Zero Trust States
  const [cloudflareDomain, setCloudflareDomain] = useState('cph-nordic-premium.cloudflareaccess.com');
  const [cloudflareClientId, setCloudflareClientId] = useState('cf-aud-3c299faee78129bc01a221b06efc');
  const [cloudflareTunnelToken, setCloudflareTunnelToken] = useState('eyJhIjoiY2YtYXBwIiwidCI6ImNwaC10dW5uZWwtc2VjcmV0LWtleSIsInMiOiI5M1hZIn0=');
  const [isCloudflareEnforced, setIsCloudflareEnforced] = useState(false);
  const [cloudflareVerifyStatus, setCloudflareVerifyStatus] = useState<'idle' | 'verifying' | 'enforced'>('idle');
  const [cloudflareTerminalLog, setCloudflareTerminalLog] = useState<string[]>([
    'SYSTEM: Initialized Cloudflare Access Tunnel check',
    'INFO: Enforce Cloudflare JWT Access token validation to secure /api/*'
  ]);

  // Simulated Email Notification states
  const [selectedEmailId, setSelectedEmailId] = useState<string>('msg-902');
  const [sentEmails, setSentEmails] = useState<SimulatedEmail[]>([
    {
      id: 'msg-901',
      timestamp: '2026-05-27 10:14:22',
      recipientEmail: 'astrid@copenhagen.dk',
      recipientName: 'Astrid Lind',
      subject: 'Welcome to Nordic Premium — License Activated [Atelier Pro]',
      type: 'registration',
      newPlan: 'pro',
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 24px; background-color: #FAF8F5; color: #111; border: 1px solid #e5e5e5; max-width: 500px; margin: 0 auto;">
          <h2 style="font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 8px;">NORDIC PREMIUM</h2>
          <p style="font-size: 13px; color: #555;">ID NODE: <strong>usr-102</strong></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
          <p style="font-size: 14px;">Hej <strong>Astrid Lind</strong>,</p>
          <p style="font-size: 13px; line-height: 1.6; color: #222;">Your premium <strong>Atelier Pro</strong> tenant license is now live. Explore Nordic templates, compile production-ready designs, and sync components instantly to your private storage cloud.</p>
          <div style="margin: 20px 0; padding: 15px; background: #FFF; border-left: 3px solid #6366f1; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">
            <span style="font-size: 11px; text-transform: uppercase; color: #9c8469; font-weight: bold; display: block;">License Level</span>
            <span style="font-size: 16px; font-weight: bold; color: #4338ca;">ATELIER PRO</span>
          </div>
          <p style="font-size: 11px; color: #888;">Nordic Premium ApS • Copenhagen, Denmark</p>
        </div>
      `
    },
    {
      id: 'msg-902',
      timestamp: '2026-05-27 12:45:01',
      recipientEmail: 'lars@cph-design.dk',
      recipientName: 'Kopenhagen Atelier Ltd.',
      subject: 'Security Alert: Subscription Upgraded to [Studio Max]',
      type: 'upgrade',
      previousPlan: 'pro',
      newPlan: 'max',
      bodyHtml: `
        <div style="font-family: sans-serif; padding: 24px; background-color: #FAF8F5; color: #111; border: 1px solid #e5e5e5; max-width: 500px; margin: 0 auto;">
          <h2 style="font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 8px;">NORDIC PREMIUM</h2>
          <p style="font-size: 13px; color: #555;">ID NODE: <strong>usr-103</strong></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
          <p style="font-size: 14px;">Hej <strong>Kopenhagen Atelier Ltd.</strong>,</p>
          <p style="font-size: 13px; line-height: 1.6; color: #222;">Excellent news. Your subscription has successfully been updated. You have acquired the coveted <strong>Studio Max Super License</strong>.</p>
          <div style="margin: 20px 0; padding: 15px; background: #FFF; border-left: 3px solid #c5a880; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">
            <span style="font-size: 11px; text-transform: uppercase; color: #9c8469; font-weight: bold; display: block;">Upgrade Event Details</span>
            <span style="font-size: 14px; font-weight: bold; color: #9c8469;">Atelier Pro &rarr; STUDIO MAX</span>
          </div>
          <p style="font-size: 11px; color: #888;">Nordic Premium ApS • Copenhagen, Denmark</p>
        </div>
      `
    }
  ]);
  const [adminTerminalLogs, setAdminTerminalLogs] = useState<string[]>([
    `[15:00:01] 🟢 [SYSTEM] Central Control SMTP Agent Online.`,
    `[15:01:22] ℹ️ [STANDBY] Ready to intercept subscription and registration emissions.`,
    `[15:01:45] 🔐 [SECURE] SSH loopback listening on port 25 (Simulated SMTP).`
  ]);

  const handleSyncSanity = () => {
    setIsSyncingSanity(true);
    setSanitySyncStatus('linking');
    setSanityLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] CONNECTING: Verifying project [${sanityProjectId}] credentials...`]);
    
    setTimeout(() => {
      setSanityLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] VERIFIED: Handshake established with dataset: [${sanityDataset}].`]);
      setSanityLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] SCHEMA: Compiling GROQ 'nordicProduct' document and object models...`]);
      
      setTimeout(() => {
        setSanityLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] STREAMING: Syncing active product templates variables:`]);
        setSanityLog(prev => [...prev, '  -> [Document: Original CPH Chair] synchronized successfully.']);
        setSanityLog(prev => [...prev, '  -> [Document: Nordic Ceramic Vase] synchronized successfully.']);
        setSanityLog(prev => [...prev, '  -> [Document: Space Brutalist Canvas] synchronized successfully.']);
        
        setTimeout(() => {
          setSanityLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] 🟢 SUCCESS: Sanity Content Lake synced perfectly.`]);
          setIsSyncingSanity(false);
          setSanitySyncStatus('connected');
        }, 1000);
      }, 1000);
    }, 1200);
  };

  const handleSyncMedusa = () => {
    setIsSyncingMedusa(true);
    setMedusaSyncStatus('linking');
    setMedusaLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] HANDSHAKE: Pinging Medusa architecture trunk on: ${medusaUrl}...`]);
    
    setTimeout(() => {
      setMedusaLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] AUThed: Handshake secure. Publishable key accepted.`]);
      setMedusaLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] EXTRACT: Structuring ecommerce product collection payload...`]);
      
      setTimeout(() => {
        setMedusaLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] EXPORT: Injecting variants streams into Medusa Admin Engine:`]);
        setMedusaLog(prev => [...prev, '  -> POST /store/products [Original CPH Chair] - STATUS: 201 Created']);
        setMedusaLog(prev => [...prev, '  -> POST /store/products [Nordic Ceramic Vase] - STATUS: 201 Created']);
        setMedusaLog(prev => [...prev, '  -> POST /store/products [Space Brutalist Canvas] - STATUS: 201 Created']);
        
        setTimeout(() => {
          setMedusaLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] 🟢 SUCCESS: Medusa product sync finished. Catalog mapping active.`]);
          setIsSyncingMedusa(false);
          setMedusaSyncStatus('connected');
        }, 1000);
      }, 1200);
    }, 1100);
  };

  const handleAuthorizeStripe = () => {
    setIsAuthorizingStripe(true);
    setStripeAuthStatus('authorizing');
    setTimeout(() => {
      setIsAuthorizingStripe(false);
      setStripeAuthStatus('active');
    }, 1400);
  };

  const handleBroadcastWebhook = () => {
    setIsBroadcastingWebhook(true);
    setWebhookLog(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] BROADCAST: Dispatched simulated stripe webhook event [${activeWebhookEvent}]...`]);
    
    setTimeout(() => {
      setWebhookLog(prev => [
        ...prev, 
        `[${new Date().toISOString().substring(11, 19)}] INGEST: Webhook matching completed at process.env.STRIPE_WEBHOOK_SECRET.`,
        `[${new Date().toISOString().substring(11, 19)}] 🟢 LOCALHOST HTTP 200: Handled standard Stripe payment flow. Session saved.`
      ]);
      setIsBroadcastingWebhook(false);
    }, 800);
  };

  const triggerSimulatedDownload = () => {
    setIsCompilingForDownload(true);
    setDownloadProgress(20);
    setDownloadStepMsg("Scanning React SPA source models (50 blueprints)...");
    
    setTimeout(() => {
      setDownloadProgress(50);
      setDownloadStepMsg(`Compiling custom configuration specifications for: ${selectedSpecName}...`);
      
      setTimeout(() => {
        setDownloadProgress(85);
        setDownloadStepMsg("Bundling design parameters, custom color swatches & scripts...");
        
        setTimeout(() => {
          setDownloadProgress(100);
          setDownloadStepMsg("Spec Sheet package prepared! Dispatched files.");
          
          // Generate file download containing gorgeous guidance and custom configurations
          const textContent = `========================================================================
NORDIC PREMIUM DESIGN SYSTEMS - DYNAMIC TECHNICAL SPECIFICATION
========================================================================
ACTING DESIGNER: ${currentUser.name} (${currentUser.email})
CLEARANCE ACCESS LEVEL: ${currentUser.role.toUpperCase()}
DASHBOARD LICENSE LEVEL: ${currentUser.plan.toUpperCase()}
========================================================================

Dear ${currentUser.name},

Below satisfies the requested technical specifications compiled on-the-fly 
for your Scandinavian design layout from our shop portfolio dashboard.

------------------------------------------------------------------------
1. BRAND BRIEF & SPECIFICATIONS
------------------------------------------------------------------------
SELECTED TEMPLATE:   ${selectedSpecName}
CUSTOM BRAND FOCUS:  ${specCustomTagline}
PRIMARY COVER PAINT: ${specPrimarySwatch}
ACCENT COLOR SWATCH: ${specAccentSwatch}

CREATIVE NOTES:
"${specCustomNotes}"

------------------------------------------------------------------------
2. INTEGRATED EXPORTS & INGRESS
------------------------------------------------------------------------
DEPLOYMENT PATH:     ${deployFramework === 'nextjs' ? '▲ Next.js App Router (Vercel)' : '⚛ Vite / HTML Edge (Netlify)'}

${deployFramework === 'nextjs' ? `
Next.js deployment executes on Vercel utilizing micro edge caching:
- Command line: 'npx vercel --prod'
- Webhook endpoints bind live to: '/api/webhooks/stripe'
- Live template feeds hydration from active spec [${selectedSpecName}]
` : `
Vite deployment builds a static production SPA ready for Netlify drop:
- Build command: 'npm run build'
- Direct static site publish folder: 'dist/'
- Config edge redirection maps: redirect '*' inside 'dist/index.html'
`}

------------------------------------------------------------------------
3. RAILWAY CONTAINER DEPLOYMENT MAPPING (RECOMMENDED)
------------------------------------------------------------------------
We recommend deploying direct proxy node containers on Railway with zero configuration.

REGISTERED REFERRAL LINK FOR OPERATIONAL CREDITS:
👉 TARGET: https://railway.com?referralCode=kNWgF4

Setup guidelines:
1. Log in or create a host profile at: https://railway.com?referralCode=kNWgF4
2. Install the lightweight Railway CLI locally: 'npm i -g @railway/cli'
3. Authenticate with your credentials: 'railway login'
4. Run 'railway init' followed by 'railway up' inside your codebase.

------------------------------------------------------------------------
HOW TO DOWNLOAD YOUR ENTIRE REPOSITORY FILES IN THE STUDIO
------------------------------------------------------------------------
To package the entire project repository code directly from your AI Studio environment:
1. Navigate to the top-right settings header of this application preview workspace.
2. Under the 'Export' options, trigger 'Export code as ZIP'.
3. This downloads the complete high-fidelity codebase (with package.json, source folders, 
   webpack templates, assets, and design data presets).

========================================================================
Thank you for executing with Nordic premium templates of architectural craft.
© 2026 NORDIC Theme Lab Studio. System node generated by acting administrator.
========================================================================
`;
          const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `NORDIC_SPEC_${selectedSpecName.replace(/\s+/g, '_')}.txt`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Trigger sequential download of the compiled high-fidelity React Component!
          const codeContent = `// ==========================================
// Compiled Design System / React Storefront
// Custom System Specs Applied Sequentially
// Selected Blueprint Name: ${selectedSpecName}
// ==========================================

import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Check, HelpCircle } from 'lucide-react';

export default function CustomPremiumStorefront() {
  const [cartCount, setCartCount] = useState(0);
  
  const brandName = "${selectedSpecName.toUpperCase()}";
  const tagline = "${specCustomTagline}";
  const notes = "${specCustomNotes.replace(/"/g, '\\"')}";
  const primaryColor = "${specPrimarySwatch}";
  const accentColor = "${specAccentSwatch}";

  const products = [
    {
      id: "prod-1",
      name: "Minimalist Scandinavian Oak Chair",
      category: "Furniture",
      price: "$480.00",
      description: "A beautifully crafted Solid European Oak statement piece modeled on traditional Danish joinery principles.",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: "prod-2",
      name: "Handmade Ceramic Vase - Matte Ash Green",
      category: "Ceramics",
      price: "$120.00",
      description: "Thrown on the wheel in Denmark, each piece highlights rustic impurities and a rich textured glaze.",
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: "prod-3",
      name: "Brutalist Matte Metal Office Poster",
      category: "Prints",
      price: "$65.00",
      description: "Silk-screen printed on heavyweight 300g cotton archival paper. Strict structural alignment.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div 
      className="w-full min-h-screen p-8 transition-all duration-300 flex flex-col justify-between" 
      style={{ backgroundColor: primaryColor || '#FAF8F5', color: '#111317', fontFamily: 'sans-serif' }}
    >
      <header className="border-b border-black/10 pb-6 mb-12 flex justify-between items-center bg-transparent">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">{brandName}</h1>
          <p className="text-[10px] tracking-widest opacity-60 uppercase mt-1">{tagline}</p>
        </div>
        <button onClick={() => setCartCount(c => c + 1)} className="flex items-center gap-2 px-3 py-1.5 border border-black/20 text-xs font-mono font-semibold" style={{ backgroundColor: accentColor || '#c5a880' }}>
          <ShoppingBag className="w-4 h-4" />
          <span>BAG ({cartCount})</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto space-y-12 flex-grow w-full">
        {notes && (
          <div className="border border-black/15 p-6 italic font-light text-sm opacity-90 max-w-2xl bg-white/10">
            "Creative Notes: {notes}"
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="border border-black/10 p-5 flex flex-col justify-between h-[420px] bg-white/5 shadow-sm rounded-lg"
            >
              <div className="aspect-square bg-neutral-900/10 overflow-hidden rounded-md relative">
                <img src={p.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="pt-4">
                <span className="text-[9px] uppercase tracking-widest opacity-50 block">{p.category}</span>
                <h3 className="font-bold uppercase tracking-wider text-xs mt-1">{p.name}</h3>
                <p className="text-[11px] opacity-70 mt-2 line-clamp-2">{p.description}</p>
              </div>
              <div className="flex justify-between items-center border-t border-black/10 pt-3 mt-3">
                <span className="font-bold">{p.price}</span>
                <button 
                  onClick={() => setCartCount(prev => prev + 1)}
                  className="px-3 py-1 text-[10px] uppercase font-bold text-white tracking-[0.12em] bg-neutral-900 hover:opacity-85 transition-colors"
                >
                  ADD OBJECT
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-black/10 pt-8 mt-16 text-center text-[10px] opacity-50">
        <p>© 2026 NORDIC Theme Lab Studio. Hand-tailored Spec sheet compiled code.</p>
      </footer>
    </div>
  );
}
`;
          const codeBlob = new Blob([codeContent], { type: 'text/typescript;charset=utf-8' });
          const codeUrl = URL.createObjectURL(codeBlob);
          const codeLink = document.createElement('a');
          codeLink.href = codeUrl;
          codeLink.setAttribute('download', `${selectedSpecName.replace(/\s+/g, '_')}_custom_showroom.tsx`);
          document.body.appendChild(codeLink);
          codeLink.click();
          document.body.removeChild(codeLink);
          URL.revokeObjectURL(codeUrl);
          
          setIsCompilingForDownload(false);
        }, 800);
      }, 800);
    }, 800);
  };


  // Track changes to localstorage 
  useEffect(() => {
    localStorage.setItem('nordic_tenant_users', JSON.stringify(usersList));
  }, [usersList]);

  // Synchronize currentUser when usersList changes
  useEffect(() => {
    const fresh = usersList.find(u => u.id === currentUser.id);
    if (fresh) {
      setCurrentUser(fresh);
    }
  }, [usersList, currentUser.id]);

  // Handle Preset Fast-logins
  const handlePresetLogin = (email: string) => {
    const target = usersList.find(u => u.email === email);
    if (target) {
      setCurrentUser(target);
      // Auto redirect to relevant tab
      if (target.role === 'admin') setActiveTab('admin');
      else if (target.role === 'studio') setActiveTab('studio');
      else setActiveTab('profiler');
    }
  };

  // Google SSO Autologin and Registrate Account
  const handleGoogleRegisterAuth = () => {
    setIsGoogleLoading(true);
    setAdminTerminalLogs(prev => [
      `[${new Date().toLocaleTimeString()}] INCOMING: Initialized Google OAuth account link for ${googleUserEmail}`,
      ...prev
    ]);

    setTimeout(() => {
      const planCost = 499; // Studio Max by default inside Premium Google flow
      const gId = `usr-g${Date.now().toString().slice(-3)}`;
      const newNode = {
        id: gId,
        name: googleUserName,
        email: googleUserEmail,
        role: 'admin' as const,
        plan: 'max' as const,
        registeredAt: new Date().toISOString().split('T')[0],
        mrr: planCost
      };

      setUsersList(prev => {
        // remove duplicate email if already exists
        const filtered = prev.filter(u => u.email.toLowerCase() !== googleUserEmail.toLowerCase());
        return [newNode, ...filtered];
      });
      setCurrentUser(newNode);
      setGoogleClientRegistered(true);
      setIsGoogleLoading(false);

      setAdminTerminalLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 🟢 Google Account [${googleUserEmail}] successfully authenticated and elevated to Studio Max Admin`,
        ...prev
      ]);
      alert(`Google Identity link established! Welcome ${googleUserName} (${googleUserEmail}). Session has been elevated to Central Studio Max Administrator.`);
      setActiveTab('admin');
    }, 1200);
  };

  // Git Repository Connecter Suite
  const runGitCommand = (cmd: 'init' | 'commit' | 'push' | 'pull') => {
    setIsGitLinking(true);
    setGitTerminalLogs(prev => [...prev, `[USER_RUN]$ git ${cmd === 'init' ? 'init' : cmd === 'commit' ? 'add . && git commit -m "chore: push Scandinavian Design Token definitions"' : cmd === 'push' ? `push origin ${gitBranch}` : `pull origin ${gitBranch}`}`]);
    
    setTimeout(() => {
      setIsGitLinking(false);
      if (cmd === 'init') {
        setGitTerminalLogs(prev => [
          ...prev,
          `Initialized empty Git repository in /workspace/.git/`,
          `git: tracking 48 design components, 2 main portals.`,
          `Default branch set to [${gitBranch}].`,
          `Set your remote URL and SSH token key to authenticate push actions.`
        ]);
      } else if (cmd === 'commit') {
        setGitTerminalLogs(prev => [
          ...prev,
          `warning: LF will be replaced by CRLF in src/App.tsx.`,
          `[${gitBranch} f9a21b0] chore: push Scandinavian Design Token definitions`,
          ` 3 files changed, 250 insertions(+)`,
          ` create mode 100644 src/components/GoogleCloudflareIntegrator.tsx`
        ]);
      } else if (cmd === 'push') {
        if (!gitRepoUrl) {
          setGitTerminalLogs(prev => [...prev, `❌ FATAL: Remote repository destination is empty.`]);
          return;
        }
        setGitLinkStatus('linked');
        setGitTerminalLogs(prev => [
          ...prev,
          `Linking context to remote origin: https://${gitRepoUrl}...`,
          `Resolving deltas: 100% (18/18)`,
          `Matching SSH/PAT Key credentials for ${googleUserEmail}... Authenticated!`,
          `Writing objects: 100% (18/18), 3.29 KiB | 3.29 MiB/s, done.`,
          `To https://${gitRepoUrl}`,
          ` * [new branch]      ${gitBranch} -> ${gitBranch}`,
          `🟢 SUCCESS: Repository fully in sync. Active branch: origin/${gitBranch}. Cloudflare build-on-push webhooks triggered.`
        ]);
      } else if (cmd === 'pull') {
        setGitTerminalLogs(prev => [
          ...prev,
          `Connecting remote index ...`,
          `Already up to date. Local clone is in status MATCHED with head refs of origin/${gitBranch}.`
        ]);
      }
    }, 1000);
  };

  // Cloudflare JWT Zero Trust Enforcer
  const handleVerifyCloudflareAccess = () => {
    setCloudflareVerifyStatus('verifying');
    setCloudflareTerminalLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] INCOMING: Testing CF Web Gateway handshake on https://${cloudflareDomain}...`
    ]);

    setTimeout(() => {
      setIsCloudflareEnforced(true);
      setCloudflareVerifyStatus('enforced');
      setCloudflareTerminalLog(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] JWT: Enforcing audience JWT signature checks (matches ID ${cloudflareClientId.slice(0, 12)}...)`,
        `[${new Date().toLocaleTimeString()}] SSL: Handshake certified by Cloudflare DNS proxy`,
        `[${new Date().toLocaleTimeString()}] 🟢 ENFORCED: Zero Trust Access Gateway established perfectly on PORT 3000!`
      ]);
      alert(`Cloudflare Access setup has been fully verified and is currently guarding the /api/* routing boundary on this node.`);
    }, 1400);
  };

  // Create/Register new User node
  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    // Check query duplication
    if (usersList.some(u => u.email.toLowerCase() === regEmail.toLowerCase())) {
      alert('This email is already registered in the Nordic system database.');
      return;
    }

    const planCost = regPlan === 'free' ? 20 : regPlan === 'pro' ? 199 : 499;

    const newNode: UserAccount = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: regName,
      email: regEmail,
      role: regRole,
      plan: regPlan,
      registeredAt: new Date().toISOString().split('T')[0],
      mrr: planCost
    };

    const updated = [newNode, ...usersList];
    setUsersList(updated);
    setCurrentUser(newNode);

    // Reset inputs
    setRegName('');
    setRegEmail('');
    
    // Send to correct visual portal
    if (regRole === 'admin') {
      setActiveTab('admin');
    } else if (regRole === 'studio') {
      setActiveTab('studio');
    } else {
      setActiveTab('profiler');
    }
  };

  // Perform promotion/role demotion inside directory
  const handleUpdateUserRole = (userId: string, newRole: 'user' | 'studio' | 'admin') => {
    const updated = usersList.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsersList(updated);
  };

  // Perform subscription upgrade instantly from the subscriber panel
  const handleUpdateSubscription = (userId: string, targetPlan: 'free' | 'pro' | 'max') => {
    const planCost = targetPlan === 'free' ? 20 : targetPlan === 'pro' ? 199 : 499;
    const updated = usersList.map(u => {
      if (u.id === userId) {
        return { ...u, plan: targetPlan, mrr: planCost };
      }
      return u;
    });
    setUsersList(updated);
  };

  // Modify client list for Studio Workspace
  const handleAddClientProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const newProj = {
      id: `proj-${Date.now().toString().slice(-3)}`,
      client: newClientName,
      templateName: selectedSpecName,
      status: 'Active Draft'
    };

    setStudioProjects([...studioProjects, newProj]);
    setNewClientName('');
  };

  const handleDeleteClientProject = (id: string) => {
    setStudioProjects(studioProjects.filter(p => p.id !== id));
  };

  // Pricing constants converting on-the-fly DKK (Copenhagen Local Krone), Euro or USD
  const getSimulatedPrice = (baseDkk: number) => {
    let cost = baseDkk;
    let unit = 'kr';
    if (currency === 'EUR') {
      cost = Math.round(baseDkk * 0.13);
      unit = '€';
    } else if (currency === 'USD') {
      cost = Math.round(baseDkk * 0.14);
      unit = '$';
    }
    
    if (billingCycle === 'yearly') {
      cost = Math.round(cost * 12 * 0.85); // 15% discount
    }
    return `${unit} ${cost.toLocaleString()}${billingCycle === 'yearly' ? '/yr' : '/mo'}`;
  };

  // Active compiled MRR tally of our sandbox system
  const totalSystemMRR = usersList.reduce((acc, curr) => {
    // scale to annual if needed, but let's standardise monthly DKK
    return acc + curr.mrr;
  }, 0);

  // Filter lists based on states
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchVal.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchVal.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isWarmTheme = themeStyle === 'warm';

  return (
    <div className={`min-h-screen px-4 py-8 md:px-12 md:py-16 ${
      isWarmTheme 
        ? 'bg-[#FAF8F5] text-[#2C2A27] font-serif' 
        : 'bg-[#121212] text-[#F5F5F5] font-mono'
    }`}>
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6"
             style={{ borderColor: isWarmTheme ? 'rgba(44,42,39,0.1)' : 'rgba(245,245,245,0.1)' }}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-widest font-sans font-bold px-2 py-0.5 rounded-xs ${
                isWarmTheme ? 'bg-amber-100 text-amber-800' : 'bg-red-950/50 text-red-400 border border-red-800'
              }`}>
                Operational Node
              </span>
              <span className="font-mono text-[10px] opacity-50">STATUS: AUTHENTIC_ACCOUNTS_SYNC</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-widest font-display">
              Workspace & Security Portals
            </h2>
            <p className="text-xs opacity-70 font-sans font-light">
              Registration control, dynamic subscription packages, client portals, and role switches for User, Studio, and Admin.
            </p>
          </div>
          <button 
            onClick={onBack}
            className={`mt-4 md:mt-0 font-sans text-xs uppercase tracking-widest border transition px-5 py-2.5 hover:bg-black hover:text-white cursor-pointer ${
              isWarmTheme ? 'border-stone-800 text-stone-800 bg-white' : 'border-zinc-700 text-zinc-300 bg-zinc-900'
            }`}
          >
            ← Retract to Main Catalogue
          </button>
        </div>

        {/* Global Active Account Ticker Panel */}
        <div className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${
          isWarmTheme ? 'bg-white border-stone-200 shadow-xs' : 'bg-zinc-950 border-zinc-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-none ${
              isWarmTheme ? 'bg-stone-50 text-stone-700 border' : 'bg-zinc-900 text-zinc-200 border border-zinc-800'
            }`}>
              {currentUser.role === 'admin' ? <Shield className="w-5 h-5 text-amber-500 animate-pulse" /> : 
               currentUser.role === 'studio' ? <Briefcase className="w-5 h-5 text-indigo-400" /> : 
               <User className="w-5 h-5 text-emerald-500" />}
            </div>
            <div>
              <p className="text-[10px] uppercase font-sans tracking-wider opacity-60">Acting Platform Identity</p>
              <h4 className="text-sm font-bold tracking-tight uppercase font-sans">{currentUser.name}</h4>
              <p className="text-xs font-mono opacity-80">{currentUser.email} • ID: {currentUser.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-left font-sans">
              <span className="block text-[8px] uppercase tracking-wider opacity-50 font-bold">SYSTEM ROLE</span>
              <span className="text-xs font-black uppercase text-amber-500">{currentUser.role}</span>
            </div>
            <div className="text-left font-sans">
              <span className="block text-[8px] uppercase tracking-wider opacity-50 font-bold">LICENSE PLAN</span>
              <span className="text-xs font-black uppercase text-indigo-400">
                {currentUser.plan === 'free' ? 'Linen Starter' : currentUser.plan === 'pro' ? 'Atelier Pro' : 'Studio Max'}
              </span>
            </div>

            {/* Quick Preset Switching */}
            <div className="border-l pl-4 font-sans space-y-1">
              <span className="block text-[8px] uppercase tracking-wider opacity-50 font-bold">Preset Simulator Login:</span>
              <div className="flex gap-1.5 flex-wrap">
                <button 
                  onClick={() => handlePresetLogin('ellanovachenko@gmail.com')}
                  className="px-2 py-0.5 text-[9px] uppercase border bg-stone-900 text-white cursor-pointer hover:bg-amber-400 hover:text-stone-950"
                  title="Elena - Admin / Studio Max"
                >
                  Admin
                </button>
                <button 
                  onClick={() => handlePresetLogin('lars@cph-design.dk')}
                  className="px-2 py-0.5 text-[9px] uppercase border bg-white text-black cursor-pointer hover:bg-neutral-100"
                  title="Lars - Studio / Studio Max"
                >
                  Studio Owner
                </button>
                <button 
                  onClick={() => handlePresetLogin('freja@stockholm.se')}
                  className="px-2 py-0.5 text-[9px] uppercase border bg-white text-black cursor-pointer hover:bg-neutral-100"
                  title="Freja - User / Atelier Pro"
                >
                  Pro User
                </button>
                <button 
                  onClick={() => handlePresetLogin('nils@gothenburg.se')}
                  className="px-2 py-0.5 text-[9px] uppercase border bg-white text-black cursor-pointer hover:bg-neutral-100"
                  title="Nils - User / Linen Starter"
                >
                  Starter User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Router */}
        <div className="flex flex-wrap gap-2 border-b pb-2"
             style={{ borderColor: isWarmTheme ? 'rgba(44,42,39,0.08)' : 'rgba(245,245,245,0.08)' }}>
          <button
            onClick={() => setActiveTab('profiler')}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
              activeTab === 'profiler' 
                ? 'border-b-2 border-amber-500 font-bold text-amber-600' 
                : 'opacity-50 hover:opacity-90'
            }`}
          >
            🛡️ 1. Subscriptions & Profiler
          </button>
          
          <button
            onClick={() => {
              if (currentUser.role !== 'studio' && currentUser.role !== 'admin') {
                alert('Access Restricted. You must be in a Studio or Admin role to access the Brand Studio module.');
                return;
              }
              setActiveTab('studio');
            }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
              currentUser.role !== 'studio' && currentUser.role !== 'admin' ? 'opacity-25 cursor-not-allowed' : ''
            } ${
              activeTab === 'studio' 
                ? 'border-b-2 border-indigo-500 font-bold text-indigo-500' 
                : 'opacity-50 hover:opacity-90'
            }`}
          >
            🎨 2. Studio Client Suite
          </button>

          <button
            onClick={() => {
              if (currentUser.role !== 'admin') {
                alert('Verification Failed. Only users with Admin roles are permitted the Central Control Terminal.');
                return;
              }
              setActiveTab('admin');
            }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
              currentUser.role !== 'admin' ? 'opacity-25 cursor-not-allowed' : ''
            } ${
              activeTab === 'admin' 
                ? 'border-b-2 border-red-500 font-bold text-red-500' 
                : 'opacity-50 hover:opacity-90'
            }`}
          >
            ⚙️ 3. Admin Terminal Room
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'border-b-2 border-[#c5a880] font-bold text-[#c5a880]' 
                : 'opacity-50 hover:opacity-90'
            }`}
          >
            ✙ Register Tenant ID
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all cursor-pointer ${
              activeTab === 'integrations' 
                ? 'border-b-2 border-emerald-500 font-bold text-emerald-500' 
                : 'opacity-50 hover:opacity-90'
            }`}
          >
            🔌 4. Platform Connect (Stripe, Sanity, Medusa)
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`ml-auto px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all cursor-pointer border ${
              activeTab === 'deploy' 
                ? 'bg-[#c5a880] text-[#2C2A27] border-[#c5a880] font-bold font-sans' 
                : 'border-amber-600/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/15'
            }`}
          >
            🚀 Export & Host Node
          </button>
        </div>

        {/* Tab Content Display Area */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: Profiler & Subscriptions Cabinet */}
          {activeTab === 'profiler' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Pricing & Plan Selector matrix */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-light uppercase tracking-wide">Interactive Subscription Matrices</h3>
                      <p className="text-xs opacity-60 font-sans mt-0.5">Adjust settings below to calculate Swedish, Danish or Euro costs dynamically with standard 15% discount rules for annual billing circles.</p>
                    </div>

                    {/* Quick Cost Settings */}
                    <div className="flex items-center gap-3">
                      <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className={`text-[10px] p-1.5 border font-sans uppercase font-bold focus:outline-none ${
                          isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-900 border-zinc-700'
                        }`}
                      >
                        <option value="DKK">DKK (kr)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>

                      <div className="flex border p-0.5">
                        <button 
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-2 py-1 text-[9px] uppercase font-sans ${billingCycle === 'monthly' ? 'bg-orange-600 text-white font-bold' : 'opacity-60'}`}
                        >
                          Monthly
                        </button>
                        <button 
                          onClick={() => setBillingCycle('yearly')}
                          className={`px-2 py-1 text-[9px] uppercase font-sans ${billingCycle === 'yearly' ? 'bg-orange-600 text-white font-bold' : 'opacity-60'}`}
                        >
                          Yearly
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    
                    {/* Free Plan / Linen Starter */}
                    <div className={`border p-6 rounded-none relative flex flex-col justify-between ${
                      currentUser.plan === 'free' ? 'ring-2 ring-amber-500' : ''
                    } ${isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'}`}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase tracking-widest text-[#9c8469] font-bold">Tier 01</span>
                          {currentUser.plan === 'free' && <span className="bg-amber-500 text-white text-[8px] font-bold uppercase px-2 py-0.5 animate-pulse">Active Spec</span>}
                        </div>
                        <h4 className="text-lg font-bold tracking-tight uppercase">Linen Starter</h4>
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed">Essential setup for starting Scandinavian styles with premium credit triggers.</p>
                        <div className="pt-2">
                          <span className="text-2xl font-bold font-mono tracking-tight">{getSimulatedPrice(20)}</span>
                        </div>
                        <ul className="text-xs space-y-2 pt-4 border-t border-dashed border-stone-200/50">
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Access to 20 blueprints</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 5 active credits</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 1 active workspace template</li>
                          <li className="flex items-center gap-2 opacity-40"><CheckCircle className="w-3.5 h-3.5" /> Direct platform export</li>
                        </ul>
                      </div>
                      <div className="pt-6">
                        <button 
                          disabled={currentUser.plan === 'free'}
                          onClick={() => handleUpdateSubscription(currentUser.id, 'free')}
                          className={`w-full py-2.5 text-center text-[10px] uppercase font-bold tracking-wider border cursor-pointer transition ${
                            currentUser.plan === 'free' 
                              ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed' 
                              : 'bg-white border-stone-800 text-stone-800 hover:bg-stone-900 hover:text-white'
                          }`}
                        >
                          {currentUser.plan === 'free' ? 'Current License' : 'Downgrade to Starter'}
                        </button>
                      </div>
                    </div>

                    {/* Atelier Pro Plan */}
                    <div className={`border p-6 rounded-none relative flex flex-col justify-between ${
                      currentUser.plan === 'pro' ? 'ring-2 ring-indigo-500' : ''
                    } ${isWarmTheme ? 'bg-white border-stone-200 shadow-sm' : 'bg-zinc-950 border-zinc-800'}`}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase tracking-widest text-[#9c8469] font-bold">Tier 02 // Popular</span>
                          {currentUser.plan === 'pro' && <span className="bg-indigo-500 text-white text-[8px] font-bold uppercase px-2 py-0.5 animate-pulse">Active Spec</span>}
                        </div>
                        <h4 className="text-lg font-bold tracking-tight uppercase">Atelier Pro</h4>
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed">Dynamic simulation editing, blueprint code download, and full client configuration access.</p>
                        <div className="pt-2">
                          <span className="text-2xl font-bold font-mono tracking-tight">{getSimulatedPrice(199)}</span>
                        </div>
                        <ul className="text-xs space-y-2 pt-4 border-t border-dashed border-stone-200/50">
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Browsing of 50 blueprints</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 50 active sandbox saves</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Standard source code export</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 20 AI Sandbox compiles/mo</li>
                        </ul>
                      </div>
                      <div className="pt-6">
                        <button 
                          disabled={currentUser.plan === 'pro'}
                          onClick={() => handleUpdateSubscription(currentUser.id, 'pro')}
                          className={`w-full py-2.5 text-center text-[10px] uppercase font-bold tracking-wider border cursor-pointer transition ${
                            currentUser.plan === 'pro'
                              ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-[#2C2A27] border-[#2C2A27] text-white hover:bg-[#4E4A45]'
                          }`}
                        >
                          {currentUser.plan === 'pro' ? 'Current License' : 'Upgrade to Pro'}
                        </button>
                      </div>
                    </div>

                    {/* Studio Max Plan */}
                    <div className={`border p-6 rounded-none relative flex flex-col justify-between ${
                      currentUser.plan === 'max' ? 'ring-2 ring-[#c5a880]' : ''
                    } ${isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'}`}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase tracking-widest text-[#9c8469] font-bold">Tier 03 // Enterprise</span>
                          {currentUser.plan === 'max' && <span className="bg-[#c5a880] text-[#2C2A27] text-[8px] font-bold uppercase px-2 py-0.5 animate-pulse">Active Spec</span>}
                        </div>
                        <h4 className="text-lg font-bold tracking-tight uppercase">Studio Max</h4>
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed">Commercial level permissions with bespoke agency branding features and custom AI asset tools.</p>
                        <div className="pt-2">
                          <span className="text-2xl font-bold font-mono tracking-tight">{getSimulatedPrice(499)}</span>
                        </div>
                        <ul className="text-xs space-y-2 pt-4 border-t border-dashed border-stone-200/50">
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> All Atelier Pro features +</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> AI Generative assets</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Access to 70 templates</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Commercial deployment license</li>
                        </ul>
                      </div>
                      <div className="pt-6">
                        <button 
                          disabled={currentUser.plan === 'max'}
                          onClick={() => handleUpdateSubscription(currentUser.id, 'max')}
                          className={`w-full py-2.5 text-center text-[10px] uppercase font-bold tracking-wider border cursor-pointer transition ${
                            currentUser.plan === 'max'
                              ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-[#c5a880] border-[#c5a880] text-stone-900 hover:bg-[#dfc49f]'
                          }`}
                        >
                          {currentUser.plan === 'max' ? 'Current License' : 'Acquire Super License'}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Profiler Active Privileges summary sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <div className={`p-6 border rounded-none ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                  }`}>
                    <h3 className="text-md font-bold uppercase tracking-wide flex items-center gap-2 font-sans border-b pb-3 mb-4">
                      <Sliders className="w-4 h-4 text-amber-500" /> Current Privileges Map
                    </h3>

                    <div className="space-y-4 font-sans text-xs">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="opacity-60">System Role Level</span>
                          <span className="font-bold uppercase text-amber-600">{currentUser.role}</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-none overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-500" 
                            style={{ width: currentUser.role === 'admin' ? '100%' : currentUser.role === 'studio' ? '66%' : '33%' }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="opacity-60">
                            {currentUser.plan === 'free' ? 'Starter Credits Meter' : 'Compiles Allowance Meter'}
                          </span>
                          <span className="font-bold">
                            {currentUser.plan === 'free' ? '5 / 5 credits' : currentUser.plan === 'pro' ? '12 / 20 compiles' : 'Unlimited'}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-none overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full transition-all duration-500" 
                            style={{ width: currentUser.plan === 'free' ? '100%' : currentUser.plan === 'pro' ? '60%' : '100%' }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="opacity-60">Active Saved Templates</span>
                          <span className="font-bold">
                            {currentUser.plan === 'free' ? '1 / 1 templates' : currentUser.plan === 'pro' ? '12 / 50 saves' : 'Commercial (70 templates limit)'}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-none overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-500" 
                            style={{ width: currentUser.plan === 'free' ? '100%' : currentUser.plan === 'pro' ? '24%' : '100%' }}
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t text-[10px] space-y-2 text-zinc-500">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 font-sans uppercase tracking-wider">Access Clearance Key</p>
                        <div className="p-2 bg-stone-100/50 flex flex-col font-mono text-[9px] truncate">
                          <span>CREDENTIAL_JWT_BLOCK:</span>
                          <span className="truncate text-indigo-400">cph_jwt_bdf9c288f01a.{currentUser.role}.signature.{currentUser.plan}</span>
                        </div>
                        <p className="font-sans font-light leading-relaxed">
                          Your profile role governs which sandbox controls display. Switch to an Admin preset above to check management statistics or Studio preset to design bespoke brand kits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Studio Workspace Controls (Only Studio or Admin) */}
          {activeTab === 'studio' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual client directory */}
                <div className="lg:col-span-6 space-y-6">
                  <div className={`p-6 border rounded-none ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                  }`}>
                    <h3 className="text-md font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" /> Studio Client Roster
                    </h3>
                    <p className="text-xs opacity-60 font-sans mb-4">Link design templates and track live specs directly aligned under your digital agency roster.</p>

                    <form onSubmit={handleAddClientProject} className="flex gap-2 mb-6">
                      <div className="flex-1">
                        <input 
                          type="text"
                          placeholder="Client Brand Name..."
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          className={`w-full p-2 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-white' : 'bg-zinc-90 w-full'
                          }`}
                        />
                      </div>
                      <div className="w-52">
                        <select 
                          value={selectedSpecName} 
                          onChange={(e) => setSelectedSpecName(e.target.value)}
                          className={`w-full p-2 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-white text-black' : 'bg-zinc-900 border-zinc-700'
                          }`}
                        >
                          {FiftyNordicTemplates.map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name} ({t.platform})
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="bg-stone-900 hover:bg-stone-800 text-white font-sans text-xs font-bold uppercase px-4 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </form>

                    <div className="space-y-3 font-sans text-xs">
                      {studioProjects.map((p) => (
                        <div 
                          key={p.id} 
                          className={`p-3 border flex items-center justify-between transition-colors ${
                            isWarmTheme ? 'bg-stone-50 border-stone-100 hover:bg-stone-100' : 'bg-zinc-900/40 border-zinc-900 hover:bg-zinc-900/80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 dark:text-stone-100">{p.client}</span>
                              <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm ${
                                isWarmTheme ? 'bg-[#c5a880]/15 text-yellow-800' : 'bg-zinc-800 text-yellow-400'
                              }`}>{p.status}</span>
                            </div>
                            <p className="text-[10px] opacity-60">Compiled Base: <span className="underline">{p.templateName}</span></p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                const matched = FiftyNordicTemplates.find(t => t.name === p.templateName);
                                if (matched) onLaunchTemplate(matched);
                              }}
                              className="px-2.5 py-1 bg-white text-stone-800 border text-[9px] uppercase font-bold hover:bg-stone-900 hover:text-white transition cursor-pointer"
                            >
                              Sandbox
                            </button>
                            <button 
                              onClick={() => handleDeleteClientProject(p.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brand asset overrides */}
                <div className="lg:col-span-6 space-y-6">
                  <div className={`p-6 border rounded-none ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                  }`}>
                    <h3 className="text-md font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#c5a880]" /> Agency Bespoke overrides
                    </h3>
                    <p className="text-xs opacity-60 font-sans mb-4">Overwrite variables to export client branding spec sheets under your own signature.</p>

                    <div className="space-y-4 font-sans text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase opacity-65 mb-1">Corporate Accent Color</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" defaultValue="#c5a880" className="w-8 h-8 cursor-pointer border-0" />
                            <span className="font-mono text-[10px] tracking-widest uppercase">#c5a880</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase opacity-65 mb-1">Background Linen</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" defaultValue="#FAF8F5" className="w-8 h-8 cursor-pointer border-0" />
                            <span className="font-mono text-[10px] tracking-widest uppercase">#FAF8F5</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase opacity-65 mb-1">Agency Typography</label>
                        <select className={`w-full p-2 border text-xs focus:ring-1 focus:ring-[#c5a880] focus:outline-none ${
                          isWarmTheme ? 'bg-white text-black' : 'bg-zinc-900 border-zinc-700'
                        }`}>
                          <option>Avenue Grotesque paired with Garamond Display</option>
                          <option>Space Mono paired with Helvetica Neue</option>
                          <option>Times New Roman paired with Inter</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase opacity-65 mb-1">Custom Digital Signature Logo (SVG representation)</label>
                        <textarea 
                          rows={2} 
                          placeholder="<svg ...> ... </svg>"
                          className={`w-full p-2 border font-mono text-[10px] focus:ring-1 focus:ring-[#c5a880] focus:outline-none ${
                            isWarmTheme ? 'bg-white text-black' : 'bg-zinc-900 border-zinc-700'
                          }`}
                        />
                      </div>

                      <div className="pt-4 flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => alert('Brand Assets successfully saved in local tenant storage. All active sandbox runs will apply these parameters.')}
                          className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-[10px] uppercase font-bold tracking-widest cursor-pointer"
                        >
                          Sync Global Overrides
                        </button>
                        <button 
                          type="button" 
                          className={`p-2 border group cursor-pointer ${
                            isWarmTheme ? 'border-dt border-stone-350 bg-stone-50 hover:bg-stone-100' : 'bg-zinc-900 border-zinc-700'
                          }`}
                          title="Download spec JSON package"
                          onClick={() => alert('Spec JSON successfully packed in local zip compilation.')}
                        >
                          <Download className="w-4 h-4 text-stone-500 hover:text-black dark:text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Admin Cabinets Terminal (Only Admin role) */}
          {activeTab === 'admin' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Graphic stats counters crafted with pure CSS and beautifully detailed SVGs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                
                {/* Total licensing fees */}
                <div className={`p-6 border rounded-none flex items-center justify-between ${
                  isWarmTheme ? 'bg-white border-stone-200 shadow-xs' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#9c8469] tracking-wider block">Accumulated Licensing Fee (MRR)</span>
                    <div className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                      kr {(totalSystemMRR * 6.9).toLocaleString()}
                    </div>
                    <span className="text-[9px] opacity-50 block">Converts from € {usersList.reduce((a, b) => a + b.mrr, 0)} base cost</span>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-none">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Total registered tenant accounts */}
                <div className={`p-6 border rounded-none flex items-center justify-between ${
                  isWarmTheme ? 'bg-white border-stone-200 shadow-xs' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#9c8469] tracking-wider block">Total Tracked Tenant ID Nodes</span>
                    <div className="text-3xl font-bold font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
                      {usersList.length} Accounts
                    </div>
                    <span className="text-[9px] opacity-70 block">
                      Admin ({usersList.filter(u => u.role === 'admin').length}) | 
                      Studio ({usersList.filter(u => u.role === 'studio').length}) | 
                      User ({usersList.filter(u => u.role === 'user').length})
                    </span>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-none">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* Subscriptions breakdown */}
                <div className={`p-6 border rounded-none flex items-center justify-between ${
                  isWarmTheme ? 'bg-white border-stone-200 shadow-xs' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#9c8469] tracking-wider block">Licensing Distribution</span>
                    <div className="text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                      <span className="text-indigo-500 font-mono text-sm">{Math.round((usersList.filter(u => u.plan === 'max').length / usersList.length) * 100)}% Max //</span>
                      <span className="text-stone-400 font-mono text-sm">{Math.round((usersList.filter(u => u.plan === 'free').length / usersList.length) * 100)}% Starter</span>
                    </div>
                    {/* Tiny visual representation bar */}
                    <div className="w-36 bg-stone-100 h-1 mt-1 flex">
                      <div className="bg-[#c5a880] h-full" style={{ width: `${(usersList.filter(u => u.plan === 'max').length / usersList.length) * 100}%` }} />
                      <div className="bg-indigo-500 h-full" style={{ width: `${(usersList.filter(u => u.plan === 'pro').length / usersList.length) * 100}%` }} />
                      <div className="bg-stone-300 h-full scroll-px-4" style={{ width: `${(usersList.filter(u => u.plan === 'free').length / usersList.length) * 100}%` }} />
                    </div>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-stone-50 dark:bg-zinc-900 text-stone-500 rounded-none border">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Master directory list with dynamic filters & user elevation switcher */}
              <div className={`p-6 border rounded-none ${
                isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-wide">Secure Database & Roles Switcher</h3>
                    <p className="text-xs opacity-60 font-sans mt-0.5">Edit credentials, elevate user roles, modify subscription plans, or delete tenant identities from local database store.</p>
                  </div>
                  
                  {/* SEARCH bar and FILTER role */}
                  <div className="flex flex-wrap gap-2">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 text-stone-400" />
                      <input 
                        type="text"
                        placeholder="Search system registry..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className={`pl-8 pr-3 py-1.5 font-sans border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                          isWarmTheme ? 'bg-white text-black border-stone-200' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                        }`}
                      />
                    </div>
                    
                    <select 
                      value={roleFilter} 
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className={`p-1.5 font-sans border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                        isWarmTheme ? 'bg-white text-black border-stone-200' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      }`}
                    >
                      <option value="All">All Roles</option>
                      <option value="user">User</option>
                      <option value="studio">Studio</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button 
                      onClick={() => {
                        setUsersList(INITIAL_USERS);
                        alert('Tenant registry reset successfully to defaults.');
                      }}
                      className="px-3 py-1.5 bg-red-950/20 text-red-500 border border-red-900/30 font-sans font-bold text-xs hover:bg-red-900 hover:text-white transition cursor-pointer"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>

                {/* Table directory */}
                <div className="overflow-x-auto text-xs font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase font-bold tracking-wider opacity-60 ${isWarmTheme ? 'border-stone-100' : 'border-zinc-800'}`}>
                        <th className="py-3 px-3">Tenant Name</th>
                        <th className="py-3 px-3">Email Address</th>
                        <th className="py-3 px-3">Registered On</th>
                        <th className="py-3 px-3">Sync Role (Elevate)</th>
                        <th className="py-3 px-3">Plan (License)</th>
                        <th className="py-3 px-3 text-right">Tally Cost</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100/30">
                      {filteredUsers.map((u) => (
                        <tr 
                          key={u.id}
                          className={`hover:bg-amber-100/10 transition-colors ${
                            u.id === currentUser.id ? 'bg-indigo-50/15' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-semibold text-stone-900 dark:text-stone-100">
                            {u.name} {u.id === currentUser.id && ' (You)'}
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-zinc-400">{u.email}</td>
                          <td className="py-3 px-3 opacity-70 font-mono text-[10px]">{u.registeredAt}</td>
                          
                          {/* Dynamic ROLE Switcher selector */}
                          <td className="py-2 px-3">
                            <select 
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value as any)}
                              className={`p-1 border rounded-xs font-sans text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none uppercase font-bold ${
                                u.role === 'admin' ? 'text-amber-500' : u.role === 'studio' ? 'text-indigo-400' : 'text-emerald-500'
                              } ${
                                isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-90 w-full'
                              }`}
                            >
                              <option value="user">User</option>
                              <option value="studio">Studio</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          {/* Dynamic Subscription Switcher selector */}
                          <td className="py-2 px-3">
                            <select
                              value={u.plan}
                              onChange={(e) => handleUpdateSubscription(u.id, e.target.value as any)}
                              className={`p-1 border rounded-xs font-sans text-[11px] focus:ring-1 focus:ring-indigo-500 focus:outline-none uppercase ${
                                isWarmTheme ? 'bg-white border-stone-200 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                              }`}
                            >
                              <option value="free">Linen Starter</option>
                              <option value="pro">Atelier Pro</option>
                              <option value="max">Studio Max</option>
                            </select>
                          </td>

                          <td className="py-3 px-3 text-right font-mono text-zinc-600 dark:text-zinc-400 text-[10px]">
                            kr {(u.mrr * 6.9).toFixed(0)}
                          </td>

                          <td className="py-2 px-3 text-right">
                            {u.id !== currentUser.id ? (
                              <button 
                                onClick={() => {
                                  if (confirm(`Revoke and delete the subscription node for ${u.name}?`)) {
                                    setUsersList(usersList.filter(item => item.id !== u.id));
                                  }
                                }}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 transition cursor-pointer"
                                title="Revoke access document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-zinc-400 italic">Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Registration of custom identity nodes */}
          {activeTab === 'register' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto animate-fade-in font-sans">
              
              {/* Left Column: Manual Passport Creation */}
              <div className="lg:col-span-6 space-y-6">
                <div className={`p-8 border rounded-none shadow-sm ${
                  isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="space-y-1 mb-8 border-b pb-4">
                    <span className="text-[9px] uppercase tracking-widest bg-amber-150 text-amber-850 px-2 py-0.5 font-bold font-mono">CREDENTIAL_MANUAL</span>
                    <h3 className="text-lg font-bold uppercase tracking-wide mt-1">Manual Identity Passport</h3>
                    <p className="text-xs opacity-60">Generate a custom tenant credential passport containing unique Role permissions and Subscription plans.</p>
                  </div>

                  <form onSubmit={handleRegisterNode} className="space-y-6 text-xs">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Descriptive Full Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Henrik Ibsen"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                          isWarmTheme ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Unique Digital Email Address</label>
                      <input 
                        type="email"
                        required
                        placeholder="e.g. henrik@ateliers.se"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                          isWarmTheme ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">System Authorization Role</label>
                        <select 
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as any)}
                          className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-white text-black border-stone-150' : 'bg-zinc-90 w-full'
                          }`}
                        >
                          <option value="user">User (Standard Customer)</option>
                          <option value="studio">Studio (Professional Designer)</option>
                          <option value="admin">Admin (Systems Controller)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Initial Subscription License</label>
                        <select 
                          value={regPlan}
                          onChange={(e) => setRegPlan(e.target.value as any)}
                          className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        >
                          <option value="free">Linen Starter (20 kr/mo)</option>
                          <option value="pro">Atelier Pro (199 kr/mo)</option>
                          <option value="max">Studio Max (499 kr/mo)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-sans text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                      >
                        Compile Passport & Activate Session
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Google Sign-In & Federated SSO Portal */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Visual Google Register Card */}
                <div className={`p-8 border-2 rounded-none relative overflow-hidden space-y-6 flex flex-col justify-between ${
                  isWarmTheme ? 'bg-[#FCFAF7] border-stone-300' : 'bg-[#0f0f11] border-zinc-700'
                }`}>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-500 text-[#2C2A27] px-2 py-0.5 text-[8px] tracking-widest font-bold uppercase rounded-xs">
                        SECURE FEDERATED AUTH
                      </span>
                      {currentUser.email === googleUserEmail ? (
                        <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          GOOGLE LINKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono opacity-50 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          AWAITING SSO
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 border-b pb-4 border-[#2C2A27]/10 dark:border-zinc-800">
                      <h3 className="text-xl font-black uppercase tracking-widest text-[#2C2A27] dark:text-amber-400 font-display flex items-center gap-2">
                        🔑 GOOGLE CREDENTIAL PORTAL
                      </h3>
                      <p className="text-xs opacity-75 leading-relaxed font-sans font-light">
                        Accelerate profile creation by connecting your authorized Google account. This registers your mailbox instantly and grants administrative access permissions.
                      </p>
                    </div>

                    {/* Target Google parameters setup */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Mock Authorized Google Name</label>
                        <input 
                          type="text" 
                          value={googleUserName}
                          onChange={(e) => setGoogleUserName(e.target.value)}
                          className={`w-full p-2.5 border text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 ${
                            isWarmTheme ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Mock Authorized Google Email</label>
                        <input 
                          type="email" 
                          value={googleUserEmail}
                          onChange={(e) => setGoogleUserEmail(e.target.value)}
                          className={`w-full p-2.5 border text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 ${
                            isWarmTheme ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Google Action Button */}
                    <div className="pt-4">
                      <button
                        onClick={handleGoogleRegisterAuth}
                        disabled={isGoogleLoading}
                        className="w-full py-4 bg-white text-black border border-stone-300 hover:bg-stone-50 text-center text-xs font-bold uppercase tracking-wider transition cursor-pointer select-none shadow-sm flex items-center justify-center gap-2.5"
                      >
                        {isGoogleLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          // Custom Google Color-styled Icon simulation in SVG
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887C18.2 16.96 15.63 19.2 12.24 19.2c-3.98 0-7.2-3.21-7.2-7.2s3.22-7.2 7.2-7.2c1.74 0 3.34.62 4.59 1.635l3.235-3.235C18.065 1.44 15.35 0 12.24 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.288 0 11.43-4.56 11.43-11.43 0-.6-.054-1.185-.15-1.715H12.24z" />
                          </svg>
                        )}
                        <span>{isGoogleLoading ? 'Initiating OAuth Handshake...' : 'Sign Up & Login with Google'}</span>
                      </button>
                    </div>

                  </div>

                  {/* Config Instructions */}
                  <div className="p-4 bg-stone-100/60 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs space-y-2 leading-relaxed">
                    <span className="font-bold uppercase text-stone-700 dark:text-zinc-200 block text-[9px] tracking-wider">OAUTH CREDENTIAL EXPORT SNIPPET</span>
                    <p className="text-[10px] opacity-75">
                      To integrate a production Google authorization link, place these client variables inside your backend process:
                    </p>
                    <pre className="p-2 bg-[#2C2A27] text-white font-mono text-[9px] overflow-x-auto rounded-none">
{`// googleOAuthEndpoint.ts
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'https://nordic-theme-lab.io/auth/google/callback'
});`}
                    </pre>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 5: Deployment, Compilation & Hosting Suite */}
          {activeTab === 'deploy' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in font-sans">
              
              {/* Left Column: Compilation & Zipping Actions */}
              <div className="lg:col-span-6 space-y-6">
                
                 {/* Simulated Download Section with Option #1 Blueprint Customizer */}
                <div className={`p-6 border rounded-none relative overflow-hidden space-y-5 ${
                  isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider font-sans">WORKSPACE COMPILER</span>
                    <span className="text-[9px] font-mono opacity-50">NODE_VERSION: 20+</span>
                  </div>

                  <div>
                    <h3 className="text-md font-bold tracking-tight uppercase mb-1">Interactive Custom Spec Sheet Builder</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                      Configure details for the selected Danish layout specification to dynamically hydrate the exported technical client manifest.
                    </p>
                  </div>

                  {/* Active Form Fields */}
                  <div className="space-y-4 pt-1 text-xs">
                    {/* Select active blueprint template */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider font-bold opacity-60">TARGET BLUEPRINT TEMPLATE</label>
                      <select 
                        value={selectedSpecName} 
                        onChange={(e) => setSelectedSpecName(e.target.value)}
                        className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                          isWarmTheme ? 'bg-white border-stone-250' : 'bg-[#121212] text-white border-zinc-800'
                        }`}
                      >
                        {FiftyNordicTemplates.map(t => (
                          <option key={t.id} value={t.name}>{t.id} - {t.name} ({t.category})</option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Focus Tagline */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider font-bold opacity-60">BRAND CLIENT FOCUS / TAGLINE</label>
                      <input 
                        type="text"
                        placeholder="e.g. Bespoke Handmade Ceramics atelier"
                        value={specCustomTagline}
                        onChange={(e) => setSpecCustomTagline(e.target.value)}
                        className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                          isWarmTheme ? 'bg-white border-stone-250' : 'bg-[#121212] text-white border-zinc-800'
                        }`}
                      />
                    </div>

                    {/* Custom Swatch Paint Choice */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider font-bold opacity-60">BACKGROUND COVER HEX</label>
                        <div className="flex gap-2">
                          <input 
                            type="color"
                            value={specPrimarySwatch}
                            onChange={(e) => setSpecPrimarySwatch(e.target.value)}
                            className="w-8 h-8 rounded-none border-stone-300 cursor-pointer shrink-0"
                          />
                          <input 
                            type="text"
                            value={specPrimarySwatch}
                            onChange={(e) => setSpecPrimarySwatch(e.target.value)}
                            placeholder="#FFFFFF"
                            className={`w-full p-1.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                              isWarmTheme ? 'bg-white border-stone-250' : 'bg-[#121212] text-white border-zinc-800'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider font-bold opacity-60">ACCENT PAINT HEX</label>
                        <div className="flex gap-2">
                          <input 
                            type="color"
                            value={specAccentSwatch}
                            onChange={(e) => setSpecAccentSwatch(e.target.value)}
                            className="w-8 h-8 rounded-none border-stone-300 cursor-pointer shrink-0"
                          />
                          <input 
                            type="text"
                            value={specAccentSwatch}
                            onChange={(e) => setSpecAccentSwatch(e.target.value)}
                            placeholder="#000000"
                            className={`w-full p-1.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                              isWarmTheme ? 'bg-white border-stone-250' : 'bg-[#121212] text-white border-zinc-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Creative brief Notes */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider font-bold opacity-60">CREATIVE BRIEF / SERVICE NOTES</label>
                      <textarea 
                        rows={3}
                        placeholder="Describe special layout rules..."
                        value={specCustomNotes}
                        onChange={(e) => setSpecCustomNotes(e.target.value)}
                        className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                          isWarmTheme ? 'bg-white border-stone-250' : 'bg-[#121212] text-white border-zinc-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="border-t border-dashed border-stone-200/55 pt-4">
                    {isCompilingForDownload ? (
                      <div className="p-5 bg-stone-100/40 border border-dashed rounded-none space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="animate-pulse text-[#9c8469]">{downloadStepMsg}</span>
                          <span className="font-mono">{downloadProgress}%</span>
                        </div>
                        <div className="w-full bg-stone-200 h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#c5a880] h-full transition-all duration-300"
                            style={{ width: `${downloadProgress}%` }}
                          />
                        </div>
                        <p className="text-[10px] opacity-50">Please do not navigate away. Encoding parameters...</p>
                      </div>
                    ) : (
                      <button
                        onClick={triggerSimulatedDownload}
                        className="w-full py-4 text-center text-xs uppercase font-bold tracking-widest border border-stone-800 bg-stone-900 text-white hover:bg-[#c5a880] hover:text-stone-950 hover:border-[#c5a880] transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Trigger Spec Sheet Build & Download (.TXT)
                      </button>
                    )}
                  </div>

                  <div className="mt-4 p-4 border border-stone-250 bg-amber-50/10 text-xs rounded-none space-y-2">
                    <h5 className="font-bold uppercase text-amber-600 flex items-center gap-1.5">
                      💡 Pro Workspace Note
                    </h5>
                    <p className="leading-relaxed text-[11px]">
                      Because browser sandboxing blocks direct file-system zip triggers inside this preview frame, your config generates an authentic dynamic <strong>Technical Spec Sheet</strong> customized for <strong>{currentUser.name}</strong>.
                    </p>
                    <p className="leading-relaxed text-[11px] opacity-75">
                      To download the exact physical source project structure, use the top-right settings drawer and select <strong>"Export as ZIP"</strong> or <strong>"Export to Github"</strong>!
                    </p>
                  </div>
                </div>

                {/* Next.js & Vercel Custom Integration Blocks */}
                <div className={`p-6 border rounded-none ${
                  isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Framework Spec & Ingress rules</h3>
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 uppercase font-bold rounded-xs">Vercel Core Verified</span>
                  </div>

                  <div className="flex border-b border-stone-200 mb-5 font-sans">
                    <button
                      onClick={() => setDeployFramework('nextjs')}
                      className={`flex-1 pb-2 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
                        deployFramework === 'nextjs'
                          ? 'border-b-2 border-indigo-600 text-indigo-600'
                          : 'opacity-50 hover:opacity-105 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      ▲ Next.js / Vercel Web
                    </button>
                    <button
                      onClick={() => setDeployFramework('vite')}
                      className={`flex-1 pb-2 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
                        deployFramework === 'vite'
                          ? 'border-b-2 border-emerald-500 text-emerald-500'
                          : 'opacity-50 hover:opacity-105 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      ⚛ Vite / Static Edge
                    </button>
                  </div>
                  
                  <div className="space-y-4 text-xs font-sans">
                    {deployFramework === 'nextjs' ? (
                      <div className="space-y-4 animate-fade-in">
                        <div className="border border-stone-150 p-4 rounded-none bg-stone-50/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-indigo-600 uppercase">⚡ NEXT.JS ENGINE RUNTIME</span>
                            <span className="text-[10px] font-mono text-zinc-500">App Router</span>
                          </div>
                          <p className="text-[11px] opacity-70 mb-2 leading-relaxed">
                            Active template <strong className="text-stone-800 dark:text-stone-200">{selectedSpecName}</strong> initialized with Server Component hydrates and Vercel edge routes.
                          </p>
                          <div className="p-2 bg-[#2C2A27] text-stone-100 font-mono text-[10px] overflow-x-auto rounded-xs">
{`// next.config.mjs for ${selectedSpecName || 'Next.js App'}
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'savoy.nordicmade.com',
      'www.ateliermond.ch',
      'nordicmade.com',
      'tailwindtoolbox.com'
    ],
  },
  experimental: {
    serverActions: true,
  }
};
export default nextConfig;`}
                          </div>
                        </div>

                        <div className="border border-stone-150 p-4 rounded-none bg-stone-50/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase">▲ VERCEL CLI DEPLOY STEP</span>
                            <span className="text-[10px] font-mono text-[#c5a880] font-bold">production</span>
                          </div>
                          <p className="text-[11px] opacity-70 mb-2 leading-relaxed">
                            Integrate with <code className="p-0.5 bg-stone-150 text-stone-800 rounded font-mono">github.com/vercel/next.js</code> directly or run command lines:
                          </p>
                          <div className="p-2 bg-[#2C2A27] text-stone-100 font-mono text-[10px] overflow-x-auto rounded-xs">
{`# 1. Login & link to project
npx vercel link

# 2. Deploy environmental assets
npx vercel env pull .env.local

# 3. Trigger production build
npx vercel --prod`}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in">
                        <div className="border border-stone-150 p-4 rounded-none bg-stone-50/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-emerald-600 uppercase">⚛ VITE SENSITIVE STATIC BUNDLE</span>
                            <span className="text-[10px] font-mono text-zinc-500">Vite / SPA</span>
                          </div>
                          <p className="text-[11px] opacity-70 mb-2 leading-relaxed">
                            Compiles entire active spec into a self-contained static directory ready for high performance CDN hostings.
                          </p>
                          <div className="p-2 bg-[#2C2A27] text-stone-100 font-mono text-[10px] overflow-x-auto rounded-xs">
{`// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild'
  }
});`}
                          </div>
                        </div>

                        <div className="border border-stone-150 p-4 rounded-none bg-stone-50/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-teal-600 uppercase">⚡ NETLIFY CDN RULES</span>
                            <span className="text-[10px] font-mono text-zinc-500 font-semibold text-emerald-600">netlify.toml</span>
                          </div>
                          <p className="text-[11px] opacity-70 mb-2 leading-relaxed">
                            Build static files with Vite, serving root headers through netlify's edge.
                          </p>
                          <div className="p-2 bg-[#2C2A27] text-stone-100 font-mono text-[10px] overflow-x-auto rounded-xs">
{`# netlify.toml config for site mapping
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Git Repository Sync & Railway Host */}
              <div className="lg:col-span-6 space-y-6 animate-fade-in">
                
                {/* Git Synchronization Portal */}
                <div className={`p-6 border-2 rounded-none space-y-5 relative overflow-hidden ${
                  isWarmTheme ? 'bg-white border-[#2C2A27]' : 'bg-[#0f0f11] border-zinc-700'
                }`}>
                  <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: isWarmTheme ? 'rgba(44,42,39,0.08)' : 'rgba(245,245,245,0.08)' }}>
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-emerald-500 animate-pulse" />
                      <h3 className="text-sm font-black uppercase tracking-wider">Git repository Connector</h3>
                    </div>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      gitLinkStatus === 'linked' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40'
                    }`}>
                      {gitLinkStatus === 'linked' ? 'SYNCHRONIZED' : 'LOCAL WORKSPACE'}
                    </span>
                  </div>

                  <p className="text-xs opacity-75 font-light leading-relaxed">
                    Link your bespoke Scandinavian showroom files directly to a remote git repository (GitHub, GitLab, or Bitbucket) to leverage modern cloud CI/CD pipelines.
                  </p>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Repository URL Destination</label>
                        <input 
                          type="text" 
                          value={gitRepoUrl}
                          onChange={(e) => setGitRepoUrl(e.target.value)}
                          placeholder="github.com/user/project"
                          className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                            isWarmTheme ? 'bg-stone-55 border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Active Target Branch</label>
                        <select 
                          value={gitBranch}
                          onChange={(e) => setGitBranch(e.target.value)}
                          className={`w-full p-2.5 border text-xs focus:ring-2 focus:ring-stone-600 focus:outline-[#c5a880] ${
                            isWarmTheme ? 'bg-stone-55 border-stone-250 text-black' : 'bg-zinc-90 w-full'
                          }`}
                        >
                          <option value="main">main (Default)</option>
                          <option value="production">production</option>
                          <option value="development">development</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase opacity-60">Personal Access Token (PAT) / SSH Secret Key</label>
                      <input 
                        type="password" 
                        value={gitAuthToken}
                        onChange={(e) => setGitAuthToken(e.target.value)}
                        placeholder="ghp_..."
                        className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                          isWarmTheme ? 'bg-stone-55 border-stone-250' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                        }`}
                      />
                    </div>

                    {/* Git Terminal Actions Command Grid */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      <button
                        onClick={() => runGitCommand('init')}
                        disabled={isGitLinking}
                        className="py-1.5 bg-zinc-805 text-stone-700 dark:text-zinc-300 hover:bg-stone-150 dark:hover:bg-zinc-800 border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        git init
                      </button>
                      <button
                        onClick={() => runGitCommand('commit')}
                        disabled={isGitLinking}
                        className="py-1.5 bg-zinc-805 text-stone-700 dark:text-zinc-300 hover:bg-stone-150 dark:hover:bg-zinc-800 border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        add & commit
                      </button>
                      <button
                        onClick={() => runGitCommand('push')}
                        disabled={isGitLinking}
                        className="py-1.5 bg-stone-900 text-[#c5a880] hover:bg-stone-850 border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        push raw
                      </button>
                      <button
                        onClick={() => runGitCommand('pull')}
                        disabled={isGitLinking}
                        className="py-1.5 bg-zinc-805 text-stone-700 dark:text-zinc-300 hover:bg-stone-150 dark:hover:bg-zinc-800 border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        git pull
                      </button>
                    </div>
                  </div>

                  {/* Monospace Git CLI Terminal */}
                  <div className="space-y-1 text-left">
                    <span className="block text-[8px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-[#c5a880]" /> Git CLI stdout terminal
                    </span>
                    <div className="bg-zinc-900 text-zinc-350 p-3 h-32 overflow-y-auto rounded-none text-[9px] font-mono leading-relaxed space-y-1 select-text">
                      {gitTerminalLogs.map((log, idx) => (
                        <div key={idx} className={log.startsWith('[USER') ? 'text-amber-400 font-bold' : log.includes('🟢') ? 'text-emerald-400 font-extrabold' : 'text-zinc-300'}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full-Fidelity Railway Deployment Panel */}
                <div className={`p-8 border-2 rounded-none relative overflow-hidden flex flex-col justify-between ${
                  isWarmTheme ? 'bg-[#FCFAF7] border-[#2C2A27]' : 'bg-[#0f0f11] border-zinc-700'
                }`}>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-500 text-[#2C2A27] px-2 py-0.5 text-[8px] tracking-widest font-bold uppercase rounded-xs">
                        RECOMMENDED HOST
                      </span>
                      <span className="text-xs font-mono font-bold opacity-60">REGISTRATION SPEC</span>
                    </div>

                    <div className="space-y-2 border-b pb-4 border-[#2C2A27]/10 dark:border-zinc-850">
                      <h3 className="text-xl font-black uppercase tracking-widest text-[#2C2A27] dark:text-amber-400 font-display flex items-center gap-2">
                        🚞 RAILWAY CLOUD HOST
                      </h3>
                      <p className="text-xs opacity-75 leading-relaxed font-sans font-light">
                        Deploy your premium full-stack node apps, Express proxy API servers, or pure SPAs on Railway with absolute zero configuration. 
                      </p>
                    </div>

                    {/* Core referral perks */}
                    <div className="space-y-3 font-sans py-2">
                      <h4 className="text-xs font-bold uppercase text-amber-600">Referral Key Benefits Mapping:</h4>
                      <ul className="text-xs space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Automatic Containerization:</strong> Railway scans package.json and fires up your build autonomously.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Custom Node.js Port Ingress:</strong> Out-of-the-box routing mapped to Port 3000 proxy.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Custom Production Credits:</strong> Get free operational runtime credits using this verification referral node.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Core Railway referral actions button */}
                  <div className="pt-8 space-y-4">
                    <a 
                      href="https://railway.com?referralCode=kNWgF4" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full py-4 bg-[#09090b] hover:bg-[#2C2A27] text-white hover:text-[#FAF8F5] text-center text-xs font-bold uppercase tracking-widest transition cursor-pointer select-none border border-black shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Join Railway & Deploy</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    
                    <div className="text-center font-mono text-[9px] opacity-40">
                      REFERRAL_KEY: kNWgF4 • REGISTERED_TENANT: {currentUser.email}
                    </div>
                  </div>

                </div>

                {/* Additional Information on Export */}
                <div className="p-4 border border-dashed rounded-none text-xs space-y-2 opacity-80 leading-relaxed font-light">
                  <span className="font-bold uppercase text-stone-700 dark:text-zinc-200 block">Deploying Server Ingress Setup</span>
                  <p className="text-[11px]">
                    To run the app server-side (for Express or database operations), ensure your <code className="p-0.5 bg-stone-100 dark:bg-stone-800 font-mono">package.json</code> is set up to launch your bundler output. Railway compiles automatically, handling build scripts inside the repo framework.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: Platform Connect, Stripe Authorization & Sync Suite */}
          {activeTab === 'integrations' && (
            <div className="space-y-8 animate-fade-in font-sans">
              
              {/* Main Banner */}
              <div className={`p-8 border rounded-none relative overflow-hidden ${
                isWarmTheme ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-zinc-900'
              }`}>
                <div className="absolute top-0 right-0 p-4 opacity-15">
                  <Cpu className="w-24 h-24 text-stone-400" />
                </div>
                <div className="max-w-3xl space-y-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    Headless Core Connector
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tight font-display">
                    Platform Connectivity Engine
                  </h2>
                  <p className="text-xs opacity-70 leading-relaxed">
                    Couple your bespoke Scandinavian design catalog blueprints with enterprise CMS, open-source commerce backends, and Stripe payment merchant authorizations.
                  </p>
                  
                  {/* Key Utility Bar */}
                  <div className="flex flex-wrap gap-2.5 pt-2 select-none">
                    <button
                      onClick={() => {
                        setSanityToken('sh_san_live_bc1082fd17f354ab8dae92');
                        setMedusaKey('pk_med_sandbox_3cc994feae883c11b');
                        setStripeApiKey('pk_test_51O2a3b4c5d6e7f8g9h0i1j');
                        setStripeAccountId('acct_1HqpScSc992KiZ');
                        setMedusaUrl('https://api.cph-nordic-medusa.io');
                        setSanityProjectId('cph_scandi_lake_8829');
                        setSanityDataset('production');
                      }}
                      className="px-3.5 py-2 bg-emerald-550 hover:bg-emerald-600 text-white bg-emerald-500 hover:bg-emerald-600 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs border border-emerald-600 flex items-center gap-1.5"
                    >
                      🔑 Auto-Fill Sandbox Keys
                    </button>
                    <button
                      onClick={() => {
                        setSanityToken('sh_san_live_************************');
                        setMedusaKey('pk_med_live_************************');
                        setStripeApiKey('sk_live_************************');
                        setStripeAccountId('acct_1HqpScSc992KiZ');
                        setMedusaUrl('http://localhost:9000');
                        setSanityProjectId('cph_scandi_lake_8829');
                        setSanityDataset('production');
                      }}
                      className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer border border-stone-700 flex items-center gap-1.5"
                    >
                      🛡️ Mask Dummy Tokens
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Headless Platforms (Sanity & Medusa) */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Sanity Integration Console */}
                  <div className={`p-6 border rounded-none space-y-5 ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b"
                         style={{ borderColor: isWarmTheme ? 'rgba(44,42,39,0.08)' : 'rgba(245,245,245,0.08)' }}>
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-red-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Sanity.io Content Lake</h3>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        sanitySyncStatus === 'connected' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-405'
                      }`}>
                        {sanitySyncStatus === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase opacity-60">Sanity Project ID</label>
                          <input 
                            type="text" 
                            value={sanityProjectId}
                            onChange={(e) => setSanityProjectId(e.target.value)}
                            placeholder="e.g. cph_scandi_lake"
                            className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                              isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase opacity-60">Dataset</label>
                          <input 
                            type="text" 
                            value={sanityDataset}
                            onChange={(e) => setSanityDataset(e.target.value)}
                            placeholder="production"
                            className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                              isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Sanity Auth Write Token</label>
                        <input 
                          type="password" 
                          value={sanityToken}
                          onChange={(e) => setSanityToken(e.target.value)}
                          placeholder="sh_san_live_..."
                          className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={handleSyncSanity}
                          disabled={isSyncingSanity}
                          className="flex-1 py-2.5 bg-stone-900 text-white hover:bg-[#c5a880] hover:text-stone-950 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSanity ? 'animate-spin' : ''}`} />
                          {isSyncingSanity ? 'Synching Blueprint' : 'Sync Products to Sanity'}
                        </button>

                        <button
                          onClick={() => {
                            const schemaStr = `export default {
  name: 'nordicProduct',
  title: 'Nordic Product Block',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Product Name' },
    { name: 'price', type: 'string', title: 'Price (DKK)' },
    { name: 'category', type: 'string', title: 'Studio Category' },
    { name: 'description', type: 'text', title: 'Design Philosophy Statement' }
  ]
}`;
                            navigator.clipboard.writeText(schemaStr);
                            setCopiedSanitySchema(true);
                            setTimeout(() => setCopiedSanitySchema(false), 2000);
                          }}
                          className={`px-3 py-2.5 border text-[10px] uppercase font-bold tracking-wider transition cursor-pointer flex items-center gap-1 ${
                            isWarmTheme ? 'border-stone-800 hover:bg-stone-100' : 'border-zinc-700 hover:bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          {copiedSanitySchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
                          {copiedSanitySchema ? 'COPIED' : 'Copy GROQ'}
                        </button>
                      </div>
                    </div>

                    {/* Sanity Dev Console Log */}
                    <div className="space-y-1 text-left">
                      <span className="block text-[8px] font-mono opacity-50 uppercase tracking-widest">Sanity Sync Terminal Monitor</span>
                      <div className="bg-zinc-900 text-zinc-350 p-3 h-28 overflow-y-auto rounded-none text-[9px] font-mono leading-relaxed space-y-1 select-text">
                        {sanityLog.map((log, idx) => (
                          <div key={idx} className={log.includes('🟢') ? 'text-emerald-400 font-bold' : log.includes('CONNECTED') ? 'text-blue-400' : ''}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Medusa Headless Commerce Integration Console */}
                  <div className={`p-6 border rounded-none space-y-5 ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-805'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b"
                         style={{ borderColor: isWarmTheme ? 'rgba(44,42,39,0.08)' : 'rgba(245,245,245,0.08)' }}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Medusa headless Engine</h3>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        medusaSyncStatus === 'connected' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-405'
                      }`}>
                        {medusaSyncStatus === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Medusa Backend API URL</label>
                        <input 
                          type="text" 
                          value={medusaUrl}
                          onChange={(e) => setMedusaUrl(e.target.value)}
                          placeholder="e.g. http://localhost:9000"
                          className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Publishable API Key (Client Handshake)</label>
                        <input 
                          type="password" 
                          value={medusaKey}
                          onChange={(e) => setMedusaKey(e.target.value)}
                          placeholder="pk_med_live_..."
                          className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>

                      <button
                        onClick={handleSyncMedusa}
                        disabled={isSyncingMedusa}
                        className="w-full py-2.5 bg-stone-900 text-white hover:bg-[#c5a880] hover:text-stone-950 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMedusa ? 'animate-spin' : ''}`} />
                        {isSyncingMedusa ? 'Handshaking Medusa Node...' : 'Export Blueprint Catalog to Medusa Content Store'}
                      </button>
                    </div>

                    {/* Medusa dev monitor */}
                    <div className="space-y-1 text-left">
                      <span className="block text-[8px] font-mono opacity-50 uppercase tracking-widest">Medusa Engine Event Logs</span>
                      <div className="bg-zinc-900 text-zinc-350 p-3 h-28 overflow-y-auto rounded-none text-[9px] font-mono leading-relaxed space-y-1 select-text">
                        {medusaLog.map((log, idx) => (
                          <div key={idx} className={log.includes('🟢') ? 'text-emerald-400 font-bold' : log.includes('CONNECTED') ? 'text-purple-400' : ''}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cloudflare Zero Trust Access & Tunnel Integration */}
                  <div className={`p-6 border rounded-none space-y-5 ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-850'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b"
                         style={{ borderColor: isWarmTheme ? 'rgba(44,42,39,0.08)' : 'rgba(245,245,245,0.08)' }}>
                      <div className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-sky-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Cloudflare Access & Zero Trust</h3>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        isCloudflareEnforced 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-805 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {isCloudflareEnforced ? 'ZERO TRUST ENFORCED' : 'BYPASSED'}
                      </span>
                    </div>

                    <p className="text-xs opacity-75 font-light leading-relaxed">
                      Incorporate Cloudflare Gateway to authenticate incoming JSON Web Tokens (JWT) asserting identity vectors, and wrap local server interactions in a secure Tunnel ingress.
                    </p>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Cloudflare Access SSO Domain</label>
                        <input 
                          type="text" 
                          value={cloudflareDomain}
                          onChange={(e) => setCloudflareDomain(e.target.value)}
                          placeholder="your-org.cloudflareaccess.com"
                          className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                            isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase opacity-60">Audience Tag ID (AUD Key)</label>
                          <input 
                            type="text" 
                            value={cloudflareClientId}
                            onChange={(e) => setCloudflareClientId(e.target.value)}
                            placeholder="cf-aud-3c2..."
                            className={`w-full p-2.5 border text-xs font-mono focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                              isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase opacity-60">Cloudflare Tunnel Token</label>
                          <input 
                            type="password" 
                            value={cloudflareTunnelToken}
                            onChange={(e) => setCloudflareTunnelToken(e.target.value)}
                            className={`w-full p-2.5 border text-xs font-mono focus:ring-1 focus:ring-stone-600 focus:outline-[#c5a880] ${
                              isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleVerifyCloudflareAccess}
                          disabled={cloudflareVerifyStatus === 'verifying'}
                          className="flex-1 py-2.5 bg-stone-900 text-[#FAF8F5] dark:text-amber-300 hover:bg-stone-850 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {cloudflareVerifyStatus === 'verifying' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                          {cloudflareVerifyStatus === 'verifying' ? 'Verifying SSL Gateway...' : 'Enforce Cloudflare JWT Protection'}
                        </button>

                        <button
                          onClick={() => {
                            setIsCloudflareEnforced(false);
                            setCloudflareVerifyStatus('idle');
                            setCloudflareTerminalLog(prev => [
                              ...prev,
                              `[${new Date().toLocaleTimeString()}] BYPASS: Revoked Zero Trust Gateway protection. Bypassing port 3000 JWT checks.`
                            ]);
                            alert('Cloudflare Access Bypass established. Zero Trust assertion checks disabled.');
                          }}
                          disabled={!isCloudflareEnforced}
                          className={`px-3 py-2.5 border text-[10px] uppercase font-bold tracking-wider transition cursor-pointer flex items-center gap-1 ${
                            isWarmTheme ? 'border-stone-800 hover:bg-stone-100' : 'border-zinc-700 hover:bg-zinc-900 text-zinc-300'
                          } disabled:opacity-40`}
                        >
                          Bypass CF
                        </button>
                      </div>
                    </div>

                    {/* Cloudflare terminal */}
                    <div className="space-y-1 text-left">
                      <span className="block text-[8px] font-mono opacity-50 uppercase tracking-widest">Cloudflare Zero Trust Ingress Log</span>
                      <div className="bg-zinc-900 text-zinc-350 p-3 h-28 overflow-y-auto rounded-none text-[9px] font-mono leading-relaxed space-y-1 select-text">
                        {cloudflareTerminalLog.map((log, idx) => (
                          <div key={idx} className={log.includes('🟢') ? 'text-emerald-400 font-bold' : log.includes('HANDSHAKE') ? 'text-sky-400' : ''}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Stripe Authorized Payments Core Container */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Stripe Authentic Account Box */}
                  <div className={`p-6 border-2 rounded-none space-y-5 relative overflow-hidden ${
                    isWarmTheme ? 'bg-[#FCFAF7] border-[#2C2A27]' : 'bg-[#0f0f11] border-zinc-700'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider">Stripe Payments Console</h3>
                      </div>
                      
                      <div className="flex items-center gap-1.5 select-none">
                        <span className={`w-2 h-2 rounded-full ${
                          stripeAuthStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                        }`} />
                        <span className="text-[10px] font-mono font-bold tracking-tight uppercase">
                          {stripeAuthStatus === 'active' ? 'AUTHORIZED' : 'STALE // DISCONNECTED'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs opacity-70 leading-relaxed font-light">
                      Equip your boutique products catalogue grid with instant client-side checkout buttons that redirect customers to securely sign, authorize, and fulfill transactions on the Stripe network. 
                    </p>

                    {/* Merchant configurations */}
                    <div className="space-y-3 font-sans">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase opacity-60">Stripe Merchant ID</label>
                          <input 
                            type="text" 
                            value={stripeAccountId}
                            onChange={(e) => setStripeAccountId(e.target.value)}
                            placeholder="acct_1HqpScSc"
                            className={`w-full p-2.5 border text-xs font-mono focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                              isWarmTheme ? 'bg-white border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase opacity-60">Currency Spec</label>
                          <select 
                            value={stripeCurrency}
                            onChange={(e) => setStripeCurrency(e.target.value)}
                            className={`w-full p-2.5 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                              isWarmTheme ? 'bg-white border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            }`}
                          >
                            <option value="DKK">DKK (Danish Krone)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="USD">USD (US Dollars)</option>
                            <option value="SEK">SEK (Swedish Krona)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase opacity-60">Stripe Public Key</label>
                        <input 
                          type="text" 
                          value={stripeApiKey}
                          onChange={(e) => setStripeApiKey(e.target.value)}
                          placeholder="pk_live_..."
                          className={`w-full p-2.5 border text-xs font-mono focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                            isWarmTheme ? 'bg-white border-stone-250 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div className="pt-2">
                        {stripeAuthStatus === 'active' ? (
                          <div className="space-y-3">
                            <button
                              onClick={() => setStripeAuthStatus('idle')}
                              className="w-full py-2.5 border border-stone-400 font-sans font-bold hover:bg-stone-105 text-stone-705 text-[10px] uppercase tracking-widest cursor-pointer transition"
                            >
                              Revoke Stripe Authorization
                            </button>
                            <p className="text-[10px] opacity-60 italic leading-relaxed">
                              🔒 Handshake fully secure. Connection verified using Stripe Connect protocol. Transactions will process through your designated checkout routing rules.
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={handleAuthorizeStripe}
                            disabled={isAuthorizingStripe}
                            className="w-full py-3 bg-stone-900 text-amber-300 hover:bg-stone-800 font-sans font-bold text-[10px] uppercase tracking-widest disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isAuthorizingStripe ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                            {isAuthorizingStripe ? 'AUTHORIZING CONNECT MERCHANT...' : 'Grant Stripe Account Authorization Link'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Code and configuration generator container */}
                    <div className="space-y-3 pt-4 border-t border-stone-250/50">
                      <div className="flex border-b border-stone-200">
                        <button 
                          onClick={() => setStripeActiveTab('checkout')}
                          className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${stripeActiveTab === 'checkout' ? 'border-b-2 border-amber-500 text-stone-900 font-extrabold' : 'opacity-50 hover:opacity-100'}`}
                        >
                          Checkout BTN (React)
                        </button>
                        <button 
                          onClick={() => setStripeActiveTab('backend')}
                          className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${stripeActiveTab === 'backend' ? 'border-b-2 border-amber-500 text-stone-900 font-extrabold' : 'opacity-50 hover:opacity-100'}`}
                        >
                          Express Endpoint
                        </button>
                        <button 
                          onClick={() => setStripeActiveTab('metadata')}
                          className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${stripeActiveTab === 'metadata' ? 'border-b-2 border-amber-500 text-stone-900 font-extrabold' : 'opacity-50 hover:opacity-100'}`}
                        >
                          Integration Guide
                        </button>
                      </div>

                      {stripeActiveTab === 'checkout' && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-mono opacity-50">
                            <span>CLIENT_SIDE_STRIPE_BUTTON.TSX</span>
                            <button
                              onClick={() => {
                                const code = `import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("${stripeApiKey}");

export function CheckoutButton({ items }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    if (!stripe) return;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="px-6 py-3 bg-[#c5a880] text-stone-900 border font-bold text-xs uppercase"
    >
      {loading ? 'Routing checkout...' : 'Checkout via Stripe'}
    </button>
  );
}`;
                                navigator.clipboard.writeText(code);
                                setCopiedStripeClient(true);
                                setTimeout(() => setCopiedStripeClient(false), 2000);
                              }}
                              className="text-[9px] underline hover:text-[#9c8469] cursor-pointer"
                            >
                              {copiedStripeClient ? 'COPIED' : 'Copy'}
                            </button>
                          </div>
                          <pre className="p-2 bg-stone-900 text-stone-300 text-[8px] max-h-48 overflow-y-auto font-mono leading-relaxed select-text">
{`import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("${stripeApiKey || 'pk_live_...'}");

export function CheckoutButton({ items }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    if (!stripe) return;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase transition hover:opacity-85"
    >
      {loading ? 'Routing checkout...' : 'Checkout via Stripe'}
    </button>
  );
}`}
                          </pre>
                        </div>
                      )}

                      {stripeActiveTab === 'backend' && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-mono opacity-50">
                            <span>SERVER_SIDE_STRIPE_PROXY.TS</span>
                            <button
                              onClick={() => {
                                const code = `import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
let stripeClient: Stripe | null = null;

function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY variable is missing.');
    stripeClient = new Stripe(key, { apiVersion: '2023-10-16' as any });
  }
  return stripeClient;
}

router.post('/api/create-checkout-session', async (req, res) => {
  try {
    const stripe = getStripe();
    const { items } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((it: any) => ({
        price_data: {
          currency: "${stripeCurrency.toLowerCase()}",
          product_data: { name: it.name },
          unit_amount: Math.round(parseFloat(it.price) * 100) || 12000,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: \`\${process.env.APP_URL || 'http://localhost:3000'}/success\`,
      cancel_url: \`\${process.env.APP_URL || 'http://localhost:3000'}/cancel\`,
    });
    res.json({ id: session.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});`;
                                navigator.clipboard.writeText(code);
                                setCopiedStripeServer(true);
                                setTimeout(() => setCopiedStripeServer(false), 2000);
                              }}
                              className="text-[9px] underline hover:text-[#9c8469] cursor-pointer"
                            >
                              {copiedStripeServer ? 'COPIED' : 'Copy'}
                            </button>
                          </div>
                          <pre className="p-2 bg-stone-900 text-stone-300 text-[8px] max-h-48 overflow-y-auto font-mono leading-relaxed select-text">
{`import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
let stripeClient: Stripe | null = null;

function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY variable is missing.');
    stripeClient = new Stripe(key, { apiVersion: '2023-10-16' as any });
  }
  return stripeClient;
}

router.post('/api/create-checkout-session', async (req, res) => {
  try {
    const stripe = getStripe();
    const { items } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((it: any) => ({
        price_data: {
          currency: "${stripeCurrency.toLowerCase()}",
          product_data: { name: it.name },
          unit_amount: Math.round(parseFloat(it.price) * 100) || 12000,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: \`\${process.env.APP_URL}/success\`,
      cancel_url: \`\${process.env.APP_URL}/cancel\`,
    });
    res.json({ id: session.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});`}
                          </pre>
                        </div>
                      )}

                      {stripeActiveTab === 'metadata' && (
                        <div className="p-3 bg-neutral-900 border border-neutral-805 space-y-2.5 text-stone-300 rounded-none text-xs">
                          <h4 className="font-bold text-[10px] text-amber-500 uppercase flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" /> Direct Credentials Integration Rule
                          </h4>
                          <p className="text-[11px] leading-relaxed opacity-85">
                            This panel reads public tokens with standard environment overrides. To set real private keys, define <code className="bg-stone-850 p-0.5 text-amber-305 font-mono text-[10px]">STRIPE_SECRET_KEY</code> inside <code className="bg-stone-850 p-0.5 text-amber-305 font-mono text-[10px]">.env.example</code>. The AI builder platform will prompt you safely.
                          </p>
                          <div className="border-t border-stone-800 pt-2 space-y-1">
                            <span className="block text-[9px] opacity-50 uppercase font-bold text-stone-400">Security Best Practice:</span>
                            <span className="block text-[10px] leading-relaxed text-emerald-400 font-light">
                              ✔️ Lazily initialize Stripe client on node startup. Avoid triggering initializations globally, preventing servers from crashing if secrets are unpopulated.
                            </span>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Webhook Broker Console Simulator */}
                  <div className={`p-6 border rounded-none space-y-4 ${
                    isWarmTheme ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-805'
                  }`}>
                    <span className="block text-[10px] uppercase font-bold text-[#9D8470] border-b pb-1 select-none">
                      // Local Stripe Webhook Broker Simulator
                    </span>

                    <div className="space-y-3 font-sans">
                      <div className="flex gap-3">
                        <select
                          value={activeWebhookEvent}
                          onChange={(e) => setActiveWebhookEvent(e.target.value)}
                          className={`flex-1 p-2 border text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none cursor-pointer ${
                            isWarmTheme ? 'bg-stone-50 border-stone-250 text-black' : 'bg-zinc-90 w-full'
                          }`}
                        >
                          <option value="checkout.session.completed">checkout.session.completed</option>
                          <option value="payment_intent.succeeded">payment_intent.succeeded</option>
                          <option value="payment_intent.payment_failed">payment_intent.payment_failed</option>
                          <option value="customer.subscription.created">customer.subscription.created</option>
                        </select>

                        <button
                          onClick={handleBroadcastWebhook}
                          disabled={isBroadcastingWebhook}
                          className="px-5 py-2 bg-stone-900 border text-white font-sans font-bold hover:bg-[#c5a880] hover:text-stone-950 hover:border-[#c5a880] transition text-[10px] uppercase tracking-wider cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3 h-3" /> Broadcast Webhook Event
                        </button>
                      </div>

                      <div className="space-y-1 text-left">
                        <span className="block text-[8px] font-mono opacity-50 uppercase tracking-widest">Local Server Port 3000 Ingress Console</span>
                        <div className="bg-zinc-950 text-zinc-350 p-3 h-28 overflow-y-auto rounded-none text-[9px] font-mono leading-relaxed space-y-1 select-text">
                          {webhookLog.map((log, idx) => (
                            <div key={idx} className={log.includes('🟢') ? 'text-emerald-400 font-bold' : log.includes('BROADCAST:') ? 'text-amber-400' : 'text-zinc-400'}>
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>


      </div>

    </div>
  );
}
