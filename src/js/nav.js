/**
 * Disclosure navigation for .oo-header.
 *
 * Markup contract:
 *   <header class="oo-header" data-oo-nav>
 *     <button data-oo-nav-toggle aria-controls="nav-id" aria-expanded="false">
 *     <nav id="nav-id">...</nav>
 *   </header>
 *
 * Behaviour: the toggle opens and closes the menu, Escape closes it and
 * returns focus to the toggle, a click outside closes it, and following a
 * link inside closes it (useful for in-page anchors).
 *
 * @param {HTMLElement} root element carrying [data-oo-nav]
 * @returns {{ open: () => void, close: (opts?: { focus?: boolean }) => void, destroy: () => void }}
 */
export function initNav(root) {
  const toggle = root.querySelector('[data-oo-nav-toggle]');
  const menuId = toggle?.getAttribute('aria-controls');
  const menu = menuId ? root.ownerDocument.getElementById(menuId) : null;

  if (!toggle || !menu) {
    return { open() {}, close() {}, destroy() {} };
  }

  const doc = root.ownerDocument;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function open() {
    toggle.setAttribute('aria-expanded', 'true');
    root.setAttribute('data-oo-nav-open', '');
  }

  function close({ focus = false } = {}) {
    toggle.setAttribute('aria-expanded', 'false');
    root.removeAttribute('data-oo-nav-open');
    if (focus) toggle.focus();
  }

  function onToggle() {
    if (isOpen()) close();
    else open();
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && isOpen()) {
      close({ focus: true });
    }
  }

  function onDocumentClick(event) {
    if (isOpen() && !root.contains(event.target)) close();
  }

  function onMenuClick(event) {
    if (event.target.closest('a')) close();
  }

  toggle.addEventListener('click', onToggle);
  root.addEventListener('keydown', onKeydown);
  menu.addEventListener('click', onMenuClick);
  doc.addEventListener('click', onDocumentClick);

  toggle.setAttribute('aria-expanded', 'false');
  root.setAttribute('data-oo-nav-ready', '');

  return {
    open,
    close,
    destroy() {
      toggle.removeEventListener('click', onToggle);
      root.removeEventListener('keydown', onKeydown);
      menu.removeEventListener('click', onMenuClick);
      doc.removeEventListener('click', onDocumentClick);
      root.removeAttribute('data-oo-nav-ready');
      root.removeAttribute('data-oo-nav-open');
    },
  };
}
