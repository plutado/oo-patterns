import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCarousel } from '../src/js/carousel.js';

function setup(attrs = '') {
  document.body.innerHTML = `
    <section class="oo-carousel" data-oo-carousel aria-label="Featured" ${attrs}>
      <div class="oo-carousel__viewport">
        <div class="oo-carousel__track">
          <div class="oo-carousel__slide"><a href="#a">A</a></div>
          <div class="oo-carousel__slide"><a href="#b">B</a></div>
          <div class="oo-carousel__slide"><a href="#c">C</a></div>
        </div>
      </div>
      <div class="oo-carousel__bar">
        <button type="button" data-oo-carousel-prev aria-label="Previous slide"></button>
        <button type="button" data-oo-carousel-next aria-label="Next slide"></button>
        <ol data-oo-carousel-dots></ol>
        <button type="button" data-oo-carousel-play></button>
      </div>
    </section>`;
  return document.querySelector('[data-oo-carousel]');
}

const slides = () => Array.from(document.querySelectorAll('.oo-carousel__slide'));

describe('initCarousel', () => {
  let api;
  afterEach(() => {
    api?.destroy();
    vi.useRealTimers();
  });

  describe('manual', () => {
    let root;
    beforeEach(() => {
      root = setup();
      api = initCarousel(root, { reducedMotion: false });
    });

    it('adds carousel semantics and labels each slide', () => {
      expect(root.getAttribute('aria-roledescription')).toBe('carousel');
      expect(slides()[1].getAttribute('role')).toBe('group');
      expect(slides()[1].getAttribute('aria-roledescription')).toBe('slide');
      expect(slides()[1].getAttribute('aria-label')).toBe('2 of 3');
    });

    it('makes only the active slide reachable', () => {
      expect(slides().map((s) => s.hasAttribute('inert'))).toEqual([false, true, true]);
    });

    it('moves with next and previous buttons and wraps around', () => {
      root.querySelector('[data-oo-carousel-next]').click();
      expect(api.index).toBe(1);
      root.querySelector('[data-oo-carousel-prev]').click();
      root.querySelector('[data-oo-carousel-prev]').click();
      expect(api.index).toBe(2);
      expect(root.querySelector('.oo-carousel__track').style.getPropertyValue('--oo-carousel-index')).toBe('2');
    });

    it('builds one dot per slide and marks the current one', () => {
      const dots = root.querySelectorAll('.oo-carousel__dot');
      expect(dots).toHaveLength(3);
      dots[2].click();
      expect(api.index).toBe(2);
      expect(dots[2].getAttribute('aria-current')).toBe('true');
      expect(dots[0].hasAttribute('aria-current')).toBe(false);
    });

    it('responds to arrow keys', () => {
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(api.index).toBe(1);
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(api.index).toBe(0);
    });

    it('hides the play button and announces changes when autoplay is off', () => {
      expect(root.querySelector('[data-oo-carousel-play]').hidden).toBe(true);
      expect(root.querySelector('.oo-carousel__viewport').getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('autoplay', () => {
    it('advances on a timer and can be paused', () => {
      vi.useFakeTimers();
      const root = setup('data-oo-autoplay="1000"');
      api = initCarousel(root, { reducedMotion: false });
      const play = root.querySelector('[data-oo-carousel-play]');
      expect(api.playing).toBe(true);
      expect(play.getAttribute('aria-pressed')).toBe('true');
      expect(root.querySelector('.oo-carousel__viewport').getAttribute('aria-live')).toBe('off');
      vi.advanceTimersByTime(1000);
      expect(api.index).toBe(1);
      play.click();
      expect(api.playing).toBe(false);
      vi.advanceTimersByTime(3000);
      expect(api.index).toBe(1);
    });

    it('pauses while focus is inside', () => {
      vi.useFakeTimers();
      const root = setup('data-oo-autoplay="1000"');
      api = initCarousel(root, { reducedMotion: false });
      root.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      vi.advanceTimersByTime(3000);
      expect(api.index).toBe(0);
    });

    it('never autoplays when reduced motion is preferred', () => {
      vi.useFakeTimers();
      const root = setup('data-oo-autoplay="1000"');
      api = initCarousel(root, { reducedMotion: true });
      vi.advanceTimersByTime(5000);
      expect(api.playing).toBe(false);
      expect(api.index).toBe(0);
      expect(root.querySelector('[data-oo-carousel-play]').hidden).toBe(true);
    });
  });
});
