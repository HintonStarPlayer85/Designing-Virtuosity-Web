(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // FAQ accordion: one open at a time keeps the section compact and intentional.
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (!button) return;
    button.addEventListener('click', () => {
      const opening = !item.classList.contains('open');
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded','false');
      });
      if (opening) {
        item.classList.add('open');
        button.setAttribute('aria-expanded','true');
      }
    });
  });

  // Pointer-responsive depth for client and differentiator cards.
  if (!reduced) {
    document.querySelectorAll('[data-services-tilt]').forEach(card => {
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
        card.style.setProperty('--gx','82%');
        card.style.setProperty('--gy','16%');
      });
    });
  }
})();