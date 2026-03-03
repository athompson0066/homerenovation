import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ServicePricing {
  small: number;
  medium: number;
  large: number;
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
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, data }),
      });
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
      updateTypography 
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
