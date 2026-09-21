import React, { useState, useEffect } from 'react';
import { 
  GripVertical, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  LayoutGrid, 
  Sliders, 
  Check, 
  Sparkles,
  ChevronDown,
  Columns2,
  Columns3,
  Move
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type WidgetSize = 'full' | 'half' | 'third' | 'large';

export interface DashboardWidgetItem {
  id: string;
  title: string;
  category: 'analytics' | 'temporal' | 'geospatial' | 'governance';
  size: WidgetSize;
  isVisible: boolean;
  order: number;
}

export const DEFAULT_WIDGET_CONFIGS: DashboardWidgetItem[] = [
  {
    id: 'temporal_slider',
    title: '24-Month Temporal Epoch Scrubber',
    category: 'temporal',
    size: 'full',
    isVisible: true,
    order: 0
  },
  {
    id: 'longitudinal_chart',
    title: 'Longitudinal Flourishing vs Stability Trajectory',
    category: 'analytics',
    size: 'full',
    isVisible: true,
    order: 1
  },
  {
    id: 'drift_monitor',
    title: 'Regenerative Drift Epistemic Watchdog',
    category: 'analytics',
    size: 'half',
    isVisible: true,
    order: 2
  },
  {
    id: 'spatial_heatmap',
    title: 'Geospatial Stewardship Density Heatmap',
    category: 'geospatial',
    size: 'half',
    isVisible: true,
    order: 3
  },
  {
    id: 'bioregional_map',
    title: 'Bioregional Telemetry & Sensor Mesh Map',
    category: 'geospatial',
    size: 'full',
    isVisible: true,
    order: 4
  },
  {
    id: 'epistemic_matrix',
    title: '5-Layer Epistemic Ground Truth Matrix',
    category: 'governance',
    size: 'full',
    isVisible: true,
    order: 5
  }
];

const LOCAL_STORAGE_KEY = 'atlas_customizable_grid_layout_v2';

interface CustomizableDashboardGridProps {
  renderWidget: (widgetId: string) => React.ReactNode;
  className?: string;
}

export const CustomizableDashboardGrid: React.FC<CustomizableDashboardGridProps> = ({
  renderWidget,
  className = ''
}) => {
  const [widgets, setWidgets] = useState<DashboardWidgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore parsing error
    }
    return DEFAULT_WIDGET_CONFIGS;
  });

  const [isCustomizeDrawerOpen, setIsCustomizeDrawerOpen] = useState<boolean>(false);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(widgets));
    } catch {
      // storage unavailable
    }
  }, [widgets]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.setData('text/plain', id);
    audioFeedback.playMicroTick();
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedWidgetId && draggedWidgetId !== id) {
      setDragOverWidgetId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) {
      setDraggedWidgetId(null);
      setDragOverWidgetId(null);
      return;
    }

    audioFeedback.playSubtleClick();

    setWidgets(prev => {
      const copy = [...prev];
      const draggedIndex = copy.findIndex(w => w.id === draggedWidgetId);
      const targetIndex = copy.findIndex(w => w.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const [removed] = copy.splice(draggedIndex, 1);
      copy.splice(targetIndex, 0, removed);

      return copy.map((w, idx) => ({ ...w, order: idx }));
    });

    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const handleToggleSize = (id: string, newSize: WidgetSize) => {
    audioFeedback.playMicroTick();
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
  };

  const handleToggleVisibility = (id: string) => {
    audioFeedback.playMicroTick();
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isVisible: !w.isVisible } : w));
  };

  const handleResetLayout = () => {
    audioFeedback.playCovenantResonance();
    setWidgets(DEFAULT_WIDGET_CONFIGS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleApplyPreset = (presetName: 'balanced' | 'geospatial' | 'drift' | 'trajectory') => {
    audioFeedback.playCovenantResonance();
    if (presetName === 'geospatial') {
      setWidgets([
        { ...DEFAULT_WIDGET_CONFIGS[3], size: 'full', isVisible: true, order: 0 }, // heatmap
        { ...DEFAULT_WIDGET_CONFIGS[4], size: 'full', isVisible: true, order: 1 }, // map
        { ...DEFAULT_WIDGET_CONFIGS[1], size: 'half', isVisible: true, order: 2 }, // chart
        { ...DEFAULT_WIDGET_CONFIGS[2], size: 'half', isVisible: true, order: 3 }, // drift
        { ...DEFAULT_WIDGET_CONFIGS[0], size: 'full', isVisible: true, order: 4 }, // temporal
        { ...DEFAULT_WIDGET_CONFIGS[5], size: 'full', isVisible: false, order: 5 }
      ]);
    } else if (presetName === 'drift') {
      setWidgets([
        { ...DEFAULT_WIDGET_CONFIGS[2], size: 'full', isVisible: true, order: 0 }, // drift monitor
        { ...DEFAULT_WIDGET_CONFIGS[1], size: 'full', isVisible: true, order: 1 }, // chart
        { ...DEFAULT_WIDGET_CONFIGS[0], size: 'full', isVisible: true, order: 2 }, // temporal
        { ...DEFAULT_WIDGET_CONFIGS[3], size: 'half', isVisible: true, order: 3 }, // heatmap
        { ...DEFAULT_WIDGET_CONFIGS[4], size: 'half', isVisible: true, order: 4 }, // map
        { ...DEFAULT_WIDGET_CONFIGS[5], size: 'full', isVisible: true, order: 5 }
      ]);
    } else if (presetName === 'trajectory') {
      setWidgets([
        { ...DEFAULT_WIDGET_CONFIGS[0], size: 'full', isVisible: true, order: 0 }, // temporal
        { ...DEFAULT_WIDGET_CONFIGS[1], size: 'full', isVisible: true, order: 1 }, // chart
        { ...DEFAULT_WIDGET_CONFIGS[2], size: 'half', isVisible: true, order: 2 }, // drift
        { ...DEFAULT_WIDGET_CONFIGS[3], size: 'half', isVisible: true, order: 3 }, // heatmap
        { ...DEFAULT_WIDGET_CONFIGS[4], size: 'full', isVisible: true, order: 4 },
        { ...DEFAULT_WIDGET_CONFIGS[5], size: 'full', isVisible: true, order: 5 }
      ]);
    } else {
      setWidgets(DEFAULT_WIDGET_CONFIGS);
    }
  };

  const getColSpanClass = (size: WidgetSize) => {
    switch (size) {
      case 'full': return 'col-span-12';
      case 'large': return 'col-span-12 lg:col-span-8';
      case 'half': return 'col-span-12 lg:col-span-6';
      case 'third': return 'col-span-12 sm:col-span-6 lg:col-span-4';
      default: return 'col-span-12';
    }
  };

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div id="customizable-dashboard-grid-root" className={`space-y-4 ${className}`}>
      {/* Workspace Customizer Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#0D120F] border border-[#C5A059]/30 rounded-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                WORKSPACE LAYOUT ENGINE
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-[#F5F5F0]/60 border border-[#F5F5F0]/10">
                DRAG &amp; DROP ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans">
              Drag by the handles to reorder charts or toggle panel sizes.
            </p>
          </div>
        </div>

        {/* Action Controls & Preset Pickers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Buttons */}
          <div className="flex items-center bg-[#141A16] border border-[#F5F5F0]/10 rounded px-1.5 py-1 text-[10px] font-mono text-[#F5F5F0]/60 gap-1">
            <span className="hidden md:inline">Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('balanced')}
              className="px-2 py-0.5 rounded hover:bg-[#1E2721] hover:text-white transition-colors cursor-pointer"
              title="Balanced Default Workspace"
            >
              Master
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('geospatial')}
              className="px-2 py-0.5 rounded hover:bg-[#1E2721] hover:text-white transition-colors cursor-pointer"
              title="Geospatial & Stewardship Focus"
            >
              Geospatial
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('drift')}
              className="px-2 py-0.5 rounded hover:bg-[#1E2721] hover:text-white transition-colors cursor-pointer"
              title="Drift & Epistemic Audit Focus"
            >
              Drift Focus
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('trajectory')}
              className="px-2 py-0.5 rounded hover:bg-[#1E2721] hover:text-white transition-colors cursor-pointer"
              title="Longitudinal Predictive Focus"
            >
              Trajectory
            </button>
          </div>

          {/* Toggle Panel Options Drawer */}
          <button
            type="button"
            onClick={() => {
              setIsCustomizeDrawerOpen(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isCustomizeDrawerOpen
                ? 'bg-[#C5A059] text-black border-[#C5A059]'
                : 'bg-[#151C17] border-[#C5A059]/50 text-[#C5A059] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isCustomizeDrawerOpen ? 'Close Editor' : 'Customize Panels'}</span>
          </button>

          {/* Reset Layout */}
          <button
            type="button"
            onClick={handleResetLayout}
            className="p-1.5 rounded bg-[#151C17] hover:bg-[#202922] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
            title="Reset to Default Layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slide-Down Customizer Panel */}
      {isCustomizeDrawerOpen && (
        <div className="p-4 bg-[#0A0E0C] border border-[#C5A059]/40 rounded-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10 text-xs font-mono">
            <span className="text-[#C5A059] font-bold uppercase tracking-wider">
              Widget Visibility &amp; Dimension Sizing
            </span>
            <span className="text-[#F5F5F0]/50 text-[10px]">
              Changes auto-save to browser memory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {widgets.map(widget => (
              <div 
                key={widget.id}
                className="p-2.5 bg-[#121814] rounded border border-[#F5F5F0]/10 flex items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-2 truncate">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(widget.id)}
                    className={`p-1 rounded cursor-pointer ${
                      widget.isVisible ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'
                    }`}
                    title={widget.isVisible ? 'Hide widget' : 'Show widget'}
                  >
                    {widget.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`truncate ${widget.isVisible ? 'text-white' : 'text-[#F5F5F0]/40 line-through'}`}>
                    {widget.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {(['full', 'half', 'third'] as WidgetSize[]).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleToggleSize(widget.id, size)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer border ${
                        widget.size === size
                          ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                          : 'bg-[#18201A] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Canvas for Reorderable Widgets */}
      <div className="grid grid-cols-12 gap-4">
        {sortedWidgets.filter(w => w.isVisible).map(widget => {
          const isDragging = draggedWidgetId === widget.id;
          const isOver = dragOverWidgetId === widget.id;

          return (
            <div
              key={widget.id}
              className={`${getColSpanClass(widget.size)} transition-all duration-200 relative group`}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDrop={(e) => handleDrop(e, widget.id)}
            >
              {/* Drop Target Visual Cue */}
              {isOver && (
                <div className="absolute inset-0 border-2 border-dashed border-[#C5A059] bg-[#C5A059]/10 rounded-md pointer-events-none z-30 animate-pulse" />
              )}

              {/* Panel Container Card */}
              <div className={`relative ${isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
                {/* Floating Drag Handle & Quick Sizer Toolbar */}
                <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm p-1 rounded border border-[#C5A059]/40 shadow-lg">
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, widget.id)}
                    className="p-1 text-[#C5A059] hover:text-white cursor-grab active:cursor-grabbing rounded"
                    title="Drag to reposition panel"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSize(widget.id, widget.size === 'full' ? 'half' : 'full')}
                    className="p-1 text-[#F5F5F0]/70 hover:text-white rounded"
                    title={widget.size === 'full' ? 'Contract panel to half width' : 'Expand panel to full width'}
                  >
                    {widget.size === 'full' ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </button>
                </div>

                {/* Render Widget Content */}
                {renderWidget(widget.id)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
