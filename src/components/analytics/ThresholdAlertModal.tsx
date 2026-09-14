import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Sparkles,
  Info,
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  Bookmark,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { 
  AlertPreset, 
  loadAlertPresets, 
  addCustomAlertPreset, 
  deleteCustomAlertPreset 
} from './alertPresetsData';

export interface AlertThresholdConfig {
  enabled: boolean;
  metric: 'ecological' | 'economic' | 'decoupling';
  condition: 'below' | 'above';
  value: number;
}

interface ThresholdAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AlertThresholdConfig;
  onSaveConfig: (config: AlertThresholdConfig) => void;
  currentMetrics: {
    latestEco: number;
    latestEcon: number;
    decouplingMargin: number;
  };
  onTriggerTestAlert?: () => void;
}

export const ThresholdAlertModal: React.FC<ThresholdAlertModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentMetrics,
  onTriggerTestAlert
}) => {
  const [enabled, setEnabled] = useState<boolean>(config.enabled);
  const [metric, setMetric] = useState<'ecological' | 'economic' | 'decoupling'>(config.metric);
  const [condition, setCondition] = useState<'below' | 'above'>(config.condition);
  const [value, setValue] = useState<number>(config.value);
  const [testTriggered, setTestTriggered] = useState<boolean>(false);
  const [presets, setPresets] = useState<AlertPreset[]>(() => loadAlertPresets());
  const [isSavingPreset, setIsSavingPreset] = useState<boolean>(false);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetBioregion, setNewPresetBioregion] = useState<string>('');
  const [savePresetSuccess, setSavePresetSuccess] = useState<boolean>(false);

  useEffect(() => {
    setPresets(loadAlertPresets());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    audioFeedback.playSuccessChime();
    onSaveConfig({
      enabled,
      metric,
      condition,
      value
    });
    onClose();
  };

  const handleApplyPreset = (
    presetMetric: 'ecological' | 'economic' | 'decoupling', 
    presetCond: 'below' | 'above', 
    presetVal: number
  ) => {
    audioFeedback.playMicroTick();
    setMetric(presetMetric);
    setCondition(presetCond);
    setValue(presetVal);
    setEnabled(true);
  };

  const handleSaveAsCustomPreset = () => {
    if (!newPresetName.trim()) return;
    audioFeedback.playSuccessChime();
    const created = addCustomAlertPreset({
      name: newPresetName.trim(),
      description: `Watchdog trigger: ${metric.toUpperCase()} ${condition === 'below' ? '<' : '>'} ${value}${metric === 'decoupling' ? 'pts' : '%'}`,
      bioregionName: newPresetBioregion.trim() || 'Custom Bioregion',
      config: {
        enabled: true,
        metric,
        condition,
        value
      }
    });
    setPresets(loadAlertPresets());
    setIsSavingPreset(false);
    setNewPresetName('');
    setNewPresetBioregion('');
    setSavePresetSuccess(true);
    setTimeout(() => setSavePresetSuccess(false), 3000);
  };

  const handleDeleteCustomPreset = (presetId: string) => {
    audioFeedback.playSubtleClick();
    const updated = deleteCustomAlertPreset(presetId);
    setPresets(updated);
  };

  const handleTest = () => {
    audioFeedback.playWarningPulse();
    setTestTriggered(true);
    if (onTriggerTestAlert) {
      onTriggerTestAlert();
    }
    setTimeout(() => setTestTriggered(false), 3000);
  };

  // Determine current value for the selected metric
  const currentVal = metric === 'ecological' 
    ? currentMetrics.latestEco 
    : metric === 'economic' 
    ? currentMetrics.latestEcon 
    : currentMetrics.decouplingMargin;

  const isTriggeredNow = enabled && (
    (condition === 'below' && currentVal < value) ||
    (condition === 'above' && currentVal > value)
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-[#0B0E0C] border border-amber-500/40 rounded-lg shadow-2xl p-6 sm:p-7 space-y-6 text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
                <BellRing className="w-3 h-3 text-amber-400" />
                SYSTEM TELEMETRY WATCHDOG
              </span>
              {enabled ? (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Active Monitor
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#F5F5F0]/50 bg-[#141414] px-2 py-0.5 rounded border border-[#F5F5F0]/10">
                  Disabled
                </span>
              )}
            </div>
            <h2 className="text-xl font-serif text-[#F5F5F0] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Configure Metric Threshold Alert
            </h2>
            <p className="text-xs text-[#F5F5F0]/65 font-sans">
              Set automated trigger levels on the 12-month longitudinal trend chart. Receive instant system notifications when readings breach your defined limits.
            </p>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-sm hover:bg-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-5 text-xs font-mono">
          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 rounded bg-[#131915] border border-[#F5F5F0]/10">
            <div className="space-y-0.5">
              <span className="font-bold text-[#F5F5F0] text-sm">Alert Monitoring State</span>
              <p className="text-[11px] text-[#F5F5F0]/55 font-sans">
                {enabled ? 'Watchdog actively monitoring current and forecasted points' : 'Alert notifications silenced'}
              </p>
            </div>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setEnabled(!enabled);
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                enabled 
                  ? 'bg-amber-500 text-black shadow-md' 
                  : 'bg-[#1C1F1D] text-[#F5F5F0]/60 border border-[#F5F5F0]/20 hover:text-white'
              }`}
            >
              {enabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}
            </button>
          </div>

          {/* Metric Selector */}
          <div className="space-y-2">
            <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
              1. Target Telemetry Metric
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setMetric('ecological');
                }}
                className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                  metric === 'ecological'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/30'
                }`}
              >
                <div className="font-bold text-[11px] text-emerald-400">Ecological Flourishing</div>
                <div className="text-[10px] text-[#F5F5F0]/50 font-sans mt-0.5">Current: {currentMetrics.latestEco}%</div>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setMetric('economic');
                }}
                className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                  metric === 'economic'
                    ? 'bg-[#2A2312] border-[#C5A059] text-white'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/30'
                }`}
              >
                <div className="font-bold text-[11px] text-[#C5A059]">Economic Stability</div>
                <div className="text-[10px] text-[#F5F5F0]/50 font-sans mt-0.5">Current: {currentMetrics.latestEcon}%</div>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setMetric('decoupling');
                }}
                className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                  metric === 'decoupling'
                    ? 'bg-cyan-950/80 border-cyan-500 text-white'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/30'
                }`}
              >
                <div className="font-bold text-[11px] text-cyan-400">Decoupling Margin</div>
                <div className="text-[10px] text-[#F5F5F0]/50 font-sans mt-0.5">Current: +{currentMetrics.decouplingMargin} pts</div>
              </button>
            </div>
          </div>

          {/* Condition Selector */}
          <div className="space-y-2">
            <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
              2. Breach Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setCondition('below');
                }}
                className={`p-2 rounded border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  condition === 'below'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
                <span>Drops Below (&lt; Threshold)</span>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setCondition('above');
                }}
                className={`p-2 rounded border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  condition === 'above'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Rises Above (&gt; Threshold)</span>
              </button>
            </div>
          </div>

          {/* Threshold Value Slider & Numeric Input */}
          <div className="space-y-2 p-3.5 rounded bg-[#101311] border border-[#F5F5F0]/10">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                3. Threshold Trigger Value
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={value}
                  onChange={(e) => setValue(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 rounded bg-[#0A0D0B] border border-[#C5A059]/40 text-right text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400 font-mono"
                />
                <span className="text-[#F5F5F0]/60">{metric === 'decoupling' ? 'pts' : '%'}</span>
              </div>
            </div>

            <input
              type="range"
              min="20"
              max="100"
              step="0.5"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-[#1B211D] rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-[#F5F5F0]/40 font-mono pt-1">
              <span>20 (Depleted)</span>
              <span className="text-amber-400/80">Threshold Guide: {value}{metric === 'decoupling' ? ' pts' : '%'}</span>
              <span>100 (Optimal)</span>
            </div>
          </div>

          {/* Alert Presets Selector & Save Feature */}
          <div className="space-y-2 pt-1 border-t border-[#F5F5F0]/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
                Bioregional Alert Presets ({presets.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setIsSavingPreset(!isSavingPreset);
                }}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Save Current as Preset</span>
              </button>
            </div>

            {/* Save Preset Inline Form */}
            {isSavingPreset && (
              <div className="p-3 rounded bg-[#1A1F1C] border border-amber-500/40 space-y-2.5 animate-in fade-in duration-150">
                <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                  <Bookmark className="w-3 h-3" />
                  Save Monitoring Threshold Preset ({metric.toUpperCase()} {condition === 'below' ? '<' : '>'} {value}{metric === 'decoupling' ? 'pts' : '%'})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Preset Name (e.g. Mara Aquifer Critical Floor)"
                    className="bg-[#0D120F] border border-[#F5F5F0]/20 rounded p-1.5 text-xs text-white placeholder:text-[#F5F5F0]/40 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={newPresetBioregion}
                    onChange={(e) => setNewPresetBioregion(e.target.value)}
                    placeholder="Bioregion (e.g. Rift Valley Basin)"
                    className="bg-[#0D120F] border border-[#F5F5F0]/20 rounded p-1.5 text-xs text-white placeholder:text-[#F5F5F0]/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSavingPreset(false)}
                    className="px-2.5 py-1 rounded bg-[#141414] hover:bg-[#222] border border-[#F5F5F0]/20 text-[10px] text-[#F5F5F0]/70 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAsCustomPreset}
                    disabled={!newPresetName.trim()}
                    className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save Preset</span>
                  </button>
                </div>
              </div>
            )}

            {savePresetSuccess && (
              <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-300 font-sans flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Alert preset saved to your bioregional monitoring presets.</span>
              </div>
            )}

            {/* Presets List Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {presets.map((p) => {
                const isActive = enabled && metric === p.config.metric && condition === p.config.condition && value === p.config.value;
                return (
                  <div
                    key={p.id}
                    className={`p-2 rounded border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200' 
                        : 'bg-[#141816] hover:bg-[#1C221F] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-white'
                    }`}
                    onClick={() => handleApplyPreset(p.config.metric, p.config.condition, p.config.value)}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[11px] truncate">{p.name}</span>
                        {p.isCustom && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30 shrink-0">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#F5F5F0]/50 font-sans truncate">
                        {p.bioregionName} • {p.config.metric.toUpperCase()} {p.config.condition === 'below' ? '<' : '>'} {p.config.value}{p.config.metric === 'decoupling' ? 'pts' : '%'}
                      </div>
                    </div>

                    {p.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomPreset(p.id);
                        }}
                        className="p-1 text-[#F5F5F0]/40 hover:text-rose-400 transition-colors"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Evaluation Status */}
          <div className={`p-3 rounded border flex items-center justify-between text-xs ${
            isTriggeredNow 
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
              : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {isTriggeredNow ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                Status: {isTriggeredNow ? 'THRESHOLD BREACHED' : 'Normal Operating Envelope'}
              </span>
            </div>
            <span className="font-mono font-bold">
              Current: {currentVal}{metric === 'decoupling' ? ' pts' : '%'} {condition === 'below' ? (currentVal < value ? '<' : '≥') : (currentVal > value ? '>' : '≤')} {value}{metric === 'decoupling' ? ' pts' : '%'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F5F5F0]/10">
          <button
            onClick={handleTest}
            className="w-full sm:w-auto px-3.5 py-2 rounded-sm bg-[#1A1812] hover:bg-[#282315] border border-amber-500/50 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Bell className={`w-3.5 h-3.5 ${testTriggered ? 'animate-bounce' : ''}`} />
            <span>{testTriggered ? 'Triggering Alarm...' : 'Test Audio & Notification'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-sm bg-[#141414] hover:bg-[#222] border border-[#F5F5F0]/20 text-[#F5F5F0]/80 text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Save & Arm Watchdog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
