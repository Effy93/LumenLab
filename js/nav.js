/* ─── NAV : état scrollé ──────────────────────────── */
export function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const sync = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ─── NAV : lien actif au scroll ─────────────────── */
export function initNavActive() {
  const links    = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  if (!links.length || !sections.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach(a => {
          const active = a.getAttribute('href') === '#' + id;
          a.classList.toggle('active', active);
          a.setAttribute('aria-current', active ? 'page' : 'false');
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(s => io.observe(s));
}
