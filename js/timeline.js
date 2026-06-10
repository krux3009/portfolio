// Renders a hobby timeline (js/hobbies-data.js) into #timeline and drives
// the scroll interactions: the center line draws itself with scroll progress,
// milestones reveal as they enter the viewport.
// Page picks its dataset via <body data-hobby="badminton|games">.

function renderTimeline() {
  const wrap = document.getElementById("timeline");
  const hobby = document.body.getAttribute("data-hobby");
  const data = typeof HOBBY_TIMELINES !== "undefined" && HOBBY_TIMELINES[hobby];
  if (!wrap || !data) return;

  const zh = typeof I18N !== "undefined" && I18N.lang === "zh";

  wrap.innerHTML =
    '<div class="tl-track" aria-hidden="true"><div class="tl-line" id="tl-line"></div></div>' +
    data.milestones
      .map(function (m, i) {
        const title = zh && m.titleZh ? m.titleZh : m.title;
        const text = zh && m.textZh ? m.textZh : m.text;
        const photo = m.photo
          ? '<figure class="tl-photo"><img src="' + m.photo + '" alt=""></figure>'
          : '<figure class="tl-photo empty"><span data-tl="photo">' + I18N.t("tlPhoto") + "</span></figure>";
        const stat = m.stat
          ? '<div class="tl-stat"><span class="tl-stat-label">' +
            (zh && m.stat.labelZh ? m.stat.labelZh : m.stat.label) +
            '</span><div class="tl-bar"><div class="tl-fill" style="width:' +
            Math.max(0, Math.min(100, m.stat.pct)) +
            '%"></div></div></div>'
          : "";
        return (
          '<div class="tl-item ' + (i % 2 ? "right" : "left") + ' tl-reveal">' +
          '<span class="tl-badge">' + m.age + "</span>" +
          '<div class="tl-card">' +
          "<h3>" + title + "</h3>" +
          "<p>" + text + "</p>" +
          photo + stat +
          "</div></div>"
        );
      })
      .join("");

  // reveal milestones on scroll
  const items = wrap.querySelectorAll(".tl-reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
}

// center line grows with scroll progress through the timeline
function trackScroll() {
  const wrap = document.getElementById("timeline");
  const line = document.getElementById("tl-line");
  if (!wrap || !line) return;
  const rect = wrap.getBoundingClientRect();
  const viewH = window.innerHeight;
  // 0 when timeline top reaches 70% of viewport, 1 when bottom reaches 50%
  const total = rect.height - viewH * 0.2;
  const passed = viewH * 0.7 - rect.top;
  const p = Math.max(0, Math.min(1, passed / total));
  line.style.height = (p * 100).toFixed(2) + "%";
}

let tlTicking = false;
window.addEventListener("scroll", function () {
  if (!tlTicking) {
    tlTicking = true;
    requestAnimationFrame(function () {
      trackScroll();
      tlTicking = false;
    });
  }
}, { passive: true });

document.addEventListener("DOMContentLoaded", function () {
  renderTimeline();
  trackScroll();
});
document.addEventListener("langchange", function () {
  renderTimeline();
  trackScroll();
});
