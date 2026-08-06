import {
  sprintCapacity,
  plannedAllocations,
  resultingAllocations,
  issueCounts,
  warnings,
  formatNumber,
  formatPercent,
  formatRange,
} from './model.js';
import { load, save, defaultState, clear, rollIntoNextSprint } from './storage.js';
import { $, el, cellInput, percentInput } from './dom.js';

let state = load();

/**
 * Derived cells are tracked per row so that typing only rewrites the computed
 * text. Rebuilding the whole table on every keystroke would drop focus.
 */
const derived = { team: [], planned: [], results: [] };

function main() {
  bindSprintFields();
  bindButtons();
  buildTables();
  refresh();
}

function bindSprintFields() {
  for (const input of document.querySelectorAll('[data-config]')) {
    const key = input.dataset.config;
    input.value = state.config[key];
    input.addEventListener('input', () => {
      const parsed = Number.parseFloat(input.value);
      const valid = Number.isFinite(parsed) && parsed >= Number(input.min ?? -Infinity);
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid) return;
      state.config[key] = parsed;
      refresh();
    });
  }

  for (const input of document.querySelectorAll('[data-sprint]')) {
    const key = input.dataset.sprint;
    input.value = state.sprint[key];
    input.addEventListener('input', () => {
      state.sprint[key] = input.value;
      refresh();
    });
  }

  const planned = $('#planned-issues');
  planned.value = state.plannedIssues;
  planned.addEventListener('input', () => {
    const parsed = Number.parseInt(planned.value, 10);
    const valid = Number.isFinite(parsed) && parsed >= 0;
    planned.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (!valid) return;
    state.plannedIssues = parsed;
    refresh();
  });
}

function bindButtons() {
  $('#add-member').addEventListener('click', () => {
    state.team.push({ name: `Engineer ${state.team.length + 1}`, daysOff: 0, velocityCoefficient: 0.8 });
    buildTables();
    refresh();
    focusLastRow('#team-body');
  });

  $('#add-allocation').addEventListener('click', () => {
    state.allocations.push({
      type: `Type ${state.allocations.length + 1}`,
      goalPercentage: 0,
      owedPercentage: 0,
      pastRollover: 0,
      completed: 0,
      futureRollover: 0,
    });
    buildTables();
    refresh();
    focusLastRow('#planned-body');
  });

  $('#roll-forward').addEventListener('click', () => {
    const capacity = sprintCapacity(state.team, state.config);
    const results = resultingAllocations(state.allocations, capacity.tickets);
    if (results.totals.completed === 0) {
      announce('Nothing is marked completed, so there are no results to carry forward yet.');
      return;
    }
    state = rollIntoNextSprint(state, results);
    bindSprintFields();
    buildTables();
    refresh();
    announce("Carried this sprint's debt and rollover into the next sprint.");
  });

  $('#reset').addEventListener('click', () => {
    clear();
    state = defaultState();
    bindSprintFields();
    buildTables();
    refresh();
    announce('Reset to the example sprint.');
  });
}

function buildTables() {
  buildTeamTable();
  buildAllocationTables();
}

function buildTeamTable() {
  const body = $('#team-body');
  body.replaceChildren();
  derived.team = [];

  state.team.forEach((member, index) => {
    const cells = {
      workingDays: el('td', { class: 'numeric derived' }),
      points: el('td', { class: 'numeric derived' }),
      tickets: el('td', { class: 'numeric derived' }),
    };
    derived.team.push(cells);

    body.append(
      el('tr', {}, [
        el('td', {}, [
          cellInput({
            label: `Name of engineer ${index + 1}`,
            type: 'text',
            value: member.name,
            onCommit: (value) => {
              member.name = value;
              refresh();
            },
          }),
        ]),
        el('td', {}, [
          cellInput({
            label: `Days off for ${member.name}`,
            value: member.daysOff,
            min: 0,
            step: 1,
            onCommit: (value) => {
              member.daysOff = value;
              refresh();
            },
          }),
        ]),
        el('td', {}, [
          cellInput({
            label: `Velocity coefficient for ${member.name}`,
            value: member.velocityCoefficient,
            min: 0,
            step: 0.1,
            onCommit: (value) => {
              member.velocityCoefficient = value;
              refresh();
            },
          }),
        ]),
        cells.workingDays,
        cells.points,
        cells.tickets,
        el('td', {}, [
          el('button', {
            type: 'button',
            class: 'button--row',
            text: 'Remove',
            'aria-label': `Remove ${member.name}`,
            onClick: () => {
              state.team.splice(index, 1);
              buildTables();
              refresh();
              announce(`Removed ${member.name}.`);
            },
          }),
        ]),
      ]),
    );
  });
}

function buildAllocationTables() {
  const plannedBody = $('#planned-body');
  const resultsBody = $('#results-body');
  plannedBody.replaceChildren();
  resultsBody.replaceChildren();
  derived.planned = [];
  derived.results = [];

  state.allocations.forEach((allocation, index) => {
    const plannedCells = {
      ticketCount: el('td', { class: 'numeric derived' }),
      toPlan: el('td', { class: 'numeric' }),
    };
    const resultCells = {
      actualPercentage: el('td', { class: 'numeric derived' }),
      percentageDebt: el('td', { class: 'numeric' }),
      typeLabel: el('th', { scope: 'row', text: allocation.type }),
    };
    derived.planned.push(plannedCells);
    derived.results.push(resultCells);

    plannedBody.append(
      el('tr', {}, [
        el('td', {}, [
          cellInput({
            label: `Name of allocation type ${index + 1}`,
            type: 'text',
            value: allocation.type,
            onCommit: (value) => {
              allocation.type = value;
              resultCells.typeLabel.textContent = value;
              refresh();
            },
          }),
        ]),
        el('td', {}, [
          percentInput({
            label: `Goal percentage for ${allocation.type}`,
            fraction: allocation.goalPercentage,
            onCommit: (value) => {
              allocation.goalPercentage = value;
              refresh();
            },
          }),
        ]),
        el('td', {}, [
          percentInput({
            label: `Owed percentage for ${allocation.type}`,
            fraction: allocation.owedPercentage,
            onCommit: (value) => {
              allocation.owedPercentage = value;
              refresh();
            },
          }),
        ]),
        plannedCells.ticketCount,
        el('td', {}, [
          cellInput({
            label: `Past rollover for ${allocation.type}`,
            value: allocation.pastRollover,
            min: 0,
            step: 1,
            onCommit: (value) => {
              allocation.pastRollover = value;
              refresh();
            },
          }),
        ]),
        plannedCells.toPlan,
        el('td', {}, [
          el('button', {
            type: 'button',
            class: 'button--row',
            text: 'Remove',
            'aria-label': `Remove ${allocation.type}`,
            onClick: () => {
              state.allocations.splice(index, 1);
              buildTables();
              refresh();
              announce(`Removed ${allocation.type}.`);
            },
          }),
        ]),
      ]),
    );

    resultsBody.append(
      el('tr', {}, [
        resultCells.typeLabel,
        el('td', {}, [
          cellInput({
            label: `Tickets completed for ${allocation.type}`,
            value: allocation.completed,
            min: 0,
            step: 1,
            onCommit: (value) => {
              allocation.completed = value;
              refresh();
            },
          }),
        ]),
        resultCells.actualPercentage,
        resultCells.percentageDebt,
        el('td', {}, [
          cellInput({
            label: `Future rollover for ${allocation.type}`,
            value: allocation.futureRollover,
            min: 0,
            step: 1,
            onCommit: (value) => {
              allocation.futureRollover = value;
              refresh();
            },
          }),
        ]),
      ]),
    );
  });
}

function refresh() {
  const capacity = sprintCapacity(state.team, state.config);
  const planned = plannedAllocations(state.allocations, capacity.tickets);
  const results = resultingAllocations(state.allocations, capacity.tickets);
  const issues = issueCounts(state.plannedIssues, state.allocations);

  $('#sprint-summary').textContent = describeSprint();
  $('#total-points').textContent = formatNumber(capacity.points);
  $('#total-tickets').textContent = formatNumber(capacity.tickets);
  $('#team-total-points').textContent = formatNumber(capacity.points);
  $('#team-total-tickets').textContent = formatNumber(capacity.tickets);

  capacity.members.forEach((member, index) => {
    const cells = derived.team[index];
    cells.workingDays.textContent = formatNumber(member.workingDays, 0);
    cells.points.textContent = formatNumber(member.points);
    cells.tickets.textContent = formatRange(member.ticketRange);
  });

  planned.rows.forEach((row, index) => {
    const cells = derived.planned[index];
    cells.ticketCount.textContent = formatNumber(row.ticketCount);
    cells.toPlan.textContent = formatNumber(row.toPlan);
    cells.toPlan.classList.toggle('debt--positive', row.toPlan < 0);
  });

  $('#planned-total-goal').textContent = formatPercent(planned.totals.goalPercentage);
  $('#planned-total-owed').textContent = formatPercent(planned.totals.owedPercentage, 1);
  $('#planned-total-tickets').textContent = formatNumber(planned.totals.ticketCount);
  $('#planned-total-rollover').textContent = formatNumber(planned.totals.pastRollover, 0);
  $('#planned-total-to-plan').textContent = formatNumber(planned.totals.toPlan);

  results.rows.forEach((row, index) => {
    const cells = derived.results[index];
    cells.actualPercentage.textContent = formatPercent(row.actualPercentage, 1);
    cells.percentageDebt.textContent = formatPercent(row.percentageDebt, 1);
    cells.percentageDebt.classList.toggle('debt--positive', (row.percentageDebt ?? 0) > 0.0001);
    cells.percentageDebt.classList.toggle('debt--negative', (row.percentageDebt ?? 0) < -0.0001);
  });

  $('#results-total-completed').textContent = formatNumber(results.totals.completed, 0);
  $('#results-total-actual').textContent = formatPercent(results.totals.actualPercentage);
  $('#results-total-debt').textContent = formatPercent(results.totals.percentageDebt, 1);
  $('#results-total-rollover').textContent = formatNumber(results.totals.futureRollover, 0);

  $('#issues-completed').textContent = formatNumber(issues.completed, 0);
  $('#issues-incomplete').textContent = formatNumber(issues.incomplete, 0);

  showWarnings(warnings(state, capacity, planned));
  save(state);
}

function describeSprint() {
  const { firstDay, lastDay } = state.sprint;
  if (!firstDay || !lastDay) return 'Sprint dates not set';
  const format = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  return `${format(firstDay)} to ${format(lastDay)}`;
}

let announcement = null;

function showWarnings(messages) {
  const container = $('#warnings');
  const all = announcement ? [announcement, ...messages] : messages;
  container.replaceChildren();
  container.hidden = all.length === 0;
  if (all.length === 0) return;
  container.append(
    el('h2', { text: all.length === 1 ? 'Note' : 'Notes' }),
    el('ul', {}, all.map((message) => el('li', { text: message }))),
  );
}

function announce(message) {
  announcement = message;
  refresh();
  announcement = null;
}

function focusLastRow(selector) {
  $(selector).lastElementChild?.querySelector('input')?.focus();
}

main();
