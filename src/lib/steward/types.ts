/**
 * ATLAS STEWARD — Type Definitions & Data Contracts
 * AWS Agents for Humans Hackathon 2026 — Good Neighbor Agents Track
 * Central Framework: Strands Agents SDK + Amazon Bedrock
 */

export type AutonomyLevel = 'OBSERVE' | 'RECOMMEND' | 'PREPARE' | 'EXECUTE';

export type TaskStatus = 'completed' | 'in_progress' | 'waiting' | 'exception_raised' | 'blocked' | 'cancelled';

export type DecisionStatus = 'pending_human_approval' | 'approved' | 'rejected' | 'modified' | 'paused';

export type EvidenceCategory = 'OBSERVED' | 'MODELED' | 'ESTIMATED' | 'VERIFIED';

export type AgentRole = 'STEWARD' | 'OPERATIONS' | 'RESOURCE' | 'RISK';

export type PriorityFloorDimension = 'water' | 'food' | 'shelter' | 'energy' | 'sanitation' | 'connectivity';

export interface PriorityFloorStatus {
  dimension: PriorityFloorDimension;
  label: string;
  reliabilityScore: number; // 0 - 100
  targetBaseline: number; // 95
  status: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
  activePopServed: number;
  lastAssessedAt: string;
}

export interface WaterAsset {
  id: string;
  name: string;
  type: 'borehole_pump' | 'header_tank' | 'chlorination_unit' | 'solar_inverter' | 'distribution_junction' | 'storage_cistern' | 'filtration_skid';
  location: string;
  zone: string;
  capacityLitres: number;
  currentLevelPercent: number;
  flowRateLps: number;
  pressureBar: number;
  vibrationMmS: number; // Normal < 2.5 mm/s, Warning > 4.5 mm/s, Critical > 7.0 mm/s
  temperatureCelsius: number;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE_REQUIRED' | 'OFFLINE';
  lastInspectedAt: string;
  installedDate: string;
  criticalityTier: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM';
  servesPopulation: number;
  tags: string[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'pumps' | 'seals_gaskets' | 'chemicals' | 'valves_fittings' | 'electrical_solar' | 'filtration_media';
  quantityOnHand: number;
  reorderPoint: number;
  unitCostUsd: number;
  unit: string;
  locationBin: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'DEPLETED' | 'ON_ORDER';
}

export interface Operator {
  id: string;
  name: string;
  role: 'lead_technician' | 'certified_plumber' | 'solar_specialist' | 'community_liaison' | 'logistics_coordinator';
  phone: string;
  email: string;
  status: 'AVAILABLE' | 'ON_SHIFT' | 'OFF_DUTY' | 'DISPATCHED';
  activeAssignments: string[];
  certifications: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  specialty: string;
  tier: 'PRE_APPROVED' | 'PROBATIONARY' | 'STANDARD';
  averageRating: number;
  hourlyRateUsd: number;
  slaResponseHours: number;
  contactPerson: string;
  phone: string;
  historicalJobsCount: number;
  verifiedLicense: boolean;
}

export interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  taskTitle: string;
  description: string;
  priority: 'ROUTINE' | 'ELEVATED' | 'EMERGENCY';
  assignedOperatorId?: string;
  assignedProviderId?: string;
  status: 'DRAFT' | 'APPROVED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  estimatedCostUsd: number;
  actualCostUsd?: number;
  createdAt: string;
  scheduledFor: string;
  completedAt?: string;
  verifiedAt?: string;
  verificationMetric?: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  category: 'inspection' | 'inventory_reorder' | 'chlorine_buffer' | 'sensor_calibration' | 'solar_inverter_check' | 'community_notice' | 'pressure_balancing';
  assignedAgent: AgentRole;
  assetId?: string;
  assetName?: string;
  status: TaskStatus;
  autonomyLevel: AutonomyLevel;
  automatedReason: string;
  executionTimestamp: string;
  durationMs: number;
  outcomeSummary?: string;
  toolChain: string[];
}

export interface EvidenceItem {
  id: string;
  claim: string;
  category: EvidenceCategory;
  source: string; // e.g. "Telemetry: Sensor-BH03-VIB", "Strands Memory Bank", "Physics Flow Model"
  timestamp: string;
  confidenceScore: number; // 0 - 100
  unknownsOrAssumptions?: string[];
  rawData?: any;
}

export interface HumanDecisionException {
  id: string;
  title: string;
  severity: 'P1_CRITICAL' | 'P2_ELEVATED' | 'P3_ADVISORY';
  assetId: string;
  assetName: string;
  whatHappened: string;
  whyItMatters: string;
  evidence: EvidenceItem[];
  policyThresholdTriggered: string;
  financialImpactUsd: number;
  populationImpacted: number;
  recommendedAction: string;
  potentialConsequencesIfIgnored: string[];
  options: {
    id: string;
    label: string;
    description: string;
    costUsd: number;
    downtimeHours: number;
    riskScore: number; // 0 - 100
    isRecommended: boolean;
  }[];
  status: DecisionStatus;
  decisionNotes?: string;
  decidedAt?: string;
  decidedBy?: string;
  createdAt: string;
}

export interface OperationalLesson {
  id: string;
  incidentRef: string;
  assetType: string;
  symptomPattern: string;
  rootCause: string;
  effectiveIntervention: string;
  preApprovedSupplierId: string;
  preApprovedSupplierName: string;
  lessonLearned: string;
  savedAt: string;
  retrievalCount: number;
  policyUpdateSuggested?: string;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agentRole: AgentRole;
  agentName: string;
  actionType: 'TOOL_INVOCATION' | 'AUTONOMOUS_EXECUTION' | 'EXCEPTION_ESCALATION' | 'HUMAN_APPROVAL_RECEIVED' | 'VERIFICATION_CONFIRMED' | 'MEMORY_ANCHORED';
  toolName?: string;
  latencyMs: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'ESCALATED';
  details: string;
  evidenceRefId?: string;
}

export interface StewardSystemState {
  durableObjective: string;
  objectiveSetAt: string;
  activeCycle: number;
  isRunning: boolean;
  isPaused: boolean;
  autoApprovalSpendThresholdUsd: number;
  stats: {
    routineTasksHandledCount: number;
    completedTasksCount: number;
    inProgressTasksCount: number;
    waitingTasksCount: number;
    exceptionsCount: number;
    humanInterruptionRatioPercent: number; // e.g. 5.2%
    timeSavedHours: number;
    waterReliabilityScore: number;
  };
  priorityFloor: PriorityFloorStatus[];
  assets: WaterAsset[];
  inventory: InventoryItem[];
  operators: Operator[];
  serviceProviders: ServiceProvider[];
  workOrders: WorkOrder[];
  routineTasks: RoutineTask[];
  activeExceptions: HumanDecisionException[];
  resolvedDecisions: HumanDecisionException[];
  memoryLessons: OperationalLesson[];
  activityLogs: AgentActivityLog[];
}
