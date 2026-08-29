import React, { createContext, useContext, useState, useEffect } from 'react';
import { MissionAlert, MissionAlertType, PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

export interface TippingPointTriggerParams {
  bioregionId?: string;
  bioregionName?: string;
  metricName?: string;
  positiveDeviationPct?: number;
  daysPeriod?: number;
  details?: string;
  targetView?: PageView;
  targetId?: string;
}

export interface MissionAlertContextType {
  alerts: MissionAlert[];
  unreadCount: number;
  trackedMissionIds: string[];
  isDrawerOpen: boolean;
  soundEnabled: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  trackMission: (missionId: string) => void;
  untrackMission: (missionId: string) => void;
  toggleTrackMission: (missionId: string) => void;
  isMissionTracked: (missionId: string) => boolean;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
  addAlert: (alert: Omit<MissionAlert, 'id' | 'timestamp' | 'read'>) => void;
  simulateTriggerAlert: (type?: MissionAlertType) => void;
  triggerTippingPointAlert: (params?: TippingPointTriggerParams) => void;
}

const INITIAL_ALERTS: MissionAlert[] = [
  {
    id: 'alt-001',
    missionId: 'mission-mathare-river',
    missionTitle: 'Mathare River Regeneration',
    type: 'milestone_verified',
    severity: 'success',
    title: 'Milestone 2 Verified: Embankment Stabilization',
    message: 'Independent field audit confirmed 1.45 km riparian embankment stabilized with vetiver bio-swales. Dissolved oxygen reached 6.4 mg/L.',
    timestamp: '12 minutes ago',
    read: false,
    cryptographicHash: '0x718a092c431b990f10c87214556677889900aabbccddeeff1122334455667788',
    targetView: 'regenerative-mission',
    targetId: 'm3',
    metadata: {
      verifiedBy: 'Center for Ecological Urbanism',
      certaintyScore: 98,
      epistemicTier: 'Ground Truth Telemetry'
    }
  },
  {
    id: 'alt-002',
    missionId: 'mission-mathare-river',
    missionTitle: 'Mathare River Regeneration',
    type: 'telemetry_anomaly',
    severity: 'warning',
    title: 'Telemetry Node #NBO-MAT-04: Flash Runoff Detected',
    message: 'Turbidity spiked to 48 NTU following upstream rainfall. Cascading bio-swales successfully buffer 72% of sediment load.',
    timestamp: '45 minutes ago',
    read: false,
    cryptographicHash: '0x9918bc2018ea1947201bc917281901abcf89410984a123901bca0928174a5b6c',
    targetView: 'evidence-mapping',
    targetId: 'raw-sensor-ysi-probe',
    metadata: {
      anomalyMetric: 'Turbidity',
      reading: '48.2 NTU',
      threshold: '35.0 NTU'
    }
  },
  {
    id: 'alt-003',
    missionId: 'mission-sahel-water-sponge',
    missionTitle: 'Sahelian Earth-Sponge Aquifer Recharge',
    type: 'failure_ledger_entry',
    severity: 'critical',
    title: 'New Failure Ledger Entry Codified (FL-2025-001)',
    message: 'Post-mortem codified: Single-species fast-growth acacia planting suffered 64% seedling desiccation during dry spell. Replaced with 7-layer polycultural Zaï pits.',
    timestamp: '2 hours ago',
    read: false,
    cryptographicHash: '0x8f92a4e7bc11904a62d083e91c784910ef3381a9420b57112ea09c5d19bf9810',
    targetView: 'failure-ledger',
    targetId: 'FL-2025-001',
    metadata: {
      failureCategory: 'biophysical_mismatch',
      verifiedBy: 'Dr. Aminata Diallo, Ecological Synthesis Group'
    }
  },
  {
    id: 'alt-004',
    missionId: 'mission-mara-agroforestry',
    missionTitle: 'Mara Riparian Buffer & Pastoralist Agroforestry',
    type: 'stewardship_endorsed',
    severity: 'info',
    title: 'Local Knowledge Submissions Ratified by Elder Council',
    message: 'Olosho customary dry-season grazing migration calendar formally anchored into the Mara River Bioregional Twin.',
    timestamp: '5 hours ago',
    read: true,
    cryptographicHash: '0x88f1b2098ac123901bca091234567890abcdef1234567890abcdef12345678',
    targetView: 'stewardship-reputation',
    targetId: 'lk-2025-002',
    metadata: {
      verifiedBy: 'Maasai Pastoralist Stewardship Trust'
    }
  }
];

const MissionAlertContext = createContext<MissionAlertContextType | undefined>(undefined);

export const MissionAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<MissionAlert[]>(() => {
    const saved = localStorage.getItem('atlas_mission_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ALERTS;
      }
    }
    return INITIAL_ALERTS;
  });

  const [trackedMissionIds, setTrackedMissionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('atlas_tracked_missions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['mission-mathare-river', 'mission-mara-agroforestry'];
      }
    }
    return ['mission-mathare-river', 'mission-mara-agroforestry'];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persist alerts
  useEffect(() => {
    localStorage.setItem('atlas_mission_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Persist tracked missions
  useEffect(() => {
    localStorage.setItem('atlas_tracked_missions', JSON.stringify(trackedMissionIds));
  }, [trackedMissionIds]);

  const unreadCount = alerts.filter(a => !a.read).length;

  const trackMission = (missionId: string) => {
    if (!trackedMissionIds.includes(missionId)) {
      audioFeedback.playSubtleClick();
      setTrackedMissionIds(prev => [...prev, missionId]);
    }
  };

  const untrackMission = (missionId: string) => {
    audioFeedback.playSubtleClick();
    setTrackedMissionIds(prev => prev.filter(id => id !== missionId));
  };

  const toggleTrackMission = (missionId: string) => {
    if (trackedMissionIds.includes(missionId)) {
      untrackMission(missionId);
    } else {
      trackMission(missionId);
    }
  };

  const isMissionTracked = (missionId: string) => {
    return trackedMissionIds.includes(missionId);
  };

  const markAsRead = (alertId: string) => {
    audioFeedback.playSubtleClick();
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    audioFeedback.playSyncComplete();
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const clearAlerts = () => {
    audioFeedback.playSubtleClick();
    setAlerts([]);
  };

  const addAlert = (alertData: Omit<MissionAlert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: MissionAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };

    setAlerts(prev => [newAlert, ...prev]);

    if (soundEnabled) {
      if (newAlert.severity === 'critical') {
        audioFeedback.playTelemetryWarning();
      } else {
        audioFeedback.playImpactTrigger();
      }
    }
  };

  const simulateTriggerAlert = (type?: MissionAlertType) => {
    const simulations: Array<Omit<MissionAlert, 'id' | 'timestamp' | 'read'>> = [
      {
        missionId: 'mission-mathare-river',
        missionTitle: 'Mathare River Regeneration',
        type: 'milestone_verified',
        severity: 'success',
        title: 'Milestone Verified: Water Sonde #04 Calibration',
        message: 'Dissolved oxygen reached 6.8 mg/L (target 7.5 mg/L). 14 multi-spectral drone passes verified zero trash accumulation.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'evidence-mapping',
        targetId: 'kpi-mathare-dissolved-oxygen',
        metadata: {
          verifiedBy: 'Kenya Hydrological Field Inspection Unit',
          certaintyScore: 99
        }
      },
      {
        missionId: 'mission-sahel-water-sponge',
        missionTitle: 'Sahelian Earth-Sponge Aquifer Recharge',
        type: 'failure_ledger_entry',
        severity: 'critical',
        title: 'Failure Ledger Alert: Micro-Swale Desiccation Audit',
        message: 'Quadrant 7 Zaï pits experienced premature soil crusting due to omission of composted millet chaff buffer. Root cause documented under FL-2025-004.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'failure-ledger',
        targetId: 'FL-2025-001',
        metadata: {
          failureCategory: 'biophysical_mismatch',
          verifiedBy: 'INRAN Soil Physics Lab'
        }
      },
      {
        missionId: 'mission-medellin-canopy',
        missionTitle: 'Medellín Urban Microclimate Bio-Canopy',
        type: 'telemetry_anomaly',
        severity: 'warning',
        title: 'Bio-Canopy Microclimate Anomaly: Peak Heat Surge',
        message: 'Unshaded concrete surface exceeded 47.8°C at Comuna 13 junction. Vertical green walls actively cooling adjacent pedestrian walkways by 2.2°C.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'regenerative-mission',
        targetId: 'md3',
        metadata: {
          anomalyMetric: 'Surface Heat',
          reading: '47.8°C',
          threshold: '42.0°C'
        }
      },
      {
        missionId: 'mission-mara-agroforestry',
        missionTitle: 'Mara Riparian Buffer & Pastoralist Agroforestry',
        type: 'stewardship_endorsed',
        severity: 'info',
        title: 'New Stewardship Reputation Attestation Minted',
        message: 'Elder Council attested 120 reputation points to Field Steward Ole Sankale for verifying Talek River watering corridors.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'stewardship-reputation',
        targetId: 'lk-2025-002',
        metadata: {
          verifiedBy: 'Maasai Pastoralist Council'
        }
      },
      {
        missionId: 'bioregion-aberdare-watershed',
        missionTitle: 'Aberdare Highland Watershed & Riparian Corridor',
        type: 'tipping_point',
        severity: 'success',
        title: 'Positive Tipping Point: +14.2% Sustained Metric Deviation (30-Day)',
        message: 'Forecast Model projection verified a sustained +14.2% positive deviation in Mycorrhizal Living Sponge & Aquifer Piezometric Head across 30 consecutive days. Regenerative trajectory has transitioned into self-reinforcing ecological lock-in.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'bioregional-twin',
        targetId: 'tipping-point-aberdare-som',
        metadata: {
          verifiedBy: 'Bioregional Causal Forecast Kernel & Sentinel-2 Mesh',
          certaintyScore: 97.4,
          epistemicTier: 'Non-Linear Ecological Attractor Verified',
          anomalyMetric: 'Aquifer Infiltration & Soil Carbon Stock'
        }
      }
    ];

    const selected = type 
      ? simulations.find(s => s.type === type) || simulations[0]
      : simulations[Math.floor(Math.random() * simulations.length)];

    addAlert(selected);
  };

  const triggerTippingPointAlert = (params?: TippingPointTriggerParams) => {
    const deviation = params?.positiveDeviationPct ?? 12.8;
    const days = params?.daysPeriod ?? 30;
    const bioregion = params?.bioregionName ?? 'Aberdare Riparian Watershed';
    const bioregionId = params?.bioregionId ?? 'aberdare_riparian_watershed';
    const metric = params?.metricName ?? 'Soil Organic Carbon & Aquifer Head';
    const details = params?.details ?? `Forecast Model projection confirms a sustained +${deviation.toFixed(1)}% positive deviation in ${metric} over a ${days}-day window, surpassing the biophysical threshold for self-sustaining ecological equilibrium.`;

    const tippingAlert: Omit<MissionAlert, 'id' | 'timestamp' | 'read'> = {
      missionId: bioregionId,
      missionTitle: bioregion,
      type: 'tipping_point',
      severity: 'success',
      title: `Positive Tipping Point: +${deviation.toFixed(1)}% Deviation (${days}-Day Sustained)`,
      message: details,
      cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      targetView: params?.targetView ?? 'bioregional-twin',
      targetId: params?.targetId ?? `tipping-point-${bioregionId}`,
      metadata: {
        verifiedBy: 'Atlas Sanctum Causal Forecast Engine & In-Situ Sensor Mesh',
        certaintyScore: 98.2,
        epistemicTier: 'Non-Linear Positive Attractor Confirmed',
        anomalyMetric: metric
      }
    };

    addAlert(tippingAlert);
  };

  return (
    <MissionAlertContext.Provider
      value={{
        alerts,
        unreadCount,
        trackedMissionIds,
        isDrawerOpen,
        soundEnabled,
        setIsDrawerOpen,
        setSoundEnabled,
        trackMission,
        untrackMission,
        toggleTrackMission,
        isMissionTracked,
        markAsRead,
        markAllAsRead,
        clearAlerts,
        addAlert,
        simulateTriggerAlert,
        triggerTippingPointAlert
      }}
    >
      {children}
    </MissionAlertContext.Provider>
  );
};

export const useMissionAlerts = (): MissionAlertContextType => {
  const context = useContext(MissionAlertContext);
  if (!context) {
    throw new Error('useMissionAlerts must be used within a MissionAlertProvider');
  }
  return context;
};
