import Image from 'next/image';
import { cn } from '@/lib/utils';

type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function CoverImage({
  src,
  alt,
  className,
  imageClassName,
  priority,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: CoverImageProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[14px] bg-studio-deep',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          'object-cover transition-transform duration-700 ease-out',
          imageClassName,
        )}
      />
    </div>
  );
}
