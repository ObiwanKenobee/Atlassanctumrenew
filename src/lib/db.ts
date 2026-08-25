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
  themePreference?: 'dark' | 'solarized' | 'biophilic_night';
  reducedMotion?: boolean;
  telemetryStreamActive?: boolean;
  ethicalReviewNotification?: boolean;
  sabbathModeActive?: boolean;
  createdAt: any;
  lastLoginAt: any;
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
// TYPED CRUD INTERFACE FOR DB
// -------------------------------------------------------------

export const db = {
  // Direct raw instance
  instance: firestoreInstance,

  // 1. Generic Document Operations
  async get<T extends DocumentData>(collectionPath: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(firestoreInstance, collectionPath, docId).withConverter(genericConverter<T>());
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return snap.data();
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${collectionPath}/${docId}`);
    }
  },

  async set<T extends DocumentData>(collectionPath: string, docId: string, data: T, merge = true): Promise<void> {
    try {
      const docRef = doc(firestoreInstance, collectionPath, docId);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionPath}/${docId}`);
    }
  },

  async add<T extends DocumentData>(collectionPath: string, data: T): Promise<string> {
    try {
      const colRef = collection(firestoreInstance, collectionPath);
      const res = await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
      return res.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, collectionPath);
    }
  },

  async update<T extends DocumentData>(collectionPath: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(firestoreInstance, collectionPath, docId);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() } as any);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${collectionPath}/${docId}`);
    }
  },

  async delete(collectionPath: string, docId: string): Promise<void> {
    try {
      const docRef = doc(firestoreInstance, collectionPath, docId);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${docId}`);
    }
  },

  async query<T extends DocumentData>(collectionPath: string, ...constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const colRef = collection(firestoreInstance, collectionPath).withConverter(genericConverter<T>());
      const q = query(colRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => docSnap.data());
    } catch (err) {
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
