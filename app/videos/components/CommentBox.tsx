"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { VideoComment } from "@/types/database";
import { saveComment } from "../actions";

function formatCommentDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type CommentBoxProps = {
  videoId: string;
  comments: VideoComment[];
  labelId: string;
};

export function CommentBox({ videoId, comments, labelId }: CommentBoxProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSaving(true);
    const result = await saveComment(
      videoId,
      text,
      authorName.trim() || null
    );
    setSaving(false);
    if (result.ok) {
      setText("");
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <div>
      <label
        htmlFor={labelId}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Kommentar hinterlassen
      </label>
      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Name (optional)"
        className="mb-2 w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
      />
      <textarea
        id={labelId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Neuen Kommentar schreiben…"
        rows={3}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !text.trim()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600"
        >
          {saving ? "Speichern…" : "Kommentar speichern"}
        </button>
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
      {comments.length > 0 && (
        <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Kommentare (neueste zuerst)
          </h3>
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-lg bg-zinc-50 py-2 px-3 text-sm dark:bg-zinc-800/50"
              >
                <p className="text-zinc-800 dark:text-zinc-200">{c.comment}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {c.author_name && <span>{c.author_name} · </span>}
                  <span>vom {formatCommentDate(c.created_at)}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
