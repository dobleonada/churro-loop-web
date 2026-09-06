import Image from "next/image";
import { Carousel } from "@/components/ui/carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { getImage } from "@/lib/media";
import type { OpeningItemDto, OpeningsDto } from "@/services/home/home.dto";

/**
 * City card: 2:3 photo (the aspect the CMS originals ship in) with the city
 * and the opening date over it in white.
 *
 * The two labels swap layout between breakpoints, which is why one flex row
 * does both: stacked and centred on mobile (city top, date bottom), side by
 * side along the top edge from `md` (city left, date right).
 *
 * The photo takes an empty `alt`: the city it shows is already announced by
 * the label right next to it, so describing it again would just be noise.
 */
function OpeningCard({ opening }: { opening: OpeningItemDto }) {
  const image = getImage(opening.image);

  return (
    <article className="relative aspect-[2/3] overflow-hidden rounded-card">
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-between p-3.5 text-label font-medium text-white uppercase md:flex-row md:items-start md:p-4">
        <span>{opening.location}</span>
        <span>{opening.title}</span>
      </div>
    </article>
  );
}

/**
 * Full-bleed yellow band with the upcoming locations carousel.
 *
 * Note the CMS field naming is inverted here compared with `manifesto`:
 * `openings.title` holds the eyebrow ("CHURRO LOOP IS COMING TO TOWN") and
 * `openings.intro` the heading ("PRÓXIMAS APERTURAS").
 */
export function UpcomingOpenings({ openings }: { openings: OpeningsDto }) {
  return (
    <section
      id="proximas-aperturas"
      className="bg-yellow py-9 lg:py-14"
      aria-labelledby="proximas-aperturas-title"
    >
      <SectionHeading
        eyebrow={openings.title}
        title={openings.intro}
        titleId="proximas-aperturas-title"
        className="px-6"
      />

      <Carousel
        ariaLabel={openings.intro}
        items={openings.openings.map((opening) => (
          <OpeningCard key={opening.id} opening={opening} />
        ))}
        className="mx-auto mt-8 max-w-site px-5 [--slide-gap:9px] [--slides:2] md:px-10 md:[--slide-gap:16px] md:[--slides:3] lg:mt-13 lg:px-16 lg:[--slide-gap:28px]"
      />
    </section>
  );
}
