
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Image as DreiImage } from '@react-three/drei';
import { useStore } from '../store';
import { AppPhase, Gesture } from '../types';
import * as THREE from 'three';

const PHOTOS_COUNT = 24;
const RADIUS = 15;

const PhotoItem: React.FC<{ index: number, total: number, customUrl?: string }> = ({ index, total, customUrl }) => {
  const defaultUrl = `https://picsum.photos/seed/${index + 100}/400/600`;
  const textureUrl = customUrl || defaultUrl;
  
  const [isLandscape, setIsLandscape] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const initialPos = useMemo(() => new THREE.Vector3(
    Math.cos(angle) * RADIUS,
    (Math.random() - 0.5) * 8,
    Math.sin(angle) * RADIUS
  ), [angle]);

  const setCameraTarget = useStore(state => state.setCameraTarget);
  const phase = useStore(state => state.phase);
  const groupRef = useRef<THREE.Group>(null);
  const centerVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  // Detect aspect ratio
  useEffect(() => {
    const img = new Image();
    img.src = textureUrl;
    img.onload = () => {
      if (img.width > img.height) setIsLandscape(true);
      else setIsLandscape(false);
    };
  }, [textureUrl]);

  useFrame(() => {
    if (groupRef.current && phase === AppPhase.NEBULA) {
      groupRef.current.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
      groupRef.current.lookAt(centerVec);
    }
  });

  if (phase !== AppPhase.NEBULA && phase !== AppPhase.COLLAPSING) return null;

  return (
    <group 
      ref={groupRef} 
      position={[initialPos.x, initialPos.y, initialPos.z]}
      onClick={() => setCameraTarget([initialPos.x * 0.8, initialPos.y, initialPos.z * 0.8] as [number, number, number])}
    >
      <group rotation={[0, 0, isLandscape ? Math.PI / 2 : 0]}>
        {/* Polaroid Frame */}
        <mesh scale={[3.5, 4.5, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#f0faff" />
        </mesh>
        
        {/* Image Content */}
        <DreiImage 
          url={textureUrl} 
          scale={[3, 3]} 
          position={[0, 0.4, 0.06]}
          transparent
        />
        
        {/* Label */}
        <Text
          position={[0, -1.6, 0.06]}
          fontSize={0.2}
          color="#003366"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
        >
          {customUrl ? `Memory #${index + 1}` : `Snowy Wish #${index + 1}`}
        </Text>
      </group>
    </group>
  );
};

const Photos: React.FC = () => {
  const phase = useStore(state => state.phase);
  const gesture = useStore(state => state.gesture);
  const customPhotos = useStore(state => state.customPhotos);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && phase === AppPhase.NEBULA) {
      if (gesture === Gesture.OPEN_PALM) {
        groupRef.current.rotation.y += 0.015;
      } else {
        groupRef.current.rotation.y += 0.0015;
      }
    }
  });

  if (phase !== AppPhase.NEBULA && phase !== AppPhase.COLLAPSING) return null;

  return (
    <group ref={groupRef}>
      {Array.from({ length: PHOTOS_COUNT }).map((_, i) => (
        <PhotoItem 
          key={i} 
          index={i} 
          total={PHOTOS_COUNT} 
          customUrl={customPhotos.length > 0 ? customPhotos[i % customPhotos.length] : undefined}
        />
      ))}
    </group>
  );
};

export default Photos;
