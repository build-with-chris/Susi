-- Projekt-Bilder (PNG, JPG, WebP), herunterskaliert auf HD
-- Migration: 20250219000003_project_images

CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on project_images"
  ON public.project_images FOR SELECT USING (true);

CREATE POLICY "Allow public insert on project_images"
  ON public.project_images FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete on project_images"
  ON public.project_images FOR DELETE USING (true);
