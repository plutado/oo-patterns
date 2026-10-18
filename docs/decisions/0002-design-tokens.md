# 0002. Design tokens as CSS custom properties

- Status: accepted
- Date: 2026-10-18

## Context

Portfolio sites are personal; every owner will want their own colours, fonts and spacing. Themes need light and dark variants and must keep accessible contrast. A token pipeline (JSON source compiled to several outputs) is common in large design systems but adds tooling that a small library does not need yet.

## Decision

Define every design value as a CSS custom property prefixed `--oo-` in a single `tokens.css`, inside the `oo.tokens` layer. Colour tokens are semantic (role-based, such as `--oo-color-text-muted`), not palette names. Patterns may only read tokens, never hard-coded colours.

Light is the default. Dark is applied by `prefers-color-scheme` unless `data-theme="light"` is set, and forced by `data-theme="dark"`.

Contrast is verified by an automated test that parses `tokens.css` and checks text pairs at 4.5:1 and UI pairs at 3:1 in both themes.

## Consequences

- Re-theming is a matter of overriding a handful of custom properties, globally or on a single element.
- Tokens are visible in browser dev tools and need no build step.
- Colour values must stay in hex so the contrast test can read them; switching to `oklch()` later will need a parser update.
- If a JSON source of truth becomes useful (for example to share tokens with design tools), it can generate `tokens.css` without changing any pattern.
