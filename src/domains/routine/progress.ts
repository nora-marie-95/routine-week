import type { Rhythm } from "@/domains/routine/types";

export type PeriodProgress = {
  /** Inclusive start and exclusive end of the period, as epoch milliseconds. */
  start: number;
  end: number;
  done: number;
  target: number;
  met: boolean;
};

type Params = {
  rhythm: Rhythm;
  createdAt: number;
  /** Epoch milliseconds at which each linked todo was completed. */
  completions: number[];
  at: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;
const DAYS_PER_BIWEEK = 14;
/** getDay() is 0 for Sunday; weeks start on Monday. */
const SUNDAY_OFFSET = 6;

const addDays = (time: number, days: number) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days).getTime();
};

const startOfWeek = (time: number) => {
  const date = new Date(time);
  const daysSinceMonday = (date.getDay() + SUNDAY_OFFSET) % DAYS_PER_WEEK;
  return addDays(time, -daysSinceMonday);
};

const startOfMonth = (time: number) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
};

const addMonths = (time: number, months: number) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth() + months, 1).getTime();
};

/** Biweekly blocks are counted from the Monday of the week the routine was created. */
const periodStart = (rhythm: Rhythm, createdAt: number, at: number) => {
  switch (rhythm.kind) {
    case "daily": {
      return addDays(at, 0);
    }
    case "weekly":
    case "timesPerWeek": {
      return startOfWeek(at);
    }
    case "biweekly": {
      const anchor = startOfWeek(createdAt);
      const daysSinceAnchor = Math.round((startOfWeek(at) - anchor) / DAY_MS);
      return addDays(anchor, Math.floor(daysSinceAnchor / DAYS_PER_BIWEEK) * DAYS_PER_BIWEEK);
    }
    case "monthly": {
      return startOfMonth(at);
    }
  }
};

/** Moves a period start forwards (+1) or backwards (-1) by whole periods. */
const shiftPeriod = (rhythm: Rhythm, start: number, steps: number) => {
  switch (rhythm.kind) {
    case "daily": {
      return addDays(start, steps);
    }
    case "weekly":
    case "timesPerWeek": {
      return addDays(start, steps * DAYS_PER_WEEK);
    }
    case "biweekly": {
      return addDays(start, steps * DAYS_PER_BIWEEK);
    }
    case "monthly": {
      return addMonths(start, steps);
    }
  }
};

const targetFor = (rhythm: Rhythm) => {
  return rhythm.kind === "timesPerWeek" ? rhythm.times : 1;
};

const progressForPeriod = (params: Params, start: number): PeriodProgress => {
  const { rhythm, completions } = params;
  const end = shiftPeriod(rhythm, start, 1);
  const done = completions.filter((completedAt) => {
    return completedAt >= start && completedAt < end;
  }).length;
  const target = targetFor(rhythm);
  return { start, end, done, target, met: done >= target };
};

export const currentProgress = (params: Params) => {
  const { rhythm, createdAt, at } = params;
  return progressForPeriod(params, periodStart(rhythm, createdAt, at));
};

/** Newest first, starting with the current period. */
export const recentProgress = (params: Params, count: number) => {
  const { rhythm, createdAt, at } = params;
  const currentStart = periodStart(rhythm, createdAt, at);
  return Array.from({ length: count }, (_, index) => {
    return progressForPeriod(params, shiftPeriod(rhythm, currentStart, -index));
  });
};

export const periodUnit = (rhythm: Rhythm) => {
  switch (rhythm.kind) {
    case "daily": {
      return "today";
    }
    case "weekly":
    case "timesPerWeek": {
      return "this week";
    }
    case "biweekly": {
      return "these 2 weeks";
    }
    case "monthly": {
      return "this month";
    }
  }
};

const formatDay = (time: number) => {
  return new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatPeriod = (rhythm: Rhythm, period: PeriodProgress) => {
  if (rhythm.kind === "daily") {
    return new Date(period.start).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  if (rhythm.kind === "monthly") {
    return new Date(period.start).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  return `${formatDay(period.start)} – ${formatDay(addDays(period.end, -1))}`;
};
