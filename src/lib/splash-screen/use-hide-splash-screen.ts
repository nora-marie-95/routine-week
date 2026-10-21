import { useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

/** Keeps the splash screen up until first paint, instead of hiding before content is ready. */
export const useHideSplashScreen = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
};
