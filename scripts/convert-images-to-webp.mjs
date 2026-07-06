import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const ASSETS_DIR = path.join(ROOT, "public", "assets");
const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".scss",
  ".json",
  ".md",
]);
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "scripts",
]);

async function walk(dir, onFile) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(fullPath, onFile);
      continue;
    }
    await onFile(fullPath);
  }
}

async function convertImages() {
  const converted = [];

  await walk(ASSETS_DIR, async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(ext)) return;

    const webpPath = filePath.slice(0, -ext.length) + ".webp";
    const input = await fs.readFile(filePath);

    await sharp(input)
      .webp({ quality: 82, effort: 4 })
      .toFile(webpPath);

    converted.push({ from: filePath, to: webpPath });
    await fs.unlink(filePath);
  });

  return converted;
}

function replaceImageExtensions(content) {
  return content
    .replace(/\.png\b/gi, ".webp")
    .replace(/\.jpe?g\b/gi, ".webp");
}

const UPDATE_DIRS = [
  path.join(ROOT, "src"),
  path.join(ROOT, "public", "styles"),
  path.join(ROOT, "public", "assets", "css"),
  path.join(ROOT, "public", "assets", "scss"),
];

async function updateReferences() {
  const updatedFiles = [];

  for (const dir of UPDATE_DIRS) {
    await walk(dir, async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (!TEXT_EXTENSIONS.has(ext)) return;

      const original = await fs.readFile(filePath, "utf8");
      const next = replaceImageExtensions(original);
      if (next !== original) {
        await fs.writeFile(filePath, next, "utf8");
        updatedFiles.push(path.relative(ROOT, filePath));
      }
    });
  }

  return updatedFiles;
}

const converted = await convertImages();
const updatedFiles = await updateReferences();

console.log(`Converted ${converted.length} images to WebP under public/assets`);
console.log(`Updated ${updatedFiles.length} source files`);
