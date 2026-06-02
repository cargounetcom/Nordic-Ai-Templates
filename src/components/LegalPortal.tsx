/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, X, ShieldAlert, FileText, Database, Trash2, Download, Lock, CheckSquare, Square, Eye } from 'lucide-react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'studio' | 'user';
  plan: 'free' | 'pro' | 'max';
  registeredAt: string;
  mrr: number;
}

interface LegalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  themeStyle: 'warm' | 'brutalist';
  initialTab?: 'privacy' | 'gdpr' | 'terms';
}

export default function LegalPortal({ isOpen, onClose, themeStyle, initialTab = 'privacy' }: LegalPortalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'gdpr' | 'terms'>(initialTab);
  
  // Local states for the interactive cookie consent manager
  const [consentSaved, setConsentSaved] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Read-only
    analytics: true,
    aiPersonalization: false,
  });

  // Local storage management for user identity nodes
  const [tenantNodes, setTenantNodes] = useState<UserAccount[]>([]);
  const [exportData, setExportData] = useState<string | null>(null);
  const [deleteConfirmationNodeId, setDeleteConfirmationNodeId] = useState<string | null>(null);

  // Sync initial tab when changed
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Load cookies and tenant nodes for the simulator on mount/open
  useEffect(() => {
    if (isOpen) {
      // Cookies
      const savedConsent = localStorage.getItem('nordic_cookie_consent');
      if (savedConsent) {
        try {
          const parsed = JSON.parse(savedConsent);
          setCookieSettings({
            essential: true,
            analytics: parsed.analytics ?? true,
            aiPersonalization: parsed.aiPersonalization ?? false,
          });
        } catch (e) {
          console.error("Failed to parse consent", e);
        }
      }

      // Tenant Nodes directly from the localStorage state used in RoleWorkspace
      const savedUsers = localStorage.getItem('nordic_tenant_users');
      if (savedUsers) {
        try {
          setTenantNodes(JSON.parse(savedUsers));
        } catch (e) {
          console.error("Failed to parse users", e);
        }
      } else {
        // Fallback default mock nodes if not set yet
        const defaults: UserAccount[] = [
          { id: 'usr-101', name: 'Nils Sjöberg', email: 'nils@gothenburg.se', role: 'user', plan: 'free', registeredAt: '2026-01-12', mrr: 20 },
          { id: 'usr-102', name: 'Astrid Lind', email: 'astrid@copenhagen.dk', role: 'studio', plan: 'pro', registeredAt: '2026-02-28', mrr: 199 },
          { id: 'usr-103', name: 'Kopenhagen Atelier Ltd.', email: 'lars@cph-design.dk', role: 'studio', plan: 'max', registeredAt: '2026-03-15', mrr: 499 },
          { id: 'usr-104', name: 'Freja Larsson', email: 'freja@stockholm.se', role: 'user', plan: 'pro', registeredAt: '2026-04-05', mrr: 199 },
          { id: 'usr-105', name: 'Elena Rosengren (You)', email: 'ellanovachenko@gmail.com', role: 'admin', plan: 'max', registeredAt: '2025-12-01', mrr: 499 },
        ];
        setTenantNodes(defaults);
      }
    }
  }, [isOpen]);

  // Handle Cookie Preferences form submission
  const handleSaveConsent = () => {
    localStorage.setItem('nordic_cookie_consent', JSON.stringify(cookieSettings));
    setConsentSaved(true);
    setTimeout(() => {
      setConsentSaved(false);
    }, 3000);
  };

  // GDPR: Right to erasure (delete simulated identity node)
  const handleDeleteNode = (userId: string) => {
    const updated = tenantNodes.filter(node => node.id !== userId);
    setTenantNodes(updated);
    localStorage.setItem('nordic_tenant_users', JSON.stringify(updated));
    setDeleteConfirmationNodeId(null);
    
    // Dispatch custom event to notify RoleWorkspace to update its state
    window.dispatchEvent(new Event('storage'));
  };

  // GDPR: Right of Access (export active user nodes as JSON)
  const handleExportData = () => {
    const jsonStr = JSON.stringify(tenantNodes, null, 2);
    setExportData(jsonStr);
  };

  const handleDownloadJSON = () => {
    if (!exportData) return;
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nordic_tenant_gdpr_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const isWarm = themeStyle === 'warm';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative ${
            isWarm
              ? 'bg-[#FAF8F5] text-[#2C2A27] font-serif border border-stone-200'
              : 'bg-zinc-950 text-zinc-100 font-mono border border-zinc-800'
          }`}
        >
          {/* Top Banner Accent */}
          <div className={`h-1.5 w-full ${isWarm ? 'bg-[#c5a880]' : 'bg-emerald-500'}`} />

          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center" 
               style={{ borderColor: isWarm ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <Shield className={`w-6 h-6 ${isWarm ? 'text-[#c5a880]' : 'text-emerald-400'}`} />
              <div>
                <h2 className={`text-xl uppercase tracking-widest ${isWarm ? 'font-display' : 'font-bold'}`}>
                  NORDIC LABS LEGAL COMPLIANCE
                </h2>
                <p className="text-[10px] font-sans opacity-60 tracking-wider uppercase mt-1">
                  GDPR Center • Cookie Control • Privacy Policies & Node Directories Office
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              id="legal-portal-close"
              className={`p-1.5 transition-colors cursor-pointer border ${
                isWarm 
                  ? 'border-transparent text-stone-500 hover:border-stone-200 hover:bg-stone-100' 
                  : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Grid Section */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-4 min-h-0">
            
            {/* Sidebar Navigation */}
            <div className={`p-4 border-r md:col-span-1 space-y-1.5 ${
              isWarm ? 'bg-stone-50/55 border-stone-100 font-sans' : 'bg-zinc-900/30 border-zinc-900'
            }`}>
              <span className="block text-[8px] font-bold opacity-40 uppercase tracking-widest mb-3 px-2">
                INDEX OF DOCUMENTS
              </span>
              
              <button
                onClick={() => { setActiveTab('privacy'); setExportData(null); }}
                className={`w-full text-left p-2.5 text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'privacy'
                    ? isWarm 
                      ? 'bg-[#2C2A27] text-white font-bold' 
                      : 'bg-zinc-800 text-emerald-400 font-extrabold border-l-2 border-emerald-500'
                    : isWarm
                      ? 'text-stone-600 hover:bg-stone-100'
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Privacy & Cookies</span>
              </button>

              <button
                onClick={() => { setActiveTab('gdpr'); setExportData(null); }}
                className={`w-full text-left p-2.5 text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'gdpr'
                    ? isWarm 
                      ? 'bg-[#2C2A27] text-white font-bold' 
                      : 'bg-zinc-800 text-emerald-400 font-extrabold border-l-2 border-emerald-500'
                    : isWarm
                      ? 'text-stone-600 hover:bg-stone-100'
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>GDPR Node Access</span>
              </button>

              <button
                onClick={() => { setActiveTab('terms'); setExportData(null); }}
                className={`w-full text-left p-2.5 text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'terms'
                    ? isWarm 
                      ? 'bg-[#2C2A27] text-white font-bold' 
                      : 'bg-zinc-800 text-emerald-400 font-extrabold border-l-2 border-emerald-500'
                    : isWarm
                      ? 'text-stone-600 hover:bg-stone-100'
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Terms & Licenses</span>
              </button>

              <div className={`mt-8 p-3 text-[10px] space-y-2 leading-relaxed border ${
                isWarm ? 'bg-amber-50/50 border-amber-200/50 text-stone-600' : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
              }`}>
                <div className="flex gap-1.5 items-center font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>COMPLIANCE RATING</span>
                </div>
                <p className="font-sans">
                  The Nordic Theme Lab fully simulates data protection guidelines representing client sandboxes. All telemetry options are localized to client-side localStorage nodes.
                </p>
              </div>
            </div>

            {/* Document Panel View */}
            <div className="p-6 md:col-span-3 overflow-y-auto space-y-6">
              
              {/* TAB 1: PRIVACY & COOKIES */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className={`p-4 border rounded-none ${
                    isWarm ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 border-zinc-800'
                  }`}>
                    <h3 className={`text-sm uppercase tracking-wide mb-1 ${isWarm ? 'font-serif text-[#c5a880]' : 'font-mono text-emerald-400 font-bold'}`}>
                      Simulated Privacy & Telemetry Guidelines
                    </h3>
                    <p className="text-xs opacity-75 font-sans leading-relaxed">
                      We take Scandinavian data sovereignty seriously. Read about how variables are compiled on-device, how the simulated shop templates store checkout items, and why your keys are nested inside standard environmental configurations.
                    </p>
                  </div>

                  {/* Section: Cookies policy */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#9c8469] border-b pb-1 font-sans">
                      1. Cookie Utilization Framework
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90 font-sans">
                      This application uses client-side storage technologies (including <code>localStorage</code>, <code>sessionStorage</code>, and secure cookies) to handle localized active logins, layout preferences (such as the <strong>Linen Minimalist</strong> vs. <strong>Stark Obsidian</strong> toggle), dynamic shopping bag items, and simulated Medusa sync outputs.
                    </p>
                  </div>

                  {/* Dynamic Cookie Switchboard Board */}
                  <div className={`p-5 border ${isWarm ? 'bg-white border-stone-250' : 'bg-zinc-900/40 border-zinc-800'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className={`w-4 h-4 ${isWarm ? 'text-stone-850' : 'text-emerald-400'}`} />
                      <span className="text-xs font-bold uppercase tracking-widest font-sans">
                        GDPR Dynamic Cookie Switchboard
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {/* Essential */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="font-bold font-sans">Essential Lab Session Cookies (Required)</p>
                          <p className="text-[11px] opacity-60 font-sans">Stores your active subscription tenant ID (such as <code>usr-105</code>), theme states, and standard Stripe webhook simulator logs.</p>
                        </div>
                        <span className="text-[9px] bg-stone-200 text-stone-700 px-2 py-0.5 font-bold uppercase rounded-sm">
                          Strictly Required
                        </span>
                      </div>

                      {/* Analytics */}
                      <div className="flex items-start justify-between gap-4 pt-3 border-t border-dashed"
                           style={{ borderColor: isWarm ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
                        <div className="space-y-0.5">
                          <p className="font-bold font-sans">Analytics & Style Preference Telemetry</p>
                          <p className="text-[11px] opacity-60 font-sans">Used to log your sandbox compilation cycles, template downloads metrics, and active theme customization settings locally.</p>
                        </div>
                        <button
                          onClick={() => setCookieSettings(prev => ({ ...prev, analytics: !prev.analytics }))}
                          className="cursor-pointer"
                        >
                          {cookieSettings.analytics ? (
                            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                              <CheckSquare className="w-5 h-5" />
                              <span>ON</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <Square className="w-5 h-5" />
                              <span>OFF</span>
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Gemini */}
                      <div className="flex items-start justify-between gap-4 pt-3 border-t border-dashed"
                           style={{ borderColor: isWarm ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
                        <div className="space-y-0.5">
                          <p className="font-bold font-sans">Gemini AI Personalization telemetry</p>
                          <p className="text-[11px] opacity-60 font-sans">Allows the Gemini model to store custom prompts and UI structures in your workspace to optimize code generation rates.</p>
                        </div>
                        <button
                          onClick={() => setCookieSettings(prev => ({ ...prev, aiPersonalization: !prev.aiPersonalization }))}
                          className="cursor-pointer"
                        >
                          {cookieSettings.aiPersonalization ? (
                            <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                              <CheckSquare className="w-5 h-5" />
                              <span>ON</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <Square className="w-5 h-5" />
                              <span>OFF</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t flex justify-between items-center"
                         style={{ borderColor: isWarm ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
                      <div className="text-[10px] opacity-50 font-mono">
                        {consentSaved ? (
                          <span className="text-emerald-500 font-bold animate-pulse">● SETTINGS PERSISTED IN SYSTEM OK</span>
                        ) : (
                          <span>COMMIT TO LOCALSTORAGE</span>
                        )}
                      </div>
                      <button
                        onClick={handleSaveConsent}
                        className={`text-[10px] uppercase font-bold py-2 px-4 transition ${
                          isWarm
                            ? 'bg-stone-900 text-white hover:bg-stone-800'
                            : 'bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold'
                        }`}
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Data Process */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#9c8469] border-b pb-1 font-sans">
                      2. Automated Processing of Environmental Keys
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90 font-sans">
                      At no point does this sandbox transmit high-level APIs or user keys to public domains. All compiled modules (such as your designated Stripe credentials, custom SVG vectors, or Medusa engine variables) remain safely packaged on the server-side proxy routes of Port 3000. Under GDPR guidelines, you retain absolute authority to inspect, purge, or extract these configuration assets at any given point.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: GDPR DATA INSPECTOR */}
              {activeTab === 'gdpr' && (
                <div className="space-y-6">
                  {/* Info Banner */}
                  <div className={`p-4 border rounded-none flex items-start gap-3 ${
                    isWarm ? 'bg-amber-50/40 border-amber-200' : 'bg-emerald-950/20 border-emerald-990'
                  }`}>
                    <ShieldAlert className={`w-5 h-5 mt-0.5 shrink-0 ${isWarm ? 'text-amber-600' : 'text-emerald-400'}`} />
                    <div className="space-y-1">
                      <h3 className={`text-sm uppercase tracking-wide leading-none ${isWarm ? 'text-[#2C2A27] font-serif font-bold' : 'font-mono text-emerald-400'}`}>
                        EU General Data Protection Regulation Rights (GDPR)
                      </h3>
                      <p className="text-xs opacity-75 font-sans leading-normal">
                        Under European privacy statutes, you possess explicit rights regarding your digital footprints: 
                        the **Right of Access (Art. 15)** and the **Right to Erasure (Art. 17)**. Use the interactive 
                        inspector down below to review what identity nodes are currently active in the Theme Lab database, 
                        export them in raw structure format, or execute an absolute deletion (forgetting the node).
                      </p>
                    </div>
                  </div>

                  {/* Identity Node Directory */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#9c8469] font-sans">
                        Tenant Identity Node Database (Active Store)
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={handleExportData}
                          className={`text-[9px] uppercase font-bold py-1 px-2 border hover:bg-stone-100 ${
                            isWarm ? 'bg-white text-stone-800' : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          Export All Nodes
                        </button>
                      </div>
                    </div>

                    <div className={`border overflow-x-auto ${isWarm ? 'border-stone-200 bg-white' : 'border-zinc-800 bg-zinc-900/50'}`}>
                      <table className="w-full text-left text-xs font-sans">
                        <thead>
                          <tr className={`border-b ${isWarm ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 border-zinc-800'}`}>
                            <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Node Key</th>
                            <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Entity / Email</th>
                            <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Licence Plan</th>
                            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] text-right">GDPR Rights</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tenantNodes.map((node) => (
                            <tr 
                              key={node.id} 
                              className={`border-b hover:bg-stone-50/40 ${
                                isWarm ? 'border-stone-100' : 'border-zinc-900 hover:bg-zinc-900'
                              }`}
                            >
                              <td className="p-3 font-mono font-bold text-[10px] text-[#9c8469]">{node.id}</td>
                              <td className="p-3">
                                <span className="font-bold block">{node.name}</span>
                                <span className="text-[10px] opacity-60 font-mono block">{node.email}</span>
                              </td>
                              <td className="p-3">
                                <span className={`text-[9px] uppercase px-2 py-0.5 border font-bold rounded-xs inline-block ${
                                  node.plan === 'max'
                                    ? 'bg-[#c5a880]/10 border-[#c5a880] text-[#a4865d]'
                                    : node.plan === 'pro'
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                      : 'bg-stone-100 border-stone-200 text-stone-600'
                                }`}>
                                  {node.plan}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {deleteConfirmationNodeId === node.id ? (
                                  <div className="flex gap-2 justify-end items-center">
                                    <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase">CONFIRM?</span>
                                    <button
                                      onClick={() => handleDeleteNode(node.id)}
                                      className="text-[9px] uppercase bg-rose-600 text-white font-bold py-1 px-1.5 hover:bg-rose-700"
                                    >
                                      [YES]
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmationNodeId(null)}
                                      className="text-[9px] uppercase bg-zinc-400 text-white font-bold py-1 px-1.5 hover:bg-zinc-500"
                                    >
                                      [NO]
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmationNodeId(node.id)}
                                    title="Assert Article 17 Right to Erasure"
                                    className="p-1 px-2 border hover:bg-rose-500 hover:text-white hover:border-rose-500 rounded-sm text-stone-400 transition cursor-pointer text-[10px]"
                                  >
                                    Forgotten Request
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Raw Data Export Drawer */}
                  {exportData && (
                    <div className={`p-4 border rounded-none space-y-3 ${
                      isWarm ? 'bg-[#FAF8F5] border-stone-250' : 'bg-zinc-950 border-zinc-800'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
                          <Check className="text-emerald-500 w-4 h-4" />
                          Right of Access data Compilation (JSON schema output)
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownloadJSON}
                            className={`text-[9px] uppercase font-extrabold py-1 px-2.5 flex items-center gap-1 hover:brightness-110 cursor-pointer ${
                              isWarm ? 'bg-stone-900 text-white' : 'bg-emerald-500 text-black'
                            }`}
                          >
                            <Download className="w-3 h-3" />
                            <span>Download DB Package</span>
                          </button>
                          <button
                            onClick={() => setExportData(null)}
                            className="text-[9px] text-zinc-400 font-bold"
                          >
                            [HIDE]
                          </button>
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-none overflow-x-auto text-[9px] font-mono h-[140px] border ${
                        isWarm ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                      }`}>
                        <pre>{exportData}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TERMS & LICENSES */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  {/* License Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#9c8469] border-b pb-1 font-sans">
                      1. Scandinavian Open-Design Licence Rules
                    </h3>
                    <p className="text-xs leading-relaxed opacity-90 font-sans">
                      All design blueprints created inside the Nordic Theme Lab workspace—including 
                      the Warm Scandinavian Serif alignments and the Copenhagen Monospace layouts—succeed 
                      under a dual-model open license framework. Upon generating or compiling visual components, 
                      you are authorized to reproduce, transmit, modify, or merge the assets for both commercial 
                      and personal boutiques.
                    </p>
                  </div>

                  {/* Copyright Clause */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#9c8469] border-b pb-1 font-sans">
                      2. Limitation of System Liabilities
                    </h3>
                    <p className="text-xs leading-relaxed opacity-90 font-sans">
                      The software is provided "as is", without warranty of any kind, express or implied. 
                      Because this is a sandboxed theme compiler utilizing the Google Gemini API, we cannot guarantee 
                      flawless responsive parity in old legacy browsers. Please verify compiled layouts inside the 
                      **Sandbox Customizer view** or the **Active Theme Simulator** before importing raw formats.
                    </p>
                  </div>

                  {/* Contact DPO */}
                  <div className={`p-4 border rounded-none ${
                    isWarm ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 border-zinc-800 font-sans'
                  }`}>
                    <h4 className="text-xs font-bold uppercase tracking-wide mb-1 text-stone-850">
                      Officer of Nordic Data Protection (DPO)
                    </h4>
                    <p className="text-xs opacity-75 mb-3 leading-relaxed">
                      For further clarification regarding Article 13/14 requests or to query persistent variables in our cloud server configurations:
                    </p>
                    <div className="text-[11px] font-mono select-all text-[#9c8469]">
                      compliance@copenhagen-nordic-premium.se
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Footer Section */}
          <div className="p-4 bg-transparent border-t flex justify-between items-center text-[10px] opacity-75 font-sans tracking-wide"
               style={{ borderColor: isWarm ? 'rgba(26,26,26,0.08)' : 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1.5 select-none">
              <span className={`w-2 h-2 rounded-full ${isWarm ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span>SYSTEM LEVEL: COMPLIANT WITH GDPR / DSGVO REGULATIONS</span>
            </div>
            
            <button
              onClick={onClose}
              className={`text-[10px] uppercase font-bold py-1.5 px-3 border hover:bg-neutral-850 hover:text-white ${
                isWarm ? 'border-stone-300 text-stone-800' : 'border-zinc-800 text-zinc-300'
              }`}
            >
              Close Compliance Center
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
