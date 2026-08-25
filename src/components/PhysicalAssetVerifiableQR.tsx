import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Radio, 
  ShieldCheck, 
  Calendar, 
  Wrench, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  ExternalLink, 
  Maximize2,
  MapPin,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

export interface MaintenanceEvent {
  id: string;
  type: 'commissioning' | 'calibration' | 'filter_replacement' | 'elder_inspection' | 'firmware_attestation';
  date: string;
  technicianOrAuditor: string;
  status: 'completed' | 'scheduled' | 'overdue';
  notes: string;
  cryptographicSignature: string;
}

export interface PhysicalInfrastructureAsset {
  id: string;
  assetTag: string;
  name: string;
  category: 'water_filtration' | 'sensor_flux_tower' | 'biochar_kiln' | 'microgrid' | 'desalination_basin';
  bioregion: string;
  coordinates: [number, number]; // [lat, lng]
  elevationMeters: number;
  commissionedDate: string;
  expectedLifespanYears: number;
  currentHealthScore: number; // 0 - 100
  telemetryStreamId: string;
  sensorMeshFrequency: string;
  merkleProofRoot: string;
  epistemicClass: 'Verified' | 'Observed' | 'Modeled';
  hardwareSpecs: {
    manufacturer: string;
    model: string;
    firmwareVersion: string;
    powerSource: string;
    enclosureRating: string;
  };
  maintenanceTimeline: MaintenanceEvent[];
}

export const PHYSICAL_ASSETS: PhysicalInfrastructureAsset[] = [
  {
    id: 'ast-nrb-001',
    assetTag: 'AST-NRB-001',
    name: 'Mathare River Flow & Bio-Filtration Piezometer Array',
    category: 'water_filtration',
    bioregion: 'Upper Athi Catchment, Nairobi, Kenya',
    coordinates: [-1.2612, 36.8584],
    elevationMeters: 1640,
    commissionedDate: '2025-03-15',
    expectedLifespanYears: 12,
    currentHealthScore: 98.4,
    telemetryStreamId: 'stream-mathare-water-04',
    sensorMeshFrequency: 'Every 5 minutes (Cellular + LoRaWAN)',
    merkleProofRoot: '0x9d4a821bc7f0e34a61c5e9821a7b4430e',
    epistemicClass: 'Verified',
    hardwareSpecs: {
      manufacturer: 'Athi Bioregional Field Foundry',
      model: 'HydroSentry-MkIV LoRa',
      firmwareVersion: 'v3.2.1-attested',
      powerSource: 'Dual 40W Monocrystalline Solar + 24Ah LiFePO4',
      enclosureRating: 'IP68 Submersible Marine Grade Stainless'
    },
    maintenanceTimeline: [
      {
        id: 'maint-01',
        type: 'commissioning',
        date: '2025-03-15',
        technicianOrAuditor: 'Dr. Naomi Muthoni & Community Elder Baraza',
        status: 'completed',
        notes: 'Initial hydrodynamic calibration and optical turbidity baseline zeroing.',
        cryptographicSignature: '0x3a9f...e112'
      },
      {
        id: 'maint-02',
        type: 'calibration',
        date: '2025-09-20',
        technicianOrAuditor: 'Athi Field Technicians Guild',
        status: 'completed',
        notes: 'pH probe electrolyte replenishment and ultrasonic sensor cleaning.',
        cryptographicSignature: '0x88c2...fa90'
      },
      {
        id: 'maint-03',
        type: 'elder_inspection',
        date: '2026-02-10',
        technicianOrAuditor: 'Mathare Riparian Stewardship Council',
        status: 'completed',
        notes: 'Bio-filtration reed bed rooting audit; zero macro-plastic fouling observed.',
        cryptographicSignature: '0x71d4...bb55'
      },
      {
        id: 'maint-04',
        type: 'filter_replacement',
        date: '2026-09-15',
        technicianOrAuditor: 'Scheduled Field Service Team',
        status: 'scheduled',
        notes: 'Activated biochar layer renewal & gravel bed aeration cycle.',
        cryptographicSignature: 'Pending execution'
      }
    ]
  },
  {
    id: 'ast-kil-004',
    assetTag: 'AST-KIL-004',
    name: 'Kilifi Tidal Hydro-Sensor & Mangrove Salinity Node',
    category: 'sensor_flux_tower',
    bioregion: 'Kilifi Coastal Creek, Swahili Coast',
    coordinates: [-3.5107, 39.9093],
    elevationMeters: 2,
    commissionedDate: '2025-06-01',
    expectedLifespanYears: 15,
    currentHealthScore: 99.1,
    telemetryStreamId: 'stream-kilifi-mangrove-08',
    sensorMeshFrequency: 'Every 15 minutes (Satellite Satellite-IoT / NB-IoT)',
    merkleProofRoot: '0x44f1a9b83e2c019d77e6b5a3f218c900e',
    epistemicClass: 'Verified',
    hardwareSpecs: {
      manufacturer: 'Pwani Marine Technologies & Community Trust',
      model: 'MangroveTide-PRO-X',
      firmwareVersion: 'v2.8.0-marine',
      powerSource: 'Tidal Kinetic Micro-Turbine + Solar Hybrid',
      enclosureRating: 'Titanium Grade 5 Anti-Corrosion'
    },
    maintenanceTimeline: [
      {
        id: 'maint-k01',
        type: 'commissioning',
        date: '2025-06-01',
        technicianOrAuditor: 'Kilifi Mangrove Custodian Collective',
        status: 'completed',
        notes: 'Anchored on Rhizophora mucronata root barrier at high tide datum.',
        cryptographicSignature: '0x12a9...99bc'
      },
      {
        id: 'maint-k02',
        type: 'calibration',
        date: '2026-01-14',
        technicianOrAuditor: 'Kenya Marine & Fisheries Research Team',
        status: 'completed',
        notes: 'Salinity refractometer sensor calibration against standard seawater sample.',
        cryptographicSignature: '0x55d0...33e1'
      }
    ]
  },
  {
    id: 'ast-mar-012',
    assetTag: 'AST-MAR-012',
    name: 'Mara Basin Solar Biochar Pyrolysis Kiln & Soil Mesh',
    category: 'biochar_kiln',
    bioregion: 'Mara River Catchment & Loita Hills, Kenya',
    coordinates: [-1.4589, 35.3211],
    elevationMeters: 1890,
    commissionedDate: '2025-08-10',
    expectedLifespanYears: 10,
    currentHealthScore: 96.7,
    telemetryStreamId: 'stream-mara-pyrolysis-02',
    sensorMeshFrequency: 'Hourly sync (LoRa Star Mesh to Starlink Gateway)',
    merkleProofRoot: '0x1b7c89a03f4e2d1c6899e0a2b5c4f3d2a',
    epistemicClass: 'Verified',
    hardwareSpecs: {
      manufacturer: 'Loita Regenerative Forge',
      model: 'RetortKiln-SolarThermal-1000',
      firmwareVersion: 'v4.0.2',
      powerSource: 'Thermal Recovery Pyrolysis Heat Exchanger',
      enclosureRating: 'Refractory Ceramic Core'
    },
    maintenanceTimeline: [
      {
        id: 'maint-m01',
        type: 'commissioning',
        date: '2025-08-10',
        technicianOrAuditor: 'Maasai Mara Pastoralist Ecology Council',
        status: 'completed',
        notes: 'Invasive Acacia reficiens biomass feedstock processing test passed.',
        cryptographicSignature: '0x88f2...11a3'
      },
      {
        id: 'maint-m02',
        type: 'firmware_attestation',
        date: '2026-03-01',
        technicianOrAuditor: 'Decentralized Firmware Security Mesh',
        status: 'completed',
        notes: 'Cryptographic zero-knowledge thermal telemetry coprocessor patch.',
        cryptographicSignature: '0xaa44...88d9'
      }
    ]
  }
];

interface PhysicalAssetVerifiableQRProps {
  onSelectTab?: (tab: any) => void;
  onInspectProvenance?: (prov: any) => void;
  className?: string;
}

export const PhysicalAssetVerifiableQR: React.FC<PhysicalAssetVerifiableQRProps> = ({
  onSelectTab,
  onInspectProvenance,
  className = ''
}) => {
  const [selectedAsset, setSelectedAsset] = useState<PhysicalInfrastructureAsset>(PHYSICAL_ASSETS[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isPlacardModalOpen, setIsPlacardModalOpen] = useState<boolean>(false);
  const [scanSuccessFeedback, setScanSuccessFeedback] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Verification deep link encoded in the QR code
  const verificationUrl = `https://atlassanctum.org/reality-engine?asset=${selectedAsset.assetTag}&merkle=${selectedAsset.merkleProofRoot}&timestamp=${Date.now()}`;

  useEffect(() => {
    QRCode.toDataURL(
      verificationUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0A0A0A',
          light: '#F5F5F0'
        },
        errorCorrectionLevel: 'H'
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [selectedAsset, verificationUrl]);

  const handleSimulateFieldScan = () => {
    audioFeedback.playTelemetryWarning();
    setScanSuccessFeedback(`Field QR Scan Verified: Authenticated ${selectedAsset.name} [Merkle Root: ${selectedAsset.merkleProofRoot.slice(0, 10)}...]`);
    
    if (onInspectProvenance) {
      setTimeout(() => {
        onInspectProvenance({
          id: selectedAsset.assetTag,
          source: `${selectedAsset.name} (${selectedAsset.hardwareSpecs.model})`,
          sourceType: 'iot_sensor_mesh',
          collectedAt: new Date().toISOString(),
          calculationMethod: `In-Situ Ingest Stream: ${selectedAsset.telemetryStreamId}`,
          certaintyScore: 98.4,
          verifier: selectedAsset.maintenanceTimeline[0].technicianOrAuditor,
          verifierRole: 'Certified Physical Infrastructure Anchor',
          cryptographicHash: selectedAsset.merkleProofRoot,
          assumptions: [
            `Hardware Specs: ${selectedAsset.hardwareSpecs.manufacturer}`,
            `Power: ${selectedAsset.hardwareSpecs.powerSource}`,
            `Enclosure: ${selectedAsset.hardwareSpecs.enclosureRating}`
          ],
          lastAudited: selectedAsset.maintenanceTimeline[0].date
        });
      }, 800);
    }
  };

  const handleCopyMerkle = () => {
    navigator.clipboard.writeText(selectedAsset.merkleProofRoot);
    setCopiedHash(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className={`p-6 sm:p-8 bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm space-y-8 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold flex items-center gap-1.5">
              <QrCode className="w-3 h-3 text-[#C5A059]" />
              PHYSICAL INFRASTRUCTURE ASSET REGISTRY & CRYPTOGRAPHIC QR PLACARDS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0]">
            Verifiable Hardware QR & Reality Engine Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/65 max-w-2xl font-sans">
            Every physical pump, telemetry sensor, and biochar kiln possesses a tamper-evident QR code bridging physical ground-truth to the Reality Engine.
          </p>
        </div>

        {/* Asset Switcher */}
        <div className="flex items-center gap-2">
          {PHYSICAL_ASSETS.map((asset) => (
            <button
              key={asset.id}
              onClick={() => {
                setSelectedAsset(asset);
                setScanSuccessFeedback(null);
                audioFeedback.playSubtleClick();
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all ${
                selectedAsset.id === asset.id
                  ? 'bg-[#1B3022] border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {asset.assetTag}
            </button>
          ))}
        </div>
      </div>

      {/* Field Scan Success Toast */}
      {scanSuccessFeedback && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded text-xs font-mono text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scanSuccessFeedback}</span>
          </div>
          <button 
            onClick={() => setScanSuccessFeedback(null)}
            className="text-xs text-emerald-400/60 hover:text-emerald-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Asset Layout: QR Code Placard on Left + Telemetry & Lifecycle Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Cryptographic QR Code Placard (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm space-y-4 text-center relative overflow-hidden group">
            {/* Top Accent Strip */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10 text-left">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                  AUTHENTICATED ATLAS ASSET PLACARD
                </span>
                <span className="text-sm font-mono font-bold text-[#F5F5F0]">
                  {selectedAsset.assetTag}
                </span>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                {selectedAsset.epistemicClass}
              </span>
            </div>

            {/* Generated QR Code Image */}
            <div className="p-3 bg-[#F5F5F0] rounded-sm inline-block shadow-2xl border-4 border-[#0A0A0A]">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt={`QR Code for ${selectedAsset.assetTag}`}
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-neutral-800">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            {/* Verification Link Info */}
            <div className="space-y-1.5 text-left pt-2 border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/70">
              <div className="flex justify-between items-center">
                <span>Merkle Proof Root:</span>
                <button
                  onClick={handleCopyMerkle}
                  className="text-[#C5A059] hover:underline flex items-center gap-1"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{selectedAsset.merkleProofRoot.slice(0, 10)}...</span>
                </button>
              </div>
              <div className="flex justify-between">
                <span>Coordinates:</span>
                <span className="text-[#F5F5F0]">{selectedAsset.coordinates.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Mesh Broadcast:</span>
                <span className="text-emerald-400 font-bold">{selectedAsset.sensorMeshFrequency}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleSimulateFieldScan}
                className="py-2 px-3 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Simulate Scan</span>
              </button>
              <button
                onClick={() => setIsPlacardModalOpen(true)}
                className="py-2 px-3 bg-[#181818] hover:bg-[#222] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Print Placard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Health & Maintenance Lifecycle Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Asset Telemetry & Hardware Metadata Grid */}
          <div className="p-5 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">{selectedAsset.name}</h3>
                <p className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{selectedAsset.bioregion} (Alt: {selectedAsset.elevationMeters}m)</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase block">Hardware Health</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {selectedAsset.currentHealthScore}%
                </span>
              </div>
            </div>

            {/* Hardware Spec Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono text-[#F5F5F0]/70 pt-2 border-t border-[#F5F5F0]/10">
              <div className="p-2 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5">
                <span className="text-[#F5F5F0]/40 block">Manufacturer</span>
                <span className="text-[#F5F5F0] font-bold truncate block">{selectedAsset.hardwareSpecs.manufacturer}</span>
              </div>
              <div className="p-2 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5">
                <span className="text-[#F5F5F0]/40 block">Model & Firmware</span>
                <span className="text-[#F5F5F0] font-bold truncate block">{selectedAsset.hardwareSpecs.model} ({selectedAsset.hardwareSpecs.firmwareVersion})</span>
              </div>
              <div className="p-2 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 col-span-2 sm:col-span-1">
                <span className="text-[#F5F5F0]/40 block">Power System</span>
                <span className="text-[#F5F5F0] font-bold truncate block">{selectedAsset.hardwareSpecs.powerSource}</span>
              </div>
            </div>
          </div>

          {/* Maintenance Lifecycle Timeline */}
          <div className="p-5 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#C5A059]" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5F5F0] font-bold">
                  Maintenance & Calibration Lifecycle History
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                Commissioned {selectedAsset.commissionedDate}
              </span>
            </div>

            <div className="space-y-3 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F5F5F0]/10">
              {selectedAsset.maintenanceTimeline.map((item, idx) => (
                <div key={item.id} className="relative space-y-1">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                    item.status === 'completed' 
                      ? 'bg-emerald-400 border-[#0D0D0D]' 
                      : item.status === 'scheduled' 
                      ? 'bg-[#C5A059] border-[#0D0D0D] animate-pulse' 
                      : 'bg-rose-500 border-[#0D0D0D]'
                  }`} />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#F5F5F0] capitalize">
                      {item.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                      item.status === 'completed' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                    }`}>
                      {item.date} • {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {item.notes}
                  </p>

                  <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40 pt-0.5">
                    <span>Auditor: {item.technicianOrAuditor}</span>
                    <span>Sig: {item.cryptographicSignature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Physical Placard Spec Modal */}
      {isPlacardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-[#C5A059] rounded-sm max-w-lg w-full p-6 space-y-6 text-[#F5F5F0] relative">
            <button
              onClick={() => setIsPlacardModalOpen(false)}
              className="absolute top-4 right-4 text-[#F5F5F0]/60 hover:text-white text-sm font-mono"
            >
              ✕
            </button>

            <div className="text-center space-y-1 pb-4 border-b border-[#F5F5F0]/20">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                PHYSICAL HARDWARE PLACARD SPECIFICATION
              </span>
              <h3 className="text-xl font-serif font-bold">{selectedAsset.name}</h3>
              <p className="text-xs font-mono text-[#F5F5F0]/60">Tamper-Evident Laser-Engraved Stainless Steel Plate</p>
            </div>

            <div className="flex items-center justify-center p-4 bg-[#F5F5F0] rounded border-2 border-[#0A0A0A]">
              <img src={qrDataUrl} alt="" className="w-48 h-48" />
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#141414] p-3.5 rounded border border-[#F5F5F0]/10">
              <div className="flex justify-between">
                <span className="text-[#F5F5F0]/50">Asset Code:</span>
                <span className="text-[#C5A059] font-bold">{selectedAsset.assetTag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5F5F0]/50">Bioregional Authority:</span>
                <span>{selectedAsset.bioregion.split(',')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F5F5F0]/50">Deep Link URL:</span>
                <span className="text-[10px] truncate max-w-[240px] text-emerald-400">{verificationUrl}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059] text-[#C5A059] font-mono text-xs font-bold rounded flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Send to Printer / Laser Engraver</span>
              </button>
              <button
                onClick={() => setIsPlacardModalOpen(false)}
                className="px-4 py-2.5 bg-[#141414] border border-[#F5F5F0]/20 text-[#F5F5F0] font-mono text-xs rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
