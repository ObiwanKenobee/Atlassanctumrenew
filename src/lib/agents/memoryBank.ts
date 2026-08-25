import { AgentMission, MissionMemoryItem, ApprovalRequest, EvidenceClaim } from './types';
import { logAuditEvent } from './agentGateway';

// Local storage key for persistent offline missions
const LOCAL_STORAGE_MISSIONS_KEY = 'atlas_agentic_missions_v3';
const LOCAL_STORAGE_MEMORIES_KEY = 'atlas_agentic_memories_v3';

// Initial pre-loaded demonstration mission
const SEED_MISSION: AgentMission = {
  id: 'mission-nairobi-mathare-01',
  title: 'Nairobi Mathare River Basin Bioregional Regeneration & Riparian Corridor',
  objective: 'Assess degraded riparian river basin in Mathare Valley, develop a 10-year agroforestry and flood mitigation strategy, model 8-capital returns, and formulate a community-owned solar cold storage infrastructure plan.',
  targetRegion: 'Nairobi Basin, Kenya (East Africa Bioregion)',
  allocatedCapital: '$4,250,000 Patient Capital',
  constraints: [
    'Zero displacement of informal settlement residents (FPIC mandatory)',
    'Community-owned data trust with open telemetry',
    'Max 18-month payback on modular solar food nodes'
  ],
  successCriteria: [
    '+45% riparian soil organic matter & flood buffer capacity',
    '2,400 youth livelihoods in precision agroforestry',
    'Cryptographic Merkle verification for all soil carbon baselines'
  ],
  phase: 'COMPLETED',
  progressPercent: 100,
  activeTaskIndex: 4,
  leadAgentId: 'atlas-lead-agent',
  participatingAgentIds: [
    'atlas-lead-agent',
    'bioregional-research-agent',
    'systems-analyst-agent',
    'strategic-planner-agent',
    'moral-verifier-agent',
    'evidence-synthesizer-agent'
  ],
  tasks: [
    {
      id: 'task-101',
      missionId: 'mission-nairobi-mathare-01',
      title: 'Ingest Satellite Telemetry & SWAT Hydrology Baselines',
      description: 'Extract Sentinel-2 NDVI vegetative health, SMAP soil moisture anomalies, and historical Mathare river peak runoff data.',
      assignedAgentId: 'bioregional-research-agent',
      assignedAgentRole: 'bioregional_researcher',
      status: 'completed',
      order: 1,
      dependencies: [],
      toolsUsed: ['search_atlas_knowledge', 'retrieve_project', 'store_memory'],
      inputs: { bioregion: 'Nairobi Mathare Basin', spatialResolution: '10m' },
      outputs: {
        baselineNdvi: 0.28,
        soilCompactionDeficit: '64% degraded',
        floodRiskFactor: 'High (10-yr return flood risk in monsoon months)'
      },
      confidenceScore: 98,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3300000).toISOString()
    },
    {
      id: 'task-102',
      missionId: 'mission-nairobi-mathare-01',
      title: 'Synthesize Historical Post-Mortems from Failure Ledger',
      description: 'Cross-reference FL-001 (Monoculture Afforestation) and FL-007 (Top-Down Water Concessions) to design antifragile buffer corridors.',
      assignedAgentId: 'strategic-planner-agent',
      assignedAgentRole: 'strategic_planner',
      status: 'completed',
      order: 2,
      dependencies: ['task-101'],
      toolsUsed: ['search_atlas_knowledge', 'create_task', 'store_memory'],
      inputs: { failureCategories: ['Ecosystem Degradation', 'Governance Misalignment'] },
      outputs: {
        mitigationStrategy: 'Native polyculture riparian planting with 14 indigenous tree species and local water council stewardship.'
      },
      confidenceScore: 96,
      startedAt: new Date(Date.now() - 3200000).toISOString(),
      completedAt: new Date(Date.now() - 2900000).toISOString()
    },
    {
      id: 'task-103',
      missionId: 'mission-nairobi-mathare-01',
      title: 'Simulate 8-Capital Dynamics & 10-Year Flourishing Trajectory',
      description: 'Run systems dynamic model measuring Natural Capital (+54%), Social Capital (+48%), and Human Capital (+62%) under $4.25M capital tranche.',
      assignedAgentId: 'systems-analyst-agent',
      assignedAgentRole: 'systems_analyst',
      status: 'completed',
      order: 3,
      dependencies: ['task-102'],
      toolsUsed: ['analyze_data', 'store_memory', 'request_approval'],
      inputs: { capitalAllocation: 4250000, scenario: 'Agroforestry & Modular Solar Food Nodes' },
      outputs: {
        projectedFlourishingDelta: '+58%',
        tenYearCarbonSequestration: '142,000 tCO2e',
        localEconomicMultiplier: '4.6x'
      },
      confidenceScore: 94,
      startedAt: new Date(Date.now() - 2800000).toISOString(),
      completedAt: new Date(Date.now() - 2400000).toISOString(),
      requiresApproval: true,
      approvalRequestId: 'appr-req-001'
    },
    {
      id: 'task-104',
      missionId: 'mission-nairobi-mathare-01',
      title: 'Canon XXIII Moral Arbiter & Cryptographic Verification',
      description: 'Verify human agency safeguards, non-extractive revenue caps (max 6.5%), and register Merkle root on the RVE ledger.',
      assignedAgentId: 'moral-verifier-agent',
      assignedAgentRole: 'moral_verifier',
      status: 'completed',
      order: 4,
      dependencies: ['task-103'],
      toolsUsed: ['verify_result', 'store_memory'],
      inputs: { verificationStandard: 'Canon XXIII Universal Design' },
      outputs: {
        moralScorecardComposite: 94,
        dignityVerification: 'Passed - 100% community equity governance',
        merkleRoot: '0x8f2d91bc47a3e8104192bce9f02938475a1837cb84910283e7465910293847ab'
      },
      confidenceScore: 99,
      startedAt: new Date(Date.now() - 2300000).toISOString(),
      completedAt: new Date(Date.now() - 1900000).toISOString()
    },
    {
      id: 'task-105',
      missionId: 'mission-nairobi-mathare-01',
      title: 'Publish Verifiable Evidence Package & Implementation Blueprint',
      description: 'Compile full multi-agent synthesis dossier with actionable 0-6mo, 6-18mo, and 18-36mo deployment schedule.',
      assignedAgentId: 'evidence-synthesizer-agent',
      assignedAgentRole: 'evidence_synthesizer',
      status: 'completed',
      order: 5,
      dependencies: ['task-104'],
      toolsUsed: ['generate_report', 'publish_result', 'store_memory'],
      inputs: { publishTarget: 'Atlas Regenerative Value Exchange' },
      outputs: {
        dossierTitle: 'Mathare Basin 2035 Bioregional Masterplan',
        publicationHash: '0x8f2d91bc47a3e8104192bce9f0293847'
      },
      confidenceScore: 97,
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date(Date.now() - 1200000).toISOString()
    }
  ],
  memories: [
    {
      id: 'mem-001',
      missionId: 'mission-nairobi-mathare-01',
      category: 'bioregional_baseline',
      key: 'mathare_river_hydrology',
      title: 'Mathare River Peak Discharge Baselines',
      content: { maxRunoffM3s: 145, seasonalRainPeak: 'April/November', siltationRatePpm: 2840 },
      tags: ['hydrology', 'mathare', 'runoff'],
      confidence: 98,
      sourceAgentId: 'bioregional-research-agent',
      createdAt: new Date(Date.now() - 3500000).toISOString(),
      updatedAt: new Date(Date.now() - 3500000).toISOString()
    },
    {
      id: 'mem-002',
      missionId: 'mission-nairobi-mathare-01',
      category: 'moral_constraint',
      key: 'fpic_mandatory_safeguard',
      title: 'Free Prior Informed Consent & Anti-Displacement Safeguard',
      content: { safeguardType: 'Zero Involuntary Relocation', communityReviewQuorum: '75%' },
      tags: ['ethics', 'dignity', 'fpic'],
      confidence: 99,
      sourceAgentId: 'moral-verifier-agent',
      createdAt: new Date(Date.now() - 2200000).toISOString(),
      updatedAt: new Date(Date.now() - 2200000).toISOString()
    }
  ],
  approvalRequests: [
    {
      id: 'appr-req-001',
      missionId: 'mission-nairobi-mathare-01',
      taskId: 'task-103',
      requestingAgentId: 'systems-analyst-agent',
      actionTitle: 'Authorize Tranche-1 Capital Allocation of $1,250,000 for Modular Solar Hydro-Pods',
      actionDescription: 'Deploy first batch of 25 LifePod distributed water purification and hydroponic nursery units to community co-ops.',
      riskLevel: 'high',
      requiredAccessLevel: 'steward',
      parameters: { amount: 1250000, recipient: 'Mathare Youth Green Co-operative' },
      requestedAt: new Date(Date.now() - 2600000).toISOString(),
      status: 'approved',
      decidedBy: 'Systems Architect / Council Steward',
      decidedAt: new Date(Date.now() - 2500000).toISOString(),
      decisionNotes: 'Approved with condition that monthly water telemetry streams directly to the Atlas Living Reality Matrix.'
    }
  ],
  evidenceClaims: [
    {
      id: 'claim-001',
      claim: 'Riparian buffer restoration reduces downstream siltation by 42.6% within 18 months.',
      evidenceSource: 'Sentinel-2 Spectroscopy & SWAT Basin Hydrology Model',
      sourceType: 'satellite_telemetry',
      confidenceScore: 96,
      provenanceHash: '0x3a9182cd98fe102938475a1837cb84910283e746',
      moralAlignmentScore: 95,
      verifiedAt: new Date(Date.now() - 1950000).toISOString(),
      verifiedByAgentId: 'moral-verifier-agent'
    }
  ],
  finalSynthesis: {
    summary: 'The Atlas Multi-Agent Fleet has successfully formulated an actionable, non-extractive masterplan for the Nairobi Mathare River Basin. By combining decentralized flood buffer polycultures with community-owned solar cold storage, the intervention achieves net-positive regeneration across all 8 capitals.',
    flourishingImpact: '+58% Composite Regional Flourishing Index with $19.5M 10-year catalytic economic output.',
    keyDeliverables: [
      { title: 'Bioregional Agroforestry GIS Corridor Map', linkOrContent: '14 native strata species across 32km river buffer' },
      { title: 'Modular Solar Food Node Capital Budget ($4.25M)', linkOrContent: 'Tranche distribution schedule with 4.6x local velocity' },
      { title: 'Canon XXIII Sovereign Community Charter', linkOrContent: 'Immutable FPIC and data governance agreement' }
    ],
    moralVerdict: 'STRONGLY_ALIGNED with Canon XXIII Human Dignity & Intergenerational Justice',
    recommendations: [
      'Begin phase-1 community nursery seedlings propagation immediately.',
      'Deploy 10 IoT water quality telemetry nodes along the Mathare-Nairobi confluence.',
      'Establish the Mathare Bioregional Trust on the RVE with 100% community voting keys.'
    ],
    cryptographicProofHash: '0x8f2d91bc47a3e8104192bce9f02938475a1837cb84910283e7465910293847ab'
  },
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 1200000).toISOString(),
  completedAt: new Date(Date.now() - 1200000).toISOString()
};

let inMemoryMissions: AgentMission[] = [SEED_MISSION];
const missionListeners = new Set<(missions: AgentMission[]) => void>();

function broadcastMissions() {
  missionListeners.forEach((fn) => fn([...inMemoryMissions]));
}

// Load saved missions from localStorage if available
function loadSavedMissions() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_MISSIONS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with seed if not present
          const hasSeed = parsed.some((m) => m.id === SEED_MISSION.id);
          inMemoryMissions = hasSeed ? parsed : [SEED_MISSION, ...parsed];
        }
      }
    } catch (e) {
      console.warn('Could not load missions from localStorage:', e);
    }
  }
}

function persistMissions() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(LOCAL_STORAGE_MISSIONS_KEY, JSON.stringify(inMemoryMissions));
    } catch (e) {
      console.warn('Could not persist missions to localStorage:', e);
    }
  }
}

// Initialize on module load
loadSavedMissions();

export function subscribeMissions(callback: (missions: AgentMission[]) => void) {
  missionListeners.add(callback);
  callback([...inMemoryMissions]);
  return () => {
    missionListeners.delete(callback);
  };
}

export function getAllMissions(): AgentMission[] {
  return [...inMemoryMissions];
}

export function getMissionById(id: string): AgentMission | undefined {
  return inMemoryMissions.find((m) => m.id === id);
}

export function saveMission(mission: AgentMission): AgentMission {
  const index = inMemoryMissions.findIndex((m) => m.id === mission.id);
  const updatedMission = {
    ...mission,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    inMemoryMissions[index] = updatedMission;
  } else {
    inMemoryMissions.unshift(updatedMission);
  }

  persistMissions();
  broadcastMissions();
  return updatedMission;
}

export function addMemoryToMission(memory: Omit<MissionMemoryItem, 'id' | 'createdAt' | 'updatedAt'>): MissionMemoryItem {
  const mission = getMissionById(memory.missionId);
  const newMemory: MissionMemoryItem = {
    ...memory,
    id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (mission) {
    mission.memories = [newMemory, ...(mission.memories || [])];
    saveMission(mission);
    logAuditEvent({
      missionId: memory.missionId,
      agentId: memory.sourceAgentId,
      agentRole: 'memory_bank',
      eventType: 'memory_write',
      summary: `Stored memory: "${memory.title}" (${memory.category})`,
      details: { key: memory.key, tags: memory.tags },
      modelArmorVerdict: 'CLEARED'
    });
  }

  return newMemory;
}

export function queryMissionMemories(missionId: string, query?: string, category?: string): MissionMemoryItem[] {
  const mission = getMissionById(missionId);
  if (!mission || !mission.memories) return [];

  let results = [...mission.memories];
  if (category) {
    results = results.filter((m) => m.category === category);
  }
  if (query && query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.key.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return results;
}
