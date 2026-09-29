(()=>{
  if(window.__vyrdictVisitorContextV1)return;
  window.__vyrdictVisitorContextV1=1;

  const VISITOR_KEY='vyrdict:visitor:v1';
  const SESSION_KEY='vyrdict:session:v1';
  const ANALYTICS_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-analytics';
  const now=Date.now();
  const makeId=prefix=>{
    try{return prefix+'_'+crypto.randomUUID()}
    catch{return prefix+'_'+Math.random().toString(36).slice(2)+Date.now().toString(36)}
  };

  let visitor=null;
  try{visitor=JSON.parse(localStorage.getItem(VISITOR_KEY)||'null')}catch{}
  if(!visitor||typeof visitor!=='object'||typeof visitor.id!=='string'){
    visitor={id:makeId('v'),firstSeen:now,lastSeen:now,visits:0};
  }
  visitor.firstSeen=Number(visitor.firstSeen)||now;
  visitor.lastSeen=now;
  visitor.visits=Math.max(0,Number(visitor.visits)||0);

  let session=null;
  try{session=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch{}
  if(!session||typeof session!=='object'||typeof session.id!=='string'){
    visitor.visits+=1;
    session={id:makeId('s'),startedAt:now,visitNumber:visitor.visits};
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(session))}catch{}
  }else{
    session.visitNumber=Math.max(1,Number(session.visitNumber)||visitor.visits||1);
  }
  visitor.visits=Math.max(visitor.visits,session.visitNumber);
  try{localStorage.setItem(VISITOR_KEY,JSON.stringify(visitor))}catch{}

  const context={
    visitor_id:visitor.id,
    session_id:session.id,
    visitor_first_seen_at:new Date(visitor.firstSeen).toISOString(),
    visit_number:session.visitNumber,
    visit_type:session.visitNumber>1?'returning':'new'
  };
  window.VyrdictVisitorContext=context;

  const nativeFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    try{
      const rawUrl=typeof input==='string'||input instanceof URL?String(input):String(input?.url||'');
      const method=String(init?.method||input?.method||'GET').toUpperCase();
      if(method==='POST'&&rawUrl.startsWith(ANALYTICS_ENDPOINT)&&typeof init?.body==='string'){
        const body=JSON.parse(init.body);
        if(body&&typeof body==='object'){
          const next={...body,...context};
          return nativeFetch(input,{...init,body:JSON.stringify(next)});
        }
      }
    }catch{}
    return nativeFetch(input,init);
  };
})();
