import { DataProvenance } from '../types';

export interface EcologicalMetricItem {
  id: string;
  name: string;
  category: 'canopy' | 'water' | 'soil' | 'biodiversity' | 'microclimate' | 'atmospheric';
  currentValue: number;
  unit: string;
  baselineValue: number;
  targetValue: number;
  deltaPct: number;
  status: 'optimal' | 'recovering' | 'fragile' | 'critical';
  confidenceScore: number;
  provenance: DataProvenance;
  historicalTrend: number[];
  sensorMeshNodesCount: number;
  lastUpdatedMinutesAgo: number;
}

export interface BioregionalResourceFlowItem {
  id: string;
  title: string;
  category: 'water' | 'carbon' | 'energy' | 'biomass';
  sourceNode: string;
  targetNode: string;
  flowRate: number;
  flowUnit: string;
  circularityPct: number;
  flowVelocity: 'rapid' | 'steady' | 'seasonal' | 'closed_loop';
  status: 'balanced' | 'surplus' | 'deficit';
  description: string;
  provenance: DataProvenance;
  lastProofBlock: number;
}

export interface SankeyFlowNode {
  id: string;
  name: string;
  category: 'water' | 'energy' | 'nutrients' | 'integrated';
  nodeType: 'natural_source' | 'ecological_transducer' | 'community_sink' | 'storage_buffer';
  capacityDescription: string;
}

export interface SankeyFlowLink {
  source: string;
  target: string;
  value: number; // Volume / throughput weight
  category: 'water' | 'energy' | 'nutrients';
  flowRateDisplay: string;
  circularityPct: number;
  flowVelocity: 'rapid' | 'steady' | 'seasonal' | 'closed_loop';
  description: string;
  cryptographicProof: string;
  lastBlock: number;
}

export interface BioregionalSankeyNetwork {
  nodes: SankeyFlowNode[];
  links: SankeyFlowLink[];
}

export interface HistoricalTimelineEpoch {
  year: number;
  label: string;
  title: string;
  description: string;
  compositeFlourishingScore: number;
  waterYieldMultiplier: number;
  carbonRateMultiplier: number;
  auditStandard: string;
}

export interface BioregionalLedgerData {
  regionId: string;
  regionName: string;
  biomeType: string;
  country: string;
  totalAreaHectares: number;
  activeStewardAssembliesCount: number;
  compositeFlourishingScore: number; // 0 - 100
  carbonSequestrationRateAnnualTonnes: number;
  waterYieldAnnualM3: number;
  metrics: EcologicalMetricItem[];
  resourceFlows: BioregionalResourceFlowItem[];
  sankeyNetwork: BioregionalSankeyNetwork;
}

export const HISTORICAL_TIMELINE_EPOCHS: HistoricalTimelineEpoch[] = [
  {
    year: 2018,
    label: '2018 Baseline',
    title: 'Pre-Restoration Watershed Baseline',
    description: 'Fragmented canopy cover, severe river sedimentation, seasonal drought stress, and unmetered extraction before community stewardship accords.',
    compositeFlourishingScore: 48.2,
    waterYieldMultiplier: 0.52,
    carbonRateMultiplier: 0.44,
    auditStandard: 'Manual Paper Sampling & Sparse Satellite Feeds'
  },
  {
    year: 2020,
    label: '2020 Pilot',
    title: 'Community Stewardship & Sand Dam Inception',
    description: 'First 18 Indigenous Elder & pastoralist assemblies ratify basin accords; initial riparian fencing and micro-catchment weirs established.',
    compositeFlourishingScore: 62.5,
    waterYieldMultiplier: 0.68,
    carbonRateMultiplier: 0.61,
    auditStandard: 'Early Field Audits & Handheld GPS Coordinates'
  },
  {
    year: 2022,
    label: '2022 Sensor Mesh',
    title: 'Decentralized IoT Telemetry Deployment',
    description: 'Deployment of 120+ solar ultrasonic streamflow gauges, bioacoustic microphone pods, and automated Walkley-Black soil organic testing.',
    compositeFlourishingScore: 75.8,
    waterYieldMultiplier: 0.81,
    carbonRateMultiplier: 0.78,
    auditStandard: 'Merkle Leaf Anchoring & Cryptographic Streamflow Signatures'
  },
  {
    year: 2024,
    label: '2024 Stabilization',
    title: 'Bioregional Regenerative Stabilization',
    description: 'Perennial cover crops, holistic rotational grazing corridors, and zero-carbon solar micro-pumping achieve positive aquifer recharge parity.',
    compositeFlourishingScore: 85.3,
    waterYieldMultiplier: 0.92,
    carbonRateMultiplier: 0.90,
    auditStandard: 'Automated Zero-Knowledge Proof-of-Regeneration'
  },
  {
    year: 2026,
    label: '2026 Live',
    title: 'Current Real-Time Epistemic Telemetry',
    description: 'Autonomous multi-modal sensing mesh with continuous sub-hourly cryptographic proofs, closed-loop metabolic flows, and flourishing ecosystem state.',
    compositeFlourishingScore: 91.4,
    waterYieldMultiplier: 1.0,
    carbonRateMultiplier: 1.0,
    auditStandard: 'Section 30 Epistemic Trust Protocol (Active Live Stream)'
  }
];

export const BIOREGIONAL_LEDGER_REGIONS: Record<string, BioregionalLedgerData> = {
  'mara-serengeti': {
    regionId: 'mara-serengeti',
    regionName: 'Mara-Serengeti River Basin & Savannah Biosphere',
    biomeType: 'Tropical & Subtropical Grasslands, Savannas, and Shrublands',
    country: 'Kenya / Tanzania',
    totalAreaHectares: 2500000,
    activeStewardAssembliesCount: 18,
    compositeFlourishingScore: 91.4,
    carbonSequestrationRateAnnualTonnes: 345000,
    waterYieldAnnualM3: 480000000,
    metrics: [
      {
        id: 'mara-metric-riparian-flow',
        name: 'Riparian Baseflow & River Turbidity',
        category: 'water',
        currentValue: 18.6,
        unit: 'm³/s',
        baselineValue: 9.4,
        targetValue: 20.0,
        deltaPct: 97.8,
        status: 'recovering',
        confidenceScore: 99.2,
        provenance: {
          id: 'PROV-MARA-WATER-01',
          source: 'Mara In-situ Sonde Telemetry Mesh (Node #4)',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          calculationMethod: 'Doppler Ultrasonic Streamflow Gauge & NTU Optical Sensor',
          certaintyScore: 99.2,
          verifier: 'Mara Transboundary Basin Commission & UN-Water',
          verifierRole: 'Certified Watershed Hydrologist',
          cryptographicHash: '0x4f128e99bcde710294821a8374829103',
          assumptions: ['River cross-section calibrated post-seasonal flood', 'Sediment rating curve updated bi-weekly'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [12.1, 13.4, 14.8, 16.0, 17.2, 18.6],
        sensorMeshNodesCount: 24,
        lastUpdatedMinutesAgo: 12
      },
      {
        id: 'mara-metric-soil-som',
        name: 'Savannah Soil Organic Matter (SOM)',
        category: 'soil',
        currentValue: 3.8,
        unit: '% SOM',
        baselineValue: 1.9,
        targetValue: 4.5,
        deltaPct: 100.0,
        status: 'optimal',
        confidenceScore: 98.4,
        provenance: {
          id: 'PROV-MARA-SOIL-02',
          source: 'Holistic Planned Grazing Soil Core Sample Batch #109',
          sourceType: 'field_audit',
          collectedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          calculationMethod: 'Spectroscopic Dry Combustion & Walkley-Black In-situ Validation',
          certaintyScore: 98.4,
          verifier: 'Savory Hub Africa & Maasai Conservancies Council',
          verifierRole: 'Master Soil Scientist & Elder Co-Signer',
          cryptographicHash: '0x992384a102938475bcde182736450192',
          assumptions: ['Core taken at 0-30cm and 30-60cm depths across 40 pastoralist transects'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [2.1, 2.4, 2.8, 3.1, 3.5, 3.8],
        sensorMeshNodesCount: 42,
        lastUpdatedMinutesAgo: 45
      },
      {
        id: 'mara-metric-canopy-density',
        name: 'Riparian Gallery Forest & Acacia Canopy Cover',
        category: 'canopy',
        currentValue: 28.4,
        unit: '% cover',
        baselineValue: 16.2,
        targetValue: 32.0,
        deltaPct: 75.3,
        status: 'recovering',
        confidenceScore: 97.9,
        provenance: {
          id: 'PROV-MARA-CANOPY-03',
          source: 'Sentinel-2 Multispectral & GEDI Spaceborne Lidar',
          sourceType: 'satellite_telemetry',
          collectedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          calculationMethod: 'Calibrated NDVI & Canopy Height Model (CHM) 10m Resolution',
          certaintyScore: 97.9,
          verifier: 'Copernicus Earth Observation & KEFRI Remote Sensing Group',
          verifierRole: 'Spaceborne Biosphere Sentinel',
          cryptographicHash: '0x182736450192938475bcde4f128e99bc',
          assumptions: ['Cloud-free tile mosaic generated from 5 consecutive orbital passes'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [18.2, 20.1, 22.4, 24.8, 26.5, 28.4],
        sensorMeshNodesCount: 16,
        lastUpdatedMinutesAgo: 120
      },
      {
        id: 'mara-metric-biodiversity-index',
        name: 'Acoustic Bio-Resonance & Keystone Index',
        category: 'biodiversity',
        currentValue: 3.84,
        unit: 'H′ (Shannon Index)',
        baselineValue: 2.10,
        targetValue: 4.20,
        deltaPct: 82.8,
        status: 'optimal',
        confidenceScore: 99.1,
        provenance: {
          id: 'PROV-MARA-BIO-04',
          source: 'Decentralized Bioacoustic Listening Post Mesh (48 Microphones)',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          calculationMethod: 'Continuous FFT Audio Spectral Analysis & Automated Species Classifier',
          certaintyScore: 99.1,
          verifier: 'Mara Predator Project & Indigenous Trackers Guild',
          verifierRole: 'Field Ecology Master Auditor',
          cryptographicHash: '0x77182930485716253448596019283746',
          assumptions: ['Machine classification checked with zero false positive vocalizations'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [2.5, 2.8, 3.1, 3.4, 3.7, 3.84],
        sensorMeshNodesCount: 48,
        lastUpdatedMinutesAgo: 5
      }
    ],
    resourceFlows: [
      {
        id: 'mara-flow-water-cycle',
        title: 'Mau Escarpment -> Mara River -> Mara Wetland Baseflow',
        category: 'water',
        sourceNode: 'Mau Cloud Forest Aquifer Recharge Zone',
        targetNode: 'Mara Wetland & Lake Victoria Estuary',
        flowRate: 18.6,
        flowUnit: 'm³/s continuous',
        circularityPct: 94.5,
        flowVelocity: 'steady',
        status: 'balanced',
        description: 'Natural riverine infiltration loop buffering seasonal drought and maintaining wildlife migration hydration corridors.',
        provenance: {
          id: 'PROV-FLOW-MARA-01',
          source: 'Transboundary Hydrological Sensor Array',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'Integrated Basin Hydrology Mass-Balance Equilibrium',
          certaintyScore: 99.3,
          verifier: 'East African Community Lake Victoria Basin Commission',
          verifierRole: 'Bioregional Water Custodian',
          cryptographicHash: '0xabcdef1234567890abcdef1234567890',
          assumptions: ['Trans-evaporation rates compensated by microclimatic canopy cooling'],
          lastAudited: new Date().toISOString()
        },
        lastProofBlock: 184912
      },
      {
        id: 'mara-flow-carbon-cycle',
        title: 'Deep Prairie Roots -> Subterranean Fungi -> Lithic Storage',
        category: 'carbon',
        sourceNode: 'Perennial C4 Grassland Aboveground Canopy',
        targetNode: 'Subsoil Humus & Microbial Necromass Sink',
        flowRate: 3.4,
        flowUnit: 'tCO2e/ha/year',
        circularityPct: 98.2,
        flowVelocity: 'closed_loop',
        status: 'surplus',
        description: 'High-efficiency biological carbon pump driven by non-selective holistic grazing and dung beetle soil burial.',
        provenance: {
          id: 'PROV-FLOW-MARA-02',
          source: 'Eddy Covariance Carbon Flux Tower #2',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'Micrometeorological Eddy Covariance Net Ecosystem Exchange (NEE)',
          certaintyScore: 98.8,
          verifier: 'Global Carbon Project East Africa Node',
          verifierRole: 'Epistemic Carbon Auditor',
          cryptographicHash: '0x1234567890abcdef1234567890abcdef',
          assumptions: ['Nighttime respiration flux mathematically subtracted'],
          lastAudited: new Date().toISOString()
        },
        lastProofBlock: 184920
      },
      {
        id: 'mara-flow-energy-grid',
        title: 'Decentralized Solar-Pumping -> Grazing Troughs -> Surplus Battery',
        category: 'energy',
        sourceNode: 'Pastoralist Distributed Solar Mini-Grids',
        targetNode: 'Borehole Deep Piezometer Pumps & Cold Storage',
        flowRate: 1.4,
        flowUnit: 'MW peak generation',
        circularityPct: 96.0,
        flowVelocity: 'steady',
        status: 'balanced',
        description: 'Clean energy loop providing zero-emissions livestock water supply while powering local school micro-hubs.',
        provenance: {
          id: 'PROV-FLOW-MARA-03',
          source: 'Smart Microgrid Inverter Telemetry API',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'P2P Microgrid Smart Metering Hash Ingestion',
          certaintyScore: 99.5,
          verifier: 'Community Solar Utility Co-op',
          verifierRole: 'Energy Sovereign Sentinel',
          cryptographicHash: '0xfeedfacecafebeef0192837465543210',
          assumptions: ['Battery round-trip efficiency rated at 94.2%'],
          lastAudited: new Date().toISOString()
        },
        lastProofBlock: 184931
      }
    ],
    sankeyNetwork: {
      nodes: [
        { id: 'mau_rainfall', name: 'Mau Escarpment Rainfall & Fog', category: 'water', nodeType: 'natural_source', capacityDescription: 'High-altitude cloud forest precipitation (1,800mm/yr)' },
        { id: 'solar_irradiance', name: 'Savannah Solar Photovoltaic Mesh', category: 'energy', nodeType: 'natural_source', capacityDescription: '5.8 kWh/m²/day solar insolation potential' },
        { id: 'grazing_dung', name: 'Holistic Grazing Biomass & Dung', category: 'nutrients', nodeType: 'natural_source', capacityDescription: 'Herd-driven organic microbial catalyst' },
        { id: 'acacia_litter', name: 'Acacia & Riparian Leaf Litter', category: 'nutrients', nodeType: 'natural_source', capacityDescription: 'Nitrogen-fixing woody biomass fall' },
        { id: 'cloud_canopy', name: 'Cloud Forest Canopy Sponge', category: 'water', nodeType: 'ecological_transducer', capacityDescription: 'Intact indigenous moss and tree crown water retention' },
        { id: 'mara_mainstem', name: 'Mara River Baseflow & Sand Dams', category: 'water', nodeType: 'ecological_transducer', capacityDescription: 'Perennial alluvial corridor and sub-sand aquifers' },
        { id: 'solar_pumps', name: 'Solar Piezometers & Water Pumping', category: 'energy', nodeType: 'ecological_transducer', capacityDescription: 'Zero-carbon smart aquifer lift & pressure staging' },
        { id: 'humus_mycorrhizae', name: 'Soil Humus & Mycorrhizal Matrix', category: 'nutrients', nodeType: 'ecological_transducer', capacityDescription: 'Living soil organic matter (3.8% SOM active layer)' },
        { id: 'biochar_compost', name: 'Biochar Inoculation Beds', category: 'nutrients', nodeType: 'ecological_transducer', capacityDescription: 'Pyrolyzed invasive bush converted to recalcitrant carbon' },
        { id: 'mara_swamps', name: 'Mara Estuary & Serengeti Wetland', category: 'water', nodeType: 'community_sink', capacityDescription: 'Biodiversity sanctuary & downstream transboundary buffer' },
        { id: 'pastoral_troughs', name: 'Pastoralist Water Commons Troughs', category: 'water', nodeType: 'community_sink', capacityDescription: 'Community-governed hydration points for 80k livestock' },
        { id: 'cold_storage_schools', name: 'Community Cold Hubs & Clinics', category: 'energy', nodeType: 'community_sink', capacityDescription: 'Microgrid power for milk preservation and health centers' },
        { id: 'deep_subsoil_carbon', name: 'Deep Subsoil Lithic Carbon Sink', category: 'nutrients', nodeType: 'storage_buffer', capacityDescription: 'Permanent geologic & soil carbon storage (345k tCO2e/yr)' },
        { id: 'perennial_forage', name: 'Perennial Pasture Forage Bank', category: 'nutrients', nodeType: 'storage_buffer', capacityDescription: 'Drought-resilient deep-rooted C4 grasses bank' }
      ],
      links: [
        { source: 'mau_rainfall', target: 'cloud_canopy', value: 42, category: 'water', flowRateDisplay: '24.2 m³/s', circularityPct: 96.5, flowVelocity: 'steady', description: 'Orographically enhanced high-altitude cloud condensation', cryptographicProof: '0x4f128e99bcde710294821a8374829103', lastBlock: 184901 },
        { source: 'cloud_canopy', target: 'mara_mainstem', value: 28, category: 'water', flowRateDisplay: '18.6 m³/s', circularityPct: 97.8, flowVelocity: 'steady', description: 'Baseflow regulated discharge into headwater river channels', cryptographicProof: '0x1234567890abcdef1234567890abcdef', lastBlock: 184904 },
        { source: 'cloud_canopy', target: 'pastoral_troughs', value: 8, category: 'water', flowRateDisplay: '3.8 m³/s', circularityPct: 93.4, flowVelocity: 'steady', description: 'Gravity-fed spring conduits to highland community access taps', cryptographicProof: '0xabcdef1234567890abcdef1234567890', lastBlock: 184907 },
        { source: 'mara_mainstem', target: 'mara_swamps', value: 22, category: 'water', flowRateDisplay: '14.8 m³/s', circularityPct: 95.2, flowVelocity: 'steady', description: 'River flood pulse recharging terminal papyrus marsh wetlands', cryptographicProof: '0xfeedfacecafebeef0192837465543210', lastBlock: 184912 },
        { source: 'mara_mainstem', target: 'pastoral_troughs', value: 6, category: 'water', flowRateDisplay: '3.8 m³/s', circularityPct: 94.0, flowVelocity: 'seasonal', description: 'Alluvial riverbed sand dam seasonal livestock water draw', cryptographicProof: '0x77182930485716253448596019283746', lastBlock: 184918 },
        { source: 'solar_irradiance', target: 'solar_pumps', value: 18, category: 'energy', flowRateDisplay: '1.4 MW peak', circularityPct: 97.2, flowVelocity: 'steady', description: 'Photovoltaic generation driving borehole variable-frequency pumps', cryptographicProof: '0x992384a102938475bcde182736450192', lastBlock: 184922 },
        { source: 'solar_pumps', target: 'pastoral_troughs', value: 10, category: 'energy', flowRateDisplay: '0.8 MW', circularityPct: 96.0, flowVelocity: 'steady', description: 'Hydraulic head work pumping water into elevated pastoral storage', cryptographicProof: '0x182736450192938475bcde4f128e99bc', lastBlock: 184925 },
        { source: 'solar_pumps', target: 'cold_storage_schools', value: 8, category: 'energy', flowRateDisplay: '0.6 MW', circularityPct: 98.4, flowVelocity: 'steady', description: 'Surplus battery routing into community dairy chilling and microgrids', cryptographicProof: '0x3344556677889900aabbccddeeff0011', lastBlock: 184929 },
        { source: 'grazing_dung', target: 'humus_mycorrhizae', value: 24, category: 'nutrients', flowRateDisplay: '3.8 t/ha SOM', circularityPct: 98.8, flowVelocity: 'closed_loop', description: 'Dung beetle incorporation and rapid aerobic soil humus enrichment', cryptographicProof: '0x99887766554433221100ffeeddccbbaa', lastBlock: 184933 },
        { source: 'acacia_litter', target: 'humus_mycorrhizae', value: 14, category: 'nutrients', flowRateDisplay: '2.1 t/ha litter', circularityPct: 97.0, flowVelocity: 'seasonal', description: 'Leguminous nitrogen leaf fall fueling fungal hyphal network', cryptographicProof: '0x445566778899aabbccddeeff00112233', lastBlock: 184937 },
        { source: 'acacia_litter', target: 'biochar_compost', value: 12, category: 'nutrients', flowRateDisplay: '8.0 t/ha biochar', circularityPct: 98.6, flowVelocity: 'closed_loop', description: 'Encroaching scrub biomass pyrolyzed into biochar amendment', cryptographicProof: '0x10293847561029384756102938475610', lastBlock: 184941 },
        { source: 'biochar_compost', target: 'deep_subsoil_carbon', value: 16, category: 'nutrients', flowRateDisplay: '345k tCO2e/yr', circularityPct: 99.4, flowVelocity: 'closed_loop', description: 'Millennial-scale stable aromatic carbon sequestered in subsoil horizons', cryptographicProof: '0x99112233445566778899aabbccddeeff', lastBlock: 184944 },
        { source: 'humus_mycorrhizae', target: 'perennial_forage', value: 20, category: 'nutrients', flowRateDisplay: '4.2 t/ha forage', circularityPct: 97.5, flowVelocity: 'steady', description: 'Mycorrhizal phosphorus-nitrogen transfer to drought-hardy perennial grasses', cryptographicProof: '0x71829384756192837465019283746519', lastBlock: 184948 },
        { source: 'humus_mycorrhizae', target: 'deep_subsoil_carbon', value: 12, category: 'nutrients', flowRateDisplay: '120k tCO2e/yr', circularityPct: 99.1, flowVelocity: 'closed_loop', description: 'Deep root exudates and microbial necromass lithic stabilization', cryptographicProof: '0x887766554433221100ffeeddccbbaa99', lastBlock: 184952 }
      ]
    }
  },
  'aberdare-water-tower': {
    regionId: 'aberdare-water-tower',
    regionName: 'Aberdare Cloud Forest & Highland Water Tower',
    biomeType: 'Montane Moist Forests & Alpine Afro-Alpine Moorlands',
    country: 'Kenya',
    totalAreaHectares: 766000,
    activeStewardAssembliesCount: 24,
    compositeFlourishingScore: 94.8,
    carbonSequestrationRateAnnualTonnes: 520000,
    waterYieldAnnualM3: 980000000,
    metrics: [
      {
        id: 'aberdare-metric-cloud-fog',
        name: 'Cloud Condensation & Fog Interception Rate',
        category: 'water',
        currentValue: 34.2,
        unit: 'mm/week fog drip',
        baselineValue: 14.5,
        targetValue: 38.0,
        deltaPct: 135.8,
        status: 'optimal',
        confidenceScore: 99.4,
        provenance: {
          id: 'PROV-ABER-FOG-01',
          source: 'Aberdare High-Altitude Harp Fog Collector Network',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          calculationMethod: 'Tipping-bucket Calibrated Mesh Harvester Telemetry',
          certaintyScore: 99.4,
          verifier: 'Water Resources Authority (WRA) & Aberdare Trust',
          verifierRole: 'Chief Hydrometric Inspector',
          cryptographicHash: '0x3344556677889900aabbccddeeff0011',
          assumptions: ['Wind vector velocity normalization applied'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [18.5, 22.0, 26.4, 29.8, 32.1, 34.2],
        sensorMeshNodesCount: 36,
        lastUpdatedMinutesAgo: 18
      },
      {
        id: 'aberdare-metric-canopy-strata',
        name: 'Multi-Strata Indigenous Canopy Health',
        category: 'canopy',
        currentValue: 88.6,
        unit: '% canopy density',
        baselineValue: 64.0,
        targetValue: 92.0,
        deltaPct: 38.4,
        status: 'optimal',
        confidenceScore: 98.9,
        provenance: {
          id: 'PROV-ABER-CAN-02',
          source: 'Airborne Multispectral Drone Lidar Transect',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          calculationMethod: '3D Point-Cloud Structural Leaf Area Index (LAI)',
          certaintyScore: 98.9,
          verifier: 'Kenya Forest Service (KFS) & Green Belt Movement',
          verifierRole: 'Silvicultural Auditor',
          cryptographicHash: '0x99887766554433221100ffeeddccbbaa',
          assumptions: ['Tree crown structural volume segmented using Voronoi tessellation'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [72.0, 75.4, 79.1, 83.0, 86.2, 88.6],
        sensorMeshNodesCount: 64,
        lastUpdatedMinutesAgo: 90
      },
      {
        id: 'aberdare-metric-soil-mycelium',
        name: 'Mycorrhizal Fungal Biomass & Hyphal Density',
        category: 'soil',
        currentValue: 480,
        unit: 'meters hyphae / g soil',
        baselineValue: 180,
        targetValue: 500,
        deltaPct: 166.7,
        status: 'optimal',
        confidenceScore: 97.6,
        provenance: {
          id: 'PROV-ABER-MYC-03',
          source: 'Soil Microbiome Epifluorescence Microscopy Batch #44',
          sourceType: 'field_audit',
          collectedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          calculationMethod: 'Calcofluor White Staining & Automated Image Analysis',
          certaintyScore: 97.6,
          verifier: 'International Centre of Insect Physiology and Ecology (ICIPE)',
          verifierRole: 'Soil Microbiologist',
          cryptographicHash: '0x445566778899aabbccddeeff00112233',
          assumptions: ['Arbuscular mycorrhizal and ectomycorrhizal hyphae differentiated'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [240, 290, 340, 390, 440, 480],
        sensorMeshNodesCount: 28,
        lastUpdatedMinutesAgo: 180
      }
    ],
    resourceFlows: [
      {
        id: 'aberdare-flow-water-pipeline',
        title: 'Highland Condensation -> Sasumua Reservoir -> Downstream Municipal Aquifers',
        category: 'water',
        sourceNode: 'Aberdare Cloud Forest Water Tower',
        targetNode: 'Sasumua / Ndakaini Reservoirs & Athi Basin',
        flowRate: 31.4,
        flowUnit: 'm³/s baseflow',
        circularityPct: 97.8,
        flowVelocity: 'steady',
        status: 'balanced',
        description: 'Life-critical water security pipeline quenching over 4.5 million downstream urban and peri-urban inhabitants.',
        provenance: {
          id: 'PROV-FLOW-ABER-01',
          source: 'Nairobi Water Basin Telemetry Interface',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'Cryptographic Ultrasonic Mass-Flow Ledger',
          certaintyScore: 99.8,
          verifier: 'Nairobi City Water & Sewerage Company (NCWSC)',
          verifierRole: 'Municipal Epistemic Auditor',
          cryptographicHash: '0x10293847561029384756102938475610',
          assumptions: ['Zero unmetered leakage in main gravity conduits'],
          lastAudited: new Date().toISOString()
        },
        lastProofBlock: 184940
      },
      {
        id: 'aberdare-flow-carbon-mycelial',
        title: 'Bamboo & Podocarpus Forest -> Peat Moorland Carbon Sink',
        category: 'carbon',
        sourceNode: 'Old-Growth Montane Podocarpus Canopy',
        targetNode: 'Deep High-Altitude Peat Bogs',
        flowRate: 5.8,
        flowUnit: 'tCO2e/ha/year',
        circularityPct: 99.1,
        flowVelocity: 'closed_loop',
        status: 'surplus',
        description: 'Perennial alpine moorland peat formation permanently fixing carbon in oxygen-poor acidic waterlogged soils.',
        provenance: {
          id: 'PROV-FLOW-ABER-02',
          source: 'High-Altitude Peat Core Cryo-Sampler #12',
          sourceType: 'field_audit',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'Radiocarbon C14 Age Stratigraphy & Gas Chromatograph',
          certaintyScore: 98.4,
          verifier: 'African Peatland Scientific Consortium',
          verifierRole: 'Paleoclimatologist & Merkle Signer',
          cryptographicHash: '0x99112233445566778899aabbccddeeff',
          assumptions: ['Moorland water table maintained above 5cm from surface year-round'],
          lastAudited: new Date().toISOString()
        },
        lastProofBlock: 184948
      }
    ],
    sankeyNetwork: {
      nodes: [
        { id: 'aber_fog', name: 'Afro-Alpine Harp Fog & Mist', category: 'water', nodeType: 'natural_source', capacityDescription: 'High-altitude cold cloud drip (34.2 mm/week)' },
        { id: 'aber_hydro', name: 'Tana & Athi Gravity Hydro Conduits', category: 'energy', nodeType: 'natural_source', capacityDescription: 'High-head run-of-the-river clean hydro potential' },
        { id: 'podocarpus_litter', name: 'Montane Podocarpus & Bamboo Litter', category: 'nutrients', nodeType: 'natural_source', capacityDescription: 'Multi-strata dense canopy organic fall' },
        { id: 'bamboo_sponges', name: 'Bamboo Rhizome Hydro-Sponge', category: 'water', nodeType: 'ecological_transducer', capacityDescription: 'Erosion-free volcanic soil water absorption' },
        { id: 'reservoirs', name: 'Sasumua & Ndakaini Storage Reservoirs', category: 'water', nodeType: 'storage_buffer', capacityDescription: 'Strategic multi-billion liter water security reservoirs' },
        { id: 'mini_hydro_stations', name: 'Highland Run-of-River Micro-Hydro', category: 'energy', nodeType: 'ecological_transducer', capacityDescription: 'Steep grade hydro-turbines supplying agro-coops' },
        { id: 'peat_bogs', name: 'High-Altitude Moorland Peat Bogs', category: 'nutrients', nodeType: 'storage_buffer', capacityDescription: 'Centuries-old acidic carbon and nutrient preservation' },
        { id: 'nairobi_aquifers', name: 'Downstream Athi Basin Municipal Supply', category: 'water', nodeType: 'community_sink', capacityDescription: 'Clean gravity water delivered to 4.5M urban inhabitants' },
        { id: 'tea_agroforestry', name: 'Highland Smallholder Tea Agroforestry', category: 'nutrients', nodeType: 'community_sink', capacityDescription: 'Soil humic layers buffering mountain slopes' }
      ],
      links: [
        { source: 'aber_fog', target: 'bamboo_sponges', value: 36, category: 'water', flowRateDisplay: '34.2 mm/wk', circularityPct: 98.4, flowVelocity: 'steady', description: 'Fog harp condensate funneled into bamboo root zones', cryptographicProof: '0x3344556677889900aabbccddeeff0011', lastBlock: 184930 },
        { source: 'bamboo_sponges', target: 'reservoirs', value: 30, category: 'water', flowRateDisplay: '31.4 m³/s', circularityPct: 97.8, flowVelocity: 'steady', description: 'Continuous cold crystal baseflow filling reservoirs', cryptographicProof: '0x10293847561029384756102938475610', lastBlock: 184935 },
        { source: 'reservoirs', target: 'nairobi_aquifers', value: 26, category: 'water', flowRateDisplay: '28.0 m³/s', circularityPct: 99.0, flowVelocity: 'steady', description: 'Pure gravity pipeline delivering potable water without pumping', cryptographicProof: '0x445566778899aabbccddeeff00112233', lastBlock: 184939 },
        { source: 'aber_hydro', target: 'mini_hydro_stations', value: 22, category: 'energy', flowRateDisplay: '4.8 MW', circularityPct: 98.2, flowVelocity: 'steady', description: 'Steep gradient kinetic head captured across micro-turbines', cryptographicProof: '0xfeedfacecafebeef0192837465543210', lastBlock: 184942 },
        { source: 'mini_hydro_stations', target: 'tea_agroforestry', value: 16, category: 'energy', flowRateDisplay: '3.2 MW', circularityPct: 97.5, flowVelocity: 'steady', description: 'Zero-emission electrification for cooperative tea processing factories', cryptographicProof: '0x992384a102938475bcde182736450192', lastBlock: 184945 },
        { source: 'podocarpus_litter', target: 'peat_bogs', value: 24, category: 'nutrients', flowRateDisplay: '5.8 tCO2e/ha', circularityPct: 99.2, flowVelocity: 'closed_loop', description: 'Lignin and cellulose fixed permanently in waterlogged peat layers', cryptographicProof: '0x99112233445566778899aabbccddeeff', lastBlock: 184949 },
        { source: 'podocarpus_litter', target: 'tea_agroforestry', value: 14, category: 'nutrients', flowRateDisplay: '480 m hyphae/g', circularityPct: 96.8, flowVelocity: 'steady', description: 'Mycorrhizal hyphae expanding nutrient buffer across adjacent terraces', cryptographicProof: '0x887766554433221100ffeeddccbbaa99', lastBlock: 184953 }
      ]
    }
  },
  'rift-valley-lakes': {
    regionId: 'rift-valley-lakes',
    regionName: 'Great Rift Valley Volcanic Aquifer & Rift Lakes',
    biomeType: 'Endorheic Alkaline Lake Basins & Acacia Bushlands',
    country: 'Kenya',
    totalAreaHectares: 1400000,
    activeStewardAssembliesCount: 15,
    compositeFlourishingScore: 88.2,
    carbonSequestrationRateAnnualTonnes: 210000,
    waterYieldAnnualM3: 320000000,
    metrics: [
      {
        id: 'rift-metric-lake-level',
        name: 'Lake Naivasha Water Level & Riparian Papyrus Buffer',
        category: 'water',
        currentValue: 1889.4,
        unit: 'm AMSL elevation',
        baselineValue: 1887.2,
        targetValue: 1890.0,
        deltaPct: 100.0,
        status: 'recovering',
        confidenceScore: 98.7,
        provenance: {
          id: 'PROV-RIFT-WATER-01',
          source: 'Satellite Radar Altimetry & Piezometer Wellhead #8',
          sourceType: 'satellite_telemetry',
          collectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          calculationMethod: 'Sentinel-3 Synthetic Aperture Radar Altimeter',
          certaintyScore: 98.7,
          verifier: 'Lake Naivasha Riparian Association (LNRA)',
          verifierRole: 'Riparian Environmental Auditor',
          cryptographicHash: '0x71829384756192837465019283746519',
          assumptions: ['Geoid EGM2008 correction applied'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [1887.5, 1888.1, 1888.6, 1889.0, 1889.2, 1889.4],
        sensorMeshNodesCount: 18,
        lastUpdatedMinutesAgo: 30
      },
      {
        id: 'rift-metric-soil-biochar',
        name: 'Volcanic Soil Biochar & Organic Carbon Sequestration',
        category: 'soil',
        currentValue: 3.4,
        unit: '% SOC',
        baselineValue: 1.6,
        targetValue: 4.0,
        deltaPct: 112.5,
        status: 'optimal',
        confidenceScore: 98.2,
        provenance: {
          id: 'PROV-RIFT-SOIL-02',
          source: 'Regenerative Horticulture Soil Sensor Grid #14',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          calculationMethod: 'Continuous In-situ Capacitive Soil Moisture & Electrochemical C-Probe',
          certaintyScore: 98.2,
          verifier: 'Kenyatta University Agroecology Field Lab',
          verifierRole: 'Lead Regenerative Agronomist',
          cryptographicHash: '0x887766554433221100ffeeddccbbaa99',
          assumptions: ['Biochar applied at 10 tonnes/ha with microbial compost tea inoculation'],
          lastAudited: new Date().toISOString()
        },
        historicalTrend: [1.8, 2.1, 2.5, 2.9, 3.2, 3.4],
        sensorMeshNodesCount: 32,
        lastUpdatedMinutesAgo: 60
      }
    ],
    resourceFlows: [
      {
        id: 'rift-flow-horticulture-water',
        title: 'Geothermal Condensate -> Closed-Loop Aquaponics -> Deep Aquifer Return',
        category: 'water',
        sourceNode: 'Olkaria Geothermal Condenser Units',
        targetNode: 'Closed-Loop Food Forests & Aquifer Recharge',
        flowRate: 8.2,
        flowUnit: 'm³/s recycled',
        circularityPct: 98.6,
        flowVelocity: 'closed_loop',
        status: 'balanced',
        description: 'Zero-waste geothermal steam condensing system feeding high-efficiency drip irrigation before biofiltering back to groundwater.',
        provenance: {
          id: 'PROV-FLOW-RIFT-01',
          source: 'Olkaria Eco-Industrial Park Smart Flow Network',
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'Closed-Loop Hydraulic Mass Balance Audit',
          certaintyScore: 99.4,
          verifier: 'Kenya Electricity Generating Company (KenGen) & LNRA',
          verifierRole: 'Industrial Ecology Auditor',
          cryptographicHash: '0xaa11bb22cc33dd44ee55ff6600778899',
          assumptions: ['Mineral salts concentrated and diverted to fertilizer synthesis'],
          lastAudited: new Date().toISOString()
        },
        lastProofBlock: 184955
      }
    ],
    sankeyNetwork: {
      nodes: [
        { id: 'geothermal_steam', name: 'Olkaria Deep Geothermal Steam', category: 'energy', nodeType: 'natural_source', capacityDescription: 'Volcanic subterranean enthalpy & superheated steam' },
        { id: 'rift_runoff', name: 'Malewa & Gilgil River Basins', category: 'water', nodeType: 'natural_source', capacityDescription: 'Inflowing surface water from Nyandarua highlands' },
        { id: 'papyrus_biomass', name: 'Riparian Papyrus Fringes & Roots', category: 'nutrients', nodeType: 'natural_source', capacityDescription: 'Massive organic sediment trapping matrix' },
        { id: 'condenser_loop', name: 'Closed-Loop Steam Condensers', category: 'water', nodeType: 'ecological_transducer', capacityDescription: 'Distilled pure water reclaimed from power turbine exhaust' },
        { id: 'naivasha_papyrus', name: 'Lake Naivasha Wetland Lagoon', category: 'water', nodeType: 'storage_buffer', capacityDescription: 'Natural sedimentation, phytoremediation and aquatic bird commons' },
        { id: 'geothermal_power', name: 'Olkaria Clean Baseload Electricity', category: 'energy', nodeType: 'ecological_transducer', capacityDescription: 'Continuous 800+ MW geothermal power generation' },
        { id: 'volcanic_biochar', name: 'Volcanic Tephra & Biochar Compost', category: 'nutrients', nodeType: 'ecological_transducer', capacityDescription: 'Paramagnetic volcanic soil blended with composted horticulture waste' },
        { id: 'aquaponics_farms', name: 'Circular Agro-Forestry & Aquaponics', category: 'nutrients', nodeType: 'community_sink', capacityDescription: 'Zero-runoff community food sovereignty greenhouses' },
        { id: 'reinjection_wells', name: 'Deep Aquifer Hydraulic Re-Injection', category: 'water', nodeType: 'storage_buffer', capacityDescription: 'Recharging deep volcanic hydrothermal aquifers' }
      ],
      links: [
        { source: 'geothermal_steam', target: 'geothermal_power', value: 34, category: 'energy', flowRateDisplay: '680 MW', circularityPct: 98.8, flowVelocity: 'steady', description: 'Turbine generators transforming steam pressure to electricity', cryptographicProof: '0xaa11bb22cc33dd44ee55ff6600778899', lastBlock: 184950 },
        { source: 'geothermal_steam', target: 'condenser_loop', value: 24, category: 'water', flowRateDisplay: '8.2 m³/s', circularityPct: 98.6, flowVelocity: 'closed_loop', description: 'Steam condensation capturing potable mineral-free fresh water', cryptographicProof: '0x71829384756192837465019283746519', lastBlock: 184952 },
        { source: 'rift_runoff', target: 'naivasha_papyrus', value: 28, category: 'water', flowRateDisplay: '1889.4 m AMSL', circularityPct: 96.2, flowVelocity: 'steady', description: 'River flood inflow bio-filtered by shoreline papyrus wetlands', cryptographicProof: '0x10293847561029384756102938475610', lastBlock: 184954 },
        { source: 'condenser_loop', target: 'aquaponics_farms', value: 16, category: 'water', flowRateDisplay: '5.4 m³/s', circularityPct: 99.1, flowVelocity: 'closed_loop', description: 'Piped into hydroponic and agro-ecological food cultivation clusters', cryptographicProof: '0x3344556677889900aabbccddeeff0011', lastBlock: 184956 },
        { source: 'condenser_loop', target: 'reinjection_wells', value: 12, category: 'water', flowRateDisplay: '2.8 m³/s', circularityPct: 99.7, flowVelocity: 'closed_loop', description: 'High-pressure injection returning water to deep geothermal strata', cryptographicProof: '0xfeedfacecafebeef0192837465543210', lastBlock: 184958 },
        { source: 'papyrus_biomass', target: 'volcanic_biochar', value: 18, category: 'nutrients', flowRateDisplay: '3.4% SOC', circularityPct: 97.4, flowVelocity: 'closed_loop', description: 'Sedimentary biomass blended with volcanic mineral dust', cryptographicProof: '0x887766554433221100ffeeddccbbaa99', lastBlock: 184960 },
        { source: 'volcanic_biochar', target: 'aquaponics_farms', value: 14, category: 'nutrients', flowRateDisplay: '10 t/ha biochar', circularityPct: 98.3, flowVelocity: 'steady', description: 'High cation exchange volcanic substrate feeding greenhouse beds', cryptographicProof: '0x992384a102938475bcde182736450192', lastBlock: 184962 },
        { source: 'geothermal_power', target: 'aquaponics_farms', value: 12, category: 'energy', flowRateDisplay: '2.4 MW', circularityPct: 99.0, flowVelocity: 'steady', description: 'Clean baseload power for aeration, cooling and water filtration', cryptographicProof: '0x4f128e99bcde710294821a8374829103', lastBlock: 184964 }
      ]
    }
  }
};
