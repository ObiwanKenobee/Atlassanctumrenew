/**
 * Atlas Sanctum Real-Time Performance & Render-Time Tracker
 * Measures view render times, frame rates (FPS), memory footprint, and bottlenecks.
 */

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

export interface PerformanceSnapshot {
  fps: number;
  memoryUsedMB?: number;
  memoryLimitMB?: number;
  components: Record<string, ComponentRenderMetric>;
  overallStatus: 'optimal' | 'moderate' | 'bottleneck';
  totalFramesSampled: number;
}

type PerformanceListener = (snapshot: PerformanceSnapshot) => void;

class PerformanceTrackerService {
  private metrics: Record<string, ComponentRenderMetric> = {};
  private listeners: Set<PerformanceListener> = new Set();
  private currentFps = 60;
  private frameCount = 0;
  private lastFpsTime = performance.now();
  private isRunning = false;
  private rafId: number | null = null;
  private totalFramesSampled = 0;

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

    if (hasCritical || this.currentFps < 30) {
      overallStatus = 'bottleneck';
    } else if (hasSlow) {
      overallStatus = 'moderate';
    }

    return {
      fps: this.currentFps,
      memoryUsedMB,
      memoryLimitMB,
      components: { ...this.metrics },
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
    this.notify();
  }

  public subscribe(listener: PerformanceListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach((l) => {
      try {
        l(snap);
      } catch (err) {
        console.error('Error in performance listener:', err);
      }
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
