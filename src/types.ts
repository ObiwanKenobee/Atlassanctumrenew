/**
 * ATLAS SANCTUM — Types & Data Contracts
 * Civilization Operating System & Regenerative Intelligence Platform
 */

export type PageView =
  | 'steward'
  | 'home'
  | 'sentinel'
  | 'agent-mission-control'
  | 'ai-engineering'
  | 'system-model-studio'
  | 'opportunity-intelligence'
  | 'decision-room'
  | 'regenerative-mission'
  | 'mission-analytics'
  | 'evidence-mapping'
  | 'stewardship-reputation'
  | 'failure-ledger'
  | 'ethics-review'
  | 'reality-engine'
  | 'bioregional-twin'
  | 'bioregional-ledger'
  | 'moral-arbiter'
  | 'opportunity-matchmaker'
  | 'observatory'
  | 'opportunity-graph'
  | 'project-os'
  | 'evidence-ledger'
  | 'flourishing-index'
  | 'capital-engine'
  | 'field-labs'
  | 'living-reality'
  | 'studio'
  | 'multimodal-studio'
  | 'marketplace'
  | 'lifehouse'
  | 'industrial'
  | 'moral-intelligence'
  | 'impact-dashboard'
  | 'academy'
  | 'commons'
  | 'research'
  | 'developers'
  | 'events'
  | 'stories'
  | 'resources'
  | 'governance'
  | 'about'
  | 'economics-pricing'
  | 'analytics-report'
  | 'citizen-profile'
  | 'alchemical-sanctum';

// AI Engineering & Epistemic Insights Types
export interface AIEpistemicAuditResult {
  claim: string;
  groundingVerificationIndex: number; // 0 - 100
  hallucinationRiskScore: number; // 0 - 100
  factualCitationCoverage: number; // 0 - 100
  verdict: 'VERIFIED_EMPIRICAL' | 'MODEL_CONJECTURE' | 'UNSUPPORTED_RISK' | 'HAZARD_FLAGGED';
  verdictExplanation: string;
  groundedSources: Array<{
    title: string;
    url: string;
    telemetrySource?: string;
    reliabilityScore: number;
  }>;
  epistemicGaps: string[];
  suggestedCalibrations: string[];
  timestamp: string;
}

export interface AITelemetryMetrics {
  activeModel: string;
  ttftMs: number; // Time to first token
  totalLatencyMs: number;
  tokensPerSecond: number;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  promptCacheHitRate: number; // 0 - 100
  memoryHeapMb: number;
  uptimeSeconds: number;
  epistemicCertaintyScore: number;
}

export interface AgentToolExecutionRecord {
  toolId: string;
  toolName: string;
  invokedByAgent: string;
  inputParameters: Record<string, any>;
  outputResult: Record<string, any>;
  latencyMs: number;
  status: 'SUCCESS' | 'ERROR' | 'FALLBACK';
  cryptographicProofHash: string;
  timestamp: string;
}

export type ScaleLevel = 'planet' | 'continent' | 'country' | 'region' | 'city' | 'community' | 'project';

export interface DataProvenance {
  id: string;
  source: string;
  sourceType: 'satellite_telemetry' | 'iot_sensor_mesh' | 'field_audit' | 'peer_reviewed_model' | 'community_reporting';
  collectedAt: string;
  calculationMethod: string;
  certaintyScore: number; // 0 - 100
  verifier: string;
  verifierRole: string;
  cryptographicHash: string;
  assumptions: string[];
  lastAudited: string;
  merkleProofCount?: number;
  verifiedMerkleProofs?: number | string[];
  merkleRootHash?: string;
}

export type MetricStatus = 'observed' | 'modeled' | 'target' | 'verified';

export interface CivilizationMetric {
  id: string;
  name: string;
  category: 'flourishing' | 'ecological' | 'economic' | 'social' | 'generational';
  value: string | number;
  unit: string;
  trend: number; // e.g. +12.4%
  status: MetricStatus;
  description: string;
  provenance: DataProvenance;
}

export interface MoralPrinciple {
  id: string;
  name: string;
  scripturalTheme: string;
  universalDesignPrinciple: string;
  systemImplementation: string;
  auditMetric: string;
  iconName: string;
}

export interface IntelligenceLayer {
  id: string;
  code: string;
  name: string;
  descriptor: string;
  summary: string;
  color: string;
  capabilities: string[];
  activeNodes: number;
  flourishingIndexDelta: string;
}

export interface CapitalFormDimension {
  id: string;
  name: string;
  description: string;
  flowDescription: string;
  currentAllocation: string;
  annualGrowth: string;
  color: string;
}

export interface LivingRealityLayer {
  id: string;
  name: string;
  category: 'vulnerability' | 'provision' | 'capital' | 'regeneration';
  unit: string;
  globalAverage: string;
  criticalThreshold: string;
  description: string;
  activeSensorCount: number;
}

export interface ProjectLocation {
  id: string;
  title: string;
  region: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  scale: ScaleLevel;
  primaryLayer: string;
  impactHighlight: string;
  budget: string;
  verifiedProgress: number; // 0 - 100
  beneficiariesCount: number;
  ecologicalAreaHectares: number;
  partners: string[];
  provenance: DataProvenance;
}

export interface RVEAsset {
  id: string;
  title: string;
  category: 'Ecological Restoration' | 'Carbon Sequestration' | 'Biodiversity Corridor' | 'Water Aquifer Recharge' | 'Community Habitat' | 'Resilient Grid';
  region: string;
  vintage: string;
  unitPrice: number;
  availableUnits: number;
  totalVolume: number;
  verifiedOutcomes: string[];
  coBenefits: string[];
  issuingEntity: string;
  validator: string;
  proofHash: string;
  status: 'Audited & Verified' | 'In Verification' | 'Active Monitoring';
  images: string[];
}

export interface LifeHouseSystem {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  specifications: {
    footprintSqM: number;
    deploymentTimeHours: number;
    solarCapacityKw: number;
    waterPurificationLitersPerDay: number;
    foodYieldKgPerMonth: number;
    materials: string[];
    carbonFootprint: string;
  };
  useCases: string[];
  readinessLevel: string;
}

export interface IndustrialFacility {
  id: string;
  name: string;
  location: string;
  facilityType: 'Modular Habitat Fabrication' | 'Bio-Composite Processing' | 'Solar-Thermal Assembly' | 'Decentralized Micro-Foundry';
  annualOutputCapacity: string;
  cleanEnergyRatio: string;
  localWorkforce: number;
  status: 'Operational' | 'Scaling' | 'Planned';
}

export interface ResearchPaper {
  id: string;
  title: string;
  category: 'Systems Architecture' | 'Regenerative Economics' | 'Moral AI' | 'Ecological Engineering' | 'Decentralized Infrastructure';
  authors: string[];
  publishedDate: string;
  abstract: string;
  citations: number;
  doi: string;
  readTime: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  level: 'Foundational' | 'Practitioner' | 'Architect';
  duration: string;
  modulesCount: number;
  instructor: string;
  description: string;
  enrolledCount: number;
}

export interface CommonsProposal {
  id: string;
  proposalId: string;
  title: string;
  authorGroup: string;
  votingDeadline: string;
  quorumReached: boolean;
  votesInFavor: number;
  votesAgainst: number;
  moralScorecardScore: number;
  summary: string;
  status: 'Active Vote' | 'Passed & Queued' | 'Under Deliberation';
}

export interface OpportunityNode {
  id: string;
  label: string;
  type: 'community' | 'problem' | 'project' | 'capital' | 'builder' | 'infrastructure' | 'outcome' | 'evidence';
  category: string;
  metrics: string;
  confidence: number;
  connections: string[]; // Connected node IDs
  coordinates?: [number, number]; // [lat, lng] if physical
  details: {
    description: string;
    verifiedOutcome?: string;
    allocatedCapital?: string;
    responsibleEntities?: string[];
  };
}

export interface EvidenceLedgerEntry {
  id: string;
  claim: string;
  source: string;
  methodology: string;
  intervention: string;
  measurement: string;
  outcome: string;
  epistemicStatus: 'Observed' | 'Reported' | 'Modeled' | 'Estimated' | 'Verified' | 'Unknown';
  confidenceScore: number; // 0 - 100
  hash: string;
  timestamp: string;
  verifier: string;
  attributionType: 'Attribution' | 'Contribution' | 'Correlation';
  moralAlignmentScore?: number; // 0 - 100 moral compliance score
  regenerativePotentialPriority?: 'Critical' | 'High' | 'Medium' | 'Foundational' | 'Critical Priority' | 'High Impact' | 'Catalytic';
  regenerativeScore?: number; // 0 - 100 priority score
  version?: number;
  localUpdatedAt?: number;
  remoteUpdatedAt?: number;
  isLocalDraft?: boolean;
  hasConflict?: boolean;
  conflictData?: {
    remoteConfidenceScore?: number;
    remoteOutcome?: string;
    remoteVerifier?: string;
    remoteTimestamp?: string;
    localModifiedAt?: number;
    remoteModifiedAt?: number;
  };
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
}

export interface FieldLab {
  id: string;
  name: string;
  location: string;
  focusArea: string;
  question: string;
  hypothesis: string;
  intervention: string;
  evidence: string;
  result: string;
  lesson: string;
  whatWentWrong: string;
  coordinates: [number, number];
}

export type ProjectLifecycleStage =
  | 'Discover'
  | 'Frame'
  | 'Design'
  | 'Fund'
  | 'Build'
  | 'Monitor'
  | 'Verify'
  | 'Learn'
  | 'Scale';

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  targetDate: string;
  deliverable: string;
  evidenceHash?: string;
}

export interface ProjectOsItem {
  id: string;
  name: string;
  code: string;
  stage: ProjectLifecycleStage;
  location: string;
  bioregion: string;
  problemStatement: string;
  theoryOfChange: string;
  humanOwners: { name: string; role: string; organization: string }[];
  stakeholders: string[];
  budget: {
    total: number;
    funded: number;
    currency: string;
    patientCapitalRatio: number; // e.g. 0.85
  };
  timeline: {
    start: string;
    targetCompletion: string;
    lifecycleMonths: number;
  };
  milestones: ProjectMilestone[];
  risks: { risk: string; severity: 'low' | 'medium' | 'high'; mitigation: string }[];
  impactMetrics: { name: string; target: string; current: string; verificationMethod: string }[];
  governance: {
    model: string;
    communityVetoPower: boolean;
    auditCadence: string;
  };
  aiAnalysis: {
    systemicLeverageScore: number; // 0-100
    ethicalDignityScore: number; // 0-100
    secondOrderRisks: string[];
    recommendedAction: string;
    confidence: number;
  };
  lessonsLearned: string[];
}

export interface FlourishingIndicator {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number;
  trend: number; // e.g. +4.2%
  unit: string;
  currentValue: string;
  benchmarkValue: string;
  epistemicStatus: 'Observed' | 'Reported' | 'Modeled' | 'Estimated' | 'Verified';
  certaintyScore: number;
  source: string;
  description: string;
}

export interface FlourishingDimension {
  id: 'human' | 'economic' | 'social' | 'ecological' | 'institutional' | 'generational';
  name: string;
  score: number; // 0 - 100
  trend: number;
  description: string;
  color: string;
  indicators: FlourishingIndicator[];
}

export type CapitalForm =
  | 'Financial'
  | 'Human'
  | 'Social'
  | 'Natural'
  | 'Intellectual'
  | 'Cultural'
  | 'Institutional';

export interface CapitalAllocationTranche {
  id: string;
  name: string;
  form: CapitalForm;
  amount: string;
  provider: string;
  recipientProject: string;
  readinessScore: number; // 0 - 100
  expectedOutcome: string;
  riskRating: 'Low' | 'Moderate' | 'Calculated';
  evidenceQuality: number; // 0 - 100
  beneficiariesCount: number;
  nonExtractiveTermYears: number;
  status: 'Committed' | 'Disbursed' | 'Under Audit' | 'Generating Return';
}

export interface RealityObservation {
  id: string;
  title: string;
  category: 'Geospatial' | 'Environmental' | 'Economic' | 'Demographic' | 'Infrastructure' | 'Community';
  zoomLevel: ScaleLevel;
  locationName: string;
  coordinates: [number, number];
  epistemicStatus: 'Observed' | 'Reported' | 'Modeled' | 'Estimated' | 'Verified' | 'Unknown';
  confidenceScore: number;
  summary: string;
  signalValue: string;
  signalTrend: string;
  dataSources: string[];
  uncertaintyFactors: string[];
}

// ----------------------------------------------------
// 1. CAUSAL BIOREGIONAL TWIN & COUNTERFACTUAL SIMULATOR
// ----------------------------------------------------

export interface CausalNode {
  id: string;
  name: string;
  category: 'Ecological' | 'Economic' | 'Social' | 'Demographic' | 'Infrastructure';
  currentBaseline: number;
  unit: string;
  biophysicalThreshold?: {
    minSafe: number;
    criticalCollapse: number;
  };
}

export interface CausalInterventionParam {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  unit: string;
  costEstimate: string;
}

export interface CausalImpactTrajectory {
  year5: number;
  year15: number;
  year30: number;
  confidence: number;
  uncertaintyBand: [number, number];
}

export interface SystemicConsequence {
  id: string;
  order: 1 | 2 | 3; // 1st, 2nd, or 3rd order
  title: string;
  description: string;
  type: 'synergy' | 'tradeoff' | 'catastrophic_risk' | 'regenerative_lock_in';
  severity: 'low' | 'moderate' | 'critical' | 'transformational';
  affectedDomain: string;
  mitigationStrategy?: string;
}

export interface BioregionalTwinScenario {
  id: string;
  name: string;
  bioregion: string;
  description: string;
  populationAffected: number;
  activeInterventions: CausalInterventionParam[];
  nodes: CausalNode[];
  consequences: SystemicConsequence[];
  flourishingImpact: Record<string, CausalImpactTrajectory>;
  monteCarloProbabilityOfSuccess: number; // 0-100
  ecologicalPlanetaryMarginSafe: boolean;
}

// ----------------------------------------------------
// 2. CONSTITUTIONAL MORAL ARBITER & COVENANT VERIFIER
// ----------------------------------------------------

export type PredatoryRiskLevel = 'Harmless' | 'Caution' | 'Elevated' | 'Forbidden / Breach';

export interface PredatoryRiskFlag {
  id: string;
  clauseReference: string;
  riskType: 'Extractivism' | 'Asymmetric Liability' | 'Land Alienation' | 'IP Enclosure' | 'Cultural Erosion' | 'Usurious Compounding';
  severity: PredatoryRiskLevel;
  violatedPrinciple: string;
  aiExplanation: string;
  prescribedRemedy: string;
}

export interface DignityAuditScorecard {
  humanAutonomy: number; // 0-100
  ecologicalRegeneration: number; // 0-100
  sovereignSelfGovernance: number; // 0-100
  intergenerationalEquity: number; // 0-100
  antiUsuryCompliance: number; // 0-100
  overallDignityScore: number; // 0-100
}

export interface StakeholderVetoGate {
  id: string;
  stakeholderGroup: string;
  role: string;
  ratificationStatus: 'Ratified' | 'Pending Assembly' | 'Exercised Veto' | 'Conditional Approval';
  concernsRaised: string[];
  mandatoryPrerequisites: string[];
}

export interface CovenantAuditDossier {
  id: string;
  projectTitle: string;
  proponent: string;
  funder: string;
  capitalTrancheId: string;
  contractType: 'Patient Capital Covenant' | 'Land Stewardship Pact' | 'Technology Transfer Charter' | 'Municipal Infrastructure Bond';
  status: 'Approved' | 'Blocked (Moral Veto)' | 'Remediation Required' | 'Under Multi-Assembly Review';
  dignityScorecard: DignityAuditScorecard;
  predatoryRiskFlags: PredatoryRiskFlag[];
  vetoGates: StakeholderVetoGate[];
  secondOrderHarmPrediction: string;
  epistemicAuditTrail: string;
}

// ----------------------------------------------------
// 3. AUTONOMOUS OPPORTUNITY & CAPITAL MATCHMAKER
// ----------------------------------------------------

export interface CommunityProblemSignal {
  id: string;
  title: string;
  bioregion: string;
  urgency: 'Acute' | 'Moderate' | 'Chronic';
  category: 'Water' | 'Energy' | 'Soil' | 'Health' | 'Housing' | 'Connectivity';
  observedDeficit: string;
  sensorHash: string;
  verifiedBeneficiaries: number;
  coordinates: [number, number];
}

export interface MatchedBlueprint {
  id: string;
  title: string;
  openSourceLicense: string;
  tRL: number; // Technology Readiness Level 1-9
  provenance: string;
  capexEstimate: string;
  opexAnnual: string;
  localMaterialSuitability: number; // %
  youthGuildApprenticeshipHours: number;
}

export interface TurnkeyMatchPackage {
  id: string;
  problemSignal: CommunityProblemSignal;
  matchedBlueprint: MatchedBlueprint;
  recommendedCapitalTranche: {
    trancheId: string;
    funderName: string;
    amount: string;
    termYears: number;
    matchScore: number; // 0-100
    nonExtractiveRationale: string;
  };
  billOfMaterials: {
    item: string;
    quantity: string;
    sourceType: 'Local Bioregional' | 'Regional Fabricator' | 'Specialized Import';
    estimatedCost: string;
  }[];
  localLaborPackage: {
    guildSpecialty: string;
    guildName: string;
    techniciansCount: number;
    trainingWeeks: number;
    localPayrollShare: string;
  };
  expectedFlourishingDelta: string;
  coordinationReadiness: number; // 0-100
}

// -------------------------------------------------------------
// ATLAS FAILURE LEDGER (Commandment XXIII: Institutional Learning)
// -------------------------------------------------------------
export type FailureCategory =
  | 'biophysical_mismatch'
  | 'economic_misalignment'
  | 'social_friction'
  | 'tech_overpromise'
  | 'governance_breakdown'
  | 'unintended_feedback';

export type FailureSeverity = 'low' | 'moderate' | 'high' | 'civilizational_critical';

export interface FailureLedgerEntry {
  id: string;
  projectName: string;
  bioregion: string;
  dateInitiated: string;
  dateConcludedOrPivoted: string;
  coreHypothesis: string;
  implementationDetails: string;
  failureCategory: FailureCategory;
  severityTier: FailureSeverity;
  failureModes: string[];
  unintendedConsequences: string[];
  affectedStakeholders: string[];
  correctiveActionsTaken: string[];
  epistemicLessonsLearned: string;
  covenantCommandmentReferenced: string;
  auditedBy: string;
  verificationHash: string;
  status: 'analyzed' | 'mitigated' | 'codified_in_canon';
}

// -------------------------------------------------------------
// REALITY CHECK & EPISTEMIC PROVENANCE (Commandments II & IX)
// -------------------------------------------------------------
export type EpistemicStatus = 'observed' | 'reported' | 'modeled' | 'estimated' | 'verified';

export interface RealityCheckData {
  status: EpistemicStatus;
  confidenceScore: number; // 0 - 100
  uncertaintyMargin: string; // e.g. "± 3.4%"
  epistemicTier: 'Ground Truth Telemetry' | 'Peer-Reviewed Causal Model' | 'Field Audit Verification' | 'Community Consensus Sensor' | string;
  realityVsModelWarning?: string;
  sensorHealth?: number; // 0 - 100
  dataOrigin: string;
  cryptographicHash: string;
  lastVerified: string;
  verifiedBy: string;
  assumptions?: string[];
}

// -------------------------------------------------------------
// ETHICS REVIEW & POLICY DASHBOARD (Ten Commandments & Priority Floor)
// -------------------------------------------------------------
export interface PolicyReviewVote {
  userId: string;
  userName: string;
  stance: 'approve' | 'amend' | 'veto';
  rationale: string;
  priorityFloorImpactAssessment: string;
  timestamp: string;
}

export interface PlatformPolicyProposal {
  id: string;
  code: string;
  title: string;
  category: 'algorithmic_governance' | 'resource_allocation' | 'data_sovereignty' | 'ecological_safeguard' | 'capital_stewardship';
  proposer: string;
  proposerRole: string;
  submissionDate: string;
  reviewStatus: 'active_deliberation' | 'approved' | 'vetoed_by_covenant' | 'amendment_required';
  summary: string;
  fullRationale: string;
  priorityFloorScore: number; // 0 - 100
  tenCommandmentsCompliance: {
    commandmentNumber: number;
    commandmentName: string;
    score: number; // 0-100
    notes: string;
  }[];
  potentialFailureRisks: string[];
  deliberationVotes: PolicyReviewVote[];
  covenantVerdict?: string;
}

// -------------------------------------------------------------
// ONE-PAGE REGENERATIVE MISSION PLATFORM CONTRACTS
// -------------------------------------------------------------
export type ContributionPathway = 'give' | 'build' | 'buy' | 'partner' | 'back';

export interface MissionMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  evidenceLabel: 'Reported' | 'Documented' | 'Verified';
  evidenceDetail?: string;
  verificationHash?: string;
}

export interface FeaturedMission {
  id: string;
  title: string;
  location: string;
  challenge: string;
  status: 'Active' | 'Forming' | 'Funded' | 'Completed';
  fundingCurrent: number;
  fundingTarget: number;
  progressPercentage: number;
  peopleInvolved: number;
  impactTarget: string;
  impactAchieved: string;
  isDemoData: boolean;
  leadStewards: string[];
  bioregionalContext: string;
  milestones: MissionMilestone[];
  transparencyMetrics: {
    fundsReceived: string;
    fundsDeployed: string;
    peopleEngaged: number;
    milestonesCompleted: number;
    outcomesVerified: number;
  };
}

export interface ContributionSubmission {
  id?: string;
  missionId: string;
  type: ContributionPathway;
  name: string;
  email: string;
  details: Record<string, any>;
  createdAt: string;
}

// -------------------------------------------------------------
// MISSION PERFORMANCE ANALYTICS (Failure Ledger + Impact Metrics)
// -------------------------------------------------------------
export interface MissionDeploymentAnalytics {
  id: string;
  missionId: string;
  missionTitle: string;
  bioregion: string;
  biomeType: 'urban_riparian' | 'savanna_silvopasture' | 'arid_sponge' | 'tropical_cloud_basin' | 'highland_alpine' | 'coastal_mangrove';
  status: 'Active' | 'Forming' | 'Funded' | 'Completed' | 'Pivoted';
  successRate: number; // 0 - 100%
  biophysicalTargetAchievedPct: number; // 0 - 100%
  epistemicConfidenceScore: number; // 0 - 100
  totalCapitalDeployed: number;
  capitalEfficiencyRatio: number; // impact unit per $1,000
  failureLedgerCount: number;
  criticalIncidentsCount: number;
  mitigatedIncidentsCount: number;
  resilienceAdaptationsCount: number;
  recoveryVelocityDays: number; // Mean time to recover/pivot
  verifiedOutcomesCount: number;
  primaryFailureMode?: string;
  codifiedLessonSnippet?: string;
  healthIndex: number; // 0 - 100
  lastAuditDate: string;
  impactDeltas: {
    kpi: string;
    baseline: number;
    current: number;
    target: number;
    unit: string;
    trend: 'improving' | 'stable' | 'regressing';
  }[];
}

export interface BiomePerformanceSummary {
  biomeType: string;
  label: string;
  totalDeployments: number;
  avgSuccessRate: number;
  topFailureCategory: FailureCategory;
  resilienceAdaptationRate: number; // %
  totalHectaresOrKmRestored: string;
  capitalEfficiency: string;
}

// -------------------------------------------------------------
// REAL-TIME MISSION ALERT NOTIFICATION SYSTEM
// -------------------------------------------------------------
export type MissionAlertType =
  | 'milestone_verified'
  | 'failure_ledger_entry'
  | 'telemetry_anomaly'
  | 'stewardship_endorsed'
  | 'tranche_released'
  | 'reality_check_warning'
  | 'tipping_point';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface MissionAlert {
  id: string;
  missionId: string;
  missionTitle: string;
  type: MissionAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  cryptographicHash?: string;
  targetView?: PageView;
  targetId?: string; // e.g. milestone ID, failure ID, node ID
  metadata?: {
    verifiedBy?: string;
    failureCategory?: FailureCategory;
    certaintyScore?: number;
    epistemicTier?: string;
    anomalyMetric?: string;
    reading?: string;
    threshold?: string;
  };
}

// -------------------------------------------------------------
// INTERACTIVE EVIDENCE MAPPING & CLAIM LINEAGE DAG
// -------------------------------------------------------------
export type EvidenceNodeType =
  | 'goal'             // Level 1: High-level mission goal / civilizational claim
  | 'milestone'        // Level 2: Milestone & operational hypothesis
  | 'kpi_metric'       // Level 3: Biophysical KPI / evidence package
  | 'raw_telemetry';   // Level 4: Sensor telemetry, lab soil core, drone raster, or community baraza audit

export interface EvidenceMappingNode {
  id: string;
  missionId: string;
  level: 1 | 2 | 3 | 4;
  type: EvidenceNodeType;
  title: string;
  subtitle: string;
  description: string;
  epistemicStatus: EpistemicStatus;
  certaintyScore: number; // 0 - 100
  uncertaintyMargin?: string;
  sensorOrSourceType?: string;
  cryptographicHash: string;
  lastVerified: string;
  verifiedBy: string;
  parentIds: string[];
  childIds: string[];
  rawPayload?: Record<string, any>;
  merkleProofRoot?: string;
  anomalyDetected?: boolean;
  citationUrl?: string;
  coordinates?: { x: number; y: number };
}

export interface EvidenceLineageTree {
  missionId: string;
  missionTitle: string;
  rootGoalId: string;
  nodes: EvidenceMappingNode[];
}

// -------------------------------------------------------------
// STEWARDSHIP REPUTATION & BADGE SYSTEM
// -------------------------------------------------------------
export type ReputationTier = 'apprentice_sentinel' | 'field_steward' | 'master_auditor' | 'bioregional_custodian';

export type BadgeCategory =
  | 'ground_truth'
  | 'failure_forensics'
  | 'indigenous_anchor'
  | 'mesh_telemetry'
  | 'priority_floor_guardian';

export interface StewardshipBadge {
  id: string;
  code: string;
  title: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: BadgeCategory;
  description: string;
  criteria: string[];
  unlockedAt?: string;
  cryptographicSignature: string;
  reputationPointsValue: number;
  iconName: string;
  mintedTokenId: string;
  attestationsCount: number;
}

export interface LocalKnowledgeSubmission {
  id: string;
  missionId: string;
  missionTitle: string;
  bioregion: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  title: string;
  knowledgeType: 'indigenous_oral_covenant' | 'field_observation' | 'microclimate_sensor_data' | 'failure_precursor_warning' | 'species_sighting';
  summary: string;
  detailedFindings: string;
  coordinatesOrZone: string;
  verificationStatus: 'pending_assembly_review' | 'verified_by_elders' | 'anchored_in_ledger' | 'disputed';
  reputationAwarded: number;
  votesCount: number;
  submittedAt: string;
  cryptographicHash: string;
  sensorAttachments?: string[];
  peerReviews: {
    reviewerName: string;
    role: string;
    verdict: 'verified' | 'requires_clarification' | 'rejected';
    comment: string;
    timestamp: string;
  }[];
}

export interface FailureReviewContribution {
  id: string;
  failureEntryId: string;
  failureProjectName: string;
  contributorId: string;
  contributorName: string;
  reviewType: 'root_cause_analysis' | 'epistemic_lesson_refinement' | 'corrective_action_audit';
  content: string;
  consensusScore: number; // 0 - 100
  reputationAwarded: number;
  status: 'codified_in_canon' | 'in_deliberation';
  timestamp: string;
}

export interface StewardshipProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  bioregionFocus: string;
  roleTitle: string;
  tier: ReputationTier;
  tierRankNumber: number; // 1 to 4
  reputationPoints: number;
  pointsToNextTier: number;
  verificationAccuracyPct: number;
  failureReviewsCount: number;
  localKnowledgeSubmissionsCount: number;
  verifiedAuditsSignedCount: number;
  badges: StewardshipBadge[];
  recentSubmissions: LocalKnowledgeSubmission[];
  recentFailureReviews: FailureReviewContribution[];
  joinedDate: string;
  onChainAddress: string;
}

// ==========================================
// PROMPT 3 — ATLAS OBJECT MODEL & INTERFACES
// ==========================================

export type EpistemicEvidenceTier =
  | 'VERIFIED'
  | 'OBSERVED'
  | 'MODELED'
  | 'PROJECTED'
  | 'ILLUSTRATIVE'
  | 'UNKNOWN';

export interface EpistemicEvidenceItem {
  id: string;
  claim: string;
  tier: EpistemicEvidenceTier;
  source: string;
  methodology: string;
  confidenceScore: number; // 0 - 100
  sampleSizeOrSensorMesh?: string;
  assumptions: string[];
  lastVerifiedDate: string;
  hash?: string;
}

export interface AtlasProblemProfile {
  id: string;
  title: string;
  category: 'water_drainage' | 'agroecology_soil' | 'clean_energy' | 'housing_habitat' | 'circular_waste' | 'youth_employment' | 'health_resilience';
  locationName: string;
  bioregion: string;
  coordinates: [number, number];
  severityScore: number; // 0 - 100
  affectedPopulation: string;
  summary: string;
  symptoms: string[];
  rootCauses: string[];
  observedDeficits: { label: string; value: string; status: 'critical' | 'severe' | 'moderate' }[];
  leveragePoints: { point: string; multiplierPotential: string; mechanism: string }[];
}

export interface AtlasInterventionOption {
  id: string;
  title: string;
  shortDescription: string;
  tier: 'catalytic' | 'infrastructure' | 'civic_stewardship' | 'policy_market';
  capitalRequiredEstimate: { min: number; max: number; currency: string };
  timelineMonths: number;
  expectedOutcomes: {
    label: string;
    modeledEstimate: string;
    confidenceRange: string;
    tier: EpistemicEvidenceTier;
  }[];
  tradeOffs: {
    cost: 'low' | 'moderate' | 'high';
    impact: 'low' | 'moderate' | 'high';
    speed: 'slow' | 'moderate' | 'fast';
    equity: 'low' | 'moderate' | 'high';
    resilience: 'low' | 'moderate' | 'high';
  };
  risks: {
    risk: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  ethicalSafeguards: {
    principle: string;
    safeguard: string;
    beneficiaryBurdenCheck: string;
  }[];
  blueprintRef?: string;
}

export interface OpportunityBrief {
  id: string;
  generatedAt: string;
  location: string;
  bioregion: string;
  problem: AtlasProblemProfile;
  evidenceBase: EpistemicEvidenceItem[];
  interventions: AtlasInterventionOption[];
  whyHereMetrics: {
    label: string;
    level: 'High' | 'Moderate' | 'Critical' | 'Low';
    description: string;
  }[];
  totalCapitalRequiredRange: { min: number; max: number; currency: string };
  recommendedFirstStep: string;
  ethicalAssessment: {
    humanDignity: string;
    justiceAndBurden: string;
    inclusionRisk: string;
    ecologicalRegeneration: string;
    intergenerationalHorizon: string;
  };
  provenance: DataProvenance;
}

export interface DecisionRoomOption {
  id: string;
  name: string;
  tagline: string;
  capitalNeeded: string;
  timeToImpact: string;
  benefits: string[];
  costs: string[];
  risks: string[];
  environmentalImpact: string;
  uncertaintyAssessment: string;
  tradeOffScores: {
    cost: number;       // 1 (low cost/good) to 5 (high cost)
    impact: number;     // 1 to 5
    speed: number;      // 1 to 5
    equity: number;     // 1 to 5
    resilience: number; // 1 to 5
  };
}

export interface DecisionRoomScenario {
  id: string;
  title: string;
  location: string;
  problemContext: string;
  options: DecisionRoomOption[];
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  requiredRole: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'civilizational_critical';
  actionClass: 'ANALYZE' | 'SIMULATE' | 'RECOMMEND' | 'EXECUTE' | 'REQUEST_APPROVAL' | 'READ';
}

export interface AgentPermission {
  action: string;
  scope: string;
  actionClass: 'ANALYZE' | 'SIMULATE' | 'RECOMMEND' | 'EXECUTE' | 'REQUEST_APPROVAL' | 'READ';
  requiresHumanApproval: boolean;
  maxCapitalAllocationUsd?: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  version: string;
  description: string;
  avatarIcon: string;
  model: string;
  systemPrompt: string;
  tools: string[];
  permissions: AgentPermission[];
  status: 'idle' | 'executing' | 'awaiting_approval' | 'paused';
  completedTasksCount: number;
  epistemicConfidence: number;
  allowedDataSources: string[];
  deploymentEnvironment: string;
}

// Re-export all Systems Dynamics & Modelling types
export * from './types/systemsDynamics';

// ==========================================
// MASTER BUILD PROMPT — CIVILIZATIONAL TYPES
// ==========================================

export interface CovenantRecord {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  covenantDate: string;
  status: 'ACTIVE' | 'AUDITED' | 'RENEWED' | 'PROPOSED';
  purpose: {
    goodPursued: string;
    northStarAlignment: string;
  };
  people: {
    affectedPopulations: string[];
    dignitySafeguards: string;
    agencyGained: string;
  };
  creation: {
    ecosystemsAffected: string[];
    ecologicalInterventions: string;
    bioregionalCommitment: string;
  };
  justice: {
    primaryBeneficiaries: string[];
    riskBearers: string[];
    burdenDistributionCheck: string;
  };
  wisdom: {
    supportingEvidence: string[];
    epistemicConfidenceScore: number;
    unresolvedAssumptions: string[];
  };
  governance: {
    accountableParties: string[];
    reviewCadence: string;
    communityVetoMechanism: boolean;
  };
  capital: {
    fundingSources: string[];
    capitalDestination: string[];
    nonExtractiveTerms: string;
    totalCommittedUsd: number;
  };
  impact: {
    verifiedChanges: string[];
    milestoneProofs: string[];
  };
  memory: {
    keyLessonsLearned: string[];
    failureMitigations: string[];
  };
  regeneration: {
    futureCapacityToFlourish: string;
    intergenerationalHorizonYears: number;
  };
  cryptographicSignature: string;
}

export type SevenCapitalCategory =
  | 'human'
  | 'social'
  | 'intellectual'
  | 'natural'
  | 'financial'
  | 'institutional'
  | 'technological';

export interface SevenCapitalsData {
  capital: SevenCapitalCategory;
  name: string;
  score: number; // 0 - 100
  trend: 'increasing' | 'stable' | 'depleting';
  unit: string;
  currentStock: string;
  transformationFlow: string;
  regenerativeYield: string;
}

export interface CivilizationalDiagnosisChain {
  id: string;
  primaryProblem: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  bioregion: string;
  causalChain: {
    step: number;
    node: string;
    systemicDomain: 'ECOLOGICAL' | 'ECONOMIC' | 'INFRASTRUCTURE' | 'HEALTH' | 'SOCIAL' | 'GOVERNANCE';
    impactDescription: string;
    evidenceProof: string;
  }[];
  reinforcingLoops: string[];
  highestLeverageIntervention: string;
  expectedRegenerativeCascade: string;
}

export interface SpecializedCivilizationAgent {
  id: string;
  agentRole:
    | 'OBSERVER'
    | 'DIAGNOSTICIAN'
    | 'RESEARCHER'
    | 'STRATEGIST'
    | 'ETHICIST'
    | 'CAPITAL_ARCHITECT'
    | 'IMPLEMENTATION_AGENT'
    | 'IMPACT_ANALYST'
    | 'MEMORY_KEEPER'
    | 'STEWARD';
  title: string;
  specialization: string;
  coreDirective: string;
  activeWorkstream: string;
  epistemicConfidence: number;
  covenantConstraint: string;
  status: 'active' | 'evaluating' | 'idle' | 'standby';
}

export interface CivilizationalMemoryItem {
  id: string;
  title: string;
  bioregion: string;
  eraOrYear: string;
  origin: string;
  problem: string;
  decision: string;
  intervention: string;
  outcome: string;
  failure: string;
  lesson: string;
  nextGenerationAction: string;
  verifiedBy: string;
}

export interface ActiveMissionPipeline {
  id: string;
  sourceDiagnosisId?: string;
  title: string;
  bioregion: string;
  primaryProblem: string;
  highestLeverageIntervention: string;
  estimatedBudgetUsd: number;
  stage: 'DIAGNOSED' | 'STRATEGY_FORMULATED' | 'CAPITAL_STRUCTURED' | 'FIELD_DEPLOYED' | 'VERIFIED_AUDIT';
  targetDomain: 'ECOLOGICAL' | 'INFRASTRUCTURE' | 'ECONOMIC' | 'HEALTH' | 'SOCIAL' | 'GOVERNANCE';
  assignedAgents: string[];
  keyTelemetryProof: string;
  covenantSafeguard: string;
  activeScenarioPrompt?: string;
  createdAt: string;
}

export interface LiberationIndexScore {
  overallScore: number; // 0 - 100
  agencyGained: {
    incomeOpportunity: number;
    knowledgeAccess: number;
    healthcareAutonomy: number;
    decisionMakingPower: number;
    productiveCapacity: number;
    dependencyReduction: number;
  };
  harmMitigation: {
    surveillanceResistance: number;
    antiManipulationSafeguard: number;
    lockInPrevention: number;
    decentralizedPowerDistribution: number;
  };
  philosophicalVerdict: string;
}



