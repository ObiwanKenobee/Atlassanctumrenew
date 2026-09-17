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
import { AdaptiveModeProvider } from './context/AdaptiveModeContext';
import { AdaptiveLightingProvider } from './context/AdaptiveLightingContext';
import { ContextualNotificationProvider } from './context/ContextualNotificationContext';
import { ContextualNotificationClearConfirmModal } from './components/navigation/ContextualNotificationClearConfirmModal';
import { MoralCompassCursor } from './components/MoralCompassCursor';
import { TrustLayerBanner } from './components/trust/TrustLayerBanner';
import { VerificationToastProvider } from './context/VerificationToastContext';
import { VerificationNotificationContainer } from './components/verification/VerificationNotificationContainer';
import { BioregionalHazardProvider } from './context/BioregionalHazardContext';
import { BioregionalAlertSystem } from './components/bioregional/BioregionalAlertSystem';
import { AmbientSeasonalityOverlay } from './components/AmbientSeasonalityOverlay';
import { audioFeedback } from './lib/audioFeedback';
import { prefetchPriorityViews, prefetchView } from './lib/viewPrefetch';
import { registerServiceWorker } from './lib/serviceWorkerRegistration';
import { PerformanceMonitorOverlay } from './components/performance/PerformanceMonitorOverlay';
import { useMetadataManager } from './hooks/useMetadataManager';
import {
  checkViewAccess,
  getCurrentSubscription,
  SubscriptionTier,
  ActiveSubscriptionState
} from './lib/subscriptionManager';
import { TierRestrictionGate } from './components/subscription/TierRestrictionGate';
import { PaymentCheckoutModal } from './components/subscription/PaymentCheckoutModal';

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
const GoogleSitelinksEnhancementModal = React.lazy(() => import('./components/seo/GoogleSitelinksEnhancementModal').then(m => ({ default: m.GoogleSitelinksEnhancementModal })));
const StartupErrorOverlay = React.lazy(() => import('./components/diagnostics/StartupErrorOverlay').then(m => ({ default: m.StartupErrorOverlay })));
const AchievementCelebrationModal = React.lazy(() => import('./components/achievements/AchievementCelebrationModal').then(m => ({ default: m.AchievementCelebrationModal })));
const StarMapView = React.lazy(() => import('./components/StarMapView').then(m => ({ default: m.StarMapView })));
const PlanetaryOracleDrawer = React.lazy(() => import('./components/navigation/PlanetaryOracleDrawer').then(m => ({ default: m.PlanetaryOracleDrawer })));

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
const CitizenProfileView = React.lazy(() => import('./components/views/CitizenProfileView').then(m => ({ default: m.CitizenProfileView })));
const AlchemicalStudioView = React.lazy(() => import('./views/AlchemicalStudioView').then(m => ({ default: m.AlchemicalStudioView })));

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageView>('home');
  // Dynamic page-level metadata manager for search engine crawling & rich snippets
  useMetadataManager(currentTab);

  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [moralSimulatorOpen, setMoralSimulatorOpen] = useState(false);
  const [commandmentsModalOpen, setCommandmentsModalOpen] = useState(false);
  const [geminiChatOpen, setGeminiChatOpen] = useState(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState(false);
  const [voiceCommandOpen, setVoiceCommandOpen] = useState(false);
  const [platformTourOpen, setPlatformTourOpen] = useState(false);
  const [googleSitelinksOpen, setGoogleSitelinksOpen] = useState(false);
  const [starMapOpen, setStarMapOpen] = useState(false);
  const [oracleDrawerOpen, setOracleDrawerOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [commandCenterInitialQuery, setCommandCenterInitialQuery] = useState<string>('');
  const [provenanceModalData, setProvenanceModalData] = useState<DataProvenance | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Active economic capacity tier & checkout modal orchestration
  const [subscriptionState, setSubscriptionState] = useState<ActiveSubscriptionState>(() => getCurrentSubscription());
  const [checkoutModalState, setCheckoutModalState] = useState<{ isOpen: boolean; tier: SubscriptionTier }>({
    isOpen: false,
    tier: 'studio'
  });

  useEffect(() => {
    const handleSubChange = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveSubscriptionState>;
      setSubscriptionState(customEvent.detail || getCurrentSubscription());
    };
    window.addEventListener('atlas-subscription-changed', handleSubChange);
    return () => window.removeEventListener('atlas-subscription-changed', handleSubChange);
  }, []);

  // Ingress handling for Google Search Results Sitelinks / Searchbox query parameters (?q=..., ?search=..., ?view=..., ?sitelink=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get('q') || params.get('search') || params.get('query');
      const viewParam = params.get('view') || params.get('tab') || params.get('sitelink');
      const openSitelinksParam = params.get('sitelinks_preview') || params.get('serp') || params.get('sitelinks');

      if (viewParam) {
        const validTab = viewParam as PageView;
        setCurrentTab(validTab);
        audioFeedback.playViewTransition();
      }

      if (searchParam) {
        const cleanSearch = decodeURIComponent(searchParam).trim();
        setSearchInitialQuery(cleanSearch);
        setGlobalSearchOpen(true);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('global-epistemic-search-query', { detail: { query: cleanSearch } }));
        }, 80);
      }

      if (openSitelinksParam === 'true' || openSitelinksParam === '1') {
        setGoogleSitelinksOpen(true);
      }
    } catch (err) {
      console.error('Failed to parse incoming Google Search Sitelinks URL parameters:', err);
    }
  }, []);

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
        } else if (e.key === '*' || (e.shiftKey && e.key === '8') || ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's')) {
          e.preventDefault();
          setStarMapOpen((prev) => !prev);
        } else if (e.key.toLowerCase() === 'o' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setOracleDrawerOpen((prev) => !prev);
        }
      }
    };

    const handleOpenChat = () => setGeminiChatOpen(true);
    const handleOpenVoice = () => setLiveVoiceOpen(true);
    const handleOpenVoiceCommand = () => setVoiceCommandOpen(true);
    const handleOpenCommandments = () => setCommandmentsModalOpen(true);
    const handleOpenSearch = () => setGlobalSearchOpen(true);
    const handleOpenShortcuts = () => setShortcutsModalOpen(true);
    const handleOpenStarMap = () => setStarMapOpen(true);
    const handleOpenOracle = () => setOracleDrawerOpen(true);
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
    window.addEventListener('open-star-map', handleOpenStarMap);
    window.addEventListener('open-bioregional-oracle', handleOpenOracle);
    window.addEventListener('atlas-reset-to-home', handleResetToHome);
    window.addEventListener('trigger-voice-command-search' as any, handleVoiceCommandSearch);
    const handleOpenTour = () => setPlatformTourOpen(true);
    const handleOpenGoogleSitelinks = () => setGoogleSitelinksOpen(true);
    const handleNavigateTab = (e: any) => {
      if (e.detail?.tab) {
        handleSelectTab(e.detail.tab);
      }
    };
    window.addEventListener('open-platform-tour', handleOpenTour);
    window.addEventListener('open-google-sitelinks-enhancement', handleOpenGoogleSitelinks);
    window.addEventListener('atlas-navigate-tab' as any, handleNavigateTab);
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
      window.removeEventListener('open-star-map', handleOpenStarMap);
      window.removeEventListener('open-bioregional-oracle', handleOpenOracle);
      window.removeEventListener('open-platform-tour', handleOpenTour);
      window.removeEventListener('open-google-sitelinks-enhancement', handleOpenGoogleSitelinks);
      window.removeEventListener('atlas-navigate-tab' as any, handleNavigateTab);
      window.removeEventListener('atlas-reset-to-home', handleResetToHome);
      window.removeEventListener('trigger-voice-command-search' as any, handleVoiceCommandSearch);
      window.removeEventListener('inspect-data-provenance' as any, handleInspectCustomProvenance);
    };
  }, []);

  const handleSelectTab = (tab: PageView) => {
    if (tab === currentTab) return;
    audioFeedback.playViewTransition();
    setIsTransitioning(true);

    // Maintain canonical URL parameters for Google Sitelinks & search engine indexing
    try {
      const url = new URL(window.location.href);
      if (tab === 'home') {
        url.searchParams.delete('view');
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('view', tab);
      }
      window.history.pushState({ tab }, '', url.toString());
      (window as any).__atlas_current_view = tab;
    } catch {
      // Ignore in sandboxed environments
    }

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
                          <AdaptiveModeProvider>
                            <AdaptiveLightingProvider>
                              <ContextualNotificationProvider>
                                <ThemeAndAccessSyncListener>
                              <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#0A0A0A] relative">
            {/* Moral Compass Dynamic Cursor Trail */}
            <MoralCompassCursor 
              moralIntensity={94.8} 
              activeView={currentTab}
            />

            {/* Ambient Seasonality Overlay - Evoking Planetary Time via Subtle Color Shift */}
            <AmbientSeasonalityOverlay />

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
              onOpenStarMap={() => setStarMapOpen(true)}
              onOpenOracle={() => setOracleDrawerOpen(true)}
            />

            {/* Non-Intrusive Bioregional Stress Alert Notification Banner */}
            <BioregionalAlertSystem onSelectTab={handleSelectTab} />

            {/* Real-Time Unified Cross-Module Mission Pipeline Status Bar */}
            <ActiveMissionStatusBar
              onSelectTab={handleSelectTab}
            />

            {/* Main View Router */}
            <main className="flex-1 w-full relative">
              {(() => {
                const accessCheck = checkViewAccess(currentTab, subscriptionState.currentTier);

                if (!accessCheck.allowed) {
                  return (
                    <TierRestrictionGate
                      targetView={currentTab}
                      requiredTier={accessCheck.requiredTier}
                      onOpenCheckout={(tier) => {
                        setCheckoutModalState({ isOpen: true, tier });
                      }}
                      onNavigateToPricing={() => handleSelectTab('economics-pricing')}
                      onNavigateToCommons={() => handleSelectTab('commons')}
                      onUnlockSuccess={() => {
                        setSubscriptionState(getCurrentSubscription());
                      }}
                    />
                  );
                }

                if (isTransitioning) {
                  return (
                    <ViewLoadingSkeleton 
                      title={`Accessing ${currentTab.replace('-', ' ').toUpperCase()} Module...`}
                      subtitle="Synchronizing verified multi-scale planetary data, causal models, and epistemic ledgers"
                    />
                  );
                }

                return (
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
                      onSelectTab={(tab) => setCurrentTab(tab as any)}
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

                  {currentTab === 'citizen-profile' && (
                    <CitizenProfileView
                      onSelectTab={handleSelectTab}
                      onOpenMoralSimulator={() => setMoralSimulatorOpen(true)}
                      onOpenCommandCenter={() => setCommandCenterOpen(true)}
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

                  {currentTab === 'alchemical-sanctum' && (
                    <AlchemicalStudioView />
                  )}
                </Suspense>
              );
            })()}
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
                initialQuery={searchInitialQuery}
              />

              {/* Google Search Results Sitelinks & SERP Enhancement Center */}
              <GoogleSitelinksEnhancementModal
                isOpen={googleSitelinksOpen}
                onClose={() => setGoogleSitelinksOpen(false)}
                onNavigateTab={handleSelectTab}
                activeView={currentTab}
                onExecuteSearch={(query) => {
                  setSearchInitialQuery(query);
                  setGlobalSearchOpen(true);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('global-epistemic-search-query', { detail: { query } }));
                  }, 60);
                }}
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

              {/* Contextual Notification Clear Confirmation Modal (Steward Gate) */}
              <ContextualNotificationClearConfirmModal />

              {/* Central Master 12-Pillar Trust Layer Modal */}
              <TrustLayerModal />

              {/* Global Subscription Checkout & Multiple Payment Methods Modal */}
              <PaymentCheckoutModal
                isOpen={checkoutModalState.isOpen}
                onClose={() => setCheckoutModalState(prev => ({ ...prev, isOpen: false }))}
                initialTier={checkoutModalState.tier}
                onSuccess={() => {
                  setSubscriptionState(getCurrentSubscription());
                }}
              />

              {/* System Health & Startup Diagnostics Error Overlay */}
              <StartupErrorOverlay />

              {/* In-App Milestone Celebrations & Achievement Badges Drawer */}
              <AchievementCelebrationModal />

              {/* Hidden Celestial Star Map (Constellations of Verified Impact Projects - Triggered by *) */}
              <StarMapView
                isOpen={starMapOpen}
                onClose={() => setStarMapOpen(false)}
                onSelectTab={handleSelectTab}
              />

              {/* Planetary Oracle Sidebar Drawer (Poetic Telemetry & Stewardship Lens) */}
              <PlanetaryOracleDrawer
                isOpen={oracleDrawerOpen}
                onClose={() => setOracleDrawerOpen(false)}
                onSelectTab={handleSelectTab}
              />
            </Suspense>

            {/* Real-time Render & Performance Telemetry HUD */}
            <PerformanceMonitorOverlay onSelectTab={handleSelectTab} />

            {/* Blockchain-backed Epistemic Ledger Verification Notification Toasts */}
            <VerificationNotificationContainer />
          </div>
        </ThemeAndAccessSyncListener>
        </ContextualNotificationProvider>
        </AdaptiveLightingProvider>
        </AdaptiveModeProvider>
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
