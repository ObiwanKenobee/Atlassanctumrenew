import React, { useEffect, useState } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  ShieldAlert, 
  FileCheck, 
  BrainCircuit, 
  Eye, 
  BarChart3, 
  Scale, 
  Award, 
  Activity, 
  Sliders, 
  Sparkles, 
  Search, 
  Download, 
  Type, 
  Contrast, 
  FileText,
  ChevronRight,
  ExternalLink,
  Keyboard
} from 'lucide-react';
import { useTrustLayer } from '../../context/TrustLayerContext';
import { TrustPillarId } from '../../types/trust';
import { TRUST_PILLARS } from '../../data/trustData';
import { PrivacyCenterSection } from './sections/PrivacyCenterSection';
import { ConsentManagementSection } from './sections/ConsentManagementSection';
import { SecurityCenterSection } from './sections/SecurityCenterSection';
import { DataRightsDashboardSection } from './sections/DataRightsDashboardSection';
import { AITransparencySection } from './sections/AITransparencySection';
import { AccessibilityCenterSection } from './sections/AccessibilityCenterSection';
import { ImpactTransparencySection } from './sections/ImpactTransparencySection';
import { TermsGovernanceSection } from './sections/TermsGovernanceSection';
import { VerificationSystemSection } from './sections/VerificationSystemSection';
import { IncidentStatusSection } from './sections/IncidentStatusSection';
import { UnifiedPreferenceSection } from './sections/UnifiedPreferenceSection';
import { EthicalCovenantSection } from './sections/EthicalCovenantSection';
import { audioFeedback } from '../../lib/audioFeedback';

const PILLAR_ICONS: Record<TrustPillarId, React.ComponentType<{ className?: string }>> = {
  'privacy': Shield,
  'consent': Lock,
  'security': ShieldAlert,
  'data-rights': FileCheck,
  'ai-transparency': BrainCircuit,
  'accessibility': Eye,
  'impact-transparency': BarChart3,
  'governance-terms': Scale,
  'verification-system': Award,
  'incident-status': Activity,
  'unified-preferences': Sliders,
  'ethical-covenant': Sparkles
};

export const TrustLayerModal: React.FC = () => {
  const { 
    isTrustModalOpen, 
    activePillar, 
    closeTrustModal, 
    openTrustModal,
    plainLanguage, 
    togglePlainLanguage,
    accessibility,
    updateAccessibility
  } = useTrustLayer();

  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTrustModalOpen) {
        closeTrustModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrustModalOpen, closeTrustModal]);

  if (!isTrustModalOpen) return null;

  const filteredPillars = TRUST_PILLARS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderActiveSection = () => {
    switch (activePillar) {
      case 'privacy':
        return <PrivacyCenterSection />;
      case 'consent':
        return <ConsentManagementSection />;
      case 'security':
        return <SecurityCenterSection />;
      case 'data-rights':
        return <DataRightsDashboardSection />;
      case 'ai-transparency':
        return <AITransparencySection />;
      case 'accessibility':
        return <AccessibilityCenterSection />;
      case 'impact-transparency':
        return <ImpactTransparencySection />;
      case 'governance-terms':
        return <TermsGovernanceSection />;
      case 'verification-system':
        return <VerificationSystemSection />;
      case 'incident-status':
        return <IncidentStatusSection />;
      case 'unified-preferences':
        return <UnifiedPreferenceSection />;
      case 'ethical-covenant':
        return <EthicalCovenantSection />;
      default:
        return <PrivacyCenterSection />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-layer-title"
    >
      <div 
        className="w-full max-w-7xl h-[92vh] max-h-[920px] bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-sm shadow-2xl flex flex-col overflow-hidden text-[#F5F5F0]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Navigation & Accessibility Toolbar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#121212] border-b border-[#F5F5F0]/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded text-[#C5A059]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="trust-layer-title" className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0] tracking-wide">
                  Atlas Sanctum Trust Layer
                </h1>
                <span className="px-1.5 py-0.2 bg-[#1B3022] border border-[#2D5A3C] text-emerald-300 text-[9px] font-mono rounded uppercase">
                  Sovereign Architecture
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/60 font-mono hidden sm:block">
                Comprehensive Privacy, Consent, AI Transparency & Impact Verification Hub
              </p>
            </div>
          </div>

          {/* Quick Accessibility & Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Plain Language Toggle */}
            <button
              onClick={togglePlainLanguage}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                plainLanguage 
                  ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold' 
                  : 'bg-[#1E1E1E] border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:bg-[#252525]'
              }`}
              title="Toggle Plain-Language Explanations"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Plain Language:</span>
              <span>{plainLanguage ? 'ON' : 'OFF'}</span>
            </button>

            {/* Contrast Toggle */}
            <button
              onClick={() => {
                const nextMode = accessibility.contrastMode === 'standard' ? 'high-contrast' : 'standard';
                updateAccessibility({ contrastMode: nextMode });
                window.dispatchEvent(new CustomEvent('atlas-theme-changed', { detail: { theme: nextMode === 'high-contrast' ? 'high-contrast' : 'dark' } }));
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                accessibility.contrastMode === 'high-contrast'
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                  : 'bg-[#1E1E1E] border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:bg-[#252525]'
              }`}
              title="Toggle High Contrast Mode"
            >
              <Contrast className="w-3.5 h-3.5" />
              <span className="hidden md:inline">AAA Contrast</span>
            </button>

            {/* Font Size Cycle */}
            <button
              onClick={() => {
                const nextSize = accessibility.fontSize === 'normal' ? 'large' : accessibility.fontSize === 'large' ? 'extra-large' : 'normal';
                updateAccessibility({ fontSize: nextSize });
              }}
              className="px-2.5 py-1 bg-[#1E1E1E] hover:bg-[#252525] border border-[#F5F5F0]/15 text-[#F5F5F0]/80 text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
              title="Cycle Font Scale"
            >
              <Type className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-bold uppercase text-[10px]">{accessibility.fontSize.slice(0, 1).toUpperCase()}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closeTrustModal}
              className="p-1.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#F5F5F0]/20 rounded text-[#F5F5F0]/80 hover:text-white cursor-pointer transition-all ml-1"
              aria-label="Close Trust Layer Modal (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Sidebar Navigation + Dynamic Content Area) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar (12 Trust Pillars Navigation) */}
          <div className="w-full md:w-72 lg:w-80 bg-[#0E0E0E] border-r border-[#F5F5F0]/10 flex flex-col shrink-0 overflow-hidden">
            {/* Search Filter for Pillars */}
            <div className="p-3 border-b border-[#F5F5F0]/10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter 12 trust modules..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#161616] border border-[#F5F5F0]/15 rounded text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Pillars List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredPillars.map(pillar => {
                const IconComponent = PILLAR_ICONS[pillar.id] || Shield;
                const isActive = activePillar === pillar.id;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      openTrustModal(pillar.id);
                      audioFeedback.playMicroTick();
                    }}
                    className={`w-full text-left p-2.5 rounded transition-all cursor-pointer flex items-center justify-between group ${
                      isActive 
                        ? 'bg-[#C5A059] text-black font-bold shadow-sm' 
                        : 'text-[#F5F5F0]/70 hover:bg-[#1A1A1A] hover:text-[#F5F5F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1 rounded ${isActive ? 'bg-black/15 text-black' : 'text-[#C5A059]'}`}>
                        <IconComponent className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-mono font-medium truncate">{pillar.title}</p>
                        <p className={`text-[10px] truncate ${isActive ? 'text-black/70' : 'text-[#F5F5F0]/40'}`}>
                          {pillar.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-black' : 'text-[#F5F5F0]/30 group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </div>

            {/* Sidebar Bottom Assurance */}
            <div className="p-3 bg-[#080808] border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/50 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Verified Clean Sandbox</span>
                <span>0 Trackers</span>
              </div>
              <p className="text-[#F5F5F0]/40">Non-extractive epistemic protocol.</p>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1 bg-[#0A0A0A] overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            {renderActiveSection()}
          </div>
        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#0D0D0D] border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 text-[#F5F5F0]/60 text-[11px]">
            <Keyboard className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Use <kbd className="px-1.5 py-0.5 bg-[#222] rounded border border-[#F5F5F0]/20 text-[#F5F5F0]">ESC</kbd> to exit • Press <kbd className="px-1.5 py-0.5 bg-[#222] rounded border border-[#F5F5F0]/20 text-[#F5F5F0]">⌘K</kbd> for Command Palette</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#C5A059] font-mono">
              Atlas Sanctum Epistemic Foundation © 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
