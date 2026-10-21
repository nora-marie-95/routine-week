import {
  type Snapshot,
  mergeSnapshots,
  parseSnapshot,
  serializeSnapshot,
  toSnapshot,
  useAppStore,
} from "@/domains/store";
import type { SyncStatus } from "@/features/cloud-sync/client/use-account-store";

type UserDocument = {
  data: string | undefined;
  isLocalEcho: boolean;
};

/** What the sync needs from the cloud; injected so it can be tested without Firebase. */
export type SyncApi = {
  watch: (
    uid: string,
    onChange: (document: UserDocument) => void,
    onError: (error: Error) => void,
  ) => () => void;
  save: (uid: string, data: string) => Promise<void>;
};

type Params = {
  uid: string;
  api: SyncApi;
  onSyncChange: (sync: SyncStatus) => void;
};

/** Waits for edits to settle so a burst of taps is one write, not many. */
export const SAVE_DELAY_MS = 800;

/**
 * Keeps the app state and the signed-in user's cloud copy in step. The first snapshot after
 * sign-in merges both sides; from then on, edits here are saved after a short pause and edits
 * from another device replace this state (the latest save wins). Returns a function that stops it.
 */
export const startUserSync = (params: Params) => {
  const { uid, api, onSyncChange } = params;
  /** The serialized state known to match the cloud copy — what makes echoes and no-ops cheap. */
  let lastSynced: string | undefined;
  let isReady = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const currentJson = () => {
    return serializeSnapshot(useAppStore.getState());
  };

  const save = () => {
    timer = undefined;
    const json = currentJson();
    if (json === lastSynced) {
      onSyncChange("idle");
      return;
    }
    lastSynced = json;
    onSyncChange("saving");
    api
      .save(uid, json)
      .then(() => {
        onSyncChange("idle");
      })
      .catch(() => {
        // Forget it was synced, so the next edit (or sign-in) tries again.
        lastSynced = undefined;
        onSyncChange("error");
      });
  };

  const scheduleSave = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(save, SAVE_DELAY_MS);
  };

  const applyRemote = (json: string, remote: Snapshot) => {
    lastSynced = json;
    useAppStore.setState(remote);
  };

  const onDocument = (document: UserDocument) => {
    if (document.isLocalEcho) {
      return;
    }
    const remote = document.data === undefined ? undefined : parseSnapshot(document.data);
    if (document.data !== undefined && remote === undefined) {
      // Unreadable cloud data: never overwrite it with local state.
      onSyncChange("error");
      return;
    }
    if (!isReady) {
      isReady = true;
      if (remote) {
        const merged = mergeSnapshots(toSnapshot(useAppStore.getState()), remote);
        lastSynced = serializeSnapshot(remote);
        useAppStore.setState(merged);
      }
      scheduleSave();
      return;
    }
    if (remote === undefined || timer !== undefined) {
      // Nothing to apply, or a local edit is about to be saved and will win.
      return;
    }
    const remoteJson = serializeSnapshot(remote);
    if (remoteJson !== currentJson()) {
      applyRemote(remoteJson, remote);
    }
    lastSynced = remoteJson;
  };

  const onError = () => {
    onSyncChange("error");
  };

  const stopWatching = api.watch(uid, onDocument, onError);
  const stopListening = useAppStore.subscribe(() => {
    if (isReady && currentJson() !== lastSynced) {
      scheduleSave();
    }
  });

  return () => {
    stopWatching();
    stopListening();
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  };
};
