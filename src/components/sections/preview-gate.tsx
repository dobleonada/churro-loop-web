"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { unlockPreview, type UnlockState } from "@/lib/preview-action";

const INITIAL_STATE: UnlockState = { error: false };

/**
 * The password field on the holding page. The shared password is checked in
 * the server action, so it never ships to the browser; this component only
 * shows whether the last attempt failed.
 */
export function PreviewGate() {
  const t = useTranslations("UnderConstruction");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    unlockPreview,
    INITIAL_STATE
  );

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col items-center gap-3"
    >
      {/* The action cannot read the locale from the route, so it travels here. */}
      <input type="hidden" name="locale" value={locale} />

      <label htmlFor="preview-password" className="sr-only">
        {t("passwordLabel")}
      </label>

      <input
        id="preview-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder={t("passwordLabel")}
        aria-invalid={state.error || undefined}
        aria-describedby={state.error ? "preview-password-error" : undefined}
        className="h-[42px] w-full rounded-full border border-purple bg-white px-6 text-center font-sans text-sm text-ink placeholder:text-ink/40"
      />

      <Button type="submit" disabled={isPending}>
        {t("submit")}
      </Button>

      {state.error && (
        <p
          id="preview-password-error"
          role="alert"
          className="font-sans text-sm text-purple"
        >
          {t("error")}
        </p>
      )}
    </form>
  );
}
