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
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      msg.includes('User rejected') ||
      msg.includes('Failed to connect')
    ) {
      console.warn('[Atlas Web3 Notice] Captured provider event:', msg);
      // Prevent crash / console dump for browser extension injection rejections
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

