import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../i18n";
import { copy } from "../copy";

export default function About() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <motion.section
      id="about"
      initial={reduced ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-6xl px-6 md:px-10"
    >
      <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)]">{t(copy.about.heading)}</h2>
      <div className="mt-6 max-w-[62ch] space-y-5 text-cream-dim">
        <p>{t(copy.about.p1)}</p>
        <p>
          {t(copy.about.p2)}{" "}
          {/* the shuttlecock survives the redesign */}
          <motion.button
            aria-label={t(copy.about.shuttleTitle)}
            title={t(copy.about.shuttleTitle)}
            whileTap={reduced ? undefined : { rotate: -35, y: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="inline-block cursor-pointer align-middle text-cream-dim/70 transition-colors duration-300 hover:text-ember"
          >
            <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none" aria-hidden="true">
              <circle cx="22" cy="44" r="9" fill="currentColor" />
              <path
                d="M28 36 L52 8 M28 38 L56 16 M30 40 L58 26 M27 33 L46 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </p>
      </div>
    </motion.section>
  );
}
