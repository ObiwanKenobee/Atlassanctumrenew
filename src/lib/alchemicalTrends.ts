import { AlchemicalStage } from '../types/alchemical';

export interface AlchemicalTrendAnalysis {
  stage: AlchemicalStage | 'calcinatio';
  latinName: string;
  stageTitle: string;
  glyph: string;
  secondaryGlyph: string;
  element: string;
  elementIcon: string;
  colorHex: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  glowColor: string;
  trendDelta: number;
  trendVelocityPct: number;
  direction: 'ascending' | 'moderate-ascent' | 'equilibrium' | 'moderate-descent' | 'deep-descent';
  directionLabel: string;
  hermeticPrinciple: string;
  esotericAxiom: string;
  loreInterpretation: string;
  solfeggioFrequency: number;
}

export interface CelestialHistoricalAlignment {
  monthIndex: number;
  shortMonth: string;
  calendarMonth: string;
  milestone: string;
  bioregion: string;
  starName: string;
  constellation: string;
  constellationColor: string;
  celestialCoordinates: {
    ra: string;      // Right Ascension, e.g. "12h 14m"
    dec: string;     // Declination, e.g. "-04° 22'"
    chartX: number;  // 0 to 100 relative
    chartY: number;  // 0 to 100 relative
  };
  stellarMagnitude: number;
  zkProof: string;
}

/**
 * Calculates dynamic mystical and alchemical symbolism based on the rate of change (trend direction)
 * of ecological flourishing and economic stability over time.
 */
export function getAlchemicalTrendSymbolism(
  currentVal: number,
  prevVal: number = currentVal,
  metricLabel: string = 'Ecological Flourishing'
): AlchemicalTrendAnalysis {
  const delta = Number((currentVal - prevVal).toFixed(2));
  const baseline = prevVal === 0 ? 1 : prevVal;
  const velocityPct = Number(((delta / baseline) * 100).toFixed(1));

  // 1. Ascending Transmutation into Living Gold (Strong positive slope)
  if (delta >= 1.4) {
    return {
      stage: 'rubedo',
      latinName: 'Rubedo • Aurum Philosophicum & Coagulatio',
      stageTitle: 'Transmutation into Living Gold',
      glyph: '☉',
      secondaryGlyph: '🜚',
      element: 'Ignis Vivus (Living Solar Flame)',
      elementIcon: '🔥',
      colorHex: '#F59E0B',
      borderClass: 'border-amber-500/60',
      bgClass: 'bg-amber-950/70',
      textClass: 'text-amber-300',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      trendDelta: delta,
      trendVelocityPct: velocityPct,
      direction: 'ascending',
      directionLabel: 'Ascending Transmutation (+ Solar Coagulation)',
      hermeticPrinciple: 'Mentalism & Solar Multiplication',
      esotericAxiom: 'As Above, So Below; Terrestrial Carbon Transmutes into Spiritual Gold',
      loreInterpretation: `The living watershed has reached the Red Work. The gross elements ascend into conscious vitality. Infiltration multiplies upon itself as photosynthetic wealth crystalizes in the soil.`,
      solfeggioFrequency: 852
    };
  }

  // 2. Moderate Ascent (The Golden Dawn / Vital Awakening)
  if (delta > 0.2) {
    return {
      stage: 'citrinitas',
      latinName: 'Citrinitas • Solificatio & Fermentatio',
      stageTitle: 'The Golden Dawn (Vital Spark)',
      glyph: '🜍',
      secondaryGlyph: '🝡',
      element: 'Aer Solaris (Radiant Solar Wind)',
      elementIcon: '✨',
      colorHex: '#EAB308',
      borderClass: 'border-yellow-500/60',
      bgClass: 'bg-yellow-950/70',
      textClass: 'text-yellow-300',
      glowColor: 'rgba(234, 179, 8, 0.4)',
      trendDelta: delta,
      trendVelocityPct: velocityPct,
      direction: 'moderate-ascent',
      directionLabel: 'Solar Awakening (+ Vital Fermentation)',
      hermeticPrinciple: 'Gender & Generative Polarity',
      esotericAxiom: 'The Breath of Dawn Quickens the Sleeping Seed',
      loreInterpretation: `Solar light penetrates the canopy. Capital ceases to behave as an extractive parasite and awakens into a photosynthetic engine of mutual care.`,
      solfeggioFrequency: 528
    };
  }

  // 3. Equilibrium / Harmonic Plateau / Stillness (The Sacred Ouroboros)
  if (delta >= -0.4) {
    return {
      stage: 'albedo',
      latinName: 'Albedo • Ablutio & Sacred Homeostasis',
      stageTitle: 'The Sacred Ouroboros Equilibrium',
      glyph: '☽',
      secondaryGlyph: '🜔',
      element: 'Aqua Sancta (Purified Living Waters)',
      elementIcon: '🌊',
      colorHex: '#38BDF8',
      borderClass: 'border-sky-400/60',
      bgClass: 'bg-sky-950/70',
      textClass: 'text-sky-300',
      glowColor: 'rgba(56, 189, 248, 0.4)',
      trendDelta: delta,
      trendVelocityPct: velocityPct,
      direction: 'equilibrium',
      directionLabel: 'Harmonic Stillness (= Sacred Ouroboros)',
      hermeticPrinciple: 'Rhythm & Homeostatic Poise',
      esotericAxiom: 'Coincidentia Oppositorum; The Serpent Holds Its Tail in Grace',
      loreInterpretation: `The scales pause in contemplative poise. Aquifer infiltration and community nourishment have achieved sacred homeostasis; noise is washed clean by silver waters.`,
      solfeggioFrequency: 417
    };
  }

  // 4. Moderate Descent / Consolidation (The Crucible of Testing)
  if (delta >= -1.6) {
    return {
      stage: 'calcinatio',
      latinName: 'Calcinatio • Crucibulum & Separatio',
      stageTitle: 'Crucible of Seasonal Purification',
      glyph: '🜂',
      secondaryGlyph: '🝤',
      element: 'Ignis Geometria (Consolidating Flame)',
      elementIcon: '⚡',
      colorHex: '#D97706',
      borderClass: 'border-orange-500/60',
      bgClass: 'bg-orange-950/70',
      textClass: 'text-orange-300',
      glowColor: 'rgba(217, 119, 6, 0.4)',
      trendDelta: delta,
      trendVelocityPct: velocityPct,
      direction: 'moderate-descent',
      directionLabel: 'Crucible Testing (- Purifying Calcination)',
      hermeticPrinciple: 'Separation of the Essential',
      esotericAxiom: 'The Flame Consumes the Chaff to Reveal Indestructible Marrow',
      loreInterpretation: `Seasonal dryness or climatic friction tests the watershed. Redundant structures burn away so the root systems may harden and deepen toward deep aquifers.`,
      solfeggioFrequency: 396
    };
  }

  // 5. Deep Descent / Epistemic Shock (Solve et Coagula / The Subterranean Humus)
  return {
    stage: 'nigredo',
    latinName: 'Nigredo • Solve et Coagula & Putrefactio',
    stageTitle: 'Subterranean Humus Dissolution',
    glyph: '♄',
    secondaryGlyph: '🜄',
    element: 'Terra Subterranea (Ancestral Dark Humus)',
    elementIcon: '🌑',
    colorHex: '#A855F7',
    borderClass: 'border-purple-500/60',
    bgClass: 'bg-purple-950/70',
    textClass: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    trendDelta: delta,
    trendVelocityPct: velocityPct,
    direction: 'deep-descent',
    directionLabel: 'Solve et Coagula (- Subterranean Humus)',
    hermeticPrinciple: 'Polarity & Cyclic Rebirth',
    esotericAxiom: 'Except a Seed Fall into the Ground and Die, It Abideth Alone',
    loreInterpretation: `Solve et Coagula. The old extractive shell disintegrates into subterranean dark earth. This descent is not ruin, but the primordial incubation of future resurgence.`,
    solfeggioFrequency: 174
  };
}

/**
 * Historical Data Points mapped onto the Celestial Coordinate plane,
 * connecting impactful milestone events across bioregions into a single interconnected constellation:
 * "Via Regeneratio" (The Sovereign Arc of Bioregional Flourishing)
 */
export const CELESTIAL_HISTORICAL_ALIGNMENTS: CelestialHistoricalAlignment[] = [
  {
    monthIndex: 1,
    shortMonth: 'M01',
    calendarMonth: 'Oct 2025',
    milestone: 'Contour bioswales & sand dams chartered',
    bioregion: 'Mara Basin',
    starName: 'Alpha Mara (Basalt Core)',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    celestialCoordinates: {
      ra: '12h 14m',
      dec: '-04° 22\'',
      chartX: 22,
      chartY: 32
    },
    stellarMagnitude: 4.8,
    zkProof: '0x3a81f9b0...1284'
  },
  {
    monthIndex: 2,
    shortMonth: 'M02',
    calendarMonth: 'Nov 2025',
    milestone: 'Short rain infiltration into dry aquifers',
    bioregion: 'Mau Escarpment',
    starName: 'Gamma Mau (Subterranean Spine)',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    celestialCoordinates: {
      ra: '13h 05m',
      dec: '-08° 10\'',
      chartX: 16,
      chartY: 44
    },
    stellarMagnitude: 4.2,
    zkProof: '0x7b22e118...94a0'
  },
  {
    monthIndex: 3,
    shortMonth: 'M03',
    calendarMonth: 'Dec 2025',
    milestone: 'Community solar microgrids commissioned',
    bioregion: 'Kilifi Coast',
    starName: 'Alpha Kilifi (Solar Commons)',
    constellation: 'Phoenix Solaris',
    constellationColor: '#F59E0B',
    celestialCoordinates: {
      ra: '18h 42m',
      dec: '+12° 50\'',
      chartX: 74,
      chartY: 28
    },
    stellarMagnitude: 4.9,
    zkProof: '0x99c84e10...283b'
  },
  {
    monthIndex: 4,
    shortMonth: 'M04',
    calendarMonth: 'Jan 2026',
    milestone: 'Biochar soil amendment batch #104 distributed',
    bioregion: 'Laikipia Plateau',
    starName: 'Alpha Laikipia (SOC Vault)',
    constellation: 'Corona Mycelia',
    constellationColor: '#C5A059',
    celestialCoordinates: {
      ra: '05h 22m',
      dec: '+24° 15\'',
      chartX: 44,
      chartY: 22
    },
    stellarMagnitude: 4.6,
    zkProof: '0x12a048bc...7193'
  },
  {
    monthIndex: 5,
    shortMonth: 'M05',
    calendarMonth: 'Feb 2026',
    milestone: 'Non-usurious catalytic liquidity pool deployed',
    bioregion: 'Turkana Basin',
    starName: 'Beta Turkana (Equatorial Array)',
    constellation: 'Phoenix Solaris',
    constellationColor: '#F59E0B',
    celestialCoordinates: {
      ra: '19h 15m',
      dec: '+18° 40\'',
      chartX: 82,
      chartY: 18
    },
    stellarMagnitude: 4.4,
    zkProof: '0xfa018c4d...e290'
  },
  {
    monthIndex: 6,
    shortMonth: 'M06',
    calendarMonth: 'Mar 2026',
    milestone: 'Equatorial long rain subterranean sponge absorption',
    bioregion: 'Tsavo Drylands',
    starName: 'Delta Tsavo (Sand Vault)',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    celestialCoordinates: {
      ra: '14h 50m',
      dec: '-15° 30\'',
      chartX: 28,
      chartY: 52
    },
    stellarMagnitude: 4.3,
    zkProof: '0x55aa0182...bb3c'
  },
  {
    monthIndex: 7,
    shortMonth: 'M07',
    calendarMonth: 'Apr 2026',
    milestone: 'Aberdare cloud forest restoration perimeter verified',
    bioregion: 'Aberdare Range',
    starName: 'Beta Aberdare (Catchment Eye)',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    celestialCoordinates: {
      ra: '06h 40m',
      dec: '+32° 18\'',
      chartX: 30,
      chartY: 24
    },
    stellarMagnitude: 4.7,
    zkProof: '0x3c1b88aa...7710'
  },
  {
    monthIndex: 8,
    shortMonth: 'M08',
    calendarMonth: 'May 2026',
    milestone: 'Kilifi mangrove blue carbon credits anchored',
    bioregion: 'Kilifi Mangroves',
    starName: 'Gamma Kilifi (Tidal Carbon)',
    constellation: 'Phoenix Solaris',
    constellationColor: '#F59E0B',
    celestialCoordinates: {
      ra: '20h 10m',
      dec: '+08° 05\'',
      chartX: 68,
      chartY: 40
    },
    stellarMagnitude: 4.5,
    zkProof: '0x88cc2910...aa99'
  },
  {
    monthIndex: 9,
    shortMonth: 'M09',
    calendarMonth: 'Jun 2026',
    milestone: 'Bioacoustic sensor mesh confirms bird species return',
    bioregion: 'Kakamega Forest',
    starName: 'Beta Kakamega (Guineo-Congolian Canopy)',
    constellation: 'Arbor Vitae',
    constellationColor: '#10B981',
    celestialCoordinates: {
      ra: '08h 12m',
      dec: '+14° 50\'',
      chartX: 38,
      chartY: 72
    },
    stellarMagnitude: 4.8,
    zkProof: '0xaa12ef89...3321'
  },
  {
    monthIndex: 10,
    shortMonth: 'M10',
    calendarMonth: 'Jul 2026',
    milestone: 'Inter-clan pastoralist water compact ratified',
    bioregion: 'Mara-Serengeti',
    starName: 'Beta Mara-Serengeti (Bio-Corridor)',
    constellation: 'Corona Mycelia',
    constellationColor: '#C5A059',
    celestialCoordinates: {
      ra: '11h 35m',
      dec: '-02° 45\'',
      chartX: 54,
      chartY: 32
    },
    stellarMagnitude: 4.7,
    zkProof: '0x99aa66ff...1100'
  },
  {
    monthIndex: 11,
    shortMonth: 'M11',
    calendarMonth: 'Aug 2026',
    milestone: 'Drought resilience index exceeds 50-year high',
    bioregion: 'Mt. Kenya Perimeter',
    starName: 'Alpha Kirinyaga (Sacred Spine)',
    constellation: 'Arbor Vitae',
    constellationColor: '#10B981',
    celestialCoordinates: {
      ra: '07h 02m',
      dec: '+40° 12\'',
      chartX: 48,
      chartY: 62
    },
    stellarMagnitude: 5.0,
    zkProof: '0x88fe33aa...5542'
  },
  {
    monthIndex: 12,
    shortMonth: 'M12',
    calendarMonth: 'Sep 2026',
    milestone: 'Autonomous planetary steward DAO ratified',
    bioregion: 'Alchemical Sanctum Core',
    starName: 'Alpha Alchemia (The Crucible Core)',
    constellation: 'Crucibulum Aureum',
    constellationColor: '#E0C070',
    celestialCoordinates: {
      ra: '00h 00m',
      dec: '+00° 00\'',
      chartX: 50,
      chartY: 46
    },
    stellarMagnitude: 5.2,
    zkProof: '0xCOVENANT...GOLD'
  }
];

export const CONSTELLATION_VECTOR_PAIRS: [number, number][] = [
  [1, 2],  // Mara to Mau
  [2, 6],  // Mau to Tsavo
  [6, 7],  // Tsavo to Aberdare
  [7, 9],  // Aberdare to Kakamega
  [9, 11], // Kakamega to Mt Kenya
  [11, 4], // Mt Kenya to Laikipia
  [4, 10], // Laikipia to Mara-Serengeti
  [10, 12],// Mara-Serengeti to Alchemia Core
  [12, 3], // Core to Kilifi
  [3, 8],  // Kilifi to Mangroves
  [8, 5]   // Mangroves to Turkana
];
