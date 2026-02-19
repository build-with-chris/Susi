# Supabase – Migrationen & RLS

## Erste Schritte (Tabellen anlegen + Videos aus Codebase laden)

1. **Tabellen anlegen:** Im [Supabase Dashboard](https://supabase.com/dashboard) dein Projekt öffnen → **SQL Editor** → **New query**. Den kompletten Inhalt der Datei `migrations/20250219000000_create_videos_and_comments.sql` reinkopieren und **Run** klicken.
2. **Videos aus der Codebase in die DB:** Im Projektroot im Terminal ausführen:
   ```bash
   npm run seed:videos
   ```
   Damit werden alle MP4 aus `public/VideosSusiNeu` in die Tabelle `videos` eingetragen (Caption/Bewertung aus Dateinamen). Beim erneuten Ausführen werden zuerst alle Einträge aus diesem Ordner gelöscht, dann neu eingefügt – keine Duplikate mehr.

**Doppelte Videos aufräumen (einmalig):** Falls bereits doppelte Einträge in `videos` sind: Im Supabase Dashboard → SQL Editor den Inhalt von `migrations/one-time-remove-duplicate-videos.sql` ausführen. Danach ggf. noch die Migration `20250219000001_allow_delete_videos_for_seed.sql` ausführen (DELETE-Policy), damit das Seed-Skript künftig vor dem Einfügen aufräumen kann.

## RLS-Strategie (MVP)

- RLS ist **aktiviert**. Policies erlauben für den Anon-Key:
  - **SELECT** auf `videos` und `video_comments`
  - **INSERT** und **UPDATE** auf beide Tabellen (für Chef-Workflow)
- Alle DB-Zugriffe laufen **serverseitig** (Server Components + Server Actions). Es gibt keine clientseitigen Schreibzugriffe auf Supabase.

## Migration ausführen

**Option A – Supabase Dashboard**

1. [Supabase Dashboard](https://supabase.com/dashboard) → dein Projekt
2. **SQL Editor** → New query
3. Inhalt von `migrations/20250219000000_create_videos_and_comments.sql` einfügen und **Run** ausführen

**Option B – Supabase CLI**

```bash
supabase link --project-ref <dein-project-ref>
supabase db push
```

## Env-Variablen

In `.env.local` die echten Werte eintragen (siehe `.env.example`). Den **Anon Key** findest du im Dashboard unter **Settings → API**.
