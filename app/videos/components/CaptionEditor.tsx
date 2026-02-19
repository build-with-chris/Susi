"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateCaption } from "../actions";

type CaptionEditorProps = {
  videoId: string;
  initialCaption: string;
  labelId: string;
};

export function CaptionEditor({
  videoId,
  initialCaption,
  labelId,
}: CaptionEditorProps) {
  const router = useRouter();
  const [caption, setCaption] = useState(initialCaption);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSaving(true);
    const result = await updateCaption(videoId, caption);
    setSaving(false);
    if (result.ok) router.refresh();
    else setError(result.error);
  }

  return (
    <div>
      <label
        htmlFor={labelId}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Caption
      </label>
      <textarea
        id={labelId}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption einfügen oder bearbeiten…"
        rows={4}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600"
        >
          {saving ? "Speichern…" : "Caption speichern"}
        </button>
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
    </div>
  );
}
