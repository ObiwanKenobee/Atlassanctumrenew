import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCw, 
  Trash2, 
  X, 
  Wifi, 
  WifiOff, 
  ArrowRight,
  Database,
  FileText
} from 'lucide-react';
import { useOfflineSync, OfflineActivityItem } from '../../context/OfflineSyncContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface OfflineActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineActivityLogModal: React.FC<OfflineActivityLogModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    activityLog, 
    clearActivityLog, 
    syncMissedActivity, 
    syncAllMissedActivities, 
    isOnline, 
    isForceOffline 
  } = useOfflineSync();

  const [syncingId, setSyncingId] = React.useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = React.useState(false);

  const handleSyncSingle = async (id: string) => {
    setSyncingId(id);
    audioFeedback.playSubtleClick();
    try {
      await syncMissedActivity(id);
      audioFeedback.playSyncComplete();
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    audioFeedback.playSubtleClick();
    try {
      await syncAllMissedActivities();
      audioFeedback.playSyncComplete();
    } finally {
      setIsSyncingAll(false);
    }
  };

  if (!isOpen) return null;

  const queuedCount = activityLog.filter(a => a.status === 'queued').length;
  const syncedCount = activityLog.filter(a => a.status === 'synced').length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0C110D] border border-[#F5F5F0]/20 shadow-2xl text-[#F5F5F0] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between gap-4 bg-[#101712]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                  Offline Activity Log & Reconciliation
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300">
                  {queuedCount} Queued Missed Actions
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Inspect interactions captured during offline interruptions • Sync upon network restoration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activityLog.length > 0 && (
              <button
                onClick={clearActivityLog}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Clear activity history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Network Status Banner */}
        <div className="px-5 py-2.5 bg-[#141C16] border-b border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            {isOnline && !isForceOffline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Network Restored & Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold">
                  {isForceOffline ? 'Forced Offline Simulation Active' : 'Network Interrupted — Buffering Interactions'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-[11px]">
              {syncedCount} Synced • {queuedCount} Pending
            </span>
            {isOnline && queuedCount > 0 && (
              <button
                onClick={handleSyncAll}
                disabled={isSyncingAll}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3 h-3 ${isSyncingAll ? 'animate-spin' : ''}`} />
                <span>Sync All Queued</span>
              </button>
            )}
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-xs">
          {activityLog.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto" />
              <p className="font-serif text-sm text-neutral-200">No Missed Interactions Recorded</p>
              <p className="text-[11px] max-w-md mx-auto text-neutral-500">
                Any modifications, verified claims, telemetry updates, or parameter shifts attempted during an offline state will automatically be queued here for reconciliation.
              </p>
            </div>
          ) : (
            activityLog.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.status === 'synced'
                    ? 'bg-[#101511]/70 border-emerald-500/20 text-neutral-300'
                    : 'bg-[#141C15] border-amber-500/40 text-white shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'synced'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-[10px] text-[#C5A059] font-bold uppercase">
                        [{item.type}]
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    {item.details && (
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                        {item.details}
                      </p>
                    )}
                    {item.payload && (
                      <div className="mt-1.5 p-2 rounded bg-black/40 border border-white/5 text-[10px] text-neutral-400 font-mono overflow-x-auto">
                        <code>{JSON.stringify(item.payload)}</code>
                      </div>
                    )}
                  </div>

                  {item.status === 'queued' && (
                    <button
                      onClick={() => handleSyncSingle(item.id)}
                      disabled={syncingId === item.id || !isOnline}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shrink-0"
                    >
                      <RotateCw className={`w-3 h-3 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                      <span>Sync</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F5F5F0]/10 bg-[#101712] flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 text-[11px]">
            IndexedDB Offline Persistence Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
