import { cookies } from "next/headers";

/**
 * Temporary "under construction" mode, asked for by the client on 10 Sep 2026
 * (`churro-loop-web-71v`).
 *
 * While it is on, `/` and `/en` serve the "under construction" curtain instead
 * of the landing; typing the shared password drops the cookie below and the
 * same URL starts serving the landing again. Turning it off means deleting
 * this file and the two `isPreviewUnlocked()` checks that read it, in
 * `src/app/[locale]/page.tsx` and in the root layout.
 *
 * This is a curtain, not a security boundary: the password is shared with the
 * client by email and is compiled into the server bundle. It keeps the site
 * out of sight, nothing more — never put anything genuinely private behind it.
 */
const PREVIEW_PASSWORD = "churroloop2026";

/** Name of the cookie that remembers a visitor who typed the password. */
export const PREVIEW_COOKIE = "churro-preview";

/** Its only valid value — the cookie carries no data, just the fact. */
const PREVIEW_COOKIE_VALUE = "unlocked";

/** A week: long enough for a review round, short enough to expire on its own. */
const PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function isValidPreviewPassword(password: string): boolean {
  return password.trim() === PREVIEW_PASSWORD;
}

/** Whether the current request may see the landing at `CONTENT_PATH`. */
export async function isPreviewUnlocked(): Promise<boolean> {
  const store = await cookies();

  return store.get(PREVIEW_COOKIE)?.value === PREVIEW_COOKIE_VALUE;
}

/** Opens the preview for this browser. Only ever called from a server action. */
export async function unlockPreviewCookie(): Promise<void> {
  const store = await cookies();

  store.set(PREVIEW_COOKIE, PREVIEW_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PREVIEW_COOKIE_MAX_AGE,
  });
}
