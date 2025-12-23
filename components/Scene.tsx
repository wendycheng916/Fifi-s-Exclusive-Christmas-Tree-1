
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Stars, 
  Sparkles,
  ContactShadows
} from '@react-three/drei';
import { 
  Bloom, 
  EffectComposer, 
  Vignette 
} from '@react-three/postprocessing';
import ChristmasTree from './ChristmasTree';
import Photos from './Photos';
import { useStore } from '../store';
import { AppPhase } from '../types';

const Scene: React.FC = () => {
  const phase = useStore(state => state.phase);
  const cameraTarget = useStore(state => state.cameraTarget);

  return (
    <Canvas shadows gl={{ antialias: false }}>
      <color attach="background" args={['#03101d']} />
      
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        maxDistance={40} 
        minDistance={5} 
        target={cameraTarget}
        autoRotate={phase === AppPhase.TREE}
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d2ff" castShadow />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#4fc3f7" />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#87CEEB" 
      />

      <Environment preset="night" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={15} size={2} speed={0.4} opacity={0.3} color="#00d2ff" />

      <ChristmasTree />
      <Photos />

      <ContactShadows opacity={0.4} scale={20} blur={2} far={4.5} />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.4} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
