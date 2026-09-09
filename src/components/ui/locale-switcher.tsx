"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  className?: string;
  /** `header` is the compact purple pill; `mobile` is the larger overlay one. */
  variant?: "header" | "mobile";
}

/**
 * The ES | EN pill. Renders real links (not buttons) so middle-click and
 * crawlers work, and keeps the current pathname when switching language.
 */
export function LocaleSwitcher({
  className,
  variant = "header",
}: LocaleSwitcherProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full bg-purple font-semibold tracking-[0.08em] text-white",
        variant === "header"
          ? "h-6 gap-2 px-2.5 text-[0.625rem] lg:h-[1.5625rem] lg:gap-2.5 lg:px-3"
          : "h-8 gap-3 px-4 text-xs",
        className
      )}
    >
      {routing.locales.map((locale, index) => (
        <span key={locale} className="inline-flex items-center">
          {index > 0 && (
            <span
              aria-hidden="true"
              className={cn(
                "mr-2 inline-block w-px bg-white/50",
                variant === "header" ? "h-3 lg:h-3.5" : "h-4"
              )}
            />
          )}
          <Link
            href={pathname}
            locale={locale}
            aria-current={locale === activeLocale ? "true" : undefined}
            className={cn(
              "transition-opacity",
              locale === activeLocale
                ? "text-white"
                : "text-white/60 hover:text-white"
            )}
          >
            {t(locale)}
          </Link>
        </span>
      ))}
    </nav>
  );
}
