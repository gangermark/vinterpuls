# Flytta loggar till GitHub Pages

Den nya adressen har en annan origin. Webbläsaren låter den inte läsa den gamla adressens IndexedDB. Flytten kräver därför en JSON-export från varje webbläsare/enhet där du registrerat pass.

1. Öppna https://vinterpuls-gustav-2026.gustav-angermark.chatgpt.site i exakt den webbläsare/profil där dina pass finns, eller öppna den gamla installerade appen. Logga in vid behov.
2. Välj **Träningslogg → Exportera**. Spara `vinterpuls-logg.json` på en trygg plats. Kontrollera att filen innehåller dina pass. Dela eller lägg inte exporten i GitHub.
3. Öppna den nya GitHub Pages-adressen. Välj **Träningslogg → Importera** och välj JSON-filen.
4. Kontrollera antal pass, veckornas löpkilometer och tid för löpning/spinning. Ladda om och kontrollera att loggen finns kvar.
5. Besök appen online och låt den ladda färdigt innan du provar offline. Installera den nya adressen på hemskärmen. Gammal och ny installation är separata appar.
6. Behåll originalexporten. Ta bort den gamla genvägen först när du kontrollerat den nya appen. Rensa inte gamla webbplatsdata före verifierad flytt.

Import sammanfogar pass, men samma program-id och pass-id ersätts av den importerade posten. Exportera den nya appens logg före en ytterligare import. Om olika enheter har olika versioner av samma pass, importera den version du vill behålla sist. Olika pass bevaras. Ingen automatisk synkronisering finns.

Om gamla appen ser tom ut: kontrollera rätt enhet, webbläsare och profil. Safari, andra webbläsare och installerade appar kan ha separata lagringsutrymmen. Nya appen kan inte hämta loggar från en annan origin, privat flik eller raderad lagring.

Databasen `vinterpuls`, lagret `entries`, program-id `vinter-2026-12v`, session-id och exportschema 1 har behållits från originalprojektet. Importen validerar hela filen innan någon ändring sparas; spinning med distans och StrongLifts-poster avvisas. Originalappen ändras inte av flytten.
