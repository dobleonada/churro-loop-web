import type { Locale } from "next-intl";
import type {
  StrapiMedia,
  StrapiMediaCollection,
  StrapiResponse,
} from "../api/strapi.types";

/**
 * DTOs for the `/churro-loop-landing` Strapi single type (our home page),
 * reverse-engineered from `GET /api/churro-loop-landing?populate=deep`.
 * Keep these in sync with the content-type schema when it changes in Strapi.
 */

export interface CtaDto {
  id: number;
  label: string;
  url: string;
}

export interface HeroDto {
  id: number;
  title: string;
  subtitle: string;
  bodyText: string;
  media: StrapiMedia;
  cta: CtaDto;
}

export interface ContactDto {
  id: number;
  title: string;
  text: string;
  email: string;
  instagram: string;
  logo: StrapiMedia;
}

export interface FranchiseButtonDto {
  id: number;
  label: string;
  redirectTo: string;
}

export interface FranchiseCtaDto {
  id: number;
  title: string;
  /** Markdown. */
  text: string;
  logo: StrapiMedia;
  franchbutton: FranchiseButtonDto;
}

export interface GalleryDto {
  id: number;
  images: StrapiMediaCollection;
}

export interface LoopItemDto {
  id: number;
  image: StrapiMediaCollection;
}

export interface LoopsDto {
  id: number;
  title: string;
  /** Markdown. */
  intro: string;
  loops: LoopItemDto[];
}

export interface ManifestoDto {
  id: number;
  title: string;
  /** Markdown. */
  text: string;
  logo: StrapiMedia;
}

export interface OpeningItemDto {
  id: number;
  title: string;
  location: string;
  description: string | null;
  image: StrapiMedia;
}

export interface OpeningsDto {
  id: number;
  title: string;
  intro: string;
  openings: OpeningItemDto[];
}

export interface SeoDto {
  id: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  metaRobots: string;
  structuredData: Record<string, unknown> | null;
  metaViewport: string | null;
  canonicalURL: string | null;
  metaImage: StrapiMedia;
}

export interface LocalizationDto {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: Locale;
  };
}

export interface HomePageAttributesDto {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: Locale;
  hero: HeroDto;
  contact: ContactDto;
  franchiseCta: FranchiseCtaDto;
  gallery: GalleryDto;
  loops: LoopsDto;
  manifesto: ManifestoDto;
  openings: OpeningsDto;
  seo: SeoDto;
  localizations?: {
    data: LocalizationDto[];
  };
}

export type HomePageResponseDto = StrapiResponse<HomePageAttributesDto>;
