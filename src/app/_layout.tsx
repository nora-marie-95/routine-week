import { useColorScheme } from "react-native";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import "@/global.css";
import { useHideSplashScreen } from "@/lib/splash-screen";
import { UndoToast } from "@/shared/undo";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  useHideSplashScreen();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="routine/[id]" />
      </Stack>
      <UndoToast />
    </ThemeProvider>
  );
};

export default RootLayout;
