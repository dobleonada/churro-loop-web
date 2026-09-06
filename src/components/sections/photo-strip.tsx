import Image from "next/image";
import { getImages } from "@/lib/media";
import type { GalleryDto } from "@/services/home/home.dto";

/**
 * The band of photographs that sits directly under the hero. It is not a
 * carousel: no controls, no autoplay, just a grid.
 *
 * Geometry measured on the approved mockups: 4:5 tiles (which is also the
 * aspect the CMS originals ship in, so nothing is cropped), 2 columns on
 * mobile and 4 from `md`. Gutter 10px @390 → 16px @1440, side padding
 * 10px → 28px; at 1440 that lands each tile on ~334px, which is what the
 * mockup measures.
 *
 * The section owns its top spacing only; whatever follows brings its own.
 */
export function PhotoStrip({ gallery }: { gallery: GalleryDto }) {
  const images = getImages(gallery.images);

  if (images.length === 0) return null;

  return (
    <div className="px-2.5 pt-6 md:px-5 lg:px-7 lg:pt-7">
      <ul className="mx-auto grid max-w-site grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3 lg:gap-4">
        {images.map((image) => (
          <li key={image.src} className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
