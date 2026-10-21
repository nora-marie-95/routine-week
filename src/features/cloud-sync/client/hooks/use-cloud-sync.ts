import { useEffect } from "react";

import { useAppStore } from "@/domains/store";
import { startUserSync } from "@/features/cloud-sync/client/start-user-sync";
import { useAccountStore } from "@/features/cloud-sync/client/use-account-store";
import { isFirebaseEnabled, saveUserDocument, watchAuth, watchUserDocument } from "@/lib/firebase";

const FIREBASE_API = { watch: watchUserDocument, save: saveUserDocument };

/** Follows Firebase's sign-in state into the account store; off when Firebase isn't configured. */
const useAuthWatcher = () => {
  const setStatus = useAccountStore((state) => {
    return state.account.setStatus;
  });
  const setUser = useAccountStore((state) => {
    return state.account.setUser;
  });
  useEffect(() => {
    if (!isFirebaseEnabled) {
      setStatus("disabled");
      return undefined;
    }
    return watchAuth(setUser);
  }, [setStatus, setUser]);
};

/** While someone is signed in, keeps their cloud copy and this device's data in step. */
const useSignedInSync = () => {
  const uid = useAccountStore((state) => {
    return state.user?.uid;
  });
  const setSync = useAccountStore((state) => {
    return state.account.setSync;
  });
  useEffect(() => {
    if (uid === undefined) {
      return undefined;
    }
    let stop: (() => void) | undefined;
    const start = () => {
      stop = startUserSync({ uid, api: FIREBASE_API, onSyncChange: setSync });
    };
    /** Syncing before saved data is loaded from the browser would upload an empty state. */
    if (useAppStore.persist.hasHydrated()) {
      start();
      return () => {
        stop?.();
      };
    }
    const stopWaiting = useAppStore.persist.onFinishHydration(start);
    return () => {
      stopWaiting();
      stop?.();
    };
  }, [uid, setSync]);
};

/** Mount once at the root. */
export const useCloudSync = () => {
  useAuthWatcher();
  useSignedInSync();
};
