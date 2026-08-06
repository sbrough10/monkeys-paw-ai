export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== undefined && value !== null) {
      node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function Button({ label, onClick, variant = "primary", type = "button", href }) {
  if (href) {
    return el("a", { className: `btn ${variant === "secondary" ? "secondary" : ""}`, href, text: label });
  }
  const className =
    "btn" +
    (variant === "secondary" ? " secondary" : "") +
    (variant === "danger" ? " danger" : "");
  return el("button", { className, type, onClick, text: label });
}

export function Header(active) {
  return el("header", { className: "site-header" }, [
    el("a", { className: "brand", href: "#/" }, "Choose Your Won Adventure"),
    el("nav", { className: "nav", "aria-label": "Primary" }, [
      el("a", { href: "#/", text: "Catalog", "aria-current": active === "home" ? "page" : null }),
      el("a", { href: "#/progress", text: "Saved progress", "aria-current": active === "progress" ? "page" : null }),
      el("a", { href: "#/about", text: "About", "aria-current": active === "about" ? "page" : null }),
    ]),
  ]);
}

export function CookieBanner() {
  if (localStorage.getItem("won-cookie-consent")) return null;
  const bar = el("div", { className: "cookie", role: "dialog", "aria-label": "Cookie notice" }, [
    el("p", {
      text: "We use a single local key for your player id and optional cookie preference. No ad trackers.",
    }),
    el("div", {}, [
      Button({
        label: "Accept",
        onClick: () => {
          localStorage.setItem("won-cookie-consent", "accepted");
          bar.remove();
        },
      }),
      Button({
        label: "Reject non-essential",
        variant: "secondary",
        onClick: () => {
          localStorage.setItem("won-cookie-consent", "rejected");
          bar.remove();
        },
      }),
    ]),
  ]);
  return bar;
}

export function Loading() {
  return el("div", { className: "loading", role: "status" }, [
    el("p", { text: "Loading…" }),
    el("div", { className: "skeleton", "aria-hidden": "true" }),
  ]);
}
