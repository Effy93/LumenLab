/* Interstitiel « Caro » : confirme avant de quitter LumenLab
   vers un univers externe (AstraLumen). */

let modal, dialog, continueLink;
let pendingUrl = null;
let lastFocused = null;

export function isExternalRoute(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

export function requestLeave(url) {
  if (!url) return;
  // Pas de modal disponible → navigation directe (fallback).
  if (!modal) {
    window.location.href = url;
    return;
  }
  pendingUrl = url;
  if (continueLink) continueLink.href = url;
  open();
}

export function initLeaveModal() {
  modal = document.getElementById('leave-modal');
  if (!modal) return;

  dialog = modal.querySelector('.leave-dialog');
  continueLink = modal.querySelector('.leave-continue');

  // Fermeture : backdrop, bouton « Rester ici ».
  modal.querySelectorAll('[data-leave-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  // « Continuer » : le lien navigue nativement (même onglet).

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') trapFocus(e);
  });

  // Intercepte les liens « Découvrir » externes des cartes projet.
  document.addEventListener('click', e => {
    const link = e.target.closest('a.gc-cta[href]');
    if (!link) return;
    if (!isExternalRoute(link.getAttribute('href'))) return;
    e.preventDefault();
    requestLeave(link.getAttribute('href'));
  }, true);
}

function open() {
  lastFocused = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // focus sur « Continuer »
  requestAnimationFrame(() => continueLink?.focus());
}

function close() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  pendingUrl = null;
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

function trapFocus(e) {
  const focusables = dialog.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last  = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}
