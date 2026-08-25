import {
  BioregionalTwinScenario,
  CovenantAuditDossier,
  TurnkeyMatchPackage
} from '../types';

export const BIOREGIONAL_TWIN_SCENARIOS: BioregionalTwinScenario[] = [
  {
    id: 'scen-turkana-rift',
    name: 'Turkana Deep Aquifer Desalination & Pastoral Migration Corridor',
    bioregion: 'East African Rift Valley • Lake Turkana Basin',
    description: 'Simulating the counterfactual dynamics of brackish deep-aquifer solar desalination, community livestock grazing commons, and solar salt crystallizers across 30 years.',
    populationAffected: 380000,
    monteCarloProbabilityOfSuccess: 92.4,
    ecologicalPlanetaryMarginSafe: true,
    activeInterventions: [
      {
        id: 'param-desal-capacity',
        name: 'Solar Desalination Yield',
        description: 'Daily potable water output from solar-powered capacitive deionization',
        min: 100,
        max: 1200,
        step: 50,
        currentValue: 500,
        unit: 'kL / day',
        costEstimate: '$1.4M Capex'
      },
      {
        id: 'param-pastoral-subsidy',
        name: 'Pastoral Fodder Reserve Ratio',
        description: 'Percentage of desalinated wastewater diverted to drought fodder agroforestry',
        min: 10,
        max: 80,
        step: 5,
        currentValue: 45,
        unit: '% water volume',
        costEstimate: '$180k / yr'
      },
      {
        id: 'param-brine-circularity',
        name: 'Zero-Liquid-Discharge Brine Processing',
        description: 'Circular conversion of saline waste into food-grade sodium and magnesium minerals',
        min: 20,
        max: 100,
        step: 10,
        currentValue: 85,
        unit: '% recovered',
        costEstimate: '$320k Capex'
      },
      {
        id: 'param-clan-governance',
        name: 'Clan Water Council Veto Weight',
        description: 'Democratic decision threshold for seasonal water quota allocations',
        min: 50,
        max: 100,
        step: 5,
        currentValue: 75,
        unit: '% consensus',
        costEstimate: '$0 (Charter)'
      }
    ],
    nodes: [
      {
        id: 'node-aquifer-salinity',
        name: 'Lotikipi Aquifer Salinity Gradient',
        category: 'Ecological',
        currentBaseline: 4200,
        unit: 'ppm TDS',
        biophysicalThreshold: { minSafe: 600, criticalCollapse: 7500 }
      },
      {
        id: 'node-infant-health',
        name: 'Infant Diarrheal & Skeletal Fluorosis Morbidity',
        category: 'Social',
        currentBaseline: 34.2,
        unit: '% cases',
        biophysicalThreshold: { minSafe: 2.0, criticalCollapse: 45.0 }
      },
      {
        id: 'node-livestock-survival',
        name: 'Severe Drought Livestock Survival Rate',
        category: 'Economic',
        currentBaseline: 54.0,
        unit: '% herd maintained',
        biophysicalThreshold: { minSafe: 85.0, criticalCollapse: 30.0 }
      },
      {
        id: 'node-conflict-incidents',
        name: 'Cross-Border Water Point Violent Encounters',
        category: 'Social',
        currentBaseline: 18,
        unit: 'incidents / year',
        biophysicalThreshold: { minSafe: 0, criticalCollapse: 35 }
      }
    ],
    consequences: [
      {
        id: 'c1',
        order: 1,
        title: 'Direct Potable Water Security',
        description: 'Immediate elimination of waterborne pathogens and reduction of maternal walking distance by 14.5 km/day.',
        type: 'regenerative_lock_in',
        severity: 'transformational',
        affectedDomain: 'Human Flourishing & Public Health'
      },
      {
        id: 'c2',
        order: 2,
        title: 'Sedentarization Soil Compaction Risk',
        description: 'Concentration of pastoral herds around fixed solar kiosks could cause localized topsoil degradation within 3km radius if migration corridors are not preserved.',
        type: 'tradeoff',
        severity: 'moderate',
        affectedDomain: 'Soil Ecology & Land Tenure',
        mitigationStrategy: 'Deploy 8 modular mobile water pods along traditional seasonal grazing routes instead of 1 monolithic plant.'
      },
      {
        id: 'c3',
        order: 3,
        title: 'Intergenerational Mineral Economy',
        description: 'By year 15, recovered high-purity magnesium and potassium salts seed a sovereign chemical & fertilizer guild owned entirely by the local women cooperative.',
        type: 'synergy',
        severity: 'transformational',
        affectedDomain: 'Economic Sovereignty'
      }
    ],
    flourishingImpact: {
      human: { year5: 84, year15: 93, year30: 97, confidence: 94, uncertaintyBand: [89, 98] },
      ecological: { year5: 76, year15: 85, year30: 91, confidence: 88, uncertaintyBand: [81, 93] },
      economic: { year5: 72, year15: 88, year30: 94, confidence: 91, uncertaintyBand: [84, 96] },
      social: { year5: 88, year15: 94, year30: 98, confidence: 95, uncertaintyBand: [92, 99] },
      generational: { year5: 82, year15: 92, year30: 96, confidence: 90, uncertaintyBand: [88, 97] }
    }
  },
  {
    id: 'scen-congo-biochar',
    name: 'Congo Basin Agro-Forestry & Artisanal Mineral Transition',
    bioregion: 'Central African Rainforest • Kivu Biome',
    description: 'Modeling the shift from hazardous artisanal cobalt pit digging to canopy-preserving biochar syntropy, high-value indigenous botanicals, and clean micro-foundry metallurgy.',
    populationAffected: 620000,
    monteCarloProbabilityOfSuccess: 89.1,
    ecologicalPlanetaryMarginSafe: true,
    activeInterventions: [
      {
        id: 'param-biochar-retorts',
        name: 'Syntropic Biochar Kiln Units',
        description: 'Modular pyrolysis retorts turning agricultural waste into terra preta soil enhancers',
        min: 20,
        max: 300,
        step: 10,
        currentValue: 120,
        unit: 'kilns deployed',
        costEstimate: '$420k Capex'
      },
      {
        id: 'param-canopy-protection',
        name: 'Intact Primary Canopy Mandate',
        description: 'Legal-ecological covenant requiring 100% shade canopy for cash crop coffee/cacao',
        min: 50,
        max: 100,
        step: 5,
        currentValue: 90,
        unit: '% canopy cover',
        costEstimate: '$0 (Charter)'
      },
      {
        id: 'param-guild-metallurgy',
        name: 'Certified Fair-Trace Smelting Foundries',
        description: 'Micro-foundries refining cobalt & copper with closed-loop solar induction',
        min: 1,
        max: 12,
        step: 1,
        currentValue: 4,
        unit: 'foundries',
        costEstimate: '$1.8M Capex'
      }
    ],
    nodes: [
      {
        id: 'node-topsoil-carbon',
        name: 'Soil Organic Carbon Content',
        category: 'Ecological',
        currentBaseline: 1.8,
        unit: '% soil mass',
        biophysicalThreshold: { minSafe: 3.5, criticalCollapse: 0.8 }
      },
      {
        id: 'node-child-labor-rate',
        name: 'Child Hazardous Mine Exposure',
        category: 'Social',
        currentBaseline: 14.8,
        unit: '% youth in mining',
        biophysicalThreshold: { minSafe: 0.0, criticalCollapse: 20.0 }
      },
      {
        id: 'node-household-income',
        name: 'Median Agro-Syntropic Monthly Household Income',
        category: 'Economic',
        currentBaseline: 110,
        unit: 'USD / month',
        biophysicalThreshold: { minSafe: 450, criticalCollapse: 80 }
      }
    ],
    consequences: [
      {
        id: 'c1-congo',
        order: 1,
        title: 'Direct Soil Nutrient Surge',
        description: 'Immediate 180% increase in cassava & legume yield from biochar terra preta moisture retention.',
        type: 'regenerative_lock_in',
        severity: 'transformational',
        affectedDomain: 'Food Sovereignty'
      },
      {
        id: 'c2-congo',
        order: 2,
        title: 'Middleman Resistance & Smuggling Pressure',
        description: 'Unregulated predatory mineral brokers may artificially suppress local botanical purchase prices in year 2 to force youth back into hazardous mining.',
        type: 'tradeoff',
        severity: 'critical',
        affectedDomain: 'Market Security',
        mitigationStrategy: 'Pre-seed a minimum-price floor liquidity pool through the Atlas Capital Coordination Engine.'
      },
      {
        id: 'c3-congo',
        order: 3,
        title: 'Complete Bioregional Forest Canopy Restoration',
        description: 'By year 30, intact forest canopy sequesters 42 Megatons of carbon, locking in sovereign carbon dividends for community schools.',
        type: 'synergy',
        severity: 'transformational',
        affectedDomain: 'Planetary Biosphere'
      }
    ],
    flourishingImpact: {
      human: { year5: 80, year15: 90, year30: 96, confidence: 91, uncertaintyBand: [84, 97] },
      ecological: { year5: 88, year15: 95, year30: 99, confidence: 96, uncertaintyBand: [94, 100] },
      economic: { year5: 68, year15: 86, year30: 93, confidence: 87, uncertaintyBand: [79, 95] },
      social: { year5: 85, year15: 93, year30: 97, confidence: 93, uncertaintyBand: [90, 98] },
      generational: { year5: 87, year15: 95, year30: 99, confidence: 95, uncertaintyBand: [92, 100] }
    }
  },
  {
    id: 'scen-sahel-wall',
    name: 'Sahel Great Green Wall & Living Aquifer Corridor',
    bioregion: 'Sub-Saharan Transition Zone • Sahelian Drylands',
    description: 'Testing agro-silvo-pastoral belt deployment, micro-water harvesting zai pits, and distributed solar agrivoltaics against desertification.',
    populationAffected: 1200000,
    monteCarloProbabilityOfSuccess: 94.8,
    ecologicalPlanetaryMarginSafe: true,
    activeInterventions: [
      {
        id: 'param-zai-pits',
        name: 'Zai & Half-Moon Catchment Arrays',
        description: 'Traditional rainwater concentration pits seeded with acacia & baobab trees',
        min: 1000,
        max: 50000,
        step: 2000,
        currentValue: 24000,
        unit: 'hectares restored',
        costEstimate: '$750k Capex'
      },
      {
        id: 'param-solar-pumping',
        name: 'Solar Deep Piezometer Kiosks',
        description: 'Automated solar water lift stations with recharge-rate velocity caps',
        min: 10,
        max: 150,
        step: 5,
        currentValue: 60,
        unit: 'pumping stations',
        costEstimate: '$1.2M Capex'
      }
    ],
    nodes: [
      {
        id: 'node-desert-encroach',
        name: 'Annual Desert Encroachment Rate',
        category: 'Ecological',
        currentBaseline: +4.2,
        unit: 'km / year expansion',
        biophysicalThreshold: { minSafe: -2.0, criticalCollapse: +10.0 }
      },
      {
        id: 'node-youth-retention',
        name: 'Local Youth Rural Retention Rate',
        category: 'Social',
        currentBaseline: 42.0,
        unit: '% staying in homeland',
        biophysicalThreshold: { minSafe: 80.0, criticalCollapse: 25.0 }
      }
    ],
    consequences: [
      {
        id: 'c1-sahel',
        order: 1,
        title: 'Micro-Climate Humidity Inversion',
        description: 'Vegetation canopy increases localized evapotranspiration, generating 12% more micro-rain events per season.',
        type: 'synergy',
        severity: 'transformational',
        affectedDomain: 'Biometeorology'
      },
      {
        id: 'c2-sahel',
        order: 2,
        title: 'Pastoral Herd Influx Surge',
        description: 'New green pasture draws transhumance pastoralists from across borders; requires pre-established multi-tribal grazing pacts to prevent conflict.',
        type: 'tradeoff',
        severity: 'moderate',
        affectedDomain: 'Civic Peace',
        mitigationStrategy: 'Embed transhumance corridors into the Atlas Reality Engine GPS boundary layers.'
      }
    ],
    flourishingImpact: {
      human: { year5: 82, year15: 91, year30: 95, confidence: 93, uncertaintyBand: [87, 96] },
      ecological: { year5: 86, year15: 94, year30: 98, confidence: 94, uncertaintyBand: [91, 99] },
      economic: { year5: 75, year15: 89, year30: 95, confidence: 89, uncertaintyBand: [82, 96] },
      social: { year5: 89, year15: 96, year30: 99, confidence: 96, uncertaintyBand: [94, 100] },
      generational: { year5: 88, year15: 96, year30: 99, confidence: 96, uncertaintyBand: [93, 100] }
    }
  }
];

export const COVENANT_AUDITS: CovenantAuditDossier[] = [
  {
    id: 'cov-rift-geothermal',
    projectTitle: 'Olkaria Geothermal & Green Hydrogen Biocomposite Park',
    proponent: 'Rift Clean Energy Guild & County Innovation Trust',
    funder: 'Pan-African Sovereign Ecological Fund',
    capitalTrancheId: 'TR-001-PATIENT-ENERGY',
    contractType: 'Patient Capital Covenant',
    status: 'Approved',
    dignityScorecard: {
      humanAutonomy: 96,
      ecologicalRegeneration: 94,
      sovereignSelfGovernance: 98,
      intergenerationalEquity: 95,
      antiUsuryCompliance: 100,
      overallDignityScore: 96.6
    },
    predatoryRiskFlags: [],
    vetoGates: [
      {
        id: 'v1',
        stakeholderGroup: 'Maasai Elders & Land Governance Assembly',
        role: 'Indigenous Land Rights Custodian',
        ratificationStatus: 'Ratified',
        concernsRaised: ['Sacred geothermal fumarole sites preserved inviolate', 'Zero permanent displacement of households'],
        mandatoryPrerequisites: ['300m buffer zone around cultural sites cryptographically logged']
      },
      {
        id: 'v2',
        stakeholderGroup: 'Lake Naivasha Water Users Association',
        role: 'Aquifer & Wildlife Sentinel',
        ratificationStatus: 'Ratified',
        concernsRaised: ['Zero thermal runoff into lake surface waters'],
        mandatoryPrerequisites: ['Closed-loop re-injection wells with automated telemetry sensors']
      }
    ],
    secondOrderHarmPrediction: 'AI analysis projects <0.2% risk of environmental damage; 0% debt usury risk. 40-year lease automatically rolls into 100% community municipal ownership.',
    epistemicAuditTrail: 'Full contract audited across 142 clauses. Zero IP locks, zero asymmetric indemnities.'
  },
  {
    id: 'cov-savanna-lithium',
    projectTitle: 'Southern Basin Lithium Concession & Refining Pact',
    proponent: 'Trans-Ocean Mining Consortium LLC',
    funder: 'Offshore Commercial Syndicate #9',
    capitalTrancheId: 'TR-EXT-UNVERIFIED',
    contractType: 'Technology Transfer Charter',
    status: 'Blocked (Moral Veto)',
    dignityScorecard: {
      humanAutonomy: 42,
      ecologicalRegeneration: 31,
      sovereignSelfGovernance: 28,
      intergenerationalEquity: 19,
      antiUsuryCompliance: 25,
      overallDignityScore: 29.0
    },
    predatoryRiskFlags: [
      {
        id: 'flag-1',
        clauseReference: 'Section 14.3: Exclusive Land Alienation & Security Corridor',
        riskType: 'Land Alienation',
        severity: 'Forbidden / Breach',
        violatedPrinciple: 'Inalienability of Community Commons & Habitat',
        aiExplanation: 'Clause grants the private operator the unilateral power to evict local smallholders within a 15km perimeter without local court review or consensus voting.',
        prescribedRemedy: 'Excise Section 14.3 completely. Replace with participatory co-habitation charter.'
      },
      {
        id: 'flag-2',
        clauseReference: 'Section 22.8: Compounding Default Interest Penalty (18.5% APR)',
        riskType: 'Usurious Compounding',
        severity: 'Forbidden / Breach',
        violatedPrinciple: 'Non-Extractive Capital Parity',
        aiExplanation: 'Penal default interest creates mathematically guaranteed debt traps in the event of global commodity price shocks.',
        prescribedRemedy: 'Replace compound interest with patient profit-share tied strictly to ecological surplus.'
      },
      {
        id: 'flag-3',
        clauseReference: 'Section 31.1: IP Enclosure on Refining Patents',
        riskType: 'IP Enclosure',
        severity: 'Elevated',
        violatedPrinciple: 'Open-Source Intellectual Commons',
        aiExplanation: 'Prohibits local technical institutes from inspecting or adapting the refining chemical formulas.',
        prescribedRemedy: 'Adopt the Atlas Open Industrial Hardware & Chemistry License.'
      }
    ],
    vetoGates: [
      {
        id: 'v-lithium-1',
        stakeholderGroup: 'District Watershed Assembly',
        role: 'Water Security Gate',
        ratificationStatus: 'Exercised Veto',
        concernsRaised: ['Lithium evaporation ponds would consume 65% of regional drinking aquifer', 'No environmental bond posted'],
        mandatoryPrerequisites: ['Adopt zero-water direct lithium extraction (DLE)']
      }
    ],
    secondOrderHarmPrediction: 'High probability (89%) of violent social unrest, acute toxic aquifer contamination, and multi-generational sovereign bankruptcy within 7 years.',
    epistemicAuditTrail: 'Flagged automatically by Atlas Constitutional Arbiter within 410 milliseconds of document ingest.'
  },
  {
    id: 'cov-lifehouse-bond',
    projectTitle: 'Modular LifeHouse Biocomposite Housing Bond Series IV',
    proponent: 'Atlas Bio-Industrial Guild',
    funder: 'Civic Municipal Infrastructure Bank',
    capitalTrancheId: 'TR-004-HOUSING-EQUITY',
    contractType: 'Municipal Infrastructure Bond',
    status: 'Remediation Required',
    dignityScorecard: {
      humanAutonomy: 88,
      ecologicalRegeneration: 92,
      sovereignSelfGovernance: 79,
      intergenerationalEquity: 89,
      antiUsuryCompliance: 95,
      overallDignityScore: 88.6
    },
    predatoryRiskFlags: [
      {
        id: 'flag-lh-1',
        clauseReference: 'Section 8.2: Tenant Purchase Option Timeline',
        riskType: 'Extractivism',
        severity: 'Caution',
        violatedPrinciple: 'Equitable Asset Ownership',
        aiExplanation: 'The 15-year rent-to-own equity accrual lacks an accelerated mechanism for tenants contributing physical labor to micro-foundry fabrication.',
        prescribedRemedy: 'Add Sweat Equity Factor: 1 hour of guild manufacturing equals 1.5x equity accrual credit.'
      }
    ],
    vetoGates: [
      {
        id: 'v-lh-1',
        stakeholderGroup: 'Tenant Association Federation',
        role: 'Resident Autonomy Steward',
        ratificationStatus: 'Conditional Approval',
        concernsRaised: ['Need clearer terms on local maintenance warranties'],
        mandatoryPrerequisites: ['Local youth guild assigned exclusive 20-year maintenance charter']
      }
    ],
    secondOrderHarmPrediction: 'Low systemic risk; remediation of Sweat Equity clauses will increase community buy-in from 79% to 98%.',
    epistemicAuditTrail: 'Audited against Atlas Covenant Standard v2.4.'
  }
];

export const TURNKEY_MATCH_PACKAGES: TurnkeyMatchPackage[] = [
  {
    id: 'match-turkana-water',
    problemSignal: {
      id: 'sig-wat-001',
      title: 'High Fluoride & Severe Drought Stress in Lodwar-Kakuma Corridor',
      bioregion: 'Turkana Bioregion, Kenya',
      urgency: 'Acute',
      category: 'Water',
      observedDeficit: 'Fluoride levels at 12.4 mg/L (WHO limit is 1.5 mg/L); 42,000 pastoralists affected with crippling bone fluorosis.',
      sensorHash: '0x8f2a...991c',
      verifiedBeneficiaries: 42000,
      coordinates: [3.119, 35.597]
    },
    matchedBlueprint: {
      id: 'bp-solardesal-v3',
      title: 'Atlas Capacitive Deionization & Solar Desalination Array (500 kL/d)',
      openSourceLicense: 'CERN-OHL-S v2.0 (Open Hardware)',
      tRL: 8,
      provenance: 'Field-tested in Samburu & Atacama Pilot Labs',
      capexEstimate: '$380,000',
      opexAnnual: '$18,000 / yr (Solar Self-Sustaining)',
      localMaterialSuitability: 82,
      youthGuildApprenticeshipHours: 1400
    },
    recommendedCapitalTranche: {
      trancheId: 'TR-002-NATURAL-RESTORE',
      funderName: 'Bioregional Natural Capital Trust',
      amount: '$450,000 Patient Grant-Equity Blend',
      termYears: 25,
      matchScore: 98.4,
      nonExtractiveRationale: '0% compound interest, amortized through mineral salt recovery and municipal water safety surplus.'
    },
    billOfMaterials: [
      { item: 'Locally Sintered Basalt Carbon Filter Beds', quantity: '14 metric tons', sourceType: 'Local Bioregional', estimatedCost: '$28,000' },
      { item: 'Solar PV Bifacial Array (120 kWp)', quantity: '240 panels', sourceType: 'Regional Fabricator', estimatedCost: '$85,000' },
      { item: 'Capacitive Deionization Titanium Mesh Cells', quantity: '48 modular cassettes', sourceType: 'Specialized Import', estimatedCost: '$140,000' },
      { item: 'Food-Grade HDPE High-Pressure Manifolds', quantity: '1,200 meters', sourceType: 'Regional Fabricator', estimatedCost: '$35,000' },
      { item: 'IoT Telemetry Sensors & Cryptographic LoRa Gateway', quantity: '12 nodes', sourceType: 'Specialized Import', estimatedCost: '$12,000' }
    ],
    localLaborPackage: {
      guildSpecialty: 'Solar & Fluid Mechanics Guild',
      guildName: 'Turkana Eco-Tech Youth Guild',
      techniciansCount: 18,
      trainingWeeks: 4,
      localPayrollShare: '84% of installation and 100% of maintenance expenditure retained locally'
    },
    expectedFlourishingDelta: '+18.4% Human Dignity Quotient • 94% Fluoride Reduction within 90 days',
    coordinationReadiness: 96
  },
  {
    id: 'match-congo-biochar',
    problemSignal: {
      id: 'sig-soil-002',
      title: 'Topsoil Acidification & Deforestation from Slash-and-Burn Farming',
      bioregion: 'South Kivu, Democratic Republic of Congo',
      urgency: 'Moderate',
      category: 'Soil',
      observedDeficit: 'Soil organic carbon depleted to 1.4%; cassava yields down 60%; 18,000 families vulnerable to food shocks.',
      sensorHash: '0x3c9d...aa41',
      verifiedBeneficiaries: 18000,
      coordinates: [-2.508, 28.86]
    },
    matchedBlueprint: {
      id: 'bp-biochar-retort',
      title: 'Continuous-Feed Syntropic Pyrolysis Retort & Seed Bank Pod',
      openSourceLicense: 'MIT Open Hardware License',
      tRL: 9,
      provenance: 'Developed by Bukavu Agro-Forestry Guild & CIRAD',
      capexEstimate: '$125,000 for 40 community units',
      opexAnnual: '$8,000 / yr',
      localMaterialSuitability: 94,
      youthGuildApprenticeshipHours: 2200
    },
    recommendedCapitalTranche: {
      trancheId: 'TR-001-PATIENT-ENERGY',
      funderName: 'Pan-African Regenerative Transition Fund',
      amount: '$150,000 Catalytic Grant Tranche',
      termYears: 20,
      matchScore: 96.1,
      nonExtractiveRationale: 'Subsidized by international voluntary biochar carbon credits with 80% direct cash share to farming families.'
    },
    billOfMaterials: [
      { item: 'Recycled Heavy Gauge Steel Cylinders', quantity: '80 vessels', sourceType: 'Local Bioregional', estimatedCost: '$16,000' },
      { item: 'Ceramic Refractory Clay Insulation', quantity: '25 tons', sourceType: 'Local Bioregional', estimatedCost: '$12,000' },
      { item: 'Hermetic Seed Storage Pods (Aluminum & Bamboo)', quantity: '40 pods', sourceType: 'Local Bioregional', estimatedCost: '$32,000' },
      { item: 'Digital Temperature & Gas Telemetry Sensors', quantity: '40 nodes', sourceType: 'Specialized Import', estimatedCost: '$8,500' }
    ],
    localLaborPackage: {
      guildSpecialty: 'Agro-Syntropic & Metal Fabrication Guild',
      guildName: 'Kivu Resilient Farmers Alliance',
      techniciansCount: 32,
      trainingWeeks: 3,
      localPayrollShare: '92% local retention'
    },
    expectedFlourishingDelta: '+24.6% Ecological Integrity • +160% Crop Yield within 2 harvest cycles',
    coordinationReadiness: 94
  },
  {
    id: 'match-zambezi-cold',
    problemSignal: {
      id: 'sig-food-003',
      title: '55% Post-Harvest Fish Spoilage & Dirty Diesel Generation in Zambezi Delta',
      bioregion: 'Zambezi River Delta, Mozambique',
      urgency: 'Acute',
      category: 'Energy',
      observedDeficit: 'Artisanal fishing communities lose 12 tons of catch daily due to lack of cold chain; diesel refrigeration costs $3.40/liter.',
      sensorHash: '0x7e11...5b82',
      verifiedBeneficiaries: 29000,
      coordinates: [-18.84, 36.28]
    },
    matchedBlueprint: {
      id: 'bp-hydro-ice-v2',
      title: 'River Kinetic Archimedes Hydro Turbine & Ice Flaker Microgrid',
      openSourceLicense: 'GPL v3.0 Open Engineering',
      tRL: 8,
      provenance: 'Tested in Zambezi Basin & Mekong Delta',
      capexEstimate: '$260,000',
      opexAnnual: '$12,000 / yr',
      localMaterialSuitability: 78,
      youthGuildApprenticeshipHours: 1800
    },
    recommendedCapitalTranche: {
      trancheId: 'TR-003-COMMUNITY-STAKE',
      funderName: 'Coastal Blue Economy Cooperative Bank',
      amount: '$300,000 Non-Extractive Revenue-Share Loan',
      termYears: 18,
      matchScore: 95.8,
      nonExtractiveRationale: 'Repaid solely as a tiny 2% tariff on verified daily ice sales, zero repayment during off-season fish breeding bans.'
    },
    billOfMaterials: [
      { item: 'Ultra-Low Head Archimedes Hydro Turbine (45 kW)', quantity: '2 units', sourceType: 'Regional Fabricator', estimatedCost: '$80,000' },
      { item: 'Ammonia Absorption Thermal Ice Flaker (5 Tons/day)', quantity: '1 plant', sourceType: 'Specialized Import', estimatedCost: '$95,000' },
      { item: 'Insulated Local Timber & Cork Cold Lockers', quantity: '8 chambers', sourceType: 'Local Bioregional', estimatedCost: '$30,000' },
      { item: 'Solar Thermal Boost Coils & Heat Exchangers', quantity: '1 array', sourceType: 'Regional Fabricator', estimatedCost: '$25,000' }
    ],
    localLaborPackage: {
      guildSpecialty: 'Maritime Engineering & Refrigeration Guild',
      guildName: 'Delta Artisanal Fisher Guild',
      techniciansCount: 22,
      trainingWeeks: 5,
      localPayrollShare: '88% local retention'
    },
    expectedFlourishingDelta: '+32.1% Fisher Household Income • 100% Elimination of Toxic Diesel Spills',
    coordinationReadiness: 98
  }
];
