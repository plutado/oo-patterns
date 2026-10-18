import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initFilter } from '../src/js/filter.js';

let root;
beforeEach(() => {
  document.body.innerHTML = `
    <div class="oo-filter" data-oo-filter data-oo-filter-noun="project">
      <div role="group" aria-label="Filter projects">
        <button type="button" data-oo-filter-value="all" aria-pressed="true">All</button>
        <button type="button" data-oo-filter-value="identity" aria-pressed="false">Identity</button>
        <button type="button" data-oo-filter-value="motion" aria-pressed="false">Motion</button>
      </div>
      <p data-oo-filter-status aria-live="polite"></p>
      <ul>
        <li data-oo-filter-tags="identity print">One</li>
        <li data-oo-filter-tags="motion">Two</li>
        <li data-oo-filter-tags="identity  motion">Three</li>
        <li data-oo-filter-tags="web">Four</li>
      </ul>
    </div>`;
  root = document.querySelector('[data-oo-filter]');
});

const visible = () => Array.from(root.querySelectorAll('li')).filter((li) => !li.hidden).map((li) => li.textContent);
const button = (value) => root.querySelector(`[data-oo-filter-value="${value}"]`);

describe('initFilter', () => {
  it('shows everything initially and marks itself ready', () => {
    initFilter(root);
    expect(root.hasAttribute('data-oo-filter-ready')).toBe(true);
    expect(visible()).toEqual(['One', 'Two', 'Three', 'Four']);
    expect(root.querySelector('[data-oo-filter-status]').textContent).toBe('Showing 4 projects');
  });

  it('filters by tag and updates pressed state', () => {
    initFilter(root);
    button('identity').click();
    expect(visible()).toEqual(['One', 'Three']);
    expect(button('identity').getAttribute('aria-pressed')).toBe('true');
    expect(button('all').getAttribute('aria-pressed')).toBe('false');
  });

  it('announces a singular count correctly', () => {
    const api = initFilter(root);
    expect(api.apply('web')).toBe(1);
    expect(root.querySelector('[data-oo-filter-status]').textContent).toBe('Showing 1 project');
  });

  it('returns to all items', () => {
    const api = initFilter(root);
    button('motion').click();
    button('all').click();
    expect(visible()).toHaveLength(4);
    expect(api.value).toBe('all');
  });

  it('calls onChange with the value and visible count', () => {
    const onChange = vi.fn();
    initFilter(root, { onChange });
    button('motion').click();
    expect(onChange).toHaveBeenLastCalledWith('motion', 2);
  });

  it('respects a pre-pressed button', () => {
    button('all').setAttribute('aria-pressed', 'false');
    button('motion').setAttribute('aria-pressed', 'true');
    initFilter(root);
    expect(visible()).toEqual(['Two', 'Three']);
  });

  it('restores every item on destroy', () => {
    const api = initFilter(root);
    button('identity').click();
    api.destroy();
    expect(visible()).toHaveLength(4);
    expect(root.hasAttribute('data-oo-filter-ready')).toBe(false);
  });
});
