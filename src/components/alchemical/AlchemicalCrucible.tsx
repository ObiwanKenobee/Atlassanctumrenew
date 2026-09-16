import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  FileCheck,
  ShieldCheck,
  Award,
  Zap
} from 'lucide-react';
import { 
  TRANSMUTATION_RECIPES, 
  ALCHEMICAL_STAGES 
} from '../../data/alchemicalData';
import { 
  TransmutationRecipe, 
  AlchemicalStage, 
  TransmutationCertificate 
} from '../../types/alchemical';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

export const AlchemicalCrucible: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<TransmutationRecipe>(TRANSMUTATION_RECIPES[0]);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isTransmuting, setIsTransmuting] = useState<boolean>(false);
  const [completedStages, setCompletedStages] = useState<AlchemicalStage[]>([]);
  const [certificate, setCertificate] = useState<TransmutationCertificate | null>(null);
  const [temperature, setTemperature] = useState<number>(450); // Celsius in crucible

  const currentStage = ALCHEMICAL_STAGES[currentStageIdx];

  const handleAdvanceStage = () => {
    if (isTransmuting) return;
    setIsTransmuting(true);

    const stageKey = currentStage.stage;
    alchemicalAudio.playTransmutationPulse(stageKey);

    // Dynamic temperature curve based on stage
    const nextTemps = [650, 850, 1150, 1618];
    setTemperature(nextTemps[currentStageIdx] || 1618);

    setTimeout(() => {
      setCompletedStages(prev => [...new Set([...prev, stageKey])]);
      setIsTransmuting(false);

      if (currentStageIdx < ALCHEMICAL_STAGES.length - 1) {
        setCurrentStageIdx(prev => prev + 1);
      } else {
        // Complete Magnum Opus! Generate Certificate of Quintessence
        const newCert: TransmutationCertificate = {
          certificateId: `MAGNUM-OPUS-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          recipeName: selectedRecipe.leadName,
          leadTransmuted: `${(selectedRecipe.toxicityWeightKg / 1000).toLocaleString()} metric tons`,
          goldProduced: selectedRecipe.transmutedGoldName,
          quintessenceExtracted: `+${selectedRecipe.flourishingBoost}% Living Flourishing Index`,
          merkleSeal: `0x7F${Math.random().toString(16).substring(2, 10).toUpperCase()}...PHI-1.618`,
          goldenRatioQuotient: 1.6180339887,
          witnessArchetype: 'alchemist'
        };
        setCertificate(newCert);
        alchemicalAudio.playSingingBowl(852, 4.0);
      }
    }, 1200);
  };

  const handleResetCrucible = () => {
    setCurrentStageIdx(0);
    setCompletedStages([]);
    setCertificate(null);
    setTemperature(450);
    alchemicalAudio.playSingingBowl(432, 2.0);
  };

  const handleSelectRecipe = (recipe: TransmutationRecipe) => {
    setSelectedRecipe(recipe);
    handleResetCrucible();
  };

  return (
    <div className="space-y-6">
      {/* Crucible Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            The Magnum Opus Transmutation Crucible
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            Transmuting Ecological Lead into Living Gold
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            Solve et Coagula. In the sacred furnace of Atlas Sanctum, extractive debt, chemical poisons, and cynical despair are subjected to the four hermetic fires until the indestructible Quintessence is realized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetCrucible}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] text-xs font-mono text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Crucible
          </button>
        </div>
      </div>

      {/* Select Toxic Matter to Transmute */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
          1. Select Heavy Lead / Systemic Toxicity to Transmute:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TRANSMUTATION_RECIPES.map((r) => {
            const isSelected = selectedRecipe.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelectRecipe(r)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-400 text-white shadow-[0_0_15px_rgba(217,119,6,0.2)]'
                    : 'bg-[#111111] border-[#F5F5F0]/10 text-[#F5F5F0]/80 hover:bg-[#181818] hover:border-[#F5F5F0]/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-amber-400/90 mb-1">
                    <span>{r.leadCategory} lead</span>
                    <span className="font-bold">{(r.toxicityWeightKg / 1000).toLocaleString()} T</span>
                  </div>
                  <div className="text-xs font-serif font-bold text-white line-clamp-2">
                    {r.leadName}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>→ Living Bio-Gold</span>
                  <span className="font-bold">+{r.flourishingBoost}% ROI</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Crucible Vessel & Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Animated Crucible Graphic */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-amber-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          {/* Ambient elemental glow behind crucible */}
          <div 
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-1000"
            style={{ 
              backgroundColor: currentStage.colorHex === '#1F2937' ? '#3B82F6' : currentStage.colorHex 
            }}
          />

          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Hermetic Vessel of Quintessence
          </div>

          {/* SVG Animated Flask & Fire */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 flex items-center justify-center">
            {/* Glowing ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${
              isTransmuting ? 'animate-spin border-amber-400 opacity-80' : 'border-[#C5A059]/30 opacity-40'
            }`} />

            {/* Sacred Flask SVG */}
            <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-[0_0_20px_rgba(217,119,6,0.3)]">
              {/* Flask neck and body */}
              <path
                d="M 85 20 L 115 20 L 115 65 L 165 155 A 25 25 0 0 1 145 185 L 55 185 A 25 25 0 0 1 35 155 L 85 65 Z"
                fill="none"
                stroke="#C5A059"
                strokeWidth="3"
              />
              {/* Liquid level inside flask */}
              <path
                d="M 45 160 Q 100 170 155 160 L 145 185 L 55 185 Z"
                fill={
                  completedStages.includes('rubedo') ? '#EF4444' :
                  completedStages.includes('citrinitas') ? '#F59E0B' :
                  completedStages.includes('albedo') ? '#E2E8F0' :
                  '#1E293B'
                }
                className="transition-colors duration-1000"
              />
              {/* Bubbling alchemy particles */}
              <circle cx="90" cy="150" r="3" fill="#FFF" opacity="0.6" className="animate-ping" />
              <circle cx="110" cy="140" r="4" fill="#C5A059" opacity="0.8" />
              <circle cx="100" cy="120" r="2.5" fill="#F59E0B" opacity="0.7" className="animate-pulse" />
              {/* Center Seal: Phi symbol */}
              <text x="100" y="115" textAnchor="middle" fill="#C5A059" fontSize="22" fontFamily="serif" fontWeight="bold">
                Φ
              </text>
            </svg>

            {/* Golden radiance flare when completed */}
            {completedStages.includes('rubedo') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
                <Award className="w-16 h-16 text-amber-300 drop-shadow-[0_0_16px_#F59E0B] animate-bounce" />
              </div>
            )}
          </div>

          {/* Temperature & Vibration Readout */}
          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-left font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-[#0A0A0A] border border-white/5">
              <span className="text-slate-400 text-[9px] uppercase block">Crucible Thermal State</span>
              <span className="text-amber-400 font-bold text-sm">{temperature} °C (Hermetic Heat)</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0A0A0A] border border-white/5">
              <span className="text-slate-400 text-[9px] uppercase block">Harmonic Frequency</span>
              <span className="text-emerald-400 font-bold text-sm">{currentStage.frequency} Hz (Solfeggio)</span>
            </div>
          </div>
        </div>

        {/* 4 Stages Progression Interactive Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Active Stage {currentStageIdx + 1} of 4
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                  {currentStage.title}
                </h4>
                <p className="text-xs text-slate-400 italic">
                  {currentStage.latinName} — {currentStage.phaseName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Hermetic Principle</span>
                <span className="text-xs font-mono text-amber-300 font-semibold">{currentStage.hermeticPrinciple}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStage.description}
            </p>

            {/* Recipe specific action for this stage */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block mb-1">
                Transmutation Mandate for {selectedRecipe.leadName}:
              </span>
              {currentStage.stage === 'nigredo' && selectedRecipe.purificationSteps.nigredo}
              {currentStage.stage === 'albedo' && selectedRecipe.purificationSteps.albedo}
              {currentStage.stage === 'citrinitas' && selectedRecipe.purificationSteps.citrinitas}
              {currentStage.stage === 'rubedo' && selectedRecipe.purificationSteps.rubedo}
            </div>

            {/* 4 Stage Indicators */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {ALCHEMICAL_STAGES.map((s, idx) => {
                const isCompleted = completedStages.includes(s.stage);
                const isCurrent = idx === currentStageIdx;
                return (
                  <div
                    key={s.stage}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                        : isCurrent
                        ? 'bg-amber-950/50 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-[#141414] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="text-[9px] font-mono uppercase font-bold truncate">
                      {s.stage}
                    </div>
                    <div className="mt-1 flex justify-center">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      ) : (
                        <span className="text-[9px] font-mono">{idx + 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2">
              {!completedStages.includes('rubedo') ? (
                <button
                  onClick={handleAdvanceStage}
                  disabled={isTransmuting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-serif font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTransmuting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Transmuting Matter via {currentStage.elementalOperation}...</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      <span>
                        Ignite {currentStage.title.split(':')[0]} ({currentStage.elementalOperation})
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-amber-950/60 border border-amber-400/40 text-center space-y-2">
                  <span className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Magnum Opus Complete: The Philosopher’s Stone is Born!
                  </span>
                  <p className="text-xs text-slate-200">
                    Extractive lead has been transmuted into <strong className="text-amber-300">{selectedRecipe.transmutedGoldName}</strong> with an estimated civilizational dividend of <strong className="text-emerald-300">${selectedRecipe.transmutedValueUsd.toLocaleString()}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transmutation Certificate (If Completed) */}
          {certificate && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1A1811] via-[#12110D] to-[#0A0A0A] border-2 border-[#C5A059] shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#C5A059]/40 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <h5 className="font-serif font-bold text-sm sm:text-base text-amber-200">
                      Hermetic Proof of Quintessence
                    </h5>
                    <span className="text-[10px] font-mono text-[#C5A059]">
                      Cert ID: {certificate.certificateId}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  Inviolable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Lead Dissolved:</span>
                  <span className="text-white font-serif">{certificate.leadTransmuted} ({certificate.recipeName})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Living Gold Harvested:</span>
                  <span className="text-amber-300 font-serif font-bold">{certificate.goldProduced}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Quintessence Yield:</span>
                  <span className="text-emerald-400 font-bold">{certificate.quintessenceExtracted}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Merkle Golden Ratio Seal:</span>
                  <span className="text-[#C5A059] text-[10px] truncate block">{certificate.merkleSeal} (Φ=1.618)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 italic">
                  Consecrated under the sacred seal of Atlas Sanctum.
                </span>

                <button
                  onClick={() => {
                    alchemicalAudio.playSingingBowl(528, 1.5);
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificate, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `${certificate.certificateId}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A059] hover:bg-amber-400 text-black font-mono font-bold text-xs cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Inscribe Proof
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
