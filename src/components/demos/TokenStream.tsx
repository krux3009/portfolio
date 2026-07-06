import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useLang } from "../../i18n";
import { copy } from "../../copy";

// Toy tokenizer: CJK goes character by character, long Latin words get
// chopped into BPE-ish chunks. Wrong on purpose in the same way real
// tokenizers feel wrong the first time you see one.
function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const piece of text.split(/\s+/)) {
    if (!piece) continue;
    if (/[　-ヿ一-鿿＀-￯]/.test(piece)) {
      out.push(...Array.from(piece));
    } else if (piece.length > 6) {
      for (let i = 0; i < piece.length; i += 4) out.push(piece.slice(i, i + 4));
    } else {
      out.push(piece);
    }
  }
  return out.slice(0, 28);
}

export default function TokenStream() {
  const { lang, t } = useLang();
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [runId, setRunId] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  // First visit: the seed sentence tokenizes itself when the exhibit scrolls in.
  useEffect(() => {
    if (inView) {
      setTokens(tokenize(t(copy.llm.demoSeed)));
      setRunId((r) => r + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, lang]);

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTokens(tokenize(input));
    setRunId((r) => r + 1);
  };

  return (
    <div ref={ref}>
      <form onSubmit={run} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(copy.llm.demoPlaceholder)}
          maxLength={80}
          className="min-w-0 flex-1 rounded-lg border border-night-line bg-night px-4 py-2.5 text-sm text-cream placeholder:text-cream-dim/60 focus:border-ember focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg border border-ember/50 px-4 py-2.5 text-sm font-medium text-ember transition-colors duration-300 hover:bg-ember/10"
        >
          →
        </button>
      </form>
      <div className="mt-5 flex min-h-24 flex-wrap content-start gap-2" aria-live="polite">
        {tokens.map((tok, i) => (
          <motion.span
            key={`${runId}-${i}`}
            initial={reduced ? false : { opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.055, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-md border border-ember/35 bg-ember/10 px-2 py-1 font-mono text-sm text-cream"
          >
            {tok}
          </motion.span>
        ))}
      </div>
      {tokens.length > 0 && (
        <p className="mt-3 text-right text-xs text-cream-dim/80">
          → {tokens.length} tokens
        </p>
      )}
    </div>
  );
}
