import { useLang } from "../i18n";
import { copy } from "../copy";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-night-line/60">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <p className="text-sm text-cream-dim/80">{t(copy.footer.line)}</p>
      </div>
    </footer>
  );
}
