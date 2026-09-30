import React, { createContext, useContext, useEffect, useRef } from 'react';

export type ContainerThreshold = 
  | 'compact'    // < 640px (Small phones)
  | 'phablet'    // 640px - 767px (Large phones)
  | 'tablet'     // 768px - 1023px (Tablets)
  | 'desktop'    // 1024px - 1279px (Laptops & Small Desktop)
  | 'wide'       // 1280px - 1535px (Standard Desktop)
  | 'ultrawide';  // >= 1536px (Large Displays & 4K)

export interface ContainerThresholdBreakpoints {
  compact: number;
  phablet: number;
  tablet: number;
  desktop: number;
  wide: number;
  ultrawide: number;
}

export const CONTAINER_THRESHOLDS: ContainerThresholdBreakpoints = {
  compact: 0,
  phablet: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1536
};

export function resolveContainerThreshold(width: number): ContainerThreshold {
  if (width < 640) return 'compact';
  if (width < 768) return 'phablet';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'desktop';
  if (width < 1536) return 'wide';
  return 'ultrawide';
}

export interface ContainerResizeEvent {
  width: number;
  height: number;
  threshold: ContainerThreshold;
  timestamp: number;
  durationMs: number;
}

export interface ContainerDimensionsState {
  width: number;
  height: number;
  threshold: ContainerThreshold;
  prevThreshold: ContainerThreshold | null;
  transitionCount: number;
  lastCrossoverTimestamp: number;
  resizeHistory: ContainerResizeEvent[];
  estimatedCardsColumns: number;
  estimatedBentoColumns: number;
  isCompact: boolean;
  isPhablet: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isUltraWide: boolean;
  isAtLeast: (target: ContainerThreshold | number) => boolean;
}

export interface ContainerDimensionsContextValue extends ContainerDimensionsState {
  containerRef: React.RefObject<HTMLDivElement | null>;
  refreshDimensions: () => void;
}

const defaultState: ContainerDimensionsContextValue = {
  width: 1280,
  height: 800,
  threshold: 'wide',
  prevThreshold: null,
  transitionCount: 0,
  lastCrossoverTimestamp: Date.now(),
  resizeHistory: [],
  estimatedCardsColumns: 3,
  estimatedBentoColumns: 3,
  isCompact: false,
  isPhablet: false,
  isTablet: false,
  isDesktop: false,
  isWide: true,
  isUltraWide: false,
  isAtLeast: () => true,
  containerRef: { current: null },
  refreshDimensions: () => {}
};

export const ContainerDimensionsContext = createContext<ContainerDimensionsContextValue>(defaultState);

import { useContainerDimensions, type UseContainerDimensionsOptions, type UseContainerDimensionsReturn } from '../hooks/useContainerDimensions';
export { useContainerDimensions };
export type { UseContainerDimensionsOptions, UseContainerDimensionsReturn };

/**
 * Hook to access just the current container width for fast re-renders.
 */
export function useContainerWidth(): number {
  const { width } = useContext(ContainerDimensionsContext);
  return width;
}

/**
 * Hook that executes a callback specifically when the container size crosses a key threshold boundary.
 * Ideal for expensive re-computations in D3 charts, canvas geometry, or Voronoi diagrams.
 */
export function useOnContainerThresholdChange(
  callback: (newThreshold: ContainerThreshold, prevThreshold: ContainerThreshold | null, width: number) => void
) {
  const { threshold, prevThreshold, width, transitionCount } = useContainerDimensions();
  const prevCountRef = useRef(transitionCount);

  useEffect(() => {
    if (transitionCount !== prevCountRef.current && transitionCount > 0) {
      prevCountRef.current = transitionCount;
      callback(threshold, prevThreshold, width);
    }
  }, [transitionCount, threshold, prevThreshold, width, callback]);
}
