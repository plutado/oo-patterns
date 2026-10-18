/**
 * Carousel for .oo-carousel (used by the slider hero).
 *
 * Markup contract:
 *   <section class="oo-carousel" data-oo-carousel aria-label="...">
 *     <div class="oo-carousel__viewport">
 *       <div class="oo-carousel__track">
 *         <div class="oo-carousel__slide">...</div>
 *       </div>
 *     </div>
 *     <div class="oo-carousel__bar">
 *       <button data-oo-carousel-prev>  <button data-oo-carousel-next>
 *       <ol data-oo-carousel-dots></ol>              (optional)
 *       <button data-oo-carousel-play>                (optional, autoplay)
 *     </div>
 *   </section>
 *
 * Optional data-oo-autoplay="7000" rotates slides every N milliseconds.
 * Autoplay never starts when the user prefers reduced motion, pauses while
 * the carousel has hover or focus, and can be stopped with the play button
 * (WCAG 2.2.2). Inactive slides are made inert so they cannot be tabbed to.
 *
 * @param {HTMLElement} root
 * @param {{ autoplay?: number, reducedMotion?: boolean }} [options]
 */
export function initCarousel(root, options = {}) {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const track = root.querySelector('.oo-carousel__track');
  const slides = Array.from(root.querySelectorAll('.oo-carousel__slide'));
  const prev = root.querySelector('[data-oo-carousel-prev]');
  const next = root.querySelector('[data-oo-carousel-next]');
  const dotsList = root.querySelector('[data-oo-carousel-dots]');
  const playButton = root.querySelector('[data-oo-carousel-play]');
  const viewport = root.querySelector('.oo-carousel__viewport');

  const reducedMotion =
    options.reducedMotion ?? Boolean(win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const interval = options.autoplay ?? Number(root.dataset.ooAutoplay || 0);

  let index = 0;
  let timer = null;
  let playing = false;
  let hovered = false;
  let focused = false;
  const dots = [];

  root.setAttribute('aria-roledescription', 'carousel');
  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    if (!slide.hasAttribute('aria-label')) {
      slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    }
  });

  if (dotsList) {
    slides.forEach((slide, i) => {
      const item = doc.createElement('li');
      const dot = doc.createElement('button');
      dot.type = 'button';
      dot.className = 'oo-carousel__dot';
      dot.setAttribute('aria-label', `Show slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      item.append(dot);
      dotsList.append(item);
      dots.push(dot);
    });
  }

  function render() {
    track?.style.setProperty('--oo-carousel-index', String(index));
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.inert = !active;
      slide.toggleAttribute('inert', !active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function goTo(i) {
    const count = slides.length;
    if (!count) return;
    index = ((i % count) + count) % count;
    render();
  }

  function shouldRun() {
    return playing && !hovered && !focused;
  }

  function schedule() {
    win?.clearInterval(timer);
    timer = null;
    if (shouldRun() && win) {
      timer = win.setInterval(() => goTo(index + 1), interval);
    }
    // Announce slide changes only when the user drives them.
    viewport?.setAttribute('aria-live', playing ? 'off' : 'polite');
  }

  function setPlaying(value) {
    playing = value;
    playButton?.setAttribute('aria-pressed', String(playing));
    playButton?.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    schedule();
  }

  const onPrev = () => goTo(index - 1);
  const onNext = () => goTo(index + 1);
  const onPlay = () => setPlaying(!playing);
  const onKeydown = (event) => {
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowLeft') {
      goTo(index - 1);
    } else if (event.key === 'ArrowRight') {
      goTo(index + 1);
    }
  };
  const onEnter = () => {
    hovered = true;
    schedule();
  };
  const onLeave = () => {
    hovered = false;
    schedule();
  };
  const onFocusIn = () => {
    focused = true;
    schedule();
  };
  const onFocusOut = (event) => {
    if (!root.contains(event.relatedTarget)) {
      focused = false;
      schedule();
    }
  };

  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  playButton?.addEventListener('click', onPlay);
  root.addEventListener('keydown', onKeydown);
  root.addEventListener('mouseenter', onEnter);
  root.addEventListener('mouseleave', onLeave);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);

  const canAutoplay = interval > 0 && !reducedMotion;
  if (playButton) playButton.hidden = !canAutoplay;

  root.setAttribute('data-oo-carousel-ready', '');
  render();
  setPlaying(canAutoplay);

  return {
    goTo,
    next: onNext,
    prev: onPrev,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    get index() {
      return index;
    },
    get playing() {
      return playing;
    },
    destroy() {
      win?.clearInterval(timer);
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      playButton?.removeEventListener('click', onPlay);
      root.removeEventListener('keydown', onKeydown);
      root.removeEventListener('mouseenter', onEnter);
      root.removeEventListener('mouseleave', onLeave);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      slides.forEach((slide) => {
        slide.inert = false;
        slide.removeAttribute('inert');
        slide.removeAttribute('aria-hidden');
      });
      dots.forEach((dot) => dot.parentElement?.remove());
      root.removeAttribute('data-oo-carousel-ready');
    },
  };
}
