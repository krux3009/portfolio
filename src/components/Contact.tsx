import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../i18n";
import { copy } from "../copy";
import Magnet from "./Magnet";

const LINKS = [
  { key: "email", href: "mailto:tanlixuan2005@gmail.com" },
  { key: "GitHub", href: "https://github.com/krux3009" },
  { key: "LinkedIn", href: "https://www.linkedin.com/in/li-xuan-tan-7a4929229" },
] as const;

export default function Contact() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <motion.section
      id="contact"
      initial={reduced ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-6xl px-6 md:px-10"
    >
      <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)]">{t(copy.contact.heading)}</h2>
      <p className="mt-4 text-cream-dim">{t(copy.contact.line)}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        {LINKS.map((l) => (
          <Magnet key={l.key}>
            <a
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
              className="inline-block rounded-full border border-night-line px-6 py-2.5 text-sm font-medium text-cream transition-colors duration-300 hover:border-ember hover:text-ember"
            >
              {l.key === "email" ? t(copy.contact.email) : l.key}
            </a>
          </Magnet>
        ))}
      </div>
    </motion.section>
  );
}
