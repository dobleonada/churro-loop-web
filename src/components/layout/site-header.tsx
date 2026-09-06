import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/navigation";
import type { ImageSource } from "@/lib/media";
import { HeaderShell } from "@/components/layout/header-shell";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { Wordmark } from "@/components/ui/wordmark";

interface SiteHeaderProps {
  logo: ImageSource;
}

export function SiteHeader({ logo }: SiteHeaderProps) {
  const t = useTranslations("Nav");

  return (
    <HeaderShell>
      <div className="mx-auto flex max-w-site items-center justify-between px-[1.375rem] py-5 md:px-6 lg:px-8 lg:py-9">
        <Link href="/" aria-label="Churro Loop">
          <Wordmark
            image={logo}
            className="h-[51px] w-auto lg:h-[54px]"
            priority
          />
        </Link>

        <div className="flex items-center gap-6 lg:gap-7">
          <nav
            aria-label={t("label")}
            className="hidden items-center gap-[1.875rem] lg:flex"
          >
            {NAV_LINKS.map(({ key, hash }) => (
              <a
                key={key}
                href={hash}
                className="text-nav font-semibold whitespace-nowrap text-purple uppercase transition-colors hover:text-purple-deep"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          <MobileMenu />
          <LocaleSwitcher />
        </div>
      </div>
    </HeaderShell>
  );
}
