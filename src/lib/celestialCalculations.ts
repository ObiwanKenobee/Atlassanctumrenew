import { CelestialEphemeris } from '../types/alchemical';

/**
 * Calculates accurate astronomical ephemeris and hermetic planetary alignments
 * based on the Julian epoch and synodic lunar cycles.
 */

const SYNODIC_MONTH = 29.53058867; // Mean synodic month in days
const KNOWN_NEW_MOON = new Date('2026-01-18T19:52:00Z').getTime(); // Reference astronomical new moon in 2026

const ZODIAC_SIGNS = [
  'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
  'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
  'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
];

const PLANETARY_CHALDEAN_ORDER = [
  { name: 'Saturn ♄', metal: 'Lead', element: 'Earth', quality: 'Form & Memory' },
  { name: 'Jupiter ♃', metal: 'Tin', element: 'Air', quality: 'Abundance & Grace' },
  { name: 'Mars ♂', metal: 'Iron', element: 'Fire', quality: 'Will & Drive' },
  { name: 'Sun ☉', metal: 'Gold', element: 'Fire', quality: 'Vitality & Light' },
  { name: 'Venus ♀', metal: 'Copper', element: 'Water', quality: 'Harmony & Beauty' },
  { name: 'Mercury ☿', metal: 'Quicksilver', element: 'Aether', quality: 'Intellect & Alchemy' },
  { name: 'Moon ☽', metal: 'Silver', element: 'Water', quality: 'Soul & Fluidity' }
];

export function calculateCelestialEphemeris(now: Date = new Date()): CelestialEphemeris {
  const diffMs = now.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const phaseCycle = (diffDays % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseFraction = phaseCycle / SYNODIC_MONTH;

  let lunarPhase = 'New Moon';
  if (phaseFraction < 0.03 || phaseFraction >= 0.97) {
    lunarPhase = 'New Moon (Albedo Seed)';
  } else if (phaseFraction < 0.22) {
    lunarPhase = 'Waxing Crescent (Initiation)';
  } else if (phaseFraction < 0.28) {
    lunarPhase = 'First Quarter (Equilibrium)';
  } else if (phaseFraction < 0.47) {
    lunarPhase = 'Waxing Gibbous (Expansion)';
  } else if (phaseFraction < 0.53) {
    lunarPhase = 'Full Moon (Illumination)';
  } else if (phaseFraction < 0.72) {
    lunarPhase = 'Waning Gibbous (Dissemination)';
  } else if (phaseFraction < 0.78) {
    lunarPhase = 'Last Quarter (Transmutation)';
  } else {
    lunarPhase = 'Waning Crescent (Apophatic Return)';
  }

  // Illumination calculation (approximate 1 - cos(theta))/2
  const theta = 2 * Math.PI * phaseFraction;
  const illuminationPct = Math.round(((1 - Math.cos(theta)) / 2) * 100);

  // Zodiac sign approximation
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const zodiacIndex = Math.floor((dayOfYear / 365.25) * 12) % 12;
  const moonZodiacSign = ZODIAC_SIGNS[zodiacIndex];

  // Planetary hour calculation based on 24 hours
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  // Day rulers: Sun(Sun), Mon(Moon), Tue(Mars), Wed(Mercury), Thu(Jupiter), Fri(Venus), Sat(Saturn)
  const dayRulerIndices = [3, 6, 2, 5, 1, 4, 0];
  const startRuler = dayRulerIndices[dayOfWeek];
  const currentPlanetaryIndex = (startRuler + hour) % 7;
  const currentPlanet = PLANETARY_CHALDEAN_ORDER[currentPlanetaryIndex];

  // Solfeggio resonance harmonic mapped to phase and hour
  const solfeggioFrequencies = [396, 417, 432, 528, 639, 741, 852, 963];
  const resonanceIdx = (dayOfWeek + hour) % solfeggioFrequencies.length;
  const solfeggioResonanceHz = solfeggioFrequencies[resonanceIdx];

  // Solar zenith approximate
  const solarZenithDeg = Math.round(Math.abs(Math.sin((hour - 12) * (Math.PI / 12)) * 65));

  // Aetheric harmonic coherence index
  const aethericHarmonicScore = Math.min(99, Math.round(88 + (illuminationPct * 0.1) + ((hour % 6) * 0.5)));

  return {
    timestamp: now.toISOString(),
    lunarPhase,
    lunarPhaseFraction: Number(phaseFraction.toFixed(4)),
    lunarIlluminationPct: illuminationPct,
    moonZodiacSign,
    planetaryHour: `Hour of ${currentPlanet.name}`,
    planetaryRuler: `${currentPlanet.name} (${currentPlanet.metal}, ${currentPlanet.quality})`,
    solarZenithDeg,
    solfeggioResonanceHz,
    aethericHarmonicScore
  };
}
