import { staticApi } from "./static-api.js";

// Localhost uses the persistent SQLite server. GitHub Pages uses the browser-only demo.
const publishedDemo =
  location.hostname.endsWith("github.io") ||
  new URLSearchParams(location.search).has("github-demo");
export async function api(path, { method = "GET", body } = {}) {
  if (publishedDemo) return staticApi(path, { method, body });
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      signal: AbortSignal.timeout(15000),
      headers: method === "GET" ? {} : { "Content-Type": "application/json" },
      ...(method === "GET" ? {} : { body: JSON.stringify(body || {}) }),
    });
  } catch {
    throw new Error(
      "Could not reach the voting service. Check that the local server is running, then try again."
    );
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(
      "The voting API is unavailable at this address. Open the app through the local voting server."
    );
  }
  if (!response.ok)
    throw Object.assign(
      new Error(payload.message || "The request could not be completed."),
      { status: response.status }
    );
  return payload.data;
}

export const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        character
      ])
  );
export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
export const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
export const localDateTime = (value) => {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
export async function readImage(file) {
  if (!file?.size) return undefined;
  if (
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    file.size > 307200
  )
    throw new Error("Choose a PNG, JPEG, or WebP image under 300 KB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.readAsDataURL(file);
  });
}
