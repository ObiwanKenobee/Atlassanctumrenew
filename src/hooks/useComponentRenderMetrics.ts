import { useRef, useEffect, useState } from 'react';
import { performanceTracker, ComponentRenderMetric } from '../lib/performanceTracker';

export interface UseComponentRenderMetricsOptions {
  enabled?: boolean;
  logSlowRenders?: boolean;
  slowThresholdMs?: number;
  bottleneckThresholdMs?: number;
}

export interface UseComponentRenderMetricsResult {
  latestRenderMs: number;
  avgRenderMs: number;
  renderCount: number;
  slowRenderCount: number;
  criticalBottlenecks: number;
  isSlow: boolean;
  isBottleneck: boolean;
  status: 'optimal' | 'acceptable' | 'bottleneck';
}

/**
 * Custom React hook to capture real-time component render metrics and dispatch
 * them to the global PerformanceMonitorOverlay and PerformanceTrackerService.
 */
export function useComponentRenderMetrics(
  componentName: string,
  options: UseComponentRenderMetricsOptions = {}
): UseComponentRenderMetricsResult {
  const {
    enabled = true,
    logSlowRenders = false,
    slowThresholdMs = 16.6,
    bottleneckThresholdMs = 40.0
  } = options;

  // Record start timestamp at the beginning of each render pass
  const renderStartTime = performance.now();

  const [metrics, setMetrics] = useState<ComponentRenderMetric | null>(() => {
    const snap = performanceTracker.getSnapshot();
    return snap.components[componentName] || null;
  });

  // Calculate and record render duration upon mount/update completion
  useEffect(() => {
    if (!enabled) return;

    const renderEndTime = performance.now();
    const durationMs = Math.max(0.1, renderEndTime - renderStartTime);

    // Record into global telemetry tracker
    performanceTracker.recordRender(componentName, durationMs);

    const snap = performanceTracker.getSnapshot();
    if (snap.components[componentName]) {
      setMetrics(snap.components[componentName]);
    }

    if (logSlowRenders && durationMs > slowThresholdMs) {
      console.warn(
        `[Atlas Performance Monitor] ${componentName} render latency: ${durationMs.toFixed(2)}ms (dropped frame threshold: ${slowThresholdMs}ms)`
      );
    }
  });

  const latestRenderMs = metrics?.latestRenderMs ?? 0;
  const isSlow = latestRenderMs > slowThresholdMs;
  const isBottleneck = latestRenderMs > bottleneckThresholdMs;

  const status: 'optimal' | 'acceptable' | 'bottleneck' = 
    isBottleneck ? 'bottleneck' : isSlow ? 'acceptable' : 'optimal';

  return {
    latestRenderMs,
    avgRenderMs: metrics?.avgRenderMs ?? 0,
    renderCount: metrics?.renderCount ?? 0,
    slowRenderCount: metrics?.slowRenderCount ?? 0,
    criticalBottlenecks: metrics?.criticalBottlenecks ?? 0,
    isSlow,
    isBottleneck,
    status
  };
}
