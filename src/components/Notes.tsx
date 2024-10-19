import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Lock, Key } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  isLocked: boolean;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState({ title: '', content: '', isLocked: false, password: '', securityQuestion: '', securityAnswer: '' });
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [notePassword, setNotePassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetSecurityAnswer, setResetSecurityAnswer] = useState('');
  const [newNotePassword, setNewNotePassword] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.title.trim() === '' || newNote.content.trim() === '') return;
    setNotes([
      ...notes,
      {
        ...newNote,
        id: Date.now(),
        createdAt: new Date(),
        password: newNote.isLocked ? newNote.password : undefined,
        securityQuestion: newNote.isLocked ? newNote.securityQuestion : undefined,
        securityAnswer: newNote.isLocked ? newNote.securityAnswer : undefined,
      },
    ]);
    setNewNote({ title: '', content: '', isLocked: false, password: '', securityQuestion: '', securityAnswer: '' });
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const toggleNoteLock = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isLocked: !note.isLocked, password: !note.isLocked ? '' : note.password } : note
    ));
  };

  const unlockNote = (id: number, password: string) => {
    const note = notes.find(n => n.id === id);
    if (note && note.password === password) {
      setActiveNoteId(id);
      setNotePassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const startResetPassword = (id: number) => {
    setIsResettingPassword(true);
    setActiveNoteId(id);
  };

  const resetNotePassword = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (note && note.securityAnswer === resetSecurityAnswer) {
      setNotes(notes.map(n => n.id === id ? { ...n, password: newNotePassword } : n));
      setIsResettingPassword(false);
      setResetSecurityAnswer('');
      setNewNotePassword('');
      alert('Password reset successfully');
    } else {
      alert('Incorrect security answer');
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">My Notes</h2>
      <div className="mb-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Note Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <textarea
          placeholder="Note Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
          rows={4}
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="lockNote"
            checked={newNote.isLocked}
            onChange={(e) => setNewNote({ ...newNote, isLocked: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="lockNote" className="text-sm">Lock this note</label>
        </div>
        {newNote.isLocked && (
          <>
            <input
              type="password"
              placeholder="Set note password"
              value={newNote.password}
              onChange={(e) => setNewNote({ ...newNote, password: e.target.value })}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="Security Question"
              value={newNote.securityQuestion}
              onChange={(e) => setNewNote({ ...newNote, securityQuestion: e.target.value })}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="Security Answer"
              value={newNote.securityAnswer}
              onChange={(e) => setNewNote({ ...newNote, securityAnswer: e.target.value })}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
          </>
        )}
        <button
          onClick={addNote}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition duration-300"
        >
          <Plus className="mr-2" /> Add Note
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{note.title}</h3>
              <button
                onClick={() => toggleNoteLock(note.id)}
                className={`${note.isLocked ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300 transition-colors duration-200`}
              >
                <Lock size={20} />
              </button>
            </div>
            {note.isLocked && activeNoteId !== note.id ? (
              <div>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={notePassword}
                  onChange={(e) => setNotePassword(e.target.value)}
                  className="w-full p-2 mb-2 bg-white bg-opacity-20 rounded-lg text-black"
                />
                <button
                  onClick={() => unlockNote(note.id, notePassword)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mr-2"
                >
                  Unlock
                </button>
                <button
                  onClick={() => startResetPassword(note.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Reset Password
                </button>
              </div>
            ) : (
              <p className="mb-4">{note.content}</p>
            )}
            {isResettingPassword && activeNoteId === note.id && (
              <div className="mt-4">
                <p className="mb-2">{note.securityQuestion}</p>
                <input
                  type="text"
                  placeholder="Security Answer"
                  value={resetSecurityAnswer}
                  onChange={(e) => setResetSecurityAnswer(e.target.value)}
                  className="w-full p-2 mb-2 bg-white bg-opacity-20 rounded-lg text-black"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newNotePassword}
                  onChange={(e) => setNewNotePassword(e.target.value)}
                  className="w-full p-2 mb-2 bg-white bg-opacity-20 rounded-lg text-black"
                />
                <button
                  onClick={() => resetNotePassword(note.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Reset Password
                </button>
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>{new Date(note.createdAt).toLocaleString()}</span>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;