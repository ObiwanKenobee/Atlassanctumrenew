/**
 * ATLAS SANCTUM — Regenerative Potential & What-If Environmental Restoration Scenarios
 * 
 * Local intervention datasets modeling predicted biophysical recovery zones
 * across key global and bioregional hotspots.
 */

export interface RegenerativeInterventionZone {
  id: string;
  name: string;
  bioregionId: string;
  coordinates: [number, number]; // [lat, lng]
  radiusKm: number;
  dominantEcologicalChallenge: string;
  interventionType: 'agroforestry' | 'aquifer_recharge' | 'riparian_buffer' | 'peatland_rewetting' | 'mangrove_restoration' | 'cloud_harvesting';
  interventionLabel: string;
  description: string;
  localDataSource: string;
  calibrationAuditProof: string;
  confidenceScore: number; // 0 - 100
  baselineHazardScore: number; // 0 - 100
  // Model projections at 100% full implementation
  maxHazardReductionPct: number; // e.g. 62%
  maxBiomassGainTonsHa: number; // e.g. 45 t/ha
  maxWaterTableGainMeters: number; // e.g. 3.8m
  communityStewardJobs: number;
  // Year target for stabilization
  targetHorizonYear: number;
}

export const REGENERATIVE_POTENTIAL_ZONES: RegenerativeInterventionZone[] = [
  {
    id: 'regen-mara-riparian',
    name: 'Upper Mara Riparian Vetiver & Agroforestry Swales',
    bioregionId: 'mara-catchment',
    coordinates: [-1.52, 35.15],
    radiusKm: 65,
    dominantEcologicalChallenge: 'Severe Siltation Surge & Riverbank Encroachment',
    interventionType: 'riparian_buffer',
    interventionLabel: 'Riparian Vetiver & Indigenous Swale Terraces',
    description: 'Continuous 120km vegetative bioswale buffers using deep-rooting Vetiver zizanioides, indigenous Acacia tortilis, and deep-soil water traps to arrest upstream agricultural runoff.',
    localDataSource: 'Narok County Lysimeter Array #12 + Sentinel-2 10m Multi-spectral NDRE trend series',
    calibrationAuditProof: '0x8f2a91b4e601...ed48c',
    confidenceScore: 94.2,
    baselineHazardScore: 82,
    maxHazardReductionPct: 64,
    maxBiomassGainTonsHa: 38,
    maxWaterTableGainMeters: 2.9,
    communityStewardJobs: 420,
    targetHorizonYear: 2028
  },
  {
    id: 'regen-kilifi-mangrove',
    name: 'Kilifi Tidal Mangrove & Gravity Desalination Matrix',
    bioregionId: 'kilifi-creek',
    coordinates: [-3.63, 39.85],
    radiusKm: 48,
    dominantEcologicalChallenge: 'Aquifer Salinization & Coastal Mangrove Die-off',
    interventionType: 'mangrove_restoration',
    interventionLabel: 'Rhizophora & Avicennia Tidal Channel Rewetting',
    description: 'Hydrological reconnection of desiccated saltpan creeks with managed tidal gates, combined with indigenous solar-thermal gravity condensation wells for coastal freshwater lens protection.',
    localDataSource: 'Kilifi Field Lab Coastal Salinity Loggers (14 nodes) + Copernicus Marine Service SST',
    calibrationAuditProof: '0x3c1d94f27a08...bb921',
    confidenceScore: 96.8,
    baselineHazardScore: 78,
    maxHazardReductionPct: 72,
    maxBiomassGainTonsHa: 52,
    maxWaterTableGainMeters: 4.1,
    communityStewardJobs: 290,
    targetHorizonYear: 2027
  },
  {
    id: 'regen-mau-water-tower',
    name: 'Mau Forest Water Tower Broadleaf Corridors',
    bioregionId: 'mau-complex',
    coordinates: [-0.42, 35.75],
    radiusKm: 85,
    dominantEcologicalChallenge: 'Canopy Fragmentation & Wildfire Contagion',
    interventionType: 'agroforestry',
    interventionLabel: 'Moist Broadleaf Firebreak & Drone Re-seeding Corridors',
    description: 'Targeted reintroduction of high-moisture indigenous hardwood corridors (Olea capensis, Podocarpus latifolius) creating natural moisture barriers that halt dry-season thermal contagion.',
    localDataSource: 'Mau Forest LoRaWAN Microclimate Grid (38 nodes) + VIIRS 375m thermal anomaly archives',
    calibrationAuditProof: '0x7e810a9f5d34...cc019',
    confidenceScore: 91.5,
    baselineHazardScore: 86,
    maxHazardReductionPct: 58,
    maxBiomassGainTonsHa: 64,
    maxWaterTableGainMeters: 3.5,
    communityStewardJobs: 650,
    targetHorizonYear: 2029
  },
  {
    id: 'regen-turkana-aquifer',
    name: 'Turkana Depression Managed Aquifer Sand Dam Array',
    bioregionId: 'turkana-basin',
    coordinates: [3.12, 35.60],
    radiusKm: 110,
    dominantEcologicalChallenge: 'Catastrophic Groundwater Deficit & Desertification',
    interventionType: 'aquifer_recharge',
    interventionLabel: 'Cascade Sand Storage Dams & Piezometric Recharge Wells',
    description: 'Sub-surface masonry sand dams that store 40% of flash flood volumes in coarse subterranean river sands, blocking evaporative losses and recharging regional deep aquifers.',
    localDataSource: 'GRACE-FO Terrestrial Water Storage Anomaly + 22 Lodwar piezometric boreholes',
    calibrationAuditProof: '0x12d948cf5e02...41a77',
    confidenceScore: 93.0,
    baselineHazardScore: 92,
    maxHazardReductionPct: 68,
    maxBiomassGainTonsHa: 22,
    maxWaterTableGainMeters: 5.2,
    communityStewardJobs: 510,
    targetHorizonYear: 2030
  },
  {
    id: 'regen-congo-peatland',
    name: 'Cuvette Centrale Peatland Rewetting & Water Locks',
    bioregionId: 'congo-basin',
    coordinates: [0.05, 18.25],
    radiusKm: 140,
    dominantEcologicalChallenge: 'Peatland Drainage, Desiccation & Methane Degassing',
    interventionType: 'peatland_rewetting',
    interventionLabel: 'Peat Water Retention Sills & Indigenous Water Locks',
    description: 'Community-constructed semi-permeable wood-and-mud weirs across drainage canals, keeping water tables within 10cm of the surface to prevent subterranean peat oxidation.',
    localDataSource: 'Sentinel-5P TROPOMI Methane Columns + Congo Basin Peat Depth In-situ Cores',
    calibrationAuditProof: '0x99a38f71c42b...55e88',
    confidenceScore: 95.4,
    baselineHazardScore: 88,
    maxHazardReductionPct: 82,
    maxBiomassGainTonsHa: 76,
    maxWaterTableGainMeters: 1.8,
    communityStewardJobs: 380,
    targetHorizonYear: 2028
  },
  {
    id: 'regen-atacama-fog',
    name: 'Alto Patache Atacama Fog Water Harvesting Array',
    bioregionId: 'atacama-coastal',
    coordinates: [-20.82, -70.15],
    radiusKm: 40,
    dominantEcologicalChallenge: 'Zero Precipitation & Severe Aridity',
    interventionType: 'cloud_harvesting',
    interventionLabel: 'Raschel Mesh Camanchaca Cloud Condensers',
    description: 'Large-scale macromeshes capturing dense Pacific stratocumulus cloud fog, yielding 12 liters/m²/day of mineralized fog water to regenerate ancient Tillandsia botanical communities.',
    localDataSource: 'UC Santiago Atacama Desert Research Station + MODIS Cloud Top Pressure',
    calibrationAuditProof: '0x5b70912fa8e1...33d20',
    confidenceScore: 97.2,
    baselineHazardScore: 90,
    maxHazardReductionPct: 60,
    maxBiomassGainTonsHa: 14,
    maxWaterTableGainMeters: 1.2,
    communityStewardJobs: 140,
    targetHorizonYear: 2027
  }
];

export interface WhatIfScenarioState {
  interventionIntensity: number; // 0 to 100%
  activeStrategy: 'holistic' | 'hydrology' | 'soil_carbon' | 'canopy';
  simulatedHorizonYear: number; // 2026 - 2035
}

export const calculateProjectedImprovement = (
  zone: RegenerativeInterventionZone,
  scenario: WhatIfScenarioState
) => {
  const intensityFactor = scenario.interventionIntensity / 100;
  
  // Strategy modifier
  let strategyMultiplier = 1.0;
  if (scenario.activeStrategy === 'hydrology' && (zone.interventionType === 'riparian_buffer' || zone.interventionType === 'aquifer_recharge')) {
    strategyMultiplier = 1.15;
  } else if (scenario.activeStrategy === 'canopy' && (zone.interventionType === 'agroforestry' || zone.interventionType === 'mangrove_restoration')) {
    strategyMultiplier = 1.18;
  } else if (scenario.activeStrategy === 'soil_carbon' && zone.interventionType === 'peatland_rewetting') {
    strategyMultiplier = 1.20;
  }

  const effectiveHazardReduction = Math.min(
    zone.maxHazardReductionPct,
    Math.round(zone.maxHazardReductionPct * intensityFactor * strategyMultiplier)
  );

  const projectedHazardScore = Math.max(
    12,
    Math.round(zone.baselineHazardScore * (1 - (effectiveHazardReduction / 100)))
  );

  const projectedBiomassGain = Math.round(zone.maxBiomassGainTonsHa * intensityFactor * strategyMultiplier * 10) / 10;
  const projectedWaterTableGain = Math.round(zone.maxWaterTableGainMeters * intensityFactor * strategyMultiplier * 10) / 10;

  return {
    effectiveHazardReduction,
    projectedHazardScore,
    projectedBiomassGain,
    projectedWaterTableGain,
    isNetPositive: effectiveHazardReduction >= 30
  };
};
