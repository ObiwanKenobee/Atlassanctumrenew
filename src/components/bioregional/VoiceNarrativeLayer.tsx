import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Radio,
  Sliders,
  AudioWaveform,
  Globe2,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface VoiceNarrativeScript {
  id: string;
  zoneId: string;
  zoneName: string;
  voicePersona: 'Synthesizer Gaia' | 'Elder Steward' | 'Biophysical Sentinel';
  durationSeconds: number;
  transcript: string;
  keyInsights: string[];
  recommendedAction: string;
}

export const BIOREGIONAL_VOICE_SCRIPTS: Record<string, VoiceNarrativeScript> = {
  'zone-aberdare-ridge': {
    id: 'nar-aberdare',
    zoneId: 'zone-aberdare-ridge',
    zoneName: 'Aberdare Climax Podocarpus Ridge',
    voicePersona: 'Synthesizer Gaia',
    durationSeconds: 28,
    transcript: 'Initiating ecological synthesis for the Aberdare Climax Ridge. Current multi-strata crown cover has achieved seventy-eight percent density. Occult cloud mist condensation feeds twenty-four high-altitude streams, maintaining continuous groundwater recharge into the Naivasha basin aquifer.',
    keyInsights: [
      '420mm annual horizontal occult precipitation captured',
      'Continuous mycelial glomalin aggregate stability index at 94/100',
      'Endemic Mountain Bongo breeding glade stabilized'
    ],
    recommendedAction: 'Maintain current agroforestry buffer and expand high-ridge bamboo corridors by 400 hectares.'
  },
  'zone-mathare-swale': {
    id: 'nar-mathare',
    zoneId: 'zone-mathare-swale',
    zoneName: 'Mathare Riparian Bio-Swale Corridor',
    voicePersona: 'Biophysical Sentinel',
    durationSeconds: 24,
    transcript: 'Telemetry stream online for Mathare River catchment. Bio-engineered vetiver swales and pocket wetlands have reduced urban suspended silt washout by seventy-two percent. Dissolved oxygen levels have stabilized at six point four milligrams per liter.',
    keyInsights: [
      'Dissolved oxygen elevated to 6.4 mg/L',
      'Urban flash flood peak velocity dampened by 58%',
      'Active community bio-monitoring across 140 hectares'
    ],
    recommendedAction: 'Deploy secondary sediment filtration traps at the primary industrial runoff junction.'
  },
  'zone-mara-pastoral': {
    id: 'nar-mara',
    zoneId: 'zone-mara-pastoral',
    zoneName: 'Mara Basin Olosho Silvopasture Sponge',
    voicePersona: 'Elder Steward',
    durationSeconds: 30,
    transcript: 'Transmitting customary elder council wisdom for the Mara Basin. The seasonal Olosho rotational grazing calendar has permitted shallow root systems to recover over ninety days. Deep subterranean soil organic matter now exceeds three point four percent.',
    keyInsights: [
      'Olosho 90-day rest period fully adhered to by 14 pastoralist clans',
      'Subterranean water table elevated by +2.1 bar',
      'Zero riparian embankment collapse across 8.5 km corridor'
    ],
    recommendedAction: 'Codify elder migration bylaws into permanent regional water basin governance charter.'
  },
  'default': {
    id: 'nar-default',
    zoneId: 'default',
    zoneName: 'Aberdare-Mara Living Ecosphere',
    voicePersona: 'Synthesizer Gaia',
    durationSeconds: 26,
    transcript: 'Atlas Sanctum Bioregional Twin telemetry reports positive trophic equilibrium across all four monitoring quadrants. Soil carbon sequestration, aquifer piezometric head, and acoustic biodiversity indicators demonstrate sustained self-reinforcing regenerative feedback loops.',
    keyInsights: [
      'Composite flourishing index at 88.4 / 100',
      'Zero planetary boundary threshold violations recorded',
      'Real-time ground truth correlation at 96.2%'
    ],
    recommendedAction: 'Proceed with next phase causal counterfactual capital allocation.'
  }
};

interface VoiceNarrativeLayerProps {
  selectedZoneId?: string;
  selectedZoneName?: string;
  onSelectInsightModule?: (modId: string) => void;
}

export const VoiceNarrativeLayer: React.FC<VoiceNarrativeLayerProps> = ({
  selectedZoneId = 'zone-aberdare-ridge',
  selectedZoneName = 'Aberdare Climax Podocarpus Ridge',
  onSelectInsightModule
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentProgressSec, setCurrentProgressSec] = useState<number>(0);
  const [selectedPersona, setSelectedPersona] = useState<'Synthesizer Gaia' | 'Elder Steward' | 'Biophysical Sentinel'>('Synthesizer Gaia');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState<boolean>(false);
  const [isGeneratingAiAudio, setIsGeneratingAiAudio] = useState<boolean>(false);

  const script = BIOREGIONAL_VOICE_SCRIPTS[selectedZoneId] || {
    ...BIOREGIONAL_VOICE_SCRIPTS['default'],
    zoneName: selectedZoneName
  };

  const timerRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
  }, []);

  // Handle Stop Speech
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentProgressSec(0);
  };

  // Trigger synthesized audio narrative
  const playAudio = () => {
    stopAudio();
    setIsGeneratingAiAudio(true);
    audioFeedback.playImpactTrigger();

    setTimeout(() => {
      setIsGeneratingAiAudio(false);
      setIsPlaying(true);

      // Play Speech Synthesis if browser supports it
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(script.transcript);
        utterance.rate = playbackSpeed;
        utterance.pitch = selectedPersona === 'Elder Steward' ? 0.85 : selectedPersona === 'Biophysical Sentinel' ? 1.15 : 1.0;
        
        // Find best matching voice
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
          if (naturalVoice) utterance.voice = naturalVoice;
        }

        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentProgressSec(0);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }

      // Interval timer to update visual progress bar
      const startTime = Date.now();
      const totalSec = script.durationSeconds / playbackSpeed;

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= totalSec) {
          stopAudio();
        } else {
          setCurrentProgressSec(elapsed);
        }
      }, 100);
    }, 400);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [selectedZoneId]);

  const progressPercent = Math.min(100, Math.round((currentProgressSec / (script.durationSeconds / playbackSpeed)) * 100));

  return (
    <div 
      id="voice-narrative-layer"
      className="p-5 bg-[#0C120E] border border-emerald-500/50 rounded-sm space-y-4 shadow-xl text-[#F5F5F0]"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              VOICE NARRATIVE LAYER • AI ACOUSTIC KNOWLEDGE SYNTHESIS
            </span>
            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              Real-Time Context Audio
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0]">
            Ecological Audio Briefing: {script.zoneName}
          </h3>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {(['Synthesizer Gaia', 'Elder Steward', 'Biophysical Sentinel'] as const).map(persona => {
            const isSel = selectedPersona === persona;
            return (
              <button
                key={persona}
                onClick={() => {
                  setSelectedPersona(persona);
                  audioFeedback.playMicroTick();
                  if (isPlaying) {
                    stopAudio();
                  }
                }}
                className={`px-2.5 py-1 rounded-xs border text-[10px] whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm'
                    : 'bg-[#141A16] border-emerald-500/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                }`}
              >
                {persona}
              </button>
            );
          })}
        </div>
      </div>

      {/* Narrative Waveform Visualizer & Audio Controls */}
      <div className="p-4 bg-[#080D09] border border-emerald-500/20 rounded-xs space-y-3">
        <div className="flex items-center justify-between gap-4">
          {/* Main Play / Pause Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? stopAudio : playAudio}
              disabled={isGeneratingAiAudio}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-black hover:bg-amber-400 animate-pulse'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-105'
              }`}
              title={isPlaying ? 'Pause Narrative' : 'Play AI Voice Narrative'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div>
              <span className="text-xs font-serif font-bold text-[#F5F5F0] block">
                {isGeneratingAiAudio ? 'Synthesizing Neural Speech...' : isPlaying ? 'Playing Ecological Briefing' : 'Ready to Narrate'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Persona: {selectedPersona} • {Math.round(currentProgressSec)}s / {Math.round(script.durationSeconds / playbackSpeed)}s
              </span>
            </div>
          </div>

          {/* Animated Equalizer Waveform */}
          <div className="flex items-center gap-1 h-8 px-3 bg-[#050806] rounded border border-emerald-500/20">
            {[12, 24, 38, 18, 44, 28, 50, 32, 16, 40, 22, 36].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-emerald-400 rounded-full transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(4, (h * ((i % 3) + 1) * 0.4) % 32)}px` : '4px',
                  opacity: isPlaying ? 0.9 : 0.25
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrub / Progress Bar */}
        <div className="w-full bg-[#1A251E] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Full Transcript Box */}
      <div className="p-3.5 bg-[#090E0A] border border-[#F5F5F0]/10 rounded-xs space-y-2 text-xs">
        <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
          Speech Synthesis Transcript:
        </span>
        <p className="text-[#F5F5F0]/85 font-sans leading-relaxed italic">
          "{script.transcript}"
        </p>
      </div>

      {/* Extracted Key Insights Bullet Points */}
      <div className="space-y-2 text-xs">
        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
          Key Ecological Takeaways:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {script.keyInsights.map((insight, idx) => (
            <div key={idx} className="p-2.5 bg-[#121A15] border border-emerald-500/20 rounded-xs text-[11px] font-mono text-[#F5F5F0]/80 space-y-1">
              <span className="text-emerald-400 font-bold text-[10px]">0{idx + 1}.</span>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
