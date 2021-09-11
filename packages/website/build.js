const fs = require("fs");
const path = require("path");

const { pnpPlugin } = require("@yarnpkg/esbuild-plugin-pnp");

const MONACO_WORKERS_PATH = path.join(__dirname, "monaco-workers");

const monacoWorkerEntryPointPaths = fs
  .readdirSync(MONACO_WORKERS_PATH, { withFileTypes: true })
  .filter((file) => file.isFile() && file.name.endsWith(".js"))
  .map((file) => path.join(MONACO_WORKERS_PATH, file.name));

const esbuildOpts = {
  plugins: [pnpPlugin()],
  loader: { ".ttf": "file" },
  entryPoints: [
    path.join(__dirname, "entry.ts"),
    ...monacoWorkerEntryPointPaths,
  ],
  bundle: true,
  outdir: path.join(__dirname, "dist"),
  target: "es2018",
  sourcemap: "external",
  minify: true,
  sourceRoot: path.join(__dirname, "..", ".."),
};

module.exports = { esbuildOpts, monacoWorkerEntryPointPaths };

if (require.main === module)
  require("esbuild")
    .build(esbuildOpts)
    .catch(() => process.exit(1));
