// Local, asset-free sound effects synthesised with the Web Audio API (works offline).
let ctx: AudioContext | null = null;
let muted = false;
let noise: AudioBuffer | null = null;

const ac = (): AudioContext | null => {
  if (muted || typeof window === "undefined") return null;
  try {
    ctx ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    if (!noise) {
      noise = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return ctx;
  } catch {
    return null;
  }
};

const tone = (
  c: AudioContext,
  f: number,
  t: number,
  dur: number,
  vol: number,
  type: OscillatorType = "sine",
  f2?: number
) => {
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
};
const crunch = (
  c: AudioContext,
  t: number,
  dur: number,
  vol: number,
  freq: number
) => {
  const s = c.createBufferSource(),
    f = c.createBiquadFilter(),
    g = c.createGain();
  s.buffer = noise;
  f.type = "bandpass";
  f.frequency.value = freq;
  f.Q.value = 0.9;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(c.destination);
  s.start(t);
  s.stop(t + dur);
};

export const setMuted = (m: boolean) => {
  muted = m;
};
export const sfx = {
  hit(power = 1) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    crunch(c, t, 0.14, 0.5, 900 + Math.random() * 1400); // stone crack
    crunch(c, t + 0.02, 0.08, 0.3, 3200); // gravel chips
    tone(
      c,
      150 + Math.random() * 30,
      t,
      0.16,
      Math.min(0.6, 0.35 + power * 0.03),
      "sine",
      45
    );
  }, // thump
  tick() {
    const c = ac();
    if (!c) return;
    crunch(c, c.currentTime, 0.06, 0.1, 1400 + Math.random() * 800);
  },
  buy() {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    tone(c, 660, t, 0.12, 0.2, "triangle");
    tone(c, 990, t + 0.08, 0.18, 0.2, "triangle");
  },
  boost() {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    [392, 523, 659, 784].forEach((f, i) =>
      tone(c, f, t + i * 0.07, 0.25, 0.22, "square")
    );
    crunch(c, t, 0.3, 0.5, 600);
  },
  win() {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone(c, f, t + i * 0.11, 0.5, 0.22, "triangle")
    );
  },
};
