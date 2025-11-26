import type { BuildOptions } from "esbuild";
import { defineConfig } from "tsup";

const withWasmLoader = (options: BuildOptions) => {
  options.loader = { ...(options.loader || {}), ".wasm": "binary" };
};

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2020",
    treeshake: true,
    platform: "browser",
    esbuildOptions: withWasmLoader,
  },
  {
    entry: { worker: "src/worker.ts" },
    format: ["esm"],
    dts: false,
    sourcemap: false,
    clean: false,
    target: "es2020",
    treeshake: true,
    splitting: false,
    minify: true,
    platform: "browser",
    external: ["fs", "path"],
    outExtension: () => ({ js: ".js" }),
    esbuildOptions: withWasmLoader,
  },
]);
