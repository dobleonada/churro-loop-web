import { cache } from "react";
import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { API_PATHS } from "../api/config";
import { nextFetch } from "../api/next-fetch";
import type { LegalPageAttributesDto, LegalPageResponseDto } from "./legal.dto";

async function fetchBySlug(
  locale: Locale,
  slug: string
): Promise<LegalPageAttributesDto | null> {
  const response = await nextFetch<LegalPageResponseDto>(API_PATHS.legalPages, {
    searchParams: {
      locale,
      "filters[slug][$eq]": slug,
      // `legalText` is a repeatable component and `seo.metaImage` a media
      // field: Strapi v4 populates neither by default.
      populate: "deep",
    },
    // Legal copy changes far less often than the landing page.
    next: { revalidate: 3600, tags: ["legal"] },
  });

  return response.data[0]?.attributes ?? null;
}

/**
 * Fetches one legal page by slug. The slug is the field the CMS routes on —
 * there is no other stable identifier, and the numeric ids are not stable
 * across environments.
 *
 * Only the Spanish locale is populated in Strapi today (the English entries
 * were never created — `churro-loop-web-3ia.2`), so a miss falls back to the
 * default locale rather than 404ing: a legal page that is unreachable in one
 * language is worse than one served in Spanish. The caller can tell the
 * difference from the `locale` on the returned entry and marks the copy with
 * the right `lang`. Delete the fallback once the localisations land.
 *
 * Memoised with React `cache` so the page and `generateMetadata` share one
 * request per render.
 */
export const getLegalPage = cache(
  async (
    locale: Locale,
    slug: string
  ): Promise<LegalPageAttributesDto | null> => {
    const page = await fetchBySlug(locale, slug);

    if (page || locale === routing.defaultLocale) return page;

    return fetchBySlug(routing.defaultLocale, slug);
  }
);
