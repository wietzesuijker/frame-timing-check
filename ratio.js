// Port of timing_analysis.py timing()/ratio(): mean s per empty and animal frame, ratio of means, 95% percentile bootstrap CI.
// Exclusion: a frame is dropped iff its image failed to load or its seconds exceed MAX_S. Stratum comes from the frozen design (strata.json), not the answer.
// The CI uses 10000 resamples per stratum, frames resampled within stratum, like numpy; the PRNG is seeded (mulberry32, seed 0), so the CI matches numpy's only up to bootstrap noise. The means and ratio are exact.
const MAX_S = 120, B = 10000, EMPTY_BREAKEVEN = 0.41;

function mulberry32(a) {
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const mean = x => x.reduce((s, v) => s + v, 0) / x.length;
// numpy.percentile, linear interpolation
function pct(sorted, p) { const k = (sorted.length - 1) * p / 100, f = Math.floor(k), c = Math.min(f + 1, sorted.length - 1); return sorted[f] + (sorted[c] - sorted[f]) * (k - f); }

// rows: [{row, seconds, answer}]; strata: {row: unlabelable (bool)}
function ratioResult(rows, strata, seed = 0) {
  const rnd = mulberry32(seed), res = {}, boots = {};
  for (const [name, unl] of [['empty', true], ['animal', false]]) {
    const all = rows.filter(r => strata[r.row] === unl);
    const x = all.filter(r => String(r.answer).trim().toLowerCase() !== 'load_error' && Number.isFinite(r.seconds) && r.seconds <= MAX_S).map(r => r.seconds);
    if (!x.length) throw new Error(`no timed ${name} frames left after exclusion`);
    const b = new Float64Array(B);
    for (let i = 0; i < B; i++) { let s = 0; for (let j = 0; j < x.length; j++) s += x[Math.floor(rnd() * x.length)]; b[i] = s / x.length; }
    boots[name] = b; res[name] = { n: x.length, n_excluded: all.length - x.length, mean_s: mean(x) };
  }
  const rb = Float64Array.from(boots.empty, (v, i) => v / boots.animal[i]).sort();
  res.ratio = res.empty.mean_s / res.animal.mean_s;
  res.ratio_ci95 = [pct(rb, 2.5), pct(rb, 97.5)];
  return res;
}
const SENTENCE = `Appendix V.5: on iWildCam the anchored arm's same-time gain is significant when this ratio is ${EMPTY_BREAKEVEN} or more.`;
if (typeof module !== 'undefined') module.exports = { ratioResult, SENTENCE };
