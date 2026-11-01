import type { StateCreator } from "zustand";

import type { AppState } from "@/domains/store/types";
import { createId, shiftDateKey } from "@/shared/util";

const DAYS_PER_WEEK = 7;

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
            category: draft.category,
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
      setCategory: (id, category) => {
        set((state) => {
          const routine = state.routines.find((item) => {
            return item.id === id;
          });
          if (routine) {
            routine.category = category;
          }
        });
      },
      toggleSkipWeek: (id, weekStart) => {
        set((state) => {
          const routine = state.routines.find((item) => {
            return item.id === id;
          });
          if (!routine) {
            return;
          }
          const skippedWeeks = routine.skippedWeeks ?? [];
          if (skippedWeeks.includes(weekStart)) {
            routine.skippedWeeks = skippedWeeks.filter((week) => {
              return week !== weekStart;
            });
            return;
          }
          routine.skippedWeeks = [...skippedWeeks, weekStart];
          const weekEnd = shiftDateKey(weekStart, DAYS_PER_WEEK);
          state.todoItems = state.todoItems.filter((todoItem) => {
            const isOpenThatWeek =
              todoItem.routineId === id &&
              !todoItem.done &&
              todoItem.dueDate >= weekStart &&
              todoItem.dueDate < weekEnd;
            return !isOpenThatWeek;
          });
        });
      },
      setWeekRhythm: (id, weekStart, rhythm) => {
        set((state) => {
          const routine = state.routines.find((item) => {
            return item.id === id;
          });
          if (!routine) {
            return;
          }
          const others = Object.entries(routine.rhythmOverrides ?? {}).filter(([week]) => {
            return week !== weekStart;
          });
          routine.rhythmOverrides = Object.fromEntries(
            rhythm ? [...others, [weekStart, rhythm]] : others,
          );
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
      restore: (routine, todoIds) => {
        set((state) => {
          const exists = state.routines.some((item) => {
            return item.id === routine.id;
          });
          if (exists) {
            return;
          }
          state.routines.push(routine);
          state.todoItems.forEach((todoItem) => {
            if (todoIds.includes(todoItem.id)) {
              todoItem.routineId = routine.id;
            }
          });
        });
      },
    },
  };
};
