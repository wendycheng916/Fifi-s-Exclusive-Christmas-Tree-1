
import React, { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useStore } from '../store';
import { Gesture } from '../types';
import { Camera, CameraOff } from 'lucide-react';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const setGesture = useStore((state) => state.setGesture);
  const gesture = useStore((state) => state.gesture);
  const landmarkerRef = useRef<HandLandmarker | null>(null);

  useEffect(() => {
    const initLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      setModelLoaded(true);
    };
    initLandmarker();
  }, []);

  useEffect(() => {
    let animationId: number;
    const detect = () => {
      if (landmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
        
        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Simple gesture detection logic
          // Check if palm is open: distances from wrist to fingertips are high
          const wrist = landmarks[0];
          const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
          
          let isOpenPalm = true;
          tips.forEach(tip => {
            const dist = Math.sqrt(
              Math.pow(tip.x - wrist.x, 2) + 
              Math.pow(tip.y - wrist.y, 2)
            );
            if (dist < 0.25) isOpenPalm = false;
          });

          // Closed fist logic: tips are close to knuckles
          const knuckles = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];
          let isClosedFist = true;
          tips.forEach((tip, i) => {
            const dist = Math.sqrt(
              Math.pow(tip.x - knuckles[i].x, 2) + 
              Math.pow(tip.y - knuckles[i].y, 2)
            );
            if (dist > 0.08) isClosedFist = false;
          });

          if (isOpenPalm) setGesture(Gesture.OPEN_PALM);
          else if (isClosedFist) setGesture(Gesture.CLOSED_FIST);
          else setGesture(Gesture.NONE);
        } else {
          setGesture(Gesture.NONE);
        }
      }
      animationId = requestAnimationFrame(detect);
    };

    if (isOpen) detect();
    return () => cancelAnimationFrame(animationId);
  }, [isOpen, setGesture]);

  const toggleCamera = async () => {
    if (isOpen) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsOpen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className={`w-48 h-36 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover scale-x-[-1]"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur text-[10px] rounded uppercase tracking-widest">
          {gesture === Gesture.NONE ? 'Tracking...' : gesture.replace('_', ' ')}
        </div>
      </div>
      
      <button 
        onClick={toggleCamera}
        disabled={!modelLoaded}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full transition-all text-xs font-semibold tracking-wide uppercase group shadow-lg"
      >
        {isOpen ? <CameraOff size={16} /> : <Camera size={16} />}
        <span>{isOpen ? 'Close Tracker' : 'Enable Gesture Control'}</span>
      </button>
      
      {!modelLoaded && <div className="text-[10px] text-white/50 animate-pulse uppercase">Loading AI Model...</div>}
    </div>
  );
};

export default HandTracker;
