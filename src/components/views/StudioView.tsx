import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  BarChart2
} from 'lucide-react';
import { CAPITALS_DATA } from '../../data/mockCivilizationData';

interface StudioViewProps {
  onOpenMoralSimulator: () => void;
  onOpenCommandCenter: () => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [scenarioName, setScenarioName] = useState('East Africa Regenerative Corridor 2030');
  const [capitalInvestment, setCapitalInvestment] = useState(15); // $15M
  const [ecologicalFocus, setEcologicalFocus] = useState(80); // 80%
  const [communityCoOwnership, setCommunityCoOwnership] = useState(35); // 35%
  const [timeHorizonYears, setTimeHorizonYears] = useState(10); // 10 years

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/studio/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioName,
          parameters: {
            capitalInvestmentUSD: `${capitalInvestment}M`,
            ecologicalFocusPercent: ecologicalFocus,
            communityCoOwnershipPercent: communityCoOwnership,
            timeHorizonYears
          }
        })
      });
      const data = await res.json();
      if (data.data) {
        setSimulationResult(data.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              SYSTEMS SIMULATION & STRATEGY LABORATORY
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Studio</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Design multi-capital interventions, simulate second-order consequences, and discover high-leverage civilizational tipping points.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMoralSimulator}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Launch Moral Validator
          </button>
        </div>
      </div>

      {/* 7 Capitals Interactive Framework Bar */}
      <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">The 7 Forms of Capital</span>
            <h3 className="text-base font-serif text-[#F5F5F0]">Holistic Civilizational Balance Sheet</h3>
          </div>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">Development is not solely financial</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {CAPITALS_DATA.map((cap) => (
            <div
              key={cap.id}
              className="p-3 rounded-sm bg-[#080808] border border-[#F5F5F0]/10 space-y-1.5"
            >
              <div className="text-xs font-bold" style={{ color: cap.color }}>{cap.name}</div>
              <p className="text-[11px] text-[#F5F5F0]/60 line-clamp-2 font-sans">{cap.description}</p>
              <div className="text-[10px] font-mono text-emerald-400 pt-1">{cap.annualGrowth}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Studio Interactive Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls & Parameters Column (1 Col) */}
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
            <span className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Intervention Parameters
            </span>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40">Causal Dynamic Engine</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#F5F5F0] mb-1">Scenario Target Name</label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full px-3 py-2 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            {/* Slider 1: Capital Investment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/50">Patient Capital Input:</span>
                <span className="text-emerald-400 font-bold">${capitalInvestment} Million USD</span>
              </div>
              <input
                type="range"
                min={2}
                max={50}
                value={capitalInvestment}
                onChange={(e) => setCapitalInvestment(Number(e.target.value))}
                className="w-full accent-[#C5A059] bg-[#080808] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Ecological Weight */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/50">Ecological Restoration Priority:</span>
                <span className="text-[#8FB8DE] font-bold">{ecologicalFocus}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={ecologicalFocus}
                onChange={(e) => setEcologicalFocus(Number(e.target.value))}
                className="w-full accent-[#8FB8DE] bg-[#080808] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Community Co-Ownership */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/50">Local Community Equity Stake:</span>
                <span className="text-[#C5A059] font-bold">{communityCoOwnership}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={communityCoOwnership}
                onChange={(e) => setCommunityCoOwnership(Number(e.target.value))}
                className="w-full accent-[#C5A059] bg-[#080808] h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Time Horizon */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/50">Generational Horizon:</span>
                <span className="text-[#F5F5F0] font-bold">{timeHorizonYears} Years</span>
              </div>
              <input
                type="range"
                min={3}
                max={30}
                value={timeHorizonYears}
                onChange={(e) => setTimeHorizonYears(Number(e.target.value))}
                className="w-full accent-[#C5A059] bg-[#080808] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-3 bg-[#F5F5F0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Computing Systems Dynamics...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Simulate Scenario Trajectory
              </>
            )}
          </button>
        </div>

        {/* Simulation Output Dashboard (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F5F0]/10">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Simulation Projection</div>
              <h2 className="text-lg font-serif text-[#F5F5F0]">{scenarioName}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#C5A059] bg-[#1B3022] px-2.5 py-1 rounded-sm border border-[#C5A059]/40">
                Confidence Interval: +/- 3.8%
              </span>
            </div>
          </div>

          {/* Flourishing Yield Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Food Sovereignty Delta</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">+52% Increase</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">via LifePod nodes</div>
            </div>
            <div className="p-3.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Groundwater Access</div>
              <div className="text-xl font-bold font-mono text-[#8FB8DE] mt-0.5">24/7 Potable</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">from 6h/day baseline</div>
            </div>
            <div className="p-3.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Dignified Livelihoods</div>
              <div className="text-xl font-bold font-mono text-[#C5A059] mt-0.5">18,400 Jobs</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">Agro-tech & fabrication</div>
            </div>
            <div className="p-3.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Carbon Sequestration</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">520,000 tCO2e</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">10-year cumulative</div>
            </div>
            <div className="p-3.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Household Resilience</div>
              <div className="text-xl font-bold font-mono text-[#8FB8DE] mt-0.5">+74% Stability</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">Climate shock buffer</div>
            </div>
            <div className="p-3.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Composite Flourishing</div>
              <div className="text-xl font-bold font-mono text-[#C5A059] mt-0.5">89.2 / 100</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-mono">Flourishing OS score</div>
            </div>
          </div>

          {/* Critical Leverage Points & Risk Vectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#080808] rounded-sm border border-[#F5F5F0]/10 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Critical Leverage Points Identified
              </h4>
              <ul className="space-y-1.5 text-xs text-[#F5F5F0]/70 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Integrated solar-desalination and precision drip irrigation across 12,000 hectares.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Community-governed LifeShield rapid shelter manufacturing facilities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Open-source hardware standards for agricultural machinery repairability.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#080808] rounded-sm border border-[#F5F5F0]/10 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Mitigated Risk Vectors
              </h4>
              <ul className="space-y-1.5 text-xs text-[#F5F5F0]/70 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                  <span>Intermittent grid curtailment mitigated by microgrid storage and thermal cooling load matching.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                  <span>Agricultural pest migration mitigated through multi-strata polyculture and optical sensors.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
