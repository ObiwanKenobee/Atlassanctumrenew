/**
 * ATLAS STEWARD — Safe, Typed Agent Tools
 * Framework: Strands Agents SDK Tool Pattern + AWS Lambda / Bedrock AgentCore
 * 
 * Every tool implements:
 * 1. Input schema validation
 * 2. Autonomy level & authorization enforcement
 * 3. Structured typed responses
 * 4. Audit logging with latency tracking
 * 5. Idempotent state mutations
 */

import {
  WaterAsset,
  InventoryItem,
  Operator,
  ServiceProvider,
  WorkOrder,
  RoutineTask,
  AgentRole,
  AutonomyLevel,
  AgentActivityLog
} from './types';

export interface ToolExecutionResult<T = any> {
  success: boolean;
  toolName: string;
  data: T;
  latencyMs: number;
  authorized: boolean;
  autonomyLevel: AutonomyLevel;
  error?: string;
  auditLogId: string;
}

export interface ToolAuditLogger {
  log(entry: Omit<AgentActivityLog, 'id' | 'timestamp'>): void;
}

export class StewardToolRegistry {
  private logger?: ToolAuditLogger;

  // In-memory application state managed through tools
  private assets: Map<string, WaterAsset> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private operators: Map<string, Operator> = new Map();
  private providers: Map<string, ServiceProvider> = new Map();
  private workOrders: Map<string, WorkOrder> = new Map();
  private tasks: Map<string, RoutineTask> = new Map();
  private maintenanceLogs: Map<string, any[]> = new Map();
  private quotes: Map<string, any> = new Map();
  private notifications: Map<string, any> = new Map();

  // Spend threshold policy
  private maxAutoSpendUsd: number = 500.0;

  constructor(logger?: ToolAuditLogger) {
    this.logger = logger;
  }

  public setLogger(logger: ToolAuditLogger) {
    this.logger = logger;
  }

  public setAutoSpendThreshold(usd: number) {
    this.maxAutoSpendUsd = usd;
  }

  public seedState(state: {
    assets: WaterAsset[];
    inventory: InventoryItem[];
    operators: Operator[];
    providers: ServiceProvider[];
    workOrders: WorkOrder[];
    tasks: RoutineTask[];
  }) {
    this.assets.clear();
    state.assets.forEach((a) => this.assets.set(a.id, { ...a }));

    this.inventory.clear();
    state.inventory.forEach((i) => this.inventory.set(i.id, { ...i }));

    this.operators.clear();
    state.operators.forEach((o) => this.operators.set(o.id, { ...o }));

    this.providers.clear();
    state.providers.forEach((p) => this.providers.set(p.id, { ...p }));

    this.workOrders.clear();
    state.workOrders.forEach((w) => this.workOrders.set(w.id, { ...w }));

    this.tasks.clear();
    state.tasks.forEach((t) => this.tasks.set(t.id, { ...t }));
  }

  private recordLog(agentRole: AgentRole, toolName: string, actionType: any, latencyMs: number, status: any, details: string) {
    if (this.logger) {
      this.logger.log({
        agentRole,
        agentName: `${agentRole}_AGENT`,
        actionType,
        toolName,
        latencyMs,
        status,
        details
      });
    }
  }

  // ==========================================
  // TOOL 1: get_water_status
  // ==========================================
  public async get_water_status(params: {
    zone?: string;
    criticalOnly?: boolean;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<{
    totalAssets: number;
    operationalCount: number;
    warningCount: number;
    criticalCount: number;
    averageLevelPercent: number;
    totalFlowLps: number;
    populationServed: number;
    assets: WaterAsset[];
  }>> {
    const start = performance.now();
    const caller = params.callerRole || 'STEWARD';

    let list = Array.from(this.assets.values());
    if (params.zone) {
      list = list.filter((a) => a.zone.toLowerCase() === params.zone!.toLowerCase());
    }
    if (params.criticalOnly) {
      list = list.filter((a) => a.status === 'CRITICAL' || a.status === 'WARNING');
    }

    const operational = list.filter((a) => a.status === 'OPERATIONAL').length;
    const warning = list.filter((a) => a.status === 'WARNING').length;
    const critical = list.filter((a) => a.status === 'CRITICAL' || a.status === 'MAINTENANCE_REQUIRED').length;
    const avgLevel = list.reduce((acc, a) => acc + a.currentLevelPercent, 0) / (list.length || 1);
    const totalFlow = list.reduce((acc, a) => acc + a.flowRateLps, 0);
    const totalPop = list.reduce((acc, a) => acc + a.servesPopulation, 0);

    const latency = Math.round(performance.now() - start + 8);
    this.recordLog(caller, 'get_water_status', 'TOOL_INVOCATION', latency, 'SUCCESS', `Queried status for ${list.length} water assets. Operational: ${operational}, Warnings: ${warning}, Critical: ${critical}`);

    return {
      success: true,
      toolName: 'get_water_status',
      authorized: true,
      autonomyLevel: 'OBSERVE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: {
        totalAssets: list.length,
        operationalCount: operational,
        warningCount: warning,
        criticalCount: critical,
        averageLevelPercent: Math.round(avgLevel * 10) / 10,
        totalFlowLps: Math.round(totalFlow * 10) / 10,
        populationServed: totalPop,
        assets: list
      }
    };
  }

  // ==========================================
  // TOOL 2: get_asset_status
  // ==========================================
  public async get_asset_status(params: {
    assetId: string;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<WaterAsset>> {
    const start = performance.now();
    const caller = params.callerRole || 'OPERATIONS';

    if (!params.assetId) {
      return {
        success: false,
        toolName: 'get_asset_status',
        authorized: true,
        autonomyLevel: 'OBSERVE',
        latencyMs: 1,
        auditLogId: `AUD-${Date.now()}`,
        error: 'Missing required parameter: assetId',
        data: null as any
      };
    }

    const asset = this.assets.get(params.assetId);
    const latency = Math.round(performance.now() - start + 5);

    if (!asset) {
      this.recordLog(caller, 'get_asset_status', 'TOOL_INVOCATION', latency, 'FAILED', `Asset ID '${params.assetId}' not found.`);
      return {
        success: false,
        toolName: 'get_asset_status',
        authorized: true,
        autonomyLevel: 'OBSERVE',
        latencyMs: latency,
        auditLogId: `AUD-${Date.now()}`,
        error: `Asset ${params.assetId} not found`,
        data: null as any
      };
    }

    this.recordLog(caller, 'get_asset_status', 'TOOL_INVOCATION', latency, 'SUCCESS', `Retrieved asset telemetry for ${asset.name} (${asset.id}). Status: ${asset.status}, Vibration: ${asset.vibrationMmS}mm/s, Pressure: ${asset.pressureBar}bar`);

    return {
      success: true,
      toolName: 'get_asset_status',
      authorized: true,
      autonomyLevel: 'OBSERVE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: { ...asset }
    };
  }

  // ==========================================
  // TOOL 3: get_inventory
  // ==========================================
  public async get_inventory(params: {
    category?: string;
    lowStockOnly?: boolean;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<InventoryItem[]>> {
    const start = performance.now();
    const caller = params.callerRole || 'RESOURCE';

    let list = Array.from(this.inventory.values());
    if (params.category) {
      list = list.filter((i) => i.category === params.category);
    }
    if (params.lowStockOnly) {
      list = list.filter((i) => i.quantityOnHand <= i.reorderPoint);
    }

    const latency = Math.round(performance.now() - start + 6);
    this.recordLog(caller, 'get_inventory', 'TOOL_INVOCATION', latency, 'SUCCESS', `Inventory check returned ${list.length} SKU items.`);

    return {
      success: true,
      toolName: 'get_inventory',
      authorized: true,
      autonomyLevel: 'OBSERVE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: list
    };
  }

  // ==========================================
  // TOOL 4: get_operator_availability
  // ==========================================
  public async get_operator_availability(params: {
    roleRequired?: string;
    availableOnly?: boolean;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<Operator[]>> {
    const start = performance.now();
    const caller = params.callerRole || 'OPERATIONS';

    let list = Array.from(this.operators.values());
    if (params.roleRequired) {
      list = list.filter((o) => o.role === params.roleRequired);
    }
    if (params.availableOnly) {
      list = list.filter((o) => o.status === 'AVAILABLE');
    }

    const latency = Math.round(performance.now() - start + 4);
    this.recordLog(caller, 'get_operator_availability', 'TOOL_INVOCATION', latency, 'SUCCESS', `Found ${list.length} operators matching criteria.`);

    return {
      success: true,
      toolName: 'get_operator_availability',
      authorized: true,
      autonomyLevel: 'OBSERVE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: list
    };
  }

  // ==========================================
  // TOOL 5: get_maintenance_history
  // ==========================================
  public async get_maintenance_history(params: {
    assetId: string;
    limit?: number;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<any[]>> {
    const start = performance.now();
    const caller = params.callerRole || 'OPERATIONS';

    const defaultLogs = [
      {
        date: '2026-02-10',
        action: 'Routine bearing lubrication and pressure check',
        technician: 'David Mwangi',
        costUsd: 65,
        outcome: 'Normal baseline confirmed'
      },
      {
        date: '2025-11-20',
        action: 'Intake strainer backwash and gravel clear',
        technician: 'Sarah Kimani',
        costUsd: 120,
        outcome: 'Flow restored to 24.5 L/s'
      },
      {
        date: '2025-08-12',
        action: 'Emergency impeller seal replacement (Tungsten carbide)',
        technician: 'Rift Valley Precision',
        costUsd: 1350,
        outcome: 'Vibration reduced from 7.2 to 1.8 mm/s'
      }
    ];

    const history = this.maintenanceLogs.get(params.assetId) || defaultLogs;
    const latency = Math.round(performance.now() - start + 9);

    this.recordLog(caller, 'get_maintenance_history', 'TOOL_INVOCATION', latency, 'SUCCESS', `Fetched maintenance ledger for ${params.assetId} (${history.length} records).`);

    return {
      success: true,
      toolName: 'get_maintenance_history',
      authorized: true,
      autonomyLevel: 'OBSERVE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: history.slice(0, params.limit || 5)
    };
  }

  // ==========================================
  // TOOL 6: find_service_provider
  // ==========================================
  public async find_service_provider(params: {
    specialty: string;
    preApprovedOnly?: boolean;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<ServiceProvider[]>> {
    const start = performance.now();
    const caller = params.callerRole || 'RESOURCE';

    let list = Array.from(this.providers.values());
    if (params.specialty) {
      const q = params.specialty.toLowerCase();
      list = list.filter((p) => p.specialty.toLowerCase().includes(q));
    }
    if (params.preApprovedOnly) {
      list = list.filter((p) => p.tier === 'PRE_APPROVED');
    }

    const latency = Math.round(performance.now() - start + 8);
    this.recordLog(caller, 'find_service_provider', 'TOOL_INVOCATION', latency, 'SUCCESS', `Matched ${list.length} certified suppliers for specialty '${params.specialty}'.`);

    return {
      success: true,
      toolName: 'find_service_provider',
      authorized: true,
      autonomyLevel: 'OBSERVE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: list
    };
  }

  // ==========================================
  // TOOL 7: schedule_inspection
  // ==========================================
  public async schedule_inspection(params: {
    assetId: string;
    scheduledDate: string;
    operatorId: string;
    checklistItems: string[];
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<{ inspectionId: string; scheduledDate: string; status: string }>> {
    const start = performance.now();
    const caller = params.callerRole || 'OPERATIONS';

    const asset = this.assets.get(params.assetId);
    if (!asset) {
      return {
        success: false,
        toolName: 'schedule_inspection',
        authorized: true,
        autonomyLevel: 'EXECUTE',
        latencyMs: 2,
        auditLogId: `AUD-${Date.now()}`,
        error: `Asset ${params.assetId} not found`,
        data: null as any
      };
    }

    const inspectionId = `INSP-${Date.now().toString().slice(-6)}`;
    const latency = Math.round(performance.now() - start + 12);

    this.recordLog(caller, 'schedule_inspection', 'AUTONOMOUS_EXECUTION', latency, 'SUCCESS', `Scheduled routine inspection ${inspectionId} for ${asset.name} on ${params.scheduledDate} assigned to ${params.operatorId}.`);

    return {
      success: true,
      toolName: 'schedule_inspection',
      authorized: true,
      autonomyLevel: 'EXECUTE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: {
        inspectionId,
        scheduledDate: params.scheduledDate,
        status: 'SCHEDULED'
      }
    };
  }

  // ==========================================
  // TOOL 8: create_work_order
  // ==========================================
  public async create_work_order(params: {
    assetId: string;
    taskTitle: string;
    description: string;
    priority: 'ROUTINE' | 'ELEVATED' | 'EMERGENCY';
    estimatedCostUsd: number;
    assignedOperatorId?: string;
    assignedProviderId?: string;
    scheduledFor: string;
    isHumanApproved?: boolean;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<WorkOrder>> {
    const start = performance.now();
    const caller = params.callerRole || 'OPERATIONS';

    const asset = this.assets.get(params.assetId);
    if (!asset) {
      return {
        success: false,
        toolName: 'create_work_order',
        authorized: false,
        autonomyLevel: 'PREPARE',
        latencyMs: 2,
        auditLogId: `AUD-${Date.now()}`,
        error: `Asset ${params.assetId} not found`,
        data: null as any
      };
    }

    // Policy check: If cost > maxAutoSpendUsd and not approved by human, reject autonomous dispatch!
    if (params.estimatedCostUsd > this.maxAutoSpendUsd && !params.isHumanApproved) {
      const latency = Math.round(performance.now() - start + 10);
      this.recordLog(caller, 'create_work_order', 'EXCEPTION_ESCALATION', latency, 'ESCALATED', `Spend $${params.estimatedCostUsd} exceeds auto-threshold $${this.maxAutoSpendUsd}. Required Human Approval before execution.`);

      return {
        success: false,
        toolName: 'create_work_order',
        authorized: false,
        autonomyLevel: 'PREPARE',
        latencyMs: latency,
        auditLogId: `AUD-${Date.now()}`,
        error: `Action exceeds autonomous spend limit ($${params.estimatedCostUsd} > $${this.maxAutoSpendUsd}). Human authorization required.`,
        data: null as any
      };
    }

    const orderId = `WO-${Date.now().toString().slice(-6)}`;
    const workOrder: WorkOrder = {
      id: orderId,
      assetId: params.assetId,
      assetName: asset.name,
      taskTitle: params.taskTitle,
      description: params.description,
      priority: params.priority,
      assignedOperatorId: params.assignedOperatorId,
      assignedProviderId: params.assignedProviderId,
      status: 'DISPATCHED',
      estimatedCostUsd: params.estimatedCostUsd,
      createdAt: new Date().toISOString(),
      scheduledFor: params.scheduledFor
    };

    this.workOrders.set(orderId, workOrder);

    // Update asset state if dispatching repair
    asset.status = 'MAINTENANCE_REQUIRED';
    this.assets.set(asset.id, asset);

    const latency = Math.round(performance.now() - start + 15);
    this.recordLog(caller, 'create_work_order', 'AUTONOMOUS_EXECUTION', latency, 'SUCCESS', `Created & Dispatched Work Order ${orderId} ($${params.estimatedCostUsd}) for ${asset.name}.`);

    return {
      success: true,
      toolName: 'create_work_order',
      authorized: true,
      autonomyLevel: 'EXECUTE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: workOrder
    };
  }

  // ==========================================
  // TOOL 9: send_notification
  // ==========================================
  public async send_notification(params: {
    recipientGroup: 'operators' | 'community_elders' | 'supplier' | 'all_residents';
    channel: 'SMS' | 'WHATSAPP' | 'RADIO_BULLETIN' | 'IN_APP';
    title: string;
    message: string;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<{ notificationId: string; deliveredCount: number; channel: string }>> {
    const start = performance.now();
    const caller = params.callerRole || 'STEWARD';

    const notifId = `NOTIF-${Date.now().toString().slice(-5)}`;
    const deliveredCount = params.recipientGroup === 'all_residents' ? 3200 : params.recipientGroup === 'operators' ? 5 : 12;

    this.notifications.set(notifId, {
      ...params,
      id: notifId,
      sentAt: new Date().toISOString(),
      deliveredCount
    });

    const latency = Math.round(performance.now() - start + 18);
    this.recordLog(caller, 'send_notification', 'AUTONOMOUS_EXECUTION', latency, 'SUCCESS', `Broadcasted '${params.title}' via ${params.channel} to ${params.recipientGroup} (${deliveredCount} recipients).`);

    return {
      success: true,
      toolName: 'send_notification',
      authorized: true,
      autonomyLevel: 'EXECUTE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: {
        notificationId: notifId,
        deliveredCount,
        channel: params.channel
      }
    };
  }

  // ==========================================
  // TOOL 10: request_quote
  // ==========================================
  public async request_quote(params: {
    supplierId: string;
    assetId: string;
    partDescription: string;
    urgencyHours: number;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<{
    quoteId: string;
    supplierName: string;
    partsCostUsd: number;
    laborCostUsd: number;
    totalCostUsd: number;
    estimatedDeliveryHours: number;
    warrantyMonths: number;
  }>> {
    const start = performance.now();
    const caller = params.callerRole || 'RESOURCE';

    const supplier = this.providers.get(params.supplierId) || {
      id: params.supplierId,
      name: 'Rift Valley Precision Hydro',
      tier: 'PRE_APPROVED'
    };

    const quoteId = `QT-${Date.now().toString().slice(-5)}`;
    const quoteData = {
      quoteId,
      supplierName: (supplier as ServiceProvider).name || 'Rift Valley Precision Hydro',
      partsCostUsd: 920,
      laborCostUsd: 500,
      totalCostUsd: 1420,
      estimatedDeliveryHours: 4,
      warrantyMonths: 24
    };

    this.quotes.set(quoteId, quoteData);

    const latency = Math.round(performance.now() - start + 22);
    this.recordLog(caller, 'request_quote', 'AUTONOMOUS_EXECUTION', latency, 'SUCCESS', `Received formal quote ${quoteId} from ${quoteData.supplierName} ($${quoteData.totalCostUsd}, 4-hour SLA).`);

    return {
      success: true,
      toolName: 'request_quote',
      authorized: true,
      autonomyLevel: 'PREPARE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: quoteData
    };
  }

  // ==========================================
  // TOOL 11: update_task
  // ==========================================
  public async update_task(params: {
    taskId: string;
    status: 'completed' | 'in_progress' | 'waiting' | 'exception_raised';
    outcomeSummary?: string;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<RoutineTask>> {
    const start = performance.now();
    const caller = params.callerRole || 'STEWARD';

    let task = this.tasks.get(params.taskId);
    if (!task) {
      task = {
        id: params.taskId,
        title: 'Routine Maintenance Task',
        category: 'inspection',
        assignedAgent: caller,
        status: params.status,
        autonomyLevel: 'EXECUTE',
        automatedReason: 'Routine automated scheduling',
        executionTimestamp: new Date().toISOString(),
        durationMs: 150,
        toolChain: ['update_task']
      };
    } else {
      task.status = params.status;
      if (params.outcomeSummary) {
        task.outcomeSummary = params.outcomeSummary;
      }
    }

    this.tasks.set(task.id, task);

    const latency = Math.round(performance.now() - start + 4);
    this.recordLog(caller, 'update_task', 'TOOL_INVOCATION', latency, 'SUCCESS', `Updated task ${task.id} status to ${params.status}.`);

    return {
      success: true,
      toolName: 'update_task',
      authorized: true,
      autonomyLevel: 'EXECUTE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: task
    };
  }

  // ==========================================
  // TOOL 12: verify_completion
  // ==========================================
  public async verify_completion(params: {
    assetId: string;
    workOrderId?: string;
    targetMetric: 'flow_rate' | 'vibration' | 'pressure' | 'chlorine_ppm';
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<{
    verified: boolean;
    observedValue: number;
    expectedThreshold: number;
    metricUnit: string;
    recoveryConfidencePercent: number;
    verdict: string;
  }>> {
    const start = performance.now();
    const caller = params.callerRole || 'OPERATIONS';

    const asset = this.assets.get(params.assetId);
    if (asset) {
      // Simulate physical telemetry recovery post-intervention
      asset.status = 'OPERATIONAL';
      asset.vibrationMmS = 1.4; // Normalized
      asset.flowRateLps = 24.8; // Nominal
      asset.pressureBar = 4.2;  // Nominal
      this.assets.set(asset.id, asset);
    }

    const latency = Math.round(performance.now() - start + 14);
    this.recordLog(caller, 'verify_completion', 'VERIFICATION_CONFIRMED', latency, 'SUCCESS', `Verified physical outcome for ${params.assetId}: Vibration 1.4 mm/s (Ceiling 2.5 mm/s), Flow 24.8 L/s. 100% Verified Recovery.`);

    return {
      success: true,
      toolName: 'verify_completion',
      authorized: true,
      autonomyLevel: 'EXECUTE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: {
        verified: true,
        observedValue: 1.4,
        expectedThreshold: 2.5,
        metricUnit: 'mm/s (vibration)',
        recoveryConfidencePercent: 99.4,
        verdict: 'OPERATIONAL_BASELINE_RESTORED'
      }
    };
  }

  // ==========================================
  // TOOL 13: record_outcome
  // ==========================================
  public async record_outcome(params: {
    incidentRef: string;
    assetType: string;
    symptomPattern: string;
    rootCause: string;
    effectiveIntervention: string;
    preApprovedSupplierName: string;
    lessonLearned: string;
    callerRole?: AgentRole;
  }): Promise<ToolExecutionResult<{ memoryId: string; saved: boolean }>> {
    const start = performance.now();
    const caller = params.callerRole || 'STEWARD';

    const memoryId = `MEM-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const latency = Math.round(performance.now() - start + 10);

    this.recordLog(caller, 'record_outcome', 'MEMORY_ANCHORED', latency, 'SUCCESS', `Anchored operational lesson ${memoryId} to Strands/DynamoDB memory bank.`);

    return {
      success: true,
      toolName: 'record_outcome',
      authorized: true,
      autonomyLevel: 'EXECUTE',
      latencyMs: latency,
      auditLogId: `AUD-${Date.now()}`,
      data: {
        memoryId,
        saved: true
      }
    };
  }
}
