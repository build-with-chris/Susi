-- Bewertung, Postingdatum und Kommentare für Projekt-Bilder (wie bei Videos)
-- Migration: 20250219000004_project_images_rating_comments

-- UPDATE für project_images (Caption, Bewertung, Datum bearbeiten)
DROP POLICY IF EXISTS "Allow public update on project_images" ON public.project_images;
CREATE POLICY "Allow public update on project_images"
  ON public.project_images FOR UPDATE USING (true);

ALTER TABLE public.project_images
  ADD COLUMN IF NOT EXISTS rating_tag text,
  ADD COLUMN IF NOT EXISTS rating_rank integer NOT NULL DEFAULT 999,
  ADD COLUMN IF NOT EXISTS rating_author_name text,
  ADD COLUMN IF NOT EXISTS proposed_post_date date;

CREATE TABLE IF NOT EXISTS public.project_image_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid NOT NULL REFERENCES public.project_images(id) ON DELETE CASCADE,
  comment text NOT NULL,
  author_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_image_comments_image_id ON public.project_image_comments(image_id);

ALTER TABLE public.project_image_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on project_image_comments"
  ON public.project_image_comments FOR SELECT USING (true);

CREATE POLICY "Allow public insert on project_image_comments"
  ON public.project_image_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete on project_image_comments"
  ON public.project_image_comments FOR DELETE USING (true);
