import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { offlineStorage, PendingWrite } from '../lib/indexedDbStorage';
import { audioFeedback } from '../lib/audioFeedback';
import { db } from '../lib/db';

interface OfflineSyncContextType {
  isForceOffline: boolean;
  isOnline: boolean;
  pendingWritesCount: number;
  pendingWrites: PendingWrite[];
  isSyncing: boolean;
  lastSyncTime: Date | null;
  toggleForceOffline: () => void;
  setForceOfflineState: (forced: boolean) => void;
  syncPendingWritesNow: () => Promise<{ success: number; failed: number }>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | null>(null);

export const OfflineSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isForceOffline, setIsForceOffline] = useState<boolean>(offlineStorage.getIsForceOffline());
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine && !offlineStorage.getIsForceOffline() : true
  );
  const [pendingWrites, setPendingWrites] = useState<PendingWrite[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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

      if (success > 0) {
        audioFeedback.playSyncComplete();
      }
    } catch (e) {
      console.error('Batch sync error:', e);
    } finally {
      setIsSyncing(false);
    }

    return { success, failed };
  }, [refreshPendingWrites]);

  // Set Force Offline
  const setForceOfflineState = useCallback((forced: boolean) => {
    offlineStorage.setForceOffline(forced);
    setIsForceOffline(forced);
    updateStatus();

    if (forced) {
      audioFeedback.playBell([350, 290], 0.3, 'sine', 0.6);
    } else {
      audioFeedback.playCovenantResonance();
      // Attempt auto-drain
      setTimeout(() => {
        syncPendingWritesNow();
      }, 500);
    }
  }, [updateStatus, syncPendingWritesNow]);

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
  }, [updateStatus, refreshPendingWrites, syncPendingWritesNow]);

  return (
    <OfflineSyncContext.Provider
      value={{
        isForceOffline,
        isOnline,
        pendingWritesCount: pendingWrites.length,
        pendingWrites,
        isSyncing,
        lastSyncTime,
        toggleForceOffline,
        setForceOfflineState,
        syncPendingWritesNow
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
