"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";
import type { MapLocation } from "@/lib/locations";

/**
 * `ssr: false` is what keeps the promise in §11 of the plan: MapLibre and its
 * stylesheet are ~200 kB that live in their own chunk and are only fetched
 * once this component actually renders. With `NEXT_PUBLIC_SHOW_MAP` off it
 * never does.
 */
const StoreMapCanvas = dynamic(() => import("./store-map-canvas"), {
  ssr: false,
});

/**
 * The map is built but not shown in the first release, because no store has
 * opened yet (plan §1.1 and §7.6). Flip this to `true` to turn it on; nothing
 * else has to change. Until then `StoreMap` returns before it renders the
 * canvas, so the MapLibre chunk is never requested.
 */
const SHOW_MAP = false;

/**
 * The store map under "Nuestros loops". Square corners and no heading of its
 * own, as in the Figma frame: 3:4-ish on mobile, 9:5 on desktop, which is what
 * turns one `fitBounds` on the Iberian peninsula into the two framings the
 * mockups show.
 *
 * The map itself is a canvas, so the cities are also listed for screen readers
 * and for anyone browsing without JavaScript. That list is the placeholder for
 * the visible address list the plan asks for — it needs street addresses the
 * CMS does not have yet (see churro-loop-web-fyk.1).
 */
export function StoreMap({ locations }: { locations: MapLocation[] }) {
  const t = useTranslations("Map");

  // The key is in the guard too: without one MapTiler answers 403 and the
  // frame would render as an empty yellow box, which is worse than no frame.
  if (!SHOW_MAP || !siteConfig.map.key || locations.length === 0) return null;

  return (
    <div className="mt-6 px-8 pb-4 lg:mt-10 lg:pb-13">
      <div
        role="region"
        aria-label={t("regionLabel")}
        className="relative mx-auto aspect-[7/9] w-full max-w-[53rem] overflow-hidden bg-yellow-soft md:aspect-[3/2] lg:aspect-[9/5]"
      >
        <StoreMapCanvas locations={locations} />
      </div>

      <ul className="sr-only">
        {locations.map((location) => (
          <li key={location.id}>{location.city}</li>
        ))}
      </ul>
    </div>
  );
}
