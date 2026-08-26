# ATLAS SANCTUM — Systems Dynamics & Modelling Engine
## Regional Energy Infrastructure & Decentralized Storage Commons Demo Scope

---

## 1. Executive Summary & Problem Context

In decentralized renewable transitions across vulnerable bioregions (such as the Nairobi River Basin, Mathare Valley, and East African peri-urban corridors), energy access challenges cannot be resolved through siloed hardware deployment. Uncoordinated solar installations frequently suffer from battery over-cycling, lack of local maintenance capacity, tariff friction, and unbuffered grid instability.

The **Regional Energy Infrastructure Model** within the **Atlas Sanctum Systems Dynamics & Modelling Engine** operationalizes a dynamic, multi-capital model of a resilient community microgrid and agrivoltaic commons.

### Core Reality Pipeline Loop
```text
PHYSICAL REALITY (Smart Meters, Inverters, Cold Hub Temperature Sensors, Battery BMS)
   ↓
EVIDENCE & OBSERVATION (Cryptographic Signatures, Epistemic Status: Observed vs Inferred)
   ↓
SYSTEMS DYNAMICS SIMULATION (Euler Numerical Integration, Stocks & Flows, Causal Loops)
   ↓
ETHICAL & CONSTITUTIONAL REVIEW (Moral Boundaries, FPIC Verification, Ten Commandments)
   ↓
LEVERAGE INTERVENTION DISPATCH (Donella Meadows Leverage Tiers → Agent DAG Missions)
   ↓
FIELD EXECUTION & TELEMETRY VERIFICATION (Microgrid Guild Work Orders, Hardware Actuation)
   ↓
MODEL CALIBRATION & FAILURE LEDGER (Closing Variance, Compounding Reusable Intelligence)
```

---

## 2. Key Model Stocks (Multi-Capital State Variables)

A **Stock** in Atlas Sanctum represents a state variable accumulating or depleting over time governed by differential calculus:
$$\frac{d(\text{Stock}_i)}{dt} = \sum \text{Inflows}_i(t) - \sum \text{Outflows}_i(t)$$

| Stock ID | Name | Capital Category | Unit | Initial Value | Range | Epistemic Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `stock-clean-energy-generation` | **Decentralized Clean Solar Power Capacity** | Manufactured | kW Peak | 45.0 | 10.0 – 350.0 | `Observed` | Installed PV generation capacity across residential rooftops and agrivoltaic arrays. |
| `stock-battery-storage-buffer` | **Battery Storage Capacity (BESS)** | Manufactured | kWh | 120.0 | 20.0 – 800.0 | `Observed` | Decentralized Lithium-Iron-Phosphate (LFP) energy storage buffer stabilizing grid volatility. |
| `stock-grid-stability` | **Microgrid Stability & Power Quality Index** | Manufactured | Index (0–100) | 72.0 | 0.0 – 100.0 | `Model Inference` | Dynamic measure of voltage/frequency stability, phase balancing, and outage resilience. |
| `stock-cold-storage-inventory` | **Agricultural Cold Storage Food Integrity** | Natural / Human | Metric Tons | 18.5 | 0.0 – 150.0 | `Observed` | Fresh produce preserved at temperature-regulated solar cold storage hubs, preventing market spoilage. |
| `stock-community-wealth` | **Retained Community Wealth Commons** | Financial | USD | $14,200 | $1k – $500k | `Known` | Cumulative retained savings and P2P microgrid tariff revenue reinvested in community assets. |
| `stock-youth-guild-capacity` | **Youth Maintenance Guild Capacity** | Human / Social | Certified Technicians | 8.0 | 2.0 – 60.0 | `Observed` | Locally certified solar electrical and battery systems maintenance operators. |
| `stock-hydrologic-buffer` | **Riparian Bio-Swale Infiltration** | Natural | m³ / day | 850.0 | 100.0 – 5,000.0 | `Imported Data` | Natural water retention buffer filtering runoff adjacent to agrivoltaic arrays. |

---

## 3. Key Model Flows (Differential Rate Equations)

| Flow ID | Flow Name | Source Stock | Target Stock | Nominal Rate | Governed Equation / Rate Mechanism |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `flow-solar-generation-inflow` | **Solar Inflow Generation** | Environment (Cloud) | `stock-clean-energy-generation` | 3.5 kWp/mo | Expansion of rooftop PV installations and community co-investments. |
| `flow-pv-degradation-outflow` | **PV Module Degradation** | `stock-clean-energy-generation` | Environment (Sink) | 0.8% / year | Thermal aging, soiling, and weather degradation mitigated by cleaning schedules. |
| `flow-bess-charging-inflow` | **BESS Charging Inflow** | `stock-clean-energy-generation` | `stock-battery-storage-buffer` | 18.0 kWh/step | Midday excess solar generation routed into storage buffers. |
| `flow-bess-discharge-outflow` | **BESS Discharging & Load** | `stock-battery-storage-buffer` | `stock-grid-stability` | 14.5 kWh/step | Evening peak dispatch and cold storage compressor support. |
| `flow-cold-hub-spoilage-prevention` | **Spoilage Avoidance Inflow** | `stock-battery-storage-buffer` | `stock-cold-storage-inventory` | 4.2 Tons/mo | Refrigeration reliability protecting perishable vegetables and dairy. |
| `flow-p2p-revenue-inflow` | **P2P Tariff Reinvestment** | `stock-grid-stability` | `stock-community-wealth` | $1,850 / mo | Distributed local electricity payments kept within the local circular economy. |
| `flow-technician-graduation` | **Guild Apprenticeship Inflow** | Environment | `stock-youth-guild-capacity` | 1.2 Techs/mo | Local vocational training program in inverter maintenance and battery diagnostics. |

---

## 4. Key Variables & Policy Knobs

| Variable ID | Name | Type | Value | Range | Policy Lever? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `var-solar-insolation` | Solar Peak Sun Hours | Exogenous | 5.8 hrs/day | 3.0 – 7.5 | No | Bioregional seasonal solar irradiance in the Nairobi River Basin. |
| `var-battery-roundtrip-efficiency` | BESS Round-Trip Efficiency | Intermediate | 91.5% | 75% – 96% | Yes | Inverter/battery efficiency factor influencing conversion losses. |
| `var-p2p-tariff-rate` | Community P2P Tariff | Policy Knob | $0.12 / kWh | $0.05 – $0.28 | Yes | Local energy trade price (compared to $0.22/kWh national grid tariff). |
| `var-fpic-compliance-rate` | FPIC Community Consent Score | Governance | 98.0% | 0% – 100% | Yes | Free, Prior, and Informed Consent verification with village elder councils. |
| `var-unplanned-outage-hours` | Grid Outage Exposure | Indicator | 3.2 hrs/mo | 0.0 – 48.0 | Yes (Target) | Downtime avoided through localized battery islanding capabilities. |

---

## 5. Feedback Loops & System Structure

```
                  ┌────────────────────────────────────────────────────────┐
                  ▼                                                        │
┌───────────────────────────────────┐    Midday Solar Charge   ┌────────────────────────────────┐
│   Clean Solar Power Capacity      │─────────────────────────▶│    Battery Storage (BESS)      │
│   (Stock: Clean Energy)           │                          │    (Stock: Storage Buffer)     │
└───────────────────────────────────┘                          └────────────────────────────────┘
                  │                                                            │
       Solar      │                                                            │ Evening Peak
       Expansion  │                                                            │ Power Dispatch
                  ▼                                                            ▼
┌───────────────────────────────────┐                          ┌────────────────────────────────┐
│   Community Wealth Commons        │◀─────────────────────────│   Microgrid Grid Stability     │
│   (Stock: Retained Capital)       │    P2P Tariff Revenues   │   (Stock: Power Quality Index) │
└───────────────────────────────────┘                          └────────────────────────────────┘
                  │                                                            ▲
                  │ Reinvests Capital                                          │
                  ▼                                                            │
┌───────────────────────────────────┐   Maintenance & Calibration              │
│   Youth Maintenance Guild         │──────────────────────────────────────────┘
│   (Stock: Human Capacity)         │
└───────────────────────────────────┘
```

### Reinforcing Loop R1: Solar Capital Accumulation
1. Increased Solar Power Capacity $\rightarrow$ Higher daily MWh generation
2. Higher generation $\rightarrow$ More energy traded via local P2P microgrid tariff
3. Increased P2P tariff revenues $\rightarrow$ Retained Community Wealth Commons expands
4. Reinvestment fund finances additional solar arrays $\rightarrow$ Closes reinforcing loop $(+)$

### Reinforcing Loop R2: Agrivoltaic Food-Energy Nexus
1. Battery Storage Buffer guarantees 24/7 cold storage hub uptime
2. Cold storage uptime eliminates agricultural produce spoilage for 180+ vendors
3. Higher market vendor revenues increase willingness-to-pay for local microgrid power
4. Expanded local power demand drives further microgrid investment $\rightarrow$ Closes reinforcing loop $(+)$

### Balancing Loop B1: Battery Degradation & Guild Maintenance
1. Increased battery discharge cycles increase cell wear and thermal degradation
2. Degradation signals trigger smart inverter telemetry alerts
3. Youth Maintenance Guild performs preventive balancing, cooling servicing, and module replacements
4. Restores battery health and life expectancy $\rightarrow$ Stabilizing balancing loop $(-)$

### Balancing Loop B2: Grid Peak Congestion Stabilization
1. High grid demand strains local transformer nodes
2. Smart inverters trigger automated peak shaving from distributed BESS buffers
3. Voltage drops and frequency sags are mitigated
4. Outages avoided without diesel generator dispatch $\rightarrow$ Stabilizing balancing loop $(-)$

---

## 6. Donella Meadows Leverage Hierarchy

Atlas Sanctum arranges all potential policy and physical interventions according to Donella Meadows' 12 Leverage Points:

```text
[HIGH LEVERAGE - Tiers 1-3]
 1. Transcending Paradigms (Power as a Common Heritage)
 2. Mindset / Paradigm (Shift from centralized extractive utility to distributed commons)
 3. Goals of the System (Flourishing, resilience, and local equity over corporate profit)

[MEDIUM LEVERAGE - Tiers 4-6]
 4. Self-Organization (Youth maintenance guilds self-governing local microgrid protocols)
 5. Rules of the System (P2P tariff structure & transparent dynamic pricing)
 6. Information Flows (Real-time telemetry visibility to every community member)

[STRUCTURAL LEVERAGE - Tiers 7-9]
 7. Driving Positive Loops (Reinvesting tariff surplus into next-generation assets)
 8. Strength of Negative Loops (Automated load shedding & thermal battery protection)
 9. System Delays (Shortening supply chain & repair turnaround from 30 days to 4 hours)

[PARAMETRIC LEVERAGE - Tiers 10-12]
 10. Buffer Sizes (Expanding BESS storage capacity from 120 kWh to 450 kWh)
 11. Material Structure (Wiring topology, agrivoltaic dual-land use)
 12. Parameters / Subsidies (Tariff rates, technician stipends)
```

---

## 7. Primary Demonstration Intervention Scenario

### "Distributed Storage Deployment & Agrivoltaic Microgrid Commons"

#### Intervention Specification
* **Target Entity**: `stock-battery-storage-buffer` + `stock-youth-guild-capacity`
* **Leverage Level**: Tier 3 (Information Rules & Commons Governance) + Tier 10 (Buffer Expansion)
* **Cost**: $34,500 USD
* **Time Horizon**: 24 Months
* **Mechanism**: Deploy 180 kWh modular LFP battery storage banks paired with open-source smart inverters across 4 cold storage hubs and community clinics; fund an 8-person Youth Apprenticeship Guild for local O&M.
* **Target Parameters**:
  * `var-battery-roundtrip-efficiency`: $+6.2\%$
  * `flow-bess-charging-inflow`: $+250\%$
  * `flow-cold-hub-spoilage-prevention`: $+180\%$
  * `var-unplanned-outage-hours`: $-92\%$ (reduced from 3.2 hrs/mo to 0.25 hrs/mo)
* **Expected Outcome**:
  * $89,400 USD retained local wealth over 24 months.
  * Zero food spoilage during 4 major regional blackout events.
  * 100% verifiable carbon avoidance telemetry anchored in cryptographically signed inverter logs.
* **Ethical Constraints**: Verified Free, Prior, and Informed Consent (FPIC) signed with Mathare Village Elder Councils; zero displacement of agricultural plots; open tariff accounting.

---

## 8. Epistemic Provenance & Constitutional Invariants

To avoid misleading models and "dashboard idolatry", every data point in Atlas Sanctum is tagged with its epistemic classification:

1. **Observed**: Hardware sensor readings (e.g., Shelly Pro 3EM smart meter, Victron Cerbo GX telemetry, BMS cell voltages).
2. **Imported Data**: Validated public or satellite datasets (e.g., PVGIS solar insolation, Copernicus hydrologic runoff).
3. **Model Inference / Inferred**: Output of calibrated differential equations and physics-based state estimators.
4. **AI Hypothesis**: Agent-generated catalytic interventions awaiting human domain expert and community validation.
5. **Assumed**: Baseline parameters explicitly flagged with sensitivity boundaries.

### Ten Constitutional Principles in Energy Modelling
* **No Idols**: The model is a decision aid, never a substitute for direct community observation and physical voltage telemetry.
* **Do Not Steal**: Local solar generation data and economic surplus belong to the community commons, not external extractors.
* **Do Not Bear False Witness**: Model confidence intervals ($p < 0.05$) and simulation uncertainties are always visible in UI charts.
* **Remember the Sabbath**: System design factors in maintenance rest cycles and avoids continuous 24/7 operator burnout.

---

## 9. Next Steps for Developer Integration

1. **Run Simulation Engine**: Utilize `useSystemsModel()` in `src/hooks/useSystemsModel.ts` to execute client-side Euler integration or stream from the server.
2. **Interactive UI View**: Open `SystemModelStudioView.tsx` (`src/components/views/SystemModelStudioView.tsx`) to explore the Causal Map, Stocks & Flows hierarchy, Meadows Leverage matrix, and counterfactual scenario plots.
3. **Dispatch to Mission Control**: Click "Initiate Mission with Intervention" on any candidate intervention to convert simulated interventions into actionable Agent DAG missions.
