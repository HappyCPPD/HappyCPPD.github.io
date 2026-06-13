// Mobile nav toggle. Served from /public as an external, same-origin script
// so it satisfies the site's strict `script-src 'self'` CSP.

const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('nav-menu');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    if (menu) menu.setAttribute('data-open', String(!open));
  });
}
