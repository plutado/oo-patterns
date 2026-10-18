# Contributing

Thanks for your interest. This is a small personal project, so the process is light.

## Before you start

- For anything larger than a bug fix, open an issue first so we can agree on the approach.
- Read the decision records in [docs/decisions/](docs/decisions/). In short: no CSS framework, no runtime dependencies, tokens for every design value.

## Development

```sh
npm install
npm run dev
```

Before opening a pull request, make sure these pass:

```sh
npm run lint
npm test
npm run build
npm run check:a11y
```

## Guidelines

- **Markup:** semantic HTML first. Every interactive pattern must work, or degrade gracefully, without JavaScript.
- **CSS:** class names follow `oo-block__element--modifier`. Put rules inside the right cascade layer. Read design values from tokens; do not hard-code colours. Use logical properties (`margin-inline`, `inset-block-start`) rather than physical ones.
- **JavaScript:** small ES modules with no dependencies. Each component exports an `init*` function that takes an element and returns an object with a `destroy()` method. Add Vitest tests for new behaviour.
- **Accessibility:** keyboard support, visible focus and AA contrast are requirements, not extras. New colour tokens used for text must be added to `tests/tokens-contrast.test.js`.
- **Demo content:** invented text and generated SVG or CSS artwork only. No stock photography and no third-party assets.
- **Dependencies:** development dependencies must be under a permissive licence. Nothing GPL-licensed may be shipped in `dist/`.
- **Changelog:** add a line under `Unreleased` in [CHANGELOG.md](CHANGELOG.md).

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).
