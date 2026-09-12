import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Droplets, 
  Zap, 
  Truck, 
  Radio, 
  Building2, 
  HeartPulse, 
  Wheat, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  DollarSign, 
  Cpu,
  Layers,
  Flame,
  TreePine,
  Wind
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

interface ForecastImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: SatelliteHazardAlert | null;
}

interface InfrastructureImpactResult {
  hazardId: string;
  hazardTitle: string;
  bioregionName: string;
  overallVulnerabilityScore: number;
  cascadingTimeline: {
    immediate: string;
    shortTerm: string;
    mediumTerm: string;
  };
  affectedInfrastructure: Array<{
    facilityName: string;
    type: 'water' | 'energy' | 'transport' | 'telecom' | 'agriculture' | 'healthcare';
    impactLevel: 'SEVERE' | 'MODERATE' | 'LOW';
    estimatedDowntimeHours: number;
    vulnerabilityMechanism: string;
    mitigationSafeguard: string;
  }>;
  estimatedEconomicExposure: string;
  emergencyInfrastructureProtocols: string[];
  reasoningSummary: string;
  mode?: string;
  latencyMs?: number;
}

export const ForecastImpactModal: React.FC<ForecastImpactModalProps> = ({
  isOpen,
  onClose,
  alert
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [impactData, setImpactData] = useState<InfrastructureImpactResult | null>(null);
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'timeline' | 'protocols'>('infrastructure');

  const fetchInfrastructureForecast = async (hazardAlert: SatelliteHazardAlert) => {
    setLoading(true);
    setError(null);
    try {
      audioFeedback.playTelemetryWarning();
      const response = await fetch('/api/gemini/hazard-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert: hazardAlert })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to forecast infrastructure impact`);
      }

      const data = await response.json();
      setImpactData(data);
      audioFeedback.playSuccessChime();
    } catch (err: any) {
      console.error('Forecast impact error:', err);
      setError(err.message || 'Error simulating infrastructure impact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && alert) {
      fetchInfrastructureForecast(alert);
    }
  }, [isOpen, alert?.id]);

  if (!isOpen || !alert) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'water': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'energy': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'transport': return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'telecom': return <Radio className="w-4 h-4 text-purple-400" />;
      case 'agriculture': return <Wheat className="w-4 h-4 text-yellow-400" />;
      case 'healthcare': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      default: return <Building2 className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  const getImpactBadge = (level: 'SEVERE' | 'MODERATE' | 'LOW') => {
    switch (level) {
      case 'SEVERE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/90 border border-rose-600 text-rose-300">
            SEVERE IMPACT
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/90 border border-amber-500/50 text-amber-300">
            MODERATE
          </span>
        );
      case 'LOW':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            LOW RISK
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="forecast-impact-modal"
        className="w-full max-w-4xl bg-[#090D0A] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#142318] via-[#090D0A] to-[#142318] border-b border-[#1B3022] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1B3022] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  Gemini Infrastructure Downstream Impact Forecaster
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-bold">
                  GEMINI 3.8 FLASH
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/50 font-sans">
                Simulate potential downstream physical, civil, and municipal infrastructure vulnerabilities triggered by this hazard
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

        {/* Hazard Target Summary Strip */}
        <div className="px-5 py-3 bg-black/50 border-b border-[#1B3022] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              [{alert.severity}]
            </span>
            <span className="text-[#F5F5F0] font-bold truncate max-w-sm">
              {alert.title}
            </span>
            <span className="text-[#F5F5F0]/40">• {alert.bioregionName}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchInfrastructureForecast(alert)}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-Simulate</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div className="text-sm font-serif font-bold text-[#F5F5F0]">
                Gemini Reasoning Engine Simulating Downstream Cascades...
              </div>
              <p className="text-xs font-mono text-[#F5F5F0]/50 text-center max-w-md">
                Analyzing hydraulic flow vectors, electrical substation thermal limits, bridge scour mechanics, and local municipal utility exposure.
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-600/50 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
              <div className="text-sm font-bold text-rose-200">Simulation Error</div>
              <p className="text-xs text-rose-300/80 font-mono">{error}</p>
              <button
                onClick={() => fetchInfrastructureForecast(alert)}
                className="px-4 py-1.5 rounded-lg bg-rose-900 text-white font-mono text-xs hover:bg-rose-800 transition-colors"
              >
                Retry Simulation
              </button>
            </div>
          ) : impactData ? (
            <div className="space-y-5">
              {/* Executive Vulnerability & Exposure Header Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Vulnerability Score Card */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-[#1B3022] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider">
                      Infrastructure Vulnerability
                    </div>
                    <div className="text-2xl font-mono font-bold mt-0.5 text-rose-400">
                      {impactData.overallVulnerabilityScore}<span className="text-xs text-[#F5F5F0]/40">/100</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-600/40 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                {/* Economic Exposure Risk */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-[#1B3022] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider">
                      Estimated Economic Exposure
                    </div>
                    <div className="text-xs font-mono font-bold text-[#C5A059] mt-1">
                      {impactData.estimatedEconomicExposure}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                {/* Primary Mitigation Velocity */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-[#1B3022] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider">
                      Actionable Assets Tracked
                    </div>
                    <div className="text-2xl font-mono font-bold mt-0.5 text-emerald-400">
                      {impactData.affectedInfrastructure.length} Nodes
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Gemini Reasoning Engine Synthesis */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#142318] via-[#0E1710] to-[#142318] border border-[#C5A059]/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C5A059]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Gemini Reasoning Synthesis</span>
                </div>
                <p className="text-xs font-sans text-[#F5F5F0]/90 leading-relaxed">
                  {impactData.reasoningSummary}
                </p>
              </div>

              {/* Navigation Tabs: Infrastructure Nodes, Cascading Timeline, Emergency Protocols */}
              <div className="flex items-center gap-1 border-b border-[#1B3022] pb-1 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('infrastructure')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
                    activeTab === 'infrastructure'
                      ? 'bg-[#1B3022] text-[#C5A059] border-b-2 border-b-[#C5A059] font-bold'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Affected Infrastructure ({impactData.affectedInfrastructure.length})
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
                    activeTab === 'timeline'
                      ? 'bg-[#1B3022] text-[#C5A059] border-b-2 border-b-[#C5A059] font-bold'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Cascading Timeline (0-7 Days)
                </button>
                <button
                  onClick={() => setActiveTab('protocols')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
                    activeTab === 'protocols'
                      ? 'bg-[#1B3022] text-[#C5A059] border-b-2 border-b-[#C5A059] font-bold'
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Emergency Safeguards & Protocols
                </button>
              </div>

              {/* Tab 1: Affected Infrastructure Grid */}
              {activeTab === 'infrastructure' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {impactData.affectedInfrastructure.map((facility, idx) => (
                    <div 
                      key={`infra-${idx}`}
                      className="p-4 rounded-xl bg-black/60 border border-[#1B3022] hover:border-white/20 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded bg-black/80 border border-white/10 shrink-0">
                            {getTypeIcon(facility.type)}
                          </div>
                          <div>
                            <h5 className="text-xs font-serif font-bold text-[#F5F5F0] leading-tight">
                              {facility.facilityName}
                            </h5>
                            <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
                              Sector: {facility.type}
                            </span>
                          </div>
                        </div>
                        {getImpactBadge(facility.impactLevel)}
                      </div>

                      {/* Mechanism of Failure */}
                      <div className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1">
                        <div className="text-[9.5px] font-mono uppercase text-[#F5F5F0]/50">
                          Vulnerability Mechanism
                        </div>
                        <p className="text-xs font-sans text-[#F5F5F0]/80 leading-relaxed">
                          {facility.vulnerabilityMechanism}
                        </p>
                      </div>

                      {/* Safeguard & Downtime */}
                      <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-white/5">
                        <span className="text-[#C5A059] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{facility.estimatedDowntimeHours}h Est. Downtime
                        </span>
                      </div>

                      <div className="p-2 rounded bg-[#101F15] border border-emerald-500/30 text-[11px] font-sans text-emerald-200">
                        <strong className="text-emerald-400 font-mono block text-[10px] uppercase">
                          Operational Safeguard:
                        </strong>
                        {facility.mitigationSafeguard}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Cascading Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-4 p-2">
                  <div className="p-4 rounded-xl bg-black/60 border-l-4 border-l-rose-500 border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Phase 1: Immediate Hydraulic & Thermal Blast (0 - 6 Hours)
                    </div>
                    <p className="text-xs font-sans text-[#F5F5F0]/85 leading-relaxed">
                      {impactData.cascadingTimeline.immediate}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border-l-4 border-l-amber-500 border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Phase 2: Secondary Utility & Transport Disruptions (12 - 48 Hours)
                    </div>
                    <p className="text-xs font-sans text-[#F5F5F0]/85 leading-relaxed">
                      {impactData.cascadingTimeline.shortTerm}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border-l-4 border-l-cyan-500 border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Phase 3: Structural Systemic Stress & Supply Continuity (3 - 7 Days)
                    </div>
                    <p className="text-xs font-sans text-[#F5F5F0]/85 leading-relaxed">
                      {impactData.cascadingTimeline.mediumTerm}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Emergency Safeguard Protocols */}
              {activeTab === 'protocols' && (
                <div className="p-4 rounded-xl bg-black/60 border border-[#1B3022] space-y-3">
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Recommended SCADA & Physical Defense Protocols
                  </div>
                  <div className="divide-y divide-[#1B3022]/60">
                    {impactData.emergencyInfrastructureProtocols.map((proto, idx) => (
                      <div key={`proto-${idx}`} className="py-2.5 flex items-start gap-2.5 text-xs font-sans text-[#F5F5F0]/90">
                        <span className="w-5 h-5 rounded-full bg-[#1B3022] text-[#C5A059] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{proto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#060907] border-t border-[#1B3022] flex items-center justify-between text-xs font-mono">
          <span className="text-[#F5F5F0]/40">
            Downstream Simulation Model: Gemini 3.8 Flash
          </span>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#1B3022] hover:bg-[#C5A059] hover:text-black text-[#C5A059] border border-[#C5A059]/40 font-bold transition-all cursor-pointer"
          >
            Close Forecaster
          </button>
        </div>
      </div>
    </div>
  );
};
