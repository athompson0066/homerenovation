import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ServicePricing {
  small: number;
  medium: number;
  large: number;
}

export interface WidgetConfig {
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
    <ConfigContext.Provider value={{ config, updateConfig, updateServicePricing, updateGlobalMultiplier, updateFeatures, updateHeader, updateTypography }}>
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
