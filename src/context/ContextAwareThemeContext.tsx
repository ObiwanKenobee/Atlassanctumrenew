import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { audioFeedback } from '../lib/audioFeedback';

export type ThemeMode = 'dark' | 'light' | 'system' | 'context_aware';

export interface EnvironmentalSensorData {
  lux: number | null;
  ambientMode: 'bright' | 'dim' | 'dark' | 'unknown';
  solarPhase: 'dawn' | 'daylight' | 'dusk' | 'nocturnal';
  localSolarHour: number;
  wakeLockActive: boolean;
  sensorSupported: boolean;
  wakeLockSupported: boolean;
}

interface ContextAwareThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  sensorData: EnvironmentalSensorData;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
  toggleWakeLock: () => Promise<boolean>;
}

const ContextAwareThemeContext = createContext<ContextAwareThemeContextType | null>(null);

export const ContextAwareThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('atlas_theme_mode') as ThemeMode;
    return (saved === 'dark' || saved === 'light' || saved === 'system' || saved === 'context_aware')
      ? saved
      : 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [sensorData, setSensorData] = useState<EnvironmentalSensorData>({
    lux: null,
    ambientMode: 'unknown',
    solarPhase: 'nocturnal',
    localSolarHour: new Date().getHours(),
    wakeLockActive: false,
    sensorSupported: false,
    wakeLockSupported: typeof navigator !== 'undefined' && 'wakeLock' in navigator
  });

  const wakeLockSentinelRef = useRef<any>(null);

  // Calculate local solar phase based on 24-hour clock
  const calculateSolarPhase = (hour: number, minute: number): {
    phase: 'dawn' | 'daylight' | 'dusk' | 'nocturnal';
    recommendedTheme: 'dark' | 'light';
  } => {
    const timeDecimal = hour + minute / 60;
    if (timeDecimal >= 6.0 && timeDecimal < 7.5) {
      return { phase: 'dawn', recommendedTheme: 'light' };
    } else if (timeDecimal >= 7.5 && timeDecimal < 18.25) {
      return { phase: 'daylight', recommendedTheme: 'light' };
    } else if (timeDecimal >= 18.25 && timeDecimal < 19.5) {
      return { phase: 'dusk', recommendedTheme: 'dark' };
    } else {
      return { phase: 'nocturnal', recommendedTheme: 'dark' };
    }
  };

  // Screen Wake Lock API handler
  const requestWakeLock = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return false;
    try {
      if (!wakeLockSentinelRef.current) {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        wakeLockSentinelRef.current = sentinel;
        sentinel.addEventListener('release', () => {
          wakeLockSentinelRef.current = null;
          setSensorData(prev => ({ ...prev, wakeLockActive: false }));
        });
        setSensorData(prev => ({ ...prev, wakeLockActive: true }));
        return true;
      }
      return true;
    } catch (err) {
      console.warn('[ContextTheme] Screen Wake Lock request failed:', err);
      return false;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
        wakeLockSentinelRef.current = null;
        setSensorData(prev => ({ ...prev, wakeLockActive: false }));
      } catch (err) {
        console.warn('[ContextTheme] Screen Wake Lock release error:', err);
      }
    }
  }, []);

  const toggleWakeLock = useCallback(async (): Promise<boolean> => {
    if (wakeLockSentinelRef.current) {
      await releaseWakeLock();
      audioFeedback.playSubtleClick();
      return false;
    } else {
      const success = await requestWakeLock();
      if (success) audioFeedback.playSuccessChime();
      return success;
    }
  }, [requestWakeLock, releaseWakeLock]);

  // Apply theme class to HTML root DOM element
  const applyThemeToDocument = useCallback((theme: 'dark' | 'light', mode: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-dark', 'theme-light', 'theme-context-aware', 'theme-system');
    root.classList.add(theme);
    root.classList.add(`theme-${theme}`);

    if (mode === 'context_aware') {
      root.classList.add('theme-context-aware');
    } else if (mode === 'system') {
      root.classList.add('theme-system');
    }

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-preference', mode);
    setResolvedTheme(theme);
  }, []);

  // Update theme determination
  const evaluateTheme = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const { phase, recommendedTheme: solarTheme } = calculateSolarPhase(hour, minute);

    let nextResolved: 'dark' | 'light' = 'dark';

    if (themeMode === 'dark') {
      nextResolved = 'dark';
    } else if (themeMode === 'light') {
      nextResolved = 'light';
    } else if (themeMode === 'system') {
      const isOsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      nextResolved = isOsDark ? 'dark' : 'light';
    } else if (themeMode === 'context_aware') {
      // In context-aware mode:
      // Priority 1: Environmental Ambient Light Sensor if available and valid
      if (sensorData.lux !== null) {
        if (sensorData.lux > 120) {
          nextResolved = 'light';
        } else if (sensorData.lux < 40) {
          nextResolved = 'dark';
        } else {
          nextResolved = solarTheme;
        }
      } else {
        // Priority 2: Solar Circadian Clock
        nextResolved = solarTheme;
      }
    }

    setSensorData(prev => ({
      ...prev,
      solarPhase: phase,
      localSolarHour: hour
    }));

    applyThemeToDocument(nextResolved, themeMode);
  }, [themeMode, sensorData.lux, applyThemeToDocument]);

  // Setup Ambient Light Sensor if available
  useEffect(() => {
    let sensor: any = null;
    if (typeof window !== 'undefined' && 'AmbientLightSensor' in window) {
      try {
        sensor = new (window as any).AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          const lux = sensor.illuminance;
          let ambientMode: 'bright' | 'dim' | 'dark' | 'unknown' = 'dim';
          if (lux > 150) ambientMode = 'bright';
          else if (lux < 40) ambientMode = 'dark';

          setSensorData(prev => ({
            ...prev,
            lux: Math.round(lux),
            ambientMode,
            sensorSupported: true
          }));
        });
        sensor.start();
        setSensorData(prev => ({ ...prev, sensorSupported: true }));
      } catch (err) {
        console.info('[ContextTheme] AmbientLightSensor not permitted or unavailable:', err);
      }
    }

    return () => {
      if (sensor) {
        try {
          sensor.stop();
        } catch (_) {}
      }
    };
  }, []);

  // Screen Wake Lock on context_aware mode when active
  useEffect(() => {
    if (themeMode === 'context_aware') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [themeMode, requestWakeLock, releaseWakeLock]);

  // Handle visibilitychange to reacquire wake lock if needed
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && themeMode === 'context_aware') {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [themeMode, requestWakeLock]);

  // Periodic evaluation of circadian time
  useEffect(() => {
    evaluateTheme();
    const interval = setInterval(evaluateTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [evaluateTheme]);

  // Listen for external atlas-theme-changed events
  useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail?.theme && e.detail.theme !== themeMode) {
        setThemeModeState(e.detail.theme);
      }
    };
    window.addEventListener('atlas-theme-changed' as any, handleSync);
    return () => window.removeEventListener('atlas-theme-changed' as any, handleSync);
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('atlas_theme_mode', mode);
    window.dispatchEvent(new CustomEvent('atlas-theme-changed', { detail: { theme: mode } }));
  };

  const cycleThemeMode = () => {
    audioFeedback.playSubtleClick();
    let next: ThemeMode;
    if (themeMode === 'dark') next = 'light';
    else if (themeMode === 'light') next = 'system';
    else if (themeMode === 'system') next = 'context_aware';
    else next = 'dark';

    setThemeMode(next);
  };

  return (
    <ContextAwareThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        sensorData,
        setThemeMode,
        cycleThemeMode,
        toggleWakeLock
      }}
    >
      {children}
    </ContextAwareThemeContext.Provider>
  );
};

export const useContextAwareTheme = () => {
  const context = useContext(ContextAwareThemeContext);
  if (!context) {
    throw new Error('useContextAwareTheme must be used within a ContextAwareThemeProvider');
  }
  return context;
};
