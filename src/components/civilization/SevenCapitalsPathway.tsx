import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Users, 
  BookOpen, 
  TreeDeciduous, 
  Coins, 
  ShieldCheck, 
  Cpu,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { SevenCapitalsData, SevenCapitalCategory, PageView } from '../../types';

interface SevenCapitalsPathwayProps {
  onSelectTab?: (tab: PageView) => void;
}

export const SevenCapitalsPathway: React.FC<SevenCapitalsPathwayProps> = ({ onSelectTab }) => {
  const [selectedPathway, setSelectedPathway] = useState<'education' | 'agroforestry' | 'microgrid'>('education');
  const [activeCapitalDetail, setActiveCapitalDetail] = useState<SevenCapitalCategory>('natural');

  const CAPITALS: SevenCapitalsData[] = [
    {
      capital: 'human',
      name: 'Human Capital',
      score: 84,
      trend: 'increasing',
      unit: 'Vitality Index',
      currentStock: '42,000 Trained Youth & Health Workers',
      transformationFlow: 'Invested into Social & Intellectual Capital',
      regenerativeYield: '+18% Labor Productivity without Burnout'
    },
    {
      capital: 'social',
      name: 'Social Capital',
      score: 91,
      trend: 'increasing',
      unit: 'Trust Index',
      currentStock: '14 Active Bioregional Community Assemblies',
      transformationFlow: 'Enables Zero-Friction Conflict Resolution',
      regenerativeYield: '100% Milestone Execution Compliance'
    },
    {
      capital: 'intellectual',
      name: 'Intellectual Capital',
      score: 88,
      trend: 'increasing',
      unit: 'Open Models & Blueprints',
      currentStock: '124 Open-Source Hardware & Policy Blueprints',
      transformationFlow: 'Replicated across 8 Sub-Saharan Cities',
      regenerativeYield: 'Zero Licensing Rent Extraction'
    },
    {
      capital: 'natural',
      name: 'Natural Capital',
      score: 79,
      trend: 'increasing',
      unit: 'Biosphere Health',
      currentStock: '124,200 ha Verified Restored Topsoil & Aquifers',
      transformationFlow: 'Provides Clean Water & High Soil Organic Matter',
      regenerativeYield: '+42% Crop Yield & Zero Flood Inundation'
    },
    {
      capital: 'financial',
      name: 'Financial Capital',
      score: 76,
      trend: 'increasing',
      unit: 'Patient Liquidity',
      currentStock: '$4.2B Mobilized on RVE Marketplace',
      transformationFlow: 'Structured as Milestone-Linked Outcome Tranches',
      regenerativeYield: '4.2% Capped Non-Extractive Yield'
    },
    {
      capital: 'institutional',
      name: 'Institutional Capital',
      score: 86,
      trend: 'increasing',
      unit: 'Governance Strength',
      currentStock: 'Constitutional Multi-Sig Community Veto Frameworks',
      transformationFlow: 'Protects Generational Assets from Alienation',
      regenerativeYield: 'Zero Predatory Land Grabbing'
    },
    {
      capital: 'technological',
      name: 'Technological Capital',
      score: 89,
      trend: 'increasing',
      unit: 'Fabrication Capacity',
      currentStock: '1,240 LifeHouses & 3.4MW Solar Desal Units',
      transformationFlow: 'Decentralized Clean Micro-Utilities',
      regenerativeYield: '100% Sovereign Local Maintenance'
    }
  ];

  const PATHWAYS = {
    education: {
      title: 'Youth Systems Engineering & Ecological Apprenticeship',
      flow: ['Financial Capital ($1.2M)', 'Human Capital (450 Guild Trainees)', 'Social Capital (Mutual Aid Networks)', 'Technological Capital (Fabrication Hubs)', 'Natural Capital (Swale Restorations)', 'Civilizational Flourishing (Generational Prosperity)'],
      description: 'Patient outcome capital converts directly into living youth technical mastery, catalyzing localized environmental restoration.'
    },
    agroforestry: {
      title: 'Mara-Rift Watershed Agroforestry Regeneration',
      flow: ['Financial Capital ($3.4M)', 'Natural Capital (42,000ha Soil Carbon)', 'Intellectual Capital (Open Soil Models)', 'Human Capital (Nutritional Security)', 'Institutional Capital (Land Cooperatives)', 'Civilizational Flourishing (Aquifer Resilience)'],
      description: 'Restores degraded topsoil, which expands household agricultural yields and anchors long-term cooperative land governance.'
    },
    microgrid: {
      title: 'Turkana Deep Solar-Desalination Network',
      flow: ['Financial Capital ($4.2M)', 'Technological Capital (3.4MW PV + RO)', 'Natural Capital (800k L/day Aquifer Water)', 'Social Capital (Pastoralist Peace Accords)', 'Human Capital (Zero Famine Relapse)', 'Civilizational Flourishing (Arid Oasis Economy)'],
      description: 'Replaces expensive fossil diesel trucking with sovereign solar water infrastructure, eliminating water conflict.'
    }
  };

  const activePathwayData = PATHWAYS[selectedPathway];

  const getCapitalIcon = (cat: SevenCapitalCategory) => {
    switch (cat) {
      case 'human': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'social': return <Users className="w-4 h-4 text-purple-400" />;
      case 'intellectual': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'natural': return <TreeDeciduous className="w-4 h-4 text-emerald-400" />;
      case 'financial': return <Coins className="w-4 h-4 text-[#C5A059]" />;
      case 'institutional': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'technological': return <Cpu className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-bold">
              Multi-Capital Economics Framework
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            THE SEVEN CAPITALS ENGINE
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            "Civilization cannot be measured solely by financial capital. Atlas tracks, converts, and compounds 7 distinct forms of living capital to ensure balanced, durable flourishing."
          </p>
        </div>

        {/* Pathway Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Conversion Pathway:</span>
          {(['education', 'agroforestry', 'microgrid'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPathway(p)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                selectedPathway === p
                  ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {p === 'education' ? 'Youth Apprenticeship' : p === 'agroforestry' ? 'Watershed Agroforestry' : 'Solar Desalination'}
            </button>
          ))}
        </div>
      </div>

      {/* Pathway Transformation Flow Banner */}
      <div className="p-4 sm:p-5 bg-[#121212] border border-[#C5A059]/40 rounded-sm space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            {activePathwayData.title}
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Compounding Value Cascade</span>
        </div>

        {/* Cascade Chain */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono scrollbar-thin">
          {activePathwayData.flow.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="px-3 py-2 bg-[#080808] border border-[#F5F5F0]/10 rounded-xs whitespace-nowrap text-[#F5F5F0] shadow-sm flex items-center gap-1.5">
                <span className="text-[#C5A059] font-bold">0{idx + 1}.</span>
                <span>{step}</span>
              </div>
              {idx < activePathwayData.flow.length - 1 && (
                <ArrowRight className="w-4 h-4 text-[#C5A059] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
          {activePathwayData.description}
        </p>
      </div>

      {/* 7 Capitals Grid */}
      <div className="space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50">
          The 7 Forms of Civilizational Capital:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAPITALS.map((cap) => (
            <button
              key={cap.capital}
              onClick={() => setActiveCapitalDetail(cap.capital)}
              className={`p-4 rounded-sm border text-left transition-all cursor-pointer space-y-2.5 ${
                activeCapitalDetail === cap.capital
                  ? 'bg-[#1B3022] border-[#C5A059] shadow-lg scale-102'
                  : 'bg-[#0A0A0A] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCapitalIcon(cap.capital)}
                  <span className="text-xs font-bold text-[#F5F5F0]">{cap.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">{cap.score}/100</span>
              </div>

              <div className="text-[11px] text-[#F5F5F0]/80 font-mono line-clamp-1">
                {cap.currentStock}
              </div>

              <div className="pt-1 border-t border-[#F5F5F0]/5 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                <span>Yield: {cap.regenerativeYield.slice(0, 18)}...</span>
                <span className="text-emerald-400">↑ Growing</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Capital Detail Box */}
      {(() => {
        const detail = CAPITALS.find((c) => c.capital === activeCapitalDetail) || CAPITALS[0];
        return (
          <div className="p-4 bg-[#080808] border border-[#C5A059]/30 rounded-sm space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <span className="font-bold font-serif text-[#F5F5F0] text-sm flex items-center gap-2">
                {getCapitalIcon(detail.capital)}
                {detail.name} Deep Dive
              </span>
              <span className="font-mono text-[#C5A059]">Metric Unit: {detail.unit}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 font-mono text-[11px]">
              <div>
                <div className="text-[#F5F5F0]/40 uppercase text-[9px]">Current Stock</div>
                <div className="text-[#F5F5F0] mt-0.5">{detail.currentStock}</div>
              </div>
              <div>
                <div className="text-[#F5F5F0]/40 uppercase text-[9px]">Transformation Flow</div>
                <div className="text-[#C5A059] mt-0.5">{detail.transformationFlow}</div>
              </div>
              <div>
                <div className="text-[#F5F5F0]/40 uppercase text-[9px]">Regenerative Yield</div>
                <div className="text-emerald-400 mt-0.5">{detail.regenerativeYield}</div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
