import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod/v4";
import { type PersistOptions, createJSONStorage } from "zustand/middleware";

import { RoutineSchema } from "@/domains/routine";
import type { AppState } from "@/domains/store/types";
import { TodoItemSchema } from "@/domains/todo-item";

/** Only data is saved; the action groups (`routine`, `todo`) are code, not state. */
const PersistedStateSchema = z.object({
  routines: z.array(RoutineSchema),
  todoItems: z.array(TodoItemSchema),
});
type PersistedState = z.infer<typeof PersistedStateSchema>;

/**
 * AsyncStorage backs onto localStorage on web and native storage on iOS/Android, so this
 * persistence config is the only place that would ever need to change between platforms.
 */
export const PERSIST_OPTIONS: PersistOptions<AppState, PersistedState> = {
  name: "routine-week/app-store",
  storage: createJSONStorage(() => {
    return AsyncStorage;
  }),
  partialize: (state) => {
    return { routines: state.routines, todoItems: state.todoItems };
  },
  /** Taking only validated data from storage keeps a stale or corrupt save from replacing actions. */
  merge: (persistedState, currentState) => {
    const parsed = PersistedStateSchema.safeParse(persistedState);
    return parsed.success ? { ...currentState, ...parsed.data } : currentState;
  },
};
