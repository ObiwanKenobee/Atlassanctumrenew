import { RoadmapPhase, RoadmapMilestone } from '../types';

export const ATLAS_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-01-foundation',
    phaseNumber: '01',
    title: 'Civilization OS & Foundation',
    subtitle: 'Core Monorepo, Epistemic Identity & Offline-First Resilience',
    timeline: 'Q1 2025 – Q3 2025',
    status: 'COMPLETED',
    progressPercentage: 100,
    iconName: 'Layers',
    description: 'Establish the core TypeScript full-stack framework, responsive Sanctum UI design system, multi-role RBAC, Firestore security protocols, service worker offline persistence, and automated navigation prefetch routing.',
    primaryFocus: [
      'Monorepo architecture with strict TypeScript contracts',
      'High-contrast Sanctum theme & Commandment-aligned typography',
      'Role-based access control (Public, Contributor, Researcher, Steward, Admin)',
      'Service worker & IndexedDB offline epistemic resilience',
      'Automated navigation prefetch controller with idle callbacks',
      'Firestore Cloud DB synchronization with offline fallback'
    ],
    keyArchitectureLayers: ['REALITY', 'FOUNDATION', 'GOVERNANCE'],
    governanceThreshold: '100% Passed Epistemic Audit (Commandment IX Compliant)',
    verifiedArtifactCount: 8,
    totalDeliverablesCount: 8,
    completedDeliverablesCount: 8,
    milestones: [
      {
        id: 'm1-1',
        phaseId: 'phase-01-foundation',
        title: 'Core Monorepo & TypeScript Engineering Framework',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q1 2025',
        description: 'Set up Vite, TypeScript strict mode, Express backend server with lazy-init SDKs, and modular file architecture.',
        architecturalLayer: 'FOUNDATION',
        commandmentAlignment: 'Commandment I (Absolute Grounding)',
        telemetryMetric: { label: 'Type Safety Score', value: '100%' },
        deliverables: [
          {
            id: 'd1-1-1',
            name: 'Vite + React 18 + Express full-stack architecture',
            completed: true,
            verificationType: 'CODE_AUDIT',
            verificationDetails: 'Verified Express entry point with Vite middleware and CommonJS bundler',
            linkedDoc: '/README.md#technology-stack',
            completionDate: '2025-02-15',
            hashProof: '0x9a8f7c2b'
          },
          {
            id: 'd1-1-2',
            name: 'Comprehensive global data contracts in src/types.ts',
            completed: true,
            verificationType: 'CODE_AUDIT',
            verificationDetails: 'Over 1,300 lines of shared interfaces spanning biophysical telemetry, causal models, and grant states',
            linkedDoc: '/src/types.ts',
            completionDate: '2025-03-01',
            hashProof: '0x4e21a08b'
          }
        ]
      },
      {
        id: 'm1-2',
        phaseId: 'phase-01-foundation',
        title: 'Sanctum Design System & Epistemic Navigation Mesh',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q2 2025',
        description: 'Implement high-contrast typography, mega menus, live ticker metrics, and global modal hubs.',
        architecturalLayer: 'FOUNDATION',
        commandmentAlignment: 'Commandment X (Radical Simplicity)',
        telemetryMetric: { label: 'Interaction Latency', value: '< 16ms' },
        deliverables: [
          {
            id: 'd1-2-1',
            name: 'Interactive multi-tiered mega menu & responsive drawer',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'home',
            completionDate: '2025-04-10',
            hashProof: '0x12bb56fa'
          },
          {
            id: 'd1-2-2',
            name: 'Automated Navigation Prefetch Controller & Idle Loader',
            completed: true,
            verificationType: 'CODE_AUDIT',
            verificationDetails: 'Dynamic transition affinity matrix preloading views on network idle',
            linkedView: 'ai-engineering',
            completionDate: '2025-05-20',
            hashProof: '0x88f01ac4'
          }
        ]
      },
      {
        id: 'm1-3',
        phaseId: 'phase-01-foundation',
        title: 'Offline Resilience & Epistemic Cloud Sync Engine',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q3 2025',
        description: 'Provide zero-loss offline operation via Service Worker, IndexedDB queueing, and Firestore synchronization.',
        architecturalLayer: 'FOUNDATION',
        commandmentAlignment: 'Commandment IX (Epistemic Resilience)',
        telemetryMetric: { label: 'Offline Availability', value: '100%' },
        deliverables: [
          {
            id: 'd1-3-1',
            name: 'Service Worker offline asset caching & background sync',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'home',
            completionDate: '2025-07-12',
            hashProof: '0x7c992a10'
          },
          {
            id: 'd1-3-2',
            name: 'Role-based Authentication & Firestore Covenants',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'about',
            completionDate: '2025-08-30',
            hashProof: '0x55d38e21'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-02-intelligence',
    phaseNumber: '02',
    title: 'Epistemic Intelligence & Multi-Agent Fleet',
    subtitle: 'Gemini 3.7 Agent Fleet, Reality Engine Telemetry & Causal Twins',
    timeline: 'Q3 2025 – Q1 2026',
    status: 'COMPLETED',
    progressPercentage: 100,
    iconName: 'Cpu',
    description: 'Deploy autonomous Gemini 3.7 agent fleet (Hydra, Gaia, Chronos, Sophia, Aegis), real-time IoT reality telemetry with physical QR placard verification, 10 Commandments Moral Arbiter, and Systems Dynamics Stock-Flow ODE differential equations.',
    primaryFocus: [
      'Multi-agent autonomous fleet coordination with task routing & heartbeat health',
      'Ground-truth IoT sensory mesh & QR hardware verification placards',
      'Moral Intelligence & 10 Commandments epistemic arbiter',
      'Systems Dynamics Studio with Stock-Flow differential simulations',
      'Bioregional causal digital twins & counterfactual scenario modeling',
      'AI Engineering Workbench with hallucination auditing & citation grounding'
    ],
    keyArchitectureLayers: ['EVIDENCE', 'INTELLIGENCE', 'ETHICS'],
    governanceThreshold: 'Autonomous Multi-Agent Consensus Protocol Verified',
    verifiedArtifactCount: 10,
    totalDeliverablesCount: 10,
    completedDeliverablesCount: 10,
    milestones: [
      {
        id: 'm2-1',
        phaseId: 'phase-02-intelligence',
        title: 'Autonomous Gemini 3.7 Agent Fleet Orchestration',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q3 2025',
        description: 'Deploy multi-agent system coordinating research, biophysical verification, ethical audits, and capital routing.',
        architecturalLayer: 'INTELLIGENCE',
        commandmentAlignment: 'Commandment IV (Non-Sovereign AI Decision Support)',
        telemetryMetric: { label: 'Agent Fleet Uptime', value: '99.98%' },
        deliverables: [
          {
            id: 'd2-1-1',
            name: 'Agent Mission Control dashboard with real-time heartbeat',
            completed: true,
            verificationType: 'TELEMETRY_STREAM',
            verificationDetails: '6 specialized agents orchestrated with memory bank synchronization',
            linkedView: 'agent-mission-control',
            completionDate: '2025-09-15',
            hashProof: '0xaa1298ff'
          },
          {
            id: 'd2-1-2',
            name: 'AI Engineering Workbench & Hallucination Auditor',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'ai-engineering',
            completionDate: '2025-10-02',
            hashProof: '0x3344bbee'
          }
        ]
      },
      {
        id: 'm2-2',
        phaseId: 'phase-02-intelligence',
        title: 'Reality Engine Telemetry & Physical Asset QR Verification',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q4 2025',
        description: 'Ingest live environmental sensor streams (soil moisture, water pH, canopy NDVI) with physical QR placards.',
        architecturalLayer: 'EVIDENCE',
        commandmentAlignment: 'Commandment I (Truth Before Claims)',
        telemetryMetric: { label: 'Telemetry Ingestion Rate', value: '450 streams/s' },
        deliverables: [
          {
            id: 'd2-2-1',
            name: 'Reality Engine with live IoT time-series charts',
            completed: true,
            verificationType: 'TELEMETRY_STREAM',
            linkedView: 'reality-engine',
            completionDate: '2025-11-20',
            hashProof: '0x77ee0102'
          },
          {
            id: 'd2-2-2',
            name: 'Cryptographic Physical Asset QR Placard Generator & Scanner',
            completed: true,
            verificationType: 'HARDWARE_PILOT',
            linkedView: 'reality-engine',
            completionDate: '2025-12-05',
            hashProof: '0xbb441099'
          }
        ]
      },
      {
        id: 'm2-3',
        phaseId: 'phase-02-intelligence',
        title: 'Moral Intelligence & Systems Dynamics Studio',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q1 2026',
        description: 'Execute Stock-Flow ODE differential equations and algorithmic moral evaluations against the 10 Commandments.',
        architecturalLayer: 'INTELLIGENCE',
        commandmentAlignment: 'Commandment II (Dignity & Equity)',
        telemetryMetric: { label: 'Simulated Scenarios', value: '1,420+' },
        deliverables: [
          {
            id: 'd2-3-1',
            name: 'Systems Dynamics Studio with Runge-Kutta numerical solver',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'system-model-studio',
            completionDate: '2026-01-18',
            hashProof: '0x55aa6677'
          },
          {
            id: 'd2-3-2',
            name: 'Moral Arbiter & 10 Commandments Ethical Dilemma Simulator',
            completed: true,
            verificationType: 'PEER_REVIEW',
            linkedView: 'moral-arbiter',
            completionDate: '2026-02-28',
            hashProof: '0x9922cc11'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-03-coordination',
    phaseNumber: '03',
    title: 'Coordination, Opportunity Graph & Project OS',
    subtitle: '12-Stage Problem Dossiers, Multi-Stakeholder Decision Room & Capital Engine',
    timeline: 'Q4 2025 – Q2 2026',
    status: 'COMPLETED',
    progressPercentage: 100,
    iconName: 'Coins',
    description: 'Integrate evidence-backed opportunity dossiers, human-in-the-loop multi-criteria decision deliberator, $380M catalytic capital engine across 7 forms of capital, and Bioregional Project OS with milestone escrow disbursements.',
    primaryFocus: [
      '12-Stage Opportunity Intelligence Dossiers & AI matchmaking',
      'The Decision Room with multi-stakeholder trade-off scoring & vetoes',
      '$380M Catalytic Capital Allocation Engine across 7 forms of value',
      'Bioregional Project OS with automated milestone funding tranches',
      'Synergy Network Coordination Graph with topological relationship nodes',
      'Community Contribution Pathways (Give, Build, Back, Partner, Launch)'
    ],
    keyArchitectureLayers: ['COORDINATION', 'CAPITAL', 'PROJECTS'],
    governanceThreshold: 'Multi-Stakeholder Consensus Quorum Active',
    verifiedArtifactCount: 8,
    totalDeliverablesCount: 8,
    completedDeliverablesCount: 8,
    milestones: [
      {
        id: 'm3-1',
        phaseId: 'phase-03-coordination',
        title: 'Opportunity Intelligence & Matchmaking Topology',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q4 2025',
        description: 'Structured 12-stage problem dossiers linking field needs, empirical evidence, and capital matching.',
        architecturalLayer: 'COORDINATION',
        commandmentAlignment: 'Commandment VI (Local Sovereign Equity)',
        telemetryMetric: { label: 'Active Opportunities', value: '142 dossiers' },
        deliverables: [
          {
            id: 'd3-1-1',
            name: 'Opportunity Intelligence dossiers with 7 capital impact vectors',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'opportunity-intelligence',
            completionDate: '2025-11-10',
            hashProof: '0x11223344'
          },
          {
            id: 'd3-1-2',
            name: 'Interactive Opportunity Matchmaker with cosine affinity scoring',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'opportunity-matchmaker',
            completionDate: '2025-12-14',
            hashProof: '0x55667788'
          }
        ]
      },
      {
        id: 'm3-2',
        phaseId: 'phase-03-coordination',
        title: 'The Decision Room & Multi-Stakeholder Deliberation',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q1 2026',
        description: 'Provide an auditable human-in-the-loop deliberation workspace balancing ethical, ecological, and economic trade-offs.',
        architecturalLayer: 'COORDINATION',
        commandmentAlignment: 'Commandment II (Universal Human Dignity)',
        telemetryMetric: { label: 'Deliberation Consensus Rate', value: '96.4%' },
        deliverables: [
          {
            id: 'd3-2-1',
            name: 'Decision Room with radar sensitivity sliders & elder vetoes',
            completed: true,
            verificationType: 'PEER_REVIEW',
            linkedView: 'decision-room',
            completionDate: '2026-01-25',
            hashProof: '0x99aabbcc'
          },
          {
            id: 'd3-2-2',
            name: 'Opportunity Network Graph D3 visualizer',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'opportunity-graph',
            completionDate: '2026-02-10',
            hashProof: '0xddeeff00'
          }
        ]
      },
      {
        id: 'm3-3',
        phaseId: 'phase-03-coordination',
        title: 'Capital Allocation Engine & Project OS Tranche Release',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q2 2026',
        description: 'Coordinate capital across 7 forms of value with escrow disbursements triggered by verified milestone proofs.',
        architecturalLayer: 'CAPITAL',
        commandmentAlignment: 'Commandment VII (Zero Speculative Extraction)',
        telemetryMetric: { label: 'Capital Deployed', value: '$380M Pool' },
        deliverables: [
          {
            id: 'd3-3-1',
            name: 'Capital Allocation Engine supporting 7 capital categories',
            completed: true,
            verificationType: 'SMART_CONTRACT',
            linkedView: 'capital-engine',
            completionDate: '2026-03-20',
            hashProof: '0x12345678'
          },
          {
            id: 'd3-3-2',
            name: 'Bioregional Project OS with milestone proof validators',
            completed: true,
            verificationType: 'SMART_CONTRACT',
            linkedView: 'project-os',
            completionDate: '2026-04-15',
            hashProof: '0x87654321'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-04-verification',
    phaseNumber: '04',
    title: 'Cryptographic Verification & Failure Ledgers',
    subtitle: 'Evidence Merkle DAG, Radical Learning Post-Mortems & Planetary Flourishing Index',
    timeline: 'Q1 2026 – Q3 2026',
    status: 'COMPLETED',
    progressPercentage: 100,
    iconName: 'ShieldCheck',
    description: 'Implement immutable Evidence Ledger with SHA-256 Merkle root validation, transparent Failure & Post-Mortem Ledger, dynamic contributor Stewardship Reputation XP progression, 6-dimensional Planetary Flourishing Index, and Vercel CI/CD edge error dispatching.',
    primaryFocus: [
      'Evidence Ledger with cryptographic sensor hashes & Merkle DAG roots',
      'Radical learning Failure Ledger with peer-reviewed post-mortems',
      'Evidence DAG Dependency Graph with causal chain validation',
      'Stewardship Reputation Engine with XP progression tiers & badges',
      'Planetary Flourishing Index with longitudinal multi-capital metrics',
      'Vercel Edge CI/CD build failure webhooks & mission alert broadcasts'
    ],
    keyArchitectureLayers: ['EVIDENCE', 'MEASUREMENT', 'LEARNING'],
    governanceThreshold: 'Zero-Greenwashing Cryptographic Validation Standard',
    verifiedArtifactCount: 8,
    totalDeliverablesCount: 8,
    completedDeliverablesCount: 8,
    milestones: [
      {
        id: 'm4-1',
        phaseId: 'phase-04-verification',
        title: 'Evidence Ledger & Cryptographic Merkle DAG',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q1 2026',
        description: 'Anchor environmental claims, sensor readings, and grant payouts into verifiable Merkle tree proof structures.',
        architecturalLayer: 'EVIDENCE',
        commandmentAlignment: 'Commandment I (Absolute Epistemic Provenance)',
        telemetryMetric: { label: 'Verified Proofs', value: '48,920 roots' },
        deliverables: [
          {
            id: 'd4-1-1',
            name: 'Evidence Ledger with SHA-256 Merkle verification explorer',
            completed: true,
            verificationType: 'MERKLE_ROOT',
            linkedView: 'evidence-ledger',
            completionDate: '2026-02-05',
            hashProof: '0x9900aabb'
          },
          {
            id: 'd4-1-2',
            name: 'Topological Evidence DAG Graph for scientific validation',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'evidence-mapping',
            completionDate: '2026-03-12',
            hashProof: '0xccddeeff'
          }
        ]
      },
      {
        id: 'm4-2',
        phaseId: 'phase-04-verification',
        title: 'Failure & Post-Mortem Ledger for Compounding Knowledge',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q2 2026',
        description: 'Document and publish verified project failures, ecological anomalies, and governance missteps.',
        architecturalLayer: 'LEARNING',
        commandmentAlignment: 'Commandment VIII (Radical Learning & Failure Auditing)',
        telemetryMetric: { label: 'Published Post-Mortems', value: '28 cases' },
        deliverables: [
          {
            id: 'd4-2-1',
            name: 'Failure Ledger with root cause taxonomy and peer reviews',
            completed: true,
            verificationType: 'PEER_REVIEW',
            linkedView: 'failure-ledger',
            completionDate: '2026-04-02',
            hashProof: '0x44556677'
          },
          {
            id: 'd4-2-2',
            name: 'Stewardship Reputation Engine with 5-tier progression XP',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'stewardship-reputation',
            completionDate: '2026-05-18',
            hashProof: '0x88990011'
          }
        ]
      },
      {
        id: 'm4-3',
        phaseId: 'phase-04-verification',
        title: 'Planetary Flourishing Index & Edge Alert Dispatcher',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q3 2026',
        description: 'Synthesize 6-dimensional flourishing scores and dispatch real-time build & telemetry alerts across edge servers.',
        architecturalLayer: 'MEASUREMENT',
        commandmentAlignment: 'Commandment V (Holistic Planetary Flourishing)',
        telemetryMetric: { label: 'PFI Global Score', value: '86.4 / 100' },
        deliverables: [
          {
            id: 'd4-3-1',
            name: 'Planetary Flourishing Index with longitudinal radar visualizers',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'flourishing-index',
            completionDate: '2026-06-25',
            hashProof: '0x22334455'
          },
          {
            id: 'd4-3-2',
            name: 'Vercel Edge CI/CD Webhook & Real-time Mission Alert Stream',
            completed: true,
            verificationType: 'EDGE_ENDPOINT',
            linkedView: 'ai-engineering',
            completionDate: '2026-08-20',
            hashProof: '0x66778899'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-05-physical-integration',
    phaseNumber: '05',
    title: 'Physical Integration & Bioregional Habitats',
    subtitle: 'LifeHouse Modular Hubs, Ecological Industrial OS & Bioregional Field Labs',
    timeline: 'Q2 2026 – Q4 2026',
    status: 'ACTIVE_EXECUTION',
    progressPercentage: 88,
    iconName: 'Factory',
    description: 'Bridge software intelligence into physical infrastructure through LifeHouse regenerative habitats, LifePod distributed food infrastructure, Industrial OS circular material flows, and active Bioregional Field Labs (Kibera, Mathare, Great Rift Valley).',
    primaryFocus: [
      'LifeHouse modular habitat system with solar microgrid & rainwater harvesting',
      'LifePod distributed hydroponic/aeroponic food units',
      'Ecological Industrial OS for circular manufacturing & waste-to-resource flows',
      'Bioregional Field Labs with in-situ sensor stations and local elder participation',
      'Mobile Field Note Audio Recorder with offline capture & automated transcription',
      'Hardware IoT telemetry gateways connecting physical sensors to cryptographic ledgers'
    ],
    keyArchitectureLayers: ['PHYSICAL_INTEGRATION', 'INFRASTRUCTURE', 'REGENERATION'],
    governanceThreshold: 'Physical Field Lab Pilot Verified with Community Elder Quorum',
    verifiedArtifactCount: 7,
    totalDeliverablesCount: 8,
    completedDeliverablesCount: 7,
    milestones: [
      {
        id: 'm5-1',
        phaseId: 'phase-05-physical-integration',
        title: 'LifeHouse Modular Community Habitats & LifePod',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q2 2026',
        description: 'Deploy blueprints and operating models for regenerative, self-sufficient modular community living units.',
        architecturalLayer: 'PHYSICAL_INTEGRATION',
        commandmentAlignment: 'Commandment II (Dignity of Living Habitat)',
        telemetryMetric: { label: 'LifeHouse Pilot Units', value: '12 active' },
        deliverables: [
          {
            id: 'd5-1-1',
            name: 'LifeHouse Community Hub operating console & energy monitoring',
            completed: true,
            verificationType: 'HARDWARE_PILOT',
            linkedView: 'lifehouse',
            completionDate: '2026-05-10',
            hashProof: '0x11002233'
          },
          {
            id: 'd5-1-2',
            name: 'LifePod distributed food production telemetry & yields',
            completed: true,
            verificationType: 'HARDWARE_PILOT',
            linkedView: 'lifehouse',
            completionDate: '2026-06-01',
            hashProof: '0x44332211'
          }
        ]
      },
      {
        id: 'm5-2',
        phaseId: 'phase-05-physical-integration',
        title: 'Ecological Industrial OS & Circular Value Flows',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q3 2026',
        description: 'Track industrial material lifecycles, circular fabrication, and waste-to-resource transformation streams.',
        architecturalLayer: 'PHYSICAL_INTEGRATION',
        commandmentAlignment: 'Commandment VII (Circular Material Stewardship)',
        telemetryMetric: { label: 'Circular Material Diverted', value: '42,800 tons' },
        deliverables: [
          {
            id: 'd5-2-1',
            name: 'Industrial OS circular flow matrix and scrap exchange',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'industrial',
            completionDate: '2026-07-15',
            hashProof: '0x55661122'
          },
          {
            id: 'd5-2-2',
            name: 'Regenerative Marketplace with verified eco-credits & seed libraries',
            completed: true,
            verificationType: 'SMART_CONTRACT',
            linkedView: 'marketplace',
            completionDate: '2026-08-01',
            hashProof: '0x77889900'
          }
        ]
      },
      {
        id: 'm5-3',
        phaseId: 'phase-05-physical-integration',
        title: 'Bioregional Field Labs & In-Situ Audio Telemetry',
        status: 'IN_PROGRESS',
        completionPercentage: 80,
        targetQuarter: 'Q4 2026',
        description: 'Deploy living regeneration labs in Nairobi (Kibera, Mathare) and Rift Valley with mobile audio telemetry.',
        architecturalLayer: 'PHYSICAL_INTEGRATION',
        commandmentAlignment: 'Commandment VI (Local Community Participation)',
        telemetryMetric: { label: 'Active Field Stations', value: '6 Stations' },
        deliverables: [
          {
            id: 'd5-3-1',
            name: 'Bioregional Field Labs console with sensor health',
            completed: true,
            verificationType: 'HARDWARE_PILOT',
            linkedView: 'field-labs',
            completionDate: '2026-08-15',
            hashProof: '0x99aa1122'
          },
          {
            id: 'd5-3-2',
            name: 'Satellite-to-LoRaWAN mesh bridge for deep watershed monitoring',
            completed: false,
            verificationType: 'HARDWARE_PILOT',
            linkedDoc: '/docs/architecture/satellite-mesh.md'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-06-ecosystem',
    phaseNumber: '06',
    title: 'Open Ecosystem, SDK & Sovereign Commons',
    subtitle: 'Atlas Governance SDK, Academy Commons & Universal Epistemic Search',
    timeline: 'Q3 2026 – Q1 2027',
    status: 'ACTIVE_EXECUTION',
    progressPercentage: 82,
    iconName: 'Code2',
    description: 'Empower global developers and researchers through the Atlas Governance SDK, live interactive SDK Playground, Academy Commons open research repository, Universal Epistemic Search (Cmd+K), and cross-chain settlement integrations.',
    primaryFocus: [
      'Atlas Governance SDK with programmatic compliance APIs and priority floors',
      'Interactive Developer SDK Playground with live code generators',
      'Academy Commons & peer-reviewed open methodology repository',
      'Global Epistemic Search & Universal Command Center modal',
      'Standardized REST APIs & Webhook integrations for external ecosystems',
      'Decentralized identity & verifiable credentials for field stewards'
    ],
    keyArchitectureLayers: ['ECOSYSTEM', 'SOVEREIGN_COMMONS'],
    governanceThreshold: 'Open Source SDK & Public API Schema Published',
    verifiedArtifactCount: 6,
    totalDeliverablesCount: 7,
    completedDeliverablesCount: 6,
    milestones: [
      {
        id: 'm6-1',
        phaseId: 'phase-06-ecosystem',
        title: 'Atlas Governance SDK & Developer Portal',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q3 2026',
        description: 'Provide developers with TypeScript bindings, Python SDKs, and interactive playgrounds to build on Atlas.',
        architecturalLayer: 'ECOSYSTEM',
        commandmentAlignment: 'Commandment III (Open Interoperability)',
        telemetryMetric: { label: 'SDK Downloads', value: '18.4k' },
        deliverables: [
          {
            id: 'd6-1-1',
            name: 'Interactive Governance SDK Playground with TypeScript transpiler',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'developers',
            completionDate: '2026-07-20',
            hashProof: '0x12ab34cd'
          },
          {
            id: 'd6-1-2',
            name: 'REST API & OpenAPI 3.1 schema specification',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'developers',
            completionDate: '2026-08-05',
            hashProof: '0x56ef78ab'
          }
        ]
      },
      {
        id: 'm6-2',
        phaseId: 'phase-06-ecosystem',
        title: 'Academy Commons & Universal Epistemic Search',
        status: 'COMPLETED',
        completionPercentage: 100,
        targetQuarter: 'Q3 2026',
        description: 'Provide an open research repository, course materials, and universal Cmd+K modal across all civilization domains.',
        architecturalLayer: 'SOVEREIGN_COMMONS',
        commandmentAlignment: 'Commandment X (Democratized Knowledge Commons)',
        telemetryMetric: { label: 'Research Papers Hosted', value: '340+' },
        deliverables: [
          {
            id: 'd6-2-1',
            name: 'Academy Commons knowledge hub & curriculum catalog',
            completed: true,
            verificationType: 'PEER_REVIEW',
            linkedView: 'academy',
            completionDate: '2026-08-12',
            hashProof: '0x9900ff11'
          },
          {
            id: 'd6-2-2',
            name: 'Global Epistemic Search (Cmd+K) with fuzzy match ranking',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'home',
            completionDate: '2026-08-25',
            hashProof: '0x22446688'
          }
        ]
      },
      {
        id: 'm6-3',
        phaseId: 'phase-06-ecosystem',
        title: 'Cross-Border Carbon & Biodiversity Protocol Verification',
        status: 'IN_PROGRESS',
        completionPercentage: 65,
        targetQuarter: 'Q1 2027',
        description: 'Connect Atlas verification proofs to international ecological registries and cross-chain settlement networks.',
        architecturalLayer: 'ECOSYSTEM',
        commandmentAlignment: 'Commandment VII (Auditable Ecological Settlement)',
        telemetryMetric: { label: 'Cross-Chain Nodes', value: '4 testnets' },
        deliverables: [
          {
            id: 'd6-3-1',
            name: 'Hedera Guardian & Polygon ID verifiable credential adapter',
            completed: true,
            verificationType: 'SMART_CONTRACT',
            linkedView: 'developers',
            completionDate: '2026-08-26',
            hashProof: '0x33557799'
          },
          {
            id: 'd6-3-2',
            name: 'Universal Bioregional Credit Registry ISO standard alignment',
            completed: false,
            verificationType: 'PEER_REVIEW',
            linkedDoc: '/docs/governance/iso-alignment.md'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-07-global-federation',
    phaseNumber: '07',
    title: 'Global Autonomous Federation & Horizon',
    subtitle: 'Intergenerational Bioregional Quorums & Autonomous Planetary Mesh',
    timeline: 'Q2 2027 – 2030+',
    status: 'RESEARCH',
    progressPercentage: 35,
    iconName: 'Globe2',
    description: 'Expand Atlas Sanctum into a global autonomous federation of bioregional commons, governed by on-chain elder quorums, satellite-direct biophysical telemetry, and 50-year intergenerational flourishing endowment trusts.',
    primaryFocus: [
      'Bioregional Elder Council on-chain cryptographic quorum governance',
      'Satellite-direct LEO biophysical sensory mesh with Zero-Knowledge verification',
      'Intergenerational Flourishing Endowment Trusts with perpetual capital locking',
      '50-year climate trajectory equilibrium modeling & planetary boundary safeguards',
      'Global federation of decentralized autonomous bioregions (DABs)',
      'Universal basic ecological dividend (UBED) smart contract distributions'
    ],
    keyArchitectureLayers: ['SOVEREIGN_COMMONS', 'REGENERATION', 'GOVERNANCE'],
    governanceThreshold: 'Intergenerational Covenant Quorum Ratified',
    verifiedArtifactCount: 2,
    totalDeliverablesCount: 6,
    completedDeliverablesCount: 2,
    milestones: [
      {
        id: 'm7-1',
        phaseId: 'phase-07-global-federation',
        title: 'Bioregional Elder Council Cryptographic Quorum',
        status: 'IN_PROGRESS',
        completionPercentage: 50,
        targetQuarter: 'Q2 2027',
        description: 'Multi-signature sovereign governance combining indigenous ecological knowledge with cryptographic veto authority.',
        architecturalLayer: 'GOVERNANCE',
        commandmentAlignment: 'Commandment VI (Intergenerational Wisdom)',
        telemetryMetric: { label: 'Council Nodes', value: '14 Bioregions' },
        deliverables: [
          {
            id: 'd7-1-1',
            name: 'Multi-signature Elder Veto Protocol specification',
            completed: true,
            verificationType: 'PEER_REVIEW',
            linkedView: 'about',
            completionDate: '2026-08-20',
            hashProof: '0xfa880011'
          },
          {
            id: 'd7-1-2',
            name: 'On-chain decentralized biometric identity proofing without privacy leak',
            completed: false,
            verificationType: 'SMART_CONTRACT',
            linkedDoc: '/docs/architecture/zkp-elder-governance.md'
          }
        ]
      },
      {
        id: 'm7-2',
        phaseId: 'phase-07-global-federation',
        title: 'Planetary Autonomous Bio-Sensor Mesh (Satellite-Direct)',
        status: 'PLANNED',
        completionPercentage: 25,
        targetQuarter: 'Q4 2027',
        description: 'Deploy direct LEO satellite constellation integrations receiving low-power telemetry from remote wilderness sensors.',
        architecturalLayer: 'PHYSICAL_INTEGRATION',
        commandmentAlignment: 'Commandment I (Planetary Sensory Truth)',
        telemetryMetric: { label: 'Global Coverage', value: 'Target 100%' },
        deliverables: [
          {
            id: 'd7-2-1',
            name: 'LEO satellite low-bandwidth telemetry protocol definition',
            completed: true,
            verificationType: 'CODE_AUDIT',
            linkedView: 'living-reality',
            completionDate: '2026-08-22',
            hashProof: '0x9911ee22'
          },
          {
            id: 'd7-2-2',
            name: 'Edge sensor autonomous cryptographic key rotation & solar harvesting',
            completed: false,
            verificationType: 'HARDWARE_PILOT',
            linkedDoc: '/docs/architecture/solar-edge-sensors.md'
          }
        ]
      },
      {
        id: 'm7-3',
        phaseId: 'phase-07-global-federation',
        title: 'Intergenerational Flourishing Endowment Trusts',
        status: 'HORIZON',
        completionPercentage: 15,
        targetQuarter: '2028 – 2030',
        description: 'Perpetual endowment funds locked for 50-year cycles, releasing capital exclusively to verified restoration benchmarks.',
        architecturalLayer: 'CAPITAL',
        commandmentAlignment: 'Commandment VII (50-Year Multi-Generational Stewardship)',
        telemetryMetric: { label: 'Horizon Fund Target', value: '$2.5 Billion' },
        deliverables: [
          {
            id: 'd7-3-1',
            name: 'Time-locked smart contract legal charter & escrow mechanisms',
            completed: false,
            verificationType: 'SMART_CONTRACT',
            linkedDoc: '/docs/governance/intergenerational-trusts.md'
          },
          {
            id: 'd7-3-2',
            name: 'Universal basic ecological dividend distribution simulator',
            completed: false,
            verificationType: 'CODE_AUDIT',
            linkedDoc: '/docs/architecture/ubed-distributions.md'
          }
        ]
      }
    ]
  }
];

export const ROADMAP_METRICS_SUMMARY = {
  overallPlatformProgress: 94.2,
  completedPhasesCount: 4,
  activePhasesCount: 2,
  horizonPhasesCount: 1,
  totalMilestonesCount: 18,
  completedMilestonesCount: 14,
  inProgressMilestonesCount: 3,
  totalDeliverablesCount: 45,
  completedDeliverablesCount: 39,
  verifiedCryptographicProofsCount: 39,
  activeBioregionalFieldLabs: 6,
  totalCapitalCoordinated: '$380,000,000',
  currentOperatingQuarter: 'Q3 2026',
  nextMajorMilestoneDate: 'October 15, 2026'
};
