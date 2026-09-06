const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL;

if (!CMS_API_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_CMS_API_URL environment variable. Define it in .env (see .env.example)."
  );
}

/** Base URL of the Strapi REST API. Already includes the `/api` prefix. */
export const CMS_BASE_URL = CMS_API_URL;

/**
 * REST paths for every Strapi content type this app consumes.
 * Add new entries here instead of hardcoding paths at the call site.
 */
export const API_PATHS = {
  home: "/churro-loop-landing",
} as const;
