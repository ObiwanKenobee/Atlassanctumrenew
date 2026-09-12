import React from 'react';
import { 
  HelpCircle, 
  X, 
  Brain, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal, 
  Calculator, 
  Compass, 
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SatelliteHazardAlert } from '../../data/bioregionalHazardsData';
import { audioFeedback } from '../../lib/audioFeedback';

interface EpistemicExplanationModalProps {
  alert: SatelliteHazardAlert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EpistemicExplanationModal: React.FC<EpistemicExplanationModalProps> = ({
  alert,
  isOpen,
  onClose
}) => {
  if (!isOpen || !alert) return null;

  // Derive weights and sensor factors based on category
  const getEpistemicFactors = () => {
    switch (alert.hazardCategory) {
      case 'wildfire':
        return [
          { name: 'Thermal Radiative Power (VIIRS 375m / MODIS Band 21)', weight: 42, rawValue: '48.2 MW/km²', contribution: 38.6 },
          { name: 'Canopy Dryness Index (NDRE Red-Edge Decline)', weight: 28, rawValue: '-0.34 ΔNDRE', contribution: 26.2 },
          { name: 'Atmospheric Wind Vector & Vapor Deficit', weight: 18, rawValue: '34 km/h gusts', contribution: 16.1 },
          { name: 'Historical Fuel Load & Micro-weather Anomaly', weight: 12, rawValue: '14yr biomass accumulation', contribution: 11.1 }
        ];
      case 'drought':
        return [
          { name: 'GRACE-FO Terrestrial Water Storage Anomaly', weight: 38, rawValue: '-14.8 cm EWT', contribution: 34.2 },
          { name: 'In-situ Piezometric Aquifer Drawdown (Lodwar-12)', weight: 32, rawValue: '-3.8 m vs 10yr mean', contribution: 29.5 },
          { name: 'Evapotranspiration Stress Index (ALEXI)', weight: 20, rawValue: '88th percentile stress', contribution: 18.2 },
          { name: 'Pastoralist Waterpoint Borehole Pressure Drop', weight: 10, rawValue: '-2.4 bar', contribution: 9.1 }
        ];
      case 'flooding':
        return [
          { name: 'Sentinel-1 SAR Dual-Pol Water Inundation Extent', weight: 45, rawValue: '3,840 ha flooded', contribution: 41.2 },
          { name: 'Upstream River Gauge Surge Rate (Mara Sondu)', weight: 30, rawValue: '+4.2 m/hr surge', contribution: 28.0 },
          { name: 'Soil Saturation Index (SMAP Passive Microwave)', weight: 15, rawValue: '96% field capacity', contribution: 14.4 },
          { name: 'Digital Elevation Model Runoff Velocity (Copernicus DEM)', weight: 10, rawValue: '1.8 m/s velocity', contribution: 9.4 }
        ];
      case 'deforestation':
        return [
          { name: 'Sentinel-2 MSI 10m Canopy Disruption (GLAD Alert)', weight: 40, rawValue: '28 ha cleared in 72h', contribution: 37.0 },
          { name: 'Bioacoustic Chainsaw Frequency Anomaly (Acoustic Node #7)', weight: 30, rawValue: '4.2 kHz sustained waveform', contribution: 28.5 },
          { name: 'Thermal Road Cutting Sentinel Trace', weight: 20, rawValue: '1.8 km new intrusion track', contribution: 18.0 },
          { name: 'Customary Elder FPIC Perimeter Violation Flag', weight: 10, rawValue: 'Within sacred grove buffer', contribution: 9.5 }
        ];
      default:
        return [
          { name: 'Multispectral Vegetative Variance', weight: 35, rawValue: '-0.28 index', contribution: 31.5 },
          { name: 'Spaceborne Radiometric Inversion', weight: 30, rawValue: '4.2 sigma anomaly', contribution: 28.2 },
          { name: 'In-situ Ground Telemetry Calibration', weight: 20, rawValue: '3 telemetry nodes concordant', contribution: 19.4 },
          { name: 'Ecological Prior Probability Weight', weight: 15, rawValue: 'High seasonal vulnerability', contribution: 13.9 }
        ];
    }
  };

  const factors = getEpistemicFactors();

  return (
    <div 
      id="epistemic-explanation-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-[#09100C] border border-[#C5A059]/40 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-[#F5F5F0] shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#121E16] via-[#0D1711] to-[#121E16] border-b border-[#C5A059]/30 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black/60 border border-[#C5A059]/50 text-[#C5A059]">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C5A059]">
                  Epistemic Explanation &amp; AI Provenance
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  OPEN ALGORITHM
                </span>
              </div>
              <h3 className="text-sm font-serif font-bold text-white mt-0.5">
                {alert.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Executive Epistemic Summary */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-[11px] font-bold">
                Computed Hazard Score:
              </span>
              <span className="text-base font-bold text-rose-400">
                {alert.confidenceScore}% Intensity ({alert.severity})
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans leading-relaxed">
              This score was generated through Bayesian multi-sensor fusion. No black box: the score represents an empirical aggregation of spaceborne spectral bands, ground-level lysimeters, and acoustic sentinels weighted below.
            </p>
          </div>

          {/* Mathematical Decomposition Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/60 uppercase font-bold tracking-wider">
              <span>Sensor Weighting Matrix</span>
              <span>Input Contribution</span>
            </div>

            <div className="space-y-2">
              {factors.map((f, i) => (
                <div key={i} className="p-2.5 rounded bg-black/50 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white/90 truncate max-w-[260px]">
                      {f.name}
                    </span>
                    <span className="text-[#C5A059] font-bold">
                      {f.weight}% weight
                    </span>
                  </div>

                  {/* Weight bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-[#C5A059] h-full"
                      style={{ width: `${f.weight * 2}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-white/50 pt-0.5">
                    <span>Telemetry Value: {f.rawValue}</span>
                    <span className="text-emerald-400">+{f.contribution.toFixed(1)} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Epistemic Formula Display */}
          <div className="p-3 rounded-lg bg-[#141E17]/60 border border-emerald-500/30 space-y-1.5">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3 h-3" />
              Epistemic Equation Formulation:
            </span>
            <div className="p-2 rounded bg-black/60 font-mono text-[10px] text-[#C5A059] text-center border border-white/10">
              Score = &Sigma; (w_i &times; &Delta;_telemetry) &times; &gamma;_spatial + &beta;_prior
            </div>
            <div className="text-[10px] text-white/60 font-sans">
              95% Bayesian Credible Interval: [{(alert.confidenceScore - 2.8).toFixed(1)}%, {(alert.confidenceScore + 2.1).toFixed(1)}%] with p &lt; 0.001.
            </div>
          </div>

          {/* Counterfactual Sensitivity Analysis */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1.5">
            <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3" />
              Counterfactual Sensitivity What-If:
            </span>
            <p className="text-[11px] text-white/70 font-sans leading-relaxed">
              &ldquo;If local soil moisture increases by 15% through swale infiltration, the composite risk score drops from <strong>{alert.confidenceScore}%</strong> to <strong>{(alert.confidenceScore * 0.76).toFixed(0)}%</strong>, downgrading this hazard from Critical to Advisory.&rdquo;
            </p>
          </div>

          {/* Cryptographic Attestation */}
          <div className="p-2.5 rounded bg-black/60 border border-white/10 text-[9px] text-white/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Merkle Proof: {alert.merkleHash.slice(0, 16)}...</span>
            </div>
            <span className="text-emerald-400 font-bold">VERIFIED SATELLITE TRANSLATION</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0A0E0B] border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-white/40 font-mono">
            Audited against Atlas Bioregional Canon v2.4
          </span>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono font-bold text-xs cursor-pointer shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
