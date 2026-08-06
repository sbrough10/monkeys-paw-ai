/**
 * Local persistence and the seed sprint.
 *
 * Stored state is untrusted: it may be from an older version of the app, or
 * hand-edited. Everything is coerced back into shape on read.
 */

export const STORAGE_KEY = 'sprintCapacityPlanner.v1';

export function defaultState() {
  return {
    config: {
      pointsPerDevDay: 1,
      devDaysPerSprint: 10,
      avgPointsPerTicket: 1.05,
    },
    sprint: {
      firstDay: '2026-08-03',
      lastDay: '2026-08-14',
    },
    team: [
      { name: 'Stephen', daysOff: 0, velocityCoefficient: 0.5 },
      { name: 'Lucas', daysOff: 0, velocityCoefficient: 0.8 },
      { name: 'Lorenzo', daysOff: 5, velocityCoefficient: 0.8 },
      { name: 'Punn', daysOff: 1, velocityCoefficient: 0.8 },
      { name: 'Zaw', daysOff: 1, velocityCoefficient: 0.8 },
      { name: 'Rick', daysOff: 2, velocityCoefficient: 0.8 },
      { name: 'Ewout', daysOff: 10, velocityCoefficient: 0.8 },
    ],
    // Owed percentages are a redistribution of one sprint's shares, so they sum
    // to zero. These reproduce the source spreadsheet's ticket counts exactly.
    allocations: [
      { type: 'Technical Debt', goalPercentage: 0.2, owedPercentage: 0.354, pastRollover: 0, completed: 0, futureRollover: 0 },
      { type: 'Platform Capabilities', goalPercentage: 0.1, owedPercentage: 0.121, pastRollover: 0, completed: 0, futureRollover: 0 },
      { type: 'Features', goalPercentage: 0.7, owedPercentage: -0.475, pastRollover: 11, completed: 0, futureRollover: 0 },
    ],
    plannedIssues: 33,
  };
}

export function load() {
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return defaultState(); // Storage blocked (private mode, disabled cookies).
  }
  if (!raw) return defaultState();
  try {
    return normalise(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function save(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Nothing useful to do: the sprint is still usable in memory.
  }
}

export function clear() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored for the same reason as above.
  }
}

function normalise(stored) {
  const fallback = defaultState();
  if (!stored || typeof stored !== 'object') return fallback;
  return {
    config: {
      pointsPerDevDay: number(stored.config?.pointsPerDevDay, fallback.config.pointsPerDevDay),
      devDaysPerSprint: number(stored.config?.devDaysPerSprint, fallback.config.devDaysPerSprint),
      avgPointsPerTicket: number(stored.config?.avgPointsPerTicket, fallback.config.avgPointsPerTicket),
    },
    sprint: {
      firstDay: text(stored.sprint?.firstDay, fallback.sprint.firstDay),
      lastDay: text(stored.sprint?.lastDay, fallback.sprint.lastDay),
    },
    team: Array.isArray(stored.team) && stored.team.length
      ? stored.team.map((member, index) => ({
          name: text(member?.name, `Engineer ${index + 1}`),
          daysOff: number(member?.daysOff, 0),
          velocityCoefficient: number(member?.velocityCoefficient, 0.8),
        }))
      : fallback.team,
    allocations: Array.isArray(stored.allocations) && stored.allocations.length
      ? stored.allocations.map((allocation, index) => ({
          type: text(allocation?.type, `Type ${index + 1}`),
          goalPercentage: number(allocation?.goalPercentage, 0),
          owedPercentage: number(allocation?.owedPercentage, 0),
          pastRollover: number(allocation?.pastRollover, 0),
          completed: number(allocation?.completed, 0),
          futureRollover: number(allocation?.futureRollover, 0),
        }))
      : fallback.allocations,
    plannedIssues: number(stored.plannedIssues, fallback.plannedIssues),
  };
}

function number(value, fallback) {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function text(value, fallback) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

/**
 * Carry a finished sprint into the next one: this sprint's debt becomes next
 * sprint's owed percentage, and its future rollover becomes past rollover.
 */
export function rollIntoNextSprint(state, results) {
  return {
    ...state,
    allocations: state.allocations.map((allocation, index) => ({
      ...allocation,
      owedPercentage: results.rows[index].percentageDebt ?? 0,
      pastRollover: allocation.futureRollover,
      completed: 0,
      futureRollover: 0,
    })),
    plannedIssues: 0,
  };
}
