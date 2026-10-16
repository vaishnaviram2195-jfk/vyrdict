/* First-party hub funnel. Browser IDs rotate after 30 days; sessions expire after 30 idle minutes. */
(() => {
  'use strict';
  if (window.__vyrdictHubAnalytics) return;
  window.__vyrdictHubAnalytics = true;
  const API = 'https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-analytics';
  const DAY = 86400000, IDLE = 30 * 60000, now = Date.now();
  const read = (storage, key) => { try { return JSON.parse(storage.getItem(key) || 'null'); } catch { return null; } };
  const write = (storage, key, value) => { try { storage.setItem(key, JSON.stringify(value)); } catch {} };
  const id = prefix => prefix + '_' + crypto.randomUUID();
  const valid = (value, prefix) => typeof value === 'string' && new RegExp('^' + prefix + '_[a-z0-9-]{8,72}$', 'i').test(value);
  const url = new URL(location.href);
  const isHub = /^\/links(?:\/index\.html)?\/?$/.test(url.pathname);
  const queryQA = ['qa', 'nav-health', 'studio_nav'].some(key => url.searchParams.has(key));
  if (queryQA) write(sessionStorage, 'vyrdict:analytics:qa', true);
  if (queryQA || read(sessionStorage, 'vyrdict:analytics:qa') || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') {
    window.VyrdictTrackingDisabled = true;
    return;
  }
  let visitor = read(localStorage, 'vyrdict:hub:visitor:v1');
  if (!visitor || !valid(visitor.id, 'v') || !Number.isFinite(visitor.started) || now - visitor.started > 30 * DAY || visitor.started > now) {
    visitor = { id: id('v'), started: now, visits: 0 };
  }
  let session = read(sessionStorage, 'vyrdict:hub:session:v1');
  function freshSession() {
    visitor.visits = Math.max(0, Number(visitor.visits) || 0) + 1;
    session = { id: id('s'), last: Date.now(), entry: url.pathname, referrer: document.referrer || '', landing: url.pathname + url.search, visit: visitor.visits };
  }
  if (!session || !valid(session.id, 's') || !Number.isFinite(session.last) || now - session.last >= IDLE || session.last > now) freshSession();
  function context() {
    if (Date.now() - session.last >= IDLE) freshSession();
    session.last = Date.now();
    write(localStorage, 'vyrdict:hub:visitor:v1', visitor);
    write(sessionStorage, 'vyrdict:hub:session:v1', session);
    const value = { visitor_id: visitor.id, session_id: session.id, visitor_first_seen_at: new Date(visitor.started).toISOString(), visit_number: session.visit, visit_type: session.visit > 1 ? 'returning' : 'new', landing_path: session.landing, landing_referrer: session.referrer };
    window.VyrdictVisitorContext = value;
    return value;
  }
  window.VyrdictTrackingContext = context;
  context();
  let view = id('h');
  const pageKind = isHub ? 'hub' : url.pathname.startsWith('/edit/') ? 'edit' : url.pathname.startsWith('/links/studio') ? 'studio' : url.pathname.startsWith('/links/work') ? 'work' : 'home';
  function send(event, extra = {}) {
    const payload = { event_name: event, event_id: id('e'), path: location.pathname + location.search + location.hash, referrer: document.referrer || null, page_kind: pageKind, source: 'hub_v1', ...context(), ...extra };
    try { fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {}); } catch {}
  }
  const targets = {
    products: u => (u.pathname === '/' && !u.hash) || /^\/edit\/haunted-antiques(?:\/index\.html)?\/?$/.test(u.pathname),
    studio: u => /^\/links\/studio(?:\/index\.html)?\/?$/.test(u.pathname),
    work: u => /^\/links\/work(?:\/index\.html)?\/?$/.test(u.pathname),
    news: u => u.pathname === '/' && u.hash === '#news'
  };
  const section = url.searchParams.get('vyrdict_hub_section');
  const click = url.searchParams.get('vyrdict_hub_click');
  const originView = url.searchParams.get('vyrdict_hub_visit');
  if (targets[section] && targets[section](url) && valid(click, 'c') && valid(originView, 'h')) {
    // Strip only our attribution keys; preserve campaign tags, hashes and all other query parameters.
    for (const key of ['vyrdict_hub_section', 'vyrdict_hub_click', 'vyrdict_hub_visit']) url.searchParams.delete(key);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    send('hub_destination_view', { hub_section: section, hub_click_id: click, hub_visit_id: originView });
  }
  // The product site already sends page_view. Hub/Studio/Work pages did not have a tracker.
  if (!document.querySelector('script[src*="/analytics.js"]')) send('page_view');
  function hubView() { send('hub_view', { hub_visit_id: view, hub_is_entry: /^\/links(?:\/index\.html)?\/?$/.test(session.entry) }); }
  if (!isHub) return;
  hubView();
  addEventListener('pageshow', event => { if (event.persisted) { view = id('h'); hubView(); } });
  const links = [...document.querySelectorAll('a[href]')];
  for (const link of links) {
    const original = link.getAttribute('href');
    let dest;
    try { dest = new URL(original, location.href); } catch { continue; }
    const own = dest.hostname === 'vyrdict.com' || dest.hostname === 'www.vyrdict.com';
    const key = own ? Object.keys(targets).find(key => targets[key](dest)) : dest.hostname === 'www.instagram.com' ? 'instagram' : dest.protocol === 'mailto:' ? 'email' : null;
    if (!key) continue;
    function track(event) {
      if (event.defaultPrevented || (event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
      const clickId = id('c');
      send('hub_click', { hub_section: key, hub_click_id: clickId, hub_visit_id: view });
      if (own) {
        const next = new URL(original, location.href);
        next.searchParams.set('vyrdict_hub_section', key);
        next.searchParams.set('vyrdict_hub_click', clickId);
        next.searchParams.set('vyrdict_hub_visit', view);
        link.setAttribute('href', next.href);
        setTimeout(() => link.setAttribute('href', original), 0);
      }
    }
    link.addEventListener('click', track);
    link.addEventListener('auxclick', track);
  }
})();
