import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initLightbox } from '../src/js/lightbox.js';

let api;
beforeEach(() => {
  document.body.innerHTML = `
    <ul>
      <li><a href="/a.svg" data-oo-lightbox="set" data-oo-caption="First"><img src="/a-thumb.svg" alt="Alpha"></a></li>
      <li><a href="/b.svg" data-oo-lightbox="set"><img src="/b-thumb.svg" alt="Beta"></a></li>
      <li><a href="/c.svg" data-oo-lightbox="set" data-oo-caption="Third"><img src="/c-thumb.svg" alt="Gamma"></a></li>
      <li><a href="/solo.svg" data-oo-lightbox="other"><img src="/s.svg" alt="Solo"></a></li>
    </ul>`;
  api = initLightbox(document);
});
afterEach(() => {
  api.destroy();
  document.querySelector('dialog.oo-lightbox')?.remove();
});

const links = () => Array.from(document.querySelectorAll('a[data-oo-lightbox]'));
const dialog = () => document.querySelector('dialog.oo-lightbox');
const isOpen = () => dialog().hasAttribute('open');
const key = (k) => dialog().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

describe('initLightbox', () => {
  it('creates a single labelled dialog', () => {
    expect(document.querySelectorAll('dialog.oo-lightbox')).toHaveLength(1);
    expect(dialog().getAttribute('aria-label')).toBe('Image viewer');
    expect(isOpen()).toBe(false);
  });

  it('opens on click with the full image, alt text and caption', () => {
    links()[0].click();
    expect(isOpen()).toBe(true);
    const img = dialog().querySelector('.oo-lightbox__image');
    expect(img.getAttribute('src')).toBe('/a.svg');
    expect(img.getAttribute('alt')).toBe('Alpha');
    expect(dialog().querySelector('.oo-lightbox__caption').textContent).toBe('First');
    expect(dialog().querySelector('.oo-lightbox__counter').textContent).toBe('1 of 3');
    expect(document.activeElement).toBe(dialog().querySelector('[data-oo-lightbox-close]'));
  });

  it('pages through its group with buttons and arrow keys, wrapping', () => {
    links()[0].click();
    dialog().querySelector('[data-oo-lightbox-next]').click();
    expect(api.index).toBe(1);
    expect(dialog().querySelector('.oo-lightbox__caption').hidden).toBe(true);
    key('ArrowRight');
    expect(api.index).toBe(2);
    key('ArrowRight');
    expect(api.index).toBe(0);
    key('ArrowLeft');
    expect(dialog().querySelector('.oo-lightbox__image').getAttribute('alt')).toBe('Gamma');
  });

  it('hides paging controls for a single image', () => {
    links()[3].click();
    expect(dialog().querySelector('[data-oo-lightbox-next]').hidden).toBe(true);
    expect(dialog().querySelector('.oo-lightbox__counter').textContent).toBe('');
  });

  it('closes and returns focus to the opening link', () => {
    links()[1].click();
    dialog().querySelector('[data-oo-lightbox-close]').click();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(links()[1]);
  });

  it('closes on Escape', () => {
    links()[2].click();
    key('Escape');
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(links()[2]);
  });

  it('leaves modified clicks (open in new tab) alone', () => {
    let preventedByLightbox = null;
    // Runs after the lightbox handler; cancels the navigation jsdom cannot perform.
    const spy = (e) => {
      preventedByLightbox = e.defaultPrevented;
      e.preventDefault();
    };
    document.addEventListener('click', spy, { once: true });
    links()[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true }));
    expect(isOpen()).toBe(false);
    expect(preventedByLightbox).toBe(false);
  });
});
