import type {Entry} from './store';
export function summarizeWeek(entries: Entry[]) {
  const running=entries.filter(e=>e.completed&&e.activityType==='running');
  const spinning=entries.filter(e=>e.completed&&e.activityType==='spinning');
  const runningKm=running.reduce((n,e)=>n+(e.distanceKm||0),0);
  const runningMinutes=running.reduce((n,e)=>n+(e.durationMinutes||0),0);
  const spinningMinutes=spinning.reduce((n,e)=>n+(e.durationMinutes||0),0);
  return {runningKm,runningMinutes,spinningMinutes,totalMinutes:runningMinutes+spinningMinutes};
}
