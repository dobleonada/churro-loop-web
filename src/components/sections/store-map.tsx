"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { MapLocation } from "@/lib/locations";

/**
 * `ssr: false` is what keeps the promise in §11 of the plan: MapLibre and its
 * stylesheet are ~200 kB that live in their own chunk and are only fetched
 * once this component actually renders. With `SHOW_MAP` off it never does.
 */
const StoreMapCanvas = dynamic(() => import("./store-map-canvas"), {
  ssr: false,
});

/**
 * On since 9 Nov 2026: the client wants the 2027 cities marked on the map
 * even though no store has a street address yet. Flip this back to `false` to
 * hide it; `StoreMap` then returns before it renders the canvas, so the
 * MapLibre chunk is never requested.
 */
const SHOW_MAP = true;

/**
 * The store map under "Nuestros loops". Rounded corners and no heading of its
 * own, as in the 9 Nov 2026 Figma frames: 7:9 on mobile, 9:5 on desktop,
 * which is what turns one `fitBounds` on the Iberian peninsula into the two
 * framings the mockups show. Each pin carries the city and its opening date.
 *
 * The map itself is a canvas, so the cities are also listed for screen readers
 * and for anyone browsing without JavaScript. That list is the placeholder for
 * the visible address list the plan asks for — it needs street addresses the
 * CMS does not have yet (see churro-loop-web-fyk.1).
 */
export function StoreMap({ locations }: { locations: MapLocation[] }) {
  const t = useTranslations("Map");

  if (!SHOW_MAP || locations.length === 0) return null;

  return (
    <div className="mt-6 px-5 pb-4 md:px-8 lg:mt-10 lg:pb-13">
      <div
        role="region"
        aria-label={t("regionLabel")}
        className="relative mx-auto aspect-[7/9] w-full max-w-[53rem] overflow-hidden rounded-lg bg-yellow-soft md:aspect-[3/2] lg:aspect-[9/5]"
      >
        <StoreMapCanvas locations={locations} />
      </div>

      <ul className="sr-only">
        {locations.map((location) => (
          <li key={location.id}>
            {location.city}: {location.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
