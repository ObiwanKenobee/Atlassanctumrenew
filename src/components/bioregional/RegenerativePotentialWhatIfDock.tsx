import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Sliders, 
  TrendingDown, 
  TreePine, 
  Droplets, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  X,
  Play,
  RotateCcw,
  Info
} from 'lucide-react';
import { 
  REGENERATIVE_POTENTIAL_ZONES, 
  RegenerativeInterventionZone, 
  WhatIfScenarioState,
  calculateProjectedImprovement 
} from '../../data/regenerativePotentialData';
import { audioFeedback } from '../../lib/audioFeedback';

interface RegenerativePotentialWhatIfDockProps {
  scenario: WhatIfScenarioState;
  onChangeScenario: (updated: WhatIfScenarioState) => void;
  selectedZone: RegenerativeInterventionZone | null;
  onSelectZone: (zone: RegenerativeInterventionZone | null) => void;
  onFlyToCoordinates: (coords: [number, number], zoom?: number) => void;
  isLayerActive: boolean;
  onToggleLayer: () => void;
}

export const RegenerativePotentialWhatIfDock: React.FC<RegenerativePotentialWhatIfDockProps> = ({
  scenario,
  onChangeScenario,
  selectedZone,
  onSelectZone,
  onFlyToCoordinates,
  isLayerActive,
  onToggleLayer
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleIntensityChange = (val: number) => {
    audioFeedback.playMicroTick();
    onChangeScenario({
      ...scenario,
      interventionIntensity: val
    });
  };

  const handleStrategyChange = (strat: WhatIfScenarioState['activeStrategy']) => {
    audioFeedback.playSubtleClick();
    onChangeScenario({
      ...scenario,
      activeStrategy: strat
    });
  };

  const handleReset = () => {
    audioFeedback.playSubtleClick();
    onChangeScenario({
      interventionIntensity: 75,
      activeStrategy: 'holistic',
      simulatedHorizonYear: 2028
    });
  };

  return (
    <div 
      id="regenerative-potential-whatif-dock"
      className="absolute top-4 right-4 z-30 max-w-sm w-full bg-[#080E0A]/90 backdrop-blur-md border border-emerald-500/40 rounded-xl shadow-2xl overflow-hidden text-[#F5F5F0] transition-all"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#0D1C12] via-[#0A160E] to-[#0D1C12] border-b border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-300">
                Regenerative Potential Layer
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                WHAT-IF
              </span>
            </div>
            <span className="text-[10px] text-white/50 font-sans">
              Predictive ecological restoration scenarios
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Layer Active Toggle */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onToggleLayer();
            }}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              isLayerActive
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                : 'bg-black/60 text-white/40 border-white/10 hover:text-white'
            }`}
            title={isLayerActive ? 'Hide Regenerative Layer' : 'Show Regenerative Layer'}
          >
            {isLayerActive ? 'LAYER ON' : 'LAYER OFF'}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-3.5 space-y-3.5 text-xs font-mono max-h-[75vh] overflow-y-auto">
          {/* Quick Notice if Layer is Off */}
          {!isLayerActive && (
            <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-amber-300/80 flex items-center justify-between">
              <span>Layer is currently toggled off.</span>
              <button 
                onClick={onToggleLayer}
                className="text-emerald-400 underline font-bold cursor-pointer"
              >
                Enable Layer
              </button>
            </div>
          )}

          {/* Intervention Intensity Slider */}
          <div className="space-y-1.5 p-2.5 rounded-lg bg-black/40 border border-emerald-950">
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Intervention Scale:
              </span>
              <span className="text-emerald-400 font-bold text-sm">
                {scenario.interventionIntensity}% Scale
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={scenario.interventionIntensity}
              onChange={(e) => handleIntensityChange(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />

            <div className="flex justify-between text-[9px] text-white/40 pt-0.5">
              <span>0% (Status Quo)</span>
              <span>50% (Pilot)</span>
              <span>100% (Full Bioregional)</span>
            </div>
          </div>

          {/* Intervention Strategy Selector */}
          <div className="space-y-1.5">
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">
              Restoration Paradigm
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'holistic', label: 'Holistic Matrix' },
                { id: 'hydrology', label: 'Wetland & Aquifer' },
                { id: 'soil_carbon', label: 'Peat & Biochar' },
                { id: 'canopy', label: 'Broadleaf Canopy' }
              ].map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => handleStrategyChange(strat.id as any)}
                  className={`p-1.5 rounded text-[10px] font-mono transition-all text-left truncate cursor-pointer border ${
                    scenario.activeStrategy === strat.id
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold shadow-sm'
                      : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {strat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aggregate What-If Projections Strip */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-2 rounded bg-black/40 border border-emerald-900/40">
              <div className="text-[9px] text-white/40">Avg Hazard Δ</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                -{Math.round(scenario.interventionIntensity * 0.65)}%
              </div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-emerald-900/40">
              <div className="text-[9px] text-white/40">Water Lens Δ</div>
              <div className="text-xs font-bold text-cyan-400 mt-0.5">
                +{(scenario.interventionIntensity * 0.038).toFixed(1)}m
              </div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-emerald-900/40">
              <div className="text-[9px] text-white/40">Biomass Δ</div>
              <div className="text-xs font-bold text-amber-300 mt-0.5">
                +{(scenario.interventionIntensity * 0.48).toFixed(0)} t/ha
              </div>
            </div>
          </div>

          {/* Selected Intervention Zone Inspector */}
          {selectedZone ? (
            (() => {
              const proj = calculateProjectedImprovement(selectedZone, scenario);
              return (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 border border-emerald-500/40">
                        {selectedZone.interventionLabel}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-white mt-1">
                        {selectedZone.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => onSelectZone(null)}
                      className="text-white/40 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                    {selectedZone.description}
                  </p>

                  {/* Impact Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-emerald-500/20">
                    <div className="space-y-0.5">
                      <div className="text-white/40">Baseline Hazard Score:</div>
                      <div className="font-bold text-rose-400">{selectedZone.baselineHazardScore}/100</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-white/40">Projected Hazard:</div>
                      <div className="font-bold text-emerald-400">
                        {proj.projectedHazardScore}/100 (-{proj.effectiveHazardReduction}%)
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-white/40">Biomass Potential:</div>
                      <div className="font-bold text-amber-300">+{proj.projectedBiomassGain} t/ha</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-white/40">Water Table Gain:</div>
                      <div className="font-bold text-cyan-300">+{proj.projectWaterTableGain} m</div>
                    </div>
                  </div>

                  {/* Ground Data Calibration Source */}
                  <div className="p-2 rounded bg-black/60 border border-emerald-500/20 text-[9px] text-white/60 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Empirical Ground Telemetry Source:</span>
                    </div>
                    <div>{selectedZone.localDataSource}</div>
                    <div className="font-mono text-white/40 truncate">
                      Audit Hash: {selectedZone.calibrationAuditProof} ({selectedZone.confidenceScore}% confidence)
                    </div>
                  </div>

                  {/* Fly to Zone Action */}
                  <button
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      onFlyToCoordinates(selectedZone.coordinates, 4.5);
                    }}
                    className="w-full py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Focus Map on Zone</span>
                  </button>
                </div>
              );
            })()
          ) : (
            <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
              <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#C5A059]" />
                Select a Restoration Zone to Inspect:
              </div>
              <div className="space-y-1">
                {REGENERATIVE_POTENTIAL_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      audioFeedback.playMicroTick();
                      onSelectZone(zone);
                      onFlyToCoordinates(zone.coordinates, 4.5);
                    }}
                    className="w-full p-2 rounded bg-black/40 hover:bg-[#141E17] border border-white/10 hover:border-emerald-500/40 text-left text-[11px] text-white/80 hover:text-emerald-300 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2">{zone.name}</span>
                    <span className="text-[9px] font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                      -{zone.maxHazardReductionPct}% &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset / Controls Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/40">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Scenario</span>
            </button>
            <span>Target Horizon: 2028-2030</span>
          </div>
        </div>
      )}
    </div>
  );
};
