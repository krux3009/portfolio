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
        "[WHO I AM — 2–3 sentences. The person, not the resume: where you grew up, what makes you curious, how you ended up building things.]",
      introP2:
        "[ANOTHER ANGLE — what you care about outside work/school, what you're trying to get better at.]",
      hobbiesLabel: "Hobbies & interests",
      hobby1Title: "[HOBBY 1]",
      hobby1Desc: "[one line — what it is and why you love it]",
      hobby2Title: "[HOBBY 2]",
      hobby2Desc: "[one line]",
      hobby3Title: "[HOBBY 3]",
      hobby3Desc: "[one line]",

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
      introP1: "[我是谁 —— 两三句话。写人，不是写简历：在哪长大、对什么好奇、怎么走上做东西这条路。]",
      introP2: "[换个角度 —— 工作学习之外在乎什么、正在练什么。]",
      hobbiesLabel: "爱好与兴趣",
      hobby1Title: "[爱好 1]",
      hobby1Desc: "[一句话 —— 是什么、为什么喜欢]",
      hobby2Title: "[爱好 2]",
      hobby2Desc: "[一句话]",
      hobby3Title: "[爱好 3]",
      hobby3Desc: "[一句话]",

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
