/**
 * Atlas Sanctum System Diagnostic Error Logger
 * Aggregates runtime JavaScript errors, unhandled promise rejections,
 * React boundary crashes, and network failures into a searchable log for developers.
 */

export interface DiagnosticErrorLog {
  id: string;
  timestamp: string;
  epoch: number;
  type: 'javascript_error' | 'unhandled_rejection' | 'react_boundary' | 'network_error' | 'synthetic_probe';
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  userAgent: string;
  url: string;
  handled: boolean;
  componentStack?: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'atlas_system_diagnostic_errors';
const MAX_LOGS = 150;

type ErrorListener = (logs: DiagnosticErrorLog[]) => void;

class ErrorLoggerService {
  private logs: DiagnosticErrorLog[] = [];
  private listeners: Set<ErrorListener> = new Set();
  private initialized = false;

  constructor() {
    this.loadFromStorage();
  }

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // 1. Capture uncaught window errors
    window.addEventListener('error', (event: ErrorEvent) => {
      this.recordError({
        type: 'javascript_error',
        message: event.message || 'Uncaught runtime error',
        source: event.filename || 'unknown',
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack || undefined,
        handled: false
      });
    });

    // 2. Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      let message = 'Unhandled Promise Rejection';
      let stack: string | undefined;

      if (event.reason instanceof Error) {
        message = event.reason.message;
        stack = event.reason.stack;
      } else if (typeof event.reason === 'string') {
        message = event.reason;
      } else if (event.reason && typeof event.reason === 'object') {
        try {
          message = JSON.stringify(event.reason);
        } catch {
          message = String(event.reason);
        }
      }

      this.recordError({
        type: 'unhandled_rejection',
        message,
        stack,
        handled: false,
        metadata: {
          reason: typeof event.reason === 'object' ? 'object' : event.reason
        }
      });
    });

    // Seed with clean telemetry entry if empty
    if (this.logs.length === 0) {
      this.recordError({
        type: 'synthetic_probe',
        message: 'System Diagnostic Logger initialized successfully. Epistemic monitor active.',
        source: 'src/lib/errorLogger.ts',
        handled: true,
        metadata: { status: 'healthy', env: 'production_sandbox' }
      });
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.logs = parsed.slice(0, MAX_LOGS);
        }
      }
    } catch (e) {
      console.warn('Failed to load diagnostic logs from localStorage:', e);
    }
  }

  private persistToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs.slice(0, MAX_LOGS)));
    } catch (e) {
      console.warn('Failed to persist diagnostic logs to localStorage:', e);
    }
  }

  private notifyListeners() {
    const copy = [...this.logs];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error in diagnostic log listener:', err);
      }
    });
  }

  public recordError(entry: Partial<DiagnosticErrorLog>): DiagnosticErrorLog {
    const now = new Date();
    const newLog: DiagnosticErrorLog = {
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      epoch: now.getTime(),
      type: entry.type || 'javascript_error',
      message: entry.message || 'Unknown exception',
      source: entry.source || (typeof window !== 'undefined' ? window.location.pathname : ''),
      lineno: entry.lineno,
      colno: entry.colno,
      stack: entry.stack,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : '',
      handled: entry.handled ?? false,
      componentStack: entry.componentStack,
      metadata: entry.metadata
    };

    this.logs = [newLog, ...this.logs].slice(0, MAX_LOGS);
    this.persistToStorage();
    this.notifyListeners();
    return newLog;
  }

  public recordReactBoundaryError(error: Error, componentStack?: string) {
    return this.recordError({
      type: 'react_boundary',
      message: error.message,
      stack: error.stack,
      componentStack,
      handled: true,
      metadata: { name: error.name }
    });
  }

  public getLogs(): DiagnosticErrorLog[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    this.notifyListeners();
  }

  public subscribe(listener: ErrorListener): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public search(query: string, filterType?: string): DiagnosticErrorLog[] {
    let result = [...this.logs];

    if (filterType && filterType !== 'all') {
      result = result.filter((l) => l.type === filterType);
    }

    if (!query.trim()) return result;

    const q = query.toLowerCase();
    return result.filter((log) => {
      return (
        log.message.toLowerCase().includes(q) ||
        (log.source && log.source.toLowerCase().includes(q)) ||
        (log.stack && log.stack.toLowerCase().includes(q)) ||
        (log.type && log.type.toLowerCase().includes(q)) ||
        log.timestamp.toLowerCase().includes(q)
      );
    });
  }

  public simulateTestError(type: 'js' | 'rejection' | 'network' = 'js') {
    if (type === 'js') {
      this.recordError({
        type: 'javascript_error',
        message: `TypeError: Cannot read properties of undefined (reading 'evaluateHydrologicFlow')`,
        source: 'src/components/bioregional/ResourceAllocationPlanner.tsx',
        lineno: 142,
        colno: 28,
        stack: `TypeError: Cannot read properties of undefined (reading 'evaluateHydrologicFlow')
    at evaluateHydrologicFlow (src/components/bioregional/ResourceAllocationPlanner.tsx:142:28)
    at runScenarioSimulation (src/components/bioregional/ResourceAllocationPlanner.tsx:320:14)
    at HTMLButtonElement.dispatch (node_modules/react-dom/client.js:4512:19)`,
        handled: false,
        metadata: { simulated: true, severity: 'high' }
      });
    } else if (type === 'rejection') {
      this.recordError({
        type: 'unhandled_rejection',
        message: `UnhandledPromiseRejection: Bioregional Satellite Telemetry query timed out after 5000ms`,
        source: 'src/services/bioregionalKnowledgeService.ts',
        lineno: 89,
        stack: `UnhandledPromiseRejection: Bioregional Satellite Telemetry query timed out after 5000ms
    at fetchSatelliteTelemetry (src/services/bioregionalKnowledgeService.ts:89:15)
    at async syncBioregionalLedger (src/components/views/BioregionalLedgerView.tsx:112:9)`,
        handled: false,
        metadata: { simulated: true, endpoint: '/api/bioregional/telemetry' }
      });
    } else {
      this.recordError({
        type: 'network_error',
        message: `FetchError: Failed to reach WebSocket endpoint wss://telemetry.atlassanctum.org/v1/stream`,
        source: 'src/lib/agents/agentRuntime.ts',
        handled: true,
        metadata: { simulated: true, httpStatus: 503 }
      });
    }
  }

  public exportReportJSON(): string {
    const report = {
      system: 'Atlas Sanctum Epistemic Diagnostic Framework',
      generatedAt: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      totalEntries: this.logs.length,
      breakdown: {
        javascriptErrors: this.logs.filter((l) => l.type === 'javascript_error').length,
        unhandledRejections: this.logs.filter((l) => l.type === 'unhandled_rejection').length,
        reactBoundaryErrors: this.logs.filter((l) => l.type === 'react_boundary').length,
        networkErrors: this.logs.filter((l) => l.type === 'network_error').length,
        probes: this.logs.filter((l) => l.type === 'synthetic_probe').length
      },
      logs: this.logs
    };
    return JSON.stringify(report, null, 2);
  }
}

export const errorLogger = new ErrorLoggerService();

// Auto-initialize when in browser environment
if (typeof window !== 'undefined') {
  errorLogger.init();
}
