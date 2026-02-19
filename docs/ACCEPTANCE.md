# Akzeptanzkriterien & Lieferumfang (Schritt 4)

## Akzeptanzkriterien

- [x] **Seite zeigt alle Videos sortiert nach Bewertungs-Hashtag**  
  `/videos` lädt Videos über `getVideosOverview()` (rating_rank → proposed_post_date → created_at).

- [x] **Chef kann pro Video Kommentare speichern und sofort sehen**  
  Server Action `saveComment`, dann `revalidatePath` + `router.refresh()` → Kommentare erscheinen ohne Reload.

- [x] **Postingdatum ist pro Video änderbar und wird gespeichert**  
  `DateEditor` mit Debounce, Server Action `updateProposedPostDate`, Persistenz in `videos.proposed_post_date`.

- [x] **DB-Schema vorhanden, App funktioniert nach Fresh-Clone (mit .env.local)**  
  Migration in `supabase/migrations/`, README mit Anleitung; `.env.example` als Vorlage für `.env.local`.

**Fresh-Clone:** Repo klonen → `npm install` → `.env.example` nach `.env.local` kopieren, Anon Key eintragen → Migration im Supabase-Dashboard ausführen → optional `npm run seed:videos` → `npm run dev`.

## Lieferumfang

| Bereich | Inhalt |
|--------|--------|
| **SQL-Migration(en)** | `supabase/migrations/20250219000000_create_videos_and_comments.sql` (Tabellen, Indizes, Trigger, RLS) |
| **UI-Seite** | `app/videos/page.tsx` |
| **Komponenten** | `VideoCard`, `VideoList`, `CommentBox`, `DateEditor`, `VideoChefBlock` |
| **Server (GET)** | `getVideosOverview()`, `getCommentsByVideoIds()` in `lib/videos/queries.ts` (nur serverseitig genutzt) |
| **Server (UPDATE/INSERT)** | Server Actions in `app/videos/actions.ts`: `updateProposedPostDate`, `saveComment` |

DB-Zugriffe ausschließlich serverseitig (Server Actions / Server Components); kein direkter Client-Write gegen Supabase.
