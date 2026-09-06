import React, { useState, useEffect, Suspense, startTransition } from 'react';
import { PageView, DataProvenance } from './types';
import { AuthProvider } from './context/AuthContext';
import { MissionAlertProvider } from './context/MissionAlertContext';
import { UncertaintyOverlayProvider } from './context/UncertaintyOverlayContext';
import { OfflineSyncProvider } from './context/OfflineSyncContext';
import { TrustLayerProvider } from './context/TrustLayerContext';
import { Web3WalletProvider } from './context/Web3WalletContext';
import { ActiveMissionProvider } from './context/ActiveMissionContext';
import { Navigation } from './components/Navigation';
import { ActiveMissionStatusBar } from './components/ActiveMissionStatusBar';
import { Footer } from './components/Footer';
import { GlobalLoadingIndicator } from './components/GlobalLoadingIndicator';
import { ViewLoadingSkeleton } from './components/ViewLoadingSkeleton';
import { ThemeAndAccessSyncListener } from './components/ThemeAndAccessSyncListener';
import { ConfirmationProvider } from './context/ConfirmationDialogContext';
import { ContextAwareThemeProvider } from './context/ContextAwareThemeContext';
import { MoralCompassCursor } from './components/MoralCompassCursor';
import { TrustLayerBanner } from './components/trust/TrustLayerBanner';
import { VerificationToastProvider } from './context/VerificationToastContext';
import { VerificationNotificationContainer } from './components/verification/VerificationNotificationContainer';
import { BioregionalHazardProvider } from './context/BioregionalHazardContext';
import { audioFeedback } from './lib/audioFeedback';
import { prefetchPriorityViews, prefetchView } from './lib/viewPrefetch';
import { registerServiceWorker } from './lib/serviceWorkerRegistration';
import { PerformanceMonitorOverlay } from './components/performance/PerformanceMonitorOverlay';

// Dynamic imports for secondary modals and utility widgets to reduce initial bundle size
const CommandmentsModal = React.lazy(() => import('./components/CommandmentsModal').then(m => ({ default: m.CommandmentsModal })));
const CommandCenterModal = React.lazy(() => import('./components/CommandCenterModal').then(m => ({ default: m.CommandCenterModal })));
const MoralScorecardModal = React.lazy(() => import('./components/MoralScorecardModal').then(m => ({ default: m.MoralScorecardModal })));
const DataProvenanceModal = React.lazy(() => import('./components/DataProvenanceModal').then(m => ({ default: m.DataProvenanceModal })));
const FloatingNewsletterWidget = React.lazy(() => import('./components/FloatingNewsletterWidget').then(m => ({ default: m.FloatingNewsletterWidget })));
const FloatingWelcomeBanner = React.lazy(() => import('./components/FloatingWelcomeBanner').then(m => ({ default: m.FloatingWelcomeBanner })));
const GeminiChatModal = React.lazy(() => import('./components/GeminiChatModal').then(m => ({ default: m.GeminiChatModal })));
const LiveVoiceModal = React.lazy(() => import('./components/LiveVoiceModal').then(m => ({ default: m.LiveVoiceModal })));
const VoiceCommandModal = React.lazy(() => import('./components/navigation/VoiceCommandModal').then(m => ({ default: m.VoiceCommandModal })));
const MissionAlertDrawer = React.lazy(() => import('./components/MissionAlertDrawer').then(m => ({ default: m.MissionAlertDrawer })));
const GlobalEpistemicSearch = React.lazy(() => import('./components/GlobalEpistemicSearch').then(m => ({ default: m.GlobalEpistemicSearch })));
const KeyboardShortcutsModal = React.lazy(() => import('./components/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal })));
const TrustLayerModal = React.lazy(() => import('./components/trust/TrustLayerModal').then(m => ({ default: m.TrustLayerModal })));
const PlatformTourOverlay = React.lazy(() => import('./components/navigation/PlatformTourOverlay').then(m => ({ default: m.PlatformTourOverlay })));

// Lazy-Loaded Views for instant code-splitting and progressive delivery
const AtlasStewardView = React.lazy(() => import('./components/steward/AtlasStewardView').then(m => ({ default: m.AtlasStewardView })));
const AtlasHomeView = React.lazy(() => import('./components/views/AtlasHomeView').then(m => ({ default: m.AtlasHomeView })));
const SentinelView = React.lazy(() => import('./components/views/SentinelView').then(m => ({ default: m.SentinelView })));
const AgentMissionControlView = React.lazy(() => import('./components/views/AgentMissionControlView').then(m => ({ default: m.AgentMissionControlView })));
const AIEngineeringView = React.lazy(() => import('./components/views/AIEngineeringView').then(m => ({ default: m.AIEngineeringView })));
const SystemModelStudioView = React.lazy(() => import('./components/views/SystemModelStudioView').then(m => ({ default: m.SystemModelStudioView })));
const OpportunityIntelligenceView = React.lazy(() => import('./components/views/OpportunityIntelligenceView').then(m => ({ default: m.OpportunityIntelligenceView })));
const DecisionRoomView = React.lazy(() => import('./components/views/DecisionRoomView').then(m => ({ default: m.DecisionRoomView })));
const OpportunityGraphView = React.lazy(() => import('./components/views/OpportunityGraphView').then(m => ({ default: m.OpportunityGraphView })));
const EvidenceLedgerView = React.lazy(() => import('./components/views/EvidenceLedgerView').then(m => ({ default: m.EvidenceLedgerView })));
const FieldLabsView = React.lazy(() => import('./components/views/FieldLabsView').then(m => ({ default: m.FieldLabsView })));
const ProjectOsView = React.lazy(() => import('./components/views/ProjectOsView').then(m => ({ default: m.ProjectOsView })));
const FlourishingIndexView = React.lazy(() => import('./components/views/FlourishingIndexView').then(m => ({ default: m.FlourishingIndexView })));
const CapitalEngineView = React.lazy(() => import('./components/views/CapitalEngineView').then(m => ({ default: m.CapitalEngineView })));
const RealityEngineView = React.lazy(() => import('./components/views/RealityEngineView').then(m => ({ default: m.RealityEngineView })));
const BioregionalTwinView = React.lazy(() => import('./components/views/BioregionalTwinView').then(m => ({ default: m.BioregionalTwinView })));
const BioregionalLedgerView = React.lazy(() => import('./components/views/BioregionalLedgerView').then(m => ({ default: m.BioregionalLedgerView })));
const LivingRealityView = React.lazy(() => import('./components/views/LivingRealityView').then(m => ({ default: m.LivingRealityView })));
const MoralArbiterView = React.lazy(() => import('./components/views/MoralArbiterView').then(m => ({ default: m.MoralArbiterView })));
const OpportunityMatchmakerView = React.lazy(() => import('./components/views/OpportunityMatchmakerView').then(m => ({ default: m.OpportunityMatchmakerView })));
const ObservatoryView = React.lazy(() => import('./components/views/ObservatoryView').then(m => ({ default: m.ObservatoryView })));
const StudioView = React.lazy(() => import('./components/views/StudioView').then(m => ({ default: m.StudioView })));
const MultimodalStudioView = React.lazy(() => import('./components/views/MultimodalStudioView').then(m => ({ default: m.MultimodalStudioView })));
const MarketplaceView = React.lazy(() => import('./components/views/MarketplaceView').then(m => ({ default: m.MarketplaceView })));
const LifeHouseView = React.lazy(() => import('./components/views/LifeHouseView').then(m => ({ default: m.LifeHouseView })));
const IndustrialView = React.lazy(() => import('./components/views/IndustrialView').then(m => ({ default: m.IndustrialView })));
const MoralIntelligenceView = React.lazy(() => import('./components/views/MoralIntelligenceView').then(m => ({ default: m.MoralIntelligenceView })));
const ImpactDashboardView = React.lazy(() => import('./components/views/ImpactDashboardView').then(m => ({ default: m.ImpactDashboardView })));
const AcademyCommonsView = React.lazy(() => import('./components/views/AcademyCommonsView').then(m => ({ default: m.AcademyCommonsView })));
const DevelopersSdkView = React.lazy(() => import('./components/views/DevelopersSdkView').then(m => ({ default: m.DevelopersSdkView })));
const AboutGovernanceView = React.lazy(() => import('./components/views/AboutGovernanceView').then(m => ({ default: m.AboutGovernanceView })));
const RegenerativeMissionView = React.lazy(() => import('./components/views/RegenerativeMissionView').then(m => ({ default: m.RegenerativeMissionView })));
const FailureLedgerView = React.lazy(() => import('./components/views/FailureLedgerView').then(m => ({ default: m.FailureLedgerView })));
const EthicsReviewView = React.lazy(() => import('./components/views/EthicsReviewView').then(m => ({ default: m.EthicsReviewView })));
const MissionPerformanceAnalyticsView = React.lazy(() => import('./components/views/MissionPerformanceAnalyticsView').then(m => ({ default: m.MissionPerformanceAnalyticsView })));
const EvidenceMappingView = React.lazy(() => import('./components/views/EvidenceMappingView').then(m => ({ default: m.EvidenceMappingView })));
const StewardshipReputationView = React.lazy(() => import('./components/views/StewardshipReputationView').then(m => ({ default: m.StewardshipReputationView })));
const EventsView = React.lazy(() => import('./components/views/EventsView').then(m => ({ default: m.EventsView })));
const StoriesView = React.lazy(() => import('./components/views/StoriesView').then(m => ({ default: m.StoriesView })));
const ResourcesView = React.lazy(() => import('./components/views/ResourcesView').then(m => ({ default: m.ResourcesView })));
const GovernanceHubView = React.lazy(() => import('./components/views/GovernanceHubView').then(m => ({ default: m.GovernanceHubView })));
const EconomicsPricingView = React.lazy(() => import('./components/views/EconomicsPricingView').then(m => ({ default: m.EconomicsPricingView })));
const AnalyticsReportView = React.lazy(() => import('./components/views/AnalyticsReportView').then(m => ({ default: m.AnalyticsReportView })));

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageView>('home');
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [moralSimulatorOpen, setMoralSimulatorOpen] = useState(false);
  const [commandmentsModalOpen, setCommandmentsModalOpen] = useState(false);
  const [geminiChatOpen, setGeminiChatOpen] = useState(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState(false);
  const [voiceCommandOpen, setVoiceCommandOpen] = useState(false);
  const [platformTourOpen, setPlatformTourOpen] = useState(false);
  const [commandCenterInitialQuery, setCommandCenterInitialQuery] = useState<string>('');
  const [provenanceModalData, setProvenanceModalData] = useState<DataProvenance | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Automatic first-visit platform tour check
  useEffect(() => {
    try {
      const tourCompleted = localStorage.getItem('atlas_platform_tour_completed');
      const dontShow = localStorage.getItem('atlas_platform_tour_dont_show');
      if (!tourCompleted && !dontShow) {
        const timer = setTimeout(() => {
          setPlatformTourOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable in sandboxed environment
    }
  }, []);

  // Global keyboard shortcuts & custom event listeners
  useEffect(() => {
    // Register Service Worker for offline epistemic resilience
    registerServiceWorker();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandCenterOpen((prev) => !prev);
        return;
      }

      if (!isInput) {
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault();
          setShortcutsModalOpen((prev) => !prev);
        } else if (e.key === '/') {
          e.preventDefault();
          setGlobalSearchOpen(true);
        } else if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          setVoiceCommandOpen((prev) => !prev);
        }
      }
    };

    const handleOpenChat = () => setGeminiChatOpen(true);
    const handleOpenVoice = () => setLiveVoiceOpen(true);
    const handleOpenVoiceCommand = () => setVoiceCommandOpen(true);
    const handleOpenCommandments = () => setCommandmentsModalOpen(true);
    const handleOpenSearch = () => setGlobalSearchOpen(true);
    const handleOpenShortcuts = () => setShortcutsModalOpen(true);
    const handleResetToHome = () => {
      setCurrentTab('home');
      setCommandCenterOpen(false);
      setGlobalSearchOpen(false);
      setShortcutsModalOpen(false);
      setMoralSimulatorOpen(false);
      setCommandmentsModalOpen(false);
      setGeminiChatOpen(false);
      setLiveVoiceOpen(false);
      setVoiceCommandOpen(false);
      setProvenanceModalData(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleVoiceCommandSearch = (e: any) => {
      const q = e.detail?.query;
      if (q) {
        setLiveVoiceOpen(false);
        setVoiceCommandOpen(false);
        setCommandCenterInitialQuery(q);
        setCommandCenterOpen(true);
      }
    };
    const handleInspectCustomProvenance = (e: any) => {
      if (e.detail) {
        setProvenanceModalData(e.detail);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-gemini-chat', handleOpenChat);
    window.addEventListener('open-live-voice', handleOpenVoice);
    window.addEventListener('open-voice-commands', handleOpenVoiceCommand);
    window.addEventListener('open-gemini-live', handleOpenVoiceCommand);
    window.addEventListener('open-commandments', handleOpenCommandments);
    window.addEventListener('open-global-search', handleOpenSearch);
    window.addEventListener('open-keyboard-shortcuts', handleOpenShortcuts);
    window.addEventListener('atlas-reset-to-home', handleResetToHome);
    window.addEventListener('trigger-voice-command-search' as any, handleVoiceCommandSearch);
    const handleOpenTour = () => setPlatformTourOpen(true);
    window.addEventListener('open-platform-tour', handleOpenTour);
    window.addEventListener('inspect-data-provenance' as any, handleInspectCustomProvenance);

    // Proactively prefetch priority modules on idle
    prefetchPriorityViews();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-gemini-chat', handleOpenChat);
      window.removeEventListener('open-live-voice', handleOpenVoice);
      window.removeEventListener('open-voice-commands', handleOpenVoiceCommand);
      window.removeEventListener('open-gemini-live', handleOpenVoiceCommand);
      window.removeEventListener('open-commandments', handleOpenCommandments);
      window.removeEventListener('open-global-search', handleOpenSearch);
      window.removeEventListener('open-keyboard-shortcuts', handleOpenShortcuts);
      window.removeEventListener('open-platform-tour', handleOpenTour);
      window.removeEventListener('atlas-reset-to-home', handleResetToHome);
      window.removeEventListener('trigger-voice-command-search' as any, handleVoiceCommandSearch);
      window.removeEventListener('inspect-data-provenance' as any, handleInspectCustomProvenance);
    };
  }, []);

  const handleSelectTab = (tab: PageView) => {
    if (tab === currentTab) return;
    audioFeedback.playViewTransition();
    setIsTransitioning(true);
    startTransition(() => {
      setCurrentTab(tab);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsTransitioning(false);
      audioFeedback.playSyncComplete();
    }, 240);
  };

  const handleInspectProvenance = (prov: DataProvenance) => {
    setProvenanceModalData(prov);
  };

  return (
    <AuthProvider>
      <Web3WalletProvider>
        <OfflineSyncProvider>
          <ContextAwareThemeProvider>
            <MissionAlertProvider>
              <UncertaintyOverlayProvider>
                <TrustLayerProvider>
                  <ActiveMissionProvider>
                    <VerificationToastProvider>
                      <ConfirmationProvider>
                        <BioregionalHazardProvider>
                          <ThemeAndAccessSyncListener>
                            <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#0A0A0A] relative">
            {/* Moral Compass Dynamic Cursor Trail */}
            <MoralCompassCursor 
              moralIntensity={94.8} 
              activeView={currentTab}
            />

            {/* Centralized High-Performance Loading Progress Bar */}
            <GlobalLoadingIndicator 
              isLoading={isTransitioning}
              message={`Loading ${currentTab.replace('-', ' ').toUpperCase()} module...`}
            />

            {/* Primary Sticky Header & Navigation */}
            <Navigation
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              onOpenCommandCenter={() => setCommandCenterOpen(true)}
              onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
              onOpenCommandments={() => setCommandmentsModalOpen(true)}
            />

            {/* Real-Time Unified Cross-Module Mission Pipeline Status Bar */}
            <ActiveMissionStatusBar
              onSelectTab={handleSelectTab}
            />

            {/* Main View Router */}
            <main className="flex-1 w-full relative">
              {isTransitioning ? (
                <ViewLoadingSkeleton 
                  title={`Accessing ${currentTab.replace('-', ' ').toUpperCase()} Module...`}
                  subtitle="Synchronizing verified multi-scale planetary data, causal models, and epistemic ledgers"
                />
              ) : (
                <Suspense 
                  fallback={
                    <ViewLoadingSkeleton 
                      title={`Accessing ${currentTab.replace('-', ' ').toUpperCase()} Module...`}
                      subtitle="Synchronizing verified multi-scale planetary data, causal models, and epistemic ledgers"
                    />
                  }
                >
                  {currentTab === 'steward' && (
                    <AtlasStewardView onSelectTab={handleSelectTab} />
                  )}

                  {currentTab === 'home' && (
                    <AtlasHomeView
                      onSelectTab={handleSelectTab}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'sentinel' && (
                    <SentinelView />
                  )}

                  {currentTab === 'agent-mission-control' && (
                    <AgentMissionControlView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                      onOpenSystemsModeler={() => handleSelectTab('system-model-studio')}
                    />
                  )}

                  {currentTab === 'ai-engineering' && (
                    <AIEngineeringView />
                  )}

                  {currentTab === 'system-model-studio' && (
                    <SystemModelStudioView
                      onNavigateToMissionControl={() => handleSelectTab('agent-mission-control')}
                      onInitiateMissionWithIntervention={() => handleSelectTab('agent-mission-control')}
                    />
                  )}

                  {currentTab === 'opportunity-intelligence' && (
                    <OpportunityIntelligenceView
                      onSelectTab={handleSelectTab}
                      onOpenProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'decision-room' && (
                    <DecisionRoomView
                      onSelectTab={handleSelectTab}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'reality-engine' && (
                    <RealityEngineView
                      onSelectTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'bioregional-twin' && (
                    <BioregionalTwinView
                      onSelectTab={handleSelectTab}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'bioregional-ledger' && (
                    <BioregionalLedgerView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'living-reality' && (
                    <LivingRealityView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'moral-arbiter' && (
                    <MoralArbiterView
                      onSelectTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'opportunity-matchmaker' && (
                    <OpportunityMatchmakerView
                      onSelectTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'project-os' && (
                    <ProjectOsView
                      onSelectTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'flourishing-index' && (
                    <FlourishingIndexView
                      onSelectTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'capital-engine' && (
                    <CapitalEngineView
                      onSelectTab={handleSelectTab}
                    />
                  )}

                  {currentTab === 'opportunity-graph' && (
                    <OpportunityGraphView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                    />
                  )}

                  {currentTab === 'evidence-ledger' && (
                    <EvidenceLedgerView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                    />
                  )}

                  {currentTab === 'field-labs' && (
                    <FieldLabsView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                    />
                  )}

                  {currentTab === 'observatory' && (
                    <ObservatoryView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                    />
                  )}

                  {currentTab === 'multimodal-studio' && (
                    <MultimodalStudioView
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'studio' && (
                    <StudioView
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                    />
                  )}

                  {currentTab === 'marketplace' && (
                    <MarketplaceView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'lifehouse' && (
                    <LifeHouseView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'industrial' && (
                    <IndustrialView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'moral-intelligence' && (
                    <MoralIntelligenceView
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                    />
                  )}

                  {currentTab === 'impact-dashboard' && (
                    <ImpactDashboardView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {(currentTab === 'academy' || currentTab === 'research' || currentTab === 'commons') && (
                    <AcademyCommonsView
                      onInspectProvenance={handleInspectProvenance}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'developers' && (
                    <DevelopersSdkView />
                  )}

                  {currentTab === 'about' && (
                    <AboutGovernanceView
                      onSelectTab={handleSelectTab}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'economics-pricing' && (
                    <EconomicsPricingView
                      onSelectTab={handleSelectTab}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'analytics-report' && (
                    <AnalyticsReportView />
                  )}

                  {currentTab === 'regenerative-mission' && (
                    <RegenerativeMissionView
                      onSelectTab={handleSelectTab}
                      onOpenProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'failure-ledger' && (
                    <FailureLedgerView
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'ethics-review' && (
                    <EthicsReviewView
                      onOpenCommandments={() => setCommandmentsModalOpen(true)}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                    />
                  )}

                  {currentTab === 'mission-analytics' && (
                    <MissionPerformanceAnalyticsView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'evidence-mapping' && (
                    <EvidenceMappingView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'stewardship-reputation' && (
                    <StewardshipReputationView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'events' && (
                    <EventsView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'stories' && (
                    <StoriesView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'resources' && (
                    <ResourcesView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'governance' && (
                    <GovernanceHubView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}
                </Suspense>
              )}
            </main>

            {/* Global Comprehensive Civilization Footer */}
            <Footer
              onSelectTab={handleSelectTab}
              onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
              onOpenCommandCenter={() => setCommandCenterOpen(true)}
              onOpenCommandments={() => setCommandmentsModalOpen(true)}
            />

            {/* Floating Welcome & Platform Orientation Guide */}
            <FloatingWelcomeBanner
              onSelectTab={handleSelectTab}
              onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
              onOpenCommandments={() => setCommandmentsModalOpen(true)}
              onOpenCommandCenter={() => setCommandCenterOpen(true)}
            />

            {/* Secondary Utility Modals & Drawers wrapped in Suspense */}
            <Suspense fallback={null}>
              {/* Mission Alert Notification Slide-over Drawer */}
              <MissionAlertDrawer 
                onSelectTab={handleSelectTab}
                onInspectProvenance={handleInspectProvenance}
              />

              {/* 10 Commandments of Architecture Modal */}
              <CommandmentsModal
                isOpen={commandmentsModalOpen}
                onClose={() => setCommandmentsModalOpen(false)}
              />

              {/* Multi-Turn Gemini Chatbot Modal */}
              <GeminiChatModal
                isOpen={geminiChatOpen}
                onClose={() => setGeminiChatOpen(false)}
              />

              {/* Guided Platform Tour Overlay */}
              <PlatformTourOverlay
                isOpen={platformTourOpen}
                onClose={() => setPlatformTourOpen(false)}
                onSelectTab={handleSelectTab}
              />

              {/* Live Voice Streaming Modal */}
              <LiveVoiceModal
                isOpen={liveVoiceOpen}
                onClose={() => setLiveVoiceOpen(false)}
                onTriggerCommandCenterSearch={(query) => {
                  setLiveVoiceOpen(false);
                  setCommandCenterInitialQuery(query);
                  setCommandCenterOpen(true);
                }}
              />

              {/* Global AI Command Center Modal (⌘K) */}
              <CommandCenterModal
                isOpen={commandCenterOpen}
                initialQuery={commandCenterInitialQuery}
                onClose={() => {
                  setCommandCenterOpen(false);
                  setCommandCenterInitialQuery('');
                }}
                onSelectProject={(proj) => {
                  setCommandCenterOpen(false);
                  handleSelectTab('observatory');
                }}
              />

              {/* Global Moral Intelligence Policy Evaluator Modal */}
              <MoralScorecardModal
                isOpen={moralSimulatorOpen}
                onClose={() => setMoralSimulatorOpen(false)}
              />

              {/* Global Epistemic Data Provenance Modal */}
              <DataProvenanceModal
                provenance={provenanceModalData}
                isOpen={!!provenanceModalData}
                onClose={() => setProvenanceModalData(null)}
              />

              {/* Global Epistemic Search Modal (Triggered by /) */}
              <GlobalEpistemicSearch
                isOpen={globalSearchOpen}
                onClose={() => setGlobalSearchOpen(false)}
                onSelectTab={handleSelectTab}
              />

              {/* Global Keyboard Shortcuts Modal (Triggered by ?) */}
              <KeyboardShortcutsModal
                isOpen={shortcutsModalOpen}
                onClose={() => setShortcutsModalOpen(false)}
                onSelectTab={handleSelectTab}
              />

              {/* Mini Floating Newsletter & Research Dispatch Widget */}
              <FloatingNewsletterWidget
                onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
              />

              {/* Mini Sovereign Cookie & Trust Layer Banner (Docked on Left) */}
              <TrustLayerBanner />

              {/* SpeechRecognition-powered Voice Command Modal */}
              <VoiceCommandModal
                isOpen={voiceCommandOpen}
                onClose={() => setVoiceCommandOpen(false)}
                onSelectTab={handleSelectTab}
              />

              {/* Central Master 12-Pillar Trust Layer Modal */}
              <TrustLayerModal />
            </Suspense>

            {/* Real-time Render & Performance Telemetry HUD */}
            <PerformanceMonitorOverlay />

            {/* Blockchain-backed Epistemic Ledger Verification Notification Toasts */}
            <VerificationNotificationContainer />
          </div>
        </ThemeAndAccessSyncListener>
        </BioregionalHazardProvider>
        </ConfirmationProvider>
        </VerificationToastProvider>
        </ActiveMissionProvider>
        </TrustLayerProvider>
        </UncertaintyOverlayProvider>
        </MissionAlertProvider>
        </ContextAwareThemeProvider>
        </OfflineSyncProvider>
        </Web3WalletProvider>
    </AuthProvider>
  );
}
