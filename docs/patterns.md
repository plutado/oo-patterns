# Pattern inventory and usage

Every pattern below has a demo page in `demo/`. The demo pages are the reference markup: copy from them. This document lists the class names, the files involved and the parts of the markup that behaviour depends on.

Conventions:

- Class names follow `oo-block__element--modifier`.
- Data attributes starting `data-oo-` are hooks for JavaScript. Attributes ending `-ready` or `-open` are set by scripts; do not write them in markup.
- Patterns that size themselves with container queries are marked "container". They adapt to the width of their own box, not the viewport, so they work in sidebars and narrow columns.

| Group | Demo | CSS file | JS |
| --- | --- | --- | --- |
| Foundations | `demo/foundations.html` | `core.css` | none |
| Headers | `demo/headers.html` | `patterns/header.css` | `nav.js`, `theme.js` |
| Heroes | `demo/heroes.html` | `patterns/hero.css` (+ carousel in `core.css`) | `carousel.js` |
| About | `demo/about.html` | `patterns/about.css` | none |
| Services | `demo/services.html` | `patterns/features.css` | none |
| Portfolio | `demo/portfolio.html` | `patterns/portfolio.css` (+ lightbox in `core.css`) | `filter.js`, `lightbox.js` |
| Case study | `demo/case-study.html` | `patterns/case-study.css` | `lightbox.js` |
| Blog | `demo/blog.html`, `demo/blog-post.html` | `patterns/blog.css` | none |
| Resume | `demo/resume.html` | `patterns/resume.css` | none |
| Contact and footer | `demo/contact.html` | `patterns/contact.css`, `patterns/footer.css` | none |

## Foundations (core.css)

- **Layout:** `.oo-container` (centred, max width plus gutters), `.oo-section` and `.oo-section--alt`, `.oo-section__head` (`--center`), `.oo-stack`, `.oo-cluster`, `.oo-visually-hidden`, `.oo-skip-link`.
- **Type:** headings use the display font; `.oo-prose` for long-form content; `.oo-lead`; `.oo-eyebrow`.
- **Buttons:** `.oo-button` with `--secondary`, `--ghost`, `--sm`, `--lg`, `--icon`. Works on `<a>` and `<button>`. `.oo-link-arrow` for text calls to action. `.oo-tag` for labels.
- **Forms:** `.oo-form`, `.oo-form__row` (two columns when wide), `.oo-field`, `.oo-label`, `.oo-input`, `.oo-select`, `.oo-textarea`, `.oo-choice` (checkbox or radio with label), `.oo-fieldset`, `.oo-hint`, `.oo-error`. Mark invalid fields with `aria-invalid="true"` and link the error with `aria-describedby`.

## Headers and navigation (container)

Variants: `.oo-header` (split) and `.oo-header.oo-header--centered`. Modifier: `--sticky`.

Required structure:

```html
<header class="oo-header" data-oo-nav>
  <div class="oo-header__inner oo-container">
    <a class="oo-header__brand" href="/">Name</a>
    <div class="oo-header__actions">
      <button type="button" class="oo-header__toggle" data-oo-nav-toggle
              aria-controls="site-nav" aria-expanded="false">
        <span class="oo-header__bars" aria-hidden="true"></span>
        <span class="oo-visually-hidden">Menu</span>
      </button>
    </div>
    <nav class="oo-header__nav" id="site-nav" aria-label="Primary">
      <ul class="oo-header__list">
        <li><a href="/work" aria-current="page">Work</a></li>
      </ul>
    </nav>
  </div>
</header>
```

Behaviour (`nav.js`): the toggle is hidden until the script runs, so without JavaScript the links are always visible. The menu collapses when the header is narrower than 52rem. Escape closes the menu and returns focus to the toggle; clicking outside or following a link also closes it. Mark the current page with `aria-current="page"`. The centred variant can show an optional `.oo-header__tagline`.

Theme toggle (`theme.js`): `<button class="oo-theme-toggle" data-oo-theme-toggle aria-pressed="false" aria-label="Dark theme">` with two SVG icons classed `oo-theme-toggle__sun` and `oo-theme-toggle__moon`.

## Heroes

**Statement** (`.oo-hero`, container): `.oo-hero__grid` with `.oo-hero__content` (optional `.oo-hero__availability`, `.oo-hero__title`, `.oo-hero__intro`, `.oo-hero__actions`) and `.oo-hero__art` (image plus optional `.oo-hero__badge`). Use `<h1>` for the title on a real page. `<em>` in the title is set in the accent colour.

**Slider** (`.oo-hero-slider.oo-carousel`): built on the carousel component.

```html
<section class="oo-hero-slider oo-carousel" data-oo-carousel data-oo-autoplay="7000"
         aria-label="Featured projects">
  <div class="oo-carousel__viewport">
    <div class="oo-carousel__track">
      <div class="oo-carousel__slide">
        <img class="oo-hero-slider__media" src="..." alt="">
        <div class="oo-hero-slider__caption">
          <div class="oo-hero-slider__text oo-container">...</div>
        </div>
      </div>
    </div>
  </div>
  <div class="oo-carousel__bar">
    <div class="oo-carousel__bar-inner oo-container">
      <button type="button" class="oo-carousel__button" data-oo-carousel-prev aria-label="Previous slide">...</button>
      <button type="button" class="oo-carousel__button" data-oo-carousel-next aria-label="Next slide">...</button>
      <ol class="oo-carousel__dots" data-oo-carousel-dots></ol>
      <button type="button" class="oo-carousel__button oo-carousel__play" data-oo-carousel-play
              aria-pressed="false" aria-label="Play slideshow">pause icon, play icon</button>
    </div>
  </div>
</section>
```

Behaviour (`carousel.js`): without JavaScript the slides are a horizontally scrollable, snap-aligned row. With it, one slide shows at a time, inactive slides are `inert`, dots are generated, arrow keys page, and slide labels ("2 of 3") are added. Autoplay (`data-oo-autoplay` in milliseconds) pauses on hover and focus, can be stopped with the play button, and never starts under `prefers-reduced-motion`. Only use primary buttons on the overlay; secondary buttons assume a page background.

## About (container)

`.oo-about` > `.oo-about__grid` with `.oo-about__portrait` (figure) and `.oo-about__content`. Quick facts are a description list: `dl.oo-about__facts` > `div.oo-about__fact` > `dt` (label) + `dd` (number); the number displays above its label visually but reads label first. Skills are `ul.oo-about__skills`.

## Services and features (container)

`.oo-features` > `ul.oo-features__list` > `li` > `article.oo-feature` with `.oo-feature__icon` (decorative SVG, `aria-hidden`), `.oo-feature__title`, `.oo-feature__text` and optional `ul.oo-feature__list` or `.oo-feature__number`. One column, then two at 36rem, three at 60rem of container width.

## Portfolio

**Grid:** `ul.oo-portfolio-grid` (auto-fill, 18rem minimum). Modifiers: `--wide` makes the first item span the full row; `--masonry-ish` varies tile heights.

**Framed card** (`.oo-card`, container per grid item): `.oo-card__media`, `.oo-card__body`, `.oo-card__meta`, `.oo-card__title` (contains the only link), `.oo-card__summary`. The title link is stretched over the whole card, so the card is one tab stop; the focus ring is drawn on the card. When a card is 40rem or wider it lays out side by side.

**Overlay tile** (`.oo-tile`): image `.oo-tile__media` with `.oo-tile__caption` (`.oo-tile__category`, `.oo-tile__title`) over a scrim. The title is always visible; hover only zooms the image.

**Filter** (`filter.js`):

```html
<div class="oo-filter" data-oo-filter data-oo-filter-noun="project">
  <div class="oo-filter__controls" role="group" aria-label="Filter projects">
    <button type="button" class="oo-filter__button" data-oo-filter-value="all" aria-pressed="true">All</button>
    <button type="button" class="oo-filter__button" data-oo-filter-value="motion" aria-pressed="false">Motion</button>
  </div>
  <p class="oo-filter__count" data-oo-filter-status aria-live="polite"></p>
  <ul class="oo-portfolio-grid">
    <li data-oo-filter-tags="identity motion">...</li>
  </ul>
</div>
```

Tags are space-separated. Controls and the count are hidden until the script runs. The count is announced politely ("Showing 3 projects").

**Lightbox** (`lightbox.js`): any `<a href="large-image" data-oo-lightbox="group-name" data-oo-caption="...">` wrapping an `<img>`. Links with the same group name page together. Uses a native `<dialog>` (focus is contained, Escape closes, focus returns to the link). Arrow keys page. Modified clicks (open in new tab) are left alone. Without JavaScript the link opens the image.

## Case study (container)

`article.oo-case` with `.oo-case__header` (eyebrow, `.oo-case__title`, lead, `dl.oo-case__meta`), `figure.oo-case__cover`, `.oo-case__body` (`aside.oo-case__aside` with `.oo-case__toc`, plus an `.oo-prose` column), `.oo-case__results` / `.oo-case__result`, `ul.oo-case__gallery` (lightbox links) and a `nav.oo-pager`. From 60rem the aside becomes a sticky side column.

**Pager** (`core.css`): `nav.oo-pager` > `a.oo-pager__link` (`--next` aligns right) with `.oo-pager__label` and `.oo-pager__title`. Give each pager nav a distinct `aria-label`.

## Blog

**List:** `ul.oo-post-list` > `li` > `article.oo-post-summary` (container) > `.oo-post-summary__layout` with `.oo-post-summary__media` and `.oo-post-summary__body` (`__meta` with `<time datetime>`, `__title`, `__excerpt`). Side by side from 44rem.

**Post:** `.oo-article__header` (tag, `<h1>`, lead, `.oo-article__byline`), `figure.oo-article__cover`, `.oo-article__body.oo-prose`, `aside.oo-author` and a pager.

## Resume (container, print)

`article.oo-resume` with `header.oo-resume__header` (`__name`, `__role`, `ul.__contact`), then `section.oo-resume__section` blocks, each with an `h2.oo-resume__heading`. Entries: `ol.oo-resume__entries` > `li.oo-resume__entry` > `.oo-resume__entry-head` (`__entry-title`, `__org`, `__dates` with `<time>`) plus a bullet list. Skills: `dl.oo-resume__skills`.

Print styles hide the site header, footer, `.oo-resume__actions` and anything with `.oo-no-print`, switch to black on white, avoid breaking entries across pages, and print full URLs after external contact links.

## Contact and footer (container)

**Contact:** `.oo-contact` > `.oo-contact__grid` with `.oo-contact__intro` (heading, lead, `dl.oo-contact__details`) and `.oo-contact__form` (an `.oo-form`). The library does not handle submission.

**Footer:** `footer.oo-footer` > `.oo-container` > `.oo-footer__top` (`.oo-footer__cta`, `nav.oo-footer__columns` with `.oo-footer__heading` and `ul.oo-footer__links`) and `.oo-footer__bottom`.

## JavaScript API summary

All modules are in `dist/js/` (source in `src/js/`).

| Function | Module | Returns |
| --- | --- | --- |
| `autoInit(scope?)` | `oo.js` | Instances by component; safe to call repeatedly |
| `initNav(root)` | `nav.js` | `{ open, close, destroy }` |
| `initCarousel(root, { autoplay?, reducedMotion? })` | `carousel.js` | `{ goTo, next, prev, play, pause, index, playing, destroy }` |
| `initFilter(root, { onChange? })` | `filter.js` | `{ apply, value, destroy }` |
| `initLightbox(scope?, links?)` | `lightbox.js` | `{ open, close, index, dialog, destroy }` |
| `initThemeToggle(button)`, `setTheme(theme)`, `currentTheme()` | `theme.js` | |
