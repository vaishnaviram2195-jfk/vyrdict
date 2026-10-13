const fs = require('fs');
const path = require('path');
const PRODUCTS = 'https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/products';
const PUBLIC_KEY = 'sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';
const REV = '20261013-current-search-hub';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let template;

function pageTemplate() {
  if (!template) {
    const home = fs.readFileSync(path.join(process.cwd(), 'stable-home.html'), 'utf8');
    const header = home.match(/<header>[\s\S]*?<\/header>/)[0];
    template = fs.readFileSync(path.join(process.cwd(), 'search.html'), 'utf8').replace('{{HEADER}}', header);
  }
  return template;
}

function queryTerms(q) {
  // Only literal words enter PostgREST's filter grammar; punctuation is never a filter.
  return [...new Set(q.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])].slice(0, 12);
}

async function searchProducts(q) {
  const terms = queryTerms(q);
  if (q && !terms.length) return [];
  const params = new URLSearchParams({
    select: 'id,slug,brand,name,category,image_url,viral_score,worth_score,verdict',
    is_active: 'eq.true', evidence_status: 'eq.verified',
    order: q ? 'viral_score.desc,worth_score.desc' : 'last_verified_at.desc.nullslast,viral_score.desc',
    limit: q ? '60' : '12'
  });
  if (terms.length) {
    params.set('and', '(' + terms.map(term =>
      'or(' + ['name', 'brand', 'category', 'slug'].map(field => `${field}.ilike.*${term}*`).join(',') + ')'
    ).join(',') + ')');
  }
  const response = await fetch(PRODUCTS + '?' + params, {
    headers: {apikey: PUBLIC_KEY, Authorization: `Bearer ${PUBLIC_KEY}`, accept: 'application/json'},
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error('Product search unavailable');
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error('Invalid product response');
  return rows.filter(p => /^[a-z0-9][a-z0-9-]*$/i.test(String(p.slug || '')));
}

function productCard(p) {
  const brand = String(p.brand || '').trim();
  const name = String(p.name || '').trim();
  const label = brand && !name.toLowerCase().startsWith(brand.toLowerCase()) ? brand + ' ' + name : name;
  const image = /^https:\/\//i.test(String(p.image_url || '')) ? p.image_url : '';
  const score = value => Number.isFinite(Number(value)) && value !== null ? esc(value) : '—';
  return `<a class="search-card" href="/product/${encodeURIComponent(p.slug)}/"><div class="search-media">${image ? `<img loading="lazy" decoding="async" src="/vti-image?url=${encodeURIComponent(image)}" alt="${esc(label)}">` : '<span>VYRDICT</span>'}</div><div class="search-copy"><div class="search-category">${esc(p.category || 'Product')}</div><h2>${esc(label)}</h2><div class="search-scores"><span>Viral <b>${score(p.viral_score)}</b>/100</span><span>Worth <b>${score(p.worth_score)}</b>/100</span></div>${p.verdict ? `<p>${esc(p.verdict)}</p>` : ''}<span class="search-open">See the verdict →</span></div></a>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, follow');
  res.setHeader('X-VYRDICT-Search-Revision', REV);
  if (req.method && !['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }
  const raw = Array.isArray(req.query?.q) ? req.query.q[0] : req.query?.q;
  const q = String(raw || '').trim().slice(0, 120);
  let rows = [], unavailable = false;
  try { rows = await searchProducts(q); } catch { unavailable = true; }
  const label = unavailable ? 'Search is temporarily unavailable.' : q
    ? `${rows.length === 60 ? 'Showing ' : ''}${rows.length} ${rows.length === 1 ? 'match' : 'matches'} for “${q}”`
    : 'Explore scored products.';
  const results = unavailable
    ? '<div class="search-empty"><h2>Try again in a moment.</h2><p>Your search is still in the box above.</p></div>'
    : rows.length ? `<div class="search-grid">${rows.map(productCard).join('')}</div>`
    : '<div class="search-empty"><h2>No matching products yet.</h2><p>Try the product name, brand or category.</p><a href="/suggest-product.html">Request a VYRDICT →</a></div>';
  const replacements = {'{{QUERY}}': esc(q), '{{RESULT_LABEL}}': esc(label), '{{RESULTS}}': results};
  const html = pageTemplate().replace(/\{\{QUERY\}\}|\{\{RESULT_LABEL\}\}|\{\{RESULTS\}\}/g, token => replacements[token]);
  return res.status(unavailable ? 503 : 200).send(req.method === 'HEAD' ? '' : html);
};
