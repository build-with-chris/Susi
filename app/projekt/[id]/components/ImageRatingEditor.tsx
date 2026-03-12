"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RATING_OPTIONS } from "@/lib/videos/rating";
import { updateImageRating } from "../../actions";

type ImageRatingEditorProps = {
  imageId: string;
  currentRatingTag: string;
  currentCaption: string;
  currentRatingAuthorName?: string | null;
  labelId: string;
};

export function ImageRatingEditor({
  imageId,
  currentRatingTag,
  currentCaption,
  currentRatingAuthorName,
  labelId,
}: ImageRatingEditorProps) {
  const router = useRouter();
  const [value, setValue] = useState<string>(currentRatingTag?.trim() ?? "");
  const [authorName, setAuthorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPendingChange = value !== (currentRatingTag?.trim() ?? "");

  const handleSaveRating = async () => {
    const name = authorName?.trim();
    if (!name) {
      setError("Bitte Ihren Namen eingeben.");
      return;
    }
    setError(null);
    setSaving(true);
    const result = await updateImageRating(
      imageId,
      value === "" ? null : value,
      currentCaption,
      name
    );
    setSaving(false);
    if (result.ok) router.refresh();
    else setError(result.error);
  };

  return (
    <div>
      <label
        htmlFor={labelId}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Bewertung
      </label>
      {currentRatingAuthorName && (
        <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
          Zuletzt bewertet von {currentRatingAuthorName}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <select
          id={labelId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
      </div>
      {hasPendingChange && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
          <label
            htmlFor={`${labelId}-author`}
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ihr Name (Pflicht bei Bewertungsänderung)
          </label>
          <input
            id={`${labelId}-author`}
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="z. B. Max Mustermann"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveRating}
              disabled={saving}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Bewertung speichern
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
