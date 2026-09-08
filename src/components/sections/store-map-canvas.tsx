"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { mapStyleUrl } from "@/lib/config";
import { IBERIA_BOUNDS, type MapLocation } from "@/lib/locations";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * The churro is used as the pin, exactly as in the Figma frame: the asset
 * already leans ~19° to the right, which is the tilt the mockup shows, so it
 * is placed unrotated. `churro-marker.png` is `hero-churro.png` downscaled to
 * 112x182 (12 kB instead of 750 kB) — a map with five pins must not pull the
 * hero-sized file.
 *
 * The measurements below are of the *whole* file, transparent padding
 * included, because that is what the browser lays out. `TIP` is where the
 * churro's lower end sits inside it, as a fraction of the box, so the pin
 * touches the ground at the right point.
 */
const MARKER_WIDTH = 48;
const MARKER_HEIGHT = 78;
const TIP = { x: 0.39, y: 0.885 } as const;

/** Room for the pins, which stand ~78px above the coordinate they mark. */
const FIT_PADDING = { top: 88, right: 24, bottom: 24, left: 24 };

function createMarkerElement(): HTMLImageElement {
  const element = document.createElement("img");

  element.src = "/images/churro-marker.png";
  element.width = MARKER_WIDTH;
  element.height = MARKER_HEIGHT;
  // The city names are announced by the list next to the map, so the pins
  // themselves are decoration.
  element.alt = "";
  element.setAttribute("aria-hidden", "true");
  element.draggable = false;

  return element;
}

/**
 * The MapLibre canvas itself. Loaded through `next/dynamic` from
 * `store-map.tsx`, so MapLibre and its stylesheet stay in a lazy chunk and
 * never reach the initial bundle while the map is switched off.
 */
export default function StoreMapCanvas({
  locations,
}: {
  locations: MapLocation[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style: mapStyleUrl(),
      bounds: [IBERIA_BOUNDS[0].slice(), IBERIA_BOUNDS[1].slice()].flat() as [
        number,
        number,
        number,
        number,
      ],
      fitBoundsOptions: { padding: FIT_PADDING },
      attributionControl: { compact: true },
      // The map sits mid-page, so it must not swallow the page scroll. A
      // click inside is taken as "I want to use the map" and hands wheel
      // zooming over until the pointer leaves again.
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    map.touchZoomRotate.disableRotation();
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    const enableScrollZoom = () => map.scrollZoom.enable();
    const disableScrollZoom = () => map.scrollZoom.disable();

    map.on("click", enableScrollZoom);
    container.addEventListener("mouseleave", disableScrollZoom);

    for (const location of locations) {
      new maplibregl.Marker({
        element: createMarkerElement(),
        anchor: "top-left",
        offset: [-TIP.x * MARKER_WIDTH, -TIP.y * MARKER_HEIGHT],
      })
        .setLngLat(location.coordinates.slice() as [number, number])
        .addTo(map);
    }

    return () => {
      container.removeEventListener("mouseleave", disableScrollZoom);
      map.remove();
    };
  }, [locations]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
