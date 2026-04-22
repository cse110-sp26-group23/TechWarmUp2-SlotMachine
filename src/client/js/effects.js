/**
 * @fileoverview Visual effects and flair system for win celebrations.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * All effects are purely DOM/CSS-based — no canvas required.
 * The container div (#particlesContainer) is declared in index.html.
 *
 * Public API:
 *   addScreenFlash()      — brief full-screen overlay tint for big/jackpot wins
 *   spawnConfetti()       — animated falling particles for jackpot wins
 *   spawnBouncingBalls()  — 🏀 bouncing basketball emoji elements
 *   spawnLightBursts()    — radial color burst overlays
 *   showSlamText()        — large basketball-themed win message overlay
 */

const CONFETTI_COLORS = ['#f26522', '#ffd700', '#1d428a', '#f0ede8', '#4caf50'];
const CONFETTI_COUNT = 60;

const BURST_COLORS = ['#ff6b1a', '#ffcc00', '#1565ff', '#c8960c'];

const SLAM_MESSAGES = {
  jackpot: ['CHAMPIONSHIP!', 'BUZZER BEATER!', 'SLAM DUNK!', 'NOTHING BUT NET!'],
  big:     ['FROM DOWNTOWN!', 'AND ONE!', 'SLAM DUNK!'],
  small:   ['NICE SHOT!', 'AND 1!', 'GOOD PLAY!'],
};

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

/**
 * Spawns bouncing basketball emoji elements across the screen using GSAP.
 * @param {number} [count=6] - Number of balls to spawn.
 */
function spawnBouncingBalls(count = 6) {
  const container = getContainer();

  for (let i = 0; i < count; i++) {
    const ball = document.createElement('div');
    ball.textContent = '🏀';
    ball.setAttribute('aria-hidden', 'true');
    ball.style.cssText = 'position:absolute;font-size:2.5rem;pointer-events:none;';
    container.appendChild(ball);

    const startX = (10 + Math.random() * 80) + 'vw';
    const startY = '110vh';
    const peakY  = (10 + Math.random() * 40) + 'vh';

    gsap.set(ball, { x: startX, y: startY });

    const tl = gsap.timeline({ delay: i * 0.12, onComplete: () => ball.remove() });
    tl.to(ball, { y: peakY, duration: 0.55, ease: 'power2.out', rotation: -180 })
      .to(ball, { y: startY, duration: 0.55, ease: 'bounce.out', rotation: -360 });
  }
}

/**
 * Spawns radial light-burst overlays at random positions.
 */
function spawnLightBursts() {
  const container = getContainer();

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const burst = document.createElement('div');
      burst.className = 'light-burst';
      burst.setAttribute('aria-hidden', 'true');

      const left = 20 + Math.random() * 60;
      const top  = 20 + Math.random() * 60;
      const size = 80 + Math.random() * 160;
      const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
      const duration = 600 + Math.random() * 400;

      burst.style.cssText = `
        left: ${left}vw;
        top: ${top}vh;
        width: ${size}px;
        height: ${size}px;
        transform: translate(-50%, -50%) scale(0);
        background: radial-gradient(circle, ${color}88 0%, transparent 70%);
        --burst-duration: ${duration}ms;
      `;

      container.appendChild(burst);
      burst.addEventListener('animationend', () => burst.remove(), { once: true });
    }, i * 80);
  }
}

/**
 * Displays a large basketball-themed win message overlay using a GSAP timeline.
 * @param {'jackpot'|'big'|'small'} tier - Win tier determining the message pool and style.
 */
function showSlamText(tier) {
  const pool = SLAM_MESSAGES[tier] ?? SLAM_MESSAGES.small;
  const message = pool[Math.floor(Math.random() * pool.length)];

  const el = document.createElement('div');
  el.className = `slam-text${tier === 'small' ? ' slam-text--subtle' : ''}`;
  el.textContent = message;
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  const displayMs = tier === 'small' ? 1200 : 2000;

  gsap.set(el, { xPercent: -50 });
  gsap.timeline()
    .fromTo(el, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' })
    .to(el, { scale: 0.8, opacity: 0, duration: 0.25, ease: 'power2.in', delay: displayMs / 1000, onComplete: () => el.remove() });
}

export { addScreenFlash, spawnConfetti, spawnBouncingBalls, spawnLightBursts, showSlamText };
