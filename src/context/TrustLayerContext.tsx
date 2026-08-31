import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ConsentSettings,
  AccessibilitySettings,
  TrustSectionId,
  DataRightsRequest,
  DataRightsActionType
} from '../types/trust';
import { audioFeedback } from '../lib/audioFeedback';

interface TrustLayerContextType {
  // Modal & Banner state
  isTrustModalOpen: boolean;
  activeSection: TrustSectionId;
  activePillar: TrustSectionId;
  openTrustModal: (section?: TrustSectionId) => void;
  closeTrustModal: () => void;
  isBannerVisible: boolean;
  dismissBanner: () => void;
  
  // Consent settings & handlers
  consent: ConsentSettings;
  updateConsent: (partial: Partial<ConsentSettings>) => void;
  acceptAllConsent: () => void;
  acceptEssentialOnly: () => void;
  revokeAllConsent: () => void;
  
  // Accessibility settings & handlers
  accessibility: AccessibilitySettings;
  updateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  
  // Data Rights Requests State
  dataRightsRequests: DataRightsRequest[];
  submitDataRightsRequest: (type: DataRightsActionType, details: string) => Promise<string>;
  
  // Plain Language toggle
  plainLanguage: boolean;
  togglePlainLanguage: () => void;
}

const DEFAULT_CONSENT: ConsentSettings = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: true,
  aiDataTraining: false,
  bioregionalLocation: true,
  communications: false,
  telemetryLogging: true,
  timestamp: new Date().toISOString(),
  version: '2026.1',
  hasInteracted: false
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'normal',
  contrastMode: 'standard',
  reducedMotion: false,
  screenReaderOptimized: false,
  captionsEnabled: true,
  soundFeedback: true,
  plainLanguageMode: false,
  keyboardFocusRing: true
};

const INITIAL_REQUESTS: DataRightsRequest[] = [
  {
    id: 'REQ-2026-0814',
    type: 'download',
    requestedAt: '2026-08-14T10:30:00Z',
    status: 'completed',
    details: 'Full JSON Archive of Bioregional Telemetry and Auth Records',
    resolutionTimeEstimate: 'Completed (Instant Cryptographic Archive)',
    verificationHash: '0x8f3c7a91de24b9102b489a29e1c'
  },
  {
    id: 'REQ-2026-0722',
    type: 'restrict',
    requestedAt: '2026-07-22T14:15:00Z',
    status: 'verified',
    details: 'Exclude anonymous aggregate telemetry from third-party cross-correlations',
    resolutionTimeEstimate: 'Enforced at Edge Database Layer'
  }
];

const TrustLayerContext = createContext<TrustLayerContextType | undefined>(undefined);

export const TrustLayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<TrustSectionId>('consent');
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  // Initialize Consent
  const [consent, setConsent] = useState<ConsentSettings>(() => {
    try {
      const saved = localStorage.getItem('atlas_trust_consent');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved consent from localStorage', e);
    }
    return DEFAULT_CONSENT;
  });

  // Initialize Accessibility
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('atlas_accessibility_prefs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved accessibility from localStorage', e);
    }
    return DEFAULT_ACCESSIBILITY;
  });

  // Data Rights Requests State
  const [dataRightsRequests, setDataRightsRequests] = useState<DataRightsRequest[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_data_rights_requests');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse data rights requests', e);
    }
    return INITIAL_REQUESTS;
  });

  // Check if banner should be displayed on initial load
  useEffect(() => {
    if (!consent.hasInteracted) {
      const timer = setTimeout(() => {
        setIsBannerVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [consent.hasInteracted]);

  // Persist consent
  useEffect(() => {
    try {
      localStorage.setItem('atlas_trust_consent', JSON.stringify(consent));
    } catch (e) {
      console.error(e);
    }
  }, [consent]);

  // Persist accessibility & apply DOM classes
  useEffect(() => {
    try {
      localStorage.setItem('atlas_accessibility_prefs', JSON.stringify(accessibility));
      const root = document.documentElement;

      // Font size classes
      root.classList.remove('text-scale-large', 'text-scale-xl');
      if (accessibility.fontSize === 'large') root.classList.add('text-scale-large');
      if (accessibility.fontSize === 'extra-large') root.classList.add('text-scale-xl');

      // Reduced motion
      if (accessibility.reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }

      // Plain language class
      if (accessibility.plainLanguageMode) {
        root.classList.add('plain-language-mode');
      } else {
        root.classList.remove('plain-language-mode');
      }

      // Sound feedback
      audioFeedback.setSoundEnabled?.(accessibility.soundFeedback);
    } catch (e) {
      console.error(e);
    }
  }, [accessibility]);

  // Persist data rights requests
  useEffect(() => {
    try {
      localStorage.setItem('atlas_data_rights_requests', JSON.stringify(dataRightsRequests));
    } catch (e) {
      console.error(e);
    }
  }, [dataRightsRequests]);

  const openTrustModal = useCallback((section?: TrustSectionId) => {
    if (section) {
      setActiveSection(section);
    }
    setIsTrustModalOpen(true);
    audioFeedback.playSubtleClick();
  }, []);

  const closeTrustModal = useCallback(() => {
    setIsTrustModalOpen(false);
    audioFeedback.playMicroTick();
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerVisible(false);
    audioFeedback.playMicroTick();
  }, []);

  const updateConsent = useCallback((partial: Partial<ConsentSettings>) => {
    setConsent(prev => ({
      ...prev,
      ...partial,
      essential: true, // Always required
      timestamp: new Date().toISOString(),
      hasInteracted: true
    }));
  }, []);

  const acceptAllConsent = useCallback(() => {
    const updated: ConsentSettings = {
      essential: true,
      analytics: true,
      marketing: false,
      personalization: true,
      aiDataTraining: false, // Opt-in default for strict ethics
      bioregionalLocation: true,
      communications: true,
      telemetryLogging: true,
      timestamp: new Date().toISOString(),
      version: '2026.1',
      hasInteracted: true
    };
    setConsent(updated);
    setIsBannerVisible(false);
    audioFeedback.playSuccessChime();
  }, []);

  const acceptEssentialOnly = useCallback(() => {
    const updated: ConsentSettings = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
      aiDataTraining: false,
      bioregionalLocation: false,
      communications: false,
      telemetryLogging: false,
      timestamp: new Date().toISOString(),
      version: '2026.1',
      hasInteracted: true
    };
    setConsent(updated);
    setIsBannerVisible(false);
    audioFeedback.playMicroTick();
  }, []);

  const revokeAllConsent = useCallback(() => {
    acceptEssentialOnly();
  }, [acceptEssentialOnly]);

  const updateAccessibility = useCallback((partial: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({
      ...prev,
      ...partial
    }));
    audioFeedback.playMicroTick();
  }, []);

  const submitDataRightsRequest = useCallback(async (type: DataRightsActionType, details: string): Promise<string> => {
    const newId = `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: DataRightsRequest = {
      id: newId,
      type,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      details,
      resolutionTimeEstimate: 'Under cryptographic verification (~2-4 minutes)',
      verificationHash: `0x${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    setDataRightsRequests(prev => [newReq, ...prev]);
    audioFeedback.playSuccessChime();
    return newId;
  }, []);

  const togglePlainLanguage = useCallback(() => {
    updateAccessibility({ plainLanguageMode: !accessibility.plainLanguageMode });
  }, [accessibility.plainLanguageMode, updateAccessibility]);

  return (
    <TrustLayerContext.Provider
      value={{
        isTrustModalOpen,
        activeSection,
        activePillar: activeSection,
        openTrustModal,
        closeTrustModal,
        isBannerVisible,
        dismissBanner,
        consent,
        updateConsent,
        acceptAllConsent,
        acceptEssentialOnly,
        revokeAllConsent,
        accessibility,
        updateAccessibility,
        dataRightsRequests,
        submitDataRightsRequest,
        plainLanguage: accessibility.plainLanguageMode,
        togglePlainLanguage
      }}
    >
      {children}
    </TrustLayerContext.Provider>
  );
};

export const useTrustLayer = () => {
  const context = useContext(TrustLayerContext);
  if (!context) {
    throw new Error('useTrustLayer must be used within a TrustLayerProvider');
  }
  return context;
};
