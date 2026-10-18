# Roadmap

Estimates are working hours for one person and include tests, docs and demo pages. They are planning numbers, not commitments. Total remaining estimate: **about 98 hours** (range 80 to 125).

Status of the first milestone reflects what is in the repository today.

## Milestone 0: Foundation (done)

- [x] Token set: colour (light and dark), type scale, space, layout, shape, motion
- [x] Cascade layer architecture, reset, base typography, layout primitives
- [x] Buttons, tags, form controls
- [x] First variant of every pattern group; second variant for headers, heroes and portfolio cards
- [x] JavaScript: nav, carousel, filter, lightbox, theme toggle, autoInit
- [x] Tooling: Vite multi-page demo and library build, Stylelint, html-validate, Vitest, axe-core check, CI
- [x] Initial documentation and decision records
- [x] GitHub Pages workflow that builds and deploys the demo site from CI

## Milestone 1: More variants (about 28 hours)

- [ ] Headers: overlay header for use on top of a full-bleed hero; off-canvas menu variant (4 h)
- [ ] Heroes: video hero with poster image and pause control; split hero with large name typography (4 h)
- [ ] About: timeline variant; short "now" section (3 h)
- [ ] Services: pricing or package cards; process steps (4 h)
- [ ] Portfolio: list-style index (title, year, discipline rows with hover preview); masonry layout using CSS grid lanes when supported (5 h)
- [ ] Case study: before / after comparison, embedded video block, credits list (4 h)
- [ ] Blog: featured post card, tag index page, table of contents for long posts (2 h)
- [ ] Testimonials and client logo strip (2 h)

## Milestone 2: Theming guide (about 10 hours)

- [ ] Write docs/theming.md: overriding tokens, local themes on a section, adding a brand font (3 h)
- [ ] Ship two or three alternate token sets as examples (for example "ink" and "studio") (3 h)
- [ ] Theme switcher in the demo site to preview token sets (2 h)
- [ ] Contrast test coverage for alternate token sets (2 h)

## Milestone 3: Drupal theme integration examples (about 22 hours)

All Drupal material lives under `examples/drupal/` as documentation and sample files. The library itself stays free of Drupal code and of any GPL-licensed code.

- [ ] Sample `*.libraries.yml` mapping `dist/css/core.css`, each pattern file and each JS module to a library (2 h)
- [ ] Twig examples for `page.html.twig` regions: header, footer, branding block, main menu (`menu--main.html.twig`) (5 h)
- [ ] Twig examples for portfolio nodes: teaser view mode as `.oo-card` and `.oo-tile`, full view mode as the case study (5 h)
- [ ] Twig examples for articles: teaser as `.oo-post-summary`, full as `.oo-article` (3 h)
- [ ] Views example for the filterable portfolio grid using taxonomy terms as filter tags (4 h)
- [ ] Behaviors wrapper example (`Drupal.behaviors`) calling `autoInit(context)` (1 h)
- [ ] Review licensing note: Twig examples are written fresh and published as documentation (2 h)

## Milestone 4: Package publishing (about 8 hours)

- [ ] Decide package name and scope on npm; remove `"private": true` (1 h)
- [ ] Add minified CSS outputs and source maps alongside readable files (2 h)
- [ ] Add `types` (JSDoc-generated `.d.ts`) for the JS modules (2 h)
- [ ] Release workflow: tag, changelog section, `npm publish --provenance` from CI (2 h)
- [ ] First tagged release, 0.1.0 (1 h)

## Milestone 5: Visual regression and browser testing (about 16 hours)

- [ ] Add Playwright (Apache-2.0) as a dev dependency; run axe-core in real Chromium, Firefox and WebKit so colour contrast and focus order are checked on rendered pages (5 h)
- [ ] Screenshot tests for every demo page in light and dark themes at three widths (5 h)
- [ ] Keyboard journey tests: open and close the menu, page the carousel, use the lightbox, filter the grid (4 h)
- [ ] Print snapshot of the resume page (2 h)

## Milestone 6: Documentation site (about 14 hours)

- [ ] Turn the demo into a documentation site: per-pattern pages with live example, markup snippet with copy button, and class reference (8 h)
- [ ] Token reference page generated from `tokens.css` (3 h)
- [ ] Accessibility notes per pattern (keyboard map, screen reader behaviour) (3 h)

## Ideas, not scheduled

- RTL demo page and review of every pattern in `dir="rtl"`.
- View transitions between portfolio grid and case study.
- A small set of optional icons as standalone SVG files.
