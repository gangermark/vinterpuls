import type {Entry} from './store';
type Plan={id:string;date:string;title:string;loggingMode:string};
type Activity={date:string;activityType:string;durationMinutes?:number;distanceKm?:number};
const day=(date:string)=>Date.parse(date+'T12:00:00Z')/86400000;
export function suggestSessions<T extends Plan>(activity:Activity,sessions:T[],entries:Entry[]){
 return sessions.filter(s=>s.loggingMode==='full'&&!entries.some(e=>e.sessionId===s.id))
  .map(session=>({session,days:Math.abs(day(session.date)-day(activity.date))}))
  .filter(s=>s.days<=3).sort((a,b)=>a.days-b.days||a.session.id.localeCompare(b.session.id));
}
export function possibleDuplicates(activity:Activity,entries:Entry[],sessions:Plan[],excludeId?:string){
 return entries.filter(e=>e.sessionId!==excludeId&&e.activityType===activity.activityType&&
  (e.performedDate??sessions.find(s=>s.id===e.sessionId)?.date)===activity.date&&
  typeof e.durationMinutes==='number'&&typeof activity.durationMinutes==='number'&&
  Math.abs(e.durationMinutes-activity.durationMinutes)<=Math.max(2,activity.durationMinutes*.1)&&
  (activity.activityType!=='running'||(typeof e.distanceKm==='number'&&typeof activity.distanceKm==='number'&&Math.abs(e.distanceKm-activity.distanceKm)<=Math.max(.3,activity.distanceKm*.1))));
}
export function backupSnapshot(entries:Entry[],schedule:Record<string,string>){
 return JSON.stringify({entries:[...entries].sort((a,b)=>a.sessionId.localeCompare(b.sessionId)),schedule:Object.fromEntries(Object.entries(schedule).sort(([a],[b])=>a.localeCompare(b)))});
}
export function backupStatus(entries:Entry[],schedule:Record<string,string>,savedSnapshot:string,stamp:string,now=Date.now()){
 const hasData=entries.length>0||Object.keys(schedule).length>0;
 const changed=hasData&&backupSnapshot(entries,schedule)!==savedSnapshot;
 const age=Number.isFinite(Date.parse(stamp))?Math.max(0,(now-Date.parse(stamp))/86400000):Infinity;
 return {changed,due:changed&&(!savedSnapshot||age>=7),hasData};
}
