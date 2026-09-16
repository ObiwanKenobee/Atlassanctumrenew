import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2,
  Footprints,
  BookOpen
} from 'lucide-react';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

const LABYRINTH_STATIONS = [
  {
    step: 1,
    title: 'The Outer Threshold: Confession of Ignorance',
    hermeticInsight: 'The journey begins by setting down the heavy armor of assumed certainty. A true seeker arrives with empty hands.',
    inquiry: 'What assumptions about technology, progress, or your own limitations are you ready to leave at the gate?'
  },
  {
    step: 2,
    title: 'The First Turn: The Veil of Maya',
    hermeticInsight: 'The world of extractive markets presents an illusion of scarcity. Beneath the digital noise, nature remains an unceasing fountain of abundance.',
    inquiry: 'Where in your life are you mistaking manufactured scarcity for natural reality?'
  },
  {
    step: 3,
    title: 'The Deep Spiral: Meeting the Ecological Wound',
    hermeticInsight: 'We cannot heal what we refuse to grieve. The clearcut forest, the bleached coral, and the polluted aquifer are not distant abstractions; they are our extended body.',
    inquiry: 'What ecological grief have you suppressed that is waiting to be transmuted into love?'
  },
  {
    step: 4,
    title: 'The Still Center: The Inviolable Sanctuary',
    hermeticInsight: 'Here at the center of the labyrinth, motion ceases. The witness within you is untouched by civilizational collapse. You are the universe knowing itself.',
    inquiry: 'Rest in this silent center. Listen to the heartbeat of the living planet.'
  },
  {
    step: 5,
    title: 'The Outward Return: The Consecrated Craftsman',
    hermeticInsight: 'The mystic does not remain on the mountain; the seeker returns to the marketplace with hands ready to build, heal, and plant.',
    inquiry: 'What specific regenerative gift will you bring back to your watershed today?'
  }
];

export const SeekerLabyrinth: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const activeStation = LABYRINTH_STATIONS[currentStep];

  const handleNextStep = () => {
    if (currentStep < LABYRINTH_STATIONS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      alchemicalAudio.playSingingBowl(432 + next * 88, 2.0);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    alchemicalAudio.playSingingBowl(432, 1.5);
  };

  return (
    <div className="space-y-6">
      {/* Seeker Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
            The Seeker’s Contemplative Labyrinth
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            The Pilgrim’s Pathway of Epistemic Humility
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            A labyrinth is not a maze; there are no dead ends. It is an intentional, non-linear path designed to quiet discursive thinking and reveal the sacred center of being.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] text-xs font-mono text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Return to Threshold
          </button>
        </div>
      </div>

      {/* Labyrinth Stepping Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Labyrinth Pathway */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0A0A0A] border border-cyan-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold mb-4">
            Pilgrim’s Progress: Station {currentStep + 1} of 5
          </div>

          {/* SVG Labyrinth Concentric Rings */}
          <div className="relative w-56 h-56 my-2 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-48 h-48">
              {[85, 70, 55, 40, 25].map((r, idx) => {
                const isReached = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <circle
                    key={r}
                    cx="100"
                    cy="100"
                    r={r}
                    fill="none"
                    stroke={isCurrent ? '#06B6D4' : isReached ? '#10B981' : '#334155'}
                    strokeWidth={isCurrent ? '3.5' : '1.5'}
                    strokeDasharray={idx % 2 === 0 ? '6,3' : 'none'}
                    className={`transition-all duration-700 ${isCurrent ? 'filter drop-shadow-[0_0_8px_#06B6D4]' : ''}`}
                  />
                );
              })}
              {/* Center point */}
              <circle
                cx="100"
                cy="100"
                r="8"
                fill={currentStep === 3 ? '#F59E0B' : '#C5A059'}
                className={currentStep === 3 ? 'animate-ping' : ''}
              />
            </svg>
          </div>

          <div className="w-full grid grid-cols-5 gap-1 pt-4 mt-2 border-t border-white/10">
            {LABYRINTH_STATIONS.map((s, idx) => {
              const isReached = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <button
                  key={s.step}
                  onClick={() => {
                    setCurrentStep(idx);
                    alchemicalAudio.playSingingBowl(432 + idx * 88, 1.5);
                  }}
                  className={`p-2 rounded-lg border text-center font-mono text-[10px] transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-bold'
                      : isReached
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#121212] border-white/5 text-slate-500'
                  }`}
                >
                  {isReached ? `✓ ${idx + 1}` : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Station Revelation Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Threshold {activeStation.step}
                </span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
                  {activeStation.title}
                </h4>
              </div>

              <div className="w-8 h-8 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Footprints className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                Hermetic Principle of the Turn:
              </span>
              <p className="text-sm font-serif italic text-slate-200 leading-relaxed">
                "{activeStation.hermeticInsight}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block mb-1">
                The Pilgrim’s Self-Inquiry:
              </span>
              <p className="text-xs sm:text-sm font-serif text-cyan-100 leading-relaxed">
                {activeStation.inquiry}
              </p>
            </div>

            <div className="pt-2">
              {currentStep < LABYRINTH_STATIONS.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-black font-serif font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <Footprints className="w-4 h-4" />
                  <span>Take the Next Step Along the Spiral</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs text-emerald-200 font-serif">
                  ✨ You have completed the pilgrimage of the labyrinth. Return to the world as an initiated steward of truth.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
