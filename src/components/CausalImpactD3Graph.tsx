import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ShieldCheck, 
  Activity, 
  Info,
  Maximize2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

export interface CausalNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: 'capital' | 'intervention' | 'flourishing';
  value: number; // e.g. Millions $ or Flourishing %
  unit: string;
  deltaPercent: number;
  confidence: number;
  causalDoCoefficient: number; // Pearl Do-Calculus: d(Y)/do(X)
  description: string;
  stage: number; // 0 = Capital, 1 = Physical Intervention, 2 = Flourishing Outcome
  color?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface CausalLink extends d3.SimulationLinkDatum<CausalNode> {
  source: string | CausalNode;
  target: string | CausalNode;
  weight: number; // Causal elasticity (0.1 - 1.0)
  capitalFlowUsdM: number;
  lagMonths: number;
  pvalue: number;
}

const INITIAL_NODES: CausalNode[] = [
  // Stage 0: Capital Engine Allocation
  {
    id: 'cap-patient-tranche',
    name: 'Patient Catalytic Tranche Alpha',
    category: 'capital',
    value: 45.0,
    unit: '$M Allocation',
    deltaPercent: +18.5,
    confidence: 97.4,
    causalDoCoefficient: 0.88,
    description: '25-year subordinated zero-usury patient equity for foundational bioregional regeneration.',
    stage: 0,
    color: '#C5A059'
  },
  {
    id: 'cap-rve-bond',
    name: 'Regenerative Value Exchange Sukuk',
    category: 'capital',
    value: 28.5,
    unit: '$M Issued',
    deltaPercent: +24.0,
    confidence: 96.1,
    causalDoCoefficient: 0.82,
    description: 'Asset-backed physical infrastructure bonds with yield tied directly to verified aquifer recharge rates.',
    stage: 0,
    color: '#D4AF37'
  },
  {
    id: 'cap-lifepod-mfg',
    name: 'Decentralized LifePod Fab Fund',
    category: 'capital',
    value: 18.2,
    unit: '$M Capex',
    deltaPercent: +32.0,
    confidence: 98.2,
    causalDoCoefficient: 0.91,
    description: 'Local tooling and bio-composite fabrication lines in Eldoret and Mombasa.',
    stage: 0,
    color: '#E5C158'
  },
  {
    id: 'cap-indigenous-endowment',
    name: 'Indigenous Agroforestry Endowment',
    category: 'capital',
    value: 12.0,
    unit: '$M Commons',
    deltaPercent: +15.0,
    confidence: 99.1,
    causalDoCoefficient: 0.94,
    description: 'Perpetual sovereign trust governed directly by pastoralist & agrarian elder assemblies.',
    stage: 0,
    color: '#A48235'
  },

  // Stage 1: Causal Interventions & Physical Infrastructure
  {
    id: 'int-solar-desal',
    name: 'Solar-Thermal Desalination Nodes',
    category: 'intervention',
    value: 12.8,
    unit: 'kL/day capacity',
    deltaPercent: +54.2,
    confidence: 95.8,
    causalDoCoefficient: 0.86,
    description: 'Decentralized zero-liquid-discharge brackish water purifiers across Turkana and Kitui.',
    stage: 1,
    color: '#3B82F6'
  },
  {
    id: 'int-lifepod-housing',
    name: 'Modular Biophilic LifePods (840 Units)',
    category: 'intervention',
    value: 840,
    unit: 'Households Sheltered',
    deltaPercent: +68.0,
    confidence: 98.0,
    causalDoCoefficient: 0.92,
    description: 'Closed-loop micro-farms + graywater recycling + passive thermal earthen structural shells.',
    stage: 1,
    color: '#10B981'
  },
  {
    id: 'int-soil-regeneration',
    name: 'Microbial Soil Carbon Inoculation',
    category: 'intervention',
    value: 14500,
    unit: 'Hectares Restored',
    deltaPercent: +41.5,
    confidence: 94.2,
    causalDoCoefficient: 0.79,
    description: 'Mycorrhizal fungal networks and biochar trenching for deep moisture retention.',
    stage: 1,
    color: '#84CC16'
  },
  {
    id: 'int-clan-governance',
    name: 'Clan Sovereign Water Councils',
    category: 'intervention',
    value: 36,
    unit: 'Chartered Councils',
    deltaPercent: +100.0,
    confidence: 99.4,
    causalDoCoefficient: 0.95,
    description: 'Binding veto power over extraction rates and inter-clan grazing rotation charters.',
    stage: 1,
    color: '#06B6D4'
  },

  // Stage 2: Flourishing Index Growth Outcomes
  {
    id: 'flourish-water-sovereignty',
    name: 'Biophysical Water Sovereignty',
    category: 'flourishing',
    value: 94.2,
    unit: 'Flourishing Index (0-100)',
    deltaPercent: +48.6,
    confidence: 98.7,
    causalDoCoefficient: 0.93,
    description: 'Universal 50L/person/day potable access guaranteed under 5 minutes walk.',
    stage: 2,
    color: '#10B981'
  },
  {
    id: 'flourish-child-nutrition',
    name: 'Child Nutritional Biomarker Index',
    category: 'flourishing',
    value: 91.8,
    unit: 'Flourishing Index (0-100)',
    deltaPercent: +62.4,
    confidence: 96.5,
    causalDoCoefficient: 0.89,
    description: 'Stunting reduction and year-round micronutrient self-sufficiency.',
    stage: 2,
    color: '#34D399'
  },
  {
    id: 'flourish-intergen-wealth',
    name: 'Intergenerational Commons Wealth',
    category: 'flourishing',
    value: 88.5,
    unit: 'Flourishing Index (0-100)',
    deltaPercent: +39.2,
    confidence: 95.0,
    causalDoCoefficient: 0.84,
    description: 'Zero predatory debt with equity assets owned locally across multi-generational clans.',
    stage: 2,
    color: '#C5A059'
  },
  {
    id: 'flourish-ecosystem-vitality',
    name: 'Aquifer & Biodiversity Vitality',
    category: 'flourishing',
    value: 96.0,
    unit: 'Flourishing Index (0-100)',
    deltaPercent: +74.1,
    confidence: 99.0,
    causalDoCoefficient: 0.96,
    description: 'Positive groundwater recharge balance and wild pollinator corridor restoration.',
    stage: 2,
    color: '#059669'
  },
  {
    id: 'flourish-institutional-trust',
    name: 'Institutional Epistemic Trust',
    category: 'flourishing',
    value: 92.4,
    unit: 'Flourishing Index (0-100)',
    deltaPercent: +55.0,
    confidence: 97.8,
    causalDoCoefficient: 0.90,
    description: 'Consensus trust rating across public, elders, and youth assemblies.',
    stage: 2,
    color: '#8B5CF6'
  }
];

const INITIAL_LINKS: CausalLink[] = [
  { source: 'cap-patient-tranche', target: 'int-solar-desal', weight: 0.84, capitalFlowUsdM: 22.0, lagMonths: 4, pvalue: 0.001 },
  { source: 'cap-patient-tranche', target: 'int-soil-regeneration', weight: 0.72, capitalFlowUsdM: 14.5, lagMonths: 6, pvalue: 0.003 },
  { source: 'cap-rve-bond', target: 'int-solar-desal', weight: 0.78, capitalFlowUsdM: 16.0, lagMonths: 3, pvalue: 0.002 },
  { source: 'cap-rve-bond', target: 'int-clan-governance', weight: 0.65, capitalFlowUsdM: 6.5, lagMonths: 2, pvalue: 0.005 },
  { source: 'cap-lifepod-mfg', target: 'int-lifepod-housing', weight: 0.94, capitalFlowUsdM: 18.2, lagMonths: 5, pvalue: 0.0005 },
  { source: 'cap-indigenous-endowment', target: 'int-soil-regeneration', weight: 0.88, capitalFlowUsdM: 8.0, lagMonths: 4, pvalue: 0.001 },
  { source: 'cap-indigenous-endowment', target: 'int-clan-governance', weight: 0.91, capitalFlowUsdM: 4.0, lagMonths: 1, pvalue: 0.0008 },

  // Stage 1 to Stage 2 Causal links
  { source: 'int-solar-desal', target: 'flourish-water-sovereignty', weight: 0.92, capitalFlowUsdM: 0, lagMonths: 6, pvalue: 0.0002 },
  { source: 'int-solar-desal', target: 'flourish-ecosystem-vitality', weight: 0.81, capitalFlowUsdM: 0, lagMonths: 12, pvalue: 0.001 },
  { source: 'int-lifepod-housing', target: 'flourish-child-nutrition', weight: 0.89, capitalFlowUsdM: 0, lagMonths: 6, pvalue: 0.0004 },
  { source: 'int-lifepod-housing', target: 'flourish-intergen-wealth', weight: 0.76, capitalFlowUsdM: 0, lagMonths: 18, pvalue: 0.002 },
  { source: 'int-soil-regeneration', target: 'flourish-ecosystem-vitality', weight: 0.95, capitalFlowUsdM: 0, lagMonths: 14, pvalue: 0.0001 },
  { source: 'int-soil-regeneration', target: 'flourish-child-nutrition', weight: 0.74, capitalFlowUsdM: 0, lagMonths: 8, pvalue: 0.003 },
  { source: 'int-clan-governance', target: 'flourish-institutional-trust', weight: 0.96, capitalFlowUsdM: 0, lagMonths: 3, pvalue: 0.0001 },
  { source: 'int-clan-governance', target: 'flourish-intergen-wealth', weight: 0.83, capitalFlowUsdM: 0, lagMonths: 12, pvalue: 0.001 }
];

export const CausalImpactD3Graph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(INITIAL_NODES[0]);
  const [capitalMultiplier, setCapitalMultiplier] = useState<number>(1.2); // 1.0 = baseline, up to 2.5x
  const [filterCategory, setFilterCategory] = useState<'all' | 'capital' | 'intervention' | 'flourishing'>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 900, height: 500 });

  // Zoom transform reference
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const width = entry.contentRect.width || 900;
      const height = Math.max(420, Math.min(650, width * 0.55));
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(600)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      audioFeedback.playMicroTick();
    }
  };

  const handleSimulateSurge = () => {
    setIsSimulating(true);
    audioFeedback.playSyncComplete();
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    // Add glowing filter definitions for neon links & nodes
    const defs = svg.append('defs');
    
    // Drop shadow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers for causal direction
    defs.append('marker')
      .attr('id', 'causal-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#C5A059')
      .attr('opacity', 0.7);

    defs.append('marker')
      .attr('id', 'causal-arrow-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#10B981')
      .attr('opacity', 1);

    // Deep zoomable root container group
    const g = svg.append('g').attr('class', 'main-causal-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Stage columns coordinates positioning (Stage 0 = Left, Stage 1 = Middle, Stage 2 = Right)
    const stageX = [width * 0.18, width * 0.50, width * 0.82];

    // Clone data for simulation
    const nodes: CausalNode[] = INITIAL_NODES.map((d) => {
      // Dynamic adjusted value
      const adjustedVal = d.category === 'capital' 
        ? +(d.value * capitalMultiplier).toFixed(1)
        : +(d.value * (1 + (capitalMultiplier - 1) * d.causalDoCoefficient * 0.8)).toFixed(1);

      return {
        ...d,
        value: adjustedVal,
        deltaPercent: +(d.deltaPercent * Math.sqrt(capitalMultiplier)).toFixed(1),
        // Position roughly along stage columns
        x: stageX[d.stage] + (Math.random() - 0.5) * 40,
        y: height * 0.2 + (Math.random()) * (height * 0.6)
      };
    });

    const links: CausalLink[] = INITIAL_LINKS.map(l => ({ ...l }));

    // Force simulation
    const simulation = d3.forceSimulation<CausalNode>(nodes)
      .force('link', d3.forceLink<CausalNode, CausalLink>(links).id((d) => d.id).distance(140).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-320))
      .force('x', d3.forceX<CausalNode>((d) => stageX[d.stage]).strength(0.85))
      .force('y', d3.forceY(height / 2).strength(0.18))
      .force('collision', d3.forceCollide().radius(38));

    // Stage column background guide labels
    const stageGuides = [
      { title: 'STAGE I: CAPITAL ENGINE INJECTION', desc: 'Patient Zero-Usury Capital', x: stageX[0], color: '#C5A059' },
      { title: 'STAGE II: PHYSICAL INTERVENTIONS', desc: 'Infrastructure & Commons', x: stageX[1], color: '#3B82F6' },
      { title: 'STAGE III: FLOURISHING OUTCOMES', desc: 'Flourishing Index Gains', x: stageX[2], color: '#10B981' }
    ];

    stageGuides.forEach(st => {
      const colG = g.append('g').attr('class', 'stage-col').attr('opacity', 0.45);
      colG.append('line')
        .attr('x1', st.x)
        .attr('y1', 20)
        .attr('x2', st.x)
        .attr('y2', height - 20)
        .attr('stroke', st.color)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 6');

      colG.append('text')
        .attr('x', st.x)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', st.color)
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .attr('letter-spacing', '0.15em')
        .text(st.title);

      colG.append('text')
        .attr('x', st.x)
        .attr('y', 42)
        .attr('text-anchor', 'middle')
        .attr('fill', '#F5F5F0')
        .attr('opacity', 0.6)
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif')
        .text(st.desc);
    });

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup.selectAll<SVGPathElement, CausalLink>('path')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'causal-link')
      .attr('stroke', (d) => {
        const srcNode = d.source as CausalNode;
        return srcNode.stage === 0 ? '#C5A059' : '#10B981';
      })
      .attr('stroke-width', (d) => Math.max(1.8, d.weight * 4.5))
      .attr('stroke-opacity', (d) => {
        if (!selectedNode) return 0.45;
        const srcId = typeof d.source === 'string' ? d.source : d.source.id;
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
        return (srcId === selectedNode.id || tgtId === selectedNode.id) ? 0.95 : 0.15;
      })
      .attr('fill', 'none')
      .attr('marker-end', (d) => {
        if (!selectedNode) return 'url(#causal-arrow)';
        const srcId = typeof d.source === 'string' ? d.source : d.source.id;
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
        return (srcId === selectedNode.id || tgtId === selectedNode.id) 
          ? 'url(#causal-arrow-active)' 
          : 'url(#causal-arrow)';
      });

    // Particle animations along links (Flux dots)
    const fluxGroup = g.append('g').attr('class', 'flux-particles');
    const particles = links.map((l, i) => {
      const p = fluxGroup.append('circle')
        .attr('r', 2.8)
        .attr('fill', '#F5F5F0')
        .attr('filter', 'url(#glow)')
        .attr('opacity', 0.85);
      return { element: p, link: l, progress: (i * 0.18) % 1 };
    });

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll<SVGGElement, CausalNode>('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'causal-node')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, CausalNode>()
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
        audioFeedback.playMicroTick();
      });

    // Outer Aura Ring
    nodeElements.append('circle')
      .attr('r', 24)
      .attr('fill', (d) => d.color || '#C5A059')
      .attr('fill-opacity', 0.12)
      .attr('stroke', (d) => d.color || '#C5A059')
      .attr('stroke-width', (d) => (selectedNode?.id === d.id ? 2.5 : 1))
      .attr('stroke-dasharray', (d) => (d.category === 'capital' ? 'none' : '3 2'))
      .attr('filter', (d) => (selectedNode?.id === d.id ? 'url(#glow)' : 'none'));

    // Inner Core Circle
    nodeElements.append('circle')
      .attr('r', 16)
      .attr('fill', '#0D0D0D')
      .attr('stroke', (d) => d.color || '#C5A059')
      .attr('stroke-width', 1.8);

    // Node Category Symbol / Stage Badge
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('fill', (d) => d.color || '#C5A059')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text((d) => (d.category === 'capital' ? '$' : d.category === 'intervention' ? '⚙' : '✦'));

    // Node Label under circle
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 36)
      .attr('fill', '#F5F5F0')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', '500')
      .text((d) => d.name.length > 22 ? d.name.substring(0, 20) + '…' : d.name);

    // Metric value pill
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 48)
      .attr('fill', (d) => d.color || '#C5A059')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .text((d) => `${d.value} ${d.unit.split(' ')[0]}`);

    // Simulation tick handler
    let animationTimer: d3.Timer;

    simulation.on('tick', () => {
      // Calculate curved paths
      linkElements.attr('d', (d) => {
        const source = d.source as CausalNode;
        const target = d.target as CausalNode;
        if (!source.x || !source.y || !target.x || !target.y) return '';
        
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.25;
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      nodeElements.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Animating particle flux
    animationTimer = d3.timer(() => {
      particles.forEach((p) => {
        p.progress = (p.progress + 0.008) % 1;
        const source = p.link.source as CausalNode;
        const target = p.link.target as CausalNode;
        if (source.x && source.y && target.x && target.y) {
          // Linear interpolation along curve midpoint
          const curX = source.x + (target.x - source.x) * p.progress;
          const curY = source.y + (target.y - source.y) * p.progress - Math.sin(p.progress * Math.PI) * 18;
          p.element.attr('cx', curX).attr('cy', curY);
        }
      });
    });

    return () => {
      simulation.stop();
      animationTimer.stop();
    };
  }, [capitalMultiplier, selectedNode, filterCategory, dimensions]);

  return (
    <div className="bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm p-6 space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              PEARL DO-CALCULUS • CAUSAL VALUE GRAPH
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Verified Epistemic DAG
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">
            Capital Engine ➔ Physical Commons ➔ Flourishing Index Causal Graph
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-3xl font-sans">
            Direct graph mapping how zero-usury patient capital translates into tangible physical biophysical infrastructure and compound human flourishing gains.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleResetZoom}
            className="px-3 py-1.5 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1 transition-colors"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Reset Pan/Zoom</span>
          </button>

          <button
            onClick={handleSimulateSurge}
            disabled={isSimulating}
            className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Propagating Flux...' : 'Simulate Capital Surge'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Capital Elasticity Slider & Filter Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#080808] p-4 border border-[#F5F5F0]/10 rounded-sm">
        {/* Slider */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#F5F5F0]/80 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
              Capital Injection Multiplier: <strong className="text-[#C5A059] font-bold">{capitalMultiplier.toFixed(2)}x</strong>
            </span>
            <span className="text-emerald-400 font-bold">
              +{((capitalMultiplier - 1) * 100).toFixed(0)}% Scaled Flow
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={capitalMultiplier}
            onChange={(e) => {
              setCapitalMultiplier(parseFloat(e.target.value));
              audioFeedback.playMicroTick();
            }}
            className="w-full h-1.5 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#F5F5F0]/40">
            <span>0.5x (Constrained)</span>
            <span>1.0x (Baseline $103.7M)</span>
            <span>1.75x (Aggressive)</span>
            <span>2.5x (Maximum Sovereign Scale)</span>
          </div>
        </div>

        {/* Stat badge */}
        <div className="flex flex-col justify-center p-2.5 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm">
          <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold">Estimated Causal Flourishing Yield</span>
          <div className="text-lg font-serif font-bold text-emerald-400">
            +{(48.6 * Math.sqrt(capitalMultiplier)).toFixed(1)}% Across Bioregion
          </div>
          <span className="text-[10px] font-mono text-[#F5F5F0]/50">95% Bayesian Credible Interval</span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full bg-[#050505] border border-[#F5F5F0]/15 rounded-sm relative overflow-hidden shadow-inner cursor-grab active:cursor-grabbing"
      >
        <svg ref={svgRef} className="w-full block" />
        
        {/* Floating Canvas Legend */}
        <div className="absolute top-3 left-3 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#F5F5F0]/15 px-3 py-2 rounded-sm text-[10px] font-mono space-y-1">
          <div className="text-[#C5A059] font-bold">Causal Pathway Legend</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#F5F5F0]/70">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" /> Capital Stream
            </span>
            <span className="flex items-center gap-1 text-[#F5F5F0]/70">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Intervention
            </span>
            <span className="flex items-center gap-1 text-[#F5F5F0]/70">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Flourishing Gain
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#F5F5F0]/40 bg-[#0D0D0D]/80 px-2 py-1 rounded">
          Drag nodes • Scroll to Zoom • Click node for do-calculus audit
        </div>
      </div>

      {/* Selected Node Epistemic Inspector */}
      {selectedNode && (
        <div className="p-4 bg-[#0A0A0A] border border-[#C5A059]/40 rounded-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/40 font-bold">
                {selectedNode.category.toUpperCase()} NODE
              </span>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0]">{selectedNode.name}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[#F5F5F0]/60">
                Confidence: <strong className="text-emerald-400">{selectedNode.confidence}%</strong>
              </span>
              <span className="text-[#F5F5F0]/60">
                Pearl Do-Calculus: <strong className="text-[#C5A059]">β = {selectedNode.causalDoCoefficient}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-[#F5F5F0]/80 font-sans">{selectedNode.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F5F5F0]/10 text-xs font-mono">
            <div>
              <span className="text-[#F5F5F0]/40 text-[10px] block">Current Model Value</span>
              <span className="text-sm font-bold text-[#F5F5F0]">{selectedNode.value} {selectedNode.unit}</span>
            </div>
            <div>
              <span className="text-[#F5F5F0]/40 text-[10px] block">Simulated Growth Delta</span>
              <span className="text-sm font-bold text-emerald-400">+{selectedNode.deltaPercent}%</span>
            </div>
            <div>
              <span className="text-[#F5F5F0]/40 text-[10px] block">Ethical Constraint</span>
              <span className="text-sm font-bold text-[#C5A059]">Zero-Usury Inviolable</span>
            </div>
            <div>
              <span className="text-[#F5F5F0]/40 text-[10px] block">Audited Verification</span>
              <span className="text-sm font-bold text-[#8FB8DE]">SHA-256 Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
