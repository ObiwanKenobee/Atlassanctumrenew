import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Sparkles, X, ArrowRight, Layers, FileText, AlertTriangle, ShieldCheck, Database, Compass, Zap, Bot } from 'lucide-react';
import { SearchableItem, fuzzySearch } from '../lib/fuzzySearch';
import { PageView } from '../types';
import { FAILURE_LEDGER_ENTRIES } from '../data/failureLedgerData';
import { MISSION_ANALYTICS_DATA } from '../data/missionAnalyticsData';
import { audioFeedback } from '../lib/audioFeedback';

interface GlobalEpistemicSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
  onSelectProvenance?: (prov: any) => void;
}

export const GlobalEpistemicSearch: React.FC<GlobalEpistemicSearchProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectProvenance
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build searchable index from all platform records
  const searchIndex: SearchableItem[] = useMemo(() => {
    const items: SearchableItem[] = [
      // Agent Mission Control
      {
        id: 'view-agent-mission-control',
        title: 'Agent Mission Control (Autonomous Fleet)',
        subtitle: 'Enterprise Multi-Agent Execution & Asynchronous Orchestrator',
        description: 'Goal → Context → Plan → Tool Selection → Execution → Verification → Evidence → Memory with Google ADK, Gemini 3.7, and Cloud Run.',
        category: 'agent',
        targetTab: 'agent-mission-control',
        tags: ['agent', 'adk', 'gemini', 'fleet', 'mission', 'workflow', 'autonomous', 'tools', 'memory']
      },
      // Observatory
      {
        id: 'view-observatory',
        title: 'Atlas Observatory & Planetary Bioregions',
        subtitle: 'Global Macro-Scale Monitoring',
        description: 'Real-time telemetry, bioregional boundaries, and macro civilization indicators across Earth systems.',
        category: 'view',
        targetTab: 'observatory',
        tags: ['planet', 'satellite', 'sensors', 'bioregions', 'ndvi', 'macro']
      },
      // Living Reality Matrix
      {
        id: 'view-living-reality',
        title: 'Living Reality Matrix & Telemetry Stream',
        subtitle: 'Multi-Spectral Ground-Truthing Observatory',
        description: 'Empirical sensor streams: Sentinel-2 NDVI, GEDI Biomass, SMAP Moisture, SWAT Hydrology, and Merkle proofs.',
        category: 'view',
        targetTab: 'living-reality',
        tags: ['spectroscopy', 'merkle', 'telemetry', 'soil', 'hydrology', 'reality']
      },
      // Bioregional Twin
      {
        id: 'view-bioregional-twin',
        title: 'Bioregional Digital Twin Engine',
        subtitle: 'Micro-Climatic Spatial Simulation',
        description: 'High-resolution 3D environmental twin for spatial simulations, watershed modeling, and vegetation indices.',
        category: 'view',
        targetTab: 'bioregional-twin',
        tags: ['twin', '3d', 'spatial', 'watershed', 'canopy', 'microclimate']
      },
      // Opportunity Intelligence
      {
        id: 'view-opp-intel',
        title: 'Opportunity Intelligence & Pipeline',
        subtitle: 'Regenerative Project Discovery',
        description: 'AI-curated high-impact regenerative opportunities matched with ecological and social capital needs.',
        category: 'view',
        targetTab: 'opportunity-intelligence',
        tags: ['opportunity', 'pipeline', 'roi', 'capital', 'ecosystem', 'projects']
      },
      // Decision Room
      {
        id: 'view-decision-room',
        title: 'Decision Room & Multi-Scenario Lab',
        subtitle: 'Collaborative Governance & Trade-off Analysis',
        description: 'Simulate second-order consequences, moral scorecards, and stakeholder alignments before deployment.',
        category: 'view',
        targetTab: 'decision-room',
        tags: ['decision', 'simulation', 'governance', 'scenarios', 'voting', 'tradeoffs']
      },
      // Moral Arbiter
      {
        id: 'view-moral-arbiter',
        title: 'Moral Arbiter & Ethical Engine',
        subtitle: 'Universal Principles & Canon XXIII Evaluation',
        description: 'Real-time ethical audit engine applying human dignity, intergenerational justice, and non-extractive guardrails.',
        category: 'moral',
        targetTab: 'moral-arbiter',
        tags: ['ethics', 'moral', 'justice', 'dignity', 'guardrails', 'scorecard']
      },
      // Mission Performance Analytics
      {
        id: 'view-mission-analytics',
        title: 'Mission Performance Analytics & Failure Synthesis',
        subtitle: 'Empirical Verification & Recovery Velocity',
        description: 'Synthesizing live deployment metrics with failure post-mortems to calculate true biophysical resilience.',
        category: 'view',
        targetTab: 'mission-analytics',
        tags: ['analytics', 'performance', 'metrics', 'recovery', 'velocity', 'biomes']
      },
      // Failure Ledger View
      {
        id: 'view-failure-ledger',
        title: 'Institutional Failure Ledger & Post-Mortems',
        subtitle: 'Transparent Learning & Root-Cause Database',
        description: 'Public documentation of failed interventions, unexpected second-order distortions, and mitigation blueprints.',
        category: 'failure',
        targetTab: 'failure-ledger',
        tags: ['failure', 'postmortem', 'lessons', 'anti-fragile', 'ledger']
      },
      // Evidence Mapping View
      {
        id: 'view-evidence-mapping',
        title: 'Evidence Mapping & Provenance Graph',
        subtitle: 'Cryptographic Epistemic Lineage',
        description: 'Graph visualization tracing claims back to satellite passes, IoT sensor meshes, and audited field reports.',
        category: 'evidence',
        targetTab: 'evidence-mapping',
        tags: ['evidence', 'provenance', 'cryptography', 'merkle', 'lineage', 'graph']
      },
      // Capital Engine
      {
        id: 'view-capital-engine',
        title: 'Capital Engine & 8-Forms Matrix',
        subtitle: 'Non-Extractive Multi-Capital Allocation',
        description: 'Directing financial, natural, social, human, and intellectual capital toward verifiable regenerative yields.',
        category: 'capital',
        targetTab: 'capital-engine',
        tags: ['capital', 'finance', 'eight-forms', 'rve', 'allocation', 'multiplier']
      },
      // Multimodal Studio
      {
        id: 'view-multimodal-studio',
        title: 'Multimodal AI Creative & Systems Studio',
        subtitle: 'Gemini 3.5 & 3.1 Creative Laboratory',
        description: 'Text, image generation, voice conversation, audio transcription, and systems dynamic modeling studio.',
        category: 'view',
        targetTab: 'multimodal-studio',
        tags: ['multimodal', 'gemini', 'creative', 'studio', 'image', 'audio', 'voice']
      }
    ];

    // Add failure ledger items
    FAILURE_LEDGER_ENTRIES.forEach((f) => {
      items.push({
        id: `failure-${f.id}`,
        title: `${f.projectName} (${f.id})`,
        subtitle: `Bioregion: ${f.bioregion} • Category: ${f.failureCategory}`,
        description: `${f.coreHypothesis} Lesson: ${f.epistemicLessonsLearned}`,
        category: 'failure',
        targetTab: 'failure-ledger',
        tags: ['failure', f.failureCategory, f.bioregion, f.id]
      });
    });

    // Add mission analytics deployments
    MISSION_ANALYTICS_DATA.forEach((m) => {
      items.push({
        id: `mission-${m.id}`,
        title: `${m.missionTitle} [${m.status}]`,
        subtitle: `Biome: ${m.biomeType} • Capital: $${(m.totalCapitalDeployed / 1000).toFixed(0)}k`,
        description: `Operating in ${m.bioregion}. Success Rate: ${m.successRate}%, Recovery Velocity: ${m.recoveryVelocityDays} days.`,
        category: 'ledger',
        targetTab: 'mission-analytics',
        tags: ['deployment', m.biomeType, m.status, m.bioregion]
      });
    });

    return items;
  }, []);

  const filteredResults = useMemo(() => {
    let list = fuzzySearch(searchIndex, query);
    if (activeCategory !== 'all') {
      list = list.filter((item) => item.category === activeCategory);
    }
    return list;
  }, [searchIndex, query, activeCategory]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  const handleSelect = (item: SearchableItem) => {
    audioFeedback.play('softClick');
    if (item.targetTab) {
      onSelectTab(item.targetTab as PageView);
    }
    onClose();
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'agent', label: 'Autonomous Agents' },
    { id: 'view', label: 'Views & Modules' },
    { id: 'ledger', label: 'Ledgers' },
    { id: 'failure', label: 'Failure Post-Mortems' },
    { id: 'evidence', label: 'Evidence & Provenance' },
    { id: 'moral', label: 'Moral Arbiter' },
    { id: 'capital', label: 'Capital Matrix' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="global-epistemic-search-modal"
        className="relative w-full max-w-3xl flex flex-col bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-md shadow-2xl overflow-hidden text-[#F5F5F0]"
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F5F5F0]/10 bg-[#080808]">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Fuzzy search across views, ledgers, post-mortems, telemetry, and agent fleets..."
            className="w-full bg-transparent text-sm sm:text-base text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#F5F5F0]/40 border border-[#F5F5F0]/10 px-2 py-0.5 rounded">
            ESC to exit
          </div>
          <button
            onClick={onClose}
            className="text-[#F5F5F0]/60 hover:text-[#F5F5F0] p-1.5 rounded hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#0A0A0A] border-b border-[#F5F5F0]/10 overflow-x-auto text-[11px] font-mono scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === c.id
                  ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                  : 'bg-white/5 text-[#F5F5F0]/70 hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5 p-2">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-[#F5F5F0]/50 font-mono text-xs">
              No matching epistemic records found for "{query}".
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group p-3 rounded cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected ? 'bg-[#1B3022]/70 border border-[#C5A059]/40' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded shrink-0 mt-0.5 ${
                    item.category === 'agent' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                    item.category === 'failure' ? 'bg-red-950/80 text-red-300 border border-red-500/40' :
                    item.category === 'moral' ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' :
                    item.category === 'evidence' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40' :
                    'bg-[#0D0D0D] text-[#C5A059] border border-[#C5A059]/20'
                  }`}>
                    {item.category === 'agent' ? <Bot className="w-4 h-4" /> :
                     item.category === 'failure' ? <AlertTriangle className="w-4 h-4" /> :
                     item.category === 'moral' ? <ShieldCheck className="w-4 h-4" /> :
                     item.category === 'evidence' ? <Database className="w-4 h-4" /> :
                     <Layers className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#F5F5F0] truncate group-hover:text-[#C5A059] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-[#F5F5F0]/60 border border-white/10 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    {item.subtitle && (
                      <p className="text-[11px] text-[#C5A059]/80 font-mono mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-[#F5F5F0]/60 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#080808] border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/50">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">↑↓</kbd> navigate</span>
            <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded">↵</kbd> select</span>
          </div>
          <div>{filteredResults.length} records indexed</div>
        </div>
      </div>
    </div>
  );
};
