-- Projekte + project_id an videos, Storage-Bucket für Uploads
-- Migration: 20250219000002_projects_and_storage

-- Tabelle: projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- project_id an videos (nullable für bestehende Einträge)
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_videos_project_id ON public.videos(project_id);

-- RLS für projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on projects"
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow public insert on projects"
  ON public.projects FOR INSERT WITH CHECK (true);

-- Storage-Bucket für Projekt-Videos (öffentlicher Lesezugriff)
-- Falls der Bucket schon existiert (z. B. im Dashboard), ignoriert ON CONFLICT.
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-videos', 'project-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Jeder darf in project-videos hochladen und lesen (für Web-App ohne Auth)
CREATE POLICY "Allow public upload to project-videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Allow public read project-videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-videos');

CREATE POLICY "Allow public update in project-videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-videos');

CREATE POLICY "Allow public delete in project-videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-videos');
