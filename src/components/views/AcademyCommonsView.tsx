import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Vote,
  Compass
} from 'lucide-react';
import { RESEARCH_PAPERS, SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';

interface AcademyCommonsViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
}

export const AcademyCommonsView: React.FC<AcademyCommonsViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator
}) => {
  const [activeTab, setActiveTab] = useState<'academy' | 'research' | 'commons'>('academy');

  const courses = [
    {
      code: "REG-101",
      title: "Foundations of Regenerative Civilization Systems",
      duration: "6 Weeks",
      level: "Core Civilization Architecture",
      enrolled: 4200,
      description: "Principles of multi-scale ecology, epistemic telemetry, the 7 forms of capital, and moral constraints in technological design."
    },
    {
      code: "SYS-204",
      title: "Dynamic Causal Modeling & Leverage Point Discovery",
      duration: "8 Weeks",
      level: "Advanced Studio Laboratory",
      enrolled: 2850,
      description: "Hands-on simulation of multi-decade policy interventions, feedback loops, and unintended consequences in complex bioregions."
    },
    {
      code: "ETH-305",
      title: "Moral Intelligence & Non-Extractive Economics",
      duration: "5 Weeks",
      level: "Governance & Ethics",
      enrolled: 3100,
      description: "Operationalizing universal moral axioms, anti-usury capital contracts, and community sovereign equity structures."
    }
  ];

  const proposals = [
    {
      id: "AGP-042",
      title: "Allocate $4.5M RVE Reserve to Kilifi Desalination Expansion",
      status: "Active Voting",
      quorum: "84.2% Reached",
      support: "94.8% Yes",
      endsIn: "48 Hours",
      category: "Infrastructure Deployment"
    },
    {
      id: "AGP-041",
      title: "Incorporate LoRaWAN Soil Microbial Nitrogen Standard into SDK v2.6",
      status: "Passed & Executed",
      quorum: "92.0% Reached",
      support: "98.5% Yes",
      endsIn: "Executed",
      category: "Data Schema Upgrade"
    }
  ];

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              KNOWLEDGE COMMONS & DEMOCRATIC CO-STEWARDSHIP
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Academy & Commons</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Open systems education, peer-reviewed regenerative science, and transparent community governance.
          </p>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center gap-1 bg-[#0D0D0D] p-1 border border-[#F5F5F0]/10 rounded-sm text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-3.5 py-1.5 rounded-sm transition-all ${
              activeTab === 'academy' ? 'bg-[#F5F5F0] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            Academy Curricula
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-3.5 py-1.5 rounded-sm transition-all ${
              activeTab === 'research' ? 'bg-[#F5F5F0] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            Research Papers ({RESEARCH_PAPERS.length})
          </button>
          <button
            onClick={() => setActiveTab('commons')}
            className={`px-3.5 py-1.5 rounded-sm transition-all ${
              activeTab === 'commons' ? 'bg-[#F5F5F0] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            Commons Governance
          </button>
        </div>
      </div>

      {/* TAB 1: ACADEMY */}
      {activeTab === 'academy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.code} className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4 flex flex-col justify-between hover:border-[#C5A059]/40 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#8FB8DE]/15 text-[#8FB8DE] rounded-sm border border-[#8FB8DE]/20 font-bold">
                      {course.code} • {course.duration}
                    </span>
                    <span className="text-xs font-mono text-[#C5A059]">{course.enrolled.toLocaleString()} Learners</span>
                  </div>
                  <h3 className="text-base font-serif text-[#F5F5F0] font-bold">{course.title}</h3>
                  <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">{course.description}</p>
                </div>

                <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#F5F5F0]/40">{course.level}</span>
                  <button className="text-xs font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1 uppercase tracking-wider">
                    Enroll Free <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RESEARCH PAPERS */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          {RESEARCH_PAPERS.map((paper) => (
            <div key={paper.id} className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3 hover:border-[#C5A059]/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#1B3022] text-emerald-400 rounded-sm border border-emerald-500/30 font-bold">
                    {paper.category}
                  </span>
                  <span className="text-xs font-mono text-[#F5F5F0]/50">{paper.publishedDate}</span>
                </div>
                <span className="text-xs font-mono text-[#8FB8DE]">{paper.doi}</span>
              </div>

              <h3 className="text-lg font-serif text-[#F5F5F0]">{paper.title}</h3>
              <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">{paper.abstract}</p>

              <div className="pt-3 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-[#F5F5F0]/50 font-mono">
                  Authors: <span className="text-[#F5F5F0]">{paper.authors.join(', ')}</span>
                </div>
                <button
                  onClick={() => onInspectProvenance(SAMPLE_PROVENANCE)}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono uppercase tracking-wider font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> Download Open-Access PDF + Data Artifact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COMMONS GOVERNANCE */}
      {activeTab === 'commons' && (
        <div className="space-y-6">
          <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-serif text-[#F5F5F0]">Atlas Commons Governance Ledger</h2>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Decisions regarding reserve capital allocation, SDK protocols, and biological asset verification standards are voted on by verified bioregional community stewards and researchers.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {proposals.map((prop) => (
                <div key={prop.id} className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">{prop.id} • {prop.category}</span>
                    <span className="text-xs font-mono text-[#C5A059] px-2 py-0.5 bg-[#C5A059]/10 rounded-sm border border-[#C5A059]/30">
                      {prop.status} ({prop.endsIn})
                    </span>
                  </div>
                  <h3 className="text-sm font-serif text-[#F5F5F0]">{prop.title}</h3>
                  <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/50 pt-1">
                    <span>Quorum: {prop.quorum}</span>
                    <span className="text-emerald-400">Consensus: {prop.support}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
