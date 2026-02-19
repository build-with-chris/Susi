"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RATING_OPTIONS } from "@/lib/videos/rating";
import { updateRating } from "../actions";

type RatingEditorProps = {
  videoId: string;
  currentRatingTag: string;
  currentCaption: string;
  labelId: string;
};

export function RatingEditor({
  videoId,
  currentRatingTag,
  currentCaption,
  labelId,
}: RatingEditorProps) {
  const router = useRouter();
  const [value, setValue] = useState<string>(
    currentRatingTag?.trim() ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (newTag: string) => {
    setValue(newTag);
    setError(null);
    setSaving(true);
    const result = await updateRating(
      videoId,
      newTag === "" ? null : newTag,
      currentCaption
    );
    setSaving(false);
    if (result.ok) {
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <label
        htmlFor={labelId}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Bewertung
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <select
          id={labelId}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={saving}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white disabled:opacity-50"
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.tag || "none"} value={opt.tag}>
              {opt.label}
            </option>
          ))}
        </select>
        {saving && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Wird gespeichert…
          </span>
        )}
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
