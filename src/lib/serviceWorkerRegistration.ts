/**
 * Service Worker Registration & Epistemic Offline Cache Coordinator
 */

export interface SyncStatus {
  isRegistered: boolean;
  isOffline: boolean;
  lastCachedAt: string | null;
}

export function registerServiceWorker(onUpdate?: (registration: ServiceWorkerRegistration) => void): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[Atlas SW] Service Worker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[Atlas SW] New content available; please refresh.');
                  if (onUpdate) onUpdate(registration);
                } else {
                  console.log('[Atlas SW] Content cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[Atlas SW] Service Worker registration failed:', error);
        });
    });
  }
}

export function unregisterServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
