import { execSync } from "child_process";
import { promises as fs } from "fs";
import { join, resolve } from "path";

const imagesDirectory = resolve(__dirname, "..", "..", "languages");

void (async function () {
  for (const lang of await fs.readdir(imagesDirectory)) {
    execSync(`docker build . --tag "alg-wiki/${lang}"`, {
      cwd: join(imagesDirectory, lang),
      stdio: "inherit",
    });
  }
})();
