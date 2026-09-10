/**
 * ATLAS SANCTUM — TELEMETRY SERVICE & SENSOR INGESTION PIPELINE
 * 
 * Supports the compact normalized telemetry packet schema provided in the low-level design:
 * - 'validateTelemetry' function strictly enforcing schema and physical constraints
 * - Ingestion handler processing incoming sensor data streams
 * - Sequence gap & device restart tracking
 * - Real-time anomaly detection & FSM state machine transitions
 * - Event-Driven dispatch: emits 'sensor.reading.received' and 'anomaly.detected'
 * - Digital Twin state synchronization via AssetService
 */

import { eventBus, EventBus, AnomalyDetectedPayload } from '../lib/eventBus';
import { assetService, AssetService, AssetAlert } from './assetService';

export interface ProvenanceObject {
  source_id: string;
  source_type: 'sensor' | 'mcu' | 'edge_gateway' | 'satellite' | 'field_operator' | 'lab_assay';
  collected_at: string;
  method: 'direct_measurement' | 'optical_telemetry' | 'scada_bus' | 'community_audit' | 'satellite_sar';
  quality: number; // 0.0 - 1.0 confidence
  processor: string;
  verified: boolean;
}

/**
 * Compact Normalized Telemetry Packet Schema as specified in the low-level architecture
 */
export interface TelemetryPacket {
  device_id: string;
  asset_id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  quality: 'good' | 'degraded' | 'fault' | 'calibrating';
  sequence: number;
  firmware: string;
  provenance?: ProvenanceObject;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedPacket?: TelemetryPacket;
}

export interface DeviceTelemetryTracker {
  deviceId: string;
  lastSequence: number;
  totalPackets: number;
  droppedPackets: number;
  lastSeenAt: string;
  firmware: string;
}

export interface AnomalyEvaluation {
  isAnomaly: boolean;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rule?: string;
  description?: string;
  suggestedAction?: string;
  fsmTransition?: {
    fromState: string;
    toState: string;
  };
}

export interface TelemetryIngestionResult {
  success: boolean;
  packetId: string;
  normalizedPacket?: TelemetryPacket;
  anomalyDetected: boolean;
  anomaly?: AnomalyEvaluation;
  fsmTransition?: string;
  validationErrors?: string[];
  sequenceAnomaly?: 'GAP_DETECTED' | 'DEVICE_RESET' | 'NORMAL';
}

/**
 * Validates an incoming telemetry packet against the compact schema and physical constraints
 */
export function validateTelemetry(raw: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['Packet payload must be a non-null JSON object.'], warnings: [] };
  }

  // Required string identifiers
  if (!raw.device_id || typeof raw.device_id !== 'string' || raw.device_id.trim().length < 2) {
    errors.push("Field 'device_id' is required and must be a valid string identifier.");
  }
  if (!raw.asset_id || typeof raw.asset_id !== 'string' || raw.asset_id.trim().length < 2) {
    errors.push("Field 'asset_id' is required and must be a valid string identifier.");
  }
  if (!raw.metric || typeof raw.metric !== 'string' || raw.metric.trim().length === 0) {
    errors.push("Field 'metric' is required and must be a non-empty string.");
  }

  // Value must be a finite number
  if (raw.value === undefined || raw.value === null) {
    errors.push("Field 'value' is required.");
  } else {
    const numVal = Number(raw.value);
    if (!Number.isFinite(numVal)) {
      errors.push(`Field 'value' must be a finite number. Received: ${raw.value}`);
    }
  }

  // Unit must be specified
  if (!raw.unit || typeof raw.unit !== 'string') {
    errors.push("Field 'unit' is required and must be a string (e.g. '%', 'NTU', '°C').");
  }

  // Quality validation
  const validQualities = ['good', 'degraded', 'fault', 'calibrating'];
  const quality = raw.quality ? String(raw.quality).toLowerCase() : 'good';
  if (!validQualities.includes(quality)) {
    errors.push(`Field 'quality' must be one of: ${validQualities.join(', ')}. Received: ${raw.quality}`);
  }

  // Sequence validation
  let sequence = Number(raw.sequence);
  if (!Number.isInteger(sequence) || sequence < 0) {
    if (raw.sequence === undefined) {
      warnings.push("Sequence number omitted; auto-assigning sequence index.");
      sequence = 0;
    } else {
      errors.push(`Field 'sequence' must be a non-negative integer. Received: ${raw.sequence}`);
    }
  }

  // Firmware check
  const firmware = raw.firmware && typeof raw.firmware === 'string' ? raw.firmware : 'mcu-default-v1.0';

  // Timestamp check
  let timestamp = raw.timestamp;
  if (!timestamp) {
    warnings.push("Timestamp omitted; defaulted to server arrival time.");
    timestamp = new Date().toISOString();
  } else {
    const parsedTime = Date.parse(timestamp);
    if (isNaN(parsedTime)) {
      errors.push(`Timestamp '${timestamp}' is not a valid ISO 8601 string.`);
    } else {
      const now = Date.now();
      if (parsedTime > now + 3600000) {
        warnings.push("Timestamp is over 1 hour in the future; possible RTC clock drift on MCU.");
      }
      if (parsedTime < new Date('2020-01-01').getTime()) {
        errors.push("Timestamp cannot precede system baseline epoch (2020-01-01).");
      }
    }
  }

  // Metric-Specific Bounds Validation (Physical Plausibility Check)
  if (raw.metric && Number.isFinite(Number(raw.value))) {
    const val = Number(raw.value);
    switch (raw.metric) {
      case 'tank_level_pct':
      case 'soil_moisture':
      case 'energy_state_of_charge':
      case 'battery_soc_pct':
      case 'relative_humidity_pct':
        if (val < 0 || val > 100) {
          errors.push(`Percentage metric '${raw.metric}' must be between 0.0 and 100.0. Received: ${val}`);
        }
        break;
      case 'ph_level':
        if (val < 0 || val > 14) {
          errors.push(`Metric 'ph_level' must be on the chemical scale [0, 14]. Received: ${val}`);
        }
        break;
      case 'turbidity_ntu':
      case 'flow_rate_lpm':
      case 'tds_ppm':
      case 'free_chlorine_ppm':
      case 'conductivity_ec':
      case 'lighting_lux':
        if (val < 0) {
          errors.push(`Metric '${raw.metric}' cannot be negative. Received: ${val}`);
        }
        break;
      case 'temperature':
      case 'indoor_temp_c':
      case 'outdoor_temp_c':
        if (val < -40 || val > 85) {
          warnings.push(`Extreme ambient temperature value: ${val}°C.`);
        }
        break;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // Sanitized validated packet
  const sanitizedPacket: TelemetryPacket = {
    device_id: String(raw.device_id).trim(),
    asset_id: String(raw.asset_id).trim(),
    timestamp,
    metric: String(raw.metric).trim(),
    value: Number(raw.value),
    unit: String(raw.unit).trim(),
    quality: quality as TelemetryPacket['quality'],
    sequence,
    firmware,
    provenance: raw.provenance || {
      source_id: String(raw.device_id).trim(),
      source_type: 'sensor',
      collected_at: timestamp,
      method: 'direct_measurement',
      quality: quality === 'good' ? 0.99 : 0.75,
      processor: 'atlas-telemetry-normalizer-v3',
      verified: true
    }
  };

  return { valid: true, errors: [], warnings, sanitizedPacket };
}

/**
 * Telemetry Service Class managing ingestion pipelines and device trackers
 */
export class TelemetryService {
  private packetBuffer: TelemetryPacket[] = [];
  private deviceTrackers: Map<string, DeviceTelemetryTracker> = new Map();
  private bus: EventBus;
  private assets: AssetService;
  private maxBufferSize: number;

  private stats = {
    totalIngested: 0,
    validPackets: 0,
    rejectedPackets: 0,
    anomaliesDetected: 0,
    sequenceGaps: 0,
    startedAt: new Date().toISOString()
  };

  constructor(
    bus: EventBus = eventBus,
    assets: AssetService = assetService,
    maxBufferSize: number = 1000
  ) {
    this.bus = bus;
    this.assets = assets;
    this.maxBufferSize = maxBufferSize;
  }

  /**
   * Validate telemetry packet (class method delegation)
   */
  public validateTelemetryPacket(raw: any): ValidationResult {
    return validateTelemetry(raw);
  }

  /**
   * Ingestion handler: processes incoming sensor data streams, validates packet,
   * detects sequence anomalies, evaluates physical rules, updates digital twins,
   * and emits system events.
   */
  public ingest(rawPacket: any): TelemetryIngestionResult {
    this.stats.totalIngested += 1;

    // 1. Validation
    const validation = validateTelemetry(rawPacket);
    if (!validation.valid || !validation.sanitizedPacket) {
      this.stats.rejectedPackets += 1;
      return {
        success: false,
        packetId: `ERR-${Date.now()}`,
        anomalyDetected: false,
        validationErrors: validation.errors
      };
    }

    const packet = validation.sanitizedPacket;
    this.stats.validPackets += 1;

    // 2. Sequence & Device Tracking
    let sequenceAnomaly: 'GAP_DETECTED' | 'DEVICE_RESET' | 'NORMAL' = 'NORMAL';
    let tracker = this.deviceTrackers.get(packet.device_id);
    if (!tracker) {
      tracker = {
        deviceId: packet.device_id,
        lastSequence: packet.sequence,
        totalPackets: 1,
        droppedPackets: 0,
        lastSeenAt: packet.timestamp,
        firmware: packet.firmware
      };
      this.deviceTrackers.set(packet.device_id, tracker);
    } else {
      tracker.totalPackets += 1;
      tracker.lastSeenAt = packet.timestamp;
      tracker.firmware = packet.firmware;

      if (packet.sequence === 0 && tracker.lastSequence > 5) {
        sequenceAnomaly = 'DEVICE_RESET';
      } else if (packet.sequence > tracker.lastSequence + 1) {
        sequenceAnomaly = 'GAP_DETECTED';
        const missed = packet.sequence - (tracker.lastSequence + 1);
        tracker.droppedPackets += missed;
        this.stats.sequenceGaps += missed;
      }
      tracker.lastSequence = packet.sequence;
    }

    // 3. Store in internal buffer
    this.packetBuffer.unshift(packet);
    if (this.packetBuffer.length > this.maxBufferSize) {
      this.packetBuffer.pop();
    }

    // 4. Emit 'sensor.reading.received' event on the EventBus
    this.bus.emit('sensor.reading.received', 'telemetry-service', {
      deviceId: packet.device_id,
      assetId: packet.asset_id,
      metric: packet.metric,
      value: packet.value,
      unit: packet.unit,
      quality: packet.quality,
      sequence: packet.sequence,
      firmware: packet.firmware,
      rawTimestamp: packet.timestamp,
      provenance: packet.provenance
    });

    // 5. Evaluate Anomaly Rules
    const anomaly = this.evaluateAnomalyRules(packet);
    let fsmTransitionText: string | undefined;

    // 6. Update Digital Twin & Asset State
    const asset = this.assets.getAssetById(packet.asset_id);
    if (asset) {
      let healthDelta = 0;
      let newAlert: AssetAlert | undefined;
      let targetFsm: string | undefined;

      if (anomaly.isAnomaly) {
        this.stats.anomaliesDetected += 1;
        healthDelta = anomaly.severity === 'CRITICAL' ? -20 : anomaly.severity === 'HIGH' ? -10 : -4;

        newAlert = {
          id: `ALT-${Date.now().toString(36).toUpperCase()}`,
          severity: anomaly.severity || 'HIGH',
          message: anomaly.description || `Anomaly on metric ${packet.metric}`,
          metric: packet.metric,
          timestamp: packet.timestamp,
          cleared: false
        };

        if (anomaly.fsmTransition) {
          targetFsm = anomaly.fsmTransition.toState;
          fsmTransitionText = `${anomaly.fsmTransition.fromState} -> ${anomaly.fsmTransition.toState}`;
        }

        // Emit 'anomaly.detected' event on the EventBus
        const anomalyPayload: AnomalyDetectedPayload = {
          anomalyId: `ANOM-${Date.now().toString(36).toUpperCase()}`,
          assetId: packet.asset_id,
          deviceId: packet.device_id,
          metric: packet.metric,
          triggerValue: packet.value,
          safeThreshold: {
            rule: anomaly.rule || 'Threshold exceeded'
          },
          severity: anomaly.severity || 'HIGH',
          description: anomaly.description || 'Metric out of safe operational envelope',
          suggestedAction: anomaly.suggestedAction,
          fsmTransition: fsmTransitionText
        };
        this.bus.emit('anomaly.detected', 'telemetry-service', anomalyPayload);
      } else {
        // Recovery logic: if asset was in warning/storage deficit and now within normal limits, restore FSM
        if (asset.digitalTwin.fsm_state === 'LOW_STORAGE' && packet.metric === 'tank_level_pct' && packet.value >= 25) {
          targetFsm = 'NORMAL';
          fsmTransitionText = 'LOW_STORAGE -> NORMAL';
          healthDelta = 5;
        } else if (asset.digitalTwin.fsm_state === 'QUALITY_WARNING' && packet.metric === 'turbidity_ntu' && packet.value <= 2.0) {
          targetFsm = 'NORMAL';
          fsmTransitionText = 'QUALITY_WARNING -> NORMAL';
          healthDelta = 8;
        }
      }

      // Synchronize delta into Digital Twin & persist
      this.assets.updateAssetState(
        packet.asset_id,
        { [packet.metric]: packet.value },
        {
          healthScoreDelta: healthDelta !== 0 ? healthDelta : undefined,
          fsmState: targetFsm,
          newAlert,
          trigger: `telemetry_${packet.metric}`
        }
      );
    }

    return {
      success: true,
      packetId: `PKT-${packet.sequence || Date.now()}`,
      normalizedPacket: packet,
      anomalyDetected: anomaly.isAnomaly,
      anomaly,
      fsmTransition: fsmTransitionText,
      sequenceAnomaly
    };
  }

  /**
   * Evaluate Domain Thresholds against low-level design specifications
   */
  private evaluateAnomalyRules(packet: TelemetryPacket): AnomalyEvaluation {
    const { metric, value } = packet;

    // --- 1. Water Node Anomaly Rules ---
    if (metric === 'tank_level_pct' && value < 15.0) {
      return {
        isAnomaly: true,
        severity: 'HIGH',
        rule: 'tank_level_pct < 15%',
        description: `Storage water level at ${value}% has fallen below the 15% dry-run safety threshold.`,
        suggestedAction: 'Activate intake replenishment pump or throttle downstream dispenser distribution.',
        fsmTransition: { fromState: 'NORMAL', toState: 'LOW_STORAGE' }
      };
    }

    if (metric === 'turbidity_ntu' && value > 5.0) {
      return {
        isAnomaly: true,
        severity: 'HIGH',
        rule: 'turbidity_ntu > 5.0 NTU',
        description: `Water turbidity measured at ${value} NTU, breaching the WHO Potability Floor limit (5.0 NTU).`,
        suggestedAction: 'Trigger ultrafiltration backwash cycle; divert water to secondary clarification bypass.',
        fsmTransition: { fromState: 'NORMAL', toState: 'QUALITY_WARNING' }
      };
    }

    if (metric === 'flow_rate_lpm' && value > 85.0) {
      return {
        isAnomaly: true,
        severity: 'CRITICAL',
        rule: 'flow_rate_lpm > 85 L/min',
        description: `Extreme flow rate spike (${value} L/min) indicates potential mainline pipe rupture or tap burst.`,
        suggestedAction: 'Immediate hardware safety shutoff: Close main solenoid inlet valve.',
        fsmTransition: { fromState: 'NORMAL', toState: 'LEAK_DETECTED' }
      };
    }

    if (metric === 'ph_level' && (value < 6.5 || value > 8.5)) {
      return {
        isAnomaly: true,
        severity: 'MEDIUM',
        rule: 'ph_level not in [6.5, 8.5]',
        description: `Water pH of ${value} deviates from drinking standard [6.5 - 8.5]. Risk of pipe corrosion or mineral scalding.`,
        suggestedAction: 'Calibrate mineralization bed dosing pump.',
        fsmTransition: { fromState: 'NORMAL', toState: 'QUALITY_WARNING' }
      };
    }

    if (metric === 'free_chlorine_ppm' && value < 0.2) {
      return {
        isAnomaly: true,
        severity: 'HIGH',
        rule: 'free_chlorine_ppm < 0.2 ppm',
        description: `Residual free chlorine is ${value} ppm (minimum safe residual floor is 0.2 ppm). Microbial regrowth risk.`,
        suggestedAction: 'Verify chlorination dosing line and reagent cartridge level.'
      };
    }

    // --- 2. Food Production Node (LifePod) Anomaly Rules ---
    if (metric === 'soil_moisture' && value < 20.0) {
      return {
        isAnomaly: true,
        severity: 'HIGH',
        rule: 'soil_moisture < 20%',
        description: `LifePod soil moisture dropped to ${value}% (< 20% safe transpiration floor). Crops at permanent wilting point risk.`,
        suggestedAction: 'Dispatch automated drip irrigation cycle for 180 seconds.',
        fsmTransition: { fromState: 'NORMAL', toState: 'MOISTURE_DEFICIT' }
      };
    }

    if (metric === 'soil_moisture' && value > 85.0) {
      return {
        isAnomaly: true,
        severity: 'MEDIUM',
        rule: 'soil_moisture > 85%',
        description: `Substrate saturation at ${value}% threatens hypoxic root zone asphyxiation and fungal rot.`,
        suggestedAction: 'Open sub-drainage valves and suspend scheduled irrigation.'
      };
    }

    // --- 3. Shelter Module (LifeShield) Anomaly Rules ---
    if (metric === 'structural_flex_strain_microstrain' && value > 80.0) {
      return {
        isAnomaly: true,
        severity: 'CRITICAL',
        rule: 'structural_flex_strain > 80 microstrain',
        description: `High structural flexure detected (${value} microstrain). Severe crosswind or ground subsidence warning.`,
        suggestedAction: 'Issue physical structural inspection order and verify perimeter guy-wire tension.',
        fsmTransition: { fromState: 'OCCUPIED', toState: 'STRUCTURAL_WARNING' }
      };
    }

    if (metric === 'indoor_temp_c' && value > 36.0) {
      return {
        isAnomaly: true,
        severity: 'HIGH',
        rule: 'indoor_temp_c > 36°C',
        description: `Indoor temperature in LifeShield shelter reached ${value}°C during heat spike. Thermal comfort barrier breached.`,
        suggestedAction: 'Open passive convective vents and initiate misting cooling evaporators.'
      };
    }

    return { isAnomaly: false };
  }

  public getRecentPackets(
    limit: number = 50, 
    filter?: { assetId?: string; metric?: string; deviceId?: string }
  ): TelemetryPacket[] {
    let result = this.packetBuffer;
    if (filter?.assetId) {
      result = result.filter(p => p.asset_id === filter.assetId);
    }
    if (filter?.metric) {
      result = result.filter(p => p.metric === filter.metric);
    }
    if (filter?.deviceId) {
      result = result.filter(p => p.device_id === filter.deviceId);
    }
    return result.slice(0, limit);
  }

  public getDeviceTracker(deviceId: string): DeviceTelemetryTracker | undefined {
    return this.deviceTrackers.get(deviceId);
  }

  public getAllDeviceTrackers(): DeviceTelemetryTracker[] {
    return Array.from(this.deviceTrackers.values());
  }

  public getIngestionStats() {
    return {
      ...this.stats,
      activeDevices: this.deviceTrackers.size,
      bufferUtilization: `${this.packetBuffer.length}/${this.maxBufferSize}`
    };
  }

  public clearBuffer(): void {
    this.packetBuffer = [];
  }
}

// Global Singleton Export
export const telemetryService = new TelemetryService(eventBus, assetService);

/**
 * Top-level Ingestion Handler function
 */
export function ingestTelemetry(rawPacket: any): TelemetryIngestionResult {
  return telemetryService.ingest(rawPacket);
}

export default telemetryService;
