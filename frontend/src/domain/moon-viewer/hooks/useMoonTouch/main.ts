import { useEffect, useRef } from 'react';
import { useMoonControls } from '../useMoonControls';

const TOUCH_SENSITIVITY = 1.5;
const DAMPING_FACTOR = 0.95;
const MIN_VELOCITY = 0.01;
const ROTATION_X_MIN = -90 * (Math.PI / 180);
const ROTATION_X_MAX = 90 * (Math.PI / 180);
const RESISTANCE_THRESHOLD = 15 * (Math.PI / 180);
const RESISTANCE_FACTOR = 0.5;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;

export const useMoonTouch = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const {
    rotationX,
    rotationY,
    targetZoom,
    activeControl,
    setRotation,
    setTargetZoom,
    setIsInertiaActive,
    setVelocity,
    setActiveControl,
    setLastInteractionTime,
  } = useMoonControls();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchPrevRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef(Date.now());
  const touchModeRef = useRef<'rotation' | 'zoom' | 'none'>('none');
  const initialPinchDistanceRef = useRef<number | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const isInertiaActiveRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (activeControl !== 'none' && activeControl !== 'touch') return;

      setActiveControl('touch');
      setLastInteractionTime('touch', Date.now());
      setIsInertiaActive(false);
      isInertiaActiveRef.current = false;

      if (e.touches.length === 1) {
        touchModeRef.current = 'rotation';
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        touchPrevRef.current = { x: touch.clientX, y: touch.clientY };
        lastTimeRef.current = Date.now();
      } else if (e.touches.length === 2) {
        touchModeRef.current = 'zoom';
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialPinchDistanceRef.current = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (activeControl !== 'touch') return;

      e.preventDefault();

      if (touchModeRef.current === 'rotation' && e.touches.length === 1) {
        const touch = e.touches[0];
        const currentTime = Date.now();
        const deltaTime = Math.max(currentTime - lastTimeRef.current, 1);

        if (!touchPrevRef.current) return;

        const deltaX = touch.clientX - touchPrevRef.current.x;
        const deltaY = touch.clientY - touchPrevRef.current.y;

        const newVelocityX = (deltaX / deltaTime) * TOUCH_SENSITIVITY;
        const newVelocityY = (deltaY / deltaTime) * TOUCH_SENSITIVITY;

        velocityRef.current = { x: newVelocityX, y: newVelocityY };
        setVelocity(newVelocityX, newVelocityY);

        let newRotationX = rotationX + deltaY * 0.005 * TOUCH_SENSITIVITY;
        const newRotationY = rotationY + deltaX * 0.005 * TOUCH_SENSITIVITY;

        if (newRotationX < ROTATION_X_MIN + RESISTANCE_THRESHOLD) {
          const resistance =
            1 - (ROTATION_X_MIN + RESISTANCE_THRESHOLD - newRotationX) / RESISTANCE_THRESHOLD;
          newRotationX =
            rotationX + deltaY * 0.005 * TOUCH_SENSITIVITY * resistance * RESISTANCE_FACTOR;
        } else if (newRotationX > ROTATION_X_MAX - RESISTANCE_THRESHOLD) {
          const resistance =
            1 - (newRotationX - (ROTATION_X_MAX - RESISTANCE_THRESHOLD)) / RESISTANCE_THRESHOLD;
          newRotationX =
            rotationX + deltaY * 0.005 * TOUCH_SENSITIVITY * resistance * RESISTANCE_FACTOR;
        }

        newRotationX = Math.max(ROTATION_X_MIN, Math.min(ROTATION_X_MAX, newRotationX));

        setRotation(newRotationX, newRotationY);

        touchPrevRef.current = { x: touch.clientX, y: touch.clientY };
        lastTimeRef.current = currentTime;
      } else if (touchModeRef.current === 'zoom' && e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (initialPinchDistanceRef.current) {
          const scale = distance / initialPinchDistanceRef.current;
          const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, targetZoom * scale));
          setTargetZoom(newZoom);
          initialPinchDistanceRef.current = distance;
        }
      }
    };

    const handleTouchEnd = () => {
      if (activeControl !== 'touch') return;

      if (touchModeRef.current === 'rotation') {
        const magnitude = Math.sqrt(
          velocityRef.current.x * velocityRef.current.x +
            velocityRef.current.y * velocityRef.current.y
        );
        if (magnitude > MIN_VELOCITY) {
          setIsInertiaActive(true);
          isInertiaActiveRef.current = true;
        } else {
          setActiveControl('none');
        }
      } else {
        setActiveControl('none');
      }

      touchStartRef.current = null;
      touchPrevRef.current = null;
      touchModeRef.current = 'none';
      initialPinchDistanceRef.current = null;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [
    canvasRef,
    rotationX,
    rotationY,
    targetZoom,
    activeControl,
    setRotation,
    setTargetZoom,
    setIsInertiaActive,
    setVelocity,
    setActiveControl,
    setLastInteractionTime,
  ]);

  useEffect(() => {
    if (!isInertiaActiveRef.current) return;

    let animationFrameId: number;

    const applyInertia = () => {
      if (activeControl !== 'none' && activeControl !== 'touch') {
        setIsInertiaActive(false);
        isInertiaActiveRef.current = false;
        return;
      }

      let newRotationX = rotationX + velocityRef.current.y * 0.1;
      const newRotationY = rotationY + velocityRef.current.x * 0.1;

      if (newRotationX < ROTATION_X_MIN + RESISTANCE_THRESHOLD) {
        const resistance =
          1 - (ROTATION_X_MIN + RESISTANCE_THRESHOLD - newRotationX) / RESISTANCE_THRESHOLD;
        newRotationX = rotationX + velocityRef.current.y * 0.1 * resistance * RESISTANCE_FACTOR;
      } else if (newRotationX > ROTATION_X_MAX - RESISTANCE_THRESHOLD) {
        const resistance =
          1 - (newRotationX - (ROTATION_X_MAX - RESISTANCE_THRESHOLD)) / RESISTANCE_THRESHOLD;
        newRotationX = rotationX + velocityRef.current.y * 0.1 * resistance * RESISTANCE_FACTOR;
      }

      newRotationX = Math.max(ROTATION_X_MIN, Math.min(ROTATION_X_MAX, newRotationX));

      setRotation(newRotationX, newRotationY);

      velocityRef.current.x *= DAMPING_FACTOR;
      velocityRef.current.y *= DAMPING_FACTOR;
      setVelocity(velocityRef.current.x, velocityRef.current.y);

      const magnitude = Math.sqrt(
        velocityRef.current.x * velocityRef.current.x +
          velocityRef.current.y * velocityRef.current.y
      );

      if (magnitude < MIN_VELOCITY) {
        setIsInertiaActive(false);
        isInertiaActiveRef.current = false;
        setActiveControl('none');
      } else {
        animationFrameId = requestAnimationFrame(applyInertia);
      }
    };

    animationFrameId = requestAnimationFrame(applyInertia);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    rotationX,
    rotationY,
    activeControl,
    setRotation,
    setIsInertiaActive,
    setVelocity,
    setActiveControl,
  ]);
};
