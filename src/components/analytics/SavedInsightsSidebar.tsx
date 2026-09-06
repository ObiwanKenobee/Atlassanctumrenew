import React, { useState } from 'react';
import {
  Bookmark,
  Camera,
  X,
  Play,
  Trash2,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Tag,
  Palette,
  TrendingUp,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

export interface SavedInsightSnapshot {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: string;
  tags: string[];
  state: {
    timeRange: '24h' | '7d' | '30d';
    selectedBioregion: string;
    comparisonMode: boolean;
    comparisonPeriod: 'prior_period' | 'historical_baseline' | 'target_scenario';
    colorPalette: 'default' | 'high_contrast';
    predictiveEnabled: boolean;
    predictiveHorizonMonths: number;
    predictiveScenario: 'baseline_ols' | 'accelerated_adoption' | 'conservation';
    showConfidenceInterval: boolean;
    annotations: any[];
    externalFeedEnabled: boolean;
  };
}

export const PRESET_SAVED_INSIGHTS: SavedInsightSnapshot[] = [
  {
    id: 'insight-mara-predictive',
    title: 'Mara Basin Predictive Resource Trajectory',
    description: 'Quarterly predictive linear regression model with accelerated solar adoption and high-contrast accessibility palette.',
    createdAt: '2026-08-14 10:30',
    author: 'Chief Epistemic Auditor',
    tags: ['Mara', 'Regression', 'Solar Surplus'],
    state: {
      timeRange: '7d',
      selectedBioregion: 'mara',
      comparisonMode: true,
      comparisonPeriod: 'prior_period',
      colorPalette: 'default',
      predictiveEnabled: true,
      predictiveHorizonMonths: 3,
      predictiveScenario: 'accelerated_adoption',
      showConfidenceInterval: true,
      annotations: [],
      externalFeedEnabled: true
    }
  },
  {
    id: 'insight-aberdare-catchment',
    title: 'Aberdare Catchment Aquifer Quorum & High Contrast',
    description: 'High-contrast audit view isolating cloud forest water recharge rates and 30-day steward mobilization velocity.',
    createdAt: '2026-07-28 16:45',
    author: 'Aberdare Watershed Guild',
    tags: ['Water', 'Aberdare', 'WCAG AAA'],
    state: {
      timeRange: '30d',
      selectedBioregion: 'aberdare',
      comparisonMode: false,
      comparisonPeriod: 'historical_baseline',
      colorPalette: 'high_contrast',
      predictiveEnabled: false,
      predictiveHorizonMonths: 2,
      predictiveScenario: 'baseline_ols',
      showConfidenceInterval: false,
      annotations: [],
      externalFeedEnabled: false
    }
  }
];

interface SavedInsightsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedInsights: SavedInsightSnapshot[];
  onSaveInsight: (insight: SavedInsightSnapshot) => void;
  onRecallInsight: (insight: SavedInsightSnapshot) => void;
  onDeleteInsight: (id: string) => void;
  currentState: SavedInsightSnapshot['state'];
  onShowToast: (msg: string) => void;
}

export const SavedInsightsSidebar: React.FC<SavedInsightsSidebarProps> = ({
  isOpen,
  onClose,
  savedInsights,
  onSaveInsight,
  onRecallInsight,
  onDeleteInsight,
  currentState,
  onShowToast
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAuthor, setNewAuthor] = useState('Senior Ecological Auditor');
  const [newTagInput, setNewTagInput] = useState('Bioregional, Audit');

  if (!isOpen) return null;

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast('Please provide a title for the snapshot');
      return;
    }

    const tags = newTagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const snapshot: SavedInsightSnapshot = {
      id: `insight-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom analytical snapshot capturing filtered dataset and visual configurations.',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      author: newAuthor.trim() || 'Steward',
      tags: tags.length > 0 ? tags : ['Analytics', 'Snapshot'],
      state: { ...currentState }
    };

    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playSuccess();
    onSaveInsight(snapshot);
    onShowToast(`Saved Insight: "${snapshot.title}"`);
    setIsCapturing(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleExportJson = (insight: SavedInsightSnapshot) => {
    try {
      const blob = new Blob([JSON.stringify(insight, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `atlas-insight-${insight.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
      onShowToast(`Exported "${insight.title}" to JSON`);
    } catch {
      onShowToast('Export failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-full max-w-md bg-[#090F0B] border-l border-white/15 h-full flex flex-col shadow-2xl text-[#F5F5F0]"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#060A08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Saved Insights & Snapshots
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Recall saved filters, regression models, annotations, and chart configurations.
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

        {/* Action Trigger Banner */}
        <div className="p-4 bg-[#0B130E] border-b border-white/10">
          {!isCapturing ? (
            <button
              onClick={() => {
                hapticFeedback.triggerLightClickHaptic();
                audioFeedback.playMicroTick();
                setIsCapturing(true);
                setNewTitle(`Bioregional Snapshot — ${new Date().toLocaleDateString()}`);
              }}
              className="w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer font-mono text-xs"
            >
              <Camera className="w-4 h-4" />
              <span>Snapshot Current View</span>
            </button>
          ) : (
            <form onSubmit={handleCreateSnapshot} className="space-y-3 font-mono text-xs bg-black/40 p-3.5 rounded-xl border border-[#C5A059]/40">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="font-bold text-[#C5A059] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Save Current Analytics State
                </span>
                <button
                  type="button"
                  onClick={() => setIsCapturing(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Insight Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Q3 Energy Forecast"
                  className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description / Thesis:</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Key observations or scenario hypothesis..."
                  className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2 text-neutral-200 focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">Author:</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-1.5 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Tags (comma):</label>
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-1.5 text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCapturing(false)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save Insight
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Insight Cards List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 font-mono text-xs">
          <div className="text-[11px] text-neutral-400 flex items-center justify-between pb-1">
            <span>SAVED INSIGHT REPOSITORY ({savedInsights.length})</span>
          </div>

          {savedInsights.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-neutral-600" />
              <p>No saved snapshots yet.</p>
              <p className="text-[11px] text-neutral-500">
                Click &quot;Snapshot Current View&quot; above to capture filters and model settings.
              </p>
            </div>
          ) : (
            savedInsights.map(insight => (
              <div
                key={insight.id}
                className="p-4 rounded-xl bg-[#0B130E] border border-white/10 hover:border-[#C5A059]/40 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#C5A059] transition-colors">
                      {insight.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {insight.createdAt} • by {insight.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleExportJson(insight)}
                      className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                      title="Export snapshot as JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteInsight(insight.id)}
                      className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40 cursor-pointer"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-neutral-300 font-sans text-xs line-clamp-2">
                  {insight.description}
                </p>

                {/* State Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                    Range: {insight.state.timeRange.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                    Bioregion: {insight.state.selectedBioregion.toUpperCase()}
                  </span>
                  {insight.state.predictiveEnabled && (
                    <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" /> Forecast ON (+{insight.state.predictiveHorizonMonths}m)
                    </span>
                  )}
                  {insight.state.colorPalette === 'high_contrast' && (
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      High Contrast
                    </span>
                  )}
                  {insight.state.comparisonMode && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                      Compare Baseline
                    </span>
                  )}
                  {insight.state.annotations && insight.state.annotations.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                      {insight.state.annotations.length} Annotations
                    </span>
                  )}
                </div>

                {/* Tags */}
                {insight.tags && insight.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[9px] text-neutral-400">
                    {insight.tags.map(t => (
                      <span key={t} className="text-neutral-500">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recall Button */}
                <button
                  onClick={() => onRecallInsight(insight)}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/40 border border-white/10 text-neutral-200 hover:text-[#C5A059] rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Recall & Apply Configuration</span>
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
