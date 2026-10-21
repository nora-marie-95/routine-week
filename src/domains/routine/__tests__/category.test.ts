import { describe, expect, it } from "@jest/globals";

import { categoryNames, groupRoutines, resolveCategory } from "@/domains/routine/category";
import type { Routine } from "@/domains/routine/types";

const routine = (id: string, category?: string): Routine => {
  return { id, title: id, rhythm: { kind: "daily" }, category, createdAt: 1 };
};

const ROUTINES = [
  routine("dishes", "Chores"),
  routine("serum", "Skin care"),
  routine("read"),
  routine("laundry", "Chores"),
];

describe("categoryNames", () => {
  it("lists each category once, alphabetically", () => {
    expect(categoryNames(ROUTINES)).toEqual(["Chores", "Skin care"]);
  });
});

describe("resolveCategory", () => {
  it("treats blank input as no category", () => {
    expect(resolveCategory("   ", ["Chores"])).toBeUndefined();
  });

  it("reuses an existing spelling that only differs in case", () => {
    expect(resolveCategory(" chores ", ["Chores"])).toBe("Chores");
  });

  it("keeps a new name as typed, trimmed", () => {
    expect(resolveCategory(" Garden ", ["Chores"])).toBe("Garden");
  });
});

describe("groupRoutines", () => {
  it("groups by category with uncategorised routines last", () => {
    const groups = groupRoutines(ROUTINES);

    expect(
      groups.map((group) => {
        return group.title;
      }),
    ).toEqual(["Chores", "Skin care", undefined]);
    expect(
      groups[0].data.map((item) => {
        return item.id;
      }),
    ).toEqual(["dishes", "laundry"]);
    expect(
      groups[2].data.map((item) => {
        return item.id;
      }),
    ).toEqual(["read"]);
  });

  it("returns a single untitled group when nothing is categorised", () => {
    const groups = groupRoutines([routine("a"), routine("b")]);

    expect(groups).toHaveLength(1);
    expect(groups[0].title).toBeUndefined();
  });
});
