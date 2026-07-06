import fs from "node:fs";
import path from "node:path";

const PRECISION = 2;

function roundHighPrecisionNumbers(value) {
  return value.replace(/\d+\.\d{4,}/g, (match) => {
    const rounded = Number.parseFloat(match);
    if (!Number.isFinite(rounded)) {
      return match;
    }
    return rounded.toFixed(PRECISION).replace(/\.?0+$/, (zeros) =>
      zeros.startsWith(".") ? "" : zeros,
    );
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

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node scripts/round-svg-precision.mjs <file...>");
  process.exit(1);
}

for (const file of files) {
  const absolutePath = path.resolve(file);
  const original = fs.readFileSync(absolutePath, "utf8");
  const updated = roundSvgPrecision(original);

  if (updated !== original) {
    fs.writeFileSync(absolutePath, updated, "utf8");
    console.log(`Updated ${file}`);
  } else {
    console.log(`No changes ${file}`);
  }
}
