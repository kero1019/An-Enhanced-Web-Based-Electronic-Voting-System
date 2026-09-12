import { readFile, readdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scripts = ["js/api.js", "js/app.js", "scripts/sync-pages.mjs"];
for (const script of scripts) {
  const result = spawnSync(
    process.execPath,
    ["--check", resolve(root, script)],
    { encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr);
}
async function check(folder) {
  let count = 0;
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (
      entry.name.startsWith(".") ||
      ["imgs", "webfonts", "node_modules"].includes(entry.name)
    )
      continue;
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) count += await check(path);
    else if (entry.name.endsWith(".html")) {
      const source = await readFile(path, "utf8");
      assert.match(source, /name="viewport"/);
      assert.match(source, /id="app"/);
      assert.match(
        source,
        /<script type="module" src="[^\"]*js\/app\.js"><\/script>/
      );
      assert.equal(
        (source.match(/<script /g) || []).length,
        1,
        `Legacy script is still loaded: ${path}`
      );
      for (const match of source.matchAll(/(?:src|href)="([^\"]+)"/g))
        await access(resolve(dirname(path), match[1]));
      count++;
    }
  }
  return count;
}
console.log(
  `JavaScript syntax and assets checked for ${await check(
    root
  )} HTML entry points.`
);
