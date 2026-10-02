(() => {
  const form = document.querySelector('#project-form');
  const status = document.querySelector('.form-status');
  const submitButton = form?.querySelector('button[type="submit"]');
  if (!form || !status || !submitButton) return;

  const endpoint = 'https://formsubmit.co/ajax/hello@designingvirtuosity.com';

  function setStatus(message, type = '') {
    status.textContent = message;
    status.className = 'form-status' + (type ? ' ' + type : '');
    status.setAttribute('role', type === 'error' ? 'alert' : 'status');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const originalLabel = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending…';
    setStatus('Sending your project inquiry…');

    const data = new FormData(form);
    data.set('_subject', 'New Designing Virtuosity Project Inquiry');
    data.set('_template', 'table');
    data.set('_replyto', data.get('email') || '');
    data.set('_url', window.location.href);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: data
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Submission failed');
      }

      form.reset();
      setStatus('Message sent successfully. Someone will reach out to you within 24 hours.', 'success');
    } catch (error) {
      setStatus('We could not send your inquiry right now. Please email hello@designingvirtuosity.com directly.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }
  });
})();