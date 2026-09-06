import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales supported by the app.
  locales: ["es", "en"],

  // Spanish is the default: it's served unprefixed at "/".
  // English is served under the "/en" prefix.
  defaultLocale: "es",
  localePrefix: "as-needed",
});
