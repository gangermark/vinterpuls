import type {Entry} from './store';
export function summarizeWeek(entries: Entry[]) {
  const running=entries.filter(e=>e.completed&&e.activityType==='running');
  const spinning=entries.filter(e=>e.completed&&e.activityType==='spinning');
  const runningKm=running.reduce((n,e)=>n+(e.distanceKm||0),0);
  const runningMinutes=running.reduce((n,e)=>n+(e.durationMinutes||0),0);
  const spinningMinutes=spinning.reduce((n,e)=>n+(e.durationMinutes||0),0);
  return {runningKm,runningMinutes,spinningMinutes,totalMinutes:runningMinutes+spinningMinutes};
}

export function performedDate(entry: Entry, sessions: {id:string;date:string}[]) {
  return entry.performedDate ?? sessions.find(s=>s.id===entry.sessionId)?.date ?? '';
}
export function entriesBetween(entries:Entry[], sessions:{id:string;date:string}[], start:string,end:string) {
  return entries.filter(e=>{const d=performedDate(e,sessions);return d>=start&&d<=end});
}
