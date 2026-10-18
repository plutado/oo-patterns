import { describe, expect, it } from 'vitest';
import { autoInit } from '../src/js/index.js';

describe('autoInit', () => {
  it('wires each component once, even when called twice', () => {
    document.body.innerHTML = `
      <header data-oo-nav><button data-oo-nav-toggle aria-controls="m" aria-expanded="false">Menu</button><nav id="m" aria-label="Main"></nav></header>
      <div data-oo-filter><button data-oo-filter-value="all" aria-pressed="true">All</button><ul><li data-oo-filter-tags="x">x</li></ul></div>
      <a href="/a.svg" data-oo-lightbox="g"><img src="/t.svg" alt="A"></a>`;
    const first = autoInit(document);
    expect(first.nav).toHaveLength(1);
    expect(first.filter).toHaveLength(1);
    expect(first.lightbox).toHaveLength(1);
    const second = autoInit(document);
    expect(second.nav).toHaveLength(0);
    expect(second.lightbox).toHaveLength(0);

    const toggle = document.querySelector('[data-oo-nav-toggle]');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });
});
