import type { TodoItem } from "@/domains/todo-item/types";

/** Open todos first, each group in the order they were added. */
export const sortTodoItems = (todoItems: TodoItem[]) => {
  return [...todoItems].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    return a.createdAt - b.createdAt;
  });
};
