import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useLang } from "../i18n";
import { copy } from "../copy";

// A full-width project exhibit. Each owns one hue; a spotlight in that hue
// follows the cursor across the section (React Bits' SpotlightCard idea,
// stretched over a whole exhibit — CSS vars only, no library).

export type ExhibitProps = {
  index: string;
  hue: string;
  title: string;
  story: string;
  stack: string;
  cta?: { label: string; href: string };
  status?: string;
  demoCaption: string;
  demo: ReactNode;
  flip?: boolean;
};

export default function Exhibit(p: ExhibitProps) {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={reduced ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      style={{ "--hue": p.hue } as CSSProperties}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-8 inset-x-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(620px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_oklab,var(--hue)_9%,transparent),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:px-10 lg:grid-cols-12 lg:gap-14">
        <div className={"lg:col-span-5 " + (p.flip ? "lg:order-2" : "")}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: p.hue }}>
            {t(copy.exhibitLabel)} {p.index}
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">{p.title}</h2>
          <p className="mt-5 max-w-[56ch] text-cream-dim">{p.story}</p>
          <p className="mt-5 text-sm text-cream-dim/80">{p.stack}</p>
          {p.cta && (
            <a
              href={p.cta.href}
              {...(p.cta.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
              className="group/cta mt-7 inline-flex items-center gap-2 font-medium"
              style={{ color: p.hue }}
            >
              <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 group-hover/cta:after:w-full">
                {p.cta.label}
              </span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
            </a>
          )}
          {p.status && (
            <p className="mt-7">
              <span
                className="rounded-full border px-3 py-1 text-xs"
                style={{ color: p.hue, borderColor: `color-mix(in oklab, ${p.hue} 45%, transparent)` }}
              >
                {p.status}
              </span>
            </p>
          )}
        </div>
        <div className={"lg:col-span-7 " + (p.flip ? "lg:order-1" : "")}>
          <div className="rounded-xl border border-night-line bg-night-soft p-5 sm:p-6">
            {p.demo}
          </div>
          <p className="mt-3 text-center text-sm text-cream-dim/80">{p.demoCaption}</p>
        </div>
      </div>
    </motion.section>
  );
}
