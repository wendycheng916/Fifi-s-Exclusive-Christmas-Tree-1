
export enum AppPhase {
  TREE = 'tree',
  BLOOMING = 'blooming',
  NEBULA = 'nebula',
  COLLAPSING = 'collapsing'
}

export enum Gesture {
  NONE = 'none',
  OPEN_PALM = 'open_palm',
  CLOSED_FIST = 'closed_fist'
}

export interface PhotoData {
  id: number;
  url: string;
  isLandscape: boolean;
}

export interface AppState {
  phase: AppPhase;
  gesture: Gesture;
  cameraTarget: [number, number, number];
  setPhase: (phase: AppPhase) => void;
  setGesture: (gesture: Gesture) => void;
  setCameraTarget: (target: [number, number, number]) => void;
}
