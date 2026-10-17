import { defineConfig } from "vite-plus";

import { testConfig } from "./src/test-config.ts";

export default defineConfig({
  test: testConfig,
});
