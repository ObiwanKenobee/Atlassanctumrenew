import { useEffect, useState } from 'react';
import { PageView } from '../types';
import { 
  updatePageMetadata, 
  MODULE_METADATA_REGISTRY, 
  ViewMetadata,
  auditViewMetadataEfficacy,
  CrawlabilityAuditResult
} from '../lib/metadataManager';

export function useMetadataManager(activeView: PageView) {
  const [currentMetadata, setCurrentMetadata] = useState<ViewMetadata>(() => {
    return MODULE_METADATA_REGISTRY[activeView] || MODULE_METADATA_REGISTRY['home'];
  });

  const [auditResult, setAuditResult] = useState<CrawlabilityAuditResult>(() => {
    return auditViewMetadataEfficacy(MODULE_METADATA_REGISTRY[activeView] || MODULE_METADATA_REGISTRY['home']);
  });

  // Automatically synchronize DOM page-level meta tags whenever activeView changes
  useEffect(() => {
    const updated = updatePageMetadata(activeView);
    setCurrentMetadata(updated);
    setAuditResult(auditViewMetadataEfficacy(updated));
  }, [activeView]);

  const applyCustomOverride = (overrides: Partial<ViewMetadata>) => {
    const updated = updatePageMetadata(activeView, overrides);
    setCurrentMetadata(updated);
    setAuditResult(auditViewMetadataEfficacy(updated));
  };

  const resetToDefault = () => {
    const updated = updatePageMetadata(activeView);
    setCurrentMetadata(updated);
    setAuditResult(auditViewMetadataEfficacy(updated));
  };

  return {
    metadata: currentMetadata,
    auditResult,
    applyCustomOverride,
    resetToDefault
  };
}
