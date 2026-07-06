import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Ember sparks radiating from every click. Adapted from React Bits' ClickSpark
// (MIT + Commons Clause) — canvas 2D, no animation library.

type Spark = { x: number; y: number; angle: number; start: number };

const DURATION = 450;
const COUNT = 8;
const RADIUS = 22;
const LENGTH = 9;

export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      const now = performance.now();
      for (let i = 0; i < COUNT; i++) {
        sparksRef.current.push({ x: e.clientX, y: e.clientY, angle: (Math.PI * 2 * i) / COUNT, start: now });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("click", onClick);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparksRef.current = sparksRef.current.filter((s) => now - s.start < DURATION);
      for (const s of sparksRef.current) {
        const t = (now - s.start) / DURATION;
        const eased = 1 - Math.pow(1 - t, 4);
        const dist = eased * RADIUS;
        const len = LENGTH * (1 - eased);
        const x1 = s.x + dist * Math.cos(s.angle);
        const y1 = s.y + dist * Math.sin(s.angle);
        ctx.strokeStyle = `oklch(0.72 0.15 45 / ${1 - t})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + len * Math.cos(s.angle), y1 + len * Math.sin(s.angle));
        ctx.stroke();
      }
      raf = sparksRef.current.length ? requestAnimationFrame(draw) : 0;
    };

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
