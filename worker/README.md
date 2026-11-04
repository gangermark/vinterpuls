# Garmin serverdel för Vinterpuls

Cloudflare Worker med Garmins officiella Personal API. Inga användardata lagras. Svaret innehåller bara aktivitetens id, namn, datum, timer-tid, eventuell snittpuls och löpdistans. Position, GPS-spår och övriga hälsodata lämnas inte vidare. Utomhuscykling, styrka och andra aktiviteter filtreras bort. Period: senaste 30 dagarna, högst 500 aktiviteter. En flagga anger om gränsen nåtts.

Skapa en Worker från `index.mjs` och `activities.mjs` eller använd Wrangler med wrangler.jsonc. Lägg två **Secrets** i Cloudflare (aldrig i GitHub):
- `GARMIN_API_KEY`: användarens personliga Garmin-nyckel.
- `APP_ACCESS_TOKEN`: en separat slumpmässig anslutningskod, minst 16 tecken, gärna 32 eller fler från en lösenordshanterare.

`ALLOWED_ORIGIN` är https://gangermark.github.io. Nyckeln och anslutningskoden ska anges och sparas av användaren i Cloudflares skyddade fält. Appen behöver bara Worker-adressen och anslutningskoden, aldrig Garmin-nyckeln. Anslutningskoden ger läsrätt till de filtrerade träningsuppgifterna och ska skyddas som ett lösenord. Byte av koden kopplar bort tidigare enheter. Radera Garmin-nyckeln i Garmin Connect för att återkalla Garmin-åtkomsten.

`GET /status` visar om tjänsten är konfigurerad, utan privata data. `GET /activities` kräver `Authorization: Bearer <anslutningskod>`. Endast fasta Garmin-adresser anropas. API-svar och tokenhantering är testade med simulerad Garmin-server; verklig anslutning måste testas efter att användaren har angett sin nyckel.

Officiell dokumentation:
https://developer.garmin.com/gc-developer-program/personal/personal-api/
https://developer.garmin.com/gc-developer-program/personal/swagger-docs/
