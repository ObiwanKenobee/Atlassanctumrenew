import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Compass, 
  UserCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { AI_TRANSPARENCY_RECORDS } from '../../../data/trustData';
import { useTrustLayer } from '../../../context/TrustLayerContext';
import { audioFeedback } from '../../../lib/audioFeedback';

export const AITransparencySection: React.FC = () => {
  const { openTrustModal } = useTrustLayer();
  const [selectedFeature, setSelectedFeature] = useState(AI_TRANSPARENCY_RECORDS[0].featureName);

  const activeRecord = AI_TRANSPARENCY_RECORDS.find(r => r.featureName === selectedFeature) || AI_TRANSPARENCY_RECORDS[0];

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-950/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">Algorithmic Accountability Charter</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            AI Transparency, Guardrails & Human-in-the-Loop Governance
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            In Atlas Sanctum, artificial intelligence serves strictly as an epistemic magnifier for human contemplation, ecological modeling, and multi-generational stewardship. AI holds zero autonomous sovereign authority.
          </p>
        </div>
      </div>

      {/* 4 Foundation AI Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Lock className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Zero Training Policy</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Your personal notes, private cap tables, and research queries are never used to train foundation models.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <UserCheck className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Human Primacy</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            All capital allocations, land trust easements, and moral certifications require human delegate authorization.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Scale className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Right of Appeal</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Any AI score or hypothesis can be formally challenged with peer evidence before the Governance Assembly.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Eye className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold">Open Reasoning</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Every AI scorecard displays its epistemic uncertainty bounds, source citations, and primary causal chains.
          </p>
        </div>
      </div>

      {/* Interactive Feature Deep-Dive Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-mono uppercase font-bold text-[#F5F5F0] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            AI Subsystem Transparency Registry
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            {AI_TRANSPARENCY_RECORDS.map(rec => (
              <button
                key={rec.featureName}
                onClick={() => {
                  setSelectedFeature(rec.featureName);
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                  selectedFeature === rec.featureName
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                    : 'bg-[#181818] hover:bg-[#222] text-[#F5F5F0]/70 border border-[#F5F5F0]/10'
                }`}
              >
                {rec.featureName.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Active AI Feature Inspection Card */}
        <div className="p-6 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider">Subsystem Inspection</span>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F5F0] font-mono">{activeRecord.featureName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono rounded">
                Model: {activeRecord.aiModel}
              </span>
              <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-mono rounded">
                Authority: {activeRecord.decisionInfluence}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-mono uppercase text-[#C5A059] font-bold mb-1">Primary Capability & Purpose</h4>
                <p className="text-[#F5F5F0]/80 leading-relaxed">{activeRecord.primaryCapability}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1">What Information the AI Receives</h4>
                <ul className="space-y-1">
                  {activeRecord.dataIngested.map((d, i) => (
                    <li key={i} className="text-[#F5F5F0]/80 flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-emerald-400">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1">Model Training Policy</h4>
                <p className="text-cyan-200 font-mono text-[11px] p-2 bg-[#0E0E0E] rounded border border-cyan-800/30">
                  Guarantee: {activeRecord.modelTrainingUsage}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold mb-1">Human-in-the-Loop Policy</h4>
                <p className="text-[#F5F5F0]/80 leading-relaxed">{activeRecord.humanInTheLoopPolicy}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-1">Known Limitations & Boundary Conditions</h4>
                <ul className="space-y-1">
                  {activeRecord.knownLimitations.map((lim, i) => (
                    <li key={i} className="text-amber-200/90 flex items-center gap-2 font-mono text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase text-purple-400 font-bold mb-1">Appeal & Challenge Mechanism</h4>
                <p className="text-[#F5F5F0]/80 leading-relaxed">{activeRecord.appealMechanism}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[11px] font-mono text-[#F5F5F0]/50">
              Need to appeal an automated assessment?
            </span>
            <button
              onClick={() => {
                openTrustModal('data-rights');
                audioFeedback.playSubtleClick();
              }}
              className="px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-[#C5A059] rounded border border-[#C5A059]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Submit Formal Appeal Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
