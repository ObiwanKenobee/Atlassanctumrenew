import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Clock } from 'lucide-react';
import { TimeRangeOption } from './trendExportUtils';
import { audioFeedback } from '../../lib/audioFeedback';

export interface TimeRangeSelectorProps {
  value: TimeRangeOption;
  onChange: (range: TimeRangeOption) => void;
  compact?: boolean;
  className?: string;
  showQuickPills?: boolean;
}

interface TimeRangeItem {
  id: TimeRangeOption;
  label: string;
  shortLabel: string;
  durationDesc: string;
  badge: string;
}

export const TIME_RANGE_OPTIONS: TimeRangeItem[] = [
  {
    id: '30d',
    label: 'Last 30 Days',
    shortLabel: '30D',
    durationDesc: 'Most recent 30-day telemetry (M11 - M12)',
    badge: 'Real-time'
  },
  {
    id: 'quarter',
    label: 'Last Quarter',
    shortLabel: 'QTR',
    durationDesc: 'Past 90-day epoch (M10 - M12)',
    badge: '3 Months'
  },
  {
    id: 'year',
    label: 'Last Year',
    shortLabel: '1Y',
    durationDesc: '12-Month audited trajectory (M01 - M12)',
    badge: '12 Months'
  },
  {
    id: 'all',
    label: 'All-Time',
    shortLabel: 'ALL',
    durationDesc: 'Complete historical timeline & forward simulation',
    badge: 'Full Horizon'
  }
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
  compact = false,
  className = '',
  showQuickPills = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = TIME_RANGE_OPTIONS.find(o => o.id === value) || TIME_RANGE_OPTIONS[2];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (rangeId: TimeRangeOption) => {
    audioFeedback.playMicroTick();
    onChange(rangeId);
    setIsOpen(false);
  };

  return (
    <div className={`flex items-center gap-1.5 font-mono ${className}`} ref={dropdownRef}>
      {/* Dropdown Menu Container */}
      <div className="relative">
        <button
          id="impact-time-range-dropdown"
          type="button"
          onClick={() => {
            audioFeedback.playSubtleClick();
            setIsOpen(prev => !prev);
          }}
          className={`flex items-center gap-2 rounded-sm border transition-all cursor-pointer select-none ${
            compact 
              ? 'px-2.5 py-1.5 text-[11px] bg-[#141414] border-[#F5F5F0]/15 hover:border-[#C5A059]/50 text-[#F5F5F0]' 
              : 'px-3 py-1.5 text-xs bg-[#0D0D0D] border-[#C5A059]/40 hover:border-[#C5A059] text-[#F5F5F0] shadow-sm'
          } ${isOpen ? 'ring-1 ring-[#C5A059]/60 border-[#C5A059]' : ''}`}
          title="Filter visualized time range"
          aria-expanded={isOpen}
        >
          <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          <span className="text-[#F5F5F0]/60 hidden sm:inline">Range:</span>
          <span className="font-bold text-[#F5F5F0]">{selectedItem.label}</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-[#C5A059] border border-[#C5A059]/30 font-bold hidden md:inline">
            {selectedItem.badge}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#F5F5F0]/60 transition-transform duration-150 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu Overlay */}
        {isOpen && (
          <div className="absolute right-0 sm:left-0 mt-1 w-64 bg-[#0A0D0B] border border-[#C5A059]/50 rounded-sm shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[9px] text-[#C5A059] font-bold uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C5A059]" />
                Select Temporal Horizon
              </span>
              <span className="text-neutral-400">Quick-Set</span>
            </div>

            {TIME_RANGE_OPTIONS.map((option) => {
              const isSelected = option.id === value;
              return (
                <button
                  key={option.id}
                  id={`time-range-${option.id}`}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-sm text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3022] text-white border border-[#C5A059]/40 font-bold shadow-sm'
                      : 'hover:bg-white/5 text-[#F5F5F0]/75 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span>{option.label}</span>
                      <span className="text-[9px] text-[#C5A059] bg-black/40 px-1 py-0.2 rounded">
                        {option.shortLabel}
                      </span>
                    </div>
                    <div className="text-[9px] text-[#F5F5F0]/50 font-sans">
                      {option.durationDesc}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Optional Inline Quick-Pills for 1-Click Access */}
      {showQuickPills && (
        <div className="hidden lg:flex items-center bg-[#070908] p-0.5 border border-[#F5F5F0]/15 rounded-sm">
          {TIME_RANGE_OPTIONS.map((option) => {
            const isSelected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  audioFeedback.playMicroTick();
                  onChange(option.id);
                }}
                className={`px-2 py-1 text-[10px] font-bold rounded-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B3022] text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'text-[#F5F5F0]/50 hover:text-white'
                }`}
                title={option.durationDesc}
              >
                {option.shortLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
