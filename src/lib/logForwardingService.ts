/**
 * ATLAS SANCTUM — AUTOMATED CLIENT-SIDE LOG-FORWARDING SERVICE
 * 
 * Automatically intercepts and forwards client-side crash telemetry and critical diagnostic
 * states to the centralized observability endpoint (/api/observability/crash-reports).
 * 
 * Capabilities:
 * 1. Monitors startup diagnostics and reacts immediately when a 'Critical' state is detected.
 * 2. Compiles high-fidelity diagnostic snapshots including recent unhandled errors, connection
 *    states across Firebase/Express/NATS, browser memory telemetry, and device metadata.
 * 3. Incorporates intelligent deduplication and throttling to prevent endpoint saturation.
 * 4. Provides reactive listeners for UI overlays and inspection badges.
 */

import { StartupDiagnosticReport, subscribeStartupDiagnostics, getLastDiagnosticReport } from './startupDiagnostics';
import { errorLogger, DiagnosticErrorLog } from './errorLogger';
import { apiClient } from './apiClient';

export interface ClientCrashPayload {
  diagnosticStatus: 'critical' | 'degraded' | 'healthy';
  trigger: string;
  timestamp: string;
  diagnosticIssues: any[];
  errorLogs: DiagnosticErrorLog[];
  clientMetadata: {
    userAgent: string;
    url: string;
    networkOnline: boolean;
    connectionStates: Record<string, any>;
    memoryUsageMb?: {
      used: number;
      total: number;
    };
    reportLatencyMs?: number;
    platform: string;
  };
}

export interface ForwardedReportReceipt {
  reportId: string;
  receivedAt: string;
  trigger: string;
  status: 'forwarded' | 'failed' | 'queued';
  error?: string;
}

type LogForwardingListener = (receipt: ForwardedReportReceipt) => void;

class LogForwardingService {
  private listeners: Set<LogForwardingListener> = new Set();
  private lastReceipt: ForwardedReportReceipt | null = null;
  private isForwarding = false;
  private lastForwardFingerprint: string | null = null;
  private lastForwardTimestamp = 0;
  private initialized = false;
  private readonly THROTTLE_MS = 15000; // 15-second throttle for identical critical snapshots

  constructor() {
    // Attempt to load last receipt from localStorage for persistence across reloads
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('atlas_last_observability_receipt');
        if (stored) {
          this.lastReceipt = JSON.parse(stored);
        }
      } catch {}
    }
  }

  public init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Listen to startup diagnostics in real time
    subscribeStartupDiagnostics((report: StartupDiagnosticReport) => {
      if (report.status === 'critical') {
        this.handleCriticalDiagnosticState(report);
      }
    });

    // Also check current diagnostic state immediately
    const current = getLastDiagnosticReport();
    if (current && current.status === 'critical') {
      this.handleCriticalDiagnosticState(current);
    }
  }

  private handleCriticalDiagnosticState(report: StartupDiagnosticReport): void {
    const fingerprint = report.issues.map(i => `${i.id}:${i.component}`).sort().join('|');
    const now = Date.now();

    // Prevent duplicate forwarding storms for the exact same critical fingerprint within throttle window
    if (this.lastForwardFingerprint === fingerprint && (now - this.lastForwardTimestamp < this.THROTTLE_MS)) {
      return;
    }

    this.lastForwardFingerprint = fingerprint;
    this.lastForwardTimestamp = now;

    this.forwardCrashReport('critical_diagnostic_state', report);
  }

  /**
   * Compiles and forwards client-side crash telemetry to the observability endpoint.
   */
  public async forwardCrashReport(
    triggerReason = 'critical_diagnostic_state',
    explicitReport?: StartupDiagnosticReport
  ): Promise<ForwardedReportReceipt> {
    if (this.isForwarding) {
      // If already in-flight, return the last receipt or a pending placeholder
      return this.lastReceipt || {
        reportId: 'PENDING',
        receivedAt: new Date().toISOString(),
        trigger: triggerReason,
        status: 'queued'
      };
    }

    this.isForwarding = true;
    const diagReport = explicitReport || getLastDiagnosticReport();
    const recentErrors = errorLogger.getLogs().slice(0, 30);
    const connectionStates = apiClient.getConnectionStates();

    let memoryUsageMb: { used: number; total: number } | undefined;
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const m = (performance as any).memory;
      memoryUsageMb = {
        used: Math.round(m.usedJSHeapSize / (1024 * 1024) * 10) / 10,
        total: Math.round(m.totalJSHeapSize / (1024 * 1024) * 10) / 10
      };
    }

    const payload: ClientCrashPayload = {
      diagnosticStatus: diagReport?.status || 'critical',
      trigger: triggerReason,
      timestamp: new Date().toISOString(),
      diagnosticIssues: diagReport?.issues || [],
      errorLogs: recentErrors,
      clientMetadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        networkOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        connectionStates,
        memoryUsageMb,
        reportLatencyMs: diagReport?.latencyMs,
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'
      }
    };

    try {
      const response = await fetch('/api/observability/crash-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const receipt: ForwardedReportReceipt = {
          reportId: data.reportId || `CRASH-${Date.now()}`,
          receivedAt: data.receivedAt || new Date().toISOString(),
          trigger: triggerReason,
          status: 'forwarded'
        };

        this.lastReceipt = receipt;
        try {
          sessionStorage.setItem('atlas_last_observability_receipt', JSON.stringify(receipt));
        } catch {}

        this.notifyListeners(receipt);
        console.info(`[LogForwarder] Forwarded client crash data to observability endpoint: ${receipt.reportId}`);
        return receipt;
      } else {
        throw new Error(`Observability endpoint responded with status ${response.status}`);
      }
    } catch (err: any) {
      console.warn('[LogForwarder] Failed to reach observability endpoint:', err.message || err);
      const failedReceipt: ForwardedReportReceipt = {
        reportId: `LOCAL-${Date.now()}`,
        receivedAt: new Date().toISOString(),
        trigger: triggerReason,
        status: 'failed',
        error: err.message || 'Network request failed'
      };
      this.lastReceipt = failedReceipt;
      this.notifyListeners(failedReceipt);
      return failedReceipt;
    } finally {
      this.isForwarding = false;
    }
  }

  public subscribe(listener: LogForwardingListener): () => void {
    this.listeners.add(listener);
    if (this.lastReceipt) {
      listener(this.lastReceipt);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getLastReceipt(): ForwardedReportReceipt | null {
    return this.lastReceipt;
  }

  private notifyListeners(receipt: ForwardedReportReceipt): void {
    this.listeners.forEach((listener) => {
      try {
        listener(receipt);
      } catch {}
    });
  }
}

export const logForwardingService = new LogForwardingService();

// Automatically initialize in browser
if (typeof window !== 'undefined') {
  logForwardingService.init();
}

export default logForwardingService;
