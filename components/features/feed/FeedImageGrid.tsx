import { feedImagePublicUrl } from "./image-url";

type Props = { images: string[] };

/**
 * Grid intelligent style Facebook / Instagram :
 * - 1 image : full width, hauteur fixée généreuse
 * - 2 images : split 50/50
 * - 3 images : 1 grande à gauche + 2 petites empilées à droite
 * - 4+ images : grille 2x2 avec overlay "+N" si plus de 4
 */
export function FeedImageGrid({ images }: Props) {
  const imgs = images.slice(0, 4);
  const extra = images.length - 4;

  if (imgs.length === 1) {
    return (
      <div className="relative w-full bg-ink-50 max-h-[560px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={feedImagePublicUrl(imgs[0])}
          alt=""
          className="w-full max-h-[560px] object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (imgs.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-ink-100">
        {imgs.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={feedImagePublicUrl(p)}
            alt=""
            className="w-full h-[320px] object-cover"
            loading="lazy"
          />
        ))}
      </div>
    );
  }

  if (imgs.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-ink-100 h-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={feedImagePublicUrl(imgs[0])}
          alt=""
          className="w-full h-full object-cover row-span-2"
          loading="lazy"
        />
        {imgs.slice(1).map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={feedImagePublicUrl(p)}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ))}
      </div>
    );
  }

  // 4+ images
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-ink-100">
      {imgs.map((p, i) => {
        const isLast = i === 3;
        return (
          <div key={i} className="relative h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feedImagePublicUrl(p)}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {isLast && extra > 0 && (
              <div className="absolute inset-0 bg-ink-900/55 flex items-center justify-center text-white font-bold text-2xl">
                +{extra}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
