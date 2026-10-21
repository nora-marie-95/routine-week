import { useColorScheme } from "react-native";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { useCloudSync } from "@/features/cloud-sync";
import "@/global.css";
import { useHideSplashScreen } from "@/lib/splash-screen";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  useHideSplashScreen();
  useCloudSync();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="routine/[id]" />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
