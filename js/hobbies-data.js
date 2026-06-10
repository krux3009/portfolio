// hobbies-data.js — timeline content for the hobby pages.
// Each milestone:
//   age          (string)  shown in the badge on the line, e.g. "6" or "12–13" or "now"
//   title/titleZh
//   text/textZh  the story — [PLACEHOLDER] until real content is written
//   photo        (string|null)  path like "/assets/badminton-01.jpg"; null shows the
//                dashed photo slot. Drop image in /assets/ and set the path.
//   stat         (object|null)  games only: { label, labelZh, pct } renders a
//                hand-drawn progress bar, pct 0-100.

const HOBBY_TIMELINES = {
  badminton: {
    titleKey: "bdTitle",
    subKey: "bdSub",
    milestones: [
      {
        age: "~6",
        title: "[First racket — how it started]",
        titleZh: "[第一支球拍——故事的开始]",
        text: "[PLACEHOLDER — dad brings you to the court for the first time. What you remember: the sound, the smell of the hall, the too-big racket.]",
        textZh: "[占位 —— 爸爸第一次带你上球场。你记得的：球声、球馆的味道、那支太大的球拍。]",
        photo: null,
      },
      {
        age: "8–12",
        title: "[The training years — love and hate]",
        titleZh: "[训练岁月——又爱又恨]",
        text: "[PLACEHOLDER — serious training. Drills, footwork, losing weekends to the court. The love-hate years.]",
        textZh: "[占位 —— 正式训练。多球、步伐、整个周末耗在球场。又爱又恨的几年。]",
        photo: null,
      },
      {
        age: "12–13",
        title: "[Stopping training — keeping the fire]",
        titleZh: "[停训——火没灭]",
        text: "[PLACEHOLDER — training stops. School takes over. But the racket never goes into storage.]",
        textZh: "[占位 —— 训练停了，学业接管了生活。但球拍从来没收进储藏室。]",
        photo: null,
      },
      {
        age: "teens",
        title: "[Playing for the love of it]",
        titleZh: "[纯粹为了喜欢而打]",
        text: "[PLACEHOLDER — pickup games, school courts, friends. No coach, no drills — just play.]",
        textZh: "[占位 —— 野球、学校球场、朋友局。没有教练没有训练——就是打。]",
        photo: null,
      },
      {
        age: "now",
        title: "[More love than ever]",
        titleZh: "[比任何时候都更爱]",
        text: "[PLACEHOLDER — weekends on court, still chasing that perfect cross-court drop. The passion outlived the training.]",
        textZh: "[占位 —— 周末照旧在球场，还在追那一拍完美的劈吊对角。热爱活得比训练久。]",
        photo: null,
      },
    ],
  },

  games: {
    titleKey: "vgTitle",
    subKey: "vgSub",
    milestones: [
      {
        age: "13",
        title: "[The first game]",
        titleZh: "[第一款游戏]",
        text: "[PLACEHOLDER — which game pulled you in, who showed it to you, why it stuck.]",
        textZh: "[占位 —— 哪款游戏把你拉进坑、谁带你入的、为什么上头。]",
        photo: null,
        stat: null,
      },
      {
        age: "[??]",
        title: "[GAME 1 — the grind]",
        titleZh: "[游戏 1 —— 上分岁月]",
        text: "[PLACEHOLDER — the game you sank real hours into. What you learned, the rank you hit.]",
        textZh: "[占位 —— 真正投入时间的那款。学到了什么、打到了什么段位。]",
        photo: null,
        stat: { label: "[RANK / PROGRESS]", labelZh: "[段位 / 进度]", pct: 60 },
      },
      {
        age: "[??]",
        title: "[GAME 2 — the next world]",
        titleZh: "[游戏 2 —— 下一个世界]",
        text: "[PLACEHOLDER — the next obsession. How your taste changed.]",
        textZh: "[占位 —— 下一个沉迷的世界。口味怎么变的。]",
        photo: null,
        stat: { label: "[RANK / PROGRESS]", labelZh: "[段位 / 进度]", pct: 75 },
      },
      {
        age: "now",
        title: "[Squad nights]",
        titleZh: "[开黑之夜]",
        text: "[PLACEHOLDER — voice chat, good friends, games as the place where everyone shows up.]",
        textZh: "[占位 —— 语音、老朋友、游戏成了大家固定碰头的地方。]",
        photo: null,
        stat: { label: "[CURRENT GAME]", labelZh: "[现在在玩]", pct: 90 },
      },
    ],
  },
};
