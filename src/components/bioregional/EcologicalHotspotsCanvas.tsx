import React, { useEffect, useRef, useState, useMemo } from 'react';
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

  // Filter States
  const [resourceFilter, setResourceFilter] = useState<ScarcityResourceType>('all');
  const [minSeverity, setMinSeverity] = useState<number>(50);
  const [isPulsing, setIsPulsing] = useState<boolean>(true);
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.75);
  const [selectedZone, setSelectedZone] = useState<ScarcityZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<ScarcityZone | null>(null);

  // Coordinates bounding box for East Africa Bioregional transect
  const BOUNDS = useMemo(() => ({
    minLng: 34.8,
    maxLng: 37.2,
    minLat: -1.7,
    maxLat: -0.2
  }), []);

  // Filtered scarcity zones
  const filteredZones = useMemo(() => {
    return SCARCITY_ZONES.filter((z) => {
      const matchType = resourceFilter === 'all' || z.type === resourceFilter;
      const matchSeverity = z.severity >= minSeverity;
      return matchType && matchSeverity;
    });
  }, [resourceFilter, minSeverity]);

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

        // Color determination per scarcity resource type
        let coreColor = 'rgba(244, 63, 94, 0.85)'; // Rose (Water)
        let midColor = 'rgba(244, 63, 94, 0.35)';
        let outerColor = 'rgba(244, 63, 94, 0.0)';
        let strokeColor = '#F43F5E';

        if (zone.type === 'energy') {
          coreColor = 'rgba(245, 158, 11, 0.9)'; // Amber (Energy)
          midColor = 'rgba(245, 158, 11, 0.35)';
          outerColor = 'rgba(245, 158, 11, 0.0)';
          strokeColor = '#F59E0B';
        } else if (zone.type === 'nutrient') {
          coreColor = 'rgba(168, 85, 247, 0.85)'; // Purple (Nutrient)
          midColor = 'rgba(168, 85, 247, 0.35)';
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
        ctx.globalAlpha = isSelected ? 0.9 : 0.45;

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1.0;

        // Pulsing Epicenter Core Marker
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(cx, cy, isSelected ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

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
  }, [filteredZones, BOUNDS, heatmapIntensity, isPulsing, selectedZone, selectedZoneId, hoveredZone]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(380, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase text-neutral-400 font-bold">Resource:</span>
            {[
              { id: 'all', label: 'All Deficits', icon: <Sparkles className="w-3 h-3 text-white" /> },
              { id: 'water', label: 'Water', icon: <Droplets className="w-3 h-3 text-cyan-400" /> },
              { id: 'energy', label: 'Energy', icon: <Zap className="w-3 h-3 text-amber-400" /> },
              { id: 'nutrient', label: 'Nutrient', icon: <Layers className="w-3 h-3 text-purple-400" /> }
            ].map((res) => (
              <button
                key={res.id}
                onClick={() => {
                  setResourceFilter(res.id as ScarcityResourceType);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  resourceFilter === res.id
                    ? 'bg-rose-500 text-black shadow-md font-extrabold'
                    : 'bg-[#141B16] text-[#F5F5F0]/60 hover:text-white hover:bg-[#1E2921]'
                }`}
              >
                {res.icon}
                <span>{res.label}</span>
              </button>
            ))}
          </div>

          {/* Sliders: Severity Threshold + Heatmap Intensity */}
          <div className="flex items-center gap-4 flex-wrap text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase font-bold">Min Deficit:</span>
              <input
                type="range"
                min="30"
                max="85"
                step="5"
                value={minSeverity}
                onChange={(e) => setMinSeverity(Number(e.target.value))}
                className="w-16 sm:w-20 accent-rose-500 cursor-pointer"
              />
              <span className="text-rose-400 font-bold font-mono">{minSeverity}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase font-bold">Heat Glow:</span>
              <input
                type="range"
                min="0.3"
                max="1.2"
                step="0.1"
                value={heatmapIntensity}
                onChange={(e) => setHeatmapIntensity(Number(e.target.value))}
                className="w-16 accent-rose-500 cursor-pointer"
              />
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

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 p-2.5 rounded-lg bg-black/85 border border-rose-500/40 backdrop-blur-md text-[10px] space-y-1 pointer-events-none shadow-xl">
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
        </div>

        {/* Floating Scarcity Diagnostic Inspector (When Hovered or Selected) */}
        {(selectedZone || hoveredZone) && (
          <div className="absolute bottom-3 right-3 max-w-sm w-full p-3.5 rounded-xl bg-black/90 border border-rose-500/60 shadow-2xl backdrop-blur-md space-y-2 animate-in fade-in zoom-in-95 duration-150">
            {(() => {
              const zone = selectedZone || hoveredZone!;
              return (
                <>
                  <div className="flex items-center justify-between text-[10px] border-b border-[#F5F5F0]/10 pb-1.5">
                    <span className={`font-bold uppercase flex items-center gap-1 ${
                      zone.type === 'water' ? 'text-rose-400' : zone.type === 'energy' ? 'text-amber-400' : 'text-purple-400'
                    }`}>
                      {zone.type === 'water' ? '💧 Water Scarcity Zone' : zone.type === 'energy' ? '⚡ Energy Deficit Zone' : '🌿 Soil Nutrient Void'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                      {zone.severity}% Severity
                    </span>
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
          </div>
        )}
      </div>
    </div>
  );
};
