import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Scale, 
  Cpu, 
  Lightbulb, 
  Globe2, 
  AlertTriangle,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface FlourishingInsightsData {
  executiveSummary: string;
  correlationInsight: string;
  decouplingAnalysis: string;
  bioregionalComparison: string;
  anomalyAssessment: string;
  strategicRecommendations: string[];
  statisticalConfidence: string;
  epistemicAssurance: string;
  bioregionsAnalyzed: string[];
  latencyMs?: number;
  timestamp?: string;
}

interface FlourishingAIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: FlourishingInsightsData | null;
  isLoading: boolean;
  onRegenerate: () => void;
  selectedBioregionNames: string[];
  isNormalized: boolean;
}

export const FlourishingAIInsightsModal: React.FC<FlourishingAIInsightsModalProps> = ({
  isOpen,
  onClose,
  insights,
  isLoading,
  onRegenerate,
  selectedBioregionNames,
  isNormalized
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!insights) return;
    const text = `ATLAS SANCTUM ECOLOGICAL-ECONOMIC AI INSIGHTS
Bioregions: ${selectedBioregionNames.join(', ')}
Normalized: ${isNormalized ? 'Yes (0-100%)' : 'No (Raw Units)'}

EXECUTIVE SUMMARY:
${insights.executiveSummary}

CORRELATION & CO-FLOURISHING ANALYSIS:
${insights.correlationInsight}

DECOUPLING DYNAMICS:
${insights.decouplingAnalysis}

BIOREGIONAL COMPARATIVE FINDINGS:
${insights.bioregionalComparison}

SYSTEM STRESS & ANOMALY RESILIENCE:
${insights.anomalyAssessment}

STRATEGIC COVENANT RECOMMENDATIONS:
${insights.strategicRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

EPISTEMIC ASSURANCE:
${insights.epistemicAssurance} (${insights.statisticalConfidence})
Timestamp: ${insights.timestamp || new Date().toISOString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0D0B] border border-[#C5A059]/40 rounded-lg shadow-2xl p-6 sm:p-8 space-y-6 text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                GEMINI 3.8 FLASH ECOLOGICAL REASONING
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ZK-Telemetry Audited
              </span>
              {isNormalized && (
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  0-100% Normalized Scale
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] flex items-center gap-2.5">
              <BrainCircuit className="w-6 h-6 text-[#C5A059]" />
              Ecological & Economic Correlation Synthesis
            </h2>
            <p className="text-xs text-[#F5F5F0]/65 font-sans">
              Autonomous systems-dynamics interpretation of the multi-line trend comparison matrix across{' '}
              <span className="text-[#C5A059] font-mono font-medium">{selectedBioregionNames.join(', ')}</span>.
            </p>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-sm hover:bg-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-[#C5A059]/20 border-t-[#C5A059] animate-spin" />
              <Cpu className="w-6 h-6 text-[#C5A059] absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F0]">
                Synthesizing Longitudinal Telemetry with Gemini...
              </h3>
              <p className="text-xs text-[#F5F5F0]/50 font-sans max-w-sm">
                Correlating 12-month ground-truth lysimeter quorums, Sentinel-2 vegetation indices, and regional liquidity velocity.
              </p>
            </div>
          </div>
        ) : insights ? (
          <div className="space-y-6">
            {/* 1. Executive Summary */}
            <div className="p-4 rounded bg-[#121A15] border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Executive Correlation Findings</span>
              </div>
              <p className="text-sm leading-relaxed text-[#F5F5F0]/90 font-sans">
                {insights.executiveSummary}
              </p>
            </div>

            {/* 2. Correlation & Decoupling Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-[#101411] border border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-mono font-bold uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>Empirical Co-Flourishing</span>
                </div>
                <p className="text-xs leading-relaxed text-[#F5F5F0]/80 font-sans">
                  {insights.correlationInsight}
                </p>
              </div>

              <div className="p-4 rounded bg-[#101411] border border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Decoupling from Extractive Baselines</span>
                </div>
                <p className="text-xs leading-relaxed text-[#F5F5F0]/80 font-sans">
                  {insights.decouplingAnalysis}
                </p>
              </div>
            </div>

            {/* 3. Bioregional Comparative Findings */}
            <div className="p-4 rounded bg-[#0D1210] border border-[#F5F5F0]/10 space-y-2">
              <div className="flex items-center gap-2 text-[#C5A059] text-xs font-mono font-bold uppercase tracking-wider">
                <Globe2 className="w-4 h-4" />
                <span>Bioregional Comparison Matrix</span>
              </div>
              <p className="text-xs leading-relaxed text-[#F5F5F0]/80 font-sans">
                {insights.bioregionalComparison}
              </p>
            </div>

            {/* 4. Anomaly Assessment */}
            <div className="p-4 rounded bg-[#151210] border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>System Stress & Anomaly Resilience</span>
              </div>
              <p className="text-xs leading-relaxed text-[#F5F5F0]/80 font-sans">
                {insights.anomalyAssessment}
              </p>
            </div>

            {/* 5. Strategic Recommendations */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Actionable Covenant Interventions</span>
              </h4>
              <div className="space-y-2">
                {insights.strategicRecommendations.map((rec, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded bg-[#141715] border border-[#F5F5F0]/10 flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-mono text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-[#F5F5F0]/85 font-sans leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Epistemic Assurance Tier */}
            <div className="p-3 bg-[#0B0F0C] rounded border border-[#F5F5F0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-[#F5F5F0]/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{insights.statisticalConfidence}</span>
              </div>
              <div className="text-[#C5A059] font-bold">
                {insights.epistemicAssurance}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-[#F5F5F0]/50 font-mono text-xs">
            No insight data available. Click "Generate AI Insights" to trigger synthesis.
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F5F5F0]/10">
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 rounded-sm bg-[#161D18] hover:bg-[#202B23] border border-[#C5A059]/40 text-[#C5A059] hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Analyze with Gemini</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              disabled={!insights || isLoading}
              className="w-full sm:w-auto px-4 py-2 rounded-sm bg-[#1B271F] hover:bg-[#26372B] border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Synthesis</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-sm bg-[#141414] hover:bg-[#222] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-mono transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
