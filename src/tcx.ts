export type TcxSummary={distanceKm:number;durationMinutes:number;averageHeartRate?:number;date?:string;warnings:string[]};
const children=(el:Element,name:string)=>Array.from(el.children).filter(e=>e.localName===name);
const descendants=(el:Element,name:string)=>Array.from(el.getElementsByTagNameNS('*',name));
function numeric(el:Element,name:string){const raw=children(el,name)[0]?.textContent?.trim();if(!raw)return undefined;const n=Number(raw);return Number.isFinite(n)&&n>=0?n:undefined}
function heart(el:Element,name:string){const box=children(el,name)[0];return box?numeric(box,'Value'):undefined}
/** Reads activity summaries only. Coordinates and original XML are never retained. */
export function parseTcx(xml:string):TcxSummary{
 if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Filen innehåller XML-deklarationer som inte stöds.');
 const doc=new DOMParser().parseFromString(xml,'application/xml');
 if(doc.getElementsByTagName('parsererror').length||doc.getElementsByTagNameNS('*','parsererror').length||doc.documentElement?.localName!=='TrainingCenterDatabase')throw Error('Filen är inte en giltig TCX-fil.');
 const activities=descendants(doc.documentElement,'Activity');
 if(activities.length!==1)throw Error('Välj en TCX-fil med exakt ett löppass.');
 const activity=activities[0];if(activity.getAttribute('Sport')?.toLowerCase()!=='running')throw Error('Filen måste innehålla ett löppass (Running).');
 const laps=children(activity,'Lap');if(!laps.length)throw Error('Filen saknar varvdata.');
 const warnings:string[]=[];
 let distance=0,seconds=0,pulseSum=0,pulseSeconds=0,allPulse=true;
 for(const lap of laps){const points=descendants(lap,'Trackpoint');let d=numeric(lap,'DistanceMeters');let t=numeric(lap,'TotalTimeSeconds');
 if(d===undefined){const distances=points.map(p=>numeric(p,'DistanceMeters')).filter((v):v is number=>v!==undefined);if(distances.length){d=distances.reduce((a,b)=>Math.max(a,b),0);warnings.push('Distans hämtad från spårpunkter; kontrollera värdet före sparning.')}}
 if(t===undefined){const times=points.map(p=>Date.parse(children(p,'Time')[0]?.textContent||'')).filter(Number.isFinite);if(times.length>=2){t=(times.reduce((a,b)=>Math.max(a,b),-Infinity)-times.reduce((a,b)=>Math.min(a,b),Infinity))/1000;warnings.push('Tid beräknad från spårpunkter och kan inkludera pauser.')}}
 if(d===undefined||t===undefined||t<=0)throw Error('Filen saknar användbar distans eller tid. Registrera passet manuellt.');
 // Garmin track distances may be cumulative across laps. Avoid summing inferred values.
 if(numeric(lap,'DistanceMeters')===undefined&&laps.length>1)throw Error('Varven saknar totaldistans. Registrera distansen manuellt.');
 distance+=d;seconds+=t;const hr=heart(lap,'AverageHeartRateBpm');if(hr!==undefined&&hr>0&&hr<=250){pulseSum+=hr*t;pulseSeconds+=t}else allPulse=false;
 }
 if(!(distance>0&&distance<=1_000_000&&seconds>0&&seconds<=600_000))throw Error('Distansen eller tiden ligger utanför appens tillåtna intervall.');
 const averageHeartRate=allPulse&&pulseSeconds>0?Math.round(pulseSum/pulseSeconds):undefined;
 if(averageHeartRate===undefined)warnings.push('Snittpuls saknas eller är ofullständig. Du kan fylla i den själv.');
 const date=children(activity,'Id')[0]?.textContent?.trim();
 return{distanceKm:Math.round(distance/10)/100,durationMinutes:Math.round(seconds/6)/10,averageHeartRate,date:date&&Number.isFinite(Date.parse(date))?date:undefined,warnings:[...new Set(warnings)]};
}
