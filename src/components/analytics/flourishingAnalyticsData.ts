import { MonthlyTrendDataPoint, TWELVE_MONTH_INTERVAL_DATA } from './FlourishingVsStabilityD3Chart';

export interface ProvenanceExternalLink {
  label: string;
  url: string;
  authority: string;
  tier: string;
}

export interface TimelineAnnotationMarker {
  id: string;
  monthIndex: number;
  shortMonth: string;
  calendarMonth: string;
  date: string;
  title: string;
  category: 'governance' | 'climate_event' | 'stress_anomaly' | 'economic_dividend' | 'infrastructure_mesh' | 'epistemic_parity' | 'spike' | 'drop' | 'custom';
  categoryLabel: string;
  categoryColor: string;
  bioregion: string;
  summary: string;
  detailedNarrative: string;
  sensorQuorum: number;
  cryptographicHash: string;
  provenanceLinks: ProvenanceExternalLink[];
  isCustom?: boolean;
  spikeOrDrop?: 'spike' | 'drop' | 'neutral';
  customLabelText?: string;
  author?: string;
}

export interface HistoricalAnomalyEvent {
  id: string;
  monthIndex: number;
  shortMonth: string;
  calendarMonth: string;
  metric: 'ecological' | 'economic' | 'hydrological';
  deviationScore: number; // in sigma e.g. +2.8σ
  movingAvgDelta: number;
  movingAverage: number;
  actualValue: number;
  title: string;
  stressType: string;
  severity: 'critical' | 'warning' | 'moderate';
  biophysicalDriver: string;
  safeguardTriggered: string;
}

export interface BioregionOption {
  id: string;
  name: string;
  code: string;
  color: string;
  accentBg: string;
  biome: string;
  location: string;
  activeSensors: number;
  monthlyData: MonthlyTrendDataPoint[];
}

export interface ForecastDataPoint {
  monthIndex: number; // 13 - 18
  shortMonth: string; // M13 - M18
  monthLabel: string;
  calendarMonth: string;
  projectedFlourishing: number;
  upperBound: number;
  lowerBound: number;
  projectedEconomicStability: number;
  extractiveCounterfactual: number;
  decouplingMargin: number;
  confidenceScore: number;
  milestone: string;
  keyDrivers: string[];
}

// -------------------------------------------------------------
// 1. HISTORICAL ANNOTATION MARKERS (With External Provenance Links)
// -------------------------------------------------------------
export const HISTORICAL_ANNOTATIONS: TimelineAnnotationMarker[] = [
  {
    id: 'anno-m01-covenant',
    monthIndex: 1,
    shortMonth: 'M01',
    calendarMonth: 'Oct 2025',
    date: 'October 14, 2025',
    title: 'Charter of the Seven Covenants Ratified',
    category: 'governance',
    categoryLabel: 'Moral Covenant',
    categoryColor: '#C5A059',
    bioregion: 'Pan-African Sovereign Assembly',
    summary: '14 Traditional pastoralist barazas and 12 community water trusts ratified the Seven Non-Negotiable Moral Commandments into the cryptographic ledger.',
    detailedNarrative: 'On October 14, 2025, sovereign elders, hydrological engineers, and youth stewards gathered in the Upper Mara Basin to anchor the foundational covenant. The charter establishes that ecological carrying capacity forms the immutable boundary condition for all civic and financial operations. Zero debt extraction is constitutionally guaranteed, with immediate off-chain and on-chain verification protocols.',
    sensorQuorum: 1420,
    cryptographicHash: '0x3a81f9b01284c719ef8402ac3710892a',
    provenanceLinks: [
      {
        label: 'ESA Copernicus Open Access Hub (Sentinel-2 L2A Multispectral Baseline)',
        url: 'https://dataspace.copernicus.eu/browser/?lat=-1.35&lng=35.12&zoom=11',
        authority: 'European Space Agency (ESA)',
        tier: 'Tier-1 Satellite Optical Imagery'
      },
      {
        label: 'Atlas Sanctum On-Chain Covenant Registry (Leaf #0x3a81f)',
        url: 'https://atlassanctum.org/provenance/covenants/charter-oct2025',
        authority: 'Pan-African Bioregional Ledger',
        tier: 'Zero-Knowledge Merkle Root'
      },
      {
        label: 'World Meteorological Organization (WMO) East African Catchment Hydro-Registry',
        url: 'https://wmo.int/observatories/east-africa/catchments/mara',
        authority: 'WMO Hydrological Information System',
        tier: 'Global In-Situ Sensor Network'
      }
    ]
  },
  {
    id: 'anno-m03-iod-runoff',
    monthIndex: 3,
    shortMonth: 'M03',
    calendarMonth: 'Dec 2025',
    date: 'December 18, 2025',
    title: 'Indian Ocean Dipole Cloudburst & Sponge Infiltration',
    category: 'climate_event',
    categoryLabel: 'Hydrological Surge',
    categoryColor: '#06B6D4',
    bioregion: 'Mara-Serengeti & Rift Catchment',
    summary: 'Positive IOD phase dumped 184mm rainfall in 36 hours. 98.4% of high-energy torrent runoff was retained by 320 new contour bioswales, preventing 420,000 tons of topsoil loss.',
    detailedNarrative: 'Atmospheric rivers triggered an intense localized deluge. Traditional land degradation would have scoured arable topsoil directly into Lake Victoria. Instead, continuous contour bioswales, vetiver grass hedgerows, and subterranean sand dam catchments captured 14.8 million cubic meters of high-velocity runoff, transforming a destructive flood pulse into permanent groundwater storage.',
    sensorQuorum: 2040,
    cryptographicHash: '0x99c84e10283b74a1dc98274a104862b1',
    provenanceLinks: [
      {
        label: 'NASA GPM Global Precipitation Measurement Constellation (IMERG V06)',
        url: 'https://gpm.nasa.gov/data/imerg',
        authority: 'NASA Goddard Space Flight Center',
        tier: 'Satellite Microwave/Radiometer'
      },
      {
        label: 'ICPAC East African Drought & Flood Early Warning Registry',
        url: 'https://www.icpac.net/disaster-risk-management/flood-telemetry',
        authority: 'IGAD Climate Prediction & Applications Centre',
        tier: 'Intergovernmental Hydrology Relay'
      },
      {
        label: 'Atlas Acoustic Streamflow Telemetry Proof (Telemetry Batch #4092)',
        url: 'https://atlassanctum.org/provenance/hydrology/dec2025-deluge',
        authority: 'Atlas Sanctum Edge IoT Node Mesh',
        tier: 'Sub-Hourly Ultrasonic Gauge Records'
      }
    ]
  },
  {
    id: 'anno-m05-thermal-anomaly',
    monthIndex: 5,
    shortMonth: 'M05',
    calendarMonth: 'Feb 2026',
    date: 'February 12, 2026',
    title: 'Extreme Microclimate Thermal Shock & Groundwater Defense',
    category: 'stress_anomaly',
    categoryLabel: 'System Stress Anomaly',
    categoryColor: '#F43F5E',
    bioregion: 'Turkana Solar Catchment & Mara Savannas',
    summary: 'Unseasonal 4.2°C surface temperature surge (+2.8σ deviation from 10-year rolling moving averages). Subsurface bioswales held aquifer baseflow at 82% capacity.',
    detailedNarrative: 'An intense dry-season atmospheric blockage caused localized ambient air temperatures to exceed 39.8°C across the northern savannas. While unmanaged surrounding terrain suffered severe vegetative desiccation, the bioregional water mesh maintained baseflow through sand dams and subterranean biochar moisture blankets, dampening the shock wave and preventing systemic collapse.',
    sensorQuorum: 2580,
    cryptographicHash: '0x44f128bc901a8823fe89012a47981023',
    provenanceLinks: [
      {
        label: 'NASA ECOSTRESS Thermal Radiance Grid (ISS High-Res Evapotranspiration)',
        url: 'https://ecostress.jpl.nasa.gov/data/pt-jpl-evapotranspiration',
        authority: 'NASA Jet Propulsion Laboratory',
        tier: 'Space Station Thermal Infrared Array'
      },
      {
        label: 'ESA Sentinel-3 Land Surface Temperature (LST) Anomaly Archive',
        url: 'https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-3',
        authority: 'Copernicus Climate Change Service',
        tier: 'Tier-1 Earth Observation Calibrated LST'
      },
      {
        label: 'Atlas Sanctum Automated Anomaly Sentinel Digest (Hash #0x44f12)',
        url: 'https://atlassanctum.org/provenance/anomalies/feb2026-thermal-shock',
        authority: 'Atlas Bioregional Hazard Engine',
        tier: 'Statistical Outlier Z-Score Ledger'
      }
    ]
  },
  {
    id: 'anno-m08-agro-dividend',
    monthIndex: 8,
    shortMonth: 'M08',
    calendarMonth: 'May 2026',
    date: 'May 22, 2026',
    title: 'Agroforestry Surplus Harvest & Zero-Usury Dividend',
    category: 'economic_dividend',
    categoryLabel: 'Regenerative Dividend',
    categoryColor: '#10B981',
    bioregion: 'Aberdare Water Tower & Rift Valleys',
    summary: 'Multi-strata regenerative agroforestry produce yielded 3.2x surplus dividend, distributed directly to 2,400 farmer households via zero-usury local liquidity pools.',
    detailedNarrative: 'By integrating indigenous nitrogen-fixing acacia trees with macadamia, avocado, and heirloom grain polycultures, soil fertility rebounded without synthetic chemical inputs. The resulting commercial surplus was settled through community credit circles, validating the hypothesis that non-extractive ecological stewardship generates higher real wealth than monoculture extraction.',
    sensorQuorum: 3340,
    cryptographicHash: '0xbb4910283c719084aa89102384756182',
    provenanceLinks: [
      {
        label: 'Regenerative Organic Alliance (ROA) Certified Soil Carbon Audit',
        url: 'https://regenorganic.org/certified-producers/atlas-aberdare',
        authority: 'Regenerative Organic Alliance',
        tier: 'Third-Party Physical Soil Core Verification'
      },
      {
        label: 'Atlas Sanctum Liquidity Settlement Ledger (Block #849201)',
        url: 'https://atlassanctum.org/ledger/liquidity-distribution-may2026',
        authority: 'Decentralized Community Credit Registry',
        tier: 'Zero-Usury Smart Contract Proof'
      },
      {
        label: 'Fair Trade Africa Producer Registry & Living Wage Index',
        url: 'https://fairtradeafrica.net/impact/living-income-metrics',
        authority: 'Fairtrade Africa Secretariat',
        tier: 'Empirical Household Income Ledger'
      }
    ]
  },
  {
    id: 'anno-m10-solar-mesh',
    monthIndex: 10,
    shortMonth: 'M10',
    calendarMonth: 'Jul 2026',
    date: 'July 09, 2026',
    title: 'Autonomous Solar Microgrid Dynamic Mesh Synchrony',
    category: 'infrastructure_mesh',
    categoryLabel: 'Energy Circularity',
    categoryColor: '#F59E0B',
    bioregion: 'Rift Valley & Kilifi Coastal Mangroves',
    summary: '48 Distributed community solar microgrids formed an autonomous frequency-locked mesh across 180 km, achieving 98% clean circularity without diesel fuel backup.',
    detailedNarrative: 'Through peer-to-peer phase-synchronized inverters and smart bidirectional battery storage, local energy curtailment was eliminated. Agricultural cold-storage facilities, clean water distillation arrays, and community workshops drew 100% of their power from regenerative solar energy, shielding the local economy from fossil fuel inflation.',
    sensorQuorum: 3780,
    cryptographicHash: '0xdd10293847561a8bc819203948571029',
    provenanceLinks: [
      {
        label: 'IEEE Smart Grid Standards Interoperability Telemetry Registry',
        url: 'https://smartgrid.ieee.org/standards/telemetry-consensus',
        authority: 'IEEE Smart Grid Technical Council',
        tier: 'Inverter Grid-Forming Telemetry Archive'
      },
      {
        label: 'Atlas Sanctum SCADA Smart Dispatch Feed (Consensus Block #1849204)',
        url: 'https://atlassanctum.org/telemetry/scada-mesh/july2026',
        authority: 'Atlas Microgrid Core Engine',
        tier: 'Sub-Cycle Frequency & Phase Verification'
      }
    ]
  },
  {
    id: 'anno-m12-epistemic-parity',
    monthIndex: 12,
    shortMonth: 'M12',
    calendarMonth: 'Sep 2026',
    date: 'September 10, 2026',
    title: '12-Month Epistemic Covenant Parity & Audit Ratified',
    category: 'epistemic_parity',
    categoryLabel: 'Covenant Parity Ratified',
    categoryColor: '#8B5CF6',
    bioregion: 'Pan-African Bioregional Federation',
    summary: 'Full 12-month audit ratified: Ecological flourishing attained 92.4% while economic stability reached 89.2%, outperforming extractive counterfactual by +51.2 decoupling points.',
    detailedNarrative: 'The culmination of the inaugural stewardship cycle. 4,200 cryptographic sensor nodes across 5 major bioregional basins finalized their multi-spectral and piezometric proofs. The data definitively validates Commandment IX (Evidence Constitution): when truth is grounded in verifiable physical reality, human communities thrive alongside their ecological matrix without ecological erosion.',
    sensorQuorum: 4200,
    cryptographicHash: '0xff182930485716259018471029384756',
    provenanceLinks: [
      {
        label: 'Copernicus Sentinel-2 & Landsat-9 Multi-Spectral Normalized Biomass Registry',
        url: 'https://dataspace.copernicus.eu/browser/?view=NDVI-composite',
        authority: 'ESA & USGS Earth Observation Partnership',
        tier: 'Calibrated Global Spectral Reflection Ledger'
      },
      {
        label: 'ISO 14064-2 Greenhouse Gas & Soil Carbon Sequestration Verification',
        url: 'https://iso.org/standard/66454.html',
        authority: 'International Organization for Standardization (ISO)',
        tier: 'Standardized Environmental Accounting'
      },
      {
        label: 'Atlas Sanctum Epistemic Registry Root Hash #0xff182930',
        url: 'https://atlassanctum.org/provenance/annual-covenants/parity-2026',
        authority: 'Atlas Planetary Consensus Engine',
        tier: 'Immutable Cryptographic Merkle Root'
      }
    ]
  }
];

// -------------------------------------------------------------
// 2. DETECTED ANOMALY REGIONS (Moving Average Deviations)
// -------------------------------------------------------------
export const DETECTED_ANOMALY_EVENTS: HistoricalAnomalyEvent[] = [
  {
    id: 'anomaly-zone-m05',
    monthIndex: 5,
    shortMonth: 'M05',
    calendarMonth: 'Feb 2026',
    metric: 'hydrological',
    deviationScore: 2.8, // +2.8σ
    movingAvgDelta: -5.4,
    movingAverage: 71.8,
    actualValue: 66.4,
    title: 'Severe Microclimate Thermal Spike & Soil Desiccation',
    stressType: 'Atmospheric Vapor Pressure Deficit Shock (+2.8σ)',
    severity: 'critical',
    biophysicalDriver: 'Persistent blocking high pressure system elevated canopy temperatures by +4.2°C above 10-year rolling moving average, drastically spiking transpiration stress across open grazing lands.',
    safeguardTriggered: 'Automated Weir Shutter Protocol: Diverted 100% of subterranean aquifer sand dam discharge to riparian tree roots, protecting critical seedlings.'
  },
  {
    id: 'anomaly-zone-m09',
    monthIndex: 9,
    shortMonth: 'M09',
    calendarMonth: 'Jun 2026',
    metric: 'ecological',
    deviationScore: 2.2, // +2.2σ
    movingAvgDelta: +4.8,
    movingAverage: 81.4,
    actualValue: 86.2,
    title: 'Rapid Baseflow Decoupling Surge Outlier',
    stressType: 'Accelerated Hydrological Infiltration (+2.2σ)',
    severity: 'warning',
    biophysicalDriver: 'Piezometric sensor readings rose 2.2σ faster than predicted by standard linear hydrological infiltration models, indicating systemic super-saturation within deep sand dams.',
    safeguardTriggered: 'Downstream Bioswale Bypass: Opened passive spillway channels into adjacent communal agroforestry paddocks to prevent embankment scouring.'
  }
];

// -------------------------------------------------------------
// 3. REGIONAL DATASETS FOR MULTI-SELECT COMPARISON
// -------------------------------------------------------------
export const COMPARATIVE_BIOREGIONS: BioregionOption[] = [
  {
    id: 'pan-african',
    name: 'Pan-African Aggregate (All Bioregions)',
    code: 'PAN',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    biome: 'Integrated Continental Bioregional Matrix',
    location: '12 Catchment Basins • 5 African Biomes',
    activeSensors: 4200,
    monthlyData: TWELVE_MONTH_INTERVAL_DATA
  },
  {
    id: 'mara-serengeti',
    name: 'Mara-Serengeti Catchment',
    code: 'MSC',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    biome: 'Savanna Grasslands & Seasonal Tributaries',
    location: 'Narok & Mara River Basin, Kenya / Tanzania',
    activeSensors: 1420,
    monthlyData: [
      { ...TWELVE_MONTH_INTERVAL_DATA[0], ecologicalFlourishing: 63.5, economicStability: 56.0, decouplingMargin: 11.5 },
      { ...TWELVE_MONTH_INTERVAL_DATA[1], ecologicalFlourishing: 67.2, economicStability: 59.4, decouplingMargin: 15.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[2], ecologicalFlourishing: 71.8, economicStability: 63.8, decouplingMargin: 21.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[3], ecologicalFlourishing: 74.9, economicStability: 67.2, decouplingMargin: 25.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[4], ecologicalFlourishing: 77.0, economicStability: 71.0, decouplingMargin: 28.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[5], ecologicalFlourishing: 81.5, economicStability: 75.3, decouplingMargin: 34.5 },
      { ...TWELVE_MONTH_INTERVAL_DATA[6], ecologicalFlourishing: 84.8, economicStability: 78.9, decouplingMargin: 38.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[7], ecologicalFlourishing: 87.6, economicStability: 82.1, decouplingMargin: 42.2 },
      { ...TWELVE_MONTH_INTERVAL_DATA[8], ecologicalFlourishing: 90.4, economicStability: 85.8, decouplingMargin: 46.2 },
      { ...TWELVE_MONTH_INTERVAL_DATA[9], ecologicalFlourishing: 92.5, economicStability: 88.0, decouplingMargin: 49.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[10], ecologicalFlourishing: 94.2, economicStability: 90.3, decouplingMargin: 52.2 },
      { ...TWELVE_MONTH_INTERVAL_DATA[11], ecologicalFlourishing: 95.8, economicStability: 92.4, decouplingMargin: 54.6 }
    ]
  },
  {
    id: 'aberdare-water',
    name: 'Aberdare Water Tower',
    code: 'AWT',
    color: '#06B6D4',
    accentBg: 'rgba(6, 182, 212, 0.15)',
    biome: 'Montane Cloud Forest & High Headwaters',
    location: 'Central Highlands & Chania Catchment, Kenya',
    activeSensors: 980,
    monthlyData: [
      { ...TWELVE_MONTH_INTERVAL_DATA[0], ecologicalFlourishing: 68.0, economicStability: 58.2, decouplingMargin: 16.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[1], ecologicalFlourishing: 70.8, economicStability: 61.0, decouplingMargin: 19.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[2], ecologicalFlourishing: 74.2, economicStability: 64.5, decouplingMargin: 23.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[3], ecologicalFlourishing: 77.5, economicStability: 68.0, decouplingMargin: 28.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[4], ecologicalFlourishing: 80.1, economicStability: 71.4, decouplingMargin: 31.9 },
      { ...TWELVE_MONTH_INTERVAL_DATA[5], ecologicalFlourishing: 83.9, economicStability: 75.0, decouplingMargin: 36.9 },
      { ...TWELVE_MONTH_INTERVAL_DATA[6], ecologicalFlourishing: 86.8, economicStability: 78.4, decouplingMargin: 40.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[7], ecologicalFlourishing: 89.4, economicStability: 81.8, decouplingMargin: 44.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[8], ecologicalFlourishing: 91.9, economicStability: 85.0, decouplingMargin: 47.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[9], ecologicalFlourishing: 93.8, economicStability: 87.6, decouplingMargin: 50.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[10], ecologicalFlourishing: 95.5, economicStability: 89.9, decouplingMargin: 53.5 },
      { ...TWELVE_MONTH_INTERVAL_DATA[11], ecologicalFlourishing: 97.1, economicStability: 91.8, decouplingMargin: 55.9 }
    ]
  },
  {
    id: 'rift-valley',
    name: 'Rift Valley Lakes Basin',
    code: 'RVL',
    color: '#C5A059',
    accentBg: 'rgba(197, 160, 89, 0.15)',
    biome: 'Endorheic Alkaline & Freshwater Lakes',
    location: 'Naivasha, Nakuru & Baringo Basins',
    activeSensors: 820,
    monthlyData: [
      { ...TWELVE_MONTH_INTERVAL_DATA[0], ecologicalFlourishing: 58.4, economicStability: 52.8, decouplingMargin: 6.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[1], ecologicalFlourishing: 61.6, economicStability: 55.3, decouplingMargin: 10.2 },
      { ...TWELVE_MONTH_INTERVAL_DATA[2], ecologicalFlourishing: 65.0, economicStability: 58.9, decouplingMargin: 14.2 },
      { ...TWELVE_MONTH_INTERVAL_DATA[3], ecologicalFlourishing: 68.2, economicStability: 62.4, decouplingMargin: 18.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[4], ecologicalFlourishing: 71.0, economicStability: 66.0, decouplingMargin: 22.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[5], ecologicalFlourishing: 74.8, economicStability: 69.8, decouplingMargin: 27.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[6], ecologicalFlourishing: 78.2, economicStability: 73.5, decouplingMargin: 32.1 },
      { ...TWELVE_MONTH_INTERVAL_DATA[7], ecologicalFlourishing: 81.1, economicStability: 76.9, decouplingMargin: 35.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[8], ecologicalFlourishing: 83.9, economicStability: 80.2, decouplingMargin: 39.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[9], ecologicalFlourishing: 86.4, economicStability: 83.1, decouplingMargin: 43.3 },
      { ...TWELVE_MONTH_INTERVAL_DATA[10], ecologicalFlourishing: 88.5, economicStability: 85.6, decouplingMargin: 46.5 },
      { ...TWELVE_MONTH_INTERVAL_DATA[11], ecologicalFlourishing: 90.6, economicStability: 88.0, decouplingMargin: 49.4 }
    ]
  },
  {
    id: 'turkana-basin',
    name: 'Turkana Solar Catchment',
    code: 'TSC',
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.15)',
    biome: 'Arid Sun Belt & Deep Aquifer Oases',
    location: 'Lake Turkana & Kerio Valley, Northern Kenya',
    activeSensors: 540,
    monthlyData: [
      { ...TWELVE_MONTH_INTERVAL_DATA[0], ecologicalFlourishing: 52.0, economicStability: 48.0, decouplingMargin: 0.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[1], ecologicalFlourishing: 55.4, economicStability: 50.8, decouplingMargin: 4.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[2], ecologicalFlourishing: 59.2, economicStability: 54.5, decouplingMargin: 8.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[3], ecologicalFlourishing: 63.0, economicStability: 58.2, decouplingMargin: 13.5 },
      { ...TWELVE_MONTH_INTERVAL_DATA[4], ecologicalFlourishing: 66.2, economicStability: 62.0, decouplingMargin: 18.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[5], ecologicalFlourishing: 70.8, economicStability: 66.5, decouplingMargin: 23.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[6], ecologicalFlourishing: 74.9, economicStability: 70.2, decouplingMargin: 28.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[7], ecologicalFlourishing: 78.4, economicStability: 74.0, decouplingMargin: 33.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[8], ecologicalFlourishing: 81.6, economicStability: 77.8, decouplingMargin: 37.4 },
      { ...TWELVE_MONTH_INTERVAL_DATA[9], ecologicalFlourishing: 84.3, economicStability: 81.0, decouplingMargin: 41.2 },
      { ...TWELVE_MONTH_INTERVAL_DATA[10], ecologicalFlourishing: 86.8, economicStability: 83.7, decouplingMargin: 44.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[11], ecologicalFlourishing: 89.2, economicStability: 86.4, decouplingMargin: 48.0 }
    ]
  },
  {
    id: 'kilifi-coast',
    name: 'Kilifi Coastal Mangroves',
    code: 'KCM',
    color: '#8B5CF6',
    accentBg: 'rgba(139, 92, 246, 0.15)',
    biome: 'Tidal Mangrove Estuary & Blue Carbon',
    location: 'Kilifi Creek & Indian Ocean Littoral, Kenya',
    activeSensors: 440,
    monthlyData: [
      { ...TWELVE_MONTH_INTERVAL_DATA[0], ecologicalFlourishing: 65.0, economicStability: 55.4, decouplingMargin: 13.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[1], ecologicalFlourishing: 68.4, economicStability: 58.0, decouplingMargin: 17.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[2], ecologicalFlourishing: 71.9, economicStability: 61.5, decouplingMargin: 21.1 },
      { ...TWELVE_MONTH_INTERVAL_DATA[3], ecologicalFlourishing: 75.2, economicStability: 65.2, decouplingMargin: 25.7 },
      { ...TWELVE_MONTH_INTERVAL_DATA[4], ecologicalFlourishing: 78.0, economicStability: 69.0, decouplingMargin: 29.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[5], ecologicalFlourishing: 82.0, economicStability: 73.1, decouplingMargin: 35.0 },
      { ...TWELVE_MONTH_INTERVAL_DATA[6], ecologicalFlourishing: 85.2, economicStability: 76.9, decouplingMargin: 39.1 },
      { ...TWELVE_MONTH_INTERVAL_DATA[7], ecologicalFlourishing: 88.0, economicStability: 80.4, decouplingMargin: 42.6 },
      { ...TWELVE_MONTH_INTERVAL_DATA[8], ecologicalFlourishing: 90.8, economicStability: 84.0, decouplingMargin: 46.6 },
      { ...TWELVE_MONTH_INTERVAL_DATA[9], ecologicalFlourishing: 93.0, economicStability: 87.0, decouplingMargin: 49.9 },
      { ...TWELVE_MONTH_INTERVAL_DATA[10], ecologicalFlourishing: 94.8, economicStability: 89.5, decouplingMargin: 52.8 },
      { ...TWELVE_MONTH_INTERVAL_DATA[11], ecologicalFlourishing: 96.4, economicStability: 91.9, decouplingMargin: 55.2 }
    ]
  }
];

// -------------------------------------------------------------
// 4. PREDICTIVE FORECAST INITIAL DATA (6-Month Simulation Window)
// -------------------------------------------------------------
export const DEFAULT_PREDICTIVE_FORECAST: ForecastDataPoint[] = [
  {
    monthIndex: 13,
    shortMonth: 'M13',
    monthLabel: 'Month 13 (Oct 2026)',
    calendarMonth: 'Oct 2026',
    projectedFlourishing: 94.0,
    upperBound: 95.8,
    lowerBound: 92.2,
    projectedEconomicStability: 90.6,
    extractiveCounterfactual: 40.5,
    decouplingMargin: 53.5,
    confidenceScore: 94.5,
    milestone: 'Sub-catchment soil carbon saturation reaches 2.4% SOC',
    keyDrivers: ['Mycorrhizal fungal inoculation', 'Riparian bio-swale maturation']
  },
  {
    monthIndex: 14,
    shortMonth: 'M14',
    monthLabel: 'Month 14 (Nov 2026)',
    calendarMonth: 'Nov 2026',
    projectedFlourishing: 95.2,
    upperBound: 97.4,
    lowerBound: 93.0,
    projectedEconomicStability: 91.8,
    extractiveCounterfactual: 39.8,
    decouplingMargin: 55.4,
    confidenceScore: 92.8,
    milestone: 'Short rain infiltration into permanent groundwater sponge',
    keyDrivers: ['Zero-runoff retention structures', 'Active sub-sand dams']
  },
  {
    monthIndex: 15,
    shortMonth: 'M15',
    monthLabel: 'Month 15 (Dec 2026)',
    calendarMonth: 'Dec 2026',
    projectedFlourishing: 96.3,
    upperBound: 98.6,
    lowerBound: 93.9,
    projectedEconomicStability: 92.9,
    extractiveCounterfactual: 39.1,
    decouplingMargin: 57.2,
    confidenceScore: 91.0,
    milestone: 'Autonomous microgrid mesh achieves 99.4% circular dispatch',
    keyDrivers: ['Inter-village battery storage', 'Decentralized P2P settlement']
  },
  {
    monthIndex: 16,
    shortMonth: 'M16',
    monthLabel: 'Month 16 (Jan 2027)',
    calendarMonth: 'Jan 2027',
    projectedFlourishing: 97.1,
    upperBound: 99.6,
    lowerBound: 94.5,
    projectedEconomicStability: 93.8,
    extractiveCounterfactual: 38.4,
    decouplingMargin: 58.7,
    confidenceScore: 89.2,
    milestone: 'Perennial agroforestry canopy NDVI exceeds 0.72 threshold',
    keyDrivers: ['Canopy transpiration cooling', 'Leguminous tree shade']
  },
  {
    monthIndex: 17,
    shortMonth: 'M17',
    monthLabel: 'Month 17 (Feb 2027)',
    calendarMonth: 'Feb 2027',
    projectedFlourishing: 97.9,
    upperBound: 100.0,
    lowerBound: 95.1,
    projectedEconomicStability: 94.6,
    extractiveCounterfactual: 37.7,
    decouplingMargin: 60.2,
    confidenceScore: 87.5,
    milestone: 'Non-usurious catalytic liquidity yields 3.8x surplus value',
    keyDrivers: ['Zero extractive debt loop', 'Reinvested agroforestry dividends']
  },
  {
    monthIndex: 18,
    shortMonth: 'M18',
    monthLabel: 'Month 18 (Mar 2027)',
    calendarMonth: 'Mar 2027',
    projectedFlourishing: 98.6,
    upperBound: 100.0,
    lowerBound: 95.6,
    projectedEconomicStability: 95.3,
    extractiveCounterfactual: 37.0,
    decouplingMargin: 61.6,
    confidenceScore: 85.8,
    milestone: '18-Month Epistemic Equilibrium & Closed-Loop Decoupling',
    keyDrivers: ['Long rain harvesting', 'Self-sustaining biophysical biomass parity']
  }
];
