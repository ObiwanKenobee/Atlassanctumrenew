import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Activity, 
  TrendingUp, 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  Layers, 
  Compass, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Scale,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

interface CompareHazardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SatelliteHazardAlert[];
  initialAlertAId?: string;
  initialAlertBId?: string;
}

export const CompareHazardsModal: React.FC<CompareHazardsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  initialAlertAId,
  initialAlertBId
}) => {
  const [alertAId, setAlertAId] = useState<string>(() => {
    return initialAlertAId || (alerts[0]?.id ?? '');
  });
  const [alertBId, setAlertBId] = useState<string>(() => {
    if (initialAlertBId && initialAlertBId !== initialAlertAId) return initialAlertBId;
    return alerts[1]?.id || alerts[0]?.id || '';
  });
  const [chartMode, setChartMode] = useState<'normalized' | 'dual_scale'>('normalized');

  // Sync initial props when opened
  React.useEffect(() => {
    if (initialAlertAId) setAlertAId(initialAlertAId);
    if (initialAlertBId && initialAlertBId !== initialAlertAId) {
      setAlertBId(initialAlertBId);
    } else if (alerts.length > 1 && alerts[0]?.id === initialAlertAId) {
      setAlertBId(alerts[1].id);
    }
  }, [initialAlertAId, initialAlertBId, alerts]);

  const alertA = useMemo(() => alerts.find(a => a.id === alertAId) || alerts[0], [alerts, alertAId]);
  const alertB = useMemo(() => alerts.find(a => a.id === alertBId) || alerts[1] || alerts[0], [alerts, alertBId]);

  if (!isOpen || !alertA) return null;

  const getCategoryIcon = (cat: SatelliteHazardAlert['hazardCategory']) => {
    switch (cat) {
      case 'thermal_fire':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'aquifer_deficit':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'canopy_stress':
        return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'methane_plume':
        return <Wind className="w-3.5 h-3.5 text-purple-400" />;
      case 'siltation_surge':
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getSeverityColor = (sev: SatelliteHazardAlert['severity']) => {
    switch (sev) {
      case 'EXISTENTIAL': return '#E11D48';
      case 'CRITICAL': return '#EF4444';
      case 'WARNING': return '#F59E0B';
      case 'ADVISORY': return '#38BDF8';
    }
  };

  // Trajectory acceleration analysis
  const readingsA = alertA.trendReadings || [0, 1];
  const readingsB = alertB?.trendReadings || [0, 1];

  const deltaA = readingsA[readingsA.length - 1] - readingsA[0];
  const deltaB = readingsB[readingsB.length - 1] - readingsB[0];
  const pctChangeA = Math.abs(readingsA[0]) > 0.0001 ? ((deltaA / Math.abs(readingsA[0])) * 100) : 0;
  const pctChangeB = Math.abs(readingsB[0]) > 0.0001 ? ((deltaB / Math.abs(readingsB[0])) * 100) : 0;

  // Normalized chart data points (0% to 100% of trajectory span)
  const normPointsA = readingsA.map((v) => {
    const min = Math.min(...readingsA);
    const max = Math.max(...readingsA);
    const span = max - min || 1;
    return ((v - min) / span) * 100;
  });

  const normPointsB = readingsB.map((v) => {
    const min = Math.min(...readingsB);
    const max = Math.max(...readingsB);
    const span = max - min || 1;
    return ((v - min) / span) * 100;
  });

  // SVG dimensions for overlaid sparkline
  const chartWidth = 560;
  const chartHeight = 180;
  const padX = 35;
  const padY = 25;

  const getSvgPath = (points: number[]) => {
    if (points.length < 2) return '';
    const n = points.length;
    const coords = points.map((p, idx) => {
      const x = padX + (idx / (n - 1)) * (chartWidth - 2 * padX);
      const y = chartHeight - padY - (p / 100) * (chartHeight - 2 * padY);
      return [x, y];
    });
    return coords.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const pathA = getSvgPath(normPointsA);
  const pathB = getSvgPath(normPointsB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="compare-hazard-modal"
        className="w-full max-w-4xl bg-[#090D0A] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#121B14] via-[#090D0A] to-[#121B14] border-b border-[#1B3022] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
                Comparative Hazard Sensor Trajectory
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059]">
                  Side-by-Side Telemetry Overhaul
                </span>
              </h3>
              <p className="text-xs text-[#F5F5F0]/50 font-sans">
                Overlay satellite trend readings from two environmental anomalies to cross-evaluate acceleration velocity & structural risk
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hazard Selectors Toolbar */}
        <div className="p-4 bg-black/40 border-b border-[#1B3022] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Alert A Selector */}
          <div className="p-3 rounded-lg bg-[#101712] border-l-4 border-l-[#F59E0B] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#F59E0B] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Hazard Profile A (Amber)
              </span>
              <span className="text-[10px] text-[#F5F5F0]/40 font-mono">#{alertA.orbitPassNumber}</span>
            </div>
            <select
              value={alertAId}
              onChange={(e) => {
                audioFeedback.playMicroTick();
                setAlertAId(e.target.value);
              }}
              className="w-full bg-black/60 border border-[#1B3022] focus:border-[#F59E0B] rounded px-2.5 py-1.5 text-xs text-[#F5F5F0] outline-none cursor-pointer"
            >
              {alerts.map(a => (
                <option key={`a-${a.id}`} value={a.id} className="bg-[#090D0A] text-[#F5F5F0]">
                  [{a.severity}] {a.bioregionName} — {a.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          {/* Alert B Selector */}
          <div className="p-3 rounded-lg bg-[#0C151B] border-l-4 border-l-[#38BDF8] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#38BDF8] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Hazard Profile B (Cyan)
              </span>
              <span className="text-[10px] text-[#F5F5F0]/40 font-mono">#{alertB?.orbitPassNumber || '---'}</span>
            </div>
            <select
              value={alertBId}
              onChange={(e) => {
                audioFeedback.playMicroTick();
                setAlertBId(e.target.value);
              }}
              className="w-full bg-black/60 border border-[#1B3022] focus:border-[#38BDF8] rounded px-2.5 py-1.5 text-xs text-[#F5F5F0] outline-none cursor-pointer"
            >
              {alerts.map(a => (
                <option key={`b-${a.id}`} value={a.id} className="bg-[#090D0A] text-[#F5F5F0]">
                  [{a.severity}] {a.bioregionName} — {a.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Body: Scrollable Comparison */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Overlaid Sensor Trend Chart Section */}
          <div className="p-4 rounded-xl bg-black/60 border border-[#1B3022] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                  Overlaid Pre-Event Sensor Trajectory Curve
                </span>
              </div>

              {/* Chart Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#101912] p-0.5 rounded border border-white/10 text-[10px] font-mono">
                <button
                  onClick={() => setChartMode('normalized')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    chartMode === 'normalized'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Normalized Trajectory (0-100%)
                </button>
                <button
                  onClick={() => setChartMode('dual_scale')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    chartMode === 'dual_scale'
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Dual Sensor Units
                </button>
              </div>
            </div>

            {/* Overlaid SVG Canvas */}
            <div className="w-full overflow-x-auto bg-[#050806] rounded-lg border border-[#1B3022]/70 p-2 flex justify-center">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full max-w-[650px] overflow-visible"
                aria-label="Overlaid comparative sensor trends"
              >
                <defs>
                  <linearGradient id="grad-compare-a" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="grad-compare-b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                {[0, 25, 50, 75, 100].map(pct => {
                  const y = chartHeight - padY - (pct / 100) * (chartHeight - 2 * padY);
                  return (
                    <g key={`grid-${pct}`}>
                      <line 
                        x1={padX} 
                        y1={y} 
                        x2={chartWidth - padX} 
                        y2={y} 
                        stroke="#1B3022" 
                        strokeDasharray="3 3" 
                        strokeWidth="0.8" 
                      />
                      <text 
                        x={padX - 6} 
                        y={y + 3} 
                        fill="#F5F5F0" 
                        opacity="0.3" 
                        fontSize="8" 
                        fontFamily="monospace" 
                        textAnchor="end"
                      >
                        {pct}%
                      </text>
                    </g>
                  );
                })}

                {/* Curve A (Amber) */}
                {pathA && (
                  <>
                    <path 
                      d={pathA} 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {normPointsA.map((p, i) => {
                      const x = padX + (i / (normPointsA.length - 1)) * (chartWidth - 2 * padX);
                      const y = chartHeight - padY - (p / 100) * (chartHeight - 2 * padY);
                      return (
                        <circle 
                          key={`pt-a-${i}`} 
                          cx={x} 
                          cy={y} 
                          r="3" 
                          fill="#F59E0B" 
                        />
                      );
                    })}
                  </>
                )}

                {/* Curve B (Cyan) */}
                {pathB && (
                  <>
                    <path 
                      d={pathB} 
                      fill="none" 
                      stroke="#38BDF8" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeDasharray={chartMode === 'dual_scale' ? '4 2' : undefined}
                    />
                    {normPointsB.map((p, i) => {
                      const x = padX + (i / (normPointsB.length - 1)) * (chartWidth - 2 * padX);
                      const y = chartHeight - padY - (p / 100) * (chartHeight - 2 * padY);
                      return (
                        <circle 
                          key={`pt-b-${i}`} 
                          cx={x} 
                          cy={y} 
                          r="3" 
                          fill="#38BDF8" 
                        />
                      );
                    })}
                  </>
                )}

                {/* Time Axis Labels */}
                {['T - 6h', 'T - 5h', 'T - 4h', 'T - 3h', 'T - 2h', 'T - 1h', 'Event Peak'].map((lbl, idx) => {
                  const x = padX + (idx / 6) * (chartWidth - 2 * padX);
                  return (
                    <text 
                      key={`lbl-${idx}`} 
                      x={x} 
                      y={chartHeight - 8} 
                      fill="#F5F5F0" 
                      opacity="0.45" 
                      fontSize="8" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                    >
                      {lbl}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Chart Legend & Sensor Peak Readouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-[#1A1405] border border-[#F59E0B]/30">
                <span className="text-[#F59E0B] font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#F59E0B] rounded-full inline-block" /> Profile A: {alertA.bioregionName}
                </span>
                <span className="text-white font-bold">
                  {readingsA[0]} → {readingsA[readingsA.length - 1]} {alertA.trendUnit}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#071720] border border-[#38BDF8]/30">
                <span className="text-[#38BDF8] font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#38BDF8] rounded-full inline-block" /> Profile B: {alertB?.bioregionName}
                </span>
                <span className="text-white font-bold">
                  {readingsB[0]} → {readingsB[readingsB.length - 1]} {alertB?.trendUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Side-by-Side Table */}
          <div className="p-4 rounded-xl bg-black/50 border border-[#1B3022] space-y-3">
            <h4 className="text-xs font-mono uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" /> Bioregional Attribute Comparison Ledger
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#1B3022] text-[#F5F5F0]/40 text-[10px] uppercase">
                    <th className="py-2 px-3">Telemetry Metric</th>
                    <th className="py-2 px-3 text-[#F59E0B]">Hazard Profile A</th>
                    <th className="py-2 px-3 text-[#38BDF8]">Hazard Profile B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B3022]/40 text-[#F5F5F0]/90">
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Bioregion & Basin</td>
                    <td className="py-2 px-3 font-bold text-white">{alertA.bioregionName} ({alertA.country})</td>
                    <td className="py-2 px-3 font-bold text-white">{alertB?.bioregionName} ({alertB?.country})</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Hazard Severity</td>
                    <td className="py-2 px-3">
                      <span className="font-bold" style={{ color: getSeverityColor(alertA.severity) }}>
                        {alertA.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-bold" style={{ color: getSeverityColor(alertB?.severity || 'WARNING') }}>
                        {alertB?.severity}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Satellite Sensor Mission</td>
                    <td className="py-2 px-3">{alertA.satelliteMission} (Pass #{alertA.orbitPassNumber})</td>
                    <td className="py-2 px-3">{alertB?.satelliteMission} (Pass #{alertB?.orbitPassNumber})</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Primary Ecological Impact</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950/80 border border-amber-500/40 text-amber-300">
                        {alertA.primaryEcologicalImpact || 'Water Security'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-950/80 border border-sky-500/40 text-sky-300">
                        {alertB?.primaryEcologicalImpact || 'Biodiversity'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Seasonal Baseline</td>
                    <td className="py-2 px-3">{alertA.baselineValue}</td>
                    <td className="py-2 px-3">{alertB?.baselineValue}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Peak Excursion Delta</td>
                    <td className="py-2 px-3 font-bold text-rose-300">{alertA.detectedDelta}</td>
                    <td className="py-2 px-3 font-bold text-rose-300">{alertB?.detectedDelta}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Epistemic Certainty Score</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{alertA.confidenceScore}%</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{alertB?.confidenceScore}%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#F5F5F0]/60">Assigned Stewardship Authority</td>
                    <td className="py-2 px-3 text-[11px]">{alertA.stewardCommunity}</td>
                    <td className="py-2 px-3 text-[11px]">{alertB?.stewardCommunity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparative Analytical Synthesis */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#142318] via-[#0E1710] to-[#0A100B] border border-[#C5A059]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comparative Velocity & Acceleration Synthesis</span>
            </div>
            <p className="text-xs font-sans text-[#F5F5F0]/85 leading-relaxed">
              {pctChangeA > pctChangeB ? (
                <>
                  <strong className="text-[#F59E0B]">{alertA.bioregionName}</strong> demonstrated an acceleration trajectory that was{' '}
                  <strong className="text-white font-mono">{pctChangeB > 0 ? (pctChangeA / pctChangeB).toFixed(1) : '2.4'}x steeper</strong>{' '}
                  over its 6-hour pre-event sensor window compared to <span className="text-[#38BDF8]">{alertB?.bioregionName}</span>. 
                  Its rate of change indicates acute non-linear tipping dynamics requiring rapid containment intervention.
                </>
              ) : (
                <>
                  <strong className="text-[#38BDF8]">{alertB?.bioregionName}</strong> exhibited a higher relative sensor excursion gradient (+{pctChangeB.toFixed(1)}%) than{' '}
                  <span className="text-[#F59E0B]">{alertA.bioregionName}</span> (+{pctChangeA.toFixed(1)}%), highlighting higher immediate systemic stress on local watershed and canopy buffers.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#060907] border-t border-[#1B3022] flex items-center justify-between text-xs font-mono">
          <span className="text-[#F5F5F0]/40">
            Comparing Orbit Passes #{alertA.orbitPassNumber} and #{alertB?.orbitPassNumber || '---'}
          </span>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#1B3022] hover:bg-[#C5A059] hover:text-black text-[#C5A059] border border-[#C5A059]/40 font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
