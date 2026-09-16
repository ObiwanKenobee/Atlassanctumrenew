import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  BookOpen, 
  Heart, 
  Compass, 
  TreeDeciduous, 
  Flame, 
  Radio, 
  Award,
  Zap
} from 'lucide-react';
import { LIVING_ARCANA_ORACLE } from '../../data/alchemicalData';
import { OracleCard } from '../../types/alchemical';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

export const LivingOracleOfSevenRays: React.FC = () => {
  const [spreadType, setSpreadType] = useState<'single' | 'trinity'>('single');
  const [drawnCards, setDrawnCards] = useState<OracleCard[]>([LIVING_ARCANA_ORACLE[0]]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<OracleCard>(LIVING_ARCANA_ORACLE[0]);

  const handleDraw = (type: 'single' | 'trinity') => {
    setSpreadType(type);
    setIsShuffling(true);
    alchemicalAudio.playSingingBowl(528, 2.0);

    setTimeout(() => {
      const shuffled = [...LIVING_ARCANA_ORACLE].sort(() => 0.5 - Math.random());
      const selected = type === 'single' ? [shuffled[0]] : [shuffled[0], shuffled[1], shuffled[2]];
      setDrawnCards(selected);
      setSelectedCard(selected[0]);
      setIsShuffling(false);
      alchemicalAudio.playSingingBowl(selected[0].sacredFrequency, 3.0);
    }, 900);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TreeDeciduous': return TreeDeciduous;
      case 'Flame': return Flame;
      case 'Heart': return Heart;
      case 'Compass': return Compass;
      case 'Award': return Award;
      case 'Radio': return Radio;
      case 'Zap': return Zap;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            The Sage’s Living Oracle of the Seven Rays
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            Divination from the Perennial Codex of Earth & Spirit
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            Consult the archetypal codex of ancient masters, hermetic sages, and indigenous earth-keepers. Receive clarity on moral dilemmas, planetary stewardship, and your current life season.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDraw('single')}
            disabled={isShuffling}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              spreadType === 'single'
                ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#141414] text-slate-300 hover:bg-[#1E1E1E] border border-white/10'
            }`}
          >
            Draw Single Arcana
          </button>
          <button
            onClick={() => handleDraw('trinity')}
            disabled={isShuffling}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              spreadType === 'trinity'
                ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#141414] text-slate-300 hover:bg-[#1E1E1E] border border-white/10'
            }`}
          >
            Threefold Trinity Spread
          </button>
        </div>
      </div>

      {/* Drawn Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drawnCards.map((card, idx) => {
          const isSelected = selectedCard.id === card.id;
          const Icon = getIcon(card.iconName);
          const spreadTitles = ['Origin & Watershed Foundation', 'Present Crucible & Challenge', 'Flourishing Destiny & Fruit'];
          const spreadLabel = spreadType === 'trinity' ? spreadTitles[idx] : 'Divine Arcana of the Moment';

          return (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                alchemicalAudio.playSingingBowl(card.sacredFrequency, 2.0);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1E1B14] to-[#12110D] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-[#101010] border-white/10 hover:border-amber-400/40'
              } ${isShuffling ? 'animate-pulse opacity-60' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#C5A059] mb-2">
                  <span>Card {card.id}</span>
                  <span className="font-bold">{card.element.toUpperCase()}</span>
                </div>

                <div className="text-[11px] font-mono text-amber-300/80 mb-1">
                  {spreadLabel}
                </div>

                <div className="flex items-center gap-3 my-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">{card.name}</h4>
                    <span className="text-xs text-slate-400 italic block">{card.title}</span>
                  </div>
                </div>

                <p className="text-xs text-amber-100/90 font-serif italic border-l-2 border-amber-400/50 pl-3 my-3">
                  "{card.aphorism}"
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Archetype: {card.archetype}</span>
                <span className="text-amber-400 font-bold">{card.sacredFrequency} Hz</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Card Deep Guidance Revelation */}
      {selectedCard && (
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border-2 border-[#C5A059]/40 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                <BookOpen className="w-4 h-4 text-amber-400" />
                The Sage’s Deep Revelation
              </div>
              <h4 className="text-xl font-serif font-bold text-white mt-1">
                {selectedCard.name}: {selectedCard.title}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alchemicalAudio.playSingingBowl(selectedCard.sacredFrequency, 3.5)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono hover:bg-amber-500/30 transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                Sound {selectedCard.sacredFrequency} Hz Harmonic
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="space-y-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  Esoteric Interpretation:
                </span>
                <p className="text-slate-200 font-serif text-sm">
                  {selectedCard.esotericMeaning}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                  Planetary Action Mandate:
                </span>
                <p className="text-emerald-200/90 font-mono bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                  {selectedCard.planetaryAction}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  Bioregional Blessing:
                </span>
                <p className="text-cyan-200/90 font-serif text-sm italic bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/20">
                  "{selectedCard.bioregionalBlessing}"
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#141414] border border-white/10 space-y-1 font-mono text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Governing Element:</span>
                  <span className="text-white capitalize">{selectedCard.element}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cosmic Chord:</span>
                  <span className="text-amber-400">{selectedCard.sacredFrequency} Hz Solfeggio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
