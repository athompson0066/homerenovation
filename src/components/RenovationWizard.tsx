import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Check, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail, 
  User,
  Sparkles,
  Calculator,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useConfig } from '../context/ConfigContext';

interface DetailedFeature {
  id: string;
  label: string;
  description: string;
  price: number;
}

interface Scope {
  id: string;
  label: string;
  description: string;
  basePrice: number;
}

interface ServiceOption {
  id: string;
  title: string;
  image: string;
  scopes: Scope[];
  detailedFeatures?: DetailedFeature[];
}

const SERVICES: ServiceOption[] = [
  {
    id: 'custom-homes',
    title: 'Custom Homes',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
    scopes: [
      { id: 'planning', label: 'Planning Phase', description: 'Architectural drawings and initial concepts.', basePrice: 500000 },
      { id: 'permit', label: 'Permit-Ready', description: 'Permits secured, ready for groundbreaking.', basePrice: 850000 },
      { id: 'land', label: 'Land Secured', description: 'Full build on your own property.', basePrice: 1200000 }
    ]
  },
  {
    id: 'full-renovations',
    title: 'Full Home Renovations',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800',
    scopes: [
      { id: 'zones', label: 'Select Zones', description: 'Renovating multiple key areas of the home.', basePrice: 250000 },
      { id: 'interior', label: 'Whole-Home Interior', description: 'Complete interior overhaul from studs up.', basePrice: 450000 },
      { id: 'total', label: 'Total Overhaul', description: 'Interior and exterior transformation.', basePrice: 750000 }
    ]
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    image: 'https://hips.hearstapps.com/hmg-prod/images/stephanie-martin-interior-designmartinleedesign-canmore2023-final-014-685d96440d1be.png?crop=1xw:0.6670441676104191xh;center,top&resize=640:*',
    scopes: [
      { id: 'refresh', label: 'Cabinet Refresh', description: 'High-end refinishing and hardware updates.', basePrice: 45000 },
      { id: 'reconfig', label: 'Layout Reconfig', description: 'Moving appliances and structural changes.', basePrice: 85000 },
      { id: 'full-build', label: 'Full Build', description: 'Luxury custom cabinetry and premium stone.', basePrice: 150000 }
    ],
    detailedFeatures: [
      { id: 'millwork', label: 'Custom Millwork', description: 'Hand-crafted cabinetry with bespoke finishes.', price: 45000 },
      { id: 'appliances', label: 'Pro-Grade Appliances', description: 'Sub-Zero, Wolf, or Miele integration.', price: 35000 },
      { id: 'stone', label: 'Natural Stone', description: 'Book-matched marble or premium quartzite surfaces.', price: 25000 },
      { id: 'smart', label: 'Smart Integration', description: 'Voice-controlled lighting, faucets, and appliances.', price: 12000 },
      { id: 'structural', label: 'Structural Change', description: 'Removing walls for an open-concept layout.', price: 30000 }
    ]
  },
  {
    id: 'bathroom',
    title: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800',
    scopes: [
      { id: 'modernization', label: 'Modernization', description: 'Updating fixtures and premium tiling.', basePrice: 35000 },
      { id: 'reimagining', label: 'Layout Reimagining', description: 'Optimizing space for better flow.', basePrice: 65000 },
      { id: 'spa', label: 'Luxury Spa', description: 'Steam showers, heated floors, and custom vanities.', basePrice: 110000 }
    ],
    detailedFeatures: [
      { id: 'steam', label: 'Steam Shower', description: 'Aromatherapy and chromotherapy integration.', price: 18000 },
      { id: 'tub', label: 'Freestanding Tub', description: 'Architectural focal point with floor-mounted filler.', price: 12000 },
      { id: 'floors', label: 'Heated Floors', description: 'NuHeat systems under natural stone tile.', price: 8000 },
      { id: 'vanity', label: 'Custom Vanity', description: 'Double-sink bespoke cabinetry with stone top.', price: 15000 },
      { id: 'fixtures', label: 'Premium Fixtures', description: 'Dornbracht or Kallista designer hardware.', price: 10000 }
    ]
  },
  {
    id: 'basement',
    title: 'Basement',
    image: 'https://novostar.ca/wp-content/uploads/2023/04/Basement-Remodel-5.jpg',
    scopes: [
      { id: 'unfinished', label: 'Unfinished', description: 'Converting raw space into living area.', basePrice: 85000 },
      { id: 'refresh', label: 'Refresh', description: 'Updating an existing finished basement.', basePrice: 45000 },
      { id: 'multi', label: 'Multi-Functional', description: 'Home theater, gym, and bar integration.', basePrice: 145000 }
    ]
  },
  {
    id: 'additions',
    title: 'Home Additions',
    image: 'https://s3da-design.com/wp-content/uploads/2018/05/Home-addition-in-California.jpg',
    scopes: [
      { id: 'bump-out', label: 'Bump-out', description: 'Small expansion for a larger room.', basePrice: 120000 },
      { id: 'vertical', label: 'Vertical / 2nd Storey', description: 'Adding a new floor to your existing home.', basePrice: 350000 },
      { id: 'wing', label: 'Full Wing', description: 'Large scale horizontal addition.', basePrice: 550000 }
    ]
  },
  {
    id: 'condo',
    title: 'Condo Renovations',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800',
    scopes: [
      { id: 'cosmetic', label: 'Cosmetic', description: 'Flooring, paint, and lighting updates.', basePrice: 65000 },
      { id: 'modernization', label: 'Full Modernization', description: 'Complete unit renovation.', basePrice: 145000 },
      { id: 'structural', label: 'Structural / Combination', description: 'Combining units or major layout changes.', basePrice: 250000 }
    ]
  }
];

const TIMELINES = [
  { id: 'asap', label: 'ASAP', desc: 'Ready to begin within 30 days.' },
  { id: '3months', label: 'Within 3 Months', desc: 'Planning to start in the next quarter.' },
  { id: 'planning', label: 'Planning Phase', desc: 'Exploring options for 6+ months out.' }
];

export function RenovationWizard() {
  const { config } = useConfig();
  
  const FabIcon = useMemo(() => {
    switch (config.fabIcon) {
      case 'Calculator': return Calculator;
      case 'Sparkles': return Sparkles;
      case 'MessageSquare': return MessageSquare;
      case 'Plus': return Plus;
      default: return Home;
    }
  }, [config.fabIcon]);

  const isWidgetMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('widget') === 'true';
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<{
    serviceId?: string;
    scopeId?: string;
    featureIds: string[];
    notes: string;
    timeline?: string;
    leadData: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
    };
  }>({
    featureIds: [],
    notes: '',
    leadData: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
    }
  });

  const selectedService = useMemo(() => 
    SERVICES.find(s => s.id === selections.serviceId), 
    [selections.serviceId]
  );

  const selectedScope = useMemo(() => 
    selectedService?.scopes.find(s => s.id === selections.scopeId),
    [selectedService, selections.scopeId]
  );

  const totalEstimate = useMemo(() => {
    let base = 0;
    
    if (selectedService && selections.scopeId) {
      const servicePricing = config.pricing.services[selectedService.id];
      if (servicePricing) {
        // Map scope IDs to pricing tiers
        // We assume the scopes are ordered Small, Medium, Large in the SERVICES array
        const scopeIndex = selectedService.scopes.findIndex(s => s.id === selections.scopeId);
        if (scopeIndex === 0) base = servicePricing.small;
        else if (scopeIndex === 1) base = servicePricing.medium;
        else if (scopeIndex === 2) base = servicePricing.large;
      } else {
        base = selectedScope?.basePrice || 0;
      }
    }

    if (selectedService?.detailedFeatures) {
      const featuresPrice = selections.featureIds.reduce((acc, id) => {
        const feature = selectedService.detailedFeatures?.find(f => f.id === id);
        return acc + (feature?.price || 0);
      }, 0);
      return (base + featuresPrice) * config.pricing.globalMultiplier;
    }
    
    return base * config.pricing.globalMultiplier;
  }, [selectedService, selectedScope, selections.featureIds, selections.scopeId, config.pricing]);

  const handleNext = () => {
    if (currentStep < 5) {
      if (currentStep === 1 && !selections.serviceId) return;
      if (currentStep === 2) {
        if (selectedService?.detailedFeatures) {
          if (selections.featureIds.length === 0) return;
        } else if (!selections.scopeId) {
          return;
        }
      }
      if (currentStep === 3 && !selections.timeline) return;
      if (currentStep === 4) {
        const { name, email, phone, address, city, province, postalCode } = selections.leadData;
        if (!name || !email || !phone || !address || !city || !province || !postalCode) return;
      }
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOpen(false);
      alert(`Thank you! Our ${config.companyName} luxury concierge will contact you shortly.`);
      setCurrentStep(1);
      setSelections({
        featureIds: [],
        notes: '',
        leadData: {
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          province: '',
          postalCode: '',
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const toggleFeature = (id: string) => {
    setSelections(prev => ({
      ...prev,
      featureIds: prev.featureIds.includes(id) 
        ? prev.featureIds.filter(fid => fid !== id)
        : [...prev.featureIds, id]
    }));
  };

  const updateLeadData = (field: keyof typeof selections.leadData, value: string) => {
    setSelections(prev => ({
      ...prev,
      leadData: { ...prev.leadData, [field]: value }
    }));
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-[9998] cursor-pointer text-white transition-opacity duration-300",
          isOpen && isWidgetMode ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        style={{ backgroundColor: config.primaryColor }}
      >
        <FabIcon size={24} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className={cn(
            "fixed inset-0 flex items-center justify-center z-[9999]",
            isWidgetMode ? "p-0" : "p-4 md:p-8"
          )}>
            {!isWidgetMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
            )}
            
            <motion.div
              initial={isWidgetMode ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={isWidgetMode ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative bg-white w-full shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20",
                isWidgetMode ? "h-full max-w-none rounded-none" : "max-w-4xl h-[90vh] md:h-[80vh] rounded-3xl"
              )}
            >
              {/* Sidebar */}
              <div className="hidden md:flex md:w-1/3 bg-neutral-900 relative overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedService?.image || 'default'}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={selectedService?.image || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white text-3xl font-serif italic mb-2 leading-tight"
                  >
                    Elevate Your Living Space
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-300 text-sm font-light"
                  >
                    Bespoke craftsmanship for the discerning homeowner.
                  </motion.p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-6 border-b border-neutral-100 space-y-6 text-center relative">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-900 transition-all p-3 rounded-full hover:bg-neutral-200 z-[100] bg-white shadow-lg border border-neutral-100"
                    aria-label="Close estimator"
                  >
                    <X size={28} strokeWidth={2.5} />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-serif font-bold text-neutral-900 leading-tight">
                        {config.header.title}
                      </h1>
                      <p className="text-xs text-neutral-500 font-medium max-w-xs mx-auto">
                        {config.header.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="w-8 h-[1px] bg-neutral-300"></span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
                      Step 0{currentStep} / 05
                    </span>
                    <span className="w-8 h-[1px] bg-neutral-300"></span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-serif mb-2">What are we envisioning?</h3>
                            <p className="text-neutral-500 text-sm">Select the primary service for your luxury renovation.</p>
                            
                            {config.features.showSocialProof && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex items-center gap-4"
                              >
                                <div className="flex -space-x-2">
                                  {[1, 2, 3].map((i) => (
                                    <img 
                                      key={i}
                                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                      referrerPolicy="no-referrer"
                                    />
                                  ))}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Sparkles key={i} size={10} className="text-yellow-500 fill-yellow-500" />
                                    ))}
                                    <span className="text-[10px] font-bold ml-1">4.9/5</span>
                                  </div>
                                  <span className="text-[10px] text-neutral-400 font-medium">Trusted by 200+ homeowners</span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SERVICES.map(service => (
                                  <motion.div
                                    key={service.id}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      setSelections(prev => ({ ...prev, serviceId: service.id, scopeId: undefined, featureIds: [] }));
                                      handleNext();
                                    }}
                                    className={cn(
                                      "group relative h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500",
                                      selections.serviceId === service.id 
                                        ? "shadow-xl" 
                                        : "border-transparent hover:border-transparent"
                                    )}
                                    style={{ 
                                      borderColor: selections.serviceId === service.id ? config.primaryColor : 'transparent' 
                                    }}
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
                                        className="absolute inset-[-2px] bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 via-orange-500 to-indigo-500 rounded-2xl blur-[1px]"
                                      />
                                    </div>

                                    <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-white">
                                      <img 
                                        src={service.image} 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <span className="text-white font-medium tracking-wide text-shadow-sm">{service.title}</span>
                                      </div>
                                      {selections.serviceId === service.id && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                                          <Check size={14} style={{ color: config.primaryColor }} />
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                        </div>
                      )}

                      {currentStep === 2 && selectedService && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-serif mb-2">
                              {selectedService.detailedFeatures ? `Build Your ${selectedService.title}` : 'Define the Scope'}
                            </h3>
                            <p className="text-neutral-500 text-sm">
                              {selectedService.detailedFeatures ? 'Select the bespoke features for your project.' : 'Every detail matters. Choose the level of transformation.'}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            {selectedService.detailedFeatures ? (
                              selectedService.detailedFeatures.map(feature => {
                                const isSelected = selections.featureIds.includes(feature.id);
                                return (
                                  <motion.div
                                    key={feature.id}
                                    whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
                                    onClick={() => toggleFeature(feature.id)}
                                    className={cn(
                                      "flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300",
                                      isSelected ? "bg-neutral-50 shadow-md" : "border-neutral-100 hover:border-neutral-200"
                                    )}
                                    style={{ 
                                      borderColor: isSelected ? config.primaryColor : undefined 
                                    }}
                                  >
                                    <div className={cn(
                                      "w-5 h-5 rounded-md border-2 flex items-center justify-center mr-4 mt-1 transition-colors"
                                    )}
                                    style={{ 
                                      borderColor: isSelected ? config.primaryColor : '#d1d5db',
                                      backgroundColor: isSelected ? config.primaryColor : 'transparent'
                                    }}>
                                      {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-neutral-900 text-sm">{feature.label}</h4>
                                        <span className="text-neutral-400 text-[10px] font-mono">+${(feature.price / 1000).toFixed(0)}k</span>
                                      </div>
                                      <p className="text-neutral-500 text-xs leading-relaxed">{feature.description}</p>
                                    </div>
                                  </motion.div>
                                );
                              })
                            ) : (
                              selectedService.scopes.map(scope => (
                                <motion.div
                                  key={scope.id}
                                  whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
                                  onClick={() => {
                                    setSelections(prev => ({ ...prev, scopeId: scope.id }));
                                    handleNext();
                                  }}
                                  className={cn(
                                    "p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300",
                                    selections.scopeId === scope.id ? "bg-neutral-50 shadow-md" : "border-neutral-100 hover:border-neutral-200"
                                  )}
                                  style={{ 
                                    borderColor: selections.scopeId === scope.id ? config.primaryColor : undefined 
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-neutral-900">{scope.label}</h4>
                                    <span className="text-neutral-400 text-xs font-mono">
                                      From ${((config.pricing.services[selectedService.id] 
                                        ? (selectedService.scopes.indexOf(scope) === 0 ? config.pricing.services[selectedService.id].small : selectedService.scopes.indexOf(scope) === 1 ? config.pricing.services[selectedService.id].medium : config.pricing.services[selectedService.id].large)
                                        : scope.basePrice) * config.pricing.globalMultiplier / 1000).toFixed(0)}k
                                    </span>
                                  </div>
                                  <p className="text-neutral-500 text-sm leading-relaxed">{scope.description}</p>
                                </motion.div>
                              ))
                            )}
                          </div>

                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 space-y-2"
                          >
                            <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-2">
                              <MessageSquare size={12} />
                              Additional Project Details / Notes
                            </label>
                            <textarea
                              value={selections.notes}
                              onChange={(e) => setSelections(prev => ({ ...prev, notes: e.target.value }))}
                              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 transition-all h-24 resize-none text-sm shadow-inner"
                              style={{ 
                                '--tw-ring-color': `${config.primaryColor}0d`,
                                borderColor: selections.notes ? config.primaryColor : undefined
                              } as any}
                              placeholder="Tell us more about your vision..."
                            />
                          </motion.div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-serif mb-2">Project Timeline</h3>
                            <p className="text-neutral-500 text-sm">When would you like to see your vision come to life?</p>
                          </div>
                          <div className="space-y-4">
                            {TIMELINES.map(t => (
                              <motion.div
                                key={t.id}
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  setSelections(prev => ({ ...prev, timeline: t.id }));
                                  handleNext();
                                }}
                                className={cn(
                                  "flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300",
                                  selections.timeline === t.id ? "bg-neutral-50 shadow-sm" : "border-neutral-100 hover:border-neutral-200"
                                )}
                                style={{ 
                                  borderColor: selections.timeline === t.id ? config.primaryColor : undefined 
                                }}
                              >
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors"
                                )}
                                style={{ 
                                  borderColor: selections.timeline === t.id ? config.primaryColor : '#d1d5db' 
                                }}>
                                  {selections.timeline === t.id && (
                                    <motion.div 
                                      layoutId="timeline-dot"
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: config.primaryColor }}
                                    />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-neutral-900">{t.label}</h4>
                                  <p className="text-neutral-500 text-sm">{t.desc}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-serif mb-2">The Final Details</h3>
                            <p className="text-neutral-500 text-sm">Where should we send your custom investment guide?</p>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-2">
                                  <User size={12} /> Full Name
                                </label>
                                <input
                                  type="text"
                                  value={selections.leadData.name}
                                  onChange={(e) => updateLeadData('name', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="John Doe"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-2">
                                  <Mail size={12} /> Email Address
                                </label>
                                <input
                                  type="email"
                                  value={selections.leadData.email}
                                  onChange={(e) => updateLeadData('email', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="john@example.com"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-2">
                                  <Phone size={12} /> Phone Number
                                </label>
                                <input
                                  type="tel"
                                  value={selections.leadData.phone}
                                  onChange={(e) => updateLeadData('phone', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="(555) 000-0000"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-2">
                                  <MapPin size={12} /> Street Address
                                </label>
                                <input
                                  type="text"
                                  value={selections.leadData.address}
                                  onChange={(e) => updateLeadData('address', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="123 Luxury Lane"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">City</label>
                                <input
                                  type="text"
                                  value={selections.leadData.city}
                                  onChange={(e) => updateLeadData('city', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="Toronto"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Province</label>
                                <input
                                  type="text"
                                  value={selections.leadData.province}
                                  onChange={(e) => updateLeadData('province', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="Ontario"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Postal Code</label>
                                <input
                                  type="text"
                                  value={selections.leadData.postalCode}
                                  onChange={(e) => updateLeadData('postalCode', e.target.value)}
                                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm shadow-sm"
                                  style={{ '--tw-ring-color': `${config.primaryColor}0d` } as any}
                                  placeholder="M5V 2L7"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 5 && (
                        <div className="text-center py-8">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            <Sparkles size={32} className="text-white" />
                          </motion.div>
                          <h3 className="text-3xl font-serif mb-2">Your Estimate is Ready</h3>
                          <p className="text-neutral-500 mb-10 text-sm">
                            Based on your selections for {selectedService?.title} 
                            ({selectedService?.detailedFeatures ? `${selections.featureIds.length} Features Selected` : selectedScope?.label}).
                          </p>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-neutral-50 rounded-3xl p-8 mb-10 inline-block border border-neutral-100 shadow-sm"
                          >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 block mb-2">Estimated Investment Range</span>
                            <div className="text-4xl md:text-5xl font-serif text-neutral-900">
                              ${(totalEstimate / 1000).toFixed(0)}k - ${(Math.round(totalEstimate * 1.4) / 1000).toFixed(0)}k
                            </div>
                          </motion.div>
                          
                          {config.features.showTestimonials && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="max-w-md mx-auto text-sm text-neutral-500 leading-relaxed italic"
                            >
                              "The {config.companyName} team transformed our home beyond our wildest dreams. Their attention to detail is unmatched."
                              <span className="block mt-2 font-semibold not-italic text-neutral-900">— Sarah & Mark, Toronto</span>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-6 bg-neutral-50 flex justify-between items-center border-t border-neutral-100">
                  <button 
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="text-neutral-400 hover:text-neutral-900 text-sm font-medium disabled:opacity-0 transition-all flex items-center gap-1"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-500"
                        )}
                        style={{ 
                          backgroundColor: i + 1 === currentStep ? config.primaryColor : '#e5e7eb',
                          width: i + 1 === currentStep ? '1rem' : '0.375rem'
                        }}
                      />
                    ))}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="text-white px-8 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {currentStep === 5 ? 'Finish' : 'Next'}
                    {currentStep < 5 && <ChevronRight size={16} />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </>
  );
}
