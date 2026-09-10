import { getTranslations } from "next-intl/server";
import { PreviewGate } from "@/components/sections/preview-gate";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { Wordmark } from "@/components/ui/wordmark";
import type { Locale } from "next-intl";
import type { ImageSource } from "@/lib/media";

/**
 * "Under construction" curtain, asked for by the client on 10 Sep 2026
 * (`churro-loop-web-71v`). It takes the place of the landing at `/` and `/en`
 * until the shared password is typed; the site chrome is not rendered behind
 * it, because the navigation would only point at sections nobody can see yet.
 *
 * Removing the whole thing is one move: drop the `isPreviewUnlocked()` check
 * in `src/app/[locale]/page.tsx` and in the root layout.
 */
export async function UnderConstruction({
  locale,
  wordmark,
}: {
  locale: Locale;
  /** The CMS lockup. Null when the CMS is unreachable — the page still renders. */
  wordmark: ImageSource | null;
}) {
  const t = await getTranslations({ locale, namespace: "UnderConstruction" });

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-churro-stripes px-6 py-20 text-center [--stripe-width:2.25rem] md:[--stripe-width:3.5rem] lg:[--stripe-width:4.4375rem]">
      <div className="absolute top-5 right-[1.375rem] md:right-6 lg:top-9 lg:right-8">
        <LocaleSwitcher />
      </div>

      <div className="flex w-full max-w-site flex-col items-center">
        {wordmark ? (
          <Wordmark
            image={wordmark}
            priority
            className="h-auto w-[80vw] max-w-[480px]"
          />
        ) : (
          <p className="font-display text-hero-lead text-purple uppercase">
            Churro Loop
          </p>
        )}

        <h1 className="mt-10 font-display text-h2 text-purple uppercase">
          {t("title")}
        </h1>

        <p className="mt-5 max-w-[28rem] font-display text-hero-body text-ink">
          {t("body")}
        </p>

        <div className="mt-12">
          <PreviewGate />
        </div>
      </div>
    </section>
  );
}
