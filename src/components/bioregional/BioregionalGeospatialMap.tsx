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
  ShieldCheck,
  Info,
  CheckCircle2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

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

const RESTORATION_PROJECTS: RestorationProject[] = [
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

interface BioregionalGeospatialMapProps {
  selectedBioregionId?: string;
  onSelectProject?: (project: RestorationProject) => void;
}

export const BioregionalGeospatialMap: React.FC<BioregionalGeospatialMapProps> = ({
  selectedBioregionId,
  onSelectProject
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<RestorationProject | null>(RESTORATION_PROJECTS[0]);
  const [hoveredProject, setHoveredProject] = useState<RestorationProject | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

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
        .text(`${x.toFixed(1)}°E`);
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
        .attr('x', 25)
        .attr('y', yScale(y) + 3)
        .attr('fill', '#666666')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .text(`${Math.abs(y).toFixed(1)}°S`);
    });

    // 2. Elevation & Watershed Topography Contours (D3 smooth curved paths)
    if (activeLayer.contours) {
      const contourG = g.append('g').attr('class', 'topography-contours');

      // Aberdare Highlands Bioregional Contour
      const aberdareContour = [
        [36.45, -0.25], [36.75, -0.30], [36.85, -0.55], [36.72, -0.75],
        [36.50, -0.70], [36.38, -0.45], [36.45, -0.25]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      const lineGen = d3.line().curve(d3.curveCatmullRomClosed);

      contourG.append('path')
        .attr('d', lineGen(aberdareContour))
        .attr('fill', 'rgba(16, 185, 129, 0.08)')
        .attr('stroke', 'rgba(16, 185, 129, 0.35)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 2');

      // Mara Watershed Basin Contour
      const maraContour = [
        [34.90, -1.20], [35.40, -1.30], [35.60, -1.65], [35.10, -1.68],
        [34.85, -1.45], [34.90, -1.20]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      contourG.append('path')
        .attr('d', lineGen(maraContour))
        .attr('fill', 'rgba(197, 160, 89, 0.06)')
        .attr('stroke', 'rgba(197, 160, 89, 0.3)')
        .attr('stroke-width', 1.2);

      // Labels for Bioregional Zones
      contourG.append('text')
        .attr('x', xScale(36.65))
        .attr('y', yScale(-0.50))
        .attr('fill', '#10B981')
        .attr('font-size', '10px')
        .attr('font-family', 'serif')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.8)
        .text('Aberdare Cloud Forest Core');

      contourG.append('text')
        .attr('x', xScale(35.25))
        .attr('y', yScale(-1.48))
        .attr('fill', '#C5A059')
        .attr('font-size', '10px')
        .attr('font-family', 'serif')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.8)
        .text('Mara River Catchment Basin');
    }

    // 3. Hydrological Corridors (Rivers & Riparian Arteries)
    if (activeLayer.rivers) {
      const riversG = g.append('g').attr('class', 'river-corridors');

      // Mara River Mainstream
      const maraRiver = [
        [35.60, -1.05], [35.45, -1.20], [35.32, -1.35], [35.15, -1.52], [34.95, -1.60]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      const riverLine = d3.line().curve(d3.curveBasis);

      riversG.append('path')
        .attr('d', riverLine(maraRiver))
        .attr('fill', 'none')
        .attr('stroke', '#06B6D4')
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.8);

      // Mathare & Nairobi River Tributary
      const mathareRiver = [
        [36.70, -1.15], [36.78, -1.22], [36.85, -1.26], [36.98, -1.28], [37.15, -1.22]
      ].map(([lng, lat]) => [xScale(lng), yScale(lat)] as [number, number]);

      riversG.append('path')
        .attr('d', riverLine(mathareRiver))
        .attr('fill', 'none')
        .attr('stroke', '#38BDF8')
        .attr('stroke-width', 2.0)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.85);

      // River label
      riversG.append('text')
        .attr('x', xScale(35.25))
        .attr('y', yScale(-1.38))
        .attr('fill', '#06B6D4')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('letter-spacing', '1px')
        .text('MARA RIVER VASCULAR CORRIDOR');
    }

    // 4. Active Sensor Mesh Beacons (D3 pulsing circles)
    if (activeLayer.sensors) {
      const sensorsG = g.append('g').attr('class', 'sensor-mesh-nodes');

      RESTORATION_PROJECTS.forEach(proj => {
        const cx = xScale(proj.lng);
        const cy = yScale(proj.lat);

        // Outer pulsing ring
        sensorsG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 12)
          .attr('fill', 'none')
          .attr('stroke', '#10B981')
          .attr('stroke-width', 1)
          .attr('opacity', 0.5)
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

  }, [filteredProjects, activeLayer, zoomLevel, selectedProject]);

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
              D3 GEOSPATIAL MAP OVERLAY • BIOREGIONAL RESTORATION CORRIDORS
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40">
              D3 Vector Engine Active
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Ecological Restoration Project Atlas
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Vectorized D3 cartographic projection displaying active watershed corridors, reforestation sectors, and in-situ IoT telemetry nodes mapped across East African bioregional coordinates.
          </p>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
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

      {/* Layer Toggles & Category Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-3 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono">
        {/* Layer Switches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#C5A059]" />
            Active Layers:
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
          <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold">Category:</span>
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

      {/* SVG Canvas Map Stage */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-sm border border-[#C5A059]/30 bg-[#070A08] overflow-hidden shadow-2xl"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 860 480"
          className="w-full h-auto block select-none"
          style={{ minHeight: '340px' }}
        />

        {/* Floating Tooltip during hover */}
        {hoveredProject && (
          <div 
            className="absolute top-4 left-4 z-20 bg-black/90 border border-[#C5A059] p-3 rounded-sm shadow-2xl backdrop-blur-md max-w-xs font-mono text-xs pointer-events-none space-y-1"
          >
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
            <span className="w-3 h-0.5 bg-[#06B6D4]" />
            <span>Riparian River Artery</span>
          </div>
          <div className="flex items-center gap-2 text-[#F5F5F0]/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Pulsing IoT Sentinel Probe</span>
          </div>
        </div>
      </div>

      {/* Selected Project Detailed Inspector Card */}
      {selectedProject && (
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
