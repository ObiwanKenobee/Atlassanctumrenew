/**
 * ATLAS SANCTUM & INDUSTRIAL SYSTEMS — Type Definitions Index
 * Complete TypeScript Contracts for Agentic Mission State, Systems Dynamics & Firestore Persistence
 */

import { PageView } from '../types';

// ==========================================
// 1. AGENTIC MISSION STATE & FLEET CONTRACTS
// ==========================================

export type AgentRole =
  | 'mission_orchestrator'
  | 'bioregional_researcher'
  | 'systems_analyst'
  | 'systems_diagnostic_agent'
  | 'scenario_simulation_agent'
  | 'intervention_agent'
  | 'strategic_planner'
  | 'moral_verifier'
  | 'evidence_synthesizer';

export type AgentStatus = 
  | 'idle' 
  | 'planning' 
  | 'analyzing' 
  | 'simulating' 
  | 'executing' 
  | 'verifying' 
  | 'waiting_approval' 
  | 'error' 
  | 'standby';

export type MissionPhase =
  | 'INITIATED'
  | 'SYSTEM_DISCOVERY'
  | 'MODELING'
  | 'SIMULATING'
  | 'PLANNING'
  | 'EXECUTING'
  | 'WAITING_APPROVAL'
  | 'RESUMED'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED';

export type TaskStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'failed' 
  | 'blocked' 
  | 'requires_approval';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'civilizational_critical';

export type ActionClass = 
  | 'READ' 
  | 'ANALYZE' 
  | 'RECOMMEND' 
  | 'SIMULATE' 
  | 'REQUEST_APPROVAL' 
  | 'EXECUTE';

export interface AgentPermission {
  action: string;
  scope: string;
  actionClass: ActionClass;
  requiresHumanApproval: boolean;
  maxCapitalAllocationUsd?: number;
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiredRole: AgentRole[];
  riskLevel: RiskLevel;
  actionClass: ActionClass;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: AgentRole;
  version: string;
  description: string;
  avatarIcon: string;
  systemPrompt: string;
  model: string;
  tools: string[];
  permissions: AgentPermission[];
  status: AgentStatus;
  currentTaskId?: string;
  completedTasksCount: number;
  epistemicConfidence: number; // 0-100
  allowedDataSources: string[];
  deploymentEnvironment: 'Cloud Run / Vertex ADK' | 'Cloud Run' | 'Local Edge Runtime';
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: AgentRole;
  missionId: string;
  taskId: string;
  actionClass: ActionClass;
  status: 'running' | 'succeeded' | 'failed' | 'paused_for_approval';
  inputParameters: Record<string, any>;
  outputArtifacts?: Record<string, any>;
  tokensUsed?: number;
  durationMs?: number;
  modelArmorVerdict: 'CLEARED' | 'FLAGGED' | 'SANITIZED' | 'BLOCKED';
  executedAt: string;
  completedAt?: string;
}

export interface MissionTask {
  id: string;
  missionId: string;
  title: string;
  description: string;
  assignedAgentId: string;
  assignedAgentRole: AgentRole;
  status: TaskStatus;
  order: number;
  dependencies: string[];
  toolsUsed: string[];
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
  confidenceScore?: number;
  startedAt?: string;
  completedAt?: string;
  requiresApproval?: boolean;
  approvalRequestId?: string;
  actionClass?: ActionClass;
}

export interface ApprovalRequest {
  id: string;
  missionId: string;
  taskId: string;
  requestingAgentId: string;
  actionTitle: string;
  actionDescription: string;
  actionClass: ActionClass;
  riskLevel: RiskLevel;
  requiredAccessLevel: string;
  parameters: Record<string, any>;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedBy?: string;
  decidedAt?: string;
  decisionNotes?: string;
}

export type MemoryCategory =
  | 'mission_context'
  | 'empirical_evidence'
  | 'system_dynamics_model'
  | 'simulation_run'
  | 'leverage_point_hypothesis'
  | 'bioregional_baseline'
  | 'failure_postmortem'
  | 'moral_constraint'
  | 'intermediate_finding'
  | 'synthesis_dossier';

export interface MissionMemoryItem {
  id: string;
  missionId: string;
  category: MemoryCategory;
  key: string;
  title: string;
  content: string | Record<string, any>;
  tags: string[];
  confidence: number;
  sourceAgentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  missionId: string;
  agentId: string;
  agentRole: string;
  eventType: 'tool_call' | 'plan_generation' | 'model_armor_check' | 'approval_request' | 'verification' | 'memory_write' | 'simulation_execute';
  summary: string;
  details: Record<string, any>;
  modelArmorVerdict: 'CLEARED' | 'FLAGGED' | 'SANITIZED' | 'BLOCKED';
  timestamp: string;
}

export interface EvidenceClaim {
  id: string;
  claim: string;
  evidenceSource: string;
  sourceType: 'satellite_telemetry' | 'iot_sensor_mesh' | 'field_audit' | 'peer_reviewed_model' | 'community_reporting' | 'system_simulation';
  confidenceScore: number;
  provenanceHash: string;
  moralAlignmentScore: number;
  verifiedAt: string;
  verifiedByAgentId: string;
  attributions?: Array<{
    type: 'Observed' | 'User Provided' | 'Imported Data' | 'Model Inference' | 'AI Hypothesis';
    referenceUrlOrId: string;
  }>;
}

// ==========================================
// 2. SYSTEMS DYNAMICS & MODELING CONTRACTS
// ==========================================

export type EpistemicStatus = 'Known' | 'Inferred' | 'Assumed' | 'Unknown';

export type RelationshipPolarity = '+' | '-'; // + means direct reinforcement, - means opposing/balancing

export interface SystemStock {
  id: string;
  name: string;
  category: 'natural' | 'financial' | 'social' | 'human' | 'physical' | 'institutional';
  currentValue: number;
  initialValue: number;
  unit: string;
  inflowRate: number; // units per time unit
  outflowRate: number; // units per time unit
  minimumCapacity?: number;
  maximumCapacity?: number;
  epistemicStatus: EpistemicStatus;
  confidence: number; // 0 - 100
  description: string;
}

export interface SystemFlow {
  id: string;
  name: string;
  sourceStockId?: string; // empty if from system boundary
  targetStockId?: string; // empty if to system sink
  rate: number;
  unit: string;
  equationOrMechanism: string;
  influencingVariables: string[];
  epistemicStatus: EpistemicStatus;
  description: string;
}

export interface SystemVariable {
  id: string;
  name: string;
  value: number;
  unit: string;
  type: 'exogenous' | 'endogenous' | 'policy_parameter' | 'environmental_driver';
  range: [number, number];
  epistemicStatus: EpistemicStatus;
  description: string;
}

export interface CausalRelationship {
  id: string;
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  polarity: RelationshipPolarity;
  strengthElasticity: number; // 0.0 to 1.0 (or higher)
  delayPeriods: number; // Time lag in months/steps
  causalDoCoefficient?: number; // Pearl Do-Calculus
  pValue?: number;
  mechanismExplanation: string;
  sourceAttribution: 'Observed' | 'User Provided' | 'Imported Data' | 'Model Inference' | 'AI Hypothesis';
  confidence: number;
}

export interface FeedbackLoop {
  id: string;
  name: string;
  type: 'reinforcing' | 'balancing'; // R or B loop
  loopNodes: string[]; // Ordered list of stock/variable IDs
  narrative: string;
  dominantTimeHorizon: string;
  leverageScore: number; // 1-10
}

export interface SystemConstraint {
  id: string;
  name: string;
  type: 'physical' | 'financial' | 'ecological_boundary' | 'moral_canon' | 'regulatory';
  description: string;
  thresholdValue: number;
  unit: string;
  isHardBoundary: boolean;
}

export interface SystemAssumption {
  id: string;
  statement: string;
  epistemicCategory: EpistemicStatus;
  riskIfViolated: 'low' | 'medium' | 'catastrophic';
  validationMethod: string;
  tested: boolean;
}

export interface SystemModel {
  id: string;
  version: string;
  name: string;
  bioregionOrDomain: string;
  timeHorizonMonths: number;
  timeStepUnit: 'days' | 'months' | 'years';
  entities: string[];
  stocks: SystemStock[];
  flows: SystemFlow[];
  variables: SystemVariable[];
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

export interface CandidateIntervention {
  id: string;
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
  leverageRank: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  isBaseline: boolean;
  parameterOverrides: Record<string, number>; // variableId -> new value
  interventionsApplied: CandidateIntervention[];
  projectedTimeSeries: Array<{
    month: number;
    stocks: Record<string, number>;
    flourishingIndex: number;
    waterResilienceScore?: number;
    soilCarbonTons?: number;
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

// ==========================================
// 3. MASTER AGENTIC MISSION CONTRACT
// ==========================================

export interface AgentMission {
  id: string;
  title: string;
  objective: string;
  targetRegion: string;
  allocatedCapital?: string;
  constraints: string[];
  successCriteria: string[];
  phase: MissionPhase;
  progressPercent: number;
  tasks: MissionTask[];
  activeTaskIndex: number;
  leadAgentId: string;
  participatingAgentIds: string[];
  memories: MissionMemoryItem[];
  approvalRequests: ApprovalRequest[];
  evidenceClaims: EvidenceClaim[];
  systemModel?: SystemModel;
  simulationScenarios?: SimulationScenario[];
  selectedIntervention?: CandidateIntervention;
  learningFeedback?: ModelLearningFeedback[];
  finalSynthesis?: {
    summary: string;
    flourishingImpact: string;
    keyDeliverables: Array<{ title: string; linkOrContent: string }>;
    moralVerdict: string;
    recommendations: string[];
    cryptographicProofHash: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
