import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  FileText, 
  Sparkles, 
  Info, 
  Calendar, 
  Lock, 
  GitBranch, 
  BookOpen, 
  Globe2, 
  AlertTriangle, 
  Radio, 
  LineChart as LineChartIcon,
  MessageSquareShare,
  Users,
  Scale,
  RefreshCw,
  Download
} from 'lucide-react';
import { INTELLIGENCE_LAYERS, CIVILIZATION_METRICS, SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';
import { CivilizationMetric } from '../../types';
import { CausalImpactD3Graph } from '../CausalImpactD3Graph';
import { HumanFlourishingTimelineChart } from '../analytics/HumanFlourishingTimelineChart';
import { ProjectFlourishingD3Network } from '../analytics/ProjectFlourishingD3Network';
import { RegenerativeProgressD3Chart } from '../analytics/RegenerativeProgressD3Chart';
import { FlourishingVsStabilityD3Chart } from '../analytics/FlourishingVsStabilityD3Chart';
import { KnowledgeGraphStudio } from '../intelligence/KnowledgeGraphStudio';
import { BioregionalHazardMonitor } from '../bioregional/BioregionalHazardMonitor';
import { BioregionalImpactD3Map } from '../bioregional/BioregionalImpactD3Map';
import { CommunityImpactFeed } from '../bioregional/CommunityImpactFeed';
import { CollaborativeStewardshipTeams } from '../profile/CollaborativeStewardshipTeams';
import { ImpactStoryGenerator } from '../profile/ImpactStoryGenerator';
import { generateImpactArchivalPDF } from '../../lib/generateImpactArchivalPDF';
import { audioFeedback } from '../../lib/audioFeedback';

interface ImpactDashboardViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
}

export const ImpactDashboardView: React.FC<ImpactDashboardViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('flourishing-os');
  const [selectedMetric, setSelectedMetric] = useState<CivilizationMetric>(CIVILIZATION_METRICS[0]);
  const [activeTab, setActiveTab] = useState<'community-feed' | 'flourishing-vs-stability' | 'regenerative-progress' | 'flourishing-timeline' | 'restoration-mesh' | 'knowledge-studio' | 'causal-graph' | 'telemetry-grid' | 'bioregional-map' | 'hazard-monitor' | 'collaborative-teams' | 'impact-story'>('flourishing-vs-stability');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGenerationSuccess, setPdfGenerationSuccess] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      audioFeedback.playSubtleClick();
      await generateImpactArchivalPDF({
        includeBadges: true,
        includeTwelveMonthTrajectory: true
      });
      setPdfGenerationSuccess(true);
      audioFeedback.playSuccessChime();
      setTimeout(() => setPdfGenerationSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to generate archival PDF summary:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const activeLayer = INTELLIGENCE_LAYERS.find(l => l.id === selectedLayerId) || INTELLIGENCE_LAYERS[0];
  const layerMetrics = CIVILIZATION_METRICS;

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              CIVILIZATIONAL FLOURISHING OS • 5-LAYER INTELLIGENCE MATRIX
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Commandment IX: Evidence Constitution
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Impact & Epistemic Telemetry</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Every metric is auditable down to its sensor origin, mathematical model, and cryptographic verification hash. We never confuse model with reality.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Generate Verified Archival PDF Summary Button */}
          <button
            id="generate-archival-pdf-summary-btn"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#C5A059] text-[#C5A059] hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
            title="Compile current longitudinal metrics & stewardship badges into a verified PDF report"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
                <span>Compiling Archival PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Generate PDF Summary</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onInspectProvenance(SAMPLE_PROVENANCE);
              audioFeedback.playCovenantResonance();
            }}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider shadow"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            How Do We Know? (Audit Trail)
          </button>
        </div>
      </div>

      {/* PDF Archival Generation Confirmation Banner */}
      {pdfGenerationSuccess && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-emerald-300 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Verified Archival Report Generated:</strong> Longitudinal flourishing metrics, 12-month trajectory, and ratified stewardship badges compiled with QR consensus proof. Download initiated.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/80 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold tracking-wider shrink-0">
            PDF/A ARCHIVED
          </span>
        </div>
      )}

      {/* View Switcher: Recharts Flourishing Timeline vs Restoration Mesh D3 vs Knowledge Graph Studio vs Interactive Causal D3 Graph vs Telemetry Matrix */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Flourishing vs Stability D3 Multi-Line Trend Chart Tab */}
          <button
            id="tab-flourishing-vs-stability-btn"
            onClick={() => {
              setActiveTab('flourishing-vs-stability');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'flourishing-vs-stability'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#C5A059] hover:text-white border border-[#C5A059]/40'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Flourishing vs Stability (12-Mo D3)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-current font-bold uppercase">
              Decoupling
            </span>
          </button>

          <button
            id="tab-community-feed-btn"
            onClick={() => {
              setActiveTab('community-feed');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'community-feed'
                ? 'bg-gradient-to-r from-emerald-500 to-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-emerald-300 hover:text-emerald-200 border border-emerald-500/30'
            }`}
          >
            <MessageSquareShare className="w-3.5 h-3.5" />
            <span>Community Impact (Feed)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
              VERIFIED
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('regenerative-progress');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'regenerative-progress'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Regenerative Progress (D3)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('restoration-mesh');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'restoration-mesh'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Restoration Mesh (Project ➔ Index)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('knowledge-studio');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'knowledge-studio'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Graph Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flourishing-timeline');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'flourishing-timeline'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Human Flourishing (Timeline)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('causal-graph');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'causal-graph'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>5-Level Causal D3</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bioregional-map');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bioregional-map'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Bioregional Impact Map (D3)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('hazard-monitor');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hazard-monitor'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Hazard Monitor (Satellite)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('telemetry-grid');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'telemetry-grid'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Epistemic Matrix Grid</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('collaborative-teams');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'collaborative-teams'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Collaborative Teams</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('impact-story');
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'impact-story'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'bg-[#141414] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Impact Story Generator</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/50">
          <span>Epistemic Hierarchy:</span>
          <span className="text-[#C5A059] font-bold">REALITY ➔ DATA ➔ MODEL ➔ DECISION</span>
        </div>
      </div>

      {/* Primary Tab: D3 Multi-Line 12-Month Trend Comparison: Ecological Flourishing vs Economic Stability */}
      {activeTab === 'flourishing-vs-stability' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <FlourishingVsStabilityD3Chart 
            onInspectPoint={(pt) => {
              onInspectProvenance({
                ...SAMPLE_PROVENANCE,
                metricName: `12-Month Trajectory: ${pt.monthLabel}`,
                verificationHash: pt.cryptographicHash,
                rawSensorReading: `Ecological: ${pt.ecologicalFlourishing}% • Economic: ${pt.economicStability}% (Decoupling: +${pt.decouplingMargin}%)`,
                confidenceInterval: `±0.8% across ${pt.verifiedSensorCount} cryptographic sensor nodes`,
                epistemicTier: 'Zero-Knowledge Multi-Spectral Mesh'
              });
            }}
            onInspectProvenance={onInspectProvenance}
            onOpenMoralSimulator={onOpenMoralSimulator}
          />
        </div>
      )}

      {/* Primary Tab: Community Impact Social Feed */}
      {activeTab === 'community-feed' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CommunityImpactFeed />
        </div>
      )}

      {/* Primary Tab: D3 Longitudinal Regenerative Progress Chart */}
      {activeTab === 'regenerative-progress' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <RegenerativeProgressD3Chart onInspectPoint={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Global Restoration Network Graph */}
      {activeTab === 'restoration-mesh' && (
        <div className="space-y-6">
          <ProjectFlourishingD3Network onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Knowledge Graph Studio */}
      {activeTab === 'knowledge-studio' && (
        <div className="space-y-6">
          <KnowledgeGraphStudio onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab 1: Recharts Human Flourishing Timeline */}
      {activeTab === 'flourishing-timeline' && (
        <div className="space-y-6">
          <HumanFlourishingTimelineChart onInspectProvenance={onInspectProvenance} />
        </div>
      )}

      {/* Primary Tab: D3 Bioregional Geographic Impact Map */}
      {activeTab === 'bioregional-map' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BioregionalImpactD3Map />
        </div>
      )}

      {/* Primary Tab: Real-Time Bioregional Hazard Monitor */}
      {activeTab === 'hazard-monitor' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BioregionalHazardMonitor />
        </div>
      )}

      {/* Primary Tab 2: D3 Causal Impact Graph */}
      {activeTab === 'causal-graph' && (
        <div className="space-y-6">
          <CausalImpactD3Graph />
        </div>
      )}

      {/* Primary Tab 3: The 5 Layer Architecture & Telemetry Grid */}
      {activeTab === 'telemetry-grid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]/10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              Civilizational Telemetry Nodes (By Intelligence Layer)
            </span>
            <span className="text-xs font-mono text-[#F5F5F0]/50">
              Click layer to filter telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {INTELLIGENCE_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setSelectedLayerId(layer.id);
                    if (CIVILIZATION_METRICS.length > 0) setSelectedMetric(CIVILIZATION_METRICS[0]);
                    audioFeedback.playMicroTick();
                  }}
                  className={`p-4 rounded-sm border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#0D0D0D] border-[#C5A059] text-[#F5F5F0] shadow-md ring-1 ring-[#C5A059]/40'
                      : 'bg-[#080808] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase text-[#8FB8DE] font-bold">{layer.code}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{layer.activeNodes.toLocaleString()} Nodes</span>
                  </div>
                  <div className="text-xs font-serif font-bold text-[#F5F5F0]">{layer.name}</div>
                  <p className="text-[11px] text-[#F5F5F0]/50 line-clamp-2 font-sans">{layer.descriptor}</p>
                </button>
              );
            })}
          </div>

          {/* Main Metrics Dashboard + Provenance Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics Grid for Selected Layer (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">{activeLayer.name}</span>
                  <h2 className="text-lg font-serif text-[#F5F5F0]">Telemetry Readings & Verified Targets</h2>
                </div>
                <span className="text-xs font-mono text-[#F5F5F0]/40">Updated continuously via edge mesh</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {layerMetrics.map((metric) => {
                  const isSelected = selectedMetric.id === metric.id;
                  const numericVal = typeof metric.value === 'number' ? metric.value : parseFloat(String(metric.value).replace(/[^0-9.]/g, '')) || 85;
                  const progressPct = Math.min(100, Math.round(numericVal));

                  return (
                    <div
                      key={metric.id}
                      onClick={() => {
                        setSelectedMetric(metric);
                        audioFeedback.playMicroTick();
                      }}
                      className={`p-5 rounded-sm border cursor-pointer transition-all space-y-3 ${
                        isSelected
                          ? 'bg-[#0D0D0D] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40'
                          : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm font-bold ${
                          metric.status === 'verified' ? 'bg-[#1B3022] text-emerald-400 border border-emerald-500/30' :
                          metric.status === 'observed' ? 'bg-[#8FB8DE]/15 text-[#8FB8DE] border border-[#8FB8DE]/30' :
                          'bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30'
                        }`}>
                          {metric.status}
                        </span>
                        <span className="text-xs font-mono text-[#F5F5F0]/50">Trend: +{metric.trend}%</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-serif text-[#F5F5F0]">{metric.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-mono text-emerald-400">{metric.value}</span>
                          <span className="text-xs font-mono text-[#F5F5F0]/50">{metric.unit}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full h-1 bg-[#0A0A0A] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${progressPct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[#F5F5F0]/40">
                          <span>Category: {metric.category}</span>
                          <span className="text-emerald-400">{metric.provenance.certaintyScore}% Confirmed</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Metric Provenance Inspector (1 Col) */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Epistemic Data Audit Trail
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-[#1B3022] text-emerald-400 rounded-sm border border-emerald-500/30 font-bold">
                    100% Audited
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/40">Auditing Metric</div>
                  <h3 className="text-sm font-serif text-[#F5F5F0]">{selectedMetric.name}</h3>
                  <p className="text-xs text-[#F5F5F0]/60 mt-1 font-sans">{selectedMetric.description}</p>
                </div>

                <div className="space-y-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Sensor Ingestion Source</div>
                    <div className="text-xs text-[#F5F5F0]">{selectedMetric.provenance.source}</div>
                  </div>

                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Independent Verifier</div>
                    <div className="text-xs text-emerald-400 font-bold">{selectedMetric.provenance.verifier}</div>
                    <div className="text-[10px] text-[#F5F5F0]/50">{selectedMetric.provenance.verifierRole}</div>
                  </div>

                  <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Mathematical Calculation Method</div>
                    <div className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed">{selectedMetric.provenance.calculationMethod}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#F5F5F0]/10">
                <button
                  onClick={() => {
                    onInspectProvenance(selectedMetric.provenance);
                    audioFeedback.playCovenantResonance();
                  }}
                  className="w-full py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Inspect Complete Cryptographic Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Tab: Collaborative Stewardship Teams & Shared Badges */}
      {activeTab === 'collaborative-teams' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CollaborativeStewardshipTeams />
        </div>
      )}

      {/* Primary Tab: Automated Impact Story Generator */}
      {activeTab === 'impact-story' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <ImpactStoryGenerator 
            stewardName="Amani Kiprono"
            reputationPoints={18450}
            verifiedAuditsSigned={34}
            earnedBadgeCount={8}
            hectaresRestored={420}
            litersProtectedMillions={18.4}
            carbonSequesteredTons={620}
            streakDays={14}
          />
        </div>
      )}
    </div>
  );
};
