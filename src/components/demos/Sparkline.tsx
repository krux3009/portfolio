import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useLang } from "../../i18n";
import { copy } from "../../copy";
import AnimatedNumber from "../AnimatedNumber";

const POINTS = 48;

function nextValue(prev: number): number {
  return Math.max(80, prev + (Math.random() - 0.48) * 3);
}

function seedSeries(): number[] {
  const pts = [100];
  while (pts.length < POINTS) pts.push(nextValue(pts[pts.length - 1]));
  return pts;
}

export default function Sparkline() {
  const { t } = useLang();
  const [series, setSeries] = useState<number[]>(seedSeries);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduced = useReducedMotion();

  // Ticks only while on screen; reduced motion gets a still chart.
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => {
      setSeries((s) => [...s.slice(1), nextValue(s[s.length - 1])]);
    }, 800);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const coords = series.map((v, i) => {
    const x = (i / (POINTS - 1)) * 100;
    const y = 38 - ((v - min) / span) * 34;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const value = 12_400 * (series[series.length - 1] / 100);
  const dayPct = ((series[series.length - 1] - series[series.length - 2]) / series[series.length - 2]) * 100;
  const up = dayPct >= 0;

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs text-cream-dim/80">{t(copy.dashboard.valueLabel)}</p>
          <p className="mt-1 text-2xl font-medium tabular-nums text-cream">
            S$<AnimatedNumber value={value} format={(n) => Math.round(n).toLocaleString("en-SG")} />
          </p>
        </div>
        <p className="text-sm tabular-nums" style={{ color: up ? "var(--color-signal)" : "var(--color-ember)" }}>
          {t(copy.dashboard.dayLabel)} {up ? "+" : ""}
          <AnimatedNumber value={dayPct} format={(n) => n.toFixed(2)} />%
        </p>
      </div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" className="mt-4 h-28 w-full">
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,40 L${coords.join(" L")} L100,40 Z`} fill="url(#spark-fill)" />
        <polyline
          points={coords.join(" ")}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
