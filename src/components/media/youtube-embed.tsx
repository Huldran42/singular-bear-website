type YoutubeEmbedProps = {
  videoId: string;
  title: string;
};

export function YoutubeEmbed({ videoId, title }: YoutubeEmbedProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[14px] bg-studio-deep">
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
