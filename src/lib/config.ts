/**
 * Runtime configuration for everything the client wants "built but switched
 * off" (see section 8 of PLAN-CHURROLOOP.md). Reading it in one place keeps
 * `process.env` lookups out of the components.
 */

/**
 * How the hero's "VER CARTA" / "VIEW MENU" button behaves:
 * - `link`:   the button opens the menu (`NEXT_PUBLIC_MENU_URL`, or the PDF in
 *             `public/` — see `MENU_PDF`). The default since the client sent
 *             the menu on 9 Nov 2026.
 * - `soon`:   the button renders and announces "coming very soon" on click.
 * - `hidden`: the button is not rendered at all.
 */
export type MenuMode = "hidden" | "soon" | "link";

/**
 * Brand name, used where the design typesets it as an eyebrow rather than
 * showing the logo lockup (the manifesto, for instance), and as the fallback
 * alt text and metadata name. It is an identity constant, not copy: it is
 * identical in both locales, which is why it does not live in the message
 * catalogs. Always one word — the trademark is registered as "CHURROLOOP"
 * (client email, 9 Nov 2026).
 */
export const BRAND_NAME = "ChurroLoop";

/**
 * The footer copyright line, exactly as the design typesets it — no space, no
 * year interpolation, and the symbol after the year. It is identical in both
 * locales, so it belongs here rather than in the message catalogs.
 */
export const COPYRIGHT_NOTICE = "ChurroLoop2026©";

/**
 * The menu, as the client supplied it (`CartaChurroLoopWeb.pdf`). It is not in
 * the CMS — the hero `cta.url` field still holds a placeholder — so it is
 * served from `public/`. Replacing the menu means replacing that file.
 */
export const MENU_PDF = "/carta-churroloop.pdf";

/**
 * The brand map style (yellow land, cream water), served from `public/`. It is
 * OpenFreeMap's Positron recoloured by `scripts/build-map-style.mjs`: free, no
 * API key, commercial use allowed, so the map needs no environment at all.
 */
export const MAP_STYLE_PATH = "/map/churroloop-style.json";

function parseMenuMode(value: string | undefined): MenuMode {
  return value === "hidden" || value === "link" || value === "soon"
    ? value
    : "link";
}

export const siteConfig = {
  /** Canonical origin, without a trailing slash. Used for metadata + sitemap. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://churroloop.com").replace(
    /\/$/,
    ""
  ),
  menu: {
    mode: parseMenuMode(process.env.NEXT_PUBLIC_MENU_MODE),
    /** Where the button points in `link` mode. Defaults to the bundled PDF. */
    url: process.env.NEXT_PUBLIC_MENU_URL || MENU_PDF,
  },
} as const;
