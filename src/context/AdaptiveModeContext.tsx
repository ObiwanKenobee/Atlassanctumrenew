import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type CognitiveLoadLevel = 'low' | 'moderate' | 'high' | 'overloaded';
export type UIDensityMode = 'compact' | 'comfortable' | 'spacious';
export type HierarchyFocusMode = 'full_telemetry' | 'balanced' | 'primary_only';

export interface AdaptiveModeState {
  adaptiveModeEnabled: boolean;
  toggleAdaptiveMode: (enabled?: boolean) => Promise<void>;
  cognitiveLoadLevel: CognitiveLoadLevel;
  cognitiveScore: number;
  uiDensity: UIDensityMode;
  hierarchyFocus: HierarchyFocusMode;
  recommendedAdjustments: string[];
  rationale: string;
  isAnalyzing: boolean;
  lastAssessedAt: string | null;
  assessCognitiveLoad: (signalsOverride?: Record<string, any>) => Promise<void>;
  overrideDensity: (density: UIDensityMode) => void;
  overrideHierarchy: (hierarchy: HierarchyFocusMode) => void;
}

const AdaptiveModeContext = createContext<AdaptiveModeState>({
  adaptiveModeEnabled: false,
  toggleAdaptiveMode: async () => {},
  cognitiveLoadLevel: 'low',
  cognitiveScore: 25,
  uiDensity: 'comfortable',
  hierarchyFocus: 'balanced',
  recommendedAdjustments: [],
  rationale: 'Standard UI configuration active.',
  isAnalyzing: false,
  lastAssessedAt: null,
  assessCognitiveLoad: async () => {},
  overrideDensity: () => {},
  overrideHierarchy: () => {},
});

export const useAdaptiveMode = () => useContext(AdaptiveModeContext);

export const AdaptiveModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, updatePlatformSettings } = useAuth();
  
  const [adaptiveModeEnabled, setAdaptiveModeEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('atlas_adaptive_mode');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [cognitiveLoadLevel, setCognitiveLoadLevel] = useState<CognitiveLoadLevel>('low');
  const [cognitiveScore, setCognitiveScore] = useState<number>(28);
  const [uiDensity, setUiDensity] = useState<UIDensityMode>('comfortable');
  const [hierarchyFocus, setHierarchyFocus] = useState<HierarchyFocusMode>('balanced');
  const [recommendedAdjustments, setRecommendedAdjustments] = useState<string[]>([
    'Display high-density multi-metric analytics and deep provenance',
    'Enable compact information packing for high-throughput exploration'
  ]);
  const [rationale, setRationale] = useState<string>('Standard baseline ergonomics.');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAssessedAt, setLastAssessedAt] = useState<string | null>(null);

  // Behavioral telemetry trackers
  const viewSwitchTimestamps = useRef<number[]>([]);
  const interactionCountRef = useRef<number>(0);
  const sessionStartTime = useRef<number>(Date.now());

  // Listen to view changes to track task-switching rate
  useEffect(() => {
    const handleNavEvent = () => {
      const now = Date.now();
      viewSwitchTimestamps.current.push(now);
      // Prune switches older than 60s
      viewSwitchTimestamps.current = viewSwitchTimestamps.current.filter((t) => now - t <= 60000);
    };

    window.addEventListener('atlas-navigate-tab' as any, handleNavEvent);
    return () => window.removeEventListener('atlas-navigate-tab' as any, handleNavEvent);
  }, []);

  // Track interaction clicks / keypresses
  useEffect(() => {
    const handleInteraction = () => {
      interactionCountRef.current++;
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    // Decay interaction count every minute
    const decayInterval = setInterval(() => {
      interactionCountRef.current = Math.floor(interactionCountRef.current * 0.4);
    }, 60000);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      clearInterval(decayInterval);
    };
  }, []);

  // Update HTML data attributes & body classes for UI density
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-ui-density', uiDensity);
    document.documentElement.setAttribute('data-hierarchy-focus', hierarchyFocus);
    
    // Apply helper classes for styling
    document.body.classList.remove('ui-compact', 'ui-comfortable', 'ui-spacious');
    document.body.classList.add(`ui-${uiDensity}`);
  }, [uiDensity, hierarchyFocus]);

  // Sync with Firestore profile if user is logged in
  useEffect(() => {
    if ((userProfile as any)?.adaptiveModeActive !== undefined) {
      setAdaptiveModeEnabled(Boolean((userProfile as any).adaptiveModeActive));
    }
  }, [(userProfile as any)?.adaptiveModeActive]);

  const assessCognitiveLoad = useCallback(async (signalsOverride?: Record<string, any>) => {
    setIsAnalyzing(true);
    try {
      const now = Date.now();
      const recentSwitches = viewSwitchTimestamps.current.filter((t) => now - t <= 60000).length;
      const sessionDurationSec = Math.floor((now - sessionStartTime.current) / 1000);
      const interactionVelocity = Math.max(5, interactionCountRef.current);

      const signals = {
        viewSwitchCount: recentSwitches,
        activeView: (window as any).__atlas_current_view || 'home',
        sessionDurationSec,
        activeAlertsCount: (window as any).__atlas_active_alerts_count || 1,
        interactionVelocity,
        ...signalsOverride,
      };

      const response = await fetch('/api/gemini/adaptive-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signals }),
      });

      if (!response.ok) {
        throw new Error(`Adaptive UI endpoint returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.assessment) {
        const {
          cognitiveScore: score,
          cognitiveLoadLevel: level,
          uiDensity: recDensity,
          hierarchyFocus: recHierarchy,
          recommendedAdjustments: recAdjustments,
          rationale: recRationale,
        } = data.assessment;

        setCognitiveScore(score ?? 40);
        setCognitiveLoadLevel(level ?? 'moderate');
        setUiDensity(recDensity ?? 'comfortable');
        setHierarchyFocus(recHierarchy ?? 'balanced');
        setRecommendedAdjustments(recAdjustments || []);
        setRationale(recRationale || 'Dynamic density calibrated.');
        setLastAssessedAt(new Date().toLocaleTimeString());

        // Emit global event for components wanting to adapt
        window.dispatchEvent(
          new CustomEvent('atlas-adaptive-mode-change', {
            detail: {
              cognitiveLoadLevel: level,
              uiDensity: recDensity,
              hierarchyFocus: recHierarchy,
            },
          })
        );
      }
    } catch (err) {
      console.warn('Failed to assess cognitive load via Gemini:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const toggleAdaptiveMode = async (enabled?: boolean) => {
    const nextVal = enabled !== undefined ? enabled : !adaptiveModeEnabled;
    setAdaptiveModeEnabled(nextVal);
    try {
      localStorage.setItem('atlas_adaptive_mode', String(nextVal));
      if (updatePlatformSettings) {
        await updatePlatformSettings({ adaptiveModeActive: nextVal } as any);
      }
    } catch (e) {
      console.error(e);
    }

    if (nextVal) {
      await assessCognitiveLoad();
    } else {
      // Revert to comfortable default
      setUiDensity('comfortable');
      setHierarchyFocus('balanced');
      setCognitiveLoadLevel('low');
      setCognitiveScore(25);
    }
  };

  const overrideDensity = (density: UIDensityMode) => {
    setUiDensity(density);
  };

  const overrideHierarchy = (hierarchy: HierarchyFocusMode) => {
    setHierarchyFocus(hierarchy);
  };

  // Periodic assessment if adaptive mode is active (every 3 minutes)
  useEffect(() => {
    if (!adaptiveModeEnabled) return;
    const interval = setInterval(() => {
      assessCognitiveLoad();
    }, 180000);

    return () => clearInterval(interval);
  }, [adaptiveModeEnabled, assessCognitiveLoad]);

  return (
    <AdaptiveModeContext.Provider
      value={{
        adaptiveModeEnabled,
        toggleAdaptiveMode,
        cognitiveLoadLevel,
        cognitiveScore,
        uiDensity,
        hierarchyFocus,
        recommendedAdjustments,
        rationale,
        isAnalyzing,
        lastAssessedAt,
        assessCognitiveLoad,
        overrideDensity,
        overrideHierarchy,
      }}
    >
      {children}
    </AdaptiveModeContext.Provider>
  );
};
