import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../i18n";
import { copy } from "../copy";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] flex-col justify-center overflow-hidden"
    >
      {/* the lamp: one static pool of warm light, top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_circle_at_16%_8%,oklch(0.68_0.15_45/0.12),transparent_62%)]"
      />
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <motion.p {...rise(0)} className="mb-6 text-sm tracking-wide text-cream-dim">
          {t(copy.hero.kicker)}
        </motion.p>
        <motion.h1
          {...rise(0.1)}
          className="max-w-[16ch] font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-[1.12]"
        >
          {t(copy.hero.h1a)}
          <span className="text-ember">{t(copy.hero.h1b)}</span>
        </motion.h1>
        <motion.p {...rise(0.22)} className="mt-8 max-w-[58ch] text-lg text-cream-dim">
          {t(copy.hero.sub)}
        </motion.p>
        <motion.a
          {...rise(0.34)}
          href="#work"
          className="mt-12 inline-block text-sm text-cream-dim transition-colors duration-300 hover:text-ember"
        >
          {t(copy.hero.hint)} ↓
        </motion.a>
      </div>
    </section>
  );
}
