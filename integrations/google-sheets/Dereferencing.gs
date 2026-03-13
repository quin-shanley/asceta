/**
 * Finds all cell references and resolve each to a single-cell display value.
 * Rules for cell references:
 *  - See https://eta.js.org/docs/4.x.x/intro/template-syntax#basic-syntax
 *  - Format: it['REF']
 *  - REF must me single or double quoted
 *  - REF may be:
 *    - A1 address (case-insensitive), e.g. it['b5']
 *    - Named range (case-sensitive, attempted as-is + common case variants), e.g. it['form.first_name']
 */
function resolveTemplateRefs_(ss, activeSheet, template) {
  const matches = [...String(template ?? "").matchAll(/it\[['"]\s*([^'"]+?)\s*['"]]/g)];
  const uniqueRefs = [...new Set(matches.map(m => String(m[1]).trim()))];

  const out = {};
  for (const ref of uniqueRefs) {
    const range = getSingleCellRangeFromRef_(ss, activeSheet, ref);
    const val = range ? range.getDisplayValue() : "";
    if (typeof val === 'string' && ( val.toLowerCase() === 'true' || val.toLowerCase() === 'false')) {
      out[ref] = (String(val).toLowerCase().trim() === 'true');
    } else {
      out[ref] = val;
    }
  }
  return out;
}

function getSingleCellRangeFromRef_(ss, activeSheet, refRaw) {
  const ref = String(refRaw).trim();

  // 1) Try named range (as-is, lower, upper)
  const namedCandidates = [ref, ref.toLowerCase(), ref.toUpperCase()];
  for (const name of namedCandidates) {
    try {
      const r = ss.getRangeByName(name);
      if (r) return r;
    } catch (_) {}
  }

  // 2) Try A1 notation (case-insensitive), with optional sheet prefix
  const a1 = normalizeA1_(ref);
  if (!a1) return null;

  try {
    const r = activeSheet.getRange(a1);
    return r;
  } catch (_) {
    try {
      const r2 = ss.getRange(a1);
      return r2;
    } catch (_) {}
  }

  return null;
}

function normalizeA1_(s) {
  const raw = String(s).trim();

  const bangIdx = raw.lastIndexOf("!");
  let sheetPart = "";
  let cellPart = raw;

  if (bangIdx !== -1) {
    sheetPart = raw.slice(0, bangIdx + 1);
    cellPart = raw.slice(bangIdx + 1);
  }

  const m = cellPart.match(/^(\$?)([a-z]+)(\$?)(\d+)$/i);
  if (!m) return null;

  const col = m[2].toUpperCase();
  const row = m[4];
  return `${sheetPart}${m[1]}${col}${m[3]}${row}`;
}

/**
 * Like getSingleCellRangeFromRef_, but supports multi-cell ranges:
 *  - A1:B5 (or Sheet!A1:B5)
 *  - named ranges (any size)
 */
function getAnyRangeFromRef_(ss, activeSheet, refRaw) {
  const ref = String(refRaw).trim();

  // 1) Try named range (as-is, lower, upper)
  const namedCandidates = [ref, ref.toLowerCase(), ref.toUpperCase()];
  for (const name of namedCandidates) {
    try {
      const r = ss.getRangeByName(name);
      if (r) return r;
    } catch (_) {}
  }

  // 2) Try A1 notation (single or range), with optional sheet prefix
  const a1 = normalizeA1Range_(ref);
  if (!a1) return null;

  try {
    return activeSheet.getRange(a1);
  } catch (_) {
    try {
      return ss.getRange(a1);
    } catch (_) {}
  }

  return null;
}

function normalizeA1Range_(s) {
  const raw = String(s).trim();

  const bangIdx = raw.lastIndexOf("!");
  let sheetPart = "";
  let addrPart = raw;

  if (bangIdx !== -1) {
    sheetPart = raw.slice(0, bangIdx + 1);
    addrPart = raw.slice(bangIdx + 1);
  }

  const parts = addrPart.split(":");
  if (parts.length < 1 || parts.length > 2) return null;

  const normCell = (cell) => {
    const m = String(cell ?? "").trim().match(/^(\$?)([a-z]+)(\$?)(\d+)$/i);
    if (!m) return null;
    const col = m[2].toUpperCase();
    const row = m[4];
    return `${m[1]}${col}${m[3]}${row}`;
  };

  const a = normCell(parts[0]);
  if (!a) return null;

  if (parts.length === 1) return `${sheetPart}${a}`;

  const b = normCell(parts[1]);
  if (!b) return null;

  return `${sheetPart}${a}:${b}`;
}
