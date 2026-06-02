/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, HelpCircle, ArrowLeft, RefreshCw, Compass } from 'lucide-react';

interface ErrorPagesProps {
  errorType: '404' | '500';
  themeStyle: 'warm' | 'brutalist';
  onReset: () => void;
}

export default function ErrorPages({ errorType, themeStyle, onReset }: ErrorPagesProps) {
  const isWarm = themeStyle === 'warm';

  if (errorType === '404') {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center p-6 ${
        isWarm ? 'bg-[#FAF8F5] text-[#2C2A27] font-serif' : 'bg-black text-[#F5F5F5] font-mono'
      }`}>
        <div className="max-w-md text-center space-y-6">
          <span className={`text-[120px] font-thin leading-none tracking-tight block ${
            isWarm ? 'text-stone-300' : 'text-zinc-800'
          }`}>
            404
          </span>

          <div className="space-y-2">
            <h2 className="text-xl uppercase tracking-widest font-black flex items-center justify-center gap-1.5">
              <Compass className="w-5 h-5 text-amber-500 animate-spin" />
              Signal Lost in Bornholm
            </h2>
            <p className="text-xs leading-relaxed opacity-75 max-w-sm mx-auto font-sans font-light">
              We have scanned across all fifty Scandinavian design matrices. The specific grid or stylesheet coordinate you requested has drifted out to the Baltic Sea.
            </p>
          </div>

          {/* Technical feedback segment */}
          <div className={`p-4 border ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-900/60 border-zinc-850'}`}>
            <span className="block text-[8px] font-bold opacity-45 uppercase tracking-widest font-sans mb-1">
              ROUTING DIAGNOSTICS LOGS
            </span>
            <code className="text-[10px] opacity-75 font-mono select-all">
              Path Error: Object reference at root index undefined. <br />
              Status: 404 NOT_FOUND // Client request drifted.
            </code>
          </div>

          <button
            onClick={onReset}
            id="error-404-recover-cta"
            className={`py-3 px-8 text-xs uppercase font-extrabold tracking-widest flex items-center justify-center gap-2 mx-auto active:scale-95 transition cursor-pointer ${
              isWarm ? 'bg-[#2C2A27] text-white hover:bg-stone-850' : 'bg-emerald-500 text-black hover:bg-emerald-450'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Safe Catalogue Haven</span>
          </button>
        </div>
      </div>
    );
  }

  // 500 error view layout
  return (
    <div className={`min-h-[80vh] flex items-center justify-center p-6 ${
      isWarm ? 'bg-[#FAF8F5] text-[#2C2A27] font-serif' : 'bg-[#0A0A0A] text-[#F5F5F5] font-mono'
    }`}>
      <div className="max-w-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertCircle className="w-8 h-8 text-rose-500 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl uppercase tracking-widest font-extrabold text-[#9c8469]">
            Compiler Signal Collapse
          </h2>
          <p className="text-xs leading-relaxed opacity-75 max-w-md mx-auto font-sans">
            The Theme Lab compiler encountered an unhandled parameter. A signal collision on the proxy line of Port 3000 triggered a structural thread abort.
          </p>
        </div>

        {/* Callstack trace */}
        <div className={`p-4 border text-left rounded-none max-h-40 overflow-y-auto ${
          isWarm ? 'bg-[#F2EFEA] border-stone-250 text-stone-800' : 'bg-zinc-950 border-zinc-900 text-rose-400'
        }`}>
          <span className="block text-[8px] font-bold opacity-45 uppercase tracking-widest font-sans mb-2">
            STACK TRACE // NORDIC_COMPILER_CRASH_PID_3000
          </span>
          <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto">
{`Error: Failed to fetch API specification headers.
  at compileNodeSpec (src/components/AIGenerator.tsx:142)
  at handleTriggerCompile (src/components/RoleWorkspace.tsx:968)
  at runExpressViteProxy (yarn/lib/node_modules/vite:3154)
  at dispatchIncomingPortIngress (server.ts:14)
Status: HTTP 500 INTERNAL_SERVER_ERROR.`}
          </pre>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onReset}
            id="error-500-reboot-cta"
            className={`py-3 px-6 text-xs uppercase font-extrabold tracking-widest flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer ${
              isWarm ? 'bg-[#2C2A27] text-white hover:bg-stone-850' : 'bg-emerald-500 text-black hover:bg-emerald-450'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Execute Soft Reboot of Theme Engine</span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className={`py-3 px-6 text-xs uppercase tracking-widest flex items-center justify-center gap-1 border transition cursor-pointer ${
              isWarm ? 'border-stone-800 text-stone-800 hover:bg-stone-100' : 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            Reload Browser Frame
          </button>
        </div>
      </div>
    </div>
  );
}
