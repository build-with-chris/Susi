import type { Video, VideoComment } from "@/types/database";
import { VideoCard } from "../VideoCard";
import { VideoChefBlock } from "../VideoChefBlock";

type LumenLetterSectionProps = {
  videos: Video[];
  commentsByVideo: Record<string, VideoComment[]>;
};

/** Video aus Supabase erkannt (UUID), nicht aus Ordner (id beginnt mit "lundl-"). */
function isFromSupabase(video: Video): boolean {
  return !video.id.startsWith("lundl-");
}

export function LumenLetterSection({
  videos,
  commentsByVideo,
}: LumenLetterSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mb-10">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <li key={video.id} className="min-w-0">
            {isFromSupabase(video) ? (
              <VideoChefBlock
                video={video}
                comments={commentsByVideo[video.id] ?? []}
              />
            ) : (
              <VideoCard video={video} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
