export type SacredArchetype = 
  | 'magician' 
  | 'seeker' 
  | 'mystic' 
  | 'disciple' 
  | 'saint' 
  | 'alchemist' 
  | 'sage';

export interface ArchetypeProfile {
  id: SacredArchetype;
  name: string;
  title: string;
  subtitle: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'aether';
  color: string;
  accentHex: string;
  virtue: string;
  invocation: string;
  sacredSymbol: string;
  quote: string;
  quoteAuthor: string;
  sacredFrequency: number;
}

export type AlchemicalStage = 'nigredo' | 'albedo' | 'citrinitas' | 'rubedo';

export interface AlchemicalStageInfo {
  stage: AlchemicalStage;
  title: string;
  latinName: string;
  colorHex: string;
  phaseName: string;
  elementalOperation: string;
  hermeticPrinciple: string;
  description: string;
  transmutationEffect: string;
  frequency: number;
}

export interface TransmutationRecipe {
  id: string;
  leadName: string;
  leadCategory: 'ecological' | 'economic' | 'social' | 'spiritual';
  leadDescription: string;
  toxicityWeightKg: number;
  transmutedGoldName: string;
  transmutedValueUsd: number;
  bioregionalMetric: string;
  flourishingBoost: number;
  purificationSteps: {
    nigredo: string;
    albedo: string;
    citrinitas: string;
    rubedo: string;
  };
}

export interface TransmutationCertificate {
  certificateId: string;
  timestamp: string;
  recipeName: string;
  leadTransmuted: string;
  goldProduced: string;
  quintessenceExtracted: string;
  merkleSeal: string;
  goldenRatioQuotient: number; // ~1.6180339887
  witnessArchetype: SacredArchetype;
}

export interface CelestialEphemeris {
  timestamp: string;
  lunarPhase: string;
  lunarPhaseFraction: number; // 0 to 1
  lunarIlluminationPct: number; // 0 to 100%
  moonZodiacSign: string;
  planetaryHour: string;
  planetaryRuler: string;
  solarZenithDeg: number;
  solfeggioResonanceHz: number;
  aethericHarmonicScore: number; // 0 to 100
}

export interface OracleCard {
  id: number;
  name: string;
  title: string;
  archetype: SacredArchetype;
  element: 'earth' | 'water' | 'fire' | 'air' | 'aether';
  aphorism: string;
  esotericMeaning: string;
  planetaryAction: string;
  bioregionalBlessing: string;
  sacredFrequency: number;
  iconName: string;
}

export interface EarthBenediction {
  id: string;
  bioregionName: string;
  coordinates: [number, number]; // lat, lng
  threatDesc: string;
  blessingText: string;
  saintlyPrayer: string;
  totalBlessingsCount: number;
  lastBlessedAt: string;
}

export interface SolfeggioFrequency {
  hz: number;
  name: string;
  traditionalPurpose: string;
  bioregionalResonance: string;
  chakraOrCenter: string;
  colorHex: string;
}
