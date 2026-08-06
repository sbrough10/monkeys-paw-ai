import { renderPlay, renderScores, renderProfile, renderAbout } from './pages.js';

const main = document.getElementById('main');
const toastEl = document.getElementById('toast');
let cleanup = () => {};

function showToast(message, isError = false) {
  toastEl.hidden = false;
  toastEl.textContent = message;
  toastEl.classList.toggle('error', isError);
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toastEl.hidden = true;
  }, 3200);
}

const routes = {
  play: renderPlay,
  scores: renderScores,
  profile: renderProfile,
  about: renderAbout,
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '') || 'play';
  const name = hash.split('?')[0];
  return routes[name] ? name : 'play';
}

function setActiveNav(route) {
  document.querySelectorAll('.nav-list a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const match = href === `#/${route}`;
    if (match) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function navigate() {
  cleanup();
  const route = currentRoute();
  setActiveNav(route);
  const render = routes[route];
  cleanup = render(main, { showToast }) || (() => {});
}

window.addEventListener('hashchange', navigate);
navigate();
