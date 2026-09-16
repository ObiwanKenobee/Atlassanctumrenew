import React, { useState } from 'react';
import { 
  Award, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Lock,
  Heart,
  TreeDeciduous
} from 'lucide-react';
import { SEVEN_AXIOMATIC_VOWS } from '../../data/alchemicalData';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

export const AxiomaticVowsChamber: React.FC = () => {
  const [signedVows, setSignedVows] = useState<string[]>(['vow-1', 'vow-2']);
  const [stewardName, setStewardName] = useState<string>('Initiated Steward');
  const [consecrationSealed, setConsecrationSealed] = useState<boolean>(false);

  const toggleVow = (vowId: string) => {
    if (signedVows.includes(vowId)) {
      setSignedVows(prev => prev.filter(id => id !== vowId));
      alchemicalAudio.playSingingBowl(396, 1.0);
    } else {
      setSignedVows(prev => [...prev, vowId]);
      alchemicalAudio.playSingingBowl(528, 1.5);
    }
  };

  const handleSealCovenant = () => {
    setConsecrationSealed(true);
    alchemicalAudio.playSingingBowl(963, 4.0);
  };

  return (
    <div className="space-y-6">
      {/* Disciple Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
            The Disciple’s Covenant of the Seven Vows
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            Consecrating Devotion to the Living Web of Life
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            "Wisdom is not inherited through blood, but through obedience to the law of the living soil." Consecrate your vows as an initiated disciple of Atlas Sanctum.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-right font-mono">
          <span className="text-[10px] uppercase text-emerald-300 block">Consecrated Vows</span>
          <span className="text-lg font-bold text-emerald-400">{signedVows.length} of 7</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vows Checklist */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold block">
            The Seven Axiomatic Vows:
          </span>

          <div className="space-y-2.5">
            {SEVEN_AXIOMATIC_VOWS.map((vow) => {
              const isSigned = signedVows.includes(vow.id);

              return (
                <div
                  key={vow.id}
                  onClick={() => toggleVow(vow.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSigned
                      ? 'bg-emerald-950/20 border-emerald-500/50 text-white'
                      : 'bg-[#111111] border-white/10 text-slate-400 hover:bg-[#161616]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSigned
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-white/20 text-transparent'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-emerald-300">{vow.title}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                        {vow.element}
                      </span>
                    </div>

                    <p className="text-xs font-serif italic text-slate-200 leading-relaxed">
                      "{vow.vowText}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Covenant Seal Deed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0D0D0D] border-2 border-[#C5A059]/40 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="text-center pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                Covenant of Bioregional Kinship
              </span>
              <h4 className="text-lg font-serif font-bold text-white mt-1">
                Deed of Initiated Stewardship
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Steward Consecration Name:
                </label>
                <input
                  type="text"
                  value={stewardName}
                  onChange={(e) => setStewardName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#161616] border border-white/15 text-white font-serif text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Witnessing Realm:</span>
                  <span className="text-emerald-400">Earth Bioregional Council</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Vows Inscribed:</span>
                  <span className="text-amber-400">{signedVows.length} / 7</span>
                </div>
                <div className="flex justify-between">
                  <span>Axiomatic Status:</span>
                  <span className={signedVows.length === 7 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {signedVows.length === 7 ? 'Fully Initiated' : 'In Devotional Training'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSealCovenant}
                  disabled={signedVows.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-[#C5A059] hover:from-emerald-500 hover:to-amber-400 text-black font-serif font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Affix Golden Seal of Consecration</span>
                </button>
              </div>

              {consecrationSealed && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs text-emerald-200 font-serif animate-fadeIn">
                  ✨ Sealed and witnessed. Your vows are recorded in the sovereign moral baseline of Atlas Sanctum.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
