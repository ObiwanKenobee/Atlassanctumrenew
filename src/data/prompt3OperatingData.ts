import { OpportunityBrief, DecisionRoomScenario } from '../types';

export const SAMPLE_OPPORTUNITY_BRIEFS: Record<string, OpportunityBrief> = {
  nairobi_drainage: {
    id: 'opp-nairobi-drainage',
    generatedAt: '2026-08-25T06:00:00Z',
    location: 'Nairobi (Mathare & Nairobi River Basin)',
    bioregion: 'Athi-Galana Watershed / Kenyan Highlands',
    problem: {
      id: 'prob-nairobi-01',
      title: 'Mathare River Drainage Vulnerability & Flash Flood Hazard',
      category: 'water_drainage',
      locationName: 'Nairobi',
      bioregion: 'Athi-Galana Catchment',
      coordinates: [-1.262, 36.858],
      severityScore: 88,
      affectedPopulation: '185,000 residents across riparian corridors',
      summary: 'High population density along informal floodplains combined with concrete runoff bottlenecks and solid waste interception gaps leads to severe seasonal flood inundation.',
      symptoms: [
        'Frequent flash flood overflows impacting 4,200+ dwellings annually',
        'Stagnant water-borne enteric pathogen spikes following precipitation pulses',
        'Severe road & informal footbridge washouts disconnecting markets and schools'
      ],
      rootCauses: [
        'Impermeable surface expansion without compensatory retention swales',
        'Upstream solid waste blockages in culvert bottlenecks',
        'Historical under-investment in natural bioswale riparian buffers'
      ],
      observedDeficits: [
        { label: 'Surface Runoff Absorption', value: '14% (Critical Deficit)', status: 'critical' },
        { label: 'Solid Waste Interception Efficiency', value: '28% Capacity', status: 'severe' },
        { label: 'Floodplain Riparian Canopy', value: '9% Baseline', status: 'critical' }
      ],
      leveragePoints: [
        { point: 'Upstream Retention Bioswales & Riparian Bamboo Belts', multiplierPotential: '3.8x Runoff Attenuation', mechanism: 'Slows peak hydrograph surges by 45 minutes.' },
        { point: 'Civic Waste Interception Traps with Youth Circular Guilds', multiplierPotential: '4.2x Blockage Reduction', mechanism: 'Turns intercepted plastic into interlocking permeable pavers.' },
        { point: 'Decentralized Permeable Alleys & Living Rain Gardens', multiplierPotential: '2.5x Ground Infiltration', mechanism: 'Recharges local perched aquifers and lowers flood heights.' }
      ]
    },
    whyHereMetrics: [
      { label: 'Flood Exposure', level: 'High', description: 'Top 5% flood hazard index in Nairobi metropolitan basin' },
      { label: 'Infrastructure Stress', level: 'Critical', description: 'Overburdened 1970s drainage culverts running at 280% capacity during rains' },
      { label: 'Population Density', level: 'High', description: '1,200 people/hectare in immediate riparian impact perimeter' },
      { label: 'Existing Verified Projects', level: 'Low', description: 'Fragmented municipal efforts with zero real-time IoT water monitoring' },
      { label: 'Capital Availability', level: 'Moderate', description: 'Catalytic grant pools and municipal resilience co-funding accessible' },
      { label: 'Ecological Restoration Potential', level: 'High', description: 'Deep volcanic soil responsive to rapid biochar-amended bioswale stabilization' }
    ],
    evidenceBase: [
      {
        id: 'ev-01',
        claim: 'Peak storm discharge exceeds culvert conveyance capacity by 2.8x during 5-year return events.',
        tier: 'VERIFIED',
        source: 'Mathare Watershed IoT Piezometer Network & USGS Hydrological Stream Gages',
        methodology: 'Continuous ultrasonic sensor logging + empirical flow velocity calibration.',
        confidenceScore: 94,
        sampleSizeOrSensorMesh: '18 active streamflow nodes over 36 months',
        assumptions: ['Standard 50mm/hr cloudburst events based on 2024-2026 rainfall records.'],
        lastVerifiedDate: '2026-08-10',
        hash: '0x8b32..4f11'
      },
      {
        id: 'ev-02',
        claim: 'Permeable pavement + bioswales reduce local surface pooling duration by 62%.',
        tier: 'OBSERVED',
        source: 'Kibera Living Lab Pilot (Station #4 Field Lab)',
        methodology: 'Pre- and post-installation moisture sensors and community waterlogging logs.',
        confidenceScore: 87,
        sampleSizeOrSensorMesh: '400m pilot corridor with 12 groundwater probes',
        assumptions: ['Maintenance guild conducts monthly sediment clearing.'],
        lastVerifiedDate: '2026-07-28',
        hash: '0x6e90..2c8a'
      },
      {
        id: 'ev-03',
        claim: 'Household economic losses from flood damage average $240/household/year.',
        tier: 'MODELED',
        source: 'Bioregional Causal Simulation Model v2.4 (Atlas Studio)',
        methodology: 'Agent-based survey cross-correlated with satellite flood extent radar.',
        confidenceScore: 81,
        assumptions: ['Asset replacement costs pegged to 2026 local informal market rates.'],
        lastVerifiedDate: '2026-08-01'
      }
    ],
    interventions: [
      {
        id: 'int-01',
        title: 'Bioswale Riparian Buffer & Bamboo Infiltration Corridors',
        shortDescription: 'Terraced agroforestry berms and biochar-infused vegetated bioswales to capture upstream runoff surges.',
        tier: 'infrastructure',
        capitalRequiredEstimate: { min: 450000, max: 750000, currency: 'USD' },
        timelineMonths: 14,
        expectedOutcomes: [
          { label: 'Flood Peak Attenuation', modeledEstimate: '35–48% reduction', confidenceRange: '±6%', tier: 'MODELED' },
          { label: 'Sediment Load Interception', modeledEstimate: '850 t/year prevented', confidenceRange: '±12%', tier: 'OBSERVED' },
          { label: 'Green Open Space Created', modeledEstimate: '14.2 hectares', confidenceRange: 'Exact', tier: 'VERIFIED' }
        ],
        tradeOffs: { cost: 'moderate', impact: 'high', speed: 'moderate', equity: 'high', resilience: 'high' },
        risks: [
          { risk: 'Upstream sediment siltation if unmaintained', severity: 'medium', mitigation: 'Form local youth stewardship guild paid via outcome-based milestone tranches.' },
          { risk: 'Temporary access disruption during earthworks', severity: 'low', mitigation: 'Phased 50-meter modular construction blocks.' }
        ],
        ethicalSafeguards: [
          { principle: 'Human Dignity & Non-Displacement', safeguard: 'Zero involuntary relocations; all riparian buffers integrated around existing structures.', beneficiaryBurdenCheck: 'No household displaced; property flood risk directly reduced.' },
          { principle: 'Economic Justice', safeguard: '100% of physical labor sourced from Mathare community guilds at 1.4x living wage.', beneficiaryBurdenCheck: 'Local capital retention guaranteed.' }
        ],
        blueprintRef: 'BP-DRAIN-AFR-04'
      },
      {
        id: 'int-02',
        title: 'Interlocking Permeable Pavers & Waste Interception Guilds',
        shortDescription: 'Transform collected plastic waste into porous pavers installed along primary pedestrian thoroughfares.',
        tier: 'catalytic',
        capitalRequiredEstimate: { min: 220000, max: 380000, currency: 'USD' },
        timelineMonths: 9,
        expectedOutcomes: [
          { label: 'Waterlogging Infiltration Rate', modeledEstimate: '4.2x baseline absorption', confidenceRange: '±8%', tier: 'OBSERVED' },
          { label: 'Plastic Intercepted from River', modeledEstimate: '120 tonnes/year', confidenceRange: '±15%', tier: 'VERIFIED' },
          { label: 'Direct Youth Jobs Created', modeledEstimate: '65 full-time equivalents', confidenceRange: '±5%', tier: 'VERIFIED' }
        ],
        tradeOffs: { cost: 'low', impact: 'moderate', speed: 'fast', equity: 'high', resilience: 'moderate' },
        risks: [
          { risk: 'Paver pore clogging by fine clay dust', severity: 'medium', mitigation: 'Bi-weekly mechanical vacuum sweep protocol.' }
        ],
        ethicalSafeguards: [
          { principle: 'Inclusion & Fair Equity', safeguard: 'Guild ownership vested in community cooperative with transparent revenue sharing.', beneficiaryBurdenCheck: 'Cooperative retains equipment and profits.' }
        ],
        blueprintRef: 'BP-PAVER-PLAST-02'
      }
    ],
    totalCapitalRequiredRange: { min: 670000, max: 1130000, currency: 'USD' },
    recommendedFirstStep: 'Deploy 4 additional IoT water-level sensor placards and ratify community covenant with Mathare River Ward Assembly.',
    ethicalAssessment: {
      humanDignity: 'Ensures safe walking pathways and eliminates raw sewage backflows into domestic spaces.',
      justiceAndBurden: 'Benefits directly flow to vulnerable downstream informal settlements rather than commercial gentrifiers.',
      inclusionRisk: 'Women-led street vendor associations are integrated into drainage layout design to prevent stall displacement.',
      ecologicalRegeneration: 'Restores natural riparian soil ecology and native Athi River biodiversity.',
      intergenerationalHorizon: 'Engineered for 30+ year lifespan under intensified climate variability scenarios.'
    },
    provenance: {
      id: 'prov-opp-01',
      source: 'Atlas Bioregional Intelligence Mesh & Nairobi City County Geospatial Open Data',
      sourceType: 'iot_sensor_mesh',
      collectedAt: '2026-08-25T05:30:00Z',
      calculationMethod: 'Topological Hydrology Mesh + Multi-Layer Vulnerability Matrix',
      certaintyScore: 91,
      verifier: 'Dr. Wanjiku Mwangi, P.E. (Atlas Regional Fellow)',
      verifierRole: 'Hydrological Systems Lead',
      cryptographicHash: '0x9d4a..77e1',
      assumptions: ['Runoff coefficient 0.85 on compacted volcanic clay', 'Rainfall intensity based on 2025-2026 radar telemetry'],
      lastAudited: '2026-08-20'
    }
  },

  morogoro_agroforestry: {
    id: 'opp-morogoro-agroforestry',
    generatedAt: '2026-08-25T06:10:00Z',
    location: 'Morogoro & Uluguru Catchment, Tanzania',
    bioregion: 'Eastern Arc Mountains Biodiversity Hotspot',
    problem: {
      id: 'prob-tz-01',
      title: 'Topsoil Erosion & Drought Vulnerability on Steep Slopes',
      category: 'agroecology_soil',
      locationName: 'Morogoro',
      bioregion: 'Uluguru Highlands',
      coordinates: [-6.827, 37.659],
      severityScore: 76,
      affectedPopulation: '94,000 smallholder agro-pastoralists',
      summary: 'Slash-and-burn cycles on 25°+ mountain slopes combined with monocropping have degraded soil organic matter to under 1.2%, threatening Ruvu River downstream water supply for Dar es Salaam.',
      symptoms: [
        'Annual topsoil loss exceeding 35 tonnes/hectare/year',
        'Seasonal crop yield variance of up to 60% due to erratic rainfall',
        'Severe siltation of downstream Dar es Salaam municipal reservoirs'
      ],
      rootCauses: [
        'Lack of access to diversified nitrogen-fixing perennial tree seeds',
        'Short-term tenant farming disincentivizing long-term terracing investments',
        'Absence of patient micro-capital for perennial establishment lead times'
      ],
      observedDeficits: [
        { label: 'Soil Organic Carbon', value: '1.1% (Critical)', status: 'critical' },
        { label: 'Perennial Tree Cover on Slopes', value: '18% Baseline', status: 'severe' },
        { label: 'Water Retention Capacity', value: '38mm / 100mm Event', status: 'critical' }
      ],
      leveragePoints: [
        { point: 'Syntropic Multi-Stratum Agroforestry & Biochar Seedlings', multiplierPotential: '4.5x Carbon & Water Boost', mechanism: 'Boosts soil organic matter to 3.8% within 4 harvest cycles.' },
        { point: 'Payment-for-Ecosystem-Services (PES) Water Fund', multiplierPotential: '3.0x Income Stability', mechanism: 'Dar es Salaam water utility funds upstream farmer regenerative land covenants.' }
      ]
    },
    whyHereMetrics: [
      { label: 'Ecological Strategic Value', level: 'Critical', description: 'Provides 70% of municipal freshwater to Dar es Salaam (6M people)' },
      { label: 'Degradation Velocity', level: 'High', description: 'Satellite radar indicates 4.2% annual loss of mountain tree cover' },
      { label: 'Community Readiness', level: 'High', description: 'Strong local farmer cooperatives with active women leadership' },
      { label: 'Capital Availability', level: 'Moderate', description: 'Downstream water utility PES funds and carbon permanence tranches' }
    ],
    evidenceBase: [
      {
        id: 'ev-tz-01',
        claim: 'Syntropic agroforestry plots in Uluguru retain 3.2x more moisture during 45-day dry spells.',
        tier: 'VERIFIED',
        source: 'Sokoine University of Agriculture Field Trials (2023-2026)',
        methodology: 'TDR soil moisture sensors at 15cm, 30cm, and 60cm depths.',
        confidenceScore: 96,
        sampleSizeOrSensorMesh: '24 paired catchment parcels',
        assumptions: ['Mulching depth maintained at ≥5cm.'],
        lastVerifiedDate: '2026-07-15',
        hash: '0x33e1..88ac'
      }
    ],
    interventions: [
      {
        id: 'int-tz-01',
        title: 'Contour Swales, Vetiver Strips & Syntropic Coffee-Macadamia Canopies',
        shortDescription: 'Regenerative agroforestry terracing paired with high-value perennial cash crops and biochar kiln distribution.',
        tier: 'infrastructure',
        capitalRequiredEstimate: { min: 380000, max: 620000, currency: 'USD' },
        timelineMonths: 18,
        expectedOutcomes: [
          { label: 'Soil Organic Carbon Increase', modeledEstimate: '+1.8% in 36 months', confidenceRange: '±0.3%', tier: 'MODELED' },
          { label: 'Smallholder Net Revenue', modeledEstimate: '+85% by Year 3', confidenceRange: '±14%', tier: 'OBSERVED' },
          { label: 'Downstream Reservoir Silt Reduction', modeledEstimate: '42,000 t/year', confidenceRange: '±20%', tier: 'PROJECTED' }
        ],
        tradeOffs: { cost: 'moderate', impact: 'high', speed: 'moderate', equity: 'high', resilience: 'high' },
        risks: [
          { risk: 'Delayed cash crop yields during initial 24-month establishment', severity: 'medium', mitigation: 'Bridge payments via monthly regenerative carbon & water outcome payouts.' }
        ],
        ethicalSafeguards: [
          { principle: 'Customary Land Sovereignty', safeguard: 'Covenants registered in joint spousal names with perpetual tenure guarantees.', beneficiaryBurdenCheck: 'Protects women smallholders from eviction.' }
        ],
        blueprintRef: 'BP-AGRO-SLOPE-01'
      }
    ],
    totalCapitalRequiredRange: { min: 380000, max: 620000, currency: 'USD' },
    recommendedFirstStep: 'Convene 6 Uluguru catchment village assemblies to establish watershed boundary baseline.',
    ethicalAssessment: {
      humanDignity: 'Eliminates structural poverty through resilient perennial high-margin cash crops.',
      justiceAndBurden: 'Compensates upstream stewards fairly for downstream water quality preservation.',
      inclusionRisk: 'Ensures equitable participation of youth and landless agricultural laborers.',
      ecologicalRegeneration: 'Stabilizes critical Eastern Arc mountain biodiversity buffer zones.',
      intergenerationalHorizon: 'Transforms degraded mountainsides into compounding food forests for future generations.'
    },
    provenance: {
      id: 'prov-opp-02',
      source: 'Sokoine University of Agriculture & Atlas Earth Observation Mesh',
      sourceType: 'peer_reviewed_model',
      collectedAt: '2026-08-20T09:00:00Z',
      calculationMethod: 'RUSLE Soil Loss Equation + Synthetic Aperture Radar Biomass Tracking',
      certaintyScore: 89,
      verifier: 'Prof. J. Mchome (Sokoine Agroforestry Institute)',
      verifierRole: 'Principal Agroecology Investigator',
      cryptographicHash: '0x12a8..99fe',
      assumptions: ['Rainfall erosivity factor R = 420 J/m2'],
      lastAudited: '2026-08-18'
    }
  }
};

export const SAMPLE_DECISION_SCENARIOS: Record<string, DecisionRoomScenario> = {
  nairobi_corridor: {
    id: 'dec-nairobi-01',
    title: 'Mathare Watershed Multi-Modal Intervention Strategy',
    location: 'Nairobi, Kenya',
    problemContext: 'How should the Mathare Watershed Community Council allocate $1.2M in catalytic capital over 36 months to maximize human flourishing, flood safety, and youth livelihood resilience?',
    options: [
      {
        id: 'opt-a',
        name: 'Option A: Riparian Bio-Engineered Bioswales & Micro-Dams',
        tagline: 'Deep ecological watershed stabilization & flood peak attenuation',
        capitalNeeded: '$680,000',
        timeToImpact: '14–18 Months',
        benefits: [
          '42% reduction in peak flash flood runoff surges',
          'Creation of 14 hectares of protected civic green canopy',
          'High long-term hydrological and groundwater resilience'
        ],
        costs: [
          'Higher upfront earthmoving and nursery establishment capital',
          'Requires structured monthly maintenance agreements'
        ],
        risks: [
          'Potential siltation if upstream solid waste is not captured simultaneously',
          'Seasonal delay risk if planting misses short rain window'
        ],
        environmentalImpact: 'High positive: Restores native riparian wetland habitat and soil microbiomes.',
        uncertaintyAssessment: 'Modeled confidence: 85–92%. Ground-truth data verified from 18 IoT piezometers.',
        tradeOffScores: {
          cost: 3,       // Moderate
          impact: 5,     // Very high
          speed: 3,      // Moderate
          equity: 5,     // Very high
          resilience: 5  // Maximum
        }
      },
      {
        id: 'opt-b',
        name: 'Option B: Permeable Pavement & Circular Waste Micro-Guilds',
        tagline: 'Rapid economic inclusion + decentralized surface drainage',
        capitalNeeded: '$340,000',
        timeToImpact: '6–9 Months',
        benefits: [
          'Immediate livelihood for 65+ youth transforming plastic into pavers',
          'Rapid 4.2x improvement in alleyway pedestrian access during rains',
          'Low complexity, highly modular distributed deployment'
        ],
        costs: [
          'Lower overall peak flood volume attenuation than full river bioswales',
          'Requires ongoing paver vacuuming and maintenance discipline'
        ],
        risks: [
          'Pores may clog without community stewardship compliance',
          'Plastic sourcing supply chain variance'
        ],
        environmentalImpact: 'Moderate positive: Prevents 120 tonnes of plastic pollution from reaching the Indian Ocean.',
        uncertaintyAssessment: 'Observed confidence: 88%. Tested directly at Station #4 Kibera Living Lab.',
        tradeOffScores: {
          cost: 2,       // Low-moderate cost
          impact: 4,     // High
          speed: 5,      // Very fast
          equity: 5,     // Maximum equity
          resilience: 4  // Good resilience
        }
      },
      {
        id: 'opt-c',
        name: 'Option C: Concrete Deep-Culvert Channelization (Conventional)',
        tagline: 'Standard municipal civil engineering flood evacuation',
        capitalNeeded: '$1,100,000',
        timeToImpact: '24–30 Months',
        benefits: [
          'High water velocity evacuation through designated channel',
          'Standardized municipal contractor specifications'
        ],
        costs: [
          'Very high financial cost and concrete carbon footprint',
          'Transfers flood surge downstream, exacerbating downstream disasters',
          'Zero local job retention or ecological regeneration'
        ],
        risks: [
          'Catastrophic failure if concrete culvert fractures or clogs with debris',
          'High risk of displacement and community gentrification'
        ],
        environmentalImpact: 'Negative: Destroys natural river ecology and creates concrete heat sink.',
        uncertaintyAssessment: 'Engineering models standard, but ecological failure rates high across informal settlements.',
        tradeOffScores: {
          cost: 5,       // Very expensive
          impact: 2,     // Narrow impact
          speed: 2,      // Slow
          equity: 2,     // Low equity
          resilience: 2  // Low resilience (brittle)
        }
      }
    ]
  }
};
