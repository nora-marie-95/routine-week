import type { StateCreator } from "zustand";

import type { AppState } from "@/domains/store/types";
import { createId } from "@/shared/util";

type TodoSlice = Pick<AppState, "todoItems" | "todo">;

export const createTodoActions: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  TodoSlice
> = (set) => {
  return {
    todoItems: [],
    todo: {
      create: (draft) => {
        set((state) => {
          state.todoItems.push({
            id: createId(),
            title: draft.title,
            done: false,
            routineId: draft.routineId,
            dueDate: draft.dueDate,
            createdAt: Date.now(),
          });
        });
      },
      toggle: (id) => {
        set((state) => {
          const todoItem = state.todoItems.find((item) => {
            return item.id === id;
          });
          if (todoItem) {
            todoItem.done = !todoItem.done;
            todoItem.doneAt = todoItem.done ? Date.now() : undefined;
          }
        });
      },
      rename: (id, title) => {
        set((state) => {
          const todoItem = state.todoItems.find((item) => {
            return item.id === id;
          });
          if (todoItem) {
            todoItem.title = title;
          }
        });
      },
      remove: (id) => {
        set((state) => {
          state.todoItems = state.todoItems.filter((item) => {
            return item.id !== id;
          });
        });
      },
      restore: (todoItem) => {
        set((state) => {
          const exists = state.todoItems.some((item) => {
            return item.id === todoItem.id;
          });
          if (!exists) {
            state.todoItems.push(todoItem);
          }
        });
      },
      link: (id, routineId) => {
        set((state) => {
          const todoItem = state.todoItems.find((item) => {
            return item.id === id;
          });
          if (todoItem) {
            todoItem.routineId = routineId;
          }
        });
      },
      schedule: (id, dueDate) => {
        set((state) => {
          const todoItem = state.todoItems.find((item) => {
            return item.id === id;
          });
          if (todoItem) {
            todoItem.dueDate = dueDate;
          }
        });
      },
      toggleRoutineDay: (routineId, dueDate) => {
        set((state) => {
          const routine = state.routines.find((item) => {
            return item.id === routineId;
          });
          const onThatDay = state.todoItems.filter((item) => {
            return item.routineId === routineId && item.dueDate === dueDate;
          });
          if (!routine) {
            return;
          }
          if (onThatDay.length === 0) {
            state.todoItems.push({
              id: createId(),
              title: routine.title,
              done: false,
              routineId,
              dueDate,
              createdAt: Date.now(),
            });
            return;
          }
          // A checked-off todo is history that routine progress counts — only open ones come off.
          state.todoItems = state.todoItems.filter((item) => {
            const isOpenOnThatDay =
              item.routineId === routineId && item.dueDate === dueDate && !item.done;
            return !isOpenOnThatDay;
          });
        });
      },
    },
  };
};
