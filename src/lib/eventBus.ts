/**
 * ATLAS SANCTUM — EVENT BUS
 * 
 * Simple EventEmitter-based pattern to handle system-wide event orchestration
 * (e.g., 'sensor.reading.received', 'anomaly.detected', 'asset.state.updated').
 * Exports a singleton instance for use across application services.
 */

export interface AtlasEvent<T = any> {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  correlationId?: string;
  payload: T;
  metadata?: Record<string, any>;
}

export type EventListener<T = any> = (payload: T, event: AtlasEvent<T>) => void | Promise<void>;
export type UnsubscribeFn = () => void;

export interface SensorReadingReceivedPayload {
  deviceId: string;
  assetId: string;
  metric: string;
  value: number;
  unit: string;
  quality: 'good' | 'degraded' | 'fault' | 'calibrating';
  sequence: number;
  firmware: string;
  rawTimestamp: string;
  provenance?: {
    source_id: string;
    source_type: string;
    collected_at: string;
    method: string;
    quality: number;
    processor: string;
    verified: boolean;
  };
}

export interface AnomalyDetectedPayload {
  anomalyId: string;
  assetId: string;
  deviceId: string;
  metric: string;
  triggerValue: number;
  safeThreshold: {
    min?: number;
    max?: number;
    expectedState?: string;
    rule: string;
  };
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  suggestedAction?: string;
  workOrderId?: string;
  fsmTransition?: string;
}

export interface AssetStateUpdatedPayload {
  assetId: string;
  previousState: Record<string, any>;
  currentState: Record<string, any>;
  delta: Record<string, any>;
  healthScore: number;
  fsmState?: string;
  updatedAt: string;
}

export interface AssetCreatedPayload {
  assetId: string;
  assetType: string;
  name: string;
  locationId: string;
  operatorId: string;
}

export interface AssetUpdatedPayload {
  assetId: string;
  updates: Record<string, any>;
}

export interface AssetLifecycleTransitionedPayload {
  assetId: string;
  oldState: string;
  newState: string;
  operatorNotes?: string;
  timestamp: string;
}

export interface WorkOrderGeneratedPayload {
  workOrderId: string;
  assetId: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  anomalyTrigger: string;
  assignedTo: string;
  createdAt: string;
}

export interface ActuationSafetyTrippedPayload {
  commandId: string;
  deviceId: string;
  assetId: string;
  requestedCommand: string;
  tripReason: string;
  mcuInterlock: string;
  actualStateSnapshot: Record<string, any>;
}

/**
 * Event map for strongly typed event handling
 */
export interface EventTypeMap {
  'sensor.reading.received': SensorReadingReceivedPayload;
  'anomaly.detected': AnomalyDetectedPayload;
  'asset.state.updated': AssetStateUpdatedPayload;
  'asset.created': AssetCreatedPayload;
  'asset.updated': AssetUpdatedPayload;
  'asset.lifecycle.transitioned': AssetLifecycleTransitionedPayload;
  'work_order.generated': WorkOrderGeneratedPayload;
  'actuation.safety.tripped': ActuationSafetyTrippedPayload;
  [key: string]: any;
}

/**
 * Simple, robust EventEmitter-based pattern for event orchestration
 */
export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();
  private onceListeners: Map<string, Set<EventListener>> = new Map();
  private eventHistory: AtlasEvent[] = [];
  private readonly maxHistorySize: number;

  constructor(maxHistorySize: number = 500) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Register an event listener for a given event name or wildcard pattern (e.g. "sensor.*", "*")
   */
  public on<K extends keyof EventTypeMap>(
    event: K,
    listener: EventListener<EventTypeMap[K]>
  ): UnsubscribeFn;
  public on(event: string, listener: EventListener<any>): UnsubscribeFn;
  public on(event: string, listener: EventListener<any>): UnsubscribeFn {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Alias for on() to follow standard EventEmitter API
   */
  public addListener(event: string, listener: EventListener<any>): this {
    this.on(event, listener);
    return this;
  }

  /**
   * Register a one-time event listener
   */
  public once<K extends keyof EventTypeMap>(
    event: K,
    listener: EventListener<EventTypeMap[K]>
  ): UnsubscribeFn;
  public once(event: string, listener: EventListener<any>): UnsubscribeFn;
  public once(event: string, listener: EventListener<any>): UnsubscribeFn {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(listener);

    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Remove an event listener
   */
  public off(event: string, listener: EventListener<any>): this {
    const regular = this.listeners.get(event);
    if (regular) {
      regular.delete(listener);
      if (regular.size === 0) {
        this.listeners.delete(event);
      }
    }

    const once = this.onceListeners.get(event);
    if (once) {
      once.delete(listener);
      if (once.size === 0) {
        this.onceListeners.delete(event);
      }
    }

    return this;
  }

  /**
   * Alias for off()
   */
  public removeListener(event: string, listener: EventListener<any>): this {
    return this.off(event, listener);
  }

  /**
   * Remove all listeners for an event, or all listeners if no event specified
   */
  public removeAllListeners(event?: string): this {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
    return this;
  }

  /**
   * Emit an event. Supports either:
   * 1. emit(event, payload)
   * 2. emit(event, source, payload, metadata, correlationId)
   */
  public emit<K extends keyof EventTypeMap>(
    event: K,
    payload: EventTypeMap[K]
  ): AtlasEvent<EventTypeMap[K]>;
  public emit<T = any>(
    event: string,
    sourceOrPayload: any,
    payloadIfSource?: T,
    metadata?: Record<string, any>,
    correlationId?: string
  ): AtlasEvent<T>;
  public emit<T = any>(
    event: string,
    arg1?: any,
    arg2?: any,
    arg3?: Record<string, any>,
    arg4?: string
  ): AtlasEvent<T> {
    let source = 'system';
    let payload: T;
    let metadata: Record<string, any> | undefined;
    let correlationId: string | undefined;

    // Check if called as emit(type, source, payload, metadata, correlationId)
    if (typeof arg1 === 'string' && arg2 !== undefined) {
      source = arg1;
      payload = arg2;
      metadata = arg3;
      correlationId = arg4;
    } else {
      // Called as emit(type, payload)
      payload = arg1;
    }

    const fullEvent: AtlasEvent<T> = {
      id: `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      type: event,
      source,
      timestamp: new Date().toISOString(),
      correlationId,
      payload,
      metadata
    };

    // Store in history buffer
    this.eventHistory.unshift(fullEvent);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Collect matching listener functions
    const targets: { listener: EventListener; isOnce: boolean }[] = [];

    // Exact match
    const exactListeners = this.listeners.get(event);
    if (exactListeners) {
      exactListeners.forEach(l => targets.push({ listener: l, isOnce: false }));
    }

    const exactOnce = this.onceListeners.get(event);
    if (exactOnce) {
      exactOnce.forEach(l => targets.push({ listener: l, isOnce: true }));
      this.onceListeners.delete(event);
    }

    // Wildcard matches (e.g. "sensor.*" matches "sensor.reading.received")
    for (const [pattern, set] of this.listeners.entries()) {
      if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2);
        if (event.startsWith(prefix + '.')) {
          set.forEach(l => targets.push({ listener: l, isOnce: false }));
        }
      }
    }

    // Global wildcard listener ("*")
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach(l => targets.push({ listener: l, isOnce: false }));
    }

    // Execute listeners asynchronously with error isolation
    for (const { listener } of targets) {
      try {
        const res = listener(payload, fullEvent);
        if (res instanceof Promise) {
          res.catch(err => {
            console.error(`[EventBus] Async listener error for event '${event}':`, err);
          });
        }
      } catch (err) {
        console.error(`[EventBus] Synchronous listener error for event '${event}':`, err);
      }
    }

    return fullEvent;
  }

  /**
   * Backwards-compatible subscribe method
   */
  public subscribe<T = any>(pattern: string, handler: (event: AtlasEvent<T>) => void | Promise<void>): UnsubscribeFn {
    const wrappedListener: EventListener<T> = (_payload, event) => handler(event);
    return this.on(pattern, wrappedListener);
  }

  /**
   * Backwards-compatible publish method
   */
  public async publish<T = any>(event: AtlasEvent<T>): Promise<void> {
    this.emit(event.type, event.source, event.payload, event.metadata, event.correlationId);
  }

  /**
   * Retrieve recent event log for diagnostics and audit trails
   */
  public getRecentEvents(limit: number = 50, filterType?: string): AtlasEvent[] {
    if (filterType) {
      return this.eventHistory
        .filter(e => e.type === filterType || (filterType.endsWith('.*') && e.type.startsWith(filterType.slice(0, -2))))
        .slice(0, limit);
    }
    return this.eventHistory.slice(0, limit);
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }

  public getListenerCount(event?: string): number {
    if (event) {
      const reg = this.listeners.get(event)?.size || 0;
      const once = this.onceListeners.get(event)?.size || 0;
      return reg + once;
    }
    let total = 0;
    for (const set of this.listeners.values()) total += set.size;
    for (const set of this.onceListeners.values()) total += set.size;
    return total;
  }
}

// Singleton Instance export
export const eventBus = new EventBus();
export const LocalMessageBus = EventBus; // alias for backwards compatibility
export default eventBus;
