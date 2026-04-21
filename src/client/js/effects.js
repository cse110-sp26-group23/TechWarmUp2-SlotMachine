/**
 * @fileoverview Visual effects and flair system for win celebrations.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * All effects are purely DOM/CSS-based — no canvas required.
 * The container div (#particlesContainer) is declared in index.html.
 *
 * Public API:
 *   addScreenFlash()  — brief full-screen overlay tint for big/jackpot wins
 *   spawnConfetti()   — animated falling particles for jackpot wins
 */

const CONFETTI_COLORS = ['#f26522', '#ffd700', '#1d428a', '#f0ede8', '#4caf50'];
const CONFETTI_COUNT = 60;

/**
 * Returns the shared particles container element.
 * @returns {HTMLElement}
 */
function getContainer() {
  return document.getElementById('particlesContainer');
}

/**
 * Briefly overlays a full-screen gold flash for high-tier wins.
 */
function addScreenFlash() {
  const flash = document.createElement('div');
  flash.className = 'screen-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1200);
}

/**
 * Spawns animated confetti particles for jackpot wins.
 * Particles are removed from the DOM after their animation ends.
 */
function spawnConfetti() {
  const container = getContainer();

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const x = Math.random() * 100;
      const duration = 1800 + Math.random() * 1400;
      const size = 6 + Math.random() * 10;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

      particle.style.cssText = `
        left: ${x}vw;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        animation-duration: ${duration}ms;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;

      container.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }, i * 25);
  }
}

export { addScreenFlash, spawnConfetti };
