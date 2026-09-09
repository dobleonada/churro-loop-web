import Image from "next/image";
import { StoreMap } from "@/components/sections/store-map";
import { Carousel } from "@/components/ui/carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import type { MapLocation } from "@/lib/locations";
import { getImages } from "@/lib/media";
import { toPlainParagraphs } from "@/lib/rich-text";
import type { LoopsDto } from "@/services/home/home.dto";

/**
 * "Nuestros loops": eyebrow, heading, status line and a carousel of the
 * interior photography.
 *
 * Two quirks of the CMS shape are handled here:
 * - `loops.intro` packs two different design elements into one markdown
 *   field — `**NUESTROS LOOPS**` and `MUY PRONTO`, split by a blank line —
 *   so it is taken apart rather than rendered as prose. `loops.title` is the
 *   eyebrow, as in `openings`.
 * - `loops.loops` is a repeatable component whose only field is itself a
 *   multiple-media one, so the slides are the flattened images.
 *
 * The store map goes under this carousel. It is behind `NEXT_PUBLIC_SHOW_MAP`
 * because there are no open stores yet, and MapLibre is only imported from
 * inside `StoreMap`'s lazy chunk: keeping it out of the initial bundle is a
 * launch requirement.
 */
export function OurLoops({
  loops,
  locations,
}: {
  loops: LoopsDto;
  /** Cities to pin, already matched to coordinates by the page. */
  locations: MapLocation[];
}) {
  const [heading, status] = toPlainParagraphs(loops.intro);
  const images = loops.loops.flatMap((loop) => getImages(loop.image));

  return (
    <section
      id="donde-estamos"
      className="pt-10 pb-10 lg:pt-16 lg:pb-12"
      aria-labelledby="donde-estamos-title"
    >
      <SectionHeading
        eyebrow={loops.title}
        title={heading}
        titleId="donde-estamos-title"
        className="px-6"
      />

      {status && (
        <p className="mt-5 text-center font-display text-[1.375rem] text-ink uppercase lg:mt-9">
          {status}
        </p>
      )}

      {images.length > 0 && (
        <Carousel
          ariaLabel={heading}
          items={images.map((image) => (
            <div
              key={image.src}
              // Square corners here, unlike the openings cards: checked
              // against the mockup pixel by pixel.
              className="relative aspect-[16/9] overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
          className="mx-auto mt-6 max-w-site px-12 [--arrow-inset:28px] [--slide-gap:12px] [--slides:1] md:px-16 md:[--slide-gap:16px] md:[--slides:2] lg:px-18 lg:[--arrow-inset:32px] lg:[--slides:3]"
        />
      )}

      <StoreMap locations={locations} />
    </section>
  );
}
