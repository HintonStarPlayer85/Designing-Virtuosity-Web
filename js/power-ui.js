(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pointer tilt gives the philosophy cards and footer CTA a responsive physical feel.
  document.querySelectorAll('[data-tilt]').forEach(card => {
    if (reduced) return;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - .5) * 8;
      const rx = (.5 - py) * 8;
      card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
      card.style.setProperty('--gx','80%');
      card.style.setProperty('--gy','18%');
    });
  });

  // Slight depth shift on the large circular DV mark.
  const brandStage = document.querySelector('.established-mark');
  if (brandStage && !reduced) {
    brandStage.addEventListener('pointermove', e => {
      const r = brandStage.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width-.5)*18;
      const y = ((e.clientY-r.top)/r.height-.5)*18;
      brandStage.style.setProperty('--logo-x',x+'px');
      brandStage.style.setProperty('--logo-y',y+'px');
      const mark = brandStage.querySelector('.about-emblem');
      if(mark) mark.style.transform = 'translate3d('+x+'px,'+y+'px,0)';
    });
    brandStage.addEventListener('pointerleave', () => {
      const mark = brandStage.querySelector('.about-emblem');
      if(mark) mark.style.transform = '';
    });
  }
})();