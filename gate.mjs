// gate.mjs — the Modulus Indexer made operational: each claim a tagged template, read through a Proxy
// with Reflect, every reading caught, the outcomes written as WebVTT and their grammar as Wirth notation.
//
// After boxedPINE rosetta/src/grammar/interface.ts, the interface carrier: Proxy and Reflect perform
// access, Catch returns a structured outcome instead of swallowing an exception, and a tagged template
// keeps its literal strings apart from its interpolated values (MDN, JavaScript Guide, Meta programming).
//
// A claim is claim`literal ${reading} literal`, each reading a function of the environment. The claim
// HOLDS when every reading is true, FAILS when one is false, and otherwise is the error its reading threw,
// named as the JavaScript error reference names it (RangeError, ReferenceError, TypeError, ...): the
// catalog of outcomes, as an HTTP status names a response. The environment is a Proxy: a name it does not
// hold is not a zero or a guess but ReferenceError: "name" is not defined, the reference's own wording.
// prove.c's obligations can only hold; these claims can fail.
//
//	node gate.mjs		the outcomes as WebVTT on standard output; exit 0 when each is as predicted
//	node gate.mjs wsn	the outcome grammar in Wirth syntax notation

const catchValue = (run) => {
  try {
    return { ok: true, value: run() };
  } catch (error) {
    return { ok: false, error };
  }
};

const claim = (strings, ...values) => Object.freeze({
  strings,
  raw: strings.raw,
  values: Object.freeze([...values]),
  text: String.raw({ raw: strings.raw }, ...values.map((v) => (typeof v === "function" ? `\${${v.name || "reading"}}` : v))),
});

// ── the environment: what the claims may read, and nothing else ────────
const isPrime = (n) => {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
const factorial = (n) => {
  if (!Number.isInteger(n) || n < 0) throw new RangeError("argument must be a non-negative integer");
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
};
// the first p, below the bound, beginning k primes d apart; every such p, as a list
const progressions = (k, d, bound) => {
  const out = [];
  for (let p = 2; p < bound; p++) {
    let all = true;
    for (let i = 0; i < k && all; i++) all = isPrime(p + i * d);
    if (all) out.push(p);
  }
  return out;
};
const M = 0xffff;
const rotl = (x, n) => ((x << n) | (x >>> (16 - n))) & M;
const rotr = (x, n) => ((x >>> n) | (x << (16 - n))) & M;
const next = (x) => (rotl(x, 1) ^ rotl(x, 3) ^ rotr(x, 2) ^ 0x1d1d) & M;   // the delta law (I-197, I-248)

const held = { isPrime, factorial, progressions, next, apex: 5, ladder: 210, reticle: 65536 };
const env = new Proxy(held, {
  get(target, name, receiver) {
    if (!Reflect.has(target, name)) throw new ReferenceError(`"${String(name)}" is not defined`);
    return Reflect.get(target, name, receiver);
  },
  set(target, name) {
    throw new TypeError(`"${String(name)}" is read-only`);
  },
});

// ── the claims, with what each was predicted to give, written before running ──
const claims = [
  // the obligations of prove.c: they cannot fail, and do not
  [claim`7! is ${function seven(e) { return e.factorial(7) === 5040n; }}`, "HOLDS"],
  [claim`the ladder 210 is 2·3·5·7 ${function ladder(e) { return e.ladder === 2 * 3 * 5 * 7; }}`, "HOLDS"],
  // a claim that could have failed: 5 is the only prime beginning five primes six apart (below 100,000);
  // among five numbers six apart one is divisible by 5, so it must be 5 itself
  [claim`5 is the only prime beginning five primes six apart ${function onlyFive(e) { const s = e.progressions(5, 6, 100000); return s.length === 1 && s[0] === e.apex; }}`, "HOLDS"],
  // its falsifier: the same claim of 7 fails
  [claim`7 is the only prime beginning five primes six apart ${function onlySeven(e) { const s = e.progressions(5, 6, 100000); return s.length === 1 && s[0] === 7; }}`, "FAILS"],
  // four primes six apart are not unique (5, 11, 41, 61, ... begin them): the five is what makes 5 alone
  [claim`5 is the only prime beginning four primes six apart ${function onlyFiveOfFour(e) { return e.progressions(4, 6, 100000).length === 1; }}`, "FAILS"],
  // the delta law returns every word of the reticle at 8 (I-197)
  [claim`every 16-bit word is back after 8 steps of the delta law ${function eight(e) { for (let x = 0; x < e.reticle; x++) { let s = x; for (let i = 0; i < 8; i++) s = e.next(s); if (s !== x) return false; } return true; }}`, "HOLDS"],
  // and not at 4: some word is not back (I-248: under 0x1D1D, 61,440 turn in 8)
  [claim`every 16-bit word is back after 4 steps of the delta law ${function four(e) { for (let x = 0; x < e.reticle; x++) { let s = x; for (let i = 0; i < 4; i++) s = e.next(s); if (s !== x) return false; } return true; }}`, "FAILS"],
  // 97: no reading in the environment chooses it; the claim is not defined, and says so
  [claim`97 is the anchor because ${function anchor(e) { return e.anchor(97); }}`, 'ReferenceError: "anchor" is not defined'],
  // the environment cannot be written to
  [claim`the apex can be moved ${function moveApex(e) { e.apex = 7; return true; }}`, 'TypeError: "apex" is read-only'],
  // a reading that is not a number of the ladder: the reference's RangeError, caught, not swallowed
  [claim`a factorial of a fraction ${function half(e) { return e.factorial(0.5) > 0n; }}`, "RangeError: argument must be a non-negative integer"],
];

const read = (c) => {
  for (const reading of c.values) {
    if (typeof reading !== "function") continue;
    const r = catchValue(() => Reflect.apply(reading, undefined, [env]));
    if (!r.ok) return `${r.error.name}: ${r.error.message}`;
    if (r.value !== true) return "FAILS";
  }
  return "HOLDS";
};

const at = (i) => {
  const s = (n) => `00:${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}.000`;
  return `${s(i)} --> ${s(i + 1)}`;
};

if (process.argv[2] === "wsn") {
  process.stdout.write(`outcome = holds | fails | error .
holds = "HOLDS" .
fails = "FAILS" .
error = name ": " message .
name = "RangeError" | "ReferenceError" | "TypeError" | "SyntaxError" | "EvalError" | "URIError" | "AggregateError" | "InternalError" | "Error" .
message = character { character } .
cue = id newline timing newline text newline outcome newline .
`);
  process.exit(0);
}

let as = 0;
const out = ["WEBVTT", ""];
claims.forEach(([c, predicted], i) => {
  const outcome = read(c);
  if (outcome === predicted) as++;
  out.push(`claim-${i + 1}`, at(i), c.text, `${outcome}${outcome === predicted ? "" : `  (predicted ${predicted})`}`, "");
});
process.stdout.write(out.join("\n"));
process.stderr.write(`gate: ${as} of ${claims.length} claims as predicted\n`);
process.exit(as === claims.length ? 0 : 1);
