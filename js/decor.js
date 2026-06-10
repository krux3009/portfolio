// Landing-page decoration: scroll reveals + small easter eggs.

document.addEventListener("DOMContentLoaded", function () {
  // reveal-on-scroll
  const revealed = document.querySelectorAll(".reveal");
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
      { threshold: 0.15 }
    );
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("in"); });
  }

  // easter egg: shuttlecock bounces when clicked
  const shuttle = document.getElementById("shuttle");
  if (shuttle) {
    shuttle.addEventListener("click", function () {
      shuttle.classList.remove("bounce");
      void shuttle.offsetWidth; // restart animation
      shuttle.classList.add("bounce");
    });
  }
});

// easter egg: for the nerds who open the console
console.log(
  "%cLi Xuan.%c\n\nbuilt by hand — no framework, no build step.\ncurious how? https://github.com/krux3009/portfolio\n\npsst: try clicking the shuttlecock 🏸",
  "font-size:22px;font-weight:bold;",
  "font-size:13px;"
);
