import React from 'react';
import { AlertTriangle, Bell, X, Sliders, ShieldAlert, ArrowRight } from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { AlertThresholdConfig } from './ThresholdAlertModal';

export interface ThresholdAlertBannerProps {
  isTriggered?: boolean;
  config: AlertThresholdConfig;
  currentValue: number;
  onOpenSettings?: () => void;
  onConfigure?: () => void;
  onDismiss: () => void;
  isDismissed?: boolean;
  onEnablePush?: () => void;
  isPushGranted?: boolean;
}

export const ThresholdAlertBanner: React.FC<ThresholdAlertBannerProps> = ({
  isTriggered = true,
  config,
  currentValue,
  onOpenSettings,
  onConfigure,
  onDismiss,
  isDismissed = false,
  onEnablePush,
  isPushGranted
}) => {
  if (!isTriggered || !config.enabled || isDismissed) return null;

  const handleOpenSettings = onConfigure || onOpenSettings || (() => {});

  const metricLabel = config.metric === 'ecological' 
    ? 'Ecological Flourishing' 
    : config.metric === 'economic' 
    ? 'Economic Stability' 
    : 'Decoupling Margin';

  const unit = config.metric === 'decoupling' ? 'pts' : '%';

  return (
    <div 
      id="threshold-alert-system-notification"
      className="p-3.5 sm:p-4 rounded-md bg-gradient-to-r from-rose-950/90 via-red-950/80 to-[#120808] border border-rose-500/70 shadow-lg text-[#F5F5F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500 animate-pulse flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-900/80 text-rose-200 px-1.5 py-0.2 rounded border border-rose-400/40">
              TELEMETRY WATCHDOG TRIGGERED
            </span>
            <span className="text-[10px] font-mono text-[#F5F5F0]/60">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            {isPushGranted && (
              <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded flex items-center gap-1">
                <Bell className="w-2.5 h-2.5 text-emerald-400" /> Desktop Push Active
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-sans text-[#F5F5F0]/95 font-medium">
            <span className="text-rose-300 font-bold">{metricLabel}</span> has breached your defined threshold of{' '}
            <span className="font-mono font-bold text-amber-300">{config.condition === 'below' ? '<' : '>'} {config.value}{unit}</span>.
            Current telemetry reads{' '}
            <span className="font-mono font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-rose-500/40">
              {currentValue.toFixed(1)}{unit}
            </span>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
        {!isPushGranted && onEnablePush && (
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onEnablePush();
            }}
            className="px-2.5 py-1.5 rounded-sm bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Arm browser push notifications for real-time breach alerts"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Enable Push</span>
          </button>
        )}

        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            handleOpenSettings();
          }}
          className="px-3 py-1.5 rounded-sm bg-[#1A1414] hover:bg-[#2A1E1E] border border-rose-500/50 text-rose-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Adjust Threshold</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            onDismiss();
          }}
          className="p-1.5 rounded-sm hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          title="Acknowledge and dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
