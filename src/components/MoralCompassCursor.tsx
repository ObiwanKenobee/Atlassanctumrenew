import React from 'react';
import { ParticleTrailCursor } from './ParticleTrailCursor';

interface MoralCompassCursorProps {
  moralIntensity?: number; // 0 to 100
  activeView?: string;
  isDataHeavy?: boolean;
}

export const MoralCompassCursor: React.FC<MoralCompassCursorProps> = ({
  moralIntensity = 94.8,
  activeView = 'home'
}) => {
  return (
    <ParticleTrailCursor 
      moralIntensity={moralIntensity} 
      activeView={activeView} 
    />
  );
};

