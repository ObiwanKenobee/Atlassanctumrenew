import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Compass, 
  Plus, 
  Sliders, 
  Activity,
  Cpu
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

interface PredictiveHazardModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAlerts: SatelliteHazardAlert[];
  onInjectPreEventAlert: (newAlert: SatelliteHazardAlert) => void;
}

export const PredictiveHazardModelModal: React.FC<PredictiveHazardModelModalProps> = ({
  isOpen,
  onClose,
  currentAlerts,
  onInjectPreEventAlert
}) => {
  const [selectedBioregion, setSelectedBioregion] = useState<string>('all');
  const [forecastHorizon, setForecastHorizon] = useState<number>(48);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSynthesis, setAiSynthesis] = useState<string>('');
  const [preEventWarnings, setPreEventWarnings] = useState<SatelliteHazardAlert[]>([]);
  const [injectedIds, setInjectedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleRunPredictiveModel = async () => {
    setLoading(true);
    setError(null);
    audioFeedback.playTelemetryWarning();

    try {
      const response = await fetch('/api/gemini/hazard-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bioregionId: selectedBioregion,
          currentAlerts,
          predictiveHorizonHours: forecastHorizon
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate predictive pre-event alerts`);
      }

      const data = await response.json();
      setAiSynthesis(data.aiSynthesis || 'Multi-spectral sensor trends analyzed across target bioregions.');
      setPreEventWarnings(data.preEventWarnings || []);
      audioFeedback.playSuccessChime();
    } catch (err: any) {
      console.error('Predictive model error:', err);
      setError(err.message || 'Failed to run predictive early-warning model');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat: SatelliteHazardAlert['hazardCategory']) => {
    switch (cat) {
      case 'thermal_fire': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'aquifer_deficit': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'canopy_stress': return <TreePine className="w-4 h-4 text-emerald-400" />;
      case 'methane_plume': return <Wind className="w-4 h-4 text-purple-400" />;
      case 'siltation_surge': return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleInject = (warning: SatelliteHazardAlert) => {
    audioFeedback.playBell([523.25, 659.25, 783.99], 0.3);
    onInjectPreEventAlert(warning);
    setInjectedIds(prev => new Set(prev).add(warning.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="predictive-hazard-model-modal"
        className="w-full max-w-4xl bg-[#090D0A] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#142318] via-[#090D0A] to-[#142318] border-b border-[#1B3022] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1B3022] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shadow-sm">
              <TrendingUp className="w-4 h-4 text-[#C5A059] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  Gemini Predictive Environmental Trend Model
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/90 border border-rose-600/50 text-rose-300 font-bold">
                  PRE-EVENT EARLY WARNING
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/50 font-sans">
                Analyze environmental velocity & sensor excursion vectors to proactively generate warnings before physical threshold breach
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

        {/* Configuration Bar */}
        <div className="p-4 bg-black/50 border-b border-[#1B3022] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Target Bioregion */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#F5F5F0]/60 text-[11px]">Bioregion:</span>
              <select
                value={selectedBioregion}
                onChange={(e) => setSelectedBioregion(e.target.value)}
                className="bg-[#101912] border border-[#1B3022] focus:border-[#C5A059] rounded px-2.5 py-1 text-xs text-[#F5F5F0] outline-none cursor-pointer"
              >
                <option value="all">All Bioregions (Planetary)</option>
                <option value="congo-peatlands">Congo Peatlands (Cuvette Centrale)</option>
                <option value="mara-serengeti">Mara-Serengeti Transboundary</option>
                <option value="turkana-basin">Turkana Pastoralist Aquifer</option>
                <option value="aberdare-water-tower">Aberdare Cloud Forest Water Tower</option>
                <option value="rift-valley-lakes">Great Rift Valley Alkaline Lakes</option>
              </select>
            </div>

            {/* Forecast Horizon (Hours) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#F5F5F0]/60 text-[11px]">Horizon:</span>
              <div className="flex items-center gap-1 bg-[#101912] p-0.5 rounded border border-white/10">
                {[24, 48, 72].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setForecastHorizon(hours)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      forecastHorizon === hours
                        ? 'bg-[#C5A059] text-black font-bold'
                        : 'text-[#F5F5F0]/60 hover:text-white'
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleRunPredictiveModel}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-[#1B3022] hover:bg-[#2A4C32] text-[#C5A059] border border-[#C5A059]/50 hover:border-[#C5A059] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Simulating Trend Dynamics...' : 'Run Predictive Trend Analysis'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-sm font-serif font-bold text-[#F5F5F0]">
                Gemini Multi-Spectral Trend Projection in Progress...
              </div>
              <p className="text-xs font-mono text-[#F5F5F0]/50 text-center max-w-md">
                Projecting pyrogenic auto-ignition envelopes, piezometric depression cones, and canopy transpiration deficits across multi-day orbits.
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-600/50 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
              <div className="text-sm font-bold text-rose-200">Analysis Error</div>
              <p className="text-xs text-rose-300/80 font-mono">{error}</p>
              <button
                onClick={handleRunPredictiveModel}
                className="px-4 py-1.5 rounded-lg bg-rose-900 text-white font-mono text-xs hover:bg-rose-800 transition-colors"
              >
                Retry Analysis
              </button>
            </div>
          ) : preEventWarnings.length > 0 ? (
            <div className="space-y-4">
              {/* AI Synthesis Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#142318] via-[#0E1710] to-[#142318] border border-[#C5A059]/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C5A059]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Gemini Predictive Synthesis ({forecastHorizon}h Forward Window)</span>
                </div>
                <p className="text-xs font-sans text-[#F5F5F0]/90 leading-relaxed">
                  {aiSynthesis}
                </p>
              </div>

              {/* Pre-Event Warnings List */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#F5F5F0]/60 flex items-center justify-between">
                  <span>Proactive Pre-Event Alert Warnings ({preEventWarnings.length})</span>
                  <span className="text-[10px] text-[#C5A059]">Threshold breach imminent if trend continues</span>
                </div>

                {preEventWarnings.map((warning) => {
                  const isInjected = injectedIds.has(warning.id);
                  return (
                    <div 
                      key={warning.id}
                      className="p-4 rounded-xl bg-black/60 border border-rose-950/80 hover:border-rose-600/50 transition-all space-y-3 relative overflow-hidden"
                    >
                      {/* Top banner */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-rose-950 border border-rose-500 text-rose-300 flex items-center gap-1 shadow-sm animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            PRE-EVENT WARNING
                          </span>
                          <span className="text-xs font-mono text-[#C5A059] font-bold">
                            {warning.timeAgo}
                          </span>
                          <span className="text-[10px] font-mono text-[#F5F5F0]/40">
                            • {warning.satelliteMission}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {warning.primaryEcologicalImpact && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059]">
                              {warning.primaryEcologicalImpact}
                            </span>
                          )}
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {warning.confidenceScore}% Certainty
                          </span>
                        </div>
                      </div>

                      {/* Title & Bioregion */}
                      <div>
                        <h4 className="text-sm font-serif font-bold text-white leading-snug">
                          {warning.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/60 mt-0.5">
                          <Compass className="w-3 h-3 text-[#C5A059]" />
                          <span>{warning.bioregionName} ({warning.country})</span>
                          <span>• {warning.coordinates[0].toFixed(2)}°, {warning.coordinates[1].toFixed(2)}°</span>
                        </div>
                      </div>

                      {/* Telemetry Excursion & Projected Breach */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                        <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-0.5">
                          <div className="text-[10px] uppercase text-[#F5F5F0]/50">Baseline / Current</div>
                          <div className="text-white font-bold">{warning.baselineValue} → {warning.currentValue}</div>
                          <div className="text-[10px] text-amber-300">{warning.detectedDelta}</div>
                        </div>

                        <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 space-y-0.5">
                          <div className="text-[10px] uppercase text-rose-400">Projected Peak Breach</div>
                          <div className="text-rose-200 font-bold">{warning.projectedPeakValue || 'Critical threshold breach'}</div>
                          <div className="text-[10px] text-rose-300/80">Est. Breach in {warning.hoursToBreach || 36} hours</div>
                        </div>
                      </div>

                      {/* Preventative Mitigation Action */}
                      <div className="p-3 rounded-lg bg-[#101F15] border border-emerald-500/30 text-xs font-sans text-emerald-200">
                        <strong className="text-emerald-400 font-mono block text-[10px] uppercase">
                          Preemptive Stewardship Intervention:
                        </strong>
                        {warning.mitigationProtocol}
                      </div>

                      {/* Inject Button */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#F5F5F0]/40">
                          Authority: {warning.stewardCommunity}
                        </span>

                        <button
                          onClick={() => handleInject(warning)}
                          disabled={isInjected}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isInjected
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-[#1B3022] hover:bg-[#C5A059] hover:text-black text-[#C5A059] border border-[#C5A059]/50 shadow-sm'
                          }`}
                        >
                          {isInjected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Injected into Active Ledger</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Inject into Alert Ledger</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Activity className="w-10 h-10 text-[#C5A059]/40 mx-auto" />
              <div className="text-sm font-serif font-bold text-[#F5F5F0]">
                Ready to Run Predictive Trend Model
              </div>
              <p className="text-xs font-mono text-[#F5F5F0]/50 max-w-md mx-auto">
                Select your target bioregion and forecast horizon, then click "Run Predictive Trend Analysis" to project non-linear threshold breaches before they occur.
              </p>
              <button
                onClick={handleRunPredictiveModel}
                className="px-4 py-2 rounded-lg bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Run Predictive Analysis Now
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#060907] border-t border-[#1B3022] flex items-center justify-between text-xs font-mono">
          <span className="text-[#F5F5F0]/40">
            Powered by Gemini 3.8 Flash • Pre-Breach Sensor Trend Physics
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
