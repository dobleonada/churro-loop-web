import { InstagramIcon } from "@/components/ui/instagram-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { instagramUrl } from "@/lib/seo";
import type { ContactDto } from "@/services/home/home.dto";
import { useTranslations } from "next-intl";

/**
 * "Contacto": eyebrow, title, the address as a `mailto` and the Instagram
 * link. The oversized lockup and the legal line below it belong to the footer
 * (`components/layout/site-footer.tsx`), which is rendered from the layout so
 * the legal pages get it too.
 *
 * `contact.title` is the eyebrow ("¿HABLAMOS?") and `contact.text` the title
 * ("CONTACTO") — the same inverted naming as `openings` and `loops`.
 */
export function Contact({ contact }: { contact: ContactDto }) {
  const t = useTranslations("Contact");
  const instagram = instagramUrl(contact.instagram);

  return (
    <section
      id="contacto"
      className="px-6 pt-11 lg:pt-12"
      aria-labelledby="contacto-title"
    >
      <SectionHeading
        eyebrow={contact.title}
        title={contact.text}
        titleId="contacto-title"
      />

      {contact.email && (
        <p className="mt-6 text-center text-copy text-ink">
          <a href={`mailto:${contact.email}`} className="hover:text-purple">
            {contact.email}
          </a>
        </p>
      )}

      {instagram && (
        <p className="mt-4 flex justify-center">
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            aria-label={t("instagram")}
            className="text-purple transition-colors hover:text-purple-deep"
          >
            <InstagramIcon className="h-[34px] w-[34px]" />
          </a>
        </p>
      )}
    </section>
  );
}
