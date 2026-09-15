import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Globe2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  Info, 
  ArrowUpRight, 
  Droplets, 
  TreePine, 
  Zap, 
  Heart, 
  Scale, 
  Eye, 
  CheckCircle2, 
  Database,
  Radio,
  Sliders,
  ChevronRight,
  Maximize2,
  Flame,
  Activity
} from 'lucide-react';
import { DataProvenance } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export type HeatmapMode = 'none' | 'ecological' | 'economic' | 'composite';

export interface BioregionalHeatmapHotspot {
  id: string;
  name: string;
  bioregionName: string;
  coordinates: [number, number]; // [lng, lat]
  category: 'ecological' | 'economic';
  intensity: number; // 0 - 100
  radiusKm: number;
  activityLabel: string;
  summary: string;
  metricValue: string;
  sensorQuorum: number;
}

export const BIOREGIONAL_HEATMAP_HOTSPOTS: BioregionalHeatmapHotspot[] = [
  {
    id: 'hm-mara-riparian',
    name: 'Mara Basin Riparian Sinks',
    bioregionName: 'Mara-Serengeti Savanna',
    coordinates: [35.25, -1.50],
    category: 'ecological',
    intensity: 95,
    radiusKm: 58,
    activityLabel: 'Subterranean River Baseflow & Wildlife Corridor Vitality',
    summary: 'High riparian vegetation saturation and year-round hydrological baseflow sustaining migration megafauna.',
    metricValue: '184.2 m³/s River Baseflow (+34.8%)',
    sensorQuorum: 1420
  },
  {
    id: 'hm-aberdare-canopy',
    name: 'Aberdare Cloud Forest Water Tower',
    bioregionName: 'Aberdare Highlands',
    coordinates: [36.70, -0.45],
    category: 'ecological',
    intensity: 98,
    radiusKm: 52,
    activityLabel: 'Montane Cloud Forest Precipitation Catchment',
    summary: '0.82 NDVI canopy super-saturation intercepting orographic cloud mist to feed Nairobi and Tana rivers.',
    metricValue: '1,420 mm/yr Precipitation Catchment (96.1% Retention)',
    sensorQuorum: 980
  },
  {
    id: 'hm-congo-peat',
    name: 'Cuvette Centrale Peat Carbon Sink',
    bioregionName: 'Congo Peatlands',
    coordinates: [18.26, 0.04],
    category: 'ecological',
    intensity: 99,
    radiusKm: 75,
    activityLabel: 'Massive Subterranean Intact Peatland Hydration',
    summary: 'Continuous satellite piezometer verification of saturated anaerobic water table preventing runaway methane combustion.',
    metricValue: '4.2M tCO2e Subterranean Carbon Reservoir (99.2% Hydrated)',
    sensorQuorum: 640
  },
  {
    id: 'hm-rift-lakes',
    name: 'Great Rift Valley Alkaline Sanctuary',
    bioregionName: 'Rift Valley Lakes',
    coordinates: [36.08, -0.35],
    category: 'ecological',
    intensity: 89,
    radiusKm: 50,
    activityLabel: 'Endorheic Lake Micro-Algae & Avian Bioacoustics',
    summary: 'Acoustic bio-sensor arrays detecting 450+ bird species and recovering Spirulina biomass blooms.',
    metricValue: '82.5 HSI Bioacoustic Vitality Index',
    sensorQuorum: 820
  },
  {
    id: 'hm-kilifi-mangrove',
    name: 'Kilifi Blue Mangrove Estuary',
    bioregionName: 'Kilifi Coast',
    coordinates: [39.85, -3.63],
    category: 'ecological',
    intensity: 92,
    radiusKm: 46,
    activityLabel: 'Tidal Mangrove Blue Carbon & Artisanal Nursery',
    summary: 'Dense Rhizophora mucronata mangrove fringe sequestering carbon 5x faster than terrestrial tropical forests.',
    metricValue: '3,800 t/yr Blue Carbon Sink Rate',
    sensorQuorum: 440
  },
  {
    id: 'hm-sahel-wall',
    name: 'Sahelian Agro-Forestry Regenerative Wall',
    bioregionName: 'Sahel Belt',
    coordinates: [2.10, 13.50],
    category: 'ecological',
    intensity: 91,
    radiusKm: 65,
    activityLabel: 'Farmer-Managed Natural Regeneration (FMNR) Corridor',
    summary: 'Over 2.4M deep-rooted native Faidherbia albida trees fixing atmospheric nitrogen and moisture.',
    metricValue: '+68% Soil Moisture Retention & Agroforestry Yield',
    sensorQuorum: 760
  },
  {
    id: 'hm-mt-kenya-headwaters',
    name: 'Mount Kenya Afro-Alpine Headwaters',
    bioregionName: 'Mount Kenya Catchment',
    coordinates: [37.30, -0.15],
    category: 'ecological',
    intensity: 94,
    radiusKm: 42,
    activityLabel: 'Afro-Alpine Glacial Melt & Moorland Sponges',
    summary: 'High-altitude tussock grass sponge ecosystems filtering glacial meltwater into pristine potable headwaters.',
    metricValue: '99.4 Potable Purity Index',
    sensorQuorum: 510
  },
  {
    id: 'hm-turkana-solar',
    name: 'Turkana Clean Energy & Solar Well Mesh',
    bioregionName: 'Turkana Basin',
    coordinates: [35.60, 3.12],
    category: 'economic',
    intensity: 96,
    radiusKm: 62,
    activityLabel: 'Decentralized Solar Generation & Pastoralist Boreholes',
    summary: '4.8 GWh/yr solar microgrid array powering deep aquifer pumps, off-grid cold chains, and community clinics.',
    metricValue: '4.8 GWh/yr Solar Clean Surplus (12 Solar Wells)',
    sensorQuorum: 540
  },
  {
    id: 'hm-kigali-housing',
    name: 'Kigali LifeHouse Regenerative Housing Hub',
    bioregionName: 'Central Great Lakes',
    coordinates: [30.10, -1.97],
    category: 'economic',
    intensity: 93,
    radiusKm: 45,
    activityLabel: 'Mass-Timber Habitat Fabricators & Urban Sponge Economy',
    summary: '450 modular compressed-earth and mass timber homes capturing rain runoff with zero cement footprint.',
    metricValue: '450 Net-Negative Homes Deployed (94% Sponge Retention)',
    sensorQuorum: 480
  },
  {
    id: 'hm-mara-coop',
    name: 'Maasai Mara Regenerative Commons',
    bioregionName: 'Mara-Serengeti',
    coordinates: [35.45, -1.35],
    category: 'economic',
    intensity: 89,
    radiusKm: 48,
    activityLabel: 'Direct Pastoralist Basic Dividend & Seed Banking',
    summary: 'Decentralized digital ledger distributing carbon conservation dividends directly to pastoral families.',
    metricValue: '$24.50/ha Regenerative Dividend Payout',
    sensorQuorum: 890
  },
  {
    id: 'hm-kilifi-trade',
    name: 'Malindi & Kilifi Blue Commons Exchange',
    bioregionName: 'Kilifi Coast',
    coordinates: [40.12, -3.22],
    category: 'economic',
    intensity: 88,
    radiusKm: 46,
    activityLabel: 'Artisanal Fisheries Management & Solar Desalination',
    summary: 'Community-governed Marine Protected Area trading verifiable blue credits and solar-powered fresh water.',
    metricValue: '1.4B Liters Aquifer Replenishment',
    sensorQuorum: 380
  },
  {
    id: 'hm-tillaberi-baraza',
    name: 'Tillabéri Agroforestry Peace Commons',
    bioregionName: 'Sahel Belt',
    coordinates: [1.45, 14.20],
    category: 'economic',
    intensity: 87,
    radiusKm: 52,
    activityLabel: 'Cross-Border Farmer-Herder Trade Assemblies',
    summary: 'Shared grain reserves, solar drying cooperatives, and drought insurance pools preventing climate displacement.',
    metricValue: '8,400 Families in Cooperative Commons',
    sensorQuorum: 420
  },
  {
    id: 'hm-mukono-modular',
    name: 'Mukono LifeShield Modular Habitat Fabrication',
    bioregionName: 'Lake Victoria Basin',
    coordinates: [32.60, 0.35],
    category: 'economic',
    intensity: 92,
    radiusKm: 40,
    activityLabel: 'Rapid Climate Resilience Shelter Factory',
    summary: '1,800 LifeShield deployable emergency shelters manufactured annually powered by 95% hydro microgrids.',
    metricValue: '1,800 Units/yr Clean Modular Output',
    sensorQuorum: 360
  }
];

export interface RegenerativeImpactPoint {
  id: string;
  name: string;
  bioregionId: string;
  bioregionName: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  category: 'hydrology' | 'canopy' | 'soil_carbon' | 'microgrid' | 'marine' | 'community';
  hectaresRestored: number;
  populationBeneficiaries: number;
  liveMetrics: {
    primaryValue: string;
    primaryLabel: string;
    secondaryValue: string;
    secondaryLabel: string;
    vitalityScore: number; // 0 - 100
    telemetryRate: string;
  };
  flourishingContributions: {
    ecologicalVitality: number; // +%
    waterSecurity: number;      // +%
    soilCarbon: number;         // +%
    communityAutonomy: number;  // +%
  };
  downstreamConnections: Array<{
    targetId: string;
    targetName: string;
    targetCoords: [number, number];
    flowType: 'hydrological_baseflow' | 'pollinator_corridor' | 'microgrid_exchange' | 'indigenous_covenant';
  }>;
  status: 'Field Telemetry Active' | 'Verified Regenerative' | 'Autonomous Co-Stewardship';
  epistemicCertainty: number; // 0 - 100
  merkleHash: string;
  stewardCouncil: string;
}

const REGENERATIVE_IMPACT_POINTS: RegenerativeImpactPoint[] = [
  {
    id: 'pt-mara-basin',
    name: 'Mara Basin Subterranean Sponge & Sensor Mesh',
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Transboundary Basin',
    country: 'Kenya / Tanzania',
    coordinates: [35.25, -1.50],
    category: 'hydrology',
    hectaresRestored: 42500,
    populationBeneficiaries: 165000,
    liveMetrics: {
      primaryValue: '184.2 m³/s',
      primaryLabel: 'Perennial River Baseflow',
      secondaryValue: '+34.8%',
      secondaryLabel: 'Water Security Index',
      vitalityScore: 92.4,
      telemetryRate: '12s in-situ pulse'
    },
    flourishingContributions: {
      ecologicalVitality: 22.4,
      waterSecurity: 34.8,
      soilCarbon: 12.1,
      communityAutonomy: 28.5
    },
    downstreamConnections: [
      { targetId: 'pt-lake-victoria', targetName: 'Lake Victoria Inflow Delta', targetCoords: [34.50, -1.25], flowType: 'hydrological_baseflow' },
      { targetId: 'pt-maasai-conservancy', targetName: 'Maasai Mara Pastoralist Corridor', targetCoords: [35.45, -1.35], flowType: 'indigenous_covenant' }
    ],
    status: 'Field Telemetry Active',
    epistemicCertainty: 99.4,
    merkleHash: '0x8f4d92a11b6c73e04a919283f619b02a',
    stewardCouncil: 'Mara Basin Community Elders Council & UN-Water In-situ Node'
  },
  {
    id: 'pt-aberdare-cloud',
    name: 'Aberdare Cloud Forest Water Tower Mycelial Web',
    bioregionId: 'aberdare-water-tower',
    bioregionName: 'Aberdare Cloud Forest Water Tower',
    country: 'Kenya',
    coordinates: [36.70, -0.45],
    category: 'canopy',
    hectaresRestored: 31200,
    populationBeneficiaries: 2400000,
    liveMetrics: {
      primaryValue: '0.82 NDVI',
      primaryLabel: 'Canopy Density Index',
      secondaryValue: '1,420 mm/yr',
      secondaryLabel: 'Cloud Catchment Precipitation',
      vitalityScore: 96.1,
      telemetryRate: '10s acoustic pulse'
    },
    flourishingContributions: {
      ecologicalVitality: 31.0,
      waterSecurity: 42.1,
      soilCarbon: 26.5,
      communityAutonomy: 19.8
    },
    downstreamConnections: [
      { targetId: 'pt-nairobi-watershed', targetName: 'Sasumua & Ndakaini Reservoir Mesh', targetCoords: [36.75, -0.75], flowType: 'hydrological_baseflow' },
      { targetId: 'pt-tana-river', targetName: 'Tana River Headwaters', targetCoords: [37.10, -0.50], flowType: 'hydrological_baseflow' }
    ],
    status: 'Verified Regenerative',
    epistemicCertainty: 98.8,
    merkleHash: '0x7e2a9b4412c98d4f00129038ba6621ce',
    stewardCouncil: 'Aberdare Community Forest Association & Kenya Forestry Service'
  },
  {
    id: 'pt-rift-valley-lakes',
    name: 'Great Rift Valley Alkaline Lakes Eco-Acoustic Mesh',
    bioregionId: 'rift-valley-lakes',
    bioregionName: 'Great Rift Valley Alkaline Lakes',
    country: 'Kenya',
    coordinates: [36.08, -0.35],
    category: 'marine',
    hectaresRestored: 18900,
    populationBeneficiaries: 340000,
    liveMetrics: {
      primaryValue: '82.5 HSI',
      primaryLabel: 'Habitat Suitability Index',
      secondaryValue: '184 Audio Nodes',
      secondaryLabel: 'Bioacoustic Canopy Listening',
      vitalityScore: 88.7,
      telemetryRate: '5s bioacoustic streaming'
    },
    flourishingContributions: {
      ecologicalVitality: 27.5,
      waterSecurity: 21.0,
      soilCarbon: 14.8,
      communityAutonomy: 31.2
    },
    downstreamConnections: [
      { targetId: 'pt-naivasha-aquifer', targetName: 'Lake Naivasha Horticulture Aquifer', targetCoords: [36.35, -0.72], flowType: 'pollinator_corridor' }
    ],
    status: 'Verified Regenerative',
    epistemicCertainty: 97.2,
    merkleHash: '0x2a8b9c4d5e6f1029384756abcdef0123',
    stewardCouncil: 'Rift Valley Bioacoustic Collective & Flamingo Habitat Stewards'
  },
  {
    id: 'pt-turkana-aquifer',
    name: 'Turkana Deep Pastoralist Aquifer & Solar Microgrid',
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Deep Pastoralist Aquifer Basin',
    country: 'Kenya / Ethiopia',
    coordinates: [35.60, 3.12],
    category: 'microgrid',
    hectaresRestored: 14800,
    populationBeneficiaries: 195000,
    liveMetrics: {
      primaryValue: '4.8 GWh/yr',
      primaryLabel: 'Decentralized Solar Yield',
      secondaryValue: '12 Boreholes',
      secondaryLabel: 'Solar Deep Groundwater Wells',
      vitalityScore: 89.2,
      telemetryRate: '30s smart-meter feed'
    },
    flourishingContributions: {
      ecologicalVitality: 18.2,
      waterSecurity: 46.5,
      soilCarbon: 19.4,
      communityAutonomy: 44.0
    },
    downstreamConnections: [
      { targetId: 'pt-kalokol-community', targetName: 'Kalokol Pastoralist Microgrid Mesh', targetCoords: [35.80, 3.52], flowType: 'microgrid_exchange' }
    ],
    status: 'Autonomous Co-Stewardship',
    epistemicCertainty: 96.5,
    merkleHash: '0x992384716bcde091823746a5b6c7d8e9',
    stewardCouncil: 'Turkana Pastoralist Elders Assembly & Solar Mini-grid Co-op'
  },
  {
    id: 'pt-kigali-urban-watershed',
    name: 'Kigali LifeHouse Eco-Quarter & Sponge Wetland',
    bioregionId: 'kigali-watershed',
    bioregionName: 'Kigali Regenerative Urban Catchment',
    country: 'Rwanda',
    coordinates: [30.10, -1.97],
    category: 'community',
    hectaresRestored: 8200,
    populationBeneficiaries: 480000,
    liveMetrics: {
      primaryValue: '450 Homes',
      primaryLabel: 'Mass Timber Regenerative Dwellings',
      secondaryValue: '94% Runoff Retained',
      secondaryLabel: 'Urban Sponge Infiltration',
      vitalityScore: 94.5,
      telemetryRate: 'Real-time urban telemetry'
    },
    flourishingContributions: {
      ecologicalVitality: 29.8,
      waterSecurity: 38.4,
      soilCarbon: 18.9,
      communityAutonomy: 36.2
    },
    downstreamConnections: [
      { targetId: 'pt-nyabarongo-river', targetName: 'Nyabarongo River Confluence', targetCoords: [30.02, -2.15], flowType: 'hydrological_baseflow' }
    ],
    status: 'Autonomous Co-Stewardship',
    epistemicCertainty: 98.9,
    merkleHash: '0x1472583690abcdef1234567890fedcba',
    stewardCouncil: 'Kigali City Council & Umuganda Regenerative Guild'
  },
  {
    id: 'pt-congo-peatlands',
    name: 'Congo Basin Cuvette Centrale Peatland Sanctuary',
    bioregionId: 'congo-peatlands',
    bioregionName: 'Congo Basin Peatland Sanctuary',
    country: 'DRC / Republic of Congo',
    coordinates: [18.26, 0.04],
    category: 'soil_carbon',
    hectaresRestored: 145000,
    populationBeneficiaries: 85000,
    liveMetrics: {
      primaryValue: '4.2M tCO2e',
      primaryLabel: 'Intact Subsurface Peat Carbon Sink',
      secondaryValue: '99.2%',
      secondaryLabel: 'Peat Hydrological Saturation',
      vitalityScore: 97.8,
      telemetryRate: 'Satellite GRACE + In-situ Piezometer'
    },
    flourishingContributions: {
      ecologicalVitality: 38.4,
      waterSecurity: 29.1,
      soilCarbon: 48.7,
      communityAutonomy: 34.0
    },
    downstreamConnections: [
      { targetId: 'pt-mbandaka-confluence', targetName: 'Mbandaka River Basin', targetCoords: [18.28, 0.08], flowType: 'hydrological_baseflow' }
    ],
    status: 'Verified Regenerative',
    epistemicCertainty: 99.1,
    merkleHash: '0x3344556677889900aabbccddeeff0011',
    stewardCouncil: 'Indigenous Peatland Guardians Council & Global Peatlands Initiative'
  },
  {
    id: 'pt-coastal-mangroves',
    name: 'Kilifi & Lamu Mangrove Biosphere Nursery',
    bioregionId: 'coastal-mangrove',
    bioregionName: 'Coastal Coral & Mangrove Biosphere',
    country: 'Kenya',
    coordinates: [39.85, -3.63],
    category: 'marine',
    hectaresRestored: 12400,
    populationBeneficiaries: 110000,
    liveMetrics: {
      primaryValue: '4.8x Fish Biomass',
      primaryLabel: 'Coastal Artisanal Nursery Recovery',
      secondaryValue: '12.4k Hectares',
      secondaryLabel: 'Continuous Mangrove Buffer Belt',
      vitalityScore: 91.6,
      telemetryRate: 'Tidal logger & satellite radar'
    },
    flourishingContributions: {
      ecologicalVitality: 33.2,
      waterSecurity: 14.5,
      soilCarbon: 32.1,
      communityAutonomy: 39.4
    },
    downstreamConnections: [
      { targetId: 'pt-malindi-coral', targetName: 'Malindi Marine National Reserve', targetCoords: [40.12, -3.22], flowType: 'pollinator_corridor' }
    ],
    status: 'Field Telemetry Active',
    epistemicCertainty: 97.9,
    merkleHash: '0x8899aabbccddeeff0011223344556677',
    stewardCouncil: 'Kilifi Beach Management Unit & Coastal Mangrove Stewards'
  },
  {
    id: 'pt-sahel-green-wall',
    name: 'Sahelian Agro-Silvopastoral Farmer-Managed Regeneration',
    bioregionId: 'sahel-wall',
    bioregionName: 'Sahelian Agro-Silvopastoral Wall',
    country: 'Niger / Burkina Faso',
    coordinates: [2.10, 13.50],
    category: 'canopy',
    hectaresRestored: 88000,
    populationBeneficiaries: 520000,
    liveMetrics: {
      primaryValue: '+68% Crop Yield',
      primaryLabel: 'Faidherbia albida Canopy Nitrogen Fixation',
      secondaryValue: '2.4M Native Trees',
      secondaryLabel: 'Farmer Managed Natural Regeneration',
      vitalityScore: 93.2,
      telemetryRate: 'Soil moisture & UAV thermal orthomosaic'
    },
    flourishingContributions: {
      ecologicalVitality: 29.5,
      waterSecurity: 31.0,
      soilCarbon: 37.2,
      communityAutonomy: 48.5
    },
    downstreamConnections: [
      { targetId: 'pt-tillaberi-corridor', targetName: 'Tillabéri Silvopastoral Corridor', targetCoords: [1.45, 14.20], flowType: 'indigenous_covenant' }
    ],
    status: 'Autonomous Co-Stewardship',
    epistemicCertainty: 98.4,
    merkleHash: '0xaa11bb22cc33dd44ee55ff6600778899',
    stewardCouncil: 'Tillabéri Farmer-Herder Peace and Regeneration Assembly'
  }
];

interface BioregionalImpactD3MapProps {
  onInspectProvenance?: (prov: DataProvenance) => void;
  onSelectBioregion?: (bioregionId: string) => void;
  heatmapMode?: HeatmapMode;
  onHeatmapModeChange?: (mode: HeatmapMode) => void;
}

export const BioregionalImpactD3Map: React.FC<BioregionalImpactD3MapProps> = ({
  onInspectProvenance,
  onSelectBioregion,
  heatmapMode: propHeatmapMode,
  onHeatmapModeChange
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<RegenerativeImpactPoint | null>(REGENERATIVE_IMPACT_POINTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLiveTelemetryStreaming, setIsLiveTelemetryStreaming] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<RegenerativeImpactPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [telemetryPulseTick, setTelemetryPulseTick] = useState<number>(0);
  const [hazardFocusBanner, setHazardFocusBanner] = useState<{ title: string; lat: number; lng: number } | null>(null);

  // Heatmap Overlay State
  const [internalHeatmapMode, setInternalHeatmapMode] = useState<HeatmapMode>(propHeatmapMode || 'ecological');
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.75);
  const [hoveredHotspot, setHoveredHotspot] = useState<BioregionalHeatmapHotspot | null>(null);
  const [hotspotTooltipPos, setHotspotTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const activeHeatmapMode = propHeatmapMode !== undefined ? propHeatmapMode : internalHeatmapMode;

  const handleHeatmapModeSelect = (mode: HeatmapMode) => {
    audioFeedback.playSubtleClick();
    setInternalHeatmapMode(mode);
    if (onHeatmapModeChange) {
      onHeatmapModeChange(mode);
    }
  };

  // Zoom directly to target hazard coordinates [lat, lng]
  const zoomToHazardCoordinates = (lat: number, lng: number, scale = 4.2, title?: string) => {
    if (!svgRef.current || !projectionRef.current || !zoomBehaviorRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 900;
    const height = Math.max(500, Math.min(650, window.innerHeight * 0.65));

    // Projection expects [longitude, latitude]
    const pt = projectionRef.current([lng, lat]);
    if (!pt) return;

    const [px, py] = pt;
    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-px, -py);

    d3.select(svgRef.current)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, transform);

    if (title) {
      setHazardFocusBanner({ title, lat, lng });
      setTimeout(() => setHazardFocusBanner(null), 6000);
    }
  };

  // Listen for focus-hazard-coordinates event
  useEffect(() => {
    const handleFocusEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ coordinates: [number, number]; zoom?: number; title?: string }>;
      if (customEvent.detail?.coordinates) {
        const [lat, lng] = customEvent.detail.coordinates;
        zoomToHazardCoordinates(lat, lng, customEvent.detail.zoom || 4.2, customEvent.detail.title);
      }
    };

    window.addEventListener('focus-hazard-coordinates', handleFocusEvent);
    return () => window.removeEventListener('focus-hazard-coordinates', handleFocusEvent);
  }, []);

  // Live telemetry pulse ticker: updates metrics in real-time
  useEffect(() => {
    if (!isLiveTelemetryStreaming) return;
    const interval = setInterval(() => {
      setTelemetryPulseTick(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveTelemetryStreaming]);

  // Filtered impact points
  const filteredPoints = useMemo(() => {
    if (selectedCategory === 'all') return REGENERATIVE_IMPACT_POINTS;
    return REGENERATIVE_IMPACT_POINTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  // Color mapping helper
  const getCategoryColor = (cat: RegenerativeImpactPoint['category']) => {
    switch (cat) {
      case 'hydrology': return '#06B6D4'; // cyan
      case 'canopy': return '#10B981'; // emerald
      case 'soil_carbon': return '#F59E0B'; // amber
      case 'microgrid': return '#8B5CF6'; // purple
      case 'marine': return '#3B82F6'; // blue
      case 'community': return '#C5A059'; // gold
    }
  };

  // D3 Rendering Lifecycle
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = Math.max(500, Math.min(650, window.innerHeight * 0.65));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('background', '#080B09');

    // Defs: Gradients, glowing filter, drop shadows
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'd3-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Root zoom group
    const g = svg.append('g').attr('class', 'map-root-group');

    // D3 Geographic Projection centered on East / Central / West Africa coordinates
    // Lat range: -4 to +15, Lng range: 0 to 45
    const projection = d3.geoMercator()
      .center([28, 4])
      .scale(width < 640 ? 1100 : 1500)
      .translate([width / 2, height / 2]);

    projectionRef.current = projection;

    // D3 Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // 1. Draw geographic graticule grid lines
    const graticule = d3.geoGraticule().step([5, 5]);
    const pathGenerator = d3.geoPath().projection(projection);

    g.append('path')
      .datum(graticule)
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', '#1B3022')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,4')
      .attr('opacity', 0.6);

    // 2. Continental Reference Basin Landmass Contours (Planar outline abstraction)
    const landmassRegions = [
      // East Africa Equatorial Rift Zone
      [[28, -5], [32, -4], [35, -2], [38, -4], [42, -2], [41, 4], [36, 5], [34, 4], [30, 2], [28, -5]],
      // Central Congo Basin Sanctuary
      [[15, -4], [25, -4], [28, 1], [25, 4], [16, 4], [14, 0], [15, -4]],
      // Sahelian Agro-Forestry Corridor
      [[-2, 11], [15, 11], [18, 15], [0, 16], [-2, 11]]
    ];

    landmassRegions.forEach((polygonCoords) => {
      const lineGenerator = d3.line<[number, number]>()
        .x(d => projection(d)![0])
        .y(d => projection(d)![1])
        .curve(d3.curveCardinalClosed);

      g.append('path')
        .datum(polygonCoords as [number, number][])
        .attr('d', lineGenerator as any)
        .attr('fill', '#0E1712')
        .attr('stroke', '#1B3022')
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.7);
    });

    // 2.5 Bioregional Heatmap Layer (Ecological & Economic Activity Hotspots)
    if (activeHeatmapMode !== 'none') {
      const heatmapGroup = g.append('g').attr('class', 'heatmap-layer');

      // 1. Ecological gradient
      const ecoGrad = defs.append('radialGradient')
        .attr('id', 'heatmap-grad-ecological')
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      ecoGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.85 * heatmapIntensity);
      ecoGrad.append('stop').attr('offset', '35%').attr('stop-color', '#059669').attr('stop-opacity', 0.55 * heatmapIntensity);
      ecoGrad.append('stop').attr('offset', '70%').attr('stop-color', '#06B6D4').attr('stop-opacity', 0.25 * heatmapIntensity);
      ecoGrad.append('stop').attr('offset', '100%').attr('stop-color', '#06B6D4').attr('stop-opacity', 0);

      // 2. Economic gradient
      const econGrad = defs.append('radialGradient')
        .attr('id', 'heatmap-grad-economic')
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      econGrad.append('stop').attr('offset', '0%').attr('stop-color', '#F59E0B').attr('stop-opacity', 0.9 * heatmapIntensity);
      econGrad.append('stop').attr('offset', '35%').attr('stop-color', '#D97706').attr('stop-opacity', 0.6 * heatmapIntensity);
      econGrad.append('stop').attr('offset', '70%').attr('stop-color', '#EA580C').attr('stop-opacity', 0.3 * heatmapIntensity);
      econGrad.append('stop').attr('offset', '100%').attr('stop-color', '#EA580C').attr('stop-opacity', 0);

      const activeHotspots = BIOREGIONAL_HEATMAP_HOTSPOTS.filter(h => {
        if (activeHeatmapMode === 'composite') return true;
        return h.category === activeHeatmapMode;
      });

      activeHotspots.forEach(hotspot => {
        const pt = projection(hotspot.coordinates);
        if (!pt) return;
        const [hx, hy] = pt;
        const radius = Math.max(35, Math.min(95, hotspot.radiusKm * 0.9));

        const hG = heatmapGroup.append('g')
          .attr('class', `hotspot-node-${hotspot.id}`)
          .attr('transform', `translate(${hx}, ${hy})`)
          .style('cursor', 'pointer');

        // Outer ambient thermal dispersal circle
        hG.append('circle')
          .attr('r', radius)
          .attr('fill', `url(#heatmap-grad-${hotspot.category})`)
          .attr('filter', 'url(#d3-glow)')
          .attr('opacity', 0.92);

        // Core thermal intensity dot
        const coreColor = hotspot.category === 'ecological' ? '#34D399' : '#FBBF24';
        const core = hG.append('circle')
          .attr('r', 3.5)
          .attr('fill', coreColor)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1)
          .attr('opacity', 0.95);

        // Subtle core pulsing
        const pulse = () => {
          core.transition()
            .duration(2000 + Math.random() * 800)
            .attr('r', 5.5)
            .attr('opacity', 0.6)
            .transition()
            .duration(2000 + Math.random() * 800)
            .attr('r', 3.5)
            .attr('opacity', 0.95)
            .on('end', pulse);
        };
        pulse();

        // Hotspot Interactivity
        hG.on('mouseenter', (event) => {
          audioFeedback.playMicroTick();
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHotspotTooltipPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top - 15
            });
          }
          setHoveredHotspot(hotspot);
        });

        hG.on('mousemove', (event) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHotspotTooltipPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top - 15
            });
          }
        });

        hG.on('mouseleave', () => {
          setHoveredHotspot(null);
        });
      });
    }

    // 3. Draw Causal Regenerative Flow Arcs & telemetry flow pulses between hubs
    const linksGroup = g.append('g').attr('class', 'links-group');

    filteredPoints.forEach((point) => {
      const [px, py] = projection(point.coordinates) || [0, 0];

      point.downstreamConnections.forEach((conn) => {
        const [tx, ty] = projection(conn.targetCoords) || [0, 0];
        const dx = tx - px;
        const dy = ty - py;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;

        // Quadratic curved path
        const pathData = `M ${px},${py} A ${dr},${dr} 0 0,1 ${tx},${ty}`;

        // Flow arc base line
        linksGroup.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', getCategoryColor(point.category))
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4,6')
          .attr('opacity', 0.45);

        // Animated flow particle travelling along the arc
        const particle = linksGroup.append('circle')
          .attr('r', 2.5)
          .attr('fill', '#FFFFFF')
          .attr('filter', 'url(#d3-glow)')
          .attr('opacity', 0.9);

        // Animate particle along path
        const animateParticle = () => {
          particle
            .transition()
            .duration(3500 + Math.random() * 1500)
            .ease(d3.easeLinear)
            .attrTween('transform', () => {
              return (t) => {
                // Bezier interpolation along arc
                const currX = px + (tx - px) * t;
                const currY = py + (ty - py) * t - Math.sin(t * Math.PI) * (dr * 0.15);
                return `translate(${currX},${currY})`;
              };
            })
            .on('end', animateParticle);
        };
        animateParticle();
      });
    });

    // 4. Draw Impact Data Point Nodes
    const nodesGroup = g.append('g').attr('class', 'nodes-group');

    filteredPoints.forEach((point) => {
      const [nx, ny] = projection(point.coordinates) || [0, 0];
      const color = getCategoryColor(point.category);
      const isSelected = selectedPoint?.id === point.id;

      const nodeG = nodesGroup.append('g')
        .attr('class', `node-${point.id}`)
        .attr('transform', `translate(${nx}, ${ny})`)
        .style('cursor', 'pointer');

      // Outer animated ripple ring
      const ripple = nodeG.append('circle')
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);

      const pulseLoop = () => {
        ripple
          .attr('r', 8)
          .attr('opacity', 0.8)
          .transition()
          .duration(2400)
          .ease(d3.easeCubicOut)
          .attr('r', isSelected ? 32 : 22)
          .attr('opacity', 0)
          .on('end', pulseLoop);
      };
      pulseLoop();

      // Core anchor circle
      nodeG.append('circle')
        .attr('r', isSelected ? 9 : 6.5)
        .attr('fill', color)
        .attr('stroke', '#080B09')
        .attr('stroke-width', 2)
        .attr('filter', 'url(#d3-glow)');

      // Inner white ping
      nodeG.append('circle')
        .attr('r', 2)
        .attr('fill', '#FFFFFF');

      // Label text
      nodeG.append('text')
        .text(point.name.split(' ')[0] + ' ' + (point.name.split(' ')[1] || ''))
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-size', '10px')
        .attr('font-family', 'JetBrains Mono, monospace')
        .attr('font-weight', isSelected ? '700' : '500')
        .attr('fill', isSelected ? '#FFFFFF' : '#C5A059')
        .attr('opacity', 0.9)
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.9)');

      // Interactions: Click & Hover
      nodeG.on('click', (event) => {
        event.stopPropagation();
        audioFeedback.playSubtleClick();
        setSelectedPoint(point);
        if (onSelectBioregion) {
          onSelectBioregion(point.bioregionId);
        }
      });

      nodeG.on('mouseenter', (event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 10
          });
        }
        setHoveredPoint(point);
      });

      nodeG.on('mouseleave', () => {
        setHoveredPoint(null);
      });
    });

  }, [filteredPoints, selectedPoint, onSelectBioregion, activeHeatmapMode, heatmapIntensity]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      audioFeedback.playMicroTick();
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.4);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      audioFeedback.playMicroTick();
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      audioFeedback.playMicroTick();
      d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div 
      id="bioregional-impact-d3-map-card"
      ref={containerRef}
      className="relative bg-[#080B09] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl overflow-hidden shadow-2xl transition-all select-none"
    >
      {/* Top Map Header & Controls */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0C140F] via-[#080B09] to-[#0C140F] border-b border-[#1B3022] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1B3022]/80 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <Globe2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0]">
                Bioregional Regenerative Impact Map
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B3022] border border-[#C5A059]/40 text-[#C5A059] font-bold">
                D3 SPATIAL ENGINE
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 font-sans">
              Interactive geographic projection of real-time multi-scale impact points & verified ecological flow corridors
            </p>
          </div>
        </div>

        {/* Top Controls: Filter Chips & Telemetry Stream */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Heatmap Layer Mode Selector */}
          <div className="flex items-center bg-black/60 border border-[#1B3022] rounded-lg p-0.5 text-xs font-mono">
            <span className="px-2 text-[10px] text-white/50 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Heatmap:
            </span>
            {[
              { id: 'none', label: 'OFF' },
              { id: 'ecological', label: '🌿 Ecological' },
              { id: 'economic', label: '⚡ Economic' },
              { id: 'composite', label: '🌐 Composite' }
            ].map(hm => (
              <button
                key={hm.id}
                onClick={() => handleHeatmapModeSelect(hm.id as HeatmapMode)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  activeHeatmapMode === hm.id
                    ? hm.id === 'ecological'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                      : hm.id === 'economic'
                      ? 'bg-amber-950 text-amber-300 font-bold border border-amber-500/40'
                      : hm.id === 'composite'
                      ? 'bg-purple-950 text-purple-300 font-bold border border-purple-500/40'
                      : 'bg-white/20 text-white font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {hm.label}
              </button>
            ))}
          </div>

          {/* Heatmap Intensity selector if heatmap active */}
          {activeHeatmapMode !== 'none' && (
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setHeatmapIntensity(prev => prev === 0.75 ? 1.0 : prev === 1.0 ? 0.5 : 0.75);
              }}
              title="Toggle Heatmap Intensity"
              className="px-2 py-1 rounded bg-black/60 border border-[#1B3022] hover:border-white/20 text-[10px] font-mono text-[#C5A059] cursor-pointer"
            >
              Int: {Math.round(heatmapIntensity * 100)}%
            </button>
          )}

          {/* Live Telemetry Stream Switch */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsLiveTelemetryStreaming(!isLiveTelemetryStreaming);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
              isLiveTelemetryStreaming
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-black/60 border-white/15 text-[#F5F5F0]/50'
            }`}
          >
            <Radio className={`w-3 h-3 ${isLiveTelemetryStreaming ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span className="text-[10px]">{isLiveTelemetryStreaming ? 'STREAMING' : 'STATIC'}</span>
          </button>

          {/* Quick Zoom Buttons */}
          <div className="flex items-center bg-black/60 border border-[#1B3022] rounded-lg p-0.5">
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1.5 text-[#F5F5F0]/70 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1.5 text-[#F5F5F0]/70 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset View"
              className="p-1.5 text-[#F5F5F0]/70 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="px-4 sm:px-5 py-2 bg-black/40 border-b border-[#1B3022] flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        <span className="text-[11px] text-[#F5F5F0]/50 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#C5A059]" /> Domain:
        </span>
        {[
          { id: 'all', label: 'All Bioregions' },
          { id: 'hydrology', label: 'Hydrology & Aquifers', color: '#06B6D4' },
          { id: 'canopy', label: 'Canopy & Agroforestry', color: '#10B981' },
          { id: 'soil_carbon', label: 'Soil Carbon Sinks', color: '#F59E0B' },
          { id: 'microgrid', label: 'Renewable Microgrids', color: '#8B5CF6' },
          { id: 'marine', label: 'Marine & Wetland', color: '#3B82F6' },
          { id: 'community', label: 'Communal Assemblies', color: '#C5A059' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              audioFeedback.playMicroTick();
              setSelectedCategory(tab.id);
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-mono shrink-0 transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059] font-bold shadow-sm'
                : 'bg-black/30 hover:bg-white/5 text-[#F5F5F0]/60 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main D3 Canvas Area */}
      <div className="relative w-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-auto cursor-grab active:cursor-grabbing" />

        {/* Hazard Target Centered Floating HUD */}
        {hazardFocusBanner && (
          <div className="absolute top-3 left-3 z-30 p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-[#C5A059] shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="text-[10px] text-[#C5A059] uppercase font-bold">
                Map Centered on Hazard Anomaly
              </div>
              <div className="text-white font-serif font-bold text-xs truncate max-w-[280px]">
                {hazardFocusBanner.title}
              </div>
              <div className="text-[10px] text-emerald-400">
                Lat: {hazardFocusBanner.lat.toFixed(2)}°, Lng: {hazardFocusBanner.lng.toFixed(2)}° • Zoomed 4.2x
              </div>
            </div>
            <button
              onClick={() => setHazardFocusBanner(null)}
              className="text-white/50 hover:text-white ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hover Tooltip */}
        {hoveredPoint && tooltipPos && (
          <div
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full px-3 py-2 bg-[#0A0E0C]/95 border border-[#C5A059]/50 rounded-lg shadow-xl text-[#F5F5F0] text-xs font-mono space-y-1 backdrop-blur-sm animate-in fade-in duration-100"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="text-[11px] font-bold text-[#C5A059] truncate max-w-[240px]">
              {hoveredPoint.name}
            </div>
            <div className="text-[10px] text-emerald-300">
              {hoveredPoint.liveMetrics.primaryLabel}: <span className="font-bold text-white">{hoveredPoint.liveMetrics.primaryValue}</span>
            </div>
            <div className="text-[9px] text-[#F5F5F0]/60">
              {hoveredPoint.hectaresRestored.toLocaleString()} ha restored • Certainty: {hoveredPoint.epistemicCertainty}%
            </div>
          </div>
        )}

        {/* Hovered Heatmap Hotspot Tooltip */}
        {hoveredHotspot && hotspotTooltipPos && (
          <div
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full px-3 py-2.5 bg-[#0A0D0B]/95 border border-[#C5A059]/60 rounded-lg shadow-2xl text-[#F5F5F0] text-xs font-mono space-y-1.5 backdrop-blur-md animate-in fade-in duration-100 min-w-[240px]"
            style={{ left: hotspotTooltipPos.x, top: hotspotTooltipPos.y }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                hoveredHotspot.category === 'ecological' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {hoveredHotspot.category === 'ecological' ? '🌿 Ecological Hotspot' : '⚡ Economic Hotspot'}
              </span>
              <span className="text-[10px] font-bold text-white">
                {hoveredHotspot.intensity}/100 Density
              </span>
            </div>
            <div className="font-bold text-white font-serif text-xs">
              {hoveredHotspot.name}
            </div>
            <div className="text-[10px] text-[#C5A059]">
              {hoveredHotspot.activityLabel}
            </div>
            <div className="text-[10px] text-emerald-300 font-mono">
              {hoveredHotspot.metricValue}
            </div>
            <div className="text-[9px] text-white/50 border-t border-white/10 pt-1 flex justify-between">
              <span>Sensor Quorum: {hoveredHotspot.sensorQuorum} nodes</span>
              <span className="text-[#C5A059]">{hoveredHotspot.bioregionName}</span>
            </div>
          </div>
        )}

        {/* Floating Legend / Stats Pill */}
        <div className="absolute bottom-3 left-3 bg-[#0A0E0C]/90 border border-[#1B3022] rounded-lg p-2.5 text-[10px] font-mono text-[#F5F5F0]/70 space-y-1.5 backdrop-blur-sm">
          <div className="text-[#C5A059] font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Layers className="w-3 h-3" /> Telemetry Flow Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#06B6D4]" /> Hydrological</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]" /> Canopy NDVI</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Soil Carbon</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Microgrid Solar</span>
          </div>
        </div>

        {/* Floating Heatmap Density Legend Pill */}
        {activeHeatmapMode !== 'none' && (
          <div className="absolute bottom-3 right-3 bg-[#0A0E0C]/90 border border-[#1B3022] rounded-lg p-2.5 text-[10px] font-mono text-[#F5F5F0]/70 space-y-1.5 backdrop-blur-sm shadow-xl animate-in fade-in duration-150">
            <div className="text-[#C5A059] font-bold uppercase tracking-wider text-[9px] flex items-center justify-between gap-3">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                {activeHeatmapMode === 'ecological' ? 'Ecological Thermal Heatmap' : activeHeatmapMode === 'economic' ? 'Economic Hotspot Heatmap' : 'Composite Thermal Resonance'}
              </span>
              <span className="text-white/40">{Math.round(heatmapIntensity * 100)}% Opacity</span>
            </div>
            <div className="w-40 h-2 rounded bg-gradient-to-r from-emerald-950 via-cyan-600 via-amber-500 to-orange-500 border border-white/10" />
            <div className="flex justify-between text-[8px] text-white/40">
              <span>Low Intensity</span>
              <span>Median</span>
              <span>Super Hotspot</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Impact Point Drawer / Detail Strip */}
      {selectedPoint && (
        <div className="p-4 sm:p-5 bg-[#0C120E] border-t border-[#1B3022] space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: getCategoryColor(selectedPoint.category) }} 
                />
                <span className="text-xs font-mono font-bold uppercase text-[#C5A059]">
                  {selectedPoint.bioregionName} ({selectedPoint.country})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  {selectedPoint.status}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0] mt-0.5">
                {selectedPoint.name}
              </h4>
              <p className="text-xs font-mono text-[#F5F5F0]/50">
                Lat/Lng: {selectedPoint.coordinates.join(', ')} • Steward: {selectedPoint.stewardCouncil}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onInspectProvenance && (
                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    onInspectProvenance({
                      id: selectedPoint.id,
                      source: selectedPoint.name,
                      sourceType: 'iot_sensor_mesh',
                      collectedAt: new Date().toISOString(),
                      calculationMethod: 'Autonomous Bio-Telemetry Mesh Integration',
                      certaintyScore: selectedPoint.epistemicCertainty,
                      verifier: selectedPoint.stewardCouncil,
                      verifierRole: 'Regional Bioregional Council',
                      cryptographicHash: selectedPoint.merkleHash,
                      assumptions: ['Calibrated ground sensor array', 'Continuous peer-validated baseflow model'],
                      lastAudited: new Date().toISOString()
                    });
                  }}
                  className="px-3 py-1.5 bg-black/60 hover:bg-black/90 border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Epistemic Provenance</span>
                </button>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-black/40 border border-[#1B3022] rounded-lg">
              <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">{selectedPoint.liveMetrics.primaryLabel}</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {selectedPoint.liveMetrics.primaryValue}
              </div>
            </div>

            <div className="p-2.5 bg-black/40 border border-[#1B3022] rounded-lg">
              <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">{selectedPoint.liveMetrics.secondaryLabel}</div>
              <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">
                {selectedPoint.liveMetrics.secondaryValue}
              </div>
            </div>

            <div className="p-2.5 bg-black/40 border border-[#1B3022] rounded-lg">
              <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Hectares Restored</div>
              <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                {selectedPoint.hectaresRestored.toLocaleString()} ha
              </div>
            </div>

            <div className="p-2.5 bg-black/40 border border-[#1B3022] rounded-lg">
              <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Beneficiaries</div>
              <div className="text-sm font-mono font-bold text-[#F5F5F0] mt-0.5">
                {selectedPoint.populationBeneficiaries.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Cryptographic Ledger Verification Hash */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40 pt-1 border-t border-[#1B3022]">
            <span className="truncate max-w-[280px]">
              Merkle Root: {selectedPoint.merkleHash}
            </span>
            <span className="text-emerald-400 font-bold">
              Certainty Index: {selectedPoint.epistemicCertainty}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
