import React, { useState } from 'react';
import { 
  Scale, 
  Heart, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import { MORAL_PRINCIPLES } from '../../data/mockCivilizationData';

interface MoralIntelligenceViewProps {
  onOpenMoralSimulator: () => void;
  onOpenCommandCenter: () => void;
}

export const MoralIntelligenceView: React.FC<MoralIntelligenceViewProps> = ({
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<string>(MORAL_PRINCIPLES[0].id);

  const selectedPrinciple = MORAL_PRINCIPLES.find(p => p.id === selectedPrincipleId) || MORAL_PRINCIPLES[0];

  const moralDimensions = [
    { title: "Human Dignity & Sacred Worth", desc: "No human being or community is treated as a disposable means to an economic end.", score: 96 },
    { title: "Generational Horizon", desc: "Decisions evaluated across a minimum 30-year multi-generational timeframe.", score: 94 },
    { title: "Ecological Integrity & Stewardship", desc: "Respecting planetary biophysical boundaries and restoring living soil and aquifers.", score: 98 },
    { title: "Protection of the Vulnerable", desc: "Interventions prioritized for the poorest, weakest, and most exposed populations.", score: 95 },
    { title: "Transparency & Epistemic Humility", desc: "All assumptions, confidence intervals, and uncertainty made fully transparent.", score: 92 },
    { title: "Anti-Monopolization & Shared Agency", desc: "Preventing centralized systemic capture; distributing local governance.", score: 91 },
    { title: "Covenantal Trust & Non-Extraction", desc: "Capital contracts structured with fair-sharing and non-predatory terms.", score: 97 },
    { title: "Spiritual & Relational Flourishing", desc: "Fostering peace, community cohesion, Sabbath rest, and relational integrity.", score: 93 }
  ];

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              MORAL INTELLIGENCE ARCHITECTURE • 14 UNIVERSAL AXIOMS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Ethical Core & Moral Reasoning</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            AI systems must serve human flourishing under strict ethical constraints. Capability without conscience produces ruin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMoralSimulator}
            className="px-4 py-2 bg-[#F5F5F0] hover:bg-white text-black rounded-sm text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow"
          >
            <Scale className="w-4 h-4" />
            Launch Policy Decision Simulator
          </button>
        </div>
      </div>

      {/* 3 Core Tenets Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Tenet 01</div>
          <h3 className="text-lg font-serif text-[#F5F5F0]">AI as Decision Support</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            AI models are instruments for causal modeling and telemetry synthesis. They possess no moral soul, no authority, and can never replace human conscience and democratic accountability.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold tracking-[0.2em]">Tenet 02</div>
          <h3 className="text-lg font-serif text-[#F5F5F0]">Epistemic Humility</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            Every prediction, model output, and simulation explicitly surfaces its underlying scientific assumptions, uncertainty bands, and confidence margins to prevent false certitude.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-[0.2em]">Tenet 03</div>
          <h3 className="text-lg font-serif text-[#F5F5F0]">Covenantal Non-Extraction</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            The platform forbids predatory usury, double-counting of ecological credits, and the monetization of human misery. Capital must align with genuine multi-generational regeneration.
          </p>
        </div>
      </div>

      {/* The 14 Moral Design Foundations Matrix */}
      <div className="p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[#F5F5F0]/10">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Universal Ethical Axioms</span>
            <h2 className="text-xl font-serif text-[#F5F5F0]">The 14 Moral Design Foundations</h2>
          </div>
          <span className="text-xs font-mono text-[#C5A059]">Translated from Wisdom Literature into Computational Constraints</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of 14 Principles (1 Col) */}
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-2">
            {MORAL_PRINCIPLES.map((principle) => {
              const isSelected = selectedPrinciple.id === principle.id;
              return (
                <button
                  key={principle.id}
                  onClick={() => setSelectedPrincipleId(principle.id)}
                  className={`w-full p-3 rounded-sm border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow'
                      : 'bg-[#080808] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold font-serif text-[#F5F5F0]">{principle.name}</div>
                    <div className="text-[10px] text-[#F5F5F0]/40 font-mono">{principle.scripturalTheme}</div>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#0D0D0D] rounded-sm text-[#8FB8DE] border border-[#8FB8DE]/20 font-bold">
                    Axiom {principle.id}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Deep Translation Detail (2 Cols) */}
          <div className="lg:col-span-2 p-6 rounded-sm bg-[#080808] border border-[#F5F5F0]/10 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-[#8FB8DE] font-bold">Principle Detail</span>
                  <h3 className="text-lg font-serif text-[#F5F5F0]">{selectedPrinciple.name}</h3>
                </div>
                <span className="text-xs font-mono text-[#C5A059] px-2.5 py-1 bg-[#C5A059]/10 rounded-sm border border-[#C5A059]/30 font-bold">
                  {selectedPrinciple.scripturalTheme}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Universal Design Formulation</div>
                <p className="text-sm text-[#F5F5F0] font-sans font-medium leading-relaxed bg-[#0D0D0D] p-4 rounded-sm border border-[#F5F5F0]/10">
                  "{selectedPrinciple.universalDesignPrinciple}"
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-[0.2em]">Operational Computational Implementation</div>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">
                  {selectedPrinciple.systemImplementation}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between">
              <span className="text-xs text-[#F5F5F0]/40 font-mono">Governs all Atlas API endpoints and capital releases</span>
              <button
                onClick={onOpenMoralSimulator}
                className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
              >
                Test in Simulator →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The 8 Structural Scorecard Dimensions Grid */}
      <div className="p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#F5F5F0]/10">
          <span className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold tracking-[0.2em]">Systemic Governance Dimensions</span>
          <h2 className="text-xl font-serif text-[#F5F5F0]">The 8 Dimensions of Civilization Evaluation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moralDimensions.map((dim, idx) => (
            <div key={idx} className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#F5F5F0]/40">0{idx + 1}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{dim.score}% Target</span>
                </div>
                <h4 className="text-xs font-serif text-[#F5F5F0] font-bold">{dim.title}</h4>
                <p className="text-[11px] text-[#F5F5F0]/60 leading-relaxed font-sans">{dim.desc}</p>
              </div>
              <div className="w-full h-1 bg-[#0D0D0D] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-emerald-400" style={{ width: `${dim.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
