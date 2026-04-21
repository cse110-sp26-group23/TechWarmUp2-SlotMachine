/**
 * @fileoverview Sound loading, playback, and mute state management.
 * @author Brendan Barber
 * @part-of CSE 110 Tech Warm-Up 2
 */

/**
 * Generates a short beep using the Web Audio API as a fallback when audio files are absent.
 * @param {AudioContext} ctx - An active AudioContext.
 * @param {number} frequency - Oscillator frequency in Hz.
 * @param {number} duration - Duration in seconds.
 * @param {number} [volume=0.3] - Gain value (0–1).
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

/** @type {AudioContext|null} */
let audioContext = null;

/** @type {boolean} */
let isMuted = false;

/**
 * Lazily creates and returns the shared AudioContext.
 * Must be called from a user-gesture handler to satisfy browser autoplay policy.
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
 * Plays the spin start sound.
 */
function playSpinSound() {
  if (isMuted) {
    return;
  }
  const ctx = getAudioContext();
  playTone(ctx, 300, 0.15, 0.2);
  playTone(ctx, 450, 0.15, 0.15);
}

/**
 * Plays the stop-tick sound as each reel lands.
 */
function playStopTickSound() {
  if (isMuted) {
    return;
  }
  const ctx = getAudioContext();
  playTone(ctx, 600, 0.08, 0.25);
}

/**
 * Plays a tiered win sound matching the win classification.
 * @param {'none'|'small'|'big'|'jackpot'} winTier - Win classification.
 */
function playWinSound(winTier) {
  if (isMuted || winTier === 'none') {
    return;
  }
  const ctx = getAudioContext();

  if (winTier === 'small') {
    playTone(ctx, 523, 0.15, 0.3);
    setTimeout(() => playTone(ctx, 659, 0.15, 0.3), 150);
  } else if (winTier === 'big') {
    playTone(ctx, 523, 0.15, 0.4);
    setTimeout(() => playTone(ctx, 659, 0.15, 0.4), 150);
    setTimeout(() => playTone(ctx, 784, 0.25, 0.5), 300);
  } else if (winTier === 'jackpot') {
    const notes = [523, 659, 784, 1046, 784, 1046];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, freq, 0.2, 0.5), i * 150);
    });
  }
}

/** @type {number|null} Interval id for the ambient loop. */
let ambientInterval = null;

/**
 * Starts looping a subtle ambient background tone at low volume.
 * No-op if already running or muted.
 */
function startAmbient() {
  if (ambientInterval !== null || isMuted) {
    return;
  }
  ambientInterval = setInterval(() => {
    if (isMuted) {
      return;
    }
    const ctx = getAudioContext();
    playTone(ctx, 110, 1.8, 0.03);
  }, 2000);
}

/**
 * Stops the ambient background loop immediately.
 */
function stopAmbient() {
  if (ambientInterval !== null) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
}

/**
 * Sets the global mute state and stops ambient audio if muting.
 * @param {boolean} muted - True to mute all audio.
 */
function setMuted(muted) {
  isMuted = muted;
  if (isMuted) {
    stopAmbient();
  }
}

/**
 * Returns the current mute state.
 * @returns {boolean}
 */
function getMuted() {
  return isMuted;
}

export { playSpinSound, playStopTickSound, playWinSound, startAmbient, stopAmbient, setMuted, getMuted };
