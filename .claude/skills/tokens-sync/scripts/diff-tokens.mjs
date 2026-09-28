#!/usr/bin/env node
// Token-level diff of tokens.json against a git ref (default HEAD).
// Usage: node .claude/skills/tokens-sync/scripts/diff-tokens.mjs [ref]
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ref = process.argv[2] ?? "HEAD";

function flatten(node, path = [], out = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$") || typeof value !== "object" || value === null) continue;
    if ("$value" in value) {
      const figma = value.$extensions?.["com.figma"] ?? {};
      out.set(path.concat(key).join("."), {
        value: JSON.stringify(value.$value),
        modes: JSON.stringify(figma.modes ?? {}),
        collection: figma.collection ?? "",
      });
    } else flatten(value, path.concat(key), out);
  }
  return out;
}

let before = new Map();
try {
  before = flatten(JSON.parse(execFileSync("git", ["show", `${ref}:tokens.json`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })));
} catch {
  console.log(`(no tokens.json at ${ref}: treating every token as added)`);
}
const after = flatten(JSON.parse(readFileSync("tokens.json", "utf8")));

const added = [...after.keys()].filter((k) => !before.has(k));
const removed = [...before.keys()].filter((k) => !after.has(k));
const changed = [...after.keys()].filter(
  (k) => before.has(k) && (before.get(k).value !== after.get(k).value || before.get(k).modes !== after.get(k).modes),
);

// A removed and an added token with the same value in the same collection look like a rename.
const renames = [];
const unmatchedAdded = new Set(added);
for (const oldPath of removed) {
  const o = before.get(oldPath);
  const match = [...unmatchedAdded].find((n) => after.get(n).value === o.value && after.get(n).collection === o.collection);
  if (match) {
    renames.push([oldPath, match]);
    unmatchedAdded.delete(match);
  }
}
const renamedOld = new Set(renames.map(([o]) => o));

const show = (title, items) => {
  console.log(`\n${title} (${items.length})`);
  for (const i of items.slice(0, 40)) console.log(`  ${i}`);
  if (items.length > 40) console.log(`  … and ${items.length - 40} more`);
};

console.log(`Tokens: ${before.size} -> ${after.size}  (vs ${ref})`);
show("Added", added.filter((k) => unmatchedAdded.has(k)));
show("Changed", changed.map((k) => `${k}: ${before.get(k).value} -> ${after.get(k).value}${before.get(k).modes !== after.get(k).modes ? " (modes changed)" : ""}`));
show("Removed", removed.filter((k) => !renamedOld.has(k)));
show("Rename candidates (same value, same collection)", renames.map(([o, n]) => `${o} -> ${n}`));
console.log(`\nSummary: +${unmatchedAdded.size} added, ~${changed.length} changed, -${removed.length - renames.length} removed, ${renames.length} renamed?`);
