import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Check, 
  ExternalLink, 
  ArrowRight,
  Hash,
  Play,
  Filter,
  Eye,
  GitBranch,
  Server,
  Terminal,
  Layers
} from 'lucide-react';
import { useMissionAlerts } from '../context/MissionAlertContext';
import { PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

interface MissionAlertDrawerProps {
  onSelectTab: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const MissionAlertDrawer: React.FC<MissionAlertDrawerProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const {
    alerts,
    unreadCount,
    trackedMissionIds,
    isDrawerOpen,
    soundEnabled,
    setIsDrawerOpen,
    setSoundEnabled,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    simulateTriggerAlert,
    simulateVercelWebhook,
    pollVercelWebhooks,
    isMissionTracked
  } = useMissionAlerts();

  const [activeFilter, setActiveFilter] = useState<'all' | 'tracked' | 'vercel' | 'infrastructure' | 'milestones' | 'failures' | 'telemetry'>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'tracked') return isMissionTracked(alert.missionId);
    if (activeFilter === 'vercel') return alert.type.startsWith('vercel_');
    if (activeFilter === 'infrastructure') return alert.type === 'infrastructure_error' || alert.type === 'environment_failure' || alert.type === 'connectivity_degraded' || alert.type.startsWith('vercel_');
    if (activeFilter === 'milestones') return alert.type === 'milestone_verified';
    if (activeFilter === 'failures') return alert.type === 'failure_ledger_entry';
    if (activeFilter === 'telemetry') return alert.type === 'telemetry_anomaly' || alert.type === 'reality_check_warning';
    return true;
  });

  const getSeverityIcon = (type: string, severity: string) => {
    if (type === 'vercel_build_failed' || type === 'vercel_preview_failed') {
      return <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />;
    }
    if (type === 'vercel_build_succeeded') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (type === 'infrastructure_error') {
      return <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />;
    }
    if (type === 'environment_failure') {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
    if (type === 'connectivity_degraded') {
      return <Radio className="w-4 h-4 text-amber-400" />;
    }
    if (type === 'failure_ledger_entry') {
      return <BookOpen className="w-4 h-4 text-rose-400" />;
    }
    if (type === 'milestone_verified') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (type === 'telemetry_anomaly') {
      return <Radio className="w-4 h-4 text-amber-400 animate-pulse" />;
    }
    if (type === 'stewardship_endorsed') {
      return <ShieldCheck className="w-4 h-4 text-[#C5A059]" />;
    }
    return <Sparkles className="w-4 h-4 text-blue-400" />;
  };

  const getSeverityBorder = (severity: string, type: string) => {
    if (type.startsWith('vercel_build_failed')) {
      return 'border-rose-500/60 bg-rose-950/30';
    }
    switch (severity) {
      case 'critical':
        return 'border-rose-500/40 bg-rose-950/20';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/20';
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/20';
      case 'info':
      default:
        return 'border-[#C5A059]/30 bg-[#0D0D0D]';
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleAlertAction = (alert: any) => {
    markAsRead(alert.id);
    setIsDrawerOpen(false);
    if (alert.targetView) {
      onSelectTab(alert.targetView);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="absolute inset-0"
        onClick={() => {
          audioFeedback.playSubtleClick();
          setIsDrawerOpen(false);
        }} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-xl bg-[#0D0D0D] border-l border-[#F5F5F0]/15 text-[#F5F5F0] flex flex-col shadow-2xl relative z-10 animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#080808]">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-lg bg-[#1B3022] border border-[#C5A059]/40 text-[#C5A059]">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono shadow-[0_0_6px_#F43F5E]">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
                  Mission Alert & Webhook Stream
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full">
                      {unreadCount} Unread
                    </span>
                  )}
                </h2>
                <p className="text-[11px] font-mono text-[#F5F5F0]/50">
                  Vercel build events, telemetry anomalies & failure audits
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  audioFeedback.playSubtleClick();
                }}
                title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
                className="p-2 text-[#F5F5F0]/60 hover:text-[#C5A059] hover:bg-[#F5F5F0]/5 rounded-sm transition-colors cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              </button>

              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setIsDrawerOpen(false);
                }}
                className="p-2 text-[#F5F5F0]/60 hover:text-white hover:bg-[#F5F5F0]/10 rounded-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions & Simulation Toolbar */}
          <div className="px-4 py-2.5 bg-[#121212] border-b border-[#F5F5F0]/10 flex flex-col gap-2 text-[11px] font-mono">
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] disabled:opacity-40 disabled:hover:bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059]/30 rounded text-[10px] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
                <button
                  onClick={clearAlerts}
                  disabled={alerts.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] hover:bg-rose-950/40 disabled:opacity-40 text-rose-300 border border-rose-500/20 rounded text-[10px] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>

              {/* Vercel Webhook Simulation Triggers */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold mr-0.5">Vercel:</span>
                <button
                  onClick={() => simulateVercelWebhook('deployment.error', 'production', 'Build failed: [vite]: Rollup manual chunking failed on lazy module')}
                  title="Simulate Vercel Production Build Failure Webhook"
                  className="px-2 py-0.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/50 rounded text-[9px] font-bold cursor-pointer"
                >
                  ⚡ Fail (Prod)
                </button>
                <button
                  onClick={() => simulateVercelWebhook('deployment.error', 'preview', 'Edge Function memory limit exceeded (128MB)')}
                  title="Simulate Vercel Preview Build Failure Webhook"
                  className="px-2 py-0.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-500/50 rounded text-[9px] font-bold cursor-pointer"
                >
                  ⚡ Fail (Prev)
                </button>
                <button
                  onClick={() => simulateVercelWebhook('deployment.succeeded', 'production')}
                  title="Simulate Vercel Deployment Succeeded Webhook"
                  className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/50 rounded text-[9px] font-bold cursor-pointer"
                >
                  ⚡ Pass
                </button>
              </div>
            </div>

            {/* Sub-toolbar with biophysical simulations */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[9px] text-[#F5F5F0]/50 pt-1 border-t border-[#F5F5F0]/5">
              <span className="uppercase tracking-widest shrink-0">Telemetry:</span>
              <button
                onClick={() => simulateTriggerAlert('milestone_verified')}
                className="hover:text-emerald-400 transition-colors px-1.5 py-0.5 bg-black/40 rounded border border-white/5 cursor-pointer"
              >
                + Milestone
              </button>
              <button
                onClick={() => simulateTriggerAlert('failure_ledger_entry')}
                className="hover:text-rose-400 transition-colors px-1.5 py-0.5 bg-black/40 rounded border border-white/5 cursor-pointer"
              >
                + Failure Ledger
              </button>
              <button
                onClick={() => simulateTriggerAlert('telemetry_anomaly')}
                className="hover:text-amber-400 transition-colors px-1.5 py-0.5 bg-black/40 rounded border border-white/5 cursor-pointer"
              >
                + Anomaly
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 bg-[#0A0A0A] border-b border-[#F5F5F0]/10 flex items-center gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:none">
            {[
              { id: 'all', label: 'All Alerts', count: alerts.length },
              { id: 'vercel', label: 'Vercel CI/CD', count: alerts.filter(a => a.type.startsWith('vercel_')).length },
              { id: 'infrastructure', label: 'Infrastructure', count: alerts.filter(a => a.type === 'infrastructure_error' || a.type === 'environment_failure' || a.type === 'connectivity_degraded' || a.type.startsWith('vercel_')).length },
              { id: 'tracked', label: 'Tracked', count: alerts.filter(a => isMissionTracked(a.missionId)).length },
              { id: 'milestones', label: 'Milestones', count: alerts.filter(a => a.type === 'milestone_verified').length },
              { id: 'failures', label: 'Failures', count: alerts.filter(a => a.type === 'failure_ledger_entry').length },
              { id: 'telemetry', label: 'Telemetry', count: alerts.filter(a => a.type === 'telemetry_anomaly').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setActiveFilter(tab.id as any);
                }}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'bg-[#151515] text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#202020]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1 rounded-full ${
                  activeFilter === tab.id ? 'bg-black/20 text-black' : 'bg-[#252525] text-[#F5F5F0]/60'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#151515] border border-[#F5F5F0]/10 flex items-center justify-center mx-auto text-[#F5F5F0]/40">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-serif text-[#F5F5F0]/60">No alerts found in this filter</p>
                <p className="text-xs font-mono text-[#F5F5F0]/40 max-w-xs mx-auto">
                  Click the Vercel webhook buttons above to test live CI/CD alert dispatching and failure auditing.
                </p>
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isTracked = isMissionTracked(alert.missionId);
                const isVercelEvent = alert.type.startsWith('vercel_');

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-lg border transition-all relative group ${getSeverityBorder(alert.severity, alert.type)} ${
                      !alert.read ? 'ring-1 ring-[#C5A059]/40' : 'opacity-90'
                    }`}
                  >
                    {/* Top Row: Mission & Status */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                        {getSeverityIcon(alert.type, alert.severity)}
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold truncate">
                          {alert.missionTitle}
                        </span>
                        {isVercelEvent && (
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 uppercase rounded ${
                            alert.metadata?.targetEnvironment === 'production' 
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40' 
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            {alert.metadata?.targetEnvironment || 'Vercel Webhook'}
                          </span>
                        )}
                        {isTracked && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 bg-[#1B3022] text-emerald-400 border border-emerald-500/30 rounded">
                            Tracked
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-[#F5F5F0]/40 shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-semibold text-[#F5F5F0] mb-1 font-serif">
                      {alert.title}
                    </h3>

                    {/* Message Body */}
                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed mb-2.5">
                      {alert.message}
                    </p>

                    {/* Telemetry / Vercel / Failure metadata */}
                    {alert.metadata && (
                      <div className="p-2.5 rounded bg-black/50 border border-white/5 text-[10px] font-mono text-[#F5F5F0]/70 space-y-1.5 mb-2.5">
                        {alert.metadata.branch && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#F5F5F0]/40 flex items-center gap-1">
                              <GitBranch className="w-3 h-3 text-purple-400" />
                              Branch:
                            </span>
                            <span className="text-purple-300 font-bold">{alert.metadata.branch}</span>
                          </div>
                        )}
                        {alert.metadata.commitMessage && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#F5F5F0]/40">Commit:</span>
                            <span className="text-[#F5F5F0]/90 italic truncate max-w-[220px]">
                              "{alert.metadata.commitMessage}"
                            </span>
                          </div>
                        )}
                        {alert.metadata.errorMessage && (
                          <div className="p-1.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[9px] font-mono flex items-start gap-1.5">
                            <Terminal className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                            <span className="break-all">{alert.metadata.errorMessage}</span>
                          </div>
                        )}
                        {alert.metadata.anomalyMetric && (
                          <div className="flex items-center justify-between text-amber-300">
                            <span>Anomaly Metric:</span>
                            <span className="font-bold">{alert.metadata.anomalyMetric} ({alert.metadata.reading} vs threshold {alert.metadata.threshold})</span>
                          </div>
                        )}
                        {alert.metadata.remediation && (
                          <div className="text-[9px] text-[#C5A059] border-t border-white/5 pt-1 mt-1">
                            💡 Remediation: {alert.metadata.remediation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10 text-[10px] font-mono">
                      {alert.cryptographicHash ? (
                        <button
                          onClick={() => handleCopyHash(alert.cryptographicHash!)}
                          className="flex items-center gap-1 text-[#F5F5F0]/50 hover:text-[#C5A059] transition-colors cursor-pointer"
                          title="Click to copy verification hash"
                        >
                          <Hash className="w-3 h-3 text-[#C5A059]" />
                          <span>{alert.cryptographicHash.substring(0, 10)}...</span>
                          {copiedHash === alert.cryptographicHash && (
                            <span className="text-emerald-400 font-bold ml-1">Copied!</span>
                          )}
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-2">
                        {!alert.read && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="text-[#F5F5F0]/60 hover:text-[#C5A059] transition-colors text-[9px] uppercase cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleAlertAction(alert)}
                          className="flex items-center gap-1 text-[#C5A059] hover:underline font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          <span>{isVercelEvent ? 'Inspect Logs' : 'View Detail'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#080808] border-t border-[#F5F5F0]/10 text-[10px] font-mono text-center text-[#F5F5F0]/40 flex items-center justify-center gap-2">
            <span>Atlas Sanctum Cryptographic Telemetry Mesh</span>
            <span>•</span>
            <span className="text-emerald-400/70">Vercel Webhook Subscribed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
