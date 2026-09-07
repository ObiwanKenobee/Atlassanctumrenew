import React, { useState } from 'react';
import { X, Scale, Heart, Shield, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, BookOpen, Sliders, Sparkles } from 'lucide-react';
import { MORAL_PRINCIPLES } from '../data/mockCivilizationData';
import { db } from '../lib/db';
import { WhatIfScenarioBuilder } from './moral/WhatIfScenarioBuilder';
import { audioFeedback } from '../lib/audioFeedback';

interface MoralScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MoralEvaluationResult {
  compositeFlourishingScore: number;
  verdict: string;
  dignityAssessment: string;
  vulnerableImpact: string;
  ecologicalConsequence: string;
  secondOrderEffects: string[];
  generationalHorizon: string;
  moralScorecard: Array<{ dimension: string; score: number; evaluation: string }>;
  ethicalGuardrails: string[];
}

const PRESET_INTERVENTIONS = [
  {
    title: "Decentralized Solar-Desalination Aquifer Recharge",
    description: "Install 24 solar-powered RO water kiosks and 5,000 hectares of infiltration trenches along the coastal basin, governed by local fisherfolk councils.",
    region: "Kilifi Coastal Corridor",
    capital: "$8.5M",
    populations: "Smallholder coastal communities, subsistence fisherfolk, pastoralists"
  },
  {
    title: "Community-Owned LifeHouse Habitat Cluster",
    description: "Construct 350 modular carbon-negative homes with bio-composite earth blocks, micro-hydro power, and closed-loop urban agroforestry.",
    region: "Kigali Peri-Urban District",
    capital: "$12.0M",
    populations: "Urban low-income families, construction apprentices, informal workers"
  },
  {
    title: "Commercial Monoculture Timber Extraction Concession",
    description: "Lease 40,000 hectares for fast-rotation eucalyptus wood pulp production with 15-year export tax concessions.",
    region: "Rift Valley Catchment",
    capital: "$30.0M",
    populations: "Downstream water users, indigenous customary landholders"
  }
];

export const MoralScorecardModal: React.FC<MoralScorecardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState(PRESET_INTERVENTIONS[0].title);
  const [description, setDescription] = useState(PRESET_INTERVENTIONS[0].description);
  const [region, setRegion] = useState(PRESET_INTERVENTIONS[0].region);
  const [capital, setCapital] = useState(PRESET_INTERVENTIONS[0].capital);
  const [populations, setPopulations] = useState(PRESET_INTERVENTIONS[0].populations);
  
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<MoralEvaluationResult | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'evaluation' | 'what-if'>('evaluation');

  if (!isOpen) return null;

  const handleEvaluate = async () => {
    if (!title || !description) return;
    setLoading(true);
    try {
      const res = await fetch('/api/moral/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalTitle: title,
          proposalDescription: description,
          targetRegion: region,
          allocatedCapital: capital,
          affectedPopulations: populations
        })
      });
      const data = await res.json();
      if (data.data) {
        setEvaluation(data.data);

        // Track user interaction with high-impact feature in Firestore Audit Trail
        try {
          await db.audit.logInteraction({
            action: `Evaluated intervention: "${title}"`,
            feature: 'moral_intelligence',
            impactTier: 'civilizational_critical',
            moralAlignmentScore: data.data.compositeFlourishingScore,
            parameters: {
              proposalTitle: title,
              targetRegion: region,
              allocatedCapital: capital,
              affectedPopulations: populations,
              verdict: data.data.verdict
            },
            ethicalNotes: `Evaluated with composite flourishing index ${data.data.compositeFlourishingScore}%. Verdict: ${data.data.verdict}`
          });
        } catch (auditErr) {
          console.warn("Audit logging record creation warning:", auditErr);
        }
      }
    } catch (err) {
      console.error("Moral evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_INTERVENTIONS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setRegion(preset.region);
    setCapital(preset.capital);
    setPopulations(preset.populations);
    setEvaluation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="moral-scorecard-modal"
        className="relative w-full max-w-5xl max-h-[94vh] sm:max-h-[92vh] flex flex-col bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F5F5F0]/10 bg-[#080808] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#F5F5F0] truncate">Atlas Moral Intelligence Evaluator</h2>
                <span className="hidden xs:inline-block px-2 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40 shrink-0">
                  Ethical Simulator
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#F5F5F0]/50 truncate">Test proposed infrastructure and capital policies against universal ethical axioms</p>
            </div>
          </div>
          <button
            id="close-moral-modal-btn"
            onClick={onClose}
            aria-label="Close Moral Evaluator"
            className="p-2 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal View Tabs: Evaluation vs What-If Scenario Builder */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-2 border-b border-[#F5F5F0]/10 bg-[#0A0A0A] shrink-0">
          <button
            id="moral-tab-evaluation-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveModalTab('evaluation');
            }}
            className={`px-4 py-2 text-xs font-mono uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
              activeModalTab === 'evaluation'
                ? 'border-[#C5A059] text-[#F5F5F0] bg-[#141414]'
                : 'border-transparent text-[#F5F5F0]/50 hover:text-white'
            }`}
          >
            Policy Evaluation & Scorecard
          </button>
          <button
            id="moral-tab-whatif-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setActiveModalTab('what-if');
            }}
            className={`px-4 py-2 text-xs font-mono uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeModalTab === 'what-if'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                : 'border-transparent text-[#F5F5F0]/50 hover:text-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>What-If Scenario Builder</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">NEW</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {activeModalTab === 'what-if' ? (
            <WhatIfScenarioBuilder
              proposalTitle={title}
              initialBaselineScore={evaluation?.compositeFlourishingScore || 72}
            />
          ) : (
            <>
              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#8FB8DE]" />
                  Load Sample Civilizational Policy Proposal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {PRESET_INTERVENTIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 text-left rounded-sm border transition-all text-xs ${
                        title === preset.title
                          ? 'bg-[#1B3022]/40 border-[#C5A059] text-[#F5F5F0] shadow-sm'
                          : 'bg-[#0A0A0A] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#C5A059]/40'
                      }`}
                    >
                      <div className="font-semibold line-clamp-1">{preset.title}</div>
                      <div className="text-[10px] text-[#F5F5F0]/40 font-mono mt-1">{preset.region} • {preset.capital}</div>
                    </button>
                  ))}
                </div>
              </div>

          {/* Input Form */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/60 mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none min-h-[40px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/60 mb-1">Region</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/60 mb-1">Capital Allocation</label>
                  <input
                    type="text"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none min-h-[40px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/60 mb-1">Detailed Policy / Infrastructure Scope</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">
                Simulates impacts across 14 universal moral axioms and 8 structural dimensions.
              </div>
              <button
                id="run-moral-eval-btn"
                onClick={handleEvaluate}
                disabled={loading || !title.trim()}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 min-h-[44px]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Simulating Ethical Impact...
                  </>
                ) : (
                  <>
                    <Scale className="w-3.5 h-3.5" />
                    Run Moral Evaluation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          {evaluation && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Verdict Header Banner */}
              <div className={`p-4 rounded-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                evaluation.compositeFlourishingScore >= 80 
                  ? 'bg-[#1B3022]/40 border-emerald-500/40 text-emerald-400' 
                  : evaluation.compositeFlourishingScore >= 60
                  ? 'bg-[#1B3022]/30 border-[#C5A059]/40 text-[#C5A059]'
                  : 'bg-red-950/30 border-red-500/40 text-red-400'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {evaluation.compositeFlourishingScore >= 80 ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#C5A059]" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5F5F0]">
                      Evaluation Verdict: {evaluation.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">{evaluation.dignityAssessment}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-serif text-[#C5A059]">{evaluation.compositeFlourishingScore}</div>
                  <div className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/50 font-mono">Moral Alignment Score</div>
                </div>
              </div>

              {/* 8 Dimension Scorecard Grid */}
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                  The 8 Structural Moral Scorecard Dimensions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {evaluation.moralScorecard?.map((dim, i) => (
                    <div key={i} className="p-3.5 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F5F0]">{dim.dimension}</span>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm ${
                          dim.score >= 85 ? 'bg-[#1B3022] text-emerald-400 border border-emerald-500/30' :
                          dim.score >= 70 ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40' : 'bg-red-950/40 text-red-400 border border-red-500/30'
                        }`}>
                          {dim.score} / 100
                        </span>
                      </div>
                      <p className="text-[11px] text-[#F5F5F0]/60 leading-relaxed">{dim.evaluation}</p>
                      <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${dim.score >= 85 ? 'bg-emerald-400' : dim.score >= 70 ? 'bg-[#C5A059]' : 'bg-red-400'}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Order & Guardrails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Second-Order Consequences & Risks
                  </h4>
                  <ul className="space-y-1.5">
                    {evaluation.secondOrderEffects?.map((effect, idx) => (
                      <li key={idx} className="text-xs text-[#F5F5F0]/70 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Mandatory Ethical Guardrails
                  </h4>
                  <ul className="space-y-1.5">
                    {evaluation.ethicalGuardrails?.map((guardrail, idx) => (
                      <li key={idx} className="text-xs text-[#F5F5F0]/70 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{guardrail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* The 14 Universal Principles Reference Bar */}
          <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              The 14 Moral Design Foundations
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MORAL_PRINCIPLES.map((principle) => (
                <button
                  key={principle.id}
                  onClick={() => setSelectedPrinciple(selectedPrinciple === principle.id ? null : principle.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-sm border transition-colors ${
                    selectedPrinciple === principle.id
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#C5A059]'
                      : 'bg-[#0A0A0A] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                  }`}
                >
                  {principle.name}
                </button>
              ))}
            </div>

            {selectedPrinciple && (
              <div className="p-3 bg-[#080808] border border-[#C5A059]/40 rounded-sm space-y-1 animate-in fade-in duration-150">
                {(() => {
                  const p = MORAL_PRINCIPLES.find(item => item.id === selectedPrinciple);
                  if (!p) return null;
                  return (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#F5F5F0]">{p.name} ({p.scripturalTheme})</span>
                        <span className="text-[9px] text-[#C5A059] uppercase font-mono tracking-widest">Universal Design Axiom</span>
                      </div>
                      <p className="text-xs text-[#F5F5F0]/70 font-sans">{p.universalDesignPrinciple}</p>
                      <div className="text-[11px] text-[#F5F5F0]/50 pt-1 font-mono">
                        <span className="text-[#C5A059]">Implementation:</span> {p.systemImplementation}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#080808] border-t border-[#F5F5F0]/10 flex items-center justify-between text-[11px] text-[#F5F5F0]/40 font-mono">
          <span>Moral intelligence supports human discernment; it never replaces moral responsibility.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#F5F5F0] hover:bg-white text-black rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
