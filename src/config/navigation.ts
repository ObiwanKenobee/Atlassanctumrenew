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
    // 1. Atlas (Home)
    {
      id: 'home',
      label: 'Atlas',
      labelKey: 'nav.home',
      type: 'link',
      icon: TreeDeciduous,
      targetTab: 'home',
      analytics: { category: 'Navigation', action: 'navigate_home' }
    },

    // 2. Observatory (Mega Menu)
    {
      id: 'observatory-mega',
      label: 'Observatory',
      labelKey: 'nav.observatory',
      type: 'mega_menu',
      icon: Compass,
      targetTab: 'observatory',
      badge: { text: 'Real-time', variant: 'emerald', pulse: true },
      megaMenuSections: [
        {
          id: 'sensory-mesh',
          title: 'Planetary Sensory Mesh',
          icon: Radio,
          items: [
            {
              id: 'observatory',
              label: 'Global Intelligence',
              description: 'Multi-scale planetary sensory mesh and watershed telemetry',
              icon: Compass,
              targetTab: 'observatory'
            },
            {
              id: 'living-reality',
              label: 'Living Reality',
              description: 'Multispectral satellite observatory and live environmental flux',
              icon: Globe2,
              targetTab: 'living-reality'
            },
            {
              id: 'bioregional-twin',
              label: 'Place Intelligence',
              description: 'Bioregional digital twin, field evidence and GIS sensor nodes',
              icon: Cpu,
              targetTab: 'bioregional-twin'
            },
            {
              id: 'reality-engine',
              label: 'Reality Engine',
              description: 'Ground-truth IoT telemetry, stream verification & QR placards',
              icon: Radio,
              targetTab: 'reality-engine',
              badge: { text: 'Live Mesh', variant: 'emerald' }
            }
          ]
        },
        {
          id: 'opportunity-intelligence-section',
          title: 'Opportunity & Trust',
          icon: ShieldCheck,
          items: [
            {
              id: 'opportunity-intelligence',
              label: 'Opportunity Intelligence',
              description: 'High-leverage planetary intervention discovery and causal rankings',
              icon: Zap,
              targetTab: 'opportunity-intelligence',
              badge: { text: 'Spine Node', variant: 'gold' }
            },
            {
              id: 'evidence-ledger',
              label: 'Evidence Explorer',
              description: 'Immutable cryptographic ledger of sensor hashes and Merkle audits',
              icon: FileText,
              targetTab: 'evidence-ledger'
            },
            {
              id: 'evidence-mapping',
              label: 'Data Explorer',
              description: 'Topological dependency DAG for scientific dataset validation',
              icon: GitBranch,
              targetTab: 'evidence-mapping'
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-places',
          label: 'Inspect Bioregional Twin',
          icon: Cpu,
          targetTab: 'bioregional-twin',
          badge: { text: 'GIS', variant: 'emerald' }
        },
        {
          id: 'quick-reality',
          label: 'Living Reality Stream',
          icon: Globe2,
          targetTab: 'living-reality',
          badge: { text: 'Live', variant: 'gold' }
        }
      ],
      megaMenuHighlight: {
        id: 'observatory-highlight',
        title: 'Verifiable Hardware Mesh',
        description: 'Over 4,200 deployed piezometers, flux towers, and biochar kilns broadcasting zero-knowledge telemetry across Kenya & global catchments.',
        actionText: 'Inspect Hardware Placards',
        targetTab: 'reality-engine',
        badge: { text: 'ISO-14064 Attested', variant: 'gold' },
        metric: {
          label: 'Total Monitored Area',
          value: '384,500 ha',
          trend: '+12.4% MoM'
        }
      }
    },

    // 3. Studio (Mega Menu)
    {
      id: 'studio-mega',
      label: 'Studio',
      labelKey: 'nav.studio',
      type: 'mega_menu',
      icon: Cpu,
      targetTab: 'studio',
      badge: { text: 'Simulate', variant: 'gold' },
      megaMenuSections: [
        {
          id: 'design-decisions',
          title: 'Decisions & Scenarios',
          icon: Scale,
          items: [
            {
              id: 'studio-home',
              label: 'Atlas Studio',
              description: 'Systems dynamics simulation studio and generative intervention canvas',
              icon: Cpu,
              targetTab: 'studio'
            },
            {
              id: 'decision-room',
              label: 'Decision Room',
              description: 'Algorithmic multi-agent decision matrix with ethical boundary checks',
              icon: Scale,
              targetTab: 'decision-room',
              badge: { text: 'Spine Node', variant: 'gold' }
            },
            {
              id: 'system-model-studio',
              label: 'Scenario Modeling',
              description: 'Stock-flow differential simulations and leverage point analysis',
              icon: GitBranch,
              targetTab: 'system-model-studio'
            },
            {
              id: 'multimodal-studio',
              label: 'Multimodal AI Studio',
              description: 'Gemini multimodal synthesis, generative audio and vision analysis',
              icon: Sparkles,
              targetTab: 'multimodal-studio'
            }
          ]
        },
        {
          id: 'project-builder-section',
          title: 'Execution & Projects',
          icon: Layers,
          items: [
            {
              id: 'project-os',
              label: 'Project Builder',
              description: 'Decentralized project lifecycle management, milestones & capital',
              icon: Layers,
              targetTab: 'project-os',
              badge: { text: 'Spine Node', variant: 'emerald' }
            },
            {
              id: 'field-labs',
              label: 'Real-World Experiments',
              description: 'Empirical agroforestry testbeds and in-situ pilot stations',
              icon: FlaskConical,
              targetTab: 'field-labs'
            },
            {
              id: 'agent-mission-control',
              label: 'Command Center',
              description: 'Autonomous agent fleet orchestrator and planetary dispatch',
              icon: Bot,
              targetTab: 'agent-mission-control'
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-decisions',
          label: 'Enter Decision Room',
          icon: Scale,
          targetTab: 'decision-room',
          badge: { text: 'Deliberation', variant: 'emerald' }
        },
        {
          id: 'quick-projects',
          label: 'Open Project Builder',
          icon: Layers,
          targetTab: 'project-os',
          badge: { text: 'Deploy', variant: 'gold' }
        }
      ],
      megaMenuHighlight: {
        id: 'studio-highlight',
        title: 'Algorithmic Leverage Modeler',
        description: 'Simulate high-order Meadows feedback dynamics and test counterfactual policy interventions before capital deployment.',
        actionText: 'Launch Studio Modeler',
        targetTab: 'system-model-studio',
        badge: { text: 'Meadows Levers', variant: 'purple' }
      }
    },

    // 4. Marketplace (Mega Menu)
    {
      id: 'marketplace-mega',
      label: 'Marketplace',
      labelKey: 'nav.marketplace',
      type: 'mega_menu',
      icon: Coins,
      targetTab: 'marketplace',
      badge: { text: 'Exchange', variant: 'blue' },
      megaMenuSections: [
        {
          id: 'value-exchange',
          title: 'Regenerative Exchange',
          icon: Coins,
          items: [
            {
              id: 'marketplace-core',
              label: 'Regenerative Value Exchange',
              description: 'Natural capital assets, verified ecological credits and inputs',
              icon: Scale,
              targetTab: 'marketplace'
            },
            {
              id: 'capital-intelligence',
              label: 'Capital Intelligence',
              description: 'Blended regenerative capital pools, sovereign funds and catalytic financing',
              icon: Coins,
              targetTab: 'capital-engine',
              badge: { text: '$380M Pool', variant: 'emerald' }
            },
            {
              id: 'opportunity-matchmaker',
              label: 'Opportunity Matchmaker',
              description: 'AI matchmaking linking projects, stewards, capital, and researchers',
              icon: Sparkles,
              targetTab: 'opportunity-matchmaker'
            }
          ]
        },
        {
          id: 'physical-deployments',
          title: 'Physical Deployments',
          icon: Factory,
          items: [
            {
              id: 'lifehouse',
              label: 'LifeHouse Habitats',
              description: 'Modular community housing, water systems & microgrid architecture',
              icon: Home,
              targetTab: 'lifehouse'
            },
            {
              id: 'industrial',
              label: 'Industrial Systems',
              description: 'Circular manufacturing, waste-to-resource flows & green metallurgy',
              icon: Factory,
              targetTab: 'industrial'
            },
            {
              id: 'impact-dashboard',
              label: 'Impact Intelligence',
              description: 'Verifiable ecological outcomes, carbon sequestration & ROI',
              icon: BarChart3,
              targetTab: 'impact-dashboard',
              badge: { text: 'Spine Node', variant: 'purple' }
            }
          ]
        }
      ],
      quickActionLinks: [
        {
          id: 'quick-exchange',
          label: 'Trade Natural Capital',
          icon: Scale,
          targetTab: 'marketplace',
          badge: { text: 'Live', variant: 'emerald' }
        },
        {
          id: 'quick-capital',
          label: 'Catalytic Capital Pools',
          icon: Coins,
          targetTab: 'capital-engine',
          badge: { text: '$380M', variant: 'gold' }
        }
      ],
      megaMenuHighlight: {
        id: 'marketplace-highlight',
        title: 'Verifiable Outcome Exchange',
        description: 'Smart contracts automatically disburse funds upon cryptographic verification of satellite biomass increase and elder council sign-offs.',
        actionText: 'Explore Marketplace',
        targetTab: 'marketplace',
        badge: { text: 'Natural Capital', variant: 'emerald' }
      }
    },

    // 5. Research
    {
      id: 'research',
      label: 'Research',
      labelKey: 'nav.research',
      type: 'link',
      icon: FileText,
      targetTab: 'research',
      analytics: { category: 'Navigation', action: 'navigate_research' }
    },

    // 6. Academy
    {
      id: 'academy',
      label: 'Academy',
      labelKey: 'nav.academy',
      type: 'link',
      icon: GraduationCap,
      targetTab: 'academy',
      analytics: { category: 'Navigation', action: 'navigate_academy' }
    },

    // 7. Commons
    {
      id: 'commons',
      label: 'Commons',
      labelKey: 'nav.commons',
      type: 'link',
      icon: Globe2,
      targetTab: 'commons',
      badge: { text: 'Open Source', variant: 'emerald' },
      analytics: { category: 'Navigation', action: 'navigate_commons' }
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
