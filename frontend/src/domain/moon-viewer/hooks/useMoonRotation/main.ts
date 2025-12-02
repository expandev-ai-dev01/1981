import { useEffect, useRef } from 'react';
import { useMoonControls } from '../useMoonControls';

const ROTATION_SENSITIVITY = 1.0;
const DAMPING_FACTOR = 0.95;
const MIN_VELOCITY = 0.01;
const ROTATION_X_MIN = -90 * (Math.PI / 180);
const ROTATION_X_MAX = 90 * (Math.PI / 180);
const RESISTANCE_THRESHOLD = 15 * (Math.PI / 180);
const RESISTANCE_FACTOR = 0.5;

export const useMoonRotation = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const {
    rotationX,
    rotationY,
    isRotating,
    isInertiaActive,
    velocityX,
    velocityY,
    activeControl,
    setRotation,
    setIsRotating,
    setIsInertiaActive,
    setVelocity,
    setActiveControl,
    setLastInteractionTime,
  } = useMoonControls();

  const mouseStartRef = useRef({ x: 0, y: 0 });
  const mousePrevRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (activeControl !== 'none' && activeControl !== 'mouse') return;

      setActiveControl('mouse');
      setLastInteractionTime('mouse', Date.now());
      setIsRotating(true);
      setIsInertiaActive(false);
      mouseStartRef.current = { x: e.clientX, y: e.clientY };
      mousePrevRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = Date.now();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isRotating || activeControl !== 'mouse') return;

      const currentTime = Date.now();
      const deltaTime = Math.max(currentTime - lastTimeRef.current, 1);

      const deltaX = e.clientX - mousePrevRef.current.x;
      const deltaY = e.clientY - mousePrevRef.current.y;

      const newVelocityX = (deltaX / deltaTime) * ROTATION_SENSITIVITY;
      const newVelocityY = (deltaY / deltaTime) * ROTATION_SENSITIVITY;

      setVelocity(newVelocityX, newVelocityY);

      let newRotationX = rotationX + deltaY * 0.005 * ROTATION_SENSITIVITY;
      const newRotationY = rotationY + deltaX * 0.005 * ROTATION_SENSITIVITY;

      if (newRotationX < ROTATION_X_MIN + RESISTANCE_THRESHOLD) {
        const resistance =
          1 - (ROTATION_X_MIN + RESISTANCE_THRESHOLD - newRotationX) / RESISTANCE_THRESHOLD;
        newRotationX =
          rotationX + deltaY * 0.005 * ROTATION_SENSITIVITY * resistance * RESISTANCE_FACTOR;
      } else if (newRotationX > ROTATION_X_MAX - RESISTANCE_THRESHOLD) {
        const resistance =
          1 - (newRotationX - (ROTATION_X_MAX - RESISTANCE_THRESHOLD)) / RESISTANCE_THRESHOLD;
        newRotationX =
          rotationX + deltaY * 0.005 * ROTATION_SENSITIVITY * resistance * RESISTANCE_FACTOR;
      }

      newRotationX = Math.max(ROTATION_X_MIN, Math.min(ROTATION_X_MAX, newRotationX));

      setRotation(newRotationX, newRotationY);

      mousePrevRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = currentTime;
    };

    const handleMouseUp = () => {
      if (!isRotating || activeControl !== 'mouse') return;

      setIsRotating(false);
      const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      if (magnitude > MIN_VELOCITY) {
        setIsInertiaActive(true);
      } else {
        setActiveControl('none');
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    canvasRef,
    isRotating,
    rotationX,
    rotationY,
    velocityX,
    velocityY,
    activeControl,
    setRotation,
    setIsRotating,
    setIsInertiaActive,
    setVelocity,
    setActiveControl,
    setLastInteractionTime,
  ]);

  useEffect(() => {
    if (!isInertiaActive) return;

    let animationFrameId: number;

    const applyInertia = () => {
      if (activeControl !== 'none' && activeControl !== 'mouse') {
        setIsInertiaActive(false);
        return;
      }

      let newRotationX = rotationX + velocityY * 0.1;
      const newRotationY = rotationY + velocityX * 0.1;

      if (newRotationX < ROTATION_X_MIN + RESISTANCE_THRESHOLD) {
        const resistance =
          1 - (ROTATION_X_MIN + RESISTANCE_THRESHOLD - newRotationX) / RESISTANCE_THRESHOLD;
        newRotationX = rotationX + velocityY * 0.1 * resistance * RESISTANCE_FACTOR;
      } else if (newRotationX > ROTATION_X_MAX - RESISTANCE_THRESHOLD) {
        const resistance =
          1 - (newRotationX - (ROTATION_X_MAX - RESISTANCE_THRESHOLD)) / RESISTANCE_THRESHOLD;
        newRotationX = rotationX + velocityY * 0.1 * resistance * RESISTANCE_FACTOR;
      }

      newRotationX = Math.max(ROTATION_X_MIN, Math.min(ROTATION_X_MAX, newRotationX));

      setRotation(newRotationX, newRotationY);

      const newVelocityX = velocityX * DAMPING_FACTOR;
      const newVelocityY = velocityY * DAMPING_FACTOR;
      setVelocity(newVelocityX, newVelocityY);

      const magnitude = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY);

      if (magnitude < MIN_VELOCITY) {
        setIsInertiaActive(false);
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
    isInertiaActive,
    rotationX,
    rotationY,
    velocityX,
    velocityY,
    activeControl,
    setRotation,
    setIsInertiaActive,
    setVelocity,
    setActiveControl,
  ]);
};
