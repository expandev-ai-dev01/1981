import { useEffect, useRef } from 'react';
import { useMoonControls } from '../useMoonControls';

const KEYBOARD_ROTATION_INCREMENT = 2.0 * (Math.PI / 180);
const KEYBOARD_ZOOM_INCREMENT = 0.05;
const ROTATION_X_MIN = -90 * (Math.PI / 180);
const ROTATION_X_MAX = 90 * (Math.PI / 180);
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const CONTROL_BLOCK_TIME = 300;

export const useMoonKeyboard = () => {
  const {
    rotationX,
    rotationY,
    targetZoom,
    activeControl,
    lastInteractionTime,
    setRotation,
    setTargetZoom,
    setActiveControl,
    setLastInteractionTime,
  } = useMoonControls();

  const activeKeysRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const mouseLastTime = lastInteractionTime.mouse || 0;
      const touchLastTime = lastInteractionTime.touch || 0;

      if (
        (activeControl === 'mouse' || now - mouseLastTime < CONTROL_BLOCK_TIME) &&
        activeControl !== 'keyboard'
      ) {
        return;
      }

      if (
        (activeControl === 'touch' || now - touchLastTime < CONTROL_BLOCK_TIME) &&
        activeControl !== 'keyboard'
      ) {
        return;
      }

      const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '='];
      if (validKeys.includes(e.key)) {
        e.preventDefault();
        activeKeysRef.current.add(e.key);
        if (activeControl === 'none') {
          setActiveControl('keyboard');
          setLastInteractionTime('keyboard', now);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeysRef.current.delete(e.key);
      if (activeKeysRef.current.size === 0 && activeControl === 'keyboard') {
        setActiveControl('none');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeControl, lastInteractionTime, setActiveControl, setLastInteractionTime]);

  useEffect(() => {
    if (activeKeysRef.current.size === 0 || activeControl !== 'keyboard') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const applyKeyboardControls = () => {
      let newRotationX = rotationX;
      let newRotationY = rotationY;
      let newZoom = targetZoom;

      if (activeKeysRef.current.has('ArrowUp')) {
        newRotationX = Math.max(ROTATION_X_MIN, rotationX - KEYBOARD_ROTATION_INCREMENT);
      }
      if (activeKeysRef.current.has('ArrowDown')) {
        newRotationX = Math.min(ROTATION_X_MAX, rotationX + KEYBOARD_ROTATION_INCREMENT);
      }
      if (activeKeysRef.current.has('ArrowLeft')) {
        newRotationY = rotationY - KEYBOARD_ROTATION_INCREMENT;
      }
      if (activeKeysRef.current.has('ArrowRight')) {
        newRotationY = rotationY + KEYBOARD_ROTATION_INCREMENT;
      }
      if (activeKeysRef.current.has('+') || activeKeysRef.current.has('=')) {
        newZoom = Math.min(ZOOM_MAX, targetZoom + KEYBOARD_ZOOM_INCREMENT);
      }
      if (activeKeysRef.current.has('-')) {
        newZoom = Math.max(ZOOM_MIN, targetZoom - KEYBOARD_ZOOM_INCREMENT);
      }

      if (newRotationX !== rotationX || newRotationY !== rotationY) {
        setRotation(newRotationX, newRotationY);
      }

      if (newZoom !== targetZoom) {
        setTargetZoom(newZoom);
      }

      animationFrameRef.current = requestAnimationFrame(applyKeyboardControls);
    };

    animationFrameRef.current = requestAnimationFrame(applyKeyboardControls);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rotationX, rotationY, targetZoom, activeControl, setRotation, setTargetZoom]);
};
