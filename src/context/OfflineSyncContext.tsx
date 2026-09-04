import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { offlineStorage, PendingWrite } from '../lib/indexedDbStorage';
import { audioFeedback } from '../lib/audioFeedback';
import { db } from '../lib/db';

export interface OfflineActivityItem {
  id: string;
  timestamp: string;
  type: 'telemetry' | 'verification' | 'parameter' | 'ledger' | 'query' | 'interaction';
  title: string;
  details?: string;
  payload?: any;
  status: 'queued' | 'synced' | 'failed';
  syncedAt?: string;
}

interface OfflineSyncContextType {
  isForceOffline: boolean;
  isOnline: boolean;
  pendingWritesCount: number;
  pendingWrites: PendingWrite[];
  isSyncing: boolean;
  lastSyncTime: Date | null;
  activityLog: OfflineActivityItem[];
  toggleForceOffline: () => void;
  setForceOfflineState: (forced: boolean) => void;
  syncPendingWritesNow: () => Promise<{ success: number; failed: number }>;
  recordOfflineActivity: (item: Omit<OfflineActivityItem, 'id' | 'timestamp' | 'status'>) => void;
  syncMissedActivity: (id: string) => Promise<boolean>;
  syncAllMissedActivities: () => Promise<{ synced: number; failed: number }>;
  clearActivityLog: () => void;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | null>(null);

const ACTIVITY_STORAGE_KEY = 'atlas_offline_activity_log';

export const OfflineSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isForceOffline, setIsForceOffline] = useState<boolean>(offlineStorage.getIsForceOffline());
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine && !offlineStorage.getIsForceOffline() : true
  );
  const [pendingWrites, setPendingWrites] = useState<PendingWrite[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Persistent Offline Activity Log
  const [activityLog, setActivityLog] = useState<OfflineActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading offline activity log from localStorage:', e);
    }
    return [
      {
        id: 'init-activity-log-01',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'telemetry',
        title: 'Cached Rift Valley Soil Spectroscopy Reading',
        details: 'Stored 3.84% SOC baseline in local encrypted IndexedDB ledger.',
        status: 'synced',
        syncedAt: new Date().toISOString()
      }
    ];
  });

  // Save activity log to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activityLog));
    } catch (e) {
      console.warn('Failed to save offline activity log:', e);
    }
  }, [activityLog]);

  // Refresh pending count
  const refreshPendingWrites = useCallback(async () => {
    try {
      const list = await offlineStorage.getPendingWrites();
      setPendingWrites(list);
    } catch (e) {
      console.warn('Error reading pending writes from IndexedDB:', e);
    }
  }, []);

  // Update online/offline states
  const updateStatus = useCallback(() => {
    const forced = offlineStorage.getIsForceOffline();
    setIsForceOffline(forced);
    const online = typeof navigator !== 'undefined' ? navigator.onLine && !forced : !forced;
    setIsOnline(online);
  }, []);

  // Record an offline activity when an action occurs during network interruption
  const recordOfflineActivity = useCallback((item: Omit<OfflineActivityItem, 'id' | 'timestamp' | 'status'>) => {
    const newActivity: OfflineActivityItem = {
      ...item,
      id: `act-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      status: 'queued'
    };

    setActivityLog(prev => [newActivity, ...prev]);
    audioFeedback.playWarningPulse();
  }, []);

  // Synchronize a specific missed interaction
  const syncMissedActivity = useCallback(async (id: string): Promise<boolean> => {
    const target = activityLog.find(a => a.id === id);
    if (!target) return false;

    // Simulate backend payload delivery if payload has a designated collection
    if (target.payload && target.payload.collection) {
      try {
        await db.set(target.payload.collection, target.payload.docId || target.id, target.payload.data || target.payload, true);
      } catch (err) {
        console.warn('Failed syncing payload to db:', err);
      }
    }

    setActivityLog(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'synced',
      syncedAt: new Date().toISOString()
    } : a));

    return true;
  }, [activityLog]);

  // Synchronize all missed interactions upon restoration
  const syncAllMissedActivities = useCallback(async (): Promise<{ synced: number; failed: number }> => {
    let synced = 0;
    let failed = 0;

    const queued = activityLog.filter(a => a.status === 'queued');
    for (const item of queued) {
      try {
        if (item.payload && item.payload.collection) {
          await db.set(item.payload.collection, item.payload.docId || item.id, item.payload.data || item.payload, true);
        }
        synced++;
      } catch (err) {
        console.error('Failed syncing activity item:', item.id, err);
        failed++;
      }
    }

    setActivityLog(prev => prev.map(a => a.status === 'queued' ? {
      ...a,
      status: 'synced',
      syncedAt: new Date().toISOString()
    } : a));

    return { synced, failed };
  }, [activityLog]);

  const clearActivityLog = useCallback(() => {
    setActivityLog([]);
    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing activity log from storage:', e);
    }
  }, []);

  // Synchronize all pending IndexedDB writes to Firestore
  const syncPendingWritesNow = useCallback(async (): Promise<{ success: number; failed: number }> => {
    if (offlineStorage.getIsForceOffline() || !navigator.onLine) {
      return { success: 0, failed: 0 };
    }

    setIsSyncing(true);
    let success = 0;
    let failed = 0;

    try {
      const pending = await offlineStorage.getPendingWrites();
      for (const item of pending) {
        try {
          if (item.opType === 'add') {
            await db.set(item.collection, item.docId || item.data.id, item.data, true);
          } else if (item.opType === 'set') {
            await db.set(item.collection, item.docId || item.data.id, item.data, true);
          } else if (item.opType === 'update') {
            await db.update(item.collection, item.docId || item.data.id, item.data);
          } else if (item.opType === 'delete') {
            await db.delete(item.collection, item.docId || item.data.id);
          }
          await offlineStorage.removePendingWrite(item.id);
          success++;
        } catch (itemErr) {
          console.error(`Failed to sync write ${item.id} to ${item.collection}:`, itemErr);
          failed++;
        }
      }

      setLastSyncTime(new Date());
      await refreshPendingWrites();
      await syncAllMissedActivities();

      if (success > 0) {
        audioFeedback.playSyncComplete();
      }
    } catch (e) {
      console.error('Batch sync error:', e);
    } finally {
      setIsSyncing(false);
    }

    return { success, failed };
  }, [refreshPendingWrites, syncAllMissedActivities]);

  // Set Force Offline
  const setForceOfflineState = useCallback((forced: boolean) => {
    offlineStorage.setForceOffline(forced);
    setIsForceOffline(forced);
    updateStatus();

    if (forced) {
      audioFeedback.playBell([350, 290], 0.3, 'sine', 0.6);
      recordOfflineActivity({
        type: 'interaction',
        title: 'Simulation: Offline Mode Activated',
        details: 'Switched to local indexedDB resilience mode. Network traffic suspended.'
      });
    } else {
      audioFeedback.playCovenantResonance();
      recordOfflineActivity({
        type: 'interaction',
        title: 'Network Reconnection Triggered',
        details: 'Restoring real-time Firestore synchronization and clearing queued writes.'
      });
      // Attempt auto-drain
      setTimeout(() => {
        syncPendingWritesNow();
      }, 500);
    }
  }, [updateStatus, syncPendingWritesNow, recordOfflineActivity]);

  const toggleForceOffline = useCallback(() => {
    setForceOfflineState(!isForceOffline);
  }, [isForceOffline, setForceOfflineState]);

  useEffect(() => {
    updateStatus();
    refreshPendingWrites();

    const handleNetworkChange = () => {
      updateStatus();
      if (navigator.onLine && !offlineStorage.getIsForceOffline()) {
        syncPendingWritesNow();
      } else {
        recordOfflineActivity({
          type: 'interaction',
          title: 'Network Interrupted: Offline Buffer Engaged',
          details: 'Subsequent changes will be stored locally in IndexedDB until connectivity returns.'
        });
      }
    };

    const handlePendingChange = () => {
      refreshPendingWrites();
    };

    const handleModeChange = (e: any) => {
      setIsForceOffline(e.detail.isForceOffline);
      setIsOnline(e.detail.isOnline);
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    window.addEventListener('atlas-pending-writes-updated', handlePendingChange);
    window.addEventListener('atlas-offline-mode-changed', handleModeChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      window.removeEventListener('atlas-pending-writes-updated', handlePendingChange);
      window.removeEventListener('atlas-offline-mode-changed', handleModeChange);
    };
  }, [updateStatus, refreshPendingWrites, syncPendingWritesNow, recordOfflineActivity]);

  return (
    <OfflineSyncContext.Provider
      value={{
        isForceOffline,
        isOnline,
        pendingWritesCount: pendingWrites.length,
        pendingWrites,
        isSyncing,
        lastSyncTime,
        activityLog,
        toggleForceOffline,
        setForceOfflineState,
        syncPendingWritesNow,
        recordOfflineActivity,
        syncMissedActivity,
        syncAllMissedActivities,
        clearActivityLog
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return context;
};
