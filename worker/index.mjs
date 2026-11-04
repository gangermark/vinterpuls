import {normalizeActivities} from './activities.mjs';
const HOST='https://personal.connectapi.garmin.com';
export function createWorker(upstream=fetch){
 let cachedToken=null;
 async function token(env,renew=false){
  if(!renew&&cachedToken?.key===env.GARMIN_API_KEY&&cachedToken.expires>Date.now())return cachedToken.token;
  const r=await upstream(HOST+'/personalapitoken-service/personal-api/personal-api-key/token',{method:'POST',headers:{Authorization:'ApiKey '+env.GARMIN_API_KEY,Accept:'*/*'},signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('garmin_auth');
  const accessToken=(await r.text()).trim();let expires;try{const payload=accessToken.split('.')[1];const data=JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')));expires=Number(data.exp)*1000;if(!Number.isFinite(expires)||expires<=Date.now())throw Error()}catch{throw Error('garmin_token_format')}
  cachedToken={key:env.GARMIN_API_KEY,token:accessToken,expires:Math.min(expires-60000,Date.now()+82800000)};return accessToken;
 }
 return {async fetch(request,env){
  const origin=request.headers.get('Origin');
  const allowed=env.ALLOWED_ORIGIN||'https://gangermark.github.io';
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff',...(origin===allowed?{'Access-Control-Allow-Origin':allowed}:{})};
  const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(origin&&origin!==allowed)return reply({error:'Origin not allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Authorization','Access-Control-Max-Age':'600'}});
  const url=new URL(request.url);
  if(url.pathname==='/status'&&request.method==='GET')return reply({service:'vinterpuls-garmin',configured:!!env.GARMIN_API_KEY&&!!env.APP_ACCESS_TOKEN});
  if(url.pathname!=='/activities'||request.method!=='GET')return reply({error:'Not found'},404);
  if(!env.GARMIN_API_KEY||!env.APP_ACCESS_TOKEN||env.APP_ACCESS_TOKEN.length<16)return reply({error:'Anslutningen är inte färdigkonfigurerad.'},503);
  const supplied=request.headers.get('Authorization')||'';
  const hash=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
  const [a,b]=await Promise.all([hash(supplied),hash('Bearer '+env.APP_ACCESS_TOKEN)]);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
  if(diff)return reply({error:'Anslutningskoden är felaktig.'},401);
  try{
   let access=await token(env);const now=new Date();const endDate=now.toLocaleDateString('sv-SE',{timeZone:'Europe/Stockholm'});const since=new Date(now.getTime()-30*86400000).toLocaleDateString('sv-SE',{timeZone:'Europe/Stockholm'});
   const rows=[];let truncated=false;
   for(let page=0;page<5;page++){
    const query=new URLSearchParams({start:String(page*100),limit:'100',startDate:since,endDate,sortOrder:'desc',sortBy:'startLocal',excludeChildren:'true'});
    const get=()=>upstream(HOST+'/activitylist-service/activities/search/activities?'+query,{headers:{Authorization:'Bearer '+access,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
    let r=await get();if(r.status===401){access=await token(env,true);r=await get()}
    if(r.status===429)return reply({error:'Garmin ber oss vänta. Försök igen om en stund.'},429);
    if(!r.ok)throw Error('garmin_fetch');const data=await r.json();if(!Array.isArray(data))throw Error('garmin_fetch');rows.push(...data);if(data.length<100)break;if(page===4)truncated=true;
   }
   return reply({activities:normalizeActivities(rows),fromDate:since,untilDate:endDate,truncated,checkedAt:new Date().toISOString()});
  }catch(e){return reply({error:e.message==='garmin_auth'?'Garmin-nyckeln kunde inte användas. Kontrollera giltighetstiden i Garmin Connect.':'Garmin kunde inte nås. Försök igen senare.'},502)}
 }};
}
export default createWorker();
