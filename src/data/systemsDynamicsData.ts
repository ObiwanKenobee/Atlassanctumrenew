/**
 * ATLAS SYSTEMS DYNAMICS & SYSTEMS MODELLING DATA
 * Canonical Systems Model for Initial Vertical:
 * "Nairobi Mathare River Basin Riparian Corridor & Water-Food Agroforestry Commons"
 */

import { SystemModel, CandidateIntervention, SimulationScenario } from '../types';

export const CANONICAL_MATHARE_SYSTEM_MODEL: SystemModel = {
  id: 'model-mathare-riparian-v3',
  version: 'v3.2-calibrated',
  name: 'Mathare River Basin Riparian & Urban Agroforestry Commons',
  bioregionOrDomain: 'Nairobi River Basin, Kenya (Sub-Saharan Urban-Riparian Bioregion)',
  timeHorizonMonths: 24,
  timeStepUnit: 'months',
  entities: [
    'Riparian Soil & Vegetative Buffer',
    'Upstream Industrial & Domestic Runoff',
    'Community-Owned Solar Cold-Storage Nodes',
    'Informal Settlement Household Resilience',
    'Youth Agroforestry Cooperatives',
    'Local Clan & Elder River Guardians',
    'Municipal Sanitation Infrastructure',
    'RVE Catalytic Capital Endowment'
  ],
  stocks: [
    {
      id: 'stock-riparian-soil-carbon',
      name: 'Riparian Soil Organic Matter & Root Biomass',
      category: 'natural',
      currentValue: 3450,
      initialValue: 3450,
      unit: 'Metric Tons Carbon',
      inflowRate: 180,
      outflowRate: 310,
      minimumCapacity: 800,
      maximumCapacity: 12000,
      epistemicStatus: 'Known',
      confidence: 96,
      description: 'Microbial soil organic carbon and deep vetiver/bamboo root density along the 14km river catchment corridor.'
    },
    {
      id: 'stock-potable-water-reserve',
      name: 'Biophysical Potable Water Daily Availability',
      category: 'natural',
      currentValue: 18500,
      initialValue: 18500,
      unit: 'Liters / Day',
      inflowRate: 4200,
      outflowRate: 6800,
      minimumCapacity: 2000,
      maximumCapacity: 80000,
      epistemicStatus: 'Known',
      confidence: 94,
      description: 'Community-accessible safe water supply filtered through riparian bio-retention wetlands and solar thermal micro-desal nodes.'
    },
    {
      id: 'stock-youth-livelihoods',
      name: 'Active Agroforestry Youth Livelihoods',
      category: 'human',
      currentValue: 320,
      initialValue: 320,
      unit: 'Full-Time Stewards',
      inflowRate: 25,
      outflowRate: 14,
      minimumCapacity: 50,
      maximumCapacity: 3500,
      epistemicStatus: 'Known',
      confidence: 97,
      description: 'Dignified, living-wage green employment in nursery propagation, river bank stabilization, compost manufacturing, and urban market gardening.'
    },
    {
      id: 'stock-local-capital-retained',
      name: 'Community Retained Capital Commons',
      category: 'financial',
      currentValue: 240000,
      initialValue: 240000,
      unit: 'USD Equiv ($)',
      inflowRate: 32000,
      outflowRate: 48000,
      minimumCapacity: 20000,
      maximumCapacity: 2500000,
      epistemicStatus: 'Inferred',
      confidence: 91,
      description: 'Capital circulating within Mathare settlement via community-owned solar cold chain hubs and local vegetable barter-credits.'
    },
    {
      id: 'stock-institutional-trust',
      name: 'Epistemic Community & Council Trust',
      category: 'social',
      currentValue: 62,
      initialValue: 62,
      unit: 'Index (0-100)',
      inflowRate: 4.5,
      outflowRate: 3.8,
      minimumCapacity: 10,
      maximumCapacity: 100,
      epistemicStatus: 'Known',
      confidence: 95,
      description: 'Consensus trust rating across clan elders, youth cooperatives, women market traders, and municipal water authorities.'
    }
  ],
  flows: [
    {
      id: 'flow-soil-accumulation',
      name: 'Riparian Bioretention & Polyculture Infiltration',
      sourceStockId: undefined,
      targetStockId: 'stock-riparian-soil-carbon',
      rate: 180,
      unit: 'Tons Carbon / Month',
      equationOrMechanism: 'R = k_bio * (YouthStewards^0.7) * (BambooHectares) * SoilMoistureCoeff',
      influencingVariables: ['var-solar-irrigation-power', 'var-agroforestry-adoption-rate'],
      epistemicStatus: 'Known',
      description: 'Biomass accumulation driven by biochar application, vetiver grass planting, and microbial inoculants.'
    },
    {
      id: 'flow-flood-soil-loss',
      name: 'Flash Flood Runoff & Bank Erosion Rate',
      sourceStockId: 'stock-riparian-soil-carbon',
      targetStockId: undefined,
      rate: 310,
      unit: 'Tons Carbon / Month',
      equationOrMechanism: 'Loss = BaseErosion * (1 - BufferCoverFraction)^1.8 * RainfallSurgeFactor',
      influencingVariables: ['var-seasonal-rainfall-surge', 'var-upstream-impervious-surface'],
      epistemicStatus: 'Known',
      description: 'Soil detachment and sediment loss caused by heavy equatorial monsoon downpours over unpaved informal slopes.'
    },
    {
      id: 'flow-water-purification',
      name: 'Solar-Thermal Wetland Purification Flow',
      sourceStockId: undefined,
      targetStockId: 'stock-potable-water-reserve',
      rate: 4200,
      unit: 'Liters / Day / Month',
      equationOrMechanism: 'Purified = SolarCapacity_kW * 280 L/kW + WetlandInfiltration_L',
      influencingVariables: ['var-solar-irrigation-power', 'var-wetland-retention-area'],
      epistemicStatus: 'Known',
      description: 'Safe water generated by solar UV/thermal purification and bio-swale natural polishing.'
    },
    {
      id: 'flow-youth-onboarding',
      name: 'Youth Cooperative Apprenticeship Intake',
      sourceStockId: undefined,
      targetStockId: 'stock-youth-livelihoods',
      rate: 25,
      unit: 'Stewards / Month',
      equationOrMechanism: 'Intake = CatalyticFundAllocation * 0.00045 * (TrustIndex / 50)',
      influencingVariables: ['var-rve-endowment-flow', 'var-training-stipend-usd'],
      epistemicStatus: 'Inferred',
      description: 'Youth cohort enrollment into salaried river stewardship and regenerative urban agroforestry micro-enterprises.'
    }
  ],
  variables: [
    {
      id: 'var-seasonal-rainfall-surge',
      name: 'Equatorial Monsoon Rainfall Surge Intensity',
      value: 1.35,
      unit: 'Precipitation Multiplier (1.0 = avg)',
      type: 'environmental_driver',
      range: [0.5, 2.5],
      epistemicStatus: 'Known',
      description: 'Seasonal climate variability representing torrential storm intensity and flood crest frequency.'
    },
    {
      id: 'var-solar-irrigation-power',
      name: 'Decentralized Solar Pumping Capacity',
      value: 45.0,
      unit: 'kW Installed Peak',
      type: 'policy_parameter',
      range: [10.0, 180.0],
      epistemicStatus: 'Known',
      description: 'Solar photovoltaic arrays powering smart drip irrigation and ultrafiltration membrane pumps.'
    },
    {
      id: 'var-agroforestry-adoption-rate',
      name: 'Settlement Riparian Stewardship Adoption',
      value: 0.42,
      unit: 'Fraction of Riverbank Length (0-1.0)',
      type: 'endogenous',
      range: [0.1, 0.95],
      epistemicStatus: 'Inferred',
      description: 'Proportion of Mathare river frontage protected by community-managed edible bamboo and vetiver buffers.'
    },
    {
      id: 'var-rve-endowment-flow',
      name: 'RVE Zero-Usury Catalytic Capital Inflow',
      value: 75000,
      unit: 'USD / Month',
      type: 'exogenous',
      range: [10000, 300000],
      epistemicStatus: 'Known',
      description: 'Non-extractive catalytic endowment disbursing monthly stipends, bio-inoculants, and tooling capex.'
    },
    {
      id: 'var-post-harvest-loss-fraction',
      name: 'Vegetable & Produce Post-Harvest Loss Rate',
      value: 0.38,
      unit: 'Loss Fraction (0-1.0)',
      type: 'endogenous',
      range: [0.05, 0.60],
      epistemicStatus: 'Known',
      description: 'Percentage of harvested perishables rotting due to high equatorial heat and lack of cold storage.'
    }
  ],
  relationships: [
    {
      id: 'rel-solar-to-water',
      sourceId: 'var-solar-irrigation-power',
      sourceName: 'Decentralized Solar Capacity',
      targetId: 'flow-water-purification',
      targetName: 'Solar-Thermal Wetland Purification Flow',
      polarity: '+',
      strengthElasticity: 0.88,
      delayPeriods: 1,
      causalDoCoefficient: 0.91,
      pValue: 0.0008,
      mechanismExplanation: 'Direct power supply increases UV disinfection runtime and pressurized microfiltration throughput.',
      sourceAttribution: 'Observed',
      confidence: 98
    },
    {
      id: 'rel-stewards-to-soil',
      sourceId: 'stock-youth-livelihoods',
      sourceName: 'Active Youth Stewards',
      targetId: 'flow-soil-accumulation',
      targetName: 'Riparian Bioretention & Polyculture Infiltration',
      polarity: '+',
      strengthElasticity: 0.79,
      delayPeriods: 2,
      causalDoCoefficient: 0.85,
      pValue: 0.002,
      mechanismExplanation: 'Each active youth maintenance team manages 250m of riverbank bio-terraces, planting vetiver and compost trenches.',
      sourceAttribution: 'Observed',
      confidence: 96
    },
    {
      id: 'rel-soil-to-flood-loss',
      sourceId: 'stock-riparian-soil-carbon',
      sourceName: 'Riparian Soil Carbon & Root Mass',
      targetId: 'flow-flood-soil-loss',
      targetName: 'Flash Flood Runoff & Bank Erosion Rate',
      polarity: '-',
      strengthElasticity: 0.82,
      delayPeriods: 3,
      causalDoCoefficient: 0.89,
      pValue: 0.0005,
      mechanismExplanation: 'Denser fungal hyphae and root matrices increase shear resistance against river scouring, reducing bank collapse.',
      sourceAttribution: 'Model Inference',
      confidence: 94
    },
    {
      id: 'rel-trust-to-youth-intake',
      sourceId: 'stock-institutional-trust',
      sourceName: 'Epistemic Community Trust',
      targetId: 'flow-youth-onboarding',
      targetName: 'Youth Apprenticeship Intake',
      polarity: '+',
      strengthElasticity: 0.65,
      delayPeriods: 1,
      causalDoCoefficient: 0.76,
      pValue: 0.004,
      mechanismExplanation: 'High elder and clan trust removes political friction, ensuring equitable neighborhood recruitment.',
      sourceAttribution: 'User Provided',
      confidence: 92
    },
    {
      id: 'rel-water-to-trust',
      sourceId: 'stock-potable-water-reserve',
      sourceName: 'Biophysical Safe Water Reserve',
      targetId: 'stock-institutional-trust',
      targetName: 'Epistemic Community Trust',
      polarity: '+',
      strengthElasticity: 0.72,
      delayPeriods: 2,
      causalDoCoefficient: 0.82,
      pValue: 0.001,
      mechanismExplanation: 'Consistent, affordable potable water delivery eliminates predatory water-cartel extortion, bolstering community solidarity.',
      sourceAttribution: 'Observed',
      confidence: 95
    }
  ],
  feedbackLoops: [
    {
      id: 'loop-R1-virtuous-regeneration',
      name: 'R1: Riparian Ecological Flourishing Engine',
      type: 'reinforcing',
      loopNodes: [
        'stock-youth-livelihoods',
        'flow-soil-accumulation',
        'stock-riparian-soil-carbon',
        'stock-potable-water-reserve',
        'stock-institutional-trust',
        'flow-youth-onboarding'
      ],
      narrative: 'More youth stewards plant dense root buffers -> Higher soil water retention & purified runoff -> Greater reliable potable water -> Deepened community trust -> Expanded youth cohort funding and enrollment.',
      dominantTimeHorizon: '6-18 Months',
      leverageScore: 9.4
    },
    {
      id: 'loop-R2-economic-commons',
      name: 'R2: Localized Capital Retention & Solar Multiplier',
      type: 'reinforcing',
      loopNodes: [
        'stock-local-capital-retained',
        'var-solar-irrigation-power',
        'var-post-harvest-loss-fraction',
        'stock-local-capital-retained'
      ],
      narrative: 'Retained local revenue finances community solar cold storage -> Lowers food spoilage from 38% to 8% -> Increases vendor market margins -> Compounds local capital commons.',
      dominantTimeHorizon: '3-12 Months',
      leverageScore: 8.8
    },
    {
      id: 'loop-B1-erosion-exhaustion',
      name: 'B1: Torrential Monsoon Scouring Balancing Loop',
      type: 'balancing',
      loopNodes: [
        'var-seasonal-rainfall-surge',
        'flow-flood-soil-loss',
        'stock-riparian-soil-carbon',
        'var-agroforestry-adoption-rate'
      ],
      narrative: 'High rainfall surges trigger flash floods -> Scours unprotected banks -> Reduces available planting area -> Limits buffer expansion until engineered rock swales are installed.',
      dominantTimeHorizon: '1-3 Months (Rainy Season)',
      leverageScore: 7.2
    }
  ],
  constraints: [
    {
      id: 'const-fpic-zero-displacement',
      name: 'Mandatory FPIC & Zero Resident Displacement',
      type: 'moral_canon',
      description: 'Canon XXIII inviolable principle: no informal settlement dwelling may be demolished or evicted without unanimous elder assembly charter.',
      thresholdValue: 0,
      unit: 'Displaced Households Allowed',
      isHardBoundary: true
    },
    {
      id: 'const-aquifer-sustainable-yield',
      name: 'Maximum Hydrological Extraction Boundary',
      type: 'ecological_boundary',
      description: 'Total well pumping cannot exceed 70% of verified rainy season deep aquifer recharge rate.',
      thresholdValue: 65000,
      unit: 'Liters / Day Max',
      isHardBoundary: true
    },
    {
      id: 'const-zero-usury',
      name: 'Zero-Usury Non-Extractive Capital Floor',
      type: 'financial',
      description: 'Capital financing must be 100% revenue-share or patient commons equity; no compounding interest debt.',
      thresholdValue: 0.0,
      unit: '% Interest Rate',
      isHardBoundary: true
    }
  ],
  assumptions: [
    {
      id: 'assump-bamboo-growth-rate',
      statement: 'Giant bamboo (Dendrocalamus asper) root matrix reaches 80% tensile reinforcement efficacy within 14 months of planting.',
      epistemicCategory: 'Inferred',
      riskIfViolated: 'medium',
      validationMethod: 'Quarterly shear-vane soil core tests in pilot sectors.',
      tested: true
    },
    {
      id: 'assump-solar-irradiance',
      statement: 'Nairobi equatorial solar insolation averages 5.4 kWh/m²/day across dry and rainy seasons.',
      epistemicCategory: 'Known',
      riskIfViolated: 'low',
      validationMethod: 'On-site PV telemetry cross-referenced with PVGIS satellite databases.',
      tested: true
    },
    {
      id: 'assump-water-cartel-peace',
      statement: 'Informal water vendors can be seamlessly integrated as licensed cooperative cold-storage hub managers without violent resistance.',
      epistemicCategory: 'Assumed',
      riskIfViolated: 'catastrophic',
      validationMethod: 'Clan Elder assembly consensus arbitration and revenue-floor covenants.',
      tested: false
    }
  ],
  modelHealth: {
    dataFreshness: 'Live (Synchronized 4 mins ago)',
    epistemicConfidence: 94.8,
    lastUpdated: '2026-08-25T07:15:00Z',
    versionAuthor: 'Systems Diagnostic Agent & Mathare Bioregional Council',
    validationStatus: 'calibrated'
  }
};

export const CANDIDATE_INTERVENTIONS: CandidateIntervention[] = [
  {
    id: 'int-solar-cold-chain-biochar',
    targetEntityId: 'var-solar-irrigation-power',
    targetName: 'Decentralized Solar Cold Storage + Mycorrhizal Biochar Hubs (Highest Leverage)',
    mechanism: 'Install 6x 15kW community-owned solar cold storage pods coupled with continuous biochar-pyrolysis units transforming organic market waste into deep moisture-retaining soil conditioners.',
    costUsd: 480000,
    timeHorizonMonths: 12,
    expectedOutcome: 'Decreases vegetable post-harvest rot from 38% to 6%, generates $18,500/mo in vendor savings, and increases riparian soil organic carbon by +180 tons/month.',
    flourishingDelta: 44.5,
    systemDependencies: ['FPIC Elder Assembly Ratification', 'Grid Intertie Veto Waiver'],
    reversibility: 'partially_reversible',
    risks: ['Battery thermal degradation in high ambient heat', 'Micro-grid inverter firmware failure'],
    unintendedConsequences: ['Rapid surge in vegetable supply could temporarily depress local market prices unless regional wholesale links are established'],
    confidence: 96,
    leverageRank: 1
  },
  {
    id: 'int-vetiver-agroforestry-corridor',
    targetEntityId: 'flow-soil-accumulation',
    targetName: '14km Contiguous Vetiver & Giant Bamboo Riparian Bio-Shield',
    mechanism: 'Deploy 8 youth cooperatives to establish stepped bio-terraces, sediment catchers, and riparian fruit groves (avocado, moringa, passion fruit) along 14km of vulnerable riverbank.',
    costUsd: 320000,
    timeHorizonMonths: 18,
    expectedOutcome: 'Reduces flood bank scour by 78%, creates 420 full-time living wage youth livelihoods, and restores 12,000 tons of cumulative carbon.',
    flourishingDelta: 38.2,
    systemDependencies: ['Seedling nursery supply chain', 'Seasonal monsoon timing coordination'],
    reversibility: 'fully_reversible',
    risks: ['Extreme early unseasonal flooding before bamboo roots take hold'],
    unintendedConsequences: ['Increased wild bird and pollinator density beneficial to adjacent crops'],
    confidence: 94,
    leverageRank: 2
  },
  {
    id: 'int-clan-water-sovereignty-mesh',
    targetEntityId: 'stock-institutional-trust',
    targetName: 'Sovereign Clan Water Mesh & Smart Micro-Filtration Kiosks',
    mechanism: 'Decentralized IoT ultra-filtration kiosks managed by elder/youth councils, replacing predatory middleman markups with a universal 2 KES per 20L maintenance fee.',
    costUsd: 210000,
    timeHorizonMonths: 6,
    expectedOutcome: 'Guarantees 50,000 residents direct potable water access under 4 minutes walk, boosting institutional trust index from 62 to 92.',
    flourishingDelta: 31.0,
    systemDependencies: ['Water quality optical sensor calibration', 'Clan council charter'],
    reversibility: 'partially_reversible',
    risks: ['Filter membrane fouling from heavy industrial upstream oil spills'],
    unintendedConsequences: ['Substantial reduction in waterborne clinic visits by 64%'],
    confidence: 98,
    leverageRank: 3
  }
];

export const CANONICAL_SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'scenario-baseline',
    name: 'Status Quo (No Intervention / Business As Usual)',
    description: 'Current trajectory with unmitigated seasonal monsoon flooding, 38% post-harvest produce loss, and predatory water pricing.',
    isBaseline: true,
    parameterOverrides: {},
    interventionsApplied: [],
    projectedTimeSeries: [
      { month: 0, stocks: { 'stock-riparian-soil-carbon': 3450, 'stock-potable-water-reserve': 18500, 'stock-youth-livelihoods': 320, 'stock-local-capital-retained': 240000 }, flourishingIndex: 58.2, waterResilienceScore: 48, soilCarbonTons: 3450 },
      { month: 4, stocks: { 'stock-riparian-soil-carbon': 3120, 'stock-potable-water-reserve': 16800, 'stock-youth-livelihoods': 310, 'stock-local-capital-retained': 225000 }, flourishingIndex: 56.4, waterResilienceScore: 45, soilCarbonTons: 3120 },
      { month: 8, stocks: { 'stock-riparian-soil-carbon': 2890, 'stock-potable-water-reserve': 15200, 'stock-youth-livelihoods': 295, 'stock-local-capital-retained': 210000 }, flourishingIndex: 53.8, waterResilienceScore: 42, soilCarbonTons: 2890 },
      { month: 12, stocks: { 'stock-riparian-soil-carbon': 2640, 'stock-potable-water-reserve': 14100, 'stock-youth-livelihoods': 280, 'stock-local-capital-retained': 195000 }, flourishingIndex: 51.2, waterResilienceScore: 39, soilCarbonTons: 2640 },
      { month: 18, stocks: { 'stock-riparian-soil-carbon': 2410, 'stock-potable-water-reserve': 13200, 'stock-youth-livelihoods': 265, 'stock-local-capital-retained': 180000 }, flourishingIndex: 48.6, waterResilienceScore: 36, soilCarbonTons: 2410 },
      { month: 24, stocks: { 'stock-riparian-soil-carbon': 2250, 'stock-potable-water-reserve': 12500, 'stock-youth-livelihoods': 250, 'stock-local-capital-retained': 170000 }, flourishingIndex: 46.5, waterResilienceScore: 33, soilCarbonTons: 2250 }
    ],
    summaryFindings: {
      primaryGain: 'None. Ongoing systemic erosion and capital flight.',
      criticalRisk: 'Cumulative bank scouring causes settlement structural collapse during 2027 monsoon peak.',
      causalPathway: 'Monsoon Flooding -> Bank Collapse -> Displacement -> Trust Collapse',
      invalidationConditions: ['Sudden massive municipal infrastructure funding'],
      confidenceInterval: [42.0, 51.0]
    }
  },
  {
    id: 'scenario-integrated-commons',
    name: 'Integrated Agroforestry Bio-Shield & Solar Cold Commons (Recommended)',
    description: 'Deploys 6x Solar Cold Storage Hubs + 14km Bamboo/Vetiver Buffer + Clan Water Mesh with $1,010,000 Catalytic Capital.',
    isBaseline: false,
    parameterOverrides: {
      'var-solar-irrigation-power': 120.0,
      'var-agroforestry-adoption-rate': 0.88,
      'var-post-harvest-loss-fraction': 0.08
    },
    interventionsApplied: CANDIDATE_INTERVENTIONS,
    projectedTimeSeries: [
      { month: 0, stocks: { 'stock-riparian-soil-carbon': 3450, 'stock-potable-water-reserve': 18500, 'stock-youth-livelihoods': 320, 'stock-local-capital-retained': 240000 }, flourishingIndex: 58.2, waterResilienceScore: 48, soilCarbonTons: 3450 },
      { month: 4, stocks: { 'stock-riparian-soil-carbon': 4100, 'stock-potable-water-reserve': 26000, 'stock-youth-livelihoods': 540, 'stock-local-capital-retained': 360000 }, flourishingIndex: 67.5, waterResilienceScore: 62, soilCarbonTons: 4100 },
      { month: 8, stocks: { 'stock-riparian-soil-carbon': 5200, 'stock-potable-water-reserve': 38000, 'stock-youth-livelihoods': 780, 'stock-local-capital-retained': 520000 }, flourishingIndex: 76.8, waterResilienceScore: 75, soilCarbonTons: 5200 },
      { month: 12, stocks: { 'stock-riparian-soil-carbon': 6600, 'stock-potable-water-reserve': 51000, 'stock-youth-livelihoods': 1100, 'stock-local-capital-retained': 740000 }, flourishingIndex: 84.2, waterResilienceScore: 86, soilCarbonTons: 6600 },
      { month: 18, stocks: { 'stock-riparian-soil-carbon': 8400, 'stock-potable-water-reserve': 64000, 'stock-youth-livelihoods': 1450, 'stock-local-capital-retained': 1050000 }, flourishingIndex: 91.5, waterResilienceScore: 93, soilCarbonTons: 8400 },
      { month: 24, stocks: { 'stock-riparian-soil-carbon': 10200, 'stock-potable-water-reserve': 75000, 'stock-youth-livelihoods': 1850, 'stock-local-capital-retained': 1420000 }, flourishingIndex: 96.4, waterResilienceScore: 98, soilCarbonTons: 10200 }
    ],
    summaryFindings: {
      primaryGain: '+38.2% Flourishing Index growth, +195% Riparian soil carbon, 1,850 youth green livelihoods, 4x local retained capital.',
      criticalRisk: 'Requires strict maintenance of solar inverters and community security protocols.',
      causalPathway: 'Solar Cold Storage + Agroforestry Buffer -> Lower Loss & High Bio-retention -> Economic Multiplier -> Self-Sustaining Reinvestment Loop',
      invalidationConditions: ['Major civil unrest blocking settlement access', 'Upstream dam collapse'],
      confidenceInterval: [92.0, 98.5]
    }
  },
  {
    id: 'scenario-solar-only',
    name: 'Techno-Only Solar Nodes (No Agroforestry Buffer)',
    description: 'Deploys only solar microfiltration and cold storage hubs without ecological bank restoration or community bio-buffers.',
    isBaseline: false,
    parameterOverrides: {
      'var-solar-irrigation-power': 120.0,
      'var-agroforestry-adoption-rate': 0.42,
      'var-post-harvest-loss-fraction': 0.12
    },
    interventionsApplied: [CANDIDATE_INTERVENTIONS[0]],
    projectedTimeSeries: [
      { month: 0, stocks: { 'stock-riparian-soil-carbon': 3450, 'stock-potable-water-reserve': 18500, 'stock-youth-livelihoods': 320, 'stock-local-capital-retained': 240000 }, flourishingIndex: 58.2, waterResilienceScore: 48, soilCarbonTons: 3450 },
      { month: 4, stocks: { 'stock-riparian-soil-carbon': 3400, 'stock-potable-water-reserve': 24000, 'stock-youth-livelihoods': 410, 'stock-local-capital-retained': 320000 }, flourishingIndex: 64.1, waterResilienceScore: 56, soilCarbonTons: 3400 },
      { month: 8, stocks: { 'stock-riparian-soil-carbon': 3250, 'stock-potable-water-reserve': 31000, 'stock-youth-livelihoods': 480, 'stock-local-capital-retained': 410000 }, flourishingIndex: 69.4, waterResilienceScore: 63, soilCarbonTons: 3250 },
      { month: 12, stocks: { 'stock-riparian-soil-carbon': 3100, 'stock-potable-water-reserve': 36000, 'stock-youth-livelihoods': 530, 'stock-local-capital-retained': 510000 }, flourishingIndex: 73.0, waterResilienceScore: 68, soilCarbonTons: 3100 },
      { month: 18, stocks: { 'stock-riparian-soil-carbon': 2950, 'stock-potable-water-reserve': 40000, 'stock-youth-livelihoods': 580, 'stock-local-capital-retained': 620000 }, flourishingIndex: 75.8, waterResilienceScore: 71, soilCarbonTons: 2950 },
      { month: 24, stocks: { 'stock-riparian-soil-carbon': 2800, 'stock-potable-water-reserve': 43000, 'stock-youth-livelihoods': 620, 'stock-local-capital-retained': 710000 }, flourishingIndex: 78.2, waterResilienceScore: 74, soilCarbonTons: 2800 }
    ],
    summaryFindings: {
      primaryGain: 'Moderate financial capital boost but vulnerable to persistent bank erosion.',
      criticalRisk: 'Physical flooding can submerge solar installations if riverbanks are not structurally stabilized.',
      causalPathway: 'Technology investment without ecological root foundation creates isolated gains vulnerable to flood destruction.',
      invalidationConditions: ['High flood surge submerging equipment'],
      confidenceInterval: [72.0, 82.0]
    }
  }
];
