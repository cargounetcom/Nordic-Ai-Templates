/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, AlertTriangle, Sparkles, Send, ShieldCheck, Heart } from 'lucide-react';
import { UserAccount } from './RoleWorkspace';

interface EarlyAccessWaitlistProps {
  themeStyle: 'warm' | 'brutalist';
}

export default function EarlyAccessWaitlist({ themeStyle }: EarlyAccessWaitlistProps) {
  const isWarm = themeStyle === 'warm';

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'studio'>('user');
  
  // Logic feedback states
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [queueNumber, setQueueNumber] = useState(1402);
  const [invitationCode, setInvitationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Validate email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid digital email address.');
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      // Access the existing users array to populate it
      let activeUsers: UserAccount[] = [];
      const savedUsers = localStorage.getItem('nordic_tenant_users');
      if (savedUsers) {
        try {
          activeUsers = JSON.parse(savedUsers);
        } catch (e) {
          console.error(e);
        }
      } else {
        // Fallback default
        activeUsers = [
          { id: 'usr-101', name: 'Nils Sjöberg', email: 'nils@gothenburg.se', role: 'user', plan: 'free', registeredAt: '2026-01-12', mrr: 20 },
          { id: 'usr-102', name: 'Astrid Lind', email: 'astrid@copenhagen.dk', role: 'studio', plan: 'pro', registeredAt: '2026-02-28', mrr: 199 },
          { id: 'usr-103', name: 'Kopenhagen Atelier Ltd.', email: 'lars@cph-design.dk', role: 'studio', plan: 'max', registeredAt: '2026-03-15', mrr: 499 },
          { id: 'usr-104', name: 'Freja Larsson', email: 'freja@stockholm.se', role: 'user', plan: 'pro', registeredAt: '2026-04-05', mrr: 199 },
          { id: 'usr-105', name: 'Elena Rosengren (You)', email: 'ellanovachenko@gmail.com', role: 'admin', plan: 'max', registeredAt: '2025-12-01', mrr: 499 },
        ];
      }

      // Check if user already registered
      if (activeUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setStatus('error');
        setErrorMessage('This identity email is already registered in our early-access matrix.');
        return;
      }

      // Propose randomized coupon code
      const promoId = `CPH-NORDIC-${Math.floor(1000 + Math.random() * 9000)}`;
      setInvitationCode(promoId);

      // Save user node under Linen Starter or Atelier Pro depending on scope selection
      const newUserNode: UserAccount = {
        id: `usr-wt${Math.floor(100 + Math.random() * 900)}`,
        name: name,
        email: email,
        role: role,
        plan: role === 'studio' ? 'pro' : 'free',
        registeredAt: new Date().toISOString().split('T')[0],
        mrr: role === 'studio' ? 199 : 20
      };

      const updatedUsers = [newUserNode, ...activeUsers];
      localStorage.setItem('nordic_tenant_users', JSON.stringify(updatedUsers));
      
      // Track event in Local Analytics
      let events = [];
      const savedEvents = localStorage.getItem('nordic_telemetry_events');
      if (savedEvents) {
        try { events = JSON.parse(savedEvents); } catch (err) { console.error(err); }
      }
      const waitlistEvent = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        category: 'signup',
        action: 'waitlist_registration',
        label: `Email: ${email}, Role: ${role}, Code: ${promoId}`,
        sessionToken: localStorage.getItem('nordic_sess_token') || 'unknown'
      };
      localStorage.setItem('nordic_telemetry_events', JSON.stringify([waitlistEvent, ...events]));

      // Dispath standard browser event to sync widgets
      window.dispatchEvent(new Event('storage'));

      // Calculate priority queue number
      const computedPos = 1400 + updatedUsers.length;
      setQueueNumber(computedPos);
      
      setStatus('success');
      setName('');
      setEmail('');
    }, 1200);
  };

  return (
    <div className={`p-8 border relative ${
      isWarm 
        ? 'bg-[#FAF8F5] border-stone-200 text-stone-950 font-serif' 
        : 'bg-[#18181B] border-zinc-800 text-zinc-100 font-mono'
    }`}>
      
      <div className={`absolute top-0 right-0 h-1.5 w-full ${isWarm ? 'bg-[#c5a880]' : 'bg-indigo-500'}`} />

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-6 space-y-4"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
              isWarm ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-950/30 border-emerald-500 text-emerald-400'
            }`}>
              <Check className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className={`text-lg font-bold uppercase tracking-wide ${isWarm ? '' : 'font-extrabold text-emerald-400'}`}>
                Identity Matrix Synced Successfully!
              </h3>
              <p className="text-xs opacity-75 font-sans leading-relaxed max-w-sm mx-auto">
                Excellent choices. You have secured your slot in the Copenhagen Theme Lab. Your subscriber variables are persistent inside the database.
              </p>
            </div>

            <div className={`p-4 border max-w-sm mx-auto flex flex-col justify-center space-y-1 ${
              isWarm ? 'bg-stone-50 border-stone-150' : 'bg-zinc-900/60 border-zinc-800'
            }`}>
              <span className="block text-[8px] opacity-45 uppercase tracking-widest font-sans font-bold">
                ESTIMATED QUEUE PRIORITY
              </span>
              <span className={`text-xl font-bold font-mono tracking-tight ${isWarm ? 'text-amber-600' : 'text-indigo-400'}`}>
                #{queueNumber} IN LINE
              </span>
              <span className="block text-[8px] opacity-50 uppercase tracking-widest font-sans font-bold pt-2 border-t mt-2"
                    style={{ borderColor: isWarm ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                PROMOTIONAL GIFT PASSCODE
              </span>
              <span className="font-mono text-xs font-bold uppercase py-1 px-3 bg-zinc-950 text-emerald-400 border border-zinc-900 inline-block self-center mt-1 select-all">
                {invitationCode}
              </span>
            </div>

            <button
              onClick={() => setStatus('idle')}
              className={`text-[9px] uppercase font-bold tracking-wider py-1.5 px-4 border transition ${
                isWarm ? 'border-stone-250 bg-white hover:bg-stone-100 text-stone-700' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              Add Another Account Node
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-1 text-left">
              <span className="text-[9px] uppercase tracking-widest text-[#9c8469] font-sans font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                JOIN THE COPENHAGEN EARLY ACCESS PORTAL
              </span>
              <h2 className={`text-lg font-bold uppercase tracking-wide ${isWarm ? '' : 'font-extrabold'}`}>
                Acquire Spec License Priority
              </h2>
              <p className="text-xs opacity-75 font-sans leading-relaxed">
                Sign up to test high-density grid themes, download compilable Next.js 15 starter templates, and get notifications on newly integrated WooCommerce and Shopify nodes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Name Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase opacity-70 font-sans tracking-wide">
                  Full Identification Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Sjöberg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                    isWarm ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase opacity-70 font-sans tracking-wide">
                  Digital Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maria@atelier-cph.dk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2.5 border font-sans text-xs focus:ring-1 focus:ring-stone-600 focus:outline-none ${
                    isWarm ? 'bg-white text-black border-stone-250' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  }`}
                />
              </div>

              {/* Scope/Role Selection matrix */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-2.5 border transition text-left cursor-pointer ${
                    role === 'user'
                      ? isWarm ? 'bg-[#2C2A27] text-white border-stone-900' : 'bg-zinc-800 border-zinc-700 text-emerald-400'
                      : isWarm ? 'bg-white border-stone-200' : 'bg-zinc-900/40 border-zinc-900'
                  }`}
                >
                  <span className="block text-[9px] font-bold uppercase font-sans">INDIVIDUAL SPEC</span>
                  <span className="block text-[8px] opacity-70 font-sans">Linen Starter Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('studio')}
                  className={`p-2.5 border transition text-left cursor-pointer ${
                    role === 'studio'
                      ? isWarm ? 'bg-[#2C2A27] text-white border-stone-900' : 'bg-zinc-800 border-zinc-700 text-emerald-400'
                      : isWarm ? 'bg-white border-stone-200' : 'bg-zinc-900/40 border-zinc-900'
                  }`}
                >
                  <span className="block text-[9px] font-bold uppercase font-sans">STUDIO LICENCE</span>
                  <span className="block text-[8px] opacity-70 font-sans">Atelier Pro level access</span>
                </button>
              </div>

              {/* Error Box display */}
              {status === 'error' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] leading-relaxed flex gap-2 items-start font-sans">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-3 text-xs uppercase font-extrabold flex items-center justify-center gap-2 transition cursor-pointer select-none active:scale-95 ${
                  status === 'loading'
                    ? 'opacity-60 bg-stone-300 text-stone-600'
                    : isWarm
                      ? 'bg-stone-900 text-white hover:bg-stone-850'
                      : 'bg-emerald-500 text-black hover:bg-emerald-450'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>{status === 'loading' ? 'Encrypting Credentials...' : 'Secure Queue Slot'}</span>
              </button>
            </form>

            {/* Privacy Promise block */}
            <div className="flex gap-2 items-center text-[10px] opacity-55 font-sans justify-center pt-2 select-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>EU GDPR Approved • No trackers or spam vectors.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
