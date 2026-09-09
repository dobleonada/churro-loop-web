"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 80;

/**
 * Fixed header chrome. It sits transparently over the hero stripes, as in the
 * Figma, and fades in the cream background once the hero has scrolled away so
 * the anchor navigation stays usable down the page.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled ? "bg-cream/95 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      {children}
    </header>
  );
}
