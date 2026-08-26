import React from 'react';
import { TreeDeciduous, ArrowUpRight, Scale, Sparkles } from 'lucide-react';
import { PageView } from '../types';
import { EnvironmentStatusFooter } from './EnvironmentStatusFooter';

interface FooterProps {
  onSelectTab: (tab: PageView) => void;
  onOpenMoralSimulator: () => void;
  onOpenCommandCenter: () => void;
  onOpenCommandments?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenMoralSimulator,
  onOpenCommandCenter,
  onOpenCommandments
}) => {
  return (
    <footer className="w-full bg-[#080808] border-t border-[#F5F5F0]/10 text-[#F5F5F0]">
      {/* 5-Column OS Matrix Bar */}
      <div className="border-b border-[#F5F5F0]/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 w-full divide-x divide-y sm:divide-y-0 divide-[#F5F5F0]/10">
        <div 
          onClick={() => onSelectTab('observatory')}
          className="flex items-center justify-center p-4 sm:p-6 group cursor-pointer hover:bg-[#1B3022]/20 transition-all"
        >
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F5F5F0]/40 mb-1 group-hover:text-[#C5A059] transition-colors">Trust OS</p>
            <p className="text-xs font-semibold text-[#F5F5F0] tracking-wider">Verification & Audits</p>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('lifehouse')}
          className="flex items-center justify-center p-4 sm:p-6 group cursor-pointer hover:bg-[#1B3022]/20 transition-all"
        >
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F5F5F0]/40 mb-1 group-hover:text-[#C5A059] transition-colors">Health OS</p>
            <p className="text-xs font-semibold text-[#F5F5F0] tracking-wider">Wellbeing & Habitats</p>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('studio')}
          className="flex items-center justify-center p-4 sm:p-6 group cursor-pointer hover:bg-[#1B3022]/20 transition-all"
        >
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F5F5F0]/40 mb-1 group-hover:text-[#C5A059] transition-colors">Knowledge OS</p>
            <p className="text-xs font-semibold text-[#F5F5F0] tracking-wider">Causal Intelligence</p>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('marketplace')}
          className="flex items-center justify-center p-4 sm:p-6 group cursor-pointer hover:bg-[#1B3022]/20 transition-all"
        >
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F5F5F0]/40 mb-1 group-hover:text-[#C5A059] transition-colors">Opportunity OS</p>
            <p className="text-xs font-semibold text-[#F5F5F0] tracking-wider">Non-Extractive Capital</p>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('impact-dashboard')}
          className="flex items-center justify-center p-4 sm:p-6 group cursor-pointer hover:bg-[#1B3022]/20 transition-all col-span-2 sm:col-span-1"
        >
          <div className="text-center">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F5F5F0]/40 mb-1 group-hover:text-[#C5A059] transition-colors">Flourishing OS</p>
            <p className="text-xs font-semibold text-[#F5F5F0] tracking-wider">Planetary Regeneration</p>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        {/* Core Vision Banner */}
        <div className="p-6 sm:p-10 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#1B3022]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-[#C5A059]"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">The North Star</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-[#F5F5F0] font-serif italic">
              We exist to help <span className="not-italic font-sans font-black text-[#F5F5F0]">humanity flourish.</span>
            </h2>
            <p className="text-xs sm:text-base text-[#F5F5F0]/70 leading-relaxed">
              Building ethical systems that create lasting prosperity, opportunity, and ecological regeneration. Technology in service of human dignity, verifiable trust, and multi-generational flourishing.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] font-semibold">
                <span className="text-[#C5A059]">Faith in our why.</span>
                <span className="text-[#F5F5F0]/30">•</span>
                <span className="text-[#8FB8DE]">Intelligence in our systems.</span>
                <span className="text-[#F5F5F0]/30">•</span>
                <span className="text-emerald-400">Love in our impact.</span>
              </div>

              {onOpenCommandments && (
                <button
                  onClick={onOpenCommandments}
                  className="px-3.5 py-1.5 bg-[#141414] hover:bg-[#1E1E1E] border border-[#C5A059]/40 hover:border-[#C5A059] rounded-xs text-[10px] font-mono text-[#C5A059] flex items-center gap-2 transition-all shadow-sm"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>The 10 Commandments of Architecture</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Column Architecture Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#C5A059] flex items-center justify-center bg-[#0A0A0A]">
                <div className="w-2 h-2 bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]"></div>
              </div>
              <span className="font-bold tracking-[0.2em] uppercase text-base text-[#F5F5F0]">ATLAS SANCTUM</span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 leading-relaxed">
              A Regenerative Intelligence Platform and Civilization Operating System for understanding reality, coordinating action, allocating resources, and measuring flourishing.
            </p>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/40 flex items-center gap-2">
              <span>OS 2.5.0 • Cryptographic Provenance</span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Coordination & Evidence</h3>
            <ul className="space-y-2 text-xs text-[#F5F5F0]/70">
              <li>
                <button onClick={() => onSelectTab('reality-engine')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Atlas Reality Engine (Multi-Scale) <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('project-os')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Project Operating System (9-Stage OS) <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('capital-engine')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Atlas Capital Coordination Engine <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('flourishing-index')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  The Flourishing Index (6 Dimensions) <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('opportunity-graph')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Opportunity Graph Network <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('evidence-ledger')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Verifiable Evidence Ledger <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('field-labs')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Atlas Field Labs & Failure Reports <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('observatory')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 text-left">
                  Atlas Observatory & Living Reality <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Intelligence & Ethics */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FB8DE]">AI & Causal Intelligence</h3>
            <ul className="space-y-2 text-xs text-[#F5F5F0]/70">
              <li>
                <button onClick={() => onSelectTab('bioregional-twin')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Causal Bioregional Twin <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('moral-arbiter')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Constitutional Moral Arbiter <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('opportunity-matchmaker')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Opportunity & Capital Matchmaker <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                {onOpenCommandments ? (
                  <button onClick={onOpenCommandments} className="hover:text-[#C5A059] text-[#C5A059] transition-colors flex items-center gap-1.5 font-bold">
                    The 10 Commandments <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
                  </button>
                ) : (
                  <button onClick={onOpenMoralSimulator} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                    Policy Decision Simulator <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                  </button>
                )}
              </li>
              <li>
                <button onClick={() => onSelectTab('impact-dashboard')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  5-Layer Flourishing OS Dashboard <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Governance & AI Safety Policies <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Builders & Commons */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">Commons & Gatherings</h3>
            <ul className="space-y-2 text-xs text-[#F5F5F0]/70">
              <li>
                <button onClick={() => onSelectTab('events')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 font-bold text-[#C5A059]">
                  Events & Field Labs <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('stories')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 font-bold text-[#C5A059]">
                  Stories & Field Reports <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('resources')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 font-bold text-[#C5A059]">
                  Resources, CAD & Toolkits <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('governance')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Civilization Governance Hub <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('developers')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Atlas Developer SDK & APIs <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('academy')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Atlas Academy & Curricula <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('commons')} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  Commons Governance Ledger <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
              <li>
                <button onClick={onOpenCommandCenter} className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  AI Command Center (⌘K) <ArrowUpRight className="w-3 h-3 text-[#F5F5F0]/30" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Loop & Copyright */}
        <div className="pt-8 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F5F0]/40 font-mono">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#F5F5F0]/60">
            <span>See</span> → <span>Understand</span> → <span>Decide</span> → <span>Coordinate</span> → <span>Build</span> → <span>Measure</span> → <span>Regenerate</span>
          </div>
          <div>
            © {new Date().getFullYear()} Atlas Sanctum. Built for civilization flourishing.
          </div>
        </div>
      </div>

      {/* Embedded Real-Time Environment Status & Dev Server Control Bar */}
      <EnvironmentStatusFooter />
    </footer>
  );
};

