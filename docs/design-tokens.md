# Design tokens

All design values live as CSS custom properties in [`src/css/tokens.css`](../src/css/tokens.css), inside the `oo.tokens` cascade layer. Patterns read tokens and nothing else, so changing a token changes every pattern that uses it.

Every token is prefixed `--oo-`. Private, per-component variables start with an underscore (for example `--_bg` inside `.oo-button`) and are not part of the public API.

## Colour

Colour tokens are semantic: they describe a role, not a hue.

| Token | Role |
| --- | --- |
| `--oo-color-bg` | Page background |
| `--oo-color-surface` | Raised surfaces: cards, form fields, dialogs |
| `--oo-color-surface-2` | Subtle alternate background: alt sections, code blocks |
| `--oo-color-text` | Body text |
| `--oo-color-text-muted` | Secondary text: metadata, captions, hints |
| `--oo-color-border` | Decorative borders and dividers |
| `--oo-color-border-strong` | Borders of controls (inputs, outline buttons); meets 3:1 |
| `--oo-color-accent` | Links, primary buttons, highlights |
| `--oo-color-accent-hover` | Hover state for accent |
| `--oo-color-on-accent` | Text on an accent background |
| `--oo-color-accent-soft` | Tinted background for tags and icons |
| `--oo-color-on-accent-soft` | Text on `accent-soft` |
| `--oo-color-focus` | Focus ring |
| `--oo-color-success` | Positive status (availability dot) |
| `--oo-color-danger` | Error text and invalid field borders |
| `--oo-color-overlay` | Translucent scrim behind text on images |
| `--oo-color-on-overlay` | Text on the overlay |

### Contrast

`tests/tokens-contrast.test.js` reads `tokens.css` and checks each text pair against WCAG 2.2 AA (4.5:1) and each UI pair (borders, focus ring) against 3:1, for both themes. It also checks that the two copies of the dark theme (see below) stay identical. If you add a colour token used for text, add its pairs to that test. Keep colour values as hex so the test can parse them.

### Light and dark

The light theme is the default on `:root`. The dark theme is defined twice with the same values:

1. Inside `@media (prefers-color-scheme: dark)` on `:root:not([data-theme="light"])`, so it follows the operating system.
2. On `:root[data-theme="dark"]`, so a toggle can force it.

`data-theme="light"` forces the light theme regardless of the OS. `theme.js` sets this attribute and remembers the choice in `localStorage` under the key `oo-theme`.

The duplication is deliberate: it avoids a build-time step and keeps the file readable. The contrast test guards against the two copies drifting apart.

## Typography

| Token | Default |
| --- | --- |
| `--oo-font-sans` | System UI stack |
| `--oo-font-display` | Old-style serif stack (Iowan, Palatino, Georgia) |
| `--oo-font-mono` | System monospace stack |
| `--oo-font-weight-regular`, `-medium`, `-bold` | 400, 550, 700 |
| `--oo-line-height-tight`, `-snug`, `-body` | 1.15, 1.35, 1.6 |
| `--oo-text-xs` to `--oo-text-4xl` | Fluid sizes using `clamp()` |

No web fonts are loaded by the library. To use one, load it yourself and override `--oo-font-display` or `--oo-font-sans`.

## Space and layout

| Token | Notes |
| --- | --- |
| `--oo-space-1` to `--oo-space-9` | 0.25rem to 7rem, roughly a 1.5 ratio |
| `--oo-section-space` | Fluid vertical padding for sections |
| `--oo-content-width` | Max width of `.oo-container` content (72rem) |
| `--oo-prose-width` | Comfortable reading width (40rem) |
| `--oo-gutter` | Fluid side padding of `.oo-container` |

## Shape, depth and focus

`--oo-radius-sm`, `-md`, `-lg`, `-pill`; `--oo-border-width`; `--oo-shadow-sm`, `-md`; `--oo-focus-ring` and `--oo-focus-offset`.

## Motion

`--oo-duration-fast`, `-base`, `-slow` and `--oo-ease`. Under `prefers-reduced-motion: reduce` all durations become `0ms`, so every transition built on them becomes instant. The carousel also refuses to autoplay in that case.

## Layers

`--oo-z-header` and `--oo-z-overlay`.

## Overriding tokens

Because the library sits in cascade layers, any unlayered rule wins:

```css
:root {
  --oo-color-accent: #2a5db0;
  --oo-color-accent-hover: #1f4a8f;
  --oo-radius-lg: 0;
}
```

Tokens can also be scoped to part of a page:

```css
.case-study--night {
  --oo-color-bg: #0e1116;
  --oo-color-text: #e8edf4;
}
```

If you change colour tokens, re-check contrast. The simplest way is to copy your values into a fork of `tests/tokens-contrast.test.js`.
