"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import NoteEditor from "@/components/NoteEditor";
import { createNote, deleteNote, listNotes, updateNote, type Note } from "@/lib/notesApi";
import { getSession } from "@/lib/auth";

export default function Home() {
  const [session, setSession] = useState(getSession());
  const userId = session?.user.id ?? "";
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => notes.find((n) => n.id === selectedId) ?? null, [notes, selectedId]);

  // Load session updates from storage changes (e.g., sign in from nav)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("notes_auth_session_v1")) {
        setSession(getSession());
      }
    };
    window.addEventListener("storage", onStorage);
    const id = setInterval(() => setSession(getSession()), 400);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);

  // Load notes whenever session changes
  useEffect(() => {
    async function load() {
      if (!userId) {
        setNotes([]);
        setSelectedId(null);
        return;
      }
      const data = await listNotes(userId);
      setNotes(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0].id);
      }
    }
    load();
  }, [userId, selectedId]);

  const handleCreate = useCallback(async () => {
    if (!userId) return;
    const newNote = await createNote(userId, { title: "Untitled", content: "" });
    const updated = await listNotes(userId);
    setNotes(updated);
    setSelectedId(newNote.id);
  }, [userId]);

  const handleDelete = useCallback(async (id: string) => {
    if (!userId) return;
    await deleteNote(userId, id);
    const updated = await listNotes(userId);
    setNotes(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id ?? null);
    }
  }, [userId, selectedId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleChange = useCallback(
    async (changes: { title?: string; content?: string }) => {
      if (!userId || !selectedId) return;
      const saved = await updateNote(userId, selectedId, changes);
      if (!saved) return;
      // Update local state immutably
      setNotes((prev) =>
        prev
          .map((n) => (n.id === saved.id ? saved : n))
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      );
    },
    [userId, selectedId]
  );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <TopNav />
      <div className="mx-auto w-full max-w-7xl flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <div className="border-b md:border-b-0 md:border-r border-gray-200 min-h-[40vh] md:min-h-0">
          <Sidebar
            notes={notes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        </div>
        <div className="min-h-[50vh]">
          {session ? (
            <NoteEditor note={selected} onChange={handleChange} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500 p-6 text-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome to Notes</h2>
                <p className="text-sm">
                  Please sign in from the top bar to create and manage your personal notes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
