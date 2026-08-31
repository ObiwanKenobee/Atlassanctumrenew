import {
  PrivacyCollectionItem,
  PrivacyPolicyVersion,
  SecuritySpecification,
  ActiveSessionRecord,
  AIFeatureTransparencyRecord,
  RegenerativeImpactMetric,
  VerifiableClaimRecord,
  SystemServiceStatus,
  IncidentRecord,
  CovenantPrinciple
} from '../types/trust';

export const PRIVACY_COLLECTION_ITEMS: PrivacyCollectionItem[] = [
  {
    id: 'pc-1',
    category: 'Bioregional Context & Telemetry',
    dataPoints: ['Selected Bioregional Watershed ID', 'Ecosystem Layer Preferences', 'Map Zoom/Viewport Bounds'],
    purpose: 'To render localized hydrology, trophic biodiversity graphs, and micro-climate twins relevant to your chosen habitat.',
    legalBasis: 'Legitimate Interest',
    retentionPeriod: 'Stored locally in browser; ephemeral session memory on edge servers (0 days persistent on server).',
    recipients: ['Atlas Sanctum Edge Compute Engine', 'Encrypted Local Storage'],
    processingLocation: 'Local Client Sandbox & Sovereign European Edge Nodes (GCP europe-west2 / europe-west1)',
    sovereigntyStandard: 'Decentralized Epistemic Sovereignty v2'
  },
  {
    id: 'pc-2',
    category: 'Account Identity & Authorization',
    dataPoints: ['Email Address', 'Display Handle', 'Stewardship Level', 'Auth Token Hashes'],
    purpose: 'Authentication, role-based access control, saving custom opportunity lists, and field lab submissions.',
    legalBasis: 'Contractual Necessity',
    retentionPeriod: 'Retained until account deletion or self-serve revocation (Instant purge on request).',
    recipients: ['Firebase Authentication (Encrypted at Rest)', 'Atlas Sanctum Auth Guard'],
    processingLocation: 'Cloud Run Sandbox (Restricted Region Europe-West2)',
    sovereigntyStandard: 'SOC2 Type II + GDPR Sovereign Data Shield'
  },
  {
    id: 'pc-3',
    category: 'Epistemic Search & Interaction Signals',
    dataPoints: ['Epistemic Search Queries', 'Command Center Prompts', 'Voice Query Transcripts (Voluntary)'],
    purpose: 'To generate causal intelligence graphs, query the regenerative knowledge base, and compute ethical alignment scores.',
    legalBasis: 'Explicit Consent',
    retentionPeriod: 'Ephemeral: In-memory runtime buffer during query computation; never stored in persistent training corpora.',
    recipients: ['Google Gemini Enterprise API (Zero Data Retention agreement)', 'In-Memory Causal Router'],
    processingLocation: 'Isolated Enterprise AI Secure Enclave',
    sovereigntyStandard: 'Zero-Training Privacy Guarantee (Customer Data is NEVER used to train base foundation models)'
  },
  {
    id: 'pc-4',
    category: 'Offline Sync & Local Cache',
    dataPoints: ['Knowledge Graph Snapshots', 'Field Observation Offline Queue', 'Moral Scorecard Profiles'],
    purpose: 'Allowing field scientists and indigenous stewards to operate in remote wilderness areas without continuous network connectivity.',
    legalBasis: 'Legitimate Interest',
    retentionPeriod: 'Client-side IndexedDB until cleared by user or refreshed from canonical upstream ledger.',
    recipients: ['Client Browser IndexedDB Only'],
    processingLocation: 'User Device Local Hardware Storage',
    sovereigntyStandard: 'Local-First Architecture'
  }
];

export const PRIVACY_POLICY_VERSIONS: PrivacyPolicyVersion[] = [
  {
    version: '2026.1 (Current)',
    effectiveDate: 'August 15, 2026',
    summaryOfChanges: 'Introduced explicit AI Zero-Training Covenant, Bioregional Data Sovereignty safeguards, and instant self-serve Data Rights Dashboard.',
    authorizingBody: 'Atlas Sanctum Ethics & Governance Board',
    diffSummary: [
      'Added strict zero-retention guarantee for all AI command center multimodal inputs',
      'Integrated verifiable Merkle cryptographic receipts for personal data export/deletion',
      'Elevated plain-language summary alongside legal declarations'
    ]
  },
  {
    version: '2025.4',
    effectiveDate: 'November 1, 2025',
    summaryOfChanges: 'Standardized decentralized field lab telemetry caching and multi-bioregional data federation guidelines.',
    authorizingBody: 'Civilization Commons Stewardship Assembly',
    diffSummary: [
      'Added Local-First IndexedDB synchronization terms',
      'Codified non-extractive data governance for indigenous and traditional ecological knowledge (TEK)'
    ]
  }
];

export const SECURITY_SPECIFICATIONS: SecuritySpecification[] = [
  {
    category: 'Data at Rest & in Transit',
    title: 'End-to-End Cryptographic Encryption',
    status: 'enforced',
    standard: 'TLS 1.3 / AES-256-GCM / XChaCha20-Poly1305',
    description: 'All network transmissions utilize TLS 1.3 with Perfect Forward Secrecy. Database snapshots and field payloads are encrypted using AES-256 at rest.',
    auditVerification: 'Verified by Sovereign Cyber Audit Q2 2026'
  },
  {
    category: 'Identity & Authentication',
    title: 'Zero-Trust Role & Token Verification',
    status: 'active',
    standard: 'OAuth 2.0 / OIDC / Firebase Auth JWT with Short Expiry',
    description: 'Stateless cryptographic bearer tokens with automatic 60-minute refresh and anomaly detection for unusual origin vectors.',
    auditVerification: 'Continuous automated identity verification'
  },
  {
    category: 'Ephemeral AI Enclave',
    title: 'Zero-Retention Model Ingestion Gateway',
    status: 'enforced',
    standard: 'Enterprise API Enclave with strict no-log policy',
    description: 'Gemini inference is proxied through server-side secure endpoints without client-side API key leakage or persistent prompt archiving.',
    auditVerification: 'Cryptographically certified zero-training enclave'
  },
  {
    category: 'Integrity & Ledger Verification',
    title: 'Merkle-Tree Cryptographic Audit Ledger',
    status: 'monitored',
    standard: 'SHA-256 Merkle Provenance Chains',
    description: 'All governance votes, impact allocations, and ecological records include cryptographic provenance hashes for immutable verification.',
    auditVerification: 'Public Epistemic Ledger hash explorer'
  }
];

export const MOCK_ACTIVE_SESSIONS: ActiveSessionRecord[] = [
  {
    id: 'sess-current',
    device: 'Current Device (Web Browser)',
    browser: 'Chrome 128 / macOS',
    ipAddressMasked: '194.223.***.*** (London, UK)',
    location: 'Europe West Region',
    lastActive: 'Active Now',
    isCurrent: true
  },
  {
    id: 'sess-mobile',
    device: 'Atlas Mobile Field Terminal',
    browser: 'WebKit Mobile / iOS 19',
    ipAddressMasked: '82.165.***.*** (Zurich, CH)',
    location: 'Central Europe',
    lastActive: '2 days ago',
    isCurrent: false
  }
];

export const AI_TRANSPARENCY_RECORDS: AIFeatureTransparencyRecord[] = [
  {
    featureName: 'Causal Bioregional Twin & Knowledge Graph',
    aiModel: 'Gemini 2.5 Flash + Custom D3 Force Simulation Engine',
    primaryCapability: 'Multivariate ecological causality analysis, keystone mechanism discovery, trophic cascades',
    decisionInfluence: 'Simulation Hypothesis',
    dataIngested: ['Bioregional sensor inputs (Soil moisture, pH, canopy cover)', 'Historical biodiversity records', 'User-selected layer filters'],
    humanInTheLoopPolicy: 'All generated restoration hypotheses require validation and approval by certified bioregional field ecologists before project funding approval.',
    knownLimitations: ['Cannot replace ground-truth soil biology assays in sub-surface karst aquifers', 'Micro-climate variations below 10m grid require local sensor validation'],
    appealMechanism: 'Field stewards can challenge, override, or append counter-evidence to any causal link directly in the Bioregional Graph editor.',
    modelTrainingUsage: 'Never Used for Model Training'
  },
  {
    featureName: 'Constitutional Moral Arbiter',
    aiModel: 'Gemini 2.5 Pro (Structured Moral Scorecard Reasoner)',
    primaryCapability: 'Evaluates capital proposals, governance decisions, and industrial projects against the 10 Architectural Commandments of Flourishing.',
    decisionInfluence: 'Advisory Only',
    dataIngested: ['Project pitch deck text', 'Cap table and extraction metrics', 'Ecological risk vector scores'],
    humanInTheLoopPolicy: 'The Moral Arbiter provides an advisory scorecard with explicit ethical reasoning. Final project greenlighting is conducted exclusively by human governance assembly delegates.',
    knownLimitations: ['Subject to epistemic biases in Western commercial literature; calibrated continuously against indigenous stewardship covenants'],
    appealMechanism: 'Applicants can request a full multi-delegate human ethical review with written justification within 14 days.',
    modelTrainingUsage: 'Zero Retention'
  },
  {
    featureName: 'Epistemic Command Center & Live Voice',
    aiModel: 'Gemini 2.5 Flash + Gemini Live Audio Gateway',
    primaryCapability: 'Instant semantic navigation, project discovery, research paper synthesis, real-time natural voice interaction',
    decisionInfluence: 'No Autonomous Authority',
    dataIngested: ['Natural language search prompts', 'Voice audio buffer during active call only'],
    humanInTheLoopPolicy: 'Voice queries operate in an ephemeral audio pipeline. Transcripts are converted to standard search terms in real-time.',
    knownLimitations: ['Audio latency dependent on client network bandwidth', 'Technical ecological taxonomy may require phonetic clarification'],
    appealMechanism: 'Not applicable (purely exploratory assistant)',
    modelTrainingUsage: 'Ephemeral In-Memory Only'
  }
];

export const REGENERATIVE_IMPACT_METRICS: RegenerativeImpactMetric[] = [
  {
    id: 'rim-1',
    title: 'Ecosystems & Habitats Under Active Regeneration',
    category: 'Ecological',
    value: '142,850',
    unit: 'Hectares',
    type: 'actual',
    confidenceScore: 99.4,
    verificationSource: 'Sentinel-2 Multispectral Satellite + Ground Field Sensors',
    verificationHash: '0x3a9f02b189cc84129f1092e01',
    lastAudited: 'August 28, 2026',
    description: 'High-integrity biological corridors with verifiable biodiversity uplift across Cascadian, Mediterranean, and Highland Andean bioregions.'
  },
  {
    id: 'rim-2',
    title: 'Non-Extractive Capital Mobilized for Commons',
    category: 'Economic Sovereignty',
    value: '$48.6M',
    unit: 'USD Equiv.',
    type: 'actual',
    confidenceScore: 100,
    verificationSource: 'Atlas Capital Engine & Smart Escrow Ledgers',
    verificationHash: '0x7c8192e401b98a0029b3112b4',
    lastAudited: 'August 30, 2026',
    description: 'Perpetual stewardship loans, revenue-share catalytic notes, and bioregional land trusts structured with capped non-extractive returns.'
  },
  {
    id: 'rim-3',
    title: 'Aquifer & Natural Springs Water Recharged',
    category: 'Hydrology',
    value: '3.42B',
    unit: 'Liters / Year',
    type: 'estimated',
    confidenceScore: 94.2,
    verificationSource: 'USGS Stream Gauges & Distributed Karst Telemetry',
    verificationHash: '0x99b1a03f441c88019ab281e09',
    lastAudited: 'August 15, 2026',
    description: 'Swale keyline design, riparian reforestation, and beaver dam analog retention structures across 18 catchments.'
  },
  {
    id: 'rim-4',
    title: 'Soil Organic Carbon Deep Sequestered',
    category: 'Carbon & Soil',
    value: '840,000',
    unit: 'Tonnes CO2e',
    type: 'estimated',
    confidenceScore: 91.8,
    verificationSource: 'Chromatography Soil Core Sampling (0-100cm depth)',
    verificationHash: '0x55e092bba40192e88a0912cb3',
    lastAudited: 'July 30, 2026',
    description: 'Long-term fungal humic accumulation verified through spectral ground assays and metagenomic soil sequencing.'
  },
  {
    id: 'rim-5',
    title: '2028 Civilization Flourishing Target',
    category: 'Human Prosperity',
    value: '1,000,000',
    unit: 'Stewards & Creators',
    type: 'target',
    confidenceScore: 88.0,
    verificationSource: 'Atlas Sanctum 5-Year Civilization Roadmap',
    verificationHash: '0x00a891f9b33a01824cb01918a',
    lastAudited: 'August 01, 2026',
    description: 'Target benchmark for decentralized bioregional hubs, community tool-libraries, and localized renewable micro-grids.'
  },
  {
    id: 'rim-6',
    title: '2030 Projected Bioregional Economic Output',
    category: 'Economic Sovereignty',
    value: '$250M',
    unit: 'Annual Value',
    type: 'projected',
    confidenceScore: 78.5,
    verificationSource: 'Macro-Regenerative Economic Modeling (Causal Twin)',
    verificationHash: '0x12b899a14c99e12089b099182',
    lastAudited: 'August 20, 2026',
    description: 'Projected economic yield from closed-loop timber, mycelial biomaterials, regenerative agroforestry, and non-extractive clean manufacturing.'
  }
];

export const VERIFIABLE_CLAIMS: VerifiableClaimRecord[] = [
  {
    id: 'VCR-2026-081',
    subjectTitle: 'Okanagan Riparian Sponge Hydrology Project',
    subjectType: 'Project',
    claimDescription: '100% natural streamflow restoration with 0 synthetic chemical inputs across 4,200 acres.',
    verificationState: 'independently-audited',
    verifierOrganization: 'Pacific Bioregional Science Institute (Third-Party)',
    auditStandard: 'Regenerative Organic Alliance + Bioregional Hydrology Standard v3',
    cryptographicMerkleRoot: '0x8823f9a00b12984ea0912837bc901',
    issuanceDate: '2026-06-12',
    expiryDate: '2028-06-12'
  },
  {
    id: 'VCR-2026-074',
    subjectTitle: 'Cascadia Bio-Carbon Cooperative',
    subjectType: 'Land Trust',
    claimDescription: 'Permanent conservation easement preventing clear-cut logging for 99 years.',
    verificationState: 'verified',
    verifierOrganization: 'Sovereign Indigenous Land Assembly',
    auditStandard: 'Intergenerational Stewardship Charter',
    cryptographicMerkleRoot: '0x9923a10be550189aa90291cb09204',
    issuanceDate: '2026-05-04',
    expiryDate: '2125-05-04'
  },
  {
    id: 'VCR-2026-062',
    subjectTitle: 'Mycelial Insulation Clean Factory',
    subjectType: 'Organization',
    claimDescription: 'Embodied carbon negativity (-2.4 kg CO2e per m2) in insulation panel manufacturing.',
    verificationState: 'reviewed',
    verifierOrganization: 'European Circular Materials Council',
    auditStandard: 'ISO 14044 Life Cycle Assessment',
    cryptographicMerkleRoot: '0x4421bba800921008cb1928371900a',
    issuanceDate: '2026-07-19',
    expiryDate: '2027-07-19'
  }
];

export const SYSTEM_SERVICES_STATUS: SystemServiceStatus[] = [
  {
    serviceId: 'srv-gemini-ai',
    serviceName: 'Gemini 2.5 Enterprise Enclave API',
    category: 'Core AI',
    status: 'operational',
    uptime90Days: 99.99,
    latencyMs: 142
  },
  {
    serviceId: 'srv-bioregional-graph',
    serviceName: 'Bioregional Causal Knowledge Graph Engine',
    category: 'Bioregional Telemetry',
    status: 'operational',
    uptime90Days: 99.98,
    latencyMs: 38
  },
  {
    serviceId: 'srv-epistemic-ledger',
    serviceName: 'Cryptographic Epistemic Ledger & Firestore Sync',
    category: 'Ledger & Database',
    status: 'operational',
    uptime90Days: 100.0,
    latencyMs: 24
  },
  {
    serviceId: 'srv-voice-stream',
    serviceName: 'Gemini Live Low-Latency Audio Gateway',
    category: 'Audio Gateway',
    status: 'operational',
    uptime90Days: 99.95,
    latencyMs: 95
  },
  {
    serviceId: 'srv-edge-cdn',
    serviceName: 'Sovereign Global Edge & Static Mesh',
    category: 'Edge CDN',
    status: 'operational',
    uptime90Days: 99.99,
    latencyMs: 12
  }
];

export const HISTORICAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-2026-0802',
    title: 'Temporary Latency in Satellite Multispectral Tile Rendering',
    date: 'August 02, 2026 - 14:20 UTC',
    severity: 'low',
    impactDescription: 'Users in South American bioregions experienced a 3.2-second delay loading NDVI vegetation satellite layers.',
    resolutionDetails: 'Edge tile caching warmed across regional CDN nodes. Ingestion pipeline re-balanced with zero data loss.',
    status: 'resolved'
  },
  {
    id: 'INC-2026-0615',
    title: 'Scheduled Micro-Database Schema Migration',
    date: 'June 15, 2026 - 02:00 UTC',
    severity: 'low',
    impactDescription: 'Read-only maintenance mode activated for 8 minutes during Merkle root version upgrade.',
    resolutionDetails: 'Completed ahead of schedule with 100% integrity validation.',
    status: 'resolved'
  }
];

export const ATLAS_COVENANT_PRINCIPLES: CovenantPrinciple[] = [
  {
    pillar: 'Human Dignity & Agency',
    title: 'Technology as Subservient Tool, Never Master',
    mandate: 'Systems must elevate human judgment, agency, and relational intimacy rather than fostering addiction, extraction, or algorithmic subjugation.',
    ethicalCommitment: 'We build transparent cognitive tools that empower deep contemplation and moral clarity.',
    enforcementMechanism: 'Algorithmic design review audits; strict ban on engagement-maximizing dark patterns.'
  },
  {
    pillar: 'Environmental & Ecological Integrity',
    title: 'Biophysical Grounding & Non-Harm',
    mandate: 'All digital infrastructure and economic coordination mechanisms must align with planetary ecological boundaries and living watershed health.',
    ethicalCommitment: 'Every digital computation is accounted for in energy, water, and lifecycle material impact.',
    enforcementMechanism: 'Automated carbon-budget caps and renewable energy hosting mandates.'
  },
  {
    pillar: 'Data Sovereignty & Self-Determination',
    title: 'Sacredness of Cultural & Personal Knowledge',
    mandate: 'Individual data, traditional ecological knowledge (TEK), and community observations remain under the sovereign ownership of their creators.',
    ethicalCommitment: 'Zero unauthorized commercial extraction; zero model training on non-consented private data.',
    enforcementMechanism: 'Cryptographic data rights dashboard with instant self-serve purge and verifiable audit trails.'
  },
  {
    pillar: 'Radical Epistemic Transparency',
    title: 'Open Provenance & Verifiable Reasoning',
    mandate: 'AI assertions, financial flows, and scientific claims must provide full audit trails, uncertainty bounds, and primary sources.',
    ethicalCommitment: 'We reject black-box authoritarian declarations in favor of inspectable, falsifiable knowledge.',
    enforcementMechanism: 'Public Epistemic Ledger, Merkle verification, and uncertainty overlay visualizers.'
  },
  {
    pillar: 'Intergenerational Responsibility',
    title: 'The Seven-Generation Horizon',
    mandate: 'Decisions are evaluated not by quarterly financial extraction, but by their compounding legacy across seven generations of living beings.',
    ethicalCommitment: 'We prioritize longevity, open-source resilience, and perpetual commons stewardship.',
    enforcementMechanism: 'Moral Arbiter 7-Generation Impact Scorecard and constitutional floor rules.'
  }
];

// Aliases for component compatibility
export const ETHICAL_COVENANT_PRINCIPLES = ATLAS_COVENANT_PRINCIPLES;
export const SYSTEM_STATUS_SERVICES = SYSTEM_SERVICES_STATUS;
export const INCIDENT_LOGS = HISTORICAL_INCIDENTS;

export const TRUST_PILLARS = [
  {
    id: 'privacy' as const,
    title: '1. Privacy Center',
    subtitle: 'Data Collection & Processing Specs',
    category: 'Privacy'
  },
  {
    id: 'consent' as const,
    title: '2. Consent Management',
    subtitle: 'Granular Telemetry & Model Controls',
    category: 'Consent'
  },
  {
    id: 'security' as const,
    title: '3. Security Center',
    subtitle: 'Encryption, Sessions & Threat Specs',
    category: 'Security'
  },
  {
    id: 'data-rights' as const,
    title: '4. Data Rights & Sovereignty',
    subtitle: 'Export, Correct, Restrict & Purge',
    category: 'Sovereignty'
  },
  {
    id: 'ai-transparency' as const,
    title: '5. AI Transparency',
    subtitle: 'Model Architecture, Training & Appeals',
    category: 'AI Ethics'
  },
  {
    id: 'accessibility' as const,
    title: '6. Accessibility Center',
    subtitle: 'Plain-Language, Contrast & Scaling',
    category: 'Inclusion'
  },
  {
    id: 'impact-transparency' as const,
    title: '7. Impact Transparency',
    subtitle: 'Regenerative Metrics & Merkle Receipts',
    category: 'Impact'
  },
  {
    id: 'governance-terms' as const,
    title: '8. Terms & Governance',
    subtitle: 'Non-Extractive License & Version Diff',
    category: 'Governance'
  },
  {
    id: 'verification-system' as const,
    title: '9. Verification & Audits',
    subtitle: 'Independent Audits & Merkle Roots',
    category: 'Integrity'
  },
  {
    id: 'incident-status' as const,
    title: '10. Incident & Status',
    subtitle: 'Real-Time Uptime & Outage Logs',
    category: 'Reliability'
  },
  {
    id: 'unified-preferences' as const,
    title: '11. Unified Preferences',
    subtitle: 'Sync Settings, Audio & Notifications',
    category: 'Preferences'
  },
  {
    id: 'ethical-covenant' as const,
    title: '12. Ethical Covenant',
    subtitle: 'Civilization Flourishing Charter',
    category: 'Ethics'
  }
];

