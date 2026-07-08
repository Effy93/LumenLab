/* ─── Page mentions légales ───────────────────────────
   Réutilise l'effet de nav scrollée du site et met à jour
   l'année du copyright. Aucune dépendance lourde. */
import { initNavScroll } from './nav.js';

initNavScroll();

const year = document.getElementById('copyright-year');
if (year) year.textContent = new Date().getFullYear();
