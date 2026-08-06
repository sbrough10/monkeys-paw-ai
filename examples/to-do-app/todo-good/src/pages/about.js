import { header, cookieBanner, bindCookie } from "../components.js";

export function renderAbout(app) {
  document.title = "About — ClearTodo";
  app.innerHTML = `
    <div class="shell">
      ${header("about")}
      <main id="main">
        <h1>About ClearTodo</h1>
        <p class="lede">A focused task list with search, sort, priorities, and due dates.</p>
        <section class="panel">
          <p>ClearTodo keeps your tasks on the server so you can pick up where you left off. Use the list to capture work quickly, then open a task to edit notes and details.</p>
          <p><a href="#/">Return to your tasks</a></p>
        </section>
      </main>
      ${cookieBanner()}
    </div>
  `;
  bindCookie(app);
}
