import type { Locale } from "next-intl";
import type { StrapiCollectionResponse } from "../api/strapi.types";
import type { LocalizationDto, SeoDto } from "../home/home.dto";

/**
 * DTOs for the `/legal-pages-churro-loops` Strapi collection type, one entry
 * per legal page. Reverse-engineered from
 * `GET /api/legal-pages-churro-loops?populate=deep`; keep in sync with the
 * content-type schema when it changes in Strapi.
 *
 * The collection reuses the same `seo` component as the home page, so `SeoDto`
 * is imported rather than redeclared.
 */

/**
 * One numbered clause of a legal document: a heading and its prose. The
 * component is repeatable, and a page is nothing but an ordered list of them —
 * there is no page-level title field, which is why the heading comes from the
 * message catalog (see `src/app/[locale]/legal/[slug]/page.tsx`).
 */
export interface LegalTextBlockDto {
  id: number;
  /**
   * Nullable: one block of the cookie policy has none, because it continues
   * the clause above it (`churro-loop-web-3ia`). Untitled blocks render as
   * prose under the previous heading.
   */
  title: string | null;
  /** Markdown: blank-line paragraphs, hard line breaks and `**bold**`. */
  text: string;
}

export interface LegalPageAttributesDto {
  /** The routed segment: `aviso-legal`, `politica-de-cookies`, … */
  slug: string;
  createdAt: string;
  updatedAt: string;
  locale: Locale;
  seo: SeoDto;
  legalText: LegalTextBlockDto[];
  localizations?: {
    data: LocalizationDto[];
  };
}

/** Filtering by slug returns a collection, never a single entry. */
export type LegalPageResponseDto =
  StrapiCollectionResponse<LegalPageAttributesDto>;
