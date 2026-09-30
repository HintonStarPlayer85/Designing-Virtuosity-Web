(() => {
  const filters = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.project-card')];
  const modal = document.querySelector('.modal');
  const closeBtn = document.querySelector('.modal-close');
  const modalHero = document.querySelector('.modal-hero');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalCategory = document.querySelector('[data-modal-category]');
  const modalYear = document.querySelector('[data-modal-year]');
  const modalChallenge = document.querySelector('[data-modal-challenge]');
  const modalSolution = document.querySelector('[data-modal-solution]');
  const modalDeliverables = document.querySelector('[data-modal-deliverables]');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  function openModal(card) {
    if (!modal) return;
    modalTitle.textContent = card.dataset.title;
    modalCategory.textContent = card.dataset.label;
    modalYear.textContent = card.dataset.year;
    modalChallenge.textContent = card.dataset.challenge;
    modalSolution.textContent = card.dataset.solution;
    modalDeliverables.textContent = card.dataset.deliverables;
    modalHero.className = `modal-hero ${card.dataset.visual}`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    history.replaceState(null, '', `#${card.dataset.slug}`);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname);
  }

  cards.forEach(card => card.addEventListener('click', () => openModal(card)));
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

  const slug = location.hash.replace('#', '');
  if (slug) {
    const card = cards.find(c => c.dataset.slug === slug);
    if (card) openModal(card);
  }
})();
