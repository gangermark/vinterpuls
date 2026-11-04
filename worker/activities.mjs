const running=new Set(['running','trail_running','treadmill_running','track_running','indoor_running','ultra_run','virtual_run']);
const spinning=new Set(['indoor_cycling','virtual_ride','virtual_cycling']);
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
export function normalizeActivities(rows){
 if(!Array.isArray(rows))throw Error('Invalid Garmin response');
 const result=[],seen=new Set();
 for(const row of rows){
  if(!row||typeof row!=='object')continue;
  const key=row.activityType?.typeKey;
  const activityType=running.has(key)?'running':spinning.has(key)?'spinning':null;
  const id=typeof row.activityId==='number'&&Number.isSafeInteger(row.activityId)&&row.activityId>0?String(row.activityId):typeof row.activityId==='string'&&/^[1-9]\d{0,24}$/.test(row.activityId)?row.activityId:null;
  const date=typeof row.startTimeLocal==='string'?row.startTimeLocal.slice(0,10):'';
  if(!activityType||!id||seen.has(id)||!validDate(date)||!Number.isFinite(row.duration)||row.duration<=0||row.duration>600000)continue;
  if(activityType==='running'&&(!Number.isFinite(row.distance)||row.distance<=0||row.distance>1000000))continue;
  seen.add(id);
  result.push({id,name:typeof row.activityName==='string'?row.activityName.slice(0,160):(activityType==='running'?'Löpning':'Spinning'),date,activityType,durationMinutes:Math.round(row.duration/60*100)/100,...(activityType==='running'?{distanceKm:Math.round(row.distance/1000*1000)/1000}:{}),...(Number.isFinite(row.averageHR)&&row.averageHR>0&&row.averageHR<=250?{averageHeartRate:Math.round(row.averageHR)}:{})});
 }
 return result;
}
