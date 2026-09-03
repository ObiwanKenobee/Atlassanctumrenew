import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Compass,
  Filter
} from 'lucide-react';
import { CivilizationalMemoryItem, PageView } from '../../types';

interface CivilizationalMemoryGraphProps {
  onSelectTab?: (tab: PageView) => void;
}

export const CivilizationalMemoryGraph: React.FC<CivilizationalMemoryGraphProps> = ({ onSelectTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const MEMORY_RECORDS: CivilizationalMemoryItem[] = [
    {
      id: 'mem-01',
      title: 'Colonial Rigid Concrete Canalization of Urban Rivers',
      bioregion: 'Nairobi River Basin (1970-2015)',
      eraOrYear: '1970 - 2015',
      origin: 'Municipal engineering push to straighten urban rivers using smooth vertical concrete culverts.',
      problem: 'Monsoon storm surges flooding informal riverfront settlements.',
      decision: 'Install high-velocity concrete channels to rapidly dump stormwater downstream.',
      intervention: '14km of trapezoidal concrete flumes without vegetative absorption or sediment traps.',
      outcome: 'Multiplied water velocity by 340%, destroying downstream bridges and causing catastrophic flash floods.',
      failure: 'Ignored river hydraulics, hydraulic roughness, and natural wetland infiltration dynamics.',
      lesson: 'Never accelerate stormwater through urban centers; absorb surge energy using vegetated bio-swales and retention ponds.',
      nextGenerationAction: 'Atlas Bio-Composite Vegetated Swales with Vetiver root reinforcement.',
      verifiedBy: 'UoN Civil & Environmental Engineering Archives'
    },
    {
      id: 'mem-02',
      title: 'Donor-Subsidized Diesel Deep Well Pumping Schemes',
      bioregion: 'Turkana Arid Pastoralist Corridor (1995-2018)',
      eraOrYear: '1995 - 2018',
      origin: 'Foreign aid agency borehole drilling campaign to mitigate recurring drought mortality.',
      problem: 'Groundwater depth >250m inaccessible by manual hand pumps.',
      decision: 'Install centralized diesel generator generator pumps and donate initial 6-month fuel supply.',
      intervention: '180 deep diesel boreholes across Northern Kenya without local fuel supply chain economics.',
      outcome: 'Within 24 months, 82% of pumps became non-operational when donor fuel ran out and spare parts failed.',
      failure: 'Assumed ongoing external subsidies and ignored $2.40/L desert logistics costs.',
      lesson: 'Pumping energy must be harvested from local renewable sunlight with zero recurring fuel expenditure.',
      nextGenerationAction: 'Atlas 3.4MW Solar Direct Reverse Osmosis & Desalination Microgrids.',
      verifiedBy: 'Turkana County Water Authority Historical Audit'
    },
    {
      id: 'mem-03',
      title: 'Single-Use Plastic Export & Dumping Arbitrage',
      bioregion: 'Global South Coastal & Informal Cities (2000-2022)',
      eraOrYear: '2000 - 2022',
      origin: 'Exporting low-grade plastic scrap to developing countries under the guise of "recycling".',
      problem: 'Exponential packaging waste generation in consumer product supply chains.',
      decision: 'Ship unsorted plastic baled waste overseas to informal markets with loose labor standards.',
      intervention: 'Millions of metric tons dumped into open drains, waterways, and informal settlement landfills.',
      outcome: 'Severe microplastic soil toxicity, drainage blockage, and dangerous informal open-air burning.',
      failure: 'Externalized environmental and health costs onto vulnerable downstream populations.',
      lesson: 'Waste must be physically converted into clean local energy or circular construction materials at the source.',
      nextGenerationAction: 'Atlas Decentralized Plastic Pyrolysis & Bio-Composite LifeHouse Modules.',
      verifiedBy: 'UNEP Global Waste Management Outlook'
    }
  ];

  const filteredRecords = MEMORY_RECORDS.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bioregion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lesson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRecord = filteredRecords[selectedItemIndex] || filteredRecords[0] || MEMORY_RECORDS[0];

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-bold">
              Institutional Memory & Failure Ledger
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            WHAT HAS HUMANITY ALREADY TRIED HERE?
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            "A civilization that buries its failures is condemned to repeat them. Atlas preserves the full historical chain: Origin → Problem → Decision → Intervention → Outcome → Failure → Lesson → Regeneration."
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#F5F5F0]/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search past interventions & lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs pl-9 pr-3 py-1.5 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Record Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredRecords.map((rec, idx) => (
          <button
            key={rec.id}
            onClick={() => setSelectedItemIndex(idx)}
            className={`p-4 rounded-sm border text-left transition-all cursor-pointer space-y-2 ${
              activeRecord.id === rec.id
                ? 'bg-[#1B3022] border-[#C5A059] shadow-lg scale-101'
                : 'bg-[#0A0A0A] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A059]">
              <span>{rec.eraOrYear}</span>
              <span className="text-emerald-400">Lesson Indexed</span>
            </div>
            <h4 className="text-xs font-bold text-[#F5F5F0] line-clamp-2">{rec.title}</h4>
            <div className="text-[11px] text-[#F5F5F0]/60 font-mono truncate">{rec.bioregion}</div>
          </button>
        ))}
      </div>

      {/* Deep Dive 8-Step Chain Box */}
      <div className="p-6 bg-[#121212] border-2 border-[#C5A059]/40 rounded-sm space-y-5 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
          <div>
            <span className="text-xs font-mono text-[#C5A059] uppercase">{activeRecord.bioregion}</span>
            <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">{activeRecord.title}</h3>
          </div>
          <span className="text-[10px] font-mono text-[#F5F5F0]/50">
            Source: {activeRecord.verifiedBy}
          </span>
        </div>

        {/* 8-Step Chain */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold">1. ORIGIN</span>
            <p className="text-[#F5F5F0]/80">{activeRecord.origin}</p>
          </div>

          <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-blue-400 font-bold">2. PROBLEM</span>
            <p className="text-[#F5F5F0]/80">{activeRecord.problem}</p>
          </div>

          <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-purple-400 font-bold">3. DECISION</span>
            <p className="text-[#F5F5F0]/80">{activeRecord.decision}</p>
          </div>

          <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-amber-400 font-bold">4. INTERVENTION</span>
            <p className="text-[#F5F5F0]/80">{activeRecord.intervention}</p>
          </div>

          <div className="p-3 bg-[#080808] border border-rose-500/20 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-rose-400 font-bold">5. OUTCOME</span>
            <p className="text-[#F5F5F0]/80">{activeRecord.outcome}</p>
          </div>

          <div className="p-3 bg-[#080808] border border-rose-500/30 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-rose-300 font-bold">6. ROOT FAILURE</span>
            <p className="text-rose-200/90 font-mono text-[11px]">{activeRecord.failure}</p>
          </div>

          <div className="p-3 bg-[#08140B] border border-emerald-500/30 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">7. PERMANENT LESSON</span>
            <p className="text-emerald-200/90 font-serif italic">{activeRecord.lesson}</p>
          </div>

          <div className="p-3 bg-[#1B3022] border border-[#C5A059]/40 rounded-xs space-y-1">
            <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold">8. NEXT GENERATION</span>
            <p className="text-[#F5F5F0] font-bold">{activeRecord.nextGenerationAction}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-[#F5F5F0]/50">
            Immutable Historical Knowledge Graph v2.4
          </span>
          <button
            onClick={() => onSelectTab && onSelectTab('failure-ledger')}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Failure Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
