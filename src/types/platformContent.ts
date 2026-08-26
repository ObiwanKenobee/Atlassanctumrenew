/**
 * ATLAS SANCTUM — Platform Domain Contracts
 * Events, Stories, Resources, and Governance Data Schemas
 */

import { DataProvenance, MoralPrinciple } from '../types';

// ============================================================================
// 1. EVENTS DOMAIN (Conferences, Webinars, Workshops, Field Activities)
// ============================================================================

export type EventCategory = 'conference' | 'webinar' | 'workshop' | 'field_activity';
export type EventFormat = 'in_person' | 'virtual' | 'hybrid';
export type EventStatus = 'upcoming' | 'live_now' | 'concluded' | 'archived';

export interface EventSpeaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  bioregion?: string;
  topic?: string;
}

export interface AgendaItem {
  id: string;
  timeSlot: string;
  title: string;
  speaker?: string;
  description: string;
  track?: string;
}

export interface PlatformEvent {
  id: string;
  title: string;
  category: EventCategory;
  categoryLabel: string;
  format: EventFormat;
  status: EventStatus;
  startDate: string; // ISO 8601
  endDate: string;
  timezone: string;
  locationName: string;
  bioregion: string;
  country: string;
  summary: string;
  description: string;
  featuredImageUrl?: string;
  organizers: string[];
  speakers: EventSpeaker[];
  agenda: AgendaItem[];
  capacity: number;
  registeredCount: number;
  isRsvpOpen: boolean;
  recordingUrl?: string;
  slidesUrl?: string;
  livestreamUrl?: string;
  fieldLabId?: string; // Connected Field Lab
  telemetryStreamId?: string;
  tags: string[];
  moralPrincipleAnchor?: string;
  provenance: DataProvenance;
}

// ============================================================================
// 2. STORIES DOMAIN (Human Narratives, Field Reports, Transformational Stories)
// ============================================================================

export type StoryCategory = 'human_narrative' | 'field_report' | 'transformational_story';

export interface StoryMetricDelta {
  metricName: string;
  beforeValue: string;
  afterValue: string;
  unit: string;
  isPositive: boolean;
  deltaDescription: string;
}

export interface StoryCommunityVoice {
  quote: string;
  authorName: string;
  authorTitle: string;
  community: string;
  avatarUrl?: string;
}

export interface TransformationalStory {
  id: string;
  title: string;
  subtitle: string;
  category: StoryCategory;
  categoryLabel: string;
  authorName: string;
  authorRole: string;
  authorAffiliation: string;
  publishDate: string;
  readingTimeMinutes: number;
  bioregion: string;
  locationCoordinates?: [number, number]; // [lat, lng]
  projectLinkedId?: string;
  featuredImageUrl: string;
  summary: string;
  leadParagraph: string;
  fullBodyMarkdown: string;
  keyOutcomes: string[];
  metricDeltas: StoryMetricDelta[];
  communityVoices: StoryCommunityVoice[];
  audioNarrationUrl?: string;
  verifiedEvidenceRoot?: string;
  tags: string[];
  provenance: DataProvenance;
}

// ============================================================================
// 3. RESOURCES DOMAIN (Templates, Toolkits, APIs, Documents, Educational Materials)
// ============================================================================

export type ResourceCategory = 'template' | 'toolkit' | 'api' | 'document' | 'educational_material';
export type ResourceFileFormat = 'PDF' | 'CAD_ZIP' | 'CSV' | 'OPEN_API' | 'MD_PACKAGE' | 'FIGMA' | 'PYTHON_NB';
export type LicenseType = 'CC-BY-4.0' | 'Apache-2.0' | 'MIT' | 'GPL-3.0' | 'Open-Hardware-v2' | 'Sanctum-Commons';

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  categoryLabel: string;
  version: string;
  lastUpdated: string;
  fileFormat: ResourceFileFormat;
  fileSizeBytes: number;
  license: LicenseType;
  summary: string;
  description: string;
  targetAudience: string[];
  prerequisites?: string[];
  downloadUrl?: string;
  externalRepoUrl?: string;
  apiDocsUrl?: string;
  previewImageUrl?: string;
  downloadCount: number;
  verifiedSha256: string;
  tags: string[];
  curriculumModuleCode?: string; // e.g. REG-101
  provenance: DataProvenance;
}

// ============================================================================
// 4. GOVERNANCE DOMAIN (Principles, Policies, Transparency, Decision-Making)
// ============================================================================

export type GovernancePillar = 'principles' | 'policies' | 'transparency' | 'decision_making';

export interface ConstitutionalFloorRule {
  id: string;
  name: string;
  domain: 'ecological' | 'labor' | 'capital' | 'sovereignty' | 'epistemic';
  thresholdDescription: string;
  mathematicalBound: string;
  currentObservedValue: string;
  status: 'compliant' | 'warning' | 'breach_prevented';
  auditCadence: string;
  violatorsVetoedCount: number;
  axiomAnchor: string;
}

export interface GovernanceProposal {
  id: string; // e.g. AGP-043
  title: string;
  category: 'Capital Allocation' | 'Schema Upgrade' | 'Ecosystem Covenant' | 'Floor Calibration';
  proposer: string;
  proposerRole: string;
  submittedDate: string;
  votingDeadline: string;
  status: 'active_voting' | 'passed_executed' | 'vetoed_by_floors' | 'under_council_review';
  quorumPercentage: number;
  currentSupportPercentage: number;
  totalVotesCast: number;
  summary: string;
  impactAssessmentSummary: string;
  capitalRequestedUsd?: number;
  bioregion: string;
  fpicConsentVerified: boolean;
  provenance: DataProvenance;
}

export interface TransparencyAuditRecord {
  id: string;
  timestamp: string;
  auditType: 'Capital Flow' | 'Sensor Calibration' | 'Floor Boundary Check' | 'FPIC Consent Verification';
  auditorName: string;
  auditorOrganization: string;
  merkleRootHash: string;
  verificationStatus: 'verified_authentic' | 'pending_multi_sig' | 'flagged_discrepancy';
  summary: string;
  externalExplorerUrl?: string;
}

export interface DecisionRecord {
  id: string;
  timestamp: string;
  matterTitle: string;
  decisionType: 'Elder Consensus' | 'Democratic Vote' | 'Autonomous Floor Defense' | 'Sovereign Grant Release';
  outcome: 'Approved' | 'Rejected' | 'Automated Veto' | 'Conditional Escalation';
  rationale: string;
  votingBreakdown: {
    inFavor: number;
    opposed: number;
    abstained: number;
  };
  elderWitnesses: string[];
  cryptographicProofHash: string;
}
