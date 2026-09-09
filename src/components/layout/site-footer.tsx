import { Wordmark } from "@/components/ui/wordmark";
import { Link } from "@/i18n/navigation";
import { COPYRIGHT_NOTICE } from "@/lib/config";
import { getImage } from "@/lib/media";
import { LEGAL_LINKS, legalHref } from "@/lib/navigation";
import type { StrapiMedia } from "@/services/api/strapi.types";
import { useTranslations } from "next-intl";

interface SiteFooterProps {
  /** `contact.logo`, the horizontal lockup used from `md` up. */
  logo: StrapiMedia;
  /** `hero.media`, the stacked lockup the mobile frame uses instead. */
  stackedLogo: StrapiMedia;
}

/**
 * The oversized lockup that closes the page, the legal links and the
 * copyright line.
 *
 * Two lockups because the CMS has two and the design uses both: stacked on
 * mobile, horizontal from `md` up. Either way it runs nearly edge to edge —
 * 8px of margin on mobile, 16px on desktop, measured off the Figma frames.
 *
 * The legal links go through the locale-aware `Link`, so they keep the
 * visitor in their language. The design sets them as one line of running
 * text, each name followed by a full stop, so the stop stays outside the
 * link and the whole line stays unbreakable per item.
 */
export function SiteFooter({ logo, stackedLogo }: SiteFooterProps) {
  const t = useTranslations("Legal");
  const horizontal = getImage(logo, "Churro Loop");
  const stacked = getImage(stackedLogo, "Churro Loop");

  return (
    <footer className="pb-7 lg:pb-9">
      <div className="mt-8 px-2 lg:mt-6 lg:px-4">
        {stacked && (
          <Wordmark
            image={stacked}
            className="mx-auto h-auto w-full max-w-site md:hidden"
          />
        )}
        {horizontal && (
          <Wordmark
            image={horizontal}
            className="mx-auto hidden h-auto w-full max-w-site md:block"
          />
        )}
      </div>

      <p className="mt-8 px-6 text-center text-legal text-ink lg:mt-11">
        {LEGAL_LINKS.map(({ key, slug }) => (
          <span key={key} className="whitespace-nowrap">
            <Link
              href={legalHref(slug)}
              className="transition-colors hover:text-purple"
            >
              {t(key)}
            </Link>
            {". "}
          </span>
        ))}
      </p>

      <p className="mt-6 px-6 text-center font-semibold text-copyright text-ink lg:mt-5">
        {COPYRIGHT_NOTICE}
      </p>
    </footer>
  );
}
