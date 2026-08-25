import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  DollarSign, 
  Layers, 
  Filter, 
  Search, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Activity,
  FileCheck2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { MISSION_ANALYTICS_DATA, BIOME_PERFORMANCE_SUMMARIES, FAILURE_CATEGORY_CORRELATION } from '../../data/missionAnalyticsData';
import { FAILURE_LEDGER_ENTRIES } from '../../data/failureLedgerData';
import { MissionDeploymentAnalytics, PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';
import { RealityCheck } from '../RealityCheck';
import { usePerformanceMetrics } from '../../hooks/usePerformanceMetrics';

interface MissionPerformanceAnalyticsViewProps {
  onSelectTab: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const MissionPerformanceAnalyticsView: React.FC<MissionPerformanceAnalyticsViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const { summary: perfSummary, traces } = usePerformanceMetrics('mission-analytics');
  const [selectedBiome, setSelectedBiome] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMission, setSelectedMission] = useState<MissionDeploymentAnalytics>(MISSION_ANALYTICS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'deployments' | 'failure_resilience' | 'biome_matrix'>('deployments');

  const filteredMissions = MISSION_ANALYTICS_DATA.filter(mission => {
    const matchesBiome = selectedBiome === 'all' || mission.biomeType === selectedBiome;
    const matchesStatus = selectedStatus === 'all' || mission.status === selectedStatus;
    const matchesSearch = mission.missionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mission.bioregion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBiome && matchesStatus && matchesSearch;
  });

  // Calculate aggregated stats
  const totalDeployments = MISSION_ANALYTICS_DATA.length;
  const avgSuccessRate = (MISSION_ANALYTICS_DATA.reduce((acc, m) => acc + m.successRate, 0) / totalDeployments).toFixed(1);
  const totalCapital = MISSION_ANALYTICS_DATA.reduce((acc, m) => acc + m.totalCapitalDeployed, 0);
  const totalFailuresDocumented = MISSION_ANALYTICS_DATA.reduce((acc, m) => acc + m.failureLedgerCount, 0);
  const totalResilienceAdaptations = MISSION_ANALYTICS_DATA.reduce((acc, m) => acc + m.resilienceAdaptationsCount, 0);
  const avgRecoveryDays = Math.round(MISSION_ANALYTICS_DATA.reduce((acc, m) => acc + m.recoveryVelocityDays, 0) / totalDeployments);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Completed':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'Pivoted':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Forming':
      default:
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              ATLAS REGENERATIVE INTELLIGENCE • CANON XXIII
            </span>
            <span className="text-[9px] font-mono bg-[#1B3022] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Failure Ledger + Impact Synthesis
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
            Mission Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans leading-relaxed">
            Real-time multi-scale verification synthesizing empirical impact metrics with institutional post-mortems from the Failure Ledger to compute true biophysical resilience and recovery velocity.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectTab('regenerative-mission')}
            className="px-3.5 py-2 rounded-sm border border-[#C5A059]/40 bg-[#121212] hover:bg-[#1B3022] text-[#C5A059] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Missions</span>
          </button>
          <button
            onClick={() => onSelectTab('evidence-mapping')}
            className="px-3.5 py-2 rounded-sm border border-[#F5F5F0]/20 bg-[#151515] hover:bg-[#202020] text-[#F5F5F0] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#8FB8DE]" />
            <span>Evidence DAG</span>
          </button>
          <button
            onClick={() => onSelectTab('failure-ledger')}
            className="px-3.5 py-2 rounded-sm border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Failure Ledger</span>
          </button>
        </div>
      </div>

      {/* Epistemic Reality Check Box */}
      <RealityCheck
        data={{
          status: 'verified',
          confidenceScore: 98,
          uncertaintyMargin: '± 1.8%',
          epistemicTier: 'Multi-Modal Bioregional Telemetry Mesh',
          realityVsModelWarning: 'All success rates are mathematically weighted against physical telemetry sensor streams and independent failure audits. Models that diverge from ground sensor realities are automatically discounted.',
          sensorHealth: 99,
          dataOrigin: 'ESA Sentinel-2 + In-Situ YSI Sondes + 42 Community Baraza Audits',
          cryptographicHash: '0x948ba201948bacfe91028491048102948192049182049182049182049182049',
          lastVerified: '8 minutes ago',
          verifiedBy: 'Atlas Verification Assembly & Independent Civil Engineers'
        }}
      />

      {/* Aggregate KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Overall Success Rate</span>
          <div className="text-2xl font-serif text-emerald-400 font-bold flex items-center gap-1.5">
            <span>{avgSuccessRate}%</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[9px] font-mono text-[#F5F5F0]/40">Biophysical verification</span>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Total Deployed Capital</span>
          <div className="text-2xl font-serif text-[#C5A059] font-bold">
            ${(totalCapital / 1000).toFixed(0)}k
          </div>
          <span className="text-[9px] font-mono text-[#F5F5F0]/40">100% Non-extractive</span>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Failures Codified</span>
          <div className="text-2xl font-serif text-rose-400 font-bold flex items-center gap-1.5">
            <span>{totalFailuresDocumented}</span>
            <BookOpen className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-[9px] font-mono text-rose-300/60">Zero hidden errors</span>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Resilience Adaptations</span>
          <div className="text-2xl font-serif text-[#8FB8DE] font-bold flex items-center gap-1.5">
            <span>{totalResilienceAdaptations}</span>
            <RotateCcw className="w-4 h-4 text-[#8FB8DE]" />
          </div>
          <span className="text-[9px] font-mono text-[#F5F5F0]/40">Causal model pivots</span>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Recovery Velocity</span>
          <div className="text-2xl font-serif text-[#F5F5F0] font-bold">
            {avgRecoveryDays}d
          </div>
          <span className="text-[9px] font-mono text-[#F5F5F0]/40">Mean time to adapt</span>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Telemetry Health</span>
          <div className="text-2xl font-serif text-emerald-400 font-bold flex items-center gap-1.5">
            <span>97.4%</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <span className="text-[9px] font-mono text-[#F5F5F0]/40">In-situ LoRaWAN nodes</span>
        </div>
      </div>

      {/* Live System Performance & Epistemic Latency Monitor */}
      <div className="p-4 rounded-lg bg-[#0D0D0D] border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-blue-400">Live Client Performance Engine</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                SW Cache Hit: {(perfSummary.cacheHitRatio * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans">
              Monitoring render duration, route transition overhead, and agent telemetry latency in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-[#F5F5F0]/50 uppercase block">Avg View Transition</span>
            <span className="text-sm font-bold text-emerald-400">{(perfSummary?.avgViewTransitionMs || 45).toFixed(1)} ms</span>
          </div>
          <div className="text-right border-l border-white/10 pl-4">
            <span className="text-[10px] text-[#F5F5F0]/50 uppercase block">Total Operations</span>
            <span className="text-sm font-bold text-[#C5A059]">{traces?.length || 0} traces</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex border-b border-[#F5F5F0]/10 gap-2 sm:gap-6 overflow-x-auto text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('deployments');
          }}
          className={`pb-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'deployments'
              ? 'text-[#C5A059] border-[#C5A059]'
              : 'text-[#F5F5F0]/50 border-transparent hover:text-[#F5F5F0]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Mission Deployments ({filteredMissions.length})</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('failure_resilience');
          }}
          className={`pb-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'failure_resilience'
              ? 'text-[#C5A059] border-[#C5A059]'
              : 'text-[#F5F5F0]/50 border-transparent hover:text-[#F5F5F0]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span>Failure vs Adaptation Ledger</span>
        </button>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('biome_matrix');
          }}
          className={`pb-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'biome_matrix'
              ? 'text-[#C5A059] border-[#C5A059]'
              : 'text-[#F5F5F0]/50 border-transparent hover:text-[#F5F5F0]'
          }`}
        >
          <Compass className="w-4 h-4 text-[#8FB8DE]" />
          <span>Bioregional Performance Matrix</span>
        </button>
      </div>

      {/* TAB 1: MISSION DEPLOYMENTS & COMPARATIVE DETAIL */}
      {activeTab === 'deployments' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
              <input
                type="text"
                placeholder="Search missions by name or bioregion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151515] border border-[#F5F5F0]/15 rounded pl-9 pr-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBiome}
                onChange={(e) => setSelectedBiome(e.target.value)}
                className="bg-[#151515] border border-[#F5F5F0]/15 rounded px-2.5 py-1.5 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="all">All Biomes</option>
                <option value="urban_riparian">Urban Riparian</option>
                <option value="savanna_silvopasture">Savanna Silvopasture</option>
                <option value="arid_sponge">Arid Sponge</option>
                <option value="tropical_cloud_basin">Tropical Cloud Basin</option>
                <option value="highland_alpine">Highland Alpine</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#151515] border border-[#F5F5F0]/15 rounded px-2.5 py-1.5 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pivoted">Pivoted (Adapted)</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Grid Layout: Deployments Table + Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Mission Table (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 overflow-hidden">
                <div className="p-3 bg-[#121212] border-b border-[#F5F5F0]/10 flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/60 uppercase tracking-wider">
                  <span>Mission Deployment</span>
                  <span>Success & Epistemic Rigor</span>
                </div>

                <div className="divide-y divide-[#F5F5F0]/10">
                  {filteredMissions.map((mission) => {
                    const isSelected = selectedMission.id === mission.id;
                    return (
                      <div
                        key={mission.id}
                        onClick={() => {
                          audioFeedback.playSubtleClick();
                          setSelectedMission(mission);
                        }}
                        className={`p-4 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#1B3022]/40 border-l-4 border-[#C5A059]'
                            : 'hover:bg-[#151515]'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-serif font-bold text-[#F5F5F0] hover:text-[#C5A059] transition-colors truncate">
                              {mission.missionTitle}
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(mission.status)}`}>
                              {mission.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-[#F5F5F0]/50 truncate">
                            {mission.bioregion} • Capital: ${(mission.totalCapitalDeployed / 1000).toFixed(1)}k
                          </p>
                        </div>

                        {/* Right: Metrics & Progress Bar */}
                        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-emerald-400">
                              {mission.successRate}% Success
                            </div>
                            <div className="text-[10px] font-mono text-[#F5F5F0]/40">
                              Certainty: {mission.epistemicConfidenceScore}%
                            </div>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="w-20 bg-black/40 h-2 rounded-full overflow-hidden border border-white/10 hidden sm:block">
                            <div
                              className="bg-emerald-400 h-full rounded-full transition-all"
                              style={{ width: `${mission.successRate}%` }}
                            />
                          </div>

                          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#C5A059] translate-x-1' : 'text-[#F5F5F0]/20'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Selected Mission Detailed Deep Dive (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-lg bg-[#0D0D0D] border border-[#C5A059]/40 space-y-5">
                
                {/* Header */}
                <div className="space-y-1.5 pb-4 border-b border-[#F5F5F0]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider font-bold">
                      Deployment Telemetry Deep Dive
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(selectedMission.status)}`}>
                      {selectedMission.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif text-[#F5F5F0] font-bold">
                    {selectedMission.missionTitle}
                  </h2>
                  <p className="text-xs font-mono text-[#F5F5F0]/60">
                    {selectedMission.bioregion} • Audited: {selectedMission.lastAuditDate}
                  </p>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40">Target Achieved</span>
                    <div className="text-xl font-serif font-bold text-emerald-400">
                      {selectedMission.biophysicalTargetAchievedPct}%
                    </div>
                    <span className="text-[9px] font-mono text-[#F5F5F0]/40">Of biophysical goal</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40">Epistemic Rigor</span>
                    <div className="text-xl font-serif font-bold text-[#8FB8DE]">
                      {selectedMission.epistemicConfidenceScore}/100
                    </div>
                    <span className="text-[9px] font-mono text-[#F5F5F0]/40">Zero unverified models</span>
                  </div>
                </div>

                {/* Live Biophysical Impact Deltas */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/60 font-bold block">
                    Verified Biophysical Impact Deltas
                  </span>
                  <div className="space-y-2">
                    {selectedMission.impactDeltas.map((kpi, idx) => {
                      const isPct = kpi.unit.includes('%');
                      return (
                        <div key={idx} className="p-2.5 rounded bg-[#121212] border border-[#F5F5F0]/10 text-xs font-mono space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#F5F5F0]/90 font-medium">{kpi.kpi}</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              {kpi.current} {kpi.unit}
                              <TrendingUp className="w-3 h-3" />
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/40">
                            <span>Baseline: {kpi.baseline} {kpi.unit}</span>
                            <span>Target: {kpi.target} {kpi.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Failure & Lesson Learned Card */}
                {selectedMission.primaryFailureMode && (
                  <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-300 font-mono text-[10px] uppercase font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Codified Failure & Lesson Learned</span>
                    </div>
                    <p className="text-xs text-rose-200/90 font-sans leading-relaxed">
                      <span className="font-semibold text-white">Failure Mode:</span> {selectedMission.primaryFailureMode}
                    </p>
                    {selectedMission.codifiedLessonSnippet && (
                      <p className="text-xs text-emerald-300 font-sans leading-relaxed pt-1.5 border-t border-rose-500/20">
                        <span className="font-semibold text-emerald-200">Adaptation:</span> {selectedMission.codifiedLessonSnippet}
                      </p>
                    )}
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onSelectTab('evidence-mapping')}
                    className="flex-1 py-2.5 px-3 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Trace Evidence DAG</span>
                  </button>
                  <button
                    onClick={() => onSelectTab('regenerative-mission')}
                    className="flex-1 py-2.5 px-3 bg-[#151515] hover:bg-[#202020] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Mission Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: FAILURE VS ADAPTATION LEDGER SYNTHESIS */}
      {activeTab === 'failure_resilience' && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-2">
            <h3 className="text-sm font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              Commandment XXIII: The Failure Ledger as Primary Learning Engine
            </h3>
            <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
              Unlike legacy institutions that bury blunders, the Atlas Sanctum treats documented failures as our highest-value epistemic assets. When a biophysical mismatch or economic distortion occurs, it is codified cryptographically into the Canon so that no subsequent mission ever repeats it.
            </p>
          </div>

          {/* Failure Category Correlation Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAILURE_CATEGORY_CORRELATION.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#C5A059]">{cat.category}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black rounded border border-white/10 text-[#F5F5F0]/60">
                    {cat.count} Incidents
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F5F5F0]/50">Resolution Rate</span>
                    <span className="text-emerald-400 font-bold">{cat.resolvedRate}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${cat.resolvedRate}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#121212] border border-white/5 space-y-1 text-[11px] font-mono text-[#F5F5F0]/60">
                  <div className="flex items-center justify-between">
                    <span>Avg Recovery:</span>
                    <span className="text-[#F5F5F0] font-bold">{cat.avgRecoveryDays} days</span>
                  </div>
                  <div>
                    <span className="text-[#F5F5F0]/40">Root Cause:</span> {cat.primaryCause}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real Failure Ledger Entries Drilldown */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">
              Recent Codified Failure Entries from Active Missions
            </h3>
            <div className="space-y-3">
              {FAILURE_LEDGER_ENTRIES.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-4 rounded-lg bg-[#0D0D0D] border border-rose-500/20 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400">{entry.id}</span>
                      <span className="text-xs font-serif font-bold text-white">{entry.projectName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#F5F5F0]/40">{entry.bioregion}</span>
                  </div>
                  <p className="text-xs text-[#F5F5F0]/80 font-sans">
                    <span className="font-semibold text-rose-300">Hypothesis that failed:</span> {entry.coreHypothesis}
                  </p>
                  <p className="text-xs text-emerald-300 font-sans pt-1 border-t border-[#F5F5F0]/10">
                    <span className="font-semibold text-emerald-200">Institutional Lesson:</span> {entry.epistemicLessonsLearned}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIOREGIONAL PERFORMANCE MATRIX */}
      {activeTab === 'biome_matrix' && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-2">
            <h3 className="text-sm font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#8FB8DE]" />
              Bioregional Resilience & Efficiency Benchmarks
            </h3>
            <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
              Standardized biophysical impact yield per unit of non-extractive capital across major Earth biome archetypes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIOME_PERFORMANCE_SUMMARIES.map((biome, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                      {biome.totalDeployments} Active Deployments
                    </span>
                    <h4 className="text-base font-serif font-bold text-white mt-0.5">
                      {biome.label}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-emerald-400">{biome.avgSuccessRate}%</span>
                    <span className="text-[9px] font-mono text-[#F5F5F0]/40 block">Success</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F0]/50">Restored Yield:</span>
                    <span className="text-[#F5F5F0] font-bold">{biome.totalHectaresOrKmRestored}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F0]/50">Capital Efficiency:</span>
                    <span className="text-[#C5A059] font-bold">{biome.capitalEfficiency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F0]/50">Adaptation Rate:</span>
                    <span className="text-emerald-400 font-bold">{biome.resilienceAdaptationRate}%</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#F5F5F0]/50 flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10">
                  <span>Primary Risk:</span>
                  <span className="text-rose-300 font-medium capitalize">{biome.topFailureCategory.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
