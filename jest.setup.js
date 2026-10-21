jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// lucide-react-native ships only ESM, which Jest can't load; icons are irrelevant to the tests.
jest.mock("lucide-react-native", () => {
  return new Proxy({}, { get: () => () => null });
});
