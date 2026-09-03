import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Globe, 
  Users, 
  Cpu, 
  Scale, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Eye, 
  Activity, 
  Layers, 
  Flame, 
  Compass, 
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { PageView } from '../../types';

interface AtlasCentralVisualProps {
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter?: () => void;
  onOpenMoralSimulator?: () => void;
}

export const AtlasCentralVisual: React.FC<AtlasCentralVisualProps> = ({
  onSelectTab,
  onOpenCommandCenter,
  onOpenMoralSimulator
}) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<number>(0);
  const [activeTabMode, setActiveTabMode] = useState<'visual' | 'covenant' | 'sanctuary_vs_babel'>('visual');
  const [selectedCycleStep, setSelectedCycleStep] = useState<number>(0);

  const COVENANT_PRINCIPLES = [
    {
      num: '01',
      title: 'CREATION',
      scripture: 'Genesis',
      question: 'What are we responsible for cultivating?',
      axiom: 'Build through stewardship rather than extraction. Nature is a living trust, not an open quarry.',
      engineeringConstraint: 'Every project must register positive biodiversity, soil, or aquifer restoration metrics before capital disbursement.',
      color: '#10B981'
    },
    {
      num: '02',
      title: 'LIBERATION',
      scripture: 'Exodus',
      question: 'Does this intervention liberate or capture?',
      axiom: 'Technology should increase human agency and reduce destructive, extractive dependency.',
      engineeringConstraint: 'Zero platform lock-in. Open hardware blueprints, sovereign cryptographic keys, and local offline-first execution.',
      color: '#8FB8DE'
    },
    {
      num: '03',
      title: 'HOLINESS',
      scripture: 'Leviticus',
      question: 'Where are the sacred boundaries of power?',
      axiom: 'Power requires strict computational and moral boundaries around AI, capital, land, healthcare, and labor.',
      engineeringConstraint: 'Multi-signature community veto locks on land, data trusts, and high-consequence automated decisions.',
      color: '#C5A059'
    },
    {
      num: '04',
      title: 'REMEMBRANCE',
      scripture: 'Deuteronomy',
      question: 'What has humanity already tried and learned here?',
      axiom: 'Civilizations must learn from their past. Never repeat forgotten failures or bury negative outcomes.',
      engineeringConstraint: 'Mandatory immutability: Origin → Problem → Decision → Intervention → Outcome → Failure → Lesson → Next Generation.',
      color: '#F59E0B'
    },
    {
      num: '05',
      title: 'WISDOM',
      scripture: 'Proverbs',
      question: 'Are we confusing capability with wisdom?',
      axiom: 'Distinguish Data → Information → Knowledge → Intelligence → Wisdom → Action. AI optimizes within ethical constraints, never defining values.',
      engineeringConstraint: 'Epistemic uncertainty and assumptions must remain visible on all AI-generated recommendations (Known vs Inferred vs Uncertain).',
      color: '#6366F1'
    },
    {
      num: '06',
      title: 'JUSTICE',
      scripture: 'The Prophets',
      question: 'Who bears the hidden costs and risks?',
      axiom: 'Detect systemic harm and make hidden externalities visible. Stand with the vulnerable and future generations.',
      engineeringConstraint: 'Algorithmic burden-distribution scanning: If vulnerable stakeholders bear asymmetrical downside, transaction is halted.',
      color: '#EC4899'
    },
    {
      num: '07',
      title: 'DIGNITY',
      scripture: 'The Gospels',
      question: 'Are human beings treated as ends, never means?',
      axiom: 'Never allow AI > Human Dignity, Efficiency > Compassion, Growth > Justice, or Automation > Agency.',
      engineeringConstraint: 'Human-in-the-loop sovereign decision rights. AI advises and illuminates; humans govern and decide.',
      color: '#3B82F6'
    },
    {
      num: '08',
      title: 'COMMUNITY',
      scripture: 'Acts',
      question: 'How does this strengthen collective fellowship?',
      axiom: 'Atlas is a coordination layer for People + Knowledge + Capital + Technology + Institutions + Communities + Projects.',
      engineeringConstraint: 'Subsidiarity-first architecture: Decisions must be made at the closest competent community level.',
      color: '#14B8A6'
    },
    {
      num: '09',
      title: 'FAITHFULNESS',
      scripture: 'Epistles',
      question: 'Will this institution remain trustworthy across generations?',
      axiom: 'Design institutions capable of maintaining trust beyond the founder, product cycle, or temporary leadership.',
      engineeringConstraint: 'Cryptographic public ledgers, open-source governance protocols, and decentralised succession registries.',
      color: '#8B5CF6'
    },
    {
      num: '10',
      title: 'RENEWAL',
      scripture: 'Revelation',
      question: 'What kind of future are we building together?',
      axiom: 'Always maintain a regenerative civilizational destination. The final state is restored human flourishing with creation.',
      engineeringConstraint: 'All economic return streams must compound into future capacity to flourish and regenerate ecosystems.',
      color: '#10B981'
    }
  ];

  const CIVILIZATION_CYCLE = [
    { name: 'OBSERVE', desc: 'Satellite multispectral imaging, IoT ground sensor mesh, and community telemetry.', targetTab: 'observatory' as PageView },
    { name: 'DIAGNOSE', desc: 'Systemic causal loop modeling identifying root problems across interconnected domains.', targetTab: 'opportunity-intelligence' as PageView },
    { name: 'DESIGN', desc: 'Scenario simulation, intervention blueprints, 7-capitals budgeting, and risk maps.', targetTab: 'studio' as PageView },
    { name: 'MOBILIZE', desc: 'Connecting sovereign communities, patient non-extractive capital, and technical talent.', targetTab: 'opportunity-graph' as PageView },
    { name: 'INTERVENE', desc: 'Physical fabrication of LifeHouses, solar desalination, bio-composites, and food nodes.', targetTab: 'industrial' as PageView },
    { name: 'MEASURE', desc: 'Third-party scientific verification, cryptographic telemetry proofs, and moral audits.', targetTab: 'evidence-ledger' as PageView },
    { name: 'LEARN', desc: 'Capturing failures, unexpected second-order effects, and open epistemic research.', targetTab: 'failure-ledger' as PageView },
    { name: 'REGENERATE', desc: 'Compounding ecological vitality, community resilience, and intergenerational flourishing.', targetTab: 'flourishing-index' as PageView }
  ];

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-8 relative overflow-hidden shadow-2xl">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B3022]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header & Tab Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-bold">
              The Moral & Civilizational Constitution
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0] tracking-tight">
            THE CENTRAL ARCHITECTURE
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-xl font-sans">
            Bridging <span className="text-[#C5A059] font-semibold">Wisdom → Knowledge → Intelligence → Capital → Action → Measurement → Regeneration</span>
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-[#070707] border border-[#F5F5F0]/15 rounded-sm">
          <button
            onClick={() => setActiveTabMode('visual')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTabMode === 'visual'
                ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40 shadow-sm'
                : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            Central Visual
          </button>
          <button
            onClick={() => setActiveTabMode('covenant')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTabMode === 'covenant'
                ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40 shadow-sm'
                : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            The 10 Covenants
          </button>
          <button
            onClick={() => setActiveTabMode('sanctuary_vs_babel')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTabMode === 'sanctuary_vs_babel'
                ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40 shadow-sm'
                : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            Sanctuary vs Babel
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: THE CENTRAL VISUAL ANCHOR (SECTION 40) */}
      {/* ========================================================================= */}
      {activeTabMode === 'visual' && (
        <div className="space-y-8 relative z-10">
          {/* North Star Header Box */}
          <div className="p-4 sm:p-5 bg-[#080808] border border-[#C5A059]/40 rounded-sm text-center space-y-1 shadow-inner">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A059] font-bold">
              ★ OUR NORTH STAR ★
            </span>
            <p className="text-sm sm:text-base font-serif italic text-[#F5F5F0] max-w-3xl mx-auto leading-snug">
              "Help humanity flourish by building ethical systems that create lasting prosperity, opportunity, dignity, resilience, and regeneration."
            </p>
          </div>

          {/* Central Visual Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: The 4 Structural Pillars */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50 mb-1">
                The 4 Foundations
              </div>
              
              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/80 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 font-bold text-xs">
                  01
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F5F0]">HUMAN DIGNITY</div>
                  <div className="text-[10px] text-[#F5F5F0]/60">Humans are sacred ends, never inputs to optimize.</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                  02
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F5F0]">CREATION</div>
                  <div className="text-[10px] text-[#F5F5F0]/60">Stewarding living soil, clean aquifers & biospheres.</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-purple-400 shrink-0 font-bold text-xs">
                  03
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F5F0]">COMMUNITY</div>
                  <div className="text-[10px] text-[#F5F5F0]/60">Sovereign decentralized coordination & trust.</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 font-bold text-xs">
                  04
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F5F0]">TECHNOLOGY</div>
                  <div className="text-[10px] text-[#F5F5F0]/60">Capability bounded by wisdom & moral governance.</div>
                </div>
              </div>
            </div>

            {/* Center: The Core Bind (Wisdom + Love) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-[#090909] border-2 border-[#C5A059] rounded-sm text-center relative shadow-2xl space-y-4">
              <div className="absolute -top-3 px-3 py-0.5 bg-[#C5A059] text-black font-mono text-[9px] uppercase font-bold tracking-widest rounded-xs">
                The Central Keystone
              </div>

              <div className="w-20 h-20 rounded-full bg-[#1B3022] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                <Heart className="w-10 h-10 text-[#C5A059]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-[#F5F5F0]">
                  WISDOM + LOVE
                </h3>
                <p className="text-xs text-[#C5A059] font-mono uppercase tracking-wider">
                  The Binding Force
                </p>
              </div>

              <p className="text-xs text-[#F5F5F0]/80 leading-relaxed font-sans">
                "We do not build technology merely to make humanity more powerful. We build systems that help humanity use power wisely."
              </p>

              <button
                onClick={() => onSelectTab('about')}
                className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read The Covenant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: The 10 Covenant Pillars Preview */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50 mb-1">
                The 10 Moral Constraints
              </div>

              <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                  <span className="font-mono text-[#C5A059] font-bold">10-Part Atlas Covenant</span>
                  <span className="text-[10px] font-mono text-emerald-400">100% Audited</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                  {COVENANT_PRINCIPLES.map((cp, idx) => (
                    <button
                      key={cp.num}
                      onClick={() => {
                        setSelectedPrinciple(idx);
                        setActiveTabMode('covenant');
                      }}
                      className="p-1.5 bg-[#080808] hover:bg-[#1B3022] border border-[#F5F5F0]/5 hover:border-[#C5A059]/50 rounded-xs text-left transition-all flex items-center justify-between text-[#F5F5F0]/80 hover:text-[#F5F5F0] cursor-pointer"
                    >
                      <span>{cp.num}. {cp.title}</span>
                      <span className="text-[9px] text-[#F5F5F0]/40">{cp.scripture.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-[10px] text-[#F5F5F0]/50 text-center font-mono">
                  Click any covenant pillar to explore operational constraints
                </div>
              </div>
            </div>
          </div>

          {/* Continuous Loop Ribbon */}
          <div className="space-y-3 pt-4 border-t border-[#F5F5F0]/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                THE CONTINUOUS 8-STAGE REGENERATION LOOP
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">
                Active Step: {CIVILIZATION_CYCLE[selectedCycleStep].name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {CIVILIZATION_CYCLE.map((step, idx) => (
                <button
                  key={step.name}
                  onClick={() => setSelectedCycleStep(idx)}
                  className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer ${
                    selectedCycleStep === idx
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-md scale-105'
                      : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className="text-[9px] font-mono text-[#C5A059]">0{idx + 1}</div>
                  <div className="text-xs font-bold text-[#F5F5F0] mt-0.5">{step.name}</div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-[#C5A059]">
                  Stage 0{selectedCycleStep + 1}: {CIVILIZATION_CYCLE[selectedCycleStep].name}
                </div>
                <div className="text-xs text-[#F5F5F0]/80">
                  {CIVILIZATION_CYCLE[selectedCycleStep].desc}
                </div>
              </div>
              <button
                onClick={() => onSelectTab(CIVILIZATION_CYCLE[selectedCycleStep].targetTab)}
                className="px-4 py-2 bg-[#F5F5F0] hover:bg-white text-black font-mono font-bold text-xs uppercase rounded-xs shrink-0 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Outcomes Banner */}
          <div className="p-4 sm:p-5 bg-[#080808] border border-emerald-500/30 rounded-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-emerald-400 font-bold">
              ★ OUR DESTINATION & MEASURED OUTCOMES ★
            </span>
            <p className="text-xs sm:text-sm font-mono text-[#F5F5F0] max-w-3xl mx-auto">
              Human Flourishing + Ecological Regeneration + Just Institutions + Resilient Economies + Wisdom-Guided Technology
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: THE 10 COVENANT PRINCIPLES DEEP DIVE (SECTION 3) */}
      {/* ========================================================================= */}
      {activeTabMode === 'covenant' && (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {COVENANT_PRINCIPLES.map((principle, idx) => (
              <button
                key={principle.num}
                onClick={() => setSelectedPrinciple(idx)}
                className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedPrinciple === idx
                    ? 'bg-[#1B3022] border-[#C5A059] shadow-lg scale-102'
                    : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                }`}
              >
                <div className="text-[10px] font-mono text-[#C5A059] font-bold">{principle.num}</div>
                <div className="text-xs font-bold text-[#F5F5F0] mt-0.5">{principle.title}</div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50">{principle.scripture}</div>
              </button>
            ))}
          </div>

          {/* Active Principle Card */}
          <div className="p-6 bg-[#080808] border-2 border-[#C5A059]/50 rounded-sm space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif font-bold text-[#C5A059]">
                  {COVENANT_PRINCIPLES[selectedPrinciple].num}.
                </span>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#F5F5F0]">
                    {COVENANT_PRINCIPLES[selectedPrinciple].title}
                  </h3>
                  <div className="text-xs font-mono text-[#C5A059]">
                    Biblical Architectural Anchor: {COVENANT_PRINCIPLES[selectedPrinciple].scripture}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#1B3022] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono rounded-sm self-start sm:self-auto">
                First-Class Moral Axiom
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question */}
              <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                  Core Question Asked
                </span>
                <p className="text-sm font-serif italic text-[#F5F5F0]">
                  "{COVENANT_PRINCIPLES[selectedPrinciple].question}"
                </p>
              </div>

              {/* Philosophical Axiom */}
              <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Philosophical Axiom
                </span>
                <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
                  {COVENANT_PRINCIPLES[selectedPrinciple].axiom}
                </p>
              </div>

              {/* Computational Engineering Constraint */}
              <div className="p-4 bg-[#121212] border border-blue-500/30 rounded-sm space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Engineering Constraint
                </span>
                <p className="text-xs text-[#F5F5F0]/80 leading-relaxed font-mono">
                  {COVENANT_PRINCIPLES[selectedPrinciple].engineeringConstraint}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] font-mono text-[#F5F5F0]/50">
                Audited against Atlas Constitutional Framework v3.2
              </span>
              <button
                onClick={() => onSelectTab('moral-arbiter')}
                className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold uppercase rounded-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Audit in Moral Arbiter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SANCTUARY VS BABEL MATRIX (SECTION 25) */}
      {/* ========================================================================= */}
      {activeTabMode === 'sanctuary_vs_babel' && (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tower of Babel Column */}
            <div className="p-6 bg-[#120808] border border-rose-900/40 rounded-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-rose-900/30 pb-3">
                <Flame className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-rose-400 uppercase tracking-wide">
                    BABEL (Technological Arrogance)
                  </h3>
                  <div className="text-[10px] font-mono text-rose-300/60">
                    The Extract & Monopolize Pattern
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#F5F5F0]/80">
                <div className="p-3 bg-[#0A0505] border border-rose-900/20 rounded-xs space-y-1">
                  <div className="font-bold text-rose-400">1. Build upward for dominance</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Monopolizing infrastructure and locking users into centralized rent-extraction gates.</div>
                </div>
                <div className="p-3 bg-[#0A0505] border border-rose-900/20 rounded-xs space-y-1">
                  <div className="font-bold text-rose-400">2. Accumulate raw power</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Maximizing computational control and capital accumulation without moral limits.</div>
                </div>
                <div className="p-3 bg-[#0A0505] border border-rose-900/20 rounded-xs space-y-1">
                  <div className="font-bold text-rose-400">3. Make a name (Hubris)</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Promoting founder branding and predatory short-term 90-day valuation multiples.</div>
                </div>
                <div className="p-3 bg-[#0A0505] border border-rose-900/20 rounded-xs space-y-1">
                  <div className="font-bold text-rose-400">4. Humans as inputs</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Treating human workers, attention, and biology as mere inputs to be optimized and automated away.</div>
                </div>
              </div>
            </div>

            {/* Atlas Sanctuary Column */}
            <div className="p-6 bg-[#08120B] border border-emerald-500/40 rounded-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-emerald-500/30 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-emerald-400 uppercase tracking-wide">
                    SANCTUARY (Moral Stewardship)
                  </h3>
                  <div className="text-[10px] font-mono text-emerald-300/60">
                    The Cultivate & Flourish Architecture
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#F5F5F0]/80">
                <div className="p-3 bg-[#050A06] border border-emerald-500/20 rounded-xs space-y-1">
                  <div className="font-bold text-emerald-400">1. Cultivate creation</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Restoring topsoil, clean aquifers, biodiversity, and regenerative local supply chains.</div>
                </div>
                <div className="p-3 bg-[#050A06] border border-emerald-500/20 rounded-xs space-y-1">
                  <div className="font-bold text-emerald-400">2. Protect human dignity & agency</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Increasing personal autonomy, sovereign local decision rights, and freedom from usurious debt.</div>
                </div>
                <div className="p-3 bg-[#050A06] border border-emerald-500/20 rounded-xs space-y-1">
                  <div className="font-bold text-emerald-400">3. Preserve institutional memory</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Documenting failures openly so subsequent generations inherit wisdom rather than recurring traps.</div>
                </div>
                <div className="p-3 bg-[#050A06] border border-emerald-500/20 rounded-xs space-y-1">
                  <div className="font-bold text-emerald-400">4. Leave something better behind</div>
                  <div className="text-[11px] text-[#F5F5F0]/60">Intergenerational horizons ensuring 30-year compounding resilience across the 7 Capitals.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#080808] border border-[#C5A059]/30 rounded-sm text-center font-serif italic text-xs text-[#C5A059]">
            "Heaven in stone and glass — ancient wisdom expressed through modern civilizational infrastructure."
          </div>
        </div>
      )}
    </div>
  );
};
