# ATLAS STEWARD: SAFETY & GOVERNANCE SPECIFICATION
**Autonomous Operational Boundaries & Human-in-the-Loop Safeguards**

---

## 1. The 4 Autonomy Levels

Atlas Steward enforces four strict levels of operational autonomy:

```
┌─────────────┬────────────────────────────────────────────────────────────────────────┐
│ Level       │ Definition & Permitted Actions                                         │
├─────────────┼────────────────────────────────────────────────────────────────────────┤
│ OBSERVE     │ Read-only telemetry, status queries, sensor sampling, log audits.     │
│ RECOMMEND   │ Complex trade-off synthesis, option modeling, blast radius calculation.│
│ PREPARE     │ Draft work orders, request supplier quotes, stage parts in inventory.  │
│ EXECUTE     │ Dispatch technicians, trigger backwashes, adjust motor frequencies.    │
└─────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Policy Enforcement Matrix

| Trigger / Action Type | Autonomy Rule | Action Outcome |
| :--- | :--- | :--- |
| **Routine Sensor Calibration** | `POL-05-ROUTINE` | **AUTOMATIC (Silent Execution)** |
| **Routine Scheduled Inspection** | `POL-05-ROUTINE` | **AUTOMATIC (Silent Execution)** |
| **Pre-Approved Reorder (≤ $500)** | `POL-03-SPEND` | **AUTOMATIC (Silent Execution)** |
| **Spend Exceeds $500 Threshold** | `POL-03-SPEND` | **HUMAN APPROVAL REQUIRED** |
| **Zone Outage > 2 Hours** | `POL-04-ESSENTIAL` | **HUMAN APPROVAL REQUIRED** |
| **Sensitive Member Data / PII** | `POL-01-SENSITIVE` | **HUMAN APPROVAL REQUIRED** |
| **Emergency Burst Cutoff** | `POL-02-EMERGENCY` | **AUTOMATIC PROTECTIVE ACTION** |

---

## 3. Human Approval Controls in the Cockpit

When an exception is escalated, the operator has four inviolable controls:

- **APPROVE**: Authorizes the agent's recommended action, dispatches the work order, and anchors the verified outcome into memory.
- **REJECT**: Dismisses the recommendation; agent maintains the default safe fallback posture.
- **MODIFY**: Allows the human to adjust parameters (e.g. choose an alternative contractor, limit repair spend, add custom field notes).
- **PAUSE**: Freezes the autonomous loop immediately across all assets for emergency inspection.
