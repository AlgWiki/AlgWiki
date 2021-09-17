import { spawnSync } from "child_process";
import { existsSync, utimesSync } from "fs";
import { relative, resolve } from "path";
import { cwd } from "process";

const mainEntryFilePath = resolve(__dirname, "..", "dist", "ts", "main.js");
const mainEntryDisplay = relative(cwd(), mainEntryFilePath);

const block = (milliseconds: number): unknown =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);

// Block until `tsc` has built the main process's file
while (!existsSync(mainEntryFilePath)) {
  console.log(`waiting for ${mainEntryDisplay}...`);
  block(2000);
}

// Start electron
console.log("Starting electron...");
const { status } = spawnSync("electron", ["."], { stdio: "inherit" });

// If we exited successfully, then `touch` the dist file again to make nodemon restart this script
console.log(`electron exited with code: ${status}`);
if (status == 0) {
  console.log(`touching ${mainEntryDisplay} to trigger restart...`);
  const now = new Date();
  utimesSync(mainEntryFilePath, now, now);
} else {
  process.exit(status || 1); // handle `null` cases as an error
}
