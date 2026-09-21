import {
  MoralPrinciple,
  IntelligenceLayer,
  CapitalFormDimension,
  LivingRealityLayer,
  ProjectLocation,
  RVEAsset,
  LifeHouseSystem,
  IndustrialFacility,
  CivilizationMetric,
  ResearchPaper,
  AcademyCourse,
  CommonsProposal,
  DataProvenance
} from '../types';

export const MORAL_PRINCIPLES: MoralPrinciple[] = [
  {
    id: 'peace',
    name: 'Peace',
    scripturalTheme: 'Shalom / Systemic Wholeness',
    universalDesignPrinciple: 'Design systems that reduce conflict, instability, exploitation, and unnecessary friction.',
    systemImplementation: 'Equilibrium algorithmic routing, non-extractive resource arbitration, de-escalation protocols.',
    auditMetric: 'Systemic volatility reduction score; conflict vector resolution percentage.',
    iconName: 'Shield'
  },
  {
    id: 'love',
    name: 'Love & Dignity',
    scripturalTheme: 'Agape / Selfless Service',
    universalDesignPrinciple: 'Design technology around human dignity, agency, compassion, and sovereign stewardship.',
    systemImplementation: 'Privacy-first zero-knowledge architecture, no dark patterns, participant-sovereignty data models.',
    auditMetric: 'User agency retention rate; zero coercive engagement mechanics.',
    iconName: 'Heart'
  },
  {
    id: 'acceptance',
    name: 'Acceptance & Inclusion',
    scripturalTheme: 'Radical Hospitality',
    universalDesignPrinciple: 'Design specifically for people who are historically excluded from institutions, capital, and technology.',
    systemImplementation: 'Low-bandwidth offline-first edge nodes, voice interfaces in indigenous languages, zero-barrier onboarding.',
    auditMetric: 'Inclusion coefficient of previously unbanked / unserved communities (>60%).',
    iconName: 'Users'
  },
  {
    id: 'courage',
    name: 'Courage',
    scripturalTheme: 'Moral Boldness',
    universalDesignPrinciple: 'Build solutions for difficult, root-cause civilizational problems rather than optimizing for easy ad-tech markets.',
    systemImplementation: 'Long-horizon patient capital allocation, arid bioregion restoration, deep water infrastructure.',
    auditMetric: 'Capital deployed to high-difficulty structural interventions vs low-friction derivatives.',
    iconName: 'Flame'
  },
  {
    id: 'protection',
    name: 'Protection',
    scripturalTheme: 'Sanctuary & Defense of the Vulnerable',
    universalDesignPrinciple: 'Protect people, communities, ecosystems, data, infrastructure, and future generations.',
    systemImplementation: 'Cryptographic identity vaults, environmental early warning meshes, climate-hardened shelters.',
    auditMetric: 'Vulnerability mitigation index; 100% data sovereign guardianship.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'guidance',
    name: 'Guidance',
    scripturalTheme: 'Wisdom & Light',
    universalDesignPrinciple: 'Turn intelligence into ethical, discerning decisions rather than generating noisy information floods.',
    systemImplementation: 'AI uncertainty telemetry, provenance tracing, multi-generational impact simulation.',
    auditMetric: 'Decision clarity delta; inspectability ratio of automated reasoning.',
    iconName: 'Compass'
  },
  {
    id: 'patience',
    name: 'Patience',
    scripturalTheme: 'Generational Faithfulness',
    universalDesignPrinciple: 'Design institutions, infrastructure, and capital models capable of thinking in years and generations rather than quarters.',
    systemImplementation: '25-year perpetual ecological trusts, multi-decade soil regeneration yield cycles.',
    auditMetric: 'Average capital horizon length (target >15 years).',
    iconName: 'Hourglass'
  },
  {
    id: 'righteousness',
    name: 'Righteousness',
    scripturalTheme: 'Integrity & Moral Alignment',
    universalDesignPrinciple: 'Make ethical principles operational, measurable, auditable, and mathematically verifiable.',
    systemImplementation: 'Zero-knowledge moral compliance proofs, open ledger accounting, public sensor calibration.',
    auditMetric: 'Cryptographic audit compliance (100% open verification).',
    iconName: 'Scale'
  },
  {
    id: 'forgiveness',
    name: 'Forgiveness & Restoration',
    scripturalTheme: 'Reconciliation & Jubilee',
    universalDesignPrinciple: 'Create systems that permit ecological restoration, personal recovery, debt relief, and second chances.',
    systemImplementation: 'Restorative credit rehabilitation algorithms, ecological soil remediation protocols, forgiveness clauses.',
    auditMetric: 'Restoration pathways active; debt-to-equity jubilee triggers.',
    iconName: 'RefreshCw'
  },
  {
    id: 'faithfulness',
    name: 'Faithfulness & Trust',
    scripturalTheme: 'Covenantal Reliability',
    universalDesignPrinciple: 'Build trustworthy infrastructure with total transparency, continuous verification, and uptime reliability.',
    systemImplementation: 'High-availability decentralized mesh nodes, transparent public audits, non-repudiable contracts.',
    auditMetric: 'Infrastructure reliability (99.995%), transparent downtime logs.',
    iconName: 'Award'
  },
  {
    id: 'justice',
    name: 'Justice',
    scripturalTheme: 'Mishpat / Fair Allocation',
    universalDesignPrinciple: 'Design fair resource allocation systems that consider voice, access, burden, benefit, and multi-generational consequence.',
    systemImplementation: 'Equitable water & energy microgrid distribution formulas, progressive public goods funding.',
    auditMetric: 'Gini coefficient reduction in resource distribution corridors.',
    iconName: 'Balance'
  },
  {
    id: 'the-poor',
    name: 'The Poor (Priority Floor)',
    scripturalTheme: 'Option for the Excluded',
    universalDesignPrinciple: 'Make the economically and structurally excluded a primary design priority rather than a charitable afterthought.',
    systemImplementation: 'Universal basic infrastructure access (LifePod food, LifeShield shelter, clean water kiosks).',
    auditMetric: 'Per-capita floor standard reached for basic human survival and opportunity.',
    iconName: 'HandHeart'
  },
  {
    id: 'hope',
    name: 'Hope',
    scripturalTheme: 'Living Expectation',
    universalDesignPrinciple: 'Turn better futures into credible, measurable, navigable, and buildable possibilities.',
    systemImplementation: 'Scenario simulation studio, forward opportunity mapping, interactive flourishing roadmaps.',
    auditMetric: 'Community-generated positive action roadmaps active.',
    iconName: 'Sun'
  },
  {
    id: 'provision',
    name: 'Provision',
    scripturalTheme: 'Daily Bread / Abundance',
    universalDesignPrinciple: 'Build systems that make food, housing, healthcare, clean energy, education, and capital universally accessible.',
    systemImplementation: 'LifeHouse modular habitats, closed-loop hydroponic networks, solar microgrids, open educational libraries.',
    auditMetric: 'Total calories, kilowatt-hours, clean liters, and learning hours provided.',
    iconName: 'Wheat'
  }
];

export const INTELLIGENCE_LAYERS: IntelligenceLayer[] = [
  {
    id: 'trust-os',
    code: 'TRUST OS',
    name: 'Trust Operating System',
    descriptor: 'Verification, identity, provenance, transparency, and moral accountability',
    summary: 'Ensures that every claim, sensor feed, financial transfer, and AI recommendation carries cryptographic provenance and moral auditability.',
    color: '#D4AF37',
    capabilities: [
      'Zero-Knowledge Identity Vaults',
      'Cryptographic Ecological Provenance',
      'Continuous Audit & Anomaly Detection',
      'Moral Scorecard Protocol Verification',
      'Public Ledger Integrity Verification'
    ],
    activeNodes: 14280,
    flourishingIndexDelta: '+18.4%'
  },
  {
    id: 'knowledge-os',
    code: 'KNOWLEDGE OS',
    name: 'Knowledge Operating System',
    descriptor: 'Research, intelligence, telemetry, scientific modeling, and causal evidence',
    summary: 'Aggregates planetary observation data, ecological sensor meshes, and scientific modeling into actionable wisdom.',
    color: '#38BDF8',
    capabilities: [
      'Multi-Satellite Spectroscopic Synthesis',
      'Soil Microbiome Sensor Ingestion',
      'Causal Systems Dynamics Engine',
      'Open Research & Methodology Index',
      'Predictive Climate Micro-Forecasting'
    ],
    activeNodes: 28410,
    flourishingIndexDelta: '+24.1%'
  },
  {
    id: 'health-os',
    code: 'HEALTH OS',
    name: 'Health Operating System',
    descriptor: 'Human health, preventative community care, water quality, and holistic wellbeing',
    summary: 'Coordinates preventive healthcare tele-diagnostics, water purification monitoring, and nutritional security.',
    color: '#10B981',
    capabilities: [
      'Real-Time Water Aquifer Contamination Warning',
      'Decentralized Primary Clinic Telemetry',
      'Nutritional Diversity & Micronutrient Tracking',
      'Maternal & Child Health Early Intervention',
      'Community Psychological Resilience Mapping'
    ],
    activeNodes: 19650,
    flourishingIndexDelta: '+31.7%'
  },
  {
    id: 'opportunity-os',
    code: 'OPPORTUNITY OS',
    name: 'Opportunity Operating System',
    descriptor: 'Capital coordination, dignified livelihoods, entrepreneurship, and market access',
    summary: 'Connects regenerative builders, smallholder producers, and young innovators with patient non-extractive capital.',
    color: '#F59E0B',
    capabilities: [
      'Regenerative Value Exchange (RVE)',
      'Community Asset Micro-Equity Contracts',
      'Apprenticeship & Technical Skill Matching',
      'Fair-Trade Decentralized Logistics Network',
      'Patient Capital Tranche Automation'
    ],
    activeNodes: 35120,
    flourishingIndexDelta: '+28.9%'
  },
  {
    id: 'flourishing-os',
    code: 'FLOURISHING OS',
    name: 'Flourishing Operating System',
    descriptor: 'Human dignity, ecological restoration, social cohesion, and generational prosperity',
    summary: 'The meta-operating layer that harmonizes all systems to maximize long-term flourishing across human communities and ecosystems.',
    color: '#059669',
    capabilities: [
      'Composite Flourishing Index (CFI) Engine',
      'Multi-Capital Flow Balancing (7 Capitals)',
      'Ecological Bioregion Health Telemetry',
      'Intergenerational Heritage Preservation',
      'Civilizational Resilience Early Warnings'
    ],
    activeNodes: 42900,
    flourishingIndexDelta: '+36.2%'
  }
];

export const CAPITALS_DATA: CapitalFormDimension[] = [
  {
    id: 'natural',
    name: 'Natural Capital',
    description: 'Living ecosystems, soil fertility, clean water aquifers, biodiversity, forests, and atmospheric stability.',
    flowDescription: 'Natural Capital transforms into Human vitality and long-term Social stability when stewarded regeneratively.',
    currentAllocation: '$142.5M verified stewardship value',
    annualGrowth: '+14.2% biodiversity index',
    color: '#10B981'
  },
  {
    id: 'human',
    name: 'Human Capital',
    description: 'Health, dignity, knowledge, practical skills, agency, creativity, and spiritual purpose.',
    flowDescription: 'Empowered humans develop Intellectual breakthroughs and build resilient physical Infrastructure.',
    currentAllocation: '124,000 active learners & practitioners',
    annualGrowth: '+26.8% skilled practitioners',
    color: '#38BDF8'
  },
  {
    id: 'social',
    name: 'Social Capital',
    description: 'Trust, reciprocity, community governance, mutual aid networks, and conflict resolution capacity.',
    flowDescription: 'High social trust dramatically reduces transaction costs and strengthens community crisis resistance.',
    currentAllocation: '840 community cooperatives & councils',
    annualGrowth: '+19.4% trust index',
    color: '#8B5CF6'
  },
  {
    id: 'financial',
    name: 'Financial Capital',
    description: 'Liquid coordination medium, non-extractive patient investments, and regenerative outcome tokens.',
    flowDescription: 'Financial capital acts as an obedient servant to catalyze real-world physical and ecological infrastructure.',
    currentAllocation: '$380M non-extractive capital committed',
    annualGrowth: '+32.1% deployed capital',
    color: '#D4AF37'
  },
  {
    id: 'intellectual',
    name: 'Intellectual Capital',
    description: 'Open-source scientific designs, AI models, engineering schematics, and regenerative methodologies.',
    flowDescription: 'Open intellectual assets accelerate regional manufacturing and empower local innovators.',
    currentAllocation: '1,420 open-access blueprints & papers',
    annualGrowth: '+41.5% open IP adoptions',
    color: '#6366F1'
  },
  {
    id: 'cultural',
    name: 'Cultural Capital',
    description: 'Indigenous ecological wisdom, languages, storytelling, sacred music, and intergenerational values.',
    flowDescription: 'Cultural roots ground modern technological systems in deep ethical purpose and identity.',
    currentAllocation: '210 preserved indigenous knowledge archives',
    annualGrowth: '+15.6% documented living traditions',
    color: '#EC4899'
  },
  {
    id: 'institutional',
    name: 'Institutional Capital',
    description: 'Transparent governance rules, verified legal frameworks, audit covenants, and dispute mediation systems.',
    flowDescription: 'Strong institutions protect the vulnerable from corruption and ensure durable multi-decade covenants.',
    currentAllocation: '98 audited legal covenants & commons trusts',
    annualGrowth: '+22.0% institutional resilience score',
    color: '#14B8A6'
  }
];

export const LIVING_REALITY_LAYERS: LivingRealityLayer[] = [
  {
    id: 'climate-vulnerability',
    name: 'Climate Vulnerability & Heat Stress',
    category: 'vulnerability',
    unit: 'Index (0-100)',
    globalAverage: '48.2',
    criticalThreshold: '> 65.0',
    description: 'High-resolution composite of drought frequency, extreme heat anomalies, and flood inundation risk.',
    activeSensorCount: 14200
  },
  {
    id: 'food-security',
    name: 'Food Sovereignty & Soil Vitality',
    category: 'provision',
    unit: 'Nutritional Density %',
    globalAverage: '62.4%',
    criticalThreshold: '< 45.0%',
    description: 'Local crop diversity, topsoil organic carbon percentage, and post-harvest storage access.',
    activeSensorCount: 9800
  },
  {
    id: 'housing-resilience',
    name: 'Shelter & Habitability Index',
    category: 'provision',
    unit: 'Resilience Score',
    globalAverage: '54.1',
    criticalThreshold: '< 40.0',
    description: 'Thermal comfort, seismic/storm resistance, clean water connection, and non-displaceable tenure.',
    activeSensorCount: 6500
  },
  {
    id: 'clean-energy-access',
    name: 'Clean Energy & Microgrid Uptime',
    category: 'provision',
    unit: 'Hours/Day (24h)',
    globalAverage: '16.8h',
    criticalThreshold: '< 8.0h',
    description: 'Decentralized solar, micro-hydro, and biomass storage availability for productive community use.',
    activeSensorCount: 18400
  },
  {
    id: 'water-systems',
    name: 'Aquifer Health & Potable Flow',
    category: 'regeneration',
    unit: 'Liters / Person / Day',
    globalAverage: '38.5 L',
    criticalThreshold: '< 20.0 L',
    description: 'Groundwater replenishment rates, biological contaminant counts, and riparian buffer integrity.',
    activeSensorCount: 11200
  },
  {
    id: 'capital-flows',
    name: 'Regenerative Capital Allocation',
    category: 'capital',
    unit: '$ Millions Deployed',
    globalAverage: '$2.4M / node',
    criticalThreshold: '< $500k',
    description: 'Transparent flow of non-extractive, milestone-verified capital into community-governed projects.',
    activeSensorCount: 4200
  },
  {
    id: 'ecological-restoration',
    name: 'Active Bioregional Restoration',
    category: 'regeneration',
    unit: 'Hectares Verified',
    globalAverage: '124,000 ha',
    criticalThreshold: '< 20,000 ha',
    description: 'Satellite LiDAR & NDVI verified biomass growth, native species return, and soil carbon sequestration.',
    activeSensorCount: 15600
  }
];

export const SAMPLE_PROVENANCE: DataProvenance = {
  id: 'PROV-2026-AF-089',
  source: 'Sentinel-2 Multispectral + LoRaWAN IoT Soil Mesh v4',
  sourceType: 'satellite_telemetry',
  collectedAt: '2026-08-22T14:30:00Z',
  calculationMethod: 'Normalized Difference Vegetation Index (NDVI) + In-Situ Soil Capacitance Array Calibration (ISO-14064 Compliant)',
  certaintyScore: 94.8,
  merkleProofCount: 16,
  verifiedMerkleProofs: 15,
  merkleRootHash: '0x3c99a812b1df4e8a7c2098bca4319800e8f712ac92e105e4b7b39f1c7d23e590',
  verifier: 'Global Ecological Provenance Trust & Kenya Forestry Research Institute',
  verifierRole: 'Independent Third-Party Scientific Auditor',
  cryptographicHash: '0x8f2a4e9b71d63c5a109e821b904fc7d3298a0e5b1287c934f89d02e47a6b512c',
  assumptions: [
    'Cloud cover filtering applied with <2% visual atmospheric distortion.',
    'Sensor array calibrated using 50 baseline core samples taken July 2026.',
    'Model coefficients adjusted for arid tropical soil moisture retention.'
  ],
  lastAudited: '2026-08-20'
};

export const GLOBAL_PROJECTS: ProjectLocation[] = [
  {
    id: 'proj-mara-rift',
    title: 'Mara-Rift Regenerative Biosphere Corridor',
    region: 'Rift Valley Basin',
    country: 'Kenya',
    coordinates: [-1.2921, 36.8219],
    scale: 'region',
    primaryLayer: 'ecological-restoration',
    impactHighlight: '42,000 hectares of multi-strata agroforestry and wildlife corridor restoring water tables for 180,000 people.',
    budget: '$18.5M',
    verifiedProgress: 78,
    beneficiariesCount: 184000,
    ecologicalAreaHectares: 42000,
    partners: ['Maasai Land Trust', 'UNEP Bioregional Unit', 'Atlas Sanctum Foundation'],
    provenance: {
      ...SAMPLE_PROVENANCE,
      id: 'PROV-MARA-894',
      verifier: 'East Africa Ecosystem Verification Council'
    }
  },
  {
    id: 'proj-kilifi-coast',
    title: 'Kilifi Coastal Mangrove & Agro-Corridor',
    region: 'Coast Province',
    country: 'Kenya',
    coordinates: [-3.6305, 39.8499],
    scale: 'community',
    primaryLayer: 'water-systems',
    impactHighlight: 'Restoration of 12,000 hectares of blue carbon mangroves and 24 solar-powered seawater desalination kiosks.',
    budget: '$9.2M',
    verifiedProgress: 88,
    beneficiariesCount: 65000,
    ecologicalAreaHectares: 12000,
    partners: ['Kilifi Community Fisherfolk Union', 'Blue Carbon Initiative'],
    provenance: {
      ...SAMPLE_PROVENANCE,
      id: 'PROV-KLF-102',
      verifier: 'Marine Bio-Audit Global'
    }
  },
  {
    id: 'proj-turkana-solar',
    title: 'Turkana Deep Aquifer & Solar-Agriculture Hub',
    region: 'Turkana County',
    country: 'Kenya',
    coordinates: [3.1167, 35.5999],
    scale: 'project',
    primaryLayer: 'clean-energy-access',
    impactHighlight: '3.4MW decentralized solar microgrid powering deep aquifer desalination and 80 LifePod hydroponic modules.',
    budget: '$14.0M',
    verifiedProgress: 64,
    beneficiariesCount: 92000,
    ecologicalAreaHectares: 8500,
    partners: ['Turkana Pastoralist Cooperative', 'Atlas Industrial Systems'],
    provenance: {
      ...SAMPLE_PROVENANCE,
      id: 'PROV-TRK-771',
      verifier: 'Hydrological Energy Verification Institute'
    }
  },
  {
    id: 'proj-kigali-habitat',
    title: 'Kigali LifeHouse Green Industrial Quarter',
    region: 'Kigali City',
    country: 'Rwanda',
    coordinates: [-1.9706, 30.1044],
    scale: 'city',
    primaryLayer: 'housing-resilience',
    impactHighlight: '450 modular LifeHouse residential units fabricated from bio-composite compressed earth blocks with zero net emissions.',
    budget: '$22.0M',
    verifiedProgress: 92,
    beneficiariesCount: 4800,
    ecologicalAreaHectares: 450,
    partners: ['Rwanda Housing Authority', 'Atlas LifeHouse Labs'],
    provenance: {
      ...SAMPLE_PROVENANCE,
      id: 'PROV-KGL-401',
      verifier: 'African Circular Architecture Trust'
    }
  },
  {
    id: 'proj-nairobi-lifepod',
    title: 'Nairobi Peri-Urban Food Sovereignty Grid',
    region: 'Nairobi Metropolis',
    country: 'Kenya',
    coordinates: [-1.2864, 36.8172],
    scale: 'city',
    primaryLayer: 'food-security',
    impactHighlight: '120 distributed solar LifePod food production units producing 140 tons of fresh greens and tilapia monthly.',
    budget: '$6.8M',
    verifiedProgress: 84,
    beneficiariesCount: 110000,
    ecologicalAreaHectares: 120,
    partners: ['Nairobi Urban Farmers Union', 'Agro-Tech Trust'],
    provenance: {
      ...SAMPLE_PROVENANCE,
      id: 'PROV-NRB-330',
      verifier: 'Urban Food Systems Auditor'
    }
  },
  {
    id: 'proj-congo-basin',
    title: 'Congo Basin Indigenous Guardianship Ledger',
    region: 'Equateur Province',
    country: 'DR Congo',
    coordinates: [0.0384, 18.2612],
    scale: 'region',
    primaryLayer: 'ecological-restoration',
    impactHighlight: '250,000 hectares of primary rainforest protected via community-operated satellite LoRa sensor mesh and direct monthly basic dividends.',
    budget: '$34.0M',
    verifiedProgress: 72,
    beneficiariesCount: 45000,
    ecologicalAreaHectares: 250000,
    partners: ['Batwa Guardians Alliance', 'Congo Forest Trust'],
    provenance: {
      ...SAMPLE_PROVENANCE,
      id: 'PROV-CNG-902',
      verifier: 'Global Forest Canopy Audit'
    }
  }
];

export const RVE_ASSETS: RVEAsset[] = [
  {
    id: 'RVE-2026-BIO-001',
    title: 'Mara River Riparian Bioregion Restoration Credits',
    category: 'Biodiversity Corridor',
    region: 'East Africa / Narok Basin',
    vintage: '2026',
    unitPrice: 24.50,
    availableUnits: 184000,
    totalVolume: 500000,
    verifiedOutcomes: [
      '+34% river water clarity and microbiological purity',
      '420,000 native acacia and fig trees established',
      'Zero synthetic pesticide runoff in verified corridor'
    ],
    coBenefits: [
      '1,200 local women trained as certified seed-bank custodians',
      'Sustainable eco-tourism dividend paid to community trust'
    ],
    issuingEntity: 'Mara Watershed Restoration Cooperative',
    validator: 'Bureau Veritas & African Ecological Standard',
    proofHash: '0x3c99a812b1df4e8a7c2098bca4319800e8f712ac',
    status: 'Audited & Verified',
    images: ['/assets/rve_mara.jpg']
  },
  {
    id: 'RVE-2026-AQU-004',
    title: 'Kilifi Coastal Aquifer Recharge & Blue Mangrove Tokens',
    category: 'Water Aquifer Recharge',
    region: 'Coast Region / Indian Ocean Corridor',
    vintage: '2026',
    unitPrice: 18.00,
    availableUnits: 95000,
    totalVolume: 250000,
    verifiedOutcomes: [
      '1.4 billion liters groundwater recharge verified',
      '3,800 tons blue carbon sequestered annually',
      'Fish breeding biomass increased by 58%'
    ],
    coBenefits: [
      'Solar desalination drinking water kiosks for 6 villages',
      'Zero saline intrusion in agricultural wells'
    ],
    issuingEntity: 'Kilifi Blue Economy Trust',
    validator: 'Marine Ecological Integrity Auditors',
    proofHash: '0x77d12f90a98b411ec5a7304192bfe881c109a27e',
    status: 'Audited & Verified',
    images: ['/assets/rve_kilifi.jpg']
  },
  {
    id: 'RVE-2026-HAB-009',
    title: 'LifeHouse Regenerative Habitat Resilience Credits',
    category: 'Community Habitat',
    region: 'Great Lakes Bioregion',
    vintage: '2026',
    unitPrice: 42.00,
    availableUnits: 32000,
    totalVolume: 80000,
    verifiedOutcomes: [
      '380 permanent climate-resilient homes erected',
      '100% solar self-sufficiency with 48h battery reserve',
      'Zero municipal landfill waste via closed-loop composting'
    ],
    coBenefits: [
      '450 local youth trained in compressed-earth masonry',
      'Community healthcare hub built into central plaza'
    ],
    issuingEntity: 'Atlas Sanctum Habitat Trust',
    validator: 'UN-Habitat Certified Technical Review',
    proofHash: '0x991823abce10f84a511874bc09918da8712398ca',
    status: 'Audited & Verified',
    images: ['/assets/rve_habitat.jpg']
  }
];

export const LIFEHOUSE_SYSTEMS: LifeHouseSystem[] = [
  {
    id: 'lifepod',
    name: 'LifePod Distributed Food Node',
    tagline: 'Hyper-efficient modular closed-loop agriculture & protein production',
    purpose: 'Provides resilient, drought-proof local food production within a 20-foot shipping-container footprint, generating high-density leafy greens, mushrooms, and aquaculture protein with 95% less water than open agriculture.',
    specifications: {
      footprintSqM: 28,
      deploymentTimeHours: 12,
      solarCapacityKw: 4.8,
      waterPurificationLitersPerDay: 800,
      foodYieldKgPerMonth: 650,
      materials: ['Structural anodized aluminum frame', 'Recycled insulation foam', 'Aeroponic vertical towers', 'Micro-algae bioreactor'],
      carbonFootprint: 'Negative (Net -1.8 tCO2e/year)'
    },
    useCases: [
      'Peri-urban high-density informal settlements',
      'Arid pastoralist community bases',
      'School feeding program anchors',
      'Emergency disaster resilience hubs'
    ],
    readinessLevel: 'TRL 9 — Field Proven & Scaling'
  },
  {
    id: 'lifeshield',
    name: 'LifeShield Rapid Emergency Shelter',
    tagline: 'Dignified, climate-hardened transitional & emergency dwelling',
    purpose: 'A flat-pack, toolless deployment habitat engineered to replace flimsy refugee tents with dignified, insulated, solar-lit, water-harvesting dwellings within 2 hours of arrival.',
    specifications: {
      footprintSqM: 36,
      deploymentTimeHours: 2,
      solarCapacityKw: 1.2,
      waterPurificationLitersPerDay: 250,
      foodYieldKgPerMonth: 0,
      materials: ['Bamboo-composite honeycomb panels', 'Reflective thermal skin', 'Integrated gutter filtration', 'Self-leveling footings'],
      carbonFootprint: 'Ultra-low (0.24 tCO2e embodied)'
    },
    useCases: [
      'Climate displacement & flood evacuation centers',
      'Post-earthquake rapid reconstruction',
      'Medical triage and mobile clinics',
      'Seasonal agricultural worker housing'
    ],
    readinessLevel: 'TRL 8 — Commercial Deployment'
  },
  {
    id: 'regenerative-habitat',
    name: 'LifeHouse Complete Regenerative Habitat',
    tagline: 'Permanent multi-family circular dwelling integrated with nature',
    purpose: 'Permanent, multigenerational living architecture designed to generate more clean energy, fresh food, and purified water than its occupants consume, built using local stabilized earth and timber.',
    specifications: {
      footprintSqM: 140,
      deploymentTimeHours: 120,
      solarCapacityKw: 14.5,
      waterPurificationLitersPerDay: 2400,
      foodYieldKgPerMonth: 220,
      materials: ['Interlocking compressed earth blocks (ISSB)', 'Cross-laminated sustainable eucalyptus timber', 'Passive cooling chimney', 'Living green roof'],
      carbonFootprint: 'Net Carbon Negative (-14.2 tCO2e over 50 years)'
    },
    useCases: [
      'Decentralized eco-villages & rural agricultural settlements',
      'Affordable urban cooperative housing quarters',
      'Civic healthcare & educational staff compounds',
      'Intergenerational family homesteads'
    ],
    readinessLevel: 'TRL 9 — Built & Inhabited'
  }
];

export const INDUSTRIAL_FACILITIES: IndustrialFacility[] = [
  {
    id: 'ind-kigali-01',
    name: 'Atlas Advanced Bio-Composite Fabrication Node 1',
    location: 'Kigali Special Economic Zone, Rwanda',
    facilityType: 'Bio-Composite Processing',
    annualOutputCapacity: '2,400 LifeHouse Modular Building Shells / Year',
    cleanEnergyRatio: '100% (On-site 2MW Solar + Hydro)',
    localWorkforce: 380,
    status: 'Operational'
  },
  {
    id: 'ind-nairobi-02',
    name: 'Nairobi Precision Solar & IoT Assembly Works',
    location: 'Athi River Industrial Park, Kenya',
    facilityType: 'Solar-Thermal Assembly',
    annualOutputCapacity: '12,000 Microgrid Controllers & Sensor Units / Year',
    cleanEnergyRatio: '92% (Geothermal + Solar Array)',
    localWorkforce: 240,
    status: 'Operational'
  },
  {
    id: 'ind-mombasa-03',
    name: 'Mombasa Port Modular Desalination Foundry',
    location: 'Mombasa Maritime Corridor, Kenya',
    facilityType: 'Decentralized Micro-Foundry',
    annualOutputCapacity: '450 Solar Reverse-Osmosis Kiosks / Year',
    cleanEnergyRatio: '88% (Solar & Wind Co-gen)',
    localWorkforce: 195,
    status: 'Scaling'
  },
  {
    id: 'ind-kampala-04',
    name: 'Uganda Compressed Earth & Timber Processing Hub',
    location: 'Mukono Industrial District, Uganda',
    facilityType: 'Modular Habitat Fabrication',
    annualOutputCapacity: '1,800 LifeShield Rapid Deployable Shelters / Year',
    cleanEnergyRatio: '95% (Hydropower PPA)',
    localWorkforce: 310,
    status: 'Operational'
  }
];

export const CIVILIZATION_METRICS: CivilizationMetric[] = [
  {
    id: 'met-flourish-01',
    name: 'Composite Human Dignity Index',
    category: 'flourishing',
    value: '86.4',
    unit: 'Score (0-100)',
    trend: 14.8,
    status: 'verified',
    description: 'Measured across autonomous agency, access to clean shelter, nutrition, and freedom from economic coercion.',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'met-eco-02',
    name: 'Verified Regenerated Bioregion Area',
    category: 'ecological',
    value: '384,500',
    unit: 'Hectares',
    trend: 22.4,
    status: 'verified',
    description: 'Satellite LiDAR and soil core verified area restored to native biodiversity and perennial canopy cover.',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'met-eco-03',
    name: 'Annual Net Carbon Sequestration',
    category: 'ecological',
    value: '1.24',
    unit: 'Million tCO2e',
    trend: 31.0,
    status: 'verified',
    description: 'Direct atmospheric carbon dioxide permanently drawn down into deep soil, biomass, and long-lived bio-composite construction.',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'met-econ-04',
    name: 'Regenerative Patient Capital Deployed',
    category: 'economic',
    value: '$380.2',
    unit: '$ Millions',
    trend: 41.5,
    status: 'observed',
    description: 'Total non-extractive, mission-covenanted capital coordinated via the Regenerative Value Exchange.',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'met-econ-05',
    name: 'Dignified Regenerative Livelihoods Created',
    category: 'economic',
    value: '54,200',
    unit: 'Living Wage Jobs',
    trend: 19.8,
    status: 'verified',
    description: 'Living-wage employment in agroforestry, modular manufacturing, clean water operations, and digital stewardship.',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'met-soc-06',
    name: 'Institutional & Community Trust Quotient',
    category: 'social',
    value: '89.1%',
    unit: 'Consensus Trust Score',
    trend: 11.2,
    status: 'modeled',
    description: 'Surveyed community trust in local governance councils, transparent ledger audits, and fair resource distribution.',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'met-gen-07',
    name: '30-Year Resource Security Floor',
    category: 'generational',
    value: '94.2%',
    unit: 'Aquifer & Soil Health %',
    trend: 16.5,
    status: 'target',
    description: 'Projected capacity of regional soil and water systems to sustain next generation with zero depletion.',
    provenance: SAMPLE_PROVENANCE
  }
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-01',
    title: 'Causal Multi-Scale Modeling of Regenerative Value Corridors in Arid Tropics',
    category: 'Systems Architecture',
    authors: ['Dr. Sarah Kimani', 'Eng. Marcus Vance', 'Prof. Amina Al-Hassan'],
    publishedDate: 'July 2026',
    abstract: 'We present a mathematical and empirical framework for coupling satellite telemetry, IoT moisture sensor meshes, and non-extractive capital routing to restore degraded savannahs in East Africa. Results demonstrate a 3.8x acceleration in soil carbon accumulation.',
    citations: 48,
    doi: '10.1088/atlas.sys.2026.0411',
    readTime: '18 min read'
  },
  {
    id: 'paper-02',
    title: 'Moral Intelligence Protocols: Operationalizing Scriptural Ethics into Auditable Autonomous Logic',
    category: 'Moral AI',
    authors: ['Rev. David Ochieng, PhD', 'Dr. Elena Rostova', 'Atlas Sanctum Ethics Guild'],
    publishedDate: 'May 2026',
    abstract: 'This paper derives a zero-knowledge verifiable decision framework translating universal moral axioms (dignity, justice, protection of the vulnerable, patience) into algorithmic constraints for capital allocation and resource arbitration.',
    citations: 82,
    doi: '10.1088/atlas.moral.2026.0192',
    readTime: '24 min read'
  },
  {
    id: 'paper-03',
    title: 'Bio-Composite Compressed Earth Architecture: Life-Cycle Analysis and Thermal Dynamics of LifeHouse',
    category: 'Decentralized Infrastructure',
    authors: ['Arch. Jean-Luc Nkurunziza', 'Dr. Hannah Weber'],
    publishedDate: 'March 2026',
    abstract: 'An exhaustive structural and thermal analysis of 450 inhabited LifeHouse units across Rwanda and Kenya. The structures achieved 100% negative embodied carbon and reduced indoor peak temperatures by 8.4°C without active mechanical chilling.',
    citations: 64,
    doi: '10.1088/atlas.infra.2026.0089',
    readTime: '15 min read'
  }
];

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'course-01',
    title: 'Regenerative Systems Architecture & Multi-Scale Dynamics',
    level: 'Architect',
    duration: '8 Weeks (Self-Paced)',
    modulesCount: 14,
    instructor: 'Atlas Systems Guild',
    description: 'Master the theory and practical toolsets for mapping complex ecological-economic systems from planetary satellite layers down to community micro-watersheds.',
    enrolledCount: 3420
  },
  {
    id: 'course-02',
    title: 'Moral AI & Decision Architecture for Human Dignity',
    level: 'Practitioner',
    duration: '6 Weeks',
    modulesCount: 10,
    instructor: 'Moral Intelligence Lab',
    description: 'Learn how to implement ethical scorecards, uncertainty estimation, and auditable algorithmic guardrails that safeguard human agency and vulnerable stakeholders.',
    enrolledCount: 5120
  },
  {
    id: 'course-03',
    title: 'LifeHouse Engineering: Bio-Composite Modular Construction',
    level: 'Foundational',
    duration: '4 Weeks',
    modulesCount: 8,
    instructor: 'Atlas Industrial Systems',
    description: 'Hands-on training in compressed stabilized earth masonry, off-grid solar microgrid sizing, and closed-loop domestic water purification systems.',
    enrolledCount: 8900
  }
];

export const COMMONS_PROPOSALS: CommonsProposal[] = [
  {
    id: 'prop-01',
    proposalId: 'ASC-PROP-2026-42',
    title: 'Mandatory 30% Community Micro-Equity Floor for all RVE Industrial Expansions',
    authorGroup: 'East Africa Community Stewardship Alliance',
    votingDeadline: '2026-09-15',
    quorumReached: true,
    votesInFavor: 89400,
    votesAgainst: 4200,
    moralScorecardScore: 96,
    summary: 'Establishes an immutable requirement that every new manufacturing facility or renewable grid node must grant a minimum 30% perpetual non-dilutable equity stake to the local host community trust.',
    status: 'Active Vote'
  },
  {
    id: 'prop-02',
    proposalId: 'ASC-PROP-2026-38',
    title: 'Open Standard v3.1 for Soil Moisture Mesh Sensor Cryptographic Calibration',
    authorGroup: 'Open Hardware Foundation & Kenya Agro-Trust',
    votingDeadline: '2026-08-30',
    quorumReached: true,
    votesInFavor: 114000,
    votesAgainst: 1200,
    moralScorecardScore: 94,
    summary: 'Standardizes the zero-knowledge proof generation protocol for solar-powered soil capacitance sensors, preventing data tampering in carbon and biodiversity credit issuances.',
    status: 'Passed & Queued'
  }
];
