import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Lock, 
  Sparkles, 
  Compass, 
  BrainCircuit, 
  BarChart3, 
  Mail, 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { useTrustLayer } from '../../../context/TrustLayerContext';
import { audioFeedback } from '../../../lib/audioFeedback';

export const ConsentManagementSection: React.FC = () => {
  const { 
    consent, 
    updateConsent, 
    acceptAllConsent, 
    acceptEssentialOnly, 
    revokeAllConsent 
  } = useTrustLayer();

  const [savedNotification, setSavedNotification] = useState(false);

  const handleToggle = (key: keyof typeof consent) => {
    if (key === 'essential') return; // Cannot toggle essential
    audioFeedback.playSubtleClick();
    updateConsent({ [key]: !consent[key] });
    triggerSavedFeedback();
  };

  const triggerSavedFeedback = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Overview & Quick Master Controls */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Dynamic Consent Management</span>
          </div>
          <h2 className="text-lg sm:text-xl font-medium font-serif text-[#F5F5F0]">
            Granular Permission Matrix
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Atlas Sanctum empowers you to adjust, inspect, and revoke specific data processing intents at any time. Your preferences are synchronized to your sovereign client profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              acceptAllConsent();
              triggerSavedFeedback();
            }}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-black text-xs font-mono font-bold rounded-sm transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>
          <button
            onClick={() => {
              acceptEssentialOnly();
              triggerSavedFeedback();
            }}
            className="px-3.5 py-2 bg-[#1B1B1B] hover:bg-[#252525] border border-[#F5F5F0]/15 text-[#F5F5F0] text-xs font-mono rounded-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Essential Only</span>
          </button>
          <button
            onClick={() => {
              revokeAllConsent();
              triggerSavedFeedback();
            }}
            className="px-3 py-2 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 text-xs font-mono rounded-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="Revoke all non-essential permissions immediately"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revoke All</span>
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Consent preferences successfully saved and applied to runtime sandbox.</span>
        </div>
      )}

      {/* Consent Toggles List */}
      <div className="space-y-3">
        {/* 1. Essential Platform Operations */}
        <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded text-[#C5A059] mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">1. Essential Platform Security & Session</h4>
                <span className="px-2 py-0.2 text-[9px] font-mono uppercase bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 rounded">
                  Always Required
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
                Cryptographic authentication state, secure session routing, CSRF prevention tokens, and core layout rendering.
              </p>
              <p className="text-[10px] font-mono text-[#F5F5F0]/40">Storage Mechanism: SessionStorage & Encrypted Auth Token</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-mono text-emerald-400 font-bold">Enforced</span>
            <div className="w-11 h-6 bg-[#1B3022] rounded-full p-1 border border-[#2D5A3C] opacity-80 cursor-not-allowed">
              <div className="w-4 h-4 bg-emerald-400 rounded-full translate-x-5 transition-transform" />
            </div>
          </div>
        </div>

        {/* 2. Bioregional Location & Watershed Telemetry */}
        <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded text-emerald-400 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">2. Bioregional Watershed Context & Local Maps</h4>
              <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
                Allows the application to preserve your preferred ecological watershed coordinates, soil layers, and catchment models between visits.
              </p>
              <p className="text-[10px] font-mono text-[#F5F5F0]/40">Storage Mechanism: LocalStorage (`atlas_bioregional_context`)</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('bioregionalLocation')}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer border flex items-center ${
              consent.bioregionalLocation 
                ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' 
                : 'bg-[#1A1A1A] border-[#F5F5F0]/20 justify-start'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-transform ${
              consent.bioregionalLocation ? 'bg-emerald-400 shadow-sm' : 'bg-[#F5F5F0]/40'
            }`} />
          </button>
        </div>

        {/* 3. AI Epistemic Optimization & Personalization */}
        <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded text-cyan-400 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">3. System Model Studio & Personalization</h4>
              <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
                Preserves customized parameter sliders in the System Model Studio, custom Opportunity filters, and favorite research topics.
              </p>
              <p className="text-[10px] font-mono text-[#F5F5F0]/40">Storage Mechanism: LocalStorage (`atlas_workspace_state`)</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('personalization')}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer border flex items-center ${
              consent.personalization 
                ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' 
                : 'bg-[#1A1A1A] border-[#F5F5F0]/20 justify-start'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-transform ${
              consent.personalization ? 'bg-cyan-400 shadow-sm' : 'bg-[#F5F5F0]/40'
            }`} />
          </button>
        </div>

        {/* 4. Anonymous Diagnostic Telemetry */}
        <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded text-[#8FB8DE] mt-0.5">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">4. Performance & Telemetry Analytics</h4>
              <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
                Anonymous load latency metrics and simulation frame-rate diagnostics to prevent bottlenecks on low-spec field devices.
              </p>
              <p className="text-[10px] font-mono text-[#F5F5F0]/40">Storage Mechanism: Epistemic In-Memory Diagnostics</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('analytics')}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer border flex items-center ${
              consent.analytics 
                ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' 
                : 'bg-[#1A1A1A] border-[#F5F5F0]/20 justify-start'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-transform ${
              consent.analytics ? 'bg-emerald-400 shadow-sm' : 'bg-[#F5F5F0]/40'
            }`} />
          </button>
        </div>

        {/* 5. AI Training & Fine-Tuning Consent (Explicit Opt-In) */}
        <div className="p-4 bg-[#121212] border border-amber-500/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-950/40 border border-amber-700/40 rounded text-amber-300 mt-0.5">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">5. Voluntary AI Model Improvement Contribution</h4>
                <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-500/40 rounded">
                  Opt-In Only
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
                Optionally donate anonymized ecological queries to the open-source Bioregional Foundation Model research commons.
              </p>
              <p className="text-[10px] font-mono text-[#F5F5F0]/40">Default is disabled under the Atlas Sanctum Covenant.</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('aiDataTraining')}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer border flex items-center ${
              consent.aiDataTraining 
                ? 'bg-amber-950 border-amber-500 justify-end' 
                : 'bg-[#1A1A1A] border-[#F5F5F0]/20 justify-start'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-transform ${
              consent.aiDataTraining ? 'bg-amber-400 shadow-sm' : 'bg-[#F5F5F0]/40'
            }`} />
          </button>
        </div>

        {/* 6. Biocultural Research Dispatches & Communications */}
        <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded text-[#C5A059] mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">6. Biocultural Research Dispatches & Governance Alerts</h4>
              <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
                Receive crucial announcements regarding new field lab grants, governance proposal votes, and ecological alert notifications.
              </p>
              <p className="text-[10px] font-mono text-[#F5F5F0]/40">Zero marketing spam or third-party sponsor solicitations.</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('communications')}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer border flex items-center ${
              consent.communications 
                ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' 
                : 'bg-[#1A1A1A] border-[#F5F5F0]/20 justify-start'
            }`}
          >
            <div className={`w-5 h-5 rounded-full transition-transform ${
              consent.communications ? 'bg-[#C5A059] shadow-sm' : 'bg-[#F5F5F0]/40'
            }`} />
          </button>
        </div>
      </div>

      {/* Storage Infrastructure Explanation */}
      <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#C5A059]">
          <HardDrive className="w-4 h-4" />
          <span>Local Storage & Cookie Infrastructure</span>
        </div>
        <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
          Unlike conventional commercial platforms that plant dozens of cross-site tracking cookies, Atlas Sanctum utilizes isolated HTML5 LocalStorage and IndexedDB partitions dedicated strictly to user session state and offline epistemic caching.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-[#C5A059]">LocalStorage:</span> User theme, accessibility scale, and consent preferences.
          </div>
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-emerald-400">IndexedDB:</span> Offline knowledge graph nodes and field lab observations.
          </div>
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
            <span className="text-cyan-400">SessionStorage:</span> Temporary command center queries and modal state.
          </div>
        </div>
      </div>
    </div>
  );
};
