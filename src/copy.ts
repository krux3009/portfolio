import type { Bi } from "./i18n";

// All user-visible text lives here, both languages.
// 中文 is written for the reader, not translated word-for-word.

export const copy = {
  masthead: {
    name: { en: "Li Xuan", zh: "立瑄" } as Bi,
    work: { en: "Work", zh: "作品" } as Bi,
    about: { en: "About", zh: "关于" } as Bi,
    contact: { en: "Say hi", zh: "打招呼" } as Bi,
  },

  hero: {
    kicker: { en: "a small site by Li Xuan", zh: "立瑄的小站" } as Bi,
    h1a: { en: "I turn “how does that work?” into ", zh: "我把「这是怎么做到的？」变成" } as Bi,
    h1b: { en: "things you can click.", zh: "一个个点得动的小东西。" } as Bi,
    sub: {
      en: "Information Systems student at SMU by day, AI product ops intern at StepFun the rest of the week. I build interactive explainers and tools to answer my own curiosity first, then leave them here for yours.",
      zh: "白天在新加坡管理大学读信息系统，其余时间在阶跃星辰做 AI 产品运营实习。做这些交互式小项目，先是为了满足自己的好奇心，然后放在这里，等你的好奇心路过。",
    } as Bi,
    hint: { en: "the work is just below", zh: "作品就在下面" } as Bi,
  },

  exhibitLabel: { en: "exhibit", zh: "展品" } as Bi,

  llm: {
    title: { en: "Journey of a Token", zh: "一个 Token 的旅程" } as Bi,
    story: {
      en: "How does a language model read your sentence and write one back? I built the answer as a factory you can tour: walk station by station past tokenizers, embeddings and attention. Metaphors first; jargon is strictly optional. There is a two-minute film at the door if you'd rather watch.",
      zh: "大语言模型到底怎么读懂一句话，又怎么回一句话？我把答案做成了一座可以逛的工厂：一站一站走过分词、向量、注意力，全程用比喻讲，术语可开可关。门口还备了一部两分钟的小电影，不想走路可以先看片。",
    } as Bi,
    stack: { en: "React · a hand-rolled toy language model · EN/中文", zh: "React · 手搓的玩具语言模型 · 中英双语" } as Bi,
    cta: { en: "Take the tour", zh: "进厂参观" } as Bi,
    demoCaption: { en: "Try it: type a few words, watch them become tokens.", zh: "试试：打几个字，看它们被切成 token。" } as Bi,
    demoPlaceholder: { en: "type something…", zh: "随便打点什么…" } as Bi,
    demoSeed: { en: "How does a language model read this?", zh: "语言模型是怎么读懂这句话的？" } as Bi,
  },

  pitchside: {
    title: { en: "Pitchside", zh: "Pitchside 世界杯预测站" } as Bi,
    story: {
      en: "Live predictions for World Cup 2026, updating daily while the tournament runs. Elo ratings feed a Poisson goal model; ten thousand Monte Carlo tournaments pick the likely champion every morning. Every formula sits in public on the methodology page.",
      zh: "世界杯 2026 的实时预测站，赛事期间每天自动更新。Elo 评分喂给泊松进球模型，每天早上跑一万次蒙特卡洛模拟，算出谁最可能捧杯。所有公式都摊开放在方法论页上，不藏一步。",
    } as Bi,
    stack: { en: "React · FastAPI · live tournament data", zh: "React · FastAPI · 实时赛事数据" } as Bi,
    cta: { en: "Visit Pitchside", zh: "去看预测" } as Bi,
    demoCaption: {
      en: "One match, five hundred simulations, every click.",
      zh: "点一下，这场球就被模拟五百次。",
    } as Bi,
    simulate: { en: "Run it again", zh: "再赛一次" } as Bi,
    win: { en: "win", zh: "胜" } as Bi,
    draw: { en: "draw", zh: "平" } as Bi,
    teamA: { en: "Singapore", zh: "新加坡" } as Bi,
    teamB: { en: "Brazil", zh: "巴西" } as Bi,
  },

  dashboard: {
    title: { en: "Investment Dashboard", zh: "投资仪表盘" } as Bi,
    story: {
      en: "A dashboard for my moomoo portfolio: positions, performance and a daily market digest in one view. Python talks to the broker; Next.js draws the picture. It stays private, because it knows exactly how poor I am.",
      zh: "给自己的 moomoo 账户做的仪表盘：持仓、收益、每日市场摘要，一屏看完。Python 负责跟券商对话，Next.js 负责把数字画成图。它不公开，因为它太清楚我有多穷了。",
    } as Bi,
    stack: { en: "Next.js · Python · moomoo API", zh: "Next.js · Python · moomoo API" } as Bi,
    status: { en: "in progress", zh: "打磨中" } as Bi,
    demoCaption: {
      en: "Simulated feed. The real one knows too much.",
      zh: "演示数据。真实版知道得太多了。",
    } as Bi,
    valueLabel: { en: "portfolio value", zh: "组合市值" } as Bi,
    dayLabel: { en: "today", zh: "今日" } as Bi,
  },

  about: {
    heading: { en: "Off the screen", zh: "屏幕之外" } as Bi,
    p1: {
      en: "Born and raised in Singapore. My dad put a badminton racket in my hand at six; years of serious training later, what survived wasn't the drills but the love, and weekends still happen on court. Video games arrived in my teens and amazed me twice over: how are these worlds built, and how do they gather people from completely different lives? Chasing both questions led me to Information Systems at SMU.",
      zh: "在新加坡出生长大。六岁那年爸爸把球拍塞进我手里，正经训练了好几年，最后留下来的不是动作，是放不下的热爱，周末照旧泡在球场。十几岁才碰上电子游戏，它让我惊讶了两次：这些世界是怎么造出来的？它们又凭什么把毫不相干的人聚到一起？追着这两个问题，我读了信息系统。",
    } as Bi,
    p2: {
      en: "This site is where I practice sharing what I learn. If something here made you curious, it has done its job.",
      zh: "这个网站是我练习分享的地方。如果哪件展品勾起了你的好奇心，它就算完成任务了。",
    } as Bi,
    shuttleTitle: { en: "you found the shuttlecock", zh: "你找到了那颗羽毛球" } as Bi,
  },

  contact: {
    heading: { en: "Say hi", zh: "来打个招呼" } as Bi,
    line: { en: "Email is fastest. I reply to strangers.", zh: "发邮件最快，陌生人也回。" } as Bi,
    email: { en: "Email", zh: "邮箱" } as Bi,
  },

  footer: {
    line: {
      en: "© 2026 Li Xuan · made at a lamplit desk · kruxqlyz.com",
      zh: "© 2026 立瑄 · 在一盏台灯下做的 · kruxqlyz.com",
    } as Bi,
  },
};
