import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  Clock, 
  Globe, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  History, 
  Search, 
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';
import { PRIVACY_COLLECTION_ITEMS, PRIVACY_POLICY_VERSIONS } from '../../../data/trustData';
import { useTrustLayer } from '../../../context/TrustLayerContext';
import { audioFeedback } from '../../../lib/audioFeedback';

export const PrivacyCenterSection: React.FC = () => {
  const { openTrustModal } = useTrustLayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('2026.1 (Current)');

  const filteredItems = PRIVACY_COLLECTION_ITEMS.filter(item => 
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dataPoints.some(dp => dp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeVersionData = PRIVACY_POLICY_VERSIONS.find(v => v.version === selectedVersion) || PRIVACY_POLICY_VERSIONS[0];

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B3022]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#C5A059]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">Epistemic Privacy Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light font-serif text-[#F5F5F0]">
            Sovereign Data Governance & Radical Transparency
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-3xl leading-relaxed">
            Atlas Sanctum operates on the principle of biological and data sovereignty. We collect only what is strictly necessary to compute regenerative ecological models and maintain non-extractive coordination.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                openTrustModal('data-rights');
                audioFeedback.playSubtleClick();
              }}
              className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B38F46] text-black text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exercise Data Rights (Download / Purge)</span>
            </button>
            <button
              onClick={() => {
                openTrustModal('consent');
                audioFeedback.playSubtleClick();
              }}
              className="px-3.5 py-1.5 bg-[#1B3022]/40 hover:bg-[#1B3022]/70 border border-[#2D5A3C]/50 text-emerald-300 text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Manage Consent Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Database className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider">What We Collect</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Bioregional map selections, auth credentials, and ephemeral queries. Zero device fingerprinting or ad beacons.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider">Why We Collect It</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Exclusively to compute ecological twins, power the Moral Arbiter, and coordinate decentralized regenerative capital.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Clock className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider">Retention Limits</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            In-memory buffers for AI prompts (0-day server retention); local browser storage for offline field resilience.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Globe className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider">Processing Locations</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Local browser sandbox first, augmented by sovereign European cloud nodes with strict GDPR & SOC2 isolation.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-[#8FB8DE]">
            <Shield className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider">Who Receives It</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Never sold, leased, or syndicated. Zero third-party ad brokers or data harvesting partnerships.
          </p>
        </div>

        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <FileText className="w-4 h-4" />
            <h4 className="text-xs font-mono uppercase font-bold tracking-wider">Your Total Control</h4>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Self-serve export as verifiable JSON, 1-click cryptographic purge, and instant consent revocation anytime.
          </p>
        </div>
      </div>

      {/* Granular Data Ingestion Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-mono uppercase font-bold tracking-wider text-[#F5F5F0] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#C5A059]" />
              Comprehensive Data Category Registry
            </h3>
            <p className="text-xs text-[#F5F5F0]/60">Transparent inventory of all telemetry, storage mechanisms, and legal bases</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter data categories..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm hover:border-[#F5F5F0]/20 transition-all space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-mono">{item.category}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1B3022]/50 border border-[#2D5A3C]/40 text-[10px] font-mono text-emerald-300 rounded">
                    Legal Basis: {item.legalBasis}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-950/40 border border-blue-800/40 text-[10px] font-mono text-cyan-300 rounded">
                    {item.sovereigntyStandard}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 mb-1">Data Elements</p>
                  <ul className="space-y-0.5">
                    {item.dataPoints.map((dp, idx) => (
                      <li key={idx} className="text-[#F5F5F0]/80 font-mono text-[11px] flex items-center gap-1.5">
                        <span className="text-[#C5A059]">•</span> {dp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 mb-1">Purpose & Use</p>
                  <p className="text-[#F5F5F0]/70 text-[11px] leading-relaxed">{item.purpose}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 mb-1">Retention Period</p>
                  <p className="text-[#F5F5F0]/70 text-[11px] leading-relaxed font-mono">{item.retentionPeriod}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 mb-1">Processing Node & Recipients</p>
                  <p className="text-[#F5F5F0]/70 text-[11px] leading-relaxed">{item.processingLocation}</p>
                  <p className="text-[10px] text-[#C5A059] mt-1 font-mono">{item.recipients.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Policy Version History & Audit Trail */}
      <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-[#F5F5F0]">
              Privacy Policy Version History & Epistemic Changelog
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {PRIVACY_POLICY_VERSIONS.map(v => (
              <button
                key={v.version}
                onClick={() => {
                  setSelectedVersion(v.version);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all cursor-pointer ${
                  selectedVersion === v.version
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0]/70 border border-[#F5F5F0]/10'
                }`}
              >
                {v.version}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/5 rounded-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[#C5A059]">Effective: {activeVersionData.effectiveDate}</span>
            <span className="font-mono text-[#F5F5F0]/60">Authorized by: {activeVersionData.authorizingBody}</span>
          </div>
          <p className="text-xs text-[#F5F5F0]/80 leading-relaxed font-sans">
            {activeVersionData.summaryOfChanges}
          </p>
          <div className="space-y-1.5 pt-2 border-t border-[#F5F5F0]/5">
            <p className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Key Structural Additions:</p>
            <ul className="space-y-1">
              {activeVersionData.diffSummary.map((diff, i) => (
                <li key={i} className="text-xs text-emerald-300 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
