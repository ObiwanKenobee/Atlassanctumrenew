import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Sparkles, 
  Save, 
  RefreshCw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  Info,
  Layers,
  Radio
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { AlertThresholdConfig } from './ThresholdAlertModal';

export interface IndicatorThresholdRule {
  id: string;
  indicatorKey: 'ecological' | 'economic' | 'decoupling' | 'canopy' | 'soil_carbon' | 'aquifer';
  indicatorLabel: string;
  unit: string;
  currentValue: number;
  condition: 'below' | 'above';
  thresholdValue: number;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  enabled: boolean;
  soundAlert: boolean;
}

const DEFAULT_INDICATOR_RULES: IndicatorThresholdRule[] = [
  {
    id: 'rule-eco',
    indicatorKey: 'ecological',
    indicatorLabel: 'Ecological Flourishing',
    unit: '%',
    currentValue: 92.4,
    condition: 'below',
    thresholdValue: 75,
    severity: 'CRITICAL',
    enabled: true,
    soundAlert: true
  },
  {
    id: 'rule-econ',
    indicatorKey: 'economic',
    indicatorLabel: 'Economic Stability',
    unit: '%',
    currentValue: 89.2,
    condition: 'below',
    thresholdValue: 70,
    severity: 'WARNING',
    enabled: true,
    soundAlert: false
  },
  {
    id: 'rule-decouple',
    indicatorKey: 'decoupling',
    indicatorLabel: 'Decoupling Margin',
    unit: 'pts',
    currentValue: 51.2,
    condition: 'below',
    thresholdValue: 35,
    severity: 'CRITICAL',
    enabled: true,
    soundAlert: true
  },
  {
    id: 'rule-canopy',
    indicatorKey: 'canopy',
    indicatorLabel: 'Canopy Density & NDVI',
    unit: '%',
    currentValue: 78.3,
    condition: 'below',
    thresholdValue: 65,
    severity: 'WARNING',
    enabled: true,
    soundAlert: false
  },
  {
    id: 'rule-carbon',
    indicatorKey: 'soil_carbon',
    indicatorLabel: 'Soil Organic Carbon',
    unit: '% SOC',
    currentValue: 2.38,
    condition: 'below',
    thresholdValue: 1.8,
    severity: 'WARNING',
    enabled: true,
    soundAlert: false
  },
  {
    id: 'rule-aquifer',
    indicatorKey: 'aquifer',
    indicatorLabel: 'Aquifer Infiltration',
    unit: 'L/m²',
    currentValue: 46.5,
    condition: 'below',
    thresholdValue: 32,
    severity: 'ADVISORY',
    enabled: true,
    soundAlert: false
  }
];

export interface ThresholdConfigurationPanelProps {
  currentAlertConfig?: AlertThresholdConfig;
  onSavePrimaryConfig?: (config: AlertThresholdConfig) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onClose?: () => void;
  onSaveCustomRules?: (rules: IndicatorThresholdRule[]) => void;
}

export const ThresholdConfigurationPanel: React.FC<ThresholdConfigurationPanelProps> = ({
  currentAlertConfig,
  onSavePrimaryConfig,
  isOpen: externalIsOpen,
  onToggleOpen,
  onClose,
  onSaveCustomRules
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(true);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else if (onClose && isOpen) {
      onClose();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };
  const [rules, setRules] = useState<IndicatorThresholdRule[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_custom_multi_threshold_rules');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved indicator threshold rules:', e);
    }
    return DEFAULT_INDICATOR_RULES;
  });

  const [activeRuleId, setActiveRuleId] = useState<string>('rule-eco');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const activeRule = rules.find(r => r.id === activeRuleId) || rules[0];

  const handleUpdateActiveRule = (updates: Partial<IndicatorThresholdRule>) => {
    const updated = rules.map(r => r.id === activeRuleId ? { ...r, ...updates } : r);
    setRules(updated);

    // If updating primary rule (ecological / economic / decoupling), sync with parent config
    if (activeRule.indicatorKey === 'ecological' || activeRule.indicatorKey === 'economic' || activeRule.indicatorKey === 'decoupling') {
      const parentMetric = activeRule.indicatorKey;
      const nextCondition = updates.condition || activeRule.condition;
      const nextVal = updates.thresholdValue !== undefined ? updates.thresholdValue : activeRule.thresholdValue;
      const nextEnabled = updates.enabled !== undefined ? updates.enabled : activeRule.enabled;

      onSavePrimaryConfig({
        enabled: nextEnabled,
        metric: parentMetric,
        condition: nextCondition,
        value: nextVal
      });
    }
  };

  const handleSaveAll = () => {
    audioFeedback.playSuccessChime();
    try {
      localStorage.setItem('atlas_custom_multi_threshold_rules', JSON.stringify(rules));
      setSaveSuccessMessage('Notification thresholds successfully saved to local telemetry cache.');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (e) {
      console.warn('Failed to save rules to localStorage:', e);
    }
  };

  const handleApplyPreset = (presetType: 'strict' | 'moderate' | 'regenerative') => {
    audioFeedback.playMicroTick();
    let updatedRules = [...rules];
    if (presetType === 'strict') {
      updatedRules = rules.map(r => ({
        ...r,
        thresholdValue: r.indicatorKey === 'soil_carbon' ? 2.1 : r.indicatorKey === 'aquifer' ? 40 : Math.round(r.currentValue * 0.9),
        enabled: true
      }));
    } else if (presetType === 'moderate') {
      updatedRules = rules.map(r => ({
        ...r,
        thresholdValue: r.indicatorKey === 'soil_carbon' ? 1.8 : r.indicatorKey === 'aquifer' ? 32 : Math.round(r.currentValue * 0.8),
        enabled: true
      }));
    } else {
      // Regenerative baseline
      updatedRules = rules.map(r => ({
        ...r,
        thresholdValue: r.indicatorKey === 'soil_carbon' ? 1.5 : r.indicatorKey === 'aquifer' ? 25 : Math.round(r.currentValue * 0.7),
        enabled: true
      }));
    }
    setRules(updatedRules);
    audioFeedback.playSuccessChime();
  };

  // Evaluate breached rules
  const breachedRules = rules.filter(r => {
    if (!r.enabled) return false;
    return r.condition === 'below' ? r.currentValue < r.thresholdValue : r.currentValue > r.thresholdValue;
  });

  return (
    <div 
      id="threshold-configuration-panel" 
      className="bg-[#121614] border border-amber-500/40 rounded-lg overflow-hidden shadow-xl"
    >
      {/* Header Bar */}
      <div 
        onClick={handleToggle}
        className="px-5 py-3.5 bg-gradient-to-r from-[#18201B] via-[#241E15] to-[#18201B] border-b border-amber-500/30 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-bold">
                EPISTEMIC SAFEGUARD WATCHDOG
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                breachedRules.length > 0 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse font-bold' 
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              }`}>
                {breachedRules.length > 0 
                  ? `⚠ ${breachedRules.length} Boundary Crossed` 
                  : '● All Indicators Nominal'}
              </span>
            </div>
            <h3 className="text-base font-serif text-[#F5F5F0]">
              Notification Thresholds & Critical Boundary Configuration
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8E9490]">
            <span>Active Rules: {rules.filter(r => r.enabled).length}/{rules.length}</span>
          </div>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-white/10 text-amber-400 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded hover:bg-white/10 text-[#8E9490] hover:text-white transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Configuration Body */}
      {isOpen && (
        <div className="p-5 space-y-5">
          {/* Preset Buttons & Quick Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-[#8E9490]">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('strict')}
                className="px-2.5 py-1 bg-[#1A1812] hover:bg-[#2A2315] border border-amber-500/40 text-amber-300 rounded text-xs font-mono transition-colors cursor-pointer"
              >
                Strict Safeguards (-10%)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('moderate')}
                className="px-2.5 py-1 bg-[#1A1812] hover:bg-[#2A2315] border border-amber-500/40 text-amber-300 rounded text-xs font-mono transition-colors cursor-pointer"
              >
                Moderate Bounds (-20%)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('regenerative')}
                className="px-2.5 py-1 bg-[#1A1812] hover:bg-[#2A2315] border border-amber-500/40 text-amber-300 rounded text-xs font-mono transition-colors cursor-pointer"
              >
                Regenerative Floor (-30%)
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  audioFeedback.playMicroTick();
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-[#8E9490] hover:text-[#F5F5F0] cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C5A059]" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
                <span>Sound Chimes: {soundEnabled ? 'ON' : 'MUTED'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioFeedback.playWarningPulse();
                }}
                className="px-2.5 py-1 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
              >
                <Radio className="w-3 h-3 text-rose-400" />
                <span>Test Audio Chime</span>
              </button>
            </div>
          </div>

          {/* Indicator Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {rules.map((rule) => {
              const isSelected = rule.id === activeRuleId;
              const isBreached = rule.enabled && (
                rule.condition === 'below' ? rule.currentValue < rule.thresholdValue : rule.currentValue > rule.thresholdValue
              );

              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => {
                    setActiveRuleId(rule.id);
                    audioFeedback.playMicroTick();
                  }}
                  className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#261E14] border-amber-400 shadow-md ring-1 ring-amber-400/50'
                      : isBreached
                        ? 'bg-rose-950/40 border-rose-500/60'
                        : 'bg-[#151C17] border-[#243527] hover:border-[#38533E]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#C5A059] truncate">
                      {rule.indicatorLabel}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isBreached ? 'bg-rose-500 animate-ping' : rule.enabled ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                  </div>
                  <div className="text-sm font-mono text-[#F5F5F0] font-bold">
                    {rule.currentValue}{rule.unit}
                  </div>
                  <div className="text-[10px] font-mono text-[#8E9490] mt-0.5">
                    Limit: {rule.condition === 'below' ? '<' : '>'} {rule.thresholdValue}{rule.unit}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Rule Detailed Editor Card */}
          <div className="bg-[#17201B] border border-[#2B3E30] rounded-md p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-mono font-bold text-[#F5F5F0] flex items-center gap-2">
                  <span>Configure: {activeRule.indicatorLabel}</span>
                  <span className="text-xs text-[#8E9490] font-normal">
                    (Current Telemetry: <strong className="text-emerald-400">{activeRule.currentValue}{activeRule.unit}</strong>)
                  </span>
                </h4>
                <p className="text-xs text-[#8E9490] font-sans mt-0.5">
                  Set critical boundary thresholds that trigger audible warnings and visual telemetry banners when data breaches the safe envelope.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer text-[#F5F5F0]">
                  <input
                    type="checkbox"
                    checked={activeRule.enabled}
                    onChange={(e) => handleUpdateActiveRule({ enabled: e.target.checked })}
                    className="rounded border-[#C5A059] text-amber-500 focus:ring-amber-500 bg-black/40"
                  />
                  <span>Watchdog Active</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#F5F5F0]/10">
              {/* Condition Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8E9490]">Trigger Condition:</label>
                <div className="flex rounded border border-[#2B3E30] overflow-hidden bg-[#101512]">
                  <button
                    type="button"
                    onClick={() => handleUpdateActiveRule({ condition: 'below' })}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold text-center cursor-pointer transition-colors ${
                      activeRule.condition === 'below' ? 'bg-amber-500 text-black' : 'text-[#8E9490] hover:text-[#F5F5F0]'
                    }`}
                  >
                    Drops Below (&lt;)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateActiveRule({ condition: 'above' })}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold text-center cursor-pointer transition-colors ${
                      activeRule.condition === 'above' ? 'bg-amber-500 text-black' : 'text-[#8E9490] hover:text-[#F5F5F0]'
                    }`}
                  >
                    Rises Above (&gt;)
                  </button>
                </div>
              </div>

              {/* Threshold Slider & Number */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8E9490]">Threshold Value:</span>
                  <span className="text-amber-400 font-bold">{activeRule.thresholdValue} {activeRule.unit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={activeRule.indicatorKey === 'soil_carbon' ? 0.5 : 10}
                    max={activeRule.indicatorKey === 'soil_carbon' ? 5.0 : activeRule.indicatorKey === 'aquifer' ? 100 : 100}
                    step={activeRule.indicatorKey === 'soil_carbon' ? 0.05 : 1}
                    value={activeRule.thresholdValue}
                    onChange={(e) => handleUpdateActiveRule({ thresholdValue: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    value={activeRule.thresholdValue}
                    onChange={(e) => handleUpdateActiveRule({ thresholdValue: parseFloat(e.target.value) || 0 })}
                    className="w-18 px-2 py-1 bg-[#101512] border border-[#2B3E30] text-xs font-mono text-[#F5F5F0] rounded text-right"
                  />
                </div>
              </div>

              {/* Severity Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#8E9490]">Alert Severity:</label>
                <div className="flex rounded border border-[#2B3E30] overflow-hidden bg-[#101512]">
                  {(['CRITICAL', 'WARNING', 'ADVISORY'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => handleUpdateActiveRule({ severity: sev })}
                      className={`flex-1 py-1.5 text-[10px] font-mono font-bold text-center cursor-pointer transition-colors ${
                        activeRule.severity === sev 
                          ? sev === 'CRITICAL' ? 'bg-rose-600 text-white' : sev === 'WARNING' ? 'bg-amber-500 text-black' : 'bg-cyan-600 text-black'
                          : 'text-[#8E9490] hover:text-[#F5F5F0]'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Boundary Evaluation Status */}
            <div className={`p-3 rounded border text-xs font-mono flex items-center justify-between ${
              activeRule.condition === 'below' ? activeRule.currentValue < activeRule.thresholdValue : activeRule.currentValue > activeRule.thresholdValue
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                : 'bg-[#121914] border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-current" />
                <span>
                  Status: {activeRule.condition === 'below' 
                    ? activeRule.currentValue < activeRule.thresholdValue ? 'BREACH DETECTED: Value is below critical limit' : 'NOMINAL: Telemetry is within safe baseline'
                    : activeRule.currentValue > activeRule.thresholdValue ? 'BREACH DETECTED: Value exceeded upper envelope' : 'NOMINAL: Telemetry is within safe baseline'}
                </span>
              </div>
              <span className="text-[10px] text-[#8E9490]">
                Margin: {Math.abs(activeRule.currentValue - activeRule.thresholdValue).toFixed(1)} {activeRule.unit} {activeRule.currentValue >= activeRule.thresholdValue ? 'buffer' : 'deficit'}
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {saveSuccessMessage ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {saveSuccessMessage}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-[#8E9490]">
                * Threshold notifications are continuously evaluated across in-situ sensor streams and spaceborne passes.
              </span>
            )}

            <button
              type="button"
              id="btn-save-threshold-config"
              onClick={handleSaveAll}
              className="px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#E0C070] hover:from-[#d4b068] hover:to-[#ebcc7f] text-black rounded font-mono text-xs font-bold flex items-center gap-2 shadow cursor-pointer transition-all uppercase tracking-wider"
            >
              <Save className="w-4 h-4 text-black" />
              <span>Save Safeguard Rules</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
