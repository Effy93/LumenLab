import { requestLeave, isExternalRoute } from './leaveModal.js';

export function initProjectGalaxy() {
  const section = document.getElementById('projets');
  if (!section || !window.gsap) return;

  const carousel  = section.querySelector('.galaxy-carousel');
  const cards     = Array.from(section.querySelectorAll('.galaxy-card'));
  const prevBtn   = section.querySelector('.gx-prev');
  const nextBtn   = section.querySelector('.gx-next');
  const currentEl = section.querySelector('.gx-current');
  const bgEl      = section.querySelector('.galaxy-bg');
  const orbitsEl  = section.querySelector('.galaxy-orbits');

  if (!cards.length) return;

  const total = cards.length;
  let activeIndex = 0;
  let isAnimating = false;
  let isDragging  = false;
  let wheelThrottle = false;
  const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Init ───────────────────────────────────────────────

  cards.forEach((card, i) => { card.dataset.index = i; });

  generateStars(bgEl, 65);
  setPositions(false);
  updateUI();

  // Orbites fade-in au scroll
  if (orbitsEl && !prefersRM) {
    observeEntry(orbitsEl, () => orbitsEl.classList.add('visible'));
  }

  // Animate-in à l'entrée dans le viewport
  if (!prefersRM) {
    gsap.set(cards, { opacity: 0 });
    observeEntry(section, animateIn, 0.12);
  }

  // ── Listeners ──────────────────────────────────────────

  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  cards.forEach((card, i) => {
    card.addEventListener('click', e => onCardClick(e, i));
    card.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1);  }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        i !== activeIndex ? goToCard(i) : openActive();
      }
    });
  });

  // Touch swipe
  let touchX = 0, touchY = 0;
  carousel.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = touchX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 42 && Math.abs(dx) > dy * 1.2) navigate(dx > 0 ? 1 : -1);
  }, { passive: true });

  // Mouse drag
  carousel.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    let moved = false;

    const onMove = mv => {
      if (Math.abs(mv.clientX - startX) > 8) {
        moved = true;
        carousel.classList.add('is-dragging');
      }
    };
    const onUp = up => {
      const dx = startX - up.clientX;
      if (moved && Math.abs(dx) > 44) navigate(dx > 0 ? 1 : -1);
      carousel.classList.remove('is-dragging');
      // Marque isDragging pour que onCardClick ignore ce clic
      isDragging = moved;
      requestAnimationFrame(() => { isDragging = false; });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Swipe horizontal trackpad (ne bloque pas le scroll vertical)
  section.addEventListener('wheel', e => {
    const isH = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5;
    if (!isH) return;
    e.preventDefault();
    if (wheelThrottle) return;
    wheelThrottle = true;
    navigate(e.deltaX > 0 ? 1 : -1);
    setTimeout(() => { wheelThrottle = false; }, 680);
  }, { passive: false });

  window.addEventListener('resize', debounce(() => setPositions(false), 160));

  // ── Navigation ─────────────────────────────────────────

  function navigate(dir) {
    if (isAnimating) return;
    activeIndex = (activeIndex + dir + total) % total;
    setPositions(true);
    updateUI();
  }

  function goToCard(i) {
    if (isAnimating || i === activeIndex) return;
    activeIndex = i;
    setPositions(true);
    updateUI();
  }

  function onCardClick(e, i) {
    if (isDragging) return;
    if (i !== activeIndex) {
      goToCard(i);
      return;
    }
    // Carte active : si pas sur un lien, naviguer via data-route
    if (!e.target.closest('a[href]')) openActive();
  }

  function openActive() {
    const route = cards[activeIndex]?.dataset.route;
    if (!route) return;
    // Univers externe → interstitiel « Caro » avant de partir.
    if (isExternalRoute(route)) { requestLeave(route); return; }
    window.location.href = route;
  }

  // ── Calcul positions ───────────────────────────────────

  function getDelta(i) {
    let d = i - activeIndex;
    if (d >  total / 2) d -= total;
    if (d <= -total / 2) d += total;
    return d;
  }

  function getCardWidth() {
    const vw = window.innerWidth;
    if (vw >= 1400) return 360;
    if (vw >= 1200) return 340;
    if (vw >= 768)  return 300;
    return Math.min(vw * 0.84, 300);
  }

  function getPosition(delta) {
    const abs  = Math.abs(delta);
    const sign = Math.sign(delta) || 1;
    const vw   = window.innerWidth;
    const isDesktop = vw >= 768;
    const cw   = getCardWidth();

    let spacing;
    if (isDesktop) {
      // Espacement desktop : card voisine partiellement visible
      spacing = cw * 1.14;
    } else {
      // Mobile : formule pour que la carte voisine dépasse légèrement
      const adjScale = 0.78;
      spacing = cw / 2 + 28 + (cw * adjScale) / 2;
    }

    if (abs === 0) return { x: 0,                   scale: 1,    opacity: 1,    ry: 0,                z: 10, blur: 0   };
    if (abs === 1) return { x: sign * spacing,       scale: 0.79, opacity: 0.55, ry: isDesktop ? sign * -9  : 0, z: 7,  blur: 1.5 };
    if (abs === 2) return { x: sign * spacing * 1.8, scale: 0.61, opacity: 0.18, ry: isDesktop ? sign * -16 : 0, z: 4,  blur: 3   };
    return                { x: sign * spacing * 2.6, scale: 0.46, opacity: 0,    ry: 0,                z: 1,  blur: 5   };
  }

  function setPositions(animate) {
    if (animate && !prefersRM) isAnimating = true;
    let done = 0;

    cards.forEach((card, i) => {
      const delta    = getDelta(i);
      const pos      = getPosition(delta);
      const isActive = delta === 0;

      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden',  isActive ? 'false' : 'true');
      card.setAttribute('tabindex',     isActive ? '0' : '-1');
      card.setAttribute('aria-current', isActive ? 'true' : 'false');

      const props = {
        x:      pos.x,
        scale:  pos.scale,
        opacity: pos.opacity,
        rotateY: pos.ry,
        filter: `blur(${pos.blur}px)`,
        zIndex: pos.z,
      };

      if (animate && !prefersRM) {
        gsap.to(card, {
          ...props,
          duration: 0.62,
          ease: 'power3.out',
          onComplete: () => {
            done++;
            if (done === total) isAnimating = false;
          },
        });
      } else {
        gsap.set(card, props);
        isAnimating = false;
      }
    });

    // Réactualise l'accent du glow central
    updateAccent();
  }

  // ── UI helpers ─────────────────────────────────────────

  function updateUI() {
    if (currentEl) currentEl.textContent = String(activeIndex + 1).padStart(2, '0');
  }

  function updateAccent() {
    const cls   = [...cards[activeIndex].classList].find(c => c.startsWith('g-')) || 'g-gold';
    const accent = cls.replace('g-', '');
    section.dataset.accent = accent;
  }

  // ── Animation d'entrée ─────────────────────────────────

  function animateIn() {
    const header   = section.querySelector('.galaxy-header');
    const controls = section.querySelector('.galaxy-controls');
    const hint     = section.querySelector('.galaxy-hint');
    const tl       = gsap.timeline({ delay: 0.08 });

    if (header?.children.length) {
      tl.from(Array.from(header.children), {
        opacity: 0, y: 18, stagger: 0.09, duration: 0.75, ease: 'power2.out',
      });
    }

    // Cartes : apparaissent dans l'ordre visuel (centre en dernier)
    const sorted = [...cards].sort((a, b) => {
      return Math.abs(getDelta(+b.dataset.index)) - Math.abs(getDelta(+a.dataset.index));
    });

    tl.to(sorted, {
      opacity: i => getPosition(getDelta(+sorted[i].dataset.index)).opacity,
      stagger: { each: 0.08, from: 'start' },
      duration: 0.65,
      ease: 'power2.out',
    }, '-=0.45');

    if (controls) tl.from(controls, { opacity: 0, y: 8, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    if (hint)     tl.from(hint,     { opacity: 0,       duration: 0.5, ease: 'power2.out' }, '-=0.25');
  }

  // ── Utilitaires ────────────────────────────────────────

  function observeEntry(el, cb, threshold = 0.15) {
    if (!window.IntersectionObserver) { cb(); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { cb(); obs.disconnect(); } });
    }, { threshold });
    obs.observe(el);
  }

  function generateStars(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s    = document.createElement('span');
      s.className = 'gx-star';
      const big  = Math.random() < 0.18;
      const op   = (Math.random() * 0.45 + 0.12).toFixed(2);
      const dur  = (Math.random() * 3.5 + 2).toFixed(1);
      const del  = (Math.random() * 5).toFixed(2);
      s.style.cssText = [
        `left:${(Math.random() * 100).toFixed(1)}%`,
        `top:${(Math.random() * 100).toFixed(1)}%`,
        `width:${big ? 2 : 1}px`,
        `height:${big ? 2 : 1}px`,
        `--star-opacity:${op}`,
        `--star-dur:${dur}s`,
        `animation-delay:${del}s`,
      ].join(';');
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }
}
