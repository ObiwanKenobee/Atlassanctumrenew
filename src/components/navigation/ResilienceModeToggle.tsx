import React, { useState, useEffect, useRef } from 'react';
import { 
  HardDrive, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCw, 
  Database, 
  Radio, 
  MapPin, 
  ChevronDown, 
  X, 
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';
import { 
  ResilienceMissionCacheService, 
  CriticalMissionItem, 
  CRITICAL_FIELD_MISSIONS 
} from '../../services/resilienceMissionCacheService';
import { audioFeedback } from '../../lib/audioFeedback';

export const ResilienceModeToggle: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(() => ResilienceMissionCacheService.isResilienceModeActive());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cachedMissions, setCachedMissions] = useState<CriticalMissionItem[]>(CRITICAL_FIELD_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<CriticalMissionItem | null>(null);
  const [cacheStats, setCacheStats] = useState<{
    missionCount: number;
    lastCachedAt: number | null;
    storageSizeKb: number;
  }>({
    missionCount: CRITICAL_FIELD_MISSIONS.length,
    lastCachedAt: null,
    storageSizeKb: 14
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync state and listen for global events
  useEffect(() => {
    const handleToggleEvent = (e: any) => {
      setIsActive(e.detail?.enabled ?? false);
    };

    window.addEventListener('atlas-resilience-mode-toggled', handleToggleEvent);

    // Initial load
    ResilienceMissionCacheService.getCacheStatus().then(status => {
      setIsActive(status.isActive);
      setCacheStats({
        missionCount: status.missionCount,
        lastCachedAt: status.lastCachedAt,
        storageSizeKb: status.storageSizeKb
      });
    });

    return () => {
      window.removeEventListener('atlas-resilience-mode-toggled', handleToggleEvent);
    };
  }, []);

  // Close on outside click
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

  const handleToggle = async () => {
    audioFeedback.playSubtleClick();
    if (isActive) {
      await ResilienceMissionCacheService.disableResilienceMode();
      setIsActive(false);
      audioFeedback.playMicroTick();
    } else {
      setIsCaching(true);
      try {
        const res = await ResilienceMissionCacheService.enableResilienceMode();
        setIsActive(true);
        setCacheStats({
          missionCount: res.cachedMissionsCount,
          lastCachedAt: Date.now(),
          storageSizeKb: Math.round(res.bytesCached / 1024)
        });
        audioFeedback.playSuccessChime();
      } finally {
        setIsCaching(false);
      }
    }
  };

  const handleForceRefresh = async () => {
    audioFeedback.playSubtleClick();
    setIsCaching(true);
    try {
      const res = await ResilienceMissionCacheService.enableResilienceMode();
      setIsActive(true);
      const missions = await ResilienceMissionCacheService.getCachedMissions();
      setCachedMissions(missions);
      setCacheStats({
        missionCount: res.cachedMissionsCount,
        lastCachedAt: Date.now(),
        storageSizeKb: Math.round(res.bytesCached / 1024)
      });
      audioFeedback.playSuccessChime();
    } finally {
      setIsCaching(false);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Header Button Trigger */}
      <button
        id="resilience-mode-toggle-btn"
        onClick={() => {
          audioFeedback.playSubtleClick();
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle Resilience Mode & Offline Mission Cache"
        title="Resilience Mode: Force-cache critical missions to local IndexedDB for low-connectivity field operations"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full border transition-all text-xs font-mono font-bold cursor-pointer ${
          isActive
            ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
            : 'bg-[#121212] hover:bg-[#1C1C1C] border-[#F5F5F0]/15 hover:border-[#C5A059]/50 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
        }`}
      >
        {isActive ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-wider text-amber-300">
              Resilience Active
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200">
              {cacheStats.missionCount} Cached
            </span>
          </>
        ) : (
          <>
            <HardDrive className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-wider">
              Resilience Mode
            </span>
            <span className="hidden 2xl:inline text-[9px] text-[#F5F5F0]/40">
              Off
            </span>
          </>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Flyout Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-md bg-[#0C0F0D] border border-amber-500/40 shadow-2xl z-[100] text-xs font-mono text-[#F5F5F0] space-y-4 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#F5F5F0]/10">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-[#C5A059]'}`} />
                <h4 className="font-serif font-bold text-sm text-white">Resilience Field Cache</h4>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/60 font-sans leading-tight">
                Force-caches mission-critical vectors into browser IndexedDB for zero-connectivity field operations.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#F5F5F0]/40 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Master Toggle Banner */}
          <div className={`p-3 rounded border flex items-center justify-between gap-3 ${
            isActive 
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
              : 'bg-black/60 border-[#F5F5F0]/10 text-[#F5F5F0]/70'
          }`}>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider block">
                {isActive ? 'STATUS: RESILIENCE ACTIVE' : 'STATUS: CONNECTED STANDBY'}
              </span>
              <span className="text-[10px] text-[#F5F5F0]/60 block font-sans">
                {isActive 
                  ? 'Local IndexedDB primary active. Low-connectivity protection engaged.' 
                  : 'Operating via online telemetry stream. Click to force local snapshot.'}
              </span>
            </div>

            <button
              onClick={handleToggle}
              disabled={isCaching}
              className={`px-3 py-1.5 rounded text-xs uppercase font-bold tracking-wider transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-md'
                  : 'bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40'
              }`}
            >
              {isCaching ? 'Writing...' : (isActive ? 'Disable' : 'Engage')}
            </button>
          </div>

          {/* IndexedDB Cache Telemetry Box */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2.5 rounded bg-black/40 border border-[#F5F5F0]/10 space-y-0.5">
              <span className="text-[#F5F5F0]/50 uppercase block">Engine</span>
              <span className="text-white font-bold flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                IndexedDB (v1)
              </span>
            </div>
            <div className="p-2.5 rounded bg-black/40 border border-[#F5F5F0]/10 space-y-0.5">
              <span className="text-[#F5F5F0]/50 uppercase block">Cached Footprint</span>
              <span className="text-amber-300 font-bold">
                {cacheStats.storageSizeKb} KB • {cacheStats.missionCount} Missions
              </span>
            </div>
          </div>

          {/* Cached Critical Mission List Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
              <span>Local Mission Manifest ({cachedMissions.length})</span>
              <span>Priority Floor</span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {cachedMissions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setSelectedMission(selectedMission?.id === m.id ? null : m);
                  }}
                  className={`p-2 rounded border transition-all cursor-pointer ${
                    selectedMission?.id === m.id
                      ? 'bg-[#1A231D] border-emerald-500/60'
                      : 'bg-[#080B09] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-white font-bold truncate text-[11px]">{m.title}</span>
                    <span className="text-[9px] px-1 rounded bg-red-950/80 border border-red-500/40 text-red-300 uppercase font-bold shrink-0">
                      {m.priorityLevel}
                    </span>
                  </div>
                  <div className="text-[9px] text-[#F5F5F0]/50 flex items-center gap-2 mt-0.5">
                    <span className="text-[#C5A059]">{m.bioregion}</span>
                    <span>•</span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      <Radio className="w-2.5 h-2.5" />
                      {m.radioFrequencyMhz} MHz
                    </span>
                  </div>

                  {selectedMission?.id === m.id && (
                    <div className="mt-2 pt-2 border-t border-[#F5F5F0]/10 text-[10px] space-y-1.5 text-[#F5F5F0]/80">
                      <div className="text-[10px] text-amber-300 font-bold">Field Steps ({m.fieldSteps.length}):</div>
                      {m.fieldSteps.map(s => (
                        <div key={s.stepNumber} className="flex items-start gap-1">
                          <span className="text-[#C5A059] font-bold shrink-0">{s.stepNumber}.</span>
                          <span>{s.description}</span>
                        </div>
                      ))}
                      <div className="text-[9px] text-emerald-400 font-mono pt-1">
                        ZKP Root: {m.zkpMerkleRoot}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2">
            <button
              onClick={handleForceRefresh}
              disabled={isCaching}
              className="flex-1 py-1.5 px-3 rounded bg-[#161E18] hover:bg-[#1E2B21] border border-emerald-500/40 text-emerald-300 text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3 h-3 ${isCaching ? 'animate-spin' : ''}`} />
              <span>{isCaching ? 'Syncing to IndexedDB...' : 'Force Refresh Local Cache'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
