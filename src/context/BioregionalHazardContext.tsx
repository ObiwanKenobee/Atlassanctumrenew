import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BIOREGIONAL_LEDGER_REGIONS, 
  BioregionalLedgerData, 
  EcologicalMetricItem 
} from '../data/bioregionalLedgerData';
import { PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

export interface BioregionalHazardAlert {
  id: string;
  regionId: string;
  regionName: string;
  metricId: string;
  metricName: string;
  category: 'water' | 'soil' | 'canopy' | 'biodiversity' | 'energy';
  severity: 'critical' | 'warning' | 'info';
  currentValue: string | number;
  criticalThreshold: string | number;
  unit: string;
  deviationPct: number;
  telemetrySource: string;
  sensorNodeId: string;
  detectedAt: string;
  status: 'active' | 'acknowledged' | 'investigating';
  recommendedAction: string;
  targetTab: PageView;
  cryptographicHash: string;
}

interface BioregionalHazardContextType {
  alerts: BioregionalHazardAlert[];
  activeAlerts: BioregionalHazardAlert[];
  criticalCount: number;
  warningCount: number;
  isMonitoring: boolean;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  simulateBreach: (category?: 'water' | 'soil' | 'canopy' | 'biodiversity') => void;
  resetToNominal: () => void;
}

const BioregionalHazardContext = createContext<BioregionalHazardContextType | null>(null);

// Baseline hazard templates based on real biophysical thresholds
const INITIAL_HAZARDS: BioregionalHazardAlert[] = [
  {
    id: 'hazard-wat-001',
    regionId: 'mara-serengeti',
    regionName: 'Mara-Serengeti Savanna Basin',
    metricId: 'm-water-baseflow',
    metricName: 'Talek Riparian Sub-Basin Baseflow',
    category: 'water',
    severity: 'critical',
    currentValue: '3.82',
    criticalThreshold: '4.50',
    unit: 'm³/s',
    deviationPct: -15.1,
    telemetrySource: 'Acoustic Doppler Piezometer Node #TK-04',
    sensorNodeId: 'NODE-MARA-WAT-402',
    detectedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    status: 'active',
    recommendedAction: 'Enforce rotational baseflow extraction accord & activate sand dam subsurface retention swales',
    targetTab: 'bioregional-ledger',
    cryptographicHash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a'
  },
  {
    id: 'hazard-soil-002',
    regionId: 'mara-serengeti',
    regionName: 'Mara-Serengeti Savanna Basin',
    metricId: 'm-soil-carbon',
    metricName: 'Oiti Basin Soil Organic Carbon',
    category: 'soil',
    severity: 'warning',
    currentValue: '2.04',
    criticalThreshold: '2.10',
    unit: '%',
    deviationPct: -2.8,
    telemetrySource: 'Spectrometric Soil Probe Array #SP-12',
    sensorNodeId: 'NODE-MARA-SOIL-119',
    detectedAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    status: 'active',
    recommendedAction: 'Deploy high-density mobile livestock kraaling with biochar inoculation',
    targetTab: 'bioregional-ledger',
    cryptographicHash: '0x1c94b281f9a0d8b2e5c1a7e4b9d0a1b2c3d4e5f6'
  },
  {
    id: 'hazard-can-003',
    regionId: 'aberdare-cloud-forest',
    regionName: 'Aberdare Cloud Forest High Catchment',
    metricId: 'm-canopy-density',
    metricName: 'Bamboo Zone Moisture Condensation Canopy',
    category: 'canopy',
    severity: 'warning',
    currentValue: '58.4',
    criticalThreshold: '62.0',
    unit: '%',
    deviationPct: -5.8,
    telemetrySource: 'GEDI Spaceborne Lidar + Drone Transect #AB-09',
    sensorNodeId: 'NODE-ABER-CAN-881',
    detectedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'active',
    recommendedAction: 'Augment indigenous Hagenia abyssinica canopy regeneration transects',
    targetTab: 'bioregional-ledger',
    cryptographicHash: '0x3d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e'
  }
];

export const BioregionalHazardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<BioregionalHazardAlert[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_hazard_alerts');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_HAZARDS;
  });

  const [selectedRegionId, setSelectedRegionId] = useState<string>('mara-serengeti');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);

  // Persist alert state modifications
  useEffect(() => {
    try {
      localStorage.setItem('atlas_hazard_alerts', JSON.stringify(alerts));
    } catch {
      // Ignore
    }
  }, [alerts]);

  const activeAlerts = useMemo(() => {
    return alerts.filter(a => a.status === 'active');
  }, [alerts]);

  const criticalCount = useMemo(() => {
    return activeAlerts.filter(a => a.severity === 'critical').length;
  }, [activeAlerts]);

  const warningCount = useMemo(() => {
    return activeAlerts.filter(a => a.severity === 'warning').length;
  }, [activeAlerts]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    audioFeedback.playSubtleClick();
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'acknowledged' };
      }
      return a;
    }));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    audioFeedback.playSubtleClick();
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const simulateBreach = useCallback((category: 'water' | 'soil' | 'canopy' | 'biodiversity' = 'water') => {
    audioFeedback.playWarningPulse();
    const id = `sim-breach-${Date.now()}`;
    const newHazard: BioregionalHazardAlert = {
      id,
      regionId: selectedRegionId,
      regionName: BIOREGIONAL_LEDGER_REGIONS[selectedRegionId]?.regionName || 'Bioregional Basin',
      metricId: `sim-metric-${category}`,
      metricName: category === 'water' 
        ? 'Riparian Aquifer Recharge Velocity'
        : category === 'soil'
        ? 'Soil Micro-Arthropod Functional Diversity'
        : category === 'canopy'
        ? 'Riverine Galana Gallery Forest Density'
        : 'Keystone Ungulate Migration Porosity Index',
      category,
      severity: 'critical',
      currentValue: category === 'water' ? '2.14' : category === 'soil' ? '1.45' : '36.8',
      criticalThreshold: category === 'water' ? '4.00' : category === 'soil' ? '2.00' : '45.0',
      unit: category === 'water' ? 'm³/s' : category === 'soil' ? 'index' : '%',
      deviationPct: -46.5,
      telemetrySource: 'Simulated In-Situ Telemetry Mesh Stress Spike',
      sensorNodeId: `SIM-NODE-${Math.floor(1000 + Math.random() * 9000)}`,
      detectedAt: new Date().toISOString(),
      status: 'active',
      recommendedAction: 'Trigger emergency community water rationing & activate riparian buffer shields',
      targetTab: 'bioregional-ledger',
      cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    setAlerts(prev => [newHazard, ...prev]);
  }, [selectedRegionId]);

  const resetToNominal = useCallback(() => {
    audioFeedback.playSuccessChime();
    setAlerts(INITIAL_HAZARDS.map(h => ({ ...h, status: 'acknowledged' })));
  }, []);

  return (
    <BioregionalHazardContext.Provider
      value={{
        alerts,
        activeAlerts,
        criticalCount,
        warningCount,
        isMonitoring,
        selectedRegionId,
        setSelectedRegionId,
        acknowledgeAlert,
        dismissAlert,
        simulateBreach,
        resetToNominal
      }}
    >
      {children}
    </BioregionalHazardContext.Provider>
  );
};

export const useBioregionalHazard = () => {
  const context = useContext(BioregionalHazardContext);
  if (!context) {
    throw new Error('useBioregionalHazard must be used within a BioregionalHazardProvider');
  }
  return context;
};
