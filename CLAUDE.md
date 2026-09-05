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

This is a Next.js App Router project (`next@16.3.4`, React 19) currently at the
`create-next-app` starting point — `app/page.tsx` is still the default scaffold
page, with no routes, components, or API handlers added beyond it.

- Routing lives under `app/`; `app/layout.tsx` is the root layout and defines
  the `Geist`/`Geist Mono` fonts (via `next/font/google`) as CSS variables
  consumed in `app/globals.css`.
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` — theme tokens are
  declared with `@theme inline` in `app/globals.css` rather than a
  `tailwind.config.*` file.
- The `@/*` path alias (see `tsconfig.json`) resolves to the repo root.
- `.env` defines `NEXT_PUBLIC_CMS_API_URL`, indicating a headless CMS
  integration is planned, though no code references it yet.

Because `next@16.3.4` is newer than most training data and may include
breaking API/convention changes, consult `node_modules/next/dist/docs/`
before implementing App Router features you're not certain about — see
AGENTS.md above for details.
