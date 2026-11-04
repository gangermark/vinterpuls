# Vinterpuls

Svensk PWA för vinterprogrammet 2 november 2026–24 januari 2027.

## Starta lokalt
Kräver Node.js 22 eller senare. Installera med `npm install` (eller `pnpm install` med medföljande låsfil). Starta med `npm run dev`. Bygg med `npm run build` och förhandsvisa produktionsbygget med `npm run preview`.

## Funktioner
Veckoplan för 12 veckor och 84 dagar, dagens pass, löp-/spinninglogg, veckostatistik, enkel avprickning av löpstyrka och JSON-export/import. StrongLifts visas men kan inte registreras. Ingen höftstatus eller hälsorelaterade frågor.

Träningsloggen sparas i IndexedDB i aktuell webbläsare, separat per program och pass. Ingen synkronisering mellan enheter. Exportera loggen för säkerhetskopiering eller flytt till annan webbläsare. Import sammanfogar poster och ersätter samma pass-id. Felaktiga filer avvisas innan lagringen ändras.

## PWA och offline
Publicera `dist/` över HTTPS. Efter första onlinebesöket cachas appfilerna. Offline-stöd kräver att service worker hunnit installeras. Typsnitt har lokala reservtypsnitt när nätet saknas. Loggen fungerar offline. iPhone: öppna länken i Safari, välj Dela → Lägg till på hemskärmen. På andra enheter finns Installera i appen eller webbläsarens meny.

## Flytta från gamla appen
Se [MIGRATION.md](MIGRATION.md) för steg, säkerhetskopiering och hur konflikter mellan enheter hanteras.

## GitHub Pages
`npm run build` skapar en statisk `dist/` med relativa sökvägar, även för ett repository under en undersökväg. Publicera den katalogen med GitHub Pages Actions (`actions/upload-pages-artifact` med path `dist`, följt av `actions/deploy-pages`). Kör alltid hela byggkommandot så service workerns lista över filer uppdateras.

## Projekt
React, TypeScript och Vite. `src/program.json` är ursprungsprogrammet, `src/store.ts` hanterar loggen, `scripts/offline.mjs` genererar offline-cache efter bygge. Program-id är `vinter-2026-12v`. Framtida program kan läggas till genom separat programdata och nytt stabilt id; användargränssnitt för programimport ingår inte i denna version.

Programmet har återskapats från den tidigare chattens översikt; se det ursprungliga byggunderlagets README för vilka passdetaljer som kompletterats.

## Garmin TCX-import
Öppna ett löppass, välj Löpning och Importera TCX. Exportera först aktiviteten som TCX från Garmin Connect och välj filen på enheten. Förhandsgranska värdena och välj Använd uppgifterna i formuläret; spara därefter passet. Importen ersätter distans, tid och puls i formuläret men behåller ansträngning och anteckning. Saknad puls lämnas tom. Ingen registrering sparas automatiskt och filen eller GPS-spåret lagras inte.

Importen accepterar ett Running-pass per fil, högst 20 MB. Distans och tid summeras över varv. Snittpuls viktas med varvens tid när alla varv har snittpuls; annars lämnas den tom. Saknade varvtider kan beräknas från spårpunkters tidsstämplar (inklusive eventuella pauser) och markeras i granskningen. Saknad distans kan härledas från spårpunkter för enskilda varv. Flera varv utan distanssummor avvisas för att undvika fel med kumulativa distanser. Datumavvikelse visas före sparning. Originalets planerade pass och datum ändras inte.


## Uppdateringen november 2026
Mörkt tema, större text/ikoner och två separata veckosummeringar: faktisk löpdistans samt registrerad löp-/spinningtid med uppdelning. StrongLifts förblir enbart planering. TCX-importen är bevarad.

`pnpm test` kontrollerar programstruktur, loggregler, import och summering. `pnpm build` typkontrollerar och bygger PWA:n. `.github/workflows/pages.yml` kör tester och bygge före publicering av `dist/` till Pages. Välj GitHub Actions som källa under Settings → Pages.

Underlag: befintligt originalprojekt och lokala CODEX_BRIEF.md samt träningsprogrammet (kopior i reference/). Library-filen Vinterpuls.txt kunde inte nås med anslutna verktyg. Programdata har behållits oförändrad.
