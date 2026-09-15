import { AlertThresholdConfig } from './ThresholdAlertModal';

export interface AlertPreset {
  id: string;
  name: string;
  description: string;
  bioregionName?: string;
  bioregionId?: string;
  config: AlertThresholdConfig;
  category: 'aridity' | 'decoupling' | 'liquidity' | 'equilibrium' | 'flourishing' | 'custom';
  icon?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export const ALERT_PRESETS_STORAGE_KEY = 'atlas_sanctum_alert_presets_v2';

export const DEFAULT_ALERT_PRESETS: AlertPreset[] = [
  {
    id: 'preset-drought-stress',
    name: 'Drought & Aridity Stress Watch',
    description: 'Triggers when ecological flourishing falls below 70%, indicating drought-induced vegetation stress or aquifer recharge lag.',
    bioregionName: 'Semi-Arid Rangelands & Sahel Transition',
    bioregionId: 'pan-african',
    category: 'aridity',
    config: {
      enabled: true,
      metric: 'ecological',
      condition: 'below',
      value: 70
    }
  },
  {
    id: 'preset-decoupling-floor',
    name: 'Strict Decoupling Boundary',
    description: 'Signals an alert if the regenerative decoupling margin erodes below +35 pts, preventing re-coupling with extractive baseline.',
    bioregionName: 'Universal Bioregional Mesh',
    category: 'decoupling',
    config: {
      enabled: true,
      metric: 'decoupling',
      condition: 'below',
      value: 35
    }
  },
  {
    id: 'preset-liquidity-floor',
    name: 'Economic Stability Floor',
    description: 'Alerts when cooperative economic stability drops below 75%, safeguarding catalytic liquidity against market volatility.',
    bioregionName: 'Agro-processing & Solar Co-ops',
    bioregionId: 'pan-african',
    category: 'liquidity',
    config: {
      enabled: true,
      metric: 'economic',
      condition: 'below',
      value: 75
    }
  },
  {
    id: 'preset-equilibrium-safeguard',
    name: 'Equilibrium Safeguard Tier-1',
    description: 'Monitors the foundational 80% ecological equilibrium threshold required by the Covenant of Flourishing.',
    bioregionName: 'Mara-Serengeti & Rift Basin',
    bioregionId: 'pan-african',
    category: 'equilibrium',
    config: {
      enabled: true,
      metric: 'ecological',
      condition: 'below',
      value: 80
    }
  },
  {
    id: 'preset-high-altitude-agroforestry',
    name: 'Canopy Density Squeeze',
    description: 'High-altitude montane threshold monitoring canopy biomass and cloud-forest condensation retention.',
    bioregionName: 'Mount Kenya & Aberdare Watershed',
    category: 'flourishing',
    config: {
      enabled: true,
      metric: 'ecological',
      condition: 'below',
      value: 82
    }
  },
  {
    id: 'preset-super-flourishing',
    name: 'Super-Flourishing Catalyst',
    description: 'Positive trigger when ecological flourishing exceeds 90%, ratifying catalytic dividend payouts to community stewards.',
    bioregionName: 'Universal Sovereign Assembly',
    category: 'flourishing',
    config: {
      enabled: true,
      metric: 'ecological',
      condition: 'above',
      value: 90
    }
  }
];

export function loadAlertPresets(): AlertPreset[] {
  try {
    const raw = localStorage.getItem(ALERT_PRESETS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge defaults with custom presets
        const customOnly = parsed.filter(p => p.isCustom);
        return [...DEFAULT_ALERT_PRESETS, ...customOnly];
      }
    }
  } catch (err) {
    console.warn('Failed to load alert presets from localStorage:', err);
  }
  return DEFAULT_ALERT_PRESETS;
}

export function saveAlertPresets(presets: AlertPreset[]): void {
  try {
    localStorage.setItem(ALERT_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.warn('Failed to save alert presets to localStorage:', err);
  }
}

export function addCustomAlertPreset(newPreset: {
  name: string;
  description: string;
  bioregionName?: string;
  config: AlertThresholdConfig;
}): AlertPreset {
  const currentPresets = loadAlertPresets();
  const created: AlertPreset = {
    id: `custom-preset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: newPreset.name.trim() || 'Custom Bioregional Threshold',
    description: newPreset.description.trim() || 'User-defined monitoring threshold combination',
    bioregionName: newPreset.bioregionName || 'Custom Bioregion',
    config: newPreset.config,
    category: 'custom',
    isCustom: true,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const updated = [...currentPresets, created];
  saveAlertPresets(updated);
  return created;
}

export function deleteCustomAlertPreset(id: string): AlertPreset[] {
  const currentPresets = loadAlertPresets();
  const filtered = currentPresets.filter(p => p.id !== id || !p.isCustom);
  saveAlertPresets(filtered);
  return filtered;
}
