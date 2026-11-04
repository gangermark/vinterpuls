# Codex-underlag: Vinterträning

Bygg en svensk, mobilanpassad och neutral PWA för träningsplanering, genomförda pass och statistik. Använd program.json som datakälla. Detta paket är byggunderlag, inte en färdig app.

## Funktioner
- Idag, veckoplan för 12 veckor, passdetaljer, träningslogg och statistik.
- StrongLifts visas enbart som informationskort på tisdag och torsdag. Ingen avprickning, träningslogg, vikt-, set- eller repetitionsregistrering och ingen styrkeprogression för dessa pass.
- Fredagens löpstyrka har endast enkel avprickning.
- Löpning och spinning kan loggas med distans (löpning), tid, valfri snittpuls, upplevd ansträngning och anteckning.
- Ingen registrering av höftstatus eller smärta. Inga skade- eller rehabiliteringsfrågor, hälsorelaterade varningar eller påminnelser. Håll text och gränssnitt neutrala.
- ”Spinning istället” visar alternativet och sparar faktisk aktivitet. Spinning ger aldrig löpkilometer. Bevara det ursprungliga planerade passet.
- Statistik visar faktisk löpdistans, träningstid och genomförda löp-/spinningpass; löpstyrkans avprickning kan visas separat. Informationskort för StrongLifts och vila räknas inte som loggade pass.

## Teknik
React, TypeScript och Vite; IndexedDB för lokal logg; webbmanifest och service worker för installation och offline-stöd. Publicering på GitHub Pages med korrekt base-sökväg. Ingen server eller inloggning behövs. Tillgängliga formulär och stora tryckytor. Export/import av logg som JSON. Håll programdata åtskild från genomförandelogg så framtida program kan importeras.

## Datakontrakt och acceptans
Respektera loggingMode: none, checkbox eller full. Spara logg per session-id och program-id. Lägg till stabilt program-id i implementationen. Datum är lokala kalenderdatum. Visa programmets första vecka när dagens datum ligger utanför perioden, med tydlig datummärkning.
Kontrollera att 12 veckor och 84 dagar visas, att StrongLifts inte öppnar registrering, att fredag endast kan prickas av, att spinning inte ökar löpvolym och att sparad logg finns kvar efter omladdning och offline. Testa även export/import och mobilvy.
