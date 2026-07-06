import { useLang } from "../i18n";
import { copy } from "../copy";

export default function Masthead() {
  const { lang, toggle, t } = useLang();
  const link =
    "relative text-sm text-cream-dim hover:text-cream transition-colors duration-300 " +
    "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-ember " +
    "after:transition-[width] after:duration-300 hover:after:w-full";

  return (
    <header className="sticky top-0 z-40 border-b border-night-line/60 bg-night">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="font-display text-xl text-cream">
          {t(copy.masthead.name)}
          <span className="text-ember">.</span>
        </a>
        <nav className="flex items-center gap-5 md:gap-8">
          <a className={link} href="#work">{t(copy.masthead.work)}</a>
          <a className={link} href="#about">{t(copy.masthead.about)}</a>
          <a className={link} href="#contact">{t(copy.masthead.contact)}</a>
          <button
            onClick={toggle}
            aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
            className="rounded-full border border-night-line px-3 py-1 text-xs font-medium text-cream-dim transition-colors duration-300 hover:border-ember hover:text-cream"
          >
            {lang === "en" ? "中文" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
