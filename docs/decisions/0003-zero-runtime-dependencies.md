# 0003. Zero runtime dependencies, progressive enhancement

- Status: accepted
- Date: 2026-10-18

## Context

The interactive patterns (menu toggle, carousel, filter, lightbox, theme toggle) are small. Third-party carousel and lightbox libraries are typically larger than the whole of this library, bring their own styling assumptions, and some carry licences (including GPL) that are incompatible with an MIT library or awkward for consumers.

## Decision

- Ship no runtime dependencies. Each behaviour is a small vanilla ES module with an `init*(element)` function returning an object with `destroy()`.
- Use the platform where it exists: `<dialog>` for the lightbox (focus containment, Escape, backdrop), `inert` for hidden carousel slides, `aria-pressed` and `aria-expanded` for state.
- Every pattern works without JavaScript. Scripts mark the root with a `data-oo-*-ready` attribute, and CSS only hides or rearranges content once that attribute is present.
- Development dependencies are allowed but must be permissively licensed (MIT, ISC, BSD, Apache-2.0, or MPL-2.0 for tools that are never shipped). Nothing under the GPL may end up in `dist/`.

## Consequences

- `dist/js` is a few kilobytes and has no supply-chain surface for consumers.
- Features that libraries provide for free (touch swipe on the carousel, pinch zoom in the lightbox) must be written and tested here if they are wanted. They are on the roadmap rather than pulled in.
- axe-core (MPL-2.0) is a development-only tool used to check the demo pages; it is not bundled.
