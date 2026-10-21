import { describe, expect, it } from "@jest/globals";

import { currentProgress, recentProgress } from "@/domains/routine/progress";

/** Wednesday, 21 Oct 2026, local time. */
const WEDNESDAY = new Date(2026, 9, 21, 12).getTime();
const MONDAY_BEFORE = new Date(2026, 9, 19, 9).getTime();
const SUNDAY_BEFORE = new Date(2026, 9, 18, 20).getTime();
const CREATED_AT = new Date(2026, 8, 1).getTime();

describe("currentProgress", () => {
  it("counts weekly completions since Monday", () => {
    const result = currentProgress({
      rhythm: { kind: "weekly" },
      createdAt: CREATED_AT,
      completions: [MONDAY_BEFORE, SUNDAY_BEFORE],
      at: WEDNESDAY,
    });

    expect(result).toMatchObject({ done: 1, target: 1, met: true });
  });

  it("tracks x times a week against its target", () => {
    const result = currentProgress({
      rhythm: { kind: "timesPerWeek", times: 3 },
      createdAt: CREATED_AT,
      completions: [MONDAY_BEFORE, WEDNESDAY],
      at: WEDNESDAY,
    });

    expect(result).toMatchObject({ done: 2, target: 3, met: false });
  });

  it("only counts completions from today for a daily routine", () => {
    const result = currentProgress({
      rhythm: { kind: "daily" },
      createdAt: CREATED_AT,
      completions: [MONDAY_BEFORE],
      at: WEDNESDAY,
    });

    expect(result).toMatchObject({ done: 0, met: false });
  });

  it("counts a calendar month for monthly routines", () => {
    const result = currentProgress({
      rhythm: { kind: "monthly" },
      createdAt: CREATED_AT,
      completions: [new Date(2026, 9, 1).getTime()],
      at: WEDNESDAY,
    });

    expect(result.met).toBe(true);
  });

  it("uses fixed two-week blocks anchored on the creation week", () => {
    // Created Tue 1 Sep 2026 → blocks start Mon 31 Aug, 14 Sep, 28 Sep, 12 Oct, 26 Oct.
    const result = currentProgress({
      rhythm: { kind: "biweekly" },
      createdAt: CREATED_AT,
      completions: [],
      at: WEDNESDAY,
    });

    expect(new Date(result.start).getDate()).toBe(12);
    expect(new Date(result.end).getDate()).toBe(26);
  });
});

describe("recentProgress", () => {
  it("lists periods newest first, ending with earlier weeks", () => {
    const result = recentProgress(
      {
        rhythm: { kind: "weekly" },
        createdAt: CREATED_AT,
        completions: [SUNDAY_BEFORE],
        at: WEDNESDAY,
      },
      3,
    );

    expect(
      result.map((period) => {
        return period.met;
      }),
    ).toEqual([false, true, false]);
  });
});
