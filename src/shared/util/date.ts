export type WeekDay = {
  /** "YYYY-MM-DD" */
  key: string;
  /** "Mon" */
  weekday: string;
  dayOfMonth: number;
};

const DATE_KEY_PAD = 2;
const DAYS_PER_WEEK = 7;
/** getDay() is 0 for Sunday; weeks start on Monday. */
const SUNDAY_OFFSET = 6;

/** A local calendar day as "YYYY-MM-DD" — sorts and compares correctly as a plain string. */
const dateKey = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(DATE_KEY_PAD, "0");
  const day = String(date.getDate()).padStart(DATE_KEY_PAD, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const todayKey = () => {
  return dateKey(new Date());
};

const parseDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const shiftDateKey = (key: string, days: number) => {
  const date = parseDateKey(key);
  return dateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
};

const weekdayName = (key: string) => {
  return parseDateKey(key).toLocaleDateString("en-US", { weekday: "short" });
};

/** The seven days (Monday first) of the week that contains `key`. */
export const weekDays = (key: string): WeekDay[] => {
  const daysSinceMonday = (parseDateKey(key).getDay() + SUNDAY_OFFSET) % DAYS_PER_WEEK;
  const monday = shiftDateKey(key, -daysSinceMonday);
  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => {
    const dayKey = shiftDateKey(monday, index);
    return {
      key: dayKey,
      weekday: weekdayName(dayKey),
      dayOfMonth: parseDateKey(dayKey).getDate(),
    };
  });
};

const formatShortDate = (key: string) => {
  return parseDateKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/** "Oct 19 – Oct 25" */
export const formatWeekRange = (days: WeekDay[]) => {
  return `${formatShortDate(days[0].key)} – ${formatShortDate(days[DAYS_PER_WEEK - 1].key)}`;
};
