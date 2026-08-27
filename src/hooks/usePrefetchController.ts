import { useEffect, useState, useCallback } from 'react';
import { PageView, PrefetchStats } from '../types';
import { prefetchController } from '../lib/prefetchController';

/**
 * Hook to automatically connect active view changes to the Automated Prefetch Controller
 * and expose prefetch telemetry
 */
export function usePrefetchController(currentTab?: PageView) {
  const [stats, setStats] = useState<PrefetchStats>(() => prefetchController.getStats());

  useEffect(() => {
    if (currentTab) {
      prefetchController.observeNavigation(currentTab);
      setStats(prefetchController.getStats());
    }
  }, [currentTab]);

  const prefetchOnHover = useCallback((view: PageView) => {
    prefetchController.observeHover(view);
    setStats(prefetchController.getStats());
  }, []);

  const refreshStats = useCallback(() => {
    setStats(prefetchController.getStats());
  }, []);

  return {
    stats,
    prefetchOnHover,
    refreshStats
  };
}
