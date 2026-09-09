"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/**
 * `NEXT_PUBLIC_MENU_MODE=soon`: the CTA keeps its place in the hero, and
 * pressing it announces that the menu is on its way. The notice is absolutely
 * positioned so revealing it doesn't reflow the hero composition.
 */
export function MenuSoonButton({ label }: { label: string }) {
  const t = useTranslations("Hero");
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="relative inline-flex flex-col items-center">
      <Button type="button" onClick={() => setIsRevealed(true)}>
        {label}
      </Button>
      <p
        aria-live="polite"
        className="absolute top-full left-1/2 mt-3 -translate-x-1/2 text-small font-semibold tracking-[0.08em] whitespace-nowrap text-purple uppercase"
      >
        {isRevealed ? t("menuSoon") : ""}
      </p>
    </div>
  );
}
