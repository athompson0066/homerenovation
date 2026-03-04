import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ServicePricing {
  small: number;
  medium: number;
  large: number;
}

export interface DetailedFeature {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface Scope {
  id: string;
  label: string;
  description: string;
  basePrice: number;
}

export interface Service {
  id: string;
  title: string;
  image: string;
  scopes: Scope[];
  detailedFeatures?: DetailedFeature[];
  pricing?: ServicePricing;
}

export interface WidgetConfig {
  id?: string;
  name?: string;
  companyName: string;
  primaryColor: string;
  fabIcon: string;
  header: {
    logoType: 'text' | 'image';
    logoText: string;
    logoImageUrl: string;
    textSize: number;
    imageHeight: number;
    imageWidth: number;
    title: string;
    subtitle: string;
  };
  services: Service[];
  pricing: {
    services: Record<string, ServicePricing>;
    globalMultiplier: number;
  };
  features: {
    showSocialProof: boolean;
    showTestimonials: boolean;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
}

const DEFAULT_SERVICES: Service[] = [
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

const DEFAULT_CONFIG: WidgetConfig = {
  companyName: 'KitchenPro',
  primaryColor: '#1a1a1a',
  fabIcon: 'Home',
  header: {
    logoType: 'text',
    logoText: 'KitchenPro',
    logoImageUrl: '',
    textSize: 24,
    imageHeight: 48,
    imageWidth: 0,
    title: 'Instant Renovation Estimate',
    subtitle: 'Get a professional cost breakdown in seconds',
  },
  services: DEFAULT_SERVICES,
  pricing: {
    services: {
      'custom-homes': { small: 500000, medium: 850000, large: 1200000 },
      'full-renovations': { small: 250000, medium: 450000, large: 750000 },
      'kitchen': { small: 45000, medium: 85000, large: 150000 },
      'bathroom': { small: 35000, medium: 65000, large: 110000 },
      'basement': { small: 45000, medium: 85000, large: 145000 },
      'additions': { small: 120000, medium: 350000, large: 550000 },
      'condo': { small: 65000, medium: 145000, large: 250000 },
    },
    globalMultiplier: 1.0,
  },
  features: {
    showSocialProof: true,
    showTestimonials: true,
  },
  typography: {
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
  },
};

interface ConfigContextType {
  config: WidgetConfig;
  allConfigs: { id: string; name: string }[];
  isLoading: boolean;
  loadConfig: (id: string) => Promise<void>;
  saveConfig: (id: string, name: string, data: WidgetConfig) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  updateConfig: (newConfig: Partial<WidgetConfig>) => void;
  updateServicePricing: (serviceId: string, pricing: Partial<ServicePricing>) => void;
  updateGlobalMultiplier: (multiplier: number) => void;
  updateFeatures: (newFeatures: Partial<WidgetConfig['features']>) => void;
  updateHeader: (newHeader: Partial<WidgetConfig['header']>) => void;
  updateTypography: (newTypography: Partial<WidgetConfig['typography']>) => void;
  addService: (service: Service) => void;
  updateService: (serviceId: string, service: Partial<Service>) => void;
  deleteService: (serviceId: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_CONFIG);
  const [allConfigs, setAllConfigs] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllConfigs = async () => {
    try {
      const res = await fetch('/api/configs');
      const data = await res.json();
      setAllConfigs(data);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    }
  };

  const loadConfig = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/configs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (id: string, name: string, data: WidgetConfig) => {
    try {
      // Save to local server
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, data }),
      });
      
      // Save to Supabase as well
      const { error: supabaseError } = await supabase
        .from('configs')
        .upsert({
          id,
          name,
          data,
          updated_at: new Date().toISOString()
        });

      if (supabaseError) {
        console.error('Supabase save error:', supabaseError);
      }

      if (res.ok) {
        await fetchAllConfigs();
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const res = await fetch(`/api/configs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllConfigs();
      }
    } catch (error) {
      console.error('Failed to delete config:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get('formId');
    
    const init = async () => {
      await fetchAllConfigs();
      if (formId) {
        await loadConfig(formId);
      } else {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  const updateConfig = (newConfig: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateServicePricing = (serviceId: string, pricing: Partial<ServicePricing>) => {
    setConfig(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        services: {
          ...prev.pricing.services,
          [serviceId]: { ...prev.pricing.services[serviceId], ...pricing }
        }
      },
    }));
  };

  const updateGlobalMultiplier = (multiplier: number) => {
    setConfig(prev => ({
      ...prev,
      pricing: { ...prev.pricing, globalMultiplier: multiplier },
    }));
  };

  const updateFeatures = (newFeatures: Partial<WidgetConfig['features']>) => {
    setConfig(prev => ({
      ...prev,
      features: { ...prev.features, ...newFeatures },
    }));
  };

  const updateHeader = (newHeader: Partial<WidgetConfig['header']>) => {
    setConfig(prev => ({
      ...prev,
      header: { ...prev.header, ...newHeader },
    }));
  };

  const updateTypography = (newTypography: Partial<WidgetConfig['typography']>) => {
    setConfig(prev => ({
      ...prev,
      typography: { ...prev.typography, ...newTypography },
    }));
  };

  const addService = (service: Service) => {
    setConfig(prev => ({
      ...prev,
      services: [...prev.services, service],
      pricing: {
        ...prev.pricing,
        services: {
          ...prev.pricing.services,
          [service.id]: service.pricing || { small: 0, medium: 0, large: 0 }
        }
      }
    }));
  };

  const updateService = (serviceId: string, service: Partial<Service>) => {
    setConfig(prev => {
      const newServices = prev.services.map(s => s.id === serviceId ? { ...s, ...service } : s);
      const updatedService = newServices.find(s => s.id === serviceId);
      
      return {
        ...prev,
        services: newServices,
        pricing: {
          ...prev.pricing,
          services: {
            ...prev.pricing.services,
            [serviceId]: updatedService?.pricing || prev.pricing.services[serviceId]
          }
        }
      };
    });
  };

  const deleteService = (serviceId: string) => {
    setConfig(prev => {
      const { [serviceId]: _, ...remainingPricing } = prev.pricing.services;
      return {
        ...prev,
        services: prev.services.filter(s => s.id !== serviceId),
        pricing: {
          ...prev.pricing,
          services: remainingPricing
        }
      };
    });
  };

  return (
    <ConfigContext.Provider value={{ 
      config, 
      allConfigs, 
      isLoading,
      loadConfig,
      saveConfig,
      deleteConfig,
      updateConfig, 
      updateServicePricing, 
      updateGlobalMultiplier, 
      updateFeatures, 
      updateHeader, 
      updateTypography,
      addService,
      updateService,
      deleteService
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
