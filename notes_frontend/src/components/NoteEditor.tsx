"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/lib/notesApi";

type Props = {
  note: Note | null;
  onChange: (changes: { title?: string; content?: string }) => void;
};

/**
 * NoteEditor renders editable title and content for a selected note.
 * It debounces change propagation to reduce frequent writes.
 */
export default function NoteEditor({ note, onChange }: Props) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  // Sync local state when the selected note changes.
  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id]);

  // Debounce title changes
  useEffect(() => {
    const id = setTimeout(() => {
      if (note) onChange({ title });
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // Debounce content changes
  useEffect(() => {
    const id = setTimeout(() => {
      if (note) onChange({ content });
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!note) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Select or create a note to get started.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-3 text-xl font-semibold border-b border-gray-200 focus:outline-none"
      />
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full p-3 text-base leading-6 focus:outline-none"
      />
      <div className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
        <span>Last updated: {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : "—"}</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden /> Auto-saved
        </span>
      </div>
    </div>
  );
}
