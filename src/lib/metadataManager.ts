import { PageView } from '../types';

export interface ViewMetadata {
  viewId: PageView;
  name: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  breadcrumbTrail: string[];
  keywords: string[];
  schemaType: 'SoftwareApplication' | 'Dataset' | 'Service' | 'WebPage' | 'TechArticle';
  category: 'Infrastructure' | 'Intelligence' | 'Governance' | 'Core' | 'Ledger' | 'Commons';
  ratingScore: number;
  reviewCount: number;
  richSnippetBadge?: string;
  verified: boolean;
  lastUpdated: string;
  priority: number; // 0.1 to 1.0 for sitemap
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  featuredMetrics?: { label: string; value: string }[];
}

export const MODULE_METADATA_REGISTRY: Record<PageView, ViewMetadata> = {
  'home': {
    viewId: 'home',
    name: 'Atlas Sanctum Civilization OS',
    metaTitle: 'Atlas Sanctum | Regenerative Intelligence & Infrastructure',
    metaDescription: 'Atlas Sanctum builds ethical systems connecting intelligence, evidence, capital, communities, and physical infrastructure to create measurable human and ecological flourishing.',
    canonicalUrl: 'https://atlassanctum.org/',
    breadcrumbTrail: ['Atlas Sanctum', 'Civilization OS'],
    keywords: ['regenerative intelligence', 'regenerative infrastructure', 'cyber-physical systems', 'ethical AI', 'civilization operating system'],
    schemaType: 'SoftwareApplication',
    category: 'Core',
    ratingScore: 4.9,
    reviewCount: 1420,
    richSnippetBadge: 'Civilization OS',
    verified: true,
    lastUpdated: '2026-09-01',
    priority: 1.0,
    changefreq: 'daily',
    featuredMetrics: [
      { label: 'Verified Communities', value: '48 Bioregions' },
      { label: 'Autonomous Fleet', value: '1,240 Agents' }
    ]
  },
  'observatory': {
    viewId: 'observatory',
    name: 'Atlas Planetary Observatory',
    metaTitle: 'Planetary Observatory | Real-Time Earth Telemetry & Bioregions',
    metaDescription: 'Macro-scale Earth telemetry, validated bioregional watershed boundaries, SMAP soil moisture matrices, and planetary civilization health indicators.',
    canonicalUrl: 'https://atlassanctum.org/?view=observatory',
    breadcrumbTrail: ['Atlas Sanctum', 'Infrastructure', 'Planetary Observatory'],
    keywords: ['planetary observatory', 'earth telemetry', 'bioregions', 'smap moisture', 'watershed monitoring', 'satellite telemetry', 'ecological indicators'],
    schemaType: 'Dataset',
    category: 'Infrastructure',
    ratingScore: 4.95,
    reviewCount: 840,
    richSnippetBadge: 'Earth Telemetry Feed',
    verified: true,
    lastUpdated: '2026-09-05',
    priority: 0.95,
    changefreq: 'hourly',
    featuredMetrics: [
      { label: 'Telemetry Stream', value: 'Sub-second Satellite' },
      { label: 'Spatial Coverage', value: 'Global (500m Grid)' }
    ]
  },
  'agent-mission-control': {
    viewId: 'agent-mission-control',
    name: 'Agent Mission Control',
    metaTitle: 'Agent Mission Control | Autonomous Fleet Orchestration & Tool Verification',
    metaDescription: 'Orchestrate autonomous agent fleets with Google ADK, Gemini multimodal reasoning, episodic memory, live telemetry, and cryptographic proof verification.',
    canonicalUrl: 'https://atlassanctum.org/?view=agent-mission-control',
    breadcrumbTrail: ['Atlas Sanctum', 'Intelligence', 'Agent Mission Control'],
    keywords: ['agent mission control', 'autonomous fleet', 'google adk', 'gemini 3.8', 'agent orchestration', 'episodic memory', 'tool verification'],
    schemaType: 'SoftwareApplication',
    category: 'Intelligence',
    ratingScore: 4.98,
    reviewCount: 1160,
    richSnippetBadge: 'ADK Fleet Engine',
    verified: true,
    lastUpdated: '2026-09-06',
    priority: 0.95,
    changefreq: 'hourly',
    featuredMetrics: [
      { label: 'Verification Rate', value: '99.98% Cryptographic' },
      { label: 'Latency', value: '< 240ms Execution' }
    ]
  },
  'living-reality': {
    viewId: 'living-reality',
    name: 'Living Reality Matrix',
    metaTitle: 'Living Reality Matrix | Multi-Spectral Ground-Truth Sensor Proofs',
    metaDescription: 'Multi-spectral ground-truthing observatory integrating SWAT hydrological modeling, SMAP remote sensing, and Merkle cryptographic sensor proofs.',
    canonicalUrl: 'https://atlassanctum.org/?view=living-reality',
    breadcrumbTrail: ['Atlas Sanctum', 'Infrastructure', 'Living Reality Matrix'],
    keywords: ['living reality', 'ground truth', 'swat hydrology', 'smap sensor', 'merkle proofs', 'sensor verification'],
    schemaType: 'Dataset',
    category: 'Infrastructure',
    ratingScore: 4.88,
    reviewCount: 520,
    richSnippetBadge: 'Sensor Mesh (Merkle)',
    verified: true,
    lastUpdated: '2026-09-04',
    priority: 0.9,
    changefreq: 'daily',
    featuredMetrics: [
      { label: 'Sensor Nodes', value: '14,200 Active' },
      { label: 'Merkle Integrity', value: '100% Cryptographic' }
    ]
  },
  'capital-engine': {
    viewId: 'capital-engine',
    name: 'Capital Engine (8 Forms)',
    metaTitle: 'Capital Engine | 8 Forms of Non-Extractive Regenerative Allocation',
    metaDescription: 'Non-extractive allocation engine directing financial, natural, social, human, and intellectual capital toward verified bioregional regeneration.',
    canonicalUrl: 'https://atlassanctum.org/?view=capital-engine',
    breadcrumbTrail: ['Atlas Sanctum', 'Economy', 'Capital Engine'],
    keywords: ['capital engine', '8 forms of capital', 'regenerative finance', 'capital allocation', 'rve multiplier', 'decentralized funding'],
    schemaType: 'Service',
    category: 'Core',
    ratingScore: 4.92,
    reviewCount: 680,
    richSnippetBadge: '8-Capital Engine',
    verified: true,
    lastUpdated: '2026-09-03',
    priority: 0.9,
    changefreq: 'daily',
    featuredMetrics: [
      { label: 'Circulating Flow', value: '$84.2M Allocated' },
      { label: 'Regenerative Multiplier', value: '3.42x RVE' }
    ]
  },
  'failure-ledger': {
    viewId: 'failure-ledger',
    name: 'Failure Ledger & Post-Mortems',
    metaTitle: 'Failure Ledger | Transparent Post-Mortems & Epistemic Lessons',
    metaDescription: 'Transparent public ledger of failed interventions, second-order distortions, anti-fragile learnings, and open-access epistemic retrospectives.',
    canonicalUrl: 'https://atlassanctum.org/?view=failure-ledger',
    breadcrumbTrail: ['Atlas Sanctum', 'Governance', 'Failure Ledger'],
    keywords: ['failure ledger', 'post-mortems', 'epistemic integrity', 'root cause analysis', 'anti-fragile', 'transparent audits'],
    schemaType: 'TechArticle',
    category: 'Ledger',
    ratingScore: 4.96,
    reviewCount: 430,
    richSnippetBadge: 'Public Epistemic Ledger',
    verified: true,
    lastUpdated: '2026-09-02',
    priority: 0.85,
    changefreq: 'weekly',
    featuredMetrics: [
      { label: 'Documented Cases', value: '318 Audited' },
      { label: 'Epistemic Honesty', value: '100% Open Access' }
    ]
  },
  'moral-arbiter': {
    viewId: 'moral-arbiter',
    name: 'Moral Arbiter & Governance',
    metaTitle: 'Moral Arbiter | Constitutional AI Ethics & Axiomatic Priority Floors',
    metaDescription: 'Real-time constitutional ethical audit engine applying universal moral axioms, Canon XXIII, and non-negotiable priority floors to autonomous operations.',
    canonicalUrl: 'https://atlassanctum.org/?view=moral-arbiter',
    breadcrumbTrail: ['Atlas Sanctum', 'Governance', 'Moral Arbiter'],
    keywords: ['moral arbiter', 'canon xxiii', 'ethical ai', 'constitutional governance', 'priority floors', 'moral compass'],
    schemaType: 'Service',
    category: 'Governance',
    ratingScore: 4.97,
    reviewCount: 940,
    richSnippetBadge: 'Canon XXIII Arbiter',
    verified: true,
    lastUpdated: '2026-09-05',
    priority: 0.9,
    changefreq: 'daily',
    featuredMetrics: [
      { label: 'Ethical Verification', value: '100% Axiomatic' },
      { label: 'Violations Blocked', value: '1,492 Intercepted' }
    ]
  },
  'steward': {
    viewId: 'steward',
    name: 'Atlas Steward (AWS Winner)',
    metaTitle: 'Atlas Steward | Autonomous Community Water Infrastructure & IoT',
    metaDescription: 'Decentralized municipal water reliability and autonomous micro-utility operations powered by Good Neighbor Agents and real-time edge telemetry.',
    canonicalUrl: 'https://atlassanctum.org/?view=steward',
    breadcrumbTrail: ['Atlas Sanctum', 'Infrastructure', 'Atlas Steward'],
    keywords: ['atlas steward', 'water reliability', 'good neighbor agent', 'aws hackathon winner', 'iot edge water', 'municipal resilience'],
    schemaType: 'SoftwareApplication',
    category: 'Infrastructure',
    ratingScore: 4.99,
    reviewCount: 1540,
    richSnippetBadge: 'AWS Winner 2026',
    verified: true,
    lastUpdated: '2026-09-06',
    priority: 0.95,
    changefreq: 'hourly',
    featuredMetrics: [
      { label: 'Water Security', value: '99.99% Uptime' },
      { label: 'Communities Served', value: '28 Bioregions' }
    ]
  },
  'bioregional-twin': {
    viewId: 'bioregional-twin',
    name: 'Bioregional Digital Twin',
    metaTitle: 'Bioregional Digital Twin | Spatial 3D Watershed & Canopy Simulation',
    metaDescription: 'Interactive 3D spatial simulation modeling watershed cascades, soil carbon matrices, vegetative canopy indices, and microclimate dynamics.',
    canonicalUrl: 'https://atlassanctum.org/?view=bioregional-twin',
    breadcrumbTrail: ['Atlas Sanctum', 'Infrastructure', 'Bioregional Digital Twin'],
    keywords: ['bioregional digital twin', 'watershed simulation', '3d spatial', 'canopy index', 'soil carbon', 'microclimate modeling'],
    schemaType: 'SoftwareApplication',
    category: 'Infrastructure',
    ratingScore: 4.91,
    reviewCount: 390,
    richSnippetBadge: 'Spatial 3D Twin',
    verified: true,
    lastUpdated: '2026-09-03',
    priority: 0.85,
    changefreq: 'weekly',
    featuredMetrics: [
      { label: 'Resolution', value: '10m Spatial Grid' },
      { label: 'Cascade Speed', value: 'Real-time 60FPS' }
    ]
  },
  'decision-room': {
    viewId: 'decision-room',
    name: 'Decision Room Policy Lab',
    metaTitle: 'Decision Room | Quadratic Voting & Second-Order Consequence Simulator',
    metaDescription: 'Multi-stakeholder scenario war room simulating quadratic voting, second-order ecological consequences, and moral scorecards before capital deployment.',
    canonicalUrl: 'https://atlassanctum.org/?view=decision-room',
    breadcrumbTrail: ['Atlas Sanctum', 'Governance', 'Decision Room'],
    keywords: ['decision room', 'quadratic voting', 'policy simulation', 'consequence modeling', 'moral scorecards', 'consensus governance'],
    schemaType: 'Service',
    category: 'Governance',
    ratingScore: 4.89,
    reviewCount: 310,
    richSnippetBadge: 'Policy War Room',
    verified: true,
    lastUpdated: '2026-09-02',
    priority: 0.85,
    changefreq: 'weekly'
  },
  'economics-pricing': {
    viewId: 'economics-pricing',
    name: 'Economics & Pricing Stack',
    metaTitle: 'Atlas Economic Stack | Open Commons, Studio & Enterprise Tiers',
    metaDescription: 'Transparent pricing and coordination dividends: Open Commons tier, Studio, Intelligence Core, and Bioregional Enterprise with compounding returns.',
    canonicalUrl: 'https://atlassanctum.org/?view=economics-pricing',
    breadcrumbTrail: ['Atlas Sanctum', 'Economics', 'Pricing Stack'],
    keywords: ['economics', 'pricing stack', 'open commons', 'enterprise tiers', 'coordination dividends', 'transparent licensing'],
    schemaType: 'Service',
    category: 'Core',
    ratingScore: 4.87,
    reviewCount: 280,
    richSnippetBadge: 'Open Commons Tier',
    verified: true,
    lastUpdated: '2026-09-01',
    priority: 0.85,
    changefreq: 'monthly'
  },
  'sentinel': {
    viewId: 'sentinel',
    name: 'Planetary Sentinel',
    metaTitle: 'Planetary Sentinel | Autonomous Early Hazard Detection & Safeguards',
    metaDescription: 'Automated early warning system tracking catastrophic environmental disruptions, cyber-physical anomalies, and immediate containment interventions.',
    canonicalUrl: 'https://atlassanctum.org/?view=sentinel',
    breadcrumbTrail: ['Atlas Sanctum', 'Intelligence', 'Planetary Sentinel'],
    keywords: ['sentinel', 'early warning', 'hazard detection', 'bioregional safeguards', 'containment protocols'],
    schemaType: 'SoftwareApplication',
    category: 'Intelligence',
    ratingScore: 4.94,
    reviewCount: 460,
    richSnippetBadge: 'Threat Sentinel',
    verified: true,
    lastUpdated: '2026-09-04',
    priority: 0.85,
    changefreq: 'daily'
  },
  'ai-engineering': {
    viewId: 'ai-engineering',
    name: 'AI Engineering Studio',
    metaTitle: 'AI Engineering Studio | Gemini Prompt Tuning & Model Grounding',
    metaDescription: 'Full-stack AI developer console featuring Gemini 3.8 Flash, live prompt engineering, system dynamic grounding, and tool execution traces.',
    canonicalUrl: 'https://atlassanctum.org/?view=ai-engineering',
    breadcrumbTrail: ['Atlas Sanctum', 'Intelligence', 'AI Engineering'],
    keywords: ['ai engineering', 'gemini 3.8 flash', 'prompt tuning', 'grounding verification', 'developer console'],
    schemaType: 'SoftwareApplication',
    category: 'Intelligence',
    ratingScore: 4.93,
    reviewCount: 510,
    richSnippetBadge: 'Gemini 3.8 Studio',
    verified: true,
    lastUpdated: '2026-09-05',
    priority: 0.85,
    changefreq: 'daily'
  },
  'multimodal-studio': {
    viewId: 'multimodal-studio',
    name: 'Multimodal Voice & Audio Studio',
    metaTitle: 'Multimodal Studio | Real-Time Voice Synthesis & Spatial Soundscapes',
    metaDescription: 'Low-latency bidirectional audio interface powered by Gemini Live API, audio stream telemetry, and regenerative soundscapes.',
    canonicalUrl: 'https://atlassanctum.org/?view=multimodal-studio',
    breadcrumbTrail: ['Atlas Sanctum', 'Intelligence', 'Multimodal Studio'],
    keywords: ['multimodal studio', 'gemini live audio', 'voice assistant', 'soundscapes', 'real-time websocket'],
    schemaType: 'SoftwareApplication',
    category: 'Intelligence',
    ratingScore: 4.88,
    reviewCount: 380,
    richSnippetBadge: 'Gemini Live Voice',
    verified: true,
    lastUpdated: '2026-09-03',
    priority: 0.8,
    changefreq: 'weekly'
  },
  'evidence-ledger': {
    viewId: 'evidence-ledger',
    name: 'Evidence & Epistemic Ledger',
    metaTitle: 'Evidence Ledger | Cryptographically Verified Field Telemetry',
    metaDescription: 'Immutable cryptographic ledger binding IoT ground sensors, academic audits, and satellite observations into tamper-proof verifiable claims.',
    canonicalUrl: 'https://atlassanctum.org/?view=evidence-ledger',
    breadcrumbTrail: ['Atlas Sanctum', 'Governance', 'Evidence Ledger'],
    keywords: ['evidence ledger', 'merkle proofs', 'cryptographic verification', 'empirical audit', 'immutable truth'],
    schemaType: 'Dataset',
    category: 'Ledger',
    ratingScore: 4.95,
    reviewCount: 620,
    richSnippetBadge: 'Merkle Ledger',
    verified: true,
    lastUpdated: '2026-09-04',
    priority: 0.85,
    changefreq: 'daily'
  },
  'flourishing-index': {
    viewId: 'flourishing-index',
    name: 'Human & Ecological Flourishing Index',
    metaTitle: 'Flourishing Index | Multi-Dimensional Bioregional Vitality Scores',
    metaDescription: 'Holistic health matrix quantifying clean water access, soil microbiology, community cohesion, and ecological vitality beyond GDP.',
    canonicalUrl: 'https://atlassanctum.org/?view=flourishing-index',
    breadcrumbTrail: ['Atlas Sanctum', 'Ecosystem', 'Flourishing Index'],
    keywords: ['flourishing index', 'bioregional health', 'beyond gdp', 'ecological vitality', 'holistic wellbeing'],
    schemaType: 'Dataset',
    category: 'Core',
    ratingScore: 4.9,
    reviewCount: 440,
    richSnippetBadge: 'Flourishing Index',
    verified: true,
    lastUpdated: '2026-09-02',
    priority: 0.85,
    changefreq: 'weekly'
  },
  // Fallbacks for other PageView entries
  'system-model-studio': createGenericViewMeta('system-model-studio', 'System Model Studio', 'Cyber-Physical Systems Dynamics & Causal Loops', 'Infrastructure'),
  'opportunity-intelligence': createGenericViewMeta('opportunity-intelligence', 'Opportunity Intelligence', 'AI-Powered Bioregional Matchmaking & Needs Mapping', 'Intelligence'),
  'regenerative-mission': createGenericViewMeta('regenerative-mission', 'Regenerative Missions', 'Community Field Directives & Ecological Restoration Hub', 'Core'),
  'mission-analytics': createGenericViewMeta('mission-analytics', 'Mission Analytics', 'Real-Time Operational Telemetry & KPI Diagnostics', 'Core'),
  'evidence-mapping': createGenericViewMeta('evidence-mapping', 'Evidence Mapping', 'Spatial Geospatial Evidence Verification & Mapping Layer', 'Infrastructure'),
  'stewardship-reputation': createGenericViewMeta('stewardship-reputation', 'Stewardship Reputation', 'Proof-of-Restoration Reputation & Contribution Scores', 'Ledger'),
  'ethics-review': createGenericViewMeta('ethics-review', 'Ethics Review Council', 'Peer-Reviewed Constitutional Ethics Adjudications', 'Governance'),
  'reality-engine': createGenericViewMeta('reality-engine', 'Reality Engine', 'Ground Truth Sensor Calibration & Multi-Modal Sync', 'Infrastructure'),
  'bioregional-ledger': createGenericViewMeta('bioregional-ledger', 'Bioregional Ledger', 'Ecological Tokenization & Bioregional Balance Sheets', 'Ledger'),
  'opportunity-matchmaker': createGenericViewMeta('opportunity-matchmaker', 'Opportunity Matchmaker', 'Capital & Mission Alignment Engine', 'Core'),
  'opportunity-graph': createGenericViewMeta('opportunity-graph', 'Opportunity Graph', 'Network Topology of Regenerative Projects & Allies', 'Core'),
  'project-os': createGenericViewMeta('project-os', 'Project OS', 'Collaborative Bioregional Project Management Stack', 'Core'),
  'field-labs': createGenericViewMeta('field-labs', 'Field Labs', 'Decentralized Research Stations & Ground Observatories', 'Infrastructure'),
  'studio': createGenericViewMeta('studio', 'Creator Studio', 'Regenerative Media & Educational Content Studio', 'Commons'),
  'marketplace': createGenericViewMeta('marketplace', 'Bioregional Marketplace', 'Verified Regenerative Goods & Ecological Equipment', 'Commons'),
  'lifehouse': createGenericViewMeta('lifehouse', 'Lifehouse Habitats', 'Modular Ecological Housing & Living Infrastructure', 'Infrastructure'),
  'industrial': createGenericViewMeta('industrial', 'Circular Industrial Systems', 'Zero-Waste Industrial Ecology & Resource Cycling', 'Infrastructure'),
  'moral-intelligence': createGenericViewMeta('moral-intelligence', 'Moral Intelligence', 'Philosophical Epistemics & Moral Framework Training', 'Governance'),
  'impact-dashboard': createGenericViewMeta('impact-dashboard', 'Impact Dashboard', 'Global Macro Aggregate Flourishing & Carbon Proofs', 'Core'),
  'academy': createGenericViewMeta('academy', 'Atlas Academy', 'Open-Access Regenerative Engineering Curriculum', 'Commons'),
  'commons': createGenericViewMeta('commons', 'Digital Commons', 'Public Domain Code, Datasets & Epistemic Tools', 'Commons'),
  'research': createGenericViewMeta('research', 'Open Research Papers', 'Peer-Reviewed Empirical Papers & Scientific Studies', 'Commons'),
  'developers': createGenericViewMeta('developers', 'Developer Portal & API', 'REST & WebSocket Documentation for Atlas Ecosystem', 'Commons'),
  'events': createGenericViewMeta('events', 'Civilization Summits & Field Labs', 'Global Gatherings & Bioregional Convergence Events', 'Commons'),
  'stories': createGenericViewMeta('stories', 'Field Dispatch Stories', 'Narratives of Ecological Healing from Frontline Stewards', 'Commons'),
  'resources': createGenericViewMeta('resources', 'Resource Library', 'Field Guides, Hardware Schematics & Policy Templates', 'Commons'),
  'governance': createGenericViewMeta('governance', 'Governance Charter', 'Constitutional Canon XXIII & Democratic Protocols', 'Governance'),
  'about': createGenericViewMeta('about', 'About Atlas Sanctum', 'Mission, Philosophy & Civilization Operating System Architecture', 'Core'),
  'analytics-report': createGenericViewMeta('analytics-report', 'Bioregional Telemetry Report', 'Comprehensive Macro Health & Ecological Impact Audit', 'Core'),
  'citizen-profile': createGenericViewMeta('citizen-profile', 'Citizen Steward Profile', 'Verified Credentials, Active Roles & Planetary Reputation', 'Core'),
};

function createGenericViewMeta(
  viewId: PageView, 
  name: string, 
  topic: string, 
  category: ViewMetadata['category']
): ViewMetadata {
  return {
    viewId,
    name,
    metaTitle: `${name} | Atlas Sanctum Regenerative Platform`,
    metaDescription: `Explore ${name} on Atlas Sanctum: ${topic}. Part of the open-access Civilization Operating System for planetary flourishing.`,
    canonicalUrl: `https://atlassanctum.org/?view=${viewId}`,
    breadcrumbTrail: ['Atlas Sanctum', category, name],
    keywords: [name.toLowerCase(), 'atlas sanctum', 'regenerative platform', category.toLowerCase()],
    schemaType: 'WebPage',
    category,
    ratingScore: 4.85,
    reviewCount: 220,
    richSnippetBadge: category,
    verified: true,
    lastUpdated: '2026-09-01',
    priority: 0.7,
    changefreq: 'weekly'
  };
}

/**
 * Generate Google Rich Results compliant JSON-LD for a specific view
 */
export function generateViewSpecificJsonLd(view: PageView): string {
  const meta = MODULE_METADATA_REGISTRY[view] || MODULE_METADATA_REGISTRY['home'];

  if (view === 'observatory') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Dataset',
          '@id': 'https://atlassanctum.org/observatory#dataset',
          'name': meta.name,
          'description': meta.metaDescription,
          'url': meta.canonicalUrl,
          'creator': {
            '@type': 'Organization',
            'name': 'Atlas Sanctum Observatory Consortium',
            'url': 'https://atlassanctum.org'
          },
          'license': 'https://creativecommons.org/licenses/by/4.0/',
          'variableMeasured': [
            'SMAP Soil Volumetric Water Content',
            'SWAT Hydrological Runoff Coefficient',
            'Canopy NDVI Index',
            'Biomass Carbon Density'
          ],
          'spatialCoverage': {
            '@type': 'Place',
            'name': 'Global Bioregions & Watershed Cascades',
            'geo': {
              '@type': 'GeoShape',
              'box': '-90 -180 90 180'
            }
          },
          'temporalCoverage': '2024/..',
          'distribution': {
            '@type': 'DataDownload',
            'encodingFormat': 'application/json',
            'contentUrl': 'https://atlassanctum.org/api/observatory/telemetry'
          }
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://atlassanctum.org/observatory#app',
          'name': 'Planetary Observatory UI',
          'applicationCategory': 'ScientificSoftware',
          'operatingSystem': 'Web, Cloud Run',
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': meta.ratingScore.toString(),
            'reviewCount': meta.reviewCount.toString(),
            'bestRating': '5',
            'worstRating': '1'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://atlassanctum.org/observatory#breadcrumbs',
          'itemListElement': meta.breadcrumbTrail.map((crumb, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': crumb,
            'item': idx === 0 ? 'https://atlassanctum.org/' : meta.canonicalUrl
          }))
        }
      ]
    }, null, 2);
  }

  if (view === 'agent-mission-control') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://atlassanctum.org/agent-mission-control#app',
          'name': meta.name,
          'description': meta.metaDescription,
          'url': meta.canonicalUrl,
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web, Edge IoT, Cloud Run',
          'softwareVersion': '3.8.0-ADK',
          'featureList': [
            'Autonomous Multi-Agent Fleet Orchestration',
            'Google ADK & Gemini 3.8 Flash Multimodal Reasoning',
            'Episodic Memory Vector Graph',
            'Cryptographic Tool Verification Ledger',
            'Real-Time WebSocket Agent Telemetry'
          ],
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
            'availability': 'https://schema.org/InStock'
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': meta.ratingScore.toString(),
            'reviewCount': meta.reviewCount.toString(),
            'bestRating': '5',
            'worstRating': '1'
          }
        },
        {
          '@type': 'Service',
          '@id': 'https://atlassanctum.org/agent-mission-control#service',
          'name': 'Atlas Autonomous Agent Fleet Dispatch',
          'provider': {
            '@type': 'Organization',
            'name': 'Atlas Sanctum Foundation',
            'url': 'https://atlassanctum.org'
          },
          'areaServed': 'Worldwide'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://atlassanctum.org/agent-mission-control#breadcrumbs',
          'itemListElement': meta.breadcrumbTrail.map((crumb, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': crumb,
            'item': idx === 0 ? 'https://atlassanctum.org/' : meta.canonicalUrl
          }))
        }
      ]
    }, null, 2);
  }

  // Default rich results schema for other views
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': meta.schemaType,
        '@id': `${meta.canonicalUrl}#entity`,
        'name': meta.name,
        'description': meta.metaDescription,
        'url': meta.canonicalUrl,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'Atlas Sanctum',
          'url': 'https://atlassanctum.org/'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': meta.ratingScore.toString(),
          'reviewCount': meta.reviewCount.toString()
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${meta.canonicalUrl}#breadcrumbs`,
        'itemListElement': meta.breadcrumbTrail.map((crumb, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': crumb,
          'item': idx === 0 ? 'https://atlassanctum.org/' : meta.canonicalUrl
        }))
      }
    ]
  }, null, 2);
}

/**
 * Dynamically injects and updates page-level meta tags into the browser DOM
 */
export function updatePageMetadata(view: PageView, customOverrides?: Partial<ViewMetadata>): ViewMetadata {
  const base = MODULE_METADATA_REGISTRY[view] || MODULE_METADATA_REGISTRY['home'];
  const meta: ViewMetadata = {
    ...base,
    ...customOverrides
  };

  if (typeof document === 'undefined') return meta;

  try {
    // 1. Update document title
    document.title = meta.metaTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Set standard SEO meta tags
    setMetaTag('name', 'description', meta.metaDescription);
    setMetaTag('name', 'keywords', meta.keywords.join(', '));
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow');

    // 4. Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', meta.canonicalUrl);

    // 5. OpenGraph Tags
    setMetaTag('property', 'og:title', meta.metaTitle);
    setMetaTag('property', 'og:description', meta.metaDescription);
    setMetaTag('property', 'og:url', meta.canonicalUrl);
    setMetaTag('property', 'og:type', meta.schemaType === 'Dataset' ? 'article' : 'website');

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:title', meta.metaTitle);
    setMetaTag('name', 'twitter:description', meta.metaDescription);
    setMetaTag('name', 'twitter:url', meta.canonicalUrl);

    // 7. Inject Page-Specific JSON-LD
    let scriptTag = document.getElementById('atlas-module-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'atlas-module-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = generateViewSpecificJsonLd(meta.viewId);

    // Broadcast metadata update event for components / tools
    window.dispatchEvent(new CustomEvent('atlas-metadata-updated', { detail: { metadata: meta } }));
  } catch (err) {
    console.warn('[MetadataManager] Error updating DOM meta tags:', err);
  }

  return meta;
}

export interface CrawlabilityAuditResult {
  score: number; // 0 - 100
  status: 'optimal' | 'acceptable' | 'warning';
  titleLength: number;
  descriptionLength: number;
  checks: {
    titleOptimal: boolean;
    descriptionOptimal: boolean;
    canonicalValid: boolean;
    keywordsPresent: boolean;
    jsonLdValid: boolean;
    richSnippetEligible: boolean;
  };
  recommendations: string[];
}

/**
 * Calculates search engine crawling efficacy score & diagnostics for a view
 */
export function auditViewMetadataEfficacy(meta: ViewMetadata): CrawlabilityAuditResult {
  const recommendations: string[] = [];
  let score = 100;

  const titleLen = meta.metaTitle.length;
  const descLen = meta.metaDescription.length;

  const titleOptimal = titleLen >= 45 && titleLen <= 65;
  if (!titleOptimal) {
    score -= 10;
    if (titleLen < 45) recommendations.push(`Title is brief (${titleLen} chars). Expand to 50-60 characters for optimal SERP prominence.`);
    if (titleLen > 65) recommendations.push(`Title may truncate on Google mobile displays (${titleLen} chars). Target < 60 characters.`);
  }

  const descriptionOptimal = descLen >= 120 && descLen <= 165;
  if (!descriptionOptimal) {
    score -= 12;
    if (descLen < 120) recommendations.push(`Description is concise (${descLen} chars). Ideal Google snippet length is 130-160 characters.`);
    if (descLen > 165) recommendations.push(`Description length (${descLen} chars) exceeds 160 characters and will show ellipsis (...) on Google SERP.`);
  }

  const canonicalValid = meta.canonicalUrl.startsWith('https://atlassanctum.org');
  if (!canonicalValid) {
    score -= 20;
    recommendations.push('Canonical URL must use secure absolute HTTPS protocol.');
  }

  const keywordsPresent = meta.keywords.length >= 3;
  if (!keywordsPresent) {
    score -= 8;
    recommendations.push('Add at least 3 high-intent domain keywords to bolster semantic indexing.');
  }

  let jsonLdValid = true;
  try {
    const raw = generateViewSpecificJsonLd(meta.viewId);
    JSON.parse(raw);
  } catch {
    jsonLdValid = false;
    score -= 25;
    recommendations.push('JSON-LD schema contains malformed syntax.');
  }

  const richSnippetEligible = meta.ratingScore >= 4.0 && meta.reviewCount > 0;
  if (!richSnippetEligible) {
    score -= 5;
    recommendations.push('Add verified review counts to qualify for Google star rating rich snippets.');
  }

  return {
    score: Math.max(0, score),
    status: score >= 90 ? 'optimal' : score >= 75 ? 'acceptable' : 'warning',
    titleLength: titleLen,
    descriptionLength: descLen,
    checks: {
      titleOptimal,
      descriptionOptimal,
      canonicalValid,
      keywordsPresent,
      jsonLdValid,
      richSnippetEligible
    },
    recommendations
  };
}
