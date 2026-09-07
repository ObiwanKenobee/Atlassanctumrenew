import React, { useState } from 'react';
import { useContextualNotifications } from '../../context/ContextualNotificationContext';
import { AlertTriangle, CheckCircle2, ShieldCheck, X, FileText } from 'lucide-react';

export const ContextualNotificationClearConfirmModal: React.FC = () => {
  const {
    isConfirmModalOpen,
    pendingClearNotification,
    cancelClearance,
    confirmClearNotification,
  } = useContextualNotifications();

  const [stewardNote, setStewardNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConfirmModalOpen || !pendingClearNotification) return null;

  const isAll = pendingClearNotification === 'ALL';

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await confirmClearNotification(stewardNote.trim() || undefined);
      setStewardNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0E0E0E] border border-[#C5A059]/40 rounded-xl shadow-2xl p-5 sm:p-6 space-y-4 text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F5F5F0]/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide">
                Steward Confirmation Required
              </h3>
              <p className="text-[11px] font-mono text-[#C5A059]">
                Civilization OS Epistemic Accountability Gate
              </p>
            </div>
          </div>
          <button
            onClick={cancelClearance}
            className="text-[#F5F5F0]/50 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Explainer */}
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-200/90 font-sans leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">
              {isAll
                ? 'Confirm Bulk Clearance of All Active Updates'
                : 'Confirming clearance removes this alert from the active steward stream.'}
            </p>
            <p className="text-[11px] text-amber-200/70 mt-0.5">
              Under Canon XXIII, community updates and mission changes require verified steward acknowledgment before dismissal to preserve collective awareness.
            </p>
          </div>
        </div>

        {/* Notification Preview */}
        {!isAll && (
          <div className="p-3.5 bg-[#141414] border border-[#F5F5F0]/10 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                pendingClearNotification.type === 'community_update'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-950 text-purple-300 border border-purple-500/30'
              }`}>
                {pendingClearNotification.type.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                {pendingClearNotification.relativeTime}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-white">
              {pendingClearNotification.title}
            </h4>
            <p className="text-[11px] text-[#F5F5F0]/70 leading-relaxed font-sans">
              {pendingClearNotification.summary}
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A059]/80 pt-1 border-t border-[#F5F5F0]/5">
              <span>📍 {pendingClearNotification.bioregion}</span>
              <span>By: {pendingClearNotification.sourceEntity}</span>
            </div>
          </div>
        )}

        {/* Steward Acknowledgment Note (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[#F5F5F0]/70 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Steward Acknowledgment Note (Optional)</span>
          </label>
          <input
            type="text"
            value={stewardNote}
            onChange={(e) => setStewardNote(e.target.value)}
            placeholder="e.g., Reviewed hydrological caps; verified field telemetry in Sector 4."
            className="w-full bg-[#141414] border border-[#F5F5F0]/15 focus:border-[#C5A059] rounded-md px-3 py-2 text-xs text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 outline-none font-mono"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={cancelClearance}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-xs font-mono text-[#F5F5F0]/70 hover:text-white hover:bg-[#1C1C1C] border border-transparent transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059] text-[#C5A059] hover:text-amber-200 transition-all shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSubmitting ? 'Recording Audit...' : 'Confirm & Clear Alert'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
