import { SentinelScenario } from '../types/sentinel';

export const SENTINEL_SCENARIOS: SentinelScenario[] = [
  {
    id: 'rift-valley-water-cavitation',
    title: 'Rift Valley Hydraulic Basin: Pump 03 Cavitation & Surge',
    subtitle: 'Primary Water Transmission Line — Naivasha/Mathare Sector',
    bioregion: 'East Africa Great Rift Basin (Naivasha Watershed)',
    description: 'High-frequency cavitation detected in Main Multi-Stage Pump 03 with rapid upstream pressure oscillations and coliform filtration risk.',
    initialPrompt: 'Find the most urgent infrastructure issue and prepare the safest intervention.',
    targetAsset: {
      id: 'ASSET-HYD-NAIVASHA-03',
      name: 'Naivasha Multi-Stage Booster Pump 03',
      bioregion: 'East Africa Great Rift Basin',
      assetType: 'Hydraulic Pumping Station',
      status: 'CRITICAL_FAILING',
      safetyLimits: {
        maxSafePressureBar: 14.5,
        maxVibrationMmSec: 4.5,
        minReserveLiters: 12000,
        criticalTempCelsius: 85.0
      },
      activeTelemetry: [
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-VIB-01',
          sensorName: 'Pump 03 Impeller Bearing Vibration',
          category: 'vibration_harmonics',
          unit: 'mm/s RMS',
          nominalValue: 1.8,
          currentValue: 8.42,
          zScore: 4.82,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        },
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-PRS-02',
          sensorName: 'Manifold Discharge Pressure',
          category: 'hydraulic_pressure',
          unit: 'bar',
          nominalValue: 8.5,
          currentValue: 13.9,
          zScore: 3.91,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        },
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-FLW-03',
          sensorName: 'Primary Outlet Flow Velocity',
          category: 'flow_rate',
          unit: 'L/s',
          nominalValue: 52.0,
          currentValue: 27.4,
          zScore: 3.44,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        },
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-TURB-04',
          sensorName: 'Post-Filtration Turbidity',
          category: 'microbial_turbidity',
          unit: 'NTU',
          nominalValue: 0.42,
          currentValue: 1.88,
          zScore: 3.12,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        },
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-TEMP-05',
          sensorName: 'Motor Stator Core Temp',
          category: 'thermal_core',
          unit: '°C',
          nominalValue: 54.0,
          currentValue: 78.6,
          zScore: 2.85,
          isAnomalous: false,
          provenance: 'OBSERVED',
          edgeBuffered: true
        }
      ]
    },
    simulatedAnomalousTelemetry: [
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-VIB-01',
        sensorName: 'Pump 03 Impeller Bearing Vibration',
        category: 'vibration_harmonics',
        unit: 'mm/s RMS',
        nominalValue: 1.8,
        currentValue: 8.42,
        zScore: 4.82,
        isAnomalous: true,
        provenance: 'OBSERVED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-PRS-02',
        sensorName: 'Manifold Discharge Pressure',
        category: 'hydraulic_pressure',
        unit: 'bar',
        nominalValue: 8.5,
        currentValue: 13.9,
        zScore: 3.91,
        isAnomalous: true,
        provenance: 'OBSERVED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-FLW-03',
        sensorName: 'Primary Outlet Flow Velocity',
        category: 'flow_rate',
        unit: 'L/s',
        nominalValue: 52.0,
        currentValue: 27.4,
        zScore: 3.44,
        isAnomalous: true,
        provenance: 'OBSERVED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-TURB-04',
        sensorName: 'Post-Filtration Turbidity',
        category: 'microbial_turbidity',
        unit: 'NTU',
        nominalValue: 0.42,
        currentValue: 1.88,
        zScore: 3.12,
        isAnomalous: true,
        provenance: 'OBSERVED',
        edgeBuffered: true
      }
    ],
    historicalMatches: [
      {
        id: 'POST-MORTEM-2021-08-RIFT',
        title: '2021 Naivasha Intake Suction Head Blockage & Impeller Delamination',
        year: 2021,
        bioregion: 'East Africa Great Rift Basin',
        rootCause: 'Intake screen silt accumulation caused suction head drop, inducing severe cavitation vapor bubbles that eroded impeller vanes.',
        mitigationApplied: 'Automated pressure bypass valve opened immediately to relieve suction vacuum, followed by rapid backflush sequence.',
        similarityScore: 94.6,
        lessonsLearned: [
          'Direct pump power cutoff without pressure relief causes water hammer backflow.',
          'Bypass loop reroute maintains 65% municipal gravity feed with zero cavitation damage.',
          'Local watershed guild must inspect silt barrier within 2 hours.'
        ]
      },
      {
        id: 'POST-MORTEM-2019-11-TURKANA',
        title: '2019 Turkana Solar Aquifer Submersible Motor Overpressure',
        year: 2019,
        bioregion: 'East Africa Arid Zone',
        rootCause: 'Discharge throttle failure caused backpressure exceeding 15 bar, fracturing pipe seals.',
        mitigationApplied: 'Dual pressure-relief solenoids installed with automated variable-frequency derating.',
        similarityScore: 82.1,
        lessonsLearned: [
          'Never execute hard shutoff above 13 bar discharge pressure.',
          'VFD frequency derate must ramp down at < 1.5 Hz/second.'
        ]
      }
    ],
    candidateInterventions: [
      {
        id: 'INT-ALPHA-BYPASS-REROUTE',
        title: 'Option Alpha: Automated SCADA Bypass Loop + VFD Derate to 35Hz + Guild Dispatch',
        strategy: 'AUTOMATED_SCADA_BYPASS',
        description: 'Actuates motorized relief valve BV-02 to 40% open, reduces VFD pump speed to 35Hz (preventing cavitation collapse), and dispatches local Naivasha Water Guild for physical intake screen cleaning.',
        residualRisk: 0.08,
        financialCostUsd: 420,
        downtimeHours: 0.0,
        flourishingPreservation: 98.4,
        deterministicSafetyScore: 0.96,
        paretoRank: 1,
        compositeUtilityScore: 94.2,
        safetyVerdict: 'CLEARED_SAFE',
        safetyRationale: 'Maintains minimum gravity feed (32 L/s) to 14,000 residents while dropping manifold pressure to 8.2 bar (well below 14.5 bar ceiling).',
        actuationSteps: [
          'SCADA Command: ACTUATE_VALVE_BV02(position=40%, ramp_sec=3)',
          'VFD Controller: SET_FREQUENCY(target_hz=35.0, slew_rate=1.2Hz/s)',
          'Guild Dispatch: TICKET_CREATE("Naivasha Basin Guild Intake Screen Clearing - Priority 1")'
        ]
      },
      {
        id: 'INT-BETA-HIGH-VOLTAGE-FLUSH',
        title: 'Option Beta: High-Pressure Reverse Backflush at 100% Motor Torque',
        strategy: 'HIGH_VOLTAGE_FLUSH',
        description: 'Instantly reverses pump rotational direction under full electrical load to dislodge silt from intake screen.',
        residualRisk: 0.68,
        financialCostUsd: 1200,
        downtimeHours: 1.5,
        flourishingPreservation: 61.2,
        deterministicSafetyScore: 0.38,
        paretoRank: 3,
        compositeUtilityScore: 41.5,
        safetyVerdict: 'VIOLATION_BLOCKED',
        safetyRationale: 'SAFETY INVARIANT VIOLATION: Reverse hydraulic shock exceeds 16.2 bar, exceeding maximum pipe burst safety limit (14.5 bar). Risk of manifold rupture is 74%.',
        actuationSteps: [
          'SCADA Command: REVERSE_MOTOR_TORQUE(instant=true) [BLOCKED BY SAFETY FIREWALL]'
        ]
      },
      {
        id: 'INT-GAMMA-MANUAL-ISOLATION',
        title: 'Option Gamma: Full Emergency Power Cutoff & Total Grid Isolation',
        strategy: 'CONTROLLED_SHUTDOWN',
        description: 'Trips main circuit breaker to immediately shut down pump. Requires manual field technician restart after 18-36 hours.',
        residualRisk: 0.22,
        financialCostUsd: 3800,
        downtimeHours: 24.0,
        flourishingPreservation: 48.0,
        deterministicSafetyScore: 0.88,
        paretoRank: 2,
        compositeUtilityScore: 68.4,
        safetyVerdict: 'REQUIRES_DUAL_KEY',
        safetyRationale: 'High human impact: cuts clean water access to 14,000 residents for 24+ hours. Safe from rupture but poor flourishing preservation.',
        actuationSteps: [
          'SCADA Command: TRIP_MAIN_BREAKER_CB01',
          'Lockout-Tagout dispatch to regional facility'
        ]
      }
    ],
    baselineStabilizationTelemetry: [
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-VIB-01',
        sensorName: 'Pump 03 Impeller Bearing Vibration',
        category: 'vibration_harmonics',
        unit: 'mm/s RMS',
        nominalValue: 1.8,
        currentValue: 1.45,
        zScore: 0.42,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-PRS-02',
        sensorName: 'Manifold Discharge Pressure',
        category: 'hydraulic_pressure',
        unit: 'bar',
        nominalValue: 8.5,
        currentValue: 8.12,
        zScore: 0.38,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-FLW-03',
        sensorName: 'Primary Outlet Flow Velocity',
        category: 'flow_rate',
        unit: 'L/s',
        nominalValue: 52.0,
        currentValue: 34.8,
        zScore: 0.65,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-TURB-04',
        sensorName: 'Post-Filtration Turbidity',
        category: 'microbial_turbidity',
        unit: 'NTU',
        nominalValue: 0.42,
        currentValue: 0.38,
        zScore: 0.21,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      }
    ]
  },
  {
    id: 'cascadia-microgrid-harmonics',
    title: 'Cascadia Hydro-Thermal Microgrid: Phase Resonance & Thermal Overload',
    subtitle: 'Salish Bioregion — Skagit Clean Energy Substation 02',
    bioregion: 'Cascadia / Salish Sea Bioregion',
    description: 'Third-order harmonic resonance in solar-hydro inverter bus causing transformer overheating and frequency wobble.',
    initialPrompt: 'Identify highest priority microgrid anomaly and prepare the safest stabilizing intervention.',
    targetAsset: {
      id: 'ASSET-ELEC-SKAGIT-02',
      name: 'Skagit Substation Hydro-Solar Transformer Unit',
      bioregion: 'Cascadia / Salish Sea Bioregion',
      assetType: 'Microgrid Substation',
      status: 'CRITICAL_FAILING',
      safetyLimits: {
        maxSafePressureBar: 0,
        maxVibrationMmSec: 1.2,
        minReserveLiters: 0,
        criticalTempCelsius: 90.0
      },
      activeTelemetry: [
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-THD-01',
          sensorName: 'Bus Voltage Total Harmonic Distortion',
          category: 'power_frequency',
          unit: '% THD',
          nominalValue: 1.8,
          currentValue: 9.4,
          zScore: 4.62,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        },
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-FREQ-02',
          sensorName: 'Grid Frequency Stability',
          category: 'power_frequency',
          unit: 'Hz',
          nominalValue: 60.0,
          currentValue: 58.7,
          zScore: 3.88,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        },
        {
          timestamp: new Date().toISOString(),
          sensorId: 'SEN-THERM-03',
          sensorName: 'Transformer Core Oil Temperature',
          category: 'thermal_core',
          unit: '°C',
          nominalValue: 55.0,
          currentValue: 88.4,
          zScore: 4.12,
          isAnomalous: true,
          provenance: 'OBSERVED',
          edgeBuffered: true
        }
      ]
    },
    simulatedAnomalousTelemetry: [
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-THD-01',
        sensorName: 'Bus Voltage Total Harmonic Distortion',
        category: 'power_frequency',
        unit: '% THD',
        nominalValue: 1.8,
        currentValue: 9.4,
        zScore: 4.62,
        isAnomalous: true,
        provenance: 'OBSERVED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-FREQ-02',
        sensorName: 'Grid Frequency Stability',
        category: 'power_frequency',
        unit: 'Hz',
        nominalValue: 60.0,
        currentValue: 58.7,
        zScore: 3.88,
        isAnomalous: true,
        provenance: 'OBSERVED',
        edgeBuffered: true
      }
    ],
    historicalMatches: [
      {
        id: 'POST-MORTEM-2022-04-SKAGIT',
        title: '2022 Skagit Inverter Phase Synchronization Failure',
        year: 2022,
        bioregion: 'Cascadia / Salish Sea Bioregion',
        rootCause: 'Solar inverter array switched faster than hydro turbine governor could track, creating inductive phase lock.',
        mitigationApplied: 'Synchronous condenser switched in with automated 15% inverter curtailment.',
        similarityScore: 91.2,
        lessonsLearned: [
          'Do not isolate solar inverter completely; step down curtailment in 5% increments.',
          'Activate battery flywheel for fast 100ms frequency damping.'
        ]
      }
    ],
    candidateInterventions: [
      {
        id: 'INT-ALPHA-FREQUENCY-DAMPING',
        title: 'Option Alpha: Dynamic Inverter Curtailment (12%) + Battery Flywheel Damping',
        strategy: 'AUTOMATED_SCADA_BYPASS',
        description: 'Steps down solar array generation by 12% via SCADA inverter bus controller and commands local 250kWh battery flywheel into active frequency damping mode.',
        residualRisk: 0.05,
        financialCostUsd: 180,
        downtimeHours: 0.0,
        flourishingPreservation: 99.2,
        deterministicSafetyScore: 0.98,
        paretoRank: 1,
        compositeUtilityScore: 96.8,
        safetyVerdict: 'CLEARED_SAFE',
        safetyRationale: 'Maintains continuous grid power to hospitals and cold chain storage while bringing THD below 2.0% within 1.8 seconds.',
        actuationSteps: [
          'SCADA Command: SET_INVERTER_CURTAILMENT(percent=12.0)',
          'SCADA Command: ACTIVATE_BATTERY_FLYWHEEL(mode="FREQUENCY_REGULATION_HIGH_Q")'
        ]
      }
    ],
    baselineStabilizationTelemetry: [
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-THD-01',
        sensorName: 'Bus Voltage Total Harmonic Distortion',
        category: 'power_frequency',
        unit: '% THD',
        nominalValue: 1.8,
        currentValue: 1.95,
        zScore: 0.22,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-FREQ-02',
        sensorName: 'Grid Frequency Stability',
        category: 'power_frequency',
        unit: 'Hz',
        nominalValue: 60.0,
        currentValue: 60.01,
        zScore: 0.05,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      },
      {
        timestamp: new Date().toISOString(),
        sensorId: 'SEN-THERM-03',
        sensorName: 'Transformer Core Oil Temperature',
        category: 'thermal_core',
        unit: '°C',
        nominalValue: 55.0,
        currentValue: 59.2,
        zScore: 0.45,
        isAnomalous: false,
        provenance: 'VERIFIED',
        edgeBuffered: true
      }
    ]
  }
];
