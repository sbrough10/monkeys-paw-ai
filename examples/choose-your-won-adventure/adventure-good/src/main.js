import "./styles.css";
import { Header, CookieBanner } from "./components.js";
import { HomePage, SetupPage, PlayPage, ProgressPage, AboutPage } from "./pages.js";

const app = document.getElementById("app");

function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "setup" && parts[1]) return { name: "setup", id: parts[1] };
  if (parts[0] === "play" && parts[1]) return { name: "play", id: parts[1] };
  if (parts[0] === "progress") return { name: "progress" };
  if (parts[0] === "about") return { name: "about" };
  return { name: "home" };
}

async function render() {
  const route = parseRoute();
  const main = document.createElement("main");
  main.id = "main";
  app.replaceChildren(
    Object.assign(document.createElement("a"), {
      className: "skip-link",
      href: "#main",
      textContent: "Skip to content",
    }),
    Header(route.name === "home" ? "home" : route.name),
    main
  );
  const cookie = CookieBanner();
  if (cookie) app.append(cookie);

  if (route.name === "setup") await SetupPage(main, route.id);
  else if (route.name === "play") await PlayPage(main, route.id);
  else if (route.name === "progress") await ProgressPage(main);
  else if (route.name === "about") AboutPage(main);
  else await HomePage(main);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.textContent = "Choose Your Won Adventure — victories optional, consequences included.";
  app.append(footer);
}

window.addEventListener("hashchange", render);
render();
