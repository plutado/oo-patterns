/**
 * Filterable grid for portfolio items (or anything else).
 *
 * Markup contract:
 *   <div class="oo-filter" data-oo-filter>
 *     <div class="oo-filter__controls" role="group" aria-label="Filter projects">
 *       <button type="button" data-oo-filter-value="all" aria-pressed="true">All</button>
 *       <button type="button" data-oo-filter-value="identity" aria-pressed="false">Identity</button>
 *     </div>
 *     <p data-oo-filter-status aria-live="polite"></p>
 *     <ul>
 *       <li data-oo-filter-tags="identity print">...</li>
 *     </ul>
 *   </div>
 *
 * Items are matched by whitespace-separated tags. "all" shows everything.
 * The status element announces how many items are visible.
 *
 * @param {HTMLElement} root
 * @param {{ onChange?: (value: string, visible: number) => void }} [options]
 */
export function initFilter(root, options = {}) {
  const buttons = Array.from(root.querySelectorAll('[data-oo-filter-value]'));
  const items = Array.from(root.querySelectorAll('[data-oo-filter-tags]'));
  const status = root.querySelector('[data-oo-filter-status]');
  const noun = root.dataset.ooFilterNoun || 'item';
  const nounPlural = root.dataset.ooFilterNounPlural || `${noun}s`;

  let current = 'all';

  function apply(value) {
    current = value;
    let visible = 0;
    items.forEach((item) => {
      const tags = (item.dataset.ooFilterTags || '').split(/\s+/).filter(Boolean);
      const match = value === 'all' || tags.includes(value);
      item.hidden = !match;
      if (match) visible += 1;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.ooFilterValue === value));
    });
    if (status) {
      status.textContent = `Showing ${visible} ${visible === 1 ? noun : nounPlural}`;
    }
    options.onChange?.(value, visible);
    return visible;
  }

  function onClick(event) {
    apply(event.currentTarget.dataset.ooFilterValue);
  }

  buttons.forEach((button) => button.addEventListener('click', onClick));
  root.setAttribute('data-oo-filter-ready', '');

  const pressed = buttons.find((b) => b.getAttribute('aria-pressed') === 'true');
  apply(pressed?.dataset.ooFilterValue ?? 'all');

  return {
    apply,
    get value() {
      return current;
    },
    destroy() {
      buttons.forEach((button) => button.removeEventListener('click', onClick));
      items.forEach((item) => {
        item.hidden = false;
      });
      root.removeAttribute('data-oo-filter-ready');
    },
  };
}
