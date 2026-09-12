import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { audioFeedback } from '../lib/audioFeedback';

export type AdaptiveLightingSensitivity = 'low' | 'balanced' | 'high';

interface AdaptiveLightingContextType {
  isAdaptiveLightingEnabled: boolean;
  toggleAdaptiveLighting: () => void;
  setAdaptiveLightingEnabled: (enabled: boolean) => void;
  interactionLevel: number; // 0 - 100
  isHighContrastEngaged: boolean;
  sensitivity: AdaptiveLightingSensitivity;
  setSensitivity: (s: AdaptiveLightingSensitivity) => void;
  idleTimeSeconds: number;
  triggerManualHighContrastTest: () => void;
}

const AdaptiveLightingContext = createContext<AdaptiveLightingContextType | null>(null);

const STORAGE_KEY_ENABLED = 'atlas_adaptive_lighting_enabled';
const STORAGE_KEY_SENSITIVITY = 'atlas_adaptive_lighting_sensitivity';

export const AdaptiveLightingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, updatePlatformSettings } = useAuth();

  const [isAdaptiveLightingEnabled, setIsAdaptiveLightingEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(STORAGE_KEY_ENABLED);
    return saved === 'true';
  });

  const [sensitivity, setSensitivityState] = useState<AdaptiveLightingSensitivity>(() => {
    if (typeof window === 'undefined') return 'balanced';
    const saved = localStorage.getItem(STORAGE_KEY_SENSITIVITY);
    return (saved === 'low' || saved === 'balanced' || saved === 'high') ? saved : 'balanced';
  });

  const [interactionLevel, setInteractionLevel] = useState<number>(100);
  const [isHighContrastEngaged, setIsHighContrastEngaged] = useState<boolean>(false);
  const [idleTimeSeconds, setIdleTimeSeconds] = useState<number>(0);

  const lastActivityTimestamp = useRef<number>(Date.now());
  const interactionCounter = useRef<number>(0);
  const isHighContrastRef = useRef<boolean>(false);

  // Sensitivity thresholds (seconds of low activity before engaging high contrast)
  const idleThresholdSeconds = sensitivity === 'high' ? 8 : sensitivity === 'balanced' ? 18 : 35;

  const setSensitivity = useCallback((s: AdaptiveLightingSensitivity) => {
    setSensitivityState(s);
    localStorage.setItem(STORAGE_KEY_SENSITIVITY, s);
  }, []);

  const applyContrastMode = useCallback((engageHighContrast: boolean) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (engageHighContrast) {
      if (!root.classList.contains('high-contrast')) {
        root.classList.add('theme-transitioning');
        root.classList.add('high-contrast');
        root.setAttribute('data-adaptive-contrast', 'engaged');
        setIsHighContrastEngaged(true);
        isHighContrastRef.current = true;
        audioFeedback.playMicroTick();
        setTimeout(() => root.classList.remove('theme-transitioning'), 400);
      }
    } else {
      if (root.classList.contains('high-contrast')) {
        root.classList.add('theme-transitioning');
        root.classList.remove('high-contrast');
        root.removeAttribute('data-adaptive-contrast');
        setIsHighContrastEngaged(false);
        isHighContrastRef.current = false;
        setTimeout(() => root.classList.remove('theme-transitioning'), 400);
      }
    }
  }, []);

  const toggleAdaptiveLighting = useCallback(() => {
    setIsAdaptiveLightingEnabled(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_ENABLED, String(next));
      audioFeedback.playSubtleClick();

      if (!next) {
        // Disengage contrast when turned off
        applyContrastMode(false);
      }

      if (userProfile && updatePlatformSettings) {
        updatePlatformSettings({ adaptiveLightingActive: next } as any);
      }

      return next;
    });
  }, [applyContrastMode, updatePlatformSettings, userProfile]);

  const setAdaptiveLightingEnabled = useCallback((enabled: boolean) => {
    setIsAdaptiveLightingEnabled(enabled);
    localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
    if (!enabled) {
      applyContrastMode(false);
    }
  }, [applyContrastMode]);

  const triggerManualHighContrastTest = useCallback(() => {
    audioFeedback.playCovenantResonance();
    applyContrastMode(!isHighContrastEngaged);
  }, [applyContrastMode, isHighContrastEngaged]);

  // Track user interaction events (typing, mouse movements, scrolling, clicking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUserInteraction = () => {
      lastActivityTimestamp.current = Date.now();
      interactionCounter.current += 1;

      // If high contrast was engaged due to inactivity, restore standard theme on interaction
      if (isAdaptiveLightingEnabled && isHighContrastRef.current) {
        applyContrastMode(false);
      }
    };

    window.addEventListener('mousemove', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });
    window.addEventListener('scroll', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isAdaptiveLightingEnabled, applyContrastMode]);

  // Interval loop: calculate interaction level and apply high contrast when reading/idle
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastActivityTimestamp.current) / 1000);
      setIdleTimeSeconds(elapsedSeconds);

      // Compute dynamic 0 - 100 interaction score based on decay
      const decayRatio = Math.max(0, 1 - (elapsedSeconds / idleThresholdSeconds));
      const computedScore = Math.round(decayRatio * 100);
      setInteractionLevel(computedScore);

      if (isAdaptiveLightingEnabled) {
        if (elapsedSeconds >= idleThresholdSeconds && !isHighContrastRef.current) {
          // Inactivity detected -> switch to High Contrast for maximum visual clarity
          applyContrastMode(true);
        } else if (elapsedSeconds < idleThresholdSeconds && isHighContrastRef.current) {
          applyContrastMode(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAdaptiveLightingEnabled, idleThresholdSeconds, applyContrastMode]);

  return (
    <AdaptiveLightingContext.Provider
      value={{
        isAdaptiveLightingEnabled,
        toggleAdaptiveLighting,
        setAdaptiveLightingEnabled,
        interactionLevel,
        isHighContrastEngaged,
        sensitivity,
        setSensitivity,
        idleTimeSeconds,
        triggerManualHighContrastTest
      }}
    >
      {children}
    </AdaptiveLightingContext.Provider>
  );
};

export const useAdaptiveLighting = () => {
  const context = useContext(AdaptiveLightingContext);
  if (!context) {
    return {
      isAdaptiveLightingEnabled: false,
      toggleAdaptiveLighting: () => {},
      setAdaptiveLightingEnabled: () => {},
      interactionLevel: 50,
      isHighContrastEngaged: false,
      sensitivity: 'balanced' as const,
      setSensitivity: () => {},
      idleTimeSeconds: 0,
      triggerManualHighContrastTest: () => {}
    };
  }
  return context;
};
