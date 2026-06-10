// Site-wide EN/中文 i18n.
// Detection order: saved choice (localStorage) → system language → English.
// Usage in HTML:  <span data-i18n="key"></span>  (text)
//                 <span data-i18n-html="key"></span>  (rich markup, e.g. hero headline)
// Toggle button:  any element with id="langBtn".
// Other scripts can listen:  document.addEventListener("langchange", fn)

const I18N = (function () {
  const STR = {
    en: {
      // nav
      navHome: "Home",
      navProjects: "Projects",
      navResume: "Resume",
      navContact: "Contact",
      contactEmail: "Email",
      langBtn: "中文",

      // landing — hero
      kicker: "SMU IS · AI PRODUCT OPS @ STEPFUN",
      heroH1:
        'Hi, I’m Li Xuan —<br>I turn “how does that work?”<br>into <span class="hl">things you can click</span>.',
      heroTag:
        "IS student @ SMU · AI product ops intern @ StepFun. I build interactive explainers and tools that satisfy my own curiosity first — maybe yours too.",
      heroCta: "See my projects →",

      // landing — intro (placeholders until decoration session)
      introLabel: "Who I am",
      introP1:
        "Born and raised in Singapore, I grew up on sports — my dad got me into badminton first, and years of serious training left me with a love-hate bond with the game; football came later. Video games only arrived in my teens, and they amazed me twice over: how are these worlds even built, and how do they pull together people from completely different walks of life? Chasing those two questions led me to Information Systems at SMU.",
      introP2:
        "These days my weekends are still mostly on a badminton court, or in voice chat squadding up with good friends. I want to get better at sharing what I learn — and to make sure I don't fall behind in this AI era. This site is that platform.",
      hobbiesLabel: "Hobbies & interests",
      hobby1Title: "Badminton",
      hobby1Desc: "Smashes on weekends. Still chasing the perfect cross-court drop shot.",
      hobby2Title: "Video games",
      hobby2Desc: "Strategy and story-driven worlds. Will absolutely lose track of time.",
      photoCap: "me.jpg — coming soon",

      // projects page
      projectsLabel: "Projects",
      projectsSoFar: function (n) { return "(" + n + " so far)"; },
      cardGo: "Take a look →",
      cardWip: "Work in progress ✏︎",

      // resume page
      resumeTitle: "Resume",
      resumeStub: "still resumaxxing 🚧",
      resumeSub: "check back soon.",

      // footer
      footBuilt:
        'Built by hand <span class="heart">♥</span> no framework, no build step · auto-deployed from <a href="https://github.com/krux3009/portfolio" style="color:inherit">GitHub</a>',
    },
    zh: {
      // nav
      navHome: "首页",
      navProjects: "项目",
      navResume: "简历",
      navContact: "联系",
      contactEmail: "邮箱",
      langBtn: "EN",

      // landing — hero
      kicker: "SMU 信息系统 · 阶跃星辰 AI 产品运营",
      heroH1:
        '嗨，我是立瑄 ——<br>我把「这是怎么做到的？」<br>变成<span class="hl">可以点的东西</span>。',
      heroTag:
        "SMU 信息系统在读 · 阶跃星辰（StepFun）AI 产品运营实习生。我做交互式讲解和小工具，先满足自己的好奇心——说不定也能满足你的。",
      heroCta: "看我的项目 →",

      // landing — intro
      introLabel: "我是谁",
      introP1: "土生土长的新加坡人，从小在运动场上长大——先是父亲带我接触了羽毛球，在专业的训练与折磨中对这项运动又爱又恨，后面又踢上了足球。十几岁才接触电子游戏，它让我惊讶了两次：这样的世界到底是怎么做出来的？它又凭什么能把天南地北、各行各业的人聚到一起？追着这两个问题，我走进了 SMU 的信息系统专业。",
      introP2: "如今周末多半还在羽毛球场上，或者在和一群好朋友一起开黑打游戏。我希望更好地把自己学到的知识分享给大家，同时也能确保我在这个AI的时代里不会落后——这个网站就是这样一个平台。",
      hobbiesLabel: "爱好与兴趣",
      hobby1Title: "羽毛球",
      hobby1Desc: "周末杀球。还在练那一拍完美的劈吊对角。",
      hobby2Title: "打游戏",
      hobby2Desc: "策略类和剧情向的世界，一玩就忘了时间。",
      photoCap: "me.jpg —— 快了快了",

      // projects page
      projectsLabel: "项目",
      projectsSoFar: function (n) { return "（目前 " + n + " 个）"; },
      cardGo: "看看 →",
      cardWip: "施工中 ✏︎",

      // resume page
      resumeTitle: "简历",
      resumeStub: "简历还在卷 🚧",
      resumeSub: "过阵子再来看。",

      // footer
      footBuilt:
        '纯手写 <span class="heart">♥</span> 无框架、无构建 · 经 <a href="https://github.com/krux3009/portfolio" style="color:inherit">GitHub</a> 自动部署',
    },
  };

  function detect() {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "zh") return saved;
    const sys = (navigator.language || "en").toLowerCase();
    return sys.startsWith("zh") ? "zh" : "en";
  }

  let lang = detect();

  function t(key) {
    return (STR[lang] && STR[lang][key]) !== undefined ? STR[lang][key] : key;
  }

  function apply() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = t("langBtn");
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function toggle() {
    lang = lang === "en" ? "zh" : "en";
    localStorage.setItem("lang", lang);
    apply();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", toggle);
    apply();
  });

  return {
    get lang() { return lang; },
    t: t,
    apply: apply,
    toggle: toggle,
  };
})();
