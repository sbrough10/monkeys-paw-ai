export function header(active) {
  return `
    <header class="site-header">
      <a class="brand" href="#/">ClearTodo</a>
      <nav class="nav" aria-label="Primary">
        <a href="#/" ${active === "home" ? 'aria-current="page"' : ""}>Tasks</a>
        <a href="#/about" ${active === "about" ? 'aria-current="page"' : ""}>About</a>
      </nav>
    </header>
  `;
}

export function cookieBanner() {
  if (localStorage.getItem("todo-good-consent")) return "";
  return `
    <div class="cookie" role="dialog" aria-labelledby="cookie-title">
      <p id="cookie-title">We use a single local preference cookie to remember your consent. No ads, no tracking pixels.</p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-primary" data-consent="accept">Accept</button>
        <button type="button" class="btn btn-secondary" data-consent="reject">Reject</button>
      </div>
    </div>
  `;
}

export function bindCookie(root) {
  root.querySelectorAll("[data-consent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("todo-good-consent", btn.getAttribute("data-consent"));
      const el = root.querySelector(".cookie");
      if (el) el.remove();
    });
  });
}

export function priorityBadge(priority) {
  const p = priority || "medium";
  return `<span class="priority priority-${p}">${p}</span>`;
}

export function formatDate(iso) {
  if (!iso) return "No due date";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso + "T12:00:00"));
  } catch {
    return iso;
  }
}
