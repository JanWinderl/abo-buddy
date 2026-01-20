# SubMate Backend (NestJS + SQLite)

Dieses Backend implementiert Aufgabe 2 mit:

- Vollständiger REST-API (CRUD für Users, Subscriptions, Reminders)
- Rollen-System über Header `x-role` (user, premium, admin)
- Drei Aktionen (A2) unter `/actions`: share, optimize-yearly, toggle
- Jobsystem (A4) unter `/jobs`: Import und Async-Löschen
- Swagger-Dokumentation unter `/api`

## Starten

1. Wechsle in den Ordner `backend`
2. Installiere Abhängigkeiten: `npm install`
3. Entwickeln: `npm run start:dev`
4. Produktion: `npm run build && npm start`

Die API läuft standardmäßig auf `http://localhost:3001`.

## Rollen-Header

Füge in jede Anfrage `x-role: user | premium | admin` hinzu. Beispiel:

```
curl -H "x-role: premium" http://localhost:3001/subscriptions
```

## Beispiele (A2 Aktionen)

- Teilen: `POST /actions/subscriptions/:id/share { "email": "partner@email.com" }`
- Optimieren: `POST /actions/optimize-yearly { "subscriptionId": "<id>", "yearlyDiscountPercent": 20 }`
- Toggle: `POST /actions/subscriptions/:id/toggle`

## Beispiele (A4 Jobs)

- Import: `POST /jobs/import-subscriptions { "items": [ { "name": "Netflix", "price": 12.99, "billingCycle": "monthly", "category": "streaming", "nextBillingDate": "2026-02-01", "userId": "1" } ] }`
  Antwort: `{ status: 202, jobId: "..." }` → Status: `GET /jobs/:jobId`

- Async Delete: `POST /jobs/delete-subscription { "id": "<subscriptionId>" }`
  Antwort: `{ status: 202, jobId: "..." }` → Status: `GET /jobs/:jobId`