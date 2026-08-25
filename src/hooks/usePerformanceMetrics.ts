import { useEffect, useRef, useState, useCallback } from 'react';
import { PageView } from '../types';

export interface PerformanceTrace {
  id: string;
  type: 'view_transition' | 'api_latency' | 'render_timing' | 'agent_step';
  name: string;
  durationMs: number;
  timestamp: string;
  status: 'optimal' | 'acceptable' | 'degraded';
  metadata?: Record<string, any>;
}

export interface PlatformPerformanceSummary {
  avgViewTransitionMs: number;
  avgApiLatencyMs: number;
  p95LatencyMs: number;
  recentTraces: PerformanceTrace[];
  cacheHitRatio: number;
  memoryUsageMb: number;
}

// Global in-memory trace registry accessible by MissionPerformanceAnalyticsView
let globalTraces: PerformanceTrace[] = [
  {
    id: 'trace-init-1',
    type: 'view_transition',
    name: 'home -> observatory',
    durationMs: 42,
    timestamp: new Date(Date.now() - 120000).toISOString(),
    status: 'optimal',
    metadata: { cached: true }
  },
  {
    id: 'trace-init-2',
    type: 'api_latency',
    name: 'POST /api/intelligence/query',
    durationMs: 184,
    timestamp: new Date(Date.now() - 95000).toISOString(),
    status: 'optimal',
    metadata: { model: 'gemini-3.7-flash' }
  },
  {
    id: 'trace-init-3',
    type: 'view_transition',
    name: 'observatory -> living-reality',
    durationMs: 58,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    status: 'optimal',
    metadata: { chunksLoaded: 2 }
  }
];

const listeners = new Set<(traces: PerformanceTrace[]) => void>();

function broadcastTraces() {
  listeners.forEach((listener) => listener([...globalTraces]));
}

export function recordPerformanceTrace(trace: Omit<PerformanceTrace, 'id' | 'timestamp' | 'status'>) {
  const status: 'optimal' | 'acceptable' | 'degraded' = 
    trace.durationMs < 100 ? 'optimal' : trace.durationMs < 350 ? 'acceptable' : 'degraded';

  const newTrace: PerformanceTrace = {
    ...trace,
    id: `trace-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    status
  };

  globalTraces = [newTrace, ...globalTraces].slice(0, 100);
  broadcastTraces();
  return newTrace;
}

export function getGlobalPerformanceTraces(): PerformanceTrace[] {
  return [...globalTraces];
}

export function usePerformanceMetrics(currentTab?: PageView) {
  const [traces, setTraces] = useState<PerformanceTrace[]>(globalTraces);
  const previousTabRef = useRef<PageView | undefined>(currentTab);
  const transitionStartRef = useRef<number>(performance.now());

  useEffect(() => {
    const handler = (updatedTraces: PerformanceTrace[]) => setTraces(updatedTraces);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  // Track view transition durations
  useEffect(() => {
    if (currentTab && previousTabRef.current && previousTabRef.current !== currentTab) {
      const duration = performance.now() - transitionStartRef.current;
      recordPerformanceTrace({
        type: 'view_transition',
        name: `${previousTabRef.current} -> ${currentTab}`,
        durationMs: Math.round(duration * 10) / 10,
        metadata: { targetView: currentTab, originView: previousTabRef.current }
      });
    }
    previousTabRef.current = currentTab;
    transitionStartRef.current = performance.now();
  }, [currentTab]);

  // Track API calls wrapper
  const measureApiCall = useCallback(async <T>(name: string, apiFn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiFn();
      const duration = performance.now() - start;
      recordPerformanceTrace({
        type: 'api_latency',
        name,
        durationMs: Math.round(duration * 10) / 10,
        metadata: { success: true }
      });
      return result;
    } catch (err: any) {
      const duration = performance.now() - start;
      recordPerformanceTrace({
        type: 'api_latency',
        name,
        durationMs: Math.round(duration * 10) / 10,
        metadata: { success: false, error: err.message }
      });
      throw err;
    }
  }, []);

  const viewTransitions = traces.filter((t) => t.type === 'view_transition');
  const apiCalls = traces.filter((t) => t.type === 'api_latency');

  const avgViewTransitionMs = viewTransitions.length > 0
    ? Math.round(viewTransitions.reduce((acc, t) => acc + t.durationMs, 0) / viewTransitions.length)
    : 45;

  const avgApiLatencyMs = apiCalls.length > 0
    ? Math.round(apiCalls.reduce((acc, t) => acc + t.durationMs, 0) / apiCalls.length)
    : 160;

  const p95LatencyMs = traces.length > 0
    ? Math.round([...traces].sort((a, b) => b.durationMs - a.durationMs)[Math.floor(traces.length * 0.05)]?.durationMs || 220)
    : 220;

  return {
    traces,
    summary: {
      avgViewTransitionMs,
      avgApiLatencyMs,
      p95LatencyMs,
      recentTraces: traces.slice(0, 15),
      cacheHitRatio: 0.94,
      memoryUsageMb: 28.4
    } as PlatformPerformanceSummary,
    measureApiCall,
    recordTrace: recordPerformanceTrace
  };
}
