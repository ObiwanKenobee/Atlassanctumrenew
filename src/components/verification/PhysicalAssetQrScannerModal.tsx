import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Compass,
  Zap,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface PhysicalAssetQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetVerified?: (asset: any) => void;
}

interface ScannedAssetData {
  assetId: string;
  name: string;
  bioregion: string;
  type: string;
  gpsCoords: { lat: number; lng: number };
  covenantId: string;
  installationDate: string;
  telemetryStatus: 'ACTIVE_HEALTHY' | 'MAINTENANCE_REQUIRED' | 'CALIBRATING';
  lastAttestedBy: string;
  merkleSeal: string;
}

const SAMPLE_ASSETS: ScannedAssetData[] = [
  {
    assetId: 'PLCRD-NRB-042',
    name: 'Mathare River Bio-Composite Swale Node #04',
    bioregion: 'Nairobi River Basin, Kenya',
    type: 'Hydrological Biomass Filtration Grid',
    gpsCoords: { lat: -1.2612, lng: 36.8584 },
    covenantId: 'COV-04: Non-Extractive Regeneration',
    installationDate: '2026-03-15',
    telemetryStatus: 'ACTIVE_HEALTHY',
    lastAttestedBy: 'Mathare Community Water Council #02',
    merkleSeal: '0x99FA2148E088B421'
  },
  {
    assetId: 'PLCRD-TRK-109',
    name: 'Turkana Solar-Desalination Aquifer Piezometer #08',
    bioregion: 'Turkana Basin, Kenya',
    type: 'Groundwater Sensor & Desalination Array',
    gpsCoords: { lat: 3.1189, lng: 35.5978 },
    covenantId: 'COV-01: Inviolable Dignity Floor',
    installationDate: '2026-01-20',
    telemetryStatus: 'ACTIVE_HEALTHY',
    lastAttestedBy: 'Lotikipi Pastoralist Stewards',
    merkleSeal: '0x7B99AE12DF4801BC'
  },
  {
    assetId: 'PLCRD-KGL-077',
    name: 'Kigali Terraced Agroforestry Biochar Node #12',
    bioregion: 'Kigali Highlands, Rwanda',
    type: 'Soil Carbon Pyrolysis Micro-Station',
    gpsCoords: { lat: -1.9441, lng: 30.0619 },
    covenantId: 'COV-07: Intergenerational Soil Memory',
    installationDate: '2026-05-10',
    telemetryStatus: 'ACTIVE_HEALTHY',
    lastAttestedBy: 'Rwandan Smallholder Cooperatives',
    merkleSeal: '0x33DC8829BA1028EE'
  }
];

export const PhysicalAssetQrScannerModal: React.FC<PhysicalAssetQrScannerModalProps> = ({
  isOpen,
  onClose,
  onAssetVerified
}) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedAsset, setScannedAsset] = useState<ScannedAssetData | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [gpsLocked, setGpsLocked] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSimulateScan = (assetIndex: number = 0) => {
    audioFeedback.playSubtleClick();
    setScanning(true);
    setScannedAsset(null);
    setCameraActive(true);

    setTimeout(() => {
      setScanning(false);
      setScannedAsset(SAMPLE_ASSETS[assetIndex]);
      audioFeedback.playSuccessChime();
    }, 900);
  };

  const handleConfirmAttestation = () => {
    if (!scannedAsset) return;
    audioFeedback.playSuccess();
    if (onAssetVerified) {
      onAssetVerified(scannedAsset);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0D120F] border border-[#C5A059]/40 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#080D0A] border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0]">
                Physical Asset Verifiable QR Scanner & Attestation
              </h2>
              <p className="text-xs font-mono text-[#F5F5F0]/60">
                Ground-Truth Placard Cryptographic Lock & GPS Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F5F5F0]/50 hover:text-white rounded hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#F5F5F0] bg-[#0A0F0C]">
          {/* Scanner Viewport / Camera View */}
          <div className="relative w-full h-52 bg-black rounded-lg border border-[#C5A059]/40 overflow-hidden flex items-center justify-center">
            {/* Viewfinder Target */}
            <div className="relative w-40 h-40 border-2 border-[#C5A059] rounded-md flex items-center justify-center">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>

              {scanning ? (
                <div className="w-full h-0.5 bg-[#C5A059] animate-bounce shadow-[0_0_8px_#C5A059]"></div>
              ) : scannedAsset ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
              ) : (
                <Camera className="w-8 h-8 text-[#C5A059]/50" />
              )}
            </div>

            {/* GPS & Sensor Badge */}
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded border border-emerald-500/40 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <span>GPS LOCK: HIGH PRECISION (±1.4m)</span>
            </div>
          </div>

          {/* Quick Placard Simulation Triggers */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
              Simulate Field QR Code Placard Scans
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_ASSETS.map((asset, idx) => (
                <button
                  key={asset.assetId}
                  onClick={() => handleSimulateScan(idx)}
                  className="p-2.5 bg-[#0D1410] hover:bg-[#1B3022] border border-[#C5A059]/30 rounded text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] font-mono text-[#C5A059] font-bold">{asset.assetId}</div>
                  <div className="text-[11px] font-medium text-white truncate group-hover:text-[#C5A059]">
                    {asset.name.split(' ')[0]} {asset.name.split(' ')[1]}
                  </div>
                  <div className="text-[9px] font-mono text-[#F5F5F0]/50 truncate">{asset.bioregion}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanned Result Details */}
          {scannedAsset && (
            <div className="p-4 bg-[#0D1410] border border-emerald-500/40 rounded space-y-3 animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold inline-block mb-1">
                    VERIFIED PHYSICAL ASSET
                  </span>
                  <h3 className="text-sm font-serif font-bold text-white">{scannedAsset.name}</h3>
                  <p className="text-xs font-mono text-[#F5F5F0]/70">{scannedAsset.bioregion}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#C5A059] font-bold">{scannedAsset.assetId}</div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold">HEALTH: 100%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#F5F5F0]/10">
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">Covenant Link:</span>
                  <span className="text-[#C5A059]">{scannedAsset.covenantId}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">Attested Steward:</span>
                  <span className="text-white truncate block">{scannedAsset.lastAttestedBy}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">GPS Coordinates:</span>
                  <span className="text-[#F5F5F0]/80">
                    {scannedAsset.gpsCoords.lat}, {scannedAsset.gpsCoords.lng}
                  </span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">Merkle Seal:</span>
                  <span className="text-emerald-300 font-bold">{scannedAsset.merkleSeal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#080D0A] border-t border-[#C5A059]/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#141C16] hover:bg-[#1B3022] text-[#F5F5F0] border border-[#F5F5F0]/20 rounded text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleConfirmAttestation}
            disabled={!scannedAsset}
            className={`px-4 py-1.5 rounded text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              scannedAsset
                ? 'bg-[#C5A059] hover:bg-[#D4AF37] text-black shadow'
                : 'bg-[#1F2922] text-[#F5F5F0]/40 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Field Attestation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
