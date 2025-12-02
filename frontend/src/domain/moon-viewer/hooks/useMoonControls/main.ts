import { create } from 'zustand';
import type { MoonControlsState } from '../../types';

const INITIAL_ROTATION_X = 17 * (Math.PI / 180);
const INITIAL_ROTATION_Y = 0;
const INITIAL_ZOOM = 1.0;

export const useMoonControls = create<MoonControlsState>((set) => ({
  rotationX: INITIAL_ROTATION_X,
  rotationY: INITIAL_ROTATION_Y,
  zoom: INITIAL_ZOOM,
  targetZoom: INITIAL_ZOOM,
  isRotating: false,
  isInertiaActive: false,
  velocityX: 0,
  velocityY: 0,
  activeControl: 'none',
  lastInteractionTime: {},
  isLoading: true,

  setRotation: (x: number, y: number) => set({ rotationX: x, rotationY: y }),
  setZoom: (zoom: number) => set({ zoom }),
  setTargetZoom: (targetZoom: number) => set({ targetZoom }),
  setIsRotating: (isRotating: boolean) => set({ isRotating }),
  setIsInertiaActive: (isInertiaActive: boolean) => set({ isInertiaActive }),
  setVelocity: (velocityX: number, velocityY: number) => set({ velocityX, velocityY }),
  setActiveControl: (activeControl) => set({ activeControl }),
  setLastInteractionTime: (control, time) =>
    set((state) => ({
      lastInteractionTime: { ...state.lastInteractionTime, [control]: time },
    })),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  resetToInitial: () =>
    set({
      rotationX: INITIAL_ROTATION_X,
      rotationY: INITIAL_ROTATION_Y,
      zoom: INITIAL_ZOOM,
      targetZoom: INITIAL_ZOOM,
      isRotating: false,
      isInertiaActive: false,
      velocityX: 0,
      velocityY: 0,
      activeControl: 'none',
    }),
}));
