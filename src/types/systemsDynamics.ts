/**
 * ATLAS SANCTUM — Systems Dynamics & Modelling Engine Contracts
 * Continuous Reality Pipeline: Observe → Validate → Model → Detect → Diagnose → Decide → Act → Measure → Learn
 *
 * Core System Dynamics Primitives:
 * - Stocks (Accumulations of multi-capital value)
 * - Flows (Inflows and outflows governed by differential rate equations)
 * - Variables (Auxiliary dynamics, environmental parameters, and policy knobs)
 * - Causal Relationships (Directed polarities +, -, do-calculus weights, feedback loops)
 * - Scenarios (Counterfactuals, intervention trajectories, sensitivity analysis)
 */

import { DataProvenance } from '../types';

export type EpistemicStatus = 
  | 'Observed' 
  | 'Known'
  | 'User Provided' 
  | 'Imported Data' 
  | 'Model Inference' 
  | 'Inferred'
  | 'AI Hypothesis'
  | 'Assumed';

export type CapitalCategory =
  | 'natural'
  | 'human'
  | 'social'
  | 'manufactured'
  | 'financial'
  | 'intellectual'
  | 'cultural'
  | 'spiritual';

export type Polarity = '+' | '-';

export type FeedbackLoopType = 'reinforcing' | 'balancing';

export type LeverageLevel =
  | 'constants_parameters'        // Meadows #12-#10
  | 'buffers_stocks'             // Meadows #9
  | 'structure_network'          // Meadows #8-#7
  | 'delays_feedback_gains'      // Meadows #6-#4
  | 'rules_information_flows'    // Meadows #3-#2
  | 'goals_paradigms_transcendence'; // Meadows #1-#0

/**
 * A Stock represents an accumulation of material, energy, information, or capital
 * Differential: d(Stock)/dt = Inflows(t) - Outflows(t)
 */
export interface Stock {
  id: string;
  name: string;
  category: CapitalCategory;
  unit: string;
  currentValue: number;
  initialValue: number;
  minimumCapacity: number;
  maximumCapacity: number;
  inflowRate: number; // units per timeStep
  outflowRate: number; // units per timeStep
  inflowIds?: string[];
  outflowIds?: string[];
  equation?: string; // Mathematical representation: dS/dt = sum(Inflows) - sum(Outflows)
  epistemicStatus: EpistemicStatus;
  confidence: number; // 0 - 100
  evidenceIds?: string[];
  provenance?: DataProvenance;
  lastTelemetryTimestamp?: string;
  description: string;
}

// Canonical alias
export type SystemStock = Stock;

/**
 * A Flow represents the rate of transfer into or out of a stock
 */
export interface Flow {
  id: string;
  name: string;
  sourceStockId?: string; // If undefined, source is an environmental boundary (cloud)
  targetStockId?: string; // If undefined, target is an environmental sink
  rateEquation?: string; // Expression e.g. "0.05 * Stock_A * Variable_B"
  equationOrMechanism?: string;
  currentRate?: number;
  rate?: number;
  unit: string;
  delayPeriods?: number; // Lag in time steps
  isRegulated?: boolean;
  controllingVariableIds?: string[];
  influencingVariables?: string[];
  epistemicStatus: EpistemicStatus;
  confidence?: number;
  description: string;
}

// Canonical alias
export type SystemFlow = Flow;

/**
 * Auxiliary variable, policy parameter, or exogenous environmental driver
 */
export interface Variable {
  id: string;
  name: string;
  category?: 'policy_knob' | 'exogenous_driver' | 'intermediate_converter' | 'kpi_indicator';
  type?: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  range?: [number, number];
  step?: number;
  formula?: string;
  isControllableByIntervention?: boolean;
  epistemicStatus: EpistemicStatus;
  confidence?: number;
  description: string;
}

// Canonical alias
export type SystemVariable = Variable;

/**
 * Directed causal link between two system entities
 */
export interface CausalRelationship {
  id: string;
  sourceEntityId?: string;
  sourceId?: string;
  sourceName?: string;
  targetEntityId?: string;
  targetId?: string;
  targetName?: string;
  polarity: Polarity; // '+' = reinforcing (same direction), '-' = balancing (opposite direction)
  causalDoCoefficient?: number; // Pearl do-calculus weight / elasticity (-1.0 to +1.0)
  strengthElasticity?: number;
  pValue?: number;
  delayPeriods: number; // Time delay in months
  mechanismExplanation?: string;
  sourceAttribution?: string;
  confidence?: number;
  weight?: number;
  description?: string;
}

/**
 * Feedback loop (Cycle of causal links)
 */
export interface FeedbackLoop {
  id: string;
  name: string;
  type: FeedbackLoopType; // reinforcing (exponential growth/decay) vs balancing (goal-seeking)
  loopNodes: string[]; // Ordered list of entity IDs in the cycle
  narrative?: string;
  description?: string;
  dominantTimeHorizon?: string; // e.g. '0-6 months', '12-36 months'
  leverageScore?: number; // 1 to 10
  activeStrength?: number; // 0.0 to 1.0
}

export type SystemFeedbackLoop = FeedbackLoop;

/**
 * Boundary constraint on system dynamics
 */
export interface SystemConstraint {
  id: string;
  name: string;
  entityId?: string;
  type: 'carrying_capacity' | 'moral_boundary' | 'moral_canon' | 'ecological_boundary' | 'physical_threshold' | 'budget_ceiling' | 'financial';
  thresholdValue: number;
  unit: string;
  isHardLimit?: boolean;
  isHardBoundary?: boolean;
  description?: string;
}

/**
 * Epistemic assumption embedded in the mathematical formulation
 */
export interface SystemAssumption {
  id: string;
  statement: string;
  epistemicCategory: EpistemicStatus;
  riskIfViolated: 'low' | 'medium' | 'catastrophic';
  validationMethod: string;
  tested: boolean;
}

/**
 * Comprehensive System Model definition
 */
export interface SystemModel {
  id: string;
  version: string;
  name: string;
  bioregionOrDomain: string;
  timeHorizonMonths: number;
  timeStepUnit?: 'days' | 'months' | 'years';
  timeStepDuration?: number; // e.g. 1
  entities: string[];
  stocks: Stock[];
  flows: Flow[];
  variables: Variable[];
  relationships: CausalRelationship[];
  feedbackLoops: FeedbackLoop[];
  constraints: SystemConstraint[];
  assumptions: SystemAssumption[];
  modelHealth: {
    dataFreshness: string;
    epistemicConfidence: number; // 0-100
    lastUpdated: string;
    versionAuthor: string;
    validationStatus: 'draft' | 'calibrated' | 'empirically_verified';
  };
}

/**
 * Candidate catalytic intervention evaluated on the model
 */
export interface CandidateIntervention {
  id: string;
  name?: string;
  targetEntityId: string;
  targetName: string;
  mechanism: string;
  costUsd: number;
  timeHorizonMonths: number;
  expectedOutcome: string;
  flourishingDelta: number; // % estimated improvement
  systemDependencies: string[];
  reversibility: 'fully_reversible' | 'partially_reversible' | 'irreversible';
  risks: string[];
  unintendedConsequences: string[];
  confidence: number;
  leverageRank: number; // 1 (highest Meadows) to 12
  meadowsTier?: LeverageLevel;
  parameterOverrides?: Record<string, number>;
  flowMultipliers?: Record<string, number>;
  fpicStatus?: 'verified' | 'pending' | 'exempt';
}

/**
 * Scenario definition for differential simulation & counterfactual analysis
 */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  isBaseline: boolean;
  parameterOverrides: Record<string, number>; // variableId -> overridden value
  interventionsApplied: CandidateIntervention[];
  projectedTimeSeries: Array<{
    month: number;
    stocks: Record<string, number>;
    flourishingIndex: number;
    waterResilienceScore?: number;
    soilCarbonTons?: number;
    cleanEnergyOutputMwh?: number;
    capitalRetainedLocalUsd?: number;
    unintendedRiskMetric?: number;
  }>;
  summaryFindings: {
    primaryGain: string;
    criticalRisk: string;
    causalPathway: string;
    invalidationConditions: string[];
    confidenceInterval: [number, number];
  };
}

// Canonical alias
export type SimulationScenario = Scenario;

/**
 * Model Learning & Reality Feedback Record
 * Closes the loop between projected state and measured reality
 */
export interface ModelLearningFeedback {
  id: string;
  modelId: string;
  interventionId: string;
  missionId: string;
  predictedOutcome: Record<string, number>;
  actualOutcome: Record<string, number>;
  variancePercentage: number;
  causeOfVariance: string;
  updatedAssumptions: string[];
  modelConfidenceAdjustment: number;
  recordedAt: string;
}
