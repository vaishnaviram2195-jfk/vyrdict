const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { stripTypeScriptTypes } = require('node:module');
const vm = require('node:vm');
const path = require('node:path');

function load(name, fetchImpl) {
  let handler;
  const ctx = vm.createContext({
    Deno: { env: { get: n => n === 'SUPABASE_URL' ? 'https://db.example' : 'test-key' }, serve: h => { handler = h; } },
    fetch: fetchImpl, AbortController, AbortSignal, URL, Response, Request, Headers,
    crypto, TextEncoder, setTimeout, clearTimeout, console,
  });
  const source = readFileSync(path.join(__dirname, '..', 'supabase', 'functions', name, 'index.ts'), 'utf8');
  vm.runInContext(stripTypeScriptTypes(source), ctx);
  return { ctx, handler, eval: code => vm.runInContext(code, ctx) };
}
const json = data => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });

test('research limits concurrency and completes other candidates after a failure', async () => {
  const m = load('vyrdict-candidate-research', () => {});
  let active = 0, peak = 0;
  m.ctx.work = async c => {
    peak = Math.max(peak, ++active);
    await new Promise(r => setTimeout(r, 5));
    active--;
    if (c.id === 2) throw new Error('source unavailable');
    return { candidate_id: c.id };
  };
  const res = await m.eval('researchBatch([{id:1},{id:2},{id:3},{id:4}],work)');
  assert.equal(peak, 2);
  assert.equal(res.filter(r => !r.error).length, 3);
  assert.match(res[1].error, /source unavailable/);
});

test('source body consumption remains covered by the timeout', async () => {
  const m = load('vyrdict-candidate-research', async (_, opts) => ({
    status: 200, ok: true, headers: new Headers({ 'content-type': 'text/html' }),
    text: () => new Promise((_, reject) => opts.signal.addEventListener('abort', () => reject(new Error('body aborted')), { once: true })),
  }));
  await assert.rejects(m.eval("sf('https://brand.example/product',20)"), /body aborted/);
});

test('research rejects redirects to private hosts before fetching them', async () => {
  const calls = [];
  const m = load('vyrdict-candidate-research', async url => {
    calls.push(url);
    return new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/secret' } });
  });
  await assert.rejects(m.eval("sf('https://brand.example/product')"), /unsafe_redirect/);
  assert.equal(calls.length, 1);
});

test('observed product evidence does not grant verification or publication', async () => {
  const writes = [];
  const html = '<script type="application/ld+json">{"@type":"Product","name":"Acme Aurora Lamp","brand":{"name":"Acme"},"image":"https://brand.example/lamp.jpg","offers":{"price":"49","priceCurrency":"CAD"},"aggregateRating":{"ratingValue":"4.5","reviewCount":"20"}}</script>';
  const m = load('vyrdict-candidate-research', async (url, opts = {}) => {
    if (url.startsWith('https://db.example')) {
      if (opts.method) writes.push({ url, body: JSON.parse(opts.body) });
      return json([]);
    }
    return new Response(html, { headers: { 'content-type': 'text/html' } });
  });
  const result = await m.eval("one({id:1,product_name:'Acme Aurora Lamp',submitted_url:'https://brand.example/product'})");
  assert.equal(result.product_records_observed, 1);
  const evidence = writes.filter(w => w.url.includes('vyrdict_candidate_evidence'));
  assert.equal(evidence.length, 2);
  assert(evidence.every(w => w.body.verification_status === 'observed'));
  assert(writes.every(w => !('product_identity_verified' in w.body) && !('virality_verified' in w.body) && !('scoring_complete' in w.body)));
  assert(writes.every(w => !w.url.includes('/products')));
});

test('pulse refresh completes twelve products with bounded parallelism and preserves full-review dates', async () => {
  const writes = []; let active = 0, peak = 0;
  const m = load('vyrdict-trend-intelligence', async (url, opts = {}) => {
    if (url.startsWith('https://news.google.com')) {
      peak = Math.max(peak, ++active);
      await new Promise(r => setTimeout(r, 5)); active--;
      return new Response('<rss><channel></channel></rss>');
    }
    if (opts.method) {
      writes.push({ url, body: JSON.parse(opts.body) });
      return json(url.endsWith('/vyrdict_trend_runs') ? [{ id: 1 }] : []);
    }
    if (url.includes('/products?')) return json(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, brand: 'Acme', name: 'Aurora Lamp' })));
    return json([]);
  });
  const result = await m.eval('refresh()');
  assert.equal(result.status, 'succeeded');
  assert.equal(result.products_checked, 12);
  assert.equal(peak, 3);
  assert.equal(writes.filter(w => w.url.includes('/vyrdict_trend_pulses')).length, 12);
  assert(writes.every(w => !('last_verified_at' in w.body) && !('next_review_at' in w.body)));
});

test('both deployed handlers still reject unauthorized requests', async () => {
  for (const name of ['vyrdict-candidate-research', 'vyrdict-trend-intelligence']) {
    const m = load(name, () => { throw new Error('unauthorized fetch'); });
    assert.equal((await m.handler(new Request('https://example.test', { method: 'POST' }))).status, 401);
  }
});
