import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface OfflineModeToggleProps {
  className?: string;
  isCompact?: boolean;
}

export const OfflineModeToggle: React.FC<OfflineModeToggleProps> = ({
  className = '',
  isCompact = false
}) => {
  const { 
    isForceOffline, 
    isOnline, 
    pendingWritesCount, 
    isSyncing, 
    toggleForceOffline,
    syncPendingWritesNow 
  } = useOfflineSync();

  const [showTooltip, setShowTooltip] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleToggle = () => {
    audioFeedback.playMicroTick();
    toggleForceOffline();
  };

  const handleManualSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isForceOffline || !isOnline) return;
    const res = await syncPendingWritesNow();
    if (res.success > 0) {
      setSyncFeedback(`Synced ${res.success} pending items!`);
      setTimeout(() => setSyncFeedback(null), 3000);
    } else if (res.failed > 0) {
      setSyncFeedback(`Sync failed for ${res.failed} items.`);
      setTimeout(() => setSyncFeedback(null), 3000);
    } else {
      setSyncFeedback('All items synchronized.');
      setTimeout(() => setSyncFeedback(null), 2500);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Toggle Button */}
      <button
        id="global-offline-mode-toggle-btn"
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isForceOffline ? "Disable Forced Offline Mode" : "Enable Forced Offline Mode"}
        className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full font-mono text-[10px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer border ${
          isForceOffline
            ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30'
            : !isOnline
            ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
            : 'bg-[#121212] hover:bg-[#1A1A1A] border-[#F5F5F0]/15 hover:border-[#C5A059]/50 text-[#F5F5F0]/80 hover:text-[#F5F5F0]'
        }`}
      >
        {/* Status Indicator Beacon */}
        <div className="relative flex items-center justify-center shrink-0">
          {isForceOffline ? (
            <div className="relative">
              <HardDrive className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
            </div>
          ) : !isOnline ? (
            <div className="relative">
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black" />
            </div>
          ) : (
            <div className="relative">
              <Wifi className="w-3.5 h-3.5 text-emerald-400 group-hover:text-[#C5A059] transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            </div>
          )}
        </div>

        {/* Label (Compact vs Full) */}
        {!isCompact && (
          <div className="flex items-center gap-1.5">
            <span className="hidden xl:inline">
              {isForceOffline ? (
                <span className="text-amber-300">FORCED OFFLINE</span>
              ) : !isOnline ? (
                <span className="text-rose-300">OFFLINE</span>
              ) : (
                <span className="text-[#F5F5F0]/70 group-hover:text-[#F5F5F0]">LIVE SYNC</span>
              )}
            </span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-black/40 border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hidden 2xl:inline">
              {isForceOffline ? 'IndexedDB' : 'Firestore'}
            </span>
          </div>
        )}

        {/* Pending Mutations Badge */}
        {pendingWritesCount > 0 && (
          <span 
            onClick={handleManualSync}
            title="Pending mutations queued in IndexedDB. Click to sync if online."
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold animate-pulse hover:bg-amber-500/30"
          >
            {isSyncing ? (
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <Database className="w-2.5 h-2.5" />
            )}
            <span>{pendingWritesCount}</span>
          </span>
        )}
      </button>

      {/* Popover / Tooltip on Hover */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-72 p-3.5 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-2xl z-50 text-left font-sans text-xs text-[#F5F5F0] space-y-2 pointer-events-none sm:pointer-events-auto">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              Persistence Engine Status
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
              isForceOffline ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
            }`}>
              {isForceOffline ? 'INDEXEDDB WRITE CACHE' : 'FIRESTORE REAL-TIME'}
            </span>
          </div>

          <p className="text-[11px] text-[#F5F5F0]/80 leading-relaxed font-sans">
            {isForceOffline
              ? 'Forced Offline Mode is active. All subsequent mutations (field notes, impact records, moral logs) are saved locally into browser IndexedDB without making remote Firestore network requests.'
              : 'Live Cloud Persistence is active. Writes are immediately synced to Firestore and mirrored into local IndexedDB.'}
          </p>

          <div className="pt-1.5 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
            <span>Pending Sync Queue:</span>
            <strong className={pendingWritesCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
              {pendingWritesCount} {pendingWritesCount === 1 ? 'mutation' : 'mutations'}
            </strong>
          </div>

          {pendingWritesCount > 0 && !isForceOffline && isOnline && (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="w-full mt-2 py-1.5 px-2.5 rounded bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3 h-3" />}
              <span>Sync {pendingWritesCount} Cached Writes to Firestore</span>
            </button>
          )}

          {syncFeedback && (
            <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 p-1.5 rounded text-center border border-emerald-500/30">
              {syncFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
