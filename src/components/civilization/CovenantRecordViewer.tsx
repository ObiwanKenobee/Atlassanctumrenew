import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Heart, 
  TreeDeciduous, 
  Scale, 
  BookOpen, 
  Coins, 
  Activity, 
  RotateCcw, 
  Sparkles, 
  Lock, 
  Download,
  Copy,
  Check,
  ChevronRight,
  Printer
} from 'lucide-react';
import { CovenantRecord, PageView } from '../../types';

interface CovenantRecordViewerProps {
  onSelectTab?: (tab: PageView) => void;
  onOpenMoralSimulator?: () => void;
}

export const CovenantRecordViewer: React.FC<CovenantRecordViewerProps> = ({
  onSelectTab,
  onOpenMoralSimulator
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>('cov-nairobi-01');
  const [copiedHash, setCopiedHash] = useState(false);

  const COVENANT_RECORDS: CovenantRecord[] = [
    {
      id: 'cov-nairobi-01',
      projectId: 'proj-mth-drainage-2026',
      projectName: 'Mathare River Basin Regenerative Drainage & Pyrolysis Hub',
      location: 'Nairobi County, Kenya (1.2612° S, 36.8584° E)',
      covenantDate: '2026-04-12',
      status: 'AUDITED',
      purpose: {
        goodPursued: 'Eliminate chronic monsoon inundation, restore riparian riverbed ecology, and convert 420t/week of solid plastic waste into community clean energy.',
        northStarAlignment: 'Preserves human dignity by stopping sewage backflow into homes and creates youth-managed circular economic assets.'
      },
      people: {
        affectedPopulations: ['Mathare 4B Residents (14,200)', 'Mlango Kubwa Micro-traders (3,800)', 'Downstream Ruaraka Fisherfolk'],
        dignitySafeguards: 'Zero involuntary relocation. All riparian swale construction conducted by local Youth Guilds at 140% living wage.',
        agencyGained: 'Community retains 60% equity in pyrolysis electricity revenues and 100% ownership of clean water kiosks.'
      },
      creation: {
        ecosystemsAffected: ['Mathare River Alluvial Basin', 'Nairobi River Confluence Wetland', 'Shallow Aquifer Recharge Zone'],
        ecologicalInterventions: '4.2km bio-composite vegetated swales with vetiver grass root reinforcement and 12 sediment settling ponds.',
        bioregionalCommitment: 'Restores biological oxygen demand (BOD) from 180 mg/L to <15 mg/L across 36-month horizon.'
      },
      justice: {
        primaryBeneficiaries: ['Informal settlement households', 'Primary school students', 'Local vegetable market vendors'],
        riskBearers: ['Atlas Capital Syndicate (first-loss tranche)', 'Municipal Drainage Authority'],
        burdenDistributionCheck: 'Verified: Zero financial debt burden or land liens imposed on residents.'
      },
      wisdom: {
        supportingEvidence: [
          'Sentinel-2 hydrological flow analysis (2020-2025)',
          'In-situ IoT turbidity and flow meters (MTH-01 to MTH-14)',
          'Peer-reviewed riparian phyto-remediation model (UoN Eco-Engineering Dept)'
        ],
        epistemicConfidenceScore: 94.8,
        unresolvedAssumptions: [
          'Precipitation intensity remains within 100-year return curve envelope.',
          'Upstream Kiambu agricultural runoff maintains current pesticide limits.'
        ]
      },
      governance: {
        accountableParties: [
          'Mathare Community Assembly Council',
          'Nairobi County Environment Directorate',
          'Atlas Constitutional Steward Agent'
        ],
        reviewCadence: 'Monthly open community assembly + continuous IoT sensor audit',
        communityVetoMechanism: true
      },
      capital: {
        fundingSources: ['Atlas Regenerative Value Exchange (RVE)', 'East Africa Green Infrastructure Bond'],
        capitalDestination: ['Local Guild Wages (44%)', 'Bio-Composite Materials (32%)', 'IoT Telemetry Mesh (12%)', 'Community Reserve (12%)'],
        nonExtractiveTerms: 'Patient capital return capped at 4.2% real yield derived solely from surplus pyrolysis electricity sales.',
        totalCommittedUsd: 1450000
      },
      impact: {
        verifiedChanges: [
          'Zero dwelling flood entries during 2026 Q2 long rains',
          '82% reduction in childhood waterborne bacterial infections',
          '340 kW continuous clean electricity delivered to informal micro-enterprises'
        ],
        milestoneProofs: [
          'Audit-Hash: 0x9f83a02b1c48e77a... (Independent scientific verification)',
          'Nairobi Health Department morbidity audit signed 2026-06-15'
        ]
      },
      memory: {
        keyLessonsLearned: [
          'Standard concrete channels accelerate flood velocity downstream; bio-swales absorb surge energy by 64%.',
          'Youth Guild ownership eliminated vandalism rates from 38% (historic city projects) to 0%.'
        ],
        failureMitigations: [
          'Initial pyrolysis reactor nozzle clogged on high-density polyethylene; redesigned with self-clearing thermal auger.'
        ]
      },
      regeneration: {
        futureCapacityToFlourish: 'Creates an enduring self-financing community utility capable of maintaining infrastructure for 30+ years without external aid.',
        intergenerationalHorizonYears: 30
      },
      cryptographicSignature: '0x3847a91b2c4019e8371904a8b72635489102cba394f0e21a8c7b6d5e4f3a2b1c'
    },
    {
      id: 'cov-turkana-02',
      projectId: 'proj-tk-solar-desal-2026',
      projectName: 'Turkana Deep Solar-Desalination & Agro-Corridor',
      location: 'Lotikipi Aquifer, Turkana County, Kenya (3.5412° N, 35.1294° E)',
      covenantDate: '2026-02-18',
      status: 'ACTIVE',
      purpose: {
        goodPursued: 'Power deep saline aquifer extraction with 3.4MW solar microgrid and provide 800,000L/day of pure water for agroforestry and pastoralist resilience.',
        northStarAlignment: 'Eliminates recurring famine and water conflict through non-extractive solar infrastructure.'
      },
      people: {
        affectedPopulations: ['Turkana Pastoralist Unions (48,000)', 'Kakuma Agri-Enterprise Hubs (18,000)'],
        dignitySafeguards: 'Traditional pastoral grazing rights protected. Free water allocations guaranteed for domestic and livestock use.',
        agencyGained: '100% community-managed water tariffs generating sovereign local maintenance fund.'
      },
      creation: {
        ecosystemsAffected: ['Lotikipi Deep Saline Aquifer (depth: 280m)', 'Acacia Semi-Arid Savanna'],
        ecologicalInterventions: 'Zero-brine discharge with mineral salt crystallization for commercial bio-fertilizers.',
        bioregionalCommitment: 'Recharges 80 hectares of native drought-resistant acacia and moringa belts.'
      },
      justice: {
        primaryBeneficiaries: ['Pastoralist clans', 'Women water carriers', 'Youth hydroponic farmers'],
        riskBearers: ['Blended Impact Consortium (first loss)'],
        burdenDistributionCheck: 'Verified: Zero predatory debt or water privatization concessions.'
      },
      wisdom: {
        supportingEvidence: [
          'UNESCO-RTI Groundwater Mapping Study',
          '3-Year Solar Radiance telemetry from Lodwar Weather Station',
          'Hydroponic salinity tolerance benchmarks'
        ],
        epistemicConfidenceScore: 96.2,
        unresolvedAssumptions: [
          'Aquifer recharge rate sustains 1.2M m3/year extraction without brackish up-welling.'
        ]
      },
      governance: {
        accountableParties: [
          'Council of Turkana Elders',
          'Turkana County Water Department',
          'Atlas Sovereign Keypair Custodian'
        ],
        reviewCadence: 'Quarterly elder assembly with biometric multisig validation',
        communityVetoMechanism: true
      },
      capital: {
        fundingSources: ['RVE Ecological Bond', 'African Development Bank Co-Financing'],
        capitalDestination: ['Photovoltaic Array (40%)', 'Reverse Osmosis & Mineral Recovery (35%)', 'Hydroponic Pods (15%)', 'Training (10%)'],
        nonExtractiveTerms: 'Surplus revenue reinvested into 12 additional satellite solar boreholes.',
        totalCommittedUsd: 3200000
      },
      impact: {
        verifiedChanges: [
          '800,000L/day drinking water produced at <$0.12/m3 (vs $2.80 historic diesel trucking)',
          '420 hectares of continuous green fodder under active cultivation'
        ],
        milestoneProofs: [
          'IoT Sensor stream TK-SOLAR-09 live verification on RVE ledger'
        ]
      },
      memory: {
        keyLessonsLearned: [
          'Solar-direct pumping without expensive batteries lowers lifetime maintenance cost by 72%.'
        ],
        failureMitigations: [
          'Desert sand abrasion on PV panels mitigated with automated electrostatic dust sweeps.'
        ]
      },
      regeneration: {
        futureCapacityToFlourish: 'Transforms arid hardship corridor into an intergenerational oasis economy with food self-sufficiency.',
        intergenerationalHorizonYears: 50
      },
      cryptographicSignature: '0x8f72b10a9c83e721a049b8273645192837465abc129384756abcdef01234567'
    }
  ];

  const activeRecord = COVENANT_RECORDS.find((r) => r.id === selectedRecordId) || COVENANT_RECORDS[0];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activeRecord.cryptographicSignature);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-bold">
              Atlas Constitutional Registry
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            THE COVENANT RECORD
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            "Every consequential project in Atlas Sanctum is governed by a transparent, immutable Covenant Record containing the 10 foundational civilizational commitments."
          </p>
        </div>

        {/* Record Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Select Covenant:</span>
          {COVENANT_RECORDS.map((rec) => (
            <button
              key={rec.id}
              onClick={() => setSelectedRecordId(rec.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                selectedRecordId === rec.id
                  ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059] font-bold shadow-sm'
                  : 'bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {rec.id === 'cov-nairobi-01' ? 'Mathare Drainage' : 'Turkana Solar Desal'}
            </button>
          ))}
        </div>
      </div>

      {/* Covenant Overview Header */}
      <div className="p-5 bg-[#121212] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono uppercase font-bold rounded-xs">
                STATUS: {activeRecord.status}
              </span>
              <span className="text-xs font-mono text-[#C5A059]">{activeRecord.location}</span>
              <span className="text-xs font-mono text-[#F5F5F0]/40">• Ratified {activeRecord.covenantDate}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#F5F5F0]">
              {activeRecord.projectName}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyHash}
              className="px-3 py-1.5 bg-[#080808] hover:bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs text-[11px] font-mono text-[#F5F5F0] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{copiedHash ? 'Hash Copied' : 'Copy Proof Hash'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-[11px] font-mono font-bold rounded-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Covenant</span>
            </button>
          </div>
        </div>

        {/* 10 Canonical Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 1. PURPOSE */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <Sparkles className="w-3.5 h-3.5" />
              01. PURPOSE (The Good Pursued)
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.purpose.goodPursued}</p>
            <div className="text-[11px] text-[#F5F5F0]/60 font-serif italic pt-1 border-t border-[#F5F5F0]/5">
              North Star: "{activeRecord.purpose.northStarAlignment}"
            </div>
          </div>

          {/* 2. PEOPLE */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400 font-mono font-bold uppercase text-[10px]">
              <Heart className="w-3.5 h-3.5" />
              02. PEOPLE (Dignity & Agency Affected)
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.people.dignitySafeguards}</p>
            <div className="text-[11px] text-blue-300 font-mono pt-1 border-t border-[#F5F5F0]/5">
              Agency Gained: {activeRecord.people.agencyGained}
            </div>
          </div>

          {/* 3. CREATION */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold uppercase text-[10px]">
              <TreeDeciduous className="w-3.5 h-3.5" />
              03. CREATION (Ecosystems Stewarded)
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.creation.ecologicalInterventions}</p>
            <div className="text-[11px] text-emerald-300 font-mono pt-1 border-t border-[#F5F5F0]/5">
              Bioregional Goal: {activeRecord.creation.bioregionalCommitment}
            </div>
          </div>

          {/* 4. JUSTICE */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-mono font-bold uppercase text-[10px]">
              <Scale className="w-3.5 h-3.5" />
              04. JUSTICE (Who Benefits & Who Bears Risk)
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.justice.burdenDistributionCheck}</p>
            <div className="text-[11px] text-rose-300 font-mono pt-1 border-t border-[#F5F5F0]/5">
              Risk Bearers: {activeRecord.justice.riskBearers.join(', ')}
            </div>
          </div>

          {/* 5. WISDOM */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between text-purple-400 font-mono font-bold uppercase text-[10px]">
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                05. WISDOM (Supporting Evidence & Confidence)
              </span>
              <span className="text-emerald-400">{activeRecord.wisdom.epistemicConfidenceScore}% Epistemic Confidence</span>
            </div>
            <ul className="text-[#F5F5F0]/80 space-y-0.5 list-disc list-inside text-[11px]">
              {activeRecord.wisdom.supportingEvidence.map((ev, i) => (
                <li key={i} className="line-clamp-1">{ev}</li>
              ))}
            </ul>
          </div>

          {/* 6. GOVERNANCE */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between text-amber-400 font-mono font-bold uppercase text-[10px]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                06. GOVERNANCE (Accountability & Veto)
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 text-[9px] rounded">
                Community Veto Active
              </span>
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">
              Accountable: {activeRecord.governance.accountableParties.join(', ')}
            </p>
            <div className="text-[11px] text-amber-300/80 font-mono pt-1 border-t border-[#F5F5F0]/5">
              Cadence: {activeRecord.governance.reviewCadence}
            </div>
          </div>

          {/* 7. CAPITAL */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between text-[#C5A059] font-mono font-bold uppercase text-[10px]">
              <span className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5" />
                07. CAPITAL (Origins, Flow & Non-Extractive Terms)
              </span>
              <span className="text-[#F5F5F0] font-mono">${(activeRecord.capital.totalCommittedUsd / 1000000).toFixed(2)}M Committed</span>
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.capital.nonExtractiveTerms}</p>
            <div className="text-[11px] text-[#C5A059] font-mono pt-1 border-t border-[#F5F5F0]/5">
              Flow: {activeRecord.capital.capitalDestination.join(' • ')}
            </div>
          </div>

          {/* 8. IMPACT */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase text-[10px]">
              <Activity className="w-3.5 h-3.5" />
              08. IMPACT (Verified Physical & Human Change)
            </div>
            <ul className="text-[#F5F5F0]/80 space-y-0.5 list-disc list-inside text-[11px]">
              {activeRecord.impact.verifiedChanges.map((ch, i) => (
                <li key={i} className="line-clamp-1">{ch}</li>
              ))}
            </ul>
          </div>

          {/* 9. MEMORY */}
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <div className="flex items-center gap-2 text-orange-400 font-mono font-bold uppercase text-[10px]">
              <RotateCcw className="w-3.5 h-3.5" />
              09. MEMORY (Key Lessons & Failure Post-Mortems)
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.memory.keyLessonsLearned[0]}</p>
            <div className="text-[11px] text-orange-300 font-mono pt-1 border-t border-[#F5F5F0]/5">
              Failure Mitigated: {activeRecord.memory.failureMitigations[0]}
            </div>
          </div>

          {/* 10. REGENERATION */}
          <div className="p-4 bg-[#0A0A0A] border border-emerald-500/30 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between text-emerald-400 font-mono font-bold uppercase text-[10px]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                10. REGENERATION (Future Capacity to Flourish)
              </span>
              <span className="text-emerald-300 font-mono">{activeRecord.regeneration.intergenerationalHorizonYears}-Yr Horizon</span>
            </div>
            <p className="text-[#F5F5F0]/90 leading-relaxed">{activeRecord.regeneration.futureCapacityToFlourish}</p>
          </div>
        </div>

        {/* Cryptographic Signature & Audit Proof */}
        <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[10px] text-[#F5F5F0]/60">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3 h-3 text-[#C5A059] shrink-0" />
            <span className="truncate">Cryptographic Proof: <strong className="text-[#C5A059]">{activeRecord.cryptographicSignature}</strong></span>
          </div>
          <span className="text-emerald-400 shrink-0">● Verified on Atlas Immutable Ledger</span>
        </div>
      </div>
    </div>
  );
};
