import { initNavScroll, initNavActive } from './nav.js';
import { initReveal } from './reveal.js';
import { initParticles } from './particles.js';

initNavScroll();
initNavActive();
initReveal();
initParticles();

document.getElementById('copyright-year').textContent = new Date().getFullYear();
