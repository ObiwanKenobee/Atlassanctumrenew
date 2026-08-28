import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  MapPin,
  Compass,
  Layers,
  Activity,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  TreePine,
  Droplets,
  Bird,
  ShieldCheck,
  Info,
  CheckCircle2,
  Filter,
  Eye,
  EyeOff,
  Sliders,
  ArrowUpRight,
  X,
  Building2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface ThematicLayerState {
  hydrological: boolean;
  reforestation: boolean;
  urbanGreening: boolean;
}

export interface RestorationProject {
  id: string;
  name: string;
  bioregion: string;
  category: 'riparian' | 'reforestation' | 'aquifer' | 'soil_moisture' | 'biodiversity';
  lat: number;
  lng: number;
  hectares: number;
  progressPercent: number;
  status: 'Active Planting' | 'Canopy Established' | 'Active Regeneration' | 'Piezometric Recovery';
  stewardCouncil: string;
  activeSensorNode: string;
  keyMetric: string;
  description: string;
}

export interface FieldEvidenceMarker {
  id: string;
  title: string;
  category: 'Flora' | 'Fauna' | 'Hydrology' | 'Soil';
  lat: number;
  lng: number;
  locationName: string;
  metricObserved: string;
  timestamp: string;
  hash: string;
  verifiedBy: string;
  status: 'In-Situ Verified' | 'Telemetry Active' | 'Audit Complete';
  photoUrl?: string;
  notes?: string;
}

export const RESTORATION_PROJECTS: RestorationProject[] = [
  {
    id: 'proj-01',
    name: 'Aberdare Cloud Forest Indigenous Canopy Restoration',
    bioregion: 'Aberdare Range',
    category: 'reforestation',
    lat: -0.4218,
    lng: 36.6894,
    hectares: 850,
    progressPercent: 88,
    status: 'Canopy Established',
    stewardCouncil: 'Aberdare Forest Indigenous Guardians',
    activeSensorNode: 'Node #AB-01 (Canopy NDVI)',
    keyMetric: '+14.2% Crown Cover • 1,420 tCO2e/yr',
    description: 'Multi-strata reforestation restoring native Podocarpus and Hagenia tree species across high-altitude cloud forest ridges.'
  },
  {
    id: 'proj-02',
    name: 'Mathare River Riparian Bio-Swale & Silt Trap Mesh',
    bioregion: 'Mathare River Catchment',
    category: 'riparian',
    lat: -1.2584,
    lng: 36.8523,
    hectares: 140,
    progressPercent: 74,
    status: 'Active Planting',
    stewardCouncil: 'Nairobi Water Basin Coalition',
    activeSensorNode: 'Node #NBO-MAT-04 (Turbidity/pH)',
    keyMetric: '-72% Silt Runoff • 6.4 mg/L Dissolved O2',
    description: 'Bio-engineered vetiver grass swales and riparian pocket wetlands buffering urban storm runoff into the Nairobi River basin.'
  },
  {
    id: 'proj-03',
    name: 'Mara Basin Keyline Hydrology & Silvopasture Sponge',
    bioregion: 'Mara Watershed',
    category: 'soil_moisture',
    lat: -1.5021,
    lng: 35.1432,
    hectares: 2400,
    progressPercent: 65,
    status: 'Active Regeneration',
    stewardCouncil: 'Maasai Mara Pastoralist Council',
    activeSensorNode: 'Node #MR-12 (Soil Moisture Profile)',
    keyMetric: '3.4% Soil Organic Matter • +2.1 bar Water Table',
    description: 'Landscape-scale keyline water retention swales and rotational silvopasture transforming compacted grazing land into an ecological sponge.'
  },
  {
    id: 'proj-04',
    name: 'Kikuyu Escarpment Wildlife & Pollinator Flyway',
    bioregion: 'Rift Valley Escarpment',
    category: 'biodiversity',
    lat: -0.9852,
    lng: 36.6120,
    hectares: 480,
    progressPercent: 81,
    status: 'Active Planting',
    stewardCouncil: 'Escarpment Biodiversity Initiative',
    activeSensorNode: 'Node #KE-08 (Acoustic Bio-Richness)',
    keyMetric: '142 Native Bird Species • 38 Wild Pollinators',
    description: 'Continuous native floral corridor connecting the highland cloud forest to the Great Rift Valley basin.'
  },
  {
    id: 'proj-05',
    name: 'Lake Naivasha Subterranean Aquifer Infiltration Zone',
    bioregion: 'Naivasha Basin',
    category: 'aquifer',
    lat: -0.7185,
    lng: 36.4312,
    hectares: 620,
    progressPercent: 70,
    status: 'Piezometric Recovery',
    stewardCouncil: 'Rift Valley Groundwater Directorate',
    activeSensorNode: 'Node #NV-03 (Piezometer Depth)',
    keyMetric: '+1.82 bar Piezometric Head Recovery',
    description: 'Permeable gravel retention basins and subsurface infiltration galleries recharging the depressed volcanic aquifer.'
  }
];

export const DEFAULT_FIELD_EVIDENCE_MARKERS: FieldEvidenceMarker[] = [
  {
    id: 'ev-fl-01',
    title: 'Podocarpus & Hagenia Climax Canopy Sector #14',
    category: 'Flora',
    lat: -0.4450,
    lng: 36.7120,
    locationName: 'Aberdare Cloud Forest Ridge',
    metricObserved: 'NDVI +0.76 • 92% Crown Canopy Volume',
    timestamp: 'Aug 26, 2026, 09:15 AM',
    hash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    verifiedBy: 'Aberdare Rangers & Drone Lidar',
    status: 'In-Situ Verified',
    photoUrl: '/src/assets/images/canopy_pulse_health_1787771045697.jpg',
    notes: 'Multi-strata canopy volume verified by drone lidar transect.'
  },
  {
    id: 'ev-fl-02',
    title: 'Indigenous Mountain Bamboo Migration Belt #03',
    category: 'Flora',
    lat: -0.5820,
    lng: 36.6540,
    locationName: 'Aberdare Highland Alpine Gap',
    metricObserved: 'Bamboo Culm Growth: 14cm/day • Bio-corridor Intact',
    timestamp: 'Aug 25, 2026, 02:40 PM',
    hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    verifiedBy: 'Bamboo Agroecology Stewardship Guild',
    status: 'In-Situ Verified',
    photoUrl: '/src/assets/images/canopy_pulse_health_1787771045697.jpg',
    notes: 'Dense high-altitude bamboo culms providing continuous foraging shelter.'
  },
  {
    id: 'ev-fa-01',
    title: 'Mountain Bongo Nocturnal Camera Trap #07',
    category: 'Fauna',
    lat: -0.4900,
    lng: 36.7400,
    locationName: 'Aberdare Escarpment Sanctuary',
    metricObserved: '12 Unique Sightings • Breeding Pair + Calf Verified',
    timestamp: 'Aug 27, 2026, 04:12 AM',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    verifiedBy: 'Kenya Wildlife Bio-Acoustic Mesh Post',
    status: 'In-Situ Verified',
    notes: 'Acoustic motion-triggered infrared camera captured endemic mountain bongo.'
  },
  {
    id: 'ev-fa-02',
    title: "Abbott's Starling Acoustic Bio-Diversity Sentinel",
    category: 'Fauna',
    lat: -0.3800,
    lng: 36.6200,
    locationName: 'Upper Aberdare Cloud Mist Ridge',
    metricObserved: 'ACI Index 0.88 • 34 Confirmed Nesting Pairs',
    timestamp: 'Aug 27, 2026, 06:30 AM',
    hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    verifiedBy: 'Avian Acoustic Autonomous Sentinel',
    status: 'Telemetry Active',
    notes: 'Continuous 24-hr bio-acoustic monitoring array identifying avian calls.'
  },
  {
    id: 'ev-fa-03',
    title: 'Wild Stingless Bee (Meliponula) Hive Colony Mesh',
    category: 'Fauna',
    lat: -0.9852,
    lng: 36.6120,
    locationName: 'Kikuyu Escarpment Pollinator Flyway',
    metricObserved: '38 Wild Apiary Nodes • 420 Hz Wingbeat Telemetry',
    timestamp: 'Aug 26, 2026, 11:45 AM',
    hash: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    verifiedBy: 'Escarpment Indigenous Apiary Guild',
    status: 'In-Situ Verified',
    notes: 'Critical wild pollinator activity sustaining endemic Podocarpus blossoms.'
  },
  {
    id: 'ev-hy-01',
    title: 'Mathare Riparian Bio-Swale Silt Infiltration Gauge',
    category: 'Hydrology',
    lat: -1.2584,
    lng: 36.8523,
    locationName: 'Mathare River Urban Catchment Sector 4',
    metricObserved: 'Turbidity -72% Silt Washout • Dissolved O2 6.8 mg/L',
    timestamp: 'Aug 27, 2026, 08:00 AM',
    hash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    verifiedBy: 'Nairobi Water Basin Coalition & City Council',
    status: 'In-Situ Verified',
    photoUrl: '/src/assets/images/hydrology_flow_health_1787771061356.jpg',
    notes: 'Bio-engineered vetiver swales filtering urban stormwater effluent.'
  },
  {
    id: 'ev-hy-02',
    title: 'Naivasha Volcanic Aquifer Deep Infiltration Piezometer',
    category: 'Hydrology',
    lat: -0.7185,
    lng: 36.4312,
    locationName: 'Lake Naivasha Subterranean Recharge Zone',
    metricObserved: '+1.82 bar Piezometric Head Recovery • 42m Depth',
    timestamp: 'Aug 26, 2026, 05:20 PM',
    hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    verifiedBy: 'Rift Valley Groundwater Directorate Node #NV-03',
    status: 'Telemetry Active',
    photoUrl: '/src/assets/images/hydrology_flow_health_1787771061356.jpg',
    notes: 'Direct pressure transducer measuring deep volcanic aquifer groundwater recharge.'
  },
  {
    id: 'ev-hy-03',
    title: 'Mara River Headwaters Riparian Vegetation Buffer',
    category: 'Hydrology',
    lat: -1.5021,
    lng: 35.1432,
    locationName: 'Mara Basin Upper Wetlands',
    metricObserved: 'Riparian vegetative buffer 94% continuous • Flow 14.8 m³/s',
    timestamp: 'Aug 25, 2026, 03:15 PM',
    hash: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
    verifiedBy: 'Mara River Water Resource Users Association',
    status: 'In-Situ Verified',
    photoUrl: '/src/assets/images/hydrology_flow_health_1787771061356.jpg',
    notes: 'Keyline retention ditches capturing sediment before river mainstream.'
  },
  {
    id: 'ev-so-01',
    title: 'Mycorrhizal Soil Infiltration & Glomalin Core #18',
    category: 'Soil',
    lat: -1.1892,
    lng: 36.7821,
    locationName: 'East African Agroforestry Pilot Plot 12',
    metricObserved: 'Soil Organic Matter 4.8% • Glomalin 18.2 mg/g',
    timestamp: 'Aug 26, 2026, 11:20 AM',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    verifiedBy: 'Agroforestry Biophysical Soil Lab',
    status: 'In-Situ Verified',
    photoUrl: '/src/assets/images/soil_microbiome_health_1787771074165.jpg',
    notes: 'Deep in-situ soil coring assay confirming rapid mycorrhizal root stabilization.'
  }
];

export interface BioregionalGeospatialMapProps {
  selectedBioregionId?: string;
  onSelectProject?: (project: RestorationProject) => void;
  activeEvidenceCategories?: string[]; // categories like ['Flora', 'Fauna', 'Hydrology', 'Soil']
  onToggleEvidenceCategory?: (category: string) => void;
  selectedEvidence?: FieldEvidenceMarker | null;
  onSelectEvidence?: (evidence: FieldEvidenceMarker | null) => void;
  showFilteringSidebar?: boolean;
  onToggleSidebar?: () => void;
  thematicLayers?: ThematicLayerState;
  onToggleThematicLayer?: (layer: keyof ThematicLayerState) => void;
}

export const BioregionalGeospatialMap: React.FC<BioregionalGeospatialMapProps> = ({
  selectedBioregionId,
  onSelectProject,
  activeEvidenceCategories: externalCategories,
  onToggleEvidenceCategory: externalToggleCategory,
  selectedEvidence: externalSelectedEvidence,
  onSelectEvidence: externalOnSelectEvidence,
  showFilteringSidebar = true,
  onToggleSidebar,
  thematicLayers: externalThematicLayers,
  onToggleThematicLayer: externalToggleThematicLayer
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Thematic Data Layers Control State ('Hydrological', 'Reforestation', 'Urban Greening')
  const [internalThematicLayers, setInternalThematicLayers] = useState<ThematicLayerState>({
    hydrological: true,
    reforestation: true,
    urbanGreening: true
  });

  const thematicLayers = externalThematicLayers ?? internalThematicLayers;

  const toggleThematicLayer = (layer: keyof ThematicLayerState) => {
    if (externalToggleThematicLayer) {
      externalToggleThematicLayer(layer);
    } else {
      setInternalThematicLayers(prev => ({
        ...prev,
        [layer]: !prev[layer]
      }));
    }
    audioFeedback.playMicroTick();
  };

  // Internal layer switches for background map cartography
  const [activeLayer, setActiveLayer] = useState<{
    rivers: boolean;
    contours: boolean;
    sensors: boolean;
    projects: boolean;
  }>({
    rivers: true,
    contours: true,
    sensors: true,
    projects: true
  });

  // Category filter for restoration projects
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<RestorationProject | null>(RESTORATION_PROJECTS[0]);
  const [hoveredProject, setHoveredProject] = useState<RestorationProject | null>(null);
  
  // Field Evidence local state (if not controlled externally)
  const [internalCategories, setInternalCategories] = useState<string[]>(['Flora', 'Fauna', 'Hydrology', 'Soil']);
  const [internalSelectedEvidence, setInternalSelectedEvidence] = useState<FieldEvidenceMarker | null>(null);
  const [hoveredEvidence, setHoveredEvidence] = useState<FieldEvidenceMarker | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeCategories = externalCategories ?? internalCategories;
  const selectedEvidence = externalSelectedEvidence !== undefined ? externalSelectedEvidence : internalSelectedEvidence;

  const toggleCategory = (cat: string) => {
    if (externalToggleCategory) {
      externalToggleCategory(cat);
    } else {
      setInternalCategories(prev =>
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
    }
    audioFeedback.playMicroTick();
  };

  const handleSelectEvidence = (ev: FieldEvidenceMarker | null) => {
    if (externalOnSelectEvidence) {
      externalOnSelectEvidence(ev);
    } else {
      setInternalSelectedEvidence(ev);
    }
    if (ev) {
      setSelectedProject(null); // Clear selected project to focus evidence
    }
    audioFeedback.playMicroTick();
  };

  // Dimension coordinates bounds for the East Africa Bioregional transect
  const MAP_BOUNDS = {
    minLng: 34.8,
    maxLng: 37.2,
    minLat: -1.7,
    maxLat: -0.2
  };

  const filteredProjects = useMemo(() => {
    if (categoryFilter === 'all') return RESTORATION_PROJECTS;
    return RESTORATION_PROJECTS.filter(p => p.category === categoryFilter);
  }, [categoryFilter]);

  const visibleEvidenceMarkers = useMemo(() => {
    return DEFAULT_FIELD_EVIDENCE_MARKERS.filter(m => activeCategories.includes(m.category));
  }, [activeCategories]);

  // Render D3 Map Elements
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = 860;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // D3 Projections / Scales
    const xScale = d3.scaleLinear()
      .domain([MAP_BOUNDS.minLng, MAP_BOUNDS.maxLng])
      .range([60, width - 60]);

    const yScale = d3.scaleLinear()
      .domain([MAP_BOUNDS.minLat, MAP_BOUNDS.maxLat])
      .range([height - 50, 40]);

    const g = svg.append('g')
      .attr('class', 'map-viewport')
      .attr('transform', `scale(${zoomLevel}) translate(${(1 - zoomLevel) * width / 2}, ${(1 - zoomLevel) * height / 2})`);

    // 1. Grid & Coordinates Layer
    const gridG = g.append('g').attr('class', 'cartographic-grid');
    const xTicks = [35.0, 35.5, 36.0, 36.5, 37.0];
    const yTicks = [-1.5, -1.2, -0.9, -0.6, -0.3];

    xTicks.forEach(x => {
      gridG.append('line')
        .attr('x1', xScale(x))
        .attr('y1', 30)
        .attr('x2', xScale(x))
        .attr('y2', height - 30)
        .attr('stroke', '#262626')
        .attr('stroke-width', 0.7)
        .attr('stroke-dasharray', '3 3');

      gridG.append('text')
        .attr('x', xScale(x))
        .attr('y', height - 15)
        .attr('fill', '#666666')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .text(`${x.toFixed(1)}° E`);
    });

    yTicks.forEach(y => {
      gridG.append('line')
        .attr('x1', 40)
        .attr('y1', yScale(y))
        .attr('x2', width - 40)
        .attr('y2', yScale(y))
        .attr('stroke', '#262626')
        .attr('stroke-width', 0.7)
        .attr('stroke-dasharray', '3 3');

      gridG.append('text')
        .attr('x', 45)
        .attr('y', yScale(y) - 4)
        .attr('fill', '#666666')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`${Math.abs(y).toFixed(1)}° S`);
    });

    // 2. Watershed Topographic Elevation Contours (Base Geomorphology)
    if (activeLayer.contours) {
      const contoursG = g.append('g').attr('class', 'topographic-contours');

      // Maasai Mara Savanna & Silvopasture Transect
      const maraContour = [
        [34.90, -1.25], [35.40, -1.20], [35.50, -1.65], [34.95, -1.68]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      const lineGen = d3.line().curve(d3.curveCatmullRomClosed);

      contoursG.append('path')
        .attr('d', lineGen(maraContour))
        .attr('fill', '#C5A059')
        .attr('fill-opacity', 0.07)
        .attr('stroke', '#C5A059')
        .attr('stroke-width', 1.0)
        .attr('stroke-dasharray', '3 3');

      contoursG.append('text')
        .attr('x', xScale(35.05))
        .attr('y', yScale(-1.42))
        .attr('fill', '#C5A059')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('opacity', 0.6)
        .text('MARA BASIN SILVOPASTURE SPONGE');
    }

    // 3. THEMATIC DATA LAYER: Hydrological (Rivers, Aquifers, Piezometers & Riparian Arteries)
    if (thematicLayers.hydrological && activeLayer.rivers) {
      const hydroG = g.append('g').attr('class', 'thematic-data-layer-hydrological');

      // Mara River Mainstream Corridor
      const maraRiver = [
        [35.60, -1.05], [35.45, -1.20], [35.32, -1.35], [35.15, -1.52], [34.95, -1.60]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      const riverLine = d3.line().curve(d3.curveBasis);

      // River shadow/glow
      hydroG.append('path')
        .attr('d', riverLine(maraRiver))
        .attr('fill', 'none')
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 4)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.25);

      // Main river path
      hydroG.append('path')
        .attr('d', riverLine(maraRiver))
        .attr('fill', 'none')
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.9);

      // Mathare & Nairobi River Riparian Tributary
      const mathareRiver = [
        [36.70, -1.15], [36.78, -1.22], [36.85, -1.26], [36.98, -1.28], [37.15, -1.22]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      hydroG.append('path')
        .attr('d', riverLine(mathareRiver))
        .attr('fill', 'none')
        .attr('stroke', '#38BDF8')
        .attr('stroke-width', 2.0)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.85);

      // Lake Naivasha Basin Volcanic Aquifer Deep Infiltration Depression
      const naivashaContour = [
        [36.30, -0.65], [36.48, -0.68], [36.52, -0.82], [36.35, -0.85]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      const closedLineGen = d3.line().curve(d3.curveCatmullRomClosed);

      hydroG.append('path')
        .attr('d', closedLineGen(naivashaContour))
        .attr('fill', '#06B6D4')
        .attr('fill-opacity', 0.16)
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 2');

      hydroG.append('text')
        .attr('x', xScale(36.32))
        .attr('y', yScale(-0.87))
        .attr('fill', '#06B6D4')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('💧 NAIVASHA VOLCANIC AQUIFER RECHARGE DEPRESSION');

      // Subterranean Piezometric Infiltration Nodes
      const piezometerLocations = [
        { lng: 36.42, lat: -0.75, label: 'Piezometer Alpha (+1.82 bar)' },
        { lng: 35.35, lat: -1.32, label: 'Mara Alluvial Hydrology Node' },
        { lng: 36.88, lat: -1.25, label: 'Mathare Riparian Piezometer' }
      ];

      piezometerLocations.forEach(node => {
        const cx = xScale(node.lng);
        const cy = yScale(node.lat);

        // Pulsing water ripple
        hydroG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', '#06B6D4')
          .attr('stroke-width', 1.2)
          .attr('opacity', 0.8)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '4;18;4')
          .attr('dur', '2.8s')
          .attr('repeatCount', 'indefinite');

        hydroG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 3)
          .attr('fill', '#06B6D4');

        hydroG.append('text')
          .attr('x', cx + 8)
          .attr('y', cy - 5)
          .attr('fill', '#38BDF8')
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .text(node.label);
      });

      // River label
      hydroG.append('text')
        .attr('x', xScale(35.25))
        .attr('y', yScale(-1.38))
        .attr('fill', '#06B6D4')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('letter-spacing', '1px')
        .text('MARA RIVER VASCULAR CORRIDOR');
    }

    // 4. THEMATIC DATA LAYER: Reforestation (Cloud Forest Canopy, Bamboo Belt & Indigenous Podocarpus)
    if (thematicLayers.reforestation) {
      const reforestG = g.append('g').attr('class', 'thematic-data-layer-reforestation');

      const closedLineGen = d3.line().curve(d3.curveCatmullRomClosed);

      // Aberdare Highland Range (Elevated Cloud Forest Ridge Zone)
      const aberdareContour = [
        [36.50, -0.25], [36.75, -0.30], [36.85, -0.55], [36.80, -0.80], [36.60, -0.75], [36.45, -0.45]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      reforestG.append('path')
        .attr('d', closedLineGen(aberdareContour))
        .attr('fill', '#10B981')
        .attr('fill-opacity', 0.14)
        .attr('stroke', '#10B981')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '5 3');

      reforestG.append('text')
        .attr('x', xScale(36.52))
        .attr('y', yScale(-0.48))
        .attr('fill', '#34D399')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('🌲 ABERDARE CLOUD FOREST CANOPY (78% VERIFIED)');

      // Mountain Bamboo Migration Corridor Belt (Connecting High Ridge to Valley Gap)
      const bambooCorridor = [
        [36.65, -0.35], [36.80, -0.40], [36.90, -0.45], [36.78, -0.52], [36.60, -0.42]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      reforestG.append('path')
        .attr('d', closedLineGen(bambooCorridor))
        .attr('fill', '#059669')
        .attr('fill-opacity', 0.2)
        .attr('stroke', '#34D399')
        .attr('stroke-width', 1.2);

      reforestG.append('text')
        .attr('x', xScale(36.70))
        .attr('y', yScale(-0.38))
        .attr('fill', '#A7F3D0')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .text('BAMBOO MIGRATION BELT');

      // Climax Podocarpus & Hagenia Sector Markers
      const treePins = [
        { lng: 36.68, lat: -0.62, label: 'Podocarpus Climax Ridge (94% Crown)' },
        { lng: 36.58, lat: -0.38, label: 'Highland Cloud Nursery Transect' }
      ];

      treePins.forEach(pin => {
        const px = xScale(pin.lng);
        const py = yScale(pin.lat);

        reforestG.append('circle')
          .attr('cx', px)
          .attr('cy', py)
          .attr('r', 4.5)
          .attr('fill', '#10B981')
          .attr('stroke', '#D1FAE5')
          .attr('stroke-width', 1);

        reforestG.append('text')
          .attr('x', px + 7)
          .attr('y', py + 3)
          .attr('fill', '#6EE7B7')
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .text(`🌲 ${pin.label}`);
      });
    }

    // 5. THEMATIC DATA LAYER: Urban Greening (Pocket Wetlands, Vetiver Silt Traps & Cooling Corridors)
    if (thematicLayers.urbanGreening) {
      const urbanG = g.append('g').attr('class', 'thematic-data-layer-urban-greening');

      const closedLineGen = d3.line().curve(d3.curveCatmullRomClosed);

      // Mathare & Nairobi Urban Pocket Wetlands Polygon
      const pocketWetlands = [
        [36.82, -1.24], [36.90, -1.23], [36.92, -1.28], [36.84, -1.29]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      urbanG.append('path')
        .attr('d', closedLineGen(pocketWetlands))
        .attr('fill', '#84CC16')
        .attr('fill-opacity', 0.22)
        .attr('stroke', '#A3E635')
        .attr('stroke-width', 1.5);

      urbanG.append('text')
        .attr('x', xScale(36.83))
        .attr('y', yScale(-1.22))
        .attr('fill', '#BEF264')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('🏙️ MATHARE URBAN POCKET WETLANDS');

      // Vetiver Grass Silt-Trap Riverbank Buffer Strips
      const vetiverLine = [
        [36.80, -1.25], [36.87, -1.27], [36.95, -1.28]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      const vGen = d3.line().curve(d3.curveLinear);

      urbanG.append('path')
        .attr('d', vGen(vetiverLine))
        .attr('fill', 'none')
        .attr('stroke', '#EAB308')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '3 2');

      urbanG.append('text')
        .attr('x', xScale(36.81))
        .attr('y', yScale(-1.31))
        .attr('fill', '#FDE047')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .text('VETIVER SILT TRAP BUFFER (-68% SEDIMENT)');

      // Urban Heat Island Cooling Corridor
      const coolingLine = [
        [36.78, -1.29], [36.86, -1.30], [36.93, -1.31]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      urbanG.append('path')
        .attr('d', vGen(coolingLine))
        .attr('fill', 'none')
        .attr('stroke', '#84CC16')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '2 4');

      urbanG.append('text')
        .attr('x', xScale(36.80))
        .attr('y', yScale(-1.33))
        .attr('fill', '#A3E635')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .text('URBAN COOLING CANOPY TRANSECT (-2.8°C)');
    }

    // 4. Active Sensor Mesh Beacons (D3 pulsing circles)
    if (activeLayer.sensors) {
      const sensorsG = g.append('g').attr('class', 'sensor-mesh-nodes');

      RESTORATION_PROJECTS.forEach(proj => {
        const cx = xScale(proj.lng);
        const cy = yScale(proj.lat);

        sensorsG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 12)
          .attr('fill', 'none')
          .attr('stroke', '#10B981')
          .attr('stroke-width', 1)
          .attr('opacity', 0.4)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '6;16;6')
          .attr('dur', '3s')
          .attr('repeatCount', 'indefinite');

        sensorsG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 3)
          .attr('fill', '#10B981');
      });
    }

    // 5. Ecological Restoration Project Pins Layer
    if (activeLayer.projects) {
      const projectsG = g.append('g').attr('class', 'project-pins');

      filteredProjects.forEach(proj => {
        const px = xScale(proj.lng);
        const py = yScale(proj.lat);
        const isSelected = selectedProject?.id === proj.id;

        const pinGroup = projectsG.append('g')
          .attr('class', 'project-node cursor-pointer')
          .attr('transform', `translate(${px}, ${py})`)
          .on('click', () => {
            setSelectedProject(proj);
            handleSelectEvidence(null); // Deselect evidence when selecting project
            if (onSelectProject) onSelectProject(proj);
            audioFeedback.playMicroTick();
          })
          .on('mouseenter', () => {
            setHoveredProject(proj);
          })
          .on('mouseleave', () => {
            setHoveredProject(null);
          });

        // Pin backing badge
        pinGroup.append('circle')
          .attr('r', isSelected ? 11 : 8)
          .attr('fill', isSelected ? '#C5A059' : '#0D0D0D')
          .attr('stroke', isSelected ? '#FFFFFF' : '#C5A059')
          .attr('stroke-width', isSelected ? 2.5 : 1.5)
          .attr('filter', isSelected ? 'drop-shadow(0 0 6px rgba(197, 160, 89, 0.8))' : 'none');

        // Pin central core
        pinGroup.append('circle')
          .attr('r', 3.5)
          .attr('fill', isSelected ? '#000000' : '#10B981');

        // Short Project Code Tag
        pinGroup.append('text')
          .attr('x', 14)
          .attr('y', 4)
          .attr('fill', isSelected ? '#C5A059' : '#F5F5F0')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .attr('font-weight', isSelected ? 'bold' : 'normal')
          .text(proj.name.split(' ')[0] + ' (' + proj.hectares + 'ha)');
      });
    }

    // 6. FIELD EVIDENCE MARKERS (Flora, Fauna, Hydrology, Soil)
    const evidenceG = g.append('g').attr('class', 'field-evidence-markers');

    visibleEvidenceMarkers.forEach(ev => {
      const ex = xScale(ev.lng);
      const ey = yScale(ev.lat);
      const isSelected = selectedEvidence?.id === ev.id;

      // Color mapping by category
      let categoryColor = '#10B981'; // Flora
      let categoryBg = '#064E3B';
      if (ev.category === 'Fauna') {
        categoryColor = '#F59E0B'; // Amber
        categoryBg = '#78350F';
      } else if (ev.category === 'Hydrology') {
        categoryColor = '#06B6D4'; // Cyan
        categoryBg = '#164E63';
      } else if (ev.category === 'Soil') {
        categoryColor = '#D97706'; // Orange
        categoryBg = '#451A03';
      }

      const evNode = evidenceG.append('g')
        .attr('class', 'evidence-node cursor-pointer')
        .attr('transform', `translate(${ex}, ${ey})`)
        .on('click', (e) => {
          e.stopPropagation();
          handleSelectEvidence(ev);
        })
        .on('mouseenter', () => {
          setHoveredEvidence(ev);
        })
        .on('mouseleave', () => {
          setHoveredEvidence(null);
        });

      // Outer active ring if selected
      if (isSelected) {
        evNode.append('circle')
          .attr('r', 16)
          .attr('fill', 'none')
          .attr('stroke', categoryColor)
          .attr('stroke-width', 1.8)
          .attr('stroke-dasharray', '3 2')
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '14;20;14')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      // Diamond or Hexagon Badge
      evNode.append('polygon')
        .attr('points', '0,-9 9,0 0,9 -9,0')
        .attr('fill', isSelected ? categoryColor : categoryBg)
        .attr('stroke', isSelected ? '#FFFFFF' : categoryColor)
        .attr('stroke-width', isSelected ? 2.0 : 1.2)
        .attr('filter', isSelected ? 'drop-shadow(0 0 8px ' + categoryColor + ')' : 'none');

      // Center Core Dot
      evNode.append('circle')
        .attr('r', 2.5)
        .attr('fill', isSelected ? '#000000' : '#FFFFFF');

      // Category Tag Pill text
      evNode.append('text')
        .attr('x', 12)
        .attr('y', -4)
        .attr('fill', categoryColor)
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(`[${ev.category.toUpperCase()}]`);

      evNode.append('text')
        .attr('x', 12)
        .attr('y', 6)
        .attr('fill', isSelected ? '#FFFFFF' : '#D4D4D8')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .text(ev.title.length > 20 ? ev.title.slice(0, 18) + '...' : ev.title);
    });

  }, [filteredProjects, visibleEvidenceMarkers, activeLayer, thematicLayers, zoomLevel, selectedProject, selectedEvidence]);

  return (
    <div 
      id="bioregional-geospatial-map" 
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-xl text-[#F5F5F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              D3 GEOSPATIAL MAP OVERLAY • RESTORATION CORRIDORS & FIELD EVIDENCE
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40 font-bold">
              {visibleEvidenceMarkers.length} Evidence Pins Active
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Ecological Restoration Project & Evidence Atlas
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Vectorized D3 cartographic projection displaying active watershed corridors, reforestation sectors, and in-situ IoT telemetry nodes mapped across East African bioregional coordinates.
          </p>
        </div>

        {/* Zoom & Sidebar Toggle Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className={`px-3 py-1.5 border rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              sidebarOpen 
                ? 'bg-[#1F2720] border-[#C5A059] text-[#C5A059] font-bold' 
                : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Toggle Field Evidence Filter Sidebar"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[11px]">{sidebarOpen ? 'Hide Evidence Filter' : 'Filter Evidence'}</span>
          </button>

          <button
            onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.25))}
            className="p-2 bg-[#141414] hover:bg-[#202020] border border-[#F5F5F0]/10 rounded-xs text-[#F5F5F0] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
            className="p-2 bg-[#141414] hover:bg-[#202020] border border-[#F5F5F0]/10 rounded-xs text-[#F5F5F0] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#202020] border border-[#F5F5F0]/10 rounded-xs text-[#F5F5F0]/70 hover:text-[#F5F5F0] transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset Map Scale"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px]">100%</span>
          </button>
        </div>
      </div>

      {/* Dynamic Thematic Data Layers Control Interface ('Hydrological', 'Reforestation', 'Urban Greening') */}
      <div 
        id="thematic-data-layers-control-interface"
        className="p-4 bg-[#141414] border border-[#C5A059]/40 rounded-sm space-y-3 shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold block">
                Thematic Geospatial Data Layers
              </span>
              <span className="text-[10px] text-[#F5F5F0]/50 font-mono">
                Toggle live D3 cartographic projections: Rivers & Aquifers, Cloud Canopies, and Urban Silt Traps
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <button
              onClick={() => {
                setInternalThematicLayers({ hydrological: true, reforestation: true, urbanGreening: true });
                audioFeedback.playMicroTick();
              }}
              className="px-2.5 py-1 bg-[#1F1F1F] hover:bg-[#282828] text-[#F5F5F0]/80 hover:text-white rounded border border-[#F5F5F0]/15 transition-colors cursor-pointer"
            >
              All 3 Layers Active
            </button>
          </div>
        </div>

        {/* 3 Interactive Toggle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Hydrological Layer Toggle */}
          <button
            onClick={() => toggleThematicLayer('hydrological')}
            className={`p-3 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              thematicLayers.hydrological
                ? 'bg-cyan-950/40 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-200'
                : 'bg-[#111111] border-[#F5F5F0]/10 text-[#F5F5F0]/40 hover:text-[#F5F5F0]/70'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${thematicLayers.hydrological ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-[#F5F5F0]/40'}`}>
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-wide">Hydrological</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                thematicLayers.hydrological ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40' : 'bg-black text-white/30'
              }`}>
                {thematicLayers.hydrological ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </div>

            <p className="text-[10px] text-[#F5F5F0]/60 font-sans leading-tight">
              Mara & Mathare River corridors, Naivasha volcanic aquifer depression, and piezometer telemetry.
            </p>

            <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-cyan-500/20 text-cyan-400/80">
              <span>3 Corridors Active</span>
              <span className="underline">Toggle Layer</span>
            </div>
          </button>

          {/* Reforestation Layer Toggle */}
          <button
            onClick={() => toggleThematicLayer('reforestation')}
            className={`p-3 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              thematicLayers.reforestation
                ? 'bg-emerald-950/40 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-emerald-200'
                : 'bg-[#111111] border-[#F5F5F0]/10 text-[#F5F5F0]/40 hover:text-[#F5F5F0]/70'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${thematicLayers.reforestation ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-[#F5F5F0]/40'}`}>
                  <TreePine className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-wide">Reforestation</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                thematicLayers.reforestation ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' : 'bg-black text-white/30'
              }`}>
                {thematicLayers.reforestation ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </div>

            <p className="text-[10px] text-[#F5F5F0]/60 font-sans leading-tight">
              Aberdare Cloud Basin native canopy (78%), Mountain Bamboo migration belt, and Podocarpus climax ridges.
            </p>

            <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-emerald-500/20 text-emerald-400/80">
              <span>Cloud Forest & Belts</span>
              <span className="underline">Toggle Layer</span>
            </div>
          </button>

          {/* Urban Greening Layer Toggle */}
          <button
            onClick={() => toggleThematicLayer('urbanGreening')}
            className={`p-3 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              thematicLayers.urbanGreening
                ? 'bg-lime-950/40 border-lime-500/70 shadow-[0_0_15px_rgba(132,204,22,0.15)] text-lime-200'
                : 'bg-[#111111] border-[#F5F5F0]/10 text-[#F5F5F0]/40 hover:text-[#F5F5F0]/70'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${thematicLayers.urbanGreening ? 'bg-lime-500/20 text-lime-300' : 'bg-white/5 text-[#F5F5F0]/40'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-wide">Urban Greening</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                thematicLayers.urbanGreening ? 'bg-lime-900/60 text-lime-300 border border-lime-500/40' : 'bg-black text-white/30'
              }`}>
                {thematicLayers.urbanGreening ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </div>

            <p className="text-[10px] text-[#F5F5F0]/60 font-sans leading-tight">
              Mathare urban pocket wetlands, vetiver silt-trap bio-swales (-68% sediment), and cooling canopy transects.
            </p>

            <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-lime-500/20 text-lime-400/80">
              <span>Bio-swales & Wet Retention</span>
              <span className="underline">Toggle Layer</span>
            </div>
          </button>
        </div>
      </div>

      {/* Layer Switches & Quick Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-3 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#C5A059]" />
            Cartographic Layers:
          </span>

          <button
            onClick={() => setActiveLayer(prev => ({ ...prev, rivers: !prev.rivers }))}
            className={`px-2.5 py-1 rounded-xs border text-[11px] transition-all cursor-pointer ${
              activeLayer.rivers 
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 font-bold' 
                : 'bg-[#181818] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            Rivers & Corridors
          </button>

          <button
            onClick={() => setActiveLayer(prev => ({ ...prev, contours: !prev.contours }))}
            className={`px-2.5 py-1 rounded-xs border text-[11px] transition-all cursor-pointer ${
              activeLayer.contours 
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold' 
                : 'bg-[#181818] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            Watershed Contours
          </button>

          <button
            onClick={() => setActiveLayer(prev => ({ ...prev, sensors: !prev.sensors }))}
            className={`px-2.5 py-1 rounded-xs border text-[11px] transition-all cursor-pointer ${
              activeLayer.sensors 
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 font-bold' 
                : 'bg-[#181818] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            Telemetry Sentinels
          </button>
        </div>

        {/* Project Type Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold">Project Category:</span>
          {['all', 'riparian', 'reforestation', 'soil_moisture', 'aquifer'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                audioFeedback.playMicroTick();
              }}
              className={`px-2 py-0.5 rounded-xs capitalize text-[10px] transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#1A1A1A] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Filtering Sidebar Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Field Evidence Filtering Sidebar (4 cols on lg, or collapsible) */}
        {sidebarOpen && (
          <div 
            id="field-evidence-filtering-sidebar"
            className="lg:col-span-4 bg-[#111111] border border-[#C5A059]/40 rounded-sm p-4 space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <div className="flex items-center gap-1.5 text-[#C5A059] font-bold">
                <Filter className="w-3.5 h-3.5" />
                <span className="uppercase text-[11px]">Field Evidence Filters</span>
              </div>
              <span className="text-[10px] text-emerald-400">
                {visibleEvidenceMarkers.length}/{DEFAULT_FIELD_EVIDENCE_MARKERS.length} Active
              </span>
            </div>

            {/* Category Toggles (Flora, Fauna, Hydrology, Soil) */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold block">
                Evidence Categories:
              </span>

              {[
                { 
                  id: 'Flora', 
                  label: 'Flora (Canopy & Saplings)', 
                  icon: <TreePine className="w-3.5 h-3.5 text-emerald-400" />,
                  color: 'text-emerald-400',
                  border: 'border-emerald-500/40',
                  count: DEFAULT_FIELD_EVIDENCE_MARKERS.filter(m => m.category === 'Flora').length
                },
                { 
                  id: 'Fauna', 
                  label: 'Fauna (Wildlife & Pollinators)', 
                  icon: <Bird className="w-3.5 h-3.5 text-amber-400" />,
                  color: 'text-amber-400',
                  border: 'border-amber-500/40',
                  count: DEFAULT_FIELD_EVIDENCE_MARKERS.filter(m => m.category === 'Fauna').length
                },
                { 
                  id: 'Hydrology', 
                  label: 'Hydrology (Water & Aquifer)', 
                  icon: <Droplets className="w-3.5 h-3.5 text-cyan-400" />,
                  color: 'text-cyan-400',
                  border: 'border-cyan-500/40',
                  count: DEFAULT_FIELD_EVIDENCE_MARKERS.filter(m => m.category === 'Hydrology').length
                },
                { 
                  id: 'Soil', 
                  label: 'Soil (Mycelium & Carbon)', 
                  icon: <Layers className="w-3.5 h-3.5 text-orange-400" />,
                  color: 'text-orange-400',
                  border: 'border-orange-500/40',
                  count: DEFAULT_FIELD_EVIDENCE_MARKERS.filter(m => m.category === 'Soil').length
                }
              ].map(cat => {
                const isActive = activeCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full p-2 rounded-xs border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#181818] border-[#C5A059] shadow-sm'
                        : 'bg-[#0E0E0E] border-[#F5F5F0]/10 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      <span className={`text-[11px] font-bold ${isActive ? 'text-[#F5F5F0]' : 'text-[#F5F5F0]/50'}`}>
                        {cat.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#C5A059]">({cat.count})</span>
                      {isActive ? (
                        <Eye className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-[#F5F5F0]/40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Filter Selection */}
            <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F0]/10 text-[10px]">
              <button
                onClick={() => {
                  if (externalToggleCategory) {
                    ['Flora', 'Fauna', 'Hydrology', 'Soil'].forEach(c => {
                      if (!activeCategories.includes(c)) externalToggleCategory(c);
                    });
                  } else {
                    setInternalCategories(['Flora', 'Fauna', 'Hydrology', 'Soil']);
                  }
                  audioFeedback.playMicroTick();
                }}
                className="text-[#C5A059] hover:underline cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={() => {
                  if (externalToggleCategory) {
                    activeCategories.forEach(c => externalToggleCategory(c));
                  } else {
                    setInternalCategories([]);
                  }
                  audioFeedback.playMicroTick();
                }}
                className="text-[#F5F5F0]/40 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Scrollable list of matching Evidence markers */}
            <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
              <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold block">
                Active Evidence Pins on Map:
              </span>

              <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[#C5A059]/30">
                {visibleEvidenceMarkers.map(ev => {
                  const isSelected = selectedEvidence?.id === ev.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => handleSelectEvidence(ev)}
                      className={`p-2.5 rounded-xs border cursor-pointer transition-all space-y-1 ${
                        isSelected
                          ? 'bg-[#1C2018] border-[#C5A059] ring-1 ring-[#C5A059]/40'
                          : 'bg-[#141414] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px]">
                        <span className={`font-bold uppercase ${
                          ev.category === 'Flora' ? 'text-emerald-400' :
                          ev.category === 'Fauna' ? 'text-amber-400' :
                          ev.category === 'Hydrology' ? 'text-cyan-400' : 'text-orange-400'
                        }`}>
                          {ev.category} Evidence
                        </span>
                        <span className="text-[#F5F5F0]/40">{ev.status}</span>
                      </div>

                      <h5 className="font-serif font-bold text-[#F5F5F0] text-[11px] line-clamp-1">
                        {ev.title}
                      </h5>

                      <p className="text-[10px] text-emerald-400 truncate">
                        {ev.metricObserved}
                      </p>
                    </div>
                  );
                })}

                {visibleEvidenceMarkers.length === 0 && (
                  <div className="text-center py-6 text-[11px] text-[#F5F5F0]/40 italic">
                    No evidence categories selected. Toggle filters above to visualize markers on D3 map.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SVG Canvas Map Stage (8 or 12 cols) */}
        <div className={`${sidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          <div 
            ref={containerRef}
            className="relative w-full rounded-sm border border-[#C5A059]/30 bg-[#070A08] overflow-hidden shadow-2xl"
          >
            <svg
              ref={svgRef}
              viewBox="0 0 860 480"
              className="w-full h-auto block select-none"
              style={{ minHeight: '380px' }}
            />

            {/* Hover Tooltip */}
            {(hoveredProject || hoveredEvidence) && (
              <div 
                className="absolute top-4 left-4 z-20 bg-black/90 border border-[#C5A059] p-3 rounded-sm shadow-2xl backdrop-blur-md max-w-xs font-mono text-xs pointer-events-none space-y-1"
              >
                {hoveredEvidence ? (
                  <>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#C5A059] font-bold">[{hoveredEvidence.category.toUpperCase()}] FIELD EVIDENCE</span>
                      <span className="text-emerald-400 font-bold">{hoveredEvidence.status}</span>
                    </div>
                    <h4 className="font-serif font-bold text-[#F5F5F0] text-sm">
                      {hoveredEvidence.title}
                    </h4>
                    <p className="text-[11px] text-emerald-300 font-mono">
                      {hoveredEvidence.metricObserved}
                    </p>
                    <div className="text-[9px] text-[#F5F5F0]/50 pt-0.5">
                      GPS: ({hoveredEvidence.lat}°, {hoveredEvidence.lng}°)
                    </div>
                  </>
                ) : hoveredProject ? (
                  <>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#C5A059] font-bold">{hoveredProject.bioregion}</span>
                      <span className="text-emerald-400 font-bold">{hoveredProject.progressPercent}% Complete</span>
                    </div>
                    <h4 className="font-serif font-bold text-[#F5F5F0] text-sm">
                      {hoveredProject.name}
                    </h4>
                    <p className="text-[11px] text-[#F5F5F0]/70 font-sans">
                      {hoveredProject.keyMetric}
                    </p>
                  </>
                ) : null}
              </div>
            )}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-[#F5F5F0]/15 p-2.5 rounded-sm font-mono text-[10px] space-y-1.5 hidden sm:block">
              <div className="text-[9px] uppercase text-[#C5A059] font-bold">Cartographic Legend</div>
              <div className="flex items-center gap-2 text-[#F5F5F0]/80">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] border border-white" />
                <span>Restoration Site Node</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F5F0]/80">
                <span className="w-2.5 h-2.5 rotate-45 bg-emerald-400" />
                <span>Flora Evidence</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F5F0]/80">
                <span className="w-2.5 h-2.5 rotate-45 bg-amber-400" />
                <span>Fauna Evidence</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F5F0]/80">
                <span className="w-2.5 h-2.5 rotate-45 bg-cyan-400" />
                <span>Hydrology Evidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Field Evidence Inspector Card */}
      {selectedEvidence && (
        <div className="p-5 bg-[#121412] border border-emerald-500/60 rounded-sm space-y-4 text-left animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  {selectedEvidence.category} Evidence Marker • Coordinates ({selectedEvidence.lat}°, {selectedEvidence.lng}°)
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full font-bold">
                  {selectedEvidence.status}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0] mt-0.5">
                {selectedEvidence.title}
              </h3>
            </div>

            <button
              onClick={() => handleSelectEvidence(null)}
              className="p-1 text-[#F5F5F0]/40 hover:text-[#F5F5F0] self-start sm:self-center cursor-pointer"
              title="Close Evidence Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
            <div className="p-3 bg-[#181818] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Observed Metric:</span>
              <span className="text-xs font-bold text-emerald-400">{selectedEvidence.metricObserved}</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Verified By:</span>
              <span className="text-xs font-bold text-cyan-300">{selectedEvidence.verifiedBy}</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Cryptographic Hash:</span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/80 truncate block">{selectedEvidence.hash}</span>
            </div>
          </div>

          {selectedEvidence.notes && (
            <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
              {selectedEvidence.notes}
            </p>
          )}

          <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
            <span>Location: {selectedEvidence.locationName}</span>
            <span className="text-[#C5A059]">Timestamp: {selectedEvidence.timestamp}</span>
          </div>
        </div>
      )}

      {/* Selected Project Detailed Inspector Card */}
      {selectedProject && !selectedEvidence && (
        <div className="p-5 bg-[#121212] border border-[#C5A059] rounded-sm space-y-4 text-left animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  {selectedProject.bioregion} • Coordinates ({selectedProject.lat}°, {selectedProject.lng}°)
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full font-bold">
                  {selectedProject.status}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0] mt-0.5">
                {selectedProject.name}
              </h3>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase block">Restoration Progress</span>
              <span className="text-xl font-bold text-emerald-400">{selectedProject.progressPercent}%</span>
            </div>
          </div>

          <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
            {selectedProject.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
            <div className="p-3 bg-[#181818] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Restored Area:</span>
              <span className="text-sm font-bold text-[#F5F5F0]">{selectedProject.hectares.toLocaleString()} Hectares</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">In-Situ IoT Sentinel:</span>
              <span className="text-sm font-bold text-cyan-300">{selectedProject.activeSensorNode}</span>
            </div>

            <div className="p-3 bg-[#181818] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Primary Ecological Yield:</span>
              <span className="text-xs font-bold text-emerald-400">{selectedProject.keyMetric}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
            <span>Stewardship: {selectedProject.stewardCouncil}</span>
            <span className="text-[#C5A059]">Verified by Sentinel-2 Multispectral Calibrated Telemetry</span>
          </div>
        </div>
      )}
    </div>
  );
};
