/** Small DOM helpers shared across this app. */

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value !== null && value !== undefined) node.setAttribute(key, String(value));
  }
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

export function $(selector) {
  const node = document.querySelector(selector);
  if (!node) throw new Error(`Missing element: ${selector}`);
  return node;
}

/**
 * A labelled cell input. Table headers alone do not name a control for a screen
 * reader, so each input carries its own accessible label.
 */
export function cellInput({ label, value, type = 'number', min, max, step, onCommit }) {
  const input = el('input', { type, value, 'aria-label': label, min, max, step });
  const commit = () => {
    if (type === 'number') {
      const parsed = Number.parseFloat(input.value);
      const valid = Number.isFinite(parsed) && withinBounds(parsed, min, max);
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid) return;
      onCommit(parsed);
    } else {
      onCommit(input.value);
    }
  };
  input.addEventListener('input', commit);
  return input;
}

/** Percentages are edited as whole numbers and stored as fractions. */
export function percentInput({ label, fraction, onCommit }) {
  return cellInput({
    label,
    value: round(fraction * 100, 2),
    step: 1,
    onCommit: (percent) => onCommit(percent / 100),
  });
}

function withinBounds(value, min, max) {
  if (min !== undefined && value < Number(min)) return false;
  if (max !== undefined && value > Number(max)) return false;
  return true;
}

function round(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
