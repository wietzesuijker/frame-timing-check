// node test_ratio.js SESSION.csv : run the page's ratio code on a saved session CSV
const fs = require('fs'), { ratioResult, SENTENCE } = require('./ratio.js'), { STRATA } = require('./strata.js');
const [head, ...lines] = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const c = Object.fromEntries(head.map((h, i) => [h, i]));
const rows = lines.map(l => ({ row: l[c.row], seconds: parseFloat(l[c.seconds]), answer: l[c.answer] }));
const r = ratioResult(rows, STRATA);
const f = (v, d) => v.toFixed(d);
console.log(`seconds per empty frame ${f(r.empty.mean_s, 2)} (n=${r.empty.n}), per animal frame ${f(r.animal.mean_s, 2)} (n=${r.animal.n})`);
console.log(`t_e/t_a = ${f(r.ratio, 3)}  95% CI [${f(r.ratio_ci95[0], 2)}, ${f(r.ratio_ci95[1], 2)}]`);
console.log(`ratio exact ${r.ratio}`, SENTENCE);
