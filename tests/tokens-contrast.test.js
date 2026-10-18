// Checks that colour token pairs used for text and UI meet WCAG 2.2 AA.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(import.meta.dirname, '../src/css/tokens.css'), 'utf8');

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const end = css.indexOf('}', start);
  const tokens = {};
  for (const [, name, value] of css.slice(start, end).matchAll(/--oo-color-([a-z0-9-]+):\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

function toRgb(value) {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  const rgb = value.match(/^rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*(\d+)%\)$/);
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a: +rgb[4] / 100 };
  throw new Error(`Unsupported colour: ${value}`);
}

function over(fg, bg) {
  const mix = (k) => fg[k] * fg.a + bg[k] * (1 - fg.a);
  return { r: mix('r'), g: mix('g'), b: mix('b'), a: 1 };
}

function luminance({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio]
const TEXT = 4.5;
const UI = 3;
const pairs = [
  ['text', 'bg', TEXT],
  ['text', 'surface', TEXT],
  ['text', 'surface-2', TEXT],
  ['text-muted', 'bg', TEXT],
  ['text-muted', 'surface', TEXT],
  ['text-muted', 'surface-2', TEXT],
  ['accent', 'bg', TEXT],
  ['accent', 'surface', TEXT],
  ['accent', 'surface-2', TEXT],
  ['accent-hover', 'bg', TEXT],
  ['on-accent', 'accent', TEXT],
  ['on-accent', 'accent-hover', TEXT],
  ['on-accent-soft', 'accent-soft', TEXT],
  ['danger', 'bg', TEXT],
  ['danger', 'surface', TEXT],
  ['bg', 'text', TEXT],
  ['border-strong', 'bg', UI],
  ['border-strong', 'surface', UI],
  ['focus', 'bg', UI],
  ['focus', 'surface', UI],
  ['focus', 'surface-2', UI],
  ['success', 'bg', UI],
];

const themes = {
  light: block(':root'),
  dark: block(':root[data-theme="dark"]'),
};

describe('colour tokens meet WCAG AA', () => {
  for (const [theme, tokens] of Object.entries(themes)) {
    describe(theme, () => {
      it.each(pairs)('%s on %s >= %s:1', (fg, bg, min) => {
        expect(tokens[fg], `missing --oo-color-${fg}`).toBeDefined();
        expect(tokens[bg], `missing --oo-color-${bg}`).toBeDefined();
        const ratio = contrast(toRgb(tokens[fg]), toRgb(tokens[bg]));
        expect(ratio).toBeGreaterThanOrEqual(min);
      });

      it('overlay text stays readable over the lightest backdrop', () => {
        const overlay = over(toRgb(tokens.overlay ?? themes.light.overlay), { r: 255, g: 255, b: 255, a: 1 });
        const text = toRgb(tokens['on-overlay'] ?? themes.light['on-overlay']);
        expect(contrast(text, overlay)).toBeGreaterThanOrEqual(TEXT);
      });
    });
  }

  it('the media-query dark theme matches the forced dark theme', () => {
    const start = css.indexOf('@media (prefers-color-scheme: dark)');
    const media = block(':root:not([data-theme="light"])');
    expect(start).toBeGreaterThan(-1);
    expect(media).toEqual(themes.dark);
  });
});
