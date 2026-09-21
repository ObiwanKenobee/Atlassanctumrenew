import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  Maximize2, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  Filter, 
  Download,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface CapitalSubNode {
  id: string;
  name: string;
  value: number; // in RVE units or index
  flourishingMultiplier: number;
  verificationCertainty: number;
  proofHash: string;
  description: string;
  velocity: string;
}

export interface CapitalFormNode {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgRgba: string;
  description: string;
  children: CapitalSubNode[];
}

export const EIGHT_FORMS_DATA: Record<string, CapitalFormNode[]> = {
  global: [
    {
      id: 'living',
      name: 'Living / Natural Capital',
      shortName: 'Living',
      color: '#10B981', // Emerald
      bgRgba: 'rgba(16, 185, 129, 0.18)',
      description: 'Photosynthetic biomass, soil microbiomes, clean riparian flow, and species richness.',
      children: [
        { id: 'l1', name: 'Soil Organic Carbon (SOC)', value: 840, flourishingMultiplier: 4.2, verificationCertainty: 99.4, proofHash: '0x8f1a...43e1', description: 'Verified topsoil humus accumulation across regenerative agroforestry corridors.', velocity: '+18.4% YoY' },
        { id: 'l2', name: 'Riparian Buffer Canopies', value: 620, flourishingMultiplier: 3.8, verificationCertainty: 98.6, proofHash: '0x3a4b...92d1', description: 'Continuous indigenous riverbank trees preventing silt erosion and cooling baseflow.', velocity: '+12.1% YoY' },
        { id: 'l3', name: 'Pollinator & Avian Corridors', value: 490, flourishingMultiplier: 3.5, verificationCertainty: 97.2, proofHash: '0x99cc...aa12', description: 'Bio-acoustic sensor array verified insect biodiversity index in perennial zones.', velocity: '+21.5% YoY' },
        { id: 'l4', name: 'Mycelial Fungal Networks', value: 380, flourishingMultiplier: 4.6, verificationCertainty: 96.8, proofHash: '0x44ff...55ba', description: 'Underground symbiotic fungal inoculation increasing drought resilience by 34%.', velocity: '+27.0% YoY' }
      ]
    },
    {
      id: 'material',
      name: 'Material Capital',
      shortName: 'Material',
      color: '#94A3B8', // Slate
      bgRgba: 'rgba(148, 163, 184, 0.18)',
      description: 'Durable physical infrastructure, passive solar structures, and commons tool reserves.',
      children: [
        { id: 'm1', name: 'Passive Solar Microgrids', value: 580, flourishingMultiplier: 3.1, verificationCertainty: 98.9, proofHash: '0x712a...98cc', description: 'Decentralized battery and solar nodes feeding irrigation and cold-chain hubs.', velocity: '+14.2% YoY' },
        { id: 'm2', name: 'Gravity-Fed Hydrological Weirs', value: 510, flourishingMultiplier: 3.7, verificationCertainty: 99.1, proofHash: '0x62ab...4199', description: 'Stone-and-timber check dams slowing runoff and recharging subterranean aquifers.', velocity: '+9.8% YoY' },
        { id: 'm3', name: 'Commoning Tool & Seed Commons', value: 340, flourishingMultiplier: 3.4, verificationCertainty: 96.5, proofHash: '0x88bb...7710', description: 'Open-access tool libraries, seed vaults, and mechanical maintenance guild workshops.', velocity: '+16.0% YoY' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Capital',
      shortName: 'Financial',
      color: '#F59E0B', // Amber
      bgRgba: 'rgba(245, 158, 11, 0.18)',
      description: 'Regenerative currencies, sovereign bioregional endowments, and non-extractive liquidity.',
      children: [
        { id: 'f1', name: 'Bioregional Sovereign Endowments', value: 720, flourishingMultiplier: 2.8, verificationCertainty: 99.8, proofHash: '0x12bb...884a', description: 'Perpetual multi-stakeholder treasury locked in on-chain non-custodial covenants.', velocity: '+8.7% YoY' },
        { id: 'f2', name: 'Regenerative Value Engine (RVE) Pools', value: 590, flourishingMultiplier: 3.9, verificationCertainty: 98.4, proofHash: '0x9923...01fa', description: 'Performance-conditioned liquidity unlocked upon satellite verification of soil & water.', velocity: '+24.1% YoY' },
        { id: 'f3', name: 'Mutual Credit Clearing Circles', value: 310, flourishingMultiplier: 3.3, verificationCertainty: 97.0, proofHash: '0x3344...ff88', description: 'Zero-interest inter-enterprise ledger enabling local trade without hard currency drain.', velocity: '+19.3% YoY' }
      ]
    },
    {
      id: 'social',
      name: 'Social Capital',
      shortName: 'Social',
      color: '#F43F5E', // Rose
      bgRgba: 'rgba(244, 63, 94, 0.18)',
      description: 'Trust networks, community assemblies, mutual aid compacts, and restorative justice.',
      children: [
        { id: 's1', name: 'Bioregional Community Assemblies', value: 650, flourishingMultiplier: 4.4, verificationCertainty: 98.7, proofHash: '0x55aa...22dd', description: 'Deliberative quadratic consensus assemblies arbitrating priority ecological floors.', velocity: '+15.6% YoY' },
        { id: 's2', name: 'Mutual Aid & Care Guilds', value: 430, flourishingMultiplier: 4.1, verificationCertainty: 97.8, proofHash: '0x77ee...9900', description: 'Inter-household safety nets providing food security and emergency resilience.', velocity: '+18.9% YoY' },
        { id: 's3', name: 'Intergenerational Elders Council', value: 370, flourishingMultiplier: 4.5, verificationCertainty: 99.0, proofHash: '0x1100...44ee', description: 'Moral oversight and long-term 7-generation constraint auditing on new projects.', velocity: '+6.2% YoY' }
      ]
    },
    {
      id: 'intellectual',
      name: 'Intellectual Capital',
      shortName: 'Intellectual',
      color: '#0284C7', // Sky Blue
      bgRgba: 'rgba(2, 132, 199, 0.18)',
      description: 'Open-source scientific models, sensor telemetry code, and epistemic failure post-mortems.',
      children: [
        { id: 'i1', name: 'Open-Source Ecological Digital Twins', value: 610, flourishingMultiplier: 4.5, verificationCertainty: 99.5, proofHash: '0x9988...77aa', description: 'Physics-informed machine learning models simulating microclimate and groundwater.', velocity: '+32.1% YoY' },
        { id: 'i2', name: 'Failure Ledger & Post-Mortem Archive', value: 480, flourishingMultiplier: 4.9, verificationCertainty: 99.2, proofHash: '0x3322...11ff', description: 'Transparent root-cause forensic documentation preventing systemic repetition of mistakes.', velocity: '+28.4% YoY' },
        { id: 'i3', name: 'Open Hardware Sensor Blueprints', value: 350, flourishingMultiplier: 3.8, verificationCertainty: 98.1, proofHash: '0x4433...9900', description: 'Low-cost LoRaWAN soil spectrometry schematics distributed royalty-free.', velocity: '+22.0% YoY' }
      ]
    },
    {
      id: 'experiential',
      name: 'Experiential Capital',
      shortName: 'Experiential',
      color: '#8B5CF6', // Violet
      bgRgba: 'rgba(139, 92, 246, 0.18)',
      description: 'Tacit craftsmanship, field apprenticeship, embodied ecological intuition, and hands-on skill.',
      children: [
        { id: 'e1', name: 'Master Agroforestry Guild Apprenticeships', value: 520, flourishingMultiplier: 4.3, verificationCertainty: 97.9, proofHash: '0xaa11...bb22', description: 'Direct field mentorship pairing youth stewards with experienced permaculture practitioners.', velocity: '+19.8% YoY' },
        { id: 'e2', name: 'Hydrological Earthworks Field Audits', value: 410, flourishingMultiplier: 3.9, verificationCertainty: 98.3, proofHash: '0xcc33...dd44', description: 'Hands-on calibration of swales, keyline plowing, and silt traps during monsoon cycles.', velocity: '+14.5% YoY' },
        { id: 'e3', name: 'Artisan Ecological Toolmaking', value: 290, flourishingMultiplier: 3.4, verificationCertainty: 96.4, proofHash: '0xee55...ff66', description: 'Forging durable local hand tools from recycled steel with regional ergonomics.', velocity: '+11.2% YoY' }
      ]
    },
    {
      id: 'spiritual',
      name: 'Spiritual Capital',
      shortName: 'Spiritual',
      color: '#6366F1', // Indigo
      bgRgba: 'rgba(99, 102, 241, 0.18)',
      description: 'Sacred watershed sanctuaries, deep-time contemplation, grief and renewal ceremonies, reverence.',
      children: [
        { id: 'sp1', name: 'Sacred Watershed Sanctuaries', value: 460, flourishingMultiplier: 4.8, verificationCertainty: 99.6, proofHash: '0x00ff...11aa', description: 'Untouchable headwater groves protected under sacred customary covenants.', velocity: '+7.4% YoY' },
        { id: 'sp2', name: 'Deep-Time & Ecological Grief Circles', value: 340, flourishingMultiplier: 4.6, verificationCertainty: 98.2, proofHash: '0x22bb...33cc', description: 'Communal rituals processing ecological mourning into committed long-horizon regeneration.', velocity: '+21.0% YoY' },
        { id: 'sp3', name: 'Non-Extractive Ethical Vows', value: 280, flourishingMultiplier: 4.7, verificationCertainty: 99.1, proofHash: '0x44dd...55ee', description: 'Sovereign operator covenants binding technological development to human and biospheric flourishing.', velocity: '+15.3% YoY' }
      ]
    },
    {
      id: 'human',
      name: 'Human / Cultural Capital',
      shortName: 'Human',
      color: '#EA580C', // Deep Orange
      bgRgba: 'rgba(234, 88, 12, 0.18)',
      description: 'Embodied health, physical vitality, labor capacity, caregiving stamina, and biocultural wisdom.',
      children: [
        { id: 'h1', name: 'Embodied Physical Health & Vitality', value: 530, flourishingMultiplier: 4.7, verificationCertainty: 98.9, proofHash: '0x66ee...77ff', description: 'Clean air and nutritional density verified in blood biomarkers and community longevity.', velocity: '+16.7% YoY' },
        { id: 'h2', name: 'Community Caregiving & Youth Stewardship', value: 390, flourishingMultiplier: 4.0, verificationCertainty: 97.5, proofHash: '0x8800...9911', description: 'Voluntary caregiving hours and experiential youth land-stewardship apprentice cohorts.', velocity: '+25.0% YoY' },
        { id: 'h3', name: 'Indigenous Biocultural Wisdom & Lineages', value: 330, flourishingMultiplier: 4.2, verificationCertainty: 98.4, proofHash: '0xaa22...bb33', description: 'Preserving heirloom millet, medicinal flora taxonomy, and drought-hardy agricultural craft.', velocity: '+18.2% YoY' }
      ]
    }
  ],
  'mara-basin': [
    {
      id: 'living',
      name: 'Living / Natural Capital',
      shortName: 'Living',
      color: '#10B981',
      bgRgba: 'rgba(16, 185, 129, 0.18)',
      description: 'Mara River wildlife corridor, acacia savanna, and black cotton soil revitalization.',
      children: [
        { id: 'mb-l1', name: 'Mara Riparian Wildlife Corridor', value: 920, flourishingMultiplier: 4.6, verificationCertainty: 99.7, proofHash: '0xmara...101a', description: 'Continuous 100m indigenous vegetation strip protecting riverbanks from intensive grazing.', velocity: '+24.2% YoY' },
        { id: 'mb-l2', name: 'Wetland Filtration Sinks', value: 680, flourishingMultiplier: 4.1, verificationCertainty: 98.9, proofHash: '0xmara...102b', description: 'Reeds and papyrus beds filtering agricultural runoff before reaching primary flow.', velocity: '+19.1% YoY' },
        { id: 'mb-l3', name: 'Silvopasture Grassbank Reserves', value: 550, flourishingMultiplier: 3.9, verificationCertainty: 97.8, proofHash: '0xmara...103c', description: 'Rotational paddock enclosures allowing perennial grasses to anchor deep carbon roots.', velocity: '+17.4% YoY' }
      ]
    },
    {
      id: 'social',
      name: 'Social Capital',
      shortName: 'Social',
      color: '#F43F5E',
      bgRgba: 'rgba(244, 63, 94, 0.18)',
      description: 'Maasai Conservancy Councils, Elder mediation, and transboundary water agreements.',
      children: [
        { id: 'mb-s1', name: 'Mara Water Users Association', value: 710, flourishingMultiplier: 4.5, verificationCertainty: 99.1, proofHash: '0xmara...201a', description: 'Cross-catchment stewardship alliance setting dry-season water extraction limits.', velocity: '+18.0% YoY' },
        { id: 'mb-s2', name: 'Community Conservancy Assemblies', value: 590, flourishingMultiplier: 4.3, verificationCertainty: 98.4, proofHash: '0xmara...202b', description: 'Democratically distributed ecotourism and carbon dividend revenue distribution.', velocity: '+22.6% YoY' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Capital',
      shortName: 'Financial',
      color: '#F59E0B',
      bgRgba: 'rgba(245, 158, 11, 0.18)',
      description: 'Community land dividend funds and biodiversity credit mechanisms.',
      children: [
        { id: 'mb-f1', name: 'Conservancy Lease Yield Fund', value: 640, flourishingMultiplier: 3.2, verificationCertainty: 99.4, proofHash: '0xmara...301a', description: 'Guaranteed monthly family leases for land dedicated to non-fragmented wildlife mobility.', velocity: '+11.3% YoY' },
        { id: 'mb-f2', name: 'Bio-Credit Micro-Endowment', value: 480, flourishingMultiplier: 3.8, verificationCertainty: 98.2, proofHash: '0xmara...302b', description: 'Cryptographically certified credits directly funding ranger patrol mesh.', velocity: '+28.9% YoY' }
      ]
    },
    {
      id: 'intellectual',
      name: 'Intellectual Capital',
      shortName: 'Intellectual',
      color: '#0284C7',
      bgRgba: 'rgba(2, 132, 199, 0.18)',
      description: 'Mara river hydro-acoustic monitoring and satellite vegetation tracking.',
      children: [
        { id: 'mb-i1', name: 'Acoustic River Flow & Turbidity Sensors', value: 510, flourishingMultiplier: 4.2, verificationCertainty: 99.3, proofHash: '0xmara...401a', description: 'Solar-powered IoT sensors transmitting flow velocity via satellite uplink.', velocity: '+33.0% YoY' }
      ]
    },
    {
      id: 'human',
      name: 'Human / Cultural Capital',
      shortName: 'Human',
      color: '#EA580C',
      bgRgba: 'rgba(234, 88, 12, 0.18)',
      description: 'Pastoralist community health, customary transhumance knowledge, and rangeland care.',
      children: [
        { id: 'mb-h1', name: 'Olkepunye Seasonal Pastoral Health & Care', value: 490, flourishingMultiplier: 4.8, verificationCertainty: 99.0, proofHash: '0xmara...501a', description: 'Embodied health and ancestral living memories encoded in oral poetry guiding drought-resistant livestock movement.', velocity: '+14.5% YoY' }
      ]
    },
    {
      id: 'material',
      name: 'Material Capital',
      shortName: 'Material',
      color: '#94A3B8',
      bgRgba: 'rgba(148, 163, 184, 0.18)',
      description: 'Predator-proof bomas and solar borehole pumps.',
      children: [
        { id: 'mb-m1', name: 'Smart Predator-Proof Solar Bomas', value: 460, flourishingMultiplier: 3.6, verificationCertainty: 98.7, proofHash: '0xmara...601a', description: 'Recycled plastic posts with strobe lighting mitigating lion predation by 99%.', velocity: '+21.2% YoY' }
      ]
    },
    {
      id: 'experiential',
      name: 'Experiential Capital',
      shortName: 'Experiential',
      color: '#8B5CF6',
      bgRgba: 'rgba(139, 92, 246, 0.18)',
      description: 'Indigenous tracker know-how and wildlife behavior reading.',
      children: [
        { id: 'mb-e1', name: 'Wildlife Scent & Track Forensics Guild', value: 420, flourishingMultiplier: 4.4, verificationCertainty: 98.1, proofHash: '0xmara...701a', description: 'Generational knowledge of elephant migration trails and seasonal watering holes.', velocity: '+16.0% YoY' }
      ]
    },
    {
      id: 'spiritual',
      name: 'Spiritual Capital',
      shortName: 'Spiritual',
      color: '#6366F1',
      bgRgba: 'rgba(99, 102, 241, 0.18)',
      description: 'Sacred fig trees (Oreteti) and reverence rituals for seasonal rains.',
      children: [
        { id: 'mb-sp1', name: 'Oreteti Sacred Tree Sanctuaries', value: 390, flourishingMultiplier: 4.9, verificationCertainty: 99.8, proofHash: '0xmara...801a', description: 'Centuries-old Ficus thonningii groves reverently protected by ritual assemblies.', velocity: '+5.1% YoY' }
      ]
    }
  ]
};

interface EightFormsCapitalTreemapProps {
  onInspectProvenance?: (prov: any) => void;
  className?: string;
}

export const EightFormsCapitalTreemap: React.FC<EightFormsCapitalTreemapProps> = ({
  onInspectProvenance,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [selectedBioregion, setSelectedBioregion] = useState<'global' | 'mara-basin'>('global');
  const [metricMode, setMetricMode] = useState<'value' | 'multiplier' | 'certainty'>('value');
  const [selectedCapitalId, setSelectedCapitalId] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    node: CapitalSubNode;
    parent: CapitalFormNode;
  } | null>(null);
  const [inspectedSubNode, setInspectedSubNode] = useState<{
    node: CapitalSubNode;
    parent: CapitalFormNode;
  } | null>(null);

  const capitalData = useMemo(() => {
    return EIGHT_FORMS_DATA[selectedBioregion] || EIGHT_FORMS_DATA.global;
  }, [selectedBioregion]);

  // Aggregate totals
  const totalValue = useMemo(() => {
    return capitalData.reduce((acc, cat) => {
      return acc + cat.children.reduce((cAcc, child) => cAcc + child.value, 0);
    }, 0);
  }, [capitalData]);

  // Render D3 Treemap
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = Math.max(460, Math.min(620, Math.round(width * 0.58)));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Prepare hierarchical data
    // If a capital is selected, focus on its children
    const filteredCategories = selectedCapitalId 
      ? capitalData.filter(c => c.id === selectedCapitalId)
      : capitalData;

    const rootData = {
      name: 'Regenerative 8-Forms Capital Matrix',
      children: filteredCategories.map(cat => ({
        ...cat,
        children: cat.children.map(ch => ({
          ...ch,
          parentCategory: cat,
          // Calculate sizing based on selected metric
          calcValue: metricMode === 'value' 
            ? ch.value 
            : metricMode === 'multiplier' 
              ? Math.round(ch.flourishingMultiplier * 100) 
              : Math.round(ch.verificationCertainty * 10)
        }))
      }))
    };

    const root = d3.hierarchy(rootData as any)
      .sum((d: any) => d.calcValue || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3.treemap<any>()
      .size([width, height])
      .paddingTop(26)
      .paddingInner(3)
      .paddingOuter(4)
      .round(true);

    treemapLayout(root);

    // Defs for gradients & shadow filters
    const defs = svg.append('defs');
    
    // Category groups
    const categories = svg.selectAll('.category-group')
      .data(root.children || [])
      .enter()
      .append('g')
      .attr('class', 'category-group')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    // Category background card header
    categories.append('rect')
      .attr('width', (d: any) => Math.max(0, d.x1 - d.x0))
      .attr('height', 24)
      .attr('fill', (d: any) => d.data.bgRgba || 'rgba(255,255,255,0.05)')
      .attr('stroke', (d: any) => d.data.color || '#C5A059')
      .attr('stroke-width', 0.5)
      .attr('rx', 2)
      .attr('cursor', 'pointer')
      .on('click', (event, d: any) => {
        audioFeedback.playMicroTick();
        setSelectedCapitalId(prev => prev === d.data.id ? null : d.data.id);
      });

    // Category header label
    categories.append('text')
      .attr('x', 6)
      .attr('y', 16)
      .text((d: any) => {
        const cat = d.data as CapitalFormNode;
        const catVal = cat.children.reduce((acc, c) => acc + c.value, 0);
        const pct = ((catVal / totalValue) * 100).toFixed(1);
        return `${cat.name} (${pct}%)`;
      })
      .attr('fill', (d: any) => d.data.color || '#F5F5F0')
      .attr('font-size', '10.5px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('letter-spacing', '0.03em')
      .attr('cursor', 'pointer')
      .on('click', (event, d: any) => {
        audioFeedback.playMicroTick();
        setSelectedCapitalId(prev => prev === d.data.id ? null : d.data.id);
      });

    // Category drilldown icon
    categories.append('text')
      .attr('x', (d: any) => Math.max(10, d.x1 - d.x0 - 18))
      .attr('y', 16)
      .text((d: any) => selectedCapitalId === d.data.id ? '✕' : '↗')
      .attr('fill', (d: any) => d.data.color || '#C5A059')
      .attr('font-size', '11px')
      .attr('cursor', 'pointer')
      .on('click', (event, d: any) => {
        audioFeedback.playMicroTick();
        setSelectedCapitalId(prev => prev === d.data.id ? null : d.data.id);
      });

    // Leaf nodes (Sub-items)
    const leaves = svg.selectAll('.leaf-node')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('class', 'leaf-node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    // Rectangles
    leaves.append('rect')
      .attr('id', (d: any) => `treemap-rect-${d.data.id}`)
      .attr('width', (d: any) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d: any) => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d: any) => {
        const parent = d.data.parentCategory as CapitalFormNode;
        return parent ? parent.bgRgba : 'rgba(255,255,255,0.06)';
      })
      .attr('stroke', (d: any) => {
        const parent = d.data.parentCategory as CapitalFormNode;
        return parent ? parent.color : '#C5A059';
      })
      .attr('stroke-width', 0.75)
      .attr('stroke-opacity', 0.6)
      .attr('rx', 2)
      .attr('cursor', 'pointer')
      .style('transition', 'all 0.15s ease')
      .on('mouseenter', function(event, d: any) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 1)
          .attr('fill', d.data.parentCategory.color + '33');
        audioFeedback.playMicroTick();
        
        const rect = container.getBoundingClientRect();
        setActiveTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          node: d.data as CapitalSubNode,
          parent: d.data.parentCategory as CapitalFormNode
        });
      })
      .on('mousemove', function(event, d: any) {
        const rect = container.getBoundingClientRect();
        setActiveTooltip(prev => prev ? {
          ...prev,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        } : null);
      })
      .on('mouseleave', function(event, d: any) {
        d3.select(this)
          .attr('stroke-width', 0.75)
          .attr('stroke-opacity', 0.6)
          .attr('fill', d.data.parentCategory.bgRgba);
        setActiveTooltip(null);
      })
      .on('click', (event, d: any) => {
        audioFeedback.playSubtleClick();
        setInspectedSubNode({
          node: d.data as CapitalSubNode,
          parent: d.data.parentCategory as CapitalFormNode
        });
      });

    // Leaf Title Text
    leaves.append('text')
      .attr('x', 6)
      .attr('y', 16)
      .text((d: any) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 60 || h < 32) return '';
        const name = d.data.name;
        return w < 120 && name.length > 14 ? name.slice(0, 12) + '...' : name;
      })
      .attr('fill', '#FFFFFF')
      .attr('font-size', (d: any) => {
        const w = d.x1 - d.x0;
        return w < 90 ? '9.5px' : '11px';
      })
      .attr('font-weight', '500')
      .attr('font-family', 'sans-serif')
      .attr('pointer-events', 'none');

    // Leaf Metric Subtext
    leaves.append('text')
      .attr('x', 6)
      .attr('y', 30)
      .text((d: any) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 65 || h < 46) return '';
        if (metricMode === 'value') return `${d.data.value.toLocaleString()} RVE`;
        if (metricMode === 'multiplier') return `${d.data.flourishingMultiplier}x Flourish`;
        return `${d.data.verificationCertainty}% Provenance`;
      })
      .attr('fill', (d: any) => d.data.parentCategory ? d.data.parentCategory.color : '#C5A059')
      .attr('font-size', '9.5px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    // Velocity Pill
    leaves.append('text')
      .attr('x', 6)
      .attr('y', 44)
      .text((d: any) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 85 || h < 60) return '';
        return d.data.velocity;
      })
      .attr('fill', '#A7F3D0')
      .attr('font-size', '8.5px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('pointer-events', 'none');

  }, [capitalData, selectedCapitalId, metricMode, totalValue]);

  // Export CSV of treemap
  const handleExportCSV = () => {
    audioFeedback.playMicroTick();
    const rows = [
      ['Capital Form', 'Sub-Metric', 'Allocation (RVE)', 'Flourishing Multiplier', 'Verification Certainty (%)', 'Proof Hash', 'Velocity', 'Bioregion'],
      ...capitalData.flatMap(cat => 
        cat.children.map(ch => [
          cat.name,
          ch.name,
          ch.value.toString(),
          ch.flourishingMultiplier.toString(),
          ch.verificationCertainty.toString(),
          ch.proofHash,
          ch.velocity,
          selectedBioregion
        ])
      )
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(i => `"${i}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eight-forms-capital-${selectedBioregion}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      id="eight-forms-capital-treemap-widget"
      className={`bg-[#0F1410] border border-[#C5A059]/30 rounded-md p-4 sm:p-6 text-[#F5F5F0] space-y-4 shadow-xl ${className}`}
    >
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              MULTI-CAPITAL SYSTEMS DYNAMICS
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Interactive D3 Treemap
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] mt-1 flex items-center gap-2">
            <span>Regenerative Impact Across the 8 Forms of Capital</span>
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-2xl mt-0.5">
            Holistic capital distribution preventing financial monoculture. Visualizes Financial, Living, Social, Human, Intellectual, Experiential, Material, and Spiritual capital compounded by bioregional stewards.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bioregion Filter */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded border border-white/10 text-xs font-mono">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedBioregion('global');
                setSelectedCapitalId(null);
              }}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                selectedBioregion === 'global' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Global All Bioregions
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedBioregion('mara-basin');
                setSelectedCapitalId(null);
              }}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                selectedBioregion === 'mara-basin' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Mara River Basin
            </button>
          </div>

          {/* Metric View Mode */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded border border-white/10 text-xs font-mono">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setMetricMode('value');
              }}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                metricMode === 'value' ? 'bg-white/20 text-white font-bold' : 'text-[#F5F5F0]/50 hover:text-white'
              }`}
              title="Display by RVE Allocation Value"
            >
              Allocation (RVE)
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setMetricMode('multiplier');
              }}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                metricMode === 'multiplier' ? 'bg-white/20 text-white font-bold' : 'text-[#F5F5F0]/50 hover:text-white'
              }`}
              title="Display by Compounding Flourishing Multiplier"
            >
              Flourishing Multiplier
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setMetricMode('certainty');
              }}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                metricMode === 'certainty' ? 'bg-white/20 text-white font-bold' : 'text-[#F5F5F0]/50 hover:text-white'
              }`}
              title="Display by Epistemic Provenance Certainty"
            >
              Certainty %
            </button>
          </div>

          {/* Reset Drilldown */}
          {selectedCapitalId && (
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedCapitalId(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/50 text-[#C5A059] text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Zoom</span>
            </button>
          )}

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#F5F5F0]/80 hover:text-white transition-all cursor-pointer"
            title="Export Treemap Data to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Capital Forms Legend Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
        {capitalData.map((c) => {
          const isSelected = selectedCapitalId === c.id;
          const catTotal = c.children.reduce((acc, ch) => acc + ch.value, 0);
          const pct = ((catTotal / totalValue) * 100).toFixed(0);

          return (
            <button
              key={c.id}
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedCapitalId(prev => prev === c.id ? null : c.id);
              }}
              className={`px-2 py-1 rounded-sm border transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-white/20 border-white text-white font-bold shadow-sm' 
                  : 'bg-[#141414] border-white/10 text-[#F5F5F0]/70 hover:text-white hover:border-white/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              <span>{c.shortName}</span>
              <span className="text-[9px] opacity-60">({pct}%)</span>
            </button>
          );
        })}
      </div>

      {/* Treemap SVG Canvas Container */}
      <div ref={containerRef} className="relative w-full rounded border border-white/10 bg-[#080B09] overflow-hidden">
        <svg ref={svgRef} className="w-full h-auto block select-none" />

        {/* Hover Tooltip Card */}
        {activeTooltip && (
          <div
            className="absolute pointer-events-none z-30 p-3 rounded bg-[#0A0D0B]/95 border border-[#C5A059]/60 shadow-2xl backdrop-blur-md max-w-xs text-xs font-mono text-[#F5F5F0] space-y-1.5 animate-in fade-in duration-100"
            style={{
              left: `${Math.min(Math.max(10, activeTooltip.x + 12), (containerRef.current?.clientWidth || 600) - 260)}px`,
              top: `${Math.min(Math.max(10, activeTooltip.y + 12), 340)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
              <span className="text-[10px] uppercase font-bold text-[#C5A059] truncate">
                {activeTooltip.parent.name}
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold shrink-0">
                {activeTooltip.node.velocity}
              </span>
            </div>

            <div className="text-sm font-semibold text-white">
              {activeTooltip.node.name}
            </div>

            <p className="text-[11px] text-[#F5F5F0]/70 leading-relaxed font-sans">
              {activeTooltip.node.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[10px]">
              <div>
                <span className="text-[#F5F5F0]/50 block">Allocation:</span>
                <span className="font-bold text-white">{activeTooltip.node.value.toLocaleString()} RVE</span>
              </div>
              <div>
                <span className="text-[#F5F5F0]/50 block">Flourish Multiplier:</span>
                <span className="font-bold text-[#C5A059]">{activeTooltip.node.flourishingMultiplier}x</span>
              </div>
              <div>
                <span className="text-[#F5F5F0]/50 block">Verification:</span>
                <span className="font-bold text-emerald-400">{activeTooltip.node.verificationCertainty}%</span>
              </div>
              <div>
                <span className="text-[#F5F5F0]/50 block">Merkle Proof:</span>
                <span className="text-sky-400 truncate block">{activeTooltip.node.proofHash}</span>
              </div>
            </div>

            <div className="text-[9px] text-[#C5A059]/80 text-right pt-0.5">
              Click node to inspect cryptographic audit trail
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Cryptographic Provenance Drawer */}
      {inspectedSubNode && (
        <div className="p-4 bg-[#141A16] border border-[#C5A059]/40 rounded-sm space-y-3 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: inspectedSubNode.parent.color }} />
              <span className="text-[#C5A059] font-bold uppercase tracking-wider">
                {inspectedSubNode.parent.name} › {inspectedSubNode.node.name}
              </span>
            </div>
            <button
              onClick={() => setInspectedSubNode(null)}
              className="text-[#F5F5F0]/50 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-black/40 p-3 rounded border border-white/5">
            <div>
              <span className="text-[10px] text-[#F5F5F0]/50 block">Regenerative Value Engine Allocation</span>
              <span className="text-base font-bold text-white">{inspectedSubNode.node.value.toLocaleString()} RVE</span>
              <span className="text-[10px] text-[#F5F5F0]/40 block">Total compounding value</span>
            </div>
            <div>
              <span className="text-[10px] text-[#F5F5F0]/50 block">Flourishing Multiplier</span>
              <span className="text-base font-bold text-[#C5A059]">{inspectedSubNode.node.flourishingMultiplier}x</span>
              <span className="text-[10px] text-emerald-400 block">{inspectedSubNode.node.velocity}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#F5F5F0]/50 block">Cryptographic Certainty</span>
              <span className="text-base font-bold text-emerald-400">{inspectedSubNode.node.verificationCertainty}%</span>
              <span className="text-[10px] text-[#F5F5F0]/40 block">W3C Verifiable Credential</span>
            </div>
            <div>
              <span className="text-[10px] text-[#F5F5F0]/50 block">Immutable Merkle Leaf</span>
              <span className="text-xs font-mono text-sky-400 block truncate">{inspectedSubNode.node.proofHash}</span>
              <span className="text-[10px] text-emerald-400 block">Anchor: Block #1849102</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10">
            <p className="text-[#F5F5F0]/80 font-sans text-xs">
              {inspectedSubNode.node.description}
            </p>
            {onInspectProvenance && (
              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  onInspectProvenance({
                    id: inspectedSubNode.node.id,
                    source: `8-Forms Treemap: ${inspectedSubNode.node.name}`,
                    author: `Bioregional Multi-Capital Assembly`,
                    timestamp: new Date().toISOString(),
                    verified: true,
                    integrityScore: inspectedSubNode.node.verificationCertainty,
                    verificationMethod: 'Multi-Sensor Invariant Proof & Satellite Consensus',
                    hash: inspectedSubNode.node.proofHash,
                    merkleProof: [
                      '0x44a1...99bc',
                      '0x12ff...8831',
                      inspectedSubNode.node.proofHash
                    ],
                    details: inspectedSubNode.node.description
                  });
                }}
                className="px-3 py-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Inspect Provenance Receipt</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
