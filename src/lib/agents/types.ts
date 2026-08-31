/**
 * ATLAS AGENTIC OPERATING LAYER — Data Types & Contracts
 * Fortified Enterprise Fleet Track — All Things Agentic Hackathon
 */

export type AgentRole =
  | 'mission_orchestrator'
  | 'observer_agent'
  | 'investigator_agent'
  | 'risk_agent'
  | 'director_agent'
  | 'verifier_agent'
  | 'bioregional_researcher'
  | 'systems_analyst'
  | 'systems_diagnostic_agent'
  | 'scenario_simulation_agent'
  | 'intervention_agent'
  | 'strategic_planner'
  | 'moral_verifier'
  | 'evidence_synthesizer';

export type AgentStatus = 'idle' | 'planning' | 'executing' | 'verifying' | 'waiting_approval' | 'error' | 'standby';

export type MissionPhase =
  | 'INITIATED'
  | 'PLANNING'
  | 'EXECUTING'
  | 'WAITING_APPROVAL'
  | 'RESUMED'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked' | 'requires_approval';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'civilizational_critical';

export interface AgentPermission {
  action: string;
  scope: string;
  requiresHumanApproval: boolean;
  maxCapitalAllocation?: number;
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiredRole: AgentRole[];
  riskLevel: RiskLevel;
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

export interface TaskDependency {
  taskId: string;
  requiredOutputKey?: string;
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
}

export interface ApprovalRequest {
  id: string;
  missionId: string;
  taskId: string;
  requestingAgentId: string;
  actionTitle: string;
  actionDescription: string;
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
  eventType: 'tool_call' | 'plan_generation' | 'model_armor_check' | 'approval_request' | 'verification' | 'memory_write';
  summary: string;
  details: Record<string, any>;
  modelArmorVerdict: 'CLEARED' | 'FLAGGED' | 'SANITIZED' | 'BLOCKED';
  timestamp: string;
}

export interface EvidenceClaim {
  id: string;
  claim: string;
  evidenceSource: string;
  sourceType: string;
  confidenceScore: number;
  provenanceHash: string;
  moralAlignmentScore: number;
  verifiedAt: string;
  verifiedByAgentId: string;
}

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
