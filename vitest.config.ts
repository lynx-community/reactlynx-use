import { createRequire } from "node:module";
import { createVitestConfig } from "@lynx-js/react/testing-library/vitest-config";
import type { UserWorkspaceConfig } from "vitest/config";
import { defineProject, mergeConfig } from "vitest/config";

const require = createRequire(import.meta.url);

const defaultConfig = await createVitestConfig();

const config: UserWorkspaceConfig = defineProject({
  test: {
    name: "react-lynx-use",
    globals: true,
    include: ["tests/**/*.test.{js,jsx,ts,tsx}"],
  },
  resolve: {
    alias: {
      react: require.resolve("@lynx-js/react"),
    },
    mainFields: ["module", "main"],
  },
  plugins: [
    {
      enforce: "post",
      name: "enforce-preact-alias",
      config(config) {
        if (config.resolve && Array.isArray(config.resolve.alias)) {
          config.resolve.alias.forEach((alias) => {
            if (String(alias.find).startsWith("/^preact")) {
              alias.replacement = alias.replacement.replace(/\.js$/, ".mjs");
            }
          });
        }
      },
    },
  ],
});

const mergedConfig: UserWorkspaceConfig = mergeConfig(defaultConfig, config);

export default mergedConfig;
