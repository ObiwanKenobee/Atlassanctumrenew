import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveViewportState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
};

export function useResponsiveViewport(): ResponsiveViewportState {
  const [state, setState] = useState<ResponsiveViewportState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1280,
        height: 800,
        breakpoint: 'xl',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        isLandscape: true,
        isPortrait: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const bp = getBreakpoint(width);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return {
      width,
      height,
      breakpoint: bp,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isTouch,
      isLandscape: width > height,
      isPortrait: height >= width,
    };
  });

  useEffect(() => {
    let timeoutId: any = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const bp = getBreakpoint(width);
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        setState({
          width,
          height,
          breakpoint: bp,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
          isTouch,
          isLandscape: width > height,
          isPortrait: height >= width,
        });
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}
