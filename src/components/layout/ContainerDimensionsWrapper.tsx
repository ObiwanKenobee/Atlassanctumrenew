import React, { useRef, useEffect } from 'react';
import {
  ContainerDimensionsContext,
  ContainerThreshold,
} from '../../context/ContainerDimensionsContext';
import { useContainerDimensions } from '../../hooks/useContainerDimensions';

interface ContainerDimensionsWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'main' | 'div' | 'section' | 'article';
  onThresholdCrossed?: (current: ContainerThreshold, prev: ContainerThreshold | null, width: number) => void;
}

export const ContainerDimensionsWrapper: React.FC<ContainerDimensionsWrapperProps> = ({
  children,
  className = 'flex-1 w-full relative',
  id = 'main-container-dimensions-wrapper',
  as: Component = 'div',
  onThresholdCrossed
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Utilize the reusable useContainerDimensions hook to observe this container
  const dimensionsData = useContainerDimensions(containerRef, { onThresholdCrossed });

  // Global event listener for 'keydown' that toggles 'debug-mode' class on HTML tag when user presses 'Alt+D'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'd' || e.key === 'D')) || (e.altKey && e.code === 'KeyD')) {
        if ((e as any).__altDDebugHandled) return;
        (e as any).__altDDebugHandled = true;
        e.preventDefault();

        if (typeof document !== 'undefined') {
          const isDebug = document.documentElement.classList.toggle('debug-mode');
          if (isDebug) {
            document.documentElement.classList.add('debug-grid-overlay-active');
            try { localStorage.setItem('atlas_grid_debug_overlay', 'true'); } catch {}
          } else {
            document.documentElement.classList.remove('debug-grid-overlay-active');
            try { localStorage.setItem('atlas_grid_debug_overlay', 'false'); } catch {}
          }
          console.log(`[Global Keydown] 'Alt+D' pressed: toggled 'debug-mode' class on <html> tag to ${isDebug ? 'ENABLED' : 'DISABLED'}`);
          window.dispatchEvent(new CustomEvent('debug-mode-toggled', { detail: { active: isDebug } }));
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <ContainerDimensionsContext.Provider value={dimensionsData}>
      <Component
        ref={containerRef as any}
        id={id}
        className={className}
        data-container-threshold={dimensionsData.threshold}
        data-container-width={dimensionsData.width}
      >
        {children}
      </Component>
    </ContainerDimensionsContext.Provider>
  );
};
