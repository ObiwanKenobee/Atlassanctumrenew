import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export type ThemePreference = 'dark' | 'light' | 'system' | 'context_aware';

export const ThemeAndAccessSyncListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const currentPreferenceRef = useRef<ThemePreference>('dark');
  const wakeLockRef = useRef<any>(null);

  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const getCircadianTheme = (): 'dark' | 'light' => {
    const hour = new Date().getHours();
    // 06:30 - 18:30 is light, otherwise dark
    return (hour >= 6 && hour < 19) ? 'light' : 'dark';
  };

  const manageWakeLock = async (enable: boolean) => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    try {
      if (enable && !wakeLockRef.current) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      } else if (!enable && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch (err) {
      console.info('[ThemeAndAccessSyncListener] Screen Wake Lock not available:', err);
    }
  };

  const applyThemeToDOM = (preference: ThemePreference, highContrastFlag = false, reducedMotionFlag = false) => {
    const root = document.documentElement;
    currentPreferenceRef.current = preference;

    // Resolve actual theme
    let resolvedTheme: 'dark' | 'light' = 'dark';
    if (preference === 'system') {
      resolvedTheme = getSystemTheme();
    } else if (preference === 'context_aware') {
      resolvedTheme = getCircadianTheme();
      manageWakeLock(true);
    } else {
      resolvedTheme = preference;
      manageWakeLock(false);
    }

    // Clean up prior classes
    root.classList.remove('dark', 'light', 'theme-dark', 'theme-light', 'theme-system', 'theme-context-aware', 'high-contrast');

    // Add CSS class corresponding to resolved theme and preference on document root
    root.classList.add(resolvedTheme);
    root.classList.add(`theme-${resolvedTheme}`);

    if (preference === 'system') {
      root.classList.add('theme-system');
    } else if (preference === 'context_aware') {
      root.classList.add('theme-context-aware');
    }

    if (highContrastFlag) {
      root.classList.add('high-contrast');
    }

    if (reducedMotionFlag) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-theme-preference', preference);
  };

  // Initial load from localStorage or userProfile
  useEffect(() => {
    const savedLocalPref = (localStorage.getItem('atlas_theme_mode') as ThemePreference) || 
      (userProfile?.themePreference as ThemePreference) || 
      'dark';

    const validPref: ThemePreference = (savedLocalPref === 'dark' || savedLocalPref === 'light' || savedLocalPref === 'system' || savedLocalPref === 'context_aware')
      ? savedLocalPref
      : 'dark';

    applyThemeToDOM(validPref, !!userProfile?.highContrast, !!userProfile?.reducedMotion);

    // Media query listener for OS-level changes when in 'system' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (currentPreferenceRef.current === 'system') {
        const root = document.documentElement;
        root.classList.add('theme-transitioning');
        applyThemeToDOM('system', !!userProfile?.highContrast, !!userProfile?.reducedMotion);
        setTimeout(() => root.classList.remove('theme-transitioning'), 400);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    // Circadian check interval for context_aware mode
    const circadianInterval = setInterval(() => {
      if (currentPreferenceRef.current === 'context_aware') {
        applyThemeToDOM('context_aware', !!userProfile?.highContrast, !!userProfile?.reducedMotion);
      }
    }, 60000);

    // Listen for custom theme change events from Navigation toggle button
    const handleThemeChange = (e: CustomEvent<{ theme: ThemePreference }>) => {
      const newPref = e.detail?.theme;
      if (!newPref) return;

      const root = document.documentElement;
      root.classList.add('theme-transitioning');

      if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
        (document as any).startViewTransition(() => {
          applyThemeToDOM(newPref, !!userProfile?.highContrast, !!userProfile?.reducedMotion);
        });
      } else {
        applyThemeToDOM(newPref, !!userProfile?.highContrast, !!userProfile?.reducedMotion);
      }

      const timer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 400);
    };

    window.addEventListener('atlas-theme-changed' as any, handleThemeChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
      clearInterval(circadianInterval);
      window.removeEventListener('atlas-theme-changed' as any, handleThemeChange);
      manageWakeLock(false);
    };
  }, [userProfile]);

  return <>{children}</>;
};
