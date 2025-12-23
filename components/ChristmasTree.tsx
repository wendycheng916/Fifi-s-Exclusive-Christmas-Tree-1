
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Color } from 'three';
import { useStore } from '../store';
import { AppPhase, Gesture } from '../types';
import { generateConePoints, generateSpiralPoints } from '../utils/geometry';
import gsap from 'gsap';
import { Float } from '@react-three/drei';

const PARTICLE_COUNT = 5500;
const ORNAMENT_COUNT = 120;
const TREE_HEIGHT = 9;
const TREE_RADIUS = 4;

const ChristmasTree: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const ornamentRef = useRef<InstancedMesh>(null);
  
  const dummy = useMemo(() => new Object3D(), []);
  const phase = useStore(state => state.phase);
  const gesture = useStore(state => state.gesture);
  const setPhase = useStore(state => state.setPhase);

  // Positions
  const treePoints = useMemo(() => generateConePoints(PARTICLE_COUNT, TREE_HEIGHT, TREE_RADIUS), []);
  const spiralPoints = useMemo(() => generateSpiralPoints(ORNAMENT_COUNT, TREE_HEIGHT, TREE_RADIUS * 0.9, 8), []);
  
  // Instance position state for animation
  const particlePos = useMemo(() => treePoints.map(p => ({ x: p.x, y: p.y, z: p.z })), [treePoints]);
  const ornamentPos = useMemo(() => spiralPoints.map(p => ({ x: p.x, y: p.y, z: p.z })), [spiralPoints]);

  // Color variations for blue theme
  const ornamentColors = useMemo(() => {
    const colors = ["#E0F7FA", "#81D4FA", "#29B6F6", "#0288D1", "#B3E5FC"];
    return Array.from({ length: ORNAMENT_COUNT }).map(() => new Color(colors[Math.floor(Math.random() * colors.length)]));
  }, []);

  useEffect(() => {
    if (phase === AppPhase.BLOOMING) {
      const explode = (arr: any[], range: number) => {
        arr.forEach((p) => {
          gsap.to(p, {
            x: (Math.random() - 0.5) * range,
            y: (Math.random() - 0.5) * range,
            z: (Math.random() - 0.5) * range,
            duration: 2.5 + Math.random(),
            ease: "expo.out",
          });
        });
      };
      explode(particlePos, 60);
      explode(ornamentPos, 70);
      
      gsap.delayedCall(2.8, () => setPhase(AppPhase.NEBULA));
    } else if (phase === AppPhase.COLLAPSING) {
      const contract = (arr: any[], targets: any[], duration: number) => {
        arr.forEach((p, i) => {
          gsap.to(p, {
            x: targets[i].x,
            y: targets[i].y,
            z: targets[i].z,
            duration: duration,
            ease: "back.inOut(1.2)",
          });
        });
      };
      contract(particlePos, treePoints, 1.8);
      contract(ornamentPos, spiralPoints, 2.1);
      
      gsap.delayedCall(2.2, () => setPhase(AppPhase.TREE));
    }
  }, [phase, treePoints, spiralPoints, particlePos, ornamentPos, setPhase]);

  useEffect(() => {
    if (gesture === Gesture.OPEN_PALM && phase === AppPhase.TREE) setPhase(AppPhase.BLOOMING);
    if (gesture === Gesture.CLOSED_FIST && phase === AppPhase.NEBULA) setPhase(AppPhase.COLLAPSING);
  }, [gesture, phase, setPhase]);

  const mouseVec = useRef(new Vector3());

  useFrame((state) => {
    mouseVec.current.set(state.mouse.x * 6, (state.mouse.y + 0.5) * 12, 0);
    
    const updateInstances = (ref: React.RefObject<InstancedMesh>, posArr: any[], scale: number, colors?: Color[]) => {
      if (!ref.current) return;
      posArr.forEach((p, i) => {
        let { x, y, z } = p;
        if (phase === AppPhase.TREE) {
          const dist = mouseVec.current.distanceTo(new Vector3(x, y, z));
          if (dist < 2.5) {
            const force = (2.5 - dist) * 0.4;
            const dir = new Vector3(x, y, z).sub(mouseVec.current).normalize();
            x += dir.x * force; y += dir.y * force; z += dir.z * force;
          }
        }
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        ref.current?.setMatrixAt(i, dummy.matrix);
        if (colors) ref.current?.setColorAt(i, colors[i]);
      });
      if (ref.current.instanceMatrix) ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    };

    updateInstances(meshRef, particlePos, 0.035);
    updateInstances(ornamentRef, ornamentPos, 0.15, ornamentColors);
  });

  return (
    <>
      {/* Blue Frost Particles */}
      <instancedMesh ref={meshRef} args={[null as any, null as any, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#B3E5FC" emissive="#0288D1" emissiveIntensity={0.5} roughness={0.2} />
      </instancedMesh>

      {/* Glossy Ornaments */}
      <instancedMesh ref={ornamentRef} args={[null as any, null as any, ORNAMENT_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={1} roughness={0.05} />
      </instancedMesh>

      {/* Glowing Star */}
      {phase === AppPhase.TREE && (
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[0, TREE_HEIGHT + 0.6, 0]}>
            <octahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color="#E1F5FE" emissive="#00B0FF" emissiveIntensity={6} />
          </mesh>
        </Float>
      )}

      {/* Falling Snowflakes */}
      <instancedMesh args={[null as any, null as any, 200]} position={[0, 12, 0]}>
        <circleGeometry args={[0.08, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </instancedMesh>
    </>
  );
};

export default ChristmasTree;
