import React, { useState } from 'react';
import { 
  TreeDeciduous, 
  Compass, 
  Cpu, 
  Coins, 
  Home, 
  Factory, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  Globe2, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Layers, 
  BarChart3, 
  HeartHandshake, 
  BookOpen, 
  Users, 
  ChevronRight,
  Shield,
  Leaf,
  Search,
  Activity,
  History,
  Unlock
} from 'lucide-react';
import { PageView, ScaleLevel } from '../../types';
import { GLOBAL_PROJECTS, MORAL_PRINCIPLES, INTELLIGENCE_LAYERS } from '../../data/mockCivilizationData';
import { RealityCheck } from '../RealityCheck';
import { PartnerCarousel } from '../PartnerCarousel';
import { AtlasCentralVisual } from '../civilization/AtlasCentralVisual';
import { CivilizationalDiagnosisEngine } from '../civilization/CivilizationalDiagnosisEngine';
import { CovenantRecordViewer } from '../civilization/CovenantRecordViewer';
import { SevenCapitalsPathway } from '../civilization/SevenCapitalsPathway';
import { SpecializedAgentSwarm } from '../civilization/SpecializedAgentSwarm';
import { CivilizationalMemoryGraph } from '../civilization/CivilizationalMemoryGraph';
import { LiberationIndexWidget } from '../civilization/LiberationIndexWidget';

interface AtlasHomeViewProps {
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter: () => void;
  onOpenMoralSimulator: () => void;
  onInspectProvenance: (prov: any) => void;
}

export const AtlasHomeView: React.FC<AtlasHomeViewProps> = ({
  onSelectTab,
  onOpenCommandCenter,
  onOpenMoralSimulator,
  onInspectProvenance
}) => {
  const [activeScale, setActiveScale] = useState<ScaleLevel>('region');
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);
  const [selectedTreePart, setSelectedTreePart] = useState<'roots' | 'trunk' | 'branches' | 'fruit'>('roots');

  const ATLAS_LOOP = [
    { step: 'See', title: 'Observation & Telemetry', desc: 'Satellite multispectral imagery, IoT ground sensor meshes, and community field reporting capture physical reality.' },
    { step: 'Understand', title: 'Intelligence & Causal Reasoning', desc: 'Multi-scale AI models synthesize telemetry into transparent causal graphs with visible epistemic uncertainty.' },
    { step: 'Decide', title: 'Moral Intelligence & Governance', desc: 'Policies and interventions are evaluated against the 14 universal ethical axioms before capital is committed.' },
    { step: 'Coordinate', title: 'Capital & Stakeholder Alignment', desc: 'Non-extractive patient capital is structured into transparent, milestone-triggered outcome tranches on the RVE.' },
    { step: 'Build', title: 'Physical & Modular Execution', desc: 'Atlas Industrial Systems and local builders fabricate LifeHouse habitats, solar microgrids, and agro-corridors.' },
    { step: 'Measure', title: 'Cryptographic Verification', desc: 'Independent scientific auditors and smart sensor meshes verify environmental and human dignity outcomes.' },
    { step: 'Learn', title: 'Knowledge Commons Feedback', desc: 'Empirical data flows back into open-access research papers, improving global regenerative models.' },
    { step: 'Regenerate', title: 'Compounding Civilizational Flourishing', desc: 'Restored soil, clean aquifers, thriving families, and resilient institutions create enduring prosperity.' }
  ];

  const scaleExamples: Record<ScaleLevel, { name: string; tag: string; description: string; stat: string }> = {
    planet: {
      name: 'Global Biosphere & Climate Grid',
      tag: 'Planetary Scale',
      description: 'Coordinating carbon sequestration, planetary boundary monitoring, and transcontinental ethical capital flows.',
      stat: '1.24M tCO2e Sequestered'
    },
    continent: {
      name: 'Pan-African Regenerative Corridors',
      tag: 'Continental Scale',
      description: 'Interconnected clean transport, energy microgrids, and ecological trade routes across sub-Saharan Africa.',
      stat: '54,200 Livelihoods Created'
    },
    country: {
      name: 'Sovereign Ecological Infrastructure',
      tag: 'National Scale',
      description: 'National green industrial fabrication hubs, water rights governance, and sovereign data trusts in Kenya and Rwanda.',
      stat: '100% Clean Energy Ratio'
    },
    region: {
      name: 'Mara-Rift Watershed Biosphere',
      tag: 'Regional Scale',
      description: '42,000 hectares of multi-strata agroforestry, wildlife corridors, and aquifer recharge networks.',
      stat: '42,000 ha Verified'
    },
    city: {
      name: 'Kigali LifeHouse Eco-Quarter',
      tag: 'Municipal Scale',
      description: '450 modular bio-composite residential dwellings with integrated rainwater harvesting and solar grids.',
      stat: '450 Zero-Carbon Homes'
    },
    community: {
      name: 'Kilifi Coastal Fisherfolk Union',
      tag: 'Community Scale',
      description: 'Cooperative governance of 24 solar seawater desalination kiosks and 12,000 hectares of mangrove restoration.',
      stat: '65,000 People Served'
    },
    project: {
      name: 'Turkana Deep Solar-Desalination Node 4',
      tag: 'Project Scale',
      description: '3.4MW microgrid powering deep aquifer filtration and 80 closed-loop LifePod hydroponic modules.',
      stat: '800L/day Clean Water'
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen">
      {/* ========================================================================= */}
      {/* HERO SECTION — ACT I: THE QUESTION & CIVILIZATION VISION */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Atmospheric Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#1B3022]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Hero Content) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Eyebrow badge with gold line */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#C5A059]"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
                Regenerative Intelligence Platform
              </span>
            </div>

            {/* Master Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F5F0] leading-[0.98] uppercase">
              BUILD SYSTEMS THAT HELP <br />
              <span className="text-[#C5A059] font-serif italic lowercase font-light">
                humanity flourish.
              </span>
            </h1>

            {/* Supporting Statement */}
            <p className="text-base sm:text-lg text-[#F5F5F0]/80 max-w-2xl leading-relaxed">
              Atlas Sanctum connects intelligence, ethics, capital, infrastructure, and communities so that complex problems can become measurable opportunities for regeneration.
            </p>

            {/* Proposition Paragraph */}
            <div className="p-3.5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm font-mono text-xs text-[#C5A059] flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              <span>See reality</span>
              <span className="text-[#F5F5F0]/30">→</span>
              <span>Understand systems</span>
              <span className="text-[#F5F5F0]/30">→</span>
              <span>Coordinate people</span>
              <span className="text-[#F5F5F0]/30">→</span>
              <span>Move capital</span>
              <span className="text-[#F5F5F0]/30">→</span>
              <span>Build infrastructure</span>
              <span className="text-[#F5F5F0]/30">→</span>
              <span>Measure outcomes</span>
              <span className="text-[#F5F5F0]/30">→</span>
              <span className="text-emerald-400 font-bold">Regenerate</span>
            </div>

            {/* PROMPT 3: EXPLORE A PLACE DIRECT PRODUCT GATEWAY */}
            <div className="p-4 sm:p-5 bg-[#111111] border border-[#C5A059]/40 rounded-sm space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                  EXPLORE A PLACE & REVEAL REALITY
                </span>
                <span className="text-[10px] font-mono text-[#F5F5F0]/40">Opportunity Engine v3.0</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    defaultValue="Nairobi (Mathare River Basin)"
                    readOnly
                    className="w-full bg-[#080808] border border-[#F5F5F0]/15 rounded-sm px-3.5 py-2.5 text-xs font-mono text-[#F5F5F0] cursor-pointer"
                    onClick={() => onSelectTab('opportunity-intelligence')}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-400">
                    ● Ready for Analysis
                  </span>
                </div>
                <button
                  onClick={() => onSelectTab('opportunity-intelligence')}
                  className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all shadow font-mono cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Synthesize Brief</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#F5F5F0]/50 flex-wrap">
                <span>Popular Bioregions:</span>
                <button
                  onClick={() => onSelectTab('opportunity-intelligence')}
                  className="text-[#C5A059] hover:underline"
                >
                  Nairobi Drainage
                </button>
                <span>•</span>
                <button
                  onClick={() => onSelectTab('opportunity-intelligence')}
                  className="text-[#C5A059] hover:underline"
                >
                  Morogoro Agroforestry
                </button>
                <span>•</span>
                <button
                  onClick={() => onSelectTab('opportunity-intelligence')}
                  className="text-[#C5A059] hover:underline"
                >
                  Turkana Solar Desal
                </button>
              </div>
            </div>

            {/* Hero CTAs: UNDERSTAND, BUILD, MEASURE, JOIN THE NETWORK */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-understand-btn"
                onClick={() => onSelectTab('opportunity-intelligence')}
                className="px-6 py-3 bg-[#F5F5F0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-xl hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>OPPORTUNITIES</span>
                <span className="text-[10px] text-neutral-600 font-normal font-sans">(Intelligence Engine)</span>
              </button>

              <button
                id="hero-decision-btn"
                onClick={() => onSelectTab('decision-room')}
                className="px-6 py-3 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <Scale className="w-4 h-4 text-[#C5A059]" />
                <span>DECIDE</span>
                <span className="text-[10px] text-emerald-300 font-normal font-sans">(Decision Room)</span>
              </button>

              <button
                id="hero-build-btn"
                onClick={() => onSelectTab('project-os')}
                className="px-6 py-3 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#F5F5F0] font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-sm"
              >
                <Layers className="w-4 h-4 text-[#C5A059]" />
                <span>BUILD</span>
                <span className="text-[10px] text-[#F5F5F0]/60 font-normal font-sans">(Project OS)</span>
              </button>

              <button
                id="hero-measure-btn"
                onClick={() => onSelectTab('evidence-ledger')}
                className="px-4 py-3 bg-[#121212] hover:bg-[#181818] border border-[#C5A059]/30 text-[#C5A059] font-mono text-xs rounded-sm flex items-center gap-1.5 transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>MEASURE</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Civilization Telemetry Card */}
          <div className="lg:col-span-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 p-7 rounded-sm space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#C5A059] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Civilization Telemetry
              </span>
              <span className="text-[9px] font-mono text-[#F5F5F0]/40">PROV-HASH: 0x9F42</span>
            </div>

            {/* Metric 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#F5F5F0]/60">Living Reality Index</span>
                <span className="font-mono font-bold text-emerald-400">0.72 (+4.2%)</span>
              </div>
              <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1B3022] to-emerald-400 w-[72%]" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#F5F5F0]/10">
              <div className="p-3 bg-[#0A0A0A] border border-[#F5F5F0]/5 rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[#F5F5F0]/40 mb-0.5">Capital Mobilized</p>
                <p className="text-lg font-bold text-[#F5F5F0] font-mono">$4.2B</p>
                <p className="text-[9px] text-emerald-400 font-mono">100% Non-Extractive</p>
              </div>
              <div className="p-3 bg-[#0A0A0A] border border-[#F5F5F0]/5 rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[#F5F5F0]/40 mb-0.5">Regenerated Land</p>
                <p className="text-lg font-bold text-[#F5F5F0] font-mono">124,200</p>
                <p className="text-[9px] text-[#C5A059] font-mono">Verified Hectares</p>
              </div>
            </div>

            {/* Quick OS Status */}
            <div className="space-y-2 pt-1 border-t border-[#F5F5F0]/10 text-xs">
              <div className="flex items-center justify-between text-[#F5F5F0]/70">
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                  Trust OS (Axioms)
                </span>
                <span className="font-mono text-[10px] text-[#C5A059]">14/14 Audited</span>
              </div>
              <div className="flex items-center justify-between text-[#F5F5F0]/70">
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  LifeHouse Deployments
                </span>
                <span className="font-mono text-[10px] text-emerald-400">1,240 Habitats</span>
              </div>
            </div>

            {/* Injected Reality Check */}
            <div className="pt-2 border-t border-[#F5F5F0]/10">
              <RealityCheck 
                compact
                data={{
                  status: 'observed',
                  confidenceScore: 98.6,
                  uncertaintyMargin: '± 1.4%',
                  epistemicTier: 'Planetary In-Situ IoT Mesh',
                  realityVsModelWarning: 'Commandment II: Ground sensor readings take precedence over predictive ML forecasts.',
                  dataOrigin: '14,800 Bioregional IoT Ground Nodes + Sentinel-2 Multispectral Feed',
                  cryptographicHash: '0x3847a91b2c4019e8371904a8b72635489102cba3',
                  lastVerified: '12s ago',
                  verifiedBy: 'Global Bioregional Verification Mesh',
                  sensorHealth: 99.2
                }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE CENTRAL VISUAL IDENTITY & THE 10 COVENANTS (SECTION 40 & 3) */}
        {/* ========================================================================= */}
        <div className="mt-12">
          <AtlasCentralVisual
            onSelectTab={onSelectTab}
            onOpenCommandCenter={onOpenCommandCenter}
            onOpenMoralSimulator={onOpenMoralSimulator}
          />
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE TREE OF LIFE & MULTI-SCALE LIVING WORLD */}
        {/* ========================================================================= */}
        <div className="mt-16 p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            {/* Tree Metaphor Visualizer */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-[0.25em]">The Living Metaphor</div>
                  <h3 className="text-xl font-bold text-[#F5F5F0]">The Civilization Tree of Flourishing</h3>
                </div>
                <span className="px-2.5 py-1 bg-[#1B3022] text-[#C5A059] text-xs font-mono rounded-sm border border-[#C5A059]/40">
                  Interactive Node Graph
                </span>
              </div>

              {/* 4 Interactive Tree Segments */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'roots', label: '1. Roots', role: 'Universal Ethics', color: '#C5A059', desc: '14 Moral design foundations (Peace, Love, Justice, Stewardship).' },
                  { id: 'trunk', label: '2. Trunk', role: 'Intelligence Core', color: '#8FB8DE', desc: '5 OS layers synthesizing satellite data, IoT telemetry, & causal models.' },
                  { id: 'branches', label: '3. Branches', role: 'Institutions & Capital', color: '#C5A059', desc: 'RVE exchange, community trusts, and patient capital routing.' },
                  { id: 'fruit', label: '4. Fruit', role: 'Human Flourishing', color: '#10B981', desc: 'Restored ecosystems, dignified housing, and multi-generational health.' },
                ].map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => setSelectedTreePart(segment.id as any)}
                    className={`p-3 rounded-sm border text-left transition-all ${
                      selectedTreePart === segment.id
                        ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-md scale-[1.02]'
                        : 'bg-[#0A0A0A] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F5F5F0]">{segment.label}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: segment.color }}>{segment.role}</div>
                  </button>
                ))}
              </div>

              {/* Selected Segment Deep Dive */}
              <div className="p-4 rounded-sm bg-[#0A0A0A] border border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F0]">
                    Architecture Focus: {selectedTreePart.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
                  {selectedTreePart === 'roots' && "The Roots are the 14 Universal Moral Axioms derived from ancient wisdom and translated into operational computational constraints. Systems cannot bear lasting fruit if severed from deep moral ground."}
                  {selectedTreePart === 'trunk' && "The Trunk is the layered Intelligence Architecture (Trust OS, Knowledge OS, Health OS, Opportunity OS, Flourishing OS). It turns planetary observation into causal clarity and transparent decision telemetry."}
                  {selectedTreePart === 'branches' && "The Branches are the coordination institutions, physical fabrication hubs, and non-extractive capital markets (Regenerative Value Exchange) delivering nutrients to local communities."}
                  {selectedTreePart === 'fruit' && "The Fruit is verified civilizational flourishing: soil that enriches year after year, families living in carbon-negative LifeHouses, and youth building dignified local enterprises."}
                </p>
              </div>
            </div>

            {/* Multi-Scale Explorer */}
            <div className="w-full lg:w-96 p-5 rounded-sm bg-[#0A0A0A] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider">Multi-Scale Operational Range</span>
                  <Globe2 className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="text-xs text-[#F5F5F0]/60">Zoom across nested scales of human and ecological organization:</div>
                
                {/* Scale buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {(['planet', 'region', 'city', 'community', 'project'] as ScaleLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveScale(lvl)}
                      className={`text-xs px-2.5 py-1 rounded-sm font-mono uppercase transition-colors ${
                        activeScale === lvl
                          ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059] font-bold'
                          : 'bg-[#0D0D0D] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Scale Card */}
              <div className="p-4 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/30">
                    {scaleExamples[activeScale].tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {scaleExamples[activeScale].stat}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F5F5F0]">{scaleExamples[activeScale].name}</div>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">{scaleExamples[activeScale].description}</p>
                <button
                  onClick={() => onSelectTab('observatory')}
                  className="pt-2 text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                >
                  View in Living Reality Map →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* GLOBAL PARTNERS & INSTITUTIONAL TRUST MARQUEE */}
      {/* ========================================================================= */}
      <PartnerCarousel onSelectTab={onSelectTab} />

      {/* ========================================================================= */}
      {/* SECTION 03 — THE ATLAS THESIS & COORDINATION FABRIC */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F5F0]/10">
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059]">03 — FIRST PRINCIPLES</div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F5F5F0]">
              THE ATLAS THESIS
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl mx-auto">
              Humanity does not primarily suffer from a lack of intelligence; it suffers from fragmented institutions, fragmented capital, weak feedback loops, and incentives that reward extraction over regeneration.
            </p>
          </div>

          {/* Six Core Thesis Statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Intelligence without action is insufficient.',
                desc: 'Information must lead toward decisions, structural capital commitments, and measurable physical interventions.'
              },
              {
                num: '02',
                title: 'Capital without coordination is inefficient.',
                desc: 'Money must be connected directly to credible projects, sovereign communities, and transparent milestones.'
              },
              {
                num: '03',
                title: 'Technology without ethics can amplify harm.',
                desc: 'Ethics cannot be an external compliance checklist; it must be embedded as formal constraints into system architecture.'
              },
              {
                num: '04',
                title: 'Impact without measurement cannot compound.',
                desc: 'Every intervention must generate verifiable epistemic evidence with visible uncertainty and attribution.'
              },
              {
                num: '05',
                title: 'Centralized systems create fragile dependencies.',
                desc: 'Atlas maximizes interoperability, local-first offline execution, and distributed community participation.'
              },
              {
                num: '06',
                title: 'Regeneration requires long-term feedback loops.',
                desc: 'Systems must continuously learn from physical reality instead of repeatedly reproducing unexamined assumptions.'
              }
            ].map((t) => (
              <div key={t.num} className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm space-y-3 transition-all">
                <div className="text-xs font-mono text-[#C5A059] font-bold">{t.num}</div>
                <h3 className="text-base font-bold text-[#F5F5F0] leading-snug">{t.title}</h3>
                <p className="text-xs text-[#F5F5F0]/65 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Section 04: Coordination Layer Architecture */}
          <div className="p-8 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold">
                  04 — COORDINATION LAYER ARCHITECTURE
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
                  Atlas as a Coordination Fabric, Not a Monopolistic Destination
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('opportunity-graph')}
                className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 shrink-0"
              >
                <span>Explore Opportunity Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs font-mono">
              {[
                { label: 'COMMUNITIES', sub: 'Sovereign Stewards', color: 'text-purple-400' },
                { label: 'BUSINESSES', sub: 'Circular Value', color: 'text-blue-400' },
                { label: 'GOVERNMENTS', sub: 'Policy Alignment', color: 'text-amber-400' },
                { label: 'RESEARCHERS', sub: 'Peer Models', color: 'text-cyan-400' },
                { label: 'CAPITAL', sub: 'Patient Tranches', color: 'text-emerald-400' },
                { label: 'INFRASTRUCTURE', sub: 'Physical Execution', color: 'text-rose-400' },
                { label: 'EVIDENCE', sub: 'Audit Ledgers', color: 'text-[#C5A059]' }
              ].map((node) => (
                <div key={node.label} className="p-3 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-1">
                  <div className={`font-bold ${node.color}`}>{node.label}</div>
                  <div className="text-[9px] text-[#F5F5F0]/40">{node.sub}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#F5F5F0]/70 gap-4">
              <span className="text-[#C5A059] font-bold">ATLAS COORDINATION FABRIC:</span>
              <span className="text-center">DATA + INTELLIGENCE + MORAL STANDARDS + VERIFICATION + FEEDBACK</span>
              <span className="text-emerald-400 font-bold">ZERO EXTRACTIVE MONOPOLY</span>
            </div>
          </div>

          {/* Section 05: AI Civilization Intelligence Trio */}
          <div className="p-8 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  05 — AI CIVILIZATION INTELLIGENCE ENGINES
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
                  Causal Reasoning, Moral Verification & Autonomous Matchmaking
                </h3>
              </div>
              <span className="text-xs text-[#8FB8DE] font-mono">
                Active System Intelligence Core
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Causal Bioregional Twin */}
              <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 rounded-sm space-y-3 flex flex-col justify-between transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8FB8DE] uppercase font-bold">Causal Simulation</span>
                    <span className="px-2 py-0.5 bg-blue-950 text-blue-300 font-mono text-[9px] rounded">Pearl Do-Calculus</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#F5F5F0]">
                    Causal Bioregional Twin
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    Test water, energy, and soil interventions across 5, 15, and 30-year horizons with 10,000 Monte Carlo runs and 1st, 2nd, and 3rd order systemic consequence modeling.
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab('bioregional-twin')}
                  className="w-full py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#F5F5F0]/20 text-xs font-mono font-bold text-[#F5F5F0] rounded-xs flex items-center justify-center gap-2 transition-all mt-3"
                >
                  <span>Launch Bioregional Twin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>

              {/* 2. Constitutional Moral Arbiter */}
              <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 hover:border-emerald-500/50 rounded-sm space-y-3 flex flex-col justify-between transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Ethical Safeguard</span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono text-[9px] rounded">Zero Extractive Usury</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#F5F5F0]">
                    Constitutional Moral Arbiter
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    Real-time legal covenant audit scanning proposed funding contracts for predatory clauses, land alienation, usurious debt, and multi-assembly veto compliance.
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab('moral-arbiter')}
                  className="w-full py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#F5F5F0]/20 text-xs font-mono font-bold text-[#F5F5F0] rounded-xs flex items-center justify-center gap-2 transition-all mt-3"
                >
                  <span>Inspect Covenant Audits</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

              {/* 3. Autonomous Opportunity Matchmaker */}
              <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 rounded-sm space-y-3 flex flex-col justify-between transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold">Turnkey Deployment</span>
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 font-mono text-[9px] rounded">Open Hardware</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#F5F5F0]">
                    Opportunity & Capital Matchmaker
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    Turns community problem signals into ready-to-deploy packages with matched patient capital, open hardware blueprints, turnkey BOMs, and youth guild labor.
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab('opportunity-matchmaker')}
                  className="w-full py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#F5F5F0]/20 text-xs font-mono font-bold text-[#F5F5F0] rounded-xs flex items-center justify-center gap-2 transition-all mt-3"
                >
                  <span>Explore Matchmaker</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT II & III — THE PROBLEM VS THE POSSIBILITY */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F5F0]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Act II: The Problem */}
          <div className="space-y-5 p-8 rounded-sm bg-[#0D0D0D] border border-red-900/30">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              ACT II — THE CIVILIZATIONAL PROBLEM
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-[#F5F5F0] font-serif italic">
              Capability Without Moral Architecture <span className="not-italic font-sans font-bold">Produces Fragility.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F5F0]/60 leading-relaxed">
              Humanity possesses extraordinary technological power, yet our systems remain dangerously fragmented. This fragmentation fuels:
            </p>
            <ul className="space-y-2.5 text-xs text-[#F5F5F0]/70">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span><strong className="text-[#F5F5F0]">Ecological Degradation:</strong> Soil depletion, aquifer collapse, and biodiversity loss treated as externalized costs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span><strong className="text-[#F5F5F0]">Inequality of Opportunity:</strong> Capital and technological tools concentrated away from vulnerable communities who need them most.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span><strong className="text-[#F5F5F0]">Short-Term Extraction:</strong> Institutions and financial markets optimized for 90-day returns rather than 30-year generational resilience.</span>
              </li>
            </ul>
          </div>

          {/* Act III: The Possibility */}
          <div className="space-y-5 p-8 rounded-sm bg-[#0D0D0D] border border-[#C5A059]/40">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              ACT III — THE POSSIBILITY
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-[#F5F5F0] font-serif italic">
              What If Intelligence Connected <span className="not-italic font-sans font-bold">Reality, Capital & Regeneration?</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F5F0]/70 leading-relaxed">
              Atlas Sanctum proposes a regenerative civilization operating system that treats economics, technology, and ecology as one coherent living system rooted in moral accountability.
            </p>
            <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm font-mono text-xs text-[#C5A059] space-y-1">
              <div>Ethics → Intelligence → Data → Capital → Infrastructure → Outcomes → Regeneration</div>
            </div>
            <button
              onClick={() => onSelectTab('moral-intelligence')}
              className="px-5 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              Explore Moral Intelligence →
            </button>
          </div>
        </div>

        {/* INJECTED: CIVILIZATIONAL DIAGNOSIS ENGINE (SECTION 6) */}
        <div className="mt-16">
          <CivilizationalDiagnosisEngine
            onSelectTab={onSelectTab}
            onOpenMoralSimulator={onOpenMoralSimulator}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT IV — THE ATLAS MODEL (THE 8-STAGE REGENERATIVE LOOP) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F5F0]/10">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059]">ACT IV — THE ATLAS MODEL</div>
          <h2 className="text-3xl sm:text-4xl font-light text-[#F5F5F0] font-serif italic">The Closed-Loop <span className="not-italic font-sans font-bold">Regeneration Cycle</span></h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60">
            Atlas does not merely catalog problems. It creates an auditable continuous loop moving from observation to enduring physical and ecological transformation.
          </p>
        </div>

        {/* Interactive 8-Stage Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {ATLAS_LOOP.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLoopStep(idx)}
              className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                activeLoopStep === idx
                  ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-lg scale-105'
                  : 'bg-[#0D0D0D] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
              }`}
            >
              <div className="text-[10px] font-mono text-[#C5A059]">0{idx + 1}</div>
              <div className="text-xs font-bold text-[#F5F5F0] mt-1">{item.step}</div>
            </button>
          ))}
        </div>

        {/* Active Stage Deep Dive Banner */}
        <div className="mt-6 p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-[#C5A059] tracking-wider">
              Step 0{activeLoopStep + 1}: {ATLAS_LOOP[activeLoopStep].title}
            </div>
            <p className="text-sm text-[#F5F5F0]/80 max-w-3xl leading-relaxed">
              {ATLAS_LOOP[activeLoopStep].desc}
            </p>
          </div>
          <button
            onClick={() => onSelectTab(activeLoopStep === 0 ? 'observatory' : activeLoopStep === 1 ? 'studio' : activeLoopStep === 2 ? 'moral-intelligence' : activeLoopStep === 3 ? 'marketplace' : activeLoopStep === 4 ? 'lifehouse' : activeLoopStep === 5 ? 'impact-dashboard' : activeLoopStep === 6 ? 'research' : 'observatory')}
            className="px-5 py-2.5 bg-[#F5F5F0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm shrink-0 flex items-center gap-1.5 transition-colors shadow cursor-pointer"
          >
            Launch Stage Tool <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* INJECTED: THE 10 SPECIALIZED AI AGENTS (SECTION 28) */}
        <div className="mt-16">
          <SpecializedAgentSwarm onSelectTab={onSelectTab} />
        </div>

        {/* INJECTED: THE COVENANT RECORD VIEWER (SECTION 10) */}
        <div className="mt-12">
          <CovenantRecordViewer onSelectTab={onSelectTab} onOpenMoralSimulator={onOpenMoralSimulator} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT V — THE PLATFORM ECOSYSTEM MODULES */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F5F0]/10">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#8FB8DE]">ACT V — THE PLATFORM ECOSYSTEM</div>
          <h2 className="text-3xl sm:text-4xl font-light text-[#F5F5F0] font-serif italic">Six Integrated Engines for <span className="not-italic font-sans font-bold">Civilization Flourishing</span></h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60">
            Every module provides specialized capabilities designed to interconnect data, capital, technology, and community governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Observatory */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">ATLAS OBSERVATORY</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                Global real-time intelligence synthesizing climate signals, economic indicators, groundwater aquifer health, and social vulnerability.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• Satellite & In-Situ Sensor Mesh</div>
                <div>• Regional Risk & Opportunity Radar</div>
                <div>• Living Reality Interactive Map</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('observatory')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Open Observatory <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 2: Studio */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">ATLAS STUDIO</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                A systems simulation and AI strategy laboratory for modeling multi-capital policies, scenario trajectories, and second-order impacts.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• Dynamic Systems Node Modeling</div>
                <div>• 7-Capitals Flow Balancing</div>
                <div>• Causal Intervention Sandbox</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('studio')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Enter Studio <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 3: Marketplace (RVE) */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">ATLAS MARKETPLACE (RVE)</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                The Regenerative Value Exchange coordinating verified ecological credits, community micro-equity, and patient outcome contracts.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• Audited Ecological Assets</div>
                <div>• Transparent Public Ledger</div>
                <div>• Milestone Capital Disbursements</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('marketplace')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Explore Marketplace <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 4: LifeHouse */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">LIFEHOUSE INITIATIVE</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                Regenerative habitats for human flourishing combining closed-loop food nodes (LifePod), rapid shelters (LifeShield), and permanent habitats.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• LifePod Closed-Loop Food Nodes</div>
                <div>• LifeShield Rapid Emergency Shelters</div>
                <div>• Carbon-Negative Bio-Composite Homes</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('lifehouse')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Explore LifeHouse <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 5: Industrial Systems */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">ATLAS INDUSTRIAL</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                The physical manufacturing and infrastructure execution layer fabricating modular habitats, microgrid controllers, and desalination kiosks.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• 100% Clean Energy Fabrication</div>
                <div>• Circular Bio-Composite Processing</div>
                <div>• Local Sovereign Supply Chains</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('industrial')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Inspect Industrial Layer <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 6: Coordination Layer */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">OPPORTUNITY GRAPH</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                Connect problems, sovereign communities, patient capital, and builders into self-reinforcing flourishing loops.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• Problem-to-Outcome Routing</div>
                <div>• Community Governance Sovereignty</div>
                <div>• Non-Extractive Capital Graph</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('opportunity-graph')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Open Opportunity Graph <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 7: Evidence Ledger */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">EVIDENCE LEDGER</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                A verifiable epistemic ledger tracing claims, sensor instruments, methodologies, and physical outcomes with zero black boxes.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• Cryptographic Hash Anchoring</div>
                <div>• Visible Epistemic Uncertainty</div>
                <div>• Third-Party Scientific Audits</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('evidence-ledger')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Inspect Evidence Ledger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 8: Field Labs */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">ATLAS FIELD LABS</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                Living research laboratories across Nairobi, Turkana, and Kigali publishing candid empirical results and failure post-mortems.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• 6 Active Field Laboratories</div>
                <div>• "What We Got Wrong" Reports</div>
                <div>• Compounding Epistemic Learning</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('field-labs')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Explore Field Labs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 9: Developers SDK */}
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">ACADEMY & SDK</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
                Open developer APIs, cryptographic verification primitives, and systems-thinking learning programs for builders and researchers.
              </p>
              <div className="space-y-1 text-[11px] font-mono text-[#F5F5F0]/50">
                <div>• Open Verification APIs & Schemas</div>
                <div>• Systems Thinking Curricula</div>
                <div>• Commons Governance Protocols</div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('developers')}
              className="pt-2 text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline"
            >
              Build with Atlas SDK <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* INJECTED: THE SEVEN CAPITALS ENGINE (SECTION 15) */}
        <div className="mt-16">
          <SevenCapitalsPathway onSelectTab={onSelectTab} />
        </div>

        {/* INJECTED: THE LIBERATION INDEX (SECTION 12) */}
        <div className="mt-12">
          <LiberationIndexWidget onSelectTab={onSelectTab} />
        </div>

        {/* INJECTED: INSTITUTIONAL MEMORY GRAPH (SECTION 24) */}
        <div className="mt-12">
          <CivilizationalMemoryGraph onSelectTab={onSelectTab} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT VI — THE PROOF IN THE WORLD & HUMAN REALITY */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F5F0]/10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5A059]">ACT VI — THE PROOF IN THE FIELD</div>
            <h2 className="text-3xl sm:text-4xl font-light text-[#F5F5F0] font-serif italic">The People & Ecosystems <span className="not-italic font-sans font-bold">Behind the Data</span></h2>
            <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl">
              Every satellite metric connects directly to human agency, restored soil, clean drinking water, and local leadership.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('observatory')}
            className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            Explore All Active Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GLOBAL_PROJECTS.slice(0, 3).map((project) => (
            <div 
              key={project.id}
              className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4 flex flex-col justify-between hover:border-[#C5A059]/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/30">
                    {project.country} • {project.region}
                  </span>
                  <span className="text-xs font-mono text-[#C5A059] font-bold">
                    {project.verifiedProgress}% Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F5F5F0] line-clamp-1">{project.title}</h3>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed line-clamp-3">{project.impactHighlight}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F5F5F0]/10 text-[11px] font-mono">
                  <div>
                    <div className="text-[#F5F5F0]/40 uppercase text-[9px]">Beneficiaries</div>
                    <div className="text-[#F5F5F0] font-bold">{project.beneficiariesCount.toLocaleString()} people</div>
                  </div>
                  <div>
                    <div className="text-[#F5F5F0]/40 uppercase text-[9px]">Area Restored</div>
                    <div className="text-emerald-400 font-bold">{project.ecologicalAreaHectares.toLocaleString()} ha</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#F5F5F0]/10">
                <button
                  onClick={() => onInspectProvenance(project.provenance)}
                  className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 font-mono"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Provenance Record
                </button>
                <button
                  onClick={() => onSelectTab('observatory')}
                  className="text-xs font-bold text-[#F5F5F0] hover:text-[#C5A059]"
                >
                  Inspect →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT VII — THE INVITATION: "LET'S BUILD WHAT LASTS" */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-[#F5F5F0]/10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B3022] text-[#C5A059] rounded-full text-xs font-mono uppercase border border-[#C5A059]/40">
            <TreeDeciduous className="w-4 h-4 text-[#C5A059]" />
            ACT VII — THE INVITATION
          </div>

          <h2 className="text-3xl sm:text-5xl font-light text-[#F5F5F0] font-serif italic tracking-tight">
            The future is not something we simply predict.<br />
            <span className="not-italic font-sans font-black text-[#F5F5F0]">It is something we build.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#F5F5F0]/60 max-w-2xl mx-auto leading-relaxed">
            Join the coalition of researchers, engineers, community leaders, and ethical investors building the first living civilization operating system for human flourishing.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onSelectTab('developers')}
              className="px-8 py-3.5 bg-[#F5F5F0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-xl"
            >
              Build with Atlas SDK
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('marketplace')}
              className="px-6 py-3.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all"
            >
              <Coins className="w-4 h-4 text-[#C5A059]" />
              Coordinate Capital on RVE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
