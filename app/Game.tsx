"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { sfx, setMuted } from "./sfx";

type Lang = "ne" | "en";
type Bi = Record<Lang, string>;
const B = (ne: string, en: string): Bi => ({ ne, en });

const UI = {
  title: B("श्रमदान", "Shramdaan"),
  tap: B("ढुङ्गा फोड्न ट्याप गर्नुस्", "Tap the rock to break it"),
  stone: B("ढुङ्गा", "Stone"),
  perSec: B("प्रति सेकेन्ड", "per second"),
  meter: B("श्रम मिटर", "Shram meter"),
  boost: B("शनिबार श्रमदान! ×३", "Saturday Shramdaan! ×3"),
  hammer: B("हतौडा", "Hammer"),
  crew: B("स्वयंसेवक", "Volunteers"),
  invite: B("अरूलाई आमन्त्रण गर्नुस्", "Invite Others"),
  copied: B("लिङ्क कपी भयो!", "Link copied!"),
  reset: B("नयाँ सुरु", "Start over"),
  done: B("सम्पन्न!", "Done!"),
  cele: B("लक्ष्य पूरा भयो!", "Goal complete!"),
};
const WORKERS = [
  { id: "farmer", e: "🧑‍🌾", n: B("किसान दाइ", "Farmer"), base: 15, rate: 0.5 },
  { id: "student", e: "🎒", n: B("विद्यार्थी", "Student"), base: 100, rate: 2 },
  {
    id: "gurkha",
    e: "💂",
    n: B("पूर्व गोर्खा", "Ex-Gurkha"),
    base: 600,
    rate: 8,
  },
  { id: "aama", e: "👵", n: B("आमा", "Grandmother"), base: 3500, rate: 25 },
];
const GOALS = [
  { e: "💧", n: B("धरानमा खानेपानी", "Water for Dharan"), goal: 300 },
  {
    e: "🌉",
    n: B("दार्चुलामा झोलुङ्गे पुल", "Darchula suspension bridge"),
    goal: 2500,
  },
  { e: "🛣️", n: B("खोटाङमा बाटो", "Road in Khotang"), goal: 15000 },
  { e: "🇳🇵", n: B("समृद्ध नेपाल", "Prosperous Nepal"), goal: 100000 },
];
const KEY = "shramdaan-v1";
type Save = {
  stone: number;
  total: number;
  hammer: number;
  crew: Record<string, number>;
  lang: Lang;
  mute: boolean;
};
const FRESH: Save = {
  stone: 0,
  total: 0,
  hammer: 0,
  crew: {},
  lang: "ne",
  mute: false,
};
const nf = (n: number, l: Lang) =>
  Math.floor(n).toLocaleString(l === "ne" ? "ne-NP" : "en-US");
const wCost = (b: number, n: number) => Math.ceil(b * 1.15 ** n);
const hCost = (lv: number) => Math.ceil(25 * 1.6 ** lv);
type Chip = { id: number; dx: number; dy: number; s: number };
let uid = 0;

export default function Game() {
  const [s, setS] = useState<Save>(FRESH);
  const [ready, setReady] = useState(false);
  const [meter, setMeter] = useState(0);
  const [boost, setBoost] = useState(0);
  const [pop, setPop] = useState<{ k: number; v: number } | null>(null);
  const [chips, setChips] = useState<Chip[]>([]);
  const [shake, setShake] = useState(0);
  const [burst, setBurst] = useState(0);
  const [cele, setCele] = useState(false);
  const [copied, setCopied] = useState(false);
  const prevGi = useRef<number | null>(null);
  const l = s.lang;
  const t = (b: Bi) => b[l];

  useEffect(() => {
    try {
      const r = localStorage.getItem(KEY);
      if (r) setS({ ...FRESH, ...JSON.parse(r) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
    document.documentElement.lang = s.lang;
    setMuted(s.mute);
  }, [s, ready]);

  const rate =
    WORKERS.reduce((a, w) => a + (s.crew[w.id] ?? 0) * w.rate, 0) *
    (boost > 0 ? 3 : 1);
  const working = rate > 0;

  useEffect(() => {
    const id = setInterval(() => {
      setMeter((m) => Math.max(0, m - 1.5));
      setBoost((b) => Math.max(0, b - 0.1));
      setS((p) => {
        const r = WORKERS.reduce((a, w) => a + (p.crew[w.id] ?? 0) * w.rate, 0);
        return r
          ? { ...p, stone: p.stone + r * 0.1, total: p.total + r * 0.1 }
          : p;
      });
    }, 100);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!working) return;
    const id = setInterval(() => sfx.tick(), 900);
    return () => clearInterval(id);
  }, [working]);

  const hit = useCallback(() => {
    const gain = (1 + s.hammer) * (boost > 0 ? 3 : 1);
    setS((p) => ({ ...p, stone: p.stone + gain, total: p.total + gain }));
    setPop({ k: Date.now(), v: gain });
    setShake((n) => n + 1);
    const fresh: Chip[] = Array.from({ length: 6 }, () => ({
      id: ++uid,
      dx: Math.random() * 160 - 80,
      dy: -(30 + Math.random() * 90),
      s: 5 + Math.random() * 7,
    }));
    setChips((c) => [...c.slice(-18), ...fresh]);
    setTimeout(() => setChips((c) => c.filter((x) => !fresh.includes(x))), 650);
    sfx.hit(s.hammer);
    setMeter((m) => {
      if (m + 6 >= 100) {
        setBoost(6);
        setBurst((n) => n + 1);
        sfx.boost();
        return 0;
      }
      return m + 6;
    });
    if (navigator.vibrate) navigator.vibrate(8);
  }, [s.hammer, boost]);

  const gi = GOALS.findIndex((g) => s.total < g.goal);
  useEffect(() => {
    if (!ready) return;
    if (prevGi.current !== null && gi !== prevGi.current) {
      sfx.win();
      setCele(true);
      const id = setTimeout(() => setCele(false), 3200);
      prevGi.current = gi;
      return () => clearTimeout(id);
    }
    prevGi.current = gi;
  }, [gi, ready]);

  const buy = (cost: number, fn: (p: Save) => Save) => {
    sfx.buy();
    setS((p) => fn({ ...p, stone: p.stone - cost }));
  };
  const inviteOthers = async () => {
    const url = window.location.href;
    const shareData = {
      title: t(UI.title),
      text: t(B("श्रमदान खेल्नुहोस्!", "Play Shramdaan!")),
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };
  const goal = GOALS[gi === -1 ? GOALS.length - 1 : gi];
  const prev =
    gi > 0 ? GOALS[gi - 1].goal : gi === -1 ? GOALS[GOALS.length - 2].goal : 0;
  const pct =
    gi === -1
      ? 100
      : Math.min(100, ((s.total - prev) / (goal.goal - prev)) * 100);
  const cracks = Math.floor((meter / 100) * 4);
  const crowd = WORKERS.flatMap((w) =>
    Array.from({ length: Math.min(s.crew[w.id] ?? 0, 4) }, (_, i) => ({
      e: w.e,
      k: `${w.id}${i}`,
    }))
  ).slice(0, 12);

  return (
    <section className="game" aria-label={t(UI.title)}>
      <header className="bar">
        <span className="brand">{t(UI.title)}</span>
        <span className="tools">
          <button
            className="chip round"
            onClick={() => setS({ ...s, mute: !s.mute })}
            aria-pressed={s.mute}
            aria-label={s.mute ? "Sound off" : "Sound on"}
          >
            {s.mute ? "🔇" : "🔊"}
          </button>
          <button
            className="chip"
            onClick={() => setS({ ...s, lang: l === "ne" ? "en" : "ne" })}
            aria-label="Switch language"
          >
            {l === "ne" ? "EN" : "नेपाली"}
          </button>
        </span>
      </header>

      <div className="stats" aria-live="polite">
        <div>
          <b>{nf(s.stone, l)}</b>
          <small>{t(UI.stone)}</small>
        </div>
        <div>
          <b>{nf(rate, l)}</b>
          <small>{t(UI.perSec)}</small>
        </div>
      </div>

      <div className="goal">
        <div className="goalrow">
          <span>
            {goal.e} {t(goal.n)}
          </span>
          <span>
            {gi === -1 ? t(UI.done) : `${nf(s.total, l)} / ${nf(goal.goal, l)}`}
          </span>
        </div>
        <div
          className={`track ${boost > 0 ? "shine" : ""}`}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={`stage ${boost > 0 ? "glow" : ""}`}>
        {pop && (
          <span key={pop.k} className="pop">
            +{nf(pop.v, l)}
          </span>
        )}
        {chips.map((c) => (
          <span
            key={c.id}
            className="chipx"
            style={
              {
                "--dx": `${c.dx}px`,
                "--dy": `${c.dy}px`,
                width: c.s,
                height: c.s,
              } as React.CSSProperties
            }
          />
        ))}
        <button className="rock" onClick={hit} aria-label={t(UI.tap)}>
          <span
            key={`${shake}-${burst}`}
            className={`shk${boost > 5.5 ? " burst" : ""}`}
          >
            <svg viewBox="0 0 200 160" aria-hidden="true">
              <path
                d="M14 130 L38 62 L92 24 L150 40 L186 96 L170 136 Z"
                fill="var(--stone)"
                stroke="var(--ink)"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path d="M38 62 L92 24 L100 70 Z" fill="#fff" opacity=".18" />
              {cracks > 0 && (
                <path
                  d="M96 30 L88 62 L104 84"
                  stroke="var(--ink)"
                  strokeWidth="4"
                  fill="none"
                />
              )}
              {cracks > 1 && (
                <path
                  d="M104 84 L138 92 L150 120"
                  stroke="var(--ink)"
                  strokeWidth="4"
                  fill="none"
                />
              )}
              {cracks > 2 && (
                <path
                  d="M88 62 L56 92 L50 124"
                  stroke="var(--ink)"
                  strokeWidth="4"
                  fill="none"
                />
              )}
              {cracks > 3 && (
                <path
                  d="M120 50 L142 70"
                  stroke="var(--ink)"
                  strokeWidth="4"
                  fill="none"
                />
              )}
            </svg>
          </span>
        </button>
        <div className="crowd" aria-hidden="true">
          {crowd.map((c, i) => (
            <span key={c.k} style={{ animationDelay: `${(i % 5) * 0.13}s` }}>
              {c.e}
            </span>
          ))}
        </div>
        <p className="hint">{boost > 0 ? t(UI.boost) : t(UI.tap)}</p>
        <div
          className={`meter ${boost > 0 ? "hot" : ""}`}
          aria-label={t(UI.meter)}
        >
          <i style={{ width: `${boost > 0 ? 100 : meter}%` }} />
        </div>
      </div>

      <div className="shop">
        <button
          className="item"
          disabled={s.stone < hCost(s.hammer)}
          onClick={() =>
            buy(hCost(s.hammer), (p) => ({ ...p, hammer: p.hammer + 1 }))
          }
        >
          <span className="em">🔨</span>
          <span className="nm">
            {t(UI.hammer)} · Lv {s.hammer + 1}
            <small>+1 / tap</small>
          </span>
          <span className="cost">{nf(hCost(s.hammer), l)}</span>
        </button>
        <h3>{t(UI.crew)}</h3>
        {WORKERS.map((w) => {
          const n = s.crew[w.id] ?? 0,
            c = wCost(w.base, n);
          return (
            <button
              key={w.id}
              className="item"
              disabled={s.stone < c}
              onClick={() =>
                buy(c, (p) => ({ ...p, crew: { ...p.crew, [w.id]: n + 1 } }))
              }
            >
              <span className="em">{w.e}</span>
              <span className="nm">
                {t(w.n)} ×{n}
                <small>
                  +{w.rate} / {t(UI.perSec)}
                </small>
              </span>
              <span className="cost">{nf(c, l)}</span>
            </button>
          );
        })}
        <button className="invite" onClick={inviteOthers}>
          {copied ? t(UI.copied) : t(UI.invite)}
        </button>
        <button
          className="reset"
          onClick={() => {
            if (confirm(t(UI.reset) + "?")) {
              setS({ ...FRESH, lang: l, mute: s.mute });
              prevGi.current = 0;
            }
          }}
        >
          {t(UI.reset)}
        </button>
      </div>

      {cele && (
        <div className="cele" role="status">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 6) * 0.12}s`,
                }}
              >
                {i % 2 ? "🌼" : "🎉"}
              </span>
            ))}
          </div>
          <div className="card">
            <span>{goal.e}</span>
            <b>{t(UI.cele)}</b>
          </div>
        </div>
      )}
    </section>
  );
}
