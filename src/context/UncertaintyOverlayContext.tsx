import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioFeedback } from '../lib/audioFeedback';

export type EpistemicConfidenceLevel = 'verified' | 'modeled' | 'estimated';

export interface UncertaintyClassification {
  level: EpistemicConfidenceLevel;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  overlayGlow: string;
  certaintyScore: number;
  margin: string;
  sourceType: string;
  humilityNotice: string;
}

interface UncertaintyOverlayContextType {
  isOverlayActive: boolean;
  toggleOverlay: () => void;
  setOverlayActive: (active: boolean) => void;
  classifyMetric: (
    certaintyScore?: number,
    epistemicStatus?: string,
    sourceType?: string
  ) => UncertaintyClassification;
}

const UncertaintyOverlayContext = createContext<UncertaintyOverlayContextType | undefined>(undefined);

export const UncertaintyOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('atlas_uncertainty_overlay');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('atlas_uncertainty_overlay', String(isOverlayActive));
    } catch (e) {
      console.warn('Could not persist uncertainty overlay state', e);
    }
  }, [isOverlayActive]);

  const toggleOverlay = () => {
    setIsOverlayActive(prev => {
      const next = !prev;
      if (next) {
        audioFeedback.playTelemetryWarning();
      } else {
        audioFeedback.playSubtleClick();
      }
      return next;
    });
  };

  const classifyMetric = (
    certaintyScore = 85,
    epistemicStatus = 'modeled',
    sourceType = 'algorithmic_model'
  ): UncertaintyClassification => {
    const statusLower = epistemicStatus.toLowerCase();
    
    // Level 1: Verified (In-situ ground truth, peer-reviewed physical audit, score >= 90)
    if (certaintyScore >= 90 || statusLower === 'verified' || statusLower === 'observed') {
      return {
        level: 'verified',
        label: 'Level 1 • Verified Ground-Truth',
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-400 border-emerald-500/40',
        borderColor: 'border-emerald-500/40',
        overlayGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30',
        certaintyScore,
        margin: '± 1.2% margin of error',
        sourceType: sourceType || 'In-Situ IoT Mesh / Elder Baraza Audit',
        humilityNotice: 'High epistemic fidelity. Direct empirical measurement anchored in the verifiable ledger.'
      };
    }

    // Level 2: Modeled (Algorithmic hydrodynamic, satellite interpolation, score 60 - 89)
    if (certaintyScore >= 60 || statusLower === 'modeled' || statusLower === 'reported') {
      return {
        level: 'modeled',
        label: 'Level 2 • Biophysical Model',
        badgeBg: 'bg-purple-500/15',
        badgeText: 'text-purple-300 border-purple-500/40',
        borderColor: 'border-purple-500/40',
        overlayGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30',
        certaintyScore,
        margin: '± 6.8% margin of error',
        sourceType: sourceType || 'Algorithmic Simulation / GIS Interpolation',
        humilityNotice: 'Institutional Humility Alert: Derived from computational models. Calibration drift may occur during unseasonal rainfall.'
      };
    }

    // Level 3: Estimated (Heuristic, self-reported survey, pre-baseline draft, score < 60)
    return {
      level: 'estimated',
      label: 'Level 3 • Heuristic Estimate',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-300 border-amber-500/40',
      borderColor: 'border-amber-500/40',
      overlayGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30',
      certaintyScore,
      margin: '± 18.5% margin of error',
      sourceType: sourceType || 'Extrapolated Estimate / Unverified Survey',
      humilityNotice: 'High Epistemic Uncertainty: Provisional approximation. Do not allocate non-recourse capital without physical ground audit.'
    };
  };

  return (
    <UncertaintyOverlayContext.Provider
      value={{
        isOverlayActive,
        toggleOverlay,
        setOverlayActive: setIsOverlayActive,
        classifyMetric
      }}
    >
      {children}
    </UncertaintyOverlayContext.Provider>
  );
};

export const useUncertaintyOverlay = () => {
  const context = useContext(UncertaintyOverlayContext);
  if (!context) {
    throw new Error('useUncertaintyOverlay must be used within an UncertaintyOverlayProvider');
  }
  return context;
};

export const UncertaintyOverlayToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isOverlayActive, toggleOverlay } = useUncertaintyOverlay();

  return (
    <button
      id="global-uncertainty-overlay-toggle"
      onClick={toggleOverlay}
      title={
        isOverlayActive
          ? 'Uncertainty Overlay ACTIVE: Color-coding metrics by source provenance (Verified / Modeled / Estimated)'
          : 'Toggle Epistemic Uncertainty Overlay'
      }
      className={`relative px-2.5 py-1.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
        isOverlayActive
          ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/50'
          : 'bg-[#0D0D0D] border-[#F5F5F0]/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#C5A059]/40'
      } ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full transition-all ${
          isOverlayActive
            ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B] animate-pulse'
            : 'bg-[#F5F5F0]/30'
        }`}
      />
      <span className="hidden sm:inline">
        {isOverlayActive ? 'Uncertainty On' : 'Uncertainty Overlay'}
      </span>
      <span className="sm:hidden">
        {isOverlayActive ? '± ON' : '±'}
      </span>
    </button>
  );
};

