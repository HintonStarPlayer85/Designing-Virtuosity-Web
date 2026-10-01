(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const experience = document.querySelector('.portfolio-experience');
  const rain = document.querySelector('.digital-rain');
  const brandColors = ['#13d8ee','#199df0','#ff1188','#8b4cff','#73e52d','#ff9128'];

  // Performance-tuned 5D Chromatic Rain Field.
  // The visual depth stays intact, but construction is deferred and all movement is compositor-first.
  let rainActive = false;

  const initFiveDRain = () => {
    if (!rain || !experience || reduced || rain.dataset.ready === 'true') return;
    rain.dataset.ready = 'true';
    rain.classList.add('five-d-rain','five-d-rain--optimized');
    document.body.appendChild(rain);

    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const compact = window.innerWidth < 760;
    const quality = compact || cores <= 4 || memory <= 4 ? 'low' : (cores >= 8 && memory >= 8 && window.innerWidth >= 1180 ? 'high' : 'medium');

    const configs = {
      high: {
        far:  {count:18,size:[1.2,2.4],opacity:[.07,.15],duration:[11,19],scale:[.58,.82],z:[-380,-220]},
        mid:  {count:14,size:[2.1,4.3],opacity:[.1,.22],duration:[9,16],scale:[.82,1.12],z:[-120,60]},
        near: {count:9,size:[4.0,7.4],opacity:[.13,.27],duration:[8,13],scale:[1.05,1.45],z:[100,250]},
        prisms:5,flares:5
      },
      medium: {
        far:  {count:14,size:[1.2,2.3],opacity:[.06,.13],duration:[12,20],scale:[.6,.8],z:[-360,-220]},
        mid:  {count:10,size:[2.0,4.0],opacity:[.09,.2],duration:[10,17],scale:[.84,1.08],z:[-110,50]},
        near: {count:6,size:[3.8,6.8],opacity:[.11,.23],duration:[9,14],scale:[1.03,1.36],z:[90,220]},
        prisms:4,flares:4
      },
      low: {
        far:  {count:9,size:[1.2,2.1],opacity:[.05,.11],duration:[13,21],scale:[.62,.78],z:[-340,-220]},
        mid:  {count:7,size:[2.0,3.6],opacity:[.08,.17],duration:[11,18],scale:[.86,1.04],z:[-100,40]},
        near: {count:4,size:[3.5,6.0],opacity:[.1,.19],duration:[10,15],scale:[1,1.28],z:[80,190]},
        prisms:2,flares:2
      }
    };
    const config = configs[quality];
    rain.dataset.quality = quality;

    const rand=(a,b)=>a+Math.random()*(b-a);
    const makePlane=depth=>{
      const plane=document.createElement('div');
      plane.className='rain-plane rain-plane--'+depth;
      plane.dataset.depth=depth;
      rain.appendChild(plane);
      return plane;
    };
    const planes={far:makePlane('far'),mid:makePlane('mid'),near:makePlane('near')};

    ['far','mid','near'].forEach(depth=>{
      const cfg=config[depth];
      const fragment=document.createDocumentFragment();
      for(let i=0;i<cfg.count;i++){
        const drop=document.createElement('span');
        drop.className='rain-drop';
        drop.style.setProperty('--x',rand(-3,103).toFixed(2)+'%');
        drop.style.setProperty('--s',rand(cfg.size[0],cfg.size[1]).toFixed(2)+'px');
        drop.style.setProperty('--o',rand(cfg.opacity[0],cfg.opacity[1]).toFixed(3));
        drop.style.setProperty('--d',rand(cfg.duration[0],cfg.duration[1]).toFixed(2)+'s');
        drop.style.setProperty('--delay',(-rand(0,18)).toFixed(2)+'s');
        drop.style.setProperty('--drift',rand(-90,90).toFixed(1)+'px');
        drop.style.setProperty('--scale',rand(cfg.scale[0],cfg.scale[1]).toFixed(2));
        drop.style.setProperty('--z',rand(cfg.z[0],cfg.z[1]).toFixed(1)+'px');
        drop.style.setProperty('--tilt',rand(-7,7).toFixed(1)+'deg');
        drop.style.setProperty('--c',brandColors[Math.floor(Math.random()*brandColors.length)]);
        fragment.appendChild(drop);
      }
      planes[depth].appendChild(fragment);
    });

    for(let i=0;i<config.prisms;i++){
      const prism=document.createElement('span');
      prism.className='rain-prism';
      prism.style.setProperty('--x',rand(4,94).toFixed(2)+'%');
      prism.style.setProperty('--w',rand(24,50).toFixed(1)+'px');
      prism.style.setProperty('--h',rand(62,136).toFixed(1)+'px');
      prism.style.setProperty('--o',rand(.06,.13).toFixed(3));
      prism.style.setProperty('--hue',rand(-14,14).toFixed(1)+'deg');
      prism.style.setProperty('--d',rand(12,20).toFixed(2)+'s');
      prism.style.setProperty('--delay',(-rand(0,20)).toFixed(2)+'s');
      prism.style.setProperty('--drift',rand(-115,115).toFixed(1)+'px');
      prism.style.setProperty('--c',brandColors[Math.floor(Math.random()*brandColors.length)]);
      prism.style.setProperty('--c2',brandColors[Math.floor(Math.random()*brandColors.length)]);
      planes.near.appendChild(prism);
    }

    for(let i=0;i<config.flares;i++){
      const flare=document.createElement('span');
      flare.className='rain-depth-flare';
      flare.style.setProperty('--x',rand(4,94).toFixed(2)+'%');
      flare.style.setProperty('--y',rand(6,90).toFixed(2)+'%');
      flare.style.setProperty('--size',rand(110,220).toFixed(1)+'px');
      flare.style.setProperty('--o',rand(.018,.05).toFixed(3));
      flare.style.setProperty('--d',rand(7,14).toFixed(2)+'s');
      flare.style.setProperty('--delay',(-rand(0,10)).toFixed(2)+'s');
      flare.style.setProperty('--c',brandColors[Math.floor(Math.random()*brandColors.length)]);
      rain.appendChild(flare);
    }

    const cursorGlow=document.createElement('span');
    cursorGlow.className='rain-cursor-glow';
    rain.appendChild(cursorGlow);

    const observer=new IntersectionObserver(entries=>{
      rainActive=entries.some(entry=>entry.isIntersecting);
      rain.classList.toggle('is-active',rainActive);
    },{rootMargin:'160px 0px 160px 0px',threshold:0});
    observer.observe(experience);

    let pointerRAF=0;
    let px=window.innerWidth*.5;
    let py=window.innerHeight*.42;
    const renderPointer=()=>{
      pointerRAF=0;
      const nx=px/window.innerWidth-.5;
      const ny=py/window.innerHeight-.5;
      planes.far.style.transform='translate3d('+(nx*6).toFixed(1)+'px,'+(ny*4).toFixed(1)+'px,-320px) scale(1.1)';
      planes.mid.style.transform='translate3d('+(nx*13).toFixed(1)+'px,'+(ny*8).toFixed(1)+'px,-70px) scale(1.04)';
      planes.near.style.transform='translate3d('+(nx*24).toFixed(1)+'px,'+(ny*15).toFixed(1)+'px,150px) scale(1.025)';
      cursorGlow.style.transform='translate3d('+(px-180).toFixed(1)+'px,'+(py-180).toFixed(1)+'px,0)';
    };
    window.addEventListener('pointermove',e=>{
      if(!rainActive) return;
      px=e.clientX;py=e.clientY;
      if(!pointerRAF) pointerRAF=requestAnimationFrame(renderPointer);
    },{passive:true});
    renderPointer();
  };

  if (rain && experience && !reduced) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initFiveDRain,{timeout:450});
    } else {
      setTimeout(initFiveDRain,40);
    }
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
  const challenge = modal?.querySelector('[data-case-challenge]');
  const approach = modal?.querySelector('[data-case-approach]');
  const solution = modal?.querySelector('[data-case-solution]');
  const challengeBlock = modal?.querySelector('[data-case-block="challenge"]');
  const approachBlock = modal?.querySelector('[data-case-block="approach"]');
  const solutionBlock = modal?.querySelector('[data-case-block="solution"]');
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

    const setStoryBlock = (field, block, value) => {
      const copy = String(value || '').trim();
      if (field) field.textContent = copy;
      if (block) block.hidden = !copy;
    };

    const fallbackTreatment = trigger.dataset.caseTreatment || '';
    setStoryBlock(challenge, challengeBlock, trigger.dataset.caseChallenge);
    setStoryBlock(approach, approachBlock, trigger.dataset.caseApproach);
    setStoryBlock(
      solution,
      solutionBlock,
      trigger.dataset.caseSolution || fallbackTreatment || 'Detailed project solution information will be added with the final approved case-study assets.'
    );

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