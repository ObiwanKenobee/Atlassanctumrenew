import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Activity,
  Maximize2,
  Globe2,
  Play,
  Radio,
  Download,
  FileText,
  Filter,
  Copy,
  Check,
  X,
  Eye,
  EyeOff,
  TreePine,
  Bird,
  Droplets,
  Camera,
  SlidersHorizontal,
  BookmarkPlus,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';
import { BioregionalTwinScenario, CausalInterventionParam } from '../../types';
import { BIOREGIONAL_TWIN_SCENARIOS } from '../../data/aiEnginesData';
import { EcologicalAlertSystem } from '../EcologicalAlertSystem';
import { RealityCheck } from '../RealityCheck';
import { BioregionalGoalsPanel } from '../bioregional/BioregionalGoalsPanel';
import { BioregionalIndicators } from '../bioregional/BioregionalIndicators';
import { 
  BioregionalGeospatialMap, 
  DEFAULT_FIELD_EVIDENCE_MARKERS, 
  FieldEvidenceMarker 
} from '../bioregional/BioregionalGeospatialMap';
import { BioregionalTimeline } from '../bioregional/BioregionalTimeline';
import { BiodiversityRadar } from '../bioregional/BiodiversityRadar';
import { BioregionalEventMonitor } from '../bioregional/BioregionalEventMonitor';
import { BioregionalSnap } from '../bioregional/BioregionalSnap';
import { BioregionalInsightsFeed } from '../bioregional/BioregionalInsightsFeed';
import { BioregionalEvidenceTimeline } from '../bioregional/BioregionalEvidenceTimeline';
import { BioregionalKnowledgeGraph } from '../bioregional/BioregionalKnowledgeGraph';
import { RestorationTimelineView } from '../bioregional/RestorationTimelineView';
import { VoiceNarrativeLayer } from '../bioregional/VoiceNarrativeLayer';
import { RegenerationHeatmapOverlay } from '../bioregional/RegenerationHeatmapOverlay';
import { BioregionalAnnotationLayer } from '../bioregional/BioregionalAnnotationLayer';
import { BioregionalAlertFeed } from '../bioregional/BioregionalAlertFeed';
import { ExportScenarioInsightsModal } from '../bioregional/ExportScenarioInsightsModal';
import { ExportDataWizardModal } from '../bioregional/ExportDataWizardModal';
import { TemporalRegenerationSlider } from '../bioregional/TemporalRegenerationSlider';
import { NodeComparator } from '../bioregional/NodeComparator';
import { GenerativeSoundscapeEngine } from '../bioregional/GenerativeSoundscapeEngine';
import { audioFeedback } from '../../lib/audioFeedback';
import { useViewRenderTracker } from '../../hooks/useViewRenderTracker';

// High-fidelity abstract bioregional health visual backgrounds generated via Imagen
const BIOREGIONAL_HEALTH_BACKGROUNDS = [
  {
    id: 'canopy_pulse',
    name: 'Canopy Pulse & Biomass Health',
    description: 'Chlorophyll luminescence, mycelial network vitality, and multi-strata canopy volume.',
    imageSrc: '/src/assets/images/canopy_pulse_health_1787771045697.jpg',
    metric: 'NDVI +0.28 Index',
    biomeMatch: 'Aberdare Cloud Forest & Highland Alpine'
  },
  {
    id: 'hydrology_flow',
    name: 'Hydrology Flow & Aquifer Mesh',
    description: 'Subterranean groundwater currents, river basin riparian flow, and piezometer head pressure.',
    imageSrc: '/src/assets/images/hydrology_flow_health_1787771061356.jpg',
    metric: '1.82 bar Recovery',
    biomeMatch: 'Mara-Rift Watershed & Riparian Corridors'
  },
  {
    id: 'soil_microbiome',
    name: 'Living Soil Microbiome & Carbon Grid',
    description: 'Mycorrhizal fungal filaments, soil organic matter (SOM), and deep subterranean carbon sequestration.',
    imageSrc: '/src/assets/images/soil_microbiome_health_1787771074165.jpg',
    metric: '3.4% SOM Density',
    biomeMatch: 'East Africa Arid Sponge & Silvopasture'
  },
  {
    id: 'climate_harmony',
    name: 'Climate Harmony & Thermal Isobars',
    description: 'Planetary atmospheric flows, micro-climate cooling loops, and thermal boundary equilibrium.',
    imageSrc: '/src/assets/images/climate_harmony_health_1787771096045.jpg',
    metric: '2.1°C Micro-Cooling',
    biomeMatch: 'Pan-African Macro Ecosphere'
  }
];

interface BioregionalTwinViewProps {
  onSelectTab: (tab: any) => void;
  onOpenMoralSimulator?: () => void;
}

export const BioregionalTwinView: React.FC<BioregionalTwinViewProps> = ({ 
  onSelectTab,
  onOpenMoralSimulator 
}) => {
  useViewRenderTracker('Bioregional Twin 3D');

  const [scenarios] = useState<BioregionalTwinScenario[]>(BIOREGIONAL_TWIN_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(BIOREGIONAL_TWIN_SCENARIOS[0].id);
  const [selectedBgId, setSelectedBgId] = useState<string>(BIOREGIONAL_HEALTH_BACKGROUNDS[0].id);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(0.75);
  const [activeHorizon, setActiveHorizon] = useState<'year5' | 'year15' | 'year30'>('year15');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Ecological Layer Filter and Temporal Synchronization State
  const [activeTimelineYear, setActiveTimelineYear] = useState<number>(2026);
  const [selectedEcologicalLayer, setSelectedEcologicalLayer] = useState<string>('all');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState<boolean>(false);

  // Local State Snapshot Capture
  const [capturedSnapshots, setCapturedSnapshots] = useState<Array<{
    id: string;
    timestamp: string;
    title: string;
    year: number;
    layer: string;
    scenarioName: string;
    notes: string;
    p90Certainty: number;
  }>>([
    {
      id: 'snap-init-1',
      timestamp: '10:15 AM',
      title: 'Aberdare Ridge Baseline & Mycelial Network Snapshot',
      year: 2026,
      layer: 'Soil Health',
      scenarioName: 'Aberdare Highland Watershed & Riparian Corridor',
      notes: 'Initial high-resolution baseline showing +14.2% SOM potential and Podocarpus canopy anchors.',
      p90Certainty: 91.2
    }
  ]);
  const [showSnapshotsDrawer, setShowSnapshotsDrawer] = useState<boolean>(false);
  const [showSnapshotNotification, setShowSnapshotNotification] = useState<boolean>(false);

  // Field evidence categories filter state for the D3 map
  const [activeEvidenceCategories, setActiveEvidenceCategories] = useState<string[]>([
    'Flora',
    'Fauna',
    'Hydrology',
    'Soil'
  ]);
  const [selectedEvidenceMarker, setSelectedEvidenceMarker] = useState<FieldEvidenceMarker | null>(null);

  // Field Report Export Modal state
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showWizardModal, setShowWizardModal] = useState<boolean>(false);
  const [showScenarioInsightsModal, setShowScenarioInsightsModal] = useState<boolean>(false);
  const [exportedReportPayload, setExportedReportPayload] = useState<any>(null);
  const [hasCopiedJson, setHasCopiedJson] = useState<boolean>(false);

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  const currentBackground = BIOREGIONAL_HEALTH_BACKGROUNDS.find(b => b.id === selectedBgId) || BIOREGIONAL_HEALTH_BACKGROUNDS[0];

  // Capture Snapshot Handler
  const handleCaptureSnapshot = () => {
    const newSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Snapshot #${capturedSnapshots.length + 1} — ${selectedScenario.name}`,
      year: activeTimelineYear,
      layer: selectedEcologicalLayer === 'all' ? 'All Ecological Layers' : selectedEcologicalLayer,
      scenarioName: selectedScenario.name,
      notes: `Captured at Horizon ${activeHorizon.toUpperCase()} with dynamic multiplier ${dynamicMultiplier.toFixed(2)}x. Active layer: ${selectedEcologicalLayer}.`,
      p90Certainty: selectedScenario.monteCarloProbabilityOfSuccess
    };
    setCapturedSnapshots(prev => [newSnapshot, ...prev]);
    setShowSnapshotNotification(true);
    audioFeedback.playDataSave();
    setTimeout(() => setShowSnapshotNotification(false), 3500);
  };

  // Dynamic user intervention slider states
  const [interventionValues, setInterventionValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    BIOREGIONAL_TWIN_SCENARIOS.forEach(scen => {
      scen.activeInterventions.forEach(param => {
        init[`${scen.id}_${param.id}`] = param.currentValue;
      });
    });
    return init;
  });

  const handleSliderChange = (scenarioId: string, paramId: string, val: number) => {
    setInterventionValues(prev => ({
      ...prev,
      [`${scenarioId}_${paramId}`]: val
    }));
    audioFeedback.playMicroTick();
  };

  const handleRunMonteCarlo = () => {
    setIsSimulating(true);
    audioFeedback.playSyncComplete();
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  // Toggle category on D3 map
  const handleToggleEvidenceCategory = (cat: string) => {
    setActiveEvidenceCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    audioFeedback.playMicroTick();
  };

  // Calculate dynamic multiplier based on current slider values relative to default
  const calculateScenarioMultiplier = () => {
    let factor = 1.0;
    selectedScenario.activeInterventions.forEach(param => {
      const currentVal = interventionValues[`${selectedScenario.id}_${param.id}`] ?? param.currentValue;
      const ratio = currentVal / (param.currentValue || 1);
      factor += (ratio - 1) * 0.15;
    });
    return Math.max(0.7, Math.min(1.35, factor));
  };

  const dynamicMultiplier = calculateScenarioMultiplier();

  // Export Local Field Report as JSON file (Simulates verifiable field audit report)
  const handleExportFieldReport = () => {
    const currentInterventions = selectedScenario.activeInterventions.map(param => ({
      id: param.id,
      name: param.name,
      configuredValue: interventionValues[`${selectedScenario.id}_${param.id}`] ?? param.currentValue,
      unit: param.unit,
      costEstimate: param.costEstimate,
      description: param.description
    }));

    const simulatedNodes = selectedScenario.nodes.map(node => {
      const simulatedVal = Math.round(node.currentBaseline * (1 / dynamicMultiplier) * 10) / 10;
      return {
        id: node.id,
        name: node.name,
        category: node.category,
        baseline: node.currentBaseline,
        simulatedCurrent: simulatedVal,
        unit: node.unit,
        biophysicalThreshold: node.biophysicalThreshold
      };
    });

    const reportPayload = {
      reportTitle: `Atlas Sanctum - Local Bioregional Field Report (${selectedScenario.bioregion})`,
      philosophicalGrounding: "Commandment II: Reality Above Model (Ground Truth Epistemic Priority)",
      exportTimestamp: new Date().toISOString(),
      engineVersion: "Atlas Sanctum Causal Bioregional Twin v3.2-production",
      bioregion: {
        id: selectedScenario.id,
        name: selectedScenario.name,
        bioregion: selectedScenario.bioregion,
        description: selectedScenario.description,
        populationAffected: selectedScenario.populationAffected,
        monteCarloProbabilityOfSuccess: parseFloat((selectedScenario.monteCarloProbabilityOfSuccess * (dynamicMultiplier > 1.1 ? 1.02 : 0.98)).toFixed(1)),
        ecologicalPlanetaryMarginSafe: selectedScenario.ecologicalPlanetaryMarginSafe,
        dynamicCausalMultiplier: parseFloat(dynamicMultiplier.toFixed(2))
      },
      activeInterventions: currentInterventions,
      restorationIndicators: {
        canopyCrownDensity: "78% Verified (+14.2% over 2020 baseline)",
        aquiferHeadRecovery: "+1.82 bar Piezometric Head Normalized",
        soilOrganicMatter: "4.8% SOM Density across keyline terraces",
        biodiversityIndex: "79/100 Composite Trophic Equilibrium",
        acousticComplexityIndex: "0.84 ACI Bio-Richness",
        carbonStockSequestered: "1,420 tCO2e/ha Decadal Rate"
      },
      biophysicalThresholdSensors: simulatedNodes,
      flourishingImpactTrajectories: selectedScenario.flourishingImpact,
      systemicConsequences: selectedScenario.consequences,
      fieldEvidenceLedger: DEFAULT_FIELD_EVIDENCE_MARKERS.map(ev => ({
        id: ev.id,
        title: ev.title,
        category: ev.category,
        coordinates: [ev.lat, ev.lng],
        locationName: ev.locationName,
        metricObserved: ev.metricObserved,
        timestamp: ev.timestamp,
        cryptographicHash: ev.hash,
        verifiedBy: ev.verifiedBy,
        status: ev.status,
        notes: ev.notes
      })),
      epistemicProvenance: {
        canonicalStandard: "Atlas Epistemic Verification Standard v2.4",
        provenanceHash: "0x99201a4e76110f8234719bbca098234190872615",
        sensorHealthConfidenceScore: 94.8,
        groundTruthCalibrated: true,
        signatoryCouncil: "East African Bioregional Custodians & Water Basin Directorate"
      }
    };

    setExportedReportPayload(reportPayload);

    // Trigger file download
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = selectedScenario.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `Atlas_Sanctum_Field_Report_${safeName}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    audioFeedback.playDataSave();
    setShowExportModal(true);
  };

  const copyReportToClipboard = () => {
    if (!exportedReportPayload) return;
    navigator.clipboard.writeText(JSON.stringify(exportedReportPayload, null, 2));
    setHasCopiedJson(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setHasCopiedJson(false), 2000);
  };

  const getConsequenceBadge = (type: string, severity: string) => {
    if (type === 'synergy' || type === 'regenerative_lock_in') {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    }
    if (severity === 'critical' || type === 'catastrophic_risk') {
      return 'bg-rose-950/70 text-rose-300 border-rose-500/40';
    }
    return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#C5A059]" />
              AI CAUSAL TWIN • COUNTERFACTUAL BIOREGIONAL SIMULATOR
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Commandment II: Reality Above Model
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Causal Bioregional Twin</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Pearl Do-Calculus and multi-temporal Monte Carlo simulation projecting 1st, 2nd, and 3rd order systemic consequences of policy, capital, and engineering interventions across 30 years.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Capture Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="px-3.5 py-2 bg-[#0E1A13] hover:bg-[#152B1E] border border-emerald-500 text-emerald-300 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer group"
            title="Save current knowledge graph, heatmap, and simulation state as a local snapshot"
          >
            <Camera className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Capture Snapshot</span>
          </button>

          {/* View Saved Snapshots Drawer Button */}
          <button
            onClick={() => {
              setShowSnapshotsDrawer(true);
              audioFeedback.playMicroTick();
            }}
            className="px-3.5 py-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#F5F5F0]/80 text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer relative"
            title="View captured snapshots library"
          >
            <BookmarkCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Saved Snapshots</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold rounded-full">
              {capturedSnapshots.length}
            </span>
          </button>

          {/* Layer Filter Sidebar Toggle Button */}
          <button
            onClick={() => {
              setIsFilterSidebarOpen(!isFilterSidebarOpen);
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 py-2 border text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isFilterSidebarOpen || selectedEcologicalLayer !== 'all'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-md'
                : 'bg-[#141414] hover:bg-[#1A1A1A] border-[#F5F5F0]/20 text-[#F5F5F0]/80'
            }`}
            title="Filter knowledge graph & simulation by ecological layer"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Layer Filter</span>
            {selectedEcologicalLayer !== 'all' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* Export Scenario Insights & PDF Snapshot Button */}
          <button
            onClick={() => {
              setShowScenarioInsightsModal(true);
              audioFeedback.playMicroTick();
            }}
            className="px-3.5 py-2 bg-[#2D1F08] hover:bg-[#3D2C0C] border border-[#C5A059] text-[#C5A059] text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer group"
            title="Generate a PDF snapshot and formatted regeneration insights of the current knowledge graph state"
          >
            <FileText className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
            <span>Export Scenario PDF</span>
          </button>

          {/* Export Data Wizard (JSON Research Package) Button */}
          <button
            onClick={() => {
              setShowWizardModal(true);
              audioFeedback.playMicroTick();
            }}
            className="px-3.5 py-2 bg-[#1B2735] hover:bg-[#243447] border border-[#8FB8DE]/60 text-[#8FB8DE] text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer group"
            title="Package bioregional snapshots, indicators, and field evidence into a verified JSON package"
          >
            <Sparkles className="w-4 h-4 text-[#8FB8DE] group-hover:scale-110 transition-transform" />
            <span>Export Data Wizard</span>
          </button>

          {/* Export Local Field Report Button */}
          <button
            onClick={handleExportFieldReport}
            className="px-3.5 py-2 bg-[#17221A] hover:bg-[#203125] border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer group"
            title="Export full indicators and evidence ledger as a JSON Field Report"
          >
            <Download className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Quick Export (JSON)</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('flourishing-index');
              audioFeedback.playViewTransition();
            }}
            className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <TrendingUp className="w-4 h-4 text-[#C5A059]" />
            <span>Flourishing Index</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('moral-arbiter');
              audioFeedback.playCovenantResonance();
            }}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Moral Arbiter</span>
          </button>
        </div>
      </div>

      {/* Epistemic Reality Check */}
      <RealityCheck 
        data={{
          status: 'modeled',
          confidenceScore: 91.2,
          uncertaintyMargin: '± 4.5%',
          epistemicTier: 'Counterfactual Structural Causal Model',
          realityVsModelWarning: 'Commandment II: This counterfactual projection is a simulation aid, not empirical ground truth. Never substitute model predictions for in-situ field measurement.',
          dataOrigin: 'Pearl Do-Calculus Kernel & Sentinel-2 Historical Biophysical Mesh',
          cryptographicHash: '0x99201a4e76110f8234719bbca098234190872615',
          lastVerified: 'Live Simulation Compute',
          verifiedBy: 'Causal Synthesis Research Lab',
          assumptions: [
            'Assumes non-linear rainfall variance conforms to CMIP6 SSP2-4.5 projections.',
            'Assumes human labor compliance with regenerative agroforestry protocols is maintained above 85%.'
          ]
        }}
      />

      {/* Active Bioregional Goals Panel (Firestore Driven) */}
      <BioregionalGoalsPanel 
        selectedBioregionId={selectedScenario.id}
      />

      {/* Scenario Selector Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            SELECT BIOREGIONAL TWIN SCENARIO
          </span>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">
            3 Active Living Models
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scen) => {
            const isSelected = scen.id === selectedScenarioId;
            return (
              <div
                key={scen.id}
                onClick={() => {
                  setSelectedScenarioId(scen.id);
                  audioFeedback.playMicroTick();
                }}
                className={`p-4 rounded-sm border transition-all cursor-pointer text-left space-y-2 ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-lg scale-[1.01]'
                    : 'bg-[#111111] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059]">
                    {scen.bioregion}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0] line-clamp-1">
                  {scen.name}
                </h4>
                <p className="text-xs text-[#F5F5F0]/60 line-clamp-2">
                  {scen.description}
                </p>
                <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40">
                  <span>{(scen.populationAffected / 1000).toFixed(0)}k Inhabitants</span>
                  <span className="text-emerald-400">{scen.monteCarloProbabilityOfSuccess}% Success</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Imagen Canvas Stage with Background Switching */}
      <div className="relative w-full rounded-sm border border-[#C5A059]/40 overflow-hidden shadow-2xl bg-[#050505]">
        {/* Background Image Layer with opacity and subtle gradient overlay */}
        <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden bg-black">
          <img
            src={currentBackground.imageSrc}
            alt={currentBackground.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-700 filter brightness-90 contrast-105"
            style={{ opacity: backgroundOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/80" />

          {/* Interactive Floating Telemetry Sentinel Nodes on the Background */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-md space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] font-mono text-[10px] uppercase font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Imagen Bioregional Health Layer: {currentBackground.name}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0] drop-shadow-md">
              {selectedScenario.bioregion} Living Health Matrix
            </h2>
            <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed drop-shadow">
              {currentBackground.description}
            </p>
          </div>

          {/* Top-Right Telemetry & Health Indicator Badges */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-end gap-2">
            <div className="px-3 py-1.5 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-right">
              <span className="text-[9px] font-mono uppercase text-emerald-400 block font-bold">Bioregional Baseline</span>
              <span className="text-sm font-mono font-bold text-emerald-300">{currentBackground.metric}</span>
            </div>
            <div className="px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-[#F5F5F0]/10 text-right hidden sm:block">
              <span className="text-[9px] font-mono uppercase text-[#F5F5F0]/50 block">Target Ecosystem</span>
              <span className="text-xs font-mono text-[#C5A059]">{currentBackground.biomeMatch}</span>
            </div>
          </div>

          {/* Animated Pulsing Sensor Points Overlaid on Canvas */}
          <div className="absolute bottom-12 left-1/4 flex items-center gap-2 pointer-events-none">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
              Sentinel-2 NDVI Mesh Active
            </span>
          </div>

          <div className="absolute bottom-16 right-1/3 flex items-center gap-2 pointer-events-none hidden sm:flex">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
              Subterranean Aquifer Node 4
            </span>
          </div>
        </div>

        {/* Bottom Selector Ribbon for Bioregional Health Background Layers */}
        <div className="p-4 bg-[#0E0E0E] border-t border-[#F5F5F0]/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span className="font-bold text-[#F5F5F0] uppercase tracking-wider text-[11px]">
              Bioregional Health Layer:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {BIOREGIONAL_HEALTH_BACKGROUNDS.map((bg) => {
              const isSelected = bg.id === selectedBgId;
              return (
                <button
                  key={bg.id}
                  onClick={() => {
                    setSelectedBgId(bg.id);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-3 py-1.5 rounded-xs border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F2720] border-emerald-500/60 text-emerald-300 shadow-sm'
                      : 'bg-[#151515] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/25'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-[#F5F5F0]/30'}`} />
                  <span>{bg.name.split('&')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono self-end lg:self-center">
            <span className="text-[10px] text-[#F5F5F0]/40 uppercase">Layer Intensity:</span>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={backgroundOpacity}
              onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
              className="w-20 accent-[#C5A059] bg-[#1A1A1A] h-1.5 rounded appearance-none cursor-pointer"
            />
            <span className="text-[#C5A059] font-bold w-8 text-right">
              {Math.round(backgroundOpacity * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* D3 Geospatial Map Overlay with Field Evidence Filtering Sidebar */}
      <BioregionalGeospatialMap
        selectedBioregionId={selectedScenario.id}
        activeEvidenceCategories={activeEvidenceCategories}
        onToggleEvidenceCategory={handleToggleEvidenceCategory}
        selectedEvidence={selectedEvidenceMarker}
        onSelectEvidence={setSelectedEvidenceMarker}
      />

      {/* Bioregional Timeline: Historical + Predicted Restoration Milestones */}
      <BioregionalTimeline
        selectedBioregionId={selectedScenario.id}
        bioregionName={selectedScenario.bioregion}
        activeHorizon={activeHorizon}
      />

      {/* Biodiversity Radar: Species Population Health Across Indicators (Recharts) */}
      <BiodiversityRadar
        selectedBioregionId={selectedScenario.id}
        bioregionName={selectedScenario.bioregion}
      />

      {/* Real-Time Bioregional Event Monitor: Milestone & Telemetry Alerts */}
      <BioregionalEventMonitor
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.bioregion}
      />

      {/* Real-Time Ecological Alert System Section */}
      <EcologicalAlertSystem 
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.bioregion}
        onOpenMoralSimulator={onOpenMoralSimulator}
        onSelectTab={onSelectTab}
      />

      {/* Bioregional Indicators: Longitudinal Ecological Restoration Progress Over Time */}
      <BioregionalIndicators
        selectedBioregionId={selectedScenario.id}
        bioregionName={selectedScenario.bioregion}
      />

      {/* Bioregional Snap: Camera In-Situ Field Evidence Collector */}
      <BioregionalSnap
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.bioregion}
      />

      {/* Bioregional Insights Feed: Indigenous Wisdom, Ecological Science & Regenerative Practice Tips */}
      <BioregionalInsightsFeed
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.bioregion}
      />

      {/* Bioregional Evidence Timeline: Vertical Chronological Sequence of Captured Field Evidence & Rich Sticky Notes */}
      <BioregionalEvidenceTimeline
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.bioregion}
        onNavigateToModule={(modId) => {
          onSelectTab(modId);
          audioFeedback.playViewTransition();
        }}
      />

      {/* Ecological Layer Filter Sidebar / Bar */}
      <div className="p-4 bg-[#0A0D0B] border border-emerald-500/30 rounded-sm space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              ECOLOGICAL LAYER FILTER & TEMPORAL SYNCHRONIZER
            </span>
            <span className="text-[9px] font-mono bg-[#141414] text-[#C5A059] border border-[#C5A059]/30 px-2 py-0.5 rounded">
              Active Period: Year {activeTimelineYear}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/60">
            <span>Filtered Layer: <strong className="text-white capitalize">{selectedEcologicalLayer === 'all' ? 'All Ecological Layers' : selectedEcologicalLayer}</strong></span>
            {selectedEcologicalLayer !== 'all' && (
              <button
                onClick={() => {
                  setSelectedEcologicalLayer('all');
                  audioFeedback.playMicroTick();
                }}
                className="text-emerald-400 hover:underline ml-1 cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          {[
            { id: 'all', label: 'All Layers', icon: Layers, count: 18, color: 'text-white' },
            { id: 'Soil Health', label: 'Soil Health', icon: TreePine, count: 4, color: 'text-amber-400' },
            { id: 'Water Cycles', label: 'Water Cycles', icon: Droplets, count: 4, color: 'text-cyan-400' },
            { id: 'Biodiversity Indices', label: 'Biodiversity Indices', icon: Bird, count: 4, color: 'text-emerald-400' },
            { id: 'Canopy & Carbon Sinks', label: 'Canopy & Carbon Sinks', icon: TreePine, count: 3, color: 'text-emerald-300' },
            { id: 'Customary Governance', label: 'Customary Governance', icon: ShieldCheck, count: 3, color: 'text-purple-400' }
          ].map((layer) => {
            const isSelected = selectedEcologicalLayer === layer.id;
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  setSelectedEcologicalLayer(layer.id);
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950 border border-emerald-400 text-emerald-200 font-bold shadow-md'
                    : 'bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white hover:border-[#F5F5F0]/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                <span>{layer.label}</span>
                <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-[#222] text-[#F5F5F0]/40'}`}>
                  {layer.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Temporal Regeneration Slider: Seamless Scrubbing of Baseline & Future Trajectory Projections */}
      <TemporalRegenerationSlider
        currentYear={activeTimelineYear}
        selectedBioregionName={selectedScenario.name}
        onYearChange={(year) => {
          setActiveTimelineYear(year);
        }}
      />

      {/* Bioregional Knowledge Graph: D3 Ecological Dependency Network */}
      <BioregionalKnowledgeGraph
        selectedBioregionId={selectedScenario.id}
        activePeriodYear={activeTimelineYear}
        selectedLayerFilter={selectedEcologicalLayer}
        onTimelinePeriodChange={(year) => {
          setActiveTimelineYear(year);
        }}
        onSelectModuleTab={(tabId) => {
          onSelectTab(tabId);
          audioFeedback.playViewTransition();
        }}
      />

      {/* Node Comparator: Side-by-Side D3.js Ecological Marker Comparison Tool */}
      <NodeComparator
        selectedBioregionName={selectedScenario.name}
      />

      {/* Generative Soundscape Engine: Real-Time Spatial Audio Synthesizer */}
      <GenerativeSoundscapeEngine
        bioregionName={selectedScenario.name}
      />

      {/* Voice Narrative Layer: AI-Powered Audio Context Summary of Knowledge Graph */}
      <VoiceNarrativeLayer
        selectedZoneId="zone-aberdare-ridge"
        selectedZoneName={selectedScenario.name}
        onSelectInsightModule={(modId) => {
          onSelectTab(modId);
          audioFeedback.playViewTransition();
        }}
      />

      {/* Restoration Timeline View: D3.js Multi-Temporal Chronology (2016-2050) */}
      <RestorationTimelineView
        selectedBioregionId={selectedScenario.id}
        onTimelinePeriodChange={(year) => {
          setActiveTimelineYear(year);
        }}
      />

      {/* Regeneration Heatmap Overlay: Real-Time High-Probability Potential & Intervention Matrix */}
      <RegenerationHeatmapOverlay
        selectedBioregionId={selectedScenario.id}
      />

      {/* Bioregional Annotation Layer: Rich-Text Formatted Regeneration Insights & Module Linking */}
      <BioregionalAnnotationLayer
        selectedBioregionId={selectedScenario.id}
        onNavigateToModule={(moduleId, targetId) => {
          onSelectTab(moduleId);
          audioFeedback.playViewTransition();
        }}
      />

      {/* Bioregional Alert Feed: Live Telemetry, Anomaly Detection & Sustained Positive Tipping Point Alerts */}
      <BioregionalAlertFeed
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.name}
        onNavigateToEvidence={() => {
          onSelectTab('evidence-mapping');
          audioFeedback.playViewTransition();
        }}
      />

      {/* Scenario Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Bioregional Population</div>
          <div className="text-2xl font-bold text-[#F5F5F0]">{(selectedScenario.populationAffected).toLocaleString()}</div>
          <div className="text-[10px] text-[#C5A059]">Autonomous Inhabitants</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Monte Carlo Certainty</div>
          <div className="text-2xl font-bold text-emerald-400">
            {(selectedScenario.monteCarloProbabilityOfSuccess * (dynamicMultiplier > 1.1 ? 1.02 : 0.98)).toFixed(1)}%
          </div>
          <div className="text-[10px] text-emerald-300">10,000 Stochastic Iterations</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Planetary Boundary Safety</div>
          <div className="text-2xl font-bold text-emerald-400">Safe Margin</div>
          <div className="text-[10px] text-emerald-300">Within Aquifer & Carbon Limits</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Causal Multiplier</div>
          <div className="text-2xl font-bold text-[#8FB8DE]">{dynamicMultiplier.toFixed(2)}x</div>
          <div className="text-[10px] text-[#F5F5F0]/60">Intervention Coupling</div>
        </div>
      </div>

      {/* Main Grid: Counterfactual Controls + Multi-Temporal Trajectories & 3-Order Consequences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Interactive Interventions & Do-Calculus Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                  Causal Intervention Controls
                </h3>
              </div>
              <button
                onClick={handleRunMonteCarlo}
                disabled={isSimulating}
                className="px-3 py-1 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 text-[10px] font-mono rounded flex items-center gap-1 transition-all cursor-pointer"
              >
                <Play className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>

            <p className="text-xs text-[#F5F5F0]/60 font-sans leading-relaxed">
              Adjust policy, engineering, and capital variables in real-time to compute counterfactual feedback loops on community well-being and ecological thresholds.
            </p>

            <div className="space-y-5">
              {selectedScenario.activeInterventions.map((param) => {
                const currentVal = interventionValues[`${selectedScenario.id}_${param.id}`] ?? param.currentValue;
                return (
                  <div key={param.id} className="p-3.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#F5F5F0]">{param.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {currentVal} {param.unit}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#F5F5F0]/50 font-sans leading-tight">
                      {param.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(selectedScenario.id, param.id, parseFloat(e.target.value))}
                        className="w-full accent-[#C5A059] bg-[#1E1E1E] h-1.5 rounded appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/30 pt-0.5">
                      <span>Min: {param.min}</span>
                      <span className="text-[#C5A059]">{param.costEstimate}</span>
                      <span>Max: {param.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                const resetState: Record<string, number> = {};
                selectedScenario.activeInterventions.forEach(p => {
                  resetState[`${selectedScenario.id}_${p.id}`] = p.currentValue;
                });
                setInterventionValues(prev => ({ ...prev, ...resetState }));
                audioFeedback.playMicroTick();
              }}
              className="w-full py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0] rounded-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scenario Parameters</span>
            </button>
          </div>

          {/* Biophysical Thresholds Monitor */}
          <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              BIOPHYSICAL THRESHOLDS & BOUNDARY SENTINELS
            </span>

            <div className="space-y-3">
              {selectedScenario.nodes.map((node) => {
                const simulatedVal = Math.round(node.currentBaseline * (1 / dynamicMultiplier) * 10) / 10;
                const isCritical = node.biophysicalThreshold && simulatedVal >= node.biophysicalThreshold.criticalCollapse;
                return (
                  <div key={node.id} className="p-3 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F5F5F0] font-bold">{node.name}</span>
                      <span className={`font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {simulatedVal} {node.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/40 font-mono">
                      <span>Baseline: {node.currentBaseline} {node.unit}</span>
                      <span>Safe Limit: {node.biophysicalThreshold?.minSafe}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Flourishing Projections & Systemic Consequences */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-Temporal Horizon Selector & Projections */}
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  MULTI-TEMPORAL TRAJECTORY HORIZON
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0] mt-0.5">
                  Flourishing Index Trajectory by Horizon
                </h3>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
                {(['year5', 'year15', 'year30'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setActiveHorizon(h);
                      audioFeedback.playMicroTick();
                    }}
                    className={`px-3 py-1 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                      activeHorizon === h
                        ? 'bg-[#C5A059] text-black font-bold'
                        : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                    }`}
                  >
                    {h === 'year5' ? '5 Years' : h === 'year15' ? '15 Years' : '30 Years'}
                  </button>
                ))}
              </div>
            </div>

            {/* Flourishing Dimensions Horizon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(selectedScenario.flourishingImpact).map(([dimKey, rawImpact]) => {
                const impact = rawImpact as { year5: number; year15: number; year30: number; confidence: number };
                const baseScore = impact[activeHorizon];
                const simulatedScore = Math.min(100, Math.round(baseScore * dynamicMultiplier));
                return (
                  <div key={dimKey} className="p-3.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-sm space-y-1.5 text-left">
                    <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                      {dimKey} Flourishing
                    </div>
                    <div className="text-xl font-mono font-bold text-[#F5F5F0]">
                      {simulatedScore} <span className="text-xs text-[#F5F5F0]/40 font-normal">/ 100</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400">
                      Certainty: {impact.confidence}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1st, 2nd, & 3rd Order Consequence Engine */}
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                Systemic Consequence Graph (1st, 2nd & 3rd Order Dynamics)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Pearl Causal Graph Audited
              </span>
            </div>

            <div className="space-y-4">
              {selectedScenario.consequences.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#1B3022] text-emerald-300 text-[10px] font-mono font-bold rounded">
                        {c.order === 1 ? '1st Order (Direct)' : c.order === 2 ? '2nd Order (Systemic)' : '3rd Order (Generational)'}
                      </span>
                      <span className="text-sm font-serif font-bold text-[#F5F5F0]">
                        {c.title}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded border ${getConsequenceBadge(c.type, c.severity)}`}>
                      {c.type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {c.description}
                  </p>

                  {c.mitigationStrategy && (
                    <div className="p-3 bg-[#1F1710] border border-amber-500/30 rounded-xs text-[11px] text-amber-200 font-sans">
                      <span className="font-bold font-mono uppercase text-[9px] text-amber-400 block mb-0.5">
                        Prescribed AI Mitigation Intervention:
                      </span>
                      {c.mitigationStrategy}
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-[#F5F5F0]/40 pt-1">
                    Affected Domain: <span className="text-[#F5F5F0]/80">{c.affectedDomain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Field Report Export Verification Modal */}
      {showExportModal && exportedReportPayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#C5A059] rounded-sm max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#F5F5F0] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xs bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                    LOCAL FIELD REPORT EXPORTED (JSON)
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                    {exportedReportPayload.reportTitle}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 text-[#F5F5F0]/40 hover:text-[#F5F5F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Summary + JSON Inspector */}
            <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#141414] border border-emerald-500/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                <div>
                  <span className="text-emerald-400 font-bold block">File Download Initiated</span>
                  <span className="text-[#F5F5F0]/60">
                    Compiled {exportedReportPayload.fieldEvidenceLedger?.length || 0} Field Evidence items & {exportedReportPayload.activeInterventions?.length || 0} configured parameters.
                  </span>
                </div>

                <button
                  onClick={copyReportToClipboard}
                  className="px-3 py-1.5 bg-[#1F2720] hover:bg-[#2A372C] border border-emerald-500/50 text-emerald-300 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {hasCopiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedJson ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>

              {/* Provenance Hash */}
              <div className="p-3 bg-[#0A0A0A] border border-[#F5F5F0]/5 rounded-xs space-y-1">
                <span className="text-[9px] uppercase text-[#C5A059] block font-bold">
                  Epistemic Provenance Merkle Hash
                </span>
                <span className="text-[11px] text-emerald-400 break-all font-mono">
                  {exportedReportPayload.epistemicProvenance?.provenanceHash}
                </span>
              </div>

              {/* JSON Code Viewer */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#F5F5F0]/40 block font-bold">
                  Simulated Field Report JSON Payload:
                </span>
                <pre className="p-3 bg-[#050505] border border-[#F5F5F0]/10 rounded-xs max-h-72 overflow-y-auto text-[10px] text-[#A3E635] font-mono leading-relaxed select-all">
                  {JSON.stringify(exportedReportPayload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#F5F5F0]/10 bg-[#090909] flex items-center justify-between font-mono text-[10px] text-[#F5F5F0]/50">
              <span>Ground Truth Epistemic Standard v2.4</span>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#B08E4C] text-black font-bold rounded-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structured JSON Research Package Export Data Wizard Modal */}
      <ExportDataWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        selectedScenario={selectedScenario}
        interventionValues={interventionValues}
        dynamicMultiplier={dynamicMultiplier}
      />

      {/* Snapshot Captured Toast Notification */}
      {showSnapshotNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1A10] border border-emerald-400 text-[#F5F5F0] px-4 py-3 rounded shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 font-mono text-xs">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-emerald-300">Bioregional Snapshot Captured!</div>
            <div className="text-[10px] text-[#F5F5F0]/70">Saved knowledge graph, heatmap & layer state to local library.</div>
          </div>
        </div>
      )}

      {/* Saved Snapshots Library Modal / Drawer */}
      {showSnapshotsDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D120E] border border-emerald-500/50 rounded max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#F5F5F0] animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F5F5F0]">Saved Bioregional Snapshots</h3>
                  <p className="text-[11px] font-mono text-[#F5F5F0]/60">Captured states of the Knowledge Graph, Heatmap & Causal Projections</p>
                </div>
              </div>
              <button
                onClick={() => setShowSnapshotsDrawer(false)}
                className="p-1 text-[#F5F5F0]/40 hover:text-[#F5F5F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 font-mono">
              {capturedSnapshots.length === 0 ? (
                <div className="text-center py-10 text-[#F5F5F0]/40 text-xs">
                  No snapshots captured yet. Click "Capture Snapshot" in the header to save a point-in-time configuration.
                </div>
              ) : (
                capturedSnapshots.map(snap => (
                  <div key={snap.id} className="p-4 bg-[#141C16] border border-emerald-500/30 rounded text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 font-serif">{snap.title}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/30">
                        {snap.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-[#F5F5F0]/70">
                      <span>Timeline Period: <strong className="text-[#C5A059]">{snap.year}</strong></span>
                      <span>Active Layer: <strong className="text-emerald-300">{snap.layer}</strong></span>
                      <span>P90 Certainty: <strong className="text-emerald-400">{snap.p90Certainty}%</strong></span>
                    </div>
                    <p className="text-[11px] text-[#F5F5F0]/80 font-sans">{snap.notes}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-emerald-500/20 bg-[#090D0A] flex items-center justify-between text-xs font-mono">
              <span className="text-[#F5F5F0]/40">{capturedSnapshots.length} snapshot(s) stored in local session</span>
              <button
                onClick={() => setShowSnapshotsDrawer(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded cursor-pointer transition-colors"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Insights PDF & Knowledge Graph Snapshot Modal */}
      <ExportScenarioInsightsModal
        isOpen={showScenarioInsightsModal}
        onClose={() => setShowScenarioInsightsModal(false)}
        selectedBioregionId={selectedScenario.id}
        selectedBioregionName={selectedScenario.name}
        onNavigateToModule={(modId) => {
          onSelectTab(modId);
          audioFeedback.playViewTransition();
        }}
      />
    </div>
  );
};
