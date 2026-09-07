import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Activity, 
  Radio, 
  Filter, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Search,
  Maximize2,
  Sliders,
  TrendingUp,
  Cpu,
  Globe2,
  FileCheck2
} from 'lucide-react';
import { audioFeedback } from '../../../lib/audioFeedback';

export interface EpistemicDataPoint {
  id: string;
  name: string;
  basinRegion: string;
  coordinates: [number, number]; // [lat, lng]
  mapPos: { x: number; y: number }; // percentage 0-100
  reliabilityScore: number; // 0 - 100
  provenanceDensity: number; // count of independent sources
  elevationLevel: number; // 1 - 5 (topographical height)
  calibratedAt: string;
  merkleRootHash: string;
  status: 'VERIFIED_EMPIRICAL' | 'STRONG_CONSENSUS' | 'SPARSE_OBSERVATION' | 'EPISTEMIC_ALERT';
  sources: Array<{
    name: string;
    type: 'satellite' | 'in_situ_iot' | 'field_audit' | 'zkp_oracle' | 'elder_consensus';
    reliabilityWeight: number;
    latency: string;
  }>;
  keyMetric: string;
  metricValue: string;
}

const EPISTEMIC_DATA_POINTS: EpistemicDataPoint[] = [
  {
    id: 'ep-node-01',
    name: 'Talek Riparian Aquifer Basin #TK-04',
    basinRegion: 'Mara-Serengeti Savanna',
    coordinates: [-1.432, 35.215],
    mapPos: { x: 38, y: 56 },
    reliabilityScore: 98.4,
    provenanceDensity: 8,
    elevationLevel: 5,
    calibratedAt: '4 minutes ago',
    merkleRootHash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    status: 'VERIFIED_EMPIRICAL',
    keyMetric: 'Baseflow Velocity',
    metricValue: '3.82 m³/s',
    sources: [
      { name: 'Acoustic Doppler Piezometer Mesh #TK-04', type: 'in_situ_iot', reliabilityWeight: 99, latency: '2s' },
      { name: 'Sentinel-2 Multispectral Hydrology Band 8A', type: 'satellite', reliabilityWeight: 97, latency: '4h' },
      { name: 'USGS Landsat-9 Thermal Infrared TIRS-2', type: 'satellite', reliabilityWeight: 96, latency: '12h' },
      { name: 'Narok County Water Sub-Catchment Field Audit', type: 'field_audit', reliabilityWeight: 98, latency: '2d' },
      { name: 'Maasai Mara Elder Water Rights Consensus (TEK)', type: 'elder_consensus', reliabilityWeight: 99, latency: '1w' },
      { name: 'Hardware Secure Enclave ZKP Node #SN-402', type: 'zkp_oracle', reliabilityWeight: 100, latency: '1m' },
      { name: 'Drone Multispectral Transect #DR-MARA-12', type: 'in_situ_iot', reliabilityWeight: 95, latency: '6h' },
      { name: 'Global Precipitation Measurement (GPM) Radar', type: 'satellite', reliabilityWeight: 96, latency: '3h' }
    ]
  },
  {
    id: 'ep-node-02',
    name: 'Aberdare Cloud Forest Bamboo Catchment',
    basinRegion: 'Aberdare High Catchment',
    coordinates: [-0.412, 36.689],
    mapPos: { x: 58, y: 32 },
    reliabilityScore: 96.2,
    provenanceDensity: 7,
    elevationLevel: 5,
    calibratedAt: '12 minutes ago',
    merkleRootHash: '0x3d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    status: 'VERIFIED_EMPIRICAL',
    keyMetric: 'Condensation Canopy Flux',
    metricValue: '58.4% NDVI',
    sources: [
      { name: 'GEDI Spaceborne Lidar Forest Structure', type: 'satellite', reliabilityWeight: 98, latency: '1d' },
      { name: 'Eddy Covariance Carbon-Water Flux Tower #AB-01', type: 'in_situ_iot', reliabilityWeight: 99, latency: '5m' },
      { name: 'Kenya Forest Service Ground Soil Core Lab Assay', type: 'field_audit', reliabilityWeight: 97, latency: '3d' },
      { name: 'Copernicus Sentinel-1 SAR Backscatter', type: 'satellite', reliabilityWeight: 95, latency: '8h' },
      { name: 'Community Forest Association Tree Density Census', type: 'field_audit', reliabilityWeight: 94, latency: '2w' },
      { name: 'Hardware ZKP Environmental Cryptographic Attestation', type: 'zkp_oracle', reliabilityWeight: 100, latency: '1m' },
      { name: 'MODIS Evapotranspiration Index MOD16A2', type: 'satellite', reliabilityWeight: 92, latency: '1d' }
    ]
  },
  {
    id: 'ep-node-03',
    name: 'Oiti Basin Soil Carbon & Microbiome Assay',
    basinRegion: 'Mara-Serengeti Savanna',
    coordinates: [-1.684, 35.482],
    mapPos: { x: 44, y: 68 },
    reliabilityScore: 91.8,
    provenanceDensity: 6,
    elevationLevel: 4,
    calibratedAt: '28 minutes ago',
    merkleRootHash: '0x1c94b281f9a0d8b2e5c1a7e4b9d0a1b2c3d4e5f6',
    status: 'STRONG_CONSENSUS',
    keyMetric: 'Soil Organic Carbon',
    metricValue: '2.04%',
    sources: [
      { name: 'In-Situ Spectrometric Reflectometer Array #SP-12', type: 'in_situ_iot', reliabilityWeight: 96, latency: '15m' },
      { name: 'Dryland Metagenomic Sequencing Lab Protocol', type: 'field_audit', reliabilityWeight: 98, latency: '5d' },
      { name: 'Sentinel-2 Soil Composition & Clay Mineral Index', type: 'satellite', reliabilityWeight: 89, latency: '1d' },
      { name: 'Pastoralist Rotational Grazing Logbook Proofs', type: 'elder_consensus', reliabilityWeight: 92, latency: '3d' },
      { name: 'Hardware Enclave Proof-of-Location Sensor Node', type: 'zkp_oracle', reliabilityWeight: 100, latency: '1m' },
      { name: 'SMAP Satellite Soil Moisture Radiometer', type: 'satellite', reliabilityWeight: 90, latency: '12h' }
    ]
  },
  {
    id: 'ep-node-04',
    name: 'Karura Urban Forest Buffer Ambient Air Array',
    basinRegion: 'Nairobi River Basin',
    coordinates: [-1.240, 36.834],
    mapPos: { x: 64, y: 48 },
    reliabilityScore: 88.5,
    provenanceDensity: 5,
    elevationLevel: 4,
    calibratedAt: '18 minutes ago',
    merkleRootHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    status: 'STRONG_CONSENSUS',
    keyMetric: 'PM2.5 Particulate Density',
    metricValue: '34.2 µg/m³',
    sources: [
      { name: 'Laser Optical Particle Counter Node #KAR-AQI-7', type: 'in_situ_iot', reliabilityWeight: 94, latency: '30s' },
      { name: 'Sentinel-5P TROPOMI Tropospheric NO2/Aerosol', type: 'satellite', reliabilityWeight: 91, latency: '6h' },
      { name: 'Nairobi City Clean Air Municipal Station #NBO-03', type: 'field_audit', reliabilityWeight: 93, latency: '1h' },
      { name: 'Community Citizen Air Quality Sampler Mesh', type: 'in_situ_iot', reliabilityWeight: 82, latency: '5m' },
      { name: 'Hardware Cryptographic Hash Signer', type: 'zkp_oracle', reliabilityWeight: 100, latency: '1m' }
    ]
  },
  {
    id: 'ep-node-05',
    name: 'Kilifi Coastal Mangrove & Aquifer Seepage',
    basinRegion: 'Kilifi Coastal Corridor',
    coordinates: [-3.630, 39.850],
    mapPos: { x: 86, y: 76 },
    reliabilityScore: 84.0,
    provenanceDensity: 4,
    elevationLevel: 3,
    calibratedAt: '45 minutes ago',
    merkleRootHash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    status: 'STRONG_CONSENSUS',
    keyMetric: 'Aquifer Salinity & Recharge',
    metricValue: '1.4B L Infiltrated',
    sources: [
      { name: 'Tidal Fluvial Salinity Conductivity Probe #KLF-09', type: 'in_situ_iot', reliabilityWeight: 92, latency: '10m' },
      { name: 'Landsat-8 Mangrove Biomass Index (NDVI/EVI)', type: 'satellite', reliabilityWeight: 88, latency: '1d' },
      { name: 'Fisherfolk Community Assembly Creek Salinity Audit', type: 'elder_consensus', reliabilityWeight: 86, latency: '4d' },
      { name: 'Hardware ZKP Telemetry Node', type: 'zkp_oracle', reliabilityWeight: 100, latency: '1m' }
    ]
  },
  {
    id: 'ep-node-06',
    name: 'Chalbi Desert Northern Groundwater Aquifer Transect',
    basinRegion: 'Turkana-Chalbi Northern Basin',
    coordinates: [3.120, 37.240],
    mapPos: { x: 62, y: 15 },
    reliabilityScore: 68.2,
    provenanceDensity: 2,
    elevationLevel: 2,
    calibratedAt: '3 hours ago',
    merkleRootHash: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
    status: 'SPARSE_OBSERVATION',
    keyMetric: 'Deep Aquifer Static Head',
    metricValue: '142m Depth (Uncertain)',
    sources: [
      { name: 'GRACE-FO Gravimetric Groundwater Anomaly', type: 'satellite', reliabilityWeight: 78, latency: '1w' },
      { name: 'Single Borehole Pressure Logger #CHL-01', type: 'in_situ_iot', reliabilityWeight: 82, latency: '4h' }
    ]
  },
  {
    id: 'ep-node-07',
    name: 'Mt. Kenya Glacial Moraine Ice Core Runoff',
    basinRegion: 'Mt. Kenya Upper Watershed',
    coordinates: [-0.150, 37.300],
    mapPos: { x: 68, y: 36 },
    reliabilityScore: 94.7,
    provenanceDensity: 6,
    elevationLevel: 5,
    calibratedAt: '15 minutes ago',
    merkleRootHash: '0x9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    status: 'VERIFIED_EMPIRICAL',
    keyMetric: 'Glacial Meltwater Discharge',
    metricValue: '1.28 m³/s',
    sources: [
      { name: 'High-Altitude Automated Weather Station (AWS) #MK-01', type: 'in_situ_iot', reliabilityWeight: 98, latency: '5m' },
      { name: 'Terra ASTER Stereoscopic Glacier Elevation Model', type: 'satellite', reliabilityWeight: 96, latency: '2d' },
      { name: 'Kenya Wildlife Service Ranger Snowline Survey', type: 'field_audit', reliabilityWeight: 95, latency: '1w' },
      { name: 'Hardware Enclave ZKP Data Logger', type: 'zkp_oracle', reliabilityWeight: 100, latency: '1m' },
      { name: 'Sentinel-2 Snow Cover & Albedo Fraction', type: 'satellite', reliabilityWeight: 94, latency: '1d' },
      { name: 'Alpine Hydrological Sub-Catchment Gauge', type: 'in_situ_iot', reliabilityWeight: 96, latency: '15m' }
    ]
  }
];

interface EpistemicHeatmapLayerProps {
  onInspectProvenance: (prov: any) => void;
  onOpenCommandCenter: () => void;
}

export const EpistemicHeatmapLayer: React.FC<EpistemicHeatmapLayerProps> = ({
  onInspectProvenance,
  onOpenCommandCenter
}) => {
  const [selectedNode, setSelectedNode] = useState<EpistemicDataPoint>(EPISTEMIC_DATA_POINTS[0]);
  const [minReliabilityFilter, setMinReliabilityFilter] = useState<number>(60);
  const [activeSourceTypeFilter, setActiveSourceTypeFilter] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'contours' | 'density_mesh' | 'points_only'>('contours');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPoints = useMemo(() => {
    return EPISTEMIC_DATA_POINTS.filter(pt => {
      const matchesReliability = pt.reliabilityScore >= minReliabilityFilter;
      const matchesSearch = searchQuery.trim() === '' || 
        pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.basinRegion.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = activeSourceTypeFilter === 'all' ||
        pt.sources.some(s => s.type === activeSourceTypeFilter);
      return matchesReliability && matchesSearch && matchesSource;
    });
  }, [minReliabilityFilter, searchQuery, activeSourceTypeFilter]);

  const stats = useMemo(() => {
    const totalPoints = EPISTEMIC_DATA_POINTS.length;
    const avgReliability = Math.round(
      EPISTEMIC_DATA_POINTS.reduce((acc, p) => acc + p.reliabilityScore, 0) / totalPoints * 10
    ) / 10;
    const avgDensity = Math.round(
      EPISTEMIC_DATA_POINTS.reduce((acc, p) => acc + p.provenanceDensity, 0) / totalPoints * 10
    ) / 10;
    const highConfidenceCount = EPISTEMIC_DATA_POINTS.filter(p => p.reliabilityScore >= 90).length;

    return { avgReliability, avgDensity, highConfidenceCount, totalPoints };
  }, []);

  const getNodeColor = (score: number) => {
    if (score >= 95) return 'text-emerald-400 border-emerald-400 bg-emerald-950/80 shadow-[0_0_15px_#10B981]';
    if (score >= 85) return 'text-[#C5A059] border-[#C5A059] bg-[#1B3022]/80 shadow-[0_0_12px_#C5A059]';
    if (score >= 70) return 'text-amber-400 border-amber-400 bg-amber-950/80 shadow-[0_0_10px_#F59E0B]';
    return 'text-rose-400 border-rose-400 bg-rose-950/80 shadow-[0_0_12px_#F43F5E]';
  };

  const getContourFill = (score: number) => {
    if (score >= 95) return 'rgba(16, 185, 129, 0.14)';
    if (score >= 85) return 'rgba(197, 160, 89, 0.12)';
    if (score >= 70) return 'rgba(245, 158, 11, 0.08)';
    return 'rgba(244, 63, 94, 0.08)';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Epistemic Heatmap Layer Explainer & Global Stats */}
      <div className="p-4 sm:p-5 rounded-sm bg-gradient-to-r from-[#0D1812] via-[#0A100D] to-[#0A0A0A] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10B981]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400">
              EPISTEMIC HEATMAP • TOPOGRAPHICAL PROVENANCE DENSITY ENGINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">
            World-Model Reliability & Corroboration Topography
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            Topographical contours map the elevation of empirical truth: high peaks indicate multi-sensor, multi-modal consensus across satellites, in-situ IoT, and community audits, while valleys highlight observation sparsity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 shrink-0">
          <div className="px-3 py-2 rounded bg-black/50 border border-emerald-500/30 text-center">
            <div className="text-[9px] uppercase font-mono text-[#F5F5F0]/50">Mean Reliability</div>
            <div className="text-lg font-mono font-bold text-emerald-400">{stats.avgReliability}%</div>
          </div>
          <div className="px-3 py-2 rounded bg-black/50 border border-[#C5A059]/30 text-center">
            <div className="text-[9px] uppercase font-mono text-[#F5F5F0]/50">Avg Provenance Density</div>
            <div className="text-lg font-mono font-bold text-[#C5A059]">{stats.avgDensity} streams/cell</div>
          </div>
          <div className="px-3 py-2 rounded bg-black/50 border border-cyan-500/30 text-center">
            <div className="text-[9px] uppercase font-mono text-[#F5F5F0]/50">ZKP Attestations</div>
            <div className="text-lg font-mono font-bold text-cyan-400">100% Signed</div>
          </div>
        </div>
      </div>

      {/* Controls Strip: Filter, Density, Modes */}
      <div className="p-3 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#C5A059] font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Min Reliability:</span>
            <input 
              type="range" 
              min="50" 
              max="95" 
              step="5"
              value={minReliabilityFilter}
              onChange={(e) => setMinReliabilityFilter(Number(e.target.value))}
              className="w-24 accent-emerald-400 cursor-pointer"
            />
            <span className="text-emerald-400">{minReliabilityFilter}%+</span>
          </div>

          <span className="text-[#F5F5F0]/20 hidden sm:inline">•</span>

          <div className="flex items-center gap-1">
            <span className="text-[#F5F5F0]/50">Source:</span>
            {(['all', 'satellite', 'in_situ_iot', 'field_audit', 'elder_consensus'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setActiveSourceTypeFilter(type);
                }}
                className={`px-2 py-0.5 rounded text-[10px] uppercase transition-colors ${
                  activeSourceTypeFilter === type
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-[#141414] text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                {type.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded border border-[#F5F5F0]/10">
            {(['contours', 'density_mesh', 'points_only'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setDisplayMode(mode);
                }}
                className={`px-2 py-1 rounded text-[10px] uppercase transition-colors ${
                  displayMode === mode 
                    ? 'bg-[#F5F5F0] text-black font-bold' 
                    : 'text-[#F5F5F0]/50 hover:text-white'
                }`}
              >
                {mode === 'contours' ? 'Topographical Iso-Lines' : mode === 'density_mesh' ? 'Provenance Mesh' : 'Sensor Nodes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Topographical Stage & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topographical Map Canvas (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-sm bg-[#0A0A0A] border border-[#F5F5F0]/15 flex flex-col justify-between space-y-4 relative overflow-hidden min-h-[460px]">
          {/* Top Bar on Stage */}
          <div className="flex items-center justify-between text-xs font-mono relative z-20">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] uppercase font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Corroboration Mesh Active
              </span>
              <span className="text-[#F5F5F0]/50">
                Displaying {filteredPoints.length} of {EPISTEMIC_DATA_POINTS.length} Corroborated Nodes
              </span>
            </div>

            {/* Topography Legend Pill */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] bg-black/60 px-2.5 py-1 rounded border border-[#F5F5F0]/10">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                &gt;95% (Peak)
              </span>
              <span className="flex items-center gap-1 text-[#C5A059]">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                85-94%
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                70-84%
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                &lt;70% (Depression)
              </span>
            </div>
          </div>

          {/* Graphical Topographical SVG Stage */}
          <div className="relative w-full h-[360px] sm:h-[400px] bg-[#060807] rounded border border-[#F5F5F0]/10 overflow-hidden flex items-center justify-center">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

            {/* Topographical SVG Contour Bands */}
            {displayMode !== 'points_only' && (
              <svg className="w-full h-full text-emerald-500/20 p-4 absolute inset-0" viewBox="0 0 800 500" fill="none">
                {/* Elevation Contours for Mara-Serengeti Cluster (High Peak Elevation: 98% reliability) */}
                <path
                  d="M 220 280 C 260 210, 360 210, 420 270 C 470 330, 390 410, 300 400 C 240 390, 190 330, 220 280 Z"
                  stroke="#10B981"
                  strokeWidth="1.8"
                  strokeOpacity="0.4"
                  fill="rgba(16, 185, 129, 0.05)"
                />
                <path
                  d="M 250 290 C 280 240, 340 240, 380 280 C 410 320, 360 380, 310 370 C 270 360, 230 320, 250 290 Z"
                  stroke="#10B981"
                  strokeWidth="2.2"
                  strokeOpacity="0.6"
                  fill="rgba(16, 185, 129, 0.09)"
                />
                <path
                  d="M 280 300 C 300 270, 330 270, 350 300 C 370 320, 340 350, 320 350 C 300 340, 270 320, 280 300 Z"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeOpacity="0.8"
                  fill="rgba(16, 185, 129, 0.16)"
                />
                {/* Elevation Marker Label */}
                <text x="310" y="318" fill="#10B981" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">
                  EL: 98.4% (8x Corroborated)
                </text>

                {/* Elevation Contours for Aberdare & Mt. Kenya Cluster */}
                <path
                  d="M 400 120 C 450 60, 580 80, 640 150 C 690 220, 600 290, 520 270 C 450 250, 370 180, 400 120 Z"
                  stroke="#C5A059"
                  strokeWidth="1.8"
                  strokeOpacity="0.4"
                  fill="rgba(197, 160, 89, 0.05)"
                />
                <path
                  d="M 440 140 C 480 90, 560 100, 600 160 C 640 210, 580 260, 510 240 C 460 220, 410 170, 440 140 Z"
                  stroke="#C5A059"
                  strokeWidth="2.2"
                  strokeOpacity="0.6"
                  fill="rgba(197, 160, 89, 0.1)"
                />
                <text x="510" y="170" fill="#C5A059" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.8">
                  EL: 96.2% (7x Corroborated)
                </text>

                {/* Northern Chalbi Low Elevation Contour (Depression: 68% reliability) */}
                <path
                  d="M 430 40 C 480 20, 540 30, 560 70 C 580 110, 530 130, 480 120 C 430 110, 400 70, 430 40 Z"
                  stroke="#F43F5E"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.5"
                  fill="rgba(244, 63, 94, 0.06)"
                />
                <text x="470" y="80" fill="#F43F5E" fontSize="9" fontFamily="monospace" opacity="0.8">
                  Observation Sparsity [68%]
                </text>

                {/* Coastal Kilifi Contour */}
                <path
                  d="M 620 330 C 660 300, 740 320, 760 380 C 780 430, 720 470, 670 450 C 630 430, 590 370, 620 330 Z"
                  stroke="#8FB8DE"
                  strokeWidth="1.8"
                  strokeOpacity="0.4"
                  fill="rgba(143, 184, 222, 0.06)"
                />
              </svg>
            )}

            {/* Interactive Data Point Coordinate Pins */}
            {filteredPoints.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const colorClass = getNodeColor(node.reliabilityScore);

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    setSelectedNode(node);
                  }}
                  style={{ top: `${node.mapPos.y}%`, left: `${node.mapPos.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                  title={`${node.name}: ${node.reliabilityScore}% Reliability (${node.provenanceDensity} independent sources)`}
                >
                  <div className={`p-2 rounded-full border flex items-center justify-center font-mono font-bold text-[10px] ${colorClass} ${
                    isSelected ? 'ring-4 ring-emerald-500/40' : ''
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>

                  {/* Pulsing Provenance Density Ring */}
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-black text-white text-[8px] font-mono border border-emerald-500/50">
                    {node.provenanceDensity}x
                  </span>

                  {/* Hover Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 bg-[#0D0D0D]/95 border border-[#F5F5F0]/20 rounded-sm text-[10px] font-mono whitespace-nowrap text-[#F5F5F0] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                    <div className="font-bold text-white">{node.name}</div>
                    <div className="text-emerald-400">{node.reliabilityScore}% • {node.provenanceDensity} corroborating sources</div>
                  </div>
                </button>
              );
            })}

            {/* Bottom Floating Map Inspector Pill */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#F5F5F0]/10 rounded flex flex-wrap items-center justify-between gap-2 text-xs font-mono z-10">
              <div className="flex items-center gap-3">
                <span className="text-[#F5F5F0]/50">Selected Point:</span>
                <span className="text-white font-bold">{selectedNode.name}</span>
                <span className="text-[#F5F5F0]/30">•</span>
                <span className="text-emerald-400 font-bold">{selectedNode.reliabilityScore}% Reliability</span>
              </div>
              <div className="text-xs text-[#C5A059]">
                {selectedNode.provenanceDensity} Independent Observers Corroborating
              </div>
            </div>
          </div>
        </div>

        {/* Selected Epistemic Provenance Deep Dive (1 Col) */}
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/15 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header of Point */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                {selectedNode.basinRegion}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedNode.reliabilityScore}% Verified
              </span>
            </div>

            <div>
              <h3 className="text-lg font-serif text-white font-bold">{selectedNode.name}</h3>
              <p className="text-xs text-[#F5F5F0]/50 font-mono mt-0.5">
                Coordinates: [{selectedNode.coordinates[0].toFixed(3)}, {selectedNode.coordinates[1].toFixed(3)}] • Height Level {selectedNode.elevationLevel}/5
              </p>
            </div>

            {/* Key Metric Gauge */}
            <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded text-xs font-mono space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/40 uppercase">{selectedNode.keyMetric}</div>
              <div className="text-base font-bold text-white">{selectedNode.metricValue}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>Epistemic Consensus Level: {selectedNode.status.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Provenance Density Stream Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-mono text-[#C5A059] font-bold">
                <span>Corroborating Sources ({selectedNode.sources.length})</span>
                <span>Latency</span>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {selectedNode.sources.map((src, i) => (
                  <div key={i} className="p-2 bg-[#080808] border border-[#F5F5F0]/10 rounded flex items-center justify-between text-[11px] font-mono">
                    <div className="min-w-0 pr-2">
                      <div className="text-white truncate text-xs">{src.name}</div>
                      <div className="text-[9px] text-[#F5F5F0]/50 uppercase">{src.type.replace(/_/g, ' ')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-emerald-400 font-bold">{src.reliabilityWeight}%</span>
                      <div className="text-[9px] text-[#F5F5F0]/40">{src.latency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merkle Cryptographic Hash Proof */}
            <div className="p-2.5 bg-black/60 border border-[#F5F5F0]/10 rounded text-[10px] font-mono space-y-1">
              <div className="text-[#F5F5F0]/40 uppercase flex items-center gap-1">
                <FileCheck2 className="w-3 h-3 text-cyan-400" />
                <span>Merkle Provenance Root:</span>
              </div>
              <div className="text-cyan-300 truncate select-all">{selectedNode.merkleRootHash}</div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => onInspectProvenance({
                title: selectedNode.name,
                source: selectedNode.sources[0]?.name || 'Atlas Sensor Mesh',
                timestamp: selectedNode.calibratedAt,
                confidence: selectedNode.reliabilityScore,
                verificationCount: selectedNode.provenanceDensity,
                zkpProofHash: selectedNode.merkleRootHash
              })}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inspect Calibration Audit</span>
            </button>

            <button
              onClick={onOpenCommandCenter}
              className="w-full py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#F5F5F0]/15"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Query World-Model Telemetry (⌘K)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
