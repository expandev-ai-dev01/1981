import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { useMoonControls } from '../useMoonControls';
import { useMoonRotation } from '../useMoonRotation';
import { useMoonZoom } from '../useMoonZoom';
import { useMoonTouch } from '../useMoonTouch';
import { useMoonKeyboard } from '../useMoonKeyboard';

export const useMoonRenderer = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { rotationX, rotationY, zoom, targetZoom, setZoom } = useMoonControls();

  useMoonRotation(canvasRef);
  useMoonZoom(canvasRef);
  useMoonTouch(canvasRef);
  useMoonKeyboard();

  const initializeRenderer = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
        resolve,
        undefined,
        reject
      );
    });

    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.8,
      metalness: 0.1,
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.x = rotationX;
    moon.rotation.y = rotationY;
    scene.add(moon);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    moonRef.current = moon;

    const handleResize = () => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas || !camera || !renderer) return;
      camera.aspect = currentCanvas.clientWidth / currentCanvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentCanvas.clientWidth, currentCanvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!scene || !camera || !renderer || !moon) return;

      moon.rotation.x = rotationX;
      moon.rotation.y = rotationY;

      const currentZoom = zoom;
      const zoomDiff = targetZoom - currentZoom;
      if (Math.abs(zoomDiff) > 0.001) {
        setZoom(currentZoom + zoomDiff * 0.15);
      }

      camera.position.z = 5 / zoom;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, rotationX, rotationY, zoom, targetZoom, setZoom]);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    if (moonRef.current) {
      moonRef.current.geometry.dispose();
      if (moonRef.current.material instanceof THREE.Material) {
        moonRef.current.material.dispose();
      }
    }

    sceneRef.current = null;
    cameraRef.current = null;
    rendererRef.current = null;
    moonRef.current = null;
  }, []);

  return { initializeRenderer, cleanup };
};
