/*
  Journey of a Token — interactive explainer. SHARED block (single source).
  Edit THIS file (plus stepper.jsx), then run ./build.sh —
  the compiled dist/*.js is what the HTML page loads. Commit dist/ output.

  ASSUMPTIONS:
  - Probabilities & attention scores are HAND-CRAFTED for teaching (banner shown in loop scene).
  - Token IDs are illustrative, not from a real tokenizer.
  - Real-model numbers (4096 / 14336 / 32 layers / 128256 vocab) from Llama 3 8B config, as of 2026-06-10.
  - Copy rule: metaphor first, official terms live in the per-station “📄 in the papers” tag
    and in the Station-8 decoder. Body text must read clean for a non-technical adult.
  - One example sentence per language: the zh tour rides a Chinese sentence end-to-end,
    so PROMPTS is keyed by lang and the meaning map / chop demo fork on lang too.
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
    nerdOn: '📄 terms: on',
    nerdOff: '📄 terms: off',
    stops: ['Gate', 'Pieces', 'Meaning', 'Order', 'Meeting', 'Workshop', 'Conveyor', 'THE LOOP', 'Decoder'],
    quest: label => `🎯 Mission: guess what comes after “${label} ___”`,
    journeySteps: ['chop', 'find meaning', 'check order', 'consult', 'recall', '32 laps', 'score & draw'],
    s0Title: 'What actually happens when ChatGPT replies?',
    s0Lead: 'The whole secret fits in one sentence: it guesses the next word. Guess one, glue it on, guess again — until the reply is done. On this ride you follow one sentence into the factory and watch a guess happen, as one of the words yourself:',
    s0Preview: 'Seven stations ahead — each one teaches the factory one more thing:',
    s0Hero: w => `You are “${w}”. For the rest of this tour, that yellow highlight is you.`,
    s0Note: 'Everything you will see is the real machinery — the same factory inside ChatGPT, Claude, or Llama. The numbers come from a real open model (Llama 3 8B).',
    s1Title: 'Station 1 · The front door — the chopping machine',
    s1Nerd: 'in the papers: “tokenizer”',
    s1Why: 'To fill the blank, the factory first has to turn writing into catalogue numbers — the only thing it can read. Without this step, the sentence cannot even enter.',
    s1Take: n => `✓ The factory now holds ${n} numbered tickets. But tickets are just numbers — next station trades them for meaning.`,
    s1Lead: 'The factory cannot read letters. A chopping machine splits your sentence into pieces and hands each piece a number — its place in a fixed catalogue of 128,256 pieces.',
    s1Chop: '✂ Chop!',
    s1Undo: '↺ Put it back',
    s1Tickets: 'every piece collects a numbered catalogue ticket',
    s1Sub: 'Rare words get chopped into smaller pieces:',
    s1SubEx: [{
      t: 'token',
      id: '#5963'
    }, {
      t: 'ization',
      id: '#2065'
    }],
    s1Aside: 'This is why these AIs once miscounted the R’s in “strawberry” — the factory sees catalogue numbers, never letters.',
    s2Title: 'Station 2 · The meaning desk',
    s2Nerd: 'in the papers: “embedding”',
    s2Why: 'To fill the blank, the factory needs to know what each number means. Without it, it would never know a cat is more like a dog than like Paris.',
    s2Lead: w => `Your number is traded for an arrow that points at your meaning. Words that mean similar things live in the same neighbourhood of the map. You, “${w}”, get the spot the factory learned from billions of sentences.`,
    s2Hover: 'Hover the dots — neighbours share meaning.',
    s2Map: 'the meaning map',
    s2Groups: ['royalty', 'places', 'pets', 'story words'],
    s2Real: 'Drawn flat here. In the real factory your arrow is a list of 4,096 numbers.',
    s3Title: 'Station 3 · The order stamp',
    s3Nerd: 'in the papers: “positional encoding (RoPE)”',
    s3Why: 'To fill the blank, the factory must know who comes before whom. Without it, “dog bites man” and “man bites dog” are the same bag of pieces.',
    s3Take: '✓ Same word, different stamp — from now on the factory can tell “cat sits on mat” from “mat sits on cat”.',
    s3Lead: 'Same word, different seat in the sentence → a different stamp. The stamp twists your arrow by an angle that depends on your seat number, so the factory can later feel which word came first and how far apart two words sit.',
    s3SeatRow: 'watch the same word change seats:',
    s3Drag: 'Drag your seat position:',
    s3Pos: p => `seat ${p}`,
    s3Ghost: 'arrow before the twist',
    s4Title: 'Station 4 · The meeting room',
    s4Nerd: 'in the papers: “attention” — Query · Key · Value',
    s4Why: 'To fill the blank, “the” has to find out who is doing what before it. Without this station, every word is an island.',
    s4TakeMore: 'These percentages are the recipe for the cup in part 2 — and ultimately decide whose voice counts when the exit scores the candidates.',
    s4Lead: (last, hero) => `The only place where words talk to each other. The last word “${last}” must guess what comes next — so it holds up a question card, and every earlier word holds up a name-tag. Click each earlier word to compare its name-tag with the question.`,
    s4YouGeneric: (hero, last) => `You, “${hero}”, match the question best — your note of information is handed to “${last}”.`,
    s4YouAsk: (winner, last) => `This time you, “${last}”, are the one asking. “${winner}” matches your question best — its note of information flows into you.`,
    s4OtherWins: (winner, last) => `“${winner}” matches the question best — its note of information is handed to “${last}”.`,
    s4Mask: 'words after the reader are covered up — no peeking at the future',
    s4B1Head: '1 · Who talks to whom',
    s4B2Head: '2 · What the reader receives',
    s4MixLead: 'Every earlier word pours its note into the reader — more attention, bigger pour. The reader’s new meaning is the blend in the cup:',
    s4Mix: last => `“${last}”’s new understanding =`,
    s4KV: 'Memory-saver: the factory files every name-tag and note in a cabinet, so it never has to re-read the whole sentence from scratch. Modern factories even let 4 question-askers share 1 cabinet. (Papers call this the KV cache and GQA — Llama 3 8B: 32 askers, 8 cabinets.)',
    s4ClickPrompt: '… click the words above',
    s5Title: 'Station 5 · The private workshop — the factory’s memory',
    s5Nerd: 'in the papers: “feed-forward network (FFN)”',
    s5Why: 'To fill the blank, clues are not enough — the factory needs common sense: cats usually sit on mats. All of it lives in this station.',
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
    s6Why: 'To fill the blank smartly, the last two stations repeat 32 times, each lap deepening the understanding. Without the repeats, every guess stays shallow.',
    s6Take: '✓ 32 laps done — your arrow has soaked up the whole sentence and is ready for scoring at the exit.',
    s6Lead: 'You repeat meeting-room → workshop 32 times. The golden rule: every station only ADDS a small correction onto your arrow — nothing is ever erased. Between stations, a gauge re-standardises your arrow’s length so the additions never blow up.',
    s6Scrub: 'Scrub through the 32 blocks:',
    s6Block: n => `block ${n} / 32`,
    s6Notes: n => `${n} margin notes accumulated`,
    s6StopA: 'meeting',
    s6StopB: 'workshop',
    s6Gauge: 'length gauge',
    s6GaugeSub: 'length → standard ✓',
    s7Title: 'Final station · THE LOOP',
    s7Nerd: 'in the papers: “next-token prediction” · “logits” · “sampling”',
    s7Why: 'Here the blank actually gets filled: score every candidate, draw one, glue it on, and run the whole factory again. That is the entire secret of how AI “writes”.',
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
    s7Wheel: 'the draw wheel — bigger slice, bigger chance',
    s7Cut: 'dropped by top-p',
    s7Pipe: ['chop', 'look up meaning', '32 blocks', 'score', 'draw'],
    s8Title: 'The exit · take the whole machine with you',
    s8Lead: 'You rode the whole factory. Here is the entire machine in one breath:',
    s8Recap: 'AI writes by guessing the next word, again and again. Before every guess:',
    s8DecoderIntro: 'For paper-readers: the official names. Every line of a real model card names a part you just visited. (Numbers: Llama 3 8B.) Click a row to revisit its station.',
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
    nerdOn: '📄 术语：开',
    nerdOff: '📄 术语：关',
    stops: ['大门', '切片', '语义', '顺序', '会议室', '车间', '传送带', '循环', '解码器'],
    quest: label => `🎯 任务：猜出「${label} ___」的下一个词`,
    journeySteps: ['切片', '找含义', '看顺序', '互相参考', '调取记忆', '反复32圈', '打分抽签'],
    s0Title: 'ChatGPT 回你话的时候，到底发生了什么？',
    s0Lead: '整个秘密只有一句话：它在猜下一个词。猜一个，拼上去，再猜下一个——直到说完。这趟旅程，我们跟着一句话走进工厂，亲眼看一次「猜」是怎么发生的。你将化身句中的一个词：',
    s0Preview: '前方 7 站，每站帮工厂多知道一件事：',
    s0Hero: w => `你是「${w}」。接下来整趟旅程，黄色高亮就是你。`,
    s0Note: '你将看到的都是真实的机器——ChatGPT、Claude、Llama 内部同样的工厂。数字来自真实开源模型 Llama 3 8B。',
    s1Title: '第一站 · 工厂大门——切片机',
    s1Nerd: '论文里叫：分词器 tokenizer',
    s1Why: '为了填上这个空，工厂先得把句子换成自己读得懂的目录编号。没有这一步，句子根本进不了厂。',
    s1Take: n => `✓ 工厂拿到了 ${n} 张号码票。但票只是号码——下一站去换含义。`,
    s1Lead: '工厂读不懂字母。一台切片机把句子切成词片，每片领到一个编号——它在一本固定目录（共 128,256 片）里的位置。',
    s1Chop: '✂ 切！',
    s1Undo: '↺ 拼回去',
    s1Tickets: '每片领到一张目录号码票',
    s1Sub: '生僻词会被切成更小的片：',
    s1SubEx: [{
      t: '螺',
      id: '#79301'
    }, {
      t: '蛳',
      id: '#127844'
    }, {
      t: '粉',
      id: '#41937'
    }],
    s1Aside: '这就是这类 AI 曾数错 strawberry 里有几个 R 的原因——工厂只看目录编号，从不看字母。',
    s2Title: '第二站 · 语义服务台',
    s2Nerd: '论文里叫：词嵌入 embedding',
    s2Why: '为了填上这个空，工厂得知道每个编号是什么意思。没有它，永远不知道「小猫」更像「小狗」、而不像「巴黎」。',
    s2Lead: w => `你的编号被换成「语义地图」上的一个位置。意思相近的词，住在地图上同一个街区。你「${w}」的位置，是工厂从几十亿个句子里学来的。`,
    s2Hover: '悬停圆点——相邻的词意思相近。',
    s2Map: '语义地图',
    s2Groups: ['王室', '地名', '宠物', '故事词'],
    s2Real: '这里画成了平面。真实工厂里，你的位置是一串 4,096 个数字。',
    s3Title: '第三站 · 顺序印章',
    s3Nerd: '论文里叫：位置编码 RoPE',
    s3Why: '为了填上这个空，工厂得分清谁先谁后。没有它，「狗咬人」和「人咬狗」只是同一堆词片。',
    s3Take: '✓ 同一个词，章不一样——工厂从此分得清「猫坐在垫上」和「垫坐在猫上」。',
    s3Lead: '同一个词，坐在句子的不同位置 → 盖不同的章。印章按你的座位号把箭头转一个角度，让工厂之后能感觉到谁先谁后、隔了多远。',
    s3SeatRow: '看同一个词换座位：',
    s3Drag: '拖动你的座位位置：',
    s3Pos: p => `座位 ${p}`,
    s3Ghost: '旋转前的箭头',
    s4Title: '第四站 · 会议室',
    s4Nerd: '论文里叫：注意力 attention——Query · Key · Value',
    s4Why: '为了填上这个空，「在」得打听清楚前面是谁在做什么。没有这一站，每个词都是孤岛。',
    s4TakeMore: '这些百分比就是下一幕杯子里的配方——最终决定出口打分时谁说了算。',
    s4Lead: (last, hero) => `词与词唯一能交流的地方。最后一个词「${last}」要猜接下来是什么——于是它举起一张提问卡，每个更早的词举起自己的名牌。点击每个早先的词，看它的名牌和提问卡有多匹配。`,
    s4YouGeneric: (hero, last) => `你「${hero}」和提问最匹配——你的信息便条被递给了「${last}」。`,
    s4YouAsk: (winner, last) => `这一次提问的是你「${last}」。「${winner}」和你的提问最匹配——它的信息便条流进了你这里。`,
    s4OtherWins: (winner, last) => `「${winner}」和提问最匹配——它的信息便条被递给了「${last}」。`,
    s4Mask: '读者之后的词被盖住——禁止偷看未来',
    s4B1Head: '1 · 谁在和谁说话',
    s4B2Head: '2 · 读者收到了什么',
    s4MixLead: '每个更早的词把自己的便条倒进读者的杯子——注意力越多，倒得越多。读者的新含义，就是杯中的混合：',
    s4Mix: last => `「${last}」的新含义 =`,
    s4KV: '省力机制：工厂把每张名牌和便条都存进文件柜，不必每次从头重读整句话。现代工厂还让 4 个提问者共用 1 个柜子。（论文里叫 KV 缓存和 GQA——Llama 3 8B：32 个提问者、8 个柜子。）',
    s4ClickPrompt: '…点击上方的词',
    s5Title: '第五站 · 私人车间——工厂的记忆',
    s5Nerd: '论文里叫：前馈网络 FFN',
    s5Why: '为了填上这个空，光有线索不够，还得有常识——猫通常坐在垫子上。常识全存在这一站。',
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
    s6Why: '为了把空填得聪明，前两站要反复 32 圈，理解一层层加深。没有这些重复，猜测永远停在表面。',
    s6Take: '✓ 32 圈走完，箭头吸饱了整句话的理解——可以去出口打分了。',
    s6Lead: '「会议室 → 车间」你要重复 32 次。黄金法则：每一站只往你的箭头上「加」一笔小修正——什么都不会被擦掉。站与站之间有一个校准仪，把箭头长度调回标准，防止越加越大。',
    s6Scrub: '拖动浏览 32 个厂块：',
    s6Block: n => `第 ${n} / 32 块`,
    s6Notes: n => `已累积 ${n} 条页边批注`,
    s6StopA: '会议室',
    s6StopB: '车间',
    s6Gauge: '长度校准仪',
    s6GaugeSub: '长度 → 标准 ✓',
    s7Title: '终点站 · 循环',
    s7Nerd: '论文里叫：下一词预测 · logits · 抽样 sampling',
    s7Why: '空在这里被真正填上：给每个候选词打分、抽签，拼回句尾，整厂重跑。这就是 AI「写字」的全部秘密。',
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
    s7Wheel: '抽签转盘——扇区越大，机会越大',
    s7Cut: '被 top-p 舍弃',
    s7Pipe: ['切片', '查语义', '32 厂块', '打分', '抽签'],
    s8Title: '出口 · 把整台机器带走',
    s8Lead: '整趟工厂你都走完了。一口气说完整台机器：',
    s8Recap: 'AI 写一句话＝一次次猜下一个词。每次猜之前：',
    s8DecoderIntro: '给读论文的人：官方名字对照表。真实模型卡的每一行配置，都对应你刚经过的一个工厂部件（数字：Llama 3 8B）。点击行可回到对应站点。',
    s8Close: '整台机器就是：一个循环，每个词片跑一次。现在去打开任何模型卡——每个部件你都认识。',
    s8Cols: ['配置项', '工厂部件', '含义'],
    footer: '立瑄手作 · 更多见 kruxqlyz.com'
  }
};

// ---------- toy LM data ----------
// One example sentence per language — the tour rides the same sentence end-to-end.
const PROMPTS = {
  en: {
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
  },
  zh: {
    id: 'cat-zh',
    label: '小猫安静地坐在',
    tokens: ['小猫', '安静', '地', '坐', '在'],
    ids: [57221, 103654, 9554, 55308, 18655],
    hero: 0,
    reader: 4,
    att: [{
      i: 0,
      s: 3.6
    }, {
      i: 1,
      s: 1.2
    }, {
      i: 2,
      s: 0.7
    }, {
      i: 3,
      s: 2.4
    }],
    ffn: {
      clues: {
        en: ['“sat on ___” → a place is coming', 'subject nearby: 小猫 (kitten)', 'scene: something being sat on'],
        zh: ['「坐在 ___」→ 后面要来一个地点', '附近的主语：小猫', '场景：有东西被坐着']
      },
      drawers: [{
        l: 'cats sit on things',
        a: '+ mat, sofa, windowsill',
        lz: '猫爱坐在东西上',
        az: '+ 垫子、沙发、窗台',
        match: true
      }, {
        l: '“在” wants a place',
        a: '+ expect a place-word',
        lz: '「在」后面接地点',
        az: '+ 预期一个地点词',
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
        t: '垫子',
        p: .12
      }, {
        t: '蓝色',
        p: .11
      }, {
        t: '沙发',
        p: .11
      }, {
        t: '跑步',
        p: .10
      }, {
        t: '巴黎',
        p: .09
      }]
    },
    start: [{
      t: '垫子',
      p: .58
    }, {
      t: '沙发',
      p: .15
    }, {
      t: '地板',
      p: .10
    }, {
      t: '键盘',
      p: .08
    }, {
      t: '窗台',
      p: .05
    }, {
      t: '月亮',
      p: .04
    }],
    bigram: {
      '垫子': [{
        t: '上',
        p: 1
      }],
      '沙发': [{
        t: '上',
        p: 1
      }],
      '地板': [{
        t: '上',
        p: 1
      }],
      '键盘': [{
        t: '上',
        p: 1
      }],
      '窗台': [{
        t: '上',
        p: 1
      }],
      '月亮': [{
        t: '上',
        p: 1
      }],
      '上': [{
        t: '，',
        p: .55
      }, {
        t: '。',
        p: .45
      }],
      '，': [{
        t: '打着',
        p: .4
      }, {
        t: '望着',
        p: .35
      }, {
        t: '等着',
        p: .25
      }],
      '打着': [{
        t: '呼噜',
        p: 1
      }],
      '呼噜': [{
        t: '。',
        p: 1
      }],
      '望着': [{
        t: '窗外',
        p: .6
      }, {
        t: '小鸟',
        p: .4
      }],
      '窗外': [{
        t: '。',
        p: 1
      }],
      '小鸟': [{
        t: '。',
        p: 1
      }],
      '等着': [{
        t: '晚饭',
        p: .6
      }, {
        t: '主人',
        p: .4
      }],
      '晚饭': [{
        t: '。',
        p: 1
      }],
      '主人': [{
        t: '。',
        p: 1
      }]
    }
  }
};

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
  asideNerd,
  nerd,
  why
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
  }, "\uD83D\uDCC4 ", nerd), why && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '10px 0 12px',
      padding: '9px 14px',
      borderLeft: `4px solid ${GREEN}`,
      background: '#F0F6F1',
      borderRadius: '0 10px 10px 0',
      fontSize: 14.5,
      lineHeight: 1.5,
      maxWidth: 760
    }
  }, "\u2699\uFE0F ", why), /*#__PURE__*/React.createElement("p", {
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
  }, "\u270F\uFE0F ", aside), asideNerd && /*#__PURE__*/React.createElement("div", {
    className: "nerd-aside",
    style: {
      marginTop: 18,
      padding: '12px 16px',
      border: `2px dashed ${RUST}`,
      borderRadius: 12,
      background: '#FFF7F2',
      fontSize: 14.5,
      lineHeight: 1.5
    }
  }, "\u270F\uFE0F ", asideNerd));
}
// Step chips — the always-visible main thread. idx = current scene (0..8):
// chip k maps to station k+1; everything is ✓ at the decoder (idx 8).
function StepChips({
  steps,
  idx
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, steps.map((s, k) => {
    const done = idx === 8 || k + 1 < idx,
      now = idx < 8 && k + 1 === idx;
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        fontSize: 11.5,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        border: `1.5px solid ${now ? RUST : done ? GREEN : 'rgba(43,43,43,.3)'}`,
        color: now ? '#fff' : done ? GREEN : 'var(--faint)',
        background: now ? RUST : 'transparent',
        borderRadius: 12,
        padding: '2px 9px'
      }
    }, done ? '✓ ' : now ? '● ' : '', s);
  }));
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
  lang,
  prompt
}) {
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s0Title,
    lead: L.s0Lead,
    aside: L.s0Note
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '16px 20px',
      width: 'fit-content',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hand",
    style: {
      fontSize: 26
    }
  }, lang === 'zh' ? '「' + prompt.label + ' ……」' : '“' + prompt.label + ' …”')), /*#__PURE__*/React.createElement("div", {
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
  }, L.s0Hero(prompt.tokens[prompt.hero]))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 6
    }
  }, L.s0Preview), /*#__PURE__*/React.createElement(StepChips, {
    steps: L.journeySteps,
    idx: 0
  })));
}

// The chopping machine: one continuous sentence ribbon → blade sweeps →
// pieces drift apart → each collects a numbered catalogue ticket.
function Scene1({
  L,
  prompt
}) {
  const [chopSel, setChopSel] = useState(false);
  useEffect(() => {
    setChopSel(false);
  }, [prompt.id]);
  // t: 0 = intact ribbon, 1 = fully chopped (CSS transitions animate the sweep)
  const t = chopSel ? 1 : 0;
  const ticketsOn = t > 0.8;
  const widths = prompt.tokens.map(tk => tokBoxW(tk));
  const xs = [];
  let x = 12;
  widths.forEach(w => {
    xs.push(x);
    x += w;
  });
  const GAP = 20,
    ribbonW = x - 12;
  const W = x + 12 + (prompt.tokens.length - 1) * GAP,
    TOPY = 34;
  const trans = {
    transition: 'all .7s cubic-bezier(.2,.8,.2,1)'
  };
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s1Title,
    lead: L.s1Lead,
    aside: L.s1Aside,
    nerd: L.s1Nerd,
    why: L.s1Why
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '10px 16px',
      width: 'fit-content',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} 128`,
    style: {
      width: '100%',
      maxWidth: W,
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: 12,
    y: TOPY,
    width: ribbonW,
    height: 40,
    rx: 10,
    fill: "none",
    stroke: INK,
    strokeWidth: "2.5",
    opacity: 1 - t,
    style: trans
  }), /*#__PURE__*/React.createElement("text", {
    x: 12 + t * ribbonW,
    y: TOPY - 10,
    textAnchor: "middle",
    fontSize: "20",
    opacity: t <= 0 ? 0 : t >= 1 ? 0 : 1,
    style: trans
  }, "\u2702\uFE0F"), prompt.tokens.map((tk, i) => {
    const isHero = i === prompt.hero;
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      transform: `translate(${i * GAP * t},0)`,
      style: trans
    }, /*#__PURE__*/React.createElement("rect", {
      x: xs[i],
      y: TOPY,
      width: widths[i],
      height: 40,
      rx: 10,
      fill: isHero ? HL : '#fff',
      fillOpacity: isHero ? 1 : t,
      stroke: INK,
      strokeWidth: "2",
      strokeOpacity: t,
      style: trans
    }), i > 0 && /*#__PURE__*/React.createElement("line", {
      x1: xs[i],
      y1: TOPY + 3,
      x2: xs[i],
      y2: TOPY + 37,
      stroke: RUST,
      strokeWidth: "2",
      strokeDasharray: "4 4",
      opacity: t < 0.5 ? t * 1.6 : Math.max(0, (1 - t) * 1.6),
      style: trans
    }), /*#__PURE__*/React.createElement("text", {
      x: xs[i] + widths[i] / 2,
      y: TOPY + 26,
      textAnchor: "middle",
      fontSize: "16",
      fontWeight: "700",
      fontFamily: "Nunito,sans-serif"
    }, tk), /*#__PURE__*/React.createElement("g", {
      className: ticketsOn ? 'stamp-anim' : '',
      opacity: ticketsOn ? 1 : 0,
      style: {
        animationDelay: i * 0.1 + 's'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: xs[i] + widths[i] / 2 - 29,
      y: TOPY + 52,
      width: 58,
      height: 24,
      rx: 5,
      fill: "#F0F5FF",
      stroke: BLUE,
      strokeWidth: "1.5",
      strokeDasharray: "4 3"
    }), /*#__PURE__*/React.createElement("text", {
      x: xs[i] + widths[i] / 2,
      y: TOPY + 68,
      textAnchor: "middle",
      fontSize: "12.5",
      fontWeight: "800",
      fill: BLUE,
      fontFamily: "Nunito,sans-serif"
    }, "#", prompt.ids[i])));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--faint)',
      margin: '2px 2px 6px',
      minHeight: 18
    }
  }, ticketsOn ? '🎟 ' + L.s1Tickets : '')), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn rust",
    "data-testid": "chop",
    style: {
      marginTop: 14
    },
    onClick: () => setChopSel(c => !c)
  }, chopSel ? L.s1Undo : L.s1Chop), ticketsOn && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim",
    style: {
      marginTop: 12,
      color: GREEN,
      fontWeight: 800,
      fontSize: 14.5,
      maxWidth: 600
    }
  }, L.s1Take(prompt.tokens.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 15
    }
  }, L.s1Sub, ' ', L.s1SubEx.map((p, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800
    }
  }, "+"), /*#__PURE__*/React.createElement("span", {
    className: "tok"
  }, p.t, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      color: BLUE
    }
  }, p.id))))));
}
const MEANING_DOTS = {
  en: [{
    w: 'king',
    x: 36,
    y: 44,
    c: 0
  }, {
    w: 'queen',
    x: 78,
    y: 36,
    c: 0
  }, {
    w: 'prince',
    x: 50,
    y: 72,
    c: 0
  }, {
    w: 'Paris',
    x: 186,
    y: 40,
    c: 1
  }, {
    w: 'France',
    x: 232,
    y: 62,
    c: 1
  }, {
    w: 'London',
    x: 178,
    y: 68,
    c: 1
  }, {
    w: 'cat',
    x: 88,
    y: 142,
    c: 2
  }, {
    w: 'dog',
    x: 138,
    y: 158,
    c: 2
  }, {
    w: 'kitten',
    x: 78,
    y: 168,
    c: 2
  }, {
    w: 'time',
    x: 212,
    y: 132,
    c: 3
  }, {
    w: 'once',
    x: 252,
    y: 152,
    c: 3
  }, {
    w: 'story',
    x: 202,
    y: 160,
    c: 3
  }],
  zh: [
  // CJK labels are wider — dots sit further from the ellipse edges than in en
  {
    w: '国王',
    x: 36,
    y: 44,
    c: 0
  }, {
    w: '王后',
    x: 70,
    y: 32,
    c: 0
  }, {
    w: '王子',
    x: 50,
    y: 72,
    c: 0
  }, {
    w: '巴黎',
    x: 186,
    y: 40,
    c: 1
  }, {
    w: '法国',
    x: 222,
    y: 62,
    c: 1
  }, {
    w: '伦敦',
    x: 178,
    y: 68,
    c: 1
  }, {
    w: '小猫',
    x: 88,
    y: 142,
    c: 2
  }, {
    w: '小狗',
    x: 130,
    y: 158,
    c: 2
  }, {
    w: '猫咪',
    x: 78,
    y: 168,
    c: 2
  }, {
    w: '时间',
    x: 212,
    y: 132,
    c: 3
  }, {
    w: '从前',
    x: 244,
    y: 152,
    c: 3
  }, {
    w: '故事',
    x: 202,
    y: 160,
    c: 3
  }]
};
const DOT_COLORS = [BLUE, GREEN, RUST, '#8B5CF6'];
function Scene2({
  L,
  lang,
  prompt
}) {
  const [hov, setHov] = useState(null);
  const dots = MEANING_DOTS[lang] || MEANING_DOTS.en;
  const heroWord = prompt.tokens[prompt.hero];
  const heroDot = dots.find(d => d.w.toLowerCase() === heroWord.toLowerCase()) || dots[6];
  const heroColor = DOT_COLORS[heroDot.c];
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s2Title,
    lead: L.s2Lead(heroWord),
    aside: L.s2Real,
    nerd: L.s2Nerd,
    why: L.s2Why
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
      display: 'inline-block',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 330 212",
    style: {
      width: '100%',
      maxWidth: 330,
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("text", {
    x: "322",
    y: "206",
    textAnchor: "end",
    fontSize: "15",
    fontFamily: "Caveat,cursive",
    fill: "rgba(43,43,43,.5)"
  }, "\uD83D\uDDFA ", L.s2Map), [{
    cx: 64,
    cy: 54,
    rx: 52,
    ry: 36
  }, {
    cx: 206,
    cy: 54,
    rx: 56,
    ry: 34
  }, {
    cx: 110,
    cy: 154,
    rx: 56,
    ry: 32
  }, {
    cx: 230,
    cy: 146,
    rx: 54,
    ry: 32
  }].map((e, c) => /*#__PURE__*/React.createElement("g", {
    key: c,
    opacity: hov !== null && dots[hov].c !== c ? 0.25 : 1,
    style: {
      transition: 'opacity .25s'
    }
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: e.cx,
    cy: e.cy,
    rx: e.rx,
    ry: e.ry,
    fill: DOT_COLORS[c],
    fillOpacity: ".07",
    stroke: DOT_COLORS[c],
    strokeWidth: "1.5",
    strokeDasharray: "5 4",
    strokeOpacity: ".5"
  }), /*#__PURE__*/React.createElement("text", {
    x: e.cx,
    y: e.cy - e.ry - 4,
    textAnchor: "middle",
    fontSize: "11.5",
    fontWeight: "800",
    fill: DOT_COLORS[c],
    fontFamily: "Nunito,sans-serif"
  }, L.s2Groups[c]))), dots.map((d, i) => {
    const isHero = d === heroDot,
      dim = hov !== null && dots[hov].c !== d.c && !isHero;
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
    }), isHero && /*#__PURE__*/React.createElement("circle", {
      cx: d.x,
      cy: d.y,
      r: "13",
      fill: "none",
      stroke: heroColor,
      strokeWidth: "2",
      strokeDasharray: "4 3",
      className: "pop-anim"
    }), /*#__PURE__*/React.createElement("text", {
      x: d.x + (isHero ? 17 : 9),
      y: d.y + 4,
      fontSize: "12.5",
      fontWeight: isHero ? 800 : 600,
      fill: isHero ? heroColor : INK,
      opacity: dim ? 0.18 : 1,
      stroke: "#fff",
      strokeWidth: "3",
      paintOrder: "stroke"
    }, d.w));
  }))));
}
function Scene3({
  L,
  prompt
}) {
  const [pos, setPos] = useState(prompt.hero + 1);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    setPos(prompt.hero + 1);
    setTouched(false);
  }, [prompt.id]);
  const p = pos;
  const heroWord = prompt.tokens[prompt.hero];
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s3Title,
    lead: L.s3Lead,
    nerd: L.s3Nerd,
    why: L.s3Why
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--faint)',
      marginBottom: 6
    }
  }, L.s3SeatRow), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 18,
      alignItems: 'flex-start',
      overflowX: 'auto',
      paddingBottom: 4
    }
  }, Array.from({
    length: 8
  }, (_, k) => {
    const seat = k + 1,
      isHere = seat === p;
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        minWidth: 58,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: isHere ? `2px solid ${INK}` : '2px dashed rgba(43,43,43,.22)',
        borderRadius: 9,
        background: isHere ? HL : 'transparent',
        fontWeight: 800,
        fontSize: 14.5,
        transition: 'all .25s'
      }
    }, isHere ? heroWord : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: isHere ? RUST : 'var(--faint)',
        fontWeight: isHere ? 800 : 400,
        marginTop: 3
      }
    }, isHere ? L.s3Pos(seat) : seat));
  })), /*#__PURE__*/React.createElement("div", {
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
  }, L.s3Pos(p), " \xB7 +", p * 18, "\xB0"))), /*#__PURE__*/React.createElement("div", {
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
    onChange: e => {
      setPos(+e.target.value);
      setTouched(true);
    }
  })), touched && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim",
    style: {
      marginTop: 12,
      color: GREEN,
      fontWeight: 800,
      fontSize: 14.5,
      maxWidth: 600
    }
  }, L.s3Take));
}
const MIX_COLORS = [BLUE, GREEN, '#8B5CF6', '#C7791B', '#0E7490', '#BE185D'];
function tokBoxW(t) {
  // CJK glyphs render ~1.7× wider than latin at the same size
  let u = 0;
  for (const ch of t) u += /[　-〿一-鿿＀-￯]/.test(ch) ? 1.7 : 1;
  return u * 10.5 + 26;
}
function dispTok(t) {
  return t === '.' ? '⟨.⟩' : t === '。' ? '⟨。⟩' : t;
}

// Beat 1 of the meeting room: arc diagram — who talks to whom.
function AttnArcs({
  L,
  prompt,
  revealed,
  onReveal
}) {
  const scores = prompt.att;
  const exp = scores.map(a => revealed.includes(a.i) ? Math.exp(a.s) : 0);
  const sum = exp.reduce((a, b) => a + b, 0) || 1;
  const widths = prompt.tokens.map((t, i) => tokBoxW(t) + (i === prompt.reader ? 24 : 0));
  const xs = [];
  let x = 10;
  widths.forEach(w => {
    xs.push(x);
    x += w + 10;
  });
  const W = x + 4,
    TOPY = 150;
  const cx = i => xs[i] + widths[i] / 2;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} 196`,
    style: {
      width: '100%',
      maxWidth: W,
      display: 'block'
    }
  }, scores.map(a => {
    const on = revealed.includes(a.i);
    const w = on ? exp[scores.indexOf(a)] / sum : 0;
    const h = 34 + (prompt.reader - a.i) * 24;
    const midX = (cx(a.i) + cx(prompt.reader)) / 2;
    const isHero = a.i === prompt.hero;
    return /*#__PURE__*/React.createElement("path", {
      key: a.i,
      d: `M ${cx(a.i)} ${TOPY - 6} Q ${midX} ${TOPY - 6 - h * 2} ${cx(prompt.reader)} ${TOPY - 6}`,
      fill: "none",
      stroke: on ? isHero ? RUST : BLUE : 'rgba(43,43,43,.25)',
      strokeWidth: on ? 2 + w * 16 : 1.5,
      strokeDasharray: on ? 'none' : '5 5',
      strokeLinecap: "round",
      opacity: on ? .85 : 1,
      style: {
        transition: 'stroke-width .45s'
      }
    });
  }), scores.map(a => {
    const on = revealed.includes(a.i);
    if (!on) return null;
    const w = exp[scores.indexOf(a)] / sum;
    const h = 34 + (prompt.reader - a.i) * 24;
    const midX = (cx(a.i) + cx(prompt.reader)) / 2;
    const isHero = a.i === prompt.hero;
    return /*#__PURE__*/React.createElement("text", {
      key: a.i,
      x: midX,
      y: TOPY - 10 - h,
      textAnchor: "middle",
      fontSize: "13",
      fontWeight: "800",
      fill: isHero ? RUST : BLUE,
      stroke: "#fff",
      strokeWidth: "5",
      paintOrder: "stroke",
      fontFamily: "Nunito,sans-serif"
    }, (w * 100).toFixed(0), "%");
  }), prompt.tokens.map((t, i) => {
    const w = widths[i],
      clickable = i < prompt.reader,
      isHero = i === prompt.hero;
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      onClick: clickable ? () => onReveal(i) : undefined,
      style: {
        cursor: clickable ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: xs[i],
      y: TOPY,
      width: w,
      height: 36,
      rx: "9",
      fill: isHero ? HL : i === prompt.reader ? '#E8F1FF' : '#fff',
      stroke: INK,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("text", {
      x: xs[i] + w / 2,
      y: TOPY + 24,
      textAnchor: "middle",
      fontSize: "15.5",
      fontWeight: "700",
      fontFamily: "Nunito,sans-serif"
    }, t, i === prompt.reader ? ' ❓' : ''));
  }));
}

// Beat 2: every earlier word pours its note into the reader's cup — weighted blend.
function AttnCup({
  L,
  prompt,
  lang
}) {
  const scores = prompt.att;
  const exp = scores.map(a => Math.exp(a.s));
  const sum = exp.reduce((a, b) => a + b, 0);
  const shares = scores.map((a, k) => ({
    i: a.i,
    w: exp[k] / sum
  }));
  const last = prompt.tokens[prompt.reader];
  const W = 380,
    CUPX = 130,
    CUPW = 120,
    CUPY = 150,
    CUPH = 84;
  const n = shares.length,
    span = W - 40;
  let yAcc = CUPY + CUPH - 3;
  const bands = shares.map((s, k) => {
    const h = Math.max(3, s.w * (CUPH - 8));
    yAcc -= h;
    return {
      y: yAcc,
      h,
      color: MIX_COLORS[k % MIX_COLORS.length],
      ...s
    };
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} 275`,
    style: {
      width: '100%',
      maxWidth: W,
      display: 'block'
    }
  }, shares.map((s, k) => {
    const chipW = tokBoxW(prompt.tokens[s.i]);
    const chipX = 20 + span * (k + 0.5) / n - chipW / 2;
    const sw = 6 + s.w * 30;
    const tipX = CUPX + CUPW * (k + 0.5) / n;
    return /*#__PURE__*/React.createElement("g", {
      key: s.i
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${chipX + chipW / 2 - sw / 2},48 ${chipX + chipW / 2 + sw / 2},48 ${tipX + 3},${CUPY + 4} ${tipX - 3},${CUPY + 4}`,
      fill: MIX_COLORS[k % MIX_COLORS.length],
      opacity: ".5",
      className: "pop-anim",
      style: {
        animationDelay: k * 0.18 + 's'
      }
    }), /*#__PURE__*/React.createElement("rect", {
      x: chipX,
      y: 14,
      width: chipW,
      height: 34,
      rx: "9",
      fill: MIX_COLORS[k % MIX_COLORS.length],
      stroke: INK,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("text", {
      x: chipX + chipW / 2,
      y: 36,
      textAnchor: "middle",
      fontSize: "15",
      fontWeight: "800",
      fill: "#fff",
      fontFamily: "Nunito,sans-serif"
    }, prompt.tokens[s.i]), /*#__PURE__*/React.createElement("text", {
      x: chipX + chipW / 2,
      y: 62,
      textAnchor: "middle",
      fontSize: "12.5",
      fontWeight: "800",
      fill: INK
    }, (s.w * 100).toFixed(0), "%"));
  }), bands.map((b, k) => /*#__PURE__*/React.createElement("rect", {
    key: k,
    x: CUPX + 3,
    y: b.y,
    width: CUPW - 6,
    height: b.h,
    fill: b.color,
    opacity: ".75",
    className: "grow-anim",
    style: {
      animationDelay: 0.3 + k * 0.18 + 's'
    }
  })), /*#__PURE__*/React.createElement("path", {
    d: `M ${CUPX} ${CUPY} L ${CUPX} ${CUPY + CUPH - 10} Q ${CUPX} ${CUPY + CUPH} ${CUPX + 10} ${CUPY + CUPH}
                  L ${CUPX + CUPW - 10} ${CUPY + CUPH} Q ${CUPX + CUPW} ${CUPY + CUPH} ${CUPX + CUPW} ${CUPY + CUPH - 10}
                  L ${CUPX + CUPW} ${CUPY}`,
    fill: "none",
    stroke: INK,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("text", {
    x: CUPX + CUPW / 2,
    y: CUPY + CUPH + 28,
    textAnchor: "middle",
    fontSize: "20",
    fontWeight: "700",
    fontFamily: "Caveat,cursive"
  }, "\u2615 ", last)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      marginTop: 8
    }
  }, L.s4Mix(last), ' ', shares.map((s, k) => /*#__PURE__*/React.createElement("span", {
    key: s.i
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: MIX_COLORS[k % MIX_COLORS.length]
    }
  }, (s.w * 100).toFixed(0), "% ", prompt.tokens[s.i]), k < shares.length - 1 ? ' + ' : ''))));
}
function Scene4({
  L,
  prompt,
  lang
}) {
  const [revealed, setRevealed] = useState([]);
  const [beat, setBeatSel] = useState(0);
  useEffect(() => {
    setRevealed([]);
    setBeatSel(0);
  }, [prompt.id]);
  // ←/→ move between beats first, then fall through to scene navigation
  const beatRef = useRef(beat);
  beatRef.current = beat;
  useEffect(() => {
    window.__sceneKeyHandler = key => {
      if (key === 'ArrowRight' && beatRef.current < 1) {
        setBeatSel(1);
        return true;
      }
      if (key === 'ArrowLeft' && beatRef.current > 0) {
        setBeatSel(0);
        return true;
      }
      return false;
    };
    return () => {
      window.__sceneKeyHandler = null;
    };
  }, []);
  const last = prompt.tokens[prompt.reader];
  const hero = prompt.tokens[prompt.hero];
  const scores = prompt.att;
  const allIn = revealed.length === scores.length;
  const heads = [L.s4B1Head, L.s4B2Head];
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s4Title,
    lead: L.s4Lead(last, hero),
    asideNerd: beat === 1 ? L.s4KV : null,
    nerd: L.s4Nerd,
    why: L.s4Why
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginBottom: 12,
      flexWrap: 'wrap'
    }
  }, heads.map((h, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setBeatSel(i),
    style: {
      cursor: 'pointer',
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
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--faint)',
      marginBottom: 8
    }
  }, "\uD83D\uDEAB ", L.s4Mask), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '12px 14px 6px',
      width: 'fit-content',
      maxWidth: '100%',
      minWidth: 300
    }
  }, /*#__PURE__*/React.createElement(AttnArcs, {
    L: L,
    prompt: prompt,
    revealed: revealed,
    onReveal: i => setRevealed(r => r.includes(i) ? r : [...r, i])
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '6px 4px 10px',
      fontSize: 14.5,
      minHeight: 40,
      maxWidth: 540
    }
  }, allIn ? /*#__PURE__*/React.createElement("span", {
    className: "pop-anim"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: GREEN,
      fontWeight: 800
    }
  }, "\u2713 ", (() => {
    const winner = prompt.tokens[scores.reduce((a, b) => b.s > a.s ? b : a).i];
    if (prompt.hero === prompt.reader) return L.s4YouAsk(winner, last);
    return winner === hero ? L.s4YouGeneric(hero, last) : L.s4OtherWins(winner, last);
  })()), ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, L.s4TakeMore)) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--faint)'
    }
  }, L.s4ClickPrompt)))), beat === 1 && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      maxWidth: 680,
      marginTop: 0
    }
  }, L.s4MixLead), /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '14px 18px',
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(AttnCup, {
    L: L,
    prompt: prompt,
    lang: lang
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    disabled: beat === 0,
    onClick: () => setBeatSel(0)
  }, L.s5Prev), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn primary",
    disabled: beat === 1,
    onClick: () => setBeatSel(1),
    "data-testid": "attn-next"
  }, L.s5Next)));
}
function Scene5({
  L,
  prompt,
  lang
}) {
  const [beat, setBeatSel] = useState(0);
  const [ffnOn, setFfnOn] = useState(true);
  useEffect(() => {
    setBeatSel(0);
    setFfnOn(true);
  }, [prompt.id]);
  // route ←/→ to beats first; only unconsumed presses fall through to scene navigation
  const beatRef = useRef(beat);
  beatRef.current = beat;
  useEffect(() => {
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
  }, []);
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
    }, dispTok(c.t)), /*#__PURE__*/React.createElement("div", {
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
    why: L.s5Why,
    aside: beat === 1 ? L.s5Rome : null,
    asideNerd: beat === 2 ? L.s5Bridge : null
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
    onClick: () => setBeatSel(i),
    style: {
      cursor: 'pointer',
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
  }))), /*#__PURE__*/React.createElement("div", {
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

// The conveyor belt: the word card rides past repeating meeting→workshop
// stations; every block sticks one more margin note onto the card.
function Scene6({
  L,
  prompt
}) {
  const [layer, setLayer] = useState(1);
  const n = layer;
  const heroWord = prompt.tokens[prompt.hero];
  const W = 560,
    BELTY = 140;
  const cardX = 26 + (n - 1) / 31 * (W - 150);
  const notes = Math.min(n, 10);
  const NOTE_COLORS = [BLUE, GREEN, '#8B5CF6', RUST];
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s6Title,
    lead: L.s6Lead,
    nerd: L.s6Nerd,
    why: L.s6Why
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '12px 14px 8px',
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} 185`,
    style: {
      width: '100%',
      maxWidth: W,
      display: 'block'
    }
  }, Array.from({
    length: 4
  }, (_, k) => {
    const sx = 24 + k * 130;
    return /*#__PURE__*/React.createElement("g", {
      key: k,
      opacity: ".85"
    }, /*#__PURE__*/React.createElement("rect", {
      x: sx,
      y: 14,
      width: 56,
      height: 24,
      rx: 6,
      fill: "#F0F5FF",
      stroke: BLUE,
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: sx + 28,
      y: 30,
      textAnchor: "middle",
      fontSize: "10.5",
      fontWeight: "800",
      fill: BLUE,
      fontFamily: "Nunito,sans-serif"
    }, "\uD83D\uDDE3 ", L.s6StopA), /*#__PURE__*/React.createElement("rect", {
      x: sx + 62,
      y: 14,
      width: 56,
      height: 24,
      rx: 6,
      fill: "#FFF7F2",
      stroke: RUST,
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: sx + 90,
      y: 30,
      textAnchor: "middle",
      fontSize: "10.5",
      fontWeight: "800",
      fill: RUST,
      fontFamily: "Nunito,sans-serif"
    }, "\uD83D\uDD27 ", L.s6StopB));
  }), /*#__PURE__*/React.createElement("text", {
    x: W - 10,
    y: 30,
    textAnchor: "end",
    fontSize: "14",
    fontFamily: "Caveat,cursive",
    fill: "rgba(43,43,43,.55)"
  }, "\u2026 \xD732"), /*#__PURE__*/React.createElement("rect", {
    x: 8,
    y: BELTY,
    width: W - 16,
    height: 15,
    rx: 7,
    fill: "#EDE8DC",
    stroke: INK,
    strokeWidth: "2"
  }), Array.from({
    length: 14
  }, (_, k) => /*#__PURE__*/React.createElement("line", {
    key: k,
    x1: 20 + k * 40,
    y1: BELTY + 2,
    x2: 28 + k * 40,
    y2: BELTY + 13,
    stroke: "rgba(43,43,43,.3)",
    strokeWidth: "2"
  })), /*#__PURE__*/React.createElement("g", {
    style: {
      transform: `translateX(${cardX}px)`,
      transition: 'transform .35s ease-out'
    }
  }, Array.from({
    length: notes
  }, (_, k) => /*#__PURE__*/React.createElement("rect", {
    key: k,
    x: 18 + k % 3 * 3,
    y: BELTY - 52 - k * 5.5,
    width: 62,
    height: 4.5,
    rx: 2,
    fill: NOTE_COLORS[k % 4],
    opacity: ".85"
  })), /*#__PURE__*/React.createElement("rect", {
    x: 8,
    y: BELTY - 44,
    width: 86,
    height: 40,
    rx: 9,
    fill: "#fff",
    stroke: INK,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: 51,
    y: BELTY - 19,
    textAnchor: "middle",
    fontSize: "15",
    fontWeight: "800",
    fontFamily: "Nunito,sans-serif"
  }, heroWord))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 800,
      marginTop: 4
    }
  }, L.s6Block(n), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: GREEN
    }
  }, L.s6Notes(n)))), n === 32 && /*#__PURE__*/React.createElement("div", {
    className: "pop-anim",
    style: {
      marginTop: 12,
      color: GREEN,
      fontWeight: 800,
      fontSize: 14.5,
      maxWidth: 600
    }
  }, L.s6Take), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 300px',
      maxWidth: 460
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
  })), /*#__PURE__*/React.createElement("div", {
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
  }, L.s6GaugeSub))));
}

// The draw wheel: slice size = chance of being the next piece. Sampling spins
// the wheel so the pointer lands inside the drawn slice.
function Scene7({
  L,
  prompt
}) {
  const [gen, setGen] = useState([]);
  const [temp, setTemp] = useState(1.0);
  const [topP, setTopP] = useState(0.95);
  const [auto, setAuto] = useState(false);
  const [flash, setFlash] = useState(0);
  const [rot, setRot] = useState(0);
  const [spin, setSpin] = useState(false);
  const done = gen.length > 0 && (gen[gen.length - 1] === '.' || gen[gen.length - 1] === '。');
  const raw = nextCandidates(prompt, gen);
  const reweighted = useMemo(() => {
    const c = applyTemperature(raw, temp).sort((a, b) => b.q - a.q);
    const kept = topPSet(c, topP).map(x => x.t);
    return c.map(x => ({
      ...x,
      kept: kept.includes(x.t)
    }));
  }, [raw, temp, topP]);
  const kept = reweighted.filter(c => c.kept);
  const keptSum = kept.reduce((a, c) => a + c.q, 0) || 1;
  let acc = 0;
  const slices = kept.map((c, k) => {
    const a0 = acc / keptSum * 360;
    acc += c.q;
    const a1 = acc / keptSum * 360;
    return {
      ...c,
      a0,
      a1,
      mid: (a0 + a1) / 2,
      color: MIX_COLORS[k % MIX_COLORS.length]
    };
  });
  const dropped = reweighted.filter(c => !c.kept);
  const step = greedy => {
    if (done || spin) return;
    let pick;
    if (greedy) pick = kept[0];else {
      let r = Math.random() * keptSum;
      pick = kept[0];
      for (const c of kept) {
        r -= c.q;
        if (r <= 0) {
          pick = c;
          break;
        }
      }
    }
    const sl = slices.find(s => s.t === pick.t);
    // land the pointer (top) inside the picked slice: rot+mid ≡ 0 (mod 360), plus 2 spins
    setRot(r => r + 720 + ((-sl.mid - r) % 360 + 360) % 360);
    setSpin(true);
    setTimeout(() => {
      setGen(g => [...g, pick.t]);
      setFlash(f => f + 1);
      setSpin(false);
    }, 950);
  };
  useEffect(() => {
    if (!auto || done) {
      if (done) setAuto(false);
      return;
    }
    const t = setTimeout(() => step(false), 700);
    return () => clearTimeout(t);
  }, [auto, gen, done, spin]);
  useEffect(() => {
    setGen([]);
    setAuto(false);
    setRot(0);
  }, [prompt.id]);
  const CX = 115,
    CY = 120,
    R = 98;
  const pt = a => {
    const r2 = (a - 90) * Math.PI / 180;
    return `${CX + R * Math.cos(r2)} ${CY + R * Math.sin(r2)}`;
  };
  const lpt = (a, r) => {
    const r2 = (a - 90) * Math.PI / 180;
    return {
      x: CX + r * Math.cos(r2),
      y: CY + r * Math.sin(r2)
    };
  };
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s7Title,
    lead: L.s7Lead,
    nerd: L.s7Nerd,
    why: L.s7Why
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
  }, L.s7Wheel), done ? /*#__PURE__*/React.createElement("div", {
    className: "pop-anim hand",
    style: {
      fontSize: 26,
      color: GREEN
    }
  }, "\u25A0 ", L.s7Done(gen.length)) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 230 240",
    style: {
      width: 230,
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("g", {
    style: {
      transform: `rotate(${rot}deg)`,
      transformOrigin: `${CX}px ${CY}px`,
      transition: spin ? 'transform .9s cubic-bezier(.15,.65,.25,1)' : 'none'
    }
  }, slices.map(s => s.a1 - s.a0 >= 359.9 ? /*#__PURE__*/React.createElement("circle", {
    key: s.t,
    cx: CX,
    cy: CY,
    r: R,
    fill: s.color,
    opacity: ".85",
    stroke: INK,
    strokeWidth: "2"
  }) : /*#__PURE__*/React.createElement("path", {
    key: s.t,
    d: `M ${CX} ${CY} L ${pt(s.a0)} A ${R} ${R} 0 ${s.a1 - s.a0 > 180 ? 1 : 0} 1 ${pt(s.a1)} Z`,
    fill: s.color,
    opacity: ".85",
    stroke: INK,
    strokeWidth: "2"
  })), slices.map(s => {
    if (s.a1 - s.a0 < 26) return null;
    const p = lpt(s.mid, R * 0.62);
    // keep labels upright: flip the ones whose FINAL visual angle
    // (slice mid + current wheel rotation) lands in the lower half
    const v = ((s.mid + rot) % 360 + 360) % 360;
    const a = v > 90 && v < 270 ? s.mid + 180 : s.mid;
    return /*#__PURE__*/React.createElement("text", {
      key: s.t,
      x: p.x,
      y: p.y,
      textAnchor: "middle",
      fontSize: "13.5",
      fontWeight: "800",
      fill: "#fff",
      stroke: "rgba(0,0,0,.25)",
      strokeWidth: "2",
      paintOrder: "stroke",
      fontFamily: "Nunito,sans-serif",
      transform: `rotate(${a} ${p.x} ${p.y})`
    }, dispTok(s.t));
  })), /*#__PURE__*/React.createElement("circle", {
    cx: CX,
    cy: CY,
    r: "13",
    fill: "#fff",
    stroke: INK,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `${CX - 9},6 ${CX + 9},6 ${CX},24`,
    fill: RUST,
    stroke: INK,
    strokeWidth: "1.5"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 130px',
      minWidth: 130
    }
  }, slices.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      margin: '3px 0',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: s.color,
      border: `1.5px solid ${INK}`,
      flex: '0 0 12px'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontFamily: 'monospace'
    }
  }, dispTok(s.t)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontWeight: 800
    }
  }, (s.q / keptSum * 100).toFixed(0), "%"))), dropped.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 11.5,
      color: 'var(--faint)'
    }
  }, "\uD83D\uDEAB ", L.s7Cut, ": ", dropped.map(c => dispTok(c.t)).join(' · ')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "wb-btn rust",
    onClick: () => step(false),
    disabled: done || spin
  }, L.s7Sample), /*#__PURE__*/React.createElement("button", {
    className: "wb-btn",
    onClick: () => step(true),
    disabled: done || spin
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
  prompt,
  goto
}) {
  return /*#__PURE__*/React.createElement(SceneFrame, {
    title: L.s8Title,
    lead: L.s8Lead
  }, /*#__PURE__*/React.createElement("div", {
    className: "wb-card",
    style: {
      padding: '18px 22px',
      maxWidth: 680,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "hand",
    style: {
      fontSize: 30,
      margin: '0 0 12px',
      lineHeight: 1.25
    }
  }, L.s8Recap), /*#__PURE__*/React.createElement(StepChips, {
    steps: L.journeySteps,
    idx: 8
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(SentenceRow, {
    prompt: prompt,
    heroOn: false,
    gen: [prompt.start[0].t]
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      maxWidth: 760,
      margin: '0 0 12px'
    }
  }, "\uD83D\uDCC4 ", L.s8DecoderIntro), /*#__PURE__*/React.createElement("div", {
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