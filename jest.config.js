module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.js"],
  // jest-expo's default ignore pattern doesn't include immer, which ships an ESM-only build.
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|immer))",
    "/node_modules/react-native-reanimated/plugin/",
    "/node_modules/@react-native/babel-preset/",
  ],
};
