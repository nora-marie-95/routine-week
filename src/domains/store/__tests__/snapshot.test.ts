import { describe, expect, it } from "@jest/globals";

import {
  type Snapshot,
  mergeSnapshots,
  parseSnapshot,
  serializeSnapshot,
} from "@/domains/store/snapshot";

const routine = (id: string, title = id) => {
  return { id, title, rhythm: { kind: "daily" as const }, createdAt: 1 };
};

const todo = (id: string, title = id) => {
  return { id, title, done: false, dueDate: "2026-10-21", createdAt: 1 };
};

describe("serializeSnapshot / parseSnapshot", () => {
  it("round-trips saved data and drops anything that isn't data", () => {
    const snapshot: Snapshot = { routines: [routine("r1")], todoItems: [todo("t1")] };
    const withActions = {
      ...snapshot,
      todo: {
        create: () => {
          return undefined;
        },
      },
    };

    expect(parseSnapshot(serializeSnapshot(withActions))).toEqual(snapshot);
    expect(serializeSnapshot(withActions)).not.toContain('"todo"');
  });

  it("rejects invalid JSON and invalid data", () => {
    expect(parseSnapshot("not json")).toBeUndefined();
    expect(parseSnapshot(JSON.stringify({ routines: [{ id: 1 }], todoItems: [] }))).toBeUndefined();
  });
});

describe("mergeSnapshots", () => {
  it("keeps everything from both sides", () => {
    const local: Snapshot = { routines: [routine("a")], todoItems: [todo("t1")] };
    const remote: Snapshot = { routines: [routine("b")], todoItems: [todo("t2")] };

    const merged = mergeSnapshots(local, remote);

    expect(
      merged.routines
        .map((item) => {
          return item.id;
        })
        .sort(),
    ).toEqual(["a", "b"]);
    expect(
      merged.todoItems
        .map((item) => {
          return item.id;
        })
        .sort(),
    ).toEqual(["t1", "t2"]);
  });

  it("prefers this device's version of an item both sides have", () => {
    const local: Snapshot = { routines: [routine("a", "Local title")], todoItems: [] };
    const remote: Snapshot = { routines: [routine("a", "Remote title")], todoItems: [] };

    const merged = mergeSnapshots(local, remote);

    expect(merged.routines).toHaveLength(1);
    expect(merged.routines[0].title).toBe("Local title");
  });
});
