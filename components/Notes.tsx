import React, { useState } from 'react';
import { Note } from '../types';
import { PlusIcon, TrashIcon } from './icons';

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Recap',
    content: '- Discussed Q3 roadmap.\n- Finalized budget allocation.\n- Assigned action items.',
    lastModified: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: '2',
    title: 'Brainstorming Ideas',
    content: '1. New marketing campaign.\n2. Product feature improvements.\n3. Team offsite event.',
    lastModified: Date.now() - 1000 * 60 * 60 * 24,
  },
];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(initialNotes[0]?.id || null);

  const activeNote = notes.find((note) => note.id === activeNoteId);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.length > 1 ? notes.filter(n => n.id !== id)[0].id : null);
    }
  };

  const handleUpdateNote = (field: 'title' | 'content', value: string) => {
    if (!activeNoteId) return;
    setNotes(
      notes.map((note) =>
        note.id === activeNoteId
          ? { ...note, [field]: value, lastModified: Date.now() }
          : note
      )
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Notes</h2>
      <div className="flex h-[calc(100vh-150px)] bg-secondary rounded-lg">
        <div className="w-1/3 border-r border-border-color flex flex-col">
          <div className="p-4 border-b border-border-color flex justify-between items-center">
            <h3 className="text-xl font-semibold">My Notes</h3>
            <button onClick={handleAddNote} className="text-accent hover:opacity-80 transition-opacity">
                <PlusIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="overflow-y-auto">
            {notes.sort((a, b) => b.lastModified - a.lastModified).map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-4 cursor-pointer border-l-4 ${
                  note.id === activeNoteId
                    ? 'bg-tertiary border-accent'
                    : 'border-transparent hover:bg-tertiary/50'
                }`}
              >
                <h4 className="font-semibold text-text-primary truncate">{note.title}</h4>
                <p className="text-sm text-text-secondary truncate">{note.content || 'No content'}</p>
                <p className="text-xs text-text-secondary mt-1">{new Date(note.lastModified).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 flex flex-col">
          {activeNote ? (
            <>
              <div className="p-4 border-b border-border-color flex justify-between items-center">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateNote('title', e.target.value)}
                  className="bg-transparent text-xl font-semibold w-full focus:outline-none text-text-primary"
                />
                 <button onClick={() => handleDeleteNote(activeNote.id)} className="text-text-secondary hover:text-danger">
                    <TrashIcon className="w-5 h-5" />
                 </button>
              </div>
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateNote('content', e.target.value)}
                className="flex-grow p-4 bg-transparent focus:outline-none text-text-primary resize-none leading-relaxed"
                placeholder="Start writing..."
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              <p>Select a note or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
