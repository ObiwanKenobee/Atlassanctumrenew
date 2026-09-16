import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Compass, 
  Flame, 
  Droplets, 
  Leaf, 
  Wind, 
  Eye, 
  RefreshCw, 
  BookOpen, 
  ChevronRight, 
  ExternalLink,
  Volume2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { PageView } from '../../types';

export type MysticalPersona = 'alchemist' | 'mystic' | 'sage' | 'saint' | 'magician' | 'seeker' | 'disciple';

interface OracleProphecy {
  id: string;
  persona: MysticalPersona;
  metricLabel: string;
  metricValue: string;
  poeticTitle: string;
  revelation: string;
  stewardshipPraxis: string;
  sacredElement: 'earth' | 'water' | 'fire' | 'air' | 'aether';
  rune: string;
}

const ORACLE_PROPHECIES: OracleProphecy[] = [
  {
    id: 'prophecy-soil-alchemist',
    persona: 'alchemist',
    metricLabel: 'Soil SOC & Humus Transmutation',
    metricValue: '4.82% Organic Matter (+0.7%)',
    poeticTitle: 'The Black Sun in the Loam',
    revelation: 'The dead carbon that once darkened the sky is buried and blessed. Microscopic alchemists in the root-hair weave mineral dust into living gold. What was burnt returns as sweet humus.',
    stewardshipPraxis: 'Honor the unseen: touch damp earth with reverence today, acknowledging the trillion organisms holding up the sky.',
    sacredElement: 'earth',
    rune: '🜃'
  },
  {
    id: 'prophecy-aquifer-mystic',
    persona: 'mystic',
    metricLabel: 'Mara Basin Infiltration Depth',
    metricValue: '18.4M m³ Deep Sponge Retention',
    poeticTitle: 'The Subterranean Choir',
    revelation: 'The rain does not fall merely to escape; it sinks into the stone to remember its ocean mother. Deep within the Mara basalt, cold dark aquifers sing the song of stillness before time.',
    stewardshipPraxis: 'Practice unhurried listening. Let your thoughts percolate like mountain rain through layers of gravel before you speak.',
    sacredElement: 'water',
    rune: '🜄'
  },
  {
    id: 'prophecy-solar-magician',
    persona: 'magician',
    metricLabel: 'Decentralized Microgrid Solar Flux',
    metricValue: '1.42 MW P2P Photonic Harmony',
    poeticTitle: 'Casting the Solar Net',
    revelation: 'Across the savannah, silicon leaves catch celestial light and turn it into warmth without smoke. The sorcery of photons: daylight captured in copper veins to illuminate the night of the commons.',
    stewardshipPraxis: 'Recognize your tools as talismans. Every kilowatt flowing without extraction is a spell cast for future generations.',
    sacredElement: 'fire',
    rune: '🜂'
  },
  {
    id: 'prophecy-canopy-sage',
    persona: 'sage',
    metricLabel: 'Aberdare Cloud Forest Respiration',
    metricValue: '384,500 ha Unified Bioacoustics',
    poeticTitle: 'The Long Sigh of the Mountain',
    revelation: 'Two hundred million cycles of sunlight carved these misty ridges. The old trees have watched empires crumble like dry bread; they ask only that we keep the moisture in the moss.',
    stewardshipPraxis: 'Cultivate deep patience. Measure your decisions against the seven generations of trees yet unsprouted.',
    sacredElement: 'air',
    rune: '🜁'
  },
  {
    id: 'prophecy-compassion-saint',
    persona: 'saint',
    metricLabel: 'Wildlife Corridor Integrity',
    metricValue: '96.2% Unfragmented Passage',
    poeticTitle: 'The Sanctuary of Gentle Steps',
    revelation: 'The matriarch elephant steps where her grandmother stepped. No fence cuts her sacred pilgrimage. Every creature that drinks at the sand dam carries the divine breath; we are but gatekeepers of their peace.',
    stewardshipPraxis: 'Offer protection to the vulnerable. Remove an obstacle in your community so life can move freely.',
    sacredElement: 'aether',
    rune: '✧'
  },
  {
    id: 'prophecy-decoupling-seeker',
    persona: 'seeker',
    metricLabel: 'Planetary Decoupling Index',
    metricValue: '+31.4% Regenerative Abundance',
    poeticTitle: 'The Severing of the Extractive Knot',
    revelation: 'Look behind the veil of numbers: human flourishing no longer feeds upon the death of the biosphere. The illusion that greed was necessary has dissolved into the morning mist.',
    stewardshipPraxis: 'Seek the root of sufficiency. Ask: where does true wealth reside if not in living relationships and clean water?',
    sacredElement: 'aether',
    rune: '☸'
  },
  {
    id: 'prophecy-covenant-disciple',
    persona: 'disciple',
    metricLabel: 'Canon XXIII Moral Compliance',
    metricValue: '94.8% Epistemic Inviolability',
    poeticTitle: 'The Liturgy of the Living Ledger',
    revelation: 'We have pledged not to bear false witness against the soil. Every sensor is a prayer for truth; every cryptographic block is a vow kept with the watershed.',
    stewardshipPraxis: 'Stand firm in integrity. Let your actions match your vows, even when the world demands compromise.',
    sacredElement: 'earth',
    rune: '🜔'
  }
];

interface BioregionalOracleProps {
  onSelectTab?: (tab: PageView) => void;
  compact?: boolean;
}

export const BioregionalOracle: React.FC<BioregionalOracleProps> = ({
  onSelectTab,
  compact = false
}) => {
  const [selectedPersona, setSelectedPersona] = useState<MysticalPersona>('mystic');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDivining, setIsDivining] = useState(false);
  const [consultationCount, setConsultationCount] = useState(1);

  // Filter prophecies by selected persona or all
  const filteredProphecies = ORACLE_PROPHECIES.filter(p => p.persona === selectedPersona);
  const currentProphecy = filteredProphecies[currentIndex % (filteredProphecies.length || 1)] || ORACLE_PROPHECIES[0];

  const handleCastDivination = () => {
    setIsDivining(true);
    audioFeedback.playCovenantResonance();

    setTimeout(() => {
      // Pick random next prophecy
      setCurrentIndex(prev => prev + 1);
      setConsultationCount(prev => prev + 1);
      setIsDivining(false);
      audioFeedback.playSyncComplete();
    }, 450);
  };

  const personas: Array<{ id: MysticalPersona; label: string; icon: string }> = [
    { id: 'mystic', label: 'Mystic', icon: '🌌' },
    { id: 'alchemist', label: 'Alchemist', icon: '🧪' },
    { id: 'sage', label: 'Sage', icon: '📜' },
    { id: 'saint', label: 'Saint', icon: '🕊️' },
    { id: 'magician', label: 'Magician', icon: '🔮' },
    { id: 'seeker', label: 'Seeker', icon: '👁️' },
    { id: 'disciple', label: 'Disciple', icon: '🌿' }
  ];

  return (
    <div 
      id="bioregional-oracle-component"
      className="bg-gradient-to-b from-[#121212] via-[#0E1511] to-[#0A0A0A] border border-[#C5A059]/30 rounded-lg p-3.5 shadow-2xl relative overflow-hidden group"
    >
      {/* Mystical Ethereal Background Sheen */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#10B981]/5 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#C5A059]/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.3)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#C5A059]">
                Planetary Oracle
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20">
                {currentProphecy.rune}
              </span>
            </div>
            <p className="text-[9px] text-[#F5F5F0]/50 font-sans">
              Poetic Telemetry of the Living Biosphere
            </p>
          </div>
        </div>

        <button
          onClick={handleCastDivination}
          disabled={isDivining}
          title="Cast Divination: Consult the Living Oracle"
          className="flex items-center gap-1 px-2 py-1 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] text-[9px] font-mono rounded transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3 h-3 ${isDivining ? 'animate-spin text-[#C5A059]' : ''}`} />
          <span className="hidden sm:inline">Seek</span>
        </button>
      </div>

      {/* Mystical Persona Archetype Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-2.5 scrollbar-none">
        {personas.map(p => {
          const isSelected = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPersona(p.id);
                setCurrentIndex(0);
                audioFeedback.playSubtleClick();
              }}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#C5A059] text-[#0A0A0A] font-bold shadow-[0_0_8px_rgba(197,160,89,0.4)]'
                  : 'bg-white/5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-white/10'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Metric Being Interpreted */}
      <div className="bg-[#0D0D0D]/90 border border-[#F5F5F0]/10 rounded p-2 mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-[10px] font-mono text-[#F5F5F0]/70 truncate">
            {currentProphecy.metricLabel}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#C5A059] shrink-0">
          {currentProphecy.metricValue}
        </span>
      </div>

      {/* Oracle Revelation Card */}
      <div className={`transition-all duration-300 ${isDivining ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'}`}>
        <h4 className="text-xs font-serif font-bold text-[#F5F5F0] mb-1 flex items-center gap-1.5">
          <span className="text-[#C5A059]">✦</span>
          <span>{currentProphecy.poeticTitle}</span>
        </h4>

        <p className="text-[11px] text-[#F5F5F0]/80 font-serif italic leading-relaxed mb-2.5 bg-black/25 p-2 rounded border border-[#F5F5F0]/5">
          "{currentProphecy.revelation}"
        </p>

        {/* Stewardship Praxis / Wonder Invitation */}
        <div className="bg-[#15241B]/70 border border-[#10B981]/30 rounded p-2 text-[10px] mb-2">
          <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold uppercase text-[9px] mb-0.5">
            <Leaf className="w-2.5 h-2.5" />
            <span>Stewardship Praxis</span>
          </div>
          <p className="text-[#F5F5F0]/85 font-sans leading-snug">
            {currentProphecy.stewardshipPraxis}
          </p>
        </div>
      </div>

      {/* Footer Navigation Link to Alchemical Sanctum */}
      {onSelectTab && (
        <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[9px] font-mono">
          <span className="text-[#F5F5F0]/40">
            Consultation #{consultationCount}
          </span>
          <button
            onClick={() => onSelectTab('alchemical-sanctum')}
            className="text-[#C5A059] hover:text-[#E0C070] flex items-center gap-1 transition-colors group-hover:underline cursor-pointer"
          >
            <span>Enter Sanctum</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
