# Supabase-Clients

- **`server.ts`** – Einzige Quelle für DB-Zugriffe in der App. Nutzen in:
  - Server Components (Daten laden)
  - Server Actions (INSERT/UPDATE)
  - Route Handlers (falls benötigt)

- **`client.ts`** – Nur falls clientseitig etwas nötig ist (z. B. Auth-UI, Realtime). **Nicht für Schreibzugriffe auf die DB verwenden** – alle Writes laufen über Server Actions.

So bleiben keine „wilden“ Client-Writes möglich; die App nutzt vorzugsweise serverseitige Zugriffe.
