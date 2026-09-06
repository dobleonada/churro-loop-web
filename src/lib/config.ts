/**
 * Runtime configuration for everything the client wants "built but switched
 * off" (see section 8 of PLAN-CHURROLOOP.md). Reading it in one place keeps
 * `process.env` lookups out of the components.
 */

/**
 * How the hero's "VER CARTA" / "VIEW MENU" button behaves while there is no
 * menu to link to:
 * - `hidden`: the button is not rendered at all.
 * - `soon`:   the button renders and announces "coming very soon" on click.
 * - `link`:   the button links to the CMS `cta.url` (or `NEXT_PUBLIC_MENU_URL`).
 */
export type MenuMode = "hidden" | "soon" | "link";

/**
 * Brand name, used where the design typesets it as an eyebrow rather than
 * showing the logo lockup (the manifesto, for instance). It is an identity
 * constant, not copy: it is identical in both locales, which is why it does
 * not live in the message catalogs.
 */
export const BRAND_NAME = "Churro Loop";

function parseMenuMode(value: string | undefined): MenuMode {
  return value === "hidden" || value === "link" || value === "soon"
    ? value
    : "soon";
}

export const siteConfig = {
  /** Canonical origin, without a trailing slash. Used for metadata + sitemap. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://churroloop.com").replace(
    /\/$/,
    ""
  ),
  menu: {
    mode: parseMenuMode(process.env.NEXT_PUBLIC_MENU_MODE),
    /** Overrides the CMS `cta.url` when set. Only used in `link` mode. */
    url: process.env.NEXT_PUBLIC_MENU_URL || null,
  },
} as const;
