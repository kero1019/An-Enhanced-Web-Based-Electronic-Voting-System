import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const frontend = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backend = process.env.VOTING_BACKEND_DIR
  ? resolve(process.env.VOTING_BACKEND_DIR)
  : resolve(frontend, "../../Voting_System");
const entry = resolve(backend, "local/server.mjs");

try {
  await access(entry);
} catch {
  console.error(
    `Cannot find the Voting_System backend at ${backend}.\n` +
      "Set VOTING_BACKEND_DIR to its folder, or run npm run start:local directly from Voting_System."
  );
  process.exit(1);
}

// Start in this process so Ctrl+C closes the server without leaving a child running.
const { startLocal } = await import(pathToFileURL(entry).href);
await startLocal({ frontend });
