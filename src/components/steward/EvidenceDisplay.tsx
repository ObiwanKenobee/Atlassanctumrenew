/**
 * ATLAS STEWARD — EvidenceDisplay Component
 * AWS Agents for Humans Hackathon 2026 — Track: Good Neighbor Agents
 *
 * Renders the epistemic evidence grounding for agent recommendations:
 * - Claim, Source, Timestamp, and Confidence Level
 * - Distinct visual badges and styling for OBSERVED, MODELED, ESTIMATED, and VERIFIED data
 * - Transparent display of assumptions and epistemic unknowns
 */

import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Calculator,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { EvidenceItem, EvidenceCategory } from '../../lib/steward/types';

interface EvidenceDisplayProps {
  evidence: EvidenceItem[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onInspectRawData?: (item: EvidenceItem) => void;
}

const CATEGORY_CONFIG: Record<
  EvidenceCategory,
  {
    label: string;
    sublabel: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    cardBg: string;
    cardBorder: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    description: string;
  }
> = {
  OBSERVED: {
    label: 'OBSERVED DATA',
    sublabel: 'Direct Physical Measurement',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    cardBg: 'bg-emerald-950/20',
    cardBorder: 'border-emerald-500/20',
    icon: Activity,
    accentColor: '#10b981',
    description: 'Ground-truth telemetry from hardware sensors, transducer modbus registers, and physical meter logs.'
  },
  MODELED: {
    label: 'MODELED DATA',
    sublabel: 'Physics & Algorithmic Inferences',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
    cardBg: 'bg-cyan-950/20',
    cardBorder: 'border-cyan-500/20',
    icon: Layers,
    accentColor: '#06b6d4',
    description: 'Inferred through hydrodynamic flow physics, structural wear curves, and Strands memory patterns.'
  },
  ESTIMATED: {
    label: 'ESTIMATED DATA',
    sublabel: 'Projected Cost & Labor Scope',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    cardBg: 'bg-amber-950/20',
    cardBorder: 'border-amber-500/20',
    icon: Calculator,
    accentColor: '#f59e0b',
    description: 'Forward-looking supplier quotations, SLA repair durations, and labor allocations.'
  },
  VERIFIED: {
    label: 'VERIFIED DATA',
    sublabel: 'Post-Action Physical Confirmation',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-400',
    badgeBorder: 'border-purple-500/30',
    cardBg: 'bg-purple-950/20',
    cardBorder: 'border-purple-500/20',
    icon: ShieldCheck,
    accentColor: '#a855f7',
    description: 'Post-intervention sensor readings proving operational recovery and baseline restoration.'
  }
};

export const EvidenceDisplay: React.FC<EvidenceDisplayProps> = ({
  evidence,
  title = 'Epistemic Evidence & Grounding Layer',
  subtitle = 'Transparent classification of sensor measurements, algorithmic models, and quotes',
  compact = false,
  onInspectRawData
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | EvidenceCategory>('ALL');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvidence = selectedFilter === 'ALL'
    ? evidence
    : evidence.filter(item => item.category === selectedFilter);

  const categoryCounts = evidence.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Header with Title & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">{title}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              {evidence.length} Claims
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-slate-700 text-white shadow-sm border border-slate-600'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
            }`}
          >
            All ({evidence.length})
          </button>
          {(['OBSERVED', 'MODELED', 'ESTIMATED', 'VERIFIED'] as EvidenceCategory[]).map(cat => {
            const count = categoryCounts[cat] || 0;
            if (count === 0 && selectedFilter !== cat) return null;
            const config = CATEGORY_CONFIG[cat];
            const isSelected = selectedFilter === cat;
            const Icon = config.icon;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  isSelected
                    ? `${config.badgeBg} ${config.badgeText} border ${config.badgeBorder} shadow-sm`
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Epistemic Legend Card */}
      {!compact && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-slate-950/60 border border-slate-800/70 rounded-lg p-2.5 text-[11px]">
          {(['OBSERVED', 'MODELED', 'ESTIMATED', 'VERIFIED'] as EvidenceCategory[]).map(cat => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            return (
              <div key={cat} className="flex items-start gap-2 p-1.5 rounded bg-slate-900/40 border border-slate-800/40">
                <div className={`p-1 rounded ${config.badgeBg} ${config.badgeText} mt-0.5`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div>
                  <span className={`font-semibold ${config.badgeText}`}>{config.label}</span>
                  <p className="text-slate-400 text-[10px] leading-snug line-clamp-1">{config.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Evidence Items List */}
      <div className="space-y-2.5">
        {filteredEvidence.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
            No evidence items matching filter <span className="font-semibold text-slate-400">"{selectedFilter}"</span>.
          </div>
        ) : (
          filteredEvidence.map((item) => {
            const config = CATEGORY_CONFIG[item.category];
            const Icon = config.icon;
            const isExpanded = !!expandedItems[item.id];
            const hasAssumptions = item.unknownsOrAssumptions && item.unknownsOrAssumptions.length > 0;

            return (
              <div
                key={item.id}
                className={`rounded-lg border transition-all ${config.cardBg} ${config.cardBorder} hover:border-slate-700/80 p-3`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Category Badge & Icon */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                    >
                      <Icon className="w-3 h-3" />
                      [{item.category}]
                    </span>

                    {/* Source Tag */}
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 font-mono">
                      <Database className="w-3 h-3 text-slate-500" />
                      {item.source}
                    </span>

                    {/* Timestamp */}
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>

                  {/* Confidence Score Gauge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Confidence</span>
                      <span
                        className={`text-xs font-bold font-mono ${
                          item.confidenceScore >= 95
                            ? 'text-emerald-400'
                            : item.confidenceScore >= 80
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {item.confidenceScore}%
                      </span>
                    </div>
                    <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full ${
                          item.confidenceScore >= 95
                            ? 'bg-emerald-500'
                            : item.confidenceScore >= 80
                            ? 'bg-cyan-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Claim Text */}
                <div className="mt-2.5">
                  <p className="text-sm font-medium text-slate-100 leading-relaxed">
                    {item.claim}
                  </p>
                </div>

                {/* Assumptions & Unknowns Toggle */}
                {hasAssumptions && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-amber-400/90 hover:text-amber-300 font-medium"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>
                        {item.unknownsOrAssumptions!.length} Stated Assumption
                        {item.unknownsOrAssumptions!.length > 1 ? 's' : ''} & Caveat
                        {item.unknownsOrAssumptions!.length > 1 ? 's' : ''}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 pl-3 border-l-2 border-amber-500/40 space-y-1 bg-amber-950/20 p-2 rounded-r text-xs text-amber-200/90">
                        {item.unknownsOrAssumptions!.map((assumption, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-mono text-[10px] mt-0.5">•</span>
                            <span>{assumption}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Raw Telemetry Data Trigger */}
                {item.rawData && onInspectRawData && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onInspectRawData(item)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Inspect Raw Telemetry Payload</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
