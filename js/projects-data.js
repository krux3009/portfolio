// projects-data.js — the single file to edit when you ship a new project.
//
// Each project is one object:
//   title        (string)  card heading
//   description  (string)  1-2 sentences, your own voice — what it is + why it's cool
//   tags         (array)   up to 3 short labels; first two get colored pills
//   year         (string)  when you built it
//   link         (string)  RELATIVE path, e.g. "projects/llm-journey/" — keeps
//                          working both locally and on the live server.
//                          Use null for projects that aren't public yet.
//   status       (string, optional)  "ongoing" shows a work-in-progress pill
//
// Add new projects to the TOP of the array so the newest shows first.

const PROJECTS = [
  {
    title: "Journey of a Token",
    description: "How an LLM reads your sentence and writes back — an interactive explainer you can step through or scroll like a factory tour.",
    tags: ["INTERACTIVE", "HTML · JS", "EN / 中文"],
    year: "2026",
    link: "projects/llm-journey/",
  },
  {
    title: "Investment Dashboard",
    description: "A dashboard for my moomoo stock portfolio — positions, performance, and daily market digests in one view. Python backend, Next.js front end.",
    tags: ["NEXT.JS", "PYTHON", "MOOMOO API"],
    year: "2026",
    link: null,
    status: "ongoing",
  },
];
