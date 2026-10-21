import { beforeEach, describe, expect, it } from "@jest/globals";

import { useAppStore } from "@/domains/store/use-app-store";

const MONDAY = "2026-10-19";
const TUESDAY = "2026-10-20";

const createRoutine = () => {
  useAppStore.getState().routine.create({ title: "Stretch", rhythm: { kind: "daily" } });
  return useAppStore.getState().routines[0].id;
};

beforeEach(() => {
  useAppStore.setState({ routines: [], todoItems: [] });
});

describe("routine actions", () => {
  it("creates a routine with its rhythm", () => {
    useAppStore
      .getState()
      .routine.create({ title: "Run", rhythm: { kind: "timesPerWeek", times: 3 } });

    expect(useAppStore.getState().routines[0]).toMatchObject({
      title: "Run",
      rhythm: { kind: "timesPerWeek", times: 3 },
    });
  });

  it("changes a routine's rhythm", () => {
    const routineId = createRoutine();

    useAppStore.getState().routine.setRhythm(routineId, { kind: "weekly" });

    expect(useAppStore.getState().routines[0].rhythm).toEqual({ kind: "weekly" });
  });

  it("unlinks todos when their routine is removed", () => {
    const routineId = createRoutine();
    useAppStore.getState().todo.create({ title: "Stretch", routineId, dueDate: MONDAY });

    useAppStore.getState().routine.remove(routineId);

    expect(useAppStore.getState().routines).toHaveLength(0);
    expect(useAppStore.getState().todoItems[0].routineId).toBeUndefined();
  });
});

describe("todo actions", () => {
  it("creates a todo on a day", () => {
    useAppStore.getState().todo.create({ title: "Buy groceries", dueDate: MONDAY });

    expect(useAppStore.getState().todoItems[0]).toMatchObject({
      title: "Buy groceries",
      done: false,
      dueDate: MONDAY,
    });
  });

  it("toggles a todo's done state and records when", () => {
    useAppStore.getState().todo.create({ title: "Buy groceries", dueDate: MONDAY });
    const todoId = useAppStore.getState().todoItems[0].id;

    useAppStore.getState().todo.toggle(todoId);
    expect(useAppStore.getState().todoItems[0].done).toBe(true);
    expect(useAppStore.getState().todoItems[0].doneAt).toBeDefined();

    useAppStore.getState().todo.toggle(todoId);
    expect(useAppStore.getState().todoItems[0].done).toBe(false);
    expect(useAppStore.getState().todoItems[0].doneAt).toBeUndefined();
  });

  it("moves a todo to another day", () => {
    useAppStore.getState().todo.create({ title: "Buy groceries", dueDate: MONDAY });
    const todoId = useAppStore.getState().todoItems[0].id;

    useAppStore.getState().todo.schedule(todoId, TUESDAY);

    expect(useAppStore.getState().todoItems[0].dueDate).toBe(TUESDAY);
  });

  it("removes a todo", () => {
    useAppStore.getState().todo.create({ title: "Buy groceries", dueDate: MONDAY });
    const todoId = useAppStore.getState().todoItems[0].id;

    useAppStore.getState().todo.remove(todoId);

    expect(useAppStore.getState().todoItems).toHaveLength(0);
  });
});

describe("toggleRoutineDay", () => {
  it("puts the routine on a day as a linked todo", () => {
    const routineId = createRoutine();

    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);

    expect(useAppStore.getState().todoItems).toHaveLength(1);
    expect(useAppStore.getState().todoItems[0]).toMatchObject({
      title: "Stretch",
      routineId,
      dueDate: MONDAY,
      done: false,
    });
  });

  it("takes an open routine todo off the day again", () => {
    const routineId = createRoutine();
    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);

    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);

    expect(useAppStore.getState().todoItems).toHaveLength(0);
  });

  it("keeps a checked-off routine todo, since progress counts it", () => {
    const routineId = createRoutine();
    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);
    useAppStore.getState().todo.toggle(useAppStore.getState().todoItems[0].id);

    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);

    expect(useAppStore.getState().todoItems).toHaveLength(1);
    expect(useAppStore.getState().todoItems[0].done).toBe(true);
  });

  it("leaves other days alone", () => {
    const routineId = createRoutine();
    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);
    useAppStore.getState().todo.toggleRoutineDay(routineId, TUESDAY);

    useAppStore.getState().todo.toggleRoutineDay(routineId, MONDAY);

    expect(
      useAppStore.getState().todoItems.map((item) => {
        return item.dueDate;
      }),
    ).toEqual([TUESDAY]);
  });
});
