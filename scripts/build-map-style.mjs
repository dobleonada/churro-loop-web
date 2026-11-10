/**
 * Builds `public/map/churroloop-style.json`, the brand map style, from
 * OpenFreeMap's Positron (free, no API key, commercial use allowed).
 *
 *   node scripts/build-map-style.mjs
 *
 * Positron is fetched fresh and recoloured layer by layer, so re-running this
 * picks up upstream fixes while keeping the brand look. The colours mirror the
 * Figma map frame of 9 Nov 2026, sampled pixel by pixel: land and sea are
 * paler than the `--color-yellow*` tokens, and the sea is deliberately not the
 * page cream, so the frame's edge still reads against the page.
 */
import { writeFile } from "node:fs/promises";

const SOURCE = "https://tiles.openfreemap.org/styles/positron";
const OUT = new URL("../public/map/churroloop-style.json", import.meta.url);

const LAND = "#FDEDB2";
const WATER = "#FFF9E6";
const URBAN = "#FAC94B"; // --color-yellow
const ROAD = "#FDEDC4";
const BORDER = "#F3CF73";
const TEXT = "#4D4D4D";
const TEXT_SOFT = "#8A7A52";
const HALO = "#FFF6DC";

const style = await fetch(SOURCE).then((response) => {
  if (!response.ok) throw new Error(`${SOURCE} answered ${response.status}`);
  return response.json();
});

/**
 * Paint overrides keyed by layer id prefix. The first match wins, so the
 * longer prefixes go first (`waterway…` and `water_name…` before `water`).
 */
const PAINT = [
  ["background", { "background-color": LAND }],
  ["water_name", { "text-color": TEXT_SOFT, "text-halo-color": HALO }],
  ["waterway_line_label", { "text-color": TEXT_SOFT, "text-halo-color": HALO }],
  ["waterway", { "line-color": WATER }],
  ["water", { "fill-color": WATER }],
  ["park", { "fill-color": LAND }],
  ["landcover_wood", { "fill-color": LAND }],
  ["landcover_", { "fill-color": LAND }],
  ["landuse_residential", { "fill-color": URBAN }],
  ["building", { "fill-color": URBAN, "fill-outline-color": URBAN }],
  ["aeroway", { "fill-color": ROAD, "line-color": ROAD }],
  ["road_", { "fill-color": LAND, "line-color": LAND }],
  ["tunnel_", { "line-color": ROAD }],
  ["highway_", { "line-color": ROAD }],
  ["railway", { "line-color": ROAD }],
  ["boundary_", { "line-color": BORDER }],
  ["highway-name", { "text-color": TEXT_SOFT, "text-halo-color": HALO }],
  ["airport", { "text-color": TEXT_SOFT, "text-halo-color": HALO }],
  ["label_", { "text-color": TEXT, "text-halo-color": HALO }],
];

style.name = "ChurroLoop";
// Positron declares a shaded-relief raster source that no layer uses.
delete style.sources.ne2_shaded;

for (const layer of style.layers) {
  const match = PAINT.find(([prefix]) => layer.id.startsWith(prefix));
  if (!match || !layer.paint) continue;

  for (const [property, value] of Object.entries(match[1])) {
    if (property in layer.paint) layer.paint[property] = value;
  }
}

await writeFile(OUT, `${JSON.stringify(style, null, 1)}\n`);
console.log(`Wrote ${OUT.pathname} (${style.layers.length} layers)`);
