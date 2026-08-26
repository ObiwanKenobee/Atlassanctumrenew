import React, { useState } from 'react';
import { 
  Globe2, 
  Building2, 
  Cpu, 
  Cloud, 
  Phone, 
  GraduationCap, 
  HeartHandshake, 
  TreePine, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  X,
  Play,
  Pause,
  Compass
} from 'lucide-react';
import { PageView } from '../types';

export interface PartnerEntity {
  id: string;
  acronym: string;
  name: string;
  category: 'multilateral' | 'cloud_tech' | 'telecom_sovereign' | 'academic_humanitarian';
  categoryLabel: string;
  tagline: string;
  initiative: string;
  telemetryStream: string;
  nodesDeployed: number;
  bioregionFocus: string;
  moralAxiom: string;
  color: string;
  accentBg: string;
  websiteUrl?: string;
  description: string;
  keyOutcomes: string[];
}

export const PARTNERS_REGISTRY: PartnerEntity[] = [
  {
    id: 'undp',
    acronym: 'UNDP',
    name: 'United Nations Development Programme',
    category: 'multilateral',
    categoryLabel: 'Multilateral Global Body',
    tagline: 'Climate Resilience & SDG Alignment',
    initiative: 'Pan-African Bioregional Risk & Commons Financing',
    telemetryStream: '48 Climate Vulnerability Indices',
    nodesDeployed: 340,
    bioregionFocus: 'Sub-Saharan Drought Corridors',
    moralAxiom: 'Axiom IV: Universal Human Dignity',
    color: '#006EB5',
    accentBg: 'rgba(0, 110, 181, 0.12)',
    description: 'Collaborating on automated SDG-13 (Climate Action) and SDG-7 (Affordable Clean Energy) verification matrices linked directly to smart microgrid meters and community bio-swale sensors.',
    keyOutcomes: [
      'Empirical carbon accounting across 12 African bioregions',
      'Automated Free Prior Informed Consent (FPIC) verification',
      'Non-extractive resilience grant matching'
    ]
  },
  {
    id: 'afdb',
    acronym: 'AfDB',
    name: 'African Development Bank Group',
    category: 'multilateral',
    categoryLabel: 'Sovereign MDB',
    tagline: 'Energy & Sovereign Infrastructure Capital',
    initiative: 'Desert to Power & Agrivoltaic Capital Facility',
    telemetryStream: 'Sovereign Debt-for-Climate Tranches',
    nodesDeployed: 1280,
    bioregionFocus: 'Sahel & East African Rift Grid',
    moralAxiom: 'Axiom VII: Intergenerational Stewardship',
    color: '#008751',
    accentBg: 'rgba(0, 135, 81, 0.12)',
    description: 'Structuring decentralized energy mini-grid concession financing through Atlas Sanctum Smart Outcome Contracts with programmatic escrow release.',
    keyOutcomes: [
      '$42M in milestone-governed agrivoltaic tranches',
      'Zero-leakage capital deployment to community water kiosks',
      'Sovereign credit guarantee telemetry feeds'
    ]
  },
  {
    id: 'un-habitat',
    acronym: 'UN-Habitat',
    name: 'United Nations Human Settlements Programme',
    category: 'multilateral',
    categoryLabel: 'Urban Commons Agency',
    tagline: 'Sustainable Settlements & Informal Settlement Upgrades',
    initiative: 'Mathare Valley & Kibera Regenerative Urban Corridors',
    telemetryStream: 'Informal Settlement Spatial Digital Twins',
    nodesDeployed: 520,
    bioregionFocus: 'Nairobi River Basin Urban Corridor',
    moralAxiom: 'Axiom II: Right to Habitation & Shelter',
    color: '#009EDB',
    accentBg: 'rgba(0, 158, 219, 0.12)',
    description: 'Deploying modular LifeHouse bio-composite housing, community sanitation micro-utilities, and pedestrian riparian green corridors in high-density informal settlements.',
    keyOutcomes: [
      '450 carbon-negative LifeHouse units deployed in Mathare',
      'Continuous graywater bio-filtration monitoring',
      'Community land trust cryptographic rights titling'
    ]
  },
  {
    id: 'unep',
    acronym: 'UNEP',
    name: 'United Nations Environment Programme',
    category: 'multilateral',
    categoryLabel: 'Planetary Biosphere Agency',
    tagline: 'Ecosystem Restoration & Planetary Boundaries',
    initiative: 'UN Decade on Ecosystem Restoration / Nairobi Basin',
    telemetryStream: 'Riparian Biodiversity & Heavy Metal In-Situ Nodes',
    nodesDeployed: 890,
    bioregionFocus: 'Nairobi River & Mara Watershed Basin',
    moralAxiom: 'Axiom I: Sanctity of the Biosphere',
    color: '#15803D',
    accentBg: 'rgba(21, 128, 61, 0.12)',
    description: 'Providing validated ecological benchmark thresholds, soil bio-remediation protocol validation, and real-time aquatic microbiome sensing infrastructure.',
    keyOutcomes: [
      'Continuous biological oxygen demand (BOD) river sensing',
      'Native riparian canopy reforestation tracking',
      'Open-access ecological commons ledger'
    ]
  },
  {
    id: 'google-cloud',
    acronym: 'Google Cloud',
    name: 'Google Cloud Platform',
    category: 'cloud_tech',
    categoryLabel: 'Planetary Computing & AI',
    tagline: 'Earth Engine Geospatial & Vertex AI Neural Engines',
    initiative: 'Planetary Satellite Telemetry & Foundation Models',
    telemetryStream: 'Sentinel-2 & Landsat High-Res Earth Engine Ingestion',
    nodesDeployed: 4500,
    bioregionFocus: 'Global Biosphere Observatories',
    moralAxiom: 'Axiom IX: Epistemic Truth & No Idols',
    color: '#4285F4',
    accentBg: 'rgba(66, 133, 244, 0.12)',
    description: 'Powering high-cadence multispectral satellite ingestion, Gemini 2.5 flash inference for real-time systems dynamics synthesis, and scalable Firestore telemetry storage.',
    keyOutcomes: [
      'Sub-second inference across 14,000 spatial layers',
      'Automated illegal sand mining and deforestation alerts',
      'Serverless high-throughput microgrid event processing'
    ]
  },
  {
    id: 'aws',
    acronym: 'AWS',
    name: 'Amazon Web Services',
    category: 'cloud_tech',
    categoryLabel: 'Cloud & Edge IoT Infrastructure',
    tagline: 'IoT Greengrass & Resilient Edge Telemetry',
    initiative: 'Distributed Solar BMS & Edge Hardware Ingestion',
    telemetryStream: 'Modbus RTU & Inverter Telemetry Sockets',
    nodesDeployed: 3100,
    bioregionFocus: 'Decentralized Microgrid Clusters',
    moralAxiom: 'Axiom XI: Reliable Distributed Infrastructure',
    color: '#FF9900',
    accentBg: 'rgba(255, 153, 0, 0.12)',
    description: 'Providing edge IoT runtime gateways for ruggedized off-grid solar inverters, agricultural cold storage hubs, and water borehole pressure monitors.',
    keyOutcomes: [
      'Sub-100ms MQTT telemetry ingestion from 3,000+ edge meters',
      'Zero-loss offline data caching during mesh disconnects',
      'Cryptographic hardware attestation at chip level'
    ]
  },
  {
    id: 'safaricom',
    acronym: 'Safaricom',
    name: 'Safaricom PLC / M-Pesa',
    category: 'telecom_sovereign',
    categoryLabel: 'Telecom & FinTech Rails',
    tagline: 'M-Pesa Micro-Payments & NB-IoT Connectivity',
    initiative: 'P2P Microgrid Tariff Settlement & Community Mesh',
    telemetryStream: '2.4M Daily M-Pesa Micro-Tariff Micro-Transactions',
    nodesDeployed: 6200,
    bioregionFocus: 'East Africa Cellular & NB-IoT Grid',
    moralAxiom: 'Axiom V: Equitable Economic Exchange',
    color: '#00A859',
    accentBg: 'rgba(0, 168, 89, 0.12)',
    description: 'Enabling real-time peer-to-peer electricity micro-payments, agricultural cold chain escrow unlocks, and narrowband IoT sensor telemetry across rural and peri-urban Kenya.',
    keyOutcomes: [
      'Near-zero transaction fee P2P energy trades',
      'Cellular triangulation for decentralized asset verifications',
      'Direct mobile wallet payout for youth maintenance guild work orders'
    ]
  },
  {
    id: 'strathmore',
    acronym: 'Strathmore University',
    name: 'Strathmore Energy Research Centre (SERC)',
    category: 'academic_humanitarian',
    categoryLabel: 'Academic & Energy Research',
    tagline: 'Independent Solar Engineering & Model Calibration',
    initiative: 'Bioregional Solar & Thermal Physics Benchmarking',
    telemetryStream: 'PV Degradation & Battery Chemistry Lab Feeds',
    nodesDeployed: 180,
    bioregionFocus: 'Nairobi & Great Rift Energy Corridors',
    moralAxiom: 'Axiom VIII: Peer-Reviewed Scientific Integrity',
    color: '#B91C1C',
    accentBg: 'rgba(185, 28, 28, 0.12)',
    description: 'Providing independent laboratory calibration of photovoltaic degradation models, LFP battery cycle life forecasting, and certifying youth technician apprenticeships.',
    keyOutcomes: [
      'Empirical calibration coefficients for Euler simulation engine',
      '420 certified youth microgrid engineers graduated',
      'Continuous grid power quality and harmonics benchmarking'
    ]
  },
  {
    id: 'kenya-red-cross',
    acronym: 'Kenya Red Cross',
    name: 'Kenya Red Cross Society (KRCS)',
    category: 'academic_humanitarian',
    categoryLabel: 'Humanitarian & First-Response',
    tagline: 'Community Early Warning & Disaster Resilience',
    initiative: 'Flood Surge Modeling & Emergency Water Desalination',
    telemetryStream: 'Emergency Dispatch & River Level Warning Mesh',
    nodesDeployed: 940,
    bioregionFocus: 'Tana River, Lake Victoria & Mathare Floodplains',
    moralAxiom: 'Axiom III: Compassion & Rapid Relief of Suffering',
    color: '#E11D48',
    accentBg: 'rgba(225, 29, 72, 0.12)',
    description: 'Integrating hydrological flood surge forecasting with community SMS early warning alerts and deploying emergency solar-powered water purification units.',
    keyOutcomes: [
      '3.5-hour advance flood evacuation warning lead time',
      'Zero cholera outbreaks across 8 high-risk monitored zones',
      'Direct coordination with local volunteer rescue teams'
    ]
  },
  {
    id: 'wri',
    acronym: 'WRI',
    name: 'World Resources Institute',
    category: 'academic_humanitarian',
    categoryLabel: 'Global Geospatial Research',
    tagline: 'Global Forest Watch & Aqueduct Water Risk Atlas',
    initiative: 'Land Restoration & Aquifer Depletion Monitoring',
    telemetryStream: 'Global Aqueduct Water Stress & Canopy Height Feeds',
    nodesDeployed: 1600,
    bioregionFocus: 'Pan-Tropical Forest & Agricultural Basins',
    moralAxiom: 'Axiom X: Transparent Open Knowledge Commons',
    color: '#D97706',
    accentBg: 'rgba(217, 119, 6, 0.12)',
    description: 'Providing validated global geospatial benchmarks on tree canopy restoration, groundwater stress indices, and soil organic carbon flux models.',
    keyOutcomes: [
      'Standardized baseline datasets for 80,000+ hectares under restoration',
      'Verified water risk indices embedded in capital routing logic',
      'Global peer-reviewed scientific credibility'
    ]
  }
];

interface PartnerCarouselProps {
  onSelectTab?: (tab: PageView) => void;
}

export const PartnerCarousel: React.FC<PartnerCarouselProps> = ({ onSelectTab }) => {
  const [selectedPartner, setSelectedPartner] = useState<PartnerEntity | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const filteredPartners = activeCategory === 'all' 
    ? PARTNERS_REGISTRY 
    : PARTNERS_REGISTRY.filter(p => p.category === activeCategory);

  // Duplicate list to make infinite marquee seamlessly loop
  const marqueeItems = [...PARTNERS_REGISTRY, ...PARTNERS_REGISTRY];

  return (
    <div className="w-full bg-[#070707] border-y border-[#F5F5F0]/10 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header with Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059] font-bold">
                Institutional Trust & Verified Infrastructure Network
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0]">
              Global Partners in Sovereign Regeneration
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-2xl">
              Atlas Sanctum operates in verified telemetry partnership with world-leading multilateral agencies, sovereign capital funds, deep-tech cloud providers, and frontline humanitarian institutions.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 text-right">
              <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Verified Partners</div>
              <div className="text-base font-bold font-mono text-[#C5A059]">10 Global Alliances</div>
            </div>
            <div className="px-3.5 py-2 rounded-sm bg-[#0D0D0D] border border-emerald-500/20 text-right">
              <div className="text-[10px] font-mono text-emerald-400 uppercase">Live Sensor Mesh</div>
              <div className="text-base font-bold font-mono text-emerald-400">20,800+ Nodes</div>
            </div>
          </div>
        </div>

        {/* Category Selector Tabs & Carousel Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm">
            {[
              { id: 'all', label: 'All Alliances (10)' },
              { id: 'multilateral', label: 'Multilateral & UN (4)' },
              { id: 'cloud_tech', label: 'Cloud & Earth AI (2)' },
              { id: 'telecom_sovereign', label: 'FinTech & Sovereign (1)' },
              { id: 'academic_humanitarian', label: 'Academic & Humanitarian (3)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 shadow-sm font-bold'
                    : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#141414]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Carousel Interaction Hint */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Click any partner card for joint telemetry brief</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INFINITE ROTATING CAROUSEL TRACK */}
        {/* ========================================================================= */}
        <div 
          className="relative w-full overflow-hidden py-3 group cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left & Right Gradient Shadows for seamless fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#070707] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#070707] to-transparent z-20 pointer-events-none" />

          {/* Animated Marquee Strip */}
          <div 
            className={`animate-marquee gap-4 flex items-center ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {marqueeItems.map((partner, index) => {
              const isSelected = selectedPartner?.id === partner.id;
              return (
                <div
                  key={`${partner.id}-${index}`}
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-[320px] sm:w-[360px] p-5 rounded-sm bg-[#0D0D0D] border transition-all duration-200 shrink-0 text-left cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-[#C5A059] bg-[#141414] shadow-xl ring-1 ring-[#C5A059]/40 scale-[1.02]'
                      : 'border-[#F5F5F0]/10 hover:border-[#C5A059]/50 hover:bg-[#121212] hover:scale-[1.01]'
                  }`}
                >
                  {/* Top Category and Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span 
                      className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold border"
                      style={{ 
                        color: partner.color,
                        borderColor: `${partner.color}40`,
                        backgroundColor: partner.accentBg 
                      }}
                    >
                      {partner.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-[#F5F5F0]/40 flex items-center gap-1">
                      <Activity className="w-2.5 h-2.5 text-emerald-400" />
                      {partner.nodesDeployed.toLocaleString()} Nodes
                    </span>
                  </div>

                  {/* Main Acronym & Full Name */}
                  <div className="space-y-1 mb-3">
                    <div className="text-xl font-bold font-mono tracking-tight text-[#F5F5F0] flex items-center justify-between">
                      <span style={{ color: partner.color }}>{partner.acronym}</span>
                      <ChevronRight className="w-4 h-4 text-[#F5F5F0]/30 group-hover:text-[#C5A059] transition-colors" />
                    </div>
                    <div className="text-xs font-medium text-[#F5F5F0]/90 line-clamp-1">
                      {partner.name}
                    </div>
                  </div>

                  {/* Tagline & Joint Initiative */}
                  <div className="space-y-2 text-xs border-t border-[#F5F5F0]/10 pt-3">
                    <div className="text-[#C5A059] font-medium line-clamp-1 text-[11px]">
                      {partner.initiative}
                    </div>
                    <div className="text-[11px] text-[#F5F5F0]/60 line-clamp-2">
                      {partner.tagline}
                    </div>
                  </div>

                  {/* Bottom Telemetry Chip */}
                  <div className="mt-3 pt-2.5 border-t border-[#F5F5F0]/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#F5F5F0]/40">Telemetry:</span>
                    <span className="text-emerald-400 font-semibold truncate max-w-[200px]">
                      {partner.telemetryStream}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Grid View of All 10 Logos/Pills for Direct Clickability */}
        <div className="pt-4 border-t border-[#F5F5F0]/10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 mb-3 flex items-center justify-between">
            <span>Direct Partner Ledger & Telemetry Verification Gateways</span>
            <span className="text-emerald-400">● 10/10 In-Situ Links Active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {PARTNERS_REGISTRY.map((p) => {
              const isSelected = selectedPartner?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartner(p)}
                  className={`p-3 rounded-sm border text-left transition-all flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-md'
                      : 'bg-[#0A0A0A] border-[#F5F5F0]/10 hover:border-[#C5A059]/40 text-[#F5F5F0]/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono" style={{ color: p.color }}>
                      {p.acronym}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-[#F5F5F0]/60 line-clamp-1">
                    {p.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PARTNER DETAIL MODAL / DRAWER */}
      {/* ========================================================================= */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-5">
              <div className="flex items-center gap-2">
                <span 
                  className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-sm font-bold border"
                  style={{ 
                    color: selectedPartner.color,
                    borderColor: `${selectedPartner.color}50`,
                    backgroundColor: selectedPartner.accentBg 
                  }}
                >
                  {selectedPartner.categoryLabel}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Telemetry Integration
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold font-mono" style={{ color: selectedPartner.color }}>
                  {selectedPartner.acronym}
                </h3>
                <span className="text-lg font-medium text-[#F5F5F0]">
                  {selectedPartner.name}
                </span>
              </div>

              <p className="text-xs text-[#C5A059] font-mono">
                {selectedPartner.tagline}
              </p>
            </div>

            {/* Main Content & Scope */}
            <div className="space-y-4 text-xs text-[#F5F5F0]/80 leading-relaxed">
              <p className="text-sm text-[#F5F5F0]">
                {selectedPartner.description}
              </p>

              {/* Joint Key Outcomes */}
              <div className="p-4 rounded-sm bg-[#080808] border border-[#F5F5F0]/10 space-y-2.5">
                <div className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Joint Key Telemetry Outcomes & Deliverables
                </div>
                <ul className="space-y-1.5 pl-1">
                  {selectedPartner.keyOutcomes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#F5F5F0]/80">
                      <span className="text-emerald-400 mt-0.5">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data & Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
                  <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 block">Primary Telemetry Feed</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold mt-0.5 block">
                    {selectedPartner.telemetryStream}
                  </span>
                </div>
                <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
                  <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 block">Operational Bioregion</span>
                  <span className="text-xs font-mono text-[#C5A059] font-semibold mt-0.5 block">
                    {selectedPartner.bioregionFocus}
                  </span>
                </div>
                <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
                  <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 block">Sensors & In-Situ Nodes</span>
                  <span className="text-xs font-mono text-[#F5F5F0] font-bold mt-0.5 block">
                    {selectedPartner.nodesDeployed.toLocaleString()} Hardware Nodes
                  </span>
                </div>
                <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
                  <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 block">Moral Axiom Anchor</span>
                  <span className="text-xs font-mono text-[#F5F5F0]/80 font-medium mt-0.5 block">
                    {selectedPartner.moralAxiom}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F5F5F0]/10">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] text-xs font-mono rounded-sm transition-colors"
              >
                Close Brief
              </button>

              <div className="flex items-center gap-2">
                {onSelectTab && (
                  <button
                    onClick={() => {
                      setSelectedPartner(null);
                      onSelectTab('observatory');
                    }}
                    className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>View In Observatory</span>
                  </button>
                )}
                {onSelectTab && (
                  <button
                    onClick={() => {
                      setSelectedPartner(null);
                      onSelectTab('evidence-ledger');
                    }}
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Audit Provenance Ledger</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
