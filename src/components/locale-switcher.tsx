"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <nav className="flex justify-end gap-3 px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
      {routing.locales.map((cur) => (
        <Link
          key={cur}
          href={pathname}
          locale={cur}
          aria-current={cur === locale ? "true" : undefined}
          className={
            cur === locale
              ? "text-zinc-950 dark:text-zinc-50"
              : "hover:text-zinc-950 dark:hover:text-zinc-50"
          }
        >
          {t(cur)}
        </Link>
      ))}
    </nav>
  );
}
