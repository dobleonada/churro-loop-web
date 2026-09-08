/**
 * Geographic data for the store map.
 *
 * The CMS models the openings as `{ location, title, image }` and carries no
 * coordinates, so the geodata lives here and is matched to the CMS entries by
 * city name (see `PLAN-CHURROLOOP.md` §5.2, which listed the same table).
 * Adding a city is one line; a city without an entry simply gets no marker,
 * which is the safe failure mode — the section still renders.
 *
 * If the client ever needs to move a pin without a deploy, the fix is to add
 * latitude/longitude fields to the `openings` component in Strapi and read
 * them here instead.
 */

/** `[longitude, latitude]`, the order MapLibre expects. */
export type Coordinates = readonly [number, number];

export interface MapLocation {
  /** Slug of the city, stable across locales. Used as the React/marker key. */
  id: string;
  /** City name exactly as the CMS spells it, for the accessible list. */
  city: string;
  coordinates: Coordinates;
}

const CITY_COORDINATES: Record<string, Coordinates> = {
  bilbao: [-2.935, 43.263],
  burgos: [-3.7, 42.3439],
  valencia: [-0.3763, 39.4699],
  malaga: [-4.4214, 36.7213],
  sevilla: [-5.9845, 37.3891],
  madrid: [-3.7038, 40.4168],
  barcelona: [2.1686, 41.3874],
};

/**
 * Initial framing: the Iberian peninsula, as in the design. Fitting bounds
 * rather than hardcoding a centre and zoom is what lets the same map look
 * right in the portrait frame on mobile and the landscape one on desktop.
 */
export const IBERIA_BOUNDS: readonly [Coordinates, Coordinates] = [
  [-9.6, 36.0],
  [3.4, 43.9],
];

/** "MÁLAGA" and "Málaga" both have to match the `malaga` key. */
function toCityKey(city: string): string {
  return city
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

/**
 * Maps CMS city names onto the coordinate table, dropping the ones we have no
 * coordinates for.
 */
export function toMapLocations(cities: readonly string[]): MapLocation[] {
  return cities.flatMap((city) => {
    const id = toCityKey(city);
    const coordinates = CITY_COORDINATES[id];

    return coordinates ? [{ id, city, coordinates }] : [];
  });
}
