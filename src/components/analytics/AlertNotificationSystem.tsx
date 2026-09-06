import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Play,
  Volume2,
  Flame,
  Zap,
  Droplets,
  Radio,
  Users,
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

export type AlertMetricKey =
  | 'computeKWh'
  | 'greenSolarKWh'
  | 'waterExtractionM3'
  | 'waterRechargeM3'
  | 'latencyMs'
  | 'packetRateKBs'
  | 'stewards';

export type AlertComparator = 'gt' | 'lt';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface MetricAlertRule {
  id: string;
  name: string;
  metric: AlertMetricKey;
  comparator: AlertComparator;
  threshold: number;
  unit: string;
  severity: AlertSeverity;
  browserNotification: boolean;
  internalMissionAlert: boolean;
  isEnabled: boolean;
  lastTriggered?: string;
  description?: string;
}

export interface TriggeredMissionAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  metric: AlertMetricKey;
  currentValue: number;
  threshold: number;
  comparator: AlertComparator;
  severity: AlertSeverity;
  timestamp: string;
  message: string;
  acknowledged: boolean;
}

export const AVAILABLE_ALERT_METRICS: Array<{
  key: AlertMetricKey;
  label: string;
  unit: string;
  defaultThreshold: number;
  defaultComparator: AlertComparator;
  category: string;
}> = [
  { key: 'computeKWh', label: 'Compute Power Consumption', unit: 'kWh', defaultThreshold: 5000, defaultComparator: 'gt', category: 'Energy & Compute' },
  { key: 'greenSolarKWh', label: 'Renewable Solar Generation', unit: 'kWh', defaultThreshold: 5500, defaultComparator: 'lt', category: 'Energy & Compute' },
  { key: 'latencyMs', label: 'IoT Network p95 Latency', unit: 'ms', defaultThreshold: 40, defaultComparator: 'gt', category: 'Sensor Mesh' },
  { key: 'packetRateKBs', label: 'Telemetry Packet Ingress', unit: 'KB/s', defaultThreshold: 650, defaultComparator: 'lt', category: 'Sensor Mesh' },
  { key: 'waterExtractionM3', label: 'Aquifer Water Extraction', unit: 'm³', defaultThreshold: 1800, defaultComparator: 'gt', category: 'Biophysical Resources' },
  { key: 'waterRechargeM3', label: 'Catchment Water Recharge', unit: 'm³', defaultThreshold: 3000, defaultComparator: 'lt', category: 'Biophysical Resources' },
  { key: 'stewards', label: 'Active Steward Mobilization', unit: 'stewards', defaultThreshold: 4500, defaultComparator: 'lt', category: 'Human Operations' },
];

export const DEFAULT_ALERT_RULES: MetricAlertRule[] = [
  {
    id: 'alert-compute-high',
    name: 'Compute Consumption Spike',
    metric: 'computeKWh',
    comparator: 'gt',
    threshold: 5200,
    unit: 'kWh',
    severity: 'warning',
    browserNotification: true,
    internalMissionAlert: true,
    isEnabled: true,
    description: 'Alerts operations when server & ZKP cryptographic prover loads exceed threshold.'
  },
  {
    id: 'alert-latency-spike',
    name: 'IoT Telemetry Latency Degradation',
    metric: 'latencyMs',
    comparator: 'gt',
    threshold: 41,
    unit: 'ms',
    severity: 'critical',
    browserNotification: true,
    internalMissionAlert: true,
    isEnabled: true,
    description: 'Triggers when mesh gateway transceivers experience high packet congestion.'
  },
  {
    id: 'alert-extraction-limit',
    name: 'Aquifer Safe Yield Ceiling',
    metric: 'waterExtractionM3',
    comparator: 'gt',
    threshold: 1850,
    unit: 'm³',
    severity: 'critical',
    browserNotification: false,
    internalMissionAlert: true,
    isEnabled: true,
    description: 'Guards against local watershed overdraft exceeding regenerative recharge velocity.'
  }
];

interface AlertManagerProps {
  isOpen: boolean;
  onClose: () => void;
  rules: MetricAlertRule[];
  onSaveRules: (rules: MetricAlertRule[]) => void;
  triggeredAlerts: TriggeredMissionAlert[];
  onDismissAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  onTestTriggerAlert: (rule: MetricAlertRule) => void;
  onShowToast: (msg: string) => void;
}

export const AlertManagerModal: React.FC<AlertManagerProps> = ({
  isOpen,
  onClose,
  rules,
  onSaveRules,
  triggeredAlerts,
  onDismissAlert,
  onClearAllAlerts,
  onTestTriggerAlert,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'history' | 'new'>('rules');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  // New Rule Form State
  const [newRule, setNewRule] = useState<{
    name: string;
    metric: AlertMetricKey;
    comparator: AlertComparator;
    threshold: number;
    severity: AlertSeverity;
    browserNotification: boolean;
    internalMissionAlert: boolean;
    description: string;
  }>({
    name: '',
    metric: 'computeKWh',
    comparator: 'gt',
    threshold: 5200,
    severity: 'warning',
    browserNotification: true,
    internalMissionAlert: true,
    description: ''
  });

  const handleRequestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      onShowToast('Browser notifications are not supported in this browser/container');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission === 'granted') {
        hapticFeedback.triggerSuccessHaptic();
        audioFeedback.playSuccess();
        onShowToast('Browser push notifications authorized for Mission Alerts!');
        try {
          new Notification('Atlas Sanctum Operational HUD', {
            body: 'Mission Alerts push notifications successfully enabled.',
            icon: '/favicon.ico'
          });
        } catch {
          // ignore
        }
      } else {
        onShowToast('Browser push notifications were blocked or dismissed.');
      }
    } catch {
      onShowToast('Could not request notification permissions.');
    }
  };

  const handleToggleRule = (id: string) => {
    hapticFeedback.triggerLightClickHaptic();
    const updated = rules.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r);
    onSaveRules(updated);
  };

  const handleDeleteRule = (id: string) => {
    hapticFeedback.triggerWarningHaptic();
    const updated = rules.filter(r => r.id !== id);
    onSaveRules(updated);
    onShowToast('Alert rule deleted');
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name.trim()) {
      onShowToast('Please provide an alert name');
      return;
    }

    const metricConfig = AVAILABLE_ALERT_METRICS.find(m => m.key === newRule.metric);
    const rule: MetricAlertRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name.trim(),
      metric: newRule.metric,
      comparator: newRule.comparator,
      threshold: Number(newRule.threshold),
      unit: metricConfig?.unit || '',
      severity: newRule.severity,
      browserNotification: newRule.browserNotification,
      internalMissionAlert: newRule.internalMissionAlert,
      isEnabled: true,
      description: newRule.description.trim() || `Triggers when ${newRule.metric} ${newRule.comparator === 'gt' ? 'exceeds' : 'drops below'} ${newRule.threshold} ${metricConfig?.unit || ''}`
    };

    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playSuccess();
    onSaveRules([rule, ...rules]);
    onShowToast(`Created alert: "${rule.name}"`);
    setActiveTab('rules');
    setNewRule({
      name: '',
      metric: 'computeKWh',
      comparator: 'gt',
      threshold: 5200,
      severity: 'warning',
      browserNotification: true,
      internalMissionAlert: true,
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#090F0B] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-[#F5F5F0] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#060B08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">
                  Mission Threshold Alert System
                </h3>
                {triggeredAlerts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/40 animate-pulse">
                    {triggeredAlerts.length} Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Define automated triggers on energy, telemetry, aquifer yields, and steward quotas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar & Browser Notification Status */}
        <div className="px-5 py-3 border-b border-white/10 bg-[#070D09] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rules' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-500/40' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Rules ({rules.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-500/40' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Trigger Log ({triggeredAlerts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'new' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-500/40' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Trigger</span>
            </button>
          </div>

          {/* Browser Permission Chip */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">Browser Push:</span>
            {browserPermission === 'granted' ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Enabled
              </span>
            ) : (
              <button
                onClick={handleRequestBrowserPermission}
                className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                title="Enable OS/browser notifications"
              >
                <span>Authorize Push</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: RULES LIST */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              {rules.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 font-mono text-xs space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500/50 mx-auto" />
                  <p>No alert rules defined yet.</p>
                  <button
                    onClick={() => setActiveTab('new')}
                    className="px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer"
                  >
                    Create First Alert Trigger
                  </button>
                </div>
              ) : (
                rules.map(rule => {
                  const metricMeta = AVAILABLE_ALERT_METRICS.find(m => m.key === rule.metric);
                  return (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-xl border transition-all ${
                        rule.isEnabled
                          ? 'bg-[#0B140E] border-white/15'
                          : 'bg-[#070A08] border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              rule.severity === 'critical'
                                ? 'bg-red-950 text-red-300 border border-red-500/40'
                                : rule.severity === 'warning'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            }`}>
                              {rule.severity}
                            </span>
                            <span className="font-serif font-bold text-white text-sm">
                              {rule.name}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              ({metricMeta?.label || rule.metric})
                            </span>
                          </div>
                          <div className="text-xs font-mono text-amber-300/90 flex items-center gap-1.5">
                            <span>Trigger Condition:</span>
                            <span className="font-bold text-white">
                              {rule.comparator === 'gt' ? 'Exceeds (>)' : 'Drops Below (<)'} {rule.threshold.toLocaleString()} {rule.unit}
                            </span>
                          </div>
                          {rule.description && (
                            <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">
                              {rule.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => onTestTriggerAlert(rule)}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                            title="Simulate firing this alert immediately"
                          >
                            <Play className="w-3 h-3" />
                            <span>Test Fire</span>
                          </button>
                          <button
                            onClick={() => handleToggleRule(rule.id)}
                            className={`px-3 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                              rule.isEnabled
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-neutral-800 text-neutral-400 border border-white/10'
                            }`}
                          >
                            {rule.isEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Channels Indicator */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <div className="flex items-center gap-3">
                          <span className={rule.browserNotification ? 'text-emerald-400 flex items-center gap-1' : 'text-neutral-500 line-through'}>
                            • Browser Push {rule.browserNotification && '(Active)'}
                          </span>
                          <span className={rule.internalMissionAlert ? 'text-amber-400 flex items-center gap-1' : 'text-neutral-500 line-through'}>
                            • Mission Alert Banner {rule.internalMissionAlert && '(Active)'}
                          </span>
                        </div>
                        {rule.lastTriggered && (
                          <span>Last fired: {new Date(rule.lastTriggered).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: TRIGGER LOG HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-1">
                <span>Recent Threshold Violations & Notifications</span>
                {triggeredAlerts.length > 0 && (
                  <button
                    onClick={onClearAllAlerts}
                    className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {triggeredAlerts.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 font-mono text-xs space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto" />
                  <p>All metrics operating within nominal threshold boundaries.</p>
                  <p className="text-[11px] text-neutral-500">
                    Use &quot;Test Fire&quot; under the Rules tab to test notifications.
                  </p>
                </div>
              ) : (
                triggeredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl bg-[#140D0A] border border-red-500/30 flex items-start justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-500/40">
                          {alert.severity}
                        </span>
                        <span className="font-bold text-white">{alert.ruleName}</span>
                        <span className="text-neutral-500 text-[10px]">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-neutral-300 font-sans text-xs">{alert.message}</p>
                      <div className="text-[10px] text-red-400">
                        Recorded Value: <strong className="text-white">{alert.currentValue.toLocaleString()}</strong> vs Threshold {alert.comparator === 'gt' ? '>' : '<'} {alert.threshold.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      title="Acknowledge & dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CREATE NEW RULE */}
          {activeTab === 'new' && (
            <form onSubmit={handleCreateRule} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Alert Rule Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={newRule.name}
                    onChange={e => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Solar Output Anomaly"
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Target Metric:
                  </label>
                  <select
                    value={newRule.metric}
                    onChange={e => {
                      const key = e.target.value as AlertMetricKey;
                      const meta = AVAILABLE_ALERT_METRICS.find(m => m.key === key);
                      setNewRule(prev => ({
                        ...prev,
                        metric: key,
                        threshold: meta?.defaultThreshold || 5000,
                        comparator: meta?.defaultComparator || 'gt'
                      }));
                    }}
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {AVAILABLE_ALERT_METRICS.map(m => (
                      <option key={m.key} value={m.key}>
                        {m.label} ({m.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Comparator:
                  </label>
                  <select
                    value={newRule.comparator}
                    onChange={e => setNewRule(prev => ({ ...prev, comparator: e.target.value as AlertComparator }))}
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="gt">Greater Than / Exceeds (&gt;)</option>
                    <option value="lt">Less Than / Drops Below (&lt;)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Threshold Value:
                  </label>
                  <input
                    type="number"
                    required
                    value={newRule.threshold}
                    onChange={e => setNewRule(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Severity Level:
                  </label>
                  <select
                    value={newRule.severity}
                    onChange={e => setNewRule(prev => ({ ...prev, severity: e.target.value as AlertSeverity }))}
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="warning">Warning (Amber)</option>
                    <option value="critical">Critical Emergency (Crimson)</option>
                    <option value="info">Informational (Cyan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Alert Description & Context:
                </label>
                <textarea
                  rows={2}
                  value={newRule.description}
                  onChange={e => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain why this threshold is significant and what steward intervention is recommended..."
                  className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Notification Channels */}
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-2">
                <span className="text-neutral-300 font-bold block">Dispatch Channels:</span>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRule.browserNotification}
                      onChange={e => setNewRule(prev => ({ ...prev, browserNotification: e.target.checked }))}
                      className="rounded accent-amber-500"
                    />
                    <span>Browser / OS Push Notification</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRule.internalMissionAlert}
                      onChange={e => setNewRule(prev => ({ ...prev, internalMissionAlert: e.target.checked }))}
                      className="rounded accent-amber-500"
                    />
                    <span>Internal &apos;Mission Alert&apos; HUD Banner</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Trigger Rule</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Top Mission Alert Banner: Renders prominent alert banners when active alerts fire.
 */
export const MissionAlertBanner: React.FC<{
  alerts: TriggeredMissionAlert[];
  onDismiss: (id: string) => void;
}> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  const topAlert = alerts[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-lg ${
          topAlert.severity === 'critical'
            ? 'bg-red-950/95 border-red-500 text-red-100 shadow-red-950/50'
            : 'bg-amber-950/95 border-amber-500 text-amber-100 shadow-amber-950/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-black/40 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xs font-mono">
            <div className="flex items-center gap-2">
              <strong className="text-white uppercase font-bold tracking-wide">
                OPERATIONAL THRESHOLD ALERT: {topAlert.ruleName}
              </strong>
              <span className="text-[10px] text-neutral-300 opacity-80">
                ({new Date(topAlert.timestamp).toLocaleTimeString()})
              </span>
            </div>
            <p className="text-neutral-200 text-xs font-sans mt-0.5">
              {topAlert.message} (Recorded: {topAlert.currentValue.toLocaleString()} vs limit {topAlert.comparator === 'gt' ? '>' : '<'} {topAlert.threshold.toLocaleString()})
            </p>
          </div>
        </div>
        <button
          onClick={() => onDismiss(topAlert.id)}
          className="px-2.5 py-1 rounded bg-black/30 hover:bg-black/50 text-neutral-200 hover:text-white text-xs font-mono transition-colors cursor-pointer shrink-0"
        >
          Acknowledge
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
