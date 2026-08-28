import React, { useState, useMemo } from 'react';
import {
  Bell,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  Droplets,
  Sprout,
  Bird,
  TreePine,
  ShieldCheck,
  Filter,
  Search,
  Check,
  Copy,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Radio,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useMissionAlerts } from '../../context/MissionAlertContext';
import { MissionAlert, AlertSeverity } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export type BioregionalAlertCategory = 
  | 'Soil Health'
  | 'Water Quality'
  | 'Biodiversity Spike'
  | 'Canopy Health'
  | 'Civilizational Governance';

interface BioregionalAlertFeedProps {
  currentBioregionId?: string;
  currentBioregionName?: string;
  onNavigateToEvidence?: (targetId?: string) => void;
}

/**
 * Categorize a MissionAlert into one of the bioregional categories
 */
export function getBioregionalCategory(alert: MissionAlert): BioregionalAlertCategory {
  const text = `${alert.title} ${alert.message} ${alert.missionTitle || ''} ${alert.metadata?.anomalyMetric || ''}`.toLowerCase();

  if (text.includes('soil') || text.includes('mycelium') || text.includes('carbon') || text.includes('zaï') || text.includes('som') || text.includes('edaphic') || text.includes('glomalin') || text.includes('desiccation')) {
    return 'Soil Health';
  }
  if (text.includes('water') || text.includes('turbidity') || text.includes('river') || text.includes('riparian') || text.includes('aquifer') || text.includes('dissolved o2') || text.includes('oxygen') || text.includes('piezometer') || text.includes('runoff') || text.includes('swale') || text.includes('silt') || text.includes('head')) {
    return 'Water Quality';
  }
  if (text.includes('species') || text.includes('biodiversity') || text.includes('wildlife') || text.includes('bongo') || text.includes('starling') || text.includes('avian') || text.includes('bee') || text.includes('pollinator') || text.includes('trophic') || text.includes('fauna') || text.includes('flora') || text.includes('acoustic') || text.includes('sightings')) {
    return 'Biodiversity Spike';
  }
  if (text.includes('canopy') || text.includes('biomass') || text.includes('tree') || text.includes('forest') || text.includes('podocarpus') || text.includes('bamboo') || text.includes('reforestation') || text.includes('crown') || text.includes('ndvi')) {
    return 'Canopy Health';
  }
  return 'Civilizational Governance';
}

export const BioregionalAlertFeed: React.FC<BioregionalAlertFeedProps> = ({
  currentBioregionId = 'aberdare_riparian_watershed',
  currentBioregionName = 'Aberdare Range & Mara-Rift Watershed',
  onNavigateToEvidence
}) => {
  const { alerts, unreadCount, markAsRead, markAllAsRead, addAlert } = useMissionAlerts();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [isSimulatingAlert, setIsSimulatingAlert] = useState<boolean>(false);

  // Categorize alerts and add category field
  const categorizedAlerts = useMemo(() => {
    return alerts.map(alert => ({
      ...alert,
      bioregionalCategory: getBioregionalCategory(alert)
    }));
  }, [alerts]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: categorizedAlerts.length,
      'Soil Health': 0,
      'Water Quality': 0,
      'Biodiversity Spike': 0,
      'Canopy Health': 0,
      'Civilizational Governance': 0
    };
    categorizedAlerts.forEach(a => {
      if (counts[a.bioregionalCategory] !== undefined) {
        counts[a.bioregionalCategory]++;
      }
    });
    return counts;
  }, [categorizedAlerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return categorizedAlerts.filter(alert => {
      // Category filter
      if (selectedCategory !== 'All' && alert.bioregionalCategory !== selectedCategory) {
        return false;
      }
      // Severity filter
      if (selectedSeverity !== 'All' && alert.severity !== selectedSeverity.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = alert.title.toLowerCase().includes(q);
        const matchesMsg = alert.message.toLowerCase().includes(q);
        const matchesMission = alert.missionTitle.toLowerCase().includes(q);
        const matchesCategory = alert.bioregionalCategory.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesMission && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [categorizedAlerts, selectedCategory, selectedSeverity, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedAlertId(prev => (prev === id ? null : id));
    audioFeedback.playMicroTick();
  };

  const handleCopyHash = (alertId: string, hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHashId(alertId);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  // Live simulation triggers
  const triggerSimulation = (category: BioregionalAlertCategory) => {
    setIsSimulatingAlert(true);
    audioFeedback.playCovenantResonance();

    let newAlertData: Omit<MissionAlert, 'id' | 'timestamp' | 'read'>;
    const timeNow = 'Just now';

    if (category === 'Soil Health') {
      newAlertData = {
        missionId: currentBioregionId,
        missionTitle: currentBioregionName,
        type: 'milestone_verified',
        severity: 'success',
        title: 'Soil Health Surge: Mycorrhizal Hyphae Network Expansion',
        message: 'In-situ soil core assay #SOM-82 recorded +0.64% SOM increase and active glomalin binding across keyline water retention swales.',
        cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        targetView: 'bioregional-twin',
        metadata: {
          verifiedBy: 'Agroforestry Soil Testing Mesh & In-Situ Piezometer',
          certaintyScore: 96.5,
          epistemicTier: 'Empirical Core Laboratory Assay',
          anomalyMetric: 'Soil Organic Matter',
          reading: '5.14% SOM',
          threshold: '3.50% Minimum Target'
        }
      };
    } else if (category === 'Water Quality') {
      newAlertData = {
        missionId: currentBioregionId,
        missionTitle: currentBioregionName,
        type: 'telemetry_anomaly',
        severity: 'warning',
        title: 'Water Quality Telemetry: Storm Runoff Silt Infiltration Gauge',
        message: 'Dissolved oxygen reached optimal 7.2 mg/L as bio-swales buffered urban runoff. Upstream turbidity normalized within safe limits.',
        cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        targetView: 'bioregional-twin',
        metadata: {
          verifiedBy: 'Nairobi-Mathare Water Resource Users Association',
          certaintyScore: 94.2,
          epistemicTier: 'Continuous Galvanic Sensor Telemetry',
          anomalyMetric: 'Dissolved Oxygen & Turbidity',
          reading: '7.2 mg/L DO • 12.4 NTU',
          threshold: '5.0 mg/L DO Threshold'
        }
      };
    } else if (category === 'Biodiversity Spike') {
      newAlertData = {
        missionId: currentBioregionId,
        missionTitle: currentBioregionName,
        type: 'milestone_verified',
        severity: 'success',
        title: 'Biodiversity Spike: Mountain Bongo Family & Avian Guild Sightings',
        message: 'Bio-acoustic sensors #AS-04 registered 34 distinct Abbott\'s Starling mating calls and camera trap confirmed breeding pair of endemic bongo.',
        cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        targetView: 'bioregional-twin',
        metadata: {
          verifiedBy: 'Kenya Wildlife Bio-Acoustic Mesh Post',
          certaintyScore: 98.8,
          epistemicTier: 'Acoustic AI Waveform & Camera Trap',
          anomalyMetric: 'Acoustic Complexity Index (ACI)',
          reading: '0.89 ACI',
          threshold: '0.70 Baseline'
        }
      };
    } else {
      newAlertData = {
        missionId: currentBioregionId,
        missionTitle: currentBioregionName,
        type: 'milestone_verified',
        severity: 'info',
        title: 'Canopy Health Milestone: Native Podocarpus Crown Closure',
        message: 'High-altitude multispectral drone survey verified continuous 78% canopy cover across ridge corridor Sector 14.',
        cryptographicHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        targetView: 'bioregional-twin',
        metadata: {
          verifiedBy: 'Aberdare Highland Forest Rangers',
          certaintyScore: 95.0,
          epistemicTier: 'Multispectral Sentinel-2 & Lidar Drone',
          anomalyMetric: 'NDVI Index',
          reading: '+0.78 NDVI',
          threshold: '+0.60 Baseline'
        }
      };
    }

    addAlert(newAlertData);

    setTimeout(() => {
      setIsSimulatingAlert(false);
    }, 400);
  };

  const getCategoryIcon = (category: BioregionalAlertCategory) => {
    switch (category) {
      case 'Soil Health':
        return <Sprout className="w-3.5 h-3.5 text-amber-400" />;
      case 'Water Quality':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Biodiversity Spike':
        return <Bird className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Canopy Health':
        return <TreePine className="w-3.5 h-3.5 text-lime-400" />;
      case 'Civilizational Governance':
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />;
    }
  };

  const getCategoryBadgeClass = (category: BioregionalAlertCategory) => {
    switch (category) {
      case 'Soil Health':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
      case 'Water Quality':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';
      case 'Biodiversity Spike':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
      case 'Canopy Health':
        return 'bg-lime-950/60 text-lime-300 border-lime-500/30';
      case 'Civilizational Governance':
      default:
        return 'bg-[#2A2315] text-[#C5A059] border-[#C5A059]/30';
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            Warning
          </span>
        );
      case 'success':
        return (
          <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified Spike
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1">
            <Info className="w-2.5 h-2.5" />
            Telemetry
          </span>
        );
    }
  };

  return (
    <div id="bioregional-alert-feed" className="bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm overflow-hidden space-y-4 shadow-xl text-[#F5F5F0]">
      {/* Header Bar */}
      <div className="p-5 border-b border-[#F5F5F0]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              MISSION ALERT PROVIDER • BIOREGIONAL ALERT FEED
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-900/80 border border-rose-500/40 text-rose-200 text-[10px] font-mono font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Real-Time Ecological Alert Feed
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-xl font-sans">
            Live telemetry notifications categorized across Soil Health, Water Quality, Biodiversity Spikes, and Canopy Health. Sourced from in-situ sensor meshes and verified field audits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Simulation Trigger Buttons */}
          <div className="flex items-center gap-1.5 bg-[#171717] p-1 rounded-sm border border-[#F5F5F0]/10">
            <span className="text-[9px] font-mono uppercase text-[#F5F5F0]/50 px-1.5">Simulate:</span>
            <button
              onClick={() => triggerSimulation('Soil Health')}
              disabled={isSimulatingAlert}
              className="px-2 py-1 bg-[#231A0F] hover:bg-[#342413] border border-amber-500/40 text-amber-300 text-[10px] font-mono rounded-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Simulate Soil Health Alert"
            >
              <Sprout className="w-3 h-3 text-amber-400" />
              <span>Soil</span>
            </button>
            <button
              onClick={() => triggerSimulation('Water Quality')}
              disabled={isSimulatingAlert}
              className="px-2 py-1 bg-[#0F2228] hover:bg-[#15323C] border border-cyan-500/40 text-cyan-300 text-[10px] font-mono rounded-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Simulate Water Quality Alert"
            >
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>Water</span>
            </button>
            <button
              onClick={() => triggerSimulation('Biodiversity Spike')}
              disabled={isSimulatingAlert}
              className="px-2 py-1 bg-[#10241A] hover:bg-[#183626] border border-emerald-500/40 text-emerald-300 text-[10px] font-mono rounded-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Simulate Biodiversity Spike Alert"
            >
              <Bird className="w-3 h-3 text-emerald-400" />
              <span>Bio Spike</span>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllAsRead();
                audioFeedback.playMicroTick();
              }}
              className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 text-xs font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] rounded-sm transition-all cursor-pointer"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Ribbon: Categories + Severity + Search */}
      <div className="px-5 space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
          <span className="text-[10px] uppercase text-[#F5F5F0]/40 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3 text-[#C5A059]" />
            Category:
          </span>
          {(['All', 'Soil Health', 'Water Quality', 'Biodiversity Spike', 'Canopy Health', 'Civilizational Governance'] as const).map(cat => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1.5 rounded-sm border whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#232323] border-[#C5A059] text-[#F5F5F0] font-bold shadow-sm'
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/20'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat as BioregionalAlertCategory)}
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-[#C5A059] text-black font-bold' : 'bg-[#202020] text-[#F5F5F0]/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Severity & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Severity selector */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] uppercase text-[#F5F5F0]/40 mr-1">Severity:</span>
            {['All', 'Critical', 'Warning', 'Success', 'Info'].map(sev => {
              const isSelected = selectedSeverity === sev;
              return (
                <button
                  key={sev}
                  onClick={() => {
                    setSelectedSeverity(sev);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded-xs border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                      : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
            <input
              type="text"
              placeholder="Search alert keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:border-[#C5A059] focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#F5F5F0]/40 hover:text-[#F5F5F0]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Vertical Alert Feed */}
      <div className="px-5 pb-5 space-y-3 max-h-[560px] overflow-y-auto pr-2">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#121212] border border-[#F5F5F0]/5 rounded-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
            <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">No Alerts Found</h4>
            <p className="text-xs text-[#F5F5F0]/50 font-sans max-w-sm mx-auto">
              All sensors in this category are operating within nominal thermodynamic and biophysical thresholds.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSeverity('All');
                setSearchQuery('');
              }}
              className="mt-2 px-3 py-1 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-[#C5A059] rounded cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isExpanded = expandedAlertId === alert.id;
            const category = alert.bioregionalCategory;

            return (
              <div
                key={alert.id}
                onClick={() => toggleExpand(alert.id)}
                className={`p-4 rounded-sm border transition-all cursor-pointer text-left space-y-3 ${
                  isExpanded
                    ? 'bg-[#181818] border-[#C5A059]/80 shadow-lg'
                    : alert.read
                    ? 'bg-[#121212] border-[#F5F5F0]/8 hover:border-[#F5F5F0]/20 hover:bg-[#151515]'
                    : 'bg-[#151816] border-emerald-500/30 hover:border-emerald-500/50 shadow-sm'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs border flex items-center gap-1 ${getCategoryBadgeClass(category)}`}>
                      {getCategoryIcon(category)}
                      <span>{category.toUpperCase()}</span>
                    </span>

                    {/* Severity */}
                    {getSeverityBadge(alert.severity)}

                    {/* Unread indicator */}
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Unread alert" />
                    )}

                    <span className="text-[11px] font-mono text-[#F5F5F0]/40">
                      • {alert.missionTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/50 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#C5A059]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
                    )}
                  </div>
                </div>

                {/* Title & Message */}
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Metric Summary Ribbon (if metadata available) */}
                {alert.metadata?.reading && (
                  <div className="p-2.5 bg-[#0A0A0A] border border-[#F5F5F0]/5 rounded-xs flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F5F5F0]/50 text-[10px] uppercase">
                      {alert.metadata.anomalyMetric || 'Observed Reading'}:
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {alert.metadata.reading}
                    </span>
                    {alert.metadata.threshold && (
                      <span className="text-[#F5F5F0]/40 text-[10px]">
                        Target: {alert.metadata.threshold}
                      </span>
                    )}
                  </div>
                )}

                {/* Expanded Epistemic Provenance & Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-3 text-xs font-mono animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      {alert.metadata?.verifiedBy && (
                        <div className="p-2.5 bg-[#111111] rounded-xs border border-[#F5F5F0]/5">
                          <span className="text-[#C5A059] block text-[9px] uppercase font-bold">Verifying Council:</span>
                          <span className="text-[#F5F5F0]">{alert.metadata.verifiedBy}</span>
                        </div>
                      )}

                      {alert.metadata?.epistemicTier && (
                        <div className="p-2.5 bg-[#111111] rounded-xs border border-[#F5F5F0]/5">
                          <span className="text-[#C5A059] block text-[9px] uppercase font-bold">Epistemic Tier:</span>
                          <span className="text-emerald-400">{alert.metadata.epistemicTier}</span>
                        </div>
                      )}
                    </div>

                    {/* Cryptographic Hash */}
                    {alert.cryptographicHash && (
                      <div className="p-2.5 bg-[#0A0A0A] rounded-xs border border-[#F5F5F0]/5 flex items-center justify-between gap-2">
                        <div className="truncate">
                          <span className="text-[9px] text-[#C5A059] uppercase block font-bold">
                            Cryptographic Merkle Proof:
                          </span>
                          <span className="text-[10px] text-[#F5F5F0]/80 font-mono break-all">
                            {alert.cryptographicHash}
                          </span>
                        </div>
                        <button
                          onClick={e => handleCopyHash(alert.id, alert.cryptographicHash!, e)}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-[#262626] border border-[#F5F5F0]/10 text-[#C5A059] rounded cursor-pointer shrink-0"
                          title="Copy Proof Hash"
                        >
                          {copiedHashId === alert.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {/* Footer Actions inside Card */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            markAsRead(alert.id);
                            audioFeedback.playMicroTick();
                          }}
                          className="text-[10px] font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0] underline cursor-pointer"
                        >
                          {alert.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                      </div>

                      {onNavigateToEvidence && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onNavigateToEvidence(alert.targetId);
                            audioFeedback.playMicroTick();
                          }}
                          className="px-2.5 py-1 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 text-[10px] font-mono rounded flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect Linked Field Evidence</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#0A0A0A] border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/40 px-5">
        <span>Commandment II: In-Situ Reality Above Simulated Predictions</span>
        <span>Displaying {filteredAlerts.length} of {alerts.length} Total Telemetry Alerts</span>
      </div>
    </div>
  );
};
