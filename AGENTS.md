<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Churro Loop — project rules

The full brief lives in `PLAN-CHURROLOOP.md`. **The Figma is the source of
truth** for measurements; this file records the decisions already implemented.

Figma: https://www.figma.com/design/iaWmmWaoyEUo5vyAAJR4PA/CHURRO-LOOP

## Design tokens

All tokens are declared with `@theme` in `src/app/globals.css` (Tailwind v4,
CSS-first — there is no `tailwind.config.*`). Never hardcode a brand colour or
a font family in a component; use the utility that reads the token.

| Token | Value | Where it came from | Use |
|---|---|---|---|
| `--color-cream` | `#FBF7EE` | client email | global page background |
| `--color-purple` | `#9900FF` | `fill` inside the brand logo SVG served by Strapi — authoritative | headings, logo, buttons, pills, arrows |
| `--color-purple-deep` | `#7A00CC` | derived | hover / active |
| `--color-yellow` | `#FAC94B` | sampled from the approved Figma exports | hero stripes, section bands, map |
| `--color-yellow-soft` | `#FCE3A4` | plan | map background |
| `--color-ink` | `#000000` | sampled from the hero standfirst | body copy |

Rules the brand follows: yellow is never a text colour, purple is never a
large-area background (buttons and pills only).

### Typography

Two families, both exposed as CSS variables by `next/font` in
`src/app/[locale]/layout.tsx` and consumed through `--font-display` /
`--font-sans`:

- **`font-display`** — high-contrast serif: logo, hero lead-ins, headlines,
  body copy inside the hero.
- **`font-sans`** — geometric sans: navigation, buttons, pills, eyebrows.

`Cormorant Garamond` and `Inter` are **placeholders**. The licensed brand
families are open point A4 in the plan; swapping them should touch only the two
`next/font` calls in the root layout.

Fluid sizes (`--text-hero-lead`, `--text-hero-body`, …) interpolate between the
two reference frames measured in Figma: **390px** and **1440px**.

### Breakpoints

Tailwind defaults, used as: base = mobile (390), `md` = tablet (768+),
`lg` = desktop (1024+). The desktop navigation only fits from `lg`, so the
hamburger + full-screen overlay covers everything below it.

### Stripes

`bg-churro-stripes` is an `@utility` driven by `--stripe-width`, set per
breakpoint on the element so the stripe *count* roughly matches the Figma
frames (~11 stripes @390, ~20 @1440):

```
[--stripe-width:2.25rem] md:[--stripe-width:3.5rem] lg:[--stripe-width:4.4375rem]
```

## Content: everything comes from Strapi

`NEXT_PUBLIC_CMS_API_URL` points at a Strapi v4 instance. The home page is the
`/churro-loop-landing` single type, fetched per locale with `populate=deep`.

- `src/services/api/*` — generic Strapi response shapes and the `fetch` wrapper.
- `src/services/home/*` — the home-page DTOs and `getHomePage(locale)`, memoised
  with React `cache` so the layout, the page and `generateMetadata` share one
  request. Revalidates every 60s under the `home` tag.
- `src/lib/media.ts` — flattens a Strapi media field into `next/image` props.

Media is served from Cloudinary; the host is allow-listed in
`next.config.ts` (`images.remotePatterns`). SVG assets are passed through
`unoptimized`.

**Copy is never hardcoded.** The only strings that live in
`src/i18n/messages/*.json` are UI chrome that the CMS does not model: the
navigation labels, the menu open/close labels and the "coming soon" notice.

## Feature flags

Read through `src/lib/config.ts`, never `process.env` in a component. See
`.env.example`. `NEXT_PUBLIC_MENU_MODE` (`hidden` | `soon` | `link`) drives the
hero CTA; `soon` is the launch default because it preserves the hero
composition.

## Structure

```
src/
  app/[locale]/{layout,page}.tsx   # root layout lives under the locale segment
  app/{sitemap,robots}.ts          # metadata routes, outside [locale]
  components/layout/               # header shell, site header, mobile menu
  components/sections/             # one file per page section
  components/ui/                   # button, wordmark, locale switcher
  i18n/                            # next-intl routing, navigation, messages
  lib/                             # config, media, navigation, seo, utils
  services/                        # CMS access
```

Section anchors (`#manifiesto`, `#proximas-aperturas`, `#donde-estamos`,
`#franquicias`, `#contacto`) are defined once in `src/lib/navigation.ts` and are
**not translated** — translating them would break shared links.

## Assets that are NOT in the CMS

Anything the CMS does not serve goes in `public/` and is listed here:

| Path | Status | Notes |
|---|---|---|
| `public/images/hero-churro.png` | **missing** | Decorative chocolate-dipped churro that bleeds off the hero. Needs a transparent PNG (or two crops: it enters from the bottom-right on desktop and from the top-right on mobile). Positioning in `src/components/sections/hero.tsx` is provisional until the real asset lands. |
| `public/og-image.png` | **missing** | 1200×630 raster for Open Graph. The CMS `seo.metaImage` is an SVG, which social platforms don't render, so `src/lib/seo.ts` falls back to this file. |
| `public/favicon.ico` / app icons | **pending** | Currently the `create-next-app` default at `src/app/favicon.ico`. |

## Accessibility and performance baseline

One `h1` per page (the hero lockup, with the wordmark's `alt` inside it).
Decorative imagery is `aria-hidden` with `alt=""`. The mobile overlay traps
focus, closes on Escape and locks background scroll. `prefers-reduced-motion` is
honoured globally in `globals.css`.

## Known CMS copy issues (report to Doblemente, don't "fix" in code)

- `hero.bodyText` (es): "EL CÁSICO DE SIEMPRE, COMO NUNCA LO HABIAS VISTO" —
  missing the `L` in "CLÁSICO" and the accent in "HABÍAS".
- `openings.openings[1].title` (es): "MY PRONTO" should be "MUY PRONTO".
- `openings.intro` (en) merges the eyebrow and the title into one string.
- `contact.instagram` is the placeholder handle `churroloopIG` (open point A6).

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

<!-- BEGIN BEADS CODEX SETUP: generated by bd setup codex -->
## Beads Issue Tracker

Use Beads (`bd`) for durable task tracking in repositories that include it. Use the `beads` skill at `.agents/skills/beads/SKILL.md` (project install) or `~/.agents/skills/beads/SKILL.md` (global install) for Beads workflow guidance, then use the `bd` CLI for issue operations.

### Quick Reference

```bash
bd ready                # Find available work
bd show <id>            # View issue details
bd update <id> --claim  # Claim work
bd close <id>           # Complete work
bd prime                # Refresh Beads context
```

### Rules

- Use `bd` for all task tracking; do not create markdown TODO lists.
- Run `bd prime` when Beads context is missing or stale. Codex 0.129.0+ can load Beads context automatically through native hooks; use `/hooks` to inspect or toggle them.
- Keep persistent project memory in Beads via `bd remember`; do not create ad hoc memory files.

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.
<!-- END BEADS CODEX SETUP -->
