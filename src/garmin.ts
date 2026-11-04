import type {Entry} from './store';
export type GarminActivity={id:string;name:string;date:string;activityType:'running'|'spinning';distanceKm?:number;durationMinutes:number;averageHeartRate?:number};
export function validateActivities(value:unknown):GarminActivity[]{
 if(!Array.isArray(value)||value.length>500)throw Error('Ogiltigt svar från Garmin-anslutningen.');
 const seen=new Set<string>();return value.map(a=>{
  if(!a||typeof a!=='object'||typeof a.id!=='string'||!/^\d{1,25}$/.test(a.id)||seen.has(a.id)||typeof a.name!=='string'||a.name.length>160||typeof a.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||!Number.isFinite(Date.parse(a.date+'T12:00:00Z'))||new Date(a.date+'T12:00:00Z').toISOString().slice(0,10)!==a.date||!['running','spinning'].includes(a.activityType)||!Number.isFinite(a.durationMinutes)||a.durationMinutes<=0||a.durationMinutes>10000||(a.activityType==='running'&&(!Number.isFinite(a.distanceKm)||a.distanceKm<=0||a.distanceKm>1000))||(a.activityType==='spinning'&&a.distanceKm!==undefined)||(a.averageHeartRate!==undefined&&(!Number.isFinite(a.averageHeartRate)||a.averageHeartRate<=0||a.averageHeartRate>250)))throw Error('Ogiltigt svar från Garmin-anslutningen.');
  seen.add(a.id);return {id:a.id,name:a.name,date:a.date,activityType:a.activityType,durationMinutes:a.durationMinutes,...(a.activityType==='running'?{distanceKm:a.distanceKm}:{}),...(a.averageHeartRate!==undefined?{averageHeartRate:a.averageHeartRate}:{})};
 });
}
export function unimported(activities:GarminActivity[],entries:Entry[]){return activities.filter(a=>!entries.some(e=>e.garminActivityId===a.id))}
