import { useState } from "react";

import { useAppStore } from "@/domains/store";
import { todayKey } from "@/shared/util";

export const useTodoComposer = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [routineId, setRoutineId] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState(todayKey);
  const createTodoItem = useAppStore((state) => {
    return state.todo.create;
  });

  /** Opens the sheet with the given day pre-selected; the Today tab passes today. */
  const openOn = (day: string) => {
    setRoutineId(undefined);
    setDueDate(day);
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
    setTitle("");
  };
  const submit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 0) {
      createTodoItem({ title: trimmedTitle, routineId, dueDate });
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
    openOn,
    close,
    submit,
  };
};
