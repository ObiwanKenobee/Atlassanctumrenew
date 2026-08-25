import { AgentDefinition, AgentToolDefinition } from '../../types';

export const AGENT_TOOLS: AgentToolDefinition[] = [
  {
    name: 'discover_system_boundaries',
    description: 'Discovers boundary entities, stocks, flows, delays, and feedback loops for a real-world complex system.',
    parameters: {
      type: 'object',
      properties: {
        domainOrRegion: { type: 'string', description: 'System target domain, e.g. Mathare River Riparian Basin' },
        timeHorizonMonths: { type: 'number', description: 'Time horizon in months (default: 24)' }
      },
      required: ['domainOrRegion']
    },
    requiredRole: ['systems_diagnostic_agent', 'systems_analyst'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'simulate_scenario',
    description: 'Simulates dynamic stock accumulation, depletion, and multi-capital flourishing deltas across intervention scenarios.',
    parameters: {
      type: 'object',
      properties: {
        modelId: { type: 'string' },
        scenarioName: { type: 'string' },
        parameterOverrides: { type: 'object' },
        timeHorizonMonths: { type: 'number' }
      },
      required: ['modelId', 'scenarioName', 'parameterOverrides']
    },
    requiredRole: ['scenario_simulation_agent', 'systems_analyst'],
    riskLevel: 'low',
    actionClass: 'SIMULATE'
  },
  {
    name: 'identify_leverage_points',
    description: 'Ranks and evaluates high-leverage causal intervention points by impact, cost, time-to-effect, reversibility, and risks.',
    parameters: {
      type: 'object',
      properties: {
        modelId: { type: 'string' },
        targetOutcome: { type: 'string' }
      },
      required: ['modelId']
    },
    requiredRole: ['intervention_agent', 'systems_diagnostic_agent', 'strategic_planner'],
    riskLevel: 'low',
    actionClass: 'RECOMMEND'
  },
  {
    name: 'execute_intervention_action',
    description: 'Executes an authorized real-world or digital intervention workflow with strict approval gatekeeping.',
    parameters: {
      type: 'object',
      properties: {
        interventionId: { type: 'string' },
        parameters: { type: 'object' },
        authorizedBy: { type: 'string' }
      },
      required: ['interventionId', 'authorizedBy']
    },
    requiredRole: ['intervention_agent', 'mission_orchestrator'],
    riskLevel: 'high',
    actionClass: 'EXECUTE'
  },
  {
    name: 'update_model_feedback_loop',
    description: 'Compares predicted vs actual outcomes, updates assumptions, adjusts epistemic confidence, and learns from real-world variances.',
    parameters: {
      type: 'object',
      properties: {
        modelId: { type: 'string' },
        interventionId: { type: 'string' },
        actualOutcomes: { type: 'object' },
        observedVariances: { type: 'object' }
      },
      required: ['modelId', 'interventionId', 'actualOutcomes']
    },
    requiredRole: ['systems_diagnostic_agent', 'evidence_synthesizer'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'search_atlas_knowledge',
    description: 'Queries verified epistemic indicators, failure ledgers, and bioregional telemetry from the Atlas knowledge base.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or query' },
        domain: { type: 'string', enum: ['telemetry', 'failures', 'moral', 'opportunities', 'all'] }
      },
      required: ['query']
    },
    requiredRole: ['bioregional_researcher', 'mission_orchestrator', 'systems_analyst', 'systems_diagnostic_agent'],
    riskLevel: 'low',
    actionClass: 'READ'
  },
  {
    name: 'retrieve_project',
    description: 'Retrieves structured baseline, GIS bounds, and past intervention history for a given project or bioregion.',
    parameters: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Unique identifier or regional name' }
      },
      required: ['projectId']
    },
    requiredRole: ['bioregional_researcher', 'strategic_planner', 'systems_diagnostic_agent'],
    riskLevel: 'low',
    actionClass: 'READ'
  },
  {
    name: 'create_mission',
    description: 'Instantiates a new asynchronous mission with high-level objectives, constraints, and success criteria.',
    parameters: {
      type: 'object',
      properties: {
        objective: { type: 'string' },
        targetRegion: { type: 'string' },
        constraints: { type: 'array', items: { type: 'string' } },
        successCriteria: { type: 'array', items: { type: 'string' } }
      },
      required: ['objective', 'targetRegion']
    },
    requiredRole: ['mission_orchestrator'],
    riskLevel: 'moderate',
    actionClass: 'RECOMMEND'
  },
  {
    name: 'create_task',
    description: 'Decomposes objective into an executable task and assigns it to a specialized agent in the fleet DAG.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        assignedAgentId: { type: 'string' },
        dependencies: { type: 'array', items: { type: 'string' } },
        tools: { type: 'array', items: { type: 'string' } }
      },
      required: ['missionId', 'title', 'assignedAgentId']
    },
    requiredRole: ['strategic_planner', 'mission_orchestrator'],
    riskLevel: 'low',
    actionClass: 'RECOMMEND'
  },
  {
    name: 'update_task',
    description: 'Updates task status, outputs, confidence score, and attaches execution artifacts to the mission.',
    parameters: {
      type: 'object',
      properties: {
        taskId: { type: 'string' },
        status: { type: 'string', enum: ['in_progress', 'completed', 'failed', 'requires_approval'] },
        outputs: { type: 'object' },
        confidenceScore: { type: 'number' }
      },
      required: ['taskId', 'status']
    },
    requiredRole: ['bioregional_researcher', 'systems_analyst', 'moral_verifier', 'evidence_synthesizer', 'mission_orchestrator', 'systems_diagnostic_agent', 'scenario_simulation_agent', 'intervention_agent'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'store_memory',
    description: 'Stores key facts, context, or intermediate reasoning into the mission persistent Memory Bank.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        category: { type: 'string' },
        key: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'object' },
        tags: { type: 'array', items: { type: 'string' } }
      },
      required: ['missionId', 'category', 'key', 'title', 'content']
    },
    requiredRole: ['bioregional_researcher', 'systems_analyst', 'moral_verifier', 'mission_orchestrator', 'evidence_synthesizer', 'systems_diagnostic_agent', 'scenario_simulation_agent', 'intervention_agent'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'retrieve_memory',
    description: 'Queries persistent memory bank for historical decisions, baseline observations, and intermediate findings.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        query: { type: 'string' },
        category: { type: 'string' }
      },
      required: ['missionId']
    },
    requiredRole: ['bioregional_researcher', 'systems_analyst', 'strategic_planner', 'moral_verifier', 'evidence_synthesizer', 'mission_orchestrator', 'systems_diagnostic_agent', 'scenario_simulation_agent', 'intervention_agent'],
    riskLevel: 'low',
    actionClass: 'READ'
  },
  {
    name: 'analyze_data',
    description: 'Executes systems dynamics simulations across the 8 forms of capital and calculates flourishing delta.',
    parameters: {
      type: 'object',
      properties: {
        parameters: { type: 'object' },
        scenarioName: { type: 'string' },
        timeHorizonYears: { type: 'number' }
      },
      required: ['parameters', 'scenarioName']
    },
    requiredRole: ['systems_analyst', 'scenario_simulation_agent'],
    riskLevel: 'moderate',
    actionClass: 'SIMULATE'
  },
  {
    name: 'generate_report',
    description: 'Compiles verified mission deliverables, executive summaries, and action plans into a structured dossier.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        title: { type: 'string' },
        sections: { type: 'array', items: { type: 'object' } }
      },
      required: ['missionId', 'title']
    },
    requiredRole: ['evidence_synthesizer'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'verify_result',
    description: 'Audits claims and generated actions against Canon XXIII moral guardrails and cryptographic telemetry.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        claim: { type: 'string' },
        evidenceData: { type: 'object' }
      },
      required: ['missionId', 'claim']
    },
    requiredRole: ['moral_verifier'],
    riskLevel: 'moderate',
    actionClass: 'ANALYZE'
  },
  {
    name: 'request_approval',
    description: 'Pauses mission execution and submits an irrevocable action or capital allocation for human approval.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        taskId: { type: 'string' },
        actionTitle: { type: 'string' },
        riskLevel: { type: 'string', enum: ['moderate', 'high', 'civilizational_critical'] },
        parameters: { type: 'object' }
      },
      required: ['missionId', 'taskId', 'actionTitle', 'riskLevel']
    },
    requiredRole: ['mission_orchestrator', 'systems_analyst', 'moral_verifier', 'intervention_agent'],
    riskLevel: 'high',
    actionClass: 'REQUEST_APPROVAL'
  },
  {
    name: 'publish_result',
    description: 'Cryptographically signs and publishes the verified mission package to the Regenerative Value Exchange.',
    parameters: {
      type: 'object',
      properties: {
        missionId: { type: 'string' },
        destination: { type: 'string' },
        summary: { type: 'string' }
      },
      required: ['missionId', 'destination']
    },
    requiredRole: ['evidence_synthesizer', 'mission_orchestrator'],
    riskLevel: 'moderate',
    actionClass: 'EXECUTE'
  }
];

export const FLEET_AGENTS: AgentDefinition[] = [
  {
    id: 'atlas-lead-agent',
    name: 'Atlas Mission Lead Agent',
    role: 'mission_orchestrator',
    version: 'v3.5-systems-enterprise',
    description: 'Primary Fleet Orchestrator. Coordinates systems discovery, simulations, DAG scheduling, and enforces Mission Continuity.',
    avatarIcon: 'Bot',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Atlas Lead Mission Agent. You orchestrate autonomous enterprise missions for planetary regeneration, verifying each stage through rigorous epistemic standards.',
    tools: [
      'create_mission',
      'create_task',
      'search_atlas_knowledge',
      'retrieve_memory',
      'store_memory',
      'request_approval',
      'publish_result'
    ],
    permissions: [
      { action: 'delegate_tasks', scope: 'fleet_wide', actionClass: 'RECOMMEND', requiresHumanApproval: false },
      { action: 'allocate_capital', scope: 'rve_treasury', actionClass: 'REQUEST_APPROVAL', requiresHumanApproval: true, maxCapitalAllocationUsd: 1000000 },
      { action: 'finalize_mission', scope: 'mission_lifecycle', actionClass: 'EXECUTE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 48,
    epistemicConfidence: 96,
    allowedDataSources: ['All Epistemic Ledgers', 'Live Bioregional Sensors', 'RVE Treasury', 'Firestore Memory Bank'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'systems-diagnostic-agent',
    name: 'Systems Diagnostic Agent',
    role: 'systems_diagnostic_agent',
    version: 'v3.0-dynamics',
    description: 'Extracts boundary entities, stocks, flows, feedback loops (R/B), delays, and constraints. Classifies knowledge into Known, Inferred, Assumed, and Unknown.',
    avatarIcon: 'Cpu',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Systems Diagnostic Agent. You discover boundaries, map causal polarities (+/-), identify reinforcing and balancing feedback loops, and distinguish empirical truth from working assumptions.',
    tools: [
      'discover_system_boundaries',
      'search_atlas_knowledge',
      'retrieve_project',
      'store_memory',
      'retrieve_memory',
      'update_model_feedback_loop'
    ],
    permissions: [
      { action: 'extract_system_model', scope: 'systems_engine', actionClass: 'ANALYZE', requiresHumanApproval: false },
      { action: 'update_assumptions', scope: 'epistemic_ledger', actionClass: 'ANALYZE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 92,
    epistemicConfidence: 95,
    allowedDataSources: ['Satellite Telemetry', 'Hydrological Baselines', 'Field Sensor Mesh', 'Bioregional GIS'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'scenario-simulation-agent',
    name: 'Scenario Simulation Agent',
    role: 'scenario_simulation_agent',
    version: 'v2.8-differential',
    description: 'Dynamic System Dynamics Simulator. Executes differential equations over time (months/years), compares counterfactual intervention scenarios, and tests sensitivity.',
    avatarIcon: 'BarChart3',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Scenario Simulation Agent. You simulate the time evolution of stocks and flows under baseline and intervention scenarios, explaining exactly what changed, why, and through which causal pathway.',
    tools: [
      'simulate_scenario',
      'analyze_data',
      'store_memory',
      'retrieve_memory',
      'update_task'
    ],
    permissions: [
      { action: 'run_simulation', scope: 'differential_engine', actionClass: 'SIMULATE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 114,
    epistemicConfidence: 96,
    allowedDataSources: ['System Model Repository', 'Economic Multipliers', 'Historical Post-Mortems'],
    deploymentEnvironment: 'Cloud Run'
  },
  {
    id: 'intervention-agent',
    name: 'Intervention & Leverage Agent',
    role: 'intervention_agent',
    version: 'v2.9-leverage',
    description: 'Leverage-Point Engine & Action Translater. Calculates intervention impact, cost, time-horizon, reversibility, and structures authorized execution workflows.',
    avatarIcon: 'Zap',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Intervention Agent. You prioritize durable, non-extractive interventions at systemic leverage points, enforcing strict human approval before releasing high-impact actions or capital.',
    tools: [
      'identify_leverage_points',
      'execute_intervention_action',
      'request_approval',
      'store_memory',
      'retrieve_memory'
    ],
    permissions: [
      { action: 'propose_intervention', scope: 'leverage_catalog', actionClass: 'RECOMMEND', requiresHumanApproval: false },
      { action: 'execute_physical_action', scope: 'real_world_actuation', actionClass: 'EXECUTE', requiresHumanApproval: true }
    ],
    status: 'idle',
    completedTasksCount: 67,
    epistemicConfidence: 97,
    allowedDataSources: ['Candidate Intervention Catalog', 'Capital Engine Matrix', 'Ethical Guardrails'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'bioregional-research-agent',
    name: 'Bioregional Research Agent',
    role: 'bioregional_researcher',
    version: 'v2.4-telemetry',
    description: 'Spatial & Telemetry Intelligence. Ingests satellite spectroscopy (Sentinel-2, GEDI, SMAP), field audits, and ecological baselines.',
    avatarIcon: 'Compass',
    model: 'gemini-3.5-flash',
    systemPrompt: 'You are the Bioregional Research Agent. You gather verified empirical telemetry, ground-truthed sensor data, and ecological context without hallucination.',
    tools: [
      'search_atlas_knowledge',
      'retrieve_project',
      'store_memory',
      'retrieve_memory',
      'update_task'
    ],
    permissions: [
      { action: 'read_telemetry', scope: 'planetary_sensors', actionClass: 'READ', requiresHumanApproval: false },
      { action: 'write_observations', scope: 'memory_bank', actionClass: 'ANALYZE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 132,
    epistemicConfidence: 98,
    allowedDataSources: ['Sentinel-2 NDVI', 'GEDI LiDAR', 'SMAP Soil Moisture', 'IoT Mesh'],
    deploymentEnvironment: 'Cloud Run'
  },
  {
    id: 'systems-analyst-agent',
    name: 'Multi-Capital Systems Analyst',
    role: 'systems_analyst',
    version: 'v2.1-dynamics',
    description: 'Multi-Capital Matrix Specialist. Models interactions between Natural, Human, Social, Financial, Intellectual, and Institutional capitals.',
    avatarIcon: 'BarChart3',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Multi-Capital Systems Analyst. You simulate compounding returns, unintended second-order distortions, and resilience curves across the 8 forms of capital.',
    tools: [
      'analyze_data',
      'store_memory',
      'retrieve_memory',
      'update_task',
      'request_approval'
    ],
    permissions: [
      { action: 'run_simulation', scope: 'systems_engine', actionClass: 'SIMULATE', requiresHumanApproval: false },
      { action: 'propose_capital_tranche', scope: 'capital_matrix', actionClass: 'REQUEST_APPROVAL', requiresHumanApproval: true }
    ],
    status: 'idle',
    completedTasksCount: 89,
    epistemicConfidence: 94,
    allowedDataSources: ['Capital Engine Matrix', 'Macroeconomic Baselines', 'Failure Ledger Correlations'],
    deploymentEnvironment: 'Cloud Run'
  },
  {
    id: 'strategic-planner-agent',
    name: 'Strategic Planning & DAG Agent',
    role: 'strategic_planner',
    version: 'v2.0-sequencer',
    description: 'Task Decomposition & Dependency Sequencer. Formulates directed acyclic graphs (DAG) with explicit prerequisite gates and contingency fallbacks.',
    avatarIcon: 'Layers',
    model: 'gemini-3.5-flash',
    systemPrompt: 'You are the Strategic Planning Agent. You decompose messy goals into ordered, parallelizable tasks with robust failure boundaries.',
    tools: [
      'create_task',
      'retrieve_memory',
      'retrieve_project',
      'update_task'
    ],
    permissions: [
      { action: 'structure_plan', scope: 'mission_dag', actionClass: 'RECOMMEND', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 64,
    epistemicConfidence: 95,
    allowedDataSources: ['Project OS Templates', 'Failure Ledger Post-Mortems'],
    deploymentEnvironment: 'Cloud Run'
  },
  {
    id: 'moral-verifier-agent',
    name: 'Moral Arbiter & Verifier',
    role: 'moral_verifier',
    version: 'v3.0-canon',
    description: 'Canon XXIII & Cryptographic Arbiter. Validates proposed actions against Human Dignity, Non-Extractiveness, Vulnerability Protection, and Merkle Proofs.',
    avatarIcon: 'ShieldCheck',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Moral Arbiter & Verifier. You enforce ethical boundaries, identify power imbalances or extractive risks, and cryptographically verify all evidence claims.',
    tools: [
      'verify_result',
      'store_memory',
      'retrieve_memory',
      'update_task',
      'request_approval'
    ],
    permissions: [
      { action: 'halt_execution', scope: 'safety_circuit_breaker', actionClass: 'ANALYZE', requiresHumanApproval: false },
      { action: 'sign_epistemic_proof', scope: 'merkle_registry', actionClass: 'EXECUTE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 110,
    epistemicConfidence: 99,
    allowedDataSources: ['Canon XXIII Moral Principles', 'Merkle DAG Provenance', 'Ethics Review Registry'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'evidence-synthesizer-agent',
    name: 'Evidence Synthesis & Dossier Agent',
    role: 'evidence_synthesizer',
    version: 'v1.9-publisher',
    description: 'Public Transparency & Reporting. Compiles multi-agent outputs into verifiable evidence packages, executive briefings, and auditable public disclosures.',
    avatarIcon: 'FileText',
    model: 'gemini-3.5-flash',
    systemPrompt: 'You are the Evidence Synthesis Agent. You distill multi-agent findings into transparent, publication-ready dossiers with traceable citations.',
    tools: [
      'generate_report',
      'publish_result',
      'store_memory',
      'retrieve_memory',
      'update_task'
    ],
    permissions: [
      { action: 'compile_dossier', scope: 'reports', actionClass: 'ANALYZE', requiresHumanApproval: false },
      { action: 'publish_ledger', scope: 'rve_public_feed', actionClass: 'REQUEST_APPROVAL', requiresHumanApproval: true }
    ],
    status: 'idle',
    completedTasksCount: 76,
    epistemicConfidence: 97,
    allowedDataSources: ['Mission Memory Bank', 'Living Reality Sensor Feeds'],
    deploymentEnvironment: 'Cloud Run'
  }
];

export function getAgentById(id: string): AgentDefinition | undefined {
  return FLEET_AGENTS.find((a) => a.id === id);
}

export function getAgentByRole(role: string): AgentDefinition | undefined {
  return FLEET_AGENTS.find((a) => a.role === role);
}

export function getToolByName(name: string): AgentToolDefinition | undefined {
  return AGENT_TOOLS.find((t) => t.name === name);
}
