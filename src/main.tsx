import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import './index.css';

// Guard against third-party extension (e.g. MetaMask / Web3 provider) unhandled rejections in sandboxed iframes
if (typeof window !== 'undefined') {
  // Clear any legacy route caches on fresh load to guarantee landing on home view
  try {
    sessionStorage.removeItem('atlas_transient_error');
  } catch {
    // Ignore storage issues
  }

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || String(reason || '');
    if (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      msg.includes('User rejected') ||
      msg.includes('Failed to connect') ||
      msg.includes('auth/cancelled-popup-request') ||
      msg.includes('auth/popup-blocked') ||
      msg.includes('auth/popup-closed-by-user') ||
      msg.includes('INTERNAL ASSERTION FAILED')
    ) {
      console.warn('[Atlas System Notice] Suppressed non-critical provider rejection:', msg);
      // Prevent crash / unhandled rejection for popup cancellations or extension rejections
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('INTERNAL ASSERTION FAILED') ||
      msg.includes('auth/cancelled-popup-request') ||
      msg.includes('auth/popup-blocked') ||
      msg.includes('auth/popup-closed-by-user')
    ) {
      console.warn('[Atlas System Notice] Suppressed non-critical auth window error:', msg);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
);

