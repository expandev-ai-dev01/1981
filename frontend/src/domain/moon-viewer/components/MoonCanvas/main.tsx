import { useEffect, useRef } from 'react';
import { useMoonControls } from '../../hooks/useMoonControls';
import { useMoonRenderer } from '../../hooks/useMoonRenderer';
import { LoadingSpinner } from '@/core/components/loading-spinner';

function MoonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoading, setIsLoading } = useMoonControls();
  const { initializeRenderer, cleanup } = useMoonRenderer(canvasRef);

  useEffect(() => {
    if (!canvasRef.current) return;

    const init = async () => {
      try {
        await initializeRenderer();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize moon renderer:', error);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      cleanup();
    };
  }, [initializeRenderer, cleanup, setIsLoading]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner className="h-8 w-8 text-slate-400" />
            <p className="text-sm text-slate-400">Carregando visualização da Lua...</p>
          </div>
        </div>
      )}
    </>
  );
}

export { MoonCanvas };
