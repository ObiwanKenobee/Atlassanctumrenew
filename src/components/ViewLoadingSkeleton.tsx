import React from 'react';
import { Activity, Sparkles, Layers } from 'lucide-react';

interface ViewLoadingSkeletonProps {
  title?: string;
  subtitle?: string;
}

export const ViewLoadingSkeleton: React.FC<ViewLoadingSkeletonProps> = ({
  title = 'Loading Civilization Module...',
  subtitle = 'Fetching verified telemetry, causal models, and sovereign ledgers'
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4 border-b border-[#F5F5F0]/10 pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded-full">
            <Sparkles className="w-3 h-3 text-[#C5A059] animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              {title}
            </span>
          </div>
          <div className="h-4 w-28 bg-[#1A1A1A] rounded-xs" />
        </div>

        <div className="space-y-2">
          <div className="h-8 sm:h-10 w-3/4 sm:w-1/2 bg-[#171717] rounded-sm" />
          <p className="text-xs text-[#F5F5F0]/40 font-mono flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{subtitle}</span>
          </p>
        </div>
      </div>

      {/* 4-Stat Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-[#1F1F1F] rounded-xs" />
              <div className="h-3 w-8 bg-[#1F1F1F] rounded-xs" />
            </div>
            <div className="h-7 w-24 bg-[#252525] rounded-xs" />
            <div className="h-2.5 w-full bg-[#1A1A1A] rounded-xs" />
          </div>
        ))}
      </div>

      {/* Main Content Layout Skeleton (2 Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 Main Canvas */}
        <div className="lg:col-span-2 p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-4">
            <div className="h-5 w-40 bg-[#1F1F1F] rounded-xs" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-[#1A1A1A] rounded-xs" />
              <div className="h-6 w-16 bg-[#1A1A1A] rounded-xs" />
            </div>
          </div>
          {/* Mock Interactive Graph / Chart Canvas */}
          <div className="h-64 sm:h-80 w-full bg-[#080808] border border-[#F5F5F0]/5 rounded-sm flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-full border border-[#C5A059]/30 flex items-center justify-center bg-[#121212]">
              <Layers className="w-5 h-5 text-[#C5A059]/60 animate-bounce" />
            </div>
            <span className="text-[11px] font-mono text-[#F5F5F0]/30 tracking-wider">
              Rendering multi-scale dynamic graph...
            </span>
          </div>
          {/* Sub-rows */}
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-[#171717] rounded-xs" />
            <div className="h-3 w-5/6 bg-[#171717] rounded-xs" />
            <div className="h-3 w-4/6 bg-[#171717] rounded-xs" />
          </div>
        </div>

        {/* Right 1/3 Sidebar Panel */}
        <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-5 w-32 bg-[#1F1F1F] rounded-xs" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="p-3 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-2">
                  <div className="h-3 w-20 bg-[#222222] rounded-xs" />
                  <div className="h-2.5 w-full bg-[#1A1A1A] rounded-xs" />
                  <div className="h-2.5 w-4/5 bg-[#1A1A1A] rounded-xs" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-9 w-full bg-[#1C1C1C] rounded-xs mt-4" />
        </div>
      </div>
    </div>
  );
};
