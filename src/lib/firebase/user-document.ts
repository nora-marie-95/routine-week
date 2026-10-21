import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { getFirebaseDb } from "@/lib/firebase/client";

export type UserDocument = {
  /** The app's whole saved state as a JSON string; undefined while the user has none yet. */
  data: string | undefined;
  /** True while the snapshot only reflects a write this device made and hasn't had confirmed. */
  isLocalEcho: boolean;
};

const userDocument = (uid: string) => {
  return doc(getFirebaseDb(), "users", uid);
};

/** Live view of the signed-in user's one document; returns an unsubscribe. */
export const watchUserDocument = (
  uid: string,
  onChange: (document: UserDocument) => void,
  onError: (error: Error) => void,
) => {
  return onSnapshot(
    userDocument(uid),
    (snapshot) => {
      const data: unknown = snapshot.data()?.data;
      onChange({
        data: typeof data === "string" ? data : undefined,
        isLocalEcho: snapshot.metadata.hasPendingWrites,
      });
    },
    onError,
  );
};

export const saveUserDocument = async (uid: string, data: string) => {
  await setDoc(userDocument(uid), { data, updatedAt: Date.now() });
};
