(() => {
  // Preview image/title/text swap on mega-link hover (panels 1 & 5)
  document.querySelectorAll('.bt-mega-panel').forEach((panel) => {
    const previewLink = panel.querySelector('[data-preview-link]');
    const img         = panel.querySelector('[data-preview-img]');
    const title       = panel.querySelector('[data-preview-title]');
    const text        = panel.querySelector('[data-preview-text]');
    const links       = Array.from(panel.querySelectorAll('.bt-mega-link'));

    if (!img && !title) return;

    const activate = (link) => {
      links.forEach((item) => item.classList.toggle('is-active', item === link));
      if (!link) return;
      if (previewLink && link.href) previewLink.href = link.href;
      if (img && link.dataset.img)  img.src = link.dataset.img;
      if (title) title.textContent = link.dataset.title || link.textContent.trim();
      if (text)  text.textContent  = link.dataset.text  || '';
    };

    if (links[0]) activate(links[0]);
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => activate(link));
      link.addEventListener('focus',      () => activate(link));
    });
  });

  // Guide flyout swap (panel 3 — Install Guide)
  document.querySelectorAll('.bt-guide-panel').forEach((panel) => {
    const items      = Array.from(panel.querySelectorAll('.bt-guide-item'));
    const previewImg = panel.querySelector('.bt-guide-preview-img');
    const flyouts    = Array.from(panel.querySelectorAll('.bt-guide-flyout'));

    const setActive = (item) => {
      items.forEach((e) => e.classList.toggle('is-active', e === item));
      flyouts.forEach((f) => f.classList.toggle('is-active', f.dataset.flyoutId === item.dataset.flyout));
      if (previewImg && item.dataset.img) previewImg.src = item.dataset.img;
    };

    items.forEach((item) => {
      const trigger = item.querySelector('.bt-guide-main');
      if (!trigger) return;
      trigger.addEventListener('mouseenter', () => setActive(item));
      trigger.addEventListener('focus',      () => setActive(item));
    });

    panel.addEventListener('mouseleave', () => { if (items[0]) setActive(items[0]); });
    if (items[0]) setActive(items[0]);
  });

  // Keep District theme's CartCount in sync on desktop
  document.addEventListener('cart:updated', () => {
    fetch('/cart.js').then(r => r.json()).then(cart => {
      const el = document.getElementById('CartCount');
      if (el) {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? '' : 'none';
      }
    });
  });
})();
