import { createGame } from './game.js';
import {
  fetchScores,
  submitScore,
  loadProfile,
  saveProfile,
  formatMmDdYyyy,
} from './api.js';

export function renderPlay(root, { showToast }) {
  const profile = loadProfile();
  root.innerHTML = `
    <h1>Play</h1>
    <p class="lede">Eat the orbs, grow longer, don't hit the walls — or yourself.</p>
    <div class="game-layout">
      <div class="panel">
        <div class="board-wrap">
          <div class="board-relative" id="board-host">
            <canvas id="game-canvas" width="420" height="420" aria-label="Snake game board"></canvas>
            <div class="overlay" id="overlay">
              <div>
                <p><strong>Ready?</strong></p>
                <p>Press Space or Start to begin. Arrow keys or WASD to move.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="controls">
          <button type="button" id="btn-start">Start</button>
          <button type="button" class="secondary" id="btn-pause">Pause</button>
          <button type="button" class="secondary" id="btn-restart">Restart</button>
        </div>
      </div>
      <aside class="panel stats" aria-label="Game stats">
        <div class="stat"><span>Score</span><strong id="stat-score">0</strong></div>
        <div class="stat"><span>Length</span><strong id="stat-len">1</strong></div>
        <div class="stat"><span>Player</span><strong id="stat-name"></strong></div>
        <div class="stat"><span>Difficulty</span><strong id="stat-diff"></strong></div>
        <form id="submit-form" hidden>
          <label>
            Submit as
            <input type="text" name="name" required maxlength="24" />
          </label>
          <p class="field-error" id="submit-error" hidden></p>
          <button type="submit" style="margin-top:0.75rem;width:100%">Save high score</button>
        </form>
      </aside>
    </div>
  `;

  root.querySelector('#stat-name').textContent = profile.name;
  root.querySelector('#stat-diff').textContent = profile.difficulty;
  root.querySelector('#submit-form [name=name]').value = profile.name;

  const canvas = root.querySelector('#game-canvas');
  const overlay = root.querySelector('#overlay');
  const game = createGame(canvas, {
    color: profile.color,
    difficulty: profile.difficulty,
    sound: profile.sound,
  });

  const unsub = game.subscribe((state) => {
    root.querySelector('#stat-score').textContent = String(state.score);
    root.querySelector('#stat-len').textContent = String(state.snakeLength);
    if (!state.started) {
      overlay.hidden = false;
      overlay.innerHTML = `<div><p><strong>Ready?</strong></p><p>Press Space or Start. Arrows / WASD to move.</p></div>`;
    } else if (state.paused) {
      overlay.hidden = false;
      overlay.innerHTML = `<div><p><strong>Paused</strong></p><p>Press Space to resume.</p></div>`;
    } else if (!state.alive) {
      overlay.hidden = false;
      overlay.innerHTML = `<div><p><strong>Game over</strong></p><p>Score: ${state.score}</p></div>`;
      root.querySelector('#submit-form').hidden = false;
    } else {
      overlay.hidden = true;
      root.querySelector('#submit-form').hidden = true;
    }
  });

  root.querySelector('#btn-start').addEventListener('click', () => game.start());
  root.querySelector('#btn-pause').addEventListener('click', () => game.togglePause());
  root.querySelector('#btn-restart').addEventListener('click', () => {
    game.reset();
    root.querySelector('#submit-form').hidden = true;
  });

  root.querySelector('#submit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = root.querySelector('#submit-error');
    err.hidden = true;
    const name = new FormData(e.target).get('name').toString().trim();
    if (!name) {
      err.textContent = 'Name is required.';
      err.hidden = false;
      return;
    }
    const { score } = game.getState();
    try {
      await submitScore({
        name,
        points: score,
        playedOn: formatMmDdYyyy(new Date()),
      });
      showToast('Score saved to the leaderboard.');
      location.hash = '#/scores';
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      showToast(ex.message, true);
    }
  });

  return () => {
    unsub();
    game.destroy();
  };
}

export function renderScores(root, { showToast }) {
  root.innerHTML = `
    <h1>Leaderboard</h1>
    <p class="lede">Top runs from every snake in the grass.</p>
    <div class="toolbar">
      <label>
        Search
        <input type="search" id="score-search" placeholder="Filter by name" />
      </label>
      <label>
        Sort
        <select id="score-sort">
          <option value="points-desc">Score (high → low)</option>
          <option value="points-asc">Score (low → high)</option>
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
        </select>
      </label>
      <button type="button" class="secondary" id="refresh">Refresh</button>
    </div>
    <div id="score-body"><div class="skeleton"></div><div class="skeleton"></div></div>
  `;

  let rows = [];

  async function load() {
    root.querySelector('#score-body').innerHTML =
      '<div class="skeleton"></div><div class="skeleton"></div>';
    try {
      rows = await fetchScores();
      paint();
    } catch (ex) {
      root.querySelector('#score-body').innerHTML =
        `<p class="field-error">${ex.message}</p>`;
      showToast(ex.message, true);
    }
  }

  function paint() {
    const q = root.querySelector('#score-search').value.trim().toLowerCase();
    const sort = root.querySelector('#score-sort').value;
    let list = rows.slice();
    if (q) {
      list = list.filter((r) => (r.name || '').toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sort === 'points-desc') return (b.points || 0) - (a.points || 0);
      if (sort === 'points-asc') return (a.points || 0) - (b.points || 0);
      if (sort === 'name-asc') return String(a.name).localeCompare(String(b.name));
      return String(b.name).localeCompare(String(a.name));
    });

    if (!list.length) {
      root.querySelector('#score-body').innerHTML = '<p class="lede">No scores match.</p>';
      return;
    }

    root.querySelector('#score-body').innerHTML = `
      <ol class="score-list">
        ${list
          .map(
            (r, i) => `
          <li>
            <span class="rank">${i + 1}</span>
            <span>${escapeHtml(r.name)}</span>
            <strong>${r.points ?? 0}</strong>
            <span>${escapeHtml(r.playedOn || '')}</span>
          </li>`
          )
          .join('')}
      </ol>
    `;
  }

  root.querySelector('#score-search').addEventListener('input', paint);
  root.querySelector('#score-sort').addEventListener('change', paint);
  root.querySelector('#refresh').addEventListener('click', load);
  load();
  return () => {};
}

export function renderProfile(root, { showToast }) {
  const profile = loadProfile();
  root.innerHTML = `
    <h1>Profile</h1>
    <p class="lede">Personalize your snake. Settings apply the next time you play.</p>
    <form class="panel form-grid" id="profile-form">
      <label>
        Display name
        <input type="text" name="name" required maxlength="24" value="${escapeAttr(profile.name)}" />
      </label>
      <label>
        Birthdate
        <input type="date" name="birthdate" required value="${escapeAttr(profile.birthdate)}" />
      </label>
      <label>
        Snake color
        <input type="color" name="color" value="${escapeAttr(profile.color)}" />
      </label>
      <fieldset class="checkbox-group" style="border:none;padding:0;margin:0">
        <legend style="font-weight:600;font-size:0.9rem;margin-bottom:0.35rem">Difficulty</legend>
        <label><input type="radio" name="difficulty" value="easy" ${profile.difficulty === 'easy' ? 'checked' : ''}/> Easy</label>
        <label><input type="radio" name="difficulty" value="normal" ${profile.difficulty === 'normal' ? 'checked' : ''}/> Normal</label>
        <label><input type="radio" name="difficulty" value="hard" ${profile.difficulty === 'hard' ? 'checked' : ''}/> Hard</label>
      </fieldset>
      <label>
        <span style="display:flex;align-items:center;gap:0.5rem;font-weight:600">
          <input type="checkbox" name="sound" ${profile.sound ? 'checked' : ''} />
          Sound effects
        </span>
      </label>
      <fieldset class="checkbox-group" style="border:none;padding:0;margin:0">
        <legend style="font-weight:600;font-size:0.9rem;margin-bottom:0.35rem">Interests</legend>
        <label><input type="checkbox" name="interests" value="classic" ${profile.interests.includes('classic') ? 'checked' : ''}/> Classic arcade</label>
        <label><input type="checkbox" name="interests" value="speed" ${profile.interests.includes('speed') ? 'checked' : ''}/> Speed runs</label>
        <label><input type="checkbox" name="interests" value="zen" ${profile.interests.includes('zen') ? 'checked' : ''}/> Zen mode</label>
      </fieldset>
      <p class="field-error" id="profile-error" hidden></p>
      <button type="submit">Save profile</button>
    </form>
  `;

  root.querySelector('#profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const err = root.querySelector('#profile-error');
    err.hidden = true;
    const name = String(fd.get('name') || '').trim();
    const color = String(fd.get('color') || '');
    if (!name) {
      err.textContent = 'Display name is required.';
      err.hidden = false;
      return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      err.textContent = 'Pick a valid color.';
      err.hidden = false;
      return;
    }
    const interests = fd.getAll('interests').map(String);
    saveProfile({
      name,
      birthdate: String(fd.get('birthdate') || '2000-01-01'),
      color,
      difficulty: String(fd.get('difficulty') || 'normal'),
      sound: fd.get('sound') === 'on',
      interests,
    });
    showToast('Profile saved.');
  });

  return () => {};
}

export function renderAbout(root) {
  root.innerHTML = `
    <h1>About</h1>
    <p class="lede">A small, faithful take on the classic phone game.</p>
    <div class="panel about-list">
      <p><strong>Move</strong> with arrow keys or WASD.</p>
      <p><strong>Pause</strong> with Space.</p>
      <p><strong>Goal</strong> — eat food, grow, survive. Walls and your own tail end the run.</p>
      <p><strong>Scores</strong> — save a run to the shared leaderboard from the Play screen after game over.</p>
      <p><strong>Profile</strong> — set your name, color, and difficulty before you start.</p>
    </div>
  `;
  return () => {};
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s);
}
