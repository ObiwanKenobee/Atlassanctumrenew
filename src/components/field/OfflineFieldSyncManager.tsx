import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  CloudUpload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Camera,
  Plus,
  Trash2,
  ShieldCheck,
  Cpu,
  Clock
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface OfflineQueuedObservation {
  id: string;
  fieldLabId: string;
  fieldLabName: string;
  observationType: 'Soil Sample' | 'Hydrological Turbidity' | 'Acoustic Audio' | 'Bio-Swale Integrity';
  notes: string;
  gpsCoordinates: string;
  timestamp: string;
  syncStatus: 'QUEUED_OFFLINE' | 'SYNCING' | 'SYNCED_FIRESTORE' | 'CONFLICT_RESOLVED';
  photoCount: number;
}

const INITIAL_OFFLINE_QUEUE: OfflineQueuedObservation[] = [
  {
    id: 'obs-offline-01',
    fieldLabId: 'lab-turkana',
    fieldLabName: 'Turkana Solar Aquifer Desalination',
    observationType: 'Hydrological Turbidity',
    notes: 'Micro-filtration ceramic membrane core #04 showed zero salt encrustation after 48h continuous solar run.',
    gpsCoordinates: '3.1192° N, 35.5975° E (Lodwar Basin)',
    timestamp: 'Aug 28, 2026, 08:30 AM',
    syncStatus: 'QUEUED_OFFLINE',
    photoCount: 2
  },
  {
    id: 'obs-offline-02',
    fieldLabId: 'lab-aberdare',
    fieldLabName: 'Aberdare Agroforestry & Mountain Bongo Flyway',
    observationType: 'Soil Sample',
    notes: 'Glomalin extract vial #19 extracted at 35cm depth under Podocarpus canopy.',
    gpsCoordinates: '0.4167° S, 36.6667° E (Ridge 3)',
    timestamp: 'Aug 28, 2026, 11:15 AM',
    syncStatus: 'QUEUED_OFFLINE',
    photoCount: 1
  }
];

export const OfflineFieldSyncManager: React.FC<{
  currentFieldLabId?: string;
  currentFieldLabName?: string;
}> = ({
  currentFieldLabId = 'lab-aberdare',
  currentFieldLabName = 'Aberdare Agroforestry & Mountain Bongo Flyway'
}) => {
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [queue, setQueue] = useState<OfflineQueuedObservation[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_field_offline_queue');
      return saved ? JSON.parse(saved) : INITIAL_OFFLINE_QUEUE;
    } catch {
      return INITIAL_OFFLINE_QUEUE;
    }
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [newObsType, setNewObsType] = useState<OfflineQueuedObservation['observationType']>('Soil Sample');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newGps, setNewGps] = useState<string>('0.4167° S, 36.6667° E (Aberdare Ridge)');
  const [isAddingObservation, setIsAddingObservation] = useState<boolean>(false);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('atlas_field_offline_queue', JSON.stringify(queue));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [queue]);

  const handleToggleOfflineMode = () => {
    setIsSimulatedOffline(prev => !prev);
    audioFeedback.playSubtleClick();
  };

  const handleSyncAll = () => {
    if (isSimulatedOffline) {
      audioFeedback.playMicroTick();
      alert('Cannot sync while in Offline Mode. Switch to Online Connectivity first.');
      return;
    }

    setIsSyncing(true);
    audioFeedback.playMicroTick();

    setTimeout(() => {
      setQueue(prev =>
        prev.map(item => ({
          ...item,
          syncStatus: 'SYNCED_FIRESTORE'
        }))
      );
      setIsSyncing(false);
      audioFeedback.playSuccess();
    }, 1500);
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes.trim()) return;

    const newObs: OfflineQueuedObservation = {
      id: `obs-local-${Date.now()}`,
      fieldLabId: currentFieldLabId,
      fieldLabName: currentFieldLabName,
      observationType: newObsType,
      notes: newNotes,
      gpsCoordinates: newGps,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      syncStatus: isSimulatedOffline ? 'QUEUED_OFFLINE' : 'SYNCED_FIRESTORE',
      photoCount: 1
    };

    setQueue([newObs, ...queue]);
    setNewNotes('');
    setIsAddingObservation(false);
    audioFeedback.playSuccess();
  };

  const handleDelete = (id: string) => {
    setQueue(queue.filter(q => q.id !== id));
    audioFeedback.playSubtleClick();
  };

  const queuedCount = queue.filter(q => q.syncStatus === 'QUEUED_OFFLINE').length;
  const syncedCount = queue.filter(q => q.syncStatus === 'SYNCED_FIRESTORE').length;

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#C5A059]" />
              PHASE 05 PHYSICAL INTEGRATION • LOCAL-FIRST OFFLINE SYNC GATEWAY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Field Lab Offline Synchronization Queue
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Engineered for low-bandwidth, high-latency remote wilderness deployments. Collect telemetry and field observations locally, reconciling automatically with Firestore upon link restoration.
          </p>
        </div>

        {/* Online/Offline Toggle and Sync Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleOfflineMode}
            className={`px-3.5 py-2 rounded-xs font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isSimulatedOffline
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>{isSimulatedOffline ? 'Mode: Offline (Isolated)' : 'Mode: Online (Connected)'}</span>
          </button>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing || queuedCount === 0 || isSimulatedOffline}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : `Sync Queue (${queuedCount})`}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs flex items-center justify-between">
          <span className="text-[#F5F5F0]/70">Pending Offline Logs:</span>
          <span className="text-amber-400 font-bold">{queuedCount} Records</span>
        </div>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs flex items-center justify-between">
          <span className="text-[#F5F5F0]/70">Synced to Firestore:</span>
          <span className="text-emerald-400 font-bold">{syncedCount} Reconciled</span>
        </div>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs flex items-center justify-between">
          <span className="text-[#F5F5F0]/70">Storage Engine:</span>
          <span className="text-[#8FB8DE] font-bold">IndexedDB Local Cache</span>
        </div>
      </div>

      {/* Record New Field Observation Form Trigger */}
      {!isAddingObservation ? (
        <button
          onClick={() => {
            setIsAddingObservation(true);
            audioFeedback.playSubtleClick();
          }}
          className="w-full py-2.5 bg-[#161616] hover:bg-[#202020] border border-dashed border-[#C5A059]/50 text-[#C5A059] font-mono text-xs font-bold rounded-xs cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Field Observation in Local Offline Queue</span>
        </button>
      ) : (
        <form onSubmit={handleAddObservation} className="p-4 bg-[#141414] border border-[#C5A059] rounded-xs space-y-3 font-mono text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <span className="text-xs uppercase text-[#C5A059] font-bold">
              New Field Observation Record
            </span>
            <button
              type="button"
              onClick={() => setIsAddingObservation(false)}
              className="text-[#F5F5F0]/50 hover:text-[#F5F5F0]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-[#F5F5F0]/60 mb-1">Observation Type:</label>
              <select
                value={newObsType}
                onChange={(e) => setNewObsType(e.target.value as any)}
                className="w-full bg-[#1c1c1c] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
              >
                <option value="Soil Sample">Soil Sample (Glomalin/Humus)</option>
                <option value="Hydrological Turbidity">Hydrological Turbidity & Siltation</option>
                <option value="Acoustic Audio">Bio-Acoustic Faunal Flyway</option>
                <option value="Bio-Swale Integrity">Bio-Swale & Riparian Terrace Inspection</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#F5F5F0]/60 mb-1">GPS Coordinates:</label>
              <input
                type="text"
                value={newGps}
                onChange={(e) => setNewGps(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#F5F5F0]/60 mb-1">Observation Notes & Sensor Log:</label>
            <textarea
              required
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Record exact field notes, test tube reagent levels, or bio-swale vegetative status..."
              className="w-full bg-[#1c1c1c] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none font-serif text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase rounded-xs cursor-pointer shadow"
            >
              Commit to Local Offline Storage
            </button>
          </div>
        </form>
      )}

      {/* Observation Queue Table */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-[#C5A059] font-bold block">
          Current Observations in Local-First Queue:
        </span>

        <div className="space-y-2.5">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-[#F5F5F0]">
                    {item.observationType}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-xs font-bold ${
                      item.syncStatus === 'SYNCED_FIRESTORE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {item.syncStatus === 'SYNCED_FIRESTORE' ? '✓ Synced to Firestore' : '⏳ Queued Locally'}
                  </span>
                  <span className="text-[10px] font-mono text-[#C5A059]">
                    {item.fieldLabName}
                  </span>
                </div>

                <p className="text-xs font-serif text-[#F5F5F0]/80 leading-relaxed">
                  "{item.notes}"
                </p>

                <div className="flex items-center gap-3 text-[10px] font-mono text-[#F5F5F0]/50 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A059]" /> {item.gpsCoordinates}
                  </span>
                  <span>• Logged {item.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 hover:bg-[#222] rounded-xs text-[#F5F5F0]/40 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove from Local Queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
