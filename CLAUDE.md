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

This is a Next.js App Router project (`next@16.3.4`, React 19): a single-page
marketing site for Churro Loop, in Spanish and English, with all copy and
imagery coming from a Strapi v4 CMS. See `AGENTS.md` for the design tokens,
the CMS data flow and the list of assets that are not in the CMS, and
`PLAN-CHURROLOOP.md` for the full brief.

- Application code lives under `src/` (the `src` directory convention — see
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`).
  Config files (`next.config.ts`, `tsconfig.json`, `package.json`, `.env`)
  and `public/` stay at the repo root.
- Routing lives under `src/app/`, nested under a root `src/app/[locale]/`
  segment (required by `next-intl`'s locale-based routing).
  `src/app/[locale]/layout.tsx` is the root layout: it validates `locale`
  with `hasLocale`, defines the brand fonts (via `next/font/google`) as CSS
  variables consumed in `src/app/globals.css`, fetches the home page for the
  header logo, and wraps `children` in `NextIntlClientProvider`.
- `src/app/sitemap.ts` and `src/app/robots.ts` are metadata routes and live
  outside the `[locale]` segment; page metadata is built by
  `generateMetadata` in `src/app/[locale]/page.tsx` from the CMS `seo`
  component via `src/lib/seo.ts`.
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` — theme tokens are
  declared with `@theme` in `src/app/globals.css` rather than a
  `tailwind.config.*` file. The token table is in `AGENTS.md`.
- The `@/*` path alias (see `tsconfig.json`) resolves to `src/`.
- `src/services/` wraps the Strapi REST API (`NEXT_PUBLIC_CMS_API_URL`);
  `src/lib/` holds config/flags, media helpers, SEO helpers and the shared
  nav anchors.

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
  catalogs, namespaced per component (`Nav`, `Hero`, `LocaleSwitcher`).
  They hold **only** UI chrome — every piece of editorial copy comes from
  the CMS. Rich text uses `t.rich(...)` with tag callbacks rather than
  string concatenation.
- `src/global.d.ts` augments `next-intl`'s `AppConfig` so `Locale` and
  `Messages` are strongly typed from `src/i18n/routing.ts` /
  `src/i18n/messages/en.json`.
- `src/components/ui/locale-switcher.tsx` is a Client Component
  (`usePathname`/`useRouter` from `src/i18n/navigation` are client-only);
  it's rendered from the site header.
- After changing the `[locale]` route shape, regenerated types can go stale
  — run `npx next typegen` (or `next build`) if `tsc` reports missing/wrong
  `LayoutProps`/`PageProps` types.

Because `next@16.3.4` is newer than most training data and may include
breaking API/convention changes, consult `node_modules/next/dist/docs/`
before implementing App Router features you're not certain about — see
AGENTS.md above for details.


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:970c3bf2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
