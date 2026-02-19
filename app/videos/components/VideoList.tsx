import type { Video, VideoComment } from "@/types/database";
import { groupVideosByRating } from "@/lib/videos/group-by-rating";
import { VideoCard } from "../VideoCard";
import { VideoChefBlock } from "../VideoChefBlock";

type VideoListProps = {
  videos: Video[];
  commentsByVideo: Record<string, VideoComment[]>;
  /** Bei "local" nur Karten (kein Kommentar/Postingdatum), da keine DB. */
  source?: "supabase" | "local";
};

export function VideoList({
  videos,
  commentsByVideo,
  source = "supabase",
}: VideoListProps) {
  const groups = groupVideosByRating(videos);

  return (
    <div className="space-y-10">
      {groups.map(({ label, videos: groupVideos }) => (
        <section key={label}>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {label}
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {groupVideos.map((video) => (
              <li key={video.id} className="min-w-0">
                {source === "local" ? (
                  <VideoCard video={video} />
                ) : (
                  <VideoChefBlock
                    video={video}
                    comments={commentsByVideo[video.id] ?? []}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
