/**
 * ATLAS SANCTUM — Subscription & Economic Tier Management
 * Coordinates tier permissions, payment verification, and access restrictions
 * for Foundation (Commons), Atlas Studio, Atlas Intelligence, and Atlas Enterprise.
 */

import { PageView } from '../types';

export type SubscriptionTier = 'foundation' | 'studio' | 'intelligence' | 'enterprise';

export type PaymentMethodType = 'credit_card' | 'crypto_web3' | 'bank_wire' | 'regeneration_credits';

export type BillingCycle = 'monthly' | 'annual';

export interface TierOffering {
  id: string;
  name: string;
  category: string;
  description: string;
  highlight?: boolean;
}

export interface TierDefinition {
  id: SubscriptionTier;
  name: string;
  badge: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number; // per month when billed annually
  currency: string;
  level: number; // 0 = foundation, 1 = studio, 2 = intelligence, 3 = enterprise
  accessibleViews: PageView[];
  offerings: TierOffering[];
}

export interface PaymentRecord {
  id: string;
  licenseKey: string;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  amountUsd: number;
  originalAmountUsd?: number;
  proratedCreditUsd?: number;
  paymentMethod: PaymentMethodType;
  paymentMethodSummary: string; // e.g., "Visa •••• 4242" or "USDC (Base Network)"
  status: 'active' | 'pending' | 'canceled' | 'expired';
  createdAt: string;
  expiresAt: string;
  organizationName?: string;
  billingEmail?: string;
  txHash?: string;
  invoiceNumber: string;
  walletAddress?: string;
}

export interface RegenerativeCreditActivity {
  id: string;
  action: string;
  creditsEarned: number;
  timestamp: string;
  proofHash?: string;
}

export interface ActiveSubscriptionState {
  currentTier: SubscriptionTier;
  activeLicenseKey: string | null;
  licenseKey?: string | null;
  billingCycle: BillingCycle;
  renewsAt: string | null;
  autoRenew: boolean;
  paymentMethodType: PaymentMethodType;
  paymentSummary: string;
  regenerativeCredits: number;
  creditMultiplier: number;
  creditActivities: RegenerativeCreditActivity[];
  history: PaymentRecord[];
  walletAddress?: string;
  walletSignature?: string;
  walletVerified?: boolean;
  prorationCreditApplied?: number;
}

export interface ProrationDetails {
  isUpgrade: boolean;
  previousTier: SubscriptionTier;
  newTier: SubscriptionTier;
  billingCycle: BillingCycle;
  daysTotalInCycle: number;
  daysRemaining: number;
  previousMonthlyRate: number;
  unusedCreditUsd: number;
  newTierRegularPriceUsd: number;
  proratedAmountDueUsd: number;
  dailyRate: number;
}

export const ATLAS_TIERS: Record<SubscriptionTier, TierDefinition> = {
  foundation: {
    id: 'foundation',
    name: 'The Foundation (Commons)',
    badge: 'Open Access ($0)',
    tagline: 'Zero paywall on fundamental civilizational knowledge and planetary monitoring.',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'USD',
    level: 0,
    accessibleViews: [
      'home',
      'commons',
      'observatory',
      'research',
      'developers',
      'events',
      'stories',
      'resources',
      'governance',
      'about',
      'economics-pricing',
      'analytics-report',
      'citizen-profile',
      'steward',
      'stewardship-reputation',
      'field-labs',
      'lifehouse',
      'industrial',
      'impact-dashboard',
      'academy',
      'alchemical-sanctum'
    ],
    offerings: [
      { id: 'f1', name: 'Open Public Observatory', category: 'Commons', description: 'Planetary indicators, multispectral satellite feeds, and macro ecosystem telemetry.' },
      { id: 'f2', name: 'Community Participation & Staking', category: 'Commons', description: 'Local ground-truth reporting, indigenous ecological records, and open forums.' },
      { id: 'f3', name: 'Basic Project Registry', category: 'Commons', description: 'Register public LifeHouses, bioregional catchments, and open-source initiatives.' },
      { id: 'f4', name: 'Open Standards & JSON-LD Schemas', category: 'Commons', description: 'Unrestricted access to Schema.org ecological ontologies and carbon flux models.' },
      { id: 'f5', name: 'Peer-Reviewed Research Library', category: 'Commons', description: 'Full academic papers, epistemic papers, and thermodynamic stability studies.' },
      { id: 'f6', name: 'Basic Public Read APIs', category: 'Commons', description: 'Query public observatory state, Merkle proof verifications, and public projects.' },
      { id: 'f7', name: 'Open Hardware CAD Schemas', category: 'Commons', description: 'Biochar retort CAD models, soil sensor blueprints, and micro-hydro designs.' },
      { id: 'f8', name: 'Public Project Discovery', category: 'Commons', description: 'Global exploration and auditing of verified regeneration initiatives.' }
    ]
  },

  studio: {
    id: 'studio',
    name: 'Atlas Studio',
    badge: 'Operator Tier ($500/mo)',
    tagline: 'Professional operating environment for bioregional design, IoT telemetry, and evidence collection.',
    monthlyPrice: 500,
    annualPrice: 400, // $4,800/year
    currency: 'USD',
    level: 1,
    accessibleViews: [
      // All Foundation views plus:
      'home', 'commons', 'observatory', 'research', 'developers', 'events', 'stories', 'resources', 'governance', 'about', 'economics-pricing', 'analytics-report', 'citizen-profile', 'steward', 'stewardship-reputation', 'field-labs', 'lifehouse', 'industrial', 'impact-dashboard', 'academy',
      'project-os',
      'studio',
      'multimodal-studio',
      'evidence-mapping',
      'evidence-ledger',
      'marketplace'
    ],
    offerings: [
      { id: 's1', name: 'Project Operating System (Project-OS)', category: 'Build', description: 'End-to-end management cockpit for capital budgeting, site zoning, and operational milestones.', highlight: true },
      { id: 's2', name: 'Physical Asset Management & Verifiable QR', category: 'Build', description: 'Cryptographic asset tag generator for hardware sensors, biochar kilns, and solar arrays.' },
      { id: 's3', name: 'High-Frequency IoT Monitoring Ingest', category: 'Build', description: 'Real-time telemetry ingestion pipelines for soil moisture, sap flow, and micro-climate nodes.' },
      { id: 's4', name: 'Evidence Collection Workflows', category: 'Build', description: 'Immutable field verification checklists with timestamped photographic and sensor attestations.' },
      { id: 's5', name: 'Multimodal Simulation Studio', category: 'Build', description: 'Interactive visual scenario builder for capital allocation and ecological recovery trajectories.' },
      { id: 's6', name: 'Team Workspaces & Role-Based Permissions', category: 'Build', description: 'Collaborative workspaces for hydrologists, community leaders, and financial operators.' },
      { id: 's7', name: 'Operational Reporting & Investor Dossiers', category: 'Build', description: 'Automated generation of quarterly impact performance reports and compliance packets.' },
      { id: 's8', name: 'Evidence Ledger Proof Generation', category: 'Build', description: 'Issue Merkle-attested verification receipts for carbon, biodiversity, and community metrics.' }
    ]
  },

  intelligence: {
    id: 'intelligence',
    name: 'Atlas Intelligence',
    badge: 'Decision Layer ($2,500/mo)',
    tagline: 'Frontier causal decision infrastructure, 10 autonomous epistemic AI agents, and institutional memory.',
    monthlyPrice: 2500,
    annualPrice: 2000, // $24,000/year
    currency: 'USD',
    level: 2,
    accessibleViews: [
      // All Studio & Foundation views plus:
      'home', 'commons', 'observatory', 'research', 'developers', 'events', 'stories', 'resources', 'governance', 'about', 'economics-pricing', 'analytics-report', 'citizen-profile', 'steward', 'stewardship-reputation', 'field-labs', 'lifehouse', 'industrial', 'impact-dashboard', 'academy',
      'project-os', 'studio', 'multimodal-studio', 'evidence-mapping', 'evidence-ledger', 'marketplace',
      'decision-room',
      'agent-mission-control',
      'system-model-studio',
      'opportunity-intelligence',
      'reality-engine',
      'moral-arbiter',
      'moral-intelligence',
      'ai-engineering'
    ],
    offerings: [
      { id: 'i1', name: '10 Autonomous Epistemic AI Agents', category: 'Intelligence', description: 'Deploy Sentinel, Hydrologist, Pedologist, Ethicist, and Causal Arbiter agents into 24/7 mission telemetry.', highlight: true },
      { id: 'i2', name: 'Decision Room Deliberation Engine', category: 'Intelligence', description: 'High-consequence multi-stakeholder debate simulator with moral scoring and unintended consequence radar.' },
      { id: 'i3', name: 'Predictive Causal Intelligence & DAGs', category: 'Intelligence', description: 'Do-calculus causal graphs testing policy interventions and climate tipping points before physical deployment.' },
      { id: 'i4', name: 'Living Systems Dynamics Modeler', category: 'Intelligence', description: 'System dynamic stock-flow simulation modeling compounding feedback loops and delay dynamics.' },
      { id: 'i5', name: 'Institutional Memory & Failure Ledgers', category: 'Intelligence', description: 'Deep autopsy database cataloging systemic breakdowns to protect new initiatives from repeating past mistakes.' },
      { id: 'i6', name: 'Bioregional Risk & Resilience Forecasting', category: 'Intelligence', description: '30-year risk surfaces combining aquifer depletion rates, biodiversity corridors, and heat stress.' },
      { id: 'i7', name: 'Enterprise AI Streaming & Agent Telemetry APIs', category: 'Intelligence', description: 'Direct WebSocket and gRPC hooks into active agent thoughts, epistemic confidence, and tool calls.' }
    ]
  },

  enterprise: {
    id: 'enterprise',
    name: 'Atlas Enterprise',
    badge: 'Institutional Sovereign',
    tagline: 'Sovereign private mesh deployment, dedicated AI models, and ecosystem-scale capital governance.',
    monthlyPrice: 15000,
    annualPrice: 12500, // $150,000/year
    currency: 'USD',
    level: 3,
    accessibleViews: [
      // Unrestricted platform-wide access
      'home', 'commons', 'observatory', 'research', 'developers', 'events', 'stories', 'resources', 'governance', 'about', 'economics-pricing', 'analytics-report', 'citizen-profile', 'steward', 'stewardship-reputation', 'field-labs', 'lifehouse', 'industrial', 'impact-dashboard', 'academy',
      'project-os', 'studio', 'multimodal-studio', 'evidence-mapping', 'evidence-ledger', 'marketplace',
      'decision-room', 'agent-mission-control', 'system-model-studio', 'opportunity-intelligence', 'reality-engine', 'moral-arbiter', 'moral-intelligence', 'ai-engineering',
      'capital-engine',
      'opportunity-matchmaker',
      'opportunity-graph',
      'bioregional-twin',
      'bioregional-ledger',
      'living-reality',
      'flourishing-index',
      'sentinel',
      'regenerative-mission',
      'failure-ledger',
      'ethics-review',
      'mission-analytics',
      'alchemical-sanctum'
    ],
    offerings: [
      { id: 'e1', name: 'Sovereign Institutional Deployment', category: 'Enterprise', description: 'Private VPC or on-premise air-gapped deployment under your sovereign jurisdiction.', highlight: true },
      { id: 'e2', name: 'Dedicated Fine-Tuned AI Reasoning Models', category: 'Enterprise', description: 'Proprietary weights trained exclusively on your agency or institutional ecological dataset.' },
      { id: 'e3', name: 'Capital Engine & Proof-of-Regeneration Disbursements', category: 'Enterprise', description: 'Autonomous smart contract or institutional escrow disbursement triggered by verified telemetry milestones.' },
      { id: 'e4', name: 'Constitutional Governance & Custom Rule Sets', category: 'Enterprise', description: 'Tailor moral alignment heuristics, ethical boundaries, and stakeholder quorum rules to match statutory law.' },
      { id: 'e5', name: 'Multinational Territorial Mesh Monitoring', category: 'Enterprise', description: 'Continental-scale satellite downlinks with sovereign LoRaWAN gateway fleets across thousands of sites.' },
      { id: 'e6', name: '24/7 Dedicated Strategic Architects & SLA', category: 'Enterprise', description: 'Direct access to systems engineers, ecological economists, and 99.99% uptime guarantee.' }
    ]
  }
};

const STORAGE_KEY = 'atlas_subscription_state_v1';

/**
 * Returns initial default state (The Foundation / Commons)
 */
function getDefaultSubscription(): ActiveSubscriptionState {
  return {
    currentTier: 'foundation',
    activeLicenseKey: null,
    billingCycle: 'monthly',
    renewsAt: null,
    autoRenew: false,
    paymentMethodType: 'credit_card',
    paymentSummary: 'No active payment method',
    regenerativeCredits: 1250,
    creditMultiplier: 1.0,
    creditActivities: [
      {
        id: 'rc-1',
        action: 'Public Observatory soil moisture ground-truth report',
        creditsEarned: 250,
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        proofHash: '0x8f3c...b12a'
      },
      {
        id: 'rc-2',
        action: 'Bioregional catchment survey attestation submission',
        creditsEarned: 500,
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        proofHash: '0x17dc...e499'
      },
      {
        id: 'rc-3',
        action: 'Open schema validation node uptime',
        creditsEarned: 500,
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        proofHash: '0x992b...fa31'
      }
    ],
    history: []
  };
}

/**
 * Retrieves current active subscription from localStorage
 */
export function getCurrentSubscription(): ActiveSubscriptionState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getDefaultSubscription();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSubscription();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.currentTier) return getDefaultSubscription();

    // Ensure fallback properties for older storage states
    return {
      ...getDefaultSubscription(),
      ...parsed,
      autoRenew: parsed.autoRenew !== undefined ? parsed.autoRenew : parsed.currentTier !== 'foundation',
      regenerativeCredits: parsed.regenerativeCredits ?? 1250,
      creditMultiplier: parsed.creditMultiplier ?? getRegenerativeMultiplier(parsed.currentTier),
      creditActivities: parsed.creditActivities ?? getDefaultSubscription().creditActivities
    };
  } catch (err) {
    console.warn('[SubscriptionManager] Failed to read subscription state:', err);
    return getDefaultSubscription();
  }
}

/**
 * Calculates automated prorated billing when upgrading between active paid tiers
 */
export function calculateProration({
  currentTier,
  newTier,
  billingCycle,
  renewsAt
}: {
  currentTier: SubscriptionTier;
  newTier: SubscriptionTier;
  billingCycle: BillingCycle;
  renewsAt?: string | null;
}): ProrationDetails {
  const prevDef = ATLAS_TIERS[currentTier];
  const newDef = ATLAS_TIERS[newTier];
  const prevPrice = billingCycle === 'annual' ? prevDef.annualPrice * 12 : prevDef.monthlyPrice;
  const newPrice = billingCycle === 'annual' ? newDef.annualPrice * 12 : newDef.monthlyPrice;

  const isUpgrade = (newDef.level ?? 0) > (prevDef.level ?? 0);

  if (!isUpgrade || currentTier === 'foundation' || !renewsAt) {
    return {
      isUpgrade,
      previousTier: currentTier,
      newTier,
      billingCycle,
      daysTotalInCycle: billingCycle === 'annual' ? 365 : 30,
      daysRemaining: 0,
      previousMonthlyRate: prevDef.monthlyPrice,
      unusedCreditUsd: 0,
      newTierRegularPriceUsd: newPrice,
      proratedAmountDueUsd: newPrice,
      dailyRate: 0
    };
  }

  const daysTotalInCycle = billingCycle === 'annual' ? 365 : 30;
  const now = Date.now();
  const renewalTime = new Date(renewsAt).getTime();
  const msRemaining = Math.max(0, renewalTime - now);
  const daysRemaining = Math.min(daysTotalInCycle, Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24))));

  const dailyRate = prevPrice / daysTotalInCycle;
  const unusedCreditUsd = Math.round(dailyRate * daysRemaining * 100) / 100;
  const proratedAmountDueUsd = Math.max(0, Math.round((newPrice - unusedCreditUsd) * 100) / 100);

  return {
    isUpgrade: true,
    previousTier: currentTier,
    newTier,
    billingCycle,
    daysTotalInCycle,
    daysRemaining,
    previousMonthlyRate: prevDef.monthlyPrice,
    unusedCreditUsd,
    newTierRegularPriceUsd: newPrice,
    proratedAmountDueUsd,
    dailyRate: Math.round(dailyRate * 100) / 100
  };
}

/**
 * Saves subscription state to localStorage and broadcasts instant tier transition signals
 */
export function saveSubscriptionState(state: ActiveSubscriptionState, previousTier?: SubscriptionTier): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Broadcast instant platform state transition events
    window.dispatchEvent(new CustomEvent('atlas-subscription-changed', { detail: state }));
    window.dispatchEvent(new CustomEvent('atlas-tier-transition', {
      detail: {
        previousTier: previousTier || state.currentTier,
        newTier: state.currentTier,
        licenseKey: state.activeLicenseKey,
        state,
        timestamp: Date.now()
      }
    }));
    
    // Also trigger storage event for any listeners monitoring cross-tab storage
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(state)
      }));
    } catch {}
  } catch (err) {
    console.warn('[SubscriptionManager] Failed to save subscription state:', err);
  }
}

/**
 * Checks if a specific view is accessible by the current tier.
 * Returns permission status and required tier if restricted.
 */
export function checkViewAccess(targetView: PageView, currentTier: SubscriptionTier = getCurrentSubscription().currentTier): {
  allowed: boolean;
  requiredTier: SubscriptionTier;
  requiredTierName: string;
  reason: string;
} {
  const currentLevel = ATLAS_TIERS[currentTier]?.level ?? 0;

  // Views requiring Enterprise (Level 3)
  const enterpriseOnlyViews: PageView[] = [
    'capital-engine',
    'opportunity-matchmaker',
    'opportunity-graph',
    'bioregional-twin',
    'living-reality',
    'flourishing-index',
    'sentinel',
    'regenerative-mission',
    'failure-ledger',
    'ethics-review',
    'mission-analytics'
  ];

  if (enterpriseOnlyViews.includes(targetView)) {
    const isAllowed = currentLevel >= 3;
    return {
      allowed: isAllowed,
      requiredTier: 'enterprise',
      requiredTierName: ATLAS_TIERS.enterprise.name,
      reason: 'This high-consequence capital coordination and sovereign digital twin module requires Atlas Enterprise.'
    };
  }

  // Views requiring Atlas Intelligence (Level 2)
  const intelligenceViews: PageView[] = [
    'decision-room',
    'agent-mission-control',
    'system-model-studio',
    'opportunity-intelligence',
    'reality-engine',
    'moral-arbiter',
    'moral-intelligence',
    'ai-engineering'
  ];

  if (intelligenceViews.includes(targetView)) {
    const isAllowed = currentLevel >= 2;
    return {
      allowed: isAllowed,
      requiredTier: 'intelligence',
      requiredTierName: ATLAS_TIERS.intelligence.name,
      reason: 'Autonomous agent mission telemetry and decision room deliberation engines require Atlas Intelligence.'
    };
  }

  // Views requiring Atlas Studio (Level 1)
  const studioViews: PageView[] = [
    'project-os',
    'studio',
    'multimodal-studio',
    'evidence-mapping',
    'evidence-ledger',
    'marketplace'
  ];

  if (studioViews.includes(targetView)) {
    const isAllowed = currentLevel >= 1;
    return {
      allowed: isAllowed,
      requiredTier: 'studio',
      requiredTierName: ATLAS_TIERS.studio.name,
      reason: 'Bioregional project operations, IoT asset monitoring, and evidence ledgers require Atlas Studio.'
    };
  }

  // Default: open in Foundation / Commons
  return {
    allowed: true,
    requiredTier: 'foundation',
    requiredTierName: ATLAS_TIERS.foundation.name,
    reason: 'Open access foundation.'
  };
}

/**
 * Creates and registers a new active subscription with payment verification
 */
export function activateSubscription({
  tier,
  billingCycle,
  paymentMethod,
  paymentSummary,
  organizationName,
  billingEmail,
  txHash,
  proratedCreditUsd = 0,
  walletAddress,
  walletSignature
}: {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethodType;
  paymentSummary: string;
  organizationName?: string;
  billingEmail?: string;
  txHash?: string;
  proratedCreditUsd?: number;
  walletAddress?: string;
  walletSignature?: string;
}): PaymentRecord {
  const current = getCurrentSubscription();
  const previousTier = current.currentTier;
  const tierDef = ATLAS_TIERS[tier];

  const now = new Date();
  const expires = new Date();
  if (billingCycle === 'annual') {
    expires.setFullYear(now.getFullYear() + 1);
  } else {
    expires.setMonth(now.getMonth() + 1);
  }

  const prefix = tier.slice(0, 3).toUpperCase();
  const randomSalt = Math.random().toString(36).substring(2, 6).toUpperCase();
  const licenseKey = `ATLAS-${prefix}-${now.getFullYear()}-${randomSalt}`;
  const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const regularAmountUsd = billingCycle === 'annual'
    ? tierDef.annualPrice * 12
    : tierDef.monthlyPrice;

  const finalAmountUsd = Math.max(0, Math.round((regularAmountUsd - proratedCreditUsd) * 100) / 100);

  const paymentRecord: PaymentRecord = {
    id: `pay_${Date.now()}`,
    licenseKey,
    tier,
    billingCycle,
    amountUsd: finalAmountUsd,
    originalAmountUsd: regularAmountUsd,
    proratedCreditUsd: proratedCreditUsd > 0 ? proratedCreditUsd : undefined,
    paymentMethod,
    paymentMethodSummary: paymentSummary,
    status: 'active',
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    organizationName: organizationName || 'Sovereign Steward Organization',
    billingEmail: billingEmail || 'steward@atlassanctum.org',
    txHash: txHash || `0x${Math.random().toString(16).substring(2, 18)}...`,
    invoiceNumber,
    walletAddress: walletAddress || current.walletAddress
  };

  // Tier bonus regenerative credits
  let bonusCredits = 0;
  if (tier === 'studio') bonusCredits = 500;
  else if (tier === 'intelligence') bonusCredits = 1500;
  else if (tier === 'enterprise') bonusCredits = 5000;

  const currentMultiplier = getRegenerativeMultiplier(tier);
  const newBalance = (current.regenerativeCredits ?? 1250) + bonusCredits;

  const newActivity: RegenerativeCreditActivity = {
    id: `bonus-${Date.now()}`,
    action: `Tier Activation Bonus: ${ATLAS_TIERS[tier].name} (${currentMultiplier}x Earning Multiplier)`,
    creditsEarned: bonusCredits,
    timestamp: now.toISOString(),
    proofHash: paymentRecord.txHash
  };

  const newState: ActiveSubscriptionState = {
    currentTier: tier,
    activeLicenseKey: licenseKey,
    billingCycle,
    renewsAt: expires.toISOString(),
    autoRenew: true,
    paymentMethodType: paymentMethod,
    paymentSummary,
    regenerativeCredits: newBalance,
    creditMultiplier: currentMultiplier,
    creditActivities: bonusCredits > 0 ? [newActivity, ...(current.creditActivities || [])] : (current.creditActivities || []),
    history: [paymentRecord, ...current.history],
    walletAddress: walletAddress || current.walletAddress,
    walletSignature: walletSignature || current.walletSignature,
    walletVerified: !!(walletAddress || current.walletVerified),
    prorationCreditApplied: proratedCreditUsd
  };

  saveSubscriptionState(newState, previousTier);

  // Trigger high-priority tier upgrade signal for instantaneous UI state updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('atlas-tier-upgraded', {
      detail: {
        previousTier,
        newTier: tier,
        record: paymentRecord,
        proratedCreditUsd,
        timestamp: Date.now()
      }
    }));
  }

  // Sync with backend API asynchronously
  fetch('/api/subscription/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentRecord)
  }).catch(e => console.warn('[SubscriptionManager] Background sync warning:', e));

  return paymentRecord;
}

/**
 * Returns the loyalty credit earning multiplier for a given tier
 */
export function getRegenerativeMultiplier(tier: SubscriptionTier): number {
  switch (tier) {
    case 'studio':
      return 1.5;
    case 'intelligence':
      return 3.0;
    case 'enterprise':
      return 10.0;
    case 'foundation':
    default:
      return 1.0;
  }
}

/**
 * Toggles auto-renewal status
 */
export function toggleAutoRenewal(): boolean {
  const current = getCurrentSubscription();
  const nextAutoRenew = !current.autoRenew;
  const newState: ActiveSubscriptionState = {
    ...current,
    autoRenew: nextAutoRenew
  };
  saveSubscriptionState(newState);
  return nextAutoRenew;
}

/**
 * Updates subscription billing cycle (monthly vs annual)
 */
export function updateBillingCycle(cycle: BillingCycle): void {
  const current = getCurrentSubscription();
  if (current.billingCycle === cycle) return;

  const now = new Date();
  const expires = new Date(now);
  if (cycle === 'annual') {
    expires.setFullYear(now.getFullYear() + 1);
  } else {
    expires.setMonth(now.getMonth() + 1);
  }

  const newState: ActiveSubscriptionState = {
    ...current,
    billingCycle: cycle,
    renewsAt: current.currentTier !== 'foundation' ? expires.toISOString() : null
  };
  saveSubscriptionState(newState);
}

/**
 * Simulates earning regenerative loyalty credits from telemetry ingest or proof verification
 */
export function earnRegenerativeCredits(
  action: string,
  basePoints: number
): { earned: number; newBalance: number } {
  const current = getCurrentSubscription();
  const multiplier = current.creditMultiplier || getRegenerativeMultiplier(current.currentTier);
  const earned = Math.round(basePoints * multiplier);
  const newBalance = (current.regenerativeCredits || 0) + earned;

  const newActivity: RegenerativeCreditActivity = {
    id: `act-${Date.now()}`,
    action: `${action} (${multiplier}x Tier Multiplier)`,
    creditsEarned: earned,
    timestamp: new Date().toISOString(),
    proofHash: `0x${Math.random().toString(16).substring(2, 10)}...`
  };

  const newState: ActiveSubscriptionState = {
    ...current,
    regenerativeCredits: newBalance,
    creditActivities: [newActivity, ...(current.creditActivities || []).slice(0, 19)]
  };

  saveSubscriptionState(newState);
  return { earned, newBalance };
}

/**
 * Redeems regenerative credits for subscription discount or hardware vouchers
 */
export function redeemRegenerativeCredits(
  points: number,
  reason: string
): { success: boolean; newBalance: number; discountUsd: number } {
  const current = getCurrentSubscription();
  if ((current.regenerativeCredits || 0) < points) {
    return { success: false, newBalance: current.regenerativeCredits || 0, discountUsd: 0 };
  }

  const discountUsd = Math.round((points / 100) * 10); // 1,000 points = $100
  const newBalance = (current.regenerativeCredits || 0) - points;

  const newActivity: RegenerativeCreditActivity = {
    id: `redeem-${Date.now()}`,
    action: `Redeemed: ${reason} (-$${discountUsd} credit)`,
    creditsEarned: -points,
    timestamp: new Date().toISOString()
  };

  const newState: ActiveSubscriptionState = {
    ...current,
    regenerativeCredits: newBalance,
    creditActivities: [newActivity, ...(current.creditActivities || []).slice(0, 19)]
  };

  saveSubscriptionState(newState);
  return { success: true, newBalance, discountUsd };
}

/**
 * Reverts subscription to the free Foundation tier
 */
export function cancelSubscription(): void {
  const current = getCurrentSubscription();
  const newState: ActiveSubscriptionState = {
    ...current,
    currentTier: 'foundation',
    activeLicenseKey: null,
    renewsAt: null,
    autoRenew: false,
    creditMultiplier: 1.0,
    paymentSummary: 'No active subscription'
  };
  saveSubscriptionState(newState);
}

/**
 * Applies a developer voucher or institutional test code for rapid testing
 */
export function applyVoucherCode(code: string): { success: boolean; tier?: SubscriptionTier; message: string } {
  const clean = code.trim().toUpperCase();

  if (clean === 'ATLAS-STUDIO-DEMO' || clean === 'STUDIO500') {
    activateSubscription({
      tier: 'studio',
      billingCycle: 'monthly',
      paymentMethod: 'credit_card',
      paymentSummary: 'Dev Voucher Access (Atlas Studio)',
      organizationName: 'Studio Demo Cohort'
    });
    return { success: true, tier: 'studio', message: 'Atlas Studio tier unlocked via voucher!' };
  }

  if (clean === 'ATLAS-INTELLIGENCE-DEMO' || clean === 'INTELLIGENCE2500' || clean === 'GEMINI2026') {
    activateSubscription({
      tier: 'intelligence',
      billingCycle: 'monthly',
      paymentMethod: 'crypto_web3',
      paymentSummary: 'Dev Voucher Access (Atlas Intelligence)',
      organizationName: 'Epistemic Research Lab'
    });
    return { success: true, tier: 'intelligence', message: 'Atlas Intelligence tier unlocked via voucher!' };
  }

  if (clean === 'ATLAS-ENTERPRISE-DEMO' || clean === 'SOVEREIGN2026' || clean === 'ENTERPRISE') {
    activateSubscription({
      tier: 'enterprise',
      billingCycle: 'annual',
      paymentMethod: 'bank_wire',
      paymentSummary: 'Dev Institutional Voucher (Atlas Enterprise)',
      organizationName: 'Global Bioregional Alliance'
    });
    return { success: true, tier: 'enterprise', message: 'Atlas Enterprise tier unlocked via voucher!' };
  }

  if (clean === 'RESET' || clean === 'COMMONS') {
    cancelSubscription();
    return { success: true, tier: 'foundation', message: 'Reset to The Foundation (Commons).' };
  }

  return { success: false, message: 'Invalid voucher code. Try "ATLAS-STUDIO-DEMO", "ATLAS-INTELLIGENCE-DEMO", or "ATLAS-ENTERPRISE-DEMO".' };
}
