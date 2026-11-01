import type { PeriodProgress } from "@/domains/routine/progress";
import type { Rhythm, Routine } from "@/domains/routine/types";
import { dateKeyOf } from "@/shared/util";

/** The rhythm that applies to the week starting on the given Monday: its override, else the usual. */
export const rhythmForWeek = (routine: Routine, weekStart: string): Rhythm => {
  return routine.rhythmOverrides?.[weekStart] ?? routine.rhythm;
};

const targetOf = (rhythm: Rhythm) => {
  return rhythm.kind === "timesPerWeek" ? rhythm.times : 1;
};

/** History periods of a week-based routine, re-targeted for the weeks that had their own rhythm. */
export const withWeekRhythms = (routine: Routine, periods: PeriodProgress[]): PeriodProgress[] => {
  const isWeekBased = routine.rhythm.kind === "weekly" || routine.rhythm.kind === "timesPerWeek";
  if (!isWeekBased) {
    return periods;
  }
  return periods.map((period) => {
    const override = routine.rhythmOverrides?.[dateKeyOf(period.start)];
    if (!override) {
      return period;
    }
    const target = targetOf(override);
    return { ...period, target, met: period.done >= target };
  });
};
