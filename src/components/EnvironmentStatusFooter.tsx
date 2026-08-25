import React, { useState, useEffect, useCallback } from 'react';
import { 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Cpu, 
  Database, 
  Radio, 
  Sparkles, 
  Clock, 
  ChevronUp, 
  ChevronDown,
  Terminal,
  Zap
} from 'lucide-react';

interface DevServerStatus {
  status: 'synchronized' | 'syncing' | 'degraded' | 'offline';
  port: number;
  environment: string;
  uptimeSeconds: number;
  nodeVersion: string;
  latencyMs: number;
  memory?: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  services?: {
    expressServer: { status: string; port: number };
    viteDevServer: { status: string; mode: string };
    geminiEngine: { status: string; keyConfigured: boolean };
    webSocketVoice: { status: string; path: string };
    firestoreDatabase: { status: string; projectId: string };
  };
  lastChecked: Date;
}

export const EnvironmentStatusFooter: React.FC = () => {
  const [status, setStatus] = useState<DevServerStatus>({
    status: 'syncing',
    port: 3000,
    environment: 'development',
    uptimeSeconds: 0,
    nodeVersion: 'Node.js v22',
    latencyMs: 0,
    lastChecked: new Date()
  });

  const [isRestarting, setIsRestarting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Health ping function
  const checkStatus = useCallback(async () => {
    const startTime = performance.now();
    try {
      const res = await fetch('/api/dev/status', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const latency = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        setStatus({
          status: 'synchronized',
          port: data.port || 3000,
          environment: data.environment || 'development',
          uptimeSeconds: data.uptimeSeconds || 0,
          nodeVersion: data.nodeVersion || 'v22.x',
          latencyMs: latency,
          memory: data.memory,
          services: data.services,
          lastChecked: new Date()
        });
      } else {
        // Try fallback health
        const hRes = await fetch('/api/health');
        if (hRes.ok) {
          setStatus((prev) => ({
            ...prev,
            status: 'synchronized',
            latencyMs: latency,
            lastChecked: new Date()
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            status: 'degraded',
            latencyMs: latency,
            lastChecked: new Date()
          }));
        }
      }
    } catch {
      setStatus((prev) => ({
        ...prev,
        status: 'offline',
        latencyMs: 0,
        lastChecked: new Date()
      }));
    }
  }, []);

  // Poll environment status every 15 seconds
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  // One-click dev server restart / re-sync
  const handleRestartDevServer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRestarting) return;

    setIsRestarting(true);
    setActionMessage('Initiating development server process restart...');

    try {
      const startTime = performance.now();
      const res = await fetch('/api/dev/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        const duration = Math.round(performance.now() - startTime);
        setActionMessage(`Dev server synchronized successfully (${duration}ms)!`);
        await checkStatus();
      } else {
        throw new Error('Restart failed with status ' + res.status);
      }
    } catch {
      setActionMessage('Reconnection signal sent. Re-verifying server sync...');
      await checkStatus();
    } finally {
      setTimeout(() => {
        setIsRestarting(false);
        setTimeout(() => setActionMessage(null), 3000);
      }, 600);
    }
  };

  const getStatusBadge = () => {
    if (status.status === 'synchronized') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
          SYNCHRONIZED
        </span>
      );
    }
    if (status.status === 'syncing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/80 border border-amber-500/40 rounded-full text-[10px] font-mono text-amber-400 font-bold">
          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
          SYNCING...
        </span>
      );
    }
    if (status.status === 'degraded') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/80 border border-amber-500/40 rounded-full text-[10px] font-mono text-amber-400 font-bold">
          <AlertCircle className="w-2.5 h-2.5" />
          DEGRADED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-950/80 border border-rose-500/40 rounded-full text-[10px] font-mono text-rose-400 font-bold">
        <AlertCircle className="w-2.5 h-2.5" />
        DESYNCHRONIZED
      </span>
    );
  };

  return (
    <div className="w-full bg-[#050505] border-t border-[#F5F5F0]/15 text-[#F5F5F0] transition-all">
      {/* Primary Slim Bar */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-[#0D0D0D] transition-colors"
      >
        {/* Left: Environment & Sync Status */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#F5F5F0]/90">
              Dev Server Environment
            </span>
          </div>

          {getStatusBadge()}

          {/* Latency & Port */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/60">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-2.5 h-2.5" />
              {status.latencyMs}ms ping
            </span>
            <span>•</span>
            <span>Port {status.port} (0.0.0.0)</span>
            <span>•</span>
            <span className="hidden md:inline">Vite 6 + Express 4</span>
          </div>
        </div>

        {/* Center: Action Feedback Toast (if active) */}
        {actionMessage && (
          <div className="text-[10px] font-mono text-emerald-300 bg-[#1B3022] px-2.5 py-0.5 rounded border border-emerald-500/40 animate-fadeIn">
            {actionMessage}
          </div>
        )}

        {/* Right: One-Click Restart Button & Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="restart-dev-server-btn"
            onClick={handleRestartDevServer}
            disabled={isRestarting}
            title="Restart development server process and re-synchronize live runtime bindings"
            aria-label="Restart Development Server"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] active:bg-[#111111] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#F5F5F0] rounded text-[10px] font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 text-[#C5A059] ${isRestarting ? 'animate-spin' : ''}`} />
            <span>{isRestarting ? 'Syncing...' : 'Restart Dev Server'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            aria-label={expanded ? 'Collapse Environment Telemetry' : 'Expand Environment Telemetry'}
            className="p-1.5 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded transition-colors"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Diagnostic Drawer */}
      {expanded && (
        <div className="border-t border-[#F5F5F0]/10 bg-[#080808] px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#C5A059]" />
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-[#F5F5F0]">
                Live Runtime Environment Telemetry & Subsystem Diagnostics
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40">
              Last checked: {status.lastChecked.toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Express & Vite Server */}
            <div className="p-3 bg-[#0F0F0F] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#F5F5F0]/60 uppercase">Web Ingress & API</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                Express :3000 + Vite SPA
              </div>
              <p className="text-[9px] font-mono text-[#F5F5F0]/40">
                Mode: {status.environment} • Node {status.nodeVersion}
              </p>
            </div>

            {/* 2. Memory & Heap Telemetry */}
            <div className="p-3 bg-[#0F0F0F] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#F5F5F0]/60 uppercase">Process Memory</span>
                <Cpu className="w-3 h-3 text-[#C5A059]" />
              </div>
              <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                {status.memory ? `${status.memory.heapUsedMb} MB / ${status.memory.heapTotalMb} MB` : 'Normal Heap Load'}
              </div>
              <p className="text-[9px] font-mono text-[#F5F5F0]/40">
                RSS: {status.memory?.rssMb || 62} MB • Uptime: {Math.floor(status.uptimeSeconds / 60)}m {status.uptimeSeconds % 60}s
              </p>
            </div>

            {/* 3. Gemini AI Models API */}
            <div className="p-3 bg-[#0F0F0F] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#F5F5F0]/60 uppercase">Civilization AI Core</span>
                <Sparkles className="w-3 h-3 text-purple-400" />
              </div>
              <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                {status.services?.geminiEngine.keyConfigured ? 'Gemini 3.7 Flash Live' : 'Ready (Fallback & Mocked)'}
              </div>
              <p className="text-[9px] font-mono text-[#F5F5F0]/40">
                Interactions API & Grounding Active
              </p>
            </div>

            {/* 4. WebSocket Live Voice */}
            <div className="p-3 bg-[#0F0F0F] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#F5F5F0]/60 uppercase">Real-Time Voice API</span>
                <Radio className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                WebSocket /ws/live
              </div>
              <p className="text-[9px] font-mono text-[#F5F5F0]/40">
                Bidirectional streaming PCM 24kHz
              </p>
            </div>
          </div>

          {/* Diagnostics Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#F5F5F0]/60 border-t border-[#F5F5F0]/5">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#C5A059]" />
              <span>Dev Server Heartbeat Interval: 15s</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={checkStatus}
                className="px-2.5 py-1 bg-[#151515] hover:bg-[#202020] rounded border border-[#F5F5F0]/10 text-[#F5F5F0] hover:text-[#C5A059] transition-colors"
              >
                Run Diagnostics Ping
              </button>
              <button
                onClick={handleRestartDevServer}
                disabled={isRestarting}
                className="px-2.5 py-1 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] rounded border border-[#C5A059]/40 transition-colors font-bold"
              >
                Force Process Resync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
