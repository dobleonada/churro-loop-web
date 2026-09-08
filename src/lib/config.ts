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

/**
 * The footer copyright line, exactly as the design typesets it — no space, no
 * year interpolation, and the symbol after the year. It is identical in both
 * locales, so it belongs here rather than in the message catalogs.
 */
export const COPYRIGHT_NOTICE = "ChurroLoop2026©";

/**
 * MapTiler style designed for the brand (yellow land, cream water). The key is
 * appended at runtime, so the URL alone is safe to keep in the repo.
 */
const DEFAULT_MAP_STYLE =
  "https://api.maptiler.com/maps/01a014c9-6660-7e5a-8ff0-4c479ab0b9ff/style.json";

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
  map: {
    /**
     * Whether the map renders is a code switch in `store-map.tsx`, not a flag.
     * These two are credentials and cannot be anything but environment: the
     * key must not be committed, and it is only read once the map is on.
     *
     * The key is public by necessity, so restrict it by domain in the MapTiler
     * panel before turning the map on.
     */
    key: process.env.NEXT_PUBLIC_MAPTILER_KEY || "",
    styleUrl: process.env.NEXT_PUBLIC_MAPTILER_STYLE || DEFAULT_MAP_STYLE,
  },
} as const;

/** The style URL with the API key attached, as MapTiler expects it. */
export function mapStyleUrl(): string {
  const url = new URL(siteConfig.map.styleUrl);
  url.searchParams.set("key", siteConfig.map.key);

  return url.toString();
}
