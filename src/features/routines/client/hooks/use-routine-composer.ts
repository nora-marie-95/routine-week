import { useState } from "react";

import type { Rhythm } from "@/domains/routine";
import { useAppStore } from "@/domains/store";

/** New routines start daily, so a rhythm is always set. */
const DEFAULT_RHYTHM: Rhythm = { kind: "daily" };

export const useRoutineComposer = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [rhythm, setRhythm] = useState<Rhythm>(DEFAULT_RHYTHM);
  const createRoutine = useAppStore((state) => {
    return state.routine.create;
  });

  const open = () => {
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
    setTitle("");
    setRhythm(DEFAULT_RHYTHM);
  };
  const submit = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 0) {
      createRoutine({ title: trimmedTitle, rhythm });
    }
    close();
  };

  return {
    visible,
    title,
    onChangeTitle: setTitle,
    rhythm,
    onChangeRhythm: setRhythm,
    open,
    close,
    submit,
  };
};
