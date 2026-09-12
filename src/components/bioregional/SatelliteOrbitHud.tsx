import React, { useState, useEffect } from 'react';
import { Radio, Satellite, Crosshair, Lock, Unlock, Compass, Activity } from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface SatelliteOrbitHudProps {
  onOrbitPositionUpdate?: (coords: [number, number]) => void;
  isOrbitLocked: boolean;
  onToggleOrbitLock: () => void;
}

export interface OrbitSensorState {
  satelliteName: string;
  sensorPayload: string;
  altitudeKm: number;
  velocityKmS: number;
  inclinationDeg: number;
  swathKm: number;
  latitude: number;
  longitude: number;
  sunElevationDeg: number;
}

export const SatelliteOrbitHud: React.FC<SatelliteOrbitHudProps> = ({
  onOrbitPositionUpdate,
  isOrbitLocked,
  onToggleOrbitLock
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [sensorState, setSensorState] = useState<OrbitSensorState>({
    satelliteName: 'Sentinel-2C',
    sensorPayload: 'MSI (13 Spectral Bands)',
    altitudeKm: 786.2,
    velocityKmS: 7.46,
    inclinationDeg: 98.62,
    swathKm: 290,
    latitude: -1.28,
    longitude: 34.82,
    sunElevationDeg: 48.3
  });

  // Orbital physics simulation tick: follows sun-synchronous retrograde polar orbit
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorState(prev => {
        // Orbital motion: moves south-west across ascending/descending nodes
        let nextLat = prev.latitude - 0.35;
        if (nextLat < -65) nextLat = 65;

        // Longitude precession
        let nextLng = prev.longitude - 0.22;
        if (nextLng < -180) nextLng = 180;

        const nextState: OrbitSensorState = {
          ...prev,
          latitude: Number(nextLat.toFixed(3)),
          longitude: Number(nextLng.toFixed(3)),
          altitudeKm: Number((785.8 + Math.sin(Date.now() / 4000) * 0.8).toFixed(1)),
          velocityKmS: Number((7.46 + Math.cos(Date.now() / 6000) * 0.02).toFixed(2)),
          sunElevationDeg: Number((45 + Math.sin(nextLat * (Math.PI / 180)) * 15).toFixed(1))
        };

        if (isOrbitLocked && onOrbitPositionUpdate) {
          onOrbitPositionUpdate([nextState.latitude, nextState.longitude]);
        }

        return nextState;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isOrbitLocked, onOrbitPositionUpdate]);

  return (
    <div 
      className="absolute top-14 left-3 rounded-xl bg-black/90 backdrop-blur-md border border-[#1B3022] shadow-2xl z-20 pointer-events-auto transition-all max-w-[250px] sm:max-w-[270px] select-none"
      role="region"
      aria-label="Satellite Orbit Tracking HUD"
    >
      {/* Header bar */}
      <div className="px-2.5 py-1.5 border-b border-[#1B3022] flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Satellite className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#F5F5F0]">
            Orbit HUD: {sensorState.satelliteName}
          </span>
        </div>

        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsMinimized(!isMinimized);
          }}
          className="text-[9px] font-mono px-1.5 py-0.5 rounded text-[#F5F5F0]/60 hover:text-white hover:bg-white/5 cursor-pointer"
          title={isMinimized ? 'Expand Orbit HUD' : 'Collapse Orbit HUD'}
        >
          {isMinimized ? 'EXPAND' : 'MIN'}
        </button>
      </div>

      {!isMinimized && (
        <div className="p-2.5 space-y-2 text-[9.5px] font-mono">
          {/* Real-time Sub-Satellite Point (SSP) Coordinates */}
          <div className="p-1.5 rounded-lg bg-[#0E1711] border border-[#1E3324] space-y-1">
            <div className="flex items-center justify-between text-[8.5px] text-[#F5F5F0]/60">
              <span className="uppercase tracking-wider flex items-center gap-1">
                <Crosshair className="w-2.5 h-2.5 text-[#C5A059]" /> Sub-Satellite Point
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            </div>

            <div className="flex items-center justify-between text-white font-bold text-[10px]">
              <span>
                LAT: <span className="text-emerald-300">{sensorState.latitude.toFixed(2)}°</span>
              </span>
              <span>
                LNG: <span className="text-emerald-300">{sensorState.longitude.toFixed(2)}°</span>
              </span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[8.5px]">
            <div className="p-1.5 rounded bg-black/60 border border-white/5">
              <div className="text-[#F5F5F0]/50">ALTITUDE</div>
              <div className="text-white font-bold">{sensorState.altitudeKm} km</div>
            </div>
            <div className="p-1.5 rounded bg-black/60 border border-white/5">
              <div className="text-[#F5F5F0]/50">VELOCITY</div>
              <div className="text-white font-bold">{sensorState.velocityKmS} km/s</div>
            </div>
            <div className="p-1.5 rounded bg-black/60 border border-white/5">
              <div className="text-[#F5F5F0]/50">SWATH SCAN</div>
              <div className="text-[#C5A059] font-bold">{sensorState.swathKm} km</div>
            </div>
            <div className="p-1.5 rounded bg-black/60 border border-white/5">
              <div className="text-[#F5F5F0]/50">INCLINATION</div>
              <div className="text-[#C5A059] font-bold">{sensorState.inclinationDeg}° SSO</div>
            </div>
          </div>

          {/* Lock Map View to Flyover Button */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onToggleOrbitLock();
            }}
            className={`w-full py-1.5 px-2 rounded-lg text-[9.5px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              isOrbitLocked
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                : 'bg-[#152319] hover:bg-[#1E3324] text-[#C5A059] hover:text-white border-[#2A4630]'
            }`}
            title={isOrbitLocked ? 'Release map view from orbital flight path' : 'Lock map viewport to active orbital sensor flyover path'}
          >
            {isOrbitLocked ? (
              <>
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Flyover Locked [Tracking]</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-[#C5A059]" />
                <span>Lock View to Flyover Path</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
