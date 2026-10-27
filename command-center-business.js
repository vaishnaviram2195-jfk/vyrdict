window.VyrdictBusinessPanel = function buildBusinessPanel(b){
  if(!b)return '<section class="panel" style="margin-bottom:18px"><h2>Business intelligence</h2><p class="sub">The new daily tracking report is temporarily unavailable.</p></section>';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=v=>Number(v||0).toLocaleString('en-CA');
  const dt=v=>v?new Date(v).toLocaleString('en-CA',{timeZone:'America/Toronto',month:'short',day:'numeric'}):'—';
  const cats=Array.isArray(b.categories)?b.categories:[];
  const freq=Array.isArray(b.frequent_visitors)?b.frequent_visitors:[];
  const inquiries=Array.isArray(b.work_inquiries)?b.work_inquiries:[];
  const accounts=Array.isArray(b.account_list)?b.account_list:[];
  const subs=Array.isArray(b.newsletter_list)?b.newsletter_list:[];
  const wk=b.last7d||{},health=b.health||{};
  const tbl=(head,rows,empty)=>'<div class="bi-scroll"><table class="bi-table"><thead><tr>'+head.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+(rows.length?rows.join(''):'<tr><td colspan="'+head.length+'">'+esc(empty)+'</td></tr>')+'</tbody></table></div>';
  const metric=(name,value,meta)=>'<div class="metric"><div class="label">'+esc(name)+'</div><div class="value">'+num(value)+'</div><div class="delta">'+esc(meta)+'</div></div>';
  const status=health.rollup_job_active&&!health.snapshot_stale?'Daily tracking running':'Check the daily refresh';
  const catRows=cats.slice(0,15).map(x=>'<tr><td><strong>'+esc(x.category)+'</strong></td><td>'+num(x.category_views)+'</td><td>'+num(x.category_clicks)+'</td><td>'+num(x.product_views)+'</td><td>'+num(x.product_opens)+'</td><td>'+num(x.retailer_clicks)+'</td></tr>');
  const freqRows=freq.slice(0,15).map(x=>'<tr><td>Browser '+esc(x.browser_code)+'</td><td>'+num(x.sessions)+'</td><td>'+num(x.active_days)+'</td><td>'+num(x.page_views)+'</td><td>'+dt(x.last_seen)+'</td></tr>');
  const inquiryRows=inquiries.slice(0,12).map(x=>'<tr><td>'+dt(x.created_at)+'</td><td><strong>'+esc(x.name)+'</strong><div class="sub">'+esc(x.company)+'</div></td><td>'+esc(x.email)+'</td><td>'+esc(x.service||'Not specified')+'</td><td>'+esc(x.brief_preview||'')+'</td></tr>');
  const accountRows=accounts.slice(0,15).map(x=>'<tr><td>'+esc(x.email)+'</td><td>'+dt(x.created_at)+'</td><td>'+(x.email_confirmed?'Confirmed':'Unconfirmed')+'</td><td>'+dt(x.last_sign_in_at)+'</td></tr>');
  const subscriberRows=subs.slice(0,20).map(x=>'<tr><td>'+esc(x.email)+'</td><td>'+esc(x.status)+'</td><td>'+esc(x.source)+'</td><td>'+dt(x.created_at)+'</td></tr>');
  const total=Number(wk.page_views||0),known=Number(wk.unique_browsers||0);
  return '<section class="bi-root" aria-label="VYRDICT daily business intelligence">'+
    '<div class="bi-heading"><div><div class="eyebrow">BUSINESS INTELLIGENCE · TORONTO TIME</div><h2>What is growing? What needs attention?</h2><p class="sub">Daily snapshots are refreshed hourly. Source tables cover work enquiries, Supabase accounts, newsletter signups, anonymous browser sessions, and category engagement.</p></div><div class="live"><span class="dot"></span> '+esc(status)+'</div></div>'+
    '<section class="metrics">'+
    metric('Work enquiries',b.work_total,'All recorded Studio form submissions')+
    metric('Frequent browsers',b.frequent_visitor_count,'3+ sessions on 2+ different days · 30d')+
    metric('Registered accounts',b.account_total,'Email account records · not sign-in events')+
    metric('Active newsletter',b.newsletter_active,'Unsubscribed: '+num(b.newsletter_unsubscribed))+
    metric('Visitors · 7 days',known,'Identifiable anonymous browsers')+
    metric('Shopping clicks · 7 days',wk.retailer_clicks,'Retails clicks · not confirmed orders')+'</section>'+
    '<section class="panel" style="margin-bottom:18px"><h2>Daily progress</h2><p class="sub">Last 14 calendar days. Page views are events, not unique visitors; missing historic tagging is not reconstructed.</p>'+
     tbl(['Date','Page views','Browsers','Returning','Product opens','Shopping clicks','Work','Accounts','Newsletter'],(b.daily||[]).slice(-14).reverse().map(x=>'<tr><td>'+esc(x.date)+'</td><td>'+num(x.page_views)+'</td><td>'+num(x.visitors)+'</td><td>'+num(x.returning_browsers)+'</td><td>'+num(x.product_opens)+'</td><td>'+num(x.retailer_clicks)+'</td><td>'+num(x.work_inquiries)+'</td><td>'+num(x.new_accounts)+'</td><td>'+num(x.newsletter_signups)+'</td></tr>'),'No snapshots recorded')+'</section>'+
    '<section class="panel" style="margin-bottom:18px"><h2>Which categories perform best?</h2><p class="sub">Past 14 days · category visits, category-link clicks, visits to product pages, product opens and shopping clicks. View each column separately; a click is not a sale. Historical categories may be undercounted until the new page trackers accumulate visits.</p>'+
     tbl(['Category','Page visits','Category clicks','Product views','Product opens','Shopping clicks'],catRows,'No category events recorded')+'</section>'+
    '<section class="panel" style="margin-bottom:18px"><h2>Frequent visitors</h2><p class="sub">Anonymous browser identifiers only. This does not identify individual people, and browser changes or blocked tracking affect counts. '+num(freq.length)+' frequent browser'+(freq.length===1?'':'s')+' in the latest 30-day report.</p>'+
     tbl(['Browser code','Sessions','Active days','Page views','Last seen'],freqRows,'No repeat browsers meeting the threshold')+'</section>'+
    '<section class="panel" style="margin-bottom:18px"><h2>Work enquiries · VYRDICT Studio</h2><p class="sub">Private business leads submitted through the Studio form. '+num(b.work_total)+' total submissions. New enquiries appear on the next dashboard fetch without waiting for daily snapshots.</p>'+
     tbl(['Received','Contact / company','Email','Service','Brief (preview)'],inquiryRows,'No Studio enquiries yet')+'</section>'+
    '<div class="grid2"><section class="panel"><h2>Accounts created</h2><p class="sub">Supabase registered email accounts (not total sign-ins or verified customers).</p>'+
     tbl(['Email','Created','Status','Last sign-in'],accountRows,'No account records')+'</section>'+
    '<section class="panel"><h2>Newsletter subscribers</h2><p class="sub">Primary and legacy website forms. Active '+num(b.newsletter_active)+' · unsubscribed '+num(b.newsletter_unsubscribed)+'.</p>'+
     tbl(['Email','Status','Signup source','Joined'],subscriberRows,'No newsletter signups')+'</section></div>'+
    '<p class="bi-caption">Data health: last incoming analytics event '+dt(health.last_received_event)+' · daily snapshot '+dt(health.last_rollup)+' · '+num(health.rollup_days)+' historical days available. For context: '+num(total)+' page views in the last 7 days; identifiable browsers are estimates, not people. Contact emails shown only in this key-protected private Command Center.</p>'+
    '</section>';
};
