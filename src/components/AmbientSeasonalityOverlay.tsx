import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Sparkles, Compass, Calendar, RefreshCw, X, ChevronRight } from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

export type PlanetarySeason = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonData {
  id: PlanetarySeason;
  name: string;
  astronomicalTerm: string;
  paletteDescription: string;
  primaryColor: string;
  accentColor: string;
  ambientGradient: string;
  temperatureFeel: string;
  poeticEpigraph: string;
  earthOrbitLongitude: string;
}

const SEASONS: Record<PlanetarySeason, SeasonData> = {
  spring: {
    id: 'spring',
    name: 'Vernal Awakening',
    astronomicalTerm: 'Vernal Equinox to Summer Solstice',
    paletteDescription: 'Warmer emerald greens, tender sun-gold, and blossoming vitality',
    primaryColor: '#10B981',
    accentColor: '#FDE047',
    ambientGradient: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.045) 0%, rgba(253, 224, 71, 0.025) 50%, transparent 80%)',
    temperatureFeel: 'Warm, rising photosynthetic surge',
    poeticEpigraph: 'The sap climbs against gravity; the earth opens its green eyes to the sun.',
    earthOrbitLongitude: '0° - 90° Solar Longitude'
  },
  summer: {
    id: 'summer',
    name: 'Solar Zenith',
    astronomicalTerm: 'Summer Solstice to Autumnal Equinox',
    paletteDescription: 'Luminous radiant amber, solar flares, and warm golden ochre',
    primaryColor: '#F59E0B',
    accentColor: '#EAB308',
    ambientGradient: 'radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.05) 0%, rgba(234, 179, 8, 0.025) 50%, transparent 80%)',
    temperatureFeel: 'Radiant maximum solar flux',
    poeticEpigraph: 'Photons cascade in unbroken abundance; the solar net feeds all living cells.',
    earthOrbitLongitude: '90° - 180° Solar Longitude'
  },
  autumn: {
    id: 'autumn',
    name: 'Autumnal Harvest & Humus',
    astronomicalTerm: 'Autumnal Equinox to Winter Solstice',
    paletteDescription: 'Warm alchemical gold, russet copper, fertile humus, and harvest amber',
    primaryColor: '#C5A059',
    accentColor: '#D97706',
    ambientGradient: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.045) 0%, rgba(217, 119, 6, 0.03) 50%, transparent 80%)',
    temperatureFeel: 'Contemplative warmth, descending into roots',
    poeticEpigraph: 'The leaf falls not in death, but to enrich the root; carbon returns to holy humus.',
    earthOrbitLongitude: '180° - 270° Solar Longitude'
  },
  winter: {
    id: 'winter',
    name: 'Boreal Starlight & Stillness',
    astronomicalTerm: 'Winter Solstice to Vernal Equinox',
    paletteDescription: 'Cool crystalline silver, starlight sapphire, and reflective stillness',
    primaryColor: '#93C5FD',
    accentColor: '#E0F2FE',
    ambientGradient: 'radial-gradient(ellipse at 50% 0%, rgba(147, 197, 253, 0.04) 0%, rgba(224, 242, 254, 0.02) 50%, transparent 80%)',
    temperatureFeel: 'Cool, subterranean aquifer recharging',
    poeticEpigraph: 'In the cold dark, the seeds dream under snow; the aquifers drink in absolute silence.',
    earthOrbitLongitude: '270° - 360° Solar Longitude'
  }
};

export const AmbientSeasonalityOverlay: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<PlanetarySeason>('autumn');
  const [isAutoDate, setIsAutoDate] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orbitStats, setOrbitStats] = useState<{
    dayOfYear: number;
    orbitProgressPct: number;
    solarLongitudeDeg: number;
    formattedDate: string;
    nextCelestialMilestone: string;
    daysUntilMilestone: number;
  }>({
    dayOfYear: 259,
    orbitProgressPct: 70.9,
    solarLongitudeDeg: 173.4,
    formattedDate: 'September 16, 2026',
    nextCelestialMilestone: 'Autumnal Equinox',
    daysUntilMilestone: 6
  });

  // Calculate astronomical season based on real-world date
  const computeRealWorldSeason = (): { season: PlanetarySeason; stats: typeof orbitStats } => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay) + 1;
    const isLeapYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
    const totalDays = isLeapYear ? 366 : 365;
    const orbitProgressPct = Number(((dayOfYear / totalDays) * 100).toFixed(1));
    const solarLongitudeDeg = Number(((dayOfYear / totalDays) * 360).toFixed(1));

    // Seasons in Northern Hemisphere
    // Spring: ~Mar 20 (day ~79) to ~Jun 20 (day ~171)
    // Summer: ~Jun 21 (day ~172) to ~Sep 21 (day ~264)
    // Autumn: ~Sep 22 (day ~265) to ~Dec 20 (day ~354)
    // Winter: ~Dec 21 to ~Mar 19
    let season: PlanetarySeason = 'autumn';
    let nextMilestone = 'Autumnal Equinox';
    let daysUntil = 6;

    if (dayOfYear >= 79 && dayOfYear < 172) {
      season = 'spring';
      nextMilestone = 'Summer Solstice';
      daysUntil = 172 - dayOfYear;
    } else if (dayOfYear >= 172 && dayOfYear < 265) {
      season = 'summer';
      nextMilestone = 'Autumnal Equinox';
      daysUntil = 265 - dayOfYear;
    } else if (dayOfYear >= 265 && dayOfYear < 355) {
      season = 'autumn';
      nextMilestone = 'Winter Solstice';
      daysUntil = 355 - dayOfYear;
    } else {
      season = 'winter';
      nextMilestone = 'Vernal Equinox';
      daysUntil = dayOfYear < 79 ? 79 - dayOfYear : (totalDays - dayOfYear + 79);
    }

    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      season,
      stats: {
        dayOfYear,
        orbitProgressPct,
        solarLongitudeDeg,
        formattedDate,
        nextCelestialMilestone: nextMilestone,
        daysUntilMilestone: Math.max(1, daysUntil)
      }
    };
  };

  useEffect(() => {
    try {
      const savedOverride = localStorage.getItem('atlas_seasonal_override');
      const { season, stats } = computeRealWorldSeason();
      setOrbitStats(stats);

      if (savedOverride && (savedOverride in SEASONS)) {
        setCurrentSeason(savedOverride as PlanetarySeason);
        setIsAutoDate(false);
      } else {
        setCurrentSeason(season);
        setIsAutoDate(true);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Update CSS root variables dynamically to adjust platform color accents
  useEffect(() => {
    const activeData = SEASONS[currentSeason];
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--planetary-season-primary', activeData.primaryColor);
      root.style.setProperty('--planetary-season-accent', activeData.accentColor);
      root.style.setProperty('--planetary-season-id', activeData.id);
    }
  }, [currentSeason]);

  const activeSeasonData = SEASONS[currentSeason];

  const handleSelectSeason = (seasonId: PlanetarySeason) => {
    audioFeedback.playSubtleClick();
    setCurrentSeason(seasonId);
    setIsAutoDate(false);
    try {
      localStorage.setItem('atlas_seasonal_override', seasonId);
    } catch {
      // Ignore
    }
  };

  const handleResetToRealWorldDate = () => {
    audioFeedback.playSyncComplete();
    const { season, stats } = computeRealWorldSeason();
    setCurrentSeason(season);
    setOrbitStats(stats);
    setIsAutoDate(true);
    try {
      localStorage.removeItem('atlas_seasonal_override');
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Subtle Ambient Seasonality Vignette Overlay across the Platform */}
      <div 
        id="ambient-seasonality-overlay"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-1000"
        style={{
          background: activeSeasonData.ambientGradient,
          mixBlendMode: 'screen'
        }}
      />

      {/* Discrete Planetary Time / Seasonality Indicator Pill in Footer / Lower View */}
      <div className="fixed bottom-3 right-3 z-30 hidden sm:flex items-center">
        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setIsModalOpen(true);
          }}
          title="Planetary Seasonality & Astronomical Time"
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0D0D0D]/90 hover:bg-[#151515] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 backdrop-blur-md rounded-full text-[10px] font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] transition-all shadow-md group cursor-pointer"
        >
          <span 
            className="w-2 h-2 rounded-full transition-colors animate-pulse"
            style={{ backgroundColor: activeSeasonData.primaryColor }}
          />
          <span className="font-bold text-[#F5F5F0]/90">
            {activeSeasonData.name}
          </span>
          <span className="text-[#F5F5F0]/30 hidden md:inline">•</span>
          <span className="text-[#F5F5F0]/50 hidden md:inline text-[9px]">
            Orbit Day {orbitStats.dayOfYear}
          </span>
          {isAutoDate && (
            <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              Live
            </span>
          )}
        </button>
      </div>

      {/* Interactive Planetary Time & Seasonality Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div 
            id="planetary-seasonality-modal"
            className="w-full max-w-lg bg-[#0D0D0D] border border-[#C5A059]/40 rounded-lg shadow-2xl p-5 text-[#F5F5F0] space-y-4 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center border transition-all"
                  style={{ 
                    backgroundColor: `${activeSeasonData.primaryColor}15`,
                    borderColor: `${activeSeasonData.primaryColor}60`,
                    color: activeSeasonData.primaryColor
                  }}
                >
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0] tracking-wide flex items-center gap-2">
                    <span>Planetary Time & Seasonality</span>
                    {isAutoDate ? (
                      <span className="text-[9px] font-mono font-normal px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        Synchronized with Earth
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-normal px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                        Manual Season
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] font-mono text-[#C5A059]">
                    {orbitStats.formattedDate} • Orbit Longitude {orbitStats.solarLongitudeDeg}°
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-[#F5F5F0]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orbit Metrics Card */}
            <div className="grid grid-cols-3 gap-2 text-center bg-[#121212] border border-[#F5F5F0]/10 p-3 rounded-md font-mono">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#F5F5F0]/50">Day of Orbit</div>
                <div className="text-sm font-bold text-[#C5A059]">{orbitStats.dayOfYear} / 365</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#F5F5F0]/50">Orbital Progress</div>
                <div className="text-sm font-bold text-emerald-400">{orbitStats.orbitProgressPct}%</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#F5F5F0]/50">Next Milestone</div>
                <div className="text-[11px] font-bold text-[#F5F5F0] truncate" title={orbitStats.nextCelestialMilestone}>
                  {orbitStats.daysUntilMilestone}d to {orbitStats.nextCelestialMilestone}
                </div>
              </div>
            </div>

            {/* Active Season Overview */}
            <div 
              className="p-3.5 rounded-md border transition-all"
              style={{
                backgroundColor: `${activeSeasonData.primaryColor}08`,
                borderColor: `${activeSeasonData.primaryColor}35`
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-serif font-bold" style={{ color: activeSeasonData.primaryColor }}>
                  {activeSeasonData.name} ({activeSeasonData.astronomicalTerm})
                </span>
                <span className="text-[10px] font-mono text-[#F5F5F0]/60">
                  {activeSeasonData.earthOrbitLongitude}
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/80 font-serif italic mb-2">
                "{activeSeasonData.poeticEpigraph}"
              </p>
              <div className="text-[10px] font-sans text-[#F5F5F0]/60">
                <span className="font-bold text-[#F5F5F0]/90">Palette Mood:</span> {activeSeasonData.paletteDescription}
              </div>
            </div>

            {/* Season Selector Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
                <span>Explore Planetary Seasons</span>
                {!isAutoDate && (
                  <button
                    onClick={handleResetToRealWorldDate}
                    className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync with Earth Date</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SEASONS) as PlanetarySeason[]).map((key) => {
                  const s = SEASONS[key];
                  const isSelected = currentSeason === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectSeason(key)}
                      className={`p-2.5 rounded border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#C5A059] bg-[#1B3022] shadow-[0_0_10px_rgba(197,160,89,0.2)]'
                          : 'border-[#F5F5F0]/10 bg-[#121212] hover:bg-[#1A1A1A] hover:border-[#F5F5F0]/25'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: s.primaryColor }} 
                          />
                          <span className={`text-xs font-serif font-bold ${isSelected ? 'text-[#C5A059]' : 'text-[#F5F5F0]'}`}>
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-[#F5F5F0]/50 block truncate">
                          {s.temperatureFeel}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[#C5A059] text-xs font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
              <span>Platform adapts ambient warmth to planetary time</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] border border-[#F5F5F0]/20 rounded transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
