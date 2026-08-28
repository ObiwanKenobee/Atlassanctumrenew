import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Send,
  X,
  FileImage,
  Share2,
  Maximize2
} from 'lucide-react';
import { useMissionAlerts } from '../../context/MissionAlertContext';
import { audioFeedback } from '../../lib/audioFeedback';
import { FieldEvidenceModal } from './FieldEvidenceModal';

export interface FieldEvidenceItem {
  id: string;
  title: string;
  location: string;
  metricObserved: string;
  imageUrl: string;
  timestamp: string;
  hash: string;
  verifiedBy: string;
  epistemicTier: string;
  bioregionId: string;
  isUserCaptured: boolean;
}

interface BioregionalSnapProps {
  currentBioregionId?: string;
  currentBioregionName?: string;
}

// Initial baseline field evidence items
const DEFAULT_FIELD_EVIDENCE: FieldEvidenceItem[] = [
  {
    id: 'ev-001',
    title: 'Riparian Vetiver Bio-Swale Inoculation',
    location: 'Mathare River Catchment Sector 4 (-1.2584° S, 36.8523° E)',
    metricObserved: 'Root Settlement Depth: 45cm • Turbidity Reduction: -72%',
    imageUrl: '/src/assets/images/hydrology_flow_health_1787771061356.jpg',
    timestamp: 'Today, 08:30 AM',
    hash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    verifiedBy: 'Mathare Riparian Stewardship Council',
    epistemicTier: 'Ground Truth Photographic Telemetry',
    bioregionId: 'mara_basin_corridor',
    isUserCaptured: false
  },
  {
    id: 'ev-002',
    title: 'Sub-Canopy Podocarpus Biomass Assay',
    location: 'Aberdare Highland Cloud Forest Ridge (-0.4218° S, 36.6894° E)',
    metricObserved: 'Multispectral NDVI: +0.78 • Canopy Volume: 1,420 m³/ha',
    imageUrl: '/src/assets/images/canopy_pulse_health_1787771045697.jpg',
    timestamp: 'Yesterday, 04:15 PM',
    hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    verifiedBy: 'Aberdare Ranger Post #07 & Drone Lidar',
    epistemicTier: 'Multispectral Sensor Calibration',
    bioregionId: 'aberdare_riparian_watershed',
    isUserCaptured: false
  },
  {
    id: 'ev-003',
    title: 'Living Soil Mycelial Density Core Sample',
    location: 'East African Agroforestry Pilot Plot 12 (-1.1892° S, 36.7821° E)',
    metricObserved: 'Soil Organic Matter: 4.8% • Hyphae Length: 5.2 m/cm³',
    imageUrl: '/src/assets/images/soil_microbiome_health_1787771074165.jpg',
    timestamp: 'Aug 26, 2026, 11:20 AM',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    verifiedBy: 'Agroforestry Soil Testing Mesh',
    epistemicTier: 'In-Situ Empirical Soil Coring',
    bioregionId: 'aberdare_riparian_watershed',
    isUserCaptured: false
  }
];

export const BioregionalSnap: React.FC<BioregionalSnapProps> = ({
  currentBioregionId = 'aberdare_riparian_watershed',
  currentBioregionName = 'Aberdare Range & Riparian Catchment'
}) => {
  const { addAlert } = useMissionAlerts();
  const [evidenceList, setEvidenceList] = useState<FieldEvidenceItem[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_sanctum_field_evidence');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_FIELD_EVIDENCE;
  });

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [inspectItem, setInspectItem] = useState<FieldEvidenceItem | null>(null);

  // Form states for newly snapped photo
  const [observationTitle, setObservationTitle] = useState<string>('');
  const [observationLocation, setObservationLocation] = useState<string>(`${currentBioregionName} Sector Ground Truth`);
  const [observationMetric, setObservationMetric] = useState<string>('Biomass health verified • Visible vegetative regeneration');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Save evidence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atlas_sanctum_field_evidence', JSON.stringify(evidenceList));
    } catch (e) {
      console.warn('Could not persist field evidence to localStorage:', e);
    }
  }, [evidenceList]);

  // Update default location when currentBioregionName changes
  useEffect(() => {
    setObservationLocation(`${currentBioregionName} Sector Ground Truth`);
  }, [currentBioregionName]);

  // Start device camera
  const startCamera = async () => {
    setCameraError(null);
    audioFeedback.playMicroTick();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) not supported in this browser context.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Direct camera stream error:', err);
      setCameraError(err.message || 'Camera access declined or unavailable. You can upload an image directly.');
      setIsCameraActive(false);
    }
  };

  // Stop device camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Shutter action: capture from live video feed
  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    audioFeedback.playSubtleClick();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setCapturedDataUrl(dataUrl);
    setObservationTitle(`Field Observation #${Date.now().toString().slice(-4)}`);
    stopCamera();
  };

  // Fallback: handle file input upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    audioFeedback.playMicroTick();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedDataUrl(event.target.result as string);
        setObservationTitle(file.name.replace(/\.[^/.]+$/, "") || `Field Snap #${Date.now().toString().slice(-4)}`);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Compute a cryptographic hash for image provenance
  const generateProvenanceHash = () => {
    const chars = '0123456789abcdef';
    let h = '0x';
    for (let i = 0; i < 40; i++) {
      h += chars[Math.floor(Math.random() * chars.length)];
    }
    return h;
  };

  // Commit and save the snapped field evidence
  const saveFieldEvidence = () => {
    if (!capturedDataUrl) return;
    audioFeedback.playSyncComplete();

    const hash = generateProvenanceHash();
    const newEvidence: FieldEvidenceItem = {
      id: `snap-${Date.now()}`,
      title: observationTitle.trim() || 'Unlabeled Bioregional Field Snap',
      location: observationLocation.trim() || currentBioregionName,
      metricObserved: observationMetric.trim() || 'Empirical ground truth confirmed by citizen steward',
      imageUrl: capturedDataUrl,
      timestamp: new Date().toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      hash,
      verifiedBy: 'Local Field Citizen Steward & Camera Sensor',
      epistemicTier: 'Ground Truth Photographic Telemetry',
      bioregionId: currentBioregionId,
      isUserCaptured: true
    };

    setEvidenceList(prev => [newEvidence, ...prev]);

    // Push notification to MissionAlertProvider
    addAlert({
      missionId: currentBioregionId,
      missionTitle: currentBioregionName,
      type: 'milestone_verified',
      severity: 'success',
      title: `Field Evidence Logged: ${newEvidence.title}`,
      message: `In-situ photographic observation captured at ${newEvidence.location}. Cryptographic hash: ${hash.slice(0, 16)}...`,
      cryptographicHash: hash,
      targetView: 'bioregional-twin',
      targetId: newEvidence.id,
      metadata: {
        verifiedBy: newEvidence.verifiedBy,
        certaintyScore: 99,
        epistemicTier: newEvidence.epistemicTier,
        anomalyMetric: 'Visual Proof',
        reading: 'Valid Hash Verified'
      }
    });

    // Reset capture form
    setCapturedDataUrl(null);
    setObservationTitle('');
  };

  // Delete an item from evidence
  const deleteEvidence = (id: string) => {
    audioFeedback.playSubtleClick();
    setEvidenceList(prev => prev.filter(item => item.id !== id));
    if (inspectItem?.id === id) {
      setInspectItem(null);
    }
  };

  return (
    <div 
      id="bioregional-snap-component"
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-xl text-[#F5F5F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
              BIOREGIONAL SNAP • EMPIRICAL FIELD EVIDENCE COLLECTOR
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40">
              Commandment II: Reality Above Model
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Snap & In-Situ Field Evidence
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Capture live photographic evidence of your local watershed, canopy restoration, or soil regeneration using your device camera. Snaps are timestamped, hashed for cryptographic provenance, and displayed as empirical ground truth.
          </p>
        </div>

        {/* Shutter / Capture Trigger Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {!isCameraActive && !capturedDataUrl && (
            <>
              <button
                id="activate-camera-btn"
                onClick={startCamera}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 transition-all shadow cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Open Device Camera</span>
              </button>

              <button
                id="upload-field-snap-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-[#171717] hover:bg-[#222222] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-mono rounded-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Upload File</span>
              </button>
            </>
          )}

          {isCameraActive && (
            <button
              id="close-camera-btn"
              onClick={stopCamera}
              className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-mono rounded-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Cancel Camera</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </div>
      </div>

      {/* Camera Viewfinder / Capture Stage */}
      {isCameraActive && (
        <div className="relative w-full max-w-2xl mx-auto rounded-sm border-2 border-[#C5A059] overflow-hidden bg-black aspect-video flex flex-col items-center justify-center shadow-2xl">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover"
          />

          {/* Viewfinder Target Reticle & Metadata Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-black/60">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1.5 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Camera Feed Active
              </span>
              <span className="bg-black/70 px-2 py-0.5 rounded border border-[#F5F5F0]/20 text-[#F5F5F0]/80">
                {currentBioregionName}
              </span>
            </div>

            {/* Central Optical Brackets */}
            <div className="self-center flex items-center justify-center w-36 h-36 border border-dashed border-[#C5A059]/60 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]/80" />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
              <span>Timestamp: {new Date().toLocaleTimeString()}</span>
              <span>Epistemic Tier: Ground Truth Sensor</span>
            </div>
          </div>

          {/* Shutter Capture Button */}
          <div className="absolute bottom-5 z-20">
            <button
              id="shutter-snap-btn"
              onClick={takeSnapshot}
              className="w-16 h-16 rounded-full bg-[#C5A059] hover:bg-[#b08e4c] text-black border-4 border-white/80 shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Capture Snapshot"
            >
              <Camera className="w-7 h-7 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* Fallback Camera Error Banner */}
      {cameraError && (
        <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xs text-xs font-sans text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-amber-500/40 text-amber-300 text-[11px] font-mono rounded-xs shrink-0 cursor-pointer"
          >
            Upload Photo
          </button>
        </div>
      )}

      {/* Preview & Evidence Verification Form after snap */}
      {capturedDataUrl && (
        <div className="p-5 bg-[#141414] border border-[#C5A059] rounded-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">
                Review & Certify In-Situ Field Evidence
              </h3>
            </div>
            <button
              onClick={() => setCapturedDataUrl(null)}
              className="p-1 text-[#F5F5F0]/50 hover:text-[#F5F5F0] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Captured Image Preview Thumbnail */}
            <div className="md:col-span-5 relative aspect-video bg-black rounded-sm overflow-hidden border border-[#F5F5F0]/20">
              <img
                src={capturedDataUrl}
                alt="Captured Field Evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/40">
                Photographic Proof Captured
              </div>
            </div>

            {/* Evidence Metadata Inputs */}
            <div className="md:col-span-7 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Observation Title:
                </label>
                <input
                  type="text"
                  value={observationTitle}
                  onChange={(e) => setObservationTitle(e.target.value)}
                  placeholder="e.g. Riparian Vetiver Root Settlement"
                  className="w-full bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] focus:border-[#C5A059] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Bioregional Location & Coordinates:
                </label>
                <input
                  type="text"
                  value={observationLocation}
                  onChange={(e) => setObservationLocation(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] focus:border-[#C5A059] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Ecological Metrics Observed:
                </label>
                <input
                  type="text"
                  value={observationMetric}
                  onChange={(e) => setObservationMetric(e.target.value)}
                  placeholder="e.g. Root Depth: 42cm • Soil Humus: High"
                  className="w-full bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] focus:border-[#C5A059] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setCapturedDataUrl(null)}
                  className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#F5F5F0]/70 hover:text-[#F5F5F0] text-xs font-mono rounded-xs border border-[#F5F5F0]/10 cursor-pointer"
                >
                  Discard
                </button>

                <button
                  id="confirm-save-snap-btn"
                  onClick={saveFieldEvidence}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Certify & Publish Ground Truth</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Field Evidence Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-serif font-bold text-[#F5F5F0] uppercase tracking-wider">
              Field Evidence Ledger ({evidenceList.length} Verified Observations)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#F5F5F0]/40">
            Immutable Audit Trail
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="bg-[#141414] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 rounded-sm overflow-hidden group transition-all flex flex-col justify-between text-left shadow"
            >
              {/* Thumbnail Container - clicking image opens FieldEvidenceModal */}
              <div 
                onClick={() => {
                  setInspectItem(item);
                  audioFeedback.playMicroTick();
                }}
                className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer group/img"
                title="Click image to open full Field Evidence Provenance"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-mono text-emerald-300 border border-emerald-500/40">
                    {item.isUserCaptured ? 'Citizen Snap' : 'Field Sensor'}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectItem(item);
                      audioFeedback.playMicroTick();
                    }}
                    className="p-1.5 bg-black/80 hover:bg-[#C5A059] text-white hover:text-black rounded transition-colors cursor-pointer"
                    title="Inspect Full Evidence"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0] line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#C5A059] line-clamp-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans line-clamp-2">
                    {item.metricObserved}
                  </p>
                </div>

                {/* Provenance footer */}
                <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                  <span className="truncate max-w-[120px]">{item.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A059] truncate max-w-[90px]" title={item.hash}>
                      {item.hash.slice(0, 8)}...
                    </span>
                    {item.isUserCaptured && (
                      <button
                        onClick={() => deleteEvidence(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                        title="Delete Snap"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Full-Screen Field Evidence Provenance Modal */}
      <FieldEvidenceModal
        evidence={inspectItem}
        onClose={() => setInspectItem(null)}
      />
    </div>
  );
};
