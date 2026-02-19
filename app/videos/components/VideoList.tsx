import type { Video, VideoComment } from "@/types/database";
import { VideoCard } from "../VideoCard";
import { VideoChefBlock } from "../VideoChefBlock";

type VideoListProps = {
  videos: Video[];
  commentsByVideo: Record<string, VideoComment[]>;
  /** "supabase" = alle ChefBlock, "local" = alle nur Karte, "mixed" = pro Video: Supabase → ChefBlock, sonst Karte */
  source?: "supabase" | "local" | "mixed";
};

function isFromSupabase(video: Video): boolean {
  return !video.id.startsWith("lundl-");
}

export function VideoList({
  videos,
  commentsByVideo,
  source = "supabase",
}: VideoListProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <li key={video.id} className="min-w-0">
          {source === "local" ? (
            <VideoCard video={video} />
          ) : source === "mixed" ? (
            isFromSupabase(video) ? (
              <VideoChefBlock
                video={video}
                comments={commentsByVideo[video.id] ?? []}
              />
            ) : (
              <VideoCard video={video} />
            )
          ) : (
            <VideoChefBlock
              video={video}
              comments={commentsByVideo[video.id] ?? []}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
