import { PageView } from '../types';

export interface EcosystemRouteItem {
  path: string;
  name: string;
  category: 
    | 'Core Platform'
    | 'Execution Layer'
    | 'Intelligence + Trust'
    | 'Developer Ecosystem'
    | 'Institutional Layer'
    | 'Public Narrative'
    | 'Governance'
    | 'User Workspace';
  targetTab: PageView;
  subTarget?: string;
  description: string;
  badge?: string;
  isSpineNode?: 'observatory' | 'opportunity' | 'decision' | 'project' | 'impact';
}

export const ECOSYSTEM_ROUTES: EcosystemRouteItem[] = [
  // Core Platform
  {
    path: '/',
    name: 'Atlas Sanctum',
    category: 'Core Platform',
    targetTab: 'home',
    description: 'Civilization Operating System overview, planetary baseline & systemic health'
  },
  {
    path: '/atlas',
    name: 'Atlas Overview / System Map',
    category: 'Core Platform',
    targetTab: 'home',
    description: 'Universal civilizational system map, planetary boundaries and foundational telemetry'
  },
  {
    path: '/observatory',
    name: 'Global Intelligence',
    category: 'Core Platform',
    targetTab: 'observatory',
    description: 'Multi-scale planetary sensory mesh, macro-planetary to local watershed telemetry layers',
    isSpineNode: 'observatory'
  },
  {
    path: '/observatory/reality',
    name: 'Living Reality',
    category: 'Core Platform',
    targetTab: 'living-reality',
    description: 'Real-time multispectral planetary observatory, Sentinel biomass and live environmental flux'
  },
  {
    path: '/observatory/opportunities',
    name: 'Opportunity Intelligence',
    category: 'Core Platform',
    targetTab: 'opportunity-intelligence',
    description: 'Autonomous high-leverage planetary intervention discovery and causal leverage ranking',
    isSpineNode: 'opportunity'
  },
  {
    path: '/observatory/places',
    name: 'Place Intelligence',
    category: 'Core Platform',
    targetTab: 'bioregional-twin',
    description: 'Bioregional digital twin, in-situ field evidence, GIS sensor nodes and watershed telemetry'
  },
  {
    path: '/studio',
    name: 'Atlas Studio',
    category: 'Core Platform',
    targetTab: 'studio',
    description: 'Generative planetary design suite, multi-stakeholder design studio and interventions'
  },
  {
    path: '/studio/decisions',
    name: 'Decision Room',
    category: 'Core Platform',
    targetTab: 'decision-room',
    description: 'Algorithmic decision-making matrix with multi-agent consensus and ethical boundaries',
    isSpineNode: 'decision'
  },
  {
    path: '/studio/scenarios',
    name: 'Scenario Modeling',
    category: 'Core Platform',
    targetTab: 'system-model-studio',
    description: 'Stock-flow differential simulations, counterfactual scenarios and dynamic leverage points'
  },
  {
    path: '/studio/projects',
    name: 'Project Builder',
    category: 'Core Platform',
    targetTab: 'project-os',
    description: 'Decentralized project lifecycle management, milestones, capital allocations and deliverables',
    isSpineNode: 'project'
  },
  {
    path: '/marketplace',
    name: 'Regenerative Value Exchange',
    category: 'Core Platform',
    targetTab: 'marketplace',
    description: 'Natural capital assets, verified ecological credits and regenerative goods marketplace'
  },
  {
    path: '/marketplace/projects',
    name: 'Regenerative Projects',
    category: 'Core Platform',
    targetTab: 'marketplace',
    description: 'Tokenized ecological restoration projects, community land trusts and biochar facilities'
  },
  {
    path: '/capital',
    name: 'Capital Intelligence',
    category: 'Core Platform',
    targetTab: 'capital-engine',
    description: 'Blended regenerative capital pools, sovereign wealth allocations and catalytic financing'
  },
  {
    path: '/academy',
    name: 'Atlas Academy',
    category: 'Core Platform',
    targetTab: 'academy',
    description: 'Epistemic curricula, regenerative systems courses, and ecological leadership programs'
  },
  {
    path: '/commons',
    name: 'Atlas Commons',
    category: 'Core Platform',
    targetTab: 'commons',
    description: 'Open-source scientific models, shared planetary knowledge, and communal protocol assets'
  },
  {
    path: '/research',
    name: 'Atlas Research',
    category: 'Core Platform',
    targetTab: 'research',
    description: 'Peer-reviewed methodologies, epistemic proofs, causal inference whitepapers and data'
  },

  // Execution Layer
  {
    path: '/projects',
    name: 'Project Portfolio',
    category: 'Execution Layer',
    targetTab: 'project-os',
    description: 'Global portfolio of active bioregional restoration and infrastructure deployments',
    isSpineNode: 'project'
  },
  {
    path: '/projects/[id]',
    name: 'Individual Project',
    category: 'Execution Layer',
    targetTab: 'project-os',
    description: 'Deep telemetry, milestone verification and stakeholder governance for individual sites'
  },
  {
    path: '/field-labs',
    name: 'Real-World Experiments',
    category: 'Execution Layer',
    targetTab: 'field-labs',
    description: 'Empirical agroforestry testbeds, marine permaculture trials and mycelial bio-remediation'
  },
  {
    path: '/impact',
    name: 'Impact Intelligence',
    category: 'Execution Layer',
    targetTab: 'impact-dashboard',
    description: 'Comprehensive verifiable ecological outcome verification and holistic planetary scorecard',
    isSpineNode: 'impact'
  },
  {
    path: '/impact/[projectId]',
    name: 'Project Impact',
    category: 'Execution Layer',
    targetTab: 'impact-dashboard',
    description: 'Verified carbon, biodiversity, hydrological, and social flourishing impact metrics'
  },
  {
    path: '/industrial',
    name: 'Atlas Industrial Systems',
    category: 'Execution Layer',
    targetTab: 'industrial',
    description: 'Circular manufacturing, industrial symbiosis networks, and low-embodied-carbon logistics'
  },
  {
    path: '/lifehouse',
    name: 'LifeHouse',
    category: 'Execution Layer',
    targetTab: 'lifehouse',
    description: 'Autonomous regenerative habitat modules, circular water systems and off-grid microgrids'
  },
  {
    path: '/lifehouse/projects',
    name: 'LifeHouse Deployments',
    category: 'Execution Layer',
    targetTab: 'lifehouse',
    description: 'Distributed eco-dwelling implementations across arid, montane, and riparian biomes'
  },

  // Intelligence + Trust
  {
    path: '/intelligence',
    name: 'Atlas Intelligence',
    category: 'Intelligence + Trust',
    targetTab: 'moral-intelligence',
    description: 'Multi-agent cognitive engine, autonomous reasoning and epistemic verification'
  },
  {
    path: '/command',
    name: 'Command Center',
    category: 'Intelligence + Trust',
    targetTab: 'agent-mission-control',
    description: 'Autonomous agent fleet orchestrator, planetary dispatch and emergency intervention mesh'
  },
  {
    path: '/ethics',
    name: 'Moral Intelligence',
    category: 'Intelligence + Trust',
    targetTab: 'moral-arbiter',
    description: 'Constitutional axioms, priority floor validation and ethical boundary enforcement'
  },
  {
    path: '/ethics/assessment',
    name: 'Ethical Assessment',
    category: 'Intelligence + Trust',
    targetTab: 'ethics-review',
    description: 'Multi-agent moral audits, trade-off evaluations and intergenerational justice reviews'
  },
  {
    path: '/evidence',
    name: 'Evidence Explorer',
    category: 'Intelligence + Trust',
    targetTab: 'evidence-ledger',
    description: 'Immutable cryptographic ledger of sensor hashes, in-situ photography and Merkle roots'
  },
  {
    path: '/data',
    name: 'Data Explorer',
    category: 'Intelligence + Trust',
    targetTab: 'evidence-mapping',
    description: 'Interactive topological DAG of scientific dependencies, datasets, and causal links'
  },
  {
    path: '/methodology',
    name: 'Methodologies',
    category: 'Intelligence + Trust',
    targetTab: 'research',
    description: 'Standardized measurement protocols, ISO-14064 criteria and epistemic scoring standards'
  },
  {
    path: '/provenance',
    name: 'Data Provenance',
    category: 'Intelligence + Trust',
    targetTab: 'evidence-ledger',
    description: 'Sensor-to-ledger chain of custody verification, ZK proofs and satellite calibration certificates'
  },
  {
    path: '/trust',
    name: 'Trust Center',
    category: 'Intelligence + Trust',
    targetTab: 'governance',
    description: 'Verifiable governance, algorithmic auditability and tamper-evident epistemic integrity'
  },
  {
    path: '/ai-transparency',
    name: 'AI Transparency',
    category: 'Intelligence + Trust',
    targetTab: 'ai-engineering',
    description: 'Model weights audit, hallucination benchmark reports and prompt reasoning inspection'
  },

  // Developer Ecosystem
  {
    path: '/developers',
    name: 'Atlas SDK',
    category: 'Developer Ecosystem',
    targetTab: 'developers',
    description: 'Developer toolkit, REST/GraphQL endpoints, Python/TypeScript SDKs and telemetry libraries'
  },
  {
    path: '/developers/docs',
    name: 'Documentation',
    category: 'Developer Ecosystem',
    targetTab: 'developers',
    description: 'Full technical reference guides, API authentication and quickstart tutorials'
  },
  {
    path: '/developers/api',
    name: 'API Reference',
    category: 'Developer Ecosystem',
    targetTab: 'developers',
    description: 'Planetary telemetry queries, smart contract interfaces, and edge sensor upload specs'
  },
  {
    path: '/developers/playground',
    name: 'API Playground',
    category: 'Developer Ecosystem',
    targetTab: 'developers',
    description: 'Interactive sandbox to execute live GraphQL queries and test causal model endpoints'
  },
  {
    path: '/developers/datasets',
    name: 'Developer Datasets',
    category: 'Developer Ecosystem',
    targetTab: 'developers',
    description: 'Open access planetary climate datasets, soil microbiome genomics and GIS shapefiles'
  },

  // Institutional Layer
  {
    path: '/organizations',
    name: 'Organizations',
    category: 'Institutional Layer',
    targetTab: 'governance',
    description: 'Enterprise and NGO enterprise consortium configurations and institutional access'
  },
  {
    path: '/government',
    name: 'Government Solutions',
    category: 'Institutional Layer',
    targetTab: 'governance',
    description: 'Sovereign nation MRV systems, national natural capital accounts and policy simulation'
  },
  {
    path: '/institutions',
    name: 'Institutional Intelligence',
    category: 'Institutional Layer',
    targetTab: 'capital-engine',
    description: 'Pension fund portfolio risk modeling, ESG alignment and ecological bond issuance'
  },
  {
    path: '/partners',
    name: 'Partners',
    category: 'Institutional Layer',
    targetTab: 'marketplace',
    description: 'Certified scientific institutions, indigenous councils and academic research consortiums'
  },
  {
    path: '/careers',
    name: 'Careers',
    category: 'Institutional Layer',
    targetTab: 'about',
    description: 'Join the interdisciplinary team engineering the civilization operating system'
  },

  // Public-Facing Narrative
  {
    path: '/about',
    name: 'Mission + Philosophy',
    category: 'Public Narrative',
    targetTab: 'about',
    description: 'Core regenerative mission, civilization design philosophy and founding principles'
  },
  {
    path: '/vision',
    name: 'Civilization Vision',
    category: 'Public Narrative',
    targetTab: 'regenerative-mission',
    description: 'Long-horizon flourishing, planetary boundary restoration and human-nature reciprocity'
  },
  {
    path: '/stories',
    name: 'Human Stories',
    category: 'Public Narrative',
    targetTab: 'stories',
    description: 'Field narratives from indigenous stewards, agroforesters and watershed community elders'
  },
  {
    path: '/case-studies',
    name: 'Case Studies',
    category: 'Public Narrative',
    targetTab: 'stories',
    description: 'Quantified restoration turnarounds in the Aberdares, Mara Basin and urban catchments'
  },
  {
    path: '/news',
    name: 'Atlas News',
    category: 'Public Narrative',
    targetTab: 'events',
    description: 'Platform updates, global sensory mesh expansions and ecological milestone dispatches'
  },

  // Governance
  {
    path: '/governance',
    name: 'Governance',
    category: 'Governance',
    targetTab: 'governance',
    description: 'Civilization governance hub, voting mechanics, proposal lifecycle and council stewardship'
  },
  {
    path: '/principles',
    name: 'Moral Architecture',
    category: 'Governance',
    targetTab: 'governance',
    description: 'The 10 Invariant Planetary Commandments, moral boundary guarantees and axiomatic weights'
  },
  {
    path: '/privacy',
    name: 'Privacy',
    category: 'Governance',
    targetTab: 'about',
    description: 'Zero-knowledge sensor anonymity, sovereign local data ownership and biometric privacy'
  },
  {
    path: '/security',
    name: 'Security',
    category: 'Governance',
    targetTab: 'governance',
    description: 'Merkle state attestations, multi-sig protocol safeguards and cryptographic resilience'
  },
  {
    path: '/terms',
    name: 'Terms',
    category: 'Governance',
    targetTab: 'about',
    description: 'Regenerative Commons Covenant and ethical license agreements'
  },
  {
    path: '/responsible-ai',
    name: 'Responsible AI',
    category: 'Governance',
    targetTab: 'ai-engineering',
    description: 'Alignment benchmarks, human-in-the-loop oversight and non-extractive AI ethics'
  },

  // User Workspace
  {
    path: '/sign-in',
    name: 'Authentication',
    category: 'User Workspace',
    targetTab: 'home',
    description: 'Cryptographic wallet login, steward credentials and decentralized identity verify'
  },
  {
    path: '/dashboard',
    name: 'Personal Atlas',
    category: 'User Workspace',
    targetTab: 'stewardship-reputation',
    description: 'Your verified stewardship achievements, contributed field evidence and reputation level'
  },
  {
    path: '/saved',
    name: 'Saved Intelligence',
    category: 'User Workspace',
    targetTab: 'opportunity-intelligence',
    description: 'Bookmarked planetary leverage opportunities, bioregional models and policy drafts'
  },
  {
    path: '/watchlists',
    name: 'Watchlists',
    category: 'User Workspace',
    targetTab: 'observatory',
    description: 'Monitored catchments, drought alerts, river basins and biodiversity corridors'
  },
  {
    path: '/my-projects',
    name: 'User Projects',
    category: 'User Workspace',
    targetTab: 'project-os',
    description: 'Your authored restoration initiatives, grant proposals and field deployments'
  },
  {
    path: '/decisions',
    name: 'Saved Decisions',
    category: 'User Workspace',
    targetTab: 'decision-room',
    description: 'Simulated counterfactual runs, multi-agent consensus votes and archived decisions'
  },
  {
    path: '/settings',
    name: 'Account Settings',
    category: 'User Workspace',
    targetTab: 'stewardship-reputation',
    description: 'Platform preferences, theme mode, telemetry alerts and data export controls'
  }
];
