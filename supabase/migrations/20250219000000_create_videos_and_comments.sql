-- InstaGame: videos + video_comments mit Indizes und updated_at-Trigger
-- Migration: 20250219000000_create_videos_and_comments

-- Tabelle: videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  video_url text NOT NULL,
  caption text NOT NULL,
  rating_tag text NOT NULL,
  rating_rank int NOT NULL,
  proposed_post_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabelle: video_comments
CREATE TABLE IF NOT EXISTS public.video_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  comment text NOT NULL,
  author_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indizes für Abfragen/Sortierung
CREATE INDEX IF NOT EXISTS idx_videos_rating_rank_proposed_post_date
  ON public.videos(rating_rank, proposed_post_date);

CREATE INDEX IF NOT EXISTS idx_video_comments_video_id_created_at
  ON public.video_comments(video_id, created_at);

-- Trigger-Funktion: updated_at bei UPDATE setzen
CREATE OR REPLACE FUNCTION public.set_videos_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger an videos anbinden
DROP TRIGGER IF EXISTS trigger_videos_updated_at ON public.videos;
CREATE TRIGGER trigger_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_videos_updated_at();

-- RLS (Row Level Security) aktivieren – Standard: Lesen erlauben, Schreiben per Policy steuern
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

-- Anon-Key darf lesen (für öffentliche App); Schreiben optional per Policy einschränkbar
CREATE POLICY "Allow public read access on videos"
  ON public.videos FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on video_comments"
  ON public.video_comments FOR SELECT
  USING (true);

-- Optional: Schreiben erlauben (kann später auf Auth umgestellt werden)
CREATE POLICY "Allow public insert on videos"
  ON public.videos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on videos"
  ON public.videos FOR UPDATE
  USING (true);

CREATE POLICY "Allow public insert on video_comments"
  ON public.video_comments FOR INSERT
  WITH CHECK (true);
