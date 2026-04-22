/**
 * @fileoverview Sound loading, playback, and mute state for the basketball slot machine.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * All sound effects and background music are managed by Howler.js Howl instances.
 * Global mute is handled by Howler.mute() which silences all Howl instances at once.
 * The riser (chain-build tension) sound remains oscillator-based since no file exists for it.
 */

/** Background music — streamed via html5 to avoid decoding the full file upfront. */
const bgMusic = new Howl({
  src: ['assets/audio/bg-music.mp3'],
  loop: true,
  volume: 0.12,
  html5: true,
});

/** Spin button SFX. */
const sfxSpin = new Howl({ src: ['assets/audio/spin.mp3'], volume: 0.7 });

/** Per-reel stop tick SFX. */
const sfxStopTick = new Howl({ src: ['assets/audio/stop-tick.mp3'], volume: 0.6 });

/** Tiered win SFX. */
const sfxWinSmall   = new Howl({ src: ['assets/audio/win-small.mp3'],   volume: 0.75 });
const sfxWinBig     = new Howl({ src: ['assets/audio/win-big.mp3'],     volume: 0.8 });
const sfxWinJackpot = new Howl({ src: ['assets/audio/win-jackpot.mp3'], volume: 0.9 });

// Silently ignore missing files so the game runs without all assets present
[bgMusic, sfxSpin, sfxStopTick, sfxWinSmall, sfxWinBig, sfxWinJackpot].forEach((h) => {
  h.on('loaderror', () => {});
});

/**
 * Returns Howler's shared AudioContext for oscillator-based synthesis (riser sound).
 * @returns {AudioContext|null}
 */
function getAudioContext() {
  return Howler.ctx;
}

/**
 * Generates a short synthesized tone — used only for the riser effect.
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

/** Plays the spin start sound. */
function playSpinSound() {
  sfxSpin.play();
}

/** Plays the per-reel stop tick. */
function playStopTickSound() {
  sfxStopTick.play();
}

/**
 * Plays a rising tension tone as consecutive payline reels land in a chain.
 * Pitch and volume escalate with each added match — called after reels 2, 3, and 4.
 * @param {number} chainLength - Consecutive matching reels so far (2–4).
 */
function playRiserSound(chainLength) {
  const ctx = getAudioContext();
  if (!ctx) return;

  // C5 → E5 → G5 per step
  const pitches = [0, 0, 523, 659, 784, 1046];
  const pitch = pitches[Math.min(chainLength, 5)];
  const vol = 0.18 + chainLength * 0.07;

  playTone(ctx, pitch, 0.18, vol);
  setTimeout(() => playTone(ctx, pitch * 1.25, 0.12, vol * 0.45), 70);
}

/**
 * Plays a tiered win sound matching the win classification.
 * @param {'none'|'small'|'big'|'jackpot'} winTier
 */
function playWinSound(winTier) {
  if (winTier === 'none') return;
  if (winTier === 'small')   sfxWinSmall.play();
  else if (winTier === 'big')     sfxWinBig.play();
  else if (winTier === 'jackpot') sfxWinJackpot.play();
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
 * Sets the global mute state via Howler, which silences all Howl instances at once.
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

export { playSpinSound, playStopTickSound, playWinSound, playRiserSound, startBackgroundMusic, stopBackgroundMusic, setMuted, getMuted };
