import { create } from "zustand";

import type { SignedInUser } from "@/lib/firebase";

export type AccountStatus = "disabled" | "loading" | "signedOut" | "signedIn";
export type SyncStatus = "idle" | "saving" | "error";

type AccountState = {
  status: AccountStatus;
  user: SignedInUser | undefined;
  sync: SyncStatus;
  account: {
    setStatus: (status: AccountStatus) => void;
    setUser: (user: SignedInUser | undefined) => void;
    setSync: (sync: SyncStatus) => void;
  };
};

/** Who is signed in and how saving is going. Not persisted — Firebase restores the session itself. */
export const useAccountStore = create<AccountState>()((set) => {
  return {
    status: "loading",
    user: undefined,
    sync: "idle",
    account: {
      setStatus: (status) => {
        set({ status });
      },
      setUser: (user) => {
        set({ user, status: user ? "signedIn" : "signedOut", sync: "idle" });
      },
      setSync: (sync) => {
        set({ sync });
      },
    },
  };
});
