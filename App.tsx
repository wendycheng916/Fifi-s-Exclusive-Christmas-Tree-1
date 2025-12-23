
import React, { Suspense } from 'react';
import Scene from './components/Scene';
import HandTracker from './components/HandTracker';
import UI from './components/UI';
import { Loader } from '@react-three/drei';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-black">
      <Suspense fallback={null}>
        <Scene />
        <UI />
        <HandTracker />
      </Suspense>
      <Loader 
        containerStyles={{ background: '#03101d' }} 
        innerStyles={{ background: '#0a192f' }} 
        barStyles={{ background: '#0ea5e9' }}
        dataInterpolation={(p) => `Chilling the winter air... ${p.toFixed(0)}%`}
      />
    </div>
  );
};

export default App;
