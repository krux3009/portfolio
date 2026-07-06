import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useLang } from "../../i18n";
import { copy } from "../../copy";
import AnimatedNumber from "../AnimatedNumber";

// A real (tiny) Monte Carlo: 500 matches sampled from two Poisson goal
// distributions, same math Pitchside runs 10,000x nightly.
function poisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function simulate(): { a: number; d: number; b: number } {
  const N = 500;
  let a = 0, d = 0, b = 0;
  for (let i = 0; i < N; i++) {
    const ga = poisson(0.5); // Singapore's expected goals. Optimistic.
    const gb = poisson(2.3);
    if (ga > gb) a++;
    else if (ga === gb) d++;
    else b++;
  }
  return { a: (a / N) * 100, d: (d / N) * 100, b: (b / N) * 100 };
}

export default function WinProb() {
  const { t } = useLang();
  const [probs, setProbs] = useState({ a: 0, d: 0, b: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (inView) setProbs(simulate());
  }, [inView]);

  const rows = [
    { label: `🇸🇬 ${t(copy.pitchside.teamA)} · ${t(copy.pitchside.win)}`, pct: probs.a, dim: false },
    { label: t(copy.pitchside.draw), pct: probs.d, dim: true },
    { label: `🇧🇷 ${t(copy.pitchside.teamB)} · ${t(copy.pitchside.win)}`, pct: probs.b, dim: false },
  ];

  return (
    <div ref={ref}>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className={row.dim ? "text-cream-dim" : "text-cream"}>{row.label}</span>
              <span className="font-medium tabular-nums text-field">
                <AnimatedNumber value={row.pct} format={(n) => n.toFixed(1)} />%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-night">
              <motion.div
                animate={{ width: `${row.pct}%` }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 80, damping: 20 }}
                className={"h-full rounded-full " + (row.dim ? "bg-cream-dim/40" : "bg-field")}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setProbs(simulate())}
        className="mt-6 w-full rounded-lg border border-field/50 py-2.5 text-sm font-medium text-field transition-colors duration-300 hover:bg-field/10"
      >
        {t(copy.pitchside.simulate)}
      </button>
    </div>
  );
}
