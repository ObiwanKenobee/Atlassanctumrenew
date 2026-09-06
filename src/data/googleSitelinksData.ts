import { PageView } from '../types';

export interface GoogleSitelinkItem {
  id: string;
  name: string;
  displayUrl: string;
  targetTab: PageView;
  snippet: string;
  category: 'core' | 'intelligence' | 'governance' | 'infrastructure' | 'ledger' | 'commons';
  queryKeywords: string[];
  impressionsEst: string;
  ctrEst: string;
  badge?: string;
}

export const ATLAS_GOOGLE_SITELINKS: GoogleSitelinkItem[] = [
  {
    id: 'sitelink-agent-mission-control',
    name: 'Agent Mission Control',
    displayUrl: 'atlassanctum.org/agent-mission-control',
    targetTab: 'agent-mission-control',
    snippet: 'Autonomous multi-agent execution orchestrator powered by Google ADK, Gemini, tool verification & memory.',
    category: 'intelligence',
    queryKeywords: ['agent', 'mission control', 'adk', 'gemini', 'autonomous fleet', 'orchestration', 'tools'],
    impressionsEst: '48.2k/mo',
    ctrEst: '18.4%',
    badge: 'Core Sitelink'
  },
  {
    id: 'sitelink-observatory',
    name: 'Atlas Planetary Observatory',
    displayUrl: 'atlassanctum.org/observatory',
    targetTab: 'observatory',
    snippet: 'Real-time macro-scale Earth telemetry, verified bioregional boundaries, and planetary civilization indicators.',
    category: 'infrastructure',
    queryKeywords: ['observatory', 'planetary', 'bioregions', 'satellite', 'earth telemetry', 'monitoring'],
    impressionsEst: '36.5k/mo',
    ctrEst: '14.2%',
    badge: 'Core Sitelink'
  },
  {
    id: 'sitelink-living-reality',
    name: 'Living Reality Matrix',
    displayUrl: 'atlassanctum.org/living-reality',
    targetTab: 'living-reality',
    snippet: 'Multi-spectral ground-truthing observatory with SWAT hydrology, SMAP moisture, and Merkle cryptographic sensor proofs.',
    category: 'infrastructure',
    queryKeywords: ['living reality', 'ground truth', 'swat', 'hydrology', 'smap', 'sensors', 'merkle'],
    impressionsEst: '29.1k/mo',
    ctrEst: '12.8%',
    badge: 'Core Sitelink'
  },
  {
    id: 'sitelink-capital-engine',
    name: 'Capital Engine (8-Forms)',
    displayUrl: 'atlassanctum.org/capital-engine',
    targetTab: 'capital-engine',
    snippet: 'Non-extractive allocation engine directing financial, natural, social, human, and intellectual capital toward verified regeneration.',
    category: 'core',
    queryKeywords: ['capital engine', '8 forms of capital', 'regenerative finance', 'allocation', 'multiplier', 'rve'],
    impressionsEst: '32.4k/mo',
    ctrEst: '13.9%',
    badge: 'Core Sitelink'
  },
  {
    id: 'sitelink-failure-ledger',
    name: 'Failure Ledger & Post-Mortems',
    displayUrl: 'atlassanctum.org/failure-ledger',
    targetTab: 'failure-ledger',
    snippet: 'Transparent public database of failed interventions, second-order distortions, and open-access epistemic lessons learned.',
    category: 'ledger',
    queryKeywords: ['failure ledger', 'post-mortems', 'root cause', 'transparency', 'anti-fragile', 'lessons'],
    impressionsEst: '24.7k/mo',
    ctrEst: '11.5%',
    badge: 'Core Sitelink'
  },
  {
    id: 'sitelink-moral-arbiter',
    name: 'Moral Arbiter & Governance',
    displayUrl: 'atlassanctum.org/moral-arbiter',
    targetTab: 'moral-arbiter',
    snippet: 'Real-time constitutional ethical audit engine applying universal moral axioms, Canon XXIII, and non-negotiable priority floors.',
    category: 'governance',
    queryKeywords: ['moral arbiter', 'ethics engine', 'canon xxiii', 'priority floors', 'governance', 'alignment'],
    impressionsEst: '27.9k/mo',
    ctrEst: '12.1%',
    badge: 'Core Sitelink'
  },
  {
    id: 'sitelink-steward',
    name: 'Atlas Steward (AWS Winner)',
    displayUrl: 'atlassanctum.org/steward',
    targetTab: 'steward',
    snippet: 'Autonomous community water reliability and decentralized infrastructure operations powered by Good Neighbor Agents.',
    category: 'intelligence',
    queryKeywords: ['steward', 'water reliability', 'good neighbor', 'aws hackathon', 'iot infrastructure'],
    impressionsEst: '22.3k/mo',
    ctrEst: '15.6%',
    badge: '2026 Winner'
  },
  {
    id: 'sitelink-bioregional-twin',
    name: 'Bioregional Digital Twin',
    displayUrl: 'atlassanctum.org/bioregional-twin',
    targetTab: 'bioregional-twin',
    snippet: 'Spatial 3D microclimate simulation modeling watershed cascades, biomass carbon density, and canopy indices.',
    category: 'infrastructure',
    queryKeywords: ['digital twin', 'bioregional twin', '3d simulation', 'watershed', 'canopy', 'climate'],
    impressionsEst: '19.8k/mo',
    ctrEst: '10.4%'
  },
  {
    id: 'sitelink-decision-room',
    name: 'Decision Room Policy Lab',
    displayUrl: 'atlassanctum.org/decision-room',
    targetTab: 'decision-room',
    snippet: 'Multi-stakeholder scenario war room simulating quadratic voting, second-order consequences, and moral scorecards.',
    category: 'governance',
    queryKeywords: ['decision room', 'policy lab', 'scenarios', 'quadratic voting', 'trade-offs'],
    impressionsEst: '16.5k/mo',
    ctrEst: '9.2%'
  },
  {
    id: 'sitelink-economics-pricing',
    name: 'Economics & Pricing Stack',
    displayUrl: 'atlassanctum.org/economics-pricing',
    targetTab: 'economics-pricing',
    snippet: 'The Atlas Economic Stack: Open Commons, Studio, Intelligence, and Enterprise tiers with compounding network dividends.',
    category: 'core',
    queryKeywords: ['economics', 'pricing', 'tiers', 'subscription', 'coordination dividend', 'commons'],
    impressionsEst: '18.2k/mo',
    ctrEst: '9.7%'
  }
];

export const GOOGLE_SERP_METADATA = {
  canonicalUrl: 'https://atlassanctum.org/',
  displayBreadcrumb: 'https://atlassanctum.org › ecosystem › regenerative-intelligence',
  metaTitle: 'Atlas Sanctum | Regenerative Intelligence & Infrastructure',
  metaDescription: 'Atlas Sanctum builds ethical systems connecting intelligence, evidence, capital, communities, and physical infrastructure to create measurable human and ecological flourishing.',
  siteSearchActionTemplate: 'https://atlassanctum.org/?q={search_term_string}',
  searchParamName: 'search_term_string',
  actualQueryParam: 'q',
  organizationName: 'Atlas Sanctum Foundation',
  publishingAuthority: 'Civilization OS Governance Council',
  verifiedCheckmark: true,
  ratingScore: '4.9',
  reviewCount: '1,420',
  schemaType: 'WebSite + SearchAction + SiteNavigationElement'
};

/**
 * Generate Google-compliant schema.org JSON-LD formatted string
 */
export function generateGoogleSitelinksSchemaJson(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://atlassanctum.org/#website',
        'url': 'https://atlassanctum.org/',
        'name': 'Atlas Sanctum',
        'alternateName': [
          'Atlas Sanctum Regenerative Intelligence',
          'Atlas Sanctum Platform',
          'Atlas Sanctum OS'
        ],
        'description': GOOGLE_SERP_METADATA.metaDescription,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://atlassanctum.org/?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'ItemList',
        '@id': 'https://atlassanctum.org/#sitelinks-navigation',
        'name': 'Atlas Sanctum Primary Sitelinks',
        'itemListElement': ATLAS_GOOGLE_SITELINKS.slice(0, 6).map((item, index) => ({
          '@type': 'SiteNavigationElement',
          'position': index + 1,
          'name': item.name,
          'description': item.snippet,
          'url': `https://atlassanctum.org/?view=${item.targetTab}`
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://atlassanctum.org/#breadcrumbs',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Atlas Sanctum',
            'item': 'https://atlassanctum.org/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Ecosystem',
            'item': 'https://atlassanctum.org/?view=observatory'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'Regenerative Intelligence',
            'item': 'https://atlassanctum.org/?view=agent-mission-control'
          }
        ]
      }
    ]
  };

  return JSON.stringify(schema, null, 2);
}
