import type { StateCreator } from "zustand";

import type { AppState } from "@/domains/store/types";
import { createId } from "@/shared/util";

type RoutineSlice = Pick<AppState, "routines" | "routine">;

export const createRoutineActions: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  RoutineSlice
> = (set) => {
  return {
    routines: [],
    routine: {
      create: (draft) => {
        set((state) => {
          state.routines.push({
            id: createId(),
            title: draft.title,
            rhythm: draft.rhythm,
            createdAt: Date.now(),
          });
        });
      },
      rename: (id, title) => {
        set((state) => {
          const routine = state.routines.find((item) => {
            return item.id === id;
          });
          if (routine) {
            routine.title = title;
          }
        });
      },
      setRhythm: (id, rhythm) => {
        set((state) => {
          const routine = state.routines.find((item) => {
            return item.id === id;
          });
          if (routine) {
            routine.rhythm = rhythm;
          }
        });
      },
      remove: (id) => {
        set((state) => {
          state.routines = state.routines.filter((item) => {
            return item.id !== id;
          });
          state.todoItems.forEach((todoItem) => {
            if (todoItem.routineId === id) {
              todoItem.routineId = undefined;
            }
          });
        });
      },
    },
  };
};
