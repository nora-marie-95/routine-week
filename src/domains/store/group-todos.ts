import { type Routine, categoryNames } from "@/domains/routine";
import { type TodoItem, sortTodoItems } from "@/domains/todo-item";

export type TodoGroup = {
  /** Undefined for todos whose routine has no category, or that have no routine. */
  title: string | undefined;
  data: TodoItem[];
};

/**
 * Groups todos by their routine's category — alphabetical, uncategorised last. Inside a group
 * open todos come first, then done ones.
 */
export const groupTodoItems = (todoItems: TodoItem[], routines: Routine[]): TodoGroup[] => {
  const categoryOf = (todoItem: TodoItem) => {
    return routines.find((routine) => {
      return routine.id === todoItem.routineId;
    })?.category;
  };
  const groups: TodoGroup[] = categoryNames(routines)
    .map((name) => {
      return {
        title: name,
        data: sortTodoItems(
          todoItems.filter((todoItem) => {
            return categoryOf(todoItem) === name;
          }),
        ),
      };
    })
    .filter((group) => {
      return group.data.length > 0;
    });
  const uncategorised = todoItems.filter((todoItem) => {
    return categoryOf(todoItem) === undefined;
  });
  return uncategorised.length > 0
    ? [...groups, { title: undefined, data: sortTodoItems(uncategorised) }]
    : groups;
};
