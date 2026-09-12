import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, relative, dirname } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
async function pages(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) result.push(...(await pages(path)));
    else if (entry.name.endsWith(".html")) result.push(path);
  }
  return result;
}
for (const path of [
  resolve(root, "index.html"),
  ...(await pages(resolve(root, "pages"))),
]) {
  const prefix = relative(dirname(path), root).replaceAll("\\", "/");
  const asset = (name) => `${prefix ? prefix + "/" : ""}${name}`;
  const previous = await readFile(path, "utf8");
  const title =
    /<title>([^<]+)<\/title>/i.exec(previous)?.[1] || "Voting System";
  await writeFile(
    path,
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Explore elections, register to vote, and follow election results in the Voting System local demonstration.">
  <meta name="theme-color" content="#007e80">
  <title>${title}</title>
  <link rel="icon" href="${asset("imgs/favicon.ico")}">
  <link rel="stylesheet" href="${asset("css/app.css")}">
  <script type="module" src="${asset("js/app.js")}"></script>
</head>
<body>
  <div id="app"><main class="main"><div class="loading" role="status">Loading Voting System…</div></main></div>
  <noscript><p>This application needs JavaScript to register, vote, and display results. Please enable JavaScript and reload.</p></noscript>
</body>
</html>
`
  );
}
console.log("Updated the homepage and all existing page entry points.");
