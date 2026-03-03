import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  DollarSign, 
  Palette, 
  Layout, 
  Eye, 
  EyeOff, 
  TrendingUp,
  X,
  Code,
  Copy,
  Check,
  ExternalLink,
  Calculator,
  Home as HomeIcon,
  Sparkles as SparklesIcon,
  MessageSquare as MessageIcon,
  Plus,
  Type
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { cn } from '../lib/utils';
import { FONT_PAIRINGS } from '../constants';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS = [
  { id: 'Home', icon: HomeIcon, label: 'Home' },
  { id: 'Calculator', icon: Calculator, label: 'Calculator' },
  { id: 'Sparkles', icon: SparklesIcon, label: 'Sparkles' },
  { id: 'MessageSquare', icon: MessageIcon, label: 'Message' },
  { id: 'Plus', icon: Plus, label: 'Plus' },
];

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { config, updateConfig, updateServicePricing, updateGlobalMultiplier, updateFeatures, updateHeader, updateTypography } = useConfig();
  const [selectedServiceId, setSelectedServiceId] = React.useState('kitchen');
  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const appUrl = 'https://ais-pre-6qtf7xvtbantvdblrm2cxw-104294895427.us-east1.run.app';

  const inlineEmbedCode = `<iframe 
  src="${appUrl}" 
  width="100%" 
  height="700px" 
  style="border:none; border-radius:24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);"
></iframe>`;

  const floatingEmbedCode = `<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = '${appUrl}';
    iframe.style.cssText = 'position:fixed; bottom:20px; right:20px; width:400px; height:600px; border:none; border-radius:24px; z-index:99999; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);';
    document.body.appendChild(iframe);
  })();
</script>`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const currentServicePricing = config.pricing.services[selectedServiceId] || { small: 0, medium: 0, large: 0 };

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[10000] border-r border-neutral-200 flex flex-col"
    >
      <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-white">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold">Admin Dashboard</h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Widget Configuration</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Branding Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <Palette size={18} className="text-indigo-500" />
            <h3>Branding & Theme</h3>
          </div>
          <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Company Name</label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => updateConfig({ companyName: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Theme Primary Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-mono"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Floating Button Icon</label>
              <div className="flex gap-2 p-2 bg-white border border-neutral-200 rounded-xl overflow-x-auto custom-scrollbar">
                {ICONS.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = config.fabIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateConfig({ fabIcon: item.id })}
                      className={cn(
                        "flex flex-col items-center justify-center min-w-[64px] p-2 rounded-lg transition-all",
                        isSelected 
                          ? "bg-neutral-900 text-white shadow-md" 
                          : "hover:bg-neutral-100 text-neutral-500"
                      )}
                    >
                      <IconComponent size={18} />
                      <span className="text-[8px] mt-1 font-bold uppercase tracking-tighter">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <Type size={18} className="text-orange-500" />
            <h3>Typography Pairings</h3>
          </div>
          <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <div className="grid grid-cols-1 gap-2">
              {FONT_PAIRINGS.map((pairing) => {
                const isSelected = config.typography.headingFont === pairing.heading && config.typography.bodyFont === pairing.body;
                return (
                  <button
                    key={pairing.id}
                    onClick={() => updateTypography({ headingFont: pairing.heading, bodyFont: pairing.body })}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                      isSelected 
                        ? "bg-white border-orange-500 shadow-sm ring-1 ring-orange-500/20" 
                        : "bg-white border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{pairing.label}</span>
                      {isSelected && <Check size={12} className="text-orange-500" />}
                    </div>
                    <div className="space-y-0.5">
                      <p style={{ fontFamily: pairing.heading }} className="text-lg font-bold text-neutral-900">
                        {pairing.heading}
                      </p>
                      <p style={{ fontFamily: pairing.body }} className="text-xs text-neutral-500">
                        Body: {pairing.body}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-neutral-400 italic">Fonts are automatically loaded from Google Fonts.</p>
          </div>
        </section>

        {/* Header Content Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <Layout size={18} className="text-blue-500" />
            <h3>Header Content</h3>
          </div>
          <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Header Title</label>
              <input
                type="text"
                value={config.header.title}
                onChange={(e) => updateHeader({ title: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Header Subtitle</label>
              <textarea
                value={config.header.subtitle}
                onChange={(e) => updateHeader({ subtitle: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
              />
            </div>
          </div>
        </section>

        {/* Pricing Logic Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <DollarSign size={18} className="text-emerald-500" />
            <h3>Pricing Logic Engine</h3>
          </div>
          <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Select Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              >
                <option value="custom-homes">Custom Homes</option>
                <option value="full-renovations">Full Home Renovations</option>
                <option value="kitchen">Kitchen</option>
                <option value="bathroom">Bathroom</option>
                <option value="basement">Basement</option>
                <option value="additions">Home Additions</option>
                <option value="condo">Condo Renovations</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Small / Tier 1 Base ($)</label>
                <input
                  type="number"
                  value={currentServicePricing.small}
                  onChange={(e) => updateServicePricing(selectedServiceId, { small: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Medium / Tier 2 Base ($)</label>
                <input
                  type="number"
                  value={currentServicePricing.medium}
                  onChange={(e) => updateServicePricing(selectedServiceId, { medium: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Large / Tier 3 Base ($)</label>
                <input
                  type="number"
                  value={currentServicePricing.large}
                  onChange={(e) => updateServicePricing(selectedServiceId, { large: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-1">
                    <TrendingUp size={12} /> Global Multiplier
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-600">x{config.pricing.globalMultiplier.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={config.pricing.globalMultiplier}
                  onChange={(e) => updateGlobalMultiplier(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[10px] text-neutral-400 italic">Adjusts all estimates by this factor (e.g., 1.20 = 20% markup).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Toggles Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <Layout size={18} className="text-purple-500" />
            <h3>Feature Toggles</h3>
          </div>
          <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  config.features.showSocialProof ? "bg-purple-100 text-purple-600" : "bg-neutral-100 text-neutral-400"
                )}>
                  {config.features.showSocialProof ? <Eye size={16} /> : <EyeOff size={16} />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Social Proof</p>
                  <p className="text-[10px] text-neutral-400">Review bubbles & star ratings</p>
                </div>
              </div>
              <button
                onClick={() => updateFeatures({ showSocialProof: !config.features.showSocialProof })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  config.features.showSocialProof ? "bg-purple-500" : "bg-neutral-300"
                )}
              >
                <motion.div
                  animate={{ x: config.features.showSocialProof ? 26 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  config.features.showTestimonials ? "bg-purple-100 text-purple-600" : "bg-neutral-100 text-neutral-400"
                )}>
                  {config.features.showTestimonials ? <Eye size={16} /> : <EyeOff size={16} />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Testimonials</p>
                  <p className="text-[10px] text-neutral-400">Local testimonial block on final screen</p>
                </div>
              </div>
              <button
                onClick={() => updateFeatures({ showTestimonials: !config.features.showTestimonials })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  config.features.showTestimonials ? "bg-purple-500" : "bg-neutral-300"
                )}
              >
                <motion.div
                  animate={{ x: config.features.showTestimonials ? 26 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </section>

        {/* Embed Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <Code size={18} className="text-blue-500" />
            <h3>Embed Your Widget</h3>
          </div>
          <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            {/* Inline Embed */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Standard Inline Embed</label>
                <button 
                  onClick={() => handleCopy(inlineEmbedCode, 'inline')}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copiedType === 'inline' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedType === 'inline' ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
              <div className="relative group">
                <pre className="p-3 bg-neutral-900 text-neutral-300 text-[10px] font-mono rounded-xl overflow-x-auto custom-scrollbar whitespace-pre-wrap leading-relaxed">
                  {inlineEmbedCode}
                </pre>
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors pointer-events-none rounded-xl" />
              </div>
              <p className="text-[10px] text-neutral-400 italic">Perfect for dedicated "Request a Quote" pages.</p>
            </div>

            {/* Floating Embed */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Floating Widget Embed</label>
                <button 
                  onClick={() => handleCopy(floatingEmbedCode, 'floating')}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copiedType === 'floating' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedType === 'floating' ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
              <div className="relative group">
                <pre className="p-3 bg-neutral-900 text-neutral-300 text-[10px] font-mono rounded-xl overflow-x-auto custom-scrollbar whitespace-pre-wrap leading-relaxed">
                  {floatingEmbedCode}
                </pre>
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors pointer-events-none rounded-xl" />
              </div>
              <p className="text-[10px] text-neutral-400 italic">Ideal for sitewide lead capture in the bottom-right corner.</p>
            </div>
            
            <div className="pt-2">
              <a 
                href={appUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-neutral-200 rounded-xl text-[10px] font-bold text-neutral-600 hover:bg-neutral-50 transition-all"
              >
                <ExternalLink size={12} />
                PREVIEW LIVE WIDGET
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-neutral-100 bg-neutral-50">
        <button 
          onClick={onClose}
          className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-neutral-800 transition-all shadow-lg"
        >
          Return to Widget View
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
}
