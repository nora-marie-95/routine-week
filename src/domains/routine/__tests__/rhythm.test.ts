import { describe, expect, it } from "@jest/globals";

import { formatRhythm } from "@/domains/routine/rhythm";

describe("formatRhythm", () => {
  it("labels every rhythm kind", () => {
    expect(formatRhythm({ kind: "daily" })).toBe("Daily");
    expect(formatRhythm({ kind: "weekly" })).toBe("Weekly");
    expect(formatRhythm({ kind: "biweekly" })).toBe("Every 2 weeks");
    expect(formatRhythm({ kind: "monthly" })).toBe("Monthly");
    expect(formatRhythm({ kind: "timesPerWeek", times: 3 })).toBe("3× a week");
  });
});
