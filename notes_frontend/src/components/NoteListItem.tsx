"use client";

import type { Note } from "@/lib/notesApi";

type Props = {
  note: Note;
  selected?: boolean;
  onClick: () => void;
  onDelete: () => void;
};

/**
 * Renders a single note item in the sidebar list.
 */
export default function NoteListItem({ note, selected, onClick, onDelete }: Props) {
  const itemClass =
    "group flex items-start gap-2 px-3 py-2 border-b border-gray-100 cursor-pointer " +
    (selected ? "bg-blue-50" : "hover:bg-gray-50");

  return (
    <li data-note-id={note.id} className={itemClass} onClick={onClick}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="truncate text-sm font-medium text-gray-900">
            {note.title || "Untitled"}
          </h4>
          <time className="ml-2 flex-shrink-0 text-xs text-gray-500">
            {new Date(note.updatedAt).toLocaleDateString()}
          </time>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
          {note.content || "No content"}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded border border-gray-300 text-gray-700"
        aria-label="Delete note"
        title="Delete note"
      >
        Delete
      </button>
    </li>
  );
}
