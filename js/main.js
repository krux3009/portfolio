// Renders project cards from PROJECTS (projects-data.js) into #project-grid.
// Future React migration: this function body becomes
//   PROJECTS.map(p => <ProjectCard {...p} />)

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid || typeof PROJECTS === "undefined") return;

  grid.innerHTML = PROJECTS.map(function (p) {
    const pills = p.tags
      .slice(0, 3)
      .map(function (t, i) {
        return '<span class="tag-pill c' + i + '">' + t + "</span>";
      })
      .join("");
    const ongoing = p.status === "ongoing";
    const inner =
      '<span class="tags">' + pills + "</span>" +
      "<h3>" + p.title + '<span class="year">' + p.year +
      (ongoing ? " · ongoing" : "") + "</span></h3>" +
      "<p>" + p.description + "</p>" +
      (p.link
        ? '<span class="go">Take a look →</span>'
        : '<span class="go wip">Work in progress ✏︎</span>');
    return p.link
      ? '<a class="card" href="' + p.link + '">' + inner + "</a>"
      : '<div class="card nolink">' + inner + "</div>";
  }).join("");

  const count = document.getElementById("project-count");
  if (count) {
    count.textContent = "(" + PROJECTS.length + " so far)";
  }
}

document.addEventListener("DOMContentLoaded", renderProjects);
