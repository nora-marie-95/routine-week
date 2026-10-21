import { describe, expect, it } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppStore } from "@/domains/store/use-app-store";

/** The action groups were once serialized too, as empty objects — they must never win. */
const PERSISTED_STATE_WITH_ACTIONS = {
  state: {
    routines: [{ id: "r1", title: "Stretch", rhythm: { kind: "daily" }, createdAt: 1 }],
    todoItems: [],
    routine: {},
    todo: {},
  },
  version: 0,
};

describe("persistence", () => {
  it("keeps the actions working after rehydrating saved data", async () => {
    await AsyncStorage.setItem(
      "routine-week/app-store",
      JSON.stringify(PERSISTED_STATE_WITH_ACTIONS),
    );

    await useAppStore.persist.rehydrate();

    expect(useAppStore.getState().routines).toHaveLength(1);
    expect(typeof useAppStore.getState().todo.create).toBe("function");
    expect(typeof useAppStore.getState().routine.create).toBe("function");
  });

  it("persists only data, never the action groups", async () => {
    useAppStore.setState({ routines: [], todoItems: [] });
    useAppStore.getState().todo.create({ title: "Buy groceries", dueDate: "2026-10-19" });

    const saved = await AsyncStorage.getItem("routine-week/app-store");

    expect(JSON.parse(saved ?? "{}").state).not.toHaveProperty("todo");
  });
});
