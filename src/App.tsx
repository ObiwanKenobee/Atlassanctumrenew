import React, { useState, useEffect, Suspense, startTransition } from 'react';
import { PageView, DataProvenance } from './types';
import { AuthProvider } from './context/AuthContext';
import { MissionAlertProvider } from './context/MissionAlertContext';
import { UncertaintyOverlayProvider } from './context/UncertaintyOverlayContext';
import { OfflineSyncProvider } from './context/OfflineSyncContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { GlobalLoadingIndicator } from './components/GlobalLoadingIndicator';
import { ViewLoadingSkeleton } from './components/ViewLoadingSkeleton';
import { CommandmentsModal } from './components/CommandmentsModal';
import { CommandCenterModal } from './components/CommandCenterModal';
import { MoralScorecardModal } from './components/MoralScorecardModal';
import { DataProvenanceModal } from './components/DataProvenanceModal';
import { FloatingNewsletterWidget } from './components/FloatingNewsletterWidget';
import { FloatingWelcomeBanner } from './components/FloatingWelcomeBanner';
import { GeminiChatModal } from './components/GeminiChatModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { ThemeAndAccessSyncListener } from './components/ThemeAndAccessSyncListener';
import { MoralCompassCursor } from './components/MoralCompassCursor';
import { MissionAlertDrawer } from './components/MissionAlertDrawer';
import { GlobalEpistemicSearch } from './components/GlobalEpistemicSearch';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { audioFeedback } from './lib/audioFeedback';
import { prefetchPriorityViews, prefetchView } from './lib/viewPrefetch';
import { registerServiceWorker } from './lib/serviceWorkerRegistration';

// Lazy-Loaded Views for instant code-splitting and progressive delivery
const AtlasHomeView = React.lazy(() => import('./components/views/AtlasHomeView').then(m => ({ default: m.AtlasHomeView })));
const AgentMissionControlView = React.lazy(() => import('./components/views/AgentMissionControlView').then(m => ({ default: m.AgentMissionControlView })));
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageView>('home');
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [moralSimulatorOpen, setMoralSimulatorOpen] = useState(false);
  const [commandmentsModalOpen, setCommandmentsModalOpen] = useState(false);
  const [geminiChatOpen, setGeminiChatOpen] = useState(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState(false);
  const [provenanceModalData, setProvenanceModalData] = useState<DataProvenance | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        }
      }
    };

    const handleOpenChat = () => setGeminiChatOpen(true);
    const handleOpenVoice = () => setLiveVoiceOpen(true);
    const handleOpenCommandments = () => setCommandmentsModalOpen(true);
    const handleOpenSearch = () => setGlobalSearchOpen(true);
    const handleOpenShortcuts = () => setShortcutsModalOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-gemini-chat', handleOpenChat);
    window.addEventListener('open-live-voice', handleOpenVoice);
    window.addEventListener('open-commandments', handleOpenCommandments);
    window.addEventListener('open-global-search', handleOpenSearch);
    window.addEventListener('open-keyboard-shortcuts', handleOpenShortcuts);

    // Proactively prefetch priority modules on idle
    prefetchPriorityViews();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-gemini-chat', handleOpenChat);
      window.removeEventListener('open-live-voice', handleOpenVoice);
      window.removeEventListener('open-commandments', handleOpenCommandments);
      window.removeEventListener('open-global-search', handleOpenSearch);
      window.removeEventListener('open-keyboard-shortcuts', handleOpenShortcuts);
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
      <OfflineSyncProvider>
        <MissionAlertProvider>
          <UncertaintyOverlayProvider>
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
                  {currentTab === 'home' && (
                    <AtlasHomeView
                      onSelectTab={handleSelectTab}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onInspectProvenance={handleInspectProvenance}
                    />
                  )}

                  {currentTab === 'agent-mission-control' && (
                    <AgentMissionControlView
                      onSelectTab={handleSelectTab}
                      onInspectProvenance={handleInspectProvenance}
                      onOpenSystemsModeler={() => handleSelectTab('system-model-studio')}
                    />
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

            {/* Live Voice Streaming Modal */}
            <LiveVoiceModal
              isOpen={liveVoiceOpen}
              onClose={() => setLiveVoiceOpen(false)}
            />

            {/* Global AI Command Center Modal (⌘K) */}
            <CommandCenterModal
              isOpen={commandCenterOpen}
              onClose={() => setCommandCenterOpen(false)}
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
          </div>
        </ThemeAndAccessSyncListener>
        </UncertaintyOverlayProvider>
      </MissionAlertProvider>
      </OfflineSyncProvider>
    </AuthProvider>
  );
}
