/**
 * ATLAS SANCTUM — RESILIENT API CLIENT & CONNECTION RETRY WRAPPER
 * 
 * Provides robust exponential backoff with jitter, transient network fault tolerance,
 * and graceful connection retry mechanisms for Firebase Firestore, NATS Message Broker,
 * and Backend REST/WebSocket gateways during application startup and runtime.
 */

export interface RetryConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  jitter?: boolean;
  retryableErrorCodes?: string[];
  retryableHttpStatuses?: number[];
  onRetry?: (attempt: number, error: unknown, nextDelayMs: number, serviceName: string) => void;
}

export interface ServiceConnectionState {
  service: 'Firebase' | 'NATS' | 'Backend API' | 'WebSocket Gateway';
  status: 'connected' | 'connecting' | 'retrying' | 'failed' | 'offline';
  attemptCount: number;
  lastError: string | null;
  lastSuccessfulConnect: number | null;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 4,
  initialDelayMs: 600,
  maxDelayMs: 6000,
  backoffFactor: 2.0,
  jitter: true,
  retryableErrorCodes: [
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'failed-precondition',
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN',
    'ERR_NETWORK',
    'NETWORK_ERROR',
  ],
  retryableHttpStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

// In-memory reactive state for connection monitors
const connectionRegistry: Map<string, ServiceConnectionState> = new Map([
  ['Firebase', { service: 'Firebase', status: 'connected', attemptCount: 0, lastError: null, lastSuccessfulConnect: Date.now() }],
  ['NATS', { service: 'NATS', status: 'connected', attemptCount: 0, lastError: null, lastSuccessfulConnect: Date.now() }],
  ['Backend API', { service: 'Backend API', status: 'connected', attemptCount: 0, lastError: null, lastSuccessfulConnect: Date.now() }],
  ['WebSocket Gateway', { service: 'WebSocket Gateway', status: 'connected', attemptCount: 0, lastError: null, lastSuccessfulConnect: Date.now() }]
]);

type ConnectionStateListener = (states: Record<string, ServiceConnectionState>) => void;
const listeners = new Set<ConnectionStateListener>();

function notifyListeners(): void {
  const snapshot: Record<string, ServiceConnectionState> = {};
  for (const [k, v] of connectionRegistry.entries()) {
    snapshot[k] = { ...v };
  }
  listeners.forEach(fn => {
    try {
      fn(snapshot);
    } catch {
      // Ignore listener error
    }
  });
}

export function subscribeConnectionStates(listener: ConnectionStateListener): () => void {
  listeners.add(listener);
  // Initial emission
  const snapshot: Record<string, ServiceConnectionState> = {};
  for (const [k, v] of connectionRegistry.entries()) {
    snapshot[k] = { ...v };
  }
  listener(snapshot);
  return () => {
    listeners.delete(listener);
  };
}

export function getConnectionStates(): Record<string, ServiceConnectionState> {
  const snapshot: Record<string, ServiceConnectionState> = {};
  for (const [k, v] of connectionRegistry.entries()) {
    snapshot[k] = { ...v };
  }
  return snapshot;
}

/**
 * Calculates exponential backoff delay with optional random jitter.
 */
export function calculateBackoffDelay(
  attempt: number,
  initialDelay: number = 600,
  maxDelay: number = 6000,
  backoffFactor: number = 2.0,
  jitter: boolean = true
): number {
  const baseDelay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
  if (!jitter) return baseDelay;
  // Apply +/- 25% jitter
  const randomFactor = 0.75 + Math.random() * 0.5;
  return Math.round(baseDelay * randomFactor);
}

/**
 * Determines whether an error is transient and should be retried.
 */
export function isTransientError(error: unknown, config: Required<RetryConfig>): boolean {
  if (!error) return false;

  // Check HTTP response / status
  if (typeof error === 'object' && error !== null) {
    const errObj = error as any;
    if (errObj.status && config.retryableHttpStatuses.includes(Number(errObj.status))) {
      return true;
    }
    if (errObj.code && config.retryableErrorCodes.includes(String(errObj.code).toLowerCase())) {
      return true;
    }
    const message = (errObj.message || '').toLowerCase();
    if (
      message.includes('network error') ||
      message.includes('failed to fetch') ||
      message.includes('econnreset') ||
      message.includes('econnrefused') ||
      message.includes('etimedout') ||
      message.includes('load failed') ||
      message.includes('aborted') ||
      message.includes('unavailable')
    ) {
      return true;
    }
  }

  if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
    return true;
  }

  return false;
}

/**
 * Generic retry wrapper with exponential backoff and jitter.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryConfig = {},
  serviceName: 'Firebase' | 'NATS' | 'Backend API' | 'WebSocket Gateway' = 'Backend API'
): Promise<T> {
  const mergedConfig: Required<RetryConfig> = { ...DEFAULT_RETRY_CONFIG, ...options };
  let attempt = 0;

  const currentServiceState = connectionRegistry.get(serviceName) || {
    service: serviceName,
    status: 'connected',
    attemptCount: 0,
    lastError: null,
    lastSuccessfulConnect: null,
  };

  while (attempt <= mergedConfig.maxRetries) {
    attempt++;
    try {
      if (attempt > 1) {
        currentServiceState.status = 'retrying';
        currentServiceState.attemptCount = attempt;
        connectionRegistry.set(serviceName, currentServiceState);
        notifyListeners();
      }

      const result = await fn();

      currentServiceState.status = 'connected';
      currentServiceState.attemptCount = 0;
      currentServiceState.lastError = null;
      currentServiceState.lastSuccessfulConnect = Date.now();
      connectionRegistry.set(serviceName, currentServiceState);
      notifyListeners();

      return result;
    } catch (error: any) {
      const isRetryable = isTransientError(error, mergedConfig);
      const isLastAttempt = attempt > mergedConfig.maxRetries;

      currentServiceState.lastError = error?.message || String(error);
      currentServiceState.attemptCount = attempt;

      if (!isRetryable || isLastAttempt) {
        currentServiceState.status = 'failed';
        connectionRegistry.set(serviceName, currentServiceState);
        notifyListeners();
        throw error;
      }

      const delayMs = calculateBackoffDelay(
        attempt,
        mergedConfig.initialDelayMs,
        mergedConfig.maxDelayMs,
        mergedConfig.backoffFactor,
        mergedConfig.jitter
      );

      mergedConfig.onRetry(attempt, error, delayMs, serviceName);
      console.warn(
        `[${serviceName}] Transient connection failure (attempt ${attempt}/${mergedConfig.maxRetries}). Retrying in ${delayMs}ms... Reason:`,
        error?.message || error
      );

      currentServiceState.status = 'retrying';
      connectionRegistry.set(serviceName, currentServiceState);
      notifyListeners();

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(`[${serviceName}] Maximum retry attempts reached.`);
}

/**
 * Robust connection retry for Firebase / Cloud Firestore operations.
 */
export async function retryFirebaseOperation<T>(
  operation: () => Promise<T>,
  opName: string = 'firestore-query',
  options: RetryConfig = {}
): Promise<T> {
  return withRetry(
    async () => {
      // Execute the Firestore query / document access
      return await operation();
    },
    {
      maxRetries: 3,
      initialDelayMs: 500,
      maxDelayMs: 4000,
      onRetry: (attempt, error, delayMs) => {
        console.warn(`[Firebase Firestore] ${opName} retry #${attempt} in ${delayMs}ms:`, error);
      },
      ...options,
    },
    'Firebase'
  );
}

/**
 * Robust connection retry for NATS Message Broker / Event Bus streaming gateway.
 */
export async function retryNatsConnection(
  connectFn: () => Promise<boolean>,
  brokerEndpoint: string = 'nats://localhost:4222',
  options: RetryConfig = {}
): Promise<boolean> {
  return withRetry(
    async () => {
      const isConnected = await connectFn();
      if (!isConnected) {
        throw new Error(`NATS connection failed to endpoint: ${brokerEndpoint}`);
      }
      return true;
    },
    {
      maxRetries: 4,
      initialDelayMs: 800,
      maxDelayMs: 8000,
      onRetry: (attempt, error, delayMs) => {
        console.warn(`[NATS Event Bus] Connection retry #${attempt} to ${brokerEndpoint} in ${delayMs}ms:`, error);
      },
      ...options,
    },
    'NATS'
  );
}

/**
 * Enhanced HTTP fetch client with automated transient error retry.
 */
export async function fetchWithRetry<T = any>(
  url: string,
  init?: RequestInit,
  options: RetryConfig = {}
): Promise<T> {
  return withRetry(
    async () => {
      const response = await fetch(url, init);
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        const errorObj: any = new Error(`HTTP ${response.status}: ${response.statusText} (${errorBody})`);
        errorObj.status = response.status;
        throw errorObj;
      }
      return (await response.json()) as T;
    },
    options,
    'Backend API'
  );
}

export const apiClient = {
  get: <T = any>(url: string, options?: RetryConfig) => fetchWithRetry<T>(url, { method: 'GET' }, options),
  post: <T = any>(url: string, body?: any, options?: RetryConfig) =>
    fetchWithRetry<T>(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      },
      options
    ),
  withRetry,
  retryFirebaseOperation,
  retryNatsConnection,
  getConnectionStates,
  subscribeConnectionStates,
};

export default apiClient;
