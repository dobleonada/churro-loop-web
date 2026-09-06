/**
 * The single-page anchors used by the header and the mobile menu.
 *
 * The hashes are intentionally *not* translated: they are shared links, and
 * translating them would break URLs pasted from the other language. `key`
 * points at the `Nav` message namespace.
 */
export const NAV_LINKS = [
  { key: "manifesto", hash: "#manifiesto" },
  { key: "openings", hash: "#proximas-aperturas" },
  { key: "where", hash: "#donde-estamos" },
  { key: "franchise", hash: "#franquicias" },
  { key: "contact", hash: "#contacto" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
