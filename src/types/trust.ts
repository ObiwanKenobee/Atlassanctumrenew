export type TrustSectionId =
  | 'privacy'
  | 'consent'
  | 'security'
  | 'data-rights'
  | 'ai-transparency'
  | 'accessibility'
  | 'impact-transparency'
  | 'governance-terms'
  | 'verification-system'
  | 'incident-status'
  | 'unified-preferences'
  | 'ethical-covenant';

export type TrustPillarId = TrustSectionId;

export interface TrustPillarDescriptor {
  id: TrustSectionId;
  title: string;
  subtitle: string;
  category: string;
}

export interface ConsentSettings {
  essential: boolean; // always true
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  aiDataTraining: boolean;
  bioregionalLocation: boolean;
  communications: boolean;
  telemetryLogging: boolean;
  timestamp: string;
  version: string;
  hasInteracted: boolean;
}

export interface PrivacyCollectionItem {
  id: string;
  category: string;
  dataPoints: string[];
  purpose: string;
  legalBasis: 'Legitimate Interest' | 'Explicit Consent' | 'Contractual Necessity' | 'Legal Obligation';
  retentionPeriod: string;
  recipients: string[];
  processingLocation: string;
  sovereigntyStandard: string;
}

export interface PrivacyPolicyVersion {
  version: string;
  effectiveDate: string;
  summaryOfChanges: string;
  authorizingBody: string;
  diffSummary: string[];
}

export interface SecuritySpecification {
  category: string;
  title: string;
  status: 'active' | 'enforced' | 'monitored';
  standard: string;
  description: string;
  auditVerification: string;
}

export interface ActiveSessionRecord {
  id: string;
  device: string;
  browser: string;
  ipAddressMasked: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type DataRightsActionType =
  | 'view'
  | 'download'
  | 'correct'
  | 'delete'
  | 'restrict'
  | 'revoke-consent'
  | 'request-human-review';

export interface DataRightsRequest {
  id: string;
  type: DataRightsActionType;
  requestedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'verified';
  details: string;
  resolutionTimeEstimate: string;
  verificationHash?: string;
}

export interface AIFeatureTransparencyRecord {
  featureName: string;
  aiModel: string;
  primaryCapability: string;
  decisionInfluence: 'Advisory Only' | 'Ranking & Synthesis' | 'Simulation Hypothesis' | 'No Autonomous Authority';
  dataIngested: string[];
  humanInTheLoopPolicy: string;
  knownLimitations: string[];
  appealMechanism: string;
  modelTrainingUsage: 'Never Used for Model Training' | 'Ephemeral In-Memory Only' | 'Zero Retention';
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrastMode: 'standard' | 'high-contrast' | 'biophilic-dark';
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  captionsEnabled: boolean;
  soundFeedback: boolean;
  plainLanguageMode: boolean;
  keyboardFocusRing: boolean;
}

export type MetricCalculationType = 'actual' | 'estimated' | 'target' | 'projected';

export interface RegenerativeImpactMetric {
  id: string;
  title: string;
  category: 'Ecological' | 'Human Prosperity' | 'Hydrology' | 'Carbon & Soil' | 'Economic Sovereignty';
  value: string;
  unit: string;
  type: MetricCalculationType;
  confidenceScore: number; // 0 - 100%
  verificationSource: string;
  verificationHash: string;
  lastAudited: string;
  description: string;
}

export type VerificationState = 'unverified' | 'submitted' | 'reviewed' | 'verified' | 'independently-audited';

export interface VerifiableClaimRecord {
  id: string;
  subjectTitle: string;
  subjectType: 'Project' | 'Organization' | 'Land Trust' | 'Impact Ledger' | 'Bioregional Node';
  claimDescription: string;
  verificationState: VerificationState;
  verifierOrganization: string;
  auditStandard: string;
  cryptographicMerkleRoot: string;
  issuanceDate: string;
  expiryDate: string;
}

export interface SystemServiceStatus {
  serviceId: string;
  serviceName: string;
  category: 'Core AI' | 'Bioregional Telemetry' | 'Ledger & Database' | 'Audio Gateway' | 'Edge CDN';
  status: 'operational' | 'degraded_performance' | 'partial_outage' | 'scheduled_maintenance';
  uptime90Days: number;
  latencyMs: number;
}

export interface IncidentRecord {
  id: string;
  title: string;
  date: string;
  severity: 'low' | 'moderate' | 'critical';
  impactDescription: string;
  resolutionDetails: string;
  postMortemUrl?: string;
  status: 'resolved' | 'monitoring' | 'investigating';
}

export interface CovenantPrinciple {
  pillar: string;
  title: string;
  mandate: string;
  ethicalCommitment: string;
  enforcementMechanism: string;
}
