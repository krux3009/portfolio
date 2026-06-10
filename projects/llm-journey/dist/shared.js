/*
  Journey of a Token — interactive explainer. SHARED block (single source).
  Edit THIS file (plus stepper.jsx / scrolly.jsx), then run ./build.sh —
  the compiled dist/*.js is what the HTML pages load. Commit dist/ output.

  ASSUMPTIONS:
  - Probabilities & attention scores are HAND-CRAFTED for teaching (banner shown in loop scene).
  - Token IDs are illustrative, not from a real tokenizer.
  - Real-model numbers (4096 / 14336 / 32 layers / 128256 vocab) from Llama 3 8B config, as of 2026-06-10.
  - Copy rule: metaphor first, official terms live in the per-station “📄 in the papers” tag
    and in the Station-8 decoder. Body text must read clean for a non-technical adult.
*/
const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;
const INK = '#2B2B2B',
  BLUE = '#2563EB',
  RUST = '#C04A1A',
  GREEN = '#1E7A4D',
  HL = '#F5D547',
  PAPER = '#FAF8F3';

// ---------- i18n ----------
const STRINGS = {
  en: {
    appTitle: 'Journey of a Token',
    appSub: 'how an AI like ChatGPT reads your sentence and writes back — seen from inside',
    langBtn: '中文',
    next: 'Next →',
    back: '← Back',
    restart: 'Restart journey',
    stops: ['Gate', 'Pieces', 'Meaning', 'Order', 'Meeting', 'Workshop', 'Conveyor', 'THE LOOP', 'Decoder'],
    s0Title: 'Pick a sentence. Become a word.',
    s0Lead: 'The AI behind every chatbot is a factory that does exactly one job: guess the next word-piece. To see how, you will ride through it as one of the words. Choose your sentence:',
    s0Hero: w => `You are “${w}”. For the rest of this tour, that yellow highlight is you.`,
    s0Note: 'Everything you will see is the real machinery — the same factory inside ChatGPT, Claude, or Llama. The numbers come from a real open model (Llama 3 8B).',
    s1Title: 'Station 1 · The front door — the chopping machine',
    s1Nerd: 'in the papers: “tokenizer”',
    s1Lead: 'The factory cannot read letters. A chopping machine splits your sentence into pieces and hands each piece a number — its place in a fixed catalogue of 128,256 pieces.',
    s1Hover: 'Hover any piece to see its catalogue number.',
    s1Sub: 'Rare words get chopped into smaller pieces:',
    s1Aside: 'This is why these AIs once miscounted the R’s in “strawberry” — the factory sees catalogue numbers, never letters.',
    s2Title: 'Station 2 · The meaning desk',
    s2Nerd: 'in the papers: “embedding”',
    s2Lead: w => `Your number is traded for an arrow that points at your meaning. Words that mean similar things point in similar directions. You, “${w}”, get the arrow the factory learned from billions of sentences.`,
    s2Hover: 'Hover the dots — neighbours share meaning.',
    s2Real: 'Drawn flat here. In the real factory your arrow is a list of 4,096 numbers.',
    s3Title: 'Station 3 · The order stamp',
    s3Nerd: 'in the papers: “positional encoding (RoPE)”',
    s3Lead: 'Same word, different seat in the sentence → a different stamp. The stamp twists your arrow by an angle that depends on your seat number, so the factory can later feel which word came first and how far apart two words sit.',
    s3Drag: 'Drag your seat position:',
    s3Pos: p => `seat ${p}`,
    s3Ghost: 'arrow before the twist',
    s4Title: 'Station 4 · The meeting room',
    s4Nerd: 'in the papers: “attention” — Query · Key · Value',
    s4Lead: (last, hero) => `The only place where words talk to each other. The last word “${last}” must guess what comes next — so it holds up a question card, and every earlier word holds up a name-tag. Click each earlier word to compare its name-tag with the question.`,
    s4YouGeneric: (hero, last) => `You, “${hero}”, match the question best — your note of information is handed to “${last}”.`,
    s4YouAsk: (winner, last) => `This time you, “${last}”, are the one asking. “${winner}” matches your question best — its note of information flows into you.`,
    s4OtherWins: (winner, last) => `“${winner}” matches the question best — its note of information is handed to “${last}”.`,
    s4Mask: 'words after the reader are covered up — no peeking at the future',
    s4Weights: 'match scores become shares of attention that add up to 100%:',
    s4KV: 'Memory-saver: the factory files every name-tag and note in a cabinet, so it never has to re-read the whole sentence from scratch. Modern factories even let 4 question-askers share 1 cabinet. (Papers call this the KV cache and GQA — Llama 3 8B: 32 askers, 8 cabinets.)',
    s4ClickPrompt: '… click the words above',
    s5Title: 'Station 5 · The private workshop — the factory’s memory',
    s5Nerd: 'in the papers: “feed-forward network (FFN)”',
    s5Lead: 'After the meeting room, each word is processed alone. This station holds everything the factory ever learned about the world — and it is the reason the final guess is smart instead of mush.',
    s5B1Head: '1 · Clues, no knowledge',
    s5B1: 'The meeting room only MOVED information between words — nothing new entered the factory. You now carry clues like these, but the factory still knows nothing about the world:',
    s5B2Head: '2 · The memory drawers',
    s5B2: n => `Your arrow walks past thousands of labelled drawers. A drawer springs open when its label matches your clues — and pours what the factory learned into your arrow. (${n} drawers on this floor alone; 32 floors.)`,
    s5B3Head: '3 · Why it matters',
    s5B3: 'The same station, with its memory switched on or off. This is why the workshop exists: the meeting room gathers the clues, the workshop adds the knowledge. Flip the switch:',
    s5SwitchOn: 'Workshop: ON',
    s5SwitchOff: 'Workshop: OFF',
    s5WithoutTitle: 'guess WITHOUT the workshop',
    s5WithTitle: 'guess WITH the workshop',
    s5MushNote: 'grammar-shaped mush — sounds like language, knows nothing. The loop would write nonsense.',
    s5SharpNote: 'the confident guess you will play with at THE LOOP',
    s5Bridge: 'For paper-readers: these drawers are what papers call key-value memories — the feed-forward network (FFN). Its width is the intermediate_size line in a model card (14,336 here). A learned dimmer (SwiGLU) decides how wide each drawer opens.',
    s5Rome: 'Facts physically live in these drawers: researchers (ROME) once swapped the contents of the “capital of France” drawer to “Rome” — and the AI began confidently answering Rome. No retraining needed.',
    s5Next: 'Next beat →',
    s5Prev: '← Back',
    drawerMore: n => `…and ${n} more drawers on this wall`,
    home: 'Home',
    s6Title: 'Station 6 · The conveyor belt',
    s6Nerd: 'in the papers: “residual stream” · “RMSNorm”',
    s6Lead: 'You repeat meeting-room → workshop 32 times. The golden rule: every station only ADDS a small correction onto your arrow — nothing is ever erased. Between stations, a gauge re-standardises your arrow’s length so the additions never blow up.',
    s6Scrub: 'Scrub through the 32 blocks:',
    s6Block: n => `block ${n} / 32`,
    s6Notes: n => `${n} margin notes accumulated`,
    s6Gauge: 'length gauge',
    s6GaugeSub: 'length → standard ✓',
    s7Title: 'Final station · THE LOOP',
    s7Nerd: 'in the papers: “next-token prediction” · “logits” · “sampling”',
    s7Lead: 'At the exit, the last word’s finished arrow is scored against all 128,256 catalogue pieces, and the scores become chances of being picked. One piece is drawn — and here is the secret of every chatbot: the new piece is glued onto the sentence and THE WHOLE FACTORY RUNS AGAIN. One full trip per word-piece, until a special “I’m done” piece is drawn.',
    s7Honest: 'Honesty note: these chances are hand-designed for teaching. A real model computes them fresh from ~8 billion learned numbers.',
    s7Temp: 'Temperature (how daring the draw is)',
    s7TempLo: 'careful',
    s7TempHi: 'wild',
    s7TopP: 'Top-p (ignore the long tail of unlikely pieces)',
    s7Sample: '🎲 Draw',
    s7Greedy: 'Pick top',
    s7Auto: '▶ Auto-write',
    s7Stop: '■ Stop',
    s7Reset: 'Reset',
    s7Loops: n => `factory ran ${n} time${n === 1 ? '' : 's'}`,
    s7Done: n => `Reply complete — the factory ran end-to-end ${n} times, once per piece.`,
    s7Dist: 'chance of being the next piece',
    s7Cut: 'dropped by top-p',
    s7Pipe: ['chop', 'look up meaning', '32 blocks', 'score', 'draw'],
    s8Title: 'Exit gift · the jargon decoder',
    s8Lead: 'You rode the whole factory without the jargon — here are the official names. Every line of a real model card names a part you just visited. (Numbers: Llama 3 8B.) Click a row to revisit its station.',
    s8Close: 'That’s the whole machine: one loop, run once per word-piece. Now open any model card — you’ll recognise every part.',
    s8Cols: ['config term', 'factory part', 'what it means'],
    footer: 'Made by hand by Li Xuan · more at kruxqlyz.com'
  },
  zh: {
    appTitle: '一个 Token 的旅程',
    appSub: '从词的视角，看 ChatGPT 这类 AI 如何读懂句子并回复',
    langBtn: 'EN',
    next: '下一站 →',
    back: '← 上一站',
    restart: '重新开始',
    stops: ['大门', '切片', '语义', '顺序', '会议室', '车间', '传送带', '循环', '解码器'],
    s0Title: '选一个句子，变成其中一个词。',
    s0Lead: '聊天机器人背后的 AI 是一座工厂，只做一件事：猜下一个词片。为了看清原理，你将化身句中的一个词亲自走一遍。选择你的句子：',
    s0Hero: w => `你是「${w}」。接下来整趟旅程，黄色高亮就是你。`,
    s0Note: '你将看到的都是真实的机器——ChatGPT、Claude、Llama 内部同样的工厂。数字来自真实开源模型 Llama 3 8B。',
    s1Title: '第一站 · 工厂大门——切片机',
    s1Nerd: '论文里叫：分词器 tokenizer',
    s1Lead: '工厂读不懂字母。一台切片机把句子切成词片，每片领到一个编号——它在一本固定目录（共 128,256 片）里的位置。',
    s1Hover: '悬停任意词片，看它的目录编号。',
    s1Sub: '生僻词会被切成更小的片：',
    s1Aside: '这就是这类 AI 曾数错 strawberry 里有几个 R 的原因——工厂只看目录编号，从不看字母。',
    s2Title: '第二站 · 语义服务台',
    s2Nerd: '论文里叫：词嵌入 embedding',
    s2Lead: w => `你的编号被换成一支指向「你的意思」的箭头。意思相近的词，箭头方向也相近。你（「${w}」）领到的是工厂从几十亿个句子里学来的那支箭头。`,
    s2Hover: '悬停圆点——相邻的词意思相近。',
    s2Real: '这里画成了平面。真实工厂里，你的箭头是一串 4,096 个数字。',
    s3Title: '第三站 · 顺序印章',
    s3Nerd: '论文里叫：位置编码 RoPE',
    s3Lead: '同一个词，坐在句子的不同位置 → 盖不同的章。印章按你的座位号把箭头转一个角度，让工厂之后能感觉到谁先谁后、隔了多远。',
    s3Drag: '拖动你的座位位置：',
    s3Pos: p => `座位 ${p}`,
    s3Ghost: '旋转前的箭头',
    s4Title: '第四站 · 会议室',
    s4Nerd: '论文里叫：注意力 attention——Query · Key · Value',
    s4Lead: (last, hero) => `词与词唯一能交流的地方。最后一个词「${last}」要猜接下来是什么——于是它举起一张提问卡，每个更早的词举起自己的名牌。点击每个早先的词，看它的名牌和提问卡有多匹配。`,
    s4YouGeneric: (hero, last) => `你（「${hero}」）和提问最匹配——你的信息便条被递给了「${last}」。`,
    s4YouAsk: (winner, last) => `这一次提问的是你（「${last}」）。「${winner}」和你的提问最匹配——它的信息便条流进了你这里。`,
    s4OtherWins: (winner, last) => `「${winner}」和提问最匹配——它的信息便条被递给了「${last}」。`,
    s4Mask: '读者之后的词被盖住——禁止偷看未来',
    s4Weights: '匹配分变成总和为 100% 的注意力份额：',
    s4KV: '省力机制：工厂把每张名牌和便条都存进文件柜，不必每次从头重读整句话。现代工厂还让 4 个提问者共用 1 个柜子。（论文里叫 KV 缓存和 GQA——Llama 3 8B：32 个提问者、8 个柜子。）',
    s4ClickPrompt: '…点击上方的词',
    s5Title: '第五站 · 私人车间——工厂的记忆',
    s5Nerd: '论文里叫：前馈网络 FFN',
    s5Lead: '离开会议室后，每个词独自接受加工。这一站存放着工厂学到的关于世界的一切——也是最终猜测「聪明」而非「糊状」的原因。',
    s5B1Head: '1 · 有线索，没知识',
    s5B1: '会议室只是在词与词之间搬运信息——工厂里没有进来任何新东西。你现在带着这些线索，但工厂对世界仍一无所知：',
    s5B2Head: '2 · 记忆抽屉墙',
    s5B2: n => `你的箭头走过成千上万个贴着标签的抽屉。标签与你的线索匹配的抽屉会弹开——把工厂学到的内容倒进你的箭头。（仅这一层就有 ${n} 个抽屉；共 32 层。）`,
    s5B3Head: '3 · 它为什么重要',
    s5B3: '同一个工位，记忆开启或关闭。这就是车间存在的理由：会议室收集线索，车间注入知识。拨动开关试试：',
    s5SwitchOn: '车间：运转中',
    s5SwitchOff: '车间：已关闭',
    s5WithoutTitle: '没有车间时的猜测',
    s5WithTitle: '有车间时的猜测',
    s5MushNote: '语法上像句话，但什么都不知道——糊状猜测。循环只会写出胡话。',
    s5SharpNote: '这就是你将在「循环」站玩到的自信猜测',
    s5Bridge: '给读论文的人：这些抽屉就是论文里的 key-value memories——前馈网络（FFN）。它的宽度即模型卡里的 intermediate_size（此处 14,336）。每个抽屉开多大，由一个学到的调光器（SwiGLU）决定。',
    s5Rome: '事实就住在这些抽屉里：研究者（ROME）曾把「法国首都」抽屉的内容换成「罗马」——这个 AI 从此自信地回答罗马。无需重新训练。',
    s5Next: '下一幕 →',
    s5Prev: '← 上一幕',
    drawerMore: n => `……这面墙上还有 ${n} 个抽屉`,
    home: '主页',
    s6Title: '第六站 · 传送带',
    s6Nerd: '论文里叫：残差流 residual stream · RMSNorm',
    s6Lead: '「会议室 → 车间」你要重复 32 次。黄金法则：每一站只往你的箭头上「加」一笔小修正——什么都不会被擦掉。站与站之间有一个校准仪，把箭头长度调回标准，防止越加越大。',
    s6Scrub: '拖动浏览 32 个厂块：',
    s6Block: n => `第 ${n} / 32 块`,
    s6Notes: n => `已累积 ${n} 条页边批注`,
    s6Gauge: '长度校准仪',
    s6GaugeSub: '长度 → 标准 ✓',
    s7Title: '终点站 · 循环',
    s7Nerd: '论文里叫：下一词预测 · logits · 抽样 sampling',
    s7Lead: '在出口，最后一个词的成品箭头与目录里全部 128,256 个词片逐一打分，分数变成各片的中签机会。抽出一片——接着是所有聊天机器人的秘密：新词片粘回句尾，整座工厂重新跑一遍。每个词片跑一整趟，直到抽到表示「说完了」的特殊词片。',
    s7Honest: '诚实声明：这里的机会是为教学手工设计的。真实模型由约 80 亿个学到的数字现场计算。',
    s7Temp: '温度（抽签有多大胆）',
    s7TempLo: '谨慎',
    s7TempHi: '狂野',
    s7TopP: 'Top-p（忽略机会渺茫的长尾）',
    s7Sample: '🎲 抽一片',
    s7Greedy: '选最高',
    s7Auto: '▶ 自动写',
    s7Stop: '■ 停止',
    s7Reset: '重置',
    s7Loops: n => `工厂已运转 ${n} 次`,
    s7Done: n => `回复完成——工厂端到端运转了 ${n} 次，每个词片一次。`,
    s7Dist: '成为下一个词片的机会',
    s7Cut: '被 top-p 舍弃',
    s7Pipe: ['切片', '查语义', '32 厂块', '打分', '抽签'],
    s8Title: '出口礼物 · 术语解码器',
    s8Lead: '整趟旅程没用术语——现在送你官方名字。真实模型卡的每一行配置，都对应你刚经过的一个工厂部件（数字：Llama 3 8B）。点击行可回到对应站点。',
    s8Close: '整台机器就是：一个循环，每个词片跑一次。现在去打开任何模型卡——每个部件你都认识。',
    s8Cols: ['配置项', '工厂部件', '含义'],
    footer: '立瑄手作 · 更多见 kruxqlyz.com'
  }
};

// ---------- toy LM data ----------
const PROMPTS = [{
  id: 'cat',
  label: 'The cat sat on the',
  tokens: ['The', 'cat', 'sat', 'on', 'the'],
  ids: [791, 4937, 7731, 389, 279],
  hero: 1,
  reader: 4,
  att: [{
    i: 0,
    s: 0.9
  }, {
    i: 1,
    s: 3.6
  }, {
    i: 2,
    s: 2.1
  }, {
    i: 3,
    s: 1.2
  }],
  ffn: {
    clues: {
      en: ['“the ___” → an object is coming', 'subject nearby: cat', 'scene: something being sat on'],
      zh: ['「the ___」→ 后面要来一个物体', '附近的主语：cat（猫）', '场景：有东西被坐着']
    },
    drawers: [{
      l: 'cats sit on things',
      a: '+ mat, sofa, windowsill',
      lz: '猫爱坐在东西上',
      az: '+ 垫子、沙发、窗台',
      match: true
    }, {
      l: '“the” needs a noun',
      a: '+ expect a thing-word',
      lz: '「the」后接名词',
      az: '+ 预期一个名词',
      match: true
    }, {
      l: 'cozy household scenes',
      a: '+ home objects',
      lz: '温馨居家场景',
      az: '+ 家居物品',
      match: true
    }, {
      l: 'capital cities',
      a: '(stays shut)',
      lz: '各国首都',
      az: '（没动静）',
      match: false
    }, {
      l: 'storybook openings',
      a: '(stays shut)',
      lz: '童话开场白',
      az: '（没动静）',
      match: false
    }],
    before: [{
      t: 'mat',
      p: .12
    }, {
      t: 'blue',
      p: .11
    }, {
      t: 'sofa',
      p: .11
    }, {
      t: 'running',
      p: .10
    }, {
      t: 'Paris',
      p: .09
    }]
  },
  start: [{
    t: 'mat',
    p: .58
  }, {
    t: 'sofa',
    p: .15
  }, {
    t: 'floor',
    p: .10
  }, {
    t: 'keyboard',
    p: .08
  }, {
    t: 'windowsill',
    p: .05
  }, {
    t: 'moon',
    p: .04
  }],
  bigram: {
    mat: [{
      t: ',',
      p: .4
    }, {
      t: '.',
      p: .3
    }, {
      t: 'and',
      p: .3
    }],
    sofa: [{
      t: ',',
      p: .4
    }, {
      t: '.',
      p: .35
    }, {
      t: 'and',
      p: .25
    }],
    floor: [{
      t: ',',
      p: .4
    }, {
      t: '.',
      p: .35
    }, {
      t: 'and',
      p: .25
    }],
    keyboard: [{
      t: ',',
      p: .35
    }, {
      t: 'and',
      p: .35
    }, {
      t: '.',
      p: .3
    }],
    windowsill: [{
      t: ',',
      p: .45
    }, {
      t: '.',
      p: .3
    }, {
      t: 'and',
      p: .25
    }],
    moon: [{
      t: ',',
      p: .4
    }, {
      t: '.',
      p: .35
    }, {
      t: 'and',
      p: .25
    }],
    ',': [{
      t: 'purring',
      p: .45
    }, {
      t: 'watching',
      p: .3
    }, {
      t: 'waiting',
      p: .25
    }],
    and: [{
      t: 'purred',
      p: .4
    }, {
      t: 'fell',
      p: .3
    }, {
      t: 'stretched',
      p: .3
    }],
    purring: [{
      t: 'softly',
      p: .5
    }, {
      t: 'loudly',
      p: .3
    }, {
      t: '.',
      p: .2
    }],
    watching: [{
      t: 'the',
      p: .6
    }, {
      t: 'birds',
      p: .4
    }],
    waiting: [{
      t: 'for',
      p: 1
    }],
    for: [{
      t: 'dinner',
      p: .6
    }, {
      t: 'its',
      p: .4
    }],
    its: [{
      t: 'human',
      p: 1
    }],
    human: [{
      t: '.',
      p: 1
    }],
    dinner: [{
      t: '.',
      p: 1
    }],
    the: [{
      t: 'birds',
      p: .6
    }, {
      t: 'rain',
      p: .4
    }],
    birds: [{
      t: 'outside',
      p: .5
    }, {
      t: '.',
      p: .5
    }],
    outside: [{
      t: '.',
      p: 1
    }],
    rain: [{
      t: '.',
      p: 1
    }],
    softly: [{
      t: '.',
      p: 1
    }],
    loudly: [{
      t: '.',
      p: 1
    }],
    purred: [{
      t: 'happily',
      p: .5
    }, {
      t: '.',
      p: .5
    }],
    happily: [{
      t: '.',
      p: 1
    }],
    fell: [{
      t: 'asleep',
      p: 1
    }],
    asleep: [{
      t: '.',
      p: 1
    }],
    stretched: [{
      t: 'out',
      p: .6
    }, {
      t: '.',
      p: .4
    }],
    out: [{
      t: '.',
      p: 1
    }]
  }
}, {
  id: 'paris',
  label: 'Paris is the capital of',
  tokens: ['Paris', 'is', 'the', 'capital', 'of'],
  ids: [60704, 374, 279, 6864, 315],
  hero: 0,
  reader: 4,
  att: [{
    i: 0,
    s: 4.1
  }, {
    i: 1,
    s: 0.7
  }, {
    i: 2,
    s: 0.5
  }, {
    i: 3,
    s: 2.6
  }],
  ffn: {
    clues: {
      en: ['“capital of ___” → a country fits', 'subject: Paris', 'tone: encyclopedia sentence'],
      zh: ['「capital of ___」→ 该填一个国家', '主语：Paris（巴黎）', '语气：百科句式']
    },
    drawers: [{
      l: 'capital of France ↔ Paris',
      a: '+ France — the fact!',
      lz: '法国首都 ↔ 巴黎',
      az: '+ France——事实本体！',
      match: true
    }, {
      l: 'geography & place names',
      a: '+ country words',
      lz: '地理与地名',
      az: '+ 国家词汇',
      match: true
    }, {
      l: 'encyclopedia tone',
      a: '+ formal endings',
      lz: '百科语气',
      az: '+ 正式收尾',
      match: true
    }, {
      l: 'cats sit on things',
      a: '(stays shut)',
      lz: '猫爱坐在东西上',
      az: '（没动静）',
      match: false
    }, {
      l: 'storybook openings',
      a: '(stays shut)',
      lz: '童话开场白',
      az: '（没动静）',
      match: false
    }],
    before: [{
      t: 'France',
      p: .15
    }, {
      t: 'Europe',
      p: .13
    }, {
      t: 'London',
      p: .12
    }, {
      t: 'pizza',
      p: .10
    }, {
      t: 'the',
      p: .09
    }]
  },
  start: [{
    t: 'France',
    p: .91
  }, {
    t: 'the',
    p: .04
  }, {
    t: 'a',
    p: .02
  }, {
    t: 'Europe',
    p: .02
  }, {
    t: 'romance',
    p: .01
  }],
  bigram: {
    France: [{
      t: '.',
      p: .8
    }, {
      t: ',',
      p: .15
    }, {
      t: 'and',
      p: .05
    }],
    ',': [{
      t: 'and',
      p: .6
    }, {
      t: 'home',
      p: .4
    }],
    and: [{
      t: 'its',
      p: .55
    }, {
      t: 'the',
      p: .45
    }],
    its: [{
      t: 'culture',
      p: 1
    }],
    culture: [{
      t: '.',
      p: 1
    }],
    the: [{
      t: 'French',
      p: .6
    }, {
      t: 'country',
      p: .4
    }],
    French: [{
      t: 'Republic',
      p: .8
    }, {
      t: 'nation',
      p: .2
    }],
    Republic: [{
      t: '.',
      p: 1
    }],
    nation: [{
      t: '.',
      p: 1
    }],
    country: [{
      t: '.',
      p: 1
    }],
    a: [{
      t: 'European',
      p: .6
    }, {
      t: 'beautiful',
      p: .4
    }],
    European: [{
      t: 'country',
      p: .7
    }, {
      t: 'capital',
      p: .3
    }],
    beautiful: [{
      t: 'city',
      p: 1
    }],
    city: [{
      t: '.',
      p: 1
    }],
    capital: [{
      t: '.',
      p: 1
    }],
    Europe: [{
      t: '.',
      p: .7
    }, {
      t: ',',
      p: .3
    }],
    romance: [{
      t: '.',
      p: 1
    }],
    home: [{
      t: 'of',
      p: .6
    }, {
      t: 'to',
      p: .4
    }],
    of: [{
      t: 'fashion',
      p: .5
    }, {
      t: 'art',
      p: .5
    }],
    to: [{
      t: 'fashion',
      p: .5
    }, {
      t: 'art',
      p: .5
    }],
    fashion: [{
      t: '.',
      p: 1
    }],
    art: [{
      t: '.',
      p: 1
    }]
  }
}, {
  id: 'story',
  label: 'Once upon a time',
  tokens: ['Once', 'upon', 'a', 'time'],
  ids: [12805, 5304, 264, 892],
  hero: 3,
  reader: 3,
  att: [{
    i: 0,
    s: 2.8
  }, {
    i: 1,
    s: 2.2
  }, {
    i: 2,
    s: 1.4
  }],
  ffn: {
    clues: {
      en: ['“once upon a ___” pattern', 'tone: a story is starting', 'next: who / where'],
      zh: ['「once upon a ___」句式', '语气：故事要开始了', '接下来：谁 / 在哪']
    },
    drawers: [{
      l: 'storybook openings',
      a: '+ “, there was…”',
      lz: '童话开场白',
      az: '+ 「, there was…」',
      match: true
    }, {
      l: 'fairy-tale cast',
      a: '+ princess, dragon, robot',
      lz: '童话角色库',
      az: '+ 公主、龙、机器人',
      match: true
    }, {
      l: 'narrative voice',
      a: '+ gentle pacing',
      lz: '叙事语态',
      az: '+ 舒缓节奏',
      match: true
    }, {
      l: 'capital cities',
      a: '(stays shut)',
      lz: '各国首都',
      az: '（没动静）',
      match: false
    }, {
      l: 'cats sit on things',
      a: '(stays shut)',
      lz: '猫爱坐在东西上',
      az: '（没动静）',
      match: false
    }],
    before: [{
      t: ',',
      p: .13
    }, {
      t: 'there',
      p: .12
    }, {
      t: 'machine',
      p: .11
    }, {
      t: 'the',
      p: .10
    }, {
      t: 'blue',
      p: .09
    }]
  },
  start: [{
    t: ',',
    p: .38
  }, {
    t: 'there',
    p: .30
  }, {
    t: 'in',
    p: .18
  }, {
    t: 'a',
    p: .08
  }, {
    t: 'long',
    p: .06
  }],
  bigram: {
    ',': [{
      t: 'there',
      p: .55
    }, {
      t: 'in',
      p: .3
    }, {
      t: 'a',
      p: .15
    }],
    there: [{
      t: 'was',
      p: .6
    }, {
      t: 'lived',
      p: .4
    }],
    was: [{
      t: 'a',
      p: .7
    }, {
      t: 'an',
      p: .3
    }],
    lived: [{
      t: 'a',
      p: .8
    }, {
      t: 'an',
      p: .2
    }],
    a: [{
      t: 'princess',
      p: .3
    }, {
      t: 'dragon',
      p: .25
    }, {
      t: 'tiny',
      p: .25
    }, {
      t: 'robot',
      p: .2
    }],
    an: [{
      t: 'old',
      p: .6
    }, {
      t: 'inventor',
      p: .4
    }],
    in: [{
      t: 'a',
      p: .7
    }, {
      t: 'the',
      p: .3
    }],
    the: [{
      t: 'mountains',
      p: .5
    }, {
      t: 'forest',
      p: .5
    }],
    princess: [{
      t: 'who',
      p: .5
    }, {
      t: '.',
      p: .3
    }, {
      t: 'and',
      p: .2
    }],
    dragon: [{
      t: 'who',
      p: .5
    }, {
      t: '.',
      p: .3
    }, {
      t: 'and',
      p: .2
    }],
    tiny: [{
      t: 'robot',
      p: .6
    }, {
      t: 'village',
      p: .4
    }],
    robot: [{
      t: 'who',
      p: .5
    }, {
      t: '.',
      p: .5
    }],
    village: [{
      t: '.',
      p: .6
    }, {
      t: 'by',
      p: .4
    }],
    who: [{
      t: 'loved',
      p: .6
    }, {
      t: 'dreamed',
      p: .4
    }],
    loved: [{
      t: 'to',
      p: .6
    }, {
      t: 'the',
      p: .4
    }],
    dreamed: [{
      t: 'of',
      p: 1
    }],
    of: [{
      t: 'flying',
      p: .6
    }, {
      t: 'the',
      p: .4
    }],
    to: [{
      t: 'sing',
      p: .5
    }, {
      t: 'explore',
      p: .5
    }],
    sing: [{
      t: '.',
      p: 1
    }],
    explore: [{
      t: '.',
      p: 1
    }],
    flying: [{
      t: '.',
      p: 1
    }],
    old: [{
      t: 'inventor',
      p: .7
    }, {
      t: 'wizard',
      p: .3
    }],
    inventor: [{
      t: 'who',
      p: .6
    }, {
      t: '.',
      p: .4
    }],
    wizard: [{
      t: 'who',
      p: .6
    }, {
      t: '.',
      p: .4
    }],
    and: [{
      t: 'everyone',
      p: .6
    }, {
      t: 'the',
      p: .4
    }],
    everyone: [{
      t: 'loved',
      p: 1
    }],
    long: [{
      t: 'ago',
      p: .9
    }, {
      t: ',',
      p: .1
    }],
    ago: [{
      t: ',',
      p: .6
    }, {
      t: '.',
      p: .4
    }],
    mountains: [{
      t: '.',
      p: .6
    }, {
      t: ',',
      p: .4
    }],
    forest: [{
      t: ',',
      p: .5
    }, {
      t: '.',
      p: .5
    }],
    by: [{
      t: 'the',
      p: 1
    }]
  }
}];

// ---------- toy LM math ----------
function applyTemperature(cands, T) {
  const w = cands.map(c => Math.pow(Math.max(c.p, 1e-6), 1 / T));
  const s = w.reduce((a, b) => a + b, 0);
  return cands.map((c, i) => ({
    ...c,
    q: w[i] / s
  }));
}
function topPSet(cands, topP) {
  // cands sorted desc by q
  let cum = 0;
  const kept = [];
  for (const c of cands) {
    kept.push(c);
    cum += c.q;
    if (cum >= topP) break;
  }
  return kept;
}
function nextCandidates(prompt, genTokens) {
  const last = genTokens.length ? genTokens[genTokens.length - 1] : null;
  if (last === null) return prompt.start;
  return prompt.bigram[last] || [{
    t: '.',
    p: 1
  }];
}

// ---------- small shared components ----------
function ArrowSvg({
  angle = 0,
  len = 110,
  color = RUST,
  ghost = false,
  notes = 0,
  w = 260,
  h = 200
}) {
  const cx = w / 2,
    cy = h / 2;
  const rad = angle * Math.PI / 180;
  const x2 = cx + len * Math.cos(rad),
    y2 = cy - len * Math.sin(rad);
  const ticks = [];
  for (let i = 0; i < notes; i++) {
    const f = (i + 1) / (notes + 1);
    const tx = cx + len * f * Math.cos(rad),
      ty = cy - len * f * Math.sin(rad);
    ticks.push(/*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: tx,
      cy: ty,
      r: "3.5",
      fill: i % 2 ? BLUE : GREEN,
      opacity: "0.85"
    }));
  }
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: cx,
    y1: cy,
    x2: x2,
    y2: y2,
    stroke: color,
    strokeWidth: "5",
    strokeLinecap: "round",
    opacity: ghost ? 0.25 : 1,
    strokeDasharray: ghost ? '7 7' : 'none'
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `${x2},${y2} ${x2 - 14 * Math.cos(rad - 0.45)},${y2 + 14 * Math.sin(rad - 0.45)} ${x2 - 14 * Math.cos(rad + 0.45)},${y2 + 14 * Math.sin(rad + 0.45)}`,
    fill: color,
    opacity: ghost ? 0.25 : 1
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "5",
    fill: INK
  }), ticks);
}
function SceneFrame({
  title,
  lead,
  children,
  aside,
  nerd
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: '0 auto',
      padding: '8px 8px 24px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "hand",
    style: {
      fontSize: 38,
      margin: '4px 0 6px',
      lineHeight: 1.1
    }
  }, title), nerd && /*#__PURE__*/React.createElement("div", {
    className: "nerd-tag"
  }, "\uD83D\uDCC4 ", nerd), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16.5,
      lineHeight: 1.55,
      margin: '0 0 18px',
      maxWidth: 760
    }
  }, lead), children, aside && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: '12px 16px',
      border: `2px dashed ${RUST}`,
      borderRadius: 12,
      background: '#FFF7F2',
      fontSize: 14.5,
      lineHeight: 1.5
    }
  }, "\u270F\uFE0F ", aside));
}
function SentenceRow({
  prompt,
  heroOn = true,
  maskFrom = null,
  onTok = null,
  active = [],
  gen = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '6px 0 14px'
    }
  }, prompt.tokens.map((t, i) => {
    const cls = ['tok'];
    if (heroOn && i === prompt.hero) cls.push('hero');
    if (maskFrom !== null && i > maskFrom) cls.push('future');
    if (onTok && i < prompt.reader) cls.push('clickable');
    if (active.includes(i)) cls.push('flash');
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: cls.join(' '),
      onClick: onTok && i < prompt.reader ? () => onTok(i) : undefined
    }, t);
  }), gen.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: 'g' + i,
    className: "tok gen pop-anim"
  }, t)));
}

// ---------- scenes ----------
function Scene0({
  L,
  prompt,
  setPromptId
}) {
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s0Title,
    lead: L.s0Lead,
    aside: L.s0Note
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, PROMPTS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "wb-card",
    onClick: () => setPromptId(p.id),
    style: {
      padding: '16px 20px',
      cursor: 'pointer',
      flex: '1 1 220px',
      outline: p.id === prompt.id ? `4px solid ${BLUE}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hand",
    style: {
      fontSize: 26
    }
  }, "\u201C", p.label, " \u2026\u201D")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(SentenceRow, {
    prompt: prompt
  }), /*#__PURE__*/React.createElement("p", {
    className: "hand",
    style: {
      fontSize: 26,
      color: RUST,
      margin: '6px 0 0'
    }
  }, L.s0Hero(prompt.tokens[prompt.hero]))));
}
function Scene1({
  L,
  prompt,
  progress
}) {
  const n = prompt.tokens.length;
  const shown = progress == null ? n : Math.max(1, Math.round(progress * n));
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s1Title,
    lead: L.s1Lead,
    aside: L.s1Aside,
    nerd: L.s1Nerd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--faint)',
      marginBottom: 4
    }
  }, L.s1Hover), /*#__PURE__*/React.createElement("div", null, prompt.tokens.slice(0, shown).map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: 'tok pop-anim' + (i === prompt.hero ? ' hero' : ''),
    title: 'ID ' + prompt.ids[i],
    style: {
      animationDelay: i * 0.08 + 's'
    }
  }, t, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      color: BLUE,
      fontWeight: 800
    }
  }, "#", prompt.ids[i])))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 15
    }
  }, L.s1Sub, ' ', /*#__PURE__*/React.createElement("span", {
    className: "tok"
  }, "token", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      color: BLUE
    }
  }, "#5963")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800
    }
  }, "+"), /*#__PURE__*/React.createElement("span", {
    className: "tok"
  }, "ization", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      color: BLUE
    }
  }, "#2065"))));
}
const MEANING_DOTS = [{
  w: 'king',
  x: 62,
  y: 38,
  c: 0
}, {
  w: 'queen',
  x: 78,
  y: 50,
  c: 0
}, {
  w: 'prince',
  x: 55,
  y: 58,
  c: 0
}, {
  w: 'Paris',
  x: 198,
  y: 36,
  c: 1
}, {
  w: 'France',
  x: 214,
  y: 52,
  c: 1
}, {
  w: 'London',
  x: 182,
  y: 55,
  c: 1
}, {
  w: 'cat',
  x: 120,
  y: 128,
  c: 2
}, {
  w: 'dog',
  x: 140,
  y: 140,
  c: 2
}, {
  w: 'kitten',
  x: 104,
  y: 142,
  c: 2
}, {
  w: 'time',
  x: 226,
  y: 120,
  c: 3
}, {
  w: 'once',
  x: 243,
  y: 135,
  c: 3
}, {
  w: 'story',
  x: 212,
  y: 140,
  c: 3
}];
const DOT_COLORS = [BLUE, GREEN, RUST, '#8B5CF6'];
function Scene2({
  L,
  prompt
}) {
  const [hov, setHov] = useState(null);
  const heroWord = prompt.tokens[prompt.hero];
  const heroDot = MEANING_DOTS.find(d => d.w.toLowerCase() === heroWord.toLowerCase()) || MEANING_DOTS[6];
  const heroColor = DOT_COLORS[heroDot.c];
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s2Title,
    lead: L.s2Lead(heroWord),
    aside: L.s2Real,
    nerd: L.s2Nerd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--faint)',
      marginBottom: 4
    }
  }, L.s2Hover), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: 10,
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "300",
    height: "190"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "170",
    x2: "290",
    y2: "170",
    stroke: INK,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "170",
    x2: "20",
    y2: "10",
    stroke: INK,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "170",
    x2: heroDot.x,
    y2: heroDot.y,
    stroke: heroColor,
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeDasharray: "300",
    style: {
      animation: 'drawLine 1.1s ease-out both'
    }
  }), MEANING_DOTS.map((d, i) => {
    const isHero = d === heroDot,
      dim = hov !== null && MEANING_DOTS[hov].c !== d.c && !isHero;
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      onMouseEnter: () => setHov(i),
      onMouseLeave: () => setHov(null),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: d.x,
      cy: d.y,
      r: isHero ? 8 : 6,
      fill: DOT_COLORS[d.c],
      opacity: dim ? 0.18 : 1
    }), /*#__PURE__*/React.createElement("text", {
      x: d.x + 9,
      y: d.y + 4,
      fontSize: "12.5",
      fontWeight: isHero ? 800 : 600,
      fill: isHero ? heroColor : INK,
      opacity: dim ? 0.18 : 1
    }, d.w));
  }))));
}
function Scene3({
  L,
  prompt,
  progress
}) {
  const [pos, setPos] = useState(prompt.hero + 1);
  const p = progress == null ? pos : 1 + Math.round(progress * 7);
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s3Title,
    lead: L.s3Lead,
    nerd: L.s3Nerd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(ArrowSvg, {
    angle: 35,
    ghost: true,
    w: 240,
    h: 180
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12.5,
      color: 'var(--faint)',
      marginTop: -26
    }
  }, L.s3Ghost)), /*#__PURE__*/React.createElement("div", {
    className: "hand",
    style: {
      fontSize: 34
    }
  }, "\u2192"), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(ArrowSvg, {
    angle: 35 + p * 18,
    w: 240,
    h: 180
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 800,
      color: RUST,
      marginTop: -26
    }
  }, L.s3Pos(p), " \xB7 +", p * 18, "\xB0"))), progress == null && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 4
    }
  }, L.s3Drag), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "8",
    value: pos,
    onChange: e => setPos(+e.target.value)
  })));
}
function Scene4({
  L,
  prompt
}) {
  const [revealed, setRevealed] = useState([]);
  const last = prompt.tokens[prompt.reader];
  const hero = prompt.tokens[prompt.hero];
  const scores = prompt.att;
  const exp = scores.map(a => revealed.includes(a.i) ? Math.exp(a.s) : 0);
  const sum = exp.reduce((a, b) => a + b, 0) || 1;
  const allIn = revealed.length === scores.length;
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s4Title,
    lead: L.s4Lead(last, hero),
    aside: L.s4KV,
    nerd: L.s4Nerd
  }, /*#__PURE__*/React.createElement(SentenceRow, {
    prompt: prompt,
    maskFrom: prompt.reader,
    onTok: i => setRevealed(r => r.includes(i) ? r : [...r, i]),
    active: revealed
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--faint)',
      marginBottom: 14
    }
  }, "\uD83D\uDEAB ", L.s4Mask), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '14px 18px',
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 8
    }
  }, L.s4Weights), scores.map(a => {
    const w = revealed.includes(a.i) ? exp[scores.indexOf(a)] / sum : 0;
    const isHero = a.i === prompt.hero;
    return /*#__PURE__*/React.createElement("div", {
      key: a.i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        margin: '5px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 90,
        fontWeight: isHero ? 800 : 600,
        background: isHero && w > 0 ? HL : 'transparent',
        borderRadius: 6,
        padding: '0 4px'
      }
    }, prompt.tokens[a.i]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 18,
        border: `1.5px solid ${INK}`,
        borderRadius: 6,
        overflow: 'hidden',
        background: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "barfill",
      style: {
        width: w * 100 + '%',
        height: '100%',
        background: isHero ? RUST : BLUE,
        opacity: isHero ? 1 : .65
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 48,
        fontSize: 13,
        fontWeight: 800,
        textAlign: 'right'
      }
    }, w > 0 ? (w * 100).toFixed(0) + '%' : '·'));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 14.5,
      minHeight: 22
    }
  }, allIn ? /*#__PURE__*/React.createElement("span", {
    className: "pop-anim",
    style: {
      color: GREEN,
      fontWeight: 800
    }
  }, "\u2713 ", (() => {
    const winner = prompt.tokens[scores.reduce((a, b) => b.s > a.s ? b : a).i];
    if (prompt.hero === prompt.reader) return L.s4YouAsk(winner, last);
    return winner === hero ? L.s4YouGeneric(hero, last) : L.s4OtherWins(winner, last);
  })()) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--faint)'
    }
  }, L.s4ClickPrompt))));
}
function Scene5({
  L,
  prompt,
  lang,
  progress
}) {
  const [beatSel, setBeatSel] = useState(0);
  const [ffnOn, setFfnOn] = useState(true);
  useEffect(() => {
    setBeatSel(0);
    setFfnOn(true);
  }, [prompt.id]);
  const beat = progress == null ? beatSel : Math.min(2, Math.floor(progress * 3.2));
  // route ←/→ to beats first; only unconsumed presses fall through to scene navigation
  const beatRef = useRef(beat);
  beatRef.current = beat;
  useEffect(() => {
    if (progress != null) return;
    window.__sceneKeyHandler = key => {
      if (key === 'ArrowRight' && beatRef.current < 2) {
        setBeatSel(b => Math.min(2, b + 1));
        return true;
      }
      if (key === 'ArrowLeft' && beatRef.current > 0) {
        setBeatSel(b => Math.max(0, b - 1));
        return true;
      }
      return false;
    };
    return () => {
      window.__sceneKeyHandler = null;
    };
  }, [progress]);
  const F = prompt.ffn;
  const after = prompt.start.slice(0, 5);
  const heads = [L.s5B1Head, L.s5B2Head, L.s5B3Head];
  const Panel = ({
    title,
    dist,
    active,
    note,
    testid
  }) => {
    const m = Math.max(...dist.map(c => c.p));
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": testid,
      className: "wb-card",
      style: {
        padding: '12px 16px',
        flex: '1 1 230px',
        maxWidth: 330,
        opacity: active ? 1 : .38,
        outline: active ? `3px solid ${GREEN}` : 'none',
        filter: active ? 'none' : 'grayscale(.7)',
        transition: 'all .35s'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        marginBottom: 6
      }
    }, title), dist.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: c.t,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        margin: '3px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 74,
        fontWeight: 700,
        fontFamily: 'monospace',
        fontSize: 13
      }
    }, c.t === '.' ? '⟨.⟩' : c.t), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 14,
        border: `1.5px solid ${INK}`,
        borderRadius: 5,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "barfill",
      style: {
        width: c.p / m * 100 + '%',
        height: '100%',
        background: i === 0 ? RUST : BLUE,
        opacity: i === 0 ? 1 : .6
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        fontSize: 12,
        fontWeight: 800,
        textAlign: 'right'
      }
    }, (c.p * 100).toFixed(0), "%"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: active ? GREEN : 'var(--faint)',
        fontWeight: active ? 700 : 400,
        marginTop: 6,
        minHeight: 30
      }
    }, note));
  };
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s5Title,
    lead: L.s5Lead,
    nerd: L.s5Nerd,
    aside: beat === 1 ? L.s5Rome : beat === 2 ? L.s5Bridge : null
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginBottom: 14,
      flexWrap: 'wrap'
    }
  }, heads.map((h, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: progress == null ? () => setBeatSel(i) : undefined,
    style: {
      cursor: progress == null ? 'pointer' : 'default',
      border: `2px solid ${INK}`,
      borderRadius: 16,
      padding: '3px 12px',
      fontSize: 12.5,
      fontWeight: 800,
      fontFamily: 'Nunito,sans-serif',
      background: i === beat ? RUST : i < beat ? '#E6F0E9' : '#fff',
      color: i === beat ? '#fff' : INK
    }
  }, h))), beat === 0 && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      maxWidth: 680,
      marginTop: 0
    }
  }, L.s5B1), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ArrowSvg, {
    angle: 42,
    len: 70,
    w: 120,
    h: 110
  }), F.clues[lang === 'zh' ? 'zh' : 'en'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      border: `2px solid ${BLUE}`,
      color: BLUE,
      borderRadius: 18,
      padding: '6px 14px',
      fontWeight: 700,
      fontSize: 14,
      background: '#F0F5FF'
    }
  }, c)))), beat === 1 && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      maxWidth: 680,
      marginTop: 0
    }
  }, L.s5B2('14,336')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '18px 16px 12px',
      background: '#F6F1E6',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "drawer-scroll",
    style: {
      display: 'flex',
      gap: 8
    }
  }, F.drawers.map((d, i) => {
    const lbl = lang === 'zh' ? d.lz : d.l,
      adds = lang === 'zh' ? d.az : d.a;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 110,
        flex: '0 0 110px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `2px solid ${INK}`,
        borderRadius: 8,
        background: d.match ? '#FFF3D6' : '#fff',
        padding: '10px 6px 12px',
        transform: d.match ? 'translateY(9px)' : 'none',
        boxShadow: d.match ? `0 -9px 0 -2px ${HL}` : 'none',
        transition: 'transform .4s'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 800,
        lineHeight: 1.25,
        minHeight: 44
      }
    }, lbl), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 5,
        border: `1.5px solid ${INK}`,
        borderRadius: 3,
        margin: '8px auto 0',
        background: d.match ? RUST : '#ddd'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: d.match ? 'stamp-anim' : '',
      style: {
        fontSize: 11.5,
        fontWeight: 800,
        marginTop: 6,
        color: d.match ? GREEN : 'rgba(43,43,43,.35)',
        minHeight: 32
      }
    }, adds));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--faint)',
      marginTop: 8
    }
  }, L.drawerMore('14,331'))), /*#__PURE__*/React.createElement(ArrowSvg, {
    angle: 42,
    len: 86,
    notes: 3,
    w: 150,
    h: 130
  }))), beat === 2 && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      maxWidth: 680,
      marginTop: 0
    }
  }, L.s5B3), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: L.s5WithoutTitle,
    dist: F.before,
    active: !ffnOn,
    note: !ffnOn ? L.s5MushNote : '',
    testid: "panel-without"
  }), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn rust",
    "data-testid": "ffn-switch",
    style: {
      minWidth: 160
    },
    onClick: () => setFfnOn(o => !o)
  }, ffnOn ? L.s5SwitchOn : L.s5SwitchOff), /*#__PURE__*/React.createElement(Panel, {
    title: L.s5WithTitle,
    dist: after,
    active: ffnOn,
    note: ffnOn ? L.s5SharpNote : '',
    testid: "panel-with"
  }))), progress == null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    disabled: beat === 0,
    onClick: () => setBeatSel(b => b - 1)
  }, L.s5Prev), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn primary",
    disabled: beat === 2,
    onClick: () => setBeatSel(b => b + 1),
    "data-testid": "ffn-next"
  }, L.s5Next)));
}
function Scene6({
  L,
  prompt,
  progress
}) {
  const [layer, setLayer] = useState(1);
  const n = progress == null ? layer : 1 + Math.round(progress * 31);
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s6Title,
    lead: L.s6Lead,
    nerd: L.s6Nerd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(ArrowSvg, {
    angle: 35 + n * 1.2,
    notes: Math.min(n, 14),
    len: 108,
    w: 280,
    h: 200
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 800,
      marginTop: -24
    }
  }, L.s6Block(n), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: GREEN
    }
  }, L.s6Notes(n)))), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '12px 16px',
      width: 170
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hand",
    style: {
      fontSize: 22,
      marginBottom: 4
    }
  }, L.s6Gauge), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10,
      border: `1.5px solid ${INK}`,
      borderRadius: 5,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '72%',
      height: '100%',
      background: GREEN
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--faint)',
      marginTop: 4
    }
  }, L.s6GaugeSub))), progress == null && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 460,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 4
    }
  }, L.s6Scrub), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "32",
    value: layer,
    onChange: e => setLayer(+e.target.value)
  })));
}
function Scene7({
  L,
  prompt
}) {
  const [gen, setGen] = useState([]);
  const [temp, setTemp] = useState(1.0);
  const [topP, setTopP] = useState(0.95);
  const [auto, setAuto] = useState(false);
  const [flash, setFlash] = useState(0);
  const done = gen.length > 0 && gen[gen.length - 1] === '.';
  const raw = nextCandidates(prompt, gen);
  const reweighted = useMemo(() => {
    const c = applyTemperature(raw, temp).sort((a, b) => b.q - a.q);
    const kept = topPSet(c, topP).map(x => x.t);
    return c.map(x => ({
      ...x,
      kept: kept.includes(x.t)
    }));
  }, [raw, temp, topP]);
  const step = greedy => {
    if (done) return;
    const pool = reweighted.filter(c => c.kept);
    let pick;
    if (greedy) pick = pool[0];else {
      const s = pool.reduce((a, c) => a + c.q, 0);
      let r = Math.random() * s;
      pick = pool[0];
      for (const c of pool) {
        r -= c.q;
        if (r <= 0) {
          pick = c;
          break;
        }
      }
    }
    setGen(g => [...g, pick.t]);
    setFlash(f => f + 1);
  };
  useEffect(() => {
    if (!auto || done) {
      if (done) setAuto(false);
      return;
    }
    const t = setTimeout(() => step(false), 950);
    return () => clearTimeout(t);
  }, [auto, gen, done]);
  useEffect(() => {
    setGen([]);
    setAuto(false);
  }, [prompt.id]);
  const maxQ = Math.max(...reweighted.map(c => c.q), 0.01);
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s7Title,
    lead: L.s7Lead,
    nerd: L.s7Nerd
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: RUST,
      fontWeight: 600,
      marginBottom: 10
    }
  }, "\u26A0 ", L.s7Honest), /*#__PURE__*/React.createElement(SentenceRow, {
    prompt: prompt,
    heroOn: false,
    gen: gen
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '14px 18px',
      flex: '1 1 340px',
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 8
    }
  }, L.s7Dist), done ? /*#__PURE__*/React.createElement("div", {
    className: "pop-anim hand",
    style: {
      fontSize: 26,
      color: GREEN
    }
  }, "\u25A0 ", L.s7Done(gen.length)) : reweighted.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '4px 0',
      opacity: c.kept ? 1 : .3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 96,
      fontWeight: 700,
      fontFamily: 'monospace'
    }
  }, c.t === '.' ? '⟨.⟩' : c.t), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 17,
      border: `1.5px solid ${INK}`,
      borderRadius: 6,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "barfill",
    style: {
      width: c.q / maxQ * 100 + '%',
      height: '100%',
      background: c.kept ? i === 0 ? RUST : BLUE : '#bbb'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      fontSize: 13,
      fontWeight: 800,
      textAlign: 'right'
    }
  }, (c.q * 100).toFixed(1), "%"), !c.kept && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: 'var(--faint)'
    }
  }, L.s7Cut))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "wb-btn rust",
    onClick: () => step(false),
    disabled: done
  }, L.s7Sample), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    onClick: () => step(true),
    disabled: done
  }, L.s7Greedy), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn primary",
    onClick: () => setAuto(a => !a),
    disabled: done
  }, auto ? L.s7Stop : L.s7Auto), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    onClick: () => {
      setGen([]);
      setAuto(false);
    }
  }, L.s7Reset))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 240px',
      maxWidth: 330
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '12px 16px',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 800
    }
  }, L.s7Temp, ": ", temp.toFixed(1)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.1",
    max: "2",
    step: "0.1",
    value: temp,
    onChange: e => setTemp(+e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11.5,
      color: 'var(--faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, L.s7TempLo), /*#__PURE__*/React.createElement("span", null, L.s7TempHi)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      marginTop: 10
    }
  }, L.s7TopP, ": ", topP.toFixed(2)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.5",
    max: "1",
    step: "0.05",
    value: topP,
    onChange: e => setTopP(+e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hand",
    style: {
      fontSize: 24,
      color: RUST,
      marginBottom: 6
    }
  }, L.s7Loops(gen.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    key: flash
  }, L.s7Pipe.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s
  }, /*#__PURE__*/React.createElement("span", {
    className: flash > 0 ? 'flash' : '',
    style: {
      border: `1.5px solid ${INK}`,
      borderRadius: 6,
      padding: '2px 7px',
      fontSize: 11.5,
      fontWeight: 700,
      animationDelay: i * 0.12 + 's'
    }
  }, s), i < L.s7Pipe.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "\u2192"))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      marginLeft: 2
    }
  }, "\u21BA"))))));
}
const DECODER_ROWS = [{
  term: 'vocab_size = 128,256',
  scene: 1,
  en: ['tokenizer (front door)', 'how many word-pieces the catalogue holds'],
  zh: ['分词器（大门）', '目录里词片的总数']
}, {
  term: 'hidden_size = 4,096',
  scene: 2,
  en: ['the arrow / belt width', 'numbers in every token’s vector'],
  zh: ['箭头 / 传送带宽度', '每个 token 向量的数字个数']
}, {
  term: 'num_hidden_layers = 32',
  scene: 6,
  en: ['conveyor blocks', 'meeting-room + workshop repeats'],
  zh: ['传送带厂块', '会议室+车间的重复次数']
}, {
  term: 'num_attention_heads = 32',
  scene: 4,
  en: ['meeting rooms per block', 'parallel attention passes'],
  zh: ['每块的会议室数', '并行注意力通道']
}, {
  term: 'num_key_value_heads = 8',
  scene: 4,
  en: ['shared filing cabinets (GQA)', '4 askers share 1 KV cabinet'],
  zh: ['共享文件柜（GQA）', '4 个提问者共用 1 柜']
}, {
  term: 'intermediate_size = 14,336',
  scene: 5,
  en: ['memory drawers per floor (FFN)', 'drawer-label + contents pairs per block'],
  zh: ['每层的记忆抽屉数（FFN）', '每块的抽屉标签+内容对数']
}, {
  term: 'hidden_act = silu (SwiGLU)',
  scene: 5,
  en: ['the drawer dimmer', 'decides how wide each drawer opens'],
  zh: ['抽屉调光器', '决定每个抽屉开多大']
}, {
  term: 'rope_theta = 500,000',
  scene: 3,
  en: ['order-stamp tuning (RoPE)', 'rotation frequency spread'],
  zh: ['顺序印章调参（RoPE）', '旋转频率分布']
}, {
  term: 'rms_norm_eps = 1e-5',
  scene: 6,
  en: ['length gauge (RMSNorm)', 'keeps arrow length stable'],
  zh: ['长度校准仪（RMSNorm）', '保持箭头长度稳定']
}, {
  term: 'temperature / top_p',
  scene: 7,
  en: ['the dice at the exit', 'how daring the draw is & tail cutoff'],
  zh: ['出口处的骰子', '抽签胆量与长尾截断']
}];
function Scene8({
  L,
  lang,
  goto
}) {
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s8Title,
    lead: L.s8Lead
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card table-scroll",
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: 'collapse',
      width: '100%',
      fontSize: 14,
      minWidth: 560
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#F1EDE3'
    }
  }, L.s8Cols.map(c => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      textAlign: 'left',
      padding: '9px 14px',
      borderBottom: `2px solid ${INK}`
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, DECODER_ROWS.map(r => {
    const txt = lang === 'zh' ? r.zh : r.en;
    return /*#__PURE__*/React.createElement("tr", {
      key: r.term,
      onClick: () => goto && goto(r.scene),
      style: {
        cursor: goto ? 'pointer' : 'default'
      },
      onMouseEnter: e => e.currentTarget.style.background = '#FFFBEA',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px',
        fontFamily: 'monospace',
        fontWeight: 700,
        borderBottom: '1px solid rgba(43,43,43,.15)'
      }
    }, r.term), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px',
        fontWeight: 700,
        color: RUST,
        borderBottom: '1px solid rgba(43,43,43,.15)'
      }
    }, txt[0]), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 14px',
        borderBottom: '1px solid rgba(43,43,43,.15)'
      }
    }, txt[1]));
  })))), /*#__PURE__*/React.createElement("p", {
    className: "hand",
    style: {
      fontSize: 28,
      color: GREEN,
      marginTop: 18
    }
  }, L.s8Close));
}
const SCENES = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];