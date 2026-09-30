/**
 * Atlas Sanctum Real-Time Performance & Render-Time Tracker
 * Measures view render times, frame rates (FPS), memory footprint, and bottlenecks.
 */

import { ContainerResizeEvent } from '../context/ContainerDimensionsContext';

export interface ComponentRenderMetric {
  componentName: string;
  latestRenderMs: number;
  avgRenderMs: number;
  totalRenderMs: number;
  renderCount: number;
  slowRenderCount: number; // >16.6ms (dropped 60 FPS frame)
  criticalBottlenecks: number; // >50ms (noticeable hitch)
  lastRenderTimestamp: string;
  history: number[]; // last 20 render durations
}

export interface ContainerResizeMetric {
  containerName: string;
  width: number;
  height: number;
  threshold: string;
  durationMs: number; // latency of measurement & reflow calculation
  avgDurationMs: number;
  resizeCount: number;
  slowResizeCount: number; // >16.6ms (dropped frame during resize)
  criticalBottlenecks: number; // >33.3ms (severe resize bottleneck)
  lastReportTimestamp: string;
  history: number[]; // last 20 measurement durations
  recentWidths: number[]; // last 10 width measurements
  recentEvents: ContainerResizeEvent[]; // last 10 resize events for trend analysis
}

export interface PerformanceSnapshot {
  fps: number;
  memoryUsedMB?: number;
  memoryLimitMB?: number;
  components: Record<string, ComponentRenderMetric>;
  containerMetrics: Record<string, ContainerResizeMetric>;
  latestContainerWidth?: number;
  latestContainerHeight?: number;
  latestContainerThreshold?: string;
  overallStatus: 'optimal' | 'moderate' | 'bottleneck';
  totalFramesSampled: number;
}

type PerformanceListener = (snapshot: PerformanceSnapshot) => void;

class PerformanceTrackerService {
  private metrics: Record<string, ComponentRenderMetric> = {};
  private containerMetrics: Record<string, ContainerResizeMetric> = {};
  private listeners: Set<PerformanceListener> = new Set();
  private currentFps = 60;
  private frameCount = 0;
  private lastFpsTime = performance.now();
  private isRunning = false;
  private rafId: number | null = null;
  private totalFramesSampled = 0;
  private notifyScheduled = false;

  constructor() {
    // Pre-seed known views
    this.ensureComponent('Resource Allocation Planner');
    this.ensureComponent('Bioregional Twin 3D');
    this.ensureComponent('Regenerative Peer Comparison');
    this.ensureComponent('Bioregional Ledger View');
  }

  public init() {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;
    this.startFpsLoop();
  }

  private ensureComponent(name: string): ComponentRenderMetric {
    if (!this.metrics[name]) {
      this.metrics[name] = {
        componentName: name,
        latestRenderMs: 0,
        avgRenderMs: 0,
        totalRenderMs: 0,
        renderCount: 0,
        slowRenderCount: 0,
        criticalBottlenecks: 0,
        lastRenderTimestamp: 'Ready',
        history: []
      };
    }
    return this.metrics[name];
  }

  private startFpsLoop() {
    const loop = (now: number) => {
      this.frameCount++;
      this.totalFramesSampled++;
      const elapsed = now - this.lastFpsTime;

      if (elapsed >= 500) {
        this.currentFps = Math.min(60, Math.round((this.frameCount * 1000) / elapsed));
        this.frameCount = 0;
        this.lastFpsTime = now;
        this.notify();
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  public recordRender(componentName: string, durationMs: number) {
    const cleanDuration = Math.max(0.1, Number(durationMs.toFixed(2)));
    const comp = this.ensureComponent(componentName);

    comp.latestRenderMs = cleanDuration;
    comp.renderCount++;
    comp.totalRenderMs += cleanDuration;
    comp.avgRenderMs = Number((comp.totalRenderMs / comp.renderCount).toFixed(2));
    comp.lastRenderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (cleanDuration > 16.6) {
      comp.slowRenderCount++;
    }
    if (cleanDuration > 50.0) {
      comp.criticalBottlenecks++;
    }

    comp.history = [...comp.history.slice(-19), cleanDuration];
    this.notify();
  }

  public recordContainerResize(
    containerName: string,
    width: number,
    height: number,
    threshold: string,
    durationMs: number,
    historyEvents?: ContainerResizeEvent[]
  ) {
    const cleanDuration = Math.max(0.1, Number(durationMs.toFixed(2)));
    if (!this.containerMetrics[containerName]) {
      this.containerMetrics[containerName] = {
        containerName,
        width,
        height,
        threshold,
        durationMs: cleanDuration,
        avgDurationMs: cleanDuration,
        resizeCount: 0,
        slowResizeCount: 0,
        criticalBottlenecks: 0,
        lastReportTimestamp: 'Initial',
        history: [],
        recentWidths: [],
        recentEvents: []
      };
    }

    const metric = this.containerMetrics[containerName];
    metric.width = width;
    metric.height = height;
    metric.threshold = threshold;
    metric.durationMs = cleanDuration;
    metric.resizeCount++;
    metric.lastReportTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (cleanDuration > 16.6) {
      metric.slowResizeCount++;
    }
    if (cleanDuration > 33.3) {
      metric.criticalBottlenecks++;
    }

    metric.history = [...metric.history.slice(-19), cleanDuration];
    metric.recentWidths = [...metric.recentWidths.slice(-9), width];
    metric.avgDurationMs = Number((metric.history.reduce((a, b) => a + b, 0) / metric.history.length).toFixed(2));

    if (historyEvents && historyEvents.length > 0) {
      metric.recentEvents = [...historyEvents.slice(-10)];
    } else {
      const newEvent: ContainerResizeEvent = {
        width,
        height,
        threshold: threshold as any,
        timestamp: Date.now(),
        durationMs: cleanDuration
      };
      metric.recentEvents = [...(metric.recentEvents || []).slice(-9), newEvent];
    }

    // Also mirror to components list so layout bottlenecks appear in the view render table
    this.recordRender(`Container Layout (${threshold})`, cleanDuration);

    this.notify();
  }

  public getSnapshot(): PerformanceSnapshot {
    let memoryUsedMB: number | undefined;
    let memoryLimitMB: number | undefined;

    if (typeof window !== 'undefined' && (performance as any).memory) {
      const mem = (performance as any).memory;
      memoryUsedMB = Math.round(mem.usedJSHeapSize / (1024 * 1024));
      memoryLimitMB = Math.round(mem.jsHeapSizeLimit / (1024 * 1024));
    }

    let overallStatus: 'optimal' | 'moderate' | 'bottleneck' = 'optimal';
    const allMetrics = Object.values(this.metrics);
    const hasCritical = allMetrics.some((m) => m.latestRenderMs > 50 || m.criticalBottlenecks > 2);
    const hasSlow = allMetrics.some((m) => m.latestRenderMs > 25 || m.slowRenderCount > 5) || this.currentFps < 45;

    // Check for container resize bottlenecks
    const allContainerMetrics = Object.values(this.containerMetrics);
    const hasResizeBottleneck = allContainerMetrics.some((c) => c.durationMs > 33.3 || c.criticalBottlenecks > 0);

    if (hasCritical || hasResizeBottleneck || this.currentFps < 30) {
      overallStatus = 'bottleneck';
    } else if (hasSlow) {
      overallStatus = 'moderate';
    }

    const firstContainer = allContainerMetrics[0];

    return {
      fps: this.currentFps,
      memoryUsedMB,
      memoryLimitMB,
      components: { ...this.metrics },
      containerMetrics: { ...this.containerMetrics },
      latestContainerWidth: firstContainer?.width,
      latestContainerHeight: firstContainer?.height,
      latestContainerThreshold: firstContainer?.threshold,
      overallStatus,
      totalFramesSampled: this.totalFramesSampled
    };
  }

  public resetMetrics() {
    Object.keys(this.metrics).forEach((key) => {
      this.metrics[key] = {
        componentName: key,
        latestRenderMs: 0,
        avgRenderMs: 0,
        totalRenderMs: 0,
        renderCount: 0,
        slowRenderCount: 0,
        criticalBottlenecks: 0,
        lastRenderTimestamp: 'Reset',
        history: []
      };
    });
    this.containerMetrics = {};
    this.notify();
  }

  public subscribe(listener: PerformanceListener): () => void {
    this.listeners.add(listener);
    const schedule = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (fn: () => void) => setTimeout(fn, 0);

    schedule(() => {
      if (this.listeners.has(listener)) {
        try {
          listener(this.getSnapshot());
        } catch (err) {
          console.error('Error in performance listener:', err);
        }
      }
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (this.notifyScheduled) return;
    this.notifyScheduled = true;

    const schedule = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (fn: () => void) => setTimeout(fn, 0);

    schedule(() => {
      this.notifyScheduled = false;
      const snap = this.getSnapshot();
      this.listeners.forEach((l) => {
        try {
          l(snap);
        } catch (err) {
          console.error('Error in performance listener:', err);
        }
      });
    });
  }

  public exportProfileJSON(): string {
    return JSON.stringify({
      title: 'Atlas Sanctum View Render Profiling Report',
      timestamp: new Date().toISOString(),
      fps: this.currentFps,
      metrics: this.metrics
    }, null, 2);
  }
}

export const performanceTracker = new PerformanceTrackerService();

if (typeof window !== 'undefined') {
  performanceTracker.init();
}
