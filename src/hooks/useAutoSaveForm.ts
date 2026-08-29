import { useState, useEffect, useRef } from 'react';
import { audioFeedback } from '../lib/audioFeedback';

export interface UseAutoSaveOptions<T> {
  key: string;
  initialValue: T;
  debounceMs?: number;
  onRestored?: (data: T) => void;
}

export function useAutoSaveForm<T>({
  key,
  initialValue,
  debounceMs = 800,
  onRestored
}: UseAutoSaveOptions<T>) {
  const [formData, setFormData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(`atlas_autosave_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.warn(`[AutoSave] Error reading cache for ${key}:`, e);
    }
    return initialValue;
  });

  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => {
    const timestamp = localStorage.getItem(`atlas_autosave_${key}_timestamp`);
    return timestamp ? new Date(timestamp) : null;
  });

  const [isDraftRestored, setIsDraftRestored] = useState<boolean>(() => {
    return !!localStorage.getItem(`atlas_autosave_${key}`);
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const debounceTimerRef = useRef<any>(null);

  // Auto-save effect with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSaving(true);
    debounceTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`atlas_autosave_${key}`, JSON.stringify(formData));
        const now = new Date();
        localStorage.setItem(`atlas_autosave_${key}_timestamp`, now.toISOString());
        setLastSavedTime(now);
      } catch (e) {
        console.warn(`[AutoSave] Error saving cache for ${key}:`, e);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [key, formData, debounceMs]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(`atlas_autosave_${key}`);
      localStorage.removeItem(`atlas_autosave_${key}_timestamp`);
      setFormData(initialValue);
      setLastSavedTime(null);
      setIsDraftRestored(false);
      audioFeedback.playMicroTick();
    } catch (e) {
      console.warn(`[AutoSave] Error clearing draft for ${key}:`, e);
    }
  };

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    setFormData,
    updateField,
    lastSavedTime,
    isDraftRestored,
    isSaving,
    clearDraft
  };
}
