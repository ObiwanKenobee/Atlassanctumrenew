// ============================================================================
// ATLAS SANCTUM - INDEXEDDB OFFLINE STORAGE & WRITE-AHEAD CACHE ENGINE
// ============================================================================
// Provides durable, browser-local persistence for all platform mutations,
// offline queues, and local collections when offline or in Forced Offline Mode.

const DB_NAME = 'atlas_sanctum_offline_db';
const DB_VERSION = 1;

export interface PendingWrite {
  id: string;
  collection: string;
  opType: 'set' | 'add' | 'update' | 'delete';
  docId?: string;
  data: any;
  timestamp: number;
  synced: boolean;
  error?: string;
}

export interface CachedDoc {
  collection: string;
  docId: string;
  data: any;
  updatedAt: number;
}

class IndexedDbStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isForceOffline: boolean = false;

  constructor() {
    // Initialize force offline state from localStorage
    try {
      const stored = localStorage.getItem('atlas_sanctum_force_offline');
      this.isForceOffline = stored === 'true';
    } catch {
      this.isForceOffline = false;
    }
  }

  private async openDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not available in this environment.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Pending mutations queue for background sync
        if (!db.objectStoreNames.contains('pending_writes')) {
          const writeStore = db.createObjectStore('pending_writes', { keyPath: 'id' });
          writeStore.createIndex('by_collection', 'collection', { unique: false });
          writeStore.createIndex('by_timestamp', 'timestamp', { unique: false });
        }

        // 2. Cached collections documents
        if (!db.objectStoreNames.contains('cached_documents')) {
          const docStore = db.createObjectStore('cached_documents', { keyPath: 'compositeKey' });
          docStore.createIndex('by_collection', 'collection', { unique: false });
        }

        // 3. Key-Value configuration store
        if (!db.objectStoreNames.contains('key_value_store')) {
          db.createObjectStore('key_value_store', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // -------------------------------------------------------------
  // FORCE OFFLINE STATE MANAGEMENT
  // -------------------------------------------------------------

  public getIsForceOffline(): boolean {
    return this.isForceOffline;
  }

  public setForceOffline(enabled: boolean): void {
    this.isForceOffline = enabled;
    try {
      localStorage.setItem('atlas_sanctum_force_offline', enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('localStorage access error:', e);
    }
    // Dispatch global event for listeners
    window.dispatchEvent(new CustomEvent('atlas-offline-mode-changed', { 
      detail: { isForceOffline: enabled, isOnline: !enabled && navigator.onLine } 
    }));
  }

  public isEffectivelyOffline(): boolean {
    if (this.isForceOffline) return true;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
    return false;
  }

  // -------------------------------------------------------------
  // PENDING WRITES QUEUE (WRITE-AHEAD LOG)
  // -------------------------------------------------------------

  public async queueWrite(
    collection: string,
    opType: 'set' | 'add' | 'update' | 'delete',
    data: any,
    docId?: string
  ): Promise<string> {
    const db = await this.openDb();
    const id = `write_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const effectiveDocId = docId || data?.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const pendingItem: PendingWrite = {
      id,
      collection,
      opType,
      docId: effectiveDocId,
      data: { ...data, id: effectiveDocId },
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['pending_writes', 'cached_documents'], 'readwrite');
      const writeStore = tx.objectStore('pending_writes');
      const docStore = tx.objectStore('cached_documents');

      writeStore.put(pendingItem);

      // Also update local cache store immediately
      const compositeKey = `${collection}_${effectiveDocId}`;
      if (opType === 'delete') {
        docStore.delete(compositeKey);
      } else {
        docStore.put({
          compositeKey,
          collection,
          docId: effectiveDocId,
          data: { ...data, id: effectiveDocId },
          updatedAt: Date.now()
        });
      }

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('atlas-pending-writes-updated'));
        resolve(effectiveDocId);
      };

      tx.onerror = () => {
        reject(tx.error);
      };
    });
  }

  public async getPendingWrites(): Promise<PendingWrite[]> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('pending_writes', 'readonly');
      const store = tx.objectStore('pending_writes');
      const req = store.getAll();

      req.onsuccess = () => {
        resolve(req.result || []);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  public async removePendingWrite(id: string): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('pending_writes', 'readwrite');
      const store = tx.objectStore('pending_writes');
      store.delete(id);

      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent('atlas-pending-writes-updated'));
        resolve();
      };

      tx.onerror = () => reject(tx.error);
    });
  }

  // -------------------------------------------------------------
  // CACHED DOCUMENTS STORE
  // -------------------------------------------------------------

  public async cacheDocument(collection: string, docId: string, data: any): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cached_documents', 'readwrite');
      const store = tx.objectStore('cached_documents');
      const compositeKey = `${collection}_${docId}`;
      store.put({
        compositeKey,
        collection,
        docId,
        data: { ...data, id: docId },
        updatedAt: Date.now()
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async cacheCollection(collection: string, docs: any[]): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cached_documents', 'readwrite');
      const store = tx.objectStore('cached_documents');

      docs.forEach(doc => {
        if (!doc.id) return;
        const compositeKey = `${collection}_${doc.id}`;
        store.put({
          compositeKey,
          collection,
          docId: doc.id,
          data: doc,
          updatedAt: Date.now()
        });
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getCachedCollection(collectionName: string): Promise<any[]> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cached_documents', 'readonly');
      const store = tx.objectStore('cached_documents');
      const index = store.index('by_collection');
      const req = index.getAll(collectionName);

      req.onsuccess = () => {
        const results = req.result || [];
        resolve(results.map(r => r.data));
      };

      req.onerror = () => reject(req.error);
    });
  }

  public async getCachedDoc(collectionName: string, docId: string): Promise<any | null> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cached_documents', 'readonly');
      const store = tx.objectStore('cached_documents');
      const req = store.get(`${collectionName}_${docId}`);

      req.onsuccess = () => {
        resolve(req.result ? req.result.data : null);
      };

      req.onerror = () => reject(req.error);
    });
  }
}

export const offlineStorage = new IndexedDbStorageService();
