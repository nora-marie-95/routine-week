import type { Routine } from "@/domains/routine/types";

/** Whether the routine is crossed out for the week starting on the given Monday ("YYYY-MM-DD"). */
export const isWeekSkipped = (routine: Routine, weekStart: string) => {
  return routine.skippedWeeks?.includes(weekStart) ?? false;
};
