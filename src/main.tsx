import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { LangProvider } from "./i18n";

console.log(
  "%c🏸 you opened the drawer. hello, curious one.\n" +
    "the old sketchbook site rests in git history: github.com/krux3009/portfolio",
  "color:#d98a5f; font-family:Georgia, serif; font-size:13px;",
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
);
