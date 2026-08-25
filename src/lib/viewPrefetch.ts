import React from 'react';

// View component loaders map for on-demand prefetching & lazy loading
export const VIEW_LOADERS = {
  'home': () => import('../components/views/AtlasHomeView').then(m => ({ default: m.AtlasHomeView })),
  'opportunity-intelligence': () => import('../components/views/OpportunityIntelligenceView').then(m => ({ default: m.OpportunityIntelligenceView })),
  'decision-room': () => import('../components/views/DecisionRoomView').then(m => ({ default: m.DecisionRoomView })),
  'opportunity-graph': () => import('../components/views/OpportunityGraphView').then(m => ({ default: m.OpportunityGraphView })),
  'evidence-ledger': () => import('../components/views/EvidenceLedgerView').then(m => ({ default: m.EvidenceLedgerView })),
  'field-labs': () => import('../components/views/FieldLabsView').then(m => ({ default: m.FieldLabsView })),
  'project-os': () => import('../components/views/ProjectOsView').then(m => ({ default: m.ProjectOsView })),
  'flourishing-index': () => import('../components/views/FlourishingIndexView').then(m => ({ default: m.FlourishingIndexView })),
  'capital-engine': () => import('../components/views/CapitalEngineView').then(m => ({ default: m.CapitalEngineView })),
  'reality-engine': () => import('../components/views/RealityEngineView').then(m => ({ default: m.RealityEngineView })),
  'bioregional-twin': () => import('../components/views/BioregionalTwinView').then(m => ({ default: m.BioregionalTwinView })),
  'living-reality': () => import('../components/views/LivingRealityView').then(m => ({ default: m.LivingRealityView })),
  'moral-arbiter': () => import('../components/views/MoralArbiterView').then(m => ({ default: m.MoralArbiterView })),
  'opportunity-matchmaker': () => import('../components/views/OpportunityMatchmakerView').then(m => ({ default: m.OpportunityMatchmakerView })),
  'observatory': () => import('../components/views/ObservatoryView').then(m => ({ default: m.ObservatoryView })),
  'studio': () => import('../components/views/StudioView').then(m => ({ default: m.StudioView })),
  'multimodal-studio': () => import('../components/views/MultimodalStudioView').then(m => ({ default: m.MultimodalStudioView })),
  'marketplace': () => import('../components/views/MarketplaceView').then(m => ({ default: m.MarketplaceView })),
  'lifehouse': () => import('../components/views/LifeHouseView').then(m => ({ default: m.LifeHouseView })),
  'industrial': () => import('../components/views/IndustrialView').then(m => ({ default: m.IndustrialView })),
  'moral-intelligence': () => import('../components/views/MoralIntelligenceView').then(m => ({ default: m.MoralIntelligenceView })),
  'impact-dashboard': () => import('../components/views/ImpactDashboardView').then(m => ({ default: m.ImpactDashboardView })),
  'academy': () => import('../components/views/AcademyCommonsView').then(m => ({ default: m.AcademyCommonsView })),
  'commons': () => import('../components/views/AcademyCommonsView').then(m => ({ default: m.AcademyCommonsView })),
  'research': () => import('../components/views/AcademyCommonsView').then(m => ({ default: m.AcademyCommonsView })),
  'developers': () => import('../components/views/DevelopersSdkView').then(m => ({ default: m.DevelopersSdkView })),
  'about': () => import('../components/views/AboutGovernanceView').then(m => ({ default: m.AboutGovernanceView })),
  'regenerative-mission': () => import('../components/views/RegenerativeMissionView').then(m => ({ default: m.RegenerativeMissionView })),
  'failure-ledger': () => import('../components/views/FailureLedgerView').then(m => ({ default: m.FailureLedgerView })),
  'ethics-review': () => import('../components/views/EthicsReviewView').then(m => ({ default: m.EthicsReviewView })),
  'mission-analytics': () => import('../components/views/MissionPerformanceAnalyticsView').then(m => ({ default: m.MissionPerformanceAnalyticsView })),
  'evidence-mapping': () => import('../components/views/EvidenceMappingView').then(m => ({ default: m.EvidenceMappingView })),
  'stewardship-reputation': () => import('../components/views/StewardshipReputationView').then(m => ({ default: m.StewardshipReputationView }))
};

// Set of already fetched or in-flight chunk promises
const prefetchedModules = new Set<string>();

/**
 * Proactively prefetch a view module in the background
 * Safe to call on hover, focus, or during idle periods
 */
export function prefetchView(viewKey: keyof typeof VIEW_LOADERS): void {
  if (prefetchedModules.has(viewKey)) return;
  const loader = VIEW_LOADERS[viewKey];
  if (loader) {
    prefetchedModules.add(viewKey);
    // Execute dynamic import in background without blocking main thread
    loader().catch(err => {
      // Allow retry if network failed
      prefetchedModules.delete(viewKey);
      console.warn(`[Prefetch] Failed to preload view ${viewKey}:`, err);
    });
  }
}

/**
 * Prefetch top likely next views when the browser is idle
 */
export function prefetchPriorityViews(): void {
  const priorityViews: Array<keyof typeof VIEW_LOADERS> = [
    'opportunity-intelligence',
    'decision-room',
    'reality-engine',
    'ethics-review',
    'capital-engine',
    'living-reality'
  ];

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      priorityViews.forEach(v => prefetchView(v));
    });
  } else {
    setTimeout(() => {
      priorityViews.forEach(v => prefetchView(v));
    }, 2000);
  }
}
