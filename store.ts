
import { create } from 'zustand';
import { AppPhase, Gesture, AppState } from './types';

interface ExtendedAppState extends AppState {
  customPhotos: string[];
  setCustomPhotos: (photos: string[]) => void;
}

export const useStore = create<ExtendedAppState>((set) => ({
  phase: AppPhase.TREE,
  gesture: Gesture.NONE,
  cameraTarget: [0, 2, 0],
  customPhotos: [],
  setPhase: (phase) => set({ phase }),
  setGesture: (gesture) => set({ gesture }),
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),
  setCustomPhotos: (customPhotos) => set({ customPhotos }),
}));
