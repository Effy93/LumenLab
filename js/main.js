import { initNavScroll, initNavActive } from './nav.js';
import { initReveal } from './reveal.js';
import { initParticles } from './particles.js';
import { initProjectGalaxy } from './projectGalaxy.js';

initNavScroll();
initNavActive();
initReveal();
initParticles();
initProjectGalaxy();

document.getElementById('copyright-year').textContent = new Date().getFullYear();
