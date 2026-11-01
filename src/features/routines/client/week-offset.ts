import { type WeekDay, shiftDateKey, todayKey, weekDays } from "@/shared/util";

const DAYS_PER_WEEK = 7;

/** The seven days (Monday first) of the current week, or of a later one by `weekOffset` weeks. */
export const daysOfWeek = (weekOffset: number): WeekDay[] => {
  return weekDays(shiftDateKey(todayKey(), weekOffset * DAYS_PER_WEEK));
};

/** The Monday ("YYYY-MM-DD") that starts that week. */
export const weekStartOf = (weekOffset: number) => {
  return daysOfWeek(weekOffset)[0].key;
};
