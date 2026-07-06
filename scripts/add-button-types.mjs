import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");

/** file -> "button" | "submit" for buttons that should submit their form */
const SUBMIT_BUTTONS = new Map([
  ["src/components/pages/shops/shop/ShopSidebar.tsx", new Set([117])],
  ["src/layouts/headers/Menu/HeaderSearch.tsx", new Set([47])],
]);

function addButtonTypes(content, filePath) {
  const submitLines = SUBMIT_BUTTONS.get(filePath.replace(/\\/g, "/")) ?? new Set();
  const lines = content.split("\n");
  let inButton = false;
  let buttonStart = -1;
  let buttonBuffer = "";

  const flushButton = (endLine) => {
    if (!inButton) return;
    const combined = buttonBuffer;
    if (!/\btype\s*=/.test(combined)) {
      const buttonType = submitLines.has(buttonStart + 1) ? "submit" : "button";
      const updated = combined.replace(/<button\b/, `<button type="${buttonType}"`);
      const firstLine = lines[buttonStart];
      const indent = firstLine.match(/^\s*/)?.[0] ?? "";
      const rest = updated.slice(firstLine.trim().length);
      lines[buttonStart] = indent + updated.trimStart().split("\n")[0];
      if (updated.includes("\n")) {
        const extra = updated.trimStart().split("\n").slice(1);
        lines.splice(buttonStart + 1, endLine - buttonStart, ...extra.map((l) => indent + l));
      }
    }
    inButton = false;
    buttonBuffer = "";
    buttonStart = -1;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inButton && /<button\b/.test(line)) {
      inButton = true;
      buttonStart = i;
      buttonBuffer = line;
      if (/>/.test(line) || /\/>/.test(line)) {
        flushButton(i);
      }
      continue;
    }
    if (inButton) {
      buttonBuffer += "\n" + line;
      if (/>/.test(line) || /\/>/.test(line)) {
        flushButton(i);
      }
    }
  }

  return lines.join("\n");
}

const files = fs
  .readFileSync(
    "C:/Users/aduran/AppData/Local/Temp/react-doctor-af51464e-3f5d-4ac2-9b4a-c4d09131bc04/react-doctor--button-has-type.txt",
    "utf8",
  )
  .split("\n")
  .filter((line) => line.startsWith("  src/"))
  .map((line) => line.trim().split(":")[0]);

for (const rel of [...new Set(files)]) {
  const abs = path.join(ROOT, "..", rel);
  const original = fs.readFileSync(abs, "utf8");
  const updated = addButtonTypes(original, rel);
  if (updated !== original) {
    fs.writeFileSync(abs, updated, "utf8");
    console.log(`Updated ${rel}`);
  }
}
