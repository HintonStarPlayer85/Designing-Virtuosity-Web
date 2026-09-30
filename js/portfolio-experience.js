(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const experience = document.querySelector('.portfolio-experience');
  const rain = document.querySelector('.digital-rain');
  const brandColors = ['#13d8ee','#199df0','#ff1188','#8b4cff','#73e52d','#ff9128'];

  // 5D Chromatic Rain Field: three depth planes + refractive prism droplets + pointer parallax.
  if (rain && experience && !reduced) {
    rain.classList.add('five-d-rain');
    document.body.appendChild(rain);

    const depthConfig = {
      far:  { count: Math.min(44, Math.max(24, Math.round(window.innerWidth / 34))), size:[1.2,2.6], opacity:[.08,.18], blur:[.4,1.15], duration:[10,18], scale:[.55,.85], z:[-420,-220] },
      mid:  { count: Math.min(36, Math.max(22, Math.round(window.innerWidth / 42))), size:[2.2,4.8], opacity:[.12,.27], blur:[0,.65],  duration:[8,15],  scale:[.8,1.18],  z:[-130,70] },
      near: { count: Math.min(24, Math.max(14, Math.round(window.innerWidth / 60))), size:[4.2,8.8], opacity:[.14,.31], blur:[0,.45],  duration:[7,12],  scale:[1.05,1.65], z:[110,320] }
    };

    const rand = (a,b) => a + Math.random() * (b-a);
    const makePlane = depth => {
      const plane = document.createElement('div');
      plane.className = 'rain-plane rain-plane--' + depth;
      plane.dataset.depth = depth;
      rain.appendChild(plane);
      return plane;
    };

    const planes = {
      far: makePlane('far'),
      mid: makePlane('mid'),
      near: makePlane('near')
    };

    Object.entries(depthConfig).forEach(([depth,cfg]) => {
      const fragment = document.createDocumentFragment();
      for (let i=0;i<cfg.count;i++) {
        const drop = document.createElement('span');
        drop.className = 'rain-drop';
        drop.style.setProperty('--x', rand(-3,103).toFixed(2) + '%');
        drop.style.setProperty('--s', rand(cfg.size[0],cfg.size[1]).toFixed(2) + 'px');
        drop.style.setProperty('--o', rand(cfg.opacity[0],cfg.opacity[1]).toFixed(3));
        drop.style.setProperty('--b', rand(cfg.blur[0],cfg.blur[1]).toFixed(2) + 'px');
        drop.style.setProperty('--d', rand(cfg.duration[0],cfg.duration[1]).toFixed(2) + 's');
        drop.style.setProperty('--delay', (-rand(0,18)).toFixed(2) + 's');
        drop.style.setProperty('--drift', rand(-95,95).toFixed(1) + 'px');
        drop.style.setProperty('--scale', rand(cfg.scale[0],cfg.scale[1]).toFixed(2));
        drop.style.setProperty('--z', rand(cfg.z[0],cfg.z[1]).toFixed(1) + 'px');
        drop.style.setProperty('--tilt', rand(-8,8).toFixed(1) + 'deg');
        drop.style.setProperty('--c', brandColors[Math.floor(Math.random()*brandColors.length)]);
        fragment.appendChild(drop);
      }
      planes[depth].appendChild(fragment);
    });

    // Large refractive droplets occupy the foreground and distort whatever passes behind them.
    const prismCount = window.innerWidth < 700 ? 4 : 9;
    for (let i=0;i<prismCount;i++) {
      const prism = document.createElement('span');
      prism.className = 'rain-prism';
      prism.style.setProperty('--x', rand(3,94).toFixed(2) + '%');
      prism.style.setProperty('--w', rand(22,56).toFixed(1) + 'px');
      prism.style.setProperty('--h', rand(58,154).toFixed(1) + 'px');
      prism.style.setProperty('--o', rand(.07,.17).toFixed(3));
      prism.style.setProperty('--blur', rand(.15,.7).toFixed(2) + 'px');
      prism.style.setProperty('--hue', rand(-16,16).toFixed(1) + 'deg');
      prism.style.setProperty('--d', rand(11,19).toFixed(2) + 's');
      prism.style.setProperty('--delay', (-rand(0,20)).toFixed(2) + 's');
      prism.style.setProperty('--drift', rand(-125,125).toFixed(1) + 'px');
      prism.style.setProperty('--c', brandColors[Math.floor(Math.random()*brandColors.length)]);
      prism.style.setProperty('--c2', brandColors[Math.floor(Math.random()*brandColors.length)]);
      planes.near.appendChild(prism);
    }

    // Soft depth flares create volumetric color between the rain planes.
    for (let i=0;i<10;i++) {
      const flare = document.createElement('span');
      flare.className = 'rain-depth-flare';
      flare.style.setProperty('--x', rand(2,96).toFixed(2) + '%');
      flare.style.setProperty('--y', rand(2,92).toFixed(2) + '%');
      flare.style.setProperty('--size', rand(90,240).toFixed(1) + 'px');
      flare.style.setProperty('--blur', rand(18,42).toFixed(1) + 'px');
      flare.style.setProperty('--o', rand(.025,.075).toFixed(3));
      flare.style.setProperty('--d', rand(6,13).toFixed(2) + 's');
      flare.style.setProperty('--delay', (-rand(0,10)).toFixed(2) + 's');
      flare.style.setProperty('--c', brandColors[Math.floor(Math.random()*brandColors.length)]);
      rain.appendChild(flare);
    }

    // Activate only while the Portfolio experience is in the viewport, preserving the locked Hero/CTA/Footer.
    const updateRainVisibility = () => {
      const r = experience.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      rain.classList.toggle('is-active', visible);
    };
    updateRainVisibility();
    window.addEventListener('scroll', updateRainVisibility, {passive:true});
    window.addEventListener('resize', updateRainVisibility, {passive:true});

    // Pointer movement bends the rain field across three different apparent depths.
    let tx=0,ty=0,cx=0,cy=0,raf=0;
    const renderParallax = () => {
      cx += (tx-cx) * .085;
      cy += (ty-cy) * .085;
      rain.style.setProperty('--far-x',(cx*5).toFixed(2)+'px');
      rain.style.setProperty('--far-y',(cy*3).toFixed(2)+'px');
      rain.style.setProperty('--mid-x',(cx*12).toFixed(2)+'px');
      rain.style.setProperty('--mid-y',(cy*7).toFixed(2)+'px');
      rain.style.setProperty('--near-x',(cx*24).toFixed(2)+'px');
      rain.style.setProperty('--near-y',(cy*15).toFixed(2)+'px');
      if (Math.abs(tx-cx)>.002 || Math.abs(ty-cy)>.002) raf=requestAnimationFrame(renderParallax);
      else raf=0;
    };
    window.addEventListener('pointermove', e => {
      tx=(e.clientX/window.innerWidth-.5)*2;
      ty=(e.clientY/window.innerHeight-.5)*2;
      rain.style.setProperty('--pointer-x',(e.clientX/window.innerWidth*100).toFixed(1)+'%');
      rain.style.setProperty('--pointer-y',(e.clientY/window.innerHeight*100).toFixed(1)+'%');
      if(!raf) raf=requestAnimationFrame(renderParallax);
    }, {passive:true});
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