import { MoonViewer } from '@/domain/moon-viewer/components';

function HomePage() {
  return (
    <div className="flex h-[calc(100vh-12rem)] w-full items-center justify-center">
      <MoonViewer />
    </div>
  );
}

export { HomePage };
