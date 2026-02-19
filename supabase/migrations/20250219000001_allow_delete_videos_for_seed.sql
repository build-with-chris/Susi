-- Erlaubt Löschen von videos (z. B. für Seed-Skript: alte Einträge aus VideosSusiNeu vor erneutem Einfügen entfernen)
CREATE POLICY "Allow public delete on videos"
  ON public.videos FOR DELETE
  USING (true);
