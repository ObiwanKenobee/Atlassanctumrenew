import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

/**
 * Robust server error handler plugin that intercepts port binding
 * and network socket failures, outputting actionable troubleshooting steps.
 */
function serverErrorHandlerPlugin(): Plugin {
  const printActionableError = (err: any, port: number | string = 3000, context = 'Dev Server') => {
    const isAddrInUse = err?.code === 'EADDRINUSE';
    const isPermissionDenied = err?.code === 'EACCES';

    console.error('\n' + '='.repeat(70));
    console.error(`  [VITE ${context.toUpperCase()} ERROR] Port Binding Failure`);
    console.error('='.repeat(70));
    console.error(`  Error Code : ${err?.code || 'UNKNOWN'}`);
    console.error(`  Target Port: ${port}`);
    console.error(`  Message    : ${err?.message || 'Failed to bind HTTP server to designated port'}`);
    console.error('-'.repeat(70));
    console.error('  ACTIONABLE TROUBLESHOOTING STEPS:');

    if (isAddrInUse) {
      console.error(`  1. Port ${port} is currently in use by another process.`);
      console.error(`     - Run \`lsof -i :${port}\` or \`fuser ${port}/tcp\` to identify the process PID.`);
      console.error(`     - Terminate the lingering process using: \`kill -9 <PID>\` or \`fuser -k ${port}/tcp\`.`);
      console.error(`  2. In Express + Vite Full-Stack architecture:`);
      console.error(`     - Ensure \`tsx server.ts\` is running (Express mounts Vite in middleware mode).`);
      console.error(`     - Avoid starting a second standalone \`vite\` process on port ${port}.`);
      console.error(`  3. Container & Cloud Run Environment Context:`);
      console.error(`     - Port 3000 is the hardcoded entry point for the container nginx reverse proxy.`);
      console.error(`     - If dev server state is stale, trigger a restart via the dev server manager.`);
    } else if (isPermissionDenied) {
      console.error(`  1. Permission denied binding to port ${port} (EACCES).`);
      console.error(`     - Binding to privileged ports (< 1024) requires elevated privileges.`);
      console.error(`     - Verify non-root user permissions and socket configuration.`);
    } else {
      console.error(`  1. Check process socket state and loopback interface bindings.`);
      console.error(`  2. Verify firewall and process ownership.`);
    }

    console.error('  4. Run the pre-flight health check to verify environment variables:');
    console.error('     - Run \`npm run healthcheck\`');
    console.error('='.repeat(70) + '\n');
  };

  return {
    name: 'server-port-error-handler',
    configureServer(server) {
      server.httpServer?.on('error', (err: any) => {
        const port = server.config.server.port || 3000;
        printActionableError(err, port, 'Vite Dev Server');
      });
    },
    configurePreviewServer(server) {
      server.httpServer?.on('error', (err: any) => {
        const port = server.config.preview.port || 3000;
        printActionableError(err, port, 'Vite Preview Server');
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverErrorHandlerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

