/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye } from 'lucide-react';
import { RenovationWizard } from './components/RenovationWizard';
import { AdminPanel } from './components/AdminPanel';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { FONT_PAIRINGS } from './constants';

import { cn } from './lib/utils';

function MainApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { config } = useConfig();
  const isWidgetMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('widget') === 'true';

  useEffect(() => {
    // Load all fonts for preview and the selected ones for the app
    const allFonts = Array.from(new Set(FONT_PAIRINGS.flatMap(p => [p.heading, p.body])));
    const fontQuery = allFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&');
    
    const linkId = 'google-fonts-link';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

    // Apply global font overrides
    const styleId = 'dynamic-typography';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = `
      :root {
        --font-serif: "${config.typography.headingFont}", serif !important;
        --font-sans: "${config.typography.bodyFont}", sans-serif !important;
        --heading-font: "${config.typography.headingFont}", serif;
        --body-font: "${config.typography.bodyFont}", sans-serif;
      }
      body { 
        font-family: var(--font-sans) !important; 
        ${isWidgetMode ? `
          background: transparent !important; 
          overflow: hidden !important;
        ` : ''}
      }
      ${isWidgetMode ? `
        body::-webkit-scrollbar {
          display: none !important;
        }
      ` : ''}
      .font-serif { font-family: var(--font-serif) !important; }
      .font-sans { font-family: var(--font-sans) !important; }
    `;
  }, [config.typography]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center text-center overflow-hidden transition-colors duration-500",
      isWidgetMode ? "bg-transparent" : "bg-[#f5f2ed] p-8"
    )}>
      {/* Admin Toggle */}
      {!isWidgetMode && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsAdminOpen(true)}
          className="fixed top-8 left-8 z-[50] flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-full shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-500">
            <Settings size={12} />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-600">Admin Panel</span>
        </motion.button>
      )}

      {!isWidgetMode && <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />}

      {!isWidgetMode && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-8 relative z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-light tracking-tight text-[#1a1a1a] leading-none"
          >
            {config.companyName.toUpperCase()} <br />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="italic text-[#c5a059]"
              style={{ color: config.primaryColor }}
            >
              Excellence
            </motion.span>
          </motion.h1>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="h-[1px] w-24 bg-[#1a1a1a]/20 mx-auto"
          ></motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg md:text-xl text-[#1a1a1a]/60 font-light max-w-xl mx-auto leading-relaxed"
          >
            Bespoke architectural renovations for the most discerning homeowners. 
            From concept to completion, we redefine luxury living with {config.companyName}.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="pt-12"
          >
            <button 
              onClick={() => {
                const fab = document.querySelector('button[class*="fixed bottom-8"]') as HTMLButtonElement;
                fab?.click();
              }}
              className="group relative px-12 py-5 bg-[#1a1a1a] text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{ backgroundColor: config.primaryColor }}
            >
              {/* Colorful Hover Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <motion.div 
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                  className="absolute inset-[-2px] bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 via-orange-500 to-indigo-500 rounded-full blur-[1px]"
                />
              </div>

              <div className="relative z-10 h-full w-full bg-[#1a1a1a] rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: config.primaryColor }}>
                <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-medium px-12 py-5">Get {config.companyName} Estimate</span>
                <motion.div 
                  className="absolute inset-0 bg-white/10"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Decorative Elements */}
      {!isWidgetMode && (
        <>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="fixed top-12 right-12 hidden lg:block"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#1a1a1a]/30 [writing-mode:vertical-rl] rotate-180">
              ESTABLISHED 1994
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="fixed bottom-12 left-12 hidden lg:block"
          >
            <div className="flex flex-col gap-4">
              <motion.div 
                animate={{ height: [48, 24, 48] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px bg-[#1a1a1a]/20 mx-auto"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1a1a1a]/40">
                SCROLL
              </span>
            </div>
          </motion.div>

          {/* Background Texture/Effect */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        </>
      )}

      {/* The Wizard Component */}
      <RenovationWizard />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <MainApp />
    </ConfigProvider>
  );
}

