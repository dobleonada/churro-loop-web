"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { NAV_LINKS } from "@/lib/navigation";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Hamburger + full-screen overlay used below the `lg` breakpoint. The overlay
 * traps focus, closes on Escape and locks the background scroll.
 */
export function MobileMenu() {
  const t = useTranslations("Nav");
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t("openMenu")}
        aria-expanded={isOpen}
        className="-m-2 flex flex-col items-center justify-center gap-[5px] p-2 lg:hidden"
      >
        {[0, 1, 2].map((line) => (
          <span
            key={line}
            aria-hidden="true"
            className="block h-[2px] w-6 rounded-full bg-purple"
          />
        ))}
      </button>

      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("label")}
          className="fixed inset-0 z-100 flex flex-col bg-cream lg:hidden"
        >
          <div className="flex items-center justify-end gap-6 px-[1.375rem] py-6 md:px-6">
            <LocaleSwitcher variant="mobile" />
            <button
              type="button"
              onClick={close}
              aria-label={t("closeMenu")}
              className="-m-2 grid size-10 place-items-center p-2 text-purple"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <nav
            aria-label={t("label")}
            className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-24 text-center"
          >
            {NAV_LINKS.map(({ key, hash }) => (
              <a
                key={key}
                href={hash}
                onClick={close}
                className="font-display text-3xl tracking-[0.02em] text-purple"
              >
                {t(key)}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
