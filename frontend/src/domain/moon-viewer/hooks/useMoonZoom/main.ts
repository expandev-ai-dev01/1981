import { useEffect } from 'react';
import { useMoonControls } from '../useMoonControls';

const ZOOM_INCREMENT = 0.1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;

export const useMoonZoom = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const { targetZoom, setTargetZoom } = useMoonControls();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY > 0 ? -ZOOM_INCREMENT : ZOOM_INCREMENT;
      const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, targetZoom + delta));

      setTargetZoom(newZoom);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, targetZoom, setTargetZoom]);
};
