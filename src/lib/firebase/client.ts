import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getFirebaseConfig } from "@/lib/firebase/config";

/** Created on first use, so a build without Firebase config never touches the SDK. */
const getFirebaseApp = (): FirebaseApp => {
  const existing = getApps()[0];
  return existing ?? initializeApp(getFirebaseConfig());
};

export const getFirebaseAuth = () => {
  return getAuth(getFirebaseApp());
};

export const getFirebaseDb = () => {
  return getFirestore(getFirebaseApp());
};
