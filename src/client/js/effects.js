/**
 * @fileoverview Visual effects and flair system for win celebrations.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * Confetti uses canvas-confetti (CDN global `confetti`).
 * The container div (#particlesContainer) is declared in index.html and used
 * by spawnBouncingBalls() and spawnLightBursts().
 *
 * Public API:
 *   addScreenFlash()      — brief full-screen overlay tint for big/jackpot wins
 *   spawnConfetti()       — GPU-accelerated confetti cannon for jackpot wins
 *   spawnBouncingBalls()  — 🏀 bouncing basketball emoji elements
 *   spawnLightBursts()    — radial color burst overlays
 *   showSlamText()        — large basketball-themed win message overlay
 */

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
 * Fires a two-cannon + center-burst confetti celebration for jackpot wins.
 * canvas-confetti (global `confetti`) handles canvas creation, physics, and cleanup.
 */
function spawnConfetti() {
  const colors = ['#f26522', '#ffd700', '#1d428a', '#f0ede8', '#4caf50'];
  const shared = { spread: 55, particleCount: 80, colors };

  confetti({ ...shared, angle: 60,  origin: { x: 0,   y: 0.6 } });
  confetti({ ...shared, angle: 120, origin: { x: 1,   y: 0.6 } });

  setTimeout(() => {
    confetti({ ...shared, angle: 90, spread: 120, particleCount: 60, origin: { x: 0.5, y: 0.4 } });
  }, 400);
}

/**
 * Spawns large bouncing basketball emoji elements across the screen using GSAP.
 * @param {number} [count=8] - Number of balls to spawn.
 */
function spawnBouncingBalls(count = 8) {
  const container = getContainer();
  const sizeRem = count >= 12 ? 6 : 4.5;

  for (let i = 0; i < count; i++) {
    const ball = document.createElement('div');
    ball.textContent = '🏀';
    ball.setAttribute('aria-hidden', 'true');
    ball.style.cssText = `position:absolute;font-size:${sizeRem}rem;pointer-events:none;line-height:1;`;
    container.appendChild(ball);

    const startX = (5 + Math.random() * 85) + 'vw';
    const startY = '115vh';
    const peakY  = (5 + Math.random() * 35) + 'vh';
    const doDouble = Math.random() > 0.5;

    gsap.set(ball, { x: startX, y: startY });

    const tl = gsap.timeline({ delay: i * 0.1, onComplete: () => ball.remove() });
    tl.to(ball, { y: peakY, duration: 0.5, ease: 'power2.out', rotation: -180 })
      .to(ball, { y: startY, duration: 0.5, ease: 'bounce.out', rotation: -360 });

    if (doDouble) {
      const peakY2 = (15 + Math.random() * 40) + 'vh';
      tl.to(ball, { y: peakY2, duration: 0.4, ease: 'power2.out', rotation: -540 })
        .to(ball, { y: startY, duration: 0.4, ease: 'bounce.out', rotation: -720 });
    }
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
 * The message renders inside a scoreboard-style panel for the LED/jumbotron look.
 * @param {'jackpot'|'big'|'small'} tier - Win tier determining the message pool and style.
 */
function showSlamText(tier) {
  const pool = SLAM_MESSAGES[tier] ?? SLAM_MESSAGES.small;
  const message = pool[Math.floor(Math.random() * pool.length)];

  const overlay = document.createElement('div');
  overlay.className = `slam-text${tier === 'small' ? ' slam-text--subtle' : ''}`;
  overlay.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('div');
  panel.className = 'slam-text__panel';
  panel.textContent = message;
  overlay.appendChild(panel);

  document.body.appendChild(overlay);

  const displayMs = tier === 'small' ? 1400 : 2200;

  // Use timeline position parameter (+=) not tween delay so the overlay removal
  // fires only after the panel has finished fading, not at the same start position.
  gsap.timeline()
    .fromTo(panel, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.8)' })
    .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 }, '<')
    .to(panel, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' }, `+=${displayMs / 1000}`)
    .to(overlay, { opacity: 0, duration: 0.4, onComplete: () => overlay.remove() }, '<');
}

export { addScreenFlash, spawnConfetti, spawnBouncingBalls, spawnLightBursts, showSlamText };
