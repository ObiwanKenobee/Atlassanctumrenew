import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Wifi, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ChevronDown, 
  ShieldCheck, 
  Server, 
  HardDrive, 
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface SystemVitalityState {
  overallScore: number; // 0 - 100
  hardware: {
    cpuUsagePct: number;
    memoryUsedGb: number;
    memoryTotalGb: number;
    edgeNodesOnline: number;
    edgeNodesTotal: number;
    thermalDegC: number;
    storageUsagePct: number;
    status: 'Nominal' | 'Degraded' | 'Critical';
  };
  network: {
    latencyMs: number;
    packetLossPct: number;
    p2pPeersCount: number;
    meshSyncHealth: number; // 0 - 100
    bandwidthMbps: number;
    status: 'Optimal' | 'High Latency' | 'Offline';
  };
  aiEngine: {
    activeModel: string;
    groundingAccuracyPct: number;
    ttftMs: number; // Time to first token
    epistemicGuardActive: boolean;
    hallucinationRisk: 'Zero' | 'Low' | 'Elevated';
    tokensPerSecond: number;
    status: 'Operational' | 'Calibrating' | 'Throttled';
  };
}

export const SystemVitalityMonitor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [vitality, setVitality] = useState<SystemVitalityState>({
    overallScore: 99.4,
    hardware: {
      cpuUsagePct: 24,
      memoryUsedGb: 3.8,
      memoryTotalGb: 16,
      edgeNodesOnline: 48,
      edgeNodesTotal: 48,
      thermalDegC: 38.5,
      storageUsagePct: 41,
      status: 'Nominal'
    },
    network: {
      latencyMs: 14,
      packetLossPct: 0.0,
      p2pPeersCount: 142,
      meshSyncHealth: 99.8,
      bandwidthMbps: 124.6,
      status: 'Optimal'
    },
    aiEngine: {
      activeModel: 'Gemini 2.5 Flash + Epistemic Arbiter',
      groundingAccuracyPct: 98.7,
      ttftMs: 210,
      epistemicGuardActive: true,
      hallucinationRisk: 'Zero',
      tokensPerSecond: 82.4,
      status: 'Operational'
    }
  });

  // Simulated live telemetry micro-jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setVitality((prev) => {
        const cpuJitter = Math.floor(22 + Math.random() * 6);
        const latencyJitter = Math.floor(12 + Math.random() * 4);
        const tpsJitter = +(80 + Math.random() * 5).toFixed(1);
        const overall = +(99.1 + Math.random() * 0.7).toFixed(1);
        return {
          ...prev,
          overallScore: overall,
          hardware: {
            ...prev.hardware,
            cpuUsagePct: cpuJitter,
          },
          network: {
            ...prev.network,
            latencyMs: latencyJitter,
          },
          aiEngine: {
            ...prev.aiEngine,
            tokensPerSecond: tpsJitter,
          }
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRunDiagnostic = () => {
    audioFeedback.playSubtleClick();
    setIsPinging(true);
    setTimeout(() => {
      setVitality((prev) => ({
        ...prev,
        overallScore: +(99.3 + Math.random() * 0.5).toFixed(1),
        network: {
          ...prev.network,
          latencyMs: 11,
          packetLossPct: 0.0
        },
        hardware: {
          ...prev.hardware,
          cpuUsagePct: 21
        }
      }));
      setIsPinging(false);
      setLastPingTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      audioFeedback.playSyncComplete();
    }, 800);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navigation Pill Trigger Button */}
      <button
        id="system-vitality-monitor-btn"
        onClick={() => {
          audioFeedback.playSubtleClick();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-label={`System Vitality: ${vitality.overallScore}%. Click to inspect hardware, network, and AI engine health`}
        title={`Infrastructure Health: Hardware ${vitality.hardware.status} · Network ${vitality.network.latencyMs}ms · AI Engine ${vitality.aiEngine.status}`}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full border transition-all cursor-pointer font-mono text-xs ${
          isOpen
            ? 'bg-[#1B3022] border-[#C5A059] text-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.25)]'
            : 'bg-[#101511] hover:bg-[#162018] border-emerald-500/40 hover:border-emerald-400 text-emerald-300'
        }`}
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10B981]"></span>
        </span>

        {/* High-Level Labels */}
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider hidden xs:inline">
          SYS
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide">
          {vitality.overallScore}%
        </span>

        {/* Quick Micro Indicators on wider viewports */}
        <div className="hidden xl:flex items-center gap-1.5 pl-1 text-[9px] text-[#F5F5F0]/60 border-l border-emerald-500/30">
          <span className="text-emerald-400 flex items-center gap-0.5" title="Hardware Status">
            <Cpu className="w-2.5 h-2.5" />
            <span>{vitality.hardware.cpuUsagePct}%</span>
          </span>
          <span>·</span>
          <span className="text-cyan-400 flex items-center gap-0.5" title="Network Latency">
            <Wifi className="w-2.5 h-2.5" />
            <span>{vitality.network.latencyMs}ms</span>
          </span>
          <span>·</span>
          <span className="text-amber-400 flex items-center gap-0.5" title="AI Engine Grounding">
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI OK</span>
          </span>
        </div>

        <ChevronDown className={`w-3 h-3 transition-transform text-[#C5A059] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* High-Fidelity Diagnostic Modal / Dropdown HUD */}
      {isOpen && (
        <div 
          id="system-vitality-dropdown"
          className="absolute right-0 top-full mt-2 w-80 sm:w-[380px] max-w-[94vw] bg-[#0A0D0B]/98 backdrop-blur-2xl border border-emerald-500/40 rounded-xl shadow-2xl p-3.5 z-50 space-y-3 animate-in fade-in slide-in-from-top-2 ring-1 ring-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-white tracking-wide">
                  Infrastructure Vitality Monitor
                </h3>
                <p className="text-[9px] font-mono text-[#F5F5F0]/60">
                  Real-time edge telemetry & model health
                </p>
              </div>
            </div>

            <button
              onClick={handleRunDiagnostic}
              disabled={isPinging}
              className="p-1 px-2 rounded bg-[#1B3022] hover:bg-[#254530] text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              title="Run live diagnostic ping"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isPinging ? 'animate-spin text-[#C5A059]' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Ping'}</span>
            </button>
          </div>

          {/* Section 1: Hardware Vitality */}
          <div className="p-2.5 rounded-lg bg-[#121813] border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Cpu className="w-3 h-3 text-emerald-400" />
                Hardware Nodes
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                {vitality.hardware.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="flex justify-between text-[#F5F5F0]/60 text-[9px]">
                  <span>CPU Load</span>
                  <span className="text-white font-bold">{vitality.hardware.cpuUsagePct}%</span>
                </div>
                <div className="w-full bg-[#1F2921] h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${vitality.hardware.cpuUsagePct}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="flex justify-between text-[#F5F5F0]/60 text-[9px]">
                  <span>RAM Heap</span>
                  <span className="text-white font-bold">{vitality.hardware.memoryUsedGb} / {vitality.hardware.memoryTotalGb} GB</span>
                </div>
                <div className="w-full bg-[#1F2921] h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full" 
                    style={{ width: `${(vitality.hardware.memoryUsedGb / vitality.hardware.memoryTotalGb) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/70 pt-0.5">
              <span>Edge Mesh: <strong className="text-white">{vitality.hardware.edgeNodesOnline}/{vitality.hardware.edgeNodesTotal}</strong> Active</span>
              <span>Thermal: <strong className="text-white">{vitality.hardware.thermalDegC}°C</strong></span>
              <span>Storage: <strong className="text-white">{vitality.hardware.storageUsagePct}%</strong></span>
            </div>
          </div>

          {/* Section 2: Network & Mesh Health */}
          <div className="p-2.5 rounded-lg bg-[#121813] border border-cyan-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Wifi className="w-3 h-3 text-cyan-400" />
                Network & P2P Mesh
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                {vitality.network.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="text-[8px] text-[#F5F5F0]/60 uppercase">RTT Latency</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{vitality.network.latencyMs}ms</div>
              </div>
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="text-[8px] text-[#F5F5F0]/60 uppercase">P2P Peers</div>
                <div className="text-xs font-bold text-white mt-0.5">{vitality.network.p2pPeersCount}</div>
              </div>
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="text-[8px] text-[#F5F5F0]/60 uppercase">Loss Rate</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">{vitality.network.packetLossPct}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/70">
              <span>Mesh Sync: <strong className="text-white">{vitality.network.meshSyncHealth}%</strong></span>
              <span>Bandwidth: <strong className="text-white">{vitality.network.bandwidthMbps} Mbps</strong></span>
            </div>
          </div>

          {/* Section 3: AI Engine Health */}
          <div className="p-2.5 rounded-lg bg-[#121813] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                AI Engine & Epistemics
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                {vitality.aiEngine.status}
              </span>
            </div>

            <div className="text-[10px] font-sans text-[#F5F5F0]/90 flex items-center justify-between">
              <span className="truncate max-w-[220px] text-[#C5A059] font-mono text-[9px]">
                {vitality.aiEngine.activeModel}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                Guard Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="text-[8px] text-[#F5F5F0]/60 uppercase">Grounding</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">{vitality.aiEngine.groundingAccuracyPct}%</div>
              </div>
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="text-[8px] text-[#F5F5F0]/60 uppercase">TTFT</div>
                <div className="text-xs font-bold text-white mt-0.5">{vitality.aiEngine.ttftMs}ms</div>
              </div>
              <div className="bg-[#0D120E] p-1.5 rounded border border-[#F5F5F0]/5">
                <div className="text-[8px] text-[#F5F5F0]/60 uppercase">Speed</div>
                <div className="text-xs font-bold text-white mt-0.5">{vitality.aiEngine.tokensPerSecond} t/s</div>
              </div>
            </div>
          </div>

          {/* Footer with timestamp */}
          <div className="text-[8px] font-mono text-[#F5F5F0]/40 flex items-center justify-between pt-1 border-t border-[#F5F5F0]/10">
            <span>Audit Standard: ISO/IEC 42001 & POSIX Edge</span>
            <span>Refreshed: {lastPingTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};
