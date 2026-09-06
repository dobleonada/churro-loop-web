import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { PhotoStrip } from "@/components/sections/photo-strip";
import { UpcomingOpenings } from "@/components/sections/upcoming-openings";
import { routing } from "@/i18n/routing";
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
    </>
  );
}
