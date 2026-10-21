import { describe, expect, it } from "@jest/globals";

import type { Routine } from "@/domains/routine";
import { groupTodoItems } from "@/domains/store/group-todos";
import type { TodoItem } from "@/domains/todo-item";

const routine = (id: string, category?: string): Routine => {
  return { id, title: id, rhythm: { kind: "daily" }, category, createdAt: 1 };
};

const todo = (id: string, routineId?: string, done = false, createdAt = 1): TodoItem => {
  return { id, title: id, done, routineId, dueDate: "2026-10-21", createdAt };
};

const ROUTINES = [routine("dishes", "Chores"), routine("serum", "Skin care"), routine("read")];

describe("groupTodoItems", () => {
  it("groups by the routine's category, uncategorised last", () => {
    const groups = groupTodoItems(
      [todo("a", "serum"), todo("b"), todo("c", "dishes"), todo("d", "read")],
      ROUTINES,
    );

    expect(
      groups.map((group) => {
        return group.title;
      }),
    ).toEqual(["Chores", "Skin care", undefined]);
    expect(
      groups[2].data.map((item) => {
        return item.id;
      }),
    ).toEqual(["b", "d"]);
  });

  it("skips categories with no todos", () => {
    const groups = groupTodoItems([todo("a", "dishes")], ROUTINES);

    expect(
      groups.map((group) => {
        return group.title;
      }),
    ).toEqual(["Chores"]);
  });

  it("puts done todos after open ones inside their own group", () => {
    const groups = groupTodoItems(
      [todo("done", "dishes", true, 1), todo("open", "dishes", false, 2)],
      ROUTINES,
    );

    expect(
      groups[0].data.map((item) => {
        return item.id;
      }),
    ).toEqual(["open", "done"]);
  });

  it("returns one untitled group when nothing has a category", () => {
    const groups = groupTodoItems([todo("a"), todo("b", "read")], ROUTINES);

    expect(groups).toHaveLength(1);
    expect(groups[0].title).toBeUndefined();
  });
});
