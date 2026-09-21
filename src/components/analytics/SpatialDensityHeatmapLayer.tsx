import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Layers, 
  TreePine, 
  Droplets, 
  Flame, 
  ShieldCheck, 
  Compass, 
  Sliders, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Activity, 
  Sparkles, 
  Maximize2,
  Info,
  Radio,
  MapPin
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type EcologicalIndicatorType = 
  | 'canopy_ndvi' 
  | 'soil_carbon' 
  | 'water_recharge' 
  | 'stewardship_patrol' 
  | 'bioacoustics' 
  | 'composite';

export interface SpatialDensityHotspot {
  id: string;
  name: string;
  bioregionName: string;
  indicator: EcologicalIndicatorType;
  coordinates: [number, number]; // [lng, lat]
  intensity: number; // 0 - 100
  radiusKm: number;
  stewardshipActivity: string;
  patrolHoursPerWeek: number;
  activeGuardians: number;
  sensorNodes: number;
  measurementValue: string;
  epistemicConfidence: number; // %
  lastUpdated: string;
  cryptographicHash?: string;
}

export const SPATIAL_DENSITY_HOTSPOTS: SpatialDensityHotspot[] = [
  // Canopy NDVI
  {
    id: 'sd-aberdare-canopy',
    name: 'Aberdare Cloud Forest Cloud Interception',
    bioregionName: 'Aberdare Highlands',
    indicator: 'canopy_ndvi',
    coordinates: [36.70, -0.45],
    intensity: 96,
    radiusKm: 65,
    stewardshipActivity: 'Canopy drone lidar profiling & indigenous moss restoration',
    patrolHoursPerWeek: 320,
    activeGuardians: 48,
    sensorNodes: 120,
    measurementValue: '0.84 NDVI (96.4% Canopy Saturation)',
    epistemicConfidence: 99.2,
    lastUpdated: '12 min ago'
  },
  {
    id: 'sd-congo-canopy',
    name: 'Salonga Tropical Rain Catchment',
    bioregionName: 'Congo Peatlands',
    indicator: 'canopy_ndvi',
    coordinates: [21.50, -2.10],
    intensity: 98,
    radiusKm: 85,
    stewardshipActivity: 'Continuous canopy integrity patrol & illegal logging interception',
    patrolHoursPerWeek: 540,
    activeGuardians: 96,
    sensorNodes: 210,
    measurementValue: '0.89 NDVI (Primary Intact Rainforest)',
    epistemicConfidence: 98.7,
    lastUpdated: '18 min ago'
  },
  {
    id: 'sd-kilifi-canopy',
    name: 'Gede Indigenous Sacred Grove Canopy',
    bioregionName: 'Kilifi Coast',
    indicator: 'canopy_ndvi',
    coordinates: [40.01, -3.31],
    intensity: 88,
    radiusKm: 45,
    stewardshipActivity: 'Sacred grove elder patrols & nursery sapling enrichment',
    patrolHoursPerWeek: 180,
    activeGuardians: 28,
    sensorNodes: 65,
    measurementValue: '0.78 NDVI (+14% YoY Recovery)',
    epistemicConfidence: 97.4,
    lastUpdated: '25 min ago'
  },

  // Soil Carbon
  {
    id: 'sd-sahel-soil',
    name: 'Tillabéri Silvopastoral Inoculation Zone',
    bioregionName: 'Sahel Belt',
    indicator: 'soil_carbon',
    coordinates: [1.45, 14.20],
    intensity: 92,
    radiusKm: 70,
    stewardshipActivity: 'Biochar pyrolysis dispersal & deep-root acacia inoculation',
    patrolHoursPerWeek: 410,
    activeGuardians: 72,
    sensorNodes: 160,
    measurementValue: '3.6 tCO2e/ha (+2.1 tCO2e vs Baseline)',
    epistemicConfidence: 96.8,
    lastUpdated: '8 min ago'
  },
  {
    id: 'sd-mara-soil',
    name: 'Loita Plains High-Density Holistic Grazing',
    bioregionName: 'Mara-Serengeti Savanna',
    indicator: 'soil_carbon',
    coordinates: [35.80, -1.55],
    intensity: 94,
    radiusKm: 60,
    stewardshipActivity: 'Planned rotational herd bunching & soil organic matter building',
    patrolHoursPerWeek: 460,
    activeGuardians: 84,
    sensorNodes: 190,
    measurementValue: '4.8 tCO2e/ha (Rapid Glomalin Sequestration)',
    epistemicConfidence: 98.1,
    lastUpdated: '5 min ago'
  },
  {
    id: 'sd-congo-peat-soil',
    name: 'Cuvette Centrale Anaerobic Peat Core',
    bioregionName: 'Congo Peatlands',
    indicator: 'soil_carbon',
    coordinates: [18.26, 0.04],
    intensity: 99,
    radiusKm: 90,
    stewardshipActivity: 'Piezometer moisture verification & peat oxidation fire-shields',
    patrolHoursPerWeek: 600,
    activeGuardians: 110,
    sensorNodes: 320,
    measurementValue: '12.4 tCO2e/m³ Saturated Anaerobic Peat',
    epistemicConfidence: 99.5,
    lastUpdated: 'Just now'
  },

  // Water Recharge
  {
    id: 'sd-mara-water',
    name: 'Mara River Headwater Catchment & Sinks',
    bioregionName: 'Mara-Serengeti Savanna',
    indicator: 'water_recharge',
    coordinates: [35.25, -1.50],
    intensity: 95,
    radiusKm: 65,
    stewardshipActivity: 'Riverbank bamboo buffer maintenance & siltation trap dredging',
    patrolHoursPerWeek: 390,
    activeGuardians: 64,
    sensorNodes: 145,
    measurementValue: '184.2 m³/s Groundwater Baseflow',
    epistemicConfidence: 97.9,
    lastUpdated: '14 min ago'
  },
  {
    id: 'sd-turkana-water',
    name: 'Turkana Deep Aquifer Solar Recharge Network',
    bioregionName: 'Turkana Basin',
    indicator: 'water_recharge',
    coordinates: [35.60, 3.12],
    intensity: 91,
    radiusKm: 75,
    stewardshipActivity: 'Solar borehole pressure regulation & managed sand-dam aquifer recharge',
    patrolHoursPerWeek: 280,
    activeGuardians: 42,
    sensorNodes: 95,
    measurementValue: '14,200 m³/day Monitored Infiltration',
    epistemicConfidence: 96.5,
    lastUpdated: '32 min ago'
  },
  {
    id: 'sd-mtkenya-water',
    name: 'Sirimon Glacial Runoff Filtration Wetlands',
    bioregionName: 'Mount Kenya Catchment',
    indicator: 'water_recharge',
    coordinates: [37.30, -0.15],
    intensity: 97,
    radiusKm: 50,
    stewardshipActivity: 'Afro-alpine wetland boardwalks & runoff clarity telemetry',
    patrolHoursPerWeek: 310,
    activeGuardians: 52,
    sensorNodes: 110,
    measurementValue: '99.4 Potable Purity & Peak Silt Filtration',
    epistemicConfidence: 99.1,
    lastUpdated: '7 min ago'
  },

  // Stewardship Patrol
  {
    id: 'sd-mara-patrol',
    name: 'Mara Conservancy Maasai Elder Ranger Patrol',
    bioregionName: 'Mara-Serengeti Savanna',
    indicator: 'stewardship_patrol',
    coordinates: [35.10, -1.35],
    intensity: 96,
    radiusKm: 60,
    stewardshipActivity: 'GPS boundary patrol, anti-snare de-mining, wildlife corridor guidance',
    patrolHoursPerWeek: 780,
    activeGuardians: 140,
    sensorNodes: 280,
    measurementValue: '780 Patrol Hrs/Wk (Zero Snare Incidents)',
    epistemicConfidence: 99.4,
    lastUpdated: '3 min ago'
  },
  {
    id: 'sd-kilifi-patrol',
    name: 'Kilifi Community Fisher Co-op Blue Patrols',
    bioregionName: 'Kilifi Coast',
    indicator: 'stewardship_patrol',
    coordinates: [39.85, -3.63],
    intensity: 93,
    radiusKm: 55,
    stewardshipActivity: 'Tidal mangrove replanting & artisanal zero-take reef enforcement',
    patrolHoursPerWeek: 520,
    activeGuardians: 88,
    sensorNodes: 130,
    measurementValue: '520 Boat Patrol Hrs/Wk across 4 Marine Zones',
    epistemicConfidence: 98.2,
    lastUpdated: '9 min ago'
  },
  {
    id: 'sd-sahel-patrol',
    name: 'Sahel Great Green Wall Youth Guardian Corps',
    bioregionName: 'Sahel Belt',
    indicator: 'stewardship_patrol',
    coordinates: [2.10, 13.50],
    intensity: 94,
    radiusKm: 80,
    stewardshipActivity: 'Desertification buffer patrols, sapling survival audits, community wells',
    patrolHoursPerWeek: 890,
    activeGuardians: 165,
    sensorNodes: 340,
    measurementValue: '890 Patrol Hrs/Wk covering 220 km corridor',
    epistemicConfidence: 98.6,
    lastUpdated: '15 min ago'
  },

  // Bioacoustics
  {
    id: 'sd-rift-bioacoustics',
    name: 'Great Rift Valley Alkaline Flamingo Bioacoustics',
    bioregionName: 'Rift Valley Lakes',
    indicator: 'bioacoustics',
    coordinates: [36.08, -0.35],
    intensity: 90,
    radiusKm: 55,
    stewardshipActivity: 'Bio-acoustic AI monitoring, flamingo vocalization decibel tracking',
    patrolHoursPerWeek: 260,
    activeGuardians: 36,
    sensorNodes: 184,
    measurementValue: '82.5 HSI Index (450+ Species Tracked)',
    epistemicConfidence: 97.6,
    lastUpdated: '4 min ago'
  },
  {
    id: 'sd-aberdare-bioacoustics',
    name: 'Aberdare Primates & Canopy Bioacoustics',
    bioregionName: 'Aberdare Highlands',
    indicator: 'bioacoustics',
    coordinates: [36.80, -0.30],
    intensity: 94,
    radiusKm: 50,
    stewardshipActivity: 'Automated arboreal microphone nodes recording canopy density calls',
    patrolHoursPerWeek: 290,
    activeGuardians: 44,
    sensorNodes: 156,
    measurementValue: '94.2 Bioacoustic Vitality Index',
    epistemicConfidence: 98.5,
    lastUpdated: '11 min ago'
  }
];

export const INDICATOR_CONFIGS: Record<EcologicalIndicatorType, {
  label: string;
  color: string;
  gradient: string;
  description: string;
  unit: string;
  icon: React.ElementType;
}> = {
  canopy_ndvi: {
    label: 'Canopy Density & NDVI',
    color: '#10B981',
    gradient: 'from-emerald-950/80 via-emerald-700/60 to-emerald-400',
    description: 'Multispectral NDVI indices measuring photosynthetic vitality and closed-canopy moisture retention.',
    unit: 'NDVI Score',
    icon: TreePine
  },
  soil_carbon: {
    label: 'Soil Organic Carbon (SOC)',
    color: '#D97706',
    gradient: 'from-amber-950/80 via-amber-700/60 to-amber-400',
    description: 'Subterranean carbon sink density built through biochar pyrolysis and rotational regenerative grazing.',
    unit: 'tCO2e/ha',
    icon: Flame
  },
  water_recharge: {
    label: 'Aquifer & Water Recharge',
    color: '#06B6D4',
    gradient: 'from-cyan-950/80 via-cyan-700/60 to-cyan-400',
    description: 'Piezometric groundwater infiltration rates and subterranean river baseflow sustenance.',
    unit: 'm³/s Baseflow',
    icon: Droplets
  },
  stewardship_patrol: {
    label: 'Guardian Patrols & Stewardship',
    color: '#C5A059',
    gradient: 'from-yellow-950/80 via-[#C5A059]/60 to-[#F5E6BE]',
    description: 'Weekly on-the-ground indigenous ranger patrol hours, anti-snare sweeps, and ecosystem co-management.',
    unit: 'Patrol Hrs/Wk',
    icon: ShieldCheck
  },
  bioacoustics: {
    label: 'Bioacoustics & Biodiversity',
    color: '#A855F7',
    gradient: 'from-purple-950/80 via-purple-700/60 to-purple-400',
    description: 'Continuous bio-acoustic array vocalization streams measuring species diversity and canopy health.',
    unit: 'HSI Index',
    icon: Radio
  },
  composite: {
    label: 'Composite Epistemic Flourishing',
    color: '#34D399',
    gradient: 'from-emerald-950/80 via-cyan-700/60 to-amber-400',
    description: 'Harmonized multi-spectral biospheric density index integrating all five sensory layers.',
    unit: 'Flourishing Index (0-100)',
    icon: Layers
  }
};

interface SpatialDensityHeatmapLayerProps {
  activeIndicator?: EcologicalIndicatorType;
  onSelectIndicator?: (indicator: EcologicalIndicatorType) => void;
  onSelectHotspot?: (hotspot: SpatialDensityHotspot) => void;
  className?: string;
}

export const SpatialDensityHeatmapLayer: React.FC<SpatialDensityHeatmapLayerProps> = ({
  activeIndicator: propIndicator,
  onSelectIndicator,
  onSelectHotspot,
  className = ''
}) => {
  const [internalIndicator, setInternalIndicator] = useState<EcologicalIndicatorType>(propIndicator || 'canopy_ndvi');
  const [minIntensityFilter, setMinIntensityFilter] = useState<number>(80);
  const [heatmapRadiusScale, setHeatmapRadiusScale] = useState<number>(1.0);
  const [selectedHotspot, setSelectedHotspot] = useState<SpatialDensityHotspot | null>(SPATIAL_DENSITY_HOTSPOTS[0]);
  const [hoveredHotspot, setHoveredHotspot] = useState<SpatialDensityHotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const currentIndicator = propIndicator !== undefined ? propIndicator : internalIndicator;

  const handleIndicatorChange = (ind: EcologicalIndicatorType) => {
    audioFeedback.playSubtleClick();
    setInternalIndicator(ind);
    if (onSelectIndicator) {
      onSelectIndicator(ind);
    }
  };

  const filteredHotspots = useMemo(() => {
    return SPATIAL_DENSITY_HOTSPOTS.filter(h => {
      const matchesType = currentIndicator === 'composite' || h.indicator === currentIndicator;
      const matchesIntensity = h.intensity >= minIntensityFilter;
      return matchesType && matchesIntensity;
    });
  }, [currentIndicator, minIntensityFilter]);

  // Map Rendering with D3
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(480, Math.min(620, Math.round(width * 0.58)));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('width', '100%')
       .attr('height', height);

    // Defs & Gradients for heat thermal plumes
    const defs = svg.append('defs');

    // Filter for blur glow
    const filter = defs.append('filter')
      .attr('id', 'heat-blur-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '18')
      .attr('result', 'blur');

    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

    // Gradients per indicator
    Object.entries(INDICATOR_CONFIGS).forEach(([key, conf]) => {
      const radialGrad = defs.append('radialGradient')
        .attr('id', `heat-grad-${key}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      radialGrad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', conf.color)
        .attr('stop-opacity', 0.95);

      radialGrad.append('stop')
        .attr('offset', '45%')
        .attr('stop-color', conf.color)
        .attr('stop-opacity', 0.55);

      radialGrad.append('stop')
        .attr('offset', '75%')
        .attr('stop-color', conf.color)
        .attr('stop-opacity', 0.20);

      radialGrad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', conf.color)
        .attr('stop-opacity', 0.0);
    });

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0B0F0D');

    // Subtle grid lines
    const gridG = svg.append('g').attr('class', 'spatial-grid-lines').attr('opacity', 0.15);
    for (let x = 0; x < width; x += 40) {
      gridG.append('line').attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', height).attr('stroke', '#C5A059');
    }
    for (let y = 0; y < height; y += 40) {
      gridG.append('line').attr('x1', 0).attr('y1', y).attr('x2', width).attr('y2', y).attr('stroke', '#C5A059');
    }

    // Geo Projection centered on East Africa & Central Sahel
    const projection = d3.geoMercator()
      .center([28.0, 3.5])
      .scale(width * 1.3)
      .translate([width / 2, height / 2]);

    const g = svg.append('g').attr('class', 'map-viewport');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 6.0])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Continental landmass baseline contours (simplified representation of African landmass boundaries)
    const landContours: [number, number][][] = [
      [
        [-17.5, 14.7], [-16.0, 11.0], [-13.0, 9.0], [-8.0, 4.5], [2.0, 6.2], [9.5, 4.0],
        [8.5, 2.0], [9.5, -1.0], [12.0, -5.0], [13.5, -12.5], [18.0, -34.5], [26.0, -33.5],
        [32.5, -28.0], [35.5, -20.0], [40.5, -10.5], [41.5, -3.5], [51.0, 10.5], [43.5, 12.5],
        [38.0, 16.0], [33.0, 27.5], [30.0, 31.5], [25.0, 32.0], [11.0, 37.0], [-5.5, 36.0],
        [-10.0, 30.0], [-15.0, 23.0], [-17.5, 14.7]
      ]
    ];

    const landGroup = g.append('g').attr('class', 'landmass-contours');
    landContours.forEach(coords => {
      const lineGen = d3.line<[number, number]>()
        .x(d => projection(d)?.[0] || 0)
        .y(d => projection(d)?.[1] || 0)
        .curve(d3.curveBasisClosed);

      landGroup.append('path')
        .attr('d', lineGen(coords) || '')
        .attr('fill', '#121815')
        .attr('stroke', '#1E2B23')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.95);
    });

    // 1. Spatial Density Plumes (Continuous thermal fields)
    const plumesGroup = g.append('g').attr('class', 'spatial-heat-plumes');

    filteredHotspots.forEach(hotspot => {
      const pt = projection(hotspot.coordinates);
      if (!pt) return;
      const [hx, hy] = pt;
      const baseRadius = hotspot.radiusKm * 1.6 * heatmapRadiusScale;
      const conf = INDICATOR_CONFIGS[hotspot.indicator];

      const plumeG = plumesGroup.append('g')
        .attr('transform', `translate(${hx}, ${hy})`)
        .attr('class', `hotspot-plume-${hotspot.id}`)
        .style('cursor', 'pointer');

      // Broad ambient heat field
      plumeG.append('circle')
        .attr('r', baseRadius)
        .attr('fill', `url(#heat-grad-${hotspot.indicator})`)
        .attr('filter', 'url(#heat-blur-glow)')
        .attr('opacity', (hotspot.intensity / 100) * 0.9);

      // Mid concentric rings showing density gradient
      plumeG.append('circle')
        .attr('r', baseRadius * 0.5)
        .attr('fill', 'none')
        .attr('stroke', conf.color)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,4')
        .attr('opacity', 0.4);

      // Center core activity dot
      const core = plumeG.append('circle')
        .attr('r', 4.5)
        .attr('fill', '#FFFFFF')
        .attr('stroke', conf.color)
        .attr('stroke-width', 2)
        .attr('opacity', 0.95);

      // Continuous breathing animation
      const animateCore = () => {
        core.transition()
          .duration(1800 + Math.random() * 600)
          .attr('r', 7.5)
          .attr('opacity', 0.65)
          .transition()
          .duration(1800 + Math.random() * 600)
          .attr('r', 4.5)
          .attr('opacity', 0.95)
          .on('end', animateCore);
      };
      animateCore();

      // Interactions
      plumeG.on('mouseenter', (event) => {
        audioFeedback.playMicroTick();
        setHoveredHotspot(hotspot);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 15
          });
        }
      });

      plumeG.on('mousemove', (event) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top - 15
          });
        }
      });

      plumeG.on('mouseleave', () => {
        setHoveredHotspot(null);
      });

      plumeG.on('click', () => {
        audioFeedback.playSubtleClick();
        setSelectedHotspot(hotspot);
        if (onSelectHotspot) {
          onSelectHotspot(hotspot);
        }
      });
    });

  }, [filteredHotspots, currentIndicator, heatmapRadiusScale]);

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    audioFeedback.playMicroTick();
    const svg = d3.select(svgRef.current);
    if (direction === 'in') {
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    } else if (direction === 'out') {
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.75);
    } else {
      svg.transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const totalPatrolHours = filteredHotspots.reduce((acc, h) => acc + h.patrolHoursPerWeek, 0);
  const totalGuardians = filteredHotspots.reduce((acc, h) => acc + h.activeGuardians, 0);
  const totalSensors = filteredHotspots.reduce((acc, h) => acc + h.sensorNodes, 0);
  const avgDensity = Math.round(filteredHotspots.reduce((acc, h) => acc + h.intensity, 0) / (filteredHotspots.length || 1));

  return (
    <div 
      id="spatial-density-heatmap-layer-root"
      className={`bg-[#0C100D] border border-[#C5A059]/40 rounded-md p-4 sm:p-5 shadow-2xl space-y-4 ${className}`}
    >
      {/* Layer Header & Indicator Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#F5F5F0]/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#C5A059]/15 border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shrink-0">
            <Layers className="w-5 h-5 text-[#C5A059] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                SPATIAL DENSITY HEATMAP • STEWARDSHIP INTENSITY LAYER
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                {filteredHotspots.length} ACTIVE PLUMES
              </span>
            </div>
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <span>Geospatial Activity &amp; Ecological Density</span>
            </h3>
          </div>
        </div>

        {/* Global Summary Metric Capsules */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <div className="px-2.5 py-1 bg-[#141A16] rounded border border-[#F5F5F0]/10 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[#F5F5F0]/60">Mean Intensity:</span>
            <span className="text-emerald-400 font-bold">{avgDensity}%</span>
          </div>

          <div className="px-2.5 py-1 bg-[#141A16] rounded border border-[#F5F5F0]/10 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[#F5F5F0]/60">Guardians:</span>
            <span className="text-[#C5A059] font-bold">{totalGuardians} Active</span>
          </div>

          <div className="px-2.5 py-1 bg-[#141A16] rounded border border-[#F5F5F0]/10 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[#F5F5F0]/60">Patrols:</span>
            <span className="text-cyan-400 font-bold">{totalPatrolHours} hrs/wk</span>
          </div>
        </div>
      </div>

      {/* Indicator Selection Pill Navigation */}
      <div className="flex items-center gap-2 flex-wrap pb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 mr-1">
          Select Indicator:
        </span>
        {(Object.keys(INDICATOR_CONFIGS) as EcologicalIndicatorType[]).map(key => {
          const conf = INDICATOR_CONFIGS[key];
          const Icon = conf.icon;
          const isCurrent = currentIndicator === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleIndicatorChange(key)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isCurrent 
                  ? 'bg-[#18241C] text-white border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/50' 
                  : 'bg-[#121614] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white hover:border-[#F5F5F0]/25'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: conf.color }} />
              <span>{conf.label}</span>
            </button>
          );
        })}
      </div>

      {/* Indicator Overview Banner */}
      <div className="p-3 bg-[#111613] rounded border-l-2 border-[#C5A059] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
            Active Layer Profile: {INDICATOR_CONFIGS[currentIndicator].label}
          </span>
          <p className="text-[#F5F5F0]/70 font-sans text-[11px] leading-relaxed">
            {INDICATOR_CONFIGS[currentIndicator].description}
          </p>
        </div>

        {/* Map Calibration Sliders */}
        <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] text-[#F5F5F0]/60">
          <div className="flex items-center gap-2">
            <span>Min Intensity:</span>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minIntensityFilter}
              onChange={(e) => {
                setMinIntensityFilter(Number(e.target.value));
                audioFeedback.playMicroTick();
              }}
              className="w-16 h-1 accent-[#C5A059] cursor-pointer"
            />
            <span className="text-[#C5A059] font-bold">{minIntensityFilter}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Plume Radius:</span>
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.1}
              value={heatmapRadiusScale}
              onChange={(e) => {
                setHeatmapRadiusScale(Number(e.target.value));
                audioFeedback.playMicroTick();
              }}
              className="w-16 h-1 accent-[#C5A059] cursor-pointer"
            />
            <span className="text-[#C5A059] font-bold">{heatmapRadiusScale.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full rounded border border-[#F5F5F0]/10 overflow-hidden bg-[#0A0D0B]"
        style={{ minHeight: '440px' }}
      >
        <svg ref={svgRef} className="w-full h-auto block select-none" />

        {/* Zoom & Pan Controls floating on map */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded bg-[#151C17]/90 hover:bg-[#202C24] border border-[#F5F5F0]/20 text-[#F5F5F0] transition-colors cursor-pointer shadow"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded bg-[#151C17]/90 hover:bg-[#202C24] border border-[#F5F5F0]/20 text-[#F5F5F0] transition-colors cursor-pointer shadow"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('reset')}
            className="p-1.5 rounded bg-[#151C17]/90 hover:bg-[#202C24] border border-[#F5F5F0]/20 text-[#C5A059] transition-colors cursor-pointer shadow"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Legend */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded bg-[#0D120F]/90 border border-[#F5F5F0]/15 text-[10px] font-mono z-10 backdrop-blur-sm space-y-1.5 max-w-[240px]">
          <div className="flex items-center justify-between text-[#F5F5F0]/70 uppercase font-bold">
            <span>Thermal Intensity Scale</span>
            <span style={{ color: INDICATOR_CONFIGS[currentIndicator].color }}>100%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#121815] via-emerald-700/60 to-amber-400" />
          <div className="flex justify-between text-[9px] text-[#F5F5F0]/40">
            <span>Low Saturation</span>
            <span>Critical Apex</span>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredHotspot && tooltipPos && (
          <div 
            className="absolute pointer-events-none z-30 p-2.5 rounded bg-[#101713] border border-[#C5A059] shadow-2xl text-xs font-mono space-y-1 transform -translate-x-1/2 -translate-y-full"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="flex items-center gap-1.5 text-white font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{hoveredHotspot.name}</span>
            </div>
            <div className="text-[10px] text-[#C5A059]">
              {hoveredHotspot.bioregionName} • Intensity {hoveredHotspot.intensity}%
            </div>
            <div className="text-[11px] text-emerald-400 font-bold">
              {hoveredHotspot.measurementValue}
            </div>
            <div className="text-[9px] text-[#F5F5F0]/60">
              {hoveredHotspot.activeGuardians} Guardians • {hoveredHotspot.patrolHoursPerWeek} hrs/wk
            </div>
          </div>
        )}
      </div>

      {/* Selected Hotspot Deep Epistemic Dossier */}
      {selectedHotspot && (
        <div className="p-4 bg-[#101612] rounded border border-[#C5A059]/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
              Selected Spatial Node
            </span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{selectedHotspot.name}</span>
            </h4>
            <p className="text-[11px] text-[#F5F5F0]/70 font-sans mt-1">
              {selectedHotspot.stewardshipActivity}
            </p>
          </div>

          <div className="space-y-1 bg-[#0B0E0C] p-2.5 rounded border border-[#F5F5F0]/10">
            <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
              Empirical Sensor Reading
            </span>
            <div className="text-emerald-400 font-bold text-sm">
              {selectedHotspot.measurementValue}
            </div>
            <div className="text-[10px] text-[#F5F5F0]/60">
              Confidence: <strong className="text-white">{selectedHotspot.epistemicConfidence}%</strong> across {selectedHotspot.sensorNodes} edge nodes
            </div>
          </div>

          <div className="space-y-1 bg-[#0B0E0C] p-2.5 rounded border border-[#F5F5F0]/10">
            <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
              Stewardship Deployment
            </span>
            <div className="text-[#C5A059] font-bold text-sm">
              {selectedHotspot.activeGuardians} Guardians Active
            </div>
            <div className="text-[10px] text-[#F5F5F0]/60">
              Continuous Patrol Rate: <strong className="text-white">{selectedHotspot.patrolHoursPerWeek} hrs/week</strong> (Audited {selectedHotspot.lastUpdated})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
