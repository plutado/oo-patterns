/**
 * Light / dark theme toggle.
 *
 * Markup contract:
 *   <button class="oo-theme-toggle" type="button" data-oo-theme-toggle
 *           aria-pressed="false" aria-label="Dark theme">...</button>
 *
 * The toggle sets data-theme="light|dark" on <html>, which tokens.css reads.
 * With no stored choice the page follows prefers-color-scheme. The choice is
 * remembered in localStorage when it is available.
 */

export const THEME_STORAGE_KEY = 'oo-theme';

function readStored(win) {
  try {
    return win.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(win, value) {
  try {
    win.localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    // Storage unavailable (private mode, blocked): the toggle still works.
  }
}

/**
 * Resolve the active theme: stored choice, else the OS preference.
 * @param {Window} win
 * @returns {'light' | 'dark'}
 */
export function currentTheme(win = window) {
  const forced = win.document.documentElement.getAttribute('data-theme');
  if (forced === 'light' || forced === 'dark') return forced;
  const stored = readStored(win);
  if (stored === 'light' || stored === 'dark') return stored;
  return win.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Apply a theme to the document and remember it.
 * @param {'light' | 'dark'} theme
 * @param {Window} win
 */
export function setTheme(theme, win = window) {
  win.document.documentElement.setAttribute('data-theme', theme);
  writeStored(win, theme);
  win.document
    .querySelectorAll('[data-oo-theme-toggle]')
    .forEach((button) => button.setAttribute('aria-pressed', String(theme === 'dark')));
}

/**
 * Wire a toggle button.
 * @param {HTMLElement} button
 */
export function initThemeToggle(button) {
  const win = button.ownerDocument.defaultView;
  const stored = readStored(win);
  if (stored === 'light' || stored === 'dark') {
    win.document.documentElement.setAttribute('data-theme', stored);
  }
  button.setAttribute('aria-pressed', String(currentTheme(win) === 'dark'));

  const onClick = () => setTheme(currentTheme(win) === 'dark' ? 'light' : 'dark', win);
  button.addEventListener('click', onClick);

  return {
    destroy() {
      button.removeEventListener('click', onClick);
    },
  };
}
