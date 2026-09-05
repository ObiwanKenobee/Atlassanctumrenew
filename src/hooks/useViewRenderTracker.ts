import { useEffect, useRef } from 'react';
import { performanceTracker } from '../lib/performanceTracker';

/**
 * Measures mount and update render durations of a component,
 * reporting them to the global Performance Tracker.
 */
export function useViewRenderTracker(componentName: string) {
  const startTimeRef = useRef<number>(performance.now());
  const isInitialMount = useRef<boolean>(true);

  // Measure before render executes
  startTimeRef.current = performance.now();

  useEffect(() => {
    const duration = performance.now() - startTimeRef.current;
    performanceTracker.recordRender(componentName, duration);
    isInitialMount.current = false;
  });
}
