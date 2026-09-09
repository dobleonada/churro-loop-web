import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalTextBlocks } from "@/components/sections/legal-text-blocks";
import { routing } from "@/i18n/routing";
import { LEGAL_LINKS, legalHref } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";
import { getLegalPage } from "@/services/legal/legal.service";

/** Pre-renders the three known pages in both locales; anything else 404s. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    LEGAL_LINKS.map(({ slug }) => ({ locale, slug }))
  );
}

/**
 * Resolves the `[locale]/legal/[slug]` params into the CMS entry and the
 * message key that names the page. Unknown slugs and slugs with no entry
 * behind them 404 rather than rendering an empty document.
 */
async function requireLegalPage(
  paramsPromise: PageProps<"/[locale]/legal/[slug]">["params"]
) {
  const { locale, slug } = await paramsPromise;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const link = LEGAL_LINKS.find((legal) => legal.slug === slug);
  const page = link ? await getLegalPage(locale, slug) : null;

  if (!link || !page) {
    notFound();
  }

  return { page, locale, key: link.key };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal/[slug]">): Promise<Metadata> {
  const { page, locale, key } = await requireLegalPage(params);
  const t = await getTranslations({ locale, namespace: "Legal" });

  return buildMetadata({
    // The CMS `seo` component is shared with the home page and all three
    // entries carry the same `metaTitle`, so the page name is used instead —
    // three pages under one title is a duplicate-title problem, not copy.
    // Everything else (description, robots, image) still comes from the CMS.
    seo: { ...page.seo, metaTitle: `${t(key)} | Churro Loop` },
    locale,
    pathname: legalHref(page.slug),
  });
}

export default async function LegalPage({
  params,
}: PageProps<"/[locale]/legal/[slug]">) {
  const { page, locale, key } = await requireLegalPage(params);
  const t = await getTranslations({ locale, namespace: "Legal" });

  return (
    // The header is fixed and transparent until the page scrolls, so the
    // article starts below its full height (91px mobile, 126px desktop).
    <article
      className="mx-auto max-w-[46rem] px-6 pt-32 pb-16 lg:pt-44 lg:pb-24"
      // Only Spanish is populated in Strapi, so the copy can be served in a
      // language other than the page's. Say so rather than let a screen
      // reader read Spanish with an English voice.
      lang={page.locale !== locale ? page.locale : undefined}
    >
      <h1 className="font-display text-h2 text-purple">{t(key)}</h1>

      <LegalTextBlocks blocks={page.legalText} />
    </article>
  );
}
