import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('recharts') || id.includes('d3') || id.includes('canvas-confetti')) {
                return 'vendor-charts';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('idb') || id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'vendor-utils';
              }
              return 'vendor-libs';
            }

            // Domain-specific chunking for lazy-loaded views to optimize Vercel delivery
            if (id.includes('/src/components/views/')) {
              if (
                id.includes('AIEngineeringView') ||
                id.includes('AgentMissionControlView') ||
                id.includes('MultimodalStudioView') ||
                id.includes('StudioView')
              ) {
                return 'views-ai-engine';
              }
              if (
                id.includes('GovernanceHubView') ||
                id.includes('MoralArbiterView') ||
                id.includes('MoralIntelligenceView') ||
                id.includes('AboutGovernanceView') ||
                id.includes('EthicsReviewView')
              ) {
                return 'views-governance';
              }
              if (
                id.includes('OpportunityIntelligenceView') ||
                id.includes('OpportunityGraphView') ||
                id.includes('OpportunityMatchmakerView') ||
                id.includes('ObservatoryView') ||
                id.includes('SystemModelStudioView') ||
                id.includes('DecisionRoomView')
              ) {
                return 'views-intelligence';
              }
              if (
                id.includes('EvidenceLedgerView') ||
                id.includes('EvidenceMappingView') ||
                id.includes('FieldLabsView') ||
                id.includes('FailureLedgerView') ||
                id.includes('ProjectOsView') ||
                id.includes('RegenerativeMissionView') ||
                id.includes('StewardshipReputationView') ||
                id.includes('MissionPerformanceAnalyticsView')
              ) {
                return 'views-operations';
              }
              if (
                id.includes('BioregionalTwinView') ||
                id.includes('LivingRealityView') ||
                id.includes('RealityEngineView') ||
                id.includes('CapitalEngineView') ||
                id.includes('FlourishingIndexView') ||
                id.includes('LifeHouseView') ||
                id.includes('IndustrialView') ||
                id.includes('ImpactDashboardView')
              ) {
                return 'views-bioregion-capital';
              }
              return 'views-atlas-commons';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
