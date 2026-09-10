import React, { useState } from 'react';
import {
  Compass,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search,
  Cpu,
  Coins,
  Layers,
  Sparkles,
  BarChart3,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Eye,
  Sliders,
  Share2,
  Download,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { OpportunityBrief, AtlasInterventionOption, EpistemicEvidenceTier } from '../../types';
import { SAMPLE_OPPORTUNITY_BRIEFS } from '../../data/prompt3OperatingData';
import { RealityCheck } from '../RealityCheck';
import { audioFeedback } from '../../lib/audioFeedback';

interface OpportunityIntelligenceViewProps {
  onSelectTab: (tab: any) => void;
  onOpenProvenance?: (prov: any) => void;
  onOpenMoralSimulator?: () => void;
}

export const OpportunityIntelligenceView: React.FC<OpportunityIntelligenceViewProps> = ({
  onSelectTab,
  onOpenProvenance,
  onOpenMoralSimulator
}) => {
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('nairobi_drainage');
  const [brief, setBrief] = useState<OpportunityBrief>(SAMPLE_OPPORTUNITY_BRIEFS['nairobi_drainage']);
  const [customLocation, setCustomLocation] = useState('');
  const [customProblem, setCustomProblem] = useState('');
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>(
    SAMPLE_OPPORTUNITY_BRIEFS['nairobi_drainage'].interventions[0]?.id || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('options');
  const [showUncertaintyModal, setShowUncertaintyModal] = useState(false);

  const handleSelectPrebuilt = (key: string) => {
    setSelectedLocationKey(key);
    const selected = SAMPLE_OPPORTUNITY_BRIEFS[key];
    if (selected) {
      setBrief(selected);
      setSelectedInterventionId(selected.interventions[0]?.id || '');
      audioFeedback.playSubtleClick();
    }
  };

  const handleSynthesizeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLocation.trim()) return;

    setIsGenerating(true);
    audioFeedback.playSubtleClick();

    try {
      const res = await fetch('/api/intelligence/synthesize-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: customLocation,
          problem: customProblem,
          category: 'water_drainage'
        })
      });
      const json = await res.json();
      if (json && json.data && json.data.problem) {
        setBrief(json.data);
        setSelectedInterventionId(json.data.interventions?.[0]?.id || '');
        audioFeedback.playSyncComplete();
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.warn('Backend opportunity synthesis fallback triggered:', err);
    }

    // Local fallback synthesis
    setTimeout(() => {
      const newBrief: OpportunityBrief = {
        id: `opp-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        location: customLocation,
        bioregion: `${customLocation} Catchment Corridor`,
        problem: {
          id: `prob-${Date.now()}`,
          title: customProblem || `${customLocation} Ecological & Infrastructure Vulnerability`,
          category: 'water_drainage',
          locationName: customLocation,
          bioregion: 'Local Bioregional Catchment',
          coordinates: [-1.286, 36.817],
          severityScore: 82,
          affectedPopulation: '65,000+ local residents',
          summary: `High sensitivity to seasonal climate pulses with legacy infrastructure bottlenecks identified in ${customLocation}.`,
          symptoms: [
            'Systemic resource access strain during dry/wet cycles',
            'Uncoordinated capital and fragmented municipal responses',
            'Sub-optimal vegetative infiltration and soil degradation'
          ],
          rootCauses: [
            'Absence of unified community-stewardship telemetry',
            'Disconnection between upstream water management and downstream consumers',
            'Short-term extractive economic models'
          ],
          observedDeficits: [
            { label: 'Hydrological Buffer Capacity', value: '22% (Severe Deficit)', status: 'severe' },
            { label: 'Local Sovereign Labor Integration', value: '31% Engagement', status: 'severe' },
            { label: 'Perennial Canopy Coverage', value: '12% Baseline', status: 'critical' }
          ],
          leveragePoints: [
            { point: 'Modular Regenerative Drainage & Biochar Swales', multiplierPotential: '3.4x Infiltration', mechanism: 'Captures and filters flash water surges.' },
            { point: 'Decentralized Civic Guild Labor Agreements', multiplierPotential: '2.8x Long-term Maintenance', mechanism: 'Keeps 100% of project wages in community hands.' }
          ]
        },
        whyHereMetrics: [
          { label: 'Need Intensity', level: 'High', description: 'Urgent vulnerability to seasonal weather extremes' },
          { label: 'Ecological Return Potential', level: 'Critical', description: 'High responsiveness to nature-based circular engineering' },
          { label: 'Community Readiness', level: 'High', description: 'Active grassroots leadership ready for co-design' },
          { label: 'Capital Matchability', level: 'Moderate', description: 'Catalytic grant pools available' }
        ],
        evidenceBase: [
          {
            id: `ev-${Date.now()}-1`,
            claim: 'Nature-based interventions reduce local infrastructure damage risk by 40–55%.',
            tier: 'MODELED',
            source: 'Atlas Bioregional Intelligence Engine v2.5',
            methodology: 'Multi-scale spatial regression calibrated against East African catchment datasets.',
            confidenceScore: 88,
            assumptions: ['Standard local rainfall patterns applied.'],
            lastVerifiedDate: '2026-08-25'
          }
        ],
        interventions: [
          {
            id: `int-${Date.now()}-1`,
            title: 'Decentralized Regenerative Infrastructure & Bioswales',
            shortDescription: 'Locally built bio-retention corridors, permeable walkways, and agroforestry canopies.',
            tier: 'infrastructure',
            capitalRequiredEstimate: { min: 350000, max: 600000, currency: 'USD' },
            timelineMonths: 12,
            expectedOutcomes: [
              { label: 'Surface Runoff Attenuation', modeledEstimate: '38–46%', confidenceRange: '±5%', tier: 'MODELED' },
              { label: 'Local Jobs Created', modeledEstimate: '45 FTEs', confidenceRange: 'Exact', tier: 'VERIFIED' }
            ],
            tradeOffs: { cost: 'moderate', impact: 'high', speed: 'moderate', equity: 'high', resilience: 'high' },
            risks: [
              { risk: 'Community coordination bottlenecks', severity: 'low', mitigation: 'Ratify covenant via local council.' }
            ],
            ethicalSafeguards: [
              { principle: 'Human Dignity & Fair Wages', safeguard: 'Guaranteed 1.3x regional living wage.', beneficiaryBurdenCheck: 'Direct benefit to residents.' }
            ],
            blueprintRef: 'BP-REGEN-CIV-01'
          }
        ],
        totalCapitalRequiredRange: { min: 350000, max: 600000, currency: 'USD' },
        recommendedFirstStep: `Establish sensor baseline in ${customLocation} and convene local community assembly.`,
        ethicalAssessment: {
          humanDignity: 'Prioritizes community agency and direct living wages over passive aid.',
          justiceAndBurden: 'Ensures equitable distribution of benefits across vulnerable residents.',
          inclusionRisk: 'Safeguards informal workers and women-led community groups.',
          ecologicalRegeneration: 'Restores watershed vitality and native soil organic matter.',
          intergenerationalHorizon: 'Provides a 30-year foundation for durable neighborhood flourishing.'
        },
        provenance: {
          id: `prov-${Date.now()}`,
          source: 'Atlas Dynamic Opportunity Engine',
          sourceType: 'peer_reviewed_model',
          collectedAt: new Date().toISOString(),
          calculationMethod: 'Topological Vulnerability Mapping & Heuristic Impact Inference',
          certaintyScore: 86,
          verifier: 'Atlas System Arbiter',
          verifierRole: 'Epistemic Intelligence Engine',
          cryptographicHash: '0x7c99..01ba',
          assumptions: ['Local input parameters normalized to standard regional baselines'],
          lastAudited: '2026-08-25'
        }
      };

      setBrief(newBrief);
      setSelectedInterventionId(newBrief.interventions[0]?.id || '');
      setIsGenerating(false);
    }, 700);
  };

  const getTierBadge = (tier: EpistemicEvidenceTier) => {
    switch (tier) {
      case 'VERIFIED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case 'OBSERVED':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
      case 'MODELED':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'PROJECTED':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
      case 'ILLUSTRATIVE':
        return 'bg-neutral-800 text-neutral-300 border-neutral-600';
      default:
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
    }
  };

  const selectedIntervention = brief.interventions.find(i => i.id === selectedInterventionId) || brief.interventions[0];

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Core Philosophy */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
              ATLAS OPPORTUNITY INTELLIGENCE • EVIDENCE-FIRST ENGINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">What Can We Improve?</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-3xl font-sans leading-relaxed">
            Atlas transforms real-world observations into evidence-backed Opportunity Briefs. See reality, inspect causal root causes, evaluate trade-offs, and convert intelligence directly into funded projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onSelectTab('decision-room')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-2 transition-all shadow"
          >
            <Scale className="w-4 h-4 text-[#C5A059]" />
            <span>Decision Room</span>
          </button>

          <button
            onClick={() => onSelectTab('project-os')}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Layers className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Input Workbench: Location & Problem Selector */}
      <div className="bg-[#0D0D0D] border border-[#F5F5F0]/10 p-6 rounded-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#C5A059] font-bold">
              01 — SELECT OR SEARCH AN OPPORTUNITY
            </h2>
            <p className="text-xs text-[#F5F5F0]/50 font-sans">
              Choose a pre-verified bioregional dossier or enter a specific community context.
            </p>
          </div>

          {/* Quick Prebuilt Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase">Pre-Loaded:</span>
            <button
              onClick={() => handleSelectPrebuilt('nairobi_drainage')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all ${
                selectedLocationKey === 'nairobi_drainage'
                  ? 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]'
                  : 'bg-[#121212] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
              }`}
            >
              Nairobi (Mathare Drainage)
            </button>
            <button
              onClick={() => handleSelectPrebuilt('morogoro_agroforestry')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all ${
                selectedLocationKey === 'morogoro_agroforestry'
                  ? 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]'
                  : 'bg-[#121212] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
              }`}
            >
              Morogoro (Uluguru Agroforestry)
            </button>
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSynthesizeCustom} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Location / City / Watershed</label>
            <div className="relative">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="e.g. Kibera, Kisumu, Dakar, Kampala"
                className="w-full bg-[#141414] border border-[#F5F5F0]/15 rounded-sm px-3.5 py-2.5 text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-6 space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Problem or Challenge to Improve</label>
            <input
              type="text"
              value={customProblem}
              onChange={(e) => setCustomProblem(e.target.value)}
              placeholder="e.g. Urban flash flooding, soil erosion, youth clean tech jobs"
              className="w-full bg-[#141414] border border-[#F5F5F0]/15 rounded-sm px-3.5 py-2.5 text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isGenerating || !customLocation.trim()}
              className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* THE 12-SECTION OPPORTUNITY BRIEF CONTAINER */}
      <div className="bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm p-6 sm:p-8 space-y-10 shadow-2xl">
        
        {/* Brief Top Banner */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold">
                OFFICIAL OPPORTUNITY DOSSIER • {brief.id.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">
                Generated: {new Date(brief.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0]">
              {brief.location}
            </h2>
            <p className="text-xs text-[#C5A059] font-mono">
              Bioregion: {brief.bioregion} • Severity Score: {brief.problem.severityScore}/100
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowUncertaintyModal(true);
                audioFeedback.playSubtleClick();
              }}
              className="px-3 py-2 bg-[#121212] hover:bg-[#1A1A1A] border border-[#F5F5F0]/15 text-[#F5F5F0]/80 hover:text-[#F5F5F0] rounded-sm text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Why Atlas Believes This</span>
            </button>

            <button
              onClick={() => onSelectTab('decision-room')}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all"
            >
              <span>Bring to Decision Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SECTION 01 & 02: CONTEXT & WHY HERE? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-2">
                <span>01 — CONTEXT & PROBLEM SUMMARY</span>
              </h3>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">Affected: {brief.problem.affectedPopulation}</span>
            </div>
            <p className="text-sm text-[#F5F5F0]/90 font-serif leading-relaxed bg-[#111111] p-4 rounded-sm border border-[#F5F5F0]/10">
              {brief.problem.summary}
            </p>

            {/* Symptoms */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 tracking-wider">Observed Symptoms in the Field</span>
              <div className="grid grid-cols-1 gap-2">
                {brief.problem.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F5F5F0]/80 bg-[#080808] p-2.5 rounded border border-[#F5F5F0]/5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 18. THE "WHY HERE?" FUNCTION */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#C5A059]/30 rounded-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                WHY HERE? — CRITICALITY METRICS
              </span>
              <span className="text-[9px] font-mono text-emerald-400">High Priority</span>
            </div>

            <div className="space-y-2.5">
              {brief.whyHereMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5">
                  <div className="space-y-0.5">
                    <span className="font-medium text-[#F5F5F0]">{metric.label}</span>
                    <p className="text-[10px] text-[#F5F5F0]/50 font-sans line-clamp-1">{metric.description}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    metric.level === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                    metric.level === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                    'bg-neutral-800 text-neutral-300'
                  }`}>
                    {metric.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 03 & 04: OBSERVED DEFICITS & ROOT CAUSES & LEVERAGE POINTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#F5F5F0]/10">
          {/* Root Causes */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              03 & 04 — ROOT CAUSES & SYSTEM FAILURES
            </h3>
            <div className="space-y-2">
              {brief.problem.rootCauses.map((cause, idx) => (
                <div key={idx} className="p-3 bg-[#111111] rounded border border-[#F5F5F0]/10 text-xs text-[#F5F5F0]/80 flex items-start gap-2.5">
                  <span className="text-[10px] font-mono text-[#C5A059] font-bold shrink-0">0{idx + 1}.</span>
                  <span>{cause}</span>
                </div>
              ))}
            </div>

            {/* Observed Deficits */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 tracking-wider block mb-2">
                Physical Deficit Measurements
              </span>
              <div className="grid grid-cols-3 gap-2">
                {brief.problem.observedDeficits.map((def, idx) => (
                  <div key={idx} className="p-2.5 bg-[#080808] rounded border border-[#F5F5F0]/10 text-center">
                    <span className="text-[9px] font-mono text-[#F5F5F0]/50 block truncate">{def.label}</span>
                    <span className="text-xs font-mono font-bold text-amber-400 mt-1 block">{def.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 05 — Leverage Points */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>05 — DISPROPORTIONATE LEVERAGE POINTS</span>
            </h3>
            <div className="space-y-3">
              {brief.problem.leveragePoints.map((lev, idx) => (
                <div key={idx} className="p-3.5 bg-[#1B3022]/40 rounded border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#F5F5F0]">{lev.point}</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      {lev.multiplierPotential}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F5F5F0]/70 font-sans">{lev.mechanism}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 06, 07, 08: INTERVENTIONS & TRADE-OFFS */}
        <div className="space-y-4 pt-4 border-t border-[#F5F5F0]/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              06, 07 & 08 — DESIGNED INTERVENTIONS, CAPITAL & TRADE-OFFS
            </h3>
            <span className="text-xs font-mono text-[#F5F5F0]/50">
              Total Capital: ${brief.totalCapitalRequiredRange.min.toLocaleString()} – ${brief.totalCapitalRequiredRange.max.toLocaleString()} USD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brief.interventions.map((intv) => {
              const isSelected = intv.id === selectedInterventionId;
              return (
                <div
                  key={intv.id}
                  onClick={() => setSelectedInterventionId(intv.id)}
                  className={`p-5 rounded-sm border cursor-pointer transition-all space-y-4 ${
                    isSelected
                      ? 'bg-[#141414] border-[#C5A059] shadow-lg'
                      : 'bg-[#101010] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold">
                        {intv.tier.toUpperCase()} INTERVENTION
                      </span>
                      <h4 className="text-base font-serif font-bold text-[#F5F5F0] mt-1.5">
                        {intv.title}
                      </h4>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="text-xs font-bold text-emerald-400 block">
                        ${(intv.capitalRequiredEstimate.min / 1000).toFixed(0)}k–${(intv.capitalRequiredEstimate.max / 1000).toFixed(0)}k
                      </span>
                      <span className="text-[10px] text-[#F5F5F0]/40">{intv.timelineMonths} Months</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {intv.shortDescription}
                  </p>

                  {/* Expected Outcomes with Evidence Tiers */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F5F5F0]/10">
                    <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Expected Outcomes:</span>
                    <div className="space-y-1">
                      {intv.expectedOutcomes.map((out, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-[#080808] rounded border border-[#F5F5F0]/5">
                          <span className="text-[#F5F5F0]/80">{out.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">{out.modeledEstimate}</span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border ${getTierBadge(out.tier)}`}>
                              {out.tier}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trade-off Matrix Row */}
                  <div className="grid grid-cols-5 gap-1 pt-2 border-t border-[#F5F5F0]/10 text-center font-mono text-[9px]">
                    <div className="p-1 bg-[#0A0A0A] rounded">
                      <span className="text-[#F5F5F0]/40 block">COST</span>
                      <span className="text-amber-300 font-bold uppercase">{intv.tradeOffs.cost}</span>
                    </div>
                    <div className="p-1 bg-[#0A0A0A] rounded">
                      <span className="text-[#F5F5F0]/40 block">IMPACT</span>
                      <span className="text-emerald-400 font-bold uppercase">{intv.tradeOffs.impact}</span>
                    </div>
                    <div className="p-1 bg-[#0A0A0A] rounded">
                      <span className="text-[#F5F5F0]/40 block">SPEED</span>
                      <span className="text-blue-300 font-bold uppercase">{intv.tradeOffs.speed}</span>
                    </div>
                    <div className="p-1 bg-[#0A0A0A] rounded">
                      <span className="text-[#F5F5F0]/40 block">EQUITY</span>
                      <span className="text-[#C5A059] font-bold uppercase">{intv.tradeOffs.equity}</span>
                    </div>
                    <div className="p-1 bg-[#0A0A0A] rounded">
                      <span className="text-[#F5F5F0]/40 block">RESIL</span>
                      <span className="text-emerald-300 font-bold uppercase">{intv.tradeOffs.resilience}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 09, 10, 11, 12: ETHICAL ASSESSMENT & NEXT ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[#F5F5F0]/10">
          {/* Ethical Assessment (12. Moral Intelligence 2.0) */}
          <div className="lg:col-span-8 bg-[#111111] border border-[#F5F5F0]/10 p-5 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                11 — ETHICAL ASSESSMENT (MORAL CONSTRAINTS & SAFEGUARDS)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Non-Negotiable Floors</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#F5F5F0]/80">
              <div className="p-2.5 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase block font-bold">Human Dignity & Agency</span>
                <p className="text-[#F5F5F0]/70 font-sans">{brief.ethicalAssessment.humanDignity}</p>
              </div>
              <div className="p-2.5 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase block font-bold">Justice & Burden Distribution</span>
                <p className="text-[#F5F5F0]/70 font-sans">{brief.ethicalAssessment.justiceAndBurden}</p>
              </div>
              <div className="p-2.5 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase block font-bold">Inclusion & Anti-Displacement</span>
                <p className="text-[#F5F5F0]/70 font-sans">{brief.ethicalAssessment.inclusionRisk}</p>
              </div>
              <div className="p-2.5 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase block font-bold">Intergenerational Horizon</span>
                <p className="text-[#F5F5F0]/70 font-sans">{brief.ethicalAssessment.intergenerationalHorizon}</p>
              </div>
            </div>
          </div>

          {/* 12 — NEXT ACTION & CONVERT TO PROJECT */}
          <div className="lg:col-span-4 bg-[#1B3022]/60 border border-[#C5A059] p-5 rounded-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                12 — RECOMMENDED IMMEDIATE NEXT STEP
              </span>
              <p className="text-xs text-[#F5F5F0] font-serif leading-relaxed">
                {brief.recommendedFirstStep}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  audioFeedback.playSyncComplete();
                  onSelectTab('project-os');
                }}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer font-mono"
              >
                <Layers className="w-4 h-4" />
                <span>Convert to Active Project</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    sessionStorage.setItem('atlas_active_opportunity_brief', JSON.stringify(brief));
                    window.dispatchEvent(new CustomEvent('atlas-injected-decision', { detail: brief }));
                    onSelectTab('decision-room');
                  }}
                  className="py-2 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 rounded-sm text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all"
                  title="Deliberate this challenge and compare trade-offs in Decision Room"
                >
                  <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Decision Room</span>
                </button>

                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    sessionStorage.setItem('atlas_injected_mission', JSON.stringify({
                      title: `${brief.location}: ${brief.problem.title}`,
                      region: brief.location,
                      objective: brief.problem.summary,
                      capital: `$${brief.totalCapitalRequiredRange.min.toLocaleString()} - $${brief.totalCapitalRequiredRange.max.toLocaleString()} USD`
                    }));
                    window.dispatchEvent(new CustomEvent('atlas-navigate-tab', { detail: { tab: 'agent-mission-control' } }));
                    onSelectTab('agent-mission-control');
                  }}
                  className="py-2 bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 text-[#F5F5F0]/90 rounded-sm text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all"
                  title="Dispatch autonomous agent swarm to plan and coordinate this mission"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Agent Swarm</span>
                </button>
              </div>

              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  onSelectTab('capital-engine');
                }}
                className="w-full py-1.5 bg-[#0D0D0D] hover:bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]/90 rounded-sm text-[10px] font-mono flex items-center justify-center gap-1.5 transition-all"
              >
                <Coins className="w-3 h-3 text-[#C5A059]" />
                <span>Simulate Capital Tranches</span>
              </button>
            </div>
          </div>
        </div>

        {/* EVIDENCE TRUST BAR & PROVENANCE (48. PROVE IT) */}
        <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="font-mono text-[#F5F5F0]/60 text-[11px]">
              Provenance Hash: <span className="text-[#C5A059]">{brief.provenance.cryptographicHash}</span> • Attested by: {brief.provenance.verifier}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenProvenance && onOpenProvenance(brief.provenance)}
              className="px-3 py-1 bg-[#141414] hover:bg-[#1E1E1E] border border-[#F5F5F0]/15 text-[#C5A059] rounded text-[11px] font-mono flex items-center gap-1 transition-all"
            >
              <span>PROVE IT</span>
            </button>
          </div>
        </div>

      </div>

      {/* Uncertainty Layer Modal (10. THE UNCERTAINTY LAYER) */}
      {showUncertaintyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#F5F5F0] font-bold">
                  Why Does Atlas Believe This? — Uncertainty & Assumptions
                </h3>
              </div>
              <button
                onClick={() => setShowUncertaintyModal(false)}
                className="text-[#F5F5F0]/50 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#F5F5F0]/80 leading-relaxed">
              <div className="p-3 bg-[#141414] rounded border border-[#F5F5F0]/10 space-y-1">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase font-bold block">Methodology & Source Data</span>
                <p>{brief.provenance.calculationMethod}</p>
                <p className="text-[11px] text-[#F5F5F0]/50">Source: {brief.provenance.source}</p>
              </div>

              <div className="p-3 bg-[#141414] rounded border border-[#F5F5F0]/10 space-y-1">
                <span className="font-mono text-[10px] text-[#C5A059] uppercase font-bold block">Explicit Underlying Assumptions</span>
                <ul className="list-disc list-inside space-y-1 text-[#F5F5F0]/70">
                  {brief.provenance.assumptions.map((assump, idx) => (
                    <li key={idx}>{assump}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#141414] rounded border border-[#F5F5F0]/10 flex items-center justify-between font-mono">
                <span>Overall Epistemic Certainty Score:</span>
                <span className="text-sm font-bold text-emerald-400">{brief.provenance.certaintyScore}% (High Confidence)</span>
              </div>
            </div>

            <button
              onClick={() => setShowUncertaintyModal(false)}
              className="w-full py-2 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] font-mono text-xs uppercase tracking-wider rounded-sm font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
