import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { currentTheme, initThemeToggle, setTheme, THEME_STORAGE_KEY } from '../src/js/theme.js';

function mockMatchMedia(dark) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: dark && query.includes('dark'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.body.innerHTML =
    '<button type="button" class="oo-theme-toggle" data-oo-theme-toggle aria-pressed="false" aria-label="Dark theme"></button>';
});
afterEach(() => {
  delete window.matchMedia;
});

const button = () => document.querySelector('[data-oo-theme-toggle]');

describe('theme toggle', () => {
  it('follows the OS preference when nothing is stored', () => {
    mockMatchMedia(true);
    expect(currentTheme(window)).toBe('dark');
    initThemeToggle(button());
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('switches theme on click and remembers the choice', () => {
    mockMatchMedia(false);
    initThemeToggle(button());
    button().click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    button().click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('applies a stored choice on init', () => {
    mockMatchMedia(false);
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    initThemeToggle(button());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('keeps working when storage throws', () => {
    mockMatchMedia(false);
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => setTheme('dark', window)).not.toThrow();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    spy.mockRestore();
  });
});
