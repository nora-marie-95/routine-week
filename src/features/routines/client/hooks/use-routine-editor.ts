import { useState } from "react";

import type { Routine } from "@/domains/routine";
import { useAppStore } from "@/domains/store";

export const useRoutineEditor = (routine: Routine) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(routine.title);
  const renameRoutine = useAppStore((state) => {
    return state.routine.rename;
  });

  /** Re-seeds the field from the stored routine, so a cancelled edit never lingers. */
  const open = () => {
    setTitle(routine.title);
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 0) {
      renameRoutine(routine.id, trimmedTitle);
    }
    close();
  };

  return { visible, title, onChangeTitle: setTitle, open, close, submit };
};
