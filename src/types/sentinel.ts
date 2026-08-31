/**
 * ATLAS SENTINEL — Types & Data Contracts
 * Autonomous Infrastructure Intelligence & Decision Engine
 */

export type EpistemicClassification = 
  | 'OBSERVED'    // Direct physical sensor measurement
  | 'REPORTED'    // Human/community observed record
  | 'MODELED'     // Algorithmic or physical simulation forecast
  | 'ESTIMATED'   // Statistical inference from partial data
  | 'VERIFIED'    // Cryptographically signed and audited
  | 'UNKNOWN';

export type SentinelStage =
  | 'OBSERVE'
  | 'DETECT'
  | 'REASON'
  | 'VERIFY'
  | 'ASSESS_SAFETY'
  | 'RECOMMEND'
  | 'REQUEST_APPROVAL'
  | 'ACT'
  | 'MEASURE'
  | 'LEARN';

export type AnomalySeverity = 'NOMINAL' | 'LOW' | 'MODERATE' | 'CRITICAL_URGENT' | 'CATASTROPHIC_HAZARD';

export interface TelemetryReading {
  timestamp: string;
  sensorId: string;
  sensorName: string;
  category: 'hydraulic_pressure' | 'flow_rate' | 'vibration_harmonics' | 'microbial_turbidity' | 'power_frequency' | 'thermal_core';
  unit: string;
  nominalValue: number;
  currentValue: number;
  zScore: number;
  isAnomalous: boolean;
  provenance: EpistemicClassification;
  edgeBuffered: boolean;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  bioregion: string;
  assetType: 'Hydraulic Pumping Station' | 'Microgrid Substation' | 'Solar Aquifer Well' | 'Riparian Weir';
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL_FAILING' | 'RECOVERING' | 'SAFE_LOCKED';
  activeTelemetry: TelemetryReading[];
  safetyLimits: {
    maxSafePressureBar: number;
    maxVibrationMmSec: number;
    minReserveLiters: number;
    criticalTempCelsius: number;
  };
}

export interface InterventionCandidate {
  id: string;
  title: string;
  strategy: 'AUTOMATED_SCADA_BYPASS' | 'HIGH_VOLTAGE_FLUSH' | 'CONTROLLED_SHUTDOWN' | 'COMMUNITY_WEIR_REROUTE';
  description: string;
  residualRisk: number;         // 0 - 1 (lower is better)
  financialCostUsd: number;      // USD
  downtimeHours: number;        // Hours
  flourishingPreservation: number; // 0 - 100
  deterministicSafetyScore: number; // 0 - 1 (>= 0.85 passes)
  paretoRank: number;
  compositeUtilityScore: number;
  safetyVerdict: 'CLEARED_SAFE' | 'VIOLATION_BLOCKED' | 'REQUIRES_DUAL_KEY';
  safetyRationale: string;
  actuationSteps: string[];
}

export interface HistoricalFailureCase {
  id: string;
  title: string;
  year: number;
  bioregion: string;
  rootCause: string;
  mitigationApplied: string;
  similarityScore: number; // 0 - 100
  lessonsLearned: string[];
}

export interface SentinelExecutionTraceStep {
  id: string;
  stage: SentinelStage;
  stageLabel: string;
  toolName: string;
  purpose: string;
  status: 'pending' | 'running' | 'completed' | 'blocked' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  confidence: number; // 0 - 100
  epistemicProvenance: EpistemicClassification;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  summary: string;
  details?: string;
  safetyCheckPassed?: boolean;
}

export interface SentinelScenario {
  id: string;
  title: string;
  subtitle: string;
  bioregion: string;
  description: string;
  initialPrompt: string;
  targetAsset: InfrastructureAsset;
  simulatedAnomalousTelemetry: TelemetryReading[];
  historicalMatches: HistoricalFailureCase[];
  candidateInterventions: InterventionCandidate[];
  baselineStabilizationTelemetry: TelemetryReading[];
}

export interface SentinelActuationReceipt {
  transactionHash: string;
  actionId: string;
  operatorDid: string;
  approvalSignature: string;
  timestamp: string;
  scadaRelayStatus: 'DISPATCHED_CONFIRMED' | 'SIMULATED_SUCCESS';
  merkleRootLeaf: string;
  observedRecoveryDeltaPercent: number;
}
