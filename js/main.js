// Renders project cards from PROJECTS (projects-data.js) into #project-grid,
// in the current language (js/i18n.js). Re-renders on language toggle.
// Future React migration: this function body becomes
//   PROJECTS.map(p => <ProjectCard {...p} />)

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid || typeof PROJECTS === "undefined") return;

  const zh = typeof I18N !== "undefined" && I18N.lang === "zh";

  grid.innerHTML = PROJECTS.map(function (p) {
    const title = zh && p.titleZh ? p.titleZh : p.title;
    const desc = zh && p.descriptionZh ? p.descriptionZh : p.description;
    const pills = p.tags
      .slice(0, 3)
      .map(function (t, i) {
        return '<span class="tag-pill c' + i + '">' + t + "</span>";
      })
      .join("");
    const ongoing = p.status === "ongoing";
    const inner =
      (p.image
        ? '<img class="thumb" src="' + p.image + '" alt="" loading="lazy">'
        : "") +
      '<span class="tags">' + pills + "</span>" +
      "<h3>" + title + '<span class="year">' + p.year +
      (ongoing ? " · ongoing" : "") + "</span></h3>" +
      "<p>" + desc + "</p>" +
      (p.link
        ? '<span class="go">' + I18N.t("cardGo") + "</span>"
        : '<span class="go wip">' + I18N.t("cardWip") + "</span>");
    const external = p.link && p.link.indexOf("http") === 0;
    return p.link
      ? '<a class="card" href="' + p.link + '"' +
        (external ? ' target="_blank" rel="noopener"' : "") + ">" + inner + "</a>"
      : '<div class="card nolink">' + inner + "</div>";
  }).join("");

  const count = document.getElementById("project-count");
  if (count) {
    count.textContent = I18N.t("projectsSoFar")(PROJECTS.length);
  }
}

document.addEventListener("DOMContentLoaded", renderProjects);
document.addEventListener("langchange", renderProjects);
