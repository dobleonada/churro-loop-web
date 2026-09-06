import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/ui/wordmark";
import { MenuSoonButton } from "@/components/sections/menu-soon-button";
import { siteConfig } from "@/lib/config";
import { getImage } from "@/lib/media";
import type { HeroDto } from "@/services/home/home.dto";

/** The CMS stores the menu link without a scheme (e.g. `www.google.es`). */
function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function MenuCta({ cta }: { cta: HeroDto["cta"] }) {
  const { mode, url } = siteConfig.menu;

  if (mode === "hidden") return null;

  if (mode === "link") {
    const href = url ?? cta.url;
    if (!href) return null;

    return (
      <Button as="a" href={normalizeUrl(href)}>
        {cta.label}
      </Button>
    );
  }

  return <MenuSoonButton label={cta.label} />;
}

/**
 * Decorative churro that bleeds off the hero. Purely presentational, so it is
 * hidden from assistive tech.
 *
 * The asset is not in the CMS; it lives at `public/images/hero-churro.png`
 * (1120×1815, transparent). Both placements are sized from `--hero-h` rather
 * than from the viewport width, because the churro is a vertical element whose
 * scale in the Figma tracks the hero height.
 *
 * Calibrated against the approved mockups by matching the shaft width:
 * - Desktop uses the asset's natural orientation (its principal axis is
 *   -63.9°, the mockup measures -63.2°), at ~0.50 scale on a 1440×940 frame.
 * - Mobile is the same asset **mirrored horizontally** — the chocolate tip
 *   points up-left there instead of up-right — at ~0.39 scale on 390×843.
 *
 * There is no tablet mockup yet, so the desktop placement takes over from `md`
 * (768px): from that width a right-anchored churro reads like the desktop
 * composition, whereas the mobile one would sit almost entirely off-screen.
 */
function HeroChurro() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute top-[1%] left-[49%] h-[calc(var(--hero-h)*0.82)] w-[calc(var(--hero-h)*0.506)] md:hidden">
        <Image
          src="/images/hero-churro.png"
          alt=""
          fill
          priority
          sizes="440px"
          className="-scale-x-100 object-contain"
        />
      </div>
      <div className="absolute top-[18%] right-0 hidden h-[calc(var(--hero-h)*0.98)] w-[calc(var(--hero-h)*0.605)] md:block">
        <Image
          src="/images/hero-churro.png"
          alt=""
          fill
          priority
          sizes="560px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function Hero({ hero }: { hero: HeroDto }) {
  const wordmark = getImage(hero.media, "Churro Loop");

  return (
    <section
      id="inicio"
      className="relative flex min-h-[var(--hero-h)] flex-col items-center justify-center overflow-hidden bg-churro-stripes px-6 pt-25 pb-4 text-center [--hero-h:min(100svh,900px)] [--stripe-width:2.25rem] md:pt-30 md:[--stripe-width:3.5rem] lg:pt-[8.875rem] lg:pb-14 lg:[--stripe-width:4.4375rem]"
    >
      <HeroChurro />

      <div className="relative z-10 flex w-full max-w-site flex-col items-center">
        <h1 className="flex w-full flex-col items-center font-display text-purple">
          <span className="text-hero-lead">{hero.title}</span>

          {wordmark && (
            <Wordmark
              image={wordmark}
              priority
              className="mt-1 h-auto w-[85vw] max-w-[587px]"
            />
          )}

          <span className="mt-6 text-hero-lead lg:mt-[3.125rem]">
            {hero.subtitle}
          </span>
        </h1>

        <p className="mt-11 max-w-[15.5rem] font-display text-hero-body text-ink lg:mt-[2.9rem] lg:max-w-none">
          {hero.bodyText}
        </p>

        <div className="mt-10 lg:mt-[4.75rem]">
          <MenuCta cta={hero.cta} />
        </div>
      </div>
    </section>
  );
}
