"use client";

import { useEffect, useMemo, useState } from "react";
import { Note } from "@/lib/notesApi";
import NoteListItem from "./NoteListItem";

type Props = {
  notes: Note[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
};

export default function Sidebar({ notes, selectedId, onSelect, onCreate, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  useEffect(() => {
    // Scroll the selected item into view if needed
    const el = document.querySelector(`[data-note-id="${selectedId}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  return (
    <aside className="h-full w-full flex flex-col border-r border-gray-200 bg-white">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <input
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          />
          <button
            onClick={onCreate}
            className="px-3 py-2 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            New
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No notes yet.</div>
        ) : (
          <ul>
            {filtered.map((n) => (
              <NoteListItem
                key={n.id}
                note={n}
                selected={n.id === selectedId}
                onClick={() => onSelect(n.id)}
                onDelete={() => onDelete(n.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
