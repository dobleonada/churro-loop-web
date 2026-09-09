import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/config";
import { getImage } from "@/lib/media";
import type { ContactDto, SeoDto } from "@/services/home/home.dto";

/** BCP 47 tags used for `hreflang`, keyed by the locales we route. */
const HREF_LANG: Record<Locale, string> = {
  es: "es-ES",
  en: "en",
};

/** Absolute URL for a route, honouring next-intl's `as-needed` prefixing. */
export function absoluteUrl(pathname: string, locale: Locale): string {
  return `${siteConfig.url}${getPathname({ href: pathname, locale })}`;
}

/**
 * `alternates.languages` plus `x-default` for a given route. Sharing this
 * keeps hreflang consistent across the home page, the legal pages and the
 * sitemap.
 */
export function languageAlternates(
  pathname: string
): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[HREF_LANG[locale]] = absoluteUrl(pathname, locale);
  }

  languages["x-default"] = absoluteUrl(pathname, routing.defaultLocale);

  return languages;
}

/**
 * Splits Strapi's `metaRobots` string ("index, follow") into the shape the
 * Next.js Metadata API expects.
 */
function parseRobots(metaRobots: string | null): Metadata["robots"] {
  const directives = (metaRobots ?? "")
    .split(",")
    .map((directive) => directive.trim().toLowerCase())
    .filter(Boolean);

  if (directives.length === 0) return undefined;

  return {
    index: !directives.includes("noindex"),
    follow: !directives.includes("nofollow"),
  };
}

/**
 * Open Graph images must be raster, so an SVG `metaImage` (which is what the
 * CMS currently holds) is skipped in favour of the static fallback in
 * `public/`.
 */
function openGraphImage(seo: SeoDto) {
  const image = getImage(seo.metaImage);

  if (image && !image.isVector) {
    return { url: image.src, width: image.width, height: image.height };
  }

  return { url: "/og-image.png", width: 1200, height: 630 };
}

/** Builds the page metadata from the CMS `seo` component. */
export function buildMetadata({
  seo,
  locale,
  pathname = "/",
}: {
  seo: SeoDto;
  locale: Locale;
  pathname?: string;
}): Metadata {
  const canonical = seo.canonicalURL ?? absoluteUrl(pathname, locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords
      ? seo.keywords.split(",").map((keyword) => keyword.trim())
      : undefined,
    robots: parseRobots(seo.metaRobots),
    alternates: {
      canonical,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      siteName: "Churro Loop",
      locale: HREF_LANG[locale],
      url: canonical,
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [openGraphImage(seo)],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [openGraphImage(seo).url],
    },
  };
}

/**
 * `Organization` JSON-LD. `FoodEstablishment` entries get added per location
 * once the first store opens.
 */
export function organizationJsonLd({
  seo,
  contact,
  locale,
}: {
  seo: SeoDto;
  contact: ContactDto;
  locale: Locale;
}) {
  const logo = getImage(seo.metaImage);
  const instagram = instagramUrl(contact.instagram);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Churro Loop",
    description: seo.metaDescription,
    url: absoluteUrl("/", locale),
    ...(logo ? { logo: logo.src } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(instagram ? { sameAs: [instagram] } : {}),
  };
}

/**
 * The CMS stores the Instagram account as a bare handle, so normalise it to a
 * profile URL. Returns `null` while the field is empty (open point A6).
 */
export function instagramUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  return `https://www.instagram.com/${value.replace(/^@/, "")}`;
}
