/**
 * @fileoverview Sound loading, playback, and mute state for the basketball slot machine.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 *
 * All game sounds are synthesized via Web Audio API.
 * Background music is reserved for an audio file at assets/audio/bg-music.mp3
 * (place the file there to enable it; the system handles missing files gracefully).
 */

/** @type {AudioContext|null} */
let audioContext = null;

/** @type {boolean} */
let isMuted = false;

/** @type {HTMLAudioElement|null} */
let bgMusicEl = null;

/**
 * Lazily creates and resumes the shared AudioContext.
 * Must be called from a user-gesture handler (browser autoplay policy).
 * @returns {AudioContext}
 */
function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Generates a short synthesized tone.
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
  if (isMuted) {
    return;
  }
  const ctx = getAudioContext();
  playTone(ctx, 280, 0.1, 0.18);
  setTimeout(() => playTone(ctx, 420, 0.12, 0.15), 80);
}

/** Plays the per-reel stop tick. */
function playStopTickSound() {
  if (isMuted) {
    return;
  }
  const ctx = getAudioContext();
  playTone(ctx, 580, 0.07, 0.22);
}

/**
 * Plays a tiered win sound matching the win classification.
 * @param {'none'|'small'|'big'|'jackpot'} winTier
 */
function playWinSound(winTier) {
  if (isMuted || winTier === 'none') {
    return;
  }
  const ctx = getAudioContext();

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
 * Starts background music from assets/audio/bg-music.mp3 at low volume.
 * No-op if the file is missing or audio is muted.
 */
function startBackgroundMusic() {
  if (isMuted || bgMusicEl) {
    return;
  }
  const el = new Audio('assets/audio/bg-music.mp3');
  el.loop = true;
  el.volume = 0.12;

  el.play().then(() => {
    bgMusicEl = el;
  }).catch(() => {
    // File not present yet — silently ignore
  });
}

/** Stops and unloads background music immediately. */
function stopBackgroundMusic() {
  if (bgMusicEl) {
    bgMusicEl.pause();
    bgMusicEl.src = '';
    bgMusicEl = null;
  }
}

/**
 * Sets the global mute state.
 * @param {boolean} muted
 */
function setMuted(muted) {
  isMuted = muted;
  if (isMuted) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
}

/**
 * Returns the current mute state.
 * @returns {boolean}
 */
function getMuted() {
  return isMuted;
}

export { playSpinSound, playStopTickSound, playWinSound, startBackgroundMusic, stopBackgroundMusic, setMuted, getMuted };
