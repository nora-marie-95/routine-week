import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/client";

export type SignedInUser = {
  uid: string;
  name: string | null;
  email: string | null;
};

/** Calls back with the user on sign-in and with undefined on sign-out; returns an unsubscribe. */
export const watchAuth = (onChange: (user: SignedInUser | undefined) => void) => {
  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    onChange(user ? { uid: user.uid, name: user.displayName, email: user.email } : undefined);
  });
};

export const signInWithGoogle = async () => {
  await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
};

export const signOutUser = async () => {
  await signOut(getFirebaseAuth());
};
