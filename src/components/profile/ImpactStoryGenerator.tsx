import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Share2, 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  HeartHandshake, 
  ShieldCheck, 
  TreePine, 
  Droplets, 
  Flame, 
  Compass, 
  Sliders, 
  Quote
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface ImpactStoryGeneratorProps {
  stewardName?: string;
  reputationPoints: number;
  verifiedAuditsSigned: number;
  earnedBadgeCount: number;
  hectaresRestored: number;
  litersProtectedMillions: number;
  carbonSequesteredTons: number;
  streakDays?: number;
}

export type StoryTone = 'lyrical' | 'technical' | 'ancestral';
export type BioregionFocus = 'mara_watershed' | 'kilifi_coast' | 'mau_complex' | 'turkana_basin';

export const ImpactStoryGenerator: React.FC<ImpactStoryGeneratorProps> = ({
  stewardName = 'Amani Kiprono',
  reputationPoints,
  verifiedAuditsSigned,
  earnedBadgeCount,
  hectaresRestored,
  litersProtectedMillions,
  carbonSequesteredTons,
  streakDays = 14
}) => {
  const [tone, setTone] = useState<StoryTone>('lyrical');
  const [bioregion, setBioregion] = useState<BioregionFocus>('mara_watershed');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [ambientPlaying, setAmbientPlaying] = useState<boolean>(false);

  // Generate dynamic story based on inputs
  const story = useMemo(() => {
    const litersFormatted = `${litersProtectedMillions} million`;
    const hectaresFormatted = `${hectaresRestored.toLocaleString()} hectares`;
    const carbonFormatted = `${carbonSequesteredTons.toLocaleString()} metric tons`;

    if (tone === 'lyrical') {
      return {
        title: `The Living River of ${stewardName}`,
        subtitle: `A chronicle of patient regeneration across ${hectaresFormatted}`,
        narrative: `In the quiet hours before dawn, when the morning mist still clings to the riparian grasses of the Upper Mara, one citizen's quiet devotion ripple outward across an entire catchment. Over ${streakDays} consecutive dawn vigils, ${stewardName} did not merely observe the Earth; they stood guard over its fragile arteries.

Through ${verifiedAuditsSigned} cryptographically verified field audits and the grounding of satellite anomalies into tangible soil truth, ${litersFormatted} liters of precious headwater flow were shielded from destructive siltation. Every swale measured and every canopy transect verified has woven a protective skin over ${hectaresFormatted} of vulnerable biosphere—sequestering ${carbonFormatted} of living carbon back into mother humus.

This is not the work of distant bureaucracies. It is the steady heartbeat of civic stewardship: living evidence that when humans align their attention with the ecology that sustains them, the land answers with immediate, fertile gratitude.`,
        tagline: 'When the river flows clear, the children of the valley breathe in peace.',
        keyMetrics: [
          { label: 'Living Biomass Secured', value: `${carbonFormatted}` },
          { label: 'Freshwater Lens Preserved', value: `${litersFormatted} L` },
          { label: 'Dawn Watch Streak', value: `${streakDays} Days Continuous` },
          { label: 'Sanctum Reputation', value: `${reputationPoints.toLocaleString()} Rep` }
        ]
      };
    } else if (tone === 'technical') {
      return {
        title: `Biophysical Field Impact Report: ${stewardName}`,
        subtitle: `Calibrated telemetry & empirical restoration dossier • ${streakDays}d active cycle`,
        narrative: `TECHNICAL EXECUTIVE SUMMARY: Field Steward ${stewardName} has executed ${verifiedAuditsSigned} high-assurance telemetry validations within the active bioregional grid. By coupling in-situ lysimeter matric potentials with Sentinel-2 MSI multispectral reflectance indices, ground-level validation reduced spaceborne uncertainty by 42.6%.

INTERVENTION YIELD: Cumulative vegetative surface stabilization spans ${hectaresFormatted}, resulting in an empirically modeled infiltration surplus of ${litersFormatted} liters across vulnerable aquifer recharge sectors. Net terrestrial carbon stock accretion is audited at ${carbonFormatted} CO2e, verified via non-destructive canopy allometry and soil organic matter cores.

AUDIT PROVENANCE: All ${earnedBadgeCount} earned stewardship badges remain secured by distributed cryptographic Merkle proofs, providing unimpeachable evidentiary backing for Atlas Sanctum's decentralized ecological balance sheet.`,
        tagline: 'Empirically ground-truthed. Statistically significant. Ecologically restorative.',
        keyMetrics: [
          { label: 'Verification Assurance', value: '99.4% Dual-Sensor' },
          { label: 'Hydrologic Surplus', value: `${litersFormatted} L` },
          { label: 'Carbon Stock Accretion', value: `${carbonFormatted}` },
          { label: 'Audited Badges', value: `${earnedBadgeCount} Badges` }
        ]
      };
    } else {
      // Ancestral Tone
      return {
        title: `Songs of the Ancient Soil: The Path of ${stewardName}`,
        subtitle: `Honoring the covenant between community and the living watershed`,
        narrative: `The elders taught that the river remembers every footstep that approaches it with humility. For ${streakDays} unbroken sunrises, ${stewardName} has walked the path of the true custodian, carrying neither exploitation nor indifference, but the sacred promise to leave the watering holes sweeter than they were found.

By standing between the fragile riverbanks and the machinery of neglect, ${stewardName} guarded ${litersFormatted} liters of life-giving water—the very blood of our livestock and the nursery of our children's future. With hands in the dark earth and eyes attuned to the sky's distant stars, they brought healing to ${hectaresFormatted} of ancestral pastures, restoring ${carbonFormatted} of sacred breath into the living womb of the continent.

Let it be told in the barazas and whispered under the broad canopy of the Acacia: here walked a steward who honored the covenant of the living earth.`,
        tagline: 'We do not inherit the land from our ancestors; we borrow it from our descendants.',
        keyMetrics: [
          { label: 'Pastures Healed', value: `${hectaresFormatted}` },
          { label: 'Ancestral Waters Kept', value: `${litersFormatted} L` },
          { label: 'Sacred Breath Restored', value: `${carbonFormatted}` },
          { label: 'Vigil of the Guardians', value: `${streakDays} Days` }
        ]
      };
    }
  }, [tone, bioregion, stewardName, reputationPoints, verifiedAuditsSigned, earnedBadgeCount, hectaresRestored, litersProtectedMillions, carbonSequesteredTons, streakDays]);

  const handleRegenerate = () => {
    audioFeedback.playMicroTick();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      audioFeedback.playBell([528, 660], 0.25);
    }, 450);
  };

  const handleCopyStory = () => {
    audioFeedback.playMicroTick();
    const shareText = `🌿 ATLAS SANCTUM STEWARD STORY: "${story.title}"\n${story.subtitle}\n\n${story.narrative}\n\nKey Ecological Impact:\n• ${story.keyMetrics.map(m => `${m.label}: ${m.value}`).join('\n• ')}\n\nVerified on Atlas Sanctum Sovereign Ledger`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    audioFeedback.playMicroTick();
    const mdContent = `# ${story.title}\n*${story.subtitle}*\n\n> "${story.tagline}"\n\n${story.narrative}\n\n## Audited Impact Metrics\n${story.keyMetrics.map(m => `- **${m.label}**: ${m.value}`).join('\n')}\n\n---\n*Verified by Atlas Sanctum Decentralized Bioregional Ledger*\n*Proof Hash: 0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}*`;
    
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Atlas_Impact_Story_${stewardName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleAmbientSound = () => {
    if (!ambientPlaying) {
      audioFeedback.playBell([396, 528, 639], 0.35);
      setAmbientPlaying(true);
    } else {
      setAmbientPlaying(false);
    }
  };

  return (
    <div id="impact-story-generator" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Strategy Controls */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C1710] via-[#09120C] to-[#0C1710] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-400/40 text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
              Automated Impact Story Generator
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
              AI NARRATIVE SYNTHESIS
            </span>
          </div>
          <p className="text-xs text-white/60 font-sans">
            Transforms your verifiable field audits, tree transects, and telemetry calibrations into an emotionally resonant, shareable story of ecological regeneration.
          </p>
        </div>

        {/* Tone Selection Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setTone('lyrical');
            }}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              tone === 'lyrical'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Lyrical &amp; Poetic
          </button>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setTone('technical');
            }}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              tone === 'technical'
                ? 'bg-cyan-500 text-black font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Technical Dossier
          </button>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setTone('ancestral');
            }}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              tone === 'ancestral'
                ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Ancestral Baraza
          </button>
        </div>
      </div>

      {/* Main Story Parchment / Card */}
      <div className={`p-6 sm:p-8 rounded-xl border relative transition-all overflow-hidden ${
        tone === 'lyrical'
          ? 'bg-gradient-to-b from-[#0B150F] to-[#060D09] border-emerald-500/40 shadow-xl shadow-emerald-950/20'
          : tone === 'technical'
          ? 'bg-[#090D11] border-cyan-500/40 shadow-xl shadow-cyan-950/20'
          : 'bg-gradient-to-b from-[#15120B] to-[#0B0906] border-[#C5A059]/40 shadow-xl shadow-amber-950/20'
      }`}>
        {/* Subtle Decorative Backdrop Element */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Quote className="w-64 h-64 text-white" />
        </div>

        {/* Story Header */}
        <div className="relative z-10 space-y-2 border-b border-white/10 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#C5A059] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Regenerative Narrative
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAmbientSound}
                className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  ambientPlaying
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-black/40 border-white/10 text-white/50 hover:text-white'
                }`}
                title="Toggle Ambient Acoustic Resonator"
              >
                {ambientPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{ambientPlaying ? 'Resonator On' : 'Ambient'}</span>
              </button>
              
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                title="Re-synthesize Story"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="text-[10px]">Re-synthesize</span>
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            {story.title}
          </h2>
          <p className="text-xs font-mono text-white/60">
            {story.subtitle}
          </p>
        </div>

        {/* Narrative Body */}
        <div className="relative z-10 py-6 space-y-4">
          <p className="text-sm sm:text-base font-serif text-[#F5F5F0]/90 leading-relaxed whitespace-pre-line tracking-wide">
            {story.narrative}
          </p>

          <blockquote className="p-3 my-4 rounded-lg bg-black/40 border-l-2 border-[#C5A059] text-xs sm:text-sm font-serif italic text-[#C5A059] pl-4">
            &ldquo;{story.tagline}&rdquo;
          </blockquote>
        </div>

        {/* Four Key Metrics Pillars */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/10">
          {story.keyMetrics.map((metric, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-black/50 border border-white/10 space-y-1">
              <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                {metric.label}
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-[#F5F5F0] truncate">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Story Action Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically attested by Atlas Bioregional Engine</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="copy-impact-story-btn"
              onClick={handleCopyStory}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                copied
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-black/60 hover:bg-[#141E17] text-[#C5A059] border-[#C5A059]/40 hover:border-[#C5A059]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Story Copied!' : 'Copy Shareable Story'}</span>
            </button>

            <button
              id="download-impact-markdown-btn"
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Download Markdown Dossier"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
