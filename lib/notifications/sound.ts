/** Joue un bip court de notification (Web Audio API · pas de fichier requis) */
export function playNotificationSound(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Deux notes courtes (ding-dong subtil)
    [
      { freq: 880, start: 0,    duration: 0.12, volume: 0.15 },
      { freq: 1175, start: 0.13, duration: 0.18, volume: 0.13 },
    ].forEach(({ freq, start, duration, volume }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(volume, now + start + 0.01);
      gain.gain.linearRampToValueAtTime(0, now + start + duration);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });

    // Cleanup
    setTimeout(() => { try { ctx.close(); } catch { /* ignore */ } }, 800);
  } catch {
    // Audio bloqué (autoplay policy avant interaction utilisateur). Ignore.
  }
}
