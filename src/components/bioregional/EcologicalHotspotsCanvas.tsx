import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Droplets,
  Zap,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Sliders,
  Maximize2,
  ShieldAlert,
  Info,
  Compass,
  CheckCircle2,
  X,
  Activity,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type ScarcityResourceType = 'all' | 'water' | 'energy' | 'nutrient';

export interface ScarcityZone {
  id: string;
  name: string;
  type: 'water' | 'energy' | 'nutrient';
  lng: number; // 34.8 to 37.2
  lat: number; // -1.7 to -0.2
  severity: number; // 0 to 100
  affectedHectares: number;
  populationImpacted: number;
  primaryDriver: string;
  telemetrySourceNode: string;
  inSituMetric: string;
  recommendedIntervention: string;
  cryptoProofHash: string;
}

export const SCARCITY_ZONES: ScarcityZone[] = [
  // Water Scarcity Epicenters
  {
    id: 'scarcity-wat-01',
    name: 'Talek Perennial Sub-basin Baseflow Deficit',
    type: 'water',
    lng: 35.20,
    lat: -1.55,
    severity: 86,
    affectedHectares: 18400,
    populationImpacted: 32000,
    primaryDriver: 'Upstream horticultural over-abstraction & dry-season baseflow compression',
    telemetrySourceNode: 'Acoustic Doppler Piezometer Node #TK-04',
    inSituMetric: 'Baseflow: 1.8 m³/s (Threshold < 3.2 m³/s) • -43% Deficit',
    recommendedIntervention: 'Enforce rotational baseflow extraction accord & activate sand dam subsurface retention swales',
    cryptoProofHash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a'
  },
  {
    id: 'scarcity-wat-02',
    name: 'Lake Naivasha Volcanic Aquifer Depression Cone',
    type: 'water',
    lng: 36.36,
    lat: -0.76,
    severity: 78,
    affectedHectares: 12600,
    populationImpacted: 45000,
    primaryDriver: 'Industrial greenhouse deep-well abstraction exceeding recharge velocity',
    telemetrySourceNode: 'Subsurface Piezometer Cluster #NV-09',
    inSituMetric: 'Piezometric Head: -4.8m below 10-year historical baseline',
    recommendedIntervention: 'Mandate closed-loop rainwater cistern recirculators & subsoil recharge trenches',
    cryptoProofHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d'
  },
  {
    id: 'scarcity-wat-03',
    name: 'Mathare Riparian Flash-Runoff Siltation Choke',
    type: 'water',
    lng: 36.88,
    lat: -1.26,
    severity: 72,
    affectedHectares: 3400,
    populationImpacted: 110000,
    primaryDriver: 'Impervious surface urban runoff and riverbank erosion during monsoon pulses',
    telemetrySourceNode: 'Mathare Turbidity & Flow Sensor #MT-01',
    inSituMetric: 'Turbidity: 480 NTU (Critical sediment load) • 82% Runoff velocity surge',
    recommendedIntervention: 'Deploy dense vetiver bio-swale filters and terraced gabion silt-traps',
    cryptoProofHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f'
  },

  // Energy Scarcity Epicenters
  {
    id: 'scarcity-nrg-01',
    name: 'Mara Pastoralist Microgrid Curtailment Pocket',
    type: 'energy',
    lng: 35.45,
    lat: -1.42,
    severity: 68,
    affectedHectares: 24000,
    populationImpacted: 19000,
    primaryDriver: 'Solar-PV battery storage saturation deficit during night-time milk cooling hours',
    telemetrySourceNode: 'Smart Distributed Inverter Gateway #MR-PV-07',
    inSituMetric: 'Storage Deficit: 46% unserved peak cooling load • 120 kWh nightly gap',
    recommendedIntervention: 'Deploy communal second-life iron-phosphate storage banks and bi-directional microgrid balancing',
    cryptoProofHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
  },
  {
    id: 'scarcity-nrg-02',
    name: 'Kikuyu Escarpment Biomass Pyrolysis Thermal Gap',
    type: 'energy',
    lng: 36.62,
    lat: -0.98,
    severity: 59,
    affectedHectares: 8900,
    populationImpacted: 14000,
    primaryDriver: 'Reliance on traditional firewood kilns causing 74% thermal dissipation',
    telemetrySourceNode: 'Thermal Pyrolysis Telemetry Sensor #KE-TH-02',
    inSituMetric: 'Thermal Efficiency: 18% • 6.2 tonnes daily charcoal biomass waste',
    recommendedIntervention: 'Scale rocket-retort biochar pyrolyzers to capture waste heat for district drying',
    cryptoProofHash: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'
  },

  // Nutrient Scarcity Epicenters
  {
    id: 'scarcity-nut-01',
    name: 'South Rift Volcanic Soil Phosphorus Lockup Zone',
    type: 'nutrient',
    lng: 36.18,
    lat: -1.15,
    severity: 82,
    affectedHectares: 31000,
    populationImpacted: 28000,
    primaryDriver: 'High volcanic allophane fixing plant-available phosphate into insoluble minerals',
    telemetrySourceNode: 'Rhizosphere Ion-Selective Sensor Array #SR-NUT-11',
    inSituMetric: 'Available Bray-P: 4.2 ppm (Severely deficient) • pH 5.2 acidification',
    recommendedIntervention: 'Inoculate with native endo-mycorrhizal fungi (Glomus) and composted biochar solubilizers',
    cryptoProofHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
  },
  {
    id: 'scarcity-nut-02',
    name: 'Mara Transboundary Grazing Siltation & Nitrogen Void',
    type: 'nutrient',
    lng: 35.08,
    lat: -1.62,
    severity: 74,
    affectedHectares: 21500,
    populationImpacted: 16500,
    primaryDriver: 'Continuous unrotated cattle grazing causing compaction and microbial asphyxiation',
    telemetrySourceNode: 'Soil Respiration Mesh Node #MR-SOIL-03',
    inSituMetric: 'Microbial Biomass Carbon: 92 mg/kg (Critical low) • SOM 1.2%',
    recommendedIntervention: 'Implement holistic planned rotational bunched-grazing to stimulate dung beetle soil aerators',
    cryptoProofHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e'
  }
];

export interface EcologicalHotspotsCanvasProps {
  onSelectZone?: (zone: ScarcityZone) => void;
  selectedZoneId?: string | null;
  showControls?: boolean;
}

export const EcologicalHotspotsCanvas: React.FC<EcologicalHotspotsCanvasProps> = ({
  onSelectZone,
  selectedZoneId,
  showControls = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter & Layer States
  const [activeLayers, setActiveLayers] = useState<{ water: boolean; energy: boolean; nutrient: boolean }>({
    water: true,
    energy: true,
    nutrient: true
  });
  const [hotspotOpacity, setHotspotOpacity] = useState<number>(0.85);
  const [isLayersManagerOpen, setIsLayersManagerOpen] = useState<boolean>(false);
  const [minSeverity, setMinSeverity] = useState<number>(50);
  const [isPulsing, setIsPulsing] = useState<boolean>(true);
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.75);
  const [selectedZone, setSelectedZone] = useState<ScarcityZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<ScarcityZone | null>(null);
  const [canvasDim, setCanvasDim] = useState<{ width: number; height: number }>({ width: 850, height: 440 });

  const HIGH_RISK_THRESHOLD = 75;

  // Coordinates bounding box for East Africa Bioregional transect
  const BOUNDS = useMemo(() => ({
    minLng: 34.8,
    maxLng: 37.2,
    minLat: -1.7,
    maxLat: -0.2
  }), []);

  // Filtered scarcity zones based on active resource indicator layers and severity
  const filteredZones = useMemo(() => {
    return SCARCITY_ZONES.filter((z) => {
      const isLayerActive = activeLayers[z.type];
      const matchSeverity = z.severity >= minSeverity;
      return isLayerActive && matchSeverity;
    });
  }, [activeLayers, minSeverity]);

  // Detected high-risk threshold hotspots
  const criticalZones = useMemo(() => {
    return filteredZones.filter((z) => z.severity >= HIGH_RISK_THRESHOLD);
  }, [filteredZones]);

  // Coordinate projection from [lng, lat] to canvas pixel coordinates
  const project = (lng: number, lat: number, width: number, height: number): [number, number] => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * width;
    const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * height;
    return [x, y];
  };

  // Main Canvas Rendering Engine using requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick += 0.035;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear Canvas with deep transparent dark overlay
      ctx.clearRect(0, 0, width, height);

      // 2. Draw Cartographic Grid Lines
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      // Latitudinal lines
      for (let lat = -1.6; lat <= -0.3; lat += 0.3) {
        const [, y] = project(BOUNDS.minLng, lat, width, height);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Longitudinal lines
      for (let lng = 35.0; lng <= 37.0; lng += 0.5) {
        const [x] = project(lng, BOUNDS.maxLat, width, height);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset line dash

      // 3. Render Scarcity Heatmaps & Radiance Fields
      filteredZones.forEach((zone) => {
        const [cx, cy] = project(zone.lng, zone.lat, width, height);
        const isSelected = (selectedZone?.id === zone.id) || (selectedZoneId === zone.id);
        const isHovered = hoveredZone?.id === zone.id;

        // Base Radius scaled by severity and canvas width
        const baseRadius = (zone.severity / 100) * 85 * (width / 900);
        const pulse = isPulsing ? Math.sin(tick + zone.severity * 0.1) * 6 : 0;
        const radius = Math.max(25, baseRadius + pulse);

        // Color determination per scarcity resource type with hotspotOpacity scaling
        const op = hotspotOpacity;
        let coreColor = `rgba(244, 63, 94, ${(0.85 * op).toFixed(2)})`; // Rose (Water)
        let midColor = `rgba(244, 63, 94, ${(0.35 * op).toFixed(2)})`;
        let outerColor = 'rgba(244, 63, 94, 0.0)';
        let strokeColor = '#F43F5E';

        if (zone.type === 'energy') {
          coreColor = `rgba(245, 158, 11, ${(0.9 * op).toFixed(2)})`; // Amber (Energy)
          midColor = `rgba(245, 158, 11, ${(0.35 * op).toFixed(2)})`;
          outerColor = 'rgba(245, 158, 11, 0.0)';
          strokeColor = '#F59E0B';
        } else if (zone.type === 'nutrient') {
          coreColor = `rgba(168, 85, 247, ${(0.85 * op).toFixed(2)})`; // Purple (Nutrient)
          midColor = `rgba(168, 85, 247, ${(0.35 * op).toFixed(2)})`;
          outerColor = 'rgba(168, 85, 247, 0.0)';
          strokeColor = '#A855F7';
        }

        // Create Radial Gradient Scarcity Heatmap
        const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius * heatmapIntensity);
        gradient.addColorStop(0, coreColor);
        gradient.addColorStop(0.45, midColor);
        gradient.addColorStop(1, outerColor);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * heatmapIntensity, 0, Math.PI * 2);
        ctx.fill();

        // Concentric Isoline Scarcity Boundary Rings
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.globalAlpha = Math.min(1.0, (isSelected ? 0.95 : 0.5) * op);

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = Math.min(1.0, Math.max(0.3, op));

        // Pulsing Epicenter Core Marker
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(cx, cy, isSelected ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.globalAlpha = 1.0;

        // Highlight Crosshair if Selected or Hovered
        if (isSelected || isHovered) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);

          // Crosshair lines
          ctx.beginPath();
          ctx.moveTo(cx - radius - 15, cy);
          ctx.lineTo(cx + radius + 15, cy);
          ctx.moveTo(cx, cy - radius - 15);
          ctx.lineTo(cx, cy + radius + 15);
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated Ping Ring
          const pingRadius = (Math.abs(Math.sin(tick * 1.5)) * 30) + 8;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, pingRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Zone Badge Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px monospace';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        const icon = zone.type === 'water' ? '💧' : zone.type === 'energy' ? '⚡' : '🌿';
        ctx.fillText(`${icon} ${zone.severity}% DEFICIT`, cx + 8, cy - 8);
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(245, 245, 240, 0.7)';
        ctx.fillText(`${(zone.affectedHectares / 1000).toFixed(1)}k ha`, cx + 8, cy + 3);
        ctx.shadowBlur = 0; // reset shadow
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [filteredZones, BOUNDS, heatmapIntensity, isPulsing, hotspotOpacity, selectedZone, selectedZoneId, hoveredZone]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const w = rect.width || 850;
      const h = Math.max(380, rect.height || 420);
      canvas.width = w;
      canvas.height = h;
      setCanvasDim({ width: w, height: h });
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Hit testing for clicks and hover
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>, isClick: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find closest zone within radius
    let closest: ScarcityZone | null = null;
    let minDist = 35; // Pixel hit radius

    filteredZones.forEach((zone) => {
      const [zx, zy] = project(zone.lng, zone.lat, canvas.width, canvas.height);
      const dist = Math.hypot(x - zx, y - zy);
      if (dist < minDist) {
        minDist = dist;
        closest = zone;
      }
    });

    if (isClick) {
      setSelectedZone(closest);
      if (closest && onSelectZone) {
        onSelectZone(closest);
      }
      if (closest) {
        audioFeedback.playSubtleClick();
      }
    } else {
      setHoveredZone(closest);
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs text-[#F5F5F0]">
      {/* Interactive Controls Bar */}
      {showControls && (
        <div className="p-3.5 rounded-xl bg-[#090D0A] border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-950/70 text-rose-400 border border-rose-500/40 shrink-0">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white text-sm">
                  Ecological Hotspot Scarcity Layer
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/40">
                  Canvas 60fps
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 block font-sans">
                Real-time canvas rendering of biophysical resource deficits (water baseflow, microgrid energy, living soil nutrients).
              </span>
            </div>
          </div>

          {/* Layers Manager Controls & Presets */}
          <div className="flex items-center justify-between gap-3 flex-wrap border-t border-[#F5F5F0]/10 pt-2 text-[10px]">
            {/* Quick Individual Layer Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="uppercase text-neutral-400 font-bold flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#C5A059]" />
                Layers:
              </span>

              <button
                onClick={() => {
                  setActiveLayers(prev => ({ ...prev, water: !prev.water }));
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  activeLayers.water
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-sm'
                    : 'bg-[#121613] text-neutral-500 border-[#F5F5F0]/10 line-through'
                }`}
              >
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>Water ({SCARCITY_ZONES.filter(z => z.type === 'water').length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveLayers(prev => ({ ...prev, energy: !prev.energy }));
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  activeLayers.energy
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-[#121613] text-neutral-500 border-[#F5F5F0]/10 line-through'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Energy ({SCARCITY_ZONES.filter(z => z.type === 'energy').length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveLayers(prev => ({ ...prev, nutrient: !prev.nutrient }));
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  activeLayers.nutrient
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-sm'
                    : 'bg-[#121613] text-neutral-500 border-[#F5F5F0]/10 line-through'
                }`}
              >
                <Layers className="w-3 h-3 text-purple-400" />
                <span>Nutrients ({SCARCITY_ZONES.filter(z => z.type === 'nutrient').length})</span>
              </button>

              {/* Open Deep Layers Manager Panel Button */}
              <button
                onClick={() => {
                  setIsLayersManagerOpen(!isLayersManagerOpen);
                  audioFeedback.playSubtleClick();
                }}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 border ml-1 ${
                  isLayersManagerOpen
                    ? 'bg-[#C5A059] text-black border-[#C5A059] font-extrabold shadow'
                    : 'bg-[#141B16] text-[#C5A059] border-[#C5A059]/40 hover:border-[#C5A059]'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Layers Manager</span>
                <span className="px-1 py-0.2 rounded bg-black/40 text-[9px]">
                  {Object.values(activeLayers).filter(Boolean).length}/3
                </span>
              </button>
            </div>

            {/* Sliders: Hotspot Opacity & Severity Threshold */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 uppercase font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-rose-400" />
                  Hotspot Opacity:
                </span>
                <input
                  type="range"
                  min="0.15"
                  max="1.0"
                  step="0.05"
                  value={hotspotOpacity}
                  onChange={(e) => setHotspotOpacity(Number(e.target.value))}
                  className="w-16 sm:w-20 accent-rose-500 cursor-pointer"
                />
                <span className="text-rose-400 font-bold font-mono text-[9px] w-7">
                  {Math.round(hotspotOpacity * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 uppercase font-bold">Min Deficit:</span>
                <input
                  type="range"
                  min="30"
                  max="85"
                  step="5"
                  value={minSeverity}
                  onChange={(e) => setMinSeverity(Number(e.target.value))}
                  className="w-14 sm:w-16 accent-rose-500 cursor-pointer"
                />
                <span className="text-rose-400 font-bold font-mono text-[9px]">{minSeverity}%</span>
              </div>

              <button
                onClick={() => {
                  setIsPulsing(!isPulsing);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                  isPulsing
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : 'bg-[#141414] text-neutral-400 border-[#F5F5F0]/10'
                }`}
              >
                {isPulsing ? 'Pulse: ON' : 'Pulse: STATIC'}
              </button>
            </div>
          </div>

          {/* Deep Layers Manager Popover Pane */}
          {isLayersManagerOpen && (
            <div className="p-3.5 rounded-xl bg-[#090E0B] border border-[#C5A059]/40 space-y-3 animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#C5A059] font-bold text-xs uppercase flex items-center gap-1.5 font-mono">
                    <Layers className="w-4 h-4 text-[#C5A059]" />
                    Ecological Hotspot Layers & Visibility Manager
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#162019] text-[#F5F5F0]/80 text-[10px] font-mono">
                    Showing {filteredZones.length} of {SCARCITY_ZONES.length} Epicenters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveLayers({ water: true, energy: true, nutrient: true });
                      setHotspotOpacity(0.85);
                      setMinSeverity(50);
                      audioFeedback.playMicroTick();
                    }}
                    className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={() => setIsLayersManagerOpen(false)}
                    className="text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Layer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                {/* Water Layer Card */}
                <div className={`p-3 rounded-lg border transition-all ${
                  activeLayers.water
                    ? 'bg-[#131A15] border-rose-500/40'
                    : 'bg-[#0B0F0C] border-[#F5F5F0]/10 opacity-60'
                }`}>
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      Water Baseflow Deficits
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.water}
                      onChange={(e) => {
                        setActiveLayers({ ...activeLayers, water: e.target.checked });
                        audioFeedback.playMicroTick();
                      }}
                      className="accent-rose-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans space-y-0.5 pt-1">
                    <p>Monitors seasonal baseflow, deep-aquifer depression cones & siltation chokes.</p>
                    <div className="text-neutral-300 font-mono text-[9px] pt-1">
                      3 Epicenters • 34,400 ha • 187,000 Inhabitants
                    </div>
                  </div>
                </div>

                {/* Energy Layer Card */}
                <div className={`p-3 rounded-lg border transition-all ${
                  activeLayers.energy
                    ? 'bg-[#131A15] border-amber-500/40'
                    : 'bg-[#0B0F0C] border-[#F5F5F0]/10 opacity-60'
                }`}>
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Energy Storage Deficits
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.energy}
                      onChange={(e) => {
                        setActiveLayers({ ...activeLayers, energy: e.target.checked });
                        audioFeedback.playMicroTick();
                      }}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans space-y-0.5 pt-1">
                    <p>Monitors solar battery saturation deficits & cooling microgrid curtailment.</p>
                    <div className="text-neutral-300 font-mono text-[9px] pt-1">
                      2 Epicenters • 42,000 ha • 40,000 Inhabitants
                    </div>
                  </div>
                </div>

                {/* Nutrient Layer Card */}
                <div className={`p-3 rounded-lg border transition-all ${
                  activeLayers.nutrient
                    ? 'bg-[#131A15] border-purple-500/40'
                    : 'bg-[#0B0F0C] border-[#F5F5F0]/10 opacity-60'
                }`}>
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      Soil Nutrient Voids
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.nutrient}
                      onChange={(e) => {
                        setActiveLayers({ ...activeLayers, nutrient: e.target.checked });
                        audioFeedback.playMicroTick();
                      }}
                      className="accent-purple-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans space-y-0.5 pt-1">
                    <p>Monitors volcanic phosphate lockup, continuous grazing voids & SOM loss.</p>
                    <div className="text-neutral-300 font-mono text-[9px] pt-1">
                      2 Epicenters • 39,500 ha • 44,500 Inhabitants
                    </div>
                  </div>
                </div>
              </div>

              {/* Opacity & Visualization Presets */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-[#040805] border border-[#F5F5F0]/10 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Opacity Presets:</span>
                  {[
                    { label: 'Subtle (35%)', val: 0.35 },
                    { label: 'Standard (75%)', val: 0.75 },
                    { label: 'Vivid (100%)', val: 1.0 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setHotspotOpacity(p.val);
                        audioFeedback.playMicroTick();
                      }}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all border ${
                        Math.abs(hotspotOpacity - p.val) < 0.05
                          ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                          : 'bg-[#111812] text-neutral-300 border-[#F5F5F0]/10 hover:border-white/20'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Layer Presets:</span>
                  <button
                    onClick={() => {
                      setActiveLayers({ water: true, energy: true, nutrient: true });
                      audioFeedback.playMicroTick();
                    }}
                    className="px-2 py-0.5 rounded bg-[#111812] text-neutral-300 border border-[#F5F5F0]/10 hover:border-white/20 cursor-pointer"
                  >
                    All Active
                  </button>
                  <button
                    onClick={() => {
                      setActiveLayers({ water: true, energy: false, nutrient: false });
                      audioFeedback.playMicroTick();
                    }}
                    className="px-2 py-0.5 rounded bg-[#111812] text-rose-300 border border-rose-500/30 hover:border-rose-500 cursor-pointer"
                  >
                    Solo Water
                  </button>
                  <button
                    onClick={() => {
                      setActiveLayers({ water: false, energy: true, nutrient: false });
                      audioFeedback.playMicroTick();
                    }}
                    className="px-2 py-0.5 rounded bg-[#111812] text-amber-300 border border-amber-500/30 hover:border-amber-500 cursor-pointer"
                  >
                    Solo Energy
                  </button>
                  <button
                    onClick={() => {
                      setActiveLayers({ water: false, energy: false, nutrient: true });
                      audioFeedback.playMicroTick();
                    }}
                    className="px-2 py-0.5 rounded bg-[#111812] text-purple-300 border border-purple-500/30 hover:border-purple-500 cursor-pointer"
                  >
                    Solo Nutrients
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Canvas Container with Interactive Map Overlay */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-xl border border-rose-500/40 bg-[#060907] overflow-hidden shadow-2xl min-h-[420px]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair select-none"
          onClick={(e) => handleCanvasInteraction(e, true)}
          onMouseMove={(e) => handleCanvasInteraction(e, false)}
          onMouseLeave={() => setHoveredZone(null)}
        />

        {/* Interactive Animated Hotspot Pinpoint Overlays with Entrance, Hover & High-Risk Pulsing */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredZones.map((zone, idx) => {
            const [cx, cy] = project(zone.lng, zone.lat, canvasDim.width, canvasDim.height);
            const isHighRisk = zone.severity >= HIGH_RISK_THRESHOLD;
            const isSelected = (selectedZone?.id === zone.id) || (selectedZoneId === zone.id);
            const isHovered = hoveredZone?.id === zone.id;

            return (
              <motion.div
                key={zone.id}
                initial={{ scale: 0, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 280, delay: idx * 0.04 }}
                style={{ left: `${cx}px`, top: `${cy}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedZone(zone);
                  if (onSelectZone) onSelectZone(zone);
                  audioFeedback.playSubtleClick();
                }}
                onMouseEnter={() => {
                  setHoveredZone(zone);
                  audioFeedback.playMicroTick();
                }}
                onMouseLeave={() => {
                  if (hoveredZone?.id === zone.id) setHoveredZone(null);
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.25, zIndex: 40 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 z-30'
                      : isHovered
                      ? 'z-30 scale-105'
                      : 'z-10'
                  }`}
                >
                  {/* High-Risk Threshold Pulsing Wave Rings */}
                  {isHighRisk && (
                    <motion.span
                      animate={{
                        scale: [1, 2.5, 1],
                        opacity: [0.9, 0, 0.9]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute -inset-2 rounded-full border-2 border-rose-500 pointer-events-none shadow-[0_0_15px_rgba(244,63,94,0.7)]"
                    />
                  )}

                  {/* Secondary Pulsing Radar Ring for Critical Outliers (>= 80% Severity) */}
                  {zone.severity >= 80 && (
                    <motion.span
                      animate={{
                        scale: [1, 3.2, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.35
                      }}
                      className="absolute -inset-3 rounded-full border border-rose-400/50 pointer-events-none"
                    />
                  )}

                  {/* Hotspot Core Tag Badge */}
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 shadow-xl border backdrop-blur-md transition-all ${
                    zone.type === 'water'
                      ? 'bg-rose-950/90 text-rose-200 border-rose-500/70 hover:bg-rose-900'
                      : zone.type === 'energy'
                      ? 'bg-amber-950/90 text-amber-200 border-amber-500/70 hover:bg-amber-900'
                      : 'bg-purple-950/90 text-purple-200 border-purple-500/70 hover:bg-purple-900'
                  }`}>
                    <span>{zone.type === 'water' ? '💧' : zone.type === 'energy' ? '⚡' : '🌿'}</span>
                    <span>{zone.severity}%</span>
                    {isHighRisk && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend Overlay with Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 left-3 p-2.5 rounded-lg bg-black/85 border border-rose-500/40 backdrop-blur-md text-[10px] space-y-1 pointer-events-none shadow-xl z-20"
        >
          <div className="font-bold text-rose-300 uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Scarcity Heat Gradient
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span>Water Baseflow Deficit ({filteredZones.filter(z => z.type === 'water').length})</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span>Energy Storage Deficit ({filteredZones.filter(z => z.type === 'energy').length})</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
            <span>Soil Nutrient Void ({filteredZones.filter(z => z.type === 'nutrient').length})</span>
          </div>
          <div className="text-[9px] text-neutral-400 pt-1 border-t border-white/10">
            Click any hotspot zone to inspect diagnostic telemetry
          </div>
        </motion.div>

        {/* High-Risk Threshold Alert Banner Overlay (When high-risk hotspots detected) */}
        {criticalZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 16 }}
            className="absolute top-3 right-3 p-2.5 rounded-xl bg-gradient-to-r from-rose-950/95 via-[#1E0E12]/90 to-black/90 border border-rose-500/60 backdrop-blur-md text-[10px] space-y-1.5 shadow-2xl max-w-xs z-20"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.3, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                />
                <span>{criticalZones.length} High-Risk Thresholds Detected</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[8px] bg-rose-900/60 text-rose-300 border border-rose-500/40 uppercase font-bold">
                Critical (&gt;=75%)
              </span>
            </div>
            <p className="text-[9px] text-neutral-300">
              Ecosystem thresholds breached. Concentric radar rings pulse over critical deficit nodes.
            </p>
            <button
              onClick={() => {
                const topCritical = [...criticalZones].sort((a, b) => b.severity - a.severity)[0];
                if (topCritical) {
                  setSelectedZone(topCritical);
                  if (onSelectZone) onSelectZone(topCritical);
                  audioFeedback.playSubtleClick();
                }
              }}
              className="w-full px-2 py-1 rounded bg-rose-900/70 hover:bg-rose-800 text-rose-200 border border-rose-500/40 text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow"
            >
              <span>Inspect Peak Deficit Epicenter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {/* Floating Scarcity Diagnostic Inspector (When Hovered or Selected) with AnimatePresence */}
        <AnimatePresence>
          {(selectedZone || hoveredZone) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', damping: 18, stiffness: 320 }}
              className="absolute bottom-3 right-3 max-w-sm w-full p-3.5 rounded-xl bg-black/92 border border-rose-500/60 shadow-2xl backdrop-blur-md space-y-2 z-30"
            >
              {(() => {
                const zone = selectedZone || hoveredZone!;
                const isHighRisk = zone.severity >= HIGH_RISK_THRESHOLD;

                return (
                  <>
                    <div className="flex items-center justify-between text-[10px] border-b border-[#F5F5F0]/10 pb-1.5">
                      <span className={`font-bold uppercase flex items-center gap-1 ${
                        zone.type === 'water' ? 'text-rose-400' : zone.type === 'energy' ? 'text-amber-400' : 'text-purple-400'
                      }`}>
                        {zone.type === 'water' ? '💧 Water Scarcity Zone' : zone.type === 'energy' ? '⚡ Energy Deficit Zone' : '🌿 Soil Nutrient Void'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isHighRisk && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-900/80 text-rose-200 border border-rose-500/50 text-[8px] font-bold uppercase animate-pulse">
                            High-Risk Pulse
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                          {zone.severity}% Severity
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-white text-xs">
                        {zone.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        GPS: ({zone.lat.toFixed(2)}° S, {zone.lng.toFixed(2)}° E) • {(zone.affectedHectares / 1000).toFixed(1)}k Hectares • {zone.populationImpacted.toLocaleString()} Inhabitants
                      </p>
                    </div>

                    <div className="p-2 rounded bg-[#101511] border border-rose-500/20 text-[10px] space-y-1">
                      <div className="text-rose-300 font-bold flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-rose-400" />
                        {zone.inSituMetric}
                      </div>
                      <div className="text-neutral-400">
                        <strong className="text-neutral-300">Driver:</strong> {zone.primaryDriver}
                      </div>
                    </div>

                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Recommended In-Situ Protocol:
                      </div>
                      <p className="font-sans leading-snug">
                        {zone.recommendedIntervention}
                      </p>
                    </div>

                    <div className="text-[9px] text-neutral-400 pt-1 flex items-center justify-between border-t border-white/10">
                      <span className="truncate max-w-[200px]">Node: {zone.telemetrySourceNode}</span>
                      <span className="text-emerald-400 font-bold">Section 30 Attested</span>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
