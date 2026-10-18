import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initNav } from '../src/js/nav.js';

function setup() {
  document.body.innerHTML = `
    <header class="oo-header" data-oo-nav>
      <a href="#">Brand</a>
      <button type="button" data-oo-nav-toggle aria-controls="menu" aria-expanded="false">Menu</button>
      <nav id="menu" aria-label="Main"><ul><li><a href="#work">Work</a></li></ul></nav>
    </header>
    <main><p id="outside">Outside</p></main>`;
  const root = document.querySelector('[data-oo-nav]');
  return { root, toggle: root.querySelector('button'), link: root.querySelector('nav a'), api: initNav(root) };
}

describe('initNav', () => {
  let ctx;
  beforeEach(() => {
    ctx = setup();
  });
  afterEach(() => ctx.api.destroy());

  it('marks the header as enhanced and starts closed', () => {
    expect(ctx.root.hasAttribute('data-oo-nav-ready')).toBe(true);
    expect(ctx.toggle.getAttribute('aria-expanded')).toBe('false');
    expect(ctx.root.hasAttribute('data-oo-nav-open')).toBe(false);
  });

  it('toggles open and closed on click', () => {
    ctx.toggle.click();
    expect(ctx.toggle.getAttribute('aria-expanded')).toBe('true');
    expect(ctx.root.hasAttribute('data-oo-nav-open')).toBe(true);
    ctx.toggle.click();
    expect(ctx.toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape and returns focus to the toggle', () => {
    ctx.toggle.click();
    ctx.link.focus();
    ctx.link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(ctx.toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(ctx.toggle);
  });

  it('closes when clicking outside the header', () => {
    ctx.toggle.click();
    document.getElementById('outside').click();
    expect(ctx.toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes after following a link in the menu', () => {
    ctx.toggle.click();
    ctx.link.click();
    expect(ctx.toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes its state on destroy', () => {
    ctx.toggle.click();
    ctx.api.destroy();
    expect(ctx.root.hasAttribute('data-oo-nav-ready')).toBe(false);
    expect(ctx.root.hasAttribute('data-oo-nav-open')).toBe(false);
  });

  it('is a no-op when the markup is incomplete', () => {
    document.body.innerHTML = '<header data-oo-nav></header>';
    const api = initNav(document.querySelector('header'));
    expect(() => api.open()).not.toThrow();
  });
});
