import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Bell, 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  Layers, 
  Volume2, 
  VolumeX, 
  Check, 
  RotateCcw,
  Sliders,
  ShieldCheck,
  Radio,
  Crosshair,
  Compass,
  RefreshCw,
  Brain,
  Clock,
  Sparkles,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { 
  smartNotificationService, 
  SmartNotificationState,
  DispatchEvaluationResult 
} from '../../services/smartNotificationLearningService';

export interface HazardNotificationPreferences {
  wildfire: boolean;        // thermal_fire
  flood: boolean;           // siltation_surge
  deforestation: boolean;   // canopy_stress
  aquiferDeficit: boolean;  // aquifer_deficit
  methanePlume: boolean;    // methane_plume
  minSeverity: 'ALL' | 'WARNING_CRITICAL' | 'CRITICAL_ONLY';
  soundEnabled: boolean;
  autoCenterMap: boolean;
  maintainContext: boolean; // Preserves current zoom level and simply highlights hazard
  desktopPushAlerts: boolean;
  autoSync: boolean;        // Automatically refreshes real-time telemetry data every 30 seconds
  mlAdaptiveSensitivity: boolean; // ML-based Circadian Fatigue Optimization
}

export const DEFAULT_NOTIFICATION_PREFERENCES: HazardNotificationPreferences = {
  wildfire: true,
  flood: true,
  deforestation: true,
  aquiferDeficit: true,
  methanePlume: true,
  minSeverity: 'ALL',
  soundEnabled: true,
  autoCenterMap: true,
  maintainContext: false,
  desktopPushAlerts: true,
  autoSync: true,
  mlAdaptiveSensitivity: true
};

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: HazardNotificationPreferences;
  onSavePreferences: (prefs: HazardNotificationPreferences) => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'streams' | 'ml_learning'>('streams');
  const [mlState, setMlState] = useState<SmartNotificationState>(smartNotificationService.getState());
  const [simulatedResult, setSimulatedResult] = useState<DispatchEvaluationResult | null>(null);

  useEffect(() => {
    const unsubscribe = smartNotificationService.subscribe((updated) => {
      setMlState(updated);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const currentHour = new Date().getHours();
  const currentProfile = mlState.hourlyProfiles[currentHour] || {
    hour: currentHour,
    receptivityScore: 0.8,
    fatigueRisk: 0.2,
    isQuietWindow: false
  };

  const handleToggle = (key: keyof HazardNotificationPreferences) => {
    audioFeedback.playMicroTick();
    onSavePreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleToggleMlAdaptive = () => {
    audioFeedback.playMicroTick();
    const nextVal = !preferences.mlAdaptiveSensitivity;
    smartNotificationService.toggleMlAdaptive(nextVal);
    onSavePreferences({
      ...preferences,
      mlAdaptiveSensitivity: nextVal
    });
  };

  const handleSimulateDispatch = (severity: 'EXISTENTIAL' | 'WARNING') => {
    audioFeedback.playSubtleClick();
    const mockAlert = {
      id: `sim-${Date.now()}`,
      title: severity === 'EXISTENTIAL' 
        ? 'Catastrophic Thermal Front Breach' 
        : 'Sub-threshold Canopy Moisture Depletion',
      bioregionName: 'Mara-Serengeti Transboundary',
      severity: severity as any,
      hazardCategory: severity === 'EXISTENTIAL' ? 'thermal_fire' : 'canopy_stress'
    };
    const result = smartNotificationService.evaluateAlertDelivery(mockAlert);
    setSimulatedResult(result);
  };

  const handleSeverityChange = (sev: HazardNotificationPreferences['minSeverity']) => {
    audioFeedback.playMicroTick();
    onSavePreferences({
      ...preferences,
      minSeverity: sev
    });
  };

  const handleSelectAll = (enable: boolean) => {
    audioFeedback.playMicroTick();
    onSavePreferences({
      ...preferences,
      wildfire: enable,
      flood: enable,
      deforestation: enable,
      aquiferDeficit: enable,
      methanePlume: enable
    });
  };

  const handleResetDefaults = () => {
    audioFeedback.playSubtleClick();
    onSavePreferences(DEFAULT_NOTIFICATION_PREFERENCES);
  };

  const alertTypesConfig = [
    {
      key: 'wildfire' as const,
      label: 'Wildfire & Thermal Hotspots',
      description: 'Landsat-9 TIRS & ECOSTRESS thermal radiation spikes and active surface ignition threats.',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      tag: 'thermal_fire',
      badge: 'Landsat / TIRS'
    },
    {
      key: 'flood' as const,
      label: 'Flood & Siltation Surges',
      description: 'Sentinel-1 C-SAR synthetic aperture radar flood deltas and flash turbidity spikes.',
      icon: <Layers className="w-4 h-4 text-blue-400" />,
      tag: 'siltation_surge',
      badge: 'Sentinel-1 C-SAR'
    },
    {
      key: 'deforestation' as const,
      label: 'Deforestation & Canopy Loss',
      description: 'Sentinel-2B MSI multispectral NDVI drop and illegal riparian clearing anomalies.',
      icon: <TreePine className="w-4 h-4 text-emerald-400" />,
      tag: 'canopy_stress',
      badge: 'Sentinel-2 MSI'
    },
    {
      key: 'aquiferDeficit' as const,
      label: 'Aquifer Deficit & Water Table Retreat',
      description: 'GRACE-FO gravimetric piezometric water deficit & deep borehole recharge failure.',
      icon: <Droplets className="w-4 h-4 text-cyan-400" />,
      tag: 'aquifer_deficit',
      badge: 'GRACE-FO'
    },
    {
      key: 'methanePlume' as const,
      label: 'Methane Plumes & Peatland Degassing',
      description: 'Sentinel-5P TROPOMI atmospheric trace greenhouse gas micro-degassing in peatlands.',
      icon: <Wind className="w-4 h-4 text-purple-400" />,
      tag: 'methane_plume',
      badge: 'Sentinel-5P'
    }
  ];

  const activeCount = [
    preferences.wildfire,
    preferences.flood,
    preferences.deforestation,
    preferences.aquiferDeficit,
    preferences.methanePlume
  ].filter(Boolean).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#0E1410] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl shadow-2xl overflow-hidden text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#141E17] via-[#0E1410] to-[#141E17] border-b border-[#1B3022] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  Notification Preferences
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059]">
                  {activeCount}/5 ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Configure real-time orbital environmental alert subscriptions
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1B3022] bg-[#0A0D0B] text-xs font-mono">
          <button
            id="tab-notification-streams"
            onClick={() => {
              audioFeedback.playMicroTick();
              setActiveSubTab('streams');
            }}
            className={`flex-1 py-2.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'streams'
                ? 'border-[#C5A059] text-[#C5A059] bg-[#141E17]/60'
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Alert Streams</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-emerald-400">
              {activeCount}/5
            </span>
          </button>

          <button
            id="tab-notification-ml-learning"
            onClick={() => {
              audioFeedback.playMicroTick();
              setActiveSubTab('ml_learning');
            }}
            className={`flex-1 py-2.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'ml_learning'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
            <span>ML Fatigue Engine</span>
            {preferences.mlAdaptiveSensitivity ? (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                ACTIVE
              </span>
            ) : (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/40">
                OFF
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeSubTab === 'streams' ? (
            <>
          {/* Quick Select Buttons */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#F5F5F0]/60 uppercase tracking-wider text-[11px] font-bold">
              Subscribed Alert Types
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectAll(true)}
                className="px-2 py-0.5 rounded bg-black/40 hover:bg-white/10 text-[#C5A059] border border-[#C5A059]/30 text-[10px] transition-colors cursor-pointer"
              >
                Enable All
              </button>
              <button
                onClick={() => handleSelectAll(false)}
                className="px-2 py-0.5 rounded bg-black/40 hover:bg-white/10 text-[#F5F5F0]/50 border border-white/10 text-[10px] transition-colors cursor-pointer"
              >
                Mute All
              </button>
            </div>
          </div>

          {/* Alert Types Toggle List */}
          <div className="space-y-2.5">
            {alertTypesConfig.map((item) => {
              const isEnabled = preferences[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isEnabled
                      ? 'bg-[#152319]/70 border-[#2A4630] hover:border-[#C5A059]/50'
                      : 'bg-black/30 border-[#1B3022]/60 hover:bg-white/5 opacity-65'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-black/40 border border-white/10 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                          {item.label}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[#C5A059]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-[#F5F5F0]/70 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <div className="shrink-0 mt-1">
                    <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                      isEnabled ? 'bg-emerald-500' : 'bg-white/20'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Severity Sensitivity Filter */}
          <div className="pt-2 border-t border-[#1B3022] space-y-2">
            <label className="text-xs font-mono text-[#F5F5F0]/70 uppercase tracking-wider block">
              Minimum Severity Threshold
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ALL' as const, label: 'All Alerts', desc: 'Advisory, Warning & Critical' },
                { id: 'WARNING_CRITICAL' as const, label: 'Warn & Crit', desc: 'Suppresses Advisories' },
                { id: 'CRITICAL_ONLY' as const, label: 'Critical Only', desc: 'Emergency Breaches Only' }
              ].map((sev) => (
                <button
                  key={sev.id}
                  onClick={() => handleSeverityChange(sev.id)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    preferences.minSeverity === sev.id
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#F5F5F0]'
                      : 'bg-black/30 border-white/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                  }`}
                >
                  <div className="text-xs font-mono font-bold flex items-center justify-between">
                    <span>{sev.label}</span>
                    {preferences.minSeverity === sev.id && <Check className="w-3 h-3 text-[#C5A059]" />}
                  </div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/50 mt-0.5">{sev.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Audio & Map Auto-Pan Options */}
          <div className="pt-2 border-t border-[#1B3022] space-y-2.5">
            <div 
              onClick={() => handleToggle('soundEnabled')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {preferences.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/40" />
                )}
                <div>
                  <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                    Audible Telemetry Warning Chimes
                  </div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/50">
                    Synthesized acoustic feedback when new satellite alert packets arrive
                  </div>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.soundEnabled ? 'bg-emerald-500' : 'bg-white/20'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  preferences.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

            <div 
              onClick={() => handleToggle('autoCenterMap')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-[#C5A059]" />
                <div>
                  <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                    Auto-Center Geographic Map on Hazard Click
                  </div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/50">
                    Immediately pan D3 spatial engine to target coordinate pass
                  </div>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                preferences.autoCenterMap ? 'bg-emerald-500' : 'bg-white/20'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  preferences.autoCenterMap ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Maintain Context Toggle */}
            <div 
              onClick={() => handleToggle('maintainContext')}
              className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                preferences.maintainContext 
                  ? 'bg-[#C5A059]/10 border-[#C5A059]/50' 
                  : 'bg-black/30 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Crosshair className={`w-4 h-4 ${preferences.maintainContext ? 'text-[#C5A059]' : 'text-white/40'}`} />
                <div>
                  <div className="text-xs font-mono font-bold text-[#F5F5F0] flex items-center gap-1.5">
                    <span>Maintain Context (Preserve Map Zoom)</span>
                    {preferences.maintainContext && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-mono">
                        ZOOM LOCKED
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/60">
                    When enabled, selecting a hazard highlights it while preserving your current zoom level instead of forced zooming
                  </div>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                preferences.maintainContext ? 'bg-[#C5A059]' : 'bg-white/20'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-black transition-transform ${
                  preferences.maintainContext ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Auto-Sync 30s Real-time Telemetry Toggle */}
            <div 
              id="hazard-monitor-auto-sync-setting"
              onClick={() => handleToggle('autoSync')}
              className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                preferences.autoSync 
                  ? 'bg-emerald-950/40 border-emerald-500/50' 
                  : 'bg-black/30 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className={`w-4 h-4 ${preferences.autoSync ? 'text-emerald-400 animate-spin' : 'text-white/40'}`} style={{ animationDuration: '6s' }} />
                <div>
                  <div className="text-xs font-mono font-bold text-[#F5F5F0] flex items-center gap-1.5">
                    <span>Auto-Sync Telemetry (30s Cycle)</span>
                    {preferences.autoSync && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono">
                        30s CADENCE ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/60">
                    Automatically refreshes real-time telemetry data every 30 seconds to ensure the dashboard reflects the latest sensor readings
                  </div>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                preferences.autoSync ? 'bg-emerald-500' : 'bg-white/20'
              }`}>
                <div className={`w-3 h-3 rounded-full bg-black transition-transform ${
                  preferences.autoSync ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>
            </div>
            </>
          ) : (
            /* TAB 2: ML FATIGUE LEARNING & CIRCADIAN SENSITIVITY */
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Sovereign Existential Override Guarantee Banner */}
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-300">
                      EXISTENTIAL THREAT OVERRIDE GUARANTEE
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-900/60 text-rose-200 border border-rose-500/50">
                      ZERO SUPPRESSION
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-200/80 leading-relaxed font-sans">
                    High-priority <strong>Existential</strong> &amp; <strong>Critical</strong> environmental emergencies (e.g. runaway firestorms, catastrophic chemical siltation, aquifer collapse) <em>always bypass</em> fatigue suppression and quiet hours. Life-safety is mathematically prioritized over attention preservation.
                  </p>
                </div>
              </div>

              {/* ML Adaptive Engine Master Switch */}
              <div 
                onClick={handleToggleMlAdaptive}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  preferences.mlAdaptiveSensitivity 
                    ? 'bg-emerald-950/30 border-emerald-500/40' 
                    : 'bg-black/40 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-black/60 border border-emerald-500/30 text-emerald-400">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#F5F5F0] flex items-center gap-1.5">
                      <span>Online Bayesian Fatigue Minimization</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        ADAPTIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#F5F5F0]/60 font-sans">
                      Learns your active circadian review hours to suppress non-critical noise during fatigue/sleep windows.
                    </p>
                  </div>
                </div>

                <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${
                  preferences.mlAdaptiveSensitivity ? 'bg-emerald-500' : 'bg-white/20'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.mlAdaptiveSensitivity ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {/* Circadian Receptivity Heatmap / 24-Hour Profile */}
              <div className="p-3.5 bg-black/40 rounded-lg border border-[#1B3022] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-bold text-[#F5F5F0]">24-Hour Attention &amp; Receptivity Curve</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Current Hour: {currentHour.toString().padStart(2, '0')}:00 ({Math.round(currentProfile.receptivityScore * 100)}% Receptivity)
                  </span>
                </div>

                {/* 24-hour visual bar chart */}
                <div className="pt-2">
                  <div className="flex items-end gap-1 h-20 px-1 border-b border-white/10 pb-1">
                    {mlState.hourlyProfiles.map((p) => {
                      const isCurrent = p.hour === currentHour;
                      const heightPct = Math.max(12, Math.round(p.receptivityScore * 100));
                      const barColor = p.isQuietWindow
                        ? 'bg-rose-900/60 hover:bg-rose-700'
                        : p.receptivityScore >= 0.75
                        ? 'bg-emerald-500 hover:bg-emerald-400'
                        : 'bg-amber-500/70 hover:bg-amber-400';

                      return (
                        <div
                          key={p.hour}
                          title={`Hour ${p.hour}:00 — Receptivity: ${Math.round(p.receptivityScore * 100)}% | Fatigue Risk: ${Math.round(p.fatigueRisk * 100)}%`}
                          className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                          onClick={() => {
                            smartNotificationService.recordUserEngagement(p.hour, 'AUDITED');
                            audioFeedback.playMicroTick();
                          }}
                        >
                          <div 
                            className={`w-full rounded-t-xs transition-all ${barColor} ${
                              isCurrent ? 'ring-2 ring-[#C5A059] shadow-lg shadow-[#C5A059]/30' : ''
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-white/40 pt-1 px-1">
                    <span>00:00 (Night)</span>
                    <span>06:00 (Dawn)</span>
                    <span>12:00 (Noon)</span>
                    <span>18:00 (Dusk)</span>
                    <span>23:00 (Sleep)</span>
                  </div>
                </div>

                {/* Cognitive Legend */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white/60 pt-1 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                    <span>Peak Receptivity (&gt;75%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-amber-500/70" />
                    <span>Moderate Attention</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-rose-900/60" />
                    <span>Quiet / Fatigue Window</span>
                  </div>
                </div>
              </div>

              {/* Machine Learning Statistics Strip */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-black/40 rounded-lg border border-[#1B3022]">
                  <div className="text-[10px] text-white/50">Dispatched Alerts</div>
                  <div className="text-base font-bold text-[#F5F5F0] mt-0.5">
                    {mlState.totalAlertsDispatched}
                  </div>
                  <div className="text-[9px] text-emerald-400">Optimal Windows</div>
                </div>
                <div className="p-2.5 bg-black/40 rounded-lg border border-[#1B3022]">
                  <div className="text-[10px] text-white/50">Fatigue Batched</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {mlState.totalFatigueBatched}
                  </div>
                  <div className="text-[9px] text-amber-400/80">Noise Dampened</div>
                </div>
                <div className="p-2.5 bg-black/40 rounded-lg border border-rose-900/40">
                  <div className="text-[10px] text-rose-300">Existential Bypasses</div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">
                    {mlState.existentialThreatsDelivered}
                  </div>
                  <div className="text-[9px] text-rose-300/80">100% Pierced</div>
                </div>
              </div>

              {/* Batched Digest Queue (Deferred Non-Critical Alerts) */}
              <div className="p-3 bg-black/40 rounded-lg border border-[#1B3022] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F5F5F0] flex items-center gap-1.5">
                    <span>Intelligent Bioregional Digest</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-mono">
                      {mlState.digestQueue.length} QUEUED
                    </span>
                  </span>
                  {mlState.digestQueue.length > 0 && (
                    <button
                      onClick={() => {
                        smartNotificationService.clearDigestQueue();
                        audioFeedback.playSubtleClick();
                      }}
                      className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
                    >
                      Release All
                    </button>
                  )}
                </div>

                {mlState.digestQueue.length === 0 ? (
                  <div className="text-xs text-white/40 font-mono py-2 text-center">
                    No alerts queued in digest. All channels cleared.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {mlState.digestQueue.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-2 rounded bg-white/5 border border-white/10 text-xs font-mono flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                              {item.severity}
                            </span>
                            <span className="font-bold text-[#F5F5F0] text-[11px] truncate max-w-xs">
                              {item.title}
                            </span>
                          </div>
                          <div className="text-[10px] text-white/50">{item.batchedReason}</div>
                        </div>
                        <span className="text-[9px] text-white/40 shrink-0">{item.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive ML Simulator Panel */}
              <div className="p-3 bg-[#141E17]/60 rounded-lg border border-[#C5A059]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#C5A059] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test ML Sensitivity Dispatcher</span>
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">Live Evaluation</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="simulate-existential-threat-btn"
                    onClick={() => handleSimulateDispatch('EXISTENTIAL')}
                    className="p-2 rounded bg-rose-950 hover:bg-rose-900 border border-rose-500/60 text-rose-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Test Existential Threat</span>
                  </button>

                  <button
                    id="simulate-warning-threat-btn"
                    onClick={() => handleSimulateDispatch('WARNING')}
                    className="p-2 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Moderate Warning</span>
                  </button>
                </div>

                {simulatedResult && (
                  <div className={`p-2 rounded border text-xs font-mono space-y-1 animate-in fade-in duration-150 ${
                    simulatedResult.isExistentialBypass
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                      : simulatedResult.batchedForDigest
                      ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {simulatedResult.isExistentialBypass ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>DELIVERY SUCCESSFUL (EXISTENTIAL OVERRIDE)</span>
                        </>
                      ) : simulatedResult.batchedForDigest ? (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>FATIGUE DAMPENING: BATCHED TO DIGEST</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>DELIVERED (OPTIMAL ATTENTION WINDOW)</span>
                        </>
                      )}
                    </div>
                    <div className="text-[10px] opacity-90 leading-tight">
                      {simulatedResult.reason}
                    </div>
                    {simulatedResult.recommendedDeliveryWindow && (
                      <div className="text-[9px] text-[#C5A059] font-mono">
                        {simulatedResult.recommendedDeliveryWindow}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0A0E0B] border-t border-[#1B3022] flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs font-mono text-[#F5F5F0]/50 hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playBell([528, 660], 0.2);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
