import { CMS_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type SearchParamValue = string | number | boolean | undefined;

export type NextFetchOptions = RequestInit & {
  /** Query string params appended to the request URL. */
  searchParams?: Record<string, SearchParamValue>;
};

function buildUrl(
  path: string,
  searchParams?: Record<string, SearchParamValue>
): URL {
  const url = new URL(`${CMS_BASE_URL}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  return url;
}

/**
 * Thin wrapper around `fetch` for calls to the Strapi API: resolves the
 * base URL from `NEXT_PUBLIC_CMS_API_URL`, appends `searchParams`, and
 * surfaces non-2xx responses as `ApiError` instead of a resolved response
 * with error content. Accepts Next.js's `cache`/`next: { revalidate, tags }`
 * fetch options as-is.
 */
export async function nextFetch<T>(
  path: string,
  { searchParams, ...init }: NextFetchOptions = {}
): Promise<T> {
  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
      path
    );
  }

  return response.json() as Promise<T>;
}
