import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

/* ─── Types ──────────────────────────────────────────── */
type Screen = "landing" | "scanning" | "result";
type PayState = "idle" | "loading" | "failed";

/* ─── Data ───────────────────────────────────────────── */
const SCAN_MESSAGES = [
  "🔍 Initializing neural scan...",
  "🧬 Analyzing brain cells...",
  "💾 Checking memory status...",
  "🤔 Searching for common sense...",
  "📚 Detecting exam preparation...",
  "😴 Looking for lost motivation...",
  "🔢 Counting active brain cells...",
  "📱 Measuring Reels consumption...",
  "🌐 Estimating internet addiction...",
  "💭 Scanning thought patterns...",
  "🔥 Checking for brain overheating...",
  "🎯 Calibrating intelligence modules...",
  "⚡ Uploading findings to cloud...",
  "🔒 Encrypting embarrassing memories...",
  "✅ Finalizing brain report...",
];

const DIAGNOSES = [
  "Too much Reels detected 📱💀",
  "Brain currently updating... please wait ⏳",
  "Exam knowledge not found 📚❌",
  "Sleep mode permanently active 😴",
  "Crush thoughts occupying 87% of memory ❤️",
  "Dangerous level of laziness detected 🛌",
  "Internet expert, real-life beginner 🌐😂",
  "Memory full – please delete embarrassing moments 💀",
  "Brain overheating due to overthinking 🔥",
  "AI is deeply confused by this intelligence level 🤯",
  "Netflix addiction detected in long-term memory 🍿",
  "Procrastination module running at 100% 😬",
  "Last-minute panic mode: enabled 🚨",
  "WhatsApp response time: 0.001s; homework: never ✉️❌",
  "Vibechecked — vibe dangerously low 📉",
];

const TITLES = [
  "Certified Genius 🏆",
  "Professional Overthinker 🤔",
  "Reels Scientist 📱",
  "Future Billionaire 💸",
  "Last Bench Legend 😎",
  "Human Loading Screen ⏳",
  "Brain Not Found ❌",
  "Chaos Coordinator 🌪️",
  "Part-time Human, Full-time Memer 😂",
  "Sleep Enthusiast 😪",
];

const PREMIUM_FEATURES = [
  "🧠 Exact count of remaining brain cells",
  "📉 Your IQ after 3 hours of Reels",
  "📝 Exam survival probability score",
  "💤 Hours of sleep you actually need",
  "❤️ Crush-thought memory percentage",
  "🏆 Global laziness percentile ranking",
];

/* ─── Helpers ────────────────────────────────────────── */
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: T[]): T => arr[rand(0, arr.length - 1)];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Starfield ──────────────────────────────────────── */
function Starfield() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    dur: (Math.random() * 3 + 2).toFixed(1),
    delay: -(Math.random() * 5).toFixed(1),
  }));

  return (
    <div className="starfield">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─── Brain Scanner SVG ring ─────────────────────────── */
function ScannerBrain() {
  return (
    <div className="brain-scanner">
      <div className="scanner-ring scanner-ring-1" />
      <div className="scanner-ring scanner-ring-2" />
      <div className="scanner-ring scanner-ring-3" />
      <div className="scan-beam" />
      <div className="brain-emoji">🧠</div>
    </div>
  );
}

/* ─── Capacity Ring (SVG) ────────────────────────────── */
function CapacityRing({ pct }: { pct: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const clampedPct = Math.min(pct, 100);
  const offset = circ - (clampedPct / 100) * circ;

  const color =
    pct >= 200
      ? "#f0abfc"
      : pct >= 100
      ? "#a855f7"
      : pct >= 60
      ? "#6366f1"
      : pct >= 30
      ? "#0ea5e9"
      : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="170" height="170" viewBox="0 0 170 170">
        <defs>
          <linearGradient id="capacityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx="85" cy="85" r={r}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", fill: "none", stroke: "rgba(255,255,255,0.07)", strokeWidth: 10, strokeDasharray: circ, strokeDashoffset: 0 }}
        />
        <circle
          cx="85" cy="85" r={r}
          style={{
            fill: "none",
            stroke: `url(#capacityGradient)`,
            strokeWidth: 10,
            strokeLinecap: "round",
            strokeDasharray: circ,
            strokeDashoffset: offset,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 8px rgba(99,102,241,0.9))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="capacity-number font-black"
          style={{ fontSize: pct >= 100 ? "2.4rem" : "2.8rem", lineHeight: 1, color }}
        >
          {pct}%
        </span>
        <span className="text-xs text-slate-400 mt-1">capacity</span>
      </div>
    </div>
  );
}

/* ─── Sound effects (Web Audio API) ─────────────────── */
function useSound() {
  const ctx = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctx.current) ctx.current = new AudioContext();
    return ctx.current;
  };

  const playBeep = useCallback((freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15) => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.start();
      osc.stop(c.currentTime + dur);
    } catch {}
  }, []);

  const playScanSound = useCallback(() => {
    [200, 400, 600, 800].forEach((f, i) =>
      setTimeout(() => playBeep(f, 0.1, "square", 0.05), i * 150)
    );
  }, [playBeep]);

  const playSuccessSound = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => playBeep(f, 0.18, "sine", 0.12), i * 100)
    );
  }, [playBeep]);

  const playFailSound = useCallback(() => {
    [300, 250, 200, 150].forEach((f, i) =>
      setTimeout(() => playBeep(f, 0.15, "sawtooth", 0.1), i * 100)
    );
  }, [playBeep]);

  const playPayFail = useCallback(() => {
    [180, 160, 140].forEach((f, i) =>
      setTimeout(() => playBeep(f, 0.3, "square", 0.12), i * 200)
    );
  }, [playBeep]);

  return { playScanSound, playSuccessSound, playFailSound, playPayFail };
}

/* ─── Confetti ───────────────────────────────────────── */
function fireConfetti() {
  const end = Date.now() + 2500;
  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#00d4ff", "#a855f7", "#f0abfc", "#fbbf24"],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#00d4ff", "#a855f7", "#f0abfc", "#fbbf24"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/* ─── Landing Screen ─────────────────────────────────── */
function LandingScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const [shake, setShake] = useState(false);

  const handleStart = () => {
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onStart(name.trim());
  };

  return (
    <div className="screen fade-in min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo area */}
      <div className="mb-8 text-center">
        <div
          className="text-7xl mb-4 inline-block"
          style={{
            animation: "brain-pulse 2s ease-in-out infinite",
            filter: "drop-shadow(0 0 30px rgba(168,85,247,0.8))",
          }}
        >
          🧠
        </div>
        <div className="result-badge mb-4">v4.2.0 — Neural Edition</div>
      </div>

      {/* Main card */}
      <div className="glass p-8 md:p-12 w-full max-w-lg text-center">
        <h1
          className="gradient-title font-black mb-3 glitch"
          style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)", lineHeight: 1.1 }}
        >
          🧠 Brain Capacity Checker
        </h1>

        <p className="text-slate-400 mb-1 text-sm md:text-base">
          Powered by{" "}
          <span className="neon-text-blue font-semibold">Advanced Artificial Intelligence</span>
        </p>
        <p className="text-slate-500 text-xs mb-8">(Totally Not Fake™)</p>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Brains Scanned", value: "4.2M+" },
            { label: "Accuracy", value: "101%" },
            { label: "Brain Cells Found", value: "¯\\_(ツ)_/¯" },
          ].map((s) => (
            <div className="mini-stat" key={s.label}>
              <div
                className="font-bold text-sm"
                style={{ color: "var(--neon-blue)", textShadow: "0 0 8px var(--neon-blue)" }}
              >
                {s.value}
              </div>
              <div className="text-slate-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={`mb-5 ${shake ? "shake" : ""}`}>
          <label className="block text-left text-xs text-slate-400 mb-2 font-semibold uppercase tracking-widest">
            Enter Subject Name
          </label>
          <input
            className="neon-input"
            placeholder="Your name (if you remember it)..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            maxLength={30}
          />
        </div>

        <button
          className="btn-neon btn-neon-primary w-full text-lg py-4"
          onClick={handleStart}
        >
          🚀 Check My Brain
        </button>

        <p className="text-slate-600 text-xs mt-4">
          ⚠️ Side effects may include: existential crisis, sudden urge to sleep, questioning all life decisions.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-slate-700 text-xs mt-6 text-center max-w-sm">
        * Results are 100% scientifically accurate and peer-reviewed by our team of 0 scientists.
      </p>
    </div>
  );
}

/* ─── Scanning Screen ────────────────────────────────── */
function ScanningScreen({ name, onComplete }: { name: string; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots] = useState(".");
  const { playScanSound } = useSound();
  const completedRef = useRef(false);

  useEffect(() => {
    playScanSound();
  }, []);

  // Rotating messages
  useEffect(() => {
    const iv = setInterval(() => {
      setMsgIdx((i) => (i + 1) % SCAN_MESSAGES.length);
      playScanSound();
    }, 600);
    return () => clearInterval(iv);
  }, []);

  // Animated dots
  useEffect(() => {
    const iv = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(iv);
  }, []);

  // Progress bar — slow start, fast middle, slow end
  useEffect(() => {
    let current = 0;
    const totalDuration = 4200;
    const steps = 100;
    const stepTime = totalDuration / steps;

    const iv = setInterval(() => {
      current += 1;
      // Ease: slow-fast-slow
      const eased =
        current < 20
          ? current * 0.5
          : current < 80
          ? 10 + (current - 20) * 1.25
          : 85 + (current - 80) * 0.75;
      setProgress(Math.min(Math.round(eased), 100));

      if (current >= steps) {
        clearInterval(iv);
        if (!completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 400);
        }
      }
    }, stepTime);

    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <div className="screen fade-in min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="glass p-8 md:p-10 w-full max-w-md text-center">
        <div className="mb-2 text-slate-400 text-sm uppercase tracking-widest font-semibold">
          Neural Analysis in Progress
        </div>
        <h2 className="text-xl font-bold mb-8" style={{ color: "var(--neon-blue)" }}>
          Scanning:{" "}
          <span style={{ color: "var(--neon-pink)" }}>{name}</span>
          <span style={{ color: "var(--neon-purple)" }}>{dots}</span>
        </h2>

        {/* Brain scanner */}
        <div className="mb-8">
          <ScannerBrain />
        </div>

        {/* Progress bar */}
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Brain Scan Progress</span>
          <span
            className="font-bold"
            style={{ color: "var(--neon-blue)", textShadow: "0 0 8px var(--neon-blue)" }}
          >
            {progress}%
          </span>
        </div>
        <div className="progress-track mb-6">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Current message */}
        <div
          key={msgIdx}
          className="scan-message text-sm font-semibold py-3 px-5 rounded-xl"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "rgba(226,232,240,0.9)",
          }}
        >
          {SCAN_MESSAGES[msgIdx]}
        </div>

        {/* Live log */}
        <div
          className="mt-5 text-left rounded-xl p-4 font-mono text-xs"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#4ade80",
            minHeight: 70,
            overflow: "hidden",
          }}
        >
          <span style={{ color: "var(--neon-blue)" }}>[AI]</span> {SCAN_MESSAGES[msgIdx]}
          <br />
          <span style={{ color: "var(--neon-purple)" }}>[SYS]</span> Memory address:{" "}
          {Math.random().toString(16).substring(2, 10).toUpperCase()}
          <br />
          <span style={{ color: "#fbbf24" }}>[WARN]</span> Anomalies detected: {rand(3, 99)}
        </div>

        {/* Pulse indicators */}
        <div className="flex justify-center gap-3 mt-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="pulse-dot"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Result Screen ──────────────────────────────────── */
function ResultScreen({
  name,
  onRestart,
}: {
  name: string;
  onRestart: () => void;
}) {
  const capacity = rand(1, 404);
  const title = pick(TITLES);
  const diagnosesRaw = shuffle(DIAGNOSES).slice(0, rand(3, 5));
  const [diagnoses] = useState(diagnosesRaw);
  const [cap] = useState(capacity);
  const [ttl] = useState(title);
  const [showPremium, setShowPremium] = useState(false);
  const [payState, setPayState] = useState<PayState>("idle");
  const [shakeResult, setShakeResult] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOut, setToastOut] = useState(false);

  const { playSuccessSound, playFailSound, playPayFail } = useSound();
  const resultRef = useRef<HTMLDivElement>(null);

  const isHigh = cap >= 80;
  const isAbsurd = cap >= 200;

  useEffect(() => {
    if (isHigh) {
      playSuccessSound();
      setTimeout(fireConfetti, 300);
    } else {
      playFailSound();
      setShakeResult(true);
      setTimeout(() => setShakeResult(false), 700);
    }
  }, []);

  const capColor =
    cap >= 200
      ? "#f0abfc"
      : cap >= 100
      ? "#a855f7"
      : cap >= 60
      ? "#6366f1"
      : cap >= 30
      ? "#0ea5e9"
      : "#ef4444";

  const capLabel =
    cap >= 300
      ? "LEGENDARY"
      : cap >= 200
      ? "MYTHICAL"
      : cap >= 100
      ? "EXCEPTIONAL"
      : cap >= 60
      ? "AVERAGE"
      : cap >= 30
      ? "CONCERNING"
      : "CRITICAL";

  const handlePremiumClick = () => {
    setPayState("loading");
    setTimeout(() => {
      setPayState("failed");
      playPayFail();
    }, 2200);
  };

  const showToastMsg = (msg: string) => {
    setToastMsg(msg);
    setToastOut(false);
    setShowToast(true);
    setTimeout(() => {
      setToastOut(true);
      setTimeout(() => setShowToast(false), 400);
    }, 2600);
  };

  const handleShare = () => {
    const text = `🧠 Brain Capacity Checker Result\n\nName: ${name}\nCapacity: ${cap}%\nTitle: ${ttl}\n\nDiagnoses:\n${diagnoses.map((d) => `• ${d}`).join("\n")}\n\nCheck yours at: Brain Capacity Checker™`;
    if (navigator.share) {
      navigator.share({ title: "My Brain Report", text });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() =>
        showToastMsg("📋 Result copied to clipboard!")
      );
    } else {
      showToastMsg("📋 Copy the URL to share!");
    }
  };

  return (
    <>
      <div
        ref={resultRef}
        className={`screen fade-in min-h-screen flex flex-col items-center justify-center px-4 py-12 ${shakeResult ? "shake" : ""}`}
      >
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="result-badge mb-3">✅ Scan Complete</div>
            <h2
              className="font-black text-3xl md:text-4xl mb-1"
              style={{
                background:
                  "linear-gradient(135deg, var(--neon-blue), var(--neon-purple), var(--neon-pink))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Brain Report
            </h2>
            <p className="text-slate-400 text-sm">
              Subject:{" "}
              <span className="font-bold" style={{ color: "var(--neon-pink)" }}>
                {name}
              </span>
            </p>
          </div>

          {/* Main result card */}
          <div className="glass p-7 mb-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Capacity ring */}
              <div className="flex-shrink-0">
                <CapacityRing pct={cap} />
                <div
                  className="text-center text-xs font-bold mt-2 tracking-widest"
                  style={{ color: capColor, textShadow: `0 0 10px ${capColor}` }}
                >
                  {capLabel}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
                  Certified Title
                </p>
                <h3
                  className="text-2xl font-black mb-3"
                  style={{ color: capColor, textShadow: `0 0 15px ${capColor}` }}
                >
                  {ttl}
                </h3>

                {isAbsurd && (
                  <div
                    className="text-xs py-2 px-3 rounded-lg mb-3 font-semibold"
                    style={{
                      background: "rgba(240,171,252,0.1)",
                      border: "1px solid rgba(240,171,252,0.3)",
                      color: "var(--neon-pink)",
                    }}
                  >
                    ⚠️ Brain capacity exceeds 100%. Our AI has short-circuited.
                  </div>
                )}

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "IQ Estimate", value: `${rand(40, 180)}` },
                    { label: "Common Sense", value: `${rand(0, 12)}%` },
                    { label: "Exam Readiness", value: `${rand(0, 5)}%` },
                    { label: "Overthinking", value: `${rand(70, 99)}%` },
                  ].map((s) => (
                    <div className="mini-stat" key={s.label}>
                      <div
                        className="font-bold text-sm"
                        style={{ color: "var(--neon-blue)" }}
                      >
                        {s.value}
                      </div>
                      <div className="text-slate-500 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="glass p-6 mb-5">
            <h4
              className="font-bold text-sm uppercase tracking-widest mb-4"
              style={{ color: "var(--neon-purple)" }}
            >
              🩺 AI Diagnosis Report
            </h4>
            <div className="space-y-2">
              {diagnoses.map((d, i) => (
                <div
                  key={i}
                  className="diagnosis-item"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <span className="text-slate-300">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CTA */}
          <div
            className="glass p-6 mb-5 text-center"
            style={{
              border: "1px solid rgba(251,191,36,0.35)",
              boxShadow: "0 0 30px rgba(251,191,36,0.1)",
            }}
          >
            <div className="text-2xl mb-1">🔒</div>
            <h4 className="font-black text-lg mb-1" style={{ color: "#fbbf24" }}>
              Premium Brain Report Available
            </h4>
            <p className="text-slate-400 text-sm mb-4">
              Our AI has uncovered even darker secrets about your brain.
            </p>
            <ul className="text-left space-y-1 mb-5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="text-slate-300 text-sm flex gap-2">
                  <span className="text-yellow-400">✦</span> {f}
                </li>
              ))}
            </ul>
            <div
              className="text-xs text-slate-500 mb-3 line-through"
              style={{ textDecorationColor: "#ef4444" }}
            >
              ৳499
            </div>
            <div className="font-black text-2xl mb-4" style={{ color: "#fbbf24" }}>
              ৳99 Only
            </div>
            <button
              className="btn-neon btn-gold w-full text-base py-3"
              onClick={() => setShowPremium(true)}
            >
              🔓 Unlock Premium Report
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              className="btn-neon btn-share flex-1 py-3 text-sm"
              onClick={handleShare}
            >
              🔗 Share Result
            </button>
            <button
              className="btn-neon flex-1 py-3 text-sm"
              onClick={onRestart}
            >
              🔄 Rescan Brain
            </button>
          </div>

          <p className="text-center text-slate-700 text-xs mt-5">
            * This report is certified by 0 actual doctors and 1 very confused AI.
          </p>
        </div>
      </div>

      {/* ── Premium Modal ── */}
      {showPremium && (
        <div className="modal-overlay" onClick={() => payState === "idle" && setShowPremium(false)}>
          <div className="glass modal-card p-8 text-center" onClick={(e) => e.stopPropagation()}>
            {payState === "idle" && (
              <>
                <div className="lock-spin text-5xl mb-4">🔒</div>
                <h3 className="text-2xl font-black mb-1" style={{ color: "#fbbf24" }}>
                  Premium Brain Report
                </h3>
                <p className="text-slate-400 text-sm mb-5">
                  One-time payment. Instant access. Completely real.
                </p>

                {/* Fake payment form */}
                <div className="space-y-3 mb-5 text-left">
                  <input
                    className="neon-input text-sm"
                    placeholder="Card Number: 4242 4242 4242 4242"
                    readOnly
                  />
                  <div className="flex gap-3">
                    <input
                      className="neon-input text-sm"
                      placeholder="MM/YY: 12/99"
                      readOnly
                    />
                    <input
                      className="neon-input text-sm"
                      placeholder="CVV: 🧠"
                      readOnly
                    />
                  </div>
                </div>

                <div className="text-3xl font-black mb-4" style={{ color: "#fbbf24" }}>
                  ৳99
                </div>
                <button
                  className="btn-neon btn-gold w-full py-3 text-base mb-3"
                  onClick={handlePremiumClick}
                >
                  💳 Pay ৳99 Now
                </button>
                <button
                  className="text-slate-600 text-xs hover:text-slate-400 transition-colors"
                  onClick={() => setShowPremium(false)}
                >
                  No thanks, I'll stay dumb
                </button>
              </>
            )}

            {payState === "loading" && (
              <div className="py-6">
                <div className="pay-loader mb-6" />
                <h3 className="text-xl font-bold mb-2" style={{ color: "#fbbf24" }}>
                  Processing Payment...
                </h3>
                <p className="text-slate-400 text-sm">
                  Connecting to brain payment server...
                </p>
                <div className="mt-4 font-mono text-xs text-green-400 text-left bg-black/30 rounded-xl p-3">
                  <div>✓ Validating card details...</div>
                  <div>✓ Contacting neural bank...</div>
                  <div>✓ Verifying brain capacity...</div>
                  <div style={{ color: "#ef4444" }}>✗ Checking brain funds...</div>
                </div>
              </div>
            )}

            {payState === "failed" && (
              <div className="py-4">
                <div
                  className="fail-icon text-6xl mb-4"
                  style={{ animation: "fail-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  ❌
                </div>
                <h3
                  className="text-2xl font-black mb-3"
                  style={{ color: "#ef4444", textShadow: "0 0 20px rgba(239,68,68,0.5)" }}
                >
                  Payment Failed!
                </h3>
                <div
                  className="rounded-xl p-4 mb-5 text-left"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  <p className="text-slate-300 text-sm mb-1">
                    <span className="text-red-400 font-bold">Error Code:</span> BRAIN_FUNDS_INSUFFICIENT
                  </p>
                  <p className="text-slate-300 text-sm mb-1">
                    <span className="text-red-400 font-bold">Reason:</span>{" "}
                    <span className="font-semibold text-white">
                      "Insufficient Brain Power Detected." 😂
                    </span>
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Your brain capacity of {cap}% is below the minimum required threshold to process this transaction.
                  </p>
                </div>
                <p className="text-slate-400 text-sm mb-5">
                  Please upgrade your brain before attempting payment again. Try sleeping 8 hours first. 🛌
                </p>
                <button
                  className="btn-neon btn-red w-full py-3 mb-3"
                  onClick={() => {
                    setPayState("idle");
                    setShowPremium(false);
                  }}
                >
                  😔 Close (My Brain Can't Afford This)
                </button>
                <button
                  className="text-slate-600 text-xs hover:text-slate-400 transition-colors"
                  onClick={() => {
                    setPayState("idle");
                  }}
                >
                  Try paying again (won't work 😂)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className={`toast ${toastOut ? "toast-out" : ""}`}>✅ {toastMsg}</div>
      )}
    </>
  );
}

/* ─── App Root ───────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [name, setName] = useState("");

  const handleStart = (n: string) => {
    setName(n);
    setScreen("scanning");
  };

  const handleScanComplete = useCallback(() => {
    setScreen("result");
  }, []);

  const handleRestart = () => {
    setScreen("landing");
    setName("");
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Starfield />
      <div className="orb orb-blue" />
      <div className="orb orb-purple" />

      {screen === "landing" && <LandingScreen onStart={handleStart} />}
      {screen === "scanning" && (
        <ScanningScreen name={name} onComplete={handleScanComplete} />
      )}
      {screen === "result" && (
        <ResultScreen name={name} onRestart={handleRestart} />
      )}
    </div>
  );
}
