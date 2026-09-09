import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LEGAL_LINKS, legalHref } from "@/lib/navigation";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/** Routes that exist in every locale. */
const ROUTES = [
  "/",
  ...LEGAL_LINKS.map(({ slug }) => legalHref(slug)),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(route, locale),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.6,
      alternates: { languages: languageAlternates(route) },
    }))
  );
}
