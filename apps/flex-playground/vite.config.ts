import { defineAppConfig } from "@osmoz/config/define-app-config";
import { defineConfig } from "vite-plus";

export default defineConfig(defineAppConfig({ root: import.meta.dirname }));
