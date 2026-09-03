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
  Database 
} from 'lucide-react';
import { DataProvenance } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export interface SpatialProject {
  id: string;
  name: string;
  category: 'water' | 'agroecology' | 'canopy' | 'energy' | 'habitat';
  bioregion: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  reachRadiusKm: number;
  hectaresRestored: number;
  populationImpacted: number;
  flourishingContributions: {
    ecologicalVitality: number; // +%
    waterSecurity: number;      // +%
    soilCarbon: number;         // +%
    communityAutonomy: number;  // +%
    intergenerationalEquity: number; // 0 - 100
  };
  causalTargets: Array<{
    targetNodeId: string;
    targetName: string;
    influenceWeight: number; // 0 - 1
    mechanism: string;
  }>;
  status: 'Active Field Deployment' | 'Scaling & Monitored' | 'Autonomous Operation';
  certaintyScore: number;
  merkleHash: string;
  verifier: string;
}

export interface CausalEcoNode {
  id: string;
  name: string;
  type: 'aquifer' | 'watershed' | 'forest_reserve' | 'community_assembly' | 'downstream_delta';
  coordinates: [number, number];
  currentHealthIndex: number; // 0 - 100
}

const ACTIVE_SPATIAL_PROJECTS: SpatialProject[] = [
  {
    id: 'proj-mara-hydrology',
    name: 'Mara Basin Subterranean Sponge & Sensor Mesh',
    category: 'water',
    bioregion: 'Mara-Serengeti Transboundary Basin',
    country: 'Kenya / Tanzania',
    coordinates: [35.25, -1.50],
    reachRadiusKm: 185,
    hectaresRestored: 42500,
    populationImpacted: 165000,
    flourishingContributions: {
      ecologicalVitality: 22.4,
      waterSecurity: 34.8,
      soilCarbon: 12.1,
      communityAutonomy: 28.5,
      intergenerationalEquity: 96
    },
    causalTargets: [
      { targetNodeId: 'node-mara-river', targetName: 'Mara Perennial Riverbed', influenceWeight: 0.94, mechanism: 'Riparian buffer stabilization & piezometer telemetry calibration' },
      { targetNodeId: 'node-maasai-conservancy', targetName: 'Community Pastoralist Conservancy', influenceWeight: 0.88, mechanism: 'Equitable wet-season grazing corridors & borehole solar pumping' },
      { targetNodeId: 'node-lake-victoria-inflow', targetName: 'Lake Victoria Inflow Delta', influenceWeight: 0.76, mechanism: 'Sediment load abatement & siltation reduction' }
    ],
    status: 'Active Field Deployment',
    certaintyScore: 99.4,
    merkleHash: '0x8f4d92a11b6c73e04a919283f619b02a',
    verifier: 'Mara Basin Community Elders Council & UN-Water In-situ Node'
  },
  {
    id: 'proj-aberdare-cloud',
    name: 'Aberdare Cloud Forest Mycelial Regeneration',
    category: 'canopy',
    bioregion: 'Aberdare Cloud Forest Water Tower',
    country: 'Kenya',
    coordinates: [36.70, -0.45],
    reachRadiusKm: 140,
    hectaresRestored: 31200,
    populationImpacted: 2400000,
    flourishingContributions: {
      ecologicalVitality: 38.6,
      waterSecurity: 41.2,
      soilCarbon: 29.4,
      communityAutonomy: 19.8,
      intergenerationalEquity: 99
    },
    causalTargets: [
      { targetNodeId: 'node-nairobi-watershed', targetName: 'Sasumua & Ndakaini Reservoir Mesh', influenceWeight: 0.97, mechanism: 'Cloud condensation interception & baseflow recharge' },
      { targetNodeId: 'node-tana-river-headwaters', targetName: 'Tana River Headwaters', influenceWeight: 0.89, mechanism: 'Deep canopy root infiltration preventing landslide siltation' }
    ],
    status: 'Scaling & Monitored',
    certaintyScore: 98.9,
    merkleHash: '0x3c7e411b90d2e87a23c456891048f72c',
    verifier: 'Kenya Forestry Research Institute (KEFRI) & Mesh Sentinel'
  },
  {
    id: 'proj-rift-agroforestry',
    name: 'Great Rift Valley Biochar & Soil Sponge Corridor',
    category: 'agroecology',
    bioregion: 'Central Rift Volcanic Watershed',
    country: 'Kenya',
    coordinates: [36.20, -0.28],
    reachRadiusKm: 110,
    hectaresRestored: 18400,
    populationImpacted: 88000,
    flourishingContributions: {
      ecologicalVitality: 19.5,
      waterSecurity: 21.0,
      soilCarbon: 36.8,
      communityAutonomy: 32.1,
      intergenerationalEquity: 94
    },
    causalTargets: [
      { targetNodeId: 'node-lake-nakuru-basin', targetName: 'Lake Nakuru Alkaline Watershed', influenceWeight: 0.85, mechanism: 'Zero chemical runoff & biochar nutrient absorption' },
      { targetNodeId: 'node-naivasha-aquifer', targetName: 'Naivasha Horticultural Aquifer', influenceWeight: 0.79, mechanism: 'Soil organic matter moisture retention layer' }
    ],
    status: 'Active Field Deployment',
    certaintyScore: 97.8,
    merkleHash: '0x19284fa871b63c910283f98293bcde11',
    verifier: 'Regenerative Agriculture Alliance & Agro-IoT Mesh'
  },
  {
    id: 'proj-turkana-solar-water',
    name: 'Turkana Deep Aquifer Solar-Thermal Desalination',
    category: 'energy',
    bioregion: 'Turkana-Omo Arid Cradle',
    country: 'Kenya',
    coordinates: [35.60, 3.12],
    reachRadiusKm: 210,
    hectaresRestored: 12000,
    populationImpacted: 115000,
    flourishingContributions: {
      ecologicalVitality: 14.8,
      waterSecurity: 46.5,
      soilCarbon: 8.2,
      communityAutonomy: 42.0,
      intergenerationalEquity: 95
    },
    causalTargets: [
      { targetNodeId: 'node-lotikipi-aquifer', targetName: 'Lotikipi Basin Deep Aquifer', influenceWeight: 0.92, mechanism: 'Geothermal/solar thermal micro-distillation & mineral balancing' },
      { targetNodeId: 'node-kalokol-community', targetName: 'Kalokol Pastoralist Microgrid', influenceWeight: 0.84, mechanism: 'Decentralized cold chain & clean drinking water dispensing' }
    ],
    status: 'Autonomous Operation',
    certaintyScore: 99.1,
    merkleHash: '0x99238bcde76110293847f98102374b6a',
    verifier: 'Turkana Pastoralist Water Covenant & Satellite Radar'
  },
  {
    id: 'proj-kibera-closed-loop',
    name: 'Nairobi Urban Riparian Biofilter & LifeHouse Habitat',
    category: 'habitat',
    bioregion: 'Athi-Nairobi Metropolitan Basin',
    country: 'Kenya',
    coordinates: [36.79, -1.31],
    reachRadiusKm: 65,
    hectaresRestored: 4200,
    populationImpacted: 350000,
    flourishingContributions: {
      ecologicalVitality: 26.2,
      waterSecurity: 29.8,
      soilCarbon: 15.0,
      communityAutonomy: 44.5,
      intergenerationalEquity: 97
    },
    causalTargets: [
      { targetNodeId: 'node-nairobi-river-corridor', targetName: 'Nairobi River Riparian Wetland', influenceWeight: 0.91, mechanism: 'Reed bed phytoremediation & greywater recycling' },
      { targetNodeId: 'node-athi-downstream', targetName: 'Athi River Upper Basin', influenceWeight: 0.81, mechanism: 'Zero untreated industrial effluent barrier' }
    ],
    status: 'Active Field Deployment',
    certaintyScore: 98.4,
    merkleHash: '0x71283cbe991823a04910283fbcde8812',
    verifier: 'Kibera Youth Environmental League & Municipal Auditor'
  }
];

const CAUSAL_ECO_NODES: CausalEcoNode[] = [
  { id: 'node-mara-river', name: 'Mara Perennial Riverbed', type: 'watershed', coordinates: [35.10, -1.65], currentHealthIndex: 88 },
  { id: 'node-maasai-conservancy', name: 'Community Pastoralist Conservancy', type: 'community_assembly', coordinates: [35.45, -1.35], currentHealthIndex: 91 },
  { id: 'node-lake-victoria-inflow', name: 'Lake Victoria Inflow Delta', type: 'downstream_delta', coordinates: [34.50, -1.25], currentHealthIndex: 79 },
  { id: 'node-nairobi-watershed', name: 'Sasumua & Ndakaini Reservoir Mesh', type: 'aquifer', coordinates: [36.75, -0.75], currentHealthIndex: 94 },
  { id: 'node-tana-river-headwaters', name: 'Tana River Headwaters', type: 'watershed', coordinates: [37.10, -0.50], currentHealthIndex: 92 },
  { id: 'node-lake-nakuru-basin', name: 'Lake Nakuru Alkaline Watershed', type: 'watershed', coordinates: [36.08, -0.35], currentHealthIndex: 82 },
  { id: 'node-naivasha-aquifer', name: 'Naivasha Horticultural Aquifer', type: 'aquifer', coordinates: [36.35, -0.72], currentHealthIndex: 84 },
  { id: 'node-lotikipi-aquifer', name: 'Lotikipi Basin Deep Aquifer', type: 'aquifer', coordinates: [35.20, 3.60], currentHealthIndex: 90 },
  { id: 'node-kalokol-community', name: 'Kalokol Pastoralist Microgrid', type: 'community_assembly', coordinates: [35.80, 3.52], currentHealthIndex: 86 },
  { id: 'node-nairobi-river-corridor', name: 'Nairobi River Riparian Wetland', type: 'watershed', coordinates: [36.85, -1.28], currentHealthIndex: 76 },
  { id: 'node-athi-downstream', name: 'Athi River Upper Basin', type: 'downstream_delta', coordinates: [37.20, -1.45], currentHealthIndex: 81 }
];

interface MissionImpactMapProps {
  onInspectProvenance?: (prov: DataProvenance) => void;
  onSelectProject?: (proj: SpatialProject) => void;
  className?: string;
}

export const MissionImpactMap: React.FC<MissionImpactMapProps> = ({
  onInspectProvenance,
  onSelectProject,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<SpatialProject | null>(ACTIVE_SPATIAL_PROJECTS[0]);
  const [showReachRings, setShowReachRings] = useState(true);
  const [showCausalLinks, setShowCausalLinks] = useState(true);
  const [activeFlourishingFocus, setActiveFlourishingFocus] = useState<'all' | 'ecologicalVitality' | 'waterSecurity' | 'soilCarbon' | 'communityAutonomy'>('all');

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return ACTIVE_SPATIAL_PROJECTS;
    return ACTIVE_SPATIAL_PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Aggregate flourishing metrics across all active filtered projects
  const aggregateFlourishing = useMemo(() => {
    const count = filteredProjects.length || 1;
    const totals = filteredProjects.reduce(
      (acc, p) => {
        acc.ecologicalVitality += p.flourishingContributions.ecologicalVitality;
        acc.waterSecurity += p.flourishingContributions.waterSecurity;
        acc.soilCarbon += p.flourishingContributions.soilCarbon;
        acc.communityAutonomy += p.flourishingContributions.communityAutonomy;
        acc.intergenerationalEquity += p.flourishingContributions.intergenerationalEquity;
        acc.hectares += p.hectaresRestored;
        acc.population += p.populationImpacted;
        return acc;
      },
      { ecologicalVitality: 0, waterSecurity: 0, soilCarbon: 0, communityAutonomy: 0, intergenerationalEquity: 0, hectares: 0, population: 0 }
    );

    return {
      ecologicalVitality: +(totals.ecologicalVitality / count).toFixed(1),
      waterSecurity: +(totals.waterSecurity / count).toFixed(1),
      soilCarbon: +(totals.soilCarbon / count).toFixed(1),
      communityAutonomy: +(totals.communityAutonomy / count).toFixed(1),
      intergenerationalEquity: +(totals.intergenerationalEquity / count).toFixed(0),
      totalHectares: totals.hectares,
      totalPopulation: totals.population
    };
  }, [filteredProjects]);

  // D3 Map & Network Visualization Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = 540;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Map container with zoom support
    const g = svg.append('g').attr('class', 'map-stage');

    // Geo Mercator projection centered around East Africa Bioregional Corridors (36°E, 0.5°N)
    const projection = d3.geoMercator()
      .center([36.2, 0.6])
      .scale(width * 2.8)
      .translate([width / 2, height / 2]);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Subtle background grid
    const gridG = g.append('g').attr('class', 'grid-lines opacity-10');
    for (let x = 0; x < width * 2; x += 40) {
      gridG.append('line').attr('x1', x - width / 2).attr('y1', -height).attr('x2', x - width / 2).attr('y2', height * 2).attr('stroke', '#C5A059').attr('stroke-width', 0.5);
    }
    for (let y = 0; y < height * 2; y += 40) {
      gridG.append('line').attr('x1', -width).attr('y1', y - height / 2).attr('x2', width * 2).attr('y2', y - height / 2).attr('stroke', '#C5A059').attr('stroke-width', 0.5);
    }

    // Topographic / biome decorative contours
    const contourGroup = g.append('g').attr('class', 'bioregional-contours');
    const biomeCenters: Array<[number, number, string, number]> = [
      [35.25, -1.50, 'Savannah-Riverine Basin', 110],
      [36.70, -0.45, 'Montane Cloud Forest', 85],
      [36.20, -0.28, 'Volcanic Graben & Lakes', 75],
      [35.60, 3.12, 'Arid Aquifer Cradle', 125],
      [36.79, -1.31, 'Riparian Urban Oasis', 50]
    ];

    biomeCenters.forEach(([lng, lat, label, radius]) => {
      const [cx, cy] = projection([lng, lat]) || [0, 0];
      contourGroup.append('ellipse')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('rx', radius * 1.3)
        .attr('ry', radius * 0.9)
        .attr('fill', '#1B3022')
        .attr('fill-opacity', 0.18)
        .attr('stroke', '#C5A059')
        .attr('stroke-opacity', 0.15)
        .attr('stroke-dasharray', '4,4');
    });

    // Draw Causal Influence Links between projects and target ecological nodes
    const linksGroup = g.append('g').attr('class', 'causal-links');

    if (showCausalLinks) {
      filteredProjects.forEach((proj) => {
        const [px, py] = projection(proj.coordinates) || [0, 0];

        proj.causalTargets.forEach((target) => {
          const targetNode = CAUSAL_ECO_NODES.find((n) => n.id === target.targetNodeId);
          if (!targetNode) return;

          const [tx, ty] = projection(targetNode.coordinates) || [0, 0];
          const midX = (px + tx) / 2;
          const midY = (py + ty) / 2 - 25; // Curved arc

          const pathD = `M ${px} ${py} Q ${midX} ${midY} ${tx} ${ty}`;

          // Background glow link
          linksGroup.append('path')
            .attr('d', pathD)
            .attr('fill', 'none')
            .attr('stroke', '#C5A059')
            .attr('stroke-width', target.influenceWeight * 3)
            .attr('stroke-opacity', 0.25);

          // Animated dashed flow link
          linksGroup.append('path')
            .attr('d', pathD)
            .attr('fill', 'none')
            .attr('stroke', '#10B981')
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.8)
            .attr('stroke-dasharray', '6,6')
            .attr('class', 'animate-dash');
        });
      });
    }

    // Draw Causal Ecological Destination Nodes
    const nodesGroup = g.append('g').attr('class', 'eco-nodes');
    CAUSAL_ECO_NODES.forEach((node) => {
      const [nx, ny] = projection(node.coordinates) || [0, 0];

      const nodeG = nodesGroup.append('g')
        .attr('transform', `translate(${nx}, ${ny})`)
        .attr('class', 'cursor-pointer group');

      nodeG.append('circle')
        .attr('r', 5)
        .attr('fill', '#0A0A0A')
        .attr('stroke', '#8FB8DE')
        .attr('stroke-width', 1.5);

      nodeG.append('text')
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#F5F5F0')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('opacity', 0.75)
        .text(node.name);
    });

    // Draw Spatial Reach Zones & Active Project Hubs
    const projectsGroup = g.append('g').attr('class', 'project-hubs');

    filteredProjects.forEach((proj) => {
      const [px, py] = projection(proj.coordinates) || [0, 0];
      const isSelected = selectedProject?.id === proj.id;

      const projG = projectsGroup.append('g')
        .attr('transform', `translate(${px}, ${py})`)
        .attr('class', 'cursor-pointer')
        .on('click', () => {
          audioFeedback.playSubtleClick();
          setSelectedProject(proj);
          if (onSelectProject) onSelectProject(proj);
        });

      // Spatial Reach Zone (Pulsating Radius scaled by km reach)
      if (showReachRings) {
        const ringRadius = Math.max(28, proj.reachRadiusKm * 0.45);

        projG.append('circle')
          .attr('r', ringRadius)
          .attr('fill', isSelected ? '#C5A059' : '#10B981')
          .attr('fill-opacity', isSelected ? 0.15 : 0.08)
          .attr('stroke', isSelected ? '#C5A059' : '#10B981')
          .attr('stroke-opacity', isSelected ? 0.7 : 0.35)
          .attr('stroke-width', isSelected ? 1.5 : 1)
          .attr('stroke-dasharray', isSelected ? 'none' : '3,3');

        // Outer pulse circle
        projG.append('circle')
          .attr('r', ringRadius * 1.3)
          .attr('fill', 'none')
          .attr('stroke', '#C5A059')
          .attr('stroke-opacity', 0.18)
          .attr('stroke-width', 0.5);
      }

      // Core Project Anchor Marker
      projG.append('circle')
        .attr('r', isSelected ? 10 : 7)
        .attr('fill', isSelected ? '#C5A059' : '#1B3022')
        .attr('stroke', '#F5F5F0')
        .attr('stroke-width', isSelected ? 2.5 : 1.5)
        .attr('filter', isSelected ? 'drop-shadow(0 0 8px #C5A059)' : 'none');

      // Inner pulsating light
      projG.append('circle')
        .attr('r', isSelected ? 4 : 2.5)
        .attr('fill', isSelected ? '#000000' : '#10B981');

      // Project label
      projG.append('text')
        .attr('y', -14)
        .attr('text-anchor', 'middle')
        .attr('fill', isSelected ? '#C5A059' : '#FFFFFF')
        .attr('font-size', isSelected ? '11px' : '10px')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .attr('font-family', 'serif')
        .text(proj.name.split(' ')[0] + ' ' + (proj.name.split(' ')[1] || ''));
    });

  }, [filteredProjects, selectedProject, showReachRings, showCausalLinks, activeFlourishingFocus]);

  const handleInspectProvenanceRecord = () => {
    if (!selectedProject || !onInspectProvenance) return;
    audioFeedback.playSubtleClick();

    const prov: DataProvenance = {
      id: `PROV-${selectedProject.id}`,
      source: `${selectedProject.name} Geospatial Telemetry`,
      sourceType: 'iot_sensor_mesh',
      collectedAt: new Date().toISOString(),
      calculationMethod: 'Empirical Spatial Reach Radius + Cross-Validated Counterfactual Modeling',
      certaintyScore: selectedProject.certaintyScore,
      verifier: selectedProject.verifier,
      verifierRole: 'Epistemic Bioregional Auditor',
      cryptographicHash: selectedProject.merkleHash,
      assumptions: [
        `Spatial reach radius evaluated at ${selectedProject.reachRadiusKm} km based on groundwater gradient`,
        `Population served (${selectedProject.populationImpacted.toLocaleString()}) calculated via high-resolution raster census`,
        'Causal influence paths cross-checked against multi-node telemetry stream'
      ],
      lastAudited: new Date().toISOString()
    };

    onInspectProvenance(prov);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-[#101411] border border-[#C5A059]/30 rounded-xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1B3022] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide flex items-center gap-2">
                Mission Spatial Reach & Causal Influence Engine
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  D3.js Live Topology
                </span>
              </h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                Visualizing physical territorial reach, downstream causal links, and aggregate flourishing metric gains.
              </p>
            </div>
          </div>
        </div>

        {/* View toggles & Domain Filter */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <div className="flex items-center gap-1 bg-[#0A0D0B] p-1 rounded-lg border border-[#F5F5F0]/10">
            {['all', 'water', 'agroecology', 'canopy', 'energy', 'habitat'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setSelectedCategory(cat);
                }}
                className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C5A059] text-black shadow'
                    : 'text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setShowReachRings(!showReachRings);
              }}
              className={`p-1.5 px-2 rounded border text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
                showReachRings ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-[#0A0D0B] text-[#F5F5F0]/50 border-[#F5F5F0]/10'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Reach Rings</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setShowCausalLinks(!showCausalLinks);
              }}
              className={`p-1.5 px-2 rounded border text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
                showCausalLinks ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-[#0A0D0B] text-[#F5F5F0]/50 border-[#F5F5F0]/10'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Causal Links</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Flourishing Contribution Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono">
        <div className="p-2.5 rounded-lg bg-[#0D120E] border border-emerald-500/30">
          <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
            <TreePine className="w-3 h-3" />
            Ecological Vitality
          </div>
          <div className="text-lg font-bold text-white mt-1">+{aggregateFlourishing.ecologicalVitality}%</div>
          <div className="text-[8px] text-[#F5F5F0]/50">Biomass & NDVI Anomaly</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0D120E] border border-cyan-500/30">
          <div className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            Water Security
          </div>
          <div className="text-lg font-bold text-white mt-1">+{aggregateFlourishing.waterSecurity}%</div>
          <div className="text-[8px] text-[#F5F5F0]/50">Aquifer Head & Baseflow</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0D120E] border border-amber-500/30">
          <div className="text-[9px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Soil Carbon
          </div>
          <div className="text-lg font-bold text-white mt-1">+{aggregateFlourishing.soilCarbon}%</div>
          <div className="text-[8px] text-[#F5F5F0]/50">Soil Organic Matter Sink</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0D120E] border border-purple-500/30">
          <div className="text-[9px] uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
            <Heart className="w-3 h-3" />
            Community Autonomy
          </div>
          <div className="text-lg font-bold text-white mt-1">+{aggregateFlourishing.communityAutonomy}%</div>
          <div className="text-[8px] text-[#F5F5F0]/50">Decentralized Governance</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0D120E] border border-[#C5A059]/40">
          <div className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1">
            <Scale className="w-3 h-3" />
            Intergenerational
          </div>
          <div className="text-lg font-bold text-white mt-1">{aggregateFlourishing.intergenerationalEquity}/100</div>
          <div className="text-[8px] text-[#F5F5F0]/50">7th Generation Index</div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0D120E] border border-blue-500/30">
          <div className="text-[9px] uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1">
            <Globe2 className="w-3 h-3" />
            Territorial Reach
          </div>
          <div className="text-lg font-bold text-white mt-1">{(aggregateFlourishing.totalHectares / 1000).toFixed(0)}k ha</div>
          <div className="text-[8px] text-[#F5F5F0]/50">{(aggregateFlourishing.totalPopulation / 1000).toFixed(0)}k People Served</div>
        </div>
      </div>

      {/* Main Map Canvas and Active Project Inspector Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* D3 Interactive Spatial Stage (8 cols) */}
        <div 
          ref={containerRef}
          className="xl:col-span-8 bg-[#090C0A] border border-[#C5A059]/30 rounded-xl overflow-hidden relative min-h-[460px] lg:min-h-[520px] shadow-xl"
        >
          {/* Zoom Instructions / Legend */}
          <div className="absolute top-3 left-3 z-10 bg-[#0D120E]/90 backdrop-blur-md border border-[#F5F5F0]/15 rounded-md p-2 text-[9px] font-mono text-[#F5F5F0]/80 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Geodesic Topology
            </div>
            <div>Scroll or Pinch to Zoom • Drag to Pan</div>
            <div className="flex items-center gap-2 pt-0.5 text-[8px] text-[#F5F5F0]/50">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span> Project Hub
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8FB8DE]"></span> Causal Target
              </span>
            </div>
          </div>

          <svg 
            ref={svgRef}
            className="w-full h-full min-h-[460px] lg:min-h-[520px] cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* Selected Project Detailed Causal Dossier (4 cols) */}
        <div className="xl:col-span-4 bg-[#0D120E] border border-[#C5A059]/30 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-xl">
          {selectedProject ? (
            <div className="space-y-3.5">
              <div className="border-b border-[#F5F5F0]/10 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                    {selectedProject.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#C5A059] font-bold">
                    {selectedProject.certaintyScore}% Certainty
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-white mt-1.5 leading-snug">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  {selectedProject.bioregion} · {selectedProject.country}
                </p>
              </div>

              {/* Physical Reach Statistics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-[#131A14] border border-emerald-500/20">
                  <div className="text-[9px] text-[#F5F5F0]/50 uppercase">Spatial Radius</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedProject.reachRadiusKm} km</div>
                </div>
                <div className="p-2 rounded bg-[#131A14] border border-emerald-500/20">
                  <div className="text-[9px] text-[#F5F5F0]/50 uppercase">Hectares Under Custody</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedProject.hectaresRestored.toLocaleString()} ha</div>
                </div>
              </div>

              {/* Specific Flourishing Contributions */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold tracking-wider">
                  Causal Contribution to Core Flourishing Pillars
                </span>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between bg-[#111612] p-1.5 rounded">
                    <span className="text-[#F5F5F0]/70 text-[11px]">Ecological Vitality</span>
                    <span className="font-bold text-emerald-400">+{selectedProject.flourishingContributions.ecologicalVitality}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#111612] p-1.5 rounded">
                    <span className="text-[#F5F5F0]/70 text-[11px]">Water Security</span>
                    <span className="font-bold text-cyan-400">+{selectedProject.flourishingContributions.waterSecurity}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#111612] p-1.5 rounded">
                    <span className="text-[#F5F5F0]/70 text-[11px]">Soil Carbon Sponge</span>
                    <span className="font-bold text-amber-400">+{selectedProject.flourishingContributions.soilCarbon}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#111612] p-1.5 rounded">
                    <span className="text-[#F5F5F0]/70 text-[11px]">Community Self-Governance</span>
                    <span className="font-bold text-purple-400">+{selectedProject.flourishingContributions.communityAutonomy}%</span>
                  </div>
                </div>
              </div>

              {/* Causal Mechanisms & Target Nodes */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-[#8FB8DE] font-bold tracking-wider">
                  Active Downstream Causal Pathways
                </span>
                <div className="space-y-1.5">
                  {selectedProject.causalTargets.map((ct) => (
                    <div key={ct.targetNodeId} className="p-2 rounded bg-[#101512] border border-[#F5F5F0]/10 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-white text-[11px]">{ct.targetName}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{(ct.influenceWeight * 100).toFixed(0)}% weight</span>
                      </div>
                      <p className="text-[10px] text-[#F5F5F0]/70 font-sans mt-0.5 leading-relaxed">
                        {ct.mechanism}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#F5F5F0]/40 font-mono text-xs">
              Select a project hub on the map to inspect its spatial and causal footprint.
            </div>
          )}

          {/* Action Footer */}
          {selectedProject && (
            <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-col gap-2">
              <div className="text-[9px] font-mono text-[#F5F5F0]/50 truncate">
                Proof Seal: <span className="text-emerald-400">{selectedProject.merkleHash}</span>
              </div>
              <button
                onClick={handleInspectProvenanceRecord}
                className="w-full py-2 px-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Inspect Data Provenance Lineage</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
