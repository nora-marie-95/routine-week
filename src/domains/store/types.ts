import type { Rhythm, Routine, RoutineDraft } from "@/domains/routine";
import type { TodoDraft, TodoItem } from "@/domains/todo-item";

export type AppState = {
  routines: Routine[];
  todoItems: TodoItem[];
  routine: {
    create: (draft: RoutineDraft) => void;
    rename: (id: string, title: string) => void;
    setRhythm: (id: string, rhythm: Rhythm) => void;
    remove: (id: string) => void;
  };
  todo: {
    create: (draft: TodoDraft) => void;
    toggle: (id: string) => void;
    rename: (id: string, title: string) => void;
    remove: (id: string) => void;
    link: (id: string, routineId: string | undefined) => void;
    schedule: (id: string, dueDate: string) => void;
    /** Puts a routine on a day, or takes it off again if it's already there and still open. */
    toggleRoutineDay: (routineId: string, dueDate: string) => void;
  };
};
