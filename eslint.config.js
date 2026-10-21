const expoConfig = require("eslint-config-expo/flat");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  { ignores: ["dist/*", ".expo/*", "node_modules/*"] },
  ...expoConfig,
  {
    rules: {
      curly: ["error", "all"],
      "arrow-body-style": ["error", "always"],
      // eslint-config-expo's bundled eslint-import-resolver-typescript@3.10.1 exposes an
      // interface eslint-plugin-import can't load ("invalid interface loaded as resolver"),
      // making every "@/" import look unresolved. tsc --noEmit already verifies path
      // resolution correctly, so these are disabled rather than fighting a broken resolver.
      "import/no-unresolved": "off",
      "import/namespace": "off",
      "import/no-duplicates": "off",
    },
  },
);
