import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/contact";
import { Franchise } from "@/components/sections/franchise";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { OurLoops } from "@/components/sections/our-loops";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { UnderConstruction } from "@/components/sections/under-construction";
import { UpcomingOpenings } from "@/components/sections/upcoming-openings";
import { routing } from "@/i18n/routing";
import { toMapLocations } from "@/lib/locations";
import { getImage } from "@/lib/media";
import { isPreviewUnlocked } from "@/lib/preview";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import { getHomePage } from "@/services/home/home.service";

async function requireHomePage(paramsPromise: PageProps<"/[locale]">["params"]) {
  const { locale } = await paramsPromise;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const home = await getHomePage(locale);

  if (!home) {
    notFound();
  }

  return { home, locale };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { home, locale } = await requireHomePage(params);

  return buildMetadata({ seo: home.seo, locale });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { home, locale } = await requireHomePage(params);

  /*
   * Temporary curtain (`churro-loop-web-71v`): until the visitor types the
   * shared password the landing is not rendered at all — none of its copy or
   * imagery reaches the browser. Deleting these three lines opens the site.
   */
  if (!(await isPreviewUnlocked())) {
    return (
      <UnderConstruction
        locale={locale}
        wordmark={getImage(home.hero.media, "Churro Loop")}
      />
    );
  }

  const jsonLd = organizationJsonLd({
    seo: home.seo,
    contact: home.contact,
    locale,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero hero={home.hero} />
      <PhotoStrip gallery={home.gallery} />
      <Manifesto manifesto={home.manifesto} />
      <UpcomingOpenings openings={home.openings} />
      <OurLoops
        loops={home.loops}
        locations={toMapLocations(
          home.openings.openings.map((opening) => opening.location)
        )}
      />
      <Franchise franchise={home.franchiseCta} />
      <Contact contact={home.contact} />
    </>
  );
}
