import { useState } from "react";

import type { Routine } from "@/domains/routine";
import { useAppStore } from "@/domains/store";

export const useRoutineEditor = (routine: Routine) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(routine.title);
  const [category, setCategory] = useState(routine.category);
  const renameRoutine = useAppStore((state) => {
    return state.routine.rename;
  });
  const setRoutineCategory = useAppStore((state) => {
    return state.routine.setCategory;
  });

  /** Re-seeds the fields from the stored routine, so a cancelled edit never lingers. */
  const open = () => {
    setTitle(routine.title);
    setCategory(routine.category);
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 0) {
      renameRoutine(routine.id, trimmedTitle);
      setRoutineCategory(routine.id, category);
    }
    close();
  };

  return {
    visible,
    title,
    onChangeTitle: setTitle,
    category,
    onChangeCategory: setCategory,
    open,
    close,
    submit,
  };
};
