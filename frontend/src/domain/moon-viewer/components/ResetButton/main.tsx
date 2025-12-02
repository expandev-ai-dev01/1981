import { Button } from '@/core/components/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/core/lib/utils';

interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

function ResetButton({ onClick, disabled = false, className }: ResetButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      size="icon"
      className={cn(
        'absolute bottom-6 right-6 z-10 h-10 w-10 rounded-full border-slate-700 bg-slate-900/80 text-slate-300 shadow-lg backdrop-blur-sm transition-all hover:bg-slate-800/90 hover:text-slate-100 hover:shadow-xl disabled:opacity-50',
        className
      )}
      aria-label="Resetar visualização"
    >
      <RotateCcw className="h-5 w-5" />
    </Button>
  );
}

export { ResetButton };
