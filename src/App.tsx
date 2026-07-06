import { useLang } from "./i18n";
import { copy } from "./copy";
import Masthead from "./components/Masthead";
import Hero from "./components/Hero";
import Exhibit from "./components/Exhibit";
import TokenStream from "./components/demos/TokenStream";
import WinProb from "./components/demos/WinProb";
import Sparkline from "./components/demos/Sparkline";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ClickSpark from "./components/ClickSpark";

export default function App() {
  const { t } = useLang();

  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <div id="work" className="space-y-[clamp(7rem,16vh,11rem)] py-[clamp(4rem,10vh,7rem)]">
          <Exhibit
            index="01"
            hue="var(--color-ember)"
            title={t(copy.llm.title)}
            story={t(copy.llm.story)}
            stack={t(copy.llm.stack)}
            cta={{ label: t(copy.llm.cta), href: "/projects/llm-journey/" }}
            demoCaption={t(copy.llm.demoCaption)}
            demo={<TokenStream />}
          />
          <Exhibit
            index="02"
            hue="var(--color-field)"
            title={t(copy.pitchside.title)}
            story={t(copy.pitchside.story)}
            stack={t(copy.pitchside.stack)}
            cta={{ label: t(copy.pitchside.cta), href: "https://pitchside-green.vercel.app" }}
            demoCaption={t(copy.pitchside.demoCaption)}
            demo={<WinProb />}
            flip
          />
          <Exhibit
            index="03"
            hue="var(--color-signal)"
            title={t(copy.dashboard.title)}
            story={t(copy.dashboard.story)}
            stack={t(copy.dashboard.stack)}
            status={t(copy.dashboard.status)}
            demoCaption={t(copy.dashboard.demoCaption)}
            demo={<Sparkline />}
          />
        </div>
        <div className="space-y-[clamp(6rem,14vh,9rem)] pb-[clamp(6rem,14vh,9rem)]">
          <About />
          <Contact />
        </div>
      </main>
      <Footer />
      <ClickSpark />
    </>
  );
}
