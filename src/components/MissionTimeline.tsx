import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  ShieldCheck, 
  FileText, 
  Radio, 
  ExternalLink, 
  Calendar, 
  Copy, 
  Check, 
  Layers, 
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';
import { MissionMilestone } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

export interface MissionTimelineProps {
  milestones: MissionMilestone[];
  onInspectProvenance?: (provenanceData: any) => void;
  onOpenProvenance?: (provenanceData: any) => void;
  className?: string;
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({
  milestones,
  onInspectProvenance,
  onOpenProvenance,
  className = ''
}) => {
  const handleInspect = onOpenProvenance || onInspectProvenance;
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(milestones[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'upcoming'>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredMilestones = milestones.filter(m => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const activeMilestone = milestones.find(m => m.id === selectedMilestoneId) || milestones[0];

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getStatusConfig = (status: MissionMilestone['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          dotBg: 'bg-emerald-500',
          badgeText: 'Completed',
          badgeStyle: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          lineColor: 'border-emerald-500/40'
        };
      case 'in_progress':
        return {
          icon: Clock,
          iconColor: 'text-[#C5A059]',
          dotBg: 'bg-[#C5A059] animate-pulse',
          badgeText: 'In Progress',
          badgeStyle: 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059]',
          lineColor: 'border-[#C5A059]/40'
        };
      case 'upcoming':
      default:
        return {
          icon: CircleDashed,
          iconColor: 'text-[#F5F5F0]/40',
          dotBg: 'bg-[#F5F5F0]/20',
          badgeText: 'Planned',
          badgeStyle: 'bg-[#F5F5F0]/5 border-[#F5F5F0]/10 text-[#F5F5F0]/50',
          lineColor: 'border-[#F5F5F0]/10'
        };
    }
  };

  const getEvidenceStyle = (label: MissionMilestone['evidenceLabel']) => {
    switch (label) {
      case 'Verified':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: ShieldCheck
        };
      case 'Documented':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          icon: FileText
        };
      case 'Reported':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: Radio
        };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Timeline Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F0]/50">Filter Milestones:</span>
          <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded-sm border border-[#F5F5F0]/10">
            {(['all', 'completed', 'in_progress', 'upcoming'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setFilterStatus(tab);
                  audioFeedback.playSubtleClick();
                }}
                className={`px-2.5 py-1 text-[11px] font-mono capitalize transition-all rounded-sm ${
                  filterStatus === tab
                    ? 'bg-[#F5F5F0]/15 text-[#F5F5F0] font-medium'
                    : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                }`}
              >
                {tab === 'in_progress' ? 'In Progress' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#F5F5F0]/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {milestones.filter(m => m.status === 'completed').length} Verified
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
            {milestones.filter(m => m.status === 'in_progress').length} Active
          </span>
        </div>
      </div>

      {/* Main Interactive Grid: Timeline Track on Left, Detailed Milestone on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Milestone Steps List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredMilestones.map((m, idx) => {
            const statusConfig = getStatusConfig(m.status);
            const evidenceStyle = getEvidenceStyle(m.evidenceLabel);
            const StatusIcon = statusConfig.icon;
            const EvidenceIcon = evidenceStyle.icon;
            const isSelected = activeMilestone?.id === m.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMilestoneId(m.id);
                  audioFeedback.playSubtleClick();
                }}
                className={`group relative p-4 rounded-sm border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#141414] border-[#C5A059] shadow-lg shadow-[#C5A059]/5 ring-1 ring-[#C5A059]/30'
                    : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#121212]'
                }`}
              >
                {/* Connecting Line between Milestones */}
                {idx < filteredMilestones.length - 1 && (
                  <div className={`absolute left-7 top-12 bottom-[-14px] w-0.5 border-l-2 border-dashed ${statusConfig.lineColor} z-0 hidden sm:block`} />
                )}

                <div className="relative z-10 flex items-start gap-3.5">
                  {/* Step Status Indicator */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    m.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : m.status === 'in_progress'
                      ? 'bg-[#C5A059]/20 text-[#C5A059]'
                      : 'bg-[#F5F5F0]/10 text-[#F5F5F0]/40'
                  }`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                  </div>

                  {/* Content Summary */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#F5F5F0]/40">M0{idx + 1}</span>
                        <span className="text-xs font-mono text-[#F5F5F0]/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C5A059]" />
                          {m.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Evidence Tag */}
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${evidenceStyle.bg}`}>
                          <EvidenceIcon className="w-2.5 h-2.5" />
                          {m.evidenceLabel}
                        </span>

                        {/* Status Tag */}
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${statusConfig.badgeStyle}`}>
                          {statusConfig.badgeText}
                        </span>
                      </div>
                    </div>

                    <h4 className={`text-sm font-sans font-medium transition-colors ${
                      isSelected ? 'text-[#F5F5F0] font-semibold' : 'text-[#F5F5F0]/90 group-hover:text-[#F5F5F0]'
                    }`}>
                      {m.title}
                    </h4>

                    <p className="text-xs text-[#F5F5F0]/60 font-sans line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>

                    {m.verificationHash && (
                      <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/40">
                        <span>Hash: {m.verificationHash.slice(0, 10)}...</span>
                        <button
                          onClick={(e) => handleCopyHash(m.verificationHash!, e)}
                          className="text-[#F5F5F0]/40 hover:text-[#C5A059] flex items-center gap-0.5"
                        >
                          {copiedHash === m.verificationHash ? (
                            <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-2.5 h-2.5" /> Copied</span>
                          ) : (
                            <span className="flex items-center gap-0.5"><Copy className="w-2.5 h-2.5" /> Copy</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Milestone Deep-Dive Card */}
        <div className="lg:col-span-5 sticky top-24">
          {activeMilestone ? (
            <div className="p-5 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                    Milestone Evidence Ledger
                  </span>
                </div>
                <span className="text-xs font-mono text-[#F5F5F0]/60 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C5A059]" />
                  {activeMilestone.date}
                </span>
              </div>

              <div>
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  {activeMilestone.title}
                </h3>
                <p className="text-xs text-[#F5F5F0]/80 font-sans mt-2 leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              {/* Verification & Evidence Breakdown */}
              <div className="p-3.5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#F5F5F0]/50 uppercase">Provenance Level:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getEvidenceStyle(activeMilestone.evidenceLabel).bg}`}>
                    {activeMilestone.evidenceLabel}
                  </span>
                </div>

                {activeMilestone.evidenceDetail && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase block">Audit Observation:</span>
                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-normal">
                      {activeMilestone.evidenceDetail}
                    </p>
                  </div>
                )}

                {activeMilestone.verificationHash && (
                  <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                      <span>Cryptographic Attestation</span>
                      <button
                        onClick={(e) => handleCopyHash(activeMilestone.verificationHash!, e)}
                        className="text-[#C5A059] hover:underline flex items-center gap-1"
                      >
                        {copiedHash === activeMilestone.verificationHash ? 'Copied' : 'Copy Hash'}
                      </button>
                    </div>
                    <code className="block p-2 bg-[#080808] border border-[#F5F5F0]/10 rounded text-[10px] font-mono text-emerald-400/90 break-all select-all">
                      {activeMilestone.verificationHash}
                    </code>
                  </div>
                )}
              </div>

              {/* Action trigger to inspect full provenance */}
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  if (handleInspect) {
                    handleInspect({
                      label: activeMilestone.title,
                      value: activeMilestone.status.toUpperCase(),
                      provenance: activeMilestone.evidenceLabel,
                      source: activeMilestone.evidenceDetail || 'Field Audit Node',
                      date: activeMilestone.date,
                      cryptographicHash: activeMilestone.verificationHash,
                      description: activeMilestone.description
                    });
                  }
                }}
                className="w-full py-2 px-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] flex items-center justify-center gap-1.5 transition-all group"
              >
                <Eye className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span>Inspect Full Evidence Chain</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#F5F5F0]/40 border border-dashed border-[#F5F5F0]/10 rounded-sm">
              Select a milestone from the left to inspect its verification proofs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
