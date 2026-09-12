import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Globe2, 
  RotateCcw, 
  Compass, 
  Crosshair, 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  Layers, 
  Radio,
  Activity,
  Sparkles,
  Camera,
  Play,
  Pause,
  Download,
  CheckCircle2,
  Maximize2,
  Satellite,
  Image as ImageIcon,
  Mountain,
  Eye,
  SlidersHorizontal,
  Thermometer,
  Brain
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';
import { BioregionalMapZoomDock } from './BioregionalMapZoomDock';
import { BioregionalMapLegend, HeatmapLayerToggles, ColorBlindMode } from './BioregionalMapLegend';
import { SatelliteOrbitHud } from './SatelliteOrbitHud';
import { ChronologicalTimelineScrubber } from './ChronologicalTimelineScrubber';
import { SnapshotGalleryDrawer, MapSnapshot } from './SnapshotGalleryDrawer';
import { BioregionalEcologicalZonesLegend, ECOLOGICAL_ZONES } from './BioregionalEcologicalZonesLegend';
import { HazardSensorMetricsModal } from './HazardSensorMetricsModal';
import { 
  REGENERATIVE_POTENTIAL_ZONES, 
  RegenerativeInterventionZone, 
  WhatIfScenarioState,
  calculateProjectedImprovement 
} from '../../data/regenerativePotentialData';
import { RegenerativePotentialWhatIfDock } from './RegenerativePotentialWhatIfDock';

interface BioregionalHazardD3MapProps {
  alerts: SatelliteHazardAlert[];
  selectedAlert: SatelliteHazardAlert | null;
  onSelectAlert: (alert: SatelliteHazardAlert) => void;
  targetCoordinates?: [number, number] | null; // [lat, lng]
  maintainContext?: boolean;
}

export type MapStyleMode = 'satellite' | 'terrain' | 'minimalist';

const MAP_STYLE_THEMES: Record<MapStyleMode, {
  svgBg: string;
  oceanBg: string;
  oceanStroke: string;
  atmosphereGlow: string;
  landmassFill: string;
  landmassStroke: string;
  graticuleStroke: string;
  graticuleOpacity: number;
  orbitStroke: string;
}> = {
  satellite: {
    svgBg: '#070B08',
    oceanBg: '#050A06',
    oceanStroke: '#16271D',
    atmosphereGlow: '#C5A059',
    landmassFill: '#0B130E',
    landmassStroke: '#182C1E',
    graticuleStroke: '#16271D',
    graticuleOpacity: 0.45,
    orbitStroke: '#C5A059'
  },
  terrain: {
    svgBg: '#100D0A',
    oceanBg: '#0A0E12',
    oceanStroke: '#2D2319',
    atmosphereGlow: '#D97706',
    landmassFill: '#1E1712',
    landmassStroke: '#3E2F22',
    graticuleStroke: '#2C2016',
    graticuleOpacity: 0.40,
    orbitStroke: '#E5A952'
  },
  minimalist: {
    svgBg: '#0A0D10',
    oceanBg: '#050709',
    oceanStroke: '#1E293B',
    atmosphereGlow: '#38BDF8',
    landmassFill: '#131A22',
    landmassStroke: '#334155',
    graticuleStroke: '#1E293B',
    graticuleOpacity: 0.65,
    orbitStroke: '#94A3B8'
  }
};

// Global & Regional hazard hotspot data for long-term density overlay
export interface HistoricalHazardCluster {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  densityScore: number; // 0 - 100
  dominantHazard: 'thermal_fire' | 'aquifer_deficit' | 'canopy_stress' | 'methane_plume' | 'siltation_surge';
  ecologicalZoneId: string; // matches zone in ECOLOGICAL_ZONES
  historicalEventsCount: number;
  tenYearTrend: string;
  radiusKm: number;
  peakYears?: number[];
}

const HISTORICAL_HAZARD_CLUSTERS: HistoricalHazardCluster[] = [
  {
    id: 'hist-mara',
    name: 'Mara-Serengeti Transboundary Basin',
    coordinates: [-1.48, 35.22],
    densityScore: 92,
    dominantHazard: 'thermal_fire',
    ecologicalZoneId: 'zone-savanna',
    historicalEventsCount: 384,
    tenYearTrend: '+18.4% wildfire frequency due to dry-season expansion',
    radiusKm: 140,
    peakYears: [2016, 2019, 2023]
  },
  {
    id: 'hist-congo-salonga',
    name: 'Congo Basin Core Peatland Sink',
    coordinates: [-1.15, 20.85],
    densityScore: 88,
    dominantHazard: 'canopy_stress',
    ecologicalZoneId: 'zone-tropical',
    historicalEventsCount: 265,
    tenYearTrend: 'Subsurface methane degassing anomalies increasing',
    radiusKm: 180,
    peakYears: [2020, 2024]
  },
  {
    id: 'hist-turkana',
    name: 'Lake Turkana Transboundary Depression',
    coordinates: [3.45, 36.05],
    densityScore: 95,
    dominantHazard: 'aquifer_deficit',
    ecologicalZoneId: 'zone-arid',
    historicalEventsCount: 412,
    tenYearTrend: '-14.2 cm EWT groundwater deficit over decadal satellite pass',
    radiusKm: 150,
    peakYears: [2017, 2021, 2022]
  },
  {
    id: 'hist-albertine',
    name: 'Albertine Rift Montane Flanks',
    coordinates: [-0.35, 29.85],
    densityScore: 78,
    dominantHazard: 'siltation_surge',
    ecologicalZoneId: 'zone-montane',
    historicalEventsCount: 198,
    tenYearTrend: 'Riverine turbidity spikes correlating with steep runoff',
    radiusKm: 110,
    peakYears: [2018, 2020, 2025]
  },
  {
    id: 'hist-lake-victoria',
    name: 'Victoria Riparian Siltation Arc',
    coordinates: [-0.52, 33.45],
    densityScore: 84,
    dominantHazard: 'siltation_surge',
    ecologicalZoneId: 'zone-wetland',
    historicalEventsCount: 310,
    tenYearTrend: 'High nutrient runoff and seasonal algal proliferation',
    radiusKm: 130,
    peakYears: [2019, 2022, 2026]
  },
  {
    id: 'hist-okavango',
    name: 'Okavango Inflow Tributary Delta',
    coordinates: [-18.95, 22.55],
    densityScore: 76,
    dominantHazard: 'aquifer_deficit',
    ecologicalZoneId: 'zone-wetland',
    historicalEventsCount: 172,
    tenYearTrend: 'Upstream recharge fluctuations and seasonal flood lag',
    radiusKm: 160,
    peakYears: [2017, 2019, 2023]
  },
  {
    id: 'hist-amazon',
    name: 'Amazon Peatland & Arc of Deforestation',
    coordinates: [-3.46, -62.21],
    densityScore: 91,
    dominantHazard: 'canopy_stress',
    ecologicalZoneId: 'zone-tropical',
    historicalEventsCount: 520,
    tenYearTrend: 'Canopy moisture deficit accelerating across south-eastern biome',
    radiusKm: 190,
    peakYears: [2019, 2023, 2024]
  },
  {
    id: 'hist-sundaland',
    name: 'Sundaland Peat Swamp Corridor',
    coordinates: [1.45, 102.82],
    densityScore: 86,
    dominantHazard: 'methane_plume',
    ecologicalZoneId: 'zone-tropical',
    historicalEventsCount: 340,
    tenYearTrend: 'Sub-canopy smoldering peat emissions during El Niño dry phases',
    radiusKm: 140,
    peakYears: [2016, 2019, 2025]
  },
  {
    id: 'hist-indo-gangetic',
    name: 'Indo-Gangetic Transboundary Aquifer',
    coordinates: [26.85, 80.94],
    densityScore: 94,
    dominantHazard: 'aquifer_deficit',
    ecologicalZoneId: 'zone-temperate',
    historicalEventsCount: 460,
    tenYearTrend: 'Deep borehole extraction exceeding annual monsoon recharge by 2.4x',
    radiusKm: 170,
    peakYears: [2018, 2021, 2024]
  }
];

// GeoJSON definition of global continental landmasses
const GLOBAL_LANDMASS_POLYGONS: Array<{ name: string; coordinates: [number, number][] }> = [
  {
    name: 'Africa',
    coordinates: [
      [-17, 14], [-17, 21], [-5, 36], [10, 37], [25, 32], [32, 31], [35, 28], 
      [43, 12], [51, 12], [42, -4], [40, -11], [35, -24], [28, -34], [18, -34], 
      [12, -18], [9, 4], [3, 6], [-13, 9], [-17, 14]
    ]
  },
  {
    name: 'Madagascar',
    coordinates: [
      [49, -12], [50, -16], [47, -25], [44, -25], [44, -16], [49, -12]
    ]
  },
  {
    name: 'Eurasia',
    coordinates: [
      [-9, 36], [-9, 43], [0, 49], [9, 54], [25, 71], [60, 70], [100, 73], 
      [140, 71], [170, 66], [140, 36], [120, 24], [104, 10], [90, 22], [75, 10], 
      [60, 24], [50, 26], [35, 32], [26, 40], [14, 45], [-2, 38], [-9, 36]
    ]
  },
  {
    name: 'North America',
    coordinates: [
      [-168, 65], [-140, 70], [-100, 70], [-60, 60], [-65, 45], [-75, 35], 
      [-80, 25], [-97, 20], [-105, 23], [-120, 34], [-125, 50], [-160, 56], [-168, 65]
    ]
  },
  {
    name: 'South America',
    coordinates: [
      [-80, 8], [-60, 10], [-50, -1], [-35, -5], [-39, -15], [-45, -23], 
      [-55, -35], [-65, -54], [-73, -50], [-72, -35], [-76, -15], [-81, -4], [-80, 8]
    ]
  },
  {
    name: 'Australia',
    coordinates: [
      [114, -22], [124, -15], [136, -12], [143, -11], [150, -23], [153, -28], 
      [147, -38], [138, -35], [128, -32], [115, -34], [113, -25], [114, -22]
    ]
  }
];

export const BioregionalHazardD3Map: React.FC<BioregionalHazardD3MapProps> = ({
  alerts,
  selectedAlert,
  onSelectAlert,
  targetCoordinates,
  maintainContext = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);

  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(1);
  const [hoveredAlert, setHoveredAlert] = useState<SatelliteHazardAlert | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<HistoricalHazardCluster | null>(null);
  const [activeFocusAlert, setActiveFocusAlert] = useState<SatelliteHazardAlert | null>(selectedAlert);

  // Map Display, Projection & Style Modes
  const [displayMode, setDisplayMode] = useState<'composite' | 'realtime' | 'trends'>('composite');
  const [projectionMode, setProjectionMode] = useState<'globe' | 'mercator'>('mercator');
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('satellite');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [contextNotification, setContextNotification] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isShutterFlashing, setIsShutterFlashing] = useState<boolean>(false);
  const [captureToast, setCaptureToast] = useState<string | null>(null);

  // 1. Legend Toggles State
  const [layerToggles, setLayerToggles] = useState<HeatmapLayerToggles>({
    soilIntegrity: true,
    waterReliability: true,
    biodiversityDensity: true,
    atmosphericPlumes: true
  });

  // 2. Color Blind Accessibility Mode State
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('standard');

  // 3. Satellite Orbit Flyover Lock State
  const [isOrbitLocked, setIsOrbitLocked] = useState<boolean>(false);
  const [currentOrbitCoords, setCurrentOrbitCoords] = useState<[number, number]>([-1.28, 34.82]);

  // 4. Chronological Timeline Scrubber State (2016 - 2026)
  const [currentTimelineYear, setCurrentTimelineYear] = useState<number>(2026);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(false);

  // 5. Ecological Zones Legend State & Filter
  const [selectedEcoZoneId, setSelectedEcoZoneId] = useState<string | null>(null);
  const [isEcoLegendOpen, setIsEcoLegendOpen] = useState<boolean>(false);

  // 6. Real-time Hazard Sensor Metrics Modal State
  const [selectedModalAlert, setSelectedModalAlert] = useState<SatelliteHazardAlert | null>(null);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState<boolean>(false);

  // 7. Snapshot Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<MapSnapshot[]>([
    {
      id: 'snap-2024-drought',
      timestamp: '2024-08-14 14:32 UTC',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" style="background:%23070B08"><rect width="100%" height="100%" fill="%23070B08"/><circle cx="300" cy="170" r="80" fill="%23EF4444" opacity="0.6"/><circle cx="280" cy="160" r="40" fill="%23E11D48" opacity="0.8"/><text x="30" y="50" fill="%23C5A059" font-family="monospace" font-size="14" font-weight="bold">HISTORICAL SNAPSHOT: 2024 EL NINO DROUGHT PEAK</text><text x="30" y="80" fill="%239CA3AF" font-family="monospace" font-size="11">TURKANA &amp; MARA EXTENDED DEFICIT • VIIRS / MODIS PASS</text></svg>',
      zoomLevel: 2.5,
      projection: 'mercator',
      layerMode: 'COMPOSITE',
      hazardCount: 8,
      year: 2024,
      bioregionFocus: 'Lake Turkana Transboundary Depression',
      notes: 'Peak groundwater deficit (-14.2cm EWT) before regenerative recharge intervention.'
    },
    {
      id: 'snap-2025-riparian',
      timestamp: '2025-05-22 09:15 UTC',
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" style="background:%23070B08"><rect width="100%" height="100%" fill="%23070B08"/><circle cx="300" cy="170" r="90" fill="%233B82F6" opacity="0.5"/><circle cx="320" cy="180" r="50" fill="%2306B6D4" opacity="0.7"/><text x="30" y="50" fill="%23C5A059" font-family="monospace" font-size="14" font-weight="bold">HISTORICAL SNAPSHOT: 2025 MONSOON RIPARIAN RUNOFF</text><text x="30" y="80" fill="%239CA3AF" font-family="monospace" font-size="11">VICTORIA &amp; ALBERTINE SILTATION ARC • SENTINEL-2 MSI</text></svg>',
      zoomLevel: 3.8,
      projection: 'globe',
      layerMode: 'COMPOSITE',
      hazardCount: 5,
      year: 2025,
      bioregionFocus: 'Victoria Riparian Siltation Arc',
      notes: 'Post-seasonal runoff turbidity surge with agroforestry buffer retention active.'
    }
  ]);

  // 8. Regenerative Potential & What-If Restoration State
  const [isRegenPotentialLayerActive, setIsRegenPotentialLayerActive] = useState<boolean>(true);
  const [selectedRegenZone, setSelectedRegenZone] = useState<RegenerativeInterventionZone | null>(null);
  const [geminiHeatmapGrid, setGeminiHeatmapGrid] = useState<any[]>([]);
  const [whatIfScenario, setWhatIfScenario] = useState<WhatIfScenarioState>({
    interventionIntensity: 75,
    activeStrategy: 'holistic',
    simulatedHorizonYear: 2028
  });

  // Listen to Gemini predictive heatmap updates
  useEffect(() => {
    const handleGeminiGrid = (e: any) => {
      if (Array.isArray(e.detail?.grid)) {
        setGeminiHeatmapGrid(e.detail.grid);
      }
    };
    window.addEventListener('gemini-heatmap-grid-updated', handleGeminiGrid);
    return () => {
      window.removeEventListener('gemini-heatmap-grid-updated', handleGeminiGrid);
    };
  }, []);

  // Keep focus in sync with prop changes
  useEffect(() => {
    if (selectedAlert) {
      setActiveFocusAlert(selectedAlert);
    }
  }, [selectedAlert]);

  // Handle Layer Toggle
  const handleToggleLayer = (layerKey: keyof HeatmapLayerToggles) => {
    setLayerToggles(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Color helper according to Color Blind mode
  const getCategoryColor = (cat: SatelliteHazardAlert['hazardCategory']) => {
    if (colorBlindMode === 'protanopia') {
      switch (cat) {
        case 'thermal_fire': return '#F59E0B'; // amber
        case 'aquifer_deficit': return '#06B6D4'; // cyan
        case 'canopy_stress': return '#38BDF8'; // light cyan
        case 'methane_plume': return '#6366F1'; // indigo
        case 'siltation_surge': return '#818CF8'; // violet
        default: return '#E2E8F0';
      }
    } else if (colorBlindMode === 'deuteranopia') {
      switch (cat) {
        case 'thermal_fire': return '#EAB308'; // yellow
        case 'aquifer_deficit': return '#3B82F6'; // blue
        case 'canopy_stress': return '#60A5FA'; // light blue
        case 'methane_plume': return '#D946EF'; // fuchsia
        case 'siltation_surge': return '#93C5FD'; // pale blue
        default: return '#F1F5F9';
      }
    } else if (colorBlindMode === 'tritanopia') {
      switch (cat) {
        case 'thermal_fire': return '#E11D48'; // crimson
        case 'aquifer_deficit': return '#0D9488'; // teal
        case 'canopy_stress': return '#14B8A6'; // light teal
        case 'methane_plume': return '#B45309'; // bronze/amber
        case 'siltation_surge': return '#2DD4BF'; // pale teal
        default: return '#F8FAFC';
      }
    } else if (colorBlindMode === 'high_contrast') {
      switch (cat) {
        case 'thermal_fire': return '#FFFFFF';
        case 'aquifer_deficit': return '#E5E5E5';
        case 'canopy_stress': return '#CCCCCC';
        case 'methane_plume': return '#A3A3A3';
        case 'siltation_surge': return '#737373';
        default: return '#FFFFFF';
      }
    }

    // Standard mode
    switch (cat) {
      case 'thermal_fire': return '#F59E0B'; // amber/orange
      case 'aquifer_deficit': return '#06B6D4'; // cyan
      case 'canopy_stress': return '#10B981'; // emerald
      case 'methane_plume': return '#A855F7'; // purple
      case 'siltation_surge': return '#3B82F6'; // blue
      default: return '#C5A059';
    }
  };

  // Severity color helper with color blind support
  const getSeverityColor = (sev: SatelliteHazardAlert['severity']) => {
    if (colorBlindMode === 'protanopia') {
      switch (sev) {
        case 'EXISTENTIAL': return '#6366F1'; // deep indigo
        case 'CRITICAL': return '#F59E0B';    // amber
        case 'WARNING': return '#06B6D4';     // cyan
        case 'ADVISORY': return '#A5F3FC';    // pale cyan
      }
    } else if (colorBlindMode === 'deuteranopia') {
      switch (sev) {
        case 'EXISTENTIAL': return '#D946EF'; // fuchsia
        case 'CRITICAL': return '#EAB308';    // yellow
        case 'WARNING': return '#3B82F6';     // blue
        case 'ADVISORY': return '#93C5FD';    // soft blue
      }
    } else if (colorBlindMode === 'tritanopia') {
      switch (sev) {
        case 'EXISTENTIAL': return '#E11D48'; // crimson
        case 'CRITICAL': return '#B45309';    // bronze
        case 'WARNING': return '#0D9488';     // teal
        case 'ADVISORY': return '#5EEAD4';    // soft teal
      }
    } else if (colorBlindMode === 'high_contrast') {
      switch (sev) {
        case 'EXISTENTIAL': return '#FFFFFF';
        case 'CRITICAL': return '#D4D4D4';
        case 'WARNING': return '#A3A3A3';
        case 'ADVISORY': return '#737373';
      }
    }

    // Standard
    switch (sev) {
      case 'EXISTENTIAL': return '#E11D48'; // crimson
      case 'CRITICAL': return '#EF4444';    // red
      case 'WARNING': return '#F59E0B';     // amber/gold
      case 'ADVISORY': return '#38BDF8';    // cyan/blue
    }
  };

  // Check if a historical cluster matches active layer toggles
  const isClusterVisibleByLayer = (cluster: HistoricalHazardCluster) => {
    if (cluster.dominantHazard === 'siltation_surge') return layerToggles.soilIntegrity;
    if (cluster.dominantHazard === 'aquifer_deficit') return layerToggles.waterReliability;
    if (cluster.dominantHazard === 'canopy_stress' || cluster.dominantHazard === 'thermal_fire') return layerToggles.biodiversityDensity;
    if (cluster.dominantHazard === 'methane_plume') return layerToggles.atmosphericPlumes;
    return true;
  };

  // Check if an alert matches active layer toggles
  const isAlertVisibleByLayer = (alert: SatelliteHazardAlert) => {
    if (alert.hazardCategory === 'siltation_surge') return layerToggles.soilIntegrity;
    if (alert.hazardCategory === 'aquifer_deficit') return layerToggles.waterReliability;
    if (alert.hazardCategory === 'canopy_stress' || alert.hazardCategory === 'thermal_fire') return layerToggles.biodiversityDensity;
    if (alert.hazardCategory === 'methane_plume') return layerToggles.atmosphericPlumes;
    return true;
  };

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(isAlertVisibleByLayer);
  }, [alerts, layerToggles]);

  // Center and pan/zoom to coordinates respecting maintainContext
  const panOrZoomToCoordinates = (lat: number, lng: number, forceScale?: number) => {
    if (!svgRef.current || !projectionRef.current || !zoomBehaviorRef.current || !containerRef.current) return;

    if (isRotating) {
      setIsRotating(false);
    }

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 360;

    const projectedPoint = projectionRef.current([lng, lat]);
    if (!projectedPoint) return;

    const [px, py] = projectedPoint;

    const targetScale = maintainContext ? (currentZoomLevel || 1.0) : (forceScale || 4.2);

    if (maintainContext) {
      setContextNotification(`Context Maintained: Zoom locked at ${targetScale.toFixed(1)}x`);
      const timer = setTimeout(() => setContextNotification(null), 3000);
    }

    const transform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(targetScale)
      .translate(-px, -py);

    d3.select(svgRef.current)
      .transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, transform);

    setCurrentZoomLevel(Number(targetScale.toFixed(1)));
  };

  // Satellite orbit tracking callback
  const handleOrbitPositionUpdate = (coords: [number, number]) => {
    setCurrentOrbitCoords(coords);
    if (isOrbitLocked) {
      panOrZoomToCoordinates(coords[0], coords[1], Math.max(2.8, currentZoomLevel));
    }
  };

  // Listen to targetCoordinates changes
  useEffect(() => {
    if (targetCoordinates) {
      panOrZoomToCoordinates(targetCoordinates[0], targetCoordinates[1]);
    } else if (selectedAlert) {
      panOrZoomToCoordinates(selectedAlert.coordinates[0], selectedAlert.coordinates[1]);
    }
  }, [targetCoordinates, selectedAlert, maintainContext]);

  // Global window event listener for hazard coordinate focus
  useEffect(() => {
    const handleGlobalFocus = (e: Event) => {
      const customEvt = e as CustomEvent<{
        coordinates: [number, number];
        title?: string;
        bioregionId?: string;
        zoom?: number;
        maintainContext?: boolean;
      }>;

      if (customEvt.detail && customEvt.detail.coordinates) {
        const [lat, lng] = customEvt.detail.coordinates;
        const shouldMaintain = customEvt.detail.maintainContext !== undefined 
          ? customEvt.detail.maintainContext 
          : maintainContext;

        if (shouldMaintain) {
          panOrZoomToCoordinates(lat, lng, currentZoomLevel);
        } else {
          panOrZoomToCoordinates(lat, lng, customEvt.detail.zoom || 4.2);
        }
      }
    };

    window.addEventListener('focus-hazard-coordinates', handleGlobalFocus);
    return () => window.removeEventListener('focus-hazard-coordinates', handleGlobalFocus);
  }, [currentZoomLevel, maintainContext, isRotating]);

  // D3 Rendering & Projection Initialization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const theme = MAP_STYLE_THEMES[mapStyle];
    const width = containerRef.current.clientWidth || 600;
    const height = Math.max(340, containerRef.current.clientHeight || 360);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('background', theme.svgBg);

    // Defs: Filters & Radial Gradients
    const defs = svg.append('defs');

    // 1. Hazard glow filter
    const glow = defs.append('filter')
      .attr('id', 'hazard-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 2. High-intensity heat glow filter
    const heatGlow = defs.append('filter')
      .attr('id', 'heat-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');
    heatGlow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'blur');
    const heatMerge = heatGlow.append('feMerge');
    heatMerge.append('feMergeNode').attr('in', 'blur');
    heatMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 3. Radial gradients for density heatmap kernels (adapted by ColorBlindMode)
    const createHeatGradient = (id: string, coreColor: string, midColor: string) => {
      const grad = defs.append('radialGradient')
        .attr('id', id)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      grad.append('stop').attr('offset', '0%').attr('stop-color', coreColor).attr('stop-opacity', '0.85');
      grad.append('stop').attr('offset', '35%').attr('stop-color', midColor).attr('stop-opacity', '0.50');
      grad.append('stop').attr('offset', '70%').attr('stop-color', midColor).attr('stop-opacity', '0.20');
      grad.append('stop').attr('offset', '100%').attr('stop-color', midColor).attr('stop-opacity', '0.0');
    };

    if (colorBlindMode === 'protanopia') {
      createHeatGradient('heat-grad-existential', '#6366F1', '#4F46E5');
      createHeatGradient('heat-grad-critical', '#F59E0B', '#D97706');
      createHeatGradient('heat-grad-warning', '#06B6D4', '#0891B2');
      createHeatGradient('heat-grad-advisory', '#22D3EE', '#06B6D4');
    } else if (colorBlindMode === 'deuteranopia') {
      createHeatGradient('heat-grad-existential', '#D946EF', '#C026D3');
      createHeatGradient('heat-grad-critical', '#EAB308', '#CA8A04');
      createHeatGradient('heat-grad-warning', '#3B82F6', '#2563EB');
      createHeatGradient('heat-grad-advisory', '#60A5FA', '#3B82F6');
    } else if (colorBlindMode === 'tritanopia') {
      createHeatGradient('heat-grad-existential', '#E11D48', '#BE123C');
      createHeatGradient('heat-grad-critical', '#B45309', '#92400E');
      createHeatGradient('heat-grad-warning', '#0D9488', '#0F766E');
      createHeatGradient('heat-grad-advisory', '#2DD4BF', '#14B8A6');
    } else if (colorBlindMode === 'high_contrast') {
      createHeatGradient('heat-grad-existential', '#FFFFFF', '#D4D4D4');
      createHeatGradient('heat-grad-critical', '#A3A3A3', '#737373');
      createHeatGradient('heat-grad-warning', '#525252', '#404040');
      createHeatGradient('heat-grad-advisory', '#262626', '#171717');
    } else {
      // Standard
      createHeatGradient('heat-grad-existential', '#E11D48', '#BE123C');
      createHeatGradient('heat-grad-critical', '#EF4444', '#DC2626');
      createHeatGradient('heat-grad-warning', '#F59E0B', '#D97706');
      createHeatGradient('heat-grad-advisory', '#06B6D4', '#0284C7');
    }

    // 4. Regenerative Potential Gradient (Vibrant Emerald Bio-Luminescence)
    createHeatGradient('heat-grad-regenerative', '#10B981', '#059669');

    const rootGroup = svg.append('g').attr('class', 'hazard-map-root');

    // Configure Projection (Mercator or Orthographic 3D Globe)
    let projection: d3.GeoProjection;
    if (projectionMode === 'globe') {
      projection = d3.geoOrthographic()
        .scale(Math.min(width, height) * 0.44)
        .translate([width / 2, height / 2])
        .rotate([rotationAngleRef.current, -4])
        .clipAngle(90);
    } else {
      projection = d3.geoMercator()
        .center([28, 4])
        .scale(width < 640 ? 950 : 1250)
        .translate([width / 2, height / 2])
        .rotate([rotationAngleRef.current, 0]);
    }

    projectionRef.current = projection;

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 9])
      .on('zoom', (event) => {
        rootGroup.attr('transform', event.transform);
        setCurrentZoomLevel(Number(event.transform.k.toFixed(1)));
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // If Globe mode: Draw outer atmosphere sphere ring and ocean background
    if (projectionMode === 'globe') {
      const globeRadius = Math.min(width, height) * 0.44;
      rootGroup.append('circle')
        .attr('class', 'globe-atmosphere-halo')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', globeRadius + 3)
        .attr('fill', 'none')
        .attr('stroke', theme.atmosphereGlow)
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.5)
        .attr('filter', 'url(#hazard-glow)');

      rootGroup.append('circle')
        .attr('class', 'globe-ocean-sphere')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', globeRadius)
        .attr('fill', theme.oceanBg)
        .attr('stroke', theme.oceanStroke)
        .attr('stroke-width', 0.8);
    }

    // Layer 1: Graticules
    const graticule = d3.geoGraticule().step([10, 10]);
    const pathGenerator = d3.geoPath().projection(projection);

    rootGroup.append('path')
      .attr('class', 'graticule-layer')
      .datum(graticule)
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', theme.graticuleStroke)
      .attr('stroke-width', mapStyle === 'minimalist' ? 0.7 : 0.5)
      .attr('stroke-dasharray', mapStyle === 'minimalist' ? '1,3' : '2,4')
      .attr('opacity', theme.graticuleOpacity);

    // Layer 2: Continental Landmass Contours (GeoJSON polygons)
    const landmassGroup = rootGroup.append('g').attr('class', 'continent-landmasses');

    GLOBAL_LANDMASS_POLYGONS.forEach((continent) => {
      const featureData = {
        type: 'Feature',
        properties: { name: continent.name },
        geometry: {
          type: 'Polygon',
          coordinates: [continent.coordinates]
        }
      };

      landmassGroup.append('path')
        .attr('class', `landmass-${continent.name.toLowerCase().replace(/\s+/g, '-')}`)
        .datum(featureData as any)
        .attr('d', pathGenerator as any)
        .attr('fill', theme.landmassFill)
        .attr('stroke', theme.landmassStroke)
        .attr('stroke-width', mapStyle === 'minimalist' ? 1.4 : 1)
        .attr('opacity', mapStyle === 'minimalist' ? 1.0 : 0.92);
    });

    // Layer 3: Satellite Orbit Ground Tracks & Active Sensor Swath Cone
    const orbitGroup = rootGroup.append('g').attr('class', 'orbit-tracks');
    const orbitTracks = [
      [[-25, -20], [55, 30]],
      [[-10, -35], [70, 25]],
      [[15, -45], [45, 45]]
    ];

    orbitTracks.forEach((track) => {
      const trackFeature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: track
        }
      };

      orbitGroup.append('path')
        .datum(trackFeature as any)
        .attr('d', pathGenerator as any)
        .attr('fill', 'none')
        .attr('stroke', theme.orbitStroke)
        .attr('stroke-width', 0.8)
        .attr('stroke-dasharray', '3,6')
        .attr('opacity', mapStyle === 'minimalist' ? 0.4 : 0.25);
    });

    // Active Satellite Sensor Sub-point & Swath Cone on Map
    const orbitPt = projection([currentOrbitCoords[1], currentOrbitCoords[0]]);
    if (orbitPt) {
      const sensorNode = orbitGroup.append('g')
        .attr('class', 'active-orbit-sensor')
        .attr('transform', `translate(${orbitPt[0]}, ${orbitPt[1]})`);

      sensorNode.append('circle')
        .attr('r', 32)
        .attr('fill', 'none')
        .attr('stroke', '#10B981')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,3')
        .attr('opacity', 0.6);

      sensorNode.append('circle')
        .attr('r', 16)
        .attr('fill', '#10B981')
        .attr('opacity', 0.12);

      sensorNode.append('circle')
        .attr('r', 4.5)
        .attr('fill', '#10B981')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.2)
        .attr('filter', 'url(#hazard-glow)');

      sensorNode.append('text')
        .text('Sentinel-2C Swath')
        .attr('x', 10)
        .attr('y', -8)
        .attr('font-size', '8px')
        .attr('font-family', 'JetBrains Mono, monospace')
        .attr('fill', '#10B981')
        .attr('font-weight', 'bold');
    }

    // Layer 4: Dynamic Historical Hazard Heatmap Overlay
    const heatmapGroup = rootGroup.append('g').attr('class', 'heatmap-overlay-layer');
    if (displayMode === 'trends' || displayMode === 'composite') {
      heatmapGroup.attr('opacity', displayMode === 'trends' ? 0.95 : 0.65);

      HISTORICAL_HAZARD_CLUSTERS
        .filter(isClusterVisibleByLayer)
        .forEach((cluster) => {
          const pt = projection([cluster.coordinates[1], cluster.coordinates[0]]);
          if (!pt) return;

          const [px, py] = pt;

          // Temporal Evolution Factor based on scrubbed year
          const isPeakYear = cluster.peakYears?.includes(currentTimelineYear);
          const yearDiff = Math.abs(currentTimelineYear - (cluster.peakYears?.[0] || 2024));
          const timeAttenuation = isPeakYear 
            ? 1.18 
            : Math.max(0.55, 1.0 - (yearDiff * 0.08));

          const dynamicDensity = Math.min(100, Math.round(cluster.densityScore * timeAttenuation));
          const dynamicRadius = Math.round(cluster.radiusKm * timeAttenuation);

          // Check if matches selected Ecological Biome Zone
          const isEcoMatch = !selectedEcoZoneId || cluster.ecologicalZoneId === selectedEcoZoneId;
          const ecoZoneDef = ECOLOGICAL_ZONES.find(z => z.id === cluster.ecologicalZoneId);

          const heatNode = heatmapGroup.append('g')
            .attr('class', `heat-cluster heat-cluster-${cluster.id}`)
            .attr('data-id', cluster.id)
            .attr('transform', `translate(${px}, ${py})`)
            .attr('opacity', isEcoMatch ? 1.0 : 0.3)
            .style('cursor', 'pointer');

          const gradId = dynamicDensity >= 90
            ? 'heat-grad-existential'
            : dynamicDensity >= 80
            ? 'heat-grad-critical'
            : 'heat-grad-warning';

          // Outer dispersal zone
          heatNode.append('circle')
            .attr('r', dynamicRadius * 0.45)
            .attr('fill', `url(#${gradId})`)
            .attr('filter', 'url(#heat-glow)');

          // Intermediate density core
          heatNode.append('circle')
            .attr('r', dynamicRadius * 0.25)
            .attr('fill', `url(#${gradId})`)
            .attr('opacity', 0.85);

          // Density isoline ring
          heatNode.append('circle')
            .attr('r', dynamicRadius * 0.38)
            .attr('fill', 'none')
            .attr('stroke', dynamicDensity >= 90 ? '#E11D48' : '#F59E0B')
            .attr('stroke-width', 0.8)
            .attr('stroke-dasharray', '3,4')
            .attr('opacity', 0.4);

          // Ecological Zone Highlight Ring if filtered
          if (selectedEcoZoneId && isEcoMatch && ecoZoneDef) {
            heatNode.append('circle')
              .attr('r', dynamicRadius * 0.52)
              .attr('fill', 'none')
              .attr('stroke', ecoZoneDef.color)
              .attr('stroke-width', 1.8)
              .attr('stroke-dasharray', '4,3')
              .attr('opacity', 0.9);
          }

          // Cluster Tag Label in trends mode
          if (displayMode === 'trends') {
            heatNode.append('text')
              .text(`${cluster.name.split(' ')[0]} (${dynamicDensity})`)
              .attr('x', 14)
              .attr('y', -6)
              .attr('font-size', '9px')
              .attr('font-family', 'JetBrains Mono, monospace')
              .attr('font-weight', '700')
              .attr('fill', dynamicDensity >= 90 ? '#FDA4AF' : '#FDE68A')
              .style('text-shadow', '0 1px 4px rgba(0,0,0,0.95)');

            heatNode.append('text')
              .text(`${cluster.historicalEventsCount} events • ${currentTimelineYear}`)
              .attr('x', 14)
              .attr('y', 6)
              .attr('font-size', '8px')
              .attr('font-family', 'JetBrains Mono, monospace')
              .attr('fill', '#C5A059')
              .attr('opacity', 0.8);
          }

          heatNode.on('mouseenter', () => setHoveredCluster(cluster));
          heatNode.on('mouseleave', () => setHoveredCluster(null));
          heatNode.on('click', (event) => {
            event.stopPropagation();
            audioFeedback.playMicroTick();
            panOrZoomToCoordinates(cluster.coordinates[0], cluster.coordinates[1]);
          });
        });
    }

    // Layer 5: Real-Time Satellite Hazard Alerts
    const hazardsGroup = rootGroup.append('g').attr('class', 'hazards-group');
    if (displayMode === 'realtime' || displayMode === 'composite') {
      filteredAlerts.forEach((alert) => {
        const [lng, lat] = [alert.coordinates[1], alert.coordinates[0]];
        const pt = projection([lng, lat]);
        if (!pt) return;

        const [px, py] = pt;
        const isSelected = selectedAlert?.id === alert.id;
        const isExistential = alert.severity === 'EXISTENTIAL';
        const isCritical = alert.severity === 'CRITICAL';
        const catColor = getCategoryColor(alert.hazardCategory);
        const sevColor = getSeverityColor(alert.severity);

        const node = hazardsGroup.append('g')
          .attr('class', `hazard-node hazard-node-${alert.id}`)
          .attr('data-id', alert.id)
          .attr('transform', `translate(${px}, ${py})`)
          .style('cursor', 'pointer');

        // Outer animated beacon
        const pulseRing = node.append('circle')
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', isExistential ? sevColor : isCritical ? sevColor : catColor)
          .attr('stroke-width', isExistential ? 2.2 : isCritical ? 1.8 : 1.2)
          .attr('opacity', 0.9);

        const animatePulse = () => {
          pulseRing
            .attr('r', 7)
            .attr('opacity', 0.95)
            .transition()
            .duration(isExistential ? 1100 : isCritical ? 1400 : 2200)
            .ease(d3.easeCubicOut)
            .attr('r', isSelected ? 34 : 22)
            .attr('opacity', 0)
            .on('end', animatePulse);
        };
        animatePulse();

        // Selected crosshairs
        if (isSelected) {
          node.append('circle')
            .attr('r', 18)
            .attr('fill', 'none')
            .attr('stroke', isExistential ? '#E11D48' : '#C5A059')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '2,3');

          const chSize = 24;
          const tickStroke = isExistential ? '#E11D48' : '#C5A059';
          node.append('line').attr('x1', -chSize).attr('y1', 0).attr('x2', -14).attr('y2', 0).attr('stroke', tickStroke).attr('stroke-width', 1.4);
          node.append('line').attr('x1', 14).attr('y1', 0).attr('x2', chSize).attr('y2', 0).attr('stroke', tickStroke).attr('stroke-width', 1.4);
          node.append('line').attr('x1', 0).attr('y1', -chSize).attr('x2', 0).attr('y2', -14).attr('stroke', tickStroke).attr('stroke-width', 1.4);
          node.append('line').attr('x1', 0).attr('y1', 14).attr('x2', 0).attr('y2', chSize).attr('stroke', tickStroke).attr('stroke-width', 1.4);
        }

        // Core anchor icon background circle
        node.append('circle')
          .attr('r', isSelected ? 9 : 7)
          .attr('fill', isExistential ? '#4C0519' : isCritical ? '#7F1D1D' : '#14251B')
          .attr('stroke', sevColor)
          .attr('stroke-width', isSelected ? 2.5 : 1.5)
          .attr('filter', 'url(#hazard-glow)');

        // Center bright core
        node.append('circle')
          .attr('r', 2.5)
          .attr('fill', isExistential ? '#FFE4E6' : '#FFFFFF');

        // Label
        node.append('text')
          .text(alert.bioregionName.split(' ')[0])
          .attr('x', 14)
          .attr('y', 4)
          .attr('font-size', '9px')
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-weight', isSelected ? '700' : '500')
          .attr('fill', isSelected ? '#FFFFFF' : sevColor)
          .attr('opacity', 0.9)
          .style('text-shadow', '0 1px 3px rgba(0,0,0,0.95)');

        // Interactive Click on Individual Map Hazard: Opens Real-Time Sensor Metrics Modal!
        node.on('click', (event) => {
          event.stopPropagation();
          audioFeedback.playMicroTick();
          onSelectAlert(alert);
          setActiveFocusAlert(alert);
          setSelectedModalAlert(alert);
          setIsMetricsModalOpen(true);
          panOrZoomToCoordinates(alert.coordinates[0], alert.coordinates[1]);
        });

        node.on('mouseenter', () => setHoveredAlert(alert));
        node.on('mouseleave', () => setHoveredAlert(null));
      });
    }

    // Layer 6: Regenerative Potential & What-If Environmental Improvement Zones
    const regenGroup = rootGroup.append('g').attr('class', 'regenerative-potential-group');
    if (isRegenPotentialLayerActive) {
      REGENERATIVE_POTENTIAL_ZONES.forEach((zone) => {
        const [lng, lat] = [zone.coordinates[1], zone.coordinates[0]];
        const pt = projection([lng, lat]);
        if (!pt) return;

        const [px, py] = pt;
        const isSelected = selectedRegenZone?.id === zone.id;
        const proj = calculateProjectedImprovement(zone, whatIfScenario);
        const dynamicRadius = Math.max(18, (zone.radiusKm / 2.8) * Math.sqrt(currentZoomLevel));

        const node = regenGroup.append('g')
          .attr('class', `regen-zone-node regen-zone-${zone.id}`)
          .attr('data-id', zone.id)
          .attr('transform', `translate(${px}, ${py})`)
          .style('cursor', 'pointer');

        // Outer restorative aura
        node.append('circle')
          .attr('r', dynamicRadius)
          .attr('fill', 'url(#heat-grad-regenerative)')
          .attr('filter', 'url(#hazard-glow)')
          .attr('opacity', 0.85);

        // Concentric harmonic isolines
        node.append('circle')
          .attr('r', dynamicRadius * 0.65)
          .attr('fill', 'none')
          .attr('stroke', '#10B981')
          .attr('stroke-width', 1.2)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.7);

        // Center regenerative bio-beacon
        node.append('circle')
          .attr('r', isSelected ? 8 : 5)
          .attr('fill', isSelected ? '#34D399' : '#10B981')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1.5);

        // What-if projected delta badge
        node.append('text')
          .text(`-${proj.effectiveHazardReduction}% Risk (+${proj.projectedBiomassGain}t/ha)`)
          .attr('x', 12)
          .attr('y', -4)
          .attr('font-size', '9px')
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-weight', '700')
          .attr('fill', '#A7F3D0')
          .style('text-shadow', '0 1px 4px rgba(0,0,0,0.95)');

        node.on('click', (event) => {
          event.stopPropagation();
          audioFeedback.playMicroTick();
          setSelectedRegenZone(zone);
          panOrZoomToCoordinates(zone.coordinates[0], zone.coordinates[1]);
        });
      });

      // Layer 6B: Gemini Predictive Overlay Heatmap Grid
      if (geminiHeatmapGrid && geminiHeatmapGrid.length > 0) {
        const geminiGroup = regenGroup.append('g').attr('class', 'gemini-predictive-grid-group');
        geminiHeatmapGrid.forEach((cell, idx) => {
          const pt = projection([cell.lng, cell.lat]);
          if (!pt) return;
          const [px, py] = pt;

          const cellGroup = geminiGroup.append('g')
            .attr('class', `gemini-cell-${idx}`)
            .attr('transform', `translate(${px}, ${py})`);

          // Soft recovery glow
          cellGroup.append('circle')
            .attr('r', Math.max(8, (cell.radiusKm || 12) / 1.5))
            .attr('fill', '#10B981')
            .attr('opacity', Math.min(0.65, (cell.recoveryIntensity || 50) / 130))
            .attr('filter', 'url(#hazard-glow)');

          // Micro beacon point
          cellGroup.append('circle')
            .attr('r', 3)
            .attr('fill', '#34D399')
            .attr('stroke', '#064E3B')
            .attr('stroke-width', 0.8);
        });
      }
    }

    if (selectedAlert && !targetCoordinates) {
      panOrZoomToCoordinates(selectedAlert.coordinates[0], selectedAlert.coordinates[1]);
    }
  }, [
    filteredAlerts, 
    selectedAlert, 
    displayMode, 
    projectionMode, 
    mapStyle,
    maintainContext, 
    layerToggles, 
    colorBlindMode, 
    currentTimelineYear, 
    currentOrbitCoords,
    selectedEcoZoneId,
    isRegenPotentialLayerActive,
    whatIfScenario,
    selectedRegenZone,
    geminiHeatmapGrid
  ]);

  // Global Continuous Cinematic Rotation Animation Loop
  useEffect(() => {
    if (!isRotating) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const rotateLoop = () => {
      // Cinematic slow continuous globe rotation (0.14 deg/frame)
      rotationAngleRef.current = (rotationAngleRef.current + 0.14) % 360;

      if (projectionRef.current && svgRef.current) {
        if (projectionMode === 'globe') {
          projectionRef.current.rotate([rotationAngleRef.current, -4]);
        } else {
          projectionRef.current.rotate([rotationAngleRef.current, 0]);
        }

        const pathGen = d3.geoPath().projection(projectionRef.current);
        const svg = d3.select(svgRef.current);

        svg.select('.graticule-layer').attr('d', pathGen as any);
        svg.selectAll('.continent-landmasses path').attr('d', pathGen as any);
        svg.selectAll('.orbit-tracks path').attr('d', pathGen as any);

        HISTORICAL_HAZARD_CLUSTERS.forEach((cluster) => {
          const pt = projectionRef.current!([cluster.coordinates[1], cluster.coordinates[0]]);
          const node = svg.select(`.heat-cluster-${cluster.id}`);
          if (node.node()) {
            if (projectionMode === 'globe') {
              const geoDist = d3.geoDistance(
                [cluster.coordinates[1], cluster.coordinates[0]],
                [-rotationAngleRef.current, 4]
              );
              const isVisible = geoDist < Math.PI / 2;
              if (isVisible && pt) {
                node.attr('transform', `translate(${pt[0]}, ${pt[1]})`).attr('display', 'block');
              } else {
                node.attr('display', 'none');
              }
            } else if (pt) {
              node.attr('transform', `translate(${pt[0]}, ${pt[1]})`).attr('display', 'block');
            }
          }
        });

        filteredAlerts.forEach((alert) => {
          const pt = projectionRef.current!([alert.coordinates[1], alert.coordinates[0]]);
          const node = svg.select(`.hazard-node-${alert.id}`);
          if (node.node()) {
            if (projectionMode === 'globe') {
              const geoDist = d3.geoDistance(
                [alert.coordinates[1], alert.coordinates[0]],
                [-rotationAngleRef.current, 4]
              );
              const isVisible = geoDist < Math.PI / 2;
              if (isVisible && pt) {
                node.attr('transform', `translate(${pt[0]}, ${pt[1]})`).attr('display', 'block');
              } else {
                node.attr('display', 'none');
              }
            } else if (pt) {
              node.attr('transform', `translate(${pt[0]}, ${pt[1]})`).attr('display', 'block');
            }
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(rotateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(rotateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRotating, projectionMode, filteredAlerts]);

  // Zoom & Fine-grained Navigation handlers
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(280).call(zoomBehaviorRef.current.scaleBy, 1.35);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(280).call(zoomBehaviorRef.current.scaleBy, 0.75);
    }
  };

  const handleFineZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(180).call(zoomBehaviorRef.current.scaleBy, 1.15);
    }
  };

  const handleFineZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(180).call(zoomBehaviorRef.current.scaleBy, 0.88);
    }
  };

  const handlePan = (dx: number, dy: number) => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.translateBy, dx, dy);
    }
  };

  const handleZoomTo = (scale: number) => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleTo, scale);
      setCurrentZoomLevel(Number(scale.toFixed(1)));
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      setCurrentZoomLevel(1.0);
    }
  };

  const handleRecenterNorth = () => {
    if (projectionRef.current) {
      rotationAngleRef.current = 0;
      if (projectionMode === 'globe') {
        projectionRef.current.rotate([0, -4]);
      } else {
        projectionRef.current.rotate([0, 0]);
      }
      handleResetZoom();
    }
  };

  const handleToggleGlobalRotation = () => {
    audioFeedback.playMicroTick();
    if (!isRotating && projectionMode !== 'globe') {
      setProjectionMode('globe');
    }
    setIsRotating(!isRotating);
  };

  // Keyboard navigation for fine-grained map control (+, -, arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleFineZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleFineZoomOut();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePan(0, 60);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handlePan(0, -60);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePan(60, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlePan(-60, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // High-Resolution 'Capture View' Snapshot Generator + Gallery Storage
  const handleCaptureView = async () => {
    if (!svgRef.current || !containerRef.current) return;
    setIsCapturing(true);
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 320);
    audioFeedback.playSubtleClick();

    try {
      const svgElement = svgRef.current;
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 450;
      const scale = 2;

      const clone = svgElement.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      clone.setAttribute('width', `${width}`);
      clone.setAttribute('height', `${height}`);

      const svgString = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = (e) => reject(e);
        image.src = blobURL;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize 2D canvas context');

      const theme = MAP_STYLE_THEMES[mapStyle];
      ctx.fillStyle = theme.svgBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(image, 0, 0, width, height);
      ctx.restore();

      // Telemetry Watermark Header Banner
      ctx.fillStyle = 'rgba(7, 11, 8, 0.88)';
      ctx.fillRect(20, 20, canvas.width - 40, 52);
      ctx.strokeStyle = '#1B3022';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, 52);

      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillStyle = '#C5A059';
      ctx.fillText('ATLAS SANCTUM // BIOREGIONAL HAZARD TELEMETRY RADAR', 36, 52);

      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#10B981';
      ctx.fillText(`STYLE: ${mapStyle.toUpperCase()} • ${filteredAlerts.length} BEACONS • EPOCH: ${currentTimelineYear}`, canvas.width - 640, 52);

      // Telemetry Footer Banner
      const footerY = canvas.height - 56;
      ctx.fillStyle = 'rgba(7, 11, 8, 0.88)';
      ctx.fillRect(20, footerY, canvas.width - 40, 38);
      ctx.strokeStyle = '#1B3022';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, footerY, canvas.width - 40, 38);

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#9CA3AF';
      const timestampStr = new Date().toISOString();
      ctx.fillText(`CAPTURED: ${timestampStr} | ZOOM: ${currentZoomLevel}x | LAYER: ${displayMode.toUpperCase()} | COLOR: ${colorBlindMode.toUpperCase()}`, 36, footerY + 24);

      ctx.fillStyle = '#C5A059';
      ctx.fillText('CRYPTOGRAPHIC PROVENANCE: SENTINEL-2 / MODIS / VIIRS ORBITAL HARVEST', canvas.width - 540, footerY + 24);

      window.URL.revokeObjectURL(blobURL);

      const pngUrl = canvas.toDataURL('image/png');
      const newSnapshot: MapSnapshot = {
        id: `snap-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        dataUrl: pngUrl,
        zoomLevel: currentZoomLevel,
        projection: projectionMode,
        layerMode: `${displayMode.toUpperCase()} [${mapStyle.toUpperCase()}]`,
        hazardCount: filteredAlerts.length,
        year: currentTimelineYear,
        bioregionFocus: activeFocusAlert?.bioregionName || 'Global Bioregional View',
        notes: `High-res capture in ${mapStyle} style at ${currentTimelineYear} timeline epoch.`
      };

      setSnapshots(prev => [newSnapshot, ...prev]);

      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `hazard-radar-snapshot-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      audioFeedback.playSyncComplete();
      setCaptureToast('High-res snapshot saved to Gallery & downloaded (2x PNG)');
      setTimeout(() => setCaptureToast(null), 4000);
    } catch (err) {
      console.error('Failed to generate high-resolution snapshot', err);
      setCaptureToast('Failed to generate snapshot');
      setTimeout(() => setCaptureToast(null), 3000);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDeleteSnapshot = (id: string) => {
    audioFeedback.playMicroTick();
    setSnapshots(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] bg-[#070B08] rounded-lg overflow-hidden border border-[#1B3022] select-none"
    >
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Bar HUD: Title, Map Styles, Modes, Orbit, Gallery, Capture */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        {/* Left HUD: Radar Title & Status */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#1B3022] text-[10px] font-mono pointer-events-auto shadow-md">
          <Globe2 className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[#F5F5F0]">Hazard Radar</span>
          <span className="text-[#F5F5F0]/40">•</span>
          <span className="text-emerald-400 font-bold">{currentZoomLevel}x</span>
          <span className="text-[#C5A059] font-bold">{currentTimelineYear}</span>
          {maintainContext && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] font-bold">
              LOCK CONTEXT
            </span>
          )}
        </div>

        {/* Center & Right HUD: Controls & Tools */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {/* Map Style Switcher ('Satellite', 'Terrain', 'Minimalist') */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#1B3022] shadow-md">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setMapStyle('satellite');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Satellite Orbit View: Dark vegetation emeralds and atmospheric scan lines"
            >
              <Satellite className="w-2.5 h-2.5 text-emerald-400" />
              <span className="hidden sm:inline">Satellite</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setMapStyle('terrain');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                mapStyle === 'terrain'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Terrain View: Topographic hypsometric earthen relief tinting"
            >
              <Mountain className="w-2.5 h-2.5 text-amber-400" />
              <span className="hidden sm:inline">Terrain</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setMapStyle('minimalist');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                mapStyle === 'minimalist'
                  ? 'bg-slate-900 text-sky-300 border border-sky-500/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Minimalist View: High-contrast slate cartography for daylight/high-glare legibility"
            >
              <Eye className="w-2.5 h-2.5 text-sky-400" />
              <span className="hidden sm:inline">Minimalist</span>
            </button>
          </div>

          {/* Overlay Filter Mode */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#1B3022] shadow-md">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setDisplayMode('realtime');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                displayMode === 'realtime'
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Show active real-time satellite alert beacons only"
            >
              <Radio className="w-2.5 h-2.5 text-emerald-400" />
              <span>Real-time</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setDisplayMode('trends');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                displayMode === 'trends'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Show historical environmental hazard density heatmap"
            >
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              <span>Trends</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setDisplayMode('composite');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                displayMode === 'composite'
                  ? 'bg-[#221B0A] text-[#F5F5F0] border border-[#C5A059]/60 font-bold shadow-sm'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Composite layer: Real-time alerts overlaid on long-term historical density heatmap"
            >
              <Layers className="w-2.5 h-2.5 text-[#C5A059]" />
              <span>Composite</span>
            </button>
          </div>

          {/* Projection Mode Toggle: 3D Globe vs Mercator */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#1B3022] shadow-md">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setProjectionMode('globe');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono transition-all cursor-pointer ${
                projectionMode === 'globe'
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Switch to 3D Orthographic Globe"
            >
              3D Globe
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setProjectionMode('mercator');
              }}
              className={`px-2 py-1 rounded text-[9.5px] font-mono transition-all cursor-pointer ${
                projectionMode === 'mercator'
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
              title="Switch to Flat Mercator Map"
            >
              Mercator
            </button>
          </div>

          {/* Ecological Biome Zones Legend Toggle */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsEcoLegendOpen(!isEcoLegendOpen);
            }}
            className={`px-2 py-1 rounded-lg text-[9.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md border ${
              isEcoLegendOpen
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/70 font-bold ring-1 ring-emerald-400/40'
                : 'bg-black/85 text-[#F5F5F0]/70 hover:text-white border-[#1B3022]'
            }`}
            title="Toggle Ecological Biome Zones Legend (Holdridge Classifications)"
          >
            <TreePine className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">Biomes</span>
            {selectedEcoZoneId && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Global Rotation Cinematic Orbit Toggle */}
          <button
            onClick={handleToggleGlobalRotation}
            className={`px-2.5 py-1 rounded-lg text-[9.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md border ${
              isRotating
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/80 font-bold ring-1 ring-amber-400/40'
                : 'bg-black/85 text-[#F5F5F0]/80 hover:text-white border-[#1B3022] hover:border-[#C5A059]/40'
            }`}
            title={isRotating ? 'Pause Cinematic Global Rotation' : 'Enable Cinematic 360° Continuous Global Hazard Rotation'}
          >
            {isRotating ? (
              <>
                <Pause className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Rotation: Active</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#C5A059]" />
                <span>Global Rotation</span>
              </>
            )}
          </button>

          {/* Regenerative Potential What-If Toggle */}
          <button
            id="toggle-regenerative-potential-dock-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsRegenPotentialLayerActive(!isRegenPotentialLayerActive);
            }}
            className={`px-2.5 py-1 rounded-lg text-[9.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md border ${
              isRegenPotentialLayerActive
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 font-bold'
                : 'bg-black/85 text-white/50 border-[#1B3022] hover:text-white'
            }`}
            title="Toggle Regenerative Potential Layer & What-If Restoration Scenarios"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Regenerative Potential</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isRegenPotentialLayerActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
          </button>

          {/* Snapshot Gallery Drawer Toggle */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsGalleryOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-black/85 hover:bg-[#1B3022] text-[#C5A059] hover:text-white border border-[#1B3022] hover:border-[#C5A059]/50 text-[9.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Open Snapshot Gallery & Comparison Workspace"
          >
            <ImageIcon className="w-3 h-3 text-[#C5A059]" />
            <span>Gallery</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[8.5px] font-bold">
              {snapshots.length}
            </span>
          </button>

          {/* Capture View High-Resolution Snapshot Button */}
          <button
            onClick={handleCaptureView}
            disabled={isCapturing}
            className="px-2.5 py-1 rounded-lg bg-black/85 hover:bg-[#1B3022] text-[#C5A059] hover:text-white border border-[#1B3022] hover:border-[#C5A059]/50 text-[9.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
            title="Generate high-resolution (2x PNG) pixel-perfect snapshot of map state with heatmaps and hazard pins"
          >
            <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-bold">{isCapturing ? 'Capturing Snapshot...' : 'Capture View'}</span>
          </button>
        </div>
      </div>

      {/* Camera Shutter Flash Overlay for Pixel-Perfect Snapshot */}
      {isShutterFlashing && (
        <div className="absolute inset-0 bg-white/40 pointer-events-none z-50 transition-opacity duration-300" />
      )}

      {/* Cinematic Rotation HUD Banner */}
      {isRotating && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono flex items-center gap-2 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Cinematic Global Rotation Active (0.14°/frame)</span>
          </div>
        </div>
      )}

      {/* Satellite Orbit Tracking HUD (Top Left Corner) */}
      <SatelliteOrbitHud
        isOrbitLocked={isOrbitLocked}
        onToggleOrbitLock={() => setIsOrbitLocked(!isOrbitLocked)}
        onOrbitPositionUpdate={handleOrbitPositionUpdate}
      />

      {/* Dedicated Zoom Dock with Fine-Grained Navigation (Right Center Overlay) */}
      <BioregionalMapZoomDock
        currentZoom={currentZoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFineZoomIn={handleFineZoomIn}
        onFineZoomOut={handleFineZoomOut}
        onResetZoom={handleResetZoom}
        onRecenterNorth={handleRecenterNorth}
        onPan={handlePan}
        onZoomTo={handleZoomTo}
      />

      {/* Dynamic Map Legend Overlay with Legend Toggles & Color Blind Mode (Bottom Right Overlay) */}
      <BioregionalMapLegend
        displayMode={displayMode}
        layerToggles={layerToggles}
        onToggleLayer={handleToggleLayer}
        colorBlindMode={colorBlindMode}
        onChangeColorBlindMode={(mode) => setColorBlindMode(mode)}
        onCategoryClick={(catId) => {
          const matched = alerts.find(a => 
            a.hazardCategory === catId || 
            a.hazardCategory.includes(catId) || 
            catId.includes(a.hazardCategory)
          );
          if (matched) {
            onSelectAlert(matched);
            panOrZoomToCoordinates(matched.coordinates[0], matched.coordinates[1]);
          }
        }}
      />

      {/* Collapsible Ecological Zones Legend (Top Right or toggled via Biomes button) */}
      {isEcoLegendOpen && (
        <BioregionalEcologicalZonesLegend
          selectedZoneId={selectedEcoZoneId}
          onSelectZone={(zoneId) => setSelectedEcoZoneId(zoneId)}
          defaultExpanded={true}
        />
      )}

      {/* Chronological Range Timeline Scrubber (Bottom Center Overlay) */}
      <div className="absolute bottom-3 left-3 sm:left-auto sm:right-[350px] pointer-events-none z-20">
        <ChronologicalTimelineScrubber
          currentYear={currentTimelineYear}
          onYearChange={(yr) => setCurrentTimelineYear(yr)}
          isPlaying={isTimelinePlaying}
          onTogglePlay={() => setIsTimelinePlaying(!isTimelinePlaying)}
        />
      </div>

      {/* Interactive Hazard Real-Time Sensor Metrics Modal */}
      <HazardSensorMetricsModal
        isOpen={isMetricsModalOpen}
        alert={selectedModalAlert}
        onClose={() => setIsMetricsModalOpen(false)}
        onFocusCoordinates={(coords) => panOrZoomToCoordinates(coords[0], coords[1])}
      />

      {/* Snapshot Gallery & Side-by-Side Comparison Drawer */}
      <SnapshotGalleryDrawer
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        snapshots={snapshots}
        onDeleteSnapshot={handleDeleteSnapshot}
      />

      {/* Toast Notification when 'Maintain Context' prevents zoom jump */}
      {contextNotification && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/90 border border-[#C5A059]/60 shadow-xl text-[10px] font-mono text-[#C5A059] flex items-center gap-1.5 pointer-events-none animate-fade-in z-20">
          <Crosshair className="w-3 h-3 text-[#C5A059]" />
          <span>{contextNotification}</span>
        </div>
      )}

      {/* Snapshot Capture Toast Notification */}
      {captureToast && (
        <div className="absolute top-14 right-14 px-4 py-2 rounded-xl bg-black/95 border border-emerald-500/60 shadow-2xl text-xs font-mono text-emerald-300 flex items-center gap-2 pointer-events-none animate-fade-in z-30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{captureToast}</span>
        </div>
      )}

      {/* Hovered Historical Cluster Tooltip */}
      {hoveredCluster && (
        <div className="absolute top-14 left-72 max-w-xs p-2.5 rounded-lg bg-[#0C120E]/95 backdrop-blur-md border border-[#C5A059]/50 shadow-2xl text-xs font-mono space-y-1 pointer-events-none z-20">
          <div className="flex items-center justify-between">
            <span className="text-[#C5A059] font-bold text-[10px] uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Historical Basin Hotspot
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 border border-amber-500/50 text-amber-300 font-bold">
              Density: {hoveredCluster.densityScore}/100
            </span>
          </div>
          <div className="text-white font-serif font-bold text-xs">
            {hoveredCluster.name}
          </div>
          <p className="text-[10px] text-[#F5F5F0]/70 font-sans leading-tight">
            {hoveredCluster.tenYearTrend}
          </p>
          <div className="text-[9px] text-[#C5A059]/80 pt-1 border-t border-white/10 flex justify-between">
            <span>{hoveredCluster.historicalEventsCount} recorded breaches</span>
            <span>Radius: {hoveredCluster.radiusKm}km</span>
          </div>
        </div>
      )}

      {/* Interactive Context-Sensitive Epistemic Explanation Tooltip on Map Hazard Hover */}
      {hoveredAlert && (
        <div className="absolute top-14 right-16 max-w-[320px] p-3 rounded-xl bg-[#080E0A]/95 backdrop-blur-xl border border-[#C5A059]/60 shadow-2xl text-xs font-mono space-y-2 pointer-events-auto z-30 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1B3022]">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
                <Brain className="w-3 h-3 text-[#C5A059]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                  Epistemic Explanation
                </span>
                <div className="text-[8px] text-white/50">AI Hazard Score Deconstruction</div>
              </div>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
              hoveredAlert.severity === 'EXISTENTIAL'
                ? 'bg-rose-950 border-rose-600 text-rose-200'
                : hoveredAlert.severity === 'CRITICAL'
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
            }`}>
              {hoveredAlert.severity === 'EXISTENTIAL' ? 'Score: 98/100' : hoveredAlert.severity === 'CRITICAL' ? 'Score: 88/100' : 'Score: 68/100'}
            </span>
          </div>

          <div className="text-white font-serif font-bold text-xs leading-snug">
            {hoveredAlert.title}
          </div>

          {/* Epistemic formula & Bayesian certainty */}
          <div className="p-1.5 rounded-lg bg-black/60 border border-white/5 text-[8.5px] space-y-1">
            <div className="text-white/40 uppercase">Bayesian Formula:</div>
            <div className="text-emerald-300 font-medium">S_hazard = ∑(w_i · δ_i) × κ_vulnerability</div>
            <div className="flex items-center justify-between text-white/60 pt-0.5">
              <span>Certainty: <strong className="text-emerald-400">{hoveredAlert.confidenceScore.toFixed(1)}%</strong></span>
              <span>Sensors: <strong className="text-[#C5A059]">{hoveredAlert.satelliteMission.split(' ')[0]} + In-Situ</strong></span>
            </div>
          </div>

          <div className="text-[9px] text-[#F5F5F0]/80">
            <span className="text-white/40">Anomaly Delta:</span> {hoveredAlert.detectedDelta}
          </div>

          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8.5px]">
            <span className="text-[#C5A059] truncate max-w-[170px]">
              {hoveredAlert.bioregionName}
            </span>
            <span className="text-white/40">Click node to inspect metrics</span>
          </div>
        </div>
      )}

      {/* Floating Focused Coordinates HUD for Selected Alert (Bottom Left) */}
      {activeFocusAlert && !hoveredCluster && (
        <div className="hidden lg:block absolute bottom-16 left-3 max-w-[270px] pointer-events-none z-10">
          <div className="p-2.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#C5A059]/40 shadow-xl text-xs font-mono space-y-1.5 pointer-events-auto">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center gap-1">
                <Crosshair className="w-3 h-3 animate-spin text-[#C5A059]" /> Target Centered
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                activeFocusAlert.severity === 'EXISTENTIAL'
                  ? 'bg-rose-950 border-rose-600 text-rose-200'
                  : activeFocusAlert.severity === 'CRITICAL'
                  ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              }`}>
                {activeFocusAlert.severity}
              </span>
            </div>

            <div className="text-[#F5F5F0] font-serif text-xs font-bold truncate">
              {activeFocusAlert.title}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/60 pt-0.5 border-t border-white/10">
              <span className="text-emerald-400">
                Lat: {activeFocusAlert.coordinates[0].toFixed(2)}°, Lng: {activeFocusAlert.coordinates[1].toFixed(2)}°
              </span>
              <span>{activeFocusAlert.satelliteMission.split(' ')[0]}</span>
            </div>

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedModalAlert(activeFocusAlert);
                setIsMetricsModalOpen(true);
              }}
              className="w-full py-1 px-2 rounded bg-[#142318] hover:bg-[#1E3324] text-[#C5A059] hover:text-white border border-[#2A4630] text-[9.5px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Inspect Live Sensor Metrics</span>
            </button>
          </div>
        </div>
      )}

      {/* Regenerative Potential What-If Restoration Dock */}
      {isRegenPotentialLayerActive && (
        <RegenerativePotentialWhatIfDock
          selectedZone={selectedRegenZone}
          onSelectZone={(zone) => {
            setSelectedRegenZone(zone);
            if (zone) {
              panOrZoomToCoordinates(zone.coordinates[0], zone.coordinates[1]);
            }
          }}
          scenario={whatIfScenario}
          onScenarioChange={setWhatIfScenario}
        />
      )}
    </div>
  );
};
