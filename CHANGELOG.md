# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) from 1.0.0. Before 1.0.0, minor versions may contain breaking changes.

## [Unreleased]

### Added

- Design tokens for colour (light and dark), typography, spacing, layout, shape, depth and motion, with WCAG AA contrast tests.
- Cascade-layered CSS architecture: `oo.reset`, `oo.tokens`, `oo.base`, `oo.components`, `oo.patterns`.
- Base typography, prose, layout primitives, buttons, tags and form controls.
- Patterns: header (split, centred), hero (statement, slider), about, feature grid, portfolio cards (framed, overlay tile), filterable grid, lightbox gallery, case study page, blog list, blog post, resume with print styles, contact section, footer.
- JavaScript modules: `nav`, `carousel`, `filter`, `lightbox`, `theme`, and `autoInit`.
- Vite multi-page demo site with generated SVG placeholder artwork.
- Build output: full CSS bundle, core CSS, per-pattern CSS and per-component ES modules in `dist/`.
- Tooling: Stylelint, html-validate, Vitest with jsdom, axe-core check over built demo pages, GitHub Actions CI.
- Documentation: README, roadmap, design tokens, pattern inventory, Drupal integration guide and architecture decision records.
