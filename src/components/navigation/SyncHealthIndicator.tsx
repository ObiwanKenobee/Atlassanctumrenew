import React, { useState, useRef, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  HardDrive,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { audioFeedback } from '../../lib/audioFeedback';

export const SyncHealthIndicator: React.FC = () => {
  const { 
    isOnline, 
    isForceOffline, 
    isSyncing, 
    pendingWritesCount, 
    lastSyncTime, 
    syncPendingWritesNow,
    activityLog
  } = useOfflineSync();

  const [isOpen, setIsOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Determine current health state
  const getSyncState = () => {
    if (!isOnline || isForceOffline) {
      return {
        status: 'offline',
        label: isForceOffline ? 'Local Mode' : 'Offline',
        detail: 'IndexedDB Caching Active',
        colorClass: 'border-rose-500/50 bg-rose-950/70 text-rose-300 hover:border-rose-400',
        dotColor: 'bg-rose-500',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: WifiOff
      };
    }

    if (isSyncing) {
      return {
        status: 'syncing',
        label: 'Syncing...',
        detail: 'Reconciling Ledger',
        colorClass: 'border-sky-500/50 bg-sky-950/70 text-sky-300 hover:border-sky-400',
        dotColor: 'bg-sky-400',
        badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        icon: RefreshCw
      };
    }

    if (pendingWritesCount > 0) {
      return {
        status: 'pending',
        label: `${pendingWritesCount} Queued`,
        detail: 'Pending Cloud Commit',
        colorClass: 'border-amber-500/50 bg-amber-950/70 text-amber-300 hover:border-amber-400',
        dotColor: 'bg-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: Clock
      };
    }

    return {
      status: 'synced',
      label: 'Synced',
      detail: 'Cloud Ledger Reconciled',
      colorClass: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:border-emerald-400',
      dotColor: 'bg-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Database
    };
  };

  const state = getSyncState();
  const Icon = state.icon;

  const handleManualSync = async () => {
    audioFeedback.playMicroTick();
    setSyncFeedback('Synchronizing local mutations...');
    try {
      const res = await syncPendingWritesNow();
      if (res.failed === 0) {
        audioFeedback.play('actionSuccess');
        setSyncFeedback(`Successfully synchronized ${res.success} records.`);
      } else {
        setSyncFeedback(`Synced ${res.success}, ${res.failed} pending retry.`);
      }
    } catch {
      setSyncFeedback('Sync encountered a transient network delay.');
    }
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Active session (Live)';
    const elapsedSec = Math.max(0, Math.floor((Date.now() - new Date(lastSyncTime).getTime()) / 1000));
    if (elapsedSec < 10) return 'Just now';
    if (elapsedSec < 60) return `${elapsedSec}s ago`;
    const elapsedMin = Math.floor(elapsedSec / 60);
    return `${elapsedMin}m ago`;
  };

  return (
    <div className="relative font-mono" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        id="nav-sync-health-indicator-btn"
        onClick={() => {
          audioFeedback.playSubtleClick();
          setIsOpen(!isOpen)}
        }
        aria-label={`Database Sync Health: ${state.label}`}
        title={`Sync Health: ${state.label} (${state.detail}) - Click for telemetry`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all text-xs font-mono cursor-pointer shadow-sm ${state.colorClass}`}
      >
        <span className="relative flex h-2 w-2">
          {state.status === 'synced' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          )}
          {state.status === 'syncing' && (
            <span className="animate-spin absolute inline-flex h-full w-full rounded-full border border-sky-400 opacity-80"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${state.dotColor}`}></span>
        </span>

        <Icon className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        <span className="text-[10px] font-bold tracking-wider uppercase hidden sm:inline">
          {state.label}
        </span>
      </button>

      {/* Popover Details Drawer */}
      {isOpen && (
        <div 
          id="nav-sync-health-popover"
          className="absolute top-full right-0 mt-2 w-72 sm:w-80 p-3.5 bg-[#0C100E] border border-[#F5F5F0]/15 rounded-md shadow-2xl z-50 text-left font-sans space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#C5A059]" />
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                  OFFLINE SYNC & STORAGE HEALTH
                </span>
                <h4 className="text-xs font-mono text-white font-bold">
                  IndexedDB ↔ Cloud Ledger
                </h4>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${state.badgeBg}`}>
              {state.status}
            </span>
          </div>

          {/* Status Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-[9px] text-neutral-400 uppercase block">Connectivity</span>
              <div className="flex items-center gap-1.5">
                {isOnline && !isForceOffline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300 font-bold text-[11px]">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-rose-400" />
                    <span className="text-rose-300 font-bold text-[11px]">
                      {isForceOffline ? 'Forced Local' : 'Disconnected'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-[9px] text-neutral-400 uppercase block">Pending Writes</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className={`font-bold text-[11px] ${pendingWritesCount > 0 ? 'text-amber-300' : 'text-neutral-300'}`}>
                  {pendingWritesCount} uncommitted
                </span>
              </div>
            </div>
          </div>

          {/* Last Sync Timestamp */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
            <span>Last Reconciliation:</span>
            <span className="text-neutral-200 font-bold">{formatLastSync()}</span>
          </div>

          {/* Action Feedback Message */}
          {syncFeedback && (
            <div className="p-2 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-mono text-neutral-200 text-center animate-in fade-in duration-150">
              {syncFeedback}
            </div>
          )}

          {/* Actions */}
          <div className="pt-1 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing || (!isOnline && !isForceOffline)}
              className="flex-1 py-1.5 px-2.5 rounded bg-[#1B3022] hover:bg-[#254530] disabled:opacity-50 text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Force Sync Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
