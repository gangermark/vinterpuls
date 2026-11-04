import {useEffect,useState} from 'react';
export function DeviceStatus(){
 const [online,setOnline]=useState(navigator.onLine);
 const [offlineReady,setOfflineReady]=useState(false);
 const [updated,setUpdated]=useState(false);
 useEffect(()=>{
  let alive=true; const wasControlled=!!navigator.serviceWorker?.controller;
  const connectivity=()=>setOnline(navigator.onLine);
  const changed=()=>{if(alive){setOfflineReady(true);if(wasControlled)setUpdated(true)}};
  window.addEventListener('online',connectivity);window.addEventListener('offline',connectivity);
  if('serviceWorker' in navigator){
   navigator.serviceWorker.addEventListener('controllerchange',changed);
   navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{if(alive)setOfflineReady(true)}).catch(()=>{});
  }
  return ()=>{alive=false;window.removeEventListener('online',connectivity);window.removeEventListener('offline',connectivity);navigator.serviceWorker?.removeEventListener('controllerchange',changed)};
 },[]);
 return <div className="device-status" role="status"><span>{offlineReady?(online?'✓ Redo att användas offline':'✓ Offline · loggning fungerar'):(online?'Förbereder offline…':'Offline · öppna appen online för att förbereda offline')}</span>{updated&&<button onClick={()=>window.location.reload()}>Ny version klar · uppdatera</button>}</div>;
}
