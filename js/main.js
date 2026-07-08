import { initNavScroll, initNavActive } from './nav.js';
import { initReveal } from './reveal.js';
import { initParticles } from './particles.js';
import { initProjectGalaxy } from './projectGalaxy.js';
import { initLeaveModal } from './leaveModal.js';

initNavScroll();
initNavActive();
initReveal();
initParticles();
initLeaveModal();
initProjectGalaxy();

document.getElementById('copyright-year').textContent = new Date().getFullYear();
