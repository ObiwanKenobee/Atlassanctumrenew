import React from 'react';
import {
  History,
  X,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  GitCommit,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import {
  HISTORICAL_VERSION_SNAPSHOTS,
  HistoricalVersionSnapshot
} from '../../services/bioregionalKnowledgeService';
import { audioFeedback } from '../../lib/audioFeedback';

interface HistoricalVersioningSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSnapshotId: string | null;
  onSelectSnapshot: (snapshotId: string | null) => void;
  isDiffMode: boolean;
  onToggleDiffMode: () => void;
}

export const HistoricalVersioningSidebar: React.FC<HistoricalVersioningSidebarProps> = ({
  isOpen,
  onClose,
  activeSnapshotId,
  onSelectSnapshot,
  isDiffMode,
  onToggleDiffMode
}) => {
  if (!isOpen) return null;

  const currentSnapshot = HISTORICAL_VERSION_SNAPSHOTS.find(s => s.id === activeSnapshotId) || null;
  const isLiveActive = !activeSnapshotId || activeSnapshotId === 'v3.2-2026';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0E0E0E] border-l border-[#C5A059]/30 shadow-2xl flex flex-col justify-between text-[#F5F5F0] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-[#F5F5F0]/10 bg-[#141414] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#C5A059]" />
              EPISTEMIC AUDIT TIMELINE
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Immutable History
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">
            Historical Versioning
          </h3>
        </div>
        <button
          onClick={() => {
            onClose();
            audioFeedback.playMicroTick();
          }}
          className="p-1.5 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#222] rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Snapshot Preview Status Banner */}
      {!isLiveActive && currentSnapshot && (
        <div className="p-3 bg-[#241A08] border-b border-[#C5A059]/40 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
            <div>
              <span className="text-[#FBBF24] font-bold">Previewing Snapshot: </span>
              <span className="text-[#F5F5F0]">{currentSnapshot.version} ({currentSnapshot.periodYear})</span>
            </div>
          </div>
          <button
            onClick={() => {
              onSelectSnapshot(null);
              audioFeedback.playDataSave();
            }}
            className="px-2.5 py-1 bg-[#C5A059] text-black font-bold text-[10px] rounded hover:bg-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Return to Live
          </button>
        </div>
      )}

      {/* Version Snapshots List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Controls: Diff Toggle */}
        <div className="p-3 bg-[#161616] border border-[#F5F5F0]/10 rounded-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold text-[#F5F5F0]">Compare Diff with Live Twin</span>
            <p className="text-[10px] text-[#F5F5F0]/50">Highlights newly added nodes and evolved causal pathways</p>
          </div>
          <button
            onClick={() => {
              onToggleDiffMode();
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
              isDiffMode
                ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-[#222] border-[#F5F5F0]/20 text-[#F5F5F0]/70'
            }`}
          >
            {isDiffMode ? 'Diff Overlay Active' : 'Enable Diff'}
          </button>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
            Verified In-Situ Audit Snapshots ({HISTORICAL_VERSION_SNAPSHOTS.length})
          </span>

          {HISTORICAL_VERSION_SNAPSHOTS.map(snapshot => {
            const isSelected = activeSnapshotId === snapshot.id || (isLiveActive && snapshot.id === 'v3.2-2026');
            return (
              <div
                key={snapshot.id}
                onClick={() => {
                  onSelectSnapshot(snapshot.id === 'v3.2-2026' ? null : snapshot.id);
                  audioFeedback.playSubtleClick();
                }}
                className={`p-4 rounded-sm border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-[#1C170E] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                    : 'bg-[#141414] hover:bg-[#1A1A1A] border-[#F5F5F0]/10'
                }`}
              >
                {/* Snapshot Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        snapshot.id === 'v3.2-2026'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-[#2B2313] text-[#C5A059] border border-[#C5A059]/30'
                      }`}>
                        {snapshot.version}
                      </span>
                      <span className="text-xs font-mono text-[#F5F5F0]/50 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C5A059]" />
                        {snapshot.auditDate}
                      </span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                      {snapshot.title}
                    </h4>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  )}
                </div>

                {/* Summary */}
                <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                  {snapshot.summary}
                </p>

                {/* Key Milestones */}
                <div className="space-y-1 bg-[#0A0A0A] p-2.5 rounded-xs border border-[#F5F5F0]/5">
                  <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold block">
                    Verified Milestones:
                  </span>
                  {snapshot.keyMilestones.map((ms, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/70">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>

                {/* Council & Hash Footer */}
                <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                  <span className="truncate max-w-[200px]">Auditor: {snapshot.auditorCouncil}</span>
                  <span className="text-emerald-400 font-bold">{snapshot.ecosystemIntegrityScore}% Integrity</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#F5F5F0]/10 bg-[#141414] flex items-center justify-between gap-3">
        <button
          onClick={() => {
            onSelectSnapshot(null);
            audioFeedback.playDataSave();
          }}
          className="px-3 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0] rounded transition-colors cursor-pointer"
        >
          Reset to Current Live State
        </button>
        <button
          onClick={() => {
            onClose();
            audioFeedback.playMicroTick();
          }}
          className="px-4 py-2 bg-[#C5A059] text-black font-mono font-bold text-xs rounded hover:bg-[#D4AF37] transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
