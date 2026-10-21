import { describe, expect, it } from "@jest/globals";

import { formatWeekRange, shiftDateKey, weekDays } from "@/shared/util/date";

describe("weekDays", () => {
  it("starts on Monday and ends on Sunday, whichever day you ask from", () => {
    const fromWednesday = weekDays("2026-10-21");
    const fromSunday = weekDays("2026-10-25");

    expect(
      fromWednesday.map((day) => {
        return day.key;
      }),
    ).toEqual([
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
      "2026-10-23",
      "2026-10-24",
      "2026-10-25",
    ]);
    expect(fromSunday).toEqual(fromWednesday);
    expect(fromWednesday[0].weekday).toBe("Mon");
    expect(fromWednesday[6].weekday).toBe("Sun");
  });

  it("crosses month boundaries", () => {
    const days = weekDays("2026-10-31");

    expect(days[0].key).toBe("2026-10-26");
    expect(days[6].key).toBe("2026-11-01");
  });
});

describe("shiftDateKey", () => {
  it("moves forwards and backwards across a month", () => {
    expect(shiftDateKey("2026-10-31", 1)).toBe("2026-11-01");
    expect(shiftDateKey("2026-11-01", -1)).toBe("2026-10-31");
    expect(shiftDateKey("2026-10-21", 7)).toBe("2026-10-28");
  });
});

describe("formatWeekRange", () => {
  it("shows the first and last day", () => {
    expect(formatWeekRange(weekDays("2026-10-21"))).toBe("Oct 19 – Oct 25");
  });
});
