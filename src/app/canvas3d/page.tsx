import type { Metadata } from 'next';
import { PageIntro } from '@/components/layout/page-intro';

export const metadata: Metadata = {
  title: 'Canvas 3D',
  robots: { index: false, follow: false },
};

export default function Canvas3dPage() {
  return (
    <main className="bg-studio-bg text-studio-text">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <PageIntro
          eyebrow="Lab"
          title="Canvas 3D"
          description="Drop a Unity WebGL build in public/webplayer/canvas3d to attach a live preview here."
        />
      </div>
    </main>
  );
}
