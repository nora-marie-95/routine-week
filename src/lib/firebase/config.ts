import { Platform } from "react-native";

/**
 * Read from EXPO_PUBLIC_* variables, which Expo inlines at build time. Firebase web config is
 * public by design — what protects the data is the Firestore rules plus Google sign-in.
 * Literal `process.env.X` accesses are required: Expo only replaces those, not dynamic lookups.
 */
const CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** Without all four values — or off the web, where the popup sign-in doesn't exist — the app stays local-only. */
export const isFirebaseEnabled =
  Platform.OS === "web" &&
  Boolean(CONFIG.apiKey && CONFIG.authDomain && CONFIG.projectId && CONFIG.appId);

export const getFirebaseConfig = () => {
  return CONFIG;
};
