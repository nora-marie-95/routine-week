import AsyncStorage from "@react-native-async-storage/async-storage";
import { type PersistOptions, createJSONStorage } from "zustand/middleware";

import { type Snapshot, SnapshotSchema, toSnapshot } from "@/domains/store/snapshot";
import type { AppState } from "@/domains/store/types";

/**
 * AsyncStorage backs onto localStorage on web and native storage on iOS/Android, so this
 * persistence config is the only place that would ever need to change between platforms.
 */
export const PERSIST_OPTIONS: PersistOptions<AppState, Snapshot> = {
  name: "routine-week/app-store",
  storage: createJSONStorage(() => {
    return AsyncStorage;
  }),
  partialize: (state) => {
    return toSnapshot(state);
  },
  /** Taking only validated data from storage keeps a stale or corrupt save from replacing actions. */
  merge: (persistedState, currentState) => {
    const parsed = SnapshotSchema.safeParse(persistedState);
    return parsed.success ? { ...currentState, ...parsed.data } : currentState;
  },
};
