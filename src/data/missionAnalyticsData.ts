import { MissionDeploymentAnalytics, BiomePerformanceSummary } from '../types';

export const MISSION_ANALYTICS_DATA: MissionDeploymentAnalytics[] = [
  {
    id: 'ma-mathare',
    missionId: 'mission-mathare-river',
    missionTitle: 'Mathare River Regeneration',
    bioregion: 'Upper Athi Catchment, Kenya',
    biomeType: 'urban_riparian',
    status: 'Active',
    successRate: 88.4,
    biophysicalTargetAchievedPct: 34.5,
    epistemicConfidenceScore: 96,
    totalCapitalDeployed: 42500,
    capitalEfficiencyRatio: 34.1, // 34.1 meters per $1k
    failureLedgerCount: 2,
    criticalIncidentsCount: 0,
    mitigatedIncidentsCount: 2,
    resilienceAdaptationsCount: 3,
    recoveryVelocityDays: 14,
    verifiedOutcomesCount: 14,
    primaryFailureMode: 'Sediment siltation overload during sudden flash-floods prior to swale vegetation hardening',
    codifiedLessonSnippet: 'Poly-layer vetiver grass root structures must cure 21 days before active effluent exposure. Mechanical gabions without vegetative interplanting fail at high hydraulic velocities.',
    healthIndex: 92,
    lastAuditDate: '2025-01-28',
    impactDeltas: [
      { kpi: 'Dissolved Oxygen', baseline: 1.8, current: 6.4, target: 7.5, unit: 'mg/L', trend: 'improving' },
      { kpi: 'Turbidity (NTU)', baseline: 142.0, current: 28.5, target: 12.0, unit: 'NTU', trend: 'improving' },
      { kpi: 'E. Coli Colony Count', baseline: 24000, current: 3200, target: 500, unit: 'CFU/100mL', trend: 'improving' },
      { kpi: 'Riparian Embankment Restored', baseline: 0.0, current: 1.45, target: 4.2, unit: 'km', trend: 'improving' },
      { kpi: 'Youth Guild Livelihoods', baseline: 0, current: 48, target: 120, unit: 'jobs', trend: 'improving' }
    ]
  },
  {
    id: 'ma-mara',
    missionId: 'mission-mara-agroforestry',
    missionTitle: 'Mara Riparian Buffer & Pastoralist Agroforestry',
    bioregion: 'Mara Basin, Kenya',
    biomeType: 'savanna_silvopasture',
    status: 'Active',
    successRate: 91.2,
    biophysicalTargetAchievedPct: 51.7,
    epistemicConfidenceScore: 98,
    totalCapitalDeployed: 78000,
    capitalEfficiencyRatio: 7.95, // 7.95 hectares per $1k
    failureLedgerCount: 1,
    criticalIncidentsCount: 0,
    mitigatedIncidentsCount: 1,
    resilienceAdaptationsCount: 2,
    recoveryVelocityDays: 21,
    verifiedOutcomesCount: 19,
    primaryFailureMode: 'Dry season herd grazing pressure breached temporary solar fencing before acacia sapling lignification',
    codifiedLessonSnippet: 'Rotational grazing covenants must be co-stipulated with pastoral elders before biological introduction. Fences alone without customary Olosho consensus fail.',
    healthIndex: 95,
    lastAuditDate: '2025-02-04',
    impactDeltas: [
      { kpi: 'Soil Organic Carbon', baseline: 1.2, current: 2.1, target: 3.4, unit: '% SOC', trend: 'improving' },
      { kpi: 'Perennial Canopy Coverage', baseline: 8.5, current: 24.2, target: 45.0, unit: '%', trend: 'improving' },
      { kpi: 'Water Infiltration Rate', baseline: 12.0, current: 38.4, target: 60.0, unit: 'mm/hr', trend: 'improving' },
      { kpi: 'Silvopasture Protected', baseline: 0, current: 620, target: 1200, unit: 'hectares', trend: 'improving' }
    ]
  },
  {
    id: 'ma-sahel',
    missionId: 'mission-sahel-water-sponge',
    missionTitle: 'Sahelian Earth-Sponge Aquifer Recharge',
    bioregion: 'Niamey Region, Niger',
    biomeType: 'arid_sponge',
    status: 'Active',
    successRate: 84.7,
    biophysicalTargetAchievedPct: 47.5,
    epistemicConfidenceScore: 94,
    totalCapitalDeployed: 95000,
    capitalEfficiencyRatio: 4.0, // 4.0 hectares per $1k
    failureLedgerCount: 3,
    criticalIncidentsCount: 1,
    mitigatedIncidentsCount: 2,
    resilienceAdaptationsCount: 4,
    recoveryVelocityDays: 30,
    verifiedOutcomesCount: 28,
    primaryFailureMode: 'Mono-species acacia planting suffered 64% mortality during unseasonal dry spell (FL-2025-001)',
    codifiedLessonSnippet: 'Transitioned 100% of seed matrix from mono-species fast growth to 7-layer polycultural Zaï pits with compost buffers and perennial grasses.',
    healthIndex: 88,
    lastAuditDate: '2025-02-12',
    impactDeltas: [
      { kpi: 'Shallow Aquifer Well Depth', baseline: 18.5, current: 14.2, target: 9.0, unit: 'meters', trend: 'improving' },
      { kpi: 'Millet Crop Yield', baseline: 320, current: 680, target: 1100, unit: 'kg/ha', trend: 'improving' },
      { kpi: 'NDVI Vegetation Index', baseline: 0.14, current: 0.38, target: 0.55, unit: 'NDVI', trend: 'improving' },
      { kpi: 'Revived Sponge Basins', baseline: 0, current: 380, target: 800, unit: 'hectares', trend: 'improving' }
    ]
  },
  {
    id: 'ma-medellin',
    missionId: 'mission-medellin-canopy',
    missionTitle: 'Medellín Urban Microclimate Bio-Canopy',
    bioregion: 'Aburrá Valley, Colombia',
    biomeType: 'tropical_cloud_basin',
    status: 'Active',
    successRate: 94.6,
    biophysicalTargetAchievedPct: 55.7,
    epistemicConfidenceScore: 99,
    totalCapitalDeployed: 110000,
    capitalEfficiencyRatio: 0.071, // km per $1k
    failureLedgerCount: 1,
    criticalIncidentsCount: 0,
    mitigatedIncidentsCount: 1,
    resilienceAdaptationsCount: 3,
    recoveryVelocityDays: 10,
    verifiedOutcomesCount: 32,
    primaryFailureMode: 'Exotic ornamental climber vines succumbed to urban air particulate smog on steep roadway walls',
    codifiedLessonSnippet: 'Replaced non-native vines with indigenous epiphytic ferns, Guayacán, and Ceiba species capable of bio-filtering PM2.5 particulates.',
    healthIndex: 97,
    lastAuditDate: '2025-02-18',
    impactDeltas: [
      { kpi: 'Peak Surface Temperature', baseline: 46.8, current: 38.2, target: 32.0, unit: '°C', trend: 'improving' },
      { kpi: 'Ambient Air Cooling Delta', baseline: 0.0, current: 1.8, target: 2.5, unit: '°C reduction', trend: 'improving' },
      { kpi: 'Native Pollinator Biodiversity', baseline: 14, current: 52, target: 90, unit: 'species/km²', trend: 'improving' },
      { kpi: 'Shaded Pedestrian Corridor', baseline: 0, current: 7.8, target: 14.0, unit: 'km', trend: 'improving' }
    ]
  },
  {
    id: 'ma-altiplano',
    missionId: 'mission-altiplano-wind-solar',
    missionTitle: 'Andean High-Altitude Resilient Micro-Grid',
    bioregion: 'Altiplano Northern Basin, Peru',
    biomeType: 'highland_alpine',
    status: 'Pivoted',
    successRate: 76.2,
    biophysicalTargetAchievedPct: 62.0,
    epistemicConfidenceScore: 91,
    totalCapitalDeployed: 84000,
    capitalEfficiencyRatio: 1.42, // kWh/day per $1k
    failureLedgerCount: 2,
    criticalIncidentsCount: 1,
    mitigatedIncidentsCount: 1,
    resilienceAdaptationsCount: 3,
    recoveryVelocityDays: 45,
    verifiedOutcomesCount: 16,
    primaryFailureMode: 'Imported proprietary composite micro-wind turbines seized due to freezing rime ice and lack of local spare parts (FL-2025-003)',
    codifiedLessonSnippet: 'Decommissioned proprietary overseas turbines in favor of locally cast recycled aluminum solar-thermal arrays repairable by Quechua community mechanics.',
    healthIndex: 82,
    lastAuditDate: '2025-01-15',
    impactDeltas: [
      { kpi: 'Off-Grid Renewable Uptime', baseline: 38.0, current: 94.5, target: 99.0, unit: '%', trend: 'improving' },
      { kpi: 'Alpaca Fiber Cold Storage Capacity', baseline: 0, current: 4800, target: 6000, unit: 'kg', trend: 'improving' },
      { kpi: 'Local Technician Repair Independence', baseline: 0, current: 100, target: 100, unit: '%', trend: 'improving' }
    ]
  },
  {
    id: 'ma-tana',
    missionId: 'mission-tana-water-floor',
    missionTitle: 'Upper Tana River Priority Floor Water Rights',
    bioregion: 'Upper Tana Basin, Kenya',
    biomeType: 'urban_riparian',
    status: 'Pivoted',
    successRate: 81.0,
    biophysicalTargetAchievedPct: 70.0,
    epistemicConfidenceScore: 97,
    totalCapitalDeployed: 62000,
    capitalEfficiencyRatio: 29.8, // households per $1k
    failureLedgerCount: 2,
    criticalIncidentsCount: 1,
    mitigatedIncidentsCount: 1,
    resilienceAdaptationsCount: 4,
    recoveryVelocityDays: 35,
    verifiedOutcomesCount: 22,
    primaryFailureMode: 'Speculative dynamic token bidding priced out smallholder subsistence farmers during dry spells (FL-2025-002)',
    codifiedLessonSnippet: 'Vital survival water must NEVER be tokenized or priced dynamically. Universal Priority Floor guarantees free baseline water allocations unconditionally.',
    healthIndex: 89,
    lastAuditDate: '2025-02-01',
    impactDeltas: [
      { kpi: 'Household Minimum Water Floor', baseline: 14.0, current: 45.0, target: 50.0, unit: 'L/person/day', trend: 'improving' },
      { kpi: 'Downstream Delta Baseflow', baseline: 6.2, current: 18.4, target: 22.0, unit: 'm³/s', trend: 'improving' },
      { kpi: 'Smallholder Conflict Incidents', baseline: 28, current: 2, target: 0, unit: 'disputes/mo', trend: 'improving' }
    ]
  }
];

export const BIOME_PERFORMANCE_SUMMARIES: BiomePerformanceSummary[] = [
  {
    biomeType: 'urban_riparian',
    label: 'Urban Riparian Corridors',
    totalDeployments: 8,
    avgSuccessRate: 84.7,
    topFailureCategory: 'social_friction',
    resilienceAdaptationRate: 92.5,
    totalHectaresOrKmRestored: '18.4 km riparian corridors',
    capitalEfficiency: '32.0 m / $1,000'
  },
  {
    biomeType: 'savanna_silvopasture',
    label: 'Savanna Silvopasture & Rangelands',
    totalDeployments: 6,
    avgSuccessRate: 91.2,
    topFailureCategory: 'governance_breakdown',
    resilienceAdaptationRate: 88.0,
    totalHectaresOrKmRestored: '4,850 ha silvopasture',
    capitalEfficiency: '7.95 ha / $1,000'
  },
  {
    biomeType: 'arid_sponge',
    label: 'Arid & Semi-Arid Sponge Basins',
    totalDeployments: 12,
    avgSuccessRate: 82.3,
    topFailureCategory: 'biophysical_mismatch',
    resilienceAdaptationRate: 95.0,
    totalHectaresOrKmRestored: '2,640 ha Zaï catchments',
    capitalEfficiency: '4.10 ha / $1,000'
  },
  {
    biomeType: 'tropical_cloud_basin',
    label: 'Tropical Cloud Basins & Slopes',
    totalDeployments: 5,
    avgSuccessRate: 94.6,
    topFailureCategory: 'tech_overpromise',
    resilienceAdaptationRate: 96.0,
    totalHectaresOrKmRestored: '24.2 km bio-canopies',
    capitalEfficiency: '0.071 km / $1,000'
  },
  {
    biomeType: 'highland_alpine',
    label: 'Highland Alpine & Puna',
    totalDeployments: 4,
    avgSuccessRate: 78.5,
    topFailureCategory: 'tech_overpromise',
    resilienceAdaptationRate: 85.0,
    totalHectaresOrKmRestored: '1,100 ha terracing & solar',
    capitalEfficiency: '1.42 kWh/d / $1,000'
  }
];

export const FAILURE_CATEGORY_CORRELATION = [
  { category: 'Biophysical Mismatch', count: 14, resolvedRate: 92.8, avgRecoveryDays: 24, primaryCause: 'Monoculture planting & micro-climate oversight' },
  { category: 'Economic Misalignment', count: 8, resolvedRate: 87.5, avgRecoveryDays: 32, primaryCause: 'Speculative pricing of survival resources (water/land)' },
  { category: 'Tech Overpromise', count: 11, resolvedRate: 81.8, avgRecoveryDays: 41, primaryCause: 'Proprietary sensors & complex foreign hardware' },
  { category: 'Social / Cultural Friction', count: 6, resolvedRate: 90.0, avgRecoveryDays: 18, primaryCause: 'Top-down planning bypassing community elders' },
  { category: 'Governance Breakdown', count: 4, resolvedRate: 75.0, avgRecoveryDays: 38, primaryCause: 'Unclear multi-sig milestone escrow voting quorum' },
  { category: 'Unintended Feedback', count: 5, resolvedRate: 80.0, avgRecoveryDays: 28, primaryCause: 'Predator-prey imbalance or weed species colonization' }
];
