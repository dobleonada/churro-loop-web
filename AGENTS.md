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

### Hero height

The hero declares `--hero-h: min(100svh, 900px)` and uses it as its
`min-height`: full viewport height, capped at 900px so it doesn't stretch on
tall desktop screens. The decorative churro is sized off the same variable, so
the composition scales as one piece.

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
`.env.example`. `NEXT_PUBLIC_MENU_MODE` (`link` | `soon` | `hidden`) drives the
hero CTA. `link` is the default since the client sent the menu on 9 Nov 2026:
"VER CARTA" opens the menu PDF of the page locale in a new tab —
`public/carta-churroloop.pdf` (es) or `public/carta-churroloop-en.pdf` (en),
see `MENU_PDF` / `menuUrl` in `src/lib/config.ts` — unless
`NEXT_PUBLIC_MENU_URL` overrides it for every locale.
The CMS `hero.cta.url` is not read. An environment that sets
`NEXT_PUBLIC_MENU_MODE=soon` keeps showing "Disponible muy pronto" instead;
Vercel only defines `NEXT_PUBLIC_CMS_API_URL`, so it gets the defaults.

The store map is **not** a flag. Whether it renders is the `SHOW_MAP` constant
at the top of `src/components/sections/store-map.tsx` (`true` since 9 Nov
2026): one line to flip, no environment involved. It needs no credentials
either — see the basemap below.

### Store map

`src/components/sections/store-map.tsx` is the only thing that touches
MapLibre, through `next/dynamic` with `ssr: false`, so `maplibre-gl` and its
stylesheet stay in a lazy chunk (~1 MB minified), fetched only once the map
renders.

The basemap is **OpenFreeMap** (free, no API key, commercial use allowed;
OpenStreetMap data, attribution behind the compact "i"). It replaced the
MapTiler style the client supplied, which needed an API key from their
account. The brand style is `public/map/churroloop-style.json`, generated by
`node scripts/build-map-style.mjs` from OpenFreeMap's Positron with the
colours sampled from the 9 Nov Figma frame (land `#FDEDB2`, sea `#FFF9E6` —
deliberately not the page cream, so the frame edge still reads). Edit the
colours in the script and re-run it; do not hand-edit the JSON. At runtime the
canvas switches place names to the page locale (`name:es` / `name:en`) and
hides the basemap label of every pinned city, which its pin already names.

Each pin carries a purple label with the city and its opening date — the CMS
`openings` `location` and `title` — so the map always says what the carousel
says, and an opening deleted in Strapi loses its pin too. The canvas container
is sized with `h-full`, never `absolute inset-0`: MapLibre's stylesheet forces
`.maplibregl-map` to `position: relative`, which collapses the latter to 0px.

Geodata lives in `src/lib/locations.ts`, not in the CMS: the `openings`
component has no coordinates. Cities are matched by accent-insensitive name,
and a city with no entry silently gets no pin. The framing is one
`fitBounds`: `IBERIA_BOUNDS` (whole peninsula) for the landscape frame,
`PORTRAIT_BOUNDS` (Portugal cropped, up to Barcelona) for the portrait one on
mobile, as the two Figma frames do.

## Under construction curtain (temporary)

Asked for by the client on 10 Sep 2026 (`churro-loop-web-71v`): `/` and `/en`
show an "under construction" page instead of the landing, and the landing is
revealed by a shared password typed on that page.

It is deliberately **not** a feature flag and **not** a new route — the landing
stays at `/`, so nothing about the site structure changes and reverting is a
delete, not a move:

| Piece | What it does |
|---|---|
| `src/lib/preview.ts` | The password (`churroloop2026`), the `churro-preview` cookie (httpOnly, 7 days) and `isPreviewUnlocked()` |
| `src/lib/preview-action.ts` | The Server Action behind the form: checks the password, sets the cookie, redirects back to `/` in the visitor's locale |
| `src/components/sections/under-construction.tsx` | The curtain itself — stripes, CMS lockup, `UnderConstruction` messages, the ES/EN switcher |
| `src/components/sections/preview-gate.tsx` | The password field (`useActionState`; it also works with JS off) |

To open the site: delete those four files, the `UnderConstruction` namespace in
`src/i18n/messages/*.json`, the `isPreviewUnlocked()` check at the top of
`src/app/[locale]/page.tsx` and the `unlocked &&` guards around the header and
footer in `src/app/[locale]/layout.tsx`. Nothing else references them.

Two things to know while it is up:

- The chrome (header + footer) is not rendered while the curtain is up, on any
  page — the layout reads the cookie, not the route. The legal pages therefore
  render bare, and because the layout reads a cookie they are server-rendered
  on demand instead of prerendered. Both go back to normal when the curtain
  comes down.
- The password is a curtain, not a security boundary: it is shared, and it is
  compiled into the server bundle. Nothing genuinely private may go behind it.

## Structure

```
src/
  app/[locale]/{layout,page}.tsx   # root layout lives under the locale segment
  app/{sitemap,robots}.ts          # metadata routes, outside [locale]
  components/layout/               # header shell, site header, mobile menu, footer
  components/sections/             # one file per page section
  components/ui/                   # button, wordmark, locale switcher, icons
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
| `public/images/churro-marker.png` | present | 112×182 RGBA, `hero-churro.png` downscaled ×10 (12 kB instead of 750 kB). The map pin: the asset already leans ~19° right, which is the tilt the Figma frame shows, so it is placed unrotated. Its lower tip sits at 39%/88.5% of the box — that is the `TIP` constant in `store-map-canvas.tsx`. |
| `public/carta-churroloop.pdf` | present | The Spanish menu, `CartaChurroLoopWeb_SP.pdf` from the 13 Nov 2026 email (5.7 MB; replaced the 9 Nov version). Opened by the hero "VER CARTA" button on `/`; see `MENU_PDF`. |
| `public/carta-churroloop-en.pdf` | present | The English menu, `CartaChurroLoopWeb_ENG.pdf` from the 13 Nov 2026 email (5.7 MB). Opened by "VIEW MENU" on `/en`. |
| `public/images/hero-churro.png` | present | 1120×1815 RGBA. One asset for both breakpoints: desktop uses it as-is, mobile mirrors it horizontally (`-scale-x-100`). Scale and offsets in `src/components/sections/hero.tsx` were calibrated by matching the shaft width against the mockups; see the comment on `HeroChurro`. |
| `public/og-image.png` | **not needed** | The CMS now serves `OG IMAGE.png` (1200×600) on `seo.metaImage`, so this fallback is dead code. `src/lib/seo.ts` still falls back to it if `metaImage` ever goes back to being a vector. |
| `src/app/favicon.ico` | present | The brand "C" in purple on transparent, one 256×256 PNG inside the ICO. Still missing `apple-icon.png` (180×180) and hand-drawn 16/32 versions — the stroke is 17px of 256, i.e. ~1px once the browser scales it to a 16px tab. See `churro-loop-web-hcn.4`. |

## Accessibility and performance baseline

One `h1` per page (the hero lockup, with the wordmark's `alt` inside it).
Decorative imagery is `aria-hidden` with `alt=""`. The mobile overlay traps
focus, closes on Escape and locks background scroll. `prefers-reduced-motion` is
honoured globally in `globals.css`.

## CMS changes from the 9 Nov 2026 email (`churro-loop-web-mgk`, applied)

Applied through the Strapi REST API on 10 Nov 2026, in both locales:

- Gallery: the 2nd image (the churro close-up, id 842) replaced by the two
  ice-cream cups (`churro loop helados.png`, id 858).
- "CHURRO LOOP" → "CHURROLOOP" in every text field; the manifesto sign-off is
  "**ChurroLoop.**" as the Figma typesets it, and `seo.metaTitle` is
  "ChurroLoop" (was the "Churo Loop" typo).
- `openings.intro`: "PRÓXIMAS APERTURAS LOCALES" / "UPCOMING STORE OPENINGS".
- `openings.openings`: BILBAO "ABRIL 2027" / "APRIL 2027", then MÁLAGA,
  VALENCIA, BURGOS "MUY PRONTO 2027" / "COMING SOON 2027"; SEVILLA deleted.
- VALENCIA image → `churro loop valencia 2027.png` (id 859, the Ciudad de las
  Artes y las Ciencias).
- `contact.instagram` → `churroloopcompany`.
- `hero.cta.url` → `https://churroloop.com/carta-churroloop.pdf` (was a
  `www.google.es` placeholder). The front still links to `MENU_PDF`: the
  Cloudinary account answers 401 to PDF delivery, so the menu cannot live in
  the CMS media library.
- English only: `loops.title` translated ("FIND YOUR NEAREST CHURROLOOP"),
  the `**` removed from `franchiseCta.title` and `contact.title`, and the two
  loop photos added to `es` in September (ids 856, 857) added to `en` too.

## Known CMS copy issues (report to Doblemente, don't "fix" in code)

Last checked against the live API on 10 Nov 2026, after the changes above:

- Every image in the single type has an empty `alternativeText` (the two
  uploaded on 10 Nov included).
- The manifesto copy differs slightly from the Figma ("El chocolate con
  churro es una de ellas", no full stop, vs "churros … ellas."). Not part of
  any request, so left as is.
- The two Figma frames disagree on the contact address: the mobile one shows
  `info@churroloop.com`, the desktop one `marta@churroloop.com`. The desktop
  one is right — the mobile frame predates the 3 Sep 17:21 email that asked for
  the personal address — and the CMS agrees.

Checked against `/legal-pages-churro-loops` on 8 Sep 2026, all of it open:

- The whole legal corpus is still Doblemente's own: it names "DOBLE –
  Doblemente Media SL", NIF B87114054 and `hola@wearedoble.com` as the owner
  of churroloop.com. That is `churro-loop-web-65m.1` (A7) and it blocks
  publishing the pages.
- No English entries exist at all (`?locale=en` → `[]`).
- All three `seo.metaTitle` read "Churo Loop" — one typo, three duplicate
  titles.
- `politica-de-cookies` block 4 has an empty `title`.

## The two email addresses are deliberate

They are not a mix-up, and neither is hardcoded:

| Where | Address | CMS field | Why |
|---|---|---|---|
| "QUIERO MÁS INFORMACIÓN" | `info@churroloop.com` | `franchiseCta.franchbutton.redirectTo` | Email 1 of the brief: the franchise button opens a mail to the generic alias, which forwards to the three people at Doblemente |
| Contacto | `marta@churroloop.com` | `contact.email` | Email 8: "PON DE CONTACTO EL MIO". Also the JSON-LD `Organization` email |

Both mailboxes have to exist before launch (`churro-loop-web-sc7`).

## Footer

`src/components/layout/site-footer.tsx` renders from the root layout, so the
legal pages inherit it. It uses **both** CMS lockups, because the design does:
`hero.media` (stacked, 583×274) below `md`, `contact.logo` (horizontal,
1399×233) from `md` up, each running to 8px of the edge on mobile and 16px on
desktop.

The three legal links come from `LEGAL_LINKS` (`src/lib/navigation.ts`) and go
through the locale-aware `Link`, so they keep the visitor's language.

## Header links go to the home page, not to a hash

The header and the mobile menu render on the legal pages too, so the section
anchors are `Link href="/#manifiesto"` (via `homeAnchor`), never a bare
`href="#manifiesto"`: a bare hash resolves against the current URL and does
nothing on `/legal/...`. From the home page the same link still just scrolls.

## Legal pages

`src/app/[locale]/legal/[slug]/page.tsx`, one route for the three pages, each
prerendered per locale by `generateStaticParams` from `LEGAL_LINKS`.

- Content type: the `/legal-pages-churro-loops` **collection** (not a single
  type), filtered by its `slug` field — `filters[slug][$eq]` — which is the
  only stable identifier; the numeric ids are not stable across environments.
  `src/services/legal/*` holds the DTOs and `getLegalPage(locale, slug)`,
  memoised with React `cache` and revalidated hourly under the `legal` tag.
- The three slugs are `aviso-legal`, `politica-de-cookies` and
  `politica-de-privacidad`. They are **not** translated, contrary to what the
  original plan assumed: Strapi holds a single Spanish entry per page, so an
  English slug would have no content behind it.
- Shape: `slug`, the same `seo` component the home page uses, and `legalText`,
  a repeatable component of `{ title, text }` clauses. `title` is nullable
  (one cookie-policy block continues the clause above it) and `text` is the
  same Markdown subset `Markdown` renders. There is no page-title field, so
  the `h1` and the footer label both come from the `Legal` message namespace.
- `seo.metaTitle` is identical ("Churo Loop", with the typo) on all three
  entries, so `generateMetadata` substitutes the page name and keeps the rest
  of the CMS `seo` component. Do not "fix" the CMS copy in code beyond that.
- **The English locale is empty** (`GET …?locale=en` returns `[]`), so
  `getLegalPage` falls back to the default locale and the page marks the copy
  `lang="es"`. A legal page must be reachable in every language; delete the
  fallback once the localisations land.

<!-- BEGIN  INTEGRATION v:1 profile:minimal hash:970c3bf2 -->
##  Issue Tracker

This project uses **bd ()** for issue tracking. Run `bd prime` to see full workflow context and commands.

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

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `./issues.jsonl` is a passive export. See https://github.com/gastownhall//blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed  block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close , run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a  implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create  for anything that needs follow-up
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
- Explicit user or orchestrator instructions override this  block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END  INTEGRATION -->

<!-- BEGIN  CODEX SETUP: generated by bd setup codex -->
##  Issue Tracker

Use  (`bd`) for durable task tracking in repositories that include it. Use the `` skill at `.agents/skills//SKILL.md` (project install) or `~/.agents/skills//SKILL.md` (global install) for  workflow guidance, then use the `bd` CLI for issue operations.

### Quick Reference

```bash
bd ready                # Find available work
bd show <id>            # View issue details
bd update <id> --claim  # Claim work
bd close <id>           # Complete work
bd prime                # Refresh  context
```

### Rules

- Use `bd` for all task tracking; do not create markdown TODO lists.
- Run `bd prime` when  context is missing or stale. Codex 0.129.0+ can load  context automatically through native hooks; use `/hooks` to inspect or toggle them.
- Keep persistent project memory in  via `bd remember`; do not create ad hoc memory files.

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `./issues.jsonl` is a passive export. See https://github.com/gastownhall//blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.
<!-- END  CODEX SETUP -->
