/**
 * Atlas Sanctum Natural Language Voice Command Engine
 * Uses the Web SpeechRecognition API to parse spoken natural language
 * and route commands directly to application views or modal actions.
 */

import { PageView } from '../types';

export type VoiceActionType = 
  | { type: 'navigate'; target: PageView; label: string }
  | { type: 'modal'; action: string; label: string; eventName: string }
  | { type: 'unknown'; rawText: string };

export interface VoiceCommandMatch {
  intent: VoiceActionType;
  confidence: number;
  matchedPhrase: string;
  originalTranscript: string;
}

// Navigation patterns with fuzzy synonyms
const NAVIGATION_PATTERNS: Array<{ regex: RegExp; target: PageView; label: string }> = [
  { regex: /(bioregional ledger|bioregion|basin ledger|resource flows|watershed)/i, target: 'bioregional-ledger', label: 'Bioregional Ledger' },
  { regex: /(flourishing index|flourishing|vitality index|human flourishing|6 dimensions)/i, target: 'flourishing-index', label: 'The Flourishing Index' },
  { regex: /(sentinel|planetary sentinel|agent swarm|threat monitor|boundary sentinel)/i, target: 'sentinel', label: 'Planetary Sentinel' },
  { regex: /(capital engine|capital|blended finance|funding tranche|investment)/i, target: 'capital-engine', label: 'Capital Engine' },
  { regex: /(evidence ledger|evidence|empirical proof|telemetry audit|ground truth)/i, target: 'evidence-ledger', label: 'Evidence Ledger' },
  { regex: /(reality engine|living reality|digital twin|spatial twin|3d twin)/i, target: 'reality-engine', label: 'Living Reality Engine' },
  { regex: /(decision room|decisions|policy scenario|deliberation|trade-?off)/i, target: 'decision-room', label: 'Decision Room' },
  { regex: /(failure ledger|failures|post-?mortem|epistemic error|failure memory)/i, target: 'failure-ledger', label: 'Failure Ledger' },
  { regex: /(project os|projects|open source blueprint|coordination|guilds)/i, target: 'project-os', label: 'Project OS' },
  { regex: /(observatory|satellite telemetry|telescope|planetary view)/i, target: 'observatory', label: 'Global Observatory' },
  { regex: /(marketplace|turnkey package|solutions catalog|store)/i, target: 'marketplace', label: 'Solutions Marketplace' },
  { regex: /(ethics review|moral arbiter|ethical audit|moral council)/i, target: 'ethics-review', label: 'Ethics & Moral Arbiter' },
  { regex: /(stories|voices|field dispatch|community stories|narrative)/i, target: 'stories', label: 'Field Stories & Dispatches' },
  { regex: /(field labs|laboratory|research stations|experimental)/i, target: 'field-labs', label: 'Bioregional Field Labs' },
  { regex: /(system model|studio|system dynamics|multimodal)/i, target: 'studio', label: 'System Dynamics Studio' },
  { regex: /(governance|covenant|charter|about atlas|constitution)/i, target: 'governance', label: 'Governance & Covenant' },
  { regex: /(home|overview|sanctum home|main dashboard|dashboard)/i, target: 'home', label: 'Atlas Sanctum Home' }
];

// Core Modal & Action patterns
const MODAL_PATTERNS: Array<{ regex: RegExp; action: string; label: string; eventName: string }> = [
  { regex: /(command center|search|command palette|global search)/i, action: 'open-command-center', label: 'Open Command Center', eventName: 'atlas-open-command-center' },
  { regex: /(ten commandments|covenant commandments|commandments|moral principles)/i, action: 'open-commandments', label: 'View 10 Commandments', eventName: 'atlas-open-commandments' },
  { regex: /(system health|system diagnostics|diagnostics|pulse|latency)/i, action: 'open-system-health', label: 'Open System Health Diagnostics', eventName: 'atlas-open-system-health' },
  { regex: /(voice assistant|talk to gemini|ai conversation|voice mode)/i, action: 'open-live-voice', label: 'Start Gemini Voice Session', eventName: 'atlas-open-live-voice' },
  { regex: /(export data|export ledger|download ledger|export controller|geojson)/i, action: 'open-export-controller', label: 'Open Bioregional Export Controller', eventName: 'atlas-open-export-controller' },
  { regex: /(moral scorecard|moral evaluation|moral alignment score)/i, action: 'open-moral-scorecard', label: 'Open Moral Scorecard', eventName: 'atlas-open-moral-scorecard' },
  { regex: /(toggle offline|go offline|offline mode|offline sync)/i, action: 'toggle-offline', label: 'Toggle Offline Mode', eventName: 'atlas-toggle-offline' },
  { regex: /(hazard monitor|ecological alert|hazard beacon|scarcity breach)/i, action: 'open-hazard-monitor', label: 'Inspect Bioregional Hazards', eventName: 'atlas-open-hazard-monitor' },
  { regex: /(toggle theme|dark mode|light mode|change theme)/i, action: 'toggle-theme', label: 'Cycle Platform Theme', eventName: 'atlas-cycle-theme' },
  { regex: /(data provenance|provenance modal|merkle root|audit trail)/i, action: 'open-provenance', label: 'Inspect Epistemic Provenance', eventName: 'atlas-open-provenance' }
];

export class VoiceCommandEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onMatchCallback: ((match: VoiceCommandMatch) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStateChangeCallback: ((isListening: boolean) => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  private initRecognition() {
    if (!this.isSupported()) return;

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (this.onTranscriptCallback && currentText) {
          this.onTranscriptCallback(currentText, !!finalTranscript);
        }

        if (finalTranscript && this.onMatchCallback) {
          const match = this.parseIntent(finalTranscript);
          this.onMatchCallback(match);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
        this.setListening(false);
      };

      this.recognition.onend = () => {
        this.setListening(false);
      };
    } catch (err) {
      console.warn('Failed to initialize SpeechRecognition:', err);
    }
  }

  private setListening(val: boolean) {
    this.isListening = val;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(val);
    }
  }

  public start(callbacks?: {
    onTranscript?: (text: string, isFinal: boolean) => void;
    onMatch?: (match: VoiceCommandMatch) => void;
    onError?: (error: string) => void;
    onStateChange?: (listening: boolean) => void;
  }) {
    if (!this.isSupported()) {
      if (callbacks?.onError) {
        callbacks.onError('Web Speech API is not supported in this browser environment.');
      }
      return;
    }

    if (callbacks?.onTranscript) this.onTranscriptCallback = callbacks.onTranscript;
    if (callbacks?.onMatch) this.onMatchCallback = callbacks.onMatch;
    if (callbacks?.onError) this.onErrorCallback = callbacks.onError;
    if (callbacks?.onStateChange) this.onStateChangeCallback = callbacks.onStateChange;

    try {
      this.recognition?.start();
      this.setListening(true);
    } catch (err: any) {
      // If already started, ignore
      if (err.name !== 'InvalidStateError') {
        console.error('Error starting speech recognition:', err);
      }
    }
  }

  public stop() {
    try {
      this.recognition?.stop();
    } catch {
      // Ignore
    }
    this.setListening(false);
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Parses free-form spoken natural language into an actionable intent
   */
  public parseIntent(transcript: string): VoiceCommandMatch {
    const text = transcript.trim().toLowerCase();

    // 1. Check Modal Actions First
    for (const item of MODAL_PATTERNS) {
      if (item.regex.test(text)) {
        return {
          intent: {
            type: 'modal',
            action: item.action,
            label: item.label,
            eventName: item.eventName
          },
          confidence: 0.96,
          matchedPhrase: item.label,
          originalTranscript: transcript
        };
      }
    }

    // 2. Check Navigation Patterns
    for (const item of NAVIGATION_PATTERNS) {
      if (item.regex.test(text)) {
        return {
          intent: {
            type: 'navigate',
            target: item.target,
            label: item.label
          },
          confidence: 0.95,
          matchedPhrase: item.label,
          originalTranscript: transcript
        };
      }
    }

    // Unknown intent fallback
    return {
      intent: {
        type: 'unknown',
        rawText: transcript
      },
      confidence: 0.2,
      matchedPhrase: 'Unrecognized Voice Command',
      originalTranscript: transcript
    };
  }
}

export const voiceCommandEngine = new VoiceCommandEngine();
