# Skripte

## Videos aus Ordner in Supabase laden (Seed)

Videos aus `public/VideosSusiNeu` werden in die Supabase-Tabelle `videos` eingetragen (Caption und Bewertung aus dem Dateinamen).

**Voraussetzung**

- `.env.local` mit gültigem `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase-Migration ausgeführt (Tabellen `videos` und `video_comments` existieren)

**Aufruf**

```bash
npm run seed:videos
```

Danach erscheinen die Videos auf der Startseite (Sortierung nach Bewertungs-Hashtag).

**Vorschaubilder:** Zu jedem Video wird immer ein Vorschaubild angezeigt. Für lokale MP4 in `public/VideosSusiNeu` kannst du optional eine JPG mit gleichem Dateinamen danebenlegen (z. B. `#stark Motivation.mp4` → `#stark Motivation.jpg`). Fehlt die JPG, wird ein Platzhalter genutzt. YouTube-Videos nutzen automatisch das YouTube-Thumbnail.
