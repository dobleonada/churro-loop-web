/**
 * The single-page anchors used by the header and the mobile menu.
 *
 * The hashes are intentionally *not* translated: they are shared links, and
 * translating them would break URLs pasted from the other language. `key`
 * points at the `Nav` message namespace.
 *
 * They are rendered as locale-aware links to `/` + hash, never as bare
 * `href="#..."`: the header and the mobile menu also render on the legal
 * pages, where a bare hash would resolve against the legal URL and go
 * nowhere. From the home page the same link still just scrolls.
 */
export const NAV_LINKS = [
  { key: "manifesto", hash: "#manifiesto" },
  { key: "openings", hash: "#proximas-aperturas" },
  { key: "where", hash: "#donde-estamos" },
  { key: "franchise", hash: "#franquicias" },
  { key: "contact", hash: "#contacto" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

/** Home + hash, for the header and the mobile menu. */
export function homeAnchor(hash: string): string {
  return `/${hash}`;
}

/**
 * The three legal pages, in the order the footer lists them. `key` points at
 * the `Legal` message namespace (the page name, used by the footer link and
 * as the page's `h1`), `slug` is the Strapi `slug` field — the one the CMS
 * routes on, and the segment of `/[locale]/legal/[slug]`.
 *
 * The slug is *not* translated: Strapi holds a single Spanish entry per page,
 * so an English slug would have no content behind it. `/en/legal/aviso-legal`
 * is the English route until the localisations land.
 */
export const LEGAL_LINKS = [
  { key: "legalNotice", slug: "aviso-legal" },
  { key: "cookies", slug: "politica-de-cookies" },
  { key: "privacy", slug: "politica-de-privacidad" },
] as const;

export type LegalLink = (typeof LEGAL_LINKS)[number];

/** The route for a legal page, as `Link`/`getPathname` expect it. */
export function legalHref(slug: string): string {
  return `/legal/${slug}`;
}
