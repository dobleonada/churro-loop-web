"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useLocale } from "next-intl";
import { MAP_STYLE_PATH } from "@/lib/config";
import {
  IBERIA_BOUNDS,
  PORTRAIT_BOUNDS,
  type MapLocation,
} from "@/lib/locations";
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

/**
 * Where the label sits relative to the tip, measured on the 9 Nov 2026 frames:
 * its left edge just behind the tip and its body straddling it, so the lower
 * end of the churro stands in front of the label's left padding.
 */
const LABEL_OFFSET = { x: -8, y: -18 } as const;

/**
 * The pin plus its purple label ("BILBAO / ABRIL 2027"). Built by hand
 * because MapLibre markers are plain DOM, not React; the Tailwind classes
 * still apply since this file is scanned like any other.
 *
 * The label is visible text but also duplicated in the list next to the map:
 * the canvas region is not something a screen reader can walk, so the markers
 * are hidden from assistive tech and the list does the announcing.
 */
function createMarkerElement(location: MapLocation): HTMLDivElement {
  const element = document.createElement("div");
  element.style.width = `${MARKER_WIDTH}px`;
  element.style.height = `${MARKER_HEIGHT}px`;
  element.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className =
    "absolute flex flex-col whitespace-nowrap rounded-lg bg-purple py-1 pr-2.5 pl-5 font-sans text-[0.5625rem] leading-[1.15] font-semibold text-white uppercase md:text-[0.625rem]";
  label.style.left = `${TIP.x * MARKER_WIDTH + LABEL_OFFSET.x}px`;
  label.style.top = `${TIP.y * MARKER_HEIGHT + LABEL_OFFSET.y}px`;

  const city = document.createElement("span");
  city.textContent = location.city;
  const status = document.createElement("span");
  status.textContent = location.status;
  label.append(city, status);

  const churro = document.createElement("img");
  churro.src = "/images/churro-marker.png";
  churro.width = MARKER_WIDTH;
  churro.height = MARKER_HEIGHT;
  churro.alt = "";
  churro.draggable = false;
  churro.className = "relative";

  element.append(label, churro);

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
  const locale = useLocale();

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const [southWest, northEast] =
      container.clientHeight > container.clientWidth
        ? PORTRAIT_BOUNDS
        : IBERIA_BOUNDS;

    const map = new maplibregl.Map({
      container,
      // The brand style lives in `public/`; MapLibre wants an absolute URL.
      style: new URL(MAP_STYLE_PATH, window.location.origin).toString(),
      bounds: [...southWest, ...northEast],
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

    map.on("load", () => {
      // The pinned cities are already named by their purple label, so the
      // basemap's own label for them would only peek out from behind the pin.
      const pinned = [
        "literal",
        locations.map((location) => location.city.toUpperCase()),
      ];

      for (const layer of map.getStyle().layers) {
        if (layer.type !== "symbol" || !layer.layout?.["text-field"]) continue;

        // Place names in the page's language ("Sevilla", "Argel"), falling
        // back to the Latin-script name and then to the local one.
        map.setLayoutProperty(layer.id, "text-field", [
          "coalesce",
          ["get", `name:${locale}`],
          ["get", "name:latin"],
          ["get", "name"],
        ]);

        if (layer["source-layer"] === "place") {
          const notPinned = [
            "!",
            [
              "in",
              ["upcase", ["coalesce", ["get", "name:es"], ["get", "name"]]],
              pinned,
            ],
          ];
          map.setFilter(
            layer.id,
            (layer.filter
              ? ["all", layer.filter, notPinned]
              : notPinned) as maplibregl.FilterSpecification
          );
        }
      }

      // The compact attribution starts expanded, which on a map this size is
      // a white bar across the bottom. Collapse it to its "i" button.
      container
        .querySelector(".maplibregl-ctrl-attrib")
        ?.classList.remove("maplibregl-compact-show");
    });

    map.on("click", enableScrollZoom);
    container.addEventListener("mouseleave", disableScrollZoom);

    for (const location of locations) {
      new maplibregl.Marker({
        element: createMarkerElement(location),
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
  }, [locations, locale]);

  // Sized with `h-full`, not `absolute inset-0`: MapLibre's stylesheet sets
  // `.maplibregl-map { position: relative }`, which would turn the latter into
  // a 0px-tall box — an empty frame with every pin bunched in the middle.
  return <div ref={containerRef} className="h-full w-full" />;
}
