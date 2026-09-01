# ATLAS STEWARD: SAFE TYPED TOOLS SPECIFICATION
**Strands Agents SDK Tool Catalog & AWS Lambda Contracts**
**AWS Agents for Humans Hackathon 2026 — Track: Good Neighbor Agents**

---

## 1. Safety Architecture & Tool Execution Pipeline

Every tool invocation executed by an agent in the Atlas Steward multi-agent system follows a strict, non-bypassable 5-stage deterministic validation pipeline:

```
[Agent Invocation Request]
           │
           ▼
[Stage 1: Strict Schema Validation] ───► (Rejects malformed types, invalid ranges, SQL/Command injection)
           │
           ▼
[Stage 2: Policy & Autonomy Gateway] ──► (Evaluates spend limits, downtime blast radius, PII boundaries)
           │
           ├─── If Threshold Exceeded ─► [HOLD & ESCALATE TO HUMAN OPERATOR]
           │
           ▼
[Stage 3: Idempotent Lambda Execution] ─► (Executes in isolated AWS Lambda worker with IAM least-privilege)
           │
           ▼
[Stage 4: State Mutation & Telemetry Sync]
           │
           ▼
[Stage 5: Cryptographic Audit & Telemetry Logging]
```

---

## 2. Core Tool Catalog Matrix

| Tool Name | Assigned Agent | Autonomy Level | Description |
| :--- | :--- | :--- | :--- |
| `get_water_status` | Steward / Risk | `OBSERVE` | Queries aggregate system health, flow rates, and population served. |
| `get_asset_status` | Operations / Risk | `OBSERVE` | Fetches real-time telemetry (flow, pressure, vibration, temperature) for a specific asset. |
| `get_inventory` | Resource | `OBSERVE` | Queries consumable inventory SKUs, stock levels, and reorder points. |
| `get_operator_availability` | Operations / Steward | `OBSERVE` | Checks available certified technicians and their active rosters. |
| `get_maintenance_history` | Operations | `OBSERVE` | Fetches historical maintenance ledgers and past incident repairs for an asset. |
| `find_service_provider` | Resource | `OBSERVE` | Searches verified local contractors filtered by specialty, tier, and rating. |
| `schedule_inspection` | Operations | `EXECUTE` | Creates a routine physical inspection task assigned to a field operator. |
| `create_work_order` | Operations | `PREPARE` / `EXECUTE` | Generates a work order; enforces human approval if cost > $500. |
| `send_notification` | Steward | `EXECUTE` | Dispatches SMS/WhatsApp alerts or status bulletins to stakeholders. |
| `request_quote` | Resource | `PREPARE` | Requests formal price quotes and SLA delivery estimates from contractors. |
| `update_task` | Steward / Operations | `EXECUTE` | Updates lifecycle state and outcomes for routine operational tasks. |
| `verify_completion` | Operations | `EXECUTE` | Samples real-time post-repair telemetry to verify physical recovery. |
| `record_outcome` | Steward | `EXECUTE` | Anchors an operational lesson into the Strands persistent memory bank. |

---

## 3. Deep-Dive Tool Specifications (Water Reliability Workflow)

### 3.1. `get_water_status`

#### Purpose
Queries aggregate system health, pressure stability, volumetric flow rates, and total population served across municipal or community water zones.

#### Input Schema (TypeScript / JSON Schema)
```typescript
interface GetWaterStatusInput {
  /** Optional zone filter (e.g. "South", "North", "Central", "All") */
  zone?: string;
  /** Filter to only degraded or critical assets */
  criticalOnly?: boolean;
  /** Minimum pressure threshold in bar (default: 0.0) */
  minPressureBar?: number;
}
```

#### Output Schema
```typescript
interface GetWaterStatusOutput {
  totalAssets: number;
  operationalCount: number;
  warningCount: number;
  criticalCount: number;
  averageLevelPercent: number;
  totalFlowLps: number;
  populationServed: number;
  priorityFloorReliabilityPercent: number;
  zoneBreakdown: Array<{
    zone: string;
    status: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
    activeFlowLps: number;
    headPressureBar: number;
  }>;
}
```

#### Validation Requirements
- `zone`: String matching regex `^[A-Za-z0-9_\-\s]{1,32}$` or omitted.
- `criticalOnly`: Strict boolean.
- `minPressureBar`: Non-negative float in range `[0.0, 50.0]`.

#### Authorization Policy
- **Autonomy Level**: `OBSERVE` (Read-only).
- **Authorized Callers**: `STEWARD`, `RISK`, `OPERATIONS`.
- **Pre-Execution Gateway**: None (safe idempotent query).

#### Logging & Audit Requirements
- Emits CloudWatch Metric: `AtlasSteward/Telemetry/QueryCount`.
- Records execution latency in milliseconds.
- Log record schema:
  ```json
  {
    "timestamp": "2026-08-31T22:12:45Z",
    "tool": "get_water_status",
    "agent": "STEWARD",
    "params": { "zone": "South" },
    "executionLatencyMs": 42,
    "status": "SUCCESS"
  }
  ```

---

### 3.2. `create_work_order`

#### Purpose
Creates a formal maintenance or emergency repair work order for a water infrastructure asset, allocating field technicians or verified third-party contractors.

#### Input Schema (TypeScript / JSON Schema)
```typescript
interface CreateWorkOrderInput {
  /** Target asset unique identifier (e.g. "ASSET-BH-03") */
  assetId: string;
  /** Short descriptive summary of the work order */
  taskTitle: string;
  /** Detailed technical scope of work */
  description: string;
  /** Priority classification */
  priority: 'ROUTINE' | 'ELEVATED' | 'EMERGENCY';
  /** Estimated or quoted cost in USD */
  estimatedCostUsd: number;
  /** Optional assigned internal operator ID */
  assignedOperatorId?: string;
  /** Optional assigned external service provider ID */
  assignedProviderId?: string;
  /** Scheduled dispatch window */
  scheduledFor: string;
  /** Explicit human approval flag required when cost exceeds policy threshold */
  isHumanApproved?: boolean;
}
```

#### Output Schema
```typescript
interface CreateWorkOrderOutput {
  id: string;
  assetId: string;
  assetName: string;
  status: 'DRAFT' | 'APPROVED' | 'DISPATCHED';
  priority: 'ROUTINE' | 'ELEVATED' | 'EMERGENCY';
  estimatedCostUsd: number;
  assignedEntity: string;
  createdAt: string;
  auditSignature: string;
}
```

#### Validation Requirements
- `assetId`: Must exist in active asset database; schema `^ASSET-[A-Z0-9_\-]+$`.
- `taskTitle`: String length 5–120 characters.
- `description`: String length 10–2000 characters.
- `estimatedCostUsd`: Float $\ge 0.00$ and $\le 100,000.00$.
- `priority`: Enum `ROUTINE` | `ELEVATED` | `EMERGENCY`.

#### Authorization Policy
- **Autonomy Level**: `PREPARE` (if draft/quote) or `EXECUTE` (if within auto-spend threshold).
- **Auto-Approval Gateway**:
  - If `estimatedCostUsd <= autoApprovalSpendThresholdUsd` (default $500) AND `priority !== 'EMERGENCY'`: **AUTOMATIC DISPATCH**.
  - If `estimatedCostUsd > autoApprovalSpendThresholdUsd`: **REQUIRES `isHumanApproved === true`**. If `false`, execution is blocked and escalated to human cockpit.
- **Authorized Callers**: `OPERATIONS` (Primary), `STEWARD` (Escalation).

#### Logging & Audit Requirements
- Creates append-only transaction in `atlas-steward-audit` DynamoDB table.
- Generates SHA-256 cryptographic audit signature linking `assetId`, `cost`, `provider`, and `approver`.
- Emits CloudWatch Alert on emergency or high-cost work orders.

---

### 3.3. `verify_completion`

#### Purpose
Samples real-time physical telemetry following maintenance or contractor intervention to verify that baseline operating parameters (vibration, flow rate, pressure, temperature) have been physically restored before closing a work order.

#### Input Schema (TypeScript / JSON Schema)
```typescript
interface VerifyCompletionInput {
  /** Target asset unique identifier */
  assetId: string;
  /** Associated work order identifier */
  workOrderId?: string;
  /** Primary metric to verify (e.g. "vibration", "flowRate", "pressure") */
  targetMetric: 'vibration' | 'flowRate' | 'pressure' | 'chlorinePpm' | 'all';
  /** Telemetry sampling duration in seconds (default: 30) */
  sampleDurationSeconds?: number;
}
```

#### Output Schema
```typescript
interface VerifyCompletionOutput {
  verified: boolean;
  assetId: string;
  targetMetric: string;
  observedValue: number;
  expectedThreshold: number;
  metricUnit: string;
  recoveryConfidencePercent: number;
  verdict: 'OPERATIONAL_BASELINE_RESTORED' | 'DEGRADED_PERFORMANCE' | 'UNRESOLVED_ANOMALY';
  verificationTimestamp: string;
  telemetryProofToken: string;
}
```

#### Validation Requirements
- `assetId`: Must match existing asset.
- `targetMetric`: Enum validation (`vibration`, `flowRate`, `pressure`, `chlorinePpm`, `all`).
- `sampleDurationSeconds`: Integer in range `[10, 300]`.

#### Authorization Policy
- **Autonomy Level**: `EXECUTE` (Closes operational loops).
- **Authorized Callers**: `OPERATIONS` agent.
- **Safety Rule**: Work orders cannot transition to `VERIFIED` status without a successful telemetry proof token emitted by this tool.

#### Logging & Audit Requirements
- Stores before/after telemetry snapshot in S3 bucket `atlas-steward-telemetry-proofs`.
- Emits audit log entry to CloudWatch and DynamoDB.
- Triggers `record_outcome` to feed the Strands persistent memory bank.

---

## 4. Audit & Cryptographic Logging Architecture

All tool invocations write structured JSON logs to AWS CloudWatch and DynamoDB with the following schema:

```json
{
  "auditId": "AUDIT-2026-981023",
  "timestamp": "2026-08-31T22:12:45.102Z",
  "toolName": "create_work_order",
  "agentRole": "OPERATIONS",
  "callerSessionId": "sess-bedrock-core-0912",
  "autonomyLevel": "EXECUTE",
  "policyPassed": true,
  "humanApprovalRef": "DEC-94021",
  "inputPayloadHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "outputPayloadHash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
  "executionDurationMs": 118,
  "status": "SUCCESS"
}
```
