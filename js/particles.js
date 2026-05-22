/* ─── PARTICULES : hero ───────────────────────────── */
export function initParticles() {
  const host = document.querySelector('.hero-scene');
  if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.className                = 'particle';
    p.setAttribute('aria-hidden', 'true');
    p.style.left               = (40 + Math.random() * 55) + '%';
    p.style.top                = (20 + Math.random() * 60) + '%';
    p.style.animationDelay     = -(Math.random() * 14)     + 's';
    p.style.animationDuration  = (10 + Math.random() * 10) + 's';
    host.appendChild(p);
  }
}
