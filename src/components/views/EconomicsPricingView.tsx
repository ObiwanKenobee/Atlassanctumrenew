import React, { useState } from 'react';
import {
  Coins,
  ArrowRight,
  Shield,
  Sparkles,
  Layers,
  Globe2,
  TrendingUp,
  Cpu,
  BarChart3,
  CheckCircle2,
  Scale,
  Zap,
  Building2,
  TreeDeciduous,
  FileCheck2,
  Network,
  HelpCircle,
  ChevronRight,
  Compass,
  FileText,
  Lock,
  ArrowUpRight,
  Database,
  Activity,
  Award,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface EconomicsPricingViewProps {
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter?: () => void;
  onOpenMoralSimulator?: () => void;
}

export const EconomicsPricingView: React.FC<EconomicsPricingViewProps> = ({
  onSelectTab,
  onOpenCommandCenter,
  onOpenMoralSimulator
}) => {
  // Scenario simulation state for Compounding Value (Section 10)
  const [scenarioYear, setScenarioYear] = useState<number>(5);
  // Value Capture Model interactive step (Section 4)
  const [activeCaptureStep, setActiveCaptureStep] = useState<number>(0);
  // Economic Stack active level tab for mobile / deep dive (Section 5)
  const [selectedStackTier, setSelectedStackTier] = useState<string>('studio');
  // Interactive downstream value calculator state
  const [calcProjectScale, setCalcProjectScale] = useState<number>(50); // e.g. $50M infrastructure project
  const [calcAssetCount, setCalcAssetCount] = useState<number>(120);
  // Inquiry / Dialog modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState<boolean>(false);
  const [inquiryPlan, setInquiryPlan] = useState<string>('Atlas Enterprise');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  // Scenario data metrics
  const scenarioData = {
    1: {
      assets: '100 Assets',
      projects: '20 Projects',
      operators: '10 Operators',
      communities: '5 Communities',
      observations: '1.2M Observations',
      uncertaintyReduction: '18%',
      riskPremiumDiscount: '0.4%',
      reinvestmentPool: '$240,000',
      description: 'Foundational pilot catchments and baseline sensor deployments establish initial epistemic benchmarks.'
    },
    3: {
      assets: '12,500 Assets',
      projects: '1,400 Projects',
      operators: '850 Operators',
      communities: '180 Communities',
      observations: '420M Observations',
      uncertaintyReduction: '46%',
      riskPremiumDiscount: '1.2%',
      reinvestmentPool: '$4.8M',
      description: 'Bioregional data networks begin cross-validating soil moisture, hydrology, and community equity.'
    },
    5: {
      assets: '100,000 Assets',
      projects: '10,000 Projects',
      operators: '5,000 Operators',
      communities: '1,000 Communities',
      observations: 'Billions of Observations',
      uncertaintyReduction: '74%',
      riskPremiumDiscount: '2.8%',
      reinvestmentPool: '$38.5M',
      description: 'Cross-continental synthesis transforms historical telemetry into predictive global capital intelligence.'
    },
    10: {
      assets: '2,500,000 Assets',
      projects: '140,000 Projects',
      operators: '45,000 Operators',
      communities: '12,000 Communities',
      observations: 'Hundreds of Billions',
      uncertaintyReduction: '92%',
      riskPremiumDiscount: '4.5%',
      reinvestmentPool: '$340M',
      description: 'The Atlas network functions as standard civilizational coordination infrastructure.'
    }
  };

  const currentScenario = scenarioData[scenarioYear as keyof typeof scenarioData] || scenarioData[5];

  const valueCaptureSteps = [
    {
      title: 'Ecosystem Activity',
      subtitle: 'Real-world ground truth',
      detail: 'Sensors, community stewards, farmers, engineers, and researchers deploy physical hardware, restore catchments, and log daily observations.'
    },
    {
      title: 'Value Created',
      subtitle: 'Tangible ecological & social gain',
      detail: 'Carbon is sequestered, groundwater tables recharge, crop yields stabilize, clean water is delivered, and local employment expands.'
    },
    {
      title: 'Value Measured',
      subtitle: 'High-density telemetry',
      detail: 'Continuous IoT streams, satellite multispectral scans, and community ground-truthing capture multi-dimensional performance.'
    },
    {
      title: 'Value Verified',
      subtitle: 'Zero-knowledge proofs',
      detail: 'Cryptographic Merkle trees, peer-reviewed algorithms, and sovereign elder sign-offs validate outcomes without extractive intermediaries.'
    },
    {
      title: 'Value Coordinated',
      subtitle: 'Capital allocation & optimization',
      detail: 'Institutions allocate capital, underwrite infrastructure, lower insurance risk premiums, and distribute proof-of-regeneration disbursements.'
    },
    {
      title: 'Modest Value Captured',
      subtitle: 'Frictionless downstream fraction',
      detail: 'Atlas captures a modest, agreed-upon fraction only at high-consequence settlement or coordination milestones—never at foundational entry.'
    },
    {
      title: 'Reinvestment Engine',
      subtitle: 'Strengthening the Commons',
      detail: '100% of network protocol surpluses fund open-hardware CAD schemas, developer grants, sensor subsidies, and local community resilience pools.'
    },
    {
      title: 'Stronger Network',
      subtitle: 'Compounding intelligence & trust',
      detail: 'Lower coordination costs attract more participants, creating deeper datasets, better predictive models, and wider opportunities.'
    }
  ];

  const handleOpenInquiry = (planName: string) => {
    audioFeedback.playSubtleClick();
    setInquiryPlan(planName);
    setInquirySubmitted(false);
    setInquiryModalOpen(true);
  };

  // Comprehensive Schema.org JSON-LD Structured Data for SoftwareApplication & Services
  // Aligned with Atlas Sanctum's regenerative intelligence SEO & economic coordination architecture
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://atlassanctum.org/#organization",
        "name": "Atlas Sanctum",
        "url": "https://atlassanctum.org",
        "logo": "https://atlassanctum.org/logo.png",
        "description": "Atlas Sanctum is a civilizational operating system and economic coordination network for regenerative planetary stewardship, integrating moral intelligence, bioregional digital twins, and epistemic multi-agent reasoning.",
        "sameAs": [
          "https://github.com/atlassanctum",
          "https://x.com/atlassanctum"
        ],
        "knowsAbout": [
          "Regenerative Economics",
          "Bioregional Ecological Digital Twins",
          "Moral and Causal Artificial Intelligence",
          "Decentralized Verification and Merkle Provenance",
          "Seven Capitals Multi-Capital Accounting",
          "Living Systems Dynamics"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://atlassanctum.org/#software",
        "name": "Atlas Sanctum: Civilizational Operating System",
        "applicationCategory": "BusinessApplication, ScientificSoftware, EconomicCoordinationPlatform",
        "operatingSystem": "Web, Cloud, Sovereign Bioregional Mesh",
        "description": "A regenerative economic coordination platform and civilizational operating system designed to bind human dignity, ecological stewardship, community sovereignty, and AI reasoning.",
        "creator": {
          "@id": "https://atlassanctum.org/#organization"
        },
        "featureList": [
          "Commons $0 Open Data & Planetary Observatory",
          "Atlas Studio Project Operating System & Asset Management",
          "Atlas Intelligence Causal AI Decision Suite with 10 Autonomous Epistemic Agents",
          "Atlas Enterprise Sovereign Institutional Deployments",
          "Multi-Scale Satellite and Ground-Truth IoT Telemetry Verification",
          "Seven Capitals Value Cascading and Compounding Multiplier",
          "Zero-Knowledge Cryptographic Evidence Ledger and Merkle Trees",
          "Downstream Non-Extractive Value Capture and Community Reinvestment Pool"
        ],
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "0",
          "highPrice": "2500",
          "offerCount": "4",
          "offers": [
            {
              "@type": "Offer",
              "name": "Atlas Commons",
              "price": "0",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "0",
                "priceCurrency": "USD",
                "unitText": "MONTH",
                "description": "No paywall on foundational participation. Open standards, public observatory, basic project registry, and research schemas."
              },
              "description": "For communities, researchers, builders, and participants entering the Atlas network with zero barriers to entry.",
              "availability": "https://schema.org/InStock",
              "category": "Foundational Open Access"
            },
            {
              "@type": "Offer",
              "name": "Atlas Studio",
              "price": "500",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "500",
                "priceCurrency": "USD",
                "unitText": "MONTH",
                "description": "Professional operating environment for bioregional project design, operational IoT monitoring, and evidence collection."
              },
              "description": "For organizations designing, operating, and managing real-world ecological, agricultural, and infrastructure projects.",
              "availability": "https://schema.org/InStock",
              "category": "Project Operating System"
            },
            {
              "@type": "Offer",
              "name": "Atlas Intelligence",
              "price": "2500",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "2500",
                "priceCurrency": "USD",
                "unitText": "MONTH",
                "description": "Frontier causal decision infrastructure, 10 specialized autonomous AI agents, risk analytics, and institutional memory."
              },
              "description": "For institutions requiring deep intelligence, predictive causal models, multi-scale simulation, and decision support.",
              "availability": "https://schema.org/InStock",
              "category": "Decision Intelligence"
            },
            {
              "@type": "Offer",
              "name": "Atlas Enterprise",
              "price": "Custom",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "priceCurrency": "USD",
                "unitText": "YEAR",
                "description": "Sovereign deployment, private infrastructure, custom architecture, dedicated AI models, and ecosystem-scale governance."
              },
              "description": "For governments, multilateral development banks, infrastructure funds, and multinational environmental alliances.",
              "availability": "https://schema.org/InStock",
              "category": "Sovereign Institutional Deployment"
            }
          ]
        }
      },
      {
        "@type": "Service",
        "@id": "https://atlassanctum.org/#service-verification",
        "name": "Atlas Cryptographic Verification & Evidence Ledger Service",
        "serviceType": "Environmental Evidence Attestation & Telemetry Audit",
        "provider": {
          "@id": "https://atlassanctum.org/#organization"
        },
        "description": "Usage-based verification engine delivering Merkle-tree cryptographic proofs, satellite biomass validation, and IoT sensor stream audits.",
        "termsOfService": "https://atlassanctum.org/governance",
        "areaServed": "Global Bioregions"
      },
      {
        "@type": "Service",
        "@id": "https://atlassanctum.org/#service-capital-coordination",
        "name": "Atlas Capital Coordination & Opportunity Intelligence Service",
        "serviceType": "Regenerative Capital Allocation & Risk Underwriting Infrastructure",
        "provider": {
          "@id": "https://atlassanctum.org/#organization"
        },
        "description": "Coordination infrastructure for impact capital, reducing risk premiums and underwriting uncertainty for major bioregional infrastructure through empirical ground-truth dossiers.",
        "termsOfService": "https://atlassanctum.org/governance",
        "areaServed": "Global Bioregions"
      },
      {
        "@type": "Service",
        "@id": "https://atlassanctum.org/#service-infrastructure-telemetry",
        "name": "Atlas Physical Asset Lifecycle & Telemetry Service",
        "serviceType": "Asset Lifecycle Intelligence & Predictive Maintenance",
        "provider": {
          "@id": "https://atlassanctum.org/#organization"
        },
        "description": "Deployment-based physical asset intelligence featuring verifiable QR placards, real-time sensor streams, and predictive maintenance models.",
        "termsOfService": "https://atlassanctum.org/governance",
        "areaServed": "Global Bioregions"
      },
      {
        "@type": "Service",
        "@id": "https://atlassanctum.org/#service-specialized-intelligence",
        "name": "Atlas Frontier Simulation & System Dynamics Intelligence Service",
        "serviceType": "High-Consequence Decision Modeling & Strategic Simulation",
        "provider": {
          "@id": "https://atlassanctum.org/#organization"
        },
        "description": "Advanced multi-agent simulation, differential stock-flow forecasting, and systemic risk analysis for consequential civilizational challenges.",
        "termsOfService": "https://atlassanctum.org/governance",
        "areaServed": "Global Bioregions"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] pb-24 selection:bg-[#C5A059]/30 selection:text-[#F5F5F0]">
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      {/* ========================================================================= */}
      {/* TOP STATUS BAR & CONTEXT INDICATOR */}
      {/* ========================================================================= */}
      <div className="border-b border-[#F5F5F0]/10 bg-[#0D0D0D]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059] animate-pulse"></div>
          <span className="font-mono uppercase tracking-widest text-[#C5A059] font-semibold text-[10px] sm:text-xs">
            ECONOMIC COORDINATION INFRASTRUCTURE
          </span>
          <span className="text-[#F5F5F0]/30 hidden sm:inline">•</span>
          <span className="text-[#F5F5F0]/60 hidden sm:inline">
            Non-Extractive Network Paradigm
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs text-[#F5F5F0]/60">
          <span>COORDINATION CAPACITY: <strong className="text-[#F5F5F0]">$380M+ POOL</strong></span>
          <button
            onClick={() => onSelectTab('capital-engine')}
            className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            Capital Engine <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-28">

        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION */}
        {/* ========================================================================= */}
        <section id="economics-hero" className="relative pt-6 pb-12 overflow-hidden">
          {/* Subtle Ambient Background Geometry */}
          <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#1B3022]/40 to-transparent blur-3xl rounded-full"></div>
            <div className="absolute top-12 right-10 w-96 h-96 bg-[#C5A059]/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B3022]/80 border border-[#C5A059]/40 text-[#C5A059] font-mono text-xs uppercase tracking-[0.2em] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>THE ATLAS ECONOMY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-[#F5F5F0] leading-[1.08]">
              Build Value. <br />
              <span className="italic font-light text-[#C5A059]">Compound Intelligence.</span> <br />
              Share the Upside.
            </h1>

            <p className="text-base sm:text-xl text-[#F5F5F0]/80 font-sans max-w-3xl mx-auto leading-relaxed font-light">
              Atlas Sanctum is designed as a <strong className="text-[#F5F5F0] font-medium">regenerative economic coordination network</strong>—not a traditional software subscription. The more people, projects, infrastructure, evidence, and capital participate, the more useful the network becomes.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  onSelectTab('observatory');
                }}
                className="px-8 py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2.5 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                <span>Explore the Network</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenInquiry('Institutional Consultation')}
                className="px-8 py-4 bg-[#1B3022]/80 hover:bg-[#1B3022] border border-[#C5A059]/50 text-[#F5F5F0] font-semibold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2.5 transition-all hover:border-[#C5A059] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span>Talk to Atlas</span>
              </button>
            </div>
          </div>

          {/* Living Network Flow Visualization (People → Projects → Evidence → Intelligence → Capital → Outcomes → Trust → Participation) */}
          <div className="mt-16 p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 shadow-2xl relative">
            <div className="text-center mb-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059]">
                The Continuous Regenerative Coordination Cycle
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative">
              {[
                { step: '01', name: 'People', desc: 'Communities & Stewards', icon: TreeDeciduous },
                { step: '02', name: 'Projects', desc: 'Bioregional Actions', icon: Layers },
                { step: '03', name: 'Evidence', desc: 'Verifiable Telemetry', icon: FileCheck2 },
                { step: '04', name: 'Intelligence', desc: 'Causal Synthesis', icon: Cpu },
                { step: '05', name: 'Capital', desc: 'Targeted Allocation', icon: Coins },
                { step: '06', name: 'Outcomes', desc: 'Measured Restoration', icon: Activity },
                { step: '07', name: 'Trust', desc: 'Cryptographic Audit', icon: Shield },
                { step: '08', name: 'Participation', desc: 'Compounding Scale', icon: RefreshCw }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 hover:border-[#C5A059]/60 transition-all flex flex-col justify-between group hover:bg-[#1B3022]/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] text-[#C5A059] font-bold">{item.step}</span>
                      <Icon className="w-4 h-4 text-[#F5F5F0]/60 group-hover:text-[#C5A059] transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">{item.name}</h4>
                      <p className="text-[10px] text-[#F5F5F0]/50 line-clamp-2 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between text-xs text-[#F5F5F0]/60 font-mono">
              <span>FOUNDATION: Open Access Commons</span>
              <span className="text-[#C5A059] font-semibold">VALUE ACCRUAL: Downstream Coordination & Trust Infrastructure</span>
              <span>OUTCOME: Non-Extractive Growth</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: THE ECONOMIC THESIS */}
        {/* ========================================================================= */}
        <section id="economic-thesis" className="space-y-12">
          <div className="p-8 sm:p-12 rounded-sm bg-gradient-to-br from-[#121212] via-[#0D0D0D] to-[#1B3022]/40 border border-[#C5A059]/30 shadow-2xl">
            <div className="max-w-3xl space-y-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                THE FUNDAMENTAL PHILOSOPHICAL SHIFT
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F0] leading-tight">
                “We don't want to maximize what we charge each participant.
                <br />
                <span className="text-[#C5A059] italic font-light">We want to maximize the value the network creates.”</span>
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#F5F5F0]/10">
              {/* Traditional SaaS Flow */}
              <div className="p-6 rounded-sm bg-[#0A0A0A] border border-red-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
                    Traditional SaaS: Extractive Seat Model
                  </h3>
                  <span className="text-[10px] font-mono text-red-400/70 border border-red-500/30 px-2 py-0.5 rounded">High Friction</span>
                </div>
                <div className="space-y-2 font-mono text-xs text-[#F5F5F0]/70">
                  <div className="p-2 bg-[#141414] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
                    <span>1. BUILD</span>
                    <span className="text-[10px] text-[#F5F5F0]/40">Private IP silo</span>
                  </div>
                  <div className="p-2 bg-[#141414] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
                    <span>2. SELL</span>
                    <span className="text-[10px] text-[#F5F5F0]/40">Aggressive sales reps</span>
                  </div>
                  <div className="p-2 bg-[#141414] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
                    <span>3. ACQUIRE</span>
                    <span className="text-[10px] text-[#F5F5F0]/40">Customer CAC lock-in</span>
                  </div>
                  <div className="p-2 bg-[#141414] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
                    <span>4. SUBSCRIBE</span>
                    <span className="text-[10px] text-[#F5F5F0]/40">Tax on every user seat</span>
                  </div>
                  <div className="p-2 bg-[#141414] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
                    <span>5. RENEW</span>
                    <span className="text-[10px] text-[#F5F5F0]/40">Price escalation trap</span>
                  </div>
                </div>
                <p className="text-xs text-[#F5F5F0]/60 italic">
                  Result: Limits participation, disincentivizes data sharing, restricts community access to paywalls.
                </p>
              </div>

              {/* Atlas Sanctum Flywheel */}
              <div className="p-6 rounded-sm bg-[#121A15] border border-[#C5A059]/40 space-y-4 shadow-[0_0_20px_rgba(27,48,34,0.4)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                    Atlas Network: Coordination Flywheel
                  </h3>
                  <span className="text-[10px] font-mono text-[#C5A059] border border-[#C5A059]/50 px-2 py-0.5 rounded bg-[#1B3022]">Compounding</span>
                </div>
                <div className="space-y-1.5 font-mono text-xs text-[#F5F5F0]/90">
                  {[
                    'PARTICIPATE (Free Open Commons)',
                    'CREATE REAL-WORLD ACTIVITY',
                    'GENERATE VERIFIABLE EVIDENCE',
                    'BUILD COLLECTIVE INTELLIGENCE',
                    'REDUCE SYSTEMIC UNCERTAINTY',
                    'COORDINATE CAPITAL & RESOURCES',
                    'CREATE RESTORATIVE OUTCOMES',
                    'STRENGTHEN TRUST & PROVENANCE',
                    'MORE PARTICIPATION (ACCELERATING)'
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 px-2.5 bg-[#0D1410] rounded border border-[#C5A059]/20 flex items-center justify-between text-[11px]"
                    >
                      <span className="text-[#C5A059] font-semibold">{idx + 1}. {step}</span>
                      <CheckCircle2 className="w-3 h-3 text-[#C5A059]/70" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#C5A059] font-medium">
                  Result: Zero barriers to entry create unprecedented data gravity, unlocking high-value institutional settlement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: PARTICIPATION IS NOT THE PRODUCT */}
        {/* ========================================================================= */}
        <section id="participation-not-product" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                OPEN FOUNDATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
                Participation Should Be Accessible. <br />
                <span className="text-[#C5A059] italic">Coordination Creates Value.</span>
              </h2>
            </div>
            <div className="text-sm text-[#F5F5F0]/70 max-w-md space-y-2">
              <p className="font-semibold text-[#F5F5F0]">The front door should be open.</p>
              <p className="font-light">
                The deeper economic layers should capture value where Atlas materially improves real-world outcomes.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10">
            <div className="mb-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#F5F5F0] flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#C5A059]" />
                <span>Freely Accessible Foundational Capabilities ($0 Commons Tier)</span>
              </h3>
              <p className="text-xs text-[#F5F5F0]/60 mt-1">
                Openness accelerates: <span className="text-[#C5A059] font-mono">participants → activity → data → evidence → developers → intelligence → network value</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Community Participation', desc: 'Local stewarding, field reports, and indigenous knowledge contributions without cost.' },
                { title: 'Basic Project Registry', desc: 'Register restoration initiatives, catchments, and LifeHouses on the global registry.' },
                { title: 'Open Standards & Schemas', desc: 'Freely forkable JSON-LD schemas for carbon flux, biochar, and agroecology.' },
                { title: 'Public Observatory Information', desc: 'Multi-scale satellite telemetry and planetary health indicators open to humanity.' },
                { title: 'Peer-Reviewed Research', desc: 'Full academic papers, epistemological analyses, and carbon permanence models.' },
                { title: 'Field Methodologies', desc: 'Open-hardware CAD blueprints, kiln assembly guides, and soil testing protocols.' },
                { title: 'Basic Developer APIs', desc: 'Standard REST endpoints for reading public telemetry and verification Merkle roots.' },
                { title: 'Public Project Discovery', desc: 'Search and inspect verified regeneration initiatives across all continents.' }
              ].map((feat, idx) => (
                <div key={idx} className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <h4 className="text-xs font-bold text-[#F5F5F0]">{feat.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#F5F5F0]/60 font-light">{feat.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#C5A059]">
                Zero Paywalls on Fundamental Civilizational Knowledge
              </span>
              <button
                onClick={() => onSelectTab('commons')}
                className="text-xs text-[#F5F5F0] hover:text-[#C5A059] flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
              >
                Access the Open Commons <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: THE ATLAS VALUE-CAPTURE MODEL */}
        {/* ========================================================================= */}
        <section id="value-capture-model" className="space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              THE VALUE-CAPTURE CASCADE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              We Capture Value Downstream.
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 max-w-3xl font-light">
              Atlas is designed to monetize moments where its infrastructure materially improves economic activity—not every interaction with the platform.
            </p>
          </div>

          {/* Interactive Flow Stepper */}
          <div className="p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
              {valueCaptureSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    setActiveCaptureStep(idx);
                  }}
                  className={`p-3 rounded-sm text-left transition-all cursor-pointer border ${
                    activeCaptureStep === idx
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-lg scale-105'
                      : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#C5A059] block font-bold mb-1">0{idx + 1}</span>
                  <p className="text-[11px] font-bold leading-tight line-clamp-2">{step.title}</p>
                </button>
              ))}
            </div>

            {/* Active Step Deep Dive Callout */}
            <div className="p-6 rounded-sm bg-[#121A15] border border-[#C5A059]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                    STEP 0{activeCaptureStep + 1}: {valueCaptureSteps[activeCaptureStep].title}
                  </span>
                  <span className="text-[10px] text-[#F5F5F0]/50 font-mono">({valueCaptureSteps[activeCaptureStep].subtitle})</span>
                </div>
                <p className="text-sm text-[#F5F5F0]/90 leading-relaxed font-light">
                  {valueCaptureSteps[activeCaptureStep].detail}
                </p>
              </div>

              <div className="p-4 rounded-sm bg-[#0A0A0A] border border-[#C5A059]/30 font-mono text-xs shrink-0 space-y-1">
                <span className="text-[10px] text-[#C5A059] uppercase tracking-widest block font-bold">ECONOMIC PRINCIPLE</span>
                <p className="text-[#F5F5F0] text-xs">
                  More Value Created → More Reinvestment → Greater Capability
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: PRICING ARCHITECTURE — THE ATLAS ECONOMIC STACK */}
        {/* ========================================================================= */}
        <section id="pricing-stack" className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              MULTI-TIERED CAPACITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F0]">
              The Atlas Economic Stack
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 font-light">
              Structured institutional capacity scaled to your operational scope—from grassroots community stewards to sovereign infrastructure operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* TIER 1: COMMONS */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-6 hover:border-[#C5A059]/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">FOUNDATION</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30">Open Access</span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#F5F5F0]">Commons</h3>
                  <p className="text-3xl font-mono font-bold text-[#C5A059] mt-2">$0</p>
                  <p className="text-xs text-[#F5F5F0]/60 mt-1 font-light">
                    For communities, researchers, builders, and participants entering the Atlas network.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F5F0]/10 space-y-2.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#F5F5F0]/40 font-bold">Included Capabilities:</p>
                  {[
                    'Community participation',
                    'Basic project registry',
                    'Public Observatory access',
                    'Open standards & schemas',
                    'Selected research papers',
                    'Basic read APIs',
                    'Community knowledge base',
                    'Public project discovery'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#F5F5F0]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    onSelectTab('commons');
                  }}
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Enter the Commons
                </button>
                <p className="text-[10px] text-center font-mono text-[#C5A059]/80">No paywall on participation.</p>
              </div>
            </div>

            {/* TIER 2: ATLAS STUDIO */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-[#C5A059]/30 flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-all relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">BUILD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40">Operator Tier</span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#F5F5F0]">Atlas Studio</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xs font-mono text-[#F5F5F0]/60">From</span>
                    <p className="text-3xl font-mono font-bold text-[#C5A059]">$500</p>
                    <span className="text-xs font-mono text-[#F5F5F0]/60">/month</span>
                  </div>
                  <p className="text-xs text-[#F5F5F0]/60 mt-1 font-light">
                    For organizations designing, funding, and operating real-world projects through Atlas.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F5F0]/10 space-y-2.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#F5F5F0]/40 font-bold">Operating Environment:</p>
                  {[
                    'Project intelligence engine',
                    'Operational dashboards',
                    'Multi-stakeholder collaboration',
                    'Physical asset management',
                    'High-frequency IoT monitoring',
                    'Evidence collection workflows',
                    'AI strategy & scenario tools',
                    'Project analytics & reporting',
                    'Team workspaces & permissions'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#F5F5F0]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    onSelectTab('project-os');
                  }}
                  className="w-full py-3 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Build with Atlas
                </button>
                <p className="text-[10px] text-center font-mono text-[#F5F5F0]/50">Professional operating environment.</p>
              </div>
            </div>

            {/* TIER 3: ATLAS INTELLIGENCE */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121A15] border-2 border-[#C5A059] flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(197,160,89,0.15)] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#C5A059] text-black font-mono text-[9px] font-bold uppercase tracking-widest">
                DECISION LAYER
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">INTELLIGENCE</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C5A059] text-black font-bold">Deep Reasoning</span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#F5F5F0]">Atlas Intelligence</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xs font-mono text-[#F5F5F0]/60">From</span>
                    <p className="text-3xl font-mono font-bold text-[#C5A059]">$2,500</p>
                    <span className="text-xs font-mono text-[#F5F5F0]/60">/month</span>
                  </div>
                  <p className="text-xs text-[#F5F5F0]/70 mt-1 font-light">
                    For institutions requiring deeper intelligence, prediction, integration, and decision support.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F5F0]/10 space-y-2.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">Decision Infrastructure:</p>
                  {[
                    '10 Autonomous specialized AI agents',
                    'Predictive causal intelligence',
                    'Bioregional risk & resilience analysis',
                    'Full knowledge graph access',
                    'Institutional memory post-mortems',
                    'Advanced multi-scale analytics',
                    'Custom fine-tuned intelligence models',
                    'Enterprise API access & streaming',
                    'Decision room deliberation engine'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#F5F5F0]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    onSelectTab('decision-room');
                  }}
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md"
                >
                  Unlock Intelligence
                </button>
                <p className="text-[10px] text-center font-mono text-[#C5A059]">For consequential decision-making.</p>
              </div>
            </div>

            {/* TIER 4: ATLAS ENTERPRISE */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-6 hover:border-[#C5A059]/40 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">INSTITUTIONAL</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A1A1A] text-[#F5F5F0]/70 border border-[#F5F5F0]/20">Ecosystem Scale</span>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#F5F5F0]">Atlas Enterprise</h3>
                  <p className="text-3xl font-mono font-bold text-[#F5F5F0] mt-2">Custom</p>
                  <p className="text-xs text-[#F5F5F0]/60 mt-1 font-light">
                    For governments, financial institutions, infrastructure operators, and multinational funds.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F5F0]/10 space-y-2.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#F5F5F0]/40 font-bold">Institutional Scale:</p>
                  {[
                    'Sovereign institutional deployment',
                    'Custom hardware mesh architecture',
                    'Dedicated intelligence models',
                    'Private air-gapped infrastructure',
                    'Constitutional governance tailoring',
                    'Enterprise security architecture',
                    'Capital coordination & disbursement',
                    'Large-scale territorial monitoring',
                    'Dedicated strategic architects'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#F5F5F0]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => handleOpenInquiry('Atlas Enterprise')}
                  className="w-full py-3 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Build an Institutional Atlas
                </button>
                <p className="text-[10px] text-center font-mono text-[#F5F5F0]/50">Custom SLA & Governance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: COORDINATION PRICING — VALUE PRICED WHEN VALUE IS CREATED */}
        {/* ========================================================================= */}
        <section id="coordination-pricing" className="space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              TRANSACTION & COORDINATION PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Some Value Should Be Priced When Value Is Created.
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 max-w-3xl font-light">
              Certain Atlas capabilities use transaction, coordination, verification, or infrastructure-based pricing rather than subscriptions. You pay only when tangible, verified outcomes are realized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Verification */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-4 hover:border-[#C5A059]/50 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-[#F5F5F0]">Verification</h3>
                  <p className="text-xs text-[#C5A059] font-mono mt-0.5">Evidence you can trust</p>
                </div>
                <p className="text-xs text-[#F5F5F0]/70 font-light leading-relaxed">
                  Cryptographic attestation, satellite biomass verification, Merkle proof generation, and sensor stream audits.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">PRICING MODEL</span>
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">Usage / Project Based</span>
              </div>
            </div>

            {/* Card 2: Capital Coordination */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-4 hover:border-[#C5A059]/50 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-[#F5F5F0]">Capital Coordination</h3>
                  <p className="text-xs text-[#C5A059] font-mono mt-0.5">Better intelligence around capital</p>
                </div>
                <p className="text-xs text-[#F5F5F0]/70 font-light leading-relaxed">
                  Opportunity discovery, empirical diligence dossiers, milestone tracking, and proof-of-regeneration disbursement support.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">PRICING MODEL</span>
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">Custom / Coordination Based</span>
              </div>
            </div>

            {/* Card 3: Infrastructure */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-4 hover:border-[#C5A059]/50 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-[#F5F5F0]">Infrastructure</h3>
                  <p className="text-xs text-[#C5A059] font-mono mt-0.5">Lifecycle asset intelligence</p>
                </div>
                <p className="text-xs text-[#F5F5F0]/70 font-light leading-relaxed">
                  Physical asset identity (QR placards), IoT sensor telemetry streams, predictive maintenance, and operational analytics.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">PRICING MODEL</span>
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">Asset / Deployment Based</span>
              </div>
            </div>

            {/* Card 4: Specialized Intelligence */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-4 hover:border-[#C5A059]/50 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-[#F5F5F0]">Specialized Intelligence</h3>
                  <p className="text-xs text-[#C5A059] font-mono mt-0.5">High-consequence decision systems</p>
                </div>
                <p className="text-xs text-[#F5F5F0]/70 font-light leading-relaxed">
                  Dynamic simulation, stock-flow differential forecasting, sector systemic risk modeling, and multi-criteria strategy analysis.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">PRICING MODEL</span>
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">Usage / Enterprise / Custom</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: PAY WHEN ATLAS CREATES MATERIAL VALUE */}
        {/* ========================================================================= */}
        <section id="material-value-principle" className="p-8 sm:p-12 rounded-sm bg-[#121A15] border border-[#C5A059]/50 shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              THE CORE PRICING COVENANT
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F0] leading-tight">
              The More Value Atlas Helps Create, <br />
              <span className="text-[#C5A059] italic">the More Value Atlas Can Sustainably Capture.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-sm text-[#F5F5F0]/80 font-light leading-relaxed">
              <div className="space-y-3 p-4 bg-[#0D0D0D]/60 rounded border border-[#F5F5F0]/5">
                <p className="font-mono text-xs text-[#C5A059] uppercase">Foundational Exemption</p>
                <p>A community shouldn't have to pay simply to participate.</p>
                <p>A researcher shouldn't have to pay to contribute knowledge.</p>
                <p>A developer shouldn't have to pay for every foundational interaction.</p>
              </div>
              <div className="space-y-3 p-4 bg-[#0D0D0D]/60 rounded border border-[#C5A059]/30">
                <p className="font-mono text-xs text-[#C5A059] uppercase">Downstream Reciprocity</p>
                <p>
                  When Atlas materially improves a major infrastructure deployment, verifies valuable evidence, coordinates capital, reduces operational uncertainty, or provides high-value institutional intelligence, a sustainable economic exchange occurs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: ATLAS NETWORK DIVIDEND */}
        {/* ========================================================================= */}
        <section id="network-dividend" className="space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              RECIPROCAL VALUE MULTIPLIER
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              The Atlas Network Dividend
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 max-w-3xl font-light">
              When participants contribute data, knowledge, capital, work, infrastructure, research, or local intelligence, Atlas increases the value of those contributions by connecting them to the wider network.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-8">
            {/* Flow line */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-[#141414] rounded-sm font-mono text-xs text-[#C5A059]">
              <span>YOUR CONTRIBUTION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
              <span>ATLAS NETWORK</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
              <span>MORE CONNECTIONS</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
              <span>MORE INTELLIGENCE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
              <span>MORE OPPORTUNITY</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
              <span className="text-[#F5F5F0] font-bold">EXPONENTIAL VALUE</span>
            </div>

            {/* 8 Participant benefits */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Better Information', desc: 'Real-time hydrological, weather, and market intelligence.' },
                { name: 'Opportunity Access', desc: 'Direct matchmaking with global restoration funds and stewards.' },
                { name: 'Lower Costs', desc: 'Shared sensor telemetry, open CAD hardware, and pooled audits.' },
                { name: 'Financing Access', desc: 'Verified track records unlock catalytic grants and outcomes pools.' },
                { name: 'Global Visibility', desc: 'Showcase verified bioregional impact to international partners.' },
                { name: 'Infrastructure Sharing', desc: 'Access distributed LifeHouse hubs and processing mills.' },
                { name: 'Decentralized Services', desc: 'Deploy autonomous AI agents to manage water distribution.' },
                { name: 'Revenue Opportunities', desc: 'Earn verified proof-of-regeneration yields and ecosystem fees.' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-1">
                  <h4 className="text-xs font-bold text-[#C5A059]">{item.name}</h4>
                  <p className="text-[11px] text-[#F5F5F0]/60 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: PRICE AGAINST VALUE, NOT FEATURES */}
        {/* ========================================================================= */}
        <section id="value-vs-features" className="p-8 sm:p-12 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              COORDINATION METRICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Price Against Value, Not Features.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-sm bg-[#141414] border border-[#F5F5F0]/10 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#F5F5F0]/50 font-bold">
                Traditional SaaS Focuses On:
              </h3>
              <ul className="space-y-3 text-sm text-[#F5F5F0]/60 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-red-400">×</span> “How many users?”
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">×</span> “How many seats?”
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">×</span> “How many features are locked behind tier upgrades?”
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">×</span> “Which tier extracts the most per customer?”
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-sm bg-[#121A15] border border-[#C5A059]/40 space-y-4 shadow-lg">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                Atlas Sanctum Focuses On:
              </h3>
              <ul className="space-y-3 text-sm text-[#F5F5F0] font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>“What real-world value are we helping you create?”</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>“How much operational and climate uncertainty are we removing?”</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>“What catastrophic failure risk are we mitigating?”</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>“What restorative outcomes are we enabling at bioregional scale?”</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-2xl sm:text-3xl font-serif text-[#C5A059] italic">
              “Price should follow economic value.”
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: COMPOUNDING VALUE GRAPHIC (SCENARIO MODELING) */}
        {/* ========================================================================= */}
        <section id="compounding-value" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                NETWORK HORIZONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
                The Network Becomes the Asset.
              </h2>
            </div>
            <div className="p-2 px-3 rounded bg-[#1B3022]/60 border border-[#C5A059]/30 text-[11px] font-mono text-[#C5A059]">
              Illustrative network scenario — not current Atlas performance.
            </div>
          </div>

          {/* Interactive Scenario Slider & Growth Visualizer */}
          <div className="p-6 sm:p-10 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/60">Select Network Growth Horizon:</span>
                <span className="text-[#C5A059] font-bold text-sm">HORIZON: YEAR {scenarioYear}</span>
              </div>

              {/* Year Toggle Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 3, 5, 10].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setScenarioYear(yr);
                    }}
                    className={`py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                      scenarioYear === yr
                        ? 'bg-[#C5A059] text-black font-bold border-[#C5A059] shadow-md'
                        : 'bg-[#141414] text-[#F5F5F0]/60 border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded bg-[#141414] border border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase block">CONNECTED ASSETS</span>
                <p className="text-lg font-mono font-bold text-[#F5F5F0] mt-1">{currentScenario.assets}</p>
              </div>
              <div className="p-4 rounded bg-[#141414] border border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase block">ACTIVE PROJECTS</span>
                <p className="text-lg font-mono font-bold text-[#F5F5F0] mt-1">{currentScenario.projects}</p>
              </div>
              <div className="p-4 rounded bg-[#141414] border border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase block">COMMUNITIES</span>
                <p className="text-lg font-mono font-bold text-[#F5F5F0] mt-1">{currentScenario.communities}</p>
              </div>
              <div className="p-4 rounded bg-[#141414] border border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase block">UNCERTAINTY REDUCTION</span>
                <p className="text-lg font-mono font-bold text-[#C5A059] mt-1">-{currentScenario.uncertaintyReduction}</p>
              </div>
              <div className="p-4 rounded bg-[#141414] border border-[#F5F5F0]/10">
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase block">REINVESTMENT POOL</span>
                <p className="text-lg font-mono font-bold text-[#C5A059] mt-1">{currentScenario.reinvestmentPool}</p>
              </div>
            </div>

            <p className="text-sm text-[#F5F5F0]/80 font-light italic border-l-2 border-[#C5A059] pl-4">
              {currentScenario.description}
            </p>

            <div className="pt-4 border-t border-[#F5F5F0]/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-[#F5F5F0]/60">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Compounding Knowledge</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Empirical Evidence</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Predictive Precision</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Institutional Trust</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: THE ATLAS RISK PREMIUM */}
        {/* ========================================================================= */}
        <section id="risk-premium" className="space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              EVIDENCE-BASED UNDERWRITING
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Reduce Uncertainty. Unlock Better Economics.
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 max-w-3xl font-light">
              Over time, trusted evidence and operational intelligence can help institutions make better risk decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project A */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-red-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 font-bold">PROJECT A: UNCONNECTED</span>
                <span className="text-[10px] font-mono text-red-400/80 px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30">High Uncertainty</span>
              </div>
              <h3 className="text-xl font-serif text-[#F5F5F0]">Traditional Unverified Deployment</h3>
              <ul className="space-y-2.5 text-xs text-[#F5F5F0]/60 font-light">
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Unknown or unverified local operators
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Limited or self-reported historical performance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Infrequent annual PDF audits
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Uncertain long-term maintenance and replacement
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> High cost of capital & prohibitive insurance deductibles
                </li>
              </ul>
            </div>

            {/* Project B */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121A15] border border-[#C5A059]/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C5A059] font-bold">PROJECT B: ATLAS CONNECTED</span>
                <span className="text-[10px] font-mono text-[#C5A059] px-2 py-0.5 rounded bg-[#1B3022] border border-[#C5A059]/50">Zero-Knowledge Attested</span>
              </div>
              <h3 className="text-xl font-serif text-[#F5F5F0]">Atlas Verified Infrastructure</h3>
              <ul className="space-y-2.5 text-xs text-[#F5F5F0]/90 font-light">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> Verified stewardship track record & community sign-off
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> Continuous real-time IoT sensor telemetry streams
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> Autonomous predictive maintenance & failure early warnings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> Transparent Merkle proof evidence ledger
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> Lower capital risk premia enabled by empirical trust
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 12: WHY OPENNESS STRENGTHENS THE ECONOMICS */}
        {/* ========================================================================= */}
        <section id="openness-economics" className="p-8 sm:p-12 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-8">
          <div className="space-y-3 max-w-3xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              OPEN PROTOCOL ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Open at the Foundation. Defensible at the Network.
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 font-light">
              We do not need to enclose every component to become foundational civilizational infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#F5F5F0] font-bold">
                  Open by Design (The Commons)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#F5F5F0]/70 font-mono">
                <li>• Open communication protocols</li>
                <li>• Priority floor standards & schemas</li>
                <li>• SDKs & developer toolkits</li>
                <li>• Academic research & methodologies</li>
                <li>• Sensor hardware CAD schematics</li>
                <li>• Interoperability bindings</li>
              </ul>
            </div>

            <div className="p-6 rounded-sm bg-[#1B3022]/40 border border-[#C5A059]/40 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#C5A059] font-bold">
                  Defensible Through Compounding Utility
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#F5F5F0]/90 font-mono">
                <li>• Institutional intelligence graph</li>
                <li>• Immutable historical evidence archives</li>
                <li>• Deep multi-stakeholder relationships</li>
                <li>• Cryptographic trust infrastructure</li>
                <li>• High-consequence coordination capabilities</li>
                <li>• Cumulative ground-truth observational data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 13: REVENUE FLYWHEEL */}
        {/* ========================================================================= */}
        <section id="revenue-flywheel" className="space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              SUSTAINABLE REINVESTMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Revenue Should Strengthen the Network.
            </h2>
            <p className="text-sm text-[#F5F5F0]/70 max-w-3xl font-light">
              Atlas revenue funds better infrastructure, research, intelligence, trust systems, developer tools, field deployment, and ecosystem resilience.
            </p>
          </div>

          <div className="p-8 rounded-sm bg-gradient-to-r from-[#121212] via-[#1B3022]/30 to-[#121212] border border-[#C5A059]/30">
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#C5A059]">
              <div className="p-3 bg-[#0A0A0A] rounded border border-[#C5A059]/30">OPEN PARTICIPATION</div>
              <ArrowRight className="w-4 h-4 text-[#F5F5F0]/40" />
              <div className="p-3 bg-[#0A0A0A] rounded border border-[#C5A059]/30">MORE ACTIVITY & DATA</div>
              <ArrowRight className="w-4 h-4 text-[#F5F5F0]/40" />
              <div className="p-3 bg-[#0A0A0A] rounded border border-[#C5A059]/30">DEEPER INTELLIGENCE</div>
              <ArrowRight className="w-4 h-4 text-[#F5F5F0]/40" />
              <div className="p-3 bg-[#0A0A0A] rounded border border-[#C5A059]/30">MODEST VALUE CAPTURE</div>
              <ArrowRight className="w-4 h-4 text-[#F5F5F0]/40" />
              <div className="p-3 bg-[#1B3022] rounded border border-[#C5A059] text-[#F5F5F0] font-bold">100% REINVESTMENT</div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 14: PRINCIPLES OF PRICING (6 TYPOGRAPHIC STATEMENTS) */}
        {/* ========================================================================= */}
        <section id="pricing-principles" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              ETHICAL AXIOMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Principles of Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Accessible Participation', desc: 'No tolls at the gate. Any human or community can register and participate freely.' },
              { num: '02', title: 'Value-Based Monetization', desc: 'Monetize only when real-world efficiency, intelligence, or risk reduction occurs.' },
              { num: '03', title: 'Transparent Economics', desc: 'No dark patterns, no hidden seat fees, no algorithmic price gouging.' },
              { num: '04', title: 'Compounding Network Value', desc: 'Every contribution adds permanent value to all other participants in the network.' },
              { num: '05', title: 'Participant Benefit', desc: 'Participants receive direct tangible dividends in intelligence, funding, and reduced costs.' },
              { num: '06', title: 'Long-Term Reinvestment', desc: 'Revenues strengthen shared sensors, open CAD libraries, and sovereign resilience.' }
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 transition-all space-y-3">
                <span className="text-2xl font-serif text-[#C5A059]">{p.num}</span>
                <h3 className="text-base font-bold text-[#F5F5F0]">{p.title}</h3>
                <p className="text-xs text-[#F5F5F0]/70 font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-sm bg-[#121A15] border border-[#C5A059]/40 text-center">
            <p className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              The goal is not maximum extraction. The goal is maximum sustainable value creation.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 15: FINAL ECONOMIC EQUATION */}
        {/* ========================================================================= */}
        <section id="final-equation" className="p-8 sm:p-16 rounded-sm bg-gradient-to-b from-[#121A15] to-[#0A0A0A] border border-[#C5A059]/40 text-center space-y-8 shadow-2xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3022] border border-[#C5A059]/40 text-[#C5A059] font-mono text-xs uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>THE REGENERATIVE EQUATION</span>
          </div>

          <div className="p-6 sm:p-8 rounded-sm bg-[#0A0A0A]/80 border border-[#F5F5F0]/10 font-mono text-sm sm:text-lg text-[#C5A059] max-w-3xl mx-auto shadow-inner">
            VERIFIED VALUE CREATED × NETWORK COMPOUNDING × TRUST × REAL-WORLD ACTIVITY <br />
            <span className="text-white font-bold text-xl sm:text-2xl block mt-2">= ATLAS ECONOMIC CAPACITY</span>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F0] leading-tight">
              Huge value created. <br />
              Modest value captured. <br />
              Strong reinvestment. <br />
              <span className="text-[#C5A059] italic">An increasingly capable network.</span>
            </h2>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onSelectTab('project-os');
              }}
              className="px-8 py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <span>Build With Atlas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onSelectTab('capital-engine');
              }}
              className="px-8 py-4 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#F5F5F0] font-semibold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-[#C5A059]" />
              <span>Explore Capital Engine</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 16: FOOTER DISCLAIMER / PRICING GOVERNANCE */}
        {/* ========================================================================= */}
        <footer className="pt-8 border-t border-[#F5F5F0]/10 space-y-4">
          <div className="p-4 sm:p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/5 text-[11px] text-[#F5F5F0]/50 font-sans leading-relaxed space-y-2">
            <p className="font-mono text-[#C5A059] text-[10px] uppercase tracking-widest font-semibold">
              PRICING GOVERNANCE & REGULATORY NOTE
            </p>
            <p>
              Pricing shown represents an evolving framework and illustrative starting points, not a commitment to fixed commercial terms. Enterprise, infrastructure, capital coordination, verification, and regulated activities may be subject to custom agreements, jurisdictional requirements, partner structures, and applicable laws. Atlas validates economic mechanisms through real-world empirical evidence before making performance claims.
            </p>
          </div>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* INQUIRY & CONSULTATION MODAL */}
      {/* ========================================================================= */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest font-bold">ATLAS SANCTUM ADMISSIONS</span>
                <h3 className="text-xl font-serif text-[#F5F5F0]">{inquiryPlan}</h3>
              </div>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-[#F5F5F0]/60 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="p-6 bg-[#121A15] border border-[#C5A059]/40 rounded-sm text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5A059] mx-auto" />
                <h4 className="text-lg font-serif text-[#F5F5F0]">Inquiry Transmitted to Council</h4>
                <p className="text-xs text-[#F5F5F0]/70 font-light">
                  A dedicated Atlas Systems Architect will coordinate with <strong className="text-white">{inquiryEmail}</strong> within 24 hours to review your institutional requirements.
                </p>
                <button
                  onClick={() => setInquiryModalOpen(false)}
                  className="px-6 py-2.5 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-widest rounded-sm mt-4 cursor-pointer"
                >
                  Return to Network
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inquiryEmail) {
                    audioFeedback.playSubtleClick();
                    setInquirySubmitted(true);
                  }
                }}
                className="space-y-4"
              >
                <p className="text-xs text-[#F5F5F0]/70 font-light">
                  Please provide your organization details to configure your institutional architecture or explore participation.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Institutional Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="architect@organization.org"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Estimated Asset / Project Scope</label>
                  <select className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none font-mono">
                    <option>Single Bioregional Catchment ($1M - $10M)</option>
                    <option>Multi-Catchment Territorial Network ($10M - $50M)</option>
                    <option>Continental Infrastructure Program ($50M+)</option>
                    <option>Academic or Grassroots Commons Contributor</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#F5F5F0]/60 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-sm cursor-pointer transition-colors shadow"
                  >
                    Submit Architecture Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
