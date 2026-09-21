import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

export interface LiveSensorFeedItem {
  id: string;
  name: string;
  sensorNodeId: string;
  basinId: string;
  basinName: string;
  metricType: 'water_baseflow' | 'soil_moisture' | 'canopy_ndvi' | 'dissolved_oxygen' | 'air_pm25' | 'biodiversity_porosity';
  category: 'water' | 'soil' | 'canopy' | 'biodiversity' | 'energy';
  currentValue: number;
  unit: string;
  criticalThreshold: number;
  thresholdOperator: 'less_than' | 'greater_than';
  nominalRange: [number, number];
  samplingRateHz: number;
  lastTelemetryTimestamp: string;
  isBreached: boolean;
  telemetrySource: string;
  recommendedAction: string;
  history: number[];
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
  // Live Sensor Feed Engine & Header Alert Push
  sensorFeeds: LiveSensorFeedItem[];
  activeCriticalBannerAlert: BioregionalHazardAlert | null;
  isLiveStreaming: boolean;
  toggleLiveStreaming: () => void;
  streamFrequencyMs: number;
  setStreamFrequencyMs: (ms: number) => void;
  injectThresholdBreach: (sensorId?: string) => void;
  resolveSensorBreach: (sensorId: string) => void;
  deployRemediationAccord: (sensorIdOrNodeId: string, customAccordName?: string) => Promise<{ success: boolean; hash: string }>;
  dismissBannerAlert: () => void;
  isBannerDismissed: boolean;
  activeSensorsOnlineCount: number;
}

const BioregionalHazardContext = createContext<BioregionalHazardContextType | null>(null);

// Initial real-world sensor node feeds across critical bioregions
const INITIAL_SENSOR_FEEDS: LiveSensorFeedItem[] = [
  {
    id: 'sensor-mara-wat-01',
    name: 'Talek Riparian Sub-Basin Baseflow Piezometer',
    sensorNodeId: 'NODE-MARA-WAT-402',
    basinId: 'mara-serengeti',
    basinName: 'Mara-Serengeti Savanna Basin',
    metricType: 'water_baseflow',
    category: 'water',
    currentValue: 5.60,
    unit: 'm³/s',
    criticalThreshold: 4.50,
    thresholdOperator: 'less_than',
    nominalRange: [4.5, 7.2],
    samplingRateHz: 2.4,
    lastTelemetryTimestamp: new Date().toISOString(),
    isBreached: false,
    telemetrySource: 'Acoustic Doppler Piezometer Mesh #TK-04 (LoRaWAN + Sat-Uplink)',
    recommendedAction: 'Enforce rotational baseflow extraction accord & activate sand dam subsurface retention swales',
    history: [5.42, 5.48, 5.52, 5.56, 5.58, 5.60]
  },
  {
    id: 'sensor-mara-soil-02',
    name: 'Oiti Catchment Soil Volumetric Moisture & Organic Carbon',
    sensorNodeId: 'NODE-MARA-SOIL-119',
    basinId: 'mara-serengeti',
    basinName: 'Mara-Serengeti Savanna Basin',
    metricType: 'soil_moisture',
    category: 'soil',
    currentValue: 26.4,
    unit: '%',
    criticalThreshold: 18.0,
    thresholdOperator: 'less_than',
    nominalRange: [22.0, 35.0],
    samplingRateHz: 1.0,
    lastTelemetryTimestamp: new Date().toISOString(),
    isBreached: false,
    telemetrySource: 'Frequency Domain Soil Reflectometer Array #SP-12',
    recommendedAction: 'Deploy high-density mobile livestock kraaling with biochar inoculation',
    history: [25.8, 26.0, 26.2, 26.3, 26.4, 26.4]
  },
  {
    id: 'sensor-aber-can-03',
    name: 'Aberdare High Catchment Moisture Condensation Flux',
    sensorNodeId: 'NODE-ABER-CAN-881',
    basinId: 'aberdare-cloud-forest',
    basinName: 'Aberdare Cloud Forest High Catchment',
    metricType: 'canopy_ndvi',
    category: 'canopy',
    currentValue: 0.68,
    unit: 'NDVI',
    criticalThreshold: 0.62,
    thresholdOperator: 'less_than',
    nominalRange: [0.65, 0.85],
    samplingRateHz: 0.5,
    lastTelemetryTimestamp: new Date().toISOString(),
    isBreached: false,
    telemetrySource: 'GEDI Spaceborne Lidar + Drone Transect #AB-09',
    recommendedAction: 'Augment indigenous Hagenia abyssinica canopy regeneration transects',
    history: [0.74, 0.73, 0.71, 0.70, 0.69, 0.68]
  },
  {
    id: 'sensor-mara-do-04',
    name: 'Mara River Confluence Dissolved Oxygen & Thermal Probe',
    sensorNodeId: 'NODE-MARA-DO-305',
    basinId: 'mara-serengeti',
    basinName: 'Mara-Serengeti Savanna Basin',
    metricType: 'dissolved_oxygen',
    category: 'water',
    currentValue: 6.2,
    unit: 'mg/L',
    criticalThreshold: 4.8,
    thresholdOperator: 'less_than',
    nominalRange: [5.5, 8.5],
    samplingRateHz: 1.5,
    lastTelemetryTimestamp: new Date().toISOString(),
    isBreached: false,
    telemetrySource: 'Optical Dissolved Oxygen Sonde #DO-Mara-02',
    recommendedAction: 'Halt upstream industrial wastewater bypass valves immediately',
    history: [6.8, 6.7, 6.5, 6.4, 6.3, 6.2]
  },
  {
    id: 'sensor-nrb-pm-05',
    name: 'Karura Urban Forest Buffer Air Particulate Flux',
    sensorNodeId: 'NODE-NRB-AIR-091',
    basinId: 'nairobi-river-basin',
    basinName: 'Nairobi River Basin & Urban Forest Fringe',
    metricType: 'air_pm25',
    category: 'energy',
    currentValue: 34.2,
    unit: 'µg/m³',
    criticalThreshold: 55.0,
    thresholdOperator: 'greater_than',
    nominalRange: [12.0, 45.0],
    samplingRateHz: 2.0,
    lastTelemetryTimestamp: new Date().toISOString(),
    isBreached: false,
    telemetrySource: 'Optical Particle Counter Array #KAR-AQI-7',
    recommendedAction: 'Activate urban canopy dust absorption misting buffers',
    history: [28.5, 29.8, 31.2, 32.6, 33.8, 34.2]
  },
  {
    id: 'sensor-bio-mig-06',
    name: 'Loita Plains Keystone Ungulate Porosity Radar',
    sensorNodeId: 'NODE-LOITA-RAD-55',
    basinId: 'mara-serengeti',
    basinName: 'Mara-Serengeti Savanna Basin',
    metricType: 'biodiversity_porosity',
    category: 'biodiversity',
    currentValue: 68.4,
    unit: '%',
    criticalThreshold: 45.0,
    thresholdOperator: 'less_than',
    nominalRange: [50.0, 95.0],
    samplingRateHz: 0.8,
    lastTelemetryTimestamp: new Date().toISOString(),
    isBreached: false,
    telemetrySource: 'Bio-Acoustic Triangulation + Thermal Drone Grid #MIG-88',
    recommendedAction: 'Dismantle illegal perimeter fencing in corridor sector 4',
    history: [75.0, 73.2, 71.0, 69.8, 69.1, 68.4]
  }
];

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
    status: 'acknowledged',
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

  const [sensorFeeds, setSensorFeeds] = useState<LiveSensorFeedItem[]>(INITIAL_SENSOR_FEEDS);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('mara-serengeti');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [streamFrequencyMs, setStreamFrequencyMs] = useState<number>(3500);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('atlas_dismissed_hazard_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const lastAlertTimeRef = useRef<number>(0);

  // Persist alert state modifications
  useEffect(() => {
    try {
      localStorage.setItem('atlas_hazard_alerts', JSON.stringify(alerts));
    } catch {
      // Ignore
    }
  }, [alerts]);

  // Persist dismissed alerts to prevent re-triggering across page navigation
  useEffect(() => {
    try {
      sessionStorage.setItem('atlas_dismissed_hazard_alerts', JSON.stringify(dismissedAlertIds));
    } catch {
      // Ignore
    }
  }, [dismissedAlertIds]);

  const activeAlerts = useMemo(() => {
    return alerts.filter(a => a.status === 'active' && !dismissedAlertIds.includes(a.id));
  }, [alerts, dismissedAlertIds]);

  const criticalCount = useMemo(() => {
    return activeAlerts.filter(a => a.severity === 'critical').length;
  }, [activeAlerts]);

  const warningCount = useMemo(() => {
    return activeAlerts.filter(a => a.severity === 'warning').length;
  }, [activeAlerts]);

  // Primary critical alert pushed directly to the header banner (must not be dismissed)
  const activeCriticalBannerAlert = useMemo(() => {
    const critical = activeAlerts.find(a => a.severity === 'critical');
    return critical || null;
  }, [activeAlerts]);

  const isBannerDismissed = useMemo(() => {
    return activeCriticalBannerAlert === null;
  }, [activeCriticalBannerAlert]);

  const activeSensorsOnlineCount = useMemo(() => {
    return sensorFeeds.length;
  }, [sensorFeeds]);

  // Live Environmental Sensor Feed Heartbeat & Real-time Threshold Sentinel
  // Note: Nominal sensors oscillate safely within nominal bounds.
  // Real-time breaches only occur when a user explicitly runs an intervention test or simulation.
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setSensorFeeds(prevFeeds => {
        return prevFeeds.map(sensor => {
          let roundedVal: number;

          if (sensor.isBreached) {
            // Breached sensor micro-fluctuates around breached state until remediated
            const delta = (Math.random() - 0.5) * (sensor.currentValue * 0.01);
            roundedVal = Math.round((sensor.currentValue + delta) * 100) / 100;
          } else {
            // Nominal sensors oscillate realistically within safe nominal range (never auto-breaching)
            const mid = (sensor.nominalRange[0] + sensor.nominalRange[1]) / 2;
            const rangeSpan = sensor.nominalRange[1] - sensor.nominalRange[0];
            const delta = (Math.random() - 0.5) * (rangeSpan * 0.05);
            const nextVal = sensor.currentValue + delta;
            // Clamp within nominal range with 10% safety margin away from critical threshold
            const safeMin = sensor.thresholdOperator === 'less_than' 
              ? Math.max(sensor.nominalRange[0], sensor.criticalThreshold * 1.15)
              : sensor.nominalRange[0];
            const safeMax = sensor.thresholdOperator === 'greater_than'
              ? Math.min(sensor.nominalRange[1], sensor.criticalThreshold * 0.85)
              : sensor.nominalRange[1];
            const clamped = Math.max(safeMin, Math.min(safeMax, nextVal));
            roundedVal = Math.round(clamped * 100) / 100;
          }

          const isBreached = sensor.thresholdOperator === 'less_than' 
            ? roundedVal < sensor.criticalThreshold
            : roundedVal > sensor.criticalThreshold;

          // If breached state was activated by an intervention test, push alert once
          if (isBreached && !sensor.isBreached) {
            const now = Date.now();
            if (now - lastAlertTimeRef.current > 6000) {
              lastAlertTimeRef.current = now;
              audioFeedback.playWarningPulse();

              const deviationPct = Math.round(
                ((roundedVal - sensor.criticalThreshold) / sensor.criticalThreshold) * 1000
              ) / 10;

              const pushedAlert: BioregionalHazardAlert = {
                id: `hazard-live-${sensor.id}-${Date.now()}`,
                regionId: sensor.basinId,
                regionName: sensor.basinName,
                metricId: `metric-${sensor.metricType}`,
                metricName: sensor.name,
                category: sensor.category,
                severity: 'critical',
                currentValue: roundedVal,
                criticalThreshold: sensor.criticalThreshold,
                unit: sensor.unit,
                deviationPct,
                telemetrySource: sensor.telemetrySource,
                sensorNodeId: sensor.sensorNodeId,
                detectedAt: new Date().toISOString(),
                status: 'active',
                recommendedAction: sensor.recommendedAction,
                targetTab: 'bioregional-ledger',
                cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
              };

              setAlerts(prevAlerts => {
                const filtered = prevAlerts.filter(a => a.sensorNodeId !== sensor.sensorNodeId);
                return [pushedAlert, ...filtered];
              });
            }
          }

          const newHistory = [...sensor.history.slice(1), roundedVal];

          return {
            ...sensor,
            currentValue: roundedVal,
            isBreached: sensor.isBreached || isBreached,
            lastTelemetryTimestamp: new Date().toISOString(),
            history: newHistory
          };
        });
      });
    }, streamFrequencyMs);

    return () => clearInterval(interval);
  }, [isLiveStreaming, streamFrequencyMs]);

  const toggleLiveStreaming = useCallback(() => {
    audioFeedback.playSubtleClick();
    setIsLiveStreaming(prev => !prev);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    audioFeedback.playSubtleClick();
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'acknowledged' };
      }
      return a;
    }));
    setDismissedAlertIds(prev => Array.from(new Set([...prev, alertId])));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    audioFeedback.playSubtleClick();
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setDismissedAlertIds(prev => Array.from(new Set([...prev, alertId])));
  }, []);

  const dismissBannerAlert = useCallback(() => {
    audioFeedback.playSubtleClick();
    if (activeCriticalBannerAlert) {
      setDismissedAlertIds(prev => Array.from(new Set([...prev, activeCriticalBannerAlert.id])));
    }
  }, [activeCriticalBannerAlert]);

  // Inject a threshold breach to test the real-time push to header
  const injectThresholdBreach = useCallback((sensorId?: string) => {
    audioFeedback.playWarningPulse();
    const targetSensor = sensorId 
      ? sensorFeeds.find(s => s.id === sensorId || s.sensorNodeId === sensorId)
      : sensorFeeds[Math.floor(Math.random() * sensorFeeds.length)];

    if (!targetSensor) return;

    const breachedVal = targetSensor.thresholdOperator === 'less_than'
      ? Math.round((targetSensor.criticalThreshold * 0.78) * 100) / 100
      : Math.round((targetSensor.criticalThreshold * 1.35) * 100) / 100;

    const deviationPct = Math.round(
      ((breachedVal - targetSensor.criticalThreshold) / targetSensor.criticalThreshold) * 1000
    ) / 10;

    const pushedAlert: BioregionalHazardAlert = {
      id: `hazard-breach-${targetSensor.id}-${Date.now()}`,
      regionId: targetSensor.basinId,
      regionName: targetSensor.basinName,
      metricId: `metric-${targetSensor.metricType}`,
      metricName: targetSensor.name,
      category: targetSensor.category,
      severity: 'critical',
      currentValue: breachedVal,
      criticalThreshold: targetSensor.criticalThreshold,
      unit: targetSensor.unit,
      deviationPct,
      telemetrySource: `${targetSensor.telemetrySource} [LIVE THRESHOLD BREACH TRIGGERED]`,
      sensorNodeId: targetSensor.sensorNodeId,
      detectedAt: new Date().toISOString(),
      status: 'active',
      recommendedAction: targetSensor.recommendedAction,
      targetTab: 'bioregional-ledger',
      cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    setSensorFeeds(prev => prev.map(s => {
      if (s.id === targetSensor.id) {
        return {
          ...s,
          currentValue: breachedVal,
          isBreached: true,
          lastTelemetryTimestamp: new Date().toISOString(),
          history: [...s.history.slice(1), breachedVal]
        };
      }
      return s;
    }));

    setAlerts(prev => [pushedAlert, ...prev.filter(a => a.sensorNodeId !== targetSensor.sensorNodeId)]);
  }, [sensorFeeds]);

  // Resolve breach for a given sensor (by ID or node ID)
  const resolveSensorBreach = useCallback((sensorIdOrNodeId: string) => {
    audioFeedback.playSuccessChime();
    let targetNodeId = sensorIdOrNodeId;

    setSensorFeeds(prev => prev.map(s => {
      if (s.id === sensorIdOrNodeId || s.sensorNodeId === sensorIdOrNodeId) {
        targetNodeId = s.sensorNodeId;
        const nominalVal = s.nominalRange[0] + (s.nominalRange[1] - s.nominalRange[0]) * 0.5;
        const rounded = Math.round(nominalVal * 100) / 100;
        return {
          ...s,
          currentValue: rounded,
          isBreached: false,
          lastTelemetryTimestamp: new Date().toISOString(),
          history: [...s.history.slice(1), rounded]
        };
      }
      return s;
    }));

    setAlerts(prev => prev.map(a => {
      if (a.sensorNodeId === targetNodeId || a.id === sensorIdOrNodeId) {
        return { ...a, status: 'acknowledged' };
      }
      return a;
    }));

    // Remove matching alerts from banner
    setDismissedAlertIds(prev => {
      const matchingIds = alerts.filter(a => a.sensorNodeId === targetNodeId || a.id === sensorIdOrNodeId).map(a => a.id);
      return Array.from(new Set([...prev, ...matchingIds]));
    });
  }, [alerts]);

  // Deploy Remediation Accord: stabilizes telemetry, clears breach globally, records Merkle accord
  const deployRemediationAccord = useCallback(async (sensorIdOrNodeId: string, customAccordName?: string) => {
    audioFeedback.playSuccessChime();

    const targetSensor = sensorFeeds.find(
      s => s.id === sensorIdOrNodeId || s.sensorNodeId === sensorIdOrNodeId
    ) || sensorFeeds[0];

    const nominalVal = Math.round(
      (targetSensor.nominalRange[0] + (targetSensor.nominalRange[1] - targetSensor.nominalRange[0]) * 0.55) * 100
    ) / 100;

    // 1. Stabilize sensor feed in state
    setSensorFeeds(prev => prev.map(s => {
      if (s.id === targetSensor.id || s.sensorNodeId === targetSensor.sensorNodeId) {
        return {
          ...s,
          currentValue: nominalVal,
          isBreached: false,
          lastTelemetryTimestamp: new Date().toISOString(),
          history: [...s.history.slice(1), nominalVal]
        };
      }
      return s;
    }));

    // 2. Mark all matching hazard alerts as resolved & acknowledged
    setAlerts(prev => prev.map(a => {
      if (a.sensorNodeId === targetSensor.sensorNodeId || a.id === sensorIdOrNodeId) {
        return { ...a, status: 'acknowledged' };
      }
      return a;
    }));

    // 3. Clear banner persistently
    const relatedIds = alerts.filter(a => a.sensorNodeId === targetSensor.sensorNodeId || a.id === sensorIdOrNodeId).map(a => a.id);
    setDismissedAlertIds(prev => Array.from(new Set([...prev, ...relatedIds])));

    const accordHash = `0xaccord_${targetSensor.sensorNodeId.toLowerCase().replace(/-/g, '_')}_${Date.now().toString(16)}`;

    // 4. Dispatch custom event for real-time subscribers across the app
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bioregional-accord-deployed', {
        detail: {
          sensorNodeId: targetSensor.sensorNodeId,
          sensorName: targetSensor.name,
          basinId: targetSensor.basinId,
          basinName: targetSensor.basinName,
          actionName: customAccordName || targetSensor.recommendedAction,
          stabilizedValue: nominalVal,
          unit: targetSensor.unit,
          hash: accordHash,
          timestamp: new Date().toISOString()
        }
      }));
    }

    return { success: true, hash: accordHash };
  }, [sensorFeeds, alerts]);

  const simulateBreach = useCallback((category: 'water' | 'soil' | 'canopy' | 'biodiversity' = 'soil') => {
    const matchingSensor = sensorFeeds.find(s => s.category === category) || sensorFeeds[1] || sensorFeeds[0];
    injectThresholdBreach(matchingSensor.id);
  }, [sensorFeeds, injectThresholdBreach]);

  const resetToNominal = useCallback(() => {
    audioFeedback.playSuccessChime();
    setSensorFeeds(prev => prev.map(s => {
      const nominalVal = s.nominalRange[0] + (s.nominalRange[1] - s.nominalRange[0]) * 0.5;
      const rounded = Math.round(nominalVal * 100) / 100;
      return {
        ...s,
        currentValue: rounded,
        isBreached: false,
        lastTelemetryTimestamp: new Date().toISOString(),
        history: [...s.history.slice(1), rounded]
      };
    }));
    setAlerts(INITIAL_HAZARDS.map(h => ({ ...h, status: 'acknowledged' })));
    setDismissedAlertIds([]);
    try {
      sessionStorage.removeItem('atlas_dismissed_hazard_alerts');
    } catch {
      // Ignore
    }
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
        resetToNominal,
        sensorFeeds,
        activeCriticalBannerAlert,
        isLiveStreaming,
        toggleLiveStreaming,
        streamFrequencyMs,
        setStreamFrequencyMs,
        injectThresholdBreach,
        resolveSensorBreach,
        deployRemediationAccord,
        dismissBannerAlert,
        isBannerDismissed,
        activeSensorsOnlineCount
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

export const useBioregionalHazards = useBioregionalHazard;
