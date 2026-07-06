import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const PRECISION = 2;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function roundHighPrecisionNumbers(value) {
  return value.replace(/\d+\.\d{4,}/g, (match) => {
    const rounded = Number.parseFloat(match);
    if (!Number.isFinite(rounded)) {
      return match;
    }
    return rounded
      .toFixed(PRECISION)
      .replace(/\.?0+$/, (zeros) => (zeros.startsWith(".") ? "" : zeros));
  });
}

function roundSvgPrecision(content) {
  return content.replace(
    /(d|points|transform)=("([^"]*)"|'([^']*)')/g,
    (match, attr, _quoted, doubleQuoted, singleQuoted) => {
      const value = doubleQuoted ?? singleQuoted ?? "";
      const rounded = roundHighPrecisionNumbers(value);
      const quote = doubleQuoted !== undefined ? '"' : "'";
      return `${attr}=${quote}${rounded}${quote}`;
    },
  );
}

const files = walk(srcDir);
let changedFiles = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const updated = roundSvgPrecision(original);

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    changedFiles += 1;
    console.log(`Updated ${path.relative(root, file)}`);
  }
}

console.log(`Done. ${changedFiles} file(s) updated.`);
