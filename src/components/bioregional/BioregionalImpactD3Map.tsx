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
  Maximize2
} from 'lucide-react';
import { DataProvenance } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

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
}

export const BioregionalImpactD3Map: React.FC<BioregionalImpactD3MapProps> = ({
  onInspectProvenance,
  onSelectBioregion
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

  }, [filteredPoints, selectedPoint, onSelectBioregion]);

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
