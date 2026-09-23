---
target: classroom-web/src/app/page.tsx
total_score: 14
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
target_identity: "file:/home/rodrigo/projects/classroom/classroom-web/classroom-web/src/app/page.tsx"
timestamp: 2026-09-15T12-39-25Z
slug: classroom-web-src-app-page-tsx
closed: true
---
Method: dual-agent (A: 40df6e7c-ad46-4faa-b217-20e636d599af · B: 8d692463-c29b-41e1-85f1-8481a6ca811c)

Surface mode: Persuade. Target renders `src/components/landing/landing-page.tsx` (Locus, pt-BR classroom attendance product).

**Headline: a genuinely authored hero attached to a completely dead conversion funnel.** All off-page links 404 — `/register` (destination of all three primary CTAs), `/login`, `/privacidade`, `/termos` — and there is no `not-found.tsx`, so each lands on Next's stock English error page on a `lang="pt-BR"` site.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Compiled CSS has exactly one `:hover` rule and zero `:focus-visible` rules across 21 links. |
| 2 | Match System / Real World | 3 | Strong domain vocabulary; undercut by `O chão de fábrica da aula` (landing-page.tsx:104) and `Sem catraca` (:142). |
| 3 | User Control and Freedom | 1 | Every exit is a dead end. `scroll-behavior: smooth` (globals.css:77) unguarded by `prefers-reduced-motion`. No skip link, no `<main>`. |
| 4 | Consistency and Standards | 2 | `--text-display: 36px/40px` (globals.css:33) defined and never used; all six h2s hardcode `text-[40px] leading-[46px]`. |
| 5 | Error Prevention | 0 | All four off-page routes 404, verified over HTTP. `/register` appears 5x in the rendered DOM. |
| 6 | Recognition Rather Than Recall | 2 | Two conflicting numbered sequences: steps 01/02/03 (:37,:47,:63) then `01 — A sala`/`02 — A frequência` (:237,:262). |
| 7 | Flexibility and Efficiency | n/a | Static marketing page: no repeat-user path or expert workflow to accelerate. |
| 8 | Aesthetic and Minimalist Design | 3 | Visually restrained; cost is message redundancy (`sem operar a chamada` at :65,:97,:103; `no grito` at :319,:323,:338). |
| 9 | Error Recovery | 1 | No `not-found.tsx`; four broken links land on Next's stock English 404, unbranded, wrong language. |
| 10 | Help and Documentation | 1 | No FAQ, no pricing, no screenshot. Only help channel is a 13px footer `mailto:`; `/privacidade` 404s. |
| **Total** | | **14/36** | **Poor (39%)** |

Heuristic 7 is n/a, so max is 36. The score is almost entirely a functional verdict: strip heuristics 3, 5, 9 (all "the links don't work") and the remainder is an ordinary, decent-looking landing page.

## Design Specificity Verdict

**LLM assessment: an authored hero on a category-interchangeable body.** Real product character lives almost entirely in `hero-map.tsx`: lines 65–141 draw an actual geofence (filled 30m radius, accent ring, dashed outer boundary, seven rays to individual students), with `204` on an out-of-range student (:211) and `30 m` on the radius edge (:144). The roster at :38–45 encodes the real state machine (`Presente / Irregular / Não bateu / Recusou` at 8m, 11m, 184m); chips at :159–182 show live code `A7X-249`, countdown `08:47`, `23/40` signed. The accent/ink diptych (landing-page.tsx:222–282) is a real compositional idea.

Everything else (~85% of composition) is the stock B2B skeleton in default order: eyebrow, oversized h2, three-step how-it-works, stats strip, persona grid, competitor-rant band, closing CTA, footer. Step icons (:19–33, :41–59, :67–83) are a house, a phone with a check, a document — the three most generic icons in the category; the house reads as *home*, not *classroom setup*.

Deeper failure is interaction, not layout. The thesis is *presence verified in seconds*; total interaction budget is three anchor links and one hover color change. The hero map is a static picture of a live system. The one thing impossible to ship in another vertical — a working demo of the confirm-presence loop — is absent.

**Deterministic scan: 0 findings, exit 0 — weak evidence, not a clean bill of health.** Assessment B validated the result: no `.impeccable/` ignore config, and a probe file with deliberate anti-patterns did fire `bounce-easing`, so the TSX path is live. But the probe had ~8 anti-patterns and only 1 was caught, and the rich rule set (`--scope type,layout`) runs only in URL mode via Puppeteer, which isn't installed. The custom theme was correctly not flagged. No false positives.

**Visual overlays: none.** No browser automation, no Playwright/Puppeteer. Browser visualization, screenshots, and the `detect.js` injection overlay were all skipped. No user-visible overlay exists. All visual claims derive from source reading plus HTTP evidence against the running dev server on port 3000.

## Overall Impression

The hard part is built and the easy part skipped. The geofence hero and ink/accent diptych are the work of someone with a real point of view, and `globals.css` is disciplined enough that the components' failure to obey it reads as haste. Then the page tells a teacher her practice is `atraso` and hands her a button that 404s. Biggest opportunity is not visual: a school buyer reaches the bottom without a price, a privacy statement, a screenshot, or one named school. For a product that GPS-locates minors, the hero actively argues against you on privacy.

## What's Working

1. **The hero geofence does real explanatory work.** hero-map.tsx:65–141 diagrams the mechanism (code plus proximity, anomalies surfaced) rather than illustrating a map. Plausible distances and `23/40` make it feel observed.
2. **The diptych makes color carry meaning.** landing-page.tsx:222–282 inverts the palette across the seam — ink-on-yellow "A sala" (live) vs paper-on-ink "A frequência" (record). The inversion *is* the argument.
3. **The token layer is a genuine design system.** globals.css:4–69: ten-step scale with paired line heights, ink/paper/accent triad, dedicated on-ink ramp. `--color-on-ink-muted` #b8b9bd on ink = 8.97:1.

## Priority Issues

### [P0] The entire conversion path 404s
**What:** Verified over HTTP — `/register`, `/login`, `/privacidade`, `/termos` all 404. All three conversion CTAs point at `/register` (header.tsx:37 rendered 3x via responsive `AuthLinks` duplication, landing-page.tsx:129, :344). No `not-found.tsx`.
`/login` is a *different* problem: `git status` on `feat/landing-page` shows `src/app/login/page.tsx`, `src/app/login/login-form.tsx`, `src/app/invites/accept/page.tsx`, `src/lib/api.ts`, `src/lib/env.ts` as uncommitted deletions, and `git ls-tree HEAD` confirms they exist at HEAD. A working committed route was deleted in the working tree. `/register`, `/privacidade`, `/termos` have no history.
**Why it matters:** A Persuade surface whose single job is signup, where signup is impossible. `/privacidade` and `/termos` are legally load-bearing for a product processing minors' location data.
**Fix:** `git checkout` the five deleted files. Ship `register/`, `privacidade/`, `termos/`, plus a pt-BR `not-found.tsx`. Until `/register` exists, point CTAs at something that works.
**Suggested command:** /impeccable harden

### [P1] Nothing answers the buyer's questions at the moment of decision
**What:** No price, no free-tier framing, no product screenshot, no named school, no FAQ, no privacy statement — while GPS-locating minors is the core mechanic and `/privacidade` (:359) 404s. The only privacy-adjacent line (:294) addresses student-to-student visibility, not geolocation or retention. The hero worsens it: hero-map.tsx:44,51 renders `Luísa Torres · Recusou` in `text-danger` red (system flagging a named student for declining location) and `Carlos Lima · Irregular · 184 m` (a named minor's measured distance). Stats band (:8–10) occupies the proof slot with restated features; `1 toque` is a claim in a statistic's typography.
**Why it matters:** LGPD plus minors' data is objection #1 for a Brazilian school; cost is #2. Neither is answered, and the hero supplies ammunition for the first. No path from "interesting" to "approved".
**Fix:** Reassurance band before the closing CTA (:331), three items: pricing/free tier; LGPD block stating retention and that location is *checked and discarded* not stored as a movement trail; one real screenshot of the teacher's roll-call screen. Promote `Privacidade` out of the 13px footer. Reframe `Recusou` as a neutral state the teacher resolves.
**Suggested command:** /impeccable clarify

### [P1] The interactive layer was never designed
**What:** grep for `hover:|focus:|focus-visible:|active:|transition|motion-reduce` across landing components, globals.css, layout.tsx returns exactly one match: `hover:text-ink` (header.tsx:18). 21 links share one hover state, zero focus/active states, including all three `/register` CTAs. Focus is technically visible (outline not suppressed) but untuned, barely perceptible on `bg-ink`. Tap targets: nav links ~16px, footer links ~16px, auth buttons `h-[38px]` (header.tsx:32,38); only the three `h-[52px]` CTAs clear 44px, and on mobile nav links are the only route to sections. Non-text contrast: `1px #e4e4e4` border on `Ver a sala em operação` (:136) and `Entrar` (header.tsx:32) = **1.27:1** vs 3:1 required — the only thing separating those paper buttons from background text.
**Why it matters:** A visually confident page with no press feedback reads as a mockup, not software — wrong signal for someone deciding whether to trust you with her classroom.
**Fix:** One shared button recipe: `hover:brightness-95 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink` (`outline-accent` on ink). `hover:text-on-ink` on footer links. Auth buttons to `h-11`. `py-2.5 -my-2.5` on nav/footer links for 44px hit areas. Darken button border to >=3:1.
**Suggested command:** /impeccable polish

### [P1] Yellow means four contradictory things, so the anomaly state is invisible
**What:** `--color-accent: #ffc400` is the brand mark (logo.tsx:12), the primary CTA (:130), a positive live state (`Chamada aberta / Ao vivo`, :170–179), the step icon tiles (:205), *and* the `Irregular` anomaly state (hero-map.tsx:5,42,44). The code admits it: `statusColor.accent = "text-ink"` (hero-map.tsx:49) because accent on paper = **1.60:1**. The status the product exists to surface renders in no color, and its 8px legend dot (hero-map.tsx:230) fails WCAG 1.4.11 at 1.60:1.
Only text pair failing AA: `--color-on-ink-subtle` #7a7c81 on ink = **4.21:1**, used for 12px footer copyright (:369). All others pass: `text-muted` on paper 6.49:1, `text-ink` on accent 11.01:1, on-ink ramp 8.97:1.
**Why it matters:** In the hero, yellow rings mean *something is wrong*, yellow chips mean *this is the code*, yellow button means *click me* — within 300px. An unlearnable color system stops carrying information, and the anomaly a teacher must act on becomes the least visible thing on screen.
**Fix:** Dedicated warn token for `Irregular` (amber ~#b45309 clears 3:1 as a dot, 4.5:1 as text on paper); reserve accent for brand and action. Nudge `--color-on-ink-subtle` to ~#818388, or promote footer copyright to `--color-on-ink-muted`.
**Suggested command:** /impeccable colorize

### [P2] Flat hierarchy and a token contract nobody honors
**What:** All six h2s identical — `text-[40px] leading-[46px] font-black tracking-tight` at :191,:239,:264,:290,:318,:334 — so the closing CTA headline is indistinguishable from a mid-page section header; no crescendo. 40px stat numerals (:157) and 56px step numerals (:202) out-shout the headings above them. `--text-display: 36px/40px` (globals.css:33) defined and never referenced; nine `text-[40px]` and eight `leading-[46px]` arbitrary values stand in, alongside off-scale 11px/14px/16px/22px/32px and nine `leading-[18px]` overrides. Dead tokens: `--radius-md`, `--radius-lg`, `--color-surface`, `--color-success-surface`, `--color-danger-surface`.
Two layout defects: the `Chamada aberta` card is `xl:absolute xl:bottom-9` (:168) at `xl:w-[400px]` over a stat band reserving `xl:pr-[560px]` (:149); the stat row needs 654px while available width is `viewport − 120 − 560`, so it only fits above ~1334px — and because the band carries `md:flex-wrap`, between 1280px (the `xl` breakpoint itself) and ~1334px the stats silently wrap under the absolute yellow card. The "Quem usa" section uses `py-8` (:285) against neighbors at `pt-[88px] pb-24`, `py-[72px]`, `py-16 xl:py-20`, so it reads as an appendix.
**Why it matters:** 1280px is one of the most common laptop widths in Brazil and is exactly where the collision triggers. Flat hierarchy means nothing is memorable tomorrow.
**Fix:** Add the two steps actually used (40/46, 32/36) to `@theme`, delete arbitrary values and dead tokens. Differentiate the closing CTA headline. Put the `Chamada aberta` card in flow, or raise the guard to `min-[1360px]` and drop `flex-wrap`. Set roles section to `py-16 xl:py-20`.
**Suggested command:** /impeccable typeset, then /impeccable layout

## Cognitive Load

**6 of 8 items fail — high / critical.**

PASS: visual grouping (ink stat band, full-bleed split, paired label/value rows each read as one unit); one thing at a time (single-column narrative, one idea per band).

FAIL: single focus (first viewport has three signup-ish affordances competing with the h1 and a hero map of ~18 labeled elements); chunking (hero map holds 12 pins, 3 chips, 2 numeric labels, 4 rings, 7 rays, plus a 6-row roster with a literal `...`); visual hierarchy (six identical h2s, numerals louder than headings); minimal choices (8 interactive targets in the first `xl` viewport, three resolving to `/register` under three labels); working memory (four-status vocabulary taught once in an 11px legend, two `01/02` numbering systems fifty lines apart); progressive disclosure (nothing layered — no FAQ, no accordion, no "saiba mais", which is why four claims repeat eight times instead of deepening).

## Emotional Journey

Entry is the peak and arrives fast — the hero map earns a real "oh, I see how this works". Then descent. First valley: the stats band delivers restated features where evidence belongs; a skeptic reads that as evasion at the worst moment. Second valley is severe and self-inflicted: `Papel, chamada no grito e planilha não são tradição. São atraso.` (:319) tells a teacher — likely using paper because her school has no reliable wifi — that she is backward, twenty lines before the ask. The high-stakes moment has no reassurance: the hero CTA microcopy spends its whole budget on `Sem catraca · professor no navegador · aluno no celular`, technical trivia where commercial and legal reassurance belongs.

**Peak-end is inverted.** Last authored message is a scolding; last interaction returns Next's stock English 404. The end state is an English error page on a Portuguese product.

## Persona Red Flags

**Jordan (first-timer):** `Criar conta` → English 404 on a Portuguese site, no recovery. Step icons are `aria-hidden` line drawings with no captions; a house for "Você monta a sala" reads as *home*. Reads `01/02/03` then `01 — A sala` fifty lines later and thinks the page looped. Never learns whether students install anything — copy says `aluno no celular`, README.md:5 says `O aluno usa o app mobile`, no store links. Help = one 13px `mailto:`.

**Riley (stress tester):** Four dead routes in under a minute; will screenshot the `/privacidade` and `/termos` 404s specifically because they're the legal pages. `Ver a sala em operação` (:135) scrolls to a three-row text table while the only operational visual (the hero map) sits *above* the button — the promise moves the user away from its own fulfillment. Three labels for one destination. Long strings break fixed slots: `Coordenador pedagógico` breaks `sm:w-[168px]` at 18px bold (:300); same exposure at `w-[140px]` diptych labels (:246,:271) and `w-[180px]` stat labels (:155). Tabs the page: zero authored focus states. Reduce-motion on: still gets animated scrolling (globals.css:77 unguarded).

**Casey (one-handed mobile, slow connection):** Assets genuinely light — 12 avatars = 52KB WebP, everything else inline SVG, fonts self-hosted via `next/font` with no remote requests. But the header is `relative`, not sticky (header.tsx:48), and the only two CTAs are ~four screens apart, so interest during "A sala" has no reachable action. Mobile header stacks three rows (~130px chrome) before the h1. Tap targets fail across nav and footer. Worst: hero map is `aspect-[460/300]`, so in a ~320px column it renders ~209px tall holding twelve 40px pins plus chips plus 11px mono labels — pins overlap, labels unreadable, the hero's entire explanatory payload collapses on exactly her device.

**Brazilian public-school teacher / coordinator (project-specific):** "vou rastrear a localização de menores de idade?" is never addressed and `/privacidade` 404s. The hero answers badly: a named student flagged red for declining, another's measured distance shown. `Sem catraca` (:142) volunteers the surveillance frame the page most needs to defuse; `O chão de fábrica da aula` (:104) calls her school a factory floor. No price, no procurement path. Sample data addresses the wrong segment: `Estruturas de Dados · Turma A` is university CS while the copy and emotional pitch address basic education.

## Minor Observations

- **No Open Graph metadata.** layout.tsx:17–21 has only `title` and `description` — no `openGraph`, `twitter`, image, or `metadataBase`. For a product distributed over WhatsApp, a shared link renders as a bare gray box. Acquisition bug, not polish.
- **No `<main>` landmark.** Rendered HTML: 1 header, 1 footer, 3 nav, 6 section, 0 main. No skip-to-content target. Heading structure is otherwise correct — exactly one h1, no skipped levels.
- **Scaffold assets still shipping.** `public/` holds `next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg`; `favicon.ico` carries the scaffold timestamp, so buyers likely see a Next.js mark in the tab.
- **The `landing-stage::before` hatch is invisible where most users are.** globals.css:106–123 masks the hatch to the region outside 1440px, so at or below 1440px it paints nothing; above 1440px it's a fixed full-viewport repeating gradient repainting on scroll.
- **`overflow-x: hidden` set twice** (globals.css:78, :87). Silently breaks `position: sticky` on descendants — exactly the fix the mobile-CTA problem needs — and masks real overflow instead of preventing it.
- **Header markup rendered three times over.** `AuthLinks` at header.tsx:54,59,62 and `NavLinks` at :57,64, switched by `hidden`/`sm:`/`xl:`. Two `<nav aria-label="Seções">` landmarks with identical names, three copies of every auth link. Not an active a11y bug (hidden copies aren't focusable) but becomes one if `hidden` is swapped for `opacity-0`.
- **The hero roster is a table that isn't one.** hero-map.tsx:237–247 renders `Aluno / Status / Dist.` as plain spans over div rows; no header/cell association. The literal `...` at :267 is announced verbatim and should be `aria-hidden`.
- **One unused font weight.** layout.tsx:8 requests six Archivo weights; 800 is never used.
- **Redundant slash notation** (`text-body/body`, `text-title/title`) ~14 times. Harmless, but signals distrust of the token layer — the same instinct that produced nine hardcoded 40px headings.

## Questions to Consider

1. Your core claim is presence verified in seconds. Why can a visitor verify nothing in seconds — why is there no live day-code field that geolocates them and shows what a student sees?
2. A coordinator's first question is "you're tracking minors' locations?" Your only visual answer is a named student flagged red for refusing, and your privacy page 404s. What did you expect her to conclude?
3. Six h2s at identical weight, one of which is your closing CTA. What is the loudest element on this page, and is it what you want a teacher to remember tomorrow?
4. You defined `--text-display: 36px`, never used it, and hardcoded 40px nine times. Which is the real scale — the tokens or the components? One of them is lying.
5. `Estruturas de Dados · Turma A` says university CS. The emotional pitch says public basic education. Pick one; right now the page persuades neither.
6. What would this page look like if you deleted the "Sair do arcaico" band, the "Quem usa" grid, and the fake stats strip, and spent all three slots on price, LGPD, and one real screenshot?
