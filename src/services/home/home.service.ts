import type { Locale } from "next-intl";
import { API_PATHS } from "../api/config";
import { nextFetch } from "../api/next-fetch";
import type { HomePageAttributesDto, HomePageResponseDto } from "./home.dto";

/**
 * Fetches the `/churro-loop-landing` single type (our home page) for the
 * given locale.
 *
 * `populate=deep` is required: Strapi v4 doesn't populate components or
 * media by default, and this single type is components/media all the way
 * down (hero, gallery, loops, openings, manifesto, contact, seo).
 */
export async function getHomePage(
  locale: Locale
): Promise<HomePageAttributesDto | null> {
  const response = await nextFetch<HomePageResponseDto>(API_PATHS.home, {
    searchParams: {
      locale,
      populate: "deep",
    },
    // Revalidate periodically instead of caching indefinitely, since
    // content is edited in Strapi outside of a deploy.
    next: { revalidate: 60, tags: ["home"] },
  });

  return response.data?.attributes ?? null;
}
