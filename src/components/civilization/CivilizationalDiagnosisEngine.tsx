import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  Compass, 
  Cpu, 
  GitFork, 
  Globe2, 
  Layers, 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Zap,
  HelpCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { PageView, CivilizationalDiagnosisChain } from '../../types';
import { useActiveMission } from '../../context/ActiveMissionContext';

interface CivilizationalDiagnosisEngineProps {
  onSelectTab: (tab: PageView) => void;
  onOpenMoralSimulator?: () => void;
}

export const CivilizationalDiagnosisEngine: React.FC<CivilizationalDiagnosisEngineProps> = ({
  onSelectTab,
  onOpenMoralSimulator
}) => {
  const { activeMission, loadDiagnosisIntoPipeline } = useActiveMission();
  const [selectedChainId, setSelectedChainId] = useState<string>('nairobi-mathare');
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1); // default on DIAGNOSE
  const [simulatedInterventionLeverage, setSimulatedInterventionLeverage] = useState<number>(1.0);

  const DIAGNOSIS_CHAINS: CivilizationalDiagnosisChain[] = [
    {
      id: 'nairobi-mathare',
      primaryProblem: 'Mathare River Basin Inundation & Waste Trap',
      severity: 'CRITICAL',
      bioregion: 'Nairobi River Drainage Basin, Kenya',
      causalChain: [
        {
          step: 1,
          node: 'Upstream Soil Erosion & Unmanaged Solid Waste',
          systemicDomain: 'ECOLOGICAL',
          impactDescription: 'Deforested riparian slopes shed 420 tons/week of silt and plastic into the primary river channel.',
          evidenceProof: 'Sentinel-2 multispectral turbidity: 840 NTU (Critical)'
        },
        {
          step: 2,
          node: 'Drainage Channel Siltation & Flash Inundation',
          systemicDomain: 'INFRASTRUCTURE',
          impactDescription: 'Culverts at Juja Road bridge lose 70% throughput capacity during tropical convective precipitation.',
          evidenceProof: 'Hydrological sensor node MTH-04 telemetry'
        },
        {
          step: 3,
          node: 'Day-Labor Transport Interruption & Wage Stoppage',
          systemicDomain: 'ECONOMIC',
          impactDescription: 'Informal enterprise access road impassable for 14-22 days/year, halting $1.8M in neighborhood micro-commerce.',
          evidenceProof: 'Kilimani-Mathare informal transit log data'
        },
        {
          step: 4,
          node: 'Waterborne Bacterial Pathogen Outbreak & Healthcare Costs',
          systemicDomain: 'HEALTH',
          impactDescription: 'E. coli contamination in shallow wells causes acute child morbidity spikes, consuming 34% of monthly household surplus.',
          evidenceProof: 'Nairobi County Health Directorate monthly incidence reports'
        },
        {
          step: 5,
          node: 'School Truancy & Intergenerational Opportunity Loss',
          systemicDomain: 'SOCIAL',
          impactDescription: 'Youth miss average of 18 days/term due to illness and household water boiling burdens.',
          evidenceProof: 'Ministry of Education attendance registers'
        }
      ],
      reinforcingLoops: [
        'R1: Flash Flood → Road Damage → Lower Tax Base → Delayed Drainage Maintenance → Worse Floods',
        'R2: Illness Shock → Emergency Out-of-Pocket Expense → Debt Trap → Food Cutback → Higher Sickness'
      ],
      highestLeverageIntervention: 'Bio-Composite Swales + Decentralized Plastic Pyrolysis Microgrids',
      expectedRegenerativeCascade: 'Unblocks transport (+18% daily wage), stops sewage well infiltration (-78% child diarrhea), generates clean local electricity.'
    },
    {
      id: 'turkana-energy-water',
      primaryProblem: 'Deep Aquifer Energy Poverty & Crop Failure',
      severity: 'HIGH',
      bioregion: 'Lotikipi Basin, Turkana County, Kenya',
      causalChain: [
        {
          step: 1,
          node: 'High Diesel Generator Pumping Fuel Costs ($2.40/L)',
          systemicDomain: 'ECONOMIC',
          impactDescription: 'Community co-ops spend 62% of operational budgets solely on diesel logistics over unpaved desert corridors.',
          evidenceProof: 'Turkana Pastoralist Union fuel logbooks'
        },
        {
          step: 2,
          node: 'Intermittent Well Operation & Irrigation Halts',
          systemicDomain: 'INFRASTRUCTURE',
          impactDescription: 'Boreholes run only 3.5 hrs/day instead of required 10 hrs during dry spells.',
          evidenceProof: 'Lotikipi sensor node TK-09 telemetry'
        },
        {
          step: 3,
          node: 'Drought Crop Loss & Pastoralist Herd Mortality',
          systemicDomain: 'ECOLOGICAL',
          impactDescription: 'Pasture forage collapses by 65%, forcing distress livestock selling at 70% below market value.',
          evidenceProof: 'NDMA Drought Early Warning Bulletin'
        },
        {
          step: 4,
          node: 'Acute Malnutrition & Humanitarian Aid Dependency',
          systemicDomain: 'HEALTH',
          impactDescription: 'Global Acute Malnutrition (GAM) rates exceed WHO emergency threshold (19.4%).',
          evidenceProof: 'UNICEF / County Health Nutrition Survey'
        }
      ],
      reinforcingLoops: [
        'R1: High Fuel Cost → Less Irrigation → Smaller Harvest → Less Income to Buy Fuel → Complete Well Stoppage'
      ],
      highestLeverageIntervention: '3.4MW Solar Desalination + LifePod Hydroponic Micro-Farms',
      expectedRegenerativeCascade: 'Reduces water extraction cost to $0.08/m3, enables 365-day drip farming, creates $420k/yr local surplus.'
    },
    {
      id: 'kigali-housing-emissions',
      primaryProblem: 'Concrete Embodied Carbon & Rapid Urban Housing Deficit',
      severity: 'MODERATE',
      bioregion: 'Kigali Metropolitan Highlands, Rwanda',
      causalChain: [
        {
          step: 1,
          node: 'Expensive Imported Clinker Cement ($18/bag)',
          systemicDomain: 'ECONOMIC',
          impactDescription: 'Standard concrete construction costs $480/sqm, pricing 74% of urban families out of formal housing.',
          evidenceProof: 'Rwanda Housing Authority Market Review'
        },
        {
          step: 2,
          node: 'High Embodied Carbon Emissions & Heat Island Effect',
          systemicDomain: 'ECOLOGICAL',
          impactDescription: 'Cement brick dwellings contribute 4.2 tCO2e/unit and trap excessive heat in valley settlements.',
          evidenceProof: 'Kigali Urban Environmental Atlas'
        },
        {
          step: 3,
          node: 'Overcrowding in Unventilated Substandard Dwellings',
          systemicDomain: 'HEALTH',
          impactDescription: 'High indoor humidity and poor ventilation trigger chronic respiratory illnesses in children under 5.',
          evidenceProof: 'Kigali Health Center records'
        }
      ],
      reinforcingLoops: [
        'R1: High Cement Cost → Smaller Substandard Units → Poor Health → Lower Household Productivity → Inability to Upgrade'
      ],
      highestLeverageIntervention: 'LifeHouse Bio-Composite Compressed Earth & Bamboo Prefabrication Hub',
      expectedRegenerativeCascade: 'Cuts housing unit cost by 55%, locks 8.4 tCO2e/home in biomaterials, creates 450 local fabrication guild jobs.'
    }
  ];

  const activeChain = DIAGNOSIS_CHAINS.find((c) => c.id === selectedChainId) || DIAGNOSIS_CHAINS[0];

  const STAGES = [
    { name: '1. OBSERVE', label: 'Telemetry & In-Situ Signals' },
    { name: '2. DIAGNOSE', label: 'Causal Chain Mapping' },
    { name: '3. UNDERSTAND', label: 'Feedback Loop Analysis' },
    { name: '4. PRIORITIZE', label: 'Leverage Point Selection' },
    { name: '5. DESIGN', label: 'Intervention Blueprint' },
    { name: '6. MOBILIZE', label: 'Capital & Stakeholder Alignment' },
    { name: '7. INTERVENE', label: 'Physical Deployment' },
    { name: '8. MEASURE', label: 'Cryptographic Audit' },
    { name: '9. LEARN', label: 'Memory & Epistemic Feedback' },
    { name: '10. REGENERATE', label: 'Compounding Flourishing' }
  ];

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-bold">
              Civilizational Diagnosis Engine v4.0
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            SYSTEMIC CAUSAL DIAGNOSIS
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            "Problems are never isolated incidents; they are symptoms of interconnected systemic feedback loops. Atlas reveals the root causes and discovers high-leverage points of intervention."
          </p>
        </div>

        {/* Bioregion Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Select Bioregion:</span>
          {DIAGNOSIS_CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => setSelectedChainId(chain.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                selectedChainId === chain.id
                  ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {chain.id === 'nairobi-mathare' ? 'Nairobi Drainage' : chain.id === 'turkana-energy-water' ? 'Turkana Aquifer' : 'Kigali Housing'}
            </button>
          ))}
        </div>
      </div>

      {/* 10-Stage Pipeline Horizontal Scroller */}
      <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
          <span>THE 10-STAGE CIVILIZATIONAL INTERVENTION PIPELINE</span>
          <span className="text-[#C5A059]">Active Phase: Stage 0{activeStageIndex + 1}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {STAGES.map((stg, idx) => (
            <button
              key={stg.name}
              onClick={() => setActiveStageIndex(idx)}
              className={`px-2.5 py-1.5 text-[10px] font-mono rounded-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeStageIndex === idx
                  ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#121212] border border-[#F5F5F0]/5 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              <span>{stg.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Bioregion Problem Summary */}
      <div className="p-5 bg-[#121212] border border-[#C5A059]/40 rounded-sm space-y-3 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 text-[9px] font-mono uppercase font-bold rounded-xs">
                Severity: {activeChain.severity}
              </span>
              <span className="text-xs font-mono text-[#C5A059]">{activeChain.bioregion}</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#F5F5F0] mt-1">
              {activeChain.primaryProblem}
            </h3>
          </div>

          <div className="text-right font-mono text-[11px] text-[#F5F5F0]/60">
            <div>Causal Chain Length: <strong className="text-[#F5F5F0]">{activeChain.causalChain.length} steps</strong></div>
            <div>Reinforcing Loops: <strong className="text-amber-400">{activeChain.reinforcingLoops.length} detected</strong></div>
          </div>
        </div>

        {/* Step-by-Step Causal Chain Flow */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50">
            Systemic Causal Chain Transmission:
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {activeChain.causalChain.map((step, idx) => (
              <div 
                key={step.step}
                className="p-3.5 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#C5A059]/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] text-xs font-mono font-bold shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#F5F5F0]">{step.node}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase font-bold ${
                        step.systemicDomain === 'ECOLOGICAL' ? 'bg-emerald-950 text-emerald-300' :
                        step.systemicDomain === 'INFRASTRUCTURE' ? 'bg-blue-950 text-blue-300' :
                        step.systemicDomain === 'ECONOMIC' ? 'bg-amber-950 text-amber-300' :
                        step.systemicDomain === 'HEALTH' ? 'bg-rose-950 text-rose-300' :
                        'bg-purple-950 text-purple-300'
                      }`}>
                        {step.systemicDomain}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F5F0]/70 mt-1">{step.impactDescription}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#C5A059] bg-[#121212] p-2 rounded-xs border border-[#F5F5F0]/5 shrink-0 max-w-xs self-start md:self-auto">
                  <div className="text-[#F5F5F0]/40 uppercase text-[8px]">Verifiable Telemetry</div>
                  <div>{step.evidenceProof}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reinforcing Loops & Leverage Point Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#F5F5F0]/10">
          <div className="p-3.5 bg-[#080808] border border-amber-500/30 rounded-sm space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Detected Reinforcing Loops (Fragility Traps)
            </span>
            <div className="space-y-1 text-xs text-[#F5F5F0]/70 font-mono">
              {activeChain.reinforcingLoops.map((loop, idx) => (
                <div key={idx} className="p-1.5 bg-[#121212] rounded-xs">{loop}</div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-[#08120A] border border-emerald-500/40 rounded-sm space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Highest-Leverage Regenerative Intervention
            </span>
            <div className="text-xs font-bold text-[#F5F5F0]">
              {activeChain.highestLeverageIntervention}
            </div>
            <p className="text-[11px] text-emerald-300/80 font-sans">
              {activeChain.expectedRegenerativeCascade}
            </p>
          </div>
        </div>

        {/* Simulation Sandbox Slider */}
        <div className="p-4 bg-[#090909] border border-[#C5A059]/30 rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#C5A059] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Model Intervention Capital & Scale: {Math.round(simulatedInterventionLeverage * 100)}%
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Projected ROI: {((simulatedInterventionLeverage * 4.2)).toFixed(1)}x Civilizational Value
            </span>
          </div>

          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={simulatedInterventionLeverage}
            onChange={(e) => setSimulatedInterventionLeverage(parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] cursor-pointer"
          />

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 bg-[#121212] rounded-xs border border-[#F5F5F0]/5">
              <div className="text-[#F5F5F0]/40 text-[9px] uppercase">Soil / Bioremediation</div>
              <div className="text-emerald-400 font-bold">+{Math.round(simulatedInterventionLeverage * 42)}% Gain</div>
            </div>
            <div className="p-2 bg-[#121212] rounded-xs border border-[#F5F5F0]/5">
              <div className="text-[#F5F5F0]/40 text-[9px] uppercase">Local Household Income</div>
              <div className="text-[#C5A059] font-bold">+{Math.round(simulatedInterventionLeverage * 31)}% Growth</div>
            </div>
            <div className="p-2 bg-[#121212] rounded-xs border border-[#F5F5F0]/5">
              <div className="text-[#F5F5F0]/40 text-[9px] uppercase">Morbidity Reduction</div>
              <div className="text-blue-400 font-bold">-{Math.round(simulatedInterventionLeverage * 68)}% Incidence</div>
            </div>
          </div>
        </div>

        {/* Action Gate */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-[11px] font-mono text-[#F5F5F0]/50 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
            Requires verified multi-assembly community consent before contract deployment
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadDiagnosisIntoPipeline({
                  id: activeChain.id,
                  primaryProblem: activeChain.primaryProblem,
                  bioregion: activeChain.bioregion,
                  highestLeverageIntervention: activeChain.highestLeverageIntervention,
                  evidenceProof: activeChain.causalChain[0]?.evidenceProof,
                  systemicDomain: activeChain.causalChain[0]?.systemicDomain
                });
                onSelectTab('sentinel');
              }}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Cpu className="w-3.5 h-3.5 text-black" />
              <span>Deploy AI Agent Swarm</span>
            </button>
            <button
              onClick={() => {
                loadDiagnosisIntoPipeline({
                  id: activeChain.id,
                  primaryProblem: activeChain.primaryProblem,
                  bioregion: activeChain.bioregion,
                  highestLeverageIntervention: activeChain.highestLeverageIntervention,
                  evidenceProof: activeChain.causalChain[0]?.evidenceProof,
                  systemicDomain: activeChain.causalChain[0]?.systemicDomain
                });
                onSelectTab('capital-engine');
              }}
              className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Structure Capital Tranche</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
