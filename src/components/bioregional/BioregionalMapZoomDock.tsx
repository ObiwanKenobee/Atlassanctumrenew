import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Move,
  Sliders,
  Maximize2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalMapZoomDockProps {
  currentZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFineZoomIn?: () => void;
  onFineZoomOut?: () => void;
  onResetZoom: () => void;
  onRecenterNorth?: () => void;
  onPan?: (dx: number, dy: number) => void;
  onZoomTo?: (scale: number) => void;
  disabled?: boolean;
}

export const BioregionalMapZoomDock: React.FC<BioregionalMapZoomDockProps> = ({
  currentZoom,
  onZoomIn,
  onZoomOut,
  onFineZoomIn,
  onFineZoomOut,
  onResetZoom,
  onRecenterNorth,
  onPan,
  onZoomTo,
  disabled = false
}) => {
  const [showNavPad, setShowNavPad] = useState<boolean>(false);
  const [showSlider, setShowSlider] = useState<boolean>(false);

  // Pan step in pixels
  const PAN_STEP = 65;

  return (
    <div 
      className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 p-1.5 rounded-xl bg-black/90 backdrop-blur-md border border-[#1B3022] shadow-2xl z-20 pointer-events-auto select-none"
      role="group"
      aria-label="Map Navigation & Zoom Controls"
    >
      {/* Zoom In Button (Standard +35%) */}
      <button
        onClick={() => {
          audioFeedback.playMicroTick();
          onZoomIn();
        }}
        disabled={disabled}
        className="w-8 h-8 rounded-lg bg-[#111A13] hover:bg-[#1B3022] active:scale-95 text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] hover:border-[#C5A059]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm group disabled:opacity-40 disabled:cursor-not-allowed"
        title="Zoom In (+35%) [Key: + or =]"
        aria-label="Zoom In"
      >
        <ZoomIn className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>

      {/* Fine-Grained Zoom In (+15%) */}
      {onFineZoomIn && (
        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            onFineZoomIn();
          }}
          disabled={disabled}
          className="w-8 h-5 rounded bg-black/70 hover:bg-[#1B3022] text-[#C5A059] hover:text-white border border-white/5 hover:border-[#C5A059]/30 flex items-center justify-center text-[9px] font-mono font-bold transition-all cursor-pointer disabled:opacity-40"
          title="Fine Zoom In (+15% micro-step)"
          aria-label="Fine Zoom In"
        >
          +15%
        </button>
      )}

      {/* Zoom Level Indicator / Click to toggle precision slider */}
      <button
        onClick={() => {
          audioFeedback.playMicroTick();
          setShowSlider(!showSlider);
        }}
        className="w-8 py-1 rounded bg-black/60 hover:bg-[#1B3022] border border-white/5 hover:border-[#C5A059]/30 text-center text-[10px] font-mono font-bold text-emerald-400 hover:text-[#C5A059] transition-all cursor-pointer"
        title={`Current Zoom: ${currentZoom.toFixed(1)}x • Click to toggle precision slider`}
      >
        {currentZoom.toFixed(1)}x
      </button>

      {/* Precision Zoom Slider Popout */}
      {showSlider && onZoomTo && (
        <div className="absolute right-12 top-14 p-2.5 rounded-lg bg-black/95 border border-[#1B3022] shadow-2xl flex flex-col items-center gap-2 z-30 w-36">
          <div className="flex items-center justify-between w-full text-[9px] font-mono text-[#F5F5F0]/70">
            <span className="text-[#C5A059] font-bold">Zoom Slider</span>
            <span className="text-emerald-400 font-bold">{currentZoom.toFixed(1)}x</span>
          </div>
          <input 
            type="range"
            min="0.8"
            max="8.0"
            step="0.1"
            value={currentZoom}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onZoomTo(val);
            }}
            className="w-full accent-[#C5A059] h-1.5 bg-[#1B3022] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between w-full text-[8px] font-mono text-[#F5F5F0]/40">
            <span>0.8x</span>
            <span>4.0x</span>
            <span>8.0x</span>
          </div>
        </div>
      )}

      {/* Fine-Grained Zoom Out (-12%) */}
      {onFineZoomOut && (
        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            onFineZoomOut();
          }}
          disabled={disabled}
          className="w-8 h-5 rounded bg-black/70 hover:bg-[#1B3022] text-[#C5A059] hover:text-white border border-white/5 hover:border-[#C5A059]/30 flex items-center justify-center text-[9px] font-mono font-bold transition-all cursor-pointer disabled:opacity-40"
          title="Fine Zoom Out (-12% micro-step)"
          aria-label="Fine Zoom Out"
        >
          -12%
        </button>
      )}

      {/* Zoom Out Button (Standard -25%) */}
      <button
        onClick={() => {
          audioFeedback.playMicroTick();
          onZoomOut();
        }}
        disabled={disabled}
        className="w-8 h-8 rounded-lg bg-[#111A13] hover:bg-[#1B3022] active:scale-95 text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] hover:border-[#C5A059]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm group disabled:opacity-40 disabled:cursor-not-allowed"
        title="Zoom Out (-25%) [Key: -]"
        aria-label="Zoom Out"
      >
        <ZoomOut className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>

      <div className="w-5 h-[1px] bg-[#1B3022] my-0.5" />

      {/* Manual Pan Navigation Pad Toggle */}
      {onPan && (
        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            setShowNavPad(!showNavPad);
          }}
          className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center cursor-pointer border shadow-sm ${
            showNavPad
              ? 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]/60'
              : 'bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0]/70 hover:text-white border-[#1B3022]'
          }`}
          title="Manual Navigation Pan D-Pad (North, South, East, West)"
          aria-label="Manual Pan Navigation D-Pad"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Directional Manual Pan D-Pad Popout */}
      {showNavPad && onPan && (
        <div className="absolute right-12 top-28 p-2 rounded-xl bg-black/95 border border-[#1B3022] shadow-2xl flex flex-col items-center gap-1 z-30">
          <div className="text-[8.5px] font-mono text-[#C5A059] font-bold pb-0.5">Pan Surface</div>
          {/* North */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onPan(0, PAN_STEP);
            }}
            className="w-7 h-7 rounded bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] flex items-center justify-center transition-all cursor-pointer"
            title="Pan North"
            aria-label="Pan North"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          {/* West & East */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onPan(PAN_STEP, 0);
              }}
              className="w-7 h-7 rounded bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] flex items-center justify-center transition-all cursor-pointer"
              title="Pan West"
              aria-label="Pan West"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded bg-black/60 border border-white/5 flex items-center justify-center text-[9px] font-mono text-[#F5F5F0]/40">
              PAD
            </div>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onPan(-PAN_STEP, 0);
              }}
              className="w-7 h-7 rounded bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] flex items-center justify-center transition-all cursor-pointer"
              title="Pan East"
              aria-label="Pan East"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* South */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onPan(0, -PAN_STEP);
            }}
            className="w-7 h-7 rounded bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] flex items-center justify-center transition-all cursor-pointer"
            title="Pan South"
            aria-label="Pan South"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reset Extent Button */}
      <button
        onClick={() => {
          audioFeedback.playMicroTick();
          onResetZoom();
        }}
        disabled={disabled}
        className="w-8 h-8 rounded-lg bg-[#111A13] hover:bg-[#1B3022] active:scale-95 text-[#F5F5F0]/70 hover:text-white border border-[#1B3022] hover:border-[#C5A059]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
        title="Reset Map Extent (1.0x)"
        aria-label="Reset Map Extent"
      >
        <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-90" />
      </button>

      {/* North Compass Re-center */}
      {onRecenterNorth && (
        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            onRecenterNorth();
          }}
          disabled={disabled}
          className="w-8 h-8 rounded-lg bg-[#111A13] hover:bg-[#1B3022] active:scale-95 text-[#C5A059] border border-[#1B3022] hover:border-[#C5A059]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
          title="Re-orient North"
          aria-label="Re-orient North"
        >
          <Compass className="w-4 h-4 transition-transform group-hover:rotate-45 text-[#C5A059]" />
        </button>
      )}
    </div>
  );
};

