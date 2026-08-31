import {
  Compass,
  Cpu,
  Coins,
  Home,
  Bot,
  Factory,
  Scale,
  BarChart3,
  BookOpen,
  Code2,
  Info,
  Sparkles,
  TreeDeciduous,
  Shield,
  Activity,
  Network,
  FileText,
  FlaskConical,
  Layers,
  Heart,
  Radio,
  Globe2,
  Award,
  GitBranch,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Terminal,
  FileCode,
  Flame,
  CheckCircle2,
  QrCode,
  GraduationCap,
  Download,
  PlayCircle,
  Lock,
  Users,
  Settings,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  Calendar,
  Quote
} from 'lucide-react';
import { NavigationHeaderConfig } from '../types/navigation';

export const NAVIGATION_CONFIG: NavigationHeaderConfig = {
  version: 'OS 2.5',
  systemStatusText: 'CIVILIZATION OS 2.5: ACTIVE',
  
  tickerMetrics: [
    {
      id: 'bioregions',
      label: 'Verified Bioregions',
      value: '384,500 ha',
      isLive: true,
      color: 'emerald'
    },
    {
      id: 'carbon',
      label: 'Carbon Sequestered',
      value: '1.24M tCO2e',
      color: 'gold'
    },
    {
      id: 'capital',
      label: 'Regenerative Capital',
      value: '$380M',
      color: 'blue'
    },
    {
      id: 'moral_baseline',
      label: 'Axiomatic Baseline',
      value: '94.8%',
      color: 'emerald'
    }
  ],

  primaryNavigation: [
    // 1. ATLAS SENTINEL (TikTok TechJam 2026 Submission Spotlight)
    {
      id: 'sentinel',
      label: 'Atlas Sentinel',
      labelKey: 'nav.sentinel',
      type: 'link',
      icon: ShieldCheck,
      targetTab: 'sentinel',
      badge: { text: 'TechJam 2026', variant: 'gold', pulse: true },
      analytics: { category: 'Navigation', action: 'navigate_sentinel' }
    },

    // 1b. Home / Overview
    {
      id: 'home',
      label: 'Atlas',
      labelKey: 'nav.home',
      type: 'link',
      icon: TreeDeciduous,
      targetTab: 'home',
      analytics: { category: 'Navigation', action: 'navigate_home' }
    },

    // 1b. Autonomous Agent Mission Control (Google Cloud Summer Blockbuster Hackathon Showcase)
    {
      id: 'agent-mission-control',
      label: 'Mission Control',
      labelKey: 'nav.agent_mission_control',
      type: 'link',
      icon: Radio,
      targetTab: 'agent-mission-control',
      badge: { text: 'Summer Blockbuster', variant: 'gold', pulse: true },
      analytics: { category: 'Navigation', action: 'navigate_agent_mission_control' }
    },

    // 1c. AI Engineering & Epistemic Insights Workbench
    {
      id: 'ai-engineering',
      label: 'AI Engineering',
      labelKey: 'nav.ai_engineering',
      type: 'link',
      icon: Cpu,
      targetTab: 'ai-engineering',
      badge: { text: 'Gemini 3.7', variant: 'emerald', pulse: true },
      analytics: { category: 'Navigation', action: 'navigate_ai_engineering' }
    },

    // 2. Civilization Observatory & Sensory Mesh (High-Density Mega Menu)
    {
      id: 'observatory-mega',
      label: 'Observatory',
      labelKey: 'nav.observatory',
      type: 'mega_menu',
      icon: Compass,
      badge: { text: 'Real-time', variant: 'emerald', pulse: true },
      megaMenuSections: [
        {
          id: 'sensory-mesh',
          title: 'Planetary Sensory Mesh',
          icon: Radio,
          items: [
            {
              id: 'reality-engine',
              label: 'Reality Engine',
              description: 'Ground-truth IoT telemetry, stream verification & QR placards',
              icon: Radio,
              targetTab: 'reality-engine',
              badge: { text: 'Live Telemetry', variant: 'emerald' }
            },
            {
              id: 'bioregional-twin',
              label: 'Causal Twin & Resilience',
              description: 'Multi-scale climate simulations & counterfactual causal analysis',
              icon: Cpu,
              targetTab: 'bioregional-twin'
            },
            {
              id: 'system-model-studio',
              label: 'Systems Dynamics Studio',
              description: 'Stock-flow differential simulations, causal polarity & Meadows leverage points',
              icon: GitBranch,
              targetTab: 'system-model-studio',
              badge: { text: 'Dynamic SD', variant: 'emerald' }
            },
            {
              id: 'living-reality',
              label: 'Living Reality Matrix',
              description: 'Multispectral planetary observatory & satellite biomass mapping',
              icon: Globe2,
              targetTab: 'living-reality'
            },
            {
              id: 'observatory',
              label: 'Multi-Scale Observatory',
              description: 'Macro-planetary to local watershed telemetry layers',
              icon: Compass,
              targetTab: 'observatory'
            }
          ]
        },
        {
          id: 'evidence-trust',
          title: 'Epistemic Trust & Ledgers',
          icon: ShieldCheck,
          items: [
            {
              id: 'evidence-ledger',
              label: 'Evidence Ledger',
              description: 'Immutable cryptographic proofs, sensor hashes & Merkle audits',
              icon: FileText,
              targetTab: 'evidence-ledger',
              badge: { text: 'Merkle Roots', variant: 'gold' }
            },
            {
              id: 'failure-ledger',
              label: 'Failure & Post-Mortem Ledger',
              description: 'Transparent failure archives and peer-reviewed learnings',
              icon: BookOpen,
              targetTab: 'failure-ledger',
              badge: { text: 'Open Post-Mortems', variant: 'amber' }
            },
            {
              id: 'evidence-mapping',
              label: 'Evidence DAG Graph',
              description: 'Interactive topological dependency DAG for scientific validation',
              icon: GitBranch,
              targetTab: 'evidence-mapping'
            },
            {
              id: 'stewardship-reputation',
              label: 'Stewardship Reputation',
              description: 'Dynamic contributor tier progression & verified impact badges',
              icon: Award,
              targetTab: 'stewardship-reputation',
              badge: { text: 'Reputation XP', variant: 'purple' }
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-qr-verify',
          label: 'Verify Physical Asset QR',
          icon: QrCode,
          targetTab: 'reality-engine',
          badge: { text: 'Hardware', variant: 'gold' }
        },
        {
          id: 'quick-dag-inspect',
          label: 'Inspect Merkle DAG Proofs',
          icon: GitBranch,
          targetTab: 'evidence-mapping',
          badge: { text: 'ZKP', variant: 'emerald' }
        },
        {
          id: 'quick-failure-report',
          label: 'Submit Failure Post-Mortem',
          icon: BookOpen,
          targetTab: 'failure-ledger',
          badge: { text: '+200 XP', variant: 'amber' },
          requiredPermission: 'authenticated'
        }
      ],
      megaMenuHighlight: {
        id: 'observatory-highlight',
        title: 'Verifiable Hardware Mesh',
        description: 'Over 4,200 deployed piezometers, flux towers, and biochar kilns broadcasting zero-knowledge telemetry across Kenya & global catchments.',
        actionText: 'Inspect Hardware QR Placards',
        targetTab: 'reality-engine',
        badge: { text: 'ISO-14064-3 Attested', variant: 'gold' },
        metric: {
          label: 'Total Monitored Area',
          value: '384,500 ha',
          trend: '+12.4% MoM'
        }
      }
    },

    // 3. Moral Governance & Ethics Review (Mega Menu)
    {
      id: 'governance-mega',
      label: 'Moral Governance',
      labelKey: 'nav.governance',
      type: 'mega_menu',
      icon: Scale,
      badge: { text: 'Constitutional', variant: 'gold' },
      megaMenuSections: [
        {
          id: 'constitutional-foundations',
          title: 'Axioms & Review Engine',
          icon: Scale,
          items: [
            {
              id: 'governance',
              label: 'Civilization Governance Hub',
              description: 'Universal moral axioms, Priority Floors, Merkle audits & active proposals',
              icon: Scale,
              targetTab: 'governance',
              badge: { text: 'Full Hub', variant: 'emerald' }
            },
            {
              id: 'ethics-review',
              label: 'Ethics Review & Priority Floors',
              description: 'Constitutional boundary checks & non-negotiable floor enforcement',
              icon: Scale,
              targetTab: 'ethics-review',
              badge: { text: 'Floors Active', variant: 'gold' }
            },
            {
              id: 'moral-arbiter',
              label: 'Autonomous Moral Arbiter',
              description: 'AI-assisted moral dilemma adjudication with multi-tradition wisdom',
              icon: Shield,
              targetTab: 'moral-arbiter'
            },
            {
              id: 'moral-intelligence',
              label: 'Universal Moral Intelligence',
              description: '14 Universal Ethical Axioms synthesized across human wisdom',
              icon: Heart,
              targetTab: 'moral-intelligence'
            }
          ]
        },
        {
          id: 'flourishing-missions',
          title: 'Flourishing & Missions',
          icon: Sparkles,
          items: [
            {
              id: 'flourishing-index',
              label: 'Civilization Flourishing Index',
              description: 'Ecological, psychological, and generational flourishing metrics',
              icon: Heart,
              targetTab: 'flourishing-index',
              badge: { text: '94.8% Score', variant: 'emerald' }
            },
            {
              id: 'regenerative-mission',
              label: 'Regenerative Missions',
              description: 'Active collective missions with real-time progress & incentives',
              icon: Sparkles,
              targetTab: 'regenerative-mission'
            },
            {
              id: 'mission-analytics',
              label: 'Mission Analytics & ROI',
              description: 'Multi-dimensional impact returns and carbon displacement curves',
              icon: BarChart3,
              targetTab: 'mission-analytics'
            },
            {
              id: 'impact-dashboard',
              label: 'Global Impact Dashboard',
              description: 'Synthesis of bioregional, social, and economic regenerative ROI',
              icon: BarChart3,
              targetTab: 'impact-dashboard'
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-moral-sim',
          label: 'Run Moral Simulator',
          icon: Scale,
          targetTab: 'ethics-review',
          badge: { text: 'Interactive', variant: 'gold' }
        },
        {
          id: 'quick-create-mission',
          label: 'Author New Mission Proposal',
          icon: PlusCircle,
          targetTab: 'regenerative-mission',
          badge: { text: 'Authenticated', variant: 'emerald' },
          requiredPermission: 'authenticated'
        },
        {
          id: 'quick-priority-floor',
          label: 'Query Priority Floor Axioms',
          icon: ShieldCheck,
          targetTab: 'developers',
          badge: { text: 'SDK', variant: 'blue' }
        }
      ],
      megaMenuHighlight: {
        id: 'governance-highlight',
        title: 'Constitutional Priority Floors',
        description: 'Hard mathematical bounds on water drawdown, local equity reserves, labor wages, and Sabbath rest prevent extractive capital capture.',
        actionText: 'Test in Moral Simulator',
        targetTab: 'ethics-review',
        badge: { text: 'Axiomatic Law', variant: 'emerald' },
        metric: {
          label: 'Proposals Screened',
          value: '1,420 Active',
          trend: '100% Guardrailed'
        }
      }
    },

    // 4. Academy & Knowledge Commons (High-Density Mega Menu)
    {
      id: 'academy-mega',
      label: 'Academy & Commons',
      labelKey: 'nav.academy',
      type: 'mega_menu',
      icon: GraduationCap,
      badge: { text: 'Open Wisdom', variant: 'purple' },
      megaMenuSections: [
        {
          id: 'learning-academy',
          title: 'Civilization Academy',
          icon: GraduationCap,
          items: [
            {
              id: 'academy',
              label: 'Civilization Academy',
              description: 'Interactive curricula on regenerative engineering & moral philosophy',
              icon: BookOpen,
              targetTab: 'academy',
              badge: { text: 'Interactive', variant: 'emerald' }
            },
            {
              id: 'multimodal-studio',
              label: 'Multimodal AI Studio',
              description: 'Interactive audio narration, vision models & wisdom synthesis',
              icon: Sparkles,
              targetTab: 'multimodal-studio'
            },
            {
              id: 'studio',
              label: 'Systems Dynamics Studio',
              description: 'Visual systems loop modeling, feedback loops & simulation runs',
              icon: Cpu,
              targetTab: 'studio',
              badge: { text: 'Model Engine', variant: 'blue' }
            }
          ]
        },
        {
          id: 'open-commons',
          title: 'Commons, Stories & Events',
          icon: Globe2,
          items: [
            {
              id: 'events',
              label: 'Gatherings & Field Labs',
              description: 'Conferences, technical webinars, workshops & sensor field activities',
              icon: Calendar,
              targetTab: 'events',
              badge: { text: 'Conferences', variant: 'gold' }
            },
            {
              id: 'stories',
              label: 'Stories & Field Narratives',
              description: 'Grassroots oral histories, human diaries & empirical field reports',
              icon: Quote,
              targetTab: 'stories',
              badge: { text: 'Impact Stories', variant: 'emerald' }
            },
            {
              id: 'resources',
              label: 'Resources & Toolkits',
              description: 'Open-hardware CAD schemas, simulation libraries, APIs & curricula',
              icon: Download,
              targetTab: 'resources',
              badge: { text: 'Toolkits & CAD', variant: 'blue' }
            },
            {
              id: 'commons',
              label: 'Open Commons Repository',
              description: 'Open-source blueprints, CAD hardware & agroecology schemas',
              icon: Globe2,
              targetTab: 'commons',
              badge: { text: 'GPL / CC-BY', variant: 'gold' }
            },
            {
              id: 'research',
              label: 'Peer-Reviewed Research',
              description: 'Methodological papers, carbon permanence & epistemics',
              icon: FileText,
              targetTab: 'research'
            },
            {
              id: 'about',
              label: 'Sanctum Governance Charter',
              description: 'Founding charter, covenant terms & ethical baseline specs',
              icon: Info,
              targetTab: 'about'
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-start-lesson',
          label: 'Start Regenerative Design Module',
          icon: PlayCircle,
          targetTab: 'academy',
          badge: { text: 'Lesson 1', variant: 'emerald' }
        },
        {
          id: 'quick-download-blueprint',
          label: 'Download Open Biochar Blueprint',
          icon: Download,
          targetTab: 'commons',
          badge: { text: 'CAD', variant: 'gold' }
        },
        {
          id: 'quick-systems-model',
          label: 'Simulate Feedback Loops',
          icon: Cpu,
          targetTab: 'studio',
          badge: { text: 'Studio', variant: 'purple' }
        }
      ],
      megaMenuHighlight: {
        id: 'academy-highlight',
        title: 'Open Civilization Blueprints',
        description: 'Over 180 peer-reviewed open hardware schematics and agroforestry planting protocols freely accessible to bioregional stewards.',
        actionText: 'Browse Open Commons',
        targetTab: 'commons',
        badge: { text: 'Creative Commons', variant: 'purple' },
        metric: {
          label: 'Active Students & Stewards',
          value: '14,890',
          trend: '+28% this term'
        }
      }
    },

    // 5. Coordination & Capital OS (Mega Menu)
    {
      id: 'coordination-mega',
      label: 'Capital & OS',
      labelKey: 'nav.coordination',
      type: 'mega_menu',
      icon: Coins,
      megaMenuSections: [
        {
          id: 'capital-allocation',
          title: 'Regenerative Operating Loop',
          icon: Coins,
          items: [
            {
              id: 'opportunity-intelligence',
              label: 'Opportunity Intelligence',
              description: 'Evidence-backed opportunity engine & 12-stage problem dossiers',
              icon: Zap,
              targetTab: 'opportunity-intelligence',
              badge: { text: 'Core Engine', variant: 'gold' }
            },
            {
              id: 'decision-room',
              label: 'The Decision Room',
              description: 'Human-in-the-loop multi-criteria trade-off workspace',
              icon: Scale,
              targetTab: 'decision-room',
              badge: { text: 'Deliberation', variant: 'emerald' }
            },
            {
              id: 'capital-engine',
              label: 'Capital Allocation Engine',
              description: 'Continuous liquidity, catalytic grants & restorative outcome funds',
              icon: Coins,
              targetTab: 'capital-engine',
              badge: { text: '$380M Pool', variant: 'emerald' }
            },
            {
              id: 'project-os',
              label: 'Bioregional Project OS',
              description: 'Milestone tracking, sensor integration & decentralized grant payouts',
              icon: Layers,
              targetTab: 'project-os'
            },
            {
              id: 'opportunity-matchmaker',
              label: 'Opportunity Matchmaker',
              description: 'AI matchmaking linking projects, stewards, capital, and researchers',
              icon: Sparkles,
              targetTab: 'opportunity-matchmaker'
            },
            {
              id: 'opportunity-graph',
              label: 'Coordination Graph',
              description: 'Network graph of regenerative capital flows and synergy nodes',
              icon: Network,
              targetTab: 'opportunity-graph'
            }
          ]
        },
        {
          id: 'field-deployments',
          title: 'Real-World Infrastructure',
          icon: FlaskConical,
          items: [
            {
              id: 'field-labs',
              label: 'Bioregional Field Labs',
              description: 'In-situ pilot stations for agroforestry, biochar, and ocean kelp',
              icon: FlaskConical,
              targetTab: 'field-labs'
            },
            {
              id: 'marketplace',
              label: 'Regenerative Marketplace',
              description: 'Verified ecological credits, seed libraries & regenerative inputs',
              icon: Scale,
              targetTab: 'marketplace'
            },
            {
              id: 'lifehouse',
              label: 'LifeHouse Community Hubs',
              description: 'Modular community housing, water systems & microgrid architecture',
              icon: Home,
              targetTab: 'lifehouse'
            },
            {
              id: 'industrial',
              label: 'Ecological Industrial OS',
              description: 'Circular manufacturing, waste-to-resource flows & green metallurgy',
              icon: Factory,
              targetTab: 'industrial'
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-apply-grant',
          label: 'Apply for Catalytic Funding',
          icon: Coins,
          targetTab: 'capital-engine',
          badge: { text: 'Fast Track', variant: 'emerald' }
        },
        {
          id: 'quick-launch-pilot',
          label: 'Deploy Field Station',
          icon: FlaskConical,
          targetTab: 'field-labs',
          badge: { text: 'Field Lab', variant: 'gold' }
        }
      ],
      megaMenuHighlight: {
        id: 'capital-highlight',
        title: 'Proof-of-Regeneration Payouts',
        description: 'Smart contracts automatically disburse funds upon cryptographic verification of satellite biomass increase and elder council sign-offs.',
        actionText: 'Explore Capital Engine',
        targetTab: 'capital-engine',
        badge: { text: 'Zero Slush Funds', variant: 'gold' }
      }
    },

    // 6. Role-Restricted Administrative & Stewardship Suite (Mega Menu / Submenu)
    {
      id: 'steward-admin-menu',
      label: 'Council & Admin',
      labelKey: 'nav.admin',
      type: 'nested_submenu',
      icon: Shield,
      requiredPermission: 'steward',
      badge: { text: 'Steward Access', variant: 'rose' },
      submenuItems: [
        {
          id: 'steward-proposal-review',
          label: 'Council Review Portal',
          description: 'Review sovereign grant tranches, elder vetoes & ethical covenants',
          icon: Scale,
          targetTab: 'decision-room',
          requiredPermission: 'steward',
          badge: { text: 'Steward', variant: 'emerald' }
        },
        {
          id: 'admin-telemetry-audit',
          label: 'Root Telemetry Audit',
          description: 'Administrative root calibration of ZKP sensors and consensus oracles',
          icon: Radio,
          targetTab: 'reality-engine',
          requiredPermission: 'admin',
          badge: { text: 'Admin', variant: 'rose' }
        },
        {
          id: 'admin-mission-creator',
          label: 'Launch Sovereign Mission',
          description: 'Deploy new global restoration mission with escrow tranches',
          icon: PlusCircle,
          targetTab: 'regenerative-mission',
          requiredPermission: 'steward',
          badge: { text: 'Sovereign', variant: 'gold' }
        }
      ]
    },

    // 7. Developers & SDK (Nested Submenu)
    {
      id: 'developers-menu',
      label: 'SDK & APIs',
      labelKey: 'nav.developers',
      type: 'nested_submenu',
      icon: Code2,
      badge: { text: 'v2.5', variant: 'blue' },
      submenuItems: [
        {
          id: 'developers',
          label: 'Atlas Governance SDK',
          description: 'Programmatic Priority Floors & compliance evaluation APIs',
          icon: Code2,
          targetTab: 'developers',
          badge: { text: 'TypeScript / REST', variant: 'emerald' }
        },
        {
          id: 'github-repo',
          label: 'SDK GitHub & Docs',
          description: 'Open source repository, TypeScript bindings & npm packages',
          icon: ExternalLink,
          href: 'https://github.com/atlas-sanctum/sdk',
          isExternal: true
        }
      ]
    },

    // 8. About & Sanctum Governance Charter
    {
      id: 'about-nav',
      label: 'About',
      labelKey: 'nav.about',
      type: 'link',
      icon: Info,
      targetTab: 'about',
      badge: { text: 'Charter', variant: 'gold' },
      analytics: { category: 'Navigation', action: 'navigate_about' }
    }
  ],

  quickActions: [
    {
      id: 'commandments-action',
      label: '10 Commandments',
      tooltip: 'Open the 10 Moral Commandments & Constitutional Axioms',
      icon: Scale,
      actionType: 'callback',
      target: 'open_commandments',
      buttonStyle: 'text-[#C5A059] border-[#C5A059]/40 hover:bg-[#1B3022]'
    },
    {
      id: 'moral-simulator-action',
      label: 'Simulator',
      tooltip: 'Launch the Moral Dilemma Simulation Sandbox',
      icon: Scale,
      actionType: 'callback',
      target: 'open_moral_simulator',
      buttonStyle: 'text-[#F5F5F0]/70 hover:text-[#C5A059]'
    }
  ]
};
