import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/** Routes that exist in every locale. Legal pages get added in phase 3. */
const ROUTES = ["/"] as const;

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
