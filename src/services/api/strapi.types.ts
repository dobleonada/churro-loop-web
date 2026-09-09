/**
 * Generic Strapi v4 REST response shapes, shared across every content type
 * this app consumes. Content-type-specific DTOs (e.g. the home page)
 * live next to their own service and reuse these building blocks.
 */

/** Wrapper for a single-type or single-entry response: `{ data, meta }`. */
export interface StrapiResponse<Attributes> {
  data: StrapiEntity<Attributes> | null;
  meta: Record<string, unknown>;
}

/** Wrapper for a collection response: `{ data: [...], meta }`. */
export interface StrapiCollectionResponse<Attributes> {
  data: Array<StrapiEntity<Attributes>>;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<Attributes> {
  id: number;
  attributes: Attributes;
}

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiMediaAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: Partial<
    Record<"thumbnail" | "small" | "medium" | "large", StrapiImageFormat>
  > | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

/** A single media field (e.g. an image picker relation). */
export interface StrapiMedia {
  data: StrapiEntity<StrapiMediaAttributes> | null;
}

/** A multiple media field (e.g. a gallery relation). */
export interface StrapiMediaCollection {
  data: Array<StrapiEntity<StrapiMediaAttributes>>;
}
