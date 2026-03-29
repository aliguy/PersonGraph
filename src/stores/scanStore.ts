import { create } from 'zustand';
import type { PersonScan, ScanConfig, ApiKeyConfig } from '../types';

interface ScanStore {
  scans: PersonScan[];
  apiKeys: ApiKeyConfig;
  addScan: (config: ScanConfig) => PersonScan;
  updateScan: (id: string, updates: Partial<PersonScan>) => void;
  deleteScan: (id: string) => void;
  setApiKeys: (keys: Partial<ApiKeyConfig>) => void;
}

const loadApiKeys = (): ApiKeyConfig => {
  try {
    const stored = localStorage.getItem('persongraph_api_keys');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { proxycurl: '', serpapi: '', anthropic: '', openai: '', github: '', twitter: '', youtube: '' };
};

const loadScans = (): PersonScan[] => {
  try {
    const stored = localStorage.getItem('persongraph_scans');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
};

export const useScanStore = create<ScanStore>((set, get) => ({
  scans: loadScans(),
  apiKeys: loadApiKeys(),

  addScan: (config) => {
    const scan: PersonScan = {
      id: crypto.randomUUID(),
      config,
      status: 'queued',
      sourcesFound: 0,
      sourcesProcessed: 0,
      nodesGenerated: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
      error: null,
    };
    set((state) => {
      const scans = [scan, ...state.scans];
      localStorage.setItem('persongraph_scans', JSON.stringify(scans));
      return { scans };
    });
    return scan;
  },

  updateScan: (id, updates) => {
    set((state) => {
      const scans = state.scans.map((s) => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem('persongraph_scans', JSON.stringify(scans));
      return { scans };
    });
  },

  deleteScan: (id) => {
    set((state) => {
      const scans = state.scans.filter((s) => s.id !== id);
      localStorage.setItem('persongraph_scans', JSON.stringify(scans));
      return { scans };
    });
  },

  setApiKeys: (keys) => {
    set((state) => {
      const apiKeys = { ...state.apiKeys, ...keys };
      localStorage.setItem('persongraph_api_keys', JSON.stringify(apiKeys));
      return { apiKeys };
    });
  },
}));
