import { create } from "zustand";

export type PendingUndo = {
  /** Distinguishes consecutive deletions, so the toast's timer restarts for each. */
  key: number;
  message: string;
  undo: () => void;
};

type UndoState = {
  pending: PendingUndo | undefined;
  offer: (message: string, undo: () => void) => void;
  dismiss: () => void;
};

let nextKey = 0;

/** At most one undo is offered at a time: deleting again replaces the previous offer. */
export const useUndoStore = create<UndoState>((set) => {
  return {
    pending: undefined,
    offer: (message, undo) => {
      nextKey += 1;
      set({ pending: { key: nextKey, message, undo } });
    },
    dismiss: () => {
      set({ pending: undefined });
    },
  };
});
