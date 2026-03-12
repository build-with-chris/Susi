-- Einmalig im Supabase Dashboard ausführen:
-- Projekt → SQL Editor → New query → diesen Inhalt einfügen → Run
-- (Erstellt Tabelle projects, Spalte project_id an videos, Storage-Bucket + Policies)

-- 1) Tabelle projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) project_id an videos
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_videos_project_id ON public.videos(project_id);

-- 3) RLS für projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on projects" ON public.projects;
CREATE POLICY "Allow public read on projects"
  ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on projects" ON public.projects;
CREATE POLICY "Allow public insert on projects"
  ON public.projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on projects" ON public.projects;
CREATE POLICY "Allow public delete on projects"
  ON public.projects FOR DELETE USING (true);

-- 4) Storage-Bucket (falls noch nicht vorhanden)
-- Ohne file_size_limit = Supabase-Standard (oft 50 MB). Optional danach Limit setzen (siehe unten).
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-videos', 'project-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Optional: Max. Dateigröße setzen (z. B. 500 MB). Einmal ausführen, wenn gewünscht.
-- UPDATE storage.buckets SET file_size_limit = 524288000 WHERE id = 'project-videos';

-- 5) Storage-Policies (alte ggf. zuerst löschen)
DROP POLICY IF EXISTS "Allow public upload to project-videos" ON storage.objects;
CREATE POLICY "Allow public upload to project-videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-videos');

DROP POLICY IF EXISTS "Allow public read project-videos" ON storage.objects;
CREATE POLICY "Allow public read project-videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-videos');

DROP POLICY IF EXISTS "Allow public update in project-videos" ON storage.objects;
CREATE POLICY "Allow public update in project-videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-videos');

DROP POLICY IF EXISTS "Allow public delete in project-videos" ON storage.objects;
CREATE POLICY "Allow public delete in project-videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-videos');

-- 6) Bewertung mit Namen verknüpfen (wer hat die aktuelle Bewertung gesetzt)
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS rating_author_name text;

-- 7) Passwortschutz pro Projekt (wie Conception)
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS password_protected boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS password_hash text;
COMMENT ON COLUMN public.projects.password_protected IS 'Wenn true, muss beim Aufruf des Projekts ein Passwort eingegeben werden.';
COMMENT ON COLUMN public.projects.password_hash IS 'bcrypt-Hash des Projektpassworts; nur gesetzt wenn password_protected = true.';

-- Bestehende Projekte entsperren (kein Passwort): Einmal ausführen, wenn alle Projekte plötzlich passwortgeschützt erscheinen.
-- UPDATE public.projects SET password_protected = false, password_hash = null;
