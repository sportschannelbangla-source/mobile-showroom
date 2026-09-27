'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings, FestivalCampaign, Category } from '@/lib/types';
import { INITIAL_SETTINGS, INITIAL_CAMPAIGN, SEED_CATEGORIES } from '@/data/seed-data';

interface StoreContextType {
  settings: StoreSettings;
  campaign: FestivalCampaign;
  categories: Category[];
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType>({
  settings: INITIAL_SETTINGS,
  campaign: INITIAL_CAMPAIGN,
  categories: SEED_CATEGORIES,
  refreshData: async () => {},
  isLoading: false,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [campaign, setCampaign] = useState<FestivalCampaign>(INITIAL_CAMPAIGN);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [resSettings, resCampaign, resCategories] = await Promise.all([
        fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/campaign').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/categories').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (resSettings) setSettings(resSettings);
      if (resCampaign) setCampaign(resCampaign);
      if (resCategories && Array.isArray(resCategories)) setCategories(resCategories);
    } catch (e) {
      console.error('Failed to fetch store settings from API, using fallback data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <StoreContext.Provider value={{ settings, campaign, categories, refreshData, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
