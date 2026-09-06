import type {
  StrapiMedia,
  StrapiMediaCollection,
} from "@/services/api/strapi.types";

/** A Strapi media entry flattened into the props `next/image` expects. */
export interface ImageSource {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Vector assets are served as-is; `next/image` cannot resize them. */
  isVector: boolean;
}

function toImageSource(
  media: StrapiMedia["data"],
  fallbackAlt: string
): ImageSource | null {
  if (!media) return null;

  const { url, width, height, alternativeText, mime } = media.attributes;

  return {
    src: url,
    width,
    height,
    alt: alternativeText ?? fallbackAlt,
    isVector: mime === "image/svg+xml",
  };
}

/** Flattens a single media field. Returns `null` when the field is empty. */
export function getImage(
  media: StrapiMedia | null | undefined,
  fallbackAlt = ""
): ImageSource | null {
  return media ? toImageSource(media.data, fallbackAlt) : null;
}

/** Flattens a multiple media field, dropping empty entries. */
export function getImages(
  media: StrapiMediaCollection | null | undefined,
  fallbackAlt = ""
): ImageSource[] {
  if (!media) return [];

  return media.data
    .map((entry) => toImageSource(entry, fallbackAlt))
    .filter((image): image is ImageSource => image !== null);
}
