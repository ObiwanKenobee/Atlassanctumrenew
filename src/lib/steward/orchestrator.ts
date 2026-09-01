/**
 * ATLAS STEWARD — Multi-Agent Orchestrator
 * Central Framework: Strands Agents SDK Pattern + Amazon Bedrock AgentCore
 * 
 * Agents:
 * - STEWARD AGENT (Goal translation, autonomy boundary enforcement, priority floor oversight)
 * - OPERATIONS AGENT (Asset health monitoring, physical dispatch, verification)
 * - RESOURCE AGENT (Inventory management, vendor matchmaking, quote negotiation)
 * - RISK AGENT (Safety invariant gating, blast radius modeling, threshold checks)
 */

import {
  StewardSystemState,
  HumanDecisionException,
  AgentRole,
  AgentActivityLog,
  DecisionStatus,
  WorkOrder
} from './types';
import { createInitialSystemState } from './simulator';
import { StewardToolRegistry } from './tools';
import { stewardPolicyEngine } from './policyEngine';
import { stewardMemory } from './memory';

export class StewardOrchestrator {
  private state: StewardSystemState;
  private tools: StewardToolRegistry;
  private listeners: Array<(state: StewardSystemState) => void> = [];

  constructor() {
    this.state = createInitialSystemState();
    this.tools = new StewardToolRegistry({
      log: (entry) => this.appendLog(entry)
    });
    this.syncToolsWithState();
  }

  public subscribe(listener: (state: StewardSystemState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach((l) => l(s));
  }

  public getState(): StewardSystemState {
    return JSON.parse(JSON.stringify(this.state));
  }

  private syncToolsWithState() {
    this.tools.seedState({
      assets: this.state.assets,
      inventory: this.state.inventory,
      operators: this.state.operators,
      providers: this.state.serviceProviders,
      workOrders: this.state.workOrders,
      tasks: this.state.routineTasks
    });
    this.tools.setAutoSpendThreshold(this.state.autoApprovalSpendThresholdUsd);
  }

  private appendLog(entry: Omit<AgentActivityLog, 'id' | 'timestamp'>) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const log: AgentActivityLog = {
      ...entry,
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: timeStr
    };
    this.state.activityLogs.unshift(log);
    // Keep max 100 logs
    if (this.state.activityLogs.length > 100) {
      this.state.activityLogs = this.state.activityLogs.slice(0, 100);
    }
  }

  public setDurableObjective(goal: string) {
    this.state.durableObjective = goal;
    this.state.objectiveSetAt = new Date().toISOString();
    this.appendLog({
      agentRole: 'STEWARD',
      agentName: 'STEWARD_AGENT',
      actionType: 'AUTONOMOUS_EXECUTION',
      latencyMs: 12,
      status: 'SUCCESS',
      details: `New durable community objective anchored: "${goal}"`
    });
    this.notify();
  }

  public setAutoSpendThreshold(usd: number) {
    this.state.autoApprovalSpendThresholdUsd = usd;
    stewardPolicyEngine.setAutoSpendLimit(usd);
    this.tools.setAutoSpendThreshold(usd);
    this.appendLog({
      agentRole: 'STEWARD',
      agentName: 'STEWARD_AGENT',
      actionType: 'TOOL_INVOCATION',
      latencyMs: 5,
      status: 'SUCCESS',
      details: `Autonomous spend threshold adjusted to $${usd.toFixed(2)} USD.`
    });
    this.notify();
  }

  /**
   * Human Decision Execution: APPROVE, REJECT, MODIFY, PAUSE
   */
  public async handleHumanDecision(params: {
    exceptionId: string;
    action: 'APPROVE' | 'REJECT' | 'MODIFY' | 'PAUSE';
    selectedOptionId?: string;
    modificationNotes?: string;
  }): Promise<{ success: boolean; message: string }> {
    const excIndex = this.state.activeExceptions.findIndex((e) => e.id === params.exceptionId);
    if (excIndex === -1) {
      return { success: false, message: 'Exception not found or already resolved.' };
    }

    const exc = this.state.activeExceptions[excIndex];
    const nowIso = new Date().toISOString();

    if (params.action === 'PAUSE') {
      this.state.isPaused = true;
      exc.status = 'paused';
      this.appendLog({
        agentRole: 'STEWARD',
        agentName: 'STEWARD_AGENT',
        actionType: 'HUMAN_APPROVAL_RECEIVED',
        latencyMs: 10,
        status: 'WARNING',
        details: `Operator PAUSED execution on ${exc.title}. All active work orders on hold.`
      });
      this.notify();
      return { success: true, message: 'Autonomous loop paused by operator.' };
    }

    if (params.action === 'REJECT') {
      exc.status = 'rejected';
      exc.decidedAt = nowIso;
      exc.decisionNotes = params.modificationNotes || 'Operator rejected recommended action.';
      
      // Move to resolved
      this.state.activeExceptions.splice(excIndex, 1);
      this.state.resolvedDecisions.unshift(exc);
      this.state.stats.exceptionsCount = this.state.activeExceptions.length;

      this.appendLog({
        agentRole: 'STEWARD',
        agentName: 'STEWARD_AGENT',
        actionType: 'HUMAN_APPROVAL_RECEIVED',
        latencyMs: 15,
        status: 'WARNING',
        details: `Operator REJECTED proposal for ${exc.title}. System maintaining current fallback posture.`
      });
      this.notify();
      return { success: true, message: 'Proposal rejected. Maintained fallback posture.' };
    }

    if (params.action === 'MODIFY' || params.action === 'APPROVE') {
      exc.status = params.action === 'MODIFY' ? 'modified' : 'approved';
      exc.decidedAt = nowIso;
      exc.decisionNotes = params.modificationNotes || (params.action === 'APPROVE' ? 'Approved recommended option by operator.' : 'Modified by operator.');

      // 1. Create and dispatch the approved work order
      const workOrderResult = await this.tools.create_work_order({
        assetId: exc.assetId,
        taskTitle: 'Emergency Tungsten-Carbide Seal Overhaul',
        description: 'Dispatched Rift Valley Precision Hydro for deep borehole seal replacement.',
        priority: 'EMERGENCY',
        estimatedCostUsd: exc.financialImpactUsd,
        assignedProviderId: 'SUP-01',
        scheduledFor: 'Immediate',
        isHumanApproved: true,
        callerRole: 'OPERATIONS'
      });

      // 2. Simulate physical recovery & verify post-action state
      const verification = await this.tools.verify_completion({
        assetId: exc.assetId,
        targetMetric: 'vibration',
        callerRole: 'OPERATIONS'
      });

      // 3. Anchor lesson learned into persistent memory
      const lesson = await this.tools.record_outcome({
        incidentRef: 'INC-BH03-SEAL-REPAIR-2026',
        assetType: 'borehole_pump',
        symptomPattern: 'Vibration 6.8 mm/s with 28% flow drop on sandstone aquifer',
        rootCause: 'Quartz silt abrasion on standard silicon seal',
        effectiveIntervention: 'Installed heavy-duty tungsten-carbide mechanical seal with Rift Valley Precision ($1,420)',
        preApprovedSupplierName: 'Rift Valley Precision Hydro',
        lessonLearned: 'Always mandate tungsten-carbide seals on Borehole 03 during dry season draw. Verified flow 24.8 L/s, vibration 1.4 mm/s.',
        callerRole: 'STEWARD'
      });

      // Update memory in state
      stewardMemory.recordLesson({
        incidentRef: 'INC-BH03-SEAL-REPAIR-2026',
        assetType: 'borehole_pump',
        symptomPattern: 'Vibration 6.8 mm/s with 28% flow drop on sandstone aquifer',
        rootCause: 'Quartz silt abrasion on standard silicon seal',
        effectiveIntervention: 'Installed heavy-duty tungsten-carbide mechanical seal with Rift Valley Precision ($1,420)',
        preApprovedSupplierId: 'SUP-01',
        preApprovedSupplierName: 'Rift Valley Precision Hydro',
        lessonLearned: 'Always mandate tungsten-carbide seals on Borehole 03 during dry season draw. Verified flow 24.8 L/s, vibration 1.4 mm/s.',
        policyUpdateSuggested: 'Pre-authorize tungsten seal stock in local inventory Bin C-04'
      });

      // Update asset telemetry in state
      const asset = this.state.assets.find((a) => a.id === exc.assetId);
      if (asset) {
        asset.status = 'OPERATIONAL';
        asset.vibrationMmS = 1.4;
        asset.flowRateLps = 24.8;
        asset.pressureBar = 4.2;
        asset.temperatureCelsius = 22.4;
      }

      // Update Priority Floor
      const waterPf = this.state.priorityFloor.find((p) => p.dimension === 'water');
      if (waterPf) {
        waterPf.status = 'NOMINAL';
        waterPf.reliabilityScore = 98.4;
        waterPf.lastAssessedAt = 'Verified 10s ago';
      }

      // Move exception to resolved
      this.state.activeExceptions.splice(excIndex, 1);
      this.state.resolvedDecisions.unshift(exc);
      this.state.stats.exceptionsCount = this.state.activeExceptions.length;
      this.state.stats.waterReliabilityScore = 98.4;
      this.state.memoryLessons = stewardMemory.getAllLessons();

      this.appendLog({
        agentRole: 'STEWARD',
        agentName: 'STEWARD_AGENT',
        actionType: 'VERIFICATION_CONFIRMED',
        latencyMs: 18,
        status: 'SUCCESS',
        details: `Outcome verified: Borehole 03 vibration down to 1.4 mm/s (Normal). Priority Floor water reliability restored to 98.4%. Lesson MEM-2026 anchored.`
      });

      this.notify();
      return {
        success: true,
        message: `Action executed, physical outcome verified (Vibration: 1.4 mm/s), and lesson anchored to memory.`
      };
    }

    return { success: false, message: 'Invalid action.' };
  }

  /**
   * Reset simulation back to initial hero state
   */
  public resetDemo() {
    stewardMemory.resetToDefaults();
    this.state = createInitialSystemState();
    this.syncToolsWithState();
    this.appendLog({
      agentRole: 'STEWARD',
      agentName: 'STEWARD_AGENT',
      actionType: 'AUTONOMOUS_EXECUTION',
      latencyMs: 5,
      status: 'SUCCESS',
      details: 'Simulation reset to baseline. 18 routine tasks active, 1 active anomaly on Borehole 03 seeded.'
    });
    this.notify();
  }
}

export const stewardOrchestrator = new StewardOrchestrator();
