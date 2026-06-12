// projects-data.js — the single file to edit when you ship a new project.
//
// Each project is one object:
//   title / titleZh              card heading (EN / 中文)
//   description / descriptionZh  1-2 sentences, your own voice (EN / 中文)
//   tags         (array)   up to 3 short labels; first two get colored pills
//   year         (string)  when you built it
//   link         (string)  ABSOLUTE path from site root, e.g. "/projects/llm-journey/".
//                          Use null for projects that aren't public yet.
//   status       (string, optional)  "ongoing" shows a work-in-progress pill
//   image        (string, optional)  root-absolute screenshot shown at the top
//                          of the card (decorative — info repeated in the text)
//
// Add new projects to the TOP of the array so the newest shows first.

const PROJECTS = [
  {
    title: "Pitchside",
    titleZh: "Pitchside 世界杯预测站",
    description: "Live World Cup 2026 analytics — Elo + Poisson match predictions, a 10,000-run Monte Carlo champion simulation, and a methodology page showing every formula. Updates itself daily while the tournament runs.",
    descriptionZh: "2026 世界杯实时数据站——Elo + 泊松模型预测每场胜负，一万次蒙特卡洛模拟夺冠概率，方法论页公开全部公式。世界杯期间每天自动更新。",
    tags: ["REACT", "FASTAPI", "LIVE DATA"],
    year: "2026",
    link: "https://pitchside-green.vercel.app",
    image: "/assets/pitchside-bilingual.webp",
  },
  {
    title: "Journey of a Token",
    titleZh: "一个 Token 的旅程",
    description: "How an LLM reads your sentence and writes back — an interactive explainer you can step through or scroll like a factory tour.",
    descriptionZh: "大语言模型如何读懂你的句子并回复——可以一站站走、也可以像工厂长卷一样滚动的交互式讲解。",
    tags: ["INTERACTIVE", "HTML · JS", "EN / 中文"],
    year: "2026",
    link: "/projects/llm-journey/",
  },
  {
    title: "Investment Dashboard",
    titleZh: "投资仪表盘",
    description: "A dashboard for my moomoo stock portfolio — positions, performance, and daily market digests in one view. Python backend, Next.js front end.",
    descriptionZh: "为我的 moomoo 股票组合做的仪表盘——持仓、表现、每日市场摘要一屏看完。Python 后端，Next.js 前端。",
    tags: ["NEXT.JS", "PYTHON", "MOOMOO API"],
    year: "2026",
    link: null,
    status: "ongoing",
  },
];
