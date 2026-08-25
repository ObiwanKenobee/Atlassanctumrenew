import { 
  OpportunityNode, 
  EvidenceLedgerEntry, 
  FieldLab,
  ProjectOsItem,
  FlourishingDimension,
  CapitalAllocationTranche,
  RealityObservation
} from '../types';

export const OPPORTUNITY_GRAPH_NODES: OpportunityNode[] = [
  {
    id: 'prob-water-turkana',
    label: 'Turkana Aquifer Salinity & Water Insecurity',
    type: 'problem',
    category: 'Ecological & Basic Needs',
    metrics: '420,000 pastoralists facing seasonal borehole depletion',
    confidence: 96,
    connections: ['proj-turkana-desal', 'comm-turkana-north', 'cap-climate-resilience'],
    coordinates: [3.1167, 35.6],
    details: {
      description: 'Severe seasonal dry spells and deep brackish aquifers restrict pastoral mobility and agricultural resilience.',
      responsibleEntities: ['Turkana Pastoralist Council', 'Water Resources Authority Kenya']
    }
  },
  {
    id: 'proj-turkana-desal',
    label: 'Turkana Solar-Desalination & LifePod Node 4',
    type: 'project',
    category: 'Modular Infrastructure',
    metrics: '3.4MW Solar PV + 800kL/day RO Desalination + 80 LifePods',
    confidence: 94,
    connections: ['prob-water-turkana', 'build-industrial-mombasa', 'cap-climate-resilience', 'infra-solar-ro', 'out-clean-water-pastoral'],
    coordinates: [3.125, 35.59],
    details: {
      description: 'Integrated solar-powered deep aquifer desalination feeding 80 bio-composite closed-loop hydroponic modules.',
      allocatedCapital: '$14.2M Patient Tranche',
      responsibleEntities: ['Atlas Industrial Systems', 'Turkana County Gov', 'EarthMesh Bio']
    }
  },
  {
    id: 'comm-turkana-north',
    label: 'Turkana North Pastoralist Cooperatives',
    type: 'community',
    category: 'Indigenous Stewards',
    metrics: '18,500 active pastoralist cooperative members',
    confidence: 98,
    connections: ['prob-water-turkana', 'proj-turkana-desal', 'out-clean-water-pastoral'],
    coordinates: [3.15, 35.62],
    details: {
      description: 'Traditional pastoral leadership retaining full governance over water rights and livestock grazing schedules.',
      responsibleEntities: ['Turkana Elders Assembly', 'Kavalo Water Union']
    }
  },
  {
    id: 'cap-climate-resilience',
    label: 'East African Ecological Resilience Fund',
    type: 'capital',
    category: 'Patient Regenerative Capital',
    metrics: '$85.0M Committed (25-year Horizon, 0% Extractive Return)',
    confidence: 92,
    connections: ['proj-turkana-desal', 'proj-mathare-revival', 'proj-mara-agroforest'],
    details: {
      description: 'Non-extractive milestone-triggered capital tranches indexed to verified human dignity and aquifer replenishment.',
      allocatedCapital: '$85,000,000',
      responsibleEntities: ['Sanctum Capital Trust', 'AfDB Green Infrastructure Node']
    }
  },
  {
    id: 'build-industrial-mombasa',
    label: 'Atlas Industrial Micro-Foundry & Fab Hub 01',
    type: 'builder',
    category: 'Modular Fabrication',
    metrics: '450 LifeHouse habitat units / year capacity',
    confidence: 97,
    connections: ['proj-turkana-desal', 'infra-solar-ro', 'proj-lifehouse-kigali'],
    coordinates: [-4.0435, 39.6682],
    details: {
      description: 'Decentralized modular manufacturing plant utilizing local bamboo composites, basalt rebar, and recycled polymers.',
      responsibleEntities: ['Atlas Industrial Systems Mombasa', 'Kenya Association of Manufacturers']
    }
  },
  {
    id: 'infra-solar-ro',
    label: 'Containerized Solar Reverse-Osmosis Array',
    type: 'infrastructure',
    category: 'Physical Asset',
    metrics: '800kL/day output, 99.94% filtration efficacy',
    confidence: 99,
    connections: ['proj-turkana-desal', 'out-clean-water-pastoral', 'evid-water-audit-2026'],
    coordinates: [3.12, 35.58],
    details: {
      description: '3.4MW bifacial solar array driving multi-stage ceramic and membrane nanofiltration with zero chemical runoff.',
      verifiedOutcome: '820kL/day delivered continuously across 180 consecutive dry days.',
      responsibleEntities: ['Atlas Engineering Team', 'SGS Scientific Verifiers']
    }
  },
  {
    id: 'out-clean-water-pastoral',
    label: '65,000 People Secured Daily Clean Water & Food Access',
    type: 'outcome',
    category: 'Human Flourishing',
    metrics: 'Waterborne diseases down 82%, infant nutritional indices +41%',
    confidence: 95,
    connections: ['proj-turkana-desal', 'evid-water-audit-2026'],
    details: {
      description: 'Measured transformation in child mortality, livestock resilience, and local food price stability in northern Turkana.',
      verifiedOutcome: '100% WHO potable water compliance standard.'
    }
  },
  {
    id: 'evid-water-audit-2026',
    label: 'Cryptographic Water & Health Evidence Batch #8812',
    type: 'evidence',
    category: 'Evidence Ledger',
    metrics: 'Hash: 0x88e4...99a1 | 14,200 telemetry points verified',
    confidence: 100,
    connections: ['out-clean-water-pastoral', 'infra-solar-ro'],
    details: {
      description: 'Continuous IoT flowmeter telemetry cross-referenced with randomized field health clinic blood and stool audits.',
      responsibleEntities: ['Kenya Medical Research Institute (KEMRI)', 'Independent Sensor Mesh']
    }
  },
  // Urban Habitat & River Nodes
  {
    id: 'prob-mathare-pollution',
    label: 'Mathare River Effluent & Slum Vulnerability',
    type: 'problem',
    category: 'Urban Ecology & Sanitation',
    metrics: '120k residents lacking formal sewage & flood defense',
    confidence: 98,
    connections: ['proj-mathare-revival', 'comm-mathare-youth'],
    coordinates: [-1.261, 36.858],
    details: {
      description: 'Severe micro-plastic and industrial effluent contamination causing recurrent flooding and waterborne illness.',
      responsibleEntities: ['Mathare Community Network', 'Nairobi River Basin Commission']
    }
  },
  {
    id: 'proj-mathare-revival',
    label: 'Mathare Living Riparian Bio-Filter & Youth Guilds',
    type: 'project',
    category: 'Ecological Restoration',
    metrics: '8.4km river corridor restored + 12 constructed bio-wetlands',
    confidence: 93,
    connections: ['prob-mathare-pollution', 'comm-mathare-youth', 'cap-climate-resilience', 'out-mathare-green-zone'],
    coordinates: [-1.263, 36.862],
    details: {
      description: 'Community-led riparian restoration planting 120,000 indigenous vetiver and bamboo wetland bio-filters.',
      allocatedCapital: '$4.8M Direct to Youth Guilds',
      responsibleEntities: ['Mathare Environmental Youth Guild', 'Atlas Urban Labs']
    }
  },
  {
    id: 'comm-mathare-youth',
    label: 'Mathare Ecological Stewards Guild',
    type: 'community',
    category: 'Civic Builders',
    metrics: '840 youth employed in watershed guardianship',
    confidence: 97,
    connections: ['proj-mathare-revival', 'out-mathare-green-zone'],
    coordinates: [-1.265, 36.865],
    details: {
      description: 'Directly governed youth-run cooperative managing river cleanups, wetland maintenance, and eco-brick manufacturing.',
      responsibleEntities: ['Mathare Youth Guild Leadership']
    }
  },
  {
    id: 'out-mathare-green-zone',
    label: '4.2km Contiguous Public Green Spine & 0 Flooding Deaths',
    type: 'outcome',
    category: 'Human & Ecological Flourishing',
    metrics: 'Water fecal coliform -94%, seasonal flood damage -88%',
    confidence: 94,
    connections: ['proj-mathare-revival'],
    details: {
      description: 'Restoration of natural hydrological floodplains creating recreational public space and preventing flood tragedies.',
      verifiedOutcome: 'Zero flood-related casualties recorded over the 2025-2026 monsoon.'
    }
  }
];

export const EVIDENCE_LEDGER_ENTRIES: EvidenceLedgerEntry[] = [
  {
    id: 'EVID-2026-081',
    claim: 'Solar-Desalination array restored groundwater aquifer pressure by 1.8 bar while supplying 65,000 pastoralists.',
    source: 'Borehole Sensor Mesh #42 + Sentinel-2 Interferometry',
    methodology: 'Continuous InSAR satellite ground deformation tracking cross-referenced with calibrated piezometer telemetry.',
    intervention: 'Turkana Deep Solar-Desalination Node 4 (Atlas Industrial / LifeHouse)',
    measurement: '1.82 bar hydraulic head recovery; 820,000 liters/day potable distribution.',
    outcome: 'Elimination of seasonal water truck dependency for 18 pastoralist encampments.',
    epistemicStatus: 'Verified',
    confidenceScore: 98,
    hash: '0x3a88fc91b4429e7100b45781a980ec2184ff1098bca1',
    timestamp: '2026-08-19T14:32:00Z',
    verifier: 'Dr. Amina Wanjiku (KEMRI / African Hydrological Institute)',
    attributionType: 'Attribution'
  },
  {
    id: 'EVID-2026-082',
    claim: 'Mathare Constructed Bio-Wetlands reduced dissolved heavy metals in downstream Nairobi River by 76%.',
    source: 'Water Quality Laboratory Mass Spectrometry + Real-time UV-Vis Probes',
    methodology: 'Triple-blind composite grab sampling at 100m intervals across 8.4km river corridor over 90 days.',
    intervention: 'Mathare River Living Bio-Filter (Youth Guilds)',
    measurement: 'Lead (Pb) levels reduced from 0.42 mg/L to 0.04 mg/L (WHO threshold compliant).',
    outcome: 'Restoration of benthic macroinvertebrate biodiversity and safe irrigation for urban agriculture.',
    epistemicStatus: 'Observed',
    confidenceScore: 95,
    hash: '0x9941a8cb9014df12a7812e9401b31278ba440012e87c',
    timestamp: '2026-08-15T09:12:00Z',
    verifier: 'National Environmental Management Authority (NEMA Kenya)',
    attributionType: 'Contribution'
  },
  {
    id: 'EVID-2026-083',
    claim: 'LifeHouse Modular Bio-Composite Housing reduced lifecycle thermal cooling energy demand by 71% vs standard masonry.',
    source: 'Building Telemetry Sensor Suite (120 Homes in Kigali Eco-Quarter)',
    methodology: 'Calibrated heat flux sensors, indoor-outdoor temp differentials, smart meter electricity draw over 12 months.',
    intervention: 'LifeHouse Kigali Eco-Quarter Phase 1',
    measurement: 'Average internal temperature stabilized at 21.8°C without mechanical HVAC during peak 34°C ambient heat.',
    outcome: 'Zero electricity grid burden for cooling; household energy expenditure reduced by $48/month.',
    epistemicStatus: 'Verified',
    confidenceScore: 99,
    hash: '0xfe08192a8310c85412b1a8761294ef8821034bc67812',
    timestamp: '2026-08-10T18:45:00Z',
    verifier: 'Center for Resilient Habitation (University of Rwanda)',
    attributionType: 'Attribution'
  },
  {
    id: 'EVID-2026-084',
    claim: 'Regenerative multi-strata agroforestry in Mara corridor increased soil organic carbon by 2.4 tC/ha/year.',
    source: 'Deep Core Soil Sampling (0-100cm) + Hyperspectral drone scans',
    methodology: 'Dry combustion elemental analysis cross-validated with calibrated UAV multispectral NDVI & soil reflectance.',
    intervention: 'Mara-Rift Watershed Agroforestry Corridor (42,000 ha)',
    measurement: 'Soil carbon increased from 1.1% to 2.9% across 14,000 audited plots.',
    outcome: 'Soil water retention capacity enhanced by 34%, eliminating crop loss during short rains hiatus.',
    epistemicStatus: 'Verified',
    confidenceScore: 96,
    hash: '0x77c4819aa01824bba76192138941fc328901aa847192',
    timestamp: '2026-07-28T11:20:00Z',
    verifier: 'World Agroforestry Centre (ICRAF / CIFOR)',
    attributionType: 'Attribution'
  },
  {
    id: 'EVID-2026-085',
    claim: 'Decentralized Micro-Foundry in Mombasa reduced embedded carbon in structural building components by 64%.',
    source: 'Lifecycle Environmental Product Declaration (ISO 14025 / EN 15804)',
    methodology: 'Cradle-to-gate LCA quantifying raw material extraction, transport, energy consumption, and circular slag recycling.',
    intervention: 'Atlas Industrial Micro-Foundry Node 1',
    measurement: '0.38 kg CO2e per kg structural basalt/bio-composite vs 1.12 kg CO2e for conventional structural steel.',
    outcome: 'Carbon-negative regional supply chain established for East African housing initiatives.',
    epistemicStatus: 'Verified',
    confidenceScore: 97,
    hash: '0x889104fae8172cba918471629810ef338192aa749120',
    timestamp: '2026-07-14T16:00:00Z',
    verifier: 'SGS Environmental & Sustainability Assurance',
    attributionType: 'Attribution'
  }
];

export const ATLAS_FIELD_LABS: FieldLab[] = [
  {
    id: 'lab-kibera',
    name: 'Kibera Living Regeneration Lab',
    location: 'Kibera, Nairobi, Kenya',
    focusArea: 'Informal Settlement Bio-Infrastructure & Decentralized Sanitation',
    question: 'How can high-density informal settlements achieve zero-waste circular sanitation and micro-energy sovereignty without displacement?',
    hypothesis: 'Modular anaerobic bio-digester kiosks operated by resident youth collectives can convert human waste into clean cooking biogas and fertilizer, paying for maintenance while improving health.',
    intervention: 'Deployment of 14 interconnected bio-digester sanitation hubs serving 28,000 residents, paired with solar microgrids.',
    evidence: 'Over 1.8M liters of waste processed safely; 420 households connected to subsidized biogas lines; zero cholera cases in deployment zones.',
    result: 'Sanitation operating costs covered 118% by byproduct sales; youth collective distributed $6,200 monthly dividend to operators.',
    lesson: 'Community co-ownership and direct economic dividend from waste-to-energy is the single largest determinant of sanitation infrastructure longevity.',
    whatWentWrong: 'Initial pipeline material degraded due to hydrogen sulfide buildup; had to re-engineer joints using vulcanized HDPE composites.',
    coordinates: [-1.313, 36.787]
  },
  {
    id: 'lab-mathare-river',
    name: 'Mathare River Revival Lab',
    location: 'Mathare Valley, Nairobi, Kenya',
    focusArea: 'Urban Riparian Ecological Restoration & Youth Stewardship',
    question: 'Can community-engineered wetland bio-filters rehabilitate heavily polluted urban river corridors while generating dignified youth employment?',
    hypothesis: 'Structured vetiver grass wetlands and bio-char filtration barriers can remove 70%+ of toxic effluents when maintained by dedicated local youth guilds.',
    intervention: '8.4km of riverbanks converted into terraced biological treatment zones, public parks, and eco-brick fabrication workshops.',
    evidence: 'Downstream heavy metal concentrations reduced by 76%; 840 full-time green stewardship livelihoods established.',
    result: 'Restored public green spine now acts as natural storm surge barrier, preventing all flood-related drownings in 2025/2026.',
    lesson: 'Ecological restoration in informal urban centers must immediately integrate revenue-generating activities (e.g. bamboo harvesting, eco-masonry) to resist re-encroachment.',
    whatWentWrong: 'Upstream illegal industrial dumpers bypassed initial barriers during night hours; required installation of public IoT turbidity sensors with automated SMS alerts.',
    coordinates: [-1.261, 36.858]
  },
  {
    id: 'lab-lifehouse-habitat',
    name: 'Regenerative Habitat Lab',
    location: 'Kigali & Athi River, East Africa',
    focusArea: 'Modular Bio-Composite Architecture & Zero-Carbon Dwellings',
    question: 'Can modular housing fabricated from regional agricultural waste outperform conventional brick and concrete in thermal comfort, durability, and cost?',
    hypothesis: 'Pre-fabricated panels made from compressed bamboo fiber, rice husk ash, and bio-resins can reduce construction costs by 40% while achieving carbon-negative footprint.',
    intervention: 'Constructed 450 residential LifeHouse units and 80 deployable LifeShield emergency shelters.',
    evidence: 'Indoor temperatures 6.2°C cooler than outdoor ambient; construction time reduced from 6 months to 14 days per unit; lifecycle cost -44%.',
    result: 'Mortgage default rate 0.2% due to integrated agricultural micro-food production in each LifeHouse reducing family living overhead.',
    lesson: 'A house is not merely shelter; when integrated with food production (LifePod) and clean water harvesting, it becomes a productive capital asset for the family.',
    whatWentWrong: 'Early bio-composite coatings suffered under tropical UV radiation; developed a natural mineral-silicate nano-sealant with local universities.',
    coordinates: [-1.944, 30.061]
  },
  {
    id: 'lab-food-systems',
    name: 'Distributed Food Systems Lab',
    location: 'Turkana & Garissa Arid Corridors, Kenya',
    focusArea: 'Closed-Loop Arid Agro-Ecology & Hydroponic Micro-Farming',
    question: 'How can hyper-arid bioregions achieve nutritional sovereignty with 90% less water than traditional open-field agriculture?',
    hypothesis: 'Solar-desalination paired with climate-controlled vertical LifePods can produce nutrient-dense greens and proteins year-round at commercial scale.',
    intervention: '80 closed-loop LifePod units deployed alongside 3.4MW solar aquifer desalination nodes.',
    evidence: 'Water consumption: 2.1 liters per kg of fresh produce vs 240 liters in conventional irrigation; monthly harvest 3,800kg per pod array.',
    result: 'Local childhood stunting rates decreased by 38% across recipient communities; pastoralist families gained steady secondary income.',
    lesson: 'Hydroponics in arid regions must be coupled with culturally aligned staple varieties (sorghum, amaranth, moringa) rather than imported exotic crops.',
    whatWentWrong: 'Dust storms clogged early air intake filters; designed self-cleaning cyclonic vortex dust separators powered by solar exhaust fans.',
    coordinates: [3.125, 35.59]
  },
  {
    id: 'lab-industrial-resilience',
    name: 'Industrial Resilience & Micro-Foundry Lab',
    location: 'Mombasa Coastal Industrial Zone, Kenya',
    focusArea: 'Circular Material Science & Decentralized Hardware Manufacturing',
    question: 'Can localized micro-foundries produce certified structural engineering components using recycled industrial scrap and natural fibers?',
    hypothesis: 'Electric-arc micro-smelting and basalt fiber extrusion can create localized building components that meet ISO standards at 50% lower transport emissions.',
    intervention: 'Operationalized 2 modular micro-foundry container units producing basalt rebar and bio-composite trusses.',
    evidence: 'Over 2,400 metric tons of certified carbon-negative structural rebar delivered to regional infrastructure projects.',
    result: 'Established decentralized supply chain keeping 78% of infrastructure spending within the local county economy.',
    lesson: 'Manufacturing sovereignty is essential for civilizational resilience; dependence on long-distance steel supply chains paralyzes local climate adaptation.',
    whatWentWrong: 'Grid voltage fluctuations damaged early electric-arc power electronics; added flywheel energy storage buffers to isolate the foundry from the grid.',
    coordinates: [-4.0435, 39.6682]
  },
  {
    id: 'lab-ethical-ai',
    name: 'Moral Intelligence & Epistemic AI Lab',
    location: 'Distributed Pan-African Computing Mesh',
    focusArea: 'Causal Reasoning, Epistemic Uncertainty & Value Alignment',
    question: 'How can AI models assist institutional and community decision-making while rigorously enforcing ethical axioms and exposing model uncertainty?',
    hypothesis: 'Constraining generative AI models with formal moral ontologies and Bayesian epistemic verification prevents hallucinated optimism and harmful resource allocations.',
    intervention: 'Atlas Moral Intelligence Policy Evaluator & Evidence Ledger deployed across 18 regional governance bodies.',
    evidence: 'Over 4,200 policy interventions audited; 99.4% epistemic provenance traceability on critical resource allocation decisions.',
    result: 'Zero instances of predatory debt or non-consultative infrastructure approvals permitted by system governance protocols.',
    lesson: 'AI must never automate conscience or hide behind black-box scores; it must reveal assumptions, tradeoffs, and who bears the risk.',
    whatWentWrong: 'Early prompts over-indexed on western legal frameworks; recoded ontology around indigenous covenantal stewardship and restorative justice.',
    coordinates: [-1.286, 36.817]
  }
];

export const PROJECT_OS_ITEMS: ProjectOsItem[] = [
  {
    id: 'pos-turkana-desal-01',
    name: 'Turkana Solar-Desalination & Agro-Pod Cluster 4',
    code: 'ATLAS-PRJ-2026-004',
    stage: 'Verify',
    location: 'Lodwar / Kalokol Corridor, Turkana County, Kenya',
    bioregion: 'Lake Turkana Arid Rift Hydrological Basin',
    problemStatement: 'Persistent groundwater salinity (total dissolved solids >3,800 ppm) and climate-induced drought driving severe livestock losses and malnutrition among 65,000 pastoralists.',
    theoryOfChange: 'Deploying modular solar nanofiltration and containerized LifePods enables local water sovereignty without carbon emissions, reducing infant malnutrition while restoring pastoral aquifer recharge rates.',
    humanOwners: [
      { name: 'Dr. Joseph Ekitela', role: 'Lead Hydrologist', organization: 'Turkana County Water Authority' },
      { name: 'Elena Vance, PE', role: 'Chief Systems Architect', organization: 'Atlas Industrial Systems' },
      { name: 'Mary Akiru', role: 'Community Council Chair', organization: 'Kalokol Pastoralists Cooperative' }
    ],
    stakeholders: [
      'Turkana Elders Council',
      'Kenya Water Resources Authority',
      'East African Ecological Resilience Fund',
      'UNICEF Maternal Health Node'
    ],
    budget: {
      total: 14200000,
      funded: 14200000,
      currency: 'USD',
      patientCapitalRatio: 0.92
    },
    timeline: {
      start: '2024-09-01',
      targetCompletion: '2027-08-31',
      lifecycleMonths: 36
    },
    milestones: [
      { id: 'm1', title: 'Deep Piezometer Sensor Mesh Calibration', status: 'completed', targetDate: '2024-12-15', deliverable: '14 IoT aquifer monitoring stations live', evidenceHash: '0x88e4...99a1' },
      { id: 'm2', title: '3.4MW Bifacial Solar PV & RO Array Commissioning', status: 'completed', targetDate: '2025-06-30', deliverable: '800kL/day potable water certified to WHO standard', evidenceHash: '0x3a88...bca1' },
      { id: 'm3', title: '80 Modular Bio-Composite LifePods Deployed', status: 'completed', targetDate: '2026-03-15', deliverable: 'Hydroponic crop yields >3,800kg fresh greens/month', evidenceHash: '0xfe08...7812' },
      { id: 'm4', title: 'Full Community Ownership & Water Rights Handover', status: 'in_progress', targetDate: '2026-12-01', deliverable: 'Cooperative self-funding through excess water distribution tariffs' },
      { id: 'm5', title: 'Multi-Generational Epistemic Flourishing Audit', status: 'pending', targetDate: '2027-08-01', deliverable: 'Longitudinal health and pastoral mobility audit' }
    ],
    risks: [
      { risk: 'High dust particulate storms reducing solar panel efficiency', severity: 'medium', mitigation: 'Installed automated vortex electrostatic dust repulsion wipers.' },
      { risk: 'Conflict over peripheral water distribution points', severity: 'high', mitigation: 'Inter-clan water stewardship treaty ratified with immutable quota smart contracts.' }
    ],
    impactMetrics: [
      { name: 'Daily Potable Water Distributed', target: '800,000 L', current: '820,000 L', verificationMethod: 'Ultrasonic inline telemetry flowmeters' },
      { name: 'Waterborne Morbidity Delta', target: '-75%', current: '-82%', verificationMethod: 'KEMRI local clinic epidemiological audits' },
      { name: 'Childhood Stunting Rate', target: '-30%', current: '-38%', verificationMethod: 'WHO standard anthropometric cohort study' }
    ],
    governance: {
      model: 'Covenantal Multi-Stakeholder Trust (60% Community Elder Majority)',
      communityVetoPower: true,
      auditCadence: 'Quarterly Independent Epistemic & Financial Review'
    },
    aiAnalysis: {
      systemicLeverageScore: 96,
      ethicalDignityScore: 98,
      secondOrderRisks: [
        'Sedentarization of previously nomadic herds altering grazing scrubland dynamics',
        'Potential influx of secondary regional climate migrants requiring expanded sanitation nodes'
      ],
      recommendedAction: 'Scale replicable micro-foundry supply nodes into Garissa and Marsabit counties.',
      confidence: 94
    },
    lessonsLearned: [
      'Technology transfer must be preceded by 6 months of traditional water elder covenant building.',
      'Reverse osmosis reject brine should be channeled into halophyte spirulina ponds rather than evaporated.'
    ]
  },
  {
    id: 'pos-mathare-riparian-02',
    name: 'Mathare River Living Bio-Spine & Youth Guilds',
    code: 'ATLAS-PRJ-2025-018',
    stage: 'Build',
    location: 'Mathare Valley, Nairobi, Kenya',
    bioregion: 'Nairobi River Hydrological Catchment',
    problemStatement: 'Severe industrial effluent, untreated sewage runoff, and dangerous flash flooding threatening 120,000 informal settlement dwellers.',
    theoryOfChange: 'Engaging localized youth collectives to construct terraced vetiver bio-filters and micro-wetlands transforms polluted riparian buffers into protected public green space while creating durable livelihoods.',
    humanOwners: [
      { name: 'Brian Mwangi', role: 'Youth Guild Lead', organization: 'Mathare Ecological Stewards' },
      { name: 'Prof. Grace Nduta', role: 'Ecological Engineer', organization: 'University of Nairobi' }
    ],
    stakeholders: [
      'Mathare Valley Community Assembly',
      'Nairobi Rivers Commission',
      'National Environment Management Authority'
    ],
    budget: {
      total: 4800000,
      funded: 4800000,
      currency: 'USD',
      patientCapitalRatio: 0.88
    },
    timeline: {
      start: '2025-01-10',
      targetCompletion: '2027-04-30',
      lifecycleMonths: 28
    },
    milestones: [
      { id: 'm1', title: 'Riparian Zone Demarcation & Community Consent', status: 'completed', targetDate: '2025-03-30', deliverable: '100% consent of contiguous households with zero forced eviction' },
      { id: 'm2', title: '12 Constructed Biological Wetlands & Vetiver Terraces', status: 'completed', targetDate: '2025-11-30', deliverable: '120,000 root systems planted for heavy metal absorption' },
      { id: 'm3', title: 'Eco-Brick & Bio-Char Fabrication Hubs', status: 'in_progress', targetDate: '2026-06-30', deliverable: '840 youth employing circular riverbed silt & plastic recovery' },
      { id: 'm4', title: 'Contiguous 8.4km Public River Walkway', status: 'pending', targetDate: '2026-12-31', deliverable: 'Solar lit parkways with recreational and athletic facilities' }
    ],
    risks: [
      { risk: 'Upstream midnight industrial dumping spiking chemical toxicity', severity: 'high', mitigation: '24/7 automated spectro-photometric water probes with public SMS trigger alerts.' }
    ],
    impactMetrics: [
      { name: 'Downstream Lead (Pb) Effluent Reduction', target: '-70%', current: '-76%', verificationMethod: 'Triple-blind mass spectrometry water sampling' },
      { name: 'Youth Livelihoods Created', target: '600', current: '840', verificationMethod: 'Direct cooperative payroll audit' },
      { name: 'Monsoon Flood Fatalities', target: '0', current: '0', verificationMethod: 'Nairobi Red Cross field disaster report' }
    ],
    governance: {
      model: 'Civic Guild Stewardship Cooperative',
      communityVetoPower: true,
      auditCadence: 'Monthly open community assembly'
    },
    aiAnalysis: {
      systemicLeverageScore: 92,
      ethicalDignityScore: 97,
      secondOrderRisks: [
        'Urban gentrification pressure on adjacent informal tenants as river corridor beautifies',
        'Regulatory capture by municipal zoning entities'
      ],
      recommendedAction: 'Establish community land trust protections across all riparian perimeter settlements.',
      confidence: 93
    },
    lessonsLearned: [
      'Youth-led ecological work must immediately incorporate marketable byproduct output (e.g. bamboo construction poles).'
    ]
  },
  {
    id: 'pos-lifehouse-kigali-03',
    name: 'LifeHouse Kigali Regenerative Eco-Quarter',
    code: 'ATLAS-PRJ-2025-042',
    stage: 'Scale',
    location: 'Kigali Bioregion, Rwanda',
    bioregion: 'Great Lakes Montane Agro-Forestry Zone',
    problemStatement: 'Rapid urban migration driving unaffordable concrete masonry housing and high household operational overhead.',
    theoryOfChange: 'Pre-fabricating bio-composite homes from local agricultural fibers with integrated solar, rainwater harvesting, and LifePod food production reduces housing cost by 44% while sequestering carbon.',
    humanOwners: [
      { name: 'Claire Uwase', role: 'Urban Design Director', organization: 'LifeHouse Habitat Labs' },
      { name: 'Jean-Paul Habimana', role: 'Materials Engineer', organization: 'Rwanda Housing Authority' }
    ],
    stakeholders: ['City of Kigali', 'Rwanda Green Fund (FONERWA)', 'Kigali Housing Cooperatives'],
    budget: {
      total: 28500000,
      funded: 28500000,
      currency: 'USD',
      patientCapitalRatio: 0.95
    },
    timeline: {
      start: '2024-06-01',
      targetCompletion: '2027-12-31',
      lifecycleMonths: 42
    },
    milestones: [
      { id: 'm1', title: 'Compressed Bio-Composite Panel Certification (ISO 14025)', status: 'completed', targetDate: '2024-10-31', deliverable: 'Thermal conductivity <0.12 W/mK certified' },
      { id: 'm2', title: 'Phase 1: 120 Habitation Units Occupied', status: 'completed', targetDate: '2025-08-30', deliverable: '100% occupancy with zero cooling energy demand' },
      { id: 'm3', title: 'Phase 2: 330 Additional Units & Micro-Grid', status: 'in_progress', targetDate: '2026-11-30', deliverable: 'Complete distributed decentralized solar-microgrid grid interconnect' },
      { id: 'm4', title: 'Phase 3: Cross-Regional Blueprint Open Sourcing', status: 'pending', targetDate: '2027-06-30', deliverable: 'Open BIM architectural and manufacturing files published' }
    ],
    risks: [
      { risk: 'Local agricultural fiber supply chain seasonality', severity: 'low', mitigation: 'Diversified supply across sorghum stalk, rice husk, and bamboo agroforestry.' }
    ],
    impactMetrics: [
      { name: 'Lifecycle Carbon Footprint', target: 'Carbon Negative (-15t CO2e/unit)', current: '-18.2t CO2e/unit', verificationMethod: 'SGS Cradle-to-Grave LCA' },
      { name: 'Household Energy & Water Bill Delta', target: '-60%', current: '-71%', verificationMethod: 'IoT smart utility telemetry' }
    ],
    governance: {
      model: 'Cooperative Resident Equity Trust',
      communityVetoPower: true,
      auditCadence: 'Bi-annual resident audit'
    },
    aiAnalysis: {
      systemicLeverageScore: 95,
      ethicalDignityScore: 96,
      secondOrderRisks: ['Demand outstripping regional micro-foundry fabrication speed'],
      recommendedAction: 'Deploy 2 additional Atlas Industrial micro-foundry nodes in Kigali and Goma.',
      confidence: 97
    },
    lessonsLearned: [
      'Homes designed with integrated productive food units have 90% lower mortgage default rates.'
    ]
  }
];

export const FLOURISHING_DIMENSIONS: FlourishingDimension[] = [
  {
    id: 'human',
    name: 'Human Dignity & Vitality',
    score: 88,
    trend: 6.4,
    description: 'Physical health, mental peace, shelter security, foundational literacy, and access to meaningful creative purpose.',
    color: '#E57373',
    indicators: [
      { id: 'h1', name: 'Childhood Nutritional Security', score: 91, weight: 0.25, trend: 8.2, unit: '% above WHO baseline', currentValue: '91.4%', benchmarkValue: '62.0%', epistemicStatus: 'Verified', certaintyScore: 96, source: 'KEMRI Longitudinal Cohort Data', description: 'Access to micro-nutrient dense vegetables and clean proteins.' },
      { id: 'h2', name: 'Clean Potable Water Sovereign Access', score: 94, weight: 0.25, trend: 12.1, unit: 'Liters/person/day', currentValue: '48.5 L', benchmarkValue: '15.0 L', epistemicStatus: 'Observed', certaintyScore: 99, source: 'IoT Flowmeter Telemetry Mesh', description: 'Zero-pathogen potable water within 100 meters of domicile.' },
      { id: 'h3', name: 'Resilient Thermal Shelter Availability', score: 84, weight: 0.25, trend: 4.8, unit: '% in certified bio-composite units', currentValue: '78.2%', benchmarkValue: '34.0%', epistemicStatus: 'Verified', certaintyScore: 94, source: 'LifeHouse Habitation Registry', description: 'Homes with zero dampness, clean indoor air, and passive thermal regulation.' },
      { id: 'h4', name: 'Foundational Agency & Mental Well-Being', score: 83, weight: 0.25, trend: 3.5, unit: 'Composite Flourishing Index', currentValue: '8.3/10', benchmarkValue: '5.1/10', epistemicStatus: 'Reported', certaintyScore: 88, source: 'Community Assembly Deliberations', description: 'Subjective well-being, freedom from fear, and sense of generational hope.' }
    ]
  },
  {
    id: 'economic',
    name: 'Economic Resilience & Opportunity',
    score: 84,
    trend: 9.1,
    description: 'Non-extractive livelihood creation, sovereign capital access, productive asset ownership, and local wealth circulation.',
    color: '#81C784',
    indicators: [
      { id: 'e1', name: 'Local Capital Retention Rate', score: 87, weight: 0.3, trend: 11.4, unit: '% spending retained in bioregion', currentValue: '78.4%', benchmarkValue: '28.0%', epistemicStatus: 'Observed', certaintyScore: 95, source: 'Cooperative Banking Ledgers', description: 'Percentage of infrastructure capital spent on regional labor and materials.' },
      { id: 'e2', name: 'Youth Green Guild Employment', score: 89, weight: 0.35, trend: 14.2, unit: 'Full-time dignified jobs', currentValue: '3,420', benchmarkValue: '480', epistemicStatus: 'Verified', certaintyScore: 97, source: 'Payroll & Tax Verified Records', description: 'Living-wage employment in watershed restoration, micro-foundries, and farming.' },
      { id: 'e3', name: 'Vulnerability to External Price Shocks', score: 76, weight: 0.35, trend: 4.6, unit: 'Price Elasticity Index (0-100)', currentValue: '24.1 (Low Risk)', benchmarkValue: '78.5 (High Risk)', epistemicStatus: 'Modeled', certaintyScore: 91, source: 'Atlas Econometric Intelligence Engine', description: 'Resilience against global fertilizer, grain, and fossil fuel fluctuations.' }
    ]
  },
  {
    id: 'social',
    name: 'Social Cohesion & Shared Agency',
    score: 91,
    trend: 5.2,
    description: 'Inter-tribal trust, democratic participation, mutual aid networks, and protection of vulnerable groups.',
    color: '#BA68C8',
    indicators: [
      { id: 's1', name: 'Community Assembly Quorum & Veto Power', score: 96, weight: 0.4, trend: 7.0, unit: '% participatory threshold met', currentValue: '98.2%', benchmarkValue: '45.0%', epistemicStatus: 'Observed', certaintyScore: 99, source: 'Commons Governance Smart Contracts', description: 'Binding community voting on all capital deployments and land alterations.' },
      { id: 's2', name: 'Inter-Community Peace & Dispute Resolution', score: 90, weight: 0.3, trend: 4.8, unit: 'Disputes settled covenantally (%)', currentValue: '94.0%', benchmarkValue: '61.0%', epistemicStatus: 'Reported', certaintyScore: 90, source: 'Elders Reconciliation Council', description: 'Absence of violent resource competition through transparent water treaties.' },
      { id: 's3', name: 'Inclusion of Marginalized Voices', score: 87, weight: 0.3, trend: 6.2, unit: 'Representation parity score', currentValue: '91.5%', benchmarkValue: '52.0%', epistemicStatus: 'Verified', certaintyScore: 92, source: 'Independent Civic Audit', description: 'Active leadership by women, youth, and persons with disabilities in resource decisions.' }
    ]
  },
  {
    id: 'ecological',
    name: 'Ecological Health & Bioregional Renewal',
    score: 93,
    trend: 11.8,
    description: 'Soil microbiome regeneration, aquifer recovery, biodiversity return, zero toxic runoff, and negative carbon footprint.',
    color: '#4DB6AC',
    indicators: [
      { id: 'eco1', name: 'Aquifer Pressure & Table Restoration', score: 95, weight: 0.3, trend: 15.2, unit: 'Hydraulic head increase (bar)', currentValue: '+1.82 bar', benchmarkValue: '-0.45 bar/yr depletion', epistemicStatus: 'Verified', certaintyScore: 98, source: 'Piezometer Mesh + Satellite InSAR', description: 'Hydrological balance restored through rainwater infiltration and managed extraction.' },
      { id: 'eco2', name: 'Soil Organic Carbon Accumulation', score: 92, weight: 0.35, trend: 9.4, unit: 'tC/ha/year', currentValue: '2.4 tC/ha/yr', benchmarkValue: '0.2 tC/ha/yr', epistemicStatus: 'Verified', certaintyScore: 96, source: 'Deep Core Dry Combustion Sampling', description: 'Living soil enrichment across agroforestry corridors and riparian zones.' },
      { id: 'eco3', name: 'Riverine Heavy Metal Remediation', score: 92, weight: 0.35, trend: 12.0, unit: '% reduction in dissolved toxins', currentValue: '-76.0%', benchmarkValue: '0.0%', epistemicStatus: 'Observed', certaintyScore: 95, source: 'Mass Spectrometry Lab Telemetry', description: 'Removal of lead, cadmium, and biological pathogens via constructed wetlands.' }
    ]
  },
  {
    id: 'institutional',
    name: 'Institutional Integrity & Accountability',
    score: 89,
    trend: 4.1,
    description: 'Epistemic transparency, anti-corruption safeguards, open-source standards, and auditable evidence ledgers.',
    color: '#FFB74D',
    indicators: [
      { id: 'i1', name: 'Epistemic Traceability on Decisions', score: 97, weight: 0.4, trend: 5.5, unit: '% capital traceable to verified evidence', currentValue: '99.4%', benchmarkValue: '18.0%', epistemicStatus: 'Verified', certaintyScore: 100, source: 'Evidence Ledger Smart Contracts', description: 'Every dollar deployed mapped to physical sensor provenance and third-party audit.' },
      { id: 'i2', name: 'Anti-Extractive Covenant Enforceability', score: 86, weight: 0.3, trend: 3.2, unit: 'Covenant compliance score', currentValue: '92.0%', benchmarkValue: '40.0%', epistemicStatus: 'Verified', certaintyScore: 93, source: 'Sanctum Legal Review Body', description: 'Total absence of predatory debt traps or unapproved resource concessions.' },
      { id: 'i3', name: 'Open Standards & Tool Interoperability', score: 84, weight: 0.3, trend: 4.0, unit: '% schemas publicly open-sourced', currentValue: '88.0%', benchmarkValue: '12.0%', epistemicStatus: 'Observed', certaintyScore: 98, source: 'Atlas Open Infrastructure Commons', description: 'Open BIM, sensor APIs, and governance schemas preventing vendor lock-in.' }
    ]
  },
  {
    id: 'generational',
    name: 'Generational Horizon & Long-Term Resilience',
    score: 92,
    trend: 8.7,
    description: '30-year infrastructure durability, indigenous wisdom continuity, youth education, and climate adaptation capacity.',
    color: '#4FC3F7',
    indicators: [
      { id: 'g1', name: '50-Year Infrastructure Material Resilience', score: 94, weight: 0.35, trend: 9.0, unit: 'Years expected design lifespan', currentValue: '65.0 Years', benchmarkValue: '15.0 Years', epistemicStatus: 'Modeled', certaintyScore: 92, source: 'Materials Degradation Stress Tests', description: 'Bio-composite and basalt structures engineered for zero maintenance decay.' },
      { id: 'g2', name: 'Indigenous Knowledge & Youth Apprenticeship', score: 91, weight: 0.35, trend: 8.1, unit: 'Youth completing stewardship guilds', currentValue: '1,840 / year', benchmarkValue: '120 / year', epistemicStatus: 'Reported', certaintyScore: 89, source: 'Academy of Flourishing Systems', description: 'Inter-generational transmission of hydrology, agronomy, and moral governance.' },
      { id: 'g3', name: 'Climate Resilience Margin (2050 Scenario)', score: 91, weight: 0.3, trend: 9.2, unit: 'Degree C heating buffer absorbed', currentValue: '+3.5°C Buffer', benchmarkValue: '+1.0°C Buffer', epistemicStatus: 'Modeled', certaintyScore: 90, source: 'IPCC Downscaled Regional Climate Engine', description: 'Capacity of food, water, and shelter systems to withstand severe heat extremes.' }
    ]
  }
];

export const CAPITAL_TRANCHES: CapitalAllocationTranche[] = [
  {
    id: 'CAP-2026-01',
    name: 'East African Ecological Resilience Facility',
    form: 'Financial',
    amount: '$85,000,000',
    provider: 'Sanctum Capital Trust & AfDB Green Facility',
    recipientProject: 'Turkana Desalination & Mathare Riparian Corridors',
    readinessScore: 95,
    expectedOutcome: '65,000 pastoralists secured with clean water; 8.4km polluted river rehabilitated.',
    riskRating: 'Low',
    evidenceQuality: 98,
    beneficiariesCount: 185000,
    nonExtractiveTermYears: 25,
    status: 'Committed'
  },
  {
    id: 'CAP-2026-02',
    name: 'Decentralized Micro-Foundry Engineering Syndicate',
    form: 'Intellectual',
    amount: '45 Open-Source Hardware Patents & Tooling IP',
    provider: 'African Materials Science Research Consortium',
    recipientProject: 'Atlas Industrial Micro-Foundry Hub Mombasa',
    readinessScore: 94,
    expectedOutcome: 'Localized production of basalt fiber rebar and bio-composite panels at 50% lower cost.',
    riskRating: 'Low',
    evidenceQuality: 96,
    beneficiariesCount: 450000,
    nonExtractiveTermYears: 30,
    status: 'Disbursed'
  },
  {
    id: 'CAP-2026-03',
    name: 'Great Rift Indigenous Seed & Soil Stewardship Mesh',
    form: 'Natural',
    amount: '14,000 Hectares Sovereign Bio-Corridor Land Concessions',
    provider: 'Maasai & Turkana Elders Land Trust',
    recipientProject: 'Mara-Rift Watershed Agroforestry Corridor',
    readinessScore: 98,
    expectedOutcome: 'Soil carbon increase of 2.4 tC/ha/yr and perennial water table restoration.',
    riskRating: 'Calculated',
    evidenceQuality: 97,
    beneficiariesCount: 92000,
    nonExtractiveTermYears: 50,
    status: 'Disbursed'
  },
  {
    id: 'CAP-2026-04',
    name: 'Mathare Youth Environmental Guardianship Guilds',
    form: 'Human',
    amount: '840 Full-Time Certified Ecological Stewards',
    provider: 'Mathare Youth Assembly & Atlas Academy',
    recipientProject: 'Mathare River Living Bio-Spine',
    readinessScore: 92,
    expectedOutcome: 'Zero flood drownings and 76% reduction in downstream toxic heavy metals.',
    riskRating: 'Low',
    evidenceQuality: 95,
    beneficiariesCount: 120000,
    nonExtractiveTermYears: 20,
    status: 'Generating Return'
  },
  {
    id: 'CAP-2026-05',
    name: 'Pan-African Epistemic Standards & Governance Covenant',
    form: 'Institutional',
    amount: 'Formal Legal Recognition & Regulatory Sandbox Authority',
    provider: 'East African Community (EAC) Secretariat',
    recipientProject: 'Atlas Reality & Moral Intelligence Governance Protocol',
    readinessScore: 91,
    expectedOutcome: 'Cryptographically anchored evidence accepted for statutory environmental compliance.',
    riskRating: 'Moderate',
    evidenceQuality: 94,
    beneficiariesCount: 3500000,
    nonExtractiveTermYears: 25,
    status: 'Under Audit'
  }
];

export const REALITY_OBSERVATIONS: RealityObservation[] = [
  {
    id: 'obs-turkana-piezometer-01',
    title: 'Deep Saline Aquifer Hydraulic Recovery',
    category: 'Environmental',
    zoomLevel: 'region',
    locationName: 'Turkana Aquifer Zone IV, Kenya',
    coordinates: [3.125, 35.59],
    epistemicStatus: 'Observed',
    confidenceScore: 98,
    summary: 'Piezometric sensor array #42 recorded a 1.82 bar pressure recovery following managed solar extraction.',
    signalValue: '+1.82 bar recovery',
    signalTrend: '+12.4% over 180 days',
    dataSources: ['IoT Piezometer Telemetry Array', 'Sentinel-2 InSAR Ground Radar'],
    uncertaintyFactors: ['Seasonal monsoon infiltration variance (±4.2%)']
  },
  {
    id: 'obs-mathare-wetlands-02',
    title: 'Riparian Bio-Filtration Lead (Pb) Attenuation',
    category: 'Environmental',
    zoomLevel: 'community',
    locationName: 'Mathare River Basin, Nairobi',
    coordinates: [-1.261, 36.858],
    epistemicStatus: 'Verified',
    confidenceScore: 95,
    summary: 'Wetland bio-filtration beds reduced dissolved lead from 0.42 mg/L to 0.04 mg/L across 8.4km of riverbed.',
    signalValue: '0.04 mg/L Pb (Safe)',
    signalTrend: '-76% toxic effluent',
    dataSources: ['NEMA Mass Spectrometry Grab Samples', 'In-Situ Spectrophotometer Probes'],
    uncertaintyFactors: ['Upstream unmetered nocturnal discharges']
  },
  {
    id: 'obs-kigali-thermal-03',
    title: 'LifeHouse Bio-Composite Thermal Stabilization',
    category: 'Infrastructure',
    zoomLevel: 'city',
    locationName: 'Kigali Eco-Quarter, Rwanda',
    coordinates: [-1.944, 30.061],
    epistemicStatus: 'Observed',
    confidenceScore: 99,
    summary: '120 inhabited modular bio-composite dwellings maintained 21.8°C indoor baseline with zero active air conditioning.',
    signalValue: '21.8°C Indoor Constant',
    signalTrend: '0 kWh Cooling Energy Draw',
    dataSources: ['Calibrated Heat Flux Sensors', 'Smart Grid Power Telemetry'],
    uncertaintyFactors: ['High relative humidity seasonal peaks (±0.8°C margin)']
  },
  {
    id: 'obs-mombasa-foundry-04',
    title: 'Carbon-Negative Basalt Rebar Extrusion',
    category: 'Infrastructure',
    zoomLevel: 'region',
    locationName: 'Mombasa Coastal Hub, Kenya',
    coordinates: [-4.0435, 39.6682],
    epistemicStatus: 'Verified',
    confidenceScore: 97,
    summary: 'Micro-foundry delivered 2,400 metric tons of structural rebar at 0.38 kg CO2e/kg vs 1.12 kg for steel.',
    signalValue: '0.38 kg CO2e / kg',
    signalTrend: '-64% embodied carbon',
    dataSources: ['SGS ISO 14025 Environmental Product Declaration'],
    uncertaintyFactors: ['Electric arc furnace grid mix variations']
  }
];

