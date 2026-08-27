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
  Eye
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
    isMissionTracked
  } = useMissionAlerts();

  const [activeFilter, setActiveFilter] = useState<'all' | 'tracked' | 'milestones' | 'failures' | 'telemetry'>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'tracked') return isMissionTracked(alert.missionId);
    if (activeFilter === 'milestones') return alert.type === 'milestone_verified';
    if (activeFilter === 'failures') return alert.type === 'failure_ledger_entry';
    if (activeFilter === 'telemetry') return alert.type === 'telemetry_anomaly' || alert.type === 'reality_check_warning';
    return true;
  });

  const getSeverityIcon = (type: string, severity: string) => {
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

  const getSeverityBorder = (severity: string) => {
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
        <div className="w-screen max-w-md md:max-w-lg bg-[#0D0D0D] border-l border-[#F5F5F0]/15 text-[#F5F5F0] flex flex-col shadow-2xl relative z-10 animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#080808]">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-lg bg-[#1B3022] border border-[#C5A059]/40 text-[#C5A059]">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
                  Mission Alert Stream
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full">
                      {unreadCount} Unread
                    </span>
                  )}
                </h2>
                <p className="text-[11px] font-mono text-[#F5F5F0]/50">
                  Real-time telemetry, failure audits & milestone proofs
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
                className="p-2 text-[#F5F5F0]/60 hover:text-[#C5A059] hover:bg-[#F5F5F0]/5 rounded-sm transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              </button>

              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setIsDrawerOpen(false);
                }}
                className="p-2 text-[#F5F5F0]/60 hover:text-white hover:bg-[#F5F5F0]/10 rounded-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions & Simulation Toolbar */}
          <div className="px-4 py-2.5 bg-[#121212] border-b border-[#F5F5F0]/10 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] disabled:opacity-40 disabled:hover:bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059]/30 rounded text-[10px] transition-colors whitespace-nowrap"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
              <button
                onClick={clearAlerts}
                disabled={alerts.length === 0}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] hover:bg-rose-950/40 disabled:opacity-40 text-rose-300 border border-rose-500/20 rounded text-[10px] transition-colors whitespace-nowrap"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            {/* Simulation Trigger Dropdown / Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-[#F5F5F0]/40 mr-1 hidden sm:inline">Simulate:</span>
              <button
                onClick={() => simulateTriggerAlert('milestone_verified')}
                title="Simulate Verified Milestone"
                className="px-2 py-0.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-bold"
              >
                + Milestone
              </button>
              <button
                onClick={() => simulateTriggerAlert('failure_ledger_entry')}
                title="Simulate Failure Ledger Entry"
                className="px-2 py-0.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 rounded text-[9px] font-bold"
              >
                + Failure
              </button>
              <button
                onClick={() => simulateTriggerAlert('telemetry_anomaly')}
                title="Simulate Telemetry Warning"
                className="px-2 py-0.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 rounded text-[9px] font-bold"
              >
                + Telemetry
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 bg-[#0A0A0A] border-b border-[#F5F5F0]/10 flex items-center gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:none">
            {[
              { id: 'all', label: 'All Alerts', count: alerts.length },
              { id: 'tracked', label: 'Tracked Missions', count: alerts.filter(a => isMissionTracked(a.missionId)).length },
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
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 ${
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
                <p className="text-sm font-serif text-[#F5F5F0]/60">No alerts found in this view</p>
                <p className="text-xs font-mono text-[#F5F5F0]/40 max-w-xs mx-auto">
                  Click the simulation buttons above to trigger live biophysical proofs and failure audits.
                </p>
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isTracked = isMissionTracked(alert.missionId);
                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-lg border transition-all relative group ${getSeverityBorder(alert.severity)} ${
                      !alert.read ? 'ring-1 ring-[#C5A059]/40' : 'opacity-90'
                    }`}
                  >
                    {/* Top Row: Mission & Status */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getSeverityIcon(alert.type, alert.severity)}
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold truncate">
                          {alert.missionTitle}
                        </span>
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
                    <h3 className="text-xs sm:text-sm font-semibold text-[#F5F5F0] mb-1">
                      {alert.title}
                    </h3>

                    {/* Message Body */}
                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed mb-2.5">
                      {alert.message}
                    </p>

                    {/* Telemetry / Failure metadata if present */}
                    {alert.metadata && (
                      <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-[#F5F5F0]/60 space-y-1 mb-2.5">
                        {alert.metadata.verifiedBy && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#F5F5F0]/40">Auditor:</span>
                            <span className="text-[#F5F5F0]/80 font-medium truncate max-w-[200px]">{alert.metadata.verifiedBy}</span>
                          </div>
                        )}
                        {alert.metadata.anomalyMetric && (
                          <div className="flex items-center justify-between text-amber-300">
                            <span>Anomaly Metric:</span>
                            <span className="font-bold">{alert.metadata.anomalyMetric} ({alert.metadata.reading} vs threshold {alert.metadata.threshold})</span>
                          </div>
                        )}
                        {alert.metadata.certaintyScore && (
                          <div className="flex items-center justify-between text-emerald-400">
                            <span>Certainty Score:</span>
                            <span className="font-bold">{alert.metadata.certaintyScore}%</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10 text-[10px] font-mono">
                      {alert.cryptographicHash ? (
                        <button
                          onClick={() => handleCopyHash(alert.cryptographicHash!)}
                          className="flex items-center gap-1 text-[#F5F5F0]/50 hover:text-[#C5A059] transition-colors"
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
                            className="text-[#F5F5F0]/60 hover:text-[#C5A059] transition-colors text-[9px] uppercase"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleAlertAction(alert)}
                          className="flex items-center gap-1 text-[#C5A059] hover:underline font-bold text-[10px] uppercase tracking-wider"
                        >
                          <span>View Detail</span>
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
          <div className="p-3 bg-[#080808] border-t border-[#F5F5F0]/10 text-[10px] font-mono text-center text-[#F5F5F0]/40">
            Atlas Sanctum Cryptographic Telemetry Mesh • Commandment IX Compliant
          </div>
        </div>
      </div>
    </div>
  );
};
