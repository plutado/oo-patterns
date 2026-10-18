# Using oo-patterns from a Drupal theme

This is guidance only. The library has no Drupal dependency and contains no Drupal code. A Drupal theme consumes the built files in `dist/` the same way any site would, and its Twig templates output the markup documented in [patterns.md](patterns.md).

Worked Twig examples are planned for a later milestone (see [ROADMAP.md](../ROADMAP.md), Milestone 3). They will be written from scratch and kept as documentation under `examples/drupal/`, separate from the shipped library.

## 1. Get the files into the theme

Pick one:

- **Copy** `dist/css` and `dist/js` into the theme, for example `themes/custom/mytheme/vendor/oo-patterns/`. Simple; update by copying again.
- **npm** (once the package is published): add it to the theme's `package.json` and copy `node_modules/oo-patterns/dist` into the theme during the theme's own build.

Keep the library files unmodified and put site-specific CSS in the theme's own stylesheets. Because the library sits in cascade layers, the theme's unlayered CSS overrides it without specificity fights.

## 2. Declare libraries

A sketch of `mytheme.libraries.yml`:

```yaml
oo-core:
  css:
    base:
      vendor/oo-patterns/css/core.css: { minified: false }

oo-header:
  css:
    component:
      vendor/oo-patterns/css/patterns/header.css: {}
  dependencies:
    - mytheme/oo-core

oo-portfolio:
  css:
    component:
      vendor/oo-patterns/css/patterns/portfolio.css: {}
  dependencies:
    - mytheme/oo-core

oo-js:
  js:
    vendor/oo-patterns/js/oo.js: { attributes: { type: module }, preprocess: false }
    js/oo-behaviors.js: { attributes: { type: module }, preprocess: false }

global:
  css:
    theme:
      css/site.css: {}
  dependencies:
    - mytheme/oo-core
    - mytheme/oo-header
    - mytheme/oo-js
```

Notes:

- Use `core.css` plus per-pattern files so pages only load what they render. Attach pattern libraries from the templates that use them with `{{ attach_library('mytheme/oo-portfolio') }}`. Alternatively attach `oo.css` once if simplicity matters more than bytes.
- The JS files are ES modules. Mark them `type: module` and set `preprocess: false`, because Drupal's JS aggregation concatenates files and would break `import` statements. The other modules (`nav.js`, `filter.js` and so on) must sit next to `oo.js` so its relative imports resolve.
- Keep the `@layer` order: `core.css` must load before any pattern file. Drupal's `base` / `component` / `theme` CSS groups load in that order, which matches.

## 3. Initialise with a behavior

Drupal inserts markup after page load (BigPipe, AJAX views, dialogs). `autoInit` accepts a scope and only wires elements once, so it maps directly onto a behavior. A sketch of `js/oo-behaviors.js`:

```js
import { autoInit } from '../vendor/oo-patterns/js/oo.js';

Drupal.behaviors.ooPatterns = {
  attach(context) {
    autoInit(context);
  },
};
```

## 4. Map patterns to templates

Twig templates render the pattern markup with Drupal data. Suggested mapping:

| Pattern | Drupal template |
| --- | --- |
| Header | `page.html.twig` header region, `block--system-branding-block.html.twig`, `menu--main.html.twig` |
| Footer | `page.html.twig` footer region, `region--footer.html.twig`, `menu--footer.html.twig` |
| Statement hero | A block type or paragraph type, `block--bundle--hero.html.twig` |
| Slider hero | A view of featured projects, `views-view-unformatted--featured.html.twig` |
| About | Basic page with fields, or a paragraph type |
| Feature grid | A paragraph type with a multi-value "feature" paragraph |
| Portfolio card / tile | Project content type, teaser view mode: `node--project--teaser.html.twig` |
| Filterable grid | A view of projects; `views-view-unformatted--projects.html.twig` with tags from a taxonomy field |
| Case study | `node--project--full.html.twig` |
| Blog list | A view of articles, `node--article--teaser.html.twig` |
| Blog post | `node--article--full.html.twig` |
| Resume | Basic page with structured fields, or a dedicated content type |
| Contact | Webform or core Contact form rendered inside `.oo-contact__form` |

Tips:

- Add pattern classes in Twig with `attributes.addClass('oo-card')` rather than wrapping Drupal's markup in extra elements where possible.
- For the filter, print taxonomy term machine names (or cleaned labels) into `data-oo-filter-tags`, and generate one filter button per term.
- Form elements: add `oo-input`, `oo-select`, `oo-textarea` classes in `input.html.twig`, `select.html.twig` and `textarea.html.twig`, and `oo-field` / `oo-label` in `form-element.html.twig` and `form-element-label.html.twig`.
- Use responsive image styles for `.oo-card__media img` and friends; the CSS only assumes an `<img>` and sets `aspect-ratio` and `object-fit`.
- Keep `aria-current="page"` on active menu links; Drupal's `is-active` class alone is not exposed to assistive technology.

## Licensing

oo-patterns is MIT licensed. Drupal is GPL-2.0-or-later. A Drupal theme that uses this library is a GPL-licensed work, and MIT code may be included in it. The reverse is not true, so Drupal code and Drupal-derived templates are kept out of this repository's shipped files. Any Twig examples added later are original documentation, not copies of Drupal core templates.
