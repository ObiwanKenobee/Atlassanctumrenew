import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export type ThemeMode = 'dark' | 'light' | 'high-contrast';

export const ThemeAndAccessSyncListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const prevThemeRef = useRef<string | undefined>(undefined);

  const applyThemeToDOM = (theme: string, highContrastFlag = false, reducedMotionFlag = false) => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('theme-dark', 'theme-light', 'theme-solarized', 'theme-biophilic_night', 'theme-high_contrast', 'high-contrast');

    // Normalize theme value
    const normalizedTheme = theme === 'high-contrast' || theme === 'high_contrast' ? 'high_contrast' : theme;
    
    root.classList.add(`theme-${normalizedTheme}`);

    if (normalizedTheme === 'high_contrast' || highContrastFlag) {
      root.classList.add('high-contrast');
    }

    if (reducedMotionFlag) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    root.setAttribute('data-theme', normalizedTheme);
  };

  // Initial load from localStorage or userProfile
  useEffect(() => {
    const savedLocalTheme = (localStorage.getItem('atlas_theme_mode') as ThemeMode) || userProfile?.themePreference || 'dark';
    applyThemeToDOM(savedLocalTheme, savedLocalTheme === 'high-contrast' || !!userProfile?.highContrast, !!userProfile?.reducedMotion);
    prevThemeRef.current = savedLocalTheme;

    // Listen for custom theme change events (e.g. from Navigation toggle button)
    const handleThemeChange = (e: CustomEvent<{ theme: ThemeMode }>) => {
      const newTheme = e.detail?.theme;
      if (!newTheme) return;

      const root = document.documentElement;
      root.classList.add('theme-transitioning');

      if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
        (document as any).startViewTransition(() => {
          applyThemeToDOM(newTheme, newTheme === 'high-contrast', !!userProfile?.reducedMotion);
        });
      } else {
        applyThemeToDOM(newTheme, newTheme === 'high-contrast', !!userProfile?.reducedMotion);
      }

      const timer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 400);

      prevThemeRef.current = newTheme;
    };

    window.addEventListener('atlas-theme-changed' as any, handleThemeChange);
    return () => window.removeEventListener('atlas-theme-changed' as any, handleThemeChange);
  }, []);

  // Sync when userProfile updates (if user logs in)
  useEffect(() => {
    if (!userProfile) return;

    // If localStorage theme is not set yet, use userProfile
    const currentLocal = localStorage.getItem('atlas_theme_mode');
    const effectiveTheme = currentLocal || userProfile.themePreference || 'dark';

    if (prevThemeRef.current !== effectiveTheme) {
      applyThemeToDOM(effectiveTheme, effectiveTheme === 'high-contrast' || !!userProfile.highContrast, !!userProfile.reducedMotion);
      prevThemeRef.current = effectiveTheme;
    }
  }, [userProfile]);

  return <>{children}</>;
};

