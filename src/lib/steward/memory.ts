/**
 * ATLAS STEWARD — Persistent Memory Bank & Learning Loop
 * Framework: Strands Agents SDK Memory Pattern + Amazon Bedrock AgentCore Memory
 */

import { OperationalLesson, WaterAsset, HumanDecisionException } from './types';

const INITIAL_MEMORY_LESSONS: OperationalLesson[] = [
  {
    id: 'MEM-2025-0812',
    incidentRef: 'INC-BH03-CAVITATION',
    assetType: 'borehole_pump',
    symptomPattern: 'High vibration > 6.5 mm/s accompanied by 25% flow drop in sandy aquifer zone',
    rootCause: 'Impeller abrasion and seal degradation from fine silica silt ingestion during peak dry season draw',
    effectiveIntervention: 'Emergency replacement with heavy-duty tungsten-carbide mechanical seal + temporary diversion to Header Tank B',
    preApprovedSupplierId: 'SUP-01',
    preApprovedSupplierName: 'Rift Valley Precision Hydro',
    lessonLearned: 'Standard silicon-carbide seals fail within 8 months in Borehole 03 due to quartz sandstone strata. Always specify tungsten-carbide replacement with 2-year warranty.',
    savedAt: '2025-08-14T10:30:00Z',
    retrievalCount: 4,
    policyUpdateSuggested: 'Pre-authorize tungsten seal stock in local inventory Bin C-04'
  },
  {
    id: 'MEM-2025-1104',
    incidentRef: 'INC-CHLOR-DOSING-SPIKE',
    assetType: 'chlorination_unit',
    symptomPattern: 'ORP oxidation reduction potential fluctuating between 450mV and 820mV post-rainstorm',
    rootCause: 'Peristaltic dosing tube hardening from UV exposure + rainwater intrusion in sensor junction box',
    effectiveIntervention: 'Replaced dosing tube with Santoprene polymer + sealed junction box with IP68 silicone gland',
    preApprovedSupplierId: 'SUP-03',
    preApprovedSupplierName: 'Nairobi WaterCare Labs',
    lessonLearned: 'Inspect chlorinator peristaltic tubing every 90 days before equatorial monsoon rains. Keep 3 spare Santoprene tubes in stock.',
    savedAt: '2025-11-05T14:15:00Z',
    retrievalCount: 2
  },
  {
    id: 'MEM-2026-0118',
    incidentRef: 'INC-SOLAR-INVERTER-THERMAL',
    assetType: 'solar_inverter',
    symptomPattern: 'Inverter derating output to 40% between 12:30 PM and 2:30 PM daily',
    rootCause: 'Dust accumulation on cooling heat sink + failing 24V brushless cabinet fan',
    effectiveIntervention: 'Cleaned heatsink with compressed air + replaced fan with high-CFM ball bearing fan',
    preApprovedSupplierId: 'SUP-04',
    preApprovedSupplierName: 'Equator Solar Dynamics',
    lessonLearned: 'Autonomous monthly compressed-air cleaning prevents $850 inverter board failure.',
    savedAt: '2026-01-19T09:00:00Z',
    retrievalCount: 6
  }
];

class StewardMemoryBank {
  private lessons: OperationalLesson[] = [...INITIAL_MEMORY_LESSONS];
  private listeners: Array<(lessons: OperationalLesson[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('atlas_steward_memory_lessons');
      if (stored) {
        this.lessons = JSON.parse(stored);
      }
    } catch {
      // Fallback to default
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('atlas_steward_memory_lessons', JSON.stringify(this.lessons));
    } catch {
      // In-memory fallback
    }
    this.notify();
  }

  public subscribe(listener: (lessons: OperationalLesson[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.lessons]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.lessons]));
  }

  public getAllLessons(): OperationalLesson[] {
    return [...this.lessons];
  }

  /**
   * Semantic / Keyword search matching symptoms and asset types
   */
  public queryRelevantLessons(assetType: string, symptoms: string): OperationalLesson[] {
    const q = (assetType + ' ' + symptoms).toLowerCase();
    return this.lessons
      .filter((lesson) => {
        const text = (lesson.assetType + ' ' + lesson.symptomPattern + ' ' + lesson.rootCause).toLowerCase();
        const matchesType = lesson.assetType.toLowerCase() === assetType.toLowerCase();
        const matchesKeywords = q.split(' ').some((word) => word.length > 3 && text.includes(word));
        return matchesType || matchesKeywords;
      })
      .map((lesson) => {
        // Increment retrieval count
        lesson.retrievalCount += 1;
        return lesson;
      });
  }

  /**
   * Anchor a newly resolved incident lesson to permanent memory
   */
  public recordLesson(newLesson: Omit<OperationalLesson, 'id' | 'savedAt' | 'retrievalCount'>): OperationalLesson {
    const lesson: OperationalLesson = {
      ...newLesson,
      id: `MEM-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      savedAt: new Date().toISOString(),
      retrievalCount: 1
    };

    this.lessons.unshift(lesson);
    this.saveToStorage();
    return lesson;
  }

  public resetToDefaults() {
    this.lessons = [...INITIAL_MEMORY_LESSONS];
    this.saveToStorage();
  }
}

export const stewardMemory = new StewardMemoryBank();
