import { StewardshipProfile, StewardshipBadge, LocalKnowledgeSubmission, FailureReviewContribution } from '../types';

export const AVAILABLE_STEWARDSHIP_BADGES: StewardshipBadge[] = [
  {
    id: 'badge-failure-forensic',
    code: 'BADGE-FF-01',
    title: 'Failure Forensic Auditor',
    tier: 'gold',
    category: 'failure_forensics',
    description: 'Recognized for conducting rigorous, non-punitive root-cause failure analysis and codifying institutional lessons into the Atlas Canon (Commandment XXIII).',
    criteria: [
      'Contributed to 3+ verified Failure Ledger post-mortems',
      'Identified critical biophysical or economic model discrepancies',
      'Formulated actionable corrective actions ratified by community peers'
    ],
    cryptographicSignature: '0x9948ba201948bacfe91028491048102948192049182049182049182049182049',
    reputationPointsValue: 750,
    iconName: 'BookOpenCheck',
    mintedTokenId: 'STW-NFT-8841',
    attestationsCount: 28
  },
  {
    id: 'badge-ground-truth',
    code: 'BADGE-GT-02',
    title: 'Ground Truth Validator',
    tier: 'platinum',
    category: 'ground_truth',
    description: 'Awarded for performing rigorous in-situ physical field verifications, soil sampling, or water telemetry calibrations that anchor machine models to empirical physical reality (Commandment II).',
    criteria: [
      'Executed 5+ independent on-the-ground field audits',
      'Cryptographically signed laboratory assay or sensor calibration sheets',
      'Maintained a >98% epistemic verification accuracy rating'
    ],
    cryptographicSignature: '0x4810294819204918204918204918204918204918204918204918204918204918',
    reputationPointsValue: 1200,
    iconName: 'ShieldCheck',
    mintedTokenId: 'STW-NFT-9204',
    attestationsCount: 42
  },
  {
    id: 'badge-indigenous-anchor',
    code: 'BADGE-IA-03',
    title: 'Indigenous Knowledge Anchor',
    tier: 'gold',
    category: 'indigenous_anchor',
    description: 'Recognized for contributing verified customary ecological covenants, traditional pastoral grazing corridors, or oral water-table histories ratified by community elders.',
    criteria: [
      'Submitted verified traditional ecological knowledge (TEK) records',
      'Endorsed by accredited community elder baraza assemblies',
      'Integrated traditional water harvesting (Zaï, Olosho) into modern project charters'
    ],
    cryptographicSignature: '0x1029481920491820491820491820491820491820491820491820491820491820',
    reputationPointsValue: 900,
    iconName: 'TreeDeciduous',
    mintedTokenId: 'STW-NFT-7193',
    attestationsCount: 35
  },
  {
    id: 'badge-priority-floor',
    code: 'BADGE-PF-04',
    title: 'Priority Floor Guardian',
    tier: 'gold',
    category: 'priority_floor_guardian',
    description: 'Awarded for active ethics tribunal defense ensuring that non-negotiable minimums of potable water, clean air, and nutritional dignity are never financialized or compromised (Commandment I).',
    criteria: [
      'Participated in 4+ policy ethics review deliberations',
      'Challenged extractive algorithmic pricing schemes',
      'Authored priority floor safeguard covenants'
    ],
    cryptographicSignature: '0x2948192049182049182049182049182049182049182049182049182049182049',
    reputationPointsValue: 800,
    iconName: 'Scale',
    mintedTokenId: 'STW-NFT-6041',
    attestationsCount: 19
  },
  {
    id: 'badge-mesh-telemetry',
    code: 'BADGE-MT-05',
    title: 'Mesh Telemetry Pioneer',
    tier: 'silver',
    category: 'mesh_telemetry',
    description: 'Recognized for deploying and maintaining decentralized, solar-powered in-situ LoRaWAN sensors that stream untampered biophysical telemetry directly to the ledger.',
    criteria: [
      'Deployed or maintained 2+ edge telemetry mesh stations',
      'Zero unauthorized telemetry downtime during 90-day cycle',
      'Configured cryptographic enclave signing keys'
    ],
    cryptographicSignature: '0x3948192049182049182049182049182049182049182049182049182049182049',
    reputationPointsValue: 500,
    iconName: 'Radio',
    mintedTokenId: 'STW-NFT-5182',
    attestationsCount: 16
  }
];

export const INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS: LocalKnowledgeSubmission[] = [
  {
    id: 'lk-2025-001',
    missionId: 'mission-mathare-river',
    missionTitle: 'Mathare River Regeneration',
    bioregion: 'Upper Athi Catchment, Kenya',
    authorId: 'steward-sharon',
    authorName: 'Sharon Atieno',
    authorHandle: '@sharon_mathare_guild',
    title: 'Historic Riparian Spring Resurgence at Mlango Kubwa',
    knowledgeType: 'field_observation',
    summary: 'Discovery of an active freshwater subterranean spring unblocked after removing 4.5 tons of illegal industrial slag dumping behind Swale #3.',
    detailedFindings: 'During the clearing of Section 2B on Feb 18, 2025, our youth team uncovered a natural crystal-clear spring bubbling from basalt bedrock. Flow rate measured at 14.2 L/min with neutral pH 7.2. Eldest residents confirm this was a sacred drinking fountain known as "Maji ya Baraka" prior to 1984 urbanization.',
    coordinatesOrZone: 'Coordinates: -1.2592, 36.8624 (Mlango Kubwa Sector)',
    verificationStatus: 'verified_by_elders',
    reputationAwarded: 150,
    votesCount: 38,
    submittedAt: '2025-02-19 10:15 UTC',
    cryptographicHash: '0x718a092c431b990f10c87214556677889900aabbccddeeff1122334455667788',
    peerReviews: [
      {
        reviewerName: 'Mzee Juma Omondi',
        role: 'Community Elder Council Chair',
        verdict: 'verified',
        comment: 'I drank from this spring as a boy in 1976. This observation is true and holy to our elders.',
        timestamp: '2025-02-20'
      },
      {
        reviewerName: 'Dr. Evelyn Wandera',
        role: 'Water Quality Chemist',
        verdict: 'verified',
        comment: 'Lab testing confirmed 0 E. coli and mineral purity. Excellent natural bio-filtration.',
        timestamp: '2025-02-21'
      }
    ]
  },
  {
    id: 'lk-2025-002',
    missionId: 'mission-mara-agroforestry',
    missionTitle: 'Mara Riparian Buffer & Pastoralist Agroforestry',
    bioregion: 'Mara Basin, Kenya',
    authorId: 'steward-ole-sankale',
    authorName: 'Ole Sankale Lemayian',
    authorHandle: '@sankale_mara_trust',
    title: 'Traditional Olosho Grazing Rotation Calendar Alignment',
    knowledgeType: 'indigenous_oral_covenant',
    summary: 'Integration of the 4-year dry-season Enkanyit grazing rotation cycle with satellite vegetative NDVI mapping.',
    detailedFindings: 'Modern fencing failed because it blocked the dry-season elephant and cattle migration corridor along the Talek River. By re-aligning the living acacia vegetative fence with the ancestral Olosho boundaries, we preserved both sapling survival and 8,000 head of pastoral cattle grazing access.',
    coordinatesOrZone: 'Talek-Mara Riparian Ecotone (Zone 4)',
    verificationStatus: 'anchored_in_ledger',
    reputationAwarded: 220,
    votesCount: 54,
    submittedAt: '2025-02-12 14:40 UTC',
    cryptographicHash: '0x88f1b2098ac123901bca091234567890abcdef1234567890abcdef12345678',
    peerReviews: [
      {
        reviewerName: 'Chief Parmuat',
        role: 'Manyatta Supreme Council',
        verdict: 'verified',
        comment: 'The boundaries match the sacred oath made under the Oreteti fig tree in 1952.',
        timestamp: '2025-02-14'
      }
    ]
  },
  {
    id: 'lk-2025-003',
    missionId: 'mission-sahel-water-sponge',
    missionTitle: 'Sahelian Earth-Sponge Aquifer Recharge',
    bioregion: 'Niamey Region, Niger',
    authorId: 'steward-aminata',
    authorName: 'Dr. Aminata Diallo',
    authorHandle: '@aminata_sahel_guild',
    title: 'Termite Symbiosis in Laterite Crust Breakdown',
    knowledgeType: 'microclimate_sensor_data',
    summary: 'Utilizing organic millet chaff in Zaï pits to attract native subterranean termites, which aerate impenetrable hardpan soil.',
    detailedFindings: 'Field trials revealed that mechanical tilling compacted crusted laterite soil within 2 rainfalls. Adding 300g of dry millet straw into each Zaï pit attracted Amitermes termites, whose subterranean tunneling increased water infiltration rates by 420% without diesel machinery.',
    coordinatesOrZone: 'Tillabéri Plateau Quadrant 12',
    verificationStatus: 'anchored_in_ledger',
    reputationAwarded: 300,
    votesCount: 68,
    submittedAt: '2025-02-05 09:20 UTC',
    cryptographicHash: '0x99c4210aef783109a24d8091887766554433221100ffeeddccbbaa9988776655',
    peerReviews: [
      {
        reviewerName: 'Prof. Boubacar Cisse',
        role: 'INRAN Agro-Ecologist',
        verdict: 'verified',
        comment: 'Groundbreaking bio-mechanics data. Codified into regional training curriculum.',
        timestamp: '2025-02-08'
      }
    ]
  }
];

export const INITIAL_FAILURE_REVIEWS: FailureReviewContribution[] = [
  {
    id: 'fr-2025-001',
    failureEntryId: 'FL-2025-001',
    failureProjectName: 'Sahel Green Barrier: Fast-Growth Acacia Inoculation',
    contributorId: 'steward-current-user',
    contributorName: 'Atlas Master Steward',
    reviewType: 'root_cause_analysis',
    content: 'The failure was not merely meteorological drought, but epistemic hubris: assuming machine-accelerated mycorrhizal monoculture could bypass 7-year natural polycultural pioneer species succession.',
    consensusScore: 98,
    reputationAwarded: 180,
    status: 'codified_in_canon',
    timestamp: '2025-01-25 16:30 UTC'
  },
  {
    id: 'fr-2025-002',
    failureEntryId: 'FL-2025-002',
    failureProjectName: 'Upper Tana River Tokenized Dynamic Water Rights',
    contributorId: 'steward-current-user',
    contributorName: 'Atlas Master Steward',
    reviewType: 'corrective_action_audit',
    content: 'Proposed the inviolable Universal Priority Floor architecture: guaranteed 50L/person/day household baseline and riparian baseflow must be locked as free public commons prior to any secondary tokenized commercial extraction quota.',
    consensusScore: 100,
    reputationAwarded: 250,
    status: 'codified_in_canon',
    timestamp: '2024-11-20 11:15 UTC'
  }
];

export const CURRENT_STEWARD_PROFILE: StewardshipProfile = {
  id: 'steward-current-user',
  name: 'Eugene Ochako',
  handle: '@eugene_sanctum_steward',
  bioregionFocus: 'Upper Athi & Mara Basin, East Africa',
  roleTitle: 'Master Biophysical Auditor & Canon Custodian',
  tier: 'master_auditor',
  tierRankNumber: 3,
  reputationPoints: 3450,
  pointsToNextTier: 1550, // 5000 needed for Bioregional Custodian
  verificationAccuracyPct: 98.6,
  failureReviewsCount: 14,
  localKnowledgeSubmissionsCount: 9,
  verifiedAuditsSignedCount: 26,
  badges: [
    AVAILABLE_STEWARDSHIP_BADGES[0], // Failure Forensic Auditor
    AVAILABLE_STEWARDSHIP_BADGES[1], // Ground Truth Validator
    AVAILABLE_STEWARDSHIP_BADGES[2], // Indigenous Knowledge Anchor
    AVAILABLE_STEWARDSHIP_BADGES[3]  // Priority Floor Guardian
  ],
  recentSubmissions: INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS,
  recentFailureReviews: INITIAL_FAILURE_REVIEWS,
  joinedDate: 'October 2024',
  onChainAddress: '0x992018ea1947201bc917281901abcf89410984a1'
};

export const TOP_COMMUNITY_STEWARDS: StewardshipProfile[] = [
  CURRENT_STEWARD_PROFILE,
  {
    id: 'steward-aminata',
    name: 'Dr. Aminata Diallo',
    handle: '@aminata_sahel',
    bioregionFocus: 'Sahel Semi-Arid Corridor',
    roleTitle: 'Bioregional Council Custodian',
    tier: 'bioregional_custodian',
    tierRankNumber: 4,
    reputationPoints: 5820,
    pointsToNextTier: 0,
    verificationAccuracyPct: 99.4,
    failureReviewsCount: 32,
    localKnowledgeSubmissionsCount: 18,
    verifiedAuditsSignedCount: 64,
    badges: AVAILABLE_STEWARDSHIP_BADGES,
    recentSubmissions: [INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS[2]],
    recentFailureReviews: [],
    joinedDate: 'August 2024',
    onChainAddress: '0x4810294819204918204918204918204918204918'
  },
  {
    id: 'steward-sharon',
    name: 'Sharon Atieno',
    handle: '@sharon_mathare',
    bioregionFocus: 'Upper Athi Urban Riparian',
    roleTitle: 'Field Steward & Youth Marshal',
    tier: 'field_steward',
    tierRankNumber: 2,
    reputationPoints: 2150,
    pointsToNextTier: 850,
    verificationAccuracyPct: 97.2,
    failureReviewsCount: 8,
    localKnowledgeSubmissionsCount: 12,
    verifiedAuditsSignedCount: 15,
    badges: [
      AVAILABLE_STEWARDSHIP_BADGES[0],
      AVAILABLE_STEWARDSHIP_BADGES[2],
      AVAILABLE_STEWARDSHIP_BADGES[4]
    ],
    recentSubmissions: [INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS[0]],
    recentFailureReviews: [],
    joinedDate: 'November 2024',
    onChainAddress: '0x1029481920491820491820491820491820491820'
  },
  {
    id: 'steward-ole-sankale',
    name: 'Ole Sankale Lemayian',
    handle: '@sankale_mara',
    bioregionFocus: 'Mara-Talek Basin',
    roleTitle: 'Elder Council Liaison & Field Steward',
    tier: 'field_steward',
    tierRankNumber: 2,
    reputationPoints: 2480,
    pointsToNextTier: 520,
    verificationAccuracyPct: 98.9,
    failureReviewsCount: 6,
    localKnowledgeSubmissionsCount: 14,
    verifiedAuditsSignedCount: 19,
    badges: [
      AVAILABLE_STEWARDSHIP_BADGES[1],
      AVAILABLE_STEWARDSHIP_BADGES[2]
    ],
    recentSubmissions: [INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS[1]],
    recentFailureReviews: [],
    joinedDate: 'September 2024',
    onChainAddress: '0x2948192049182049182049182049182049182049'
  }
];
