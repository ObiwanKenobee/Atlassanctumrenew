import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Globe2, 
  Droplets, 
  Award, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { SACRED_BIOREGIONS } from '../../data/alchemicalData';
import { EarthBenediction } from '../../types/alchemical';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

export const EarthBenedictionAltar: React.FC = () => {
  const [bioregions, setBioregions] = useState<EarthBenediction[]>(SACRED_BIOREGIONS);
  const [activeBioregion, setActiveBioregion] = useState<EarthBenediction>(SACRED_BIOREGIONS[0]);
  const [isBlessing, setIsBlessing] = useState<boolean>(false);
  const [blessingPulse, setBlessingPulse] = useState<string | null>(null);

  const handleBestowBlessing = (regionId: string) => {
    setIsBlessing(true);
    setBlessingPulse(regionId);
    alchemicalAudio.playBenedictionChime();

    setTimeout(() => {
      setBioregions(prev =>
        prev.map(b =>
          b.id === regionId
            ? {
                ...b,
                totalBlessingsCount: b.totalBlessingsCount + 1,
                lastBlessedAt: 'Just now'
              }
            : b
        )
      );
      setIsBlessing(false);
      setTimeout(() => setBlessingPulse(null), 1500);
    }, 1200);
  };

  const totalGlobalBlessings = bioregions.reduce((acc, curr) => acc + curr.totalBlessingsCount, 0);

  return (
    <div className="space-y-6">
      {/* Saint Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-rose-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            The Saint’s Earth Benediction & Anointing Altar
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            Channelling Boundless Grace to Threatened Sanctuaries
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            "No creature falls outside the circle of holy compassion." Pour prayerful benedictions and radiant healing fields directly into Earth's vital ecological organs and endangered rivers.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-right font-mono">
          <span className="text-[10px] uppercase text-rose-300 block">Consecrated Global Blessings</span>
          <span className="text-lg font-bold text-rose-400">{totalGlobalBlessings.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bioregions List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold block">
            Select Planetary Bioregion to Anoint:
          </span>

          <div className="space-y-2">
            {bioregions.map((region) => {
              const isSelected = activeBioregion.id === region.id;
              const isPulsing = blessingPulse === region.id;

              return (
                <div
                  key={region.id}
                  onClick={() => {
                    setActiveBioregion(region);
                    alchemicalAudio.playSingingBowl(639, 1.5);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-[#111111] border-white/10 text-slate-300 hover:bg-[#181818]'
                  }`}
                >
                  {isPulsing && (
                    <div className="absolute inset-0 bg-rose-400/20 animate-ping pointer-events-none" />
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <Globe2 className="w-3 h-3" />
                      {region.coordinates[0]}°, {region.coordinates[1]}°
                    </span>
                    <span className="text-slate-400">
                      {region.totalBlessingsCount.toLocaleString()} blessings
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-sm text-white">
                    {region.bioregionName}
                  </h5>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {region.threatDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Bioregion Anointing Chamber */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1A0E12] via-[#120B0D] to-[#0A0A0A] border-2 border-rose-500/30 space-y-4 shadow-2xl relative overflow-hidden">
            {isBlessing && (
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent pointer-events-none animate-pulse" />
            )}

            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  Consecration Focus
                </span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
                  {activeBioregion.bioregionName}
                </h4>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 text-[10px] uppercase block">Last Benediction:</span>
                <span className="text-rose-300 font-bold">{activeBioregion.lastBlessedAt}</span>
              </div>
            </div>

            {/* Prayer & Benediction Text */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-black/40 border border-rose-500/20">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 block mb-1 font-bold">
                  The Saint’s Intercession:
                </span>
                <p className="text-xs sm:text-sm font-serif italic text-rose-100 leading-relaxed">
                  "{activeBioregion.saintlyPrayer}"
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block mb-1 font-bold">
                  Bioregional Restoration Vision:
                </span>
                <p className="text-slate-300 font-serif leading-relaxed">
                  {activeBioregion.blessingText}
                </p>
              </div>
            </div>

            {/* Bestow Blessing Action */}
            <div className="pt-2">
              <button
                onClick={() => handleBestowBlessing(activeBioregion.id)}
                disabled={isBlessing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-serif font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isBlessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Pouring Holy Grace & Restorative Light...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-white" />
                    <span>Bestow Saintly Benediction ({activeBioregion.bioregionName.split(' ')[0]})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Theological & Mystical Grounding */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs font-serif italic text-slate-400 leading-relaxed">
            "When we pray for the watershed, our consciousness ceases to be a detached observer and becomes an immune cell within the living body of the Earth." — Saint Francis & Thomas Berry
          </div>
        </div>
      </div>
    </div>
  );
};
