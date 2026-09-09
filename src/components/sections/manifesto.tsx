import { Markdown } from "@/components/ui/markdown";
import { SectionHeading } from "@/components/ui/section-heading";
import { BRAND_NAME } from "@/lib/config";
import type { ManifestoDto } from "@/services/home/home.dto";

/**
 * Manifesto: eyebrow, heading, two blocks of centred copy and the closing
 * signature — all of it, except the eyebrow, coming from `manifesto.text`.
 *
 * The eyebrow reads "CHURRO LOOP" in the display serif with wide tracking.
 * The CMS component has no eyebrow field: the only spare one is
 * `manifesto.logo`, which holds the horizontal lockup SVG. That SVG is not
 * what the approved design shows here — its width-to-cap-height ratio is 6:1
 * and the mockup measures roughly 12:1 — so this is typeset from the brand
 * constant instead. See the Beads issue about what `logo` is meant for.
 *
 * The copy width is deliberately tight (~308px mobile, ~672px desktop) so the
 * intentional line breaks in the source hold, and the long lines wrap where
 * the mockups wrap them.
 */
export function Manifesto({ manifesto }: { manifesto: ManifestoDto }) {
  return (
    <section id="manifiesto" className="px-6 pt-9 pb-11 lg:pt-18 lg:pb-22">
      <SectionHeading eyebrow={BRAND_NAME} title={manifesto.title} />

      <Markdown
        source={manifesto.text}
        className="mx-auto mt-7 max-w-[19.25rem] text-center text-copy text-ink md:max-w-[30rem] lg:mt-12 lg:max-w-[42rem] [&>p+p]:mt-[1.4em]"
      />
    </section>
  );
}
