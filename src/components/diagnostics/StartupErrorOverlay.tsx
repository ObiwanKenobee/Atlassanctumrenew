import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  ShieldAlert, 
  ExternalLink, 
  Database, 
  Key, 
  Wifi, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Sparkles,
  RotateCcw,
  SendHorizontal
} from 'lucide-react';
import { 
  StartupDiagnosticReport, 
  runStartupDiagnostics, 
  subscribeStartupDiagnostics, 
  DiagnosticIssue,
  softResetDiagnostics 
} from '../../lib/startupDiagnostics';
import { logForwardingService, ForwardedReportReceipt } from '../../lib/logForwardingService';

interface StartupErrorOverlayProps {
  onDismiss?: () => void;
}

export const StartupErrorOverlay: React.FC<StartupErrorOverlayProps> = ({ onDismiss }) => {
  const [report, setReport] = useState<StartupDiagnosticReport | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isSoftResetting, setIsSoftResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [observabilityReceipt, setObservabilityReceipt] = useState<ForwardedReportReceipt | null>(
    logForwardingService.getLastReceipt()
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasManuallyDismissed, setHasManuallyDismissed] = useState(false);

  useEffect(() => {
    // Subscribe to diagnostic updates
    const unsubscribeDiag = subscribeStartupDiagnostics((newReport) => {
      setReport(newReport);
      // Automatically open if critical (unless previously dismissed)
      if (newReport.status === 'critical' && !hasManuallyDismissed) {
        setIsOpen(true);
      }
    });

    // Subscribe to observability log forwarding events
    const unsubscribeLogs = logForwardingService.subscribe((receipt) => {
      setObservabilityReceipt(receipt);
    });

    // Run diagnostics immediately on mount
    runStartupDiagnostics().then((initialReport) => {
      setReport(initialReport);
      if (initialReport.status === 'critical' && !hasManuallyDismissed) {
        setIsOpen(true);
      }
    });

    return () => {
      unsubscribeDiag();
      unsubscribeLogs();
    };
  }, [hasManuallyDismissed]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setResetNotice(null);
    try {
      const refreshed = await runStartupDiagnostics(true);
      setReport(refreshed);
      if (refreshed.status === 'healthy') {
        setTimeout(() => setIsOpen(false), 800);
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleSoftReset = async () => {
    setIsSoftResetting(true);
    setResetNotice('Purging local client caches & executing exponential backoff healthcheck...');
    try {
      const freshReport = await softResetDiagnostics();
      setReport(freshReport);

      if (freshReport.status === 'healthy') {
        setResetNotice('✓ Soft Reset successful: Cache purged and Express backend re-verified.');
        setTimeout(() => {
          setIsOpen(false);
          setResetNotice(null);
        }, 1200);
      } else if (freshReport.status === 'critical') {
        // Forward crash data to observability endpoint
        const receipt = await logForwardingService.forwardCrashReport('soft_reset_critical_failure', freshReport);
        setObservabilityReceipt(receipt);
        setResetNotice(`Cache purged. Backend state still critical — Telemetry forwarded to observability (${receipt.reportId}).`);
      } else {
        setResetNotice('Cache purged. Client operating in resilient offline/degraded mode.');
      }
    } catch (err: any) {
      setResetNotice(`Soft reset encountered an issue: ${err?.message || err}`);
    } finally {
      setIsSoftResetting(false);
    }
  };

  const handleDismiss = () => {
    setHasManuallyDismissed(true);
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  // If everything is healthy and user hasn't explicitly opened it, don't show intrusive overlay
  if (!report || (report.status === 'healthy' && !isOpen)) {
    return null;
  }

  // If there are warnings/issues or critical state, display either a minimized badge or full modal
  if (!isOpen) {
    if (report.status === 'degraded' || report.status === 'critical') {
      return (
        <aside 
          aria-label="System Diagnostics Notification"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-[#121212]/95 border border-[#C5A059]/40 text-[#F5F5F0] px-3 py-2 rounded-lg shadow-xl backdrop-blur-md text-xs font-mono"
        >
          <div className="flex items-center gap-1.5">
            {report.status === 'critical' ? (
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
            )}
            <span>
              Diagnostics: <span className={report.status === 'critical' ? 'text-red-400 font-bold' : 'text-[#C5A059]'}>
                {report.issues.length} {report.issues.length === 1 ? 'Notice' : 'Notices'}
              </span>
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="ml-2 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/30 transition-colors"
          >
            Review
          </button>
        </aside>
      );
    }
    return null;
  }

  const isCritical = report.status === 'critical';

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostics-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[#0E0E0E] border border-[#262626] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isCritical ? 'border-red-500/30 bg-red-950/20' : 'border-[#C5A059]/30 bg-[#C5A059]/10'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-[#C5A059]/20 text-[#C5A059]'}`}>
              {isCritical ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <h2 id="diagnostics-modal-title" className="text-base font-semibold text-[#F5F5F0] tracking-wide flex items-center gap-2">
                Atlas Sanctum Startup Diagnostics
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                  isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {report.status}
                </span>
              </h2>
              <p className="text-xs text-[#8A8A85] font-mono mt-0.5">
                Latency: {report.latencyMs}ms • Timestamp: {new Date(report.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="header-soft-reset-btn"
              onClick={handleSoftReset}
              disabled={isSoftResetting || isRetrying}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#251A10] hover:bg-[#382615] border border-[#C5A059]/40 text-xs text-[#C5A059] rounded-md transition-colors font-mono disabled:opacity-50"
              title="Clear cache and re-attempt API healthcheck with exponential backoff"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSoftResetting ? 'animate-spin text-[#C5A059]' : ''}`} />
              <span>{isSoftResetting ? 'Resetting...' : 'Soft Reset'}</span>
            </button>
            <button
              onClick={handleRetry}
              disabled={isRetrying || isSoftResetting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-xs text-[#F5F5F0] rounded-md transition-colors font-mono disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin text-[#C5A059]' : ''}`} />
              <span>Retry</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-[#8A8A85] hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-md transition-colors"
              title="Dismiss overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Status Badges / Observability & Backoff Telemetry */}
        {(resetNotice || report.backoffStatus?.isRecovering || observabilityReceipt) && (
          <div className="px-6 py-2.5 bg-[#0A0A0A] border-b border-[#222] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {resetNotice ? (
              <div className="flex items-center gap-2 text-[#C5A059] animate-pulse">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{resetNotice}</span>
              </div>
            ) : report.backoffStatus?.isRecovering ? (
              <div className="flex items-center gap-2 text-cyan-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>
                  Autonomous Backoff Active: Attempt #{report.backoffStatus.recoveryAttempts} 
                  {report.backoffStatus.nextRetryDelayMs ? ` (next retry in ~${Math.round(report.backoffStatus.nextRetryDelayMs / 1000)}s)` : ''}
                </span>
              </div>
            ) : (
              <div className="text-[#8A8A85]">
                Self-healing runtime monitor active
              </div>
            )}

            {observabilityReceipt && (
              <div className="flex items-center gap-2 bg-[#161616] px-2.5 py-1 rounded border border-[#2E2E2E]">
                <span className={`w-2 h-2 rounded-full ${observabilityReceipt.status === 'forwarded' ? 'bg-emerald-400' : 'bg-yellow-400'} animate-pulse`} />
                <span className="text-[#8A8A85] text-[11px]">Observability:</span>
                <span className="text-[#C5A059] text-[11px] font-semibold">{observabilityReceipt.reportId}</span>
              </div>
            )}
          </div>
        )}

        {/* Subsystem Quick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#141414] border-b border-[#222] text-xs font-mono">
          <div className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded border border-[#262626]">
            <Database className="w-4 h-4 text-[#8A8A85]" />
            <div className="truncate">
              <div className="text-[10px] text-[#8A8A85]">Firestore</div>
              <div className={report.checks.firebaseConnected ? 'text-green-400 flex items-center gap-1' : 'text-yellow-400 flex items-center gap-1'}>
                {report.checks.firebaseConnected ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {report.checks.firebaseConnected ? 'Connected' : 'Offline/Cache'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded border border-[#262626]">
            <Cpu className="w-4 h-4 text-[#8A8A85]" />
            <div className="truncate">
              <div className="text-[10px] text-[#8A8A85]">Backend API</div>
              <div className={report.checks.backendReachable ? 'text-green-400 flex items-center gap-1' : 'text-red-400 flex items-center gap-1'}>
                {report.checks.backendReachable ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {report.checks.backendReachable ? 'Healthy' : 'Unreachable'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded border border-[#262626]">
            <Key className="w-4 h-4 text-[#8A8A85]" />
            <div className="truncate">
              <div className="text-[10px] text-[#8A8A85]">Gemini AI</div>
              <div className={report.checks.geminiKeyConfigured ? 'text-green-400 flex items-center gap-1' : 'text-yellow-400 flex items-center gap-1'}>
                {report.checks.geminiKeyConfigured ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {report.checks.geminiKeyConfigured ? 'Configured' : 'Fallback Mode'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded border border-[#262626]">
            <Wifi className="w-4 h-4 text-[#8A8A85]" />
            <div className="truncate">
              <div className="text-[10px] text-[#8A8A85]">Network</div>
              <div className={report.checks.networkOnline ? 'text-green-400 flex items-center gap-1' : 'text-red-400 flex items-center gap-1'}>
                {report.checks.networkOnline ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {report.checks.networkOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Issues List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A0A09B]">
              Detected Issues & Actionable Troubleshooting ({report.issues.length})
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-[#C5A059] flex items-center gap-1 font-mono hover:underline"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-3">
              {report.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-lg border ${
                    issue.severity === 'critical'
                      ? 'bg-red-950/20 border-red-500/30 text-red-200'
                      : 'bg-yellow-950/20 border-yellow-500/30 text-yellow-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {issue.severity === 'critical' ? (
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[#F5F5F0]">{issue.title}</h4>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#000]/40 text-[#C5A059]">
                          {issue.component}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A09B] mt-1 leading-relaxed">{issue.message}</p>
                      <div className="mt-2.5 p-2.5 bg-[#000]/50 rounded border border-white/5 text-xs">
                        <span className="font-semibold text-[#F5F5F0] font-mono">Actionable Step: </span>
                        <span className="text-[#DDD]">{issue.actionableStep}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continuous Platform Development Suggestions */}
          <div className="mt-6 pt-4 border-t border-[#262626]">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center justify-between w-full text-xs font-mono text-[#C5A059] hover:text-[#D5B069] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">Continuous Platform Development Guidance</span>
              </div>
              {showSuggestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSuggestions && (
              <div className="mt-3 space-y-2.5 font-mono">
                {report.developmentSuggestions.map((sugg) => (
                  <div key={sugg.id} className="p-3 bg-[#141414] rounded-lg border border-[#222] text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          sugg.status === 'completed' ? 'bg-green-400' : sugg.status === 'in_progress' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <span className="font-semibold text-[#F5F5F0]">{sugg.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#202020] text-[#A0A09B]">
                          {sugg.category}
                        </span>
                        <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                          sugg.status === 'completed' ? 'bg-green-950/40 text-green-400 border border-green-800/40' :
                          sugg.status === 'in_progress' ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-800/40' :
                          'bg-blue-950/40 text-blue-300 border border-blue-800/40'
                        }`}>
                          {sugg.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#8A8A85] text-[11px] mt-1.5 leading-relaxed">{sugg.description}</p>
                    <div className="mt-2 text-[11px] text-[#C5A059] bg-[#1A1A1A] p-1.5 rounded border border-[#262626]">
                      <span className="text-[#8A8A85]">Process Step: </span>{sugg.actionableStep}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#121212] border-t border-[#222] flex items-center justify-between text-xs font-mono">
          <div className="text-[#8A8A85]">
            Run <code className="text-[#C5A059] bg-[#1A1A1A] px-1 py-0.5 rounded">npm run healthcheck</code> in terminal for CLI verification
          </div>
          <div className="flex items-center gap-2.5">
            <button
              id="footer-soft-reset-btn"
              onClick={handleSoftReset}
              disabled={isSoftResetting || isRetrying}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#251A10] hover:bg-[#382615] border border-[#C5A059]/40 text-[#C5A059] rounded-md transition-colors font-mono disabled:opacity-50"
              title="Purge local client cache and re-probe API with exponential backoff"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSoftResetting ? 'animate-spin' : ''}`} />
              <span>{isSoftResetting ? 'Purging Cache...' : 'Soft Reset'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3.5 py-1.5 bg-[#222] hover:bg-[#2A2A2A] text-[#DDD] rounded-md transition-colors"
            >
              Dismiss & Continue
            </button>
            <button
              onClick={handleRetry}
              disabled={isRetrying || isSoftResetting}
              className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B59049] text-[#0A0A0A] font-semibold rounded-md transition-colors"
            >
              {isRetrying ? 'Retrying...' : 'Re-verify System'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupErrorOverlay;
