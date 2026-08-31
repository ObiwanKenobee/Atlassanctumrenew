import { AgentDefinition, AgentToolDefinition } from '../../types';

export const AGENT_TOOLS: AgentToolDefinition[] = [
  {
    name: 'grafana_query_telemetry',
    description: 'Queries live infrastructure metrics, GPU thermals, VRAM pressure, and frame encoding latency from Grafana / Prometheus.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'PromQL / Metric query string, e.g. cluster=render-farm-us-central1' },
        timeRangeSeconds: { type: 'number', description: 'Time range in seconds (default: 300)' }
      },
      required: ['query']
    },
    requiredRole: ['observer_agent', 'mission_orchestrator'],
    riskLevel: 'low',
    actionClass: 'READ'
  },
  {
    name: 'grafana_search_logs',
    description: 'Searches Grafana Loki log aggregation streams for stack traces, memory leaks, I/O timeouts, or encoder packet corruption.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'LogQL query, e.g. {service="imf-encoder"} |= "error"' },
        limit: { type: 'number', description: 'Maximum log lines to return' }
      },
      required: ['query']
    },
    requiredRole: ['investigator_agent', 'mission_orchestrator'],
    riskLevel: 'low',
    actionClass: 'READ'
  },
  {
    name: 'grafana_find_incidents',
    description: 'Searches past Grafana Incident post-mortems and known failure signatures for historical mitigation analogies.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Failure pattern or symptom keywords' }
      },
      required: ['pattern']
    },
    requiredRole: ['investigator_agent', 'strategic_planner'],
    riskLevel: 'low',
    actionClass: 'READ'
  },
  {
    name: 'calculate_blast_radius',
    description: 'Computes quantifiable blast radius, affected media pipelines, theatrical lock slip risk, and financial downtime cost.',
    parameters: {
      type: 'object',
      properties: {
        anomalySeverity: { type: 'number', description: 'Severity score 0-100' },
        affectedComponents: { type: 'array', items: { type: 'string' } }
      },
      required: ['anomalySeverity']
    },
    requiredRole: ['risk_agent', 'systems_analyst'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'plan_mitigation',
    description: 'Synthesizes deterministic, multi-step failover and zero-frame-loss traffic rerouting intervention options.',
    parameters: {
      type: 'object',
      properties: {
        rootCause: { type: 'string' },
        urgency: { type: 'string', enum: ['P1_CRITICAL', 'P2_HIGH', 'P3_MODERATE'] }
      },
      required: ['rootCause', 'urgency']
    },
    requiredRole: ['director_agent', 'strategic_planner'],
    riskLevel: 'moderate',
    actionClass: 'RECOMMEND'
  },
  {
    name: 'execute_action',
    description: 'Dispatches an authorized real-time failover, node drain, or virtual production re-clocking workflow.',
    parameters: {
      type: 'object',
      properties: {
        actionType: { type: 'string' },
        parameters: { type: 'object' },
        authorizedBy: { type: 'string' }
      },
      required: ['actionType', 'authorizedBy']
    },
    requiredRole: ['director_agent', 'intervention_agent'],
    riskLevel: 'high',
    actionClass: 'EXECUTE'
  },
  {
    name: 'verify_state',
    description: 'Polls post-mitigation telemetry via Grafana to verify error rates dropped to 0.00% and nodes stabilized.',
    parameters: {
      type: 'object',
      properties: {
        expectedMetrics: { type: 'object' },
        sampleWindowSeconds: { type: 'number' }
      },
      required: ['expectedMetrics']
    },
    requiredRole: ['verifier_agent', 'moral_verifier'],
    riskLevel: 'low',
    actionClass: 'ANALYZE'
  },
  {
    name: 'anchor_incident_lesson',
    description: 'Permanently records the incident vector, evidence dossier, resolution proof, and anti-fragility lesson into memory.',
    parameters: {
      type: 'object',
      properties: {
        incidentId: { type: 'string' },
        lessonSummary: { type: 'string' },
        merkleProofHash: { type: 'string' }
      },
      required: ['incidentId', 'lessonSummary']
    },
    requiredRole: ['verifier_agent', 'evidence_synthesizer'],
    riskLevel: 'low',
    actionClass: 'EXECUTE'
  },
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
    id: 'observer-agent',
    name: 'Observer Agent',
    role: 'observer_agent',
    version: 'v4.0-blockbuster',
    description: 'Continuous Media & Cloud Infrastructure Sentinel. Polls Grafana telemetry, GPU thermal metrics, VRAM allocations, and video frame drop rates in real-time.',
    avatarIcon: 'Activity',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Observer Agent. You continuously ingest high-density Prometheus & Grafana telemetry across distributed render nodes, virtual production stages, and encoding pipelines to detect thermal or queue anomalies instantly.',
    tools: [
      'grafana_query_telemetry',
      'search_atlas_knowledge',
      'store_memory',
      'retrieve_memory'
    ],
    permissions: [
      { action: 'query_telemetry', scope: 'infrastructure_metrics', actionClass: 'READ', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 142,
    epistemicConfidence: 99,
    allowedDataSources: ['Grafana Cloud Prometheus', 'NVIDIA NVML Telemetry', 'Kubernetes Metrics Server', 'IMF Pipeline Bus'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'investigator-agent',
    name: 'Investigator Agent',
    role: 'investigator_agent',
    version: 'v4.0-blockbuster',
    description: 'Root Cause & Log Correlator. Searches Grafana Loki log aggregation streams, traces thread pool starvation, and cross-references historical post-mortem databases.',
    avatarIcon: 'Search',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Investigator Agent. You trace multi-service dependencies, isolate CUDA memory leaks and NVMe IOPS starvation in Loki logs, and match active failure patterns against 15 years of production post-mortems.',
    tools: [
      'grafana_search_logs',
      'grafana_find_incidents',
      'retrieve_memory',
      'store_memory'
    ],
    permissions: [
      { action: 'search_logs', scope: 'loki_log_streams', actionClass: 'READ', requiresHumanApproval: false },
      { action: 'query_incident_archive', scope: 'failure_ledger', actionClass: 'READ', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 128,
    epistemicConfidence: 98,
    allowedDataSources: ['Grafana Loki Streams', 'Cloud Trace Spans', 'Historical Failure Post-Mortems'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'risk-agent',
    name: 'Risk Agent',
    role: 'risk_agent',
    version: 'v4.0-blockbuster',
    description: 'Blast Radius & Schedule Hazard Evaluator. Calculates deadline slippage risk, financial exposure, downstream pipeline cascades, and reversibility bounds.',
    avatarIcon: 'ShieldAlert',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Risk Agent. You compute quantifiable blast radius, evaluate theatrical lock deadline breach probabilities, test safety invariants, and ensure no unverified action damages production masters.',
    tools: [
      'calculate_blast_radius',
      'analyze_data',
      'store_memory',
      'retrieve_memory'
    ],
    permissions: [
      { action: 'calculate_risk', scope: 'production_schedule', actionClass: 'ANALYZE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 95,
    epistemicConfidence: 97,
    allowedDataSources: ['Production Milestone Schedule', 'Theatrical Lock Timetables', 'Financial Cost Matrices'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'director-agent',
    name: 'Director Agent',
    role: 'director_agent',
    version: 'v4.0-blockbuster',
    description: 'Strategic Mitigation & Intervention Orchestrator. Synthesizes non-destructive failover plans, checks policy guardrails, and stages cryptographic human approval gates.',
    avatarIcon: 'Zap',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Director Agent. You formulate minimal-blast-radius interventions, ensure strict policy and human approval gating, and dispatch zero-frame-loss hot failover workflows.',
    tools: [
      'plan_mitigation',
      'execute_action',
      'request_approval',
      'store_memory'
    ],
    permissions: [
      { action: 'plan_intervention', scope: 'render_pipeline', actionClass: 'RECOMMEND', requiresHumanApproval: false },
      { action: 'execute_failover', scope: 'cloud_cluster_actuation', actionClass: 'EXECUTE', requiresHumanApproval: true }
    ],
    status: 'idle',
    completedTasksCount: 84,
    epistemicConfidence: 96,
    allowedDataSources: ['GKE Node Pools', 'Candidate Intervention Catalog', 'Dual-Key Approval Gateway'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
  {
    id: 'verifier-agent',
    name: 'Verifier Agent',
    role: 'verifier_agent',
    version: 'v4.0-blockbuster',
    description: 'Closed-Loop Verification & Learning Engine. Confirms post-mitigation telemetry recovery (0.00% frame drops) and permanently anchors anti-fragile incident memories.',
    avatarIcon: 'CheckCircle2',
    model: 'gemini-3.7-flash',
    systemPrompt: 'You are the Verifier Agent. You prove state recovery using independent post-actuation Grafana telemetry samples, verify checksum integrity of encoded masters, and commit lesson vectors to memory.',
    tools: [
      'verify_state',
      'anchor_incident_lesson',
      'store_memory',
      'publish_result'
    ],
    permissions: [
      { action: 'verify_state', scope: 'telemetry_verification', actionClass: 'ANALYZE', requiresHumanApproval: false },
      { action: 'anchor_lesson', scope: 'failure_memory_bank', actionClass: 'EXECUTE', requiresHumanApproval: false }
    ],
    status: 'idle',
    completedTasksCount: 112,
    epistemicConfidence: 99,
    allowedDataSources: ['Post-Mitigation Telemetry', 'IMF MXF Checksum Verifier', 'Permanent Memory Bank'],
    deploymentEnvironment: 'Cloud Run / Vertex ADK'
  },
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
