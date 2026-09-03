import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  FirestoreDataConverter,
  DocumentData,
  QueryConstraint
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { offlineStorage } from "./indexedDbStorage";

// Error Operation Enum adhering to Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global App & Auth initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Database instance initialized with explicit databaseId
export const firestoreInstance = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Helper function to create standardized errors adhering to the Firebase skill
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// TYPED COLLECTIONS AND SCHEMAS
// -------------------------------------------------------------

export interface ProvenanceRecord {
  id: string;
  source: string;
  sourceType: 'satellite_telemetry' | 'iot_sensor_mesh' | 'field_audit' | 'peer_reviewed_model' | 'community_reporting';
  collectedAt: string | Timestamp;
  calculationMethod: string;
  certaintyScore: number; // 0 - 100
  verifier: string;
  verifierRole: string;
  cryptographicHash: string;
  assumptions: string[];
  lastAudited: string | Timestamp;
  datasetName?: string;
  spatialResolution?: string;
  governanceEntity?: string;
  epistemicTier?: 'primary_instrument' | 'consensus_model' | 'derivative_heuristic';
  createdAt?: any;
  updatedAt?: any;
}

export interface MoralAuditLog {
  id?: string;
  userId: string;
  userEmail?: string | null;
  action: string;
  feature: 'moral_intelligence' | 'simulator' | 'live_voice' | 'multimodal_generation' | 'asset_tokenization' | 'telemetry_calibration' | 'governance_vote';
  impactTier: 'low' | 'moderate' | 'high' | 'civilizational_critical';
  moralAlignmentScore?: number;
  parameters: Record<string, any>;
  ethicalNotes?: string;
  timestamp: any;
}

export interface UserProfileDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: string;
  accessLevel?: 'visitor' | 'researcher' | 'steward' | 'systems_architect' | 'council_admin';
  themePreference?: 'dark' | 'solarized' | 'biophilic_night' | 'light' | 'high_contrast' | 'system';
  highContrast?: boolean;
  reducedMotion?: boolean;
  telemetryStreamActive?: boolean;
  ethicalReviewNotification?: boolean;
  sabbathModeActive?: boolean;
  createdAt: any;
  lastLoginAt: any;
  updatedAt?: any;
}

export interface FieldLabNote {
  id?: string;
  labId: string;
  labName: string;
  location?: string;
  coordinates?: [number, number];
  elevation?: string;
  bioregionGrid?: string;
  author: string;
  authorRole?: string;
  audioDurationSeconds?: number;
  transcript: string;
  keyTakeaways?: string[];
  fieldObservations?: string;
  tags?: string[];
  missionTags?: string[];
  certaintyLevel?: 'observed' | 'measured' | 'anecdotal';
  cryptographicHash?: string;
  recordedAt: string | any;
  syncedToFirestore?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface BioregionalGoal {
  id: string;
  bioregionId: string;
  bioregionName: string;
  title: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: 'canopy_cover' | 'aquifer_health' | 'soil_carbon' | 'biodiversity' | 'microclimate' | 'zero_waste';
  status: 'on_track' | 'lagging' | 'accelerating' | 'achieved';
  deadlineYear: number;
  baselineYear: number;
  baselineValue: number;
  leadSteward: string;
  stewardRole?: string;
  lastUpdated: number | string;
  description: string;
  interventionActions?: string[];
  verificationSensorType?: string;
  moralAlignmentScore?: number;
  trajectoryProgress?: number; // 0 - 100
  createdAt?: any;
  updatedAt?: any;
}

// Human Flourishing & Epistemic Impact Records (Longitudinal Telemetry)
export interface ImpactRecord {
  id: string;
  date: string; // e.g. "2023-Q1", "2024-Q1", "2025-Q2", "2026-Q1"
  timestamp: number;
  healthAndVitality: number; // 0 - 100
  cognitiveAgency: number; // 0 - 100
  socialCohesion: number; // 0 - 100
  meaningAndPurpose: number; // 0 - 100
  ecologicalHarmony: number; // 0 - 100
  materialSecurity: number; // 0 - 100
  compositeScore: number; // 0 - 100
  notes?: string;
  bioregion?: string;
  verifiedSourceCount?: number;
  cryptographicHash?: string;
  isProjected?: boolean;
  confidenceInterval?: [number, number];
  createdAt?: any;
  updatedAt?: any;
}

// Converter helper
const genericConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore(data: T): DocumentData {
    return data;
  },
  fromFirestore(snapshot: any, options: any): T {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as T;
  },
});

// -------------------------------------------------------------
// TYPED CRUD INTERFACE FOR DB WITH OFFLINE INTERCEPTION
// -------------------------------------------------------------

export const db = {
  // Direct raw instance
  instance: firestoreInstance,

  // 1. Generic Document Operations with IndexedDB write-ahead caching
  async get<T extends DocumentData>(collectionPath: string, docId: string): Promise<T | null> {
    if (offlineStorage.isEffectivelyOffline()) {
      const cached = await offlineStorage.getCachedDoc(collectionPath, docId);
      if (cached) return cached as T;
    }

    try {
      const docRef = doc(firestoreInstance, collectionPath, docId).withConverter(genericConverter<T>());
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        const cached = await offlineStorage.getCachedDoc(collectionPath, docId);
        return cached ? (cached as T) : null;
      }
      const data = snap.data();
      // Cache to IndexedDB for offline resilience
      offlineStorage.cacheDocument(collectionPath, docId, data).catch(() => {});
      return data;
    } catch (err) {
      const cached = await offlineStorage.getCachedDoc(collectionPath, docId);
      if (cached) return cached as T;
      handleFirestoreError(err, OperationType.GET, `${collectionPath}/${docId}`);
    }
  },

  async set<T extends DocumentData>(collectionPath: string, docId: string, data: T, merge = true): Promise<void> {
    // If forced offline or network offline, write directly to IndexedDB
    if (offlineStorage.isEffectivelyOffline()) {
      await offlineStorage.queueWrite(collectionPath, 'set', data, docId);
      return;
    }

    try {
      const docRef = doc(firestoreInstance, collectionPath, docId);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
      offlineStorage.cacheDocument(collectionPath, docId, data).catch(() => {});
    } catch (err) {
      console.warn('Firestore write failed, caching to IndexedDB offline queue:', err);
      await offlineStorage.queueWrite(collectionPath, 'set', data, docId);
    }
  },

  async add<T extends DocumentData>(collectionPath: string, data: T): Promise<string> {
    // If forced offline or network offline, write directly to IndexedDB
    if (offlineStorage.isEffectivelyOffline()) {
      return await offlineStorage.queueWrite(collectionPath, 'add', data);
    }

    try {
      const colRef = collection(firestoreInstance, collectionPath);
      const res = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
      offlineStorage.cacheDocument(collectionPath, res.id, { ...data, id: res.id }).catch(() => {});
      return res.id;
    } catch (err) {
      console.warn('Firestore addDoc failed, caching to IndexedDB offline queue:', err);
      return await offlineStorage.queueWrite(collectionPath, 'add', data);
    }
  },

  async update<T extends DocumentData>(collectionPath: string, docId: string, data: Partial<T>): Promise<void> {
    if (offlineStorage.isEffectivelyOffline()) {
      await offlineStorage.queueWrite(collectionPath, 'update', data, docId);
      return;
    }

    try {
      const docRef = doc(firestoreInstance, collectionPath, docId);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() } as any);
      offlineStorage.cacheDocument(collectionPath, docId, data).catch(() => {});
    } catch (err) {
      console.warn('Firestore update failed, caching to IndexedDB offline queue:', err);
      await offlineStorage.queueWrite(collectionPath, 'update', data, docId);
    }
  },

  async delete(collectionPath: string, docId: string): Promise<void> {
    if (offlineStorage.isEffectivelyOffline()) {
      await offlineStorage.queueWrite(collectionPath, 'delete', {}, docId);
      return;
    }

    try {
      const docRef = doc(firestoreInstance, collectionPath, docId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore delete failed, caching to IndexedDB offline queue:', err);
      await offlineStorage.queueWrite(collectionPath, 'delete', {}, docId);
    }
  },

  async query<T extends DocumentData>(collectionPath: string, ...constraints: QueryConstraint[]): Promise<T[]> {
    if (offlineStorage.isEffectivelyOffline()) {
      const cached = await offlineStorage.getCachedCollection(collectionPath);
      return cached as T[];
    }

    try {
      const colRef = collection(firestoreInstance, collectionPath).withConverter(genericConverter<T>());
      const q = query(colRef, ...constraints);
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(docSnap => docSnap.data());
      offlineStorage.cacheCollection(collectionPath, items).catch(() => {});
      return items;
    } catch (err) {
      const cached = await offlineStorage.getCachedCollection(collectionPath);
      if (cached.length > 0) return cached as T[];
      handleFirestoreError(err, OperationType.LIST, collectionPath);
    }
  },

  subscribeDoc<T extends DocumentData>(
    collectionPath: string, 
    docId: string, 
    onNext: (data: T | null) => void,
    onError?: (err: any) => void
  ): () => void {
    const docRef = doc(firestoreInstance, collectionPath, docId).withConverter(genericConverter<T>());
    return onSnapshot(
      docRef,
      (snap) => {
        onNext(snap.exists() ? snap.data() : null);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, `${collectionPath}/${docId}`);
      }
    );
  },

  subscribeCollection<T extends DocumentData>(
    collectionPath: string,
    onNext: (items: T[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (err: any) => void
  ): () => void {
    const colRef = collection(firestoreInstance, collectionPath).withConverter(genericConverter<T>());
    const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(d => d.data());
        onNext(items);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      }
    );
  },

  // -------------------------------------------------------------
  // HIGH-LEVEL DOMAIN SERVICES
  // -------------------------------------------------------------

  // 1. Provenance Data Repository
  provenance: {
    async getById(recordId: string): Promise<ProvenanceRecord | null> {
      return db.get<ProvenanceRecord>('provenance_data', recordId);
    },
    
    async create(record: Omit<ProvenanceRecord, 'id'> & { id?: string }): Promise<string> {
      const validation = validateProvenanceRecord(record);
      if (!validation.isValid) {
        throw new Error(`Provenance validation failed: ${validation.errors.join(', ')}`);
      }
      if (record.id) {
        await db.set<ProvenanceRecord>('provenance_data', record.id, record as ProvenanceRecord);
        return record.id;
      }
      return db.add<ProvenanceRecord>('provenance_data', record as any);
    },

    async fetchAndValidate(recordId: string): Promise<{ record: ProvenanceRecord | null; isValid: boolean; errors: string[] }> {
      const record = await db.get<ProvenanceRecord>('provenance_data', recordId);
      if (!record) {
        return { record: null, isValid: false, errors: ['Provenance record not found'] };
      }
      const validation = validateProvenanceRecord(record);
      return { record, isValid: validation.isValid, errors: validation.errors };
    },

    async listAll(): Promise<ProvenanceRecord[]> {
      return db.query<ProvenanceRecord>('provenance_data', orderBy('certaintyScore', 'desc'), limit(50));
    }
  },

  // 2. Moral Intelligence Audit Logging Service
  audit: {
    async logInteraction(entry: {
      action: string;
      feature: MoralAuditLog['feature'];
      impactTier: MoralAuditLog['impactTier'];
      moralAlignmentScore?: number;
      parameters?: Record<string, any>;
      ethicalNotes?: string;
    }): Promise<string> {
      const currentUser = auth.currentUser;
      const logPayload: MoralAuditLog = {
        userId: currentUser ? currentUser.uid : 'anonymous_observer',
        userEmail: currentUser?.email || 'unauthenticated',
        action: entry.action,
        feature: entry.feature,
        impactTier: entry.impactTier,
        moralAlignmentScore: entry.moralAlignmentScore ?? 95,
        parameters: entry.parameters || {},
        ethicalNotes: entry.ethicalNotes || 'Executed under epistemic transparency standards.',
        timestamp: serverTimestamp(),
      };

      try {
        const colRef = collection(firestoreInstance, 'moral_audit_logs');
        const res = await addDoc(colRef, logPayload);
        return res.id;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'moral_audit_logs');
      }
    },

    async getRecentLogs(limitCount = 20): Promise<MoralAuditLog[]> {
      return db.query<MoralAuditLog>('moral_audit_logs', orderBy('timestamp', 'desc'), limit(limitCount));
    }
  },

  // 3. User Profile & Platform Settings Synchronization
  userProfile: {
    async getProfile(uid: string): Promise<UserProfileDoc | null> {
      return db.get<UserProfileDoc>('users', uid);
    },

    async updateSettings(uid: string, settings: Partial<Pick<UserProfileDoc, 'themePreference' | 'accessLevel' | 'reducedMotion' | 'telemetryStreamActive' | 'ethicalReviewNotification'>>): Promise<void> {
      return db.update<UserProfileDoc>('users', uid, settings);
    },

    subscribeProfile(uid: string, onUpdate: (profile: UserProfileDoc | null) => void): () => void {
      return db.subscribeDoc<UserProfileDoc>('users', uid, onUpdate);
    }
  },

  // 4. Living Field Lab Notes & Transcripts
  fieldNotes: {
    async create(note: Omit<FieldLabNote, 'id'>): Promise<string> {
      return db.add<FieldLabNote>('field_lab_notes', {
        ...note,
        recordedAt: note.recordedAt || new Date().toISOString(),
        syncedToFirestore: true
      });
    },

    async listByLab(labId: string, limitCount = 30): Promise<FieldLabNote[]> {
      try {
        return await db.query<FieldLabNote>(
          'field_lab_notes', 
          where('labId', '==', labId), 
          orderBy('createdAt', 'desc'), 
          limit(limitCount)
        );
      } catch (err) {
        // Fallback without compound index constraint if needed
        return await db.query<FieldLabNote>('field_lab_notes', where('labId', '==', labId), limit(limitCount));
      }
    },

    subscribeByLab(labId: string, onUpdate: (notes: FieldLabNote[]) => void, onError?: (err: any) => void): () => void {
      return db.subscribeCollection<FieldLabNote>(
        'field_lab_notes',
        (items) => {
          const sorted = [...items].sort((a, b) => {
            const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.recordedAt || 0).getTime();
            const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.recordedAt || 0).getTime();
            return timeB - timeA;
          });
          onUpdate(sorted);
        },
        [where('labId', '==', labId)],
        onError
      );
    }
  },

  // 5. Human Flourishing & Epistemic Impact Records (Longitudinal Telemetry)
  impactRecords: {
    async list(): Promise<ImpactRecord[]> {
      const records = await db.query<ImpactRecord>('impact_records', orderBy('timestamp', 'asc'));
      if (records && records.length > 0) {
        return records;
      }
      return this.getInitialSeedRecords();
    },

    async create(record: Omit<ImpactRecord, 'id'> & { id?: string }): Promise<string> {
      const id = record.id || `imp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const payload: ImpactRecord = {
        ...record,
        id,
        timestamp: record.timestamp || Date.now(),
        cryptographicHash: record.cryptographicHash || `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      };
      await db.set<ImpactRecord>('impact_records', id, payload, true);
      return id;
    },

    subscribe(onUpdate: (records: ImpactRecord[]) => void, onError?: (err: any) => void): () => void {
      const unsubscribe = db.subscribeCollection<ImpactRecord>(
        'impact_records',
        (items) => {
          if (!items || items.length === 0) {
            onUpdate(this.getInitialSeedRecords());
          } else {
            const sorted = [...items].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            onUpdate(sorted);
          }
        },
        [],
        (err) => {
          if (onError) onError(err);
          // Fallback to seeds on network restriction
          onUpdate(this.getInitialSeedRecords());
        }
      );
      return unsubscribe;
    },

    getInitialSeedRecords(): ImpactRecord[] {
      return [
        {
          id: 'imp-2023-q1',
          date: '2023 Q1',
          timestamp: 1672531200000,
          healthAndVitality: 58.2,
          cognitiveAgency: 61.4,
          socialCohesion: 54.0,
          meaningAndPurpose: 62.1,
          ecologicalHarmony: 48.6,
          materialSecurity: 52.3,
          compositeScore: 56.1,
          bioregion: 'Global / East Africa Baseline',
          verifiedSourceCount: 42,
          notes: 'Baseline audit prior to Atlas Sanctum bioregional decentralized infrastructure deployment.',
          cryptographicHash: '0x3a88c0192eab1182'
        },
        {
          id: 'imp-2023-q2',
          date: '2023 Q2',
          timestamp: 1680307200000,
          healthAndVitality: 60.1,
          cognitiveAgency: 62.8,
          socialCohesion: 56.4,
          meaningAndPurpose: 63.5,
          ecologicalHarmony: 50.2,
          materialSecurity: 54.0,
          compositeScore: 57.8,
          bioregion: 'Upper Athi & Mara Basin',
          verifiedSourceCount: 68,
          notes: 'Initial community assembly ratification and youth guild mobilization.',
          cryptographicHash: '0x4f12d88190ba329c'
        },
        {
          id: 'imp-2023-q3',
          date: '2023 Q3',
          timestamp: 1688169600000,
          healthAndVitality: 62.7,
          cognitiveAgency: 64.9,
          socialCohesion: 59.1,
          meaningAndPurpose: 65.2,
          ecologicalHarmony: 53.4,
          materialSecurity: 56.8,
          compositeScore: 60.3,
          bioregion: 'East African Rift',
          verifiedSourceCount: 114,
          notes: 'Solar RO water and micro-sanitation modules deployed in pilot zones.',
          cryptographicHash: '0x6e902b11ff83ac71'
        },
        {
          id: 'imp-2023-q4',
          date: '2023 Q4',
          timestamp: 1696118400000,
          healthAndVitality: 65.4,
          cognitiveAgency: 67.2,
          socialCohesion: 62.5,
          meaningAndPurpose: 67.8,
          ecologicalHarmony: 57.1,
          materialSecurity: 59.4,
          compositeScore: 63.2,
          bioregion: 'East Africa / Global',
          verifiedSourceCount: 180,
          notes: 'Multi-strata agroforestry expansion and living soil microbial inoculations.',
          cryptographicHash: '0x88bb301824ac9910'
        },
        {
          id: 'imp-2024-q1',
          date: '2024 Q1',
          timestamp: 1704067200000,
          healthAndVitality: 68.9,
          cognitiveAgency: 70.1,
          socialCohesion: 66.8,
          meaningAndPurpose: 71.0,
          ecologicalHarmony: 61.5,
          materialSecurity: 63.2,
          compositeScore: 66.9,
          bioregion: 'Mara Watershed & Turkana',
          verifiedSourceCount: 245,
          notes: 'Zero waterborne disease outbreaks in all LifePod deployment clusters.',
          cryptographicHash: '0x99cc418290bc4412'
        },
        {
          id: 'imp-2024-q2',
          date: '2024 Q2',
          timestamp: 1711929600000,
          healthAndVitality: 72.4,
          cognitiveAgency: 73.0,
          socialCohesion: 70.2,
          meaningAndPurpose: 74.3,
          ecologicalHarmony: 66.0,
          materialSecurity: 67.1,
          compositeScore: 70.5,
          bioregion: 'Urban Informal Settlements',
          verifiedSourceCount: 320,
          notes: 'Decentralized circular waste-to-energy dividends distributed to youth collectives.',
          cryptographicHash: '0xaabb551982cd6610'
        },
        {
          id: 'imp-2024-q3',
          date: '2024 Q3',
          timestamp: 1719792000000,
          healthAndVitality: 75.8,
          cognitiveAgency: 76.4,
          socialCohesion: 73.9,
          meaningAndPurpose: 77.5,
          ecologicalHarmony: 70.8,
          materialSecurity: 71.0,
          compositeScore: 74.2,
          bioregion: 'Mombasa & Athi Industrial Corridors',
          verifiedSourceCount: 410,
          notes: 'Bio-composite LifeHouse habitat fabrication scaled with carbon-negative footprint.',
          cryptographicHash: '0xbccd661899ef8821'
        },
        {
          id: 'imp-2024-q4',
          date: '2024 Q4',
          timestamp: 1727740800000,
          healthAndVitality: 79.1,
          cognitiveAgency: 79.8,
          socialCohesion: 77.2,
          meaningAndPurpose: 80.6,
          ecologicalHarmony: 75.4,
          materialSecurity: 75.3,
          compositeScore: 77.9,
          bioregion: 'East African Bioregional Network',
          verifiedSourceCount: 530,
          notes: 'Epistemic evidence ledger crosses 10,000 continuous verified sensor nodes.',
          cryptographicHash: '0xcdee772900ab1143'
        },
        {
          id: 'imp-2025-q1',
          date: '2025 Q1',
          timestamp: 1735689600000,
          healthAndVitality: 82.5,
          cognitiveAgency: 83.1,
          socialCohesion: 81.0,
          meaningAndPurpose: 84.0,
          ecologicalHarmony: 80.2,
          materialSecurity: 79.6,
          compositeScore: 81.7,
          bioregion: 'Global Network Nodes',
          verifiedSourceCount: 680,
          notes: 'Autonomous regenerative capital tranches unlocked on verified soil carbon metrics.',
          cryptographicHash: '0xdeff883011bc2254'
        },
        {
          id: 'imp-2025-q2',
          date: '2025 Q2',
          timestamp: 1743465600000,
          healthAndVitality: 85.6,
          cognitiveAgency: 86.4,
          socialCohesion: 84.5,
          meaningAndPurpose: 87.2,
          ecologicalHarmony: 84.7,
          materialSecurity: 83.8,
          compositeScore: 85.4,
          bioregion: 'Upper Catchments & Urban Commons',
          verifiedSourceCount: 840,
          notes: 'Mathare River biological filtration achieves natural swimming standard.',
          cryptographicHash: '0xefff994122cd3365'
        },
        {
          id: 'imp-2025-q3',
          date: '2025 Q3',
          timestamp: 1751328000000,
          healthAndVitality: 88.4,
          cognitiveAgency: 89.2,
          socialCohesion: 87.6,
          meaningAndPurpose: 90.1,
          ecologicalHarmony: 88.9,
          materialSecurity: 87.4,
          compositeScore: 88.6,
          bioregion: 'Pan-African Living Labs',
          verifiedSourceCount: 1050,
          notes: 'Universal Priority Floor social covenant ratified across 12 distinct bioregions.',
          cryptographicHash: '0xf000aa5233de4476'
        },
        {
          id: 'imp-2025-q4',
          date: '2025 Q4',
          timestamp: 1759276800000,
          healthAndVitality: 91.2,
          cognitiveAgency: 92.0,
          socialCohesion: 90.4,
          meaningAndPurpose: 92.8,
          ecologicalHarmony: 92.6,
          materialSecurity: 90.9,
          compositeScore: 91.6,
          bioregion: 'Global Planetary Commons',
          verifiedSourceCount: 1320,
          notes: 'Full multi-capital equilibrium achieved in initial 8 prototype bioregions.',
          cryptographicHash: '0x0111bb6344ef5587'
        },
        {
          id: 'imp-2026-q1',
          date: '2026 Q1',
          timestamp: 1767225600000,
          healthAndVitality: 93.8,
          cognitiveAgency: 94.6,
          socialCohesion: 93.1,
          meaningAndPurpose: 95.2,
          ecologicalHarmony: 95.8,
          materialSecurity: 94.0,
          compositeScore: 94.4,
          bioregion: 'Sanctum Planetary Mesh',
          verifiedSourceCount: 1680,
          notes: 'Current telemetry cycle: 100% auditable sensor-to-blockchain evidence lineage.',
          cryptographicHash: '0x1222cc7455fa6698'
        },
        {
          id: 'imp-2027-proj',
          date: '2027 (Projected)',
          timestamp: 1798761600000,
          healthAndVitality: 96.2,
          cognitiveAgency: 96.8,
          socialCohesion: 95.5,
          meaningAndPurpose: 97.0,
          ecologicalHarmony: 97.4,
          materialSecurity: 96.5,
          compositeScore: 96.6,
          isProjected: true,
          confidenceInterval: [94.2, 98.4],
          bioregion: 'Global Scaled Deployment',
          notes: 'Model projection under sustained 0% extractive patient capital deployment.',
          cryptographicHash: '0x2333dd8566ab7709'
        },
        {
          id: 'imp-2030-target',
          date: '2030 (Horizon Target)',
          timestamp: 1893456000000,
          healthAndVitality: 99.0,
          cognitiveAgency: 98.8,
          socialCohesion: 98.4,
          meaningAndPurpose: 99.2,
          ecologicalHarmony: 99.5,
          materialSecurity: 98.9,
          compositeScore: 99.0,
          isProjected: true,
          confidenceInterval: [97.5, 99.8],
          bioregion: 'Civilizational Regenerative Steady-State',
          notes: 'Planetary boundary reintegration and universal human flourishing threshold.',
          cryptographicHash: '0x3444ee9677bc8810'
        }
      ];
    }
  },

  // 7. Bioregional Ecological Goals & Targets Collection
  bioregionalGoals: {
    async listAll(): Promise<BioregionalGoal[]> {
      const live = await db.query<BioregionalGoal>('bioregional_goals', orderBy('deadlineYear', 'asc'));
      if (live && live.length > 0) return live;
      return db.bioregionalGoals.getSeedGoals();
    },

    async create(goal: Omit<BioregionalGoal, 'id'> & { id?: string }): Promise<string> {
      const id = goal.id || `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const payload: BioregionalGoal = {
        ...goal,
        id,
        lastUpdated: Date.now(),
        trajectoryProgress: Math.min(100, Math.round(((goal.currentValue - goal.baselineValue) / (goal.targetValue - goal.baselineValue || 1)) * 100))
      };
      await db.set<BioregionalGoal>('bioregional_goals', id, payload);
      return id;
    },

    async update(id: string, updates: Partial<BioregionalGoal>): Promise<void> {
      await db.update<BioregionalGoal>('bioregional_goals', id, {
        ...updates,
        lastUpdated: Date.now()
      });
    },

    subscribe(onNext: (goals: BioregionalGoal[]) => void, onError?: (error: Error) => void) {
      if (offlineStorage.isEffectivelyOffline()) {
        db.bioregionalGoals.listAll().then(onNext);
        return () => {};
      }

      try {
        const q = query(collection(firestoreInstance, 'bioregional_goals'), orderBy('deadlineYear', 'asc'));
        return onSnapshot(
          q,
          (snapshot) => {
            if (snapshot.empty) {
              onNext(db.bioregionalGoals.getSeedGoals());
              return;
            }
            const goals: BioregionalGoal[] = [];
            snapshot.forEach((docSnap) => {
              goals.push({ id: docSnap.id, ...docSnap.data() } as BioregionalGoal);
            });
            offlineStorage.cacheCollection('bioregional_goals', goals).catch(() => {});
            onNext(goals);
          },
          (err) => {
            console.warn('Bioregional goals live subscription fallback:', err);
            db.bioregionalGoals.listAll().then(onNext);
            if (onError) onError(err);
          }
        );
      } catch (e: any) {
        console.warn('Subscription error:', e);
        db.bioregionalGoals.listAll().then(onNext);
        return () => {};
      }
    },

    getSeedGoals(): BioregionalGoal[] {
      return [
        {
          id: 'goal-aberdare-canopy',
          bioregionId: 'bioregion-aberdare',
          bioregionName: 'Aberdare Cloud Forest & Highland Catchment',
          title: 'Upper Catchment Native Canopy Cover Restoration',
          targetMetric: 'Canopy Density Index (NDVI + Multispectral LiDAR)',
          currentValue: 68.4,
          targetValue: 85.0,
          unit: '% Cover',
          category: 'canopy_cover',
          status: 'accelerating',
          deadlineYear: 2028,
          baselineYear: 2022,
          baselineValue: 54.0,
          leadSteward: 'Dr. Wanjiku Mwangi',
          stewardRole: 'Head Silvicultural Ecologist',
          lastUpdated: Date.now() - 86400000 * 2,
          description: 'Reconnecting fragmented alpine podocarpus-bamboo corridors to restore thermal orographic cloud condensation and endemic colobus monkey habitats.',
          interventionActions: [
            'Indigenous nursery expansion with 400,000 seedlings/yr',
            'Community agroforestry buffer fences against invasive grazing',
            'Mycorrhizal spore inoculation across degraded ridge scars'
          ],
          verificationSensorType: 'Sentinel-2 Multispectral + GEDI Spaceborne LiDAR',
          moralAlignmentScore: 98,
          trajectoryProgress: 46
        },
        {
          id: 'goal-turkana-aquifer',
          bioregionId: 'bioregion-turkana',
          bioregionName: 'Turkana-Omo Dryland Aquifer System',
          title: 'Deep Aquifer Recharge & Zero-Discharge Desalination Recovery',
          targetMetric: 'Piezometric Head Pressure & Groundwater Table Stability',
          currentValue: 1.82,
          targetValue: 2.50,
          unit: 'bar Pressure',
          category: 'aquifer_health',
          status: 'on_track',
          deadlineYear: 2030,
          baselineYear: 2023,
          baselineValue: 1.10,
          leadSteward: 'Steward Ekitela Lokidor',
          stewardRole: 'Turkana Hydrological Council Lead',
          lastUpdated: Date.now() - 86400000 * 5,
          description: 'Transitioning pastoral watering points to solar-powered reverse osmosis with subterranean sand-dam infiltration trenches.',
          interventionActions: [
            '12 Cascading Sand Dams across ephemeral Lugga riverbeds',
            'ZKP-attested piezometer sensor mesh with hourly head pressure logging',
            'Brine recirculation into spirulina cultivation basins'
          ],
          verificationSensorType: 'Subterranean Piezometer IoT Sensor Mesh + InSAR Surface Subsidence Radar',
          moralAlignmentScore: 96,
          trajectoryProgress: 51
        },
        {
          id: 'goal-mara-soil',
          bioregionId: 'bioregion-mara',
          bioregionName: 'Mara-Serengeti River Basin & Savanna Corridor',
          title: 'Soil Organic Carbon (SOM) Sponge & Holistic Grazing Regeneration',
          targetMetric: 'Soil Organic Matter (SOM) & Moisture Retention Threshold',
          currentValue: 2.85,
          targetValue: 4.20,
          unit: '% SOM',
          category: 'soil_carbon',
          status: 'on_track',
          deadlineYear: 2029,
          baselineYear: 2021,
          baselineValue: 1.40,
          leadSteward: 'Lemayan Ole Kaelo',
          stewardRole: 'Rangeland Stewardship Elder',
          lastUpdated: Date.now() - 86400000 * 3,
          description: 'Restoring mycorrhizal fungi and perennial deep-root bunchgrasses through rotational herd bunched grazing covenants.',
          interventionActions: [
            'GPS-tracked rotational bomas covering 34,000 pastoral hectares',
            'Pyrolysis biochar field soil amendments enriched with compost tea',
            'Quad-annual deep core elemental dry-combustion carbon audits'
          ],
          verificationSensorType: 'Hyperspectral UAV Reflection + Triple-Blind Laboratory Dry Combustion',
          moralAlignmentScore: 97,
          trajectoryProgress: 52
        },
        {
          id: 'goal-nairobi-microclimate',
          bioregionId: 'bioregion-nairobi',
          bioregionName: 'Nairobi River Basin & Urban Bioregion',
          title: 'Urban Heat Island Microclimate Mitigation & Riparian Bioswales',
          targetMetric: 'Surface Ambient Temperature Delta vs Concrete Core',
          currentValue: 1.7,
          targetValue: 3.2,
          unit: '°C Cooling',
          category: 'microclimate',
          status: 'lagging',
          deadlineYear: 2027,
          baselineYear: 2023,
          baselineValue: 0.4,
          leadSteward: 'Eng. Farida Omar',
          stewardRole: 'Urban Ecological Infrastructure Lead',
          lastUpdated: Date.now() - 86400000 * 1,
          description: 'Retrofitting Mathare and Korogocho riparian zones with continuous vegetated bioswales and vertical bio-composite living walls.',
          interventionActions: [
            '28 Constructed wetland bio-filter modules along Mathare River',
            'Shade tree planting along high-density pedestrian thoroughfares',
            'Zero-cement permeable paver installations by youth artisan guilds'
          ],
          verificationSensorType: 'Micro-Weather Stations & FLIR Thermal Aerial Imagery',
          moralAlignmentScore: 94,
          trajectoryProgress: 46
        },
        {
          id: 'goal-mombasa-coastal-blue',
          bioregionId: 'bioregion-mombasa',
          bioregionName: 'Mombasa Coastal Mangrove & Marine Basin',
          title: 'Mangrove Carbon Sequestration & Coral Reef Nursery Restoration',
          targetMetric: 'Restored Mangrove Biomass & Coral Colony Recruitment',
          currentValue: 1840,
          targetValue: 3500,
          unit: 'Hectares',
          category: 'biodiversity',
          status: 'accelerating',
          deadlineYear: 2029,
          baselineYear: 2022,
          baselineValue: 620,
          leadSteward: 'Captain Hassan Bakari',
          stewardRole: 'Marine Biologist & Artisanal Fisher Lead',
          lastUpdated: Date.now() - 86400000 * 4,
          description: 'Restoring degraded intertidal mangrove forests and propagating heat-resilient coral micro-fragments along the Tudor Creek lagoon.',
          interventionActions: [
            'Community mangrove nurseries cultivating Rhizophora mucronata',
            'Subsea ceramic reef frames with micro-current electrolyte stimulation',
            'Acoustic hydrophone telemetry monitoring reef fish return'
          ],
          verificationSensorType: 'Acoustic Reef Hydrophones + High-Res PlanetScope Satellite Imagery',
          moralAlignmentScore: 99,
          trajectoryProgress: 42
        }
      ];
    }
  }
};

// -------------------------------------------------------------
// PROVENANCE RECORD VALIDATION UTILITY
// -------------------------------------------------------------

export function validateProvenanceRecord(record: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!record) {
    return { isValid: false, errors: ['Provenance record is null or undefined'] };
  }

  if (!record.source || typeof record.source !== 'string' || record.source.trim().length === 0) {
    errors.push('Field `source` is required and must be a non-empty string.');
  }

  const validSourceTypes = [
    'satellite_telemetry',
    'iot_sensor_mesh',
    'field_audit',
    'peer_reviewed_model',
    'community_reporting'
  ];
  if (!record.sourceType || !validSourceTypes.includes(record.sourceType)) {
    errors.push(`Field "sourceType" must be one of: ${validSourceTypes.join(', ')}`);
  }

  if (typeof record.certaintyScore !== 'number' || record.certaintyScore < 0 || record.certaintyScore > 100) {
    errors.push('Field `certaintyScore` must be a valid number between 0 and 100.');
  }

  if (!record.verifier || typeof record.verifier !== 'string') {
    errors.push('Field `verifier` is required.');
  }

  if (!record.cryptographicHash || typeof record.cryptographicHash !== 'string' || record.cryptographicHash.length < 8) {
    errors.push('Field `cryptographicHash` is required and must be a valid hash representation.');
  }

  if (!record.calculationMethod || typeof record.calculationMethod !== 'string') {
    errors.push('Field `calculationMethod` description is required.');
  }

  if (!Array.isArray(record.assumptions)) {
    errors.push('Field `assumptions` must be an array of recorded epistemic constraints.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default db;
