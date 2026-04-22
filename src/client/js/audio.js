/**
 * @fileoverview Sound loading, playback, and mute state for the basketball slot machine.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * Background music is managed by a Howler.js Howl instance (streams bg-music.mp3).
 * Sound effects remain oscillator-based synthesis via Howler's shared AudioContext.
 * Global mute is handled by Howler.mute() which silences all Howl instances at once.
 */

/** Background music Howl — streams instead of decoding the full file upfront. */
const bgMusic = new Howl({
  src: ['assets/audio/bg-music.mp3', 'assets/audio/bg-music.ogg'],
  loop: true,
  volume: 0.12,
  html5: true,
});

bgMusic.on('loaderror', () => {
  // File not available yet — silently ignore
});

/**
 * Returns Howler's shared AudioContext, creating it lazily via Howler's
 * autoplay-unlock mechanism so synthesized tones benefit from the same unlock flow.
 * @returns {AudioContext}
 */
function getAudioContext() {
  return Howler.ctx;
}

/**
 * Generates a short synthesized tone through the shared AudioContext.
 * @param {AudioContext} ctx
 * @param {number} frequency - Hz.
 * @param {number} duration - Seconds.
 * @param {number} [volume=0.3]
 */
function playTone(ctx, frequency, duration, volume = 0.3) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/** Plays the spin start sound (rising two-note sweep). */
function playSpinSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  playTone(ctx, 280, 0.1, 0.18);
  setTimeout(() => playTone(ctx, 420, 0.12, 0.15), 80);
}

/** Plays the per-reel stop tick. */
function playStopTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  playTone(ctx, 580, 0.07, 0.22);
}

/**
 * Plays a tiered win sound matching the win classification.
 * @param {'none'|'small'|'big'|'jackpot'} winTier
 */
function playWinSound(winTier) {
  if (winTier === 'none') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (winTier === 'small') {
    playTone(ctx, 523, 0.14, 0.28);
    setTimeout(() => playTone(ctx, 659, 0.14, 0.28), 140);
  } else if (winTier === 'big') {
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, freq, 0.18, 0.4), i * 130);
    });
  } else if (winTier === 'jackpot') {
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, freq, 0.2, 0.5), i * 140);
    });
  }
}

/**
 * Starts background music. No-op if already playing or globally muted.
 */
function startBackgroundMusic() {
  if (Howler._muted || bgMusic.playing()) return;
  bgMusic.play();
}

/** Stops background music immediately. */
function stopBackgroundMusic() {
  bgMusic.stop();
}

/**
 * Sets the global mute state via Howler, which silences all Howl instances and
 * the synthesized oscillator sounds simultaneously.
 * @param {boolean} muted
 */
function setMuted(muted) {
  Howler.mute(muted);
  if (!muted) startBackgroundMusic();
}

/**
 * Returns the current global mute state.
 * @returns {boolean}
 */
function getMuted() {
  return Howler._muted;
}

export { playSpinSound, playStopTickSound, playWinSound, startBackgroundMusic, stopBackgroundMusic, setMuted, getMuted };
