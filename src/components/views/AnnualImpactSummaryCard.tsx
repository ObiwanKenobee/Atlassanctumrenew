import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TreePine, 
  Droplets, 
  ShieldCheck, 
  Award, 
  Download, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowUpRight,
  FileCheck2,
  Check
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface MonthlyDataPoint {
  month: string;
  hectares: number;
  hectaresCumulative: number;
  megaliters: number;
  megalitersCumulative: number;
  carbonTons: number;
  carbonTonsCumulative: number;
  auditsSigned: number;
}

const ANNUAL_DATA_2026: MonthlyDataPoint[] = [
  { month: 'Jan', hectares: 280, hectaresCumulative: 280, megaliters: 120, megalitersCumulative: 120, carbonTons: 850, carbonTonsCumulative: 850, auditsSigned: 2 },
  { month: 'Feb', hectares: 320, hectaresCumulative: 600, megaliters: 140, megalitersCumulative: 260, carbonTons: 920, carbonTonsCumulative: 1770, auditsSigned: 3 },
  { month: 'Mar', hectares: 450, hectaresCumulative: 1050, megaliters: 210, megalitersCumulative: 470, carbonTons: 1340, carbonTonsCumulative: 3110, auditsSigned: 4 },
  { month: 'Apr', hectares: 510, hectaresCumulative: 1560, megaliters: 260, megalitersCumulative: 730, carbonTons: 1510, carbonTonsCumulative: 4620, auditsSigned: 3 },
  { month: 'May', hectares: 490, hectaresCumulative: 2050, megaliters: 230, megalitersCumulative: 960, carbonTons: 1440, carbonTonsCumulative: 6060, auditsSigned: 4 },
  { month: 'Jun', hectares: 620, hectaresCumulative: 2670, megaliters: 290, megalitersCumulative: 1250, carbonTons: 1820, carbonTonsCumulative: 7880, auditsSigned: 5 },
  { month: 'Jul', hectares: 540, hectaresCumulative: 3210, megaliters: 240, megalitersCumulative: 1490, carbonTons: 1610, carbonTonsCumulative: 9490, auditsSigned: 4 },
  { month: 'Aug', hectares: 590, hectaresCumulative: 3800, megaliters: 210, megalitersCumulative: 1700, carbonTons: 1750, carbonTonsCumulative: 11240, auditsSigned: 5 },
  { month: 'Sep', hectares: 480, hectaresCumulative: 4280, megaliters: 140, megalitersCumulative: 1840, carbonTons: 1210, carbonTonsCumulative: 12450, auditsSigned: 4 },
  { month: 'Oct (Proj)', hectares: 420, hectaresCumulative: 4700, megaliters: 180, megalitersCumulative: 2020, carbonTons: 1300, carbonTonsCumulative: 13750, auditsSigned: 3 },
  { month: 'Nov (Proj)', hectares: 460, hectaresCumulative: 5160, megaliters: 220, megalitersCumulative: 2240, carbonTons: 1420, carbonTonsCumulative: 15170, auditsSigned: 4 },
  { month: 'Dec (Proj)', hectares: 520, hectaresCumulative: 5680, megaliters: 250, megalitersCumulative: 2490, carbonTons: 1580, carbonTonsCumulative: 16750, auditsSigned: 4 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Riparian Canopy & Forests', value: 38, color: '#10B981' },
  { name: 'Aquifer Infiltration Swales', value: 32, color: '#06B6D4' },
  { name: 'Congo Peatland Saturation', value: 18, color: '#F59E0B' },
  { name: 'Sovereign FPIC Covenants', value: 12, color: '#8B5CF6' }
];

export const AnnualImpactSummaryCard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [chartMode, setChartMode] = useState<'cumulative' | 'monthly' | 'distribution'>('cumulative');
  const [activeMetric, setActiveMetric] = useState<'hectares' | 'megaliters' | 'carbon'>('hectares');
  const [copiedCertificate, setCopiedCertificate] = useState(false);

  const handleCopyCertificate = () => {
    audioFeedback.playSubtleClick();
    const certText = `ATLAS SOVEREIGN CITIZEN IMPACT CERTIFICATE (2026)
Steward: Enoch Cheboi | DID: did:key:z6MkuV4b19...99a1
• Land Regenerated: 4,280 Hectares (100% Multispectral Verified)
• Aquifer Volume Recharge: 1.84 Billion Liters (Piezometer Corroborated)
• Carbon Sequestered: 12,450 Metric Tons CO2eq
• Epistemic Merkle Root: 0x8f192b0c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a
Status: Cryptographically Ratified on Atlas Sanctum Canon`;
    navigator.clipboard.writeText(certText);
    setCopiedCertificate(true);
    setTimeout(() => setCopiedCertificate(false), 2500);
  };

  return (
    <div 
      id="annual-impact-summary-card"
      className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0D1410] via-[#0B100E] to-[#080B09] border-2 border-[#C5A059]/40 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Subtle background ambient ring */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
              CITIZEN PROFILE • ANNUAL STEWARDSHIP SUMMARY
            </span>
            <span className="text-[10px] font-mono text-amber-300">
              Verified Epistemic Canon
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Annual Bioregional Impact Summary ({selectedYear})
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans max-w-2xl">
            Visualizing your verified cumulative contribution to planetary regeneration across canopy, aquifer, and community governance dimensions.
          </p>
        </div>

        {/* Year Selector & Certificate Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Year Buttons */}
          <div className="flex items-center bg-black/50 p-1 rounded-lg border border-white/10 text-xs font-mono">
            {(['2026', '2025', '2024'] as const).map(yr => (
              <button
                key={yr}
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setSelectedYear(yr);
                }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/60'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Certificate Download */}
          <button
            onClick={handleCopyCertificate}
            className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#24422E] text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Copy or Export Verifiable Sovereign Certificate"
          >
            {copiedCertificate ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Proof Copied!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Certificate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Tangible Annual KPI Highlights with YoY Gain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Hectares */}
        <div 
          onClick={() => {
            audioFeedback.playMicroTick();
            setActiveMetric('hectares');
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeMetric === 'hectares'
              ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-black/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-0.5 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              <TrendingUp className="w-3 h-3" /> +42.5% YoY
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-[10px] font-mono uppercase text-white/50">Cumulative Land Restored</div>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              4,280 <span className="text-xs font-normal text-white/50">ha</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Sentinel-2 MSI Corroborated</div>
          </div>
        </div>

        {/* Metric 2: Aquifer Liters */}
        <div 
          onClick={() => {
            audioFeedback.playMicroTick();
            setActiveMetric('megaliters');
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeMetric === 'megaliters'
              ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
              : 'bg-black/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-0.5 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              <TrendingUp className="w-3 h-3" /> +68.2% YoY
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-[10px] font-mono uppercase text-white/50">Groundwater Recharged</div>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              1.84 <span className="text-xs font-normal text-white/50">Billion L</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Piezometer Telemetry Verified</div>
          </div>
        </div>

        {/* Metric 3: Carbon */}
        <div 
          onClick={() => {
            audioFeedback.playMicroTick();
            setActiveMetric('carbon');
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeMetric === 'carbon'
              ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/30'
              : 'bg-black/40 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 flex items-center gap-0.5 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
              <TrendingUp className="w-3 h-3" /> +28.4% YoY
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-[10px] font-mono uppercase text-white/50">Carbon Sequestered</div>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              12,450 <span className="text-xs font-normal text-white/50">Tons CO2e</span>
            </div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5">Peat Dome & Canopy Locked</div>
          </div>
        </div>

        {/* Metric 4: Governance & Audits */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-purple-300 flex items-center gap-0.5 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
              99.8% Fidelity
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-[10px] font-mono uppercase text-white/50">FPIC Covenants & Audits</div>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              34 <span className="text-xs font-normal text-white/50">Signed</span>
            </div>
            <div className="text-[10px] text-purple-400 font-mono mt-0.5">Zero Audit Discrepancies</div>
          </div>
        </div>
      </div>

      {/* Chart View Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-white/40">Chart View:</span>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setChartMode('cumulative');
            }}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              chartMode === 'cumulative'
                ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                : 'bg-black/40 text-white/50 hover:text-white'
            }`}
          >
            Cumulative Curve (Area)
          </button>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setChartMode('monthly');
            }}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              chartMode === 'monthly'
                ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                : 'bg-black/40 text-white/50 hover:text-white'
            }`}
          >
            Monthly Influx (Bar)
          </button>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setChartMode('distribution');
            }}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              chartMode === 'distribution'
                ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                : 'bg-black/40 text-white/50 hover:text-white'
            }`}
          >
            Bioregional Split (Donut)
          </button>
        </div>

        <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Metric: <strong className="text-white capitalize">{activeMetric}</strong></span>
        </div>
      </div>

      {/* Dynamic Interactive Chart Area */}
      <div className="h-72 sm:h-80 w-full bg-[#080B09] rounded-xl p-3 sm:p-4 border border-white/5">
        {chartMode === 'cumulative' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANNUAL_DATA_2026} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHectares" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMegaliters" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D120F', 
                  borderColor: '#C5A059', 
                  borderRadius: '8px', 
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#F5F5F0'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
              {activeMetric === 'hectares' && (
                <Area 
                  type="monotone" 
                  dataKey="hectaresCumulative" 
                  name="Cumulative Hectares Restored (ha)" 
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorHectares)" 
                />
              )}
              {activeMetric === 'megaliters' && (
                <Area 
                  type="monotone" 
                  dataKey="megalitersCumulative" 
                  name="Cumulative Megaliters Recharged (ML)" 
                  stroke="#06B6D4" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorMegaliters)" 
                />
              )}
              {activeMetric === 'carbon' && (
                <Area 
                  type="monotone" 
                  dataKey="carbonTonsCumulative" 
                  name="Cumulative Tons CO2eq Sequestered" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorCarbon)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'monthly' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANNUAL_DATA_2026} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D120F', 
                  borderColor: '#C5A059', 
                  borderRadius: '8px', 
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#F5F5F0'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
              {activeMetric === 'hectares' && (
                <Bar dataKey="hectares" name="Monthly Restored (Hectares)" fill="#10B981" radius={[4, 4, 0, 0]} />
              )}
              {activeMetric === 'megaliters' && (
                <Bar dataKey="megaliters" name="Monthly Recharge (Megaliters)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              )}
              {activeMetric === 'carbon' && (
                <Bar dataKey="carbonTons" name="Monthly CO2eq Avoided (Tons)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'distribution' && (
          <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="w-56 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0D120F', 
                      borderColor: '#C5A059', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      fontFamily: 'monospace' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-white/80">{cat.name}:</span>
                  <span className="text-white font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Epistemic Provenance Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/50 border-t border-white/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Merkle Root: 0x8f192b0c3d4e5f6a...7f8a</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Ratified by 3 Sovereign Manyatta Councils</span>
          <span className="text-emerald-400 font-bold">100% Non-Repudiable</span>
        </div>
      </div>
    </div>
  );
};
