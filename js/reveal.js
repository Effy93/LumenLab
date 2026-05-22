/* ─── REVEAL : apparition au scroll ──────────────── */
export function initReveal() {
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (!reveals.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('pre');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  reveals.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top >= window.innerHeight || r.bottom <= 0) {
      el.classList.add('pre');
      io.observe(el);
    }
  });
}
