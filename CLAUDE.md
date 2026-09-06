# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint (flat config, `eslint.config.mjs`)

There is no test runner configured yet.

## Architecture

This is a Next.js App Router project (`next@16.3.4`, React 19), close to the
`create-next-app` starting point plus an `next-intl` i18n layer — no other
routes, components, or API handlers have been added.

- Application code lives under `src/` (the `src` directory convention — see
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`).
  Config files (`next.config.ts`, `tsconfig.json`, `package.json`, `.env`)
  and `public/` stay at the repo root.
- Routing lives under `src/app/`, nested under a root `src/app/[locale]/`
  segment (required by `next-intl`'s locale-based routing).
  `src/app/[locale]/layout.tsx` is the root layout: it validates `locale`
  with `hasLocale`, defines the `Geist`/`Geist Mono` fonts (via
  `next/font/google`) as CSS variables consumed in `src/app/globals.css`,
  and wraps `children` in `NextIntlClientProvider`.
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` — theme tokens are
  declared with `@theme inline` in `src/app/globals.css` rather than a
  `tailwind.config.*` file.
- The `@/*` path alias (see `tsconfig.json`) resolves to `src/`.
- `.env` defines `NEXT_PUBLIC_CMS_API_URL`, indicating a headless CMS
  integration is planned, though no code references it yet.

### Internationalization (`next-intl`)

Spanish (`es`) is the default locale, served unprefixed at `/`; English
(`en`) is served under `/en` (`localePrefix: "as-needed"` in
`src/i18n/routing.ts`). Requesting `/es` explicitly redirects to `/`.

- `src/i18n/routing.ts` — the shared `defineRouting` config (locales,
  default, prefix strategy). Change supported locales here.
- `src/i18n/navigation.ts` — locale-aware `Link`/`redirect`/`usePathname`/
  `useRouter`, exported via `createNavigation`. Use these instead of
  `next/navigation`'s equivalents anywhere a link/redirect should preserve
  or switch locale.
- `src/i18n/request.ts` — `getRequestConfig`; resolves the locale via
  `next/root-params` (built into `next@16.3+`, no `experimental.rootParams`
  needed) and loads `messages/<locale>.json`.
- `src/proxy.ts` — the locale-negotiation proxy, built with
  `next-intl/middleware`'s `createMiddleware`. Note: this Next.js version
  renamed the `middleware.js` file convention to `proxy.js`/`export
  proxy`/default export — see `node_modules/next/dist/docs/.../proxy.md`.
  It must live inside `src/` (per the src-folder doc above) since `src/app`
  is present.
- `next.config.ts` is wrapped in `next-intl/plugin`'s `createNextIntlPlugin`.
- `src/i18n/messages/es.json` / `src/i18n/messages/en.json` — translation
  catalogs, namespaced per page/component (e.g. `HomePage`,
  `LocaleSwitcher`). Rich text (links, inline `<code>`) uses `t.rich(...)`
  with tag callbacks rather than string concatenation.
- `src/global.d.ts` augments `next-intl`'s `AppConfig` so `Locale` and
  `Messages` are strongly typed from `src/i18n/routing.ts` /
  `src/i18n/messages/en.json`.
- `src/components/locale-switcher.tsx` is a Client Component
  (`usePathname`/`useRouter` from `src/i18n/navigation` are client-only);
  it's rendered from the root layout.
- After changing the `[locale]` route shape, regenerated types can go stale
  — run `npx next typegen` (or `next build`) if `tsc` reports missing/wrong
  `LayoutProps`/`PageProps` types.

Because `next@16.3.4` is newer than most training data and may include
breaking API/convention changes, consult `node_modules/next/dist/docs/`
before implementing App Router features you're not certain about — see
AGENTS.md above for details.
