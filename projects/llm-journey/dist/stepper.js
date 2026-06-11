/* Stepper shell — the guided tour (served as index.html). Loads after shared.jsx. */
function StepperApp() {
  const [lang, setLang] = useState(localStorage.getItem('lj-lang') || 'en');
  const [idx, setIdx] = useState(+(localStorage.getItem('lj-scene') || 0));
  const L = STRINGS[lang];
  const prompt = PROMPTS[lang] || PROMPTS.en;
  useEffect(() => {
    localStorage.setItem('lj-lang', lang);
  }, [lang]);
  useEffect(() => {
    localStorage.setItem('lj-scene', String(idx));
  }, [idx]);
  useEffect(() => {
    const h = e => {
      if (window.__sceneKeyHandler && window.__sceneKeyHandler(e.key)) return;
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, SCENES.length - 1));
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const Scene = SCENES[idx];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      padding: '18px 26px 6px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "hand",
    style: {
      fontSize: 34,
      margin: 0
    }
  }, L.appTitle), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--faint)'
    }
  }, L.appSub), /*#__PURE__*/React.createElement("a", {
    className: "wb-btn",
    href: "/projects/",
    "data-testid": "home",
    style: {
      marginLeft: 'auto',
      padding: '5px 14px',
      fontSize: 13,
      textDecoration: 'none',
      display: 'inline-block'
    }
  }, "\u2302 ", L.home), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    style: {
      padding: '5px 14px',
      fontSize: 13
    },
    onClick: () => setLang(l => l === 'en' ? 'zh' : 'en'),
    "data-testid": "lang-toggle"
  }, L.langBtn)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 0,
      alignItems: 'center',
      padding: '8px 26px 14px',
      flexWrap: 'wrap'
    },
    "data-testid": "rail"
  }, L.stops.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIdx(i),
    style: {
      cursor: 'pointer',
      border: `2px solid ${INK}`,
      background: i === idx ? i === 7 ? RUST : BLUE : i < idx ? '#E6F0E9' : '#fff',
      color: i === idx ? '#fff' : INK,
      borderRadius: 18,
      padding: '4px 12px',
      fontSize: 12.5,
      fontWeight: 800,
      fontFamily: 'Nunito,sans-serif'
    }
  }, s), i < L.stops.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 3px',
      color: 'var(--faint)'
    }
  }, "\u2014")))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: '4px 26px'
    }
  }, /*#__PURE__*/React.createElement(Scene, {
    L: L,
    lang: lang,
    prompt: prompt,
    goto: n => setIdx(n)
  })), /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: '14px 26px 26px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    onClick: () => setIdx(i => Math.max(i - 1, 0)),
    disabled: idx === 0,
    "data-testid": "back"
  }, L.back), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn primary",
    onClick: () => setIdx(i => Math.min(i + 1, SCENES.length - 1)),
    disabled: idx === SCENES.length - 1,
    "data-testid": "next"
  }, L.next), idx === SCENES.length - 1 && /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    onClick: () => setIdx(0)
  }, L.restart), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 11.5,
      color: 'var(--faint)',
      maxWidth: 380,
      textAlign: 'right'
    }
  }, L.footer)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(StepperApp, null));