import { z } from "zod/v4";

import { RoutineSchema } from "@/domains/routine";
import { TodoItemSchema } from "@/domains/todo-item";

/** The saved data only — the action groups (`routine`, `todo`) are code, not state. */
export const SnapshotSchema = z.object({
  routines: z.array(RoutineSchema),
  todoItems: z.array(TodoItemSchema),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

export const toSnapshot = (state: Snapshot): Snapshot => {
  return { routines: state.routines, todoItems: state.todoItems };
};

export const serializeSnapshot = (snapshot: Snapshot) => {
  return JSON.stringify(toSnapshot(snapshot));
};

/** Undefined for anything that isn't valid saved data, so a bad document never replaces good state. */
export const parseSnapshot = (json: string) => {
  try {
    const parsed = SnapshotSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
};

const mergeById = <Item extends { id: string }>(remote: Item[], local: Item[]) => {
  const localIds = new Set(
    local.map((item) => {
      return item.id;
    }),
  );
  const remoteOnly = remote.filter((item) => {
    return !localIds.has(item.id);
  });
  return [...remoteOnly, ...local];
};

/**
 * Used once when a device signs in: everything from both sides is kept. If the same item exists
 * on both, this device's version wins — it's the one being actively used.
 */
export const mergeSnapshots = (local: Snapshot, remote: Snapshot): Snapshot => {
  return {
    routines: mergeById(remote.routines, local.routines),
    todoItems: mergeById(remote.todoItems, local.todoItems),
  };
};
