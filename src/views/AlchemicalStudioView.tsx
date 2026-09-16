import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Compass, 
  Heart, 
  Award, 
  Radio, 
  BookOpen, 
  Zap, 
  Layers, 
  Volume2, 
  VolumeX,
  Footprints,
  Eye
} from 'lucide-react';
import { SACRED_ARCHETYPES } from '../data/alchemicalData';
import { SacredArchetype } from '../types/alchemical';
import { alchemicalAudio } from '../lib/alchemicalAudio';

import { AlchemicalCrucible } from '../components/alchemical/AlchemicalCrucible';
import { SacredSigilForge } from '../components/alchemical/SacredSigilForge';
import { LivingOracleOfSevenRays } from '../components/alchemical/LivingOracleOfSevenRays';
import { EarthBenedictionAltar } from '../components/alchemical/EarthBenedictionAltar';
import { CelestialAstrolabeVisualizer } from '../components/alchemical/CelestialAstrolabeVisualizer';
import { AxiomaticVowsChamber } from '../components/alchemical/AxiomaticVowsChamber';
import { SeekerLabyrinth } from '../components/alchemical/SeekerLabyrinth';

export const AlchemicalStudioView: React.FC = () => {
  const [activeArchetype, setActiveArchetype] = useState<SacredArchetype>('alchemist');
  const [activeTab, setActiveTab] = useState<'crucible' | 'sigil' | 'oracle' | 'benediction' | 'astrolabe' | 'vows' | 'labyrinth'>('crucible');
  const [audioMuted, setAudioMuted] = useState<boolean>(() => alchemicalAudio.getIsMuted());

  const currentArchetypeProfile = SACRED_ARCHETYPES[activeArchetype];

  const handleSelectArchetype = (arch: SacredArchetype) => {
    setActiveArchetype(arch);
    const profile = SACRED_ARCHETYPES[arch];
    alchemicalAudio.playSingingBowl(profile.sacredFrequency, 2.5);

    // Auto switch to corresponding primary chamber
    const tabMap: Record<SacredArchetype, typeof activeTab> = {
      alchemist: 'crucible',
      magician: 'sigil',
      sage: 'oracle',
      saint: 'benediction',
      mystic: 'astrolabe',
      disciple: 'vows',
      seeker: 'labyrinth'
    };
    if (tabMap[arch]) {
      setActiveTab(tabMap[arch]);
    }
  };

  const toggleMute = () => {
    const nextMute = !audioMuted;
    setAudioMuted(nextMute);
    alchemicalAudio.setMuted(nextMute);
    try {
      localStorage.setItem('atlas_audio_muted', String(nextMute));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F5F0] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* Top Consecration Header */}
      <header className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14120C] via-[#0E0E0E] to-[#120E14] border-2 border-[#C5A059]/40 shadow-2xl overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#C5A059] font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              Atlas Sanctum • The Chamber of Wonder & Alchemy
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-wide mt-1">
              The Sevenfold Alchemical Sanctum
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-serif max-w-3xl mt-2 leading-relaxed">
              Operating at the convergence of Magician, Seeker, Mystic, Disciple, Saint, Alchemist, and Sage. 
              Here we transmute the heavy lead of civilizational collapse and cynical extraction into the living gold of planetary flourishing, sacred geometry, and celestial wonder.
            </p>
          </div>

          {/* Wonder Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => alchemicalAudio.playSingingBowl(528, 3.5)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              title="Strike 528 Hz Solfeggio Bell"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Strike 528 Hz Bell</span>
            </button>

            <button
              onClick={toggleMute}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                audioMuted 
                  ? 'bg-red-950/40 border-red-500/40 text-red-300' 
                  : 'bg-[#181818] border-white/10 text-slate-300 hover:text-white'
              }`}
              title={audioMuted ? 'Unmute Sacred Audio' : 'Mute Sacred Audio'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* The 7 Sacred Archetypes Selector Bar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold mb-3">
            <span>The Seven Sacred Operative Personas:</span>
            <span>Click to Adopt Mantle & Attune Frequency</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {(Object.keys(SACRED_ARCHETYPES) as SacredArchetype[]).map((archKey) => {
              const arch = SACRED_ARCHETYPES[archKey];
              const isSelected = activeArchetype === archKey;

              return (
                <button
                  key={archKey}
                  onClick={() => handleSelectArchetype(archKey)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#221C11] to-[#14120C] border-amber-400 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                      : 'bg-[#111111] border-white/5 text-slate-400 hover:bg-[#181818] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{arch.sacredSymbol}</span>
                    <span className="text-[9px] font-mono font-bold text-amber-400">
                      {arch.sacredFrequency} Hz
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-serif font-bold text-white block">
                      {arch.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">
                      {arch.element} • {arch.virtue.split('&')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Active Archetype Epigraph & Invocation */}
      <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            <span className="text-base">{currentArchetypeProfile.sacredSymbol}</span>
            <span>Active Mantle: {currentArchetypeProfile.title}</span>
          </div>
          <p className="text-xs font-serif italic text-amber-100/90 max-w-3xl">
            "{currentArchetypeProfile.invocation}"
          </p>
        </div>

        <div className="text-right shrink-0 font-mono text-[11px] text-slate-400 border-l border-white/10 pl-4">
          <span className="text-[#C5A059] block font-bold">Axiomatic Virtue</span>
          <span>{currentArchetypeProfile.virtue}</span>
        </div>
      </div>

      {/* Chambers Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-mono scrollbar-thin">
        {[
          { id: 'crucible', label: 'Magnum Opus Crucible', icon: Flame, archetype: 'Alchemist' },
          { id: 'sigil', label: 'Arcane Sigil Forge', icon: Zap, archetype: 'Magician' },
          { id: 'oracle', label: 'Oracle of Seven Rays', icon: BookOpen, archetype: 'Sage' },
          { id: 'benediction', label: 'Earth Benediction Altar', icon: Heart, archetype: 'Saint' },
          { id: 'astrolabe', label: 'Celestial Astrolabe & Drone', icon: Radio, archetype: 'Mystic' },
          { id: 'vows', label: 'Covenant of Seven Vows', icon: Award, archetype: 'Disciple' },
          { id: 'labyrinth', label: 'Contemplative Labyrinth', icon: Footprints, archetype: 'Seeker' }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                alchemicalAudio.playSingingBowl(528, 1.2);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#101010] text-slate-400 border-white/5 hover:bg-[#161616] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-normal ${
                isSelected ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-500'
              }`}>
                {tab.archetype}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Chamber Component Render */}
      <main className="transition-all duration-500">
        {activeTab === 'crucible' && <AlchemicalCrucible />}
        {activeTab === 'sigil' && <SacredSigilForge />}
        {activeTab === 'oracle' && <LivingOracleOfSevenRays />}
        {activeTab === 'benediction' && <EarthBenedictionAltar />}
        {activeTab === 'astrolabe' && <CelestialAstrolabeVisualizer />}
        {activeTab === 'vows' && <AxiomaticVowsChamber />}
        {activeTab === 'labyrinth' && <SeekerLabyrinth />}
      </main>

      {/* Footer Perennial Inscription */}
      <footer className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 text-center space-y-2">
        <p className="font-serif italic text-xs text-[#C5A059] max-w-xl mx-auto">
          "That which is below is like that which is above, and that which is above is like that which is below, to accomplish the miracles of the One Only Thing."
        </p>
        <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-widest">
          The Emerald Tablet of Hermes Trismegistus • Atlas Sanctum Perennial Foundation
        </span>
      </footer>
    </div>
  );
};
export default AlchemicalStudioView;
