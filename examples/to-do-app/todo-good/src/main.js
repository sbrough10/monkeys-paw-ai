import { renderHome } from "./pages/home.js";
import { renderDetail } from "./pages/detail.js";
import { renderAbout } from "./pages/about.js";

const app = document.getElementById("app");

async function route() {
  const hash = location.hash || "#/";
  const path = hash.replace(/^#/, "") || "/";

  if (path === "/" || path === "") {
    document.title = "Todo — Your tasks";
    await renderHome(app);
    return;
  }
  if (path === "/about") {
    renderAbout(app);
    return;
  }
  const detail = path.match(/^\/todo\/([^/]+)$/);
  if (detail) {
    await renderDetail(app, decodeURIComponent(detail[1]));
    return;
  }
  document.title = "Not found — ClearTodo";
  app.innerHTML = `
    <div class="shell">
      <main id="main">
        <h1>Page not found</h1>
        <p class="lede">That link does not match a task or page.</p>
        <a class="btn btn-secondary" href="#/">Back to tasks</a>
      </main>
    </div>
  `;
}

window.addEventListener("hashchange", route);
route();
