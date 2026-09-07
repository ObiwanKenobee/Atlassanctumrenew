import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Radio, 
  ChevronRight, 
  X, 
  Activity, 
  Droplets, 
  Layers, 
  TreePine, 
  Zap, 
  ExternalLink, 
  Sliders, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  Volume2
} from 'lucide-react';
import { useBioregionalHazard, BioregionalHazardAlert } from '../../context/BioregionalHazardContext';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface HeaderHazardAlertBannerProps {
  onSelectTab: (tab: PageView) => void;
}

export const HeaderHazardAlertBanner: React.FC<HeaderHazardAlertBannerProps> = ({ onSelectTab }) => {
  const { 
    activeCriticalBannerAlert, 
    dismissBannerAlert, 
    acknowledgeAlert,
    sensorFeeds,
    isLiveStreaming,
    toggleLiveStreaming,
    injectThresholdBreach,
    resolveSensorBreach,
    activeSensorsOnlineCount
  } = useBioregionalHazard();

  const [showMeshDrawer, setShowMeshDrawer] = useState(false);

  if (!activeCriticalBannerAlert) {
    return null;
  }

  const alert = activeCriticalBannerAlert;

  const getCategoryIcon = (category: BioregionalHazardAlert['category']) => {
    switch (category) {
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'soil':
        return <Layers className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'canopy':
        return <TreePine className="w-4 h-4 text-[#C5A059] shrink-0" />;
      case 'biodiversity':
        return <Activity className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'energy':
        return <Zap className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  return (
    <>
      <div 
        id="bioregional-critical-header-banner"
        role="alert"
        aria-live="assertive"
        className="w-full bg-gradient-to-r from-rose-950/95 via-rose-900/90 to-red-950/95 border-b-2 border-rose-500 text-rose-100 px-3 sm:px-6 py-2 transition-all shadow-[0_4px_24px_rgba(244,63,94,0.3)] select-none relative z-50 animate-in slide-in-from-top-3 duration-300"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          {/* Left: Siren & Core Breach Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-600/30 border border-rose-400/60 shrink-0 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-400 ring-2 ring-rose-950 animate-ping" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-black font-black uppercase tracking-wider text-[9px]">
                  CRITICAL BIOREGIONAL BREACH
                </span>
                <span className="font-bold text-white truncate">{alert.regionName}</span>
                <span className="text-rose-300/60 hidden sm:inline">•</span>
                <span className="text-rose-200/80 font-mono text-[10px] hidden sm:inline">Node: {alert.sensorNodeId}</span>
              </div>
              <p className="text-xs text-rose-100 font-sans line-clamp-1 mt-0.5">
                <strong className="text-white font-mono">{alert.metricName}</strong>: Current{' '}
                <span className="font-mono font-bold text-white bg-black/40 px-1 py-0.5 rounded border border-rose-500/50">
                  {alert.currentValue} {alert.unit}
                </span>{' '}
                (Threshold: {alert.criticalThreshold} {alert.unit} •{' '}
                <span className="text-rose-300 font-mono font-bold">{alert.deviationPct}% deviation</span>)
              </p>
            </div>
          </div>

          {/* Right: Actions & Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-rose-800/40 pt-1.5 md:pt-0">
            <div className="flex items-center gap-1.5">
              <button
                id="header-hazard-action-btn"
                onClick={() => {
                  audioFeedback.playViewTransition();
                  onSelectTab(alert.targetTab);
                }}
                className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-black font-bold font-mono text-[10px] uppercase tracking-wider rounded transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Navigate to Bioregional Ledger to deploy remediation accords"
              >
                <span>Deploy Accord</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>

              <button
                id="header-hazard-mesh-toggle"
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setShowMeshDrawer(prev => !prev);
                }}
                className="px-2.5 py-1.5 bg-black/40 hover:bg-black/60 border border-rose-400/40 hover:border-rose-300 text-rose-200 font-mono text-[10px] uppercase rounded transition-all flex items-center gap-1 cursor-pointer"
                title="Inspect real-time environmental sensor feeds & simulation controls"
              >
                <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Sensor Feeds ({activeSensorsOnlineCount})</span>
              </button>

              <button
                id="header-hazard-ack-btn"
                onClick={() => {
                  acknowledgeAlert(alert.id);
                  dismissBannerAlert();
                }}
                className="px-2 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-600/40 text-rose-300 hover:text-white font-mono text-[10px] uppercase rounded transition-all flex items-center gap-1 cursor-pointer"
                title="Acknowledge critical breach"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Acknowledge</span>
              </button>
            </div>

            <button
              id="header-hazard-dismiss-btn"
              onClick={dismissBannerAlert}
              aria-label="Dismiss Alert Banner"
              className="p-1 text-rose-400/70 hover:text-rose-100 hover:bg-rose-800/40 rounded transition-colors"
              title="Dismiss banner (stays in beacon radar)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Environmental Sensor Mesh Drawer Modal */}
      {showMeshDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0D0D0D] border border-rose-500/40 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F0]/10 bg-[#080808]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                    Bioregional Environmental Sensor Feeds (Real-Time Mesh)
                  </h3>
                  <p className="text-xs text-[#F5F5F0]/50 font-mono">
                    Live telemetry stream from in-situ IoT piezometers, soil probes, flux towers & drone transects
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLiveStreaming}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded border transition-colors ${
                    isLiveStreaming 
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-[#1A1A1A] border-[#F5F5F0]/20 text-[#F5F5F0]/60'
                  }`}
                >
                  {isLiveStreaming ? 'Streaming Live (ON)' : 'Streaming Paused'}
                </button>
                <button
                  onClick={() => setShowMeshDrawer(false)}
                  className="p-1.5 text-[#F5F5F0]/50 hover:text-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#121212] border border-[#F5F5F0]/10 rounded text-xs font-mono">
                <span className="text-[#F5F5F0]/70">Active Threshold Breaches:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => injectThresholdBreach()}
                    className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 border border-rose-500/50 text-rose-200 rounded text-[10px] uppercase font-bold cursor-pointer"
                  >
                    Simulate Sensor Breach
                  </button>
                </div>
              </div>

              {/* Sensor Feeds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {sensorFeeds.map((sensor) => {
                  return (
                    <div 
                      key={sensor.id}
                      className={`p-4 rounded border transition-all ${
                        sensor.isBreached
                          ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                          : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${sensor.isBreached ? 'bg-rose-500/20' : 'bg-[#1A1A1A]'}`}>
                            {getCategoryIcon(sensor.category)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#F5F5F0]">{sensor.name}</div>
                            <div className="text-[10px] font-mono text-[#F5F5F0]/50">{sensor.basinName} • {sensor.sensorNodeId}</div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          sensor.isBreached 
                            ? 'bg-rose-500 text-black animate-pulse'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {sensor.isBreached ? 'BREACHED' : 'NOMINAL'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F5F5F0]/10 text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Current Reading</div>
                          <div className={`text-base font-bold ${sensor.isBreached ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {sensor.currentValue} <span className="text-xs font-normal text-[#F5F5F0]/60">{sensor.unit}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Critical Threshold</div>
                          <div className="text-base font-bold text-[#F5F5F0]">
                            {sensor.thresholdOperator === 'less_than' ? '<' : '>'} {sensor.criticalThreshold} {sensor.unit}
                          </div>
                        </div>
                      </div>

                      {/* Mini Telemetry Sparkline */}
                      <div className="mt-2.5 pt-2 border-t border-[#F5F5F0]/5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40 mb-1">
                          <span>Live Telemetry Stream ({sensor.samplingRateHz} Hz)</span>
                          <span>{new Date(sensor.lastTelemetryTimestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="h-6 flex items-end gap-1 bg-black/40 p-1 rounded">
                          {sensor.history.map((val, idx) => {
                            const min = sensor.criticalThreshold * 0.7;
                            const max = sensor.criticalThreshold * 1.4;
                            const heightPct = Math.min(100, Math.max(15, ((val - min) / (max - min)) * 100));
                            return (
                              <div
                                key={idx}
                                style={{ height: `${heightPct}%` }}
                                className={`flex-1 rounded-xs transition-all ${
                                  sensor.isBreached ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Remediation / Simulation Button */}
                      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#F5F5F0]/10">
                        <span className="text-[10px] text-[#F5F5F0]/60 line-clamp-1 italic">
                          {sensor.recommendedAction}
                        </span>
                        {sensor.isBreached ? (
                          <button
                            onClick={() => resolveSensorBreach(sensor.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-black text-[10px] font-mono font-bold uppercase rounded cursor-pointer shrink-0"
                          >
                            Resolve Breach
                          </button>
                        ) : (
                          <button
                            onClick={() => injectThresholdBreach(sensor.id)}
                            className="px-2 py-1 bg-[#1A1A1A] hover:bg-rose-950 hover:text-rose-300 border border-[#F5F5F0]/20 hover:border-rose-500/40 text-[#F5F5F0]/60 text-[10px] font-mono uppercase rounded cursor-pointer shrink-0"
                          >
                            Test Breach
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3 border-t border-[#F5F5F0]/10 bg-[#080808] flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
              <span>{activeSensorsOnlineCount} Distributed Sensor Nodes Connected • LoRaWAN Mesh v2.4</span>
              <button
                onClick={() => {
                  setShowMeshDrawer(false);
                  onSelectTab('bioregional-ledger');
                }}
                className="text-[#C5A059] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Open Bioregional Ledger View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
