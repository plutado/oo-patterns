#!/usr/bin/env node
/**
 * Generates the abstract SVG placeholder artwork used by the demo pages.
 * Output is deterministic (seeded), so re-running produces identical files.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'demo', 'assets', 'img');
mkdirSync(outDir, { recursive: true });

/* Small seeded PRNG (mulberry32). */
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const palettes = [
  ['#1f3a4d', '#e0784f', '#f4e3c9', '#8fb3a8'],
  ['#2b2140', '#f2b544', '#e9e1d4', '#c4543e'],
  ['#14342b', '#d9e4c7', '#f08a5d', '#3f7d6b'],
  ['#3a2a22', '#e8c9a6', '#7b9acc', '#f2efe9'],
  ['#0f2433', '#5fb3b3', '#f3d6a4', '#d9623b'],
  ['#3b1f2b', '#f6c9b8', '#b8d8d3', '#e2574c'],
  ['#202b2f', '#c9a227', '#ece6da', '#5c7f95'],
  ['#2a3326', '#a8c686', '#f5ecd7', '#b4552d'],
];

const f = (n) => Math.round(n * 10) / 10;

function composition(kind, w, h, seed, palette) {
  const r = rng(seed);
  const [bg, a, b, c] = palette;
  const shapes = [];
  const min = Math.min(w, h);

  if (kind === 'orbits') {
    const cx = w * (0.35 + r() * 0.3);
    const cy = h * (0.35 + r() * 0.3);
    for (let i = 5; i > 0; i -= 1) {
      shapes.push(
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f((min / 9) * i)}" fill="none" stroke="${i % 2 ? b : c}" stroke-width="${f(min / 60)}" opacity="${f(0.35 + i / 10)}"/>`,
      );
    }
    shapes.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(min / 7)}" fill="${a}"/>`);
  } else if (kind === 'blocks') {
    for (let i = 0; i < 7; i += 1) {
      const bw = w * (0.12 + r() * 0.3);
      const bh = h * (0.12 + r() * 0.35);
      shapes.push(
        `<rect x="${f(r() * (w - bw))}" y="${f(r() * (h - bh))}" width="${f(bw)}" height="${f(bh)}" rx="${f(min / 40)}" fill="${[a, b, c][i % 3]}" opacity="${f(0.7 + r() * 0.3)}"/>`,
      );
    }
  } else if (kind === 'waves') {
    for (let i = 0; i < 6; i += 1) {
      const y = h * (0.25 + i * 0.12);
      const amp = h * (0.05 + r() * 0.08);
      shapes.push(
        `<path d="M0 ${f(y)} C ${f(w * 0.25)} ${f(y - amp)}, ${f(w * 0.5)} ${f(y + amp)}, ${f(w)} ${f(y - amp / 2)} L ${w} ${h} L 0 ${h} Z" fill="${[a, b, c][i % 3]}" opacity="${f(0.25 + i * 0.1)}"/>`,
      );
    }
  } else if (kind === 'grid') {
    const cols = 6;
    const rows = Math.round((cols * h) / w);
    const s = w / cols;
    for (let x = 0; x < cols; x += 1) {
      for (let y = 0; y < rows; y += 1) {
        const v = r();
        if (v < 0.45) {
          shapes.push(
            `<circle cx="${f(x * s + s / 2)}" cy="${f(y * s + s / 2)}" r="${f(s * (0.15 + v * 0.6))}" fill="${[a, b, c][(x + y) % 3]}"/>`,
          );
        } else if (v < 0.6) {
          shapes.push(`<rect x="${f(x * s + s * 0.2)}" y="${f(y * s + s * 0.2)}" width="${f(s * 0.6)}" height="${f(s * 0.6)}" fill="${b}"/>`);
        }
      }
    }
  } else {
    // "arch": stacked arches, used for portraits and covers
    const cx = w / 2;
    for (let i = 0; i < 4; i += 1) {
      const aw = w * (0.7 - i * 0.14);
      const top = h * (0.18 + i * 0.12);
      shapes.push(
        `<path d="M ${f(cx - aw / 2)} ${h} V ${f(top + aw / 2)} A ${f(aw / 2)} ${f(aw / 2)} 0 0 1 ${f(cx + aw / 2)} ${f(top + aw / 2)} V ${h} Z" fill="${[a, b, c, a][i]}"/>`,
      );
    }
    shapes.push(`<circle cx="${f(w * 0.78)}" cy="${f(h * 0.2)}" r="${f(min * 0.07)}" fill="${b}"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${shapes.join('')}</svg>\n`;
}

const kinds = ['orbits', 'blocks', 'waves', 'grid', 'arch'];
const files = [];

for (let i = 1; i <= 8; i += 1) {
  files.push([`work-${String(i).padStart(2, '0')}.svg`, kinds[(i - 1) % kinds.length], 1200, 900, i]);
}
for (let i = 1; i <= 3; i += 1) {
  files.push([`slide-${String(i).padStart(2, '0')}.svg`, ['waves', 'orbits', 'blocks'][i - 1], 1600, 900, 40 + i]);
}
for (let i = 1; i <= 4; i += 1) {
  files.push([`post-${String(i).padStart(2, '0')}.svg`, ['grid', 'arch', 'waves', 'blocks'][i - 1], 1200, 800, 60 + i]);
}
files.push(['portrait.svg', 'arch', 800, 800, 99]);
files.push(['hero.svg', 'arch', 800, 1000, 7]);
files.push(['avatar.svg', 'orbits', 200, 200, 5]);

files.forEach(([name, kind, w, h, seed], i) => {
  writeFileSync(join(outDir, name), composition(kind, w, h, seed, palettes[(seed + i) % palettes.length]));
});

console.log(`Wrote ${files.length} placeholder images to ${outDir}`);
