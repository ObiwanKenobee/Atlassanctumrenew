import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  GitBranch, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Info, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles,
  TreePine,
  Droplets,
  Heart,
  Users,
  Coins,
  Cpu
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type FlourishingCategory = 'Ecological' | 'Human Health' | 'Civic Trust' | 'Economic Sovereignty' | 'Intergenerational';

export interface ProjectFlourishingNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  kind: 'PROJECT_OS' | 'FLOURISHING_INDICATOR';
  category: FlourishingCategory;
  value: string;
  progressPercent: number;
  bioregion: string;
  stewardCouncil: string;
  epistemicProvenanceHash: string;
  impactScale: number; // 10 to 40 radius
}

export interface ProjectFlourishingLink extends d3.SimulationLinkDatum<ProjectFlourishingNode> {
  id: string;
  source: string | ProjectFlourishingNode;
  target: string | ProjectFlourishingNode;
  attributionWeight: number; // 0.1 to 1.0
  verifiedEvidenceHash: string;
  metricType: string;
}

export const RESTORATION_PROJECT_NODES: ProjectFlourishingNode[] = [
  {
    id: 'proj-01',
    name: 'Aberdare Cloud Forest Reforestation',
    kind: 'PROJECT_OS',
    category: 'Ecological',
    value: '850 ha Native Canopy',
    progressPercent: 88,
    bioregion: 'Aberdare Highland Cloud Basin',
    stewardCouncil: 'Aberdare Indigenous Guardians',
    epistemicProvenanceHash: '0x9a8f...44bc',
    impactScale: 32
  },
  {
    id: 'proj-02',
    name: 'Mathare River Bio-Swale Catchment',
    kind: 'PROJECT_OS',
    category: 'Human Health',
    value: '-72% Silt Runoff',
    progressPercent: 74,
    bioregion: 'Nairobi Urban Watershed',
    stewardCouncil: 'Nairobi Water Coalition',
    epistemicProvenanceHash: '0x33e2...88ab',
    impactScale: 28
  },
  {
    id: 'proj-03',
    name: 'Mara Basin Rotational Silvopasture',
    kind: 'PROJECT_OS',
    category: 'Ecological',
    value: '+3.4% Soil Organic Matter',
    progressPercent: 91,
    bioregion: 'Mara River Headwater Savanna',
    stewardCouncil: 'Maasai Mara Grazing Assembly',
    epistemicProvenanceHash: '0x77c1...12ff',
    impactScale: 34
  },
  {
    id: 'proj-04',
    name: 'Turkana Clean Desalination Network',
    kind: 'PROJECT_OS',
    category: 'Economic Sovereignty',
    value: '14,200 L/day Pure Potable',
    progressPercent: 68,
    bioregion: 'Northern Rift Lake Basin',
    stewardCouncil: 'Turkana Pastoralist Water Union',
    epistemicProvenanceHash: '0x55d4...e188',
    impactScale: 26
  },
  {
    id: 'proj-05',
    name: 'Kikuyu Agro-Terrace Food Forest',
    kind: 'PROJECT_OS',
    category: 'Intergenerational',
    value: '18 Indigenous Polycultures',
    progressPercent: 82,
    bioregion: 'Central Highland Escarpment',
    stewardCouncil: 'Central Rift Farming Guild',
    epistemicProvenanceHash: '0x19a0...33dd',
    impactScale: 30
  },
  // Flourishing Index Indicators (Civilizational Outcomes)
  {
    id: 'ind-01',
    name: 'Planetary Canopy & Carbon Sequestration',
    kind: 'FLOURISHING_INDICATOR',
    category: 'Ecological',
    value: '1,420 tCO2e/yr Sequestration',
    progressPercent: 89,
    bioregion: 'Global Biosphere Buffer',
    stewardCouncil: 'Commandment IX Registry',
    epistemicProvenanceHash: '0xec01...9911',
    impactScale: 38
  },
  {
    id: 'ind-02',
    name: 'Freshwater Access & Piezometric Stability',
    kind: 'FLOURISHING_INDICATOR',
    category: 'Human Health',
    value: '1.84 bar Head Recovery',
    progressPercent: 84,
    bioregion: 'Continental Aquifers',
    stewardCouncil: 'Hydrological Trust Council',
    epistemicProvenanceHash: '0xec02...8822',
    impactScale: 36
  },
  {
    id: 'ind-03',
    name: 'Decentralized Water & Food Sovereignty',
    kind: 'FLOURISHING_INDICATOR',
    category: 'Economic Sovereignty',
    value: '38,000 Direct Beneficiaries',
    progressPercent: 78,
    bioregion: 'Civic Commons Mesh',
    stewardCouncil: 'Civic Guild Stewardship Alliance',
    epistemicProvenanceHash: '0xec03...7733',
    impactScale: 35
  },
  {
    id: 'ind-04',
    name: 'Participatory Civic Trust & Epistemic Parity',
    kind: 'FLOURISHING_INDICATOR',
    category: 'Civic Trust',
    value: '94.2% Epistemic Certainty',
    progressPercent: 93,
    bioregion: 'Liquid Democracy Commons',
    stewardCouncil: 'Civilization OS Arbiter Guild',
    epistemicProvenanceHash: '0xec04...6644',
    impactScale: 36
  },
  {
    id: 'ind-05',
    name: 'Living Soil Microbiome & Mycorrhizal Density',
    kind: 'FLOURISHING_INDICATOR',
    category: 'Intergenerational',
    value: '22.4 mg/g Glomalin Index',
    progressPercent: 92,
    bioregion: 'Subterranean Fungal Commons',
    stewardCouncil: 'Mycology Research Trust',
    epistemicProvenanceHash: '0xec05...5555',
    impactScale: 35
  }
];

export const RESTORATION_PROJECT_LINKS: ProjectFlourishingLink[] = [
  { id: 'l1', source: 'proj-01', target: 'ind-01', attributionWeight: 0.92, verifiedEvidenceHash: '0x88f1...11a1', metricType: 'Direct Native Crown Re-establishment' },
  { id: 'l2', source: 'proj-01', target: 'ind-02', attributionWeight: 0.78, verifiedEvidenceHash: '0x88f1...22b2', metricType: 'Cloud Fog Interception & Infiltration' },
  { id: 'l3', source: 'proj-02', target: 'ind-02', attributionWeight: 0.85, verifiedEvidenceHash: '0x88f1...33c3', metricType: 'Urban Turbidity Silt Filtering' },
  { id: 'l4', source: 'proj-02', target: 'ind-03', attributionWeight: 0.71, verifiedEvidenceHash: '0x88f1...44d4', metricType: 'Flood Protection for 12,000 Citizens' },
  { id: 'l5', source: 'proj-03', target: 'ind-05', attributionWeight: 0.94, verifiedEvidenceHash: '0x88f1...55e5', metricType: 'Rotational Deep Root Humus Inoculation' },
  { id: 'l6', source: 'proj-03', target: 'ind-01', attributionWeight: 0.81, verifiedEvidenceHash: '0x88f1...66f6', metricType: 'Perennial Bunchgrass Carbon Bank' },
  { id: 'l7', source: 'proj-04', target: 'ind-03', attributionWeight: 0.95, verifiedEvidenceHash: '0x88f1...77a7', metricType: 'Thermal Solar Evaporation Desalination' },
  { id: 'l8', source: 'proj-05', target: 'ind-03', attributionWeight: 0.86, verifiedEvidenceHash: '0x88f1...88b8', metricType: 'Agroecological Food Forest Sovereignty' },
  { id: 'l9', source: 'proj-05', target: 'ind-04', attributionWeight: 0.89, verifiedEvidenceHash: '0x88f1...99c9', metricType: 'Indigenous Intergenerational Seed Ledger' },
  { id: 'l10', source: 'proj-01', target: 'ind-04', attributionWeight: 0.82, verifiedEvidenceHash: '0x88f1...00d0', metricType: 'Elder-Verified Field Attestation' }
];

export const ProjectFlourishingD3Network: React.FC<{
  onInspectProvenance?: (prov: any) => void;
}> = ({ onInspectProvenance }) => {
  const [selectedNode, setSelectedNode] = useState<ProjectFlourishingNode | null>(RESTORATION_PROJECT_NODES[0]);
  const [selectedLink, setSelectedLink] = useState<ProjectFlourishingLink | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<ProjectFlourishingNode, ProjectFlourishingLink> | null>(null);

  const filteredNodes = RESTORATION_PROJECT_NODES.filter(n => {
    return filterCategory === 'ALL' || n.category === filterCategory;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = RESTORATION_PROJECT_LINKS.filter(l => {
    const s = typeof l.source === 'object' ? (l.source as ProjectFlourishingNode).id : l.source;
    const t = typeof l.target === 'object' ? (l.target as ProjectFlourishingNode).id : l.target;
    return filteredNodeIds.has(s) && filteredNodeIds.has(t);
  });

  const getNodeColor = (node: ProjectFlourishingNode) => {
    if (node.kind === 'PROJECT_OS') {
      return '#C5A059'; // Gold for Projects
    }
    switch (node.category) {
      case 'Ecological':
        return '#34D399'; // Emerald
      case 'Human Health':
        return '#60A5FA'; // Blue
      case 'Economic Sovereignty':
        return '#FBBF24'; // Amber
      case 'Civic Trust':
        return '#A78BFA'; // Purple
      case 'Intergenerational':
        return '#F472B6'; // Rose
      default:
        return '#C5A059';
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 560;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('class', 'network-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Glowing defs
    const defs = svg.append('defs');
    
    // Arrow markers
    defs.append('marker')
      .attr('id', 'flourish-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#C5A059')
      .attr('opacity', 0.8);

    const simNodes = filteredNodes.map(d => ({ ...d }));
    const simLinks = filteredLinks.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<ProjectFlourishingNode>(simNodes)
      .force('link', d3.forceLink<ProjectFlourishingNode, ProjectFlourishingLink>(simLinks).id(d => d.id).distance(160))
      .force('charge', d3.forceManyBody().strength(-450))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    simulationRef.current = simulation;

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup.selectAll('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', '#C5A059')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d) => Math.max(1.8, d.attributionWeight * 4))
      .attr('marker-end', 'url(#flourish-arrow)')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedLink(d);
        setSelectedNode(null);
        audioFeedback.playSubtleClick();
      });

    // Link Text Labels
    const linkText = linkGroup.selectAll('.link-label')
      .data(simLinks)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('fill', '#C5A059')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0.8)
      .text(d => `${(d.attributionWeight * 100).toFixed(0)}% Attribution`);

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll('.node')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, ProjectFlourishingNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        setSelectedLink(null);
        audioFeedback.playMicroTick();
      });

    // Outer Halo for Flourishing Indicators
    nodeElements.filter(d => d.kind === 'FLOURISHING_INDICATOR')
      .append('circle')
      .attr('r', (d) => d.impactScale + 8)
      .attr('fill', 'none')
      .attr('stroke', (d) => getNodeColor(d))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', '4,4');

    // Main Node Body
    nodeElements.append('circle')
      .attr('r', (d) => d.impactScale)
      .attr('fill', '#0E1713')
      .attr('stroke', (d) => (d.id === selectedNode?.id ? '#FFFFFF' : getNodeColor(d)))
      .attr('stroke-width', (d) => (d.id === selectedNode?.id ? 3.5 : 2));

    // Progress Arc on Projects
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d) => getNodeColor(d))
      .attr('font-size', (d) => (d.kind === 'FLOURISHING_INDICATOR' ? '14px' : '11px'))
      .attr('font-weight', 'bold')
      .text((d) => (d.kind === 'PROJECT_OS' ? '🌿' : '💎'));

    // Node Title Text
    nodeElements.append('text')
      .attr('dy', (d) => d.impactScale + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F5F5F0')
      .attr('font-size', '10px')
      .attr('font-family', 'serif')
      .attr('font-weight', 'bold')
      .text((d) => (d.name.length > 24 ? d.name.slice(0, 22) + '...' : d.name));

    // Node Value Badge
    nodeElements.append('text')
      .attr('dy', (d) => d.impactScale + 26)
      .attr('text-anchor', 'middle')
      .attr('fill', '#C5A059')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text((d) => d.value);

    // Simulation Tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);

      nodeElements.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, selectedNode]);

  return (
    <div className={`bg-[#0A0A0A] text-[#F5F5F0] rounded-sm border border-[#C5A059]/40 p-6 space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-[#070707] p-8' : ''}`}>
      {/* Network Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
              GLOBAL RESTORATION MESH • D3 ATTRIBUTION NETWORK GRAPH
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Project OS ➔ Flourishing Index Network
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-3xl font-sans">
            Visualizes how real-world restoration projects directly contribute to verifiable planetary flourishing indicators with cryptographic proof anchoring.
          </p>
        </div>

        {/* Categories & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'Ecological', 'Human Health', 'Economic Sovereignty', 'Civic Trust', 'Intergenerational'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-1.5 rounded-xs font-mono text-[11px] transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#C5A059] text-black font-bold shadow'
                  : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              audioFeedback.playSubtleClick();
            }}
            className="p-2 bg-[#161616] hover:bg-[#222] border border-[#F5F5F0]/10 rounded-xs text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer ml-2"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* D3 Canvas Container (8 Cols) */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm relative overflow-hidden flex flex-col justify-between"
          style={{ minHeight: '560px' }}
        >
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#121212]/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-[#F5F5F0]/10 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[#F5F5F0]/80">
              Active Mesh: {filteredNodes.length} Active Nodes • {filteredLinks.length} Verifiable Attributions
            </span>
          </div>

          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: '560px' }}
          />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 bg-[#121212]/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-[#F5F5F0]/10 font-mono text-[10px] text-[#F5F5F0]/70">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" /> 🌿 Project OS Node</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> 💎 Flourishing Index</span>
            </div>

            <span className="text-[10px] font-mono text-[#F5F5F0]/40 bg-[#121212]/80 px-2 py-1 rounded-xs">
              Drag nodes • Click to inspect epistemic audit trail
            </span>
          </div>
        </div>

        {/* Right Detail Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
                <span
                  className="px-2 py-0.5 rounded-xs text-[10px] font-bold"
                  style={{
                    backgroundColor: `${getNodeColor(selectedNode)}20`,
                    color: getNodeColor(selectedNode),
                    border: `1px solid ${getNodeColor(selectedNode)}50`
                  }}
                >
                  {selectedNode.kind === 'PROJECT_OS' ? '🌿 PROJECT OS NODE' : '💎 FLOURISHING INDICATOR'}
                </span>

                <span className="text-emerald-400 font-bold text-[10px]">
                  {selectedNode.progressPercent}% Target Progress
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  {selectedNode.name}
                </h3>
                <span className="text-[11px] text-[#C5A059] block">
                  Bioregion: {selectedNode.bioregion}
                </span>
              </div>

              <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Current Impact Metric:</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Steward Council:</span>
                  <span className="text-[#8FB8DE] font-bold truncate max-w-[170px]">{selectedNode.stewardCouncil}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F0]/10">
                  <span className="text-[#F5F5F0]/60">Epistemic Merkle Proof:</span>
                  <span className="text-emerald-400 text-[10px]">{selectedNode.epistemicProvenanceHash}</span>
                </div>
              </div>

              {/* Connected Attributions */}
              <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] uppercase text-[#C5A059] font-bold block">
                  Attribution Causal Links:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {RESTORATION_PROJECT_LINKS
                    .filter(l => {
                      const s = typeof l.source === 'object' ? (l.source as ProjectFlourishingNode).id : l.source;
                      const t = typeof l.target === 'object' ? (l.target as ProjectFlourishingNode).id : l.target;
                      return s === selectedNode.id || t === selectedNode.id;
                    })
                    .map(link => {
                      const s = typeof link.source === 'object' ? (link.source as ProjectFlourishingNode).id : link.source;
                      const otherId = s === selectedNode.id ? (typeof link.target === 'object' ? (link.target as ProjectFlourishingNode).id : link.target) : s;
                      const otherNode = RESTORATION_PROJECT_NODES.find(n => n.id === otherId);

                      return (
                        <div
                          key={link.id}
                          className="p-2 bg-[#161616] rounded-xs border border-[#F5F5F0]/10 text-[10px] flex items-center justify-between"
                        >
                          <span className="text-[#F5F5F0]/80 truncate max-w-[150px]">
                            {link.metricType} ➔ <strong className="text-white">{otherNode?.name}</strong>
                          </span>
                          <span className="text-[#C5A059] font-bold">{(link.attributionWeight * 100).toFixed(0)}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : selectedLink ? (
            <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase">
                  Attribution Edge Inspector
                </span>
                <span className="text-emerald-400 font-bold">
                  {(selectedLink.attributionWeight * 100).toFixed(0)}% Weight
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#F5F5F0]/50 uppercase">Restoration Mechanism:</span>
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  {selectedLink.metricType}
                </h4>
              </div>

              <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Cryptographic Proof:</span>
                  <span className="text-emerald-400 text-[10px]">{selectedLink.verifiedEvidenceHash}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#F5F5F0]/10 rounded-sm p-8 text-center text-[#F5F5F0]/50 font-mono text-xs">
              Click any project or flourishing indicator node to inspect causal attribution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
