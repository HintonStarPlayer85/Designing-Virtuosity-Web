(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const experience = document.querySelector('.portfolio-experience');
  const rain = document.querySelector('.digital-rain');
  const brandColors = ['#13d8ee','#199df0','#ff1188','#8b4cff','#73e52d','#ff9128'];

  // Chromatic rain engine: randomized brand-aligned droplets generated at runtime.
  if (rain && !reduced) {
    const fragment = document.createDocumentFragment();
    const count = Math.min(72, Math.max(42, Math.round(window.innerWidth / 22)));
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('span');
      drop.className = 'rain-drop';
      drop.style.setProperty('--x', (Math.random() * 100).toFixed(2) + '%');
      drop.style.setProperty('--s', (2 + Math.random() * 4.5).toFixed(2) + 'px');
      drop.style.setProperty('--o', (0.08 + Math.random() * 0.21).toFixed(2));
      drop.style.setProperty('--b', (Math.random() * 0.8).toFixed(2) + 'px');
      drop.style.setProperty('--d', (7 + Math.random() * 11).toFixed(2) + 's');
      drop.style.setProperty('--delay', (-Math.random() * 18).toFixed(2) + 's');
      drop.style.setProperty('--drift', ((Math.random() - .5) * 80).toFixed(1) + 'px');
      drop.style.setProperty('--c', brandColors[Math.floor(Math.random() * brandColors.length)]);
      fragment.appendChild(drop);
    }
    rain.appendChild(fragment);
  }

  // Ripple impacts make pointer clicks feel like digital droplets hitting glass.
  if (experience && !reduced) {
    experience.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') return;
      const ring = document.createElement('span');
      ring.className = 'rain-impact';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      ring.style.setProperty('--impact-color', brandColors[Math.floor(Math.random() * brandColors.length)]);
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 820);
    });
  }

  // 3D light/tilt response.
  const tiltItems = [...document.querySelectorAll('[data-portfolio-tilt]')];
  tiltItems.forEach(card => {
    if (reduced) return;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - .5) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((.5 - py) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
      card.style.setProperty('--gx','78%');
      card.style.setProperty('--gy','18%');
    });
  });

  // A small magnetic drift for identity archive tiles.
  document.querySelectorAll('.identity-tile').forEach(tile => {
    if (reduced) return;
    tile.addEventListener('pointermove', e => {
      const r = tile.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .035;
      const y = (e.clientY - r.top - r.height / 2) * .035;
      tile.style.setProperty('--mx', x.toFixed(1) + 'px');
      tile.style.setProperty('--my', y.toFixed(1) + 'px');
    });
    tile.addEventListener('pointerleave', () => {
      tile.style.setProperty('--mx','0px');
      tile.style.setProperty('--my','0px');
    });
  });

  // Work Index filtering.
  const filters = [...document.querySelectorAll('.work-filter')];
  const items = [...document.querySelectorAll('.work-item')];
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(btn => btn.classList.remove('active'));
      filter.classList.add('active');
      const target = filter.dataset.filter;
      items.forEach(item => {
        const categories = (item.dataset.category || '').split(/\s+/);
        item.classList.toggle('filtered-out', target !== 'all' && !categories.includes(target));
      });
    });
  });

  // Case Study Cockpit.
  const modal = document.querySelector('.case-modal');
  const closeBtn = modal?.querySelector('.case-close');
  const title = modal?.querySelector('[data-case-title]');
  const levelFields = [...(modal?.querySelectorAll('[data-case-level]') || [])];
  const discipline = modal?.querySelector('[data-case-discipline]');
  const summary = modal?.querySelector('[data-case-summary]');
  const deliverables = modal?.querySelector('[data-case-deliverables]');
  const treatment = modal?.querySelector('[data-case-treatment]');
  const link = modal?.querySelector('.case-link');
  const top = modal?.querySelector('.case-top');
  let returnFocus = null;

  function openCase(trigger) {
    if (!modal) return;
    returnFocus = trigger;
    title.textContent = trigger.dataset.caseTitle || '';
    levelFields.forEach(field => field.textContent = trigger.dataset.caseLevel || 'Portfolio Artifact');
    discipline.textContent = trigger.dataset.caseDiscipline || '';
    summary.textContent = trigger.dataset.caseSummary || '';
    deliverables.textContent = trigger.dataset.caseDeliverables || 'Selected project artifacts';
    treatment.textContent = trigger.dataset.caseTreatment || 'Detailed case-study media will be added when the final artifacts are supplied.';
    const accent = trigger.dataset.caseAccent || '#13d8ee';
    top?.style.setProperty('--ca', accent);
    if (trigger.dataset.caseUrl) {
      link.href = trigger.dataset.caseUrl;
      link.classList.add('visible');
    } else {
      link.removeAttribute('href');
      link.classList.remove('visible');
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
    const slug = trigger.dataset.caseSlug;
    if (slug) history.replaceState(null,'','#' + slug);
  }

  function closeCase() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    history.replaceState(null,'',window.location.pathname);
    returnFocus?.focus?.();
  }

  const caseTriggers = [...document.querySelectorAll('.feature-project[data-case-title], .work-item[data-case-title], .identity-tile[data-case-title]')];
  caseTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openCase(trigger));
  });
  closeBtn?.addEventListener('click', closeCase);
  modal?.addEventListener('click', e => { if (e.target === modal) closeCase(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeCase();
  });

  const slug = location.hash.replace('#','');
  if (slug) {
    const trigger = caseTriggers.find(el => el.dataset.caseSlug === slug);
    if (trigger) setTimeout(() => openCase(trigger), 120);
  }
})();