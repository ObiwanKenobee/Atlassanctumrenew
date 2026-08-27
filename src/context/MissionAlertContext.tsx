import React, { createContext, useContext, useState, useEffect } from 'react';
import { MissionAlert, MissionAlertType, PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

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
  triggerInfrastructureAlert: (
    title: string,
    message: string,
    severity?: 'critical' | 'warning' | 'info',
    metadata?: Record<string, any>
  ) => void;
  checkInfrastructureHealth: () => Promise<void>;
  simulateVercelWebhook: (type: 'deployment.error' | 'deployment.succeeded' | 'deployment.canceled', target?: 'production' | 'preview', customError?: string) => Promise<void>;
  pollVercelWebhooks: () => Promise<void>;
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

  const triggerInfrastructureAlert = (
    title: string,
    message: string,
    severity: 'critical' | 'warning' | 'info' = 'critical',
    metadata?: Record<string, any>
  ) => {
    addAlert({
      missionId: 'system-infrastructure-core',
      missionTitle: 'Atlas Infrastructure & Deployment Mesh',
      type: severity === 'critical' ? 'infrastructure_error' : 'connectivity_degraded',
      severity,
      title,
      message,
      targetView: 'ai-engineering' as PageView,
      targetId: 'diagnostic-panel',
      cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      metadata: {
        verifiedBy: 'Atlas Runtime Diagnostic Watcher',
        certaintyScore: 99,
        epistemicTier: 'Deterministic System Probe',
        ...metadata
      }
    });
  };

  // Diagnostic health check function
  const checkInfrastructureHealth = async () => {
    try {
      const res = await fetch('/api/diagnostics/connectivity');
      if (!res.ok) {
        triggerInfrastructureAlert(
          'API Gateway Status Degraded',
          `HTTP ${res.status} returned from serverless diagnostic route. Dev server or Vercel Edge proxy may be experiencing cold-start or routing delays.`,
          'warning',
          { endpoint: '/api/diagnostics/connectivity', httpStatus: res.status }
        );
        return;
      }
      const data = await res.json();
      if (data.overallHealth === 'CRITICAL') {
        triggerInfrastructureAlert(
          'Critical Infrastructure Failure Detected',
          data.geminiApi?.details || 'Multiple core microservices are currently offline or unreachable.',
          'critical',
          { geminiStatus: data.geminiApi?.status, vercelEdge: data.vercelEdge?.status }
        );
      } else if (data.geminiApi?.status === 'KEY_MISSING') {
        // Only trigger once if not already notified
        const alreadyNotified = alerts.some(a => a.type === 'environment_failure' && a.title.includes('GEMINI_API_KEY'));
        if (!alreadyNotified) {
          addAlert({
            missionId: 'system-infrastructure-core',
            missionTitle: 'Atlas Intelligence Core',
            type: 'environment_failure',
            severity: 'warning',
            title: 'Environment Config Notice: GEMINI_API_KEY Missing',
            message: 'GEMINI_API_KEY is not configured in environment variables. AI reasoning and multimodal features are running in fallback mode.',
            targetView: 'ai-engineering' as PageView,
            targetId: 'diagnostic-panel',
            metadata: {
              remediation: 'Configure GEMINI_API_KEY in platform secrets or Vercel Environment Variables.'
            }
          });
        }
      }
    } catch (err: any) {
      console.warn('[INFRA-HEALTH] Diagnostic probe failed:', err);
    }
  };

  // Set of processed webhook IDs to prevent duplicate alerts
  const [processedWebhookIds, setProcessedWebhookIds] = useState<Set<string>>(() => {
    return new Set<string>(['wh_init_prod_success']);
  });

  // Vercel Webhook Event Listener & Poller
  const pollVercelWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks/vercel/events');
      if (!res.ok) return;
      const data = await res.json();
      const events = data.events || [];

      events.forEach((evt: any) => {
        if (processedWebhookIds.has(evt.id)) return;

        setProcessedWebhookIds(prev => new Set(prev).add(evt.id));

        const target = evt.payload?.deployment?.target || 'production';
        const commitMsg = evt.payload?.deployment?.meta?.githubCommitMessage || 'Vercel Deployment';
        const branch = evt.payload?.deployment?.meta?.githubCommitRef || 'main';
        const author = evt.payload?.deployment?.meta?.githubCommitAuthorName || 'Atlas Contributor';
        const errorMsg = evt.payload?.deployment?.errorMessage || 'Deployment failed during edge container initialization.';
        const url = evt.payload?.deployment?.url || 'atlassanctum.vercel.app';

        if (evt.type === 'deployment.error' || evt.type === 'deployment.canceled') {
          const isProduction = target === 'production';
          const alertType: MissionAlertType = isProduction ? 'vercel_build_failed' : 'vercel_preview_failed';

          addAlert({
            missionId: 'system-infrastructure-core',
            missionTitle: `Vercel CI/CD (${target.toUpperCase()})`,
            type: alertType,
            severity: 'critical',
            title: `Vercel ${target.toUpperCase()} Deployment Failure: ${branch}`,
            message: `Deployment to ${url} failed for commit "${commitMsg}" (${author}). Error: ${errorMsg}`,
            targetView: 'ai-engineering' as PageView,
            targetId: 'deployment-monitor',
            cryptographicHash: `0x${evt.id}_${Math.random().toString(16).substring(2, 10)}`,
            metadata: {
              verifiedBy: 'Vercel Build Webhook Gateway',
              certaintyScore: 100,
              epistemicTier: 'Authoritative CI/CD Webhook',
              targetEnvironment: target,
              branch,
              commitMessage: commitMsg,
              deploymentUrl: url,
              errorMessage: errorMsg,
              remediation: 'Inspect build logs in AI Engineering View -> Deployment Monitor or fix typescript / chunking errors.'
            }
          });
        } else if (evt.type === 'deployment.succeeded' || evt.type === 'deployment.ready') {
          addAlert({
            missionId: 'system-infrastructure-core',
            missionTitle: `Vercel CI/CD (${target.toUpperCase()})`,
            type: 'vercel_build_succeeded',
            severity: 'success',
            title: `Vercel ${target.toUpperCase()} Build Succeeded: ${branch}`,
            message: `New build successfully deployed to ${url}. Global edge functions verified and active.`,
            targetView: 'ai-engineering' as PageView,
            targetId: 'deployment-monitor',
            cryptographicHash: `0x${evt.id}_${Math.random().toString(16).substring(2, 10)}`,
            metadata: {
              verifiedBy: 'Vercel Edge Delivery Mesh',
              certaintyScore: 100,
              targetEnvironment: target,
              branch,
              deploymentUrl: url
            }
          });
        }
      });
    } catch (err) {
      console.warn('[VERCEL-WEBHOOK] Webhook poll error:', err);
    }
  };

  const simulateVercelWebhook = async (
    type: 'deployment.error' | 'deployment.succeeded' | 'deployment.canceled',
    target: 'production' | 'preview' = 'production',
    customError?: string
  ) => {
    try {
      const res = await fetch('/api/webhooks/vercel/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target, customError }),
      });
      if (res.ok) {
        audioFeedback.playSubtleClick();
        await pollVercelWebhooks();
      }
    } catch (err) {
      console.warn('[VERCEL-WEBHOOK] Simulate failed:', err);
    }
  };

  // Initial and periodic background connectivity & environment health audit + webhook polling
  useEffect(() => {
    const timer = setTimeout(() => {
      checkInfrastructureHealth();
      pollVercelWebhooks();
    }, 2000);

    const interval = setInterval(() => {
      checkInfrastructureHealth();
      pollVercelWebhooks();
    }, 15000); // Check webhook event queue every 15s

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [processedWebhookIds]);

  const simulateTriggerAlert = (type?: MissionAlertType) => {
    const simulations: Array<Omit<MissionAlert, 'id' | 'timestamp' | 'read'>> = [
      {
        missionId: 'system-infrastructure-core',
        missionTitle: 'Atlas Infrastructure & Deployment Mesh',
        type: 'infrastructure_error',
        severity: 'critical',
        title: 'Infrastructure Alert: Vercel Edge Serverless Timeout (504)',
        message: 'Edge function /api/gemini/stream exceeded execution timeout threshold (10,000ms). Manual chunking and streaming buffer recalibrated.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'ai-engineering' as PageView,
        targetId: 'diagnostic-panel',
        metadata: {
          verifiedBy: 'Vercel Edge Telemetry Monitor',
          certaintyScore: 99,
          anomalyMetric: 'Function Latency',
          reading: '10,240ms',
          threshold: '10,000ms'
        }
      },
      {
        missionId: 'system-infrastructure-core',
        missionTitle: 'Atlas Infrastructure & Deployment Mesh',
        type: 'environment_failure',
        severity: 'warning',
        title: 'Environment Variable Notice: GEMINI_API_KEY Deprecated Version',
        message: 'Detected Gemini API token nearing rate-limit quota or requiring rotation. Falling back to Gemini 3.7 Flash high-efficiency tier.',
        cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        targetView: 'ai-engineering' as PageView,
        targetId: 'diagnostic-panel',
        metadata: {
          verifiedBy: 'Atlas Secret Watcher'
        }
      },
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
      }
    ];

    const selected = type 
      ? simulations.find(s => s.type === type) || simulations[0]
      : simulations[Math.floor(Math.random() * simulations.length)];

    addAlert(selected);
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
        triggerInfrastructureAlert,
        checkInfrastructureHealth,
        simulateVercelWebhook,
        pollVercelWebhooks
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
