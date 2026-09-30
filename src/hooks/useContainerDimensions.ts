import { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import {
  ContainerDimensionsContext,
  ContainerDimensionsContextValue,
  ContainerThreshold,
  ContainerResizeEvent,
  resolveContainerThreshold,
  CONTAINER_THRESHOLDS
} from '../context/ContainerDimensionsContext';
import { performanceTracker } from '../lib/performanceTracker';

export interface UseContainerDimensionsOptions {
  /**
   * If true, measures the element's parentNode/parentElement instead of the element itself.
   * Useful when a component attaches its ref to a child element to subscribe to its parent's width and height updates.
   */
  observeParent?: boolean;
  /**
   * Callback fired when width crosses a responsive threshold boundary (compact, phablet, tablet, desktop, wide, ultrawide).
   */
  onThresholdCrossed?: (current: ContainerThreshold, prev: ContainerThreshold | null, width: number) => void;
  /**
   * Optional callback fired on every measured dimension update.
   */
  onResize?: (width: number, height: number) => void;
  /**
   * Initial fallback width if measuring before first layout mount.
   */
  initialWidth?: number;
  /**
   * Initial fallback height if measuring before first layout mount.
   */
  initialHeight?: number;
  /**
   * If true, bypasses ancestor ContainerDimensionsContext and instantiates a standalone ResizeObserver.
   */
  standalone?: boolean;
}

export interface UseContainerDimensionsReturn<T extends HTMLElement = HTMLDivElement>
  extends ContainerDimensionsContextValue {
  /**
   * Ref to attach to the target container or child element (when observeParent: true).
   */
  ref: React.RefObject<T | null>;
}

/**
 * Reusable custom hook that wraps the ResizeObserver API.
 * Allows any component to subscribe to its own or its parent's width and height updates.
 *
 * Usage Examples:
 * 1. Default context subscription:
 *    const { width, height, threshold } = useContainerDimensions();
 *
 * 2. Attach ref to measure any container:
 *    const { ref, width, height } = useContainerDimensions();
 *    return <div ref={ref}>...</div>;
 *
 * 3. Subscribe to parent element dimensions:
 *    const { ref, width, height } = useContainerDimensions({ observeParent: true });
 *    return <div ref={ref}>I measure my parent!</div>;
 *
 * 4. Pass an existing ref:
 *    const dimensions = useContainerDimensions(myExistingRef, { onThresholdCrossed });
 */
export function useContainerDimensions<T extends HTMLElement = HTMLDivElement>(
  targetRefOrOptions?: React.RefObject<T | null> | UseContainerDimensionsOptions,
  maybeOptions?: UseContainerDimensionsOptions
): UseContainerDimensionsReturn<T> {
  const isRefPassed = Boolean(targetRefOrOptions && 'current' in targetRefOrOptions);
  const targetRef = isRefPassed ? (targetRefOrOptions as React.RefObject<T | null>) : undefined;
  const options: UseContainerDimensionsOptions = 
    (isRefPassed ? maybeOptions : (targetRefOrOptions as UseContainerDimensionsOptions)) || {};

  const contextValue = useContext(ContainerDimensionsContext);
  const internalRef = useRef<T | null>(null);
  const activeRef = targetRef || internalRef;

  // Determine if we should consume the ancestor context or create an active ResizeObserver.
  // We use context only when no ref is provided, standalone is not requested, and a valid context exists.
  const isContextAvailable = Boolean(
    !targetRef && 
    !options.standalone && 
    !options.observeParent && 
    contextValue && 
    contextValue.width !== undefined &&
    contextValue.containerRef?.current !== null
  );

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    threshold: ContainerThreshold;
    prevThreshold: ContainerThreshold | null;
    transitionCount: number;
    lastCrossoverTimestamp: number;
    resizeHistory: ContainerResizeEvent[];
  }>(() => {
    if (isContextAvailable && contextValue) {
      return {
        width: contextValue.width,
        height: contextValue.height,
        threshold: contextValue.threshold,
        prevThreshold: contextValue.prevThreshold,
        transitionCount: contextValue.transitionCount,
        lastCrossoverTimestamp: contextValue.lastCrossoverTimestamp,
        resizeHistory: contextValue.resizeHistory || []
      };
    }
    const initW = options.initialWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1280);
    const initH = options.initialHeight ?? (typeof window !== 'undefined' ? window.innerHeight : 800);
    const initThreshold = resolveContainerThreshold(initW);
    return {
      width: initW,
      height: initH,
      threshold: initThreshold,
      prevThreshold: null,
      transitionCount: 0,
      lastCrossoverTimestamp: Date.now(),
      resizeHistory: [{
        width: initW,
        height: initH,
        threshold: initThreshold,
        timestamp: Date.now(),
        durationMs: 0.1
      }]
    };
  });

  const lastWidthRef = useRef<number>(dimensions.width);
  const lastThresholdRef = useRef<ContainerThreshold>(dimensions.threshold);
  const rafIdRef = useRef<number | null>(null);
  const resizeHistoryRef = useRef<ContainerResizeEvent[]>(dimensions.resizeHistory);

  useEffect(() => {
    if (dimensions.resizeHistory) {
      resizeHistoryRef.current = dimensions.resizeHistory;
    }
  }, [dimensions.resizeHistory]);

  // Measure and update dimensions with requestAnimationFrame debouncing
  const measure = useCallback(() => {
    let targetEl: HTMLElement | null = activeRef.current;
    if (options.observeParent && targetEl?.parentElement) {
      targetEl = targetEl.parentElement;
    }
    if (!targetEl) return;

    const tStart = performance.now();
    const rect = targetEl.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (width <= 0) return;

    const newThreshold = resolveContainerThreshold(width);
    const prevThreshold = lastThresholdRef.current;
    const hasThresholdShift = newThreshold !== prevThreshold;

    lastWidthRef.current = width;

    if (options.onResize) {
      options.onResize(width, height);
    }

    // Report metric to performance tracker to identify layout bottlenecks during resizing
    const resizeDurationMs = Math.max(0.1, performance.now() - tStart);
    const resizeEvent: ContainerResizeEvent = {
      width,
      height,
      threshold: newThreshold,
      timestamp: Date.now(),
      durationMs: resizeDurationMs
    };

    const updatedHistory = [...resizeHistoryRef.current.slice(-9), resizeEvent];
    resizeHistoryRef.current = updatedHistory;

    const now = Date.now();

    if (hasThresholdShift) {
      lastThresholdRef.current = newThreshold;

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

      if (options.onThresholdCrossed) {
        options.onThresholdCrossed(newThreshold, prevThreshold, width);
      }

      setDimensions(prev => ({
        width,
        height,
        threshold: newThreshold,
        prevThreshold,
        transitionCount: prev.transitionCount + 1,
        lastCrossoverTimestamp: now,
        resizeHistory: updatedHistory
      }));
    } else {
      setDimensions(prev => {
        if (Math.abs(prev.width - width) < 2 && Math.abs(prev.height - height) < 2) {
          return prev;
        }
        return {
          ...prev,
          width,
          height,
          resizeHistory: updatedHistory
        };
      });
    }

    // Safely record metrics outside of setState updater to prevent cross-component render collisions
    performanceTracker.recordContainerResize(
      'Main Content Container',
      width,
      height,
      newThreshold,
      resizeDurationMs,
      updatedHistory
    );
  }, [activeRef, options]);

  const scheduleMeasure = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      measure();
      rafIdRef.current = null;
    });
  }, [measure]);

  // Attach ResizeObserver API to target element or its parent
  useEffect(() => {
    if (isContextAvailable) return;

    let targetEl: HTMLElement | null = activeRef.current;
    if (options.observeParent && targetEl?.parentElement) {
      targetEl = targetEl.parentElement;
    }
    if (!targetEl) return;

    // Initial measurement
    scheduleMeasure();

    let resizeObserver: ResizeObserver | null = null;
    let lastObservedWidth = -1;
    let lastObservedHeight = -1;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            const width = Math.round(entry.contentRect.width);
            const height = Math.round(entry.contentRect.height);
            if (width !== lastObservedWidth || height !== lastObservedHeight) {
              lastObservedWidth = width;
              lastObservedHeight = height;
              console.log(`[ContainerDimensionsWrapper] ResizeObserver updated - width: ${width}px, height: ${height}px`, { width, height });
              console.log(`[ResizeObserver] Container dimensions updated: width=${width}px, height=${height}px`);
            }
            scheduleMeasure();
          }
        }
      });
      resizeObserver.observe(targetEl);
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
  }, [isContextAvailable, activeRef, options.observeParent, scheduleMeasure]);

  // Periodically report container width metrics to performance tracker (every 2.5s) to identify layout bottlenecks
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reportMetrics = () => {
      let targetEl: HTMLElement | null = activeRef.current;
      if (options.observeParent && targetEl?.parentElement) {
        targetEl = targetEl.parentElement;
      }
      if (!targetEl) return;

      const t0 = performance.now();
      const rect = targetEl.getBoundingClientRect();
      const measureDuration = Math.max(0.1, performance.now() - t0);
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      if (width > 0) {
        const threshold = resolveContainerThreshold(width);
        performanceTracker.recordContainerResize(
          'Main Content Container',
          width,
          height,
          threshold,
          measureDuration,
          resizeHistoryRef.current
        );
      }
    };

    // Report immediately once mounted, then periodically every 2500ms
    const timerId = setTimeout(reportMetrics, 500);
    const intervalId = setInterval(reportMetrics, 2500);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [activeRef, options.observeParent]);

  const currentWidth = isContextAvailable && contextValue ? contextValue.width : dimensions.width;
  const currentHeight = isContextAvailable && contextValue ? contextValue.height : dimensions.height;
  const currentThreshold = isContextAvailable && contextValue ? contextValue.threshold : dimensions.threshold;
  const currentPrevThreshold = isContextAvailable && contextValue ? contextValue.prevThreshold : dimensions.prevThreshold;
  const currentTransitionCount = isContextAvailable && contextValue ? contextValue.transitionCount : dimensions.transitionCount;
  const currentLastCrossoverTimestamp = isContextAvailable && contextValue ? contextValue.lastCrossoverTimestamp : dimensions.lastCrossoverTimestamp;
  const currentResizeHistory = isContextAvailable && contextValue ? contextValue.resizeHistory : dimensions.resizeHistory;

  const isAtLeast = useCallback((target: ContainerThreshold | number): boolean => {
    const targetWidth = typeof target === 'number' 
      ? target 
      : CONTAINER_THRESHOLDS[target] ?? 0;
    return currentWidth >= targetWidth;
  }, [currentWidth]);

  // Calculate estimated columns for cards and bento grids based on current pixel width
  const estimatedCardsColumns = useMemo(() => {
    if (currentWidth < 640) return 1;
    if (currentWidth < 1024) return 2;
    if (currentWidth < 1280) return 3;
    return 4;
  }, [currentWidth]);

  const estimatedBentoColumns = useMemo(() => {
    if (currentWidth < 768) return 1;
    if (currentWidth < 1024) return 2;
    if (currentWidth < 1280) return 3;
    return 4;
  }, [currentWidth]);

  return useMemo(() => ({
    width: currentWidth,
    height: currentHeight,
    threshold: currentThreshold,
    prevThreshold: currentPrevThreshold,
    transitionCount: currentTransitionCount,
    lastCrossoverTimestamp: currentLastCrossoverTimestamp,
    resizeHistory: currentResizeHistory,
    estimatedCardsColumns,
    estimatedBentoColumns,
    isCompact: currentThreshold === 'compact',
    isPhablet: currentThreshold === 'phablet',
    isTablet: currentThreshold === 'tablet',
    isDesktop: currentThreshold === 'desktop',
    isWide: currentThreshold === 'wide',
    isUltraWide: currentThreshold === 'ultrawide',
    isAtLeast,
    ref: activeRef,
    containerRef: activeRef as any,
    refreshDimensions: isContextAvailable && contextValue ? contextValue.refreshDimensions : scheduleMeasure
  }), [
    currentWidth,
    currentHeight,
    currentThreshold,
    currentPrevThreshold,
    currentTransitionCount,
    currentLastCrossoverTimestamp,
    currentResizeHistory,
    estimatedCardsColumns,
    estimatedBentoColumns,
    isAtLeast,
    activeRef,
    isContextAvailable,
    contextValue,
    scheduleMeasure
  ]);
}
