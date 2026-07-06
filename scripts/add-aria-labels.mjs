import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasAriaLabel(tag) {
  return /\baria-label=/.test(tag);
}

function hasAriaLabelledBy(tag) {
  return /\baria-labelledby=/.test(tag);
}

function getPlaceholder(tag) {
  const match = tag.match(/\bplaceholder=(?:\{`([^`]+)`\}|"([^"]*)"|'([^']*)'|\{("([^"]*)"|'([^']*)')\})/);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? match?.[5] ?? match?.[6] ?? null;
}

function addAriaLabelToTag(tag, label) {
  if (!label || hasAriaLabel(tag) || hasAriaLabelledBy(tag)) {
    return tag;
  }
  const escaped = label.replace(/"/g, "&quot;");
  return tag.replace(/^(<\w+)/, `$1 aria-label="${escaped}"`);
}

function patchInputsAndTextareas(content) {
  return content.replace(/<(?:input|textarea)\b[^>]*>/g, (tag) => {
    if (hasAriaLabel(tag) || hasAriaLabelledBy(tag)) {
      return tag;
    }

    const idMatch = tag.match(/\bid=(?:\{`([^`]+)`\}|"([^"]+)"|'([^']+)')/);
    const id = idMatch?.[1] ?? idMatch?.[2] ?? idMatch?.[3];
    if (id) {
      const labelPattern = new RegExp(
        `<label[^>]*htmlFor=(?:\{` + "`" + id + "`" + `\\}|"${id}"|'${id}')`,
      );
      if (labelPattern.test(content)) {
        return tag;
      }
    }

    const placeholder = getPlaceholder(tag);
    if (placeholder) {
      return addAriaLabelToTag(tag, placeholder);
    }

    return tag;
  });
}

function patchIconButtons(content) {
  let updated = content;

  updated = updated.replace(
    /<button\b([^>]*className=\{?`[^`]*grid-view[^`]*`[^>]*)>/g,
    (match, attrs) =>
      /\baria-label=/.test(attrs) ? match : `<button${attrs} aria-label="Grid view">`,
  );

  updated = updated.replace(
    /<button\b([^>]*className=\{?`[^`]*list-view[^`]*`[^>]*)>/g,
    (match, attrs) =>
      /\baria-label=/.test(attrs) ? match : `<button${attrs} aria-label="List view">`,
  );

  updated = updated.replace(
    /<button\b([^>]*className="[^"]*tg-footer-form-btn[^"]*"[^>]*)>/g,
    (match, attrs) =>
      /\baria-label=/.test(attrs) ? match : `<button${attrs} aria-label="Subscribe">`,
  );

  return updated;
}

function patchQuantityInputs(content) {
  return content.replace(
    /(<span className="mr-20">([^<]+)<\/span>[\s\S]*?<input className="tg-quantity-input"[^>]*?)(\s*\/?>)/g,
    (full, prefix, label, close) => {
      if (/\baria-label=/.test(prefix)) {
        return full;
      }
      const suffix = close.trimStart().startsWith("/") ? " />" : ">";
      return `${prefix} aria-label="${label.trim()} count"${suffix}`;
    },
  );
}

function patchNiceSelect(content) {
  return content.replace(/<NiceSelect\b([\s\S]*?)\/>/g, (tag) => {
    if (/\bariaLabel=/.test(tag)) {
      return tag;
    }
    return tag.replace(/\/>$/, " ariaLabel=\"Sort by\" />");
  });
}

function patchSortToggle(content) {
  return content.replace(
    /<a href="#">\s*<svg width="14" height="16"/g,
    '<a href="#" aria-label="Toggle sort direction">\n                        <svg width="14" height="16"',
  );
}

function patchSearchSubmitButtons(content) {
  return content.replace(
    /<button className="buttons" type="submit">/g,
    '<button className="buttons" type="submit" aria-label="Search">',
  );
}

function patchCloseButtons(content) {
  return content.replace(
    /<button type="button" onClick=\{\(\) => setSidebar\(false\)\}>/g,
    '<button type="button" onClick={() => setSidebar(false)} aria-label="Close sidebar">',
  );
}

function patchWishlistButtons(content) {
  return content.replace(
    /<button type="button" onClick=\{\(\) => handleAddToWishlist\(([^)]*)\)\} style=\{\{ cursor: "pointer" \}\}(?![^>]*aria-label)>/g,
    '<button type="button" onClick={() => handleAddToWishlist($1)} style={{ cursor: "pointer" }} aria-label="Add to wishlist">',
  );
}

function patchHeaderMenuButtons(content) {
  let updated = content;
  updated = updated.replace(
    /(<button type="button" onClick=\{\(\) => setSidebar\(true\)\}[^>]*className="[^"]*menu-tigger[^"]*"[^>]*)(>)/g,
    (_, attrs, close) =>
      /\baria-label=/.test(attrs)
        ? `${attrs}${close}`
        : `${attrs} aria-label="Open sidebar"${close}`,
  );
  updated = updated.replace(
    /(<button type="button" onClick=\{\(\) => setOffCanvas\(true\)\}[^>]*className="[^"]*mobile-nav-toggler[^"]*"[^>]*)(>)/g,
    (_, attrs, close) =>
      /\baria-label=/.test(attrs)
        ? `${attrs}${close}`
        : `${attrs} aria-label="Open menu"${close}`,
  );
  return updated;
}

function patchGalleryNavButtons(content) {
  return content
    .replace(
      /<button type="button" className="tg-tour-details-gallery-prev">/g,
      '<button type="button" className="tg-tour-details-gallery-prev" aria-label="Previous image">',
    )
    .replace(
      /<button type="button" className="tg-tour-details-gallery-next">/g,
      '<button type="button" className="tg-tour-details-gallery-next" aria-label="Next image">',
    );
}

function patchSliderNavButtons(content) {
  return content
    .replace(
      /<button type="button" className="tg-listing-5-slide-prev">/g,
      '<button type="button" className="tg-listing-5-slide-prev" aria-label="Previous slide">',
    )
    .replace(
      /<button type="button" className="tg-listing-5-slide-next">/g,
      '<button type="button" className="tg-listing-5-slide-next" aria-label="Next slide">',
    )
    .replace(
      /<button type="button" className="tg-testimonial-4-slide-next">/g,
      '<button type="button" className="tg-testimonial-4-slide-next" aria-label="Next testimonial">',
    )
    .replace(
      /<button type="button" className="tg-testimonial-4-slide-prev">/g,
      '<button type="button" className="tg-testimonial-4-slide-prev" aria-label="Previous testimonial">',
    );
}

function patchStaticViewButtons(content) {
  return content
    .replace(
      /<button type="button" className="grid-view([^"]*)">/g,
      (match, rest) =>
        /\baria-label=/.test(match)
          ? match
          : `<button type="button" className="grid-view${rest}" aria-label="Grid view">`,
    )
    .replace(
      /<button type="button" className="list-view([^"]*)">/g,
      (match, rest) =>
        /\baria-label=/.test(match)
          ? match
          : `<button type="button" className="list-view${rest}" aria-label="List view">`,
    );
}

function patchReadonlyQuantityInputs(content) {
  return content.replace(
    /<input className="tg-quantity-input" type="text"([^>]*)\bvalue=\{([^}]+)\}([^>]*)\breadOnly([^>]*)(\s*\/?>)/g,
    (tag, _before, _value, _mid, _readOnly, close) => {
      if (/\baria-label=/.test(tag)) {
        return tag;
      }
      const suffix = close.trimStart().startsWith("/") ? " />" : ">";
      return tag.replace(/\s*\/?>$/, ` aria-label="Quantity"${suffix}`);
    },
  );
}

function patchFilterCheckboxes(content) {
  return content
    .replace(
      /(<input className="tg-checkbox" type="checkbox" checked=\{category === categorySelected\} readOnly id=\{`cat_\$\{i\}`\})(\s*\/>)/g,
      '$1 aria-label={category}$2',
    )
    .replace(
      /(<input className="tg-checkbox" type="checkbox" checked=\{amenities === amenitiesSelected\} readOnly id=\{`amenities_\$\{i\}`\})(\s*\/>)/g,
      '$1 aria-label={amenities}$2',
    )
    .replace(
      /(<input className="tg-checkbox" type="checkbox" checked=\{rating === ratingSelected\} readOnly id=\{`rating_\$\{i\}`\})(\s*\/>)/g,
      '$1 aria-label={`${rating} stars`}$2',
    )
    .replace(
      /(<input className="tg-checkbox" type="checkbox" checked=\{language === languageSelected\} readOnly id=\{`language_\$\{i\}`\})(\s*\/>)/g,
      '$1 aria-label={language}$2',
    )
    .replace(
      /(<input className="tg-checkbox" type="checkbox" checked=\{destination === destinationSelected\} readOnly id=\{`cat_\$\{i\}`\})(\s*\/>)/g,
      '$1 aria-label={destination}$2',
    )
    .replace(
      /(<input className="tg-checkbox" type="checkbox" checked=\{duration === durationSelected\} readOnly id=\{`duration_\$\{i\}`\})(\s*\/>)/g,
      '$1 aria-label={duration}$2',
    );
}

const files = walk(srcDir);
let changedFiles = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  let updated = original;
  updated = patchInputsAndTextareas(updated);
  updated = patchIconButtons(updated);
  updated = patchQuantityInputs(updated);
  updated = patchNiceSelect(updated);
  updated = patchSortToggle(updated);
  updated = patchSearchSubmitButtons(updated);
  updated = patchCloseButtons(updated);
  updated = patchWishlistButtons(updated);
  updated = patchHeaderMenuButtons(updated);
  updated = patchGalleryNavButtons(updated);
  updated = patchSliderNavButtons(updated);
  updated = patchStaticViewButtons(updated);
  updated = patchReadonlyQuantityInputs(updated);
  updated = patchFilterCheckboxes(updated);

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    changedFiles += 1;
    console.log(`Updated ${path.relative(root, file)}`);
  }
}

console.log(`Done. ${changedFiles} file(s) updated.`);
