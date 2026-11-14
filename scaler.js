// Recipe scaling + measure conversion logic. No DOM here, so it can be tested in Node.
(function (root) {
  "use strict";

  // ---- Units ---------------------------------------------------------------
  // Volume in millilitres, weight in grams.
  const UNITS = {
    tsp:   { kind: "volume", base: 4.92892,  label: ["tsp", "tsp"] },
    tbsp:  { kind: "volume", base: 14.7868,  label: ["tbsp", "tbsp"] },
    floz:  { kind: "volume", base: 29.5735,  label: ["fl oz", "fl oz"] },
    cup:   { kind: "volume", base: 236.588,  label: ["cup", "cups"] },
    pint:  { kind: "volume", base: 473.176,  label: ["pint", "pints"] },
    quart: { kind: "volume", base: 946.353,  label: ["quart", "quarts"] },
    gallon:{ kind: "volume", base: 3785.41,  label: ["gallon", "gallons"] },
    ml:    { kind: "volume", base: 1,        label: ["ml", "ml"] },
    l:     { kind: "volume", base: 1000,     label: ["L", "L"] },
    g:     { kind: "weight", base: 1,        label: ["g", "g"] },
    kg:    { kind: "weight", base: 1000,     label: ["kg", "kg"] },
    oz:    { kind: "weight", base: 28.3495,  label: ["oz", "oz"] },
    lb:    { kind: "weight", base: 453.592,  label: ["lb", "lb"] },
  };

  // Case-sensitive first (T = tablespoon, t = teaspoon), then lowercase aliases.
  const CASE_ALIASES = { T: "tbsp", t: "tsp", Tbsp: "tbsp", Tbs: "tbsp" };
  const ALIASES = {
    tsp: "tsp", tsps: "tsp", teaspoon: "tsp", teaspoons: "tsp",
    tbsp: "tbsp", tbsps: "tbsp", tbs: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
    "fl oz": "floz", "fl. oz": "floz", "fl. oz.": "floz", "fluid ounce": "floz", "fluid ounces": "floz",
    cup: "cup", cups: "cup", c: "cup",
    pint: "pint", pints: "pint", pt: "pint",
    quart: "quart", quarts: "quart", qt: "quart",
    gallon: "gallon", gallons: "gallon", gal: "gallon",
    ml: "ml", milliliter: "ml", milliliters: "ml", millilitre: "ml", millilitres: "ml",
    l: "l", liter: "l", liters: "l", litre: "l", litres: "l",
    g: "g", gram: "g", grams: "g", gr: "g",
    kg: "kg", kilogram: "kg", kilograms: "kg", kilo: "kg", kilos: "kg",
    oz: "oz", ounce: "oz", ounces: "oz",
    lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
  };

  // ---- Measure exchange: grams per US cup for common ingredients -----------
  // Longest match wins, so "brown sugar" beats "sugar".
  // liquid: true means it stays in ml when converting to metric.
  const DENSITY = [
    { name: "all-purpose flour", g: 125 }, { name: "all purpose flour", g: 125 },
    { name: "bread flour", g: 130 }, { name: "whole wheat flour", g: 120 },
    { name: "cake flour", g: 115 }, { name: "flour", g: 125 },
    { name: "brown sugar", g: 220 }, { name: "icing sugar", g: 120 },
    { name: "powdered sugar", g: 120 }, { name: "confectioners sugar", g: 120 },
    { name: "granulated sugar", g: 200 }, { name: "sugar", g: 200 },
    { name: "butter", g: 227 }, { name: "rolled oats", g: 90 }, { name: "oats", g: 90 },
    { name: "cocoa", g: 85 }, { name: "cornstarch", g: 128 }, { name: "rice", g: 185 },
    { name: "honey", g: 340 }, { name: "maple syrup", g: 315 },
    { name: "table salt", g: 292 }, { name: "salt", g: 292 },
    { name: "water", g: 236, liquid: true }, { name: "milk", g: 245, liquid: true },
    { name: "oil", g: 218, liquid: true }, { name: "cream", g: 240, liquid: true },
    { name: "stock", g: 236, liquid: true }, { name: "broth", g: 236, liquid: true },
  ];

  function findDensity(text) {
    const t = (text || "").toLowerCase();
    let best = null;
    for (const d of DENSITY) {
      const re = new RegExp("\\b" + d.name.replace(/[-]/g, "[- ]") + "\\b");
      if (re.test(t) && (!best || d.name.length > best.name.length)) best = d;
    }
    return best;
  }

  // ---- Parsing ---------------------------------------------------------------
  const UNICODE_FRACTIONS = { "¼": 0.25, "½": 0.5, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3,
    "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875 };

  // One number: "2", "1.5", "1/2", "1 1/2", "1½", "½"
  const NUM = "(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?\\s*[¼½¾⅓⅔⅛⅜⅝⅞]?|[¼½¾⅓⅔⅛⅜⅝⅞])";
  const QTY_RE = new RegExp("^\\s*(" + NUM + ")(?:\\s*(?:-|–|to)\\s*(" + NUM + "))?\\s*(.*)$");

  function parseNumber(s) {
    s = s.trim().replace(",", ".");
    let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + (+m[2] / +m[3]);
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return +m[2] === 0 ? NaN : +m[1] / +m[2];
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*([¼½¾⅓⅔⅛⅜⅝⅞])$/))) return +m[1] + UNICODE_FRACTIONS[m[2]];
    if (UNICODE_FRACTIONS[s] !== undefined) return UNICODE_FRACTIONS[s];
    return parseFloat(s);
  }

  function parseUnit(rest) {
    // Try two-word units first ("fl oz", "fluid ounces"), then one word.
    const words = rest.split(/\s+/);
    for (const n of [2, 1]) {
      if (words.length < n) continue;
      const raw = words.slice(0, n).join(" ").replace(/[.,]$/, "");
      const key = CASE_ALIASES[raw] || ALIASES[raw.toLowerCase()];
      if (key) {
        // "c" and "t" alone are only units if followed by more text
        if ((raw === "c" || raw === "t") && words.length === n) return null;
        return { unit: key, text: words.slice(n).join(" ").replace(/^of\s+/i, "") };
      }
    }
    return null;
  }

  function parseLine(line) {
    const m = line.match(QTY_RE);
    if (!m) return { raw: line, qty: null };
    const qty = parseNumber(m[1]);
    const qty2 = m[2] ? parseNumber(m[2]) : null;
    if (!isFinite(qty) || (qty2 !== null && !isFinite(qty2))) return { raw: line, qty: null };
    const rest = m[3] || "";
    const u = parseUnit(rest);
    return u ? { raw: line, qty, qty2, unit: u.unit, text: u.text }
             : { raw: line, qty, qty2, unit: null, text: rest };
  }

  // ---- Formatting ------------------------------------------------------------
  // Nearest kitchen fraction (halves, thirds, quarters, eighths).
  function toFraction(x) {
    const whole = Math.floor(x + 1e-9);
    const frac = x - whole;
    let best = { n: 0, d: 1, err: frac };
    for (const d of [2, 3, 4, 8]) {
      const n = Math.round(frac * d);
      const err = Math.abs(frac - n / d);
      if (err < best.err - 1e-9) best = { n, d, err };
    }
    let w = whole, n = best.n, d = best.d;
    if (n === d) { w += 1; n = 0; }
    if (n > 0) { const g = gcd(n, d); n /= g; d /= g; }
    if (n === 0) return String(w);
    return (w > 0 ? w + " " : "") + n + "/" + d;
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  function trimDecimal(x, places) {
    return String(+x.toFixed(places));
  }

  // Pick singular/plural from the number as displayed, so 1.0001 shows "1 cup".
  function label(unit, shown) {
    const l = UNITS[unit].label;
    const n = typeof shown === "string" ? parseNumber(shown) : shown;
    return n > 1 ? l[1] : l[0];
  }

  // ---- Choosing the display unit ---------------------------------------------
  // Use the biggest spoon/cup that gives a clean kitchen amount.
  // 4 tsp stays "4 tsp" instead of becoming "1 1/3 tbsp".
  function isClean(value, dens) {
    return dens.some((d) => Math.abs(value * d - Math.round(value * d)) < 0.04 * d);
  }
  function bestUsVolume(ml) {
    const cups = ml / UNITS.cup.base;
    if (cups >= 0.25 - 0.002 && isClean(cups, [2, 3, 4, 8])) return "cup";
    const tbsp = ml / UNITS.tbsp.base;
    if (tbsp >= 1 - 0.01 && isClean(tbsp, [2])) return "tbsp";
    if (cups >= 1) return "cup";
    return "tsp";
  }
  function bestUsWeight(g) { return g >= UNITS.lb.base - 0.5 ? "lb" : "oz"; }
  function bestMetricVolume(ml) { return ml >= 1000 ? "l" : "ml"; }
  function bestMetricWeight(g) { return g >= 1000 ? "kg" : "g"; }

  function formatAmount(value, unit) {
    const sys = (unit === "ml" || unit === "l" || unit === "g" || unit === "kg") ? "metric" : "us";
    if (sys === "metric") {
      if (unit === "l" || unit === "kg") return trimDecimal(value, 2);
      if (value < 10) return trimDecimal(value, 1);
      if (value >= 100) return String(Math.round(value / 5) * 5);
      return String(Math.round(value));
    }
    return toFraction(value);
  }

  // Convert an amount in `unit` for the given mode. Returns { value, unit }.
  function convert(value, unit, mode, text) {
    const u = UNITS[unit];
    const baseAmt = value * u.base;
    const dens = findDensity(text);

    if (mode === "metric") {
      if (u.kind === "volume" && dens && !dens.liquid) {
        const g = (baseAmt / UNITS.cup.base) * dens.g;
        const out = bestMetricWeight(g);
        return { value: g / UNITS[out].base, unit: out };
      }
      const out = u.kind === "volume" ? bestMetricVolume(baseAmt) : bestMetricWeight(baseAmt);
      return { value: baseAmt / UNITS[out].base, unit: out };
    }
    if (mode === "us") {
      if (u.kind === "weight" && dens) {
        const ml = (baseAmt / dens.g) * UNITS.cup.base;
        const out = bestUsVolume(ml);
        return { value: ml / UNITS[out].base, unit: out };
      }
      const out = u.kind === "volume" ? bestUsVolume(baseAmt) : bestUsWeight(baseAmt);
      return { value: baseAmt / UNITS[out].base, unit: out };
    }
    // keep: stay in the same system, but step spoons/cups up or down sensibly
    const isUsVolume = u.kind === "volume" && ["tsp", "tbsp", "cup"].includes(unit);
    if (isUsVolume) {
      const out = bestUsVolume(baseAmt);
      return { value: baseAmt / UNITS[out].base, unit: out };
    }
    if (unit === "oz" || unit === "lb") {
      const out = bestUsWeight(baseAmt);
      return { value: baseAmt / UNITS[out].base, unit: out };
    }
    if (unit === "g" || unit === "kg") {
      const out = bestMetricWeight(baseAmt);
      return { value: baseAmt / UNITS[out].base, unit: out };
    }
    if (unit === "ml" || unit === "l") {
      const out = bestMetricVolume(baseAmt);
      return { value: baseAmt / UNITS[out].base, unit: out };
    }
    return { value, unit };
  }

  // ---- Public API --------------------------------------------------------------
  function scaleLine(line, factor, mode) {
    const p = parseLine(line);
    if (p.qty === null) return { text: line.trim(), changed: false };
    const a = p.qty * factor;
    const b = p.qty2 !== null ? p.qty2 * factor : null;
    if (!p.unit) {
      const amt = toFraction(a) + (b !== null ? "-" + toFraction(b) : "");
      return { text: (amt + " " + p.text).trim(), changed: factor !== 1 };
    }
    const ca = convert(a, p.unit, mode, p.text);
    let amt = formatAmount(ca.value, ca.unit);
    let top = amt;
    if (b !== null) {
      const cb = { value: (b * UNITS[p.unit].base) / UNITS[ca.unit].base, unit: ca.unit };
      if (findDensity(p.text) && UNITS[p.unit].kind !== UNITS[ca.unit].kind) {
        cb.value = ca.value * (b / a);
      }
      top = formatAmount(cb.value, ca.unit);
      amt += "-" + top;
    }
    const text = (amt + " " + label(ca.unit, top) + " " + p.text).trim();
    return { text, changed: text !== line.trim() };
  }

  function scaleRecipe(ingredients, fromServings, toServings, mode) {
    const from = parseNumber(String(fromServings));
    const to = parseNumber(String(toServings));
    if (!(from > 0) || !(to > 0)) {
      return { error: "Servings need to be numbers bigger than 0." };
    }
    const lines = String(ingredients || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      return { error: "Add at least one ingredient, one per line." };
    }
    const factor = to / from;
    return { factor, lines: lines.map((l) => scaleLine(l, factor, mode || "keep")) };
  }

  // Standalone measure converter.
  function convertMeasure(amount, fromUnit, toUnit, ingredient) {
    const v = parseNumber(String(amount));
    if (!isFinite(v) || v <= 0) return { error: "Enter an amount bigger than 0." };
    const f = UNITS[fromUnit], t = UNITS[toUnit];
    if (!f || !t) return { error: "Pick both units." };
    let base = v * f.base;
    if (f.kind !== t.kind) {
      const dens = findDensity(ingredient);
      if (!dens) {
        return { error: "To swap between weight and volume, pick an ingredient I know (like flour, sugar, butter, milk)." };
      }
      base = f.kind === "volume" ? (base / UNITS.cup.base) * dens.g
                                 : (base / dens.g) * UNITS.cup.base;
    }
    const value = base / t.base;
    const shown = formatAmount(value, toUnit);
    return { value, text: shown + " " + label(toUnit, shown) };
  }

  const api = { parseLine, parseNumber, toFraction, scaleLine, scaleRecipe, convertMeasure,
    findDensity, UNITS, DENSITY };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Scaler = api;
})(typeof window !== "undefined" ? window : globalThis);
