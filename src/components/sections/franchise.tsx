import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { SectionHeading } from "@/components/ui/section-heading";
import { BRAND_NAME } from "@/lib/config";
import { splitLeadParagraph } from "@/lib/rich-text";
import type { FranchiseCtaDto } from "@/services/home/home.dto";
import { useTranslations } from "next-intl";

/**
 * Turns the CMS `redirectTo` into a link. It holds a bare address today
 * (`info@churroloop.com`), but the field is a free-text one, so a value that
 * already looks like a URL is passed through instead of being mangled into a
 * `mailto:`.
 */
function franchiseHref(redirectTo: string, subject: string): string {
  const target = redirectTo.trim();

  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return target;

  return `mailto:${target}?subject=${encodeURIComponent(subject)}`;
}

/**
 * "Franquicias": yellow band with the brand eyebrow, the section title, the
 * claim, the body copy and the `mailto` call to action.
 *
 * As in the manifesto, the eyebrow is the brand name typeset — not
 * `franchiseCta.logo`, which is the horizontal lockup and does not match what
 * the design shows here. `franchiseCta.text` packs the claim and the body into
 * one field, so its first paragraph is split off (see `splitLeadParagraph`).
 */
export function Franchise({ franchise }: { franchise: FranchiseCtaDto }) {
  const t = useTranslations("Franchise");
  const [claim, body] = splitLeadParagraph(franchise.text);

  return (
    <section
      id="franquicias"
      className="bg-yellow px-6 py-14 lg:py-20"
      aria-labelledby="franquicias-title"
    >
      <SectionHeading
        eyebrow={BRAND_NAME}
        title={franchise.title}
        titleId="franquicias-title"
      />

      {claim && (
        <p className="mx-auto mt-6 max-w-[22rem] text-center font-display text-h3 text-ink uppercase lg:mt-8 lg:max-w-none">
          {claim}
        </p>
      )}

      {body && (
        <Markdown
          source={body}
          className="mx-auto mt-5 max-w-[21.5rem] text-center text-copy text-ink lg:max-w-[40rem]"
        />
      )}

      <div className="mt-5 flex justify-center">
        <Button as="a" href={franchiseHref(franchise.franchbutton.redirectTo, t("mailSubject"))}>
          {franchise.franchbutton.label}
        </Button>
      </div>
    </section>
  );
}
