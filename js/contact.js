(() => {
  const form = document.querySelector('#project-form');
  const status = document.querySelector('.form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Form interface is ready. Connect this form to your preferred GoDaddy/PHP or external form endpoint before launch.';
    status.setAttribute('role', 'status');
  });
})();
