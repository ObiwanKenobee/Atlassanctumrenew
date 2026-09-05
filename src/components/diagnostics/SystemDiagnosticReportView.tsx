import React, { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, 
  Search, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Bug, 
  RefreshCw, 
  ShieldAlert, 
  Activity,
  FileCode,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { errorLogger, DiagnosticErrorLog } from '../../lib/errorLogger';
import { audioFeedback } from '../../lib/audioFeedback';

interface SystemDiagnosticReportViewProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const SystemDiagnosticReportView: React.FC<SystemDiagnosticReportViewProps> = ({
  onClose,
  isEmbedded = false
}) => {
  const [logs, setLogs] = useState<DiagnosticErrorLog[]>(() => errorLogger.getLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'javascript_error' | 'unhandled_rejection' | 'react_boundary' | 'network_error'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reportExportedToast, setReportExportedToast] = useState<string | null>(null);

  // Subscribe to error updates
  useEffect(() => {
    const unsubscribe = errorLogger.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => unsubscribe();
  }, []);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return errorLogger.search(searchQuery, typeFilter);
  }, [logs, searchQuery, typeFilter]);

  // Aggregate counts
  const stats = useMemo(() => {
    const total = logs.length;
    const jsErrors = logs.filter((l) => l.type === 'javascript_error').length;
    const unhandledRejections = logs.filter((l) => l.type === 'unhandled_rejection').length;
    const reactCrashes = logs.filter((l) => l.type === 'react_boundary').length;
    const network = logs.filter((l) => l.type === 'network_error').length;
    return { total, jsErrors, unhandledRejections, reactCrashes, network };
  }, [logs]);

  const handleCopyLog = (log: DiagnosticErrorLog) => {
    audioFeedback.playMicroTick();
    const text = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    audioFeedback.playSuccess();
    const jsonStr = errorLogger.exportReportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas_system_diagnostic_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setReportExportedToast('Diagnostic Report downloaded as JSON');
    setTimeout(() => setReportExportedToast(null), 3500);
  };

  const handleCopyFullReport = () => {
    audioFeedback.playSubtleClick();
    const jsonStr = errorLogger.exportReportJSON();
    navigator.clipboard.writeText(jsonStr);
    setReportExportedToast('Full diagnostic report copied to clipboard');
    setTimeout(() => setReportExportedToast(null), 3500);
  };

  const handleClearLogs = () => {
    audioFeedback.playSubtleClick();
    errorLogger.clearLogs();
    setReportExportedToast('Diagnostic error logs cleared');
    setTimeout(() => setReportExportedToast(null), 2500);
  };

  const handleSimulateError = (type: 'js' | 'rejection') => {
    audioFeedback.playSubtleClick();
    errorLogger.simulateTestError(type);
    setReportExportedToast(`Injected synthetic ${type === 'js' ? 'JavaScript TypeError' : 'Unhandled Promise Rejection'}`);
    setTimeout(() => setReportExportedToast(null), 3000);
  };

  const getTypeBadge = (type: DiagnosticErrorLog['type']) => {
    switch (type) {
      case 'javascript_error':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Bug className="w-2.5 h-2.5 text-rose-400" />
            JS Exception
          </span>
        );
      case 'unhandled_rejection':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 text-amber-400" />
            Unhandled Rejection
          </span>
        );
      case 'react_boundary':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5 text-purple-400" />
            React Boundary
          </span>
        );
      case 'network_error':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-cyan-400" />
            Network
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            Probe / Telemetry
          </span>
        );
    }
  };

  return (
    <div className={`space-y-4 font-mono text-xs text-[#F5F5F0] ${isEmbedded ? '' : 'p-4 sm:p-6 bg-[#0A0A0A] rounded-xl border border-white/10'}`}>
      {/* Toast notification */}
      {reportExportedToast && (
        <div className="p-2.5 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{reportExportedToast}</span>
          </div>
          <button 
            onClick={() => setReportExportedToast(null)}
            className="text-emerald-400 hover:text-white p-0.5 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Header & Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                System Diagnostic Report
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#181818] text-[#C5A059] border border-[#C5A059]/40 font-bold">
                Developer Engine
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
              Live aggregation of runtime JavaScript errors, unhandled promise rejections, and component crash telemetry.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => handleSimulateError('js')}
            className="px-2.5 py-1.5 rounded-lg bg-[#141A15] hover:bg-[#1E2A20] text-amber-300 border border-amber-500/30 hover:border-amber-400 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Inject simulated JavaScript TypeError to verify capture"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Test JS Error</span>
          </button>
          <button
            onClick={() => handleSimulateError('rejection')}
            className="px-2.5 py-1.5 rounded-lg bg-[#141A15] hover:bg-[#1E2A20] text-rose-300 border border-rose-500/30 hover:border-rose-400 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Inject simulated unhandled Promise rejection"
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Test Rejection</span>
          </button>
          <button
            onClick={handleCopyFullReport}
            className="px-2.5 py-1.5 rounded-lg bg-[#181818] hover:bg-[#252525] text-neutral-300 hover:text-white border border-white/10 text-[10px] flex items-center gap-1.5 cursor-pointer transition-all"
            title="Copy entire JSON report to clipboard"
          >
            <Copy className="w-3 h-3 text-[#C5A059]" />
            <span className="hidden xs:inline">Copy Report</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-2.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#D4B26F] text-black font-extrabold text-[10px] flex items-center gap-1.5 cursor-pointer shadow transition-all"
            title="Download full diagnostic report as JSON"
          >
            <Download className="w-3 h-3 text-black" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            className="p-1.5 rounded-lg bg-[#181818] hover:bg-rose-950/60 text-neutral-400 hover:text-rose-300 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Clear diagnostic log history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-lg bg-[#0E0E0E] border border-white/10">
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans">Total Events</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{stats.total}</span>
          <span className="text-[8px] text-neutral-400">Captured in session</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0E0E0E] border border-rose-500/20">
          <span className="text-[9px] uppercase tracking-wider text-rose-400 block font-sans">JS Exceptions</span>
          <span className="text-lg font-bold text-rose-300 mt-0.5 block">{stats.jsErrors}</span>
          <span className="text-[8px] text-neutral-400">Runtime throw/type errors</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0E0E0E] border border-amber-500/20">
          <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-sans">Rejections</span>
          <span className="text-lg font-bold text-amber-300 mt-0.5 block">{stats.unhandledRejections}</span>
          <span className="text-[8px] text-neutral-400">Async promise failures</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0E0E0E] border border-purple-500/20">
          <span className="text-[9px] uppercase tracking-wider text-purple-400 block font-sans">React Boundaries</span>
          <span className="text-lg font-bold text-purple-300 mt-0.5 block">{stats.reactCrashes}</span>
          <span className="text-[8px] text-neutral-400">Render lifecycle crashes</span>
        </div>
      </div>

      {/* Search Bar and Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-[#0D0D0D] p-2.5 rounded-lg border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search error messages, files, stack frames, timestamps..."
            className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 focus:border-[#C5A059] rounded text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[9px] shrink-0 py-0.5 [&::-webkit-scrollbar]:none">
          <button
            onClick={() => {
              setTypeFilter('all');
              audioFeedback.playMicroTick();
            }}
            className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#C5A059] text-black font-extrabold'
                : 'text-neutral-400 hover:text-white bg-black/40 border border-white/5'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => {
              setTypeFilter('javascript_error');
              audioFeedback.playMicroTick();
            }}
            className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
              typeFilter === 'javascript_error'
                ? 'bg-rose-500 text-black font-extrabold'
                : 'text-rose-400 hover:text-white bg-black/40 border border-white/5'
            }`}
          >
            JS ({stats.jsErrors})
          </button>
          <button
            onClick={() => {
              setTypeFilter('unhandled_rejection');
              audioFeedback.playMicroTick();
            }}
            className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
              typeFilter === 'unhandled_rejection'
                ? 'bg-amber-500 text-black font-extrabold'
                : 'text-amber-400 hover:text-white bg-black/40 border border-white/5'
            }`}
          >
            Rejections ({stats.unhandledRejections})
          </button>
          <button
            onClick={() => {
              setTypeFilter('react_boundary');
              audioFeedback.playMicroTick();
            }}
            className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
              typeFilter === 'react_boundary'
                ? 'bg-purple-500 text-black font-extrabold'
                : 'text-purple-400 hover:text-white bg-black/40 border border-white/5'
            }`}
          >
            React ({stats.reactCrashes})
          </button>
        </div>
      </div>

      {/* Error Log Entries List */}
      <div className="space-y-2 max-h-[50vh] sm:max-h-[55vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#C5A059]/30">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-[#090909] border border-white/5 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
            <p className="text-sm font-serif font-bold text-white">No Diagnostic Issues Found</p>
            <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto">
              {searchQuery
                ? `No errors match query "${searchQuery}". Try clearing search filters.`
                : 'System execution baseline is pristine. No uncaught exceptions or unhandled promise rejections detected.'}
            </p>
            <button
              onClick={() => handleSimulateError('js')}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#141A15] hover:bg-[#1E2A20] text-amber-300 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Trigger Synthetic Probe</span>
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            const isCopied = copiedId === log.id;

            return (
              <div
                key={log.id}
                className={`rounded-xl border transition-all ${
                  log.type === 'javascript_error'
                    ? 'bg-gradient-to-r from-rose-950/30 via-[#10090A] to-[#0A0A0A] border-rose-500/30 hover:border-rose-500/60'
                    : log.type === 'unhandled_rejection'
                    ? 'bg-gradient-to-r from-amber-950/30 via-[#120D08] to-[#0A0A0A] border-amber-500/30 hover:border-amber-500/60'
                    : log.type === 'react_boundary'
                    ? 'bg-gradient-to-r from-purple-950/30 via-[#110A14] to-[#0A0A0A] border-purple-500/30 hover:border-purple-500/60'
                    : 'bg-[#0E0E0E] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Log Header Row */}
                <div
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setExpandedLogId(isExpanded ? null : log.id);
                  }}
                  className="p-3 sm:p-3.5 flex items-start justify-between gap-2.5 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="mt-0.5 shrink-0 text-neutral-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-[#C5A059]" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(log.type)}
                        <span className="text-[10px] text-neutral-400 font-mono">{log.timestamp}</span>
                        {log.source && (
                          <span className="text-[9px] text-neutral-400 flex items-center gap-1 font-mono truncate max-w-[200px] sm:max-w-xs">
                            <FileCode className="w-3 h-3 text-neutral-400 shrink-0" />
                            {log.source}{log.lineno ? `:${log.lineno}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-mono font-semibold text-white mt-1 break-words line-clamp-2">
                        {log.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLog(log);
                      }}
                      className="p-1.5 rounded-lg bg-black/50 hover:bg-black text-neutral-400 hover:text-white border border-white/10 text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                      title="Copy error details to clipboard"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Stack Frame & Diagnostics */}
                {isExpanded && (
                  <div className="p-3 sm:p-4 border-t border-white/10 bg-black/60 space-y-3 font-mono text-[11px] animate-in fade-in duration-150">
                    {/* Source & Line Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] p-2.5 rounded bg-black/80 border border-white/5">
                      <div>
                        <span className="text-neutral-400 block uppercase text-[9px]">Source Location:</span>
                        <span className="text-white font-mono break-all">{log.source || 'inline script'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block uppercase text-[9px]">Line / Column:</span>
                        <span className="text-amber-300 font-mono">
                          {log.lineno ? `Line ${log.lineno}, Col ${log.colno || 0}` : 'Unknown'}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-neutral-400 block uppercase text-[9px]">Target URL:</span>
                        <span className="text-neutral-300 font-mono break-all">{log.url}</span>
                      </div>
                    </div>

                    {/* Stack Trace */}
                    {log.stack && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 font-bold uppercase">Call Stack Trace:</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(log.stack || '');
                              setCopiedId(`${log.id}-stack`);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1 text-[10px]"
                          >
                            {copiedId === `${log.id}-stack` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === `${log.id}-stack` ? 'Copied' : 'Copy Stack'}</span>
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-[#060807] border border-white/10 text-rose-200/90 text-[10px] leading-relaxed overflow-x-auto whitespace-pre font-mono max-h-48 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-rose-500/30">
                          {log.stack}
                        </pre>
                      </div>
                    )}

                    {/* Component Stack (React Boundary) */}
                    {log.componentStack && (
                      <div className="space-y-1">
                        <span className="text-purple-300 font-bold uppercase text-[10px]">React Component Hierarchy:</span>
                        <pre className="p-2.5 rounded-lg bg-[#0A070E] border border-purple-500/20 text-purple-200 text-[10px] leading-relaxed overflow-x-auto whitespace-pre font-mono max-h-36">
                          {log.componentStack}
                        </pre>
                      </div>
                    )}

                    {/* Metadata JSON */}
                    {log.metadata && (
                      <div className="space-y-1">
                        <span className="text-neutral-400 uppercase text-[9px]">Additional Telemetry Context:</span>
                        <pre className="p-2 rounded bg-black/40 border border-white/5 text-neutral-300 text-[10px] overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Instructions */}
      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-neutral-400 font-sans">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#C5A059]" />
          Errors are preserved across page navigations in local session storage for debugging.
        </span>
        <span className="text-[#C5A059] font-mono">
          Command: <code className="bg-black/60 px-1.5 py-0.5 rounded border border-white/10">system-diagnostic-report</code>
        </span>
      </div>
    </div>
  );
};
