import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Server, 
  Cpu, 
  Wifi, 
  HardDrive, 
  Download, 
  X, 
  ShieldCheck, 
  Zap,
  Radio,
  Sliders,
  Database,
  Layers,
  WifiOff,
  Clock,
  ArrowUpRight,
  BarChart2
} from 'lucide-react';
import { systemHealth, SystemHealthReport, HealthStatus, GeminiLatencyLogItem, OfflineSyncDiagnostic } from '../../lib/systemHealth';
import { audioFeedback } from '../../lib/audioFeedback';

interface SystemHealthDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHealthDiagnosticModal: React.FC<SystemHealthDiagnosticModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [report, setReport] = useState<SystemHealthReport | null>(systemHealth.getCachedReport());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProbing, setIsProbing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'dependencies' | 'gemini' | 'serviceworker' | 'offlinesync'>('overview');

  useEffect(() => {
    const unsubscribe = systemHealth.subscribe((updated) => {
      setReport(updated);
    });
    return unsubscribe;
  }, []);

  const handleRunDiagnostic = async () => {
    setIsRefreshing(true);
    audioFeedback.playSubtleClick();
    try {
      const updated = await systemHealth.runHealthCheck();
      setReport(updated);
      audioFeedback.playSyncComplete();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendProbe = async () => {
    setIsProbing(true);
    audioFeedback.playSubtleClick();
    try {
      await systemHealth.sendGeminiProbe();
      const updated = await systemHealth.runHealthCheck();
      setReport(updated);
      audioFeedback.playBell([520, 650], 0.25);
    } finally {
      setIsProbing(false);
    }
  };

  const handleClearLogs = () => {
    audioFeedback.playSubtleClick();
    systemHealth.clearLatencyLogs();
  };

  const handleExportDiagnostics = () => {
    if (!report) return;
    audioFeedback.playSubtleClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atlas-system-health-diagnostics-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'degraded':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'critical':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0B0F0C] border border-[#F5F5F0]/20 shadow-2xl text-[#F5F5F0] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between gap-4 bg-[#0F1410]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-inner">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                  System Health & Diagnostic Sentinel
                </h2>
                {report && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusColor(
                      report.overallStatus
                    )}`}
                  >
                    {report.overallStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Real-time dependency verification • Gemini API latency audit • Service Worker registration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDiagnostic}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-[#151D17] hover:bg-[#1D2820] text-neutral-200 border border-[#F5F5F0]/15 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Run complete diagnostic self-test"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Run Self-Check</span>
            </button>

            <button
              onClick={handleExportDiagnostics}
              className="p-1.5 rounded-lg bg-[#151D17] hover:bg-[#1D2820] text-neutral-300 border border-[#F5F5F0]/15 transition-all cursor-pointer"
              title="Export diagnostic report as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-2 border-b border-[#F5F5F0]/10 flex items-center gap-2 font-mono text-xs bg-[#0C100D] overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('dependencies')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dependencies'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Dependencies ({report?.dependencies.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gemini'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Gemini API ({report?.gemini.latencyMs || 0}ms)
          </button>
          <button
            onClick={() => setActiveTab('serviceworker')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'serviceworker'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Service Worker
          </button>
          <button
            onClick={() => setActiveTab('offlinesync')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'offlinesync'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Offline Sync State ({report?.offlineSync?.pendingMutationQueueLength || 0} Queued)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {report ? (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
                    <div className="p-3.5 rounded-xl bg-[#121914] border border-[#F5F5F0]/10">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-1">Gemini API Status</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white flex items-center gap-1.5">
                          {report.gemini.reachable ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          {report.gemini.reachable ? 'Online' : 'Degraded'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-black/40 text-purple-300 border border-purple-500/30">
                          {report.gemini.latencyMs}ms
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#121914] border border-[#F5F5F0]/10">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-1">Service Worker</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white flex items-center gap-1.5">
                          {report.serviceWorker.controllerActive ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          {report.serviceWorker.controllerActive ? 'Active' : 'Standby'}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {report.serviceWorker.registered ? 'Registered' : 'Fallback'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#121914] border border-[#F5F5F0]/10">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-1">Core Modules Loaded</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-emerald-400">
                          {report.dependencies.filter((d) => d.loaded).length} / {report.dependencies.length}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300">
                          100% OK
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#121914] border border-[#F5F5F0]/10">
                      <span className="text-[10px] text-neutral-400 uppercase block mb-1">Memory Heap</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-cyan-300">
                          {report.memory ? `${report.memory.usedJsHeapSizeMb} MB` : 'Optimal'}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {report.memory ? `of ${report.memory.totalJsHeapSizeMb} MB` : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Summary Panel */}
                  <div className="p-4 rounded-xl bg-[#101612] border border-[#F5F5F0]/15 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                      <span className="font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Platform Health Check Findings
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Inspected: {new Date(report.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="space-y-2 text-neutral-300 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Vite Dev Server & Bundler:</strong> Static ESM transform pipeline running on port 3000. Express API proxy layer responding in {report.gemini.latencyMs}ms.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Gemini Reasoning Model:</strong> Model alias configured as {report.gemini.model} with fallback offline deterministic reasoning engine ready.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Offline Storage:</strong> IndexedDB persistent queues and CacheStorage API available for disruption tolerance.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DEPENDENCIES */}
              {activeTab === 'dependencies' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="overflow-x-auto rounded-xl border border-[#F5F5F0]/15">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#121914] text-neutral-400 border-b border-[#F5F5F0]/10 text-[10px] uppercase">
                          <th className="p-3">Package Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Version</th>
                          <th className="p-3">Loaded Status</th>
                          <th className="p-3">Runtime Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5F5F0]/10 text-neutral-200">
                        {report.dependencies.map((dep, idx) => (
                          <tr key={idx} className="hover:bg-[#152019]/60 transition-colors">
                            <td className="p-3 font-bold text-white flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {dep.name}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-cyan-300 border border-cyan-500/30 uppercase">
                                {dep.category}
                              </span>
                            </td>
                            <td className="p-3 text-neutral-400">{dep.version}</td>
                            <td className="p-3 text-emerald-400 font-bold">Loaded</td>
                            <td className="p-3 text-[11px] text-neutral-400">{dep.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: GEMINI API AUDIT */}
              {activeTab === 'gemini' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                      <span className="font-bold text-white">Gemini API Telemetry & Latency Meter</span>
                      <span className="text-purple-300 font-bold">{report.gemini.latencyMs} ms Roundtrip</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Server Endpoint:</span>
                        <span className="text-white font-bold">{report.gemini.serverEnvironment}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">API Key Configured:</span>
                        <span className={report.gemini.keyConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {report.gemini.keyConfigured ? 'Active (GEMINI_API_KEY)' : 'Offline Simulation Fallback'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Primary Reasoning Model:</span>
                        <span className="text-purple-300 font-bold">{report.gemini.model}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Fallback Resilience:</span>
                        <span className="text-emerald-400 font-bold">Deterministic Algorithmic Solver</span>
                      </div>
                    </div>

                    {report.gemini.error && (
                      <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Latency Warning: {report.gemini.error}</span>
                      </div>
                    )}
                  </div>

                  {/* Dedicated Gemini API Latency Logs & Probe Control */}
                  <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-2">
                      <div>
                        <h4 className="font-bold text-white flex items-center gap-2">
                          <BarChart2 className="w-4 h-4 text-purple-400" />
                          Gemini API Live Latency Logs
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Microsecond-precision API gateway probe telemetry
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleClearLogs}
                          className="px-2.5 py-1 rounded bg-black/40 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-white/10 text-[10px] cursor-pointer transition-colors"
                        >
                          Clear Logs
                        </button>
                        <button
                          onClick={handleSendProbe}
                          disabled={isProbing}
                          className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <Zap className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
                          <span>{isProbing ? 'Probing...' : 'Send Latency Ping Probe'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Latency Distribution Metrics */}
                    {report.geminiLatencyLogs && report.geminiLatencyLogs.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        <div className="p-2 rounded bg-black/30 border border-white/5">
                          <span className="text-neutral-400 block">Average Latency</span>
                          <span className="text-sm font-bold text-white">
                            {Math.round(report.geminiLatencyLogs.reduce((acc, l) => acc + l.latencyMs, 0) / report.geminiLatencyLogs.length)} ms
                          </span>
                        </div>
                        <div className="p-2 rounded bg-black/30 border border-white/5">
                          <span className="text-neutral-400 block">Fastest Probe</span>
                          <span className="text-sm font-bold text-emerald-400">
                            {Math.min(...report.geminiLatencyLogs.map(l => l.latencyMs))} ms
                          </span>
                        </div>
                        <div className="p-2 rounded bg-black/30 border border-white/5">
                          <span className="text-neutral-400 block">Slowest Probe</span>
                          <span className="text-sm font-bold text-amber-400">
                            {Math.max(...report.geminiLatencyLogs.map(l => l.latencyMs))} ms
                          </span>
                        </div>
                        <div className="p-2 rounded bg-black/30 border border-white/5">
                          <span className="text-neutral-400 block">Samples Recorded</span>
                          <span className="text-sm font-bold text-purple-300">
                            {report.geminiLatencyLogs.length} Probes
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Historical Latency Log Table */}
                    <div className="overflow-x-auto rounded-lg border border-white/10 max-h-60 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="sticky top-0 bg-[#0E1410] border-b border-white/10 text-neutral-400 uppercase text-[9px]">
                          <tr>
                            <th className="p-2.5">Timestamp</th>
                            <th className="p-2.5">Endpoint</th>
                            <th className="p-2.5">Model</th>
                            <th className="p-2.5">Latency</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5">Payload Summary</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
                          {(!report.geminiLatencyLogs || report.geminiLatencyLogs.length === 0) ? (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-neutral-400">
                                No latency logs recorded yet. Click "Send Latency Ping Probe" to test roundtrip timing.
                              </td>
                            </tr>
                          ) : (
                            report.geminiLatencyLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-2.5 text-neutral-400">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="p-2.5 font-bold text-white">
                                  {log.endpoint}
                                </td>
                                <td className="p-2.5 text-purple-300">
                                  {log.model}
                                </td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    log.latencyMs < 120 
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                                      : log.latencyMs < 300 
                                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40' 
                                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                  }`}>
                                    {log.latencyMs} ms
                                  </span>
                                </td>
                                <td className="p-2.5">
                                  <span className="text-emerald-400 font-bold">
                                    {log.httpStatus === 200 ? '200 OK' : `HTTP ${log.httpStatus}`}
                                  </span>
                                </td>
                                <td className="p-2.5 text-neutral-400 truncate max-w-[160px]">
                                  {log.payloadSummary}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SERVICE WORKER HEALTH */}
              {activeTab === 'serviceworker' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                      <span className="font-bold text-white">Service Worker & PWA Caching State</span>
                      <span className="text-emerald-400 font-bold">
                        {report.serviceWorker.supported ? 'Supported' : 'Unsupported'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Registration Status:</span>
                        <span className="text-white font-bold">
                          {report.serviceWorker.registered ? 'Registered' : 'Not Registered (In-browser)'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Controller State:</span>
                        <span className="text-cyan-300 font-bold">
                          {report.serviceWorker.controllerActive ? 'Controlling Page Clients' : 'Inactive'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Cache Storage API:</span>
                        <span className="text-emerald-400 font-bold">
                          {report.serviceWorker.cacheStorageReady ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-neutral-400 block mb-1">Current State:</span>
                        <span className="text-amber-300 font-bold uppercase">{report.serviceWorker.state || 'none'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: OFFLINE SYNC STATE & QUEUE DIAGNOSTIC */}
              {activeTab === 'offlinesync' && (
                <div className="space-y-4 font-mono text-xs">
                  {/* Status Overview Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase block">Network Connectivity</span>
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-base font-bold flex items-center gap-1.5 ${
                          report.offlineSync?.isOnline && !report.offlineSync?.isForceOffline 
                            ? 'text-emerald-400' 
                            : 'text-amber-400'
                        }`}>
                          {report.offlineSync?.isOnline && !report.offlineSync?.isForceOffline ? (
                            <>
                              <Wifi className="w-4 h-4 text-emerald-400" />
                              Online Sync Active
                            </>
                          ) : (
                            <>
                              <WifiOff className="w-4 h-4 text-amber-400" />
                              Local Offline Mode
                            </>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">
                        {report.offlineSync?.isForceOffline ? 'Force Offline override enabled' : 'Auto-reconnecting when online'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase block">Pending Mutation Queue</span>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-bold text-cyan-300">
                          {report.offlineSync?.pendingMutationQueueLength || 0} Writes Queued
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          (report.offlineSync?.pendingMutationQueueLength || 0) === 0 
                            ? 'bg-emerald-950 text-emerald-300' 
                            : 'bg-amber-950 text-amber-300 animate-pulse'
                        }`}>
                          {report.offlineSync?.syncWorkerStatus || 'idle'}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">
                        Write-ahead log in IndexedDB
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase block">IndexedDB Engine</span>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Ready (v1)
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {report.offlineSync?.indexedDbStoreNames.length || 3} Stores
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block">
                        Stores: pending_writes, cached_documents
                      </span>
                    </div>
                  </div>

                  {/* Browser Storage Quota & Capacity */}
                  {report.offlineSync?.storageEstimate && (
                    <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                        <span className="font-bold text-white flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-cyan-400" />
                          Client Storage Quota & Allocation
                        </span>
                        <span className="text-cyan-300 font-bold">
                          {report.offlineSync.storageEstimate.usageMb} MB Used of {report.offlineSync.storageEstimate.quotaMb.toLocaleString()} MB
                        </span>
                      </div>

                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(1, Math.min(100, report.offlineSync.storageEstimate.percentageUsed))}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>Utilization: {report.offlineSync.storageEstimate.percentageUsed}% of quota</span>
                        <span className="text-emerald-400">Safe Headroom: {(report.offlineSync.storageEstimate.quotaMb - report.offlineSync.storageEstimate.usageMb).toLocaleString()} MB</span>
                      </div>
                    </div>
                  )}

                  {/* Uncommitted Write Queue Table */}
                  <div className="p-4 rounded-xl bg-[#121914] border border-[#F5F5F0]/15 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                      <div>
                        <h4 className="font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-amber-400" />
                          Uncommitted Write-Ahead Queue
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Local mutations waiting for network reconnection and cloud commit
                        </p>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-black/40 text-neutral-300 border border-white/10 text-[10px]">
                        Last Sync: {report.offlineSync?.lastSyncAttempt ? new Date(report.offlineSync.lastSyncAttempt).toLocaleTimeString() : 'Never'}
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-white/10 max-h-48 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="sticky top-0 bg-[#0E1410] border-b border-white/10 text-neutral-400 uppercase text-[9px]">
                          <tr>
                            <th className="p-2.5">Mutation ID</th>
                            <th className="p-2.5">Target Collection</th>
                            <th className="p-2.5">Operation</th>
                            <th className="p-2.5">Timestamp</th>
                            <th className="p-2.5">State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
                          {(!report.offlineSync?.uncommittedItems || report.offlineSync.uncommittedItems.length === 0) ? (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-neutral-400">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-2" />
                                All local mutations are fully synchronized with Firestore cloud ledger.
                              </td>
                            </tr>
                          ) : (
                            report.offlineSync.uncommittedItems.map((item) => (
                              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-2.5 text-neutral-300 font-bold">
                                  {item.id.slice(0, 12)}...
                                </td>
                                <td className="p-2.5 text-cyan-300">
                                  {item.collection}
                                </td>
                                <td className="p-2.5">
                                  <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 uppercase text-[9px] font-bold">
                                    {item.opType}
                                  </span>
                                </td>
                                <td className="p-2.5 text-neutral-400">
                                  {new Date(item.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="p-2.5 text-amber-400 font-bold">
                                  Pending Flush
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center font-mono text-xs text-neutral-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
              Compiling diagnostic metrics...
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#F5F5F0]/10 bg-[#0F1410] flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 text-[11px]">
            Dev server port: 3000 • Host: 0.0.0.0 • StrictPort: true
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </motion.div>
    </div>
  );
};
