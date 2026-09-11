import { cn } from '@/lib/utils';

type YoutubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
};

export function YoutubeEmbed({ videoId, title, className }: YoutubeEmbedProps) {
  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-[14px] bg-studio-deep',
        className,
      )}
    >
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
