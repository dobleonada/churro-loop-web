"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function Chevron({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      viewBox="0 0 12 40"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-2.5 lg:h-10 lg:w-3", direction === "next" && "rotate-180")}
    >
      <path d="M10 2 1.5 20 10 38" />
    </svg>
  );
}

interface CarouselProps {
  items: ReactNode[];
  /** Accessible name for the carousel region — usually the section heading. */
  ariaLabel: string;
  /**
   * Slides per view and gutter are read from `--slides` and `--slide-gap`, so
   * callers set them per breakpoint with arbitrary properties, e.g.
   * `[--slides:2] [--slide-gap:9px] lg:[--slides:3] lg:[--slide-gap:28px]`.
   * Horizontal padding on the root is what leaves room for the arrows.
   */
  className?: string;
}

/**
 * Arrow-navigated carousel: no autoplay and no loop, matching the design.
 * Drag, keyboard and disabled end states all come for free from Embla plus
 * the button semantics.
 */
export function Carousel({ items, ariaLabel, className }: CarouselProps) {
  const t = useTranslations("Carousel");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });
  // Subscribing to Embla rather than mirroring it into state keeps the arrow
  // states in sync from the first paint, including the re-subscribe that
  // happens once `emblaApi` exists.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!emblaApi) return () => {};

      emblaApi.on("select", onChange).on("reInit", onChange);

      return () => {
        emblaApi.off("select", onChange).off("reInit", onChange);
      };
    },
    [emblaApi]
  );

  const canScrollPrevious = useSyncExternalStore(
    subscribe,
    () => emblaApi?.canScrollPrev() ?? false,
    () => false
  );
  const canScrollNext = useSyncExternalStore(
    subscribe,
    () => emblaApi?.canScrollNext() ?? false,
    () => true
  );

  const arrowClassName =
    "absolute top-1/2 z-10 -translate-y-1/2 text-purple transition-opacity hover:text-purple-deep disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription={t("roleDescription")}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label={t("previous")}
        disabled={!canScrollPrevious}
        onClick={() => emblaApi?.scrollPrev()}
        className={cn(arrowClassName, "left-0 lg:left-6")}
      >
        <Chevron direction="previous" />
      </button>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex ml-[calc(var(--slide-gap)*-1)]">
          {items.map((item, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription={t("slideRoleDescription")}
              aria-label={t("slide", { index: index + 1, total: items.length })}
              className="min-w-0 shrink-0 grow-0 basis-[calc(100%/var(--slides))] pl-[var(--slide-gap)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label={t("next")}
        disabled={!canScrollNext}
        onClick={() => emblaApi?.scrollNext()}
        className={cn(arrowClassName, "right-0 lg:right-6")}
      >
        <Chevron direction="next" />
      </button>
    </div>
  );
}
