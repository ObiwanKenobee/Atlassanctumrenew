import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Maximize2, 
  Layers, 
  Calendar, 
  ArrowLeftRight, 
  Sparkles,
  Camera,
  Check,
  Eye,
  Sliders
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface MapSnapshot {
  id: string;
  timestamp: string;
  dataUrl: string;
  zoomLevel: number;
  projection: 'globe' | 'mercator';
  layerMode: string;
  hazardCount: number;
  year?: number;
  bioregionFocus?: string;
  notes?: string;
}

interface SnapshotGalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: MapSnapshot[];
  onDeleteSnapshot: (id: string) => void;
  onSelectSnapshot?: (snapshot: MapSnapshot) => void;
}

export const SnapshotGalleryDrawer: React.FC<SnapshotGalleryDrawerProps> = ({
  isOpen,
  onClose,
  snapshots,
  onDeleteSnapshot,
  onSelectSnapshot
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage 0-100 for slider
  const [previewSnapshot, setPreviewSnapshot] = useState<MapSnapshot | null>(null);

  if (!isOpen) return null;

  const handleToggleCompareSelect = (id: string) => {
    audioFeedback.playMicroTick();
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        // Replace second item
        setSelectedForCompare([selectedForCompare[0], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleDownloadSnapshot = (snap: MapSnapshot) => {
    audioFeedback.playSyncComplete();
    const downloadLink = document.createElement('a');
    downloadLink.href = snap.dataUrl;
    downloadLink.download = `hazard-snapshot-${snap.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const comparedSnaps = snapshots.filter(s => selectedForCompare.includes(s.id));
  const snapLeft = comparedSnaps[0] || snapshots[0] || null;
  const snapRight = comparedSnaps[1] || snapshots[1] || snapshots[0] || null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-label="Snapshot Gallery and Comparison Drawer"
    >
      <div className="relative w-full max-w-2xl sm:max-w-3xl h-full bg-[#090F0B] border-l border-[#1B3022] shadow-2xl flex flex-col overflow-hidden select-none">
        {/* Top Header */}
        <div className="p-4 border-b border-[#1B3022] flex items-center justify-between gap-3 bg-black/60">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Telemetry Snapshot Gallery
              </h2>
              <p className="text-[11px] font-mono text-[#F5F5F0]/60">
                {snapshots.length} high-resolution captures archived in session memory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {snapshots.length >= 2 && (
              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setCompareMode(!compareMode);
                  if (!compareMode && selectedForCompare.length < 2) {
                    setSelectedForCompare([snapshots[0].id, snapshots[1].id]);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  compareMode
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/80 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-[#152319] hover:bg-[#1E3324] text-[#C5A059] border-[#2A4630]'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{compareMode ? 'Exit Comparison' : 'Compare Side-by-Side'}</span>
              </button>
            )}

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#111A13] hover:bg-rose-950/60 text-[#F5F5F0]/70 hover:text-white border border-white/10 hover:border-rose-500/40 transition-colors cursor-pointer"
              title="Close Drawer"
              aria-label="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {compareMode && snapLeft && snapRight ? (
            /* Side-by-Side Comparison Workspace */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-black/60 border border-[#1B3022] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-white font-bold">Temporal Split Comparison</span>
                </div>
                <div className="text-[11px] text-[#F5F5F0]/70">
                  Select any 2 captures from the gallery below to compare evolution
                </div>
              </div>

              {/* Side-by-side Dual Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Left Snapshot */}
                <div className="p-3 rounded-xl bg-black/80 border border-[#1B3022] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/40 text-teal-300 font-bold">
                      A: {snapLeft.year ? `Year ${snapLeft.year}` : 'Capture A'}
                    </span>
                    <span className="text-[10px] text-[#F5F5F0]/50">{snapLeft.timestamp}</span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
                    <img 
                      src={snapLeft.dataUrl} 
                      alt="Telemetry Snapshot A" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-[10px] font-mono space-y-1 text-[#F5F5F0]/70">
                    <div className="flex justify-between">
                      <span>Projection: <strong className="text-white">{snapLeft.projection}</strong></span>
                      <span>Zoom: <strong className="text-emerald-400">{snapLeft.zoomLevel}x</strong></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Layer: <strong className="text-[#C5A059]">{snapLeft.layerMode}</strong></span>
                      <span>Beacons: <strong className="text-rose-400">{snapLeft.hazardCount}</strong></span>
                    </div>
                    {snapLeft.notes && (
                      <p className="text-[9.5px] text-[#F5F5F0]/60 italic pt-1 border-t border-white/5">
                        {snapLeft.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Snapshot */}
                <div className="p-3 rounded-xl bg-black/80 border border-[#1B3022] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
                      B: {snapRight.year ? `Year ${snapRight.year}` : 'Capture B'}
                    </span>
                    <span className="text-[10px] text-[#F5F5F0]/50">{snapRight.timestamp}</span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
                    <img 
                      src={snapRight.dataUrl} 
                      alt="Telemetry Snapshot B" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="text-[10px] font-mono space-y-1 text-[#F5F5F0]/70">
                    <div className="flex justify-between">
                      <span>Projection: <strong className="text-white">{snapRight.projection}</strong></span>
                      <span>Zoom: <strong className="text-emerald-400">{snapRight.zoomLevel}x</strong></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Layer: <strong className="text-[#C5A059]">{snapRight.layerMode}</strong></span>
                      <span>Beacons: <strong className="text-rose-400">{snapRight.hazardCount}</strong></span>
                    </div>
                    {snapRight.notes && (
                      <p className="text-[9.5px] text-[#F5F5F0]/60 italic pt-1 border-t border-white/5">
                        {snapRight.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Grid of Snapshots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">
                {compareMode ? 'Select Snapshots to Compare (2)' : 'Archived High-Res Captures'}
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                Click capture to preview full scale
              </span>
            </div>

            {snapshots.length === 0 ? (
              <div className="p-8 rounded-xl bg-black/40 border border-dashed border-[#1B3022] text-center space-y-2">
                <Camera className="w-8 h-8 text-[#C5A059]/50 mx-auto" />
                <div className="text-sm font-mono text-white font-bold">No Snapshots Captured Yet</div>
                <p className="text-xs font-mono text-[#F5F5F0]/60 max-w-sm mx-auto">
                  Click the <strong>'Capture View'</strong> button in the radar toolbar to generate a high-resolution 2x telemetry capture with cryptographic provenance headers.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {snapshots.map((snap) => {
                  const isChecked = selectedForCompare.includes(snap.id);
                  return (
                    <div
                      key={snap.id}
                      className={`p-3 rounded-xl bg-black/70 border transition-all space-y-2 ${
                        isChecked
                          ? 'border-[#C5A059] ring-1 ring-[#C5A059]/40 bg-[#142318]'
                          : 'border-[#1B3022] hover:border-white/20'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div 
                        onClick={() => setPreviewSnapshot(snap)}
                        className="relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-video cursor-pointer group"
                      >
                        <img 
                          src={snap.dataUrl} 
                          alt="Telemetry Snapshot" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        {snap.year && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-emerald-400 font-bold">
                            {snap.year}
                          </div>
                        )}
                      </div>

                      {/* Details & Actions */}
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#F5F5F0]/70 truncate max-w-[140px]">
                          {snap.timestamp}
                        </span>
                        <span className="text-[#C5A059] font-bold">
                          {snap.zoomLevel}x • {snap.projection}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 gap-1.5">
                        <button
                          onClick={() => handleToggleCompareSelect(snap.id)}
                          className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 cursor-pointer border transition-colors ${
                            isChecked
                              ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                              : 'bg-black/60 text-[#F5F5F0]/70 hover:text-white border-white/10'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isChecked ? 'Comparing' : 'Compare'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDownloadSnapshot(snap)}
                            className="p-1 rounded bg-black/60 hover:bg-[#1B3022] text-[#C5A059] hover:text-white border border-white/10 cursor-pointer"
                            title="Download PNG"
                            aria-label="Download PNG"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteSnapshot(snap.id)}
                            className="p-1 rounded bg-black/60 hover:bg-rose-950 text-[#F5F5F0]/60 hover:text-rose-300 border border-white/10 cursor-pointer"
                            title="Delete Capture"
                            aria-label="Delete Capture"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Full Image Preview Modal */}
        {previewSnapshot && (
          <div 
            className="fixed inset-0 z-60 bg-black/90 flex flex-col p-4 animate-fade-in"
            onClick={() => setPreviewSnapshot(null)}
          >
            <div className="flex justify-between items-center mb-2 px-2 text-white font-mono text-xs">
              <span>{previewSnapshot.timestamp} (Full View)</span>
              <button 
                onClick={() => setPreviewSnapshot(null)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-2">
              <img 
                src={previewSnapshot.dataUrl} 
                alt="Full Telemetry Snapshot" 
                className="max-w-full max-h-full object-contain rounded-lg border border-[#C5A059]/40 shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
