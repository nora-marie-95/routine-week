import { useState } from "react";

import { useAppStore } from "@/domains/store";
import type { TodoItem } from "@/domains/todo-item";

export const useTodoEditor = (todoItem: TodoItem) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(todoItem.title);
  const [routineId, setRoutineId] = useState(todoItem.routineId);
  const [dueDate, setDueDate] = useState(todoItem.dueDate);
  const renameTodo = useAppStore((state) => {
    return state.todo.rename;
  });
  const linkTodo = useAppStore((state) => {
    return state.todo.link;
  });
  const scheduleTodo = useAppStore((state) => {
    return state.todo.schedule;
  });

  /** Re-seeds the fields from the stored todo, so a cancelled edit never lingers. */
  const open = () => {
    setTitle(todoItem.title);
    setRoutineId(todoItem.routineId);
    setDueDate(todoItem.dueDate);
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 0) {
      renameTodo(todoItem.id, trimmedTitle);
      linkTodo(todoItem.id, routineId);
      scheduleTodo(todoItem.id, dueDate);
    }
    close();
  };

  return {
    visible,
    title,
    onChangeTitle: setTitle,
    routineId,
    onChangeRoutineId: setRoutineId,
    dueDate,
    onChangeDueDate: setDueDate,
    open,
    close,
    submit,
  };
};
