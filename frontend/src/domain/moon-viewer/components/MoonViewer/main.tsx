import { MoonCanvas } from '../MoonCanvas';
import { ResetButton } from '../ResetButton';
import { useMoonControls } from '../../hooks/useMoonControls';

function MoonViewer() {
  const { resetToInitial, isLoading } = useMoonControls();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border bg-gradient-to-b from-slate-950 to-slate-900 shadow-2xl">
      <MoonCanvas />
      <ResetButton onClick={resetToInitial} disabled={isLoading} />
    </div>
  );
}

export { MoonViewer };
