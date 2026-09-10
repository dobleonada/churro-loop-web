"use server";

import { hasLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isValidPreviewPassword, unlockPreviewCookie } from "@/lib/preview";

/**
 * What the holding page's form reports back to the visitor. A "use server"
 * file may only export async functions, so the initial value of this state
 * lives in the form component, not here.
 */
export interface UnlockState {
  error: boolean;
}

/**
 * Checks the shared password typed on the holding page and, when it matches,
 * drops the preview cookie and reloads the home page — which then renders the
 * landing instead of the curtain — in the visitor's own language.
 *
 * The check runs on the server so the password never reaches the browser
 * bundle — see the warning in `src/lib/preview.ts` about what this does and
 * does not protect.
 *
 * The locale travels as a hidden form field because `next/root-params` (which
 * is how `src/i18n/request.ts` resolves it) cannot be read inside a Server
 * Action; it is validated here rather than trusted.
 */
export async function unlockPreview(
  _previous: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const password = String(formData.get("password") ?? "");

  if (!isValidPreviewPassword(password)) {
    return { error: true };
  }

  const requestedLocale = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  await unlockPreviewCookie();

  // Back to the same page: with the cookie set, `/` renders the landing.
  redirect({ href: "/", locale });

  // Unreachable: `redirect` throws. It comes from a destructured binding in
  // `@/i18n/navigation`, so TypeScript cannot see that it returns `never`.
  return { error: false };
}
