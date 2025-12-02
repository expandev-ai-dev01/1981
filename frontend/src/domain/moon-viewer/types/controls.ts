export interface MoonControlsState {
  rotationX: number;
  rotationY: number;
  zoom: number;
  targetZoom: number;
  isRotating: boolean;
  isInertiaActive: boolean;
  velocityX: number;
  velocityY: number;
  activeControl: 'none' | 'mouse' | 'touch' | 'keyboard';
  lastInteractionTime: Record<string, number>;
  isLoading: boolean;

  setRotation: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  setTargetZoom: (targetZoom: number) => void;
  setIsRotating: (isRotating: boolean) => void;
  setIsInertiaActive: (isInertiaActive: boolean) => void;
  setVelocity: (velocityX: number, velocityY: number) => void;
  setActiveControl: (control: 'none' | 'mouse' | 'touch' | 'keyboard') => void;
  setLastInteractionTime: (control: string, time: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetToInitial: () => void;
}
