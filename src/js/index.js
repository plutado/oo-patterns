/**
 * oo-patterns JavaScript entry point.
 *
 * Every component is an ES module that can be imported on its own. autoInit
 * wires every component it finds by data attribute, which is the simplest
 * way to use the library on a static or CMS-rendered page:
 *
 *   <script type="module">
 *     import { autoInit } from './oo.js';
 *     autoInit();
 *   </script>
 */

import { initCarousel } from './carousel.js';
import { initFilter } from './filter.js';
import { initLightbox } from './lightbox.js';
import { initNav } from './nav.js';
import { initThemeToggle } from './theme.js';

export { initCarousel, initFilter, initLightbox, initNav, initThemeToggle };
export { currentTheme, setTheme, THEME_STORAGE_KEY } from './theme.js';

const INITIALISED = new WeakSet();

function each(scope, selector, init) {
  const instances = [];
  scope.querySelectorAll(selector).forEach((el) => {
    if (INITIALISED.has(el)) return;
    INITIALISED.add(el);
    instances.push(init(el));
  });
  return instances;
}

/**
 * Initialise every component inside scope. Safe to call more than once
 * (for example after a CMS inserts new markup); elements are only wired once.
 *
 * @param {ParentNode} [scope=document]
 */
export function autoInit(scope = document) {
  const lightboxLinks = Array.from(scope.querySelectorAll('a[data-oo-lightbox]')).filter(
    (link) => !INITIALISED.has(link),
  );
  lightboxLinks.forEach((link) => INITIALISED.add(link));

  return {
    nav: each(scope, '[data-oo-nav]', initNav),
    carousel: each(scope, '[data-oo-carousel]', initCarousel),
    filter: each(scope, '[data-oo-filter]', initFilter),
    theme: each(scope, '[data-oo-theme-toggle]', initThemeToggle),
    lightbox: lightboxLinks.length ? [initLightbox(scope, lightboxLinks)] : [],
  };
}
