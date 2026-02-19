-- Einmal ausführen: Doppelte Videos entfernen (behält pro video_url eine Zeile)
-- Im Supabase Dashboard → SQL Editor einfügen und Run

DELETE FROM public.videos a
USING public.videos b
WHERE a.video_url = b.video_url AND a.id > b.id;
