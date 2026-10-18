// Demo site entry: wires every component on the page.
import { autoInit } from '../../src/js/index.js';

autoInit();

// Resume demo: print button.
document.querySelectorAll('[data-demo-print]').forEach((button) => {
  button.addEventListener('click', () => window.print());
});
