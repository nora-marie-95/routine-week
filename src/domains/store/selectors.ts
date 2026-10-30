import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/domains/store/use-app-store";
import { dateKeyToTime } from "@/shared/util";

export const useRoutines = () => {
  return useAppStore(
    useShallow((state) => {
      return state.routines;
    }),
  );
};

export const useRoutine = (id: string | undefined) => {
  return useAppStore((state) => {
    return state.routines.find((item) => {
      return item.id === id;
    });
  });
};

/** Due today, plus anything earlier that's still open — so a missed day doesn't silently vanish. */
export const useTodayTodoItems = (today: string) => {
  return useAppStore(
    useShallow((state) => {
      return state.todoItems.filter((item) => {
        return item.dueDate === today || (item.dueDate < today && !item.done);
      });
    }),
  );
};

export const useTodoItemsForDay = (dueDate: string) => {
  return useAppStore(
    useShallow((state) => {
      return state.todoItems.filter((item) => {
        return item.dueDate === dueDate;
      });
    }),
  );
};

/** Days (as "YYYY-MM-DD") on which the routine has a todo — drives the day chips. */
export const useRoutineDays = (routineId: string) => {
  return useAppStore(
    useShallow((state) => {
      return state.todoItems
        .filter((item) => {
          return item.routineId === routineId;
        })
        .map((item) => {
          return item.dueDate;
        });
    }),
  );
};

/**
 * The planned days of the routine's checked-off todos — the raw input for rhythm progress.
 * Counted by the day a todo was planned for, so ticking off an old or future todo doesn't
 * inflate the current period.
 */
export const useRoutineCompletions = (routineId: string) => {
  return useAppStore(
    useShallow((state) => {
      return state.todoItems.flatMap((item) => {
        const isCompletion = item.routineId === routineId && item.done;
        return isCompletion ? [dateKeyToTime(item.dueDate)] : [];
      });
    }),
  );
};
