const form = document.getElementById('contact-form');
const note = document.getElementById('note');
const btn = document.getElementById('submit');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form || !note || !btn) return;

    // honeypot -> drop
    const bot = form.elements.namedItem('botcheck');
    if (bot && bot.checked) return;

    note.textContent = '';
    note.removeAttribute('data-state');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({ success: res.ok }));
      if (res.ok && data.success) {
        form.reset();
        note.textContent = 'Thanks, message sent. I’ll reply soon.';
        note.setAttribute('data-state', 'ok');
        btn.textContent = 'Sent';
      } else {
        throw new Error(data.message || 'bad response');
      }
    } catch {
      note.textContent = 'Something went wrong. Email me directly instead.';
      note.setAttribute('data-state', 'error');
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  });
}
