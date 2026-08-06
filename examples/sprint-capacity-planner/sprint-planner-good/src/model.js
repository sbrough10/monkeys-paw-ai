/**
 * Pure sprint-capacity calculations. No DOM, no storage, no side effects.
 *
 * Percentages are stored as fractions (0.2 === 20%).
 */

/** Working days a member contributes, floored at zero. */
export function workingDays(member, config) {
  return Math.max(0, config.devDaysPerSprint - member.daysOff);
}

/** Expected points for one member: working days x points/day x velocity. */
export function memberPoints(member, config) {
  return workingDays(member, config) * config.pointsPerDevDay * member.velocityCoefficient;
}

/**
 * The whole-ticket range those points can cover. Points rarely divide evenly
 * into tickets, so the honest answer is an interval rather than a single number.
 */
export function ticketRange(points, avgPointsPerTicket) {
  if (!(avgPointsPerTicket > 0)) return { min: 0, max: 0 };
  const exact = points / avgPointsPerTicket;
  return { min: Math.floor(exact), max: Math.ceil(exact) };
}

export function memberCapacity(member, config) {
  const points = memberPoints(member, config);
  return {
    ...member,
    workingDays: workingDays(member, config),
    points,
    ticketRange: ticketRange(points, config.avgPointsPerTicket),
  };
}

export function sprintCapacity(team, config) {
  const members = team.map((member) => memberCapacity(member, config));
  const points = members.reduce((sum, m) => sum + m.points, 0);
  const tickets = config.avgPointsPerTicket > 0 ? points / config.avgPointsPerTicket : 0;
  return { members, points, tickets };
}

/**
 * What to bring into the sprint per allocation type.
 *
 * `owedPercentage` is last sprint's percentage debt for the type, so the share
 * of this sprint is goal + owed. Tickets already carried over (`pastRollover`)
 * are subtracted to get the number of *new* tickets to pull in.
 */
export function plannedAllocations(allocations, expectedTickets) {
  const rows = allocations.map((allocation) => {
    const share = allocation.goalPercentage + allocation.owedPercentage;
    const ticketCount = share * expectedTickets;
    return {
      ...allocation,
      share,
      ticketCount,
      toPlan: ticketCount - allocation.pastRollover,
    };
  });
  return { rows, totals: totalsRow(rows) };
}

/**
 * What actually happened, and the debt it creates for next sprint.
 *
 * percentageDebt = (goal + owed) - actual
 *
 * The share owed this sprint minus the share delivered. Positive means the type
 * was under-served and is owed time next sprint; negative means it was
 * over-served and gets throttled. Actual share is undefined until something is
 * completed, so both figures are null on an empty sprint rather than NaN.
 */
export function resultingAllocations(allocations, expectedTickets) {
  const totalCompleted = allocations.reduce((sum, a) => sum + a.completed, 0);
  const rows = allocations.map((allocation) => {
    const share = allocation.goalPercentage + allocation.owedPercentage;
    const actualPercentage = totalCompleted > 0 ? allocation.completed / totalCompleted : null;
    return {
      ...allocation,
      share,
      actualPercentage,
      percentageDebt: actualPercentage === null ? null : share - actualPercentage,
    };
  });
  return {
    rows,
    totals: {
      completed: totalCompleted,
      actualPercentage: totalCompleted > 0 ? 1 : null,
      percentageDebt: totalCompleted > 0 ? sum(rows, 'percentageDebt') : null,
      futureRollover: sum(rows, 'futureRollover'),
      expectedTickets,
    },
  };
}

/** Planned is entered by hand; completed rolls up from the results table. */
export function issueCounts(planned, allocations) {
  const completed = allocations.reduce((sum, a) => sum + a.completed, 0);
  return { planned, completed, incomplete: planned - completed };
}

/**
 * Problems worth surfacing to the planner. None of these are fatal - a sprint
 * can legitimately be mid-edit - so they are warnings rather than errors.
 */
export function warnings(state, capacity, planned) {
  const found = [];
  const goalSum = state.allocations.reduce((sum, a) => sum + a.goalPercentage, 0);
  if (Math.abs(goalSum - 1) > 0.0001) {
    found.push(`Goal percentages add up to ${formatPercent(goalSum)}, not 100%.`);
  }
  // Debt only ever moves share between types, so it nets to zero. A non-zero
  // total means a figure was mistyped or rounded on the way in.
  const owedSum = state.allocations.reduce((sum, a) => sum + a.owedPercentage, 0);
  if (Math.abs(owedSum) > 0.0001) {
    found.push(
      `Owed percentages add up to ${formatPercent(owedSum, 1)} rather than 0%, so the sprint is ` +
        `${owedSum > 0 ? 'over' : 'under'}-subscribed by ${formatPercent(Math.abs(owedSum), 1)}. ` +
        'Debt redistributes share between types, so it should net out.',
    );
  }
  for (const row of planned.rows) {
    if (row.toPlan < 0) {
      found.push(
        `${row.type} is over-committed: ${row.pastRollover} tickets already carried over ` +
          `exceed its ${round(row.ticketCount, 1)}-ticket share.`,
      );
    }
  }
  if (capacity.points === 0) {
    found.push('Nobody has any capacity this sprint. Check days off and velocity coefficients.');
  }
  if (state.sprint.firstDay && state.sprint.lastDay && state.sprint.lastDay < state.sprint.firstDay) {
    found.push('The sprint ends before it starts.');
  }
  return found;
}

function totalsRow(rows) {
  return {
    goalPercentage: sum(rows, 'goalPercentage'),
    owedPercentage: sum(rows, 'owedPercentage'),
    ticketCount: sum(rows, 'ticketCount'),
    pastRollover: sum(rows, 'pastRollover'),
    toPlan: sum(rows, 'toPlan'),
  };
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + (row[key] ?? 0), 0);
}

export function round(value, places = 0) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function formatPercent(fraction, places = 0) {
  if (fraction === null || fraction === undefined || Number.isNaN(fraction)) return '--';
  return `${round(fraction * 100, places)}%`;
}

export function formatNumber(value, places = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return '--';
  return String(round(value, places));
}

export function formatRange(range) {
  return range.min === range.max ? String(range.min) : `${range.min}-${range.max}`;
}
