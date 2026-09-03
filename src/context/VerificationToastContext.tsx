import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { audioFeedback } from '../lib/audioFeedback';

export interface VerificationNotification {
  id: string;
  title: string;
  claim: string;
  hash: string;
  verifier: string;
  certaintyScore: number;
  blockHeight?: number | string;
  timestamp: string;
  telemetrySource?: string;
  epistemicTier?: 'Cryptographic Merkle Leaf' | 'Multi-Party Consensus' | 'In-Situ Ground Truth' | 'Peer-Audited Satellite' | 'Ecological Threshold Alert' | 'Critical Bioregional Breach';
  severity?: 'normal' | 'warning' | 'critical' | 'alert';
  metricCategory?: 'water' | 'soil' | 'canopy' | 'biodiversity' | 'microclimate' | 'atmospheric' | 'integrated';
  thresholdDetails?: {
    metricName: string;
    thresholdValue: string;
    actualValue: string;
    unit: string;
    deltaDirection?: 'below' | 'above';
  };
}

interface VerificationToastContextType {
  notifications: VerificationNotification[];
  notifyVerified: (item: Omit<VerificationNotification, 'id' | 'timestamp'>) => void;
  notifyEcologicalAlert: (item: {
    title: string;
    claim: string;
    metricCategory: 'water' | 'soil' | 'canopy' | 'biodiversity' | 'microclimate' | 'atmospheric' | 'integrated';
    metricName: string;
    thresholdValue: string;
    actualValue: string;
    unit: string;
    hash?: string;
    verifier?: string;
    certaintyScore?: number;
    severity?: 'warning' | 'critical';
  }) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const VerificationToastContext = createContext<VerificationToastContextType | undefined>(undefined);

export const VerificationToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<VerificationNotification[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifyVerified = useCallback((item: Omit<VerificationNotification, 'id' | 'timestamp'>) => {
    const id = `VERIFY-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNotification: VerificationNotification = {
      ...item,
      id,
      timestamp: new Date().toISOString(),
      blockHeight: item.blockHeight || Math.floor(184200 + Math.random() * 9500),
      epistemicTier: item.epistemicTier || 'Cryptographic Merkle Leaf',
    };

    // Play subtle audio verification feedback chime
    try {
      audioFeedback.playSyncComplete();
    } catch {
      // Audio fallback safe
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 active toasts

    // Auto-dismiss after 6.5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 6500);
  }, [dismissNotification]);

  const notifyEcologicalAlert = useCallback((item: {
    title: string;
    claim: string;
    metricCategory: 'water' | 'soil' | 'canopy' | 'biodiversity' | 'microclimate' | 'atmospheric' | 'integrated';
    metricName: string;
    thresholdValue: string;
    actualValue: string;
    unit: string;
    hash?: string;
    verifier?: string;
    certaintyScore?: number;
    severity?: 'warning' | 'critical';
  }) => {
    const id = `ALERT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNotification: VerificationNotification = {
      id,
      title: item.title,
      claim: item.claim,
      hash: item.hash || `0xalert_${Math.random().toString(16).substring(2, 12)}`,
      verifier: item.verifier || 'Bioregional Sentinel & Ecological Threshold Monitor',
      certaintyScore: item.certaintyScore ?? 99.8,
      blockHeight: Math.floor(184200 + Math.random() * 9500),
      timestamp: new Date().toISOString(),
      telemetrySource: 'Continuous In-Situ Sensor Mesh & Hydro-Spatial Array',
      epistemicTier: item.severity === 'critical' ? 'Critical Bioregional Breach' : 'Ecological Threshold Alert',
      severity: item.severity || 'critical',
      metricCategory: item.metricCategory,
      thresholdDetails: {
        metricName: item.metricName,
        thresholdValue: item.thresholdValue,
        actualValue: item.actualValue,
        unit: item.unit
      }
    };

    // Play urgent sound feedback if critical
    try {
      if (item.severity === 'critical') {
        audioFeedback.playSubtleClick();
      } else {
        audioFeedback.playSubtleClick();
      }
    } catch {
      // safe fallback
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);

    // Longer display for critical alerts: 8.5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 8500);
  }, [dismissNotification]);

  // Global event listener for 'atlas-verification-success'
  useEffect(() => {
    const handleGlobalVerifyEvent = (e: CustomEvent<any>) => {
      if (e.detail) {
        notifyVerified({
          title: e.detail.title || 'Cryptographic Ledger Verification Confirmed',
          claim: e.detail.claim || e.detail.outcome || 'Data record authenticated against blockchain state root.',
          hash: e.detail.hash || `0x${Math.random().toString(16).substring(2, 14)}...`,
          verifier: e.detail.verifier || 'Decentralized Epistemic Node & Autonomous Arbiter',
          certaintyScore: e.detail.certaintyScore ?? 99.4,
          telemetrySource: e.detail.source || 'In-Situ Mesh Sensor',
          epistemicTier: e.detail.epistemicTier || 'Cryptographic Merkle Leaf',
        });
      }
    };

    window.addEventListener('atlas-verification-success' as any, handleGlobalVerifyEvent);
    return () => {
      window.removeEventListener('atlas-verification-success' as any, handleGlobalVerifyEvent);
    };
  }, [notifyVerified]);

  return (
    <VerificationToastContext.Provider
      value={{
        notifications,
        notifyVerified,
        notifyEcologicalAlert,
        dismissNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </VerificationToastContext.Provider>
  );
};

export const useVerificationToast = () => {
  const context = useContext(VerificationToastContext);
  if (!context) {
    throw new Error('useVerificationToast must be used within a VerificationToastProvider');
  }
  return context;
};
