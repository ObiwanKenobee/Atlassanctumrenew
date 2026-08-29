import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Network,
  Sparkles,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  BookOpen,
  Radio,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Trash2,
  Layers,
  FileText,
  Activity,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { useAutoSaveForm } from '../../hooks/useAutoSaveForm';

export type KnowledgeNodeType = 'LIVING_REALITY' | 'RESEARCH_FINDING' | 'INTERVENTION_PROJECT' | 'ECOLOGICAL_METRIC';

export interface KnowledgeNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  category: string;
  confidenceScore: number; // 0-100
  empiricalSource?: string;
  description: string;
  valValue?: string;
  provenanceHash: string;
  status: 'VERIFIED' | 'HYPOTHESIS' | 'TELEMETRY_LINKED';
}

export interface KnowledgeLink extends d3.SimulationLinkDatum<KnowledgeNode> {
  id: string;
  source: string | KnowledgeNode;
  target: string | KnowledgeNode;
  relationship: string;
  causalStrength: number; // 0-1
  bidirectional: boolean;
  p_value?: number;
  evidenceRef?: string;
}

export const DEFAULT_KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'lr-01',
    name: 'Turkana Desalination Sensor Stream',
    type: 'LIVING_REALITY',
    category: 'Hydrology',
    confidenceScore: 98,
    empiricalSource: 'LoRaWAN IoT Sensor Node #TK-04',
    description: 'Real-time solar desalination ceramic core telemetry reporting 4.82 kW throughput and 0% salt encrustation.',
    valValue: '4.82 kW / 14,200 L/day',
    provenanceHash: '0x9b41...f4e2',
    status: 'TELEMETRY_LINKED'
  },
  {
    id: 'rf-01',
    name: 'Glomalin Soil Aggregation Protocol',
    type: 'RESEARCH_FINDING',
    category: 'Soil Science',
    confidenceScore: 96,
    empiricalSource: 'Rotich et al., 2026 (Aberdare Forest Basin)',
    description: 'Empirical finding establishing that Podocarpus root exudates yield 18.2 mg/g glomalin aggregate stability (p < 0.001, n=48).',
    valValue: '18.2 mg/g glomalin',
    provenanceHash: '0x3a78...b112',
    status: 'VERIFIED'
  },
  {
    id: 'lr-02',
    name: 'Mathare Riparian Turbidity Sensors',
    type: 'LIVING_REALITY',
    category: 'Urban Ecology',
    confidenceScore: 95,
    empiricalSource: 'Nairobi River Basin Piezometer Mesh',
    description: 'Ultrasonic streamflow monitoring stations recording rapid turbidity drops across bio-swale segments.',
    valValue: '24.8 NTU (-72%)',
    provenanceHash: '0x44d1...c990',
    status: 'TELEMETRY_LINKED'
  },
  {
    id: 'rf-02',
    name: 'Vetiver Bio-Swale Infiltration Dynamics',
    type: 'RESEARCH_FINDING',
    category: 'Ecological Engineering',
    confidenceScore: 94,
    empiricalSource: 'Wanjiku & Mwangi, 2026',
    description: 'Field studies demonstrating deep root anchoring prevents high-velocity siltation runoff during 50-year storm surge events.',
    valValue: '-72% Suspended Solids',
    provenanceHash: '0x88f2...001b',
    status: 'VERIFIED'
  },
  {
    id: 'prj-01',
    name: 'Aberdare Agroforestry & Podocarpus Mesh',
    type: 'INTERVENTION_PROJECT',
    category: 'Reforestation',
    confidenceScore: 92,
    empiricalSource: 'Project OS ID #PRJ-AB-01',
    description: 'Active 850-hectare native canopy restoration project connecting highland wildlife corridors to lowland agroforests.',
    valValue: '850 Hectares Active',
    provenanceHash: '0x71e9...aa54',
    status: 'VERIFIED'
  },
  {
    id: 'em-01',
    name: 'Upper Catchment Aquifer Head Pressure',
    type: 'ECOLOGICAL_METRIC',
    category: 'Hydrology',
    confidenceScore: 99,
    empiricalSource: 'Groundwater Survey Benchmark 2026',
    description: 'Subterranean piezometric hydraulic head sustaining regional river baseflow for 4.2M downstream citizens.',
    valValue: '1.84 bar Hydraulic Head',
    provenanceHash: '0x10ae...ff33',
    status: 'VERIFIED'
  }
];

export const DEFAULT_KNOWLEDGE_LINKS: KnowledgeLink[] = [
  {
    id: 'link-01',
    source: 'rf-01',
    target: 'prj-01',
    relationship: 'Directly Informs Design of',
    causalStrength: 0.95,
    bidirectional: false,
    p_value: 0.001,
    evidenceRef: 'Field Trials in Quad-3'
  },
  {
    id: 'link-02',
    source: 'prj-01',
    target: 'em-01',
    relationship: 'Increases Infiltration into',
    causalStrength: 0.88,
    bidirectional: false,
    p_value: 0.004,
    evidenceRef: 'Piezometer Telemetry 2026'
  },
  {
    id: 'link-03',
    source: 'rf-02',
    target: 'lr-02',
    relationship: 'Empirically Validated By',
    causalStrength: 0.94,
    bidirectional: true,
    p_value: 0.002,
    evidenceRef: 'Continuous Turbidity Loggers'
  },
  {
    id: 'link-04',
    source: 'lr-01',
    target: 'em-01',
    relationship: 'Mitigates Deep Drawdown of',
    causalStrength: 0.82,
    bidirectional: false,
    p_value: 0.015,
    evidenceRef: 'Solar Inverter Energy Ledger'
  }
];

interface NewAnnotationState {
  sourceNodeId: string;
  targetNodeId: string;
  relationshipName: string;
  causalStrength: number;
  evidenceCitation: string;
  notes: string;
}

export const KnowledgeGraphStudio: React.FC<{
  onInspectProvenance?: (prov: any) => void;
}> = ({ onInspectProvenance }) => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>(DEFAULT_KNOWLEDGE_NODES);
  const [links, setLinks] = useState<KnowledgeLink[]>(DEFAULT_KNOWLEDGE_LINKS);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(nodes[0]);
  const [selectedLink, setSelectedLink] = useState<KnowledgeLink | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | KnowledgeNodeType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAddingNodeModal, setIsAddingNodeModal] = useState<boolean>(false);
  const [isAddingAnnotationModal, setIsAddingAnnotationModal] = useState<boolean>(false);

  // Auto-Save for Annotation Layer using the dedicated hook
  const {
    formData: annotationDraft,
    updateField: updateAnnotationField,
    lastSavedTime: annotationLastSaved,
    isDraftRestored: isAnnotationRestored,
    clearDraft: clearAnnotationDraft
  } = useAutoSaveForm<NewAnnotationState>({
    key: 'knowledge_studio_annotation_layer',
    initialValue: {
      sourceNodeId: DEFAULT_KNOWLEDGE_NODES[0].id,
      targetNodeId: DEFAULT_KNOWLEDGE_NODES[1].id,
      relationshipName: 'Validates Hypotheses In',
      causalStrength: 0.85,
      evidenceCitation: 'Field telemetry station #04 empirical run',
      notes: 'Observed positive correlation between Podocarpus canopy volume and soil organic matter retention.'
    }
  });

  // Auto-Save for New Node Creator Form
  const {
    formData: newNodeDraft,
    updateField: updateNodeField,
    lastSavedTime: nodeLastSaved,
    clearDraft: clearNodeDraft
  } = useAutoSaveForm<{
    name: string;
    type: KnowledgeNodeType;
    category: string;
    confidenceScore: number;
    empiricalSource: string;
    description: string;
    valValue: string;
  }>({
    key: 'knowledge_studio_new_node',
    initialValue: {
      name: '',
      type: 'RESEARCH_FINDING',
      category: 'Agroecology',
      confidenceScore: 90,
      empiricalSource: '',
      description: '',
      valValue: ''
    }
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<KnowledgeNode, KnowledgeLink> | null>(null);

  // Filtered nodes
  const filteredNodes = nodes.filter(n => {
    const matchesFilter = activeFilter === 'ALL' || n.type === activeFilter;
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredLinks = links.filter(l => {
    const sourceId = typeof l.source === 'object' ? (l.source as KnowledgeNode).id : l.source;
    const targetId = typeof l.target === 'object' ? (l.target as KnowledgeNode).id : l.target;
    return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
  });

  // Node color helper
  const getNodeColor = (type: KnowledgeNodeType) => {
    switch (type) {
      case 'LIVING_REALITY':
        return '#34D399'; // Emerald
      case 'RESEARCH_FINDING':
        return '#60A5FA'; // Blue
      case 'INTERVENTION_PROJECT':
        return '#C5A059'; // Gold
      case 'ECOLOGICAL_METRIC':
        return '#F472B6'; // Rose
      default:
        return '#A78BFA';
    }
  };

  // D3 Graph Simulation Initialization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 520;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create container group for zoom & pan
    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Arrow markers
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow-head')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#C5A059')
      .attr('opacity', 0.6);

    // Links data copy
    const simLinks = filteredLinks.map(d => ({ ...d }));
    const simNodes = filteredNodes.map(d => ({ ...d }));

    // Force Simulation
    const simulation = d3.forceSimulation<KnowledgeNode>(simNodes)
      .force('link', d3.forceLink<KnowledgeNode, KnowledgeLink>(simLinks).id(d => d.id).distance(140))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    simulationRef.current = simulation;

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup.selectAll('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', '#C5A059')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => Math.max(1.5, d.causalStrength * 3.5))
      .attr('stroke-dasharray', (d) => (d.p_value && d.p_value < 0.01 ? 'none' : '4,3'))
      .attr('marker-end', 'url(#arrow-head)')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedLink(d);
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
      .attr('opacity', 0.75)
      .text(d => d.relationship);

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll('.node')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, KnowledgeNode>()
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

    // Node Outer Pulse for Telemetry linked
    nodeElements.filter(d => d.type === 'LIVING_REALITY')
      .append('circle')
      .attr('r', 24)
      .attr('fill', 'none')
      .attr('stroke', '#34D399')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-dasharray', '3,3');

    // Node Circles
    nodeElements.append('circle')
      .attr('r', (d) => (d.id === selectedNode?.id ? 20 : 16))
      .attr('fill', (d) => '#0F1713')
      .attr('stroke', (d) => getNodeColor(d.type))
      .attr('stroke-width', (d) => (d.id === selectedNode?.id ? 3 : 2));

    // Inner icon symbol
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .text((d) => {
        if (d.type === 'LIVING_REALITY') return '📡';
        if (d.type === 'RESEARCH_FINDING') return '🔬';
        if (d.type === 'INTERVENTION_PROJECT') return '🌿';
        return '📊';
      });

    // Node Labels
    nodeElements.append('text')
      .attr('dy', 28)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F5F5F0')
      .attr('font-size', '10px')
      .attr('font-family', 'serif')
      .attr('font-weight', 'bold')
      .text((d) => (d.name.length > 20 ? d.name.slice(0, 18) + '...' : d.name));

    // Simulation tick
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

  // Handle Commit New Node
  const handleCommitNewNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeDraft.name.trim()) return;

    const newNode: KnowledgeNode = {
      id: `node-${Date.now()}`,
      name: newNodeDraft.name,
      type: newNodeDraft.type,
      category: newNodeDraft.category || 'General Ecology',
      confidenceScore: newNodeDraft.confidenceScore,
      empiricalSource: newNodeDraft.empiricalSource || 'Atlas Epistemic Ingestion Hub',
      description: newNodeDraft.description || 'Interdisciplinary evidence node mapping empirical phenomena to civilizational flourishing.',
      valValue: newNodeDraft.valValue || 'Calibrated',
      provenanceHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      status: newNodeDraft.type === 'LIVING_REALITY' ? 'TELEMETRY_LINKED' : 'VERIFIED'
    };

    setNodes(prev => [newNode, ...prev]);
    setSelectedNode(newNode);
    setIsAddingNodeModal(false);
    clearNodeDraft();
    audioFeedback.playSuccess();
  };

  // Handle Commit New Annotation / Relationship
  const handleCommitAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annotationDraft.sourceNodeId || !annotationDraft.targetNodeId) return;

    const newLink: KnowledgeLink = {
      id: `link-${Date.now()}`,
      source: annotationDraft.sourceNodeId,
      target: annotationDraft.targetNodeId,
      relationship: annotationDraft.relationshipName || 'Correlates with',
      causalStrength: Number(annotationDraft.causalStrength) || 0.85,
      bidirectional: false,
      p_value: 0.005,
      evidenceRef: annotationDraft.evidenceCitation || 'Empirical field validation log'
    };

    setLinks(prev => [newLink, ...prev]);
    setIsAddingAnnotationModal(false);
    clearAnnotationDraft();
    audioFeedback.playSuccess();
  };

  return (
    <div className={`bg-[#0A0A0A] text-[#F5F5F0] rounded-sm border border-[#C5A059]/40 p-6 space-y-6 transition-all ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-[#070707] p-8' : ''}`}>
      {/* Studio Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#C5A059]" />
              INTERDISCIPLINARY CAUSAL MESH • LIVING REALITY ↔ RESEARCH GRAPH STUDIO
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Knowledge Graph Studio
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-3xl font-sans">
            Map relationships between real-time <span className="text-emerald-400 font-bold">Living Reality</span> sensor telemetry, peer-reviewed <span className="text-blue-400 font-bold">Research Findings</span>, and physical <span className="text-[#C5A059] font-bold">Intervention Projects</span> with interactive D3 force dynamics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setIsAddingAnnotationModal(true);
              audioFeedback.playSubtleClick();
            }}
            className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] rounded-xs font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>+ Link Annotation</span>
          </button>

          <button
            onClick={() => {
              setIsAddingNodeModal(true);
              audioFeedback.playSubtleClick();
            }}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black rounded-xs font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Evidence Node</span>
          </button>

          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              audioFeedback.playSubtleClick();
            }}
            className="p-2 bg-[#161616] hover:bg-[#222] border border-[#F5F5F0]/10 rounded-xs text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'ALL', label: 'All Entities' },
            { id: 'LIVING_REALITY', label: '📡 Living Reality (IoT)', color: 'text-emerald-400' },
            { id: 'RESEARCH_FINDING', label: '🔬 Research Finding', color: 'text-blue-400' },
            { id: 'INTERVENTION_PROJECT', label: '🌿 Intervention Projects', color: 'text-[#C5A059]' },
            { id: 'ECOLOGICAL_METRIC', label: '📊 Ecological Metrics', color: 'text-rose-400' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id as any);
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#181818] border border-[#C5A059] text-[#F5F5F0] font-bold shadow'
                  : 'bg-[#121212] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              <span className={tab.color}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#F5F5F0]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes, telemetry, papers..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-[#F5F5F0]/15 rounded-xs text-[#F5F5F0] text-xs outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas Visualizer (8 Cols) */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm relative overflow-hidden flex flex-col justify-between"
          style={{ minHeight: '520px' }}
        >
          {/* Canvas Top Bar Indicator */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#121212]/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-[#F5F5F0]/10 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#F5F5F0]/70">D3 Force Layout: {filteredNodes.length} Nodes • {filteredLinks.length} Causal Links</span>
          </div>

          {/* D3 SVG Container */}
          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: '520px' }}
          />

          {/* Canvas Bottom Legend */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 bg-[#121212]/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-[#F5F5F0]/10 font-mono text-[10px] text-[#F5F5F0]/60">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Living Reality</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Research</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C5A059]" /> Project OS</span>
            </div>

            <span className="text-[10px] font-mono text-[#F5F5F0]/40 bg-[#121212]/80 px-2 py-1 rounded-xs">
              Drag nodes to rearrange • Click to inspect
            </span>
          </div>
        </div>

        {/* Right Inspector Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
                <span
                  className="px-2 py-0.5 rounded-xs text-[10px] font-bold"
                  style={{
                    backgroundColor: `${getNodeColor(selectedNode.type)}20`,
                    color: getNodeColor(selectedNode.type),
                    border: `1px solid ${getNodeColor(selectedNode.type)}50`
                  }}
                >
                  {selectedNode.type}
                </span>

                <span className="text-[10px] text-[#C5A059]">
                  {selectedNode.status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  {selectedNode.name}
                </h3>
                <span className="text-[11px] text-[#C5A059] block">
                  Category: {selectedNode.category}
                </span>
              </div>

              <p className="text-xs text-[#F5F5F0]/80 font-serif leading-relaxed">
                "{selectedNode.description}"
              </p>

              <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Empirical Origin:</span>
                  <span className="text-[#8FB8DE] font-bold truncate max-w-[170px]">{selectedNode.empiricalSource}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Metric / Reading:</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.valValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Epistemic Confidence:</span>
                  <span className="text-[#C5A059] font-bold">{selectedNode.confidenceScore}%</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F0]/10">
                  <span className="text-[#F5F5F0]/60">Merkle Provenance:</span>
                  <span className="text-[10px] text-emerald-400">{selectedNode.provenanceHash}</span>
                </div>
              </div>

              {/* Connected Links of Selected Node */}
              <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] uppercase text-[#C5A059] font-bold block">
                  Connected Relationships:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {links
                    .filter(l => {
                      const s = typeof l.source === 'object' ? (l.source as KnowledgeNode).id : l.source;
                      const t = typeof l.target === 'object' ? (l.target as KnowledgeNode).id : l.target;
                      return s === selectedNode.id || t === selectedNode.id;
                    })
                    .map(link => {
                      const s = typeof link.source === 'object' ? (link.source as KnowledgeNode).id : link.source;
                      const isOutgoing = s === selectedNode.id;
                      const otherId = isOutgoing ? (typeof link.target === 'object' ? (link.target as KnowledgeNode).id : link.target) : s;
                      const otherNode = nodes.find(n => n.id === otherId);

                      return (
                        <div
                          key={link.id}
                          className="p-2 bg-[#161616] rounded-xs border border-[#F5F5F0]/10 text-[10px] flex items-center justify-between"
                        >
                          <span className="text-[#F5F5F0]/70 truncate max-w-[140px]">
                            {isOutgoing ? '➜ ' : '⬅ '} {link.relationship} <strong className="text-white">{otherNode?.name}</strong>
                          </span>
                          <span className="text-emerald-400 font-bold">{(link.causalStrength * 100).toFixed(0)}%</span>
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
                  Causal Link Inspector
                </span>
                <span className="text-emerald-400 font-bold">
                  p &lt; {selectedLink.p_value || 0.005}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#F5F5F0]/50 uppercase">Relationship Type:</span>
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  {selectedLink.relationship}
                </h4>
              </div>

              <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Causal Strength:</span>
                  <span className="text-[#C5A059] font-bold">{(selectedLink.causalStrength * 100).toFixed(0)}% Impact</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/60">Evidence Citation:</span>
                  <span className="text-[#8FB8DE] font-bold">{selectedLink.evidenceRef}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#F5F5F0]/10 rounded-sm p-8 text-center text-[#F5F5F0]/50 font-mono text-xs">
              Select any node or causal edge in the graph to inspect empirical grounding.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD EVIDENCE NODE (With Auto-Save Cache) */}
      {/* ========================================================================= */}
      {isAddingNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121212] border border-[#C5A059] rounded-sm max-w-lg w-full p-6 space-y-4 font-mono text-xs text-[#F5F5F0] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-[#C5A059] font-bold">
                  Add Evidence Node (Auto-Saved)
                </span>
                {nodeLastSaved && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-xs">
                    Draft Cached {nodeLastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsAddingNodeModal(false)}
                className="text-[#F5F5F0]/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCommitNewNode} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Entity Name:</label>
                <input
                  type="text"
                  required
                  value={newNodeDraft.name}
                  onChange={(e) => updateNodeField('name', e.target.value)}
                  placeholder="e.g. Mara Basin Rain Infiltration Array"
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Node Type:</label>
                  <select
                    value={newNodeDraft.type}
                    onChange={(e) => updateNodeField('type', e.target.value as any)}
                    className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                  >
                    <option value="RESEARCH_FINDING">🔬 Research Finding</option>
                    <option value="LIVING_REALITY">📡 Living Reality (IoT)</option>
                    <option value="INTERVENTION_PROJECT">🌿 Intervention Project</option>
                    <option value="ECOLOGICAL_METRIC">📊 Ecological Metric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Category:</label>
                  <input
                    type="text"
                    value={newNodeDraft.category}
                    onChange={(e) => updateNodeField('category', e.target.value)}
                    placeholder="Hydrology, Soil, Forest..."
                    className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Empirical Source / Citation:</label>
                <input
                  type="text"
                  value={newNodeDraft.empiricalSource}
                  onChange={(e) => updateNodeField('empiricalSource', e.target.value)}
                  placeholder="e.g. Aberdare In-Situ Hydrological Sensor Mesh #09"
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Empirical Description & Findings:</label>
                <textarea
                  rows={3}
                  value={newNodeDraft.description}
                  onChange={(e) => updateNodeField('description', e.target.value)}
                  placeholder="Summarize the core observation, sample size, or telemetry frequency..."
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none font-serif text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={clearNodeDraft}
                  className="text-[10px] text-[#F5F5F0]/40 hover:text-rose-400 cursor-pointer"
                >
                  Clear Draft Cache
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNodeModal(false)}
                    className="px-3 py-1.5 bg-[#222] text-[#F5F5F0]/70 rounded-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase rounded-xs cursor-pointer shadow"
                  >
                    Commit Node to Graph
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD ANNOTATION LAYER (With Auto-Save Cache) */}
      {/* ========================================================================= */}
      {isAddingAnnotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121212] border border-[#C5A059] rounded-sm max-w-lg w-full p-6 space-y-4 font-mono text-xs text-[#F5F5F0] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-[#C5A059] font-bold">
                  Create Annotation Layer (Auto-Saved)
                </span>
                {annotationLastSaved && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-xs">
                    Draft Restored {annotationLastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsAddingAnnotationModal(false)}
                className="text-[#F5F5F0]/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCommitAnnotation} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Source Node:</label>
                  <select
                    value={annotationDraft.sourceNodeId}
                    onChange={(e) => updateAnnotationField('sourceNodeId', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Target Node:</label>
                  <select
                    value={annotationDraft.targetNodeId}
                    onChange={(e) => updateAnnotationField('targetNodeId', e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Relationship Label:</label>
                <input
                  type="text"
                  required
                  value={annotationDraft.relationshipName}
                  onChange={(e) => updateAnnotationField('relationshipName', e.target.value)}
                  placeholder="e.g. Increases Hydraulic Head In, Empirically Refutes..."
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Causal Impact Strength ({((annotationDraft.causalStrength || 0.8) * 100).toFixed(0)}%):</label>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={annotationDraft.causalStrength}
                  onChange={(e) => updateAnnotationField('causalStrength', parseFloat(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Evidence Citation:</label>
                <input
                  type="text"
                  value={annotationDraft.evidenceCitation}
                  onChange={(e) => updateAnnotationField('evidenceCitation', e.target.value)}
                  placeholder="e.g. Field sensor station #04 regression log"
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Annotation Notes:</label>
                <textarea
                  rows={2}
                  value={annotationDraft.notes}
                  onChange={(e) => updateAnnotationField('notes', e.target.value)}
                  placeholder="Detailed notes on causal directionality and boundary conditions..."
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none font-serif text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={clearAnnotationDraft}
                  className="text-[10px] text-[#F5F5F0]/40 hover:text-rose-400 cursor-pointer"
                >
                  Clear Draft Cache
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAnnotationModal(false)}
                    className="px-3 py-1.5 bg-[#222] text-[#F5F5F0]/70 rounded-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase rounded-xs cursor-pointer shadow"
                  >
                    Anchor Annotation Link
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
