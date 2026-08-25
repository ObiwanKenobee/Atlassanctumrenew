import { PlatformPolicyProposal } from '../types';

export const PLATFORM_POLICY_PROPOSALS: PlatformPolicyProposal[] = [
  {
    id: 'POL-2026-08',
    code: 'PROP-08',
    title: 'Automatic Emergency Resource Re-Allocation Protocol During Category 4 Drought',
    category: 'resource_allocation',
    proposer: 'Global Bioregional Water Stewardship Council',
    proposerRole: 'Ecological Council Delegate',
    submissionDate: '2026-08-10',
    reviewStatus: 'approved',
    summary: 'Establishes algorithmic triggers to automatically throttle commercial agricultural irrigation extraction when watershed aquifers breach the 15% critical reserve threshold, redirecting 100% of base flow to municipal Priority Floor drinking allocations and ecological base flows.',
    fullRationale: 'No economic enterprise has a moral or legal right to deplete living watershed baselines beneath the threshold of human survival and irreversible ecological desertification. When hydrological sensors detect a Category 4 anomaly, emergency reallocation must be swift, automated, and tamper-proof.',
    priorityFloorScore: 98,
    tenCommandmentsCompliance: [
      {
        commandmentNumber: 1,
        commandmentName: 'The Priority Floor Axiom',
        score: 100,
        notes: 'Guarantees sub-floor hydration for all vulnerable populations before any commercial utility.'
      },
      {
        commandmentNumber: 2,
        commandmentName: 'Reality Above Model',
        score: 95,
        notes: 'Triggered by physical piezometric well telemetry and verified river flow sensors, not speculative econometric forecast.'
      },
      {
        commandmentNumber: 3,
        commandmentName: 'The Seven-Generation Horizon',
        score: 96,
        notes: 'Prevents permanent aquifer subsidence and salinization for future generations.'
      },
      {
        commandmentNumber: 8,
        commandmentName: 'Local Value Sovereignty',
        score: 92,
        notes: 'Enacted via local basin committees with transparent cryptographic override safeguards.'
      }
    ],
    potentialFailureRisks: [
      'Commercial crop loss for contracted export agri-businesses if alternative non-potable greywater recycling is delayed.',
      'Potential risk of sensor calibration drift requiring mandatory bi-weekly manual verification.'
    ],
    deliberationVotes: [
      {
        userId: 'rev-01',
        userName: 'Dr. Tariq Al-Mansoor (Hydrological Ethics)',
        stance: 'approve',
        rationale: 'Fully protects the life-support boundary. The Priority Floor is absolute.',
        priorityFloorImpactAssessment: 'Eliminates acute water poverty during catastrophic drought events.',
        timestamp: '2026-08-14'
      },
      {
        userId: 'rev-02',
        userName: 'Elena Rostova (Agri-Supply Resilience)',
        stance: 'amend',
        rationale: 'Approved with amendment: Add secondary subsidies for immediate localized solar water atmospheric condensers.',
        priorityFloorImpactAssessment: 'Protects both smallholders and community hydration.',
        timestamp: '2026-08-18'
      }
    ],
    covenantVerdict: 'RATIFIED BY MORAL ARBITER: In full alignment with Commandment I (Priority Floor) and Commandment III (Seven-Generation Horizon).'
  },
  {
    id: 'POL-2026-09',
    code: 'PROP-09',
    title: 'Epistemic Whistleblower Protection and Inviolable Public Failure Logging',
    category: 'algorithmic_governance',
    proposer: 'Open Epistemology Guild',
    proposerRole: 'Systems Integrity Steward',
    submissionDate: '2026-08-15',
    reviewStatus: 'active_deliberation',
    summary: 'Mandates that any researcher, engineer, or community participant who reports a data discrepancy, sensor failure, or algorithmic bias receives automatic cryptographic anonymity and institutional indemnity. Forbids deletion or suppression of any entry in the Atlas Failure Ledger.',
    fullRationale: 'Suppression of failure modes is the single largest contributor to systemic civilizational collapse. If engineers fear reprisal for reporting model discrepancies or field project setbacks, institutional learning ceases.',
    priorityFloorScore: 94,
    tenCommandmentsCompliance: [
      {
        commandmentNumber: 2,
        commandmentName: 'Reality Above Model',
        score: 98,
        notes: 'Penalizes model deception and rewards empirical truth-telling.'
      },
      {
        commandmentNumber: 9,
        commandmentName: 'Evidence Constitution',
        score: 99,
        notes: 'Ensures cryptographic immutability of all audit logs and failure reports.'
      },
      {
        commandmentNumber: 10,
        commandmentName: 'Humility and Anti-Hubris',
        score: 97,
        notes: 'Institutionalizes the admission of systemic error as the highest form of platform virtue.'
      }
    ],
    potentialFailureRisks: [
      'Potential for bad-faith denial-of-service grievance spam if anonymous submissions lack cryptographic stake or peer vouching.'
    ],
    deliberationVotes: [
      {
        userId: 'rev-03',
        userName: 'Sarah Jenkins (Legal Steward)',
        stance: 'approve',
        rationale: 'Essential for institutional durability and moral transparency.',
        priorityFloorImpactAssessment: 'Prevents systemic cover-ups of failures that harm vulnerable communities.',
        timestamp: '2026-08-20'
      }
    ]
  },
  {
    id: 'POL-2026-10',
    code: 'PROP-10',
    title: 'Rate-Limiting High-Frequency Speculative Capital on Bioregional Commons',
    category: 'capital_stewardship',
    proposer: 'Regenerative Finance Working Group',
    proposerRole: 'Capital Steward',
    submissionDate: '2026-08-01',
    reviewStatus: 'vetoed_by_covenant',
    summary: 'A proposed amendment to introduce a 24-hour liquidity auction for bioregional carbon yield certificates to enhance capital velocity and arbitrage efficiency.',
    fullRationale: 'Proponents argued this would increase trading volume and attract Tier-1 Wall Street institutional balance sheets.',
    priorityFloorScore: 32,
    tenCommandmentsCompliance: [
      {
        commandmentNumber: 1,
        commandmentName: 'The Priority Floor Axiom',
        score: 40,
        notes: 'Risk of financial speculation decoupling capital from ground truth ecological health.'
      },
      {
        commandmentNumber: 21,
        commandmentName: 'Non-Extractive Capital',
        score: 18,
        notes: 'Direct violation of non-extractive patient capital covenants.'
      },
      {
        commandmentNumber: 24,
        commandmentName: 'Anti-Commodification of Life',
        score: 12,
        notes: 'Treats living bioregional regeneration as a volatile financial casino asset.'
      }
    ],
    potentialFailureRisks: [
      'Speculative flash-crashes undermining long-term 30-year agroforestry contracts.',
      'Extraction of ground wealth by non-local algorithmic traders.'
    ],
    deliberationVotes: [
      {
        userId: 'rev-04',
        userName: 'Council of Bioregional Elders',
        stance: 'veto',
        rationale: 'VETO ENFORCED: Capital in Atlas must be patient, non-extractive, and directly bound to biophysical outcome verification. Speculative trading of living commons is strictly forbidden.',
        priorityFloorImpactAssessment: 'Severe hazard to grassroots community autonomy and ecosystem stability.',
        timestamp: '2026-08-05'
      }
    ],
    covenantVerdict: 'PERMANENTLY VETOED BY COVENANT: Violates Commandment XXI (Non-Extractive Capital) and Commandment XXIV (Anti-Commodification of Life).'
  }
];
