import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ContainerDimensionsContext,
  ContainerDimensionsContextValue,
  ContainerThreshold,
  resolveContainerThreshold,
  CONTAINER_THRESHOLDS
} from '../../context/ContainerDimensionsContext';

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

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    threshold: ContainerThreshold;
    prevThreshold: ContainerThreshold | null;
    transitionCount: number;
    lastCrossoverTimestamp: number;
  }>(() => {
    const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      width: initialWidth,
      height: initialHeight,
      threshold: resolveContainerThreshold(initialWidth),
      prevThreshold: null,
      transitionCount: 0,
      lastCrossoverTimestamp: Date.now()
    };
  });

  const lastWidthRef = useRef<number>(dimensions.width);
  const lastThresholdRef = useRef<ContainerThreshold>(dimensions.threshold);
  const rafIdRef = useRef<number | null>(null);

  // Measure and update dimensions with requestAnimationFrame debouncing
  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (width <= 0) return;

    const newThreshold = resolveContainerThreshold(width);
    const prevThreshold = lastThresholdRef.current;
    const hasThresholdShift = newThreshold !== prevThreshold;

    lastWidthRef.current = width;

    if (hasThresholdShift) {
      lastThresholdRef.current = newThreshold;
      const now = Date.now();

      // Dispatch global custom event for decoupled visualization subscribers
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('container-threshold-crossed', {
            detail: {
              width,
              height,
              currentThreshold: newThreshold,
              prevThreshold,
              timestamp: now
            }
          })
        );
      }

      if (onThresholdCrossed) {
        onThresholdCrossed(newThreshold, prevThreshold, width);
      }

      setDimensions(prev => ({
        width,
        height,
        threshold: newThreshold,
        prevThreshold,
        transitionCount: prev.transitionCount + 1,
        lastCrossoverTimestamp: now
      }));
    } else {
      // Dimension changed without crossing threshold bucket
      setDimensions(prev => {
        if (Math.abs(prev.width - width) < 2 && Math.abs(prev.height - height) < 2) {
          return prev;
        }
        return {
          ...prev,
          width,
          height
        };
      });
    }
  }, [onThresholdCrossed]);

  const scheduleMeasure = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      measure();
      rafIdRef.current = null;
    });
  }, [measure]);

  // Attach ResizeObserver API
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial measurement
    scheduleMeasure();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            scheduleMeasure();
          }
        }
      });
      resizeObserver.observe(el);
    } else {
      // Fallback for environments lacking ResizeObserver
      window.addEventListener('resize', scheduleMeasure, { passive: true });
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', scheduleMeasure);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [scheduleMeasure]);

  const isAtLeast = useCallback((target: ContainerThreshold | number): boolean => {
    const targetWidth = typeof target === 'number' 
      ? target 
      : CONTAINER_THRESHOLDS[target] ?? 0;
    return dimensions.width >= targetWidth;
  }, [dimensions.width]);

  // Calculate estimated columns for cards and bento grids based on current pixel width
  const estimatedCardsColumns = useMemo(() => {
    if (dimensions.width < 640) return 1;
    if (dimensions.width < 1024) return 2;
    if (dimensions.width < 1280) return 3;
    return 4;
  }, [dimensions.width]);

  const estimatedBentoColumns = useMemo(() => {
    if (dimensions.width < 768) return 1;
    if (dimensions.width < 1024) return 2;
    if (dimensions.width < 1280) return 3;
    return 4;
  }, [dimensions.width]);

  const contextValue: ContainerDimensionsContextValue = useMemo(() => ({
    width: dimensions.width,
    height: dimensions.height,
    threshold: dimensions.threshold,
    prevThreshold: dimensions.prevThreshold,
    transitionCount: dimensions.transitionCount,
    lastCrossoverTimestamp: dimensions.lastCrossoverTimestamp,
    estimatedCardsColumns,
    estimatedBentoColumns,
    isCompact: dimensions.threshold === 'compact',
    isPhablet: dimensions.threshold === 'phablet',
    isTablet: dimensions.threshold === 'tablet',
    isDesktop: dimensions.threshold === 'desktop',
    isWide: dimensions.threshold === 'wide',
    isUltraWide: dimensions.threshold === 'ultrawide',
    isAtLeast,
    containerRef,
    refreshDimensions: scheduleMeasure
  }), [
    dimensions,
    estimatedCardsColumns,
    estimatedBentoColumns,
    isAtLeast,
    scheduleMeasure
  ]);

  return (
    <ContainerDimensionsContext.Provider value={contextValue}>
      <Component
        ref={containerRef as any}
        id={id}
        className={className}
        data-container-threshold={dimensions.threshold}
        data-container-width={dimensions.width}
      >
        {children}
      </Component>
    </ContainerDimensionsContext.Provider>
  );
};
