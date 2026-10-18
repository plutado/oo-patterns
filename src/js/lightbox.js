/**
 * Image lightbox built on the native <dialog> element.
 *
 * Markup contract: ordinary links to full-size images.
 *   <a href="large.jpg" data-oo-lightbox="gallery-name" data-oo-caption="...">
 *     <img src="thumb.jpg" alt="Description">
 *   </a>
 *
 * Links sharing a data-oo-lightbox value form a group with previous and next
 * controls. Without JavaScript the links simply open the image. The dialog
 * is created once per document; closing it returns focus to the link that
 * opened it.
 *
 * Several instances may share the one dialog; only the instance that opened
 * it reacts to its controls.
 *
 * @param {ParentNode} [scope=document]
 * @param {HTMLAnchorElement[]} [only] restrict to these links (used by autoInit)
 */
export function initLightbox(scope = document, only) {
  const doc = scope.ownerDocument ?? scope;
  const links = only ?? Array.from(scope.querySelectorAll('a[data-oo-lightbox]'));
  if (!links.length) return { open() {}, close() {}, destroy() {} };

  const dialog = getDialog(doc);
  const image = dialog.querySelector('.oo-lightbox__image');
  const caption = dialog.querySelector('.oo-lightbox__caption');
  const counter = dialog.querySelector('.oo-lightbox__counter');
  const prevButton = dialog.querySelector('[data-oo-lightbox-prev]');
  const nextButton = dialog.querySelector('[data-oo-lightbox-next]');
  const closeButton = dialog.querySelector('[data-oo-lightbox-close]');

  let group = [];
  let index = 0;
  let opener = null;
  let active = false;

  function show(i) {
    index = (i + group.length) % group.length;
    const link = group[index];
    const thumb = link.querySelector('img');
    image.src = link.getAttribute('href');
    image.alt = thumb?.getAttribute('alt') ?? '';
    const text = link.dataset.ooCaption ?? '';
    caption.textContent = text;
    caption.hidden = !text;
    counter.textContent = group.length > 1 ? `${index + 1} of ${group.length}` : '';
    const single = group.length < 2;
    prevButton.hidden = single;
    nextButton.hidden = single;
  }

  function open(link) {
    const name = link.dataset.ooLightbox;
    group = name ? links.filter((l) => l.dataset.ooLightbox === name) : [link];
    opener = link;
    active = true;
    show(group.indexOf(link));
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    closeButton.focus();
  }

  function close() {
    if (!active) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else onClosed();
  }

  function onClosed() {
    if (!active) return;
    active = false;
    dialog.removeAttribute('open');
    image.removeAttribute('src');
    opener?.focus();
    opener = null;
  }

  function onLinkClick(event) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    open(event.currentTarget);
  }

  function onKeydown(event) {
    if (!active) return;
    if (event.key === 'ArrowLeft' && group.length > 1) show(index - 1);
    else if (event.key === 'ArrowRight' && group.length > 1) show(index + 1);
    else if (event.key === 'Escape' && typeof dialog.showModal !== 'function') close();
  }

  function onBackdropClick(event) {
    // A click on the dialog element itself (not its content) is the backdrop.
    if (event.target === dialog) close();
  }

  const onPrev = () => active && show(index - 1);
  const onNext = () => active && show(index + 1);

  links.forEach((link) => link.addEventListener('click', onLinkClick));
  prevButton.addEventListener('click', onPrev);
  nextButton.addEventListener('click', onNext);
  closeButton.addEventListener('click', close);
  dialog.addEventListener('keydown', onKeydown);
  dialog.addEventListener('click', onBackdropClick);
  dialog.addEventListener('close', onClosed);

  return {
    open: (i = 0) => open(links[i]),
    close,
    get index() {
      return index;
    },
    get dialog() {
      return dialog;
    },
    destroy() {
      links.forEach((link) => link.removeEventListener('click', onLinkClick));
      prevButton.removeEventListener('click', onPrev);
      nextButton.removeEventListener('click', onNext);
      closeButton.removeEventListener('click', close);
      dialog.removeEventListener('keydown', onKeydown);
      dialog.removeEventListener('click', onBackdropClick);
      dialog.removeEventListener('close', onClosed);
      if (active) close();
    },
  };
}

function getDialog(doc) {
  let dialog = doc.querySelector('dialog.oo-lightbox');
  if (dialog) return dialog;

  dialog = doc.createElement('dialog');
  dialog.className = 'oo-lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML = `
    <div class="oo-lightbox__frame">
      <div class="oo-lightbox__bar">
        <span class="oo-lightbox__counter" aria-live="polite"></span>
        <button type="button" class="oo-lightbox__button" data-oo-lightbox-close aria-label="Close image viewer">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="oo-lightbox__stage">
        <img class="oo-lightbox__image" alt="">
      </div>
      <div class="oo-lightbox__footer">
        <p class="oo-lightbox__caption"></p>
        <div class="oo-lightbox__nav">
          <button type="button" class="oo-lightbox__button" data-oo-lightbox-prev aria-label="Previous image">
            <span aria-hidden="true">&larr;</span>
          </button>
          <button type="button" class="oo-lightbox__button" data-oo-lightbox-next aria-label="Next image">
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>`;
  doc.body.append(dialog);
  return dialog;
}
