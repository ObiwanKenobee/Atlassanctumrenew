import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const ThemeAndAccessSyncListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const prevThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!userProfile) return;

    const root = document.documentElement;
    const currentTheme = userProfile.themePreference || 'dark';

    // Trigger smooth cross-fading transition if theme changed
    if (prevThemeRef.current !== undefined && prevThemeRef.current !== currentTheme) {
      root.classList.add('theme-transitioning');
      
      // Inject temporary cross-fade style if View Transitions API is available
      if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
        (document as any).startViewTransition(() => {
          applyTheme(root, userProfile);
        });
      } else {
        applyTheme(root, userProfile);
      }

      const timer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 500);

      prevThemeRef.current = currentTheme;
      return () => clearTimeout(timer);
    } else {
      applyTheme(root, userProfile);
      prevThemeRef.current = currentTheme;
    }
  }, [userProfile]);

  function applyTheme(root: HTMLElement, profile: any) {
    // Remove existing themes
    root.classList.remove('theme-dark', 'theme-light', 'theme-solarized', 'theme-biophilic_night', 'theme-high_contrast');
    
    const theme = profile.themePreference || 'dark';
    root.classList.add(`theme-${theme}`);

    // High-contrast or accessibility settings
    if (theme === 'high_contrast' || profile.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion preference
    if (profile.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Set data attribute for global styling
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-access-level', profile.accessLevel || 'researcher');
  }

  return <>{children}</>;
};
