import React from 'react';
import { Sparkles } from 'lucide-react';

interface GlobalLoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
  progress?: number; // 0 to 100
}

export const GlobalLoadingIndicator: React.FC<GlobalLoadingIndicatorProps> = ({
  isLoading,
  message = 'Synchronizing planetary telemetry & causal intelligence...',
  progress
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Top High-Tech Glowing Progress Bar */}
      <div className="w-full h-1 bg-[#1A1A1A] overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-[#C5A059] via-emerald-400 to-[#C5A059] transition-all duration-300 ease-out shadow-[0_0_12px_#C5A059]"
          style={{
            width: progress !== undefined ? `${progress}%` : '100%',
            animation: progress === undefined ? 'indeterminateProgress 1.4s infinite linear' : undefined
          }}
        />
      </div>

      {/* Floating Status Pill */}
      <div className="flex justify-center pt-2 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#C5A059]/40 rounded-full text-[10px] font-mono text-[#F5F5F0] shadow-lg animate-fadeIn">
          <Sparkles className="w-3 h-3 text-[#C5A059] animate-spin" />
          <span className="truncate max-w-[320px] text-[#F5F5F0]/90 font-medium">{message}</span>
        </div>
      </div>

      <style>{`
        @keyframes indeterminateProgress {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.7); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
      `}</style>
    </div>
  );
};
